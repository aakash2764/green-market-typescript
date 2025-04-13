
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

export function HeroSection() {
  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1610701596061-2ecf227e85b2?w=1800&auto=format&fit=crop"
          alt="Eco-friendly products"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 gradient-hero backdrop-blur-sm" />
      </div>
      
      <div className="container-custom relative z-10 py-24 md:py-36 lg:py-40">
        <div className="max-w-xl animate-fade-in">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 drop-shadow-lg">
            Sustainable Products for a Better Planet
          </h1>
          <p className="text-white/90 text-lg md:text-xl mb-8 drop-shadow">
            Discover our collection of eco-friendly products that help reduce waste and
            protect our environment while enhancing your daily life.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Button asChild size="lg" className="font-medium gradient-primary border-0 hover-lift">
              <Link to="/products">Shop Now</Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="bg-white/10 hover:bg-white/20 border-white/30 text-white hover-lift">
              <Link to="/about">Learn More</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
