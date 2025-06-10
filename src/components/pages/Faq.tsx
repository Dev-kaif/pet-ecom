// src/pages/faq.tsx
"use client";

import React, { useState } from "react";
import { Plus, Minus } from "lucide-react"; // For the icons
import { motion, AnimatePresence } from "motion/react"; // For animations

const FAQPage: React.FC = () => {
  // State to manage which accordion item is currently open.
  // We'll allow only one open at a time to match the visual style of the reference images.
  const [openIndex, setOpenIndex] = useState<number | null>(0); // Default to first item open

  const faqData = [
    {
      question: "Is There A Free Version Available?",
      answer:
        "When An Unknown Printer Took A Galley Of Type And Scrambled It To Make A Type Specimen Awea Book It Has Survived Not Only Five Centuriesbut Also The Leap Into Electronic Typesetting Good Remaining Essentiallybut Also The Leap Into Electronic.",
    },
    {
      question: "Rediscovering The Joy Of Design",
      answer:
        "Content for Rediscovering The Joy Of Design. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    },
    {
      question: "Better Context Menus With Safe Triangles",
      answer:
        "Content for Better Context Menus With Safe Triangles. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
    },
    {
      question: "Running A Page Speed Test: Monitoring vs. Measuring",
      answer:
        "Content for Running A Page Speed Test: Monitoring vs. Measuring. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.",
    },
    {
      question: "Using Friction As A Feature In Machine Learning Algorithms",
      answer:
        "Content for Using Friction As A Feature In Machine Learning Algorithms. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
    },
  ];

  const handleToggle = (index: number) => {
    setOpenIndex((prevIndex) => (prevIndex === index ? null : index));
  };

  return (
    <div className="bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
        <div className="text-center mb-5">
          <h2 className="text-3xl md:text-4xl font-bold text-primary leading-tight mb-4">
            Find Answer Of Your Questions
          </h2>
          <p className="max-w-2xl mx-auto text-lg text-gray-600">
            Maecenas quis viverra metus, et efficitur ligula. Nam congue augue
            sed luctus lectus conin onvallis condimentum.
          </p>
        </div>

        <div className="max-w-5xl mx-auto space-y-4">
          {faqData.map((item, index) => {
            const isOpen = openIndex === index;
            return (
              <div
                key={index}
                className="bg-[#f8f8f8] p-6 rounded-xl shadow-sm " // Card styling
              >
                <button
                  className="flex items-center justify-between w-full text-left text-xl font-semibold text-primary py-2 cursor-pointer focus:outline-none"
                  onClick={() => handleToggle(index)}
                  aria-expanded={isOpen}
                  aria-controls={`faq-panel-${index}`}
                >
                  {item.question}
                  <span className="ml-2 flex-shrink-0">
                    {" "}
                    {/* flex-shrink-0 prevents icon from squishing */}
                    <motion.div
                      animate={{ rotate: isOpen ? 0 : 0 }} // No rotation needed for plus/minus directly, but motion.div wraps for animation
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                      className={`rounded-full ${
                        isOpen
                          ? "bg-secondary text-white"
                          : "text-secondary bg-white"
                      }`} // Apply secondary color to the icon
                    >
                      {isOpen ? <Minus size={24} /> : <Plus size={24} />}{" "}
                      {/* Adjusted icon size slightly */}
                    </motion.div>
                  </span>
                </button>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      id={`faq-panel-${index}`}
                      initial="collapsed"
                      animate="open"
                      exit="collapsed"
                      variants={{
                        open: {
                          opacity: 1,
                          height: "auto",
                          marginTop: "0.75rem",
                        }, // Add margin-top for spacing
                        collapsed: { opacity: 0, height: 0, marginTop: "0rem" },
                      }}
                      transition={{ duration: 0.3, ease: [0.4, 0.0, 0.2, 1] }}
                      className="overflow-hidden" // important to clip height animation
                    >
                      <div className="text-gray-700">
                        {" "}
                        {/* No extra padding here, already handled by margin-top in motion.div */}
                        {item.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default FAQPage;
