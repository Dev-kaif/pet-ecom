import React from "react";
import Link from "next/link";
import {
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  Mail,
  PhoneCall,
} from "lucide-react";

// Define data for Quick Links and Opening Hours to keep JSX clean
const quickLinksData = [
  { name: "Animal Rescue", href: "/services/animal-rescue" },
  { name: "Humane Education", href: "/services/humane-education" },
  { name: "Animal Hospital", href: "/services/animal-hospital" },
  { name: "Street Animal Feeding", href: "/services/street-feeding" },
  { name: "Homepage 01", href: "/" }, // Assuming this links to home
  { name: "Pricing Table", href: "/pricing" },
];

const openingHoursData = [
  { day: "Monday", time: "8.00 - 21.00" },
  { day: "Tuesday", time: "8.00 - 21.00" },
  { day: "Thursday", time: "8.00 - 21.00" }, // Note: Wednesday missing from image, keeping as is
  { day: "Friday", time: "8.00 - 21.00" },
  { day: "Saturday", time: "8.00 - 21.00" },
  { day: "Sunday", time: "8.00 - 21.00" },
];

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    // Added footer-main-bg for the house icon via CSS
    <footer className="relative overflow-hidden footer-main-bg">
      <div className="footer-top pt-16 pb-12 md:pt-20 md:pb-16 bg-gradient-to-br from-primary to-primary-600 text-white relative z-10"> {/* Adjusted padding for mobile */}
        <div className="container mx-auto px-4 sm:px-6 custom-container"> {/* Added sm:px-6 for slightly more mobile padding */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"> {/* Grid already handles responsiveness well */}
            {/* Column 1: PetPal Info & Social */}
            <div className="footer-widget space-y-6 text-center md:text-left"> {/* Center text on mobile, left on md+ */}
              <div className="footer-logo flex justify-center md:justify-start"> {/* Center logo on mobile */}
                <Link href="/">
                  <img
                    src="/images/logo/w_logo.png"
                    alt="PetPal Logo"
                    className="max-h-12"
                  />
                </Link>
              </div>
              <p className="text-gray-300 leading-relaxed text-sm max-w-sm mx-auto md:mx-0"> {/* Max-width and auto margins for better readability on narrow screens */}
                555 A, East Manster Street, Ready Halley Neon, UK 4512
              </p>
              <ul className="footer-contact flex flex-col space-y-2 text-gray-300 items-center md:items-start"> {/* Center items on mobile */}
                <li className="flex gap-2 items-center"> {/* Added items-center for vertical alignment */}
                  <PhoneCall size={18} className="text-secondary" /> {/* Applied secondary color */}
                  <a
                    href="tel:+001234567844"
                    className="hover:text-secondary transition-colors text-base font-semibold"
                  >
                    +00 123 45678 44
                  </a>
                </li>
                <li className="flex gap-2 items-center"> {/* Added items-center for vertical alignment */}
                  <Mail size={18} className="text-secondary" /> {/* Applied secondary color */}
                  <a
                    href="mailto:Supportinfo@gmail.com"
                    className="hover:text-secondary transition-colors text-base font-semibold"
                  >
                    Supportinfo@gmail.com
                  </a>
                </li>
              </ul>
              <p className="font-semibold mt-4">Follow Us On:</p>
              {/* Lucide Social Icons */}
              <div className="flex space-x-4 items-center justify-center md:justify-start"> {/* Center social icons on mobile */}
                <a
                  href="#"
                  className="text-gray-300 hover:text-secondary transition-colors"
                >
                  <Facebook size={24} />
                </a>
                <a
                  href="#"
                  className="text-gray-300 hover:text-secondary transition-colors"
                >
                  <Twitter size={24} />
                </a>
                <a
                  href="#"
                  className="text-gray-300 hover:text-secondary transition-colors"
                >
                  <Instagram size={24} />
                </a>
                <a
                  href="#"
                  className="text-gray-300 hover:text-secondary transition-colors"
                >
                  <Linkedin size={24} />
                </a>
              </div>
            </div>

            {/* Column 2: Quick Links */}
            <div className="footer-widget text-center md:text-left"> {/* Center text on mobile */}
              <h4 className="fw-title text-xl font-semibold mb-6 text-white">
                Quick Links
              </h4>
              <ul className="footer-link flex flex-col space-y-3 text-gray-300">
                {quickLinksData.map((item) => (
                  <li key={item.name}>
                    <Link
                      href={item.href}
                      className="hover:text-secondary transition-colors text-base"
                    >
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Column 3: Opening Hours */}
            <div className="footer-widget text-center md:text-left"> {/* Center text on mobile */}
              <h4 className="text-xl font-semibold mb-6 text-white">
                Opening Hours
              </h4>
              <ul className="footer-link flex flex-col space-y-3 text-gray-300">
                {openingHoursData.map((item) => (
                  <li
                    key={item.day}
                    className="flex space-x-2 items-center text-base justify-center md:justify-start" // Center on mobile, left on md+
                  >
                    <span className="w-24 sm:w-28 md:w-32 flex-shrink-0 text-left"> {/* Adjusted width for consistency, added text-left */}
                      {item.day}
                    </span>
                    <span className="flex-grow text-right md:text-left"> {/* Allows time to take remaining space, aligns right on mobile */}
                      {item.time}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Column 4: Subscribe to our newsletter */}
            <div className="footer-widget bg-primary p-6 sm:p-8 rounded-xl relative overflow-hidden z-10 text-center"> {/* Adjusted padding and ensured text-center */}
              <h4 className="fw-title text-xl font-semibold mb-6 text-white">
                Subscribe to our newsletter
              </h4>
              <p className="text-gray-300 leading-relaxed text-sm mb-4">
                Sign up for our newsletter to get updates on new products and
                promotions.
              </p>
              <form
                action="#"
                className="space-y-4 flex flex-col justify-center items-center"
              >
                <input
                  type="email"
                  placeholder="Type Your E-mail"
                  className="w-full px-4 py-3 bg-primary-900 border border-transparent rounded-md focus:outline-none focus:border-secondary transition-all duration-200 text-white placeholder-gray-400"
                />
                <button type="submit" className="btn-bubble btn-bubble-primary w-full max-w-[200px] mx-auto"> {/* Made button full width on mobile, max-width to control size */}
                  <span>Subscribe Now</span>
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Bottom Area */}
      <div className="footer-bottom bg-primary-900 text-white relative z-10">
        <div className="container mx-auto px-4 sm:px-6 custom-container"> {/* Added sm:px-6 for consistency */}
          <div className="py-6 flex flex-col md:flex-row justify-between items-center text-sm text-gray-400 gap-y-2"> {/* Added gap-y for vertical spacing on mobile */}
            {/* Left Links */}
            <ul className="flex flex-wrap justify-center md:justify-start gap-x-4 gap-y-2 mb-2 md:mb-0 text-center"> {/* Added text-center for mobile */}
              <li>
                <Link
                  href="/support"
                  className="hover:text-white transition-colors"
                >
                  Support
                </Link>
              </li>
              <li>
                <Link
                  href="/terms"
                  className="hover:text-white transition-colors"
                >
                  Terms & Conditions
                </Link>
              </li>
              <li>
                <Link
                  href="/privacy"
                  className="hover:text-white transition-colors"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  href="/career"
                  className="hover:text-white transition-colors"
                >
                  Career
                </Link>
              </li>
            </ul>

            {/* Copyright */}
            <p className="text-center md:text-right">
              Copyright &copy; {currentYear}. All Rights Reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;