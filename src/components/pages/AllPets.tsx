/* eslint-disable @typescript-eslint/no-explicit-any */
// src/pages/pets.tsx (or src/app/pets/page.tsx for App Router)
"use client";

import React, { useState, useMemo, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion"; // Or "motion/react" if you prefer
import { Search, ChevronDown, ChevronUp, MapPin, Heart } from "lucide-react";
import { IPet } from "@/types"; // Import your IPet interface
import { useRouter } from "next/navigation"; // For App Router, use "next/navigation"
import Loader from "../ui/Loader"; // Import your Loader component


interface PetCardProps {
  pet: IPet; // Use IPet type
}

const PetCard: React.FC<PetCardProps> = ({ pet }) => {
  const router = useRouter();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      layout
      className="bg-white rounded-xl shadow-md overflow-hidden flex flex-col h-full cursor-pointer"
      onClick={() => router.push(`/petdetails/${pet._id}`)} // Route to pet details
    >
      <div className="relative h-48 w-full">
        <Image
        unoptimized
          src={pet.images?.[0] || "/images/pets/placeholder.jpg"}
          alt={pet.name}
          fill
          style={{ objectFit: "cover" }}
          className="transition-transform duration-300 hover:scale-105"
        />
        <div className="absolute top-3 right-3 bg-white p-2 rounded-full shadow-sm text-red-500 cursor-pointer">
          <Heart size={20} fill="currentColor" />
        </div>
      </div>
      <div className="p-4 flex flex-col flex-grow">
        <h3 className="text-xl font-bold text-primary mb-2">{pet.name}</h3>
        <p className="text-gray-600 text-sm mb-3 flex items-center">
          <MapPin size={16} className="mr-1 text-secondary" /> {pet.location}
        </p>
        <div className="flex justify-between items-center text-gray-700 text-sm mb-3">
          <span>Type: {pet.type}</span>
          <span>Age: {pet.age}</span>
        </div>
        <div className="flex justify-between items-center text-gray-700 text-sm mb-4">
          <span>Gender: {pet.gender}</span>
          <span>Size: {pet.size}</span>
        </div>
        <p className="text-gray-500 text-sm mb-4 line-clamp-2 flex-grow">
          {pet.description}
        </p>
        <div className="mt-auto flex justify-between items-center pt-3 border-t border-gray-100">
          <span className="text-2xl font-bold text-secondary">${pet.price}</span>
          <button className="btn-bubble btn-bubble-primary" onClick={(e) => { e.stopPropagation(); router.push(`/allPets/petDetails/${pet._id}`); }}>
            <span>View Details</span>
          </button>
        </div>
      </div>
    </motion.div>
  );
};

interface FilterSectionProps {
  title: string;
  options: string[];
  selected: string[];
  onChange: (value: string, checked: boolean) => void;
}

const FilterSection: React.FC<FilterSectionProps> = ({
  title,
  options,
  selected,
  onChange,
}) => {
  if (options.length === 0) return null;

  return (
    <div className="mb-6 pb-4 border-b border-gray-200 last:border-b-0">
      <h4 className="font-semibold text-lg text-primary mb-3">{title}</h4>
      <div className="space-y-2">
        {options.map((option) => (
          <label
            key={option}
            className="flex items-center text-gray-700 text-sm cursor-pointer"
          >
            <input
              type="checkbox"
              className="form-checkbox h-4 w-4 text-secondary rounded focus:ring-secondary mr-2"
              checked={selected.includes(option)}
              onChange={(e) => onChange(option, e.target.checked)}
            />
            {option}
          </label>
        ))}
      </div>
    </div>
  );
};

interface PetFilters {
  category: string[];
  type: string[];
  age: string[];
  color: string[];
  gender: string[];
  size: string[];
  weight: string[];
  priceRange: string[];
}

