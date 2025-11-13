import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Users } from "lucide-react";

export function UserCountBadge() {
  const [userCount, setUserCount] = useState<number | null>(null);

  useEffect(() => {
    const fetchUserCount = async () => {
      const { count } = await supabase
        .from("profiles")
        .select("*", { count: "exact", head: true })
        .or("subscription_status.eq.active,subscription_status.eq.trial,has_lifetime_access.eq.true");
      
      setUserCount(count || 0);
    };

    fetchUserCount();
  }, []);

  if (userCount === null) return null;

  return (
    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 backdrop-blur-sm">
      <Users className="w-4 h-4 text-primary" />
      <span className="text-sm font-semibold text-foreground">
        {userCount} users and counting
      </span>
    </div>
  );
}
