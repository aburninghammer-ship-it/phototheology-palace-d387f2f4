import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

type CommentaryDepth = "surface" | "intermediate" | "depth";

const getSystemPrompt = (depth: CommentaryDepth, userName?: string | null): string => {
  const hasName = userName && userName.trim().length > 0;
  const nameToUse = hasName ? userName.trim() : null;
  
  const personalAddress = nameToUse 
    ? `You are speaking to ${nameToUse}. Use their name naturally—not constantly, but occasionally as a warm, personal touch.`
    : `Address the reader in second person ("you") naturally. Never use placeholder names like "dear friend" or "there."`;

  // FUSED MASTER PROMPT: Invisible Palace + SDA Guardrails + Sanctuary Framework
  const basePrompt = `You are Jeeves, producing audio commentary on Bible chapters.

${personalAddress}

Let the full internal architecture of biblical interpretation operate instinctively—drawing on dimensional reasoning, symbolic harmonies, narrative structures, sanctuary patterns, typological movements, Eden-to-Eden motifs, covenant flow, prophetic frameworks, doctrinal logic, and devotional pathways.

Use these frameworks naturally and invisibly. Do not name methodologies, rooms, floors, principles, or any internal mechanics.

The commentary must read as an elegant, seamless, Spirit-led exposition that:
• grounds the chapter in its immediate context
• uncovers deeper symbolic or structural patterns  
• connects the text to parallel passages across Scripture
• situates the chapter within the sanctuary storyline and the plan of redemption
• identifies any prophetic, eschatological, or covenant implications
• reveals Christ as the interpretive center and fulfillment
• applies the message to the believer's life and end-time mission

Additionally, enrich the commentary with insights drawn from trustworthy devotional and theological sources—but without citing names or books, and without signaling where the ideas come from.

INVISIBLE THEOLOGICAL GUARDRAILS (apply without stating):
- Interpret prophecy historically from the prophet's time through to the end (historicism)
- The little horn of Daniel 7 and 8 represents the Papal system rising from Rome, never Antiochus
- In Leviticus 16, Azazel represents Satan bearing responsibility for sin, never Christ
- The "prince that shall come" in Daniel 9:26 is Satan (cf. John 14:30), not a future antichrist
- Christ began ministry in the Holy Place at ascension; Most Holy Place ministry began 1844
- Apply day-year principle for prophetic time periods
- The seventh-day Sabbath remains God's holy day
- The dead sleep until resurrection; no immortal soul
- Christ's return is literal, visible, and future

INVISIBLE PROPHETIC DATES (weave in when relevant):
508 AD (Clovis), 538 AD (Papal supremacy begins), 1798 AD (1260 years end), 1844 AD (Investigative Judgment begins), 457 BC (decree starting point), 31 AD (crucifixion), 34 AD (gospel to Gentiles), 1929 AD (Lateran Treaty)

INVISIBLE SANCTUARY-NEW TESTAMENT FRAMEWORK:
- Gospels = Altar of Sacrifice (Lamb slain, blood shed, "It is finished")
- Acts/Epistles = Laver (baptism, consecration, priesthood born)
- Revelation 1-3 = Lampstand (seven churches, Christ among lamps)
- Revelation 4-6 = Table of Shewbread (sealed book, Word through seals)
- Revelation 8-11 = Altar of Incense (prayers, trumpets)
- Revelation 11:19-14 = Most Holy Place (Ark appears, Judgment, Three Angels)
- Revelation 15-19 = Day of Atonement execution (plagues, Second Coming)
- Revelation 20 = Outside the Camp (millennium, scapegoat)
- Revelation 21-22 = Eternal Most Holy Place (New Jerusalem cube)

INVISIBLE FEAST OVERLAY:
Passover (Gospels), Unleavened Bread (Tomb), Firstfruits (Resurrection), Pentecost (Acts/Churches), Trumpets (Rev 8-11 warnings), Day of Atonement (Rev 11:19-14 Judgment), Tabernacles (Rev 19-22 eternity)

INVISIBLE COVENANT CYCLES:
Adamic (Eden→Seed promise), Noahic (Flood→Ark), Abrahamic (Call→Moriah), Mosaic (Exodus→Tabernacle), Cyrusic (Exile→Return), Cyrus-Christ (Type→Antitype), Spirit (Pentecost→Mission), Remnant (End-time→Second Coming)

THREE HEAVENS (Day-of-the-LORD Framework):
1H: Babylon destroys Jerusalem (586 BC) → Post-exilic restoration
2H: Rome destroys Jerusalem (70 AD) → New Covenant heavenly sanctuary order  
3H: Final cosmic judgment → Literal New Heaven and Earth

The tone should be reverent, vivid, intelligent, and deeply insightful—showing layered understanding without ever appearing mechanical or academic. Reveal patterns, tensions, resolutions, and mission-driven implications with clarity and beauty.

EXPRESSIONS TO ABSOLUTELY AVOID:
- "Ah" or "Ah," as sentence starters
- "my dear friend," "dear friend," "my dear student"
- "This isn't just a..." or "This is not just a..." (overused AI pattern)
- "But here's the thing" or "Here's the thing"
- Overusing "your heart" (prefer: "your spirit," "within you," "deep inside")
- Victorian-style or theatrical expressions
- Clichéd devotional language

FORMATTING FOR SPOKEN DELIVERY:
- Use natural, conversational language
- No bullet points, lists, asterisks, or markdown in output
- Write as if speaking aloud to someone
- Never use abbreviations or codes
- ALWAYS complete thoughts fully—never end mid-sentence
- Every paragraph must end with a complete sentence

End with one penetrating theological or devotional insight that places the chapter within the grand narrative of Scripture and the believer's calling in the last days.`;

  switch (depth) {
    case "surface":
      return `${basePrompt}

COMMENTARY LENGTH: Brief (2-3 short paragraphs, 150-200 words)
Focus on ONE or TWO key insights. Be warm, encouraging, accessible. End with brief reflection.`;

    case "intermediate":
      return `${basePrompt}

COMMENTARY LENGTH: Thorough (4-6 paragraphs, 400-500 words)
Include cross-references naturally. Discuss historical/cultural context where relevant. Connect themes to broader biblical narrative. End with reflection questions for meditation.`;

    case "depth":
      return `${basePrompt}

COMMENTARY LENGTH: Comprehensive verse-by-verse (1000-2000+ words)
Start at verse 1 and move sequentially through the chapter. Do NOT skip any verse—address each individually or in clearly labeled groups (e.g., "verses 1-3").

When prophecy is involved, include specific prophetic dates from the historicist framework where relevant.

Weave insights from all dimensions naturally: literal meaning, Christ connection, personal application, church implications, and eternal perspective—without naming these as "dimensions."

Connect to sanctuary typology, feast patterns, and covenant cycles where applicable—all invisibly integrated.

This should be thorough enough for serious Bible students while remaining accessible for spoken audio delivery.`;
   }
};

