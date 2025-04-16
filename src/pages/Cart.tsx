
  import { useNavigate } from "react-router-dom";
  import { useCart } from "@/context/CartContext";
  import { motion, AnimatePresence } from "framer-motion";
  import { pageVariants } from "@/lib/animations";
  import { Button } from "@/components/ui/button";
  import { ShoppingCart, ShoppingBag } from "lucide-react";

  // Components
  import { EmptyCartView } from "@/components/cart/EmptyCartView";
  import { CartItemList } from "@/components/cart/CartItemList";

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    },
    exit: {
      opacity: 0,
      transition: { 
        staggerChildren: 0.05,
        staggerDirection: -1
      }
    }
  };

  const summaryVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        type: "spring", 
        stiffness: 300, 
        damping: 25 
      } 
    },
    exit: { opacity: 0, y: -20 }
  };

  const buttonVariants = {
    hover: { 
      scale: 1.03,
      boxShadow: "0 5px 15px rgba(0,0,0,0.1)",
      transition: { 
        type: "spring", 
        stiffness: 400, 
        damping: 10 
      } 
    },
    tap: { scale: 0.98 }
  };

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
        <motion.div 
          className="flex items-center gap-3 mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ 
            opacity: 1, 
            y: 0,
            transition: { 
              type: "spring", 
              stiffness: 300, 
              damping: 30 
            } 
          }}
        >
          <ShoppingCart className="h-8 w-8 text-primary" />
          <h1 className="text-3xl font-bold">Shopping Cart</h1>
        </motion.div>

        <AnimatePresence>
          {cartItems.length === 0 ? (
            <EmptyCartView key="empty" />
          ) : (
            <motion.div 
              className="grid grid-cols-1 lg:grid-cols-3 gap-8"
              key="cart-content"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              <CartItemList 
                cartItems={cartItems}
                updateQuantity={updateQuantity}
                removeFromCart={removeFromCart}
              />
              
              <motion.div 
                className="lg:col-span-1 space-y-4"
                variants={summaryVariants}
              >
                <div className="bg-card rounded-lg border p-6 shadow-md border-primary/20">
                  <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                    <ShoppingBag className="h-5 w-5 text-primary" />
                    Order Summary
                  </h2>
                  
                  <div className="space-y-2 mb-6">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Subtotal</span>
                      <span>₹{cartTotal.toFixed(2)}</span>
                    </div>
                    
                    <motion.div 
                      className="flex justify-between font-medium pt-2 text-lg border-t"
                      whileHover={{ scale: 1.02 }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      <span>Total</span>
                      <span className="text-primary font-bold">₹{cartTotal.toFixed(2)}</span>
                    </motion.div>
                  </div>
                  
                  <motion.div
                    whileHover="hover"
                    whileTap="tap"
                    variants={buttonVariants}
                  >
                    <Button 
                      className="w-full bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary shadow-md transition-all duration-300 hover:shadow-lg text-lg py-6"
                      onClick={handleCheckout}
                      disabled={cartItems.length === 0}
                    >
                      Proceed to Checkout
                    </Button>
                  </motion.div>
                </div>
                
                <motion.div
                  whileHover="hover"
                  whileTap="tap"
                  variants={buttonVariants}
                >
                  <Button 
                    variant="outline" 
                    onClick={() => navigate('/products')} 
                    className="w-full border-primary/20 hover:bg-primary/5"
                  >
                    Continue Shopping
                  </Button>
                </motion.div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    );
  }
