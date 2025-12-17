import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import { 
  Users, Search, Calendar, Clock, MapPin, 
  Flame, UserPlus, MessageSquare, Video
} from "lucide-react";

interface SmallGroupsHubProps {
  churchId: string;
}

interface SmallGroup {
  id: string;
  name: string;
  description: string | null;
  leader_id: string;
  meeting_day: string | null;
  meeting_time: string | null;
  meeting_type: 'in-person' | 'online' | 'hybrid';
  location: string | null;
  max_members: number;
  current_cycle: string | null;
  is_open: boolean;
  member_count?: number;
  leader_name?: string;
}

export function SmallGroupsHub({ churchId }: SmallGroupsHubProps) {
  const { user } = useAuth();
  const [groups, setGroups] = useState<SmallGroup[]>([]);
  const [myGroups, setMyGroups] = useState<SmallGroup[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    loadGroups();
  }, [churchId]);

  const loadGroups = async () => {
    try {
      // Load all open groups - using any for new tables
      const { data: allGroups, error } = await (supabase
        .from('small_groups' as any)
        .select(`
          *,
          profiles:leader_id (display_name, avatar_url)
        `)
        .eq('church_id', churchId)
        .eq('is_active', true)
        .order('name') as any);

      if (error) throw error;

      // Get member counts
      const groupsWithCounts = await Promise.all(
        (allGroups || []).map(async (group: any) => {
          const { count } = await (supabase
            .from('small_group_members' as any)
            .select('*', { count: 'exact', head: true })
            .eq('group_id', group.id) as any);

          return {
            ...group,
            member_count: count || 0,
            leader_name: group.profiles?.display_name || 'Unknown'
          };
        })
      );

      // Filter my groups vs available groups
      if (user) {
        const { data: myMemberships } = await (supabase
          .from('small_group_members' as any)
          .select('group_id')
          .eq('user_id', user.id) as any);

        const myGroupIds = new Set((myMemberships || []).map((m: any) => m.group_id));
        
        setMyGroups(groupsWithCounts.filter((g: any) => myGroupIds.has(g.id)));
        setGroups(groupsWithCounts.filter((g: any) => !myGroupIds.has(g.id) && g.is_open));
      } else {
        setGroups(groupsWithCounts.filter((g: any) => g.is_open));
      }
    } catch (error) {
      console.error('Error loading groups:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleJoinGroup = async (groupId: string) => {
    if (!user) {
      toast.error("Please sign in to join a group");
      return;
    }

    try {
      const { error } = await (supabase
        .from('small_group_members' as any)
        .insert({
          group_id: groupId,
          user_id: user.id,
          role: 'member'
        }) as any);

      if (error) throw error;

      toast.success("Successfully joined the group!");
      loadGroups();
    } catch (error: any) {
      console.error('Error joining group:', error);
      toast.error(error.message || "Failed to join group");
    }
  };

  const filteredGroups = groups.filter(group =>
    group.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    group.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getMeetingTypeIcon = (type: string) => {
    switch (type) {
      case 'online': return <Video className="h-4 w-4" />;
      case 'in-person': return <MapPin className="h-4 w-4" />;
      default: return <Users className="h-4 w-4" />;
    }
  };

  const GroupCard = ({ group, isMember = false }: { group: SmallGroup; isMember?: boolean }) => (
    <Card variant="glass" className="hover:border-primary/30 transition-colors">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
              <Flame className="h-6 w-6 text-primary" />
            </div>
            <div>
              <CardTitle className="text-lg">{group.name}</CardTitle>
              <CardDescription className="flex items-center gap-1">
                <span>Led by {group.leader_name}</span>
              </CardDescription>
            </div>
          </div>
          <Badge variant={group.meeting_type === 'online' ? 'default' : 'outline'}>
            {getMeetingTypeIcon(group.meeting_type)}
            <span className="ml-1 capitalize">{group.meeting_type}</span>
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        {group.description && (
          <p className="text-sm text-muted-foreground mb-4">{group.description}</p>
        )}
        
        <div className="flex flex-wrap gap-3 text-sm text-muted-foreground mb-4">
          {group.meeting_day && (
            <span className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              {group.meeting_day}
            </span>
          )}
          {group.meeting_time && (
            <span className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              {group.meeting_time}
            </span>
          )}
          <span className="flex items-center gap-1">
            <Users className="h-4 w-4" />
            {group.member_count}/{group.max_members} members
          </span>
        </div>

        {group.current_cycle && (
          <Badge variant="outline" className="mb-4">
            Current: {group.current_cycle}
          </Badge>
        )}

        <div className="flex gap-2">
          {isMember ? (
            <>
              <Button className="flex-1">
                <MessageSquare className="h-4 w-4 mr-2" />
                Open Group
              </Button>
              <Button variant="outline">
                <Calendar className="h-4 w-4" />
              </Button>
            </>
          ) : (
            <Button 
              className="w-full" 
              onClick={() => handleJoinGroup(group.id)}
              disabled={(group.member_count || 0) >= group.max_members}
            >
              <UserPlus className="h-4 w-4 mr-2" />
              {(group.member_count || 0) >= group.max_members ? 'Group Full' : 'Join This House Fire'}
            </Button>
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
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Flame className="h-6 w-6 text-primary" />
            House Fires (Small Groups)
          </h2>
          <p className="text-muted-foreground">
            Connect with a community for fellowship, study, and growth
          </p>
        </div>
      </div>

      {/* My Groups */}
      {myGroups.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold mb-4">My Groups</h3>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {myGroups.map(group => (
              <GroupCard key={group.id} group={group} isMember />
            ))}
          </div>
        </div>
      )}

      {/* Find Groups */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Find a House Fire</h3>
          <div className="relative w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search groups..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {filteredGroups.length === 0 ? (
          <Card variant="glass">
            <CardContent className="py-12 text-center">
              <Flame className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No Open Groups Available</h3>
              <p className="text-muted-foreground mb-4">
                All current groups are at capacity. Check back soon or contact a leader.
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredGroups.map(group => (
              <GroupCard key={group.id} group={group} />
            ))}
          </div>
        )}
      </div>

      {/* 6-Week Cycle Info */}
      <Card variant="glass" className="border-primary/20">
        <CardHeader>
          <CardTitle className="text-lg">How Small Groups Work</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground">
            Living Manna small groups operate in <strong>6-week cycles</strong>. Each cycle has a clear theme 
            and outcome, with reset points for new members to join.
          </p>
          <div className="grid gap-3 md:grid-cols-2">
            <div className="p-3 rounded-lg bg-primary/5 border border-primary/20">
              <h4 className="font-medium mb-1">Unified Study</h4>
              <p className="text-sm text-muted-foreground">
                All groups study the same Central Study Packet each week
              </p>
            </div>
            <div className="p-3 rounded-lg bg-primary/5 border border-primary/20">
              <h4 className="font-medium mb-1">Trained Leaders</h4>
              <p className="text-sm text-muted-foreground">
                Leaders facilitate discussion—they don't create curriculum
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
