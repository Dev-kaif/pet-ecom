/* eslint-disable @typescript-eslint/no-explicit-any */
// src/app/orders/[orderId]/page.tsx
"use client";

import React, { useEffect, useState, useCallback } from "react";
import { useParams } from "next/navigation";
import { motion } from "motion/react";
import { IOrder, OrderStatus, PaymentMethod } from "@/types";
import axios from "axios";
import Image from "next/image";
import Link from "next/link";
import {
  CheckCircle,
  XCircle,
  Clock,
  Truck,
  Package,
  Home,
  CreditCard,
  ShoppingBag,
  CircleAlert,
  Loader2, // Imported for inline loading spinner
} from "lucide-react";
import { format } from "date-fns";
import Loader from "../ui/Loader"; // Still used for full-page loading
import toast from "react-hot-toast";

export default function OrderDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const orderId = id;
  const [order, setOrder] = useState<IOrder | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [cancelling, setCancelling] = useState(false);
  const [showCancelConfirmationModal, setShowCancelConfirmationModal] = useState(false); // New state for modal

  const fetchOrderDetails = useCallback(async () => {
    if (!orderId) {
      setError("No order ID provided.");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const response = await axios.get(`/api/orders/${orderId}`);
      if (response.data.success) {
        const fetchedOrder = {
          ...response.data.data,
          createdAt: response.data.data.createdAt
            ? new Date(response.data.data.createdAt)
            : undefined,
          deliveredAt: response.data.data.deliveredAt
            ? new Date(response.data.data.deliveredAt)
            : undefined,
          paidAt: response.data.data.paidAt
            ? new Date(response.data.data.paidAt)
            : undefined,
        };
        setOrder(fetchedOrder);
      } else {
        setError(response.data.message || "Failed to load order details.");
      }
    } catch (err: any) {
      console.error("Error fetching order details:", err);
      setError(
        err.response?.data?.message ||
          err.message ||
          "An unexpected error occurred while fetching order details."
      );
    } finally {
      setLoading(false);
    }
  }, [orderId]);

  // Function to initiate cancellation (opens modal)
  const initiateCancelProcess = () => {
    setShowCancelConfirmationModal(true);
  };

  // Actual cancellation logic
  const confirmCancelOrder = useCallback(async () => {
    if (!orderId || !order) return;

    setShowCancelConfirmationModal(false); // Close modal
    
    try {
      setCancelling(true);
      toast.loading("Cancelling order...", { id: "cancelOrderToast" });

      const response = await axios.delete(`/api/orders/${orderId}`);

      if (response.data.success) {
        setOrder((prevOrder) => ({
          ...(prevOrder as IOrder),
          orderStatus: "cancelled",
        }));
        toast.success(response.data.message || "Order cancelled successfully!", {
          id: "cancelOrderToast",
        });
      } else {
        toast.error(response.data.message || "Failed to cancel order.", {
          id: "cancelOrderToast",
        });
      }
    } catch (err: any) {
      console.error("Error cancelling order:", err);
      toast.error(
        err.response?.data?.message ||
          err.message ||
          "An unexpected error occurred during cancellation.",
        { id: "cancelOrderToast" }
      );
    } finally {
      setCancelling(false);
    }
  }, [orderId, order]);

  useEffect(() => {
    fetchOrderDetails();
  }, [fetchOrderDetails]);

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

  const getPaymentMethodDisplayName = (method: PaymentMethod): string => {
    switch (method) {
      case "card":
        return "Credit/Debit Card";
      case "paypal":
        return "PayPal";
      case "cash_on_delivery":
        return "Cash on Delivery (COD)";
      default:
        return "Unknown";
    }
  };

  const formattedCreatedAt = order?.createdAt
    ? format(new Date(order.createdAt), "MMMM d,PPPP HH:mm")
    : "N/A";
  const formattedDeliveredAt = order?.deliveredAt
    ? format(new Date(order.deliveredAt), "MMMM d,PPPP HH:mm")
    : "N/A";

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

  const summaryLineVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.3, ease: "easeOut" },
    },
  };

  if (loading) {
    return <Loader />;
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
        <XCircle size={48} className="text-red-500 mb-4" />
        <p className="text-red-700 text-xl font-semibold mb-2">
          Error loading order:
        </p>
        <p className="text-neutral-600 mb-6">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="px-6 py-3 bg-primary-500 text-white font-semibold rounded-md shadow-md hover:bg-primary-600 transition-colors duration-200"
        >
          Retry
        </button>
        <Link href="/my-orders" className="mt-4 text-blue-600 hover:underline">
          Go to My Orders
        </Link>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
        <Package size={48} className="text-neutral-500 mb-4" />
        <p className="text-neutral-700 text-xl font-semibold mb-2">
          Order Not Found
        </p>
        <p className="text-neutral-500 mb-6">
          The order you are looking for does not exist or you do not have
          permission to view it.
        </p>
        <Link
          href="/my-orders"
          className="px-6 py-3 bg-primary-500 text-white font-semibold rounded-md shadow-md hover:bg-primary-600 transition-colors duration-200"
        >
          Go to My Orders
        </Link>
      </div>
    );
  }

  const isCancellable =
    order.orderStatus === "pending" || order.orderStatus === "processing";

  return (
    <motion.div
      className="container mx-auto px-4 py-32 max-w-4xl "
      variants={pageVariants}
      initial="hidden"
      animate="visible"
    >
      <div className="bg-white rounded-lg shadow-lg p-6 md:p-8">
        <motion.h1
          variants={sectionVariants}
          className="text-3xl font-bold text-neutral-800 mb-6 flex items-center gap-3"
        >
          <ShoppingBag size={32} />
          Order Confirmation{" "}
          <span className="text-primary-600">
            #{order._id!.toString().substring(0, 8)}
          </span>
        </motion.h1>

        <motion.div
          variants={sectionVariants}
          className="mb-8 p-4 bg-primary-50 rounded-md text-primary-800 flex items-center gap-3"
        >
          <CheckCircle size={24} className="text-primary-600" />
          <p className="text-lg font-medium">
            Thank you for your order! Your purchase is confirmed.
          </p>
        </motion.div>

        {/* Order Status */}
        <motion.div
          variants={sectionVariants}
          className="mb-8 border-b border-neutral-200 pb-6"
        >
          <h2 className="text-2xl font-semibold text-neutral-800 mb-4 flex items-center gap-2">
            Order Status{" "}
            <span className="ml-2">{getStatusIcon(order.orderStatus)}</span>
          </h2>
          <div className="flex flex-wrap items-center gap-4 text-neutral-700">
            <p className="text-lg">
              Status:{" "}
              <span className="font-semibold capitalize">
                {order.orderStatus}
              </span>
            </p>
            <p className="text-sm">Placed On: {formattedCreatedAt}</p>
            {order.orderStatus === "delivered" && order.deliveredAt && (
              <p className="text-sm">Delivered On: {formattedDeliveredAt}</p>
            )}
          </div>

          {/* Cancellation section */}
          {isCancellable && (
            <motion.div
              variants={sectionVariants}
              className="mt-6 p-4 bg-red-50 border border-red-200 rounded-md flex items-center justify-between"
            >
              <div className="flex items-center gap-3 text-red-700">
                <CircleAlert size={24} />
                <p className="font-medium">Need to cancel this order?</p>
              </div>
              <motion.button
                onClick={initiateCancelProcess} // Calls function to show modal
                disabled={cancelling}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-5 py-2 bg-red-600 text-white font-semibold rounded-md shadow-md hover:bg-red-700 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {cancelling ? (
                  <>
                    <Loader2 size={20} className="animate-spin" />
                    Cancelling...
                  </>
                ) : (
                  "Cancel Order"
                )}
              </motion.button>
            </motion.div>
          )}

          {/* Message if order is already cancelled */}
          {order.orderStatus === 'cancelled' && (
            <motion.div
              variants={sectionVariants}
              className="mt-6 p-4 bg-red-50 border border-red-200 rounded-md text-red-700 flex items-center gap-3"
            >
              <XCircle size={24} />
              <p className="font-medium">This order has been cancelled.</p>
            </motion.div>
          )}
        </motion.div>

        {/* Shipping Address */}
        <motion.div
          variants={sectionVariants}
          className="mb-8 border-b border-neutral-200 pb-6"
        >
          <h2 className="text-2xl font-semibold text-neutral-800 mb-4 flex items-center gap-2">
            <Home size={24} />
            Shipping Address
          </h2>
          <div className="bg-neutral-50 p-4 rounded-md border border-neutral-200 text-neutral-700 text-base space-y-1">
            <p className="font-medium">{order.shippingAddress.street}</p>
            {order.shippingAddress.apartment && (
              <p>{order.shippingAddress.apartment}</p>
            )}
            <p>
              {order.shippingAddress.city}, {order.shippingAddress.state}{" "}
              {order.shippingAddress.zipCode}
            </p>
            <p>{order.shippingAddress.country}</p>
          </div>
        </motion.div>

        {/* Payment Method */}
        <motion.div
          variants={sectionVariants}
          className="mb-8 border-b border-neutral-200 pb-6"
        >
          <h2 className="text-2xl font-semibold text-neutral-800 mb-4 flex items-center gap-2">
            <CreditCard size={24} />
            Payment Method
          </h2>
          <div className="bg-neutral-50 p-4 rounded-md border border-neutral-200 text-neutral-700 text-base">
            <p className="font-medium">
              {getPaymentMethodDisplayName(order.paymentMethod)}
            </p>
            {order.paymentMethod === "card" && (
              <p className="text-sm text-neutral-500">
                Card details secured via payment gateway.
              </p>
            )}
            {order.paymentResult?.id && (
              <p className="text-xs text-neutral-500 mt-1">
                Payment ID: {order.paymentResult.id}
              </p>
            )}
          </div>
        </motion.div>

        {/* Ordered Items */}
        <motion.div
          variants={sectionVariants}
          className="mb-8 border-b border-neutral-200 pb-6"
        >
          <h2 className="text-2xl font-semibold text-neutral-800 mb-4 flex items-center gap-2">
            <Package size={24} />
            Order Items
          </h2>
          <div className="space-y-4">
            {order.items.map((item) => (
              <motion.div
                key={item.productId.toString()}
                variants={itemVariants}
                className="flex items-center space-x-4 bg-neutral-50 p-3 rounded-md border border-neutral-200"
              >
                <div className="relative w-20 h-20 flex-shrink-0 rounded-md overflow-hidden">
                  <Image
                    src={item.imageUrl}
                    alt={item.name}
                    layout="fill"
                    objectFit="cover"
                    className="absolute"
                  />
                </div>
                <div className="flex-grow">
                  <p className="text-neutral-800 font-medium text-lg line-clamp-1">
                    {item.name}
                  </p>
                  <p className="text-neutral-600 text-sm">
                    Qty: {item.quantity}
                  </p>
                  <p className="text-neutral-600 text-sm">
                    Price per unit: ${item.price.toFixed(2)}
                  </p>
                </div>
                <p className="text-neutral-900 font-semibold text-lg flex-shrink-0">
                  ${(item.price * item.quantity).toFixed(2)}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Price Summary */}
        <motion.div variants={sectionVariants} className="mb-8">
          <h2 className="text-2xl font-semibold text-neutral-800 mb-4">
            Price Summary
          </h2>
          <div className="space-y-2 text-lg">
            <motion.div
              variants={summaryLineVariants}
              className="flex justify-between text-neutral-700"
            >
              <span>Subtotal ({order.items.length} items)</span>
              <span>
                $
                {(
                  order.totalPrice -
                  order.shippingPrice -
                  order.taxPrice
                ).toFixed(2)}
              </span>
            </motion.div>
            <motion.div
              variants={summaryLineVariants}
              className="flex justify-between text-neutral-700"
            >
              <span>Shipping</span>
              <span>
                {order.shippingPrice === 0
                  ? "Free"
                  : `$${order.shippingPrice.toFixed(2)}`}
              </span>
            </motion.div>
            <motion.div
              variants={summaryLineVariants}
              className="flex justify-between text-neutral-700"
            >
              <span>
                Tax (
                {order.taxPrice > 0
                  ? (
                      (order.taxPrice /
                        (order.totalPrice - order.shippingPrice)) *
                      100
                    ).toFixed(0)
                  : 0}
                %)
              </span>
              <span>${order.taxPrice.toFixed(2)}</span>
            </motion.div>
            <motion.div
              variants={summaryLineVariants}
              className="flex justify-between text-3xl font-bold text-primary-700 border-t border-dashed border-neutral-300 pt-4 mt-4"
            >
              <span>Grand Total</span>
              <span>${order.totalPrice.toFixed(2)}</span>
            </motion.div>
          </div>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          variants={sectionVariants}
          className="flex justify-center gap-4 pt-6 border-t border-neutral-200"
        >
          <Link href="/orders" passHref>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-6 py-3 border border-neutral-300 text-neutral-700 font-semibold rounded-md shadow-sm hover:bg-neutral-100 transition-colors duration-200"
            >
              View All Orders
            </motion.button>
          </Link>
          <Link href="/shop" passHref>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-6 py-3 bg-secondary text-white font-semibold rounded-md shadow-md hover:bg-primary-600 transition-colors duration-200"
            >
              Continue Shopping
            </motion.button>
          </Link>
        </motion.div>
      </div>

      {/* Confirmation Modal */}
      {showCancelConfirmationModal && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4"
        >
          <motion.div
            initial={{ scale: 0.9, y: 50 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 50 }}
            className="bg-white rounded-lg shadow-xl p-6 max-w-sm w-full text-center"
          >
            <h3 className="text-xl font-semibold text-neutral-800 mb-4">Confirm Cancellation</h3>
            <p className="text-neutral-600 mb-6">
              Are you sure you want to cancel this order? This action cannot be undone.
            </p>
            <div className="flex justify-center gap-4">
              <button
                onClick={() => setShowCancelConfirmationModal(false)}
                className="px-6 py-2 border border-neutral-300 text-neutral-700 font-semibold rounded-md hover:bg-neutral-100 transition-colors"
              >
                No, Keep Order
              </button>
              <button
                onClick={confirmCancelOrder}
                className="px-6 py-2 bg-red-600 text-white font-semibold rounded-md hover:bg-red-700 transition-colors"
              >
                Yes, Cancel Order
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </motion.div>
  );
}