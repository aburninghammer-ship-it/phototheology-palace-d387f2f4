import { useState } from "react";
import { Navigation } from "@/components/Navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Users, Plus, MessageSquare, BookOpen, Calendar, Crown, Search, Lock, Globe } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";

interface StudyGroup {
  id: string;
  name: string;
  description: string;
  memberCount: number;
  maxMembers: number;
  currentPlan: string;
  isPrivate: boolean;
  leaderId: string;
  leaderName: string;
  nextMeeting?: string;
}

const SAMPLE_GROUPS: StudyGroup[] = [
  {
    id: "1",
    name: "Daniel & Revelation Study",
    description: "Deep dive into prophetic books using Phototheology methods",
    memberCount: 8,
    maxMembers: 12,
    currentPlan: "Daniel's 70 Weeks",
    isPrivate: false,
    leaderId: "1",
    leaderName: "Pastor John",
    nextMeeting: "Saturday 10 AM",
  },
  {
    id: "2",
    name: "Youth Bible Warriors",
    description: "High school & college students exploring Scripture together",
    memberCount: 15,
    maxMembers: 20,
    currentPlan: "Gospel of John",
    isPrivate: false,
    leaderId: "2",
    leaderName: "Sarah M.",
    nextMeeting: "Friday 7 PM",
  },
  {
    id: "3",
    name: "Marriage Builders",
    description: "Couples studying biblical principles for strong marriages",
    memberCount: 6,
    maxMembers: 8,
    currentPlan: "Blueprint Marriage",
    isPrivate: true,
    leaderId: "3",
    leaderName: "Mike & Linda",
  },
];

export default function StudyGroups() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [groups, setGroups] = useState<StudyGroup[]>(SAMPLE_GROUPS);
  const [searchQuery, setSearchQuery] = useState("");
  const [createOpen, setCreateOpen] = useState(false);
  const [newGroup, setNewGroup] = useState({
    name: "",
    description: "",
    maxMembers: 12,
    isPrivate: false,
  });

  const filteredGroups = groups.filter(g =>
    g.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    g.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCreateGroup = () => {
    if (!newGroup.name.trim()) {
      toast({ title: "Please enter a group name", variant: "destructive" });
      return;
    }

    const group: StudyGroup = {
      id: Date.now().toString(),
      name: newGroup.name,
      description: newGroup.description,
      memberCount: 1,
      maxMembers: newGroup.maxMembers,
      currentPlan: "Not started",
      isPrivate: newGroup.isPrivate,
      leaderId: user?.id || "",
      leaderName: "You",
    };

    setGroups([group, ...groups]);
    setCreateOpen(false);
    setNewGroup({ name: "", description: "", maxMembers: 12, isPrivate: false });
    toast({ title: "Group created!", description: "Invite others to join your study group." });
  };

  const handleJoinGroup = (group: StudyGroup) => {
    if (group.memberCount >= group.maxMembers) {
      toast({ title: "Group is full", variant: "destructive" });
      return;
    }
    toast({ title: `Joined "${group.name}"`, description: "You're now a member of this study group." });
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Header */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold flex items-center gap-2">
                <Users className="h-8 w-8 text-primary" />
                Study Groups
              </h1>
              <p className="text-muted-foreground">Join or create groups to study Scripture together</p>
            </div>
            
            <Dialog open={createOpen} onOpenChange={setCreateOpen}>
              <DialogTrigger asChild>
                <Button className="gap-2">
                  <Plus className="h-4 w-4" />
                  Create Group
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Create Study Group</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label>Group Name</Label>
                    <Input
                      placeholder="e.g., Sunday Morning Study"
                      value={newGroup.name}
                      onChange={(e) => setNewGroup({ ...newGroup, name: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label>Description</Label>
                    <Textarea
                      placeholder="What will your group study?"
                      value={newGroup.description}
                      onChange={(e) => setNewGroup({ ...newGroup, description: e.target.value })}
                    />
                  </div>
                  <div className="flex gap-4">
                    <div className="flex-1">
                      <Label>Max Members</Label>
                      <Input
                        type="number"
                        min={2}
                        max={50}
                        value={newGroup.maxMembers}
                        onChange={(e) => setNewGroup({ ...newGroup, maxMembers: parseInt(e.target.value) || 12 })}
                      />
                    </div>
                    <div className="flex-1">
                      <Label>Visibility</Label>
                      <div className="flex gap-2 mt-2">
                        <Button
                          type="button"
                          variant={!newGroup.isPrivate ? "default" : "outline"}
                          size="sm"
                          onClick={() => setNewGroup({ ...newGroup, isPrivate: false })}
                        >
                          <Globe className="h-4 w-4 mr-1" />
                          Public
                        </Button>
                        <Button
                          type="button"
                          variant={newGroup.isPrivate ? "default" : "outline"}
                          size="sm"
                          onClick={() => setNewGroup({ ...newGroup, isPrivate: true })}
                        >
                          <Lock className="h-4 w-4 mr-1" />
                          Private
                        </Button>
                      </div>
                    </div>
                  </div>
                  <Button onClick={handleCreateGroup} className="w-full">
                    Create Group
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search groups..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Groups Grid */}
          <div className="grid md:grid-cols-2 gap-4">
            {filteredGroups.map((group, index) => (
              <motion.div
                key={group.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="h-full hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-2">
                        {group.isPrivate ? (
                          <Lock className="h-4 w-4 text-muted-foreground" />
                        ) : (
                          <Globe className="h-4 w-4 text-emerald-500" />
                        )}
                        <Badge variant="outline">
                          {group.memberCount}/{group.maxMembers} members
                        </Badge>
                      </div>
                    </div>
                    <CardTitle className="text-lg">{group.name}</CardTitle>
                    <CardDescription>{group.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center gap-2 text-sm">
                      <BookOpen className="h-4 w-4 text-primary" />
                      <span>Currently: {group.currentPlan}</span>
                    </div>
                    
                    {group.nextMeeting && (
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Calendar className="h-4 w-4" />
                        <span>Next: {group.nextMeeting}</span>
                      </div>
                    )}

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Avatar className="h-6 w-6">
                          <AvatarFallback className="text-xs">
                            {group.leaderName.slice(0, 2).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <span className="text-sm text-muted-foreground flex items-center gap-1">
                          <Crown className="h-3 w-3 text-yellow-500" />
                          {group.leaderName}
                        </span>
                      </div>
                      
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          <MessageSquare className="h-4 w-4" />
                        </Button>
                        <Button 
                          size="sm" 
                          onClick={() => handleJoinGroup(group)}
                          disabled={group.memberCount >= group.maxMembers}
                        >
                          Join
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          {filteredGroups.length === 0 && (
            <Card className="text-center py-12">
              <CardContent>
                <Users className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
                <h3 className="text-lg font-medium mb-2">No groups found</h3>
                <p className="text-muted-foreground mb-4">
                  {searchQuery ? "Try a different search term" : "Be the first to create a study group!"}
                </p>
                <Button onClick={() => setCreateOpen(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Group
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
    </div>
  );
}
