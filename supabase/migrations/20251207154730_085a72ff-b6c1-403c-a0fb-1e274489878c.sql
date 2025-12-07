-- Session tabs table
CREATE TABLE IF NOT EXISTS public.session_tabs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID NOT NULL REFERENCES public.study_sessions(id) ON DELETE CASCADE,
  tab_type TEXT NOT NULL,
  tab_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT false,
  tab_state JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Session verses table
CREATE TABLE IF NOT EXISTS public.session_verses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID NOT NULL REFERENCES public.study_sessions(id) ON DELETE CASCADE,
  book TEXT NOT NULL,
  chapter INTEGER NOT NULL,
  verse_start INTEGER,
  verse_end INTEGER,
  notes TEXT,
  highlights JSONB DEFAULT '[]'::jsonb,
  cross_references TEXT[] DEFAULT '{}',
  accessed_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Session PT interactions table
CREATE TABLE IF NOT EXISTS public.session_pt_interactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID NOT NULL REFERENCES public.study_sessions(id) ON DELETE CASCADE,
  interaction_type TEXT NOT NULL,
  room_code TEXT,
  floor_number INTEGER,
  principle_code TEXT,
  interaction_data JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Session Jeeves interactions table
CREATE TABLE IF NOT EXISTS public.session_jeeves_interactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID NOT NULL REFERENCES public.study_sessions(id) ON DELETE CASCADE,
  prompt TEXT NOT NULL,
  response TEXT NOT NULL,
  analysis_type TEXT,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Session notes table
CREATE TABLE IF NOT EXISTS public.session_notes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID NOT NULL REFERENCES public.study_sessions(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  note_type TEXT DEFAULT 'general',
  related_verse TEXT,
  related_room TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS on new tables
ALTER TABLE public.session_tabs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.session_verses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.session_pt_interactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.session_jeeves_interactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.session_notes ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can manage session tabs" ON public.session_tabs
  FOR ALL TO authenticated 
  USING (EXISTS (SELECT 1 FROM public.study_sessions WHERE id = session_id AND user_id = auth.uid()))
  WITH CHECK (EXISTS (SELECT 1 FROM public.study_sessions WHERE id = session_id AND user_id = auth.uid()));

CREATE POLICY "Users can manage session verses" ON public.session_verses
  FOR ALL TO authenticated 
  USING (EXISTS (SELECT 1 FROM public.study_sessions WHERE id = session_id AND user_id = auth.uid()))
  WITH CHECK (EXISTS (SELECT 1 FROM public.study_sessions WHERE id = session_id AND user_id = auth.uid()));

CREATE POLICY "Users can manage PT interactions" ON public.session_pt_interactions
  FOR ALL TO authenticated 
  USING (EXISTS (SELECT 1 FROM public.study_sessions WHERE id = session_id AND user_id = auth.uid()))
  WITH CHECK (EXISTS (SELECT 1 FROM public.study_sessions WHERE id = session_id AND user_id = auth.uid()));

CREATE POLICY "Users can manage Jeeves interactions" ON public.session_jeeves_interactions
  FOR ALL TO authenticated 
  USING (EXISTS (SELECT 1 FROM public.study_sessions WHERE id = session_id AND user_id = auth.uid()))
  WITH CHECK (EXISTS (SELECT 1 FROM public.study_sessions WHERE id = session_id AND user_id = auth.uid()));

CREATE POLICY "Users can manage session notes" ON public.session_notes
  FOR ALL TO authenticated 
  USING (EXISTS (SELECT 1 FROM public.study_sessions WHERE id = session_id AND user_id = auth.uid()))
  WITH CHECK (EXISTS (SELECT 1 FROM public.study_sessions WHERE id = session_id AND user_id = auth.uid()));

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_session_tabs_session ON public.session_tabs(session_id);
CREATE INDEX IF NOT EXISTS idx_session_verses_session ON public.session_verses(session_id);
CREATE INDEX IF NOT EXISTS idx_session_pt_session ON public.session_pt_interactions(session_id);
CREATE INDEX IF NOT EXISTS idx_session_jeeves_session ON public.session_jeeves_interactions(session_id);
CREATE INDEX IF NOT EXISTS idx_session_notes_session ON public.session_notes(session_id);
CREATE INDEX IF NOT EXISTS idx_study_sessions_status ON public.study_sessions(status);

-- Share token generator function
CREATE OR REPLACE FUNCTION public.generate_session_share_token()
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  token TEXT;
  attempts INT := 0;
BEGIN
  LOOP
    token := 'SS' || UPPER(SUBSTRING(MD5(random()::TEXT || NOW()::TEXT) FROM 1 FOR 10));
    EXIT WHEN NOT EXISTS (SELECT 1 FROM study_sessions WHERE share_token = token);
    attempts := attempts + 1;
    IF attempts > 100 THEN
      RAISE EXCEPTION 'Failed to generate unique share token';
    END IF;
  END LOOP;
  RETURN token;
END;
$$;