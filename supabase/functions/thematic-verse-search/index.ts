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
    const { thematicQuery, maxResults = 50, scope = "all", scopeBooks = [] } = await req.json();
    
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

    // Build scope instruction
    const scopeInstruction = scope === "all" 
      ? "SEARCH THE ENTIRE BIBLE - Genesis through Revelation"
      : `SEARCH ONLY THESE BOOKS: ${scopeBooks.join(", ")}. Do NOT include verses from books outside this list.`;

    const systemPrompt = `You are Jeeves, a Phototheology-trained Bible research assistant with EXHAUSTIVE knowledge of Scripture. Your task is to find ALL relevant KJV Bible verses that match a user's thematic search.

CRITICAL RULES:
1. ONLY use King James Version (KJV) text - this is mandatory
2. BE EXHAUSTIVE - find as many relevant verses as possible (aim for ${maxResults} or more)
3. ${scopeInstruction}
4. Include verses that are directly related AND verses that connect thematically, typologically, or prophetically
5. For each verse, explain briefly why it's relevant to the search theme
6. Group verses by sub-theme when multiple themes are in the query

MANDATORY SEARCH LOCATIONS (check ALL of these):
- Genesis (especially Gen 3:15 for seed of woman, creation accounts)
- Exodus, Leviticus (tabernacle/sanctuary, priestly garments, fine linen)
- Psalms (Messianic psalms, typological connections)
- Isaiah (Messianic prophecies, sanctuary imagery)
- Gospels (Matthew, Mark, Luke, John - life of Christ, veil rending)
- Galatians (born of woman, law and promise)
- Ephesians (armor of God, righteousness)
- Hebrews (sanctuary theology - but see guardrails below)
- Revelation (woman of Rev 12, fine linen of saints, sanctuary in heaven)

SEARCH APPROACH - BE THOROUGH:
1. Direct mentions of the concepts (explicit keywords)
2. Symbolic/typological connections (e.g., veil = Christ's flesh, fine linen = righteousness)
3. Parallel themes and cross-references from any book
4. Old Testament types and New Testament antitypes
5. Prophetic connections (Messianic prophecies fulfilled or pending)
6. Sanctuary connections (tabernacle, temple, heavenly sanctuary)
7. Christ-centered readings (how does this point to Jesus?)

SPECIFIC THEMES TO ALWAYS CHECK:
- "Woman" themes: Gen 3:15, Gal 4:4, Rev 12:1-17, Isaiah 7:14, Matt 1:23
- "Veil" themes: Exodus 26:31-35, Matt 27:51, Mark 15:38, Luke 23:45, Heb 10:20
- "Knitted/formed in womb": Psalm 139:13-16, Job 10:8-11, Jer 1:5
- "Fine linen/righteousness": Rev 19:8, Rev 19:14, Ezek 16:10-13, Prov 31:22
- "Seed of woman": Gen 3:15, Gal 3:16, Gal 3:19, Rom 16:20

HEBREWS SANCTUARY GUARDRAIL:
If any search relates to the sanctuary, veil, or Christ's ministry:
- NEVER suggest Hebrews teaches Christ entered the Most Holy Place at ascension
- Greek "ta hagia" means "the holies/sanctuary" NOT "Most Holy Place"
- Christ entered Holy Place at ascension, Most Holy Place from 1844

DO NOT LIMIT YOURSELF - if a theme appears in 50 verses, include them all. Quality AND quantity matter.

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
        model: "google/gemini-2.5-pro",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: `Find ALL KJV Bible verses related to the following themes. Be EXHAUSTIVE - search Genesis through Revelation:\n\n${thematicQuery}` }
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
