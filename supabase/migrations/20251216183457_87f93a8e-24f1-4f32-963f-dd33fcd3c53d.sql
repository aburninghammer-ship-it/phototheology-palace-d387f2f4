-- Create leader_certifications table for 4-week training tracking
CREATE TABLE IF NOT EXISTS public.leader_certifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  church_id UUID NOT NULL REFERENCES public.churches(id) ON DELETE CASCADE,
  week1_completed_at TIMESTAMP WITH TIME ZONE,
  week2_completed_at TIMESTAMP WITH TIME ZONE,
  week3_completed_at TIMESTAMP WITH TIME ZONE,
  week4_completed_at TIMESTAMP WITH TIME ZONE,
  is_certified BOOLEAN NOT NULL DEFAULT false,
  certified_at TIMESTAMP WITH TIME ZONE,
  certified_by UUID,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, church_id)
);

-- Create church_guest_access table for time-limited guest tokens
CREATE TABLE IF NOT EXISTS public.church_guest_access (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  church_id UUID NOT NULL REFERENCES public.churches(id) ON DELETE CASCADE,
  user_id UUID,
  invited_by UUID NOT NULL,
  group_id UUID,
  access_token TEXT NOT NULL UNIQUE DEFAULT encode(gen_random_bytes(16), 'hex'),
  email TEXT,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT (now() + interval '30 days'),
  is_active BOOLEAN NOT NULL DEFAULT true,
  converted_to_member_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on new tables
ALTER TABLE public.leader_certifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.church_guest_access ENABLE ROW LEVEL SECURITY;