
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ThemeToggle } from "../ThemeToggle";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { 
  ShoppingCart, 
  Menu, 
  X, 
  User,
  LogOut
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useToast } from "@/components/ui/use-toast";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface NavbarProps {
  isLoggedIn?: boolean;
}

export function Navbar({ isLoggedIn = false }: NavbarProps) {
  const { cartCount } = useCart();
  const { user, signOut } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  
  const handleLogout = async () => {
    await signOut();
    navigate("/");
  };
  
  // Get user data
  const userEmail = user?.email;
  const userName = user?.user_metadata?.full_name || "User";

  return (
    <header className="bg-background/80 backdrop-blur-sm border-b border-border sticky top-0 z-40">
      <div className="container py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-2">
            <div className="rounded-full bg-primary w-8 h-8 flex items-center justify-center">
              <span className="text-primary-foreground font-bold">GM</span>
            </div>
            <span className="font-bold text-xl hidden sm:inline-block">Green Market</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            <Link to="/" className="text-foreground hover:text-primary transition-colors">
              Home
            </Link>
            <Link to="/products" className="text-foreground hover:text-primary transition-colors">
              Products
            </Link>
            <Link to="/about" className="text-foreground hover:text-primary transition-colors">
              About
            </Link>
            <Link to="/contact" className="text-foreground hover:text-primary transition-colors">
              Contact
            </Link>
          </nav>

          <div className="flex items-center space-x-3">
            <ThemeToggle />
            
            {isLoggedIn ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="rounded-full hover:bg-primary/10">
                    <div className="relative w-9 h-9 overflow-hidden rounded-full bg-primary/10 flex items-center justify-center">
                      <User className="h-5 w-5 text-primary" />
                    </div>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>
                    <div className="flex flex-col">
                      <span>My Account</span>
                      <span className="text-xs text-muted-foreground truncate">{userEmail}</span>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link to="/profile">Profile</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/orders">My Orders</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/settings">Settings</Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout} className="text-destructive focus:text-destructive">
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Link to="/login">
                <Button variant="ghost" size="icon" className="rounded-full hover:bg-primary/10">
                  <User className="h-5 w-5" />
                  <span className="sr-only">Profile</span>
                </Button>
              </Link>
            )}
            
            <Link to="/cart" className="relative">
              <Button variant="ghost" size="icon" className="rounded-full hover:bg-primary/10">
                <ShoppingCart className="h-5 w-5" />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground rounded-full text-xs w-5 h-5 flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
                <span className="sr-only">Cart</span>
              </Button>
            </Link>
            
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={toggleMenu}
            >
              {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              <span className="sr-only">Menu</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      <div
        className={cn(
          "fixed inset-0 bg-background/95 backdrop-blur-sm border-r border-border p-4 z-50 w-64 transition-transform duration-300 md:hidden",
          isMenuOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex justify-between items-center mb-6">
          <Link to="/" onClick={() => setIsMenuOpen(false)} className="flex items-center space-x-2">
            <div className="rounded-full bg-primary w-8 h-8 flex items-center justify-center">
              <span className="text-primary-foreground font-bold">GM</span>
            </div>
            <span className="font-bold text-xl">Green Market</span>
          </Link>
          <Button variant="ghost" size="icon" onClick={toggleMenu}>
            <X className="h-5 w-5" />
          </Button>
        </div>
        
        {isLoggedIn && (
          <div className="mb-6 pb-4 border-b border-border">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                <User className="h-5 w-5 text-primary" />
              </div>
              <div className="flex flex-col">
                <span className="font-medium">{userName}</span>
                <span className="text-xs text-muted-foreground truncate">{userEmail}</span>
              </div>
            </div>
          </div>
        )}
        
        <nav className="flex flex-col space-y-4">
          <Link
            to="/"
            onClick={() => setIsMenuOpen(false)}
            className="text-foreground hover:text-primary py-2 transition-colors"
          >
            Home
          </Link>
          <Link
            to="/products"
            onClick={() => setIsMenuOpen(false)}
            className="text-foreground hover:text-primary py-2 transition-colors"
          >
            Products
          </Link>
          <Link
            to="/about"
            onClick={() => setIsMenuOpen(false)}
            className="text-foreground hover:text-primary py-2 transition-colors"
          >
            About
          </Link>
          <Link
            to="/contact"
            onClick={() => setIsMenuOpen(false)}
            className="text-foreground hover:text-primary py-2 transition-colors"
          >
            Contact
          </Link>
          
          {isLoggedIn ? (
            <>
              <div className="pt-2 border-t border-border">
                <Link
                  to="/profile"
                  onClick={() => setIsMenuOpen(false)}
                  className="text-foreground hover:text-primary py-2 transition-colors block"
                >
                  Profile
                </Link>
                <Link
                  to="/orders"
                  onClick={() => setIsMenuOpen(false)}
                  className="text-foreground hover:text-primary py-2 transition-colors block"
                >
                  My Orders
                </Link>
                <Link
                  to="/settings"
                  onClick={() => setIsMenuOpen(false)}
                  className="text-foreground hover:text-primary py-2 transition-colors block"
                >
                  Settings
                </Link>
                <button
                  onClick={() => {
                    handleLogout();
                    setIsMenuOpen(false);
                  }}
                  className="text-destructive hover:text-destructive/80 py-2 transition-colors flex items-center w-full mt-2"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </button>
              </div>
            </>
          ) : (
            <Link
              to="/login"
              onClick={() => setIsMenuOpen(false)}
              className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-md py-2 px-4 text-center transition-colors mt-4"
            >
              Login / Register
            </Link>
          )}
        </nav>
      </div>
      
      {/* Overlay */}
      {isMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden" 
          onClick={() => setIsMenuOpen(false)}
        />
      )}
    </header>
  );
}
