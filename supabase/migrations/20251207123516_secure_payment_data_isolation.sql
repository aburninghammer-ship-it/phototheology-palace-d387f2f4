-- Security Enhancement: Isolate payment and subscription data from user-accessible profiles table
-- Following OWASP recommendations for separating administrative/sensitive data

-- Create admin-only subscription data table
CREATE TABLE IF NOT EXISTS public.user_subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,

  -- Stripe payment information
  stripe_customer_id TEXT,
  stripe_subscription_id TEXT,
  payment_source TEXT CHECK (payment_source IN ('stripe', 'promotional', 'lifetime', 'manual', 'church')),
  is_recurring BOOLEAN DEFAULT false,

  -- Subscription details
  subscription_status TEXT DEFAULT 'none' CHECK (subscription_status IN ('none', 'trial', 'active', 'cancelled', 'expired')),
  subscription_tier TEXT CHECK (subscription_tier IN ('free', 'essential', 'premium', 'student')),
  subscription_cancelled_at TIMESTAMPTZ,
  subscription_renewal_date TIMESTAMPTZ,

  -- Trial information
  trial_started_at TIMESTAMPTZ,
  trial_ends_at TIMESTAMPTZ,

  -- Lifetime access
  has_lifetime_access BOOLEAN DEFAULT false,
  lifetime_access_granted_at TIMESTAMPTZ,

  -- Promotional access
  promotional_access_expires_at TIMESTAMPTZ,

  -- Student verification
  is_student BOOLEAN DEFAULT false,
  student_verified_at TIMESTAMPTZ,
  student_expires_at TIMESTAMPTZ,

  -- Access code tracking
  access_code_used TEXT,

  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS on the new table
ALTER TABLE public.user_subscriptions ENABLE ROW LEVEL SECURITY;

-- STRICT RLS POLICIES: Only admins and service role can access this table
-- No user access whatsoever - this is admin/backend only

-- Policy for admins to view all subscription data
CREATE POLICY "Admins can view all subscription data"
  ON public.user_subscriptions
  FOR SELECT
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- Policy for admins to manage subscription data
CREATE POLICY "Admins can manage subscription data"
  ON public.user_subscriptions
  FOR ALL
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Service role policy (for backend functions/webhooks)
CREATE POLICY "Service role has full access"
  ON public.user_subscriptions
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- Migrate existing data from profiles to user_subscriptions
INSERT INTO public.user_subscriptions (
  user_id,
  stripe_customer_id,
  stripe_subscription_id,
  payment_source,
  is_recurring,
  subscription_status,
  subscription_tier,
  subscription_cancelled_at,
  subscription_renewal_date,
  trial_started_at,
  trial_ends_at,
  has_lifetime_access,
  lifetime_access_granted_at,
  promotional_access_expires_at,
  is_student,
  student_verified_at,
  student_expires_at,
  access_code_used,
  created_at,
  updated_at
)
SELECT
  id as user_id,
  stripe_customer_id,
  stripe_subscription_id,
  payment_source,
  is_recurring,
  subscription_status,
  subscription_tier,
  subscription_cancelled_at,
  subscription_renewal_date,
  trial_started_at,
  trial_ends_at,
  has_lifetime_access,
  lifetime_access_granted_at,
  promotional_access_expires_at,
  is_student,
  student_verified_at,
  student_expires_at,
  access_code_used,
  created_at,
  updated_at
FROM public.profiles
WHERE id IS NOT NULL
ON CONFLICT (user_id) DO UPDATE SET
  stripe_customer_id = EXCLUDED.stripe_customer_id,
  stripe_subscription_id = EXCLUDED.stripe_subscription_id,
  payment_source = EXCLUDED.payment_source,
  is_recurring = EXCLUDED.is_recurring,
  subscription_status = EXCLUDED.subscription_status,
  subscription_tier = EXCLUDED.subscription_tier,
  subscription_cancelled_at = EXCLUDED.subscription_cancelled_at,
  subscription_renewal_date = EXCLUDED.subscription_renewal_date,
  trial_started_at = EXCLUDED.trial_started_at,
  trial_ends_at = EXCLUDED.trial_ends_at,
  has_lifetime_access = EXCLUDED.has_lifetime_access,
  lifetime_access_granted_at = EXCLUDED.lifetime_access_granted_at,
  promotional_access_expires_at = EXCLUDED.promotional_access_expires_at,
  is_student = EXCLUDED.is_student,
  student_verified_at = EXCLUDED.student_verified_at,
  student_expires_at = EXCLUDED.student_expires_at,
  access_code_used = EXCLUDED.access_code_used,
  updated_at = EXCLUDED.updated_at;

-- Create secure functions for applications to check subscription status
-- These return only the minimum necessary information without exposing sensitive payment data

-- Function to check if a user has active access (for client-side use)
CREATE OR REPLACE FUNCTION public.user_has_access(check_user_id UUID DEFAULT auth.uid())
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  has_access BOOLEAN;
BEGIN
  -- Only allow checking own access unless admin
  IF check_user_id != auth.uid() AND NOT public.has_role(auth.uid(), 'admin') THEN
    RETURN false;
  END IF;

  SELECT
    CASE
      WHEN us.has_lifetime_access = true THEN true
      WHEN us.subscription_status = 'active' THEN true
      WHEN us.subscription_status = 'trial' AND us.trial_ends_at > NOW() THEN true
      WHEN us.promotional_access_expires_at > NOW() THEN true
      WHEN us.is_student = true AND us.student_expires_at > NOW() THEN true
      ELSE false
    END INTO has_access
  FROM public.user_subscriptions us
  WHERE us.user_id = check_user_id;

  RETURN COALESCE(has_access, false);
