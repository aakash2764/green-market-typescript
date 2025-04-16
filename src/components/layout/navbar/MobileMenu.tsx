
import { Link } from "react-router-dom";
import { LogOut, User, ShoppingCart, Package } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Sheet, SheetContent } from "@/components/ui/sheet";

interface MobileMenuProps {
  isMenuOpen: boolean;
  isLoggedIn: boolean;
  userName: string;
  userEmail: string;
  onClose: () => void;
  onLogout: () => Promise<void>;
}

export function MobileMenu({
  isMenuOpen,
  isLoggedIn,
  userName,
  userEmail,
  onClose,
  onLogout,
}: MobileMenuProps) {
  const handleLogout = async () => {
    await onLogout();
    onClose();
  };

  return (
    <Sheet open={isMenuOpen} onOpenChange={onClose}>
      <SheetContent className="w-full sm:max-w-sm">
        <div className="flex flex-col h-full">
          <div className="p-4">
            {isLoggedIn ? (
              <div className="flex items-center space-x-3">
                <div className="relative w-10 h-10 overflow-hidden rounded-full bg-primary/10 flex items-center justify-center">
                  <User className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <div className="font-medium">{userName}</div>
                  <div className="text-xs text-muted-foreground">{userEmail}</div>
                </div>
              </div>
            ) : (
              <Link to="/login" onClick={onClose}>
                <Button className="w-full">Login / Register</Button>
              </Link>
            )}
          </div>

          <Separator />

          <nav className="flex-1 p-4">
            <ul className="space-y-2">
              <li>
                <Link
                  to="/"
                  className="block py-2 font-medium hover:text-primary"
                  onClick={onClose}
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  to="/products"
                  className="block py-2 font-medium hover:text-primary"
                  onClick={onClose}
                >
                  Products
                </Link>
              </li>
              <li>
                <Link
                  to="/about"
                  className="block py-2 font-medium hover:text-primary"
                  onClick={onClose}
                >
                  About
                </Link>
              </li>
              <li>
                <Link
                  to="/contact"
                  className="block py-2 font-medium hover:text-primary"
                  onClick={onClose}
                >
                  Contact
                </Link>
              </li>
              <li>
                <Link
                  to="/cart"
                  className="flex items-center py-2 font-medium hover:text-primary"
                  onClick={onClose}
                >
                  <ShoppingCart className="mr-2 h-4 w-4" />
                  Cart
                </Link>
              </li>
              {isLoggedIn && (
                <li>
                  <Link
                    to="/orders"
                    className="flex items-center py-2 font-medium hover:text-primary"
                    onClick={onClose}
                  >
                    <Package className="mr-2 h-4 w-4" />
                    My Orders
                  </Link>
                </li>
              )}
            </ul>
          </nav>

          {isLoggedIn && (
            <>
              <Separator />
              <div className="p-4">
                <Button
                  variant="destructive"
                  className="w-full"
                  onClick={handleLogout}
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Logout
                </Button>
              </div>
            </>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
