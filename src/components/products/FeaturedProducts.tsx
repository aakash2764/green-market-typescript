import { useEffect, useState } from "react";
import { fetchFeaturedProducts } from "@/services/supabaseService";
import { ProductCard } from "./ProductCard";

export function FeaturedProducts() {
  const [featuredProducts, setFeaturedProducts] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const products = await fetchFeaturedProducts();
      setFeaturedProducts(products);
    };

    fetchData();
  }, []);

  return (
    <section className="py-12">
      <div className="container-custom">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold">Featured Products</h2>
        </div>

        {featuredProducts.length === 0 ? (
          <div className="text-center py-12">
            <h2 className="text-2xl font-medium mb-2">No Featured Products</h2>
            <p className="text-muted-foreground">Check back later for updates!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}