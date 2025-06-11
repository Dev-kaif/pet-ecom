/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/backend/lib/mongodb";
import GalleryImage from "@/backend/models/Gallery";
import { IGalleryImage } from "@/types";
import { authenticateAndAuthorize } from "@/backend/lib/auth";

export async function GET(request: NextRequest) {
  await dbConnect();

  try {
    const searchParams = request.nextUrl.searchParams;

    // Pagination parameters remain
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "9"); // Default 9 for 3x3 grid

    // Sorting parameters remain
    const sortField = searchParams.get("sortField") || "createdAt";
    const sortOrder = searchParams.get("sortOrder") === "asc" ? 1 : -1;

    // The query object is now empty as no filters are applied
    const query: any = {};

    const totalGalleryEntries = await GalleryImage.countDocuments(query); // Count of documents

    const skip = (page - 1) * limit;
    const galleryEntriesFromDb = await GalleryImage.find(query)
      .skip(skip)
      .limit(limit)
      .sort({ [sortField]: sortOrder });

    // Corrected mapping to IGalleryImage
    const galleryData: IGalleryImage[] = galleryEntriesFromDb.map((entry) => {
      const plainEntry = entry.toObject({ getters: true, virtuals: true });

      const entryObject: IGalleryImage = {
        ...plainEntry,
        _id: plainEntry._id.toString(),
        createdAt: plainEntry.createdAt
          ? new Date(plainEntry.createdAt).toISOString()
          : undefined,
        updatedAt: plainEntry.updatedAt
          ? new Date(plainEntry.updatedAt).toISOString()
          : undefined,
        imageUrl: plainEntry.imageUrl, // Access as a single string
      };
      return entryObject;
    });

    return NextResponse.json(
      {
        success: true,
        data: galleryData,
        pagination: {
          currentPage: page,
          totalPages: Math.ceil(totalGalleryEntries / limit),
          totalItems: totalGalleryEntries,
          limit: limit,
        },
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Error fetching gallery entries:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch gallery entries.",
        error: error.message,
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  // Use the authentication and authorization middleware for admin access
  const authResult = await authenticateAndAuthorize(request, "admin");

  // If authentication/authorization fails, return the response from the middleware
  if (authResult.response) {
    return authResult.response;
  }

  await dbConnect();

  try {
    // Expect the request body to be a single object containing a single imageUrl string
    const { imageUrl }: { imageUrl: string } = await request.json();

    // Basic validation for the single imageUrl
    if (!imageUrl) {
      return NextResponse.json(
        { success: false, message: "Image URL is required." },
        { status: 400 }
      );
    }
    if (
      typeof imageUrl !== "string" ||
      !/^https?:\/\/.+\.(jpg|jpeg|png|gif|webp|svg)$/i.test(imageUrl)
    ) {
      return NextResponse.json(
        { success: false, message: "Invalid image URL format." },
        { status: 400 }
      );
    }

    const newGalleryEntry = await GalleryImage.create({
      imageUrl, // Save the single URL directly
    });

    return NextResponse.json(
      {
        success: true,
        data: newGalleryEntry.toObject({ getters: true, virtuals: true }),
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Error creating gallery entry:", error);
    if (error.name === "ValidationError") {
      return NextResponse.json(
        { success: false, message: error.message, errors: error.errors },
        { status: 400 }
      );
    }
    return NextResponse.json(
      {
        success: false,
        message: "Failed to create gallery entry.",
        error: error.message,
      },
      { status: 500 }
    );
  }
}
