// src/components/sections/Services.tsx
import { motion } from 'motion/react';
import Link from 'next/link';



const Services = () => {
  const serviceItems = [
    {
      icon: '/images/icon/services_icon01.svg', // User will place this SVG
      title: 'Pet Grooming',
      description: 'There are many variations of passages of lorem ipsum available but the majority have suffered.',
      link: '/services/grooming', // Update with actual service page link
    },
    {
      icon: '/images/icon/services_icon02.svg', // User will place this SVG
      title: 'Pet Boarding',
      description: 'There are many variations of passages of lorem ipsum available but the majority have suffered.',
      link: '/services/boarding', // Update with actual service page link
    },
    {
      icon: '/images/icon/services_icon03.svg', // User will place this SVG
      title: 'Pet Training',
      description: 'There are many variations of passages of lorem ipsum available but the majority have suffered.',
      link: '/services/training', // Update with actual service page link
    },
    {
      icon: '/images/icon/services_icon04.svg', // User will place this SVG
      title: 'Pet Daycare',
      description: 'There are many variations of passages of lorem ipsum available but the majority have suffered.',
      link: '/services/daycare', // Update with actual service page link
    },
  ];

  return (
    <section className="relative py-20 lg:py-24 xl:py-30 overflow-hidden bg-white">
      <div className="container mx-auto px-4 custom-container">
        <div className="flex justify-center text-center mb-16 lg:mb-20">
          <div className="w-full lg:w-8/12 xl:w-6/12">
            <div className="section__title space-y-4">
              <span className="text-primary-600 text-lg font-semibold uppercase tracking-wider">Our Services</span>
              <h2 className="text-4xl lg:text-5xl font-bold leading-tight text-gray-900">What We Offer</h2>
              <p className="text-lg text-gray-700 leading-relaxed">
                There are many variations of passages of lorem ipsum available
                but the majority have suffered.
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 justify-items-center">
          {serviceItems.map((item, index) => (
            <motion.div
              key={index}
              className="services__item text-center p-8 bg-gray-50 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300 transform hover:-translate-y-2 group"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.6, delay: index * 0.1 }} // Staggered animation
            >
              <div className="services__icon mb-6 flex justify-center">
                <img src={item.icon} alt="Service Icon" className="w-16 h-16 object-contain" />
              </div>
              <div className="services__content space-y-4">
                <h4 className="title text-2xl font-bold text-gray-900 group-hover:text-primary-600 transition-colors duration-300">
                  {item.title}
                </h4>
                <p className="text-gray-700 leading-relaxed text-base">
                  {item.description}
                </p>
                <Link href={item.link} className="read-more inline-flex items-center text-primary-600 font-medium hover:underline hover:text-primary-700 transition-colors duration-300">
                  Read More
                  <i className="far fa-arrow-right ml-2 text-sm" />
                </Link>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Placeholder for background shapes - user will place these */}
        <div className="services__shape absolute top-0 left-0 right-0 z-0 pointer-events-none">
          <motion.img
            src="/images/images/services_shape01.svg" // User will place this SVG
            alt="shape"
            className="absolute top-10 left-5 md:left-20 w-24 h-24 opacity-60"
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 25, ease: "linear" }}
          />
          <motion.img
            src="/images/images/services_shape02.png" // User will place this image
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

export default Services;