import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { PATH_INFO, PathType } from "@/hooks/usePath";
import { useNavigate } from "react-router-dom";
import { ArrowRight } from "lucide-react";

const pathOrder: PathType[] = ["visual", "analytical", "devotional", "warrior"];

export const FourPathsShowcase = () => {
  const navigate = useNavigate();

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-muted/30">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Four Paths. One Palace.
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-6">
            Choose the learning style that fits how your mind works. Each path leads through the same palace—but your journey is uniquely yours.
          </p>
          <div className="bg-primary/10 border border-primary/20 rounded-xl p-6 max-w-3xl mx-auto">
            <h3 className="font-semibold text-lg text-primary mb-2">A 2-Year Mastery Journey</h3>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Each path is a complete <span className="text-foreground font-medium">2-year curriculum</span> designed to take you from beginner to master. 
              You'll ascend all 8 floors of the Palace, unlock every room, and earn your Master title. 
              The path you choose shapes <em>how</em> you learn—through images, analysis, devotion, or action—but every path covers the full Phototheology system.
            </p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          {pathOrder.map((type) => {
            const path = PATH_INFO[type];
            return (
              <Card 
                key={type} 
                className={`${path.bgColor} border ${path.borderColor} hover:scale-[1.02] transition-all duration-300 cursor-pointer group`}
                onClick={() => navigate("/paths")}
              >
                <CardContent className="pt-6 text-center">
                  <div className="text-5xl mb-4">{path.icon}</div>
                  <h3 className="font-bold text-xl mb-2">{path.name}</h3>
                  <p className="text-sm text-muted-foreground mb-4 line-clamp-3">
                    {path.description}
                  </p>
                  <div className="flex flex-wrap justify-center gap-1">
                    {path.strengths.slice(0, 2).map((strength, i) => (
                      <span 
                        key={i} 
                        className="text-xs px-2 py-1 rounded-full bg-background/50"
                      >
                        {strength}
                      </span>
                    ))}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="text-center">
          <Button 
            size="lg" 
            onClick={() => navigate("/paths")}
            className="group"
          >
            Discover Your Path
            <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
          </Button>
        </div>
      </div>
    </section>
  );
};
