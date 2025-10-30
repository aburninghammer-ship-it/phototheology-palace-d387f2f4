import { BIBLE_BOOK_METADATA } from './bibleBooks';

export interface BibleChapterMetadata {
  book: string;
  chapter: number;
  position: number;
  verses: number;
}

// Generate all 1,189 chapters across all 66 books
// Note: Verse counts will be populated during import or can be fetched from BibleSDK
const generateAllChapters = (): BibleChapterMetadata[] => {
  const chapters: BibleChapterMetadata[] = [];
  let position = 1;

  // Known verse counts for Genesis (provided)
  const genesisVerseCounts = [31, 25, 24, 26, 32, 22, 24, 20, 27, 32, 32, 19, 18, 24, 21, 16, 26, 33, 36, 18, 33, 22, 16, 60, 33, 35, 44, 22, 32, 41, 49, 30, 19, 30, 29, 43, 36, 30, 23, 22, 55, 35, 32, 29, 28, 34, 31, 21, 32, 24];

  for (const book of BIBLE_BOOK_METADATA) {
    for (let chapter = 1; chapter <= book.chapters; chapter++) {
      chapters.push({
        book: book.code,
        chapter,
        position,
        // Use known Genesis verse counts, or 0 as placeholder for other books
        verses: book.code === 'GEN' ? genesisVerseCounts[chapter - 1] : 0
      });
      position++;
    }
  }

  return chapters;
};

export const BIBLE_CHAPTER_METADATA: BibleChapterMetadata[] = generateAllChapters();

/**
 * Get verse count for a specific chapter
 */
export function getVerseCount(bookCode: string, chapter: number): number | undefined {
  const chapterMeta = BIBLE_CHAPTER_METADATA.find(
    c => c.book === bookCode && c.chapter === chapter
  );
  return chapterMeta?.verses;
}

/**
 * Validate if a verse reference is valid
 */
export function isValidVerse(bookCode: string, chapter: number, verse: number): boolean {
  const verseCount = getVerseCount(bookCode, chapter);
  if (!verseCount) return false;
  return verse >= 1 && verse <= verseCount;
}

/**
 * Get the next chapter in the Bible
 */
export function getNextChapter(bookCode: string, chapter: number): BibleChapterMetadata | undefined {
  const currentChapter = BIBLE_CHAPTER_METADATA.find(
    c => c.book === bookCode && c.chapter === chapter
  );
  if (!currentChapter) return undefined;
  
  return BIBLE_CHAPTER_METADATA.find(c => c.position === currentChapter.position + 1);
}

/**
 * Get the previous chapter in the Bible
 */
export function getPreviousChapter(bookCode: string, chapter: number): BibleChapterMetadata | undefined {
  const currentChapter = BIBLE_CHAPTER_METADATA.find(
    c => c.book === bookCode && c.chapter === chapter
  );
  if (!currentChapter || currentChapter.position === 1) return undefined;
  
  return BIBLE_CHAPTER_METADATA.find(c => c.position === currentChapter.position - 1);
}

/**
 * Get all chapters for a specific book
 */
export function getBookChapters(bookCode: string): BibleChapterMetadata[] {
  return BIBLE_CHAPTER_METADATA.filter(c => c.book === bookCode);
}

/**
 * Get total verse count for a book
 */
export function getBookVerseCount(bookCode: string): number {
  return BIBLE_CHAPTER_METADATA
    .filter(c => c.book === bookCode)
    .reduce((sum, c) => sum + c.verses, 0);
}
