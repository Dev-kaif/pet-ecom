/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState } from "react";
import {
  Phone,
  MapPin,
  Mail,
  Facebook,
  Twitter,
  Instagram,
  Youtube,
  ArrowRight,
} from "lucide-react";

const ContactPage: React.FC = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    website: "",
    message: "",
  });
  const [loading, setLoading] = useState(false); // State to handle loading feedback
  const [error, setError] = useState<string | null>(null); // State to handle errors
  const [success, setSuccess] = useState<string | null>(null); // State for success message

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null); 
    setSuccess(null); 

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      console.log("Contact form data submitted successfully:", result);
      setSuccess("Your message has been sent successfully!");
      setFormData({ name: "", email: "", website: "", message: "" });
    } catch (err: any) {
      console.error("Error submitting contact form:", err);
      setError(err.message || "Failed to send message. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // --- CHANGES START HERE ---

  // Hardcoded location for the map (e.g., Barclays Center, Brooklyn, NY)
  // You can change these to your desired latitude and longitude
  const FIXED_MAP_LATITUDE = 40.6826;
  const FIXED_MAP_LONGITUDE = -73.9754;
  const FIXED_MAP_ZOOM = 15; // Adjust zoom level as needed
  const LOCATION_NAME = "Barclays Center, Brooklyn, NY"; // Optional: for the title attribute of the iframe

  // --- CHANGES END HERE ---

  return (
    <div className="bg-white min-h-screen">
      <section className="py-16 lg:py-24">
        <div className="container mx-auto px-4 sm:px-16 lg:px-32">
          <div className="flex flex-col lg:flex-row gap-12 lg:gap-16 items-start">
            <div className="w-full lg:w-1/2">
              <h2 className="text-3xl md:text-4xl font-bold text-primary leading-tight mb-6">
                Have Questions or Need Help?
              </h2>
              <p className="text-gray-600 mb-8 max-w-lg">
                We’re here to help you and your pet anytime. Reach out with your
                questions, feedback, or support needs — we’d love to hear from
                you!
              </p>

              <h3 className="font-bold text-xl text-primary mb-4">
                Information:
              </h3>
              <ul className="space-y-4 mb-8">
                <li className="flex items-center gap-3 text-gray-700">
                  <div className="p-3 rounded-full bg-secondary-100 text-secondary flex-shrink-0">
                    <Phone size={20} />
                  </div>
                  <a
                    href="tel:+1238989444"
                    className="hover:text-secondary transition-colors text-lg"
                  >
                    +123 8989 444
                  </a>
                </li>
                <li className="flex items-center gap-3 text-gray-700">
                  <div className="p-3 rounded-full bg-secondary-100 text-secondary flex-shrink-0">
                    <MapPin size={20} />
                  </div>
                  <address className="not-italic text-lg">
                    256 Avenue, Newyork City
                  </address>
                </li>
                <li className="flex items-center gap-3 text-gray-700">
                  <div className="p-3 rounded-full bg-secondary-100 text-secondary flex-shrink-0">
                    <Mail size={20} />
                  </div>
                  <a
                    href="mailto:info@gmail.com"
                    className="hover:text-secondary transition-colors text-lg"
                  >
                    info@gmail.com
                  </a>
                </li>
              </ul>

              <div className="flex space-x-4">
                <a
                  href="#"
                  className="text-gray-600 hover:text-secondary transition-colors"
                >
                  <Facebook size={24} />
                </a>
                <a
                  href="#"
                  className="text-gray-600 hover:text-secondary transition-colors"
                >
                  <Twitter size={24} />
                </a>
                <a
                  href="#"
                  className="text-gray-600 hover:text-secondary transition-colors"
                >
                  <Instagram size={24} />
                </a>
                <a
                  href="#"
                  className="text-gray-600 hover:text-secondary transition-colors"
                >
                  <Youtube size={24} />
                </a>
              </div>
            </div>

            {/* Right Column: Contact Form */}
            <div className="w-full lg:w-1/2 bg-newGray rounded-xl shadow-lg p-6 md:p-10">
              <h3 className="font-bold text-2xl text-primary mb-4">
                Post a comment
              </h3>
              <p className="text-gray-600 text-sm mb-6">
                Your email address will not be published. Required fields are
                marked <span className="text-red-500">*</span>
              </p>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input
                    type="text"
                    name="name"
                    placeholder="Name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full p-3 border bg-white border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary"
                    required
                  />
                  <input
                    type="email"
                    name="email"
                    placeholder="E-mail"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full p-3 border bg-white border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary"
                    required
                  />
                </div>
                <input
                  type="text"
                  name="website"
                  placeholder="Website"
                  value={formData.website}
                  onChange={handleChange}
                  className="w-full p-3 border bg-white border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary"
                />
                <textarea
                  name="message"
                  placeholder="Message"
                  value={formData.message}
                  onChange={handleChange}
                  rows={6}
                  className="w-full p-3 border bg-white border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary resize-none"
                  required
                ></textarea>
                <button
                  className="btn-bubble btn-bubble-primary"
                  type="submit"
                  disabled={loading}
                >
                  <span>
                    {loading ? "Sending..." : "Send Us Message"}{" "}
                    <ArrowRight size={20} className="ml-2" />
                  </span>
                </button>
                {error && (
                  <p className="text-red-500 text-sm mt-2">{error}</p>
                )}
                {success && (
                  <p className="text-green-600 text-sm mt-2">{success}</p>
                )}
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Google Map Section - Now without API Key */}
      <section className="w-full h-[400px] md:h-[500px] lg:h-[600px] bg-gray-200 relative">
        <iframe
          width="100%"
          height="100%"
          style={{ border: 0 }}
          loading="lazy"
          allowFullScreen
          referrerPolicy="no-referrer-when-downgrade"
          src={`https://maps.google.com/maps?q=${FIXED_MAP_LATITUDE},${FIXED_MAP_LONGITUDE}&z=${FIXED_MAP_ZOOM}&output=embed`}
          title={`Google Map of ${LOCATION_NAME}`} // Dynamic title using LOCATION_NAME
        ></iframe>
      </section>
    </div>
  );
};

export default ContactPage;