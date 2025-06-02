// src/components/sections/Team.tsx
// import React from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';

// interface TeamProps {
//   // No specific props needed for this component currently
// }

const Team = () => {
  // Define team members as an array for easier rendering
  const teamMembers = [
    {
      image: '/images/team/team_img01.jpg', // User will place this image
      name: 'Darrell Steward',
      title: 'Founder & CEO',
      socials: {
        facebook: '#',
        twitter: '#',
        pinterest: '#',
        linkedin: '#',
      },
    },
    {
      image: '/images/team/team_img02.jpg', // User will place this image
      name: 'Leslie Alexander',
      title: 'Trainer',
      socials: {
        facebook: '#',
        twitter: '#',
        pinterest: '#',
        linkedin: '#',
      },
    },
    {
      image: '/images/team/team_img03.jpg', // User will place this image
      name: 'Kristin Watson',
      title: 'Manager',
      socials: {
        facebook: '#',
        twitter: '#',
        pinterest: '#',
        linkedin: '#',
      },
    },
    {
      image: '/images/team/team_img04.jpg', // User will place this image
      name: 'Jerome Bell',
      title: 'Customer Service',
      socials: {
        facebook: '#',
        twitter: '#',
        pinterest: '#',
        linkedin: '#',
      },
    },
  ];

  return (
    <section className="relative py-20 lg:py-24 xl:py-30 overflow-hidden bg-white">
      <div className="container mx-auto px-4 custom-container">
        <div className="flex justify-center text-center mb-16 lg:mb-20">
          <div className="w-full lg:w-8/12 xl:w-6/12">
            <div className="section__title space-y-4">
              <span className="text-primary-600 text-lg font-semibold uppercase tracking-wider">Meet Our Team</span>
              <h2 className="text-4xl lg:text-5xl font-bold leading-tight text-gray-900">Our Expert Team</h2>
              <p className="text-lg text-gray-700 leading-relaxed">
                There are many variations of passages of lorem ipsum available
                but the majority have suffered.
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 justify-items-center">
          {teamMembers.map((member, index) => (
            <motion.div
              key={index}
              className="team__item bg-white rounded-lg shadow-md overflow-hidden group"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.6, delay: index * 0.1 }} // Staggered animation
            >
              <div className="team__img relative overflow-hidden">
                <img
                  src={member.image}
                  alt={member.name}
                  className="w-full h-72 object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              <div className="team__content p-6 text-center space-y-2">
                <h4 className="title text-2xl font-bold text-gray-900 group-hover:text-primary-600 transition-colors duration-300">
                  <Link href="#">{member.name}</Link> {/* Link to individual team member page if applicable */}
                </h4>
                <span className="text-primary-600 text-lg font-medium">{member.title}</span>
                <ul className="social-list flex justify-center space-x-3 mt-4">
                  <li>
                    <a href={member.socials.facebook} className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 text-gray-600 hover:bg-primary-500 hover:text-white transition-all duration-300">
                      <i className="fab fa-facebook-f" />
                    </a>
                  </li>
                  <li>
                    <a href={member.socials.twitter} className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 text-gray-600 hover:bg-primary-500 hover:text-white transition-all duration-300">
                      <i className="fab fa-twitter" />
                    </a>
                  </li>
                  <li>
                    <a href={member.socials.pinterest} className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 text-gray-600 hover:bg-primary-500 hover:text-white transition-all duration-300">
                      <i className="fab fa-pinterest-p" />
                    </a>
                  </li>
                  <li>
                    <a href={member.socials.linkedin} className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 text-gray-600 hover:bg-primary-500 hover:text-white transition-all duration-300">
                      <i className="fab fa-linkedin-in" />
                    </a>
                  </li>
                </ul>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Placeholder for background shapes - user will place these */}
        <div className="team__shape absolute top-0 left-0 right-0 z-0 pointer-events-none">
          <motion.img
            src="/images/images/team_shape01.svg" // User will place this SVG
            alt="shape"
            className="absolute top-10 left-5 md:left-20 w-24 h-24 opacity-60"
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 25, ease: "linear" }}
          />
          <motion.img
            src="/images/images/team_shape02.png" // User will place this image
            alt="shape"
            className="absolute bottom-10 right-5 md:right-20 w-32 h-32 opacity-60"
            animate={{ y: [0, -20, 0] }}
            transition={{ repeat: Infinity, duration: 8, ease: "easeInOut" }}
          />
        </div>
      </div>
    </section>
  );
};

export default Team;