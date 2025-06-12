/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, {
  useState,
  useEffect,
  useRef,
  CSSProperties,
  useCallback,
} from "react";

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
  LogIn,
  UserPlus,
  LayoutDashboard,
  X, // Import X for the close button
  User, // Import User icon for profile link
} from "lucide-react";

import {
  motion,
  AnimatePresence,
  Variants,
  useScroll,
  useMotionValueEvent,
} from "motion/react";

import Image from "next/image";
import dynamic from "next/dynamic";
import { useSession, signIn } from "next-auth/react";
import axios from "axios";
import { ICart } from "@/types";

// Dynamically import sidebars for performance
const DynamicOffCanvasSidebar = dynamic(() => import("./OffCanvasSidebar"), {
  ssr: false, // Prevents server-side rendering, loads only on the client
  loading: () => null, // No visual placeholder needed while loading
});

const DynamicMobileSidebar = dynamic(() => import("./MobileSidebar"), {
  ssr: false, // Prevents server-side rendering, loads only on the client
  loading: () => null, // No visual placeholder needed while loading
});

// Variants for dropdown animations
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

// Variants for individual list items in the dropdown
const listItemVariants = {
  hidden: { opacity: 0, x: -10 },
  visible: { opacity: 1, x: 0 },
};

// Define your navigation items
const navItems = [
  { name: "Home", href: "/" },
  { name: "About", href: "/about" },
  { name: "Shop", href: "/shop" },
  {
    name: "Pages",
    href: "#",
    dropdown: [
      { name: "All Pets", href: "/allPets" },
      { name: "Gallery", href: "/gallery" },
      { name: "Faq Page", href: "/faq" },
      { name: "Pricing Page", href: "/pricing" },
      { name: "Reservation Page", href: "/reservation" },
      { name: "Our Team", href: "/team" },
    ],
  },
  { name: "Contact", href: "/contact" },
];

