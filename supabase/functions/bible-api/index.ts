import { serve } from "https://deno.land/std@0.224.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Helper function to delay execution
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Primary API: bible-api.com
async function fetchFromBibleApi(book: string, chapter: number, version: string): Promise<Response> {
  const url = `https://bible-api.com/${encodeURIComponent(book)}+${chapter}?translation=${version}`;
  return fetch(url);
}

// Fallback API: labs.bible.org (NET Bible)
async function fetchFromBibleOrg(book: string, chapter: number): Promise<any> {
  // Map common book names to bible.org format
  const bookMap: Record<string, string> = {
    'genesis': 'Gen', 'exodus': 'Exod', 'leviticus': 'Lev', 'numbers': 'Num',
    'deuteronomy': 'Deut', 'joshua': 'Josh', 'judges': 'Judg', 'ruth': 'Ruth',
    '1 samuel': '1Sam', '2 samuel': '2Sam', '1 kings': '1Kgs', '2 kings': '2Kgs',
    '1 chronicles': '1Chr', '2 chronicles': '2Chr', 'ezra': 'Ezra', 'nehemiah': 'Neh',
    'esther': 'Esth', 'job': 'Job', 'psalms': 'Ps', 'psalm': 'Ps', 'proverbs': 'Prov',
    'ecclesiastes': 'Eccl', 'song of solomon': 'Song', 'isaiah': 'Isa', 'jeremiah': 'Jer',
    'lamentations': 'Lam', 'ezekiel': 'Ezek', 'daniel': 'Dan', 'hosea': 'Hos',
    'joel': 'Joel', 'amos': 'Amos', 'obadiah': 'Obad', 'jonah': 'Jonah', 'micah': 'Mic',
    'nahum': 'Nah', 'habakkuk': 'Hab', 'zephaniah': 'Zeph', 'haggai': 'Hag',
    'zechariah': 'Zech', 'malachi': 'Mal', 'matthew': 'Matt', 'mark': 'Mark',
    'luke': 'Luke', 'john': 'John', 'acts': 'Acts', 'romans': 'Rom',
    '1 corinthians': '1Cor', '2 corinthians': '2Cor', 'galatians': 'Gal',
    'ephesians': 'Eph', 'philippians': 'Phil', 'colossians': 'Col',
    '1 thessalonians': '1Thess', '2 thessalonians': '2Thess', '1 timothy': '1Tim',
    '2 timothy': '2Tim', 'titus': 'Titus', 'philemon': 'Phlm', 'hebrews': 'Heb',
    'james': 'Jas', '1 peter': '1Pet', '2 peter': '2Pet', '1 john': '1John',
    '2 john': '2John', '3 john': '3John', 'jude': 'Jude', 'revelation': 'Rev'
  };
  
  const normalizedBook = book.toLowerCase().trim();
  const bibleOrgBook = bookMap[normalizedBook] || book;
  
  const url = `https://labs.bible.org/api/?passage=${encodeURIComponent(bibleOrgBook)}+${chapter}&type=json`;
  console.log(`[Fallback API] Fetching: ${url}`);
  
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Fallback API returned ${response.status}`);
  }
  
  const data = await response.json();
  if (!Array.isArray(data) || data.length === 0) {
    throw new Error('No verses from fallback API');
  }
  
  // Transform to standard format
  return {
    verses: data.map((v: any) => ({
      book: v.bookname || book,
      chapter: v.chapter || chapter,
      verse: parseInt(v.verse),
      text: v.text?.replace(/<[^>]*>/g, '') || '' // Strip HTML tags
    }))
  };
}

// Fetch with retry logic and fallback
async function fetchWithRetry(book: string, chapter: number, version: string, maxRetries = 5): Promise<any> {
  let lastError: Error | null = null;
  
  // Try primary API with retries
  for (let attempt = 0; attempt < maxRetries; attempt++) {
    if (attempt > 0) {
      // Exponential backoff: 1s, 2s, 4s, 8s, 16s
      const waitTime = Math.pow(2, attempt) * 500;
      console.log(`[Primary API] Retry ${attempt + 1}/${maxRetries} after ${waitTime}ms`);
      await delay(waitTime);
    }

    try {
      const response = await fetchFromBibleApi(book, chapter, version);

      if (response.ok) {
        return await response.json();
      }

      // Check if it's a rate limit error (429)
      if (response.status === 429) {
        console.warn(`[Primary API] Rate limited (429), attempt ${attempt + 1}`);
        lastError = new Error(`Rate limited: ${response.status}`);
        continue; // Retry
      }

      // For 404 or other client errors, try fallback immediately
      if (response.status >= 400 && response.status < 500) {
        console.warn(`[Primary API] Client error ${response.status}, trying fallback`);
        break;
      }

      lastError = new Error(`Bible API returned ${response.status}`);
    } catch (err) {
      console.error(`[Primary API] Fetch error:`, err);
      lastError = err instanceof Error ? err : new Error(String(err));
    }
  }

  // Try fallback API
  console.log(`[Fallback] Primary API failed, trying fallback for ${book} ${chapter}`);
  try {
    const fallbackData = await fetchFromBibleOrg(book, chapter);
    console.log(`[Fallback] Success! Got ${fallbackData.verses?.length} verses`);
    return fallbackData;
  } catch (fallbackErr) {
    console.error(`[Fallback] Also failed:`, fallbackErr);
  }

  throw lastError || new Error('All Bible API sources failed');
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { book, chapter, version = 'kjv' } = await req.json();
    
    if (!book || !chapter) {
      throw new Error('Book and chapter are required');
    }

    console.log(`[Bible API] Fetching ${book} ${chapter} (${version})`);

    // Fetch with retry and fallback
    const data = await fetchWithRetry(book, chapter, version);
    
    if (!data.verses || data.verses.length === 0) {
      throw new Error('No verses found');
    }

    // Format verses consistently (handle both primary and fallback API formats)
    const verses = data.verses.map((v: any) => ({
      book: v.book || (data.reference ? data.reference.split(' ')[0] : book),
      chapter: v.chapter || (data.reference ? data.reference.split(' ')[1]?.split(':')[0] : chapter),
      verse: v.verse,
      text: v.text
    }));

    return new Response(
      JSON.stringify({ verses }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in bible-api function:', error);
    const errorMessage = error instanceof Error ? error.message : 'Failed to fetch Bible text';
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});
