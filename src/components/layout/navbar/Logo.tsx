
import { Link } from "react-router-dom";

export function Logo() {
  return (
    <Link to="/" className="flex items-center space-x-2">
      <div className="rounded-full bg-primary w-8 h-8 flex items-center justify-center">
        <span className="text-primary-foreground font-bold">GM</span>
      </div>
      <span className="font-bold text-xl hidden sm:inline-block">Green Market</span>
    </Link>
  );
}
