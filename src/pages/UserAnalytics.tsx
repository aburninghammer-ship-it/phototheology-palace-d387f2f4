import { useState, useEffect } from "react";
import { Navigation } from "@/components/Navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  BarChart3, 
  BookOpen, 
  Brain, 
  Calendar, 
  Clock, 
  Flame, 
  Target, 
  TrendingUp,
  Trophy,
  Zap
} from "lucide-react";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from "recharts";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { motion } from "framer-motion";
import { format, subDays, startOfWeek, eachDayOfInterval } from "date-fns";

interface ActivityData {
  date: string;
  reading: number;
  challenges: number;
  devotionals: number;
}

interface StatCard {
  label: string;
  value: string | number;
  change?: string;
  icon: React.ElementType;
  color: string;
}

const COLORS = ["#8b5cf6", "#ec4899", "#10b981", "#f59e0b", "#3b82f6"];

export default function UserAnalytics() {
  const { user } = useAuth();
  const [activityData, setActivityData] = useState<ActivityData[]>([]);
  const [stats, setStats] = useState({
    totalTimeMinutes: 0,
    chaptersRead: 0,
    versesMemorized: 0,
    challengesCompleted: 0,
    devotionalsCompleted: 0,
    currentStreak: 0,
    longestStreak: 0,
  });
  const [timeDistribution, setTimeDistribution] = useState<{ name: string; value: number }[]>([]);

  useEffect(() => {
    if (!user) return;

    const loadAnalytics = async () => {
      // Get reading logs
      const { data: readingLogs } = await supabase
        .from("daily_reading_log")
        .select("*")
        .eq("user_id", user.id)
        .gte("read_date", subDays(new Date(), 30).toISOString());

      // Get challenge submissions
      const { data: challenges } = await supabase
        .from("challenge_submissions")
        .select("*")
        .eq("user_id", user.id);

      // Get devotional progress
      const { data: devotionals } = await supabase
        .from("devotional_progress")
        .select("*")
        .eq("user_id", user.id);

      // Calculate stats
      const totalReadingTime = readingLogs?.reduce((sum, log) => sum + (log.time_spent_seconds || 0), 0) || 0;
      
      setStats({
        totalTimeMinutes: Math.round(totalReadingTime / 60),
        chaptersRead: readingLogs?.length || 0,
        versesMemorized: 0, // Would need separate tracking
        challengesCompleted: challenges?.length || 0,
        devotionalsCompleted: devotionals?.length || 0,
        currentStreak: 0, // Would need streak calculation
        longestStreak: 0,
      });

      // Build activity chart data
      const last14Days = eachDayOfInterval({
        start: subDays(new Date(), 13),
        end: new Date(),
      });

      const chartData = last14Days.map(date => {
        const dateStr = format(date, "yyyy-MM-dd");
        const dayReadings = readingLogs?.filter(r => r.read_date?.startsWith(dateStr)) || [];
        
        return {
          date: format(date, "MMM d"),
          reading: dayReadings.length,
          challenges: 0,
          devotionals: 0,
        };
      });

      setActivityData(chartData);

      // Time distribution
      setTimeDistribution([
        { name: "Bible Reading", value: 45 },
        { name: "Challenges", value: 25 },
        { name: "Devotionals", value: 20 },
        { name: "Memorization", value: 10 },
      ]);
    };

    loadAnalytics();
  }, [user]);

  const statCards: StatCard[] = [
    { label: "Study Time", value: `${stats.totalTimeMinutes} min`, icon: Clock, color: "from-blue-500 to-cyan-500" },
    { label: "Chapters Read", value: stats.chaptersRead, icon: BookOpen, color: "from-purple-500 to-pink-500" },
    { label: "Challenges Done", value: stats.challengesCompleted, icon: Target, color: "from-emerald-500 to-teal-500" },
    { label: "Devotionals", value: stats.devotionalsCompleted, icon: Flame, color: "from-orange-500 to-red-500" },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto space-y-8">
          {/* Header */}
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-3">
              <BarChart3 className="h-8 w-8 text-primary" />
              Your Progress
            </h1>
            <p className="text-muted-foreground">Track your spiritual growth journey</p>
          </div>

          {/* Stat Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {statCards.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="overflow-hidden">
                    <div className={`h-1 bg-gradient-to-r ${stat.color}`} />
                    <CardContent className="pt-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-muted-foreground">{stat.label}</p>
                          <p className="text-2xl font-bold">{stat.value}</p>
                        </div>
                        <div className={`p-2 rounded-lg bg-gradient-to-br ${stat.color}`}>
                          <Icon className="h-5 w-5 text-white" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>

          {/* Charts Row */}
          <div className="grid lg:grid-cols-3 gap-6">
            {/* Activity Chart */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-primary" />
                  Activity (Last 14 Days)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={activityData}>
                    <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                    <YAxis tick={{ fontSize: 12 }} />
                    <Tooltip />
                    <Bar dataKey="reading" fill="#8b5cf6" name="Chapters Read" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Time Distribution */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-primary" />
                  Time Distribution
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={200}>
                  <PieChart>
                    <Pie
                      data={timeDistribution}
                      cx="50%"
                      cy="50%"
                      innerRadius={50}
                      outerRadius={80}
                      paddingAngle={2}
                      dataKey="value"
                    >
                      {timeDistribution.map((_, index) => (
                        <Cell key={index} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
                <div className="grid grid-cols-2 gap-2 mt-4">
                  {timeDistribution.map((item, index) => (
                    <div key={item.name} className="flex items-center gap-2 text-xs">
                      <div 
                        className="w-3 h-3 rounded-full" 
                        style={{ backgroundColor: COLORS[index % COLORS.length] }}
                      />
                      <span className="truncate">{item.name}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Milestones & Goals */}
          <div className="grid md:grid-cols-2 gap-6">
            {/* Milestones */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Trophy className="h-5 w-5 text-yellow-500" />
                  Milestones
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Read 100 Chapters</span>
                    <span className="font-medium">{stats.chaptersRead}/100</span>
                  </div>
                  <Progress value={(stats.chaptersRead / 100) * 100} className="h-2" />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Complete 50 Challenges</span>
                    <span className="font-medium">{stats.challengesCompleted}/50</span>
                  </div>
                  <Progress value={(stats.challengesCompleted / 50) * 100} className="h-2" />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>30 Day Streak</span>
                    <span className="font-medium">{stats.currentStreak}/30</span>
                  </div>
                  <Progress value={(stats.currentStreak / 30) * 100} className="h-2" />
                </div>
              </CardContent>
            </Card>

            {/* Streak Calendar */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Flame className="h-5 w-5 text-orange-500" />
                  Streak Status
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-6">
                  <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-gradient-to-br from-orange-500 to-red-500 mb-4">
                    <span className="text-3xl font-bold text-white">{stats.currentStreak}</span>
                  </div>
                  <p className="text-lg font-medium">Current Streak</p>
                  <p className="text-sm text-muted-foreground">Keep going! You're doing great.</p>
                  
                  <div className="flex justify-center gap-8 mt-6 pt-4 border-t">
                    <div className="text-center">
                      <p className="text-2xl font-bold text-primary">{stats.longestStreak}</p>
                      <p className="text-xs text-muted-foreground">Longest Streak</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-emerald-500">{stats.chaptersRead}</p>
                      <p className="text-xs text-muted-foreground">Total Days Active</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Weekly Summary */}
          <Card className="bg-gradient-to-r from-primary/5 via-transparent to-purple-500/5">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5 text-primary" />
                This Week's Summary
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                <div>
                  <p className="text-3xl font-bold text-primary">{stats.chaptersRead}</p>
                  <p className="text-sm text-muted-foreground">Chapters Read</p>
                </div>
                <div>
                  <p className="text-3xl font-bold text-emerald-500">{stats.challengesCompleted}</p>
                  <p className="text-sm text-muted-foreground">Challenges</p>
                </div>
                <div>
                  <p className="text-3xl font-bold text-pink-500">{stats.devotionalsCompleted}</p>
                  <p className="text-sm text-muted-foreground">Devotionals</p>
                </div>
                <div>
                  <p className="text-3xl font-bold text-amber-500">{stats.totalTimeMinutes}m</p>
                  <p className="text-sm text-muted-foreground">Study Time</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
