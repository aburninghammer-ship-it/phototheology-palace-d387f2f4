import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Parse the landing data
    const landingData = await req.json();
    
    // Insert into early_landings table for true bounce tracking
    const { error } = await supabase.from("early_landings").insert({
      session_id: landingData.session_id,
      landing_page: landingData.landing_page,
      referrer: landingData.referrer,
      user_agent: landingData.user_agent,
      screen_width: landingData.screen_width,
      is_mobile: landingData.is_mobile,
      created_at: landingData.timestamp || new Date().toISOString(),
    });

    if (error) {
      console.error("Error tracking landing:", error);
    }

    return new Response(JSON.stringify({ success: true }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    console.error("Track landing error:", error);
    return new Response(JSON.stringify({ error: "Internal error" }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200, // Return 200 to not break beacons
    });
  }
});
