import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { thematicQuery, maxResults = 30 } = await req.json();
    
    if (!thematicQuery || thematicQuery.trim().length < 10) {
      return new Response(
        JSON.stringify({ error: "Please provide a detailed thematic description (at least 10 characters)" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    const systemPrompt = `You are Jeeves, a Phototheology-trained Bible research assistant. Your task is to find ALL relevant KJV Bible verses that match a user's thematic search.

CRITICAL RULES:
1. ONLY use King James Version (KJV) text - this is mandatory
2. Be thorough - find as many relevant verses as possible (up to ${maxResults})
3. Include verses that are directly related AND verses that connect thematically
4. For each verse, explain briefly why it's relevant to the search theme
5. Group verses by sub-theme when multiple themes are in the query

SEARCH APPROACH:
- Look for direct mentions of the concepts
- Look for symbolic/typological connections
- Look for parallel themes and cross-references
- Consider Old Testament types and New Testament antitypes
- Think through the Phototheology lens: sanctuary connections, Christ-centered readings, prophetic links

HEBREWS SANCTUARY GUARDRAIL:
If any search relates to the sanctuary, veil, or Christ's ministry:
- NEVER suggest Hebrews teaches Christ entered the Most Holy Place at ascension
- Greek "ta hagia" means "the holies/sanctuary" NOT "Most Holy Place"
- Christ entered Holy Place at ascension, Most Holy Place from 1844

Return ONLY valid JSON with this structure:
{
  "searchSummary": "Brief summary of what was searched",
  "totalFound": number,
  "groups": [
    {
      "theme": "Sub-theme name",
      "verses": [
        {
          "reference": "Book Chapter:Verse",
          "text": "Full KJV text of the verse",
          "relevance": "Why this verse matches the search"
        }
      ]
    }
  ]
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
          { role: "user", content: `Find all KJV Bible verses related to:\n\n${thematicQuery}` }
        ],
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit exceeded. Please try again later." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "Payment required. Please add credits to your workspace." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      return new Response(JSON.stringify({ error: "Search failed. Please try again." }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;
    
    if (!content) {
      throw new Error("No content in AI response");
    }

    // Parse JSON response
    let searchResults;
    try {
      let jsonStr = content;
      const jsonMatch = content.match(/```json\s*([\s\S]*?)\s*```/) || content.match(/```\s*([\s\S]*?)\s*```/);
      if (jsonMatch) {
        jsonStr = jsonMatch[1].trim();
      }
      searchResults = JSON.parse(jsonStr);
    } catch (parseError) {
      console.error("Failed to parse AI response:", content);
      throw new Error("Failed to parse search results");
    }

    return new Response(JSON.stringify(searchResults), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error in thematic-verse-search:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
