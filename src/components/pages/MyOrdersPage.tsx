"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import Image from "next/image"; // Import Image component
import { motion } from "motion/react";
import { IOrder, OrderStatus } from "@/types"; // Make sure IOrder and OrderStatus are correctly imported
import axios from "axios";
import {
  Package,
  ShoppingBag,
  Clock,
  CheckCircle,
  XCircle,
  Truck,
  Image as ImageIcon, // For placeholder if no image
} from "lucide-react"; // Removed FileText as it's no longer used for the button
import { format } from "date-fns";
import Loader from "../ui/Loader"; // Your full-page loader
import { Types } from "mongoose"; // For formatting ObjectId

// Utility to ensure MongoDB ObjectId strings are valid for display/forms
const formatObjectId = (id: Types.ObjectId | string | undefined): string => {
  if (typeof id === "string") {
    return id;
  }
  if (id instanceof Types.ObjectId) {
    return id.toString();
  }
  return "";
};

// Framer Motion Variants
const pageVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: "easeOut",
      when: "beforeChildren",
      staggerChildren: 0.1,
    },
  },
};

const sectionVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: "easeOut" },
  },
};

const itemVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.3, ease: "easeOut" },
  },
};

export default function MyOrdersPage() {
  const [orders, setOrders] = useState<IOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchMyOrders = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      // This endpoint should return only the user's orders if authenticated and not admin
      const response = await axios.get("/api/orders");
      if (response.data.success) {
        // Ensure dates are parsed if they come as strings
        const fetchedOrders = response.data.data.map((order: any) => ({
          ...order,
          createdAt: order.createdAt ? new Date(order.createdAt) : undefined,
          deliveredAt: order.deliveredAt
            ? new Date(order.deliveredAt)
            : undefined,
          paidAt: order.paidAt ? new Date(order.paidAt) : undefined,
        }));
        setOrders(fetchedOrders);
      } else {
        setError(response.data.message || "Failed to load your orders.");
      }
    } catch (err: any) {
      console.error("Error fetching my orders:", err);
      setError(
        err.response?.data?.message ||
          err.message ||
          "An unexpected error occurred while fetching your orders."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMyOrders();
  }, [fetchMyOrders]);

  const getStatusIcon = (status: OrderStatus) => {
    switch (status) {
      case "pending":
      case "processing":
        return <Clock size={20} className="text-blue-500" />;
      case "shipped":
        return <Truck size={20} className="text-orange-500" />;
      case "delivered":
      case "completed":
        return <CheckCircle size={20} className="text-green-500" />;
      case "cancelled":
      case "refunded":
        return <XCircle size={20} className="text-red-500" />;
      default:
        return <Clock size={20} className="text-gray-500" />;
    }
  };

  if (loading) {
    return <Loader />; // Your full-page loader
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4 py-32">
        <XCircle size={48} className="text-red-500 mb-4" />
        <p className="text-red-700 text-xl font-semibold mb-2">
          Error loading your orders:
        </p>
        <p className="text-neutral-600 mb-6">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="px-6 py-3 bg-primary-500 text-white font-semibold rounded-md shadow-md hover:bg-primary-600 transition-colors duration-200"
        >
          Retry
        </button>
        <Link href="/" className="mt-4 text-blue-600 hover:underline">
          Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <motion.div
      className="container mx-auto px-4 py-32 max-w-5xl"
      variants={pageVariants}
      initial="hidden"
      animate="visible"
    >
      <div>
        {" "}
        {/* This div no longer has card styling */}
        <motion.h1
          variants={sectionVariants}
          className="text-3xl font-bold text-secondary mb-8 flex items-center gap-3 border-b pb-4"
        >
          <ShoppingBag size={32} />
          My Orders
        </motion.h1>
        {orders.length === 0 ? (
          <motion.div
            variants={sectionVariants}
            className="flex flex-col items-center justify-center py-16 text-center text-neutral-600"
          >
            <Package size={64} className="text-neutral-400 mb-6" />
            <p className="text-xl font-semibold mb-3">No Orders Yet!</p>
            <p className="mb-8 max-w-md">
              It looks like you haven&apos;t placed any orders. Start exploring
              our products!
            </p>
            <Link href="/" passHref>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 bg-primary text-white font-semibold rounded-lg shadow-md hover:bg-primary-600 transition-colors duration-200 text-lg"
              >
                Start Shopping
              </motion.button>
            </Link>
          </motion.div>
        ) : (
          <div className="overflow-x-auto rounded-lg shadow-md border border-neutral-200">
            <table className="min-w-full bg-white">
              <thead className="bg-primary text-white">
                <tr>
                  <th className="py-4 px-6 text-left text-base font-semibold rounded-tl-lg">
                    Product Image
                  </th>
                  <th className="py-4 px-6 text-left text-base font-semibold">
                    Date
                  </th>
                  <th className="py-4 px-6 text-left text-base font-semibold">
                    Items Count
                  </th>
                  <th className="py-4 px-6 text-left text-base font-semibold">
                    Total
                  </th>
                  <th className="py-4 px-6 text-left text-base font-semibold">
                    Status
                  </th>
                  <th className="py-4 px-6 text-center text-base font-semibold rounded-tr-lg">
                    Details
                  </th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <motion.tr
                    key={formatObjectId(order._id!)}
                    variants={itemVariants}
                    className="border-b border-neutral-200 hover:bg-neutral-50 transition-colors duration-150"
                  >
                    <td className="py-4 px-6">
                      {order.items &&
                      order.items.length > 0 &&
                      order.items[0].imageUrl ? (
                        <Image
                          src={order.items[0].imageUrl}
                          alt={order.items[0].name || "Product Image"}
                          width={80}
                          height={80}
                          className="w-20 h-20 object-cover rounded-md shadow-sm"
                        />
                      ) : (
                        <div className="w-20 h-20 flex items-center justify-center bg-neutral-100 rounded-md text-neutral-400">
                          <ImageIcon size={32} />
                        </div>
                      )}
                    </td>
                    <td className="py-4 px-6 text-neutral-700 text-base">
                      {order.createdAt
                        ? format(new Date(order.createdAt), "MMM d, yyyy")
                        : "N/A"}
                    </td>
                    <td className="py-4 px-6 text-neutral-700 text-base">
                      {order.items.length} product
                      {order.items.length !== 1 ? "s" : ""}
                    </td>
                    <td className="py-4 px-6 text-secondary text-base font-semibold">
                      ${order.totalPrice.toFixed(2)}
                    </td>
                    <td
                      className={`h-32 py-4 px-6 text-base capitalize font-medium flex items-center gap-2 ${
                        order.orderStatus === "cancelled" ||
                        order.orderStatus === "refunded"
                          ? "text-red-600"
                          : order.orderStatus === "delivered" ||
                              order.orderStatus === "completed"
                            ? "text-green-600"
                            : "text-blue-600"
                      }`}
                    >
                      {getStatusIcon(order.orderStatus)} {order.orderStatus}
                    </td>
                    <td className="py-4 px-6 text-center">
                      <Link
                        href={`/orders/${formatObjectId(order._id)}`}
                        passHref
                      >
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className="bg-secondary text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-primary-600 transition-colors duration-200 shadow-sm"
                          title="View Order Details"
                        >
                          View Details
                        </motion.button>
                      </Link>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </motion.div>
  );
}
