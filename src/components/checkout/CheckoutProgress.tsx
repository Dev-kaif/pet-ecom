// src/app/checkout/components/CheckoutProgress.tsx
'use client'; 

import React from 'react';
import { motion } from "motion/react"; // Import motion

interface CheckoutProgressProps {
  currentStep: number;
}

const steps = [
  { id: 1, name: 'Shipping', description: 'Enter your shipping details' },
  { id: 2, name: 'Payment', description: 'Choose your payment method' },
  { id: 3, name: 'Review', description: 'Review your order' },
];

export default function CheckoutProgress({ currentStep }: CheckoutProgressProps) {


  const completedVariants = {
    initial: { opacity: 0, x: -20 },
    animate: { opacity: 1, x: 0, transition: { type: "spring", stiffness: 300, damping: 24 } },
  };

  const currentVariants = {
    initial: { opacity: 0, y: 10 },
    animate: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } },
  };

  const upcomingVariants = {
    initial: { opacity: 0.5 },
    animate: { opacity: 1 },
  };


  return (
    <nav aria-label="Progress" className="mb-8">
      <ol role="list" className="flex items-center justify-between">
        {steps.map((step, stepIdx) => (
          <li key={step.id} className="relative flex-1">
            {step.id < currentStep ? ( // Completed Step
              <motion.div
                variants={completedVariants}
                initial="initial"
                animate="animate"
                className="group flex w-full items-center"
              >
                <span className="flex items-center px-2 py-2 text-sm font-medium">
                  <span className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-primary-600 group-hover:bg-primary-800 transition duration-200">
                    <svg className="h-5 w-5 text-white" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                      <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.052-.143z" clipRule="evenodd" />
                    </svg>
                  </span>
                  <span className="ml-3 text-sm font-medium text-primary-600 transition duration-200">
                    {step.name}
                  </span>
                </span>
                {stepIdx !== steps.length - 1 ? (
                  <div className="absolute right-0 top-0 hidden h-full w-5 md:block" aria-hidden="true">
                    <svg className="h-full w-full text-neutral-300" viewBox="0 0 22 80" fill="none" preserveAspectRatio="none">
                      <path d="M0 -3.25L22 40L0 83.25" vectorEffect="non-scaling-stroke" strokeWidth={2} stroke="currentcolor" strokeLinejoin="round" />
                    </svg>
                  </div>
                ) : null}
              </motion.div>
            ) : step.id === currentStep ? ( // Current Step
              <motion.div
                variants={currentVariants}
                initial="initial"
                animate="animate"
                className="flex items-center px-2 py-2 text-sm font-medium" aria-current="step"
              >
                <span className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full border-2 border-primary-600">
                  <span className="text-primary-600">{step.id}</span>
                </span>
                <span className="ml-3 text-sm font-medium text-primary-600">{step.name}</span>
                {stepIdx !== steps.length - 1 ? (
                  <div className="absolute right-0 top-0 hidden h-full w-5 md:block" aria-hidden="true">
                    <svg className="h-full w-full text-neutral-300" viewBox="0 0 22 80" fill="none" preserveAspectRatio="none">
                      <path d="M0 -3.25L22 40L0 83.25" vectorEffect="non-scaling-stroke" strokeWidth={2} stroke="currentcolor" strokeLinejoin="round" />
                    </svg>
                  </div>
                ) : null}
              </motion.div>
            ) : ( // Upcoming Step
              <motion.div
                variants={upcomingVariants}
                initial="initial"
                animate="animate"
                className="group flex items-center"
              >
                <span className="flex items-center px-2 py-2 text-sm font-medium">
                  <span className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full border-2 border-neutral-300 group-hover:border-neutral-400 transition duration-200">
                    <span className="text-neutral-500 group-hover:text-neutral-900 transition duration-200">{step.id}</span>
                  </span>
                  <span className="ml-3 text-sm font-medium text-neutral-500 group-hover:text-neutral-900 transition duration-200">
                    {step.name}
                  </span>
                </span>
                {stepIdx !== steps.length - 1 ? (
                  <div className="absolute right-0 top-0 hidden h-full w-5 md:block" aria-hidden="true">
                    <svg className="h-full w-full text-neutral-300" viewBox="0 0 22 80" fill="none" preserveAspectRatio="none">
                      <path d="M0 -3.25L22 40L0 83.25" vectorEffect="non-scaling-stroke" strokeWidth={2} stroke="currentcolor" strokeLinejoin="round" />
                    </svg>
                  </div>
                ) : null}
              </motion.div>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}