'use client'; 

import Link from 'next/link';
import { motion } from "motion/react"; 

export default function CheckoutHeader() {
  // Define animation variants for the header
  const headerVariants = {
    hidden: { opacity: 0, y: -50 }, // Initial state: invisible, moved up
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } }, // Final state: visible, at original position
  };

  return (
    <motion.header
      className="bg-white py-4 shadow-sm"
      variants={headerVariants} // Apply the variants
      initial="hidden"          // Start from the 'hidden' state
      animate="visible"         // Animate to the 'visible' state when mounted
    >
      <div className="container mx-auto px-4 flex justify-between items-center">
        <Link href="/" className="text-primary-700 font-bold text-2xl tracking-tight">
          YourStore
        </Link>
        <Link href="/cart" className="text-neutral-600 hover:text-primary-700 text-sm">
          &larr; Back to Cart
        </Link>
      </div>
    </motion.header>
  );
}