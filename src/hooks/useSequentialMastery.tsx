import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./useAuth";

interface SequentialMasteryState {
  canMaster: boolean;
  previousFloorsCompleted: boolean[];
  nextFloorToMaster: number;
  loading: boolean;
  masteryMessage: string;
}

export const useSequentialMastery = (floorNumber: number) => {
  const { user } = useAuth();
  const [state, setState] = useState<SequentialMasteryState>({
    canMaster: floorNumber === 1, // Floor 1 can always be mastered
    previousFloorsCompleted: [],
    nextFloorToMaster: 1,
    loading: true,
    masteryMessage: "",
  });

  useEffect(() => {
    const checkSequentialMastery = async () => {
      if (!user) {
        setState(prev => ({
          ...prev,
          canMaster: false,
          loading: false,
          masteryMessage: "Sign in to track your mastery progress",
        }));
        return;
      }

      try {
        // Check if user is admin - admins can master any floor
        const { data: roleData } = await supabase
          .from("user_roles")
          .select("role")
          .eq("user_id", user.id)
          .eq("role", "admin")
          .maybeSingle();

        if (roleData) {
          setState({
            canMaster: true,
            previousFloorsCompleted: Array(floorNumber - 1).fill(true),
            nextFloorToMaster: floorNumber,
            loading: false,
            masteryMessage: "",
          });
          return;
        }

        // Get all floor progress for this user
        const { data: floorProgress, error } = await supabase
          .from("user_floor_progress")
          .select("floor_number, floor_completed_at")
          .eq("user_id", user.id)
          .order("floor_number", { ascending: true });

        if (error) throw error;

        // Create a map of completed floors
        const completedFloors = new Set(
          (floorProgress || [])
            .filter(fp => fp.floor_completed_at !== null)
            .map(fp => fp.floor_number)
        );

        // Check which previous floors are completed
        const previousFloorsCompleted: boolean[] = [];
        for (let i = 1; i < floorNumber; i++) {
          previousFloorsCompleted.push(completedFloors.has(i));
        }

        // Find the next floor to master (first incomplete floor)
        let nextFloorToMaster = 1;
        for (let i = 1; i <= 8; i++) {
          if (!completedFloors.has(i)) {
            nextFloorToMaster = i;
            break;
          }
        }

        // Can master this floor if all previous floors are completed
        const canMaster = floorNumber === 1 || previousFloorsCompleted.every(Boolean);

        // Generate appropriate message
        let masteryMessage = "";
        if (!canMaster) {
          const incompleteFloors = previousFloorsCompleted
            .map((completed, idx) => (!completed ? idx + 1 : null))
            .filter(Boolean) as number[];
          
          if (incompleteFloors.length === 1) {
            masteryMessage = `Complete Floor ${incompleteFloors[0]} first to unlock mastery for this floor`;
          } else {
            masteryMessage = `Complete Floors ${incompleteFloors.join(", ")} first to unlock mastery for this floor`;
          }
        }

        setState({
          canMaster,
          previousFloorsCompleted,
          nextFloorToMaster,
          loading: false,
          masteryMessage,
        });
      } catch (error) {
        console.error("Error checking sequential mastery:", error);
        setState(prev => ({
          ...prev,
          canMaster: false,
          loading: false,
          masteryMessage: "Error checking mastery eligibility",
        }));
      }
    };

    checkSequentialMastery();
  }, [user, floorNumber]);

  return state;
};
