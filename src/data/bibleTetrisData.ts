// Bible Tetris - Phototheology Edition
// Constraint-based puzzle game data

export type PieceCategory = 'STORY' | 'SYMBOL' | 'LAW' | 'PROMISE' | 'PROPHECY' | 'CHRIST_KEY' | 'APPLICATION';
export type Rarity = 'common' | 'uncommon' | 'rare';
export type Difficulty = 'Beginner' | 'Intermediate' | 'Master';

export interface BiblePiece {
  id: string;
  label: string;
  category: PieceCategory;
  pt_room: string;
  principle_tags: string[];
  scripture_refs: string[];
  rarity: Rarity;
  is_deception: boolean;
}

export interface LevelConfig {
  id: string;
  title: string;
  difficulty: Difficulty;
  study_question: string;
  spotlight_rooms: string[];
  required_rules: string[];
  optional_rules: string[];
  piece_pool_ids: string[];
  deception_intensity: number;
  confusion_threshold: number;
  speed_curve: { start: number; ramp_per_min: number };
  post_level_insight: string;
}

// Category colors for UI
export const CATEGORY_COLORS: Record<PieceCategory, string> = {
  STORY: 'from-amber-500 to-amber-700',
  SYMBOL: 'from-blue-500 to-blue-700',
  LAW: 'from-red-500 to-red-700',
  PROMISE: 'from-green-500 to-green-700',
  PROPHECY: 'from-purple-500 to-purple-700',
  CHRIST_KEY: 'from-yellow-400 to-yellow-600',
  APPLICATION: 'from-teal-500 to-teal-700',
};

export const CATEGORY_ICONS: Record<PieceCategory, string> = {
  STORY: '📖',
  SYMBOL: '🔣',
  LAW: '⚖️',
  PROMISE: '🌈',
  PROPHECY: '📢',
  CHRIST_KEY: '✝️',
  APPLICATION: '💡',
};

// Room colors
export const ROOM_COLORS: Record<string, string> = {
  'Story Room': 'bg-amber-600',
  'Symbols Library': 'bg-blue-600',
  'Blue Room': 'bg-indigo-700',
  'Prophecy Room': 'bg-purple-700',
  'Math Room': 'bg-gray-600',
  'Dimensions Room': 'bg-cyan-600',
  'Feasts Room': 'bg-orange-600',
  'Connect-6 Room': 'bg-sky-600',
};

// ============================================
// PIECES DATABASE
// ============================================

