// src/components/common/ScrollToTopButton.tsx
import React, { useState, useEffect } from 'react';
import { ArrowUp } from 'lucide-react'; // Import Lucide's ArrowUp icon

const ScrollToTopButton: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);

  // Function to scroll to the top
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth' // Smooth scroll animation
    });
  };

  // Effect to add/remove scroll event listener
  useEffect(() => {
    // Handler to check scroll position
    const toggleVisibility = () => {
      // Show button if scrolled down more than 300px (adjust as needed)
      if (window.scrollY > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', toggleVisibility);

    // Clean up the event listener when the component unmounts
    return () => {
      window.removeEventListener('scroll', toggleVisibility);
    };
  }, []); // Empty dependency array means this effect runs once on mount and cleans up on unmount

  return (
    <button
      onClick={scrollToTop}
      className={`
        fixed bottom-4 right-4 bg-secondary w-10 h-10 flex items-center justify-center rounded-full shadow-lg z-50
        hover:bg-secondary-700 transition-all duration-300 ease-in-out
        ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'}
      `}
      aria-label="Scroll to top"
      title="Scroll to top"
    >
      <ArrowUp size={24} className="text-white" /> {/* Lucide ArrowUp icon */}
    </button>
  );
};

export default ScrollToTopButton;