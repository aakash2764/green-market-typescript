export interface Product {
  id: number;
  name: string;
  price: number;
  description: string;
  image: string;
  category: string;
  featured?: boolean;
}

export const categories: string[] = [
  "All",
  "Kitchen",
  "Bags",
  "Electronics",
  "Stationery",
  "Bathroom",
  "Accessories"
];

export const products: Product[] = [
  {
    id: 1,
    name: "Bamboo Water Bottle",
    price: 1000,
    category: "Kitchen",
    image: "https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=400",
    description: "Eco-friendly bamboo water bottle with vacuum insulation.",
    featured: true

    
  },
  {
    id: 2,
    name: "Bamboo Cutlery Set",
    price: 2000,
    category: "Kitchen",
    image: "https://images.unsplash.com/photo-1584269600464-37b1b58a9fe7?w=400",
    description: "Portable bamboo cutlery set with carrying case."
    
  },
  {
    id: 3,
    name: "Compostable Plates",
    price: 300,
    category: "Kitchen",
    image: "https://i0.wp.com/naturalpanaa.com/wp-content/uploads/2023/09/biodegradable-cutlery-blog-image-.png?w=777&ssl=1",
    description: "Biodegradable compostable plates for eco-friendly dining."
  },
  {
    id: 4,
    name: "Beeswax Food Wraps",
    price: 600,
    category: "Kitchen",
    image: "https://brownliving.in/cdn/shop/products/1-extra-large-14-x-21-madhu-wrap-reusable-beeswax-food-wrap-uc-120-mw-1xl-ol-food-wraps-737057.jpg?v=1682959708&width=600",
    description: "Reusable beeswax wraps to replace plastic cling film."
  },
  {
    id: 5,
    name: "Stainless Steel Straws",
    price: 500,
    category: "Kitchen",
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSnnFVbYa_-TjOodK5WMtevkTIRRToH1IqkVQ&s",
    description: "Set of 6 stainless steel straws with cleaning brush."
  },
  {
    id: 6,
    name: "Organic Cotton Tote",
    price: 350,
    category: "Bags",
    image: "https://blily.in/wp-content/uploads/2023/05/Organic-Cotton-Tote-Bags-2.jpg",
    description: "100% organic cotton tote bag for your shopping needs. Set of 50.",
    featured: true
  },
  {
    id: 7,
    name: "Reusable Produce Bags",
    price: 250,
    category: "Bags",
    image: "https://5.imimg.com/data5/SELLER/Default/2022/2/OK/NE/NQ/84502696/cotton-mesh-produce-reusable-vegetable-bag-500x500.jpg",
    description: "Set of 5 mesh produce bags for plastic-free shopping."
  },
  {
    id: 8,
    name: "Solar Power Bank",
    price: 4000,
    category: "Electronics",
    image: "https://images-cdn.ubuy.co.in/65b308d99c321e546c32cc4a-solar-power-bank-waterproof-600000mah.jpg",
    description: "10000mAh solar-powered portable charger.",
    featured: true
  },
  {
    id: 9,
    name: "Eco-Friendly Phone Case",
    price: 900,
    category: "Electronics",
    image: "https://www.lovingcase.com/wp-content/uploads/2020/10/compostable-iphone-12-cases-wholesale-04.jpg",
    description: "Sustainable phone case made from plant-based materials.",
    featured: false
  },
  {
    id: 10,
    name: "Eco-Friendly Wireless Mouse",
    price: 2000,
    category: "Electronics",
    image: "https://image.made-in-china.com/202f0j00emOiKCzHlZpT/Eco-Friendly-Recycled-ABS-Bamboo-Wireless-Mouse.webp",
    description: "Wireless mouse made from recycled materials."
  },
  {
    id: 11,
    name: "Recycled Paper Notebook",
    price: 200,
    category: "Stationery",
    image: "https://images.unsplash.com/photo-1531346680769-a1d79b57de5c?w=400",
    description: "100% recycled paper notebook with biodegradable cover."
  },
  {
    id: 12,
    name: "Seed Paper Greeting Cards",
    price: 200,
    category: "Stationery",
    image: "https://www.handmadecharlotte.com/wp-content/uploads/2017/06/plantableseedcard.cover2_.690.jpg",
    description: "Eco-friendly greeting cards that can be planted to grow flowers."
  },
  {
    id: 13,
    name: "Corkboard Planner",
    price: 700,
    category: "Stationery",
    image: "https://encrypted-tbn1.gstatic.com/shopping?q=tbn:ANd9GcRbriJoFBO3cZ5dlHnWAvopgu9wfTJ_E8PV-BxoDrrwHIXeaxS5q5s2g9JoIJKk0t8LacgKLPtnmGq4ORbz8_S50sehkDo1W5xlebAWG2g&usqp=CAE",
    description: "Sustainable corkboard planner for organizing tasks."
  },
  {
    id: 14,
    name: "Wooden Desk Organizer",
    price: 2500,
    category: "Stationery",    
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR0t2cPsFbBBbMfsj-uOD8yga1wkyRQFOed6A&s",
    description: "Eco-friendly wooden desk organizer for your workspace."
  },  
  {
    id: 15,
    name: "Biodegradable Trash Bags",
    price: 500,
    category: "Bags",
    image: "https://image.made-in-china.com/202f0j00VGifUYsIqOkt/Freedom-Living-Biodegradable-Heavy-Duty-Trash-Bag-for-Yard-Kitchen-Lawn-Contractor-or-Office.webp",
    description: "Eco-friendly trash bags that decompose easily."
  },
  {
    id: 16,
    name: "Solar Lantern",
    price: 2600,
    category: "Electronics",
    image: "https://m.media-amazon.com/images/I/71msY8vGtWL._AC_UF1000,1000_QL80_.jpg",
    description: "Portable solar-powered lantern for outdoor adventures."
  },
  {
    id: 17,
    name: "Eco-Friendly Bamboo Toothbrush",
    price: 100,
    category: "Bathroom",
    image: "https://images.unsplash.com/photo-1607613009820-a29f7bb81c04?w=800&auto=format&fit=crop",
    description: "Sustainable bamboo toothbrush with soft BPA-free bristles. Biodegradable handle.",
    featured: true
  },
  {
    id: 18,
    name: "Beeswax Food Wraps (Set of 3)",
    price: 15.99,
    category: "Kitchen",
    image: "https://brownliving.in/cdn/shop/products/starter-set-3-assorted-smlmadhu-wrap-reusable-beeswax-wraps-uc-54-mws30f-food-wraps-brown-living-917733.jpg?v=1699341183",
    description: "Reusable food wraps made from organic cotton and beeswax. Alternative to plastic wrap.",
    featured: false
  },
 
  {
    id: 19,
    name: "Natural Loofah Scrubber",
    price: 3.99,
    category: "Bathroom",
    image: "https://encrypted-tbn1.gstatic.com/shopping?q=tbn:ANd9GcQBg3azYESofD0fBCO3ypGA1SRyHjMPesG3oVlWTKMdR88xjApP8B8lkVHwUywcKv1fFzshEs0oohTsakVpcKtvqbucAzHXyaa4QhGKdqU1mfQNjgpie9XhVIE&usqp=CAE",
    description: "Natural bath and kitchen scrubber grown without pesticides.",
    featured: false
  }
];
