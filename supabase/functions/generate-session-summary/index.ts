import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.76.1";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface SessionData {
  sessionId: string;
  title: string;
  verses: Array<{
    book: string;
    chapter: number;
    verseStart?: number;
    verseEnd?: number;
    notes?: string;
  }>;
  ptInteractions: Array<{
    interactionType: string;
    roomCode?: string;
    floorNumber?: number;
    principleCode?: string;
  }>;
  jeevesInteractions: Array<{
    prompt: string;
    response: string;
    analysisType?: string;
  }>;
  notes: Array<{
    content: string;
    noteType: string;
    relatedVerse?: string;
    relatedRoom?: string;
  }>;
  totalDurationSeconds: number;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { sessionId }: { sessionId: string } = await req.json();

    if (!sessionId) {
      throw new Error('Session ID is required');
    }

    // Get authorization header
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      throw new Error('Authorization header is required');
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Fetch session data with related tables
    const { data: session, error: sessionError } = await supabase
      .from('study_sessions')
      .select('*')
      .eq('id', sessionId)
      .single();

    if (sessionError) throw sessionError;
    if (!session) throw new Error('Session not found');

    // Fetch verses
    const { data: verses } = await supabase
      .from('session_verses')
      .select('*')
      .eq('session_id', sessionId)
      .order('accessed_at', { ascending: true });

    // Fetch PT interactions
    const { data: ptInteractions } = await supabase
      .from('session_pt_interactions')
      .select('*')
      .eq('session_id', sessionId)
      .order('created_at', { ascending: true });

    // Fetch Jeeves interactions
    const { data: jeevesInteractions } = await supabase
      .from('session_jeeves_interactions')
      .select('*')
      .eq('session_id', sessionId)
      .order('created_at', { ascending: true });

    // Fetch notes
    const { data: notes } = await supabase
      .from('session_notes')
      .select('*')
      .eq('session_id', sessionId)
      .order('created_at', { ascending: true });

    // Build the prompt for AI summary
    const formatDuration = (seconds: number) => {
      const hours = Math.floor(seconds / 3600);
      const minutes = Math.floor((seconds % 3600) / 60);
      if (hours > 0) return `${hours} hours and ${minutes} minutes`;
      return `${minutes} minutes`;
    };

    const versesText = verses?.map(v => 
      `${v.book} ${v.chapter}${v.verse_start ? `:${v.verse_start}${v.verse_end && v.verse_end !== v.verse_start ? `-${v.verse_end}` : ''}` : ''}`
    ).join(', ') || 'No verses recorded';

    const ptRoomsText = ptInteractions?.map(p => 
      `${p.room_code || 'Unknown room'} (Floor ${p.floor_number || '?'})`
    ).join(', ') || 'No PT rooms visited';

    const notesText = notes?.map(n => n.content).join('\n- ') || 'No notes recorded';

    const jeevesTopics = jeevesInteractions?.map(j => 
      j.analysis_type || 'general inquiry'
    ).join(', ') || 'No Jeeves interactions';

    const prompt = `You are Jeeves, a warm and knowledgeable Bible study AI assistant. Generate a concise, encouraging summary of a study session.

Session Title: ${session.title || 'Untitled Study Session'}
Duration: ${formatDuration(session.total_duration_seconds || 0)}

Passages Explored: ${versesText}
Phototheology Rooms Visited: ${ptRoomsText}
Jeeves Analysis Topics: ${jeevesTopics}

Notes taken:
- ${notesText}

Instructions:
1. Write a warm 2-3 paragraph summary highlighting the key themes and insights from this session
2. Note any patterns or connections between the passages studied
3. Mention specific PT principles or rooms that were explored
4. End with an encouraging word about their study journey
5. Keep the tone personal, like a mentor summarizing what you learned together
6. Keep it under 250 words`;

    // Call Gemini API for summary
    const geminiApiKey = Deno.env.get('GEMINI_API_KEY');
    
    if (!geminiApiKey) {
      // Fallback to basic summary if no API key
      const basicSummary = `During this ${formatDuration(session.total_duration_seconds || 0)} session titled "${session.title || 'Study Session'}", you explored ${verses?.length || 0} passages and visited ${ptInteractions?.length || 0} Phototheology rooms. You engaged in ${jeevesInteractions?.length || 0} conversations with Jeeves and took ${notes?.length || 0} notes. Keep building your understanding through the Palace method!`;
      
      // Update session with summary
      await supabase
        .from('study_sessions')
        .update({
          ai_summary: basicSummary,
          ai_summary_generated_at: new Date().toISOString()
        })
        .eq('id', sessionId);

      return new Response(JSON.stringify({ summary: basicSummary }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const geminiResponse = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiApiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 500,
          }
        })
      }
    );

    const geminiData = await geminiResponse.json();
    const summary = geminiData.candidates?.[0]?.content?.parts?.[0]?.text || 
      `Great study session! You explored ${verses?.length || 0} passages and engaged with ${ptInteractions?.length || 0} PT rooms during your ${formatDuration(session.total_duration_seconds || 0)} study.`;

    // Update session with AI summary
    await supabase
      .from('study_sessions')
      .update({
        ai_summary: summary,
        ai_summary_generated_at: new Date().toISOString()
      })
      .eq('id', sessionId);

    return new Response(JSON.stringify({ summary }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error generating session summary:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});