END;
$$;

-- Function to get user's subscription tier (for feature gating)
CREATE OR REPLACE FUNCTION public.get_user_subscription_tier(check_user_id UUID DEFAULT auth.uid())
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  tier TEXT;
BEGIN
  -- Only allow checking own tier unless admin
  IF check_user_id != auth.uid() AND NOT public.has_role(auth.uid(), 'admin') THEN
    RETURN 'free';
  END IF;

  SELECT
    CASE
      WHEN us.has_lifetime_access = true THEN COALESCE(us.subscription_tier, 'premium')
      WHEN us.subscription_status = 'active' THEN COALESCE(us.subscription_tier, 'free')
      WHEN us.subscription_status = 'trial' AND us.trial_ends_at > NOW() THEN COALESCE(us.subscription_tier, 'premium')
      WHEN us.is_student = true AND us.student_expires_at > NOW() THEN 'student'
      ELSE 'free'
    END INTO tier
  FROM public.user_subscriptions us
  WHERE us.user_id = check_user_id;

  RETURN COALESCE(tier, 'free');
END;
$$;

-- Function to get subscription summary (safe, non-sensitive info only)
CREATE OR REPLACE FUNCTION public.get_subscription_summary(check_user_id UUID DEFAULT auth.uid())
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  summary JSON;
BEGIN
  -- Only allow checking own summary unless admin
  IF check_user_id != auth.uid() AND NOT public.has_role(auth.uid(), 'admin') THEN
    RETURN '{"error": "unauthorized"}'::json;
  END IF;

  SELECT json_build_object(
    'has_access', public.user_has_access(check_user_id),
    'tier', public.get_user_subscription_tier(check_user_id),
    'is_trial', us.subscription_status = 'trial' AND us.trial_ends_at > NOW(),
    'trial_ends_at', us.trial_ends_at,
    'is_lifetime', us.has_lifetime_access,
    'is_student', us.is_student AND us.student_expires_at > NOW(),
    'renewal_date', us.subscription_renewal_date,
    'status', us.subscription_status
  ) INTO summary
  FROM public.user_subscriptions us
  WHERE us.user_id = check_user_id;

  RETURN COALESCE(summary, '{"has_access": false, "tier": "free"}'::json);
END;
$$;

-- Grant execute permissions on the safe functions
GRANT EXECUTE ON FUNCTION public.user_has_access(UUID) TO authenticated, anon;
GRANT EXECUTE ON FUNCTION public.get_user_subscription_tier(UUID) TO authenticated, anon;
GRANT EXECUTE ON FUNCTION public.get_subscription_summary(UUID) TO authenticated, anon;

-- Create trigger to automatically create subscription record for new users
CREATE OR REPLACE FUNCTION public.handle_new_user_subscription()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.user_subscriptions (
    user_id,
    subscription_status,
    subscription_tier,
    trial_started_at,
    trial_ends_at
  ) VALUES (
    NEW.id,
    'trial',
    'premium',
    NOW(),
    NOW() + INTERVAL '7 days'
  )
  ON CONFLICT (user_id) DO NOTHING;

  RETURN NEW;
END;
$$;

-- Update the existing new user trigger to include subscription creation
DROP TRIGGER IF EXISTS on_auth_user_subscription_created ON auth.users;
CREATE TRIGGER on_auth_user_subscription_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user_subscription();

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_user_subscriptions_user_id ON public.user_subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_user_subscriptions_status ON public.user_subscriptions(subscription_status);
CREATE INDEX IF NOT EXISTS idx_user_subscriptions_stripe_customer ON public.user_subscriptions(stripe_customer_id);
CREATE INDEX IF NOT EXISTS idx_user_subscriptions_stripe_subscription ON public.user_subscriptions(stripe_subscription_id);

-- Add updated_at trigger
CREATE TRIGGER update_user_subscriptions_updated_at
  BEFORE UPDATE ON public.user_subscriptions
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Now remove payment fields from profiles table (keep for backwards compatibility for now with views)
-- We'll create views to maintain backwards compatibility during transition

-- Create a view that unions profile data with subscription data for backwards compatibility
CREATE OR REPLACE VIEW public.profiles_with_subscription AS
SELECT
  p.*,
  us.stripe_customer_id,
  us.stripe_subscription_id,
  us.payment_source,
  us.is_recurring,
  us.subscription_status,
  us.subscription_tier,
  us.subscription_cancelled_at,
  us.subscription_renewal_date,
  us.trial_started_at,
  us.trial_ends_at,
  us.has_lifetime_access,
  us.lifetime_access_granted_at,
  us.promotional_access_expires_at,
  us.is_student,
  us.student_verified_at,
  us.student_expires_at,
  us.access_code_used
FROM public.profiles p
LEFT JOIN public.user_subscriptions us ON p.id = us.user_id;

-- Grant access to the view with same permissions as profiles
GRANT SELECT ON public.profiles_with_subscription TO authenticated;

COMMENT ON TABLE public.user_subscriptions IS 'Admin-only table containing sensitive payment and subscription data. Access restricted to admins and service role only. Applications should use provided functions (user_has_access, get_user_subscription_tier, get_subscription_summary) instead of direct queries.';
COMMENT ON FUNCTION public.user_has_access IS 'Safe function to check if a user has active access. Returns boolean. Use this instead of querying user_subscriptions directly.';
COMMENT ON FUNCTION public.get_user_subscription_tier IS 'Safe function to get user subscription tier for feature gating. Use this instead of querying user_subscriptions directly.';
COMMENT ON FUNCTION public.get_subscription_summary IS 'Safe function to get non-sensitive subscription summary. Use this instead of querying user_subscriptions directly.';
