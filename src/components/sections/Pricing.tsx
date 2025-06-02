import { motion } from 'framer-motion';
import Link from 'next/link';

// interface PricingProps {
//   // No specific props needed for this component currently
// }

const Pricing= () => {
  const pricingPlans = [
    {
      title: 'Standard Plan',
      price: '29',
      duration: '/Month',
      features: [
        'Pet Grooming',
        'Pet Boarding',
        'Pet Training',
        'Pet Daycare',
        'Pet Taxi',
      ],
      isPopular: false,
    },
    {
      title: 'Premium Plan',
      price: '49',
      duration: '/Month',
      features: [
        'Pet Grooming',
        'Pet Boarding',
        'Pet Training',
        'Pet Daycare',
        'Pet Taxi',
      ],
      isPopular: true, // This one has the 'active' class in original HTML
    },
    {
      title: 'Business Plan',
      price: '79',
      duration: '/Month',
      features: [
        'Pet Grooming',
        'Pet Boarding',
        'Pet Training',
        'Pet Daycare',
        'Pet Taxi',
      ],
      isPopular: false,
    },
  ];

  return (
    <section
      className="relative py-20 lg:py-24 xl:py-30 overflow-hidden bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: 'url(/images/bg/pricing_bg.jpg)' }} // User will place pricing_bg.jpg
    >
      <div className="container mx-auto px-4 custom-container">
        <div className="flex justify-center text-center mb-16 lg:mb-20">
          <div className="w-full lg:w-8/12 xl:w-6/12">
            <div className="section__title space-y-4">
              <span className="text-primary-600 text-lg font-semibold uppercase tracking-wider">Our Pricing Plan</span>
              <h2 className="text-4xl lg:text-5xl font-bold leading-tight text-gray-900">Best Pricing Package</h2>
              <p className="text-lg text-gray-700 leading-relaxed">
                There are many variations of passages of lorem ipsum available
                but the majority have suffered.
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 justify-items-center">
          {pricingPlans.map((plan, index) => (
            <motion.div
              key={index}
              className={`pricing__item bg-white rounded-lg shadow-md overflow-hidden transition-all duration-300 ${
                plan.isPopular ? 'border-2 border-primary-600' : 'border border-gray-200'
              } ${plan.isPopular ? 'scale-105' : ''} hover:shadow-xl`} // Added hover effect
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.6, delay: index * 0.1 }} // Staggered animation
            >
              <div className={`pricing__header p-8 text-center ${plan.isPopular ? 'bg-primary-600 text-white' : 'bg-gray-50 text-gray-900'}`}>
                <h3 className="title text-3xl font-bold mb-2">{plan.title}</h3>
                <div className="price-tag text-5xl font-extrabold flex items-baseline justify-center">
                  <span className="text-3xl mr-1">{plan.price.startsWith('$') ? '' : '$'}</span>{plan.price}
                  <span className="text-xl font-normal ml-1">{plan.duration}</span>
                </div>
              </div>
              <div className="pricing__content p-8 text-center">
                <ul className="pricing__list space-y-3 mb-8 text-lg text-gray-700">
                  {plan.features.map((feature, idx) => (
                    <li key={idx} className="flex items-center justify-center">
                      <i className="fas fa-check-circle text-primary-600 mr-2" />
                      {feature}
                    </li>
                  ))}
                </ul>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Link
                    href="#" // Update with actual plan selection link
                    className={`tg-btn-1 inline-flex items-center justify-center px-8 py-3 font-semibold rounded-md transition-colors duration-300 ${
                      plan.isPopular ? 'bg-white text-primary-600 hover:bg-gray-100' : 'bg-primary-600 text-white hover:bg-primary-700'
                    }`}
                  >
                    <span>Choose Plan</span>
                  </Link>
                </motion.div>
              </div>
            </motion.div>
          ))}
        </div>
        {/* Placeholder for background shapes - user will place these */}
        <div className="pricing__shape absolute top-0 left-0 right-0 z-0 pointer-events-none">
          <motion.img
            src="/images/bg/pricing_shape01.png" // User will place this image
            alt="shape"
            className="absolute top-20 left-10 w-24 h-24 opacity-60"
            animate={{ y: [0, -15, 0] }}
            transition={{ repeat: Infinity, duration: 8, ease: "easeInOut" }}
          />
          <motion.img
            src="/images/bg/pricing_shape02.png" // User will place this image
            alt="shape"
            className="absolute bottom-20 right-10 w-32 h-32 opacity-60"
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 25, ease: "linear" }}
          />
        </div>
      </div>
    </section>
  );
};

export default Pricing;