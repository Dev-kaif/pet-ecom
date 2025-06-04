// src/components/layout/OffCanvasSidebar.tsx
import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { X, MapPin, PhoneCall, Mail, Facebook, Twitter, Instagram, Globe } from "lucide-react"; // Changed Google to Globe for better Lucide compatibility if 'g+' isn't strict

interface OffCanvasSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const sidebarVariants = {
  hidden: {
    x: "100%", // Start completely off-screen to the right
    transition: {
      type: "tween",
      duration: 0.3,
      ease: "easeOut",
    },
  },
  visible: {
    x: "0%", // Slide into view
    transition: {
      type: "tween",
      duration: 0.3,
      ease: "easeOut",
    },
  },
};

const OffCanvasSidebar: React.FC<OffCanvasSidebarProps> = ({ isOpen, onClose }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div
            className="fixed inset-0 bg-black/50 bg-opacity-50 z-[99]" // Dark overlay, lower z-index than sidebar
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Sidebar */}
          <motion.div
            className="fixed top-0 right-0 h-full w-[300px] sm:w-[350px] bg-white text-primary shadow-xl z-[100] flex flex-col p-6 overflow-y-auto" // Higher z-index, responsive width
            variants={sidebarVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
          >
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-gray-700 hover:text-secondary transition-colors"
            >
              <X size={28} />
            </button>

            {/* Logo */}
            <div className="sidebar-logo mb-10 mt-2 flex justify-center">
              <Link href="/" passHref> {/* Added passHref for Link with child that isn't <a> directly */}
                <Image
                  src="/images/logo/logo.png"
                  alt="PetPal Logo"
                  width={120}
                  height={40}
                />
              </Link>
            </div>

            {/* Content Sections */}
            <div className="space-y-8 flex-grow">
              {/* Office Address */}
              <div>
                <h5 className="font-bold text-lg mb-3 text-primary-700">Office Address</h5>
                <p className="text-gray-600 text-sm flex items-start gap-2">
                  <MapPin size={18} className="text-secondary flex-shrink-0 mt-1" />
                  <span>123/A, Miranda City Likaoli <br/> Pikano, Dope</span>
                </p>
              </div>

              {/* Phone Number */}
              <div>
                <h5 className="font-bold text-lg mb-3 text-primary-700">Phone Number</h5>
                <ul className="space-y-2">
                  <li className="text-gray-600 text-sm flex items-center gap-2">
                    <PhoneCall size={18} className="text-secondary" />
                    <a href="tel:+0989787698659" className="hover:text-secondary transition-colors">+0989 7876 98659</a>
                  </li>
                  <li className="text-gray-600 text-sm flex items-center gap-2">
                    <PhoneCall size={18} className="text-secondary" />
                    <a href="tel:+09087658654385" className="hover:text-secondary transition-colors">+(090) 8765 86543 85</a>
                  </li>
                </ul>
              </div>

              {/* Email Address */}
              <div>
                <h5 className="font-bold text-lg mb-3 text-primary-700">Email Address</h5>
                <ul className="space-y-2">
                  <li className="text-gray-600 text-sm flex items-center gap-2">
                    <Mail size={18} className="text-secondary" />
                    <a href="mailto:info@example.com" className="hover:text-secondary transition-colors">info@example.com</a>
                  </li>
                  <li className="text-gray-600 text-sm flex items-center gap-2">
                    <Mail size={18} className="text-secondary" />
                    <a href="mailto:example.mail@hum.com" className="hover:text-secondary transition-colors">example.mail@hum.com</a>
                  </li>
                </ul>
              </div>
            </div>

            {/* Social Icons */}
            <div className="mt-8 pt-4 border-t border-gray-200">
              <h5 className="font-bold text-lg mb-4 text-primary-700">Follow Us</h5>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-700 hover:text-blue-600 transition-colors">
                  <Facebook size={24} />
                </a>
                <a href="#" className="text-gray-700 hover:text-blue-400 transition-colors">
                  <Twitter size={24} />
                </a>
                <a href="#" className="text-gray-700 hover:text-red-600 transition-colors">
                  <Globe size={24} /> {/* Changed to Globe or you can use other suitable Lucide icons if 'g+' is not available */}
                </a>
                <a href="#" className="text-gray-700 hover:text-pink-600 transition-colors">
                  <Instagram size={24} />
                </a>
              </div>
            </div>
            {/* Optional: Copyright at the very bottom */}
            <div className="mt-8 text-center text-xs text-gray-500">
              <p>&copy; {new Date().getFullYear()} PetPal. All Rights Reserved.</p>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default OffCanvasSidebar;