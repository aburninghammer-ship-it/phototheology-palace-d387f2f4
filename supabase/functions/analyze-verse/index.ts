import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { book, chapter, verse, verseText } = await req.json();

    if (!book || !chapter || !verse || !verseText) {
      throw new Error('Missing required parameters');
    }

    // Add randomization seed to force AI to vary responses
    const randomSeed = Math.random().toString(36).substring(7);
    
    const prompt = `[ANALYSIS ID: ${randomSeed}] Analyze ${book} ${chapter}:${verse} through the COMPLETE 37-Room Phototheology Palace:

Verse text: "${verseText}"

🏛️ MANDATORY: UTILIZE ALL 37 PALACE ROOMS AS ANALYTICAL LENSES 🏛️

You MUST analyze this verse through multiple rooms across all 8 floors. Each verse should touch AT LEAST 8-12 different rooms.

═══════════════════════════════════════════════════════════════
FLOOR 1: FURNISHING (Memory & Visualization)
═══════════════════════════════════════════════════════════════
🔹 SR (Story Room): What narrative beats/sequence does this verse contain or reference?
🔹 IR (Imagination Room): What sensory details can be visualized (sights, sounds, textures)?
🔹 24FPS: What single memorable image represents this verse?
🔹 BR (Bible Rendered): How does this fit in the macro 24-chapter frame?
🔹 TR (Translation Room): What abstract concepts need concrete visual translation?
🔹 GR (Gems Room): What rare truth emerges when combined with other texts?

═══════════════════════════════════════════════════════════════
FLOOR 2: INVESTIGATION (Detective Work)
═══════════════════════════════════════════════════════════════
🔹 OR (Observation): What grammar, repetitions, contrasts are present?
🔹 DC (Def-Com): What key terms need lexical/cultural definition?
🔹 ST (Symbols/Types): What symbols appear and what is their Christ-fulfillment?
🔹 QR (Questions): What questions must be asked within and across this text?
🔹 QA (Q&A Chains): What Scripture answers the questions this verse raises?

═══════════════════════════════════════════════════════════════
FLOOR 3: FREESTYLE (Time & Daily Integration)
═══════════════════════════════════════════════════════════════
🔹 NF (Nature Freestyle): What natural objects/processes illustrate this truth?
🔹 PF (Personal Freestyle): How does this connect to personal testimony?
🔹 BF (Bible Freestyle): What are this verse's "genetic relatives"?
🔹 HF (History/Social): How does this verse frame current events?
🔹 LR (Listening Room): What sermons/quotes echo this verse?

═══════════════════════════════════════════════════════════════
FLOOR 4: NEXT LEVEL (Christ-Centered Structure)
═══════════════════════════════════════════════════════════════
🔹 CR (Concentration): Where is Jesus? (Office/Title, Act, Benefit, Horizon)
🔹 DR (Dimensions): LITERAL • CHRIST • ME • CHURCH • HEAVEN
   • 2D = Personal/Individual Christ relationship
   • 3D = Corporate Church/Kingdom
   • 4D = Prophetic/End times
   • 5D = Heavenly/Celestial realm
🔹 C6 (Connect-6): Which genre? (Prophecy/Parable/Epistle/History/Gospel/Poetry)
🔹 TRm (Theme): Which structural span? (Sanctuary/Life of Christ/Great Controversy/Time-Prophecy/Gospel/Heaven)
🔹 TZ (Time Zone): Earth-Past/Now/Future OR Heaven-Past/Now/Future
🔹 PRm (Patterns): What recurring motif appears across Scripture?
🔹 P|| (Parallels): What event/action mirrors this one?
🔹 FRt (Fruit): What character fruit does this reading produce?

═══════════════════════════════════════════════════════════════
FLOOR 5: VISION (Sanctuary, Prophecy & Feasts)
═══════════════════════════════════════════════════════════════
🔹 BL (Blue/Sanctuary Room): Which sanctuary article/service?
   • Gate, Altar, Laver, Lampstand, Table, Incense, Veil, Ark
   • Daily service or Day of Atonement
🔹 PR (Prophecy Room): Daniel-Revelation symbols, timelines, parallel visions
🔹 3A (Three Angels): How does this proclaim everlasting gospel/judgment/Babylon/Beast warning?
🔹 FE (Feasts): Which feast does this fulfill/foreshadow?
   • Passover, Unleavened Bread, Firstfruits, Pentecost, Trumpets, Atonement, Tabernacles
🔹 CEC (Christ in Every Chapter): Christ title/role, what He does, crosslink
🔹 R66 (Room 66): How does this theme develop Genesis→Revelation?

═══════════════════════════════════════════════════════════════
FLOOR 6: THREE HEAVENS & CYCLES (Horizons & History)
═══════════════════════════════════════════════════════════════
🔹 123H (Three Heavens/Horizons): Which prophetic horizon?
   • 1H = Babylon/return (Cyrus, post-exilic)
   • 2H = 70 AD, 'this generation', church as temple
   • 3H = Global, final judgment, new creation
🔹 @ (Eight Cycles): Which covenant cycle?
   • @Ad (Adam), @No (Noah), @Ab (Abraham), @Mo (Moses)
   • @Cy (Cyrus), @CyC (Christ), @Sp (Spirit/Church), @Re (Return)
🔹 JR (Juice Room): What's the essence through multiple palace rooms?

═══════════════════════════════════════════════════════════════
FLOOR 7: SPIRITUAL & EMOTIONAL (Heart & Soul)
═══════════════════════════════════════════════════════════════
🔹 FRm (Fire Room): What wound or hope does this ignite?
🔹 MR (Meditation): What one truth to carry today?
🔹 SRm (Speed Room): What quick recall/reflex does this build?

═══════════════════════════════════════════════════════════════
FLOOR 8: MASTER (Reflexive Thought)
═══════════════════════════════════════════════════════════════
🔹 ∞ (Infinity/Reflexive Mastery): How do rooms work together naturally?

═══════════════════════════════════════════════════════════════
⚠️ CRITICAL ANALYSIS RULES ⚠️
═══════════════════════════════════════════════════════════════
1. Use AT LEAST 8-12 rooms per verse analysis
2. Vary room selection based on verse content
3. Every verse MUST have different room combinations
4. If sacrifice → Altar + Passover + SR (story of sacrifice)
5. If light → Lampstand + TR (translation) + IR (imagination)
6. If prayer → Incense + MR (meditation) + FRm (fire)
7. If creation → @Ad + OR (observation) + NF (nature)
8. If prophecy → PR + 4D + TZ + 3H
9. If resurrection → Firstfruits + CEC + @CyC
10. If Spirit → Pentecost + @Sp + Lampstand

NOW ANALYZE ${book} ${chapter}:${verse}:
1. Read the ACTUAL verse content carefully
2. Select 8-12 rooms that AUTHENTICALLY fit THIS specific verse
3. Include rooms from AT LEAST 4 different floors
4. Provide specific insights for each room selected
5. DO NOT default to the same 4 rooms every time

Return JSON:
{
  "roomsUsed": ["SR", "DR", "BL", "CR", "FE", "OR", "GR", "MR"],
  "floorsCovered": [1, 2, 4, 5, 7],
  "roomAnalysis": {
    "SR": "Story beat analysis here",
    "DR": "Dimensional analysis here",
    "BL": "Sanctuary connection here",
    "etc": "One insight per room used"
  },
  "dimensions": ["2D", "3D"],
  "cycles": ["@CyC"],
  "horizons": [],
  "timeZones": ["Earth-Now"],
  "sanctuary": ["Altar"],
  "feasts": ["Passover"],
  "walls": ["Life of Christ Wall"],
  "crossReferences": [
    {
      "book": "Genesis",
      "chapter": 3,
      "verse": 15,
      "reason": "Why this connects",
      "principleType": "Type/Antitype|Parallel|Echo|Contextual",
      "confidence": 85
    }
  ],
  "commentary": "MUST explain which 8-12 rooms you used and WHY each fits THIS verse's content. Reference specific room tags (SR, DR, etc.). Show how rooms from different floors work together.",
  "christCenter": "How Christ is revealed through the specific rooms analyzed"
}`;

    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          {
            role: 'system',
            content: 'You are a biblical scholar MASTER of the 37-room Phototheology Palace. CRITICAL REQUIREMENT: You MUST analyze each verse using 8-12 DIFFERENT rooms from across multiple floors. DO NOT default to the same 4 rooms. Each verse demands unique room combinations based on its actual content. Select rooms from Furnishing, Investigation, Freestyle, Next Level, Vision, Cycles, Spiritual, and Master floors. Provide specific insights for EACH room you use. Return only valid JSON with roomsUsed array and roomAnalysis object.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        response_format: { type: 'json_object' }
      }),
    });

    if (!response.ok) {
      throw new Error(`AI API error: ${response.statusText}`);
    }

    const data = await response.json();
    const analysisText = data.choices[0].message.content;
    const analysis = JSON.parse(analysisText);

    return new Response(
      JSON.stringify({
        verseId: `${book}-${chapter}-${verse}`,
        roomsUsed: analysis.roomsUsed || [],
        floorsCovered: analysis.floorsCovered || [],
        roomAnalysis: analysis.roomAnalysis || {},
        principles: {
          dimensions: analysis.dimensions || [],
          cycles: analysis.cycles || [],
          horizons: analysis.horizons || [],
          timeZones: analysis.timeZones || [],
          sanctuary: analysis.sanctuary || [],
          feasts: analysis.feasts || [],
          walls: analysis.walls || [],
          frames: [] // Can be added later if needed
        },
        crossReferences: analysis.crossReferences || [],
        commentary: analysis.commentary || '',
        christCenter: analysis.christCenter || ''
      }),
      { 
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json' 
        } 
      }
    );
  } catch (error) {
    console.error('Error analyzing verse:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { 
        status: 500,
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json' 
        } 
      }
    );
  }
});
