import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useSubscription } from "@/hooks/useSubscription";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Loader2, Home, Users, BookOpen, Video, Heart, Flame, ExternalLink, ArrowRight } from "lucide-react";
import { SmallGroupsHub } from "@/components/living-manna/SmallGroupsHub";
import { StudyFeed } from "@/components/living-manna/StudyFeed";
import { SermonHub } from "@/components/living-manna/SermonHub";
import { MemberHome } from "@/components/living-manna/MemberHome";

export default function LivingManna() {
  const { user } = useAuth();
  const { subscription, loading: subscriptionLoading } = useSubscription();
  const navigate = useNavigate();
  const [churchName, setChurchName] = useState<string>("Living Manna Online Church");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (subscriptionLoading) return;
    if (!user) return;

    if (subscription.church.hasChurchAccess && subscription.church.churchId) {
      loadChurchInfo();
    } else {
      setLoading(false);
    }
  }, [user, subscription, subscriptionLoading]);

  const loadChurchInfo = async () => {
    try {
      const { data } = await supabase
        .from('churches')
        .select('name, branded_name')
        .eq('id', subscription.church.churchId!)
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

  if (subscriptionLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center gradient-dreamy">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto mb-4" />
          <p className="text-foreground/80">Loading Living Manna...</p>
        </div>
      </div>
    );
  }

  // If user doesn't have church access, show join options
  if (!subscription.church.hasChurchAccess) {
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
    <div className="min-h-screen gradient-dreamy p-4 md:p-8">
      <div className="container mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Flame className="h-8 w-8 text-primary" />
            <h1 className="text-4xl font-bold">{churchName}</h1>
          </div>
          <p className="text-muted-foreground">
            Your discipleship home — study, fellowship, and grow together
          </p>
          {subscription.church.churchRole === 'admin' && (
            <Button 
              variant="outline" 
              size="sm" 
              className="mt-3"
              onClick={() => navigate('/church-admin')}
            >
              <Users className="h-4 w-4 mr-2" />
              Leader Dashboard
            </Button>
          )}
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="home" className="space-y-6">
          <TabsList className="flex-wrap">
            <TabsTrigger value="home" className="gap-2">
              <Home className="h-4 w-4" />
              Home
            </TabsTrigger>
            <TabsTrigger value="small-groups" className="gap-2">
              <Users className="h-4 w-4" />
              Small Groups
            </TabsTrigger>
            <TabsTrigger value="studies" className="gap-2">
              <BookOpen className="h-4 w-4" />
              Study Feed
            </TabsTrigger>
            <TabsTrigger value="sermons" className="gap-2">
              <Video className="h-4 w-4" />
              Sermons
            </TabsTrigger>
          </TabsList>

          <TabsContent value="home">
            <MemberHome churchId={subscription.church.churchId!} />
          </TabsContent>

          <TabsContent value="small-groups">
            <SmallGroupsHub churchId={subscription.church.churchId!} />
          </TabsContent>

          <TabsContent value="studies">
            <StudyFeed churchId={subscription.church.churchId!} />
          </TabsContent>

          <TabsContent value="sermons">
            <SermonHub churchId={subscription.church.churchId!} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
