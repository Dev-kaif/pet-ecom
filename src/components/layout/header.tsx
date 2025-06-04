// src/components/layout/Header.tsx
import React, { useState, useEffect, useRef, CSSProperties } from "react";
import Link from "next/link";
import {
  AlignJustify,
  CalendarDays,
  ChevronDown,
  Clock,
  Facebook,
  Instagram,
  Mail,
  MapPin,
  MessageCircle,
  Search,
  ShoppingBag,
  Twitter,
  Youtube,
} from "lucide-react";
import {
  motion,
  AnimatePresence,
  Variants,
  useScroll,
  useMotionValueEvent,
} from "framer-motion";
import Image from "next/image";
import OffCanvasSidebar from "./OffCanvasSidebar"; // Existing desktop sidebar
import MobileSidebar from "./MobileSidebar";     // Import the new mobile sidebar

// Define framer-motion variants for the dropdown menu (unchanged)
const dropdownVariants: Variants = {
  hidden: {
    y: -20,
    scaleY: 0.8,
    opacity: 0,
    pointerEvents: "none" as CSSProperties["pointerEvents"], // Retaining for safety, though often not needed with modern FM
    transition: {
      duration: 0.2,
      ease: "easeIn",
    },
  },
  visible: {
    opacity: 1,
    y: 0,
    scaleY: 1,
    pointerEvents: "auto" as CSSProperties["pointerEvents"], // Retaining for safety
    transition: {
      duration: 0.3,
      ease: "easeOut",
      staggerChildren: 0.05,
      delayChildren: 0.1,
    },
  },
};

// Define variants for individual list items in the dropdown (unchanged)
const listItemVariants = {
  hidden: { opacity: 0, x: -10 },
  visible: { opacity: 1, x: 0 },
};

// Define your navigation items (unchanged - used by MainNavContent and MobileSidebar)
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
      { name: "All Pets", href: "/allPets" },
      { name: "Pet Details", href: "/allPets/petDetails" },
      { name: "Gallery", href: "/gallery" },
      { name: "Faq Page", href: "/faq" },
      { name: "Pricing Page", href: "/pricing" },
      { name: "Reservation Page", href: "/reservation" },
      { name: "Our Team", href: "/team" },
      { name: "Team Details", href: "/team-details" },
      { name: "Our Blog", href: "/blog" },
      { name: "Blog Details", href: "/blog-details" },
      { name: "404 Error Page", href: "/404" },
    ],
  },
  { name: "Contact", href: "/contact" },
];

// Helper component to render the main navigation content
interface MainNavContentProps {
  openDropdown: string | null;
  setOpenDropdown: React.Dispatch<React.SetStateAction<string | null>>;
  isActiveLink: (path: string, subPaths?: string[]) => boolean;
  toggleSearchPopup: () => void;
  toggleOffCanvasInfo: () => void;
  toggleMobileMenu: () => void; // Passed down to the mobile button
}

