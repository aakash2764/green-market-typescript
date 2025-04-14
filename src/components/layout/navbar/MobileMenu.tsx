
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
          "fixed inset-y-0 left-0 bg-background/95 backdrop-blur-sm border-r border-border p-4 z-50 w-72 transition-transform duration-300 ease-in-out md:hidden shadow-lg",
          isMenuOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex justify-between items-center mb-6">
          <Logo />
          <Button variant="ghost" size="icon" onClick={onClose} aria-label="Close menu">
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
                {userEmail && (
                  <span className="text-xs text-muted-foreground truncate max-w-[180px]">{userEmail}</span>
                )}
              </div>
            </div>
          </div>
        )}
        
        <nav className="flex flex-col space-y-1">
          <Link
            to="/"
            onClick={onClose}
            className="text-foreground hover:text-primary hover:bg-primary/5 py-3 px-2 rounded-md transition-colors"
          >
            Home
          </Link>
          <Link
            to="/products"
            onClick={onClose}
            className="text-foreground hover:text-primary hover:bg-primary/5 py-3 px-2 rounded-md transition-colors"
          >
            Products
          </Link>
          <Link
            to="/about"
            onClick={onClose}
            className="text-foreground hover:text-primary hover:bg-primary/5 py-3 px-2 rounded-md transition-colors"
          >
            About
          </Link>
          <Link
            to="/contact"
            onClick={onClose}
            className="text-foreground hover:text-primary hover:bg-primary/5 py-3 px-2 rounded-md transition-colors"
          >
            Contact
          </Link>
          
          {isLoggedIn ? (
            <>
              <div className="pt-4 mt-2 border-t border-border">
                <Link
                  to="/profile"
                  onClick={onClose}
                  className="text-foreground hover:text-primary hover:bg-primary/5 py-3 px-2 rounded-md transition-colors block"
                >
                  Profile
                </Link>
                <Link
                  to="/orders"
                  onClick={onClose}
                  className="text-foreground hover:text-primary hover:bg-primary/5 py-3 px-2 rounded-md transition-colors block"
                >
                  My Orders
                </Link>
                <Link
                  to="/settings"
                  onClick={onClose}
                  className="text-foreground hover:text-primary hover:bg-primary/5 py-3 px-2 rounded-md transition-colors block"
                >
                  Settings
                </Link>
                <button
                  onClick={() => {
                    onLogout();
                    onClose();
                  }}
                  className="text-destructive hover:text-destructive/80 hover:bg-destructive/5 py-3 px-2 rounded-md transition-colors flex items-center w-full mt-2"
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
              className="mt-4 bg-primary hover:bg-primary/90 text-primary-foreground rounded-md py-3 px-4 text-center transition-colors"
            >
              Login / Register
            </Link>
          )}
        </nav>
      </div>
      
      {/* Overlay with improved animation */}
      {isMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden animate-fade-in"
          onClick={onClose}
          aria-hidden="true"
        />
      )}
    </>
  );
}
