import { useEffect, useRef } from "react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

export const DailyVerseNotification = () => {
  const { user } = useAuth();
  const hasNotifiedRef = useRef(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user || hasNotifiedRef.current) return;

    const checkAndNotify = async () => {
      try {
        // Check user preferences
        const { data: prefs } = await supabase
          .from("notification_preferences")
          .select("daily_verse")
          .eq("user_id", user.id)
          .maybeSingle();

        // If user has disabled daily verse notifications, skip
        if (prefs && prefs.daily_verse === false) {
          console.log("Daily verse notifications disabled for user");
          return;
        }

        const today = new Date().toISOString().split('T')[0];
        const storageKey = `daily_verse_notified_${user.id}_${today}`;

        // Check if already notified today (using localStorage)
        if (localStorage.getItem(storageKey)) {
          console.log("Already notified about daily verse today");
          return;
        }

        // Fetch today's verse
        const { data: verse, error } = await supabase
          .from("daily_verses")
          .select("verse_reference, verse_text")
          .eq("date", today)
          .single();

        if (error || !verse) {
          console.log("No daily verse for today:", error?.message);
          return;
        }

        // Mark as notified
        hasNotifiedRef.current = true;
        localStorage.setItem(storageKey, "true");

        // Show toast notification
        toast("📖 Today's Verse", {
          description: `${verse.verse_reference}: "${verse.verse_text.slice(0, 80)}..."`,
          duration: 8000,
          action: {
            label: "View",
            onClick: () => navigate("/daily-verse"),
          },
        });

        console.log("Daily verse notification shown:", verse.verse_reference);
      } catch (err) {
        console.error("Error checking daily verse:", err);
      }
    };

    // Small delay to let the app settle
    const timer = setTimeout(checkAndNotify, 2000);
    return () => clearTimeout(timer);
  }, [user, navigate]);

  return null;
};
