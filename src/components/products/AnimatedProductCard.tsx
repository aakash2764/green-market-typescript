
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { cardVariants } from "@/lib/animations";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ShoppingCart } from "lucide-react";
import { useCart } from "@/context/CartContext";

interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
  image_url: string;
  category: string;
  stock: number;
}

interface ProductCardProps {
  product: Product;
}

export function AnimatedProductCard({ product }: ProductCardProps) {
  const { addToCart } = useCart();
  const isOutOfStock = product.stock === 0;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!isOutOfStock) {
      addToCart({ ...product, quantity: 1 });
    }
  };

  return (
    <motion.div
      className="product-card overflow-hidden h-full flex flex-col"
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      whileHover="hover"
      whileTap="tap"
    >
      <Link to={`/products/${product.id}`} className="flex flex-col h-full">
        <div className="relative aspect-square bg-muted overflow-hidden">
          <motion.img
            src={product.image_url}
            alt={product.name}
            className="w-full h-full object-cover transition-transform"
            whileHover={{ scale: 1.05 }}
          />
          {isOutOfStock && (
            <Badge
              variant="destructive"
              className="absolute top-2 right-2"
            >
              Out of Stock
            </Badge>
          )}
          {product.stock > 0 && product.stock <= 5 && (
            <Badge
              variant="warning"
              className="absolute top-2 right-2 bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400"
            >
              Low Stock
            </Badge>
          )}
        </div>
        
        <div className="p-4 flex-1 flex flex-col">
          <h3 className="font-medium mb-1 line-clamp-2">{product.name}</h3>
          <p className="text-sm text-muted-foreground mb-2 line-clamp-2">
            {product.description}
          </p>
          <div className="mt-auto flex items-center justify-between">
            <span className="font-bold">₹{Math.ceil(product.price)}</span>
            <motion.div whileHover="hover" whileTap="tap" variants={cardVariants}>
              <Button
                size="sm"
                disabled={isOutOfStock}
                onClick={handleAddToCart}
                variant={isOutOfStock ? "outline" : "default"}
              >
                <ShoppingCart className="h-4 w-4 mr-1" />
                {isOutOfStock ? "Sold Out" : "Add"}
              </Button>
            </motion.div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
