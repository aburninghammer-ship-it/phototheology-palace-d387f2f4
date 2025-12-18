-- Create church community posts table for church-scoped community
CREATE TABLE public.church_community_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  church_id UUID NOT NULL REFERENCES public.churches(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  category TEXT DEFAULT 'general',
  likes INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Create church community comments table
CREATE TABLE public.church_community_comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id UUID NOT NULL REFERENCES public.church_community_posts(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  parent_comment_id UUID REFERENCES public.church_community_comments(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.church_community_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.church_community_comments ENABLE ROW LEVEL SECURITY;

-- Function to check church membership or guest access
CREATE OR REPLACE FUNCTION public.has_church_community_access(_user_id UUID, _church_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.church_members
    WHERE church_id = _church_id AND user_id = _user_id
  ) OR EXISTS (
    SELECT 1 FROM public.church_guest_access
    WHERE church_id = _church_id 
      AND user_id = _user_id 
      AND is_active = true 
      AND expires_at > now()
  );
$$;

-- RLS Policies for church_community_posts
CREATE POLICY "Church members and guests can view posts"
ON public.church_community_posts FOR SELECT
TO authenticated
USING (public.has_church_community_access(auth.uid(), church_id));

CREATE POLICY "Church members can create posts"
ON public.church_community_posts FOR INSERT
TO authenticated
WITH CHECK (
  auth.uid() = user_id 
  AND public.has_church_community_access(auth.uid(), church_id)
);

CREATE POLICY "Users can update own posts"
ON public.church_community_posts FOR UPDATE
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own posts"
ON public.church_community_posts FOR DELETE
TO authenticated
USING (auth.uid() = user_id);

-- RLS Policies for church_community_comments
CREATE POLICY "Church members and guests can view comments"
ON public.church_community_comments FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.church_community_posts p
    WHERE p.id = post_id 
      AND public.has_church_community_access(auth.uid(), p.church_id)
  )
);

CREATE POLICY "Church members can create comments"
ON public.church_community_comments FOR INSERT
TO authenticated
WITH CHECK (
  auth.uid() = user_id
  AND EXISTS (
    SELECT 1 FROM public.church_community_posts p
    WHERE p.id = post_id 
      AND public.has_church_community_access(auth.uid(), p.church_id)
  )
);

CREATE POLICY "Users can update own comments"
ON public.church_community_comments FOR UPDATE
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own comments"
ON public.church_community_comments FOR DELETE
TO authenticated
USING (auth.uid() = user_id);

-- Indexes for performance
CREATE INDEX idx_church_community_posts_church_id ON public.church_community_posts(church_id);
CREATE INDEX idx_church_community_posts_user_id ON public.church_community_posts(user_id);
CREATE INDEX idx_church_community_posts_created_at ON public.church_community_posts(created_at DESC);
CREATE INDEX idx_church_community_comments_post_id ON public.church_community_comments(post_id);

-- Trigger for updated_at
CREATE OR REPLACE FUNCTION public.update_church_community_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE TRIGGER update_church_community_posts_updated_at
BEFORE UPDATE ON public.church_community_posts
FOR EACH ROW EXECUTE FUNCTION public.update_church_community_updated_at();

CREATE TRIGGER update_church_community_comments_updated_at
BEFORE UPDATE ON public.church_community_comments
FOR EACH ROW EXECUTE FUNCTION public.update_church_community_updated_at();