const MainNavContent: React.FC<MainNavContentProps> = ({
  openDropdown,
  setOpenDropdown,
  isActiveLink,
  toggleSearchPopup,
  toggleOffCanvasInfo,
  toggleMobileMenu,
}) => (
  <div className="container mx-auto px-4 custom-container ">
    <div className="flex justify-between items-center h-14">
      <div className="header-logo">
        <Link href="/" passHref>
          <Image
            height={100}
            width={100}
            src="/images/logo/logo.png"
            alt="Petco Logo"
            className="max-h-10"
          />
        </Link>
      </div>
      <div className="header-menu hidden lg:block">
        <nav className="main-menu">
          <ul className="flex space-x-8 text-lg font-bold text-primary">
            {navItems.map((item) => (
              <li
                key={item.name}
                className="relative"
                onMouseEnter={() => item.dropdown && setOpenDropdown(item.name)}
                onMouseLeave={() => item.dropdown && setOpenDropdown(null)}
              >
                <Link
                  href={item.href}
                  className={`flex items-center gap-1 transition-colors h-full ${
                    isActiveLink(
                      item.href,
                      item.dropdown?.map((d) => d.href)
                    )
                      ? "text-secondary"
                      : "text-primary-700 hover:text-secondary"
                  }`}
                >
                  <div className="flex justify-center items-center gap-1">
                    <span>{item.name}</span>
                    {item.dropdown && (
                      <ChevronDown
                        size={16}
                        className={`transition-transform duration-200
                          ${openDropdown === item.name ? "rotate-180" : ""}`}
                      />
                    )}
                  </div>
                </Link>

                <AnimatePresence>
                  {openDropdown === item.name && item.dropdown && (
                    <motion.ul
                      variants={dropdownVariants}
                      initial="hidden"
                      animate="visible"
                      exit="hidden"
                      transition={{ duration: 0.2 }}
                      className="absolute left-0 top-full w-48 bg-white shadow-lg rounded-md z-20 origin-top"
                    >
                      {item.dropdown.map((subItem) => (
                        <motion.li
                          key={subItem.name}
                          variants={listItemVariants}
                        >
                          <Link href={subItem.href} passHref>
                            <motion.div
                              className={`block px-4 py-2 ${
                                isActiveLink(subItem.href)
                                  ? "text-secondary"
                                  : "text-primary-700 "
                              }`}
                              whileHover={{
                                x: 10,
                                color: "var(--color-secondary)",
                              }}
                              transition={{ duration: 0.3 }}
                            >
                              {subItem.name}
                            </motion.div>
                          </Link>
                        </motion.li>
                      ))}
                    </motion.ul>
                  )}
                </AnimatePresence>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      <div className="header-action flex items-center space-x-4">
        <ul className="flex items-center space-x-4">
          <li className="relative">
            <button
              onClick={toggleSearchPopup}
              className="text-gray-800 hover:text-primary transition-colors focus:outline-none"
            >
              <Search size={25} />
            </button>
          </li>
          <div className="w-px h-6 bg-zinc-300 rotate-20"></div>
          <li className="relative">
            <Link
              href="/cart"
              className="text-gray-800 hover:text-primary transition-colors relative"
            >
              <ShoppingBag size={25} />
              <span className="absolute -top-2 -right-2 bg-secondary text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                2
              </span>
            </Link>
          </li>
        </ul>
        {/* desktop sidebar button (for the off-canvas info) */}
        <div className="ml-6 hidden lg:block">
          <button
            onClick={toggleOffCanvasInfo}
            className="text-gray-800 hover:text-primary transition-colors focus:outline-none"
          >
            <AlignJustify size={26} />
          </button>
        </div>

        <div className="hidden lg:block ml-4">
          <Link href="/contact" className="btn-bubble btn-bubble-primary">
            <span>
              <CalendarDays size={18} />
              <span className="text-sm">Appointment</span>
            </span>
          </Link>
        </div>

        {/* mobile sidebar button */}
        <div className="lg:hidden ml-4">
          <button
            onClick={toggleMobileMenu} 
            className="text-gray-800 hover:text-primary transition-colors focus:outline-none"
          >
            <AlignJustify size={26} />
          </button>
        </div>
      </div>
    </div>
  </div>
);

interface HomepageProps{
  isHomePage?:boolean;
}

const Header = ({isHomePage}:HomepageProps) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false); // State for mobile sidebar
  const [isSearchPopupOpen, setIsSearchPopupOpen] = useState(false);
  const [isOffCanvasInfoOpen, setIsOffCanvasInfoOpen] = useState(false); // State for desktop info sidebar
  const [showFixedHeader, setShowFixedHeader] = useState(false);
  const [staticHeaderHeight, setStaticHeaderHeight] = useState(0);

  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  const initialHeaderRef = useRef<HTMLDivElement>(null);
  const { scrollY } = useScroll();
  const SHOW_THRESHOLD = 500;

  useMotionValueEvent(scrollY, "change", (latest: number) => {
    if (latest > SHOW_THRESHOLD) {
      setShowFixedHeader(true);
    } else {
      setShowFixedHeader(false);
    }
  });

  useEffect(() => {
    const measureInitialHeaderHeight = () => {
      if (initialHeaderRef.current) {
        setStaticHeaderHeight(initialHeaderRef.current.offsetHeight);
      }
    };

    measureInitialHeaderHeight();
    window.addEventListener("resize", measureInitialHeaderHeight);

    if (typeof window !== 'undefined' && window.scrollY > SHOW_THRESHOLD) {
      setShowFixedHeader(true);
    } else {
      setShowFixedHeader(false);
    }

    return () => {
      window.removeEventListener("resize", measureInitialHeaderHeight);
    };
  }, [SHOW_THRESHOLD]);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
    // Close other overlays when mobile menu opens/closes
    setIsSearchPopupOpen(false);
    setIsOffCanvasInfoOpen(false);
  };

  const toggleSearchPopup = () => {
    setIsSearchPopupOpen(!isSearchPopupOpen);
    // Close other overlays when search popup opens/closes
    setIsMobileMenuOpen(false);
    setIsOffCanvasInfoOpen(false);
  };

  const toggleOffCanvasInfo = () => {
    setIsOffCanvasInfoOpen(!isOffCanvasInfoOpen);
    // Close other overlays when desktop info sidebar opens/closes
    setIsMobileMenuOpen(false);
    setIsSearchPopupOpen(false);
  };

  const isActiveLink = (path: string, subPaths: string[] = []) => {
    if (typeof window === "undefined") {
      return false;
    }
    const currentPath = window.location.pathname;

    if (currentPath === path) {
      return true;
    }

    if (Array.isArray(subPaths)) {
      for (const subPath of subPaths) {
        if (currentPath.startsWith(subPath) && subPath !== "/") {
          return true;
        }
      }
    }
    return false;
  };

  // Define variants for the fixed header animation (unchanged)
  const fixedHeaderVariants: Variants = {
    hidden: { y: -staticHeaderHeight, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.3, ease: "easeOut" },
    },
    exit: {
      y: -staticHeaderHeight,
      opacity: 0,
      transition: { duration: 0.2, ease: "easeIn" },
    },
  };

  return (
    <header>
      <div
        ref={initialHeaderRef}
        className={`w-full z-40 bg-white
          ${showFixedHeader ? "invisible pointer-events-none" : ""}
        `}
      >
        {/* Header Top Area */}
        {isHomePage && <div className={`bg-primary py-3 text-sm hidden lg:block`}>
          <div className="container mx-auto px-4 custom-container">
            <div className="flex justify-between items-center">
              <div className="header-top-left flex items-center gap-x-6">
                <ul className="flex items-center gap-x-4">
                  <li className="flex items-center gap-2">
                    <MapPin size={20} className="text-white/80" />
                    <span className="text-primary-300 text-base mt-1">
                      59 Jakc Street Brooklyn, New York
                    </span>
                  </li>
                  <div className="w-px h-6 bg-zinc-300 rotate-20"></div>
                  <li>
                    <a
                      href="mailto:info@example.com"
                      className=" hover:text-primary-200 transition-colors flex items-center gap-2 text-base"
                    >
                      <Mail className="text-white/80" size={20} />
                      <span className="text-primary-300 mt-1">
                        Petspostinfo@gmail.com
                      </span>
                    </a>
                  </li>
                </ul>
              </div>

              <div className="header-top-right">
                <div className="header-top-social flex gap-3">
                  <div className="flex gap-2 text-white/80 items-center text-base">
                    <Clock size={20} />
                    <span className="text-primary-300 mt-1">
                      Opening Hour: 09.00 am- 11.00 pm
                    </span>
                  </div>

                  <div className="w-px h-6 bg-zinc-300 rotate-20"></div>
                  <ul className="flex items-center gap-x-3">
                    <li>
                      <a
                        href="#"
                        className="text-white hover:text-primary-200 transition-colors"
                      >
                        <Facebook size={18} />
                      </a>
                    </li>
                    <li>
                      <a
                        href="#"
                        className="text-white hover:text-primary-200 transition-colors"
                      >
                        <Twitter size={18} />
                      </a>
                    </li>
                    <li>
                      <a
                        href="#"
                        className="text-white hover:text-primary-200 transition-colors"
                      >
                        <MessageCircle size={18} /> {/* Corresponds to the 'g+' or chat icon */}
                      </a>
                    </li>
                    <li>
                      <a
                        href="#"
                        className="text-white hover:text-primary-200 transition-colors"
                      >
                        <Instagram size={18} />
                      </a>
                    </li>
                    <li>
                      <a
                        href="#"
                        className="text-white hover:text-primary-200 transition-colors"
                      >
                        <Youtube size={18} />
                      </a>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>}

        {/* Main Nav Bar */}
        <div className="header-main w-full py-4 shadow-lg">
          <MainNavContent
            openDropdown={openDropdown}
            setOpenDropdown={setOpenDropdown}
            isActiveLink={isActiveLink}
            toggleSearchPopup={toggleSearchPopup}
            toggleOffCanvasInfo={toggleOffCanvasInfo}
            toggleMobileMenu={toggleMobileMenu}
          />
        </div>
      </div>

      {/* Spacer div */}
      <div
        style={{ height: showFixedHeader ? `${staticHeaderHeight}px` : "0px" }}
        className="transition-all duration-300 ease-in-out"
      />

      {/* Fixed Header */}
      <AnimatePresence>
        {showFixedHeader && (
          <motion.div
            key="fixed-header"
            className="header-main w-full fixed top-0 left-0 right-0 z-50 shadow-lg bg-white py-3"
            variants={fixedHeaderVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            <MainNavContent
              openDropdown={openDropdown}
              setOpenDropdown={setOpenDropdown}
              isActiveLink={isActiveLink}
              toggleSearchPopup={toggleSearchPopup}
              toggleOffCanvasInfo={toggleOffCanvasInfo}
              toggleMobileMenu={toggleMobileMenu}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Off-canvas desktop info sidebar */}
      <OffCanvasSidebar
        isOpen={isOffCanvasInfoOpen}
        onClose={toggleOffCanvasInfo}
      />

      {/* Mobile sidebar */}
      <MobileSidebar
        isOpen={isMobileMenuOpen}
        onClose={toggleMobileMenu}
        isActiveLink={isActiveLink} // Pass isActiveLink for mobile navigation
      />
    </header>
  );
};

export default Header;