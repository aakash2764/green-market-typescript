
import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { products } from "@/data/products";
import { useCart } from "@/context/CartContext";
import { Button } from "@/components/ui/button";
import { 
  Card, 
  CardContent 
} from "@/components/ui/card";
import { 
  ShoppingCart, 
  ArrowLeft, 
  Minus, 
  Plus,
  AlertCircle,
  CheckCircle,
  XCircle
} from "lucide-react";
import { ProductCard } from "@/components/products/ProductCard";
import { Badge } from "@/components/ui/badge";

export default function ProductDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);
  
  const product = products.find(p => p.id === parseInt(id || "0"));
  
  if (!product) {
    return (
      <div className="container-custom py-24 text-center">
        <h1 className="text-2xl font-bold mb-4">Product Not Found</h1>
        <p className="mb-8">Sorry, we couldn't find the product you're looking for.</p>
        <Button onClick={() => navigate("/products")}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Products
        </Button>
      </div>
    );
  }
  
  // Find related products (same category, excluding current product)
  const relatedProducts = products
    .filter(p => p.category === product.category && p.id !== product.id)
    .slice(0, 4);
  
  // Stock status indicators
  const isOutOfStock = product.stock === 0;
  const isLowStock = product.stock > 0 && product.stock <= 5;
  
  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };
  
  const increaseQuantity = () => {
    if (!isOutOfStock && quantity < product.stock) {
      setQuantity(quantity + 1);
    }
  };
  
  const handleAddToCart = () => {
    if (!isOutOfStock) {
      for (let i = 0; i < quantity; i++) {
        addToCart(product);
      }
    }
  };
  
  return (
    <div className="container-custom py-12">
      <button 
        onClick={() => navigate(-1)} 
        className="flex items-center text-muted-foreground hover:text-foreground mb-8 transition-colors"
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back
      </button>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        <div className="relative bg-muted rounded-lg overflow-hidden">
          <img 
            src={product.image} 
            alt={product.name} 
            className={`w-full h-auto object-cover ${isOutOfStock ? 'opacity-70' : ''}`}
          />
          {isOutOfStock && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/20">
              <Badge 
                variant="destructive" 
                className="text-lg py-2 px-4 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
              >
                Out of Stock
              </Badge>
            </div>
          )}
        </div>
        
        <div>
          <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
          <p className="text-2xl font-bold mb-4">${product.price.toFixed(2)}</p>
          
          {/* Stock Status */}
          <div className="mb-4">
            {isOutOfStock ? (
              <div className="flex items-center text-red-500">
                <XCircle className="h-5 w-5 mr-2" />
                <span>Out of Stock</span>
              </div>
            ) : isLowStock ? (
              <div className="flex items-center text-amber-600">
                <AlertCircle className="h-5 w-5 mr-2" />
                <span>Low Stock - Only {product.stock} left</span>
              </div>
            ) : (
              <div className="flex items-center text-green-600">
                <CheckCircle className="h-5 w-5 mr-2" />
                <span>In Stock</span>
              </div>
            )}
          </div>
          
          <div className="border-t border-b border-border py-6 my-6">
            <p className="text-muted-foreground mb-4">
              {product.description}
            </p>
            <p className="mb-2">
              <span className="font-medium">Category:</span>{" "}
              {product.category.charAt(0).toUpperCase() + product.category.slice(1)}
            </p>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center">
              <span className="mr-4">Quantity:</span>
              <div className="flex items-center border border-border rounded-md">
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={decreaseQuantity}
                  disabled={quantity <= 1 || isOutOfStock}
                  className="rounded-r-none"
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <span className="w-12 text-center">{quantity}</span>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={increaseQuantity}
                  disabled={isOutOfStock || quantity >= product.stock}
                  className="rounded-l-none"
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              {!isOutOfStock && (
                <span className="ml-4 text-sm text-muted-foreground">
                  Max: {product.stock}
                </span>
              )}
            </div>
            
            <Button 
              onClick={handleAddToCart} 
              size="lg" 
              className="w-full"
              disabled={isOutOfStock}
              variant={isOutOfStock ? "outline" : "default"}
            >
              <ShoppingCart className="mr-2 h-5 w-5" />
              {isOutOfStock ? 'Out of Stock' : 'Add to Cart'}
            </Button>
          </div>
        </div>
      </div>
      
      {relatedProducts.length > 0 && (
        <div className="mt-20">
          <h2 className="text-2xl font-bold mb-6">Related Products</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {relatedProducts.map(relatedProduct => (
              <ProductCard key={relatedProduct.id} product={relatedProduct} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
