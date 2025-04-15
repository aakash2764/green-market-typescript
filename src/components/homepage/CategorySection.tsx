
import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";
import { 
  ChevronRight, 
  ShoppingBag, 
  Utensils, 
  Smartphone, 
  Pen, 
  ShowerHead
} from "lucide-react";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";

const categories = [
  {
    name: "Kitchen",
    image: "https://images.unsplash.com/photo-1556911220-bff31c812dba?q=80&w=500",
    link: "/products?category=kitchen",
    description: "Sustainable kitchenware for everyday cooking",
    icon: Utensils,
    items: ["Bamboo utensils", "Reusable containers", "Eco-friendly cookware"]
  },
  {
    name: "Electronics",
    image: "https://images.unsplash.com/photo-1526738549149-8e07eca6c147?q=80&w=500",
    link: "/products?category=electronics",
    description: "Eco-friendly gadgets and accessories",
    icon: Smartphone,
    items: ["Solar chargers", "Energy-efficient devices", "Recyclable accessories"]
  },
  {
    name: "Stationery",
    image: "https://media.istockphoto.com/id/1298288303/photo/table-with-various-colorful-stationery.jpg?s=612x612&w=0&k=20&c=uPhbYaIFwt_3g0QYehBLvRSHO0iqpSrXHNt35EBfOnQ=",
    link: "/products?category=stationery",
    description: "Recycled paper products and office supplies",
    icon: Pen,
    items: ["Recycled notebooks", "Biodegradable pens", "Plant-based adhesives"]
  },
  {
    name: "Bags",
    image: "https://immago.com/wp-content/uploads/2024/12/Eco-garment-bags-with-green-background-SM.jpg",
    link: "/products?category=bags",
    description: "Reusable and stylish bags for all occasions",
    icon: ShoppingBag,
    items: ["Canvas totes", "Jute grocery bags", "Upcycled backpacks"]
  },
  {
    name: "Bathroom",
    image: "https://images.unsplash.com/photo-1620626011761-996317b8d101?q=80&w=500",
    link: "/products?category=bathroom",
    description: "Natural bathroom essentials and accessories",
    icon: ShowerHead,
    items: ["Bamboo toothbrushes", "Zero-waste soaps", "Organic cotton towels"]
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
    boxShadow: "0px 10px 20px rgba(0,0,0,0.1)",
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 10
    }
  }
};

const overlayVariants = {
  initial: { 
    opacity: 0.7,
    background: "linear-gradient(to bottom, rgba(0,0,0,0.3), rgba(0,0,0,0.7))"
  },
  hover: { 
    opacity: 0.9,
    background: "linear-gradient(to bottom, rgba(0,0,0,0.4), rgba(0,0,0,0.8))"
  }
};

const contentVariants = {
  initial: { y: 0 },
  hover: { y: -10 }
};

const buttonVariants = {
  initial: { scale: 1 },
  hover: { scale: 1.05 }
};

export function CategorySection() {
  return (
    <section className="py-16 container-custom overflow-hidden">
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-bold mb-3 animate-fade-in">
          Shop by Category
        </h2>
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
          <motion.div 
            key={category.name} 
            variants={itemVariants} 
            whileHover="hover"
            className="h-full"
          >
            <HoverCard>
              <HoverCardTrigger asChild>
                <Link to={category.link} className="block h-full">
                  <Card className="overflow-hidden hover:shadow-lg transition-all duration-300 h-full border-border/40">
                    <CardContent className="p-0">
                      <div className="aspect-video relative group overflow-hidden">
                        <img
                          src={category.image}
                          alt={category.name}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                        <motion.div 
                          className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center"
                          initial="initial"
                          whileHover="hover"
                          variants={overlayVariants}
                        >
                          <motion.div variants={contentVariants}>
                            <div className="inline-flex items-center justify-center p-2 mb-3 rounded-full bg-white/20">
                              <category.icon className="h-6 w-6 text-white" />
                            </div>
                            <h3 className="text-white text-2xl font-bold mb-2">{category.name}</h3>
                            <p className="text-white/80 text-sm mb-4 max-w-xs">{category.description}</p>
                            <motion.div 
                              className="flex items-center justify-center text-white text-sm font-medium px-4 py-1.5 rounded-full bg-white/20 backdrop-blur-sm hover:bg-white/30 transition-colors"
                              variants={buttonVariants}
                            >
                              Browse <ChevronRight className="h-4 w-4 ml-1" />
                            </motion.div>
                          </motion.div>
                        </motion.div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              </HoverCardTrigger>
              <HoverCardContent className="w-80 p-0 shadow-lg">
                <div className="p-4 bg-gradient-to-br from-primary/10 to-background">
                  <div className="flex items-center gap-2 mb-2">
                    <category.icon className="h-5 w-5 text-primary" />
                    <h4 className="font-semibold text-lg">{category.name}</h4>
                  </div>
                  <p className="text-muted-foreground text-sm mb-3">{category.description}</p>
                  <div className="space-y-1">
                    <p className="text-xs font-medium text-foreground/70">Popular items:</p>
                    <ul className="text-sm space-y-1">
                      {category.items.map((item, i) => (
                        <li key={i} className="flex items-center gap-1.5">
                          <span className="h-1.5 w-1.5 rounded-full bg-primary/70"></span>
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </HoverCardContent>
            </HoverCard>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}
