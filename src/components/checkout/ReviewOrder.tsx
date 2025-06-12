'use client';

import { IAddress, CalculatedCartSummary, PaymentMethod } from '@/types';
import { motion } from "motion/react";

interface ReviewOrderProps {
  shippingAddress: IAddress;
  paymentMethod: PaymentMethod;
  cartSummary: CalculatedCartSummary | null;
  onPlaceOrder: () => void;
  onBack: () => void;
  isProcessingOrder: boolean;
}

export default function ReviewOrder({
  shippingAddress,
  paymentMethod,
  cartSummary,
  onPlaceOrder,
  onBack,
  isProcessingOrder,
}: ReviewOrderProps) {
  if (!cartSummary) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center py-8"
      >
        <p className="text-secondary-700">Cart summary not available. Please go back.</p>
        <button onClick={onBack} className="mt-4 px-4 py-2 bg-neutral-200 rounded-md">Back</button>
      </motion.div>
    );
  }

  const getPaymentMethodDisplayName = (method: PaymentMethod): string => {
    switch (method) {
      case 'card': return 'Credit/Debit Card';
      case 'paypal': return 'PayPal';
      case 'cash_on_delivery': return 'Cash on Delivery (COD)';
      default: return 'Unknown';
    }
  };

  // Variants for the overall container (to stagger children sections)
  const containerVariants = {
    hidden: { opacity: 0, x: -50 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut",
        when: "beforeChildren",
        staggerChildren: 0.15, // Stagger major sections
      },
    },
  };

  // Variants for each major section (Shipping, Payment, Items, Totals)
  const sectionVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } },
  };

  // Variants for individual order items
  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3, ease: "easeOut" } },
  };

  // Variants for the final price breakdown lines
  const priceLineVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3, ease: "easeOut" } },
  };

  // Variants for the navigation buttons
  const buttonGroupVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut", delay: 0.6 } },
  };


  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-8"
    >
      {/* Shipping Details */}
      <motion.div variants={sectionVariants}>
        <h3 className="text-xl font-semibold text-neutral-800 mb-4">Shipping Details</h3>
        <div className="bg-neutral-50 p-4 rounded-md border border-neutral-200 text-neutral-700 text-sm space-y-1">
          <p className="font-medium">{shippingAddress.street}</p>
          {shippingAddress.apartment && <p>{shippingAddress.apartment}</p>}
          <p>{shippingAddress.city}, {shippingAddress.state} {shippingAddress.zipCode}</p>
          <p>{shippingAddress.country}</p>
        </div>
      </motion.div>

      {/* Payment Details */}
      <motion.div variants={sectionVariants}>
        <h3 className="text-xl font-semibold text-neutral-800 mb-4">Payment Method</h3>
        <div className="bg-neutral-50 p-4 rounded-md border border-neutral-200 text-neutral-700 text-sm">
          <p className="font-medium">{getPaymentMethodDisplayName(paymentMethod)}</p>
          {paymentMethod === 'card' && <p className="text-xs text-neutral-500">Details secured via payment gateway.</p>}
        </div>
      </motion.div>

      {/* Order Items Summary */}
      <motion.div variants={sectionVariants}>
        <h3 className="text-xl font-semibold text-neutral-800 mb-4">Items in Your Order</h3>
        <div className="space-y-4">
          {cartSummary.itemsDetails.map((item) => (
            <motion.div
              key={item.productId}
              variants={itemVariants} // Stagger individual items
              className="flex items-center space-x-3 text-sm"
            >
              <div className="relative w-16 h-16 flex-shrink-0 rounded-md overflow-hidden border border-neutral-200">
                <img
                  src={item.imageUrl}
                  alt={item.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-grow">
                <p className="font-medium text-neutral-700">{item.name}</p>
                <p className="text-neutral-500">Qty: {item.quantity}</p>
              </div>
              <p className="font-semibold text-neutral-800">${item.totalItemPrice.toFixed(2)}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Final Price Breakdown */}
      <motion.div variants={sectionVariants} className="border-t border-neutral-200 pt-6 space-y-2">
        <h3 className="text-xl font-semibold text-neutral-800 mb-4">Order Totals</h3>
        <motion.div variants={priceLineVariants} className="flex justify-between text-neutral-700">
          <span>Subtotal</span>
          <span>${cartSummary.subtotal.toFixed(2)}</span>
        </motion.div>
        <motion.div variants={priceLineVariants} className="flex justify-between text-neutral-700">
          <span>Shipping</span>
          <span>{cartSummary.shippingPrice === 0 ? 'Free' : `$${cartSummary.shippingPrice.toFixed(2)}`}</span>
        </motion.div>
        <motion.div variants={priceLineVariants} className="flex justify-between text-neutral-700">
          <span>Tax</span>
          <span>${cartSummary.taxPrice.toFixed(2)}</span>
        </motion.div>
        <motion.div variants={priceLineVariants} className="flex justify-between text-2xl font-bold text-neutral-900 border-t border-dashed border-neutral-300 pt-3 mt-3">
          <span>Grand Total</span>
          <span>${cartSummary.totalPrice.toFixed(2)}</span>
        </motion.div>
      </motion.div>

      {cartSummary.errors && cartSummary.errors.length > 0 && (
        <motion.div
          variants={sectionVariants} // Reuse section variants for error box
          className="mt-4 p-3 bg-secondary-50 text-secondary-700 border border-secondary-200 rounded-md text-sm"
        >
          <p className="font-semibold mb-1">Errors/Warnings:</p>
          <ul className="list-disc pl-5">
            {cartSummary.errors.map((error, index) => (
              <li key={index}>{error}</li>
            ))}
          </ul>
        </motion.div>
      )}

      {/* Navigation Buttons */}
      <motion.div
        variants={buttonGroupVariants}
        className="flex justify-between pt-6 border-t border-neutral-200"
      >
        <button
          type="button"
          onClick={onBack}
          className="px-6 py-3 border border-neutral-300 text-neutral-700 font-semibold rounded-md shadow-sm hover:bg-neutral-100 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 transition-colors duration-200"
          disabled={isProcessingOrder}
        >
          Back
        </button>
        <button
          type="button"
          onClick={onPlaceOrder}
          className="px-6 py-3 bg-primary-500 text-white font-semibold rounded-md shadow-md hover:bg-primary-600 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={isProcessingOrder}
        >
          {isProcessingOrder ? 'Processing...' : `Place Order - $${cartSummary.totalPrice.toFixed(2)}`}
        </button>
      </motion.div>
    </motion.div>
  );
}