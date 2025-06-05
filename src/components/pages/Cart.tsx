"use client";
import React, { useState, useMemo } from "react";
// Removed import Image from "next/image"; as it's Next.js specific
import { motion, AnimatePresence } from "framer-motion";
import { Minus, Plus, Trash2, ShoppingCart } from "lucide-react";

const dummyCartItems = [
  {
    id: 1,
    name: "Meow Mix Seafood Medley Dry Cat Food, 3.15-Pound",
    imageUrl: "https://placehold.co/96x96/e0e0e0/555555?text=Product+1", // Placeholder image
    price: 29.00,
    quantity: 1,
  },
  {
    id: 2,
    name: "Pet Carrier Backpack - Large",
    imageUrl: "https://placehold.co/96x96/e0e0e0/555555?text=Product+2", // Placeholder image
    price: 55.50,
    quantity: 2,
  },
  {
    id: 3,
    name: "Dog Treats Variety Pack",
    imageUrl: "https://placehold.co/96x96/e0e0e0/555555?text=Product+3", // Placeholder image
    price: 12.75,
    quantity: 1,
  },
];

// Variants for page fade-in
const pageVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5, ease: "easeOut" },
};

// Variants for cart item animations (e.g., when adding/removing)
const itemVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.3 } },
  exit: { opacity: 0, x: -50, transition: { duration: 0.3 } },
};

const CartPage: React.FC = () => {
  // State to hold the cart items. In a real app, this would be global state.
  const [cartItems, setCartItems] = useState(dummyCartItems);

  // Calculate subtotal, shipping, and total whenever cartItems change
  const { subtotal, shipping, total } = useMemo(() => {
    const calculatedSubtotal = cartItems.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
    // Dummy shipping cost, can be made dynamic
    const calculatedShipping = calculatedSubtotal > 0 ? 7.50 : 0;
    const calculatedTotal = calculatedSubtotal + calculatedShipping;
    return {
      subtotal: calculatedSubtotal,
      shipping: calculatedShipping,
      total: calculatedTotal,
    };
  }, [cartItems]);

  // Handle quantity change for a specific item
  const handleQuantityChange = (itemId: number, type: "increment" | "decrement") => {
    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item.id === itemId
          ? {
              ...item,
              quantity:
                type === "increment"
                  ? item.quantity + 1
                  : Math.max(1, item.quantity - 1), // Ensure quantity doesn't go below 1
            }
          : item
      )
    );
  };

  // Handle removing an item from the cart
  const handleRemoveItem = (itemId: number) => {
    setCartItems((prevItems) => prevItems.filter((item) => item.id !== itemId));
  };

  return (
    <motion.div
      className="container mx-auto px-4 py-8 max-w-6xl"
      initial="initial"
      animate="animate"
      variants={pageVariants}
    >
      <h1 className="text-4xl font-bold text-primary mb-8 text-center">Your Shopping Cart</h1>

      {cartItems.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white p-8 rounded-lg shadow-md text-center flex flex-col items-center justify-center min-h-[300px]"
        >
          <ShoppingCart size={64} className="text-gray-400 mb-4" />
          <p className="text-xl text-gray-600 font-semibold mb-4">Your cart is empty!</p>
          <p className="text-gray-500 mb-6">Looks like you haven&apos;t added anything to your cart yet. Go ahead and explore our products.</p>
          <motion.button
            className="btn-bubble btn-bubble-primary inline-flex items-center gap-2"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => alert("Navigate to shop page")} // Replace with actual navigation
          >
            Start Shopping
          </motion.button>
        </motion.div>
      ) : (
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Cart Items List */}
          <div className="lg:w-2/3 bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6 border-b pb-4">
              Cart Items ({cartItems.length})
            </h2>
            <AnimatePresence>
              {cartItems.map((item) => (
                <motion.div
                  key={item.id}
                  className="flex flex-col sm:flex-row items-center justify-between border-b border-gray-200 py-4 last:border-b-0"
                  variants={itemVariants}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                >
                  <div className="flex items-center w-full sm:w-auto mb-4 sm:mb-0">
                    <div className="w-24 h-24 flex-shrink-0 rounded-lg overflow-hidden bg-gray-100 flex items-center justify-center">
                      {/* Replaced Next.js Image with standard <img> tag */}
                      <img
                        src={item.imageUrl}
                        alt={item.name}
                        className="w-full h-full object-contain rounded-lg"
                        onError={(e) => {
                            // Fallback to a placeholder image if the original fails
                            (e.target as HTMLImageElement).src = 'https://placehold.co/96x96/e0e0e0/555555?text=No+Image';
                        }}
                      />
                    </div>
                    <div className="ml-4 flex-grow">
                      <h3 className="text-lg font-medium text-primary line-clamp-2">{item.name}</h3>
                      <p className="text-gray-600 text-sm">Price: ${item.price.toFixed(2)}</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between w-full sm:w-auto gap-4">
                    {/* Quantity Control */}
                    <div className="flex items-center border border-gray-300 rounded-lg">
                      <motion.button
                        className="p-2 text-gray-600 hover:text-primary"
                        onClick={() => handleQuantityChange(item.id, "decrement")}
                        whileTap={{ scale: 0.9 }}
                      >
                        <Minus size={18} />
                      </motion.button>
                      <span className="px-4 text-md font-medium">
                        <motion.span
                          key={item.quantity} // Key change forces re-render and animation
                          initial={{ opacity: 0, y: -5 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.15 }}
                        >
                          {item.quantity}
                        </motion.span>
                      </span>
                      <motion.button
                        className="p-2 text-gray-600 hover:text-primary"
                        onClick={() => handleQuantityChange(item.id, "increment")}
                        whileTap={{ scale: 0.9 }}
                      >
                        <Plus size={18} />
                      </motion.button>
                    </div>

                    <p className="text-lg font-semibold text-gray-800 w-24 text-right">
                      ${(item.price * item.quantity).toFixed(2)}
                    </p>

                    {/* Remove Button */}
                    <motion.button
                      className="ml-4 text-gray-400 hover:text-red-500 transition-colors"
                      onClick={() => handleRemoveItem(item.id)}
                      whileTap={{ scale: 0.9 }}
                      aria-label="Remove item from cart"
                    >
                      <Trash2 size={20} />
                    </motion.button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* Cart Summary */}
          <div className="lg:w-1/3 bg-white p-6 rounded-lg shadow-md h-fit">
            <h2 className="text-2xl font-semibold text-secondary mb-6 border-b pb-4">
              Order Summary
            </h2>
            <div className="flex justify-between items-center mb-3">
              <span className="text-gray-600">Subtotal:</span>
              <span className="font-medium text-gray-800">${subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between items-center mb-3">
              <span className="text-gray-600">Shipping:</span>
              <span className="font-medium text-gray-800">${shipping.toFixed(2)}</span>
            </div>
            <div className="border-t border-gray-200 my-4"></div>
            <div className="flex justify-between items-center text-xl font-bold text-gray-800 mb-6">
              <span>Total:</span>
              <span>${total.toFixed(2)}</span>
            </div>
            <motion.button
              className="btn-bubble btn-bubble-primary w-full"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => alert("Proceed to Checkout!")} // Replace with actual checkout logic
            >
              Proceed to Checkout
            </motion.button>
            <p className="text-gray-500 text-sm mt-4 text-center">
              Shipping calculated at checkout.
            </p>
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default CartPage;
