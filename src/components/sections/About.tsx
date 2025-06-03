/* eslint-disable @next/next/no-img-element */
import { motion } from "framer-motion";
import { MoveRight } from "lucide-react";
import Link from "next/link";

const About = () => {
  return (
    <section className="relative py-20 lg:py-24 xl:py-30 overflow-hidden bg-white">
      <div className="container mx-auto px-4 custom-container">
        <div className="flex flex-col lg:flex-row items-center justify-center gap-12">
          <div className="w-full lg:w-6/12 flex justify-center">
            <motion.div
              className="about__img relative"
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.8 }}
            >
              <img
                src="/images/about/about_img.png"
                alt="About Us"
                className="max-w-full h-auto rounded-lg "
              />
              <motion.div className=" absolute -bottom-15 -left-15 hidden md:block">
                <img
                  src="/images/images/about_shape01.png"
                  alt="shape"
                  className="object-contain w-32 h-40"
                />{" "}
                {/* User will place this image */}
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
                <span className="sub-title text-secondary text-lg font-semibold uppercase tracking-wider">
                  Know More About us
                </span>
                <h2 className="title text-4xl lg:text-5xl font-bold leading-tight text-primary flex flex-col">
                  <span>We’re more than just </span>
                  <span>a pet store</span>
                </h2>
              </div>
              <p className="text-lg text-gray-700 leading-relaxed mb-8">
                We’re a complete pet care ecosystem. Our platform connects pet
                owners with trusted veterinarians, reliable pet shops, and
                professional service providers, all in one place. Whether you
                need medicines, fun toys, grooming services, or expert advice,
                we make it easy, safe, and convenient. Built for both pet lovers
                and pet businesses, our mission is to simplify pet parenting and
                support every step of your pet’s journey.
              </p>
              <motion.div>
                <Link href="/about" className="btn-bubble btn-bubble-primary">
                  <span>
                    <span>Learn More About Us</span>
                    <MoveRight />
                  </span>
                </Link>
              </motion.div>
            </motion.div>
          </div>
          <div>
            <img
              src="/images/about/about_shape02.png"
              alt="shape 2"
              className="absolute right-80 top-10"
            />
            <img
              src="/images/about/about_shape03.png"
              alt="shape 2"
              className="absolute right-20 bottom-20"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;

