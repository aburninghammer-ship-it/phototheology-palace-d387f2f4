-- Create table to track Jeeves interactions
CREATE TABLE public.jeeves_interactions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  question TEXT NOT NULL,
  feature_used TEXT NOT NULL,
  response_preview TEXT,
  page_context TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.jeeves_interactions ENABLE ROW LEVEL SECURITY;

-- Policy for users to insert their own interactions
CREATE POLICY "Users can insert their own interactions" 
ON public.jeeves_interactions 
FOR INSERT 
WITH CHECK (auth.uid() = user_id OR user_id IS NULL);

-- Policy for admins to view all interactions (using a simple admin check)
CREATE POLICY "Users can view their own interactions" 
ON public.jeeves_interactions 
FOR SELECT 
USING (auth.uid() = user_id);

-- Create index for faster queries
CREATE INDEX idx_jeeves_interactions_created_at ON public.jeeves_interactions(created_at DESC);
CREATE INDEX idx_jeeves_interactions_feature ON public.jeeves_interactions(feature_used);
CREATE INDEX idx_jeeves_interactions_user ON public.jeeves_interactions(user_id);

-- Create page views tracking table
CREATE TABLE public.page_views (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  page_path TEXT NOT NULL,
  page_title TEXT,
  referrer TEXT,
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.page_views ENABLE ROW LEVEL SECURITY;

-- Policy for inserting page views
CREATE POLICY "Anyone can insert page views" 
ON public.page_views 
FOR INSERT 
WITH CHECK (true);

-- Policy for users to view their own page views
CREATE POLICY "Users can view their own page views" 
ON public.page_views 
FOR SELECT 
USING (auth.uid() = user_id);

-- Create indexes
CREATE INDEX idx_page_views_created_at ON public.page_views(created_at DESC);
CREATE INDEX idx_page_views_page_path ON public.page_views(page_path);

-- Create admin_users table to identify admins
CREATE TABLE public.admin_users (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;

-- Admins can view admin list
CREATE POLICY "Admins can view admin list" 
ON public.admin_users 
FOR SELECT 
USING (auth.uid() IN (SELECT user_id FROM public.admin_users));

-- Add admin policy for viewing all jeeves interactions
CREATE POLICY "Admins can view all interactions" 
ON public.jeeves_interactions 
FOR SELECT 
USING (auth.uid() IN (SELECT user_id FROM public.admin_users));

-- Add admin policy for viewing all page views
CREATE POLICY "Admins can view all page views" 
ON public.page_views 
FOR SELECT 
USING (auth.uid() IN (SELECT user_id FROM public.admin_users));

-- Insert current user as admin (replace with actual admin user id)
-- You'll need to manually add yourself as admin