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
 * Fetches the current quarterly from Seventh Day Press via edge function
 */
async function fetchSeventhDayPressQuarterly(): Promise<{ pdfUrl: string; title: string; topic: string } | null> {
  try {
    const { data, error } = await supabase.functions.invoke('fetch-quarterly', {
      body: {}
    });
    
    if (error || !data?.success) {
      console.warn('Failed to fetch from Seventh Day Press:', error || data?.error);
      return null;
    }
    
    return {
      pdfUrl: data.quarterly.pdfUrl,
      title: data.quarterly.title,
      topic: data.quarterly.topic
    };
  } catch (e) {
    console.warn('Error calling fetch-quarterly:', e);
    return null;
  }
}

/**
 * Fetches the current lesson quarterly using alternative API
 */
export async function getCurrentQuarterly(language: string = "en"): Promise<Quarterly | null> {
  try {
    // Get current date to determine which quarterly to fetch
    const now = new Date();
    const year = now.getFullYear();
    const quarter = Math.ceil((now.getMonth() + 1) / 3);
    
    // First, try to get from Seventh Day Press
    const sdpQuarterly = await fetchSeventhDayPressQuarterly();
    
    // Try the working API endpoint for lesson details
    try {
      const response = await fetch(
        `https://sabbathschool.duresa.com.et/api/v1/languages/${language}/quarters`,
        {
          headers: {
            'Accept': 'application/json',
          }
        }
      );
      
      if (response.ok) {
        const quarters = await response.json();
        
        // Find the current quarter
        const currentQuarter = quarters.find((q: any) => {
          const qYear = parseInt(q.id.substring(0, 4));
          const qQuarter = parseInt(q.id.substring(5, 7));
          return qYear === year && qQuarter === quarter;
        }) || quarters[quarters.length - 1]; // Fallback to latest quarter
        
        if (currentQuarter) {
          // Fetch lessons for this quarter
          const lessonsResponse = await fetch(
            `https://sabbathschool.duresa.com.et/api/v1/${language}/quarters/${currentQuarter.id}/lessons`
          );
          
          const lessons = lessonsResponse.ok ? await lessonsResponse.json() : [];
          
          return {
            id: currentQuarter.id,
            title: sdpQuarterly?.title || currentQuarter.title || 'Current Quarterly',
            description: currentQuarter.description || '',
            introduction: currentQuarter.introduction || '',
            lessons: lessons.map((lesson: any, index: number) => ({
              id: lesson.id,
              title: lesson.title,
              start_date: lesson.start_date,
              end_date: lesson.end_date,
              index: index + 1,
              full_read: sdpQuarterly?.pdfUrl || lesson.full_read || '',
              bible_verses: lesson.bible_reading?.split(',').map((v: string) => v.trim()) || [],
            })),
            quarter: `Q${quarter} ${year}`,
            cover_image: currentQuarter.cover || undefined,
          };
        }
      }
    } catch (apiError) {
      console.warn('API fetch failed:', apiError);
    }
    
    // Q4 2025 - Christ's Object Lessons (Seventh Day Press)
    const lessonData = [
      { id: "01", title: "The Barren Fig-Tree", dates: "Sep 28–Oct 4", bible_verses: ["Luke 13:6-9"], aid: "Christ's Object Lessons p. 212-218" },
      { id: "02", title: "The Parable of the Great Supper", dates: "Oct 5–Oct 11", bible_verses: ["Luke 14:12-20"], aid: "Christ's Object Lessons p. 219-237" },
      { id: "03", title: "The Parable of the Great Supper (continued)", dates: "Oct 12–Oct 18", bible_verses: ["Luke 14:21-24"], aid: "Christ's Object Lessons p. 219-237" },
      { id: "04", title: "The Parable of the Two Debtors", dates: "Oct 19–Oct 25", bible_verses: ["Matthew 18:21-35"], aid: "Christ's Object Lessons p. 243" },
      { id: "05", title: "The Parable of the Foolish Rich Man", dates: "Oct 26–Nov 1", bible_verses: ["Luke 12:13-36"], aid: "Christ's Object Lessons p. 252" },
      { id: "06", title: "Allegory of the Rich Man and Lazarus", dates: "Nov 2–Nov 8", bible_verses: ["Luke 16:13-31"], aid: "Christ's Object Lessons p. 260" },
      { id: "07", title: "The Two Sons", dates: "Nov 9–Nov 15", bible_verses: ["Matthew 21:28-32"], aid: "Christ's Object Lessons p. 272-283" },
      { id: "08", title: "Parable of the Lord's Vineyard", dates: "Nov 16–Nov 22", bible_verses: ["Matthew 21:33-46"], aid: "Christ's Object Lessons p. 284-306" },
      { id: "09", title: "The Marriage Supper", dates: "Nov 23–Nov 29", bible_verses: ["Matthew 22:1-14"], aid: "Christ's Object Lessons p. 307-319" },
      { id: "10", title: "The Parable of the Talents", dates: "Nov 30–Dec 5", bible_verses: ["Matthew 25:14-30"], aid: "Christ's Object Lessons p. 325-365" },
      { id: "11", title: "The Parable of the Good Samaritan", dates: "Dec 6–Dec 12", bible_verses: ["Luke 10:25-37"], aid: "Christ's Object Lessons p. 376-389" },
      { id: "12", title: "The Laborers in the Vineyard", dates: "Dec 13–Dec 19", bible_verses: ["Matthew 20:1-16"], aid: "Christ's Object Lessons p. 390-404" },
      { id: "13", title: "The Parable of Ten Virgins", dates: "Dec 20–Dec 27", bible_verses: ["Matthew 25:1-13"], aid: "Christ's Object Lessons p. 405-421" },
    ];

    // Use SDP PDF URL if available, otherwise local fallback
    const pdfUrl = sdpQuarterly?.pdfUrl || '/quarterlies/Q4-2025-Christ-Object-Lessons.pdf';
    
    return {
      id: `2025-04-${language}`,
      title: sdpQuarterly?.title || "Christ's Object Lessons",
      description: "A study of the parables of Jesus as explored in Ellen G. White's classic book 'Christ's Object Lessons'. Each lesson examines a parable, revealing deeper spiritual truths and practical applications.",
      introduction: "The parables of our Saviour form the subject matter of this quarterly. The student who desires to have a thorough understanding of these studies will find the book 'Christ's Object Lessons' indispensable.",
      lessons: lessonData.map((lesson, index) => ({
        id: lesson.id,
        title: lesson.title,
        start_date: lesson.dates.split('–')[0] + `, 2025`,
        end_date: lesson.dates.split('–')[1] + `, 2025`,
        index: index + 1,
        full_read: pdfUrl,
        bible_verses: lesson.bible_verses,
      })),
      quarter: `Q4 2025`,
      cover_image: pdfUrl,
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
      `https://sabbathschool.duresa.com.et/api/v1/${language}/quarters/${quarterlyId}/lessons/${lessonId}`
    );
    
    if (response.ok) {
      const lesson = await response.json();
      
      // Fetch days for this lesson
      const daysResponse = await fetch(
        `https://sabbathschool.duresa.com.et/api/v1/${language}/quarters/${quarterlyId}/lessons/${lessonId}/days`
      );
      
      const days = daysResponse.ok ? await daysResponse.json() : [];
      
      return {
        lesson,
        days: days.map((day: any) => ({
          id: day.id,
          title: day.title,
          date: day.date,
          read: day.read || day.content,
          content: day.content,
        })),
      };
    }
    
    // Fallback: Return basic structure with actual content
    const studyContent = `
      <div class="lesson-intro">
        <h3>📖 Official Lesson Study</h3>
        <p>This lesson is part of the official Adult Lesson Quarterly. For the complete lesson with all daily readings, discussion questions, and EGW notes, please access the official PDF.</p>
        
        <div class="study-approach">
          <h4>🎯 How to Use This Platform</h4>
          <ol>
            <li><strong>Read the Official Lesson:</strong> Click the "View Official PDF" button above to access the complete lesson content</li>
            <li><strong>Select a Day:</strong> Choose which day's study you want to analyze</li>
            <li><strong>Apply Palace Tools:</strong> Use the Palace Rooms or Principles to dig deeper into the Scripture passages</li>
            <li><strong>Get AI Insights:</strong> Jeeves will help you apply the selected framework to enhance your study</li>
          </ol>
        </div>

        <div class="study-prompt">
          <h4>📝 Study Prompt</h4>
          <p>As you read through this week's lesson, consider:</p>
          <ul>
            <li>What is the main biblical narrative or teaching?</li>
            <li>Which Palace Room would help you see this story/passage in a new way?</li>
            <li>What principles or dimensions apply to your life today?</li>
            <li>How can you use the Jeeves assistant to explore connections you might have missed?</li>
          </ul>
        </div>

        <div class="palace-example">
          <h4>💡 Quick Example</h4>
          <p><strong>Try This:</strong> After reading about Joshua's courage (Lesson 1), select "Story Room (SR)" to break the narrative into memorable beats, or choose "Christ Dimension" to see how Joshua points to Jesus.</p>
        </div>
      </div>
    `;
    
    return {
      lesson: {
        id: lessonId,
        title: "Weekly Study Guide",
        bible_reading: "See official PDF for complete Bible readings",
      },
      days: [
        { id: "01", title: "Sunday - First Day Study", date: "", read: studyContent, content: studyContent },
        { id: "02", title: "Monday - Second Day Study", date: "", read: studyContent, content: studyContent },
        { id: "03", title: "Tuesday - Third Day Study", date: "", read: studyContent, content: studyContent },
        { id: "04", title: "Wednesday - Fourth Day Study", date: "", read: studyContent, content: studyContent },
        { id: "05", title: "Thursday - Fifth Day Study", date: "", read: studyContent, content: studyContent },
        { id: "06", title: "Friday - Sixth Day Study", date: "", read: studyContent, content: studyContent },
      ],
    };
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
