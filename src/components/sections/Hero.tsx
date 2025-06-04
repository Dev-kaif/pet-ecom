/* eslint-disable @next/next/no-img-element */
// src/components/sections/Banner.tsx
import React from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { MoveRight } from "lucide-react";

const Banner: React.FC = () => {
  return (
    <section className="relative overflow-hidden -pt-10 py-20 lg:py-32 xl:py-40 bg-cover bg-center bg-no-repeat bg-secondary-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex flex-col lg:flex-row items-center justify-between">
          <div className="lg:w-6/12 mb-10 lg:mb-0 text-center lg:text-left">
            <motion.div
              className="banner__content"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <h2 className="text-4xl lg:text-[3.8vw] font-extrabold leading-16 text-primary mb-6 flex flex-col">
                <span>Everything Your </span>
                <span>Pet Needs</span>
                <div className="flex gap-3">
                  <span> All in One </span>
                  <img
                    src="/images/banner/banner_title_img02.png"
                    alt="shape"
                    className="w-14 h-14 filter drop-shadow-[0_0_10px_rgba(255,0,0,0.8)]"
                  />
                  <span>Place</span>
                </div>
              </h2>
              <p className="text-lg text-gray-700 mb-8 leading-relaxed">
                From vet consultations and medicines and grooming -
                <br className="hidden md:block" />
                Discover a complete care portal built for your pet’s health,
                <br className="hidden md:block" />
                happiness, and lifestyle.
              </p>
              {/* --- Button Section Start --- */}
              <div className="flex flex-wrap justify-center lg:justify-start gap-4 mt-8">
                {/* Main "Shop Now" Button */}
                <motion.div
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.5 }}
                >
                  <Link
                    href="/shop"
                    className="btn-bubble btn-bubble-primary" // Use the custom class
                  >
                    {/* The content span is part of the custom CSS now, so no need for `relative z-10` here */}
                    <span>
                      <span>Shop Now</span>
                      <MoveRight />
                    </span>
                  </Link>
                </motion.div>

                {/* "Book a Vet" Button */}
                <motion.div
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.6 }}
                >
                  <Link
                    href="/book-vet"
                    className="btn-bubble btn-bubble-secondary" // Use the custom class
                  >
                    <span>
                      <span>Book a Vet</span>
                      <MoveRight />
                    </span>
                  </Link>
                </motion.div>

                {/* "Join as a Vendor" Button */}
                <motion.div
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.7 }}
                >
                  <Link
                    href="/join-vendor"
                    className="btn-bubble btn-bubble-tertiary" // Use the custom class
                  >
                    <span>
                      <span>Join as a Vendor</span>
                      <MoveRight />
                    </span>
                  </Link>
                </motion.div>
              </div>
              {/* --- Button Section End --- */}

              {/* banner_shape03.png - Comes from top-right and spins */}
              <motion.div
                className="absolute top-20 left-[55%] transform -translate-x-1/2 hidden lg:block"
                initial={{ opacity: 0, x: 100, y: -50 }}
                animate={{ opacity: 1, x: 0, y: 0, rotate: 360 }}
                transition={{
                  duration: 1.5,
                  delay: 0.8,
                  ease: "easeOut",
                  rotate: { repeat: Infinity, duration: 20, ease: "linear" },
                }}
              >
                <img
                  src="/images/banner/banner_shape03.png"
                  alt="shape"
                  className="w-18 h-18"
                />
              </motion.div>

              {/* banner_shape01.png - Comes from top-left */}
              <motion.div
                initial={{ opacity: 0, y: -50, x: -50 }}
                animate={{ opacity: 1, y: 0, x: 0 }}
                transition={{ duration: 1, delay: 1 }}
                className="absolute top-0 left-56"
              >
                <img src="/images/banner/banner_shape01.png" alt="svg" />
              </motion.div>
            </motion.div>
          </div>

          <div className="w-full lg:w-6/12 flex justify-center lg:justify-end">
            <motion.div
              className="banner__img"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 1.0, delay: 0.4 }}
            >
              <img
                src="/images/banner/banner_img.png"
                alt="banner"
                className="max-w-full h-auto"
              />
            </motion.div>
          </div>
        </div>

        {/* banner_shape04.png - Comes from top */}
        <motion.img
          src="/images/banner/banner_shape04.png"
          alt="shape"
          className="absolute bottom-25 left-[47%] transform -translate-x-1/2 w-24"
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 1.2 }}
        />

        {/* banner_shape02.png - Comes from bottom */}
        <motion.img
          src="/images/banner/banner_shape02.png"
          alt="shape"
          className="absolute bottom-14 left-20 w-24 h-24 md:w-32 md:h-32"
          initial={{ opacity: 0, y: 100 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 1.4 }}
        />
      </div>
    </section>
  );
};

export default Banner;