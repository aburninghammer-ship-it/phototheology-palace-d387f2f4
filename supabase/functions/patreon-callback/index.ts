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
    const clientId = Deno.env.get("PATREON_CLIENT_ID");
    const clientSecret = Deno.env.get("PATREON_CLIENT_SECRET");
    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

    if (!clientId || !clientSecret) {
      throw new Error("Patreon credentials not configured");
    }

    const { code, redirectUri, userId } = await req.json();
    
    if (!code || !redirectUri) {
      throw new Error("code and redirectUri are required");
    }

    // Exchange code for access token
    const tokenResponse = await fetch("https://www.patreon.com/api/oauth2/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        code,
        grant_type: "authorization_code",
        client_id: clientId,
        client_secret: clientSecret,
        redirect_uri: redirectUri,
      }),
    });

    if (!tokenResponse.ok) {
      const error = await tokenResponse.text();
      console.error("Token exchange failed:", error);
      throw new Error("Failed to exchange code for token");
    }

    const tokens = await tokenResponse.json();

    // Fetch Patreon identity and memberships
    const identityResponse = await fetch(
      "https://www.patreon.com/api/oauth2/v2/identity?include=memberships&fields%5Buser%5D=full_name,email&fields%5Bmember%5D=patron_status,currently_entitled_amount_cents",
      {
        headers: { Authorization: `Bearer ${tokens.access_token}` },
      }
    );

    if (!identityResponse.ok) {
      throw new Error("Failed to fetch Patreon identity");
    }

    const identity = await identityResponse.json();
    const patreonUser = identity.data;
    const memberships = identity.included?.filter((i: any) => i.type === "member") || [];
    
    // Check if they're an active patron
    const isActivePatron = memberships.some(
      (m: any) => m.attributes?.patron_status === "active_patron"
    );
    
    const entitledCents = memberships.reduce(
      (max: number, m: any) => Math.max(max, m.attributes?.currently_entitled_amount_cents || 0),
      0
    );

    // Store connection in database
    if (userId && supabaseUrl && supabaseServiceKey) {
      const supabase = createClient(supabaseUrl, supabaseServiceKey);
      
      // Update or insert Patreon connection
      const { error: upsertError } = await supabase
        .from("patreon_connections")
        .upsert({
          user_id: userId,
          patreon_user_id: patreonUser.id,
          patreon_email: patreonUser.attributes?.email,
          patreon_name: patreonUser.attributes?.full_name,
          is_active_patron: isActivePatron,
          entitled_cents: entitledCents,
          access_token: tokens.access_token,
          refresh_token: tokens.refresh_token,
          token_expires_at: new Date(Date.now() + tokens.expires_in * 1000).toISOString(),
          connected_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        }, { onConflict: "user_id" });

      if (upsertError) {
        console.error("Failed to save Patreon connection:", upsertError);
        throw new Error("Failed to save Patreon connection");
      }

      // If active patron, grant premium access
      if (isActivePatron) {
        await supabase
          .from("profiles")
          .update({ 
            subscription_tier: "patron",
            updated_at: new Date().toISOString()
          })
          .eq("id", userId);
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        isActivePatron,
        entitledCents,
        patreonName: patreonUser.attributes?.full_name,
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error: unknown) {
    console.error("Patreon callback error:", error);
    const message = error instanceof Error ? error.message : "Unknown error";
    return new Response(
      JSON.stringify({ error: message }),
      { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
