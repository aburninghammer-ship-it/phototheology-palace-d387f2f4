import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { usePageTracking } from "@/hooks/useAnalyticsTracking";
import { useGuestMode } from "@/hooks/useGuestMode";

export const PageTracker = () => {
  usePageTracking();
  const location = useLocation();
  const { isGuestMode, trackPageVisit } = useGuestMode();
  
  // Track guest mode page visits
  useEffect(() => {
    if (isGuestMode) {
      trackPageVisit(location.pathname);
    }
  }, [location.pathname, isGuestMode, trackPageVisit]);
  
  return null;
};
