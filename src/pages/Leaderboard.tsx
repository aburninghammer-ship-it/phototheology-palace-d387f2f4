import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Navigation } from "@/components/Navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Trophy, Medal, Award } from "lucide-react";

const Leaderboard = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [leaders, setLeaders] = useState<any[]>([]);

  useEffect(() => {
    if (user) {
      fetchLeaders();
    }
  }, [user]);

  const fetchLeaders = async () => {
    const { data } = await supabase
      .from("profiles")
      .select("username, display_name, points, level")
      .order("points", { ascending: false })
      .limit(50);
    
    setLeaders(data || []);
  };

  if (!user) return null;

  const getRankIcon = (index: number) => {
    if (index === 0) return <Trophy className="h-6 w-6 text-yellow-500" />;
    if (index === 1) return <Medal className="h-6 w-6 text-gray-400" />;
    if (index === 2) return <Award className="h-6 w-6 text-orange-600" />;
    return null;
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-6">
          <h1 className="text-4xl font-bold flex items-center gap-2">
            <Trophy className="h-8 w-8 text-yellow-500" />
            Leaderboard
          </h1>

          <Card>
            <CardHeader>
              <CardTitle>Top Players</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {leaders.map((leader, index) => (
                  <div
                    key={leader.username}
                    className="flex items-center justify-between p-4 rounded-lg bg-accent/50"
                  >
                    <div className="flex items-center gap-4">
                      <span className="text-2xl font-bold w-8 text-center">
                        {getRankIcon(index) || `#${index + 1}`}
                      </span>
                      <div>
                        <p className="font-semibold">
                          {leader.display_name || leader.username}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Level {leader.level}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold">{leader.points}</p>
                      <p className="text-sm text-muted-foreground">points</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default Leaderboard;
