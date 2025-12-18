-- Create church-specific announcements table
CREATE TABLE public.church_announcements (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  church_id UUID NOT NULL REFERENCES public.churches(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  type TEXT NOT NULL DEFAULT 'info', -- info, warning, celebration, urgent
  is_active BOOLEAN NOT NULL DEFAULT true,
  is_pinned BOOLEAN NOT NULL DEFAULT false,
  expires_at TIMESTAMP WITH TIME ZONE,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create dismissals table for tracking read state
CREATE TABLE public.church_announcement_dismissals (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  announcement_id UUID NOT NULL REFERENCES public.church_announcements(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  dismissed_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(announcement_id, user_id)
);

-- Enable RLS
ALTER TABLE public.church_announcements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.church_announcement_dismissals ENABLE ROW LEVEL SECURITY;

-- RLS policies for announcements (members can view, admins can manage)
CREATE POLICY "Church members can view active announcements"
ON public.church_announcements FOR SELECT
USING (
  is_active = true 
  AND (expires_at IS NULL OR expires_at > now())
  AND public.has_church_community_access(auth.uid(), church_id)
);

CREATE POLICY "Church admins can manage announcements"
ON public.church_announcements FOR ALL
USING (public.is_church_admin(auth.uid(), church_id))
WITH CHECK (public.is_church_admin(auth.uid(), church_id));

-- RLS policies for dismissals
CREATE POLICY "Users can view own dismissals"
ON public.church_announcement_dismissals FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can dismiss announcements"
ON public.church_announcement_dismissals FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own dismissals"
ON public.church_announcement_dismissals FOR DELETE
USING (auth.uid() = user_id);

-- Create indexes
CREATE INDEX idx_church_announcements_church_id ON public.church_announcements(church_id);
CREATE INDEX idx_church_announcements_active ON public.church_announcements(is_active, expires_at);
CREATE INDEX idx_church_announcement_dismissals_user ON public.church_announcement_dismissals(user_id);