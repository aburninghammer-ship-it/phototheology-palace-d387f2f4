import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Gift, Users, Copy, Check, Share2, Trophy } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";

export const ReferralProgram = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [copied, setCopied] = useState(false);

  // Generate referral code from user ID
  const referralCode = user?.id ? `PT-${user.id.slice(0, 8).toUpperCase()}` : "PT-XXXXXX";
  const referralLink = `${window.location.origin}?ref=${referralCode}`;

  // Mock referral stats
  const referralStats = {
    totalReferred: 2,
    pendingRewards: 1,
    earnedMonths: 0,
    nextRewardAt: 3,
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(referralLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    toast({ title: "Copied!", description: "Referral link copied to clipboard" });
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: "Join Phototheology",
          text: "Learn the Bible 5x faster with the Palace method!",
          url: referralLink,
        });
      } catch (err) {
        handleCopy();
      }
    } else {
      handleCopy();
    }
  };

  const progress = (referralStats.totalReferred / referralStats.nextRewardAt) * 100;

  return (
    <Card className="overflow-hidden">
      <div className="h-2 bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500" />
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Gift className="h-5 w-5 text-emerald-500" />
          Refer Friends, Earn Rewards
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Reward Banner */}
        <div className="p-4 rounded-xl bg-gradient-to-r from-emerald-100 to-teal-100 dark:from-emerald-950 dark:to-teal-950 border border-emerald-200 dark:border-emerald-800">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-full bg-emerald-500">
              <Trophy className="h-5 w-5 text-white" />
            </div>
            <div>
              <p className="font-bold text-emerald-700 dark:text-emerald-300">
                Invite 3 friends → Get 1 month FREE!
              </p>
              <p className="text-sm text-emerald-600 dark:text-emerald-400">
                They get 20% off their first month too
              </p>
            </div>
          </div>
        </div>

        {/* Progress */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="flex items-center gap-1">
              <Users className="h-4 w-4" />
              {referralStats.totalReferred} friends referred
            </span>
            <span className="text-muted-foreground">
              {referralStats.nextRewardAt - referralStats.totalReferred} more for reward
            </span>
          </div>
          <Progress value={progress} className="h-3" />
        </div>

        {/* Referral Link */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Your Referral Link</label>
          <div className="flex gap-2">
            <Input 
              value={referralLink} 
              readOnly 
              className="bg-muted/50 text-sm"
            />
            <Button onClick={handleCopy} variant="secondary" size="icon">
              {copied ? <Check className="h-4 w-4 text-emerald-500" /> : <Copy className="h-4 w-4" />}
            </Button>
          </div>
        </div>

        {/* Referral Code */}
        <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
          <div>
            <p className="text-xs text-muted-foreground">Referral Code</p>
            <p className="font-mono font-bold">{referralCode}</p>
          </div>
          <Badge variant="outline">Share this code</Badge>
        </div>

        {/* Share Buttons */}
        <div className="grid grid-cols-2 gap-2">
          <Button onClick={handleCopy} variant="outline" className="gap-2">
            <Copy className="h-4 w-4" />
            Copy Link
          </Button>
          <Button onClick={handleShare} className="gap-2 bg-gradient-to-r from-emerald-500 to-teal-500">
            <Share2 className="h-4 w-4" />
            Share
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-2 pt-4 border-t">
          <div className="text-center">
            <p className="text-xl font-bold">{referralStats.totalReferred}</p>
            <p className="text-xs text-muted-foreground">Referred</p>
          </div>
          <div className="text-center">
            <p className="text-xl font-bold">{referralStats.pendingRewards}</p>
            <p className="text-xs text-muted-foreground">Pending</p>
          </div>
          <div className="text-center">
            <p className="text-xl font-bold text-emerald-500">{referralStats.earnedMonths}</p>
            <p className="text-xs text-muted-foreground">Months Earned</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
