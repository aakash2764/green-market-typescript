
import { Navbar } from "./Navbar";
import { Footer } from "./Footer";
import { Toaster } from "@/components/ui/toaster";
import { useEffect } from "react";
import { useAuth } from "@/context/AuthContext";

export function Layout({ children }: { children: React.ReactNode }) {
  // Check authentication status using our auth context
  const { user } = useAuth();
  
  // Add smooth scroll behavior and improved animations
  useEffect(() => {
    // Add smooth scroll behavior
    document.documentElement.style.scrollBehavior = 'smooth';
    
    // Add fade-in animation to main content
    const main = document.querySelector('main');
    if (main) {
      main.classList.add('animate-fade-in');
    }
    
    // Add intersection observer for revealing elements on scroll
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animate-fade-in');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }
    );
    
    // Observe all section elements
    document.querySelectorAll('section').forEach((section) => {
      observer.observe(section);
    });
    
    return () => {
      observer.disconnect();
      document.documentElement.style.scrollBehavior = '';
    };
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Navbar isLoggedIn={!!user} />
      <main className="flex-grow">{children}</main>
      <Footer />
      <Toaster />
    </div>
  );
}
