"use client";
import React from "react";
import Link from "next/link";
import { MoveRight } from "lucide-react";
import Image from "next/image";
import { NumberTicker } from "@/components/ui/NumberTicker";
import { motion } from "motion/react"; // Assuming 'motion/react' is the correct import for "motion/react"

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
}) => {
  return (
    <div className="flex flex-col items-start gap-3">
      <motion.span className="text-3xl md:text-4xl lg:text-5xl font-extrabold">
        <NumberTicker value={rawNumber} />
        {suffix}
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
    <section className="relative py-20 lg:py-32 bg-primary overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 text-white relative z-10 flex flex-col lg:flex-row items-center lg:items-start lg:justify-between gap-12">
        {/* Left Section: Text Content */}
        <div className="lg:w-[45%] text-center lg:text-left lg:pr-12">
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

        {/* Right Section: Image and Statistics - Arranged side-by-side */}
        <div className="lg:w-[55%] flex flex-col md:flex-row items-center justify-center gap-8 relative lg:pl-12">
          {/* Main Image */}
          <div
            className="relative w-full max-w-sm sm:max-w-md lg:max-w-lg rounded-3xl overflow-hidden shadow-xl" // Adjust max-width to fit beside stats
          >
            <Image
              width={550} // Reduced width to accommodate stats next to it
              height={450} // Reduced height accordingly
              src="/images/counter/counter.webp" // Assuming this is the correct image path
              alt="Vets examining a dog"
              className="w-full h-full object-cover"
            />
          </div>

          {/* Statistics Grid (Stacked vertically) */}
          {/* Removed absolute positioning to place it next to the image */}
          <div className="flex flex-col gap-8 text-white z-20"> {/* No background needed as it's not overlaying */}
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

        {/* Decorative Shapes */}
        <div>
          <Image
            // Adjusted position for counter_shape01.png
            className="absolute left-[20%] transform -translate-x-1/2 bottom-10 w-30 h-30 opacity-30"
            width={100}
            height={100}
            alt="Decorative shape 1"
            src={"/images/counter/counter_shape01.png"}
          />
          <Image
            // Adjusted position for counter_shape02.png
            className="absolute top-18 right-0 -mr-16 w-50 h-50 opacity-30"
            width={100}
            height={100}
            alt="Decorative shape 2"
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