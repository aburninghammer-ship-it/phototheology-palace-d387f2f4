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
    
    const quarterlyId = `${year}-${quarter < 10 ? '0' + quarter : quarter}-${language}`;
    
    const response = await fetch(
      `https://sabbath-school.adventech.io/api/v2/${language}/quarterlies/${quarterlyId}/index.json`
    );
    
    if (!response.ok) {
      console.error('Failed to fetch quarterly:', response.status);
      return null;
    }
    
    const data = await response.json();
    
    return {
      id: data.quarterly.id,
      title: data.quarterly.title,
      description: data.quarterly.description || '',
      introduction: data.quarterly.introduction || '',
      lessons: data.lessons || [],
      quarter: data.quarterly.quarter || `Q${quarter} ${year}`,
      cover_image: data.quarterly.cover || undefined,
    };
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
