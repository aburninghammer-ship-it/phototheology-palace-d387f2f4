-- Add scoring columns to guesthouse_guests
ALTER TABLE public.guesthouse_guests 
ADD COLUMN IF NOT EXISTS score integer DEFAULT 0,
ADD COLUMN IF NOT EXISTS rounds_played integer DEFAULT 0,
ADD COLUMN IF NOT EXISTS correct_answers integer DEFAULT 0;

-- Create guesthouse_responses table for tracking answers
CREATE TABLE IF NOT EXISTS public.guesthouse_responses (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  prompt_id uuid NOT NULL REFERENCES public.guesthouse_session_prompts(id) ON DELETE CASCADE,
  guest_id uuid NOT NULL REFERENCES public.guesthouse_guests(id) ON DELETE CASCADE,
  response_data jsonb NOT NULL DEFAULT '{}',
  is_correct boolean DEFAULT false,
  points_earned integer DEFAULT 0,
  graded_at timestamp with time zone,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  UNIQUE(prompt_id, guest_id)
);

-- Create index for fast lookups
CREATE INDEX IF NOT EXISTS idx_guesthouse_responses_prompt ON public.guesthouse_responses(prompt_id);
CREATE INDEX IF NOT EXISTS idx_guesthouse_responses_guest ON public.guesthouse_responses(guest_id);

-- Enable RLS
ALTER TABLE public.guesthouse_responses ENABLE ROW LEVEL SECURITY;

-- RLS Policies for responses
CREATE POLICY "Guests can insert their own responses"
ON public.guesthouse_responses FOR INSERT
WITH CHECK (
  guest_id IN (
    SELECT id FROM public.guesthouse_guests WHERE user_id = auth.uid()
  )
);

CREATE POLICY "Guests can view responses for events they're in"
ON public.guesthouse_responses FOR SELECT
USING (
  guest_id IN (
    SELECT id FROM public.guesthouse_guests WHERE user_id = auth.uid()
  ) OR
  prompt_id IN (
    SELECT sp.id FROM public.guesthouse_session_prompts sp
    JOIN public.guesthouse_events e ON e.id = sp.event_id
    WHERE e.host_user_id = auth.uid()
  )
);

CREATE POLICY "Hosts can update responses for grading"
ON public.guesthouse_responses FOR UPDATE
USING (
  prompt_id IN (
    SELECT sp.id FROM public.guesthouse_session_prompts sp
    JOIN public.guesthouse_events e ON e.id = sp.event_id
    WHERE e.host_user_id = auth.uid()
  )
);

-- Enable realtime for responses
ALTER PUBLICATION supabase_realtime ADD TABLE public.guesthouse_responses;