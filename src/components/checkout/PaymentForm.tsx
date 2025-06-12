// src/app/checkout/components/PaymentForm.tsx
'use client';

import { PaymentMethod } from '@/types'; 
import { toast } from 'react-hot-toast';
import { AnimatePresence, motion } from 'motion/react';

interface PaymentFormProps {
  paymentMethod: PaymentMethod;
  setPaymentMethod: (method: PaymentMethod) => void;
  onNext: () => void;
  onBack: () => void;
}

export default function PaymentForm({ paymentMethod, setPaymentMethod, onNext, onBack }: PaymentFormProps) {

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!paymentMethod) {
      toast.error("Please select a payment method.");
      return;
    }
    onNext();
  };

  // Variants for the overall form container
  const formContainerVariants = {
    hidden: { opacity: 0, x: -50 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut",
        when: "beforeChildren", // Animate container first
        staggerChildren: 0.1, // Then stagger children (payment options)
      },
    },
  };

  // Variants for individual payment method labels
  const paymentOptionVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3, ease: "easeOut" } },
  };

  // Variants for the conditional card details section
  const cardDetailsVariants = {
    hidden: { opacity: 0, height: 0, overflow: 'hidden' },
    visible: { opacity: 1, height: 'auto', transition: { duration: 0.4, ease: "easeOut" } },
  };

  return (
    <motion.form
      onSubmit={handleSubmit}
      className="space-y-6"
      variants={formContainerVariants} // Apply form container animations
      initial="hidden"
      animate="visible"
    >
      {/* Payment Method Selection */}
      <div>
        <h3 className="text-lg font-medium text-neutral-800 mb-3">Select Payment Method</h3>
        <div className="space-y-3">
          {/* Card Option (Placeholder for Stripe Elements) */}
          <motion.label
            variants={paymentOptionVariants} // Apply animation to each label
            className={`flex items-center p-4 rounded-md border cursor-pointer transition-colors duration-200
              ${paymentMethod === 'card' ? 'border-primary-500 ring-2 ring-primary-200 bg-primary-50' : 'border-neutral-300 bg-white hover:bg-neutral-50'}`}
          >
            <input
              type="radio"
              name="paymentMethod"
              value="card"
              checked={paymentMethod === 'card'}
              onChange={() => setPaymentMethod('card')}
              className="form-radio h-4 w-4 text-primary-600 focus:ring-primary-500 mr-3"
            />
            <span className="font-medium text-neutral-800">Credit or Debit Card</span>
            <span className="ml-auto text-neutral-500 text-sm">
                <img src="/images/visa.svg" alt="Visa" className="inline-block h-4 w-auto mr-1" />
                <img src="/images/mastercard.svg" alt="Mastercard" className="inline-block h-4 w-auto" />
            </span>
          </motion.label>

          {/* PayPal Option */}
          <motion.label
            variants={paymentOptionVariants} // Apply animation to each label
            className={`flex items-center p-4 rounded-md border cursor-pointer transition-colors duration-200
              ${paymentMethod === 'paypal' ? 'border-primary-500 ring-2 ring-primary-200 bg-primary-50' : 'border-neutral-300 bg-white hover:bg-neutral-50'}`}
          >
            <input
              type="radio"
              name="paymentMethod"
              value="paypal"
              checked={paymentMethod === 'paypal'}
              onChange={() => setPaymentMethod('paypal')}
              className="form-radio h-4 w-4 text-primary-600 focus:ring-primary-500 mr-3"
            />
            <span className="font-medium text-neutral-800">PayPal</span>
            <span className="ml-auto">
                <img src="/images/paypal.svg" alt="PayPal" className="inline-block h-4 w-auto" />
            </span>
          </motion.label>

          {/* Cash on Delivery Option */}
          <motion.label
            variants={paymentOptionVariants} // Apply animation to each label
            className={`flex items-center p-4 rounded-md border cursor-pointer transition-colors duration-200
              ${paymentMethod === 'cash_on_delivery' ? 'border-primary-500 ring-2 ring-primary-200 bg-primary-50' : 'border-neutral-300 bg-white hover:bg-neutral-50'}`}
          >
            <input
              type="radio"
              name="paymentMethod"
              value="cash_on_delivery"
              checked={paymentMethod === 'cash_on_delivery'}
              onChange={() => setPaymentMethod('cash_on_delivery')}
              className="form-radio h-4 w-4 text-primary-600 focus:ring-primary-500 mr-3"
            />
            <span className="font-medium text-neutral-800">Cash on Delivery (COD)</span>
          </motion.label>
        </div>
      </div>

      {/* Placeholder for actual credit card form (if 'card' is selected) */}
      <AnimatePresence> {/* Use AnimatePresence for conditional rendering animations */}
        {paymentMethod === 'card' && (
          <motion.div
            key="card-details" // Unique key for AnimatePresence
            variants={cardDetailsVariants} // Apply animation to the conditional section
            initial="hidden"
            animate="visible"
            exit="hidden" // Ensure it animates out when no longer 'card'
            className="mt-6 p-4 bg-neutral-100 rounded-md border border-neutral-200"
          >
            <h4 className="font-semibold text-neutral-700 mb-3">Card Details</h4>
            <p className="text-sm text-neutral-500 italic">
              (Integration with a payment gateway like Stripe or PayPal would go here.
              This would involve their SDKs to securely collect card details or redirect to PayPal.)
            </p>
            <div className="space-y-4 mt-4">
                <div>
                  <label htmlFor="cardNumber" className="block text-sm font-medium text-neutral-700 mb-1">Card Number</label>
                  <input type="text" id="cardNumber" placeholder="**** **** **** ****" className="mt-1 block w-full border border-neutral-300 rounded-md shadow-sm p-2" disabled />
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="expiry" className="block text-sm font-medium text-neutral-700 mb-1">Expiry Date (MM/YY)</label>
                      <input type="text" id="expiry" placeholder="MM/YY" className="mt-1 block w-full border border-neutral-300 rounded-md shadow-sm p-2" disabled />
                    </div>
                    <div>
                      <label htmlFor="cvc" className="block text-sm font-medium text-neutral-700 mb-1">CVC</label>
                      <input type="text" id="cvc" placeholder="***" className="mt-1 block w-full border border-neutral-300 rounded-md shadow-sm p-2" disabled />
                    </div>
                </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>


      {/* Navigation Buttons */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.3 }}
        className="flex justify-between pt-4 border-t border-neutral-200"
      >
        <button
          type="button"
          onClick={onBack}
          className="px-6 py-3 border border-neutral-300 text-neutral-700 font-semibold rounded-md shadow-sm hover:bg-neutral-100 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 transition-colors duration-200"
        >
          Back
        </button>
        <button
          type="submit"
          className="px-6 py-3 bg-primary-500 text-white font-semibold rounded-md shadow-md hover:bg-primary-600 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 transition-colors duration-200"
        >
          Review Order
        </button>
      </motion.div>
    </motion.form>
  );
}