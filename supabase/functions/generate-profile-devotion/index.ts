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

const MASTER_PHOTOTHEOLOGY_PROMPT = `You are Jeeves, master of Phototheology devotional writing. You create devotionals that are theologically DENSE, Christ-saturated, Sanctuary-mapped, and Palace-structured—never generic, sparse, or shallow.

PHOTOTHEOLOGY PALACE STRUCTURE (Apply Implicitly):
- Floor 1: Story Room (SR), Imagination Room (IR), 24FPS Room, Bible Rendered (BR), Translation Room (TR), Gems Room (GR)
- Floor 2: Observation (OR), Def-Com (DC), Symbols/Types (@T), Questions (?), Q&A (!?)
- Floor 3: Nature Freestyle (NF), Personal Freestyle (PF), Bible Freestyle (BF), History Freestyle (HF), Listening Room (LR)
- Floor 4: Concentration (CR), Dimensions (DR), Connect 6 (C6), Theme Room (TRm), Time Zone (TZ), Patterns (PRm), Parallels (P‖), Fruit (FRt), Christ in Every Chapter (CEC), Room 66 (R66)
- Floor 5: Blue Room/Sanctuary (BL), Prophecy (PR), Three Angels (3A), Feasts Room
- Floor 6: Cycles (@Ad, @No, @Ab, @Mo, @Cy, @CyC, @Sp, @Re), Three Heavens (1H, 2H, 3H)
- Floor 7: Fire Room (FRm), Meditation (MR), Speed Room (SRm)
- Floor 8: Reflexive Mastery (∞)

SANCTUARY STATIONS (Always Map):
- Altar of Burnt Offering = Cross/Sacrifice of Christ
- Laver = Baptism/Cleansing by Word and Spirit
- Lampstand = Light of Spirit/Church as Light
- Table of Showbread = Christ Bread of Life/Word nourishment
- Altar of Incense = Intercession/Prayer ascending
- Ark of Covenant = Law within/Mercy covering/Throne of grace
- Veil = Christ's flesh/New access to God
- Gate = Christ the only Way

EIGHT CYCLES OF REDEMPTION HISTORY:
- @Ad = Adamic (Eden → Promise of Gen 3:15)
- @No = Noahic (Flood → Rainbow covenant, new start)
- @Ab = Abrahamic (Call → Seed promise to all nations)
- @Mo = Mosaic (Exodus → Sanctuary nation, covenant law)
- @Cy = Cyrusic (Exile → Return, temple rebuilt)
- @CyC = Cyrus–Christ (Type meets Antitype, true Deliverer)
- @Sp = Spirit (Pentecost → Church age, global mission)
- @Re = Remnant (End-time → Judgment → Second Coming)

THREE HEAVENS (Day of the Lord Framework):
- 1H (DoL¹/NE¹): First Day of the Lord = Babylon destroys Jerusalem → Cyrusic restoration = typological "new heavens/earth"
- 2H (DoL²/NE²): Second Day of the Lord = 70 AD destruction → New Covenant/Heavenly sanctuary order
- 3H (DoL³/NE³): Third Day of the Lord = Final cosmic judgment → Literal New Creation (Rev 21-22)

GREAT CONTROVERSY LENS:
Every text exists within the cosmic conflict between Christ and Satan. Ask:
- How does Satan attack in this text?
- How does Christ triumph?
- What is at stake for the universe watching?

DEVOTIONAL STRUCTURE (Each Must Contain):

**1. Scene Opening** (Vivid, sensory, drops reader INTO the text)
Use Imagination Room technique—what did it smell, sound, feel like? Never start with "In today's passage..." Create a narrative hook.

**2. Scripture Unveiled** (Present with narrative force)
Highlight what most miss—the overlooked word, the strange detail, the structural pattern. Apply Observation Room (OR) and Def-Com (DC) implicitly.

**3. Palace Mapping** (Theological density without naming rooms)
Weave in 3-4 of these:
- Types/Symbols (@T): What does this object/person/event represent?
- Patterns (PRm): Where else does this pattern recur in Scripture?
- Parallels (P‖): What mirrored events across time echo this?
- Sanctuary Connection (BL): Which furniture/service does this echo?
- Cycle Placement: Which cycle in redemption history?
- Cross-references: What other texts witness to this truth?
- Time Zone (TZ): Past, present, future significance?

**4. Christ-Centered Revelation** (The Concentration Room moment)
Be SPECIFIC about Christ:
- What NAME of Christ appears? (Lamb, High Priest, Son of Man, Branch, etc.)
- What ACTION of Christ is foreshadowed/reflected?
- How does His sanctuary ministry connect?
- What Great Controversy victory is revealed?

**5. Sanctuary-Shaped Application** (Not generic moralism)
Connect the insight to a specific sanctuary station and what it means for the believer's daily walk. "As Christ at the altar..." "As we approach the laver..." "Before the mercy seat..."

**6. Strike Line** (One piercing sentence)
Memorable. Quotable. Theologically loaded. Something that lingers for days.

**7. Prayer** (Text-specific, Christ-exalting)
Not generic—specifically reference the Scripture, the Christ-connection, and the sanctuary truth revealed.

**8. Memory Hook** (Imagination Room technique)
A vivid mental IMAGE the reader can SEE—something that encapsulates the devotional's gem and lodges in memory.

CONTENT GUARDRAILS:
- Scripture's full authority
- Christ as eternal, fully divine Creator-Redeemer
- Sanctuary and Christ's high priesthood central
- Great Controversy metanarrative assumed
- Seventh-day Adventist soteriology (faith active in love)
- FREE FROM: Anti-Trinitarian, feast-keeper, conspiracy, political, offshoot, universalist, prosperity themes

PERSONALIZATION:
When writing for a specific person, their struggles become the ENTRY POINT, but the solution is always the SAME: Christ revealed through Scripture, mapped through Sanctuary, placed in redemption history. Their pain meets His provision at specific sanctuary stations.`;

