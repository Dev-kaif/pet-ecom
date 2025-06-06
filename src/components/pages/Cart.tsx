/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState, useMemo, useEffect, useCallback } from "react";
import Image from "next/image"; // Re-import Next.js Image component if you are using Next.js framework
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Minus, Plus, Trash2, ShoppingCart } from "lucide-react";
import { useSession } from "next-auth/react";
import axios from "axios"; // Import Axios
import { ICartItemFrontend } from "@/types";

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
  const { status } = useSession();
  const [cartItems, setCartItems] = useState<ICartItemFrontend[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updatingItemId, setUpdatingItemId] = useState<string | null>(null);
  const [removingItemId, setRemovingItemId] = useState<string | null>(null);

  const fetchCartData = useCallback(async () => {
    if (status !== "authenticated") {
      setLoading(false);
      setCartItems([]);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const response = await axios.get("/api/cart");
      if (response.data.success) {
        setCartItems(response.data.data.items);
      } else {
        setError(response.data.message || "Failed to fetch cart.");
        setCartItems([]);
      }
    } catch (err: any) {
      console.error("Error fetching cart:", err);
      setError(
        err.response?.data?.message ||
          err.message ||
          "Network error fetching cart."
      );
      setCartItems([]);
    } finally {
      setLoading(false);
    }
  }, [status]);

  // Effect to fetch cart data on component mount or session change
  useEffect(() => {
    fetchCartData();
  }, [fetchCartData]);

  // Calculate subtotal, shipping, and total whenever cartItems change
  const { subtotal, shipping, total } = useMemo(() => {
    const calculatedSubtotal = cartItems.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
    // Dummy shipping cost, can be made dynamic
    const calculatedShipping = calculatedSubtotal > 0 ? 7.5 : 0;
    const calculatedTotal = calculatedSubtotal + calculatedShipping;
    return {
      subtotal: calculatedSubtotal,
      shipping: calculatedShipping,
      total: calculatedTotal,
    };
  }, [cartItems]);

  // Handle quantity change for a specific item
  const handleQuantityChange = async (
    itemId: string,
    type: "increment" | "decrement"
  ) => {
    const currentItem = cartItems.find((item) => item._id === itemId);
    if (!currentItem) return;

    let newQuantity =
      type === "increment"
        ? currentItem.quantity + 1
        : currentItem.quantity - 1;

    // Client-side validation: ensure quantity doesn't go below 1
    newQuantity = Math.max(1, newQuantity);

    // Client-side validation: check against available stock
    if (newQuantity > currentItem.stock) {
      alert(`Cannot add more. Only ${currentItem.stock} left in stock.`);
      return;
    }

    // If quantity hasn't changed, do nothing
    if (newQuantity === currentItem.quantity) {
      return;
    }

    setUpdatingItemId(itemId); // Set loading state for this item

    try {
      const response = await axios.put(`/api/cart/${itemId}`, {
        quantity: newQuantity,
      });

      if (response.data.success) {
        // Optimistically update or re-fetch for absolute consistency
        setCartItems((prevItems) =>
          prevItems.map((item) =>
            item._id === itemId ? { ...item, quantity: newQuantity } : item
          )
        );
      } else {
        alert(response.data.message || "Failed to update quantity.");
        // Re-fetch cart if update failed to revert optimistic update or sync
        fetchCartData();
      }
    } catch (err: any) {
      console.error("Error updating quantity:", err);
      alert(
        err.response?.data?.message ||
          err.message ||
          "Network error updating quantity."
      );
      // Re-fetch cart if update failed
      fetchCartData();
    } finally {
      setUpdatingItemId(null); // Clear loading state for this item
    }
  };

  // Handle removing an item from the cart
  const handleRemoveItem = async (itemId: string) => {
    if (!window.confirm("Are you sure you want to remove this item?")) {
      return;
    }
    setRemovingItemId(itemId); // Set loading state for this item

    try {
      const response = await axios.delete(`/api/cart/${itemId}`);

      if (response.data.success) {
        // Remove item from state if successful
        setCartItems((prevItems) =>
          prevItems.filter((item) => item._id !== itemId)
        );
      } else {
        alert(response.data.message || "Failed to remove item.");
        // Re-fetch cart if removal failed
        fetchCartData();
      }
    } catch (err: any) {
      console.error("Error removing item:", err);
      alert(
        err.response?.data?.message ||
          err.message ||
          "Network error removing item."
      );
      // Re-fetch cart if removal failed
      fetchCartData();
    } finally {
      setRemovingItemId(null); // Clear loading state for this item
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 text-center text-lg text-gray-700">
        Loading cart...
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8 text-center text-lg text-red-600">
        Error: {error}
        {status === "unauthenticated" && (
          <p className="mt-4">
            Please{" "}
            <Link
              href="/api/auth/signin"
              className="text-primary hover:underline"
            >
              log in
            </Link>{" "}
            to view your cart.
          </p>
        )}
      </div>
    );
  }

  return (
    <motion.div
      className="container mx-auto px-4 py-8 max-w-6xl"
      initial="initial"
      animate="animate"
      variants={pageVariants}
    >
      <h1 className="text-4xl font-bold text-primary mb-8 text-center">
        Your Shopping Cart
      </h1>

      {cartItems.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white p-8 rounded-lg shadow-md text-center flex flex-col items-center justify-center min-h-[300px]"
        >
          <ShoppingCart size={64} className="text-gray-400 mb-4" />
          <p className="text-xl text-gray-600 font-semibold mb-4">
            Your cart is empty!
          </p>
          <p className="text-gray-500 mb-6">
            Looks like you haven&apos;t added anything to your cart yet. Go
            ahead and explore our products.
          </p>
          <Link href="/products" passHref>
            {" "}
            {/* Link to your products page */}
            <motion.button
              className="btn-bubble btn-bubble-primary inline-flex items-center gap-2"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Start Shopping
            </motion.button>
          </Link>
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
                  key={item._id} // Use backend _id for key
                  className="flex flex-col sm:flex-row items-center justify-between border-b border-gray-200 py-4 last:border-b-0"
                  variants={itemVariants}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                >
                  <div className="flex items-center w-full sm:w-auto mb-4 sm:mb-0">
                    <div className="w-24 h-24 flex-shrink-0 rounded-lg overflow-hidden bg-gray-100 flex items-center justify-center">
                      <Image
                        unoptimized
                        src={item.imageUrl}
                        alt={item.name}
                        width={96} // Specify width
                        height={96} // Specify height
                        objectFit="contain" // Use objectFit
                        className="rounded-lg"
                        onError={(e) => {
                          // Fallback to a placeholder image if the original fails
                          (e.target as HTMLImageElement).src =
                            "https://placehold.co/96x96/e0e0e0/555555?text=No+Image";
                        }}
                      />
                    </div>
                    <div className="ml-4 flex-grow">
                      <h3 className="text-lg font-medium text-primary line-clamp-2">
                        {item.name}
                      </h3>
                      <p className="text-gray-600 text-sm">
                        Price: ${item.price.toFixed(2)}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between w-full sm:w-auto gap-4">
                    {/* Quantity Control */}
                    <div className="flex items-center border border-gray-300 rounded-lg">
                      <motion.button
                        className="p-2 text-gray-600 hover:text-primary disabled:opacity-50 disabled:cursor-not-allowed"
                        onClick={() =>
                          handleQuantityChange(item._id, "decrement")
                        }
                        whileTap={{ scale: 0.9 }}
                        disabled={updatingItemId === item._id}
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
                          {updatingItemId === item._id ? (
                            <svg
                              className="animate-spin h-4 w-4 text-gray-500 mx-auto"
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                            >
                              <circle
                                className="opacity-25"
                                cx="12"
                                cy="12"
                                r="10"
                                stroke="currentColor"
                                strokeWidth="4"
                              ></circle>
                              <path
                                className="opacity-75"
                                fill="currentColor"
                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                              ></path>
                            </svg>
                          ) : (
                            item.quantity
                          )}
                        </motion.span>
                      </span>
                      <motion.button
                        className="p-2 text-gray-600 hover:text-primary disabled:opacity-50 disabled:cursor-not-allowed"
                        onClick={() =>
                          handleQuantityChange(item._id, "increment")
                        }
                        whileTap={{ scale: 0.9 }}
                        disabled={
                          updatingItemId === item._id ||
                          item.quantity >= item.stock
                        }
                      >
                        <Plus size={18} />
                      </motion.button>
                    </div>

                    <p className="text-lg font-semibold text-gray-800 w-24 text-right">
                      ${(item.price * item.quantity).toFixed(2)}
                    </p>

                    {/* Remove Button */}
                    <motion.button
                      className="ml-4 text-gray-400 hover:text-red-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      onClick={() => handleRemoveItem(item._id)}
                      whileTap={{ scale: 0.9 }}
                      aria-label="Remove item from cart"
                      disabled={removingItemId === item._id}
                    >
                      {removingItemId === item._id ? (
                        <svg
                          className="animate-spin h-5 w-5 text-gray-500"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                      ) : (
                        <Trash2 size={20} />
                      )}
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
              <span className="font-medium text-gray-800">
                ${subtotal.toFixed(2)}
              </span>
            </div>
            <div className="flex justify-between items-center mb-3">
              <span className="text-gray-600">Shipping:</span>
              <span className="font-medium text-gray-800">
                ${shipping.toFixed(2)}
              </span>
            </div>
            <div className="border-t border-gray-200 my-4"></div>
            <div className="flex justify-between items-center text-xl font-bold text-gray-800 mb-6">
              <span>Total:</span>
              <span>${total.toFixed(2)}</span>
            </div>
            <motion.button
              className="btn-bubble btn-bubble-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => alert("Proceed to Checkout!")} // Replace with actual checkout logic
              disabled={cartItems.length === 0}
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
