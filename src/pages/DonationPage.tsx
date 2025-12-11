import { useState } from "react";
import { Heart, Zap, Globe, BookOpen, Users, Headphones, Shield, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

const PRESET_AMOUNTS = [5, 25, 50, 100, 250, 500];

const IMPACT_ITEMS = [
  { icon: BookOpen, text: "Add more advanced commentary capabilities" },
  { icon: Zap, text: "Expand the Phototheology Palace with new rooms, tools, and learning paths" },
  { icon: Shield, text: "Improve system speed and stability" },
  { icon: Headphones, text: "Integrate better audio, music, and multilingual features" },
  { icon: Users, text: "Build discipleship courses and ministry labs directly into the app" },
  { icon: Heart, text: "Provide scholarships for those who cannot afford subscriptions" },
  { icon: Globe, text: "Keep app access as affordable as possible for everyone" },
];

export default function DonationPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [selectedAmount, setSelectedAmount] = useState<number | null>(50);
  const [customAmount, setCustomAmount] = useState("");
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleDonate = async () => {
    const amount = selectedAmount || Number(customAmount);
    
    if (!amount || amount < 1) {
      toast.error("Please select or enter a valid amount");
      return;
    }

    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("create-donation", {
        body: { email: user?.email, amount },
      });

      if (error) throw error;

      if (data?.url) {
        window.open(data.url, "_blank");
      }
    } catch (error) {
      console.error("Donation error:", error);
      toast.error("Failed to start donation. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-gradient-to-br from-primary/10 via-primary/5 to-background py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <Button 
            variant="ghost" 
            onClick={() => navigate(-1)}
            className="mb-6"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
          
          <div className="text-center">
            <Heart className="h-16 w-16 text-primary mx-auto mb-6 animate-pulse" />
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
              Donations: Fuel the Mission.
            </h1>
            <p className="text-2xl md:text-3xl text-primary font-semibold">
              Expand the Vision.
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="prose prose-lg dark:prose-invert max-w-none">
          <p className="text-lg text-muted-foreground leading-relaxed">
            Phototheology is only at the beginning of what it can become. What you see today—Jeeves' commentary engine, the Palace system, ReadMe the Bible, devotionals, drills, and study tools—is just the foundation. There is far more we are ready to build: deeper AI-assisted learning, expanded commentary libraries, advanced gamification, multi-user study rooms, session memory, audio narration upgrades, faster servers, and full ecosystem integrations across every device.
          </p>

          <Card className="my-8 border-primary/20 bg-primary/5">
            <CardContent className="p-6">
              <p className="text-foreground font-medium text-center text-lg">
                But building and maintaining an app of this scale is expensive.
                <br />
                Every improvement requires developer time, server resources, AI processing power, design work, and ongoing security and performance upgrades.
              </p>
            </CardContent>
          </Card>

          <h2 className="text-2xl font-bold text-foreground mt-12 mb-4">
            Your donation directly accelerates the next stage of Phototheology.
          </h2>
          
          <p className="text-muted-foreground leading-relaxed">
            When you give, you're not just supporting an app—you're investing in a <strong className="text-foreground">global discipleship ecosystem</strong> designed to train people to study Scripture deeply, share the gospel boldly, and build digital and local ministries that change lives.
          </p>

          <h3 className="text-xl font-semibold text-foreground mt-10 mb-6">
            Your donation helps us:
          </h3>

          <div className="grid gap-4 not-prose">
            {IMPACT_ITEMS.map((item, index) => (
              <div 
                key={index}
                className="flex items-start gap-4 p-4 rounded-lg bg-card border border-border hover:border-primary/30 transition-colors"
              >
                <div className="p-2 rounded-full bg-primary/10 text-primary shrink-0">
                  <item.icon className="h-5 w-5" />
                </div>
                <p className="text-foreground">{item.text}</p>
              </div>
            ))}
          </div>

          <div className="my-12 p-8 rounded-2xl bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20">
            <h3 className="text-2xl font-bold text-foreground text-center mb-4">
              Every gift—large or small—pushes the mission forward.
            </h3>
            <p className="text-center text-muted-foreground">
              You help create a world where anyone, anywhere, can study the Bible with clarity, depth, and joy.
              <br />
              You help build tools that will impact homes, churches, ministries, and entire communities.
            </p>
          </div>

          <p className="text-muted-foreground leading-relaxed">
            If Phototheology has blessed you, consider partnering with us so we can bring these features to life sooner.
          </p>
        </div>

        {/* Donation Card */}
        <Card className="mt-12 border-2 border-primary/30">
          <CardContent className="p-8">
            <h3 className="text-2xl font-bold text-foreground text-center mb-6">
              Make a Donation
            </h3>
            
            <div className="grid grid-cols-3 md:grid-cols-6 gap-3 mb-6">
              {PRESET_AMOUNTS.map((amount) => (
                <Button
                  key={amount}
                  variant={selectedAmount === amount ? "default" : "outline"}
                  onClick={() => {
                    setSelectedAmount(amount);
                    setCustomAmount("");
                  }}
                  className="text-lg font-semibold"
                >
                  ${amount}
                </Button>
              ))}
            </div>

            <div className="flex items-center gap-4 mb-8">
              <span className="text-muted-foreground whitespace-nowrap">Or enter custom:</span>
              <div className="relative flex-1">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
                <Input
                  type="number"
                  placeholder="Enter amount"
                  value={customAmount}
                  onChange={(e) => {
                    setCustomAmount(e.target.value);
                    setSelectedAmount(null);
                  }}
                  className="pl-8"
                  min="1"
                />
              </div>
            </div>

            <Button 
              onClick={handleDonate}
              disabled={isLoading || (!selectedAmount && !customAmount)}
              size="lg"
              className="w-full text-lg py-6"
            >
              <Heart className="mr-2 h-5 w-5" />
              {isLoading ? "Processing..." : `Donate ${selectedAmount ? `$${selectedAmount}` : customAmount ? `$${customAmount}` : ""}`}
            </Button>
          </CardContent>
        </Card>

        {/* Closing */}
        <div className="mt-12 text-center">
          <p className="text-lg text-muted-foreground italic">
            Thank you for standing with us.
          </p>
          <p className="text-xl font-semibold text-foreground mt-2">
            Together, we are building something far bigger than an app—we are building a movement.
          </p>
        </div>
      </div>
    </div>
  );
}
