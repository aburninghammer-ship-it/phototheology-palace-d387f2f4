// Master 24FPS Bible Data Index
// Organizes all 1,189 Bible chapters into memorizable sets

export interface ChapterFrame {
  chapter: number;
  book: string;
  title: string;
  summary: string;
  memoryHook: string;
  symbol: string;
}

export interface BibleSet {
  id: string;
  label: string;
  theme: string;
  chapters: ChapterFrame[];
  testament: 'old' | 'new';
}

// Re-export all sets
export * from './oldTestament';
export * from './newTestament';
