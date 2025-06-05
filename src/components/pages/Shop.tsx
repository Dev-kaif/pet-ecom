"use client";
import React, { useState, useMemo } from "react";
import Head from "next/head";
import ProductCard from "@/components/ui/ProductCard";
import Pagination from "@/components/ui/pagination";
import { motion } from "framer-motion";

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

// Dummy product data
// In a real application, you would fetch this from an API
const allProducts: Product[] = [
  {
    id: 1,
    name: "Dog Harness-Neoprene Comfort Liner-Orange And...",
    price: "12.00",
    oldPrice: "25.00",
    imageUrl: "/images/product1.jpg",
    reviews: 4,
    isNew: true,
  },
  {
    id: 2,
    name: "Arm & Hammer Super Deodorizing Dog Shampoo...",
    price: "20.00",
    oldPrice: "30.00",
    imageUrl: "/images/product2.jpg",
    reviews: 3,
    isOnSale: true,
  },
  {
    id: 3,
    name: "Milk-Bone Brushing Chews Daily Dental Dog Treats...",
    price: "36.00",
    oldPrice: "56.00",
    imageUrl: "/images/product3.jpg",
    reviews: 5,
    isOnSale: true,
  },
  {
    id: 4,
    name: "Two Door Top Load Plastic Kennel & Pet Carrier...",
    price: "18.00",
    oldPrice: "33.00",
    imageUrl: "/images/product4.jpg",
    reviews: 2,
    isOnSale: true,
  },
  {
    id: 5,
    name: "The Kitten House With Mat Sleeping Bed House",
    price: "19.00",
    oldPrice: "28.00",
    imageUrl: "/images/product5.jpg",
    reviews: 4,
    isNew: true,
  },
  {
    id: 6,
    name: "Dog Puzzle Toys, Squeaky Treat Dispensing...",
    price: "19.00",
    oldPrice: "28.00",
    imageUrl: "/images/product6.jpg",
    reviews: 3,
  },
  {
    id: 7,
    name: "Zesty Paws Calming Puppy Bites Stress Relief For Dogs, 6...",
    price: "16.00",
    imageUrl: "/images/product7.jpg",
    reviews: 5,
    isNew: true,
  },
  {
    id: 8,
    name: "Hartz' Groomer's Best Extra Gentle Puppy Shampoo, 18oz...",
    price: "30.00",
    oldPrice: "88.00",
    imageUrl: "/images/product8.jpg",
    reviews: 4,
    isOnSale: true,
  },
  {
    id: 9,
    name: "The Kitten House With Mat Sleeping Bed House (Blue)",
    price: "22.00",
    oldPrice: "59.00",
    imageUrl: "/images/product9.jpg",
    reviews: 3,
    isNew: true,
  },
  {
    id: 10,
    name: "Dog Harness-Neoprene Comfort Liner-Blue...",
    price: "11.00",
    oldPrice: "48.00",
    imageUrl: "/images/product10.jpg",
    reviews: 5,
    isOnSale: true,
  },
  {
    id: 11,
    name: "Premium Dog Food 10kg",
    price: "45.00",
    oldPrice: "60.00",
    imageUrl: "/images/product11.jpg",
    reviews: 4,
    isNew: true,
  },
  {
    id: 12,
    name: "Luxury Pet Bed",
    price: "75.00",
    oldPrice: "90.00",
    imageUrl: "/images/product12.jpg",
    reviews: 5,
    isOnSale: true,
  },
  {
    id: 13,
    name: "Interactive Cat Toy",
    price: "15.00",
    imageUrl: "/images/product13.jpg",
    reviews: 3,
    isNew: true,
  },
  {
    id: 14,
    name: "Bird Cage Large",
    price: "120.00",
    oldPrice: "150.00",
    imageUrl: "/images/product14.jpg",
    reviews: 4,
  },
  {
    id: 15,
    name: "Aquarium Starter Kit",
    price: "80.00",
    imageUrl: "/images/product15.jpg",
    reviews: 5,
    isOnSale: true,
  },
  {
    id: 16,
    name: "Small Animal Hay",
    price: "8.00",
    oldPrice: "12.00",
    imageUrl: "/images/product16.jpg",
    reviews: 2,
  },
  {
    id: 17,
    name: "Fish Tank Decoration",
    price: "10.00",
    imageUrl: "/images/product17.jpg",
    reviews: 4,
    isNew: true,
  },
  {
    id: 18,
    name: "Pet Grooming Kit",
    price: "35.00",
    oldPrice: "45.00",
    imageUrl: "/images/product18.jpg",
    reviews: 5,
    isOnSale: true,
  },
  {
    id: 19,
    name: "Travel Pet Carrier",
    price: "55.00",
    imageUrl: "/images/product19.jpg",
    reviews: 3,
  },
  {
    id: 20,
    name: "Dog Chew Toys Set",
    price: "25.00",
    oldPrice: "35.00",
    imageUrl: "/images/product20.jpg",
    reviews: 4,
    isNew: true,
  },
  {
    id: 21,
    name: "Cat Scratcher Post",
    price: "40.00",
    imageUrl: "/images/product21.jpg",
    reviews: 5,
    isOnSale: true,
  },
  {
    id: 22,
    name: "Reptile Heat Lamp",
    price: "28.00",
    oldPrice: "38.00",
    imageUrl: "/images/product22.jpg",
    reviews: 3,
  },
  {
    id: 23,
    name: "Bird Seed Mix 5lb",
    price: "18.00",
    imageUrl: "/images/product23.jpg",
    reviews: 4,
  },
  {
    id: 24,
    name: "Dog Training Clicker",
    price: "5.00",
    imageUrl: "/images/product24.jpg",
    reviews: 5,
    isNew: true,
  },
];

const PRODUCTS_PER_PAGE = 15;

const Shop: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(allProducts.length / PRODUCTS_PER_PAGE);

  const currentProducts = useMemo(() => {
    const startIndex = (currentPage - 1) * PRODUCTS_PER_PAGE;
    const endIndex = startIndex + PRODUCTS_PER_PAGE;
    return allProducts.slice(startIndex, endIndex);
  }, [currentPage]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    // Optionally scroll to top on page change for better UX
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <motion.div
      className="min-h-screen bg-white py-10 font-sans"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Head>
        <title>E-commerce Product Grid</title>
        <meta
          name="description"
          content="E-commerce product grid with pagination, hover effects, and animations."
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6"
          key={currentPage}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {currentProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </motion.div>

        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      </div>
    </motion.div>
  );
};

export default Shop;
