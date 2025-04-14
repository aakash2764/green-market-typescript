
import { Link } from "react-router-dom";
import { ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/context/CartContext";
import { cn } from "@/lib/utils";
import { 
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";

export function CartButton() {
  const { cartCount, cartItems, cartTotal, removeFromCart } = useCart();
  
  return (
    <HoverCard openDelay={100} closeDelay={200}>
      <HoverCardTrigger asChild>
        <Link to="/cart" className="relative">
          <Button 
            variant="ghost" 
            size="icon" 
            className="rounded-full hover:bg-primary/10 relative"
            aria-label={`Cart with ${cartCount} items`}
          >
            <ShoppingCart className="h-5 w-5" />
            {cartCount > 0 && (
              <span className={cn(
                "absolute -top-1 -right-1 bg-primary text-primary-foreground rounded-full flex items-center justify-center transition-all",
                cartCount < 10 ? "w-5 h-5 text-xs" : "w-6 h-6 text-[10px]"
              )}>
                {cartCount > 99 ? "99+" : cartCount}
              </span>
            )}
          </Button>
        </Link>
      </HoverCardTrigger>
      <HoverCardContent className="w-80 p-0" align="end">
        <div className="p-4 border-b">
          <p className="font-medium">Your Cart ({cartCount} items)</p>
        </div>
        
        <div className="max-h-[300px] overflow-auto">
          {cartItems.length === 0 ? (
            <div className="py-8 text-center">
              <p className="text-muted-foreground">Your cart is empty</p>
            </div>
          ) : (
            <div className="p-2">
              {cartItems.slice(0, 3).map((item) => (
                <div key={item.id} className="flex items-center gap-3 p-2 hover:bg-muted/50 rounded-md">
                  <div className="w-10 h-10 rounded bg-muted flex-shrink-0">
                    {item.products.image_url && (
                      <img 
                        src={item.products.image_url} 
                        alt={item.products.name}
                        className="w-full h-full object-cover rounded"
                      />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{item.products.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {item.quantity} × ₹{item.products.price.toFixed(2)}
                    </p>
                  </div>
                </div>
              ))}
              
              {cartItems.length > 3 && (
                <p className="text-xs text-center text-muted-foreground py-2">
                  +{cartItems.length - 3} more items
                </p>
              )}
            </div>
          )}
        </div>
        
        <div className="p-4 border-t bg-muted/30">
          <div className="flex justify-between mb-4">
            <span className="font-medium">Total:</span>
            <span className="font-bold">₹{cartTotal.toFixed(2)}</span>
          </div>
          <Link 
            to="/cart"
            className="block w-full bg-primary hover:bg-primary/90 text-primary-foreground rounded-md py-2 px-4 text-center transition-colors text-sm"
          >
            View Cart
          </Link>
        </div>
      </HoverCardContent>
    </HoverCard>
  );
}
