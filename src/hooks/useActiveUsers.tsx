import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export const useActiveUsers = () => {
  const [activeCount, setActiveCount] = useState(0);

  useEffect(() => {
    const updateLastSeen = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        await supabase
          .from("profiles")
          .update({ last_seen: new Date().toISOString() })
          .eq("id", user.id);
      }
    };

    const fetchActiveUsers = async () => {
      const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000).toISOString();
      const { count } = await supabase
        .from("profiles")
        .select("*", { count: "exact", head: true })
        .gte("last_seen", fiveMinutesAgo);
      
      setActiveCount(count || 0);
    };

    // Update user's last_seen
    updateLastSeen();

    // Fetch active users count
    fetchActiveUsers();

    // Update every 30 seconds
    const interval = setInterval(() => {
      updateLastSeen();
      fetchActiveUsers();
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  return activeCount;
};
