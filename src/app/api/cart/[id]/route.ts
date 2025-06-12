/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/backend/lib/mongodb";
import Cart from "@/backend/models/Cart";
import Product from "@/backend/models/Product";
import { authenticateAndAuthorize } from "@/backend/lib/auth";
import mongoose from "mongoose";
export async function PUT(request: NextRequest, context: any) {
  const authResult = await authenticateAndAuthorize(request);
  if (authResult.response) return authResult.response;
  const authenticatedUser = authResult.user!;

  await dbConnect();
  const { id } = await context.params; 
  const itemId = id;

  if (!mongoose.Types.ObjectId.isValid(itemId)) {
    return NextResponse.json(
      { success: false, message: "Invalid Cart Item ID format." },
      { status: 400 }
    );
  }

  try {
    const { quantity }: { quantity: number } = await request.json();

    if (typeof quantity !== "number" || quantity < 0) {
      return NextResponse.json(
        { success: false, message: "Quantity must be a non-negative number." },
        { status: 400 }
      );
    }

    const cart = await Cart.findOne({ userId: authenticatedUser.id });
    if (!cart) {
      return NextResponse.json(
        { success: false, message: "Cart not found for this user." },
        { status: 404 }
      );
    }

    const existingItem = cart.items.id(itemId);
    if (!existingItem) {
      return NextResponse.json(
        { success: false, message: "Item not found in cart." },
        { status: 404 }
      );
    }

    const product = await Product.findById(existingItem.productId);
    if (!product) {
      cart.items.pull({ _id: itemId });
      await cart.save();
      return NextResponse.json(
        {
          success: false,
          message: "Product no longer exists. Item removed from cart.",
        },
        { status: 404 }
      );
    }

    if (quantity === 0) {
      cart.items.pull({ _id: itemId });
    } else {
      if (product.stock! < quantity) {
        return NextResponse.json(
          {
            success: false,
            message: `Insufficient stock for ${product.name}. Available: ${product.stock}`,
          },
          { status: 400 }
        );
      }
      existingItem.quantity = quantity;
    }

    await cart.save();

    return NextResponse.json({ success: true, data: cart }, { status: 200 });
  } catch (error: any) {
    console.error("Error updating cart item quantity:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to update cart item quantity.",
        error: error.message,
      },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest, context: any) {
  
  const authResult = await authenticateAndAuthorize(request);
  if (authResult.response) return authResult.response;
  const authenticatedUser = authResult.user!;

  await dbConnect();
  const { id } = await context.params; 
  const itemId = id;

  if (!mongoose.Types.ObjectId.isValid(itemId)) {
    return NextResponse.json(
      { success: false, message: "Invalid Cart Item ID format." },
      { status: 400 }
    );
  }

  try {
    const cart = await Cart.findOne({ userId: authenticatedUser.id });
    if (!cart) {
      return NextResponse.json(
        { success: false, message: "Cart not found for this user." },
        { status: 404 }
      );
    }

    const existingItem = cart.items.id(itemId);
    if (!existingItem) {
      return NextResponse.json(
        {
          success: false,
          message: "Item not found in cart or already removed.",
        },
        { status: 404 }
      );
    }

    cart.items.pull({ _id: itemId });
    await cart.save();

    return NextResponse.json(
      { success: true, message: "Item removed from cart." },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Error removing cart item:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to remove cart item.",
        error: error.message,
      },
      { status: 500 }
    );
  }
}
