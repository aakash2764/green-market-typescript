
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";

// Fetch all products
export async function fetchProducts() {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .order('name');
    
  if (error) {
    console.error('Error fetching products:', error);
    toast({
      title: "Error fetching products",
      description: error.message,
      variant: "destructive",
    });
    return [];
  }
  
  return data;
}

// Fetch featured products
export async function fetchFeaturedProducts() {
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("featured", true)
    .order("name");

  if (error) {
    console.error("Error fetching featured products:", error.message);
    return [];
  }

  return data;
}

// Fetch a single product by ID
export async function fetchProductById(id: string) {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('id', id)
    .single();
    
  if (error) {
    console.error('Error fetching product:', error);
    toast({
      title: "Error fetching product",
      description: error.message,
      variant: "destructive",
    });
    return null;
  }
  
  return data;
}

// Get or create user cart
export async function getUserCart() {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    throw new Error('You must be logged in to access cart');
  }
  
  // Find user's cart
  const { data: cart, error: cartError } = await supabase
    .from('carts')
    .select('*')
    .eq('user_id', user.id)
    .single();
    
  if (cartError && cartError.code !== 'PGRST116') {
    console.error('Error fetching cart:', cartError);
    toast({
      title: "Error fetching cart",
      description: cartError.message,
      variant: "destructive",
    });
    return null;
  }
  
  // If cart doesn't exist, create one
  if (!cart) {
    const { data: newCart, error: createError } = await supabase
      .from('carts')
      .insert({ user_id: user.id })
      .select()
      .single();
      
    if (createError) {
      console.error('Error creating cart:', createError);
      toast({
        title: "Error creating cart",
        description: createError.message,
        variant: "destructive",
      });
      return null;
    }
    
    return newCart;
  }
  
  return cart;
}

// Fetch cart items with product details
export async function getCartItems() {
  const cart = await getUserCart();
  
  if (!cart) {
    return [];
  }
  
  const { data, error } = await supabase
    .from('cart_items')
    .select(`
      id,
      quantity,
      products (
        id,
        name,
        price,
        description,
        image_url,
        category,
        stock
      )
    `)
    .eq('cart_id', cart.id);
    
  if (error) {
    console.error('Error fetching cart items:', error);
    toast({
      title: "Error fetching cart items",
      description: error.message,
      variant: "destructive",
    });
    return [];
  }
  
  return data;
}

// Add item to cart
export async function addToCart(productId: string, quantity: number = 1) {
  const cart = await getUserCart();
  
  if (!cart) {
    return false;
  }
  
  // Check if product exists
  const { data: product, error: productError } = await supabase
    .from('products')
    .select('id, name, stock')
    .eq('id', productId)
    .single();
    
  if (productError || !product) {
    console.error('Error fetching product:', productError);
    toast({
      title: "Error adding to cart",
      description: "Product not found",
      variant: "destructive",
    });
    return false;
  }
  
  // Check if product is in stock
  if (product.stock < quantity) {
    toast({
      title: "Cannot add to cart",
      description: `Only ${product.stock} available in stock`,
      variant: "destructive",
    });
    return false;
  }
  
  // Check if item is already in cart
  const { data: existingItem, error: existingError } = await supabase
    .from('cart_items')
    .select('id, quantity')
    .eq('cart_id', cart.id)
    .eq('product_id', productId)
    .maybeSingle();
    
  if (existingError) {
    console.error('Error checking cart item:', existingError);
    toast({
      title: "Error adding to cart",
      description: existingError.message,
      variant: "destructive",
    });
    return false;
  }
  
  if (existingItem) {
    // Update quantity of existing item
    const newQuantity = existingItem.quantity + quantity;
    
    // Check if new quantity exceeds stock
    if (newQuantity > product.stock) {
      toast({
        title: "Cannot add more",
        description: `Only ${product.stock} in stock`,
        variant: "destructive",
      });
      return false;
    }
    
    const { error: updateError } = await supabase
      .from('cart_items')
      .update({ quantity: newQuantity })
      .eq('id', existingItem.id);
      
    if (updateError) {
      console.error('Error updating cart item:', updateError);
      toast({
        title: "Error updating cart",
        description: updateError.message,
        variant: "destructive",
      });
      return false;
    }
    
    toast({
      title: "Updated cart",
      description: `${product.name} quantity updated`,
    });
  } else {
    // Add new item to cart
    const { error: insertError } = await supabase
      .from('cart_items')
      .insert({
        cart_id: cart.id,
        product_id: productId,
        quantity: quantity
      });
      
    if (insertError) {
      console.error('Error adding cart item:', insertError);
      toast({
        title: "Error adding to cart",
        description: insertError.message,
        variant: "destructive",
      });
      return false;
    }
    
    toast({
      title: "Added to cart",
      description: product.name,
    });
  }
  
  return true;
}

// Update cart item quantity
export async function updateCartItemQuantity(itemId: string, quantity: number) {
  if (quantity < 1) {
    return false;
  }
  
  // Get product information first to check stock
  const { data: cartItem, error: cartItemError } = await supabase
    .from('cart_items')
    .select(`
      id,
      product_id,
      products (
        id,
        stock,
        name
      )
    `)
    .eq('id', itemId)
    .single();
  
  if (cartItemError || !cartItem) {
    console.error('Error fetching cart item:', cartItemError);
    toast({
      title: "Error updating item",
      description: "Item not found",
      variant: "destructive",
    });
    return false;
  }
  
  // Check if quantity exceeds stock
  if (quantity > cartItem.products.stock) {
    toast({
      title: "Cannot add more",
      description: `Only ${cartItem.products.stock} in stock`,
      variant: "destructive",
    });
    return false;
  }
  
  // Update quantity
  const { error: updateError } = await supabase
    .from('cart_items')
    .update({ quantity })
    .eq('id', itemId);
    
  if (updateError) {
    console.error('Error updating cart item:', updateError);
    toast({
      title: "Error updating cart",
      description: updateError.message,
      variant: "destructive",
    });
    return false;
  }
  
  return true;
}

