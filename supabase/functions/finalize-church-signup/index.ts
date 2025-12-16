import { serve } from "https://deno.land/std@0.224.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@14.21.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface FinalizeRequest {
  session_id: string;
}

const tierSeats = {
  tier1: 50,
  tier2: 150,
  tier3: 150,
} as const;

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") || "", {
      apiVersion: "2023-10-16",
    });

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Authenticate user
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(JSON.stringify({ success: false, error: "No authorization header" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const token = authHeader.replace("Bearer ", "");
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser(token);

    if (authError || !user) {
      return new Response(JSON.stringify({ success: false, error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const body: FinalizeRequest = await req.json();
    if (!body.session_id) {
      return new Response(JSON.stringify({ success: false, error: "Missing session_id" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const session = await stripe.checkout.sessions.retrieve(body.session_id, {
      expand: ["subscription"],
    });

    const metadata = session.metadata || {};

    // Security: only the user who initiated the session can finalize it
    if (!metadata.user_id || metadata.user_id !== user.id) {
      return new Response(JSON.stringify({ success: false, error: "Session does not belong to this user" }), {
        status: 403,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const tier = metadata.tier as keyof typeof tierSeats | undefined;
    const churchName = metadata.church_name;
    const billingEmail = metadata.billing_email;

    if (!tier || !churchName || !billingEmail) {
      return new Response(
        JSON.stringify({
          success: false,
          error: "Missing church metadata on checkout session. Please contact support.",
        }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    if (tier === "tier3") {
      return new Response(
        JSON.stringify({
          success: false,
          error: "Enterprise tier is not self-service. Please contact us to finish setup.",
        }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    const customerId = session.customer as string | null;
    if (!customerId) {
      return new Response(JSON.stringify({ success: false, error: "Missing customer on checkout session" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const subscription = session.subscription as Stripe.Subscription | string | null;
    const subObj = typeof subscription === "string" ? null : subscription;

    const subscriptionEndsAt = subObj?.current_period_end
      ? new Date(subObj.current_period_end * 1000).toISOString()
      : null;

    // If church already exists for this Stripe customer, reuse it
    const { data: existingChurch } = await supabase
      .from("churches")
      .select("id")
      .eq("stripe_customer_id", customerId)
      .maybeSingle();

    let churchId: string;

    if (existingChurch?.id) {
      churchId = existingChurch.id;
    } else {
      const { data: church, error: churchError } = await supabase
        .from("churches")
        .insert({
          name: churchName,
          tier,
          max_seats: tierSeats[tier],
          billing_email: billingEmail,
          contact_person: metadata.contact_person || null,
          contact_phone: metadata.contact_phone || null,
          subscription_status: "active",
          subscription_ends_at: subscriptionEndsAt,
          stripe_customer_id: customerId,
        })
        .select("id")
        .single();

      if (churchError || !church) {
        console.error("[finalize-church-signup] Error creating church", churchError);
        return new Response(JSON.stringify({ success: false, error: "Failed to create church" }), {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      churchId = church.id;
    }

    // Ensure user is an admin member
    const { data: existingMembership } = await supabase
      .from("church_members")
      .select("id")
      .eq("user_id", user.id)
      .maybeSingle();

    if (!existingMembership) {
      const { error: memberError } = await supabase.from("church_members").insert({
        church_id: churchId,
        user_id: user.id,
        role: "admin",
      });

      if (memberError) {
        console.error("[finalize-church-signup] Error adding admin member", memberError);
        return new Response(JSON.stringify({ success: false, error: "Failed to create admin membership" }), {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
    }

    return new Response(JSON.stringify({ success: true, church_id: churchId }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("[finalize-church-signup] Error", error);
    return new Response(
      JSON.stringify({ success: false, error: error instanceof Error ? error.message : "Internal server error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }
});
