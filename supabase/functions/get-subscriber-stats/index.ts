import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

    if (!supabaseUrl || !supabaseServiceKey) {
      throw new Error("Supabase credentials not configured");
    }

    // Verify the caller is an admin
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      throw new Error("Authorization required");
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Verify user is admin
    const userClient = createClient(supabaseUrl, supabaseServiceKey, {
      global: { headers: { Authorization: authHeader } }
    });

    const { data: { user }, error: authError } = await userClient.auth.getUser();
    if (authError || !user) {
      throw new Error("Invalid authorization");
    }

    // Check if user is admin
    const { data: adminCheck } = await supabase
      .from("admin_users")
      .select("user_id")
      .eq("user_id", user.id)
      .single();

    if (!adminCheck) {
      throw new Error("Admin access required");
    }

    // Get subscriber counts by tier and status
    const { data: profiles, error: profilesError } = await supabase
      .from("profiles")
      .select("subscription_tier, subscription_status, payment_source, created_at");

    if (profilesError) {
      throw profilesError;
    }

    // Calculate statistics
    const stats = {
      total_users: profiles.length,
      by_tier: {
        free: 0,
        essential: 0,
        premium: 0,
        student: 0,
        patron: 0,
        null: 0,
      },
      by_status: {
        none: 0,
        trial: 0,
        active: 0,
        cancelled: 0,
        expired: 0,
        null: 0,
      },
      by_payment_source: {
        stripe: 0,
        patreon: 0,
        null: 0,
      },
      paid_subscribers: 0,
      active_trials: 0,
      patreon_patrons: 0,
      stripe_subscribers: 0,
    };

    profiles.forEach((profile: any) => {
      // Count by tier
      const tier = profile.subscription_tier || "null";
      if (tier in stats.by_tier) {
        stats.by_tier[tier as keyof typeof stats.by_tier]++;
      }

      // Count by status
      const status = profile.subscription_status || "null";
      if (status in stats.by_status) {
        stats.by_status[status as keyof typeof stats.by_status]++;
      }

      // Count by payment source
      const source = profile.payment_source || "null";
      if (source in stats.by_payment_source) {
        stats.by_payment_source[source as keyof typeof stats.by_payment_source]++;
      }

      // Calculate totals
      if (profile.subscription_status === "active" &&
          (profile.subscription_tier === "essential" ||
           profile.subscription_tier === "premium" ||
           profile.subscription_tier === "patron")) {
        stats.paid_subscribers++;
      }

      if (profile.subscription_status === "trial") {
        stats.active_trials++;
      }

      if (profile.payment_source === "patreon" && profile.subscription_status === "active") {
        stats.patreon_patrons++;
      }

      if (profile.payment_source === "stripe" && profile.subscription_status === "active") {
        stats.stripe_subscribers++;
      }
    });

    // Get Patreon connection details
    const { data: patreonConnections } = await supabase
      .from("patreon_connections")
      .select("is_active_patron, entitled_cents")
      .eq("is_active_patron", true);

    const patreonStats = {
      total_connected: patreonConnections?.length || 0,
      active_patrons: patreonConnections?.filter((p: any) => p.is_active_patron).length || 0,
      at_20_or_above: patreonConnections?.filter((p: any) => p.entitled_cents >= 2000).length || 0,
      below_20: patreonConnections?.filter((p: any) => p.entitled_cents < 2000 && p.entitled_cents > 0).length || 0,
    };

    // Get recent signups (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const recentSignups = profiles.filter((p: any) =>
      new Date(p.created_at) > thirtyDaysAgo
    ).length;

    return new Response(
      JSON.stringify({
        success: true,
        stats: {
          ...stats,
          patreon: patreonStats,
          recent_signups_30d: recentSignups,
          generated_at: new Date().toISOString(),
        },
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error: unknown) {
    console.error("Get subscriber stats error:", error);
    const message = error instanceof Error ? error.message : "Unknown error";
    return new Response(
      JSON.stringify({ error: message }),
      { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
