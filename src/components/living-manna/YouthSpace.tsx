import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import { 
  Loader2, Users, BookOpen, Calendar, Star, 
  Sparkles, Clock, MapPin, Video, CheckCircle2,
  Trophy, Flame, Heart
} from "lucide-react";

interface YouthGroup {
  id: string;
  name: string;
  description: string | null;
  age_band: string;
  meeting_day: string | null;
  meeting_time: string | null;
  meeting_location: string | null;
  meeting_link: string | null;
  is_online: boolean | null;
  status: string;
  current_week: number | null;
}

interface YouthMembership {
  id: string;
  group_id: string;
  member_pathway: string;
  joined_at: string;
  is_active: boolean | null;
}

interface YouthLeader {
  id: string;
  role: string;
  is_active: boolean | null;
  group_id: string | null;
}

interface CurriculumWeek {
  id: string;
  week_number: number;
  title: string;
  ew_theme: string | null;
  scripture_references: string[];
  application_challenge: string | null;
  truth_statement: string;
  pt_focus: string | null;
}

interface YouthSpaceProps {
  churchId: string;
}

export function YouthSpace({ churchId }: YouthSpaceProps) {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [groups, setGroups] = useState<YouthGroup[]>([]);
  const [myMembership, setMyMembership] = useState<YouthMembership | null>(null);
  const [myLeaderRole, setMyLeaderRole] = useState<YouthLeader | null>(null);
  const [curriculum, setCurriculum] = useState<CurriculumWeek[]>([]);
  const [myGroup, setMyGroup] = useState<YouthGroup | null>(null);

  useEffect(() => {
    if (churchId && user) {
      loadYouthData();
    }
  }, [churchId, user]);

  const loadYouthData = async () => {
    try {
      // Load all youth groups for this church
      const { data: groupsData, error: groupsError } = await supabase
        .from('youth_groups')
        .select('*')
        .eq('church_id', churchId)
        .eq('status', 'active')
        .order('name');

      if (groupsError) throw groupsError;
      setGroups(groupsData || []);

      // Check if user is a youth member
      const { data: memberData } = await supabase
        .from('youth_members')
        .select('*')
        .eq('user_id', user!.id)
        .maybeSingle();

      if (memberData) {
        setMyMembership(memberData);
        const group = groupsData?.find(g => g.id === memberData.group_id);
        if (group) setMyGroup(group);

        // Load curriculum
        const { data: curriculumData } = await supabase
          .from('youth_curriculum_weeks')
          .select('*')
          .order('week_number');

        setCurriculum(curriculumData || []);
      }

      // Check if user is a youth leader
      const { data: leaderData } = await supabase
        .from('youth_leaders')
        .select('*')
        .eq('user_id', user!.id)
        .eq('church_id', churchId)
        .eq('is_active', true)
        .maybeSingle();

      if (leaderData) {
        setMyLeaderRole(leaderData);
      }

    } catch (error) {
      console.error('Error loading youth data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleJoinGroup = async (groupId: string) => {
    try {
      const { error } = await supabase
        .from('youth_members')
        .insert({
          user_id: user!.id,
          group_id: groupId,
          member_pathway: 'explorer'
        });

      if (error) throw error;
      toast.success("You've joined the youth group!");
      loadYouthData();
    } catch (error: any) {
      console.error('Error joining group:', error);
      toast.error(error.message || "Failed to join group");
    }
  };

  const getAgeBandColor = (band: string) => {
    switch (band.toLowerCase()) {
      case 'teens': return 'bg-blue-500/20 text-blue-300 border-blue-500/30';
      case 'young-adults': return 'bg-purple-500/20 text-purple-300 border-purple-500/30';
      case 'college': return 'bg-green-500/20 text-green-300 border-green-500/30';
      default: return 'bg-primary/20 text-primary border-primary/30';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card variant="glass" className="overflow-hidden">
        <div className="bg-gradient-to-r from-purple-500/20 via-pink-500/20 to-orange-500/20 p-6">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-background/50 backdrop-blur">
              <Sparkles className="h-7 w-7 text-primary" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-foreground">Youth Space</h2>
              <p className="text-foreground/70">Connect, grow, and serve together</p>
            </div>
          </div>
        </div>
      </Card>

      {/* Main Content */}
      <Tabs defaultValue={myMembership ? "my-group" : "browse"} className="space-y-4">
        <TabsList className="bg-card/50 backdrop-blur flex-wrap h-auto gap-1 p-1 border border-border/50">
          {myMembership && (
            <TabsTrigger value="my-group" className="gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <Star className="h-4 w-4" />
              My Group
            </TabsTrigger>
          )}
          <TabsTrigger value="browse" className="gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
            <Users className="h-4 w-4" />
            Browse Groups
          </TabsTrigger>
          {myMembership && (
            <TabsTrigger value="curriculum" className="gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <BookOpen className="h-4 w-4" />
              Curriculum
            </TabsTrigger>
          )}
          {myLeaderRole && (
            <TabsTrigger value="leader" className="gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <Trophy className="h-4 w-4" />
              Leader Dashboard
            </TabsTrigger>
          )}
        </TabsList>

        {/* My Group Tab */}
        {myMembership && myGroup && (
          <TabsContent value="my-group">
            <div className="space-y-4">
              {/* Group Info Card */}
              <Card variant="glass">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        {myGroup.name}
                        <Badge variant="outline" className={getAgeBandColor(myGroup.age_band)}>
                          {myGroup.age_band}
                        </Badge>
                      </CardTitle>
                      <CardDescription>{myGroup.description}</CardDescription>
                    </div>
                    <Badge className="bg-green-500/20 text-green-300 border-green-500/30">
                      Member
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {myGroup.meeting_day && (
                      <div className="flex items-center gap-2 text-sm text-foreground/70">
                        <Calendar className="h-4 w-4" />
                        <span>{myGroup.meeting_day}s</span>
                      </div>
                    )}
                    {myGroup.meeting_time && (
                      <div className="flex items-center gap-2 text-sm text-foreground/70">
                        <Clock className="h-4 w-4" />
                        <span>{myGroup.meeting_time}</span>
                      </div>
                    )}
                    {myGroup.is_online ? (
                      <div className="flex items-center gap-2 text-sm text-foreground/70">
                        <Video className="h-4 w-4" />
                        <span>Online Meeting</span>
                      </div>
                    ) : myGroup.meeting_location && (
                      <div className="flex items-center gap-2 text-sm text-foreground/70">
                        <MapPin className="h-4 w-4" />
                        <span>{myGroup.meeting_location}</span>
                      </div>
                    )}
                  </div>

                  {myGroup.meeting_link && (
                    <Button className="mt-4" asChild>
                      <a href={myGroup.meeting_link} target="_blank" rel="noopener noreferrer">
                        <Video className="h-4 w-4 mr-2" />
                        Join Online Meeting
                      </a>
                    </Button>
                  )}
                </CardContent>
              </Card>

              {/* Current Week Study */}
              {myGroup.current_week && curriculum.length > 0 && (
                <Card variant="glass">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Flame className="h-5 w-5 text-primary" />
                      This Week's Study
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {(() => {
                      const currentWeek = curriculum.find(c => c.week_number === myGroup.current_week);
                      if (!currentWeek) return <p className="text-foreground/60">No study available</p>;
                      return (
                        <div className="space-y-3">
                          <div>
                            <p className="font-semibold text-foreground">{currentWeek.title}</p>
                            {currentWeek.ew_theme && (
                              <p className="text-sm text-foreground/70">Theme: {currentWeek.ew_theme}</p>
                            )}
                          </div>
                          {currentWeek.scripture_references && currentWeek.scripture_references.length > 0 && (
                            <div className="p-3 rounded-lg bg-primary/10 border border-primary/20">
                              <p className="text-sm font-medium text-foreground/80">Scripture Focus</p>
                              <p className="text-foreground">{currentWeek.scripture_references.join(', ')}</p>
                            </div>
                          )}
                          <div className="p-3 rounded-lg bg-muted/50 border border-border/50">
                            <p className="text-sm font-medium text-foreground/80">Truth Statement</p>
                            <p className="text-foreground/80">{currentWeek.truth_statement}</p>
                          </div>
                          {currentWeek.application_challenge && (
                            <div className="p-3 rounded-lg bg-amber-500/10 border border-amber-500/20">
                              <p className="text-sm font-medium text-amber-300">Challenge</p>
                              <p className="text-foreground/80">{currentWeek.application_challenge}</p>
                            </div>
                          )}
                        </div>
                      );
                    })()}
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>
        )}

        {/* Browse Groups Tab */}
        <TabsContent value="browse">
          <div className="space-y-4">
            {groups.length === 0 ? (
              <Card variant="glass">
                <CardContent className="py-12 text-center">
                  <Users className="h-12 w-12 text-foreground/30 mx-auto mb-4" />
                  <p className="text-foreground/60">No youth groups available yet</p>
                  <p className="text-sm text-foreground/50 mt-1">
                    Contact your church admin to start a youth ministry
                  </p>
                </CardContent>
              </Card>
            ) : (
              groups.map((group) => (
                <Card key={group.id} variant="glass" className="overflow-hidden">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 flex-wrap mb-2">
                          <h3 className="font-semibold text-foreground">{group.name}</h3>
                          <Badge variant="outline" className={getAgeBandColor(group.age_band)}>
                            {group.age_band}
                          </Badge>
                        </div>
                        {group.description && (
                          <p className="text-sm text-foreground/70 mb-3">{group.description}</p>
                        )}
                        <div className="flex items-center gap-4 text-sm text-foreground/60">
                          {group.meeting_day && (
                            <span className="flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              {group.meeting_day}s
                            </span>
                          )}
                          {group.meeting_time && (
                            <span className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {group.meeting_time}
                            </span>
                          )}
                          {group.is_online && (
                            <span className="flex items-center gap-1">
                              <Video className="h-3 w-3" />
                              Online
                            </span>
                          )}
                        </div>
                      </div>
                      {myMembership?.group_id === group.id ? (
                        <Badge className="bg-green-500/20 text-green-300">
                          <CheckCircle2 className="h-3 w-3 mr-1" />
                          Joined
                        </Badge>
                      ) : !myMembership && (
                        <Button size="sm" onClick={() => handleJoinGroup(group.id)}>
                          Join Group
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </TabsContent>

        {/* Curriculum Tab */}
        {myMembership && (
          <TabsContent value="curriculum">
            <div className="space-y-4">
              {curriculum.length === 0 ? (
                <Card variant="glass">
                  <CardContent className="py-12 text-center">
                    <BookOpen className="h-12 w-12 text-foreground/30 mx-auto mb-4" />
                    <p className="text-foreground/60">No curriculum available</p>
                    <p className="text-sm text-foreground/50 mt-1">
                      Your youth leaders will add content soon
                    </p>
                  </CardContent>
                </Card>
              ) : (
                curriculum.map((week) => (
                  <Card 
                    key={week.id} 
                    variant="glass" 
                    className={`transition-all ${myGroup?.current_week === week.week_number ? 'ring-2 ring-primary' : ''}`}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start gap-4">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                          myGroup?.current_week === week.week_number 
                            ? 'bg-primary text-primary-foreground' 
                            : 'bg-muted text-muted-foreground'
                        }`}>
                          {week.week_number}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <h3 className="font-semibold text-foreground">{week.title}</h3>
                            {myGroup?.current_week === week.week_number && (
                              <Badge className="bg-primary/20 text-primary">Current</Badge>
                            )}
                          </div>
                          {week.ew_theme && (
                            <p className="text-sm text-foreground/70 mt-1">{week.ew_theme}</p>
                          )}
                          {week.scripture_references && week.scripture_references.length > 0 && (
                            <p className="text-sm text-primary mt-2">
                              📖 {week.scripture_references.join(', ')}
                            </p>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </TabsContent>
        )}

        {/* Leader Dashboard Tab */}
        {myLeaderRole && (
          <TabsContent value="leader">
            <div className="space-y-4">
              <Card variant="glass">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Trophy className="h-5 w-5 text-amber-400" />
                    Youth Leader Dashboard
                  </CardTitle>
                  <CardDescription>
                    Manage your youth group, track attendance, and plan curriculum
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <Card className="bg-primary/10 border-primary/20">
                      <CardContent className="p-4 text-center">
                        <Users className="h-8 w-8 mx-auto text-primary mb-2" />
                        <p className="text-2xl font-bold text-foreground">--</p>
                        <p className="text-sm text-foreground/70">Members</p>
                      </CardContent>
                    </Card>
                    <Card className="bg-green-500/10 border-green-500/20">
                      <CardContent className="p-4 text-center">
                        <CheckCircle2 className="h-8 w-8 mx-auto text-green-400 mb-2" />
                        <p className="text-2xl font-bold text-foreground">--</p>
                        <p className="text-sm text-foreground/70">Avg Attendance</p>
                      </CardContent>
                    </Card>
                    <Card className="bg-amber-500/10 border-amber-500/20">
                      <CardContent className="p-4 text-center">
                        <Heart className="h-8 w-8 mx-auto text-amber-400 mb-2" />
                        <p className="text-2xl font-bold text-foreground">{myLeaderRole.role}</p>
                        <p className="text-sm text-foreground/70">Your Role</p>
                      </CardContent>
                    </Card>
                  </div>

                  <div className="mt-6 p-4 rounded-lg bg-muted/50 border border-border/50">
                    <p className="text-sm text-foreground/70">
                      📋 Full leader management features coming soon: attendance tracking, 
                      curriculum planning, parent communication, and event scheduling.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        )}
      </Tabs>
    </div>
  );
}
