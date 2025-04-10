
import { HeroSection } from "@/components/homepage/HeroSection";
import { CategorySection } from "@/components/homepage/CategorySection";
import { FeaturedProducts } from "@/components/products/FeaturedProducts";
import { TestimonialSection } from "@/components/homepage/TestimonialSection";

export default function Home() {
  return (
    <div>
      <HeroSection />
      <FeaturedProducts />
      <CategorySection />
      <TestimonialSection />
    </div>
  );
}
