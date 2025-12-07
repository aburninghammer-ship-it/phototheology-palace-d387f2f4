import { useState, useMemo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Eye, 
  Building2, 
  Link2, 
  Sparkles, 
  ChevronRight, 
  ChevronLeft,
  BookOpen,
  Target,
  Brain,
  RefreshCw,
  MessageSquare,
  Layers,
  Clock,
  Flame,
  Crown,
  Compass,
  Search,
  Lightbulb,
  Heart,
  Film,
  Languages,
  Gem,
  HelpCircle,
  TreePine,
  User,
  History,
  Headphones,
  Grid3X3,
  Map,
  GitCompare,
  Scale,
  Telescope,
  AlertTriangle,
  CalendarDays,
  Zap,
  Gauge,
  Infinity
} from "lucide-react";

interface PalacePrinciple {
  id: string;
  name: string;
  code: string;
  floor: number;
  icon: React.ReactNode;
  color: string;
  verse: string;
  verseText: string;
  explanation: string;
  christConnection: string;
  jeevesInsight: string;
  memoryHook: string;
}

const ALL_PRINCIPLES: PalacePrinciple[] = [
  // FLOOR 1 - FURNISHING
  {
    id: "story",
    name: "Story Room",
    code: "SR",
    floor: 1,
    icon: <BookOpen className="h-5 w-5" />,
    color: "bg-blue-500/20 text-blue-600",
    verse: "Psalm 23:1",
    verseText: "The LORD is my shepherd; I shall not want.",
    explanation: "In the Story Room, we first collect the narrative. David pictures God as a shepherd — protector, provider, guide.",
    christConnection: "Jesus declares 'I am the Good Shepherd' (John 10:11), fulfilling this imagery.",
    jeevesInsight: "Notice how David doesn't say 'The LORD is A shepherd' but 'MY shepherd.' This possessive intimacy transforms theology into testimony. The Shepherd isn't distant — He's personally yours.",
    memoryHook: "Picture a shepherd's staff glowing with divine light, leading you through a green meadow."
  },
  {
    id: "imagination",
    name: "Imagination Room",
    code: "IR",
    floor: 1,
    icon: <Eye className="h-5 w-5" />,
    color: "bg-purple-500/20 text-purple-600",
    verse: "Psalm 23:2",
    verseText: "He maketh me to lie down in green pastures: he leadeth me beside the still waters.",
    explanation: "The Imagination Room immerses you in the text. Feel the grass beneath you. Hear the quiet stream. Smell the fresh air.",
    christConnection: "Christ offers living water (John 4:14) and calls the weary to rest in Him (Matt 11:28-29).",
    jeevesInsight: "The Hebrew 'still waters' literally means 'waters of rest.' Sheep won't drink from rushing streams — they fear drowning. The Good Shepherd finds quiet pools for anxious souls.",
    memoryHook: "You're lying on soft grass beside crystal-clear water. The Shepherd sits nearby, watching over you."
  },
  {
    id: "24fps",
    name: "24FPS Room",
    code: "24",
    floor: 1,
    icon: <Film className="h-5 w-5" />,
    color: "bg-orange-500/20 text-orange-600",
    verse: "Psalm 23:1-6",
    verseText: "The LORD is my shepherd... I will dwell in the house of the LORD for ever.",
    explanation: "The 24FPS Room creates one symbolic image per chapter — turning Scripture into a mental film strip you can flip through.",
    christConnection: "Psalm 23's frame: A shepherd's crook wrapped in a crown — the Shepherd who is also King.",
    jeevesInsight: "Your mental 'frame' for Psalm 23 might be: shepherd + valley + table + house. Four images that encode the entire psalm for instant recall.",
    memoryHook: "Picture a film reel with 150 frames (one per Psalm), and Psalm 23 is a glowing shepherd scene."
  },
  {
    id: "rendered",
    name: "Bible Rendered Room",
    code: "BR",
    floor: 1,
    icon: <Grid3X3 className="h-5 w-5" />,
    color: "bg-cyan-500/20 text-cyan-600",
    verse: "Psalm 23:1-6",
    verseText: "The complete psalm rendered as one master image.",
    explanation: "The Rendered Room zooms out further — one master image per 24-chapter block. The entire Bible in 51 images.",
    christConnection: "Psalms 1-24 rendered: The righteous man (Ps 1) meets the Good Shepherd (Ps 23) — Christ is both.",
    jeevesInsight: "Psalm 23 sits in the first 'block' of Psalms. Your rendered image might combine the 'blessed man' tree of Psalm 1 with the shepherd of Psalm 23 — the fruitful life led by the Shepherd.",
    memoryHook: "A panoramic mural containing all of Psalms 1-24, with the shepherd figure prominent in the landscape."
  },
  {
    id: "translation",
    name: "Translation Room",
    code: "TR",
    floor: 1,
    icon: <Languages className="h-5 w-5" />,
    color: "bg-teal-500/20 text-teal-600",
    verse: "Psalm 23:4",
    verseText: "Yea, though I walk through the valley of the shadow of death.",
    explanation: "The Translation Room converts abstract words into concrete images — making verses visible and memorable.",
    christConnection: "Translate 'shadow of death' → a dark valley with Christ's silhouette walking ahead, absorbing the darkness.",
    jeevesInsight: "The Hebrew 'tsalmaveth' (shadow of death) appears 18 times in Scripture. Each use becomes a visual anchor: Job's despair, David's courage, Christ's victory.",
    memoryHook: "A Hebrew scroll transforming into vivid pictures — words becoming scenes you can walk through."
  },
  {
    id: "gems",
    name: "Gems Room",
    code: "GR",
    floor: 1,
    icon: <Gem className="h-5 w-5" />,
    color: "bg-pink-500/20 text-pink-600",
    verse: "Psalm 23:3a",
    verseText: "He restoreth my soul.",
    explanation: "The Gems Room stores powerful insights — striking truths that shine with clarity and transform understanding.",
    christConnection: "The Hebrew 'restoreth' (SHUB) means to turn back or return. Christ doesn't just heal — He returns us to Eden's original design.",
    jeevesInsight: "This is a gem: 'SHUB' is the same word used for repentance. When God restores your soul, He's essentially doing FOR you what repentance asks you to do — turning you back to Him.",
    memoryHook: "Picture a gemstone emerging from rough rock — the hidden treasure of soul restoration."
  },

  // FLOOR 2 - INVESTIGATION
  {
    id: "observation",
    name: "Observation Room",
    code: "OR",
    floor: 2,
    icon: <Search className="h-5 w-5" />,
    color: "bg-amber-500/20 text-amber-600",
    verse: "Psalm 23:1-6",
    verseText: "The LORD is my shepherd... I will dwell in the house of the LORD for ever.",
    explanation: "The Observation Room logs details like a detective — names, numbers, actions, sequence — before interpretation.",
    christConnection: "Observe: The psalm moves from pasture (v.1-3) to valley (v.4) to banquet (v.5) to temple (v.6) — a journey from earth to heaven.",
    jeevesInsight: "Count the 'He' statements (what God does) vs 'I' statements (David's response). The psalm is 80% about God's action, 20% human response. Biblical faith is primarily receptive.",
    memoryHook: "Put on detective glasses and examine each verse for clues — who, what, where, when, why."
  },
  {
    id: "defcom",
    name: "Def-Com Room",
    code: "DC",
    floor: 2,
    icon: <BookOpen className="h-5 w-5" />,
    color: "bg-indigo-500/20 text-indigo-600",
    verse: "Psalm 23:5",
    verseText: "Thou anointest my head with oil; my cup runneth over.",
    explanation: "The Def-Com Room is the forensic lab — testing words through Greek/Hebrew definitions and historical/cultural commentary.",
    christConnection: "Anointing (mashach) is the root of 'Messiah.' David receives what Christ IS — the Anointed One.",
    jeevesInsight: "In Hebrew, 'anoint' here is 'dishanta' — literally to make fat, to enrich. God doesn't just touch your head; He saturates you with abundance.",
    memoryHook: "A forensic lab with ancient scrolls under magnifying glasses, revealing hidden word meanings."
  },
  {
    id: "symbols",
    name: "Symbols/Types Room",
    code: "@T",
    floor: 2,
    icon: <Sparkles className="h-5 w-5" />,
    color: "bg-violet-500/20 text-violet-600",
    verse: "Psalm 23:5b",
    verseText: "My cup runneth over.",
    explanation: "The Symbols Room identifies God's recurring imagery — cup, oil, table — as prophetic pictures.",
    christConnection: "The overflowing cup anticipates the cup of the New Covenant — Christ's blood poured out for many.",
    jeevesInsight: "In the ancient world, a host filled your cup to show honor. An OVERFLOWING cup means God cannot contain His generosity toward you — blessing exceeds the vessel.",
    memoryHook: "Picture a golden cup being filled, then spilling over the edges as the Host keeps pouring."
  },
  {
    id: "questions",
    name: "Questions Room",
    code: "QR",
    floor: 2,
    icon: <HelpCircle className="h-5 w-5" />,
    color: "bg-rose-500/20 text-rose-600",
    verse: "Psalm 23:4",
    verseText: "I will fear no evil.",
    explanation: "The Questions Room interrogates the text — asking 75 questions at text, chapter, and theological levels.",
    christConnection: "Why 'fear NO evil' rather than 'face no evil'? Because evil still exists — but fear is conquered by presence.",
    jeevesInsight: "Key question: Does David say evil won't exist in the valley, or that he won't FEAR it? The text admits evil is real but strips its power through relationship with the Shepherd.",
    memoryHook: "A room full of question marks floating in the air — each one unlocking deeper understanding."
  },
  {
    id: "qa",
    name: "Q&A Room",
    code: "QA",
    floor: 2,
    icon: <MessageSquare className="h-5 w-5" />,
    color: "bg-emerald-500/20 text-emerald-600",
    verse: "Psalm 23:1",
    verseText: "The LORD is my shepherd.",
    explanation: "The Q&A Room cross-references Scripture — letting verses answer verses like witnesses corroborating testimony.",
    christConnection: "Q: Who is the Shepherd? A: John 10:11 — 'I am the good shepherd.' Q: What does He do? A: John 10:11 — 'The good shepherd giveth his life for the sheep.'",
    jeevesInsight: "Psalm 23:1 asks 'Who is my shepherd?' The entire Gospel of John chapter 10 is the answer. Scripture interprets Scripture — the Q&A Room makes this systematic.",
    memoryHook: "A courtroom where Bible verses take the witness stand to answer questions about each other."
  },

  // FLOOR 3 - FREESTYLE
  {
    id: "nature",
    name: "Nature Freestyle Room",
    code: "NF",
    floor: 3,
    icon: <TreePine className="h-5 w-5" />,
    color: "bg-green-500/20 text-green-600",
    verse: "Psalm 23:2",
    verseText: "He maketh me to lie down in green pastures.",
    explanation: "The Nature Freestyle Room connects Scripture to creation — every element of nature becomes a sermon illustration.",
    christConnection: "Real sheep in real pastures → Real Shepherd caring for real souls. Nature testifies to the Creator's care.",
    jeevesInsight: "Next time you see a meadow or a stream, let it preach Psalm 23. Nature is God's second book — Romans 1:20 says creation reveals His invisible attributes.",
    memoryHook: "Walk outside and let every tree, stream, and field remind you of the Shepherd's provision."
  },
  {
    id: "personal",
    name: "Personal Freestyle Room",
    code: "PF",
    floor: 3,
    icon: <User className="h-5 w-5" />,
    color: "bg-blue-400/20 text-blue-500",
    verse: "Psalm 23:4",
    verseText: "Yea, though I walk through the valley of the shadow of death.",
    explanation: "The Personal Freestyle Room uses your own life experiences as object lessons — joys, mistakes, and delays become teaching material.",
    christConnection: "Your valleys — grief, failure, fear — become classrooms where Christ's presence is proven real.",
    jeevesInsight: "What valley are you walking through right now? That's where Psalm 23 becomes personal. David didn't write theory — he wrote testimony from actual valleys.",
    memoryHook: "Your life story overlaid with Psalm 23 — each chapter of your journey matching a verse."
  },
  {
    id: "biblefreestyle",
    name: "Bible Freestyle Room",
    code: "BF",
    floor: 3,
    icon: <Compass className="h-5 w-5" />,
    color: "bg-purple-400/20 text-purple-500",
    verse: "Psalm 23:1",
    verseText: "The LORD is my shepherd.",
    explanation: "The Bible Freestyle Room traces verse genetics — connecting this text to every shepherd passage in Scripture.",
    christConnection: "Genesis 49:24 → Psalm 80:1 → Isaiah 40:11 → Ezekiel 34 → John 10 → Hebrews 13:20 → 1 Peter 5:4 → Revelation 7:17.",
    jeevesInsight: "Psalm 23 sits at the center of Scripture's shepherd theme. Behind it: patriarchal promises. Ahead of it: Messianic fulfillment. Every shepherd verse is a cousin to this one.",
    memoryHook: "Picture a genealogy tree with Psalm 23 at the center, branches connecting to every shepherd passage."
  },
  {
    id: "history",
    name: "History/Social Freestyle Room",
    code: "HF",
    floor: 3,
    icon: <History className="h-5 w-5" />,
    color: "bg-amber-400/20 text-amber-500",
    verse: "Psalm 23:5",
    verseText: "Thou preparest a table before me in the presence of mine enemies.",
    explanation: "The History Freestyle Room finds lessons in culture, politics, and society — letting the Bible interpret the world.",
    christConnection: "Throughout history, God's people have feasted while enemies watched — from Esther's banquet to the persecuted church's communion.",
    jeevesInsight: "Think of historical moments when the righteous dined while enemies watched: Daniel in Babylon, the early church in Rome. Psalm 23:5 is a pattern repeated through history.",
    memoryHook: "A timeline of history with banquet tables appearing at key moments of divine vindication."
  },
  {
    id: "listening",
    name: "Listening Room",
    code: "LR",
    floor: 3,
    icon: <Headphones className="h-5 w-5" />,
    color: "bg-cyan-400/20 text-cyan-500",
    verse: "Psalm 23:1-6",
    verseText: "The LORD is my shepherd...",
    explanation: "The Listening Room trains you to hear Scripture in sermons, testimonies, and conversations — turning them into connections.",
    christConnection: "Every testimony of God's provision echoes Psalm 23. Every story of comfort in grief proves 'Thou art with me.'",
    jeevesInsight: "When someone shares how God provided, protected, or comforted them — you're hearing Psalm 23 lived out. The Listening Room connects their story to David's song.",
    memoryHook: "Ears tuned to hear Psalm 23 echoes in every conversation about God's faithfulness."
  },

  // FLOOR 4 - NEXT LEVEL
  {
    id: "concentration",
    name: "Concentration Room",
    code: "CR",
    floor: 4,
    icon: <Target className="h-5 w-5" />,
    color: "bg-red-500/20 text-red-600",
    verse: "Psalm 23:4",
    verseText: "Yea, though I walk through the valley of the shadow of death, I will fear no evil: for thou art with me.",
    explanation: "The Concentration Room insists: every text must reveal Christ. The 'shadow of death' points to Calvary.",
    christConnection: "Christ's presence in our darkest valleys is the fulfillment of 'Thou art with me.'",
    jeevesInsight: "Notice: it's the SHADOW of death, not death itself. Shadows cannot harm — they only frighten. Christ absorbed death's reality so we only pass through its shadow.",
    memoryHook: "A valley shrouded in shadow, but a bright figure walks ahead — the Shepherd leading through death to life."
  },
  {
    id: "dimensions",
    name: "Dimensions Room",
    code: "DR",
    floor: 4,
    icon: <Layers className="h-5 w-5" />,
    color: "bg-orange-400/20 text-orange-500",
    verse: "Psalm 23:3",
    verseText: "He restoreth my soul: he leadeth me in the paths of righteousness for his name's sake.",
    explanation: "The Dimensions Room stretches the text across 5 levels: Literal, Christ, Me, Church, Heaven.",
    christConnection: "1D-Literal: David's restoration. 2D-Christ: Jesus restores all. 3D-Me: Personal renewal. 4D-Church: Corporate revival. 5D-Heaven: Ultimate restoration.",
    jeevesInsight: "'For HIS name's sake' — not for my worthiness. God leads us rightly to protect His reputation, not reward our merit. This removes performance anxiety from the spiritual life.",
    memoryHook: "Five transparent layers stacked like glass, each revealing a deeper dimension of the same truth."
  },
  {
    id: "connect6",
    name: "Connect 6 Room",
    code: "C6",
    floor: 4,
    icon: <Grid3X3 className="h-5 w-5" />,
    color: "bg-indigo-400/20 text-indigo-500",
    verse: "Psalm 23:1-6",
    verseText: "The LORD is my shepherd...",
    explanation: "The Connect 6 Room classifies texts by genre — Poetry here uses metaphor, rhythm, and parallelism.",
    christConnection: "Psalm 23 is poetry, not history — but it points to the historical Christ who is the Good Shepherd.",
    jeevesInsight: "Recognizing Psalm 23 as poetry means we embrace its metaphors. David was literally a shepherd; God is metaphorically one. The poetry bridges human and divine shepherding.",
    memoryHook: "Six genre doors — Prophecy, Poetry, History, Gospels, Epistles, Parables — each with different reading rules."
  },
  {
    id: "theme",
    name: "Theme Room",
    code: "TRm",
    floor: 4,
    icon: <Map className="h-5 w-5" />,
    color: "bg-teal-400/20 text-teal-500",
    verse: "Psalm 23:5-6",
    verseText: "Thou preparest a table... I will dwell in the house of the LORD.",
    explanation: "The Theme Room organizes texts along the great walls: Sanctuary, Life of Christ, Great Controversy, Time Prophecy.",
    christConnection: "Psalm 23 touches the Sanctuary Wall (table, house of LORD) and Life of Christ Wall (Shepherd imagery).",
    jeevesInsight: "The 'table' and 'house of the LORD' connect to sanctuary themes. The 'enemies' connect to Great Controversy. One psalm spans multiple theological walls.",
    memoryHook: "A palace with thematic walls — each verse of Psalm 23 finds its place on one or more walls."
  },
  {
    id: "timezones",
    name: "Time Zone Room",
    code: "TZ",
    floor: 4,
    icon: <Clock className="h-5 w-5" />,
    color: "bg-sky-500/20 text-sky-600",
    verse: "Psalm 23:6",
    verseText: "Surely goodness and mercy shall follow me all the days of my life.",
    explanation: "The Time Zone Room places texts across past, present, and future — both on earth and in heaven.",
    christConnection: "Past: God's faithfulness to David. Present: Christ's ongoing mercy. Future: Eternal dwelling with God.",
    jeevesInsight: "The Hebrew for 'follow' is RADAPH — to pursue, chase, hunt. God's goodness isn't passive; it actively hunts you down like a shepherd chasing a wandering sheep.",
    memoryHook: "A timeline stretching from Eden to New Jerusalem, with goodness and mercy running alongside every moment."
  },
  {
    id: "patterns",
    name: "Patterns Room",
    code: "PRm",
    floor: 4,
    icon: <Link2 className="h-5 w-5" />,
    color: "bg-green-500/20 text-green-600",
    verse: "Psalm 23:5",
    verseText: "Thou preparest a table before me in the presence of mine enemies.",
    explanation: "The Patterns Room traces recurring motifs — Table, Anointing, Enemies watching, Divine vindication.",
    christConnection: "The table points to the Last Supper; the anointing foreshadows Christ as Prophet, Priest, and King.",
    jeevesInsight: "The enemies aren't destroyed — they're forced to WATCH. This is the ultimate vindication: dining with God while those who opposed you observe His favor upon you.",
    memoryHook: "A banquet table in the sanctuary, enemies watching from outside, the King serving you bread and wine."
  },
  {
    id: "parallels",
    name: "Parallels Room",
    code: "P‖",
    floor: 4,
    icon: <GitCompare className="h-5 w-5" />,
    color: "bg-violet-400/20 text-violet-500",
    verse: "Psalm 23:1",
    verseText: "The LORD is my shepherd.",
    explanation: "The Parallels Room shows mirrored actions across time — not objects/types, but events reflecting each other.",
    christConnection: "David shepherds Israel → Christ shepherds the Church. David defeats Goliath → Christ defeats Satan. Parallel actions, greater fulfillment.",
    jeevesInsight: "David's shepherding of literal sheep parallels his shepherding of Israel, which parallels Christ's shepherding of the Church. Actions echo across time.",
    memoryHook: "Two mirrors facing each other — reflections multiplying as shepherd actions repeat through history."
  },
  {
    id: "fruit",
    name: "Fruit Room",
    code: "FRt",
    floor: 4,
    icon: <Heart className="h-5 w-5" />,
    color: "bg-rose-400/20 text-rose-500",
    verse: "Psalm 23:1-6",
    verseText: "The LORD is my shepherd... surely goodness and mercy shall follow me.",
    explanation: "The Fruit Room tests every interpretation: Does it produce love, joy, peace, patience, kindness, goodness, faith, meekness, temperance?",
    christConnection: "Psalm 23 produces trust (not fear), rest (not anxiety), confidence (not despair) — the fruits of walking with Christ.",
    jeevesInsight: "Any reading of Psalm 23 that produces fear, striving, or performance anxiety has missed the point. The fruit test: Does your interpretation produce rest in the Shepherd's care?",
    memoryHook: "A tree bearing nine fruits of the Spirit — each one growing from a branch rooted in Psalm 23."
  },
  {
    id: "cec",
    name: "Christ in Every Chapter",
    code: "CEC",
    floor: 4,
    icon: <Crown className="h-5 w-5" />,
    color: "bg-yellow-500/20 text-yellow-600",
    verse: "Psalm 23:1-6",
    verseText: "The LORD is my shepherd...",
    explanation: "Every chapter must name and trace the line to Christ. No moving on until the Christ-thread is explicit and anchored.",
    christConnection: "Psalm 23's Christ-line: Shepherd (v.1) = John 10. Valley companion (v.4) = Emmanuel. Table host (v.5) = Lord's Supper. Eternal dwelling (v.6) = John 14:2-3.",
    jeevesInsight: "Can you name Christ in every verse? V.1: Good Shepherd. V.2-3: Rest-giver. V.4: Death-conqueror. V.5: Anointed Host. V.6: Eternal Home-preparer. The CEC room demands specificity.",
    memoryHook: "A chapter with Christ's name written beside every verse — no text left without its Christological anchor."
  },
  {
    id: "room66",
    name: "Room 66",
    code: "R66",
    floor: 4,
    icon: <BookOpen className="h-5 w-5" />,
    color: "bg-amber-500/20 text-amber-600",
    verse: "Psalm 23:1",
    verseText: "The LORD is my shepherd.",
    explanation: "Room 66 traces one theme through all 66 books with a crisp claim per book — theological integrity at scale.",
    christConnection: "The Shepherd theme: Genesis (Jacob's blessing) → Exodus (Moses) → Psalms (David) → Prophets (Ezekiel 34) → Gospels (John 10) → Revelation (7:17).",
    jeevesInsight: "Can you trace 'shepherd' through all 66 books? That's Room 66. The theme that can't walk Genesis to Revelation in clear steps isn't ready for the pulpit.",
    memoryHook: "A library of 66 books, each with the shepherd theme bookmarked and connected by a golden thread."
  },

  // FLOOR 5 - VISION
  {
    id: "blue",
    name: "Blue Room (Sanctuary)",
    code: "BL",
    floor: 5,
    icon: <Building2 className="h-5 w-5" />,
    color: "bg-blue-600/20 text-blue-700",
    verse: "Psalm 23:6b",
    verseText: "And I will dwell in the house of the LORD for ever.",
    explanation: "The Blue Room maps texts to sanctuary furniture and services — seeing heaven's pattern in earthly worship.",
    christConnection: "The 'house of the LORD' points to the Temple, Christ's body, and ultimately the New Jerusalem.",
    jeevesInsight: "'Forever' in Hebrew is 'length of days' — but David extends it beyond life. He glimpses eternity, anticipating what the New Testament reveals fully.",
    memoryHook: "Stand in the sanctuary's Holy Place, then watch it transform into the eternal temple of Revelation 21."
  },
  {
    id: "prophecy",
    name: "Prophecy Room",
    code: "PR",
    floor: 5,
    icon: <Telescope className="h-5 w-5" />,
    color: "bg-purple-600/20 text-purple-700",
    verse: "Psalm 23:5",
    verseText: "Thou preparest a table before me in the presence of mine enemies.",
    explanation: "The Prophecy Room aligns prophetic timelines — seeing how texts fit into Daniel, Revelation, and end-time events.",
    christConnection: "The ultimate 'table in the presence of enemies' is the Marriage Supper of the Lamb while Babylon watches.",
    jeevesInsight: "Revelation 19's marriage supper fulfills Psalm 23:5 on a cosmic scale. The enemies? Revelation 19:17-21. They watch the feast they cannot attend.",
    memoryHook: "A prophetic telescope showing Psalm 23's table stretching into Revelation's eternal banquet."
  },
  {
    id: "threeangels",
    name: "Three Angels' Room",
    code: "3A",
    floor: 5,
    icon: <AlertTriangle className="h-5 w-5" />,
    color: "bg-red-600/20 text-red-700",
    verse: "Psalm 23:1",
    verseText: "The LORD is my shepherd.",
    explanation: "The Three Angels' Messages (Rev 14:6-12) are the final gospel syllabus — all doctrine converges here.",
    christConnection: "First Angel: Fear God (Ps 23 — no fear because of the Shepherd). Second Angel: Babylon fallen (enemies at the table). Third Angel: Endurance of saints (dwelling forever).",
    jeevesInsight: "Psalm 23 anticipates the Three Angels: worship the Creator-Shepherd (1st), reject false shepherds/Babylon (2nd), endure to dwell with God forever (3rd).",
    memoryHook: "Three angels flying over David's psalm, each one highlighting a different verse's end-time application."
  },
  {
    id: "feasts",
    name: "Feasts Room",
    code: "FR",
    floor: 5,
    icon: <CalendarDays className="h-5 w-5" />,
    color: "bg-orange-600/20 text-orange-700",
    verse: "Psalm 23:5",
    verseText: "Thou preparest a table before me.",
    explanation: "The Feasts Room connects texts to Israel's festivals — Passover, Pentecost, Tabernacles, etc.",
    christConnection: "Psalm 23's table → Passover meal. Anointing → Day of Atonement. Dwelling in God's house → Feast of Tabernacles.",
    jeevesInsight: "The feasts map Psalm 23: Passover lamb (Shepherd gives life), Tabernacles (dwelling in God's presence). The psalm is a feast calendar in miniature.",
    memoryHook: "A Jewish calendar with Psalm 23 verses placed on their corresponding feast days."
  },

  // FLOOR 6 - THREE HEAVENS
  {
    id: "cycles",
    name: "Cycles (@CyC)",
    code: "@CyC",
    floor: 6,
    icon: <RefreshCw className="h-5 w-5" />,
    color: "bg-yellow-500/20 text-yellow-600",
    verse: "Psalm 23:1",
    verseText: "The LORD is my shepherd.",
    explanation: "The Cycles place texts within the eight great epochs — @Ad, @No, @Ab, @Mo, @Cy, @CyC, @Sp, @Re.",
    christConnection: "David in @Mo (Mosaic cycle) points to Christ in @CyC (Cyrus-Christ cycle) — the true Shepherd-King.",
    jeevesInsight: "David was a shepherd who became king. Jesus is the King who became a shepherd. The cycle inverts — God's pattern of exaltation through humiliation.",
    memoryHook: "A wheel with eight spokes, each representing a cycle, with Christ at the center where all spokes meet."
  },
  {
    id: "threeheavens",
    name: "Three Heavens",
    code: "1H/2H/3H",
    floor: 6,
    icon: <Layers className="h-5 w-5" />,
    color: "bg-sky-600/20 text-sky-700",
    verse: "Psalm 23:6",
    verseText: "I will dwell in the house of the LORD for ever.",
    explanation: "The Three Heavens are three Day-of-the-LORD cycles: 1H (Babylon/Restoration), 2H (70 AD/New Covenant), 3H (Final/New Creation).",
    christConnection: "Psalm 23's 'forever dwelling' finds partial fulfillment in 2H (church as temple) and ultimate fulfillment in 3H (New Jerusalem).",
    jeevesInsight: "David wrote in 1H context but prophesied 3H reality. 'Dwell forever' transcends the earthly temple — it requires the eternal one.",
    memoryHook: "Three ascending platforms — each 'heaven' representing a different stage of God's dwelling with humanity."
  },
  {
    id: "juice",
    name: "Juice Room",
    code: "JR",
    floor: 6,
    icon: <Zap className="h-5 w-5" />,
    color: "bg-lime-500/20 text-lime-600",
    verse: "Psalm 23:1-6",
    verseText: "The complete psalm squeezed through all principles.",
    explanation: "The Juice Room squeezes one book with ALL Phototheology principles — extracting every drop of meaning.",
    christConnection: "Run Psalm 23 through Story, Observation, Translation, Freestyle, Concentration, Prophecy, Cycles, Heavens — squeeze it completely.",
    jeevesInsight: "The Juice Room prevents shallow study. You don't just read Psalm 23 — you press it through every room until nothing is left unexamined.",
    memoryHook: "An orange being squeezed — each drop representing a different insight from a different Palace room."
  },

  // FLOOR 7 - SPIRITUAL/EMOTIONAL
  {
    id: "fire",
    name: "Fire Room",
    code: "FRm",
    floor: 7,
    icon: <Flame className="h-5 w-5" />,
    color: "bg-orange-600/20 text-orange-700",
    verse: "Psalm 23:4b",
    verseText: "Thy rod and thy staff they comfort me.",
    explanation: "The Fire Room engages emotions — conviction, awe, comfort, courage. Feel the weight of truth.",
    christConnection: "The rod protects; the staff rescues. Christ both defends us from wolves and pulls us from pits.",
    jeevesInsight: "The rod was for fighting wolves; the staff had a crook for rescuing stuck sheep. Comfort comes not from absence of danger but from presence of the equipped Protector.",
    memoryHook: "Feel the warmth of being defended — the rod raised against enemies, the staff's crook around your waist."
  },
  {
    id: "meditation",
    name: "Meditation Room",
    code: "MR",
    floor: 7,
    icon: <Lightbulb className="h-5 w-5" />,
    color: "bg-amber-600/20 text-amber-700",
    verse: "Psalm 23:2b",
    verseText: "He leadeth me beside the still waters.",
    explanation: "The Meditation Room slows down — marinating in truth until it saturates the soul.",
    christConnection: "Meditation isn't Eastern emptying but biblical filling — letting Christ's words dwell richly within.",
    jeevesInsight: "The 'still waters' are the perfect meditation image. Not rushing to the next verse. Not analyzing. Just resting beside quiet truth until it seeps into your being.",
    memoryHook: "Sit beside still water, letting each word ripple outward slowly, watching the reflections deepen."
  },
  {
    id: "speed",
    name: "Speed Room",
    code: "SRm",
    floor: 7,
    icon: <Gauge className="h-5 w-5" />,
    color: "bg-red-400/20 text-red-500",
    verse: "Psalm 23:1-6",
    verseText: "The LORD is my shepherd... for ever.",
    explanation: "The Speed Room trains rapid application — flipping through chapters, making connections quickly.",
    christConnection: "In seconds: Psalm 23 → John 10 → Hebrews 13:20 → 1 Peter 5:4 → Revelation 7:17. Shepherd theme, speed run.",
    jeevesInsight: "Can you connect Psalm 23 to five other passages in 30 seconds? The Speed Room builds reflexes for ministry moments when you need answers fast.",
    memoryHook: "A stopwatch running as you race through shepherd passages — building theological reflexes."
  },

  // FLOOR 8 - MASTER
  {
    id: "master",
    name: "Reflexive Mastery",
    code: "∞",
    floor: 8,
    icon: <Infinity className="h-5 w-5" />,
    color: "bg-gradient-to-r from-primary/20 to-accent/20 text-primary",
    verse: "Psalm 23:1-6",
    verseText: "The LORD is my shepherd; I shall not want...",
    explanation: "The 8th Floor has no rooms — you've internalized the Palace. Phototheology is now reflexive thought, not method.",
    christConnection: "You no longer 'use' the Palace — you think in it. Christ appears instantly in every text without consciously applying rooms.",
    jeevesInsight: "When you read Psalm 23 and automatically see Christ, trace cycles, feel the fire, and connect to Revelation — without thinking about room names — you've reached Floor 8.",
    memoryHook: "The Palace dissolves into you — rooms become instincts, codes become reflexes, method becomes nature."
  }
];

