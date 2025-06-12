// src/components/admin/Sidebar.tsx
import React from "react";
// Import Home icon for Dashboard
import { X, Package, ShoppingBag, PawPrint, Users, Image as ImageIcon, Home, CalendarCheck } from "lucide-react"; // Import CalendarCheck for Appointments
import { motion, AnimatePresence } from "framer-motion";

interface SidebarProps {
  activeTab: "dashboard" | "products" | "orders" | "pets" | "team" | "gallery" | "appointments";
  setActiveTab: (tab: "dashboard" | "products" | "orders" | "pets" | "team" | "gallery" | "appointments") => void;
  isOpen: boolean;
  toggleSidebar: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  isOpen,
  toggleSidebar,
}) => {
  return (
    <>
      {/* Mobile Overlay with Framer Motion for opacity */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
            onClick={toggleSidebar}
          ></motion.div>
        )}
      </AnimatePresence>

      <aside
        className={`fixed inset-y-0 left-0 transform ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0 lg:static lg:w-64 w-64 bg-white text-primary p-6 flex flex-col transition-transform duration-300 ease-in-out z-50 shadow-lg`}
      >
        <div className="flex items-center justify-between lg:justify-center mb-10">
          <h2 className="text-3xl font-extrabold text-secondary">PetPal</h2>
          <button onClick={toggleSidebar} className="lg:hidden text-primary">
            <X size={28} />
          </button>
        </div>
        <nav className="flex-grow">
          <ul className="space-y-4">
            {/* Dashboard Tab */}
            <li>
              <button
                onClick={() => {
                  setActiveTab("dashboard");
                  if (window.innerWidth < 1024) toggleSidebar();
                }}
                className={`flex items-center w-full px-4 py-3 rounded-lg text-lg font-medium transition-colors duration-200 ${
                  activeTab === "dashboard"
                    ? "bg-secondary text-white shadow-md"
                    : "text-primary hover:bg-gray-100 hover:text-secondary"
                }`}
              >
                <Home size={20} className="mr-3" /> Dashboard
              </button>
            </li>
            {/* Products Tab */}
            <li>
              <button
                onClick={() => {
                  setActiveTab("products");
                  if (window.innerWidth < 1024) toggleSidebar();
                }}
                className={`flex items-center w-full px-4 py-3 rounded-lg text-lg font-medium transition-colors duration-200 ${
                  activeTab === "products"
                    ? "bg-secondary text-white shadow-md"
                    : "text-primary hover:bg-gray-100 hover:text-secondary"
                }`}
              >
                <Package size={20} className="mr-3" /> Products
              </button>
            </li>
            {/* Orders Tab */}
            <li>
              <button
                onClick={() => {
                  setActiveTab("orders");
                  if (window.innerWidth < 1024) toggleSidebar();
                }}
                className={`flex items-center w-full px-4 py-3 rounded-lg text-lg font-medium transition-colors duration-200 ${
                  activeTab === "orders"
                    ? "bg-secondary text-white shadow-md"
                    : "text-primary hover:bg-gray-100 hover:text-secondary"
                }`}
              >
                <ShoppingBag size={20} className="mr-3" /> Orders
              </button>
            </li>
            {/* Pets Tab */}
            <li>
              <button
                onClick={() => {
                  setActiveTab("pets");
                  if (window.innerWidth < 1024) toggleSidebar();
                }}
                className={`flex items-center w-full px-4 py-3 rounded-lg text-lg font-medium transition-colors duration-200 ${
                  activeTab === "pets"
                    ? "bg-secondary text-white shadow-md"
                    : "text-primary hover:bg-gray-100 hover:text-secondary"
                }`}
              >
                <PawPrint size={20} className="mr-3" /> Pets
              </button>
            </li>
            {/* NEW: Appointments Tab */}
            <li>
              <button
                onClick={() => {
                  setActiveTab("appointments");
                  if (window.innerWidth < 1024) toggleSidebar();
                }}
                className={`flex items-center w-full px-4 py-3 rounded-lg text-lg font-medium transition-colors duration-200 ${
                  activeTab === "appointments"
                    ? "bg-secondary text-white shadow-md"
                    : "text-primary hover:bg-gray-100 hover:text-secondary"
                }`}
              >
                <CalendarCheck size={20} className="mr-3" /> Appointments
              </button>
            </li>
            {/* Gallery Tab */}
            <li>
              <button
                onClick={() => {
                  setActiveTab("gallery");
                  if (window.innerWidth < 1024) toggleSidebar();
                }}
                className={`flex items-center w-full px-4 py-3 rounded-lg text-lg font-medium transition-colors duration-200 ${
                  activeTab === "gallery"
                    ? "bg-secondary text-white shadow-md"
                    : "text-primary hover:bg-gray-100 hover:text-secondary"
                }`}
              >
                <ImageIcon size={20} className="mr-3" /> Gallery
              </button>
            </li>
            {/* Team Tab */}
            <li>
              <button
                onClick={() => {
                  setActiveTab("team");
                  if (window.innerWidth < 1024) toggleSidebar();
                }}
                className={`flex items-center w-full px-4 py-3 rounded-lg text-lg font-medium transition-colors duration-200 ${
                  activeTab === "team"
                    ? "bg-secondary text-white shadow-md"
                    : "text-primary hover:bg-gray-100 hover:text-secondary"
                }`}
              >
                <Users size={20} className="mr-3" /> Team
              </button>
            </li>
          </ul>
        </nav>
      </aside>
    </>
  );
};

export default Sidebar;