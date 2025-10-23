import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Room } from "@/data/palaceData";

interface RoomCardProps {
  room: Room;
}

export const RoomCard = ({ room }: RoomCardProps) => {
  return (
    <Card className="hover:shadow-hover transition-smooth">
      <CardHeader>
        <div className="flex items-start justify-between mb-2">
          <CardTitle className="font-serif text-xl">{room.name}</CardTitle>
          <Badge className="bg-accent text-accent-foreground font-mono text-xs">
            {room.tag}
          </Badge>
        </div>
        <CardDescription className="text-sm font-medium">
          {room.coreQuestion}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <h4 className="font-semibold text-sm mb-1 text-foreground">Purpose</h4>
          <p className="text-sm text-muted-foreground">{room.purpose}</p>
        </div>
        
        <div>
          <h4 className="font-semibold text-sm mb-1 text-foreground">Method</h4>
          <p className="text-sm text-muted-foreground">{room.method}</p>
        </div>
        
        {room.examples.length > 0 && (
          <div>
            <h4 className="font-semibold text-sm mb-2 text-foreground">Examples</h4>
            <ul className="space-y-1">
              {room.examples.map((example, idx) => (
                <li key={idx} className="text-sm text-muted-foreground flex gap-2">
                  <span className="text-accent">•</span>
                  <span>{example}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
        
        <div className="pt-2 border-t border-border">
          <p className="text-xs text-muted-foreground">
            <span className="font-semibold text-foreground">Deliverable:</span> {room.deliverable}
          </p>
        </div>
      </CardContent>
    </Card>
  );
};
