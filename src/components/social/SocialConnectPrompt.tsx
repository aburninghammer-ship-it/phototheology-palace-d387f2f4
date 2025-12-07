import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Facebook, Twitter, Linkedin, Share2, Sparkles, Check, Link2 } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";

interface SocialConnectPromptProps {
  variant?: "inline" | "modal" | "compact";
  trigger?: React.ReactNode;
  onConnected?: () => void;
}

export const SocialConnectPrompt = ({ 
  variant = "inline", 
  trigger,
  onConnected 
}: SocialConnectPromptProps) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const { data: connections } = useQuery({
    queryKey: ['social-connections', user?.id],
    queryFn: async () => {
      if (!user) return [];
      const { data, error } = await supabase
        .from('social_media_connections')
        .select('platform, is_active')
        .eq('user_id', user.id)
        .eq('is_active', true);
      
      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });

  const connectedPlatforms = connections?.map(c => c.platform) || [];
  const hasAnyConnection = connectedPlatforms.length > 0;

  const platforms = [
    { name: 'facebook', icon: Facebook, label: 'Facebook', color: 'text-blue-600', bg: 'bg-blue-500/10' },
    { name: 'twitter', icon: Twitter, label: 'Twitter/X', color: 'text-sky-500', bg: 'bg-sky-500/10' },
    { name: 'linkedin', icon: Linkedin, label: 'LinkedIn', color: 'text-blue-700', bg: 'bg-blue-700/10' },
  ];

  const goToProfile = () => {
    setOpen(false);
    navigate('/profile#social');
  };

  if (!user) {
    return null;
  }

  // Compact badge version
  if (variant === "compact") {
    if (hasAnyConnection) {
      return (
        <div className="flex items-center gap-1">
          {connectedPlatforms.map(platform => {
            const p = platforms.find(pl => pl.name === platform);
            if (!p) return null;
            const Icon = p.icon;
            return (
              <Badge key={platform} variant="secondary" className={`${p.bg} ${p.color} gap-1`}>
                <Icon className="h-3 w-3" />
              </Badge>
            );
          })}
        </div>
      );
    }

    return (
      <Button variant="ghost" size="sm" className="gap-1 text-muted-foreground" onClick={goToProfile}>
        <Link2 className="h-3 w-3" />
        Connect Social
      </Button>
    );
  }

  // Modal version
  if (variant === "modal") {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          {trigger || (
            <Button variant="outline" size="sm" className="gap-2">
              <Share2 className="h-4 w-4" />
              {hasAnyConnection ? "Share" : "Connect & Share"}
            </Button>
          )}
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-primary" />
              Share Your Insights
            </DialogTitle>
            <DialogDescription>
              Connect your social media to share gems, achievements, and studies directly
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3 py-4">
            {platforms.map(platform => {
              const Icon = platform.icon;
              const isConnected = connectedPlatforms.includes(platform.name);
              
              return (
                <div 
                  key={platform.name}
                  className={`flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 sm:p-4 rounded-lg border transition-colors ${
                    isConnected ? 'bg-muted/50 border-green-500/30' : 'hover:bg-muted/30'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-full ${platform.bg}`}>
                      <Icon className={`h-4 w-4 sm:h-5 sm:w-5 ${platform.color}`} />
                    </div>
                    <div>
                      <p className="font-medium text-sm sm:text-base">{platform.label}</p>
                      <p className="text-xs sm:text-sm text-muted-foreground">
                        {isConnected ? "Ready to share" : "Not connected"}
                      </p>
                    </div>
                  </div>
                  {isConnected ? (
                    <Badge variant="secondary" className="bg-green-500/10 text-green-600 gap-1 self-start sm:self-center">
                      <Check className="h-3 w-3" />
                      Connected
                    </Badge>
                  ) : (
                    <Button size="sm" variant="outline" onClick={goToProfile} className="w-full sm:w-auto">
                      Connect
                    </Button>
                  )}
                </div>
              );
            })}

            {!hasAnyConnection && (
              <p className="text-sm text-muted-foreground text-center pt-2">
                Connect at least one platform to share directly from the app
              </p>
            )}

            <Button onClick={goToProfile} variant="ghost" className="w-full">
              Manage Social Connections
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  // Inline card version (default)
  if (hasAnyConnection) {
    return (
      <Card className="bg-gradient-to-r from-green-500/10 via-blue-500/5 to-purple-500/10 border-green-500/20">
        <CardContent className="p-3 sm:p-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="flex -space-x-2 flex-shrink-0">
                {connectedPlatforms.map(platform => {
                  const p = platforms.find(pl => pl.name === platform);
                  if (!p) return null;
                  const Icon = p.icon;
                  return (
                    <div key={platform} className={`p-1.5 rounded-full ${p.bg} border-2 border-background`}>
                      <Icon className={`h-3 w-3 sm:h-4 sm:w-4 ${p.color}`} />
                    </div>
                  );
                })}
              </div>
              <div className="min-w-0">
                <p className="font-medium text-sm">Social Sharing Enabled</p>
                <p className="text-xs text-muted-foreground">
                  {connectedPlatforms.length} platform{connectedPlatforms.length !== 1 ? 's' : ''} connected
                </p>
              </div>
            </div>
            <Button size="sm" variant="ghost" onClick={goToProfile} className="w-full sm:w-auto">
              Manage
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-gradient-to-r from-primary/5 via-accent/5 to-primary/10 border-primary/20">
      <CardHeader className="pb-2 px-4 sm:px-6">
        <CardTitle className="text-sm sm:text-base flex items-center gap-2">
          <Share2 className="h-4 w-4 sm:h-5 sm:w-5 text-primary flex-shrink-0" />
          Share Your Journey
        </CardTitle>
        <CardDescription className="text-xs sm:text-sm">
          Connect social accounts to share insights, gems, and achievements
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-2 px-4 sm:px-6">
        <div className="flex items-center gap-3 sm:gap-4 mb-4">
          {platforms.map(platform => {
            const Icon = platform.icon;
            return (
              <div key={platform.name} className={`p-1.5 sm:p-2 rounded-full ${platform.bg}`}>
                <Icon className={`h-4 w-4 sm:h-5 sm:w-5 ${platform.color}`} />
              </div>
            );
          })}
        </div>
        <Button onClick={goToProfile} className="w-full" size="sm">
          Connect Social Accounts
        </Button>
      </CardContent>
    </Card>
  );
};
