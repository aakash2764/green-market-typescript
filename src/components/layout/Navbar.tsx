
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Menu } from "lucide-react";
import { ThemeToggle } from "../ThemeToggle";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Logo } from "./navbar/Logo";
import { DesktopNavigation } from "./navbar/DesktopNavigation";
import { DesktopUserMenu } from "./navbar/DesktopUserMenu";
import { CartButton } from "./navbar/CartButton";
import { MobileMenu } from "./navbar/MobileMenu";
import { useIsMobile } from "@/hooks/use-mobile";

interface NavbarProps {
  isLoggedIn?: boolean;
}

export function Navbar({ isLoggedIn = false }: NavbarProps) {
  const { user, signOut } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();
  const isMobile = useIsMobile();

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  
  const handleLogout = async () => {
    await signOut();
    navigate("/");
  };
  
  // Get user data
  const userEmail = user?.email;
  const userName = user?.user_metadata?.full_name || "User";

  return (
    <header className="bg-background/80 backdrop-blur-sm border-b border-border sticky top-0 z-40 transition-all duration-200">
      <div className="container py-3 md:py-4">
        <div className="flex items-center justify-between">
          <Logo />

          {/* Desktop Navigation */}
          <DesktopNavigation />

          <div className="flex items-center gap-2 md:gap-3">
            <ThemeToggle />
            
            <DesktopUserMenu isLoggedIn={isLoggedIn} onLogout={handleLogout} />
            
            <CartButton />
            
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={toggleMenu}
              aria-label="Toggle menu"
            >
              <Menu className="h-5 w-5" />
              <span className="sr-only">Menu</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      <MobileMenu 
        isMenuOpen={isMenuOpen}
        isLoggedIn={isLoggedIn}
        userName={userName}
        userEmail={userEmail}
        onClose={() => setIsMenuOpen(false)}
        onLogout={handleLogout}
      />
    </header>
  );
}
