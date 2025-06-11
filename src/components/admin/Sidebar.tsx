// src/components/admin/Sidebar.tsx
import React from "react";
import { X, Package, ShoppingBag, PawPrint, Users } from "lucide-react"; // Import Users icon
import { motion, AnimatePresence } from "framer-motion"; // Correct import for Framer Motion

interface SidebarProps {
  activeTab: "products" | "orders" | "pets" | "team"; 
  setActiveTab: (tab: "products" | "orders" | "pets" | "team") => void;
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
                <Package size={20} className="mr-3" /> Product Management
              </button>
            </li>
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
                <ShoppingBag size={20} className="mr-3" /> Order Management
              </button>
            </li>
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
                <PawPrint size={20} className="mr-3" /> Pet Management
              </button>
            </li>
            {/* New Team Management Tab */}
            <li>
              <button
                onClick={() => {
                  setActiveTab("team"); // Set active tab to 'team'
                  if (window.innerWidth < 1024) toggleSidebar();
                }}
                className={`flex items-center w-full px-4 py-3 rounded-lg text-lg font-medium transition-colors duration-200 ${
                  activeTab === "team"
                    ? "bg-secondary text-white shadow-md"
                    : "text-primary hover:bg-gray-100 hover:text-secondary"
                }`}
              >
                <Users size={20} className="mr-3" /> Team Management
              </button>
            </li>
          </ul>
        </nav>
        <div className="mt-8 text-center text-gray-500 text-sm">
          © {new Date().getFullYear()} AdminPro. All rights reserved.
        </div>
      </aside>
    </>
  );
};

export default Sidebar;