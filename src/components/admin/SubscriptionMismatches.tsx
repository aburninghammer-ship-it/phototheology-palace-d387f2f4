import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2, RefreshCw, AlertTriangle, CheckCircle, User, Search } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

interface SubscriptionRecord {
  user_id: string;
  email: string;
  db_status: string | null;
  db_tier: string | null;
  stripe_customer_id: string | null;
  stripe_subscription_id: string | null;
  has_mismatch: boolean;
  mismatch_reason?: string;
}

export function SubscriptionMismatches() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState<string | null>(null);
  const [records, setRecords] = useState<SubscriptionRecord[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showMismatchesOnly, setShowMismatchesOnly] = useState(true);

  useEffect(() => {
    loadSubscriptionData();
  }, []);

  const loadSubscriptionData = async () => {
    setLoading(true);
    try {
      // Get all users with their subscription data
      const { data: subscriptions, error } = await supabase
        .from("user_subscriptions")
        .select(`
          user_id,
          subscription_status,
          subscription_tier,
          stripe_customer_id,
          stripe_subscription_id,
          has_lifetime_access,
          trial_ends_at
        `)
        .order("updated_at", { ascending: false });

      if (error) throw error;

      // Get user emails
      const { data: users } = await supabase
        .rpc('is_admin_user', { _user_id: (await supabase.auth.getUser()).data.user?.id });

      // For admin, get email addresses from profiles or auth
      const userIds = subscriptions?.map(s => s.user_id) || [];
      
      // Get profiles for display names/emails
      const { data: profiles } = await supabase
        .from("profiles")
        .select("id, display_name")
        .in("id", userIds);

      const profileMap = new Map(profiles?.map(p => [p.id, p.display_name]) || []);

      // Map the data and check for potential mismatches
      const mappedRecords: SubscriptionRecord[] = (subscriptions || []).map(sub => {
        let hasMismatch = false;
        let mismatchReason = "";

        // Check for potential issues
        if (sub.subscription_status === 'active' && !sub.stripe_subscription_id) {
          // Active without Stripe subscription - might be lifetime or church
          if (!sub.has_lifetime_access) {
            hasMismatch = true;
            mismatchReason = "Active status but no Stripe subscription";
          }
        }

        if (sub.stripe_subscription_id && sub.subscription_status !== 'active') {
          // Has Stripe subscription but not active
          if (sub.subscription_status !== 'trial') {
            hasMismatch = true;
            mismatchReason = "Has Stripe subscription but status is not active";
          }
        }

        // Check for expired trials
        if (sub.subscription_status === 'trial' && sub.trial_ends_at) {
          const trialEnd = new Date(sub.trial_ends_at);
          if (trialEnd < new Date()) {
            hasMismatch = true;
            mismatchReason = "Trial has expired but status still shows trial";
          }
        }

        return {
          user_id: sub.user_id,
          email: profileMap.get(sub.user_id) || sub.user_id.slice(0, 8),
          db_status: sub.subscription_status,
          db_tier: sub.subscription_tier,
          stripe_customer_id: sub.stripe_customer_id,
          stripe_subscription_id: sub.stripe_subscription_id,
          has_mismatch: hasMismatch,
          mismatch_reason: mismatchReason,
        };
      });

      setRecords(mappedRecords);
    } catch (error) {
      console.error("Error loading subscription data:", error);
      toast({
        title: "Error",
        description: "Failed to load subscription data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSyncAll = async () => {
    setSyncing("all");
    try {
      const { data, error } = await supabase.functions.invoke('sync-stripe-subscriptions');
      
      if (error) throw error;
      
      toast({
        title: "Sync Complete",
        description: `Synced ${data?.updated || 0} subscriptions. ${data?.errors || 0} errors.`,
      });
      
      await loadSubscriptionData();
    } catch (error: any) {
      console.error("Sync error:", error);
      toast({
        title: "Sync Failed",
        description: error.message || "Failed to sync subscriptions",
        variant: "destructive",
      });
    } finally {
      setSyncing(null);
    }
  };

  const filteredRecords = records.filter(record => {
    const matchesSearch = 
      record.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.user_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.stripe_customer_id?.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (showMismatchesOnly) {
      return matchesSearch && record.has_mismatch;
    }
    return matchesSearch;
  });

  const mismatchCount = records.filter(r => r.has_mismatch).length;

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                Subscription Health Check
                {mismatchCount > 0 ? (
                  <Badge variant="destructive">{mismatchCount} issues</Badge>
                ) : (
                  <Badge variant="default" className="bg-green-500">All healthy</Badge>
                )}
              </CardTitle>
              <CardDescription>
                Compare database records with Stripe subscriptions
              </CardDescription>
            </div>
            <Button 
              onClick={handleSyncAll} 
              disabled={syncing === "all"}
            >
              {syncing === "all" ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Syncing All...
                </>
              ) : (
                <>
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Sync All from Stripe
                </>
              )}
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-4 items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by email, user ID, or Stripe customer ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button
              variant={showMismatchesOnly ? "default" : "outline"}
              onClick={() => setShowMismatchesOnly(!showMismatchesOnly)}
            >
              {showMismatchesOnly ? "Showing Issues Only" : "Show All"}
            </Button>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User</TableHead>
                  <TableHead>DB Status</TableHead>
                  <TableHead>DB Tier</TableHead>
                  <TableHead>Stripe Customer</TableHead>
                  <TableHead>Stripe Subscription</TableHead>
                  <TableHead>Issue</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredRecords.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                      {showMismatchesOnly 
                        ? "No subscription mismatches found!" 
                        : "No subscriptions found matching your search"}
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredRecords.map((record) => (
                    <TableRow key={record.user_id} className={record.has_mismatch ? "bg-destructive/5" : ""}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4 text-muted-foreground" />
                          <div>
                            <div className="font-medium">{record.email}</div>
                            <div className="text-xs text-muted-foreground">{record.user_id.slice(0, 8)}...</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={record.db_status === 'active' ? 'default' : 'secondary'}>
                          {record.db_status || 'none'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{record.db_tier || 'free'}</Badge>
                      </TableCell>
                      <TableCell>
                        <span className="text-xs font-mono">
                          {record.stripe_customer_id ? record.stripe_customer_id.slice(0, 12) + '...' : '-'}
                        </span>
                      </TableCell>
                      <TableCell>
                        <span className="text-xs font-mono">
                          {record.stripe_subscription_id ? record.stripe_subscription_id.slice(0, 12) + '...' : '-'}
                        </span>
                      </TableCell>
                      <TableCell>
                        {record.has_mismatch ? (
                          <div className="flex items-center gap-2 text-destructive">
                            <AlertTriangle className="h-4 w-4" />
                            <span className="text-xs">{record.mismatch_reason}</span>
                          </div>
                        ) : (
                          <div className="flex items-center gap-2 text-green-600">
                            <CheckCircle className="h-4 w-4" />
                            <span className="text-xs">OK</span>
                          </div>
                        )}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          <div className="text-sm text-muted-foreground">
            Showing {filteredRecords.length} of {records.length} records
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
