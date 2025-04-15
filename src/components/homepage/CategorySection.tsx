
import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";
import { ChevronRight } from "lucide-react";

const categories = [
  {
    name: "Kitchen",
    image: "https://images.unsplash.com/photo-1556911220-bff31c812dba?q=80&w=500",
    link: "/products?category=kitchen",
    description: "Sustainable kitchenware for everyday cooking"
  },
  {
    name: "Electronics",
    image: "https://images.unsplash.com/photo-1526738549149-8e07eca6c147?q=80&w=500",
    link: "/products?category=electronics",
    description: "Eco-friendly gadgets and accessories"
  },
  {
    name: "Stationery",
    image: "https://media.istockphoto.com/id/1298288303/photo/table-with-various-colorful-stationery.jpg?s=612x612&w=0&k=20&c=uPhbYaIFwt_3g0QYehBLvRSHO0iqpSrXHNt35EBfOnQ=",
    link: "/products?category=stationery",
    description: "Recycled paper products and office supplies"
  },
  {
    name: "Bags",
    image: "https://immago.com/wp-content/uploads/2024/12/Eco-garment-bags-with-green-background-SM.jpg",
    link: "/products?category=bags",
    description: "Reusable and stylish bags for all occasions"
  },
  {
    name: "Bathroom",
    image: "https://images.unsplash.com/photo-1620626011761-996317b8d101?q=80&w=500",
    link: "/products?category=bathroom",
    description: "Natural bathroom essentials and accessories"
  }
];

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 100
    }
  },
  hover: {
    y: -5,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 10
    }
  }
};

export function CategorySection() {
  return (
    <section className="py-16 container-custom overflow-hidden">
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-bold mb-3 animate-fade-in">Shop by Category</h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Explore our curated collection of sustainable products for every part of your life
        </p>
      </div>
      
      <motion.div 
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
      >
        {categories.map((category) => (
          <motion.div key={category.name} variants={itemVariants} whileHover="hover">
            <Link to={category.link} className="block h-full">
              <Card className="overflow-hidden hover:shadow-lg transition-shadow h-full border-border/40">
                <CardContent className="p-0">
                  <div className="aspect-video relative group">
                    <img
                      src={category.image}
                      alt={category.name}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-black/30 to-black/70 flex flex-col items-center justify-center p-6 text-center">
                      <h3 className="text-white text-2xl font-bold mb-2">{category.name}</h3>
                      <p className="text-white/80 text-sm mb-4 max-w-xs">{category.description}</p>
                      <div className="flex items-center justify-center text-white text-sm font-medium px-4 py-1.5 rounded-full bg-white/20 backdrop-blur-sm hover:bg-white/30 transition-colors">
                        Browse <ChevronRight className="h-4 w-4 ml-1" />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}
