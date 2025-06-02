// src/components/sections/Brand.tsx
import React from 'react';
import { motion } from 'framer-motion';
// For Swiper integration, you'd typically install 'swiper' and 'swiper/react'
// import { Swiper, SwiperSlide } from 'swiper/react';
// import { Autoplay } from 'swiper/modules'; // If you want autoplay

interface BrandProps {
  // No specific props needed for this component currently
}

const Brand: React.FC<BrandProps> = () => {
  const brands = [
    '/images/brand/brand_img01.png', // User will place this image
    '/images/brand/brand_img02.png', // User will place this image
    '/images/brand/brand_img03.png', // User will place this image
    '/images/brand/brand_img04.png', // User will place this image
    '/images/brand/brand_img05.png', // User will place this image
    '/images/brand/brand_img06.png', // User will place this image
  ];

  return (
    <div className="py-20 lg:py-24 xl:py-30 bg-[#F7F7FD] overflow-hidden">
      <div className="container mx-auto px-4 custom-container">
        {/*
          Original HTML used a Swiper container.
          To fully replicate this with auto-play and responsiveness, you'd use the Swiper React component.
          For demonstration, I'm providing a static layout that you can replace with Swiper if desired.
          Install Swiper: npm install swiper
          Import in this file:
          import { Swiper, SwiperSlide } from 'swiper/react';
          import 'swiper/css'; // Core styles
          import { Autoplay } from 'swiper/modules'; // If using Autoplay module
        */}
        <motion.div
          className="flex items-center justify-center gap-x-10 md:gap-x-20 flex-wrap"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6 }}
        >
          {brands.map((brand, index) => (
            <motion.div
              key={index}
              className="w-32 md:w-40 flex-shrink-0" // Adjust width as needed for your logos
              whileHover={{ scale: 1.1 }}
              transition={{ duration: 0.3 }}
            >
              <img src={brand} alt={`Brand ${index + 1}`} className="w-full h-auto object-contain filter grayscale hover:grayscale-0 transition-all duration-300" />
            </motion.div>
          ))}
          {/* Example of Swiper integration (commented out - uncomment and configure if you install Swiper)
          <Swiper
            modules={[Autoplay]}
            spaceBetween={50}
            slidesPerView={5}
            autoplay={{
              delay: 2500,
              disableOnInteraction: false,
            }}
            loop={true}
            breakpoints={{
              // when window width is >= 320px
              320: {
                slidesPerView: 2,
                spaceBetween: 20,
              },
              // when window width is >= 640px
              640: {
                slidesPerView: 3,
                spaceBetween: 30,
              },
              // when window width is >= 1024px
              1024: {
                slidesPerView: 5,
                spaceBetween: 50,
              },
            }}
          >
            {brands.map((brand, index) => (
              <SwiperSlide key={index}>
                <img src={brand} alt={`Brand ${index + 1}`} className="w-full h-auto object-contain filter grayscale hover:grayscale-0 transition-all duration-300" />
              </SwiperSlide>
            ))}
          </Swiper>
          */}
        </motion.div>
      </div>
    </div>
  );
};

export default Brand;