import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";
import { Sparkles, Trash2, Plus } from "lucide-react";
import { format } from "date-fns";
import { palaceFloors } from "@/data/palaceData";

interface RoomUpdate {
  id: string;
  room_id: string;
  floor_number: number;
  update_description: string;
  created_at: string;
}

export function RoomUpdateManager() {
  const { user } = useAuth();
  const [updates, setUpdates] = useState<RoomUpdate[]>([]);
  const [loading, setLoading] = useState(true);
  const [isOwner, setIsOwner] = useState(false);

  // New update form
  const [selectedFloor, setSelectedFloor] = useState<string>("1");
  const [selectedRoom, setSelectedRoom] = useState<string>("");
  const [description, setDescription] = useState("");
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    checkOwnership();
    fetchUpdates();
  }, [user?.id]);

  const checkOwnership = async () => {
    if (!user) return;

    const { data } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", user.id)
      .eq("role", "owner")
      .single();

    setIsOwner(!!data);
  };

  const fetchUpdates = async () => {
    try {
      // Use type assertion to work around missing types until they regenerate
      const { data, error } = await (supabase
        .from("room_content_updates" as any)
        .select("*")
        .order("created_at", { ascending: false })
        .limit(50) as any);

      if (error) throw error;
      setUpdates((data as RoomUpdate[]) || []);
    } catch (error) {
      console.error("Error fetching room updates:", error);
    } finally {
      setLoading(false);
    }
  };

  const createUpdate = async () => {
    if (!selectedRoom || !description.trim()) {
      toast({ title: "Please select a room and provide a description", variant: "destructive" });
      return;
    }

    setCreating(true);
    try {
      const { error } = await (supabase
        .from("room_content_updates" as any)
        .insert({
          room_id: selectedRoom,
          floor_number: parseInt(selectedFloor),
          update_description: description.trim(),
        }) as any);

      if (error) throw error;

      toast({ title: "Room marked as newly renovated!" });
      setDescription("");
      setSelectedRoom("");
      fetchUpdates();
    } catch (error: any) {
      toast({ title: "Error creating update", description: error.message, variant: "destructive" });
    } finally {
      setCreating(false);
    }
  };

  const deleteUpdate = async (id: string) => {
    try {
      const { error } = await (supabase
        .from("room_content_updates" as any)
        .delete()
        .eq("id", id) as any);

      if (error) throw error;
      toast({ title: "Update removed" });
      fetchUpdates();
    } catch (error: any) {
      toast({ title: "Error deleting update", variant: "destructive" });
    }
  };

  if (!isOwner) {
    return (
      <Card>
        <CardContent className="py-8 text-center text-muted-foreground">
          Only the palace owner can manage room updates.
        </CardContent>
      </Card>
    );
  }

  const selectedFloorData = palaceFloors.find((f) => f.number === parseInt(selectedFloor));
  const availableRooms = selectedFloorData?.rooms || [];

  return (
    <div className="space-y-6">
      {/* Create New Update */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Plus className="h-5 w-5" />
            Mark Room as Newly Renovated
          </CardTitle>
          <CardDescription>
            When you make changes to a room, mark it here. Users will see a "Newly Renovated" badge until they visit it.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="floor">Floor</Label>
              <Select value={selectedFloor} onValueChange={setSelectedFloor}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {palaceFloors.map((floor) => (
                    <SelectItem key={floor.number} value={floor.number.toString()}>
                      Floor {floor.number} - {floor.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="room">Room</Label>
              <Select value={selectedRoom} onValueChange={setSelectedRoom}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a room" />
                </SelectTrigger>
                <SelectContent>
                  {availableRooms.map((room) => (
                    <SelectItem key={room.id} value={room.id}>
                      {room.tag} - {room.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">What changed?</Label>
            <Textarea
              id="description"
              placeholder="Added new exercises, updated content, fixed bugs..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
            />
          </div>
          <Button onClick={createUpdate} disabled={creating}>
            {creating ? "Marking..." : "Mark as Newly Renovated"}
          </Button>
        </CardContent>
      </Card>

      {/* Recent Updates */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Room Updates</CardTitle>
          <CardDescription>Rooms marked as newly renovated</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p className="text-muted-foreground">Loading...</p>
          ) : updates.length === 0 ? (
            <p className="text-muted-foreground">No updates yet.</p>
          ) : (
            <div className="space-y-3">
              {updates.map((update) => {
                const floor = palaceFloors.find((f) => f.number === update.floor_number);
                const room = floor?.rooms.find((r) => r.id === update.room_id);

                return (
                  <div
                    key={update.id}
                    className="flex items-center justify-between gap-4 p-4 rounded-lg border bg-card"
                  >
                    <div className="flex items-center gap-3 min-w-0 flex-1">
                      <Sparkles className="h-5 w-5 flex-shrink-0 text-yellow-500" />
                      <div className="min-w-0">
                        <p className="font-medium">
                          Floor {update.floor_number} - {room?.name || update.room_id}
                        </p>
                        <p className="text-sm text-muted-foreground">{update.update_description}</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {format(new Date(update.created_at), "MMM d, yyyy 'at' h:mm a")}
                        </p>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-destructive hover:text-destructive"
                      onClick={() => deleteUpdate(update.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
