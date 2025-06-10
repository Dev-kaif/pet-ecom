"use client";

import React from "react";
import { motion } from "motion/react";
import { Check } from "lucide-react"; // For the checkmark icon
import { ArrowRight } from "lucide-react"; // For the arrow icon on the button

interface PricingCardProps {
  plan: string;
  price: number;
  features: string[];
  isHighlighted?: boolean; // If one plan needs to be visually distinct (e.g., "Most Popular")
}

const PricingCard: React.FC<PricingCardProps> = ({ plan, price, features }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="bg-white p-6 rounded-xl shadow-md flex flex-col items-start text-start h-full"
      style={{
        width: "370px",
        minHeight: "500px",
        maxWidth: "90%",
        margin: "0 auto",
      }}
    >
      <h3 className="text-3xl font-bold text-primary mb-4 ">{plan}</h3>
      <div className="text-6xl font-extrabold text-secondary mb-6">
        ${price}
        <span className="text-lg font-normal text-gray-500">/mo</span>
      </div>

      <p className="text-gray-600 mb-6 flex-grow">
        When An Unknown Printer Took A Galley Of Type And Scrambled Make.
      </p>

      <ul className="text-left w-full space-y-3 mb-8">
        {features.map((feature, index) => (
          <li key={index} className="flex items-center text-primary">
            <Check size={20} className="text-green-500 mr-3 flex-shrink-0" />
            {feature}
          </li>
        ))}
      </ul>

      <button className="btn-bubble btn-bubble-primary">
        <span>
          Choose Plan <ArrowRight size={18} className="ml-2" />
        </span>
      </button>
    </motion.div>
  );
};

const PricingSection: React.FC = () => {
  const pricingPlans = [
    {
      plan: "Starter",
      price: 19,
      features: [
        "Pet Grooming",
        "Physical Exam",
        "Body Trimming/Styling",
        "Paw Massage",
        "3x Vaccination (7 in 1)",
      ],
    },
    {
      plan: "Basic",
      price: 29,
      features: [
        "Pet Grooming",
        "Physical Exam",
        "Body Trimming/Styling",
        "Paw Massage",
        "3x Vaccination (7 in 1)",
      ],
    },
    {
      plan: "Professional",
      price: 99,
      features: [
        "Pet Grooming",
        "Physical Exam",
        "Body Trimming/Styling",
        "Paw Massage",
        "3x Vaccination (7 in 1)",
      ],
    },
  ];

  return (
    <section className="bg-gray-50 py-16 lg:py-24">
      <div className="px-4 sm:px-16 lg:px-32">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 items-stretch justify-center">
          {pricingPlans.map((plan, index) => (
            <PricingCard
              key={index}
              plan={plan.plan}
              price={plan.price}
              features={plan.features}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default PricingSection;
