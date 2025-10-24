import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./useAuth";
import { palaceFloors } from "@/data/palaceData";

export const useRoomUnlock = (floorNumber: number, roomId: string) => {
  const { user } = useAuth();
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [loading, setLoading] = useState(true);
  const [missingPrerequisites, setMissingPrerequisites] = useState<string[]>([]);

  useEffect(() => {
    const checkUnlock = async () => {
      if (!user) {
        setIsUnlocked(true); // Allow preview for non-authenticated users
        setLoading(false);
        return;
      }

      const floor = palaceFloors.find(f => f.number === floorNumber);
      const room = floor?.rooms.find(r => r.id === roomId);

      if (!room || !room.prerequisites || room.prerequisites.length === 0) {
        setIsUnlocked(true);
        setLoading(false);
        return;
      }

      try {
        // Get all user's completed rooms
        const { data: completedRooms, error } = await supabase
          .from("room_progress")
          .select("room_id, floor_number")
          .eq("user_id", user.id)
          .not("completed_at", "is", null);

        if (error) throw error;

        const completedSet = new Set(
          completedRooms?.map(r => `${r.floor_number}-${r.room_id}`) || []
        );

        // Check each prerequisite
        const missing: string[] = [];
        for (const prereq of room.prerequisites) {
          const prereqKey = `${prereq.floor}-${prereq.room}`;
          if (!completedSet.has(prereqKey)) {
            // Find the room name for display
            const prereqFloor = palaceFloors.find(f => f.number === prereq.floor);
            const prereqRoom = prereqFloor?.rooms.find(r => r.id === prereq.room);
            if (prereqRoom) {
              missing.push(prereqRoom.name);
            }
          }
        }

        setMissingPrerequisites(missing);
        setIsUnlocked(missing.length === 0);
      } catch (error) {
        console.error("Error checking room unlock:", error);
        setIsUnlocked(true); // Fail open
      } finally {
        setLoading(false);
      }
    };

    checkUnlock();
  }, [user, floorNumber, roomId]);

  return { isUnlocked, loading, missingPrerequisites };
};
