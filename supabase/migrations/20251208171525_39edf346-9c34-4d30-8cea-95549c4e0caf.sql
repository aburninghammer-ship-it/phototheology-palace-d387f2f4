-- Create secure user_subscriptions table for payment data isolation
CREATE TABLE IF NOT EXISTS public.user_subscriptions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  subscription_status TEXT DEFAULT 'none',
  subscription_tier TEXT DEFAULT 'free',
  stripe_customer_id TEXT,
  stripe_subscription_id TEXT,
  subscription_renewal_date TIMESTAMP WITH TIME ZONE,
  subscription_cancelled_at TIMESTAMP WITH TIME ZONE,
  trial_ends_at TIMESTAMP WITH TIME ZONE,
  has_lifetime_access BOOLEAN DEFAULT FALSE,
  lifetime_access_granted_at TIMESTAMP WITH TIME ZONE,
  promotional_access_expires_at TIMESTAMP WITH TIME ZONE,
  payment_source TEXT,
  is_recurring BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.user_subscriptions ENABLE ROW LEVEL SECURITY;

-- Admin-only access (service role bypasses RLS)
-- No user policies - users access via secure functions only

-- Create admin policy for admin_users
CREATE POLICY "Admins can view all subscriptions"
  ON public.user_subscriptions
  FOR SELECT
  USING (
    EXISTS (SELECT 1 FROM public.admin_users WHERE user_id = auth.uid())
  );

CREATE POLICY "Admins can update subscriptions"
  ON public.user_subscriptions
  FOR UPDATE
  USING (
    EXISTS (SELECT 1 FROM public.admin_users WHERE user_id = auth.uid())
  );

-- Create secure function for users to check their own subscription
CREATE OR REPLACE FUNCTION public.get_subscription_summary(_user_id UUID DEFAULT auth.uid())
RETURNS TABLE (
  status TEXT,
  tier TEXT,
  has_access BOOLEAN,
  trial_ends_at TIMESTAMP WITH TIME ZONE,
  renewal_date TIMESTAMP WITH TIME ZONE,
  has_lifetime BOOLEAN
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Only allow users to check their own subscription (or admins)
  IF _user_id != auth.uid() AND NOT EXISTS (SELECT 1 FROM admin_users WHERE user_id = auth.uid()) THEN
    RAISE EXCEPTION 'Access denied';
  END IF;
  
  RETURN QUERY
  SELECT 
    COALESCE(us.subscription_status, 'none')::TEXT,
    COALESCE(us.subscription_tier, 'free')::TEXT,
    (
      COALESCE(us.has_lifetime_access, false) OR
      us.subscription_status = 'active' OR
      us.subscription_status = 'trial' OR
      (us.promotional_access_expires_at IS NOT NULL AND us.promotional_access_expires_at > NOW()) OR
      (us.trial_ends_at IS NOT NULL AND us.trial_ends_at > NOW())
    )::BOOLEAN,
    us.trial_ends_at,
    us.subscription_renewal_date,
    COALESCE(us.has_lifetime_access, false)::BOOLEAN
  FROM public.user_subscriptions us
  WHERE us.user_id = _user_id;
END;
$$;

-- Create trigger for updated_at
CREATE OR REPLACE FUNCTION public.update_user_subscriptions_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

CREATE TRIGGER update_user_subscriptions_timestamp
  BEFORE UPDATE ON public.user_subscriptions
  FOR EACH ROW
  EXECUTE FUNCTION public.update_user_subscriptions_updated_at();

-- Migrate existing subscription data from profiles
INSERT INTO public.user_subscriptions (
  user_id,
  subscription_status,
  subscription_tier,
  stripe_customer_id,
  trial_ends_at,
  has_lifetime_access,
  lifetime_access_granted_at,
  promotional_access_expires_at
)
SELECT 
  id,
  COALESCE(subscription_status, 'none'),
  COALESCE(subscription_tier, 'free'),
  stripe_customer_id,
  trial_ends_at::TIMESTAMP WITH TIME ZONE,
  COALESCE(has_lifetime_access, false),
  lifetime_access_granted_at,
  promotional_access_expires_at
FROM public.profiles
WHERE id IS NOT NULL
ON CONFLICT (user_id) DO NOTHING;

-- Create index for stripe lookups
CREATE INDEX IF NOT EXISTS idx_user_subscriptions_stripe_customer 
  ON public.user_subscriptions(stripe_customer_id);

CREATE INDEX IF NOT EXISTS idx_user_subscriptions_status 
  ON public.user_subscriptions(subscription_status);