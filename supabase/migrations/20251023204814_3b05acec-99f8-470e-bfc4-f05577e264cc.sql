-- Add trial and subscription tracking to profiles
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS trial_started_at TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS trial_ends_at TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS subscription_status TEXT DEFAULT 'none' CHECK (subscription_status IN ('none', 'trial', 'active', 'cancelled', 'expired')),
ADD COLUMN IF NOT EXISTS subscription_tier TEXT CHECK (subscription_tier IN ('free', 'essential', 'premium', 'student')),
ADD COLUMN IF NOT EXISTS stripe_customer_id TEXT,
ADD COLUMN IF NOT EXISTS is_student BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS student_verified_at TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS student_expires_at TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS referral_code TEXT UNIQUE;

-- Create referrals table
CREATE TABLE IF NOT EXISTS public.referrals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  referrer_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  referred_user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  referral_code TEXT NOT NULL,
  referred_email TEXT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'signed_up', 'converted', 'rewarded')),
  reward_given BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  converted_at TIMESTAMPTZ,
  UNIQUE(referrer_id, referred_email)
);

-- Enable RLS on referrals
ALTER TABLE public.referrals ENABLE ROW LEVEL SECURITY;

-- Policies for referrals
CREATE POLICY "Users can view their own referrals"
  ON public.referrals
  FOR SELECT
  USING (auth.uid() = referrer_id);

CREATE POLICY "Users can create referrals"
  ON public.referrals
  FOR INSERT
  WITH CHECK (auth.uid() = referrer_id);

-- Create indexes
CREATE INDEX idx_referrals_code ON public.referrals(referral_code);
CREATE INDEX idx_referrals_referrer ON public.referrals(referrer_id);
CREATE INDEX idx_profiles_referral_code ON public.profiles(referral_code);

-- Function to generate unique referral code
CREATE OR REPLACE FUNCTION generate_referral_code(user_id UUID)
RETURNS TEXT AS $$
DECLARE
  code TEXT;
  attempts INT := 0;
BEGIN
  LOOP
    code := 'PT' || UPPER(SUBSTRING(MD5(user_id::TEXT || attempts::TEXT || NOW()::TEXT) FROM 1 FOR 8));
    
    EXIT WHEN NOT EXISTS (SELECT 1 FROM public.profiles WHERE referral_code = code);
    
    attempts := attempts + 1;
    IF attempts > 100 THEN
      RAISE EXCEPTION 'Failed to generate unique referral code';
    END IF;
  END LOOP;
  
  RETURN code;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Update handle_new_user to include referral code and trial
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $function$
DECLARE
  ref_code TEXT;
  incoming_ref_code TEXT;
BEGIN
  -- Generate unique referral code
  ref_code := generate_referral_code(NEW.id);
  
  -- Check for referral code in metadata
  incoming_ref_code := NEW.raw_user_meta_data->>'referral_code';
  
  -- Insert profile with trial
  INSERT INTO public.profiles (
    id, 
    username, 
    display_name, 
    referral_code,
    trial_started_at,
    trial_ends_at,
    subscription_status
  )
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'username', 'user_' || substring(NEW.id::text from 1 for 8)),
    COALESCE(NEW.raw_user_meta_data->>'display_name', 'User'),
    ref_code,
    NOW(),
    NOW() + INTERVAL '7 days',
    'trial'
  );
  
  -- Handle incoming referral
  IF incoming_ref_code IS NOT NULL THEN
    UPDATE public.referrals 
    SET 
      referred_user_id = NEW.id,
      status = 'signed_up'
    WHERE referral_code = incoming_ref_code AND status = 'pending';
  END IF;
  
  -- Assign default user role
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, 'user');
  
  RETURN NEW;
END;
$function$;