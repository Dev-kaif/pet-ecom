import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { Heart, Eye, ShoppingCart, Star } from "lucide-react"; // Import Lucid Icons

export interface Product {
  id: number;
  name: string;
  price: string;
  oldPrice?: string;
  imageUrl: string;
  reviews: number;
  isNew?: boolean;
  isOnSale?: boolean;
}

interface ProductCardProps {
  product: Product;
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
  return (
    <motion.div
      className="relative bg-white rounded-lg shadow-md overflow-hidden product-card group cursor-pointer transition-transform duration-300"
      variants={cardVariants}
      initial="initial"
      animate="animate"
      whileHover="hovered" // This 'hovered' is passed to children using variants
      transition={{ duration: 0.3 }}
    >
      {/* Sale/New Badges */}
      {(product.isNew || product.isOnSale) && (
        <div className="absolute top-2 left-2 flex gap-2 z-10">
          {product.isOnSale && (
            <span className="bg-red-500 text-white text-xs font-semibold px-2 py-1 rounded-full">
              Sale!
            </span>
          )}
          {product.isNew && (
            <span className="bg-primary text-white text-xs font-semibold px-2 py-1 rounded-full">
              New
            </span>
          )}
        </div>
      )}

      <div className="relative w-full h-48 overflow-hidden bg-gray-100 flex items-center justify-center">
        <Image
          src={product.imageUrl}
          alt={product.name}
          layout="fill"
          objectFit="contain"
          className="transition-transform duration-300 group-hover:brightness-75"
        />
        {/* Wishlist and Quick View on hover */}
        <div className="absolute top-2 right-2 flex flex-col space-y-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <button
            className="bg-white p-2 rounded-full shadow-md text-primary hover:text-secondary transition-colors"
            aria-label="Add to Wishlist"
          >
            <Heart size={20} /> {/* Empty heart icon */}
          </button>
          <button
            className="bg-white p-2 rounded-full shadow-md text-primary hover:text-secondary transition-colors"
            aria-label="Quick View"
          >
            <Eye size={20} /> {/* Eye icon for quick view */}
          </button>
        </div>

        {/* Add to Cart Button */}
        <motion.button
          className="btn-bubble btn-bubble-primary !rounded-lg !absolute bottom-2"
          variants={buttonChildVariants} 
          transition={{ duration: 0.1 ,ease: "easeInOut"}}
          aria-label="Add product to cart"
        >
          <span className="flex items-center justify-center gap-2">
            <ShoppingCart size={20} />
            Add to Cart
          </span>
        </motion.button>
      </div>

      <div className="p-4 flex flex-col text-start ">
        {/* Star Ratings */}
        <div className="flex text-yellow-400 mb-2">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              size={16}
              fill={i < product.reviews ? "currentColor" : "none"} // Fill star if index is less than reviews
              strokeWidth={i < product.reviews ? 0 : 2} // No stroke for filled stars
              className="text-yellow-400"
            />
          ))}
          <span className="text-gray-500 text-xs ml-2">
            ({product.reviews} Reviews)
          </span>
        </div>
        <h3 className="text-gray-800 font-medium text-lg mb-1 line-clamp-2">
          {product.name}
        </h3>
        <div className="flex items-baseline space-x-2 text-xl font-bold">
          <span className="text-secondary">${product.price}</span>
          {product.oldPrice && (
            <span className="text-gray-400 line-through text-base">
              ${product.oldPrice}
            </span>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default ProductCard;
