/* eslint-disable @next/next/no-img-element */
// src/components/sections/Banner.tsx
import React from "react";
import { motion } from "motion/react";
import Link from "next/link"; // Assuming the "Our Shop" button links to a page
import { MoveRight } from "lucide-react";

// interface BannerProps {
//   // No specific props needed for this static banner
// }

const Banner: React.FC = () => {
  return (
    <section className="relative overflow-hidden -pt-10 py-20 lg:py-32 xl:py-40 bg-cover bg-center bg-no-repeat bg-neutral-100">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex flex-col lg:flex-row items-center justify-between">
          <div className=" lg:w-6/12 mb-10 lg:mb-0 text-center lg:text-left">
            <motion.div
              className="banner__content"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <h2 className="text-4xl lg:text-[3.8vw] font-extrabold leading-16 text-primary mb-6 flex flex-col">
                <span>Trusted Pet </span>
                <span>Care & Veterinary</span>
                <div className="flex gap-3">
                  <span> Center</span>
                  <img
                    src="/images/banner/banner_title_img02.png"
                    alt="shape"
                    className="w-14 h-14 filter drop-shadow-[0_0_10px_rgba(255,0,0,0.8)]"
                  />
                  <span> Point</span>
                </div>
              </h2>
              <p
                className="text-lg text-gray-700 mb-8 leading-relaxed"
                // Original AOS was data-aos="fade-up" data-aos-delay="400"
              >
                There are many variations of passages of lorem ipsum available
                <br className="hidden md:block" />{" "}
                {/* Keep br for desktop line break */}
                but the majority have suffered.
              </p>
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.5 }}
              >
                <Link
                  href="/shop"
                  className="inline-flex gap-2 text-lg items-center justify-center px-8 py-3 bg-secondary text-white font-semibold rounded-full hover:bg-primary transition-colors duration-300 transform"
                >
                  <span>Read More</span>
                  <MoveRight />
                </Link>
              </motion.div>
              <motion.div
                className="absolute top-10 left-[55%] transform -translate-x-1/2  hidden lg:block"
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 20, ease: "linear" }}
              >
                <img
                  src="/images/banner/banner_shape03.png"
                  alt="shape"
                  className="w-20 h-20"
                />
              </motion.div>
            </motion.div>
          </div>
          <div className="w-full lg:w-6/12 flex justify-center lg:justify-end">
            <motion.div
              className="banner__img"
              initial={{ opacity: 0, x: 50 }} // Adjusted for fade-left effect from AOS
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 1.0, delay: 0.4 }} // Original AOS was data-aos="fade-left" data-aos-delay="600"
            >
              {/* Placeholder for banner image - user will place this */}
              <img
                src="/images/banner/banner_img.png" // User will place this image
                alt="banner"
                className="max-w-full h-auto"
              />
            </motion.div>
          </div>
        </div>
        
        <img
          src="/images/banner/banner_shape04.png" // User will place this image
          alt="shape"
          className="absolute bottom-14 left-[47%] transform -translate-x-1/2 w-24"
        />
        <img
          src="/images/banner/banner_shape02.png" // User will place this image
          alt="shape"
          className="absolute bottom-14 left-20 w-24 h-24 md:w-32 md:h-32 "
        />
      </div>
    </section>
  );
};

export default Banner;
