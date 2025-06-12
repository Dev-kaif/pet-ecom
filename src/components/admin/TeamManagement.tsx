/* eslint-disable @typescript-eslint/no-explicit-any */
// src/components/admin/TeamManagement.tsx
import React, { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { Plus, X, UploadCloud, Loader2 } from "lucide-react"; // Import new icons
import { motion, AnimatePresence } from "framer-motion";
import { ITeamMember } from "@/types";
import { Types } from "mongoose";
import { CLOUDINARY_CLOUD_NAME, CLOUDINARY_UPLOAD_PRESET } from "@/backend/lib/config";

const formatObjectId = (id: Types.ObjectId | string | undefined): string => {
  if (typeof id === "string") {
    return id;
  }
  if (id instanceof Types.ObjectId) {
    return id.toString();
  }
  return "";
};

interface TeamManagementProps {
  showMessage: (type: "success" | "error", text: string) => void;
}

// Define form data type for team members
type TeamMemberFormData = Omit<
  ITeamMember,
  "_id" | "createdAt" | "updatedAt"
> & {
  // Ensure nested objects are initialized for form binding
  contact: {
    phone: string;
    email: string;
    address: string;
    social: {
      facebook: string;
      twitter: string;
      instagram: string;
      youtube: string;
    };
  };
};

const TeamManagement: React.FC<TeamManagementProps> = ({ showMessage }) => {
  const [teamMembers, setTeamMembers] = useState<ITeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentTeamMember, setCurrentTeamMember] =
    useState<ITeamMember | null>(null);
  const [newTeamMemberData, setNewTeamMemberData] =
    useState<TeamMemberFormData>({
      name: "",
      title: "",
      description: "",
      experience: "",
      imageUrl: "",
      showOnHome: false,
      contact: {
        phone: "",
        email: "",
        address: "",
        social: {
          facebook: "",
          twitter: "",
          instagram: "",
          youtube: "",
        },
      },
    });

  // State for Cloudinary upload
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadError, setUploadError] = useState<string | null>(null);

  // Helper function to upload a file to Cloudinary
  const uploadFileToCloudinary = useCallback(async (file: File) => {
    if (!file) return null;

    setIsUploading(true);
    setUploadProgress(0);
    setUploadError(null);

    if (!CLOUDINARY_CLOUD_NAME || CLOUDINARY_CLOUD_NAME === "your_cloudinary_cloud_name") {
        setUploadError("Cloudinary cloud name is not configured.");
        showMessage("error", "Cloudinary cloud name is not configured. Please check environment variables.");
        setIsUploading(false);
        return null;
    }
    if (!CLOUDINARY_UPLOAD_PRESET || CLOUDINARY_UPLOAD_PRESET === "your_cloudinary_upload_preset") {
        setUploadError("Cloudinary upload preset is not configured.");
        showMessage("error", "Cloudinary upload preset is not configured. Please check environment variables.");
        setIsUploading(false);
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
        throw new Error(errorData.error.message || "Cloudinary upload failed.");
      }

      const data = await response.json();
      setUploadProgress(100);
      showMessage("success", "Image uploaded to Cloudinary successfully!");
      setSelectedFile(null); // Clear selected file after successful upload
      return data.secure_url;
    } catch (err: any) {
      setUploadError(err.message || "Failed to upload image to Cloudinary.");
      showMessage("error", err.message || "Failed to upload image to Cloudinary.");
      return null;
    } finally {
      setIsUploading(false);
    }
  }, [showMessage]);


  const fetchTeamMembers = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/team");
      const data = await response.json();
      if (data.success) {
        setTeamMembers(data.data);
      } else {
        setError(data.message || "Failed to fetch team members.");
        showMessage("error", data.message || "Failed to fetch team members.");
      }
    } catch (err: any) {
      setError(err.message || "Network error fetching team members.");
      showMessage(
        "error",
        err.message || "Network error fetching team members."
      );
    } finally {
      setLoading(false);
    }
  }, [showMessage]);

  useEffect(() => {
    fetchTeamMembers();
  }, [fetchTeamMembers]);

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value, type, checked } = e.target as HTMLInputElement;

    // Handle nested contact and social fields
    if (name.startsWith("contact.")) {
      const contactFieldName = name.split(".")[1];
      if (contactFieldName.startsWith("social.")) {
        const socialFieldName = contactFieldName.split(".")[1];
        setNewTeamMemberData((prev) => ({
          ...prev,
          contact: {
            ...prev.contact,
            social: {
              ...prev.contact.social,
              [socialFieldName]: value,
            },
          },
        }));
      } else {
        setNewTeamMemberData((prev) => ({
          ...prev,
          contact: {
            ...prev.contact,
            [contactFieldName]: value,
          },
        }));
      }
    } else if (type === "checkbox") {
      setNewTeamMemberData((prev) => ({
        ...prev,
        [name]: checked,
      }));
    } else {
      setNewTeamMemberData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  // Handle file selection for image upload
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
      setUploadError(null);
    } else {
      setSelectedFile(null);
    }
  };

  // Trigger image upload
  const handleUploadClick = async () => {
    if (selectedFile) {
      const url = await uploadFileToCloudinary(selectedFile);
      if (url) {
        setNewTeamMemberData((prev) => ({
          ...prev,
          imageUrl: url, // Set the uploaded URL to imageUrl
        }));
      }
    }
  };


  const handleAddTeamMember = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (!newTeamMemberData.imageUrl.trim()) {
        showMessage("error", "Please upload an image or provide an Image URL.");
        setLoading(false);
        return;
    }

    try {
      // Logic to enforce max 4 members on home before sending
      if (newTeamMemberData.showOnHome) {
        const currentHomeMembers = teamMembers.filter(
          (member) => member.showOnHome
        ).length;
        if (currentHomeMembers >= 4) {
          showMessage(
            "error",
            "Cannot add more than 4 team members to show on home."
          );
          setLoading(false);
          return;
        }
      }

      const response = await fetch("/api/team", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newTeamMemberData),
      });
      const data = await response.json();
      if (data.success) {
        showMessage("success", "Team member added successfully!");
        // Reset form
        setNewTeamMemberData({
          name: "",
          title: "",
          description: "",
          experience: "",
          imageUrl: "",
          showOnHome: false,
          contact: {
            phone: "",
            email: "",
            address: "",
            social: {
              facebook: "",
              twitter: "",
              instagram: "",
              youtube: "",
            },
          },
        });
        setSelectedFile(null); // Clear selected file
        setUploadProgress(0); // Reset progress
        setIsModalOpen(false);
        fetchTeamMembers();
      } else {
        showMessage("error", data.message || "Failed to add team member.");
      }
    } catch (err: any) {
      showMessage("error", err.message || "Network error adding team member.");
    } finally {
      setLoading(false);
    }
  };

  const handleEditTeamMember = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentTeamMember?._id) return;

    setLoading(true);

    if (!newTeamMemberData.imageUrl.trim()) {
        showMessage("error", "Image URL cannot be empty for update.");
        setLoading(false);
        return;
    }

    try {
      // Logic to enforce max 4 members on home before sending
      if (newTeamMemberData.showOnHome) {
        const currentHomeMembers = teamMembers.filter(
          (member) =>
            member.showOnHome &&
            formatObjectId(member._id) !== formatObjectId(currentTeamMember._id)
        ).length;
        if (currentHomeMembers >= 4) {
          showMessage(
            "error",
            "Cannot mark more than 4 team members to show on home."
          );
          setLoading(false);
          return;
        }
      }

      const response = await fetch(
        `/api/team/${formatObjectId(currentTeamMember._id)}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(newTeamMemberData),
        }
      );
      const data = await response.json();
      if (data.success) {
        showMessage("success", "Team member updated successfully!");
        setIsModalOpen(false);
        setCurrentTeamMember(null);
        setSelectedFile(null); // Clear selected file
        setUploadProgress(0); // Reset progress
        fetchTeamMembers();
      } else {
        showMessage("error", data.message || "Failed to update team member.");
      }
    } catch (err: any) {
      showMessage(
        "error",
        err.message || "Network error updating team member."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteTeamMember = async (teamMemberId: string) => {
    if (!teamMemberId) {
      showMessage("error", "Team Member ID is missing.");
      return;
    }
    if (!window.confirm("Are you sure you want to delete this team member?"))
      return;

    setLoading(true);
    try {
      const response = await fetch(`/api/team/${teamMemberId}`, {
        method: "DELETE",
      });
      const data = await response.json();
      if (data.success) {
        showMessage("success", "Team member deleted successfully!");
        fetchTeamMembers();
      } else {
        showMessage("error", data.message || "Failed to delete team member.");
      }
    } catch (err: any) {
      showMessage(
        "error",
        err.message || "Network error deleting team member."
      );
    } finally {
      setLoading(false);
    }
  };

  const resetUploadStates = () => {
    setSelectedFile(null);
    setIsUploading(false);
    setUploadProgress(0);
    setUploadError(null);
  };

  const openAddModal = () => {
    setCurrentTeamMember(null);
    setNewTeamMemberData({
      name: "",
      title: "",
      description: "",
      experience: "",
      imageUrl: "",
      showOnHome: false,
      contact: {
        phone: "",
        email: "",
        address: "",
        social: {
          facebook: "",
          twitter: "",
          instagram: "",
          youtube: "",
        },
      },
    });
    resetUploadStates(); // Reset upload states when opening for add
    setIsModalOpen(true);
  };

  const openEditModal = (member: ITeamMember) => {
    setCurrentTeamMember(member);
    setNewTeamMemberData({
      name: member.name,
      title: member.title,
      description: member.description,
      experience: member.experience,
      imageUrl: member.imageUrl,
      showOnHome: member.showOnHome || false, // Ensure it's a boolean
      contact: {
        phone: member.contact.phone,
        email: member.contact.email,
        address: member.contact.address,
        social: {
          facebook: member.contact.social?.facebook || "",
          twitter: member.contact.social?.twitter || "",
          instagram: member.contact.social?.instagram || "",
          youtube: member.contact.social?.youtube || "",
        },
      },
    });
    resetUploadStates(); // Reset upload states when opening for edit
    setIsModalOpen(true);
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
      <div className="flex justify-between items-center mb-6 border-b pb-4">
        <h2 className="text-2xl font-bold text-primary">Team Member List</h2>
        <button
          onClick={openAddModal}
          className="bg-secondary hover:bg-secondary-dark text-white font-bold py-2 px-6 rounded-lg shadow-md transition duration-300 flex items-center"
        >
          <Plus size={20} className="mr-2" /> Add New Member
        </button>
      </div>

      {loading && (
        <p className="text-gray-600 py-8 text-center">
          Loading team members...
        </p>
      )}
      {error && <p className="text-red-600 py-8 text-center">Error: {error}</p>}

      {!loading && !error && teamMembers.length === 0 && (
        <p className="text-gray-600 py-8 text-center">
          No team members found. Add one!
        </p>
      )}

      {!loading && !error && teamMembers.length > 0 && (
        <div className="overflow-x-auto rounded-lg shadow-md border border-gray-200">
          <table className="min-w-full bg-white">
            <thead className="bg-primary text-white">
              <tr>
                <th className="py-3 px-4 text-left text-sm font-semibold rounded-tl-lg">
                  Name
                </th>
                <th className="py-3 px-4 text-left text-sm font-semibold">
                  Title
                </th>
                <th className="py-3 px-4 text-left text-sm font-semibold">
                  Email
                </th>
                <th className="py-3 px-4 text-left text-sm font-semibold">
                  Show on Home
                </th>
                <th className="py-3 px-4 text-left text-sm font-semibold rounded-tr-lg">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {teamMembers.map((member) => (
                <tr
                  key={formatObjectId(member._id)}
                  className="border-b border-gray-200 hover:bg-gray-50 transition-colors duration-150"
                >
                  <td className="py-3 px-4 text-gray-800 text-sm font-medium">
                    {member.name}
                  </td>
                  <td className="py-3 px-4 text-gray-700 text-sm">
                    {member.title}
                  </td>
                  <td className="py-3 px-4 text-gray-700 text-sm">
                    {member.contact?.email}
                  </td>
                  <td className="py-3 px-4 text-gray-700 text-sm">
                    {member.showOnHome ? "Yes" : "No"}
                  </td>
                  <td className="py-3 px-4 text-sm flex gap-2">
                    <button
                      onClick={() => openEditModal(member)}
                      className="bg-yellow-500 hover:bg-yellow-600 text-white font-semibold py-1 px-3 rounded-md transition duration-300 shadow-sm"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() =>
                        handleDeleteTeamMember(formatObjectId(member._id))
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

      {/* Team Member Add/Edit Modal */}
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
                {currentTeamMember ? "Edit Team Member" : "Add New Team Member"}
              </h3>
              <div className="overflow-y-auto pr-2 custom-scrollbar">
                <form
                  onSubmit={
                    currentTeamMember
                      ? handleEditTeamMember
                      : handleAddTeamMember
                  }
                  className="space-y-6"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label
                        htmlFor="name"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Name
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={newTeamMemberData.name}
                        onChange={handleInputChange}
                        required
                        className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-secondary focus:border-secondary sm:text-sm"
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="title"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Title
                      </label>
                      <input
                        type="text"
                        id="title"
                        name="title"
                        value={newTeamMemberData.title}
                        onChange={handleInputChange}
                        required
                        className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-secondary focus:border-secondary sm:text-sm"
                      />
                    </div>

                    {/* Cloudinary Upload Section for imageUrl */}
                    <div className="md:col-span-2 border border-gray-200 p-4 rounded-md bg-gray-50">
                      <p className="text-lg font-semibold text-primary mb-4">
                        Team Member Image
                      </p>
                      <div className="flex items-center space-x-2 mb-4">
                        <input
                          type="file"
                          id="imageUpload"
                          name="imageUpload"
                          accept="image/*"
                          onChange={handleFileChange}
                          className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 focus:outline-none file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-white hover:file:bg-primary-dark"
                        />
                        <button
                          type="button"
                          onClick={handleUploadClick}
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

                      {/* Displaying the Image URL (read-only) and Preview */}
                      {newTeamMemberData.imageUrl && (
                        <>
                          <label
                            htmlFor="imageUrl"
                            className="block text-sm font-medium text-gray-700 mb-1 mt-3"
                          >
                            Image URL (Automatically populated after upload)
                          </label>
                          <input
                            type="url"
                            id="imageUrl"
                            name="imageUrl"
                            value={newTeamMemberData.imageUrl}
                            readOnly
                            required
                            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm bg-gray-100 cursor-not-allowed sm:text-sm"
                            placeholder="Upload an image above"
                          />
                          <div className="mt-3 w-28 h-28 rounded-lg overflow-hidden border border-gray-300 flex items-center justify-center bg-white shadow-sm">
                            <Image
                              src={newTeamMemberData.imageUrl}
                              alt="Image Preview"
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
                        </>
                      )}
                    </div>
                    <div className="flex items-center self-end mb-4">
                      <input
                        type="checkbox"
                        id="showOnHome"
                        name="showOnHome"
                        checked={newTeamMemberData.showOnHome}
                        onChange={handleInputChange}
                        className="h-5 w-5 text-secondary focus:ring-secondary border-gray-300 rounded"
                      />
                      <label
                        htmlFor="showOnHome"
                        className="ml-2 block text-sm font-medium text-gray-700"
                      >
                        Show on Home Page
                      </label>
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
                      value={newTeamMemberData.description}
                      onChange={handleInputChange}
                      rows={3}
                      required
                      className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-secondary focus:border-secondary sm:text-sm"
                    ></textarea>
                  </div>

                  <div>
                    <label
                      htmlFor="experience"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Experience
                    </label>
                    <textarea
                      id="experience"
                      name="experience"
                      value={newTeamMemberData.experience}
                      onChange={handleInputChange}
                      rows={3}
                      required
                      className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-secondary focus:border-secondary sm:text-sm"
                    ></textarea>
                  </div>

                  {/* Contact Information */}
                  <div className="border border-gray-200 p-4 rounded-md bg-gray-50">
                    <p className="text-lg font-semibold text-primary mb-4">
                      Contact Information
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label
                          htmlFor="contact.phone"
                          className="block text-sm font-medium text-gray-700 mb-1"
                        >
                          Phone
                        </label>
                        <input
                          type="tel"
                          id="contact.phone"
                          name="contact.phone"
                          value={newTeamMemberData.contact.phone}
                          onChange={handleInputChange}
                          required
                          className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-secondary focus:border-secondary sm:text-sm"
                        />
                      </div>
                      <div>
                        <label
                          htmlFor="contact.email"
                          className="block text-sm font-medium text-gray-700 mb-1"
                        >
                          Email
                        </label>
                        <input
                          type="email"
                          id="contact.email"
                          name="contact.email"
                          value={newTeamMemberData.contact.email}
                          onChange={handleInputChange}
                          required
                          className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-secondary focus:border-secondary sm:text-sm"
                        />
                      </div>
                      <div className="md:col-span-2">
                        <label
                          htmlFor="contact.address"
                          className="block text-sm font-medium text-gray-700 mb-1"
                        >
                          Address
                        </label>
                        <input
                          type="text"
                          id="contact.address"
                          name="contact.address"
                          value={newTeamMemberData.contact.address}
                          onChange={handleInputChange}
                          required
                          className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-secondary focus:border-secondary sm:text-sm"
                        />
                      </div>
                    </div>

                    {/* Social Media Links */}
                    <div className="mt-6 border-t pt-4 border-gray-200">
                      <p className="text-md font-semibold text-primary mb-3">
                        Social Media Links (Optional)
                      </p>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label
                            htmlFor="contact.social.facebook"
                            className="block text-sm font-medium text-gray-700 mb-1"
                          >
                            Facebook URL
                          </label>
                          <input
                            type="url"
                            id="contact.social.facebook"
                            name="contact.social.facebook"
                            value={newTeamMemberData.contact.social.facebook}
                            onChange={handleInputChange}
                            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-secondary focus:border-secondary sm:text-sm"
                          />
                        </div>
                        <div>
                          <label
                            htmlFor="contact.social.twitter"
                            className="block text-sm font-medium text-gray-700 mb-1"
                          >
                            Twitter URL
                          </label>
                          <input
                            type="url"
                            id="contact.social.twitter"
                            name="contact.social.twitter"
                            value={newTeamMemberData.contact.social.twitter}
                            onChange={handleInputChange}
                            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-secondary focus:border-secondary sm:text-sm"
                          />
                        </div>
                        <div>
                          <label
                            htmlFor="contact.social.instagram"
                            className="block text-sm font-medium text-gray-700 mb-1"
                          >
                            Instagram URL
                          </label>
                          <input
                            type="url"
                            id="contact.social.instagram"
                            name="contact.social.instagram"
                            value={newTeamMemberData.contact.social.instagram}
                            onChange={handleInputChange}
                            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-secondary focus:border-secondary sm:text-sm"
                          />
                        </div>
                        <div>
                          <label
                            htmlFor="contact.social.youtube"
                            className="block text-sm font-medium text-gray-700 mb-1"
                          >
                            Youtube URL
                          </label>
                          <input
                            type="url"
                            id="contact.social.youtube"
                            name="contact.social.youtube"
                            value={newTeamMemberData.contact.social.youtube}
                            onChange={handleInputChange}
                            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-secondary focus:border-secondary sm:text-sm"
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
                      disabled={loading || isUploading || !newTeamMemberData.imageUrl.trim()} // Disable if uploading or no image URL
                    >
                      {loading || isUploading
                        ? "Saving..."
                        : currentTeamMember
                        ? "Update Member"
                        : "Add Member"}
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

export default TeamManagement;
