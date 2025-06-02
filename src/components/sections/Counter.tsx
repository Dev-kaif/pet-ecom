import { motion } from 'framer-motion';
import useCountUp from '@/hooks/useCountUp'; 

// interface CounterProps {
//   // No specific props needed
// }

const Counter = () => {
  // Data for each counter item
  const counterItems = [
    { icon: '/images/icon/counter_icon01.svg', end: 360, label: 'Happy Clients' }, // User will place this SVG
    { icon: '/images/icon/counter_icon02.svg', end: 99, label: 'Positive Feedback', suffix: '%' }, // User will place this SVG
    { icon: '/images/icon/counter_icon03.svg', end: 200, label: 'Qualified Vet' }, // User will place this SVG
    { icon: '/images/icon/counter_icon04.svg', end: 150, label: 'Award Winner' }, // User will place this SVG
  ];

  return (
    <section
      className="relative py-20 lg:py-24 xl:py-30 overflow-hidden bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: 'url(/images/bg/counter_bg.jpg)' }} // User will place counter_bg.jpg
    >
      <div className="container mx-auto px-4 custom-container">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 justify-items-center">
          {counterItems.map((item, index) => {
            const { count, ref } = useCountUp({ end: item.end, delay: index * 200 }); // Staggered animation delay
            return (
              <motion.div
                key={index}
                className="counter__item text-center p-8 bg-white rounded-lg shadow-md flex flex-col items-center justify-center space-y-4"
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.6, delay: index * 0.1 }} // Staggered animation for the container
              >
                <div className="counter__icon">
                  <img src={item.icon} alt="Counter Icon" className="w-16 h-16 object-contain" />
                </div>
                <div className="counter__content">
                  <h2 className="text-5xl font-bold text-primary-600 mb-2 leading-none">
                    <span className="odometer" ref={ref}>{count}</span>{item.suffix || '+'}
                  </h2>
                  <p className="text-xl text-gray-700 font-medium">{item.label}</p>
                </div>
              </motion.div>
            );
          })}
        </div>
        {/* Placeholder for background shape - user will place this */}
        <motion.div
          className="counter__shape absolute bottom-0 left-0 w-48 h-auto hidden md:block" // Adjust positioning
          animate={{ x: [-20, 20, -20] }} // Simple horizontal float
          transition={{ repeat: Infinity, duration: 10, ease: "easeInOut" }}
        >
          <img src="/images/bg/counter_shape.png" alt="shape" className="opacity-70" /> {/* User will place this image */}
        </motion.div>
      </div>
    </section>
  );
};

export default Counter;