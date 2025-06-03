// src/components/StatItem.tsx
import { motion } from "framer-motion"; // Import motion
import React from "react";
import useCounter from "@/lib/useCounter";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

interface StatItemProps {
  rawNumber: number;
  suffix: string;
  label: string;
  delay?: number;
}

const StatItem: React.FC<StatItemProps> = ({
  rawNumber,
  suffix,
  label,
  delay = 0,
}) => {
  // Call the useCounter hook here, at the top level of the functional component
  const animatedNumber = useCounter(rawNumber, suffix, {
    duration: 2000,
    delay,
  });

  return (
    <div className="flex flex-col items-start gap-3">
      <motion.span className="text-3xl md:text-4xl lg:text-5xl font-extrabold">
        {animatedNumber}
      </motion.span>
      <div className="w-64 h-px bg-primary-600 "></div>
      <span className="text-base md:text-lg opacity-80">{label}</span>
    </div>
  );
};

const StatsSection = () => {
  const stats = [
    { rawNumber: 15, suffix: "+", label: "Years Of Experience" },
    { rawNumber: 23, suffix: "K", label: "Our Beloved Clients" },
    { rawNumber: 15, suffix: "K+", label: "Real Customer Reviews" },
  ];

  return (
    <section className="relative py-20 lg:py-32 bg-primary">
      <div className="max-w-7xl mx-auto px-4 text-white relative z-10 flex flex-col lg:flex-row items-center lg:items-start gap-12">
        <div className="lg:w-1/2 text-center lg:text-left">
          <p className="text-sm font-semibold uppercase mb-2 opacity-70">
            Your Trust Our Priority
          </p>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold leading-tight mb-6">
            Professional Vest Care <br /> And Guaranteed Quality
          </h2>
          <p className="text-base md:text-lg mb-12 max-w-xl mx-auto lg:mx-0 opacity-80">
            Duis aute irure dolor in reprehenderit in voluptate velit esse. We
            understand that your furry friend treasured member of your pets are.
          </p>
          <button className="btn-bubble btn-bubble-tertiary !text-white hover:!text-primary">
            <Link href="/your-read-more-page" >
              <span>
                <span>Read More</span>
                <ArrowRight className="ml-2 w-4 h-4" />
              </span>
            </Link>
          </button>
        </div>

        {/* Right Section: Image and Statistics */}
        <div className="lg:w-1/2 flex flex-col items-center lg:items-end relative">
          {/* Main Image */}
          <div
            className="relative w-full max-w-md lg:max-w-lg mb-12 lg:mb-0 rounded-full overflow-hidden"
            style={{
              backgroundImage: `url('/path/to/your/image.jpg')`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              paddingTop: "66.66%",
              position: "relative",
              zIndex: 2,
              borderRadius: "20px",
            }}
          >
            <img
              src="/path/to/your/image.jpg" // Replace with the actual path to your image
              alt="Vets examining a dog"
              className="absolute inset-0 w-full h-full object-cover rounded-full"
            />
          </div>

          {/* Statistics Grid (Stacked vertically) */}
          <div className="flex flex-col gap-8 text-center lg:text-left lg:absolute lg:top-1/2 lg:right-0 lg:-translate-y-1/2 z-10 w-full lg:w-auto">
            {stats.map((stat, index) => (
              <StatItem
                key={index}
                rawNumber={stat.rawNumber}
                suffix={stat.suffix}
                label={stat.label}
                delay={index * 200}
              />
            ))}
          </div>
        </div>
      </div>
      
    </section>
  );
};

export default StatsSection;
