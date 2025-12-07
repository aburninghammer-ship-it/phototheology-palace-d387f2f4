import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { TabState } from "@/contexts/StudySessionContext";

interface StudySessionRecord {
  id: string;
  title: string;
  description: string | null;
  tabs_data: TabState[];
  jeeves_context: any;
  tags: string[];
  is_active: boolean;
  created_at: string;
  updated_at: string;
  last_opened_at: string | null;
}

export function useStudySessions() {
  const { user } = useAuth();
  const [sessions, setSessions] = useState<StudySessionRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchSessions();
    }
  }, [user]);

  const fetchSessions = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from("study_sessions")
        .select("*")
        .eq("user_id", user.id)
        .order("updated_at", { ascending: false });

      if (error) throw error;
      
      // Transform the data to match our types
      const transformed = (data || []).map(row => ({
        ...row,
        tabs_data: (row.tabs_data as unknown as TabState[]) || [],
        tags: row.tags || [],
      }));
      
      setSessions(transformed);
    } catch (error) {
      console.error("Error fetching sessions:", error);
    } finally {
      setLoading(false);
    }
  };

  const deleteSession = async (sessionId: string) => {
    try {
      const { error } = await supabase
        .from("study_sessions")
        .delete()
        .eq("id", sessionId);

      if (error) throw error;
      
      setSessions(prev => prev.filter(s => s.id !== sessionId));
      return true;
    } catch (error) {
      console.error("Error deleting session:", error);
      return false;
    }
  };

  return {
    sessions,
    loading,
    refetch: fetchSessions,
    deleteSession,
  };
}
