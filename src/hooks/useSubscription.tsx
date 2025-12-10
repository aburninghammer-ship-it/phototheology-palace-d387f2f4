import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./useAuth";

interface ChurchAccess {
  hasChurchAccess: boolean;
  churchId: string | null;
  churchTier: 'tier1' | 'tier2' | 'tier3' | null;
  churchRole: 'admin' | 'leader' | 'member' | null;
}

interface SubscriptionStatus {
  status: 'none' | 'trial' | 'active' | 'cancelled' | 'expired';
  tier: 'free' | 'essential' | 'premium' | 'student' | 'patron' | null;
  isStudent: boolean;
  trialEndsAt: string | null;
  studentExpiresAt: string | null;
  promotionalExpiresAt: string | null;
  hasAccess: boolean;
  church: ChurchAccess;
}

export function useSubscription() {
  const { user } = useAuth();
  const [subscription, setSubscription] = useState<SubscriptionStatus>({
    status: 'none',
    tier: null,
    isStudent: false,
    trialEndsAt: null,
    studentExpiresAt: null,
    promotionalExpiresAt: null,
    hasAccess: false,
    church: {
      hasChurchAccess: false,
      churchId: null,
      churchTier: null,
      churchRole: null,
    },
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
      // Use secure function to get subscription summary
      const { data: subData, error: subError } = await supabase
        .rpc('get_subscription_summary', { _user_id: user!.id });

      // Check church access
      const { data: churchAccess } = await supabase.rpc('has_church_access', {
        _user_id: user!.id
      }).single();

      const hasChurchAccess = churchAccess?.has_access || false;

      if (subData && subData.length > 0) {
        const sub = subData[0];
        
        setSubscription({
          status: sub.status as SubscriptionStatus['status'],
          tier: sub.tier as SubscriptionStatus['tier'],
          isStudent: sub.tier === 'student',
          trialEndsAt: sub.trial_ends_at,
          studentExpiresAt: null,
          promotionalExpiresAt: null,
          hasAccess: sub.has_access || hasChurchAccess,
          church: {
            hasChurchAccess,
            churchId: churchAccess?.church_id || null,
            churchTier: churchAccess?.church_tier as any || null,
            churchRole: churchAccess?.role as any || null,
          },
        });
      } else {
        // No subscription record - set defaults with church access check
        setSubscription({
          status: 'none',
          tier: 'free',
          isStudent: false,
          trialEndsAt: null,
          studentExpiresAt: null,
          promotionalExpiresAt: null,
          hasAccess: hasChurchAccess,
          church: {
            hasChurchAccess,
            churchId: churchAccess?.church_id || null,
            churchTier: churchAccess?.church_tier as any || null,
            churchRole: churchAccess?.role as any || null,
          },
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