/* eslint-disable @typescript-eslint/no-explicit-any */
// src/components/admin/PetManagement.tsx
import React, { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { Plus, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { IPet } from "@/types"; // Ensure IPet is imported from your types file
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

interface PetManagementProps {
  showMessage: (type: "success" | "error", text: string) => void;
}

// Stricter definition for MapLocation within PetFormData
type PetFormDataMapLocation = {
  address: string;
  link: string;
  coords: {
    lat: number;
    lng: number;
  };
};

// Define PetFormData: It omits certain IPet fields but makes mapLocation mandatory
// with non-optional nested properties for form handling.
type PetFormData = Omit<
  IPet,
  "_id" | "createdAt" | "updatedAt" | "isNewlyAdded" | "mapLocation" // Omit mapLocation to redefine it
> & {
  mapLocation: PetFormDataMapLocation; // Redefine mapLocation as mandatory
  images: string[]; // Explicitly include images as a string array
  additionalInfo: string[]; // Explicitly include additionalInfo as a string array
};

const PetManagement: React.FC<PetManagementProps> = ({ showMessage }) => {
  const [pets, setPets] = useState<IPet[]>([] as IPet[]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPet, setCurrentPet] = useState<IPet | null>(null);
  const [newPetData, setNewPetData] = useState<PetFormData>({
    name: "",
    category: "",
    type: "",
    age: "",
    color: "",
    gender: "N/A", // Default to N/A
    size: "Medium", // Default to Medium
    weight: 0,
    price: 0,
    location: "",
    images: [], // Ensure images is always an array
    description: "",
    availableDate: "",
    breed: "",
    dateOfBirth: "",
    additionalInfo: [], // Ensure additionalInfo is always an array
    mapLocation: {
      // Initialize mapLocation as a full object with default values
      address: "",
      link: "",
      coords: {
        lat: 0,
        lng: 0,
      },
    },
  });
  const [newImageUrlInput, setNewImageUrlInput] = useState<string>("");
  const [thumbnailImageUrlInput, setThumbnailImageUrlInput] =
    useState<string>("");
  const [newAdditionalInfoInput, setNewAdditionalInfoInput] =
    useState<string>("");

  const MAX_IMAGES = 5;
  const MAX_ADDITIONAL_INFO = 10; // Arbitrary limit for additional info strings

  const fetchPets = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/pets");
      const data = await response.json();
      if (data.success) {
        setPets(data.data);
      } else {
        setError(data.message || "Failed to fetch pets.");
        showMessage("error", data.message || "Failed to fetch pets.");
      }
    } catch (err: any) {
      setError(err.message || "Network error fetching pets.");
      showMessage("error", err.message || "Network error fetching pets.");
    } finally {
      setLoading(false);
    }
  }, [showMessage]);

  useEffect(() => {
    fetchPets();
  }, [fetchPets]);

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setNewPetData((prev) => ({
      ...prev,
      [name]:
        name === "price" || name === "weight"
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
      newPetData.images.length < MAX_IMAGES - (thumbnailImageUrlInput ? 1 : 0)
    ) {
      if (
        newPetData.images.includes(trimmedUrl) ||
        thumbnailImageUrlInput === trimmedUrl
      ) {
        showMessage("error", "This image URL is already added.");
        return;
      }
      setNewPetData((prev) => ({
        ...prev,
        images: [...prev.images, trimmedUrl],
      }));
      setNewImageUrlInput("");
    } else if (
      newPetData.images.length >= MAX_IMAGES - (thumbnailImageUrlInput ? 1 : 0)
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
    setNewPetData((prev) => ({
      ...prev,
      images: prev.images.filter((url) => url !== urlToRemove),
    }));
  };

  // Additional Info Handlers
  const handleNewAdditionalInfoChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setNewAdditionalInfoInput(e.target.value);
  };

  const handleAddAdditionalInfo = () => {
    const trimmedInfo = newAdditionalInfoInput.trim();
    if (trimmedInfo && newPetData.additionalInfo.length < MAX_ADDITIONAL_INFO) {
      if (newPetData.additionalInfo.includes(trimmedInfo)) {
        showMessage("error", "This info is already added.");
        return;
      }
      setNewPetData((prev) => ({
        ...prev,
        additionalInfo: [...prev.additionalInfo, trimmedInfo],
      }));
      setNewAdditionalInfoInput("");
    } else if (newPetData.additionalInfo.length >= MAX_ADDITIONAL_INFO) {
      showMessage(
        "error",
        `You can add a maximum of ${MAX_ADDITIONAL_INFO} additional info items.`
      );
    } else {
      showMessage("error", "Additional info cannot be empty.");
    }
  };

  const handleRemoveAdditionalInfo = (infoToRemove: string) => {
    setNewPetData((prev) => ({
      ...prev,
      additionalInfo: prev.additionalInfo.filter((info) => info !== infoToRemove),
    }));
  };

  // Map Location Handlers
  const handleMapLocationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewPetData((prev) => ({
      ...prev,
      mapLocation: {
        ...prev.mapLocation, // mapLocation is now guaranteed to be an object
        [name]: value,
      },
    }));
  };

  const handleMapCoordsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewPetData((prev) => ({
      ...prev,
      mapLocation: {
        ...prev.mapLocation,
        coords: {
          ...prev.mapLocation.coords, // coords is now guaranteed to be an object
          [name]: parseFloat(value) || 0,
        },
      },
    }));
  };


  const handleAddPet = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const finalImages = thumbnailImageUrlInput
      ? [thumbnailImageUrlInput, ...newPetData.images]
      : newPetData.images;

    if (!thumbnailImageUrlInput && finalImages.length === 0) {
      showMessage(
        "error",
        "Please add at least one image (thumbnail or additional)."
      );
      setLoading(false);
      return;
    }

    try {
      const response = await fetch("/api/pets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...newPetData,
          images: finalImages,
          // AvailableDate, breed, dateOfBirth are optional in IPet but string in form data
          // Send mapLocation only if address or coords are provided
          mapLocation:
            newPetData.mapLocation.address ||
            newPetData.mapLocation.coords.lat ||
            newPetData.mapLocation.coords.lng ||
            newPetData.mapLocation.link
              ? newPetData.mapLocation
              : undefined,
        }),
      });
      const data = await response.json();
      if (data.success) {
        showMessage("success", "Pet added successfully!");
        // Reset form
        setNewPetData({
          name: "",
          category: "",
          type: "",
          age: "",
          color: "",
          gender: "N/A",
          size: "Medium",
          weight: 0,
          price: 0,
          location: "",
          images: [],
          description: "",
          availableDate: "",
          breed: "",
          dateOfBirth: "",
          additionalInfo: [],
          mapLocation: {
            address: "",
            link: "",
            coords: { lat: 0, lng: 0 },
          },
        });
        setNewImageUrlInput("");
        setThumbnailImageUrlInput("");
        setNewAdditionalInfoInput("");
        setIsModalOpen(false);
        fetchPets();
      } else {
        showMessage("error", data.message || "Failed to add pet.");
      }
    } catch (err: any) {
      showMessage("error", err.message || "Network error adding pet.");
    } finally {
      setLoading(false);
    }
  };

  const handleEditPet = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentPet?._id) return;

    setLoading(true);

    const finalImages = thumbnailImageUrlInput
      ? [thumbnailImageUrlInput, ...newPetData.images]
      : newPetData.images;

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
        `/api/pets/${formatObjectId(currentPet._id)}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ...newPetData,
            images: finalImages,
            mapLocation:
              newPetData.mapLocation.address ||
              newPetData.mapLocation.coords.lat ||
              newPetData.mapLocation.coords.lng ||
              newPetData.mapLocation.link
                ? newPetData.mapLocation
                : undefined,
          }),
        }
      );
      const data = await response.json();
      if (data.success) {
        showMessage("success", "Pet updated successfully!");
        setIsModalOpen(false);
        setCurrentPet(null);
        fetchPets();
      } else {
        showMessage("error", data.message || "Failed to update pet.");
      }
    } catch (err: any) {
      showMessage("error", err.message || "Network error updating pet.");
    } finally {
      setLoading(false);
    }
  };

  const handleDeletePet = async (petId: string) => {
    if (!petId) {
      showMessage("error", "Pet ID is missing.");
      return;
    }
    if (!window.confirm("Are you sure you want to delete this pet?")) return;

    setLoading(true);
    try {
      const response = await fetch(`/api/pets/${petId}`, {
        method: "DELETE",
      });
      const data = await response.json();
      if (data.success) {
        showMessage("success", "Pet deleted successfully!");
        fetchPets();
      } else {
        showMessage("error", data.message || "Failed to delete pet.");
      }
    } catch (err: any) {
      showMessage("error", err.message || "Network error deleting pet.");
    } finally {
      setLoading(false);
    }
  };

  const openAddModal = () => {
    setCurrentPet(null);
    setNewPetData({
      name: "",
      category: "",
      type: "",
      age: "",
      color: "",
      gender: "N/A",
      size: "Medium",
      weight: 0,
      price: 0,
      location: "",
      images: [],
      description: "",
      availableDate: "",
      breed: "",
      dateOfBirth: "",
      additionalInfo: [],
      mapLocation: {
        address: "",
        link: "",
        coords: { lat: 0, lng: 0 },
      },
    });
    setNewImageUrlInput("");
    setThumbnailImageUrlInput("");
    setNewAdditionalInfoInput("");
    setIsModalOpen(true);
  };

  const openEditModal = (pet: IPet) => {
    setCurrentPet(pet);
    setThumbnailImageUrlInput(pet.images?.[0] || "");
    setNewPetData({
      name: pet.name,
      category: pet.category,
      type: pet.type,
      age: pet.age,
      color: pet.color,
      gender: pet.gender,
      size: pet.size,
      weight: pet.weight,
      price: pet.price,
      location: pet.location,
      images: pet.images?.slice(1) || [], // Exclude thumbnail, ensure array
      description: pet.description || "",
      availableDate: pet.availableDate || "",
      breed: pet.breed || "",
      dateOfBirth: pet.dateOfBirth || "",
      additionalInfo: pet.additionalInfo || [], // Ensure array
      mapLocation: {
        // Ensure all mapLocation properties are non-optional strings/numbers for form data
        address: pet.mapLocation?.address || "",
        link: pet.mapLocation?.link || "",
        coords: {
          lat: pet.mapLocation?.coords?.lat || 0,
          lng: pet.mapLocation?.coords?.lng || 0,
        },
      },
    });
    setNewImageUrlInput("");
    setNewAdditionalInfoInput("");
    setIsModalOpen(true);
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
      <div className="flex justify-between items-center mb-6 border-b pb-4">
        <h2 className="text-2xl font-bold text-primary">Pet List</h2>
        <button
          onClick={openAddModal}
          className="bg-secondary hover:bg-secondary-dark text-white font-bold py-2 px-6 rounded-lg shadow-md transition duration-300 flex items-center"
        >
          <Plus size={20} className="mr-2" /> Add New Pet
        </button>
      </div>

      {loading && (
        <p className="text-gray-600 py-8 text-center">Loading pets...</p>
      )}
      {error && <p className="text-red-600 py-8 text-center">Error: {error}</p>}

      {!loading && !error && pets.length === 0 && (
        <p className="text-gray-600 py-8 text-center">No pets found. Add one!</p>
      )}

      {!loading && !error && pets.length > 0 && (
        <div className="overflow-x-auto rounded-lg shadow-md border border-gray-200">
          <table className="min-w-full bg-white">
            <thead className="bg-primary text-white">
              <tr>
                <th className="py-3 px-4 text-left text-sm font-semibold rounded-tl-lg">
                  Name
                </th>
                <th className="py-3 px-4 text-left text-sm font-semibold">
                  Category
                </th>
                <th className="py-3 px-4 text-left text-sm font-semibold">
                  Type
                </th>
                <th className="py-3 px-4 text-left text-sm font-semibold">
                  Price
                </th>
                <th className="py-3 px-4 text-left text-sm font-semibold">
                  Gender
                </th>
                <th className="py-3 px-4 text-left text-sm font-semibold rounded-tr-lg">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {pets.map((pet) => (
                <tr
                  key={formatObjectId(pet._id)}
                  className="border-b border-gray-200 hover:bg-gray-50 transition-colors duration-150"
                >
                  <td className="py-3 px-4 text-gray-800 text-sm font-medium">
                    {pet.name}
                  </td>
                  <td className="py-3 px-4 text-gray-700 text-sm capitalize">
                    {pet.category}
                  </td>
                  <td className="py-3 px-4 text-gray-700 text-sm capitalize">
                    {pet.type}
                  </td>
                  <td className="py-3 px-4 text-gray-700 text-sm">
                    ${pet.price.toFixed(2)}
                  </td>
                  <td className="py-3 px-4 text-gray-700 text-sm capitalize">
                    {pet.gender}
                  </td>
                  <td className="py-3 px-4 text-sm flex gap-2">
                    <button
                      onClick={() => openEditModal(pet)}
                      className="bg-yellow-500 hover:bg-yellow-600 text-white font-semibold py-1 px-3 rounded-md transition duration-300 shadow-sm"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeletePet(formatObjectId(pet._id))}
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

      {/* Pet Add/Edit Modal */}
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
                {currentPet ? "Edit Pet" : "Add New Pet"}
              </h3>
              <div className="overflow-y-auto pr-2 custom-scrollbar">
                <form
                  onSubmit={currentPet ? handleEditPet : handleAddPet}
                  className="space-y-6"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label
                        htmlFor="name"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Pet Name
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={newPetData.name}
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
                        Category (e.g., dog, cat)
                      </label>
                      <input
                        type="text"
                        id="category"
                        name="category"
                        value={newPetData.category}
                        onChange={handleInputChange}
                        required
                        className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-secondary focus:border-secondary sm:text-sm"
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="type"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Type (e.g., small, large)
                      </label>
                      <input
                        type="text"
                        id="type"
                        name="type"
                        value={newPetData.type}
                        onChange={handleInputChange}
                        required
                        className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-secondary focus:border-secondary sm:text-sm"
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="age"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Age (e.g., 6 months, 2 years)
                      </label>
                      <input
                        type="text"
                        id="age"
                        name="age"
                        value={newPetData.age}
                        onChange={handleInputChange}
                        required
                        className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-secondary focus:border-secondary sm:text-sm"
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="color"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Color
                      </label>
                      <input
                        type="text"
                        id="color"
                        name="color"
                        value={newPetData.color}
                        onChange={handleInputChange}
                        required
                        className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-secondary focus:border-secondary sm:text-sm"
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="gender"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Gender
                      </label>
                      <select
                        id="gender"
                        name="gender"
                        value={newPetData.gender}
                        onChange={handleInputChange}
                        required
                        className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-secondary focus:border-secondary sm:text-sm"
                      >
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="N/A">N/A</option>
                      </select>
                    </div>
                    <div>
                      <label
                        htmlFor="size"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Size
                      </label>
                      <select
                        id="size"
                        name="size"
                        value={newPetData.size}
                        onChange={handleInputChange}
                        required
                        className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-secondary focus:border-secondary sm:text-sm"
                      >
                        <option value="Tiny">Tiny</option>
                        <option value="Small">Small</option>
                        <option value="Medium">Medium</option>
                        <option value="Large">Large</option>
                      </select>
                    </div>
                    <div>
                      <label
                        htmlFor="weight"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Weight (kg)
                      </label>
                      <input
                        type="number"
                        id="weight"
                        name="weight"
                        value={newPetData.weight}
                        onChange={handleInputChange}
                        required
                        step="0.1"
                        min="0"
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
                        value={newPetData.price}
                        onChange={handleInputChange}
                        required
                        step="0.01"
                        min="0"
                        className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-secondary focus:border-secondary sm:text-sm"
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="location"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Location
                      </label>
                      <input
                        type="text"
                        id="location"
                        name="location"
                        value={newPetData.location}
                        onChange={handleInputChange}
                        required
                        className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-secondary focus:border-secondary sm:text-sm"
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="breed"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Breed (Optional)
                      </label>
                      <input
                        type="text"
                        id="breed"
                        name="breed"
                        value={newPetData.breed || ""} // Ensure value is a string
                        onChange={handleInputChange}
                        className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-secondary focus:border-secondary sm:text-sm"
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="dateOfBirth"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Date of Birth (Optional)
                      </label>
                      <input
                        type="date" // Use type="date" for date picker
                        id="dateOfBirth"
                        name="dateOfBirth"
                        value={newPetData.dateOfBirth || ""} // Ensure value is a string
                        onChange={handleInputChange}
                        className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-secondary focus:border-secondary sm:text-sm"
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="availableDate"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Available Date (Optional)
                      </label>
                      <input
                        type="text" // Keep as text, backend will format if empty
                        id="availableDate"
                        name="availableDate"
                        value={newPetData.availableDate || ""} // Ensure value is a string
                        onChange={handleInputChange}
                        placeholder="e.g., 15 Aug 2024"
                        className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-secondary focus:border-secondary sm:text-sm"
                      />
                    </div>
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
                      value={newPetData.description || ""}
                      onChange={handleInputChange}
                      rows={4}
                      className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-secondary focus:border-secondary sm:text-sm"
                    ></textarea>
                  </div>

                  {/* Image Inputs */}
                  <div className="border border-gray-200 p-4 rounded-md bg-gray-50">
                    <p className="text-lg font-semibold text-primary mb-4">
                      Pet Images
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
                        placeholder="e.g., https://example.com/pet_thumbnail.jpg"
                      />
                      {thumbnailImageUrlInput && (
                        <div className="mt-3 w-28 h-28 rounded-lg overflow-hidden border border-gray-300 flex items-center justify-center bg-white shadow-sm">
                          <Image
                            src={thumbnailImageUrlInput}
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
                          placeholder="e.g., https://example.com/pet_image2.jpg"
                          disabled={
                            newPetData.images.length >=
                            MAX_IMAGES - (thumbnailImageUrlInput ? 1 : 0)
                          }
                        />
                        <button
                          type="button"
                          onClick={handleAddImageUrl}
                          className="p-2 bg-secondary text-white rounded-md hover:bg-secondary-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                          disabled={
                            !newImageUrlInput.trim() ||
                            newPetData.images.length >=
                              MAX_IMAGES - (thumbnailImageUrlInput ? 1 : 0)
                          }
                        >
                          <Plus size={20} />
                        </button>
                      </div>
                      {/* Display existing additional images */}
                      {newPetData.images.length > 0 && (
                        <div className="mt-4 border border-gray-200 p-3 rounded-md bg-white max-h-48 overflow-y-auto">
                          <p className="text-sm font-semibold text-gray-700 mb-2">
                            Currently added:
                          </p>
                          <div className="flex flex-wrap gap-3">
                            {newPetData.images.map((url, index) => (
                              <div
                                key={index}
                                className="relative w-24 h-24 rounded-lg overflow-hidden border border-gray-300 flex items-center justify-center bg-gray-100 shadow-sm"
                              >
                                <Image
                                  unoptimized
                                  height={96}
                                  width={96}
                                  src={url}
                                  alt={`Pet Image ${index + 1}`}
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

                  {/* Additional Info Input */}
                  <div className="border border-gray-200 p-4 rounded-md bg-gray-50">
                    <p className="text-lg font-semibold text-primary mb-4">
                      Additional Information
                    </p>
                    <div>
                      <label
                        htmlFor="newAdditionalInfo"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Add Info Item (Max {MAX_ADDITIONAL_INFO} items)
                      </label>
                      <div className="flex items-center space-x-2">
                        <input
                          type="text"
                          id="newAdditionalInfo"
                          name="newAdditionalInfo"
                          value={newAdditionalInfoInput}
                          onChange={handleNewAdditionalInfoChange}
                          className="flex-grow px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-secondary focus:border-secondary sm:text-sm"
                          placeholder="e.g., Vaccinated, Microchipped"
                          disabled={
                            newPetData.additionalInfo.length >=
                            MAX_ADDITIONAL_INFO
                          }
                        />
                        <button
                          type="button"
                          onClick={handleAddAdditionalInfo}
                          className="p-2 bg-secondary text-white rounded-md hover:bg-secondary-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                          disabled={
                            !newAdditionalInfoInput.trim() ||
                            newPetData.additionalInfo.length >=
                              MAX_ADDITIONAL_INFO
                          }
                        >
                          <Plus size={20} />
                        </button>
                      </div>
                      {newPetData.additionalInfo.length > 0 && (
                        <div className="mt-4 border border-gray-200 p-3 rounded-md bg-white max-h-48 overflow-y-auto">
                          <p className="text-sm font-semibold text-gray-700 mb-2">
                            Currently added:
                          </p>
                          <div className="flex flex-wrap gap-2">
                            {newPetData.additionalInfo.map((info, index) => (
                              <span
                                key={index}
                                className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                              >
                                {info}
                                <button
                                  type="button"
                                  onClick={() => handleRemoveAdditionalInfo(info)}
                                  className="flex-shrink-0 ml-1.5 h-3 w-3 rounded-full inline-flex items-center justify-center text-blue-400 hover:bg-blue-200 hover:text-blue-500 focus:outline-none focus:bg-blue-200 focus:text-blue-500"
                                >
                                  <span className="sr-only">Remove item</span>
                                  <X size={10} />
                                </button>
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Map Location Input */}
                  <div className="border border-gray-200 p-4 rounded-md bg-gray-50">
                    <p className="text-lg font-semibold text-primary mb-4">
                      Map Location (Optional)
                    </p>
                    <div className="space-y-4">
                      <div>
                        <label
                          htmlFor="mapLocationAddress"
                          className="block text-sm font-medium text-gray-700 mb-1"
                        >
                          Address
                        </label>
                        <input
                          type="text"
                          id="mapLocationAddress"
                          name="address"
                          value={newPetData.mapLocation.address} // No optional chaining needed here
                          onChange={handleMapLocationChange}
                          className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-secondary focus:border-secondary sm:text-sm"
                          placeholder="e.g., 123 Main St, Anytown"
                        />
                      </div>
                      <div>
                        <label
                          htmlFor="mapLocationLink"
                          className="block text-sm font-medium text-gray-700 mb-1"
                        >
                          Google Maps Link
                        </label>
                        <input
                          type="url"
                          id="mapLocationLink"
                          name="link"
                          value={newPetData.mapLocation.link} // No optional chaining needed here
                          onChange={handleMapLocationChange}
                          className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-secondary focus:border-secondary sm:text-sm"
                          placeholder="e.g., https://maps.app.goo.gl/..."
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label
                            htmlFor="mapLocationLat"
                            className="block text-sm font-medium text-gray-700 mb-1"
                          >
                            Latitude
                          </label>
                          <input
                            type="number"
                            id="mapLocationLat"
                            name="lat"
                            value={newPetData.mapLocation.coords.lat} // No optional chaining needed here
                            onChange={handleMapCoordsChange}
                            step="any"
                            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-secondary focus:border-secondary sm:text-sm"
                            placeholder="e.g., 34.0522"
                          />
                        </div>
                        <div>
                          <label
                            htmlFor="mapLocationLng"
                            className="block text-sm font-medium text-gray-700 mb-1"
                          >
                            Longitude
                          </label>
                          <input
                            type="number"
                            id="mapLocationLng"
                            name="lng"
                            value={newPetData.mapLocation.coords.lng} // No optional chaining needed here
                            onChange={handleMapCoordsChange}
                            step="any"
                            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-secondary focus:border-secondary sm:text-sm"
                            placeholder="e.g., -118.2437"
                          />
                        </div>
                      </div>
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
                        : currentPet
                        ? "Update Pet"
                        : "Add Pet"}
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

export default PetManagement;