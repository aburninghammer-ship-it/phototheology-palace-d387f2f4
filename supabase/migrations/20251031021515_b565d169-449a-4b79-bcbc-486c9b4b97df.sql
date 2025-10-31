-- Create christ_chapter_findings table for storing user findings of Christ in each chapter
CREATE TABLE IF NOT EXISTS public.christ_chapter_findings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  book TEXT NOT NULL,
  chapter INTEGER NOT NULL,
  christ_name TEXT NOT NULL, -- Christ's title/role in this chapter
  christ_action TEXT NOT NULL, -- What Christ does/accomplishes
  crosslink_verses TEXT[] NOT NULL DEFAULT '{}', -- Array of NT crosslink references
  notes TEXT, -- Optional user notes
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, book, chapter)
);

-- Enable RLS
ALTER TABLE public.christ_chapter_findings ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view their own findings"
  ON public.christ_chapter_findings
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own findings"
  ON public.christ_chapter_findings
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own findings"
  ON public.christ_chapter_findings
  FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own findings"
  ON public.christ_chapter_findings
  FOR DELETE
  USING (auth.uid() = user_id);

-- Create updated_at trigger
CREATE TRIGGER update_christ_chapter_findings_updated_at
  BEFORE UPDATE ON public.christ_chapter_findings
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Create index for efficient queries
CREATE INDEX idx_christ_chapter_findings_user_book ON public.christ_chapter_findings(user_id, book);
CREATE INDEX idx_christ_chapter_findings_user_book_chapter ON public.christ_chapter_findings(user_id, book, chapter);