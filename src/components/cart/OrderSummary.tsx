
import { useState } from "react";
import { Link } from "react-router-dom";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Loader2, ArrowLeft, AlertCircle } from "lucide-react";
import { motion } from "framer-motion";
import { itemVariants, buttonVariants } from "@/lib/animations";

interface OrderSummaryProps {
  cartTotal: number;
  isProcessing: boolean;
  checkoutError: string | null;
  shippingInfo: string;
  setShippingInfo: (info: string) => void;
  handleCheckout: () => void;
}

export function OrderSummary({
  cartTotal,
  isProcessing,
  checkoutError,
  shippingInfo,
  setShippingInfo,
  handleCheckout,
}: OrderSummaryProps) {
  // Round up total to nearest integer
  const roundUpTotal = (amount: number) => {
    return Math.ceil(amount);
  };

  return (
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
  );
}
