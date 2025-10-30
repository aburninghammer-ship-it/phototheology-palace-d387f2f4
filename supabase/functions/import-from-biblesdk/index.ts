import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';
import { listBooks, getVerses } from 'npm:biblesdk@latest';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface ImportStats {
  versesImported: number;
  versesUpdated: number;
  errors: string[];
  booksProcessed: string[];
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      {
        auth: {
          persistSession: false,
        },
      }
    );

    // Verify authentication
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      throw new Error('No authorization header');
    }

    const { data: { user }, error: authError } = await supabaseClient.auth.getUser(
      authHeader.replace('Bearer ', '')
    );

    if (authError || !user) {
      throw new Error('Unauthorized');
    }

    // Check if user is admin
    const { data: roles } = await supabaseClient
      .from('user_roles')
      .select('role')
      .eq('user_id', user.id)
      .eq('role', 'admin')
      .maybeSingle();

    if (!roles) {
      throw new Error('Admin access required');
    }

    const { bookIds, startChapter, endChapter } = await req.json();

    console.log('Starting BibleSDK import...', { bookIds, startChapter, endChapter });

    const stats: ImportStats = {
      versesImported: 0,
      versesUpdated: 0,
      errors: [],
      booksProcessed: [],
    };

    // If no specific books provided, get all books
    const booksToProcess = bookIds && bookIds.length > 0 
      ? bookIds 
      : (await listBooks()).map(book => book.id);

    for (const bookId of booksToProcess) {
      try {
        console.log(`Processing book: ${bookId}`);
        
        // Get book info to determine chapter count
        const books = await listBooks();
        const bookInfo = books.find(b => b.id === bookId);
        
        if (!bookInfo) {
          stats.errors.push(`Book ${bookId} not found`);
          continue;
        }

        const chapterStart = startChapter || 1;
        const chapterEnd = endChapter || bookInfo.chapters;

        // Process each chapter
        for (let chapter = chapterStart; chapter <= chapterEnd; chapter++) {
          try {
            // Get all verses for this chapter (1-200 as a safe range)
            const verses = await getVerses(bookId, chapter, [1, 200]);
            
            if (!verses || verses.length === 0) {
              continue;
            }

            // Process each verse
            for (const verse of verses) {
              try {
                // Parse tokens with Strong's numbers if available
                const tokens: any[] = [];
                
                if (verse.strongs && Array.isArray(verse.strongs)) {
                  // BibleSDK provides Strong's numbers
                  const words = verse.text.split(' ');
                  words.forEach((word, idx) => {
                    tokens.push({
                      word: word,
                      strongs: verse.strongs[idx] || null,
                    });
                  });
                } else {
                  // No Strong's data, just store words
                  const words = verse.text.split(' ');
                  words.forEach(word => {
                    tokens.push({ word, strongs: null });
                  });
                }

                // Upsert verse
                const { error: upsertError } = await supabaseClient
                  .from('bible_verses_tokenized')
                  .upsert({
                    book: bookInfo.name,
                    chapter: chapter,
                    verse_num: verse.verse,
                    text_kjv: verse.text,
                    tokens: tokens,
                  }, {
                    onConflict: 'book,chapter,verse_num',
                  });

                if (upsertError) {
                  stats.errors.push(`Error upserting ${bookId} ${chapter}:${verse.verse}: ${upsertError.message}`);
                } else {
                  stats.versesImported++;
                }

              } catch (verseError: any) {
                stats.errors.push(`Error processing verse ${bookId} ${chapter}:${verse.verse}: ${verseError.message}`);
              }
            }

          } catch (chapterError: any) {
            stats.errors.push(`Error processing chapter ${bookId} ${chapter}: ${chapterError.message}`);
          }
        }

        stats.booksProcessed.push(bookId);

      } catch (bookError: any) {
        stats.errors.push(`Error processing book ${bookId}: ${bookError.message}`);
      }
    }

    console.log('Import complete', stats);

    return new Response(
      JSON.stringify({
        success: true,
        statistics: stats,
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );

  } catch (error: any) {
    console.error('Import error:', error);
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message,
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    );
  }
});
