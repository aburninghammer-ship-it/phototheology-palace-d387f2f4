import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Users, Target } from "lucide-react";
import Confetti from "react-confetti";
import { useWindowSize } from "react-use";

function getGoalMessage(count: number): string | null {
  if (count < 100) return "Help us reach 100!";
  if (count < 500) return "Help us reach 500!";
  if (count < 1000) return "Help us reach 1,000!";
  if (count < 5000) return "Help us reach 5,000!";
  if (count < 10000) return "Help us reach 10,000!";
  return null;
}

export function UserCountBadge() {
  const [userCount, setUserCount] = useState<number | null>(null);
  const [showConfetti, setShowConfetti] = useState(false);
  const { width, height } = useWindowSize();

  useEffect(() => {
    const fetchUserCount = async () => {
      const { data, error } = await supabase.rpc("get_active_user_count");
      
      if (error) {
        console.error("Error fetching user count:", error);
        setUserCount(0);
        return;
      }
      
      setUserCount(data || 0);
    };

    fetchUserCount();

    // Subscribe to real-time INSERT events on profiles table
    const channel = supabase
      .channel('user-count-updates')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'profiles'
        },
        (payload) => {
          console.log('New user signed up:', payload);
          // Trigger confetti celebration for any new signup
          setShowConfetti(true);
          setTimeout(() => setShowConfetti(false), 5000);
          // Refresh the count from the database to get accurate number
          supabase.rpc("get_active_user_count").then(({ data }) => {
            if (data !== null) setUserCount(data);
          });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  if (userCount === null) return null;

  const goalMessage = getGoalMessage(userCount);

  return (
    <>
      {showConfetti && (
        <Confetti
          width={width}
          height={height}
          recycle={false}
          numberOfPieces={200}
          gravity={0.3}
        />
      )}
      <div className="inline-flex flex-col items-center gap-2">
        <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-gradient-to-r from-primary/20 to-accent/20 border-2 border-primary/40 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300 animate-in fade-in slide-in-from-bottom-4">
          <div className="relative">
            <Users className="w-6 h-6 text-primary" />
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full animate-pulse" />
          </div>
          <div className="flex flex-col items-start">
            <span className="text-2xl font-bold text-primary tabular-nums">
              {userCount.toLocaleString()}
            </span>
            <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
              Users & Counting
            </span>
          </div>
        </div>
        {goalMessage && (
          <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
            <Target className="w-4 h-4 text-accent" />
            <span>{goalMessage}</span>
          </div>
        )}
      </div>
    </>
  );
}
