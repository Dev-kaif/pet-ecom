/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, {
  useState,
  useEffect,
  useCallback,
  useMemo,
  useRef,
} from "react";
import ProductCard from "@/components/ui/ProductCard"; // Adjust path if needed
import Pagination from "@/components/ui/pagination"; // Adjust path if needed
import { motion, AnimatePresence } from "motion/react"; // Import AnimatePresence
import { IProduct } from "@/types";
import Loader from "../ui/Loader";
import { Search, ChevronDown, ChevronUp } from "lucide-react"; // Import icons

// Define products per page for the frontend display and API request limit
const PRODUCTS_PER_PAGE = 15;

// Helper to extract unique filter options (similar to AllPets.tsx)
const getUniqueOptions = (data: IProduct[], key: keyof IProduct) => {
  const options = new Set<string>();
  data.forEach((item) => {
    const value = item[key];
    if (typeof value === "string" && value) {
      options.add(value);
    } else if (typeof value === "number") {
      options.add(String(value)); // Convert numbers to string for consistency
    }
  });
  return Array.from(options).sort();
};

interface FilterSectionProps {
  title: string;
  options: string[];
  selected: string[];
  onChange: (value: string, checked: boolean) => void;
  isExpanded: boolean; // Not strictly used in this version but good to keep for consistency
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

// Define the structure for your product filters
interface ProductFilters {
  category: string[];
  priceRange: string[];
  // brand: string[];
  // material: string[];
}

const Shop: React.FC = () => {
  const [products, setProducts] = useState<IProduct[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [, setTotalItems] = useState<number>(0);

  const [filters, setFilters] = useState<ProductFilters>({
    category: [],
    priceRange: [],
  });
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("default");
  const [showAllFilters, setShowAllFilters] = useState(false);

  const productGridRef = useRef<HTMLDivElement>(null);
  const [gridHeight, setGridHeight] = useState<number | "auto">("auto");

  // --- Dummy data for filtering options (replace with actual product properties) ---
  // You would typically get these from your `products` data after fetching
  const uniqueCategories = useMemo(
    () => getUniqueOptions(products, "category"), // Assuming 'category' exists in IProduct
    [products]
  );
  const uniquePriceRanges = useMemo(
    () => ["0-50", "51-100", "101-200", "201-500", "500+"],
    []
  );
  // Add other unique options as needed, e.g.,
  // const uniqueBrands = useMemo(() => getUniqueOptions(products, "brand"), [products]);

  // Function to fetch products from the backend API
  const fetchProducts = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      // IMPORTANT: For robust filtering, you should pass filter parameters to your API
      // Example: `/api/products?page=${currentPage}&limit=${PRODUCTS_PER_PAGE}&category=${filters.category.join(',')}&search=${searchQuery}`
      // The backend would then handle the filtering before sending data.
      const response = await fetch(
        `/api/products?page=${currentPage}&limit=${PRODUCTS_PER_PAGE}`
      );
      const data = await response.json();

      if (data.success) {
        setProducts(data.data);
        setTotalPages(data.pagination.totalPages);
        setTotalItems(data.pagination.totalItems);
      } else {
        setError(data.message || "Failed to fetch products.");
        setProducts([]);
      }
    } catch (err: any) {
      console.error("Error fetching products:", err);
      setError("Network error: Could not connect to the server.");
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }, [currentPage]); // Re-run fetch when currentPage changes

