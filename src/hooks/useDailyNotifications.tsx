import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface DailyContent {
  type: "room" | "game" | "verse" | "fact" | "gem";
  title: string;
  message: string;
  link?: string;
}

const DAILY_CONTENT: DailyContent[] = [
  // Rooms
  { type: "room", title: "Try This Room!", message: "Explore the Story Room today - where you'll store Bible narratives as vivid mental movies!", link: "/palace/floor/1/room/story-room" },
  { type: "room", title: "Room Spotlight", message: "The Imagination Room awaits! Step inside Scripture and experience it firsthand.", link: "/palace/floor/1/room/imagination-room" },
  { type: "room", title: "New Adventure", message: "Visit the Observation Room and become a detective of Scripture!", link: "/palace/floor/2/room/observation-room" },
  { type: "room", title: "Explore Today", message: "The Translation Room turns words into pictures. Transform your memory!", link: "/palace/floor/1/room/translation-room" },
  { type: "room", title: "Palace Pick", message: "The Concentration Room awaits - every text reveals Christ!", link: "/palace/floor/4/room/concentration-room" },
  
  // Games
  { type: "game", title: "Play This Game!", message: "Chain Chess is calling! Build powerful verse chains and level up!", link: "/games/chain-chess" },
  { type: "game", title: "Game Time", message: "Test your memory with Verse Match - can you beat your high score?", link: "/games/verse-match" },
  { type: "game", title: "Challenge Ready", message: "Principle Puzzle awaits! Connect PT codes to build mastery.", link: "/games/principle-puzzle" },
  { type: "game", title: "Daily Game", message: "Try the Palace Quiz and test your floor knowledge!", link: "/games/palace-quiz" },
  { type: "game", title: "Fun Awaits", message: "Treasure Hunt is live! Discover hidden gems in Scripture.", link: "/treasure-hunt" },
  
  // Verses
  { type: "verse", title: "Verse of the Day", message: "\"Thy word is a lamp unto my feet\" - Psalm 119:105. Store this in your palace today!" },
  { type: "verse", title: "Daily Scripture", message: "\"I can do all things through Christ\" - Phil 4:13. Let this strengthen your study!" },
  { type: "verse", title: "Memorize This", message: "\"Be still and know that I am God\" - Psalm 46:10. Meditate on this in the Fire Room." },
  { type: "verse", title: "Today's Verse", message: "\"The LORD is my shepherd\" - Psalm 23:1. Walk through this in the Imagination Room!" },
  { type: "verse", title: "Scripture Focus", message: "\"For God so loved the world\" - John 3:16. The Concentration Room reveals Christ here!" },
  
  // Did You Know Facts
  { type: "fact", title: "Did You Know?", message: "The Bible has 1,189 chapters - and Phototheology helps you map every one!" },
  { type: "fact", title: "Palace Fact", message: "Memory palaces have been used since ancient Rome. You're learning like the ancients!" },
  { type: "fact", title: "Did You Know?", message: "David picked 5 stones because Goliath had 4 brothers! (2 Samuel 21:22)" },
  { type: "fact", title: "Study Insight", message: "Jesus fed 5,000 with 12 baskets left (one per tribe). Every detail matters!" },
  { type: "fact", title: "Did You Know?", message: "The word 'Christ' appears 555 times in the KJV - He is the center!" },
  
  // Gems
  { type: "gem", title: "Powerful Gem", message: "The Passover lamb in Exodus 12 foreshadows Christ's crucifixion - same day, same purpose!", link: "/gems" },
  { type: "gem", title: "Check This Gem", message: "Babel divided languages; Pentecost united them. God reverses the curse!", link: "/gems" },
  { type: "gem", title: "Study Gem", message: "Jesus is both the Lion of Judah AND the Lamb - power and sacrifice united!", link: "/gems" },
  { type: "gem", title: "Palace Gem", message: "The Ark had three layers (wood, gold inside, gold outside) - humanity + divinity!", link: "/gems" },
  { type: "gem", title: "Today's Gem", message: "Noah's ark had ONE door - just as Christ is the ONE way to salvation!", link: "/gems" },
];

