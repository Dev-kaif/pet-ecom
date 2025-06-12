"use client";

import React from "react";
import { motion } from "framer-motion"; // use correct import for framer-motion
import { Check, ArrowRight } from "lucide-react";

interface PricingCardProps {
  plan: string;
  price: number;
  features: string[];
  isHighlighted?: boolean;
}

const PricingCard: React.FC<PricingCardProps> = ({
  plan,
  price,
  features,
  isHighlighted,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className={`bg-white p-6 rounded-xl shadow-md flex flex-col items-start text-start h-full ${
        isHighlighted ? "border-2 border-primary scale-105" : ""
      }`}
      style={{
        width: "370px",
        minHeight: "500px",
        maxWidth: "90%",
        margin: "0 auto",
      }}
    >
      <h3 className="text-3xl font-bold text-primary mb-4">{plan} Plan</h3>
      <div className="text-4xl font-extrabold text-secondary mb-6">
        ₹{price}
        <span className="text-lg font-normal text-gray-500">/month</span>
      </div>

      <ul className="text-left w-full space-y-3 mb-8">
        {features.map((feature, index) => (
          <li key={index} className="flex items-center text-primary">
            <Check size={20} className="text-green-500 mr-3 flex-shrink-0" />
            {feature}
          </li>
        ))}
      </ul>

      <button className="btn-bubble btn-bubble-primary mt-auto">
        <span className="flex items-center">
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
      price: 299,
      features: [
        "Access to basic pet products & toys",
        "2 vet consultations per month",
        "Standard delivery on orders",
        "Basic customer support",
      ],
    },
    {
      plan: "Basic",
      price: 799,
      features: [
        "Unlimited access to medicines, toys, and accessories",
        "Unlimited vet consultations (online & in-person)",
        "Priority delivery and faster service",
        "Access to grooming and training bookings",
        "Enhanced customer support",
      ],
      isHighlighted: true,
    },
    {
      plan: "Professional",
      price: 1999,
      features: [
        "Full access to all pet products and services",
        "Advanced booking options and management tools",
        "Marketing and promotional support for businesses",
        "Dedicated account manager",
        "24/7 priority support",
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
              isHighlighted={plan.isHighlighted}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default PricingSection;
