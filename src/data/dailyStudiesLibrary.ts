// Daily Studies Library for Phototheology Palace
// Studies organized by Palace Principles with Easy, Intermediate, and Deep levels

export type StudyLevel = 'easy' | 'intermediate' | 'deep';

export interface StudyQuestion {
  question: string;
  hint?: string;
  scripture?: string;
}

export interface DailyStudy {
  id: string;
  title: string;
  level: StudyLevel;
  palacePrinciple: string;
  principleDescription: string;
  room?: string; // Which room this relates to
  introduction: string;
  focusScripture: string;
  focusPassage?: string;
  questions: StudyQuestion[];
  keyInsight: string;
  practiceActivity?: string;
  relatedPrinciples?: string[];
}

// ============================================
// EASY LEVEL STUDIES
// Foundation concepts for beginners
// ============================================

const easyStudies: DailyStudy[] = [
  // SIX WALLS - Christ Pattern
  {
    id: 'easy-christ-pattern-1',
    title: 'Finding Christ in Stories',
    level: 'easy',
    palacePrinciple: 'Christ Pattern (First Wall)',
    principleDescription: 'Every story in Scripture reveals something about Jesus — His life, death, or ministry.',
    room: 'studies',
    introduction: 'The palace has six walls, and the first wall is the Christ Pattern. This means every Bible story shows us something about Jesus. Today we\'ll learn to see Jesus in a familiar story.',
    focusScripture: 'Genesis 22:1-14',
    focusPassage: 'Abraham and Isaac on Mount Moriah',
    questions: [
      { question: 'Who provided the lamb for Abraham\'s sacrifice?', hint: 'Look at verse 8 and 14' },
      { question: 'How is Isaac\'s journey up the mountain like Jesus\' journey to the cross?', scripture: 'John 19:17' },
      { question: 'What does Abraham\'s willingness to offer Isaac tell us about God offering Jesus?', scripture: 'John 3:16' }
    ],
    keyInsight: 'Isaac carrying the wood up the mountain is a picture of Jesus carrying His cross. Abraham\'s words "God will provide the lamb" were fulfilled when God provided Jesus as the Lamb of God.',
    practiceActivity: 'This week, when you read a Bible story, ask: "Who represents Jesus in this story?"',
    relatedPrinciples: ['Sacrifice Pattern', 'Covenant Pattern']
  },
  {
    id: 'easy-christ-pattern-2',
    title: 'Christ in Joseph\'s Story',
    level: 'easy',
    palacePrinciple: 'Christ Pattern (First Wall)',
    principleDescription: 'Joseph\'s life is one of the clearest pictures of Jesus in the Old Testament.',
    room: 'studies',
    introduction: 'Joseph was sold by his brothers, went through suffering, and then saved the very ones who rejected him. This is exactly what Jesus did for us!',
    focusScripture: 'Genesis 37, 45:1-8',
    questions: [
      { question: 'How did Joseph\'s brothers feel about him?', hint: 'Genesis 37:4-8' },
      { question: 'What did Joseph do when his brothers came to him in Egypt?', hint: 'Genesis 45:5-8' },
      { question: 'How is this like what Jesus does for those who rejected Him?', scripture: 'Romans 5:8' }
    ],
    keyInsight: 'Joseph told his brothers: "You meant it for evil, but God meant it for good" (Genesis 50:20). Jesus was rejected and crucified, but God used it to save the world.',
    practiceActivity: 'Write down three ways Joseph\'s story mirrors Jesus\' story.'
  },

  // SIX WALLS - Sanctuary Pattern
  {
    id: 'easy-sanctuary-1',
    title: 'The Sanctuary Journey',
    level: 'easy',
    palacePrinciple: 'Sanctuary Pattern (Second Wall)',
    principleDescription: 'The sanctuary shows the step-by-step journey of salvation.',
    room: 'sanctuary',
    introduction: 'The sanctuary was like a map showing how we come to God. Each piece of furniture represents a step in our journey with Jesus.',
    focusScripture: 'Exodus 25:8-9; 40:1-8',
    questions: [
      { question: 'What was the first thing you would see entering the courtyard?', hint: 'The altar of burnt offering' },
      { question: 'Why do you think you had to pass the altar before anything else?', scripture: 'Hebrews 9:22' },
      { question: 'What did the laver (water basin) represent?', scripture: 'Titus 3:5' }
    ],
    keyInsight: 'You can\'t skip steps in the sanctuary! First the altar (accepting Jesus\' sacrifice), then the laver (baptism), then entering the holy place. Salvation is a journey, not just a moment.',
    practiceActivity: 'Draw a simple sanctuary layout and label each piece of furniture with what it represents in your spiritual journey.'
  },
  {
    id: 'easy-sanctuary-2',
    title: 'Furniture in the Holy Place',
    level: 'easy',
    palacePrinciple: 'Sanctuary Pattern (Second Wall)',
    principleDescription: 'The three items in the Holy Place represent daily Christian living.',
    room: 'sanctuary',
    introduction: 'Once past the altar and laver, the priest entered the Holy Place. Here were three items that represent how we grow in Christ daily.',
    focusScripture: 'Exodus 25:23-40',
    questions: [
      { question: 'The bread on the table was called the "bread of the presence." What is our daily bread?', scripture: 'Matthew 4:4; John 6:35' },
      { question: 'The candlestick gave light in the dark room. What does Jesus call us?', scripture: 'Matthew 5:14-16' },
      { question: 'The incense rose up like smoke. What does incense represent?', scripture: 'Revelation 8:3-4' }
    ],
    keyInsight: 'Daily Christian life = feeding on God\'s Word (bread), shining for Jesus (candlestick), and talking to God (incense/prayer).',
    practiceActivity: 'Which of the three — Word, Witnessing, or Prayer — needs more attention in your life this week?'
  },

  // SIX DIMENSIONS
  {
    id: 'easy-dimensions-1',
    title: 'The Same Story, Many Meanings',
    level: 'easy',
    palacePrinciple: 'Six Dimensions of Application',
    principleDescription: 'Every Bible passage can be understood at multiple levels — from literal history to heavenly realities.',
    room: 'studies',
    introduction: 'Phototheology teaches that Scripture is like a diamond with many facets. The same passage has meaning for you personally, for Jesus, for the church, and even for heaven!',
    focusScripture: 'Joshua 3-4 (Crossing the Jordan)',
    questions: [
      { question: 'Literally, what happened when Israel crossed the Jordan?', hint: 'The waters parted and they walked through on dry ground' },
      { question: 'How is crossing the Jordan like baptism?', scripture: 'Romans 6:4' },
      { question: 'If Jordan represents death and Canaan represents heaven, what does crossing Jordan picture for us personally?' }
    ],
    keyInsight: 'Israel\'s crossing of Jordan was a literal event, but it also pictures: (1) Jesus\' baptism at the Jordan, (2) Our baptism, (3) The church entering its mission, (4) Our final crossing into heaven!',
    practiceActivity: 'When you read a Bible story, ask these questions: What happened literally? How does this show me Jesus? What does this mean for me? What does this mean for the church?'
  },
  {
    id: 'easy-dimensions-2',
    title: 'David and Goliath — It\'s Your Story Too',
    level: 'easy',
    palacePrinciple: 'Personal Dimension (Me)',
    principleDescription: 'Bible stories aren\'t just history — they are maps for your own spiritual battles.',
    room: 'studies',
    introduction: 'You probably know the story of David and Goliath. But did you know this story is about YOUR battles too?',
    focusScripture: '1 Samuel 17',
    questions: [
      { question: 'What "Goliath" do you face in your life — what giant problem seems impossible?', hint: 'Fear, addiction, doubt, temptation?' },
      { question: 'David didn\'t use Saul\'s armor. What weapons has God given YOU that the world doesn\'t understand?', scripture: 'Ephesians 6:10-17' },
      { question: 'David said, "The battle is the Lord\'s." What does this mean for your Goliath?' }
    ],
    keyInsight: 'David represents Christ who defeated our greatest giant — death and sin. But you also have a Goliath, and the same God who gave David victory will give you victory!',
    practiceActivity: 'Write down your Goliath. Then write: "The battle is the Lord\'s" and pray over it daily.'
  },

  // PARALLELS
  {
    id: 'easy-parallels-1',
    title: 'Shadows and Fulfillment',
    level: 'easy',
    palacePrinciple: 'Biblical Parallels',
    principleDescription: 'Old Testament stories are "shadows" that find their full meaning in Jesus.',
    room: 'p||',
    introduction: 'Parallels show how an Old Testament event and a New Testament event mirror each other. The OT is the shadow; Jesus is the reality.',
    focusScripture: 'Exodus 12:1-13 and John 1:29',
    questions: [
      { question: 'What protected Israel\'s firstborn in Egypt?', hint: 'The blood of the lamb on the doorpost' },
      { question: 'What does John the Baptist call Jesus?', scripture: 'John 1:29' },
      { question: 'How does the Passover lamb parallel Jesus?' }
    ],
    keyInsight: 'The Passover lamb was a shadow. The blood on the doorpost protected from death. Jesus is the fulfillment — His blood protects us from eternal death!',
    practiceActivity: 'Look for more Passover connections: When did Jesus die (time of year)? What day of the week?'
  },

  // COVENANT CYCLES
  {
    id: 'easy-cycles-1',
    title: 'God\'s Covenant Pattern',
    level: 'easy',
    palacePrinciple: 'Covenant Cycles',
    principleDescription: 'God makes covenants (promises) with people in a repeating pattern throughout Scripture.',
    room: 'cycles',
    introduction: 'From Adam to Noah to Abraham to Moses, God keeps making special promises. Each covenant builds on the one before and points to Jesus!',
    focusScripture: 'Genesis 9:8-17 and Genesis 15:1-6',
    questions: [
      { question: 'What sign did God give Noah after the flood?', hint: 'Genesis 9:13' },
      { question: 'What did God promise Abraham?', scripture: 'Genesis 15:5-6' },
      { question: 'What is the "new covenant" God makes with us?', scripture: 'Jeremiah 31:31-33' }
    ],
    keyInsight: 'Every covenant in the Bible is really about Jesus. The rainbow points to God\'s faithfulness in Christ. Abraham\'s seed is Christ (Galatians 3:16). The new covenant is written on our hearts through Jesus!',
    practiceActivity: 'List the major covenants: Adam, Noah, Abraham, Moses, David, New Covenant. What does each one promise?'
  }
];

