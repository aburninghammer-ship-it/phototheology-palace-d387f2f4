
-- Add missing columns to six_week_cycles
ALTER TABLE public.six_week_cycles 
ADD COLUMN IF NOT EXISTS sanctuary_focus TEXT,
ADD COLUMN IF NOT EXISTS sequence_number INTEGER DEFAULT 1,
ADD COLUMN IF NOT EXISTS goal TEXT,
ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT true,
ADD COLUMN IF NOT EXISTS theme TEXT,
ADD COLUMN IF NOT EXISTS pt_rooms TEXT[],
ADD COLUMN IF NOT EXISTS icon TEXT;

-- Create index for sequence and active cycles
CREATE INDEX IF NOT EXISTS idx_six_week_cycles_sequence ON public.six_week_cycles(sequence_number);
CREATE INDEX IF NOT EXISTS idx_six_week_cycles_active ON public.six_week_cycles(is_active);

-- Create disciple_training_weeks table for 12-week program
CREATE TABLE IF NOT EXISTS public.disciple_training_weeks (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    church_id UUID REFERENCES public.churches(id) ON DELETE CASCADE,
    program_id UUID REFERENCES public.discipleship_programs(id) ON DELETE CASCADE,
    week_number INTEGER NOT NULL,
    title TEXT NOT NULL,
    theme TEXT,
    sanctuary_focus TEXT,
    goal TEXT,
    scripture_focus TEXT[],
    key_truth TEXT,
    discussion_questions JSONB,
    life_application TEXT,
    prayer_focus TEXT,
    pt_rooms TEXT[],
    practices TEXT[],
    facilitator_notes TEXT,
    is_template BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.disciple_training_weeks ENABLE ROW LEVEL SECURITY;

-- RLS policies for disciple_training_weeks
CREATE POLICY "Users can view training weeks for their church"
ON public.disciple_training_weeks FOR SELECT
USING (
    church_id IS NULL OR
    is_template = true OR
    EXISTS (
        SELECT 1 FROM church_members cm
        WHERE cm.church_id = disciple_training_weeks.church_id
        AND cm.user_id = auth.uid()
    )
);

CREATE POLICY "Church admins can manage training weeks"
ON public.disciple_training_weeks FOR ALL
USING (
    EXISTS (
        SELECT 1 FROM church_members cm
        WHERE cm.church_id = disciple_training_weeks.church_id
        AND cm.user_id = auth.uid()
        AND cm.role IN ('admin', 'leader')
    )
);

-- Create disciple_training_enrollments table
CREATE TABLE IF NOT EXISTS public.disciple_training_enrollments (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL,
    program_id UUID REFERENCES public.discipleship_programs(id) ON DELETE CASCADE,
    cohort_id UUID REFERENCES public.discipleship_cohorts(id) ON DELETE SET NULL,
    current_week INTEGER DEFAULT 1,
    status TEXT DEFAULT 'active',
    started_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    completed_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    UNIQUE(user_id, program_id)
);

-- Enable RLS
ALTER TABLE public.disciple_training_enrollments ENABLE ROW LEVEL SECURITY;

-- RLS policies
CREATE POLICY "Users can view their own enrollments"
ON public.disciple_training_enrollments FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own enrollments"
ON public.disciple_training_enrollments FOR ALL
USING (auth.uid() = user_id);
