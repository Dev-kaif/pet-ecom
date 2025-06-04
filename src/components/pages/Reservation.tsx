// src/pages/reservation.tsx
"use client";

import React, { useState } from "react";
import Image from "next/image";
import { ArrowRight, Calendar } from "lucide-react";

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

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission logic here
    console.log("Form data submitted:", formData);
    alert("Appointment requested!"); // Simple alert for demonstration
  };

  return (
    <div className="bg-white py-16 lg:py-24 min-h-screen relative overflow-hidden">
      {" "}
      {/* Added relative and overflow-hidden */}
      <div className="container mx-auto px-4 sm:px-16 lg:px-32 flex flex-col lg:flex-row lg:items-start justify-center gap-8 lg:gap-12 relative z-10">
        {" "}
        {/* Adjusted gap and alignment */}
        {/* Left Side: Form - Now wider and standalone */}
        <div className="w-full lg:w-[65%] xl:w-[70%] bg-newGray rounded-xl shadow-lg p-6 md:p-16">
          {" "}
          {/* Adjusted width to be much larger */}
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
                <input
                  type="text" // Using text type for dd/mm/yyyy, consider a date picker library for production
                  name="date"
                  placeholder="dd/mm/yyyy"
                  value={formData.date}
                  onChange={handleChange}
                  className="w-full px-8 py-3 border bg-white border-gray-300 rounded-full pr-10 focus:outline-none focus:ring-2 focus:ring-secondary"
                  required
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
            <button className="btn-bubble btn-bubble-primary" type="submit">
              <span>
                Book Now <ArrowRight size={20} className="ml-2" />
              </span>
            </button>
          </form>
        </div>
        {/* Right Side: Image - Now positioned outside the form box and responsive */}
        <div className="hidden lg:block lg:w-[35%] xl:w-[30%] relative">
          <div className="absolute inset-0 flex items-center justify-center">
            <Image
              src="/images/labrador-cat.png" // Ensure this image path is correct
              alt="Labrador and Persian Cat"
              width={700} // Increased base width for a larger image
              height={700} // Increased base height
              className="object-contain w-full h-auto max-h-[80vh] drop-shadow-md" // More responsive sizing and shadow
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReservationPage;
