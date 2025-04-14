
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";

export function DesktopNavigation() {
  const location = useLocation();
  
  const isActive = (path: string) => {
    return location.pathname === path;
  };
  
  return (
    <nav className="hidden md:flex items-center space-x-1 lg:space-x-2">
      <NavLink to="/" isActive={isActive("/")}>
        Home
      </NavLink>
      <NavLink to="/products" isActive={isActive("/products")}>
        Products
      </NavLink>
      <NavLink to="/about" isActive={isActive("/about")}>
        About
      </NavLink>
      <NavLink to="/contact" isActive={isActive("/contact")}>
        Contact
      </NavLink>
    </nav>
  );
}

interface NavLinkProps {
  to: string;
  isActive: boolean;
  children: React.ReactNode;
}

function NavLink({ to, isActive, children }: NavLinkProps) {
  return (
    <Link 
      to={to} 
      className={cn(
        "px-3 py-2 rounded-md text-sm font-medium transition-colors",
        isActive 
          ? "text-primary bg-primary/10" 
          : "text-foreground hover:text-primary hover:bg-primary/5"
      )}
    >
      {children}
    </Link>
  );
}
