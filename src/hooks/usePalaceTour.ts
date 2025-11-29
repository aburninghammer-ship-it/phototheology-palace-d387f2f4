import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./useAuth";

const TOUR_COMPLETED_KEY = "palace_tour_completed";

export function usePalaceTour() {
  const { user } = useAuth();
  const [showTour, setShowTour] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkTourStatus = async () => {
      // Check localStorage first (works for both logged in and anonymous)
      const localCompleted = localStorage.getItem(TOUR_COMPLETED_KEY);
      if (localCompleted === "true") {
        setShowTour(false);
        setLoading(false);
        return;
      }

      // If user is logged in, check profile
      if (user) {
        try {
          const { data } = await supabase
            .from("profiles")
            .select("onboarding_completed")
            .eq("id", user.id)
            .single();

          if (data?.onboarding_completed) {
            // User completed general onboarding, but may not have seen palace tour
            // Check for palace-specific tour completion
            const palaceTourCompleted = localStorage.getItem(`${TOUR_COMPLETED_KEY}_${user.id}`);
            setShowTour(palaceTourCompleted !== "true");
          } else {
            // User hasn't completed onboarding at all
            setShowTour(true);
          }
        } catch (error) {
          console.error("Error checking tour status:", error);
          setShowTour(true);
        }
      } else {
        // Anonymous user - show tour if not seen
        setShowTour(true);
      }

      setLoading(false);
    };

    checkTourStatus();
  }, [user]);

  const completeTour = async () => {
    localStorage.setItem(TOUR_COMPLETED_KEY, "true");
    
    if (user) {
      localStorage.setItem(`${TOUR_COMPLETED_KEY}_${user.id}`, "true");
      
      // Award Palace Explorer achievement if not already awarded
      try {
        const { data: existingAchievement } = await supabase
          .from("user_achievements")
          .select("id")
          .eq("user_id", user.id)
          .eq("achievement_id", "palace-explorer")
          .single();

        if (!existingAchievement) {
          // Check if achievement exists
          const { data: achievement } = await supabase
            .from("achievements")
            .select("id")
            .eq("name", "Palace Explorer")
            .single();

          if (achievement) {
            await supabase.from("user_achievements").insert({
              user_id: user.id,
              achievement_id: achievement.id,
            });
          }
        }
      } catch (error) {
        // Achievement may not exist, that's okay
        console.log("Could not award achievement:", error);
      }
    }

    setShowTour(false);
  };

  const skipTour = () => {
    localStorage.setItem(TOUR_COMPLETED_KEY, "true");
    if (user) {
      localStorage.setItem(`${TOUR_COMPLETED_KEY}_${user.id}`, "true");
    }
    setShowTour(false);
  };

  const resetTour = () => {
    localStorage.removeItem(TOUR_COMPLETED_KEY);
    if (user) {
      localStorage.removeItem(`${TOUR_COMPLETED_KEY}_${user.id}`);
    }
    setShowTour(true);
  };

  return {
    showTour,
    loading,
    completeTour,
    skipTour,
    resetTour,
  };
}
