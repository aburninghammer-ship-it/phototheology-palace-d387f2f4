import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import { 
  BookOpen, Calendar, Share2, Download, ChevronRight, 
  MessageSquare, CheckCircle, Users, ExternalLink, Copy
} from "lucide-react";
import { format } from "date-fns";

interface StudyFeedProps {
  churchId: string;
}

interface CentralStudy {
  id: string;
  title: string;
  description: string | null;
  week_start: string;
  week_end: string;
  status: 'draft' | 'active' | 'completed';
  key_passages: string[];
  guided_questions: string[];
  christ_synthesis: string;
  action_challenge: string;
  prayer_focus: string;
  seeker_friendly_framing: string | null;
  share_token: string | null;
}

export function StudyFeed({ churchId }: StudyFeedProps) {
  const { user } = useAuth();
  const [currentStudy, setCurrentStudy] = useState<CentralStudy | null>(null);
  const [pastStudies, setPastStudies] = useState<CentralStudy[]>([]);
  const [loading, setLoading] = useState(true);
  const [shareDialogOpen, setShareDialogOpen] = useState(false);
  const [selectedStudy, setSelectedStudy] = useState<CentralStudy | null>(null);

  useEffect(() => {
    loadStudies();
  }, [churchId]);

  const loadStudies = async () => {
    try {
      // Load current/active study
      const { data: active } = await supabase
        .from('church_central_studies')
        .select('*')
        .eq('church_id', churchId)
        .eq('status', 'active')
        .order('week_start', { ascending: false })
        .limit(1)
        .single();

      setCurrentStudy(active);

      // Load past studies
      const { data: past } = await supabase
        .from('church_central_studies')
        .select('*')
        .eq('church_id', churchId)
        .eq('status', 'completed')
        .order('week_start', { ascending: false })
        .limit(12);

      setPastStudies(past || []);
    } catch (error) {
      console.error('Error loading studies:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleShare = (study: CentralStudy) => {
    setSelectedStudy(study);
    setShareDialogOpen(true);
  };

  const copyShareLink = () => {
    if (!selectedStudy) return;
    const link = `${window.location.origin}/study/${selectedStudy.share_token || selectedStudy.id}`;
    navigator.clipboard.writeText(link);
    toast.success("Share link copied!");
  };

  const shareToFriend = (platform: string) => {
    if (!selectedStudy) return;
    const link = `${window.location.origin}/study/${selectedStudy.share_token || selectedStudy.id}`;
    const text = `Check out this Bible study: "${selectedStudy.title}" - We're studying ${selectedStudy.key_passages.join(', ')} this week!`;

    switch (platform) {
      case 'whatsapp':
        window.open(`https://wa.me/?text=${encodeURIComponent(text + ' ' + link)}`, '_blank');
        break;
      case 'email':
        window.open(`mailto:?subject=${encodeURIComponent(selectedStudy.title)}&body=${encodeURIComponent(text + '\n\n' + link)}`, '_blank');
        break;
      case 'sms':
        window.open(`sms:?body=${encodeURIComponent(text + ' ' + link)}`, '_blank');
        break;
    }
    toast.success(`Opening ${platform}...`);
  };

  const StudyCard = ({ study, isActive = false }: { study: CentralStudy; isActive?: boolean }) => (
    <Card variant="glass" className={isActive ? "border-primary/50" : ""}>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2 mb-2">
              {isActive && <Badge className="bg-green-500">This Week</Badge>}
              <Badge variant="outline">
                {format(new Date(study.week_start), 'MMM d')} - {format(new Date(study.week_end), 'MMM d')}
              </Badge>
            </div>
            <CardTitle className="text-xl">{study.title}</CardTitle>
            {study.description && (
              <CardDescription className="mt-2">{study.description}</CardDescription>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Key Passages */}
        <div>
          <h4 className="font-medium text-sm mb-2 flex items-center gap-2">
            <BookOpen className="h-4 w-4 text-primary" />
            Key Passages
          </h4>
          <div className="flex flex-wrap gap-2">
            {study.key_passages.map((passage, i) => (
              <Badge key={i} variant="outline">{passage}</Badge>
            ))}
          </div>
        </div>

        {/* Guided Questions */}
        <div>
          <h4 className="font-medium text-sm mb-2 flex items-center gap-2">
            <MessageSquare className="h-4 w-4 text-primary" />
            Discussion Questions
          </h4>
          <ul className="space-y-2 text-sm">
            {study.guided_questions.slice(0, 3).map((q, i) => (
              <li key={i} className="flex items-start gap-2">
                <span className="text-primary font-medium">{i + 1}.</span>
                <span className="text-muted-foreground">{q}</span>
              </li>
            ))}
            {study.guided_questions.length > 3 && (
              <li className="text-xs text-muted-foreground">
                +{study.guided_questions.length - 3} more questions...
              </li>
            )}
          </ul>
        </div>

        {/* Christ Synthesis */}
        <div className="p-3 rounded-lg bg-primary/5 border border-primary/20">
          <h4 className="font-medium text-sm mb-1">Christ-Centered Truth</h4>
          <p className="text-sm text-muted-foreground">{study.christ_synthesis}</p>
        </div>

        {/* Action & Prayer */}
        <div className="grid gap-3 md:grid-cols-2">
          <div className="p-3 rounded-lg bg-muted/50">
            <h4 className="font-medium text-sm mb-1 flex items-center gap-1">
              <CheckCircle className="h-4 w-4 text-green-500" />
              Action Challenge
            </h4>
            <p className="text-sm text-muted-foreground">{study.action_challenge}</p>
          </div>
          <div className="p-3 rounded-lg bg-muted/50">
            <h4 className="font-medium text-sm mb-1">🙏 Prayer Focus</h4>
            <p className="text-sm text-muted-foreground">{study.prayer_focus}</p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2 pt-2">
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => handleShare(study)}
          >
            <Share2 className="h-4 w-4 mr-2" />
            Share with Friend
          </Button>
          {study.seeker_friendly_framing && (
            <Badge variant="outline" className="bg-amber-500/10 text-amber-600">
              <Users className="h-3 w-3 mr-1" />
              Seeker-Friendly Version
            </Badge>
          )}
        </div>
      </CardContent>
    </Card>
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <BookOpen className="h-6 w-6 text-primary" />
          Central Study Feed
        </h2>
        <p className="text-muted-foreground">
          One sermon → One study → All groups study together
        </p>
      </div>

      <Tabs defaultValue="current" className="space-y-4">
        <TabsList>
          <TabsTrigger value="current">This Week</TabsTrigger>
          <TabsTrigger value="archive">Past Studies</TabsTrigger>
        </TabsList>

        <TabsContent value="current">
          {currentStudy ? (
            <StudyCard study={currentStudy} isActive />
          ) : (
            <Card variant="glass">
              <CardContent className="py-12 text-center">
                <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No Active Study</h3>
                <p className="text-muted-foreground">
                  The central study for this week hasn't been released yet.
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="archive">
          {pastStudies.length === 0 ? (
            <Card variant="glass">
              <CardContent className="py-12 text-center">
                <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No Past Studies</h3>
                <p className="text-muted-foreground">
                  Previous studies will appear here after they're completed.
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {pastStudies.map(study => (
                <StudyCard key={study.id} study={study} />
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Share Dialog */}
      <Dialog open={shareDialogOpen} onOpenChange={setShareDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Share2 className="h-5 w-5 text-primary" />
              Share This Study
            </DialogTitle>
            <DialogDescription>
              Invite a friend to explore this Bible study—perfect for non-SDA seekers!
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            {selectedStudy?.seeker_friendly_framing && (
              <Card className="bg-amber-500/5 border-amber-500/20">
                <CardContent className="py-3">
                  <p className="text-sm font-medium text-amber-600 mb-1">
                    Seeker-Friendly Version Available
                  </p>
                  <p className="text-xs text-muted-foreground">
                    This study includes approachable framing for friends new to faith.
                  </p>
                </CardContent>
              </Card>
            )}

            <div className="grid gap-3">
              <Button 
                variant="outline" 
                className="justify-start"
                onClick={() => shareToFriend('whatsapp')}
              >
                <span className="mr-3">📱</span>
                Share via WhatsApp
              </Button>
              <Button 
                variant="outline" 
                className="justify-start"
                onClick={() => shareToFriend('sms')}
              >
                <span className="mr-3">💬</span>
                Share via Text Message
              </Button>
              <Button 
                variant="outline" 
                className="justify-start"
                onClick={() => shareToFriend('email')}
              >
                <span className="mr-3">✉️</span>
                Share via Email
              </Button>
              <Button 
                variant="outline" 
                className="justify-start"
                onClick={copyShareLink}
              >
                <Copy className="h-4 w-4 mr-3" />
                Copy Link
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
