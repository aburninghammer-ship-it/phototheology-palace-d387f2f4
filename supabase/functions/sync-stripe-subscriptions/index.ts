import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@18.5.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const logStep = (step: string, details?: any) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[SYNC-STRIPE-SUBSCRIPTIONS] ${step}${detailsStr}`);
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    logStep("Function started");

    // Get the authorization header
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(JSON.stringify({ error: "Missing authorization header" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") || "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || ""
    );

    // Verify the user is authenticated and is an admin
    const token = authHeader.replace("Bearer ", "");
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    
    if (authError || !user) {
      logStep("Authentication error", { error: authError });
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Check if user has admin role OR is in admin_users table
    const { data: roleData } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", user.id)
      .eq("role", "admin")
      .single();

    const { data: adminUser } = await supabase
      .from("admin_users")
      .select("id")
      .eq("user_id", user.id)
      .single();

    if (!roleData && !adminUser) {
      logStep("Admin role check failed");
      return new Response(JSON.stringify({ error: "Forbidden: Admin role required" }), {
        status: 403,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    logStep("Admin user verified", { email: user.email });

    const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") || "", {
      apiVersion: "2025-08-27.basil",
    });

    logStep("Starting Stripe subscription sync...");

    const results: any[] = [];

    // Get all users from auth
    const { data: authData, error: listError } = await supabase.auth.admin.listUsers({
      perPage: 1000,
    });

    if (listError) {
      logStep("Error listing users", { error: listError });
      throw new Error("Failed to list users: " + listError.message);
    }

    const users = authData?.users || [];
    logStep(`Found ${users.length} users to check`);

    // For each user, check if they have a Stripe subscription
    for (const authUser of users) {
      try {
        if (!authUser.email) continue;

        // Search for Stripe customer by email
        const customers = await stripe.customers.list({
          email: authUser.email,
          limit: 1,
        });

        if (customers.data.length === 0) continue;

        const customer = customers.data[0];
        
        // Check for active subscription
        const subscriptions = await stripe.subscriptions.list({
          customer: customer.id,
          status: "active",
          limit: 1,
        });

        // Also check trialing
        const trialingSubscriptions = await stripe.subscriptions.list({
          customer: customer.id,
          status: "trialing",
          limit: 1,
        });

        const activeSub = subscriptions.data[0] || trialingSubscriptions.data[0];

        if (!activeSub) {
          results.push({
            email: authUser.email,
            status: "no_active_subscription",
          });
          continue;
        }

        // Check if already synced in user_subscriptions table
        const { data: existingSub } = await supabase
          .from("user_subscriptions")
          .select("stripe_subscription_id, subscription_status")
          .eq("user_id", authUser.id)
          .single();

        // Skip if already synced correctly
        if (existingSub?.stripe_subscription_id === activeSub.id && 
            (existingSub?.subscription_status === "active" || existingSub?.subscription_status === "trial")) {
          results.push({
            email: authUser.email,
            status: "already_synced",
            current_status: existingSub.subscription_status,
          });
          continue;
        }

        // Determine tier from price
        const priceId = activeSub.items.data[0]?.price?.id;
        let tier = "premium"; // default
        
        // Essential tier price IDs
        const essentialPrices = [
          "price_1SZNyCFGDAd3RU8IPwPJVesp", // Essential monthly
          "price_1SZNyVFGDAd3RU8IPgRPqKXH", // Essential annual
        ];
        // Premium tier price IDs (from new pricing)
        const premiumPrices = [
          "price_1SZNyiFGDAd3RU8I4JHYEsEi", // Premium monthly
          "price_1SZNyuFGDAd3RU8IjeGIvPEb", // Premium annual
          "price_1SKn0VFGDAd3RU8Io19mT9No", // Legacy premium monthly
          "price_1SKn12FGDAd3RU8IBpc45ctZ", // Legacy premium annual
          "price_1ONMQ9FGDAd3RU8IcBaBYmoJ", // Older premium
        ];

        if (essentialPrices.includes(priceId || "")) {
          tier = "essential";
        } else if (premiumPrices.includes(priceId || "")) {
          tier = "premium";
        }

        const isTrialing = activeSub.status === "trialing";
        
        // Safely create renewal date - handle invalid timestamps
        let renewalDateStr: string | null = null;
        const periodEnd = activeSub.current_period_end;
        if (periodEnd && typeof periodEnd === 'number' && periodEnd > 0) {
          try {
            const renewalDate = new Date(periodEnd * 1000);
            if (!isNaN(renewalDate.getTime())) {
              renewalDateStr = renewalDate.toISOString();
            }
          } catch (e) {
            logStep("Invalid current_period_end", { email: authUser.email, value: periodEnd });
          }
        }

        // Safely create trial end date - handle invalid timestamps
        let trialEndStr: string | null = null;
        const trialEndVal = activeSub.trial_end;
        if (trialEndVal && typeof trialEndVal === 'number' && trialEndVal > 0) {
          try {
            const trialEnd = new Date(trialEndVal * 1000);
            if (!isNaN(trialEnd.getTime())) {
              trialEndStr = trialEnd.toISOString();
            }
          } catch (e) {
            logStep("Invalid trial_end", { email: authUser.email, value: trialEndVal });
          }
        }

        // Upsert to user_subscriptions table (not profiles!)
        const updateData: Record<string, any> = {
          user_id: authUser.id,
          subscription_status: isTrialing ? "trial" : "active",
          subscription_tier: tier,
          stripe_customer_id: customer.id,
          stripe_subscription_id: activeSub.id,
          payment_source: "stripe",
          is_recurring: true,
        };

        // Only add dates if they are valid
        if (renewalDateStr) {
          updateData.subscription_renewal_date = renewalDateStr;
        }

        if (trialEndStr) {
          updateData.trial_ends_at = trialEndStr;
        }

        const { error: upsertError } = await supabase
          .from("user_subscriptions")
          .upsert(updateData, {
            onConflict: 'user_id'
          });

        if (upsertError) {
          results.push({
            email: authUser.email,
            status: "error",
            error: upsertError.message,
          });
          logStep(`Error updating ${authUser.email}`, { error: upsertError });
        } else {
          results.push({
            email: authUser.email,
            status: "updated",
            tier,
            subscription_status: isTrialing ? "trial" : "active",
            previous_status: existingSub?.subscription_status || "none",
          });
          logStep(`Updated ${authUser.email}: ${tier} (${isTrialing ? "trial" : "active"})`);
        }
      } catch (userError) {
        // Catch per-user errors so one bad user doesn't crash the entire sync
        const errorMsg = userError instanceof Error ? userError.message : String(userError);
        logStep(`Error processing user ${authUser.email}`, { error: errorMsg });
        results.push({
          email: authUser.email || "unknown",
          status: "error",
          error: errorMsg,
        });
      }
    }

    const summary = {
      total_users_checked: users.length,
      updated: results.filter(r => r.status === "updated").length,
      already_synced: results.filter(r => r.status === "already_synced").length,
      no_subscription: results.filter(r => r.status === "no_active_subscription").length,
      errors: results.filter(r => r.status === "error").length,
    };

    logStep("Sync completed", summary);

    return new Response(JSON.stringify({ 
      success: true,
      summary, 
      updated_users: results.filter(r => r.status === "updated"),
      errors: results.filter(r => r.status === "error"),
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });

  } catch (error) {
    logStep("Sync error", { error: error instanceof Error ? error.message : "Unknown" });
    return new Response(JSON.stringify({ 
      success: false,
      error: error instanceof Error ? error.message : "Unknown error" 
    }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
