import { motion } from "motion/react";
import Link from "next/link";

// interface CallToActionProps {
// }

const CallToAction = () => {
  return (
    <section
      className="relative py-20 lg:py-24 xl:py-30 overflow-hidden bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: "url(/images/bg/cta_bg.jpg)" }} // User will place cta_bg.jpg
    >
      <div className="container mx-auto px-4 custom-container">
        <div className="flex justify-center text-center">
          <div className="w-full lg:w-8/12">
            <motion.div
              className="cta__content space-y-6 text-center"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="title text-4xl lg:text-5xl font-bold leading-tight text-white">
                Get The Best Care For Your Pet
              </h2>
              <p className="text-lg text-gray-200 leading-relaxed max-w-2xl mx-auto">
                There are many variations of passages of lorem ipsum available
                but the majority have suffered.
              </p>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link
                  href="/contact" // Update with actual contact/reservation link
                  className="tg-btn-1 inline-flex items-center justify-center px-8 py-3 bg-white text-primary-600 font-semibold rounded-md hover:bg-gray-100 transition-colors duration-300 transform"
                >
                  <span>Contact Us</span>
                </Link>
              </motion.div>
            </motion.div>
          </div>
        </div>
        {/* Placeholder for background shapes - user will place these */}
        <div className="cta__shape absolute top-0 left-0 right-0 z-0 pointer-events-none">
          <motion.img
            src="/images/bg/cta_shape01.png" // User will place this image
            alt="shape"
            className="absolute top-10 left-5 w-24 h-24 opacity-60"
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 25, ease: "linear" }}
          />
          <motion.img
            src="/images/bg/cta_shape02.png" // User will place this image
            alt="shape"
            className="absolute bottom-10 right-5 w-32 h-32 opacity-60"
            animate={{ y: [0, -20, 0] }}
            transition={{ repeat: Infinity, duration: 8, ease: "easeInOut" }}
          />
        </div>
      </div>
    </section>
  );
};

export default CallToAction;
