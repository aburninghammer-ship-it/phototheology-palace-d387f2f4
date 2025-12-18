-- Create youth_safety_profiles table for age verification and parental consent
CREATE TABLE public.youth_safety_profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  date_of_birth DATE,
  parent_name TEXT,
  parent_email TEXT,
  parent_phone TEXT,
  parental_consent_given BOOLEAN DEFAULT false,
  consent_date TIMESTAMP WITH TIME ZONE,
  age_verified BOOLEAN DEFAULT false,
  is_minor BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.youth_safety_profiles ENABLE ROW LEVEL SECURITY;

-- Users can view and manage their own safety profile
CREATE POLICY "Users can view own safety profile"
ON public.youth_safety_profiles FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own safety profile"
ON public.youth_safety_profiles FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own safety profile"
ON public.youth_safety_profiles FOR UPDATE
USING (auth.uid() = user_id);

-- Church admins can view safety profiles for their church members
CREATE POLICY "Church admins can view member safety profiles"
ON public.youth_safety_profiles FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.church_members cm1
    JOIN public.church_members cm2 ON cm1.church_id = cm2.church_id
    WHERE cm1.user_id = auth.uid()
    AND cm1.role = 'admin'
    AND cm2.user_id = youth_safety_profiles.user_id
  )
);

-- Youth leaders can view safety profiles for youth in their church
CREATE POLICY "Youth leaders can view safety profiles"
ON public.youth_safety_profiles FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.youth_leaders yl
    JOIN public.church_members cm ON yl.church_id = cm.church_id
    WHERE yl.user_id = auth.uid()
    AND yl.is_active = true
    AND cm.user_id = youth_safety_profiles.user_id
  )
);

-- Create trigger to update updated_at
CREATE TRIGGER update_youth_safety_profiles_updated_at
  BEFORE UPDATE ON public.youth_safety_profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_living_manna_updated_at();

-- Add index for performance
CREATE INDEX idx_youth_safety_profiles_user_id ON public.youth_safety_profiles(user_id);