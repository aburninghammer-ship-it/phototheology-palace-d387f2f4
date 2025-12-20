import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Simple hash for content deduplication
function hashContent(content: string): string {
  let hash = 0;
  for (let i = 0; i < content.length; i++) {
    const char = content.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return Math.abs(hash).toString(36);
}

// Generate a discovery spark based on user content
async function generateSpark(
  content: string,
  verseReference: string | undefined,
  surface: string,
  contextType: string,
  mode: 'beginner' | 'standard' | 'master',
  apiKey: string
): Promise<{
  spark_type: 'connection' | 'pattern' | 'application';
  title: string;
  recognition: string;
  insight: string;
  explore: {
    label: string;
    targets: string[];
    mode: string;
  };
  confidence: number;
  novelty_score: number;
  content_hash: string;
} | null> {
  
  const modeInstructions = {
    beginner: 'Focus on clear, foundational connections that are highly relevant and easy to understand. Prioritize practical applications.',
    standard: 'Balance relevance and novelty. Include typological or thematic connections that deepen understanding.',
    master: 'Prioritize novel, unexpected connections. Surface deep patterns, prophetic links, or sanctuary parallels that even advanced students might miss.'
  };

  const systemPrompt = `You are Jeeves, a Phototheology discovery engine. Your task is to generate ONE high-quality "Discovery Spark" based on the user's study content.

A Discovery Spark surfaces hidden connections, patterns, or applications that the student may not have noticed.

${modeInstructions[mode]}

RULES:
- Generate exactly ONE spark
- Choose the most appropriate type: "connection" (links passages/themes), "pattern" (structure/typology/sequence), or "application" (practice/discipleship)
- Title should be evocative and memorable (3-6 words)
- Recognition should acknowledge what the user is studying (1 line)
- Insight should be substantive but focused (3-6 sentences)
- Include 2-4 related Scripture targets for exploration
- Be Christ-centered when natural
- No markdown formatting
- Use warm, scholarly tone

OUTPUT FORMAT (JSON only, no markdown):
{
  "spark_type": "connection" | "pattern" | "application",
  "title": "Short Evocative Title",
  "recognition": "What you're noticing in their study...",
  "insight": "The substantive insight here...",
  "explore": {
    "label": "Explore this idea",
    "targets": ["Genesis 22:8", "Isaiah 53:7", "John 1:29"],
    "mode": "trace"
  },
  "confidence": 0.85,
  "novelty_score": 0.75
}`;

  const userPrompt = `User is studying${verseReference ? ` (${verseReference})` : ''} on ${surface}:

${content}

Generate ONE discovery spark that would genuinely deepen their understanding.`;

  console.log('Generating spark for', surface, 'context...');

  try {
    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        temperature: 0.85,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('AI API error:', response.status, errorText);
      return null;
    }

    const aiData = await response.json();
    const rawContent = aiData.choices[0]?.message?.content;

    if (!rawContent) {
      console.error('No content in AI response');
      return null;
    }

    // Parse JSON from response (handle markdown code blocks)
    let jsonStr = rawContent.trim();
    if (jsonStr.startsWith('```')) {
      jsonStr = jsonStr.replace(/^```(?:json)?\n?/, '').replace(/\n?```$/, '');
    }

    const parsed = JSON.parse(jsonStr);
    
    return {
      ...parsed,
      content_hash: hashContent(content)
    };
  } catch (err) {
    console.error('Error generating spark:', err);
    return null;
  }
}

// Generate explore flow content
async function generateExploreContent(
  exploreMode: 'trace' | 'apply' | 'build',
  spark: { title: string; insight: string; spark_type: string; targets: string[] },
  apiKey: string
): Promise<string> {
  
  const modePrompts = {
    trace: `Based on this spark insight:
"${spark.insight}"

Provide a brief guided trace through these related passages: ${spark.targets.join(', ')}

For each passage:
1. Quote the key verse
2. Show how it connects to the original insight
3. Build toward a unified understanding

Keep it concise (200-300 words). Use warm, scholarly tone. No markdown.`,

    apply: `Based on this spark insight:
"${spark.insight}"

Generate a personal application reflection prompt that helps the reader:
1. Consider how this truth applies to their life
2. Identify a specific area for growth
3. Propose one concrete action step

Keep it conversational and encouraging (150-200 words). No markdown.`,

    build: `Based on this spark insight:
"${spark.insight}"

Create a brief structured mini-study outline:
1. Central Truth (1-2 sentences)
2. Key Passages (list 3-4 with brief notes)
3. Christ Connection (how this points to Jesus)
4. Personal Challenge (one action item)

Keep it concise and actionable (200-250 words). No markdown.`
  };

  const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'google/gemini-2.5-flash',
      messages: [
        { role: 'user', content: modePrompts[exploreMode] }
      ],
      temperature: 0.7,
    }),
  });

  if (!response.ok) {
    throw new Error(`AI API error: ${response.status}`);
  }

  const aiData = await response.json();
  return aiData.choices[0]?.message?.content || 'Unable to generate content.';
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const body = await req.json();
    const { content, verseReference, surface, contextType, contextId, mode, exploreMode, spark, recentHashes } = body;

    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY not configured');
    }

    // Handle explore mode
    if (mode === 'explore' && exploreMode && spark) {
      console.log('Generating explore content for mode:', exploreMode);
      const result = await generateExploreContent(exploreMode, spark, LOVABLE_API_KEY);
      return new Response(
        JSON.stringify({ result }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Handle spark generation
    if (!content || !surface) {
      throw new Error('Missing required fields: content and surface');
    }

    // NOVELTY SUPPRESSION: Check if content hash is too similar to recent sparks
    const contentHash = hashContent(content);
    if (recentHashes && Array.isArray(recentHashes)) {
      const isTooSimilar = recentHashes.some((hash: string) => {
        // Check exact match or very similar (same content)
        return hash === contentHash;
      });
      
      if (isTooSimilar) {
        console.log('⏭️ Skipping spark - content too similar to recent spark');
        return new Response(
          JSON.stringify({ spark: null, message: 'Content too similar to recent spark', suppressed: true }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
    }

    const generatedSpark = await generateSpark(
      content,
      verseReference,
      surface,
      contextType || 'note_block',
      mode || 'standard',
      LOVABLE_API_KEY
    );

    if (!generatedSpark) {
      return new Response(
        JSON.stringify({ spark: null, message: 'No spark generated' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('✅ Generated spark:', generatedSpark.title);

    return new Response(
      JSON.stringify({ spark: generatedSpark }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in generate-spark:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
