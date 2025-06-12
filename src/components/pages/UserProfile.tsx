"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, {
  useState,
  useEffect,
  useCallback,
  ChangeEvent,
  FormEvent,
} from "react";
import { useSession, signIn, signOut } from "next-auth/react";
import { IUser, IAddress } from "@/types"; // Make sure IUser and IAddress are correctly imported
import Image from "next/image";
import {
  Loader2,
  Plus,
  Edit,
  Trash2,
  UploadCloud,
  User as UserIcon,
  Save,
  LogOut,
} from "lucide-react"; // Added Save and X icons
import { motion } from "motion/react";
import { Types } from "mongoose"; // For generating temporary IDs for new addresses
import Loader from "../ui/Loader";
import {
  CLOUDINARY_CLOUD_NAME,
  CLOUDINARY_UPLOAD_PRESET,
} from "@/backend/lib/config";

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

export default function UserProfilePage() {
  const { data: session, status } = useSession();
  const [userProfile, setUserProfile] = useState<IUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  // State for profile form fields
  const [firstName, setFirstName] = useState<string>("");
  const [lastName, setLastName] = useState<string>("");
  const [phone, setPhone] = useState<string>("");
  const [profilePicture, setProfilePicture] = useState<string>("");
  const [addresses, setAddresses] = useState<IAddress[]>([]);

  // State for Cloudinary upload specific to profile picture
  const [selectedProfileFile, setSelectedProfileFile] = useState<File | null>(
    null
  );
  const [isProfileUploading, setIsProfileUploading] = useState(false);
  const [profileUploadProgress, setProfileUploadProgress] = useState(0); // Basic progress, will be 0 or 100
  const [profileUploadError, setProfileUploadError] = useState<string | null>(
    null
  );

  // State for inline address editing
  const [editingAddressId, setEditingAddressId] = useState<string | null>(null); // _id of the address currently being edited
  const [addressFormData, setAddressFormData] = useState<IAddress>({
    // Form data for the currently edited/added address
    street: "",
    city: "",
    state: "",
    zipCode: "",
    country: "",
    label: "Home",
    isDefault: false,
  });

  // Utility to show messages
  const showMessage = useCallback((type: "success" | "error", text: string) => {
    setMessage({ type, text });
    setTimeout(() => setMessage(null), 5000);
  }, []);

  // Helper function to upload a file to Cloudinary
  const uploadFileToCloudinary = useCallback(
    async (file: File) => {
      if (!file) return null;

      setIsProfileUploading(true);
      setProfileUploadProgress(0);
      setProfileUploadError(null);

      // Basic validation for Cloudinary credentials
      if (
        !CLOUDINARY_CLOUD_NAME ||
        CLOUDINARY_CLOUD_NAME === "your_cloudinary_cloud_name"
      ) {
        setProfileUploadError("Cloudinary cloud name is not configured.");
        showMessage(
          "error",
          "Cloudinary cloud name is not configured. Please check environment variables."
        );
        setIsProfileUploading(false);
        return null;
      }
      if (
        !CLOUDINARY_UPLOAD_PRESET ||
        CLOUDINARY_UPLOAD_PRESET === "your_cloudinary_upload_preset"
      ) {
        setProfileUploadError("Cloudinary upload preset is not configured.");
        showMessage(
          "error",
          "Cloudinary upload preset is not configured. Please check environment variables."
        );
        setIsProfileUploading(false);
        return null;
      }

      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);

      try {
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
        setProfileUploadProgress(100);
        showMessage("success", "Profile picture uploaded successfully!");
        setSelectedProfileFile(null); // Clear selected file input after successful upload
        return data.secure_url;
      } catch (err: any) {
        setProfileUploadError(
          err.message || "Failed to upload profile picture to Cloudinary."
        );
        showMessage(
          "error",
          err.message || "Failed to upload profile picture."
        );
        return null;
      } finally {
        setIsProfileUploading(false);
      }
    },
    [showMessage]
  );

  // Handle file selection for profile picture
  const handleProfileFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedProfileFile(e.target.files[0]);
      setProfileUploadError(null); // Clear previous errors
    } else {
      setSelectedProfileFile(null);
    }
  };

  // Trigger profile picture upload
  const handleProfileUploadClick = async () => {
    if (selectedProfileFile) {
      const url = await uploadFileToCloudinary(selectedProfileFile);
      if (url) {
        setProfilePicture(url);
      }
    }
  };

  // Fetch user profile data from backend
  const fetchUserProfile = useCallback(async () => {
    if (status === "authenticated" && session?.user) {
      setLoading(true);
      try {
        const response = await fetch("/api/users/me");
        const data = await response.json();
        if (data.success) {
          setUserProfile(data.data);
          // Initialize form fields with fetched data
          setFirstName(data.data.firstName || "");
          setLastName(data.data.lastName || "");
          setPhone(data.data.phone || "");
          setProfilePicture(data.data.profilePicture || "");
          setAddresses(data.data.addresses || []);
        } else {
          showMessage("error", data.message || "Failed to fetch profile.");
          setUserProfile(null);
        }
      } catch (err: any) {
        showMessage("error", err.message || "Network error fetching profile.");
        setUserProfile(null);
      } finally {
        setLoading(false);
      }
    }
  }, [session, status, showMessage]);

  useEffect(() => {
    fetchUserProfile();
  }, [fetchUserProfile]);

  // Handle basic profile field changes (for inputs that are not file uploads)
  const handleProfileFieldChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    if (name === "firstName") setFirstName(value);
    else if (name === "lastName") setLastName(value);
    else if (name === "phone") setPhone(value);
  };

  // Handle profile form submission
  const handleProfileSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const updateData: Partial<IUser> = {
        firstName,
        lastName,
        phone,
        profilePicture, // This will hold the URL from Cloudinary
      };

      const response = await fetch("/api/users/me", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updateData),
      });
      const data = await response.json();

      if (data.success) {
        setUserProfile(data.data); // Update local state with fresh data
        showMessage("success", "Profile updated successfully!");
      } else {
        showMessage("error", data.message || "Failed to update profile.");
      }
    } catch (err: any) {
      showMessage("error", err.message || "Network error updating profile.");
    } finally {
      setIsSaving(false);
    }
  };

  // --- Address Management Functions ---
  const resetAddressFormData = () => {
    setAddressFormData({
      street: "",
      city: "",
      state: "",
      zipCode: "",
      country: "",
      label: "Home",
      isDefault: false,
    });
  };

  const enterEditMode = (address: IAddress) => {
    if (editingAddressId !== null) {
      showMessage(
        "error",
        "Please save or cancel the current address edit before editing another."
      );
      return;
    }
    setEditingAddressId(formatObjectId(address._id) || "new");
    setAddressFormData({ ...address });
  };

  const exitEditMode = (addressId: string) => {
    setEditingAddressId(null);
    resetAddressFormData();
    if (addressId.startsWith("new-")) {
      setAddresses((prevAddresses) =>
        prevAddresses.filter((addr) => formatObjectId(addr._id) !== addressId)
      );
    }
  };

  const addNewAddressForm = () => {
    if (editingAddressId !== null) {
      showMessage(
        "error",
        "Please save or cancel the current address edit before adding another."
      );
      return;
    }
    const newTempId = "new-" + Date.now().toString();
    const newAddress: IAddress = {
      _id: newTempId,
      street: "",
      city: "",
      state: "",
      zipCode: "",
      country: "",
      label: "Home",
      isDefault: false,
    };
    setAddresses((prevAddresses) => [...prevAddresses, newAddress]);
    setEditingAddressId(newTempId);
    setAddressFormData(newAddress);
  };

  const handleAddressFormFieldChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    setAddressFormData((prev) => ({
      ...prev,
      [name]:
        type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  const handleAddressSave = async (e: FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    let updatedAddresses: IAddress[];

    const currentAddressIndex = addresses.findIndex(
      (addr) => formatObjectId(addr._id) === editingAddressId
    );

    if (currentAddressIndex !== -1) {
      updatedAddresses = addresses.map((addr, index) =>
        index === currentAddressIndex
          ? { ...addressFormData, _id: formatObjectId(addr._id) }
          : addr
      );
    } else {
      updatedAddresses = [
        ...addresses,
        { ...addressFormData, _id: new Types.ObjectId().toString() },
      ];
    }

    if (addressFormData.isDefault) {
      updatedAddresses = updatedAddresses.map((addr) => ({
        ...addr,
        isDefault: formatObjectId(addr._id) === editingAddressId,
      }));
    }

    try {
      const response = await fetch("/api/users/me", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ addresses: updatedAddresses }),
      });
      const data = await response.json();

      if (data.success) {
        setUserProfile(data.data);
        setAddresses(data.data.addresses || []);
        showMessage(
          "success",
          `Address ${
            editingAddressId?.startsWith("new-") ? "added" : "updated"
          } successfully!`
        );
        setEditingAddressId(null);
        resetAddressFormData();
      } else {
        showMessage("error", data.message || "Failed to save address.");
      }
    } catch (err: any) {
      showMessage("error", err.message || "Network error saving address.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteAddress = async (addressId: string) => {
    if (!window.confirm("Are you sure you want to delete this address?")) {
      return;
    }
    setIsSaving(true);
    try {
      const updatedAddresses = addresses.filter(
        (addr) => formatObjectId(addr._id) !== addressId
      );

      const response = await fetch("/api/users/me", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ addresses: updatedAddresses }),
      });
      const data = await response.json();

      if (data.success) {
        setUserProfile(data.data);
        setAddresses(data.data.addresses || []);
        showMessage("success", "Address deleted successfully!");
      } else {
        showMessage("error", data.message || "Failed to delete address.");
      }
    } catch (err: any) {
      showMessage("error", err.message || "Network error deleting address.");
    } finally {
      setIsSaving(false);
    }
  };

  // --- Authentication Status Handling ---
  if (status === "loading") {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
        <Loader2 className="animate-spin text-secondary" size={48} />
        <p className="text-xl font-semibold text-gray-700 ml-4">
          Loading profile...
        </p>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4 text-center">
        <UserIcon size={64} className="text-primary mb-4" />
        <h1 className="text-3xl font-bold text-red-600 mb-4">Access Denied</h1>
        <p className="text-lg text-gray-700 mb-6 max-w-prose">
          Please log in to access and manage your profile details. Your
          personalized experience awaits!
        </p>
        <button
          onClick={() => signIn()}
          className="bg-secondary hover:bg-secondary-dark text-white font-bold py-3 px-8 rounded-lg shadow-xl transition duration-300 transform hover:scale-105"
        >
          Sign In Now
        </button>
      </div>
    );
  }

  // If user is authenticated but profile data is still loading
  if (loading || !userProfile) {
    return <Loader />;
  }

  // --- Main Profile UI ---
  return (
    <div className="min-h-screen bg-white p-4 sm:p-6 lg:p-8 flex items-center justify-center">
      <div className="max-w-4xl mx-auto w-full bg-white rounded-xl shadow-2xl p-6 sm:p-8 border border-gray-200">
        <h1 className="text-3xl font-extrabold text-primary mb-6 border-b pb-4 flex items-center justify-between">
          <span>
            <UserIcon size={32} className="mr-3 text-secondary inline-block" />{" "}
            Your Profile
          </span>
          <button
            onClick={() => signOut()}
            className="btn-bubble btn-bubble-secondary"
          >
            <span>
              <LogOut size={18} />
              <span className="text-sm">Logout</span>
            </span>
          </button>
        </h1>

        {message && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className={`p-4 rounded-lg mb-6 text-white text-lg font-medium shadow-md transition-opacity duration-300 ${
              message.type === "success" ? "bg-green-500" : "bg-red-500"
            }`}
          >
            {message.text}
          </motion.div>
        )}

        {/* Profile Picture & Basic Info Display */}
        <div className="flex flex-col items-center mb-8 bg-indigo-50 p-6 rounded-lg shadow-inner">
          <div className="relative w-36 h-36 rounded-full overflow-hidden border-4 border-secondary shadow-xl mb-4">
            <Image
              src={profilePicture || "/default_avtar.png"} // Use a default avatar if none provided
              alt="Profile Avatar"
              fill
              style={{ objectFit: "cover" }}
              className="rounded-full"
              onError={(e) => {
                (e.target as HTMLImageElement).src = "/default_avtar.png"; // Fallback on error
              }}
            />
          </div>
          <h2 className="text-2xl font-bold text-primary mb-2">
            {userProfile.firstName || userProfile.name || userProfile.email}{" "}
            {userProfile.lastName}
          </h2>
          <p className="text-gray-700 mb-1 font-medium">{userProfile.email}</p>
          {userProfile.phone && (
            <p className="text-gray-700 mb-1">Phone: {userProfile.phone}</p>
          )}
          {userProfile.role == "admin" && (
            <p className="text-gray-600 text-sm italic">
              Role:{" "}
              {userProfile.role.charAt(0).toUpperCase() +
                userProfile.role.slice(1)}
            </p>
          )}
        </div>

        {/* Edit Personal Information Form */}
        <section className="mb-8 p-6 bg-gray-50 rounded-lg shadow-sm border border-gray-100">
          <h3 className="text-xl font-semibold text-primary mb-4 border-b pb-3">
            Edit Personal Information
          </h3>
          <form onSubmit={handleProfileSubmit} className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="firstName"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  First Name
                </label>
                <input
                  type="text"
                  name="firstName"
                  id="firstName"
                  value={firstName}
                  onChange={handleProfileFieldChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-secondary focus:border-secondary sm:text-sm transition-colors duration-200"
                />
              </div>
              <div>
                <label
                  htmlFor="lastName"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Last Name
                </label>
                <input
                  type="text"
                  name="lastName"
                  id="lastName"
                  value={lastName}
                  onChange={handleProfileFieldChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-secondary focus:border-secondary sm:text-sm transition-colors duration-200"
                />
              </div>
            </div>
            <div>
              <label
                htmlFor="phone"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Phone Number
              </label>
              <input
                type="text"
                name="phone"
                id="phone"
                value={phone}
                onChange={handleProfileFieldChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-secondary focus:border-secondary sm:text-sm transition-colors duration-200"
              />
            </div>
            {/* Cloudinary Upload Section for Profile Picture */}
            <div className="border border-gray-200 p-4 rounded-md bg-gray-100">
              <p className="text-md font-semibold text-primary mb-3">
                Upload Profile Picture
              </p>
              <div className="flex items-center space-x-3 mb-3">
                <input
                  type="file"
                  id="profilePictureUpload"
                  name="profilePictureUpload"
                  accept="image/*"
                  onChange={handleProfileFileChange}
                  className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-white focus:outline-none file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-white hover:file:bg-primary-dark transition-colors duration-200"
                />
                <button
                  type="button"
                  onClick={handleProfileUploadClick}
                  disabled={!selectedProfileFile || isProfileUploading}
                  className="p-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                  title="Upload to Cloudinary"
                >
                  {isProfileUploading ? (
                    <Loader2 size={20} className="animate-spin" />
                  ) : (
                    <UploadCloud size={20} />
                  )}
                </button>
              </div>

              {isProfileUploading && (
                <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
                  <div
                    className="bg-green-400 h-2.5 rounded-full transition-all duration-500"
                    style={{ width: `${profileUploadProgress}%` }}
                  ></div>
                </div>
              )}
              {profileUploadError && (
                <p className="text-red-500 text-sm mt-1">
                  {profileUploadError}
                </p>
              )}
              {profilePicture && !isProfileUploading && !profileUploadError && (
                <p className="text-green-600 text-sm mt-1 truncate">
                  Uploaded URL: {profilePicture.substring(0, 50)}...
                </p>
              )}
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="submit"
                className="bg-secondary hover:bg-secondary-dark text-white font-bold py-2.5 px-6 rounded-lg shadow-md transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                disabled={isSaving || isProfileUploading} // Disable if saving or uploading
              >
                {isSaving || isProfileUploading ? (
                  <>
                    <Loader2 className="animate-spin mr-2" size={20} />{" "}
                    Saving...
                  </>
                ) : (
                  "Save Changes"
                )}
              </button>
            </div>
          </form>
        </section>

        {/* Address Management Section - Inline Editing */}
        <section className="mb-8 p-6 bg-gray-50 rounded-lg shadow-sm border border-gray-100">
          <h3 className="text-xl font-semibold text-primary mb-4 flex justify-between items-center border-b pb-3">
            Your Addresses
            <button
              onClick={addNewAddressForm}
              disabled={editingAddressId !== null} // Disable if another address is being edited
              className="bg-secondary hover:bg-primary text-white font-bold py-2 px-4 rounded-md shadow-md transition duration-300 flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Plus size={20} className="mr-2" /> Add New Address
            </button>
          </h3>
          <div className="space-y-4">
            {addresses.length === 0 && editingAddressId === null ? (
              <p className="text-gray-500 italic text-center py-4">
                No addresses added yet. Click &quot;Add New Address&quot; to get
                started!
              </p>
            ) : (
              addresses.map((address) => (
                <motion.div
                  key={formatObjectId(address._id) || Math.random().toString()} // Ensure key is string
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                  className="border border-gray-200 rounded-lg p-4 bg-white shadow-sm"
                >
                  {editingAddressId === formatObjectId(address._id) ? (
                    // Inline Edit Form for Address
                    <form onSubmit={handleAddressSave} className="space-y-4">
                      <h4 className="text-lg font-bold text-primary mb-4">
                        {formatObjectId(address._id)?.startsWith("new-")
                          ? "Add Address"
                          : "Edit Address"}
                      </h4>
                      <div>
                        <label
                          htmlFor={`street-${formatObjectId(address._id)}`}
                          className="block text-sm font-medium text-gray-700 mb-1"
                        >
                          Street
                        </label>
                        <input
                          type="text"
                          name="street"
                          id={`street-${formatObjectId(address._id)}`}
                          value={addressFormData.street}
                          onChange={handleAddressFormFieldChange}
                          required
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-secondary focus:border-secondary sm:text-sm"
                        />
                      </div>
                      <div>
                        <label
                          htmlFor={`apartment-${formatObjectId(address._id)}`}
                          className="block text-sm font-medium text-gray-700 mb-1"
                        >
                          Apartment, Suite, etc. (Optional)
                        </label>
                        <input
                          type="text"
                          name="apartment"
                          id={`apartment-${formatObjectId(address._id)}`}
                          value={addressFormData.apartment || ""} // Use || '' to handle undefined
                          onChange={handleAddressFormFieldChange}
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-secondary focus:border-secondary sm:text-sm"
                        />
                      </div>
                      <div>
                        <label
                          htmlFor={`city-${formatObjectId(address._id)}`}
                          className="block text-sm font-medium text-gray-700 mb-1"
                        >
                          City
                        </label>
                        <input
                          type="text"
                          name="city"
                          id={`city-${formatObjectId(address._id)}`}
                          value={addressFormData.city}
                          onChange={handleAddressFormFieldChange}
                          required
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-secondary focus:border-secondary sm:text-sm"
                        />
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label
                            htmlFor={`state-${formatObjectId(address._id)}`}
                            className="block text-sm font-medium text-gray-700 mb-1"
                          >
                            State
                          </label>
                          <input
                            type="text"
                            name="state"
                            id={`state-${formatObjectId(address._id)}`}
                            value={addressFormData.state}
                            onChange={handleAddressFormFieldChange}
                            required
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-secondary focus:border-secondary sm:text-sm"
                          />
                        </div>
                        <div>
                          <label
                            htmlFor={`zipCode-${formatObjectId(address._id)}`}
                            className="block text-sm font-medium text-gray-700 mb-1"
                          >
                            Zip Code
                          </label>
                          <input
                            type="text"
                            name="zipCode"
                            id={`zipCode-${formatObjectId(address._id)}`}
                            value={addressFormData.zipCode}
                            onChange={handleAddressFormFieldChange}
                            required
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-secondary focus:border-secondary sm:text-sm"
                          />
                        </div>
                      </div>
                      <div>
                        <label
                          htmlFor={`country-${formatObjectId(address._id)}`}
                          className="block text-sm font-medium text-gray-700 mb-1"
                        >
                          Country
                        </label>
                        <input
                          type="text"
                          name="country"
                          id={`country-${formatObjectId(address._id)}`}
                          value={addressFormData.country}
                          onChange={handleAddressFormFieldChange}
                          required
                          className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-secondary focus:border-secondary sm:text-sm"
                        />
                      </div>
                      <div>
                        <label
                          htmlFor={`label-${formatObjectId(address._id)}`}
                          className="block text-sm font-medium text-gray-700 mb-1"
                        >
                          Label
                        </label>
                        <select
                          name="label"
                          id={`label-${formatObjectId(address._id)}`}
                          value={addressFormData.label}
                          onChange={handleAddressFormFieldChange}
                          className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-secondary focus:border-secondary sm:text-sm"
                        >
                          <option value="Home">Home</option>
                          <option value="Work">Work</option>
                          <option value="Other">Other</option>
                        </select>
                      </div>
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          name="isDefault"
                          id={`isDefault-${formatObjectId(address._id)}`}
                          checked={addressFormData.isDefault}
                          onChange={handleAddressFormFieldChange}
                          className="h-4 w-4 text-secondary focus:ring-secondary border-gray-300 rounded"
                        />
                        <label
                          htmlFor={`isDefault-${formatObjectId(address._id)}`}
                          className="ml-2 block text-sm text-gray-900"
                        >
                          Set as default address
                        </label>
                      </div>

                      <div className="flex justify-end space-x-4 pt-4 border-t border-gray-200">
                        <button
                          type="button"
                          onClick={() =>
                            exitEditMode(formatObjectId(address._id) as string)
                          }
                          className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-5 rounded-md shadow-sm transition duration-300"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          className="bg-secondary hover:bg-secondary-dark text-white font-bold py-2 px-5 rounded-md shadow-md transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                          disabled={isSaving}
                        >
                          {isSaving ? (
                            <Loader2
                              className="animate-spin mr-2 inline"
                              size={20}
                            />
                          ) : (
                            <>
                              <Save size={20} className="mr-2" /> Save Address
                            </>
                          )}
                        </button>
                      </div>
                    </form>
                  ) : (
                    // Display Mode for Address
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-4">
                      <div className="flex-1">
                        <p className="font-semibold text-lg text-gray-900">
                          {address.label || "Address"}
                          {address.isDefault && (
                            <span className="ml-3 text-sm bg-blue-100 text-blue-800 px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wide">
                              Default
                            </span>
                          )}
                        </p>
                        <p className="text-gray-700">
                          {address.street}, {address.city}, {address.state} -{" "}
                          {address.zipCode}
                        </p>
                        <p className="text-gray-700">{address.country}</p>
                      </div>
                      <div className="flex space-x-2 mt-3 sm:mt-0">
                        <button
                          onClick={() => enterEditMode(address)}
                          disabled={editingAddressId !== null} // Disable edit button if another address is being edited
                          className="text-blue-600 hover:text-blue-800 p-2 rounded-full hover:bg-blue-50 transition duration-200 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                          title="Edit Address"
                        >
                          <Edit size={20} />
                        </button>
                        <button
                          onClick={() =>
                            handleDeleteAddress(
                              formatObjectId(address._id) as string
                            )
                          }
                          disabled={editingAddressId !== null} // Disable delete button if another address is being edited
                          className="text-red-600 hover:text-red-800 p-2 rounded-full hover:bg-red-50 transition duration-200 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                          title="Delete Address"
                        >
                          <Trash2 size={20} />
                        </button>
                      </div>
                    </div>
                  )}
                </motion.div>
              ))
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
