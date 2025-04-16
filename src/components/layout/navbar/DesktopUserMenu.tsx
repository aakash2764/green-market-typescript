
import { Link } from "react-router-dom";
import { User, LogOut, Package } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface DesktopUserMenuProps {
  isLoggedIn: boolean;
  onLogout: () => Promise<void>;
}

export function DesktopUserMenu({ isLoggedIn, onLogout }: DesktopUserMenuProps) {
  const { user } = useAuth();
  const userEmail = user?.email;
  const userName = user?.user_metadata?.full_name || "User";

  if (isLoggedIn) {
    return (
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
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={onLogout} className="text-destructive focus:text-destructive">
            <LogOut className="mr-2 h-4 w-4" />
            <span>Log out</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  return (
    <Link to="/login">
      <Button variant="ghost" size="icon" className="rounded-full hover:bg-primary/10">
        <User className="h-5 w-5" />
        <span className="sr-only">Profile</span>
      </Button>
    </Link>
  );
}