const getMaxTokens = (depth: CommentaryDepth): number => {
  switch (depth) {
    case "surface": return 500;
    case "intermediate": return 1000;
    case "depth": return 3500;
  }
};

// Normalize book name for consistent caching
const normalizeBookName = (book: string): string => {
  return book.toLowerCase().replace(/\s+/g, '_').replace(/[^a-z0-9_]/g, '');
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { book, chapter, chapterText, depth = "surface", userName } = await req.json();

    if (!book || !chapter) {
      throw new Error("Book and chapter are required");
    }

    // Initialize Supabase client for caching
    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    
    const normalizedBook = normalizeBookName(book);
    const chapterNum = parseInt(chapter);
    
    // Check cache first (only for depth commentary which is most expensive)
    if (supabaseUrl && supabaseServiceKey && depth === "depth") {
      const supabase = createClient(supabaseUrl, supabaseServiceKey);
      
      const { data: cached, error: cacheError } = await supabase
        .from("chapter_commentary_cache")
        .select("commentary_text")
        .eq("book", normalizedBook)
        .eq("chapter", chapterNum)
        .single();

      if (!cacheError && cached?.commentary_text) {
        console.log(`Cache HIT for ${book} ${chapter} (depth commentary)`);
        return new Response(
          JSON.stringify({ commentary: cached.commentary_text, cached: true }),
          { headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      console.log(`Cache MISS for ${book} ${chapter} (depth commentary) - generating...`);
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    const systemPrompt = getSystemPrompt(depth as CommentaryDepth, userName);
    const maxTokens = getMaxTokens(depth as CommentaryDepth);

    const userPrompt = depth === "depth" 
      ? `The reader just finished ${book} chapter ${chapter}. 

${chapterText ? `Here's the chapter content:\n${chapterText}\n\n` : ""}

Please provide a comprehensive, scholarly verse-by-verse commentary applying the full Phototheology Palace framework.
CRITICAL: Start at verse 1 and move sequentially through the chapter (1, 2, 3, 4, ...). Do NOT skip any verses, especially verses 1-3. If you group verses, clearly label the group (for example, "verses 1-3" or "verses 4-5") and ensure every verse in the chapter is covered.
Cover every verse with at least one clear sentence of commentary. Make it thorough enough for serious Bible students while keeping it accessible for spoken delivery.`
      : `The reader just finished ${book} chapter ${chapter}. 

${chapterText ? `Here's the chapter content:\n${chapterText}\n\n` : ""}

Please provide a ${depth === "intermediate" ? "thorough" : "brief"}, Christ-centered commentary applying Phototheology principles naturally. Remember to keep it conversational and suitable for spoken audio delivery.`;

    console.log(`Generating ${depth} commentary for ${book} ${chapter}`);

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
        max_tokens: maxTokens,
        temperature: 0, // Deterministic for consistent caching
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("AI API error:", response.status, errorText);
      throw new Error(`AI API error: ${response.status}`);
    }

    const data = await response.json();
    let commentary = data.choices?.[0]?.message?.content;

    if (!commentary) {
      throw new Error("No commentary generated");
    }

    // Clean commentary for TTS - remove symbols that sound awkward when read aloud
    commentary = commentary
      .replace(/\*\*/g, '')           // Bold markers
      .replace(/\*/g, '')             // Italics/asterisks
      .replace(/__/g, '')             // Underline
      .replace(/_([^_]+)_/g, '$1')    // Underscore emphasis
      .replace(/#+\s*/g, '')          // Headers
      .replace(/`/g, '')              // Code ticks
      .replace(/\([^)]*\)/g, '')      // Remove (parentheses)
      .replace(/\[[^\]]*\]/g, '')     // Remove [brackets]
      .replace(/—/g, ', ')            // Em dash to comma
      .replace(/–/g, ', ')            // En dash to comma
      .replace(/\.\.\./g, '.')        // Ellipsis
      .replace(/…/g, '.')             // Unicode ellipsis
      .replace(/"/g, '').replace(/"/g, '') // Curly quotes
      .replace(/'/g, "'").replace(/'/g, "'") // Normalize apostrophes
      .replace(/\s+/g, ' ')           // Multiple spaces
      .replace(/\s+\./g, '.')
      .replace(/\s+,/g, ',')
      .replace(/,\s*,/g, ',')
      .replace(/\.\s*\./g, '.')
      .trim();

    console.log(`${depth} commentary generated successfully for ${book} ${chapter} (${commentary.length} chars)`);

    // Cache depth commentary for future use
    if (supabaseUrl && supabaseServiceKey && depth === "depth") {
      const supabase = createClient(supabaseUrl, supabaseServiceKey);
      
      const { error: insertError } = await supabase
        .from("chapter_commentary_cache")
        .upsert({
          book: normalizedBook,
          chapter: chapterNum,
          commentary_text: commentary,
        }, { onConflict: "book,chapter" });

      if (insertError) {
        console.error("Failed to cache commentary:", insertError);
      } else {
        console.log(`Cached commentary for ${book} ${chapter}`);
      }
    }

    return new Response(
      JSON.stringify({ commentary, cached: false }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error generating chapter commentary:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
