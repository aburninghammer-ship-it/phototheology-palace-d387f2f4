import { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./useAuth";

export const useReadingHistory = () => {
  const { user } = useAuth();

  const trackReading = async (book: string, chapter: number) => {
    if (!user) return;

    try {
      // Check if this reading already exists
      const { data: existing } = await supabase
        .from("reading_history")
        .select("id")
        .eq("user_id", user.id)
        .eq("book", book)
        .eq("chapter", chapter)
        .single();

      if (existing) {
        // Update existing record
        await supabase
          .from("reading_history")
          .update({ last_read_at: new Date().toISOString() })
          .eq("id", existing.id);
      } else {
        // Insert new record
        await supabase
          .from("reading_history")
          .insert({
            user_id: user.id,
            book,
            chapter,
          });
      }
    } catch (error) {
      console.error("Error tracking reading:", error);
    }
  };

  const getRecentReading = async (limit = 5) => {
    if (!user) return [];

    try {
      const { data, error } = await supabase
        .from("reading_history")
        .select("*")
        .eq("user_id", user.id)
        .order("last_read_at", { ascending: false })
        .limit(limit);

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error("Error fetching reading history:", error);
      return [];
    }
  };

  return { trackReading, getRecentReading };
};
