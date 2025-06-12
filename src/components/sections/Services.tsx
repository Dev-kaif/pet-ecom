"use client";
import React, { useRef } from "react";
import Image from "next/image";
import { motion, useInView, Variants } from "motion/react"; // Import motion, useInView, Variants
import { Stethoscope, Pill, Bone, Store, Scissors, Home } from "lucide-react";

import { cn } from "@/components/lib/utils"; // Assuming this utility is available

interface ServiceCardProps {
  icon: React.ReactNode;
  iconAlt: string;
  title: string;
  description: string;
  className?: string;
}

// Define variants for individual service cards
// These will be controlled by the parent's `staggerChildren`
const cardVariants: Variants = {
  hidden: { opacity: 0, y: 50 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6, // Each card animates over 0.6 seconds
      ease: "easeOut",
    },
  },
};

const ServiceCard: React.FC<ServiceCardProps> = ({
  icon,
  title,
  description,
  className,
}) => {
  return (
    <motion.div
      variants={cardVariants} // Apply cardVariants here
      className={cn(
        "relative flex flex-col items-center justify-between p-6 md:p-8 rounded-[3rem]",
        "overflow-hidden",
        "min-h-[400px] sm:min-h-[450px]",
        className
      )}
    >
      <Image
        width={1000}
        height={1000}
        src="/images/services/services_shape01.svg"
        alt="Decorative background shape for service card"
        className="absolute inset-0 w-full h-full object-cover z-0 text-white"
        // No motion on this Image itself as it's a fixed background to the card.
        // It uses Next.js Image component for optimization.
      />

      <div className="relative z-10 mb-4 bg-secondary-100 rounded-full p-4 flex items-center justify-center">
        {icon}
      </div>
      <h3 className="relative z-10 text-xl md:text-2xl font-bold text-secondary mb-2">
        {title}
      </h3>
      <p className="relative z-10 text-primary text-sm md:text-base mb-20 leading-relaxed whitespace-pre-line text-center">
        {description}
      </p>
    </motion.div>
  );
};

const ServicesSection: React.FC = () => {
  const services = [
    {
      icon: <Stethoscope className="w-10 h-10 text-secondary" />,
      iconAlt: "Vet Consultations Icon",
      title: "Vet Consultations",
      description:
        "Book online or in-person appointments with certified veterinarians.Get expert advice on pet health, diet, and preventive care.",
    },
    {
      icon: <Pill className="w-10 h-10 text-secondary" />,
      iconAlt: "Pet Medicines Icon",
      title: "Pet Medicines",
      description:
        "Access genuine, vet-approved medications and supplements.Fast and safe home delivery with proper guidance.",
    },
    {
      icon: <Bone className="w-10 h-10 text-secondary" />,
      iconAlt: "Toys & Accessories Icon",
      title: "Toys & Accessories",
      description:
        "Explore fun, safe, and durable toys for all pet types.Shop grooming kits, leashes, collars, beds, and more.",
    },
    {
      icon: <Store className="w-10 h-10 text-secondary" />,
      iconAlt: "Pet Shops & Products Icon",
      title: "Pet Shops & Products",
      description:
        "Connect with verified local and online pet stores.Enjoy exclusive deals on food, treats, and essentials.",
    },
    {
      icon: <Scissors className="w-10 h-10 text-secondary" />,
      iconAlt: "Grooming & Training Icon",
      title: "Grooming & Training",
      description:
        "Book experienced groomers for regular pet care.Find certified trainers for behavior and obedience support.",
    },
    {
      icon: <Home className="w-10 h-10 text-secondary" />,
      iconAlt: "Pet Boarding & Daycare Icon",
      title: "Pet Boarding & Daycare",
      description:
        "Secure short- and long-term boarding options.Daily care services with a loving and pet-friendly environment.",
    },
  ];

  const ref = useRef(null);
  // useInView with once: true ensures animation only plays once when entering the viewport.
  // amount: 0.2 means the animation triggers when 20% of the element is visible.
  const isInView = useInView(ref, { once: true, amount: 0.2 });

  // Variants for the container that holds the cards to enable staggered animation
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1, // Each child animates with a 0.1s delay after the previous
        delayChildren: 0.2, // Delay before the first child starts animating (after parent appears)
      },
    },
  };

  // Variants for the top content (heading, button)
  const topContentVariants: Variants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.7, ease: "easeOut" },
    },
  };

  // Variants for background shapes - simple fade-in and slight scale up
  const shapeVariants: Variants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 1.2, ease: "easeOut" },
    },
  };

  return (
    <section className="relative py-20 lg:py-32 bg-secondary-50 overflow-hidden">
      {/* Attach ref to the main content container to detect when it's in view */}
      <div className="max-w-7xl mx-auto px-4 relative z-10" ref={ref}>
        {/* Animate the top content (heading and button) */}
        <motion.div
          className="flex flex-col md:flex-row items-center justify-between mb-12 text-center md:text-left"
          initial="hidden"
          // 'animate' prop uses the isInView boolean to trigger the animation
          animate={isInView ? "visible" : "hidden"}
          variants={topContentVariants}
        >
          <div className="mb-8 md:mb-0">
            <p className="text-secondary font-semibold text-base mb-2 flex items-center justify-center md:justify-start">
              DELIVERING WORLD CLASS HOME CARE{" "}
              <span className="ml-2 text-xl">🐾</span>
            </p>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-primary leading-tight">
              Providing Our Best Pet Care &<br className="hidden md:block" />
              Veterinary Services
            </h2>
          </div>
        </motion.div>

        {/* Animate the grid container for staggered child animations */}
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-8"
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          variants={containerVariants} // Apply container variants for stagger
        >
          {services.map((service, index) => (
            <ServiceCard
              key={index} // Ensure key is present and stable for React list rendering
              icon={service.icon}
              iconAlt={service.iconAlt}
              title={service.title}
              description={service.description}
            />
          ))}
        </motion.div>
      </div>

      {/* Other Background Shapes - Animate these as well using motion.div wrappers */}
      <motion.div
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
        variants={shapeVariants}
        className="absolute top-30 right-[40%] hidden lg:block opacity-70"
      >
        <Image
          src="/images/services/services_shape02.png"
          alt="Cat shape"
          width={100}
          height={100}
        />
      </motion.div>
      <motion.div
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
        variants={shapeVariants}
        className="absolute top-40 right-0 hidden md:block opacity-60"
      >
        <Image
          src="/images/services/services_shape03.png"
          alt="Paw shape"
          width={150}
          height={200}
        />
      </motion.div>
      <motion.div
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
        variants={shapeVariants}
        className="absolute bottom-10 left-10 hidden lg:block opacity-60"
      >
        <Image
          src="/images/services/services_shape01.png"
          alt="Bone shape"
          width={70}
          height={70}
        />
      </motion.div>
    </section>
  );
};

export default ServicesSection;
