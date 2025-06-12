"use client"; 

import { CalculatedCartSummary } from "@/types"; 
import Image from "next/image";
import { motion } from "motion/react"; 

interface OrderSummarySidebarProps {
  cartSummary: CalculatedCartSummary;
}

export default function OrderSummarySidebar({
  cartSummary,
}: OrderSummarySidebarProps) {
  // Variants for the overall sidebar container
  const containerVariants = {
    hidden: { opacity: 0, x: 50 }, // Start off-screen to the right, invisible
    visible: {
      opacity: 1,
      x: 0, // Slide to original position
      transition: {
        duration: 0.6,
        ease: "easeOut",
        when: "beforeChildren", // Animate container first, then children
        staggerChildren: 0.1, // Stagger children animations
      },
    },
  };

  // Variants for individual cart items (children of the container)
  const itemVariants = {
    hidden: { opacity: 0, y: 20 }, // Start invisible, slightly below
    visible: { opacity: 1, y: 0 }, // Fade in, slide up
  };

  // Variants for the summary lines (subtotal, shipping, tax, total)
  const summaryLineVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.3, ease: "easeOut" },
    },
  };

  return (
    <motion.div
      variants={containerVariants} // Apply container animations
      initial="hidden"
      animate="visible"
    >
      <h3 className="text-xl font-semibold text-neutral-800 mb-4">
        Order Summary
      </h3>
      <motion.div
        className="space-y-4 mb-6"
        // No need for separate initial/animate here, as children will inherit/stagger
      >
        {cartSummary.itemsDetails.map((item) => (
          <motion.div
            key={item.productId}
            variants={itemVariants} // Apply item animations
            className="flex items-center space-x-3"
          >
            <div className="relative w-16 h-16 flex-shrink-0 rounded-md overflow-hidden border border-neutral-200">
              <Image
                src={item.imageUrl}
                alt={item.name}
                layout="fill"
                objectFit="cover"
                className="absolute"
              />
            </div>
            <div className="flex-grow">
              <p className="text-neutral-700 font-medium text-sm line-clamp-1">
                {item.name}
              </p>
              <p className="text-neutral-500 text-xs">Qty: {item.quantity}</p>
            </div>
            <p className="text-neutral-800 font-semibold text-sm">
              ${item.totalItemPrice.toFixed(2)}
            </p>
          </motion.div>
        ))}
      </motion.div>

      <div className="border-t border-neutral-200 pt-4 space-y-2">
        <motion.div
          variants={summaryLineVariants}
          className="flex justify-between text-neutral-700"
        >
          <span>Subtotal ({cartSummary.itemCount} items)</span>
          <span>${cartSummary.subtotal.toFixed(2)}</span>
        </motion.div>
        <motion.div
          variants={summaryLineVariants}
          className="flex justify-between text-neutral-700"
        >
          <span>Shipping</span>
          <span>
            {cartSummary.shippingPrice === 0
              ? "Free"
              : `$${cartSummary.shippingPrice.toFixed(2)}`}
          </span>
        </motion.div>
        <motion.div
          variants={summaryLineVariants}
          className="flex justify-between text-neutral-700"
        >
          <span>Tax ({cartSummary.taxRate * 100}%)</span>
          <span>${cartSummary.taxPrice.toFixed(2)}</span>
        </motion.div>
        <motion.div
          variants={summaryLineVariants}
          className="flex justify-between text-xl font-bold text-neutral-900 border-t border-dashed border-neutral-300 pt-3 mt-3"
        >
          <span>Order Total</span>
          <span>${cartSummary.totalPrice.toFixed(2)}</span>
        </motion.div>
      </div>

      {cartSummary.errors && cartSummary.errors.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }} // Animate error box separately
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.4 }}
          className="mt-4 p-3 bg-secondary-50 text-secondary-700 border border-secondary-200 rounded-md text-sm"
        >
          <p className="font-semibold mb-1">Important:</p>
          <ul className="list-disc pl-5">
            {cartSummary.errors.map((error, index) => (
              <li key={index}>{error}</li>
            ))}
          </ul>
        </motion.div>
      )}
    </motion.div>
  );
}
