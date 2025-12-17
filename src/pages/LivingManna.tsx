import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useSubscription } from "@/hooks/useSubscription";
import { useChurchMembership } from "@/hooks/useChurchMembership";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Loader2, Home, Users, BookOpen, Video, Heart, Flame, ExternalLink, ArrowRight, GraduationCap, Shield, Calendar, MessageCircle, MessagesSquare, AlertTriangle } from "lucide-react";
import { SmallGroupsHub } from "@/components/living-manna/SmallGroupsHub";
import { StudyFeed } from "@/components/living-manna/StudyFeed";
import { SermonHub } from "@/components/living-manna/SermonHub";
import { MemberHome } from "@/components/living-manna/MemberHome";
import { StudyCycles } from "@/components/living-manna/StudyCycles";
import { DiscipleshipPackages } from "@/components/living-manna/DiscipleshipPackages";
import { LeaderOnboarding } from "@/components/living-manna/LeaderOnboarding";
import { ChurchCommunity } from "@/components/living-manna/ChurchCommunity";
import { ChurchMessaging } from "@/components/living-manna/ChurchMessaging";
import { DirectMessagesProvider } from "@/contexts/DirectMessagesContext";

export default function LivingManna() {
  const { user } = useAuth();
  const { subscription, loading: subscriptionLoading } = useSubscription();
  const { isMember, churchId: memberChurchId, isLoading: membershipLoading } = useChurchMembership();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [churchName, setChurchName] = useState<string>("Living Manna Online Church");
  const [loading, setLoading] = useState(true);

  // Get church ID from URL or from membership
  const urlChurchId = searchParams.get('church');
  const effectiveChurchId = urlChurchId || memberChurchId || subscription.church.churchId;

  useEffect(() => {
    if (subscriptionLoading || membershipLoading) return;
    if (!user) return;

    // Check if user has access to this church
    const hasAccess = subscription.church.hasChurchAccess || isMember;
    
    if (hasAccess && effectiveChurchId) {
      loadChurchInfo(effectiveChurchId);
    } else {
      setLoading(false);
    }
  }, [user, subscription, subscriptionLoading, isMember, membershipLoading, effectiveChurchId]);

  const loadChurchInfo = async (churchId: string) => {
    try {
      const { data } = await supabase
        .from('churches')
        .select('name, branded_name')
        .eq('id', churchId)
        .single();

      if (data) {
        setChurchName(data.branded_name || data.name || "Living Manna Online Church");
      }
    } catch (error) {
      console.error('Error loading church info:', error);
    } finally {
      setLoading(false);
    }
  };

  if (subscriptionLoading || loading || membershipLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center gradient-dreamy">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto mb-4" />
          <p className="text-foreground/80">Loading Living Manna...</p>
        </div>
      </div>
    );
  }

  // Check if user has church access
  const hasChurchAccess = subscription.church.hasChurchAccess || isMember;

  // If user doesn't have church access, show join options
  if (!hasChurchAccess) {
    return (
      <div className="min-h-screen flex items-center justify-center gradient-dreamy p-4">
        <Card variant="glass" className="w-full max-w-lg">
          <CardHeader className="text-center">
            <div className="flex items-center justify-center gap-2 mb-4">
              <Flame className="h-10 w-10 text-primary" />
            </div>
            <CardTitle className="text-2xl">Welcome to Living Manna Online Church</CardTitle>
            <CardDescription>
              Join a community of believers committed to discipleship, fellowship, and mission.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-3">
              <div className="flex items-start gap-3 p-3 rounded-lg bg-primary/5 border border-primary/20">
                <Users className="h-5 w-5 text-primary mt-0.5" />
                <div>
                  <p className="font-medium">Small Group Fellowship</p>
                  <p className="text-sm text-muted-foreground">Connect with others in intimate digital house fires</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-3 rounded-lg bg-primary/5 border border-primary/20">
                <BookOpen className="h-5 w-5 text-primary mt-0.5" />
                <div>
                  <p className="font-medium">Unified Bible Study</p>
                  <p className="text-sm text-muted-foreground">Follow centralized, Christ-centered studies together</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-3 rounded-lg bg-primary/5 border border-primary/20">
                <Heart className="h-5 w-5 text-primary mt-0.5" />
                <div>
                  <p className="font-medium">Spiritual Growth</p>
                  <p className="text-sm text-muted-foreground">Access the full Phototheology discipleship system</p>
                </div>
              </div>
            </div>

            <div className="grid gap-3">
              <Button onClick={() => navigate('/join-church')} className="w-full">
                Join with Invitation Code
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
              <Button variant="outline" onClick={() => navigate('/dashboard')}>
                Explore Phototheology First
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <DirectMessagesProvider>
      <div className="min-h-screen gradient-dreamy p-4 md:p-8">
        <div className="container mx-auto max-w-7xl">
          {/* Header */}
          <div className="mb-8 glass-card p-6 rounded-2xl">
            <div className="flex items-center gap-3 mb-2">
              <Flame className="h-8 w-8 text-primary" />
              <h1 className="text-4xl font-bold text-foreground">{churchName}</h1>
            </div>
            <p className="text-foreground/80 font-medium">
              Your discipleship home — study, fellowship, and grow together
            </p>
            {(subscription.church.churchRole === 'admin' || subscription.church.churchRole === 'leader') && (
              <Button 
                variant="outline" 
                size="sm" 
                className="mt-3 bg-white/20 border-white/30 hover:bg-white/30"
                onClick={() => navigate('/church-admin')}
              >
                <Users className="h-4 w-4 mr-2" />
                Leader Dashboard
              </Button>
            )}
          </div>

          {/* Main Content Tabs */}
          <Tabs defaultValue="home" className="space-y-6">
            <TabsList className="glass-card flex-wrap h-auto gap-1 p-1">
              <TabsTrigger value="home" className="gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                <Home className="h-4 w-4" />
                Home
              </TabsTrigger>
              <TabsTrigger value="community" className="gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                <MessagesSquare className="h-4 w-4" />
                Community
              </TabsTrigger>
              <TabsTrigger value="messages" className="gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                <MessageCircle className="h-4 w-4" />
                Messages
              </TabsTrigger>
              <TabsTrigger value="small-groups" className="gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                <Users className="h-4 w-4" />
                Small Groups
              </TabsTrigger>
              <TabsTrigger value="studies" className="gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                <BookOpen className="h-4 w-4" />
                Study Feed
              </TabsTrigger>
              <TabsTrigger value="cycles" className="gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                <Calendar className="h-4 w-4" />
                6-Week Cycles
              </TabsTrigger>
              <TabsTrigger value="discipleship" className="gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                <GraduationCap className="h-4 w-4" />
                Discipleship
              </TabsTrigger>
              <TabsTrigger value="leader-training" className="gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                <Shield className="h-4 w-4" />
                Leader Training
              </TabsTrigger>
              <TabsTrigger value="sermons" className="gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                <Video className="h-4 w-4" />
                Sermons
              </TabsTrigger>
            </TabsList>

            <TabsContent value="home">
              <MemberHome churchId={effectiveChurchId!} />
            </TabsContent>

            <TabsContent value="community">
              <ChurchCommunity churchId={effectiveChurchId!} />
            </TabsContent>

            <TabsContent value="messages">
              <ChurchMessaging churchId={effectiveChurchId!} />
            </TabsContent>

            <TabsContent value="small-groups">
              <SmallGroupsHub churchId={effectiveChurchId!} />
            </TabsContent>

            <TabsContent value="studies">
              <StudyFeed churchId={effectiveChurchId!} />
            </TabsContent>

            <TabsContent value="cycles">
              <StudyCycles churchId={effectiveChurchId!} />
            </TabsContent>

            <TabsContent value="discipleship">
              <DiscipleshipPackages churchId={effectiveChurchId!} />
            </TabsContent>

            <TabsContent value="leader-training">
              <LeaderOnboarding churchId={effectiveChurchId!} />
            </TabsContent>

            <TabsContent value="sermons">
              <SermonHub churchId={effectiveChurchId!} />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </DirectMessagesProvider>
  );
}