// ============================================
// INTERMEDIATE LEVEL STUDIES
// Building on foundations with deeper connections
// ============================================

const intermediateStudies: DailyStudy[] = [
  // SIX WALLS - PROPHETIC PATTERN
  {
    id: 'int-prophetic-1',
    title: 'Understanding Time Prophecy',
    level: 'intermediate',
    palacePrinciple: 'Prophetic Pattern (Third Wall)',
    principleDescription: 'Biblical time prophecies provide a chronological framework for understanding history and our place in it.',
    room: 'studies',
    introduction: 'The third wall of the palace is the Prophetic Pattern. This includes the great time prophecies like the 70 weeks, 1260 days, and 2300 days. These aren\'t just numbers — they\'re God\'s roadmap of history.',
    focusScripture: 'Daniel 9:24-27',
    questions: [
      { question: 'The 70 weeks were "determined" for Daniel\'s people. What were the six purposes listed in verse 24?' },
      { question: 'When does the prophecy begin? What event marks the starting point?', hint: 'Verse 25 — the decree to restore and build Jerusalem' },
      { question: 'The 70 weeks (490 years) are cut off from a larger prophecy. What is that prophecy?', scripture: 'Daniel 8:14' },
      { question: 'How does knowing where we are in prophetic time affect how we live?' }
    ],
    keyInsight: 'The 70 weeks ended in AD 34, establishing Christ\'s ministry and the gospel going to the Gentiles. We are living in the final period of the 2300 days — the time of judgment (since 1844). Knowing the time gives urgency to our mission!',
    practiceActivity: 'Create a timeline showing the 2300 days and where the 70 weeks fit within it.',
    relatedPrinciples: ['Day of Atonement', 'Sanctuary Cleansing', 'Investigative Judgment']
  },
  {
    id: 'int-prophetic-2',
    title: 'The 1260 Years',
    level: 'intermediate',
    palacePrinciple: 'Prophetic Pattern (Third Wall)',
    principleDescription: 'The 1260-day prophecy appears seven times in Scripture and reveals a crucial period in church history.',
    room: 'studies',
    introduction: 'The number 1260 (also written as 42 months, 3.5 years, or "time, times, and half a time") appears in Daniel and Revelation. Understanding this prophecy unlocks church history.',
    focusScripture: 'Daniel 7:25; Revelation 12:6, 14; 13:5',
    questions: [
      { question: 'What power is described as wearing out the saints and thinking to change times and laws?', hint: 'Daniel 7:25' },
      { question: 'Using the day-for-year principle, how long is 1260 prophetic days?' },
      { question: 'What period of history does 538-1798 represent for the church?', hint: 'The medieval period' },
      { question: 'How did Revelation 12:6 say the woman (church) would be protected during this time?' }
    ],
    keyInsight: 'The 1260 years (538-1798) was the period of papal supremacy when the true church was "in the wilderness." But God preserved His truth through faithful witnesses. The church came out of the wilderness ready for the final work!',
    practiceActivity: 'Research the Waldensians and how they preserved Scripture during the 1260 years.',
    relatedPrinciples: ['Historic Pattern', 'Remnant Church']
  },

  // SIX WALLS - HISTORIC PATTERN
  {
    id: 'int-historic-1',
    title: 'Israel\'s History as Prophecy',
    level: 'intermediate',
    palacePrinciple: 'Historic Pattern (Fourth Wall)',
    principleDescription: 'The history of ancient Israel provides a template that repeats in church history and individual experience.',
    room: 'studies',
    introduction: 'The fourth wall shows us that Israel\'s history is prophetic history. What happened to Israel happens to the church, and even to us individually.',
    focusScripture: '1 Corinthians 10:1-11',
    questions: [
      { question: 'According to verse 6 and 11, why were the stories of Israel written down?', hint: '"for our examples"' },
      { question: 'How does Israel\'s deliverance from Egypt parallel the church\'s deliverance?', scripture: 'Acts 2:41; 7:36' },
      { question: 'Israel wandered 40 years before entering Canaan. What period might this represent for the church?' },
      { question: 'How does YOUR spiritual journey mirror Israel\'s exodus and wilderness experience?' }
    ],
    keyInsight: 'Egypt = bondage to sin. Red Sea = baptism. Wilderness = Christian growth and testing. Canaan = the promised inheritance. Israel\'s journey is YOUR journey and the CHURCH\'s journey!',
    practiceActivity: 'Map your spiritual journey using the Exodus pattern: Where were you "in Egypt"? When did you cross the "Red Sea"? Where are you now?',
    relatedPrinciples: ['Exodus Pattern', 'Wilderness Experience', 'Covenant Cycles']
  },

  // SIX DIMENSIONS - DEEPER
  {
    id: 'int-dimensions-1',
    title: 'The Six-Dimensional Lens',
    level: 'intermediate',
    palacePrinciple: 'Six Dimensions Applied',
    principleDescription: 'Systematically applying all six dimensions to a single passage reveals its full depth.',
    room: 'studies',
    introduction: 'Let\'s take one passage and systematically apply all six dimensions: Literal, Christ, Personal, Church, Heaven Future, and Heaven Past.',
    focusScripture: 'Genesis 28:10-22 (Jacob\'s Ladder)',
    questions: [
      { question: 'LITERAL: What did Jacob literally see and experience at Bethel?' },
      { question: 'CHRIST: How does Jesus apply this vision to Himself?', scripture: 'John 1:51' },
      { question: 'PERSONAL (ME): What "Bethel" moments has God given you — times when heaven touched earth?' },
      { question: 'CHURCH: How is the church like a ladder connecting heaven and earth?' },
      { question: 'HEAVEN FUTURE: What future reality does the ladder represent?', scripture: 'Revelation 21:2-3' },
      { question: 'HEAVEN PAST: How does this connect to Lucifer\'s original claim to ascend to God\'s throne?', scripture: 'Isaiah 14:13-14' }
    ],
    keyInsight: 'Jacob\'s ladder represents Jesus (John 1:51) — the only way to heaven. But it also represents our prayer connection, the church\'s mission, the New Jerusalem coming down, and even contrasts with Satan\'s failed attempt to "ascend" on his own terms.',
    practiceActivity: 'Take any Bible story and write one sentence for each of the six dimensions.',
    relatedPrinciples: ['Christ Pattern', 'Great Controversy', 'Sanctuary Pattern']
  },

  // CHRIST-CHURCH PARALLEL
  {
    id: 'int-parallel-1',
    title: 'The Church Relives Christ\'s Life',
    level: 'intermediate',
    palacePrinciple: 'Christ-Church Parallel',
    principleDescription: 'Just as individuals follow Christ\'s pattern, so the corporate church relives the experiences of Christ.',
    room: 'p||',
    introduction: 'One of the most powerful parallels in Phototheology is seeing how church HISTORY mirrors CHRIST\'S LIFE. The church is the body of Christ, and it experiences what He experienced!',
    focusScripture: 'Acts 2:1-4; Matthew 3:13-17',
    questions: [
      { question: 'When was the church "born"?', hint: 'Pentecost' },
      { question: 'Compare Christ\'s baptism (Matthew 3:16) with the church\'s "baptism" at Pentecost (Acts 2:3-4). What parallels do you see?' },
      { question: 'Christ was tempted for 40 days. The church went into the wilderness for 1260 years. How is this parallel?' },
      { question: 'Christ cleansed the temple when it was 46 years old (John 2:20). What happened 46 years after 1798 (when the church emerged from the wilderness)?', hint: '1798 + 46 = 1844' }
    ],
    keyInsight: 'Birth → Baptism → Wilderness → Temple Cleansing → Ministry → Persecution → Death Decree → Resurrection. This is Christ\'s pattern, and the church will complete this pattern before Jesus returns!',
    practiceActivity: 'Create a chart: one column for Christ\'s life events, one column for church history events. Look for the parallels.',
    relatedPrinciples: ['1844', 'Sanctuary Cleansing', 'Death Decree', 'Remnant']
  },

  // SANCTUARY - FEASTS
  {
    id: 'int-sanctuary-1',
    title: 'The Prophetic Feasts',
    level: 'intermediate',
    palacePrinciple: 'Feast Day Patterns',
    principleDescription: 'The seven annual feasts of Israel are a prophetic calendar revealing the plan of salvation.',
    room: 'sanctuary',
    introduction: 'The feasts weren\'t just holidays — they were prophecies! Each feast was fulfilled (or will be fulfilled) at a specific time in salvation history.',
    focusScripture: 'Leviticus 23',
    questions: [
      { question: 'Passover was fulfilled when? On what exact day did Jesus die?', scripture: '1 Corinthians 5:7' },
      { question: 'Firstfruits (the wave offering) was fulfilled how?', scripture: '1 Corinthians 15:20' },
      { question: 'Pentecost was exactly 50 days after Firstfruits. What happened on Pentecost?', scripture: 'Acts 2:1' },
      { question: 'The Day of Atonement is being fulfilled when?', hint: 'The judgment that began in 1844' },
      { question: 'When will Tabernacles be fully fulfilled?', hint: 'When God "tabernacles" with His people forever' }
    ],
    keyInsight: 'Spring feasts = fulfilled at Christ\'s first coming (Passover, Unleavened Bread, Firstfruits, Pentecost). Fall feasts = fulfilled at Christ\'s second coming (Trumpets, Atonement, Tabernacles). We are living during the Day of Atonement — the judgment!',
    practiceActivity: 'Make a feast chart showing: Feast Name | OT Meaning | NT Fulfillment | Status (fulfilled/in progress/future)',
    relatedPrinciples: ['Day of Atonement', 'Sanctuary Pattern', 'Prophetic Pattern']
  },

  // PARALLELS - MOSES
  {
    id: 'int-parallel-moses',
    title: 'The Moses Pattern',
    level: 'intermediate',
    palacePrinciple: 'Christ Pattern in Exodus',
    principleDescription: 'Moses\' life is one of the most detailed prophecies of Christ in the Old Testament.',
    room: 'p||',
    introduction: 'Deuteronomy 18:15 says God would raise up "a Prophet like Moses." Jesus IS that Prophet. Let\'s trace the parallels.',
    focusScripture: 'Exodus 1-4; Matthew 1-4',
    questions: [
      { question: 'Both Moses and Jesus escaped a ruler\'s massacre of children. Compare Exodus 1:22 with Matthew 2:16.' },
      { question: 'Both came out of Egypt. Compare Hosea 11:1 with Matthew 2:15.' },
      { question: 'Both passed through water (Red Sea / Baptism). How does this parallel?' },
      { question: 'Both were in the wilderness (40 years / 40 days). What happened in each case?' },
      { question: 'Moses went up a mountain to receive the Law. Jesus gave the Sermon on the Mount. What\'s the connection?', scripture: 'Matthew 5:1' }
    ],
    keyInsight: 'Moses\' life was a prophetic preview of Christ: Birth threat, Egypt, water passage, wilderness, mountain revelation, rejection by his people, but ultimately bringing them to the Promised Land!',
    practiceActivity: 'Continue the parallel: How did Moses\' final song and death (Deuteronomy 31-34) parallel Jesus\' last week?',
    relatedPrinciples: ['Pentateuch Patterns', 'Deliverance Pattern', 'Prophet Office']
  }
];

