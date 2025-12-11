-- Create guesthouse_events table
CREATE TABLE public.guesthouse_events (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  scheduled_at TIMESTAMP WITH TIME ZONE NOT NULL,
  duration_minutes INTEGER NOT NULL DEFAULT 45,
  max_guests INTEGER NOT NULL DEFAULT 100,
  status TEXT NOT NULL DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'live', 'completed', 'cancelled')),
  session_type TEXT NOT NULL DEFAULT 'scheduled_game' CHECK (session_type IN ('scheduled_game', 'live_session')),
  youtube_url TEXT,
  game_type TEXT,
  game_config JSONB DEFAULT '{}'::jsonb,
  host_user_id UUID REFERENCES auth.users(id),
  social_share_image_url TEXT,
  social_share_text TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create guesthouse_guests table (anonymous-friendly)
CREATE TABLE public.guesthouse_guests (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  event_id UUID NOT NULL REFERENCES public.guesthouse_events(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id),
  display_name TEXT NOT NULL,
  email TEXT,
  group_name TEXT CHECK (group_name IN ('seekers', 'watchers', 'scribes', 'pathfinders')),
  group_color TEXT,
  is_checked_in BOOLEAN NOT NULL DEFAULT false,
  checked_in_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create guesthouse_session_prompts table (for live sessions)
CREATE TABLE public.guesthouse_session_prompts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  event_id UUID NOT NULL REFERENCES public.guesthouse_events(id) ON DELETE CASCADE,
  prompt_type TEXT NOT NULL CHECK (prompt_type IN ('call_room', 'verse_fracture', 'build_study', 'pulse', 'co_exegesis', 'drill_drop', 'reveal_gem')),
  prompt_data JSONB NOT NULL DEFAULT '{}'::jsonb,
  sequence_order INTEGER NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT false,
  started_at TIMESTAMP WITH TIME ZONE,
  ended_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create guesthouse_prompt_responses table
CREATE TABLE public.guesthouse_prompt_responses (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  prompt_id UUID NOT NULL REFERENCES public.guesthouse_session_prompts(id) ON DELETE CASCADE,
  guest_id UUID NOT NULL REFERENCES public.guesthouse_guests(id) ON DELETE CASCADE,
  response_type TEXT NOT NULL CHECK (response_type IN ('vote', 'text', 'selection')),
  response_data JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create guesthouse_reactions table
CREATE TABLE public.guesthouse_reactions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  event_id UUID NOT NULL REFERENCES public.guesthouse_events(id) ON DELETE CASCADE,
  guest_id UUID NOT NULL REFERENCES public.guesthouse_guests(id) ON DELETE CASCADE,
  emoji TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create guesthouse_group_results table
CREATE TABLE public.guesthouse_group_results (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  event_id UUID NOT NULL REFERENCES public.guesthouse_events(id) ON DELETE CASCADE,
  group_name TEXT NOT NULL,
  discoveries JSONB NOT NULL DEFAULT '{}'::jsonb,
  completion_time_seconds INTEGER,
  total_score INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create guesthouse_game_library table
CREATE TABLE public.guesthouse_game_library (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  game_type TEXT NOT NULL,
  title TEXT NOT NULL,
  difficulty TEXT NOT NULL DEFAULT 'medium',
  content JSONB NOT NULL DEFAULT '{}'::jsonb,
  scripture_reference TEXT,
  theme TEXT,
  used_count INTEGER NOT NULL DEFAULT 0,
  last_used_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.guesthouse_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.guesthouse_guests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.guesthouse_session_prompts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.guesthouse_prompt_responses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.guesthouse_reactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.guesthouse_group_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.guesthouse_game_library ENABLE ROW LEVEL SECURITY;

-- RLS Policies for guesthouse_events
CREATE POLICY "Anyone can view scheduled and live events"
  ON public.guesthouse_events FOR SELECT
  USING (status IN ('scheduled', 'live', 'completed'));

CREATE POLICY "Admins can manage events"
  ON public.guesthouse_events FOR ALL
  USING (is_admin_user(auth.uid()));

-- RLS Policies for guesthouse_guests (anonymous-friendly)
CREATE POLICY "Anyone can register as guest"
  ON public.guesthouse_guests FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Guests can view participants in their event"
  ON public.guesthouse_guests FOR SELECT
  USING (true);

CREATE POLICY "Guests can update their own record"
  ON public.guesthouse_guests FOR UPDATE
  USING (id = id);

-- RLS Policies for guesthouse_session_prompts
CREATE POLICY "Anyone can view active prompts"
  ON public.guesthouse_session_prompts FOR SELECT
  USING (true);

CREATE POLICY "Admins can manage prompts"
  ON public.guesthouse_session_prompts FOR ALL
  USING (is_admin_user(auth.uid()));

-- RLS Policies for guesthouse_prompt_responses
CREATE POLICY "Anyone can submit responses"
  ON public.guesthouse_prompt_responses FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Anyone can view responses"
  ON public.guesthouse_prompt_responses FOR SELECT
  USING (true);

-- RLS Policies for guesthouse_reactions
CREATE POLICY "Anyone can create reactions"
  ON public.guesthouse_reactions FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Admins can view reactions"
  ON public.guesthouse_reactions FOR SELECT
  USING (is_admin_user(auth.uid()));

-- RLS Policies for guesthouse_group_results
CREATE POLICY "Anyone can view group results"
  ON public.guesthouse_group_results FOR SELECT
  USING (true);

CREATE POLICY "System can insert results"
  ON public.guesthouse_group_results FOR INSERT
  WITH CHECK (true);

-- RLS Policies for guesthouse_game_library
CREATE POLICY "Anyone can view game library"
  ON public.guesthouse_game_library FOR SELECT
  USING (true);

CREATE POLICY "Admins can manage game library"
  ON public.guesthouse_game_library FOR ALL
  USING (is_admin_user(auth.uid()));

-- Enable realtime for key tables
ALTER PUBLICATION supabase_realtime ADD TABLE public.guesthouse_guests;
ALTER PUBLICATION supabase_realtime ADD TABLE public.guesthouse_session_prompts;
ALTER PUBLICATION supabase_realtime ADD TABLE public.guesthouse_reactions;

-- Create updated_at trigger for events
CREATE TRIGGER update_guesthouse_events_updated_at
  BEFORE UPDATE ON public.guesthouse_events
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();