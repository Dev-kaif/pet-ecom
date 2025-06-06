/* eslint-disable @typescript-eslint/no-explicit-any */
// src/app/api/wishlist/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/backend/lib/mongodb";
import Wishlist from "@/backend/models/Wishlist";
import { authenticateAndAuthorize } from "@/backend/lib/auth";
import mongoose from "mongoose";


export async function DELETE(request: NextRequest, context: any) {
  const authResult = await authenticateAndAuthorize(request);
  if (authResult.response) return authResult.response;
  const authenticatedUser = authResult.user!;

  await dbConnect();
  const { params } = context;
  const productIdToRemove = params.id;

  if (!mongoose.Types.ObjectId.isValid(productIdToRemove)) {
    return NextResponse.json(
      { success: false, message: "Invalid Product ID format." },
      { status: 400 }
    );
  }

  try {
    const updatedWishlist = await Wishlist.findOneAndUpdate(
      {
        userId: authenticatedUser.id,
        "items.productId": new mongoose.Types.ObjectId(productIdToRemove), // Ensure product exists in items array
      },
      {
        $pull: {
          items: { productId: new mongoose.Types.ObjectId(productIdToRemove) }, // Remove the item from the 'items' array
        },
      },
      { new: true }
    );

    if (!updatedWishlist) {
      return NextResponse.json(
        {
          success: false,
          message: "Product not found in wishlist or wishlist not found.",
        },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { success: true, message: "Product removed from wishlist successfully." },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Error removing product from wishlist:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to remove product from wishlist.",
        error: error.message,
      },
      { status: 500 }
    );
  }
}
