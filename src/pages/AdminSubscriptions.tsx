import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, RefreshCw } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface SubscriptionStats {
  totalPaid: number;
  byTier: {
    essential: number;
    premium: number;
    student: number;
  };
  totalLifetime: number;
  totalTrial: number;
  totalChurches: number;
  churchSeats: {
    tier1: number;
    tier2: number;
    tier3: number;
  };
}

export default function AdminSubscriptions() {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [stats, setStats] = useState<SubscriptionStats | null>(null);

  const handleSyncStripeSubscriptions = async () => {
    setSyncing(true);
    try {
      const { data, error } = await supabase.functions.invoke('sync-stripe-subscriptions');
      
      if (error) throw error;
      
      toast({
        title: "Sync Complete",
        description: `Synced ${data?.synced || 0} subscriptions successfully`,
      });
      
      // Reload stats after sync
      await loadStats();
    } catch (error: any) {
      console.error("Sync error:", error);
      toast({
        title: "Sync Failed",
        description: error.message || "Failed to sync subscriptions",
        variant: "destructive",
      });
    } finally {
      setSyncing(false);
    }
  };

  useEffect(() => {
    // Wait for auth to finish loading before making any decisions
    if (authLoading) {
      console.log("[AdminSubscriptions] Auth still loading...");
      return;
    }
    
    if (!user) {
      console.log("[AdminSubscriptions] No user, redirecting to auth");
      navigate("/auth");
      return;
    }
    
    checkAdminAndLoadStats();
  }, [user, authLoading, navigate]);

  const checkAdminAndLoadStats = async () => {
    if (!user) return;

    console.log("[AdminSubscriptions] Checking admin for user:", user.id);

    // Check if user is admin using the has_role function for security
    const { data: roleData, error: roleError } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", user.id)
      .eq("role", "admin")
      .maybeSingle();

    console.log("[AdminSubscriptions] Role check result:", { roleData, roleError });

    if (roleError) {
      console.error("[AdminSubscriptions] Error checking role:", roleError);
    }

    if (!roleData) {
      console.log("[AdminSubscriptions] No admin role found, redirecting to dashboard");
      setIsAdmin(false);
      navigate("/dashboard");
      return;
    }

    setIsAdmin(true);
    await loadStats();
  };

  const loadStats = async () => {
    try {
      // Get user subscriptions from user_subscriptions table (synced from Stripe)
      const { data: userSubs } = await supabase
        .from("user_subscriptions")
        .select("subscription_status, subscription_tier, payment_source, is_recurring, trial_ends_at");

      // Also get profiles for lifetime access info
      const { data: profiles } = await supabase
        .from("profiles")
        .select("has_lifetime_access, payment_source, subscription_tier");

      // Get church subscriptions
      const { data: churches } = await supabase
        .from("churches")
        .select("tier, max_seats, subscription_status")
        .eq("subscription_status", "active");

      const now = new Date();
      
      let totalPaid = 0;
      let totalLifetime = 0;
      let totalTrial = 0;
      const tierCounts = { essential: 0, premium: 0, student: 0 };

      // Count from user_subscriptions (Stripe synced data)
      // Note: is_recurring=true indicates an active Stripe subscription (set by sync function)
      userSubs?.forEach(sub => {
        const trialValid = sub.trial_ends_at && new Date(sub.trial_ends_at) > now;
        const isStripePaid = sub.subscription_status === 'active' && (sub.payment_source === 'stripe' || sub.is_recurring === true);
        
        if (isStripePaid) {
          totalPaid++;
          if (sub.subscription_tier === 'essential') tierCounts.essential++;
          else if (sub.subscription_tier === 'premium') tierCounts.premium++;
          else if (sub.subscription_tier === 'student') tierCounts.student++;
        } else if (sub.subscription_status === 'trial' || (trialValid && !isStripePaid)) {
          totalTrial++;
        }
      });

      // Count lifetime access from profiles
      profiles?.forEach(profile => {
        if (profile.has_lifetime_access && profile.payment_source === 'lifetime') {
          totalLifetime++;
          totalPaid++;
          if (profile.subscription_tier === 'essential') tierCounts.essential++;
          else if (profile.subscription_tier === 'premium') tierCounts.premium++;
        }
      });

      const churchSeats = {
        tier1: churches?.filter(c => c.tier === 'tier1').reduce((sum, c) => sum + c.max_seats, 0) || 0,
        tier2: churches?.filter(c => c.tier === 'tier2').reduce((sum, c) => sum + c.max_seats, 0) || 0,
        tier3: churches?.filter(c => c.tier === 'tier3').reduce((sum, c) => sum + c.max_seats, 0) || 0,
      };

      setStats({
        totalPaid,
        byTier: tierCounts,
        totalLifetime,
        totalTrial,
        totalChurches: churches?.length || 0,
        churchSeats,
      });
    } catch (error) {
      console.error("Error loading stats:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!stats) return null;

  return (
    <div className="container mx-auto p-6 max-w-6xl">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Subscription Analytics</h1>
          <p className="text-muted-foreground">Overview of paid users and church subscriptions</p>
        </div>
        <Button 
          onClick={handleSyncStripeSubscriptions} 
          disabled={syncing}
          variant="outline"
        >
          {syncing ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Syncing...
            </>
          ) : (
            <>
              <RefreshCw className="h-4 w-4 mr-2" />
              Sync Stripe Subscriptions
            </>
          )}
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-6">
        <Card>
          <CardHeader>
            <CardTitle>Total Paid Users</CardTitle>
            <CardDescription>Active paying subscribers</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold">{stats.totalPaid}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Trial Users</CardTitle>
            <CardDescription>Currently in trial period</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold">{stats.totalTrial}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Lifetime Access</CardTitle>
            <CardDescription>Users with lifetime premium</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold">{stats.totalLifetime}</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2 mb-6">
        <Card>
          <CardHeader>
            <CardTitle>Individual Subscriptions by Tier</CardTitle>
            <CardDescription>Breakdown of subscription tiers</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Essential</span>
              <span className="text-2xl font-bold">{stats.byTier.essential}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Premium</span>
              <span className="text-2xl font-bold">{stats.byTier.premium}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Student</span>
              <span className="text-2xl font-bold">{stats.byTier.student}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Church Subscriptions</CardTitle>
            <CardDescription>Active church accounts and seats</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Total Churches</span>
              <span className="text-2xl font-bold">{stats.totalChurches}</span>
            </div>
            <div className="border-t pt-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Tier 1 Seats (30)</span>
                <span className="font-medium">{stats.churchSeats.tier1}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Tier 2 Seats (100)</span>
                <span className="font-medium">{stats.churchSeats.tier2}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Tier 3 Seats (Unlimited)</span>
                <span className="font-medium">{stats.churchSeats.tier3}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
