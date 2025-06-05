import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, ShoppingCart, Trash2 } from "lucide-react";

const dummyWishlistItems = [
  {
    id: 101,
    name: "Luxury Pet Bed - Orthopedic",
    imageUrl: "https://placehold.co/96x96/e0e0e0/555555?text=Wish+Item+1", // Placeholder image
    price: 89.99,
  },
  {
    id: 102,
    name: "Interactive Laser Pointer Toy",
    imageUrl: "https://placehold.co/96x96/e0e0e0/555555?text=Wish+Item+2", // Placeholder image
    price: 19.99,
  },
  {
    id: 103,
    name: "Premium Salmon Oil Supplement",
    imageUrl: "https://placehold.co/96x96/e0e0e0/555555?text=Wish+Item+3", // Placeholder image
    price: 34.5,
  },
];

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
  const [wishlistItems, setWishlistItems] = useState(dummyWishlistItems);

  // Handle removing an item from the wishlist
  const handleRemoveItem = (itemId: number) => {
    setWishlistItems((prevItems) =>
      prevItems.filter((item) => item.id !== itemId)
    );
  };

  // Simulate moving an item to the cart (in a real app, this would update global cart state)
  const handleMoveToCart = (item: (typeof dummyWishlistItems)[0]) => {
    alert(`"${item.name}" moved to cart! (Simulation)`);
    handleRemoveItem(item.id); // Remove from wishlist after "moving" to cart
  };

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
          <motion.button
            className="btn-bubble btn-bubble-primary inline-flex items-center gap-2"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => alert("Navigate to shop page")} // Replace with actual navigation
          >
            Explore Products
          </motion.button>
        </motion.div>
      ) : (
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold text-primary mb-6 border-b pb-4">
            Wishlist Items ({wishlistItems.length})
          </h2>
          <AnimatePresence>
            {wishlistItems.map((item) => (
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
                        (e.target as HTMLImageElement).src =
                          "https://placehold.co/96x96/e0e0e0/555555?text=No+Image";
                      }}
                    />
                  </div>
                  <div className="ml-4 flex-grow">
                    <h3 className="text-lg font-medium text-secondary line-clamp-2">
                      {item.name}
                    </h3>
                    <p className="text-gray-600 text-sm">
                      Price: ${item.price.toFixed(2)}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4 mt-4 sm:mt-0">
                  {/* Move to Cart Button */}
                  <motion.button
                    className="btn-bubble btn-bubble-primary"
                    onClick={() => handleMoveToCart(item)}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <span>
                      <ShoppingCart size={18} /> Move to Cart
                    </span>
                  </motion.button>

                  {/* Remove Button */}
                  <motion.button
                    className="text-gray-400 hover:text-red-500 transition-colors p-2"
                    onClick={() => handleRemoveItem(item.id)}
                    whileTap={{ scale: 0.9 }}
                    aria-label="Remove item from wishlist"
                  >
                    <Trash2 size={20} />
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
