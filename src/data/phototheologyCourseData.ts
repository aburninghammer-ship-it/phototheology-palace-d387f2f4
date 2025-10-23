export interface CourseDay {
  day: number;
  week: number;
  title: string;
  floor: string;
  focus: string;
  scripture: string;
  scriptureText: string;
  activity: string;
  reflection: string;
  prayer: string;
  room?: string;
}

export interface KidsCourseDay extends CourseDay {
  ageGroup: 'ages-5-8' | 'ages-9-12' | 'ages-13-16';
  simplifiedActivity: string;
  funElement: string;
}

export const phototheologyCourse: CourseDay[] = [
  // Week 1: Foundations (Days 1-7) – Floor 1: Furnishing Your Palace
  {
    day: 1,
    week: 1,
    title: "The Vision of Phototheology",
    floor: "Floor 1: Furnishing Your Palace",
    focus: "Phototheology as visual, Christ-centered study",
    scripture: "Luke 24:27",
    scriptureText: "And beginning at Moses and all the prophets, he expounded unto them in all the scriptures the things concerning himself.",
    activity: "Read Genesis 1-3. Visualize Eden as your palace entrance: Adam (covenant), Eve (relationship), serpent (conflict). Sketch a simple palace outline (8 floors).",
    reflection: "Where do you see Jesus in creation's fall and promise?",
    prayer: "Lord, open my eyes to Your image in every story."
  },
  {
    day: 2,
    week: 1,
    title: "Story Room (ST)",
    floor: "Floor 1: Furnishing Your Palace",
    room: "Story Room",
    focus: "Narrative as God's visual teaching",
    scripture: "Genesis 3:21",
    scriptureText: "Unto Adam also and to his wife did the LORD God make coats of skins, and clothed them.",
    activity: "Retell Genesis 3 as a movie scene. Assign images: Tree (knowledge), Blood (first sacrifice). Memorize 3 key stories from Genesis 1-11.",
    reflection: "How does clothing symbolize Christ's covering?",
    prayer: "Clothe me in Your righteousness, Jesus."
  },
  {
    day: 3,
    week: 1,
    title: "Imagination Room (IR)",
    floor: "Floor 1: Furnishing Your Palace",
    room: "Imagination Room",
    focus: "Mental images for retention",
    scripture: "Hebrews 11:1",
    scriptureText: "Now faith is the substance of things hoped for, the evidence of things not seen.",
    activity: "Imagine Noah's ark as a floating palace room. Place animals as symbols (dove=Holy Spirit). Visualize 5 flood details.",
    reflection: "What unseen truths does imagination reveal about faith?",
    prayer: "Ignite my imagination to see Your faithfulness."
  },
  {
    day: 4,
    week: 1,
    title: "24FPS Room (F24)",
    floor: "Floor 1: Furnishing Your Palace",
    room: "24FPS Room",
    focus: "Frame-by-frame narrative (like a film at 24 frames per second)",
    scripture: "Exodus 14:21-22",
    scriptureText: "And Moses stretched out his hand over the sea... and the waters were divided.",
    activity: "Break Exodus 14 into 24 'frames': Wave rises (F1), Israel crosses (F12), Egyptians drown (F24). Narrate aloud.",
    reflection: "How does slowing the story reveal God's timing?",
    prayer: "Help me see Your deliverance frame by frame."
  },
  {
    day: 5,
    week: 1,
    title: "Bible Rendered Room (BR)",
    floor: "Floor 1: Furnishing Your Palace",
    room: "Bible Rendered Room",
    focus: "Rendering text as vivid scenes",
    scripture: "Psalm 23:1-6",
    scriptureText: "The LORD is my shepherd; I shall not want...",
    activity: "'Render' Psalm 23: Green pastures (Floor 1 garden), Valley shadow (deeper floor). Draw or describe one scene.",
    reflection: "Where is Jesus the Shepherd in your life?",
    prayer: "Lead me beside still waters, Good Shepherd."
  },
  {
    day: 6,
    week: 1,
    title: "Gems Room (GEM)",
    floor: "Floor 1: Furnishing Your Palace",
    room: "Gems Room",
    focus: "Concise, sparkling insights linking verses",
    scripture: "Proverbs 2:4",
    scriptureText: "If thou seekest her as silver, and searchest for her as for hid treasures.",
    activity: "Mine a gem: Link Malachi 4:2 (Sun of Righteousness) to John 8:12 (Light of the World). Write a 3-sentence linkage.",
    reflection: "What hidden treasure did you uncover?",
    prayer: "Reveal Your gems, Lord."
  },
  {
    day: 7,
    week: 1,
    title: "Week Review – Palace Ground Floor",
    floor: "Floor 1: Furnishing Your Palace",
    focus: "Integrate Week 1",
    scripture: "Nehemiah 8:8",
    scriptureText: "So they read in the book in the law of God distinctly, and gave the sense, and caused them to understand the reading.",
    activity: "Walk your palace mentally: Enter via Story Room, furnish with images from Days 1-6. Quiz: Recall 3 stories visually.",
    reflection: "How has visualization deepened your retention?",
    prayer: "Build my palace on Your Word."
  },

  // Week 2: Investigation (Days 8-14) – Floor 2: Detective Skills
  {
    day: 8,
    week: 2,
    title: "Observation Room (OBS)",
    floor: "Floor 2: Detective Skills",
    room: "Observation Room",
    focus: "Plain facts before interpretation",
    scripture: "Luke 1:1-4",
    scriptureText: "Forasmuch as many have taken in hand to set forth in order a declaration...",
    activity: "Observe John 1:1-5: List 10 facts (who, what, where). No opinions.",
    reflection: "What details did you miss at first glance?",
    prayer: "Open my eyes to Your facts, Father."
  },
  {
    day: 9,
    week: 2,
    title: "Def-Com Room (DC)",
    floor: "Floor 2: Detective Skills",
    room: "Def-Com Room",
    focus: "Definitions and comparisons",
    scripture: "Isaiah 6:3",
    scriptureText: "Holy, holy, holy, is the LORD of hosts: the whole earth is full of his glory.",
    activity: "Define 'holy' from 3 verses (Lev 19:2, 1 Pet 1:16, Rev 4:8). Compare usages.",
    reflection: "How does definition clarify God's nature?",
    prayer: "Make me holy as You are."
  },
  {
    day: 10,
    week: 2,
    title: "Symbols/Types Room (SCYM)",
    floor: "Floor 2: Detective Skills",
    room: "Symbols/Types Room",
    focus: "Metaphors pointing to Christ",
    scripture: "John 3:14",
    scriptureText: "And as Moses lifted up the serpent in the wilderness, even so must the Son of man be lifted up.",
    activity: "Type: Bronze serpent (Num 21:9) → Antitype: Cross (Jn 3:14). Draw the connection.",
    reflection: "Where else do you see shadows of Jesus?",
    prayer: "Lift my eyes to the true Savior."
  },
  {
    day: 11,
    week: 2,
    title: "Questions Room (Q)",
    floor: "Floor 2: Detective Skills",
    room: "Questions Room",
    focus: "Probing inquiries",
    scripture: "Habakkuk 2:1",
    scriptureText: "I will stand upon my watch, and set me upon the tower...",
    activity: "Ask 5 questions on Daniel 2: Nebuchadnezzar's dream. (Who interprets? What metals mean?)",
    reflection: "What question challenges your understanding?",
    prayer: "Teach me to seek answers in You."
  },
  {
    day: 12,
    week: 2,
    title: "Q&A Internship Room (QA)",
    floor: "Floor 2: Detective Skills",
    room: "Q&A Internship Room",
    focus: "Chain questions to insights",
    scripture: "Proverbs 25:2",
    scriptureText: "It is the glory of God to conceal a thing: but the honour of kings is to search out a matter.",
    activity: "Chain: Q1 on Matt 24:3 (signs?) → A1 (wars) → Q2 (end times?). Build 3 links.",
    reflection: "How do questions lead to revelation?",
    prayer: "Unconceal Your truths."
  },
  {
    day: 13,
    week: 2,
    title: "Listening Room (LR)",
    floor: "Floor 2: Detective Skills",
    room: "Listening Room",
    focus: "Spirit-prompted insights",
    scripture: "1 Samuel 3:10",
    scriptureText: "Speak; for thy servant heareth.",
    activity: "Read Psalm 119:1-16 silently. Note 3 Spirit-whispers (e.g., 'Keep my ways').",
    reflection: "What did quiet listening reveal?",
    prayer: "Tune my ear to Your voice."
  },
  {
    day: 14,
    week: 2,
    title: "Week Review – Floor 2 Integration",
    floor: "Floor 2: Detective Skills",
    focus: "Detective toolkit",
    scripture: "Acts 17:11",
    scriptureText: "These were more noble... in that they received the word... and searched the scriptures daily.",
    activity: "Investigate Ruth 1: Observe facts, define 'kinsman,' symbolize Boaz, question loyalty.",
    reflection: "How has investigation uncovered Christ?",
    prayer: "Search me and know me, O God."
  },

  // Week 3: Freestyle Connections (Days 15-21) – Floor 3: Daily Links
  {
    day: 15,
    week: 3,
    title: "Nature Freestyle (NF)",
    floor: "Floor 3: Daily Links",
    room: "Nature Freestyle",
    focus: "Creation analogies",
    scripture: "Romans 1:20",
    scriptureText: "For the invisible things of him... are clearly seen, being understood by the things that are made.",
    activity: "Walk outside. Link a tree (roots=faith, Ps 1:3) to Jeremiah 17:7-8. Journal.",
    reflection: "How does nature echo Scripture?",
    prayer: "Speak through Your creation."
  },
  {
    day: 16,
    week: 3,
    title: "Personal Freestyle (PF)",
    floor: "Floor 3: Daily Links",
    room: "Personal Freestyle",
    focus: "Life application",
    scripture: "James 1:22",
    scriptureText: "But be ye doers of the word, and not hearers only, deceiving your own selves.",
    activity: "Apply Ephesians 4:32 to a recent conflict: Forgive as Christ forgave. Act on it.",
    reflection: "Where does the Word meet your day?",
    prayer: "Make my life Your mirror."
  },
  {
    day: 17,
    week: 3,
    title: "Bible Freestyle / Verse Genetics (BF)",
    floor: "Floor 3: Daily Links",
    room: "Bible Freestyle",
    focus: "Verse family trees",
    scripture: "Psalm 119:105",
    scriptureText: "Thy word is a lamp unto my feet, and a light unto my path.",
    activity: "Trace 'light' genetics: Ps 119:105 → John 8:12 → Rev 21:23. Map connections.",
    reflection: "How do verses 'breed' deeper truth?",
    prayer: "Illuminate my path with Your Word."
  },
  {
    day: 18,
    week: 3,
    title: "History/Social Freestyle (HF)",
    floor: "Floor 3: Daily Links",
    room: "History/Social Freestyle",
    focus: "Historical amplification (historicist lens)",
    scripture: "Daniel 2:21",
    scriptureText: "And he changeth the times and the seasons: he removeth kings, and setteth up kings.",
    activity: "Link Dan 2 empires to history: Babylon (ancient) → Rome (pagan/papal). Note 1798 wound.",
    reflection: "How does history confirm prophecy?",
    prayer: "Show me Your sovereignty in time."
  },
  {
    day: 19,
    week: 3,
    title: "Recipe Room (RCP)",
    floor: "Floor 3: Daily Links",
    room: "Recipe Room",
    focus: "Verses as ingredients for studies",
    scripture: "Proverbs 15:17",
    scriptureText: "Better is a dinner of herbs where love is, than a stalled ox and hatred therewith.",
    activity: "'Cook' with 3 verses: Prov 15:17 + Jn 13:34 + 1 Cor 13:13. Create a 'love meal' outline.",
    reflection: "What recipe nourishes your soul?",
    prayer: "Feed me with Your bread of life."
  },
  {
    day: 20,
    week: 3,
    title: "Concentration Room (CON)",
    floor: "Floor 3: Daily Links",
    room: "Concentration Room",
    focus: "Find Jesus in texts",
    scripture: "Luke 24:44",
    scriptureText: "All things must be fulfilled, which were written in the law of Moses... and in the psalms, concerning me.",
    activity: "Concentrate on Gen 22: Abraham's sacrifice → Christ's (Heb 11:17-19). Spot 3 links.",
    reflection: "Where was Jesus hiding?",
    prayer: "Draw me to Yourself."
  },
  {
    day: 21,
    week: 3,
    title: "Week Review – Freestyle Flow",
    floor: "Floor 3: Daily Links",
    focus: "Spontaneous connections",
    scripture: "Colossians 3:16",
    scriptureText: "Let the word of Christ dwell in you richly in all wisdom.",
    activity: "Freestyle Isaiah 53: Link to nature (suffering servant as vine), personal trial, history (crucifixion).",
    reflection: "How do freestyles make study alive?",
    prayer: "Let Your Word dwell in me."
  },

  // Week 4: Structure & Patterns (Days 22-28) – Floor 4: Christ-Centered Depth
  {
    day: 22,
    week: 4,
    title: "Dimensions Room (DIM)",
    floor: "Floor 4: Christ-Centered Depth",
    room: "Dimensions Room",
    focus: "1D Literal → 5D Eschatological",
    scripture: "Exodus 25:8",
    scriptureText: "And let them make me a sanctuary; that I may dwell among them.",
    activity: "Apply dimensions to Ex 25:8: 1D (building), 2D (type of heaven), 3D (dwell in me), 4D (church temple), 5D (new Jerusalem).",
    reflection: "How do layers reveal Christ?",
    prayer: "Dwell among us eternally."
  },
  {
    day: 23,
    week: 4,
    title: "Connect-6 Room (C6)",
    floor: "Floor 4: Christ-Centered Depth",
    room: "Connect-6 Room",
    focus: "Genres linkage (Prophecy, Parables, etc.)",
    scripture: "Matthew 13:3",
    scriptureText: "Behold, a sower went forth to sow.",
    activity: "Connect sower across 6 genres: Parable (Matt 13), Prophecy (Isa 55:10-11), History (farmers in Ruth), etc.",
    reflection: "What unified truth emerges?",
    prayer: "Sow Your seed in my heart."
  },
  {
    day: 24,
    week: 4,
    title: "Theme Room (THM)",
    floor: "Floor 4: Christ-Centered Depth",
    room: "Theme Room",
    focus: "Walls (Sanctuary, Life of Christ) and floors/ceiling",
    scripture: "Hebrews 9:1",
    scriptureText: "Then verily the first covenant had also ordinances of divine service, and a worldly sanctuary.",
    activity: "Trace 'blood' on Sanctuary Wall: Ex 12 (Passover) → Heb 9 (new covenant).",
    reflection: "How does theme build the palace?",
    prayer: "Wash me in Your blood."
  },
  {
    day: 25,
    week: 4,
    title: "Time Zone Room (TZ)",
    floor: "Floor 4: Christ-Centered Depth",
    room: "Time Zone Room",
    focus: "Hpa (Heaven Past) to Ef (Earth Future)",
    scripture: "Revelation 12:7",
    scriptureText: "And there was war in heaven: Michael and his angels fought against the dragon.",
    activity: "Map Rev 12: TZ-Hpa (fall of Lucifer) → TZ-Ef (final defeat).",
    reflection: "How does time zone prophecy comfort?",
    prayer: "Prepare me for Your times."
  },
  {
    day: 26,
    week: 4,
    title: "Patterns Room (PRM)",
    floor: "Floor 4: Christ-Centered Depth",
    room: "Patterns Room",
    focus: "Chiasm, inclusio, repeats",
    scripture: "Genesis 1:1",
    scriptureText: "In the beginning God created the heaven and the earth.",
    activity: "Spot pattern in Jonah: Chiasm (Jon 2 prayer center).",
    reflection: "What patterns point to design?",
    prayer: "Order my chaotic thoughts."
  },
  {
    day: 27,
    week: 4,
    title: "Parallels Room (PAR)",
    floor: "Floor 4: Christ-Centered Depth",
    room: "Parallels Room",
    focus: "Canonical echoes",
    scripture: "Psalm 22:1",
    scriptureText: "My God, my God, why hast thou forsaken me?",
    activity: "Parallel Ps 22 to Matt 27:46 (crucifixion). Source: Both.",
    reflection: "How do echoes amplify Christ?",
    prayer: "Echo Your cry in my trials."
  },
  {
    day: 28,
    week: 4,
    title: "Week Review – Pattern Mastery",
    floor: "Floor 4: Christ-Centered Depth",
    focus: "Structural synthesis",
    scripture: "Romans 11:33",
    scriptureText: "O the depth of the riches both of the wisdom and knowledge of God!",
    activity: "Pattern Daniel 7: Beasts (1D) → Christ kingdom (5D). Connect genres.",
    reflection: "How do patterns unveil wisdom?",
    prayer: "Reveal Your patterns."
  },

  // Week 5: Sanctuary & Prophecy (Days 29-35) – Floors 5-6: Vision & Cycles
  {
    day: 29,
    week: 5,
    title: "Blue/Sanctuary Room (SAN)",
    floor: "Floors 5-6: Vision & Cycles",
    room: "Blue/Sanctuary Room",
    focus: "Furniture path: Altar → Ark",
    scripture: "Exodus 40:6",
    scriptureText: "And thou shalt set the altar of the burnt offering before the door of the tabernacle.",
    activity: "Walk SAN path for Lev 16: Altar (sacrifice) → Mercy Seat (atonement). Christ link.",
    reflection: "How does sanctuary map salvation?",
    prayer: "Enter Your courts."
  },
  {
    day: 30,
    week: 5,
    title: "Prophecy Room (PRO)",
    floor: "Floors 5-6: Vision & Cycles",
    room: "Prophecy Room",
    focus: "Historicist symbols (beast=power)",
    scripture: "Daniel 7:17",
    scriptureText: "These great beasts, which are four, are four kings, which shall arise out of the earth.",
    activity: "PRO Dan 7: Little Horn (papal) → 1260 years (538-1798).",
    reflection: "What prophecy anchors hope?",
    prayer: "Fulfill Your words."
  },
  {
    day: 31,
    week: 5,
    title: "Three Angels' Room (AM3)",
    floor: "Floors 5-6: Vision & Cycles",
    room: "Three Angels' Room",
    focus: "Rev 14:6-12 messages",
    scripture: "Revelation 14:7",
    scriptureText: "Fear God, and give glory to him; for the hour of his judgment is come.",
    activity: "Break down: 1st (gospel), 2nd (Babylon fall), 3rd (mark warning). Personal tie.",
    reflection: "How do angels call today?",
    prayer: "Seal me with Your truth."
  },
  {
    day: 32,
    week: 5,
    title: "Feasts Room (FST)",
    floor: "Floors 5-6: Vision & Cycles",
    room: "Feasts Room",
    focus: "Typology to Christ (Passover= cross)",
    scripture: "Leviticus 23:5",
    scriptureText: "In the fourteenth day of the first month at even is the LORD'S passover.",
    activity: "FST chain: Passover (Ex 12) → Pentecost (Acts 2) → Atonement (Heb 9).",
    reflection: "What feast fulfills in you?",
    prayer: "Celebrate Your feasts eternally."
  },
  {
    day: 33,
    week: 5,
    title: "Juice Room (JUI)",
    floor: "Floors 5-6: Vision & Cycles",
    room: "Juice Room",
    focus: "Whole-book synthesis",
    scripture: "Hebrews 1:1-2",
    scriptureText: "God, who at sundry times and in divers manners spake... hath in these last days spoken unto us by his Son.",
    activity: "Juice Romans: Theme (justification) in one page.",
    reflection: "How does synthesis refresh?",
    prayer: "Squeeze truth from Your book."
  },
  {
    day: 34,
    week: 5,
    title: "Christ in Every Chapter (CEC)",
    floor: "Floors 5-6: Vision & Cycles",
    room: "Christ in Every Chapter",
    focus: "Jesus per chapter",
    scripture: "Genesis 3:15",
    scriptureText: "And I will put enmity between thee and the woman, and between thy seed and her seed.",
    activity: "CEC Exodus: Ch. 12 (Passover Lamb). Find in 3 chapters.",
    reflection: "Where is Christ chapter by chapter?",
    prayer: "Expound Yourself in all Scripture."
  },
  {
    day: 35,
    week: 5,
    title: "Eight Cycles (@Ad to @Re)",
    floor: "Floors 5-6: Vision & Cycles",
    room: "Eight Cycles",
    focus: "Covenantal patterns (Adamic to Remnant)",
    scripture: "Genesis 6:18",
    scriptureText: "But with thee will I establish my covenant.",
    activity: "Map one cycle: Abrahamic (Gen 12-50: Promise → Egypt). Link to Christ.",
    reflection: "How do cycles show redemption?",
    prayer: "Restore me in Your cycle."
  },

  // Week 6: Transformation & Mastery (Days 36-42) – Floors 7-8: Synthesis & Ascension
  {
    day: 36,
    week: 6,
    title: "Fire Room (FRM)",
    floor: "Floors 7-8: Synthesis & Ascension",
    room: "Fire Room",
    focus: "Emotional engagement",
    scripture: "Jeremiah 20:9",
    scriptureText: "His word was in mine heart as a burning fire shut up in my bones.",
    activity: "Feel Psalm 51: David's repentance. Journal emotion.",
    reflection: "What fire burns in the text?",
    prayer: "Set my heart aflame."
  },
  {
    day: 37,
    week: 6,
    title: "Meditation Room (MED)",
    floor: "Floors 7-8: Synthesis & Ascension",
    room: "Meditation Room",
    focus: "Rumination on study",
    scripture: "Psalm 1:2",
    scriptureText: "But his delight is in the law of the LORD; and in his law doth he meditate day and night.",
    activity: "Meditate Joshua 1:8 for 10 min. Repeat, visualize.",
    reflection: "What deepens in stillness?",
    prayer: "Meditate on You day and night."
  },
  {
    day: 38,
    week: 6,
    title: "Speed Room (SPD)",
    floor: "Floors 7-8: Synthesis & Ascension",
    room: "Speed Room",
    focus: "Rapid room application",
    scripture: "Ecclesiastes 3:1",
    scriptureText: "To every thing there is a season, and a time to every purpose under the heaven.",
    activity: "Speed-run Prov 3:5-6 through 3 rooms (1 min each). Time yourself.",
    reflection: "How does speed sharpen focus?",
    prayer: "Teach me Your timing."
  },
  {
    day: 39,
    week: 6,
    title: "Mathematics Room (MATH)",
    floor: "Floors 7-8: Synthesis & Ascension",
    room: "Mathematics Room",
    focus: "Prophetic numbers (DY principle)",
    scripture: "Daniel 8:14",
    scriptureText: "Unto two thousand and three hundred days; then shall the sanctuary be cleansed.",
    activity: "MATH @2300: 457 BC → 1844 AD (IJ start). Link to sanctuary.",
    reflection: "What math measures mercy?",
    prayer: "Count Your blessings."
  },
  {
    day: 40,
    week: 6,
    title: "Reflexive Mastery (Floor 8)",
    floor: "Floors 7-8: Synthesis & Ascension",
    room: "Reflexive Mastery",
    focus: "Internalized palace; ascension to Christ",
    scripture: "Ephesians 3:17-19",
    scriptureText: "That Christ may dwell in your hearts... that ye might be filled with all the fulness of God.",
    activity: "Full palace tour: Pick Rev 14:12. Apply 5 rooms/dimensions. Synthesize.",
    reflection: "How has the palace formed Christ in you?",
    prayer: "Fill me with Your fullness; ascend in You."
  },
  {
    day: 41,
    week: 6,
    title: "Integration Practice",
    floor: "Floors 7-8: Synthesis & Ascension",
    focus: "Combining multiple rooms",
    scripture: "Colossians 1:18",
    scriptureText: "That in all things he might have the preeminence.",
    activity: "Choose Philippians 2:5-11. Apply Story (kenosis narrative), Symbols (name above all names), Dimensions (cosmic scope).",
    reflection: "How do multiple lenses magnify Christ?",
    prayer: "Have preeminence in all my studies."
  },
  {
    day: 42,
    week: 6,
    title: "Palace Walkthrough Mastery",
    floor: "Floors 7-8: Synthesis & Ascension",
    focus: "Complete mental tour of all 8 floors",
    scripture: "Psalm 119:130",
    scriptureText: "The entrance of thy words giveth light; it giveth understanding unto the simple.",
    activity: "Mental walkthrough from Floor 1 to Floor 8. Recall one room from each floor with its key lesson.",
    reflection: "What floor needs more practice?",
    prayer: "Guide me through Your palace daily."
  },

  // Week 7: Advanced Application (Days 43-49)
  {
    day: 43,
    week: 7,
    title: "Multi-Room Synthesis I",
    floor: "Advanced Application",
    focus: "Combining 3-4 rooms per passage",
    scripture: "John 15:1-8",
    scriptureText: "I am the true vine, and my Father is the husbandman.",
    activity: "Study John 15:1-8 through Nature Freestyle (vine metaphor), Symbols (branches=believers), Dimensions (1D-5D fruitbearing), Meditation (abide).",
    reflection: "How does multi-room study create depth?",
    prayer: "Make me fruitful in Your vine."
  },
  {
    day: 44,
    week: 7,
    title: "Multi-Room Synthesis II",
    floor: "Advanced Application",
    focus: "Full palace application to one chapter",
    scripture: "Revelation 3:14-22",
    scriptureText: "These things saith the Amen, the faithful and true witness.",
    activity: "Apply 6 rooms to Laodicea message: Story (church history), Prophecy (end-time), Personal (lukewarm), Fire (urgency), Symbols (gold, white raiment), CEC (Christ outside).",
    reflection: "What does comprehensive study reveal?",
    prayer: "Open the door to You, Jesus."
  },
  {
    day: 45,
    week: 7,
    title: "Teaching Preparation",
    floor: "Advanced Application",
    focus: "Using palace to teach others",
    scripture: "2 Timothy 2:2",
    scriptureText: "The same commit thou to faithful men, who shall be able to teach others also.",
    activity: "Prepare a 10-minute teaching on Psalm 23 using 3 rooms. Outline: Intro, Room 1 (Story), Room 2 (Personal), Room 3 (Dimensions). Practice delivery.",
    reflection: "How does teaching solidify learning?",
    prayer: "Make me a faithful teacher."
  },
  {
    day: 46,
    week: 7,
    title: "Difficult Passages Practice",
    floor: "Advanced Application",
    focus: "Applying palace to hard texts",
    scripture: "2 Peter 3:16",
    scriptureText: "In which are some things hard to be understood.",
    activity: "Tackle Ezekiel 1 (throne vision). Use: Observation (facts), Symbols (living creatures), Dimensions (heavenly reality), Prophecy (God's glory). Journal insights.",
    reflection: "How does the palace unlock difficult passages?",
    prayer: "Give me wisdom for hard truths."
  },
  {
    day: 47,
    week: 7,
    title: "Speed & Depth Balance",
    floor: "Advanced Application",
    focus: "Quick daily study vs. deep weekly dive",
    scripture: "Proverbs 4:18",
    scriptureText: "But the path of the just is as the shining light, that shineth more and more unto the perfect day.",
    activity: "Speed study (5 min): Proverbs 3:5-6 in 2 rooms. Deep study (20 min): Same passage in 5 rooms. Compare results.",
    reflection: "When do you need speed vs. depth?",
    prayer: "Balance my study time wisely."
  },
  {
    day: 48,
    week: 7,
    title: "Cross-Testament Connections",
    floor: "Advanced Application",
    focus: "Linking OT and NT through palace",
    scripture: "Matthew 5:17",
    scriptureText: "Think not that I am come to destroy the law, or the prophets: I am not come to destroy, but to fulfil.",
    activity: "Connect Isaiah 53 to Gospel passion accounts using: Prophecy (fulfillment), Parallels (verse echoes), CEC (Christ in Isaiah). Create visual map.",
    reflection: "How does the palace bridge testaments?",
    prayer: "Show me Your Word's unity."
  },
  {
    day: 49,
    week: 7,
    title: "Personal Palace Customization",
    floor: "Advanced Application",
    focus: "Adapting palace to your learning style",
    scripture: "1 Corinthians 12:4",
    scriptureText: "Now there are diversities of gifts, but the same Spirit.",
    activity: "Review all 38 rooms. Identify your 5 strongest and 5 weakest. Create a personalized study plan emphasizing growth areas.",
    reflection: "What's your unique palace signature?",
    prayer: "Use my gifts for Your glory."
  },

  // Week 8: Mastery & Legacy (Day 50)
  {
    day: 50,
    week: 8,
    title: "Palace Completion & Commissioning",
    floor: "Complete Palace Mastery",
    focus: "Final integration and lifelong commitment",
    scripture: "Revelation 22:17",
    scriptureText: "And the Spirit and the bride say, Come. And let him that heareth say, Come.",
    activity: "Complete palace review: Choose one favorite verse (any book). Apply all 8 floors systematically, spending 5 min per floor. Create a final gem synthesis. Share your palace journey with someone—invite them to begin.",
    reflection: "How has this 50-day journey transformed your Bible study? What legacy will your palace create?",
    prayer: "Thank You for building this palace in me. May I dwell in Your Word daily and invite others to discover Christ in every passage. Let my palace be a living testimony of Your truth. Amen."
  }
];

