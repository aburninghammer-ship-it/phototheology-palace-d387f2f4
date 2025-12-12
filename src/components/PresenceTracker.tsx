import { usePresenceTracker } from "@/hooks/usePresenceTracker";

/**
 * Invisible component that tracks user presence.
 * This ensures all authenticated users have their last_seen updated,
 * making them visible in the active users count.
 */
export const PresenceTracker = () => {
  usePresenceTracker();
  return null;
};
