-- Palace AI Engine: Adaptive Learning System
-- Tracks user learning patterns, strengths, weaknesses, and predictions

-- User learning profile - comprehensive adaptive analysis
CREATE TABLE IF NOT EXISTS public.user_learning_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- Strengths & Weaknesses
  top_strengths JSONB DEFAULT '[]'::JSONB, -- [{room_id, skill, confidence_score}]
  identified_weaknesses JSONB DEFAULT '[]'::JSONB, -- [{room_id, skill, error_pattern, frequency}]
  blind_spots JSONB DEFAULT '[]'::JSONB, -- [{room_id, principle, missed_count, context}]
  
  -- Learning patterns
  learning_style TEXT, -- visual, analytical, intuitive, mixed
  optimal_difficulty TEXT DEFAULT 'medium', -- easy, medium, hard, expert
  attention_span_minutes INTEGER DEFAULT 20,
  best_study_times TEXT[], -- morning, afternoon, evening, night
  
  -- Performance metrics
  accuracy_trend JSONB DEFAULT '[]'::JSONB, -- [{date, score}]
  speed_improvement JSONB DEFAULT '[]'::JSONB, -- [{date, avg_time}]
  consistency_score NUMERIC DEFAULT 0.5, -- 0-1 scale
  
  -- AI predictions
  predicted_struggles JSONB DEFAULT '[]'::JSONB, -- [{verse_ref, room_id, reason, confidence}]
  recommended_focus_areas TEXT[],
  next_challenge_level TEXT DEFAULT 'medium',
  
  -- Adaptation settings
  auto_adjust_difficulty BOOLEAN DEFAULT true,
  personalization_level TEXT DEFAULT 'high', -- low, medium, high
  
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  last_analysis_at TIMESTAMPTZ,
  
  UNIQUE(user_id)
);

-- Personalized drills - AI-generated practice tailored to each user
CREATE TABLE IF NOT EXISTS public.personalized_drills (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  room_id TEXT NOT NULL,
  floor_number INTEGER NOT NULL,
  
  -- Drill configuration
  drill_type TEXT NOT NULL, -- strengthening, remedial, challenge, prediction_test
  difficulty_level TEXT NOT NULL, -- easy, medium, hard, expert
  target_skill TEXT NOT NULL, -- what this drill is designed to improve
  
  -- Content
  prompt TEXT NOT NULL,
  expected_answer TEXT,
  hints JSONB DEFAULT '[]'::JSONB,
  verses_involved TEXT[],
  principles_tested TEXT[],
  
  -- Adaptation data
  generated_reason TEXT, -- why AI created this drill
  addresses_weakness BOOLEAN DEFAULT false,
  tests_prediction BOOLEAN DEFAULT false,
  reinforces_strength BOOLEAN DEFAULT false,
  
  -- Usage tracking
  attempts_count INTEGER DEFAULT 0,
  success_rate NUMERIC DEFAULT 0,
  avg_time_seconds INTEGER,
  is_completed BOOLEAN DEFAULT false,
  completed_at TIMESTAMPTZ,
  
  -- Scheduling
  scheduled_for TIMESTAMPTZ,
  expires_at TIMESTAMPTZ,
  priority INTEGER DEFAULT 5, -- 1-10 scale
  
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Learning predictions - AI forecasts of user struggles
CREATE TABLE IF NOT EXISTS public.learning_predictions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- Prediction details
  prediction_type TEXT NOT NULL, -- struggle, misinterpret, skip_principle, pattern_miss
  room_id TEXT NOT NULL,
  verse_reference TEXT,
  principle_code TEXT,
  
  -- AI reasoning
  confidence_score NUMERIC NOT NULL, -- 0-1 scale
  reasoning TEXT NOT NULL,
  based_on_patterns JSONB, -- what patterns led to this prediction
  
  -- Validation
  was_accurate BOOLEAN,
  user_feedback TEXT,
  actual_outcome TEXT,
  validated_at TIMESTAMPTZ,
  
  -- Timing
  predicted_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  expires_at TIMESTAMPTZ,
  
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Practice schedules - personalized study plans
CREATE TABLE IF NOT EXISTS public.practice_schedules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- Schedule configuration
  schedule_name TEXT NOT NULL,
  schedule_type TEXT NOT NULL, -- daily, weekly, targeted, remedial
  start_date DATE NOT NULL,
  end_date DATE,
  
  -- Content
  focus_rooms TEXT[] NOT NULL,
  daily_goals JSONB, -- [{day, rooms, drills, time_minutes}]
  weekly_milestones JSONB,
  
  -- Adaptation
  adjusts_to_progress BOOLEAN DEFAULT true,
  difficulty_progression TEXT DEFAULT 'gradual', -- gradual, steady, aggressive
  
  -- Tracking
  completion_rate NUMERIC DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.user_learning_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.personalized_drills ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.learning_predictions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.practice_schedules ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view own learning profile"
  ON public.user_learning_profiles FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update own learning profile"
  ON public.user_learning_profiles FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own learning profile"
  ON public.user_learning_profiles FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view own personalized drills"
  ON public.personalized_drills FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update own personalized drills"
  ON public.personalized_drills FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can view own learning predictions"
  ON public.learning_predictions FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update own learning predictions"
  ON public.learning_predictions FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can view own practice schedules"
  ON public.practice_schedules FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own practice schedules"
  ON public.practice_schedules FOR ALL
  USING (auth.uid() = user_id);

-- Indexes for performance
CREATE INDEX idx_learning_profiles_user ON public.user_learning_profiles(user_id);
CREATE INDEX idx_personalized_drills_user_room ON public.personalized_drills(user_id, room_id);
CREATE INDEX idx_personalized_drills_scheduled ON public.personalized_drills(scheduled_for) WHERE is_completed = false;
CREATE INDEX idx_learning_predictions_user ON public.learning_predictions(user_id);
CREATE INDEX idx_practice_schedules_user_active ON public.practice_schedules(user_id) WHERE is_active = true;

-- Triggers
CREATE TRIGGER update_learning_profiles_updated_at
  BEFORE UPDATE ON public.user_learning_profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_personalized_drills_updated_at
  BEFORE UPDATE ON public.personalized_drills
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_practice_schedules_updated_at
  BEFORE UPDATE ON public.practice_schedules
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();