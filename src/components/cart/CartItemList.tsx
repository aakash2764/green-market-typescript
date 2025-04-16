
import { CartItem } from "./CartItem";
import { motion } from "framer-motion";
import { itemVariants } from "@/lib/animations";

interface CartItemListProps {
  cartItems: {
    id: string;
    quantity: number;
    products: {
      name: string;
      price: number;
      image_url: string;
    }
  }[];
  updateQuantity: (itemId: string, quantity: number) => void;
  removeFromCart: (itemId: string) => void;
}

export function CartItemList({ cartItems, updateQuantity, removeFromCart }: CartItemListProps) {
  return (
    <motion.div 
      className="lg:col-span-2 space-y-4"
      variants={itemVariants}
    >
      <div className="bg-card rounded-lg border overflow-hidden">
        <div className="p-4 border-b">
          <h2 className="text-xl font-semibold">Cart Items</h2>
        </div>
        <div className="divide-y">
          {cartItems.map((item, index) => (
            <CartItem 
              key={item.id} 
              item={item} 
              index={index}
              updateQuantity={updateQuantity}
              removeFromCart={removeFromCart}
            />
          ))}
        </div>
      </div>
    </motion.div>
  );
}
