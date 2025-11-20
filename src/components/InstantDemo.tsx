import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Sparkles, ArrowRight, BookOpen } from "lucide-react";
import { useNavigate } from "react-router-dom";

export const InstantDemo = () => {
  const navigate = useNavigate();

  return (
    <section className="max-w-4xl mx-auto px-4 py-12">
      <div className="text-center mb-8">
        <Badge variant="secondary" className="mb-4">
          <Sparkles className="w-4 h-4 mr-2" />
          Hidden Gems Revealed
        </Badge>
        <h2 className="text-3xl md:text-4xl font-bold mb-3">
          The Unnamed Son of David
        </h2>
        <p className="text-muted-foreground text-lg">
          See what most readers overlook in 2 Samuel 12
        </p>
      </div>

      <Card className="bg-gradient-to-br from-primary/5 to-accent/5 border-2 border-primary/20 shadow-xl">
        <CardHeader>
          <div className="flex items-center justify-between flex-wrap gap-2">
            <CardTitle className="text-2xl flex items-center gap-2">
              <BookOpen className="h-6 w-6 text-primary" />
              2 Samuel 12
            </CardTitle>
            <Badge variant="outline" className="text-xs">Typology · Christ-Centered</Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* The Discovery */}
          <div className="bg-background/80 backdrop-blur-sm p-6 rounded-lg border border-border/50 space-y-4">
            <p className="text-lg leading-relaxed">
              In 2 Samuel 12, a male child is born to David. He is never given a name—he is simply identified as <span className="font-semibold italic">"the son of David."</span>
            </p>
            
            <div className="pl-4 border-l-4 border-primary/30 space-y-2">
              <p className="text-base text-muted-foreground">
                He enters the world because of someone else's sin.
              </p>
              <p className="text-base text-muted-foreground">
                He commits no wrong.
              </p>
              <p className="text-base text-muted-foreground">
                Yet he dies in the place of the guilty.
              </p>
            </div>

            <p className="text-lg leading-relaxed pt-2">
              A quiet shadow of the <span className="font-semibold text-primary">Greater Son of David</span> who would enter the world because of our sin… and die, though innocent, to bring peace, restoration, and a new covenant.
            </p>
          </div>

          {/* Phototheology Insight */}
          <div className="bg-primary/5 p-6 rounded-lg border border-primary/20">
            <div className="flex items-start gap-3 mb-3">
              <Sparkles className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
              <div>
                <h3 className="font-bold text-lg mb-2">This Is Phototheology</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Connections like this make Scripture come alive. Phototheology trains you to see patterns, recognize types, and discover Christ in every chapter—from Genesis to Revelation.
                </p>
              </div>
            </div>

            <div className="mt-4 p-4 bg-background/60 rounded border border-border/30">
              <p className="text-sm font-semibold mb-2">🎯 Palace Principles Applied:</p>
              <ul className="text-sm space-y-1 text-muted-foreground">
                <li>• <span className="font-medium">Concentration Room (CR):</span> Every text reveals Christ</li>
                <li>• <span className="font-medium">Symbols/Types Room (@T):</span> Unnamed child → Jesus the substitutionary sacrifice</li>
                <li>• <span className="font-medium">Parallels Room (P‖):</span> David's son dies → Christ dies for us</li>
                <li>• <span className="font-medium">Cycle:</span> @Mo (Mosaic) → @CyC (Cyrus-Christ fulfillment)</li>
              </ul>
            </div>
          </div>

          {/* CTA */}
          <div className="flex flex-col sm:flex-row gap-3 pt-4">
            <Button 
              size="lg" 
              onClick={() => navigate("/auth")}
              className="flex-1"
            >
              Find More Hidden Gems
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button 
              size="lg" 
              variant="outline"
              onClick={() => navigate("/interactive-demo")}
              className="flex-1"
            >
              Explore the Palace
            </Button>
          </div>

          <p className="text-xs text-center text-muted-foreground">
            ✨ Join thousands discovering deeper meaning in Scripture
          </p>
        </CardContent>
      </Card>
    </section>
  );
};