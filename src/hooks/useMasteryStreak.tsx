import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "./use-toast";

export interface MasteryStreak {
  id: string;
  user_id: string;
  current_streak: number;
  longest_streak: number;
  last_activity_date: string;
  total_active_days: number;
  created_at: string;
  updated_at: string;
}

export interface StreakUpdateResult {
  streak_continued: boolean;
  current_streak: number;
  message: string;
}

export const useMasteryStreak = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch streak data
  const { data: streak, isLoading } = useQuery({
    queryKey: ["mastery-streak"],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const { data, error } = await supabase
        .from("mastery_streaks")
        .select("*")
        .eq("user_id", user.id)
        .maybeSingle();

      if (error) throw error;
      return data as MasteryStreak | null;
    },
  });

  // Update streak mutation
  const updateStreak = useMutation({
    mutationFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const { data, error } = await supabase.rpc("update_mastery_streak", {
        p_user_id: user.id,
      });

      if (error) throw error;
      return data as unknown as StreakUpdateResult;
    },
    onSuccess: (result) => {
      queryClient.invalidateQueries({ queryKey: ["mastery-streak"] });

      if (result.streak_continued) {
        toast({
          title: "🔥 Streak Continued!",
          description: `${result.current_streak} day${result.current_streak > 1 ? 's' : ''} in a row!`,
          duration: 4000,
        });
      }
    },
    onError: (error) => {
      console.error("Failed to update streak:", error);
    },
  });

  return {
    streak,
    isLoading,
    updateStreak: updateStreak.mutate,
    isUpdating: updateStreak.isPending,
  };
};
