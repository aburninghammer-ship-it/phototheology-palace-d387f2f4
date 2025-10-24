import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./useAuth";
import { useToast } from "./use-toast";

interface Bookmark {
  id: string;
  book: string;
  chapter: number;
  verse?: number;
  note?: string;
  color: string;
  created_at: string;
}

export const useBookmarks = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      loadBookmarks();
    }
  }, [user]);

  const loadBookmarks = async () => {
    if (!user) return;

    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("bookmarks")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setBookmarks(data || []);
    } catch (error) {
      console.error("Error loading bookmarks:", error);
    } finally {
      setLoading(false);
    }
  };

  const addBookmark = async (
    book: string,
    chapter: number,
    verse?: number,
    note?: string,
    color: string = "yellow"
  ) => {
    if (!user) {
      toast({
        title: "Sign in required",
        description: "Please sign in to bookmark verses",
        variant: "destructive",
      });
      return;
    }

    try {
      const { error } = await supabase.from("bookmarks").insert({
        user_id: user.id,
        book,
        chapter,
        verse,
        note,
        color,
      });

      if (error) throw error;

      toast({
        title: "Bookmark added",
        description: `${book} ${chapter}${verse ? `:${verse}` : ""} bookmarked`,
      });

      loadBookmarks();
    } catch (error) {
      console.error("Error adding bookmark:", error);
      toast({
        title: "Error",
        description: "Failed to add bookmark",
        variant: "destructive",
      });
    }
  };

  const removeBookmark = async (bookmarkId: string) => {
    try {
      const { error } = await supabase
        .from("bookmarks")
        .delete()
        .eq("id", bookmarkId);

      if (error) throw error;

      toast({
        title: "Bookmark removed",
      });

      loadBookmarks();
    } catch (error) {
      console.error("Error removing bookmark:", error);
    }
  };

  const isBookmarked = (book: string, chapter: number, verse?: number) => {
    return bookmarks.some(
      (b) =>
        b.book === book &&
        b.chapter === chapter &&
        (verse === undefined || b.verse === verse)
    );
  };

  return { bookmarks, loading, addBookmark, removeBookmark, isBookmarked };
};
