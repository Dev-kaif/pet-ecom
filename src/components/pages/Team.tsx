/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import Image from "next/image";
import Link from "next/link";
import { Facebook, Twitter, Instagram, Linkedin } from "lucide-react";
import { ITeamMember } from "@/types";
import Loader from "@/components/ui/Loader"; 

const DoctorsTeamPage = () => {
  const [teamMembers, setTeamMembers] = useState<ITeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTeamMembers = async () => {
      try {
        const response = await fetch("/api/team"); // Fetch all team members
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const result = await response.json();
        if (result.success) {
          setTeamMembers(result.data);
        } else {
          setError(result.message || "Failed to fetch team members.");
        }
      } catch (err: any) {
        console.error("Error fetching team members:", err);
        setError(err.message || "An unexpected error occurred.");
      } finally {
        setLoading(false);
      }
    };

    fetchTeamMembers();
  }, []);

  if (loading) {
    return <Loader />;
  }

  if (error) {
    return (
      <section className="relative py-20 lg:py-24 xl:py-30 overflow-hidden bg-white flex justify-center items-center h-screen">
        <p className="text-red-500 text-xl">Error: {error}</p>
      </section>
    );
  }

  if (teamMembers.length === 0) {
    return (
      <section className="relative py-20 lg:py-24 xl:py-30 overflow-hidden bg-white flex justify-center items-center h-screen">
        <p className="text-gray-600 text-xl">No team members found.</p>
      </section>
    );
  }

  return (
    <section className="relative py-20 lg:py-24 xl:py-30 overflow-hidden bg-white">
      <div className="container mx-auto px-4 custom-container">
        {/* Section Title */}
        <div className="flex justify-center text-center mb-16 lg:mb-20">
          <div className="w-full lg:w-8/12 xl:w-6/12">
            <div className="section__title space-y-4">
              <span className="text-secondary text-lg font-bold tracking-wider flex items-center justify-center">
                OUR DEDICATED PROFESSIONALS{" "}
                <span className="ml-2 text-xl">
                  <Image
                    width={100}
                    height={100}
                    className="w-4 h-4 text-secondary flex-shrink-0 mb-2 "
                    src="/images/icon/why_icon01.svg"
                    alt="check"
                  />
                </span>
              </span>
              <h2 className="text-4xl lg:text-5xl font-extrabold leading-tight text-primary mt-2">
                Meet All Our Expertise <br /> Pet Doctors & Staff
              </h2>
            </div>
          </div>
        </div>

        {/* Team Members Grid - Displays ALL fetched team members */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-12 justify-items-center px-32">
          <AnimatePresence>
            {teamMembers.map(
              (
                member,
                index // No filter or slice here
              ) => (
                <motion.div
                  key={member._id || index}
                  className="team__item flex flex-col items-center text-center group relative"
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.3 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                >
                  <div className="team-image-wrapper w-[240px] h-[240px] rounded-full p-2 bg-gradient-to-br from-secondary-100 via-white to-secondary-100 flex items-center justify-center mb-6">
                    <div
                      className="absolute inset-0 rounded-full pointer-events-none"
                      style={{
                        borderStyle: "dashed",
                        borderWidth: "2px",
                        borderColor: "var(--color-secondary)",
                      }}
                    ></div>

                    <div className="w-[220px] h-[220px] rounded-full overflow-hidden relative z-0">
                      <Image
                        src={member.imageUrl}
                        alt={member.name}
                        layout="fill"
                        objectFit="cover"
                        className="rounded-full team-member-image"
                      />
                    </div>

                    <ul className="social-list flex space-x-3 text-secondary">
                      {member.contact?.social?.facebook && (
                        <li>
                          <Link
                            href={member.contact.social.facebook}
                            className="w-9 h-9 flex items-center justify-center rounded-full bg-white bg-opacity-20 hover:bg-white hover:bg-opacity-100 hover:text-blue-600 transition-all duration-300"
                          >
                            <Facebook size={20} />
                          </Link>
                        </li>
                      )}
                      {member.contact?.social?.twitter && (
                        <li>
                          <Link
                            href={member.contact.social.twitter}
                            className="w-9 h-9 flex items-center justify-center rounded-full bg-white bg-opacity-20 hover:bg-white hover:bg-opacity-100 hover:text-blue-400 transition-all duration-300"
                          >
                            <Twitter size={20} />
                          </Link>
                        </li>
                      )}
                      {member.contact?.social?.instagram && (
                        <li>
                          <Link
                            href={member.contact.social.instagram}
                            className="w-9 h-9 flex items-center justify-center rounded-full bg-white bg-opacity-20 hover:bg-white hover:bg-opacity-100 hover:text-pink-600 transition-all duration-300"
                          >
                            <Instagram size={20} />
                          </Link>
                        </li>
                      )}
                      {member.contact?.social?.youtube && (
                        <li>
                          <Link
                            href={member.contact.social.youtube}
                            className="w-9 h-9 flex items-center justify-center rounded-full bg-white bg-opacity-20 hover:bg-white hover:bg-opacity-100 hover:text-red-600 transition-all duration-300"
                          >
                            <Linkedin size={20} />
                          </Link>
                        </li>
                      )}
                    </ul>
                  </div>

                  {/* Name and Title - Clickable */}
                  <Link href={`/team/teamDetails/${member._id}`} passHref>
                    <h4 className="title text-xl font-bold text-primary mb-1 cursor-pointer hover:text-secondary-dark transition-colors">
                      {member.name}
                    </h4>
                  </Link>
                  <span className="text-secondary text-base font-medium">
                    {member.title}
                  </span>
                  <Image
                    className="absolute -top-12 -right-5 w-28 h-2w-28"
                    src="/images/teams/team_img_shape02.svg"
                    alt="Dotted pattern"
                    width={150}
                    height={150}
                  />
                </motion.div>
              )
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
};

export default DoctorsTeamPage;
