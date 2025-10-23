import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Navigation } from "@/components/Navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { Video, Users, Plus } from "lucide-react";

const LiveStudy = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [rooms, setRooms] = useState<any[]>([]);
  const [roomName, setRoomName] = useState("");
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    if (user) {
      fetchRooms();
      
      const channel = supabase
        .channel("study_rooms_changes")
        .on("postgres_changes", { event: "*", schema: "public", table: "study_rooms" }, () => {
          fetchRooms();
        })
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, [user]);

  const fetchRooms = async () => {
    const { data } = await supabase
      .from("study_rooms")
      .select("*, profiles!study_rooms_host_id_fkey(username)")
      .eq("is_public", true);
    
    setRooms(data || []);
  };

  const createRoom = async () => {
    if (!roomName.trim()) return;

    setCreating(true);
    try {
      const { data, error } = await supabase
        .from("study_rooms")
        .insert({
          name: roomName,
          host_id: user!.id,
        })
        .select()
        .single();

      if (error) throw error;

      toast({
        title: "Room created!",
        description: "Your study room is ready.",
      });

      navigate(`/live-study/${data.id}`);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setCreating(false);
    }
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto space-y-8">
          <div className="flex items-center justify-between">
            <h1 className="text-4xl font-bold flex items-center gap-2">
              <Video className="h-8 w-8" />
              Live Study Rooms
            </h1>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Plus className="h-5 w-5" />
                Create New Room
              </CardTitle>
              <CardDescription>Start a new study session</CardDescription>
            </CardHeader>
            <CardContent className="flex gap-2">
              <Input
                placeholder="Room name..."
                value={roomName}
                onChange={(e) => setRoomName(e.target.value)}
              />
              <Button onClick={createRoom} disabled={creating}>
                Create
              </Button>
            </CardContent>
          </Card>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {rooms.map((room) => (
              <Card key={room.id}>
                <CardHeader>
                  <CardTitle>{room.name}</CardTitle>
                  <CardDescription>
                    Host: {room.profiles?.username || "Unknown"}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button
                    onClick={() => navigate(`/live-study/${room.id}`)}
                    className="w-full"
                  >
                    <Users className="mr-2 h-4 w-4" />
                    Join Room
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          {rooms.length === 0 && (
            <div className="text-center py-12 text-muted-foreground">
              No active study rooms. Create one to get started!
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default LiveStudy;
