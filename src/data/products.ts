
export interface Product {
  id: number;
  name: string;
  price: number;
  description: string;
  image: string;
  category: string;
  featured: boolean;
}

// This will be replaced with API data later
export const products: Product[] = [
  {
    id: 1,
    name: "Eco-Friendly Bamboo Toothbrush",
    price: 4.99,
    description: "Sustainable bamboo toothbrush with soft BPA-free bristles. Biodegradable handle.",
    image: "https://images.unsplash.com/photo-1607613009820-a29f7bb81c04?w=800&auto=format&fit=crop",
    category: "bathroom",
    featured: true
  },
  {
    id: 2,
    name: "Organic Cotton Tote Bag",
    price: 12.99,
    description: "Durable organic cotton tote for shopping. Reduces plastic bag waste.",
    image: "https://images.unsplash.com/photo-1622560480654-d96214fdc887?w=800&auto=format&fit=crop",
    category: "bags",
    featured: true
  },
  {
    id: 3,
    name: "Stainless Steel Water Bottle",
    price: 24.99,
    description: "Double-walled insulated bottle. Keeps drinks cold for 24 hours or hot for 12 hours.",
    image: "https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=800&auto=format&fit=crop",
    category: "kitchen",
    featured: true
  },
  {
    id: 4,
    name: "Beeswax Food Wraps (Set of 3)",
    price: 15.99,
    description: "Reusable food wraps made from organic cotton and beeswax. Alternative to plastic wrap.",
    image: "https://images.unsplash.com/photo-1600857544700-b1b7e4e0d25f?w=800&auto=format&fit=crop",
    category: "kitchen",
    featured: false
  },
  {
    id: 5,
    name: "Bamboo Cutlery Set",
    price: 9.99,
    description: "Portable cutlery set with knife, fork, spoon, and chopsticks in a cotton pouch.",
    image: "https://images.unsplash.com/photo-1584687253988-9288521e5d42?w=800&auto=format&fit=crop",
    category: "kitchen",
    featured: false
  },
  {
    id: 6,
    name: "Compostable Phone Case",
    price: 19.99,
    description: "100% biodegradable phone case made from plant-based materials.",
    image: "https://images.unsplash.com/photo-1618424296452-ac64256ccc16?w=800&auto=format&fit=crop",
    category: "accessories",
    featured: true
  },
  {
    id: 7,
    name: "Recycled Paper Notebook",
    price: 7.99,
    description: "Notebook with 100% recycled paper pages and a seed paper cover that can be planted.",
    image: "https://images.unsplash.com/photo-1531346680769-a1d79b57de5c?w=800&auto=format&fit=crop",
    category: "stationery",
    featured: false
  },
  {
    id: 8,
    name: "Natural Loofah Scrubber",
    price: 3.99,
    description: "Natural bath and kitchen scrubber grown without pesticides.",
    image: "https://images.unsplash.com/photo-1615159802975-0f4e1b42da73?w=800&auto=format&fit=crop",
    category: "bathroom",
    featured: false
  }
];
