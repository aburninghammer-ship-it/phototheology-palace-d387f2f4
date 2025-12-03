import { useState, useEffect } from "react";
import { Navigation } from "@/components/Navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { palaceFloors } from "@/data/palaceData";
import { Dumbbell, CheckCircle2, Loader2, ArrowLeft, RefreshCw } from "lucide-react";

const TrainingDrills = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [selectedFloor, setSelectedFloor] = useState<string>("floor-1");
  const [selectedRoom, setSelectedRoom] = useState<string | null>(null);
  const [drills, setDrills] = useState<any[]>([]);
  const [completions, setCompletions] = useState<Set<string>>(new Set());
  const [activeDrill, setActiveDrill] = useState<any | null>(null);
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);
  const [generating, setGenerating] = useState(false);

  useEffect(() => {
    if (user) {
      fetchCompletions();
    }
  }, [user]);

  useEffect(() => {
    if (selectedRoom) {
      fetchDrills(selectedRoom);
    }
  }, [selectedRoom]);

  const fetchCompletions = async () => {
    const { data } = await supabase
      .from('user_drill_completions')
      .select('drill_id')
      .eq('user_id', user?.id);

    if (data) {
      setCompletions(new Set(data.map((c: any) => c.drill_id)));
    }
  };

  const fetchDrills = async (roomTag: string) => {
    setDrills([]);
    
    let { data, error } = await supabase
      .from('training_drills')
      .select('*')
      .eq('room_tag', roomTag)
      .order('drill_number');

    if (error) {
      console.error('Error fetching drills:', error);
      // Generate drills if table doesn't exist or error
      await generateDrillsForRoom(roomTag);
      return;
    }
    
    if (!data || data.length === 0) {
      // Generate drills if none exist
      await generateDrillsForRoom(roomTag);
      return;
    }

    setDrills(data);
  };

  const generateDrillsForRoom = async (roomTag: string, forceRegenerate = false) => {
    setGenerating(true);
    
    const room = palaceFloors
      .flatMap(f => f.rooms)
      .find(r => r.tag === roomTag);

    if (!room) {
      setGenerating(false);
      return;
    }

    try {
      // If force regenerating, delete existing drills first
      if (forceRegenerate) {
        await supabase
          .from('training_drills')
          .delete()
          .eq('room_tag', roomTag);
      }

      // Call Jeeves to generate 10 drills
      const { data, error } = await supabase.functions.invoke('jeeves', {
        body: {
          mode: 'generate-drills',
          roomTag: room.tag,
          roomName: room.name,
          roomPurpose: room.purpose,
          roomMethod: room.method,
        },
      });

      if (error) throw error;

      // Insert drills into database
      if (data?.drills && Array.isArray(data.drills)) {
        const { error: insertError } = await supabase
          .from('training_drills')
          .insert(
            data.drills.map((drill: any, index: number) => ({
              room_tag: roomTag,
              drill_number: index + 1,
              title: drill.title,
              description: drill.description,
              prompt: drill.prompt,
            }))
          );

        if (!insertError) {
          // Re-fetch drills after insert
          const { data: newDrills } = await supabase
            .from('training_drills')
            .select('*')
            .eq('room_tag', roomTag)
            .order('drill_number');
          
          if (newDrills) {
            setDrills(newDrills);
          }
          
          toast({
            title: "Drills Generated!",
            description: `10 training drills created for ${room.name}`,
          });
        } else {
          console.error('Error inserting drills:', insertError);
          toast({
            title: "Error",
            description: "Failed to save generated drills",
            variant: "destructive",
          });
        }
      } else {
        console.error('Invalid drill data:', data);
        toast({
          title: "Error",
          description: "Failed to generate drills - invalid response",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Error generating drills:', error);
      toast({
        title: "Error",
        description: "Failed to generate drills",
        variant: "destructive",
      });
    } finally {
      setGenerating(false);
    }
  };

  const startDrill = (drill: any) => {
    setActiveDrill(drill);
    setResponse("");
  };

  const submitDrill = async () => {
    if (!response.trim()) {
      toast({
        title: "Enter a response",
        description: "Please provide your answer before submitting",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    const { error } = await supabase
      .from('user_drill_completions')
      .insert({
        user_id: user?.id,
        drill_id: activeDrill.id,
        response: response,
      });

    if (error && error.code !== '23505') {
      toast({
        title: "Error",
        description: "Failed to save completion",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Drill Complete!",
        description: "Great work! Keep training.",
      });
      
      setCompletions(new Set([...completions, activeDrill.id]));
      setActiveDrill(null);
      setResponse("");
    }

    setLoading(false);
  };

  const handleBackToRooms = () => {
    setSelectedRoom(null);
    setDrills([]);
    setActiveDrill(null);
  };

  const getRoomByTag = (tag: string) => {
    return palaceFloors.flatMap(f => f.rooms).find(r => r.tag === tag);
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto space-y-8">
          <div className="text-center space-y-4">
            <h1 className="text-5xl font-bold flex items-center justify-center gap-3">
              <Dumbbell className="h-12 w-12 text-primary" />
              Palace Training Drills
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Master every room of the palace with 10 dynamic training drills per room. 
              Practice the skills, methods, and insights unique to each space.
            </p>
          </div>

          {activeDrill ? (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>{activeDrill.title}</span>
                  <Badge>Drill #{activeDrill.drill_number}</Badge>
                </CardTitle>
                <CardDescription>{activeDrill.description}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="p-4 bg-muted rounded-lg">
                  <p className="leading-relaxed">{activeDrill.prompt}</p>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Your Response:</label>
                  <Textarea
                    value={response}
                    onChange={(e) => setResponse(e.target.value)}
                    placeholder="Type your answer here..."
                    rows={6}
                    disabled={loading}
                  />
                </div>

                <div className="flex gap-2">
                  <Button
                    onClick={submitDrill}
                    disabled={loading || !response.trim()}
                    className="flex-1"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Submitting...
                      </>
                    ) : (
                      "Complete Drill"
                    )}
                  </Button>
                  <Button
                    onClick={() => setActiveDrill(null)}
                    variant="outline"
                    disabled={loading}
                  >
                    Cancel
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : selectedRoom ? (
            // Show drills for selected room
            <div className="space-y-4">
              <div className="flex items-center justify-between flex-wrap gap-4">
                <div className="flex items-center gap-4">
                  <Button variant="ghost" onClick={handleBackToRooms}>
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back to Rooms
                  </Button>
                  <div>
                    <h2 className="text-2xl font-bold">{getRoomByTag(selectedRoom)?.name} Drills</h2>
                    <p className="text-muted-foreground">Complete these drills to master this room</p>
                  </div>
                </div>
                {drills.length > 0 && !generating && (
                  <Button 
                    variant="outline" 
                    onClick={() => generateDrillsForRoom(selectedRoom, true)}
                    disabled={generating}
                  >
                    <RefreshCw className="mr-2 h-4 w-4" />
                    Get Fresh Drills
                  </Button>
                )}
              </div>

              {generating ? (
                <Card>
                  <CardContent className="py-12 text-center">
                    <Loader2 className="h-12 w-12 animate-spin mx-auto mb-4 text-primary" />
                    <p className="text-lg font-medium">Generating training drills...</p>
                    <p className="text-muted-foreground">This may take a moment</p>
                  </CardContent>
                </Card>
              ) : drills.length === 0 ? (
                <Card>
                  <CardContent className="py-12 text-center">
                    <p className="text-muted-foreground">No drills available yet.</p>
                    <Button 
                      onClick={() => generateDrillsForRoom(selectedRoom)} 
                      className="mt-4"
                    >
                      Generate Drills
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid md:grid-cols-2 gap-4">
                  {drills.map((drill) => {
                    const isCompleted = completions.has(drill.id);
                    return (
                      <Card key={drill.id} className={isCompleted ? "border-green-500" : ""}>
                        <CardHeader>
                          <CardTitle className="text-base flex items-center justify-between">
                            <span>{drill.title}</span>
                            {isCompleted && <CheckCircle2 className="h-5 w-5 text-green-500" />}
                          </CardTitle>
                          <CardDescription className="text-sm">{drill.description}</CardDescription>
                        </CardHeader>
                        <CardContent>
                          <Button
                            onClick={() => startDrill(drill)}
                            className="w-full"
                            variant={isCompleted ? "outline" : "default"}
                          >
                            {isCompleted ? "Practice Again" : "Start Drill"}
                          </Button>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              )}
            </div>
          ) : (
            // Show floor tabs and room selection
            <Tabs value={selectedFloor} onValueChange={setSelectedFloor}>
              <ScrollArea className="w-full">
                <TabsList className="inline-flex w-full md:w-auto">
                  {palaceFloors.map((floor) => (
                    <TabsTrigger key={floor.number} value={`floor-${floor.number}`} className="text-xs flex-shrink-0">
                      Floor {floor.number}
                    </TabsTrigger>
                  ))}
                </TabsList>
              </ScrollArea>

              {palaceFloors.map((floor) => (
                <TabsContent key={floor.number} value={`floor-${floor.number}`} className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>{floor.name}</CardTitle>
                      <CardDescription>{floor.description}</CardDescription>
                    </CardHeader>
                  </Card>

                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {floor.rooms.map((room) => (
                      <Card key={room.id} className="hover:shadow-lg transition-all">
                        <CardHeader>
                          <CardTitle className="text-lg flex items-center justify-between">
                            <span>{room.name}</span>
                            <Badge variant="outline">{room.tag}</Badge>
                          </CardTitle>
                          <CardDescription className="text-sm">
                            {room.purpose.substring(0, 100)}...
                          </CardDescription>
                        </CardHeader>
                        <CardContent>
                          <Button
                            onClick={() => setSelectedRoom(room.tag)}
                            className="w-full"
                            variant="outline"
                          >
                            View Drills
                          </Button>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </TabsContent>
              ))}
            </Tabs>
          )}
        </div>
      </main>
    </div>
  );
};

export default TrainingDrills;