// Kids versions for different age groups
export const kidsPhototheologyCourse: KidsCourseDay[] = [
  // Ages 5-8 simplified versions (sample days)
  {
    day: 1,
    week: 1,
    title: "Building Your Bible Castle",
    floor: "Floor 1: Starting Your Adventure",
    ageGroup: 'ages-5-8',
    focus: "The Bible tells us about Jesus in every story",
    scripture: "Luke 24:27",
    scriptureText: "Jesus showed them all the stories in the Bible about Himself.",
    activity: "Draw a big castle with 8 floors. Color the first floor. Think about the story of Adam and Eve in the garden.",
    simplifiedActivity: "Draw and color your Bible castle! Make it BIG with 8 floors.",
    funElement: "Use your favorite colors and add Jesus at the top!",
    reflection: "Can you see Jesus in the story of the garden?",
    prayer: "Jesus, help me see You in every Bible story."
  },
  {
    day: 2,
    week: 1,
    title: "Story Time Room",
    floor: "Floor 1: Starting Your Adventure",
    room: "Story Time Room",
    ageGroup: 'ages-5-8',
    focus: "God teaches us through stories",
    scripture: "Genesis 3:21",
    scriptureText: "God made clothes for Adam and Eve.",
    activity: "Listen to Genesis 3. Draw your favorite part. Remember that God took care of Adam and Eve even when they made mistakes.",
    simplifiedActivity: "Draw Adam and Eve in the garden. What happened?",
    funElement: "Make it a comic strip with 3 pictures!",
    reflection: "How did God show love to Adam and Eve?",
    prayer: "Thank You, God, for loving me even when I mess up."
  },

  // Ages 9-12 versions (sample days)
  {
    day: 1,
    week: 1,
    title: "The Phototheology Vision",
    floor: "Floor 1: Building Your Palace",
    ageGroup: 'ages-9-12',
    focus: "Learning to see Jesus throughout the whole Bible",
    scripture: "Luke 24:27",
    scriptureText: "And beginning at Moses and all the prophets, he expounded unto them in all the scriptures the things concerning himself.",
    activity: "Read Genesis 1-3. Create a simple map of your memory palace with 8 floors. On Floor 1, draw the Garden of Eden as your entrance. Label three things: Adam (God's promise), Eve (relationship), serpent (the problem sin causes).",
    simplifiedActivity: "Design your 8-floor memory palace. Make it colorful and creative!",
    funElement: "Give your palace a cool name like 'Truth Tower' or 'Jesus Castle'!",
    reflection: "Where can you see Jesus promised in Genesis 3:15?",
    prayer: "Lord, open my eyes to see Jesus in every Bible story I read."
  },
  {
    day: 2,
    week: 1,
    title: "Story Room Adventure",
    floor: "Floor 1: Building Your Palace",
    room: "Story Room",
    ageGroup: 'ages-9-12',
    focus: "Bible stories teach us about God visually",
    scripture: "Genesis 3:21",
    scriptureText: "Unto Adam also and to his wife did the LORD God make coats of skins, and clothed them.",
    activity: "Retell Genesis 3 like a movie scene. Create images in your mind: The tree of knowledge, the first animal sacrifice, God making clothes. Memorize 3 key stories from Genesis 1-11 (Creation, Fall, Flood).",
    simplifiedActivity: "Storyboard Genesis 3 with 6 key scenes. Add captions!",
    funElement: "Act it out with family members or stuffed animals!",
    reflection: "How does God's clothing for Adam and Eve show us Jesus's sacrifice?",
    prayer: "Jesus, cover me with Your righteousness like You covered Adam and Eve."
  },

  // Ages 13-16 versions (sample days)
  {
    day: 1,
    week: 1,
    title: "Introduction to Phototheology",
    floor: "Floor 1: Foundations",
    ageGroup: 'ages-13-16',
    focus: "Phototheology as a visual, Christ-centered approach to Scripture",
    scripture: "Luke 24:27",
    scriptureText: "And beginning at Moses and all the prophets, he expounded unto them in all the scriptures the things concerning himself.",
    activity: "Read Genesis 1-3 carefully. Design your memory palace structure (8 floors, 38 rooms). Visualize Eden as your palace entrance, noting key elements: Adam (covenant relationship), Eve (community), serpent (cosmic conflict). Create a detailed sketch or digital design of your palace outline.",
    simplifiedActivity: "Design and diagram your complete 8-floor palace with labels for each floor's purpose.",
    funElement: "Use an app like Canva or Procreate to create a digital palace design, or build a 3D model!",
    reflection: "Where do you see Christ foreshadowed in Genesis 3:15? How does this proto-evangelium (first gospel) set the stage for redemption?",
    prayer: "Lord, give me eyes to see Your Son in every passage. Open my heart to the depth of Scripture."
  },
  {
    day: 2,
    week: 1,
    title: "Story Room (ST) Deep Dive",
    floor: "Floor 1: Foundations",
    room: "Story Room",
    ageGroup: 'ages-13-16',
    focus: "Narrative as God's primary visual teaching method",
    scripture: "Genesis 3:21",
    scriptureText: "Unto Adam also and to his wife did the LORD God make coats of skins, and clothed them.",
    activity: "Analyze Genesis 3 as narrative theology. Map the story structure: Exposition (garden setting), Rising Action (serpent's temptation), Climax (eating fruit), Falling Action (hiding), Resolution (judgment and promise). Assign symbolic images: Tree (knowledge vs. life), Blood (first sacrifice), Covering (Christ's righteousness). Memorize the narrative arc of 3 Genesis stories (1-11).",
    simplifiedActivity: "Create a detailed story map with theological annotations showing Christ-types and symbols.",
    funElement: "Film a 2-minute video retelling Genesis 3 with modern parallels!",
    reflection: "How does the animal skin covering point to substitutionary atonement? What does this reveal about the cost of covering sin?",
    prayer: "Clothe me fully in Your righteousness, Jesus. Let me never trust in my own covering."
  }
];