const PetsPage: React.FC = () => {
  const [pets, setPets] = useState<IPet[]>([]); // State to store fetched pets
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState<string | null>(null); // Error state
  const [, setTotalItems] = useState(0); // Total items from API
  const [totalPages, setTotalPages] = useState(1); // Total pages from API

  const [filters, setFilters] = useState<PetFilters>({
    category: [],
    type: [],
    age: [],
    color: [],
    gender: [],
    size: [],
    weight: [],
    priceRange: [],
  });
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("createdAt_desc"); // Default sort to newest
  const [currentPage, setCurrentPage] = useState(1);
  const [showAllFilters, setShowAllFilters] = useState(false);

  // Memoize filter options (these would ideally be fetched from API or be static and complete)
  const uniqueCategories = useMemo(() => ["Dog", "Cat", "Bird", "Fish", "Reptile"], []);
  const uniqueTypes = useMemo(() => ["Golden Retriever", "Persian", "German Shepherd", "Siamese", "Parrot", "Goldfish", "Labrador Retriever", "Maine Coon", "Beagle", "Bearded Dragon", "Poodle", "Domestic Shorthair"], []);
  const uniqueAges = useMemo(() => ["0-1 Year", "1-2 Years", "2-3 Years", "3-4 Years"], []);
  const uniqueColors = useMemo(() => ["Golden", "White", "Black & Tan", "Cream", "Green", "Orange", "Black", "Grey Tabby", "Tri-color", "Tan", "Black & White"], []);
  const uniqueGenders = useMemo(() => ["Male", "Female", "N/A"], []);
  const uniqueSizes = useMemo(() => ["Tiny", "Small", "Medium", "Large"], []);
  const uniqueWeights = useMemo(() => ["0.1kg", "0.3kg", "0.5kg", "4kg", "5kg", "7kg", "10kg", "25kg", "30kg", "40kg"], []);
  const uniquePriceRanges = useMemo(() => ["0-100", "101-300", "301-500", "501-1000", "1000+"], []);

  const petGridRef = useRef<HTMLDivElement>(null);
  const filterSidebarRef = useRef<HTMLElement>(null);
  const [gridHeight, setGridHeight] = useState<number | "auto">("auto");

  // Function to fetch pets from the backend API
  const fetchPets = useCallback(async () => {
    setLoading(true);
    setError(null);
    let queryString = `page=${currentPage}&limit=9`; // Hardcode limit to 9 for now

    // Add search queries
    if (searchQuery) {
      queryString += `&name_search=${encodeURIComponent(searchQuery)}`;
    }

    // Add filter queries
    if (filters.category.length > 0) {
      queryString += `&category=${filters.category.map(c => c.toLowerCase()).join(',')}`;
    }
    if (filters.type.length > 0) {
      queryString += `&type_search=${filters.type.join(',')}`;
    }
    if (filters.gender.length > 0) {
        queryString += `&gender=${filters.gender.join(',')}`;
    }
    if (filters.size.length > 0) {
        queryString += `&size=${filters.size.join(',')}`;
    }
    // Price range handling - needs careful backend mapping
    if (filters.priceRange.length > 0) {
        let minPrice = Infinity;
        let maxPrice = 0;
        filters.priceRange.forEach(range => {
            const parts = range.split("-");
            const min = parseInt(parts[0]);
            const max = parts[1] === undefined || parts[1] === "" ? Infinity : parseInt(parts[1]);
            minPrice = Math.min(minPrice, min);
            maxPrice = Math.max(maxPrice, max);
        });
        if (minPrice !== Infinity) queryString += `&price_min=${minPrice}`;
        if (maxPrice !== 0) queryString += `&price_max=${maxPrice === Infinity ? '' : maxPrice}`; // Backend expects no value for max if infinity
    }
    // Add other filters as needed

    // Add sort parameter (backend needs to handle `sortField` and `sortOrder` query params)
    let sortField = 'createdAt';
    let sortOrder = 'desc';

    switch (sortBy) {
        case 'newest': sortField = 'createdAt'; sortOrder = 'desc'; break;
        case 'oldest': sortField = 'createdAt'; sortOrder = 'asc'; break;
        case 'priceAsc': sortField = 'price'; sortOrder = 'asc'; break;
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        case 'priceDesc': sortField = 'price'; sortOrder = 'desc'; break;
        default: break; // default sorting is already handled by backend
    }
    // IMPORTANT: Your backend GET handler needs to process these sortField and sortOrder params
    // Example: queryString += `&sortField=${sortField}&sortOrder=${sortOrder}`;
    // If your backend only sorts by createdAt: -1 (newest) by default, then `sortBy` selection
    // will not affect the order unless you implement sorting logic on the backend.

    try {
      const response = await fetch(`/api/pets?${queryString}`); // Make sure this matches your API endpoint
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      if (data.success) {
        setPets(data.data);
        setTotalItems(data.pagination.totalItems);
        setTotalPages(data.pagination.totalPages);
      } else {
        setError(data.message || "Failed to fetch pets.");
      }
    } catch (err: any) {
      console.error("Failed to fetch pets:", err);
      setError(err.message || "An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  }, [currentPage, searchQuery, filters, sortBy]); // Dependencies for useCallback

  // Trigger fetchPets whenever relevant state changes
  useEffect(() => {
    fetchPets();
    // Smooth scroll to top when filters/pagination/search changes
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [fetchPets]);

  const handleFilterChange = (
    filterType: keyof PetFilters,
    value: string,
    checked: boolean
  ) => {
    setFilters((prev) => {
      const currentFilterValues = prev[filterType];
      const newValues = checked
        ? [...currentFilterValues, value]
        : currentFilterValues.filter((item) => item !== value);
      return { ...prev, [filterType]: newValues };
    });
    setCurrentPage(1); // Reset to first page on filter change
  };


  useEffect(() => {
    // This effect is for dynamically adjusting sidebar height to match grid height
    const updateGridHeight = () => {
      if (petGridRef.current) {
        const height = petGridRef.current.offsetHeight;
        setGridHeight(height);
      }
    };

    updateGridHeight(); // Call initially

    // Set up observers for changes
    window.addEventListener("resize", updateGridHeight);
    const observer = new MutationObserver(updateGridHeight);
    if (petGridRef.current) {
      observer.observe(petGridRef.current, {
        childList: true, // Observe direct children
        subtree: true,   // Observe all descendants
        attributes: true, // Observe attribute changes (e.g., class changes from motion.div)
        characterData: true // Observe changes to text content
      });
    }

    // Cleanup
    return () => {
      window.removeEventListener("resize", updateGridHeight);
      observer.disconnect();
    };
  }, [pets, loading]); // Depend on 'pets' and 'loading' state to re-evaluate height


  const initialFilterSections = [
    {
      title: "Categories",
      options: uniqueCategories,
      selected: filters.category,
      type: "category",
    },
    {
      title: "Type",
      options: uniqueTypes,
      selected: filters.type,
      type: "type",
    },
  ];

  const hiddenFilterSections = [
    { title: "Age", options: uniqueAges, selected: filters.age, type: "age" },
    {
      title: "Color",
      options: uniqueColors,
      selected: filters.color,
      type: "color",
    },
    {
      title: "Gender",
      options: uniqueGenders,
      selected: filters.gender,
      type: "gender",
    },
    {
      title: "Size",
      options: uniqueSizes,
      selected: filters.size,
      type: "size",
    },
    {
      title: "Weight",
      options: uniqueWeights,
      selected: filters.weight,
      type: "weight",
    },
    {
      title: "Price Range",
      options: uniquePriceRanges,
      selected: filters.priceRange,
      type: "priceRange",
    },
  ];

  return (
    <div className="bg-gray-50 py-16 lg:py-24 min-h-screen">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Filters */}
          <aside
            ref={filterSidebarRef}
            className={`w-full lg:w-1/4 bg-white p-6 rounded-xl shadow-md lg:sticky lg:top-8 lg:self-start transition-all duration-500 ease-in-out ${
              showAllFilters ? "lg:max-h-full" : `lg:max-h-[${gridHeight}px]`
            } lg:overflow-hidden`}
            // Fallback for initial render if gridHeight is 'auto'
            style={typeof gridHeight === 'number' ? { maxHeight: gridHeight + 'px' } : {}}
          >
            <h3 className="text-xl font-bold text-primary mb-6">Filter By</h3>

            {initialFilterSections.map((section) => (
              <FilterSection
                key={section.type}
                title={section.title}
                options={section.options}
                selected={section.selected}
                onChange={(value, checked) =>
                  handleFilterChange(
                    section.type as keyof PetFilters,
                    value,
                    checked
                  )
                }
              />
            ))}

            <AnimatePresence>
              {showAllFilters && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden"
                >
                  {hiddenFilterSections.map((section) => (
                    <FilterSection
                      key={section.type}
                      title={section.title}
                      options={section.options}
                      selected={section.selected}
                      onChange={(value, checked) =>
                        handleFilterChange(
                          section.type as keyof PetFilters,
                          value,
                          checked
                        )
                      }
                    />
                  ))}
                </motion.div>
              )}
            </AnimatePresence>

            {hiddenFilterSections.some(
              (section) => section.options.length > 0
            ) && (
              <div className="pt-4 mt-2">
                <button
                  onClick={() => setShowAllFilters(!showAllFilters)}
                  className="flex items-center justify-center w-full bg-secondary text-white px-4 py-2 rounded-lg font-semibold hover:bg-opacity-90 transition-opacity"
                >
                  {showAllFilters ? (
                    <>
                      <ChevronUp size={20} className="mr-2" /> Show Less Filters
                    </>
                  ) : (
                    <>
                      <ChevronDown size={20} className="mr-2" /> Show More
                      Filters
                    </>
                  )}
                </button>
              </div>
            )}
          </aside>

          {/* Main Content Area */}
          <div className="w-full lg:w-3/4">
            {/* Search and Sort Bar */}
            <div className="flex flex-col sm:flex-row justify-between items-center bg-white p-4 rounded-xl shadow-md mb-8 gap-4">
              <div className="relative w-full sm:w-2/3">
                <Search
                  size={20}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                />
                <input
                  type="text"
                  placeholder="Search pet by name, type, etc."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary"
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setCurrentPage(1);
                  }}
                />
              </div>

              <div className="relative w-full sm:w-1/3">
                <select
                  className="w-full p-2 border border-gray-300 rounded-lg appearance-none bg-white pr-10 focus:outline-none focus:ring-2 focus:ring-secondary"
                  value={sortBy}
                  onChange={(e) => {
                    setSortBy(e.target.value);
                    setCurrentPage(1);
                  }}
                >
                  <option value="createdAt_desc">Sort by: Newest</option>
                  <option value="createdAt_asc">Sort by: Oldest</option>
                  <option value="priceAsc">Sort by: Price (Low to High)</option>
                  <option value="priceDesc">
                    Sort by: Price (High to Low)
                  </option>
                </select>
                <ChevronDown
                  size={18}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                />
              </div>
            </div>

            {/* Loading, Error, or Pet Cards Grid */}
            {loading ? (
              <div className="text-center text-gray-600 text-xl py-10 bg-white rounded-xl shadow-md">
                <Loader /> {/* Display the Loader component */}
              </div>
            ) : error ? (
              <div className="text-center text-red-600 text-xl py-10 bg-white rounded-xl shadow-md">
                Error: {error}
              </div>
            ) : pets.length > 0 ? (
              <motion.div
                ref={petGridRef}
                layout
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              >
                <AnimatePresence mode="popLayout">
                  {pets.map((pet) => (
                    <PetCard key={pet._id} pet={pet} /> 
                  ))}
                </AnimatePresence>
              </motion.div>
            ) : (
              <div
                ref={petGridRef}
                className="text-center text-gray-600 text-xl py-10 bg-white rounded-xl shadow-md"
              >
                No pets found matching your criteria.
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center space-x-2 mt-12">
                <button
                  onClick={() =>
                    setCurrentPage((prev) => Math.max(prev - 1, 1))
                  }
                  disabled={currentPage === 1}
                  className="px-4 py-2 rounded-lg bg-white text-gray-700 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1)
                  .filter(
                    (page) =>
                      page === 1 ||
                      page === totalPages ||
                      (page >= currentPage - 2 && page <= currentPage + 2)
                  )
                  .map((page) => (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`px-4 py-2 rounded-lg ${
                        currentPage === page
                          ? "bg-secondary text-white"
                          : "bg-white text-gray-700 hover:bg-gray-100"
                      }`}
                    >
                      {page}
                    </button>
                  ))}
                <button
                  onClick={() =>
                    setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                  }
                  disabled={currentPage === totalPages}
                  className="px-4 py-2 rounded-lg bg-white text-gray-700 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PetsPage;