// ============================================
// DEEP LEVEL STUDIES
// Advanced concepts and multi-layered analysis
// ============================================

const deepStudies: DailyStudy[] = [
  // HEAVEN PAST DIMENSION
  {
    id: 'deep-heaven-past-1',
    title: 'The Great Controversy Lens',
    level: 'deep',
    palacePrinciple: 'Heaven Past (Sixth Dimension)',
    principleDescription: 'Every passage can illuminate the original conflict that began in heaven before earth\'s creation.',
    room: 'studies',
    introduction: 'The sixth dimension is often overlooked: How does this passage illuminate the war that began in heaven? Satan\'s original accusations? God\'s vindication? Let\'s explore.',
    focusScripture: 'Job 1-2; Revelation 12:7-12',
    questions: [
      { question: 'Job\'s story begins with a scene in heaven. What accusation does Satan bring against God\'s government?', hint: 'That Job only serves God because of what he gets' },
      { question: 'How does this accusation reflect Satan\'s original claim in heaven?', scripture: 'Isaiah 14:12-14' },
      { question: 'Job goes through the trial, intercedes for his enemies (Job 42:10). How does this vindicate God\'s character?' },
      { question: 'How does Job\'s experience parallel Christ\'s experience, and ultimately the church\'s final experience?' },
      { question: 'Revelation 12:10 says Satan is "the accuser of the brethren." How do we see this in Job, in Christ\'s trial, and in the final crisis?' }
    ],
    keyInsight: 'Job is not primarily about suffering — it\'s about the COURTROOM OF HEAVEN. Satan accused God of buying loyalty. Job proved otherwise. Christ proved it ultimately. And we, through our faithfulness in trial, participate in vindicating God\'s character!',
    practiceActivity: 'Read any Bible story asking: What question is being answered about God\'s character here? What accusation is being refuted?',
    relatedPrinciples: ['Investigative Judgment', 'Vindication of God', 'Final Crisis']
  },

  // SEVEN CHURCHES - HEAVEN DIMENSION
  {
    id: 'deep-churches-heaven',
    title: 'Seven Churches: A Heavenly Perspective',
    level: 'deep',
    palacePrinciple: 'Seven Churches in Heaven Dimension',
    principleDescription: 'The seven churches don\'t just represent church history — they reflect the original controversy in heaven.',
    room: 'studies',
    introduction: 'The seven churches have the literal, Christ, church history, and personal dimensions. But what about the heaven-past dimension? Let\'s explore.',
    focusScripture: 'Revelation 2-3',
    questions: [
      { question: 'Ephesus means "desirable." When Lucifer was first "desirable" in heaven, what went wrong?', scripture: 'Ezekiel 28:12-15' },
      { question: 'Pergamos means "height/elevation." Satan said he would exalt his throne above God\'s (Isaiah 14:13). How does Pergamos reflect this?' },
      { question: 'Thyatira means "oil of affliction." What affliction came to heaven when war broke out?', scripture: 'Revelation 12:7-9' },
      { question: 'Sardis means "remaining/escaping." Who "escaped" Satan\'s deception?', hint: 'The loyal angels' },
      { question: 'Philadelphia means "brotherly love." How did the loyal angels draw together?', scripture: 'Revelation 12:7' },
      { question: 'Laodicea means "judgment." How does judgment apply to Satan\'s original rebellion?' }
    ],
    keyInsight: 'The seven churches trace NOT ONLY church history but also the STAGES OF LUCIFER\'S FALL and the resulting conflict. Understanding this deepens our grasp of the Great Controversy that runs through all Scripture.',
    practiceActivity: 'Create a three-column chart for each church: Church Name | Church History Meaning | Heaven-Past Meaning',
    relatedPrinciples: ['Great Controversy', 'Revelation Structure', 'Fall of Satan']
  },

  // COVENANT CYCLES DEEP
  {
    id: 'deep-cycles-1',
    title: 'The Eight Covenant Cycles',
    level: 'deep',
    palacePrinciple: 'Covenant Cycles Framework',
    principleDescription: 'Scripture can be organized into eight repeating covenant cycles, each following a similar pattern.',
    room: 'cycles',
    introduction: 'Phototheology identifies eight major covenant cycles: @Ad (Adam), @No (Noah), @Ab (Abraham), @Mo (Moses), @Cy (Cyrus), @CyC (Cyrus-Christ), @Sp (Spiritual Israel), @Re (Remnant). Each cycle has parallel events.',
    focusScripture: 'Overview: Genesis-Revelation',
    questions: [
      { question: 'In the Adam cycle, creation is followed by a fall. How does the Cyrus-Christ cycle (Christ\'s first coming) mirror this?', hint: 'New creation in Christ, followed by church apostasy' },
      { question: 'The Noah cycle has a judgment by water and a remnant saved. What parallels exist in the Moses cycle at the Red Sea?' },
      { question: 'The Abraham cycle includes a promised heir. How is this fulfilled in Christ, and how does the church inherit this promise?', scripture: 'Galatians 3:29' },
      { question: 'Cyrus delivered Israel from Babylon. How does Christ deliver from spiritual Babylon?', scripture: 'Revelation 18:4' },
      { question: 'How does understanding covenant cycles help you see your place in salvation history?' }
    ],
    keyInsight: 'The same story repeats at every level: Creation → Fall → Judgment → Remnant saved → New beginning. This pattern runs from Adam to the New Earth. You are living in the @Re (Remnant) cycle, and your experience mirrors all previous cycles!',
    practiceActivity: 'Chart the eight cycles with major events: @Ad, @No, @Ab, @Mo, @Cy, @CyC, @Sp, @Re. Note the parallels.',
    relatedPrinciples: ['Historic Pattern', 'Prophetic Pattern', 'Remnant']
  },

  // WATERS OF SCRIPTURE
  {
    id: 'deep-waters-1',
    title: 'Rivers and Waters of Scripture',
    level: 'deep',
    palacePrinciple: 'Waters of Scripture',
    principleDescription: 'The rivers and bodies of water in Scripture mark significant transitions and revelations.',
    room: 'studies',
    introduction: 'Notice how significant events happen at specific bodies of water. This isn\'t coincidence — the waters tell a story of their own!',
    focusScripture: 'Multiple: Genesis-Revelation',
    questions: [
      { question: 'The Nile represents bondage. Moses was drawn from it (Exodus 2:10). What does this picture for us?', hint: 'Drawn from bondage' },
      { question: 'Elijah was fed at Cherith (1 Kings 17). This was during the 3.5 years of famine. How does this parallel the 1260 years?' },
      { question: 'Ezekiel received his temple vision at Chebar. What was the vision about?', scripture: 'Ezekiel 1' },
      { question: 'Daniel received the 2300-day vision at Ulai (Daniel 8:2). What was being revealed there?' },
      { question: 'The final vision of Daniel (chapters 10-12) was at Hiddekel (Tigris). What is the subject of this vision?', hint: 'End-time events, perfecting of the saints' },
      { question: 'The Euphrates dries up in Revelation 16:12. What does this represent?', hint: 'Preparation for the kings of the East' }
    ],
    keyInsight: 'Nile = bondage, Red Sea = deliverance, Jordan = entering mission, Cherith = wilderness protection, Ulai = sanctuary truth, Hiddekel = end-time perfecting, Euphrates = fall of Babylon, River of Life = paradise restored. The waters trace the entire plan of salvation!',
    practiceActivity: 'Create a "Waters Map" — list each significant body of water in Scripture and what truth was revealed there.',
    relatedPrinciples: ['Sanctuary Pattern', 'Prophetic Pattern', 'Time Prophecies']
  },

  // REVELATION STRUCTURE
  {
    id: 'deep-revelation-1',
    title: 'Revelation\'s Sanctuary Structure',
    level: 'deep',
    palacePrinciple: 'Revelation Sanctuary Structure',
    principleDescription: 'The book of Revelation is organized around the sanctuary, with each section pointing to different articles of furniture.',
    room: 'sanctuary',
    introduction: 'Revelation isn\'t random visions — it follows the sanctuary pattern! Each major section contains sanctuary imagery that tells us where we are in the plan of salvation.',
    focusScripture: 'Revelation 1, 4, 8, 11:19, 15',
    questions: [
      { question: 'In Revelation 1:12-13, what sanctuary item does John see? What section of Revelation does this introduce?', hint: 'Candlestick → Seven Churches' },
      { question: 'In Revelation 8:3-5, what sanctuary item is prominent? What section does this introduce?', hint: 'Altar of Incense → Seven Trumpets' },
      { question: 'In Revelation 11:19, what is seen in heaven? What does this signal?', hint: 'Ark of Covenant → Most Holy Place' },
      { question: 'Why does Revelation 15:8 say no one can enter the temple? What does this mean prophetically?' },
      { question: 'How does understanding Revelation\'s sanctuary structure help you know where we are in salvation history?' }
    ],
    keyInsight: 'Seven Churches = Candlestick (Holy Place ministry). Seven Seals/Trumpets = Incense Altar (transition). Seven Plagues = Temple filled with smoke (Most Holy, probation closing). The Ark appears in 11:19, signaling the Day of Atonement began. We are in the Most Holy Place time!',
    practiceActivity: 'Read Revelation looking for sanctuary imagery. Create a chart: Chapter | Sanctuary Item Seen | What This Reveals',
    relatedPrinciples: ['Day of Atonement', '1844', 'Three Angels\' Messages']
  },

  // THREE HEAVENS
  {
    id: 'deep-heavens-1',
    title: 'The Three Heavens Framework',
    level: 'deep',
    palacePrinciple: 'Three Heavens (1H, 2H, 3H)',
    principleDescription: 'Scripture speaks of three heavens, and understanding them unlocks prophetic symbolism.',
    room: 'studies',
    introduction: 'Paul was caught up to the "third heaven" (2 Corinthians 12:2). What are the three heavens, and how do they relate to prophecy?',
    focusScripture: '2 Corinthians 12:2; Genesis 1:8, 14-17; Psalm 11:4',
    questions: [
      { question: 'First Heaven: Where do the birds fly? (Genesis 1:20)', hint: 'The atmosphere' },
      { question: 'Second Heaven: Where are the sun, moon, and stars? (Genesis 1:14-17)', hint: 'Outer space' },
      { question: 'Third Heaven: Where is God\'s throne? (Psalm 11:4; 2 Corinthians 12:2-4)' },
      { question: 'In prophetic language, what might "stars falling from heaven" represent?', scripture: 'Revelation 12:4' },
      { question: 'How does the Day of the Lord involve all three heavens?', scripture: '2 Peter 3:10-13' }
    ],
    keyInsight: '1H = atmosphere (physical, can symbolize religious/political air). 2H = space (can symbolize cosmic powers). 3H = God\'s throne (ultimate reality). Understanding these helps interpret prophecies about heavenly signs and the Day of the Lord.',
    practiceActivity: 'Find passages mentioning heaven and determine which of the three heavens is being referenced.',
    relatedPrinciples: ['Prophetic Symbolism', 'Second Coming', 'New Earth']
  },

  // DIMENSIONAL MASTERY
  {
    id: 'deep-dimensions-master',
    title: 'Mastering the Six Dimensions',
    level: 'deep',
    palacePrinciple: 'Complete Dimensional Analysis',
    principleDescription: 'Practice applying all six dimensions to a complex passage for maximum insight.',
    room: 'studies',
    introduction: 'Let\'s take a challenging passage and apply the full six-dimensional analysis that Phototheology offers.',
    focusScripture: 'Genesis 32:22-32 (Jacob Wrestling)',
    questions: [
      { question: 'LITERAL: Jacob wrestled all night with a "man" who dislocated his hip. What literally happened, and who was this man?', scripture: 'Hosea 12:3-4' },
      { question: 'CHRIST: Jesus wrestled in Gethsemane all night before facing His "Esau" (the mob). Compare Matthew 26:36-46. What parallels do you see?' },
      { question: 'PERSONAL: What night of wrestling have you experienced? What "hip" (self-reliance) did God have to touch?' },
      { question: 'CHURCH: The church faces a "Jacob\'s time of trouble" (Jeremiah 30:7). How does Jacob\'s experience preview the final crisis?' },
      { question: 'HEAVEN FUTURE: At the end of the millennium, the wicked ("Esaus") march against the New Jerusalem ("Jacobs"). Compare Revelation 20:7-9. How is this parallel?' },
      { question: 'HEAVEN PAST: Jacob struggled to hold onto God; Lucifer struggled to exalt himself against God. How are these two struggles contrasted?' }
    ],
    keyInsight: 'Jacob\'s wrestling is one of the richest six-dimensional passages. It\'s about surrender (personal), Gethsemane (Christ), end-time crisis (church), final deliverance (future), and shows the opposite of Lucifer\'s grasp for power (past). When we cling to God in helplessness, we prevail!',
    practiceActivity: 'Choose a challenging Old Testament narrative. Write a full six-dimensional analysis (one paragraph for each dimension).',
    relatedPrinciples: ['Jacob\'s Time of Trouble', 'Gethsemane', 'Final Crisis', 'Great Controversy']
  }
];

