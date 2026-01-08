import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Map product IDs to their PDF filenames in storage
const PRODUCT_FILES: Record<string, string> = {
  "quick-start-guide": "quick-start-guide.pdf",
  "study-suite": "study-suite.pdf",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { product } = await req.json();

    if (!product || !PRODUCT_FILES[product]) {
      return new Response(
        JSON.stringify({ error: "Invalid product specified" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const fileName = PRODUCT_FILES[product];
    const bucketName = "products";

    // Generate a signed URL that expires in 1 hour (3600 seconds)
    const { data, error } = await supabase.storage
      .from(bucketName)
      .createSignedUrl(fileName, 3600);

    if (error) {
      console.error("[get-product-download] Storage error:", error);
      return new Response(
        JSON.stringify({ error: "Failed to generate download link" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log(`[get-product-download] Generated signed URL for ${product}`);

    return new Response(
      JSON.stringify({ url: data.signedUrl }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error) {
    console.error("[get-product-download] Error:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
