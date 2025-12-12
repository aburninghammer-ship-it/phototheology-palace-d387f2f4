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
    let realtimeChannel: any = null;
    
    const updateLastSeen = async () => {
      if (!isSubscribed) return;
      
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (user && isSubscribed) {
          await supabase
            .from("profiles")
            .update({ last_seen: new Date().toISOString() })
            .eq("id", user.id);
        }
      } catch (error) {
        console.error("Error updating last_seen:", error);
      }
    };

    const fetchActiveUsers = async () => {
      if (!isSubscribed) return;
      
      try {
        const fifteenMinutesAgo = new Date(Date.now() - 15 * 60 * 1000).toISOString();
        const { data, count, error } = await supabase
          .from("profiles")
          .select("id, username, display_name, avatar_url, last_seen, current_floor, master_title", { count: "exact" })
          .gte("last_seen", fifteenMinutesAgo)
          .order("last_seen", { ascending: false });
        
        if (!error && isSubscribed && data) {
          setActiveCount(count || data.length);
          setActiveUsers(data);
        } else if (error) {
          console.error("Error fetching active users:", error);
        }
      } catch (error) {
        console.error("Error in fetchActiveUsers:", error);
      }
    };

    // Update user's last_seen immediately
    updateLastSeen();
    
    // Fetch active users count immediately
    fetchActiveUsers();
    
    // Update every 30 seconds for more responsive count
    const interval = setInterval(() => {
      updateLastSeen();
      fetchActiveUsers();
    }, 30000);

    // Set up realtime subscription for profile updates
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user?.id || !isSubscribed) return;
      
      realtimeChannel = supabase
        .channel('profiles-active-users')
        .on(
          'postgres_changes',
          {
            event: 'UPDATE',
            schema: 'public',
            table: 'profiles'
          },
          () => {
            if (isSubscribed) {
              fetchActiveUsers();
            }
          }
        )
        .subscribe();
    });

    return () => {
      isSubscribed = false;
      clearInterval(interval);
      if (realtimeChannel) {
        supabase.removeChannel(realtimeChannel);
      }
    };
  }, []);

  return { activeCount, activeUsers };
};
