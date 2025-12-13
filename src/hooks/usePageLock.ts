import { useCallback, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

const LOCKED_PAGES_KEY = "pt_locked_pages";

// Load locked pages from localStorage
const loadLockedPages = (): Set<string> => {
  try {
    const stored = localStorage.getItem(LOCKED_PAGES_KEY);
    if (stored) {
      return new Set(JSON.parse(stored));
    }
  } catch (e) {
    console.warn("Failed to load locked pages:", e);
  }
  return new Set();
};

// Save locked pages to localStorage
const saveLockedPages = (pages: Set<string>) => {
  try {
    localStorage.setItem(LOCKED_PAGES_KEY, JSON.stringify([...pages]));
  } catch (e) {
    console.warn("Failed to save locked pages:", e);
  }
};

/**
 * Hook to manage page lock state for the current page
 * When a page is locked:
 * - Visual indicator shows the page is preserved
 * - Navigation away shows a confirmation dialog
 * - State is strongly preserved
 */
export const usePageLock = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const currentPath = location.pathname;
  
  const [lockedPages, setLockedPages] = useState<Set<string>>(() => loadLockedPages());
  const isLocked = lockedPages.has(currentPath);

  // Save to localStorage whenever lockedPages changes
  useEffect(() => {
    saveLockedPages(lockedPages);
  }, [lockedPages]);

  const toggleLock = useCallback(() => {
    setLockedPages(prev => {
      const newSet = new Set(prev);
      if (newSet.has(currentPath)) {
        newSet.delete(currentPath);
        toast({
          title: "Page Unlocked",
          description: "Page state will still be preserved, but no navigation confirmation.",
        });
      } else {
        newSet.add(currentPath);
        toast({
          title: "Page Locked",
          description: "Your position will be preserved. You'll be asked before navigating away.",
        });
      }
      return newSet;
    });
  }, [currentPath, toast]);

  const lockPage = useCallback(() => {
    setLockedPages(prev => {
      const newSet = new Set(prev);
      newSet.add(currentPath);
      return newSet;
    });
  }, [currentPath]);

  const unlockPage = useCallback(() => {
    setLockedPages(prev => {
      const newSet = new Set(prev);
      newSet.delete(currentPath);
      return newSet;
    });
  }, [currentPath]);

  const isPageLocked = useCallback((path: string) => {
    return lockedPages.has(path);
  }, [lockedPages]);

  const getAllLockedPages = useCallback(() => {
    return [...lockedPages];
  }, [lockedPages]);

  return {
    isLocked,
    toggleLock,
    lockPage,
    unlockPage,
    isPageLocked,
    getAllLockedPages,
  };
};

/**
 * Hook to add navigation blocking for locked pages
 * Use this at the app level or in preserved page components
 */
export const useLockedPageGuard = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { isLocked } = usePageLock();

  useEffect(() => {
    if (!isLocked) return;

    // Add beforeunload handler to warn about leaving the page
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = "";
      return "";
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [isLocked, location.pathname]);
};
