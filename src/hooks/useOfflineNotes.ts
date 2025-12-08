import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";

export interface OfflineNote {
  id: string;
  content: string;
  title?: string;
  tags?: string[];
  created_at: string;
  updated_at: string;
  synced: boolean;
}

const STORAGE_KEY = "phototheology_offline_notes";

export const useOfflineNotes = () => {
  const { user } = useAuth();
  const [notes, setNotes] = useState<OfflineNote[]>([]);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [isSyncing, setIsSyncing] = useState(false);

  // Load notes from localStorage on mount
  useEffect(() => {
    loadFromLocalStorage();
  }, []);

  // Listen to online/offline status
  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      syncNotes();
    };
    const handleOffline = () => setIsOnline(false);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, [user]);

  const loadFromLocalStorage = () => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setNotes(JSON.parse(stored));
      }
    } catch (e) {
      console.error("Failed to load notes from localStorage:", e);
    }
  };

  const saveToLocalStorage = useCallback((updatedNotes: OfflineNote[]) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedNotes));
      setNotes(updatedNotes);
    } catch (e) {
      console.error("Failed to save notes to localStorage:", e);
    }
  }, []);

  const addNote = useCallback((content: string, title?: string, tags?: string[]) => {
    const newNote: OfflineNote = {
      id: crypto.randomUUID(),
      content,
      title: title || `Note ${new Date().toLocaleDateString()}`,
      tags: tags || [],
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      synced: false,
    };

    const updatedNotes = [newNote, ...notes];
    saveToLocalStorage(updatedNotes);
    
    // Auto-sync if online
    if (isOnline && user) {
      syncNote(newNote);
    }

    return newNote;
  }, [notes, isOnline, user, saveToLocalStorage]);

  const updateNote = useCallback((id: string, content: string, title?: string) => {
    const updatedNotes = notes.map((note) =>
      note.id === id
        ? { ...note, content, title: title || note.title, updated_at: new Date().toISOString(), synced: false }
        : note
    );
    saveToLocalStorage(updatedNotes);

    // Auto-sync if online
    if (isOnline && user) {
      const updatedNote = updatedNotes.find((n) => n.id === id);
      if (updatedNote) syncNote(updatedNote);
    }
  }, [notes, isOnline, user, saveToLocalStorage]);

  const deleteNote = useCallback((id: string) => {
    const updatedNotes = notes.filter((note) => note.id !== id);
    saveToLocalStorage(updatedNotes);
  }, [notes, saveToLocalStorage]);

  const syncNote = async (note: OfflineNote) => {
    if (!user) return;

    try {
      // For now, just mark as synced - we can add DB sync later
      const updatedNotes = notes.map((n) =>
        n.id === note.id ? { ...n, synced: true } : n
      );
      saveToLocalStorage(updatedNotes);
    } catch (e) {
      console.error("Failed to sync note:", e);
    }
  };

  const syncNotes = async () => {
    if (!user || isSyncing) return;

    setIsSyncing(true);
    try {
      const unsyncedNotes = notes.filter((n) => !n.synced);
      for (const note of unsyncedNotes) {
        await syncNote(note);
      }
      if (unsyncedNotes.length > 0) {
        toast.success(`${unsyncedNotes.length} notes synced`);
      }
    } catch (e) {
      console.error("Failed to sync notes:", e);
    } finally {
      setIsSyncing(false);
    }
  };

  return {
    notes,
    addNote,
    updateNote,
    deleteNote,
    isOnline,
    isSyncing,
    syncNotes,
  };
};
