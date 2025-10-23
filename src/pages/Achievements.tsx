import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Navigation } from "@/components/Navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Award, Lock } from "lucide-react";

const Achievements = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [achievements, setAchievements] = useState<any[]>([]);
  const [userAchievements, setUserAchievements] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (!loading && !user) {
      navigate("/auth");
    }
  }, [user, loading, navigate]);

  useEffect(() => {
    if (user) {
      fetchAchievements();
      fetchUserAchievements();
    }
  }, [user]);

  const fetchAchievements = async () => {
    const { data } = await supabase
      .from("achievements")
      .select("*")
      .order("points", { ascending: false });
    
    setAchievements(data || []);
  };

  const fetchUserAchievements = async () => {
    const { data } = await supabase
      .from("user_achievements")
      .select("achievement_id")
      .eq("user_id", user!.id);
    
    setUserAchievements(new Set(data?.map(a => a.achievement_id) || []));
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto space-y-8">
          <h1 className="text-4xl font-bold flex items-center gap-2">
            <Award className="h-8 w-8 text-purple-500" />
            Achievements
          </h1>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {achievements.map((achievement) => {
              const isUnlocked = userAchievements.has(achievement.id);
              return (
                <Card
                  key={achievement.id}
                  className={isUnlocked ? "border-primary" : "opacity-50"}
                >
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span>{achievement.name}</span>
                      {isUnlocked ? (
                        <Award className="h-5 w-5 text-yellow-500" />
                      ) : (
                        <Lock className="h-5 w-5" />
                      )}
                    </CardTitle>
                    <CardDescription>{achievement.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      {achievement.points} points
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {achievements.length === 0 && (
            <div className="text-center py-12 text-muted-foreground">
              No achievements available yet. Check back soon!
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Achievements;