// Remove item from cart
export async function removeFromCart(itemId: string) {
  const { error } = await supabase
    .from('cart_items')
    .delete()
    .eq('id', itemId);
    
  if (error) {
    console.error('Error removing cart item:', error);
    toast({
      title: "Error removing item",
      description: error.message,
      variant: "destructive",
    });
    return false;
  }
  
  toast({
    title: "Removed from cart",
    variant: "destructive",
  });
  
  return true;
}

// Clear cart
export async function clearCart() {
  const cart = await getUserCart();
  
  if (!cart) {
    return false;
  }
  
  const { error } = await supabase
    .from('cart_items')
    .delete()
    .eq('cart_id', cart.id);
    
  if (error) {
    console.error('Error clearing cart:', error);
    toast({
      title: "Error clearing cart",
      description: error.message,
      variant: "destructive",
    });
    return false;
  }
  
  toast({
    title: "Cart cleared",
    variant: "destructive",
  });
  
  return true;
}

// Create order from cart
export async function createOrder(shippingAddress: any) {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    throw new Error('You must be logged in to create an order');
  }
  
  // Get cart items
  const cartItems = await getCartItems();
  
  if (!cartItems || cartItems.length === 0) {
    toast({
      title: "Cannot create order",
      description: "Your cart is empty",
      variant: "destructive",
    });
    return null;
  }
  
  // Calculate total amount
  const totalAmount = cartItems.reduce((total, item) => {
    const price = item.products?.price || 0;
    return total + (price * item.quantity);
  }, 0);
  
  // Create order
  const { data: order, error: orderError } = await supabase
    .from('orders')
    .insert({
      user_id: user.id,
      total_amount: totalAmount,
      shipping_address: shippingAddress
    })
    .select()
    .single();
    
  if (orderError) {
    console.error('Error creating order:', orderError);
    toast({
      title: "Error creating order",
      description: orderError.message,
      variant: "destructive",
    });
    return null;
  }
  
  // Add order items
  const orderItems = cartItems.map(item => ({
    order_id: order.id,
    product_id: item.products.id,
    quantity: item.quantity,
    unit_price: item.products.price
  }));
  
  const { error: itemsError } = await supabase
    .from('order_items')
    .insert(orderItems);
    
  if (itemsError) {
    console.error('Error adding order items:', itemsError);
    // Try to clean up the order
    await supabase.from('orders').delete().eq('id', order.id);
    
    toast({
      title: "Error creating order",
      description: itemsError.message,
      variant: "destructive",
    });
    return null;
  }
  
  // Clear the cart
  await clearCart();
  
  toast({
    title: "Order placed successfully",
    description: "Thank you for your purchase!"
  });
  
  return order;
}

// Get user's orders
export async function getUserOrders() {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    throw new Error('You must be logged in to view orders');
  }
  
  const { data, error } = await supabase
    .from('orders')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });
    
  if (error) {
    console.error('Error fetching orders:', error);
    toast({
      title: "Error fetching orders",
      description: error.message,
      variant: "destructive",
    });
    return [];
  }
  
  return data;
}

// Get order details
export async function getOrderDetails(orderId: string) {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    throw new Error('You must be logged in to view order details');
  }
  
  // Get order
  const { data: order, error: orderError } = await supabase
    .from('orders')
    .select('*')
    .eq('id', orderId)
    .eq('user_id', user.id)
    .single();
    
  if (orderError) {
    console.error('Error fetching order:', orderError);
    toast({
      title: "Error fetching order",
      description: orderError.message,
      variant: "destructive",
    });
    return null;
  }
  
  // Get order items
  const { data: items, error: itemsError } = await supabase
    .from('order_items')
    .select(`
      id,
      quantity,
      unit_price,
      products (
        id,
        name,
        description,
        image_url,
        category
      )
    `)
    .eq('order_id', orderId);
    
  if (itemsError) {
    console.error('Error fetching order items:', itemsError);
    toast({
      title: "Error fetching order items",
      description: itemsError.message,
      variant: "destructive",
    });
    return null;
  }
  
  return {
    ...order,
    items
  };
}

// Get user profile
export async function getUserProfile() {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    return null;
  }
  
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();
    
  if (error) {
    console.error('Error fetching profile:', error);
    toast({
      title: "Error fetching profile",
      description: error.message,
      variant: "destructive",
    });
    return null;
  }
  
  return data;
}

// Update user profile
export async function updateUserProfile(profile: any) {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    throw new Error('You must be logged in to update profile');
  }
  
  const { data, error } = await supabase
    .from('profiles')
    .update(profile)
    .eq('id', user.id)
    .select()
    .single();
    
  if (error) {
    console.error('Error updating profile:', error);
    toast({
      title: "Error updating profile",
      description: error.message,
      variant: "destructive",
    });
    return null;
  }
  
  toast({
    title: "Profile updated",
    description: "Your profile has been updated successfully",
  });
  
  return data;
}

export async function fetchUserOrders(userId: string) {
  const { data, error } = await supabase
    .from('orders')
    .select(`
      *,
      order_items (
        *,
        product:products (*)
      )
    `)
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching orders:', error);
    throw error;
  }

  return data;
}
