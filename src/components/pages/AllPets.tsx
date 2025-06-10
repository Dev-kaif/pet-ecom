// src/pages/pets.tsx
"use client"; // This is crucial for using client-side hooks like useState, useEffect, useMemo

import React, { useState, useMemo, useEffect, useRef } from "react"; // Import useRef
import Image from "next/image";
import { motion, AnimatePresence } from "motion/react";
import { Search, ChevronDown, ChevronUp, MapPin, Heart } from "lucide-react";

// --- Define types for better type checking ---
interface Pet {
  id: string;
  name: string;
  category: string;
  type: string;
  age: string;
  color: string;
  gender: string;
  size: string;
  weight: string;
  price: number;
  location: string;
  imageUrl: string;
  description: string;
}

// --- Dummy Data (Using the defined Pet interface) ---
const allPetsData: Pet[] = [
  {
    id: "p1",
    name: "Buddy",
    category: "Dog",
    type: "Golden Retriever",
    age: "1-2 Years",
    color: "Golden",
    gender: "Male",
    size: "Medium",
    weight: "25kg",
    price: 500,
    location: "New York",
    imageUrl: "/images/pets/golden-retriever.jpg",
    description: "Friendly and playful, loves walks.",
  },
  {
    id: "p2",
    name: "Whiskers",
    category: "Cat",
    type: "Persian",
    age: "0-1 Year",
    color: "White",
    gender: "Female",
    size: "Small",
    weight: "5kg",
    price: 300,
    location: "Los Angeles",
    imageUrl: "/images/pets/persian-cat.jpg",
    description: "Calm and affectionate, enjoys naps.",
  },
  {
    id: "p3",
    name: "Rocky",
    category: "Dog",
    type: "German Shepherd",
    age: "2-3 Years",
    color: "Black & Tan",
    gender: "Male",
    size: "Large",
    weight: "40kg",
    price: 700,
    location: "Chicago",
    imageUrl: "/images/pets/german-shepherd.jpg",
    description: "Loyal and protective, great family dog.",
  },
  {
    id: "p4",
    name: "Mittens",
    category: "Cat",
    type: "Siamese",
    age: "1-2 Years",
    color: "Cream",
    gender: "Female",
    size: "Small",
    weight: "4kg",
    price: 250,
    location: "Houston",
    imageUrl: "/images/pets/siamese-cat.jpg",
    description: "Vocal and curious, loves to explore.",
  },
  {
    id: "p5",
    name: "Captain",
    category: "Bird",
    type: "Parrot",
    age: "3-4 Years",
    color: "Green",
    gender: "Male",
    size: "Small",
    weight: "0.5kg",
    price: 150,
    location: "Phoenix",
    imageUrl: "/images/pets/parrot.jpg",
    description: "Talkative and intelligent, needs stimulation.",
  },
  {
    id: "p6",
    name: "Bubbles",
    category: "Fish",
    type: "Goldfish",
    age: "0-1 Year",
    color: "Orange",
    gender: "N/A",
    size: "Tiny",
    weight: "0.1kg",
    price: 20,
    location: "Philadelphia",
    imageUrl: "/images/pets/goldfish.jpg",
    description: "Low maintenance, adds color to any tank.",
  },
  {
    id: "p7",
    name: "Shadow",
    category: "Dog",
    type: "Labrador Retriever",
    age: "1-2 Years",
    color: "Black",
    gender: "Male",
    size: "Medium",
    weight: "30kg",
    price: 600,
    location: "San Antonio",
    imageUrl: "/images/pets/labrador.jpg",
    description: "Energetic and friendly, loves to retrieve.",
  },
  {
    id: "p8",
    name: "Luna",
    category: "Cat",
    type: "Maine Coon",
    age: "2-3 Years",
    color: "Grey Tabby",
    gender: "Female",
    size: "Medium",
    weight: "7kg",
    price: 400,
    location: "Dallas",
    imageUrl: "/images/pets/maine-coon.jpg",
    description: "Gentle giant, loves to cuddle.",
  },
  {
    id: "p9",
    name: "Patches",
    category: "Dog",
    type: "Beagle",
    age: "0-1 Year",
    color: "Tri-color",
    gender: "Female",
    size: "Small",
    weight: "10kg",
    price: 450,
    location: "San Jose",
    imageUrl: "/images/pets/beagle.jpg",
    description: "Curious and playful, loves to sniff around.",
  },
  {
    id: "p10",
    name: "Spike",
    category: "Reptile",
    type: "Bearded Dragon",
    age: "1-2 Years",
    color: "Tan",
    gender: "Male",
    size: "Small",
    weight: "0.3kg",
    price: 100,
    location: "Austin",
    imageUrl: "/images/pets/bearded-dragon.jpg",
    description: "Calm and easy to handle, needs proper care.",
  },
  {
    id: "p11",
    name: "Daisy",
    category: "Dog",
    type: "Poodle",
    age: "3-4 Years",
    color: "White",
    gender: "Female",
    size: "Small",
    weight: "7kg",
    price: 550,
    location: "Jacksonville",
    imageUrl: "/images/pets/poodle.jpg",
    description: "Intelligent and elegant, enjoys grooming.",
  },
  {
    id: "p12",
    name: "Oreo",
    category: "Cat",
    type: "Domestic Shorthair",
    age: "0-1 Year",
    color: "Black & White",
    gender: "Male",
    size: "Small",
    weight: "4kg",
    price: 200,
    location: "Indianapolis",
    imageUrl: "/images/pets/domestic-shorthair.jpg",
    description: "Lively and affectionate, loves to play.",
  },
];

