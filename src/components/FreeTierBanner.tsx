import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, Sparkles, ArrowRight, Gift } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

export const FreeTierBanner = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const freeFeatures = [
    { name: "Palace Floor 1 (6 Rooms)", description: "Foundation of visual Bible study" },
    { name: "Daily Devotionals", description: "Fresh content every day" },
    { name: "Jeeves AI (10/day)", description: "AI-powered Bible analysis" },
    { name: "Challenges (3/week)", description: "Practice what you learn" },
    { name: "Community Access", description: "View discussions & insights" },
  ];

  return (
    <section className="py-16 px-4 bg-gradient-to-br from-primary/5 via-background to-accent/5">
      <div className="max-w-4xl mx-auto text-center">
        <Badge variant="secondary" className="mb-4 gap-1">
          <Gift className="h-3 w-3" />
          Free Forever
        </Badge>
        
        <h2 className="text-3xl md:text-4xl font-bold mb-4">
          Start Free. <span className="text-primary">No Credit Card.</span>
        </h2>
        <p className="text-lg text-muted-foreground mb-8">
          Explore the Palace at no cost. No trial countdown. No pressure.
        </p>

        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4 mb-8">
          {freeFeatures.map((feature, index) => (
            <div 
              key={index}
              className="flex items-start gap-3 p-4 rounded-lg bg-card border border-border/50 text-left"
            >
              <Check className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
              <div>
                <span className="text-sm font-medium block">{feature.name}</span>
                <span className="text-xs text-muted-foreground">{feature.description}</span>
              </div>
            </div>
          ))}
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
          <Button
            size="lg"
            onClick={() => navigate(user ? "/palace" : "/auth")}
            className="gradient-palace text-lg px-8 gap-2"
          >
            Get Started Free
            <ArrowRight className="h-5 w-5" />
          </Button>
          
          <Button
            size="lg"
            variant="outline"
            onClick={() => navigate("/pricing")}
            className="gap-2"
          >
            <Sparkles className="h-4 w-4" />
            View Premium Plans
          </Button>
        </div>
        
        <p className="text-sm text-muted-foreground mt-6">
          Love it? Upgrade anytime to unlock all 8 floors, unlimited AI, and premium features.
        </p>
      </div>
    </section>
  );
};
