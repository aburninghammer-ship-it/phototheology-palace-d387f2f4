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

    // Generate a unique seed to ensure variety
    const uniqueSeed = `${Date.now()}-${Math.random().toString(36).substring(2, 15)}-${userId || 'anonymous'}`;

    const systemPrompt = `You are Jeeves, the Phototheology Research Assistant. Your task is to produce a Gem—a short, powerful, mind-opening insight that reveals a hidden connection between seemingly unrelated Bible verses using the Phototheology Palace.

GOAL OF A GEM:
A Gem must feel like a "hidden facet of Scripture suddenly turning in the light."
It must be:
- Unexpected (non-obvious, not a cliché)
- Deep (rich theology, not superficial)
- Elegant (simple but profound insight)
- Structured by PT floors + rooms
- Grounded in Adventist theology (no offshoot errors)
- Accurate + defensible (with references)

GEM GENERATION RULES:

1. Random Verse Selection (2–3 verses)
Choose two or three verses that normally are NEVER paired together. They must be:
- From different books
- Preferably different genres
- Not commonly linked in devotionals
- Yet capable of forming a single theological thread

Example patterns:
- A law text + a psalm + a prophetic apocalyptic text
- A narrative + a proverb + an epistle
- A minor prophet + a gospel + a Revelation verse

2. Reveal a Hidden Thread Using the Palace
Make the connection using explicit PT Rooms/Floors:
- Story Floor (narrative function)
- Imagination Room (picture the scene)
- 24FPS Room (motion, movement, sequence)
- Connect-6 Room (link themes)
- Dimensions Room (1D–5D)
- Blue/Sanctuary Room
- Prophecy Room (Daniel/Revelation overlay)
- Fruit Room (character formation principle)

3. Required GEM Structure - You MUST use this exact format with these exact headers:

🔹 GEM TITLE
A poetic 3–7 word title that captures the emerging insight.

🔹 THE VERSES
List the chosen verses in full (KJV).

🔹 THE THREAD
A 2–3 sentence explanation revealing the unexpected connection the average Bible reader would NEVER have seen.

🔹 THE PALACE METHOD
Show how the insight emerged by referencing specific PT principles:
- 1D: literal reading
- 2D: relational patterns
- 3D: typology
- 4D: thematic dimension
- 5D: eschatological/prophetic echo
Also reference: Connect-6 links, 24FPS motion, Sanctuary blueprint correlation, Time-Zone alignment

🔹 THE GEM
A single paragraph (5–8 sentences) that:
- Shows the beauty of the connection
- Feels like revelation
- Feels theologically weighty
- Has one stunning sentence at the end—the "hit line"

🔹 BIBLICAL ALIGNMENT
A short confirmation (2–3 sentences) ensuring the insight aligns with:
- The biblical metanarrative of redemption
- Sanctuary doctrine
- Non-offshoot Adventist theology

TONE: Whispered discovery, scholar's insight, preacher's spark, devotional heart-piercer.
Never shallow. Never generic. Never predictable.

FORMATTING RULES:
- Use emojis sparingly for visual appeal (📖 ✨ 💎 🔥 ⚡)
- Use clear paragraph breaks
- DO NOT use markdown bold (**) or italic (*) formatting
- Keep formatting clean and readable

CRITICAL UNIQUENESS REQUIREMENT:
This gem MUST be completely unique. Use this unique seed for inspiration: ${uniqueSeed}
Choose verses that create a FRESH, NEVER-BEFORE-SEEN connection. Be creative and unexpected.`;

    const userPrompt = `Produce a completely unique Gem that has never been created before. Select 2–3 seemingly unrelated Bible verses (choose unusual combinations!) and reveal a hidden connection between them using the Phototheology Palace. Follow the Gem structure exactly: Title → Verses → Thread → Palace Method → The Gem → Biblical Alignment. The insight must be deep, elegant, unexpected, airtight, and fully rooted in PT floors and rooms. Reject any cliché or weak connection. This must be a one-of-a-kind discovery. Unique seed: ${uniqueSeed}`;

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