  // Trigger product fetch when the component mounts or currentPage changes
  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  // Handle filter changes
  const handleFilterChange = (
    filterType: keyof ProductFilters,
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

  // Filter and Sort Logic (Client-side for demonstration)
  // For large datasets, this should ideally be done on the server.
  const filteredAndSortedProducts = useMemo(() => {
    let tempProducts = [...products]; // Use the currently fetched products

    // Apply search query
    if (searchQuery) {
      const lowerCaseSearch = searchQuery.toLowerCase();
      tempProducts = tempProducts.filter(
        (product) =>
          product.name.toLowerCase().includes(lowerCaseSearch) ||
          product.category.toLowerCase().includes(lowerCaseSearch) ||
          (product.description &&
            product.description.toLowerCase().includes(lowerCaseSearch)) // Assuming description field
      );
    }

    // Apply filters
    tempProducts = tempProducts.filter((product) => {
      if (
        filters.category.length > 0 &&
        !filters.category.includes(product.category)
      ) {
        return false;
      }
      if (filters.priceRange.length > 0) {
        const matchesPriceRange = filters.priceRange.some((range) => {
          const parts = range.split("-");
          const min = parseFloat(parts[0]);
          const max =
            parts[1] === undefined || parts[1] === ""
              ? Infinity
              : parseFloat(parts[1]);
          return product.price >= min && product.price <= max;
        });
        if (!matchesPriceRange) return false;
      }
      // Add other filter logic here
      return true;
    });

    // Apply sorting
    switch (sortBy) {
      case "newest":
        // Assuming products have a creation date or a suitable ID for "newest"
        tempProducts.sort((a, b) =>
          (b._id?.toString() || "").localeCompare(a._id?.toString() || "")
        );
        break;
      case "priceAsc":
        tempProducts.sort((a, b) => a.price - b.price);
        break;
      case "priceDesc":
        tempProducts.sort((a, b) => b.price - a.price);
        break;
      // Add other sorting options as needed
      case "default":
      default:
        tempProducts.sort((a, b) => a.name.localeCompare(b.name));
        break;
    }
    return tempProducts;
  }, [products, filters, searchQuery, sortBy]);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  // Adjust current products to display based on client-side filtered and sorted data
  // This will only paginate the *currently fetched* data if not filtering on the server
  const currentProducts = useMemo(() => {
    const startIndex = (currentPage - 1) * PRODUCTS_PER_PAGE;
    const endIndex = startIndex + PRODUCTS_PER_PAGE;
    return filteredAndSortedProducts.slice(startIndex, endIndex);
  }, [filteredAndSortedProducts, currentPage]);

  const currentTotalPages = Math.ceil(
    filteredAndSortedProducts.length / PRODUCTS_PER_PAGE
  );

  useEffect(() => {
    if (currentPage > currentTotalPages && currentTotalPages > 0) {
      setCurrentPage(currentTotalPages);
    } else if (currentTotalPages === 0 && currentPage !== 1) {
      setCurrentPage(1);
    }
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [currentPage, currentTotalPages, filteredAndSortedProducts]);

  useEffect(() => {
    const updateGridHeight = () => {
      if (productGridRef.current) {
        const height = productGridRef.current.offsetHeight;
        setGridHeight(height);
      }
    };

    updateGridHeight();

    window.addEventListener("resize", updateGridHeight);
    const observer = new MutationObserver(updateGridHeight);
    if (productGridRef.current) {
      observer.observe(productGridRef.current, {
        childList: true,
        subtree: true,
        attributes: true,
      });
    }

    return () => {
      window.removeEventListener("resize", updateGridHeight);
      observer.disconnect();
    };
  }, [currentProducts]);

  const initialFilterSections = [
    {
      title: "Categories",
      options: uniqueCategories,
      selected: filters.category,
      type: "category",
    },
    // Add more initial filters here if desired
  ];

  const hiddenFilterSections = [
    {
      title: "Price Range",
      options: uniquePriceRanges,
      selected: filters.priceRange,
      type: "priceRange",
    },
    // Add other hidden filters here, e.g., brand, material, etc.
    // { title: "Brand", options: uniqueBrands, selected: filters.brand, type: "brand" },
  ];

  if (loading) {
    return <Loader />;
  }

  return (
    <motion.div
      className="min-h-screen bg-gray-50 py-16 lg:py-24 font-sans" // Adjusted background color
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Filters */}
          <aside
            className={`w-full lg:w-1/4 bg-white p-6 rounded-xl shadow-md lg:sticky lg:top-8 lg:self-start transition-all duration-500 ease-in-out ${
              showAllFilters ? "lg:max-h-full" : `lg:max-h-[${gridHeight}px]`
            } lg:overflow-hidden`}
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
                    section.type as keyof ProductFilters,
                    value,
                    checked
                  )
                }
                isExpanded={true}
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
                          section.type as keyof ProductFilters,
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
                  placeholder="Search products by name, category, etc."
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
                  {/* Add other sort options like "popular" if applicable */}
                </select>
                <ChevronDown
                  size={18}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                />
              </div>
            </div>

            {error && (
              <div className="flex items-center justify-center h-64">
                <p className="text-red-600 text-lg">Error: {error}</p>
              </div>
            )}

            {!loading && !error && currentProducts.length === 0 && (
              <div
                ref={productGridRef}
                className="text-center text-gray-600 text-xl py-10 bg-white rounded-xl shadow-md"
              >
                No products found matching your criteria.
              </div>
            )}

            {!loading && !error && currentProducts.length > 0 && (
              <motion.div
                ref={productGridRef}
                className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6"
                key={currentPage} // Key change forces re-animation on page change
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <AnimatePresence mode="popLayout">
                  {currentProducts.map((product) => (
                    <ProductCard
                      key={product._id?.toString() || product.name}
                      product={product}
                    />
                  ))}
                </AnimatePresence>
              </motion.div>
            )}

            {/* Only show pagination if there are products and more than one page */}
            {!loading &&
              !error &&
              currentProducts.length > 0 &&
              currentTotalPages > 1 && (
                <Pagination
                  currentPage={currentPage}
                  totalPages={currentTotalPages}
                  onPageChange={handlePageChange}
                />
              )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default Shop;
