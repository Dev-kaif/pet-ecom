/* eslint-disable @typescript-eslint/no-explicit-any */
// src/app/product/[id]/page.tsx
"use client";

import React, { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import Link from "next/link"; // Import Link for navigation
import { motion, AnimatePresence } from "framer-motion";
import { Star, Heart, ShoppingCart, Minus, Plus, X } from "lucide-react";
import { useParams } from "next/navigation";
import { useSession } from "next-auth/react";
import axios from "axios"; // Import Axios
import { IProduct, IReview, ICart, IWishlistItemFrontend } from "@/types"; // Import IProduct and ICart types

// ... (Variants for animations - keep them as is)
const pageVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5, ease: "easeOut" },
};
const imageVariants = {
  initial: { opacity: 0, x: -50 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: 50 },
  transition: { duration: 0.3, ease: "easeOut" },
};
const tabContentVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
  transition: { duration: 0.2, ease: "easeOut" },
};
const sliderVariants = {
  open: { opacity: 1 },
  closed: { opacity: 0 },
};
const slideVariants = {
  initial: (direction: number) => ({ x: direction * 100, opacity: 0 }),
  animate: {
    x: 0,
    opacity: 1,
    transition: { duration: 0.5, ease: "easeInOut" },
  },
  exit: (direction: number) => ({
    x: -direction * 100,
    opacity: 0,
    transition: { duration: 0.5, ease: "easeInOut" },
  }),
};

const ProductDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { data: session, status } = useSession();

  const [product, setProduct] = useState<IProduct | null>(null);
  const [reviews, setReviews] = useState<IReview[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [activeTab, setActiveTab] = useState("description");
  const [quantity, setQuantity] = useState(1);
  const [mainImage, setMainImage] = useState<string>(
    "/images/placeholder-product.jpg"
  );
  const [thumbnailUrls, setThumbnailUrls] = useState<string[]>([]);
  const [isSliderOpen, setIsSliderOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const [newReviewRating, setNewReviewRating] = useState<number>(0);
  const [newReviewComment, setNewReviewComment] = useState<string>("");
  const [submittingReview, setSubmittingReview] = useState<boolean>(false);
  const [reviewMessage, setReviewMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const [addingToCart, setAddingToCart] = useState(false);
  const [cartMessage, setCartMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const [isProductInCart, setIsProductInCart] = useState(false);
  const [currentCart, setCurrentCart] = useState<ICart | null>(null);

  // NEW: Wishlist States
  const [isProductInWishlist, setIsProductInWishlist] = useState(false);
  const [addingToWishlist, setAddingToWishlist] = useState(false); // Used for both add/remove loading
  const [wishlistMessage, setWishlistMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  // Function to show transient messages (for cart, review, and wishlist)
  const showMessage = useCallback(
    (
      type: "success" | "error",
      text: string,
      setter: React.Dispatch<
        React.SetStateAction<{ type: "success" | "error"; text: string } | null>
      >
    ) => {
      setter({ type, text });
      setTimeout(() => setter(null), 3000);
    },
    []
  );

  const showCartMessage = useCallback(
    (type: "success" | "error", text: string) => {
      showMessage(type, text, setCartMessage);
    },
    [showMessage]
  );

  const showReviewMessage = useCallback(
    (type: "success" | "error", text: string) => {
      showMessage(type, text, setReviewMessage);
    },
    [showMessage]
  );

  // NEW: Wishlist message helper
  const showWishlistMessage = useCallback(
    (type: "success" | "error", text: string) => {
      showMessage(type, text, setWishlistMessage);
    },
    [showMessage]
  );

  const handleAddToCart = async () => {
    if (status === "loading") {
      showCartMessage("error", "Authentication status loading...");
      return;
    }

    if (!product || !product._id) {
      showCartMessage("error", "Product data not loaded.");
      return;
    }

    if (!session) {
      showCartMessage("error", "Please log in to add items to your cart.");
      return;
    }

    const existingItemInCart = currentCart?.items?.find(
      (item) => item.productId.toString() === product._id?.toString()
    );
    const currentQuantityInCart = existingItemInCart
      ? existingItemInCart.quantity
      : 0;
    const quantityToAdd = quantity;
    const newTotalQuantity = currentQuantityInCart + quantityToAdd;

    if (product.stock !== undefined && newTotalQuantity > product.stock) {
      showCartMessage(
        "error",
        `Not enough stock. You have ${currentQuantityInCart} in cart. Max available: ${product.stock}`
      );
      return;
    }
    if (product.stock !== undefined && product.stock <= 0) {
      showCartMessage("error", "This product is out of stock.");
      return;
    }

    setAddingToCart(true);
    showCartMessage("success", "Adding to cart...");

    try {
      const response = await axios.post("/api/cart", {
        productId: product._id.toString(),
        quantity: quantityToAdd,
      });

      if (response.data.success) {
        showCartMessage("success", "Product added/updated in cart!");
        fetchCartData();
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
        err.response?.data?.message ||
          err.message ||
          "Network error. Could not add to cart."
      );
    } finally {
      setAddingToCart(false);
    }
  };

  // NEW: handleAddToWishlist function
  const handleAddToWishlist = async () => {
    if (status === "loading") {
      showWishlistMessage("error", "Authentication status loading...");
      return;
    }

    if (!product || !product._id) {
      showWishlistMessage("error", "Product data not loaded.");
      return;
    }

    if (!session) {
      showWishlistMessage(
        "error",
        "Please log in to add items to your wishlist."
      );
      return;
    }

    setAddingToWishlist(true);
    showWishlistMessage("success", "Adding to wishlist...");

    try {
      const response = await axios.post("/api/wishlist", {
        productId: product._id.toString(),
      });

      if (response.data.success) {
        showWishlistMessage("success", "Product added to wishlist!");
        setIsProductInWishlist(true);
      } else {
        showWishlistMessage(
          "error",
          response.data.message || "Failed to add product to wishlist."
        );
      }
    } catch (err: any) {
      console.error("Error adding to wishlist:", err);
      showWishlistMessage(
        "error",
        err.response?.data?.message ||
          err.message ||
          "Network error. Could not add to wishlist."
      );
    } finally {
      setAddingToWishlist(false);
    }
  };

  // NEW: handleRemoveFromWishlist function
  const handleRemoveFromWishlist = async () => {
    if (status === "loading") {
      showWishlistMessage("error", "Authentication status loading...");
      return;
    }

    if (!product || !product._id) {
      showWishlistMessage("error", "Product data not loaded.");
      return;
    }

    if (!session) {
      showWishlistMessage(
        "error",
        "Please log in to remove items from your wishlist."
      );
      return;
    }

    setAddingToWishlist(true); // Using same loading state for add/remove
    showWishlistMessage("success", "Removing from wishlist...");

    try {
      // The DELETE endpoint for wishlist expects the productId in the URL
      const response = await axios.delete(
        `/api/wishlist/${product._id.toString()}`
      );

      if (response.data.success) {
        showWishlistMessage("success", "Product removed from wishlist!");
        setIsProductInWishlist(false); // Update state directly
      } else {
        showWishlistMessage(
          "error",
          response.data.message || "Failed to remove product from wishlist."
        );
      }
    } catch (err: any) {
      console.error("Error removing from wishlist:", err);
      showWishlistMessage(
        "error",
        err.response?.data?.message ||
          err.message ||
          "Network error. Could not remove from wishlist."
      );
    } finally {
      setAddingToWishlist(false);
    }
  };

  // --- Data Fetching ---

  const fetchProductDetails = useCallback(async () => {
    if (!id) return;

    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(`/api/products/${id}`);
      const data = response.data;

      if (data.success) {
        setProduct(data.data);
        setMainImage(
          data.data.images?.[0] || "/images/placeholder-product.jpg"
        );
        setThumbnailUrls(data.data.images || []);
      } else {
        setError(data.message || "Failed to fetch product details.");
        setProduct(null);
        setMainImage("/images/placeholder-product.jpg");
        setThumbnailUrls([]);
      }
    } catch (err: any) {
      console.error("Error fetching product details:", err);
      setError(
        err.response?.data?.message ||
          err.message ||
          "Network error: Could not load product details."
      );
      setProduct(null);
      setMainImage("/images/placeholder-product.jpg");
      setThumbnailUrls([]);
    } finally {
      setLoading(false);
    }
  }, [id]);

  const fetchProductReviews = useCallback(async () => {
    if (!id) return;

    try {
      const response = await axios.get(`/api/products/${id}/reviews`);
      const data = response.data;

      if (data.success) {
        setReviews(data.data);
      } else {
        console.error("Failed to fetch reviews:", data.message);
        setReviews([]);
      }
    } catch (err: any) {
      console.error("Error fetching reviews:", err);
      setReviews([]);
    }
  }, [id]);

  const fetchCartData = useCallback(async () => {
    if (status !== "authenticated" || !session?.user || !product?._id) {
      setIsProductInCart(false);
      setCurrentCart(null);
      return;
    }

    try {
      const response = await axios.get(`/api/cart`);
      const data = response.data;
      if (data.success && data.data) {
        setCurrentCart(data.data);
        // CORRECTED: Use .some() to check if ANY item's productId matches product._id
        const found = data.data.items.some(
          (item: any) => item.productId?.toString() === product._id?.toString()
        );
        setIsProductInCart(found);
      } else {
        setCurrentCart(null);
        setIsProductInCart(false);
      }
    } catch (err) {
      console.error("Error fetching cart data:", err);
      setCurrentCart(null);
      setIsProductInCart(false);
    }
  }, [status, session?.user, product?._id]);

  // NEW: fetchWishlistData function
  const fetchWishlistData = useCallback(async () => {
    if (status !== "authenticated" || !session?.user || !product?._id) {
      setIsProductInWishlist(false);
      return;
    }

    try {
      const response = await axios.get("/api/wishlist");
      const data = response.data;
      if (data.success && data.data && data.data.items) {
        // CORRECTED: Use .some() to check if ANY item's productId matches product._id
        const found = data.data.items.some(
          (item: IWishlistItemFrontend) =>
            item.productId?.toString() === product._id?.toString()
        );
        setIsProductInWishlist(found);
      } else {
        setIsProductInWishlist(false);
      }
    } catch (err) {
      console.error("Error fetching wishlist data:", err);
      setIsProductInWishlist(false);
    }
  }, [status, session?.user, product?._id]);

  useEffect(() => {
    fetchProductDetails();
    fetchProductReviews();
  }, [fetchProductDetails, fetchProductReviews]);

  // Effect to fetch cart AND wishlist data when product and session are ready
  useEffect(() => {
    // Only fetch if product and session status are known
    if (product?._id && status !== "loading") {
      fetchCartData();
      fetchWishlistData();
    }
  }, [fetchCartData, fetchWishlistData, product?._id, status]); // Add product._id and status to dependencies

  // --- Review Submission ---

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!session?.user) {
      showReviewMessage("error", "You must be logged in to submit a review.");
      return;
    }
    if (newReviewRating === 0) {
      showReviewMessage("error", "Please provide a star rating.");
      return;
    }

    setSubmittingReview(true);
    showReviewMessage("success", "Submitting review...");

    try {
      const response = await axios.post(`/api/products/${id}/reviews`, {
        rating: newReviewRating,
        comment: newReviewComment,
      });
      const data = response.data;

      if (data.success) {
        showReviewMessage("success", "Review submitted successfully!");
        setNewReviewRating(0);
        setNewReviewComment("");
        fetchProductReviews();
      } else {
        showReviewMessage("error", data.message || "Failed to submit review.");
      }
    } catch (err: any) {
      console.error("Error submitting review:", err);
      showReviewMessage(
        "error",
        err.response?.data?.message ||
          err.message ||
          "Network error submitting review."
      );
    } finally {
      setSubmittingReview(false);
    }
  };

  // --- UI Handlers ---

  const handleQuantityChange = (type: "increment" | "decrement") => {
    if (!product) return;

    if (type === "increment") {
      if (product.stock !== undefined && quantity >= product.stock) {
        showCartMessage(
          "error",
          `Max available stock reached: ${product.stock}`
        );
        return;
      }
      setQuantity((prev) => prev + 1);
    } else if (type === "decrement" && quantity > 1) {
      setQuantity((prev) => prev - 1);
    }
  };

  const handleImageClick = (index: number, imageUrl: string) => {
    if (thumbnailUrls.length > 0) {
      setCurrentImageIndex(index);
      setMainImage(imageUrl);
      setIsSliderOpen(true);
    }
  };

  const closeSlider = () => {
    setIsSliderOpen(false);
  };

  const goToPrevious = () => {
    if (thumbnailUrls.length > 0) {
      setCurrentImageIndex((prevIndex) =>
        prevIndex > 0 ? prevIndex - 1 : thumbnailUrls.length - 1
      );
    }
  };

  const goToNext = () => {
    if (thumbnailUrls.length > 0) {
      setCurrentImageIndex((prevIndex) =>
        prevIndex < thumbnailUrls.length - 1 ? prevIndex + 1 : 0
      );
    }
  };

  const averageRating =
    reviews.length > 0
      ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length
      : 0;

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 text-center text-lg text-gray-700">
        Loading product details...
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8 text-center text-lg text-red-600">
        Error: {error}
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-8 text-center text-lg text-gray-700">
        Product not found.
      </div>
    );
  }

  const isAddToCartDisabled =
    addingToCart || (product.stock !== undefined && product.stock <= 0);

  return (
    <motion.div
      className="container mx-auto px-4 py-8 font-sans"
      initial="initial"
      animate="animate"
      variants={pageVariants}
    >
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Left Column - Product Image & Thumbnails */}
        <div className="lg:w-1/2 flex flex-col items-center">
          <div
            className="w-full max-w-lg bg-gray-100 rounded-lg overflow-hidden mb-4 relative cursor-pointer"
            onClick={() =>
              thumbnailUrls.length > 0 &&
              handleImageClick(thumbnailUrls.indexOf(mainImage), mainImage)
            }
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={mainImage}
                variants={imageVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                className="w-full h-full"
              >
                <Image
                  unoptimized
                  src={mainImage}
                  alt={product.name}
                  width={600}
                  height={600}
                  layout="responsive"
                  objectFit="contain"
                />
              </motion.div>
            </AnimatePresence>
          </div>
          <div className="flex gap-2 justify-center flex-wrap">
            {thumbnailUrls.length > 0 &&
              thumbnailUrls.map((thumb, index) => (
                <motion.div
                  key={index}
                  className={`w-20 h-20 bg-gray-100 rounded-lg overflow-hidden cursor-pointer border-2 ${
                    mainImage === thumb
                      ? "border-primary" // Use primary color for active thumbnail border
                      : "border-transparent"
                  }`}
                  onClick={() => handleImageClick(index, thumb)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Image
                    unoptimized
                    src={thumb}
                    alt={`Thumbnail ${index + 1}`}
                    width={80}
                    height={80}
                    objectFit="contain"
                  />
                </motion.div>
              ))}
          </div>
        </div>

        {/* Right Column - Product Details */}
        <div className="lg:w-1/2 text-start">
          <span className="text-gray-500 text-sm font-medium mb-2 block uppercase">
            {product.category || "Uncategorized"}
          </span>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            {product.name}
          </h1>

          {/* Star Ratings */}
          <div className="flex items-center text-yellow-400 mb-4">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                size={18}
                fill={i < Math.round(averageRating) ? "currentColor" : "none"}
                strokeWidth={i < Math.round(averageRating) ? 0 : 2}
                className="text-yellow-400"
              />
            ))}
            <span className="text-gray-500 text-sm ml-2">
              ({reviews.length} Reviews)
            </span>
          </div>

          <p className="text-secondary text-4xl font-bold mb-4">
            {" "}
            {/* Price color set to secondary */}${product.price.toFixed(2)}
            {product.oldPrice !== undefined &&
              product.oldPrice > product.price && (
                <span className="text-gray-500 text-xl line-through ml-3">
                  ${product.oldPrice.toFixed(2)}
                </span>
              )}
          </p>

          <p className="text-gray-600 mb-6 leading-relaxed">
            {product.description || "No description available."}
          </p>

          {/* Quantity & Add to Cart / Go to Cart */}
          <div className="flex items-center gap-4 mb-6 relative">
            <div className="flex items-center border border-gray-300 rounded-lg">
              <motion.button
                className="p-2 text-gray-600 hover:text-primary" // Hover text color set to primary
                onClick={() => handleQuantityChange("decrement")}
                whileTap={{ scale: 0.9 }}
              >
                <Minus size={20} />
              </motion.button>
              <span className="px-4 text-lg font-medium">
                <motion.span
                  key={quantity}
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.15 }}
                >
                  {quantity}
                </motion.span>
              </span>
              <motion.button
                className="p-2 text-gray-600 hover:text-primary" // Hover text color set to primary
                onClick={() => handleQuantityChange("increment")}
                whileTap={{ scale: 0.9 }}
              >
                <Plus size={20} />
              </motion.button>
            </div>

            {isProductInCart ? (
              <Link href="/cart" passHref>
                <motion.button
                  className="bg-primary hover:bg-primary-dark text-white font-bold py-2 px-4 rounded-md shadow-md transition duration-300 flex-grow max-w-[200px] flex items-center justify-center gap-2"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <ShoppingCart size={20} />
                  Go to Cart
                </motion.button>
              </Link>
            ) : (
              <motion.button
                className="bg-secondary hover:bg-secondary-dark text-white font-bold py-2 px-4 rounded-md shadow-md transition duration-300 flex-grow max-w-[200px] flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleAddToCart}
                disabled={isAddToCartDisabled}
              >
                <span className="flex items-center justify-center gap-2">
                  {addingToCart ? (
                    <>
                      <svg
                        className="animate-spin h-5 w-5 text-white"
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
            )}

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

          {/* NEW: Wishlist Button with Logic */}
          <div className="flex items-center gap-6 text-gray-600 relative">
            <motion.button
              className="flex items-center gap-2 hover:text-primary transition-colors disabled:opacity-50 disabled:cursor-not-allowed" // Hover text color set to primary
              whileTap={{ scale: 0.95 }}
              onClick={
                isProductInWishlist
                  ? handleRemoveFromWishlist
                  : handleAddToWishlist
              } // Dynamic onClick
              disabled={addingToWishlist} // Disable during any wishlist operation
            >
              <Heart size={20} />{" "}
              {addingToWishlist ? (
                <>
                  <svg
                    className="animate-spin h-5 w-5 text-gray-600"
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
                  {isProductInWishlist ? "Removing..." : "Adding..."}{" "}
                  {/* Dynamic text */}
                </>
              ) : isProductInWishlist ? (
                "Remove from Wishlist"
              ) : (
                "Add To Wishlist"
              )}
            </motion.button>
            {wishlistMessage && (
              <AnimatePresence>
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className={`absolute -top-10 left-1/2 -translate-x-1/2 p-2 rounded-md text-white text-xs font-semibold z-20 whitespace-nowrap shadow-lg ${
                    wishlistMessage.type === "success"
                      ? "bg-green-500"
                      : "bg-red-500"
                  }`}
                >
                  {wishlistMessage.text}
                </motion.div>
              </AnimatePresence>
            )}
          </div>

          <div className="border-t border-gray-200 mt-8 pt-6">
            <p className="text-gray-600 mb-2 text-sm">
              <span className="font-semibold">Categories:</span>{" "}
              {product.category}
            </p>
          </div>

          {/* Share Icons (Placeholder) */}
          <div className="flex items-center gap-3 mt-4 text-gray-600">
            <span className="font-semibold text-sm">Share:</span>
            <a href="#" className="hover:text-primary">
              {" "}
              <i className="fab fa-facebook-f text-lg"></i>
            </a>
            <a href="#" className="hover:text-primary">
              {" "}
              <i className="fab fa-twitter text-lg"></i>
            </a>
            <a href="#" className="hover:text-primary">
              {" "}
              <i className="fab fa-pinterest-p text-lg"></i>
            </a>
            <a href="#" className="hover:text-primary">
              {" "}
              <i className="fab fa-instagram text-lg"></i>
            </a>
          </div>

          {/* Guaranteed Safe Checkout (Placeholder) */}
          <div className="bg-gray-50 p-4 rounded-lg mt-8 border border-gray-200">
            <h4 className="font-semibold text-gray-800 mb-3">
              Guaranteed Safe Checkout
            </h4>
            <div className="flex items-center gap-4">
              <span className="text-gray-500 text-sm">VISA</span>
              <span className="text-gray-500 text-sm">PayPal</span>
              <span className="text-gray-500 text-sm">stripe</span>
              <span className="text-gray-500 text-sm">Mastercard</span>
              <span className="text-gray-500 text-sm">American Express</span>
            </div>
          </div>
        </div>
      </div>

      {/* Description & Reviews Tabs */}
      <div className="mt-12">
        <div className="flex border-b border-gray-200 mb-6">
          <button
            className={`px-6 py-3 text-lg font-medium ${
              activeTab === "description"
                ? "border-b-2 border-primary text-primary" // Border and text color set to primary
                : "text-gray-600 hover:text-primary" // Hover text color set to primary
            }`}
            onClick={() => setActiveTab("description")}
          >
            Description
          </button>
          <button
            className={`px-6 py-3 text-lg font-medium ${
              activeTab === "reviews"
                ? "border-b-2 border-primary text-primary" // Border and text color set to primary
                : "text-gray-600 hover:text-primary" // Hover text color set to primary
            }`}
            onClick={() => setActiveTab("reviews")}
          >
            Reviews ({reviews.length})
          </button>
        </div>

        <AnimatePresence mode="wait" initial={false}>
          {activeTab === "description" && (
            <motion.div
              key="description-content"
              variants={tabContentVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              className="text-gray-700 leading-relaxed"
            >
              <p className="mb-4">
                {product.description || "No description available."}
              </p>
            </motion.div>
          )}
          {activeTab === "reviews" && (
            <motion.div
              key="reviews-content"
              variants={tabContentVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              className="text-gray-700"
            >
              <h3 className="text-xl font-semibold mb-4 text-gray-800">
                Customer Reviews
              </h3>
              {reviews.length === 0 ? (
                <p>No reviews yet. Be the first to review this product!</p>
              ) : (
                <div className="space-y-6">
                  {reviews.map((review) => (
                    <div
                      key={review._id?.toString()}
                      className="border-b pb-4 last:border-b-0 last:pb-0"
                    >
                      <div className="flex items-center mb-2">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            size={16}
                            fill={i < review.rating ? "currentColor" : "none"}
                            strokeWidth={i < review.rating ? 0 : 2}
                            className="text-yellow-400"
                          />
                        ))}
                        <span className="ml-3 text-sm text-gray-600 font-medium">
                          {review.userName}
                        </span>
                        <span className="ml-2 text-xs text-gray-400">
                          {review.createdAt
                            ? new Date(review.createdAt).toLocaleDateString()
                            : ""}
                        </span>
                      </div>
                      <p className="text-gray-700">{review.comment}</p>
                    </div>
                  ))}
                </div>
              )}

              {/* Review Submission Form */}
              <div className="mt-8 p-6 bg-gray-50 rounded-lg shadow-sm">
                <h4 className="text-xl font-semibold mb-4 text-gray-800">
                  Write a Review
                </h4>
                {session?.user ? (
                  <form onSubmit={handleReviewSubmit} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Your Rating:
                      </label>
                      <div className="flex space-x-1">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            size={24}
                            className={`cursor-pointer ${
                              i < newReviewRating
                                ? "text-yellow-400 fill-current"
                                : "text-gray-300"
                            }`}
                            onClick={() => setNewReviewRating(i + 1)}
                          />
                        ))}
                      </div>
                    </div>
                    <div>
                      <label
                        htmlFor="reviewComment"
                        className="block text-sm font-medium text-gray-700 mb-2"
                      >
                        Your Comment:
                      </label>
                      <textarea
                        id="reviewComment"
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm" // Focus ring/border set to primary
                        rows={4}
                        value={newReviewComment}
                        onChange={(e) => setNewReviewComment(e.target.value)}
                        placeholder="Share your thoughts about this product..."
                      ></textarea>
                    </div>
                    {reviewMessage && (
                      <div
                        className={`p-3 rounded-md text-white ${
                          reviewMessage.type === "success"
                            ? "bg-green-500"
                            : "bg-red-500"
                        }`}
                      >
                        {reviewMessage.text}
                      </div>
                    )}
                    <button
                      type="submit"
                      className="bg-primary hover:bg-primary-dark text-white font-bold py-2 px-4 rounded-md shadow-md transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed" // Button colors set to primary
                      disabled={submittingReview}
                    >
                      {submittingReview ? "Submitting..." : "Submit Review"}
                    </button>
                  </form>
                ) : (
                  <p className="text-gray-600">
                    Please{" "}
                    <Link
                      href="/api/auth/signin"
                      className="text-primary hover:underline" // Link color set to primary
                    >
                      log in
                    </Link>{" "}
                    to write a review.
                  </p>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Full-screen Image Slider */}
      <AnimatePresence>
        {isSliderOpen && (
          <motion.div
            className="fixed inset-0 w-full h-full bg-black/80 flex items-center justify-center p-4 z-50 cursor-grab"
            variants={sliderVariants}
            initial="closed"
            animate="open"
            exit="closed"
          >
            <motion.button
              onClick={closeSlider}
              className="absolute top-4 right-4 text-white z-50 bg-black/20 rounded-full p-2 hover:bg-black/50"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <X size={24} />
            </motion.button>
            <motion.div className="relative w-full h-full max-w-full max-h-screen flex items-center justify-center">
              <AnimatePresence initial={false} custom={0}>
                <motion.div
                  key={currentImageIndex}
                  custom={0}
                  variants={slideVariants}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  drag="x"
                  dragConstraints={{ left: 0, right: 0 }}
                  onDragEnd={(e, { offset }) => {
                    const swipeThreshold = 100;
                    if (offset.x > swipeThreshold) {
                      goToPrevious();
                    } else if (offset.x < -swipeThreshold) {
                      goToNext();
                    }
                  }}
                  className="absolute top-0 left-0 w-full h-full flex items-center justify-center"
                >
                  <Image
                    src={
                      thumbnailUrls?.[currentImageIndex] ||
                      "/images/placeholder-product.jpg"
                    }
                    unoptimized
                    alt={product.name}
                    layout="fill"
                    objectFit="contain"
                    className="cursor-grab"
                  />
                </motion.div>
              </AnimatePresence>
              {thumbnailUrls && thumbnailUrls.length > 1 && (
                <>
                  <motion.button
                    onClick={goToPrevious}
                    className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/20 text-white rounded-full p-2 hover:bg-black/50 z-50"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    {"<"}
                  </motion.button>
                  <motion.button
                    onClick={goToNext}
                    className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/20 text-white rounded-full p-2 hover:bg-black/50 z-50"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    {">"}
                  </motion.button>
                </>
              )}
              {/* Current image index indicator */}
              <div className="absolute bottom-4 flex gap-2 z-50">
                {thumbnailUrls.map((_, idx) => (
                  <span
                    key={idx}
                    className={`block w-2 h-2 rounded-full ${
                      currentImageIndex === idx ? "bg-white" : "bg-gray-400"
                    }`}
                  ></span>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default ProductDetailsPage;
