import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface SessionTab {
  id: string;
  tabType: string;
  tabOrder: number;
  isActive: boolean;
  tabState: Record<string, unknown>;
}

interface SessionVerse {
  book: string;
  chapter: number;
  verseStart?: number;
  verseEnd?: number;
  notes?: string;
  crossReferences?: string[];
}

interface PTInteraction {
  interactionType: string;
  roomCode?: string;
  floorNumber?: number;
  principleCode?: string;
  interactionData?: Record<string, unknown>;
}

interface JeevesInteraction {
  prompt: string;
  response: string;
  analysisType?: string;
  metadata?: Record<string, unknown>;
}

interface SessionNote {
  content: string;
  noteType: string;
  relatedVerse?: string;
  relatedRoom?: string;
}

type SessionStatus = 'draft' | 'saved' | 'archived';

interface StudySession {
  id: string;
  userId: string;
  title: string;
  description?: string;
  tags: string[];
  status: SessionStatus;
  isPublic: boolean;
  shareToken?: string;
  thumbnailUrl?: string;
  startedAt: string;
  lastAutoSaveAt: string;
  savedAt?: string;
  totalDurationSeconds: number;
  aiSummary?: string;
  aiSummaryGeneratedAt?: string;
  sessionState: Record<string, unknown>;
  tabs: SessionTab[];
  verses: SessionVerse[];
  ptInteractions: PTInteraction[];
  jeevesInteractions: JeevesInteraction[];
  notes: SessionNote[];
}

interface SessionModeContextType {
  isSessionActive: boolean;
  currentSession: StudySession | null;
  isLoading: boolean;
  isSaving: boolean;
  startSession: (title?: string) => Promise<string | null>;
  endSession: () => Promise<void>;
  saveSession: (title?: string, description?: string, tags?: string[]) => Promise<void>;
  trackTabOpen: (tabType: string, tabState?: Record<string, unknown>) => void;
  trackTabClose: (tabType: string) => void;
  trackVerseAccess: (book: string, chapter: number, verseStart?: number, verseEnd?: number) => void;
  trackPTInteraction: (interaction: PTInteraction) => void;
  trackJeevesInteraction: (interaction: JeevesInteraction) => void;
  addSessionNote: (note: SessionNote) => void;
  loadSession: (sessionId: string) => Promise<void>;
  getSessions: () => Promise<StudySession[]>;
  deleteSession: (sessionId: string) => Promise<void>;
  shareSession: (sessionId: string) => Promise<string | null>;
  lastAutoSave: Date | null;
  showSessionPrompt: boolean;
  setShowSessionPrompt: (show: boolean) => void;
  dismissSessionPrompt: () => void;
}

const SessionModeContext = createContext<SessionModeContextType | undefined>(undefined);

const AUTO_SAVE_INTERVAL = 60000;
const SESSION_PROMPT_THRESHOLD = 2;

// Helper to safely convert status
const toSessionStatus = (status: string | null | undefined): SessionStatus => {
  if (status === 'saved' || status === 'archived') return status;
  return 'draft';
};

// Helper to safely convert JSON to Record
const toRecord = (json: unknown): Record<string, unknown> => {
  if (json && typeof json === 'object' && !Array.isArray(json)) {
    return json as Record<string, unknown>;
  }
  return {};
};