export const PIECES: BiblePiece[] = [
  // STORY pieces
  {
    id: "S_GETHSEMANE",
    label: "Gethsemane",
    category: "STORY",
    pt_room: "Story Room",
    principle_tags: ["SUFFERING", "PRAYER", "WILL", "ATONEMENT"],
    scripture_refs: ["Matthew 26:36-46", "Mark 14:32-42", "Luke 22:39-46"],
    rarity: "common",
    is_deception: false
  },
  {
    id: "S_GOLGOTHA",
    label: "Golgotha",
    category: "STORY",
    pt_room: "Story Room",
    principle_tags: ["CROSS", "ATONEMENT", "JUDGMENT", "SUBSTITUTION"],
    scripture_refs: ["Matthew 27", "Mark 15", "Luke 23", "John 19"],
    rarity: "common",
    is_deception: false
  },
  {
    id: "S_LAST_SUPPER",
    label: "Last Supper",
    category: "STORY",
    pt_room: "Story Room",
    principle_tags: ["COVENANT", "PASSOVER", "BREAD", "CUP"],
    scripture_refs: ["Matthew 26:17-30", "Mark 14:12-26", "Luke 22:7-23", "1 Corinthians 11:23-26"],
    rarity: "common",
    is_deception: false
  },
  {
    id: "S_PASSOVER_EXODUS",
    label: "Passover / Exodus",
    category: "STORY",
    pt_room: "Story Room",
    principle_tags: ["PASSOVER", "DELIVERANCE", "BLOOD", "COVENANT"],
    scripture_refs: ["Exodus 12"],
    rarity: "common",
    is_deception: false
  },
  {
    id: "S_SINAI_COVENANT",
    label: "Sinai Covenant",
    category: "STORY",
    pt_room: "Story Room",
    principle_tags: ["LAW", "COVENANT", "WORSHIP", "HOLINESS"],
    scripture_refs: ["Exodus 19-20", "Exodus 24"],
    rarity: "uncommon",
    is_deception: false
  },
  {
    id: "S_SERPENT_FALL",
    label: "Fall in Eden",
    category: "STORY",
    pt_room: "Story Room",
    principle_tags: ["FALL", "DECEPTION", "COVENANT", "PROMISE"],
    scripture_refs: ["Genesis 3"],
    rarity: "common",
    is_deception: false
  },
  {
    id: "S_CAIN_ABEL",
    label: "Cain & Abel",
    category: "STORY",
    pt_room: "Story Room",
    principle_tags: ["SACRIFICE", "FAITH", "BLOOD", "WORSHIP"],
    scripture_refs: ["Genesis 4:1-16", "Hebrews 11:4"],
    rarity: "common",
    is_deception: false
  },
  {
    id: "S_ABRAHAM_ISAAC",
    label: "Abraham & Isaac",
    category: "STORY",
    pt_room: "Story Room",
    principle_tags: ["SUBSTITUTION", "FAITH", "PROMISE", "SACRIFICE"],
    scripture_refs: ["Genesis 22", "Hebrews 11:17-19"],
    rarity: "uncommon",
    is_deception: false
  },
  {
    id: "S_JOSEPH_COAT",
    label: "Joseph's Coat",
    category: "STORY",
    pt_room: "Story Room",
    principle_tags: ["INNOCENT_SUFFERING", "BLOOD", "COVERING", "PROVIDENCE"],
    scripture_refs: ["Genesis 37"],
    rarity: "uncommon",
    is_deception: false
  },
  {
    id: "S_DAVID_GOLIATH",
    label: "David & Goliath",
    category: "STORY",
    pt_room: "Story Room",
    principle_tags: ["VICTORY", "FAITH", "DELIVERANCE", "BATTLE"],
    scripture_refs: ["1 Samuel 17"],
    rarity: "common",
    is_deception: false
  },

  // SYMBOL pieces
  {
    id: "Y_LAMB",
    label: "Lamb",
    category: "SYMBOL",
    pt_room: "Symbols Library",
    principle_tags: ["SACRIFICE", "SUBSTITUTION", "PASSOVER", "ATONEMENT"],
    scripture_refs: ["Exodus 12", "John 1:29", "Revelation 5"],
    rarity: "common",
    is_deception: false
  },
  {
    id: "Y_BLOOD",
    label: "Blood",
    category: "SYMBOL",
    pt_room: "Symbols Library",
    principle_tags: ["ATONEMENT", "COVENANT", "CLEANSING", "LIFE"],
    scripture_refs: ["Leviticus 17:11", "Hebrews 9"],
    rarity: "common",
    is_deception: false
  },
  {
    id: "Y_CUP",
    label: "Cup",
    category: "SYMBOL",
    pt_room: "Symbols Library",
    principle_tags: ["WRATH", "SUFFERING", "JUDGMENT", "ATONEMENT"],
    scripture_refs: ["Matthew 26:39", "Isaiah 51:17", "Revelation 14:10"],
    rarity: "common",
    is_deception: false
  },
  {
    id: "Y_DARKNESS",
    label: "Darkness",
    category: "SYMBOL",
    pt_room: "Symbols Library",
    principle_tags: ["JUDGMENT", "SEPARATION", "SIN", "WRATH"],
    scripture_refs: ["Matthew 27:45", "Exodus 10:21-23"],
    rarity: "common",
    is_deception: false
  },
  {
    id: "Y_VEIL",
    label: "Veil",
    category: "SYMBOL",
    pt_room: "Symbols Library",
    principle_tags: ["ACCESS", "SEPARATION", "COVERING", "ATONEMENT"],
    scripture_refs: ["Exodus 26:31-33", "Matthew 27:51", "Hebrews 10:19-20"],
    rarity: "common",
    is_deception: false
  },
  {
    id: "Y_ALTAR",
    label: "Altar",
    category: "SYMBOL",
    pt_room: "Symbols Library",
    principle_tags: ["SACRIFICE", "SUBSTITUTION", "JUDGMENT", "CONSECRATION"],
    scripture_refs: ["Leviticus 1", "Revelation 8:3-5"],
    rarity: "common",
    is_deception: false
  },
  {
    id: "Y_LAVER",
    label: "Laver",
    category: "SYMBOL",
    pt_room: "Symbols Library",
    principle_tags: ["CLEANSING", "HOLINESS", "PREPARATION", "TRUTH"],
    scripture_refs: ["Exodus 30:17-21"],
    rarity: "uncommon",
    is_deception: false
  },
  {
    id: "Y_LAMPSTAND",
    label: "Lampstand",
    category: "SYMBOL",
    pt_room: "Symbols Library",
    principle_tags: ["LIGHT", "SPIRIT", "WITNESS", "HOLY_PLACE"],
    scripture_refs: ["Exodus 25:31-40", "Revelation 1:12-20"],
    rarity: "uncommon",
    is_deception: false
  },
  {
    id: "Y_BREAD",
    label: "Bread",
    category: "SYMBOL",
    pt_room: "Symbols Library",
    principle_tags: ["LIFE", "COVENANT", "COMMUNION", "SUSTENANCE"],
    scripture_refs: ["Exodus 25:23-30", "John 6"],
    rarity: "common",
    is_deception: false
  },
  {
    id: "Y_INCENSE",
    label: "Incense",
    category: "SYMBOL",
    pt_room: "Symbols Library",
    principle_tags: ["PRAYER", "INTERCESSION", "WORSHIP", "MEDIATION"],
    scripture_refs: ["Exodus 30:1-10", "Revelation 8:3-4"],
    rarity: "uncommon",
    is_deception: false
  },
  {
    id: "Y_ARK",
    label: "Ark",
    category: "SYMBOL",
    pt_room: "Symbols Library",
    principle_tags: ["LAW", "COVENANT", "THRONE", "JUDGMENT"],
    scripture_refs: ["Exodus 25:10-22", "Revelation 11:19"],
    rarity: "rare",
    is_deception: false
  },

  // LAW pieces
  {
    id: "L_SIN",
    label: "Sin",
    category: "LAW",
    pt_room: "Symbols Library",
    principle_tags: ["LAW", "GUILT", "SEPARATION"],
    scripture_refs: ["Romans 3:23", "Isaiah 59:2"],
    rarity: "common",
    is_deception: false
  },
  {
    id: "L_CURSE",
    label: "Curse",
    category: "LAW",
    pt_room: "Symbols Library",
    principle_tags: ["LAW", "JUDGMENT", "FALL"],
    scripture_refs: ["Genesis 3", "Galatians 3:13"],
    rarity: "uncommon",
    is_deception: false
  },
  {
    id: "L_JUSTICE",
    label: "Justice",
    category: "LAW",
    pt_room: "Symbols Library",
    principle_tags: ["LAW", "RIGHTEOUSNESS", "JUDGMENT"],
    scripture_refs: ["Deuteronomy 32:4", "Romans 3:26"],
    rarity: "uncommon",
    is_deception: false
  },
  {
    id: "L_COMMANDMENTS",
    label: "Commandments",
    category: "LAW",
    pt_room: "Symbols Library",
    principle_tags: ["LAW", "COVENANT", "WORSHIP", "HOLINESS"],
    scripture_refs: ["Exodus 20", "Revelation 14:12"],
    rarity: "rare",
    is_deception: false
  },

  // PROMISE pieces
  {
    id: "P_FORGIVENESS",
    label: "Forgiveness",
    category: "PROMISE",
    pt_room: "Symbols Library",
    principle_tags: ["GOSPEL", "MERCY", "COVENANT"],
    scripture_refs: ["1 John 1:9", "Psalm 103:12"],
    rarity: "common",
    is_deception: false
  },
  {
    id: "P_RECONCILIATION",
    label: "Reconciliation",
    category: "PROMISE",
    pt_room: "Symbols Library",
    principle_tags: ["GOSPEL", "PEACE", "COVENANT"],
    scripture_refs: ["2 Corinthians 5:18-21", "Romans 5:10"],
    rarity: "uncommon",
    is_deception: false
  },
  {
    id: "P_COVENANT",
    label: "Covenant",
    category: "PROMISE",
    pt_room: "Symbols Library",
    principle_tags: ["COVENANT", "PROMISE", "LAW_HEART"],
    scripture_refs: ["Jeremiah 31:31-34", "Hebrews 8"],
    rarity: "rare",
    is_deception: false
  },

  // CHRIST_KEY pieces
  {
    id: "C_CROSS",
    label: "Cross",
    category: "CHRIST_KEY",
    pt_room: "Blue Room",
    principle_tags: ["ATONEMENT", "SUBSTITUTION", "GOSPEL", "JUDGMENT"],
    scripture_refs: ["Isaiah 53", "1 Peter 2:24"],
    rarity: "common",
    is_deception: false
  },
  {
    id: "C_HIGH_PRIEST",
    label: "High Priest",
    category: "CHRIST_KEY",
    pt_room: "Blue Room",
    principle_tags: ["INTERCESSION", "MEDIATION", "SANCTUARY", "ATONEMENT"],
    scripture_refs: ["Hebrews 4:14-16", "Hebrews 8:1-2"],
    rarity: "common",
    is_deception: false
  },
  {
    id: "C_INTERCESSION",
    label: "Intercession",
    category: "CHRIST_KEY",
    pt_room: "Blue Room",
    principle_tags: ["PRAYER", "MEDIATION", "SANCTUARY"],
    scripture_refs: ["Hebrews 7:25", "Romans 8:34"],
    rarity: "uncommon",
    is_deception: false
  },
  {
    id: "C_RESURRECTION",
    label: "Resurrection",
    category: "CHRIST_KEY",
    pt_room: "Story Room",
    principle_tags: ["VICTORY", "GOSPEL", "LIFE"],
    scripture_refs: ["1 Corinthians 15", "Matthew 28"],
    rarity: "rare",
    is_deception: false
  },

  // PROPHECY pieces
  {
    id: "R_ISAIAH_53",
    label: "Isaiah 53",
    category: "PROPHECY",
    pt_room: "Prophecy Room",
    principle_tags: ["SUFFERING", "SUBSTITUTION", "ATONEMENT", "JUSTICE"],
    scripture_refs: ["Isaiah 52:13-53:12"],
    rarity: "common",
    is_deception: false
  },
  {
    id: "R_PSALM_22",
    label: "Psalm 22",
    category: "PROPHECY",
    pt_room: "Prophecy Room",
    principle_tags: ["ABANDONMENT", "SUFFERING", "CROSS", "DELIVERANCE"],
    scripture_refs: ["Psalm 22"],
    rarity: "common",
    is_deception: false
  },
  {
    id: "R_DANIEL_8",
    label: "Daniel 8",
    category: "PROPHECY",
    pt_room: "Prophecy Room",
    principle_tags: ["SANCTUARY", "JUDGMENT", "TIME", "CLEANSING"],
    scripture_refs: ["Daniel 8"],
    rarity: "rare",
    is_deception: false
  },
  {
    id: "R_DANIEL_9",
    label: "Daniel 9",
    category: "PROPHECY",
    pt_room: "Prophecy Room",
    principle_tags: ["MESSIAH", "COVENANT", "TIME", "ATONEMENT"],
    scripture_refs: ["Daniel 9:24-27"],
    rarity: "rare",
    is_deception: false
  },
  {
    id: "R_REVELATION_14",
    label: "Revelation 14",
    category: "PROPHECY",
    pt_room: "Prophecy Room",
    principle_tags: ["GOSPEL", "JUDGMENT", "WORSHIP", "ENDURANCE"],
    scripture_refs: ["Revelation 14:6-12"],
    rarity: "rare",
    is_deception: false
  },

  // Math Room PROPHECY pieces
  {
    id: "M_70_WEEKS",
    label: "70 Weeks",
    category: "PROPHECY",
    pt_room: "Math Room",
    principle_tags: ["TIME", "MESSIAH", "COVENANT"],
    scripture_refs: ["Daniel 9:24-27"],
    rarity: "rare",
    is_deception: false
  },
  {
    id: "M_1260",
    label: "1260",
    category: "PROPHECY",
    pt_room: "Math Room",
    principle_tags: ["TIME", "PERSECUTION", "HISTORY"],
    scripture_refs: ["Daniel 7:25", "Revelation 12:6", "Revelation 13:5"],
    rarity: "rare",
    is_deception: false
  },
  {
    id: "M_2300",
    label: "2300",
    category: "PROPHECY",
    pt_room: "Math Room",
    principle_tags: ["TIME", "SANCTUARY", "JUDGMENT", "CLEANSING"],
    scripture_refs: ["Daniel 8:14"],
    rarity: "rare",
    is_deception: false
  },

  // Dimensions Room APPLICATION pieces
  {
    id: "D_HEAVEN_DIMENSION",
    label: "Heaven Dimension",
    category: "APPLICATION",
    pt_room: "Dimensions Room",
    principle_tags: ["HEAVEN", "PERSPECTIVE", "ETERNAL"],
    scripture_refs: ["Colossians 3:1-3", "Hebrews 8:1-2"],
    rarity: "uncommon",
    is_deception: false
  },
  {
    id: "D_WITNESS_RULE",
    label: "Two Witnesses",
    category: "APPLICATION",
    pt_room: "Dimensions Room",
    principle_tags: ["HARMONY", "TEST", "TRUTH"],
    scripture_refs: ["Deuteronomy 19:15", "2 Corinthians 13:1"],
    rarity: "common",
    is_deception: false
  },

  // Feasts Room STORY pieces
  {
    id: "F_PASSOVER",
    label: "Passover",
    category: "STORY",
    pt_room: "Feasts Room",
    principle_tags: ["PASSOVER", "DELIVERANCE", "BLOOD"],
    scripture_refs: ["Leviticus 23:4-8"],
    rarity: "common",
    is_deception: false
  },
  {
    id: "F_PENTECOST",
    label: "Pentecost",
    category: "STORY",
    pt_room: "Feasts Room",
    principle_tags: ["SPIRIT", "WITNESS", "HARVEST"],
    scripture_refs: ["Leviticus 23:15-22", "Acts 2"],
    rarity: "uncommon",
    is_deception: false
  },
  {
    id: "F_ATONEMENT",
    label: "Day of Atonement",
    category: "STORY",
    pt_room: "Feasts Room",
    principle_tags: ["ATONEMENT", "CLEANSING", "JUDGMENT", "SANCTUARY"],
    scripture_refs: ["Leviticus 16", "Leviticus 23:26-32"],
    rarity: "rare",
    is_deception: false
  },
  {
    id: "F_TABERNACLES",
    label: "Tabernacles",
    category: "STORY",
    pt_room: "Feasts Room",
    principle_tags: ["DWELLING", "JOY", "KINGDOM"],
    scripture_refs: ["Leviticus 23:33-44", "Revelation 21:3"],
    rarity: "rare",
    is_deception: false
  },

  // Connect-6 Room APPLICATION piece
  {
    id: "X_CONNECT6_TOKEN",
    label: "Connect-6 Challenge",
    category: "APPLICATION",
    pt_room: "Connect-6 Room",
    principle_tags: ["CONNECT6"],
    scripture_refs: [],
    rarity: "rare",
    is_deception: false
  },

  // DECEPTION pieces
  {
    id: "Z_PROOFTEXT",
    label: "Proof-text",
    category: "APPLICATION",
    pt_room: "Symbols Library",
    principle_tags: ["DECEPTION", "CONTEXT"],
    scripture_refs: [],
    rarity: "uncommon",
    is_deception: true
  },
  {
    id: "Z_TRADITION",
    label: "Tradition",
    category: "APPLICATION",
    pt_room: "Symbols Library",
    principle_tags: ["DECEPTION", "AUTHORITY"],
    scripture_refs: ["Mark 7:8-13"],
    rarity: "uncommon",
    is_deception: true
  },
  {
    id: "Z_SIGNS",
    label: "Signs",
    category: "APPLICATION",
    pt_room: "Symbols Library",
    principle_tags: ["DECEPTION", "SPECTACLE"],
    scripture_refs: ["Matthew 24:24", "2 Thessalonians 2:9-10"],
    rarity: "uncommon",
    is_deception: true
  },
  {
    id: "Z_EMOTION",
    label: "Emotion-only",
    category: "APPLICATION",
    pt_room: "Symbols Library",
    principle_tags: ["DECEPTION", "SUBJECTIVE"],
    scripture_refs: ["Jeremiah 17:9"],
    rarity: "uncommon",
    is_deception: true
  },
  {
    id: "Z_PEACE_NO_TRUTH",
    label: "Peace w/o Truth",
    category: "APPLICATION",
    pt_room: "Symbols Library",
    principle_tags: ["DECEPTION", "COMPROMISE"],
    scripture_refs: ["Jeremiah 6:14"],
    rarity: "rare",
    is_deception: true
  },
];

