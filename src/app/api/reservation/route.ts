/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/backend/lib/mongodb"; // Assuming dbConnect is in lib/mongodb
import Reservation from "@/backend/models/Reservation";
import { IReservation } from "@/types";
import { EMAIL, RESEND_API_KEY } from "@/backend/lib/config";
import { Resend } from "resend";
import { authenticateAndAuthorize } from "@/backend/lib/auth";

const resend = new Resend(RESEND_API_KEY);

type ReservationPostBody = Omit<
  IReservation,
  "_id" | "status" | "adminNotes" | "createdAt" | "updatedAt"
>;

export async function GET(request: NextRequest) {
  // Apply authentication and authorization for admin access
  const authResult = await authenticateAndAuthorize(request, "admin");
  if (authResult.response) {
    return authResult.response;
  }

  await dbConnect();

  try {
    const searchParams = request.nextUrl.searchParams;
    const statusFilter = searchParams.get("status");
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "15");

    const query: any = {};
    if (statusFilter) {
      query.status = statusFilter;
    }

    const skip = (page - 1) * limit;

    const reservationsFromDb = await Reservation.find(query)
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 }) // Sort by newest first
      .lean();

    const totalReservations = await Reservation.countDocuments(query);

    const reservations: IReservation[] = reservationsFromDb.map((res) => ({
      ...res,
      _id: res._id.toString(),
    }));

    return NextResponse.json(
      {
        success: true,
        data: reservations,
        pagination: {
          currentPage: page,
          totalPages: Math.ceil(totalReservations / limit),
          totalItems: totalReservations,
          limit: limit,
        },
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Error fetching reservations:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch reservations.",
        error: error.message,
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  await dbConnect();

  try {
    const body: ReservationPostBody = await request.json();
    const {
      fullName,
      email,
      phone,
      date,
      species,
      breed,
      reason,
      specialNote,
    } = body;

    // --- Validation ---
    if (
      !fullName ||
      !email ||
      !phone ||
      !date ||
      !species ||
      !breed ||
      !reason
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Missing required fields: Full Name, Email, Phone, Date, Species, Breed, and Reason are all mandatory.",
        },
        { status: 400 }
      );
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { success: false, message: "Invalid email format." },
        { status: 400 }
      );
    }
    const phoneRegex = /^[\d\s\-\(\)]{7,}$/;
    if (!phoneRegex.test(phone)) {
      return NextResponse.json(
        { success: false, message: "Invalid phone number format." },
        { status: 400 }
      );
    }
    const dateRegex = /^\d{2}\/\d{2}\/\d{4}$/;
    if (!dateRegex.test(date)) {
      return NextResponse.json(
        { success: false, message: "Date format must be dd/mm/yyyy." },
        { status: 400 }
      );
    }

    // --- Save Reservation to MongoDB ---
    try {
      const newReservation = await Reservation.create({
        fullName,
        email,
        phone,
        date,
        species,
        breed,
        reason,
        specialNote,
        status: "pending", // Always start as pending
      });
      console.log("Reservation saved to DB:", newReservation);

      // --- Send Email via Resend ---
      const { data: emailData, error: emailError } = await resend.emails.send({
        from: "Reservation Form <onboarding@resend.dev>", // IMPORTANT: Must be verified in Resend
        to: EMAIL, // Your recipient email
        subject: `New Pet Appointment Request from ${fullName} for ${species}`,
        html: `
          <p><strong>New Appointment Request:</strong></p>
          <ul>
            <li><strong>Full Name:</strong> ${fullName}</li>
            <li><strong>Email:</strong> ${email}</li>
            <li><strong>Phone:</strong> ${phone}</li>
            <li><strong>Requested Date:</strong> ${date}</li>
            <li><strong>Pet Species:</strong> ${species}</li>
            <li><strong>Pet Breed:</strong> ${breed}</li>
            <li><strong>Reason for Appointment:</strong> ${reason}</li>
            ${specialNote ? `<li><strong>Special Note:</strong><br/>${specialNote}</li>` : ""}
          </ul>
          <p>Please log in to your dashboard to confirm or reschedule this appointment.</p>
        `,
      });

      if (emailError) {
        console.error("Resend email sending error:", emailError);
        return NextResponse.json(
          {
            success: false,
            message:
              emailError.message ||
              "Reservation saved, but failed to send confirmation email.",
          },
          { status: 500 }
        );
      }

      console.log("Reservation email sent successfully via Resend:", emailData);
      return NextResponse.json(
        {
          success: true,
          message: "Appointment request sent successfully!",
          data: newReservation.toObject() as IReservation,
        },
        { status: 201 }
      );
    } catch (dbOrEmailError: any) {
      console.error(
        "Error during reservation save or email send:",
        dbOrEmailError
      );
      return NextResponse.json(
        {
          success: false,
          message:
            dbOrEmailError.message ||
            "An unexpected error occurred during reservation processing.",
        },
        { status: 500 }
      );
    }
  } catch (parseError: any) {
    console.error("Error parsing reservation request body:", parseError);
    return NextResponse.json(
      { success: false, message: "Invalid request body format." },
      { status: 400 }
    );
  }
}
