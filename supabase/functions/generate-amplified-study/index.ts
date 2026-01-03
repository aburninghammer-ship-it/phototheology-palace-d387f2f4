import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { sermonOutline, sermonTitle, preacher, sermonDate } = await req.json();

    if (!sermonOutline) {
      return new Response(
        JSON.stringify({ error: "Sermon outline is required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    const systemPrompt = `You are a biblical scholar and Phototheology expert creating an amplified small group study from a sermon outline.

⚠️ CRITICAL THEOLOGICAL GUARDRAILS (NON-NEGOTIABLE):
1. AZAZEL = SATAN, NOT CHRIST: In Leviticus 16, Azazel (scapegoat) represents SATAN. NEVER identify it as Jesus.
2. LITTLE HORN = ROME/PAPACY, NOT ANTIOCHUS: Daniel 7 & 8 little horn = Rome/Papal power. NEVER say Antiochus Epiphanes.
3. TWO-PHASE SANCTUARY: Christ entered HOLY PLACE at ascension (31 AD); MOST HOLY PLACE in 1844. NEVER say Most Holy at ascension.
4. DAY OF ATONEMENT = 1844: Christ's death = PASSOVER. Day of Atonement = 1844 judgment. NEVER equate death with Atonement.
5. FEAST TYPOLOGY: Spring feasts = First Advent (Passover=death, Firstfruits=resurrection). Fall feasts = Second Advent ministry.
6. HEBREWS CLARITY: Hebrews contrasts earthly vs heavenly sanctuary, NOT Holy vs Most Holy Place.

Your task is to:

1. EXPAND each sermon point with:
   - Deep biblical analysis and cross-references
   - Hebrew/Greek word studies where relevant
   - Historical and cultural context
   - Scholarly support from trusted sources

2. ASSESS each theological claim:
   - Mark as SUPPORTED (✔), NEEDS NUANCE (⚠), or QUESTIONABLE (❌)
   - Provide brief reasoning for assessment

3. CREATE discussion questions that:
   - Start with observation (what does the text say?)
   - Move to interpretation (what does it mean?)
   - End with application (how do we live this?)

4. APPLY Phototheology Palace methodology:
   - CR (Concentration Room): Christ-centered focus
   - OR (Observation Room): Key details to notice
   - ST (Symbols/Types): Symbolic connections
   - DR (Dimensions): Literal, Christ, Me, Church, Heaven
   - BL (Blue Room/Sanctuary): Sanctuary connections
   - PRm (Patterns): Biblical patterns
   - P‖ (Parallels): Scripture parallels

5. ALL Scripture quotes MUST be KJV (King James Version)

Respond ONLY with valid JSON in this exact format:
{
  "studyTitle": "string",
  "overview": "string (2-3 paragraphs summarizing the study)",
  "iceBreakers": ["string", "string"],
  "sections": [
    {
      "sectionNumber": 1,
      "title": "string",
      "originalPoint": "string (from sermon)",
      "biblicalBasis": {
        "primaryTexts": ["verse reference - KJV text"],
        "supportingTexts": ["verse reference - KJV text"]
      },
      "analysis": "string (detailed biblical analysis)",
      "scholarlySupport": "string (scholarly insights)",
      "assessment": {
        "rating": "supported|needs-nuance|questionable",
        "reasoning": "string"
      },
      "ptConnections": {
        "rooms": ["CR", "OR", etc.],
        "insights": "string"
      },
      "discussionQuestions": [
        {
          "question": "string",
          "type": "observation|interpretation|application",
          "ptRoom": "string"
        }
      ]
    }
  ],
  "christSynthesis": "string (how all points unite in Christ)",
  "sanctuaryConnection": "string (Blue Room connection)",
  "discussionQuestions": [
    {
      "question": "string",
      "type": "observation|interpretation|application",
      "ptRoom": "string"
    }
  ],
  "actionChallenge": "string (practical weekly challenge)",
  "prayerFocus": "string (guided prayer themes)",
  "furtherStudy": ["string (additional resources/passages)"],
  "facilitatorNotes": "string (tips for group leaders)"
}`;

    const userPrompt = `Create an amplified small group study from this sermon outline:

SERMON TITLE: ${sermonTitle || "Untitled Sermon"}
PREACHER: ${preacher || "Unknown"}
DATE: ${sermonDate || "Not specified"}

SERMON OUTLINE:
${sermonOutline}

Generate a comprehensive, Christ-centered study that expands on each point while maintaining theological accuracy. Include Phototheology Palace connections throughout.`;

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
        temperature: 0.7,
        max_tokens: 8000,
      }),
    });

    if (!response.ok) {
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
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      throw new Error(`AI gateway error: ${response.status}`);
    }

    const aiResponse = await response.json();
    const content = aiResponse.choices?.[0]?.message?.content;

    if (!content) {
      throw new Error("No content in AI response");
    }

    // Parse JSON from response (handle markdown code blocks)
    let studyData;
    try {
      const jsonMatch = content.match(/```(?:json)?\s*([\s\S]*?)```/) || [null, content];
      const jsonStr = jsonMatch[1]?.trim() || content.trim();
      studyData = JSON.parse(jsonStr);
    } catch (parseError) {
      console.error("JSON parse error:", parseError);
      // Return raw content if parsing fails
      studyData = { rawContent: content, parseError: true };
    }

    return new Response(
      JSON.stringify({ success: true, study: studyData }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error) {
    console.error("Generate amplified study error:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
