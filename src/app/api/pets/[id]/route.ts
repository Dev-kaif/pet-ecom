// src/app/api/pets/[id]/route.ts
/* eslint-disable @typescript-eslint/no-explicit-any */
import mongoose from "mongoose";
import { IPet } from "@/types";
import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/backend/lib/mongodb";
import Pet from "@/backend/models/Pet";
import { authenticateAndAuthorize } from "@/backend/lib/auth";

export async function GET(request: NextRequest, context: any) {
  await dbConnect();
  const { params } = context;
  const { id } = params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return NextResponse.json(
      { success: false, message: "Invalid Pet ID format." },
      { status: 400 }
    );
  }

  try {
    const petFromDb = await Pet.findById(id);
    if (!petFromDb) {
      return NextResponse.json(
        { success: false, message: "Pet not found." },
        { status: 404 }
      );
    }

    const plainPet = petFromDb.toObject({ getters: true, virtuals: true });
    const pet: IPet = {
      ...plainPet,
      _id: plainPet._id.toString(), // Ensure _id is string
      createdAt: plainPet.createdAt ? new Date(plainPet.createdAt).toISOString() : undefined,
      updatedAt: plainPet.updatedAt ? new Date(plainPet.updatedAt).toISOString() : undefined,
    };

    // Calculate isNewlyAdded flag for the individual pet detail
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    pet.isNewlyAdded = pet.createdAt
      ? new Date(pet.createdAt) >= sevenDaysAgo
      : false;

    return NextResponse.json({ success: true, data: pet }, { status: 200 });
  } catch (error: any) {
    console.error("Error fetching pet by ID:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch pet.",
        error: error.message,
      },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest, context: any) {
  const authResult = await authenticateAndAuthorize(request, "admin");
  if (authResult.response) {
    return authResult.response;
  }

  await dbConnect();
  const { params } = context;
  const { id } = params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return NextResponse.json(
      { success: false, message: "Invalid Pet ID format." },
      { status: 400 }
    );
  }

  try {
    const body: IPet = await request.json();
    const {
      name,
      category,
      type,
      age,
      color,
      gender,
      size,
      weight,
      price,
      location,
      images,
      description,
      isNewlyAdded,
      availableDate,
      breed,
      dateOfBirth,
      additionalInfo,
      mapLocation,
    } = body;

    // Build the update object dynamically to only include provided fields
    const updateFields: Partial<IPet> = {};
    if (name !== undefined) updateFields.name = name;
    if (category !== undefined) updateFields.category = category;
    if (type !== undefined) updateFields.type = type;
    if (age !== undefined) updateFields.age = age;
    if (color !== undefined) updateFields.color = color;
    if (gender !== undefined) {
      if (!["Male", "Female", "N/A"].includes(gender)) {
        return NextResponse.json(
          { success: false, message: "Invalid gender provided." },
          { status: 400 }
        );
      }
      updateFields.gender = gender;
    }
    if (size !== undefined) {
      if (!["Tiny", "Small", "Medium", "Large"].includes(size)) {
        return NextResponse.json(
          { success: false, message: "Invalid size provided." },
          { status: 400 }
        );
      }
      updateFields.size = size;
    }
    if (weight !== undefined) updateFields.weight = weight;
    if (price !== undefined) {
      if (typeof price !== "number" || price < 0) {
        return NextResponse.json(
          { success: false, message: "Price must be a non-negative number." },
          { status: 400 }
        );
      }
      updateFields.price = price;
    }
    if (location !== undefined) updateFields.location = location;
    if (images !== undefined) {
      if (!Array.isArray(images) || !images.every((img) => typeof img === "string")) {
        return NextResponse.json(
          { success: false, message: "Images must be an array of strings." },
          { status: 400 }
        );
      }
      updateFields.images = images;
    }
    if (description !== undefined) updateFields.description = description;

    if (isNewlyAdded !== undefined) updateFields.isNewlyAdded = isNewlyAdded;
    if (availableDate !== undefined) updateFields.availableDate = availableDate;
    if (breed !== undefined) updateFields.breed = breed;
    if (dateOfBirth !== undefined) updateFields.dateOfBirth = dateOfBirth;
    if (additionalInfo !== undefined) {
        if (!Array.isArray(additionalInfo) || !additionalInfo.every((info) => typeof info === "string")) {
            return NextResponse.json(
                { success: false, message: "Additional info must be an array of strings." },
                { status: 400 }
            );
        }
        updateFields.additionalInfo = additionalInfo;
    }
    if (mapLocation !== undefined) {
        if (typeof mapLocation !== 'object' || mapLocation === null ||
            (mapLocation.address && typeof mapLocation.address !== 'string') ||
            (mapLocation.link && typeof mapLocation.link !== 'string') ||
            (mapLocation.coords !== undefined && (typeof mapLocation.coords !== 'object' || mapLocation.coords === null ||
            (mapLocation.coords.lat && typeof mapLocation.coords.lat !== 'number') ||
            (mapLocation.coords.lng && typeof mapLocation.coords.lng !== 'number')))) {
            return NextResponse.json(
                { success: false, message: "Invalid map location format." },
                { status: 400 }
            );
        }
        updateFields.mapLocation = mapLocation;
    }

    // Always update `updatedAt` for consistency
    updateFields.updatedAt = new Date().toISOString();


    const updatedPet = await Pet.findByIdAndUpdate(
      id,
      updateFields, // Use the dynamically built update object
      { new: true, runValidators: true } // `new: true` returns the updated document
    );

    if (!updatedPet) {
      return NextResponse.json(
        { success: false, message: "Pet not found for update." },
        { status: 404 }
      );
    }

    // Convert updated Mongoose document to IPet for consistent response
    const plainUpdatedPet = updatedPet.toObject({ getters: true, virtuals: true });
    const finalUpdatedPet: IPet = {
      ...plainUpdatedPet,
      _id: plainUpdatedPet._id.toString(),
      createdAt: plainUpdatedPet.createdAt ? new Date(plainUpdatedPet.createdAt).toISOString() : undefined,
      updatedAt: plainUpdatedPet.updatedAt ? new Date(plainUpdatedPet.updatedAt).toISOString() : undefined,
    };

    return NextResponse.json(
      { success: true, data: finalUpdatedPet },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Error updating pet:", error);
    if (error.name === "ValidationError") {
      return NextResponse.json(
        { success: false, message: error.message, errors: error.errors },
        { status: 400 }
      );
    }
    return NextResponse.json(
      {
        success: false,
        message: "Failed to update pet.",
        error: error.message,
      },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest, context: any) {
  const authResult = await authenticateAndAuthorize(request, "admin");
  if (authResult.response) {
    return authResult.response;
  }

  await dbConnect();
  const { params } = context;
  const { id } = params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return NextResponse.json(
      { success: false, message: "Invalid Pet ID format." },
      { status: 400 }
    );
  }

  try {
    const deletedPet = await Pet.findByIdAndDelete(id);
    if (!deletedPet) {
      return NextResponse.json(
        { success: false, message: "Pet not found for deletion." },
        { status: 404 }
      );
    }
    return NextResponse.json({ success: true, data: {} }, { status: 200 });
  } catch (error: any) {
    console.error("Error deleting pet:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to delete pet.",
        error: error.message,
      },
      { status: 500 }
    );
  }
}