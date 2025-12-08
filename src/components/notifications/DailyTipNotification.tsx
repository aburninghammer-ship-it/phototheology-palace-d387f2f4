import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { 
  Lightbulb, 
  Gamepad2, 
  DoorOpen, 
  BookOpen, 
  Sparkles,
  ExternalLink
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface DailyTip {
  type: "room" | "game" | "verse" | "didYouKnow" | "gem";
  title: string;
  message: string;
  action?: string;
  link?: string;
  icon: React.ReactNode;
}

const DAILY_TIPS: DailyTip[] = [
  // Room suggestions
  { type: "room", title: "Try This Room!", message: "The Story Room (SR) helps you recall Bible narratives as vivid mental movies.", action: "Explore", link: "/palace?floor=1", icon: <DoorOpen className="h-5 w-5" /> },
  { type: "room", title: "Room Spotlight", message: "The Observation Room teaches detective-level text analysis. Notice what others miss!", action: "Try It", link: "/palace?floor=2", icon: <DoorOpen className="h-5 w-5" /> },
  { type: "room", title: "Discover a Room", message: "The Fire Room (Floor 7) brings emotional weight to Scripture study.", action: "Enter", link: "/palace?floor=7", icon: <DoorOpen className="h-5 w-5" /> },
  { type: "room", title: "New Room Alert", message: "The Concentration Room keeps Christ at the center of every text.", action: "Visit", link: "/palace?floor=4", icon: <DoorOpen className="h-5 w-5" /> },
  
  // Game suggestions  
  { type: "game", title: "Try This Game!", message: "Genesis HighRise — Build the Genesis tower chapter by chapter!", action: "Play", link: "/games", icon: <Gamepad2 className="h-5 w-5" /> },
  { type: "game", title: "Game of the Day", message: "Verse Detective challenges you to find hidden details in Scripture.", action: "Play Now", link: "/games", icon: <Gamepad2 className="h-5 w-5" /> },
  { type: "game", title: "Challenge Yourself", message: "Symbol Safari — Hunt for biblical symbols across the pages!", action: "Start", link: "/games", icon: <Gamepad2 className="h-5 w-5" /> },
  
  // Verses
  { type: "verse", title: "Verse of the Day", message: '"Thy word is a lamp unto my feet, and a light unto my path." — Psalm 119:105', action: "Study It", link: "/bible/Psalms/119", icon: <BookOpen className="h-5 w-5" /> },
  { type: "verse", title: "Today's Scripture", message: '"I am the vine, ye are the branches." — John 15:5', action: "Read More", link: "/bible/John/15", icon: <BookOpen className="h-5 w-5" /> },
  { type: "verse", title: "Daily Bread", message: '"For God so loved the world..." — John 3:16. The gospel in one verse.', action: "Explore", link: "/bible/John/3", icon: <BookOpen className="h-5 w-5" /> },
  
  // Did you know
  { type: "didYouKnow", title: "Did You Know?", message: "David picked 5 stones because Goliath had 4 brothers! (2 Sam 21:22)", action: "Learn More", link: "/encyclopedia", icon: <Lightbulb className="h-5 w-5" /> },
  { type: "didYouKnow", title: "Fun Fact", message: "Jesus fed 5,000 with 12 baskets leftover — one for each tribe of Israel!", action: "Discover", link: "/encyclopedia", icon: <Lightbulb className="h-5 w-5" /> },
  { type: "didYouKnow", title: "Bible Insight", message: "The word 'fear' appears 365 times in the Bible — one for each day!", action: "Explore", link: "/encyclopedia", icon: <Lightbulb className="h-5 w-5" /> },
  
  // Gems
  { type: "gem", title: "Powerful Gem", message: "The Passover lamb points directly to Christ's crucifixion — same day, same hour.", action: "See Gem", link: "/gems", icon: <Sparkles className="h-5 w-5" /> },
  { type: "gem", title: "Hidden Treasure", message: "Babel scattered languages; Pentecost reunited them through the Spirit!", action: "View Gem", link: "/gems", icon: <Sparkles className="h-5 w-5" /> },
  { type: "gem", title: "Today's Gem", message: "Christ is the true Ark — salvation through Him alone, one door, one refuge.", action: "Discover", link: "/gems", icon: <Sparkles className="h-5 w-5" /> },
];

const STORAGE_KEY = "phototheology_last_daily_tip";
const SHOWN_TODAY_KEY = "phototheology_tip_shown_today";

export const useDailyTipNotification = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [hasShownToday, setHasShownToday] = useState(false);

  useEffect(() => {
    if (!user) return;

    // Check if we've already shown a tip today
    const today = new Date().toDateString();
    const shownDate = localStorage.getItem(SHOWN_TODAY_KEY);
    
    if (shownDate === today) {
      setHasShownToday(true);
      return;
    }

    // Show tip after a short delay (let the page load first)
    const timeout = setTimeout(() => {
      showDailyTip();
    }, 3000);

    return () => clearTimeout(timeout);
  }, [user]);

  const showDailyTip = () => {
    // Get a random tip based on the day
    const dayIndex = new Date().getDate() % DAILY_TIPS.length;
    const tip = DAILY_TIPS[dayIndex];

    // Save that we showed a tip today
    localStorage.setItem(SHOWN_TODAY_KEY, new Date().toDateString());
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ tip, date: new Date().toISOString() }));
    setHasShownToday(true);

    // Show the toast notification
    toast(tip.title, {
      description: tip.message,
      icon: tip.icon,
      duration: 8000,
      action: tip.action && tip.link ? {
        label: tip.action,
        onClick: () => navigate(tip.link!),
      } : undefined,
    });
  };

  const triggerDailyTip = () => {
    // Force show a tip (for testing or manual trigger)
    const randomIndex = Math.floor(Math.random() * DAILY_TIPS.length);
    const tip = DAILY_TIPS[randomIndex];

    toast(tip.title, {
      description: tip.message,
      icon: tip.icon,
      duration: 8000,
      action: tip.action && tip.link ? {
        label: tip.action,
        onClick: () => navigate(tip.link!),
      } : undefined,
    });
  };

  return { hasShownToday, triggerDailyTip };
};

// Provider component to include in app layout
export const DailyTipNotificationProvider = () => {
  useDailyTipNotification();
  return null;
};
