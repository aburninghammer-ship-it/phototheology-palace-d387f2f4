-- Create live sermon sessions table
CREATE TABLE public.live_sermon_sessions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  church_id UUID NOT NULL REFERENCES public.churches(id) ON DELETE CASCADE,
  pastor_id UUID NOT NULL,
  title TEXT NOT NULL,
  sermon_date DATE NOT NULL DEFAULT CURRENT_DATE,
  youtube_url TEXT,
  sermon_outline JSONB DEFAULT '[]'::jsonb,
  key_passages TEXT[] DEFAULT '{}',
  pt_rooms_focus TEXT[] DEFAULT '{}',
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'live', 'ended', 'archived')),
  started_at TIMESTAMPTZ,
  ended_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create sermon study cards table (AI-generated, constrained output)
CREATE TABLE public.sermon_study_cards (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id UUID NOT NULL REFERENCES public.live_sermon_sessions(id) ON DELETE CASCADE,
  card_type TEXT NOT NULL CHECK (card_type IN ('pt_tag', 'cross_reference', 'reflection', 'sanctuary')),
  sermon_point TEXT NOT NULL,
  pt_rooms TEXT[] DEFAULT '{}',
  floor_number INTEGER,
  cross_references TEXT[] DEFAULT '{}',
  reflection_question TEXT,
  sanctuary_connection TEXT,
  timestamp_seconds INTEGER,
  display_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.live_sermon_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sermon_study_cards ENABLE ROW LEVEL SECURITY;

-- RLS for live_sermon_sessions
CREATE POLICY "Church members can view their church sessions"
  ON public.live_sermon_sessions FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.church_members
      WHERE church_members.church_id = live_sermon_sessions.church_id
        AND church_members.user_id = auth.uid()
    )
  );

CREATE POLICY "Church admins can manage sessions"
  ON public.live_sermon_sessions FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.church_members
      WHERE church_members.church_id = live_sermon_sessions.church_id
        AND church_members.user_id = auth.uid()
        AND church_members.role = 'admin'
    )
  );

-- RLS for sermon_study_cards (viewable by anyone who can view the session)
CREATE POLICY "Users can view cards for sessions they can access"
  ON public.sermon_study_cards FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.live_sermon_sessions lss
      JOIN public.church_members cm ON cm.church_id = lss.church_id
      WHERE lss.id = sermon_study_cards.session_id
        AND cm.user_id = auth.uid()
    )
  );

CREATE POLICY "System can insert cards"
  ON public.sermon_study_cards FOR INSERT
  WITH CHECK (true);

-- Indexes for performance
CREATE INDEX idx_live_sermon_sessions_church ON public.live_sermon_sessions(church_id);
CREATE INDEX idx_live_sermon_sessions_status ON public.live_sermon_sessions(status);
CREATE INDEX idx_sermon_study_cards_session ON public.sermon_study_cards(session_id);

-- Enable realtime for study cards
ALTER PUBLICATION supabase_realtime ADD TABLE public.sermon_study_cards;

-- Update trigger for sessions
CREATE TRIGGER update_live_sermon_sessions_updated_at
  BEFORE UPDATE ON public.live_sermon_sessions
  FOR EACH ROW
  EXECUTE FUNCTION public.update_church_updated_at();