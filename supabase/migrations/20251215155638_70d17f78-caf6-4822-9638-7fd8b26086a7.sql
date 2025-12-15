-- Church Devotionals table
CREATE TABLE public.church_devotionals (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  church_id UUID REFERENCES public.churches(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  church_name TEXT NOT NULL,
  theological_frame TEXT,
  day_of_week TEXT CHECK (day_of_week IN ('monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'sabbath', 'sunday')),
  theme_cycle TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Individual devotional entries
CREATE TABLE public.church_devotional_entries (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  church_devotional_id UUID NOT NULL REFERENCES public.church_devotionals(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  anchor_scripture TEXT NOT NULL,
  scripture_text TEXT,
  meditation TEXT NOT NULL,
  communal_practice TEXT NOT NULL,
  closing_prayer TEXT NOT NULL,
  day_theme TEXT,
  entry_date DATE NOT NULL DEFAULT CURRENT_DATE,
  is_published BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Church devotional templates for recurring themes
CREATE TABLE public.church_devotional_templates (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  church_devotional_id UUID NOT NULL REFERENCES public.church_devotionals(id) ON DELETE CASCADE,
  day_of_week TEXT NOT NULL,
  theme_name TEXT NOT NULL,
  theme_description TEXT,
  sample_topics TEXT[],
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.church_devotionals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.church_devotional_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.church_devotional_templates ENABLE ROW LEVEL SECURITY;

-- Policies for church_devotionals
CREATE POLICY "Users can view their own church devotionals"
ON public.church_devotionals FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can create church devotionals"
ON public.church_devotionals FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own church devotionals"
ON public.church_devotionals FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own church devotionals"
ON public.church_devotionals FOR DELETE
USING (auth.uid() = user_id);

-- Policies for church_devotional_entries
CREATE POLICY "Users can view entries for their church devotionals"
ON public.church_devotional_entries FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.church_devotionals cd
    WHERE cd.id = church_devotional_id AND cd.user_id = auth.uid()
  )
);

CREATE POLICY "Users can create entries for their church devotionals"
ON public.church_devotional_entries FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.church_devotionals cd
    WHERE cd.id = church_devotional_id AND cd.user_id = auth.uid()
  )
);

CREATE POLICY "Users can update entries for their church devotionals"
ON public.church_devotional_entries FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM public.church_devotionals cd
    WHERE cd.id = church_devotional_id AND cd.user_id = auth.uid()
  )
);

CREATE POLICY "Users can delete entries for their church devotionals"
ON public.church_devotional_entries FOR DELETE
USING (
  EXISTS (
    SELECT 1 FROM public.church_devotionals cd
    WHERE cd.id = church_devotional_id AND cd.user_id = auth.uid()
  )
);

-- Policies for church_devotional_templates
CREATE POLICY "Users can view templates for their church devotionals"
ON public.church_devotional_templates FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.church_devotionals cd
    WHERE cd.id = church_devotional_id AND cd.user_id = auth.uid()
  )
);

CREATE POLICY "Users can create templates for their church devotionals"
ON public.church_devotional_templates FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.church_devotionals cd
    WHERE cd.id = church_devotional_id AND cd.user_id = auth.uid()
  )
);

CREATE POLICY "Users can update templates for their church devotionals"
ON public.church_devotional_templates FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM public.church_devotionals cd
    WHERE cd.id = church_devotional_id AND cd.user_id = auth.uid()
  )
);

CREATE POLICY "Users can delete templates for their church devotionals"
ON public.church_devotional_templates FOR DELETE
USING (
  EXISTS (
    SELECT 1 FROM public.church_devotionals cd
    WHERE cd.id = church_devotional_id AND cd.user_id = auth.uid()
  )
);