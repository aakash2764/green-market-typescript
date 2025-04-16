
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ShoppingCart } from "lucide-react";
import { motion } from "framer-motion";
import { itemVariants, buttonVariants } from "@/lib/animations";

export function EmptyCartView() {
  return (
    <motion.div
      variants={itemVariants}
      className="text-center py-12"
    >
      <div className="max-w-md mx-auto">
        <ShoppingCart className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
        <h2 className="text-2xl font-semibold mb-2">Your cart is empty</h2>
        <p className="text-muted-foreground mb-6">
          Looks like you haven't added any products to your cart yet.
        </p>
        <motion.div
          whileHover="hover"
          whileTap="tap"
          variants={buttonVariants}
        >
          <Button asChild>
            <Link to="/products">Browse Products</Link>
          </Button>
        </motion.div>
      </div>
    </motion.div>
  );
}
