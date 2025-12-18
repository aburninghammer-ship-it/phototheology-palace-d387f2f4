import { useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";

export interface RecentStudy {
  id: string;
  title: string;
  content: string;
  tags: string[];
  updated_at: string;
}

export interface RecentNote {
  id: string;
  book: string;
  chapter: number;
  verse: number;
  content: string;
  created_at: string;
}

export const useRecentStudies = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [recentStudies, setRecentStudies] = useState<RecentStudy[]>([]);
  const [recentNotes, setRecentNotes] = useState<RecentNote[]>([]);

  const fetchRecentStudies = useCallback(async () => {
    setIsLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return [];

      const { data, error } = await supabase
        .from("user_studies")
        .select("id, title, content, tags, updated_at")
        .eq("user_id", user.id)
        .order("updated_at", { ascending: false })
        .limit(10);

      if (error) throw error;
      setRecentStudies(data || []);
      return data || [];
    } catch (error) {
      console.error("[RecentStudies] Error:", error);
      return [];
    } finally {
      setIsLoading(false);
    }
  }, []);

  const fetchRecentNotes = useCallback(async () => {
    setIsLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return [];

      const { data, error } = await supabase
        .from("verse_notes")
        .select("id, book, chapter, verse, content, created_at")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(10);

      if (error) throw error;
      setRecentNotes(data || []);
      return data || [];
    } catch (error) {
      console.error("[RecentNotes] Error:", error);
      return [];
    } finally {
      setIsLoading(false);
    }
  }, []);

  const formatStudyForContext = useCallback((study: RecentStudy): string => {
    return `### Study: "${study.title}"\n${study.content.substring(0, 1500)}${study.content.length > 1500 ? '...' : ''}\nTags: ${study.tags?.join(', ') || 'None'}`;
  }, []);

  const formatNoteForContext = useCallback((note: RecentNote): string => {
    return `### Note on ${note.book} ${note.chapter}:${note.verse}\n${note.content}`;
  }, []);

  return {
    recentStudies,
    recentNotes,
    isLoading,
    fetchRecentStudies,
    fetchRecentNotes,
    formatStudyForContext,
    formatNoteForContext,
  };
};
