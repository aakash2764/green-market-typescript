
import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { products as allProducts } from "@/data/products";
import { ProductCard } from "@/components/products/ProductCard";
import { Input } from "@/components/ui/input";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue 
} from "@/components/ui/select";
import { Search, Filter } from "lucide-react";

export default function Products() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState(allProducts);
  const [searchTerm, setSearchTerm] = useState("");
  
  const categoryParam = searchParams.get("category");
  
  useEffect(() => {
    let filteredProducts = allProducts;
    
    // Filter by category if provided in URL
    if (categoryParam) {
      filteredProducts = filteredProducts.filter(
        (product) => product.category === categoryParam
      );
    }
    
    // Filter by search term
    if (searchTerm) {
      filteredProducts = filteredProducts.filter(
        (product) =>
          product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          product.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    setProducts(filteredProducts);
  }, [categoryParam, searchTerm]);
  
  const handleCategoryChange = (category: string) => {
    if (category === "all") {
      searchParams.delete("category");
    } else {
      searchParams.set("category", category);
    }
    setSearchParams(searchParams);
  };
  
  // Get unique categories for the filter
  const categories = ["all", ...Array.from(new Set(allProducts.map((product) => product.category)))];
  
  return (
    <div className="container-custom py-12">
      <h1 className="text-3xl font-bold mb-8">Products</h1>
      
      <div className="flex flex-col md:flex-row gap-4 mb-8">
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
          <Select 
            value={categoryParam || "all"}
            onValueChange={handleCategoryChange}
          >
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
      </div>
      
      {products.length === 0 ? (
        <div className="text-center py-12">
          <h2 className="text-2xl font-medium mb-2">No products found</h2>
          <p className="text-muted-foreground">
            Try changing your search or filter criteria
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}
