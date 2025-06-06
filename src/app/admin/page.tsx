/* eslint-disable @typescript-eslint/no-explicit-any */
// src/app/admin/page.tsx
"use client";
import React, { useState, useEffect, useCallback } from "react";
import { useSession, signIn, signOut } from "next-auth/react"; // For authentication
import {
  IProduct,
  IOrder,
  OrderStatus,
  PaymentStatus,
  AuthenticatedUser,
} from "@/types"; // Adjust path as needed, added AuthenticatedUser
import { Types } from "mongoose"; // For ObjectId conversion
import Image from "next/image"; // Import Image component for previews
import { X, Plus } from "lucide-react"; // Icons for close/add

// Utility to ensure MongoDB ObjectId strings are valid for display/forms
const formatObjectId = (id: Types.ObjectId | string | undefined): string => {
  // Allow undefined for safety
  if (typeof id === "string") {
    return id;
  }
  if (id instanceof Types.ObjectId) {
    return id.toString();
  }
  return ""; // Return empty string or throw error if ID is genuinely missing
};

// Main Admin Dashboard Component
export default function App() {
  const { data: session, status } = useSession(); // Get session data
  const [activeTab, setActiveTab] = useState<"products" | "orders">("products");
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  // Function to show transient messages
  const showMessage = useCallback((type: "success" | "error", text: string) => {
    setMessage({ type, text });
    setTimeout(() => setMessage(null), 5000); // Clear message after 5 seconds
  }, []);

  // --- Authentication Check ---
  if (status === "loading") {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
        <p className="text-xl font-semibold text-gray-700">
          Loading authentication...
        </p>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
        <h1 className="text-3xl font-bold text-red-600 mb-4">Access Denied</h1>
        <p className="text-lg text-gray-700 mb-6">
          Please log in to access the admin dashboard.
        </p>
        <button
          onClick={() => signIn()}
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-md shadow-lg transition duration-300"
        >
          Sign In
        </button>
      </div>
    );
  }

  // Explicitly cast session.user to AuthenticatedUser for safer role access
  if ((session.user as AuthenticatedUser)?.role !== "admin") {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-red-50 p-4">
        <h1 className="text-3xl font-bold text-red-600 mb-4">
          Unauthorized Access
        </h1>
        <p className="text-lg text-gray-700 mb-6">
          You do not have administrative privileges to view this page.
        </p>
        <button
          onClick={() => signOut()}
          className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-6 rounded-md shadow-lg transition duration-300"
        >
          Sign Out
        </button>
      </div>
    );
  }

  // --- Admin Dashboard UI ---
  return (
    <div className="min-h-screen bg-gray-100 p-4 sm:p-6 lg:p-8 font-sans">
      <div className="max-w-7xl mx-auto bg-white rounded-xl shadow-lg p-6 md:p-8">
        <div className="flex justify-between items-center mb-6 border-b pb-4">
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <button
            onClick={() => signOut()}
            className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-md shadow-md transition duration-300"
          >
            Sign Out
          </button>
        </div>

        {message && (
          <div
            className={`p-3 rounded-md mb-4 text-white ${
              message.type === "success" ? "bg-green-500" : "bg-red-500"
            } shadow-md`}
          >
            {message.text}
          </div>
        )}

        {/* Tab Navigation */}
        <div className="mb-6 flex flex-wrap gap-2">
          <button
            onClick={() => setActiveTab("products")}
            className={`py-2 px-6 rounded-lg text-lg font-semibold transition duration-300 shadow-sm ${
              activeTab === "products"
                ? "bg-blue-600 text-white shadow-blue-300/50"
                : "bg-gray-200 text-gray-800 hover:bg-gray-300"
            }`}
          >
            Product Management
          </button>
          <button
            onClick={() => setActiveTab("orders")}
            className={`py-2 px-6 rounded-lg text-lg font-semibold transition duration-300 shadow-sm ${
              activeTab === "orders"
                ? "bg-blue-600 text-white shadow-blue-300/50"
                : "bg-gray-200 text-gray-800 hover:bg-gray-300"
            }`}
          >
            Order Management
          </button>
        </div>

        {/* Tab Content */}
        <div>
          {activeTab === "products" && (
            <ProductManagement showMessage={showMessage} />
          )}
          {activeTab === "orders" && (
            <OrderManagement showMessage={showMessage} />
          )}
        </div>
      </div>
    </div>
  );
}

// --- Product Management Component ---
interface ProductManagementProps {
  showMessage: (type: "success" | "error", text: string) => void;
}

// Explicitly define 'images' as a non-optional string array in ProductFormData
type ProductFormData = Omit<
  IProduct,
  | "_id"
  | "createdAt"
  | "updatedAt"
  | "reviewsCount"
  | "isNewlyReleased"
  | "isOnSale"
