// src/app/api/pets/route.ts
/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/backend/lib/mongodb";
import Pet from "@/backend/models/Pet";
import { IPet } from "../../../types"; // Ensure correct path to your IPet
import { authenticateAndAuthorize } from "@/backend/lib/auth"; // Assuming you have this middleware
import { Types } from "mongoose"; // Import Types for ObjectId

export async function GET(request: NextRequest) {
  await dbConnect();

  try {
    const searchParams = request.nextUrl.searchParams;

    // Filtering parameters
    const category = searchParams.get("category");
    const type = searchParams.get("type");
    const age = searchParams.get("age");
    const color = searchParams.get("color");
    const gender = searchParams.get("gender");
    const size = searchParams.get("size");
    const weight = searchParams.get("weight");
    const price_min = searchParams.get("price_min");
    const price_max = searchParams.get("price_max");
    const name_search = searchParams.get("name_search");
    const location_search = searchParams.get("location_search");
    const breed_search = searchParams.get("breed_search");
    const isNewlyAdded = searchParams.get("isNewlyAdded");

    // Pagination parameters
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "9");

    // Sorting parameters
    const sortField = searchParams.get("sortField") || "createdAt";
    const sortOrder = searchParams.get("sortOrder") === "asc" ? 1 : -1;

    // Exclusion parameter (for suggested pets)
    const excludeId = searchParams.get("excludeId");

    const query: any = {};

    if (category) {
      const categoriesArray = category
        .split(",")
        .map((c) => c.trim().toLowerCase());
      query.category = { $in: categoriesArray };
    }
    if (type) {
      const typesArray = type.split(",").map((t) => new RegExp(t.trim(), "i"));
      query.type = { $in: typesArray };
    }
    if (age) {
      query.age = age;
    }
    if (color) {
      query.color = color;
    }
    if (gender) {
      const gendersArray = gender.split(",").map((g) => g.trim());
      query.gender = { $in: gendersArray };
    }
    if (size) {
      const sizesArray = size.split(",").map((s) => s.trim());
      query.size = { $in: sizesArray };
    }
    if (weight) {
      query.weight = weight;
    }

    if (price_min || price_max) {
      query.price = {};
      if (price_min) query.price.$gte = parseFloat(price_min);
      if (price_max) query.price.$lte = parseFloat(price_max);
    }

    if (name_search) {
      query.name = { $regex: new RegExp(name_search, "i") };
    }
    if (breed_search) {
      query.breed = { $regex: new RegExp(breed_search, "i") };
    }
    if (location_search) {
      query.location = { $regex: new RegExp(location_search, "i") };
    }

    if (isNewlyAdded === "true") {
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
      query.createdAt = { $gte: sevenDaysAgo };
    }

    if (excludeId) {
      if (Types.ObjectId.isValid(excludeId)) {
        query._id = { $ne: new Types.ObjectId(excludeId) };
      } else {
        console.warn(`Invalid excludeId provided: ${excludeId}`);
      }
    }

    const totalPets = await Pet.countDocuments(query);

    const skip = (page - 1) * limit;
    const petsFromDb = await Pet.find(query)
      .skip(skip)
      .limit(limit)
      .sort({ [sortField]: sortOrder });

    // Corrected mapping to IPet
    const petsWithFlags: IPet[] = petsFromDb.map((pet) => {
      // Convert to a plain object first. Mongoose's .toJSON() or .toObject({ getters: true })
      // will handle the ObjectId to string conversion for _id by default.
      const plainPet = pet.toObject({ getters: true, virtuals: true });

      // Now, explicitly cast to IPet, and ensure _id is string
      // This is the safest way to satisfy TypeScript
      const petObject: IPet = {
        ...plainPet,
        _id: plainPet._id.toString(), // Explicitly convert ObjectId to string
        // Mongoose populates createdAt and updatedAt, but type them explicitly if needed
        createdAt: plainPet.createdAt
          ? new Date(plainPet.createdAt).toISOString()
          : undefined,
        updatedAt: plainPet.updatedAt
          ? new Date(plainPet.updatedAt).toISOString()
          : undefined,
      };

      // Calculate isNewlyAdded flag
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
      petObject.isNewlyAdded = petObject.createdAt
        ? new Date(petObject.createdAt) >= sevenDaysAgo
        : false;

      // Ensure images array is present, even if empty
      petObject.images = petObject.images || [];

      return petObject;
    });

    return NextResponse.json(
      {
        success: true,
        data: petsWithFlags,
        pagination: {
          currentPage: page,
          totalPages: Math.ceil(totalPets / limit),
          totalItems: totalPets,
          limit: limit,
        },
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Error fetching pets:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch pets.",
        error: error.message,
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
    
  const authResult = await authenticateAndAuthorize(request, "admin");

  if (authResult.response) {
    return authResult.response;
  }

  await dbConnect();

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
      availableDate,
      breed,
      dateOfBirth,
      additionalInfo,
      mapLocation,
    } = body;

    if (
      !name ||
      !category ||
      !type ||
      !age ||
      !color ||
      !gender ||
      !size ||
      !weight ||
      !price ||
      !location
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Name, category, type, age, color, gender, size, weight, price, and location are required.",
        },
        { status: 400 }
      );
    }

    if (typeof price !== "number" || price < 0) {
      return NextResponse.json(
        { success: false, message: "Price must be a non-negative number." },
        { status: 400 }
      );
    }
    if (!["Male", "Female", "N/A"].includes(gender)) {
      return NextResponse.json(
        { success: false, message: "Invalid gender provided." },
        { status: 400 }
      );
    }
    if (!["Tiny", "Small", "Medium", "Large"].includes(size)) {
      return NextResponse.json(
        { success: false, message: "Invalid size provided." },
        { status: 400 }
      );
    }

    if (
      images !== undefined &&
      (!Array.isArray(images) ||
        !images.every((img) => typeof img === "string"))
    ) {
      return NextResponse.json(
        { success: false, message: "Images must be an array of strings." },
        { status: 400 }
      );
    }

    if (
      additionalInfo !== undefined &&
      (!Array.isArray(additionalInfo) ||
        !additionalInfo.every((info) => typeof info === "string"))
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "Additional info must be an array of strings.",
        },
        { status: 400 }
      );
    }

    if (mapLocation !== undefined) {
      if (typeof mapLocation !== "object" || mapLocation === null) {
        return NextResponse.json(
          { success: false, message: "Map location must be an object." },
          { status: 400 }
        );
      }
      if (mapLocation.address && typeof mapLocation.address !== "string") {
        return NextResponse.json(
          { success: false, message: "Map location address must be a string." },
          { status: 400 }
        );
      }
      if (mapLocation.link && typeof mapLocation.link !== "string") {
        return NextResponse.json(
          { success: false, message: "Map location link must be a string." },
          { status: 400 }
        );
      }
      if (mapLocation.coords !== undefined) {
        if (
          typeof mapLocation.coords !== "object" ||
          mapLocation.coords === null
        ) {
          return NextResponse.json(
            {
              success: false,
              message: "Map location coords must be an object.",
            },
            { status: 400 }
          );
        }
        if (
          mapLocation.coords.lat &&
          typeof mapLocation.coords.lat !== "number"
        ) {
          return NextResponse.json(
            {
              success: false,
              message: "Map location latitude must be a number.",
            },
            { status: 400 }
          );
        }
        if (
          mapLocation.coords.lng &&
          typeof mapLocation.coords.lng !== "number"
        ) {
          return NextResponse.json(
            {
              success: false,
              message: "Map location longitude must be a number.",
            },
            { status: 400 }
          );
        }
      }
    }

    const pet = await Pet.create({
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
      isNewlyAdded: true,
      availableDate,
      breed,
      dateOfBirth,
      additionalInfo,
      mapLocation,
    });

    return NextResponse.json({ success: true, data: pet }, { status: 201 });
  } catch (error: any) {
    console.error("Error creating pet:", error);
    if (error.name === "ValidationError") {
      return NextResponse.json(
        { success: false, message: error.message, errors: error.errors },
        { status: 400 }
      );
    }
    return NextResponse.json(
      {
        success: false,
        message: "Failed to create pet.",
        error: error.message,
      },
      { status: 500 }
    );
  }
}
