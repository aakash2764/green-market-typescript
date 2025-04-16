
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { 
  Package, 
  ShoppingBag, 
  Calendar, 
  Clock, 
  ArrowLeft, 
  AlertCircle 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/lib/supabase";
import { fetchUserOrders } from "@/services/supabaseService";
import { Json } from "@/integrations/supabase/types";
import { pageVariants, cardVariants, itemVariants } from "@/lib/animations";

interface OrderItem {
  quantity: number;
  unit_price: number;
  product_id: string;
  // Remove created_at since it's not in the API response
  products: {
    name: string;
    image_url: string;
  };
}



interface Order {
  id: string;
  user_id: string;
  status: string;
  total_amount: number;
  shipping_address: Json;
  payment_method?: string; // Make optional with '?'
  created_at: string;
  updated_at?: string; // Make optional with '?'
  order_items: OrderItem[]; 
}

export default function Orders() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    async function loadOrders() {
      try {
        setLoading(true);
        setError(null);
        console.log('Loading orders for user:', user.id);
        const fetchedOrders = await fetchUserOrders(user.id);
        
        // Add more detailed logging
        if (fetchedOrders && fetchedOrders.length > 0) {
          console.log('Complete first order data:', fetchedOrders[0]);
          console.log('Order items:', fetchedOrders[0].order_items);
          if (fetchedOrders[0].order_items && fetchedOrders[0].order_items.length > 0) {
            console.log('First item in first order:', fetchedOrders[0].order_items[0]);
          }
        }
        
        setOrders(fetchedOrders || []);
      } catch (err) {
        console.error('Error loading orders:', err);
        setError('Failed to load your orders. Please try again later.');
      } finally {
        setLoading(false);
      }
    }

    loadOrders();
  }, [user, navigate]);

  // Format date to a more readable format
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  // Format time to a more readable format
  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  // Get status badge color based on order status
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'confirmed':
        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400';
      case 'shipped':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400';
      case 'delivered':
        return 'bg-primary/10 text-primary';
      case 'cancelled':
        return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300';
    }
  };

  // Round up the total amount to nearest integer
  const roundUpTotal = (amount: number) => {
    return Math.ceil(amount);
  };

  if (loading) {
    return (
      <motion.div 
        className="container-custom py-12"
        variants={pageVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
      >
        <div className="max-w-4xl mx-auto">
          <motion.h1 
            className="text-3xl font-bold mb-8"
            variants={itemVariants}
          >
            My Orders
          </motion.h1>
          
          <motion.div className="space-y-6" variants={itemVariants}>
            {[1, 2].map((i) => (
              <motion.div
                key={i}
                className="bg-gray-100 dark:bg-gray-800 overflow-hidden rounded-lg animate-pulse"
                initial={{ opacity: 0, y: 20 }}
                animate={{ 
                  opacity: 1, 
                  y: 0, 
                  transition: { 
                    duration: 0.3, 
                    delay: i * 0.1 
                  } 
                }}
              >
                <Card key={i} className="overflow-hidden">
                  <CardHeader>
                    <div className="flex justify-between items-center">
                      <Skeleton className="h-6 w-32" />
                      <Skeleton className="h-6 w-24" />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="border rounded-lg divide-y">
                        {[1, 2].map((j) => (
                          <div key={j} className="flex items-center p-4 gap-4">
                            <Skeleton className="h-16 w-16 rounded" />
                            <div className="flex-1">
                              <Skeleton className="h-4 w-32 mb-2" />
                              <Skeleton className="h-3 w-24" />
                            </div>
                            <Skeleton className="h-4 w-16" />
                          </div>
                        ))}
                      </div>
                      <div className="flex flex-col gap-2 items-end">
                        <Skeleton className="h-4 w-32" />
                        <Skeleton className="h-6 w-24" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.div>
    );
  }

  if (error) {
    return (
      <motion.div
        className="container-custom py-12"
        variants={pageVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
      >
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{
              type: "spring",
              stiffness: 400,
              damping: 17,
            }}
          >
            <AlertCircle className="h-12 w-12 text-destructive mx-auto mb-4" />
            <h1 className="text-3xl font-bold mb-4">Something went wrong</h1>
            <p className="text-muted-foreground mb-6">{error}</p>
            <Button onClick={() => window.location.reload()}>
              Try Again
            </Button>
          </motion.div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      className="container-custom py-12"
      variants={pageVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
    >
      <div className="max-w-4xl mx-auto">
        <motion.div
          className="flex items-center justify-between mb-8"
          variants={itemVariants}
        >
          <h1 className="text-3xl font-bold">My Orders</h1>
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button variant="outline" size="sm" asChild>
              <Link to="/products">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Continue Shopping
              </Link>
            </Button>
          </motion.div>
        </motion.div>
        
        {orders.length === 0 ? (
          <motion.div
            variants={cardVariants}
            whileHover={{ y: -5, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)" }}
            transition={{ duration: 0.3 }}
          >
            <Card>
              <CardContent className="flex flex-col items-center text-center py-12">
                <ShoppingBag className="h-12 w-12 text-muted-foreground mb-4" />
                <h2 className="text-xl font-semibold mb-2">No orders found</h2>
                <p className="text-muted-foreground mb-6">
                  You haven't placed any orders yet.
                </p>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button asChild>
                    <Link to="/products">Browse Products</Link>
                  </Button>
                </motion.div>
              </CardContent>
            </Card>
          </motion.div>
        ) : (
          <motion.div className="space-y-6">
            <AnimatePresence>
              {orders.map((order, index) => (
                <motion.div
                  key={order.id}
                  variants={itemVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  custom={index}
                >
                  <Card className="overflow-hidden">
                    <CardHeader>
                      <CardTitle className="flex justify-between items-center">
                        <div>
                          <span className="text-lg">Order #{order.id.slice(0, 8)}</span>
                          <div className="flex items-center gap-3 mt-1">
                            <span className="flex items-center text-sm text-muted-foreground">
                              <Calendar className="h-3.5 w-3.5 mr-1" />
                              {formatDate(order.created_at)}
                            </span>
                            <span className="flex items-center text-sm text-muted-foreground">
                              <Clock className="h-3.5 w-3.5 mr-1" />
                              {formatTime(order.created_at)}
                            </span>
                          </div>
                        </div>
                        <Badge className={`text-xs px-3 py-1 rounded-full capitalize ${getStatusColor(order.status)}`}>
                          {order.status || 'pending'}
                        </Badge>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="border rounded-lg divide-y">
                          {order.order_items?.map((item) => ( // Changed from orderitems to order_items
                            <motion.div
                              key={`${item.product_id}-${item.quantity}`}
                              className="flex items-center p-4 gap-4"
                              whileHover={{ backgroundColor: "rgba(0,0,0,0.02)" }}
                            >
                              <div className="relative w-16 h-16 bg-muted rounded overflow-hidden flex-shrink-0">
                                {item.products?.image_url ? (
                                  <motion.img
                                    src={item.products.image_url}
                                    alt={item.products.name || 'Product'}
                                    className="w-full h-full object-cover"
                                    whileHover={{ scale: 1.1 }}
                                    transition={{ duration: 0.3 }}
                                  />
                                ) : (
                                  <Package className="w-8 h-8 absolute inset-0 m-auto text-muted-foreground" />
                                )}
                              </div>
                              <div className="flex-1">
                                <p className="font-medium">
                                  {item.products?.name || 'Product'}
                                </p>
                                <p className="text-sm text-muted-foreground">
                                  Quantity: {item.quantity} × ₹{item.unit_price.toFixed(2)}
                                </p>
                              </div>
                              <p className="font-medium">
                                ₹{(item.unit_price * item.quantity).toFixed(2)}
                              </p>
                            </motion.div>
                          ))}
                        </div>
                        <div className="flex flex-col gap-4">
                          <div className="flex justify-between items-start">
                            <div className="text-sm">
                              <p className="text-muted-foreground">Payment Method</p>
                              <p className="font-medium capitalize">{order.payment_method || 'Not specified'}</p>
                            </div>
                            <div className="text-right">
                              <p className="text-sm text-muted-foreground">Shipping Address</p>
                              <p className="font-medium">
                                {typeof order.shipping_address === 'string' 
                                  ? order.shipping_address 
                                  : JSON.stringify(order.shipping_address)}
                              </p>
                            </div>
                          </div>
                          <div className="flex justify-end">
                            <div className="text-right">
                              <p className="text-sm text-muted-foreground">Total Amount</p>
                              <p className="text-lg font-medium">₹{roundUpTotal(order.total_amount)}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}
