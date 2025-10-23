import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./useAuth";

interface SubscriptionStatus {
  status: 'none' | 'trial' | 'active' | 'cancelled' | 'expired';
  tier: 'free' | 'essential' | 'premium' | 'student' | null;
  isStudent: boolean;
  trialEndsAt: string | null;
  studentExpiresAt: string | null;
  hasAccess: boolean;
}

export function useSubscription() {
  const { user } = useAuth();
  const [subscription, setSubscription] = useState<SubscriptionStatus>({
    status: 'none',
    tier: null,
    isStudent: false,
    trialEndsAt: null,
    studentExpiresAt: null,
    hasAccess: false,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadSubscription();
    } else {
      setLoading(false);
    }
  }, [user]);

  const loadSubscription = async () => {
    try {
      const { data: profile } = await supabase
        .from("profiles")
        .select("subscription_status, subscription_tier, trial_ends_at, is_student, student_expires_at")
        .eq("id", user!.id)
        .single();

      if (profile) {
        const now = new Date();
        const trialValid = profile.trial_ends_at && new Date(profile.trial_ends_at) > now;
        const studentValid = profile.is_student && profile.student_expires_at && new Date(profile.student_expires_at) > now;
        
        setSubscription({
          status: (profile.subscription_status as any) || 'none',
          tier: (profile.subscription_tier as any) || null,
          isStudent: profile.is_student || false,
          trialEndsAt: profile.trial_ends_at,
          studentExpiresAt: profile.student_expires_at,
          hasAccess: profile.subscription_status === 'active' || trialValid || studentValid,
        });
      }
    } catch (error) {
      console.error("Error loading subscription:", error);
    } finally {
      setLoading(false);
    }
  };

  const refreshSubscription = () => {
    loadSubscription();
  };

  return { subscription, loading, refreshSubscription };
}
