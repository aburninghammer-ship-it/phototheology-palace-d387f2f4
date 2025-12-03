import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./useAuth";
import { toast } from "sonner";
import { useAchievements } from "./useAchievements";
import { usePathActivityTracking } from "./usePathActivityTracking";

export interface DrillQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation?: string;
}

export interface DrillResult {
  score: number;
  maxScore: number;
  timeSeconds: number;
  answers: { questionId: string; correct: boolean }[];
}

export const useDrills = (floorNumber: number, roomId: string) => {
  const { user } = useAuth();
  const { checkAndAwardAchievements } = useAchievements();
  const { onDrillComplete } = usePathActivityTracking();
  const [loading, setLoading] = useState(false);

  const saveDrillResult = async (
    drillType: string,
    result: DrillResult,
    drillData: any = {},
    pathActivityId?: string // Optional: marks path activity on success
  ) => {
    if (!user) {
      toast.error("Please sign in to save your progress");
      return;
    }

    try {
      const { error } = await supabase.from("drill_results").insert({
        user_id: user.id,
        floor_number: floorNumber,
        room_id: roomId,
        drill_type: drillType,
        score: result.score,
        max_score: result.maxScore,
        time_seconds: result.timeSeconds,
        drill_data: { ...drillData, answers: result.answers },
      });

      if (error) throw error;

      const percentage = Math.round((result.score / result.maxScore) * 100);
      
      if (percentage >= 80) {
        toast.success(`Excellent! You scored ${percentage}%`);
        
        // Auto-mark path activity as complete on successful drill
        await onDrillComplete(drillType, roomId, result.score, result.maxScore, pathActivityId);
      } else if (percentage >= 60) {
        toast.success(`Good job! You scored ${percentage}%`);
      } else {
        toast.info(`You scored ${percentage}%. Keep practicing!`);
      }

      // Check for new achievements
      await checkAndAwardAchievements();
    } catch (error) {
      console.error("Error saving drill result:", error);
      toast.error("Failed to save drill result");
    }
  };

  const getDrillHistory = async (drillType?: string) => {
    if (!user) return [];

    try {
      let query = supabase
        .from("drill_results")
        .select("*")
        .eq("user_id", user.id)
        .eq("floor_number", floorNumber)
        .eq("room_id", roomId)
        .order("completed_at", { ascending: false });

      if (drillType) {
        query = query.eq("drill_type", drillType);
      }

      const { data, error } = await query;

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error("Error fetching drill history:", error);
      return [];
    }
  };

  return {
    loading,
    saveDrillResult,
    getDrillHistory,
  };
};
