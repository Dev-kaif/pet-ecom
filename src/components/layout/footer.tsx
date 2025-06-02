// src/components/layout/Footer.tsx
import React from 'react';
import Link from 'next/link';

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
      {/* Footer Top Area */}
      {/* Changed bg-primary-950 to a gradient */}
      <div className="footer-top pt-20 pb-16 bg-gradient-to-br from-primary to-primary-400 text-white relative z-10">
        <div className="container mx-auto px-4 custom-container">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Column 1: PetPal Info & Social */}
            <div className="footer-widget space-y-6">
              <div className="footer-logo">
                <Link href="/">
                  <img src="/images/logo/logo.png" alt="PetPal Logo" className="max-h-12" />
                </Link>
              </div>
              <p className="text-gray-300 leading-relaxed text-sm"> {/* Slightly lighter gray for body text */}
                555 A, East Manster Street, Ready Halley Neon, UK 4512
              </p>
              <ul className="footer-contact flex flex-col space-y-2 text-gray-300"> {/* Consistent text color */}
                <li className="flex items-center">
                  <i className="fa-solid fa-phone mr-3 text-secondary" /> {/* Use secondary for icon accents */}
                  <a href="tel:+001234567844" className="hover:text-secondary transition-colors text-base font-semibold">
                    +00 123 45678 44
                  </a>
                </li>
                <li className="flex items-center">
                  <i className="fa-solid fa-envelope mr-3 text-secondary" />
                  <a href="mailto:Supportinfo@gmail.com" className="hover:text-secondary transition-colors text-base font-semibold">
                    Supportinfo@gmail.com
                  </a>
                </li>
              </ul>
              <p className="font-semibold mt-4">Follow Us On:</p>
              <div className="footer-social">
                <ul className="flex items-center space-x-2"> {/* Reduced spacing */}
                  <li>
                    <a href="#" className="w-8 h-8 flex items-center justify-center rounded-full bg-primary-800 text-white hover:bg-secondary transition-all duration-300">
                      <i className="fab fa-facebook-f text-sm" /> {/* Smaller icons */}
                    </a>
                  </li>
                  <li>
                    <a href="#" className="w-8 h-8 flex items-center justify-center rounded-full bg-primary-800 text-white hover:bg-secondary transition-all duration-300">
                      <i className="fab fa-twitter text-sm" />
                    </a>
                  </li>
                  <li>
                    <a href="#" className="w-8 h-8 flex items-center justify-center rounded-full bg-primary-800 text-white hover:bg-secondary transition-all duration-300">
                      <i className="fab fa-instagram text-sm" /> {/* Assuming instagram for the square icon */}
                    </a>
                  </li>
                  <li>
                    <a href="#" className="w-8 h-8 flex items-center justify-center rounded-full bg-primary-800 text-white hover:bg-secondary transition-all duration-300">
                      <i className="fab fa-youtube text-sm" /> {/* Assuming youtube for the play icon */}
                    </a>
                  </li>
                </ul>
              </div>
            </div>

            {/* Column 2: Quick Links */}
            <div className="footer-widget">
              <h4 className="fw-title text-xl font-semibold mb-6 text-white">Quick Links</h4>
              <ul className="footer-link flex flex-col space-y-3 text-gray-300">
                {quickLinksData.map((item) => (
                  <li key={item.name}>
                    <Link href={item.href} className="hover:text-secondary transition-colors text-base">
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Column 3: Opening Hours */}
            <div className="footer-widget">
              <h4 className="fw-title text-xl font-semibold mb-6 text-white">Opening Hours</h4>
              <ul className="footer-link flex flex-col space-y-3 text-gray-300">
                {openingHoursData.map((item) => (
                  <li key={item.day} className="flex justify-between items-center text-base">
                    <span>{item.day}</span>
                    <span>{item.time}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Column 4: Subscribe to our newsletter */}
            {/* The inner newsletter card keeps its solid background to stand out */}
            <div className="footer-widget bg-primary-800 p-8 rounded-xl relative overflow-hidden newsletter-card z-10">
              <h4 className="fw-title text-xl font-semibold mb-6 text-white">Subscribe to our newsletter</h4>
              <p className="text-gray-300 leading-relaxed text-sm mb-4">
                Sign up for our newsletter to get updates on new products and promotions.
              </p>
              <form action="#" className="space-y-4">
                <input
                  type="email"
                  placeholder="Type Your E-mail"
                  className="w-full px-4 py-3 bg-primary-900 border border-transparent rounded-md focus:outline-none focus:border-secondary transition-all duration-200 text-white placeholder-gray-400"
                />
                <button
                  type="submit"
                  className="w-full bg-secondary text-white rounded-full px-5 py-3 shadow-md hover:bg-secondary-700 transition-colors text-base font-semibold"
                >
                  <span>Subscribe Now</span>
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Bottom Area */}
      <div className="footer-bottom bg-primary-900 text-white relative z-10"> {/* Darker background for bottom bar */}
        <div className="container mx-auto px-4 custom-container">
          <div className="py-6 flex flex-col md:flex-row justify-between items-center text-sm text-gray-400">
            {/* Left Links */}
            <ul className="flex flex-wrap justify-center md:justify-start gap-x-4 gap-y-2 mb-2 md:mb-0">
              <li><Link href="/support" className="hover:text-white transition-colors">Support</Link></li>
              <li><Link href="/terms" className="hover:text-white transition-colors">Terms & Conditions</Link></li>
              <li><Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
              <li><Link href="/career" className="hover:text-white transition-colors">Career</Link></li>
            </ul>

            {/* Copyright */}
            <p className="text-center md:text-right">
              Copyright &copy; {currentYear}. All Rights Reserved.
            </p>
          </div>
        </div>
      </div>

      {/* Scroll-to-top button (visually part of footer, but often implemented as fixed position) */}
      <a href="#top" className="absolute bottom-4 right-4 bg-secondary w-10 h-10 flex items-center justify-center rounded-full shadow-lg z-20 hover:bg-secondary-700 transition-colors">
        <i className="fas fa-arrow-up text-white" /> {/* You might need to import Font Awesome or use Lucide's ArrowUp */}
      </a>
    </footer>
  );
};

export default Footer;