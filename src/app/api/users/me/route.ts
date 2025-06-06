/* eslint-disable @typescript-eslint/no-explicit-any */
// src/app/api/users/me/route.ts
import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/backend/lib/mongodb";
import User from "@/backend/models/User";
import { authenticateAndAuthorize } from "@/backend/lib/auth";
import { IAddress, IUser } from "@/types";

export async function GET(request: NextRequest) {
  const authResult = await authenticateAndAuthorize(request);
  if (authResult.response) return authResult.response;
  const authenticatedUser = authResult.user!;

  await dbConnect();

  try {
    const user = await User.findById(authenticatedUser.id).select("-password"); // Exclude password
    if (!user) {
      return NextResponse.json(
        { success: false, message: "User not found." },
        { status: 404 }
      );
    }
    return NextResponse.json({ success: true, data: user }, { status: 200 });
  } catch (error: any) {
    console.error("Error fetching user profile:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch user profile.",
        error: error.message,
      },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  const authResult = await authenticateAndAuthorize(request);
  if (authResult.response) return authResult.response;
  const authenticatedUser = authResult.user!;

  await dbConnect();

  try {
    const body: { name?: string; email?: string; addresses?: IAddress[] } =
      await request.json();
    const { name, email, addresses } = body;

    const updateData: Partial<IUser> = {};
    if (name !== undefined) updateData.name = name;
    if (email !== undefined) updateData.email = email;
    if (addresses !== undefined) {
      // Basic validation for addresses (e.g., ensure required fields exist)
      for (const addr of addresses) {
        if (!addr.street || !addr.city || !addr.zipCode || !addr.country) {
          return NextResponse.json(
            { success: false, message: "Incomplete address details provided." },
            { status: 400 }
          );
        }
      }
      updateData.addresses = addresses;
    }

    if (Object.keys(updateData).length === 0) {
      return NextResponse.json(
        { success: false, message: "No update data provided." },
        { status: 400 }
      );
    }

    const updatedUser = await User.findByIdAndUpdate(
      authenticatedUser.id,
      { ...updateData, updatedAt: new Date() },
      { new: true, runValidators: true, select: "-password" } // Exclude password from response
    );

    if (!updatedUser) {
      return NextResponse.json(
        { success: false, message: "User not found for update." },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { success: true, data: updatedUser },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Error updating user profile:", error);
    if (error.code === 11000) {
      // Duplicate key error (e.g., email already exists)
      return NextResponse.json(
        { success: false, message: "Email already in use." },
        { status: 409 }
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
        message: "Failed to update user profile.",
        error: error.message,
      },
      { status: 500 }
    );
  }
}