// ============================================
// RULES - Evaluate whether a row of pieces satisfies a pattern
// ============================================

export type RuleId =
  | 'STORY_TO_CHRIST'
  | 'SYMBOL_TO_DOCTRINE'
  | 'BLUE_ROOM_ANCHOR'
  | 'PROPHECY_TO_CHRIST'
  | 'DIMENSIONS_CONSTRAINT'
  | 'DECEPTION_TESTING';

export interface RuleDefinition {
  id: RuleId;
  name: string;
  description: string;
  shortDesc: string;
}

export const RULE_DEFINITIONS: Record<RuleId, RuleDefinition> = {
  STORY_TO_CHRIST: {
    id: 'STORY_TO_CHRIST',
    name: 'Story to Christ',
    description: 'Row must contain at least 1 STORY piece and 1 CHRIST_KEY piece.',
    shortDesc: 'STORY + CHRIST_KEY'
  },
  SYMBOL_TO_DOCTRINE: {
    id: 'SYMBOL_TO_DOCTRINE',
    name: 'Symbol to Doctrine',
    description: 'Row must contain at least 2 SYMBOL pieces and 1 LAW or PROMISE piece.',
    shortDesc: '2 SYMBOL + LAW/PROMISE'
  },
  BLUE_ROOM_ANCHOR: {
    id: 'BLUE_ROOM_ANCHOR',
    name: 'Blue Room Anchor',
    description: 'Row must include a Blue Room piece, a CHRIST_KEY, and a STORY or PROPHECY.',
    shortDesc: 'Blue Room + CHRIST_KEY + STORY/PROPHECY'
  },
  PROPHECY_TO_CHRIST: {
    id: 'PROPHECY_TO_CHRIST',
    name: 'Prophecy to Christ',
    description: 'Row with PROPHECY must also contain CHRIST_KEY or it triggers Confusion.',
    shortDesc: 'PROPHECY requires CHRIST_KEY'
  },
  DIMENSIONS_CONSTRAINT: {
    id: 'DIMENSIONS_CONSTRAINT',
    name: 'Dimensions Constraint',
    description: 'Dimensions Room pieces must clear with Blue Room Anchor or Prophecy to Christ.',
    shortDesc: 'Dimensions + Anchor/Prophecy'
  },
  DECEPTION_TESTING: {
    id: 'DECEPTION_TESTING',
    name: 'Deception Testing',
    description: 'Deception pieces are neutralized only if cleared with CHRIST_KEY and Blue Room Anchor.',
    shortDesc: 'Test Deception with Christ'
  },
};

