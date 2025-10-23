import { Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ChevronRight } from "lucide-react";
import { Floor } from "@/data/palaceData";

interface FloorCardProps {
  floor: Floor;
}

export const FloorCard = ({ floor }: FloorCardProps) => {
  return (
    <Link to={`/floor/${floor.number}`}>
      <Card className="group hover:shadow-hover transition-smooth cursor-pointer border-2 hover:border-accent">
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <Badge variant="outline" className="font-mono text-xs">
                  Floor {floor.number}
                </Badge>
                <Badge className="bg-accent text-accent-foreground">
                  {floor.rooms.length} Rooms
                </Badge>
              </div>
              <CardTitle className="font-serif text-2xl mb-2 group-hover:text-accent transition-smooth">
                {floor.name}
              </CardTitle>
              <CardDescription className="text-sm font-medium text-muted-foreground">
                {floor.subtitle}
              </CardDescription>
            </div>
            <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-accent transition-smooth group-hover:translate-x-1" />
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground leading-relaxed">
            {floor.description}
          </p>
        </CardContent>
      </Card>
    </Link>
  );
};
