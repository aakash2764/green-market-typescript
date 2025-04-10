
import { useEffect } from "react";

export default function About() {
  useEffect(() => {
    // Scroll to top when component mounts
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="container-custom py-12">
      <h1 className="text-3xl font-bold mb-8">About Green Market</h1>
      
      <div className="bg-green-50 dark:bg-green-900/20 p-8 rounded-lg mb-8">
        <h2 className="text-2xl font-semibold mb-4">Our Mission</h2>
        <p className="mb-4">
          At Green Market, we're committed to providing eco-friendly, sustainable products 
          that help reduce waste and minimize environmental impact. Our mission is to make 
          sustainable living accessible and affordable for everyone.
        </p>
        <p>
          We carefully select products that are made from sustainable materials, produced 
          ethically, and designed to replace single-use items in your daily life.
        </p>
      </div>
      
      <div className="grid md:grid-cols-2 gap-12">
        <div>
          <h2 className="text-2xl font-semibold mb-4">Our Story</h2>
          <p className="mb-4">
            Green Market was founded in 2020 by a group of environmental enthusiasts who 
            were frustrated by the lack of accessible sustainable products in the market.
          </p>
          <p className="mb-4">
            What started as a small online store has grown into a community of like-minded 
            individuals committed to reducing waste and living more sustainably.
          </p>
          <p>
            Today, we offer a wide range of products across different categories, from kitchen 
            and bathroom essentials to electronics and stationery, all designed with sustainability in mind.
          </p>
        </div>
        
        <div>
          <h2 className="text-2xl font-semibold mb-4">Our Values</h2>
          <ul className="space-y-4">
            <li className="p-4 bg-green-100 dark:bg-green-900/30 rounded-lg">
              <h3 className="font-medium mb-1">Sustainability</h3>
              <p>We prioritize products made from sustainable materials that have minimal environmental impact.</p>
            </li>
            <li className="p-4 bg-green-100 dark:bg-green-900/30 rounded-lg">
              <h3 className="font-medium mb-1">Transparency</h3>
              <p>We're honest about our products and their environmental impact, providing clear information about materials and manufacturing processes.</p>
            </li>
            <li className="p-4 bg-green-100 dark:bg-green-900/30 rounded-lg">
              <h3 className="font-medium mb-1">Community</h3>
              <p>We believe in building a community of environmentally conscious consumers and providing resources for sustainable living.</p>
            </li>
          </ul>
        </div>
      </div>
      
      <div className="mt-12 p-8 bg-green-50 dark:bg-green-900/20 rounded-lg">
        <h2 className="text-2xl font-semibold mb-4">Join Us</h2>
        <p className="mb-4">
          Whether you're just starting your sustainability journey or you're looking to 
          further reduce your environmental footprint, we invite you to join our community.
        </p>
        <p>
          Browse our products, join our newsletter, and follow us on social media for tips 
          on sustainable living and updates on new products.
        </p>
      </div>
    </div>
  );
}