// Helper to extract unique filter options
const getUniqueOptions = (data: Pet[], key: keyof Pet) => {
  const options = new Set<string>();
  data.forEach((item) => {
    const value = item[key];
    if (typeof value === "string" && value) {
      options.add(value);
    }
  });
  return Array.from(options).sort();
};

interface PetCardProps {
  pet: Pet;
}

const PetCard: React.FC<PetCardProps> = ({ pet }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -20 }}
    layout
    className="bg-white rounded-xl shadow-md overflow-hidden flex flex-col h-full"
  >
    <div className="relative h-48 w-full">
      <Image
        src={pet.imageUrl || "/images/pets/placeholder.jpg"}
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
        <button className="btn-bubble btn-bubble-primary">
          <span>View Details</span>
        </button>
      </div>
    </div>
  </motion.div>
);

interface FilterSectionProps {
  title: string;
  options: string[];
  selected: string[];
  onChange: (value: string, checked: boolean) => void;
  isExpanded: boolean; // New prop to control expansion
  // showCount?: number; // Removed as showCount will now be managed by the parent PetsPage
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
        {options.map(
          (
            option // Always map all options, visibility controlled by parent container
          ) => (
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
          )
        )}
      </div>
    </div>
  );
};

// Define the shape of the filters state for type safety
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
  const [sortBy, setSortBy] = useState("default");
  const [currentPage, setCurrentPage] = useState(1);
  const [showAllFilters, setShowAllFilters] = useState(false); // New state for filter expansion

  const petGridRef = useRef<HTMLDivElement>(null); // Ref for the pet grid
  const filterSidebarRef = useRef<HTMLElement>(null); // Ref for the filter sidebar

  const [gridHeight, setGridHeight] = useState<number | "auto">("auto"); // State to store grid height

  const ITEMS_PER_PAGE = 9;

  // Generate unique filter options dynamically
  const uniqueCategories = useMemo(
    () => getUniqueOptions(allPetsData, "category"),
    []
  );
  const uniqueTypes = useMemo(() => getUniqueOptions(allPetsData, "type"), []);
  const uniqueAges = useMemo(() => getUniqueOptions(allPetsData, "age"), []);
  const uniqueColors = useMemo(
    () => getUniqueOptions(allPetsData, "color"),
    []
  );
  const uniqueGenders = useMemo(
    () => getUniqueOptions(allPetsData, "gender"),
    []
  );
  const uniqueSizes = useMemo(() => getUniqueOptions(allPetsData, "size"), []);
  const uniqueWeights = useMemo(
    () => getUniqueOptions(allPetsData, "weight"),
    []
  );
  const uniquePriceRanges = useMemo(
    () => ["0-100", "101-300", "301-500", "501-1000", "1000+"],
    []
  );

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
    setCurrentPage(1);
  };

  const filteredAndSortedPets = useMemo(() => {
    const filtered = allPetsData.filter((pet) => {
      if (searchQuery) {
        const lowerCaseSearch = searchQuery.toLowerCase();
        if (
          !pet.name.toLowerCase().includes(lowerCaseSearch) &&
          !pet.type.toLowerCase().includes(lowerCaseSearch) &&
          !pet.description.toLowerCase().includes(lowerCaseSearch)
        ) {
          return false;
        }
      }

      if (
        filters.category.length > 0 &&
        !filters.category.includes(pet.category)
      )
        return false;
      if (filters.type.length > 0 && !filters.type.includes(pet.type))
        return false;
      if (filters.age.length > 0 && !filters.age.includes(pet.age))
        return false;
      if (filters.color.length > 0 && !filters.color.includes(pet.color))
        return false;
      if (filters.gender.length > 0 && !filters.gender.includes(pet.gender))
        return false;
      if (filters.size.length > 0 && !filters.size.includes(pet.size))
        return false;
      if (filters.weight.length > 0 && !filters.weight.includes(pet.weight))
        return false;
      if (filters.priceRange.length > 0) {
        const matchesPriceRange = filters.priceRange.some((range) => {
          const parts = range.split("-");
          const min = parseInt(parts[0]);
          const max =
            parts[1] === undefined || parts[1] === ""
              ? Infinity
              : parseInt(parts[1]);
          return pet.price >= min && pet.price <= max;
        });
        if (!matchesPriceRange) return false;
      }
      return true;
    });

    switch (sortBy) {
      case "newest":
        filtered.sort((a, b) => b.id.localeCompare(a.id));
        break;
      case "oldest":
        filtered.sort((a, b) => a.id.localeCompare(b.id));
        break;
      case "priceAsc":
        filtered.sort((a, b) => a.price - b.price);
        break;
      case "priceDesc":
        filtered.sort((a, b) => b.price - a.price);
        break;
      case "popular":
        break;
      default:
        filtered.sort((a, b) => a.name.localeCompare(b.name));
        break;
    }
    return filtered;
  }, [filters, searchQuery, sortBy]);

  const totalPages = Math.ceil(filteredAndSortedPets.length / ITEMS_PER_PAGE);
  const currentPets = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    return filteredAndSortedPets.slice(startIndex, endIndex);
  }, [filteredAndSortedPets, currentPage]);

  useEffect(() => {
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(totalPages);
    } else if (totalPages === 0 && currentPage !== 1) {
      setCurrentPage(1);
    }
  }, [currentPage, totalPages, filteredAndSortedPets]);

  // Effect to measure the height of the pet grid
  useEffect(() => {
    const updateGridHeight = () => {
      if (petGridRef.current) {
        // Adjust for potential padding/margin on the grid container or items
        // We want the height of the main content area that holds the cards.
        // It's generally better to get the scrollHeight of the actual grid if it's scrollable,
        // or the clientHeight of its container.
        const height = petGridRef.current.offsetHeight;
        setGridHeight(height);
      }
    };

    // Initial measurement
    updateGridHeight();

    // Re-measure on window resize and when currentPets (which affects grid height) changes
    window.addEventListener("resize", updateGridHeight);
    // Use a MutationObserver to detect changes in the DOM, like new cards being loaded
    const observer = new MutationObserver(updateGridHeight);
    if (petGridRef.current) {
      observer.observe(petGridRef.current, {
        childList: true,
        subtree: true,
        attributes: true,
      });
    }

    return () => {
      window.removeEventListener("resize", updateGridHeight);
      observer.disconnect();
    };
  }, [currentPets]); // Re-run when currentPets changes (and thus grid content changes)

  // Determine which filter sections to display based on showAllFilters
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
    <div className="bg-gray-50 py-16 lg:py-24">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Filters */}
          <aside
            ref={filterSidebarRef}
            className={`w-full lg:w-1/4 bg-white p-6 rounded-xl shadow-md lg:sticky lg:top-8 lg:self-start transition-all duration-500 ease-in-out ${
              showAllFilters ? "lg:max-h-full" : `lg:max-h-[${gridHeight}px]`
            } lg:overflow-hidden`} // Apply dynamic height and overflow-hidden
            style={
              showAllFilters
                ? {}
                : { maxHeight: gridHeight !== "auto" ? gridHeight : "auto" }
            } // Apply style directly for precise control
          >
            <h3 className="text-xl font-bold text-primary mb-6">Filter By</h3>

            {/* Always visible filter sections */}
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
                isExpanded={true} // These are always visible initially
              />
            ))}

            {/* Conditionally visible filter sections */}
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
                      isExpanded={true}
                    />
                  ))}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Show More/Less Button */}
            {hiddenFilterSections.some(
              (section) => section.options.length > 0
            ) && ( // Only show button if there are hidden filters with options
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
                  <option value="default">Sort by: Default</option>
                  <option value="newest">Sort by: Newest</option>
                  <option value="priceAsc">Sort by: Price (Low to High)</option>
                  <option value="priceDesc">
                    Sort by: Price (High to Low)
                  </option>
                  <option value="oldest">Sort by: Oldest</option>
                </select>
                <ChevronDown
                  size={18}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                />
              </div>
            </div>

            {/* Pet Cards Grid */}
            {currentPets.length > 0 ? (
              <motion.div
                ref={petGridRef}
                layout
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              >
                <AnimatePresence mode="popLayout">
                  {currentPets.map((pet) => (
                    <PetCard key={pet.id} pet={pet} />
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