const NOTIFICATION_KEY = "phototheology_daily_notification";
const PREFERENCE_KEY = "phototheology_notification_preferences";

export interface NotificationPreferences {
  enabled: boolean;
  time: string; // HH:MM format
  types: string[]; // which types to include
}

const DEFAULT_PREFERENCES: NotificationPreferences = {
  enabled: true,
  time: "08:00",
  types: ["room", "game", "verse", "fact", "gem"],
};

export const useDailyNotifications = () => {
  const { user } = useAuth();
  const [preferences, setPreferences] = useState<NotificationPreferences>(DEFAULT_PREFERENCES);
  const [lastNotification, setLastNotification] = useState<string | null>(null);

  // Load preferences
  useEffect(() => {
    try {
      const stored = localStorage.getItem(PREFERENCE_KEY);
      if (stored) {
        setPreferences(JSON.parse(stored));
      }
    } catch (e) {
      console.error("Failed to load notification preferences:", e);
    }
  }, []);

  // Save preferences
  const updatePreferences = (newPrefs: Partial<NotificationPreferences>) => {
    const updated = { ...preferences, ...newPrefs };
    setPreferences(updated);
    localStorage.setItem(PREFERENCE_KEY, JSON.stringify(updated));
  };

  // Get today's content based on day of year
  const getTodayContent = (): DailyContent => {
    const dayOfYear = Math.floor(
      (Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000
    );
    
    // Filter by user preferences
    const filteredContent = DAILY_CONTENT.filter(c => 
      preferences.types.includes(c.type)
    );
    
    if (filteredContent.length === 0) return DAILY_CONTENT[0];
    
    return filteredContent[dayOfYear % filteredContent.length];
  };

  // Check and show notification
  const checkAndShowNotification = () => {
    if (!preferences.enabled) return;
    
    const today = new Date().toDateString();
    const lastShown = localStorage.getItem(NOTIFICATION_KEY);
    
    if (lastShown === today) return; // Already shown today
    
    const now = new Date();
    const [hours, minutes] = preferences.time.split(":").map(Number);
    const targetTime = new Date();
    targetTime.setHours(hours, minutes, 0, 0);
    
    // Check if it's time
    if (now >= targetTime) {
      const content = getTodayContent();
      showNotification(content);
      localStorage.setItem(NOTIFICATION_KEY, today);
      setLastNotification(today);
    }
  };

  // Show notification
  const showNotification = (content: DailyContent) => {
    // In-app toast
    toast(content.title, {
      description: content.message,
      duration: 8000,
      action: content.link ? {
        label: "Go",
        onClick: () => window.location.href = content.link!,
      } : undefined,
    });
    
    // Browser notification if permitted
    if ("Notification" in window && Notification.permission === "granted") {
      const notification = new Notification(content.title, {
        body: content.message,
        icon: "/favicon.ico",
        tag: "daily-notification",
      });
      
      if (content.link) {
        notification.onclick = () => {
          window.focus();
          window.location.href = content.link!;
        };
      }
    }
  };

  // Request notification permission
  const requestPermission = async () => {
    if ("Notification" in window) {
      const permission = await Notification.requestPermission();
      return permission === "granted";
    }
    return false;
  };

  // Check periodically
  useEffect(() => {
    checkAndShowNotification();
    
    const interval = setInterval(checkAndShowNotification, 60000); // Check every minute
    
    return () => clearInterval(interval);
  }, [preferences]);

  // Manual trigger for testing
  const triggerNow = () => {
    const content = getTodayContent();
    showNotification(content);
  };

  return {
    preferences,
    updatePreferences,
    requestPermission,
    triggerNow,
    getTodayContent,
    lastNotification,
  };
};
