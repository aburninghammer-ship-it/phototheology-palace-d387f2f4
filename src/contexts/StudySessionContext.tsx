import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";

export interface TabState {
  id: string;
  type: "study-bible" | "research" | "analyze" | "gems" | "commentary" | "my-studies" | "concordance";
  path: string;
  title: string;
  state: {
    scrollPosition: number;
    content: any;
    jeevesHistory: { role: string; content: string }[];
    insertedScriptures: string[];
    formData?: Record<string, any>;
  };
  openedAt: string;
}

export interface StudySession {
  id: string;
  title: string;
  description?: string;
  tabs: TabState[];
  activeTabId: string | null;
  jeevesContext: {
    sessionTitle: string;
    tabSummaries: { tabId: string; summary: string }[];
    conversationHistory: { role: string; content: string }[];
  };
  tags: string[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

interface StudySessionContextType {
  currentSession: StudySession | null;
  isSessionActive: boolean;
  tabs: TabState[];
  activeTab: TabState | null;
  
  // Session management
  startSession: (title: string, description?: string) => Promise<void>;
  endSession: () => void;
  saveSession: () => Promise<void>;
  loadSession: (sessionId: string) => Promise<void>;
  
  // Tab management
  openTab: (type: TabState["type"], path: string, title: string, initialState?: Partial<TabState["state"]>) => void;
  closeTab: (tabId: string) => void;
  switchTab: (tabId: string) => void;
  updateTabState: (tabId: string, updates: Partial<TabState["state"]>) => void;
  
  // Scripture insertion
  insertScriptureToActiveTab: (scripture: string) => void;
  
  // Jeeves context
  addToJeevesHistory: (message: { role: string; content: string }) => void;
  getJeevesContext: () => string;
}

const StudySessionContext = createContext<StudySessionContextType | undefined>(undefined);

export function useStudySession() {
  const context = useContext(StudySessionContext);
  if (!context) {
    throw new Error("useStudySession must be used within a StudySessionProvider");
  }
  return context;
}

interface Props {
  children: ReactNode;
}

export function StudySessionProvider({ children }: Props) {
  const { user } = useAuth();
  const [currentSession, setCurrentSession] = useState<StudySession | null>(null);
  const [tabs, setTabs] = useState<TabState[]>([]);
  const [activeTabId, setActiveTabId] = useState<string | null>(null);

  const isSessionActive = currentSession !== null && currentSession.isActive;
  const activeTab = tabs.find(t => t.id === activeTabId) || null;

  // Auto-save session periodically
  useEffect(() => {
    if (!currentSession || !user) return;
    
    const interval = setInterval(() => {
      saveSessionToDb();
    }, 30000); // Auto-save every 30 seconds
    
    return () => clearInterval(interval);
  }, [currentSession, tabs, user]);

  const saveSessionToDb = async () => {
    if (!currentSession || !user) return;
    
    try {
      const { error } = await supabase
        .from("study_sessions")
        .update({
          title: currentSession.title,
          description: currentSession.description,
          tabs_data: JSON.parse(JSON.stringify(tabs)),
          jeeves_context: JSON.parse(JSON.stringify(currentSession.jeevesContext)),
          tags: currentSession.tags,
          is_active: currentSession.isActive,
          updated_at: new Date().toISOString(),
          last_opened_at: new Date().toISOString(),
        })
        .eq("id", currentSession.id);
      
      if (error) throw error;
    } catch (error) {
      console.error("Failed to auto-save session:", error);
    }
  };

  const startSession = async (title: string, description?: string) => {
    if (!user) {
      toast.error("Please sign in to start a study session");
      return;
    }

    const newSession: StudySession = {
      id: crypto.randomUUID(),
      title,
      description,
      tabs: [],
      activeTabId: null,
      jeevesContext: {
        sessionTitle: title,
        tabSummaries: [],
        conversationHistory: [],
      },
      tags: [],
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setCurrentSession(newSession);
    setTabs([]);
    setActiveTabId(null);
    
    // Save to database
    try {
      const insertData = {
        id: newSession.id,
        user_id: user.id,
        title: newSession.title,
        description: newSession.description,
        tabs_data: JSON.parse(JSON.stringify([])),
        jeeves_context: JSON.parse(JSON.stringify(newSession.jeevesContext)),
        tags: [] as string[],
        is_active: true,
      };
      
      const { error } = await supabase
        .from("study_sessions")
        .insert(insertData);
      
      if (error) throw error;
      toast.success(`Study session "${title}" started!`);
    } catch (error) {
      console.error("Failed to save session:", error);
      toast.error("Failed to start session");
    }
  };

  const endSession = () => {
    saveSessionToDb();
    setCurrentSession(prev => prev ? { ...prev, isActive: false } : null);
    toast.success("Session saved");
  };

  const saveSession = async () => {
    await saveSessionToDb();
    toast.success("Session saved!");
  };

  const loadSession = async (sessionId: string) => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from("study_sessions")
        .select("*")
        .eq("id", sessionId)
        .single();
      
      if (error) throw error;
      
      const loadedTabs = (data.tabs_data as unknown as TabState[]) || [];
      const jeevesContext = (data.jeeves_context as unknown as StudySession["jeevesContext"]) || {
        sessionTitle: data.title,
        tabSummaries: [],
        conversationHistory: [],
      };
      
      setCurrentSession({
        id: data.id,
        title: data.title,
        description: data.description,
        tabs: loadedTabs,
        activeTabId: loadedTabs.length > 0 ? loadedTabs[0].id : null,
        jeevesContext,
        tags: data.tags || [],
        isActive: true,
        createdAt: data.created_at,
        updatedAt: data.updated_at,
      });
      
      setTabs(loadedTabs);
      setActiveTabId(loadedTabs.length > 0 ? loadedTabs[0].id : null);
      
      // Update last opened
      await supabase
        .from("study_sessions")
        .update({ 
          last_opened_at: new Date().toISOString(),
          is_active: true 
        })
        .eq("id", sessionId);
      
      toast.success(`Session "${data.title}" restored!`);
    } catch (error) {
      console.error("Failed to load session:", error);
      toast.error("Failed to load session");
    }
  };

  const openTab = useCallback((
    type: TabState["type"],
    path: string,
    title: string,
    initialState?: Partial<TabState["state"]>
  ) => {
    // Check if tab already exists
    const existingTab = tabs.find(t => t.path === path);
    if (existingTab) {
      setActiveTabId(existingTab.id);
      return;
    }

    const newTab: TabState = {
      id: crypto.randomUUID(),
      type,
      path,
      title,
      state: {
        scrollPosition: 0,
        content: null,
        jeevesHistory: [],
        insertedScriptures: [],
        formData: {},
        ...initialState,
      },
      openedAt: new Date().toISOString(),
    };

    setTabs(prev => [...prev, newTab]);
    setActiveTabId(newTab.id);
  }, [tabs]);

  const closeTab = useCallback((tabId: string) => {
    setTabs(prev => {
      const newTabs = prev.filter(t => t.id !== tabId);
      if (activeTabId === tabId && newTabs.length > 0) {
        setActiveTabId(newTabs[newTabs.length - 1].id);
      } else if (newTabs.length === 0) {
        setActiveTabId(null);
      }
      return newTabs;
    });
  }, [activeTabId]);

  const switchTab = useCallback((tabId: string) => {
    setActiveTabId(tabId);
  }, []);

  const updateTabState = useCallback((tabId: string, updates: Partial<TabState["state"]>) => {
    setTabs(prev => prev.map(tab => 
      tab.id === tabId 
        ? { ...tab, state: { ...tab.state, ...updates } }
        : tab
    ));
  }, []);

  const insertScriptureToActiveTab = useCallback((scripture: string) => {
    if (!activeTabId) return;
    
    setTabs(prev => prev.map(tab => 
      tab.id === activeTabId 
        ? { 
            ...tab, 
            state: { 
              ...tab.state, 
              insertedScriptures: [...tab.state.insertedScriptures, scripture] 
            } 
          }
        : tab
    ));
  }, [activeTabId]);

  const addToJeevesHistory = useCallback((message: { role: string; content: string }) => {
    setCurrentSession(prev => {
      if (!prev) return prev;
      return {
        ...prev,
        jeevesContext: {
          ...prev.jeevesContext,
          conversationHistory: [...prev.jeevesContext.conversationHistory, message],
        },
      };
    });
  }, []);

  const getJeevesContext = useCallback(() => {
    if (!currentSession) return "";
    
    const tabSummaries = tabs.map(tab => {
      const scriptureCount = tab.state.insertedScriptures.length;
      return `- ${tab.title} (${tab.type}): ${scriptureCount} scriptures inserted`;
    }).join("\n");
    
    return `
You are assisting in a multi-tab study session titled "${currentSession.title}".
${currentSession.description ? `Session description: ${currentSession.description}` : ""}

Open tabs:
${tabSummaries || "No tabs open yet"}

Reference earlier discoveries when relevant. Suggest connections between tabs.
Help the user build a cohesive understanding across their study materials.
`;
  }, [currentSession, tabs]);

  return (
    <StudySessionContext.Provider value={{
      currentSession,
      isSessionActive,
      tabs,
      activeTab,
      startSession,
      endSession,
      saveSession,
      loadSession,
      openTab,
      closeTab,
      switchTab,
      updateTabState,
      insertScriptureToActiveTab,
      addToJeevesHistory,
      getJeevesContext,
    }}>
      {children}
    </StudySessionContext.Provider>
  );
}
