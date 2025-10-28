// Strong's Concordance Data and API
export interface StrongsEntry {
  number: string;
  word: string;
  transliteration: string;
  pronunciation: string;
  language: "Hebrew" | "Greek";
  definition: string;
  usage: string[];
  occurrences: number;
  derivation?: string;
}

// Sample Strong's data for demonstration
// In production, this would come from a complete Strong's database
const STRONGS_DATA: Record<string, StrongsEntry> = {
  "G2316": {
    number: "G2316",
    word: "θεός",
    transliteration: "theos",
    pronunciation: "theh'-os",
    language: "Greek",
    definition: "A deity, especially the supreme Divinity",
    usage: ["God", "god", "godly"],
    occurrences: 1343,
    derivation: "Of uncertain affinity"
  },
  "G25": {
    number: "G25",
    word: "ἀγαπάω",
    transliteration: "agapaō",
    pronunciation: "ag-ap-ah'-o",
    language: "Greek",
    definition: "To love (in a social or moral sense)",
    usage: ["love", "beloved"],
    occurrences: 143,
    derivation: "Perhaps from agan (much)"
  },
  "G2889": {
    number: "G2889",
    word: "κόσμος",
    transliteration: "kosmos",
    pronunciation: "kos'-mos",
    language: "Greek",
    definition: "Orderly arrangement, the world, universe",
    usage: ["world", "adorning"],
    occurrences: 186,
    derivation: "Probably from the base of komizō"
  },
  "G1325": {
    number: "G1325",
    word: "δίδωμι",
    transliteration: "didōmi",
    pronunciation: "did'-o-mee",
    language: "Greek",
    definition: "To give, bestow",
    usage: ["give", "bestow", "grant", "commit"],
    occurrences: 415,
    derivation: "A prolonged form of a primary verb"
  },
  "G3439": {
    number: "G3439",
    word: "μονογενής",
    transliteration: "monogenēs",
    pronunciation: "mon-og-en-ace'",
    language: "Greek",
    definition: "Only-born, only-begotten, unique",
    usage: ["only begotten", "only"],
    occurrences: 9,
    derivation: "From monos and genos"
  },
  "G5207": {
    number: "G5207",
    word: "υἱός",
    transliteration: "huios",
    pronunciation: "hwee-os'",
    language: "Greek",
    definition: "A son (literal or figurative)",
    usage: ["son", "child"],
    occurrences: 382,
    derivation: "Apparently a primary word"
  },
  "G4100": {
    number: "G4100",
    word: "πιστεύω",
    transliteration: "pisteuō",
    pronunciation: "pist-yoo'-o",
    language: "Greek",
    definition: "To have faith, believe, trust",
    usage: ["believe", "commit unto", "trust"],
    occurrences: 248,
    derivation: "From pistis"
  },
  "G2222": {
    number: "G2222",
    word: "ζωή",
    transliteration: "zōē",
    pronunciation: "dzo-ay'",
    language: "Greek",
    definition: "Life, both physical and spiritual",
    usage: ["life", "lifetime"],
    occurrences: 135,
    derivation: "From zaō"
  },
  "G166": {
    number: "G166",
    word: "αἰώνιος",
    transliteration: "aiōnios",
    pronunciation: "ahee-o'-nee-os",
    language: "Greek",
    definition: "Perpetual, eternal",
    usage: ["eternal", "everlasting", "forever"],
    occurrences: 71,
    derivation: "From aiōn"
  }
};

// Parse Strong's numbers from verse text
export const parseStrongsFromText = (text: string): { word: string; strongs: string }[] => {
  // This would parse actual Strong's tagged text
  // For demo, we'll return sample data
  return [];
};

// Get Strong's entry by number
export const getStrongsEntry = async (number: string): Promise<StrongsEntry | null> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 100));
  
  return STRONGS_DATA[number] || null;
};

// Search Strong's by word
export const searchStrongs = async (word: string): Promise<StrongsEntry[]> => {
  const results = Object.values(STRONGS_DATA).filter(entry => 
    entry.word.toLowerCase().includes(word.toLowerCase()) ||
    entry.transliteration.toLowerCase().includes(word.toLowerCase()) ||
    entry.usage.some(u => u.toLowerCase().includes(word.toLowerCase()))
  );
  
  return results;
};

