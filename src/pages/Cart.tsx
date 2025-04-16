
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/lib/supabase";
import { toast } from "@/hooks/use-toast";
import { OrderConfirmationModal } from "@/components/order/OrderConfirmationModal";
import { motion } from "framer-motion";
import { pageVariants } from "@/lib/animations";

// Newly created components
import { EmptyCartView } from "@/components/cart/EmptyCartView";
import { CartItemList } from "@/components/cart/CartItemList";
import { OrderSummary } from "@/components/cart/OrderSummary";

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
          
          <OrderSummary 
            cartTotal={cartTotal}
            isProcessing={isProcessing}
            checkoutError={checkoutError}
            shippingInfo={shippingInfo}
            setShippingInfo={setShippingInfo}
            handleCheckout={handleCheckout}
          />
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
