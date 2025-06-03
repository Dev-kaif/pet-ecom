// src/components/sections/Testimonial.tsx
import React from 'react';
import { motion } from 'framer-motion';
// For Swiper integration:
// import { Swiper, SwiperSlide } from 'swiper/react';
// import { Pagination, Autoplay } from 'swiper/modules';
// import 'swiper/css';
// import 'swiper/css/pagination'; // If you use pagination


const Testimonial = () => {
  const testimonials = [
    {
      image: '/images/testimonial/testimonial_img01.png', // User will place this image
      rating: 5,
      quote: '“There are many variations of passages of lorem ipsum available but the majority have suffered alteration in some form, by injected humour, or randomised words which don\'t look even slightly believable.”',
      name: 'Floyd Miles',
      title: 'Founder',
    },
    {
      image: '/images/testimonial/testimonial_img02.png', // User will place this image
      rating: 5,
      quote: '“There are many variations of passages of lorem ipsum available but the majority have suffered alteration in some form, by injected humour, or randomised words which dont look even slightly believable.”',
      name: 'Ronald Richards',
      title: 'Manager',
    },
    {
      image: '/images/testimonial/testimonial_img03.png', // User will place this image
      rating: 5,
      quote: '“There are many variations of passages of lorem ipsum available but the majority have suffered alteration in some form, by injected humour, or randomised words which dont look even slightly believable.”',
      name: 'Kathryn Murphy',
      title: 'Customer',
    },
    // Add more testimonials if needed
  ];

  return (
    <section className="relative py-20 lg:py-24 xl:py-30 overflow-hidden bg-white">
      <div className="container mx-auto px-4 custom-container">
        <div className="flex justify-center text-center mb-16 lg:mb-20">
          <div className="w-full lg:w-8/12 xl:w-6/12">
            <div className="section__title space-y-4">
              <span className="text-primary-600 text-lg font-semibold uppercase tracking-wider">Our Testimonial</span>
              <h2 className="text-4xl lg:text-5xl font-bold leading-tight text-gray-900">What Our Client Say’s</h2>
              <p className="text-lg text-gray-700 leading-relaxed">
                There are many variations of passages of lorem ipsum available
                but the majority have suffered.
              </p>
            </div>
          </div>
        </div>

        <div className="row">
          {/*
            Original HTML used a Swiper container for the testimonials.
            To fully replicate this with navigation, pagination, and responsiveness, you'd use the Swiper React component.
            For demonstration, I'm providing a static layout that you can replace with Swiper if desired.
            Install Swiper: npm install swiper
            Import in this file:
            import { Swiper, SwiperSlide } from 'swiper/react';
            import { Pagination, Autoplay } from 'swiper/modules';
            import 'swiper/css';
            import 'swiper/css/pagination';

            Example Swiper integration (commented out - uncomment and configure if you install Swiper):
            <Swiper
              modules={[Pagination, Autoplay]}
              spaceBetween={30}
              slidesPerView={1}
              autoplay={{ delay: 3000, disableOnInteraction: false }}
              pagination={{ clickable: true }}
              loop={true}
              breakpoints={{
                768: {
                  slidesPerView: 2,
                  spaceBetween: 30,
                },
              }}
              className="testimonial__active" // Apply your existing Swiper CSS classes if they customize look
            >
              {testimonials.map((testimonial, index) => (
                <SwiperSlide key={index}>
                  <motion.div
                    className="testimonial__item bg-white p-8 rounded-lg shadow-md text-center space-y-6"
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.3 }}
                    transition={{ duration: 0.6 }}
                  >
                    <div className="testimonial__content space-y-4">
                      <div className="rating flex justify-center text-yellow-400 text-lg">
                        {[...Array(testimonial.rating)].map((_, i) => (
                          <i key={i} className="fas fa-star" />
                        ))}
                      </div>
                      <p className="text-gray-700 leading-relaxed italic text-lg">
                        {testimonial.quote}
                      </p>
                    </div>
                    <div className="testimonial__client flex items-center justify-center space-x-4 pt-4 border-t border-gray-200">
                      <div className="testimonial__client-thumb w-16 h-16 rounded-full overflow-hidden">
                        <img
                          src={testimonial.image}
                          alt={testimonial.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="testimonial__client-info text-left">
                        <h4 className="name text-xl font-bold text-gray-900">{testimonial.name}</h4>
                        <span className="text-primary-600 text-base">{testimonial.title}</span>
                      </div>
                    </div>
                  </motion.div>
                </SwiperSlide>
              ))}
            </Swiper>
          */}

          {/* Static rendering for demonstration (replace with Swiper above) */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                className="testimonial__item bg-white p-8 rounded-lg shadow-md text-center space-y-6"
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.6, delay: index * 0.1 }} // Staggered animation
              >
                <div className="testimonial__content space-y-4">
                  <div className="rating flex justify-center text-yellow-400 text-lg">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <i key={i} className="fas fa-star" />
                    ))}
                  </div>
                  <p className="text-gray-700 leading-relaxed italic text-lg">
                    {testimonial.quote}
                  </p>
                </div>
                <div className="testimonial__client flex items-center justify-center space-x-4 pt-4 border-t border-gray-200">
                  <div className="testimonial__client-thumb w-16 h-16 rounded-full overflow-hidden">
                    <img
                      src={testimonial.image}
                      alt={testimonial.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="testimonial__client-info text-left">
                    <h4 className="name text-xl font-bold text-gray-900">{testimonial.name}</h4>
                    <span className="text-primary-600 text-base">{testimonial.title}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Swiper pagination if you integrate it */}
          {/* <div className="swiper-pagination mt-8 text-center" /> */}
        </div>
      </div>
    </section>
  );
};

export default Testimonial;