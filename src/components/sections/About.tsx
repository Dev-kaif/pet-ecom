/* eslint-disable @next/next/no-img-element */
import { motion } from 'framer-motion';
import Link from 'next/link';



const About = () => {
  return (
    <section className="relative py-20 lg:py-24 xl:py-30 overflow-hidden bg-white">
      <div className="container mx-auto px-4 custom-container">
        <div className="flex flex-col lg:flex-row items-center justify-center gap-12">
          <div className="w-full lg:w-6/12 flex justify-center lg:justify-start">
            <motion.div
              className="about__img relative"
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.8 }}
            >
              {/* Placeholder for about image - user will place this */}
              <img
                src="/images/images/about_img.jpg" // User will place this image
                alt="About Us"
                className="max-w-full h-auto rounded-lg shadow-lg"
                // Original AOS was data-aos="fade-right" data-aos-delay="200"
              />
              {/* Placeholder for shape - user will place this */}
              <motion.div
                className="about__img-shape absolute -bottom-10 -right-10 hidden md:block" // Adjust positioning
                animate={{ rotate: [0, 10, 0] }} // Simple subtle animation
                transition={{ repeat: Infinity, duration: 5, ease: "easeInOut" }}
              >
                <img src="/images/images/about_shape.png" alt="shape" className="w-32 h-32 object-contain" /> {/* User will place this image */}
              </motion.div>
            </motion.div>
          </div>
          <div className="w-full lg:w-6/12 text-center lg:text-left">
            <motion.div
              className="about__content space-y-6"
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.8 }}
            >
              <div className="section__title space-y-4 mb-8">
                <span className="sub-title text-primary-600 text-lg font-semibold uppercase tracking-wider">About Us</span>
                <h2 className="title text-4xl lg:text-5xl font-bold leading-tight text-gray-900">We Care Your Pet</h2>
              </div>
              <p className="text-lg text-gray-700 leading-relaxed mb-8">
                There are many variations of passages of lorem ipsum available but
                the majority have suffered alteration in some form, by injected
                humour, or randomised words which don&apos;t look even slightly
                believable. If you are going to use a passage of lorem ipsum, you
                need to be sure there isn&apos;t anything.
              </p>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link
                  href="/about" // Update with actual about link
                  className="tg-btn-1 inline-flex items-center justify-center px-8 py-3 bg-primary-600 text-white font-semibold rounded-md hover:bg-primary-700 transition-colors duration-300 transform"
                >
                  <span>More About Us</span>
                </Link>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;