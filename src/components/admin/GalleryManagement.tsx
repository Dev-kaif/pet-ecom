// src/components/admin/GalleryManagement.tsx
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { Plus, X, UploadCloud, Loader2 } from "lucide-react"; // Import new icons
import { motion, AnimatePresence } from "framer-motion";
import { IGalleryImage } from "@/types";
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

interface GalleryManagementProps {
  showMessage: (type: "success" | "error", text: string) => void;
}

// Define the shape of data for adding/editing a gallery image
type GalleryImageData = Omit<
  IGalleryImage,
  | "_id"
  | "createdAt"
  | "updatedAt"
> & {
  imageUrl: string;
};

// --- Cloudinary Configuration (Replace with your actual values, ideally from environment variables) ---
const CLOUDINARY_CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || "your_cloudinary_cloud_name"; // e.g., "dqxxxxxxx"
const CLOUDINARY_UPLOAD_PRESET = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || "your_cloudinary_upload_preset"; // e.g., "ml_default"

const GalleryManagement: React.FC<GalleryManagementProps> = ({
  showMessage,
}) => {
  const [galleryImages, setGalleryImages] = useState<IGalleryImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentGalleryImage, setCurrentGalleryImage] = useState<IGalleryImage | null>(null);
  const [newGalleryImageData, setNewGalleryImageData] = useState<GalleryImageData>({
    imageUrl: "",
  });

  // State for Cloudinary upload
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadError, setUploadError] = useState<string | null>(null);

  // Callback to fetch gallery images from the backend
  const fetchGalleryImages = useCallback(async (page: number = 1) => { // Added default page for initial fetch
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/gallery?page=${page}&limit=9`); // Use the gallery API endpoint
      const data = await response.json();
      if (data.success) {
        setGalleryImages(data.data);
      } else {
        setError(data.message || "Failed to fetch gallery images.");
        showMessage("error", data.message || "Failed to fetch gallery images.");
      }
    } catch (err: any) {
      setError(err.message || "Network error fetching gallery images.");
      showMessage("error", err.message || "Network error fetching gallery images.");
    } finally {
      setLoading(false);
    }
  }, [showMessage]);

  // Fetch images on component mount
  useEffect(() => {
    fetchGalleryImages();
  }, [fetchGalleryImages]);

  // Handle file selection for Cloudinary upload
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
      setUploadError(null); // Clear previous upload errors
    } else {
      setSelectedFile(null);
    }
  };

  // Function to upload the selected file to Cloudinary
  const uploadToCloudinary = async () => {
    if (!selectedFile) {
      setUploadError("No file selected.");
      return;
    }

    if (!CLOUDINARY_CLOUD_NAME || CLOUDINARY_CLOUD_NAME === "your_cloudinary_cloud_name") {
        setUploadError("Cloudinary cloud name is not configured.");
        showMessage("error", "Cloudinary cloud name is not configured. Please check environment variables.");
        return;
    }
    if (!CLOUDINARY_UPLOAD_PRESET || CLOUDINARY_UPLOAD_PRESET === "your_cloudinary_upload_preset") {
        setUploadError("Cloudinary upload preset is not configured.");
        showMessage("error", "Cloudinary upload preset is not configured. Please check environment variables.");
        return;
    }


    setIsUploading(true);
    setUploadProgress(0);
    setUploadError(null);

    const formData = new FormData();
    formData.append("file", selectedFile);
    formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);

    try {
      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
        {
          method: "POST",
          body: formData,
          // You can add an onProgress callback here if you want to show real-time progress,
          // but it's more complex with standard fetch API.
          // For advanced progress, consider libraries like Axios or a custom XHR.
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error.message || "Cloudinary upload failed.");
      }

      const data = await response.json();
      setNewGalleryImageData((prev) => ({ ...prev, imageUrl: data.secure_url }));
      showMessage("success", "Image uploaded to Cloudinary successfully!");
      setSelectedFile(null); // Clear selected file after successful upload
      setUploadProgress(100); // Set to 100% on success
    } catch (err: any) {
      setUploadError(err.message || "Failed to upload image to Cloudinary.");
      showMessage("error", err.message || "Failed to upload image to Cloudinary.");
      setNewGalleryImageData((prev) => ({ ...prev, imageUrl: "" })); // Clear image URL on failure
    } finally {
      setIsUploading(false);
    }
  };

  // Handle adding a new gallery image
  const handleAddGalleryImage = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (!newGalleryImageData.imageUrl.trim()) {
      showMessage("error", "Please upload an image or provide an Image URL.");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch("/api/gallery", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          imageUrl: newGalleryImageData.imageUrl,
        }),
      });
      const data = await response.json();
      if (data.success) {
        showMessage("success", "Gallery image added successfully!");
        setNewGalleryImageData({ imageUrl: "" });
        setSelectedFile(null); // Clear selected file
        setUploadProgress(0); // Reset progress
        setIsModalOpen(false);
        fetchGalleryImages();
      } else {
        showMessage("error", data.message || "Failed to add gallery image.");
      }
    } catch (err: any) {
      showMessage("error", err.message || "Network error adding gallery image.");
    } finally {
      setLoading(false);
    }
  };

  // Handle editing an existing gallery image
  const handleEditGalleryImage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentGalleryImage?._id) return;

    setLoading(true);

    if (!newGalleryImageData.imageUrl.trim()) {
      showMessage("error", "Image URL cannot be empty for update.");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(
        `/api/gallery/${formatObjectId(currentGalleryImage._id)}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            imageUrl: newGalleryImageData.imageUrl,
          }),
        }
      );
      const data = await response.json();
      if (data.success) {
        showMessage("success", "Gallery image updated successfully!");
        setIsModalOpen(false);
        setCurrentGalleryImage(null);
        setSelectedFile(null); // Clear selected file
        setUploadProgress(0); // Reset progress
        fetchGalleryImages();
      } else {
        showMessage("error", data.message || "Failed to update gallery image.");
      }
    } catch (err: any) {
      showMessage("error", err.message || "Network error updating gallery image.");
    } finally {
      setLoading(false);
    }
  };

  // Handle deleting a gallery image
  const handleDeleteGalleryImage = async (imageId: string) => {
    if (!imageId) {
      showMessage("error", "Gallery Image ID is missing.");
      return;
    }
    const confirmDelete = window.confirm("Are you sure you want to delete this gallery image?");
    if (!confirmDelete) return;

    setLoading(true);
    try {
      const response = await fetch(`/api/gallery/${imageId}`, {
        method: "DELETE",
      });
      const data = await response.json();
      if (data.success) {
        showMessage("success", "Gallery image deleted successfully!");
        fetchGalleryImages();
      } else {
        showMessage("error", data.message || "Failed to delete gallery image.");
      }
    } catch (err: any) {
      showMessage("error", err.message || "Network error deleting gallery image.");
    } finally {
      setLoading(false);
    }
  };

  // Open the modal for adding a new image
  const openAddModal = () => {
    setCurrentGalleryImage(null);
    setNewGalleryImageData({ imageUrl: "" });
    setSelectedFile(null);
    setUploadProgress(0);
    setIsUploading(false);
    setUploadError(null);
    setIsModalOpen(true);
  };

  // Open the modal for editing an existing image
  const openEditModal = (image: IGalleryImage) => {
    setCurrentGalleryImage(image);
    setNewGalleryImageData({ imageUrl: image.imageUrl }); // Pre-fill with existing URL
    setSelectedFile(null);
    setUploadProgress(0);
    setIsUploading(false);
    setUploadError(null);
    setIsModalOpen(true);
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
      <div className="flex justify-between items-center mb-6 border-b pb-4">
        <h2 className="text-2xl font-bold text-primary">Gallery Image List</h2>
        <button
          onClick={openAddModal}
          className="bg-secondary hover:bg-secondary-dark text-white font-bold py-2 px-6 rounded-lg shadow-md transition duration-300 flex items-center"
        >
          <Plus size={20} className="mr-2" /> Add New Image
        </button>
      </div>

      {loading && (
        <p className="text-gray-600 py-8 text-center">Loading gallery images...</p>
      )}
      {error && <p className="text-red-600 py-8 text-center">Error: {error}</p>}

      {!loading && !error && galleryImages.length === 0 && (
        <p className="text-gray-600 py-8 text-center">
          No gallery images found. Add one!
        </p>
      )}

      {!loading && !error && galleryImages.length > 0 && (
        <div className="overflow-x-auto rounded-lg shadow-md border border-gray-200">
          <table className="min-w-full bg-white">
            <thead className="bg-primary text-white">
              <tr>
                <th className="py-3 px-4 text-left text-sm font-semibold rounded-tl-lg">
                  Image
                </th>
                <th className="py-3 px-4 text-left text-sm font-semibold">
                  Image URL
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
              {galleryImages.map((image) => (
                <tr
                  key={formatObjectId(image._id)}
                  className="border-b border-gray-200 hover:bg-gray-50 transition-colors duration-150"
                >
                  <td className="py-3 px-4 text-gray-800 text-sm font-medium">
                    <div className="w-20 h-20 rounded-md overflow-hidden border border-gray-300 flex items-center justify-center bg-gray-100">
                      <Image
                        src={image.imageUrl}
                        alt="Gallery Image"
                        unoptimized
                        height={80}
                        width={80}
                        objectFit="cover"
                        className="object-cover w-full h-full"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src =
                            "https://placehold.co/80x80/e0e0e0/555555?text=Invalid";
                        }}
                      />
                    </div>
                  </td>
                  <td className="py-3 px-4 text-gray-700 text-sm max-w-xs truncate">
                    {image.imageUrl}
                  </td>
                  <td className="py-3 px-4 text-gray-700 text-sm">
                    {image.createdAt ? new Date(image.createdAt).toLocaleDateString() : "N/A"}
                  </td>
                  <td className="py-3 px-4 text-sm flex gap-2">
                    <button
                      onClick={() => openEditModal(image)}
                      className="bg-yellow-500 hover:bg-yellow-600 text-white font-semibold py-1 px-3 rounded-md transition duration-300 shadow-sm"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() =>
                        handleDeleteGalleryImage(formatObjectId(image._id))
                      }
                      className="bg-red-500 hover:bg-red-600 text-white font-semibold py-1 px-3 rounded-md transition duration-300 shadow-sm"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Gallery Image Add/Edit Modal */}
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
                {currentGalleryImage ? "Edit Gallery Image" : "Add New Gallery Image"}
              </h3>
              <div className="overflow-y-auto pr-2 custom-scrollbar">
                <form
                  onSubmit={
                    currentGalleryImage ? handleEditGalleryImage : handleAddGalleryImage
                  }
                  className="space-y-6"
                >
                  {/* Cloudinary Upload Section */}
                  <div className="border border-gray-200 p-4 rounded-md bg-gray-50">
                    <p className="text-lg font-semibold text-primary mb-4">
                      Upload Image to Cloudinary
                    </p>
                    <div className="flex items-center space-x-2 mb-4">
                      <input
                        type="file"
                        id="imageUpload"
                        name="imageUpload"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 focus:outline-none file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-secondary file:text-white hover:file:bg-secondary-dark"
                      />
                      <button
                        type="button"
                        onClick={uploadToCloudinary}
                        disabled={!selectedFile || isUploading}
                        className="p-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                      >
                        {isUploading ? <Loader2 size={20} className="animate-spin" /> : <UploadCloud size={20} />}
                      </button>
                    </div>

                    {isUploading && (
                      <div className="w-full bg-gray-200 rounded-full h-2.5 mb-2">
                        <div
                          className="bg-green-400 h-2.5 rounded-full"
                          style={{ width: `${uploadProgress}%` }}
                        ></div>
                      </div>
                    )}
                    {uploadError && (
                      <p className="text-red-500 text-sm mt-1">{uploadError}</p>
                    )}
                    {newGalleryImageData.imageUrl && !isUploading && !uploadError && (
                      <p className="text-green-600 text-sm mt-1">
                        Image uploaded. URL: {newGalleryImageData.imageUrl.substring(0, 50)}...
                      </p>
                    )}
                  </div>

                  {/* Displaying the Image URL (read-only) */}
                  <div>
                    <label
                      htmlFor="imageUrl"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Image URL (Automatically populated after upload)
                    </label>
                    <input
                      type="url"
                      id="imageUrl"
                      name="imageUrl"
                      value={newGalleryImageData.imageUrl}
                      readOnly // Make it read-only
                      required
                      className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm bg-gray-100 cursor-not-allowed sm:text-sm"
                      placeholder="Upload an image above"
                    />
                    {/* Image Preview */}
                    {newGalleryImageData.imageUrl && (
                      <div className="mt-3 w-48 h-48 rounded-lg overflow-hidden border border-gray-300 flex items-center justify-center bg-gray-100 shadow-sm">
                        <Image
                          src={newGalleryImageData.imageUrl}
                          alt="Image Preview"
                          unoptimized
                          height={192}
                          width={192}
                          objectFit="cover"
                          className="object-cover w-full h-full"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src =
                              "https://placehold.co/192x192/e0e0e0/555555?text=Invalid+URL";
                          }}
                        />
                      </div>
                    )}
                  </div>

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
                      disabled={loading || isUploading || !newGalleryImageData.imageUrl.trim()}
                    >
                      {loading || isUploading
                        ? "Saving..."
                        : currentGalleryImage
                        ? "Update Image"
                        : "Add Image"}
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

export default GalleryManagement;
