import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface CommunityComment {
  id: string;
  post_id: string;
  user_id: string;
  content: string;
  parent_comment_id: string | null;
  created_at: string;
  updated_at: string;
  profiles: {
    username: string;
    display_name: string | null;
    avatar_url: string | null;
  };
}

export const useCommunityComments = (postId: string | null) => {
  const { toast } = useToast();
  const [comments, setComments] = useState<CommunityComment[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchComments = useCallback(async () => {
    if (!postId) {
      setComments([]);
      return;
    }

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('community_comments')
        .select(`
          *,
          profiles:user_id(username, display_name, avatar_url)
        `)
        .eq('post_id', postId)
        .order('created_at', { ascending: true });

      if (error) {
        console.error('Error fetching comments:', error);
        toast({
          title: 'Error loading comments',
          description: error.message,
          variant: 'destructive',
        });
        return;
      }

      setComments(data || []);
    } catch (error: any) {
      console.error('Unexpected error fetching comments:', error);
      toast({
        title: 'Error',
        description: 'Failed to load comments',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  }, [postId, toast]);

  useEffect(() => {
    fetchComments();
  }, [fetchComments]);

  // Optimistic add comment
  const addComment = useCallback((newComment: CommunityComment) => {
    setComments(prev => [...prev, newComment]);
  }, []);

  // Optimistic update comment
  const updateComment = useCallback((commentId: string, updates: Partial<CommunityComment>) => {
    setComments(prev => prev.map(comment =>
      comment.id === commentId ? { ...comment, ...updates } : comment
    ));
  }, []);

  // Optimistic remove comment
  const removeComment = useCallback((commentId: string) => {
    setComments(prev => prev.filter(comment => comment.id !== commentId));
  }, []);

  return {
    comments,
    loading,
    refresh: fetchComments,
    addComment,
    updateComment,
    removeComment,
  };
};
