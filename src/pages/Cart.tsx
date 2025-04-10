
import { useState } from "react";
import { Link } from "react-router-dom";
import { useCart } from "@/context/CartContext";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { 
  Card, 
  CardContent 
} from "@/components/ui/card";
import { 
  Trash2, 
  ShoppingBag, 
  Plus, 
  Minus,
  ChevronRight,
  CreditCard
} from "lucide-react";
import { products } from "@/data/products"; // Added missing import

export default function Cart() {
  const { cartItems, removeFromCart, updateQuantity, clearCart, cartTotal } = useCart();
  const [isProcessing, setIsProcessing] = useState(false);
  
  const handleCheckout = () => {
    setIsProcessing(true);
    // This would connect to a backend in a real app
    setTimeout(() => {
      setIsProcessing(false);
      clearCart();
      // Navigate to order confirmation in a real app
    }, 2000);
  };
  
  if (cartItems.length === 0) {
    return (
      <div className="container-custom py-24 flex flex-col items-center text-center">
        <ShoppingBag className="h-16 w-16 text-muted-foreground mb-4" />
        <h1 className="text-2xl font-bold mb-2">Your cart is empty</h1>
        <p className="text-muted-foreground mb-8">
          Looks like you haven't added any products to your cart yet.
        </p>
        <Button asChild>
          <Link to="/products">Continue Shopping</Link>
        </Button>
      </div>
    );
  }
  
  return (
    <div className="container-custom py-12">
      <h1 className="text-3xl font-bold mb-8">Your Cart</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="space-y-4">
            {cartItems.map((item) => (
              <Card key={item.id} className="overflow-hidden">
                <CardContent className="p-0">
                  <div className="flex flex-col sm:flex-row">
                    <div className="w-full sm:w-32 h-32 bg-muted">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="p-4 flex-grow flex flex-col">
                      <div className="flex justify-between">
                        <Link to={`/products/${item.id}`} className="font-medium hover:text-primary transition-colors">
                          {item.name}
                        </Link>
                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="text-muted-foreground hover:text-destructive transition-colors"
                        >
                          <Trash2 className="h-5 w-5" />
                          <span className="sr-only">Remove</span>
                        </button>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">₹{item.price.toFixed(2)}</p>
                      <div className="flex justify-between items-center mt-auto">
                        <div className="flex items-center border border-border rounded-md">
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            disabled={item.quantity <= 1}
                            className="px-2 py-1 text-muted-foreground hover:text-foreground disabled:opacity-50"
                          >
                            <Minus className="h-4 w-4" />
                            <span className="sr-only">Decrease</span>
                          </button>
                          <span className="w-8 text-center">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            disabled={item.quantity >= getItemStock(item.id)}
                            className="px-2 py-1 text-muted-foreground hover:text-foreground disabled:opacity-50"
                          >
                            <Plus className="h-4 w-4" />
                            <span className="sr-only">Increase</span>
                          </button>
                        </div>
                        <p className="font-medium">₹{(item.price * item.quantity).toFixed(2)}</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          
          <div className="flex justify-between mt-6">
            <Button 
              variant="outline" 
              asChild
            >
              <Link to="/products">Continue Shopping</Link>
            </Button>
            <Button 
              variant="outline" 
              onClick={clearCart}
            >
              Clear Cart
            </Button>
          </div>
        </div>
        
        <div>
          <Card>
            <CardContent className="pt-6">
              <h2 className="text-lg font-bold mb-4">Order Summary</h2>
              
              <div className="space-y-2 mb-4">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>₹{cartTotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Shipping</span>
                  <span>Free</span>
                </div>
              </div>
              
              <Separator className="my-4" />
              
              <div className="flex justify-between font-bold mb-6">
                <span>Total</span>
                <span>₹{cartTotal.toFixed(2)}</span>
              </div>
              
              <Button 
                onClick={handleCheckout}
                disabled={isProcessing}
                className="w-full"
              >
                {isProcessing ? (
                  "Processing..."
                ) : (
                  <>
                    <CreditCard className="mr-2 h-4 w-4" />
                    Checkout
                  </>
                )}
              </Button>
              
              <p className="text-xs text-muted-foreground text-center mt-4">
                Secure payment processing. All information is encrypted.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
  
  // Helper function to get current stock for an item
  function getItemStock(productId: number) {
    const product = cartItems.find(item => item.id === productId);
    if (!product) return 0;
    
    const currentProduct = products.find(p => p.id === productId);
    return currentProduct?.stock || 0;
  }
}
