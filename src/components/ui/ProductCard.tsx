/* eslint-disable @typescript-eslint/no-explicit-any */
// src/components/layout/ProductCard.tsx
"use client";

import React, { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "motion/react"; // Import AnimatePresence
import { IProduct, ICart, IWishlistItemFrontend } from "@/types"; // Import necessary types
import { Heart, ShoppingCart, Star, RotateCw } from "lucide-react"; // Import RotateCw for spinner
import { useSession } from "next-auth/react";
import axios from "axios"; // Import axios for API calls

interface ProductCardProps {
  product: IProduct;
}

const cardVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
};

const buttonChildVariants = {
  initial: { y: "100%", opacity: 0 },
  hovered: { y: "0", opacity: 1 },
};

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const router = useRouter();
  const { data: session, status } = useSession(); // Get user session

  const [addingToCart, setAddingToCart] = useState(false);
  const [cartMessage, setCartMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const [isProductInCart, setIsProductInCart] = useState(false); // NEW: State to track if product is in cart
  const [isProductInWishlist, setIsProductInWishlist] = useState(false); // NEW: State to track if product is in wishlist
  const [addingToWishlist, setAddingToWishlist] = useState(false); // NEW: State for wishlist loading
  const [wishlistMessage, setWishlistMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null); // NEW: State for wishlist messages

  // Use the first image from the 'images' array, or fallback
  const imageUrl = product.images?.[0] || "/images/placeholder-product.jpg";

  // Function to show transient messages
  const showMessage = useCallback(
    (
      type: "success" | "error",
      text: string,
      setter: React.Dispatch<
        React.SetStateAction<{ type: "success" | "error"; text: string } | null>
      >
    ) => {
      setter({ type, text });
      setTimeout(() => setter(null), 3000); // Clear message after 3 seconds
    },
    []
  );

  const showCartMessage = useCallback(
    (type: "success" | "error", text: string) => {
      showMessage(type, text, setCartMessage);
    },
    [showMessage]
  );

  const showWishlistMessage = useCallback(
    (type: "success" | "error", text: string) => {
      showMessage(type, text, setWishlistMessage);
    },
    [showMessage]
  );

  // NEW: Fetch cart status for the current product
  const fetchCartStatus = useCallback(async () => {
    if (status !== "authenticated" || !product._id) {
      setIsProductInCart(false);
      return;
    }
    try {
      const response = await axios.get<ICart>("/api/cart");
      if (response.data && response.data.items) {
        const found = response.data.items.some(
          (item) => item.productId.toString() === product._id?.toString()
        );
        setIsProductInCart(found);
      } else {
        setIsProductInCart(false);
      }
    } catch (error) {
      console.error("Failed to fetch cart status:", error);
      setIsProductInCart(false);
    }
  }, [status, product._id]);

  // NEW: Fetch wishlist status for the current product
  const fetchWishlistStatus = useCallback(async () => {
    if (status !== "authenticated" || !product._id) {
      setIsProductInWishlist(false);
      return;
    }
    try {
      const response = await axios.get<{ success: boolean, data: { items: IWishlistItemFrontend[] } }>("/api/wishlist");
      if (response.data.success && response.data.data && response.data.data.items) {
        const found = response.data.data.items.some(
          (item) => item.productId === product._id?.toString()
        );
        setIsProductInWishlist(found);
      } else {
        setIsProductInWishlist(false);
      }
    } catch (error) {
      console.error("Failed to fetch wishlist status:", error);
      setIsProductInWishlist(false);
    }
  }, [status, product._id]);


  useEffect(() => {
    fetchCartStatus();
    fetchWishlistStatus();
  }, [fetchCartStatus, fetchWishlistStatus]);

  // Handles navigation to product details page
  const handleCardClick = () => {
    // Ensure _id exists and is a string for the URL
    if (product._id) {
      router.push(`/shop/details/${product._id.toString()}`); // Changed to /product/[id]
    } else {
      console.error("Product ID is missing for navigation.");
    }
  };

  // Handles adding product to cart or navigating to cart
  const handleAddToCart = async (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent card navigation when button is clicked

    if (status === "loading") {
      showCartMessage("error", "Authentication status loading...");
      return;
    }

    if (!session) {
      showCartMessage("error", "Please log in to add items to your cart.");
      // Optionally, redirect to login page or open a login modal
      // signIn();
      return;
    }

    if (isProductInCart) {
      router.push("/cart");
      return;
    }

    if (product.stock !== undefined && product.stock <= 0) {
      showCartMessage("error", "This product is out of stock.");
      return;
    }

    setAddingToCart(true);
    showCartMessage("success", "Adding to cart..."); // Show message immediately

    try {
      const response = await axios.post("/api/cart", {
        productId: product._id?.toString(), // Ensure _id is a string
        quantity: 1, // Default quantity when adding from product card
      });

      if (response.data.success) {
        showCartMessage("success", "Product added to cart!");
        setIsProductInCart(true); // Update state
        // You might want to trigger a global cart update here later
      } else {
        showCartMessage(
          "error",
          response.data.message || "Failed to add product to cart."
        );
      }
    } catch (err: any) {
      console.error("Error adding to cart:", err);
      showCartMessage(
        "error",
        err.response?.data?.message || err.message || "Network error. Could not add to cart."
      );
    } finally {
      setAddingToCart(false);
    }
  };

  // NEW: Handles adding/removing product from wishlist
  const handleWishlistClick = async (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent card navigation

    if (status === "loading") {
      showWishlistMessage("error", "Authentication status loading...");
      return;
    }

    if (!session) {
      showWishlistMessage("error", "Please log in to manage your wishlist.");
      return;
    }

    setAddingToWishlist(true);
    showWishlistMessage("success", isProductInWishlist ? "Removing from wishlist..." : "Adding to wishlist...");

    try {
      let response;
      if (isProductInWishlist) {
        // Remove from wishlist
        response = await axios.delete(`/api/wishlist/${product._id?.toString()}`);
      } else {
        // Add to wishlist
        response = await axios.post("/api/wishlist", { productId: product._id?.toString() });
      }

      if (response.data.success) {
        showWishlistMessage("success", response.data.message);
        setIsProductInWishlist(!isProductInWishlist); // Toggle state
      } else {
        showWishlistMessage("error", response.data.message || "Failed to update wishlist.");
      }
    } catch (err: any) {
      console.error("Error updating wishlist:", err);
      showWishlistMessage("error", err.response?.data?.message || err.message || "Network error. Could not update wishlist.");
    } finally {
      setAddingToWishlist(false);
    }
  };

  return (
    <motion.div
      onClick={handleCardClick}
      className="relative bg-white rounded-lg shadow-[0px_0px_0px_1px_rgba(0,0,0,0.06),0px_1px_1px_-0.5px_rgba(0,0,0,0.06),0px_3px_3px_-1.5px_rgba(0,0,0,0.06),_0px_6px_6px_-3px_rgba(0,0,0,0.06),0px_12px_12px_-6px_rgba(0,0,0,0.06),0px_24px_24px_-12px_rgba(0,0,0,0.06)] overflow-hidden group cursor-pointer transition-transform duration-300 w-[18vw]"
      variants={cardVariants}
      initial="initial"
      animate="animate"
      whileHover="hovered"
      transition={{ duration: 0.3 }}
    >
      {/* Sale/New Badges */}
      {(product.isNewlyReleased || product.isOnSale) && (
        <div className="absolute top-2 left-2 flex gap-2 z-10">
          {product.isOnSale && (
            <span className="bg-red-500 text-white text-xs font-semibold px-2 py-1 rounded-full">
              Sale!
            </span>
          )}
          {product.isNewlyReleased && (
            <span className="bg-primary text-white text-xs font-semibold px-2 py-1 rounded-full">
              New
            </span>
          )}
        </div>
      )}

      {/* Product Image */}
      <div className="relative w-full h-56 overflow-hidden bg-gray-100 flex items-center justify-center">
        <Image
          unoptimized
          src={imageUrl}
          alt={product.name}
          layout="fill"
          objectFit="contain"
          className="transition-transform duration-300 group-hover:brightness-75"
        />

        {/* Wishlist and Quick View - ONLY show if authenticated */}
        {status === 'authenticated' && (
          <div
            className="absolute top-2 right-2 flex flex-col space-y-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            onClick={(e) => e.stopPropagation()} // prevent card navigation
          >
            <button
              onClick={handleWishlistClick} // Attach new handler
              className={`bg-white p-2 rounded-full shadow-md transition-colors ${
                isProductInWishlist ? 'text-secondary hover:text-red-500' : 'text-primary hover:text-secondary'
              }`}
              aria-label={isProductInWishlist ? "Remove from Wishlist" : "Add to Wishlist"}
              disabled={addingToWishlist} // Disable during loading
            >
              {addingToWishlist ? (
                <RotateCw size={20} className="animate-spin" />
              ) : (
                <Heart size={20} fill={isProductInWishlist ? 'currentColor' : 'none'} />
              )}
            </button>
          </div>
        )}

        {/* Add to Cart Button - ONLY show if authenticated */}
        {status === 'authenticated' && (
          <motion.button
            className="btn-bubble btn-bubble-primary !rounded-lg !absolute bottom-2 px-4 py-2 disabled:opacity-50 disabled:cursor-not-allowed"
            variants={buttonChildVariants}
            transition={{ duration: 0.1, ease: "easeInOut" }}
            aria-label={isProductInCart ? "Go to Cart" : "Add product to cart"}
            onClick={handleAddToCart}
            disabled={
              addingToCart || (product.stock !== undefined && product.stock <= 0)
            }
          >
            <span className="flex items-center justify-center gap-2">
              {addingToCart ? (
                <>
                  <RotateCw className="animate-spin h-5 w-5 text-white" />
                  Adding...
                </>
              ) : isProductInCart ? (
                <>
                  <ShoppingCart size={20} />
                  Go to Cart
                </>
              ) : (
                <>
                  <ShoppingCart size={20} />
                  {product.stock !== undefined && product.stock <= 0
                    ? "Out of Stock"
                    : "Add to Cart"}
                </>
              )}
            </span>
          </motion.button>
        )}

        {/* Cart Message Display */}
        <AnimatePresence>
          {cartMessage && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className={`absolute bottom-20 left-1/2 -translate-x-1/2 p-2 rounded-md text-white text-xs font-semibold z-20 whitespace-nowrap shadow-lg ${
                cartMessage.type === "success" ? "bg-green-500" : "bg-red-500"
              }`}
            >
              {cartMessage.text}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Wishlist Message Display */}
        <AnimatePresence>
          {wishlistMessage && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 p-2 rounded-md text-white text-xs font-semibold z-20 whitespace-nowrap shadow-lg ${
                wishlistMessage.type === "success" ? "bg-green-500" : "bg-red-500"
              }`}
            >
              {wishlistMessage.text}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Product Info */}
      <div className="p-4 flex flex-col text-start">
        {/* Ratings */}
        <div className="flex text-yellow-400 mb-2">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              size={16}
              fill={
                i < Math.round(product.reviewsCount || 0) // Use averageRating
                  ? "currentColor"
                  : "none"
              }
              strokeWidth={i < Math.round(product.reviewsCount || 0) ? 0 : 2}
              className="text-yellow-400"
            />
          ))}
          <span className="text-gray-500 text-xs ml-2">
            ({product.reviewsCount || 0} Reviews) {/* Display actual numReviews */}
          </span>
        </div>

        <h3 className="text-gray-800 font-medium text-lg mb-1 line-clamp-2">
          {product.name}
        </h3>

        <div className="flex items-baseline space-x-2 text-xl font-bold">
          <span className="text-primary">${product.price.toFixed(2)}</span>{" "}
          {product.oldPrice !== undefined &&
            product.oldPrice > product.price && (
              <span className="text-gray-400 line-through text-base">
                ${product.oldPrice.toFixed(2)}{" "}
              </span>
            )}
        </div>
      </div>
    </motion.div>
  );
};

export default ProductCard;