// Helper component to render the main navigation content (factored out for reusability)
interface MainNavContentProps {
  openDropdown: string | null;
  setOpenDropdown: React.Dispatch<React.SetStateAction<string | null>>;
  isActiveLink: (path: string, subPaths?: string[]) => boolean;
  toggleSearchPopup: () => void;
  toggleOffCanvasInfo: () => void;
  toggleMobileMenu: () => void;
  session: any;
  status: "loading" | "authenticated" | "unauthenticated";
  cartItemCount: number;
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
  cartItemCount,
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
              className="text-gray-800 hover:text-primary transition-colors focus:outline-none mt-1"
            >
              <Search size={25} />
            </button>
          </li>
          {/* Conditionally render Cart and Wishlist if authenticated */}
          {status === "authenticated" && (
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
        {/* Desktop sidebar button (for the off-canvas info) */}
        <div className="ml-6 hidden lg:block">
          <button
            onClick={toggleOffCanvasInfo}
            className="text-gray-800 hover:text-primary transition-colors focus:outline-none"
          >
            <AlignJustify size={26} />
          </button>
        </div>

        {/* Auth/Admin Buttons - Now completely hidden during loading */}
        <div className="hidden lg:flex ml-4 w-72 lg:justify-center ">
          {status === "loading" ? null : session ? ( // Render nothing while loading. The buttons will just appear when ready.
            <div className="flex gap-2">
              {/* Only show Admin Dashboard button if user is admin */}
              {session.user && (session.user as any).role === "admin" && (
                <Link href="/admin" passHref>
                  <button className="btn-bubble btn-bubble-primary">
                    <span>
                      <LayoutDashboard size={18} />
                      <span className="text-sm">Admin Dashboard</span>
                    </span>
                  </button>
                </Link>
              )}
              {/* Profile button */}
              <Link href="/profile" passHref>
                <button className="bg-white border-1 rounded-full mt-1">
                    <User size={35} /> {/* User icon */}
                </button>
              </Link>
            </div>
          ) : (
            <div className="flex gap-2">
              <button
                onClick={() => signIn()}
                className="btn-bubble btn-bubble-primary"
              >
                <span>
                  <LogIn size={18} />
                  <span className="text-sm">Login</span>
                </span>
              </button>
              <Link href="/signup" passHref>
                <button className="btn-bubble btn-bubble-outline-primary">
                  <span>
                    <UserPlus size={18} />
                    <span className="text-sm">Sign Up</span>
                  </span>
                </button>
              </Link>
            </div>
          )}
        </div>

        {/* Mobile sidebar button */}
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

interface HeaderProps {
  isHomePage?: boolean;
}

const Header = ({ isHomePage }: HeaderProps) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchPopupOpen, setIsSearchPopupOpen] = useState(false);
  const [isOffCanvasInfoOpen, setIsOffCanvasInfoOpen] = useState(false);
  const [showFixedHeader, setShowFixedHeader] = useState(false);
  const [staticHeaderHeight, setStaticHeaderHeight] = useState(0);
  const [cartItemCount, setCartItemCount] = useState<number>(0);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  // --- NEW STATE FOR SEARCH ---
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [searchResults, setSearchResults] = useState<{
    products: any[];
    pets: any[];
  } | null>(null);
  const [isSearching, setIsSearching] = useState<boolean>(false);
  const searchInputRef = useRef<HTMLInputElement>(null); // Ref for search input
  const searchPopupRef = useRef<HTMLDivElement>(null); // Ref for search popup to detect clicks outside

  const initialHeaderRef = useRef<HTMLDivElement>(null);
  const { scrollY } = useScroll();
  const SHOW_THRESHOLD = 500;
  const DEBOUNCE_DELAY = 500; // milliseconds

  // Use NextAuth session for authentication status
  const { data: session, status } = useSession();

  // Callback to fetch cart item count, memoized for performance
  const fetchCartItemCount = useCallback(async () => {
    if (status !== "authenticated") {
      setCartItemCount(0);
      return;
    }
    try {
      const response = await axios.get<ICart>("/api/cart");
      if (response.data && response.data.items) {
        const totalCount = response.data.items.reduce(
          (sum: any, item: any) => sum + item.quantity,
          0
        );
        setCartItemCount(totalCount);
      } else {
        setCartItemCount(0);
      }
    } catch (error) {
      console.error("Failed to fetch cart items:", error);
      setCartItemCount(0);
    }
  }, [status]); // Dependency on status to refetch when authentication changes

  // Effect to trigger cart item count fetch
  useEffect(() => {
    fetchCartItemCount();
  }, [fetchCartItemCount]);

  // Effect to handle fixed header visibility based on scroll position
  useMotionValueEvent(scrollY, "change", (latest: number) => {
    if (latest > SHOW_THRESHOLD) {
      setShowFixedHeader(true);
    } else {
      setShowFixedHeader(false);
    }
  });

  // Effect to measure initial header height and handle initial fixed header state
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

  // Toggle functions for different overlays, ensuring only one is open at a time
  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
    setIsSearchPopupOpen(false);
    setIsOffCanvasInfoOpen(false);
  };

  const toggleSearchPopup = () => {
    setIsSearchPopupOpen(!isSearchPopupOpen);
    setIsMobileMenuOpen(false);
    setIsOffCanvasInfoOpen(false);
    // Focus search input when popup opens
    if (!isSearchPopupOpen && searchInputRef.current) {
      setTimeout(() => searchInputRef.current?.focus(), 100); // Small delay to ensure modal is rendered
    }
  };

  const toggleOffCanvasInfo = () => {
    setIsOffCanvasInfoOpen(!isOffCanvasInfoOpen);
    setIsMobileMenuOpen(false);
    setIsSearchPopupOpen(false);
  };

  // Helper function to determine if a link is active
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

  // Variants for the fixed header animation
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

