import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

interface ActiveUser {
  id: string;
  username: string;
  display_name: string | null;
  avatar_url: string | null;
  last_seen: string;
  current_floor: number;
  master_title: string | null;
}

export const useActiveUsers = () => {
  const [activeCount, setActiveCount] = useState(0);
  const [activeUsers, setActiveUsers] = useState<ActiveUser[]>([]);

  useEffect(() => {
    let isSubscribed = true;
    let realtimeChannel: ReturnType<typeof supabase.channel> | null = null;

    const updateLastSeen = async () => {
      if (!isSubscribed) return;

      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (user && isSubscribed) {
          const { error } = await supabase
            .from("profiles")
            .update({ last_seen: new Date().toISOString() })
            .eq("id", user.id);

          if (error) {
            console.error("Error updating last_seen:", error);
          }
        }
      } catch (error) {
        console.error("Error updating last_seen:", error);
      }
    };

    const fetchActiveUsers = async () => {
      if (!isSubscribed) return;

      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();

        // If the viewer isn't signed in, we can still show the count via RPC,
        // but we should NOT query the profiles table (will 401 under RLS).
        if (!user) {
          const { data, error } = await supabase.rpc("get_active_user_count");
          if (error) {
            console.error("Error fetching active user count:", error);
            return;
          }

          if (isSubscribed && typeof data === "number") {
            setActiveCount(data);
            setActiveUsers([]);
          }
          return;
        }

        // Authenticated: fetch actual active users list.
        // Use 60 minutes window to account for users with cached old code
        // who haven't refreshed yet to get the presence tracker updates.
        const sixtyMinutesAgo = new Date(Date.now() - 60 * 60 * 1000).toISOString();
        const { data, count, error } = await supabase
          .from("profiles")
          .select(
            "id, username, display_name, avatar_url, last_seen, current_floor, master_title",
            { count: "exact" }
          )
          .gte("last_seen", sixtyMinutesAgo)
          .order("last_seen", { ascending: false });

        if (!error && isSubscribed && data) {
          const actualCount = count ?? data.length;
          setActiveCount(actualCount);
          setActiveUsers(data);
        } else if (error) {
          console.error("Error fetching active users:", error);
        }
      } catch (error) {
        console.error("Error in fetchActiveUsers:", error);
      }
    };

    const ensureRealtimeSubscribed = async () => {
      if (!isSubscribed || realtimeChannel) return;

      const {
        data: { user },
      } = await supabase.auth.getUser();

      // Only subscribe when authenticated (otherwise the channel will error)
      if (!user) return;

      realtimeChannel = supabase
        .channel("profiles-active-users-global")
        .on(
          "postgres_changes",
          {
            event: "UPDATE",
            schema: "public",
            table: "profiles",
            filter: "last_seen=neq.null",
          },
          () => {
            if (isSubscribed) void fetchActiveUsers();
          }
        )
        .subscribe((status) => {
          console.log(`[ActiveUsers] Realtime subscription status: ${status}`);
        });
    };

    // Initial load
    void fetchActiveUsers();
    void updateLastSeen();
    void ensureRealtimeSubscribed();

    // Update every 30 seconds for more responsive count
    const interval = setInterval(() => {
      void updateLastSeen();
      void fetchActiveUsers();
    }, 30000);

    // Also listen for auth state changes to start realtime after login
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event) => {
      if (event === "SIGNED_IN") {
        console.log("[ActiveUsers] User signed in, updating last_seen");
        void updateLastSeen();
        void fetchActiveUsers();
        void ensureRealtimeSubscribed();
      }
    });

    return () => {
      isSubscribed = false;
      clearInterval(interval);
      subscription?.unsubscribe();
      if (realtimeChannel) {
        supabase.removeChannel(realtimeChannel);
      }
    };
  }, []);

  return { activeCount, activeUsers };
};
