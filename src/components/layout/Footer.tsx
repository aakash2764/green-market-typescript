
import { Link } from "react-router-dom";
import { Facebook, Instagram, Twitter } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-muted text-muted-foreground py-12">
      <div className="container-custom">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <Link to="/" className="flex items-center space-x-2">
              <div className="rounded-full bg-primary w-8 h-8 flex items-center justify-center">
                <span className="text-primary-foreground font-bold">GM</span>
              </div>
              <span className="font-bold text-xl">Green Market</span>
            </Link>
            <p className="text-sm">
              Your one-stop shop for eco-friendly and sustainable products that help you reduce your environmental impact.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="hover:text-primary transition-colors">
                <Facebook size={20} />
                <span className="sr-only">Facebook</span>
              </a>
              <a href="#" className="hover:text-primary transition-colors">
                <Instagram size={20} />
                <span className="sr-only">Instagram</span>
              </a>
              <a href="#" className="hover:text-primary transition-colors">
                <Twitter size={20} />
                <span className="sr-only">Twitter</span>
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="font-medium text-lg mb-4">Shop</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/products" className="hover:text-primary transition-colors">All Products</Link>
              </li>
              <li>
                <Link to="/products?category=bathroom" className="hover:text-primary transition-colors">Bathroom</Link>
              </li>
              <li>
                <Link to="/products?category=kitchen" className="hover:text-primary transition-colors">Kitchen</Link>
              </li>
              <li>
                <Link to="/products?category=bags" className="hover:text-primary transition-colors">Bags</Link>
              </li>
              <li>
                <Link to="/products?category=accessories" className="hover:text-primary transition-colors">Accessories</Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-medium text-lg mb-4">Company</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/about" className="hover:text-primary transition-colors">About Us</Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-primary transition-colors">Contact</Link>
              </li>
              <li>
                <Link to="/terms" className="hover:text-primary transition-colors">Terms of Service</Link>
              </li>
              <li>
                <Link to="/privacy" className="hover:text-primary transition-colors">Privacy Policy</Link>
              </li>
              <li>
                <Link to="/shipping" className="hover:text-primary transition-colors">Shipping & Returns</Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-medium text-lg mb-4">Newsletter</h3>
            <p className="text-sm mb-4">
              Subscribe to get special offers, eco tips, and updates on new products.
            </p>
            <form className="space-y-2">
              <input
                type="email"
                placeholder="Your email address"
                className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-1 focus:ring-primary"
                required
              />
              <button
                type="submit"
                className="btn-primary w-full"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>
        
        <div className="border-t border-border mt-8 pt-8 text-sm text-center">
          <p>&copy; {new Date().getFullYear()} Green Market. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
