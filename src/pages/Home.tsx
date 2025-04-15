
import { HeroSection } from "@/components/homepage/HeroSection";
import { CategorySection } from "@/components/homepage/CategorySection";
import { FeaturedProducts } from "@/components/products/FeaturedProducts";
import { TestimonialSection } from "@/components/homepage/TestimonialSection";
import { motion } from "framer-motion";

export default function Home() {
  return (
    <div>
      <HeroSection />
      
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.7 }}
      >
        <FeaturedProducts />
      </motion.div>
      
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.7 }}
      >
        <CategorySection />
      </motion.div>
      
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.7 }}
      >
        <TestimonialSection />
      </motion.div>
    </div>
  );
}
