// src/components/layout/MobileSidebar.tsx
import React, { useState } from "react";
import Link from "next/link";
import {
  X,
  Search,
  ChevronDown,
  ChevronUp,
  Facebook,
  Twitter,
  Instagram,
  Youtube,
  MessageCircle,
} from "lucide-react";
import { motion, AnimatePresence, Variants } from "framer-motion";
import Image from "next/image";

interface MobileSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  isActiveLink: (path: string, subPaths?: string[]) => boolean;
}

const navItems = [
  { name: "Home", href: "/" },
  { name: "About", href: "/about" },
  {
    name: "Shop",
    href: "/shop",
    dropdown: [
      { name: "All Products", href: "/shop" },
      { name: "Pet Food", href: "/shop/food" },
      { name: "Pet Toys", href: "/shop/toys" },
    ],
  },
  {
    name: "Pages",
    href: "#",
    dropdown: [
      { name: "All Pets", href: "/all-pets" },
      { name: "Pet Details", href: "/pet-details" },
      { name: "Gallery", href: "/gallery" },
      { name: "Faq Page", href: "/faq" },
      { name: "Pricing Page", href: "/pricing" },
      { name: "Reservation Page", href: "/reservation" },
      { name: "Our Team", href: "/our-team" },
      { name: "Team Details", href: "/team-details" },
      { name: "Our Blog", href: "/blog" },
      { name: "Blog Details", href: "/blog-details" },
      { name: "404 Error Page", href: "/404" },
    ],
  },
  { name: "Contact", href: "/contact" },
];

const sidebarVariants: Variants = {
  hidden: {
    x: "110%",
    transition: {
      type: "tween",
      duration: 0.3,
      ease: "easeOut",
    },
  },
  visible: {
    x: "0%", // Slide into view from the right
    transition: {
      type: "tween",
      duration: 0.3,
      ease: "easeOut",
    },
  },
};

const MobileSidebar: React.FC<MobileSidebarProps> = ({
  isOpen,
  onClose,
  isActiveLink,
}) => {
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  const toggleDropdown = (name: string) => {
    setOpenDropdown(openDropdown === name ? null : name);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div
            className="fixed inset-0 bg-black/50 bg-opacity-50 z-[99]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Mobile Sidebar */}
          <motion.div
            className="fixed top-0 right-0 h-full w-[280px] bg-white text-primary shadow-xl z-[100] flex flex-col overflow-y-auto" // Changed 'left-0' to 'right-0'
            variants={sidebarVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
          >
            {/* Header (Logo & Close Button) */}
            <div className="flex justify-between items-center p-4 border-b border-gray-200">
              <Link href="/" passHref onClick={onClose}>
                <Image
                  src="/images/logo/logo.png"
                  alt="PetPal Logo"
                  width={120}
                  height={40}
                />
              </Link>
              <button
                onClick={onClose}
                className="text-gray-700 hover:text-secondary transition-colors"
              >
                <X size={28} />
              </button>
            </div>

            {/* Search Bar */}
            <div className="p-4 border-b border-gray-200">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search here..."
                  className="w-full pl-4 pr-10 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-secondary focus:border-transparent text-sm"
                />
                <Search
                  size={18}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                />
              </div>
            </div>

            {/* Navigation Links */}
            <nav className="flex-grow">
              <ul className="text-lg font-bold text-primary">
                {navItems.map((item) => (
                  <li key={item.name} className="border-b border-gray-200">
                    {item.dropdown ? (
                      <>
                        <div
                          className="flex justify-between items-center px-4 py-3 cursor-pointer hover:bg-gray-50 transition-colors"
                          onClick={() => toggleDropdown(item.name)}
                        >
                          <span
                            className={`${
                              isActiveLink(
                                item.href,
                                item.dropdown.map((d) => d.href)
                              )
                                ? "text-secondary"
                                : ""
                            }`}
                          >
                            {item.name}
                          </span>
                          {openDropdown === item.name ? (
                            <ChevronUp size={20} className="text-gray-600" />
                          ) : (
                            <ChevronDown size={20} className="text-gray-600" />
                          )}
                        </div>
                        <AnimatePresence>
                          {openDropdown === item.name && (
                            <motion.ul
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: "auto", opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.2, ease: "easeOut" }}
                              className="bg-gray-50 overflow-hidden"
                            >
                              {item.dropdown.map((subItem) => (
                                <li key={subItem.name}>
                                  <Link href={subItem.href} passHref>
                                    <motion.div
                                      onClick={onClose}
                                      className={`block px-8 py-2 text-sm ${
                                        isActiveLink(subItem.href)
                                          ? "text-secondary"
                                          : "text-primary-700 hover:text-secondary"
                                      }`}
                                      whileHover={{
                                        x: 5,
                                        color: "var(--color-secondary)",
                                      }}
                                      transition={{ duration: 0.2 }}
                                    >
                                      {subItem.name}
                                    </motion.div>
                                  </Link>
                                </li>
                              ))}
                            </motion.ul>
                          )}
                        </AnimatePresence>
                      </>
                    ) : (
                      <Link href={item.href} passHref>
                        <motion.div
                          onClick={onClose}
                          className={`block px-4 py-3 hover:bg-gray-50 transition-colors ${
                            isActiveLink(item.href)
                              ? "text-secondary"
                              : "text-primary-700 hover:text-secondary"
                          }`}
                          whileHover={{ x: 5, color: "var(--color-secondary)" }}
                          transition={{ duration: 0.2 }}
                        >
                          {item.name}
                        </motion.div>
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </nav>

            {/* Social Icons */}
            <div className="p-4 border-t border-gray-200 mt-auto">
              <h5 className="font-bold text-lg mb-4 text-primary-700">
                Follow Us
              </h5>
              <div className="flex space-x-4">
                <a
                  href="#"
                  className="text-gray-700 hover:text-blue-600 transition-colors"
                >
                  <Facebook size={24} />
                </a>
                <a
                  href="#"
                  className="text-gray-700 hover:text-blue-400 transition-colors"
                >
                  <Twitter size={24} />
                </a>
                <a
                  href="#"
                  className="text-gray-700 hover:text-green-600 transition-colors"
                >
                  <MessageCircle size={24} />
                </a>
                <a
                  href="#"
                  className="text-gray-700 hover:text-pink-600 transition-colors"
                >
                  <Instagram size={24} />
                </a>
                <a
                  href="#"
                  className="text-gray-700 hover:text-red-600 transition-colors"
                >
                  <Youtube size={24} />
                </a>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default MobileSidebar;