// Rule evaluation functions
export const evaluateRule = (ruleId: RuleId, pieces: BiblePiece[]): boolean => {
  switch (ruleId) {
    case 'STORY_TO_CHRIST':
      return pieces.some(p => p.category === 'STORY') &&
             pieces.some(p => p.category === 'CHRIST_KEY');

    case 'SYMBOL_TO_DOCTRINE':
      return pieces.filter(p => p.category === 'SYMBOL').length >= 2 &&
             pieces.some(p => p.category === 'LAW' || p.category === 'PROMISE');

    case 'BLUE_ROOM_ANCHOR':
      return pieces.some(p => p.pt_room === 'Blue Room') &&
             pieces.some(p => p.category === 'CHRIST_KEY') &&
             pieces.some(p => p.category === 'STORY' || p.category === 'PROPHECY');

    case 'PROPHECY_TO_CHRIST':
      // If there's a prophecy, must have Christ key
      const hasProphecy = pieces.some(p => p.category === 'PROPHECY');
      const hasChristKey = pieces.some(p => p.category === 'CHRIST_KEY');
      return !hasProphecy || hasChristKey;

    case 'DIMENSIONS_CONSTRAINT':
      const hasDimensionsRoom = pieces.some(p => p.pt_room === 'Dimensions Room');
      if (!hasDimensionsRoom) return true; // No constraint if no dimensions piece
      // Must satisfy Blue Room Anchor OR Prophecy to Christ
      return evaluateRule('BLUE_ROOM_ANCHOR', pieces) ||
             (pieces.some(p => p.category === 'PROPHECY') && pieces.some(p => p.category === 'CHRIST_KEY'));

    case 'DECEPTION_TESTING':
      const hasDeception = pieces.some(p => p.is_deception);
      if (!hasDeception) return true; // No deception = passes
      // Must have Christ Key AND Blue Room piece
      return pieces.some(p => p.category === 'CHRIST_KEY') &&
             pieces.some(p => p.pt_room === 'Blue Room');

    default:
      return false;
  }
};

