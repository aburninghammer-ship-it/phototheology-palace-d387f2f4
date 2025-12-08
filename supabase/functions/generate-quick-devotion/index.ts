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

CRITICAL LENGTH REQUIREMENT: Each paragraph must be SUBSTANTIAL—minimum 100-150 words per paragraph. The total devotional should be 500-750 words minimum. DO NOT write thin, sparse paragraphs. Each paragraph should have multiple sentences that develop the thought fully, with layered imagery, theological depth, and emotional resonance. Think "essay paragraph" not "social media post."

**Paragraph 1 — The Scene Unfolds (100-150 words)**
Begin with a vivid, imaginative entry point that IMMERSES the reader. Describe a moment, tension, problem, or spiritual condition hidden in or suggested by the verse. Use rich sensory details—what would they see, hear, smell, feel? Set the historical and emotional context. Paint the scene so vividly the reader stands INSIDE the biblical moment. Build tension or curiosity. Do not explain yet—evoke. Create atmosphere.

**Paragraph 2 — The Scripture Turns (100-150 words)**
Introduce the chosen verse(s) woven naturally into the narrative. Highlight a surprising angle—something rarely noticed by casual readers. Examine specific Hebrew or Greek nuances if relevant. Point out what the original audience would have understood that modern readers miss. Build curiosity about where this is leading. Hint at deeper meaning, but do not reveal the "center gem" yet. Let the text breathe and speak.

**Paragraph 3 — The Hidden Thread (100-150 words)**
Draw together patterns, contrasts, echoes, or movements within the text. This is where Phototheology operates silently—connect time, character, symbolism, setting, or tension across Scripture. Show how this moment echoes Genesis, anticipates Revelation, or mirrors the sanctuary. Trace the thread through multiple biblical moments. Show the reader connections they have never seen. Build the theological case with layered evidence.

**Paragraph 4 — The Revelation (100-150 words)**
Deliver the central insight—the "Gem" of the devotional. This is the ah-ha moment. State it clearly, then EXPAND on its implications. What does this mean for our understanding of God? Of Christ? Of salvation? Of the cosmic conflict? Unpack the gem's facets. Show how this truth transforms theology and life. Make it elegant, surprising, and spiritually piercing. Ground it in Christ's work, the sanctuary, or the great controversy—implicitly.

**Paragraph 5 — The Appeal (100-150 words)**
Bring the insight into the reader's life with specificity—not generic moralism, but heart transformation rooted in what was just revealed. How does this truth meet them in their actual struggles? What changes when this gem is believed? Paint the "before and after" of embracing this truth. Build to an emotional and spiritual crescendo. End with a single sentence "strike line" that pierces the heart and lingers for days.

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

ABSOLUTE LENGTH REQUIREMENT - THIS IS MANDATORY:
- The "devotional_body" field MUST contain 5 FULL paragraphs
- Each paragraph MUST be 100-150 words (4-6 sentences minimum)
- Total devotional_body length: 500-750 words MINIMUM
- DO NOT produce thin, sparse, or truncated content
- If your response is under 500 words, YOU HAVE FAILED

CONTENT REQUIREMENTS:
- Select a Scripture that powerfully addresses this theme (include 3-8 verses - the FULL TEXT)
- Begin with a vivid scene that draws the reader in with sensory details
- Reveal a surprising theological angle most readers miss
- Draw hidden threads and connections across Scripture (Genesis to Revelation)
- Build to a central "gem" insight about Christ that is profound and unexpected
- End with an appeal that transforms the heart, not generic moralism
- Close with a strike line that pierces and lingers

EACH SECTION MUST BE SUBSTANTIAL:
- "christ_connection": 3-4 sentences minimum explaining how Christ is revealed
- "application": 3-4 sentences minimum with specific, actionable wisdom
- "memory_hook": A vivid, detailed mental image (2-3 sentences)
- "prayer": 4-5 sentences of heartfelt, text-specific prayer

The devotional must feel like drinking from a fire hose of theological insight while reading like a narrative that unfolds naturally.`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-pro",
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
