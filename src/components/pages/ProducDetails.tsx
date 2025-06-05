"use client";
import React, { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion"; // Import motion and AnimatePresence
import { Star, Heart, ShoppingCart, Repeat, Minus, Plus, X } from "lucide-react";

// Dummy Product Data (replace with actual data fetching in a real app)
const dummyProduct = {
  id: 1,
  name: "Meow Mix Seafood Medley Dry Cat Food, 3.15-Pound",
  sku: "CAT4502",
  price: "29.00",
  reviews: 2, // Number of filled stars
  description: `Cat Food nullam malesuada aenean congue semper donec velit ultricie search hendrerit enim, conubia sociis adipiscing sed tempor cutare elit nibh rutrum ipsum. Consectetur sollicitudin.
  Habitant Morbi Tristique Senectus Et Netus Et Malesuada Fames Ac Turpis Egestas. Vestibulum Tortor Quam, Feugiat Vitae, Ultricies Eget, Tempor Sit Amet Ante. Ibero Sit Amet Quam Egestas Semper. Aenean Ultricies Mi Vitae Est. Mauris Placerat Eleifend Leo. Ea Commodo Consolat. Duis Aute Irure Dolor In Reprehenderit Volup Tate Velitesse Cillum Dolore Euy Ele Auin Irure Dolor. Uis Aute Irure Dolore In Reprehenderit N Volup Tate Velitesse Cillum.`,
  // IMPORTANT: Replace with actual image paths. Use public directory paths.
  imageUrl: "/images/product-harness.png", // Example path from your /public folder
  thumbnailUrls: [
    "/images/product-harness.png",
    "/images/product-shampoo.png",
    "/images/product-dog-treats.png",
    "/images/product-carrier.png",
  ],
  category: "Cat, Food, Care",
  tags: ["Food", "Pet", "Essentials"],
  availableSizes: ["250mg", "500mg", "1kg"], // Example for size selection
};

// Variants for main content fade-in
const pageVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5, ease: "easeOut" },
};

// Variants for main image transition
const imageVariants = {
  initial: { opacity: 0, x: -50 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: 50 },
  transition: { duration: 0.3, ease: "easeOut" },
};

// Variants for tab content
const tabContentVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
  transition: { duration: 0.2, ease: "easeOut" },
};

// Variants for the full-screen slider overlay
const sliderVariants = {
  open: { opacity: 1 },
  closed: { opacity: 0 },
};

// Variants for image sliding within the full-screen slider
const slideVariants = {
  initial: (direction: number) => ({ x: direction * 100, opacity: 0 }),
  animate: { x: 0, opacity: 1, transition: { duration: 0.5, ease: "easeInOut" } },
  exit: (direction: number) => ({ x: -direction * 100, opacity: 0, transition: { duration: 0.5, ease: "easeInOut" } }),
};

const ProductDetailsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState("description");
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState(dummyProduct.availableSizes?.[0]);
  const [mainImage, setMainImage] = useState(dummyProduct.imageUrl);
  const [isSliderOpen, setIsSliderOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const handleQuantityChange = (type: "increment" | "decrement") => {
    if (type === "increment") {
      setQuantity((prev) => prev + 1);
    } else if (type === "decrement" && quantity > 1) {
      setQuantity((prev) => prev - 1);
    }
  };

  // Function to handle clicking on an image to open the slider
  const handleImageClick = (index: number, imageUrl: string) => {
    setCurrentImageIndex(index);
    setMainImage(imageUrl); // Ensure main image reflects the clicked thumbnail, useful if you open slider from main image
    setIsSliderOpen(true);
  };

  // Function to close the full-screen slider
  const closeSlider = () => {
    setIsSliderOpen(false);
  };

  // Functions to navigate images in the slider
  const goToPrevious = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex > 0 ? prevIndex - 1 : dummyProduct.thumbnailUrls.length - 1
    );
  };

  const goToNext = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex < dummyProduct.thumbnailUrls.length - 1 ? prevIndex + 1 : 0
    );
  };

  return (
    <motion.div
      className="container mx-auto px-4 py-8"
      initial="initial"
      animate="animate"
      variants={pageVariants}
    >
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Left Column - Product Image & Thumbnails */}
        <div className="lg:w-1/2 flex flex-col items-center">
          <div
            className="w-full max-w-lg bg-gray-100 rounded-lg overflow-hidden mb-4 relative cursor-pointer"
            onClick={() => handleImageClick(dummyProduct.thumbnailUrls.indexOf(mainImage), mainImage)} // Open slider from current main image
          >
            {/* AnimatePresence for main image transition */}
            <AnimatePresence mode="wait">
              <motion.div
                key={mainImage} // Key changes when image changes, triggering exit/enter animation
                variants={imageVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                className="w-full h-full"
              >
                <Image
                  src={mainImage}
                  alt={dummyProduct.name}
                  width={600}
                  height={600}
                  layout="responsive"
                  objectFit="contain"
                />
              </motion.div>
            </AnimatePresence>
          </div>
          <div className="flex gap-2 justify-center flex-wrap">
            {dummyProduct.thumbnailUrls.map((thumb, index) => (
              <motion.div
                key={index}
                className={`w-20 h-20 bg-gray-100 rounded-lg overflow-hidden cursor-pointer border-2 ${
                  mainImage === thumb ? "border-primary" : "border-transparent"
                }`}
                onClick={() => handleImageClick(index, thumb)} // Open slider from thumbnail
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Image
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
            Cat Food
          </span>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            {dummyProduct.name}
          </h1>

          {/* Star Ratings */}
          <div className="flex items-center text-yellow-400 mb-4">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                size={18}
                fill={i < dummyProduct.reviews ? "currentColor" : "none"}
                strokeWidth={i < dummyProduct.reviews ? 0 : 2}
                className="text-yellow-400"
              />
            ))}
            <span className="text-gray-500 text-sm ml-2">
              ({dummyProduct.reviews} Reviews)
            </span>
            <span className="text-gray-400 text-sm ml-4">
              SKU: {dummyProduct.sku}
            </span>
          </div>

          <p className="text-secondary text-4xl font-bold mb-4">
            ${dummyProduct.price}
          </p>

          <p className="text-gray-600 mb-6 leading-relaxed">
            {dummyProduct.description.substring(0, 200)}...
          </p>

          {/* Size Options */}
          {dummyProduct.availableSizes && dummyProduct.availableSizes.length > 0 && (
            <div className="mb-6">
              <span className="text-gray-700 font-semibold mr-4">Size:</span>
              <div className="flex gap-2">
                {dummyProduct.availableSizes.map((size) => (
                  <motion.button
                    key={size}
                    className={`px-4 py-2 rounded-md border ${
                      selectedSize === size
                        ? "border-primary text-primary"
                        : "border-gray-300 text-gray-700 hover:border-primary"
                    }`}
                    onClick={() => setSelectedSize(size)}
                    whileTap={{ scale: 0.95 }}
                  >
                    {size}
                  </motion.button>
                ))}
              </div>
            </div>
          )}

          {/* Quantity & Add to Cart */}
          <div className="flex items-center gap-4 mb-6">
            <div className="flex items-center border border-gray-300 rounded-lg">
              <motion.button
                className="p-2 text-gray-600 hover:text-primary"
                onClick={() => handleQuantityChange("decrement")}
                whileTap={{ scale: 0.9 }}
              >
                <Minus size={20} />
              </motion.button>
              <span className="px-4 text-lg font-medium">
                <motion.span
                  key={quantity} // Key change forces re-render and animation
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.15 }}
                >
                  {quantity}
                </motion.span>
              </span>
              <motion.button
                className="p-2 text-gray-600 hover:text-primary"
                onClick={() => handleQuantityChange("increment")}
                whileTap={{ scale: 0.9 }}
              >
                <Plus size={20} />
              </motion.button>
            </div>
            <motion.button
              className="btn-bubble btn-bubble-primary flex-grow max-w-[200px]"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <span>
                <ShoppingCart size={20} /> Add to Cart
              </span>
            </motion.button>
          </div>

          {/* Buy It Now & Wishlist/Compare */}
          <motion.button
            className="btn-bubble !bg-gray-200 !text-gray-800 hover:!bg-gray-300 w-full mb-4 max-w-[280px]"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            Buy It Now
          </motion.button>

          <div className="flex items-center gap-6 text-gray-600">
            <motion.button
              className="flex items-center gap-2 hover:text-primary transition-colors"
              whileTap={{ scale: 0.95 }}
            >
              <Heart size={20} /> Add To Wishlist
            </motion.button>
            <motion.button
              className="flex items-center gap-2 hover:text-primary transition-colors"
              whileTap={{ scale: 0.95 }}
            >
              <Repeat size={20} /> Compare To Other
            </motion.button>
          </div>

          <div className="border-t border-gray-200 mt-8 pt-6">
            <p className="text-gray-600 mb-2 text-sm">
              <span className="font-semibold">Categories:</span>{" "}
              {dummyProduct.category}
            </p>
            <p className="text-gray-600 text-sm">
              <span className="font-semibold">Tags:</span>{" "}
              {dummyProduct.tags.join(", ")}
            </p>
          </div>

          {/* Share Icons */}
          <div className="flex items-center gap-3 mt-4 text-gray-600">
            <span className="font-semibold text-sm">Share:</span>
            <a href="#" className="hover:text-primary">
              <i className="fab fa-facebook-f text-lg"></i>
            </a>
            <a href="#" className="hover:text-primary">
              <i className="fab fa-twitter text-lg"></i>
            </a>
            <a href="#" className="hover:text-primary">
              <i className="fab fa-pinterest-p text-lg"></i>
            </a>
            <a href="#" className="hover:text-primary">
              <i className="fab fa-instagram text-lg"></i>
            </a>
          </div>

          {/* Guaranteed Safe Checkout */}
          <div className="bg-gray-50 p-4 rounded-lg mt-8 border border-gray-200">
            <h4 className="font-semibold text-gray-800 mb-3">
              Guaranteed Safe Checkout
            </h4>
            <div className="flex items-center gap-4">
              {/* Replace with actual payment icons or SVGs if available */}
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
                ? "border-b-2 border-primary text-primary"
                : "text-gray-600 hover:text-primary"
            }`}
            onClick={() => setActiveTab("description")}
          >
            Description
          </button>
          <button
            className={`px-6 py-3 text-lg font-medium ${
              activeTab === "reviews"
                ? "border-b-2 border-primary text-primary"
                : "text-gray-600 hover:text-primary"
            }`}
            onClick={() => setActiveTab("reviews")}
          >
            Reviews
          </button>
        </div>

        {/* AnimatePresence for tab content transition */}
        <AnimatePresence mode="wait" initial={false}>
          {activeTab === "description" && (
            <motion.div
              key="description-content" // Unique key for AnimatePresence
              variants={tabContentVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              className="text-gray-700 leading-relaxed"
            >
              <p className="mb-4">{dummyProduct.description.split("\n")[0]}</p>
              <p>{dummyProduct.description.split("\n")[1]}</p>
            </motion.div>
          )}
          {activeTab === "reviews" && (
            <motion.div
              key="reviews-content" // Unique key for AnimatePresence
              variants={tabContentVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              className="text-gray-700"
            >
              <p>No reviews yet. Be the first to review this product!</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Full-screen Image Slider */}
      <AnimatePresence>
        {isSliderOpen && (
          <motion.div
            className="fixed inset-0 w-full h-full bg-black/80 z-50 flex items-center justify-center cursor-grab"
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
                  key={currentImageIndex} // Key changes when image index changes, triggering exit/enter animation
                  custom={0} // Custom prop for slide direction, adjusted in goTo functions if needed
                  variants={slideVariants}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  drag="x" // Enable horizontal dragging
                  dragConstraints={{ left: 0, right: 0 }} // Keep drag within current view
                  onDragEnd={(e, { offset }) => {
                    const swipeThreshold = 100; // Pixels to trigger a swipe
                    if (offset.x > swipeThreshold) {
                      goToPrevious();
                    } else if (offset.x < -swipeThreshold) {
                      goToNext();
                    }
                  }}
                  className="absolute top-0 left-0 w-full h-full flex items-center justify-center"
                >
                  <Image
                    src={dummyProduct.thumbnailUrls?.[currentImageIndex] || "/images/placeholder.png"}
                    alt={dummyProduct.name}
                    layout="fill"
                    objectFit="contain"
                    className="cursor-grab"
                  />
                </motion.div>
              </AnimatePresence>
              {dummyProduct.thumbnailUrls && dummyProduct.thumbnailUrls.length > 1 && (
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
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default ProductDetailsPage;