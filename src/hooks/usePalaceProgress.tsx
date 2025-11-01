import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./useAuth";

export const usePalaceProgress = () => {
  const { user } = useAuth();
  const [completedRooms, setCompletedRooms] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadProgress();
    } else {
      setCompletedRooms(0);
      setLoading(false);
    }
  }, [user]);

  const loadProgress = async () => {
    if (!user) return;

    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("room_progress")
        .select("id")
        .eq("user_id", user.id)
        .not("completed_at", "is", null);

      if (error) throw error;
      setCompletedRooms(data?.length || 0);
    } catch (error) {
      console.error("Error loading palace progress:", error);
      setCompletedRooms(0);
    } finally {
      setLoading(false);
    }
  };

  const totalRooms = 38;
  const progressPercentage = Math.round((completedRooms / totalRooms) * 100);

  return { 
    completedRooms, 
    totalRooms, 
    progressPercentage, 
    loading,
    refetch: loadProgress
  };
};
