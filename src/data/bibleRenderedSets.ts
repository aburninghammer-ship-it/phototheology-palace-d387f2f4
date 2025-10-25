export interface BibleRenderedSet {
  number: number;
  symbol: string;
  name: string;
  range: string;
  description: string;
  category: string;
}

export const bibleRenderedSets: BibleRenderedSet[] = [
  // Sets 1-10: Genesis → early monarchy
  {
    number: 1,
    symbol: "÷",
    name: "Separation / Division",
    range: "Genesis 1–24",
    description: "Creation, fall, flood, Babel, call of Abram",
    category: "Genesis to Early Monarchy"
  },
  {
    number: 2,
    symbol: "×",
    name: "Multiplication",
    range: "Genesis 25–50",
    description: "Abraham's line explodes → Isaac, Jacob, 12 tribes, Joseph",
    category: "Genesis to Early Monarchy"
  },
  {
    number: 3,
    symbol: "➤",
    name: "Deliverance",
    range: "Exodus 1–24",
    description: "Slavery, plagues, Passover, Red Sea, Sinai covenant",
    category: "Genesis to Early Monarchy"
  },
  {
    number: 4,
    symbol: "⛺",
    name: "Sanctuary",
    range: "Exodus 25 – Leviticus 8",
    description: "God moves in; blueprint of worship, priesthood",
    category: "Genesis to Early Monarchy"
  },
  {
    number: 5,
    symbol: "⚖",
    name: "Laws / Holiness",
    range: "Leviticus 9 – Numbers 5",
    description: "Clean/unclean, atonement, how to live near holiness without dying",
    category: "Genesis to Early Monarchy"
  },
  {
    number: 6,
    symbol: "👣",
    name: "Journey",
    range: "Numbers 6 – Numbers 29",
    description: "Wilderness walk, rebellion, mercy",
    category: "Genesis to Early Monarchy"
  },
  {
    number: 7,
    symbol: "🏁",
    name: "Arrival Prep",
    range: "Numbers 30 – Deuteronomy 17",
    description: "End of Numbers, Moses warning them how to live in the land",
    category: "Genesis to Early Monarchy"
  },
  {
    number: 8,
    symbol: "🔄",
    name: "Transition",
    range: "Deuteronomy 18 – Joshua 6",
    description: "Handoff from Moses to Joshua, crossing Jordan, Jericho falls",
    category: "Genesis to Early Monarchy"
  },
  {
    number: 9,
    symbol: "⚔",
    name: "Conquer",
    range: "Joshua 7 – Judges 6",
    description: "Land taken, then decline cycles begin",
    category: "Genesis to Early Monarchy"
  },
  {
    number: 10,
    symbol: "☢",
    name: "Disorder",
    range: "Judges 7 – Ruth 4 – 1 Samuel 3",
    description: "Chaos, 'everyone did what was right in his own eyes,' plus Ruth locking in the David line",
    category: "Genesis to Early Monarchy"
  },
  
  // Sets 11-20: Rise of kings → poetry/wisdom shift
  {
    number: 11,
    symbol: "💢",
    name: "Jealousy",
    range: "1 Samuel 4 – 28",
    description: "Israel demands a king, Saul's insecurity and rage against David",
    category: "Rise of Kings to Poetry/Wisdom"
  },
  {
    number: 12,
    symbol: "👑",
    name: "Kingship",
    range: "1 Samuel 29 – 2 Samuel 21",
    description: "Saul falls, David rises and rules",
    category: "Rise of Kings to Poetry/Wisdom"
  },
  {
    number: 13,
    symbol: "🔗",
    name: "Unification",
    range: "2 Samuel 22 – 1 Kings 21",
    description: "David's final stretch, Solomon takes the throne, the kingdom at peak strength and unity",
    category: "Rise of Kings to Poetry/Wisdom"
  },
  {
    number: 14,
    symbol: "✂",
    name: "Division",
    range: "1 Kings 22 – 2 Kings 23",
    description: "Split kingdoms, idolatry, prophetic confrontations, northern/southern drift",
    category: "Rise of Kings to Poetry/Wisdom"
  },
  {
    number: 15,
    symbol: "⏪",
    name: "David Flashback",
    range: "2 Kings 24 – 1 Chronicles 22",
    description: "Collapse toward Babylon, then rewind to David's story to anchor identity",
    category: "Rise of Kings to Poetry/Wisdom"
  },
  {
    number: 16,
    symbol: "💎",
    name: "Solomon Flashback",
    range: "1 Chronicles 23 – 2 Chronicles 14",
    description: "Temple order, priestly structure, early kingship under Solomon and the first Judean kings",
    category: "Rise of Kings to Poetry/Wisdom"
  },
  {
    number: 17,
    symbol: "⛓",
    name: "Captivity & Redemption",
    range: "2 Chronicles 15 – Ezra 5",
    description: "Spiritual reforms, downfall, Babylonian exile, first waves of return",
    category: "Rise of Kings to Poetry/Wisdom"
  },
  {
    number: 18,
    symbol: "🧱",
    name: "Rebuilding & Crisis",
    range: "Ezra 6 – Esther 6",
    description: "Temple completion, Nehemiah walls, Esther's setup in Persia with the threat forming",
    category: "Rise of Kings to Poetry/Wisdom"
  },
  {
    number: 19,
    symbol: "🕊",
    name: "God's Protection",
    range: "Esther 7 – Job 20",
    description: "God preserves His people from annihilation; Job pulls the curtain back on spiritual attack",
    category: "Rise of Kings to Poetry/Wisdom"
  },
  {
    number: 20,
    symbol: "🙏",
    name: "Trust in God",
    range: "Job 21 – Psalm 1",
    description: "Why do the wicked prosper? → 'Blessed is the man…' Psalm 1 sets the righteous pattern",
    category: "Rise of Kings to Poetry/Wisdom"
  },
  
  // Sets 21-30: Psalms → Prophets → The Gospel
  {
    number: 21,
    symbol: "😭",
    name: "Pleading",
    range: "Psalms 2 – 25",
    description: "Crying out for justice and deliverance; 'Why do the heathen rage?'",
    category: "Psalms to Prophets to Gospel"
  },
  {
    number: 22,
    symbol: "🎵",
    name: "Praising",
    range: "Psalms 26 – 48",
    description: "Worship, God as fortress and King",
    category: "Psalms to Prophets to Gospel"
  },
  {
    number: 23,
    symbol: "🛡",
    name: "Protecting",
    range: "Psalms 49 – 70",
    description: "God as shield/defense in real conflict",
    category: "Psalms to Prophets to Gospel"
  },
  {
    number: 24,
    symbol: "🏆",
    name: "Victory",
    range: "Psalms 71 – 93",
    description: "'The LORD reigns.' Triumph language.",
    category: "Psalms to Prophets to Gospel"
  },
  {
    number: 25,
    symbol: "✔",
    name: "Certainty",
    range: "Psalms 94 – 117",
    description: "Judgment is sure, salvation is sure, nations will praise",
    category: "Psalms to Prophets to Gospel"
  },
  {
    number: 26,
    symbol: "🧠",
    name: "Wisdom",
    range: "Psalms 118 – Proverbs 15",
    description: "Close of Psalms including Psalm 118… then launch into practical wisdom, fear of the LORD",
    category: "Psalms to Prophets to Gospel"
  },
  {
    number: 27,
    symbol: "🤦",
    name: "Foolishness Exposed",
    range: "Proverbs 16 – Ecclesiastes 8",
    description: "Warnings about pride, lust, sloth, and the 'vanity' problem",
    category: "Psalms to Prophets to Gospel"
  },
  {
    number: 28,
    symbol: "💔",
    name: "Unfaithful Bride",
    range: "Ecclesiastes 9 – Song of Solomon 8 – Isaiah 12",
    description: "End of Ecclesiastes, covenant love language in Song of Solomon, then early Isaiah: God's bride is drifting",
    category: "Psalms to Prophets to Gospel"
  },
  {
    number: 29,
    symbol: "🔨",
    name: "Judgment",
    range: "Isaiah 13 – 35",
    description: "Burden against the nations, warnings of the Day of the LORD",
    category: "Psalms to Prophets to Gospel"
  },
  {
    number: 30,
    symbol: "🩸",
    name: "The Gospel",
    range: "Isaiah 36 – 59",
    description: "Siege, deliverance, and the Suffering Servant: 'wounded for our transgressions,' substitution, atonement",
    category: "Psalms to Prophets to Gospel"
  },
  
  // Sets 31-40: Late prophets → Christ arrives
  {
    number: 31,
    symbol: "🚨",
    name: "Faltering (Part II)",
    range: "Isaiah 60 – Jeremiah 17",
    description: "Promise of glory/light + Judah still refusing. The call to trust God, not idols",
    category: "Late Prophets to Christ"
  },
  {
    number: 32,
    symbol: "📣",
    name: "God's Pleading",
    range: "Jeremiah 18 – 41",
    description: "God begging His people to repent before Babylon finishes them",
    category: "Late Prophets to Christ"
  },
  {
    number: 33,
    symbol: "☠",
    name: "Abominations",
    range: "Jeremiah 42 – Lamentations 5 – Ezekiel 8",
    description: "Refusal to repent, Jerusalem falls, lament, and God shows the corruption inside the sanctuary itself",
    category: "Late Prophets to Christ"
  },
  {
    number: 34,
    symbol: "↘",
    name: "Apostasy",
    range: "Ezekiel 9 – 32",
    description: "Glory departs, judgment falls, nations indicted",
    category: "Late Prophets to Christ"
  },
  {
    number: 35,
    symbol: "⏳",
    name: "Prophecy",
    range: "Ezekiel 33 – Daniel 8",
    description: "Watchman call, dry bones, beasts and horns, sanctuary under attack, kingdoms laid out",
    category: "Late Prophets to Christ"
  },
  {
    number: 36,
    symbol: "⛔",
    name: "Probation Closes",
    range: "Daniel 9 – Amos 3",
    description: "Timed mercy; Messiah foretold; 'Prepare to meet thy God'",
    category: "Late Prophets to Christ"
  },
  {
    number: 37,
    symbol: "❤️",
    name: "Mercy",
    range: "Amos 4 – Habakkuk 3",
    description: "Justice AND mercy; God preserves a remnant even under judgment",
    category: "Late Prophets to Christ"
  },
  {
    number: 38,
    symbol: "🌩",
    name: "Day of the Lord",
    range: "Zephaniah 1 – Malachi 4",
    description: "Final Old Testament warnings, restoration promises, forerunner of Messiah",
    category: "Late Prophets to Christ"
  },
  {
    number: 39,
    symbol: "✨",
    name: "Cross (Incarnation / Contact)",
    range: "Matthew 1 – 24",
    description: "God in flesh; authority, teaching, warnings about the end",
    category: "Late Prophets to Christ"
  },
  {
    number: 40,
    symbol: "⏰",
    name: "Cross (Accountability & Return)",
    range: "Matthew 25 – Mark 16 – Luke 1",
    description: "Parables of judgment, Great Commission trajectory, full gospel witness in Mark, announcement of Christ in Luke 1",
    category: "Late Prophets to Christ"
  },
  
  // Sets 41-50: Gospel → Church → Final War → New Earth
  {
    number: 41,
    symbol: "✝",
    name: "Cross (Life / Death / Resurrection)",
    range: "Luke 2 – Luke 24",
    description: "Birth, ministry, crucifixion, resurrection, and 'open their understanding'",
    category: "Gospel to New Earth"
  },
  {
    number: 42,
    symbol: "🔥",
    name: "Cross Transition",
    range: "John 1 – Acts 3",
    description: "'The Word was made flesh,' death, resurrection, ascension, Pentecost fire, church is born",
    category: "Gospel to New Earth"
  },
  {
    number: 43,
    symbol: "🌱",
    name: "Growth",
    range: "Acts 4 – 27",
    description: "Mission expansion under persecution; church plants everywhere",
    category: "Gospel to New Earth"
  },
  {
    number: 44,
    symbol: "☝",
    name: "Christ Only",
    range: "Acts 28 – 1 Corinthians 7",
    description: "Romans, then early Corinthians: salvation in Christ alone, body life, holiness",
    category: "Gospel to New Earth"
  },
  {
    number: 45,
    symbol: "⚡",
    name: "The Power of the Gospel",
    range: "1 Corinthians 8 – Galatians 1",
    description: "Idols, resurrection hope, and the warning against 'another gospel'",
    category: "Gospel to New Earth"
  },
  {
    number: 46,
    symbol: "🚶",
    name: "Walk Worthy",
    range: "Galatians 2 – 1 Thessalonians 5",
    description: "Life in the Spirit, unity, endurance, readiness for Christ's return",
    category: "Gospel to New Earth"
  },
  {
    number: 47,
    symbol: "🛠",
    name: "Exhortation / Endure",
    range: "2 Thessalonians 1 – Hebrews 5",
    description: "Hold the line under pressure; Christ greater than angels, Moses, priests",
    category: "Gospel to New Earth"
  },
  {
    number: 48,
    symbol: "🕯",
    name: "Hope (Sanctuary Gospel)",
    range: "Hebrews 6 – 1 John 3",
    description: "Christ our High Priest in the heavenly sanctuary; love, obedience, identity of the true church",
    category: "Gospel to New Earth"
  },
  {
    number: 49,
    symbol: "⚔",
    name: "Warfare (Final Conflict)",
    range: "1 John 4 – Revelation 19",
    description: "Test the spirits, expose antichrist, Babylon vs. the Lamb, the return of Christ as King of Kings",
    category: "Gospel to New Earth"
  },
  {
    number: 50,
    symbol: "🌅",
    name: "Heaven / Reward",
    range: "Revelation 20 – 22",
    description: "Satan destroyed, judgment executed, New Jerusalem, no more curse",
    category: "Gospel to New Earth"
  }
];
