import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./useAuth";

// List of recently renovated rooms (updated with new PT methodologies)
const RENOVATED_ROOMS = [
  "sr",   // Story Room - updated with beat methodology
  "ir",   // Imagination Room - sensory immersion
  "24fps", // 24FPS Room - visual GPS system
  "br",   // Bible Rendered - 51 glyph system
  "tr",   // Translation Room - verse to icon
  "gr",   // Gems Room - mining methodology
  "cr",   // Concentration Room - Christ-centered
  "dr",   // Dimensions Room - 6 dimensions
  "prm",  // Patterns Room - updated patterns
  "bl",   // Blue Room - sanctuary pattern
  "pr",   // Prophecy Room - telescope lens
  "fe",   // Feasts Room - feast patterns
  "cycles", // Cycles Room - 8 cycles
  "123h", // Three Heavens - DoL framework
];

// Renovation date - rooms updated after this date show the badge
const RENOVATION_DATE = new Date("2025-01-01");

export const useNewlyRenovatedRoom = (roomId: string) => {
  const { user } = useAuth();

  const { data: hasSeen, isLoading } = useQuery({
    queryKey: ["room-renovated-seen", roomId, user?.id],
    queryFn: async () => {
      if (!user) return false;
      
      // Check if user has visited this room since renovation
      const { data, error } = await supabase
        .from("room_progress")
        .select("updated_at")
        .eq("user_id", user.id)
        .eq("room_id", roomId)
        .gte("updated_at", RENOVATION_DATE.toISOString())
        .maybeSingle();

      if (error) {
        console.error("Error checking room visit:", error);
        return false;
      }

      return !!data;
    },
    enabled: !!user && RENOVATED_ROOMS.includes(roomId),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  const isRenovated = RENOVATED_ROOMS.includes(roomId);
  const showBadge = isRenovated && !hasSeen && !isLoading;

  return {
    isRenovated,
    showBadge,
    isLoading,
  };
};

// Export the list for use elsewhere
export const RECENTLY_RENOVATED_ROOMS = RENOVATED_ROOMS;
