import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { 
  Loader2, Plus, Target, Users, Calendar, MapPin, 
  TrendingUp, Globe, Link2
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

interface EvangelismCampaignsProps {
  churchId: string;
}

interface Campaign {
  id: string;
  title: string;
  description: string | null;
  campaign_type: string;
  status: string;
  location: string | null;
  target_audience: string | null;
  start_date: string | null;
  end_date: string | null;
  is_online: boolean;
  meeting_link: string | null;
  created_at: string;
}

export function EvangelismCampaigns({ churchId }: EvangelismCampaignsProps) {
  const { user } = useAuth();
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [creating, setCreating] = useState(false);
  
  // Form state
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [campaignType, setCampaignType] = useState("door_to_door");
  const [location, setLocation] = useState("");
  const [targetAudience, setTargetAudience] = useState("");
  const [isOnline, setIsOnline] = useState(false);

  useEffect(() => {
    loadCampaigns();
  }, [churchId]);

  const loadCampaigns = async () => {
    try {
      const { data, error } = await supabase
        .from('evangelism_campaigns')
        .select('*')
        .eq('church_id', churchId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setCampaigns(data || []);
    } catch (error) {
      console.error('Error loading campaigns:', error);
      toast.error("Failed to load campaigns");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateCampaign = async () => {
    if (!title) {
      toast.error("Please enter a campaign title");
      return;
    }

    setCreating(true);
    try {
      const { error } = await supabase
        .from('evangelism_campaigns')
        .insert({
          church_id: churchId,
          title,
          description: description || null,
          campaign_type: campaignType,
          location: location || null,
          target_audience: targetAudience || null,
          is_online: isOnline,
          status: 'planning',
          created_by: user?.id,
        });

      if (error) throw error;

      toast.success("Campaign created successfully");
      setDialogOpen(false);
      setTitle("");
      setDescription("");
      setCampaignType("door_to_door");
      setLocation("");
      setTargetAudience("");
      setIsOnline(false);
      loadCampaigns();
    } catch (error) {
      console.error('Error creating campaign:', error);
      toast.error("Failed to create campaign");
    } finally {
      setCreating(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-500/10 text-green-500 border-green-500/20';
      case 'planning': return 'bg-blue-500/10 text-blue-500 border-blue-500/20';
      case 'completed': return 'bg-gray-500/10 text-gray-500 border-gray-500/20';
      case 'paused': return 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const getCampaignTypeLabel = (type: string) => {
    const types: Record<string, string> = {
      door_to_door: "Door to Door",
      literature: "Literature Distribution",
      health_expo: "Health Expo",
      community_event: "Community Event",
      bible_study: "Bible Study Campaign",
      media: "Media Campaign",
    };
    return types[type] || type;
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
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Evangelism Campaigns</h2>
          <p className="text-muted-foreground">Plan and track your outreach efforts</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              New Campaign
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create Evangelism Campaign</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 pt-4">
              <div>
                <Label htmlFor="title">Campaign Title *</Label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Spring Outreach 2025"
                />
              </div>
              <div>
                <Label htmlFor="type">Campaign Type</Label>
                <Select value={campaignType} onValueChange={setCampaignType}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="door_to_door">Door to Door</SelectItem>
                    <SelectItem value="literature">Literature Distribution</SelectItem>
                    <SelectItem value="health_expo">Health Expo</SelectItem>
                    <SelectItem value="community_event">Community Event</SelectItem>
                    <SelectItem value="bible_study">Bible Study Campaign</SelectItem>
                    <SelectItem value="media">Media Campaign</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="audience">Target Audience</Label>
                <Input
                  id="audience"
                  value={targetAudience}
                  onChange={(e) => setTargetAudience(e.target.value)}
                  placeholder="Young families, seniors, etc."
                />
              </div>
              <div>
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="Downtown neighborhood"
                />
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Campaign goals and approach..."
                  rows={3}
                />
              </div>
              <Button onClick={handleCreateCampaign} disabled={creating} className="w-full">
                {creating ? (
                  <><Loader2 className="h-4 w-4 animate-spin mr-2" /> Creating...</>
                ) : (
                  <><Plus className="h-4 w-4 mr-2" /> Create Campaign</>
                )}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {campaigns.length === 0 ? (
        <Card>
          <CardContent className="py-12">
            <div className="text-center">
              <Target className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No Campaigns Yet</h3>
              <p className="text-muted-foreground mb-4">
                Create your first evangelism campaign to start tracking outreach efforts.
              </p>
              <Button onClick={() => setDialogOpen(true)} className="gap-2">
                <Plus className="h-4 w-4" />
                Create First Campaign
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {campaigns.map((campaign) => (
            <Card key={campaign.id} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <Badge className={getStatusColor(campaign.status)}>
                    {campaign.status}
                  </Badge>
                  <Badge variant="outline">
                    {getCampaignTypeLabel(campaign.campaign_type)}
                  </Badge>
                </div>
                <CardTitle className="text-lg mt-2">{campaign.title}</CardTitle>
                {campaign.description && (
                  <CardDescription className="line-clamp-2">
                    {campaign.description}
                  </CardDescription>
                )}
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {campaign.location && (
                    <div className="flex items-center gap-2 text-sm">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <span>{campaign.location}</span>
                    </div>
                  )}
                  {campaign.target_audience && (
                    <div className="flex items-center gap-2 text-sm">
                      <Users className="h-4 w-4 text-muted-foreground" />
                      <span>{campaign.target_audience}</span>
                    </div>
                  )}
                  {campaign.is_online && (
                    <div className="flex items-center gap-2 text-sm">
                      <Globe className="h-4 w-4 text-muted-foreground" />
                      <span>Online Campaign</span>
                    </div>
                  )}
                  {campaign.start_date && (
                    <div className="flex items-center gap-2 text-sm">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span>Starts {campaign.start_date}</span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
