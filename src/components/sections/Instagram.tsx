// src/components/sections/Instagram.tsx
import React from "react";
import * as motion from "motion/react-client";
import Link from "next/link";
// For Swiper integration:
// import { Swiper, SwiperSlide } from 'swiper/react';
// import { Autoplay } from 'swiper/modules';
// import 'swiper/css';

const Instagram = () => {
  const instagramImages = [
    "/images/instagram/instagram_img01.jpg", // User will place this image
    "/images/instagram/instagram_img02.jpg", // User will place this image
    "/images/instagram/instagram_img03.jpg", // User will place this image
    "/images/instagram/instagram_img04.jpg", // User will place this image
    "/images/instagram/instagram_img05.jpg", // User will place this image
    "/images/instagram/instagram_img06.jpg", // User will place this image
  ];

  return (
    <section
      className="relative py-20 lg:py-24 xl:py-30 overflow-hidden bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: "url(/images/bg/instagram_bg.jpg)" }} // User will place instagram_bg.jpg
    >
      <div className="container mx-auto px-4 custom-container">
        <div className="flex justify-center text-center mb-16 lg:mb-20">
          <div className="w-full lg:w-8/12 xl:w-6/12">
            <div className="section__title space-y-4">
              <Link
                href="/blog"
                className="btn-bubble btn-bubble-secondary !text-secondary hover:!text-white"
              >
                <span>Follow Us on Instagram</span>
              </Link>
              <h2 className="text-4xl lg:text-5xl font-bold leading-tight text-white">
                #Petco_Feed
              </h2>
            </div>
          </div>
        </div>

        <motion.div
          className="flex gap-20 items-center justify-center px-32"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6 }}
        >
          {instagramImages.map((image, index) => (
            <motion.div
              key={index}
              className=" relative overflow-hidden group"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.3 }}
            >
              <Link href="#" className="block">
                {" "}
                {/* Link to Instagram post */}
                <img
                  src={image}
                  alt={`Instagram Post ${index + 1}`}
                  className="w-full h-auto object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <i className="fab fa-instagram text-white text-3xl" />
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>

      </div>
    </section>
  );
};

export default Instagram;
