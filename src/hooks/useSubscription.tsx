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
  tier: 'free' | 'essential' | 'premium' | 'student' | null;
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
      // Query profiles table directly
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('subscription_tier, subscription_status, has_lifetime_access, trial_ends_at, promotional_access_expires_at')
        .eq('id', user!.id)
        .single();

      if (profileError) throw profileError;

      // Check church access
      const { data: churchAccess } = await supabase.rpc('has_church_access', {
        _user_id: user!.id
      }).single();

      if (profile) {
        const now = new Date();
        const hasLifetime = profile.has_lifetime_access || false;
        const hasActiveSub = profile.subscription_status === 'active';
        const hasTrial = profile.trial_ends_at && new Date(profile.trial_ends_at) > now;
        const hasPromo = profile.promotional_access_expires_at && new Date(profile.promotional_access_expires_at) > now;
        const hasChurchAccess = churchAccess?.has_access || false;
        
        const hasPersonalAccess = hasLifetime || hasActiveSub || hasTrial || hasPromo;

        // Determine status
        let status: SubscriptionStatus['status'] = 'none';
        if (hasLifetime || hasActiveSub) status = 'active';
        else if (hasTrial) status = 'trial';
        else if (profile.subscription_status === 'cancelled') status = 'cancelled';

        setSubscription({
          status,
          tier: (profile.subscription_tier as SubscriptionStatus['tier']) || null,
          isStudent: profile.subscription_tier === 'student',
          trialEndsAt: profile.trial_ends_at,
          studentExpiresAt: null,
          promotionalExpiresAt: profile.promotional_access_expires_at,
          hasAccess: hasPersonalAccess || hasChurchAccess,
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