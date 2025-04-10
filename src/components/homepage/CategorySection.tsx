
import { Link } from "react-router-dom";
import { products } from "@/data/products";
import { cn } from "@/lib/utils";

interface CategoryProps {
  name: string;
  image: string;
  link: string;
  className?: string;
}

function Category({ name, image, link, className }: CategoryProps) {
  return (
    <Link 
      to={link}
      className={cn(
        "group relative overflow-hidden rounded-lg",
        className
      )}
    >
      <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition-colors z-10" />
      <img 
        src={image} 
        alt={name} 
        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
      />
      <div className="absolute inset-0 flex items-center justify-center z-20">
        <h3 className="text-white text-xl font-bold">{name}</h3>
      </div>
    </Link>
  );
}

export function CategorySection() {
  // Extract unique categories
  const categories = Array.from(new Set(products.map(product => product.category)));
  
  const categoryImages: Record<string, string> = {
    bathroom: "https://images.unsplash.com/photo-1620626011761-996317b8d101?w=800&auto=format&fit=crop",
    kitchen: "https://images.unsplash.com/photo-1609167830220-7164aa360951?w=800&auto=format&fit=crop",
    bags: "https://images.unsplash.com/photo-1605133230217-1fabfe018295?w=800&auto=format&fit=crop",
    accessories: "https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=800&auto=format&fit=crop",
    stationery: "https://images.unsplash.com/photo-1531346680769-a1d79b57de5c?w=800&auto=format&fit=crop",
  };
  
  return (
    <section className="py-12 bg-muted">
      <div className="container-custom">
        <h2 className="text-3xl font-bold mb-8 text-center">Shop By Category</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {categories.slice(0, 3).map((category, index) => (
            <Category
              key={category}
              name={category.charAt(0).toUpperCase() + category.slice(1)}
              image={categoryImages[category] || "https://images.unsplash.com/photo-1610701596061-2ecf227e85b2?w=800&auto=format&fit=crop"}
              link={`/products?category=${category}`}
              className={index === 0 ? "md:row-span-2 aspect-square md:aspect-auto" : "aspect-square"}
            />
          ))}
          
          {categories.slice(3, 5).map((category) => (
            <Category
              key={category}
              name={category.charAt(0).toUpperCase() + category.slice(1)}
              image={categoryImages[category] || "https://images.unsplash.com/photo-1610701596061-2ecf227e85b2?w=800&auto=format&fit=crop"}
              link={`/products?category=${category}`}
              className="aspect-square"
            />
          ))}
        </div>
      </div>
    </section>
  );
}
