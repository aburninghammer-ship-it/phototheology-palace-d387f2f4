import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { differenceInDays, differenceInHours } from "date-fns";

interface TrialStatus {
  isOnTrial: boolean;
  daysLeft: number;
  hoursLeft: number;
  isExpired: boolean;
  isExpiringSoon: boolean; // 3 days or less
  trialEndsAt: Date | null;
}

export function useTrialStatus() {
  const { user } = useAuth();
  const [status, setStatus] = useState<TrialStatus>({
    isOnTrial: false,
    daysLeft: 0,
    hoursLeft: 0,
    isExpired: false,
    isExpiringSoon: false,
    trialEndsAt: null,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    const checkTrial = async () => {
      const { data } = await supabase
        .from('user_subscriptions')
        .select('subscription_status, trial_ends_at')
        .eq('user_id', user.id)
        .maybeSingle();

      if (data?.subscription_status === 'trial' && data.trial_ends_at) {
        const endDate = new Date(data.trial_ends_at);
        const now = new Date();
        const daysLeft = Math.max(0, differenceInDays(endDate, now));
        const hoursLeft = Math.max(0, differenceInHours(endDate, now));
        const isExpired = endDate < now;

        setStatus({
          isOnTrial: true,
          daysLeft,
          hoursLeft,
          isExpired,
          isExpiringSoon: daysLeft <= 3 && !isExpired,
          trialEndsAt: endDate,
        });
      } else {
        setStatus({
          isOnTrial: false,
          daysLeft: 0,
          hoursLeft: 0,
          isExpired: false,
          isExpiringSoon: false,
          trialEndsAt: null,
        });
      }
      setLoading(false);
    };

    checkTrial();
  }, [user]);

  return { ...status, loading };
}
