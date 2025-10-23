import { Navigation } from "@/components/Navigation";
import { FloorCard } from "@/components/FloorCard";
import { palaceFloors } from "@/data/palaceData";
import { Building2 } from "lucide-react";

const Palace = () => {
  return (
    <div className="min-h-screen bg-gradient-subtle">
      <Navigation />
      
      <div className="pt-24 pb-16 px-4">
        <div className="container mx-auto max-w-6xl">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 border border-accent/20 mb-4">
              <Building2 className="h-4 w-4 text-accent" />
              <span className="text-sm font-medium text-accent">38 Rooms of Wisdom</span>
            </div>
            
            <h1 className="font-serif text-4xl md:text-5xl font-bold mb-4">
              The Eight-Floor Palace
            </h1>
            
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Climb through the palace of Bible study. Each floor represents a level of mastery, 
              with rooms teaching specific principles for storing and interpreting Scripture.
            </p>
          </div>

          {/* Palace Metaphor */}
          <div className="mb-12 p-6 rounded-lg bg-card border border-border shadow-elegant">
            <h2 className="font-serif text-2xl font-semibold mb-4 text-center">
              The Palace Metaphor
            </h2>
            <div className="grid md:grid-cols-2 gap-4 text-sm text-muted-foreground">
              <div>
                <p className="mb-2">
                  <strong className="text-foreground">The 1st Floor</strong> fills your shelves with stories and images (width).
                </p>
                <p className="mb-2">
                  <strong className="text-foreground">The 2nd Floor</strong> trains you as a detective with magnifying glass in hand.
                </p>
                <p className="mb-2">
                  <strong className="text-foreground">The 3rd Floor</strong> teaches freestyle, spontaneous connections in daily life.
                </p>
                <p className="mb-2">
                  <strong className="text-foreground">The 4th Floor</strong> expands depth through Christ-centered, dimensional study.
                </p>
              </div>
              <div>
                <p className="mb-2">
                  <strong className="text-foreground">The 5th Floor</strong> opens the prophetic telescope.
                </p>
                <p className="mb-2">
                  <strong className="text-foreground">The 6th Floor</strong> situates everything in the cycles of history and the heavens.
                </p>
                <p className="mb-2">
                  <strong className="text-foreground">The 7th Floor</strong> brings heart and soul into the fire of experience.
                </p>
                <p>
                  <strong className="text-foreground">The 8th Floor</strong> removes the scaffolding altogether: Phototheology becomes reflexive thought.
                </p>
              </div>
            </div>
          </div>

          {/* Floors Grid */}
          <div className="space-y-6">
            {palaceFloors.map((floor) => (
              <FloorCard key={floor.number} floor={floor} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Palace;
