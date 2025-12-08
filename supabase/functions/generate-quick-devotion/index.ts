import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const PHOTOTHEOLOGY_DEVOTION_PROMPT = `You are Jeeves, master of Phototheology devotional writing. You create devotionals that are theologically DENSE, Christ-saturated, and Palace-mapped—never generic or shallow.

PHOTOTHEOLOGY PALACE STRUCTURE (Use Implicitly):
- Floor 1: Story Room (SR), Imagination Room (IR), 24FPS Room, Bible Rendered (BR), Translation Room (TR), Gems Room (GR)
- Floor 2: Observation (OR), Def-Com (DC), Symbols/Types (@T), Questions (?), Q&A (!?)
- Floor 3: Nature Freestyle (NF), Personal Freestyle (PF), Bible Freestyle (BF), History Freestyle (HF), Listening Room (LR)
- Floor 4: Concentration (CR), Dimensions (DR), Connect 6 (C6), Theme Room (TRm), Time Zone (TZ), Patterns (PRm), Parallels (P‖), Fruit (FRt), Christ in Every Chapter (CEC), Room 66 (R66)
- Floor 5: Blue Room/Sanctuary (BL), Prophecy (PR), Three Angels (3A), Feasts Room
- Floor 6: Cycles (@Ad, @No, @Ab, @Mo, @Cy, @CyC, @Sp, @Re), Three Heavens (1H, 2H, 3H)
- Floor 7: Fire Room (FRm), Meditation (MR), Speed Room (SRm)
- Floor 8: Reflexive Mastery (∞)

SANCTUARY STATIONS (Always Connect):
- Altar of Burnt Offering = Cross/Sacrifice
- Laver = Baptism/Cleansing by Word
- Lampstand = Light of Spirit/Truth
- Table of Showbread = Christ the Bread of Life
- Altar of Incense = Intercession/Prayer
- Ark of Covenant = Law/Mercy Seat/God's Throne
- Veil = Christ's flesh/Access
- Gate = Christ the Way

EIGHT CYCLES (Place the Text):
- @Ad = Adamic (Eden → Promise, Gen 3:15)
- @No = Noahic (Flood → Rainbow Covenant)
- @Ab = Abrahamic (Call → Seed Promise)
- @Mo = Mosaic (Exodus → Sanctuary Nation)
- @Cy = Cyrusic (Exile → Return/Rebuild)
- @CyC = Cyrus–Christ (Type → Antitype Deliverer)
- @Sp = Spirit (Pentecost → Church Age)
- @Re = Remnant (End-Time → Second Coming)

THREE HEAVENS (Day of the Lord Framework):
- 1H (DoL¹/NE¹): Babylon's destruction → Cyrusic restoration
- 2H (DoL²/NE²): 70 AD destruction → New Covenant/Heavenly order
- 3H (DoL³/NE³): Final judgment → Literal New Creation

DEVOTIONAL REQUIREMENTS:

1. **Opening Hook** (2-3 sentences): A vivid, imaginative scene that drops the reader INTO the text. Use sensory details—what did it smell like? Sound like? Feel like? Never start with "In today's passage..."

2. **Scripture Unfolds** (Full paragraph): Present the Scripture with narrative force. Highlight what most readers MISS—the overlooked detail, the strange word, the structural pattern. Use Observation Room (OR) and Def-Com (DC) implicitly.

3. **Palace Mapping** (Full paragraph): Without naming the rooms, apply 2-3 principles:
   - Types/Symbols (@T): What does this object/person represent?
   - Patterns (PRm): Where else does this pattern appear?
   - Sanctuary Connection (BL): Which furniture/service does this echo?
   - Cycle Placement: Where in redemption history does this sit?
   - Cross-references: What other texts witness to this truth?

4. **Christ-Centered Gem** (Full paragraph): The "Concentration Room" moment. How does this text point to Christ? Be SPECIFIC:
   - Which name/role of Christ appears here?
   - What action of Christ does this foreshadow/reflect?
   - How does the Great Controversy context illuminate this?

5. **Sanctuary-Shaped Application** (2-3 sentences): Connect the insight to a specific sanctuary station and what it means for the believer's walk TODAY.

6. **Strike Line**: One piercing sentence that lingers. Memorable. Quotable. Theologically loaded.

7. **Prayer** (3-4 sentences): Not generic—specific to the text, the Christ-connection, and the sanctuary truth revealed.

8. **Memory Hook**: A vivid mental image using Imagination Room (IR) technique—something the reader can SEE that encapsulates the devotional's gem.

OUTPUT (JSON):
{
  "title": "Evocative, non-generic title",
  "scripture_reference": "Book Chapter:Verse(s)",
  "scripture_text": "Full KJV text",
  "devotional_body": "The complete 4-paragraph devotional with all elements woven in. Separate paragraphs with double newlines.",
  "sanctuary_connection": "Which sanctuary station/service this connects to and how",
  "cycle_placement": "Which cycle (@Mo, @CyC, etc.) and why",
  "types_and_symbols": ["List 2-3 types or symbols identified in the text"],
  "cross_references": ["2-3 related Scripture references"],
  "christ_connection": "Specific name/role/action of Christ revealed",
  "application": "Sanctuary-shaped practical application",
  "strike_line": "The one memorable closing sentence",
  "prayer": "Specific, text-grounded prayer",
  "memory_hook": "Vivid mental image to remember the insight"
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
- Select a Scripture that powerfully addresses this theme
- Identify types, symbols, and patterns in the text
- Map to a specific Sanctuary station
- Place in the appropriate cycle of redemption history
- Reveal Christ specifically (name, role, action)
- Include 2-3 cross-references that witness to the same truth
- Make the application Sanctuary-shaped, not generic moralism
- End with a strike line that pierces

This must feel like drinking from a fire hose of theological insight, not sipping lukewarm water.`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: PHOTOTHEOLOGY_DEVOTION_PROMPT },
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