// Check if a row passes ANY required rule (for scoring)
export const evaluateRowForClear = (pieces: BiblePiece[], requiredRules: RuleId[]): {
  cleared: boolean;
  satisfiedRules: RuleId[];
  failedRules: RuleId[];
  hasUntestedDeception: boolean;
} => {
  const satisfiedRules: RuleId[] = [];
  const failedRules: RuleId[] = [];

  for (const ruleId of requiredRules) {
    if (evaluateRule(ruleId, pieces)) {
      satisfiedRules.push(ruleId);
    } else {
      failedRules.push(ruleId);
    }
  }

  // Check for untested deception
  const hasDeception = pieces.some(p => p.is_deception);
  const deceptionTested = evaluateRule('DECEPTION_TESTING', pieces);
  const hasUntestedDeception = hasDeception && !deceptionTested;

  return {
    cleared: satisfiedRules.length > 0,
    satisfiedRules,
    failedRules,
    hasUntestedDeception
  };
};

// ============================================
// LEVELS
// ============================================

export const LEVELS: LevelConfig[] = [
  {
    id: "LV1_WEIGHT_OF_THE_CUP",
    title: "The Weight of the Cup",
    difficulty: "Beginner",
    study_question: "What does Scripture identify as the primary burden of Christ's suffering?",
    spotlight_rooms: ["Story Room", "Blue Room", "Symbols Library"],
    required_rules: ["STORY_TO_CHRIST", "BLUE_ROOM_ANCHOR"],
    optional_rules: ["SYMBOL_TO_DOCTRINE"],
    piece_pool_ids: [
      "S_GETHSEMANE", "S_GOLGOTHA", "S_LAST_SUPPER",
      "Y_CUP", "Y_DARKNESS", "Y_BLOOD", "Y_LAMB",
      "L_SIN", "L_CURSE",
      "P_RECONCILIATION",
      "C_CROSS", "C_HIGH_PRIEST"
    ],
    deception_intensity: 0,
    confusion_threshold: 16,
    speed_curve: { start: 1.0, ramp_per_min: 0.08 },
    post_level_insight: "Christ's 'cup' was not physical pain alone, but bearing the full weight of divine judgment for sin."
  },
  {
    id: "LV2_VEIL_AND_WAY",
    title: "The Veil and the Way",
    difficulty: "Beginner",
    study_question: "What did the torn veil mean in the logic of access to God?",
    spotlight_rooms: ["Blue Room", "Symbols Library"],
    required_rules: ["BLUE_ROOM_ANCHOR", "SYMBOL_TO_DOCTRINE"],
    optional_rules: [],
    piece_pool_ids: [
      "S_GOLGOTHA",
      "Y_VEIL", "Y_BLOOD", "Y_ARK",
      "L_SIN",
      "P_FORGIVENESS",
      "C_CROSS", "C_HIGH_PRIEST", "C_INTERCESSION"
    ],
    deception_intensity: 0,
    confusion_threshold: 15,
    speed_curve: { start: 1.05, ramp_per_min: 0.10 },
    post_level_insight: "The torn veil signifies direct access to God through Christ's sacrifice - no more human mediator required."
  },
  {
    id: "LV3_LAMB_LAW_SUBSTITUTE",
    title: "Lamb, Law, and Substitute",
    difficulty: "Intermediate",
    study_question: "Why must atonement cohere with both justice and mercy (law and promise)?",
    spotlight_rooms: ["Story Room", "Blue Room", "Symbols Library"],
    required_rules: ["SYMBOL_TO_DOCTRINE", "STORY_TO_CHRIST"],
    optional_rules: ["BLUE_ROOM_ANCHOR"],
    piece_pool_ids: [
      "S_PASSOVER_EXODUS", "S_CAIN_ABEL", "S_ABRAHAM_ISAAC",
      "Y_LAMB", "Y_BLOOD", "Y_ALTAR",
      "L_JUSTICE", "L_SIN",
      "P_FORGIVENESS", "P_COVENANT",
      "C_CROSS", "C_HIGH_PRIEST",
      "Z_PROOFTEXT"
    ],
    deception_intensity: 1,
    confusion_threshold: 14,
    speed_curve: { start: 1.2, ramp_per_min: 0.12 },
    post_level_insight: "Substitutionary atonement satisfies both justice (the penalty is paid) and mercy (another bears it)."
  },
  {
    id: "LV4_ATONEMENT_PROCESS",
    title: "Day of Atonement Logic",
    difficulty: "Intermediate",
    study_question: "What is the difference between forgiveness, cleansing, and final removal of sin in sanctuary logic?",
    spotlight_rooms: ["Blue Room", "Feasts Room", "Symbols Library"],
    required_rules: ["BLUE_ROOM_ANCHOR"],
    optional_rules: ["SYMBOL_TO_DOCTRINE"],
    piece_pool_ids: [
      "F_ATONEMENT", "F_PASSOVER",
      "Y_ALTAR", "Y_LAVER", "Y_LAMPSTAND", "Y_BREAD", "Y_INCENSE", "Y_ARK", "Y_VEIL",
      "L_SIN", "L_COMMANDMENTS",
      "P_FORGIVENESS",
      "C_HIGH_PRIEST", "C_INTERCESSION",
      "Z_TRADITION"
    ],
    deception_intensity: 1,
    confusion_threshold: 13,
    speed_curve: { start: 1.25, ramp_per_min: 0.14 },
    post_level_insight: "Forgiveness transfers sin to sanctuary; cleansing removes it from sanctuary; judgment removes it from universe."
  },
  {
    id: "LV5_PROPHECY_TOUCHES_PRIESTHOOD",
    title: "Prophecy Must Touch Priesthood",
    difficulty: "Intermediate",
    study_question: "What keeps prophecy from becoming speculation?",
    spotlight_rooms: ["Prophecy Room", "Math Room", "Blue Room"],
    required_rules: ["PROPHECY_TO_CHRIST", "BLUE_ROOM_ANCHOR"],
    optional_rules: [],
    piece_pool_ids: [
      "R_DANIEL_8", "R_DANIEL_9", "R_REVELATION_14",
      "M_70_WEEKS", "M_1260", "M_2300",
      "Y_ARK", "Y_VEIL", "Y_INCENSE",
      "C_HIGH_PRIEST", "C_INTERCESSION",
      "Z_PROOFTEXT"
    ],
    deception_intensity: 1,
    confusion_threshold: 12,
    speed_curve: { start: 1.35, ramp_per_min: 0.16 },
    post_level_insight: "Prophecy anchored in sanctuary and Christ remains tethered to biblical truth, not speculation."
  },
  {
    id: "LV6_HEAVEN_DIMENSION_PRESSURE",
    title: "Heaven Dimension Pressure Test",
    difficulty: "Master",
    study_question: "How must heavenly perspective be tethered to sanctuary and Christ (not detached spirituality)?",
    spotlight_rooms: ["Dimensions Room", "Blue Room", "Prophecy Room"],
    required_rules: ["DIMENSIONS_CONSTRAINT", "PROPHECY_TO_CHRIST"],
    optional_rules: ["BLUE_ROOM_ANCHOR"],
    piece_pool_ids: [
      "D_HEAVEN_DIMENSION", "D_WITNESS_RULE",
      "R_PSALM_22", "R_ISAIAH_53", "R_DANIEL_8",
      "Y_INCENSE", "Y_ARK",
      "C_HIGH_PRIEST", "C_INTERCESSION",
      "Z_EMOTION", "Z_SIGNS"
    ],
    deception_intensity: 2,
    confusion_threshold: 10,
    speed_curve: { start: 1.6, ramp_per_min: 0.20 },
    post_level_insight: "Heavenly dimension is not mysticism - it's anchored in the real sanctuary where Christ ministers."
  },
  {
    id: "LV7_CONNECT6_COUNTERFEIT",
    title: "Connect-6 + Counterfeit",
    difficulty: "Master",
    study_question: "Can you maintain whole-palace coherence under deception pressure?",
    spotlight_rooms: ["All"],
    required_rules: ["BLUE_ROOM_ANCHOR", "PROPHECY_TO_CHRIST", "STORY_TO_CHRIST", "DECEPTION_TESTING"],
    optional_rules: ["SYMBOL_TO_DOCTRINE", "DIMENSIONS_CONSTRAINT"],
    piece_pool_ids: [
      "X_CONNECT6_TOKEN",
      "S_GETHSEMANE", "S_GOLGOTHA", "S_PASSOVER_EXODUS",
      "F_ATONEMENT", "F_TABERNACLES",
      "R_REVELATION_14", "M_2300",
      "Y_CUP", "Y_VEIL", "Y_ARK", "Y_INCENSE", "Y_LAMB", "Y_BLOOD",
      "L_COMMANDMENTS", "L_JUSTICE",
      "P_COVENANT", "P_RECONCILIATION",
      "C_CROSS", "C_HIGH_PRIEST", "C_INTERCESSION",
      "D_HEAVEN_DIMENSION", "D_WITNESS_RULE",
      "Z_PROOFTEXT", "Z_TRADITION", "Z_SIGNS", "Z_EMOTION", "Z_PEACE_NO_TRUTH"
    ],
    deception_intensity: 3,
    confusion_threshold: 9,
    speed_curve: { start: 1.9, ramp_per_min: 0.26 },
    post_level_insight: "Whole-palace coherence means every doctrine connects to Christ through sanctuary logic."
  }
];

// Helper to get pieces for a level
export const getPiecesForLevel = (level: LevelConfig): BiblePiece[] => {
  return level.piece_pool_ids
    .map(id => PIECES.find(p => p.id === id))
    .filter((p): p is BiblePiece => p !== undefined);
};

// Get piece by ID
export const getPieceById = (id: string): BiblePiece | undefined => {
  return PIECES.find(p => p.id === id);
};
