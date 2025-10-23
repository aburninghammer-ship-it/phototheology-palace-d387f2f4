import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY not configured');
    }

    // Generate tomorrow's content
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(6, 0, 0, 0);

    console.log('Generating content for:', tomorrow.toISOString());

    // Generate Daily Challenge
    const challengePrompt = `Create a Phototheology-based daily Bible study challenge that helps users memorize scripture using the 8-floor memory palace method (Foundation, Wisdom, Kingdom, Law, Grace, Prophecy, Glory, New Creation).

Requirements:
- Title: Engaging and descriptive
- Description: Guide users to create vivid mental images connecting verses. Include specific visualization instructions and practical applications.
- Select 3 related verses that build on each other
- Difficulty: choose from easy, intermediate, advance, or pro
- Focus on one of these themes: Sanctuary furniture, Biblical feasts, Prophetic timelines, Christ's ministry, or Memory palace techniques

Format your response as JSON:
{
  "title": "string",
  "description": "string (100-200 words with specific visualization instructions)",
  "verses": ["reference 1", "reference 2", "reference 3"],
  "difficulty": "easy|intermediate|advance|pro"
}`;

    const challengeResponse = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [{ role: 'user', content: challengePrompt }],
      }),
    });

    if (!challengeResponse.ok) {
      throw new Error(`AI API error: ${challengeResponse.status}`);
    }

    const challengeData = await challengeResponse.json();
    const challengeContent = JSON.parse(challengeData.choices[0].message.content);

    // Insert challenge
    const { error: challengeError } = await supabase
      .from('challenges')
      .insert({
        title: challengeContent.title,
        description: challengeContent.description,
        verses: challengeContent.verses,
        difficulty: challengeContent.difficulty,
        challenge_type: 'daily',
        starts_at: tomorrow.toISOString(),
      });

    if (challengeError) {
      console.error('Challenge insert error:', challengeError);
      throw challengeError;
    }

    console.log('Daily challenge created:', challengeContent.title);

    // Generate Treasure Hunt - "COME AND SEE" Format
    const huntPrompt = `Create a 24-hour biblical treasure hunt with exactly 10 Palace-coded clues. Theme: "Come and See" - invitation to encounter Christ across Story, Symbols, Blue/Sanctuary, 24FPS, Room 66, Mathematics/Timeline, Feasts, and Church/Mission rooms.

CRITICAL: Use ONLY these valid room tags and their associated principles from the palace data:

FLOOR 1 - FURNISHING:
- SR (Story Room): "What exactly happened—and in what order?"
- IR (Imagination Room): "What does it feel like to stand there?"
- 24 (24FPS Room): "What image will make this chapter unforgettably findable?"
- BR (Bible Rendered): "What block image captures this 24-chapter arc?"
- TR (Translation Room): "What does this verse look like?"
- GR (Gems Room): "What beautiful truth emerges when I combine these seemingly unrelated texts?"

FLOOR 2 - INVESTIGATION:
- OR (Observation Room): "What is there—exactly?"
- DC (Def-Com Room): "What did the words mean then, and what did the world look like there?"
- ST (Symbols/Types Room): "What is this symbol's consistent meaning and Christ-fulfillment?"
- QR (Questions Room): "What must be asked inside the text, across texts, and in PT-framework?"
- QA (Q&A Chains Room): "Where does the Bible itself supply the answer?"

FLOOR 3 - FREESTYLE:
- NF (Nature Freestyle): "What does this natural object teach about God's Word?"
- PF (Personal Freestyle): "Where is God writing lessons in my story?"
- BF (Bible Freestyle): "What verses are this verse's 'relatives'?"
- HF (History/Social Freestyle): "How does this secular historical event or social phenomenon illuminate the Bible passage?"
- LR (Listening Room): "What verse does this quote/sermon/conversation echo?"

FLOOR 4 - NEXT LEVEL:
- CR (Concentration Room): "Where is Jesus here?"
- DR (Dimensions Room): "How does this text speak to each dimension?"
- C6 (Connect-6): "What genre is this, and how should I read it?"
- TRm (Theme Room): "Which theological span does this text primarily occupy?"
- TZ (Time Zone): "Where does this event sit in God's timeline?"
- PRm (Patterns Room): "What pattern repeats across Scripture?"
- P‖ (Parallels Room): "What event echoes this one?"
- FRt (Fruit Room): "What fruit does this reading produce?"

FLOOR 5 - VISION:
- BL (Blue Room — Sanctuary): "Which sanctuary article/service does this map to?"
- PR (Prophecy Room): "What does this prophetic symbol represent?"
- 3A (Three Angels Room): "How does this text proclaim the everlasting gospel?"
- FE (Feasts Room): "Which feast does this fulfill or foreshadow?"
- CEC (Christ in Every Chapter): "How is Jesus present in this chapter?"
- R66 (Room 66): "How does this theme develop from Genesis to Revelation?"

FLOOR 6 - THREE HEAVENS & CYCLES:
- 1H/2H/3H (Three Heavens): "Which horizon does this prophecy/promise address?"
- @ (Eight Cycles): "Which covenant cycle does this narrative fit?"
- JR (Juice Room): "What is the essence of this book through the palace lens?"

FLOOR 7 - SPIRITUAL & EMOTIONAL:
- FRm (Fire Room): "What wound or hope does this text speak to?"
- MR (Meditation Room): "What one truth will I carry today?"
- SRm (Speed Room): "Can I produce this knowledge under pressure?"

FLOOR 8 - MASTER:
- ∞ (Reflexive Mastery): "Am I thinking Phototheologically without thinking about it?"

Requirements for the 10 clues:
1. Must use one of the EXACT room tags above (not made-up ones)
2. Principle must match the room's core question exactly
3. Each hint must be a MULTI-LAYERED challenge requiring:
   - Cross-referencing multiple books of the Bible
   - Understanding typological patterns or Hebrew/Greek context
   - Recognizing theological connections across testaments
   - Deep synthesis requiring several hours per clue
4. Hint should NOT be answerable with simple verse lookup
5. Correct answer should be a precise KJV verse reference
6. Progress through different floors to showcase the palace system
7. The first letter of each answer's BOOK NAME will spell "COME AND SEE"

Target book sequence for acrostic (first letters):
C-O-M-E-A-N-D-S-E-E = 1 Corinthians, Obadiah, Micah, Exodus, Acts, Numbers, Daniel, Psalms, Ephesians, Ecclesiastes

Example clue structure:
- Room tag: "CR" (Concentration Room)
- Principle: "Where is Jesus here?"
- Hint: "Paul declared the heart of the gospel message as a scandal to some and foolishness to others. In which verse does he identify this central proclamation as 'Christ crucified,' the stumbling block that became the cornerstone of salvation? This requires understanding the cultural context of Corinth, the Jewish expectation of signs, and the Greek pursuit of wisdom—all converging at the cross." (3-5 sentences like this)
- Correct answer: "1 Corinthians 1:23"

Difficulty: ALWAYS "pro" (10 clues, maximum 24-hour challenge)

Theme: "Come and See" - an invitation to encounter Christ through Scripture

Format as JSON:
{
  "title": "string (compelling and mysterious, should reference 'Come and See' theme)",
  "difficulty": "pro",
  "biblical_conclusion": "string (profound synthesis connecting all clues to the invitation to encounter Christ, 2-3 sentences)",
  "clues": [
    {
      "room_tag": "EXACT tag from list above",
      "principle": "EXACT core question from that room",
      "hint": "Multi-layered question requiring extensive research (3-5 sentences describing the theological challenge)",
      "correct_answer": "KJV verse reference (Book Chapter:Verse)"
    }
  ]
}`;

    const huntResponse = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [{ role: 'user', content: huntPrompt }],
      }),
    });

    if (!huntResponse.ok) {
      throw new Error(`AI API error for hunt: ${huntResponse.status}`);
    }

    const huntData = await huntResponse.json();
    const huntContent = JSON.parse(huntData.choices[0].message.content);

    // Calculate expiration (24 hours from tomorrow start)
    const expiration = new Date(tomorrow.getTime() + 24 * 60 * 60 * 1000);

    // Insert treasure hunt
    const { data: hunt, error: huntError } = await supabase
      .from('treasure_hunts')
      .insert({
        title: huntContent.title,
        difficulty: huntContent.difficulty,
        total_clues: huntContent.clues.length,
        biblical_conclusion: huntContent.biblical_conclusion,
        expires_at: expiration.toISOString(),
      })
      .select()
      .single();

    if (huntError || !hunt) {
      console.error('Hunt insert error:', huntError);
      throw huntError;
    }

    console.log('Treasure hunt created:', huntContent.title);

    // Insert clues
    const clues = huntContent.clues.map((clue: any, index: number) => ({
      hunt_id: hunt.id,
      clue_number: index + 1,
      room_tag: clue.room_tag,
      principle: clue.principle,
      hint: clue.hint,
      correct_answer: clue.correct_answer,
    }));

    const { error: cluesError } = await supabase
      .from('treasure_hunt_clues')
      .insert(clues);

    if (cluesError) {
      console.error('Clues insert error:', cluesError);
      throw cluesError;
    }

    console.log(`Inserted ${clues.length} clues for hunt`);

    return new Response(
      JSON.stringify({
        success: true,
        challenge: challengeContent.title,
        hunt: huntContent.title,
        scheduled_for: tomorrow.toISOString(),
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in daily-content-generator:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    );
  }
});
