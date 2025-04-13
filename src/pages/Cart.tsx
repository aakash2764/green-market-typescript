
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "@/context/CartContext";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { 
  Card, 
  CardContent,
  CardHeader,
  CardTitle 
} from "@/components/ui/card";
import { 
  Trash2, 
  ShoppingBag, 
  Plus, 
  Minus,
  CreditCard,
  QrCode,
  Home,
  Check
} from "lucide-react";
import { products } from "@/data/products";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

export default function Cart() {
  const { cartItems, removeFromCart, updateQuantity, clearCart, cartTotal } = useCart();
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("cod");
  const [showQRCode, setShowQRCode] = useState(false);
  const [showCardForm, setShowCardForm] = useState(false);
  const navigate = useNavigate();
  
  const handlePaymentMethodChange = (value: string) => {
    setPaymentMethod(value);
  };
  
  const handleCheckout = () => {
    // Validate payment method
    if (!paymentMethod) {
      toast({
        title: "Please select a payment method",
        variant: "destructive",
      });
      return;
    }
    
    setIsProcessing(true);
    
    // Process based on payment method
    if (paymentMethod === "upi") {
      setShowQRCode(true);
      setIsProcessing(false);
    } else if (paymentMethod === "card") {
      setShowCardForm(true);
      setIsProcessing(false);
    } else {
      // COD or other methods
      // This would connect to a backend in a real app
      setTimeout(() => {
        setIsProcessing(false);
        toast({
          title: "Order Placed Successfully!",
          description: "Your order will be delivered soon.",
        });
        
        // Generate order info for confirmation page
        const orderId = Math.random().toString(36).substring(2, 10).toUpperCase();
        const orderDate = new Date().toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        });
        
        // Clear cart and navigate to confirmation
        clearCart();
        navigate('/order-confirmation', {
          state: {
            order: {
              id: orderId,
              total: cartTotal,
              items: cartItems.reduce((total, item) => total + item.quantity, 0),
              date: orderDate
            }
          }
        });
      }, 1500);
    }
  };

  const submitCardPayment = (e: React.FormEvent) => {
    e.preventDefault();
    setShowCardForm(false);
    setIsProcessing(true);
    
    setTimeout(() => {
      setIsProcessing(false);
      
      // Generate order info for confirmation page
      const orderId = Math.random().toString(36).substring(2, 10).toUpperCase();
      const orderDate = new Date().toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
      
      toast({
        title: "Payment Successful!",
        description: "Your order will be delivered soon.",
      });
      
      // Clear cart and navigate to confirmation
      clearCart();
      navigate('/order-confirmation', {
        state: {
          order: {
            id: orderId,
            total: cartTotal,
            items: cartItems.reduce((total, item) => total + item.quantity, 0),
            date: orderDate
          }
        }
      });
    }, 1500);
  };

  const confirmUpiPayment = () => {
    setShowQRCode(false);
    setIsProcessing(true);
    
    setTimeout(() => {
      setIsProcessing(false);
      
      // Generate order info for confirmation page
      const orderId = Math.random().toString(36).substring(2, 10).toUpperCase();
      const orderDate = new Date().toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
      
      toast({
        title: "UPI Payment Confirmed!",
        description: "Your order will be delivered soon.",
      });
      
      // Clear cart and navigate to confirmation
      clearCart();
      navigate('/order-confirmation', {
        state: {
          order: {
            id: orderId,
            total: cartTotal,
            items: cartItems.reduce((total, item) => total + item.quantity, 0),
            date: orderDate
          }
        }
      });
    }, 1500);
  };
  
  if (cartItems.length === 0) {
    return (
      <div className="container-custom py-24 flex flex-col items-center text-center">
        <ShoppingBag className="h-16 w-16 text-muted-foreground mb-4" />
        <h1 className="text-2xl font-bold mb-2">Your cart is empty</h1>
        <p className="text-muted-foreground mb-8">
          Looks like you haven't added any products to your cart yet.
        </p>
        <Button asChild>
          <Link to="/products">Continue Shopping</Link>
        </Button>
      </div>
    );
  }
  
  return (
    <div className="container-custom py-12">
      <h1 className="text-3xl font-bold mb-8">Your Cart</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="space-y-4">
            {cartItems.map((item) => (
              <Card key={item.id} className="overflow-hidden">
                <CardContent className="p-0">
                  <div className="flex flex-col sm:flex-row">
                    <div className="w-full sm:w-32 h-32 bg-muted">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="p-4 flex-grow flex flex-col">
                      <div className="flex justify-between">
                        <Link to={`/products/${item.id}`} className="font-medium hover:text-primary transition-colors">
                          {item.name}
                        </Link>
                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="text-muted-foreground hover:text-destructive transition-colors"
                        >
                          <Trash2 className="h-5 w-5" />
                          <span className="sr-only">Remove</span>
                        </button>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">₹{item.price.toFixed(2)}</p>
                      <div className="flex justify-between items-center mt-auto">
                        <div className="flex items-center border border-border rounded-md">
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            disabled={item.quantity <= 1}
                            className="px-2 py-1 text-muted-foreground hover:text-foreground disabled:opacity-50"
                          >
                            <Minus className="h-4 w-4" />
                            <span className="sr-only">Decrease</span>
                          </button>
                          <span className="w-8 text-center">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            disabled={item.quantity >= getItemStock(item.id)}
                            className="px-2 py-1 text-muted-foreground hover:text-foreground disabled:opacity-50"
                          >
                            <Plus className="h-4 w-4" />
                            <span className="sr-only">Increase</span>
                          </button>
                        </div>
                        <p className="font-medium">₹{(item.price * item.quantity).toFixed(2)}</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          
          <div className="flex justify-between mt-6">
            <Button 
              variant="outline" 
              asChild
            >
              <Link to="/products">Continue Shopping</Link>
            </Button>
            <Button 
              variant="outline" 
              onClick={clearCart}
            >
              Clear Cart
            </Button>
          </div>
        </div>
        
        <div>
          <Card>
            <CardContent className="pt-6">
              <h2 className="text-lg font-bold mb-4">Order Summary</h2>
              
              <div className="space-y-2 mb-4">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>₹{cartTotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Shipping</span>
                  <span>Free</span>
                </div>
              </div>
              
              <Separator className="my-4" />
              
              <div className="flex justify-between font-bold mb-6">
                <span>Total</span>
                <span>₹{cartTotal.toFixed(2)}</span>
              </div>
              
              <div className="mb-6">
                <h3 className="text-sm font-medium mb-3">Payment Method</h3>
                <RadioGroup 
                  defaultValue="cod" 
                  value={paymentMethod}
                  onValueChange={handlePaymentMethodChange}
                  className="gap-3"
                >
                  <div className="flex items-center space-x-2 border rounded-md p-3 hover:bg-muted/50 transition-colors">
                    <RadioGroupItem value="cod" id="cod" />
                    <Label htmlFor="cod" className="flex items-center gap-2 cursor-pointer">
                      <Home className="h-4 w-4" />
                      Pay on Delivery (Cash/UPI)
                    </Label>
                  </div>
                  
                  <div className="flex items-center space-x-2 border rounded-md p-3 hover:bg-muted/50 transition-colors">
                    <RadioGroupItem value="upi" id="upi" />
                    <Label htmlFor="upi" className="flex items-center gap-2 cursor-pointer">
                      <QrCode className="h-4 w-4" />
                      UPI / QR Code
                    </Label>
                  </div>
                  
                  <div className="flex items-center space-x-2 border rounded-md p-3 hover:bg-muted/50 transition-colors">
                    <RadioGroupItem value="card" id="card" />
                    <Label htmlFor="card" className="flex items-center gap-2 cursor-pointer">
                      <CreditCard className="h-4 w-4" />
                      Credit / Debit Card
                    </Label>
                  </div>
                </RadioGroup>
              </div>
              
              <Button 
                onClick={handleCheckout}
                disabled={isProcessing}
                className="w-full"
              >
                {isProcessing ? (
                  "Processing..."
                ) : (
                  <>
                    {paymentMethod === "card" ? (
                      <CreditCard className="mr-2 h-4 w-4" />
                    ) : paymentMethod === "upi" ? (
                      <QrCode className="mr-2 h-4 w-4" />
                    ) : (
                      <Home className="mr-2 h-4 w-4" />
                    )}
                    Place Order
                  </>
                )}
              </Button>
              
              <p className="text-xs text-muted-foreground text-center mt-4">
                Secure payment processing. All information is encrypted.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
      
      {/* UPI QR Code Dialog */}
      <Dialog open={showQRCode} onOpenChange={setShowQRCode}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Scan QR Code to Pay</DialogTitle>
            <DialogDescription>
              Use any UPI app to scan and complete your payment
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col items-center space-y-4">
            <div className="bg-white p-4 rounded-lg">
              <QrCode className="h-48 w-48" />
            </div>
            <p className="text-center">
              Scan this QR code with any UPI app to pay ₹{cartTotal.toFixed(2)}
            </p>
            <p className="text-sm text-muted-foreground">
              UPI ID: greenmarket@ybl
            </p>
            <Button onClick={confirmUpiPayment} className="w-full">
              <Check className="mr-2 h-4 w-4" /> I've Completed the Payment
            </Button>
          </div>
        </DialogContent>
      </Dialog>
      
      {/* Card Payment Dialog */}
      <Dialog open={showCardForm} onOpenChange={setShowCardForm}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Card Payment</DialogTitle>
            <DialogDescription>
              Enter your card details to complete the payment
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={submitCardPayment} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="cardNumber">Card Number</Label>
              <Input id="cardNumber" placeholder="1234 5678 9012 3456" required maxLength={19} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="expiry">Expiry Date</Label>
                <Input id="expiry" placeholder="MM/YY" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="cvv">CVV</Label>
                <Input id="cvv" placeholder="123" required maxLength={3} />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="name">Cardholder Name</Label>
              <Input id="name" placeholder="John Doe" required />
            </div>
            <Button type="submit" className="w-full">
              Pay ₹{cartTotal.toFixed(2)}
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
  
  // Helper function to get current stock for an item
  function getItemStock(productId: number) {
    const product = cartItems.find(item => item.id === productId);
    if (!product) return 0;
    
    const currentProduct = products.find(p => p.id === productId);
    return currentProduct?.stock || 0;
  }
}
