// src/components/admin/ProductManagement.tsx
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { Plus, X, UploadCloud, Loader2 } from "lucide-react"; // Import new icons
import { motion, AnimatePresence } from "framer-motion";
import { IProduct } from "@/types"; // Ensure IProduct is imported from your types file
import { Types } from "mongoose"; // For formatting ObjectId
import { CLOUDINARY_CLOUD_NAME, CLOUDINARY_UPLOAD_PRESET } from "@/backend/lib/config";

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

interface ProductManagementProps {
  showMessage: (type: "success" | "error", text: string) => void;
}

type ProductFormData = Omit<
  IProduct,
  | "_id"
  | "createdAt"
  | "updatedAt"
  | "reviewsCount"
  | "isNewlyReleased"
  | "isOnSale"
> & {
  images: string[];
};

const ProductManagement: React.FC<ProductManagementProps> = ({
  showMessage,
}) => {
  const [products, setProducts] = useState<IProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentProduct, setCurrentProduct] = useState<IProduct | null>(null);
  const [newProductData, setNewProductData] = useState<ProductFormData>({
    name: "",
    description: "",
    price: 0,
    oldPrice: undefined,
    category: "",
    images: [], // This will hold all image URLs (thumbnail + additional)
    stock: 0,
  });

  // State for Cloudinary upload for thumbnail
  const [selectedThumbnailFile, setSelectedThumbnailFile] =
    useState<File | null>(null);
  const [isThumbnailUploading, setIsThumbnailUploading] = useState(false);
  const [thumbnailUploadProgress, setThumbnailUploadProgress] = useState(0);
  const [thumbnailUploadError, setThumbnailUploadError] = useState<
    string | null
  >(null);

  // State for Cloudinary upload for additional images (single file input for adding one at a time)
  const [selectedAdditionalFile, setSelectedAdditionalFile] =
    useState<File | null>(null);
  const [isAdditionalUploading, setIsAdditionalUploading] = useState(false);
  const [additionalUploadProgress, setAdditionalUploadProgress] = useState(0);
  const [additionalUploadError, setAdditionalUploadError] = useState<
    string | null
  >(null);

  const MAX_IMAGES = 5; // Max images including thumbnail

  // Helper function to upload a file to Cloudinary
  const uploadFileToCloudinary = useCallback(
    async (file: File, type: "thumbnail" | "additional") => {
      if (!file) return null;

      const setUploading =
        type === "thumbnail"
          ? setIsThumbnailUploading
          : setIsAdditionalUploading;
      const setProgress =
        type === "thumbnail"
          ? setThumbnailUploadProgress
          : setAdditionalUploadProgress;
      const setError =
        type === "thumbnail"
          ? setThumbnailUploadError
          : setAdditionalUploadError;

      setUploading(true);
      setProgress(0);
      setError(null);

      if (
        !CLOUDINARY_CLOUD_NAME ||
        CLOUDINARY_CLOUD_NAME === "your_cloudinary_cloud_name"
      ) {
        setError("Cloudinary cloud name is not configured.");
        showMessage(
          "error",
          "Cloudinary cloud name is not configured. Please check environment variables."
        );
        setUploading(false);
        return null;
      }
      if (
        !CLOUDINARY_UPLOAD_PRESET ||
        CLOUDINARY_UPLOAD_PRESET === "your_cloudinary_upload_preset"
      ) {
        setError("Cloudinary upload preset is not configured.");
        showMessage(
          "error",
          "Cloudinary upload preset is not configured. Please check environment variables."
        );
        setUploading(false);
        return null;
      }

      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);

      try {
        // Fetch does not easily support progress events, so progress will be 0 or 100
        const response = await fetch(
          `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
          {
            method: "POST",
            body: formData,
          }
        );

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(
            errorData.error.message || "Cloudinary upload failed."
          );
        }

        const data = await response.json();
        setProgress(100); // Set to 100% on successful completion
        showMessage(
          "success",
          `${
            type === "thumbnail" ? "Thumbnail" : "Additional"
          } image uploaded successfully!`
        );
        return data.secure_url;
      } catch (err: any) {
        setError(err.message || "Failed to upload image to Cloudinary.");
        showMessage(
          "error",
          err.message ||
            `Failed to upload ${
              type === "thumbnail" ? "thumbnail" : "additional"
            } image.`
        );
        return null;
      } finally {
        setUploading(false);
      }
    },
    [showMessage]
  );

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/products");
      const data = await response.json();
      if (data.success) {
        setProducts(data.data);
      } else {
        setError(data.message || "Failed to fetch products.");
        showMessage("error", data.message || "Failed to fetch products.");
      }
    } catch (err: any) {
      setError(err.message || "Network error fetching products.");
      showMessage("error", err.message || "Network error fetching products.");
    } finally {
      setLoading(false);
    }
  }, [showMessage]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setNewProductData((prev) => ({
      ...prev,
      [name]:
        name === "price" || name === "oldPrice" || name === "stock"
          ? parseFloat(value) || 0
          : value,
    }));
  };

  // Handle file selection for thumbnail
  const handleThumbnailFileChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedThumbnailFile(e.target.files[0]);
      setThumbnailUploadError(null);
    } else {
      setSelectedThumbnailFile(null);
    }
  };

  // Handle file selection for additional image
  const handleAdditionalFileChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedAdditionalFile(e.target.files[0]);
      setAdditionalUploadError(null);
    } else {
      setSelectedAdditionalFile(null);
    }
  };

  // Trigger thumbnail upload
  const handleThumbnailUploadClick = async () => {
    if (selectedThumbnailFile) {
      const url = await uploadFileToCloudinary(
        selectedThumbnailFile,
        "thumbnail"
      );
      if (url) {
        setNewProductData((prev) => ({
          ...prev,
          images: [url, ...prev.images.slice(currentProduct ? 1 : 0)].filter(
            Boolean
          ), // Ensure thumbnail is first
        }));
        setSelectedThumbnailFile(null); // Clear file input
      }
    }
  };

  // Trigger additional image upload and add to array
  const handleAddAdditionalImageClick = async () => {
    if (selectedAdditionalFile) {
      const currentImagesCount = newProductData.images.length;
      const thumbnailExists =
        newProductData.images.length > 0 &&
        newProductData.images[0].includes("cloudinary"); // Simple check if first image is a Cloudinary URL

      // Check if adding this image would exceed the limit
      if (currentImagesCount >= MAX_IMAGES) {
        showMessage(
          "error",
          `You can add a maximum of ${MAX_IMAGES} images (including thumbnail).`
        );
        return;
      }

      const url = await uploadFileToCloudinary(
        selectedAdditionalFile,
        "additional"
      );
      if (url) {
        // Prevent adding duplicate URLs
        if (newProductData.images.includes(url)) {
          showMessage("error", "This image URL is already added.");
          return;
        }

        setNewProductData((prev) => {
          // If thumbnail exists, put it first, then add the new URL, then the rest of images.
          // This handles cases where newProductData.images might already contain the thumbnail URL
          // from an edit operation, and we just need to append.
          const existingOtherImages = currentProduct
            ? prev.images.slice(1) // Keep existing additional images
            : prev.images; // If adding new, prev.images only contains thumbnail if just uploaded

          return {
            ...prev,
            images:
              thumbnailExists && prev.images[0]
                ? [prev.images[0], ...existingOtherImages, url].filter(Boolean)
                : [...existingOtherImages, url].filter(Boolean), // If no thumbnail or starting fresh
          };
        });
        setSelectedAdditionalFile(null); // Clear file input
      }
    }
  };

  const handleRemoveImageUrl = (urlToRemove: string) => {
    setNewProductData((prev) => ({
      ...prev,
      images: prev.images.filter((url) => url !== urlToRemove),
    }));
    // If the removed URL was the thumbnail, clear thumbnail input
    if (currentProduct?.images?.[0] === urlToRemove) {
      setNewProductData((prev) => ({
        ...prev,
        images: prev.images.filter((url) => url !== urlToRemove), // Remove it from the images array
      }));
    }
  };

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (newProductData.images.length === 0) {
      showMessage("error", "Please add at least one image.");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newProductData),
      });
      const data = await response.json();
      if (data.success) {
        showMessage("success", "Product added successfully!");
        setNewProductData({
          name: "",
          description: "",
          price: 0,
          oldPrice: undefined,
          category: "",
          images: [],
          stock: 0,
        });
        setSelectedThumbnailFile(null);
        setSelectedAdditionalFile(null);
        setIsModalOpen(false);
        fetchProducts();
      } else {
        showMessage("error", data.message || "Failed to add product.");
      }
    } catch (err: any) {
      showMessage("error", err.message || "Network error adding product.");
    } finally {
      setLoading(false);
    }
  };

  const handleEditProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentProduct?._id) return;

    setLoading(true);

    if (newProductData.images.length === 0) {
      showMessage("error", "Please add at least one image.");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(
        `/api/products/${formatObjectId(currentProduct._id)}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(newProductData),
        }
      );
      const data = await response.json();
      if (data.success) {
        showMessage("success", "Product updated successfully!");
        setIsModalOpen(false);
        setCurrentProduct(null);
        setSelectedThumbnailFile(null);
        setSelectedAdditionalFile(null);
        fetchProducts();
      } else {
        showMessage("error", data.message || "Failed to update product.");
      }
    } catch (err: any) {
      showMessage("error", err.message || "Network error updating product.");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteProduct = async (productId: string) => {
    if (!productId) {
      showMessage("error", "Product ID is missing.");
      return;
    }
    if (!window.confirm("Are you sure you want to delete this product?"))
      return;

    setLoading(true);
    try {
      const response = await fetch(`/api/products/${productId}`, {
        method: "DELETE",
      });
      const data = await response.json();
      if (data.success) {
        showMessage("success", "Product deleted successfully!");
        fetchProducts();
      } else {
        showMessage("error", data.message || "Failed to delete product.");
      }
    } catch (err: any) {
      showMessage("error", err.message || "Network error deleting product.");
    } finally {
      setLoading(false);
    }
  };

  const resetUploadStates = () => {
    setSelectedThumbnailFile(null);
    setIsThumbnailUploading(false);
    setThumbnailUploadProgress(0);
    setThumbnailUploadError(null);
    setSelectedAdditionalFile(null);
    setIsAdditionalUploading(false);
    setAdditionalUploadProgress(0);
    setAdditionalUploadError(null);
  };

  const openAddModal = () => {
    setCurrentProduct(null);
    setNewProductData({
      name: "",
      description: "",
      price: 0,
      oldPrice: undefined,
      category: "",
      images: [],
      stock: 0,
    });
    resetUploadStates();
    setIsModalOpen(true);
  };

  const openEditModal = (product: IProduct) => {
    setCurrentProduct(product);
    setNewProductData({
      name: product.name,
      description: product.description,
      price: product.price,
      oldPrice: product.oldPrice,
      category: product.category,
      images: product.images || [], // Use existing images directly
      stock: product.stock,
    });
    resetUploadStates();
    setIsModalOpen(true);
  };

  const currentThumbnailUrl = newProductData.images[0] || "";
  const currentAdditionalImages = newProductData.images.slice(1) || [];

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
      <div className="flex justify-between items-center mb-6 border-b pb-4">
        <h2 className="text-2xl font-bold text-primary">Product List</h2>
        <button
          onClick={openAddModal}
          className="bg-secondary hover:bg-secondary-dark text-white font-bold py-2 px-6 rounded-lg shadow-md transition duration-300 flex items-center"
        >
          <Plus size={20} className="mr-2" /> Add New Product
        </button>
      </div>

      {loading && (
        <p className="text-gray-600 py-8 text-center">Loading products...</p>
      )}
      {error && <p className="text-red-600 py-8 text-center">Error: {error}</p>}

      {!loading && !error && products.length === 0 && (
        <p className="text-gray-600 py-8 text-center">
          No products found. Add one!
        </p>
      )}

      {!loading && !error && products.length > 0 && (
        <div className="overflow-x-auto rounded-lg shadow-md border border-gray-200">
          <table className="min-w-full bg-white">
            <thead className="bg-primary text-white">
              <tr>
                <th className="py-3 px-4 text-left text-sm font-semibold rounded-tl-lg">
                  Name
                </th>
                <th className="py-3 px-4 text-left text-sm font-semibold">
                  Price
                </th>
                <th className="py-3 px-4 text-left text-sm font-semibold">
                  Category
                </th>
                <th className="py-3 px-4 text-left text-sm font-semibold">
                  Stock
                </th>
                <th className="py-3 px-4 text-left text-sm font-semibold rounded-tr-lg">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr
                  key={formatObjectId(product._id)}
                  className="border-b border-gray-200 hover:bg-gray-50 transition-colors duration-150"
                >
                  <td className="py-3 px-4 text-gray-800 text-sm font-medium">
                    {product.name}
                  </td>
                  <td className="py-3 px-4 text-gray-700 text-sm">
                    ${product.price.toFixed(2)}
                  </td>
                  <td className="py-3 px-4 text-gray-700 text-sm capitalize">
                    {product.category}
                  </td>
                  <td className="py-3 px-4 text-gray-700 text-sm">
                    {product.stock}
                  </td>
                  <td className="py-3 px-4 text-sm flex gap-2">
                    <button
                      onClick={() => openEditModal(product)}
                      className="bg-yellow-500 hover:bg-yellow-600 text-white font-semibold py-1 px-3 rounded-md transition duration-300 shadow-sm"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() =>
                        handleDeleteProduct(formatObjectId(product._id))
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

      {/* Product Add/Edit Modal */}
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
              className="bg-white rounded-lg p-8 w-full max-w-xl md:max-w-3xl lg:max-w-4xl shadow-2xl relative flex flex-col max-h-[90vh]"
            >
              <button
                onClick={() => setIsModalOpen(false)}
                className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 transition-colors"
              >
                <X size={24} />
              </button>
              <h3 className="text-2xl font-bold text-primary mb-6 border-b pb-3">
                {currentProduct ? "Edit Product" : "Add New Product"}
              </h3>
              <div className="overflow-y-auto pr-2 custom-scrollbar">
                <form
                  onSubmit={
                    currentProduct ? handleEditProduct : handleAddProduct
                  }
                  className="space-y-6"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label
                        htmlFor="name"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Product Name
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={newProductData.name}
                        onChange={handleInputChange}
                        required
                        className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-secondary focus:border-secondary sm:text-sm"
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="category"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Category
                      </label>
                      <input
                        type="text"
                        id="category"
                        name="category"
                        value={newProductData.category}
                        onChange={handleInputChange}
                        required
                        className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-secondary focus:border-secondary sm:text-sm"
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="price"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Price ($)
                      </label>
                      <input
                        type="number"
                        id="price"
                        name="price"
                        value={newProductData.price}
                        onChange={handleInputChange}
                        required
                        step="0.01"
                        min="0"
                        className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-secondary focus:border-secondary sm:text-sm"
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="oldPrice"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Old Price ($) (Optional)
                      </label>
                      <input
                        type="number"
                        id="oldPrice"
                        name="oldPrice"
                        value={newProductData.oldPrice || ""}
                        onChange={handleInputChange}
                        step="0.01"
                        min="0"
                        className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-secondary focus:border-secondary sm:text-sm"
                      />
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="stock"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Stock
                    </label>
                    <input
                      type="number"
                      id="stock"
                      name="stock"
                      value={newProductData.stock}
                      onChange={handleInputChange}
                      required
                      min="0"
                      className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-secondary focus:border-secondary sm:text-sm"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="description"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Description
                    </label>
                    <textarea
                      id="description"
                      name="description"
                      value={newProductData.description || ""}
                      onChange={handleInputChange}
                      rows={4}
                      className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-secondary focus:border-secondary sm:text-sm"
                    ></textarea>
                  </div>

                  {/* Image Inputs */}
                  <div className="border border-gray-200 p-4 rounded-md bg-gray-50">
                    <p className="text-lg font-semibold text-primary mb-4">
                      Product Images
                    </p>
                    {/* Thumbnail Image Input with Cloudinary Upload */}
                    <div className="mb-4">
                      <label
                        htmlFor="thumbnailImageUpload"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Thumbnail Image (Required)
                      </label>
                      <div className="flex items-center space-x-2">
                        <input
                          type="file"
                          id="thumbnailImageUpload"
                          name="thumbnailImageUpload"
                          accept="image/*"
                          onChange={handleThumbnailFileChange}
                          className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 focus:outline-none file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-white hover:file:bg-primary-dark"
                        />
                        <button
                          type="button"
                          onClick={handleThumbnailUploadClick}
                          disabled={
                            !selectedThumbnailFile || isThumbnailUploading
                          }
                          className="p-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                        >
                          {isThumbnailUploading ? (
                            <Loader2 size={20} className="animate-spin" />
                          ) : (
                            <UploadCloud size={20} />
                          )}
                        </button>
                      </div>
                      {isThumbnailUploading && (
                        <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
                          <div
                            className="bg-green-400 h-2.5 rounded-full"
                            style={{ width: `${thumbnailUploadProgress}%` }}
                          ></div>
                        </div>
                      )}
                      {thumbnailUploadError && (
                        <p className="text-red-500 text-sm mt-1">
                          {thumbnailUploadError}
                        </p>
                      )}
                      {currentThumbnailUrl && (
                        <div className="mt-3 w-28 h-28 rounded-lg overflow-hidden border border-gray-300 flex items-center justify-center bg-white shadow-sm">
                          <Image
                            src={currentThumbnailUrl}
                            alt="Thumbnail Preview"
                            unoptimized
                            height={112}
                            width={112}
                            objectFit="cover"
                            className="object-cover w-full h-full"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src =
                                "https://placehold.co/112x112/e0e0e0/555555?text=Bad+URL";
                            }}
                          />
                        </div>
                      )}
                    </div>

                    {/* Additional Images Input Section with Cloudinary Upload */}
                    <div>
                      <label
                        htmlFor="additionalImageUpload"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Add Additional Image (Max{" "}
                        {MAX_IMAGES -
                          (newProductData.images.length > 0 ? 1 : 0)}{" "}
                        more)
                      </label>
                      <div className="flex items-center space-x-2">
                        <input
                          type="file"
                          id="additionalImageUpload"
                          name="additionalImageUpload"
                          accept="image/*"
                          onChange={handleAdditionalFileChange}
                          className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 focus:outline-none file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-white hover:file:bg-primary-dark"
                          disabled={newProductData.images.length >= MAX_IMAGES}
                        />
                        <button
                          type="button"
                          onClick={handleAddAdditionalImageClick}
                          disabled={
                            !selectedAdditionalFile ||
                            isAdditionalUploading ||
                            newProductData.images.length >= MAX_IMAGES
                          }
                          className="p-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                        >
                          {isAdditionalUploading ? (
                            <Loader2 size={20} className="animate-spin" />
                          ) : (
                            <Plus size={20} />
                          )}
                        </button>
                      </div>
                      {isAdditionalUploading && (
                        <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
                          <div
                            className="bg-green-400 h-2.5 rounded-full"
                            style={{ width: `${additionalUploadProgress}%` }}
                          ></div>
                        </div>
                      )}
                      {additionalUploadError && (
                        <p className="text-red-500 text-sm mt-1">
                          {additionalUploadError}
                        </p>
                      )}

                      {/* Display existing additional images */}
                      {currentAdditionalImages.length > 0 && (
                        <div className="mt-4 border border-gray-200 p-3 rounded-md bg-white max-h-48 overflow-y-auto">
                          <p className="text-sm font-semibold text-gray-700 mb-2">
                            Currently added:
                          </p>
                          <div className="flex flex-wrap gap-3">
                            {currentAdditionalImages.map((url, index) => (
                              <div
                                key={url} // Using URL as key, assuming unique
                                className="relative w-24 h-24 rounded-lg overflow-hidden border border-gray-300 flex items-center justify-center bg-gray-100 shadow-sm"
                              >
                                <Image
                                  unoptimized
                                  height={96}
                                  width={96}
                                  src={url}
                                  alt={`Product Image ${index + 1}`}
                                  objectFit="cover"
                                  className="object-cover w-full h-full"
                                  onError={(e) => {
                                    (e.target as HTMLImageElement).src =
                                      "https://placehold.co/96x96/e0e0e0/555555?text=Bad+URL";
                                  }}
                                />
                                <button
                                  type="button"
                                  onClick={() => handleRemoveImageUrl(url)}
                                  className="absolute top-0 right-0 bg-red-500 text-white rounded-bl-lg p-1 opacity-90 hover:opacity-100 transition-opacity"
                                  aria-label="Remove image"
                                >
                                  <X size={16} />
                                </button>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
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
                      disabled={
                        loading ||
                        isThumbnailUploading ||
                        isAdditionalUploading ||
                        newProductData.images.length === 0
                      }
                    >
                      {loading || isThumbnailUploading || isAdditionalUploading
                        ? "Saving..."
                        : currentProduct
                        ? "Update Product"
                        : "Add Product"}
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

export default ProductManagement;
