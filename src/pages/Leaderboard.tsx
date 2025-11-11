import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Navigation } from "@/components/Navigation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Trophy, Medal, Award, Target, Building2, Flame, Calendar, Crown, Star } from "lucide-react";

const Leaderboard = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [leaders, setLeaders] = useState<any[]>([]);
  const [userRank, setUserRank] = useState<number>(0);
  const [userStats, setUserStats] = useState({ points: 0, challenges: 0, achievements: 0, rooms: 0, streak: 0 });
  const [sortBy, setSortBy] = useState<'points' | 'challenges' | 'studies' | 'rooms'>('points');
  const [timePeriod, setTimePeriod] = useState<'all' | 'monthly' | 'weekly'>('all');
  const [leaderAchievements, setLeaderAchievements] = useState<Record<string, any[]>>({});

  useEffect(() => {
    if (user) {
      fetchLeaders();
      fetchUserStats();
    }
  }, [user, sortBy, timePeriod]);

  const fetchUserStats = async () => {
    // Get user profile data
    const { data: profile } = await supabase
      .from("profiles")
      .select("points, daily_study_streak")
      .eq("id", user!.id)
      .single();

    // Get challenges completed
    const { data: challenges } = await supabase
      .from("challenge_submissions")
      .select("id")
      .eq("user_id", user!.id);

    // Get achievements earned
    const { data: achievements } = await supabase
      .from("user_achievements")
      .select("id")
      .eq("user_id", user!.id);

    // Get rooms completed
    const { data: rooms } = await supabase
      .from("room_progress")
      .select("id")
      .eq("user_id", user!.id)
      .not("completed_at", "is", null);

    setUserStats({
      points: profile?.points || 0,
      challenges: challenges?.length || 0,
      achievements: achievements?.length || 0,
      rooms: rooms?.length || 0,
      streak: profile?.daily_study_streak || 0,
    });

    // Calculate user rank based on current sort and time period
    const { data: allProfiles } = await supabase
      .from("profiles")
      .select("id, points")
      .order("points", { ascending: false });

    const rank = allProfiles?.findIndex(p => p.id === user!.id) ?? -1;
    setUserRank(rank + 1);
  };

  const fetchLeaders = async () => {
    let query = supabase.from("profiles");
    let leaderData: any[] = [];

    // Apply time period filter
    let dateFilter: Date | null = null;
    if (timePeriod === 'weekly') {
      dateFilter = new Date();
      dateFilter.setDate(dateFilter.getDate() - 7);
    } else if (timePeriod === 'monthly') {
      dateFilter = new Date();
      dateFilter.setMonth(dateFilter.getMonth() - 1);
    }

    if (sortBy === 'points') {
      const { data } = await supabase
        .from("profiles")
        .select("id, username, display_name, points, level, daily_study_streak")
        .order("points", { ascending: false })
        .limit(50);
      
      leaderData = data || [];
    } else if (sortBy === 'challenges') {
      const { data: profiles } = await supabase
        .from("profiles")
        .select("id, username, display_name, points, level, daily_study_streak");

      if (profiles) {
        const leadersWithChallenges = await Promise.all(
          profiles.map(async (profile) => {
            let submissionsQuery = supabase
              .from("challenge_submissions")
              .select("id")
              .eq("user_id", profile.id);
            
            if (dateFilter) {
              submissionsQuery = submissionsQuery.gte("created_at", dateFilter.toISOString());
            }
            
            const { data: submissions } = await submissionsQuery;
            
            return {
              ...profile,
              challengeCount: submissions?.length || 0
            };
          })
        );

        leaderData = leadersWithChallenges
          .sort((a, b) => b.challengeCount - a.challengeCount)
          .slice(0, 50);
      }
    } else if (sortBy === 'studies') {
      const { data } = await supabase
        .from("profiles")
        .select("id, username, display_name, points, level, daily_study_streak")
        .order("daily_study_streak", { ascending: false })
        .limit(50);
      
      leaderData = data || [];
    } else if (sortBy === 'rooms') {
      const { data: profiles } = await supabase
        .from("profiles")
        .select("id, username, display_name, points, level, daily_study_streak");

      if (profiles) {
        const leadersWithRooms = await Promise.all(
          profiles.map(async (profile) => {
            let roomsQuery = supabase
              .from("room_progress")
              .select("id")
              .eq("user_id", profile.id)
              .not("completed_at", "is", null);
            
            if (dateFilter) {
              roomsQuery = roomsQuery.gte("completed_at", dateFilter.toISOString());
            }
            
            const { data: rooms } = await roomsQuery;
            
            return {
              ...profile,
              roomsCount: rooms?.length || 0
            };
          })
        );

        leaderData = leadersWithRooms
          .sort((a, b) => b.roomsCount - a.roomsCount)
          .slice(0, 50);
      }
    }

    setLeaders(leaderData);

    // Fetch achievements for top 10 leaders
    const top10 = leaderData.slice(0, 10);
    const achievementsMap: Record<string, any[]> = {};
    
    await Promise.all(
      top10.map(async (leader) => {
        const { data } = await supabase
          .from("user_achievements")
          .select("achievement_id, achievements(name, icon, points)")
          .eq("user_id", leader.id)
          .order("unlocked_at", { ascending: false })
          .limit(3);
        
        achievementsMap[leader.id] = data?.map(ua => ua.achievements).filter(Boolean) || [];
      })
    );
    
    setLeaderAchievements(achievementsMap);
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
      
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-purple-600 via-purple-700 to-indigo-700 text-white py-12 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="flex items-center gap-4 mb-6">
            <Trophy className="h-16 w-16" />
            <div>
              <h1 className="text-5xl font-bold">Leaderboard</h1>
              <p className="text-purple-200 text-lg">Top Phototheology scholars</p>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mt-8">
            <Card className="bg-white/10 backdrop-blur border-white/20">
              <CardHeader className="pb-3">
                <CardTitle className="text-white/90 text-sm font-normal flex items-center gap-2">
                  <Crown className="h-4 w-4" />
                  Your Rank
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-4xl font-bold text-white">#{userRank || '-'}</p>
              </CardContent>
            </Card>

            <Card className="bg-white/10 backdrop-blur border-white/20">
              <CardHeader className="pb-3">
                <CardTitle className="text-white/90 text-sm font-normal flex items-center gap-2">
                  <Award className="h-4 w-4" />
                  Points
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-4xl font-bold text-white">{userStats.points}</p>
              </CardContent>
            </Card>

            <Card className="bg-white/10 backdrop-blur border-white/20">
              <CardHeader className="pb-3">
                <CardTitle className="text-white/90 text-sm font-normal flex items-center gap-2">
                  <Building2 className="h-4 w-4" />
                  Rooms
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-4xl font-bold text-white">{userStats.rooms}</p>
              </CardContent>
            </Card>

            <Card className="bg-white/10 backdrop-blur border-white/20">
              <CardHeader className="pb-3">
                <CardTitle className="text-white/90 text-sm font-normal flex items-center gap-2">
                  <Flame className="h-4 w-4" />
                  Streak
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-4xl font-bold text-white">{userStats.streak}</p>
              </CardContent>
            </Card>

            <Card className="bg-white/10 backdrop-blur border-white/20">
              <CardHeader className="pb-3">
                <CardTitle className="text-white/90 text-sm font-normal flex items-center gap-2">
                  <Trophy className="h-4 w-4" />
                  Badges
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-4xl font-bold text-white">{userStats.achievements}</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <main className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="space-y-6">
          {/* Time Period and Metric Filters */}
          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Time Period
                </CardTitle>
                <CardDescription>Filter leaderboard by time range</CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs value={timePeriod} onValueChange={(v) => setTimePeriod(v as any)}>
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="weekly">Weekly</TabsTrigger>
                    <TabsTrigger value="monthly">Monthly</TabsTrigger>
                    <TabsTrigger value="all">All Time</TabsTrigger>
                  </TabsList>
                </Tabs>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5" />
                  Sort By Metric
                </CardTitle>
                <CardDescription>Choose ranking criteria</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-2">
                  <Button
                    variant={sortBy === 'points' ? 'default' : 'outline'}
                    onClick={() => setSortBy('points')}
                    className="flex items-center gap-2 justify-start"
                  >
                    <Award className="h-4 w-4" />
                    Points
                  </Button>
                  <Button
                    variant={sortBy === 'rooms' ? 'default' : 'outline'}
                    onClick={() => setSortBy('rooms')}
                    className="flex items-center gap-2 justify-start"
                  >
                    <Building2 className="h-4 w-4" />
                    Rooms
                  </Button>
                  <Button
                    variant={sortBy === 'studies' ? 'default' : 'outline'}
                    onClick={() => setSortBy('studies')}
                    className="flex items-center gap-2 justify-start"
                  >
                    <Flame className="h-4 w-4" />
                    Streak
                  </Button>
                  <Button
                    variant={sortBy === 'challenges' ? 'default' : 'outline'}
                    onClick={() => setSortBy('challenges')}
                    className="flex items-center gap-2 justify-start"
                  >
                    <Target className="h-4 w-4" />
                    Challenges
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Trophy className="h-5 w-5" />
                Top Achievers
              </CardTitle>
              <CardDescription>
                {timePeriod === 'weekly' ? 'This Week' : timePeriod === 'monthly' ? 'This Month' : 'All Time'} • 
                Sorted by {sortBy === 'points' ? 'Points' : sortBy === 'rooms' ? 'Rooms Completed' : sortBy === 'studies' ? 'Study Streak' : 'Challenges'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {leaders.map((leader, index) => {
                  const isCurrentUser = leader.id === user?.id;
                  const achievements = leaderAchievements[leader.id] || [];
                  const isTop3 = index < 3;
                  
                  return (
                    <div
                      key={leader.id}
                      className={`group relative overflow-hidden rounded-xl transition-all hover:scale-[1.02] ${
                        isCurrentUser 
                          ? 'bg-gradient-to-r from-yellow-100 to-amber-100 dark:from-yellow-900/30 dark:to-amber-900/30 border-2 border-yellow-400 shadow-lg'
                          : isTop3
                          ? 'bg-gradient-to-r from-purple-50 to-indigo-50 dark:from-purple-900/20 dark:to-indigo-900/20 border border-purple-200 dark:border-purple-800'
                          : 'bg-accent/50 hover:bg-accent border border-border'
                      }`}
                    >
                      {/* Rank badge */}
                      <div className="absolute top-2 right-2">
                        {isTop3 ? (
                          <div className="p-2 rounded-full bg-gradient-to-br from-yellow-400 to-yellow-600 shadow-lg">
                            {getRankIcon(index)}
                          </div>
                        ) : (
                          <Badge variant="secondary" className="text-lg font-bold">
                            #{index + 1}
                          </Badge>
                        )}
                      </div>

                      <div className="p-4">
                        <div className="flex items-start gap-4 mb-3">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <p className="font-bold text-lg truncate">
                                {leader.display_name || leader.username}
                              </p>
                              {isCurrentUser && (
                                <Badge className="bg-purple-600 hover:bg-purple-700">You</Badge>
                              )}
                            </div>
                            <div className="flex items-center gap-3 text-sm text-muted-foreground flex-wrap">
                              <span className="flex items-center gap-1">
                                <Award className="h-3.5 w-3.5" />
                                Level {leader.level}
                              </span>
                              <span className="flex items-center gap-1">
                                <Flame className="h-3.5 w-3.5" />
                                {leader.daily_study_streak || 0} day streak
                              </span>
                            </div>
                          </div>

                          <div className="text-right">
                            {sortBy === 'points' && (
                              <>
                                <p className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
                                  {leader.points}
                                </p>
                                <p className="text-xs text-muted-foreground">points</p>
                              </>
                            )}
                            {sortBy === 'challenges' && (
                              <>
                                <p className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
                                  {leader.challengeCount || 0}
                                </p>
                                <p className="text-xs text-muted-foreground">challenges</p>
                              </>
                            )}
                            {sortBy === 'studies' && (
                              <>
                                <p className="text-3xl font-bold bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent">
                                  {leader.daily_study_streak || 0}
                                </p>
                                <p className="text-xs text-muted-foreground">day streak</p>
                              </>
                            )}
                            {sortBy === 'rooms' && (
                              <>
                                <p className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                                  {leader.roomsCount || 0}
                                </p>
                                <p className="text-xs text-muted-foreground">rooms</p>
                              </>
                            )}
                          </div>
                        </div>

                        {/* Achievements badges - only show for top 10 */}
                        {index < 10 && achievements.length > 0 && (
                          <div className="flex items-center gap-2 pt-3 border-t border-border/50">
                            <Star className="h-4 w-4 text-yellow-500" />
                            <div className="flex gap-2 flex-wrap">
                              {achievements.map((achievement: any, i: number) => (
                                <Badge 
                                  key={i}
                                  variant="secondary" 
                                  className="text-xs bg-gradient-to-r from-yellow-100 to-amber-100 dark:from-yellow-900/30 dark:to-amber-900/30 border border-yellow-400/30"
                                >
                                  {achievement.icon} {achievement.name}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default Leaderboard;