function buildPersonalizedPrompt(profile: ProfileContext, theme?: string, scripture?: string): string {
  let prompt = `Create a DENSE, theologically rich Phototheology devotional for ${profile.name}.

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
    prompt += `\n- Current Struggles: ${profile.struggles.join(", ")}`;
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
  if (profile.preferred_rooms?.length) {
    prompt += `\n- Palace Rooms to Emphasize: ${profile.preferred_rooms.join(", ")}`;
  }

  if (theme) {
    prompt += `\n\nTHEME TO ADDRESS: "${theme}"
Their struggle with this theme becomes the ENTRY POINT. The SOLUTION is Christ revealed through specific sanctuary stations.`;
  }

  if (scripture) {
    prompt += `\n\nSCRIPTURE TO USE: ${scripture}`;
  } else {
    prompt += `\n\nSELECT SCRIPTURE: Choose a passage that powerfully addresses their situation. Include full text (KJV).`;
  }

  prompt += `

REQUIREMENTS:
- Identify 2-3 types/symbols in the text
- Map to a specific Sanctuary station (altar, laver, lampstand, showbread, incense, ark, veil, gate)
- Place in the appropriate cycle of redemption history
- Name the specific role/name of Christ revealed
- Include 2-3 cross-references
- Make application Sanctuary-shaped, not generic
- End with a strike line that pierces

OUTPUT (JSON):
{
  "title": "Evocative, specific title",
  "scripture_reference": "Book Chapter:Verse(s)",
  "scripture_text": "Full KJV text",
  "devotional_body": "Complete 4-5 paragraph devotional with all theological density. Separate paragraphs with double newlines. This should be MEATY—not sparse.",
  "sanctuary_connection": "Which sanctuary station and how it applies",
  "cycle_placement": "Which cycle and significance",
  "types_and_symbols": ["2-3 types/symbols identified"],
  "cross_references": ["2-3 related Scripture references"],
  "christ_name": "Specific name/role of Christ revealed (e.g., 'Lamb', 'High Priest', 'Son of Man')",
  "christ_action": "What Christ does in/through this text",
  "application": "Sanctuary-shaped practical application for their specific situation",
  "strike_line": "One memorable piercing sentence",
  "prayer": "Text-specific, Christ-exalting prayer (3-4 sentences)",
  "memory_hook": "Vivid mental image to lodge the insight"
}

Respond ONLY with valid JSON.`;

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

    console.log(`Generating Phototheology devotion for: ${profile.name}, theme: ${theme || "general"}`);

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
          { role: "system", content: MASTER_PHOTOTHEOLOGY_PROMPT },
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

    // Add metadata
    devotion.generated_for = profile.name;
    devotion.theme_used = theme || null;
    devotion.generated_at = new Date().toISOString();

    console.log("Successfully generated Phototheology devotion:", devotion.title);

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
