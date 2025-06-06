/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/backend/lib/mongodb";
import Product from "@/backend/models/Product";
import { IProduct } from "../../../types";
import { authenticateAndAuthorize } from "@/backend/lib/auth";

export async function GET(request: NextRequest) {
  await dbConnect();

  try {
    const searchParams = request.nextUrl.searchParams;
    const category = searchParams.get("category");
    const price_min = searchParams.get("price_min");
    const price_max = searchParams.get("price_max");
    const name_search = searchParams.get("name_search");
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "15");

    const query: any = {};

    if (category) {
      query.category = category.toLowerCase();
    }
    if (price_min || price_max) {
      query.price = {};
      if (price_min) query.price.$gte = parseFloat(price_min);
      if (price_max) query.price.$lte = parseFloat(price_max);
    }
    if (name_search) {
      query.name = { $regex: new RegExp(name_search, "i") };
    }

    const skip = (page - 1) * limit;
    const productsFromDb = await Product.find(query)
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    const totalProducts = await Product.countDocuments(query);

    // Dynamically add isNewlyReleased and isOnSale flags
    const productsWithFlags: IProduct[] = productsFromDb.map((product) => {
      const productObject = product.toObject() as IProduct; // Convert Mongoose document to plain object

      // Calculate isNewlyReleased: created within the last 7 days (1 week)
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
      productObject.isNewlyReleased = productObject.createdAt
        ? productObject.createdAt >= sevenDaysAgo
        : false; // Renamed here

      // Calculate isOnSale: oldPrice exists and is greater than current price
      productObject.isOnSale =
        productObject.oldPrice !== undefined &&
        productObject.oldPrice > productObject.price;

      // Ensure images array is present, even if empty
      productObject.images = productObject.images || [];

      return productObject;
    });

    return NextResponse.json(
      {
        success: true,
        data: productsWithFlags,
        pagination: {
          currentPage: page,
          totalPages: Math.ceil(totalProducts / limit),
          totalItems: totalProducts,
          limit: limit,
        },
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Error fetching products:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch products.",
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
    // Include 'images' in destructuring
    const body: IProduct = await request.json();
    const { name, description, price, oldPrice, category, images, stock } = body; 

    if (!name || !price || !category) {
      return NextResponse.json(
        { success: false, message: "Name, price, and category are required." },
        { status: 400 }
      );
    }
    if (typeof price !== "number" || price < 0) {
      return NextResponse.json(
        { success: false, message: "Price must be a positive number." },
        { status: 400 }
      );
    }
    if (
      oldPrice !== undefined &&
      (typeof oldPrice !== "number" || oldPrice < 0)
    ) {
      // Validate oldPrice
      return NextResponse.json(
        { success: false, message: "Old price must be a non-negative number." },
        { status: 400 }
      );
    }
    if (stock !== undefined && (typeof stock !== "number" || stock < 0)) {
      return NextResponse.json(
        { success: false, message: "Stock must be a positive number." },
        { status: 400 }
      );
    }
    if (
      images !== undefined &&
      (!Array.isArray(images) ||
        !images.every((img) => typeof img === "string"))
    ) {
      // Validate images
      return NextResponse.json(
        { success: false, message: "Images must be an array of strings." },
        { status: 400 }
      );
    }

    const product = await Product.create({
      name,
      description,
      price,
      oldPrice,
      category,
      images,
      stock,
    });
    return NextResponse.json({ success: true, data: product }, { status: 201 });
  } catch (error: any) {
    console.error("Error creating product:", error);
    if (error.name === "ValidationError") {
      return NextResponse.json(
        { success: false, message: error.message, errors: error.errors },
        { status: 400 }
      );
    }
    return NextResponse.json(
      {
        success: false,
        message: "Failed to create product.",
        error: error.message,
      },
      { status: 500 }
    );
  }
}
