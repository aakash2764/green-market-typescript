
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
import { Check, Copy, Truck, Calendar, ShoppingBag } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { motion } from "framer-motion";
import { pageVariants } from "@/lib/animations";

const OrderConfirmation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [order, setOrder] = useState<{
    id: string;
    total: number;
    items: number;
    date: string;
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
      <div className="max-w-3xl mx-auto mb-10 text-center">
        <div className="mb-4 flex justify-center">
          <div className="h-16 w-16 flex items-center justify-center rounded-full bg-primary/20 dark:bg-primary/10">
            <Check className="h-8 w-8 text-primary" />
          </div>
        </div>
        <h1 className="text-3xl font-bold text-foreground mb-2">Order Confirmed!</h1>
        <p className="text-muted-foreground text-lg">
          Thank you for your purchase. We're processing your order now.
        </p>
      </div>

      {/* Order Summary Card */}
      <Card className="max-w-3xl mx-auto">
        <CardHeader className="text-center border-b">
          <CardTitle className="text-2xl">Order Summary</CardTitle>
          <CardDescription>Order details for your reference</CardDescription>
        </CardHeader>
        
        <CardContent className="pt-6">
          {/* Order ID Row */}
          <div className="border-b pb-4 mb-4">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="font-semibold">Order ID</h3>
                <p className="text-muted-foreground">{order.id}</p>
              </div>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={copyOrderId}
              >
                {copied ? <Check className="h-4 w-4 mr-1" /> : <Copy className="h-4 w-4 mr-1" />}
                {copied ? "Copied" : "Copy ID"}
              </Button>
            </div>
          </div>

          {/* Order Details Grid */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3 mb-6">
            <div className="flex flex-col p-4 rounded-lg bg-background/50">
              <div className="mb-3">
                <Calendar className="h-5 w-5 text-primary mb-1" />
              </div>
              <h3 className="font-medium">Order Date</h3>
              <p className="text-muted-foreground">{order.date}</p>
            </div>
            
            <div className="flex flex-col p-4 rounded-lg bg-background/50">
              <div className="mb-3">
                <ShoppingBag className="h-5 w-5 text-primary mb-1" />
              </div>
              <h3 className="font-medium">Items Ordered</h3>
              <p className="text-muted-foreground">{order.items} items</p>
            </div>
            
            <div className="flex flex-col p-4 rounded-lg bg-background/50">
              <div className="mb-3">
                <Truck className="h-5 w-5 text-primary mb-1" />
              </div>
              <h3 className="font-medium">Estimated Delivery</h3>
              <p className="text-muted-foreground">3-5 business days</p>
            </div>
          </div>

          {/* Order Total Section */}
          <div className="flex justify-between items-center pt-4 border-t">
            <span className="font-semibold text-lg">Total Paid</span>
            <span className="font-bold text-xl text-primary">₹{order.total.toFixed(2)}</span>
          </div>
        </CardContent>
        
        <CardFooter className="flex flex-col sm:flex-row gap-3 justify-between">
          <Button 
            variant="outline" 
            onClick={() => navigate('/products')}
            className="w-full sm:w-auto order-2 sm:order-1"
          >
            Continue Shopping
          </Button>
          <Button 
            onClick={() => navigate('/profile')}
            className="w-full sm:w-auto order-1 sm:order-2"
          >
            View My Account
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  );
};

export default OrderConfirmation;
