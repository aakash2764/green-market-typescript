
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { CheckCircle, Package, ShoppingBag } from "lucide-react";
import confetti from 'canvas-confetti';

interface OrderConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  orderDetails: {
    id: string;
    total: number;
    items: number;
  } | null;
}

export function OrderConfirmationModal({ 
  isOpen, 
  onClose, 
  orderDetails 
}: OrderConfirmationModalProps) {
  const navigate = useNavigate();
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    if (isOpen && orderDetails) {
      // Fire confetti when the modal opens
      setShowConfetti(true);
      const timeout = setTimeout(() => {
        triggerConfetti();
      }, 300);
      
      return () => clearTimeout(timeout);
    }
  }, [isOpen, orderDetails]);

  const triggerConfetti = () => {
    const duration = 3000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 9999 };

    function randomInRange(min: number, max: number) {
      return Math.random() * (max - min) + min;
    }

    const interval: any = setInterval(() => {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        return clearInterval(interval);
      }

      const particleCount = 30 * (timeLeft / duration);
      
      // Create confetti on both sides
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 }
      });
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 }
      });
    }, 250);
  };

  const viewOrder = () => {
    onClose();
    navigate('/orders');
  };

  const continueShopping = () => {
    onClose();
    navigate('/products');
  };

  const roundUpTotal = (amount: number) => {
    return Math.ceil(amount);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <Dialog open={isOpen} onOpenChange={onClose}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="flex items-center justify-center text-center mb-2">
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  className="w-full flex flex-col items-center"
                >
                  <motion.div
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{
                      type: "spring",
                      stiffness: 300,
                      damping: 20,
                      delay: 0.2
                    }}
                    className="flex justify-center mb-4"
                  >
                    <div className="bg-green-100 dark:bg-green-900/30 rounded-full p-3">
                      <CheckCircle className="h-8 w-8 text-green-600 dark:text-green-400" />
                    </div>
                  </motion.div>
                  <motion.h2
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.3, duration: 0.3 }}
                    className="text-xl font-bold text-center"
                  >
                    Order Confirmed!
                  </motion.h2>
                </motion.div>
              </DialogTitle>
            </DialogHeader>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.3 }}
              className="py-4"
            >
              <div className="text-center mb-6">
                <p className="text-muted-foreground mb-4">
                  Your order has been confirmed and will be shipped soon.
                </p>
                <div className="flex justify-center gap-8 mb-2">
                  <div className="flex flex-col items-center">
                    <Package className="h-5 w-5 text-muted-foreground mb-1" />
                    <span className="text-sm text-muted-foreground">Order ID</span>
                    <span className="font-medium">#{orderDetails?.id.slice(0, 8)}</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <ShoppingBag className="h-5 w-5 text-muted-foreground mb-1" />
                    <span className="text-sm text-muted-foreground">Items</span>
                    <span className="font-medium">{orderDetails?.items}</span>
                  </div>
                </div>
                <motion.div
                  className="mt-6 mb-2"
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.2 }}
                >
                  <p className="text-sm text-muted-foreground">Total Amount</p>
                  <p className="text-3xl font-bold text-primary">
                    ₹{orderDetails ? roundUpTotal(orderDetails.total) : 0}
                  </p>
                </motion.div>
              </div>
            </motion.div>
            
            <DialogFooter className="flex flex-col sm:flex-row gap-2">
              <motion.div
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="w-full sm:w-auto"
              >
                <Button variant="outline" onClick={continueShopping} className="w-full">
                  Continue Shopping
                </Button>
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="w-full sm:w-auto"
              >
                <Button onClick={viewOrder} className="w-full">
                  View Order
                </Button>
              </motion.div>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </AnimatePresence>
  );
}
