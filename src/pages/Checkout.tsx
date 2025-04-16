
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/lib/supabase";
import { toast } from "@/hooks/use-toast";
import { motion, AnimatePresence } from "framer-motion";
import { pageVariants } from "@/lib/animations";

import { Button } from "@/components/ui/button";
import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardContent 
} from "@/components/ui/card";
import { 
  Form, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormControl, 
  FormMessage 
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { 
  Alert, 
  AlertTitle, 
  AlertDescription 
} from "@/components/ui/alert";
import { 
  Loader2, 
  CreditCard, 
  AlertCircle,
  IndianRupee,
  Wallet,
  Landmark,
  Banknote
} from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

// Define schema for shipping information
const shippingFormSchema = z.object({
  fullName: z.string().min(3, { message: "Full name is required" }),
  email: z.string().email({ message: "Invalid email address" }),
  phone: z.string().min(10, { message: "Valid phone number is required" }),
  address: z.string().min(5, { message: "Address is required" }),
  city: z.string().min(2, { message: "City is required" }),
  state: z.string().min(2, { message: "State is required" }),
  zipCode: z.string().min(5, { message: "Valid zip code is required" }),
  paymentMethod: z.enum(["credit_card", "upi", "cod"], {
    required_error: "Please select a payment method",
  }),
});

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { 
      type: "spring", 
      stiffness: 300, 
      damping: 30 
    } 
  },
  exit: { 
    opacity: 0, 
    y: -20, 
    transition: { duration: 0.2 } 
  }
};

const formItemVariants = {
  hidden: { opacity: 0, x: -10 },
  visible: (custom: number) => ({
    opacity: 1,
    x: 0,
    transition: { 
      delay: custom * 0.05,
      duration: 0.3
    }
  })
};

