import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Flame, Sparkles, BookOpen, ArrowRight } from "lucide-react";

export function TruthSeriesCard() {
  const navigate = useNavigate();

  return (
    <Card 
      variant="glass" 
      className="overflow-hidden bg-gradient-to-br from-amber-500/10 via-orange-500/5 to-red-500/10 border-amber-500/30 hover:border-amber-500/50 transition-all cursor-pointer group"
      onClick={() => navigate('/living-manna?tab=truth-series')}
    >
      <CardContent className="pt-6">
        <div className="flex items-start gap-4">
          <div className="p-3 rounded-xl bg-gradient-to-br from-amber-500/20 to-orange-500/20 group-hover:from-amber-500/30 group-hover:to-orange-500/30 transition-colors">
            <Flame className="h-7 w-7 text-amber-500" />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-bold text-lg">Truth Series</h3>
              <Badge variant="outline" className="bg-amber-500/10 border-amber-500/30 text-amber-600">
                <Sparkles className="h-3 w-3 mr-1" />
                For Seekers
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground mb-3">
              Explore the 28 Fundamental Beliefs through immersive, AI-guided Bible studies using the Phototheology Palace method — Christ-centered, sanctuary-connected, and designed to transform.
            </p>
            
            <div className="flex flex-wrap gap-2 mb-4">
              <Badge variant="outline" className="text-xs">
                <BookOpen className="h-3 w-3 mr-1" />
                28 Topics
              </Badge>
              <Badge variant="outline" className="text-xs">Palace Method</Badge>
              <Badge variant="outline" className="text-xs">Ask Questions</Badge>
            </div>

            <Button size="sm" className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600">
              Begin Your Journey
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
