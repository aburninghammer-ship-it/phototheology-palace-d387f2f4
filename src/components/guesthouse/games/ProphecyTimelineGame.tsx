import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Clock, CheckCircle2, ArrowDown, Calendar, Book } from "lucide-react";
import { toast } from "sonner";

interface ProphecyEvent {
  id: string;
  title: string;
  description: string;
  verse: string;
  year?: string;
  order: number;
}

interface ProphecyTimelineGameProps {
  events: ProphecyEvent[];
  timeLimit?: number;
  onComplete: (score: number, correctOrder: number, timeTaken: number) => void;
  isHost?: boolean;
}

export function ProphecyTimelineGame({ 
  events, 
  timeLimit = 150, 
  onComplete,
  isHost = false 
}: ProphecyTimelineGameProps) {
  const [timeRemaining, setTimeRemaining] = useState(timeLimit);
  const [shuffledEvents, setShuffledEvents] = useState<ProphecyEvent[]>([]);
  const [arrangedEvents, setArrangedEvents] = useState<ProphecyEvent[]>([]);
  const [isComplete, setIsComplete] = useState(false);
  const [draggedItem, setDraggedItem] = useState<ProphecyEvent | null>(null);

  useEffect(() => {
    // Shuffle events for the game
    setShuffledEvents([...events].sort(() => Math.random() - 0.5));
  }, [events]);

  useEffect(() => {
    if (isComplete || isHost) return;

    const timer = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          handleSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isComplete, isHost]);

  const handleDragStart = (event: ProphecyEvent, source: 'shuffled' | 'arranged') => {
    setDraggedItem({ ...event, source } as any);
  };

  const handleDrop = (targetIndex?: number) => {
    if (!draggedItem) return;

    const source = (draggedItem as any).source;

    if (source === 'shuffled') {
      // Moving from shuffled to arranged
      setShuffledEvents(prev => prev.filter(e => e.id !== draggedItem.id));
      if (targetIndex !== undefined) {
        setArrangedEvents(prev => {
          const newArr = [...prev];
          newArr.splice(targetIndex, 0, draggedItem);
          return newArr;
        });
      } else {
        setArrangedEvents(prev => [...prev, draggedItem]);
      }
    } else {
      // Reordering within arranged
      setArrangedEvents(prev => {
        const filtered = prev.filter(e => e.id !== draggedItem.id);
        if (targetIndex !== undefined) {
          filtered.splice(targetIndex, 0, draggedItem);
        } else {
          filtered.push(draggedItem);
        }
        return filtered;
      });
    }

    setDraggedItem(null);
  };

  const moveBackToPool = (event: ProphecyEvent) => {
    setArrangedEvents(prev => prev.filter(e => e.id !== event.id));
    setShuffledEvents(prev => [...prev, event]);
  };

  const handleSubmit = () => {
    setIsComplete(true);
    
    // Calculate correct positions
    let correctPositions = 0;
    arrangedEvents.forEach((event, index) => {
      if (event.order === index + 1) {
        correctPositions++;
      }
    });

    const timeTaken = timeLimit - timeRemaining;
    const baseScore = (correctPositions / events.length) * 100;
    const timeBonus = Math.floor((timeRemaining / timeLimit) * 30);
    const score = Math.round(baseScore + timeBonus);

    onComplete(score, correctPositions, timeTaken);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const isLowTime = timeRemaining <= 30;

  // Host view
  if (isHost) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            Prophecy Timeline - Correct Order
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {events.sort((a, b) => a.order - b.order).map((event, index) => (
              <div 
                key={event.id}
                className="flex items-start gap-3 p-3 rounded-lg border bg-muted/50"
              >
                <Badge className="mt-1">{index + 1}</Badge>
                <div className="flex-1">
                  <p className="font-medium">{event.title}</p>
                  <p className="text-sm text-muted-foreground">{event.description}</p>
                  <p className="text-xs text-primary mt-1">{event.verse}</p>
                </div>
                {event.year && (
                  <Badge variant="outline">{event.year}</Badge>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (isComplete) {
    const correctPositions = arrangedEvents.filter((e, i) => e.order === i + 1).length;

    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center py-12"
      >
        <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto mb-4" />
        <h2 className="text-2xl font-bold mb-2">Timeline Complete!</h2>
        <p className="text-muted-foreground mb-4">
          {correctPositions} of {events.length} events in correct order
        </p>
        <div className="flex justify-center gap-4">
          <Badge variant="outline" className="text-lg py-2 px-4">
            Accuracy: {Math.round((correctPositions / events.length) * 100)}%
          </Badge>
        </div>
      </motion.div>
    );
  }

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-primary" />
            Prophecy Timeline
          </CardTitle>
          <Badge variant={isLowTime ? "destructive" : "secondary"}>
            <Clock className={`w-3 h-3 mr-1 ${isLowTime ? "animate-pulse" : ""}`} />
            {formatTime(timeRemaining)}
          </Badge>
        </div>
        <Progress value={(arrangedEvents.length / events.length) * 100} className="h-2 mt-2" />
      </CardHeader>

      <CardContent className="space-y-6">
        <p className="text-center text-muted-foreground">
          Arrange these prophetic events in chronological order
        </p>

        {/* Event Pool */}
        <div className="min-h-[100px] p-3 bg-muted/50 rounded-lg border-2 border-dashed">
          <p className="text-xs text-muted-foreground mb-2">Available Events (drag to timeline):</p>
          <div className="flex flex-wrap gap-2">
            {shuffledEvents.map(event => (
              <motion.div
                key={event.id}
                draggable
                onDragStart={() => handleDragStart(event, 'shuffled')}
                whileHover={{ scale: 1.02 }}
                className="p-2 bg-card rounded border cursor-move hover:border-primary"
              >
                <p className="text-sm font-medium">{event.title}</p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Timeline */}
        <div 
          className="min-h-[200px] p-4 bg-gradient-to-b from-primary/5 to-secondary/5 rounded-lg border-2"
          onDragOver={(e) => e.preventDefault()}
          onDrop={() => handleDrop()}
        >
          <p className="text-xs text-muted-foreground mb-3 flex items-center gap-1">
            <ArrowDown className="w-3 h-3" /> Timeline (earliest to latest):
          </p>
          
          {arrangedEvents.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              Drag events here to arrange them
            </div>
          ) : (
            <div className="space-y-2">
              {arrangedEvents.map((event, index) => (
                <motion.div
                  key={event.id}
                  layout
                  draggable
                  onDragStart={() => handleDragStart(event, 'arranged')}
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={() => handleDrop(index)}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="flex items-center gap-3 p-3 bg-card rounded-lg border cursor-move hover:border-primary"
                >
                  <Badge variant="outline">{index + 1}</Badge>
                  <div className="flex-1">
                    <p className="font-medium text-sm">{event.title}</p>
                    <p className="text-xs text-muted-foreground">{event.verse}</p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => moveBackToPool(event)}
                    className="text-muted-foreground hover:text-destructive"
                  >
                    ×
                  </Button>
                </motion.div>
              ))}
            </div>
          )}
        </div>

        {/* Submit */}
        <Button 
          onClick={handleSubmit} 
          className="w-full"
          disabled={arrangedEvents.length !== events.length}
        >
          <CheckCircle2 className="w-4 h-4 mr-2" />
          Submit Timeline ({arrangedEvents.length}/{events.length})
        </Button>
      </CardContent>
    </Card>
  );
}