// Verse data with Strong's numbers
const VERSES_WITH_STRONGS: Record<string, {
  text: string;
  words: Array<{ text: string; strongs?: string }>
}> = {
  "John-3-16": {
    text: "For God so loved the world, that he gave his only begotten Son, that whosoever believeth in him should not perish, but have everlasting life.",
    words: [
      { text: "For" },
      { text: "God", strongs: "G2316" },
      { text: "so" },
      { text: "loved", strongs: "G25" },
      { text: "the" },
      { text: "world", strongs: "G2889" },
      { text: "that" },
      { text: "he" },
      { text: "gave", strongs: "G1325" },
      { text: "his" },
      { text: "only begotten", strongs: "G3439" },
      { text: "Son", strongs: "G5207" },
      { text: "that" },
      { text: "whosoever" },
      { text: "believeth", strongs: "G4100" },
      { text: "in" },
      { text: "him" },
      { text: "should" },
      { text: "not" },
      { text: "perish" },
      { text: "but" },
      { text: "have" },
      { text: "everlasting", strongs: "G166" },
      { text: "life", strongs: "G2222" }
    ]
  },
  "John-3-3": {
    text: "Jesus answered and said unto him, Verily, verily, I say unto thee, Except a man be born again, he cannot see the kingdom of God.",
    words: [
      { text: "Jesus" },
      { text: "answered" },
      { text: "and" },
      { text: "said" },
      { text: "unto" },
      { text: "him," },
      { text: "Verily," },
      { text: "verily," },
      { text: "I" },
      { text: "say" },
      { text: "unto" },
      { text: "thee," },
      { text: "Except" },
      { text: "a" },
      { text: "man", strongs: "G444" },
      { text: "be" },
      { text: "born", strongs: "G1080" },
      { text: "again", strongs: "G509" },
      { text: "he" },
      { text: "cannot" },
      { text: "see", strongs: "G1492" },
      { text: "the" },
      { text: "kingdom", strongs: "G932" },
      { text: "of" },
      { text: "God.", strongs: "G2316" }
    ]
  },
  "John-1-1": {
    text: "In the beginning was the Word, and the Word was with God, and the Word was God.",
    words: [
      { text: "In" },
      { text: "the" },
      { text: "beginning", strongs: "G746" },
      { text: "was" },
      { text: "the" },
      { text: "Word,", strongs: "G3056" },
      { text: "and" },
      { text: "the" },
      { text: "Word", strongs: "G3056" },
      { text: "was" },
      { text: "with" },
      { text: "God,", strongs: "G2316" },
      { text: "and" },
      { text: "the" },
      { text: "Word", strongs: "G3056" },
      { text: "was" },
      { text: "God.", strongs: "G2316" }
    ]
  },
  "John-14-6": {
    text: "Jesus saith unto him, I am the way, the truth, and the life: no man cometh unto the Father, but by me.",
    words: [
      { text: "Jesus" },
      { text: "saith" },
      { text: "unto" },
      { text: "him," },
      { text: "I" },
      { text: "am" },
      { text: "the" },
      { text: "way,", strongs: "G3598" },
      { text: "the" },
      { text: "truth,", strongs: "G225" },
      { text: "and" },
      { text: "the" },
      { text: "life:", strongs: "G2222" },
      { text: "no" },
      { text: "man" },
      { text: "cometh" },
      { text: "unto" },
      { text: "the" },
      { text: "Father,", strongs: "G3962" },
      { text: "but" },
      { text: "by" },
      { text: "me." }
    ]
  }
};

// Additional Strong's entries
const ADDITIONAL_STRONGS: Record<string, StrongsEntry> = {
  "G444": {
    number: "G444",
    word: "ἄνθρωπος",
    transliteration: "anthrōpos",
    pronunciation: "anth'-ro-pos",
    language: "Greek",
    definition: "A human being, man, mankind",
    usage: ["man", "mankind", "person"],
    occurrences: 550,
    derivation: "From anēr and ōps"
  },
  "G1080": {
    number: "G1080",
    word: "γεννάω",
    transliteration: "gennaō",
    pronunciation: "ghen-nah'-o",
    language: "Greek",
    definition: "To beget, bring forth, be born",
    usage: ["beget", "bear", "be born"],
    occurrences: 97,
    derivation: "From genos"
  },
  "G509": {
    number: "G509",
    word: "ἄνωθεν",
    transliteration: "anōthen",
    pronunciation: "an'-o-then",
    language: "Greek",
    definition: "From above, again, anew",
    usage: ["from above", "again", "from the beginning"],
    occurrences: 13,
    derivation: "From anō"
  },
  "G1492": {
    number: "G1492",
    word: "εἴδω",
    transliteration: "eidō",
    pronunciation: "i'-do",
    language: "Greek",
    definition: "To see, perceive, know",
    usage: ["see", "behold", "know"],
    occurrences: 666,
    derivation: "A primary verb"
  },
  "G932": {
    number: "G932",
    word: "βασιλεία",
    transliteration: "basileia",
    pronunciation: "bas-il-i'-ah",
    language: "Greek",
    definition: "Royal power, kingdom, reign",
    usage: ["kingdom", "reign"],
    occurrences: 162,
    derivation: "From basileus"
  },
  "G746": {
    number: "G746",
    word: "ἀρχή",
    transliteration: "archē",
    pronunciation: "ar-khay'",
    language: "Greek",
    definition: "Beginning, origin, first",
    usage: ["beginning", "principality", "rule"],
    occurrences: 58,
    derivation: "From archomai"
  },
  "G3056": {
    number: "G3056",
    word: "λόγος",
    transliteration: "logos",
    pronunciation: "log'-os",
    language: "Greek",
    definition: "Word, speech, divine utterance",
    usage: ["word", "saying", "speech"],
    occurrences: 330,
    derivation: "From lego"
  },
  "G3598": {
    number: "G3598",
    word: "ὁδός",
    transliteration: "hodos",
    pronunciation: "hod-os'",
    language: "Greek",
    definition: "A way, road, journey",
    usage: ["way", "road", "journey"],
    occurrences: 101,
    derivation: "Apparently a primary word"
  },
  "G225": {
    number: "G225",
    word: "ἀλήθεια",
    transliteration: "alētheia",
    pronunciation: "al-ay'-thi-a",
    language: "Greek",
    definition: "Truth, reality, sincerity",
    usage: ["truth", "truly", "verity"],
    occurrences: 109,
    derivation: "From alēthēs"
  },
  "G3962": {
    number: "G3962",
    word: "πατήρ",
    transliteration: "patēr",
    pronunciation: "pat-ayr'",
    language: "Greek",
    definition: "A father, ancestor",
    usage: ["father", "parent"],
    occurrences: 413,
    derivation: "Apparently a primary word"
  }
};

// Merge additional Strong's data
Object.assign(STRONGS_DATA, ADDITIONAL_STRONGS);

// Get verse with Strong's numbers
export const getVerseWithStrongs = (book: string, chapter: number, verse: number): {
  text: string;
  words: Array<{ text: string; strongs?: string }>
} | null => {
  const key = `${book}-${chapter}-${verse}`;
  return VERSES_WITH_STRONGS[key] || null;
};
