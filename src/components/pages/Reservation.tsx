/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState } from "react";
import { ArrowRight, Calendar } from "lucide-react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css"; 
import { format } from "date-fns";

const ReservationPage: React.FC = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    date: "",
    species: "",
    breed: "",
    reason: "",
    specialNote: "",
  });
  // New state to hold the actual Date object selected by the date picker
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // --- NEW: Handle date picker changes ---
  const handleDateChange = (date: Date | null) => {
    setSelectedDate(date);
    // Format the date to "dd/MM/yyyy" string for your formData, or send as ISO string
    // Assuming your backend expects "dd/mm/yyyy" as per your current input placeholder
    setFormData((prev) => ({
      ...prev,
      date: date ? format(date, "dd/MM/yyyy") : "",
    }));
  };
  // --- END NEW ---

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    // Basic validation for date before sending
    if (!selectedDate) {
      setError("Please select a valid date for the appointment.");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch("/api/reservation", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData), // formData now contains the formatted date string
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.message || `HTTP error! status: ${response.status}`
        );
      }

      const result = await response.json();
      console.log("Reservation form data submitted successfully:", result);
      setSuccess("Your appointment request has been sent successfully!");
      setFormData({
        // Clear form fields
        fullName: "",
        email: "",
        phone: "",
        date: "", // Reset date string
        species: "",
        breed: "",
        reason: "",
        specialNote: "",
      });
      setSelectedDate(null); 
    } catch (err: any) {
      console.error("Error submitting reservation form:", err);
      setError(err.message || "Failed to request appointment. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        backgroundImage: 'url("/pages/reservtion/dog.webp")',
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
      className="bg-white py-16 lg:py-24 min-h-screen relative overflow-hidden"
    >
      <div className="container mx-auto px-4 sm:px-16 lg:px-32 flex flex-col lg:flex-row lg:items-start justify-start gap-8 lg:gap-12 relative z-10">
        <div className="w-full lg:w-[65%] xl:w-[70%] bg-newGray rounded-xl shadow-lg p-6 md:p-16">
          <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4">
            Request a Schedule
          </h2>
          <p className="text-gray-600 mb-6">
            Your email address will not be published. Required fields are marked{" "}
            <span className="text-red-500">*</span>
          </p>
          <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6">
            {/* Full Name & E-mail */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <input
                  type="text"
                  name="fullName"
                  placeholder="Full Name"
                  value={formData.fullName}
                  onChange={handleChange}
                  className="w-full px-8 py-3 border bg-white border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-secondary"
                  required
                />
              </div>
              <div>
                <input
                  type="email"
                  name="email"
                  placeholder="E-mail"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-8 py-3 border bg-white border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-secondary"
                  required
                />
              </div>
            </div>

            {/* Phone & Date */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <input
                  type="tel"
                  name="phone"
                  placeholder="Phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full px-8 py-3 border bg-white border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-secondary"
                  required
                />
              </div>
              <div className="relative">
                <DatePicker
                  selected={selectedDate}
                  onChange={handleDateChange}
                  dateFormat="dd/MM/yyyy"
                  placeholderText="dd/mm/yyyy"
                  className="w-full px-8 py-3 border bg-white border-gray-300 rounded-full pr-10 focus:outline-none focus:ring-2 focus:ring-secondary"
                  required
                  minDate={new Date()}
                />
                <Calendar
                  size={20}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                />
              </div>
            </div>

            {/* Species & Breed */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <div className="relative">
                  <select
                    name="species"
                    value={formData.species}
                    onChange={handleChange}
                    className="w-full px-8 py-3 border border-gray-300 rounded-full appearance-none bg-white focus:outline-none focus:ring-2 focus:ring-secondary"
                    required
                  >
                    <option value="" disabled hidden>
                      Species
                    </option>
                    <option value="dog">Dog</option>
                    <option value="cat">Cat</option>
                    <option value="bird">Bird</option>
                    <option value="other">Other</option>
                  </select>
                  <svg
                    className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M19 9l-7 7-7-7"
                    ></path>
                  </svg>
                </div>
              </div>
              <div>
                <input
                  type="text"
                  name="breed"
                  placeholder="Breed"
                  value={formData.breed}
                  onChange={handleChange}
                  className="w-full px-8 py-3 border bg-white border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-secondary"
                  required
                />
              </div>
            </div>

            {/* Reason For Appointment */}
            <div>
              <div className="relative">
                <select
                  name="reason"
                  value={formData.reason}
                  onChange={handleChange}
                  className="w-full px-8 py-3 border border-gray-300 rounded-full appearance-none bg-white focus:outline-none focus:ring-2 focus:ring-secondary"
                  required
                >
                  <option value="" disabled hidden>
                    Reason For Appointment
                  </option>
                  <option value="checkup">Annual Check-up</option>
                  <option value="vaccination">Vaccination</option>
                  <option value="grooming">Grooming</option>
                  <option value="emergency">Emergency</option>
                  <option value="other">Other</option>
                </select>
                <svg
                  className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M19 9l-7 7-7-7"
                  ></path>
                </svg>
              </div>
            </div>

            {/* Special Note */}
            <div>
              <textarea
                name="specialNote"
                placeholder="Special Note..."
                value={formData.specialNote}
                onChange={handleChange}
                rows={4}
                className="w-full px-8 py-3 border bg-white border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-secondary resize-none"
              ></textarea>
            </div>

            {/* Book Now Button */}
            <button
              className="btn-bubble btn-bubble-primary"
              type="submit"
              disabled={loading} // Disable button when loading
            >
              <span>
                {loading ? "Booking..." : "Book Now"}{" "}
                <ArrowRight size={20} className="ml-2" />
              </span>
            </button>

            {/* Displaying feedback messages */}
            {error && (
              <p className="text-red-500 text-sm mt-2 font-medium">{error}</p>
            )}
            {success && (
              <p className="text-green-600 text-sm mt-2 font-medium">
                {success}
              </p>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default ReservationPage;