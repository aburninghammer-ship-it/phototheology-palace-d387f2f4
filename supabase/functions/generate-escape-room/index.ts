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
      console.error('LOVABLE_API_KEY not found in environment');
      throw new Error('LOVABLE_API_KEY not configured');
    }

    const { mode, category, scenario } = await req.json();
    
    console.log('Generating escape room with params:', { mode, category, scenario });

    let systemPrompt = '';
    let puzzles: any[] = [];

    if (mode === 'room_as_room') {
      // Room-as-Room Escape: Lock players inside ONE specific Palace room's theology
      systemPrompt = `Create a 45-minute "Room-as-Room" escape experience for the ${category} room.

ROOM-AS-ROOM CONCEPT:
Players are LOCKED inside one specific Palace room's theology. The only way out is to correctly use that room's tools on a given biblical text. This trains deep fluency in one methodology.

AVAILABLE ROOMS:
- sanctuary (BL): Sanctuary furniture mapping (Altar→Laver→Table→Lampstand→Incense→Veil→Ark)
- prophecy (PR): Prophetic timelines, Daniel/Revelation symbols, historicist method
- story (SR): Narrative sequencing, story beats, "What happened and in what order?"
- symbols (ST): Biblical typology, symbol profiles (Lamb, Rock, Light, Water, etc.)
- christ_concentration (CR): "Where is Christ in this text?" - Christ-centered interpretation
- dimensions (DR): 5-layer analysis (Literal/Christ/Me/Church/Heaven)

ROOM MECHANICS:
Each room has 3 LOCKS that must be opened using that room's specific method:

For SANCTUARY Room:
- Lock 1 (Furniture): Match 3 verses to 3 sanctuary articles (typology must be correct)
- Lock 2 (Doctrinal Defense): Counter a false teaching using "bread texts" (Word as promise AND command)
- Lock 3 (Gospel Chain): Connect all furniture into one coherent Christ-centered story

For PROPHECY Room:
- Lock 1 (Symbol ID): Correctly identify prophetic symbols using scripture + history
- Lock 2 (Timeline Lock): Place events in prophetic time without inventing dates
- Lock 3 (Mission Application): Show how this prophecy affects justice/mercy/witness today

For STORY Room:
- Lock 1 (Sequence): Retell the passage in plain language, no jargon
- Lock 2 (Immersion): Describe what it feels like to stand IN the scene
- Lock 3 (Memory Frame): Create an unforgettable image for this chapter

For SYMBOLS Room:
- Lock 1 (Type Identification): Identify the type and its antitype with verses
- Lock 2 (Pattern Recognition): Show where else this symbol appears in Scripture
- Lock 3 (Christ Connection): Prove how this type points to Christ

For CHRIST CONCENTRATION Room:
- Lock 1 (Find Jesus): Locate Christ explicitly in the text
- Lock 2 (Gospel Clarity): Explain how this reveals salvation without works-based distortion
- Lock 3 (Apologetic Defense): Answer skeptical objections using this Christ-truth

For DIMENSIONS Room:
- Lock 1 (Literal): State the plain historical/literal meaning
- Lock 2 (Christological): Show the Christ dimension
- Lock 3 (Application Trifecta): Apply to Me + Church + Heaven with specific examples

Create 3 lock-puzzles for the ${category} room with the following structure:
- Each lock has a specific challenge tied to that room's methodology
- Must use KJV verses as keys
- Include FAILURE CONDITIONS (what happens if they get it wrong - e.g., "veil stays shut", "prophetic damage", "detained by authorities")
- Add 1 ESCAPE PUZZLE that synthesizes all 3 locks into final output

SCORING:
- Perfect Lock: 8 pts each (24 total for 3 locks)
- Escape Puzzle: 12 pts
- Total: 36 pts max
- Hints: 2 available (−3 pts each)
- Repeated Principle Penalty: −2 pts

Format as JSON:
{
  "title": "string (e.g., 'Sanctuary Room Escape: Holy Place Trial')",
  "room_focus": "${category}",
  "scenario": "string (immersive setup - you're trapped in this room's theology, 2-3 sentences)",
  "biblical_conclusion": "string (what disciples learn from surviving this room, 2-3 sentences)",
  "puzzles": [
    {
      "puzzle_number": 1,
      "lock_type": "symbol_lock|timeline_lock|gospel_lock|mission_lock",
      "room_tag": "${category === 'sanctuary' ? 'BL' : category === 'prophecy' ? 'PR' : category === 'story' ? 'SR' : category === 'symbols' ? 'ST' : category === 'christ_concentration' ? 'CR' : 'DR'}",
      "principle": "Exact principle from Palace methodology",
      "prompt": "Clear challenge (2-3 sentences)",
      "expected_verses": ["Book Chapter:Verse"],
      "failure_condition": "What happens if wrong (1 sentence)",
      "typology_notes": "Brief hint (1-2 sentences)"
    }
  ]
}`;

    } else if (mode === 'category_gauntlet') {
      // Generate Category Gauntlet puzzles
      systemPrompt = `Create a 60-minute Category Gauntlet escape room for the "${category}" category.

CATEGORY DEFINITIONS:
- prophecy: Dan/Rev spine, timelines, symbols (Beast empires, 70 weeks, 2300 days, sanctuary cleansing)
- sanctuary: Furniture flow (Altar→Laver→Table→Lampstand→Incense→Veil→Ark), Feasts (Passover, Pentecost, Trumpets, Day of Atonement, Tabernacles), priestly typology
- gospel_mission: Christ in every chapter, Room 66 theme threading, Ethics/Church, Great Commission patterns

ROOM ORDER (fixed):
1. Story Room (≅ Type⇄Antitype)
2. Symbols Room (SYM-)
3. Blue/Sanctuary (Altar→Ark walk)
4. Mathematics/Timeline (@70wks, @2300, prophetic periods)
5. Room 66 + 24FPS pairing (Theme threading + Cross frames)

Create 5 puzzles + 1 Meta Boss. Each puzzle must:
- Specify room_tag from valid palace tags
- State the exact principle (core question)
- Give a clear prompt requiring KJV verses
- List 2-4 expected_verses as KJV references
- Include brief typology_notes (1-2 sentences)
- Perfect score: 5 pts, Partial: 3 pts

Meta Boss requirements:
- Multi-room synthesis requiring ≥5 rooms
- 5-7 line Christ-centered commentary
- Score: 10 pts perfect

Format as JSON:
{
  "title": "string (compelling title for this ${category} gauntlet)",
  "biblical_conclusion": "string (2-3 sentence synthesis)",
  "puzzles": [
    {
      "puzzle_number": 1,
      "room_tag": "EXACT tag (e.g., SR, ST, BL, @, FE)",
      "principle": "EXACT core question from that room",
      "prompt": "Clear challenge requiring specific verses (2-3 sentences)",
      "expected_verses": ["Book Chapter:Verse", "Book Chapter:Verse"],
      "typology_notes": "Brief 1-2 sentence guidance"
    }
  ]
}`;

    } else if (mode === 'live_mission') {
      // Live Group Mission: House Fire Edition - Real-time apologetics training
      systemPrompt = `Create a 30-minute "Live Group Mission" escape challenge for real-time group apologetics training.

LIVE MISSION CONCEPT:
This is pastoral discipleship under pressure. One team is "Witnesses" delivering gospel truth in 90 seconds to hostile crowd. Other team plays "The Crowd" with real objections. Then roles switch.

SCENARIO: ${scenario || 'Public Square Evangelism'}

The challenge has 3 ROOMS that teams must clear in sequence:

1. 24FPS ROOM CHALLENGE (Orient in Redemption History):
   - Given verse must be placed in biblical timeline (Creation? Judgment? Rescue?)
   - If team can't orient in the story, they're "disqualified from speaking" (confusion penalty)
   - Question: "Where are we in the drama of redemption?"

2. CHRIST IN EVERY CHAPTER CHALLENGE (Gospel Lock):
   - Must explain how Jesus is revealed in the text, not just judgment/commands
   - If they preach judgment without Christ, they "fail the room" and are "detained"
   - Question: "Where is Christ in this warning/promise/narrative?"

3. MISSION ROOM CHALLENGE (Live Apologetics):
   - 60-second gospel pitch based fully on the text
   - "Crowd" interrupts with real objections:
     * "Church is corrupt"
     * "Religion is colonizer nonsense"
     * "Why does your God judge?"
     * "Sabbath is legalism"
   - If Witnesses survive hostile questioning with coherent Christ-centered answer, they escape

Create 3 room challenges + 1 final apologetics test:

SCORING:
- Clarity (Did they explain gospel or just doom?)
- Scriptural Accuracy (Did they twist the verse?)
- Compassion (Did they sound like Jesus or YouTube anger ministry?)
- Application (Did they connect to real oppression and hope?)
- Perfect: 10 pts per room, Partial: 5 pts
- Final Defense: 15 pts
- Total: 45 pts max

Format as JSON:
{
  "title": "string (e.g., 'Public Square Defense: Revelation 14 Gospel')",
  "scenario": "string (emergency scenario setup, 2-3 sentences)",
  "base_verse": "Book Chapter:Verse",
  "biblical_conclusion": "string (what this trains for street-level evangelism, 2-3 sentences)",
  "puzzles": [
    {
      "puzzle_number": 1,
      "room_tag": "24|CR|MR (matching the 3 challenges)",
      "principle": "Exact principle",
      "prompt": "Challenge prompt (2-3 sentences)",
      "expected_verses": ["Book Chapter:Verse"],
      "crowd_objections": ["Objection 1", "Objection 2", "Objection 3"],
      "typology_notes": "Guidance for gospel-centered response"
    }
  ]
}`;

    } else if (mode === 'async_hunt') {
      // Asynchronous Hunt: 24-Hour Survival Mode - Crisis briefings with timed resolution
      systemPrompt = `Create a 24-hour "Asynchronous Hunt" crisis challenge for group study and defense building.

ASYNC HUNT CONCEPT:
Drop a "Crisis Briefing" - teams have 24 hours to solve it offline, build defense, submit 2-min voice memo or 500-word response. Ranks top teams. Trains real-time doctrinal warfare response.

CRISIS SCENARIOS:
- Influencer attacks Sabbath as legalism
- YouTube preacher says "seal of God" is just Holy Spirit, not obedience
- Reddit thread claims sanctuary typology is "Old Testament irrelevant"
- TikTok viral post: "Adventist prophecy is fear manipulation"

Create CRISIS BRIEFING with:
1. THE ACCUSATION (2-3 sentences of actual online heresy)
2. PROVIDED TEXTS (3 verses they must use)
3. LIMITER RULE (e.g., "No Ellen White quotes - Bible only for non-Adventist audience")
4. DEFENSE REQUIREMENT (What they must prove without falling into works-based OR lawless errors)

LOCKS TO OPEN:
- Gospel Lock: Must defend truth without separating obedience from faith
- Scripture Lock: Must use provided verses (can't import random texts)
- Mission Lock: Must be clear enough for non-Adventist to understand
- Testimony Lock: Must show how this truth affects real life this week (can't fake discipleship)

GRADING CRITERIA:
- Biblical Accuracy (Is it scripturally sound?)
- Christ-Centered (Is it gospel-centered, not works-based?)
- Clarity (Can non-Adventist understand it?)
- Missional (Does it transform life or stay abstract?)
- Perfect: 25 pts, Strong: 18 pts, Partial: 10 pts

Format as JSON:
{
  "title": "string (e.g., 'Crisis: Sabbath Legalism Accusation')",
  "crisis_briefing": "string (the accusation/scenario, 3-4 sentences)",
  "provided_texts": ["Book Chapter:Verse", "Book Chapter:Verse", "Book Chapter:Verse"],
  "limiter_rule": "string (constraint on sources, 1 sentence)",
  "defense_requirement": "string (what they must prove, 2 sentences)",
  "locks": [
    {
      "lock_type": "gospel_lock|scripture_lock|mission_lock|testimony_lock",
      "requirement": "What this lock requires (1 sentence)"
    }
  ],
  "winning_criteria": "string (what makes a winning defense, 2-3 sentences)",
  "biblical_conclusion": "string (discipleship outcome, 2 sentences)"
}`;

    } else if (mode === 'floor_race') {
      // Generate Floor Race puzzles
      systemPrompt = `Create a 60-minute Floor-by-Floor Race escape room with 7 floor puzzles + 1 Summit Meta.

FLOOR THEMES:
1. Foundations (Story + Symbols): Proto-gospel, type-antitype basics
2. Blue/Sanctuary (Altar–Laver): Sacrifice and cleansing typology
3. 24FPS + Christ in Every Chapter: Cross frames across Scripture
4. Mathematics/Timeline + Room 66: Prophetic counts + global gospel
5. Feasts + Blue (Holy Place): Festival typology + furniture
6. Defense/Doctrine + Law/Worship: Spirit personhood + end-time identity
7. Judgment Scene (Dan-Rev): Heavenly court + Rev 14:7

Create 7 floor puzzles + 1 Summit Meta. Each floor puzzle must:
- Use 2-3 rooms from that floor's theme
- Specify room_tag and principle
- Give a clear prompt requiring 2-3 KJV verses
- List expected_verses
- Include brief typology_notes
- Perfect: 4 pts, Partial: 2 pts
- Time cap: 6 minutes per floor

Summit Meta ("Maker, Mercy, Judgment"):
- Requires selecting best verses from prior floors
- One verse each for: Creator, Redeemer, Judge
- 5-7 line synthesis showing why worship (Rev 14:7) requires all three
- Score: 10 pts

Format as JSON:
{
  "title": "string (compelling title for this floor race)",
  "biblical_conclusion": "string (2-3 sentence synthesis)",
  "puzzles": [
    {
      "puzzle_number": 1,
      "floor_number": 1,
      "room_tag": "EXACT tag",
      "principle": "EXACT core question",
      "prompt": "Challenge requiring 2-3 verses (2-3 sentences)",
      "expected_verses": ["Book Chapter:Verse"],
      "typology_notes": "Brief guidance (1-2 sentences)"
    }
  ]
}`;
    }

    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [{ role: 'user', content: systemPrompt }],
      }),
    });

    if (!response.ok) {
      throw new Error(`AI API error: ${response.status}`);
    }

    const aiData = await response.json();
    const content = JSON.parse(aiData.choices[0].message.content);

    // Set expiration based on mode
    const expirationMinutes = mode === 'live_mission' ? 30 : mode === 'room_as_room' ? 45 : mode === 'async_hunt' ? 1440 : 60;
    const expiresAt = new Date(Date.now() + expirationMinutes * 60 * 1000);

    // Insert escape room
    const { data: room, error: roomError } = await supabase
      .from('escape_rooms')
      .insert({
        title: content.title,
        mode: mode,
        category: category || content.room_focus || null,
        difficulty: 'pro',
        time_limit_minutes: expirationMinutes,
        max_hints: mode === 'live_mission' ? 1 : mode === 'room_as_room' ? 2 : mode === 'category_gauntlet' ? 3 : 2,
        biblical_conclusion: content.biblical_conclusion || content.winning_criteria || '',
        expires_at: expiresAt.toISOString(),
      })
      .select()
      .single();

    if (roomError || !room) {
      console.error('Room insert error:', roomError);
      throw roomError;
    }

    console.log('Escape room created:', content.title);

    // Insert puzzles (if applicable - async_hunt uses different structure)
    let puzzleInserts = [];
    
    if (content.puzzles && Array.isArray(content.puzzles)) {
      puzzleInserts = content.puzzles.map((puzzle: any) => {
        let pointsPerfect, pointsPartial;
        
        if (mode === 'room_as_room') {
          pointsPerfect = puzzle.puzzle_number === 4 ? 12 : 8;
          pointsPartial = puzzle.puzzle_number === 4 ? 0 : 4;
        } else if (mode === 'live_mission') {
          pointsPerfect = puzzle.puzzle_number === 4 ? 15 : 10;
          pointsPartial = 5;
        } else if (mode === 'category_gauntlet') {
          pointsPerfect = puzzle.puzzle_number === 6 ? 10 : 5;
          pointsPartial = puzzle.puzzle_number === 6 ? 0 : 3;
        } else {
          pointsPerfect = puzzle.puzzle_number === 8 ? 10 : 4;
          pointsPartial = puzzle.puzzle_number === 8 ? 0 : 2;
        }
        
        return {
          room_id: room.id,
          puzzle_number: puzzle.puzzle_number,
          floor_number: puzzle.floor_number || null,
          room_tag: puzzle.room_tag,
          principle: puzzle.principle || '',
          prompt: puzzle.prompt,
          expected_verses: puzzle.expected_verses || [],
          typology_notes: puzzle.typology_notes || puzzle.failure_condition || '',
          points_perfect: pointsPerfect,
          points_partial: pointsPartial,
          time_cap_minutes: mode === 'floor_race' ? 6 : null,
        };
      });
    }

    if (puzzleInserts.length > 0) {
      const { error: puzzlesError } = await supabase
        .from('escape_room_puzzles')
        .insert(puzzleInserts);

      if (puzzlesError) {
        console.error('Puzzles insert error:', puzzlesError);
        throw puzzlesError;
      }

      console.log(`Inserted ${puzzleInserts.length} puzzles for escape room`);
    }

    return new Response(
      JSON.stringify({
        success: true,
        room_id: room.id,
        title: content.title,
        mode: mode,
        expires_at: expiresAt.toISOString(),
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in generate-escape-room:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    );
  }
});