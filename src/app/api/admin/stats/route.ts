/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/backend/lib/mongodb";
import User from "@/backend/models/User"; // Import your User model
import Product from "@/backend/models/Product"; // Assuming you have a Product model
import Order from "@/backend/models/Order"; // Assuming you have an Order model
import Pet from "@/backend/models/Pet"; // Assuming you have a Pet model
import TeamMember from "@/backend/models/TeamMember"; // Assuming you have a TeamMember model
import GalleryImage from "@/backend/models/Gallery"; // Assuming you have a GalleryImage model

import { authenticateAndAuthorize } from "@/backend/lib/auth"; // Your authentication middleware

export async function GET(request: NextRequest) {
  // Authenticate and authorize the request for 'admin' role
  const authResult = await authenticateAndAuthorize(request, "admin");

  // If authentication or authorization fails, return the response from the middleware
  if (authResult.response) {
    return authResult.response;
  }

  await dbConnect(); // Connect to your MongoDB database

  try {
    // Fetch total user count
    const totalUsers = await User.countDocuments({});

    // Fetch total product count (if Product model exists)
    let totalProducts = 0;
    try {
      totalProducts = await Product.countDocuments({});
    } catch (err) {
      console.warn("Product model not found or error counting products:", err);
    }

    // Fetch total order count (if Order model exists)
    let totalOrders = 0;
    try {
      totalOrders = await Order.countDocuments({});
    } catch (err) {
      console.warn("Order model not found or error counting orders:", err);
    }

    // Fetch total pet count (if Pet model exists)
    let totalPets = 0;
    try {
      totalPets = await Pet.countDocuments({});
    } catch (err) {
      console.warn("Pet model not found or error counting pets:", err);
    }

    // Fetch total team member count (if TeamMember model exists)
    let totalTeamMembers = 0;
    try {
      totalTeamMembers = await TeamMember.countDocuments({});
    } catch (err) {
      console.warn(
        "TeamMember model not found or error counting team members:",
        err
      );
    }

    // Fetch total gallery image count (if GalleryImage model exists)
    let totalGalleryImages = 0;
    try {
      totalGalleryImages = await GalleryImage.countDocuments({});
    } catch (err) {
      console.warn(
        "GalleryImage model not found or error counting gallery images:",
        err
      );
    }

    // You can add more statistics here as needed, e.g.:
    // const totalPendingOrders = await Order.countDocuments({ status: 'pending' });
    // const totalRevenue = await Order.aggregate([ { $group: { _id: null, total: { $sum: '$totalAmount' } } } ]);

    // Return the collected statistics
    return NextResponse.json(
      {
        success: true,
        data: {
          totalUsers,
          totalProducts,
          totalOrders,
          totalPets,
          totalTeamMembers,
          totalGalleryImages,
          // Add other stats here
        },
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Error fetching dashboard statistics:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch dashboard statistics.",
        error: error.message,
      },
      { status: 500 }
    );
  }
}
