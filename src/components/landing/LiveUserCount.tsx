import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Users } from "lucide-react";

export const LiveUserCount = () => {
  const { data: userCount } = useQuery({
    queryKey: ["total-user-count"],
    queryFn: async () => {
      const { count, error } = await supabase
        .from("profiles")
        .select("*", { count: "exact", head: true });
      
      if (error) throw error;
      return count || 0;
    },
    staleTime: 1000 * 60 * 5, // Cache for 5 minutes
  });

  if (!userCount || userCount < 10) return null;

  return (
    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-green-500/10 border border-green-500/20 text-sm">
      <span className="relative flex h-2 w-2">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
        <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500" />
      </span>
      <Users className="h-3.5 w-3.5 text-green-600" />
      <span className="font-medium text-green-700 dark:text-green-400">
        {userCount.toLocaleString()}+ students joined
      </span>
    </div>
  );
};
