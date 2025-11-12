import { useEffect, useState } from "react";

export interface PageBookmark {
  path: string;
  title: string;
  icon?: string;
  addedAt: number;
}

const STORAGE_KEY = "phototheology_page_bookmarks";

export const usePageBookmarks = () => {
  const [bookmarks, setBookmarks] = useState<PageBookmark[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  const saveBookmarks = (newBookmarks: PageBookmark[]) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newBookmarks));
      setBookmarks(newBookmarks);
    } catch (e) {
      console.error("Failed to save bookmarks:", e);
    }
  };

  const addBookmark = (bookmark: Omit<PageBookmark, "addedAt">) => {
    const newBookmark: PageBookmark = {
      ...bookmark,
      addedAt: Date.now(),
    };
    
    // Check if already bookmarked
    if (bookmarks.some((b) => b.path === bookmark.path)) {
      return;
    }

    saveBookmarks([...bookmarks, newBookmark]);
  };

  const removeBookmark = (path: string) => {
    saveBookmarks(bookmarks.filter((b) => b.path !== path));
  };

  const isBookmarked = (path: string) => {
    return bookmarks.some((b) => b.path === path);
  };

  const toggleBookmark = (bookmark: Omit<PageBookmark, "addedAt">) => {
    if (isBookmarked(bookmark.path)) {
      removeBookmark(bookmark.path);
    } else {
      addBookmark(bookmark);
    }
  };

  return {
    bookmarks,
    addBookmark,
    removeBookmark,
    isBookmarked,
    toggleBookmark,
  };
};
