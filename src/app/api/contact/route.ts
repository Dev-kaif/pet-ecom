// /api/contact/route.ts
import { EMAIL, RESEND_API_KEY } from "@/backend/lib/config";
import { Resend } from "resend";

const resend = new Resend(RESEND_API_KEY);

interface ContactRequest {
  name: string;
  email: string;
  website?: string;
  message: string;
}

export async function POST(req: Request) {
  try {
    const body: ContactRequest = await req.json();
    const { name, email, website, message } = body; // Destructure all expected fields

    // Basic validation: ensure required fields are present
    if (!name || !email || !message) {
      return Response.json(
        { success: false, message: "Name, email, and message fields are required." },
        { status: 400 } // Bad Request
      );
    }

    // Optional: Basic email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return Response.json(
        { success: false, message: "Invalid email format." },
        { status: 400 } // Bad Request
      );
    }

    try {
      // Attempt to send the email using Resend
      const { data, error } = await resend.emails.send({
        from: "Contact Form <onboarding@resend.dev>", // This 'from' address must be verified in Resend
        to: EMAIL, // Your recipient email address from config
        subject: `New Contact Form Submission from ${name}`, // Clearer subject line
        html: `
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          ${website ? `<p><strong>Website:</strong> <a href="${website}" target="_blank">${website}</a></p>` : ''}
          <p><strong>Message:</strong><br/>${message}</p>
        `,
      });

      // Check for errors from Resend itself
      if (error) {
        console.error("Resend email sending error:", error);
        return Response.json(
          { success: false, message: error.message || "Failed to send email via Resend." },
          { status: 500 } // Internal Server Error
        );
      }

      console.log("Email sent successfully via Resend:", data);
      return Response.json({ success: true, message: "Message sent successfully!" });

    } catch (sendError) {
      // Catch any synchronous errors during the resend.emails.send call
      console.error("Error during Resend email attempt:", sendError);
      return Response.json(
        { success: false, message: "An unexpected error occurred while trying to send the email." },
        { status: 500 } // Internal Server Error
      );
    }

  } catch (parseError) {
    // This catches errors if the request body is not valid JSON
    console.error("Error parsing request body:", parseError);
    return Response.json(
      { success: false, message: "Invalid request body format." },
      { status: 400 } // Bad Request
    );
  }
}