// src/app/api/gallery/[id]/route.ts
/* eslint-disable @typescript-eslint/no-explicit-any */
import mongoose from "mongoose";
import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/backend/lib/mongodb"; // Assuming this path is correct
import GalleryImage from "@/backend/models/Gallery"; // Import your GalleryImage model
import { IGalleryImage } from "@/types"; // Import your IGalleryImage type
import { authenticateAndAuthorize } from "@/backend/lib/auth"; // Assuming you have this middleware

export async function GET(request: NextRequest, context: any) {
  await dbConnect();
  const { params } = context;
  const { id } = params; // Get the ID from the URL parameters

  // Validate if the provided ID is a valid Mongoose ObjectId format
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return NextResponse.json(
      { success: false, message: "Invalid Gallery Image ID format." },
      { status: 400 }
    );
  }

  try {
    // Find the gallery image by its ID
    const galleryImageFromDb = await GalleryImage.findById(id);

    // If no image is found, return a 404
    if (!galleryImageFromDb) {
      return NextResponse.json(
        { success: false, message: "Gallery image not found." },
        { status: 404 }
      );
    }

    // Convert the Mongoose document to a plain JavaScript object and ensure type compatibility
    const plainImage = galleryImageFromDb.toObject({ getters: true, virtuals: true });
    const galleryImage: IGalleryImage = {
      ...plainImage,
      _id: plainImage._id.toString(), // Ensure _id is a string
      createdAt: plainImage.createdAt ? new Date(plainImage.createdAt).toISOString() : undefined,
      updatedAt: plainImage.updatedAt ? new Date(plainImage.updatedAt).toISOString() : undefined,
      imageUrl: plainImage.imageUrl, // Access as a single string
    };

    return NextResponse.json({ success: true, data: galleryImage }, { status: 200 });
  } catch (error: any) {
    console.error("Error fetching gallery image by ID:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch gallery image.",
        error: error.message,
      },
      { status: 500 }
    );
  }
}

// PUT method to update a single gallery image by ID
export async function PUT(request: NextRequest, context: any) {
  // Authenticate and authorize: only an admin can update gallery images
  const authResult = await authenticateAndAuthorize(request, "admin");
  if (authResult.response) {
    return authResult.response;
  }

  await dbConnect();
  const { params } = context;
  const { id } = params; // Get the ID from the URL parameters

  // Validate if the provided ID is a valid Mongoose ObjectId format
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return NextResponse.json(
      { success: false, message: "Invalid Gallery Image ID format." },
      { status: 400 }
    );
  }

  try {
    // Expect the request body to be an object with an 'imageUrl' string
    const body: Partial<IGalleryImage> = await request.json(); // Use Partial as not all fields might be updated
    const { imageUrl } = body;

    // Build the update object dynamically
    const updateFields: Partial<IGalleryImage> = {};
    if (imageUrl !== undefined) {
      // Basic validation for the single imageUrl
      if (typeof imageUrl !== 'string' || !/^https?:\/\/.+\.(jpg|jpeg|png|gif|webp|svg)$/i.test(imageUrl)) {
          return NextResponse.json(
              { success: false, message: "Invalid image URL format." },
              { status: 400 }
          );
      }
      updateFields.imageUrl = imageUrl;
    } else {
        // If imageUrl is not provided for update, return an error as it's the main field
        return NextResponse.json(
            { success: false, message: "Image URL is required for update." },
            { status: 400 }
        );
    }

    // Always update `updatedAt` for consistency (handled by timestamps: true in schema)
    // No explicit updateFields.updatedAt needed if timestamps: true is used with findByIdAndUpdate

    // Find and update the gallery image by ID
    const updatedGalleryImage = await GalleryImage.findByIdAndUpdate(
      id,
      updateFields,
      { new: true, runValidators: true } // `new: true` returns the updated document; `runValidators` runs schema validators
    );

    // If no image is found for update, return a 404
    if (!updatedGalleryImage) {
      return NextResponse.json(
        { success: false, message: "Gallery image not found for update." },
        { status: 404 }
      );
    }

    // Convert updated Mongoose document to IGalleryImage for consistent response
    const plainUpdatedImage = updatedGalleryImage.toObject({ getters: true, virtuals: true });
    const finalUpdatedImage: IGalleryImage = {
      ...plainUpdatedImage,
      _id: plainUpdatedImage._id.toString(),
      createdAt: plainUpdatedImage.createdAt ? new Date(plainUpdatedImage.createdAt).toISOString() : undefined,
      updatedAt: plainUpdatedImage.updatedAt ? new Date(plainUpdatedImage.updatedAt).toISOString() : undefined,
      imageUrl: plainUpdatedImage.imageUrl,
    };

    return NextResponse.json(
      { success: true, data: finalUpdatedImage },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Error updating gallery image:", error);
    if (error.name === "ValidationError") {
      // Handle Mongoose validation errors
      return NextResponse.json(
        { success: false, message: error.message, errors: error.errors },
        { status: 400 }
      );
    }
    return NextResponse.json(
      {
        success: false,
        message: "Failed to update gallery image.",
        error: error.message,
      },
      { status: 500 }
    );
  }
}

// DELETE method to delete a single gallery image by ID
export async function DELETE(request: NextRequest, context: any) {
  // Authenticate and authorize: only an admin can delete gallery images
  const authResult = await authenticateAndAuthorize(request, "admin");
  if (authResult.response) {
    return authResult.response;
  }

  await dbConnect();
  const { params } = context;
  const { id } = params; // Get the ID from the URL parameters

  // Validate if the provided ID is a valid Mongoose ObjectId format
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return NextResponse.json(
      { success: false, message: "Invalid Gallery Image ID format." },
      { status: 400 }
    );
  }

  try {
    // Find and delete the gallery image by ID
    const deletedGalleryImage = await GalleryImage.findByIdAndDelete(id);

    // If no image is found for deletion, return a 404
    if (!deletedGalleryImage) {
      return NextResponse.json(
        { success: false, message: "Gallery image not found for deletion." },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: {} }, { status: 200 });
  } catch (error: any) {
    console.error("Error deleting gallery image:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to delete gallery image.",
        error: error.message,
      },
      { status: 500 }
    );
  }
}
