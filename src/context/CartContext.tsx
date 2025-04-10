
import { createContext, useContext, useEffect, useState } from "react";
import { Product } from "@/data/products";
import { toast } from "@/components/ui/use-toast";
import { products } from "@/data/products";

interface CartItem {
  id: number;
  name: string;
  price: number;
  description: string;
  image: string;
  category: string;
  quantity: number;
  featured?: boolean;
  stock: number;
}

interface CartContextType {
  cartItems: CartItem[];
  addToCart: (product: Product | (Product & { quantity: number })) => void;
  removeFromCart: (productId: number) => void;
  updateQuantity: (productId: number, quantity: number) => void;
  clearCart: () => void;
  cartTotal: number;
  cartCount: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    const savedCart = localStorage.getItem("greenmarket-cart");
    return savedCart ? JSON.parse(savedCart) : [];
  });

  useEffect(() => {
    localStorage.setItem("greenmarket-cart", JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (product: Product | (Product & { quantity: number })) => {
    // Get current product stock
    const currentProduct = products.find(p => p.id === product.id);
    const currentStock = currentProduct?.stock || 0;
    
    setCartItems((prevItems) => {
      const existingItem = prevItems.find((item) => item.id === product.id);
      
      if (existingItem) {
        // Check if adding more would exceed stock
        const newQuantity = 'quantity' in product 
          ? existingItem.quantity + product.quantity
          : existingItem.quantity + 1;
          
        if (newQuantity > currentStock) {
          toast({
            title: "Cannot add more",
            description: `Only ${currentStock} in stock`,
            variant: "destructive"
          });
          return prevItems;
        }
        
        toast({
          title: "Updated cart",
          description: `${product.name} quantity updated`,
        });
        
        return prevItems.map((item) =>
          item.id === product.id ? { ...item, quantity: newQuantity } : item
        );
      }
      
      // Check if adding new item would exceed stock
      const quantityToAdd = 'quantity' in product ? product.quantity : 1;
      if (quantityToAdd > currentStock) {
        toast({
          title: "Cannot add to cart",
          description: `Only ${currentStock} in stock`,
          variant: "destructive"
        });
        return prevItems;
      }
      
      toast({
        title: "Added to cart",
        description: product.name,
      });
      
      return [...prevItems, { 
        ...product, 
        quantity: 'quantity' in product ? product.quantity : 1 
      }];
    });
  };

  const removeFromCart = (productId: number) => {
    setCartItems((prevItems) => {
      const updatedCart = prevItems.filter((item) => item.id !== productId);
      
      toast({
        title: "Removed from cart",
        variant: "destructive",
      });
      
      return updatedCart;
    });
  };

  const updateQuantity = (productId: number, quantity: number) => {
    if (quantity < 1) return;
    
    // Get current product stock
    const currentProduct = products.find(p => p.id === productId);
    if (!currentProduct) return;
    
    // Make sure quantity doesn't exceed stock
    if (quantity > currentProduct.stock) {
      toast({
        title: "Cannot add more",
        description: `Only ${currentProduct.stock} in stock`,
        variant: "destructive"
      });
      return;
    }
    
    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item.id === productId ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => {
    setCartItems([]);
    toast({
      title: "Cart cleared",
      variant: "destructive",
    });
  };

  const cartTotal = cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  const cartCount = cartItems.reduce((count, item) => count + item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        cartTotal,
        cartCount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};
