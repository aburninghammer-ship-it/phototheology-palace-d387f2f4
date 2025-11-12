-- Create study collaborators table
CREATE TABLE IF NOT EXISTS public.study_collaborators (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  study_id UUID NOT NULL REFERENCES public.user_studies(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  permission TEXT NOT NULL CHECK (permission IN ('view', 'edit')),
  invited_by UUID NOT NULL,
  invited_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(study_id, user_id)
);

-- Enable RLS
ALTER TABLE public.study_collaborators ENABLE ROW LEVEL SECURITY;

-- Policies for study_collaborators
CREATE POLICY "Users can view collaborators of their studies"
  ON public.study_collaborators
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.user_studies
      WHERE id = study_collaborators.study_id
      AND user_id = auth.uid()
    )
    OR user_id = auth.uid()
  );

CREATE POLICY "Study owners can add collaborators"
  ON public.study_collaborators
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.user_studies
      WHERE id = study_collaborators.study_id
      AND user_id = auth.uid()
    )
  );

CREATE POLICY "Study owners can remove collaborators"
  ON public.study_collaborators
  FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM public.user_studies
      WHERE id = study_collaborators.study_id
      AND user_id = auth.uid()
    )
  );

CREATE POLICY "Study owners can update collaborator permissions"
  ON public.study_collaborators
  FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.user_studies
      WHERE id = study_collaborators.study_id
      AND user_id = auth.uid()
    )
  );

-- Update user_studies policies to include collaborators
DROP POLICY IF EXISTS "Users can view their own studies" ON public.user_studies;
CREATE POLICY "Users can view their own and shared studies"
  ON public.user_studies
  FOR SELECT
  USING (
    user_id = auth.uid()
    OR EXISTS (
      SELECT 1 FROM public.study_collaborators
      WHERE study_id = user_studies.id
      AND user_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "Users can update their own studies" ON public.user_studies;
CREATE POLICY "Users can update their own studies or studies with edit permission"
  ON public.user_studies
  FOR UPDATE
  USING (
    user_id = auth.uid()
    OR EXISTS (
      SELECT 1 FROM public.study_collaborators
      WHERE study_id = user_studies.id
      AND user_id = auth.uid()
      AND permission = 'edit'
    )
  );

-- Enable realtime for collaborative editing
ALTER PUBLICATION supabase_realtime ADD TABLE public.user_studies;
ALTER PUBLICATION supabase_realtime ADD TABLE public.study_collaborators;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_study_collaborators_study_id ON public.study_collaborators(study_id);
CREATE INDEX IF NOT EXISTS idx_study_collaborators_user_id ON public.study_collaborators(user_id);