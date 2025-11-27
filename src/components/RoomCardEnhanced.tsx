import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Room } from "@/data/palaceData";
import { 
  Sparkles, BookOpen, Target, Lightbulb, Lock, Clock, Zap,
  ChevronDown, ChevronUp, Play, CheckCircle2, AlertTriangle
} from "lucide-react";
import * as Icons from "lucide-react";
import { JeevesAssistant } from "@/components/JeevesAssistant";
import { useRoomUnlock } from "@/hooks/useRoomUnlock";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { useState } from "react";

interface RoomCardEnhancedProps {
  room: Room;
  floorNumber: number;
}

const roomGradients = [
  ["gradient-palace", "gradient-royal", "gradient-ocean", "gradient-sunset", "gradient-warmth", "gradient-forest"],
  ["gradient-royal", "gradient-ocean", "gradient-forest", "gradient-sunset", "gradient-warmth"],
  ["gradient-ocean", "gradient-sunset", "gradient-warmth", "gradient-forest", "gradient-dreamy"],
  ["gradient-sunset", "gradient-warmth", "gradient-palace", "gradient-royal", "gradient-ocean", "gradient-forest", "gradient-dreamy", "gradient-sunset"],
  ["gradient-warmth", "gradient-palace", "gradient-royal", "gradient-ocean", "gradient-sunset", "gradient-forest"],
  ["gradient-forest", "gradient-ocean", "gradient-dreamy"],
  ["gradient-dreamy", "gradient-palace", "gradient-sunset"],
  ["gradient-palace"]
];

const timeEstimates = {
  quick: { label: "Quick", time: "5 min", icon: Zap, color: "text-green-600" },
  standard: { label: "Standard", time: "15 min", icon: Clock, color: "text-blue-600" },
  deep: { label: "Deep Dive", time: "30+ min", icon: BookOpen, color: "text-purple-600" }
};

