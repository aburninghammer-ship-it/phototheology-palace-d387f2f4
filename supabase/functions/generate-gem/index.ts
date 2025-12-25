import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Simple hash function for content deduplication
function hashContent(content: string): string {
  let hash = 0;
  for (let i = 0; i < content.length; i++) {
    const char = content.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return Math.abs(hash).toString(36);
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY not configured');
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Get user ID from auth header if available
    const authHeader = req.headers.get('authorization');
    let userId: string | null = null;
    if (authHeader) {
      const token = authHeader.replace('Bearer ', '');
      const { data: { user } } = await supabase.auth.getUser(token);
      userId = user?.id || null;
    }

    // Get IP for anonymous rate limiting
    const clientIp = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 
                     req.headers.get('x-real-ip') || 
                     'unknown';

    // Check daily gem limit (3 per day)
    const DAILY_LIMIT = 3;
    const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
    
    let gemsToday = 0;
    if (userId) {
      // Check by user ID
      const { count, error: countError } = await supabase
        .from('generated_gems')
        .select('*', { count: 'exact', head: true })
        .eq('generated_for_user_id', userId)
        .gte('created_at', `${today}T00:00:00.000Z`);
      
      if (countError) {
        console.error('Error checking daily limit:', countError);
      } else {
        gemsToday = count || 0;
      }
    } else {
      // For anonymous users, use a simpler approach - check by IP in last 24 hours
      // We'll store IP in the content field metadata or use a separate tracking mechanism
      // For now, anonymous users share a pool - we check total anonymous gems today
      const { count, error: countError } = await supabase
        .from('generated_gems')
        .select('*', { count: 'exact', head: true })
        .is('generated_for_user_id', null)
        .gte('created_at', `${today}T00:00:00.000Z`);
      
      if (countError) {
        console.error('Error checking anonymous daily limit:', countError);
      } else {
        // Anonymous users share a more generous pool (30 total per day)
        if ((count || 0) >= 30) {
          return new Response(
            JSON.stringify({ 
              error: 'Daily gem limit reached for anonymous users. Sign in for your personal daily limit.',
              limit_reached: true
            }),
            { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }
      }
    }

    if (userId && gemsToday >= DAILY_LIMIT) {
      return new Response(
        JSON.stringify({ 
          error: `You've discovered ${DAILY_LIMIT} gems today. Return tomorrow for more treasures!`,
          limit_reached: true,
          gems_today: gemsToday,
          daily_limit: DAILY_LIMIT
        }),
        { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`User ${userId || 'anonymous'} has generated ${gemsToday}/${DAILY_LIMIT} gems today`);

    // Generate a unique seed to ensure variety
    const uniqueSeed = `${Date.now()}-${Math.random().toString(36).substring(2, 15)}-${userId || 'anonymous'}`;

    const systemPrompt = `You are Jeeves, the Phototheology Research Assistant.

═══════════════════════════════════════════════════════════════
🔷 PT GEM REFINEMENT PROTOCOL (MANDATORY)
═══════════════════════════════════════════════════════════════

Your task is NOT to preach, speculate, or creatively associate ideas.
Your task is to extract and articulate a theological insight that is:
- TEXTUALLY ANCHORED
- STRUCTURALLY SOUND
- SYMBOLICALLY DISCIPLINED

Before generating any gem, you MUST apply all 6 filters below.

───────────────────────────────────────────────────────────────
1️⃣ TEXTUAL ANCHOR TEST
───────────────────────────────────────────────────────────────
Ask first: What is the exact biblical text this insight comes from?

Rules:
- No idea may stand without an identifiable textual anchor
- If the idea relies on multiple passages, state which is PRIMARY
- Do not infer meaning beyond what the text can reasonably sustain
- If a claim cannot be traced to a specific verse, label it as theological reflection, NOT biblical assertion

───────────────────────────────────────────────────────────────
2️⃣ COVENANTAL PLACEMENT CHECK
───────────────────────────────────────────────────────────────
Determine where this insight belongs within the covenantal flow:

@Ad (Adamic) → @No (Noahic) → @Ab (Abrahamic) → @Mo (Mosaic) → 
@Cy (Cyrusic) → @CyC (Cyrus-Christ) → @Sp (Spirit Age) → @Re (Remnant)

Ask: Which covenantal phase does this text primarily operate in?
Do NOT blend phases unless the text itself clearly bridges them.

───────────────────────────────────────────────────────────────
3️⃣ PATTERN VALIDATION (ANTI-FREE ASSOCIATION RULE)
───────────────────────────────────────────────────────────────
Before making symbolic connections, VERIFY:

- Is the pattern EXPLICITLY present in Scripture?
- Is it STRUCTURALLY repeated elsewhere, or only implied?
- Is this a TEXTUAL connection or a THEMATIC resemblance?

If the connection is thematic only, label as ILLUSTRATIVE, not doctrinal.

───────────────────────────────────────────────────────────────
4️⃣ HIERARCHY OF MEANING CHECK
───────────────────────────────────────────────────────────────
Rank interpretations in this order (NEVER reverse):

1. TEXTUAL meaning (what the passage literally says)
2. CANONICAL context (how Scripture elsewhere uses it)
3. THEOLOGICAL implication
4. DEVOTIONAL or symbolic application

───────────────────────────────────────────────────────────────
5️⃣ RESTRAINT TEST (CRITICAL)
───────────────────────────────────────────────────────────────
Before finalizing, ask:

- Am I claiming MORE than the text allows?
- Am I collapsing FUTURE fulfillment into PRESENT meaning?
- Am I turning a PATTERN into a PROPHECY?
- Am I confusing RESONANCE with REVELATION?

If yes to ANY, revise DOWNWARD.

───────────────────────────────────────────────────────────────
6️⃣ FINAL OUTPUT FORMAT (MANDATORY)
───────────────────────────────────────────────────────────────
Every Gem MUST end in this exact structure:

📖 TEXT:
(Primary verse or passage with full KJV text)

🔄 CYCLE:
(Identify: Adamic, Noahic, Abrahamic, Mosaic, Cyrusic, Cyrus-Christ, Spirit, or Remnant)

💎 CORE INSIGHT:
(One sentence, tightly reasoned—the diamond of the gem)

⚠️ LIMITS:
(What this insight does NOT claim—intellectual honesty)

🙏 APPLICATION (OPTIONAL):
(Only if it flows naturally from the text—no forced devotionalism)

───────────────────────────────────────────────────────────────
SUMMARY RULE (DO NOT BREAK)
───────────────────────────────────────────────────────────────
A TRUE Gem CLARIFIES Scripture.
A FALSE gem DECORATES it.

If the insight clarifies the biblical movement, it PASSES.
If it merely sounds profound, it FAILS.

═══════════════════════════════════════════════════════════════
PHOTOTHEOLOGY MASTER FRAMEWORK (INVISIBLE TO USER)
═══════════════════════════════════════════════════════════════

6 PICTURE PATTERN WALLS:
1. CHRIST WALL - Types, shadows, names, offices of Christ
2. SANCTUARY WALL - Furniture, services, feasts, garments
3. PROPHETIC WALL - Daniel/Revelation timelines, beasts, kingdoms
4. HISTORIC WALL - 8 Cycles repeating
5. GOSPEL WALL - Justification, sanctification, glorification
6. HEAVEN WALL - New creation, throne room, eternal order

6 DIMENSIONS:
1. LITERAL - Original context meaning
2. CHRIST - How this points to Jesus
3. ME - Personal believer application
4. CHURCH - Corporate application through history
5. HEAVEN FUTURE - Eschatological fulfillment
6. HEAVEN PAST - Cosmic backstory

5 CHRIST TRACERS:
1. THE INNOCENT SUFFERER - Joseph, David, Job → Christ's unjust suffering
2. THE SUBSTITUTE - Sacrifices, lambs, scapegoat → Atonement
3. THE DELIVERER - Moses, judges, kings → Redemption
4. THE COVENANT MEDIATOR - Prophets, priests → Mediation
5. THE RESTORER/BRIDEGROOM/KING - Boaz, Solomon → Reign and union

7 FEAST PATTERNS:
Passover → Unleavened Bread → Firstfruits → Pentecost → Trumpets → Atonement → Tabernacles

3 HEAVENS FRAMEWORK:
- 1H (DoL¹/NE¹): Babylon destruction → Post-exilic restoration
- 2H (DoL²/NE²): 70 AD destruction → New Covenant heavenly order
- 3H (DoL³/NE³): Final judgment → Literal new heaven/earth

═══════════════════════════════════════════════════════════════
GEM GENERATION RULES
═══════════════════════════════════════════════════════════════

1. SELECT 2-3 VERSES from different books that are NEVER normally paired
2. Apply ALL 6 FILTERS before output
3. SHOW the connection—DO NOT explain methodology
4. Use at least 1 Christ tracer and 2 of the 6 walls
5. Layer through at least 3 dimensions

FORMATTING:
- Use emojis sparingly for visual appeal
- Use clear paragraph breaks
- DO NOT use markdown bold/italic
- DO NOT explain which Palace rooms were used
- The LIMITS section is MANDATORY—show intellectual restraint

UNIQUENESS: Use seed ${uniqueSeed} for fresh, never-before-seen connections.`;

    const userPrompt = `Generate a Phototheology Gem.

STEP 1: Select 2-3 Bible verses from DIFFERENT books that are NEVER normally paired together.

STEP 2: Apply the 6 FILTERS internally (Textual Anchor, Covenantal Placement, Pattern Validation, Hierarchy of Meaning, Restraint Test).

STEP 3: Produce the gem in this EXACT format:

🔹 GEM TITLE
(3-7 word poetic title)

📖 TEXT:
(List the chosen verses in full KJV)

🔄 CYCLE:
(Which covenant cycle: Adamic/Noahic/Abrahamic/Mosaic/Cyrusic/Cyrus-Christ/Spirit/Remnant)

🔗 THE THREAD:
(2-3 sentences revealing the unexpected connection)

💎 CORE INSIGHT:
(One sentence—the diamond of this gem)

✨ THE GEM:
(5-8 sentence paragraph showing the beauty, feeling like revelation, with a stunning "hit line" at the end)

⚠️ LIMITS:
(What this insight does NOT claim—2-3 sentences of intellectual restraint)

🙏 APPLICATION:
(Only if natural—no forced devotionalism)

📜 BIBLICAL ALIGNMENT:
(2-3 sentences confirming alignment with biblical metanarrative, sanctuary doctrine, and non-offshoot Adventist theology)

CRITICAL: The insight must CLARIFY Scripture, not merely decorate it. Be unexpected, deep, elegant, and grounded.

Unique seed: ${uniqueSeed}`;

    console.log('Generating unique gem with Lovable AI...');
    
    let gemContent: string | null = null;
    let gemTitle = 'Untitled Gem';
    let attempts = 0;
    const maxAttempts = 3;

    while (attempts < maxAttempts) {
      attempts++;
      console.log(`Generation attempt ${attempts}/${maxAttempts}`);

      const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${LOVABLE_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'google/gemini-2.5-flash',
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: userPrompt + ` (attempt ${attempts})` }
          ],
          temperature: 0.95, // Higher temperature for more variety
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('AI API error:', response.status, errorText);
        
        if (response.status === 429) {
          return new Response(
            JSON.stringify({ error: 'Rate limit exceeded. Please try again in a moment.' }),
            { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }
        if (response.status === 402) {
          return new Response(
            JSON.stringify({ error: 'AI credits depleted. Please add credits to continue.' }),
            { status: 402, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }
        
        throw new Error(`AI API error: ${response.status}`);
      }

      const data = await response.json();
      const candidateContent = data.choices[0]?.message?.content;

      if (!candidateContent) {
        console.error('No content in AI response, retrying...');
        continue;
      }

      // Generate a hash of the content (normalize whitespace first)
      const normalizedContent = candidateContent.replace(/\s+/g, ' ').trim();
      const contentHash = hashContent(normalizedContent);

      // Check if this gem already exists
      const { data: existingGem, error: checkError } = await supabase
        .from('generated_gems')
        .select('id')
        .eq('content_hash', contentHash)
        .maybeSingle();

      if (checkError) {
        console.error('Error checking for existing gem:', checkError);
      }

      if (existingGem) {
        console.log(`Duplicate gem detected (hash: ${contentHash}), regenerating...`);
        continue;
      }

      // This gem is unique! Store it
      gemContent = candidateContent;
      
      // Extract title from the gem content
      const titleMatch = candidateContent.match(/🔹 GEM TITLE[\s\S]*?["\"]?([^"\n]+)["\"]?(?=\n|🔹)/i) ||
                         candidateContent.match(/GEM TITLE[:\s]*["\"]?([^"\n]+)["\"]?/i);
      gemTitle = titleMatch ? titleMatch[1].trim().replace(/^["']|["']$/g, '') : 'Untitled Gem';

      // Store the gem for future uniqueness checks
      const { error: insertError } = await supabase
        .from('generated_gems')
        .insert({
          content_hash: contentHash,
          title: gemTitle,
          content: candidateContent,
          generated_for_user_id: userId
        });

      if (insertError) {
        console.error('Error storing gem:', insertError);
        // Continue anyway, the gem is still valid
      } else {
        console.log(`Stored unique gem with hash: ${contentHash}`);
      }

      break;
    }

    if (!gemContent) {
      throw new Error('Failed to generate a unique gem after multiple attempts');
    }

    console.log('✅ Unique gem generated successfully:', gemTitle);

    return new Response(
      JSON.stringify({ 
        gem: gemContent,
        title: gemTitle
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in generate-gem:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
