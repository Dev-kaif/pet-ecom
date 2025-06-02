// src/components/sections/Banner.tsx
import React from 'react';
import { motion } from 'motion/react';
import Link from 'next/link'; // Assuming the "Our Shop" button links to a page

// interface BannerProps {
//   // No specific props needed for this static banner
// }

const Banner: React.FC = () => {
  return (
    <section
      className="relative overflow-hidden -pt-10 py-20 lg:py-32 xl:py-40 bg-cover bg-center bg-no-repeat bg-neutral-300"
      // style={{ backgroundImage: 'url(/images/banner/banner_bg.jpg)' }} // User will place banner_bg.jpg
    >
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex flex-col lg:flex-row items-center justify-between">
          <div className=" lg:w-6/12 mb-10 lg:mb-0 text-center lg:text-left">
            <motion.div
              className="banner__content"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <h2 className="text-4xl lg:text-5xl font-bold leading-tight text-primary mb-6 flex flex-col"
                // Original AOS was data-aos="fade-up" data-aos-delay="300"
              ><span>Trusted Pet </span> 
              <span>care & Veterinary</span>
              <span> Center  Point</span>
              </h2>
              <p className="text-lg text-gray-700 mb-8 leading-relaxed"
                // Original AOS was data-aos="fade-up" data-aos-delay="400"
              >
                There are many variations of passages of lorem ipsum available
                <br className="hidden md:block" /> {/* Keep br for desktop line break */}
                but the majority have suffered.
              </p>
              <motion.div
                 initial={{ opacity: 0, y: 50 }}
                 animate={{ opacity: 1, y: 0 }}
                 transition={{ duration: 0.8, delay: 0.5 }} 
                 whileHover={{ scale: 1.05 }}
                 whileTap={{ scale: 0.95 }}
              >
                <Link
                  href="/shop" // Update with actual shop link
                  className="tg-btn-1 inline-flex items-center justify-center px-8 py-3 bg-primary-600 text-white font-semibold rounded-md hover:bg-primary-700 transition-colors duration-300 transform"
                >
                  <span>Our Shop</span>
                </Link>
              </motion.div>
              {/* Placeholder for shape images - user will place these */}
              <motion.div
                className="absolute bottom-0 right-0 -mr-16 -mb-16 hidden lg:block" // Adjust positioning as needed
                animate={{ rotate: 360 }} // Replicating ribbonRotate
                transition={{ repeat: Infinity, duration: 20, ease: "linear" }}
              >
                <img
                  src="/images/banner/banner_content_shape.png" // User will place this image
                  alt="shape"
                  className="w-32 h-32" // Adjust size as needed
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
        {/* Placeholder for bottom shape images - user will place these */}
        <div className="absolute bottom-0 left-0 right-0 z-0">
          <img
            src="/images/banner/banner_shape01.png" // User will place this image
            alt="shape"
            className="absolute bottom-0 left-0 w-24 h-24 md:w-32 md:h-32 opacity-70" // Adjust size and position
          />
          <img
            src="/images/banner/banner_shape02.png" // User will place this image
            alt="shape"
            className="absolute bottom-0 right-0 w-20 h-20 md:w-28 md:h-28 opacity-70" // Adjust size and position
          />
        </div>
      </div>
    </section>
  );
};

export default Banner;