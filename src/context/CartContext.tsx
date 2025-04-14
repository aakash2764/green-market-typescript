
import { createContext, useContext, useEffect, useState } from "react";
import { Product } from "@/data/products";
import { toast } from "@/components/ui/use-toast";
import { getCartItems, addToCart, updateCartItemQuantity, removeFromCart, clearCart } from "@/services/supabaseService";
import { useAuth } from "@/context/AuthContext";

interface CartItem {
  id: string;
  quantity: number;
  products: {
    id: string;
    name: string;
    price: number;
    description: string;
    image_url: string;
    category: string;
    stock: number;
  };
}

interface CartContextType {
  cartItems: CartItem[];
  addToCart: (product: Product | (Product & { quantity: number })) => void;
  removeFromCart: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;
  cartTotal: number;
  cartCount: number;
  isLoading: boolean;
  refetchCart: () => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();

  // Fetch cart items when user changes
  useEffect(() => {
    if (user) {
      refetchCart();
    } else {
      setCartItems([]);
    }
  }, [user]);

  const refetchCart = async () => {
    if (!user) return;
    
    try {
      setIsLoading(true);
      const items = await getCartItems();
      setCartItems(items || []);
    } catch (error) {
      console.error("Error fetching cart:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddToCart = async (product: Product | (Product & { quantity: number })) => {
    if (!user) {
      toast({
        title: "Please sign in",
        description: "You need to be logged in to add items to your cart",
        variant: "destructive",
      });
      return;
    }
    
    try {
      setIsLoading(true);
      const quantity = 'quantity' in product ? product.quantity : 1;
      const success = await addToCart(product.id.toString(), quantity);
      
      if (success) {
        await refetchCart();
      }
    } catch (error) {
      console.error("Error adding to cart:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemoveFromCart = async (itemId: string) => {
    try {
      setIsLoading(true);
      const success = await removeFromCart(itemId);
      
      if (success) {
        await refetchCart();
      }
    } catch (error) {
      console.error("Error removing from cart:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateQuantity = async (itemId: string, quantity: number) => {
    if (quantity < 1) return;
    
    try {
      setIsLoading(true);
      const success = await updateCartItemQuantity(itemId, quantity);
      
      if (success) {
        await refetchCart();
      }
    } catch (error) {
      console.error("Error updating cart:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearCart = async () => {
    try {
      setIsLoading(true);
      const success = await clearCart();
      
      if (success) {
        setCartItems([]);
      }
    } catch (error) {
      console.error("Error clearing cart:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const cartTotal = cartItems.reduce(
    (total, item) => total + (item.products?.price || 0) * item.quantity,
    0
  );

  const cartCount = cartItems.reduce(
    (count, item) => count + item.quantity, 
    0
  );

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart: handleAddToCart,
        removeFromCart: handleRemoveFromCart,
        updateQuantity: handleUpdateQuantity,
        clearCart: handleClearCart,
        cartTotal,
        cartCount,
        isLoading,
        refetchCart
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
