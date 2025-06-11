/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Check, PawPrint, Calendar, Palette, Scale, Info } from "lucide-react";
import Image from "next/image"; // Import Image for Next.js optimized images
import Loader from "@/components/ui/Loader";
import { IPet } from "@/types"; // Import your IPet interface
import { useParams, useRouter } from "next/navigation";

// --- ImageSlider Component ---
interface ImageSliderProps {
  images: string[];
}

const ImageSlider: React.FC<ImageSliderProps> = ({ images }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
  };

  const handlePrev = () => {
    setCurrentIndex(
      (prevIndex) => (prevIndex - 1 + images.length) % images.length
    );
  };

  return (
    <div className="relative w-full h-96 overflow-hidden rounded-lg shadow-md">
      <AnimatePresence initial={false} mode="wait">
        {" "}
        {/* Use mode="wait" to prevent exit animation before enter */}
        <motion.div
          key={currentIndex}
          className="w-full h-full"
          initial={{ opacity: 0, x: 0 }} // Corrected initial state to prevent jump
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Image
            unoptimized
            src={images[currentIndex] || "/images/pets/placeholder.jpg"}
            alt={`Pet Image ${currentIndex + 1}`}
            fill // Use fill for Image component
            style={{ objectFit: "cover" }}
            className="w-full h-full object-cover"
          />
        </motion.div>
      </AnimatePresence>
      {images.length > 1 && ( // Only show navigation if more than one image
        <>
          <button
            onClick={handlePrev}
            className="absolute left-4 top-1/2 -translate-y-1/2 bg-white bg-opacity-70 rounded-full p-2 shadow-lg focus:outline-none hover:bg-opacity-100 transition-colors"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 text-gray-700"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>
          <button
            onClick={handleNext}
            className="absolute right-4 top-1/2 -translate-y-1/2 bg-white bg-opacity-70 rounded-full p-2 shadow-lg focus:outline-none hover:bg-opacity-100 transition-colors"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 text-gray-700"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2">
            {images.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`h-2 w-2 rounded-full ${
                  currentIndex === index ? "bg-white" : "bg-gray-400"
                }`}
              ></button>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

// --- PetCard Component for "You May Also Like" Section ---
interface SuggestedPetCardProps {
  pet: IPet; // Changed to use IPet for consistency
}

const SuggestedPetCard: React.FC<SuggestedPetCardProps> = ({ pet }) => {
  const router = useRouter(); // Using useRouter for navigation

  return (
    <motion.div
      whileHover={{ scale: 1.03 }}
      className="bg-white rounded-lg shadow-md p-4 flex-shrink-0 w-64 cursor-pointer"
      onClick={() => router.push(`/petdetails/${pet._id}`)} // Route to suggested pet details
    >
      <div className="relative mb-4 w-full h-40">
        <Image
          unoptimized
          src={pet.images?.[0] || "/images/pets/placeholder.jpg"}
          alt={pet.name}
          fill
          style={{ objectFit: "cover" }}
          className="rounded-md"
        />
        <button className="absolute top-2 right-2 bg-white rounded-full p-1 shadow-sm">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 text-red-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
            />
          </svg>
        </button>
      </div>
      <h3 className="text-lg font-semibold text-gray-800 mb-1">{pet.name}</h3>
      <p className="text-sm text-gray-600 mb-1">
        <span className="font-medium text-primary">• Gender:</span> {pet.gender}
      </p>
      <p className="text-sm text-gray-600 mb-1">
        {/* Assuming 'type' from IPet can be used as 'breed' */}
        <span className="font-medium text-primary">• Type:</span> {pet.type}
      </p>
      <p className="text-sm text-gray-600 flex items-center">
        <span className="font-medium text-primary mr-1">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4 inline-block mr-1"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.828 0L6.343 16.657a8 8 0 1111.314 0z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
            />
          </svg>
        </span>
        {pet.location}
      </p>
    </motion.div>
  );
};

// --- Helper component for consistent detail item styling ---
const DetailItem: React.FC<{
  icon: React.ReactNode;
  label: string;
  value?: string | number;
}> = ({ icon, label, value }) => (
  <p className="flex items-center text-gray-700">
    <span className="text-secondary mr-3">{icon}</span>
    <span className="font-semibold mr-1">{label}:</span>
    <span>{value || "N/A"}</span> {/* Display N/A if value is null/undefined */}
  </p>
);

const PetDetailsPage = () => {
  const { id } = useParams<{ id: string }>();
  const [pet, setPet] = useState<IPet | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [suggestedPets, setSuggestedPets] = useState<IPet[]>([]); // State for suggested pets

  useEffect(() => {
    if (!id) return;

    const fetchPetDetails = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(`/api/pets/${id}`); // Fetch specific pet by ID
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        if (data.success) {
          setPet(data.data);
        } else {
          setError(data.message || "Failed to fetch pet details.");
        }
      } catch (err: any) {
        console.error("Error fetching pet details:", err);
        setError(err.message || "An unexpected error occurred.");
      } finally {
        setLoading(false);
      }
    };

    const fetchSuggestedPets = async () => {
      try {
        // for "similar" pets, e.g., by category, type, or random.
        const response = await fetch(
          `/api/pets?limit=4&category=${pet?.category || ""}&excludeId=${id}`
        );
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        if (data.success) {
          setSuggestedPets(data.data);
        } else {
          console.warn("Failed to fetch suggested pets:", data.message);
        }
      } catch (err) {
        console.error("Error fetching suggested pets:", err);
      }
    };

    fetchPetDetails();
    // Only fetch suggested pets once main pet data is loaded
    if (pet) {
      fetchSuggestedPets();
    }
  }, [id, pet, pet?.category]); // Re-fetch suggested pets if main pet's category changes

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <Loader />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <p className="text-xl text-red-600">Error: {error}</p>
      </div>
    );
  }

  if (!pet) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <p className="text-xl text-gray-600">Pet not found.</p>
      </div>
    );
  }

  return (
    <section className="px-4 py-16 md:px-8 lg:px-32 lg:py-24 bg-gray-50 min-h-screen">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white rounded-xl shadow-lg p-6 lg:p-10"
      >
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
          {/* Left Column: Image Slider, Description, Additional Info */}
          <div className="lg:col-span-2">
            {pet.images && pet.images.length > 0 ? (
              <ImageSlider images={pet.images} />
            ) : (
              <div className="relative w-full h-96 overflow-hidden rounded-lg shadow-md flex items-center justify-center bg-gray-200 text-gray-500">
                <p>No images available</p>
              </div>
            )}

            {pet.description && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.5 }}
                className="bg-white rounded-lg shadow-md p-6 mt-8"
              >
                <h3 className="text-xl font-semibold text-gray-800 mb-4">
                  Description
                </h3>
                <p className="text-gray-700 leading-relaxed">
                  {pet.description}
                </p>
              </motion.div>
            )}

            {pet.additionalInfo && pet.additionalInfo.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.5 }}
                className="bg-white rounded-lg shadow-md p-6 mt-8"
              >
                <h3 className="text-xl font-semibold text-gray-800 mb-4">
                  More Additional Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-y-2">
                  {pet.additionalInfo.map((info, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.5 + index * 0.1, duration: 0.3 }}
                      className="flex items-center text-gray-700"
                    >
                      <span className="text-primary mr-2 text-lg">
                        <Check />
                      </span>
                      {info}
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}
          </div>

          {/* Right Column: Price & Details, Add to Cart, Share, Map */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="bg-white rounded-lg shadow-md p-6"
            >
              <h2 className="text-2xl font-bold text-gray-800 mb-4">
                {pet.name}
              </h2>
              <p className="text-primary text-3xl font-bold mb-4">
                ${pet.price}
              </p>

              <div className="grid grid-cols-1 gap-y-2 text-gray-700 mb-6">
                <DetailItem
                  icon={<Calendar size={20} />}
                  label="Available Date"
                  value={pet.availableDate}
                />
                <DetailItem
                  icon={<PawPrint size={20} />}
                  label="Type"
                  value={pet.type}
                />{" "}
                {/* Using pet.type for breed */}
                <DetailItem
                  icon={<Palette size={20} />}
                  label="Color"
                  value={pet.color}
                />
                <DetailItem
                  icon={<Info size={20} />}
                  label="Gender"
                  value={pet.gender}
                />
                <DetailItem
                  icon={<Scale size={20} />}
                  label="Weight"
                  value={pet.weight}
                />
                <DetailItem
                  icon={<Calendar size={20} />}
                  label="Date of Birth"
                  value={pet.dateOfBirth}
                />
              </div>

              {/* <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}

              >
                Add to Cart
              </motion.button> */}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7, duration: 0.5 }}
              className="bg-white rounded-lg shadow-md p-6 mt-8"
            >
              <h3 className="text-xl font-semibold text-gray-800 mb-4">
                Share This Post
              </h3>
              <div className="flex space-x-4">
                <motion.a
                  whileHover={{ scale: 1.1 }}
                  href="https://facebook.com/sharer/sharer.php?u=YOUR_PET_DETAIL_URL" // Replace with actual URL
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-600 hover:text-blue-600 transition-colors"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-7 w-7"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.58-1.333h2.42v-3h-3.42c-3.411 0-5.58 2.061-5.58 5.667v1.333z" />
                  </svg>
                </motion.a>
                <motion.a
                  whileHover={{ scale: 1.1 }}
                  href="https://twitter.com/intent/tweet?url=YOUR_PET_DETAIL_URL&text=Check%20out%20this%20adorable%20pet!" // Replace with actual URL
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-600 hover:text-blue-400 transition-colors"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-7 w-7"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.459 0-6.255 2.796-6.255 6.255 0 .486.056.96.168 1.414-5.209-.262-9.856-2.73-12.96-6.49-.536.924-.844 1.99-.844 3.139 0 2.164 1.166 4.084 2.915 5.207-.857-.025-1.65-.262-2.35-.615v.08c0 3.053 2.169 5.592 5.068 6.182-.529.141-1.083.213-1.65.213-.403 0-.795-.039-1.177-.113.811 2.507 3.161 4.33 5.928 4.381-2.158 1.684-4.887 2.697-7.85 2.697-.512 0-1.02-.03-1.515-.087 2.78 1.791 6.096 2.841 9.697 2.841 11.696 0 18.17-9.096 18.17-17.065 0-.261-.005-.519-.014-.778 1.246-.893 2.339-1.994 3.195-3.238z" />
                  </svg>
                </motion.a>
                {/* No specific WhatsApp SVG, assuming the one from previous context was meant for generic share icon or removed */}
                {/* <motion.a
                  whileHover={{ scale: 1.1 }}
                  href="#"
                  className="text-gray-600 hover:text-green-500 transition-colors"
                >
                </motion.a> */}
                <motion.a
                  whileHover={{ scale: 1.1 }}
                  href={`mailto:?subject=Check out this adorable pet!&body=I found this pet on our website: YOUR_PET_DETAIL_URL`} // Replace with actual URL
                  className="text-gray-600 hover:text-red-600 transition-colors"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-7 w-7"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 0c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm-3 18v-12l9 6-9 6z" />
                  </svg>
                </motion.a>
              </div>
            </motion.div>

            {pet.mapLocation && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8, duration: 0.5 }}
                className="bg-white rounded-lg shadow-md p-6 mt-8"
              >
                <h3 className="text-xl font-semibold text-gray-800 mb-4">
                  Map Location
                </h3>
                <div className="relative w-full h-64 rounded-md overflow-hidden mb-4">
                  <iframe
                    src={pet.mapLocation.link}
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen={false}
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                  ></iframe>
                </div>
                <p className="text-gray-700 mb-2">{pet.mapLocation.address}</p>
                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${pet.mapLocation.coords.lat},${pet.mapLocation.coords.lng}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline"
                >
                  View larger map
                </a>
              </motion.div>
            )}
          </div>
        </div>

        {/* You May Also Like Section */}
        {suggestedPets.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9, duration: 0.5 }}
            className="mt-12"
          >
            <h2 className="text-2xl font-bold text-gray-800 mb-6">
              You May Also Like
            </h2>
            <div className="flex overflow-x-auto space-x-6 pb-4 scrollbar-hide">
              {suggestedPets.map((suggestedPet) => (
                <SuggestedPetCard key={suggestedPet._id} pet={suggestedPet} />
              ))}
            </div>
          </motion.div>
        )}
      </motion.div>
    </section>
  );
};

export default PetDetailsPage;
