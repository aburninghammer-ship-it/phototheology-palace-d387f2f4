-- Small Groups (House Fires)
CREATE TABLE public.small_groups (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  church_id UUID NOT NULL REFERENCES public.churches(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  leader_id UUID NOT NULL,
  meeting_day TEXT,
  meeting_time TEXT,
  meeting_type TEXT NOT NULL DEFAULT 'online' CHECK (meeting_type IN ('in-person', 'online', 'hybrid')),
  location TEXT,
  max_members INTEGER NOT NULL DEFAULT 12,
  current_cycle TEXT,
  is_open BOOLEAN NOT NULL DEFAULT true,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Small Group Members
CREATE TABLE public.small_group_members (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  group_id UUID NOT NULL REFERENCES public.small_groups(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  role TEXT NOT NULL DEFAULT 'member' CHECK (role IN ('leader', 'apprentice', 'member')),
  joined_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  is_active BOOLEAN NOT NULL DEFAULT true,
  UNIQUE(group_id, user_id)
);

-- Central Study Packets
CREATE TABLE public.church_central_studies (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  church_id UUID NOT NULL REFERENCES public.churches(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  week_start DATE NOT NULL,
  week_end DATE NOT NULL,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'active', 'completed')),
  key_passages TEXT[] NOT NULL DEFAULT '{}',
  guided_questions TEXT[] NOT NULL DEFAULT '{}',
  christ_synthesis TEXT NOT NULL DEFAULT '',
  action_challenge TEXT NOT NULL DEFAULT '',
  prayer_focus TEXT NOT NULL DEFAULT '',
  seeker_friendly_framing TEXT,
  share_token TEXT UNIQUE,
  sermon_id UUID,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Church Sermons
CREATE TABLE public.church_sermons (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  church_id UUID NOT NULL REFERENCES public.churches(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  youtube_url TEXT NOT NULL,
  thumbnail_url TEXT,
  sermon_date DATE NOT NULL,
  preacher TEXT,
  scripture_focus TEXT,
  duration_minutes INTEGER,
  pt_framing TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add YouTube columns to churches
ALTER TABLE public.churches 
ADD COLUMN IF NOT EXISTS youtube_channel_url TEXT,
ADD COLUMN IF NOT EXISTS youtube_channel_name TEXT;

-- Enable RLS
ALTER TABLE public.small_groups ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.small_group_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.church_central_studies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.church_sermons ENABLE ROW LEVEL SECURITY;

-- RLS Policies for small_groups
CREATE POLICY "Church members can view small groups"
ON public.small_groups FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM church_members 
    WHERE church_members.church_id = small_groups.church_id 
    AND church_members.user_id = auth.uid()
  )
);

CREATE POLICY "Church admins can manage small groups"
ON public.small_groups FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM church_members 
    WHERE church_members.church_id = small_groups.church_id 
    AND church_members.user_id = auth.uid()
    AND church_members.role = 'admin'
  )
);

-- RLS Policies for small_group_members
CREATE POLICY "Members can view group members"
ON public.small_group_members FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM small_groups sg
    JOIN church_members cm ON cm.church_id = sg.church_id
    WHERE sg.id = small_group_members.group_id 
    AND cm.user_id = auth.uid()
  )
);

CREATE POLICY "Users can join groups"
ON public.small_group_members FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can leave groups"
ON public.small_group_members FOR DELETE
USING (auth.uid() = user_id);

-- RLS Policies for church_central_studies
CREATE POLICY "Church members can view studies"
ON public.church_central_studies FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM church_members 
    WHERE church_members.church_id = church_central_studies.church_id 
    AND church_members.user_id = auth.uid()
  )
  OR share_token IS NOT NULL
);

CREATE POLICY "Church admins can manage studies"
ON public.church_central_studies FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM church_members 
    WHERE church_members.church_id = church_central_studies.church_id 
    AND church_members.user_id = auth.uid()
    AND church_members.role = 'admin'
  )
);

-- RLS Policies for church_sermons
CREATE POLICY "Church members can view sermons"
ON public.church_sermons FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM church_members 
    WHERE church_members.church_id = church_sermons.church_id 
    AND church_members.user_id = auth.uid()
  )
);

CREATE POLICY "Church admins can manage sermons"
ON public.church_sermons FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM church_members 
    WHERE church_members.church_id = church_sermons.church_id 
    AND church_members.user_id = auth.uid()
    AND church_members.role = 'admin'
  )
);