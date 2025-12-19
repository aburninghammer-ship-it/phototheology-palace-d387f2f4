import { useEffect, useState } from "react";
import { Star } from "lucide-react";

const quickTestimonials = [
  { quote: "Mind blowing!", author: "Theo" },
  { quote: "A game changer", author: "Teddy, Pastor" },
  { quote: "Life changing", author: "Ziyanda" },
  { quote: "Finally connects the whole Bible", author: "Akila" },
];

export const QuickTestimonialBanner = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % quickTestimonials.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex items-center justify-center gap-2 py-2 px-4 bg-primary/10 border-y border-primary/20">
      <div className="flex gap-0.5">
        {[1, 2, 3, 4, 5].map((i) => (
          <Star key={i} className="h-3.5 w-3.5 fill-yellow-500 text-yellow-500" />
        ))}
      </div>
      <p className="text-sm font-medium text-foreground animate-fade-in">
        "{quickTestimonials[currentIndex].quote}" — {quickTestimonials[currentIndex].author}
      </p>
    </div>
  );
};
