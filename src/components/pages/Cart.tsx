/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "motion/react";
import { Minus, Plus, Trash2, ShoppingCart } from "lucide-react";
import { useSession } from "next-auth/react";
import axios from "axios";
import { ICartItemFrontend } from "@/types";
import Loader from "../ui/Loader";
import Modal from "../ui/Modal"; // Import the new Modal component

// Define a type for the summary data fetched from the backend
interface CartSummaryResponse {
  subtotal: number;
  shippingPrice: number;
  taxPrice: number;
  totalPrice: number;
  itemCount: number;
  items?: Array<{
    productId: string;
    name: string;
    imageUrl: string;
    price: number;
    quantity: number;
    totalItemPrice: number;
  }>;
}

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

  // State for the backend-calculated summary
  const [cartSummary, setCartSummary] = useState<CartSummaryResponse | null>(
    null
  );
  const [summaryLoading, setSummaryLoading] = useState(false);
  const [summaryError, setSummaryError] = useState<string | null>(null);

  // --- NEW: Modal states ---
  const [isErrorModalOpen, setIsErrorModalOpen] = useState(false);
  const [errorModalMessage, setErrorModalMessage] = useState("");
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [confirmModalItemId, setConfirmModalItemId] = useState<string | null>(
    null
  );
  const [confirmModalMessage, setConfirmModalMessage] = useState("");

  // Function to show error modal
  const showErrorMessage = useCallback((message: string) => {
    setErrorModalMessage(message);
    setIsErrorModalOpen(true);
  }, []);

  // Function to show confirm modal
  const showConfirmModal = useCallback((message: string, itemId: string) => {
    setConfirmModalMessage(message);
    setConfirmModalItemId(itemId);
    setIsConfirmModalOpen(true);
  }, []);

  // --- Functions to close modals ---
  const closeErrorModal = useCallback(() => setIsErrorModalOpen(false), []);
  const closeConfirmModal = useCallback(() => {
    setIsConfirmModalOpen(false);
    setConfirmModalItemId(null); // Clear the item ID when closing
  }, []);

  const fetchCartSummary = useCallback(async () => {
    if (status !== "authenticated" || cartItems.length === 0) {
      setCartSummary({
        subtotal: 0,
        shippingPrice: 0,
        taxPrice: 0,
        totalPrice: 0,
        itemCount: 0,
      });
      setSummaryLoading(false);
      return;
    }

    setSummaryLoading(true);
    setSummaryError(null);
    try {
      const response = await axios.get<any>("/api/cart/summary");
      if (response.data.success) {
        setCartSummary(response.data.data);
      } else {
        setSummaryError(
          response.data.message || "Failed to fetch cart summary."
        );
      }
    } catch (err: any) {
      console.error("Error fetching cart summary:", err);
      setSummaryError(
        err.response?.data?.message ||
          err.message ||
          "Network error fetching cart summary."
      );
    } finally {
      setSummaryLoading(false);
    }
  }, [status, cartItems.length]);

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

  useEffect(() => {
    fetchCartData();
  }, [fetchCartData]);

  useEffect(() => {
    fetchCartSummary();
  }, [cartItems, status, fetchCartSummary]);

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

    newQuantity = Math.max(1, newQuantity);

    if (newQuantity > currentItem.stock) {
      showErrorMessage(
        `Cannot add more. Only ${currentItem.stock} left in stock.`
      );
      return;
    }

    if (newQuantity === currentItem.quantity) {
      return;
    }

    setUpdatingItemId(itemId);

    try {
      const response = await axios.put(`/api/cart/${itemId}`, {
        quantity: newQuantity,
      });

      if (response.data.success) {
        setCartItems((prevItems) =>
          prevItems.map((item) =>
            item._id === itemId ? { ...item, quantity: newQuantity } : item
          )
        );
      } else {
        showErrorMessage(response.data.message || "Failed to update quantity.");
        fetchCartData();
      }
    } catch (err: any) {
      console.error("Error updating quantity:", err);
      showErrorMessage(
        err.response?.data?.message ||
          err.message ||
          "Network error updating quantity."
      );
      fetchCartData();
    } finally {
      setUpdatingItemId(null);
    }
  };

  // Handle removing an item from the cart - now uses modal
  const handleRemoveItem = async (itemId: string) => {
    showConfirmModal(
      "Are you sure you want to remove this item from your cart?",
      itemId
    );
  };

  // Confirmed removal action (called from modal)
  const confirmedRemoveItem = async () => {
    if (!confirmModalItemId) return; // Should not happen if modal logic is correct

    setRemovingItemId(confirmModalItemId); // Set loading state for this item
    closeConfirmModal(); // Close the confirmation modal immediately

    try {
      const response = await axios.delete(`/api/cart/${confirmModalItemId}`);

      if (response.data.success) {
        setCartItems((prevItems) =>
          prevItems.filter((item) => item._id !== confirmModalItemId)
        );
      } else {
        showErrorMessage(response.data.message || "Failed to remove item.");
        fetchCartData();
      }
    } catch (err: any) {
      console.error("Error removing item:", err);
      showErrorMessage(
        err.response?.data?.message ||
          err.message ||
          "Network error removing item."
      );
      fetchCartData();
    } finally {
      setRemovingItemId(null);
    }
  };

  if (loading) {
    return <Loader />;
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

  const displaySummary = cartSummary || {
    subtotal: 0,
    shippingPrice: 0,
    taxPrice: 0,
    totalPrice: 0,
    itemCount: 0,
  };

  return (
    <motion.div
      className="container mx-auto px-4 py-32 max-w-6xl"
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
          <Link href="/shop" passHref>
            <motion.button
              className="btn-bubble btn-bubble-primary inline-flex items-center gap-2"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <span>Start Shopping</span>
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
                  key={item._id}
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
                        width={96}
                        height={96}
                        objectFit="contain"
                        className="rounded-lg"
                        onError={(e) => {
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
                          key={item.quantity}
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
                      onClick={() => handleRemoveItem(item._id)} // <-- Now calls modal handler
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
            <div className="h-46">
              {summaryLoading ? (
                <p className="text-gray-600">Calculating summary...</p>
              ) : summaryError ? (
                <p className="text-red-600">Error: {summaryError}</p>
              ) : (
                <>
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-gray-600">Subtotal:</span>
                    <span className="font-medium text-gray-800">
                      ${displaySummary.subtotal.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-gray-600">Shipping:</span>
                    <span className="font-medium text-gray-800">
                      {displaySummary.shippingPrice === 0
                        ? "FREE"
                        : `$${displaySummary.shippingPrice.toFixed(2)}`}
                    </span>
                  </div>
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-gray-600">Tax:</span>
                    <span className="font-medium text-gray-800">
                      ${displaySummary.taxPrice.toFixed(2)}
                    </span>
                  </div>
                  <div className="border-t border-gray-200 my-4"></div>
                  <div className="flex justify-between items-center text-xl font-bold text-gray-800 mb-6">
                    <span>Total:</span>
                    <span>${displaySummary.totalPrice.toFixed(2)}</span>
                  </div>
                </>
              )}
            </div>

            <motion.button
              className="btn-bubble btn-bubble-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => {
                if (cartItems.length > 0) {
                  window.location.href = "/checkout";
                } else {
                  showErrorMessage(
                    // <-- Uses modal for empty cart
                    "Your cart is empty. Please add items before proceeding to checkout."
                  );
                }
              }}
              disabled={
                cartItems.length === 0 ||
                summaryLoading ||
                summaryError !== null
              }
            >
              <span>Proceed to Checkout</span>
            </motion.button>
            <p className="text-gray-500 text-sm mt-4 text-center">
              Final prices confirmed at checkout.
            </p>
          </div>
        </div>
      )}

      {/* --- Modals for alerts and confirmations --- */}
      {/* Error Modal */}
      <Modal
        isOpen={isErrorModalOpen}
        onClose={closeErrorModal}
        title="Error"
        className="max-w-xs" // Make error modal a bit smaller
        footer={
          <div className="flex justify-end">
            <button
              onClick={closeErrorModal}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              OK
            </button>
          </div>
        }
      >
        <p>{errorModalMessage}</p>
      </Modal>

      {/* Confirmation Modal for Remove Item */}
      <Modal
        isOpen={isConfirmModalOpen}
        onClose={closeConfirmModal}
        title="Confirm Removal"
        className="max-w-sm"
        footer={
          <div className="flex justify-end gap-3">
            <button
              onClick={closeConfirmModal}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              onClick={confirmedRemoveItem} // Call the actual removal function
              className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
            >
              Remove
            </button>
          </div>
        }
      >
        <p>{confirmModalMessage}</p>
      </Modal>
    </motion.div>
  );
};

export default CartPage;
