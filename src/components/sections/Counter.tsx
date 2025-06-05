// src/components/StatItem.tsx
import { motion } from "framer-motion"; // Import motion
import React from "react";
import useCounter from "@/components/lib/useCounter";
import Link from "next/link";
import { MoveRight } from "lucide-react";
import Image from "next/image";

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
  const brandImages = [
    "/images/counter/Brands/brand_img01.png",
    "/images/counter/Brands/brand_img02.png",
    "/images/counter/Brands/brand_img03.png",
    "/images/counter/Brands/brand_img04.png",
    "/images/counter/Brands/brand_img05.png",
    "/images/counter/Brands/brand_img06.png",
    "/images/counter/Brands/brand_img07.png",
  ];

  const imageWidth = 120;
  const imageHeight = 120;

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
          <Link
            href="/read-more"
            className="btn-bubble btn-bubble-tertiary !text-white hover:!text-primary"
          >
            <span>
              <span>Read More</span>
              <MoveRight />
            </span>
          </Link>
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
              src="/public/images/about/#"
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
        <div>
          <Image
            className="absolute left-[50%] transform -translate-x-1/2 bottom-10 w-30 h-30"
            width={100}
            height={100}
            alt="idk"
            src={"/images/counter/counter_shape01.png"}
          />
          <Image
            className="absolute top-18 -right-5 w-50 h-50"
            width={100}
            height={100}
            alt="idk"
            src={"/images/counter/counter_shape02.png"}
          />
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 text-white relative z-10 flex flex-col items-center mt-10 gap-10">
        <div className="w-full h-px bg-primary-600 "></div>
        <div className="flex gap-x-16 items-center justify-center flex-wrap">
          {brandImages.map((src, index) => (
            <Image
              key={index}
              width={imageWidth}
              height={imageHeight}
              alt={`Brand ${index + 1}`}
              src={src}
              style={{ objectFit: "contain" }}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default StatsSection;