// Shuffle and pick 7 random principles
const shuffleAndPick = (array: PalacePrinciple[], count: number): PalacePrinciple[] => {
  const shuffled = [...array].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
};

export const InteractiveWalkthrough = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [refreshKey, setRefreshKey] = useState(0);
  
  const selectedPrinciples = useMemo(() => {
    return shuffleAndPick(ALL_PRINCIPLES, 7);
  }, [refreshKey]);

  const step = selectedPrinciples[currentStep];

  const nextStep = () => {
    if (currentStep < selectedPrinciples.length - 1) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleRefresh = () => {
    setRefreshKey(prev => prev + 1);
    setCurrentStep(0);
  };

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-primary/5 via-background to-accent/5">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-10">
          <Badge className="mb-4 bg-accent/20 text-accent border-accent/30">
            <Sparkles className="h-3 w-3 mr-1" />
            Interactive Demo — {ALL_PRINCIPLES.length} Palace Principles
          </Badge>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            See How the Palace Method Works
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-4">
            Walk through Psalm 23 as Jeeves applies 7 random Palace principles — revealing Christ-centered depths in familiar verses.
          </p>
          
          {/* Refresh Button */}
          <Button 
            variant="outline" 
            onClick={handleRefresh}
            className="gap-2"
          >
            <RefreshCw className="h-4 w-4" />
            Apply 7 New Principles
          </Button>
        </div>

        {/* Progress indicators */}
        <div className="flex justify-center gap-2 mb-8 flex-wrap">
          {selectedPrinciples.map((p, idx) => (
            <button
              key={`${p.id}-${refreshKey}`}
              onClick={() => setCurrentStep(idx)}
              className={`h-2 rounded-full transition-all duration-300 ${
                idx === currentStep 
                  ? "w-8 bg-primary" 
                  : idx < currentStep 
                    ? "w-2 bg-primary/50" 
                    : "w-2 bg-muted-foreground/30"
              }`}
            />
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={`${currentStep}-${refreshKey}`}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="border-2 border-primary/20 overflow-hidden">
              {/* Header */}
              <div className="bg-gradient-to-r from-primary/10 to-accent/10 p-4 sm:p-6 border-b border-border/50">
                <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-2">
                  <div className={`p-2 rounded-lg ${step.color} w-fit`}>
                    {step.icon}
                  </div>
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <h3 className="font-bold text-lg">{step.name}</h3>
                      <Badge variant="outline" className="text-xs">
                        {step.code} • Floor {step.floor}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">Principle {currentStep + 1} of 7</p>
                  </div>
                </div>
              </div>

              <CardContent className="p-4 sm:p-6 space-y-6">
                {/* Scripture */}
                <div className="bg-muted/50 rounded-lg p-4 border-l-4 border-primary">
                  <p className="text-sm font-medium text-primary mb-1">{step.verse}</p>
                  <p className="text-base sm:text-lg italic">"{step.verseText}"</p>
                </div>

                {/* Explanation */}
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="p-1.5 rounded bg-primary/10 text-primary mt-0.5 flex-shrink-0">
                      <Brain className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="font-medium text-sm text-primary mb-1">Palace Method</p>
                      <p className="text-muted-foreground text-sm sm:text-base">{step.explanation}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="p-1.5 rounded bg-accent/10 text-accent mt-0.5 flex-shrink-0">
                      <Target className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="font-medium text-sm text-accent mb-1">Christ Connection</p>
                      <p className="text-muted-foreground text-sm sm:text-base">{step.christConnection}</p>
                    </div>
                  </div>

                  {/* Jeeves Insight */}
                  <div className="bg-gradient-to-r from-primary/5 to-accent/5 rounded-lg p-4 border border-primary/20">
                    <div className="flex items-start gap-3">
                      <div className="p-1.5 rounded bg-primary/20 text-primary mt-0.5 flex-shrink-0">
                        <MessageSquare className="h-4 w-4" />
                      </div>
                      <div>
                        <p className="font-medium text-sm text-primary mb-1">🎩 Jeeves Says...</p>
                        <p className="text-foreground text-sm sm:text-base italic">{step.jeevesInsight}</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="p-1.5 rounded bg-primary/10 text-primary mt-0.5 flex-shrink-0">
                      <Eye className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="font-medium text-sm text-primary mb-1">Memory Hook</p>
                      <p className="text-muted-foreground italic text-sm sm:text-base">{step.memoryHook}</p>
                    </div>
                  </div>
                </div>

                {/* Navigation */}
                <div className="flex items-center justify-between pt-4 border-t border-border/50">
                  <Button
                    variant="outline"
                    onClick={prevStep}
                    disabled={currentStep === 0}
                    className="gap-1 sm:gap-2 text-sm"
                    size="sm"
                  >
                    <ChevronLeft className="h-4 w-4" />
                    <span className="hidden sm:inline">Previous</span>
                  </Button>

                  <span className="text-sm text-muted-foreground">
                    {currentStep + 1} / {selectedPrinciples.length}
                  </span>

                  <Button
                    onClick={nextStep}
                    disabled={currentStep === selectedPrinciples.length - 1}
                    className="gap-1 sm:gap-2 text-sm"
                    size="sm"
                  >
                    <span className="hidden sm:inline">Next</span>
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </AnimatePresence>

        {/* Final CTA if on last step */}
        {currentStep === selectedPrinciples.length - 1 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mt-8 space-y-4"
          >
            <p className="text-lg font-medium">
              Ready to build your own palace with every book of the Bible?
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button onClick={handleRefresh} variant="outline" className="gap-2">
                <RefreshCw className="h-4 w-4" />
                Try 7 More Principles
              </Button>
              <Button size="lg" className="gradient-palace">
                Start Your Free Trial
                <ChevronRight className="ml-2 h-5 w-5" />
              </Button>
            </div>
          </motion.div>
        )}
      </div>
    </section>
  );
};
