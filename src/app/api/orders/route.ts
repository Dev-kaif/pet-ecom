// src/app/api/orders/route.ts

/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/backend/lib/mongodb";
import Order from "@/backend/models/Order";
import Cart from "@/backend/models/Cart";
import { authenticateAndAuthorize } from "@/backend/lib/auth";
import {
  IAddress,
  PaymentMethod,
  IOrder,
  OrderStatus,
  PaymentStatus,
  IProduct,
} from "@/types";
import { Types } from "mongoose";

import {
  calculateCartSummary,
  validateStockForOrder,
  deductStock,
} from "@/backend/lib/pricingService";
import { IPopulatedCartItem, IStockOperationItem } from "@/types";

export async function GET(request: NextRequest) {
  const authResult = await authenticateAndAuthorize(request);
  if (authResult.response) return authResult.response;
  const authenticatedUser = authResult.user!;

  await dbConnect();

  try {
    const query: any = {};
    if (authenticatedUser.role !== "admin") {
      query.userId = authenticatedUser.id;
    }

    const orders = await Order.find(query)
      .sort({ createdAt: -1 })
      .populate("userId", "name email");

    return NextResponse.json({ success: true, data: orders }, { status: 200 });
  } catch (error: any) {
    console.error("Error fetching orders:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch orders.",
        error: error.message,
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  const authResult = await authenticateAndAuthorize(request);
  if (authResult.response) return authResult.response;
  const authenticatedUser = authResult.user!;

  await dbConnect();


  try {
    const body: { shippingAddress: IAddress; paymentMethod: PaymentMethod } =
      await request.json();
    const { shippingAddress, paymentMethod } = body;

    if (
      !shippingAddress ||
      !shippingAddress.street ||
      !shippingAddress.city ||
      !shippingAddress.zipCode ||
      !shippingAddress.country
    ) {
      // await session.abortTransaction(); session.endSession();
      return NextResponse.json(
        { success: false, message: "Incomplete shipping address provided." },
        { status: 400 }
      );
    }
    if (!paymentMethod) {
      // await session.abortTransaction(); session.endSession();
      return NextResponse.json(
        { success: false, message: "Payment method is required." },
        { status: 400 }
      );
    }

    const cart = await Cart.findOne({ userId: authenticatedUser.id })
      .populate({
        path: "items.productId",
        model: "Product",
        select: "name price stock images",
      })
      .lean();

    if (!cart || cart.items.length === 0) {
      // await session.abortTransaction(); session.endSession();
      return NextResponse.json(
        { success: false, message: "Cart is empty. Cannot create an order." },
        { status: 400 }
      );
    }

    // --- FIX START ---
    const populatedAndFilteredCartItems: IPopulatedCartItem[] = [];

    for (const item of cart.items) {
      const populatedProduct = item.productId as IProduct | null | undefined;

      if (
        populatedProduct &&
        populatedProduct._id &&
        typeof populatedProduct.price === "number" &&
        typeof populatedProduct.stock === "number" &&
        Array.isArray(populatedProduct.images) &&
        item.quantity !== undefined
      ) {
        populatedAndFilteredCartItems.push({
          _id: item._id,
          productId: populatedProduct,
          quantity: item.quantity,
        });
      } else {
        // If any item is invalid, we might want to prevent the order or handle it specifically.
        // For an order, blocking is usually safer.
        console.error(
          `Invalid cart item found during order creation for cart ID ${cart._id}: Product missing or invalid for item _id ${item._id}`
        );
        // await session.abortTransaction(); session.endSession();
        return NextResponse.json(
          {
            success: false,
            message: `Product data for one or more cart items is invalid or missing. Please review your cart. (Item ID: ${item._id})`,
          },
          { status: 400 }
        );
      }
    }

    if (populatedAndFilteredCartItems.length === 0) {
      // This case should ideally be caught by the cart.items.length === 0 check,
      // but good as a fail-safe if all items are filtered out.
      // await session.abortTransaction(); session.endSession();
      return NextResponse.json(
        {
          success: false,
          message:
            "All items in your cart are invalid or no longer exist. Cannot create an order.",
        },
        { status: 400 }
      );
    }
    // --- FIX END ---

    const itemsForStockOps: IStockOperationItem[] =
      populatedAndFilteredCartItems.map((item) => ({
        productId: item.productId._id!.toString(),
        quantity: item.quantity,
      }));

    await validateStockForOrder(itemsForStockOps);

    const finalSummary = await calculateCartSummary(
      populatedAndFilteredCartItems
    );

    if (finalSummary.errors && finalSummary.errors.length > 0) {
      // await session.abortTransaction(); session.endSession();
      return NextResponse.json(
        {
          success: false,
          message:
            "Error finalizing order calculation. Some products may have issues.",
          details: finalSummary.errors,
        },
        { status: 400 }
      );
    }

    const newOrder: Omit<
      IOrder,
      "_id" | "createdAt" | "updatedAt" | "deliveredAt" | "paidAt"
    > = {
      userId: new Types.ObjectId(authenticatedUser.id),
      items: finalSummary.itemsDetails.map((item) => ({
        productId: new Types.ObjectId(item.productId),
        name: item.name,
        imageUrl: item.imageUrl,
        price: item.price,
        quantity: item.quantity,
      })),
      shippingAddress: shippingAddress,
      totalPrice: finalSummary.totalPrice,
      shippingPrice: finalSummary.shippingPrice,
      taxPrice: finalSummary.taxPrice,
      orderStatus: "pending" as OrderStatus,
      paymentMethod: paymentMethod,
      isPaid: false,
      paymentStatus: (paymentMethod === "cash_on_delivery"
        ? "pending"
        : "pending") as PaymentStatus,
    };

    const createdOrder = await Order.create(newOrder); // { session }

    await deductStock(itemsForStockOps); // { session }

    await Cart.findByIdAndDelete(cart._id); // { session }

    // await session.commitTransaction();
    // session.endSession();

    return NextResponse.json(
      { success: true, data: createdOrder },
      { status: 201 }
    );
  } catch (error: any) {
    // await session.abortTransaction();
    // session.endSession();

    console.error("Error creating order:", error);
    if (error.message.includes("Insufficient stock")) {
      return NextResponse.json(
        { success: false, message: error.message },
        { status: 400 }
      );
    }
    if (error.name === "ValidationError") {
      return NextResponse.json(
        { success: false, message: error.message, errors: error.errors },
        { status: 400 }
      );
    }
    return NextResponse.json(
      {
        success: false,
        message: "Failed to create order.",
        error: error.message,
      },
      { status: 500 }
    );
  }
}
