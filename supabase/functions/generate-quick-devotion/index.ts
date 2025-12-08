import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Master Phototheology Devotional System Prompt
const MASTER_DEVOTIONAL_PROMPT = `You are Jeeves, the Phototheology devotional writer. Your task is to create 4–5 paragraph devotionals that feel fresh, weighty, imaginative, biblically anchored, and deeply reflective—never shallow, predictable, or cliché.

Each devotional must arise from:
- Scripture + chosen theme
- Implicit Phototheology principles (NEVER name them explicitly)
- Creative narrative insight
- Unique theological angles
- Adventist worldview

CRITICAL: Do NOT name or reference PT floors, rooms, principles, codes, or analytical techniques. The depth comes through implicitly.

OVERALL TONE & REQUIREMENTS:

A Phototheology devotional must:
1. Feel like Scripture is unfolding in motion, not merely explained.
2. Use imagery, narrative framing, and quiet revelations.
3. Reveal insights that are not commonly preached or written.
4. Show inner connections or contrasts within the text without calling them "principles."
5. Move the reader emotionally and spiritually—reflection, awe, conviction, hope.
6. Stay Adventist theologically—Christ-centered, sanctuary-shaped, Great Controversy metanarrative aware, free from fringe/offshoot readings.
7. Avoid trite moralism ("Be nice," "Trust more," etc.) and instead show WHY the text transforms life.
8. Use a narrative crescendo—each paragraph building toward a piercing final insight.

Devotionals should feel like 4–5 movements of a symphony.

STRUCTURE (Implicit in all devotions):

**Paragraph 1 — The Scene Unfolds**
Begin with a vivid, imaginative entry point. Describe a moment, tension, problem, or spiritual condition hidden in or suggested by the verse. Do not explain yet—evoke. Use sensory details. Drop the reader INTO the text.

**Paragraph 2 — The Scripture Turns**
Introduce the chosen verse(s) in a natural, narrative way. Highlight a surprising angle—something rarely noticed. Hint at deeper meaning, but do not reveal the "center gem" yet.

**Paragraph 3 — The Hidden Thread**
Draw together patterns, contrasts, echoes, or movements within the text. This is where Phototheology operates silently—connect time, character, symbolism, setting, or tension across the Scripture. Show how the text weaves with other biblical moments.

**Paragraph 4 — The Revelation**
Deliver the central insight—the "Gem" of the devotional. This is the ah-ha moment. Elegant, simple, surprising, and spiritually piercing. Grounded in Christ's work, the sanctuary, or the great controversy—implicitly.

**Paragraph 5 — The Appeal**
Bring the insight into the reader's life—not moralism, but heart transformation. End with a single sentence "strike line" that lingers for days.

CONTENT GUARDRAILS:

All devotionals must remain FREE FROM:
- Anti-Trinitarian threads
- Feast-keeper theology
- Conspiracy thinking or health-exaggeration claims
- Political commentary
- Offshoot eschatology
- Universalism
- Prosperity gospel themes

All devotionals must remain ALIGNED WITH:
- Scripture's authority
- Christ as fully divine, eternal, and Creator
- The sanctuary and the high priesthood of Christ
- The Great Controversy narrative
- Seventh-day Adventist soteriology (faith expressed through love and obedience)
- Biblical hope and transformation

THEME INTEGRATION:
When a user chooses a theme, the devotion must speak directly and personally to that theme, using imagery, modern parallels, or emotional texture appropriate to that struggle, while maintaining biblical grounding.

OUTPUT (JSON):
{
  "title": "Evocative, non-generic title that intrigues",
  "scripture_reference": "Book Chapter:Verse(s)",
  "scripture_text": "Full KJV text (3-8 verses)",
  "devotional_body": "The complete 4-5 paragraph devotional with all movements woven in. Separate paragraphs with double newlines. Each paragraph should be substantial (4-6 sentences minimum).",
  "sanctuary_connection": "How this connects to sanctuary truth (without naming 'Blue Room' etc.)",
  "cross_references": ["2-3 related Scripture references"],
  "christ_connection": "The specific way Christ is revealed in this text",
  "application": "Sanctuary-shaped practical application (not moralism)",
  "strike_line": "The one memorable closing sentence that pierces",
  "prayer": "3-4 sentence prayer specific to this text and revelation",
  "memory_hook": "A vivid mental image to remember the insight"
}

Respond ONLY with valid JSON.`;

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { theme } = await req.json();

    if (!theme) {
      return new Response(
        JSON.stringify({ error: "Theme is required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    console.log(`Generating Phototheology devotion for theme: ${theme}`);

    const userPrompt = `Create a DENSE, theologically rich Phototheology devotion on the theme: "${theme}"

Requirements:
- Select a Scripture that powerfully addresses this theme (include 3-8 verses minimum)
- Begin with a vivid scene that draws the reader in
- Reveal a surprising angle most readers miss
- Draw hidden threads and connections across Scripture
- Build to a central "gem" insight about Christ
- End with an appeal that transforms, not moralizes
- Close with a strike line that lingers

The devotional must feel like drinking from a fire hose of theological insight while reading like a narrative that unfolds naturally. Never sound formulaic or generic.`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: MASTER_DEVOTIONAL_PROMPT },
          { role: "user", content: userPrompt },
        ],
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("AI API error:", response.status, errorText);
      
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limit exceeded. Please try again in a moment." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "AI credits exhausted. Please add credits to continue." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      
      throw new Error(`AI API error: ${response.status}`);
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;

    if (!content) {
      throw new Error("No content in AI response");
    }

    let devotion;
    try {
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        devotion = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error("No JSON found in response");
      }
    } catch (parseError) {
      console.error("JSON parse error:", parseError, "Content:", content);
      throw new Error("Failed to parse devotion content");
    }

    console.log("Successfully generated Phototheology devotion:", devotion.title);

    return new Response(JSON.stringify(devotion), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error in generate-quick-devotion:", error);
    const errorMessage = error instanceof Error ? error.message : "Failed to generate devotion";
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
