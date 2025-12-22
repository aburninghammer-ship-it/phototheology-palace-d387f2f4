import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";

const WEEKLY_GEM_LIMIT = 5;

export const useGemLimit = () => {
  const [gemsThisWeek, setGemsThisWeek] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  const fetchWeeklyGemCount = useCallback(async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setIsLoading(false);
        return;
      }

      // Get the start of the current week (Sunday)
      const now = new Date();
      const startOfWeek = new Date(now);
      startOfWeek.setDate(now.getDate() - now.getDay());
      startOfWeek.setHours(0, 0, 0, 0);

      const { count, error } = await supabase
        .from('user_gems')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id)
        .gte('created_at', startOfWeek.toISOString());

      if (error) throw error;
      setGemsThisWeek(count || 0);
    } catch (error) {
      console.error('Error fetching gem count:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchWeeklyGemCount();
  }, [fetchWeeklyGemCount]);

  const canCreateGem = gemsThisWeek < WEEKLY_GEM_LIMIT;
  const gemsRemaining = Math.max(0, WEEKLY_GEM_LIMIT - gemsThisWeek);

  const getLimitMessage = () => {
    if (canCreateGem) {
      return `You have ${gemsRemaining} gem${gemsRemaining === 1 ? '' : 's'} remaining this week (${gemsThisWeek}/${WEEKLY_GEM_LIMIT} used).`;
    }
    return `You've reached your weekly limit of ${WEEKLY_GEM_LIMIT} gems. Your limit resets on Sunday.`;
  };

  return {
    gemsThisWeek,
    gemsRemaining,
    canCreateGem,
    isLoading,
    weeklyLimit: WEEKLY_GEM_LIMIT,
    getLimitMessage,
    refetch: fetchWeeklyGemCount,
  };
};
