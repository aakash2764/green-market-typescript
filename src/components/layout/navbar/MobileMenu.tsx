
import { Link } from "react-router-dom";
import { X, User, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Logo } from "./Logo";

interface MobileMenuProps {
  isMenuOpen: boolean;
  isLoggedIn: boolean;
  userName: string;
  userEmail?: string;
  onClose: () => void;
  onLogout: () => void;
}

export function MobileMenu({ 
  isMenuOpen, 
  isLoggedIn, 
  userName, 
  userEmail, 
  onClose, 
  onLogout 
}: MobileMenuProps) {
  return (
    <>
      <div
        className={cn(
          "fixed inset-0 bg-background/95 backdrop-blur-sm border-r border-border p-4 z-50 w-64 transition-transform duration-300 md:hidden",
          isMenuOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex justify-between items-center mb-6">
          <Logo />
          <Button variant="ghost" size="icon" onClick={onClose}>
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
            onClick={onClose}
            className="text-foreground hover:text-primary py-2 transition-colors"
          >
            Home
          </Link>
          <Link
            to="/products"
            onClick={onClose}
            className="text-foreground hover:text-primary py-2 transition-colors"
          >
            Products
          </Link>
          <Link
            to="/about"
            onClick={onClose}
            className="text-foreground hover:text-primary py-2 transition-colors"
          >
            About
          </Link>
          <Link
            to="/contact"
            onClick={onClose}
            className="text-foreground hover:text-primary py-2 transition-colors"
          >
            Contact
          </Link>
          
          {isLoggedIn ? (
            <>
              <div className="pt-2 border-t border-border">
                <Link
                  to="/profile"
                  onClick={onClose}
                  className="text-foreground hover:text-primary py-2 transition-colors block"
                >
                  Profile
                </Link>
                <Link
                  to="/orders"
                  onClick={onClose}
                  className="text-foreground hover:text-primary py-2 transition-colors block"
                >
                  My Orders
                </Link>
                <Link
                  to="/settings"
                  onClick={onClose}
                  className="text-foreground hover:text-primary py-2 transition-colors block"
                >
                  Settings
                </Link>
                <button
                  onClick={() => {
                    onLogout();
                    onClose();
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
              onClick={onClose}
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
          onClick={onClose}
        />
      )}
    </>
  );
}
