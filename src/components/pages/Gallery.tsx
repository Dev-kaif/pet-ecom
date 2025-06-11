/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect, useCallback } from "react";
import { motion } from "motion/react";
import Pagination from "@/components/ui/pagination";
import Image from "next/image";
import { IGalleryImage } from "@/types";

const Gallery: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [galleryImages, setGalleryImages] = useState<IGalleryImage[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [totalPages, setTotalPages] = useState<number>(1);
  const ITEMS_PER_PAGE = 9;

  // Function to fetch gallery images from the backend API
  const fetchGalleryImages = useCallback(async (page: number) => {
    setLoading(true);
    setError(null);
    try {
      // Construct the API URL with pagination parameters
      const response = await fetch(
        `/api/gallery?page=${page}&limit=${ITEMS_PER_PAGE}`
      );
      const data = await response.json();

      if (data.success) {
        setGalleryImages(data.data); // Set the fetched images
        setTotalPages(data.pagination.totalPages); // Set total pages from backend
      } else {
        setError(data.message || "Failed to fetch gallery images.");
      }
    } catch (err: any) {
      setError(err.message || "Network error fetching gallery images.");
    } finally {
      setLoading(false);
    }
  }, []); // Dependencies are empty as it's a fixed fetch function

  // Effect to fetch images when the component mounts or currentPage changes
  useEffect(() => {
    fetchGalleryImages(currentPage);
  }, [currentPage, fetchGalleryImages]); // Re-fetch when currentPage changes

  // Handler for page change from the Pagination component
  const handlePageChange = (page: number) => {
    // Ensure the page number is within valid bounds before setting
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return (
    <div className="min-h-screen bg-white p-8 font-sans antialiased flex flex-col items-center px-4 sm:px-8 md:px-16 lg:px-32 py-10 sm:py-16 md:py-20">
      <h1 className="text-4xl font-extrabold text-gray-900 mb-10 text-center">
        Our Image Gallery
      </h1>

      {loading && (
        <p className="text-gray-600 text-lg py-10">Loading images...</p>
      )}
      {error && <p className="text-red-600 text-lg py-10">Error: {error}</p>}
      {!loading && !error && galleryImages.length === 0 && (
        <p className="text-gray-600 text-lg py-10">
          No images found in the gallery.
        </p>
      )}

      {/* Image Grid */}
      {!loading && !error && galleryImages.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 p-4 rounded-xl w-full max-w-7xl">
          {galleryImages.map((image, index) => (
            <motion.div
              key={image._id?.toString() || index} // Use MongoDB _id as key, fallback to index
              className="relative w-full h-64 overflow-hidden rounded-lg shadow-md group cursor-pointer transform transition-all duration-300 ease-in-out"
              initial={{ opacity: 0, y: 50, scale: 0.8 }} // Initial animation state
              animate={{ opacity: 1, y: 0, scale: 1 }} // Animate to this state
              transition={{ duration: 0.6, delay: index * 0.1 }} // Staggered animation
              whileHover={{
                scale: 1.05,
                rotate: 2,
                boxShadow: "0 15px 30px rgba(0,0,0,0.2)",
              }}
              whileTap={{ scale: 0.95 }} // Tap effect
            >
              <Image
                unoptimized // Use unoptimized for external URLs or if Next.js image optimization is not configured
                fill // Fills the parent element
                src={image.imageUrl} // Use imageUrl from fetched data
                alt={`Gallery Image ${index + 1}`}
                className="object-cover transition-transform duration-300 group-hover:scale-110"
                sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, 33vw" // Responsive image sizes
                onError={(e) => {
                  (e.target as HTMLImageElement).src =
                    "https://placehold.co/600x400/8B5CF6/FFFFFF?text=Image+Error"; // Fallback for broken images
                }}
              />
              {/* Optional overlay for interaction feedback */}
              <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <p className="text-white text-lg font-semibold">View</p>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Pagination Component - only show if there's more than one page */}
      {!loading && !error && totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      )}
    </div>
  );
};

export default Gallery;
