import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// KJV Bible word search - uses AI to find all verses containing the search term
serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { searchTerm, scope = "all", page = 1, limit = 50 } = await req.json();
    
    if (!searchTerm || searchTerm.trim().length < 2) {
      return new Response(
        JSON.stringify({ error: "Search term must be at least 2 characters" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    // Calculate offset for pagination
    const offset = (page - 1) * limit;

    const scopeDescription = scope === "ot" 
      ? "Old Testament only (Genesis through Malachi)" 
      : scope === "nt" 
        ? "New Testament only (Matthew through Revelation)"
        : "the entire Bible (all 66 books)";

    const systemPrompt = `You are a Bible search expert with perfect knowledge of the King James Version (KJV).
Your task is to find ALL verses in the KJV Bible that contain the exact word or phrase provided.
Search scope: ${scopeDescription}

CRITICAL RULES:
1. Only return verses that actually contain the search term (case-insensitive match)
2. Return the EXACT KJV text, not paraphrased or from other translations
3. Include verses with the word in any form (e.g., "stick", "sticks", "sticketh")
4. Order results in biblical order: Genesis to Revelation
5. Return results as a JSON array with: reference, text, book, chapter, verse

For pagination, return results ${offset + 1} through ${offset + limit} if there are more than ${limit} results total.
Also include a "total_estimated" field with your estimate of total matching verses.`;

    const userPrompt = `Find all KJV Bible verses containing "${searchTerm}" (case-insensitive).
Scope: ${scope === "ot" ? "Old Testament" : scope === "nt" ? "New Testament" : "All Bible"}
Page: ${page} (showing results ${offset + 1}-${offset + limit})

Return JSON format:
{
  "results": [
    {"reference": "Genesis 1:1", "text": "In the beginning...", "book": "Genesis", "chapter": 1, "verse": 1}
  ],
  "total_estimated": 25,
  "has_more": true
}`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limit exceeded. Please try again in a moment." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "AI credits exhausted. Please add funds." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      
      throw new Error("AI gateway error");
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content || "{}";
    
    // Parse the JSON response
    let parsed = { results: [], total_estimated: 0, has_more: false };
    try {
      let cleanContent = content.trim();
      if (cleanContent.startsWith("```")) {
        cleanContent = cleanContent.replace(/```json?\n?/g, "").replace(/```$/g, "").trim();
      }
      parsed = JSON.parse(cleanContent);
    } catch (parseError) {
      console.error("Failed to parse AI response:", content);
    }

    return new Response(
      JSON.stringify(parsed),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Word search error:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
