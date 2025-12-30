import React, { useState, useEffect, useCallback, useRef } from 'react';

interface ValidBlock {
  text: string;
  reason: string;
  bonus?: boolean;
}

interface TrapBlock {
  text: string;
  reason: string;
}

interface Verse {
  ref: string;
  text: string;
  valid: ValidBlock[];
  traps: TrapBlock[];
}

interface Room {
  name: string;
  code: string;
  icon: string;
  color: string;
  rule: string;
  catch: string;
  avoid: string;
  floor: number;
}

interface FallingBlock {
  id: number;
  text: string;
  reason: string;
  type: 'valid' | 'trap';
  bonus?: boolean;
  x: number;
  y: number;
  verseRef: string;
  roomCode: string;
  roomIcon: string;
  roomName: string;
}

interface Feedback {
  type: 'success' | 'error' | 'info';
  title: string;
  text?: string;
  reason?: string;
  points?: number;
  duration: number;
}

type GameState = 'menu' | 'playing' | 'gameOver';
type GameMode = 'single' | 'palace';

const PTPalaceTetris: React.FC = () => {
  const [gameState, setGameState] = useState<GameState>('menu');
  const [currentRoom, setCurrentRoom] = useState<Room | null>(null);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [streak, setStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);
  const [fallingBlocks, setFallingBlocks] = useState<FallingBlock[]>([]);
  const [currentVerseIndex, setCurrentVerseIndex] = useState(0);
  const [blocksProcessed, setBlocksProcessed] = useState(0);
  const [feedback, setFeedback] = useState<Feedback | null>(null);
  const [speed, setSpeed] = useState(0.3);
  const [isPaused] = useState(false);
  const [gameMode, setGameMode] = useState<GameMode>('single');
  const [palaceRoomIndex, setPalaceRoomIndex] = useState(0);
  const [selectedFloor, setSelectedFloor] = useState<number | null>(null);
  const blockIdCounter = useRef(0);

  // ALL 38 Palace Rooms organized by floor
  const rooms: Record<string, Room> = {
    // FLOOR 1: Furnishing (Memory & Visualization)
    SR: {
      name: "Story Room",
      code: "SR",
      icon: "📖",
      color: "from-amber-600 to-amber-800",
      rule: "STORY BEATS IN SEQUENCE",
      catch: "Plot points, chronological order, narrative sequence",
      avoid: "Interpretation, theology, skipping order",
      floor: 1
    },
    IR: {
      name: "Imagination Room",
      code: "IR",
      icon: "🎬",
      color: "from-purple-600 to-purple-800",
      rule: "SENSORY IMMERSION",
      catch: "What you SEE, HEAR, FEEL, SMELL, TASTE",
      avoid: "Abstract theology, interpretation, analysis",
      floor: 1
    },
    "24": {
      name: "24FPS Room",
      code: "24",
      icon: "🎞️",
      color: "from-slate-600 to-slate-800",
      rule: "ONE IMAGE PER CHAPTER",
      catch: "Single memorable visual per chapter",
      avoid: "Multiple images, wordy descriptions, abstractions",
      floor: 1
    },
    BR: {
      name: "Bible Rendered",
      code: "BR",
      icon: "🗺️",
      color: "from-teal-600 to-teal-800",
      rule: "24-CHAPTER BLOCK GLYPHS",
      catch: "Simple symbols for large sections",
      avoid: "Complex symbols, over-explanation",
      floor: 1
    },
    TR: {
      name: "Translation Room",
      code: "TR",
      icon: "🎨",
      color: "from-pink-600 to-pink-800",
      rule: "WORDS INTO PICTURES",
      catch: "Concrete visuals from abstract concepts",
      avoid: "Keeping text abstract, mixing metaphors",
      floor: 1
    },
    GR: {
      name: "Gems Room",
      code: "GR",
      icon: "💎",
      color: "from-cyan-600 to-cyan-800",
      rule: "COMBINE UNRELATED TEXTS",
      catch: "2-4 verses that illuminate each other",
      avoid: "Forced connections, single verse focus",
      floor: 1
    },
    // FLOOR 2: Framework (Structure & Analysis)
    OR: {
      name: "Observation Room",
      code: "OR",
      icon: "🔍",
      color: "from-emerald-600 to-emerald-800",
      rule: "WHAT THE TEXT LITERALLY SAYS",
      catch: "Facts, actions, people, places, numbers",
      avoid: "Interpretations, meanings, applications",
      floor: 2
    },
    DC: {
      name: "Def-Com Room",
      code: "DC",
      icon: "📚",
      color: "from-orange-600 to-orange-800",
      rule: "DEFINE & COMPARE",
      catch: "Word definitions, cross-references, comparisons",
      avoid: "Guessing meanings, ignoring context",
      floor: 2
    },
    ST: {
      name: "Symbols Room",
      code: "ST",
      icon: "🔣",
      color: "from-blue-600 to-blue-800",
      rule: "BIBLICAL SYMBOL MEANINGS",
      catch: "Scripture-defined symbol meanings",
      avoid: "Made-up meanings, shallow definitions",
      floor: 2
    },
    QR: {
      name: "Questions Room",
      code: "QR",
      icon: "❓",
      color: "from-yellow-600 to-yellow-800",
      rule: "ASK WHO/WHAT/WHEN/WHERE/WHY/HOW",
      catch: "Observation questions about the text",
      avoid: "Answering before asking, skipping questions",
      floor: 2
    },
    QA: {
      name: "Q&A Chains",
      code: "QA",
      icon: "🔗",
      color: "from-lime-600 to-lime-800",
      rule: "QUESTION LEADS TO QUESTION",
      catch: "Each answer sparks new question",
      avoid: "Dead-end answers, stopping the chain",
      floor: 2
    },
    // FLOOR 3: Freestyle (Creative Application)
    NF: {
      name: "Nature Freestyle",
      code: "NF",
      icon: "🌿",
      color: "from-green-600 to-green-800",
      rule: "NATURE ILLUSTRATES TRUTH",
      catch: "Natural world parallels to Scripture",
      avoid: "Forced connections, ignoring text",
      floor: 3
    },
    PF: {
      name: "Personal Freestyle",
      code: "PF",
      icon: "👤",
      color: "from-rose-600 to-rose-800",
      rule: "PERSONAL APPLICATION",
      catch: "How this applies to YOUR life specifically",
      avoid: "Generic applications, avoiding conviction",
      floor: 3
    },
    BF: {
      name: "Bible Freestyle",
      code: "BF",
      icon: "📜",
      color: "from-amber-500 to-amber-700",
      rule: "SCRIPTURE INTERPRETS SCRIPTURE",
      catch: "Cross-references that illuminate meaning",
      avoid: "Isolated interpretation, ignoring context",
      floor: 3
    },
    HF: {
      name: "History Freestyle",
      code: "HF",
      icon: "🏛️",
      color: "from-stone-600 to-stone-800",
      rule: "HISTORICAL CONTEXT MATTERS",
      catch: "Historical/social background insights",
      avoid: "Ignoring context, anachronism",
      floor: 3
    },
    LR: {
      name: "Listening Room",
      code: "LR",
      icon: "👂",
      color: "from-violet-600 to-violet-800",
      rule: "WHAT IS GOD SAYING TO ME?",
      catch: "Personal word from Scripture",
      avoid: "Forcing meaning, ignoring context",
      floor: 3
    },
    // FLOOR 4: Focus (Christocentric Study)
    CR: {
      name: "Concentration Room",
      code: "CR",
      icon: "✝️",
      color: "from-red-700 to-red-900",
      rule: "HOW IT POINTS TO CHRIST",
      catch: "Types, shadows, prophecies of Christ",
      avoid: "Moral lessons without Christ",
      floor: 4
    },
    DR: {
      name: "Dimensions Room",
      code: "DR",
      icon: "📐",
      color: "from-indigo-600 to-indigo-800",
      rule: "5 DIMENSIONS OF MEANING",
      catch: "Literal, Christ, Personal, Church, Heaven",
      avoid: "Single-dimension reading",
      floor: 4
    },
    C6: {
      name: "Connect-6",
      code: "C6",
      icon: "🔗",
      color: "from-sky-600 to-sky-800",
      rule: "6 BIBLE SECTIONS CONNECTED",
      catch: "Links across Torah, History, Poetry, Prophets, Gospels, Epistles",
      avoid: "Ignoring any section",
      floor: 4
    },
    TRm: {
      name: "Theme Room",
      code: "TRm",
      icon: "🎯",
      color: "from-fuchsia-600 to-fuchsia-800",
      rule: "TRACE THEMES ACROSS SCRIPTURE",
      catch: "Theme development from Genesis to Revelation",
      avoid: "Isolated themes, missing progression",
      floor: 4
    },
    TZ: {
      name: "Time Zone",
      code: "TZ",
      icon: "⏰",
      color: "from-amber-700 to-amber-900",
      rule: "PAST, PRESENT, FUTURE",
      catch: "Time dimensions in prophecy",
      avoid: "Single time-frame interpretation",
      floor: 4
    },
    PRm: {
      name: "Patterns Room",
      code: "PRm",
      icon: "🔄",
      color: "from-emerald-700 to-emerald-900",
      rule: "RECURRING BIBLICAL PATTERNS",
      catch: "Patterns that repeat across Scripture",
      avoid: "Missing patterns, forcing patterns",
      floor: 4
    },
    "P||": {
      name: "Parallels Room",
      code: "P||",
      icon: "⚖️",
      color: "from-blue-700 to-blue-900",
      rule: "COMPARE & CONTRAST",
      catch: "Parallel stories, characters, events",
      avoid: "Surface comparisons only",
      floor: 4
    },
    FRt: {
      name: "Fruit Room",
      code: "FRt",
      icon: "🍇",
      color: "from-purple-700 to-purple-900",
      rule: "SPIRIT'S FRUIT IN ACTION",
      catch: "Love, joy, peace, patience, etc. in text",
      avoid: "Moralism without Spirit",
      floor: 4
    },
    // FLOOR 5: Finish (Advanced Integration)
    BL: {
      name: "Blue Room (Sanctuary)",
      code: "BL",
      icon: "🔵",
      color: "from-blue-800 to-indigo-900",
      rule: "SANCTUARY CONNECTIONS",
      catch: "Altar, Laver, Lampstand, Bread, Incense, Ark",
      avoid: "Missing sanctuary typology",
      floor: 5
    },
    PR: {
      name: "Prophecy Room",
      code: "PR",
      icon: "📢",
      color: "from-red-800 to-red-950",
      rule: "PROPHETIC INTERPRETATION",
      catch: "Prophecy principles, fulfillments",
      avoid: "Speculation, private interpretation",
      floor: 5
    },
    "3A": {
      name: "Three Angels",
      code: "3A",
      icon: "👼",
      color: "from-amber-800 to-amber-950",
      rule: "THREE ANGELS' MESSAGES",
      catch: "Rev 14 messages in all Scripture",
      avoid: "Missing end-time relevance",
      floor: 5
    },
    FE: {
      name: "Feasts Room",
      code: "FE",
      icon: "🎉",
      color: "from-orange-800 to-orange-950",
      rule: "7 FEASTS OF ISRAEL",
      catch: "Feast connections and fulfillments",
      avoid: "Ignoring feast typology",
      floor: 5
    },
    CEC: {
      name: "Christ in Every Chapter",
      code: "CEC",
      icon: "📖✝️",
      color: "from-rose-800 to-rose-950",
      rule: "FIND CHRIST EVERYWHERE",
      catch: "Christ in every chapter of Bible",
      avoid: "Christless chapters",
      floor: 5
    },
    R66: {
      name: "Room 66",
      code: "R66",
      icon: "📚",
      color: "from-slate-800 to-slate-950",
      rule: "ALL 66 BOOKS CONNECTED",
      catch: "How this text connects to all Scripture",
      avoid: "Isolated book study",
      floor: 5
    },
    "123H": {
      name: "Three Heavens",
      code: "123H",
      icon: "☁️",
      color: "from-sky-800 to-sky-950",
      rule: "SKY, SPACE, THRONE",
      catch: "Three heavens in Scripture",
      avoid: "Flattening heaven concept",
      floor: 5
    },
    CYC: {
      name: "Eight Cycles",
      code: "CYC",
      icon: "🔁",
      color: "from-teal-800 to-teal-950",
      rule: "8 COVENANT CYCLES",
      catch: "Adam to Christ cycles",
      avoid: "Missing cyclical patterns",
      floor: 5
    },
    // FLOOR 6: Framing (Final Integration)
    JR: {
      name: "Juice Room",
      code: "JR",
      icon: "🧃",
      color: "from-orange-700 to-red-800",
      rule: "EXTRACT THE ESSENCE",
      catch: "Core truth in one sentence",
      avoid: "Rambling, losing focus",
      floor: 6
    },
    MATH: {
      name: "Mathematics Room",
      code: "MATH",
      icon: "🔢",
      color: "from-gray-700 to-gray-900",
      rule: "BIBLICAL NUMERICS",
      catch: "Significant numbers in Scripture",
      avoid: "Numerology, forced meanings",
      floor: 6
    },
    FRm: {
      name: "Fire Room",
      code: "FRm",
      icon: "🔥",
      color: "from-red-600 to-red-800",
      rule: "HEART & EMOTIONAL RESPONSE",
      catch: "Feelings, conviction, worship",
      avoid: "Cold analysis, rushing past",
      floor: 6
    },
    MR: {
      name: "Meditation Room",
      code: "MR",
      icon: "🧘",
      color: "from-indigo-700 to-purple-800",
      rule: "SLOW, DEEP REFLECTION",
      catch: "Lingering on truth, repetition",
      avoid: "Speed-reading, surface level",
      floor: 6
    },
    SRm: {
      name: "Speed Room",
      code: "SRm",
      icon: "⚡",
      color: "from-yellow-600 to-orange-700",
      rule: "RAPID RECALL",
      catch: "Quick connections, instant recall",
      avoid: "Slow processing, forgetting",
      floor: 6
    },
    INF: {
      name: "Reflexive Mastery",
      code: "INF",
      icon: "♾️",
      color: "from-violet-700 to-purple-900",
      rule: "AUTOMATIC INTEGRATION",
      catch: "Seamless principle application",
      avoid: "Conscious effort, forgetting foundations",
      floor: 6
    }
  };

  // Verse database for each room
  const verseDatabase: Record<string, Verse[]> = {
    // FLOOR 1 - Furnishing
    SR: [
      {
        ref: "Genesis 37:3-28",
        text: "Joseph's brothers sell him into slavery after his dreams of greatness anger them.",
        valid: [
          { text: "Dream → Coat → Pit → Caravan → Egypt", reason: "Correct story beats in order" },
          { text: "Joseph had two dreams about ruling", reason: "Stated sequence in narrative" },
          { text: "Brothers stripped his coat first", reason: "Chronological action stated" },
          { text: "Judah suggested selling instead of killing", reason: "Plot point in sequence", bonus: true }
        ],
        traps: [
          { text: "Joseph forgave his brothers here", reason: "WRONG — forgiveness comes later in Genesis 45" },
          { text: "This represents Christ's rejection", reason: "INTERPRETATION — not a story beat" },
          { text: "The coat symbolized favoritism", reason: "INTERPRETATION — not sequence" }
        ]
      },
      {
        ref: "Exodus 14:10-31",
        text: "Israel trapped at the Red Sea, Moses parts the waters, Israel crosses, Egypt drowns.",
        valid: [
          { text: "Trapped → Fear → Staff → Waters Part → Cross → Drown", reason: "Correct sequence of events" },
          { text: "Egyptians pursued into the sea", reason: "Stated plot point" },
          { text: "Waters returned at dawn", reason: "Chronological detail stated" },
          { text: "Israel feared, then saw, then believed", reason: "Emotional sequence in text", bonus: true }
        ],
        traps: [
          { text: "This represents baptism", reason: "INTERPRETATION — not a story beat" },
          { text: "Moses had great faith here", reason: "INTERPRETATION — not stated action" },
          { text: "The sea symbolizes death to sin", reason: "THEOLOGY — not story sequence" }
        ]
      }
    ],
    IR: [
      {
        ref: "Exodus 14:21-22",
        text: "Moses stretched out his hand over the sea; the LORD drove the sea back by a strong east wind all night.",
        valid: [
          { text: "Feel the strong east wind on your face", reason: "Sensory: wind stated in text" },
          { text: "See walls of water towering on each side", reason: "Visual: 'waters were divided'" },
          { text: "Hear the roar of water being held back", reason: "Auditory: massive water would be loud" },
          { text: "Feel sand beneath your feet — dry, not muddy", reason: "Tactile: 'dry land' stated" },
          { text: "Watch fish swimming in the water walls", reason: "Visual imagination", bonus: true }
        ],
        traps: [
          { text: "This symbolizes baptism", reason: "INTERPRETATION — not sensory" },
          { text: "God demonstrates His sovereignty", reason: "THEOLOGY — not imagination" },
          { text: "Moses had great faith", reason: "INTERPRETATION — not being IN scene" }
        ]
      },
      {
        ref: "Matthew 27:45-46",
        text: "From noon darkness covered the land until 3pm. Jesus cried out 'My God, why have you forsaken me?'",
        valid: [
          { text: "See darkness covering everything at midday", reason: "Visual: 'darkness over all the land'" },
          { text: "Hear Jesus cry out with a loud voice", reason: "Auditory: 'cried with a loud voice'" },
          { text: "Feel the chill of supernatural darkness", reason: "Tactile: darkness during day" },
          { text: "Stand beneath the cross, looking up", reason: "Physical placement in scene", bonus: true }
        ],
        traps: [
          { text: "This fulfills Psalm 22", reason: "INTERPRETATION — not sensory" },
          { text: "The darkness symbolizes judgment", reason: "SYMBOLISM — not imagination" },
          { text: "Analyze the Aramaic phrase", reason: "ACADEMIC — opposite of immersion" }
        ]
      }
    ],
    "24": [
      {
        ref: "Genesis 1-3",
        text: "Creation, Eden, Fall — the opening chapters of Scripture.",
        valid: [
          { text: "Gen 1 = Birthday Cake Earth (creation's birthday)", reason: "Single memorable image per chapter" },
          { text: "Gen 2 = Garden with Four Rivers", reason: "Concrete visual for chapter" },
          { text: "Gen 3 = Snake + Apple + Clock (fall, time starts)", reason: "Quirky image that sticks", bonus: true }
        ],
        traps: [
          { text: "Gen 1-3 = The Creation Story", reason: "DESCRIPTION — not a visual image" },
          { text: "These chapters teach about sin", reason: "THEOLOGY — not memory image" },
          { text: "Multiple images for each chapter", reason: "WRONG — only ONE image per chapter" }
        ]
      }
    ],
    BR: [
      {
        ref: "Genesis 1-24",
        text: "The first 24-chapter block of Scripture — Creation through Isaac's bride.",
        valid: [
          { text: "Symbol: / (divisions emerge throughout)", reason: "Simple glyph for large section" },
          { text: "Light/dark, land/sea, nations divide", reason: "Theme captured in one symbol" },
          { text: "One glyph captures 24 chapters", reason: "Correct compression method", bonus: true }
        ],
        traps: [
          { text: "Multiple symbols needed for this block", reason: "WRONG — only ONE glyph per block" },
          { text: "Detailed summary of each chapter", reason: "WRONG — compression, not summary" },
          { text: "Complex symbol with many elements", reason: "WRONG — simplicity is key" }
        ]
      }
    ],
    TR: [
      {
        ref: "Psalm 119:105",
        text: "Your word is a lamp to my feet and a light to my path.",
        valid: [
          { text: "Glowing scroll on a dark path, casting light ahead", reason: "Concrete visual translation" },
          { text: "Lamp illuminating just the next step", reason: "Visual captures 'feet' detail" },
          { text: "Draw: open book with rays of light", reason: "Simple icon captures verse", bonus: true }
        ],
        traps: [
          { text: "The Bible guides us spiritually", reason: "ABSTRACT — not a visual" },
          { text: "God's Word shows the way", reason: "ABSTRACT — keep it concrete" },
          { text: "This teaches about Scripture's importance", reason: "THEOLOGY — not translation to image" }
        ]
      }
    ],
    GR: [
      {
        ref: "Genesis 22:8 + John 1:29",
        text: "'God will provide himself a lamb' + 'Behold the Lamb of God'",
        valid: [
          { text: "Abraham's prophecy + John's fulfillment = one Gem", reason: "Two texts illuminate each other" },
          { text: "God provided HIMSELF as the lamb", reason: "Combined insight from both verses" },
          { text: "2000 years apart, same Lamb", reason: "Cross-reference creates new insight", bonus: true }
        ],
        traps: [
          { text: "Just study Genesis 22 alone", reason: "WRONG — Gems require multiple texts" },
          { text: "These are unrelated passages", reason: "WRONG — they illuminate each other" },
          { text: "Focus on Abraham's faith only", reason: "SINGLE VERSE — misses the combination" }
        ]
      }
    ],
    // FLOOR 2 - Framework
    OR: [
      {
        ref: "Luke 15:20",
        text: "While he was still a long way off, his father saw him and was filled with compassion; he ran to his son.",
        valid: [
          { text: "The father saw him", reason: "Directly stated action" },
          { text: "The son was far away", reason: "Stated: 'a long way off'" },
          { text: "The father ran", reason: "Directly stated action" },
          { text: "The father embraced and kissed him", reason: "Stated actions" },
          { text: "The father acted first", reason: "Sequence shows father's actions before son speaks", bonus: true }
        ],
        traps: [
          { text: "The father forgave him", reason: "INTERPRETATION — forgiveness implied not stated" },
          { text: "Grace comes before repentance", reason: "THEOLOGY — not an observation" },
          { text: "This shows God's unconditional love", reason: "APPLICATION — not observation" }
        ]
      },
      {
        ref: "John 11:35",
        text: "Jesus wept.",
        valid: [
          { text: "Jesus wept", reason: "Complete text — directly stated" },
          { text: "One person named: Jesus", reason: "Observable fact" },
          { text: "One action: weeping", reason: "Observable fact" },
          { text: "Shortest verse in English Bible", reason: "Observable fact about text", bonus: true }
        ],
        traps: [
          { text: "Jesus was deeply grieved", reason: "INTERPRETATION — only 'wept' stated" },
          { text: "This shows Jesus' humanity", reason: "THEOLOGY — doctrinal conclusion" },
          { text: "Jesus wept because He loved Lazarus", reason: "INTERPRETATION — reason not in this verse" }
        ]
      }
    ],
    DC: [
      {
        ref: "John 1:1",
        text: "In the beginning was the Word, and the Word was with God, and the Word was God.",
        valid: [
          { text: "LOGOS (Word) = divine reason/expression", reason: "Greek definition matters" },
          { text: "Compare with Genesis 1:1 'In the beginning'", reason: "Cross-reference connection" },
          { text: "'Was' (ēn) = continuous existence", reason: "Word study reveals depth", bonus: true }
        ],
        traps: [
          { text: "The Word means Bible", reason: "WRONG DEFINITION — Logos is Christ" },
          { text: "Skip to application", reason: "WRONG — define first, then apply" },
          { text: "Ignore Greek meanings", reason: "WRONG — definitions matter" }
        ]
      }
    ],
    ST: [
      {
        ref: "John 1:29",
        text: "Behold the Lamb of God who takes away the sin of the world.",
        valid: [
          { text: "LAMB = Christ as sacrifice", reason: "Consistent OT meaning" },
          { text: "Links to Passover lamb (Exodus 12)", reason: "Same symbol meaning" },
          { text: "Links to Isaiah 53 'led as lamb to slaughter'", reason: "Prophetic symbol connection", bonus: true }
        ],
        traps: [
          { text: "LAMB = gentleness or meekness", reason: "WRONG MEANING — misses sacrifice" },
          { text: "Just a nickname John used", reason: "TOO SHALLOW — deep OT symbolism" },
          { text: "No OT connection", reason: "FALSE — clear Passover link" }
        ]
      },
      {
        ref: "John 8:12",
        text: "I am the light of the world. He who follows me shall not walk in darkness.",
        valid: [
          { text: "LIGHT = Christ Himself", reason: "Jesus explicitly claims it" },
          { text: "LIGHT = truth and revelation", reason: "Light exposes and reveals" },
          { text: "DARKNESS = sin, evil, ignorance", reason: "Biblical contrast with light" },
          { text: "Links to Lampstand in Sanctuary", reason: "Christ is the true light", bonus: true }
        ],
        traps: [
          { text: "LIGHT = happiness", reason: "TOO SHALLOW — light is truth/Christ" },
          { text: "DARKNESS = sadness", reason: "WRONG — moral/spiritual, not emotional" },
          { text: "Just metaphorical language", reason: "MISSES DEPTH — profound claim" }
        ]
      }
    ],
    QR: [
      {
        ref: "Mark 4:35-41",
        text: "Jesus calms the storm while the disciples fear.",
        valid: [
          { text: "WHO was in the boat?", reason: "Valid observation question" },
          { text: "WHAT did Jesus say to the storm?", reason: "Valid observation question" },
          { text: "WHERE was Jesus sleeping?", reason: "Valid observation question" },
          { text: "WHY did they wake Him?", reason: "Valid investigation question", bonus: true }
        ],
        traps: [
          { text: "The storm represents life's troubles", reason: "INTERPRETATION — not a question" },
          { text: "We should have faith like Jesus", reason: "APPLICATION — not asking questions" },
          { text: "Jesus is God because He controls nature", reason: "CONCLUSION — question first" }
        ]
      }
    ],
    QA: [
      {
        ref: "Genesis 3:9",
        text: "The LORD God called to the man, 'Where are you?'",
        valid: [
          { text: "Why did God ask if He already knew?", reason: "Question that sparks another" },
          { text: "What does 'where' mean to God?", reason: "Chain continues with new angle" },
          { text: "Where else does God ask questions?", reason: "Chain extends to other texts", bonus: true }
        ],
        traps: [
          { text: "God was looking for Adam", reason: "ANSWER — but chain dies here" },
          { text: "This shows God's mercy", reason: "CONCLUSION — not a chain question" },
          { text: "Adam was hiding in the trees", reason: "FACT — but doesn't spark new question" }
        ]
      }
    ],
    // FLOOR 3 - Freestyle
    NF: [
      {
        ref: "Psalm 1:3",
        text: "He is like a tree planted by streams of water, which yields its fruit in season.",
        valid: [
          { text: "Real trees need constant water source", reason: "Nature parallel to Scripture" },
          { text: "Fruit trees take years to mature", reason: "Natural world illustrates truth" },
          { text: "Transplanted trees need stream proximity", reason: "Nature insight deepens text", bonus: true }
        ],
        traps: [
          { text: "Trees represent Christians", reason: "INTERPRETATION — not nature observation" },
          { text: "We should be fruitful", reason: "APPLICATION — not nature freestyle" },
          { text: "Water is the Holy Spirit", reason: "SYMBOLISM — not nature insight" }
        ]
      }
    ],
    PF: [
      {
        ref: "Philippians 4:13",
        text: "I can do all things through Christ who strengthens me.",
        valid: [
          { text: "What specific challenge am I facing today?", reason: "Personal application" },
          { text: "Where do I need Christ's strength right now?", reason: "Specific to YOUR life" },
          { text: "This applies to my struggle with...", reason: "Named personal area", bonus: true }
        ],
        traps: [
          { text: "Christians can do anything", reason: "GENERIC — not personal" },
          { text: "Paul was very strong", reason: "ABOUT PAUL — not about you" },
          { text: "God helps people", reason: "TOO GENERIC — get specific" }
        ]
      }
    ],
    BF: [
      {
        ref: "Matthew 5:17",
        text: "Do not think that I have come to abolish the Law or the Prophets; I have not come to abolish them but to fulfill them.",
        valid: [
          { text: "Compare with Romans 10:4 'Christ is the end of the law'", reason: "Scripture interprets Scripture" },
          { text: "Connect to Colossians 2:17 'shadow of things to come'", reason: "Bible freestyle connection" },
          { text: "Link to Hebrews 8:5 'copy and shadow'", reason: "Cross-reference illuminates", bonus: true }
        ],
        traps: [
          { text: "Jesus ended the law", reason: "IGNORES CONTEXT — He fulfilled it" },
          { text: "No need to look at other verses", reason: "WRONG — Bible interprets Bible" },
          { text: "My opinion about the law", reason: "NOT SCRIPTURE — use Bible only" }
        ]
      }
    ],
    HF: [
      {
        ref: "Luke 15:20",
        text: "His father ran to him.",
        valid: [
          { text: "Patriarchs didn't run — undignified in culture", reason: "Historical context insight" },
          { text: "Running showed urgency over dignity", reason: "Social context matters" },
          { text: "Middle Eastern father running was shocking", reason: "Cultural background deepens text", bonus: true }
        ],
        traps: [
          { text: "The father loved his son", reason: "INTERPRETATION — not historical" },
          { text: "Running is good exercise", reason: "IRRELEVANT — not biblical context" },
          { text: "We should run to God", reason: "APPLICATION — not history" }
        ]
      }
    ],
    LR: [
      {
        ref: "Isaiah 41:10",
        text: "Fear not, for I am with you; be not dismayed, for I am your God.",
        valid: [
          { text: "God is speaking directly to ME right now", reason: "Personal word received" },
          { text: "I sense God addressing my specific fear of...", reason: "Listening for personal application" },
          { text: "'Your God' — He is MY God personally", reason: "Intimate application", bonus: true }
        ],
        traps: [
          { text: "Isaiah wrote to ancient Israel", reason: "HISTORICAL — not listening" },
          { text: "This is a general promise", reason: "GENERIC — get personal" },
          { text: "Fear is discussed in Scripture", reason: "ACADEMIC — not devotional" }
        ]
      }
    ],
    // FLOOR 4 - Focus
    CR: [
      {
        ref: "Genesis 22:8",
        text: "Abraham said, 'God will provide himself a lamb for a burnt offering, my son.'",
        valid: [
          { text: "God Himself IS the lamb — points to Christ", reason: "Christocentric reading" },
          { text: "Fulfilled in John 1:29 'Lamb of God'", reason: "Christ connection" },
          { text: "Abraham prophesied without knowing fully", reason: "Type pointing to antitype", bonus: true }
        ],
        traps: [
          { text: "Abraham was comforting Isaac", reason: "TOO SHALLOW — misses Christ" },
          { text: "This is about obedience", reason: "MORALISM — misses Christ" },
          { text: "No Messianic meaning here", reason: "WRONG — Jesus said Abraham saw His day" }
        ]
      },
      {
        ref: "Numbers 21:8-9",
        text: "Make a bronze serpent and set it on a pole. Everyone who is bitten, when he sees it, shall live.",
        valid: [
          { text: "Jesus said this pointed to Him (John 3:14)", reason: "Christ's own interpretation" },
          { text: "Lifted serpent = lifted Christ on cross", reason: "Type/antitype connection" },
          { text: "Look and live = believe and live", reason: "Gospel foreshadowed", bonus: true }
        ],
        traps: [
          { text: "Just a strange miracle story", reason: "TOO SHALLOW — misses Christ" },
          { text: "Serpent represents evil", reason: "WRONG — represents Christ bearing sin" },
          { text: "Moses healed them", reason: "WRONG FOCUS — God through symbol of Christ" }
        ]
      }
    ],
    DR: [
      {
        ref: "Exodus 12:13",
        text: "When I see the blood, I will pass over you.",
        valid: [
          { text: "LITERAL: Blood on doorposts saved firstborn", reason: "Historical event" },
          { text: "CHRIST: Jesus is our Passover (1 Cor 5:7)", reason: "Christological dimension" },
          { text: "PERSONAL: Christ's blood covers MY sin", reason: "Personal application" },
          { text: "CHURCH: We are protected community", reason: "Ecclesial dimension" },
          { text: "HEAVEN: Final deliverance from judgment", reason: "Eschatological dimension", bonus: true }
        ],
        traps: [
          { text: "Only the historical event matters", reason: "SINGLE DIMENSION — missing others" },
          { text: "This is just about ancient Israel", reason: "MISSING DIMENSIONS" },
          { text: "No personal relevance", reason: "IGNORING personal dimension" }
        ]
      }
    ],
    C6: [
      {
        ref: "The Lamb Theme",
        text: "Tracing 'Lamb' across all six sections of Scripture.",
        valid: [
          { text: "Torah: Passover lamb (Exodus 12)", reason: "First section connection" },
          { text: "History: Temple sacrifices continue", reason: "Second section link" },
          { text: "Poetry: 'Like a lamb to slaughter' (Psalm)", reason: "Third section" },
          { text: "Prophets: Isaiah 53 suffering servant", reason: "Fourth section" },
          { text: "Gospels: 'Behold the Lamb' John 1:29", reason: "Fifth section" },
          { text: "Epistles/Revelation: 'Lamb slain' Rev 5:6", reason: "Sixth section", bonus: true }
        ],
        traps: [
          { text: "Lamb only appears in John", reason: "IGNORING other sections" },
          { text: "Skip the Old Testament lambs", reason: "MISSING Torah connection" },
          { text: "Only Revelation matters", reason: "IGNORING 5 other sections" }
        ]
      }
    ],
    TRm: [
      {
        ref: "Seed Theme",
        text: "The 'seed' promise traced through Scripture.",
        valid: [
          { text: "Genesis 3:15 — seed of woman crushes serpent", reason: "Theme origin" },
          { text: "Genesis 22:18 — Abraham's seed blesses nations", reason: "Theme development" },
          { text: "Galatians 3:16 — the Seed is Christ", reason: "Theme fulfillment", bonus: true }
        ],
        traps: [
          { text: "Seed just means children", reason: "SHALLOW — misses Messianic theme" },
          { text: "No connection between passages", reason: "WRONG — clear thematic link" },
          { text: "Theme ends in Genesis", reason: "WRONG — continues to Christ" }
        ]
      }
    ],
    TZ: [
      {
        ref: "Daniel 2 & 7",
        text: "Kingdoms prophecy spanning past, present, and future.",
        valid: [
          { text: "PAST: Babylon, Persia, Greece — fulfilled", reason: "Historical fulfillment" },
          { text: "PRESENT: Rome/divided kingdoms — ongoing", reason: "Current relevance" },
          { text: "FUTURE: Stone kingdom — coming", reason: "Prophetic future", bonus: true }
        ],
        traps: [
          { text: "This was only for Daniel's time", reason: "IGNORING future dimension" },
          { text: "Already completely fulfilled", reason: "MISSING present/future" },
          { text: "Pure future, no past fulfillment", reason: "IGNORING past dimension" }
        ]
      }
    ],
    PRm: [
      {
        ref: "Pattern: Deliverance through Water",
        text: "Noah's flood, Red Sea, Jordan crossing — same pattern.",
        valid: [
          { text: "Water brings death to enemies, life to God's people", reason: "Recurring pattern" },
          { text: "Noah: world judged, family saved through water", reason: "First instance" },
          { text: "Exodus: Egypt judged, Israel saved through sea", reason: "Pattern repeats" },
          { text: "Joshua: Jordan parts, Israel enters promise", reason: "Pattern continues", bonus: true }
        ],
        traps: [
          { text: "These are unrelated water stories", reason: "MISSING THE PATTERN" },
          { text: "Water is just a setting detail", reason: "SHALLOW — pattern is significant" },
          { text: "Coincidental similarities", reason: "WRONG — intentional typology" }
        ]
      }
    ],
    "P||": [
      {
        ref: "Adam and Christ Parallel",
        text: "Romans 5:14 calls Adam 'a type of the one to come.'",
        valid: [
          { text: "Adam: one man's sin brought death to all", reason: "First Adam's effect" },
          { text: "Christ: one man's obedience brings life to all", reason: "Last Adam's effect" },
          { text: "Adam in garden: fell; Christ in garden: overcame", reason: "Parallel with contrast", bonus: true }
        ],
        traps: [
          { text: "Adam and Jesus are unrelated", reason: "IGNORING Paul's explicit parallel" },
          { text: "Only focus on Adam's failure", reason: "MISSING the parallel to Christ" },
          { text: "Only focus on Christ's success", reason: "MISSING the Adam comparison" }
        ]
      }
    ],
    FRt: [
      {
        ref: "Galatians 5:22-23",
        text: "The fruit of the Spirit is love, joy, peace, patience, kindness, goodness, faithfulness, gentleness, self-control.",
        valid: [
          { text: "Joseph showed PATIENCE in prison years", reason: "Fruit seen in biblical character" },
          { text: "Jesus showed SELF-CONTROL before Pilate", reason: "Fruit demonstrated in Gospel" },
          { text: "Moses showed MEEKNESS (Numbers 12:3)", reason: "Fruit in OT figure", bonus: true }
        ],
        traps: [
          { text: "Just memorize the list", reason: "SHALLOW — see fruit in action" },
          { text: "I should try harder to be good", reason: "MORALISM — fruit comes from Spirit" },
          { text: "This is just for Christians today", reason: "MISSING — fruit in all Scripture" }
        ]
      }
    ],
    // FLOOR 5 - Finish
    BL: [
      {
        ref: "Hebrews 9:11-12",
        text: "Christ entered once for all into the holy places, by means of his own blood.",
        valid: [
          { text: "Christ = true High Priest in heavenly sanctuary", reason: "Sanctuary connection" },
          { text: "His blood > animal blood at altar", reason: "Altar antitype" },
          { text: "Holy Place access through His sacrifice", reason: "Veil connection" },
          { text: "Heavenly sanctuary is the 'greater tabernacle'", reason: "Pattern/reality link", bonus: true }
        ],
        traps: [
          { text: "No sanctuary exists in heaven", reason: "CONTRADICTS Hebrews" },
          { text: "OT sanctuary was meaningless", reason: "WRONG — it was pattern of heavenly" },
          { text: "Sanctuary teaching is obsolete", reason: "WRONG — Hebrews explains it" }
        ]
      }
    ],
    PR: [
      {
        ref: "Daniel 9:24-27",
        text: "Seventy weeks are decreed for your people.",
        valid: [
          { text: "70 weeks = 490 prophetic days = years", reason: "Day-year principle" },
          { text: "Starting point: decree to rebuild Jerusalem", reason: "Prophetic anchor" },
          { text: "Messiah cut off in midst of final week", reason: "Christ's death prophesied", bonus: true }
        ],
        traps: [
          { text: "Just literal 70 weeks", reason: "IGNORES prophetic time" },
          { text: "No connection to Christ", reason: "WRONG — 'Messiah' explicitly mentioned" },
          { text: "Already completely fulfilled in past", reason: "MISSES ongoing relevance" }
        ]
      }
    ],
    "3A": [
      {
        ref: "Revelation 14:6-12",
        text: "Three angels with eternal gospel, Babylon fallen, mark of beast warning.",
        valid: [
          { text: "1st Angel: Fear God, judgment hour come", reason: "First message identified" },
          { text: "2nd Angel: Babylon is fallen", reason: "Second message identified" },
          { text: "3rd Angel: Don't worship beast or image", reason: "Third message identified" },
          { text: "These messages appear throughout Scripture", reason: "Not just Revelation", bonus: true }
        ],
        traps: [
          { text: "Only relevant at end of time", reason: "WRONG — principles throughout Bible" },
          { text: "Just apocalyptic imagery", reason: "SHALLOW — serious messages" },
          { text: "Angels are literal beings only", reason: "MISSING — symbolic of message bearers" }
        ]
      }
    ],
    FE: [
      {
        ref: "Leviticus 23",
        text: "The seven feasts of the LORD: Passover, Unleavened Bread, Firstfruits, Pentecost, Trumpets, Atonement, Tabernacles.",
        valid: [
          { text: "Passover = Christ's death", reason: "Feast fulfillment" },
          { text: "Firstfruits = Christ's resurrection", reason: "Feast fulfillment" },
          { text: "Pentecost = Holy Spirit poured out", reason: "Feast fulfillment" },
          { text: "Fall feasts = end-time events", reason: "Prophetic awaiting", bonus: true }
        ],
        traps: [
          { text: "Just Jewish holidays", reason: "SHALLOW — Christ fulfills them" },
          { text: "No Christian relevance", reason: "WRONG — Paul calls Christ our Passover" },
          { text: "Only historical meaning", reason: "MISSING prophetic dimension" }
        ]
      }
    ],
    CEC: [
      {
        ref: "Genesis 1",
        text: "In the beginning God created the heavens and the earth.",
        valid: [
          { text: "Christ is the Word through whom all was made (John 1)", reason: "Christ in chapter" },
          { text: "Spirit hovering = Spirit of Christ present", reason: "Christ present at creation" },
          { text: "'Let there be light' = Christ is light of world", reason: "Christ connection", bonus: true }
        ],
        traps: [
          { text: "No Christ reference here", reason: "WRONG — Christ is Creator (Col 1:16)" },
          { text: "Just about physical creation", reason: "MISSING Christ the Creator" },
          { text: "Skip to the gospels for Christ", reason: "WRONG — Christ in EVERY chapter" }
        ]
      }
    ],
    R66: [
      {
        ref: "Romans 1:16-17",
        text: "The gospel is the power of God for salvation... the righteous shall live by faith.",
        valid: [
          { text: "Connects to Habakkuk 2:4 (Prophets)", reason: "66-book connection" },
          { text: "Connects to Galatians 3:11 (Paul's letters)", reason: "Internal NT connection" },
          { text: "Theme from Genesis to Revelation", reason: "All 66 books unified", bonus: true }
        ],
        traps: [
          { text: "Romans stands alone", reason: "WRONG — connects to all 66" },
          { text: "Only NT relevant here", reason: "WRONG — quotes OT prophet" },
          { text: "Ignore other epistles", reason: "WRONG — same theme in Galatians, Hebrews" }
        ]
      }
    ],
    "123H": [
      {
        ref: "2 Corinthians 12:2",
        text: "I know a man in Christ who was caught up to the third heaven.",
        valid: [
          { text: "1st Heaven = Atmosphere/sky (birds fly)", reason: "Three heavens defined" },
          { text: "2nd Heaven = Space (stars, planets)", reason: "Three heavens structure" },
          { text: "3rd Heaven = God's throne room", reason: "Where Paul was caught up", bonus: true }
        ],
        traps: [
          { text: "Only one heaven exists", reason: "WRONG — Paul says 'third'" },
          { text: "Heaven is just a concept", reason: "WRONG — real locations" },
          { text: "Three heavens is speculation", reason: "WRONG — Paul explicitly states it" }
        ]
      }
    ],
    CYC: [
      {
        ref: "Covenant Cycles",
        text: "Eight cycles: Adam, Noah, Shem, Abraham, Moses, David, Elijah, Christ.",
        valid: [
          { text: "Each cycle has sin, judgment, deliverance pattern", reason: "Cycle structure" },
          { text: "Christ is the culmination of all cycles", reason: "Final cycle" },
          { text: "History spirals toward Messiah", reason: "Cyclical progression", bonus: true }
        ],
        traps: [
          { text: "History is random", reason: "WRONG — God orders cycles" },
          { text: "Only Christ's time matters", reason: "WRONG — all cycles matter" },
          { text: "No pattern to biblical history", reason: "WRONG — clear cyclical pattern" }
        ]
      }
    ],
    // FLOOR 6 - Framing
    JR: [
      {
        ref: "John 3:16",
        text: "For God so loved the world that he gave his only Son.",
        valid: [
          { text: "JUICE: God gave His Son because He loves us", reason: "Core essence in one line" },
          { text: "One sentence captures the gospel", reason: "Extracted essence" },
          { text: "Love + Gift + Belief + Life = Gospel", reason: "Four-word summary", bonus: true }
        ],
        traps: [
          { text: "Long theological explanation", reason: "WRONG — extract the juice" },
          { text: "Multiple paragraphs needed", reason: "WRONG — get to essence" },
          { text: "Too complex for one sentence", reason: "WRONG — simplify to core" }
        ]
      }
    ],
    MATH: [
      {
        ref: "Biblical Numbers",
        text: "7, 12, 40, 3, 10 — numbers with significance.",
        valid: [
          { text: "7 = completion (creation week, 7 churches)", reason: "Biblical numeric meaning" },
          { text: "12 = government (tribes, apostles)", reason: "Number significance" },
          { text: "40 = testing (flood, wilderness, temptation)", reason: "Pattern recognition", bonus: true }
        ],
        traps: [
          { text: "Numbers are random in Bible", reason: "WRONG — often significant" },
          { text: "Find hidden codes in numbers", reason: "WRONG — avoid numerology" },
          { text: "Every number is mystical", reason: "WRONG — stick to clear patterns" }
        ]
      }
    ],
    FRm: [
      {
        ref: "Matthew 27:46",
        text: "My God, my God, why have you forsaken me?",
        valid: [
          { text: "Feel the crushing weight of abandonment", reason: "Heart response" },
          { text: "Let this moment break your heart", reason: "Emotional engagement" },
          { text: "He was forsaken so you never will be", reason: "Personal conviction", bonus: true }
        ],
        traps: [
          { text: "Analyze the Aramaic grammar", reason: "WRONG ROOM — academic, not heart" },
          { text: "Compare manuscript variants", reason: "WRONG ROOM — scholarly, not emotional" },
          { text: "Move quickly to resurrection", reason: "AVOIDING DEPTH — stay and feel" }
        ]
      }
    ],
    MR: [
      {
        ref: "Psalm 23:1",
        text: "The LORD is my shepherd; I shall not want.",
        valid: [
          { text: "Repeat slowly: 'The LORD... is MY... shepherd'", reason: "Meditation method" },
          { text: "Linger on 'MY shepherd' — personal possession", reason: "Slow reflection" },
          { text: "What does 'shall not want' mean for TODAY?", reason: "Deep dwelling", bonus: true }
        ],
        traps: [
          { text: "Read it once and move on", reason: "WRONG — meditate slowly" },
          { text: "Compare 10 translations quickly", reason: "WRONG ROOM — this is slow, deep" },
          { text: "Memorize and recite fast", reason: "WRONG — linger, don't rush" }
        ]
      }
    ],
    SRm: [
      {
        ref: "Rapid Recall Test",
        text: "Quick-fire questions testing instant Bible recall.",
        valid: [
          { text: "Name 5 fruits of the Spirit — GO!", reason: "Rapid recall" },
          { text: "Which OT book has 150 chapters?", reason: "Quick answer: Psalms" },
          { text: "First miracle of Jesus? Water to wine!", reason: "Instant connection", bonus: true }
        ],
        traps: [
          { text: "Let me think about it slowly...", reason: "WRONG ROOM — speed matters here" },
          { text: "I need to look that up", reason: "WRONG — test your recall" },
          { text: "Give me a few minutes", reason: "WRONG — this is SPEED room" }
        ]
      }
    ],
    INF: [
      {
        ref: "Reflexive Mastery",
        text: "When all principles integrate automatically.",
        valid: [
          { text: "See a text and instantly apply multiple rooms", reason: "Automatic integration" },
          { text: "Reading flows naturally into all dimensions", reason: "Seamless application" },
          { text: "No conscious effort to apply principles", reason: "Reflexive mastery", bonus: true }
        ],
        traps: [
          { text: "Still thinking about which room to use", reason: "NOT YET MASTERY — keep practicing" },
          { text: "Have to consciously choose a method", reason: "NOT YET AUTOMATIC" },
          { text: "Forget the foundations", reason: "WRONG — mastery builds on foundations" }
        ]
      }
    ]
  };

  // Get rooms for selected floor
  const getRoomsByFloor = (floor: number) => {
    return Object.values(rooms).filter(r => r.floor === floor);
  };

  // Get all rooms as array (stable reference)
  const allRoomsArray = Object.values(rooms);

  // Get current room for palace mode
  const getCurrentRoom = useCallback((): Room | null => {
    if (gameMode === 'single') return currentRoom;
    return allRoomsArray[palaceRoomIndex % allRoomsArray.length];
  }, [gameMode, currentRoom, palaceRoomIndex, allRoomsArray]);

  // Get current verse based on room and index
  const getCurrentVerse = useCallback((): Verse | null => {
    const room = getCurrentRoom();
    if (!room) return null;
    const verses = verseDatabase[room.code];
    if (!verses || verses.length === 0) return null;
    return verses[currentVerseIndex % verses.length];
  }, [getCurrentRoom, currentVerseIndex, verseDatabase]);

  // Spawn a new block
  const spawnBlock = useCallback(() => {
    const verse = getCurrentVerse();
    const room = getCurrentRoom();
    if (!verse || !room) return;

    const allBlocks = [
      ...verse.valid.map(b => ({ ...b, type: 'valid' as const })),
      ...verse.traps.map(b => ({ ...b, type: 'trap' as const }))
    ];

    const block = allBlocks[Math.floor(Math.random() * allBlocks.length)];

    blockIdCounter.current += 1;

    const newBlock: FallingBlock = {
      ...block,
      id: blockIdCounter.current,
      x: Math.random() * 70 + 15,
      y: -15,
      verseRef: verse.ref,
      roomCode: room.code,
      roomIcon: room.icon,
      roomName: room.name
    };

    setFallingBlocks(prev => [...prev, newBlock]);
  }, [getCurrentVerse, getCurrentRoom]);

  // Game loop
  useEffect(() => {
    if (gameState !== 'playing' || isPaused) return;

    const moveInterval = setInterval(() => {
      setFallingBlocks(prev => {
        return prev.map(block => ({
          ...block,
          y: block.y + speed
        })).filter(block => block.y <= 100);
      });
    }, 50);

    const spawnInterval = setInterval(() => {
      if (fallingBlocks.length < 4) {
        spawnBlock();
      }
    }, 2000 - Math.min(score * 2, 1500));

    return () => {
      clearInterval(moveInterval);
      clearInterval(spawnInterval);
    };
  }, [gameState, isPaused, speed, fallingBlocks.length, spawnBlock, score]);

  // Increase difficulty over time
  useEffect(() => {
    if (gameState !== 'playing') return;

    const newSpeed = 0.3 + Math.floor(score / 100) * 0.05;
    setSpeed(Math.min(newSpeed, 0.8));

    if (blocksProcessed > 0 && blocksProcessed % 10 === 0) {
      setCurrentVerseIndex(prev => prev + 1);

      if (gameMode === 'palace') {
        setPalaceRoomIndex(prev => prev + 1);
        const nextRoom = allRoomsArray[(palaceRoomIndex + 1) % allRoomsArray.length];
        setFeedback({
          type: 'info',
          title: `🏛️ NEW ROOM: ${nextRoom.icon} ${nextRoom.name}`,
          text: `Now catch: ${nextRoom.rule}`,
          duration: 3000
        });
      } else {
        setFeedback({ type: 'info', title: '📖 NEW VERSE!', duration: 2000 });
      }
    }
  }, [score, blocksProcessed, gameState, gameMode, palaceRoomIndex, allRoomsArray]);

  // Catch a block
  const catchBlock = (block: FallingBlock) => {
    const points = block.bonus ? 25 : 10;

    if (block.type === 'valid') {
      const streakBonus = streak >= 5 ? Math.floor(streak / 5) * 5 : 0;
      setScore(s => s + points + streakBonus);
      setStreak(s => s + 1);
      setBestStreak(prev => Math.max(prev, streak + 1));
      setBlocksProcessed(p => p + 1);

      setFeedback({
        type: 'success',
        title: block.bonus ? '🌟 BONUS!' : '✅ CORRECT!',
        text: block.text,
        reason: block.reason,
        points: points + streakBonus,
        duration: 2500
      });
    } else {
      setLives(l => l - 1);
      setStreak(0);
      setBlocksProcessed(p => p + 1);

      setFeedback({
        type: 'error',
        title: '❌ TRAP!',
        text: block.text,
        reason: block.reason,
        duration: 3000
      });

      if (lives <= 1) {
        setTimeout(() => {
          setGameState('gameOver');
          setHighScore(prev => Math.max(prev, score));
        }, 500);
      }
    }

    setFallingBlocks(prev => prev.filter(b => b.id !== block.id));
  };

  // Clear feedback
  useEffect(() => {
    if (feedback) {
      const timer = setTimeout(() => setFeedback(null), feedback.duration || 2000);
      return () => clearTimeout(timer);
    }
  }, [feedback]);

  // Start game
  const startGame = (room: Room | null, isPalaceMode = false) => {
    setCurrentRoom(room);
    setGameMode(isPalaceMode ? 'palace' : 'single');
    setScore(0);
    setLives(3);
    setStreak(0);
    setSpeed(0.3);
    setCurrentVerseIndex(0);
    setBlocksProcessed(0);
    setFallingBlocks([]);
    setFeedback(null);
    setPalaceRoomIndex(0);
    setSelectedFloor(null);
    setGameState('playing');

    setTimeout(() => spawnBlock(), 500);
    setTimeout(() => spawnBlock(), 1500);
  };

  // Floor colors
  const floorColors: Record<number, string> = {
    1: 'from-amber-600 to-amber-800',
    2: 'from-emerald-600 to-emerald-800',
    3: 'from-purple-600 to-purple-800',
    4: 'from-red-600 to-red-800',
    5: 'from-blue-700 to-blue-900',
    6: 'from-violet-700 to-violet-900'
  };

  const floorNames: Record<number, { name: string; subtitle: string }> = {
    1: { name: 'Furnishing', subtitle: 'Memory & Visualization' },
    2: { name: 'Framework', subtitle: 'Structure & Analysis' },
    3: { name: 'Freestyle', subtitle: 'Creative Application' },
    4: { name: 'Focus', subtitle: 'Christocentric Study' },
    5: { name: 'Finish', subtitle: 'Advanced Integration' },
    6: { name: 'Framing', subtitle: 'Final Mastery' }
  };

  // Render menu
  const renderMenu = () => (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white p-4 pb-24">
      <div className="max-w-md mx-auto">
        <h1 className="text-3xl font-bold text-center mb-2">🏛️ PT PALACE TETRIS</h1>
        <p className="text-center text-gray-400 mb-2">Master All 38 Rooms</p>

        {highScore > 0 && (
          <div className="text-center text-amber-400 mb-4">🏆 High Score: {highScore}</div>
        )}

        <div className="bg-gray-800 rounded-xl p-4 mb-6">
          <h2 className="font-bold text-lg mb-3">🎮 How to Play:</h2>
          <div className="space-y-3 text-sm">
            <div className="flex items-start gap-3 p-2 bg-green-900/30 rounded-lg border border-green-700/50">
              <span className="text-2xl">✅</span>
              <div>
                <div className="font-bold text-green-400">TAP GREEN BLOCKS</div>
                <div className="text-gray-300 text-xs">These FIT the room's rule - they match what you should "CATCH"</div>
              </div>
            </div>
            <div className="flex items-start gap-3 p-2 bg-red-900/30 rounded-lg border border-red-700/50">
              <span className="text-2xl">❌</span>
              <div>
                <div className="font-bold text-red-400">AVOID RED BLOCKS</div>
                <div className="text-gray-300 text-xs">These are TRAPS - interpretations, theology, or wrong approaches. Let them fall!</div>
              </div>
            </div>
            <div className="flex items-start gap-3 p-2 bg-yellow-900/30 rounded-lg border border-yellow-700/50">
              <span className="text-2xl">⭐</span>
              <div>
                <div className="font-bold text-yellow-400">BONUS BLOCKS = Extra Points!</div>
                <div className="text-gray-300 text-xs">Golden blocks give 25 pts instead of 10</div>
              </div>
            </div>
          </div>
          <div className="mt-4 p-3 bg-gray-700/50 rounded-lg">
            <div className="text-xs text-gray-400 mb-2">💡 <strong>THE KEY:</strong></div>
            <div className="text-xs text-gray-300">Each Palace room has a specific RULE. Read the "CATCH" and "AVOID" hints to know which blocks fit!</div>
          </div>
        </div>

        {/* FULL PALACE MODE */}
        <button
          onClick={() => startGame(null, true)}
          className="w-full p-4 bg-gradient-to-r from-purple-600 via-pink-600 to-amber-600 rounded-xl text-left hover:ring-2 hover:ring-white transition-all mb-6"
        >
          <div className="flex items-center gap-3 mb-2">
            <span className="text-3xl">🏛️</span>
            <div>
              <div className="font-bold text-lg">FULL PALACE MODE</div>
              <div className="text-xs opacity-80">All 38 rooms — ultimate mastery!</div>
            </div>
          </div>
          <div className="text-sm opacity-90">
            Rooms cycle every 10 blocks. Master every principle in Phototheology!
          </div>
        </button>

        <div className="text-sm text-gray-400 mb-3 text-center">— OR SELECT A FLOOR —</div>

        {/* Floor Selection */}
        {!selectedFloor ? (
          <div className="space-y-3">
            {[1, 2, 3, 4, 5, 6].map(floor => (
              <button
                key={floor}
                onClick={() => setSelectedFloor(floor)}
                className={`w-full p-4 bg-gradient-to-r ${floorColors[floor]} rounded-xl text-left hover:ring-2 hover:ring-white transition-all`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-bold">Floor {floor}: {floorNames[floor].name}</div>
                    <div className="text-xs opacity-80">{floorNames[floor].subtitle}</div>
                    <div className="text-xs opacity-60 mt-1">
                      {getRoomsByFloor(floor).length} rooms
                    </div>
                  </div>
                  <span className="text-2xl">→</span>
                </div>
              </button>
            ))}
          </div>
        ) : (
          <div className="space-y-3">
            <button
              onClick={() => setSelectedFloor(null)}
              className="text-gray-400 text-sm mb-2"
            >
              ← Back to Floors
            </button>

            <div className={`p-3 rounded-lg bg-gradient-to-r ${floorColors[selectedFloor]} mb-4`}>
              <div className="font-bold">Floor {selectedFloor}: {floorNames[selectedFloor].name}</div>
              <div className="text-xs opacity-80">{floorNames[selectedFloor].subtitle}</div>
            </div>

            {getRoomsByFloor(selectedFloor).map(room => (
              <button
                key={room.code}
                onClick={() => startGame(room, false)}
                className={`w-full p-3 bg-gradient-to-r ${room.color} rounded-xl text-left hover:ring-2 hover:ring-white transition-all`}
              >
                <div className="flex items-center gap-3 mb-1">
                  <span className="text-xl">{room.icon}</span>
                  <div>
                    <div className="font-bold text-sm">{room.name}</div>
                    <div className="text-xs opacity-80">{room.code}</div>
                  </div>
                </div>
                <div className="text-xs opacity-90 mb-1">
                  <span className="font-semibold">CATCH:</span> {room.catch}
                </div>
                <div className="text-xs opacity-70">
                  <span className="font-semibold">AVOID:</span> {room.avoid}
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );

  // Render game
  const renderGame = () => {
    const verse = getCurrentVerse();
    const room = getCurrentRoom();

    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white p-2 overflow-hidden">
        {/* Header */}
        <div className="flex justify-between items-center mb-2 px-2">
          <button onClick={() => setGameState('menu')} className="text-gray-400 hover:text-white text-sm">
            ✕ Exit
          </button>
          <div className="text-center">
            {gameMode === 'palace' ? (
              <div className="font-bold text-sm bg-gradient-to-r from-purple-400 to-amber-400 bg-clip-text text-transparent">
                🏛️ FULL PALACE
              </div>
            ) : (
              <div className="font-bold text-sm">{room?.icon} {room?.name}</div>
            )}
          </div>
          <div className="text-right">
            <div className="text-amber-400 font-bold">{score}</div>
            <div className="text-xs">{'❤️'.repeat(lives)}{'🖤'.repeat(3-lives)}</div>
          </div>
        </div>

        {/* Room Rule Banner - Enhanced */}
        <div className={`mx-2 mb-2 p-3 rounded-lg bg-gradient-to-r ${room?.color}`}>
          <div className="flex items-center justify-center gap-2 mb-2">
            <span className="text-xl">{room?.icon}</span>
            <div className="font-bold">{room?.name}</div>
          </div>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="bg-green-500/30 rounded p-2 border border-green-400/50">
              <div className="font-bold text-green-300">✅ CATCH:</div>
              <div className="opacity-90">{room?.catch}</div>
            </div>
            <div className="bg-red-500/30 rounded p-2 border border-red-400/50">
              <div className="font-bold text-red-300">❌ AVOID:</div>
              <div className="opacity-90">{room?.avoid}</div>
            </div>
          </div>
        </div>

        {/* Current Verse */}
        {verse && (
          <div className="mx-2 mb-2 bg-gray-800/90 rounded-lg p-3">
            <div className="flex justify-between items-start mb-1">
              <span className="font-bold text-amber-400 text-sm">📖 {verse.ref}</span>
              {streak >= 3 && (
                <span className="text-xs bg-orange-500 px-2 py-0.5 rounded-full">
                  🔥 {streak}
                </span>
              )}
            </div>
            <div className="text-xs text-gray-300 leading-relaxed max-h-16 overflow-y-auto">
              {verse.text}
            </div>
          </div>
        )}

        {/* Feedback */}
        {feedback && (
          <div className={`mx-2 mb-2 p-3 rounded-lg ${
            feedback.type === 'success' ? 'bg-green-900/90 border border-green-500' :
            feedback.type === 'error' ? 'bg-red-900/90 border border-red-500' :
            'bg-blue-900/90 border border-blue-500'
          }`}>
            <div className="font-bold text-sm">{feedback.title}</div>
            {feedback.text && <div className="text-xs mt-1 opacity-90">{feedback.text}</div>}
            {feedback.reason && <div className="text-xs mt-1 opacity-75">→ {feedback.reason}</div>}
            {feedback.points && <div className="text-xs mt-1 text-green-300">+{feedback.points}</div>}
          </div>
        )}

        {/* Game Area */}
        <div className="relative mx-2 bg-gray-800/30 rounded-xl border border-gray-700 overflow-hidden" style={{ height: '40vh' }}>
          {fallingBlocks.map(block => (
            <button
              key={block.id}
              onClick={() => catchBlock(block)}
              className={`absolute px-3 py-2 rounded-lg text-xs font-medium transition-transform hover:scale-105 active:scale-95 shadow-lg max-w-48 text-left leading-tight ${
                block.type === 'valid'
                  ? block.bonus
                    ? 'bg-gradient-to-br from-yellow-400 to-amber-500 text-black ring-2 ring-yellow-300 animate-pulse'
                    : 'bg-gradient-to-br from-green-500 to-green-700 text-white border-2 border-green-400'
                  : 'bg-gradient-to-br from-red-600 to-red-800 text-white border-2 border-red-400'
              }`}
              style={{
                left: `${block.x}%`,
                top: `${block.y}%`,
                transform: 'translateX(-50%)'
              }}
            >
              {/* Block type indicator */}
              <div className={`text-xs mb-1 font-bold ${
                block.type === 'valid'
                  ? block.bonus ? 'text-black/70' : 'text-green-200'
                  : 'text-red-200'
              }`}>
                {block.type === 'valid' ? (block.bonus ? '⭐ BONUS' : '✅ CATCH') : '❌ TRAP'}
              </div>
              {gameMode === 'palace' && (
                <div className="text-xs opacity-70 mb-0.5">{block.roomIcon} {block.roomCode}</div>
              )}
              <div className="font-medium">{block.text}</div>
            </button>
          ))}

          {fallingBlocks.length === 0 && (
            <div className="absolute inset-0 flex items-center justify-center text-gray-500 text-sm">
              Blocks incoming...
            </div>
          )}
        </div>

        {/* Instructions Legend */}
        <div className="mx-2 mt-2 p-2 bg-gray-800/50 rounded-lg">
          <div className="text-xs text-center space-y-1">
            <div className="flex justify-center gap-4">
              <span><span className="inline-block w-3 h-3 bg-green-500 rounded mr-1"></span> <span className="text-green-400">TAP to catch!</span></span>
              <span><span className="inline-block w-3 h-3 bg-yellow-400 rounded mr-1"></span> <span className="text-yellow-400">Bonus +25</span></span>
              <span><span className="inline-block w-3 h-3 bg-red-500 rounded mr-1"></span> <span className="text-red-400">Let fall!</span></span>
            </div>
            <div className="text-gray-500 text-xs">Tapping a trap loses a life ❤️</div>
          </div>
        </div>
      </div>
    );
  };

  // Render game over
  const renderGameOver = () => {
    const room = getCurrentRoom();

    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white p-4 flex items-center justify-center">
        <div className="max-w-md mx-auto text-center">
          <div className="text-6xl mb-4">{lives > 0 ? '🏆' : '💔'}</div>
          <h2 className="text-2xl font-bold mb-2">GAME OVER</h2>
          <div className="text-gray-400 mb-6">
            {gameMode === 'palace' ? '🏛️ Full Palace Mode' : room?.name}
          </div>

          <div className="bg-gray-800 rounded-xl p-6 mb-6">
            <div className="grid grid-cols-2 gap-6">
              <div>
                <div className="text-4xl font-bold text-amber-400">{score}</div>
                <div className="text-xs text-gray-400">SCORE</div>
              </div>
              <div>
                <div className="text-4xl font-bold text-orange-400">{bestStreak}</div>
                <div className="text-xs text-gray-400">BEST STREAK</div>
              </div>
            </div>

            {score >= highScore && score > 0 && (
              <div className="mt-4 text-green-400 font-bold">🏆 NEW HIGH SCORE!</div>
            )}
          </div>

          <div className="flex gap-3 justify-center">
            <button
              onClick={() => startGame(currentRoom, gameMode === 'palace')}
              className={`px-6 py-3 rounded-lg font-bold hover:ring-2 hover:ring-white ${
                gameMode === 'palace'
                  ? 'bg-gradient-to-r from-purple-600 via-pink-600 to-amber-600'
                  : `bg-gradient-to-r ${room?.color}`
              }`}
            >
              Play Again
            </button>
            <button
              onClick={() => setGameState('menu')}
              className="px-6 py-3 bg-gray-700 hover:bg-gray-600 rounded-lg"
            >
              Menu
            </button>
          </div>
        </div>
      </div>
    );
  };

  switch (gameState) {
    case 'playing':
      return renderGame();
    case 'gameOver':
      return renderGameOver();
    default:
      return renderMenu();
  }
};

export default PTPalaceTetris;
