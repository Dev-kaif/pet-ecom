import React from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';

const Team = () => {
  const teamMembers = [
    {
      image: '/images/doctors/daria_and_cat.jpg', // Replace with your actual image paths
      name: 'Daria Andaloro',
      title: 'Veterinary Technician',
      socials: {
        facebook: '#',
        twitter: '#',
        instagram: '#', // Added Instagram as it's common
        linkedin: '#',
      },
    },
    {
      image: '/images/doctors/michael_and_cat.jpg', // Replace with your actual image paths
      name: 'Michael Brian',
      title: 'Medicine Specialist',
      socials: {
        facebook: '#',
        twitter: '#',
        instagram: '#',
        linkedin: '#',
      },
    },
    {
      image: '/images/doctors/kenroly_and_dog.jpg', // Replace with your actual image paths
      name: 'Kenroly Gajon',
      title: 'Food Technician',
      socials: {
        facebook: '#',
        twitter: '#',
        instagram: '#',
        linkedin: '#',
      },
    },
    {
      image: '/images/doctors/lizay_and_dog.jpg', // Replace with your actual image paths
      name: 'Lizay Arianya',
      title: 'Veterinary Technician',
      socials: {
        facebook: '#',
        twitter: '#',
        instagram: '#',
        linkedin: '#',
      },
    },
  ];

  return (
    <section className="relative py-20 lg:py-24 xl:py-30 overflow-hidden bg-white">
      {/* Background cat paw icon */}
      <div className="absolute top-0 right-10 z-0 opacity-20 hidden lg:block">
        <Image
          src="/images/paw_icon.png"
          alt="Paw icon"
          width={100}
          height={100}
          className="w-24 h-24 rotate-12"
        />
      </div>

      <div className="container mx-auto px-4 custom-container">
        {/* Section Title */}
        <div className="flex justify-center text-center mb-16 lg:mb-20">
          <div className="w-full lg:w-8/12 xl:w-6/12">
            <div className="section__title space-y-4">
              <span className="text-secondary text-lg font-bold tracking-wider flex items-center justify-center">
                WE CHANGE YOUR LIFE & WORLD{' '}
                <span className="ml-2 text-xl">🐾</span> {/* Paw emoji */}
              </span>
              <h2 className="text-4xl lg:text-5xl font-extrabold leading-tight text-gray-900 mt-2">
                Meet Our Expertise <br /> Pet Doctors
              </h2>
            </div>
          </div>
        </div>

        {/* Team Members Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-12 justify-items-center">
          {teamMembers.map((member, index) => (
            <motion.div
              key={index}
              className="team__item flex flex-col items-center text-center group"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              {/* Outer container for the whole circle: background, dotted border, image, and overlay */}
              <div className="team-image-wrapper w-[240px] h-[240px] rounded-full p-2 bg-gradient-to-br from-purple-100 via-white to-purple-100 flex items-center justify-center mb-6">
                {/* Dotted Border - sits below the overlay */}
                <div className="absolute inset-0 rounded-full pointer-events-none" style={{
                    borderStyle: 'dashed',
                    borderWidth: '2px',
                    borderColor: 'rgb(216, 180, 252)', // A shade of purple
                  }}>
                </div>

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
                <ul className="social-list flex space-x-3 text-white">
                  {member.socials.facebook && (
                    <li>
                      <Link href={member.socials.facebook} className="w-9 h-9 flex items-center justify-center rounded-full bg-white bg-opacity-20 hover:bg-white hover:bg-opacity-100 hover:text-blue-600 transition-all duration-300">
                        <i className="fab fa-facebook-f" />
                      </Link>
                    </li>
                  )}
                  {member.socials.twitter && (
                    <li>
                      <Link href={member.socials.twitter} className="w-9 h-9 flex items-center justify-center rounded-full bg-white bg-opacity-20 hover:bg-white hover:bg-opacity-100 hover:text-blue-400 transition-all duration-300">
                        <i className="fab fa-twitter" />
                      </Link>
                    </li>
                  )}
                  {member.socials.instagram && (
                    <li>
                      <Link href={member.socials.instagram} className="w-9 h-9 flex items-center justify-center rounded-full bg-white bg-opacity-20 hover:bg-white hover:bg-opacity-100 hover:text-pink-600 transition-all duration-300">
                        <i className="fab fa-instagram" />
                      </Link>
                    </li>
                  )}
                  {member.socials.linkedin && (
                    <li>
                      <Link href={member.socials.linkedin} className="w-9 h-9 flex items-center justify-center rounded-full bg-white bg-opacity-20 hover:bg-white hover:bg-opacity-100 hover:text-blue-800 transition-all duration-300">
                        <i className="fab fa-linkedin-in" />
                      </Link>
                    </li>
                  )}
                </ul>
              </div>

              {/* Name and Title */}
              <h4 className="title text-xl font-bold text-gray-900 mb-1">
                {member.name}
              </h4>
              <span className="text-purple-600 text-base font-medium">
                {member.title}
              </span>
            </motion.div>
          ))}
        </div>

        {/* Buttons Section */}
        <div className="flex flex-col sm:flex-row justify-center items-center mt-16 lg:mt-20 space-y-4 sm:space-y-0 sm:space-x-8">
          <Link href="/doctors-team" className="text-gray-600 hover:text-purple-600 transition-colors duration-300 text-lg font-medium underline underline-offset-4">
            Our Valuable Expert Doctors Team
          </Link>
          <Link href="/doctors" className="inline-flex items-center justify-center px-8 py-3 bg-purple-600 text-white font-semibold rounded-full hover:bg-purple-700 transition-colors duration-300 shadow-lg">
            See All Doctors <span className="ml-2">→</span>
          </Link>
        </div>

        {/* Placeholder for background shapes / dotted patterns */}
        <div className="team__shape absolute -top-5 left-1/4 transform -translate-x-1/2 z-0 pointer-events-none opacity-80 hidden md:block">
          <Image
            src="/images/purple_dots_large.svg"
            alt="Dotted pattern"
            width={150}
            height={150}
          />
        </div>
        <div className="team__shape absolute top-20 right-1/4 transform translate-x-1/2 z-0 pointer-events-none opacity-80 hidden md:block">
          <Image
            src="/images/purple_dots_large.svg"
            alt="Dotted pattern"
            width={100}
            height={100}
            className="rotate-45"
          />
        </div>
         <div className="team__shape absolute bottom-10 left-10 z-0 pointer-events-none opacity-80 hidden md:block">
          <Image
            src="/images/purple_dots_small.svg"
            alt="Dotted pattern"
            width={80}
            height={80}
          />
        </div>
      </div>
    </section>
  );
};

export default Team;