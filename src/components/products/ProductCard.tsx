
import { Link } from "react-router-dom";
import { useCart } from "@/context/CartContext";
import { Product } from "@/data/products";
import { Button } from "@/components/ui/button";
import { ShoppingCart, AlertCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const { addToCart } = useCart();
  
  // Stock status indicators
  const isOutOfStock = product.stock === 0;
  const isLowStock = product.stock > 0 && product.stock <= 5;
  
  return (
    <div className="product-card h-full flex flex-col">
      <Link to={`/products/${product.id}`} className="block relative overflow-hidden group">
        <div className="aspect-square overflow-hidden bg-muted">
          <img 
            src={product.image} 
            alt={product.name}
            className={`object-cover w-full h-full transition-transform duration-300 group-hover:scale-105 ${isOutOfStock ? 'opacity-70' : ''}`}
          />
        </div>
        {product.featured && (
          <div className="absolute top-2 left-2 bg-secondary text-secondary-foreground text-xs px-2 py-1 rounded-full">
            Featured
          </div>
        )}
        
        {isOutOfStock && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/20">
            <Badge variant="destructive" className="text-base py-1 px-3">Out of Stock</Badge>
          </div>
        )}
      </Link>
      <div className="p-4 flex flex-col flex-grow">
        <div className="flex-grow">
          <Link to={`/products/${product.id}`}>
            <h3 className="font-medium hover:text-primary transition-colors">{product.name}</h3>
          </Link>
          <p className="text-muted-foreground text-sm mb-2 line-clamp-2">{product.description}</p>
          
          {isLowStock && !isOutOfStock && (
            <div className="flex items-center text-amber-600 text-xs my-1">
              <AlertCircle className="h-3 w-3 mr-1" />
              <span>Only {product.stock} left</span>
            </div>
          )}
        </div>
        <div className="flex items-center justify-between mt-3">
          <span className="font-bold">₹{product.price.toFixed(2)}</span>
          <Button 
            size="sm" 
            onClick={() => addToCart(product)}
            className="rounded-full"
            disabled={isOutOfStock}
            variant={isOutOfStock ? "outline" : "default"}
          >
            <ShoppingCart className="h-4 w-4 mr-2" />
            {isOutOfStock ? 'Sold Out' : 'Add'}
          </Button>
        </div>
      </div>
    </div>
  );
}
