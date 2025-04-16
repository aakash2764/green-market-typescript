interface Order {
  id: string;
  user_id: string;
  status: string;
  total_amount: number;
  shipping_address: any;
  payment_method: string;
  created_at: string;
  updated_at: string;
  order_items: OrderItem[];
}

interface OrderItem {
  quantity: number;
  unit_price: number;
  product_id: string;
  products: {
    name: string;
    image_url: string;
  };
}
