
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/lib/supabase";
import { toast } from "@/hooks/use-toast";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  Package,
  Trash2,
  Minus,
  Plus,
  Loader2,
  ArrowLeft,
  AlertCircle,
} from "lucide-react";
import { OrderConfirmationModal } from "@/components/order/OrderConfirmationModal";
import { motion } from "framer-motion";
import { pageVariants, itemVariants, buttonVariants } from "@/lib/animations";

interface CartProduct {
  id: string;
  name: string;
  price: number;
  image_url: string;
  quantity: number;
  stock: number;
}

export default function Cart() {
  const { cartItems, cartTotal, updateQuantity, removeFromCart, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [shippingInfo, setShippingInfo] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [checkoutError, setCheckoutError] = useState<string | null>(null);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [confirmedOrder, setConfirmedOrder] = useState<{
    id: string;
    total: number;
    items: number;
  } | null>(null);

  // Round up total to nearest integer
  const roundUpTotal = (amount: number) => {
    return Math.ceil(amount);
  };

  const handleCheckout = async () => {
    setIsProcessing(true);
    setCheckoutError(null);

    try {
      if (!user) {
        navigate('/login', { state: { from: '/cart' } });
        return;
      }

      // Create order
      const { data: orderData, error: orderError } = await supabase
        .from('orders')
        .insert({
          user_id: user.id,
          status: 'confirmed',
          total_amount: cartTotal,
          shipping_address: shippingInfo
        })
        .select()
        .single();

      if (orderError) throw orderError;

      // Create order items and update product stock
      const orderItems = [];
      for (const item of cartItems) {
        const { data: orderItemData, error: orderItemError } = await supabase
          .from('order_items')
          .insert({
            order_id: orderData.id,
            product_id: item.id,
            quantity: item.quantity,
            unit_price: item.products.price
          })
          .select()
          .single();

        if (orderItemError) throw orderItemError;
        orderItems.push(orderItemData);

        // Update product stock
        const { error: stockError } = await supabase.rpc(
          'decrement_stock',
          { row_id: item.id, amount: item.quantity }
        );

        if (stockError) throw stockError;
      }

      // Set confirmed order for modal
      setConfirmedOrder({
        id: orderData.id,
        total: cartTotal,
        items: cartItems.reduce((acc, item) => acc + item.quantity, 0)
      });

      // Show confirmation modal
      setShowConfirmation(true);

      // Clear cart
      clearCart();

      // Set success
      toast({
        title: "Order Placed Successfully",
        description: "Your order has been confirmed.",
      });

    } catch (error) {
      console.error('Checkout error:', error);
      setCheckoutError('Failed to process your order. Please try again.');
      toast({
        title: "Error",
        description: "Failed to process your order. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
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
        variants={itemVariants}
      >
        Shopping Cart
      </motion.h1>

      {cartItems.length === 0 ? (
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
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <motion.div 
            className="lg:col-span-2 space-y-4"
            variants={itemVariants}
          >
            <div className="bg-card rounded-lg border overflow-hidden">
              <div className="p-4 border-b">
                <h2 className="text-xl font-semibold">Cart Items</h2>
              </div>
              <div className="divide-y">
                {cartItems.map((item, index) => (
                  <motion.div
                    key={`${item.id}-${index}`}
                    className="flex items-center p-4 gap-4"
                    variants={itemVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    custom={index}
                    whileHover={{ backgroundColor: "rgba(0,0,0,0.02)" }}
                  >
                    <div className="relative w-16 h-16 bg-muted rounded overflow-hidden flex-shrink-0">
                      {item.products.image_url ? (
                        <motion.img
                          src={item.products.image_url}
                          alt={item.products.name}
                          className="w-full h-full object-cover"
                          whileHover={{ scale: 1.1 }}
                        />
                      ) : (
                        <Package className="w-8 h-8 absolute inset-0 m-auto text-muted-foreground" />
                      )}
                    </div>
                    
                    <div className="flex-1">
                      <h3 className="font-medium">{item.products.name}</h3>
                      <p className="text-sm text-muted-foreground">
                        ₹{item.products.price.toFixed(2)} each
                      </p>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <motion.div
                        whileHover="hover"
                        whileTap="tap"
                        variants={buttonVariants}
                      >
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                        >
                          <Minus className="h-3 w-3" />
                        </Button>
                      </motion.div>
                      
                      <span className="w-6 text-center">{item.quantity}</span>
                      
                      <motion.div
                        whileHover="hover"
                        whileTap="tap"
                        variants={buttonVariants}
                      >
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        >
                          <Plus className="h-3 w-3" />
                        </Button>
                      </motion.div>
                    </div>
                    
                    <div className="text-right">
                      <p className="font-medium">
                        ₹{(item.products.price * item.quantity).toFixed(2)}
                      </p>
                      <motion.div
                        whileHover="hover"
                        whileTap="tap"
                        variants={buttonVariants}
                      >
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeFromCart(item.id)}
                          className="h-8 px-2 text-destructive hover:text-destructive hover:bg-destructive/10"
                        >
                          <Trash2 className="h-3.5 w-3.5 mr-1" />
                          Remove
                        </Button>
                      </motion.div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
          
          <motion.div
            className="space-y-4"
            variants={itemVariants}
          >
            <Card>
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span>₹{cartTotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Shipping</span>
                    <span>Free</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Tax</span>
                    <span>Included</span>
                  </div>
                  <Separator />
                  <motion.div 
                    className="flex justify-between font-medium text-lg pt-2"
                    whileHover={{ scale: 1.03 }}
                  >
                    <span>Total</span>
                    <span>₹{roundUpTotal(cartTotal)}</span>
                  </motion.div>
                </div>
                
                <div className="space-y-4">
                  <h3 className="font-medium">Shipping Information</h3>
                  <Input
                    placeholder="Address"
                    value={shippingInfo}
                    onChange={(e) => setShippingInfo(e.target.value)}
                    className="transition-all duration-300 focus:ring-2 focus:ring-primary/20"
                  />
                  
                  <motion.div
                    whileHover="hover"
                    whileTap="tap"
                    variants={buttonVariants}
                  >
                    <Button
                      className="w-full"
                      onClick={handleCheckout}
                      disabled={isProcessing || !shippingInfo.trim()}
                    >
                      {isProcessing ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Processing...
                        </>
                      ) : (
                        "Place Order"
                      )}
                    </Button>
                  </motion.div>
                  
                  {checkoutError && (
                    <Alert variant="destructive">
                      <AlertCircle className="h-4 w-4" />
                      <AlertTitle>Error</AlertTitle>
                      <AlertDescription>
                        {checkoutError}
                      </AlertDescription>
                    </Alert>
                  )}
                </div>
              </CardContent>
            </Card>
            
            <motion.div
              whileHover="hover"
              whileTap="tap"
              variants={buttonVariants}
            >
              <Button variant="outline" asChild className="w-full">
                <Link to="/products">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Continue Shopping
                </Link>
              </Button>
            </motion.div>
          </motion.div>
        </div>
      )}

      {/* Order confirmation modal */}
      <OrderConfirmationModal 
        isOpen={showConfirmation}
        onClose={() => setShowConfirmation(false)}
        orderDetails={confirmedOrder}
      />
    </motion.div>
  );
}
