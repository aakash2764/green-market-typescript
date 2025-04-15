
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";

export function HeroSection() {
  const [currentSlide, setCurrentSlide] = useState(0);
  
  const heroContent = [
    {
      title: "Sustainable Products for a Better Planet",
      subtitle: "Discover our collection of eco-friendly products that help reduce waste and protect our environment while enhancing your daily life."
    },
    {
      title: "Eco-friendly Solutions for Modern Living",
      subtitle: "Join thousands of conscious consumers making a positive impact through everyday sustainable choices."
    },
    {
      title: "Reduce Your Carbon Footprint Today",
      subtitle: "Browse our curated collection of products designed with the planet in mind, without compromising on quality or style."
    }
  ];

  // Automatic slide cycling
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroContent.length);
    }, 7000);
    
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative overflow-hidden">
      <motion.div 
        className="absolute inset-0 overflow-hidden"
        initial={{ scale: 1 }}
        animate={{ scale: 1.1 }}
        transition={{ duration: 20, repeat: Infinity, repeatType: "reverse", ease: "linear" }}
      >
        <img
          src="https://images.unsplash.com/photo-1610701596061-2ecf227e85b2?w=1800&auto=format&fit=crop"
          alt="Eco-friendly products"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 gradient-hero backdrop-blur-sm" />
      </motion.div>
      
      <div className="container-custom relative z-10 py-24 md:py-36 lg:py-40">
        {heroContent.map((content, index) => (
          <motion.div 
            key={index}
            className="max-w-xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ 
              opacity: currentSlide === index ? 1 : 0,
              y: currentSlide === index ? 0 : 20
            }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            style={{ display: currentSlide === index ? 'block' : 'none' }}
          >
            <motion.h1 
              className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 drop-shadow-lg"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              {content.title}
            </motion.h1>
            
            <motion.p 
              className="text-white/90 text-lg md:text-xl mb-8 drop-shadow"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              {content.subtitle}
            </motion.p>
            
            <motion.div 
              className="flex flex-col sm:flex-row gap-4"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              <motion.div
                whileHover={{ scale: 1.05, y: -5 }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                <Button asChild size="lg" className="font-medium gradient-primary border-0 group">
                  <Link to="/products" className="flex items-center gap-2">
                    Shop Now
                    <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
                  </Link>
                </Button>
              </motion.div>
              
              <motion.div
                whileHover={{ scale: 1.05, y: -5 }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                <Button asChild variant="outline" size="lg" className="bg-white/10 hover:bg-white/20 border-white/30 text-white group">
                  <Link to="/about">
                    Learn More
                  </Link>
                </Button>
              </motion.div>
            </motion.div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
