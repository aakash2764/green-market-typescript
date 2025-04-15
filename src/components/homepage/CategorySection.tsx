
import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";

const categories = [
  {
    name: "Kitchen",
    image: "https://images.unsplash.com/photo-1556911220-bff31c812dba?q=80&w=500",
    link: "/products?category=kitchen"
  },
  {
    name: "Electronics",
    image: "https://images.unsplash.com/photo-1526738549149-8e07eca6c147?q=80&w=500",
    link: "/products?category=electronics"
  },
  {
    name: "Stationery",
    image: "https://media.istockphoto.com/id/1298288303/photo/table-with-various-colorful-stationery.jpg?s=612x612&w=0&k=20&c=uPhbYaIFwt_3g0QYehBLvRSHO0iqpSrXHNt35EBfOnQ=",
    link: "/products?category=stationery"
  },
  {
    name: "Bags",
    image: "https://immago.com/wp-content/uploads/2024/12/Eco-garment-bags-with-green-background-SM.jpg",
    link: "/products?category=bags"
  },
  {
    name: "Bathroom",
    image: "https://images.unsplash.com/photo-1620626011761-996317b8d101?q=80&w=500",
    link: "/products?category=bathroom"
  }
];

export function CategorySection() {
  return (
    <section className="py-16 container-custom">
      <h2 className="text-3xl font-bold text-center mb-12">Shop by Category</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((category) => (
          <Link key={category.name} to={category.link}>
            <Card className="overflow-hidden hover:shadow-lg transition-shadow">
              <CardContent className="p-0">
                <div className="aspect-[4/3] relative group">
                  <img
                    src={category.image}
                    alt={category.name}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                    <h3 className="text-white text-2xl font-bold">{category.name}</h3>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </section>
  );
}
