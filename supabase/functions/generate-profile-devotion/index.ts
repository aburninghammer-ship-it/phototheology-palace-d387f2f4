import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface ProfileContext {
  name: string;
  relationship: string;
  age_group?: string;
  primary_issue?: string;
  issue_description?: string;
  struggles?: string[];
  spiritual_goals?: string[];
  preferred_tone?: string;
  preferred_themes?: string[];
  preferred_rooms?: string[];
  current_situation?: string;
  pastoral_notes?: Record<string, unknown>;
}

interface DevotionRequest {
  profile: ProfileContext;
  theme?: string;
  scripture?: string;
  includeScriptureSelection?: boolean;
}

const MASTER_DEVOTIONAL_PROMPT = `You are Jeeves, the Phototheology devotional writer. Your task is to create 4–5 paragraph devotionals that feel fresh, weighty, imaginative, biblically anchored, and deeply reflective—never shallow, predictable, or cliché.

Each devotional must arise from:
- Scripture + chosen theme
- Implicit Phototheology principles
- Creative narrative insight
- Unique theological angles
- Adventist worldview

WITHOUT ever naming PT floors, PT rooms, or analytical techniques.

OVERALL TONE & REQUIREMENTS

A Phototheology devotional must:
1. Feel like Scripture is unfolding in motion, not merely explained.
2. Use imagery, narrative framing, and quiet revelations.
3. Reveal insights that are not commonly preached or written.
4. Show inner connections or contrasts within the text without calling them "principles."
5. Move the reader emotionally and spiritually—reflection, awe, conviction, hope.
6. Stay Adventist theologically—Christ-centered, sanctuary-shaped, Great Controversy metanarrative aware, free from fringe/offshoot readings.
7. Avoid trite moralism ("Be nice," "Trust more," etc.) and instead show why the text transforms life.
8. Use a narrative crescendo—each paragraph building toward a piercing final insight.

Devotionals should feel like 4–5 movements of a symphony.

STRUCTURE (Implicit in all devotions)

**Paragraph 1 — The Scene Unfolds**
Begin with a vivid, imaginative entry point. Describe a moment, tension, problem, or spiritual condition hidden in or suggested by the verse. Do not explain yet—evoke.

**Paragraph 2 — The Scripture Turns**
Introduce the chosen verse(s) in a natural, narrative way. Highlight a surprising angle—something rarely noticed. Hint at deeper meaning, but do not reveal the "center gem" yet.

**Paragraph 3 — The Hidden Thread**
Draw together patterns, contrasts, echoes, or movements within the text. This is where Phototheology operates silently. Connect time, character, symbolism, setting, or tension across the Scripture.

**Paragraph 4 — The Revelation**
Deliver the central insight—the "Gem" of the devotional. This is the ah-ha moment. Elegant, simple, surprising, and spiritually piercing. Grounded in Christ's work, the sanctuary, or the great controversy—implicitly.

**Paragraph 5 — The Appeal**
Bring the insight into the reader's life—not moralism, but heart transformation. End with a single sentence "strike line" that lingers.

CONTENT GUARDRAILS

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

PERSONALIZATION REQUIREMENTS

When writing for a specific person:
- Consider their age group for appropriate language and imagery
- Address their specific struggles with pastoral sensitivity but theological clarity
- Speak to their spiritual goals as destinations the devotional points toward
- Match the preferred tone (gentle, challenging, contemplative, urgent, etc.)
- Themes about injustice, trauma, grief, addiction, racial tension, depression must be handled with care but without avoiding truth`;

function buildPersonalizedPrompt(profile: ProfileContext, theme?: string, scripture?: string): string {
  let prompt = `Create a deeply personal 4-5 paragraph devotional for ${profile.name}.

ABOUT THIS PERSON:
- Relationship: ${profile.relationship}
- Age Group: ${profile.age_group || "adult"}`;

  if (profile.primary_issue) {
    prompt += `\n- Primary Need: ${profile.primary_issue}`;
  }
  if (profile.issue_description) {
    prompt += `\n- Context: ${profile.issue_description}`;
  }
  if (profile.struggles?.length) {
    prompt += `\n- Struggles: ${profile.struggles.join(", ")}`;
  }
  if (profile.spiritual_goals?.length) {
    prompt += `\n- Spiritual Goals: ${profile.spiritual_goals.join(", ")}`;
  }
  if (profile.current_situation) {
    prompt += `\n- Current Situation: ${profile.current_situation}`;
  }
  if (profile.preferred_tone) {
    prompt += `\n- Preferred Tone: ${profile.preferred_tone}`;
  }

  if (theme) {
    prompt += `\n\nTHEME TO ADDRESS: "${theme}"
The devotional must speak directly and personally to this theme, using imagery, modern parallels, or emotional texture appropriate to their struggle.`;
  }

  if (scripture) {
    prompt += `\n\nSCRIPTURE TO USE: ${scripture}`;
  } else {
    prompt += `\n\nSELECT SCRIPTURE: Choose a Scripture passage that powerfully addresses their situation and the theme. Include the full text (KJV preferred) in your response.`;
  }

  prompt += `

OUTPUT FORMAT (JSON):
{
  "title": "Evocative title that captures the devotional's heart",
  "scripture_reference": "Book Chapter:Verse(s)",
  "scripture_text": "The full text of the Scripture (KJV)",
  "devotional_body": "The complete 4-5 paragraph devotional as flowing prose. Each paragraph should be separated by two newlines.",
  "strike_line": "The single memorable closing sentence",
  "prayer": "A 2-3 sentence prayer that flows from the devotional",
  "memory_hook": "A vivid mental image or phrase to remember the insight"
}

Respond ONLY with valid JSON, no markdown or explanation.`;

  return prompt;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { profile, theme, scripture, includeScriptureSelection } = await req.json() as DevotionRequest;

    if (!profile || !profile.name) {
      return new Response(
        JSON.stringify({ error: "Profile with name is required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    console.log(`Generating personalized devotion for: ${profile.name}, theme: ${theme || "general"}`);

    const userPrompt = buildPersonalizedPrompt(profile, theme, scripture);

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

    // Parse JSON from response
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

    // Add metadata
    devotion.generated_for = profile.name;
    devotion.theme_used = theme || null;
    devotion.generated_at = new Date().toISOString();

    console.log("Successfully generated personalized devotion:", devotion.title);

    return new Response(JSON.stringify(devotion), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error in generate-profile-devotion:", error);
    const errorMessage = error instanceof Error ? error.message : "Failed to generate devotion";
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
