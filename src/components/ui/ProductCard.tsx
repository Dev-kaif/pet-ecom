/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { IProduct } from "@/types"; 
import { Heart, ShoppingCart, Star } from "lucide-react";
import { useSession } from "next-auth/react";

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

  // Use the first image from the 'images' array, or fallback
  const imageUrl = product.images?.[0] || "/images/placeholder-product.jpg";

  // Handles navigation to product details page
  const handleCardClick = () => {
    // Ensure _id exists and is a string for the URL
    if (product._id) {
      router.push(`/shop/details/${product._id.toString()}`);
    } else {
      console.error("Product ID is missing for navigation.");
    }
  };

  // Function to show transient messages
  const showCartMessage = (type: "success" | "error", text: string) => {
    setCartMessage({ type, text });
    setTimeout(() => setCartMessage(null), 3000); // Clear message after 3 seconds
  };

  // Handles adding product to cart
  const handleAddToCart = async (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent card navigation when button is clicked

    if (status === "loading") {
      showCartMessage("error", "Authentication status loading...");
      return;
    }

    if (!session) {
      // If not logged in, prompt to sign in
      showCartMessage("error", "Please log in to add items to your cart.");
      // Optionally, redirect to login page or open a login modal
      // signIn(); // You could call signIn directly here
      return;
    }

    if (product.stock !== undefined && product.stock <= 0) {
      showCartMessage("error", "This product is out of stock.");
      return;
    }

    setAddingToCart(true);
    setCartMessage(null); // Clear previous messages

    try {
      const response = await fetch("/api/cart", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          productId: product._id?.toString(), // Ensure _id is a string
          quantity: 1, // Default quantity when adding from product card
        }),
      });

      const data = await response.json();

      if (data.success) {
        showCartMessage("success", "Product added to cart!");
        // You might want to update a global cart state here later
      } else {
        showCartMessage(
          "error",
          data.message || "Failed to add product to cart."
        );
      }
    } catch (err: any) {
      console.error("Error adding to cart:", err);
      showCartMessage("error", "Network error. Could not add to cart.");
    } finally {
      setAddingToCart(false);
    }
  };

  return (
    <motion.div
      onClick={handleCardClick}
      className="relative bg-white rounded-lg shadow-[0px_0px_0px_1px_rgba(0,0,0,0.06),0px_1px_1px_-0.5px_rgba(0,0,0,0.06),0px_3px_3px_-1.5px_rgba(0,0,0,0.06),_0px_6px_6px_-3px_rgba(0,0,0,0.06),0px_12px_12px_-6px_rgba(0,0,0,0.06),0px_24px_24px_-12px_rgba(0,0,0,0.06)] overflow-hidden group cursor-pointer transition-transform duration-300 w-full max-w-md"
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

        {/* Wishlist and Quick View */}
        <div
          className="absolute top-2 right-2 flex flex-col space-y-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          onClick={(e) => e.stopPropagation()} // prevent card navigation
        >
          <button
            className="bg-white p-2 rounded-full shadow-md text-primary hover:text-secondary transition-colors"
            aria-label="Add to Wishlist"
          >
            <Heart size={20} />
          </button>
        </div>

        {/* Add to Cart Button */}
        <motion.button
          className="btn-bubble btn-bubble-primary !rounded-lg !absolute bottom-2 px-4 py-2 disabled:opacity-50 disabled:cursor-not-allowed"
          variants={buttonChildVariants}
          transition={{ duration: 0.1, ease: "easeInOut" }}
          aria-label="Add product to cart"
          onClick={handleAddToCart} // Attach the new handler
          disabled={
            addingToCart || (product.stock !== undefined && product.stock <= 0)
          } // Disable if adding or out of stock
        >
          <span className="flex items-center justify-center gap-2">
            {addingToCart ? (
              <>
                <svg
                  className="animate-spin h-5 w-5 text-white"
                  xmlns="[http://www.w3.org/2000/svg](http://www.w3.org/2000/svg)"
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
                Adding...
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

        {/* Cart Message Display */}
        {cartMessage && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className={`absolute -top-10 left-1/2 -translate-x-1/2 p-2 rounded-md text-white text-xs font-semibold z-20 whitespace-nowrap shadow-lg ${
              cartMessage.type === "success" ? "bg-green-500" : "bg-red-500"
            }`}
          >
            {cartMessage.text}
          </motion.div>
        )}
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
                i < Math.round(product.reviewsCount || 0)
                  ? "currentColor"
                  : "none" // Use Math.round for avg rating
              }
              strokeWidth={i < Math.round(product.reviewsCount || 0) ? 0 : 2}
              className="text-yellow-400"
            />
          ))}
          <span className="text-gray-500 text-xs ml-2">
            ({product.reviewsCount || 0} Reviews) {/* Display actual count */}
          </span>
        </div>

        <h3 className="text-gray-800 font-medium text-lg mb-1 line-clamp-2">
          {product.name}
        </h3>

        <div className="flex items-baseline space-x-2 text-xl font-bold">
          <span className="text-primary">${product.price.toFixed(2)}</span>{" "}
          {/* Ensure price is fixed to 2 decimal places */}
          {product.oldPrice !== undefined &&
            product.oldPrice > product.price && ( // Check for oldPrice and if it's greater
              <span className="text-gray-400 line-through text-base">
                ${product.oldPrice.toFixed(2)}{" "}
                {/* Ensure oldPrice is fixed to 2 decimal places */}
              </span>
            )}
        </div>
      </div>
    </motion.div>
  );
};

export default ProductCard;
