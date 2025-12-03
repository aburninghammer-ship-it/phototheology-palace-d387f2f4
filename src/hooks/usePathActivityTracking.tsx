import { useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { usePath } from "./usePath";
import { useQueryClient } from "@tanstack/react-query";

/**
 * Hook to connect drill/game completions to path activity tracking
 * When a drill is completed successfully, this marks the corresponding path activity as complete
 */
export const usePathActivityTracking = () => {
  const { activePath } = usePath();
  const queryClient = useQueryClient();

  /**
   * Mark a path activity as complete
   * @param activityId - The path activity ID (e.g., "visual-1-1-1")
   */
  const markPathActivityComplete = useCallback(async (activityId: string) => {
    if (!activePath) return;

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Check if already completed
      const { data: existing } = await (supabase as any)
        .from('path_activity_completions')
        .select('id')
        .eq('user_id', user.id)
        .eq('activity_id', activityId)
        .maybeSingle();

      if (existing) return; // Already completed

      // Save completion
      await (supabase as any)
        .from('path_activity_completions')
        .insert({
          user_id: user.id,
          activity_id: activityId,
          path_id: activePath.id,
          completed_at: new Date().toISOString()
        });

      // Invalidate queries to refresh UI
      queryClient.invalidateQueries({ queryKey: ["path-access"] });
      queryClient.invalidateQueries({ queryKey: ["path-activity-completions"] });
    } catch (error) {
      console.error("Error marking path activity complete:", error);
    }
  }, [activePath, queryClient]);

  /**
   * Called when a drill is completed successfully
   * Maps drill completion to path activity and marks it complete
   */
  const onDrillComplete = useCallback(async (
    drillType: string,
    roomId: string,
    score: number,
    maxScore: number,
    pathActivityId?: string
  ) => {
    const percentage = (score / maxScore) * 100;
    
    // Only mark as complete if score is 80% or higher
    if (percentage < 80) return;

    // If a specific path activity ID was provided, use it
    if (pathActivityId) {
      await markPathActivityComplete(pathActivityId);
      return;
    }

    // Otherwise, the drill was done outside path context - no path tracking
  }, [markPathActivityComplete]);

  return {
    markPathActivityComplete,
    onDrillComplete,
    hasActivePath: !!activePath
  };
};
