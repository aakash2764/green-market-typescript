
import { motion, AnimatePresence } from "framer-motion";
import { Layout } from "./Layout";
import { pageVariants } from "@/lib/animations";
import { useLocation } from "react-router-dom";

export function AnimatedLayout({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  
  return (
    <Layout>
      <AnimatePresence mode="wait">
        <motion.div
          key={location.pathname}
          initial="hidden"
          animate="visible"
          exit="exit"
          variants={pageVariants}
          className="flex-grow"
        >
          {children}
        </motion.div>
      </AnimatePresence>
    </Layout>
  );
}
