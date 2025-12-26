import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./useAuth";

interface RoomRenovationStatus {
  isNewlyRenovated: boolean;
  loading: boolean;
  markAsVisited: () => Promise<void>;
}

/**
 * Hook to check if a room has been updated since the user's last visit
 * and provide a function to mark the room as visited
 */
export function useRoomRenovationStatus(
  roomId: string,
  floorNumber: number
): RoomRenovationStatus {
  const { user } = useAuth();
  const [isNewlyRenovated, setIsNewlyRenovated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setIsNewlyRenovated(false);
      setLoading(false);
      return;
    }

    checkRenovationStatus();
  }, [user?.id, roomId, floorNumber]);

  const checkRenovationStatus = async () => {
    if (!user) return;

    try {
      setLoading(true);

      // Call the database function to check if room is newly renovated
      // Using type assertion until types regenerate
      const { data, error } = await (supabase.rpc as any)("is_room_newly_renovated", {
        _user_id: user.id,
        _room_id: roomId,
      });

      if (error) throw error;

      setIsNewlyRenovated(data === true);
    } catch (error) {
      console.error("Error checking room renovation status:", error);
      setIsNewlyRenovated(false);
    } finally {
      setLoading(false);
    }
  };

  const markAsVisited = async () => {
    if (!user) return;

    try {
      // Call the database function to mark room as visited
      // Using type assertion until types regenerate
      const { error } = await (supabase.rpc as any)("mark_room_visited", {
        _user_id: user.id,
        _room_id: roomId,
      });

      if (error) throw error;

      // Update local state immediately (optimistic update)
      setIsNewlyRenovated(false);
    } catch (error) {
      console.error("Error marking room as visited:", error);
    }
  };

  return {
    isNewlyRenovated,
    loading,
    markAsVisited,
  };
}
