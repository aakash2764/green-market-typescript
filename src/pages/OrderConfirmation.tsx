
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { 
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter
} from "@/components/ui/card";
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle, 
  DialogDescription,
  DialogFooter
} from "@/components/ui/dialog";
import { Check, Copy, Truck, Calendar, ShoppingBag, CreditCard, IndianRupee, Wallet, Landmark, Banknote } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { motion, AnimatePresence } from "framer-motion";
import { pageVariants } from "@/lib/animations";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      when: "beforeChildren",
      staggerChildren: 0.1,
      delayChildren: 0.2
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { 
      type: "spring", 
      stiffness: 300, 
      damping: 25 
    } 
  }
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

const OrderConfirmation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [order, setOrder] = useState<{
    id: string;
    total: number;
    items: number;
    date: string;
    paymentMethod?: string;
  } | null>(null);
  const [showDialog, setShowDialog] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    // Get order information from location state or redirect
    if (location.state?.order) {
      setOrder(location.state.order);
    } else {
      // If navigated directly without order data, redirect to home
      navigate('/');
    }
  }, [location, navigate]);

  const copyOrderId = () => {
    if (order) {
      navigator.clipboard.writeText(order.id);
      setCopied(true);
      toast({
        title: "Copied to clipboard",
        description: `Order ID: ${order.id}`,
      });
      
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const getPaymentMethodIcon = (method?: string) => {
    if (!method) return <CreditCard className="h-5 w-5 text-primary mb-1" />;
    
    switch (method) {
      case "credit_card":
        return <CreditCard className="h-5 w-5 text-primary mb-1" />;
      case "razorpay":
        return <IndianRupee className="h-5 w-5 text-primary mb-1" />;
      case "upi":
        return <Wallet className="h-5 w-5 text-primary mb-1" />;
      case "netbanking":
        return <Landmark className="h-5 w-5 text-primary mb-1" />;
      case "cod":
        return <Banknote className="h-5 w-5 text-primary mb-1" />;
      default:
        return <CreditCard className="h-5 w-5 text-primary mb-1" />;
    }
  };

  const getPaymentMethodName = (method?: string) => {
    if (!method) return "Credit Card";
    
    switch (method) {
      case "credit_card":
        return "Credit Card";
      case "razorpay":
        return "Razorpay";
      case "upi":
        return "UPI";
      case "netbanking":
        return "Net Banking";
      case "cod":
        return "Cash on Delivery";
      default:
        return "Credit Card";
    }
  };

  if (!order) {
    return (
      <div className="flex items-center justify-center min-h-[70vh]">
        <div className="animate-pulse">Loading order information...</div>
      </div>
    );
  }

  return (
    <motion.div 
      className="container-custom py-12 px-4 sm:px-6"
      variants={pageVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
    >
      {/* Success Message */}
      <motion.div 
        className="max-w-3xl mx-auto mb-10 text-center"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div 
          className="mb-4 flex justify-center"
          variants={itemVariants}
        >
          <motion.div 
            className="h-16 w-16 flex items-center justify-center rounded-full bg-primary/20 dark:bg-primary/10"
            initial={{ scale: 0 }}
            animate={{ 
              scale: 1,
              transition: {
                type: "spring",
                stiffness: 300,
                damping: 20
              }
            }}
          >
            <Check className="h-8 w-8 text-primary" />
          </motion.div>
        </motion.div>
        <motion.h1 
          className="text-3xl font-bold text-foreground mb-2"
          variants={itemVariants}
        >
          Order Confirmed!
        </motion.h1>
        <motion.p 
          className="text-muted-foreground text-lg"
          variants={itemVariants}
        >
          Thank you for your purchase. We're processing your order now.
        </motion.p>
      </motion.div>

      {/* Order Summary Card */}
      <motion.div
        className="max-w-3xl mx-auto"
        variants={itemVariants}
      >
        <Card className="overflow-hidden border-primary/20 shadow-lg">
          <CardHeader className="text-center border-b bg-primary/5">
            <CardTitle className="text-2xl">Order Summary</CardTitle>
            <CardDescription>Order details for your reference</CardDescription>
          </CardHeader>
          
          <CardContent className="pt-6">
            {/* Order ID Row */}
            <motion.div 
              className="border-b pb-4 mb-4"
              variants={itemVariants}
              initial="hidden"
              animate="visible"
              custom={1}
            >
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="font-semibold">Order ID</h3>
                  <p className="text-muted-foreground">{order.id}</p>
                </div>
                <motion.div whileHover="hover" whileTap="tap" variants={buttonVariants}>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={copyOrderId}
                    className="transition-all duration-300"
                  >
                    {copied ? <Check className="h-4 w-4 mr-1" /> : <Copy className="h-4 w-4 mr-1" />}
                    {copied ? "Copied" : "Copy ID"}
                  </Button>
                </motion.div>
              </div>
            </motion.div>

            {/* Order Details Grid */}
            <motion.div 
              className="grid grid-cols-1 gap-4 md:grid-cols-4 mb-6"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              <motion.div 
                className="flex flex-col p-4 rounded-lg bg-background/50 border border-primary/10 hover:border-primary/30 transition-all duration-300 hover:shadow-md"
                variants={itemVariants}
                whileHover={{ y: -5, transition: { duration: 0.2 } }}
              >
                <div className="mb-3">
                  <Calendar className="h-5 w-5 text-primary mb-1" />
                </div>
                <h3 className="font-medium">Order Date</h3>
                <p className="text-muted-foreground">{order.date}</p>
              </motion.div>
              
              <motion.div 
                className="flex flex-col p-4 rounded-lg bg-background/50 border border-primary/10 hover:border-primary/30 transition-all duration-300 hover:shadow-md"
                variants={itemVariants}
                whileHover={{ y: -5, transition: { duration: 0.2 } }}
              >
                <div className="mb-3">
                  <ShoppingBag className="h-5 w-5 text-primary mb-1" />
                </div>
                <h3 className="font-medium">Items Ordered</h3>
                <p className="text-muted-foreground">{order.items} items</p>
              </motion.div>
              
              <motion.div 
                className="flex flex-col p-4 rounded-lg bg-background/50 border border-primary/10 hover:border-primary/30 transition-all duration-300 hover:shadow-md"
                variants={itemVariants}
                whileHover={{ y: -5, transition: { duration: 0.2 } }}
              >
                <div className="mb-3">
                  <Truck className="h-5 w-5 text-primary mb-1" />
                </div>
                <h3 className="font-medium">Estimated Delivery</h3>
                <p className="text-muted-foreground">3-5 business days</p>
              </motion.div>

              <motion.div 
                className="flex flex-col p-4 rounded-lg bg-background/50 border border-primary/10 hover:border-primary/30 transition-all duration-300 hover:shadow-md"
                variants={itemVariants}
                whileHover={{ y: -5, transition: { duration: 0.2 } }}
              >
                <div className="mb-3">
                  {getPaymentMethodIcon(order.paymentMethod)}
                </div>
                <h3 className="font-medium">Payment Method</h3>
                <p className="text-muted-foreground">{getPaymentMethodName(order.paymentMethod)}</p>
              </motion.div>
            </motion.div>

            {/* Order Total Section */}
            <motion.div 
              className="flex justify-between items-center pt-4 border-t"
              variants={itemVariants}
              initial={{ opacity: 0, y: 20 }}
              animate={{ 
                opacity: 1, 
                y: 0,
                transition: { 
                  delay: 0.5,
                  type: "spring", 
                  stiffness: 300 
                } 
              }}
            >
              <span className="font-semibold text-lg">Total Paid</span>
              <span className="font-bold text-xl text-primary">₹{order.total.toFixed(2)}</span>
            </motion.div>
          </CardContent>
          
          <CardFooter className="flex flex-col sm:flex-row gap-3 justify-between p-6 bg-primary/5">
            <motion.div 
              whileHover="hover" 
              whileTap="tap" 
              variants={buttonVariants}
              className="w-full sm:w-auto order-2 sm:order-1"
            >
              <Button 
                variant="outline" 
                onClick={() => navigate('/products')}
                className="w-full transition-all duration-300"
              >
                Continue Shopping
              </Button>
            </motion.div>
            <motion.div 
              whileHover="hover" 
              whileTap="tap" 
              variants={buttonVariants}
              className="w-full sm:w-auto order-1 sm:order-2"
            >
              <Button 
                onClick={() => navigate('/profile')}
                className="w-full bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary shadow-md transition-all duration-300 hover:shadow-lg"
              >
                View My Account
              </Button>
            </motion.div>
          </CardFooter>
        </Card>
      </motion.div>
    </motion.div>
  );
};

export default OrderConfirmation;
