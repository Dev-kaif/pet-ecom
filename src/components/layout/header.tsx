import React, { useState, useEffect, useRef, CSSProperties } from "react";
import Link from "next/link";
import {
  AlignJustify,
  CalendarDays,
  ChevronDown,
  Mail,
  MapPin,
  Search,
  ShoppingBag,
} from "lucide-react";
import {
  motion,
  AnimatePresence,
  Variants,
  useScroll,
  useMotionValueEvent,
} from "framer-motion";

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

// Define your navigation items (unchanged)
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

// Helper component to render the main navigation content
// This prevents code duplication in the two header elements
interface MainNavContentProps {
  openDropdown: string | null;
  setOpenDropdown: React.Dispatch<React.SetStateAction<string | null>>;
  isActiveLink: (path: string, subPaths?: string[]) => boolean;
  toggleSearchPopup: () => void;
  toggleOffCanvasInfo: () => void;
  toggleMobileMenu: () => void;
}

const MainNavContent: React.FC<MainNavContentProps> = ({
  openDropdown,
  setOpenDropdown,
  isActiveLink,
  toggleSearchPopup,
  toggleOffCanvasInfo,
  toggleMobileMenu,
}) => (
  <div className="container mx-auto px-4 custom-container">
    <div className="flex justify-between items-center h-20">
      <div className="header-logo">
        <Link href="/">
          <img
            src="/images/logo/logo.png"
            alt="Petco Logo"
            className="max-h-12"
          />
        </Link>
      </div>
      <div className="header-menu hidden lg:block">
        <nav className="main-menu">
          <ul className="flex space-x-8 text-lg font-medium">
            {navItems.map((item) => (
              <li
                key={item.name}
                className="relative"
                onMouseEnter={() =>
                  item.dropdown && setOpenDropdown(item.name)
                }
                onMouseLeave={() =>
                  item.dropdown && setOpenDropdown(null)
                }
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
                      transition={{duration:0.2}}
                      className="absolute left-0 top-full w-48 bg-white shadow-lg rounded-md z-10 origin-top"
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
                                  : "text-primary-700 hover:text-secondary"
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
          <div className="w-px h-6 bg-zinc-300"></div>
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
        <div className="ml-6 hidden lg:block">
          <button
            onClick={toggleOffCanvasInfo}
            className="text-gray-800 hover:text-primary transition-colors focus:outline-none"
          >
            <AlignJustify size={26} />
          </button>
        </div>

        <div className="hidden lg:block ml-4">
          <Link
            href="/contact"
            className="text-white flex items-center gap-2 rounded-full px-6 py-3 shadow-md
                       bg-secondary hover:bg-secondary-700 transition-colors"
          >
            <CalendarDays size={18} />
            <span className="text-sm">Appointment</span>
          </Link>
        </div>

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

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchPopupOpen, setIsSearchPopupOpen] = useState(false);
  const [isOffCanvasInfoOpen, setIsOffCanvasInfoOpen] = useState(false);
  const [showFixedHeader, setShowFixedHeader] = useState(false); // Controls fixed header visibility
  const [staticHeaderHeight, setStaticHeaderHeight] = useState(0); // Height of the initial, scrolling header

  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  const initialHeaderRef = useRef<HTMLDivElement>(null); // Ref for the ENTIRE initial header (top bar + main nav)

  const SHOW_THRESHOLD = 500; // Pixels to scroll down before fixed header appears

  // Framer Motion's scroll hook
  const { scrollY } = useScroll();

  // Update showFixedHeader state based on scrollY
  useMotionValueEvent(scrollY, "change", (latest) => {
    if (latest > SHOW_THRESHOLD) {
      setShowFixedHeader(true);
    } else {
      setShowFixedHeader(false);
    }
  });

  useEffect(() => {
    const measureInitialHeaderHeight = () => {
      // Measure the height of the entire initial header (top bar + main nav)
      if (initialHeaderRef.current) {
        setStaticHeaderHeight(initialHeaderRef.current.offsetHeight);
      }
    };

    // Initial measurement
    measureInitialHeaderHeight();
    // Re-measure on window resize
    window.addEventListener("resize", measureInitialHeaderHeight);

    // Initial state setup (important for page load)
    if (window.scrollY > SHOW_THRESHOLD) {
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
    setIsSearchPopupOpen(false);
    setIsOffCanvasInfoOpen(false);
  };

  const toggleSearchPopup = () => {
    setIsSearchPopupOpen(!isSearchPopupOpen);
    setIsMobileMenuOpen(false);
    setIsOffCanvasInfoOpen(false);
  };

  const toggleOffCanvasInfo = () => {
    setIsOffCanvasInfoOpen(!isOffCanvasInfoOpen);
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

    for (const subPath of subPaths) {
      if (currentPath.startsWith(subPath) && subPath !== "/") {
        return true;
      }
    }
    return false;
  };

  // Define variants for the fixed header animation
  const fixedHeaderVariants: Variants = {
    hidden: { y: -staticHeaderHeight, opacity: 0 }, // Start off-screen top and invisible
    visible: { y: 0, opacity: 1, transition: { duration: 0.3, ease: "easeOut" } }, // Slide down and fade in
    exit: { y: -staticHeaderHeight, opacity: 0, transition: { duration: 0.2, ease: "easeIn" } }, // Slide up and fade out
  };

  return (
    <header>
      {/* This entire section is the initial, static header that scrolls naturally */}
      {/* It will be visually hidden when the fixed header appears, but remains in DOM to hold space */}
      <div
        ref={initialHeaderRef} // Ref the whole initial header for height calculation
        className={`w-full z-40 bg-white
          ${showFixedHeader ? "invisible pointer-events-none" : ""}
        `}
      >
        {/* Header Top Area - Part of the initial static header */}
        <div className={`bg-primary py-3 text-sm hidden lg:block`}>
          <div className="container mx-auto px-4 custom-container">
            <div className="flex justify-between items-center">
              <div className="header-top-left flex items-center gap-x-6">
                <ul className="flex items-center gap-x-4">
                  <li className="flex items-center gap-2">
                    <MapPin size={20} className="text-white" />
                    <span className="text-primary-300 text-base">
                      59 Jakc Street Brooklyn, New York
                    </span>
                  </li>
                  <div className="w-px h-6 bg-zinc-300"></div>
                  <li>
                    <a
                      href="mailto:info@example.com"
                      className="text-white hover:text-primary-200 transition-colors flex items-center gap-2 text-base"
                    >
                      <Mail size={20} />
                      <span className="text-primary-300">
                        Petspostinfo@gmail.com
                      </span>
                    </a>
                  </li>
                </ul>
              </div>
              <div className="header-top-right">
                <div className="header-top-social">
                  <ul className="flex items-center gap-x-3">
                    <li>
                      <a
                        href="#"
                        className="text-white hover:text-primary-200 transition-colors"
                      >
                        <i className="fab fa-facebook-f" />
                      </a>
                    </li>
                    <li>
                      <a
                        href="#"
                        className="text-white hover:text-primary-200 transition-colors"
                      >
                        <i className="fab fa-twitter" />
                      </a>
                    </li>
                    <li>
                      <a
                        href="#"
                        className="text-white hover:text-primary-200 transition-colors"
                      >
                        <i className="fab fa-pinterest-p" />
                      </a>
                    </li>
                    <li>
                      <a
                        href="#"
                        className="text-white hover:text-primary-200 transition-colors"
                      >
                        <i className="fab fa-linkedin-in" />
                      </a>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Nav Bar - Part of the initial static header */}
        <div className="header-main w-full py-4 shadow-lg"> {/* py-4 for static */}
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

      {/* Spacer div for main content to prevent jump */}
      {/* This spacer ensures content doesn't jump when the fixed header takes over */}
      <div
        style={{ height: showFixedHeader ? `${staticHeaderHeight}px` : '0px' }}
        className="transition-all duration-300 ease-in-out"
      />

      {/* Fixed Header (Animated appearance) */}
      <AnimatePresence>
        {showFixedHeader && (
          <motion.div
            key="fixed-header" // Unique key for AnimatePresence
            className="header-main w-full fixed top-0 left-0 right-0 z-50 shadow-lg bg-white py-3" // py-3 for fixed
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

      {/* Conditional rendering for popups based on state */}
    </header>
  );
};

export default Header;