import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { SabbathRhythmStrip } from "./SabbathRhythmStrip";
import { ActivityPulse } from "./ActivityPulse";
import { AlwaysOnStudy } from "./AlwaysOnStudy";
import { FeaturedSermon } from "./FeaturedSermon";
import { PrayerEntry } from "./PrayerEntry";
import { 
  Users, BookOpen, Video, Calendar, ArrowRight, 
  Flame, Heart, Star, Clock, CheckCircle2
} from "lucide-react";

interface MemberHomeProps {
  churchId: string;
}

interface QuickStats {
  activeGroups: number;
  currentStudy: string | null;
  upcomingEvent: string | null;
  weeklyProgress: number;
}

export function MemberHome({ churchId }: MemberHomeProps) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState<QuickStats>({
    activeGroups: 0,
    currentStudy: null,
    upcomingEvent: null,
    weeklyProgress: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadHomeData();
  }, [churchId, user]);

  const loadHomeData = async () => {
    if (!user) return;
    
    try {
      // Load user's small groups - using any due to new table
      const { data: groups } = await (supabase
        .from('small_groups' as any)
        .select('id')
        .eq('church_id', churchId)
        .eq('is_active', true) as any);

      // Load active study - using any due to new table
      const { data: studies } = await (supabase
        .from('church_central_studies' as any)
        .select('title')
        .eq('church_id', churchId)
        .eq('status', 'active')
        .order('week_start', { ascending: false })
        .limit(1) as any);

      setStats({
        activeGroups: groups?.length || 0,
        currentStudy: studies?.[0]?.title || "No active study",
        upcomingEvent: "Sabbath Service - This Week",
        weeklyProgress: 65
      });
    } catch (error) {
      console.error('Error loading home data:', error);
    } finally {
      setLoading(false);
    }
  };

  const quickActions = [
    {
      title: "Join a Small Group",
      description: "Connect with a House Fire community",
      icon: Users,
      action: () => navigate('/living-manna?tab=small-groups'),
      color: "bg-blue-500/10 text-blue-500 border-blue-500/20"
    },
    {
      title: "This Week's Study",
      description: stats.currentStudy || "View the central study",
      icon: BookOpen,
      action: () => navigate('/living-manna?tab=studies'),
      color: "bg-purple-500/10 text-purple-500 border-purple-500/20"
    },
    {
      title: "Watch Sermons",
      description: "Living Manna YouTube Channel",
      icon: Video,
      action: () => navigate('/living-manna?tab=sermons'),
      color: "bg-red-500/10 text-red-500 border-red-500/20"
    },
    {
      title: "Explore Phototheology",
      description: "Deep dive into Bible study tools",
      icon: Star,
      action: () => navigate('/dashboard'),
      color: "bg-amber-500/10 text-amber-500 border-amber-500/20"
    }
  ];

  const discipleshipPaths = [
    {
      name: "Seeker to Disciple",
      description: "12-week journey from curious to committed",
      weeks: 12,
      icon: Heart
    },
    {
      name: "Disciples Who Make Disciples",
      description: "Learn to lead and multiply",
      weeks: 12,
      icon: Users
    },
    {
      name: "Prophetic Identity & Mission",
      description: "Understanding your calling in end-time context",
      weeks: 12,
      icon: Flame
    }
  ];

  return (
    <div className="space-y-6">
      {/* Sabbath Rhythm Strip */}
      <SabbathRhythmStrip />
      
      {/* Activity Pulse - Real data signs of life */}
      <ActivityPulse churchId={churchId} />

      {/* Featured Sermon - One video, featured prominently */}
      <FeaturedSermon churchId={churchId} />
      
      {/* Prayer Entry - Pray With Living Manna */}
      <PrayerEntry churchId={churchId} />
      
      {/* Welcome Section */}
      <Card variant="glass">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Flame className="h-6 w-6 text-primary" />
            <CardTitle>Welcome Home</CardTitle>
          </div>
          <CardDescription>
            Living Manna is your discipleship home — where we study, fellowship, and grow together in Christ.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4">
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="bg-primary/10">
                <Clock className="h-3 w-3 mr-1" />
                Weekly Progress
              </Badge>
              <Progress value={stats.weeklyProgress} className="w-24" />
              <span className="text-sm text-muted-foreground">{stats.weeklyProgress}%</span>
            </div>
            <Badge variant="outline" className="bg-green-500/10 text-green-600">
              <CheckCircle2 className="h-3 w-3 mr-1" />
              {stats.activeGroups} Active Group{stats.activeGroups !== 1 ? 's' : ''}
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {quickActions.map((action, index) => (
          <Card 
            key={index} 
            variant="glass"
            className="cursor-pointer hover:border-primary/50 transition-colors"
            onClick={action.action}
          >
            <CardContent className="pt-6">
              <div className={`w-12 h-12 rounded-lg flex items-center justify-center mb-4 ${action.color}`}>
                <action.icon className="h-6 w-6" />
              </div>
              <h3 className="font-semibold mb-1">{action.title}</h3>
              <p className="text-sm text-muted-foreground">{action.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Current Study Highlight */}
      <Card variant="glass" className="border-primary/30">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-primary" />
              <CardTitle className="text-lg">This Week's Central Study</CardTitle>
            </div>
            <Badge>Active</Badge>
          </div>
        </CardHeader>
        <CardContent>
          <h3 className="text-xl font-semibold mb-2">{stats.currentStudy}</h3>
          <p className="text-muted-foreground mb-4">
            All small groups are studying this together. Join a group to discuss and grow!
          </p>
          <div className="flex gap-3">
            <Button onClick={() => navigate('/living-manna?tab=studies')}>
              View Study
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
            <Button variant="outline" onClick={() => navigate('/living-manna?tab=small-groups')}>
              Find a Group
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Always-On Study Fallback - Shows when no active study */}
      <AlwaysOnStudy activeStudyTitle={stats.currentStudy} />

      {/* 12-Week Discipleship Paths */}
      <div>
        <h2 className="text-xl font-semibold mb-4">12-Week Discipleship Paths</h2>
        <div className="grid gap-4 md:grid-cols-3">
          {discipleshipPaths.map((path, index) => (
            <Card key={index} variant="glass" className="hover:border-primary/30 transition-colors">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <path.icon className="h-5 w-5 text-primary" />
                  <CardTitle className="text-base">{path.name}</CardTitle>
                </div>
                <CardDescription>{path.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <Badge variant="outline">{path.weeks} Weeks</Badge>
                  <Button variant="ghost" size="sm">
                    Learn More
                    <ArrowRight className="h-4 w-4 ml-1" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* App Features Access */}
      <Card variant="glass">
        <CardHeader>
          <CardTitle className="text-lg">Explore Phototheology Tools</CardTitle>
          <CardDescription>
            As a Living Manna member, you have full access to these Bible study tools
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">
            {[
              { name: "Bible Reader", path: "/bible", icon: "📖" },
              { name: "Memory Palace", path: "/memory", icon: "🏛️" },
              { name: "Jeeves AI", path: "/jeeves", icon: "🎩" },
              { name: "Challenges", path: "/challenge", icon: "🎯" },
              { name: "Devotionals", path: "/devotionals", icon: "🕯️" },
              { name: "Studies", path: "/studies", icon: "📚" },
              { name: "Community", path: "/community", icon: "👥" },
              { name: "Games", path: "/games", icon: "🎮" },
            ].map((tool, index) => (
              <Button 
                key={index}
                variant="outline" 
                className="justify-start"
                onClick={() => navigate(tool.path)}
              >
                <span className="mr-2">{tool.icon}</span>
                {tool.name}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
