/* eslint-disable @typescript-eslint/no-explicit-any */
// src/app/wishlist/page.tsx
"use client";

import React, { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, ShoppingCart, Trash2 } from "lucide-react";
import { useSession } from "next-auth/react";
import axios from "axios";
import { IWishlistItemFrontend } from "@/types"; // Import from your common types file

// Variants for page fade-in
const pageVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5, ease: "easeOut" },
};

// Variants for wishlist item animations
const itemVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.3 } },
  exit: { opacity: 0, x: -50, transition: { duration: 0.3 } },
};

const WishlistPage: React.FC = () => {
  const { status } = useSession();
  const [wishlistItems, setWishlistItems] = useState<IWishlistItemFrontend[]>(
    []
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [removingItemId, setRemovingItemId] = useState<string | null>(null);
  const [movingToCartItemId, setMovingToCartItemId] = useState<string | null>(
    null
  );

  // General message utility (can be enhanced with a toast library)
  const showMessage = (type: "success" | "error", text: string) => {
    // For simplicity, using alert. Replace with a proper toast/modal.
    alert(`${type.toUpperCase()}: ${text}`);
  };

  // Function to fetch wishlist data
  const fetchWishlistData = useCallback(async () => {
    if (status !== "authenticated") {
      setLoading(false);
      setWishlistItems([]);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const response = await axios.get("/api/wishlist");
      if (response.data.success) {
        setWishlistItems(response.data.data.items);
      } else {
        setError(response.data.message || "Failed to fetch wishlist.");
        showMessage(
          "error",
          response.data.message || "Failed to fetch wishlist."
        );
      }
    } catch (err: any) {
      console.error("Error fetching wishlist:", err);
      setError(
        err.response?.data?.message ||
          err.message ||
          "Network error fetching wishlist."
      );
      showMessage(
        "error",
        err.response?.data?.message ||
          err.message ||
          "Network error fetching wishlist."
      );
    } finally {
      setLoading(false);
    }
  }, [status]);

  useEffect(() => {
    fetchWishlistData();
  }, [fetchWishlistData]);

  // Handle removing an item from the wishlist
  const handleRemoveItem = async (productIdToRemove: string) => {
    if (
      !window.confirm(
        "Are you sure you want to remove this item from your wishlist?"
      )
    ) {
      return;
    }

    if (status !== "authenticated") {
      showMessage("error", "Please log in to manage your wishlist.");
      return;
    }

    setRemovingItemId(productIdToRemove);
    try {
      const response = await axios.delete(`/api/wishlist/${productIdToRemove}`);
      if (response.data.success) {
        showMessage(
          "success",
          response.data.message || "Item removed from wishlist."
        );
        setWishlistItems((prevItems) =>
          prevItems.filter((item) => item.productId !== productIdToRemove)
        );
      } else {
        showMessage(
          "error",
          response.data.message || "Failed to remove item from wishlist."
        );
      }
    } catch (err: any) {
      console.error("Error removing item from wishlist:", err);
      showMessage(
        "error",
        err.response?.data?.message ||
          err.message ||
          "Network error removing item."
      );
    } finally {
      setRemovingItemId(null);
    }
  };

  // Handle moving an item to the cart
  const handleMoveToCart = async (item: IWishlistItemFrontend) => {
    if (status !== "authenticated") {
      showMessage("error", "Please log in to add items to your cart.");
      return;
    }

    if (item.stock !== undefined && item.stock <= 0) {
      showMessage("error", "This product is out of stock.");
      return;
    }

    setMovingToCartItemId(item.productId);
    try {
      const response = await axios.post("/api/cart", {
        productId: item.productId,
        quantity: 1, 
      });

      if (response.data.success) {
        showMessage("success", `"${item.name}" added to cart!`);
        handleRemoveItem(item.productId); 
      } else {
        showMessage(
          "error",
          response.data.message || `Failed to add "${item.name}" to cart.`
        );
      }
    } catch (err: any) {
      console.error("Error moving to cart:", err);
      showMessage(
        "error",
        err.response?.data?.message ||
          err.message ||
          `Network error adding "${item.name}" to cart.`
      );
    } finally {
      setMovingToCartItemId(null);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 text-center text-lg text-gray-700">
        Loading wishlist...
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
            to view your wishlist.
          </p>
        )}
      </div>
    );
  }

  return (
    <motion.div
      className="container mx-auto px-4 py-32 max-w-6xl"
      initial="initial"
      animate="animate"
      variants={pageVariants}
    >
      <h1 className="text-4xl font-bold text-primary mb-8 text-center">
        Your Wishlist
      </h1>

      {wishlistItems.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white p-8 rounded-lg shadow-md text-center flex flex-col items-center justify-center min-h-[300px]"
        >
          <Heart size={64} className="text-gray-400 mb-4" />
          <p className="text-xl text-gray-600 font-semibold mb-4">
            Your wishlist is empty!
          </p>
          <p className="text-gray-500 mb-6">
            Start adding products you love to your wishlist to keep track of
            them.
          </p>
          <Link href="/shop" passHref>
            <motion.button
              className="btn-bubble btn-bubble-primary inline-flex items-center gap-2"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <span>Explore Products</span>
            </motion.button>
          </Link>
        </motion.div>
      ) : (
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold text-primary mb-6 border-b pb-4">
            Wishlist Items ({wishlistItems.length})
          </h2>
          <AnimatePresence>
            {wishlistItems.map((item) => (
              <motion.div
                key={item.productId}
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
                    <h3 className="text-lg font-medium text-secondary line-clamp-2">
                      {item.name}
                    </h3>
                    <div className="flex items-baseline space-x-2 text-xl font-bold">
                      <span className="text-secondary">
                        ${item.price.toFixed(2)}
                      </span>
                      {item.oldPrice !== undefined &&
                        item.oldPrice > item.price && (
                          <span className="text-gray-400 line-through text-base">
                            ${item.oldPrice.toFixed(2)}
                          </span>
                        )}
                    </div>
                    {/* Display New/Sale badges */}
                    <div className="flex gap-2 mt-1">
                      {item.isOnSale && (
                        <span className="bg-red-500 text-white text-xs font-semibold px-2 py-1 rounded-full">
                          Sale!
                        </span>
                      )}
                      {item.isNewlyReleased && (
                        <span className="bg-primary text-white text-xs font-semibold px-2 py-1 rounded-full">
                          New
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-4 mt-4 sm:mt-0">
                  {/* Move to Cart Button */}
                  <motion.button
                    className="btn-bubble btn-bubble-primary disabled:opacity-50 disabled:cursor-not-allowed"
                    onClick={() => handleMoveToCart(item)}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    disabled={
                      movingToCartItemId === item.productId ||
                      (item.stock !== undefined && item.stock <= 0)
                    }
                  >
                    <span>
                      {movingToCartItemId === item.productId ? (
                        <svg
                          className="animate-spin h-5 w-5 text-white inline-block mr-2"
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
                        <ShoppingCart size={18} />
                      )}
                      {item.stock !== undefined && item.stock <= 0
                        ? "Out of Stock"
                        : "Move to Cart"}
                    </span>
                  </motion.button>

                  {/* Remove Button */}
                  <motion.button
                    className="text-gray-400 hover:text-red-500 transition-colors p-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    onClick={() => handleRemoveItem(item.productId)}
                    whileTap={{ scale: 0.9 }}
                    aria-label="Remove item from wishlist"
                    disabled={removingItemId === item.productId}
                  >
                    {removingItemId === item.productId ? (
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
      )}
    </motion.div>
  );
};

export default WishlistPage;