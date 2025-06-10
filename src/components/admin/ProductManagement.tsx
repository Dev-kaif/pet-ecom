/* eslint-disable @typescript-eslint/no-explicit-any */
// src/components/admin/ProductManagement.tsx
import React, { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { Plus, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { IProduct } from "@/types"; // Ensure IProduct is imported from your types file
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
    images: [],
    stock: 0,
  });
  const [newImageUrlInput, setNewImageUrlInput] = useState<string>("");
  const [thumbnailImageUrlInput, setThumbnailImageUrlInput] =
    useState<string>("");

  const MAX_IMAGES = 5;

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

  const handleNewImageUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewImageUrlInput(e.target.value);
  };

  const handleThumbnailImageUrlChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setThumbnailImageUrlInput(e.target.value);
  };

  const handleAddImageUrl = () => {
    const trimmedUrl = newImageUrlInput.trim();
    if (
      trimmedUrl &&
      newProductData.images.length <
        MAX_IMAGES - (thumbnailImageUrlInput ? 1 : 0)
    ) {
      if (
        newProductData.images.includes(trimmedUrl) ||
        thumbnailImageUrlInput === trimmedUrl
      ) {
        showMessage("error", "This image URL is already added.");
        return;
      }
      setNewProductData((prev) => ({
        ...prev,
        images: [...prev.images, trimmedUrl],
      }));
      setNewImageUrlInput("");
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
          images: finalImages,
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
        setNewImageUrlInput("");
        setThumbnailImageUrlInput("");
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
            images: finalImages,
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
    setNewImageUrlInput("");
    setThumbnailImageUrlInput("");
    setIsModalOpen(true);
  };

  const openEditModal = (product: IProduct) => {
    setCurrentProduct(product);
    setThumbnailImageUrlInput(product.images?.[0] || "");
    setNewProductData({
      name: product.name,
      description: product.description,
      price: product.price,
      oldPrice: product.oldPrice,
      category: product.category,
      images: product.images?.slice(1) || [],
      stock: product.stock,
    });
    setNewImageUrlInput("");
    setIsModalOpen(true);
  };

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
                    {/* Thumbnail Image Input */}
                    <div className="mb-4">
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
                        required
                        className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-secondary focus:border-secondary sm:text-sm"
                        placeholder="e.g., https://example.com/thumbnail.jpg"
                      />
                      {thumbnailImageUrlInput && (
                        <div className="mt-3 w-28 h-28 rounded-lg overflow-hidden border border-gray-300 flex items-center justify-center bg-white shadow-sm">
                          <Image
                            src={thumbnailImageUrlInput}
                            alt="Thumbnail Preview"
                            unoptimized
                            height={112} // Adjusted for w-28
                            width={112} // Adjusted for w-28
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

                    {/* Additional Images Input Section */}
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
                          className="flex-grow px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-secondary focus:border-secondary sm:text-sm"
                          placeholder="e.g., https://example.com/image2.jpg"
                          disabled={
                            newProductData.images.length >=
                            MAX_IMAGES - (thumbnailImageUrlInput ? 1 : 0)
                          }
                        />
                        <button
                          type="button"
                          onClick={handleAddImageUrl}
                          className="p-2 bg-secondary text-white rounded-md hover:bg-secondary-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
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
                        <div className="mt-4 border border-gray-200 p-3 rounded-md bg-white max-h-48 overflow-y-auto">
                          <p className="text-sm font-semibold text-gray-700 mb-2">
                            Currently added:
                          </p>
                          <div className="flex flex-wrap gap-3">
                            {newProductData.images.map((url, index) => (
                              <div
                                key={index}
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
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ProductManagement;