/* eslint-disable @typescript-eslint/no-explicit-any */
// src/components/common/TestimonialSection.tsx
"use client";
import React, { useState, useCallback } from "react";
import Image from "next/image";
import { Star } from "lucide-react";
import { Calendar, Clock, MoveRight, ChevronDown } from "lucide-react";

import { format, isValid, parse } from "date-fns";

const TestimonialSection = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    date: "",
    time: "",
    species: "",
    breed: "",
    reason: "",
    specialNote: "", // Added specialNote back for completeness
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement> // Include TextAreaElement
  ) => {
    const { name, value } = e.target;
    if (name === "name") {
      setFormData((prev) => ({ ...prev, fullName: value }));
    } else if (name === "petType") {
      setFormData((prev) => ({ ...prev, species: value }));
    } else if (name === "interestIn") {
      setFormData((prev) => ({ ...prev, reason: value }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleInputBlur = useCallback(
    (e: React.FocusEvent<HTMLInputElement>, originalPlaceholder: string) => {
      if (e.target.value === "") {
        e.target.type = "text";
        e.target.placeholder = originalPlaceholder;
      }
    },
    []
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    const { fullName, email, phone, date, time, species, breed, reason, specialNote } = formData;

    if (
      !fullName ||
      !email ||
      !phone ||
      !date ||
      !time ||
      !species ||
      !breed ||
      !reason
    ) {
      setError("Please fill in all required fields.");
      setLoading(false);
      return;
    }

    const dateTimeString = `${date}T${time}`;
    const parsedDate = parse(dateTimeString, "yyyy-MM-dd'T'HH:mm", new Date());

    if (!isValid(parsedDate)) {
      setError("Please provide a valid date and time for the appointment.");
      setLoading(false);
      return;
    }

    const formattedDateForBackend = format(parsedDate, "dd/MM/yyyy HH:mm");

    const reservationDataToSend = {
      fullName: fullName,
      email: email,
      phone: phone,
      date: formattedDateForBackend,
      species: species,
      breed: breed,
      reason: reason,
      specialNote: specialNote || "",
    };

    try {
      const response = await fetch("/api/reservation", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(reservationDataToSend),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.message || `HTTP error! status: ${response.status}`
        );
      }

      const result = await response.json();
      console.log("Reservation request sent successfully:", result);
      setSuccess("Your visit request has been sent successfully!");
      setFormData({
        fullName: "",
        email: "",
        phone: "",
        date: "",
        time: "",
        species: "",
        breed: "",
        reason: "",
        specialNote: "",
      });
    } catch (err: any) {
      console.error("Error submitting visit request:", err);
      setError(
        err.message || "Failed to send visit request. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="relative mb-72 sm:mb-96 lg:mb-[30rem] xl:mb-[35rem]"> {/* Adjusted bottom margin */}
      <div className="relative pt-20 lg:pt-24 xl:pt-30 pb-72 overflow-hidden bg-secondary-50">
        {/* Background paw print 1 (top-left) - hidden on small screens */}
        <div className="absolute top-8 left-0 z-0 hidden md:block">
          <Image
            src="/images/testimonial/testimonial_shape01.png"
            alt="Paw icon background"
            width={120}
            height={120}
            className="w-50 h-50 "
          />
        </div>
        <div className="absolute bottom-0 left-2 z-0 hidden md:block">
          <Image
            src="/images/testimonial/testimonial_shape02.png"
            alt="Paw icon background"
            width={120}
            height={120}
            className="w-26 h-26"
          />
        </div>

        {/* Background paw print 2 (bottom-right) - hidden on small screens */}
        <div className="absolute bottom-80 right-8 z-0 hidden md:block">
          <Image
            src="/images/testimonial/testimonial_shape03.png"
            alt="Paw icon background"
            width={100}
            height={100}
            className="w-24 h-24"
          />
        </div>

        <div className="container mx-auto px-4 custom-container">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-12 lg:gap-20">
            <div className="w-full lg:w-6/12 flex flex-col items-center lg:items-end text-center lg:text-left">
              <div className="w-full max-w-lg">
                <div className="flex justify-center mb-4 relative ">
                  <Image
                    height={100}
                    width={100}
                    className="w-20 h-20"
                    alt="qoute"
                    src={"/images/testimonial/quote.svg"}
                  />
                </div>
                <h3 className="text-3xl lg:text-4xl text-center font-extrabold text-primary mb-4">
                  Pet Health Important
                </h3>
                <p className="text-lg lg:text-xl text-center font-medium text-primary italic leading-relaxed mb-8">
                  &quot;I was genuinely impressed with how they cared for my
                  pet&apos;s health like their own. From diet consultation to
                  grooming tips, everything was so well-explained and
                  personalized. My dog is happier and healthier!&quot;
                </p>
                <div className="flex items-center justify-center space-x-4">
                  {" "}
                  <Image
                    src="/images/testimonial/testiminal.png"
                    alt="Uraney Jacke"
                    width={40}
                    height={40}
                    className="w-10 h-10 rounded-full object-cover shadow-sm"
                  />
                  <div className="text-left">
                    {" "}
                    <h5 className="text-xl font-semibold text-secondary">
                      Ritika Gupta
                    </h5>
                    <span className="text-gray-600 text-sm">
                      Pet Parent, Noida
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="w-full lg:w-6/12 flex justify-center relative">
              <Image
                src="/images/testimonial/testimonial.webp"
                alt="Happy senior couple with their dog"
                width={1000}
                height={1000}
                className="rounded-full w-[60vw] h-[60vw] sm:w-[45vw] sm:h-[45vw] md:w-[34vw] md:h-[34vw] lg:w-[34vw] lg:h-[34vw] z-10 object-cover"
              />
              {/* Reviews Badge */}
              <div className="absolute top-1/4 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-30
                          md:top-1/4 md:left-0 md:translate-x-1/2"> {/* Adjusted position for mobile */}
                <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-full flex flex-col items-center justify-center text-white p-2 text-center shadow-xl bg-secondary">
                  <span className="text-xl sm:text-2xl font-bold">1500+</span> {/* Adjusted font size */}
                  <div className="flex mt-1">
                    <Star size={14} fill="yellow" stroke="yellow" className="text-yellow-400" /> {/* Smaller stars */}
                    <Star size={14} fill="yellow" stroke="yellow" className="text-yellow-400" />
                    <Star size={14} fill="yellow" stroke="yellow" className="text-yellow-400" />
                    <Star size={14} fill="yellow" stroke="yellow" className="text-yellow-400" />
                    <Star size={14} fill="yellow" stroke="yellow" className="text-yellow-400" />
                  </div>
                  <span className="text-xs mt-1">Reviews</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Reservation Form Section */}
      <div className="absolute z-30 w-full flex justify-center -bottom-60 sm:-bottom-64 lg:-bottom-[20rem] xl:-bottom-[25rem] px-4"> {/* Adjusted bottom positioning */}
        <div
          className="w-full max-w-7xl p-6 sm:p-8 md:p-12 lg:p-16
             bg-primary overflow-hidden shadow-2xl
             rounded-bl-[5rem] rounded-tr-[5rem] rounded-br-[1.5rem] rounded-tl-[1.5rem]
             sm:rounded-bl-[8rem] sm:rounded-tr-[8rem] sm:rounded-br-[2rem] sm:rounded-tl-[2rem]
             lg:rounded-bl-[10rem] lg:rounded-tr-[10rem] lg:rounded-br-[3rem] lg:rounded-tl-[3rem]"
        >
          <h2 className="text-center text-xl sm:text-2xl lg:text-4xl font-extrabold text-white mb-6 sm:mb-8"> {/* Adjusted heading size */}
            Schedule A Visit Today!
          </h2>

          <form
            onSubmit={handleSubmit}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6"
          >
            {/* Form Fields */}
            <div>
              <label htmlFor="name" className="sr-only">
                Full Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                placeholder="Full Name"
                value={formData.fullName}
                onChange={handleChange}
                className="w-full bg-primary-600 border border-white/10 text-white
                   px-5 py-3 rounded-lg text-sm sm:text-base outline-none
                   transition-all duration-200
                   focus:border-secondary-400 focus:ring-4 focus:ring-secondary-400/30
                   placeholder-white/50"
                required
              />
            </div>

            <div>
              <label htmlFor="email" className="sr-only">
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                placeholder="Your Email"
                value={formData.email}
                onChange={handleChange}
                className="w-full bg-primary-600 border border-white/10 text-white
                   px-5 py-3 rounded-lg text-sm sm:text-base outline-none
                   transition-all duration-200
                   focus:border-secondary-400 focus:ring-4 focus:ring-secondary-400/30
                   placeholder-white/50"
                required
              />
            </div>

            <div className="relative">
              <label htmlFor="petType" className="sr-only">
                Pet Type
              </label>
              <select
                id="petType"
                name="petType"
                value={formData.species}
                onChange={handleChange}
                className="w-full bg-primary-600 border border-white/10 text-white
                   px-5 py-3 rounded-lg text-sm sm:text-base outline-none appearance-none pr-10
                   transition-all duration-200
                   focus:border-secondary-400 focus:ring-4 focus:ring-secondary-400/30
                   placeholder-white/50"
                required
              >
                <option value="">Select Pet Type</option>
                <option value="dog">Dog</option>
                <option value="cat">Cat</option>
                <option value="bird">Bird</option>
                <option value="other">Other</option>
              </select>
              <ChevronDown
                size={20}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-white/50 pointer-events-none"
              />
            </div>

            <div>
              <label htmlFor="breed" className="sr-only">
                Breed
              </label>
              <input
                type="text"
                id="breed"
                name="breed"
                placeholder="Pet Breed (e.g., Golden Retriever)"
                value={formData.breed}
                onChange={handleChange}
                className="w-full bg-primary-600 border border-white/10 text-white
                   px-5 py-3 rounded-lg text-sm sm:text-base outline-none
                   transition-all duration-200
                   focus:border-secondary-400 focus:ring-4 focus:ring-secondary-400/30
                   placeholder-white/50"
                required
              />
            </div>

            <div className="relative">
              <label htmlFor="interestIn" className="sr-only">
                Interest In
              </label>
              <select
                id="interestIn"
                name="interestIn"
                value={formData.reason}
                onChange={handleChange}
                className="w-full bg-primary-600 border border-white/10 text-white
                   px-5 py-3 rounded-lg text-sm sm:text-base outline-none appearance-none pr-10
                   transition-all duration-200
                   focus:border-secondary-400 focus:ring-4 focus:ring-secondary-400/30
                   placeholder-white/50"
                required
              >
                <option value="">Select Service</option>
                <option value="checkup">Annual Check-up</option>
                <option value="vaccination">Vaccination</option>
                <option value="grooming">Grooming</option>
                <option value="emergency">Emergency</option>
                <option value="other">Other</option>
              </select>
              <ChevronDown
                size={20}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-white/50 pointer-events-none"
              />
            </div>

            <div className="relative">
              <label htmlFor="date" className="sr-only">
                Date
              </label>
              <input
                type="text"
                id="date"
                name="date"
                placeholder="Appointment Date"
                value={formData.date}
                onChange={handleChange}
                className="w-full bg-primary-600 border border-white/10 text-white
                   px-5 py-3 rounded-lg text-sm sm:text-base outline-none pr-10
                   transition-all duration-200
                   focus:border-secondary-400 focus:ring-4 focus:ring-secondary-400/30
                   placeholder-white/50"
                onFocus={(e) => (e.target.type = "date")}
                onBlur={(e) => handleInputBlur(e, "Appointment Date")}
                required
              />
              <Calendar
                size={20}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-white/50 pointer-events-none"
              />
            </div>

            <div className="relative">
              <label htmlFor="time" className="sr-only">
                Time
              </label>
              <input
                type="text"
                id="time"
                name="time"
                placeholder="Appointment Time (HH:MM)"
                value={formData.time}
                onChange={handleChange}
                className="w-full bg-primary-600 border border-white/10 text-white
                   px-5 py-3 rounded-lg text-sm sm:text-base outline-none pr-10
                   transition-all duration-200
                   focus:border-secondary-400 focus:ring-4 focus:ring-secondary-400/30
                   placeholder-white/50"
                onFocus={(e) => (e.target.type = "time")}
                onBlur={(e) => handleInputBlur(e, "Appointment Time (HH:MM)")}
                required
              />
              <Clock
                size={20}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-white/50 pointer-events-none"
              />
            </div>

            <div>
              <label htmlFor="phone" className="sr-only">
                Phone
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                placeholder="Phone Number"
                value={formData.phone}
                onChange={handleChange}
                className="w-full bg-primary-600 border border-white/10 text-white
                   px-5 py-3 rounded-lg text-sm sm:text-base outline-none
                   transition-all duration-200
                   focus:border-secondary-400 focus:ring-4 focus:ring-secondary-400/30
                   placeholder-white/50"
                required
              />
            </div>

            {/* Special Note */}
            <div className="md:col-span-2 lg:col-span-3"> {/* Spans 2 cols on md, 3 on lg */}
              <label htmlFor="specialNote" className="sr-only">
                Special Note
              </label>
              <textarea
                id="specialNote"
                name="specialNote"
                placeholder="Any special notes or requests?"
                value={formData.specialNote}
                onChange={handleChange}
                rows={3}
                className="w-full bg-primary-600 border border-white/10 text-white
                   px-5 py-3 rounded-lg text-sm sm:text-base outline-none resize-none
                   transition-all duration-200
                   focus:border-secondary-400 focus:ring-4 focus:ring-secondary-400/30
                   placeholder-white/50"
              ></textarea>
            </div>

            <div className="md:col-span-2 lg:col-span-3 flex flex-col items-center justify-center mt-6 sm:mt-8"> {/* Spans 2 cols on md, 3 on lg */}
              <button
                type="submit"
                className="btn-bubble btn-bubble-four"
                disabled={loading}
              >
                <span>
                  <span>
                    {loading ? "Sending Request..." : "Start A Reservation"}
                  </span>
                  <MoveRight size={20} />
                </span>
              </button>
              {error && (
                <p className="text-red-300 text-sm mt-4 text-center font-medium">
                  {error}
                </p>
              )}
              {success && (
                <p className="text-green-300 text-sm mt-4 text-center font-medium">
                  {success}
                </p>
              )}
            </div>
          </form>
        </div>
      </div>
    </section>
  );
};

export default TestimonialSection;