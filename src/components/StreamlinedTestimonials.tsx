import { Card, CardContent } from "@/components/ui/card";
import { Quote } from "lucide-react";

const testimonials = [
  {
    quote: "Phototheology changed the way I read Scripture forever. I finally see how everything connects.",
    author: "Sarah M.",
    role: "Bible Study Leader",
  },
  {
    quote: "My Bible study group has never been more engaged. Jeeves is a game-changer.",
    author: "Pastor David L.",
    role: "Church Pastor",
  },
  {
    quote: "I can finally remember what I study. The palace system actually works.",
    author: "Michael T.",
    role: "Seminary Student",
  },
];

export const StreamlinedTestimonials = () => {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-muted/20">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-4xl md:text-5xl font-bold text-center mb-4">
          What Users Are Saying
        </h2>
        <p className="text-xl text-muted-foreground text-center mb-12">
          Real results from real people
        </p>
        
        <div className="grid md:grid-cols-3 gap-6">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="border-2">
              <CardContent className="pt-6">
                <Quote className="h-8 w-8 text-primary mb-4" />
                <p className="text-muted-foreground italic mb-6">
                  "{testimonial.quote}"
                </p>
                <div>
                  <p className="font-semibold">{testimonial.author}</p>
                  <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};
