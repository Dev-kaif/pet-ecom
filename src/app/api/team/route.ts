// src/app/api/team/route.ts
/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/backend/lib/mongodb";
import TeamMember from "@/backend/models/TeamMember"; // Import your TeamMember model
import { ITeamMember } from "../../../types"; // Assuming ITeamMember is here
import { authenticateAndAuthorize } from "@/backend/lib/auth";

export async function GET() {
  await dbConnect();

  try {
    const teamMembersFromDb = await TeamMember.find({});

    const teamMembersWithFlags: ITeamMember[] = teamMembersFromDb.map(
      (member) => {
        const plainMember = member.toObject({ getters: true, virtuals: true });

        const memberObject: ITeamMember = {
          ...plainMember,
          _id: plainMember._id.toString(), // Explicitly convert ObjectId to string
          createdAt: plainMember.createdAt
            ? new Date(plainMember.createdAt).toISOString()
            : undefined,
          updatedAt: plainMember.updatedAt
            ? new Date(plainMember.updatedAt).toISOString()
            : undefined,
        };

        return memberObject;
      }
    );

    return NextResponse.json(
      {
        success: true,
        data: teamMembersWithFlags,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Error fetching team members:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch team members.",
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
    const body: ITeamMember = await request.json();

    const {
      name,
      title,
      description,
      experience,
      contact,
      imageUrl,
      showOnHome, // Destructure the new field
    } = body;

    // Basic validation for required fields
    if (
      !name ||
      !title ||
      !description ||
      !experience ||
      !contact ||
      !imageUrl
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Name, title, description, experience, contact, and imageUrl are required.",
        },
        { status: 400 }
      );
    }

    // Validate contact object structure
    if (
      typeof contact !== "object" ||
      contact === null ||
      !contact.phone ||
      !contact.email ||
      !contact.address ||
      !contact.social
    ) {
      return NextResponse.json(
        { success: false, message: "Invalid contact information provided." },
        { status: 400 }
      );
    }

    // Validate social object structure
    if (typeof contact.social !== "object" || contact.social === null) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid social media information provided.",
        },
        { status: 400 }
      );
    }

    const actualShowOnHome = showOnHome || false; // Default to false if not provided

    if (actualShowOnHome) {
      const homeMembersCount = await TeamMember.countDocuments({
        showOnHome: true,
      });
      if (homeMembersCount >= 4) {
        return NextResponse.json(
          {
            success: false,
            message:
              "Cannot add more than 4 team members to be shown on home. Please unmark another member first.",
          },
          { status: 400 }
        );
      }
    }
    // --- End New Logic ---

    const teamMember = await TeamMember.create({
      name,
      title,
      description,
      experience,
      contact,
      imageUrl,
      showOnHome: actualShowOnHome, // Use the validated/adjusted value
    });

    return NextResponse.json(
      { success: true, data: teamMember },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Error creating team member:", error);
    if (error.name === "ValidationError") {
      return NextResponse.json(
        { success: false, message: error.message, errors: error.errors },
        { status: 400 }
      );
    }
    return NextResponse.json(
      {
        success: false,
        message: "Failed to create team member.",
        error: error.message,
      },
      { status: 500 }
    );
  }
}
