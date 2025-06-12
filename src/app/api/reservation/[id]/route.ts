// src/app/api/reservation/[id]/route.ts

/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/backend/lib/mongodb";
import Reservation from "@/backend/models/Reservation";
import { IReservation } from "@/types";
import { authenticateAndAuthorize } from "@/backend/lib/auth";
import { RESEND_API_KEY } from "@/backend/lib/config";
import { Resend } from "resend";

const resend = new Resend(RESEND_API_KEY);

interface UpdateReservationRequestBody {
  status?: IReservation["status"];
  adminNotes?: string;
}


export async function PUT(request: NextRequest, context: any) {
  // Apply authentication and authorization for admin access
  const authResult = await authenticateAndAuthorize(request, "admin");
  if (authResult.response) {
    return authResult.response;
  }

  await dbConnect();

  const { id } = await context.params; // Get the reservation ID from the URL

  try {
    const body: UpdateReservationRequestBody = await request.json();

    // Fetch the original reservation to check for status change and get client's email
    const originalReservation = await Reservation.findById(id).lean();

    if (!originalReservation) {
      return NextResponse.json(
        { success: false, message: "Reservation not found." },
        { status: 404 }
      );
    }

    const updates: Partial<IReservation> = {};
    if (body.status) updates.status = body.status;
    if (body.adminNotes !== undefined) updates.adminNotes = body.adminNotes;

    // If no valid fields are provided for update, return error
    if (Object.keys(updates).length === 0) {
      return NextResponse.json(
        { success: false, message: "No valid fields provided for update." },
        { status: 400 }
      );
    }

    // Perform the update
    const updatedReservation = await Reservation.findByIdAndUpdate(
      id,
      updates,
      { new: true, runValidators: true }
    ).lean();

    if (!updatedReservation) {
      // This should ideally not happen if originalReservation was found, but as a safeguard
      return NextResponse.json(
        { success: false, message: "Reservation not found after update attempt." },
        { status: 404 }
      );
    }

    // Check if status has changed and send email if applicable
    const oldStatus = originalReservation.status;
    const newStatus = updatedReservation.status;

    if (newStatus !== oldStatus) {
      let subject = "";
      let htmlContent = "";

      const clientEmail = updatedReservation.email;
      const clientFullName = updatedReservation.fullName;
      const reservationDate = updatedReservation.date;
      const petSpecies = updatedReservation.species;
      const petBreed = updatedReservation.breed;
      const reservationReason = updatedReservation.reason;
      const adminNotes = updatedReservation.adminNotes || "N/A";

      if (newStatus === "confirmed") {
        subject = `Your Pet Appointment for ${petSpecies} is Confirmed!`;
        htmlContent = `
          <p>Dear ${clientFullName},</p>
          <p>We are pleased to inform you that your pet appointment has been <strong>confirmed</strong>!</p>
          <p><strong>Appointment Details:</strong></p>
          <ul>
            <li><strong>Requested Date:</strong> ${reservationDate}</li>
            <li><strong>Pet Species:</strong> ${petSpecies}</li>
            <li><strong>Pet Breed:</strong> ${petBreed}</li>
            <li><strong>Reason for Appointment:</strong> ${reservationReason}</li>
            <li><strong>Your Email:</strong> ${clientEmail}</li>
            <li><strong>Your Phone:</strong> ${updatedReservation.phone}</li>
            <li><strong>Admin Notes:</strong> ${adminNotes}</li>
          </ul>
          <p>We look forward to seeing you and ${petSpecies} on ${reservationDate}.</p>
          <p>If you have any questions, please contact us.</p>
        `;
      } else if (newStatus === "cancelled") {
        subject = `Update: Your Pet Appointment for ${petSpecies} has been Cancelled`;
        htmlContent = `
          <p>Dear ${clientFullName},</p>
          <p>We regret to inform you that your pet appointment scheduled for <strong>${reservationDate}</strong> has been <strong>cancelled</strong>.</p>
          <p><strong>Appointment Details:</strong></p>
          <ul>
            <li><strong>Requested Date:</strong> ${reservationDate}</li>
            <li><strong>Pet Species:</strong> ${petSpecies}</li>
            <li><strong>Pet Breed:</strong> ${petBreed}</li>
            <li><strong>Reason for Appointment:</strong> ${reservationReason}</li>
            <li><strong>Your Email:</strong> ${clientEmail}</li>
            <li><strong>Your Phone:</strong> ${updatedReservation.phone}</li>
            <li><strong>Admin Notes:</strong> ${adminNotes}</li>
          </ul>
          <p>If you wish to reschedule, please visit our website or contact us directly.</p>
          <p>We apologize for any inconvenience this may cause.</p>
        `;
      }

      // Only send email if a relevant status change occurred
      if (subject && htmlContent) {
        try {
          const { data: emailData, error: emailError } = await resend.emails.send({
            from: "Pet Clinic <onboarding@resend.dev>", // IMPORTANT: Must be verified in Resend
            to: clientEmail, // Send to the client's email
            subject: subject,
            html: htmlContent,
          });

          if (emailError) {
            console.error("Resend email sending error for status update:", emailError);
            // Don't fail the API request just because email failed, but log it
          } else {
            console.log(`Status update email sent successfully for ${newStatus} to ${clientEmail}:`, emailData);
          }
        } catch (emailSendError: any) {
          console.error("Critical error during email sending for status update:", emailSendError);
        }
      }
    }

    const formattedReservation: IReservation = {
      ...updatedReservation,
      _id: updatedReservation._id.toString(),
    };

    return NextResponse.json(
      { success: true, data: formattedReservation },
      { status: 200 }
    );
  } catch (error: any) {
    console.error(`Error updating reservation with ID ${id}:`, error);
    if (error.name === "CastError") {
      return NextResponse.json(
        { success: false, message: "Invalid Reservation ID format." },
        { status: 400 }
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
        message: "Failed to update reservation.",
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

  const { id } = await context.params; 

  try {
    // 1. Fetch the reservation BEFORE deleting it to get client's details
    const reservationToDelete = await Reservation.findById(id).lean();

    if (!reservationToDelete) {
      return NextResponse.json(
        { success: false, message: "Reservation not found." },
        { status: 404 }
      );
    }

    // 2. Proceed with deletion
    const deletedReservation = await Reservation.findByIdAndDelete(id).lean();

    if (!deletedReservation) {
      // This case might occur if another process deleted it between fetch and delete
      return NextResponse.json(
        { success: false, message: "Reservation not found or already deleted." },
        { status: 404 }
      );
    }

    // 3. Send cancellation email to the client
    const clientEmail = reservationToDelete.email;
    const clientFullName = reservationToDelete.fullName;
    const reservationDate = reservationToDelete.date;
    const petSpecies = reservationToDelete.species;
    const petBreed = reservationToDelete.breed;
    const reservationReason = reservationToDelete.reason;
    const adminNotes = reservationToDelete.adminNotes || "N/A"; // Include admin notes if available

    const subject = `Important: Your Pet Appointment for ${petSpecies} has been Cancelled`;
    const htmlContent = `
      <p>Dear ${clientFullName},</p>
      <p>This is an important update regarding your pet appointment.</p>
      <p>Your appointment scheduled for <strong>${reservationDate}</strong> has been <strong>cancelled</strong>.</p>
      <p><strong>Appointment Details:</strong></p>
      <ul>
        <li><strong>Requested Date:</strong> ${reservationDate}</li>
        <li><strong>Pet Species:</strong> ${petSpecies}</li>
        <li><strong>Pet Breed:</strong> ${petBreed}</li>
        <li><strong>Reason for Appointment:</strong> ${reservationReason}</li>
        <li><strong>Your Email:</strong> ${clientEmail}</li>
        <li><strong>Your Phone:</strong> ${reservationToDelete.phone}</li>
        <li><strong>Admin Notes (if any):</strong> ${adminNotes}</li>
      </ul>
      <p>This cancellation is due to direct deletion from our system. If you wish to reschedule, please visit our website or contact us directly.</p>
      <p>We apologize for any inconvenience this may cause.</p>
      <p>Thank you for your understanding.</p>
    `;

    try {
      const { data: emailData, error: emailError } = await resend.emails.send({
        from: "Pet Clinic <onboarding@resend.dev>", // IMPORTANT: Use your verified Resend email
        to: clientEmail,
        subject: subject,
        html: htmlContent,
      });

      if (emailError) {
        console.error("Resend email sending error for deletion:", emailError);
      } else {
        console.log(`Deletion confirmation email sent successfully to ${clientEmail}:`, emailData);
      }
    } catch (emailSendError: any) {
      console.error("Critical error during email sending for deletion:", emailSendError);
    }

    return NextResponse.json(
      { success: true, message: "Reservation deleted successfully and client notified." },
      { status: 200 }
    );
  } catch (error: any) {
    console.error(`Error deleting reservation with ID ${id}:`, error);
    if (error.name === "CastError") {
      return NextResponse.json(
        { success: false, message: "Invalid Reservation ID format." },
        { status: 400 }
      );
    }
    return NextResponse.json(
      {
        success: false,
        message: "Failed to delete reservation.",
        error: error.message,
      },
      { status: 500 }
    );
  }
}