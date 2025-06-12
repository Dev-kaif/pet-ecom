/* eslint-disable @typescript-eslint/no-explicit-any */
// src/components/admin/OrderManagement.tsx
import React, { useState, useEffect, useCallback } from "react";
import { X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { IOrder, OrderStatus, PaymentStatus } from "@/types"; // Ensure types are imported
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

interface OrderManagementProps {
  showMessage: (type: "success" | "error", text: string) => void;
}

const OrderManagement: React.FC<OrderManagementProps> = ({ showMessage }) => {
  const [orders, setOrders] = useState<IOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [currentOrder, setCurrentOrder] = useState<IOrder | null>(null);
  const [updatedOrderStatus, setUpdatedOrderStatus] = useState<
    OrderStatus | ""
  >("");
  const [updatedPaymentStatus, setUpdatedPaymentStatus] = useState<
    PaymentStatus | ""
  >("");
  const [updatedIsPaid, setUpdatedIsPaid] = useState<boolean>(false);

  const orderStatusOptions: OrderStatus[] = [
    "pending",
    "processing",
    "shipped",
    "delivered",
    "cancelled",
    "refunded",
    "completed" 
  ];
  const paymentStatusOptions: PaymentStatus[] = [
    "pending",
    "paid",
    "failed",
    "refunded",
  ];

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/orders");
      const data = await response.json();
      if (data.success) {
        setOrders(data.data);
      } else {
        setError(data.message || "Failed to fetch orders.");
        showMessage("error", data.message || "Failed to fetch orders.");
      }
    } catch (err: any) {
      setError(err.message || "Network error fetching orders.");
      showMessage("error", err.message || "Network error fetching orders.");
    } finally {
      setLoading(false);
    }
  }, [showMessage]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const openEditModal = (order: IOrder) => {
    setCurrentOrder(order);
    setUpdatedOrderStatus(order.orderStatus);
    setUpdatedPaymentStatus(order.paymentStatus);
    setUpdatedIsPaid(order.isPaid);
    setIsEditModalOpen(true);
  };

  const handleUpdateOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentOrder?._id) return;

    setLoading(true);
    try {
      const updateData: Partial<IOrder> = {
        orderStatus: updatedOrderStatus || undefined,
        paymentStatus: updatedPaymentStatus || undefined,
        isPaid: updatedIsPaid,
        paidAt:
          updatedIsPaid && !currentOrder.paidAt
            ? new Date()
            : currentOrder.paidAt,
      };

      const response = await fetch(
        `/api/orders/${formatObjectId(currentOrder._id)}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(updateData),
        }
      );
      const data = await response.json();
      if (data.success) {
        showMessage("success", "Order updated successfully!");
        setIsEditModalOpen(false);
        setCurrentOrder(null);
        fetchOrders();
      } else {
        showMessage("error", data.message || "Failed to update order.");
      }
    } catch (err: any) {
      showMessage("error", err.message || "Network error updating order.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex justify-between items-center mb-6 border-b pb-4">
        <h2 className="text-2xl font-bold text-primary">Order List</h2>
      </div>

      {loading && (
        <p className="text-gray-600 py-8 text-center">Loading orders...</p>
      )}
      {error && <p className="text-red-600 py-8 text-center">Error: {error}</p>}

      {!loading && !error && orders.length === 0 && (
        <p className="text-gray-600 py-8 text-center">No orders found.</p>
      )}

      {!loading && !error && orders.length > 0 && (
        <div className="overflow-x-auto rounded-lg shadow-md border border-gray-200">
          <table className="min-w-full bg-white">
            <thead className="bg-primary text-white">
              <tr>
                <th className="py-3 px-4 text-left text-sm font-semibold rounded-tl-lg">
                  Order ID
                </th>
                <th className="py-3 px-4 text-left text-sm font-semibold">
                  User
                </th>
                <th className="py-3 px-4 text-left text-sm font-semibold">
                  Total
                </th>
                <th className="py-3 px-4 text-left text-sm font-semibold">
                  Order Status
                </th>
                <th className="py-3 px-4 text-left text-sm font-semibold">
                  Payment Status
                </th>
                <th className="py-3 px-4 text-left text-sm font-semibold">
                  Paid
                </th>
                <th className="py-3 px-4 text-left text-sm font-semibold rounded-tr-lg">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr
                  key={formatObjectId(order._id!)}
                  className="border-b border-gray-200 hover:bg-gray-50 transition-colors duration-150"
                >
                  {/* FULL Order ID */}
                  <td className="py-3 px-4 text-gray-800 text-sm font-medium">
                    {formatObjectId(order._id!)}
                  </td>
                  <td className="py-3 px-4 text-gray-700 text-sm">
                    {order.userId
                      ? (order.userId as any).email ||
                        formatObjectId(order.userId)
                      : "N/A"}
                  </td>
                  <td className="py-3 px-4 text-gray-700 text-sm">
                    ${order.totalPrice.toFixed(2)}
                  </td>
                  {/* Conditional coloring for Order Status */}
                  <td
                    className={`py-3 px-4 text-sm capitalize font-medium ${
                      order.orderStatus === "cancelled"
                        ? "text-red-600"
                        : "text-gray-700"
                    }`}
                  >
                    {order.orderStatus}
                  </td>
                  <td className="py-3 px-4 text-gray-700 text-sm capitalize">
                    {order.paymentStatus}
                  </td>
                  <td className="py-3 px-4 text-gray-700 text-sm">
                    {order.isPaid ? "Yes" : "No"}
                  </td>
                  <td className="py-3 px-4 text-sm">
                    {/* No action button if status is cancelled */}
                    {order.orderStatus !== "cancelled" ? (
                      <button
                        onClick={() => openEditModal(order)}
                        className="bg-secondary hover:bg-secondary-dark text-white font-semibold py-1 px-3 rounded-md transition duration-300 shadow-sm"
                      >
                        Edit Status
                      </button>
                    ) : (
                      <span className="text-gray-500 italic">No actions</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Order Edit Modal */}
      <AnimatePresence>
        {isEditModalOpen && currentOrder && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              transition={{ duration: 0.3 }}
              className="bg-white rounded-lg p-8 w-full max-w-md shadow-2xl relative"
            >
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 transition-colors"
              >
                <X size={24} />
              </button>
              <h3 className="text-2xl font-bold text-primary mb-6 border-b pb-3">
                Edit Order Status
              </h3>
              <form onSubmit={handleUpdateOrder} className="space-y-6">
                <div>
                  <label
                    htmlFor="orderStatus"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Order Status
                  </label>
                  <select
                    id="orderStatus"
                    name="orderStatus"
                    value={updatedOrderStatus}
                    onChange={(e) =>
                      setUpdatedOrderStatus(e.target.value as OrderStatus)
                    }
                    className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-secondary focus:border-secondary sm:text-sm capitalize"
                  >
                    {orderStatusOptions.map((status) => (
                      <option key={status} value={status}>
                        {status}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label
                    htmlFor="paymentStatus"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Payment Status
                  </label>
                  <select
                    id="paymentStatus"
                    name="paymentStatus"
                    value={updatedPaymentStatus}
                    onChange={(e) =>
                      setUpdatedPaymentStatus(e.target.value as PaymentStatus)
                    }
                    className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-secondary focus:border-secondary sm:text-sm capitalize"
                  >
                    {paymentStatusOptions.map((status) => (
                      <option key={status} value={status}>
                        {status}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="flex items-center pt-2">
                  <input
                    type="checkbox"
                    id="isPaid"
                    name="isPaid"
                    checked={updatedIsPaid}
                    onChange={(e) => setUpdatedIsPaid(e.target.checked)}
                    className="h-5 w-5 text-secondary focus:ring-secondary border-gray-300 rounded"
                  />
                  <label
                    htmlFor="isPaid"
                    className="ml-2 block text-base text-gray-900"
                  >
                    Is Paid
                  </label>
                </div>
                <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
                  <button
                    type="button"
                    onClick={() => setIsEditModalOpen(false)}
                    className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-5 rounded-md shadow-sm transition duration-300"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="bg-secondary hover:bg-secondary-dark text-white font-bold py-2 px-5 rounded-md shadow-md transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={loading}
                  >
                    {loading ? "Updating..." : "Update Order"}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default OrderManagement;