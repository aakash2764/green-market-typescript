
import { useNavigate } from "react-router-dom";
import { useCart } from "@/context/CartContext";
import { motion } from "framer-motion";
import { pageVariants } from "@/lib/animations";
import { Button } from "@/components/ui/button";
import { ShoppingCart } from "lucide-react";

// Components
import { EmptyCartView } from "@/components/cart/EmptyCartView";
import { CartItemList } from "@/components/cart/CartItemList";

export default function Cart() {
  const { cartItems, cartTotal, updateQuantity, removeFromCart } = useCart();
  const navigate = useNavigate();

  const handleCheckout = () => {
    navigate('/checkout');
  };

  return (
    <motion.div
      className="container-custom py-12"
      variants={pageVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
    >
      <motion.h1 
        className="text-3xl font-bold mb-8"
        variants={pageVariants}
      >
        Shopping Cart
      </motion.h1>

      {cartItems.length === 0 ? (
        <EmptyCartView />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <CartItemList 
            cartItems={cartItems}
            updateQuantity={updateQuantity}
            removeFromCart={removeFromCart}
          />
          
          <div className="lg:col-span-1 space-y-4">
            <div className="bg-card rounded-lg border p-6">
              <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
              
              <div className="space-y-2 mb-6">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>₹{cartTotal.toFixed(2)}</span>
                </div>
                
                <div className="flex justify-between font-medium pt-2 text-lg">
                  <span>Total</span>
                  <span>₹{cartTotal.toFixed(2)}</span>
                </div>
              </div>
              
              <Button 
                className="w-full"
                onClick={handleCheckout}
                disabled={cartItems.length === 0}
              >
                Proceed to Checkout
              </Button>
            </div>
            
            <Button variant="outline" onClick={() => navigate('/products')} className="w-full">
              Continue Shopping
            </Button>
          </div>
        </div>
      )}
    </motion.div>
  );
}
