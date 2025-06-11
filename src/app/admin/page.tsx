"use client";
import React, { useState, useCallback } from "react";
import { useSession, signIn, signOut } from "next-auth/react";
import { AuthenticatedUser } from "@/types";
import { Menu } from "lucide-react";
import { useRouter } from "next/navigation";

// Import the new components
import Sidebar from "@/components/admin/Sidebar";
import ProductManagement from "@/components/admin/ProductManagement";
import OrderManagement from "@/components/admin/OrderManagement";
import PetManagement from "@/components/admin/PetManagement";
import TeamManagement from "@/components/admin/TeamManagement"; // Import TeamManagement

export default function App() {
  const router = useRouter();

  const { data: session, status } = useSession();
  // --- CHANGE 1: Update activeTab state type to include 'team' ---
  const [activeTab, setActiveTab] = useState<"products" | "orders" | "pets" | "team">(
    "products"
  );
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const showMessage = useCallback(
    (type: "success" | "error", text: string) => {
      setMessage({ type, text });
      setTimeout(() => setMessage(null), 5000);
    },
    []
  );

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

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
          className="bg-secondary hover:bg-secondary-dark text-white font-bold py-3 px-8 rounded-lg shadow-xl transition duration-300 transform hover:scale-105"
        >
          Sign In
        </button>
      </div>
    );
  }

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
          className="bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-8 rounded-lg shadow-xl transition duration-300 transform hover:scale-105"
        >
          Sign Out
        </button>
      </div>
    );
  }

  // --- Admin Dashboard UI ---
  return (
    <div className="flex min-h-screen bg-gray-100 font-sans">
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isOpen={isSidebarOpen}
        toggleSidebar={toggleSidebar}
      />

      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white shadow-sm p-4 flex items-center justify-between lg:justify-end sticky top-0 z-30">
          <button onClick={toggleSidebar} className="lg:hidden text-primary">
            <Menu size={28} />
          </button>
          <h1 className="text-2xl font-bold text-primary lg:hidden">
            Admin Dashboard
          </h1>
          <div className="flex items-center space-x-4">
            <span className="text-gray-700 hidden sm:block">
              Welcome, {(session.user as AuthenticatedUser)?.name || "Admin"}!
            </span>

            <button
              onClick={() => router.push("/")}
              className=" text-white bg-gray-500 font-bold py-2 px-4 rounded-md shadow-md "
            >
              Go to Home
            </button>

            <button
              onClick={() => signOut()}
              className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-md shadow-md transition duration-300"
            >
              Sign Out
            </button>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto p-4 sm:p-6 lg:p-8">
          <div className="max-w-7xl mx-auto">
            <h1 className="text-3xl font-extrabold text-primary mb-6 hidden lg:block">
              Admin Dashboard
            </h1>
            {message && (
              <div
                className={`p-4 rounded-lg mb-6 text-white text-lg font-medium shadow-md transition-opacity duration-300 ${
                  message.type === "success" ? "bg-green-500" : "bg-red-500"
                }`}
              >
                {message.text}
              </div>
            )}

            {/* Render components based on activeTab */}
            {activeTab === "products" && (
              <ProductManagement showMessage={showMessage} />
            )}
            {activeTab === "orders" && (
              <OrderManagement showMessage={showMessage} />
            )}
            {activeTab === "pets" && (
              <PetManagement showMessage={showMessage} />
            )}
            {/* --- CHANGE 2: Add conditional rendering for TeamManagement --- */}
            {activeTab === "team" && (
              <TeamManagement showMessage={showMessage} />
            )}
          </div>
        </main>
      </div>
    </div>
  );
}