  // --- NEW: Handle search input change with debounce ---
  const handleSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setIsSearching(true); // Indicate that search is in progress
  };

  // --- NEW: Debounce effect for search query ---
  useEffect(() => {
    const handler = setTimeout(() => {
      if (searchQuery.length > 2) {
        // Only search if query is at least 3 characters long
        fetchSearchResults();
      } else if (searchQuery.length === 0) {
        setSearchResults(null); // Clear results if search query is empty
        setIsSearching(false);
      }
    }, DEBOUNCE_DELAY);

    return () => {
      clearTimeout(handler);
    };
  }, [searchQuery]); // Re-run effect when searchQuery changes

  // --- NEW: Function to fetch search results from backend ---
  const fetchSearchResults = useCallback(async () => {
    if (searchQuery.trim() === "") {
      setSearchResults(null);
      setIsSearching(false);
      return;
    }
    try {
      // This API endpoint will be created in the next step
      const response = await axios.get(
        `/api/search?q=${encodeURIComponent(searchQuery)}`
      );
      setSearchResults(response.data); // Expects { products: [], pets: [] }
      setIsSearching(false);
    } catch (error) {
      console.error("Error fetching search results:", error);
      setSearchResults(null);
      setIsSearching(false);
    }
  }, [searchQuery]); // Re-run when searchQuery changes

  // --- NEW: Effect to handle clicks outside the search popup ---
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchPopupRef.current &&
        !searchPopupRef.current.contains(event.target as Node) &&
        isSearchPopupOpen
      ) {
        setIsSearchPopupOpen(false);
        setSearchQuery(""); // Clear search query when closing
        setSearchResults(null); // Clear results
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isSearchPopupOpen]);

  return (
    <header>
      {/* Static Header Area */}
      <div
        ref={initialHeaderRef}
        className={`w-full z-40 bg-white
          ${showFixedHeader ? "invisible pointer-events-none" : ""}
        `}
      >
        {/* Header Top Area - Only visible on homepage for large screens */}
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
                          <MessageCircle size={18} />
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

        {/* Main Nav Bar (Static) - Conditionally renders MainNavContent */}
        <div className="header-main w-full py-4 shadow-lg">
          {!showFixedHeader && ( // Only render if fixed header is not shown
            <MainNavContent
              openDropdown={openDropdown}
              setOpenDropdown={setOpenDropdown}
              isActiveLink={isActiveLink}
              toggleSearchPopup={toggleSearchPopup}
              toggleOffCanvasInfo={toggleOffCanvasInfo}
              toggleMobileMenu={toggleMobileMenu}
              session={session}
              status={status}
              cartItemCount={cartItemCount}
            />
          )}
        </div>
      </div>

      {/* Spacer div to prevent content jump when fixed header appears */}
      <div
        style={{ height: showFixedHeader ? `${staticHeaderHeight}px` : "0px" }}
        className="transition-all duration-300 ease-in-out"
      />

      {/* Fixed Header Area - Animated with AnimatePresence */}
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
              session={session}
              status={status}
              cartItemCount={cartItemCount}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Off-canvas desktop info sidebar (Dynamically loaded) */}
      <DynamicOffCanvasSidebar
        isOpen={isOffCanvasInfoOpen}
        onClose={toggleOffCanvasInfo}
      />

      {/* Mobile sidebar (Dynamically loaded) */}
      <DynamicMobileSidebar
        isOpen={isMobileMenuOpen}
        onClose={toggleMobileMenu}
        isActiveLink={isActiveLink}
        session={session}
        status={status}
        cartItemCount={cartItemCount}
      />

      <AnimatePresence>
        {isSearchPopupOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 flex items-start justify-center p-4 z-[9999]"
          >
            <motion.div
              ref={searchPopupRef} // Attach ref for click outside detection
              initial={{ y: -50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -50, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="bg-white rounded-lg shadow-xl w-full max-w-2xl mt-20 relative p-6"
            >
              <button
                onClick={() => setIsSearchPopupOpen(false)}
                className="absolute top-1 right-1 text-gray-500 hover:text-gray-700 transition-colors"
              >
                <X size={24} />
              </button>
              <div className="flex items-center border border-gray-300 rounded-lg p-2 focus-within:border-secondary focus-within:ring-1 focus-within:ring-secondary">
                <Search size={24} className="text-gray-500 mr-2" />
                <input
                  ref={searchInputRef} // Attach ref to input
                  type="text"
                  placeholder="Search for products or pets..."
                  className="flex-grow outline-none text-lg py-1 px-2"
                  value={searchQuery}
                  onChange={handleSearchInputChange}
                />
                {isSearching && searchQuery.length > 2 && (
                  <div className="w-10 h-10">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 200 200"
                    >
                      <circle
                        fill="#904C8C"
                        stroke="#904C8C"
                        strokeWidth="15"
                        r="15"
                        cx="40"
                        cy="65"
                      >
                        <animate
                          attributeName="cy"
                          calcMode="spline"
                          dur="2"
                          values="65;135;65;"
                          keySplines=".5 0 .5 1;.5 0 .5 1"
                          repeatCount="indefinite"
                          begin="-.4"
                        ></animate>
                      </circle>
                      <circle
                        fill="#904C8C"
                        stroke="#904C8C"
                        strokeWidth="15"
                        r="15"
                        cx="100"
                        cy="65"
                      >
                        <animate
                          attributeName="cy"
                          calcMode="spline"
                          dur="2"
                          values="65;135;65;"
                          keySplines=".5 0 .5 1;.5 0 .5 1"
                          repeatCount="indefinite"
                          begin="-.2"
                        ></animate>
                      </circle>
                      <circle
                        fill="#904C8C"
                        stroke="#904C8C"
                        strokeWidth="15"
                        r="15"
                        cx="160"
                        cy="65"
                      >
                        <animate
                          attributeName="cy"
                          calcMode="spline"
                          dur="2"
                          values="65;135;65;"
                          keySplines=".5 0 .5 1;.5 0 .5 1"
                          repeatCount="indefinite"
                          begin="0"
                        ></animate>
                      </circle>
                    </svg>
                  </div>
                )}
              </div>

              {/* Search Results Dropdown */}
              {searchQuery.length > 2 && !isSearching && searchResults && (
                <div className="mt-4 max-h-80 overflow-y-auto border border-gray-200 rounded-md shadow-md">
                  {searchResults.products.length === 0 &&
                  searchResults.pets.length === 0 ? (
                    <p className="p-4 text-gray-600 text-center">
                      No results found for &quot;{searchQuery}&quot;.
                    </p>
                  ) : (
                    <>
                      {searchResults.products.length > 0 && (
                        <div className="p-4 border-b border-gray-100">
                          <h4 className="text-lg font-semibold text-primary mb-2">
                            Products
                          </h4>
                          <ul>
                            {searchResults.products.map((product: any) => (
                              <li
                                key={product._id}
                                className="py-2 hover:bg-gray-50 rounded-md"
                              >
                                <Link
                                  href={`/shop/products/${product._id}`} // Adjust path to your product detail page
                                  className="flex items-center gap-3 text-gray-800 hover:text-secondary"
                                  onClick={() => setIsSearchPopupOpen(false)} // Close popup on click
                                >
                                  {product.images && product.images[0] && (
                                    <Image
                                      unoptimized
                                      src={product.images[0]}
                                      alt={product.name}
                                      width={40}
                                      height={40}
                                      objectFit="cover"
                                      className="rounded-md"
                                    />
                                  )}
                                  <span>{product.name}</span>
                                  <span className="ml-auto text-sm text-gray-500">
                                    ${product.price?.toFixed(2)}
                                  </span>
                                </Link>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {searchResults.pets.length > 0 && (
                        <div className="p-4">
                          <h4 className="text-lg font-semibold text-primary mb-2">
                            Pets
                          </h4>
                          <ul>
                            {searchResults.pets.map((pet: any) => (
                              <li
                                key={pet._id}
                                className="py-2 hover:bg-gray-50 rounded-md"
                              >
                                <Link
                                  href={`/allPets/petDetails/${pet._id}`} // Adjust path to your pet detail page
                                  className="flex items-center gap-3 text-gray-800 hover:text-secondary"
                                  onClick={() => setIsSearchPopupOpen(false)} // Close popup on click
                                >
                                  {pet.images && pet.images[0] && (
                                    <Image
                                      src={pet.images[0]}
                                      alt={pet.name}
                                      width={40}
                                      height={40}
                                      objectFit="cover"
                                      className="rounded-md"
                                    />
                                  )}
                                  <span>
                                    {pet.name} ({pet.breed})
                                  </span>
                                </Link>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </>
                  )}
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Header;
