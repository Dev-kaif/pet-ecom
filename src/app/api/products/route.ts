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
    const limit = parseInt(searchParams.get("limit") || "10");

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
    const products = await Product.find(query)
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    const totalProducts = await Product.countDocuments(query);

    return NextResponse.json(
      {
        success: true,
        data: products,
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
    const body: IProduct = await request.json();
    const { name, description, price, category, imageUrl, stock } = body;

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
    if (stock !== undefined && (typeof stock !== "number" || stock < 0)) {
      return NextResponse.json(
        { success: false, message: "Stock must be a positive number." },
        { status: 400 }
      );
    }

    const product = await Product.create({
      name,
      description,
      price,
      category,
      imageUrl,
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