export const RoomCardEnhanced = ({ room, floorNumber }: RoomCardEnhancedProps) => {
  const gradients = roomGradients[floorNumber - 1] || ["gradient-palace"];
  const roomIndex = room.id.charCodeAt(0) % gradients.length;
  const gradient = gradients[roomIndex];
  const { isUnlocked, loading, missingPrerequisites } = useRoomUnlock(floorNumber, room.id);
  
  const [methodExpanded, setMethodExpanded] = useState(false);
  const [pitfallsExpanded, setPitfallsExpanded] = useState(false);
  
  const timeInfo = room.estimatedTime ? timeEstimates[room.estimatedTime] : timeEstimates.standard;
  const TimeIcon = timeInfo.icon;
  
  // Get the icon component
  const RoomIcon = room.icon && Icons[room.icon as keyof typeof Icons] 
    ? (Icons[room.icon as keyof typeof Icons] as any)
    : BookOpen;
  
  return (
    <div className="grid lg:grid-cols-3 gap-6">
      {/* Room Details */}
      <div className="lg:col-span-2">
        {!isUnlocked && !loading && (
          <Alert className="mb-4 border-destructive/50 bg-destructive/10">
            <Lock className="h-4 w-4" />
            <AlertDescription>
              <strong>Room Locked:</strong> Complete these rooms first:
              <ul className="list-disc list-inside mt-2">
                {missingPrerequisites.map((prereq, idx) => (
                  <li key={idx}>{prereq}</li>
                ))}
              </ul>
            </AlertDescription>
          </Alert>
        )}
        
        <Card className={`hover-lift group border-2 hover:border-primary overflow-hidden animate-scale-in bg-gradient-to-br from-card to-muted/20 ${!isUnlocked ? 'opacity-60' : ''}`}>
          <div className={`h-2 ${gradient}`} />
          <CardHeader>
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <div className={`p-2 rounded-lg ${gradient} shadow-lg`}>
                    <RoomIcon className="h-4 w-4 text-white" />
                  </div>
                  <Badge className={`${gradient} text-white font-mono text-xs shadow-lg`}>
                    {room.tag}
                  </Badge>
                  <Badge variant="outline" className="flex items-center gap-1">
                    <TimeIcon className={`h-3 w-3 ${timeInfo.color}`} />
                    <span className="text-xs">{timeInfo.time}</span>
                  </Badge>
                </div>
                <CardTitle className="font-serif text-2xl group-hover:text-primary transition-smooth flex items-center gap-2">
                  {!isUnlocked && <Lock className="h-5 w-5 text-destructive" />}
                  {room.name}
                  {isUnlocked && <Sparkles className="h-5 w-5 text-accent opacity-0 group-hover:opacity-100 transition-all duration-300 group-hover:animate-pulse-glow" />}
                </CardTitle>
              </div>
            </div>
            <CardDescription className="text-base font-semibold text-primary/80 leading-relaxed">
              {room.coreQuestion}
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-4">
            {/* 3-Line Header: Purpose → Action → Output */}
            <div className="grid gap-3">
              {/* Purpose */}
              <div className="p-4 bg-gradient-to-r from-primary/5 to-secondary/5 rounded-xl border border-primary/20">
                <div className="flex items-center gap-2 mb-2">
                  <Target className="h-4 w-4 text-primary" />
                  <h4 className="font-bold text-sm text-foreground">Purpose</h4>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">{room.purpose}</p>
              </div>
              
              {/* Action */}
              {room.action && (
                <div className="p-4 bg-gradient-to-r from-accent/5 to-blue-500/5 rounded-xl border border-accent/20">
                  <div className="flex items-center gap-2 mb-2">
                    <Play className="h-4 w-4 text-accent" />
                    <h4 className="font-bold text-sm text-foreground">Action</h4>
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed">{room.action}</p>
                </div>
              )}
              
              {/* Output */}
              {room.output && (
                <div className="p-4 bg-gradient-to-r from-green-500/5 to-emerald-500/5 rounded-xl border border-green-500/20">
                  <div className="flex items-center gap-2 mb-2">
                    <CheckCircle2 className="h-4 w-4 text-green-600" />
                    <h4 className="font-bold text-sm text-foreground">Output</h4>
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed">{room.output}</p>
                </div>
              )}
            </div>

            {/* Quick Mode (if available) */}
            {room.quickMode && (
              <div className="p-4 bg-gradient-to-r from-yellow-500/5 to-orange-500/5 rounded-xl border border-yellow-500/20">
                <div className="flex items-center gap-2 mb-3">
                  <Zap className="h-4 w-4 text-yellow-600" />
                  <h4 className="font-bold text-sm text-foreground">Quick Mode (30 seconds)</h4>
                </div>
                <ol className="space-y-2 ml-4">
                  {room.quickMode.map((step, idx) => (
                    <li key={idx} className="text-sm text-muted-foreground flex gap-2">
                      <span className="text-primary font-bold">{idx + 1}.</span>
                      <span className="flex-1">{step}</span>
                    </li>
                  ))}
                </ol>
              </div>
            )}
            
            {/* Examples Section */}
            {room.examples.length > 0 && (
              <div className="space-y-2">
                <h4 className="font-bold text-sm text-foreground flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-primary" />
                  Examples
                </h4>
                <div className="space-y-2">
                  {room.examples.slice(0, 2).map((example, idx) => (
                    <div
                      key={idx}
                      className="p-3 rounded-lg bg-muted/30 border border-border/50 hover:bg-muted/50 transition-all"
                    >
                      <p className="text-sm text-muted-foreground flex gap-2">
                        <span className="text-primary font-bold text-base">→</span>
                        <span className="flex-1">{example}</span>
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {/* Progressive Disclosure: Method */}
            <Collapsible open={methodExpanded} onOpenChange={setMethodExpanded}>
              <CollapsibleTrigger asChild>
                <Button variant="outline" className="w-full justify-between">
                  <div className="flex items-center gap-2">
                    <Lightbulb className="h-4 w-4" />
                    <span>Full Method & Steps</span>
                  </div>
                  {methodExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                </Button>
              </CollapsibleTrigger>
              <CollapsibleContent className="mt-2">
                <div className="p-4 bg-muted/30 rounded-lg border border-border/50">
                  <pre className="text-xs text-muted-foreground whitespace-pre-wrap font-sans">
                    {room.method}
                  </pre>
                </div>
              </CollapsibleContent>
            </Collapsible>

            {/* Progressive Disclosure: Pitfalls */}
            {room.pitfalls.length > 0 && (
              <Collapsible open={pitfallsExpanded} onOpenChange={setPitfallsExpanded}>
                <CollapsibleTrigger asChild>
                  <Button variant="outline" className="w-full justify-between">
                    <div className="flex items-center gap-2">
                      <AlertTriangle className="h-4 w-4 text-orange-600" />
                      <span>Common Mistakes to Avoid</span>
                    </div>
                    {pitfallsExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                  </Button>
                </CollapsibleTrigger>
                <CollapsibleContent className="mt-2">
                  <div className="p-4 bg-orange-500/5 rounded-lg border border-orange-500/20">
                    <ul className="space-y-2">
                      {room.pitfalls.map((pitfall, idx) => (
                        <li key={idx} className="text-sm text-muted-foreground flex gap-2">
                          <span className="text-orange-600">⚠</span>
                          <span className="flex-1">{pitfall}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </CollapsibleContent>
              </Collapsible>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Jeeves Assistant for this room */}
      <div className="lg:col-span-1">
        {isUnlocked ? (
          <JeevesAssistant
            roomTag={room.tag}
            roomName={room.name}
            principle={room.purpose.split('.')[0]}
            floorNumber={floorNumber}
            roomId={room.id}
          />
        ) : (
          <Card className="opacity-60">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lock className="h-5 w-5" />
                Locked
              </CardTitle>
              <CardDescription>
                Complete prerequisite rooms to unlock Jeeves for this room.
              </CardDescription>
            </CardHeader>
          </Card>
        )}
      </div>
    </div>
  );
};
