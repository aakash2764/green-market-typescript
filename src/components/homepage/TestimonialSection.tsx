
import { Card, CardContent } from "@/components/ui/card";

const testimonials = [
  {
    id: 1,
    name: "Sarah Johnson",
    role: "Eco Enthusiast",
    content: "I've been searching for sustainable alternatives to everyday items, and Green Market has become my go-to store. The quality of their products is exceptional, and I love knowing I'm making better choices for our planet.",
    avatar: "https://i.pravatar.cc/150?img=32"
  },
  {
    id: 2,
    name: "Michael Chen",
    role: "Zero Waste Advocate",
    content: "The bamboo toothbrushes and reusable food wraps have helped me significantly reduce my plastic waste. Green Market offers practical solutions without compromising on quality or style.",
    avatar: "https://i.pravatar.cc/150?img=69"
  },
  {
    id: 3,
    name: "Emily Rodriguez",
    role: "Conscious Consumer",
    content: "What I appreciate most about Green Market is their transparency about materials and production methods. It makes it easy to make informed choices about the products I bring into my home.",
    avatar: "https://i.pravatar.cc/150?img=47"
  }
];

export function TestimonialSection() {
  return (
    <section className="py-16 gradient-testimonial">
      <div className="container-custom">
        <h2 className="text-3xl font-bold mb-4 text-center text-gradient">What Our Customers Say</h2>
        <p className="text-muted-foreground mb-12 text-center max-w-3xl mx-auto">
          Join thousands of customers who are making the switch to sustainable living with our eco-friendly products.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((testimonial, index) => (
            <Card 
              key={testimonial.id} 
              className="border-border gradient-card hover-lift animate-fade-in"
              style={{ animationDelay: `${index * 150}ms` }}
            >
              <CardContent className="pt-6">
                <div className="flex flex-col items-center text-center">
                  <div className="p-1 rounded-full bg-gradient-to-r from-green-400 to-earth-400 mb-4">
                    <img
                      src={testimonial.avatar}
                      alt={testimonial.name}
                      className="w-16 h-16 rounded-full border-2 border-white"
                    />
                  </div>
                  <p className="text-foreground mb-4 italic">"{testimonial.content}"</p>
                  <div>
                    <h4 className="font-medium">{testimonial.name}</h4>
                    <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
