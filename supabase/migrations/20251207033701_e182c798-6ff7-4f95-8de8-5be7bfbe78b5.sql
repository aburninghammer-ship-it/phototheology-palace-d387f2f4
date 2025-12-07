-- Create table for Jeeves feedback/learning
CREATE TABLE public.jeeves_feedback (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id),
  context_type TEXT NOT NULL,
  user_question TEXT,
  jeeves_response TEXT,
  was_helpful BOOLEAN NOT NULL,
  original_context JSONB,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.jeeves_feedback ENABLE ROW LEVEL SECURITY;

-- Users can insert their own feedback
CREATE POLICY "Users can insert feedback"
ON public.jeeves_feedback
FOR INSERT
WITH CHECK (auth.uid() = user_id OR user_id IS NULL);

-- Users can view their own feedback
CREATE POLICY "Users can view their own feedback"
ON public.jeeves_feedback
FOR SELECT
USING (auth.uid() = user_id OR user_id IS NULL);

-- Create index for analytics
CREATE INDEX idx_jeeves_feedback_context ON public.jeeves_feedback(context_type);
CREATE INDEX idx_jeeves_feedback_helpful ON public.jeeves_feedback(was_helpful);
CREATE INDEX idx_jeeves_feedback_created ON public.jeeves_feedback(created_at DESC);