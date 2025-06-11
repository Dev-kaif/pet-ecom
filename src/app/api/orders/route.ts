/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/backend/lib/mongodb";
import Order from "@/backend/models/Order";
import Cart from "@/backend/models/Cart";
import Product from "@/backend/models/Product";
import { authenticateAndAuthorize } from "@/backend/lib/auth";
import { IAddress, IOrderItem, PaymentMethod, IProduct as BackendIProduct } from "@/types"; 
import mongoose, { Document as MongooseDocument, Types } from "mongoose";

export async function GET(request: NextRequest) {
  const authResult = await authenticateAndAuthorize(request);
  if (authResult.response) return authResult.response;
  const authenticatedUser = authResult.user!;

  await dbConnect();

  try {
    // Admins can see all orders, users only their own
    const query: any = {};
    if (authenticatedUser.role !== "admin") {
      query.userId = authenticatedUser.id;
    }

    const orders = await Order.find(query)
      .sort({ createdAt: -1 })
      .populate("userId", "name email"); // Populate user info
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

    // 1. Validate incoming data
    if (!shippingAddress || !paymentMethod) {
      return NextResponse.json(
        {
          success: false,
          message: "Shipping address and payment method are required.",
        },
        { status: 400 }
      );
    }
    if (
      !shippingAddress.street ||
      !shippingAddress.city ||
      !shippingAddress.zipCode ||
      !shippingAddress.country
    ) {
      return NextResponse.json(
        { success: false, message: "Incomplete shipping address." },
        { status: 400 }
      );
    }

    // 2. Get user's cart
    const cart = await Cart.findOne({ userId: authenticatedUser.id });
    if (!cart || cart.items.length === 0) {
      return NextResponse.json(
        { success: false, message: "Cart is empty. Cannot create an order." },
        { status: 400 }
      );
    }

    // 3. Prepare order items (snapshot of product details to prevent future changes affecting past orders)
    const orderItems: IOrderItem[] = [];
    let calculatedTotalPrice = 0;

    for (const cartItem of cart.items) {
      const product: (BackendIProduct & MongooseDocument) | null = // Use BackendIProduct alias
        await Product.findById(cartItem.productId);

      if (!product) {
        return NextResponse.json(
          {
            success: false,
            message: `Product "${cartItem.name}" not found. Please review your cart.`,
          },
          { status: 404 }
        );
      }
      // Ensure product has images before attempting to access
      if (!product.images || product.images.length === 0) {
        return NextResponse.json(
          {
            success: false,
            message: `Product "${product.name}" is missing image data. Cannot create order.`,
          },
          { status: 400 }
        );
      }

      if (product.stock !== undefined && product.stock < cartItem.quantity) {
        return NextResponse.json(
          {
            success: false,
            message: `Insufficient stock for "${product.name}". Only ${product.stock} available.`,
          },
          { status: 400 }
        );
      }

      orderItems.push({
        productId: product._id as Types.ObjectId,
        name: product.name,
        imageUrl: product.images[0] || "/images/placeholder-product.jpg",
        price: product.price,
        quantity: cartItem.quantity,
      });

      calculatedTotalPrice += product.price * cartItem.quantity;
    }

    // 4. Calculate shipping, tax (simple examples)
    const shippingPrice = calculatedTotalPrice > 100 ? 0 : 10; // Free shipping over $100
    const taxRate = 0.05; // 5% tax
    const taxPrice = calculatedTotalPrice * taxRate;
    const finalTotalPrice = calculatedTotalPrice + shippingPrice + taxPrice;

    // 5. Create the order
    const newOrder = {
      userId: new mongoose.Types.ObjectId(authenticatedUser.id),
      items: orderItems,
      shippingAddress: shippingAddress,
      totalPrice: finalTotalPrice,
      shippingPrice: shippingPrice,
      taxPrice: taxPrice,
      orderStatus: "pending", // Default status
      paymentMethod: paymentMethod,
      isPaid: true, // For now, assume not paid until manually updated by admin or separate process
      paymentStatus:
        paymentMethod === "cash_on_delivery" ? "pending" : "pending", // All non-COD start as 'pending' payment
    };

    const createdOrder = await Order.create(newOrder);

    // 6. Update product stock
    for (const item of orderItems) {
      await Product.findByIdAndUpdate(item.productId, {
        $inc: { stock: -item.quantity },
      });
    }

    // 7. Clear the cart after successful order creation
    await Cart.findByIdAndDelete(cart._id); // Or cart.items = []; cart.save();

    return NextResponse.json(
      { success: true, data: createdOrder },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Error creating order:", error);
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
