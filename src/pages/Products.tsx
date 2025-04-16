
import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { fetchProducts } from "@/services/supabaseService";
import { AnimatedProductCard } from "@/components/products/AnimatedProductCard";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, Filter } from "lucide-react";
import { pageVariants, itemVariants } from "@/lib/animations";

export default function Products() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  const categoryParam = searchParams.get("category");

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      const allProducts = await fetchProducts();
      setProducts(allProducts);
      setIsLoading(false);
    };

    fetchData();
  }, []);

  useEffect(() => {
    let filtered = products;

    // Filter by category if provided in URL
    if (categoryParam && categoryParam !== "all") {
      filtered = filtered.filter((product) => product.category === categoryParam);
    }

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(
        (product) =>
          product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          product.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredProducts(filtered);
  }, [products, categoryParam, searchTerm]);

  const handleCategoryChange = (category: string) => {
    if (category === "all") {
      searchParams.delete("category");
    } else {
      searchParams.set("category", category);
    }
    setSearchParams(searchParams);
  };

  // Get unique categories for the filter
  const categories = ["all", ...Array.from(new Set(products.map((product) => product.category)))];

  return (
    <motion.div 
      variants={pageVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      className="container-custom py-12"
    >
      <motion.h1 
        variants={itemVariants}
        className="text-3xl font-bold mb-8"
      >
        Products
      </motion.h1>

      <motion.div 
        variants={itemVariants}
        className="flex flex-col md:flex-row gap-4 mb-8"
      >
        <div className="relative flex-grow">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        <div className="w-full md:w-64">
          <Select value={categoryParam || "all"} onValueChange={handleCategoryChange}>
            <SelectTrigger>
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue placeholder="All Categories" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((category) => (
                <SelectItem key={category} value={category}>
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </motion.div>

      {isLoading ? (
        <motion.div 
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
        >
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <motion.div
              key={i}
              className="product-card h-[300px] bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700"
              variants={itemVariants}
              animate={{
                backgroundPosition: ["0% 0%", "100% 100%"],
                transition: {
                  duration: 1.5,
                  repeat: Infinity,
                  repeatType: "reverse",
                  ease: "linear"
                }
              }}
            />
          ))}
        </motion.div>
      ) : filteredProducts.length === 0 ? (
        <motion.div 
          variants={itemVariants}
          className="text-center py-12"
        >
          <h2 className="text-2xl font-medium mb-2">No products found</h2>
          <p className="text-muted-foreground">Try changing your search or filter criteria</p>
        </motion.div>
      ) : (
        <motion.div 
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
        >
          {filteredProducts.map((product, index) => (
            <AnimatedProductCard key={product.id} product={product} />
          ))}
        </motion.div>
      )}
    </motion.div>
  );
}
