-- Create table for pending student verifications
CREATE TABLE public.pending_student_verifications (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  edu_email TEXT NOT NULL,
  verification_code TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT (now() + INTERVAL '24 hours'),
  verified_at TIMESTAMP WITH TIME ZONE,
  attempts INTEGER NOT NULL DEFAULT 0
);

-- Enable RLS
ALTER TABLE public.pending_student_verifications ENABLE ROW LEVEL SECURITY;

-- Users can only view their own pending verifications
CREATE POLICY "Users can view their own pending verifications"
ON public.pending_student_verifications
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

-- Create index for faster lookups
CREATE INDEX idx_pending_student_verifications_user_id ON public.pending_student_verifications(user_id);
CREATE INDEX idx_pending_student_verifications_code ON public.pending_student_verifications(verification_code);

-- Function to generate a 6-digit verification code
CREATE OR REPLACE FUNCTION public.generate_student_verification_code()
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN LPAD(FLOOR(RANDOM() * 1000000)::TEXT, 6, '0');
END;
$$;