import React, { useState, useEffect, useRef, CSSProperties, useMemo } from "react";
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
import { motion, AnimatePresence, Variants } from "framer-motion";

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

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchPopupOpen, setIsSearchPopupOpen] = useState(false);
  const [isOffCanvasInfoOpen, setIsOffCanvasInfoOpen] = useState(false);
  const [isScrolledPastTopBar, setIsScrolledPastTopBar] = useState(false); // Renamed for clarity
  const [headerHeight, setHeaderHeight] = useState(0); // Height of the main header
  const [topBarHeight, setTopBarHeight] = useState(0); // Height of the top bar
  const [scrollDirection, setScrollDirection] = useState<'up' | 'down' | null>(null);
  const lastScrollY = useRef(0); // To track last scroll position for direction

  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  const headerRef = useRef<HTMLDivElement>(null); // Ref for the main header div
  const topBarRef = useRef<HTMLDivElement>(null); // Ref for the top bar div

  useEffect(() => {
    const measureHeights = () => {
      if (headerRef.current) {
        setHeaderHeight(headerRef.current.offsetHeight);
      }
      if (topBarRef.current) {
        setTopBarHeight(topBarRef.current.offsetHeight);
      }
    };

    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      // Determine scroll direction
      if (currentScrollY > lastScrollY.current && currentScrollY > 0) { // Scrolled down
        setScrollDirection('down');
      } else if (currentScrollY < lastScrollY.current && currentScrollY >= 0) { // Scrolled up
        setScrollDirection('up');
      }
      lastScrollY.current = currentScrollY; // Update last scroll position

      // Determine if scrolled past top bar
      if (currentScrollY > topBarHeight + 5) { // +5px buffer
        setIsScrolledPastTopBar(true);
      } else {
        setIsScrolledPastTopBar(false);
        setScrollDirection(null); // Reset direction when at the very top
      }
    };

    // Initial measurement and attach listeners
    measureHeights();
    window.addEventListener("resize", measureHeights);
    window.addEventListener("scroll", handleScroll);

    // Cleanup listeners
    return () => {
      window.removeEventListener("resize", measureHeights);
      window.removeEventListener("scroll", handleScroll);
    };
  }, [topBarHeight]); // Re-run if topBarHeight changes (e.g., on initial render or resize)

  // Determine the 'y' position for Framer Motion animation
  const headerTranslateY = useMemo(() => {
    // If not scrolled past top bar, it's at its initial position (below top bar)
    if (!isScrolledPastTopBar) {
      return 0; // Relative to its natural position in the flow
    }
    // If scrolled past top bar AND scrolling down, hide it
    if (scrollDirection === 'down') {
      return -headerHeight - 20; // Slide fully up and a bit more
    }
    // If scrolled past top bar AND scrolling up, show it
    return 0; // Show at top:0
  }, [isScrolledPastTopBar, scrollDirection, headerHeight]);


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

  return (
    <header>
      {/* Spacer div for main content to prevent jump */}
      {/* This spacer ensures content doesn't jump up when the main header becomes fixed */}
      {/* Its height equals the current height of the FIXED header when it's supposed to be visible */}
      <div
        style={{
          height: isScrolledPastTopBar && scrollDirection !== 'down' ? `${headerHeight}px` : '0px',
        }}
        className="transition-all duration-300 ease-in-out"
      />

      {/* Header Top Area - This will scroll out of view */}
      <div
        ref={topBarRef}
        className={`bg-primary py-3 text-sm hidden lg:block transition-transform duration-300 ease-in-out
          ${isScrolledPastTopBar ? "-translate-y-full" : "translate-y-0"}`}
      >
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

      {/* Header Main Area - This will become sticky and animate in/out */}
      <motion.div
        ref={headerRef}
        className={`header-main w-full fixed left-0 right-0 z-50 shadow-lg bg-white transition-all duration-300 ease-in-out
          ${!isScrolledPastTopBar ? `top-[${topBarHeight}px] py-4` : "top-0 py-3"}
          `}
        // Framer motion properties for slide/fade in/out
        animate={{
          y: headerTranslateY,
          opacity: (isScrolledPastTopBar && scrollDirection === 'down') ? 0 : 1,
        }}
        transition={{ duration: 0.3, ease: "easeOut" }}
      >
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
                                ${
                                  openDropdown === item.name ? "rotate-180" : ""
                                }`}
                            />
                          )}
                        </div>
                      </Link>

                      {/* Dropdown Menu (only if dropdown exists) */}
                      <AnimatePresence>
                        {openDropdown === item.name && item.dropdown && (
                          <motion.ul
                            variants={dropdownVariants}
                            initial="hidden"
                            animate="visible"
                            exit="hidden"
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
                {/* Separator */}
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
      </motion.div>

      {/* Conditional rendering for popups based on state */}
    </header>
  );
};

export default Header;