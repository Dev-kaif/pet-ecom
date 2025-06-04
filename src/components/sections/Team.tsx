import React from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import {
  MoveRight,
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
} from "lucide-react"; // Import Lucid Icons

const Team = () => {
  const teamMembers = [
    {
      image: "/images/doctors/daria_and_cat.jpg", // Replace with your actual image paths
      name: "Daria Andaloro",
      title: "Veterinary Technician",
      socials: {
        facebook: "#",
        twitter: "#",
        instagram: "#",
        linkedin: "#",
        // youtube: "#", // Example: if you had a YouTube link
      },
    },
    {
      image: "/images/doctors/michael_and_cat.jpg", // Replace with your actual image paths
      name: "Michael Brian",
      title: "Medicine Specialist",
      socials: {
        facebook: "#",
        twitter: "#",
        instagram: "#",
        linkedin: "#",
      },
    },
    {
      image: "/images/doctors/kenroly_and_dog.jpg", // Replace with your actual image paths
      name: "Kenroly Gajon",
      title: "Food Technician",
      socials: {
        facebook: "#",
        twitter: "#",
        instagram: "#",
        linkedin: "#",
      },
    },
    {
      image: "/images/doctors/lizay_and_dog.jpg", // Replace with your actual image paths
      name: "Lizay Arianya",
      title: "Veterinary Technician",
      socials: {
        facebook: "#",
        twitter: "#",
        instagram: "#",
        linkedin: "#",
      },
    },
  ];

  return (
    <section className="relative py-20 lg:py-24 xl:py-30 overflow-hidden bg-white">

      <div className="container mx-auto px-4 custom-container">
        {/* Section Title */}
        <div className="flex justify-center text-center mb-16 lg:mb-20">
          <div className="w-full lg:w-8/12 xl:w-6/12">
            <div className="section__title space-y-4">
              <span className="text-secondary text-lg font-bold tracking-wider flex items-center justify-center">
                WE CHANGE YOUR LIFE & WORLD{" "}
                <span className="ml-2 text-xl">
                  <Image
                    width={100}
                    height={100}
                    className="w-4 h-4 text-secondary flex-shrink-0 mb-2 "
                    src="/images/icon/why_icon01.svg"
                    alt="check"
                  />
                </span>{" "}
                {/* Paw emoji */}
              </span>
              <h2 className="text-4xl lg:text-5xl font-extrabold leading-tight text-primary mt-2">
                Meet Our Expertise <br /> Pet Doctors
              </h2>
            </div>
          </div>
        </div>

        {/* Team Members Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-12 justify-items-center px-32">
          {teamMembers.map((member, index) => (
            <motion.div
              key={index}
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
                    borderColor: "var(--color-secondary)", // A shade of purple
                  }}
                ></div>

                {/* Inner div for the actual image. The image itself will dim on hover. */}
                <div className="w-[220px] h-[220px] rounded-full overflow-hidden relative z-0">
                  <Image
                    src={member.image}
                    alt={member.name}
                    layout="fill"
                    objectFit="cover"
                    className="rounded-full team-member-image"
                  />
                </div>

                {/* Social Icons - positioned on top of the overlay when visible */}
                <ul className="social-list flex space-x-3 text-secondary">
                  {member.socials.facebook && (
                    <li>
                      <Link
                        href={member.socials.facebook}
                        className="w-9 h-9 flex items-center justify-center rounded-full bg-white bg-opacity-20 hover:bg-white hover:bg-opacity-100 hover:text-blue-600 transition-all duration-300"
                      >
                        <Facebook size={20} /> {/* Lucid Icon */}
                      </Link>
                    </li>
                  )}
                  {member.socials.twitter && (
                    <li>
                      <Link
                        href={member.socials.twitter}
                        className="w-9 h-9 flex items-center justify-center rounded-full bg-white bg-opacity-20 hover:bg-white hover:bg-opacity-100 hover:text-blue-400 transition-all duration-300"
                      >
                        <Twitter size={20} /> {/* Lucid Icon */}
                      </Link>
                    </li>
                  )}
                  {member.socials.instagram && (
                    <li>
                      <Link
                        href={member.socials.instagram}
                        className="w-9 h-9 flex items-center justify-center rounded-full bg-white bg-opacity-20 hover:bg-white hover:bg-opacity-100 hover:text-pink-600 transition-all duration-300"
                      >
                        <Instagram size={20} /> {/* Lucid Icon */}
                      </Link>
                    </li>
                  )}
                  {member.socials.linkedin && (
                    <li>
                      <Link
                        href={member.socials.linkedin}
                        className="w-9 h-9 flex items-center justify-center rounded-full bg-white bg-opacity-20 hover:bg-white hover:bg-opacity-100 hover:text-blue-800 transition-all duration-300"
                      >
                        <Linkedin size={20} /> {/* Lucid Icon */}
                      </Link>
                    </li>
                  )}
                </ul>
              </div>

              {/* Name and Title */}
              <h4 className="title text-xl font-bold text-primary mb-1">
                {member.name}
              </h4>
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
          ))}
        </div>

        {/* Buttons Section */}
        <div className="flex flex-col sm:flex-row justify-center items-center mt-16 lg:mt-20 space-y-4 sm:space-y-0 sm:space-x-8">
          <Link
            href="/doctors-team"
            className="text-primary hover:text-secondary transition-colors duration-300 text-lg font-medium underline underline-offset-4"
          >
            Our Valuable Expert Doctors Team
          </Link>
          <Link
            href="/shop"
            className="btn-bubble btn-bubble-primary" // Use the custom class
          >
            <span>
              <span>Shop Now</span>
              <MoveRight />
            </span>
          </Link>
        </div>

        {/* Placeholder for background shapes / dotted patterns */}
        <div className="team__shape absolute top-20 right-20 transform translate-x-1/2 z-0 pointer-events-none opacity-80 hidden md:block">
          <Image
            src="/images/teams/team_shape.png"
            alt="Dotted pattern"
            width={100}
            height={100}
            className="rotate-45"
          />
        </div>
      </div>
    </section>
  );
};

export default Team;
