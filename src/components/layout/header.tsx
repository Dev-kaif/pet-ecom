/* eslint-disable @typescript-eslint/no-explicit-any */
// src/components/layout/Header.tsx
import React, { useState, useEffect, useRef, CSSProperties, useCallback } from "react";
import Link from "next/link";
import {
  AlignJustify,
  ChevronDown,
  Clock,
  Facebook,
  Heart,
  Instagram,
  Mail,
  MapPin,
  MessageCircle,
  Search,
  ShoppingBag,
  Twitter,
  Youtube,
  LogIn, // Icon for Login
  LogOut, // Icon for Logout
  UserPlus, // Icon for Sign Up
  LayoutDashboard, // Icon for Admin Dashboard
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
import MobileSidebar from "./MobileSidebar"; // Import the new mobile sidebar
import { useSession, signIn, signOut } from "next-auth/react"; // Import useSession for authentication
import axios from "axios"; // Import axios for API calls
import { ICart } from "@/types"; // Import ICartFrontend type

// Define framer-motion variants for the dropdown menu (unchanged)
const dropdownVariants: Variants = {
  hidden: {
    y: -20,
    scaleY: 0.8,
    opacity: 0,
    pointerEvents: "none" as CSSProperties["pointerEvents"],
    transition: {
      duration: 0.2,
      ease: "easeIn",
    },
  },
  visible: {
    opacity: 1,
    y: 0,
    scaleY: 1,
    pointerEvents: "auto" as CSSProperties["pointerEvents"],
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

// Define your navigation items - Shop dropdown removed
const navItems = [
  { name: "Home", href: "/" },
  { name: "About", href: "/about" },
  { name: "Shop", href: "/shop" }, // Shop now directly links to /shop
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
  toggleMobileMenu: () => void;
  session: any; // Added session prop
  status: 'loading' | 'authenticated' | 'unauthenticated'; // Added status prop
  cartItemCount: number; // NEW: Add cartItemCount prop
}

const MainNavContent: React.FC<MainNavContentProps> = ({
  openDropdown,
  setOpenDropdown,
  isActiveLink,
  toggleSearchPopup,
  toggleOffCanvasInfo,
  toggleMobileMenu,
  session,
  status,
  cartItemCount, // NEW: Destructure cartItemCount
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
          {/* NEW: Conditionally render Cart and Wishlist if authenticated */}
          {status === 'authenticated' && (
            <>
              <div className="w-px h-6 bg-zinc-300 rotate-20"></div>
              <div className="flex gap-10">
                <li className="relative">
                  <Link
                    href="/cart"
                    className="text-gray-800 hover:text-primary transition-colors relative"
                  >
                    <ShoppingBag size={25} />
                    {cartItemCount > 0 && ( // Only show number if count > 0
                      <span className="absolute -top-2 -right-2 bg-secondary text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                        {cartItemCount}
                      </span>
                    )}
                  </Link>
                </li>
                <li className="relative">
                  <Link
                    href="/wishlist"
                    className="text-gray-800 hover:text-primary transition-colors relative"
                  >
                    <Heart size={25} />
                  </Link>
                </li>
              </div>
            </>
          )}
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

        {/* Auth/Admin Buttons (replacing Appointment button) */}
        <div className="hidden lg:block ml-4">
          {status === 'loading' ? (
            <div className="text-gray-600">Loading...</div>
          ) : session ? (
            <div className="flex gap-2">
              {/* Only show Admin Dashboard button if user is admin */}
              {session.user && (session.user as any).role === 'admin' && (
                <Link href="/admin" passHref>
                  <button className="btn-bubble btn-bubble-primary">
                    <span>
                      <LayoutDashboard size={18} /> {/* Admin Dashboard Icon */}
                      <span className="text-sm">Admin Dashboard</span>
                    </span>
                  </button>
                </Link>
              )}
              <button
                onClick={() => signOut()}
                className="btn-bubble btn-bubble-secondary" // Changed to secondary for distinction
              >
                <span>
                  <LogOut size={18} /> {/* Logout Icon */}
                  <span className="text-sm">Logout</span>
                </span>
              </button>
            </div>
          ) : (
            <div className="flex gap-2">
              <button
                onClick={() => signIn()}
                className="btn-bubble btn-bubble-primary"
              >
                <span>
                  <LogIn size={18} /> {/* Login Icon */}
                  <span className="text-sm">Login</span>
                </span>
              </button>
              <Link href="/auth/signup" passHref> {/* Assuming a signup page at /auth/signup */}
                <button className="btn-bubble btn-bubble-outline-primary">
                  <span>
                    <UserPlus size={18} /> {/* Sign Up Icon */}
                    <span className="text-sm">Sign Up</span>
                  </span>
                </button>
              </Link>
            </div>
          )}
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

interface HomepageProps {
  isHomePage?: boolean;
}

const Header = ({ isHomePage }: HomepageProps) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false); // State for mobile sidebar
  const [isSearchPopupOpen, setIsSearchPopupOpen] = useState(false);
  const [isOffCanvasInfoOpen, setIsOffCanvasInfoOpen] = useState(false); // State for desktop info sidebar
  const [showFixedHeader, setShowFixedHeader] = useState(false);
  const [staticHeaderHeight, setStaticHeaderHeight] = useState(0);
  const [cartItemCount, setCartItemCount] = useState<number>(0); // NEW: State for cart item count

  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  const initialHeaderRef = useRef<HTMLDivElement>(null);
  const { scrollY } = useScroll();
  const SHOW_THRESHOLD = 500;

  // Added useSession to the Header component
  const { data: session, status } = useSession();

  // NEW: Function to fetch cart item count
  const fetchCartItemCount = useCallback(async () => {
    if (status !== 'authenticated') {
      setCartItemCount(0);
      return;
    }
    try {
      const response = await axios.get<ICart>("/api/cart");
      if (response.data && response.data.items) {
        // Calculate total quantity of items in cart
        const totalCount = response.data.items.reduce((sum:any, item:any) => sum + item.quantity, 0);
        setCartItemCount(totalCount);
      } else {
        setCartItemCount(0);
      }
    } catch (error) {
      console.error("Failed to fetch cart items:", error);
      setCartItemCount(0);
    }
  }, [status]); // Dependency on status to refetch when authentication changes

  useEffect(() => {
    // Fetch cart item count when component mounts or session status changes
    fetchCartItemCount();
  }, [fetchCartItemCount]);


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

    if (typeof window !== "undefined" && window.scrollY > SHOW_THRESHOLD) {
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
        {isHomePage && (
          <div className={`bg-primary py-3 text-sm hidden lg:block`}>
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
                          <MessageCircle size={18} />{" "}
                          {/* Corresponds to the 'g+' or chat icon */}
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
          </div>
        )}

        {/* Main Nav Bar */}
        <div className="header-main w-full py-4 shadow-lg">
          <MainNavContent
            openDropdown={openDropdown}
            setOpenDropdown={setOpenDropdown}
            isActiveLink={isActiveLink}
            toggleSearchPopup={toggleSearchPopup}
            toggleOffCanvasInfo={toggleOffCanvasInfo}
            toggleMobileMenu={toggleMobileMenu}
            session={session} // Pass session
            status={status}   // Pass status
            cartItemCount={cartItemCount} // NEW: Pass cartItemCount
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
              session={session} // Pass session
              status={status}   // Pass status
              cartItemCount={cartItemCount} // NEW: Pass cartItemCount
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
        isActiveLink={isActiveLink}
        session={session} // Pass session to MobileSidebar
        status={status}   // Pass status to MobileSidebar
        cartItemCount={cartItemCount} // NEW: Pass cartItemCount
      />
    </header>
  );
};

export default Header;
