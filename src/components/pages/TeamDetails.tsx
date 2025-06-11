/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState, useEffect } from "react";
import { motion } from "motion/react"; // Corrected import for motion
import {
  Phone,
  Mail,
  MapPin,
  Facebook,
  Twitter,
  Instagram,
  Youtube,
} from "lucide-react";
import Image from "next/image";
import { useParams } from "next/navigation"; 
import { ITeamMember } from "@/types";
import Loader from "@/components/ui/Loader";

const containerVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 20,
      delayChildren: 0.3,
      staggerChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

const TeamDetails: React.FC = () => {
  const { id } = useParams(); // Get the ID from the URL
  const [teamMember, setTeamMember] = useState<ITeamMember | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) {
      setError("Team member ID is missing.");
      setLoading(false);
      return;
    }

    const fetchTeamMember = async () => {
      try {
        const response = await fetch(`/api/team/${id}`); // Fetch data based on ID
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const result = await response.json();
        if (result.success) {
          setTeamMember(result.data);
        } else {
          setError(result.message || "Failed to fetch team member details.");
        }
      } catch (err: any) {
        console.error("Error fetching team member details:", err);
        setError(err.message || "An unexpected error occurred.");
      } finally {
        setLoading(false);
      }
    };

    fetchTeamMember();
  }, [id]); // Re-run effect if ID changes

  if (loading) {
    return <Loader />; // Show loader while fetching
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center p-4 sm:p-8 font-['Inter']">
        <p className="text-red-500 text-xl">Error: {error}</p>
      </div>
    );
  }

  if (!teamMember) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center p-4 sm:p-8 font-['Inter']">
        <p className="text-gray-600 text-xl">Team member not found.</p>
      </div>
    );
  }

  // Use fetched teamMember data
  const { name, title, description, experience, contact, imageUrl } = teamMember;

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4 sm:p-8 font-['Inter']">
      <motion.div
        className="bg-white flex flex-col lg:flex-row w-full max-w-6xl rounded-lg shadow-xl overflow-hidden"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Left Section - Image */}
        <div className="w-full lg:w-1/3 flex items-center justify-center relative p-4 lg:p-0">
          <motion.div
            className="relative w-64 h-64 sm:w-80 sm:h-80 rounded-full overflow-hidden shadow-lg flex-shrink-0"
            variants={itemVariants}
          >
            <Image
              unoptimized // Keeping unoptimized as it was in the original code
              fill
              src={imageUrl}
              alt={name}
              className="object-cover w-full h-full"
              onError={(e) => {
                // Fallback for image loading error
                e.currentTarget.src =
                  "https://placehold.co/300x300/e0e0e0/555555?text=Image+Unavailable";
              }}
            />
          </motion.div>
        </div>

        {/* Right Section - Content */}
        <div className="w-full lg:w-2/3 lg:pl-8 mt-8 lg:mt-0 p-4">
          {/* Name and Title */}
          <motion.h1
            className="text-4xl font-extrabold text-secondary mb-2"
            variants={itemVariants}
          >
            {name}
          </motion.h1>
          <motion.h2
            className="text-xl text-gray-600 mb-4"
            variants={itemVariants}
          >
            {title}
          </motion.h2>

          {/* Separator Line */}
          <motion.div
            className="w-20 h-2 bg-primary my-6 rounded-full"
            variants={itemVariants}
          ></motion.div>

          {/* Description */}
          <motion.p
            className="text-gray-700 leading-relaxed text-lg mb-8"
            variants={itemVariants}
          >
            {description}
          </motion.p>

          {/* Experience Section */}
          <motion.div className="mb-8" variants={itemVariants}>
            <h3 className="text-2xl font-semibold text-primary mb-4">
              Experience:
            </h3>
            <p className="text-gray-700 leading-relaxed text-lg">
              {experience}
            </p>
          </motion.div>

          {/* Information Section */}
          <motion.div className="mb-8" variants={itemVariants}>
            <h3 className="text-2xl font-semibold text-primary mb-4">
              Information:
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-8">
              <motion.div
                className="flex items-center gap-3 text-gray-700 text-lg"
                variants={itemVariants}
              >
                <Phone className="w-6 h-6 text-secondary" />
                {contact.phone}
              </motion.div>
              <motion.div
                className="flex items-center gap-3 text-gray-700 text-lg"
                variants={itemVariants}
              >
                <MapPin className="w-6 h-6 text-secondary" />
                {contact.address}
              </motion.div>
              <motion.div
                className="flex items-center gap-3 text-gray-700 text-lg"
                variants={itemVariants}
              >
                <Mail className="w-6 h-6 text-secondary" />
                {contact.email}
              </motion.div>
              <motion.div
                className="flex items-center gap-4 mt-4"
                variants={itemVariants}
              >
                {/* Social Media Icons using Lucide React */}
                {contact.social?.facebook && (
                  <a
                    href={contact.social.facebook}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-secondary hover:text-primary transition-colors duration-200"
                  >
                    <Facebook className="w-7 h-7" />
                  </a>
                )}
                {contact.social?.twitter && (
                  <a
                    href={contact.social.twitter}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-secondary hover:text-primary transition-colors duration-200"
                  >
                    <Twitter className="w-7 h-7" />
                  </a>
                )}
                {contact.social?.instagram && (
                  <a
                    href={contact.social.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-secondary hover:text-primary transition-colors duration-200"
                  >
                    <Instagram className="w-7 h-7" />
                  </a>
                )}
                {contact.social?.youtube && (
                  <a
                    href={contact.social.youtube}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-secondary hover:text-primary transition-colors duration-200"
                  >
                    <Youtube className="w-7 h-7" />
                  </a>
                )}
              </motion.div>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default TeamDetails;