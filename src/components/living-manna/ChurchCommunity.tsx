import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import { Loader2, MessageSquare, Send, Heart, Plus } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { formatDistanceToNow } from "date-fns";

interface ChurchPost {
  id: string;
  title: string;
  content: string;
  user_id: string;
  created_at: string;
  category: string | null;
  likes: number;
  profiles: {
    username: string;
    display_name: string | null;
    avatar_url: string | null;
  };
}

interface ChurchCommunityProps {
  churchId: string;
}

export function ChurchCommunity({ churchId }: ChurchCommunityProps) {
  const { user } = useAuth();
  const [posts, setPosts] = useState<ChurchPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newContent, setNewContent] = useState("");
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    loadPosts();
  }, [churchId]);

  const loadPosts = async () => {
    try {
      // Get church members
      const { data: members } = await supabase
        .from('church_members')
        .select('user_id')
        .eq('church_id', churchId);

      if (!members || members.length === 0) {
        setPosts([]);
        return;
      }

      const memberIds = members.map(m => m.user_id);

      // Get posts from church members only
      const { data, error } = await supabase
        .from('community_posts')
        .select(`
          *,
          profiles:user_id(username, display_name, avatar_url)
        `)
        .in('user_id', memberIds)
        .order('created_at', { ascending: false })
        .limit(50);

      if (error) throw error;
      setPosts(data || []);
    } catch (error) {
      console.error('Error loading posts:', error);
      toast.error("Failed to load community posts");
    } finally {
      setLoading(false);
    }
  };

  const handleCreatePost = async () => {
    if (!newTitle.trim() || !newContent.trim()) {
      toast.error("Please fill in title and content");
      return;
    }

    setCreating(true);
    try {
      const { error } = await supabase
        .from('community_posts')
        .insert({
          user_id: user!.id,
          title: newTitle.trim(),
          content: newContent.trim(),
          category: 'church-fellowship',
        });

      if (error) throw error;

      toast.success("Post shared with your church community!");
      setNewTitle("");
      setNewContent("");
      setShowCreateDialog(false);
      loadPosts();
    } catch (error) {
      console.error('Error creating post:', error);
      toast.error("Failed to create post");
    } finally {
      setCreating(false);
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
      <Card variant="glass">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-foreground">Church Community</CardTitle>
              <p className="text-foreground/70 text-sm mt-1">
                Share thoughts, prayers, and encouragements with your church family
              </p>
            </div>
            <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
              <DialogTrigger asChild>
                <Button className="gap-2">
                  <Plus className="h-4 w-4" />
                  New Post
                </Button>
              </DialogTrigger>
              <DialogContent className="glass-card">
                <DialogHeader>
                  <DialogTitle>Share with your Church</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <Input
                    placeholder="Title"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    className="bg-background/50"
                  />
                  <Textarea
                    placeholder="What's on your heart?"
                    value={newContent}
                    onChange={(e) => setNewContent(e.target.value)}
                    className="bg-background/50 min-h-[120px]"
                  />
                  <Button
                    onClick={handleCreatePost}
                    disabled={creating}
                    className="w-full"
                  >
                    {creating ? (
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    ) : (
                      <Send className="h-4 w-4 mr-2" />
                    )}
                    Share Post
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
      </Card>

      {/* Posts */}
      <div className="space-y-4">
        {posts.length === 0 ? (
          <Card variant="glass">
            <CardContent className="py-12 text-center">
              <MessageSquare className="h-12 w-12 text-foreground/30 mx-auto mb-4" />
              <p className="text-foreground/60">No posts yet</p>
              <p className="text-sm text-foreground/50 mt-1">
                Be the first to share something with your church family!
              </p>
            </CardContent>
          </Card>
        ) : (
          posts.map((post) => (
            <Card key={post.id} variant="glass" className="overflow-hidden">
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={post.profiles?.avatar_url || undefined} />
                    <AvatarFallback>
                      {(post.profiles?.display_name || post.profiles?.username || 'U').charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-medium text-foreground">
                        {post.profiles?.display_name || post.profiles?.username || 'Anonymous'}
                      </span>
                      <Badge variant="outline" className="text-xs">
                        Church Family
                      </Badge>
                      <span className="text-xs text-foreground/50">
                        {formatDistanceToNow(new Date(post.created_at), { addSuffix: true })}
                      </span>
                    </div>
                    <h3 className="font-semibold text-foreground mt-2">{post.title}</h3>
                    <p className="text-foreground/80 mt-1 whitespace-pre-wrap">{post.content}</p>
                    <div className="flex items-center gap-4 mt-3">
                      <Button variant="ghost" size="sm" className="gap-1 text-foreground/60 hover:text-primary">
                        <Heart className="h-4 w-4" />
                        {post.likes || 0}
                      </Button>
                      <Button variant="ghost" size="sm" className="gap-1 text-foreground/60 hover:text-primary">
                        <MessageSquare className="h-4 w-4" />
                        Reply
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
