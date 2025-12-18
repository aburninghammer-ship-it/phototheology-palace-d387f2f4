import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import { Loader2, MessageCircle, Send, Search, Users, ArrowLeft } from "lucide-react";
import { useDirectMessagesContext } from "@/contexts/DirectMessagesContext";

interface ChurchMember {
  id: string;
  user_id: string;
  role: string;
  profile?: {
    id: string;
    username: string;
    display_name: string | null;
    avatar_url: string | null;
  };
}

interface ChurchMessagingProps {
  churchId: string;
}

export function ChurchMessaging({ churchId }: ChurchMessagingProps) {
  const { user } = useAuth();
  const { startConversation, conversations, activeConversationId, setActiveConversationId, messages, sendMessage, isLoading } = useDirectMessagesContext();
  const [members, setMembers] = useState<ChurchMember[]>([]);
  const [loadingMembers, setLoadingMembers] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [messageInput, setMessageInput] = useState("");
  const [selectedMember, setSelectedMember] = useState<ChurchMember | null>(null);
  const [startingConversation, setStartingConversation] = useState(false);

  useEffect(() => {
    loadMembers();
  }, [churchId]);

  const loadMembers = async () => {
    try {
      // First get church members
      const { data: membersData, error: membersError } = await supabase
        .from('church_members')
        .select('id, user_id, role')
        .eq('church_id', churchId);

      if (membersError) throw membersError;
      
      if (!membersData || membersData.length === 0) {
        setMembers([]);
        return;
      }

      // Then get profiles for those members
      const userIds = membersData.map(m => m.user_id).filter(id => id !== user?.id);
      
      const { data: profilesData, error: profilesError } = await supabase
        .from('profiles')
        .select('id, username, display_name, avatar_url')
        .in('id', userIds);

      if (profilesError) throw profilesError;

      // Combine the data
      const membersWithProfiles = membersData
        .filter(m => m.user_id !== user?.id)
        .map(member => ({
          ...member,
          profile: profilesData?.find(p => p.id === member.user_id)
        }));

      setMembers(membersWithProfiles);
    } catch (error) {
      console.error('Error loading members:', error);
      toast.error("Failed to load church members");
    } finally {
      setLoadingMembers(false);
    }
  };

  const handleStartChat = async (member: ChurchMember) => {
    if (!member.profile?.id) return;
    
    setStartingConversation(true);
    try {
      const conversationId = await startConversation(member.profile.id);
      setActiveConversationId(conversationId);
      setSelectedMember(member);
    } catch (error) {
      console.error('Error starting conversation:', error);
      toast.error("Failed to start conversation");
    } finally {
      setStartingConversation(false);
    }
  };

  const handleSendMessage = async () => {
    if (!messageInput.trim() || !activeConversationId) return;
    
    try {
      await sendMessage(messageInput.trim());
      setMessageInput("");
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error("Failed to send message");
    }
  };

  const filteredMembers = members.filter(member => {
    const name = member.profile?.display_name || member.profile?.username || '';
    return name.toLowerCase().includes(searchQuery.toLowerCase());
  });

  if (loadingMembers) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-4 lg:space-y-0 lg:grid lg:grid-cols-3 lg:gap-6">
      {/* Members List - Full width on mobile when no conversation selected */}
      <Card variant="glass" className={`lg:col-span-1 ${activeConversationId && 'hidden lg:block'}`}>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2 text-foreground">
            <Users className="h-5 w-5" />
            Church Members
          </CardTitle>
          <div className="relative mt-2">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-foreground/50" />
            <Input
              placeholder="Search members..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-background/50"
            />
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <ScrollArea className="h-[350px] lg:h-[400px]">
            <div className="p-2 space-y-1">
              {filteredMembers.length === 0 ? (
                <p className="text-center text-foreground/50 py-8 text-sm">
                  No members found
                </p>
              ) : (
                filteredMembers.map((member) => (
                  <button
                    key={member.id}
                    onClick={() => handleStartChat(member)}
                    className={`w-full flex items-center gap-3 p-3 rounded-lg transition-colors text-left hover:bg-primary/10 ${
                      selectedMember?.id === member.id ? 'bg-primary/20' : ''
                    }`}
                    disabled={startingConversation}
                  >
                    <Avatar className="h-10 w-10 shrink-0">
                      <AvatarImage src={member.profile?.avatar_url || undefined} />
                      <AvatarFallback>
                        {(member.profile?.display_name || member.profile?.username || 'U').charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-foreground truncate">
                        {member.profile?.display_name || member.profile?.username || 'Unknown'}
                      </p>
                      <Badge variant="outline" className="text-xs capitalize">
                        {member.role}
                      </Badge>
                    </div>
                    <MessageCircle className="h-4 w-4 text-primary shrink-0" />
                  </button>
                ))
              )}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>

      {/* Chat Area - Full width on mobile */}
      <Card variant="glass" className={`lg:col-span-2 ${!activeConversationId && 'hidden lg:block'}`}>
        <CardHeader className="pb-3 border-b border-border/30">
          {selectedMember ? (
            <div className="flex items-center gap-3">
              {/* Mobile back button */}
              <Button 
                variant="ghost" 
                size="icon" 
                className="lg:hidden h-9 w-9 shrink-0"
                onClick={() => {
                  setActiveConversationId(null);
                  setSelectedMember(null);
                }}
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <Avatar className="h-10 w-10 shrink-0">
                <AvatarImage src={selectedMember.profile?.avatar_url || undefined} />
                <AvatarFallback>
                  {(selectedMember.profile?.display_name || selectedMember.profile?.username || 'U').charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="min-w-0 flex-1">
                <CardTitle className="text-lg text-foreground truncate">
                  {selectedMember.profile?.display_name || selectedMember.profile?.username}
                </CardTitle>
                <p className="text-sm text-foreground/60 capitalize">{selectedMember.role}</p>
              </div>
            </div>
          ) : (
            <CardTitle className="text-lg text-foreground/60">
              Select a member to start chatting
            </CardTitle>
          )}
        </CardHeader>
        <CardContent className="p-0 flex flex-col h-[350px] lg:h-[400px]">
          {activeConversationId ? (
            <>
              <ScrollArea className="flex-1 p-4">
                <div className="space-y-3">
                  {messages.map((msg) => (
                    <div
                      key={msg.id}
                      className={`flex ${msg.sender_id === user?.id ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-[80%] lg:max-w-[70%] px-4 py-2 rounded-2xl ${
                          msg.sender_id === user?.id
                            ? 'bg-primary text-primary-foreground'
                            : 'bg-secondary text-secondary-foreground'
                        }`}
                      >
                        <p className="text-sm break-words">{msg.content}</p>
                      </div>
                    </div>
                  ))}
                  {messages.length === 0 && (
                    <p className="text-center text-foreground/50 text-sm">
                      Start a conversation!
                    </p>
                  )}
                </div>
              </ScrollArea>
              <div className="p-4 border-t border-border/30">
                <div className="flex gap-2">
                  <Input
                    placeholder="Type a message..."
                    value={messageInput}
                    onChange={(e) => setMessageInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleSendMessage()}
                    className="bg-background/50 flex-1"
                  />
                  <Button 
                    onClick={handleSendMessage} 
                    disabled={isLoading || !messageInput.trim()}
                    size="icon"
                    className="shrink-0"
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center px-4">
                <MessageCircle className="h-12 w-12 text-foreground/30 mx-auto mb-4" />
                <p className="text-foreground/60">Select a church member</p>
                <p className="text-sm text-foreground/40">to start a private conversation</p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