// ============================================
// STUDY LIBRARY EXPORT
// ============================================

export const allStudies: DailyStudy[] = [
  ...easyStudies,
  ...intermediateStudies,
  ...deepStudies
];

export const getStudiesByLevel = (level: StudyLevel): DailyStudy[] => {
  return allStudies.filter(study => study.level === level);
};

export const getStudyById = (id: string): DailyStudy | undefined => {
  return allStudies.find(study => study.id === id);
};

export const getStudyByPrinciple = (principle: string): DailyStudy[] => {
  return allStudies.filter(study =>
    study.palacePrinciple.toLowerCase().includes(principle.toLowerCase())
  );
};

export const getRandomStudy = (level?: StudyLevel): DailyStudy => {
  const pool = level ? getStudiesByLevel(level) : allStudies;
  return pool[Math.floor(Math.random() * pool.length)];
};

export const getTodaysStudy = (level: StudyLevel): DailyStudy => {
  // Use the current date to deterministically pick a study
  // This ensures the same study appears all day but changes the next day
  const today = new Date();
  const dayOfYear = Math.floor((today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / (1000 * 60 * 60 * 24));
  const levelStudies = getStudiesByLevel(level);
  const index = dayOfYear % levelStudies.length;
  return levelStudies[index];
};

// Study counts
export const studyCounts = {
  easy: easyStudies.length,
  intermediate: intermediateStudies.length,
  deep: deepStudies.length,
  total: allStudies.length
};