export default function Checkout() {
  const { cartItems, cartTotal, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [isProcessing, setIsProcessing] = useState(false);
  const [checkoutError, setCheckoutError] = useState<string | null>(null);

  // Initialize form with react-hook-form
  const form = useForm<z.infer<typeof shippingFormSchema>>({
    resolver: zodResolver(shippingFormSchema),
    defaultValues: {
      fullName: "",
      email: user?.email || "",
      phone: "",
      address: "",
      city: "",
      state: "",
      zipCode: "",
      paymentMethod: "credit_card",
    },
  });

  // Redirect if cart is empty
  if (cartItems.length === 0) {
    navigate('/cart');
    return null;
  }

  // Handle form submission
  const onSubmit = async (data: z.infer<typeof shippingFormSchema>) => {
    setIsProcessing(true);
    setCheckoutError(null);
  
    try {
      if (!user) {
        navigate('/login', { state: { from: '/checkout' } });
        return;
      }
  
      // First check if products are in stock
      for (const item of cartItems) {
        const { data: productData, error: stockCheckError } = await supabase
          .from('products')
          .select('stock')
          .eq('id', item.products.id)
          .single();
  
        if (stockCheckError) {
          console.error('Stock check error:', stockCheckError);
          throw new Error(`Failed to check product stock: ${stockCheckError.message}`);
        }
  
        if (!productData) {
          throw new Error(`Product not found: ${item.products.name}`);
        }
  
        if (productData.stock < item.quantity) {
          throw new Error(`${item.products.name} is out of stock. Only ${productData.stock} available.`);
        }
      }
  
      console.log("Attempting to create order with data:", {
        user_id: user.id,
        status: data.paymentMethod === 'cod' ? 'pending' : 'confirmed',
        total_amount: cartTotal,
        shipping_address: {
          fullName: data.fullName,
          email: data.email,
          phone: data.phone,
          address: data.address,
          city: data.city,
          state: data.state,
          zipCode: data.zipCode
        },
        payment_method: data.paymentMethod
      });
      
      const { data: orderData, error: orderError } = await supabase
        .from('orders')
        .insert({
          user_id: user.id,
          status: data.paymentMethod === 'cod' ? 'pending' : 'confirmed',
          total_amount: cartTotal,
          shipping_address: {
            fullName: data.fullName,
            email: data.email,
            phone: data.phone,
            address: data.address,
            city: data.city,
            state: data.state,
            zipCode: data.zipCode
          },
          payment_method: data.paymentMethod
        })
        .select()
        .single();
      
      console.log("Order creation response:", { orderData, orderError });
      
      if (orderError) {
        console.error('Order creation error details:', orderError);
        throw new Error(`Failed to create order: ${orderError.message}`);
      }
  
      if (!orderData) {
        throw new Error('Order was created but no data was returned');
      }
  
      // Create order items
      const orderItemsData = cartItems.map(item => ({
        order_id: orderData.id,
        product_id: item.products.id,
        quantity: item.quantity,
        unit_price: item.products.price
      }));
  
      const { error: itemsError } = await supabase
        .from('order_items')
        .insert(orderItemsData);
  
      if (itemsError) {
        console.error('Order items creation error:', itemsError);
        throw new Error(`Failed to create order items: ${itemsError.message}`);
      }
  
      // Update product stock
      for (const item of cartItems) {
        const { error: stockError } = await supabase.rpc(
          'decrement_stock',
          { 
            p_id: item.products.id, 
            qty: item.quantity 
          }
        );
  
        if (stockError) {
          console.error('Stock update error:', stockError);
          throw new Error(`Failed to update product stock: ${stockError.message}`);
        }
      }
  
      // Clear the cart
      clearCart();
  
      // Navigate to order confirmation
      navigate(`/order/confirm`, { 
        state: { 
          order: {
            id: orderData.id,
            total: cartTotal,
            items: cartItems.length,
            date: new Date().toLocaleDateString(),
            paymentMethod: data.paymentMethod,
            status: data.paymentMethod === 'cod' ? 'pending' : 'confirmed'
          }
        } 
      });
  
      // Success toast
      toast({
        title: "Order Placed Successfully",
        description: data.paymentMethod === 'cod' 
          ? "Your order has been placed and will be confirmed upon delivery."
          : "Your order has been confirmed and is being processed.",
      });
  
    } catch (error) {
      console.error('Checkout error:', error);
      let errorMessage = 'Failed to process your order. Please try again.';
      
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      
      setCheckoutError(errorMessage);
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const getPaymentIcon = (method: string) => {
    switch (method) {
      case "credit_card":
        return <CreditCard className="h-4 w-4" />;
      case "razorpay":
        return <IndianRupee className="h-4 w-4" />;
      case "upi":
        return <Wallet className="h-4 w-4" />;
      case "netbanking":
        return <Landmark className="h-4 w-4" />;
      case "cod":
        return <Banknote className="h-4 w-4" />;
      default:
        return <CreditCard className="h-4 w-4" />;
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
        Checkout
      </motion.h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Shipping Information Form */}
        <div className="lg:col-span-2">
          <motion.div
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            <Card className="overflow-hidden border-primary/20 shadow-lg">
              <CardHeader className="bg-primary/5">
                <CardTitle>Shipping & Payment Information</CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <motion.div custom={0} variants={formItemVariants} initial="hidden" animate="visible">
                        <FormField
                          control={form.control}
                          name="fullName"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Full Name</FormLabel>
                              <FormControl>
                                <Input placeholder="John Doe" {...field} className="transition-all duration-300 focus:ring-2 focus:ring-primary/40" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </motion.div>
                      
                      <motion.div custom={1} variants={formItemVariants} initial="hidden" animate="visible">
                        <FormField
                          control={form.control}
                          name="email"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Email</FormLabel>
                              <FormControl>
                                <Input type="email" placeholder="john@example.com" {...field} className="transition-all duration-300 focus:ring-2 focus:ring-primary/40" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </motion.div>
                    </div>

                    <motion.div custom={2} variants={formItemVariants} initial="hidden" animate="visible">
                      <FormField
                        control={form.control}
                        name="phone"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Phone Number</FormLabel>
                            <FormControl>
                              <Input placeholder="+1 (555) 123-4567" {...field} className="transition-all duration-300 focus:ring-2 focus:ring-primary/40" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </motion.div>

                    <motion.div custom={3} variants={formItemVariants} initial="hidden" animate="visible">
                      <FormField
                        control={form.control}
                        name="address"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Address</FormLabel>
                            <FormControl>
                              <Textarea placeholder="123 Main St, Apt 4B" {...field} className="transition-all duration-300 focus:ring-2 focus:ring-primary/40" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </motion.div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <motion.div custom={4} variants={formItemVariants} initial="hidden" animate="visible">
                        <FormField
                          control={form.control}
                          name="city"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>City</FormLabel>
                              <FormControl>
                                <Input placeholder="New York" {...field} className="transition-all duration-300 focus:ring-2 focus:ring-primary/40" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </motion.div>
                      
                      <motion.div custom={5} variants={formItemVariants} initial="hidden" animate="visible">
                        <FormField
                          control={form.control}
                          name="state"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>State</FormLabel>
                              <FormControl>
                                <Input placeholder="NY" {...field} className="transition-all duration-300 focus:ring-2 focus:ring-primary/40" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </motion.div>
                      
                      <motion.div custom={6} variants={formItemVariants} initial="hidden" animate="visible">
                        <FormField
                          control={form.control}
                          name="zipCode"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Zip Code</FormLabel>
                              <FormControl>
                                <Input placeholder="10001" {...field} className="transition-all duration-300 focus:ring-2 focus:ring-primary/40" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </motion.div>
                    </div>

                    <motion.div custom={7} variants={formItemVariants} initial="hidden" animate="visible">
                      <FormField
                        control={form.control}
                        name="paymentMethod"
                        render={({ field }) => (
                          <FormItem className="space-y-3">
                            <FormLabel>Payment Method</FormLabel>
                            <FormControl>
                              <RadioGroup
                                onValueChange={field.onChange}
                                defaultValue={field.value}
                                className="grid grid-cols-1 md:grid-cols-2 gap-4"
                              >
                                <FormItem className="flex items-center space-x-3 space-y-0">
                                  <FormControl>
                                    <RadioGroupItem value="credit_card" />
                                  </FormControl>
                                  <div className="flex items-center gap-2 p-2 w-full border rounded-md bg-background/50 cursor-pointer hover:bg-background/80 transition-colors">
                                    <CreditCard className="h-4 w-4 text-primary" />
                                    <FormLabel className="cursor-pointer font-medium">Credit Card</FormLabel>
                                  </div>
                                </FormItem>
                                <FormItem className="flex items-center space-x-3 space-y-0">
                                  <FormControl>
                                    <RadioGroupItem value="upi" />
                                  </FormControl>
                                  <div className="flex items-center gap-2 p-2 w-full border rounded-md bg-background/50 cursor-pointer hover:bg-background/80 transition-colors">
                                    <Wallet className="h-4 w-4 text-primary" />
                                    <FormLabel className="cursor-pointer font-medium">UPI</FormLabel>
                                  </div>
                                </FormItem>
                                <FormItem className="flex items-center space-x-3 space-y-0">
                                  <FormControl>
                                    <RadioGroupItem value="cod" />
                                  </FormControl>
                                  <div className="flex items-center gap-2 p-2 w-full border rounded-md bg-background/50 cursor-pointer hover:bg-background/80 transition-colors">
                                    <Banknote className="h-4 w-4 text-primary" />
                                    <FormLabel className="cursor-pointer font-medium">Cash on Delivery</FormLabel>
                                  </div>
                                </FormItem>
                              </RadioGroup>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </motion.div>

                    <AnimatePresence>
                      {form.watch("paymentMethod") === "credit_card" && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.3 }}
                          className="overflow-hidden"
                        >
                          <Card className="bg-muted/40 border-dashed">
                            <CardHeader className="pb-2">
                              <CardTitle className="flex items-center gap-2 text-base font-medium">
                                <CreditCard className="h-4 w-4" />
                                Payment Information
                              </CardTitle>
                            </CardHeader>
                            <CardContent>
                              <p className="text-sm text-muted-foreground mb-4">
                                This is a demo application. No real payment will be processed.
                              </p>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                  <FormLabel>Card Number</FormLabel>
                                  <Input disabled placeholder="4242 4242 4242 4242" className="bg-background/50" />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                  <div>
                                    <FormLabel>Expiry</FormLabel>
                                    <Input disabled placeholder="MM/YY" className="bg-background/50" />
                                  </div>
                                  <div>
                                    <FormLabel>CVV</FormLabel>
                                    <Input disabled placeholder="123" className="bg-background/50" />
                                  </div>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {checkoutError && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                      >
                        <Alert variant="destructive">
                          <AlertCircle className="h-4 w-4" />
                          <AlertTitle>Error</AlertTitle>
                          <AlertDescription>
                            {checkoutError}
                          </AlertDescription>
                        </Alert>
                      </motion.div>
                    )}

                    <div className="flex justify-between pt-4">
                      <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                        <Button 
                          type="button" 
                          variant="outline" 
                          onClick={() => navigate('/cart')}
                          className="transition-all duration-300"
                        >
                          Back to Cart
                        </Button>
                      </motion.div>
                      <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                        <Button 
                          type="submit" 
                          disabled={isProcessing || cartItems.length === 0}
                          className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary shadow-md transition-all duration-300 hover:shadow-lg"
                        >
                          {isProcessing ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              Processing...
                            </>
                          ) : (
                            'Place Order'
                          )}
                        </Button>
                      </motion.div>
                    </div>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <motion.div
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            transition={{ delay: 0.2 }}
          >
            <Card className="border-primary/20 shadow-lg sticky top-20">
              <CardHeader className="bg-primary/5">
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 p-6">
                <div className="space-y-2">
                  <AnimatePresence>
                    {cartItems.map((item, index) => (
                      <motion.div 
                        key={item.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ 
                          opacity: 1, 
                          y: 0,
                          transition: { delay: 0.1 + (index * 0.05) }
                        }}
                        exit={{ opacity: 0, y: -10 }}
                        className="flex justify-between text-sm py-2 border-b last:border-b-0 group"
                      >
                        <span className="flex-1 group-hover:text-primary transition-colors">
                          {item.products.name} × {item.quantity}
                        </span>
                        <span className="font-medium">
                          ₹{(item.products.price * item.quantity).toFixed(2)}
                        </span>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
                
                <Separator />
                
                <div className="space-y-2">
                  <motion.div 
                    className="flex justify-between text-sm"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1, transition: { delay: 0.3 } }}
                  >
                    <span className="text-muted-foreground">Subtotal</span>
                    <span>₹{cartTotal.toFixed(2)}</span>
                  </motion.div>
                  <motion.div 
                    className="flex justify-between text-sm"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1, transition: { delay: 0.4 } }}
                  >
                    <span className="text-muted-foreground">Shipping</span>
                    <span>Free</span>
                  </motion.div>
                  <motion.div 
                    className="flex justify-between text-sm"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1, transition: { delay: 0.5 } }}
                  >
                    <span className="text-muted-foreground">Tax</span>
                    <span>Included</span>
                  </motion.div>
                  <Separator />
                  <motion.div 
                    className="flex justify-between font-medium text-lg pt-2"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ 
                      opacity: 1, 
                      scale: 1,
                      transition: { 
                        delay: 0.6,
                        type: "spring",
                        stiffness: 300
                      } 
                    }}
                    whileHover={{ scale: 1.03 }}
                  >
                    <span>Total</span>
                    <span className="text-primary font-bold">₹{cartTotal.toFixed(2)}</span>
                  </motion.div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}