export function SessionModeProvider({ children }: { children: React.ReactNode }) {
  const [isSessionActive, setIsSessionActive] = useState(false);
  const [currentSession, setCurrentSession] = useState<StudySession | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [lastAutoSave, setLastAutoSave] = useState<Date | null>(null);
  const [showSessionPrompt, setShowSessionPrompt] = useState(false);
  const [openTabCount, setOpenTabCount] = useState(0);
  const [promptDismissed, setPromptDismissed] = useState(false);
  
  const autoSaveTimer = useRef<ReturnType<typeof setInterval> | null>(null);
  const sessionStartTime = useRef<Date | null>(null);

  const performAutoSave = useCallback(async () => {
    if (!currentSession || !isSessionActive || currentSession.status === 'saved') return;
    
    try {
      const duration = sessionStartTime.current 
        ? Math.floor((Date.now() - sessionStartTime.current.getTime()) / 1000)
        : 0;
      
      const { error } = await supabase
        .from('study_sessions')
        .update({
          last_auto_save_at: new Date().toISOString(),
          total_duration_seconds: (currentSession.totalDurationSeconds || 0) + duration,
          session_state: currentSession.sessionState as any,
          tabs_data: currentSession.tabs as any
        })
        .eq('id', currentSession.id);
      
      if (error) throw error;
      
      setLastAutoSave(new Date());
      console.log('Session auto-saved');
    } catch (error) {
      console.error('Auto-save failed:', error);
    }
  }, [currentSession, isSessionActive]);

  useEffect(() => {
    if (isSessionActive && currentSession) {
      autoSaveTimer.current = setInterval(performAutoSave, AUTO_SAVE_INTERVAL);
      sessionStartTime.current = new Date();
    }
    
    return () => {
      if (autoSaveTimer.current) {
        clearInterval(autoSaveTimer.current);
      }
    };
  }, [isSessionActive, currentSession, performAutoSave]);

  useEffect(() => {
    if (!isSessionActive && !promptDismissed && openTabCount >= SESSION_PROMPT_THRESHOLD) {
      setShowSessionPrompt(true);
    }
  }, [openTabCount, isSessionActive, promptDismissed]);

  const startSession = async (title?: string): Promise<string | null> => {
    try {
      setIsLoading(true);
      
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error('Please sign in to start a session');
        return null;
      }

      const { data, error } = await supabase
        .from('study_sessions')
        .insert({
          user_id: user.id,
          title: title || 'Untitled Session',
          status: 'draft',
          tabs_data: [],
          started_at: new Date().toISOString()
        })
        .select()
        .single();

      if (error) throw error;

      const session: StudySession = {
        id: data.id,
        userId: data.user_id,
        title: data.title,
        description: data.description || undefined,
        tags: data.tags || [],
        status: toSessionStatus(data.status),
        isPublic: data.is_public || false,
        shareToken: data.share_token || undefined,
        thumbnailUrl: data.thumbnail_url || undefined,
        startedAt: data.started_at || new Date().toISOString(),
        lastAutoSaveAt: data.last_auto_save_at || new Date().toISOString(),
        savedAt: data.saved_at || undefined,
        totalDurationSeconds: data.total_duration_seconds || 0,
        aiSummary: data.ai_summary || undefined,
        aiSummaryGeneratedAt: data.ai_summary_generated_at || undefined,
        sessionState: toRecord(data.session_state),
        tabs: [],
        verses: [],
        ptInteractions: [],
        jeevesInteractions: [],
        notes: []
      };

      setCurrentSession(session);
      setIsSessionActive(true);
      setShowSessionPrompt(false);
      sessionStartTime.current = new Date();
      
      toast.success('Session started! Your study will be tracked.');
      return data.id;
    } catch (error) {
      console.error('Failed to start session:', error);
      toast.error('Failed to start session');
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const endSession = async () => {
    if (!currentSession) return;
    
    try {
      await performAutoSave();
      setIsSessionActive(false);
      setCurrentSession(null);
      sessionStartTime.current = null;
      toast.info('Session ended');
    } catch (error) {
      console.error('Failed to end session:', error);
    }
  };

  const saveSession = async (title?: string, description?: string, tags?: string[]) => {
    if (!currentSession) return;
    
    try {
      setIsSaving(true);
      
      const duration = sessionStartTime.current 
        ? Math.floor((Date.now() - sessionStartTime.current.getTime()) / 1000)
        : 0;

      const { error } = await supabase
        .from('study_sessions')
        .update({
          title: title || currentSession.title,
          description: description || currentSession.description,
          tags: tags || currentSession.tags,
          status: 'saved',
          saved_at: new Date().toISOString(),
          total_duration_seconds: (currentSession.totalDurationSeconds || 0) + duration,
          session_state: currentSession.sessionState as any,
          tabs_data: currentSession.tabs as any
        })
        .eq('id', currentSession.id);

      if (error) throw error;

      setCurrentSession(prev => prev ? {
        ...prev,
        title: title || prev.title,
        description: description || prev.description,
        tags: tags || prev.tags,
        status: 'saved' as SessionStatus,
        savedAt: new Date().toISOString()
      } : null);

      toast.success('Session saved successfully!');
    } catch (error) {
      console.error('Failed to save session:', error);
      toast.error('Failed to save session');
    } finally {
      setIsSaving(false);
    }
  };

  const trackTabOpen = (tabType: string, tabState?: Record<string, unknown>) => {
    setOpenTabCount(prev => prev + 1);
    
    if (!currentSession) return;
    
    const newTab: SessionTab = {
      id: crypto.randomUUID(),
      tabType,
      tabOrder: currentSession.tabs.length,
      isActive: true,
      tabState: tabState || {}
    };

    setCurrentSession(prev => prev ? {
      ...prev,
      tabs: [...prev.tabs.map(t => ({ ...t, isActive: false })), newTab]
    } : null);

    if (currentSession.id) {
      (supabase.from('session_tabs').insert as any)({
        session_id: currentSession.id,
        tab_type: tabType,
        tab_order: currentSession.tabs.length,
        is_active: true,
        tab_state: tabState || {}
      }).then(({ error }: any) => {
        if (error) console.error('Failed to track tab:', error);
      });
    }
  };

  const trackTabClose = (tabType: string) => {
    setOpenTabCount(prev => Math.max(0, prev - 1));
    
    if (!currentSession) return;
    
    setCurrentSession(prev => prev ? {
      ...prev,
      tabs: prev.tabs.filter(t => t.tabType !== tabType)
    } : null);
  };

  const trackVerseAccess = (book: string, chapter: number, verseStart?: number, verseEnd?: number) => {
    if (!currentSession) return;
    
    const verse: SessionVerse = { book, chapter, verseStart, verseEnd };
    
    setCurrentSession(prev => prev ? {
      ...prev,
      verses: [...prev.verses, verse]
    } : null);

    if (currentSession.id) {
      supabase
        .from('session_verses')
        .insert({
          session_id: currentSession.id,
          book,
          chapter,
          verse_start: verseStart,
          verse_end: verseEnd
        })
        .then(({ error }) => {
          if (error) console.error('Failed to track verse:', error);
        });
    }
  };

  const trackPTInteraction = (interaction: PTInteraction) => {
    if (!currentSession) return;
    
    setCurrentSession(prev => prev ? {
      ...prev,
      ptInteractions: [...prev.ptInteractions, interaction]
    } : null);

    if (currentSession.id) {
      (supabase.from('session_pt_interactions').insert as any)({
        session_id: currentSession.id,
        interaction_type: interaction.interactionType,
        room_code: interaction.roomCode,
        floor_number: interaction.floorNumber,
        principle_code: interaction.principleCode,
        interaction_data: interaction.interactionData || {}
      }).then(({ error }: any) => {
        if (error) console.error('Failed to track PT interaction:', error);
      });
    }
  };

  const trackJeevesInteraction = (interaction: JeevesInteraction) => {
    if (!currentSession) return;
    
    setCurrentSession(prev => prev ? {
      ...prev,
      jeevesInteractions: [...prev.jeevesInteractions, interaction]
    } : null);

    if (currentSession.id) {
      (supabase.from('session_jeeves_interactions').insert as any)({
        session_id: currentSession.id,
        prompt: interaction.prompt,
        response: interaction.response,
        analysis_type: interaction.analysisType,
        metadata: interaction.metadata || {}
      }).then(({ error }: any) => {
        if (error) console.error('Failed to track Jeeves interaction:', error);
      });
    }
  };

  const addSessionNote = (note: SessionNote) => {
    if (!currentSession) return;
    
    setCurrentSession(prev => prev ? {
      ...prev,
      notes: [...prev.notes, note]
    } : null);

    if (currentSession.id) {
      supabase
        .from('session_notes')
        .insert({
          session_id: currentSession.id,
          content: note.content,
          note_type: note.noteType,
          related_verse: note.relatedVerse,
          related_room: note.relatedRoom
        })
        .then(({ error }) => {
          if (error) console.error('Failed to add note:', error);
        });
    }
  };

  const loadSession = async (sessionId: string) => {
    try {
      setIsLoading(true);
      
      const { data: sessionData, error: sessionError } = await supabase
        .from('study_sessions')
        .select('*')
        .eq('id', sessionId)
        .single();

      if (sessionError) throw sessionError;

      const [tabsRes, versesRes, ptRes, jeevesRes, notesRes] = await Promise.all([
        supabase.from('session_tabs').select('*').eq('session_id', sessionId),
        supabase.from('session_verses').select('*').eq('session_id', sessionId),
        supabase.from('session_pt_interactions').select('*').eq('session_id', sessionId),
        supabase.from('session_jeeves_interactions').select('*').eq('session_id', sessionId),
        supabase.from('session_notes').select('*').eq('session_id', sessionId)
      ]);

      const session: StudySession = {
        id: sessionData.id,
        userId: sessionData.user_id,
        title: sessionData.title,
        description: sessionData.description || undefined,
        tags: sessionData.tags || [],
        status: toSessionStatus(sessionData.status),
        isPublic: sessionData.is_public || false,
        shareToken: sessionData.share_token || undefined,
        thumbnailUrl: sessionData.thumbnail_url || undefined,
        startedAt: sessionData.started_at || new Date().toISOString(),
        lastAutoSaveAt: sessionData.last_auto_save_at || new Date().toISOString(),
        savedAt: sessionData.saved_at || undefined,
        totalDurationSeconds: sessionData.total_duration_seconds || 0,
        aiSummary: sessionData.ai_summary || undefined,
        aiSummaryGeneratedAt: sessionData.ai_summary_generated_at || undefined,
        sessionState: toRecord(sessionData.session_state),
        tabs: (tabsRes.data || []).map(t => ({
          id: t.id,
          tabType: t.tab_type,
          tabOrder: t.tab_order,
          isActive: t.is_active,
          tabState: toRecord(t.tab_state)
        })),
        verses: (versesRes.data || []).map(v => ({
          book: v.book,
          chapter: v.chapter,
          verseStart: v.verse_start || undefined,
          verseEnd: v.verse_end || undefined,
          notes: v.notes || undefined,
          crossReferences: v.cross_references || []
        })),
        ptInteractions: (ptRes.data || []).map(p => ({
          interactionType: p.interaction_type,
          roomCode: p.room_code || undefined,
          floorNumber: p.floor_number || undefined,
          principleCode: p.principle_code || undefined,
          interactionData: toRecord(p.interaction_data)
        })),
        jeevesInteractions: (jeevesRes.data || []).map(j => ({
          prompt: j.prompt,
          response: j.response,
          analysisType: j.analysis_type || undefined,
          metadata: toRecord(j.metadata)
        })),
        notes: (notesRes.data || []).map(n => ({
          content: n.content,
          noteType: n.note_type,
          relatedVerse: n.related_verse || undefined,
          relatedRoom: n.related_room || undefined
        }))
      };

      setCurrentSession(session);
      setIsSessionActive(true);
      sessionStartTime.current = new Date();
      
      toast.success(`Session "${session.title}" loaded`);
    } catch (error) {
      console.error('Failed to load session:', error);
      toast.error('Failed to load session');
    } finally {
      setIsLoading(false);
    }
  };

  const getSessions = async (): Promise<StudySession[]> => {
    try {
      const { data, error } = await supabase
        .from('study_sessions')
        .select('*')
        .order('updated_at', { ascending: false });

      if (error) throw error;

      return (data || []).map(s => ({
        id: s.id,
        userId: s.user_id,
        title: s.title,
        description: s.description || undefined,
        tags: s.tags || [],
        status: toSessionStatus(s.status),
        isPublic: s.is_public || false,
        shareToken: s.share_token || undefined,
        thumbnailUrl: s.thumbnail_url || undefined,
        startedAt: s.started_at || new Date().toISOString(),
        lastAutoSaveAt: s.last_auto_save_at || new Date().toISOString(),
        savedAt: s.saved_at || undefined,
        totalDurationSeconds: s.total_duration_seconds || 0,
        aiSummary: s.ai_summary || undefined,
        aiSummaryGeneratedAt: s.ai_summary_generated_at || undefined,
        sessionState: toRecord(s.session_state),
        tabs: [],
        verses: [],
        ptInteractions: [],
        jeevesInteractions: [],
        notes: []
      }));
    } catch (error) {
      console.error('Failed to get sessions:', error);
      return [];
    }
  };

  const deleteSession = async (sessionId: string) => {
    try {
      const { error } = await supabase
        .from('study_sessions')
        .delete()
        .eq('id', sessionId);

      if (error) throw error;

      if (currentSession?.id === sessionId) {
        setCurrentSession(null);
        setIsSessionActive(false);
      }

      toast.success('Session deleted');
    } catch (error) {
      console.error('Failed to delete session:', error);
      toast.error('Failed to delete session');
    }
  };

  const shareSession = async (sessionId: string): Promise<string | null> => {
    try {
      const { data, error } = await supabase.rpc('generate_session_share_token');
      if (error) throw error;

      const { error: updateError } = await supabase
        .from('study_sessions')
        .update({ 
          share_token: data,
          is_public: true 
        })
        .eq('id', sessionId);

      if (updateError) throw updateError;

      const shareUrl = `${window.location.origin}/session/${data}`;
      toast.success('Session shared! Link copied to clipboard.');
      navigator.clipboard.writeText(shareUrl);
      
      return shareUrl;
    } catch (error) {
      console.error('Failed to share session:', error);
      toast.error('Failed to share session');
      return null;
    }
  };

  const dismissSessionPrompt = () => {
    setShowSessionPrompt(false);
    setPromptDismissed(true);
  };

  return (
    <SessionModeContext.Provider
      value={{
        isSessionActive,
        currentSession,
        isLoading,
        isSaving,
        startSession,
        endSession,
        saveSession,
        trackTabOpen,
        trackTabClose,
        trackVerseAccess,
        trackPTInteraction,
        trackJeevesInteraction,
        addSessionNote,
        loadSession,
        getSessions,
        deleteSession,
        shareSession,
        lastAutoSave,
        showSessionPrompt,
        setShowSessionPrompt,
        dismissSessionPrompt
      }}
    >
      {children}
    </SessionModeContext.Provider>
  );
}

export function useSessionMode() {
  const context = useContext(SessionModeContext);
  if (context === undefined) {
    throw new Error('useSessionMode must be used within a SessionModeProvider');
  }
  return context;
}
