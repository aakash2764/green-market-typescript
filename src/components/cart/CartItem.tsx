
import { Button } from "@/components/ui/button";
import { Minus, Plus, Package, Trash2 } from "lucide-react";
import { motion } from "framer-motion";
import { itemVariants, buttonVariants } from "@/lib/animations";

interface CartItemProps {
  item: {
    id: string;
    quantity: number;
    products: {
      name: string;
      price: number;
      image_url: string;
    }
  };
  index: number;
  updateQuantity: (itemId: string, quantity: number) => void;
  removeFromCart: (itemId: string) => void;
}

export function CartItem({ item, index, updateQuantity, removeFromCart }: CartItemProps) {
  return (
    <motion.div
      key={`${item.id}-${index}`}
      className="flex items-center p-4 gap-4"
      variants={itemVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      custom={index}
      whileHover={{ backgroundColor: "rgba(0,0,0,0.02)" }}
    >
      <div className="relative w-16 h-16 bg-muted rounded overflow-hidden flex-shrink-0">
        {item.products.image_url ? (
          <motion.img
            src={item.products.image_url}
            alt={item.products.name}
            className="w-full h-full object-cover"
            whileHover={{ scale: 1.1 }}
          />
        ) : (
          <Package className="w-8 h-8 absolute inset-0 m-auto text-muted-foreground" />
        )}
      </div>
      
      <div className="flex-1">
        <h3 className="font-medium">{item.products.name}</h3>
        <p className="text-sm text-muted-foreground">
          ₹{item.products.price.toFixed(2)} each
        </p>
      </div>
      
      <div className="flex items-center gap-3">
        <motion.div
          whileHover="hover"
          whileTap="tap"
          variants={buttonVariants}
        >
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8"
            onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
          >
            <Minus className="h-3 w-3" />
          </Button>
        </motion.div>
        
        <span className="w-6 text-center">{item.quantity}</span>
        
        <motion.div
          whileHover="hover"
          whileTap="tap"
          variants={buttonVariants}
        >
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8"
            onClick={() => updateQuantity(item.id, item.quantity + 1)}
          >
            <Plus className="h-3 w-3" />
          </Button>
        </motion.div>
      </div>
      
      <div className="text-right">
        <p className="font-medium">
          ₹{(item.products.price * item.quantity).toFixed(2)}
        </p>
        <motion.div
          whileHover="hover"
          whileTap="tap"
          variants={buttonVariants}
        >
          <Button
            variant="ghost"
            size="sm"
            onClick={() => removeFromCart(item.id)}
            className="h-8 px-2 text-destructive hover:text-destructive hover:bg-destructive/10"
          >
            <Trash2 className="h-3.5 w-3.5 mr-1" />
            Remove
          </Button>
        </motion.div>
      </div>
    </motion.div>
  );
}
