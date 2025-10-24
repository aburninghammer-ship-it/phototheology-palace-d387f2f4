import { supabase } from "@/integrations/supabase/client";

export interface QuarterlyLesson {
  id: string;
  title: string;
  start_date: string;
  end_date: string;
  index: number;
  full_read: string;
  bible_verses: string[];
}

export interface Quarterly {
  id: string;
  title: string;
  description: string;
  introduction: string;
  lessons: QuarterlyLesson[];
  quarter: string;
  cover_image?: string;
}

/**
 * Fetches the current Sabbath School quarterly from Adventist API
 */
export async function getCurrentQuarterly(language: string = "en"): Promise<Quarterly | null> {
  try {
    // Get current date to determine which quarterly to fetch
    const now = new Date();
    const year = now.getFullYear();
    const quarter = Math.ceil((now.getMonth() + 1) / 3);
    
    // Try different quarter ID formats
    const quarterlyIds = [
      `${year}-${quarter.toString().padStart(2, '0')}-${language}`,
      `${year}-0${quarter}-${language}`,
      `${language}/${year}-0${quarter}`,
    ];
    
    for (const quarterlyId of quarterlyIds) {
      try {
        // Try new API structure
        const response = await fetch(
          `https://sabbath-school.adventech.io/api/v2/${language}/quarterlies/${quarterlyId}/index.json`,
          {
            headers: {
              'Accept': 'application/json',
            }
          }
        );
        
        if (!response.ok) {
          console.warn(`Failed to fetch quarterly with ID ${quarterlyId}:`, response.status);
          continue;
        }
        
        const contentType = response.headers.get('content-type');
        if (!contentType?.includes('application/json')) {
          console.warn(`Non-JSON response for ${quarterlyId}`);
          continue;
        }
        
        const data = await response.json();
        
        if (data && data.quarterly) {
          return {
            id: data.quarterly.id || quarterlyId,
            title: data.quarterly.title || 'Current Quarterly',
            description: data.quarterly.description || '',
            introduction: data.quarterly.introduction || '',
            lessons: data.lessons || [],
            quarter: data.quarterly.quarter || `Q${quarter} ${year}`,
            cover_image: data.quarterly.cover || undefined,
          };
        }
      } catch (err) {
        console.warn(`Error with quarterly ID ${quarterlyId}:`, err);
        continue;
      }
    }
    
    console.error('All quarterly API attempts failed');
    return null;
  } catch (error) {
    console.error('Error fetching quarterly:', error);
    return null;
  }
}

/**
 * Fetches a specific lesson from the quarterly
 */
export async function getQuarterlyLesson(
  quarterlyId: string,
  lessonId: string,
  language: string = "en"
): Promise<any | null> {
  try {
    const response = await fetch(
      `https://sabbath-school.adventech.io/api/v2/${language}/quarterlies/${quarterlyId}/lessons/${lessonId}/index.json`
    );
    
    if (!response.ok) {
      console.error('Failed to fetch lesson:', response.status);
      return null;
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching lesson:', error);
    return null;
  }
}

/**
 * Analyzes quarterly content using phototheology principles via edge function
 */
export async function analyzeQuarterlyWithPhototheology(
  lessonTitle: string,
  lessonContent: string,
  bibleVerses: string[]
): Promise<any> {
  try {
    const { data, error } = await supabase.functions.invoke('analyze-quarterly-lesson', {
      body: {
        lessonTitle,
        lessonContent,
        bibleVerses,
      },
    });
    
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error analyzing quarterly:', error);
    throw error;
  }
}
