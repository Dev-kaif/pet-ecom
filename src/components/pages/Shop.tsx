/* eslint-disable @typescript-eslint/no-explicit-any */
// src/app/shop/page.tsx
"use client"; // This directive is essential for client-side functionality

import React, { useState, useEffect, useCallback } from "react";
import Head from "next/head";
import ProductCard from "@/components/ui/ProductCard"; // Adjust path if needed
import Pagination from "@/components/ui/pagination"; // Adjust path if needed
import { motion } from "framer-motion";
import { IProduct } from '@/types'; // Import the IProduct interface from your types file

// Define products per page for the frontend display and API request limit
const PRODUCTS_PER_PAGE = 15;

const Shop: React.FC = () => {
  const [products, setProducts] = useState<IProduct[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [, setTotalItems] = useState<number>(0); // Store total items for display

  // Function to fetch products from the backend API
  const fetchProducts = useCallback(async () => {
    setLoading(true);
    setError(null); // Clear previous errors

    try {
      const response = await fetch(`/api/products?page=${currentPage}&limit=${PRODUCTS_PER_PAGE}`);
      const data = await response.json();

      if (data.success) {
        setProducts(data.data);
        setTotalPages(data.pagination.totalPages);
        setTotalItems(data.pagination.totalItems);
      } else {
        setError(data.message || 'Failed to fetch products.');
        setProducts([]); // Clear products on error
      }
    } catch (err: any) {
      console.error("Error fetching products:", err);
      setError('Network error: Could not connect to the server.');
      setProducts([]); 
    } finally {
      setLoading(false);
    }
  }, [currentPage]); // Re-run fetch when currentPage changes

  // Trigger product fetch when the component mounts or currentPage changes
  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]); // Only fetch when fetchProducts memoized function changes

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      // Optionally scroll to top on page change for better UX
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
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
        <h1 className="text-4xl font-extrabold text-center text-gray-900 mb-10">Our Products</h1>

        {loading && (
          <div className="flex items-center justify-center h-64">
            <p className="text-gray-600 text-lg">Loading products...</p>
          </div>
        )}

        {error && (
          <div className="flex items-center justify-center h-64">
            <p className="text-red-600 text-lg">Error: {error}</p>
          </div>
        )}

        {!loading && !error && products.length === 0 && (
          <div className="flex items-center justify-center h-64">
            <p className="text-gray-600 text-lg">No products found. Please check back later!</p>
          </div>
        )}

        {!loading && !error && products.length > 0 && (
          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6"
            key={currentPage} // Key change forces re-animation on page change
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {products.map((product) => (
              <ProductCard key={product._id?.toString() || product.name} product={product} />
            ))}
          </motion.div>
        )}

        {/* Only show pagination if there are products and more than one page */}
        {!loading && !error && products.length > 0 && totalPages > 1 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        )}
      </div>
    </motion.div>
  );
};

export default Shop;