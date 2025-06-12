// src/components/admin/AppointmentManagement.tsx

/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect, useCallback } from "react";
import { X, Eye, ThumbsUp, XCircle, Loader2, Trash2 } from "lucide-react"; // Removed Plus icon
import { motion, AnimatePresence } from "framer-motion";
import { IReservation } from "@/types";
import { Types } from "mongoose";

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

interface AppointmentManagementProps {
  showMessage: (type: "success" | "error", text: string) => void;
}

// Define the shape of data for updating an existing reservation (admin's perspective)
type UpdateReservationData = {
  status?: IReservation["status"];
  adminNotes?: string;
  // You might add other fields here if admin can edit them, e.g., fullName, date
};

const AppointmentManagement: React.FC<AppointmentManagementProps> = ({
  showMessage,
}) => {
  const [reservations, setReservations] = useState<IReservation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentReservation, setCurrentReservation] = useState<IReservation | null>(null);

  // State for editing form data (no "add" specific fields needed anymore)
  const [formReservationData, setFormReservationData] = useState<
    UpdateReservationData
  >({
    status: "pending",
    adminNotes: "",
  });

  // Pagination and Filtering states
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [, setTotalItems] = useState(0);
  const [statusFilter, setStatusFilter] = useState<IReservation['status'] | 'all'>('all');
  const itemsPerPage = 15; // Consistent with backend limit

  // Callback to fetch reservations from the backend
  const fetchReservations = useCallback(async (page: number, filter: IReservation['status'] | 'all') => {
    setLoading(true);
    setError(null);
    try {
      let url = `/api/reservation?page=${page}&limit=${itemsPerPage}`;
      if (filter !== 'all') {
        url += `&status=${filter}`;
      }
      const response = await fetch(url);
      const data = await response.json();

      if (data.success) {
        setReservations(data.data);
        setTotalPages(data.pagination.totalPages);
        setTotalItems(data.pagination.totalItems);
      } else {
        setError(data.message || "Failed to fetch reservations.");
        showMessage("error", data.message || "Failed to fetch reservations.");
      }
    } catch (err: any) {
      setError(err.message || "Network error fetching reservations.");
      showMessage("error", err.message || "Network error fetching reservations.");
    } finally {
      setLoading(false);
    }
  }, [showMessage, itemsPerPage]);

  // Fetch reservations on component mount and when filters/page change
  useEffect(() => {
    fetchReservations(currentPage, statusFilter);
  }, [fetchReservations, currentPage, statusFilter]);

  // Handle pagination clicks
  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  // Handle status filter change
  const handleStatusFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setStatusFilter(e.target.value as IReservation['status'] | 'all');
    setCurrentPage(1); // Reset to first page when filter changes
  };

  // Handle form field changes
  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormReservationData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  // Removed handleAddReservation function completely

  // Handle updating an existing reservation (e.g., adminNotes or status from modal)
  const handleEditReservation = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentReservation?._id) return;

    setLoading(true);
    const dataToSend = formReservationData as UpdateReservationData;

    try {
      const response = await fetch(
        `/api/reservation/${formatObjectId(currentReservation._id)}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(dataToSend),
        }
      );
      const data = await response.json();
      if (data.success) {
        showMessage("success", "Reservation updated successfully!");
        setIsModalOpen(false);
        setCurrentReservation(null);
        setFormReservationData({ status: "pending", adminNotes: "" }); // Reset form
        fetchReservations(currentPage, statusFilter); // Re-fetch current page with filter
      } else {
        showMessage("error", data.message || "Failed to update reservation.");
      }
    } catch (err: any) {
      showMessage("error", err.message || "Network error updating reservation.");
    } finally {
      setLoading(false);
    }
  };

  // Handle confirming or cancelling an appointment directly from the table
  const handleUpdateStatus = async (reservationId: string, newStatus: IReservation['status']) => {
    if (!reservationId) {
      showMessage("error", "Reservation ID is missing.");
      return;
    }
    const actionText = newStatus === 'confirmed' ? 'confirm' : 'cancel';
    const confirmAction = window.confirm(`Are you sure you want to ${actionText} this reservation?`);
    if (!confirmAction) return;

    setLoading(true);
    try {
      const response = await fetch(
        `/api/reservation/${reservationId}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status: newStatus }), // Only send the status update
        }
      );
      const data = await response.json();
      if (data.success) {
        showMessage("success", `Reservation ${actionText}ed successfully!`);
        fetchReservations(currentPage, statusFilter); // Re-fetch to update status in table
      } else {
        showMessage("error", data.message || `Failed to ${actionText} reservation.`);
      }
    } catch (err: any) {
      showMessage("error", err.message || `Network error ${actionText}ing reservation.`);
    } finally {
      setLoading(false);
    }
  };

  // Handle deleting a reservation
  const handleDeleteReservation = async (reservationId: string) => {
    if (!reservationId) {
      showMessage("error", "Reservation ID is missing.");
      return;
    }
    const confirmDelete = window.confirm("Are you sure you want to delete this reservation?");
    if (!confirmDelete) return;

    setLoading(true);
    try {
      const response = await fetch(`/api/reservation/${reservationId}`, {
        method: "DELETE",
      });
      const data = await response.json();
      if (data.success) {
        showMessage("success", "Reservation deleted successfully!");
        fetchReservations(currentPage, statusFilter); // Re-fetch current page with filter
      } else {
        showMessage("error", data.message || "Failed to delete reservation.");
      }
    } catch (err: any) {
      showMessage("error", err.message || "Network error deleting reservation.");
    } finally {
      setLoading(false);
    }
  };

  // Removed openAddModal function

  // Open the modal for viewing details and editing notes/status
  const openDetailsEditModal = (reservation: IReservation) => {
    setCurrentReservation(reservation); // Set the current reservation to populate modal
    setFormReservationData({
      status: reservation.status, // Pre-fill status for potential change
      adminNotes: reservation.adminNotes || "", // Pre-fill with existing notes
    });
    setIsModalOpen(true);
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 border-b pb-4">
        <h2 className="text-2xl font-bold text-primary mb-4 sm:mb-0">Appointment List</h2>
        <div className="flex items-center space-x-4">
          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={handleStatusFilterChange}
            className="px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-secondary focus:border-secondary transition duration-150 ease-in-out text-sm"
          >
            <option value="all">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="confirmed">Confirmed</option>
            <option value="cancelled">Cancelled</option>
            <option value="completed">Completed</option>
          </select>
          {/* Removed "Add New Appointment" button */}
        </div>
      </div>

      {loading && (
        <div className="flex justify-center items-center py-8">
          <Loader2 className="animate-spin text-secondary mr-2" size={24} />
          <p className="text-gray-600">Loading appointments...</p>
        </div>
      )}
      {error && <p className="text-red-600 py-8 text-center">Error: {error}</p>}

      {!loading && !error && reservations.length === 0 && (
        <p className="text-gray-600 py-8 text-center">
          No appointments found.
        </p>
      )}

      {!loading && !error && reservations.length > 0 && (
        <div className="overflow-x-auto rounded-lg shadow-md border border-gray-200">
          <table className="min-w-full bg-white">
            <thead className="bg-primary text-white">
              <tr>
                <th className="py-3 px-4 text-left text-sm font-semibold rounded-tl-lg">
                  Full Name
                </th>
                <th className="py-3 px-4 text-left text-sm font-semibold">
                  Date
                </th>
                <th className="py-3 px-4 text-left text-sm font-semibold">
                  Species
                </th>
                <th className="py-3 px-4 text-left text-sm font-semibold">
                  Reason
                </th>
                <th className="py-3 px-4 text-left text-sm font-semibold">
                  Status
                </th>
                <th className="py-3 px-4 text-left text-sm font-semibold">
                  Created At
                </th>
                <th className="py-3 px-4 text-left text-sm font-semibold rounded-tr-lg">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {reservations.map((reservation) => (
                <tr
                  key={formatObjectId(reservation._id)}
                  className="border-b border-gray-200 hover:bg-gray-50 transition-colors duration-150"
                >
                  <td className="py-3 px-4 text-gray-800 text-sm font-medium">
                    {reservation.fullName}
                  </td>
                  <td className="py-3 px-4 text-gray-700 text-sm">
                    {reservation.date}
                  </td>
                  <td className="py-3 px-4 text-gray-700 text-sm">
                    {reservation.species} ({reservation.breed})
                  </td>
                  <td className="py-3 px-4 text-gray-700 text-sm">
                    {reservation.reason}
                  </td>
                  <td className="py-3 px-4 text-sm">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-semibold
                        ${reservation.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : ''}
                        ${reservation.status === 'confirmed' ? 'bg-green-100 text-green-800' : ''}
                        ${reservation.status === 'cancelled' ? 'bg-red-100 text-red-800' : ''}
                        ${reservation.status === 'completed' ? 'bg-blue-100 text-blue-800' : ''}
                      `}
                    >
                      {reservation.status.charAt(0).toUpperCase() + reservation.status.slice(1)}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-gray-700 text-sm">
                    {reservation.createdAt ? new Date(reservation.createdAt).toLocaleDateString() : "N/A"}
                  </td>
                  <td className="py-3 px-4 text-sm flex gap-2">
                    {/* Confirm Button */}
                    {reservation.status === 'pending' && (
                      <button
                        onClick={() => handleUpdateStatus(formatObjectId(reservation._id), 'confirmed')}
                        className="bg-green-500 hover:bg-green-600 text-white font-semibold py-1 px-3 rounded-md transition duration-300 shadow-sm flex items-center"
                        disabled={loading}
                      >
                        <ThumbsUp size={16} className="mr-1" /> Confirm
                      </button>
                    )}
                    {/* Cancel Button */}
                    {reservation.status !== 'cancelled' && reservation.status !== 'completed' && (
                      <button
                        onClick={() => handleUpdateStatus(formatObjectId(reservation._id), 'cancelled')}
                        className="bg-orange-500 hover:bg-orange-600 text-white font-semibold py-1 px-3 rounded-md transition duration-300 shadow-sm flex items-center"
                        disabled={loading}
                      >
                        <XCircle size={16} className="mr-1" /> Cancel
                      </button>
                    )}
                    {/* View Details / Edit Notes Button */}
                    <button
                      onClick={() => openDetailsEditModal(reservation)}
                      className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-1 px-3 rounded-md transition duration-300 shadow-sm flex items-center"
                    >
                      <Eye size={16} className="mr-1" /> Details / Notes
                    </button>
                    {/* Delete Button */}
                    <button
                      onClick={() =>
                        handleDeleteReservation(formatObjectId(reservation._id))
                      }
                      className="bg-red-500 hover:bg-red-600 text-white font-semibold py-1 px-3 rounded-md transition duration-300 shadow-sm flex items-center"
                    >
                      <Trash2 size={16} className="mr-1" /> Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center space-x-2 mt-6">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1 || loading}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
          </button>
          <span className="text-gray-700">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages || loading}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next
          </button>
        </div>
      )}

      {/* Appointment Edit Modal */}
      <AnimatePresence>
        {isModalOpen && (
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
              className="bg-white rounded-lg p-8 w-full max-w-xl shadow-2xl relative flex flex-col max-h-[90vh]"
            >
              <button
                onClick={() => setIsModalOpen(false)}
                className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 transition-colors"
              >
                <X size={24} />
              </button>
              <h3 className="text-2xl font-bold text-primary mb-6 border-b pb-3">
                Appointment Details / Edit Notes
              </h3>
              <div className="overflow-y-auto pr-2 custom-scrollbar">
                <form
                  onSubmit={handleEditReservation} // Always handleEditReservation
                  className="space-y-6"
                >
                  {/* Fields for editing an existing reservation (status/admin notes, with context) */}
                  <>
                    <div>
                      <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
                        Status
                      </label>
                      <select
                        id="status"
                        name="status"
                        value={formReservationData.status || ''}
                        onChange={handleFormChange}
                        required
                        className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-secondary focus:border-secondary sm:text-sm"
                      >
                        <option value="pending">Pending</option>
                        <option value="confirmed">Confirmed</option>
                        <option value="cancelled">Cancelled</option>
                        <option value="completed">Completed</option>
                      </select>
                    </div>
                    <div>
                      <label htmlFor="adminNotes" className="block text-sm font-medium text-gray-700 mb-1">
                        Admin Notes
                      </label>
                      <textarea
                        id="adminNotes"
                        name="adminNotes"
                        rows={4}
                        value={formReservationData.adminNotes || ''}
                        onChange={handleFormChange}
                        className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-secondary focus:border-secondary sm:text-sm"
                        placeholder="Add any internal notes about this appointment..."
                      ></textarea>
                    </div>
                    {/* Display key reservation details for context */}
                    {currentReservation && ( // Ensure currentReservation exists before displaying details
                      <div className="border-t border-gray-200 pt-4">
                        <h4 className="text-md font-semibold text-gray-800 mb-2">Original Details:</h4>
                        <p className="text-sm text-gray-600"><strong>Name:</strong> {currentReservation.fullName}</p>
                        <p className="text-sm text-gray-600"><strong>Email:</strong> {currentReservation.email}</p>
                        <p className="text-sm text-gray-600"><strong>Phone:</strong> {currentReservation.phone}</p>
                        <p className="text-sm text-gray-600"><strong>Date:</strong> {currentReservation.date}</p>
                        <p className="text-sm text-gray-600"><strong>Pet:</strong> {currentReservation.species} ({currentReservation.breed})</p>
                        <p className="text-sm text-gray-600"><strong>Reason:</strong> {currentReservation.reason}</p>
                        {currentReservation.specialNote && <p className="text-sm text-gray-600"><strong>Special Note:</strong> {currentReservation.specialNote}</p>}
                        <p className="text-sm text-gray-600"><strong>Created At:</strong> {currentReservation.createdAt ? new Date(currentReservation.createdAt).toLocaleString() : "N/A"}</p>
                        {currentReservation.updatedAt && <p className="text-sm text-gray-600"><strong>Last Updated:</strong> {new Date(currentReservation.updatedAt).toLocaleString()}</p>}
                      </div>
                    )}
                  </>

                  <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
                    <button
                      type="button"
                      onClick={() => setIsModalOpen(false)}
                      className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-5 rounded-md shadow-sm transition duration-300"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="bg-secondary hover:bg-secondary-dark text-white font-bold py-2 px-5 rounded-md shadow-md transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                      disabled={loading}
                    >
                      {loading ? "Saving..." : "Save Changes"}
                    </button>
                  </div>
                </form>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AppointmentManagement;