> & {
  images: string[]; // Override 'images' to be always present
};

const ProductManagement: React.FC<ProductManagementProps> = ({
  showMessage,
}) => {
  const [products, setProducts] = useState<IProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentProduct, setCurrentProduct] = useState<IProduct | null>(null); // For editing
  const [newProductData, setNewProductData] = useState<ProductFormData>({
    name: "",
    description: "",
    price: 0,
    oldPrice: undefined,
    category: "",
    images: [], // This will store all image URLs for the product
    stock: 0,
  });
  const [newImageUrlInput, setNewImageUrlInput] = useState<string>(""); // For the single image URL input
  const [thumbnailImageUrlInput, setThumbnailImageUrlInput] =
    useState<string>(""); // NEW: For the thumbnail image input

  const MAX_IMAGES = 5; // Define max images constant (excluding thumbnail)

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

  // Handler for the single image URL input field (additional images)
  const handleNewImageUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewImageUrlInput(e.target.value);
  };

  // NEW: Handler for the thumbnail image URL input field
  const handleThumbnailImageUrlChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setThumbnailImageUrlInput(e.target.value);
  };

  // Function to add the current image URL to the images array
  const handleAddImageUrl = () => {
    const trimmedUrl = newImageUrlInput.trim();
    if (
      trimmedUrl &&
      newProductData.images.length <
        MAX_IMAGES - (thumbnailImageUrlInput ? 1 : 0)
    ) {
      // Adjust max based on thumbnail
      // Prevent adding duplicates
      if (
        newProductData.images.includes(trimmedUrl) ||
        thumbnailImageUrlInput === trimmedUrl
      ) {
        // Check against thumbnail too
        showMessage("error", "This image URL is already added.");
        return;
      }
      setNewProductData((prev) => ({
        ...prev,
        images: [...prev.images, trimmedUrl],
      }));
      setNewImageUrlInput(""); // Clear the input field
    } else if (
      newProductData.images.length >=
      MAX_IMAGES - (thumbnailImageUrlInput ? 1 : 0)
    ) {
      showMessage(
        "error",
        `You can add a maximum of ${MAX_IMAGES} images (including thumbnail).`
      );
    } else {
      showMessage("error", "Image URL cannot be empty.");
    }
  };

  // Function to remove an image from the images array
  const handleRemoveImageUrl = (urlToRemove: string) => {
    setNewProductData((prev) => ({
      ...prev,
      images: prev.images.filter((url) => url !== urlToRemove),
    }));
  };

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const finalImages = thumbnailImageUrlInput
      ? [thumbnailImageUrlInput, ...newProductData.images]
      : newProductData.images;

    // Basic validation for thumbnail
    if (!thumbnailImageUrlInput && finalImages.length === 0) {
      showMessage(
        "error",
        "Please add at least one image (thumbnail or additional)."
      );
      setLoading(false);
      return;
    }

    try {
      const response = await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...newProductData,
          images: finalImages, // Send the combined images array
        }),
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
        setNewImageUrlInput(""); // Clear the new image URL input
        setThumbnailImageUrlInput(""); // Clear thumbnail input
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

    const finalImages = thumbnailImageUrlInput
      ? [thumbnailImageUrlInput, ...newProductData.images]
      : newProductData.images;

    // Basic validation for thumbnail
    if (!thumbnailImageUrlInput && finalImages.length === 0) {
      showMessage(
        "error",
        "Please add at least one image (thumbnail or additional)."
      );
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(
        `/api/products/${formatObjectId(currentProduct._id)}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ...newProductData,
            images: finalImages, // Send the combined images array
          }),
        }
      );
      const data = await response.json();
      if (data.success) {
        showMessage("success", "Product updated successfully!");
        setIsModalOpen(false);
        setCurrentProduct(null);
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
    // Add null check for productId before using it
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

  const openAddModal = () => {
    setCurrentProduct(null); // Clear any previous edit state
    setNewProductData({
      name: "",
      description: "",
      price: 0,
      oldPrice: undefined,
      category: "",
      images: [],
      stock: 0,
    }); // Reset images field
    setNewImageUrlInput(""); // Clear the new image URL input
    setThumbnailImageUrlInput(""); // NEW: Clear thumbnail input
    setIsModalOpen(true);
  };

  const openEditModal = (product: IProduct) => {
    setCurrentProduct(product);
    // NEW: Separate thumbnail from other images
    setThumbnailImageUrlInput(product.images?.[0] || ""); // First image is thumbnail
    setNewProductData({
      name: product.name,
      description: product.description,
      price: product.price,
      oldPrice: product.oldPrice,
      category: product.category,
      images: product.images?.slice(1) || [], // Rest are additional images
      stock: product.stock,
    });
    setNewImageUrlInput(""); // Clear the new image URL input
    setIsModalOpen(true);
  };

  return (
    <div className="mt-8">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Products</h2>
      <button
        onClick={openAddModal}
        className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-6 rounded-lg shadow-md mb-6 transition duration-300"
      >
        Add New Product
      </button>

      {loading && <p className="text-gray-600">Loading products...</p>}
      {error && <p className="text-red-600">Error: {error}</p>}

      {!loading && !error && products.length === 0 && (
        <p className="text-gray-600">No products found. Add one!</p>
      )}

      {!loading && !error && products.length > 0 && (
        <div className="overflow-x-auto rounded-lg shadow-md">
          <table className="min-w-full bg-white border-collapse">
            <thead className="bg-gray-800 text-white">
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
                  className="border-b border-gray-200 hover:bg-gray-50"
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
                      className="bg-yellow-500 hover:bg-yellow-600 text-white font-semibold py-1 px-3 rounded-md transition duration-300"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() =>
                        handleDeleteProduct(formatObjectId(product._id))
                      }
                      className="bg-red-500 hover:bg-red-600 text-white font-semibold py-1 px-3 rounded-md transition duration-300"
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
      {isModalOpen && (
        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          {" "}
          {/* Changed 'fixed' to 'absolute' */}
          <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-2xl">
            <h3 className="text-2xl font-bold text-gray-800 mb-6 border-b pb-3">
              {currentProduct ? "Edit Product" : "Add New Product"}
            </h3>
            <form
              onSubmit={currentProduct ? handleEditProduct : handleAddProduct}
              className="space-y-4"
            >
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
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
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
                  rows={3}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                ></textarea>
              </div>
              <div className="grid grid-cols-2 gap-4">
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
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                </div>
                <div>
                  <label
                    htmlFor="oldPrice"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Old Price ($)
                  </label>
                  <input
                    type="number"
                    id="oldPrice"
                    name="oldPrice"
                    value={newProductData.oldPrice || ""}
                    onChange={handleInputChange}
                    step="0.01"
                    min="0"
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                </div>
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
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div>

              {/* NEW: Thumbnail Image Input */}
              <div>
                <label
                  htmlFor="thumbnailImageUrl"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Thumbnail Image URL (Required)
                </label>
                <input
                  type="url"
                  id="thumbnailImageUrl"
                  name="thumbnailImageUrl"
                  value={thumbnailImageUrlInput}
                  onChange={handleThumbnailImageUrlChange}
                  required // Thumbnail is now required
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="e.g., https://example.com/thumbnail.jpg"
                />
                {thumbnailImageUrlInput && (
                  <div className="mt-2 w-24 h-24 rounded-md overflow-hidden border border-gray-300 flex items-center justify-center bg-gray-100">
                    <Image
                      src={thumbnailImageUrlInput}
                      alt="Thumbnail Preview"
                      unoptimized
                      height={100}
                      width={100}
                      objectFit="contain"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src =
                          "https://placehold.co/96x96/e0e0e0/555555?text=Bad+URL";
                      }}
                    />
                  </div>
                )}
              </div>

              {/* Multiple Images Input Section (for additional images) */}
              <div>
                <label
                  htmlFor="newImageUrl"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Add Additional Image URL (Max{" "}
                  {MAX_IMAGES - (thumbnailImageUrlInput ? 1 : 0)} more)
                </label>
                <div className="flex items-center space-x-2">
                  <input
                    type="url"
                    id="newImageUrl"
                    name="newImageUrl"
                    value={newImageUrlInput}
                    onChange={handleNewImageUrlChange}
                    className="flex-grow px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    placeholder="e.g., https://example.com/image2.jpg"
                    disabled={
                      newProductData.images.length >=
                      MAX_IMAGES - (thumbnailImageUrlInput ? 1 : 0)
                    }
                  />
                  <button
                    type="button"
                    onClick={handleAddImageUrl}
                    className="p-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={
                      !newImageUrlInput.trim() ||
                      newProductData.images.length >=
                        MAX_IMAGES - (thumbnailImageUrlInput ? 1 : 0)
                    }
                  >
                    <Plus size={20} />
                  </button>
                </div>
                {/* Display existing additional images */}
                {newProductData.images.length > 0 && (
                  <div className="mt-4 border border-gray-200 p-2 rounded-md bg-gray-50 max-h-40 overflow-y-auto">
                    <p className="text-sm font-semibold text-gray-700 mb-2">
                      Additional Images:
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {newProductData.images.map((url, index) => (
                        <div
                          key={index}
                          className="relative w-20 h-20 rounded-md overflow-hidden border border-gray-300 flex items-center justify-center bg-white"
                        >
                          <Image
                            unoptimized
                            height={100}
                            width={100}
                            src={url}
                            alt={`Product Image ${index + 1}`}
                            objectFit="contain"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src =
                                "https://placehold.co/80x80/e0e0e0/555555?text=Bad+URL";
                            }}
                          />
                          <button
                            type="button"
                            onClick={() => handleRemoveImageUrl(url)}
                            className="absolute top-0 right-0 bg-red-500 text-white rounded-bl-md p-1 opacity-80 hover:opacity-100 transition-opacity"
                            aria-label="Remove image"
                          >
                            <X size={14} />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
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
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div>
              <div className="flex justify-end space-x-3 pt-4 border-t mt-6">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded-md shadow-sm transition duration-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md shadow-md transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={loading}
                >
                  {loading
                    ? "Saving..."
                    : currentProduct
                    ? "Update Product"
                    : "Add Product"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

// --- Order Management Component ---
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
    if (!currentOrder?._id) return; // currentOrder is nullable, so optional chaining is crucial

    setLoading(true);
    try {
      const updateData: Partial<IOrder> = {
        orderStatus: updatedOrderStatus || undefined,
        paymentStatus: updatedPaymentStatus || undefined,
        isPaid: updatedIsPaid,
        paidAt:
          updatedIsPaid && !currentOrder.paidAt
            ? new Date()
            : currentOrder.paidAt, // Set paidAt if just marked paid
      };

      const response = await fetch(
        `/api/orders/${formatObjectId(currentOrder._id)}`,
        {
          // currentOrder._id is implicitly non-null here
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
    <div className="mt-8">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Orders</h2>

      {loading && <p className="text-gray-600">Loading orders...</p>}
      {error && <p className="text-red-600">Error: {error}</p>}

      {!loading && !error && orders.length === 0 && (
        <p className="text-gray-600">No orders found.</p>
      )}

      {!loading && !error && orders.length > 0 && (
        <div className="overflow-x-auto rounded-lg shadow-md">
          <table className="min-w-full bg-white border-collapse">
            <thead className="bg-gray-800 text-white">
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
                // Use non-null assertion for order._id since it's from fetched data
                <tr
                  key={formatObjectId(order._id!)}
                  className="border-b border-gray-200 hover:bg-gray-50"
                >
                  <td className="py-3 px-4 text-gray-800 text-sm font-medium">
                    {formatObjectId(order._id!).substring(0, 8)}...
                  </td>
                  {/* Ensure userId is treated as string for display if populated, or handle non-string type */}
                  <td className="py-3 px-4 text-gray-700 text-sm">
                    {order.userId
                      ? (order.userId as any).email ||
                        formatObjectId(order.userId)
                      : "N/A"}
                  </td>
                  <td className="py-3 px-4 text-gray-700 text-sm">
                    ${order.totalPrice.toFixed(2)}
                  </td>
                  <td className="py-3 px-4 text-gray-700 text-sm capitalize">
                    {order.orderStatus}
                  </td>
                  <td className="py-3 px-4 text-gray-700 text-sm capitalize">
                    {order.paymentStatus}
                  </td>
                  <td className="py-3 px-4 text-gray-700 text-sm">
                    {order.isPaid ? "Yes" : "No"}
                  </td>
                  <td className="py-3 px-4 text-sm">
                    <button
                      onClick={() => openEditModal(order)}
                      className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-1 px-3 rounded-md transition duration-300"
                    >
                      Edit Status
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Order Edit Modal */}
      {isEditModalOpen && currentOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-2xl">
            <h3 className="text-2xl font-bold text-gray-800 mb-6 border-b pb-3">
              Edit Order Status
            </h3>
            <form onSubmit={handleUpdateOrder} className="space-y-4">
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
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                >
                  {orderStatusOptions.map((status) => (
                    <option key={status} value={status} className="capitalize">
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
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                >
                  {paymentStatusOptions.map((status) => (
                    <option key={status} value={status} className="capitalize">
                      {status}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="isPaid"
                  name="isPaid"
                  checked={updatedIsPaid}
                  onChange={(e) => setUpdatedIsPaid(e.target.checked)}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label
                  htmlFor="isPaid"
                  className="ml-2 block text-sm text-gray-900"
                >
                  Is Paid
                </label>
              </div>
              <div className="flex justify-end space-x-3 pt-4 border-t mt-6">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded-md shadow-sm transition duration-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md shadow-md transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={loading}
                >
                  {loading ? "Updating..." : "Update Order"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
