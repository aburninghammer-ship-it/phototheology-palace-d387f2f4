import { useState, useEffect } from "react";
import { useAuth } from "./useAuth";

const TOUR_KEY = "genesis_gallery_tour_completed";

export function use24FPSTour() {
  const { user } = useAuth();
  const [showTour, setShowTour] = useState(false);
  const [loading, setLoading] = useState(true);

  const storageKey = user ? `${TOUR_KEY}_${user.id}` : TOUR_KEY;

  useEffect(() => {
    const checkTourStatus = () => {
      // Check if this is first visit to 24FPS from onboarding
      const fromOnboarding = localStorage.getItem("onboarding_completed") === "true";
      const tourCompleted = localStorage.getItem(storageKey) === "true";

      // Show tour if onboarding was just completed and tour hasn't been seen
      if (fromOnboarding && !tourCompleted) {
        setShowTour(true);
      } else {
        setShowTour(false);
      }
      setLoading(false);
    };

    checkTourStatus();
  }, [storageKey]);

  const completeTour = () => {
    localStorage.setItem(storageKey, "true");
    setShowTour(false);
  };

  const skipTour = () => {
    localStorage.setItem(storageKey, "true");
    setShowTour(false);
  };

  const resetTour = () => {
    localStorage.removeItem(storageKey);
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
