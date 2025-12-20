-- Create PT Knowledge Bank table for Jeeves to learn from curated analyses
CREATE TABLE public.pt_knowledge_bank (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  source_analysis_id UUID REFERENCES public.thought_analyses(id) ON DELETE SET NULL,
  input_text TEXT NOT NULL,
  summary TEXT,
  key_insights JSONB DEFAULT '[]',
  palace_rooms JSONB DEFAULT '[]',
  scripture_connections JSONB DEFAULT '[]',
  typology_layers JSONB DEFAULT '[]',
  deeper_insights JSONB DEFAULT '[]',
  categories JSONB,
  tags TEXT[] DEFAULT '{}',
  approved_by UUID NOT NULL,
  approved_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.pt_knowledge_bank ENABLE ROW LEVEL SECURITY;

-- Only admins can insert/update/delete
CREATE POLICY "Admins can manage knowledge bank"
ON public.pt_knowledge_bank
FOR ALL
USING (
  EXISTS (SELECT 1 FROM public.admin_users WHERE user_id = auth.uid())
);

-- All authenticated users can read knowledge bank
CREATE POLICY "Authenticated users can view knowledge bank"
ON public.pt_knowledge_bank
FOR SELECT
USING (auth.uid() IS NOT NULL);

-- Create index for faster lookups
CREATE INDEX idx_pt_knowledge_bank_tags ON public.pt_knowledge_bank USING GIN(tags);

-- Add trigger for updated_at
CREATE TRIGGER update_pt_knowledge_bank_updated_at
BEFORE UPDATE ON public.pt_knowledge_bank
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();