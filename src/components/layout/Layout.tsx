
import { Navbar } from "./Navbar";
import { Footer } from "./Footer";
import { Toaster } from "@/components/ui/toaster";
import { useEffect } from "react";

export function Layout({ children }: { children: React.ReactNode }) {
  // Add smooth scroll behavior
  useEffect(() => {
    // Add fade-in animation to main content
    const main = document.querySelector('main');
    if (main) {
      main.classList.add('animate-fade-in');
    }
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Navbar />
      <main className="flex-grow">{children}</main>
      <Footer />
      <Toaster />
    </div>
  );
}
