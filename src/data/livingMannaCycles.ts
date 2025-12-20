// Living Manna 12 Six-Week Study Cycles
// Sanctuary-centered, Christ-exalting discipleship engine

export interface CycleWeek {
  weekNumber: number;
  title: string;
  theme: string;
  scriptureFocus: string[];
  outcome: string;
  coreQuestion: string;
  heartQuestion: string;
  lifeQuestion: string;
  missionQuestion: string;
  discussionQuestions: string[];
  ptRooms: string[];
  practicalApplication: string;
  prayerFocus: string;
}

export interface StudyCycle {
  id: string;
  sequenceNumber: number;
  title: string;
  description: string;
  icon: string;
  theme: string;
  sanctuaryFocus: string;
  goal: string;
  cycleType: string;
  ptRooms: string[];
  keyTexts: string[];
  weeks: CycleWeek[];
}

export const LIVING_MANNA_CYCLES: StudyCycle[] = [
  // CYCLE 1 — THE WAY INTO GOD'S PRESENCE
  {
    id: "cycle-1-presence",
    sequenceNumber: 1,
    title: "The Way Into God's Presence",
    description: "Conversion, surrender, and justification - learning to approach God on His terms through the altar and laver.",
    icon: "🔥",
    theme: "Conversion & Surrender",
    sanctuaryFocus: "Outer Court (Altar & Laver)",
    goal: "Conversion that sticks",
    cycleType: "character",
    ptRooms: ["CR", "OR", "FRm", "DR"],
    keyTexts: ["Exodus 12", "Leviticus 1", "Romans 6", "Hebrews 9-10"],
    weeks: [
      {
        weekNumber: 1,
        title: "God Is Holy, Not Casual",
        theme: "Divine Holiness",
        scriptureFocus: ["Isaiah 6:1-8", "Exodus 19:10-25", "Hebrews 12:28-29"],
        outcome: "Reverence replaces casual Christianity",
        coreQuestion: "What is God revealing about His holiness and our need for reverence?",
        heartQuestion: "Where have I approached God casually instead of reverently?",
        lifeQuestion: "How will I prepare my heart before approaching God this week?",
        missionQuestion: "Who needs to understand God's holiness?",
        discussionQuestions: [
          "Why did Isaiah respond with 'Woe is me' when he saw God?",
          "How does modern Christianity often minimize God's holiness?",
          "What changes when we truly grasp that God is holy?",
          "How can we cultivate holy reverence without becoming legalistic?"
        ],
        ptRooms: ["CR", "FRm", "OR"],
        practicalApplication: "Before each prayer this week, pause and acknowledge God's holiness",
        prayerFocus: "Lord, teach me to approach You with holy reverence"
      },
      {
        weekNumber: 2,
        title: "Substitution & the Cross",
        theme: "The Altar of Sacrifice",
        scriptureFocus: ["Leviticus 1:1-9", "Isaiah 53:4-6", "2 Corinthians 5:21"],
        outcome: "Sin is personal; grace is costly",
        coreQuestion: "What does substitutionary sacrifice reveal about God's justice and mercy?",
        heartQuestion: "Have I fully grasped that Christ died for my specific sins?",
        lifeQuestion: "What sin am I holding onto that was placed on Christ?",
        missionQuestion: "Who needs to understand the cost of grace?",
        discussionQuestions: [
          "Why did God require blood sacrifice in the Old Testament?",
          "How does Isaiah 53 personalize Christ's suffering?",
          "What does 'He made Him who knew no sin to be sin' mean for us?",
          "How does understanding substitution change how we view our sin?"
        ],
        ptRooms: ["BL", "ST", "CR", "DR"],
        practicalApplication: "Write out specific sins and thank Christ for bearing each one",
        prayerFocus: "Lord, help me comprehend the cost of my salvation"
      },
      {
        weekNumber: 3,
        title: "Repentance That Changes Direction",
        theme: "True Repentance",
        scriptureFocus: ["Psalm 51:1-17", "Proverbs 28:13", "Acts 3:19-21"],
        outcome: "Confession becomes transformation",
        coreQuestion: "What distinguishes true repentance from mere remorse?",
        heartQuestion: "Is my sorrow over sin about consequences or about grieving God?",
        lifeQuestion: "What direction change is God calling me to make?",
        missionQuestion: "Who am I avoiding reconciliation with?",
        discussionQuestions: [
          "What made David's repentance genuine according to Psalm 51?",
          "Why is 'covering sin' so destructive according to Proverbs 28:13?",
          "What does it mean that repentance brings 'times of refreshing'?",
          "How can we help others understand repentance without being judgmental?"
        ],
        ptRooms: ["FRm", "FRt", "MR"],
        practicalApplication: "Identify one area needing repentance and take concrete action",
        prayerFocus: "Create in me a clean heart, O God"
      },
      {
        weekNumber: 4,
        title: "Baptism & New Identity",
        theme: "Death to Self",
        scriptureFocus: ["Romans 6:1-11", "John 3:3-8", "Exodus 14:21-31"],
        outcome: "Old identity buried",
        coreQuestion: "What does dying with Christ and rising to new life mean practically?",
        heartQuestion: "What part of my old identity am I still clinging to?",
        lifeQuestion: "How will I live differently as someone dead to sin?",
        missionQuestion: "How can I share my testimony of new life?",
        discussionQuestions: [
          "How does Israel crossing the Red Sea picture baptism?",
          "What does 'our old self was crucified with Him' mean in daily life?",
          "Why is new birth necessary rather than just reformation?",
          "How should our new identity shape our daily decisions?"
        ],
        ptRooms: ["ST", "P‖", "BL", "CR"],
        practicalApplication: "Identify one old habit to 'bury' and one new practice to 'resurrect'",
        prayerFocus: "Lord, help me live in my new identity in Christ"
      },
      {
        weekNumber: 5,
        title: "Assurance Without Presumption",
        theme: "Security in Christ",
        scriptureFocus: ["Romans 8:31-39", "John 10:27-30", "1 John 5:11-13"],
        outcome: "Confidence without complacency",
        coreQuestion: "How do we have assurance of salvation without presuming on grace?",
        heartQuestion: "Do I doubt my salvation or presume upon it?",
        lifeQuestion: "What evidence of genuine faith marks my life?",
        missionQuestion: "Who struggles with assurance that I can encourage?",
        discussionQuestions: [
          "What makes believers' security so strong according to Romans 8?",
          "How do we distinguish assurance from presumption?",
          "What did John write so 'you may know you have eternal life'?",
          "How can we help someone who struggles with assurance?"
        ],
        ptRooms: ["DR", "CR", "FRt"],
        practicalApplication: "Journal three evidences of God's work in your life",
        prayerFocus: "Thank You, Lord, for the security I have in Christ"
      },
      {
        weekNumber: 6,
        title: "Walking in Grace Daily",
        theme: "Daily Dependence",
        scriptureFocus: ["Galatians 2:20-21", "Hebrews 4:14-16", "2 Corinthians 12:9-10"],
        outcome: "Dependence replaces striving",
        coreQuestion: "How does Christ living in us change how we face each day?",
        heartQuestion: "Where am I striving in my own strength instead of resting in grace?",
        lifeQuestion: "What will depending on grace look like tomorrow morning?",
        missionQuestion: "How can I model grace-dependence to others?",
        discussionQuestions: [
          "What does 'Christ lives in me' mean practically?",
          "Why is approaching the throne of grace boldly not presumptuous?",
          "How does weakness become strength in God's economy?",
          "What prevents us from living in daily grace?"
        ],
        ptRooms: ["CR", "FRm", "MR", "DR"],
        practicalApplication: "Begin each day this week consciously surrendering to Christ's life in you",
        prayerFocus: "Lord, live Your life through me today"
      }
    ]
  },

  // CYCLE 2 — CLEANSED TO SERVE
  {
    sequenceNumber: 2,
    title: "Cleansed to Serve",
    description: "Character transformation through the laver - breaking cycles of repeated defeat and walking in victory.",
    icon: "💧",
    theme: "Sanctification & Victory",
    sanctuaryFocus: "Laver → Holy Place threshold",
    goal: "Break cycles of repeated defeat",
    cycleType: "character",
    ptRooms: ["BL", "FRm", "FRt", "MR"],
    keyTexts: ["Psalm 51", "John 13", "Titus 3:5", "1 John 1"],
    weeks: [
      {
        weekNumber: 1,
        title: "Why Forgiven People Still Fall",
        theme: "Understanding Sin Nature",
        scriptureFocus: ["Romans 7:14-25", "Galatians 5:16-17", "1 John 1:8-10"],
        outcome: "Self-knowledge replaces denial",
        coreQuestion: "Why do believers still struggle with sin after conversion?",
        heartQuestion: "Where am I in denial about my weaknesses?",
        lifeQuestion: "What specific struggle do I need to honestly acknowledge?",
        missionQuestion: "How can I create safe space for others to be honest?",
        discussionQuestions: [
          "Why did Paul describe his struggle so honestly in Romans 7?",
          "What is the war between flesh and Spirit in Galatians 5?",
          "How does acknowledging sin differ from dwelling on it?",
          "What role does community play in honest self-assessment?"
        ],
        ptRooms: ["OR", "FRm", "QR"],
        practicalApplication: "Write honestly about one recurring struggle without excuses",
        prayerFocus: "Lord, give me honest self-awareness without condemnation"
      },
      {
        weekNumber: 2,
        title: "Cleansing the Mind",
        theme: "Thought Transformation",
        scriptureFocus: ["Romans 12:1-2", "Philippians 4:8-9", "2 Corinthians 10:3-5"],
        outcome: "Thought discipline",
        coreQuestion: "How does mind renewal produce life transformation?",
        heartQuestion: "What thoughts do I entertain that dishonor God?",
        lifeQuestion: "What will I think about instead when tempted?",
        missionQuestion: "How can I help others guard their minds?",
        discussionQuestions: [
          "What does 'renewing your mind' look like practically?",
          "How do we 'take every thought captive'?",
          "What role does what we consume play in our thought life?",
          "How do we replace negative thought patterns with truth?"
        ],
        ptRooms: ["TR", "OR", "FRm"],
        practicalApplication: "Memorize Philippians 4:8 and use it as a thought filter",
        prayerFocus: "Transform my thinking by Your Word, Lord"
      },
      {
        weekNumber: 3,
        title: "Habits, Not Hype",
        theme: "Faithful Practices",
        scriptureFocus: ["Daniel 1:8-21", "Luke 16:10-12", "1 Corinthians 9:24-27"],
        outcome: "Faithfulness in small things",
        coreQuestion: "How do small daily habits shape character more than big moments?",
        heartQuestion: "What small compromises am I making?",
        lifeQuestion: "What one daily habit will I commit to this week?",
        missionQuestion: "Who is watching my small habits?",
        discussionQuestions: [
          "Why did Daniel's small decision about food matter so much?",
          "What does faithfulness in little reveal about us?",
          "How do we discipline ourselves without legalism?",
          "What daily habits most shape spiritual formation?"
        ],
        ptRooms: ["OR", "PRm", "FRt"],
        practicalApplication: "Choose one small habit and track it daily for 21 days",
        prayerFocus: "Lord, make me faithful in the small things"
      },
      {
        weekNumber: 4,
        title: "The Spirit's Role in Victory",
        theme: "Spirit-Empowered Living",
        scriptureFocus: ["John 16:7-15", "Galatians 5:22-25", "Romans 8:11-14"],
        outcome: "Spirit-dependence",
        coreQuestion: "How does the Holy Spirit empower us to overcome?",
        heartQuestion: "Am I trying to be holy in my own strength?",
        lifeQuestion: "How will I cooperate with the Spirit this week?",
        missionQuestion: "How can I point others to the Spirit's power?",
        discussionQuestions: [
          "Why did Jesus say it was better for Him to go so the Spirit could come?",
          "What does 'walking in the Spirit' look like practically?",
          "How does the Spirit who raised Jesus live in us?",
          "What's the difference between human effort and Spirit-empowerment?"
        ],
        ptRooms: ["CR", "DR", "FRm"],
        practicalApplication: "Before each challenge this week, pause to ask the Spirit for help",
        prayerFocus: "Holy Spirit, empower me to walk in victory"
      },
      {
        weekNumber: 5,
        title: "Accountability Without Shame",
        theme: "Healthy Community",
        scriptureFocus: ["James 5:16", "Ecclesiastes 4:9-12", "Hebrews 3:12-13"],
        outcome: "Safe honesty",
        coreQuestion: "How do we create accountability that heals rather than shames?",
        heartQuestion: "Who knows my real struggles?",
        lifeQuestion: "Who will I invite into honest accountability?",
        missionQuestion: "How can I be a safe person for others?",
        discussionQuestions: [
          "Why does James connect confession with healing?",
          "What makes accountability helpful versus harmful?",
          "How do we exhort daily without being critical?",
          "What characteristics make someone safe to confess to?"
        ],
        ptRooms: ["LR", "FRt", "FRm"],
        practicalApplication: "Invite one trusted person into honest accountability",
        prayerFocus: "Lord, help me be vulnerable and be a safe place for others"
      },
      {
        weekNumber: 6,
        title: "Walking in the Light",
        theme: "Transparent Living",
        scriptureFocus: ["1 John 1:5-2:6", "Ephesians 5:8-14", "John 3:19-21"],
        outcome: "Integrity",
        coreQuestion: "What does it mean to live without hidden areas?",
        heartQuestion: "What am I keeping in darkness?",
        lifeQuestion: "What hidden thing will I bring into the light?",
        missionQuestion: "How can I help others walk in the light?",
        discussionQuestions: [
          "What does fellowship with God require according to 1 John 1?",
          "How do we 'live as children of light'?",
          "Why do people prefer darkness to light?",
          "What happens when we bring hidden things into the light?"
        ],
        ptRooms: ["BL", "FRm", "FRt", "CR"],
        practicalApplication: "Identify one hidden area and share it with a trusted person",
        prayerFocus: "Lord, make me a person of complete integrity"
      }
    ]
  },

  // CYCLE 3 — ILLUMINATED BY TRUTH
  {
    sequenceNumber: 3,
    title: "Illuminated by Truth",
    description: "Scripture mastery and discernment through the candlestick - becoming light bearers in a dark world.",
    icon: "🕯️",
    theme: "Scripture & Discernment",
    sanctuaryFocus: "Candlestick",
    goal: "Discernment in deception",
    cycleType: "bible_study",
    ptRooms: ["TR", "OR", "ST", "QR"],
    keyTexts: ["Psalm 119", "Matthew 4", "Revelation 1", "2 Timothy 3"],
    weeks: [
      {
        weekNumber: 1,
        title: "Why Truth Matters",
        theme: "Truth in the Last Days",
        scriptureFocus: ["John 17:17", "Amos 8:11-12", "2 Timothy 4:3-4"],
        outcome: "Hunger for truth",
        coreQuestion: "Why is truth more critical now than ever?",
        heartQuestion: "Do I truly hunger for truth or settle for what's comfortable?",
        lifeQuestion: "How will I prioritize truth-seeking this week?",
        missionQuestion: "Who needs me to share truth with them?",
        discussionQuestions: [
          "Why did Jesus pray that we would be sanctified by truth?",
          "What famine of truth exists in our world today?",
          "Why do people accumulate teachers who tickle their ears?",
          "How do we develop genuine hunger for truth?"
        ],
        ptRooms: ["OR", "QR", "PR"],
        practicalApplication: "Evaluate your information sources - do they point to biblical truth?",
        prayerFocus: "Lord, give me an insatiable hunger for Your truth"
      },
      {
        weekNumber: 2,
        title: "How to Study the Bible",
        theme: "Biblical Hermeneutics",
        scriptureFocus: ["Isaiah 28:9-10", "Acts 17:11", "2 Timothy 2:15"],
        outcome: "Skill development",
        coreQuestion: "What principles guide faithful Bible interpretation?",
        heartQuestion: "Am I lazy or diligent in my Bible study?",
        lifeQuestion: "What study skill will I develop this week?",
        missionQuestion: "Who can I teach to study the Bible?",
        discussionQuestions: [
          "What does 'line upon line, precept upon precept' mean for Bible study?",
          "Why were the Bereans called 'noble'?",
          "What does it mean to 'rightly divide the word of truth'?",
          "What study tools have you found most helpful?"
        ],
        ptRooms: ["OR", "DC", "QR", "C6"],
        practicalApplication: "Use one new study method (cross-references, original language, context)",
        prayerFocus: "Lord, make me a skilled student of Your Word"
      },
      {
        weekNumber: 3,
        title: "Scripture Interprets Scripture",
        theme: "Biblical Unity",
        scriptureFocus: ["Luke 24:27, 44-45", "2 Peter 1:20-21", "Hebrews 1:1-2"],
        outcome: "Confidence in the Word",
        coreQuestion: "How does the Bible interpret itself?",
        heartQuestion: "Do I trust the Bible to explain the Bible?",
        lifeQuestion: "How will I practice letting Scripture interpret Scripture?",
        missionQuestion: "How can I help others see the Bible's unity?",
        discussionQuestions: [
          "How did Jesus use Scripture to explain Himself?",
          "What does 'no prophecy is of private interpretation' mean?",
          "How does God speaking 'at many times and in many ways' show unity?",
          "Give an example of Scripture interpreting Scripture."
        ],
        ptRooms: ["QA", "P‖", "PRm", "C6"],
        practicalApplication: "Find three passages that interpret a difficult verse",
        prayerFocus: "Open my eyes to see wonderful things in Your law"
      },
      {
        weekNumber: 4,
        title: "Counterfeit Christianity",
        theme: "Spiritual Discernment",
        scriptureFocus: ["Matthew 7:15-23", "2 Corinthians 11:13-15", "1 John 4:1-6"],
        outcome: "Alertness to deception",
        coreQuestion: "How do we recognize spiritual counterfeits?",
        heartQuestion: "Am I vulnerable to deception in any area?",
        lifeQuestion: "What will I test against Scripture this week?",
        missionQuestion: "How can I help others develop discernment?",
        discussionQuestions: [
          "How do wolves dress in sheep's clothing today?",
          "Why does Satan transform himself into an angel of light?",
          "What tests does John give for discerning spirits?",
          "What counterfeits are most dangerous in our context?"
        ],
        ptRooms: ["ST", "PR", "QR", "3A"],
        practicalApplication: "Evaluate one teaching you've heard against Scripture",
        prayerFocus: "Lord, give me discernment to recognize deception"
      },
      {
        weekNumber: 5,
        title: "Light vs Emotion",
        theme: "Truth Over Feelings",
        scriptureFocus: ["Jeremiah 17:9", "Proverbs 14:12", "Isaiah 8:20"],
        outcome: "Stability in truth",
        coreQuestion: "Why must truth govern feelings rather than feelings govern truth?",
        heartQuestion: "Where do my emotions override Scripture?",
        lifeQuestion: "How will I anchor my decisions in truth, not feelings?",
        missionQuestion: "How can I help emotionally-driven people find stability?",
        discussionQuestions: [
          "Why is the heart 'deceitful above all things'?",
          "How can a way seem right yet lead to death?",
          "What does 'to the law and the testimony' mean practically?",
          "How do we honor emotions without being ruled by them?"
        ],
        ptRooms: ["OR", "FRm", "DR"],
        practicalApplication: "When emotions surge this week, ask 'What does Scripture say?'",
        prayerFocus: "Lord, ground my heart in truth, not shifting feelings"
      },
      {
        weekNumber: 6,
        title: "Becoming Light Bearers",
        theme: "Witness Through Truth",
        scriptureFocus: ["Matthew 5:14-16", "Revelation 1:12-20", "Philippians 2:14-16"],
        outcome: "Witness identity",
        coreQuestion: "How do we carry light to a dark world?",
        heartQuestion: "Am I shining or hiding my light?",
        lifeQuestion: "Where will I intentionally shine this week?",
        missionQuestion: "Who specifically needs my light?",
        discussionQuestions: [
          "What does it mean that we ARE light, not just have light?",
          "What do the seven lampstands in Revelation represent?",
          "How do we shine 'without grumbling or disputing'?",
          "What dims our light? What brightens it?"
        ],
        ptRooms: ["BL", "ST", "CR", "3A"],
        practicalApplication: "Identify one specific place to intentionally shine this week",
        prayerFocus: "Lord, let my light shine so others see You"
      }
    ]
  },

  // CYCLE 4 — LIVING BY EVERY WORD
  {
    sequenceNumber: 4,
    title: "Living by Every Word",
    description: "Christ our sustenance through the Table of Showbread - daily dependence and feeding others spiritually.",
    icon: "🍞",
    theme: "Daily Spiritual Nourishment",
    sanctuaryFocus: "Table of Showbread",
    goal: "Word-centered life",
    cycleType: "bible_study",
    ptRooms: ["BL", "CR", "MR", "SR"],
    keyTexts: ["John 6", "Exodus 25", "Matthew 4:4", "Acts 2"],
    weeks: [
      {
        weekNumber: 1,
        title: "Christ the Bread",
        theme: "Jesus as Sustenance",
        scriptureFocus: ["John 6:32-58", "Exodus 16:4-31", "Deuteronomy 8:3"],
        outcome: "Understanding Christ as our spiritual food",
        coreQuestion: "What does it mean to feed on Christ?",
        heartQuestion: "Am I spiritually hungry or spiritually satisfied?",
        lifeQuestion: "How will I 'eat' Christ's words this week?",
        missionQuestion: "Who is spiritually starving that I can feed?",
        discussionQuestions: [
          "Why did Jesus call Himself the 'bread of life'?",
          "How does manna picture Christ?",
          "What does living by 'every word' require?",
          "How do we practically 'eat' Christ?"
        ],
        ptRooms: ["ST", "BL", "CR", "P‖"],
        practicalApplication: "Read Scripture slowly, 'chewing' each phrase before moving on",
        prayerFocus: "Lord Jesus, be my daily bread"
      },
      {
        weekNumber: 2,
        title: "Daily Dependence",
        theme: "Fresh Manna Each Day",
        scriptureFocus: ["Exodus 16:14-21", "Lamentations 3:22-24", "Matthew 6:11"],
        outcome: "Daily discipline of receiving from God",
        coreQuestion: "Why does God provide fresh grace each day rather than all at once?",
        heartQuestion: "Am I gathering fresh manna or living on yesterday's grace?",
        lifeQuestion: "What will my daily manna-gathering look like?",
        missionQuestion: "How can I help others develop daily dependence?",
        discussionQuestions: [
          "Why couldn't Israel store manna overnight?",
          "What does 'His mercies are new every morning' mean for us?",
          "Why did Jesus teach us to pray for 'daily' bread?",
          "What prevents consistent daily time with God?"
        ],
        ptRooms: ["ST", "BL", "MR", "PRm"],
        practicalApplication: "Establish a non-negotiable daily time for Scripture",
        prayerFocus: "Lord, teach me daily dependence on You"
      },
      {
        weekNumber: 3,
        title: "Fellowship & Covenant",
        theme: "Community at the Table",
        scriptureFocus: ["Acts 2:42-47", "1 Corinthians 10:16-17", "Luke 22:14-20"],
        outcome: "Understanding fellowship as spiritual nourishment",
        coreQuestion: "How does community nourish our souls?",
        heartQuestion: "Am I deeply connected or spiritually isolated?",
        lifeQuestion: "How will I pursue deep fellowship this week?",
        missionQuestion: "Who needs to be invited to the table?",
        discussionQuestions: [
          "Why was breaking bread central to the early church?",
          "What does communion reveal about our unity?",
          "How did the Lord's Supper establish covenant?",
          "What makes fellowship spiritually nourishing?"
        ],
        ptRooms: ["BL", "P‖", "LR", "FRt"],
        practicalApplication: "Share a meal this week with intentional spiritual conversation",
        prayerFocus: "Lord, deepen my fellowship with Your people"
      },
      {
        weekNumber: 4,
        title: "Word Made Flesh",
        theme: "Incarnational Truth",
        scriptureFocus: ["John 1:1-14", "Hebrews 1:1-4", "Colossians 1:15-20"],
        outcome: "Seeing Christ as the ultimate revelation",
        coreQuestion: "How is Jesus the Word of God incarnate?",
        heartQuestion: "Do I see Jesus as clearly as I should in Scripture?",
        lifeQuestion: "How will I look for Christ in my reading this week?",
        missionQuestion: "How can I reveal the living Word to others?",
        discussionQuestions: [
          "What does 'the Word became flesh' mean?",
          "How is Jesus the 'exact imprint' of God's nature?",
          "Why is Jesus called 'the image of the invisible God'?",
          "How do we read the Bible Christologically?"
        ],
        ptRooms: ["CR", "ST", "DR", "C6"],
        practicalApplication: "Ask 'Where is Christ?' in every passage you read",
        prayerFocus: "Lord, reveal Yourself to me in Your Word"
      },
      {
        weekNumber: 5,
        title: "Feeding Others",
        theme: "Ministry of the Word",
        scriptureFocus: ["Matthew 10:7-8", "John 21:15-17", "Acts 6:2-4"],
        outcome: "Commissioning to feed others spiritually",
        coreQuestion: "How do we feed others what we've received?",
        heartQuestion: "Am I consuming truth or also sharing it?",
        lifeQuestion: "Who will I intentionally feed spiritually this week?",
        missionQuestion: "What spiritual food do those around me need?",
        discussionQuestions: [
          "Why did Jesus say 'freely you have received, freely give'?",
          "What did Jesus mean by 'feed my sheep'?",
          "Why did the apostles prioritize the ministry of the Word?",
          "How do we become feeders of others?"
        ],
        ptRooms: ["LR", "NF", "PF", "3A"],
        practicalApplication: "Share one insight from your study with someone this week",
        prayerFocus: "Lord, use me to feed Your sheep"
      },
      {
        weekNumber: 6,
        title: "Living Manna Culture",
        theme: "Word-Saturated Community",
        scriptureFocus: ["Deuteronomy 8:1-10", "Colossians 3:16", "Psalm 119:97-105"],
        outcome: "Building a Word-centered culture",
        coreQuestion: "What does a community look like that lives by every word?",
        heartQuestion: "Am I contributing to or detracting from Word-saturation in my community?",
        lifeQuestion: "How will I help build Living Manna culture?",
        missionQuestion: "How do we spread this culture beyond our group?",
        discussionQuestions: [
          "Why did God test Israel with manna for 40 years?",
          "What does 'let the word of Christ dwell in you richly' mean?",
          "Why did the psalmist meditate on God's law all day?",
          "What would a truly Word-centered community look like?"
        ],
        ptRooms: ["BL", "MR", "SR", "JR"],
        practicalApplication: "Create one practice that increases Word-saturation in your circle",
        prayerFocus: "Lord, saturate our community with Your Word"
      }
    ]
  },

  // CYCLE 5 — THE ALTAR OF PRAYER
  {
    sequenceNumber: 5,
    title: "The Altar of Prayer",
    description: "Intercession and spiritual warfare at the Altar of Incense - becoming prayer warriors, not just prayer requesters.",
    icon: "🔥",
    theme: "Prayer & Intercession",
    sanctuaryFocus: "Altar of Incense",
    goal: "Prayer warriors, not prayer requests",
    cycleType: "character",
    ptRooms: ["BL", "FRm", "MR", "PR"],
    keyTexts: ["Revelation 8", "Hebrews 7", "Daniel 9-10", "Luke 18"],
    weeks: [
      {
        weekNumber: 1,
        title: "Why Prayer Moves Heaven",
        theme: "Power of Prayer",
        scriptureFocus: ["Revelation 8:3-5", "James 5:16-18", "Matthew 7:7-11"],
        outcome: "Confidence in prayer's power",
        coreQuestion: "How does prayer actually move heaven?",
        heartQuestion: "Do I really believe my prayers make a difference?",
        lifeQuestion: "What will I pray for boldly this week?",
        missionQuestion: "Who needs my intercessory prayers?",
        discussionQuestions: [
          "How do our prayers connect to the heavenly altar?",
          "What made Elijah's prayers so effective?",
          "Why does Jesus encourage persistent asking?",
          "What limits the power of our prayers?"
        ],
        ptRooms: ["BL", "ST", "FRm"],
        practicalApplication: "Keep a prayer journal tracking requests and answers",
        prayerFocus: "Lord, teach me to pray with power"
      },
      {
        weekNumber: 2,
        title: "Christ's Intercessory Ministry",
        theme: "Our High Priest",
        scriptureFocus: ["Hebrews 7:23-28", "Romans 8:34", "1 John 2:1-2"],
        outcome: "Confidence in Christ's intercession",
        coreQuestion: "What is Christ doing for us right now in heaven?",
        heartQuestion: "Do I access Christ's intercession in my prayers?",
        lifeQuestion: "How will I consciously pray through Christ this week?",
        missionQuestion: "How can I share this truth with struggling believers?",
        discussionQuestions: [
          "Why does Jesus 'always live to make intercession'?",
          "What does it mean that Christ is 'at the right hand of God'?",
          "How does having an 'advocate with the Father' change our prayer?",
          "How do we access Christ's intercession?"
        ],
        ptRooms: ["BL", "CR", "ST", "DR"],
        practicalApplication: "Begin prayers by thanking Christ for His intercession",
        prayerFocus: "Thank You, Lord Jesus, for interceding for me"
      },
      {
        weekNumber: 3,
        title: "Praying in Alignment",
        theme: "God's Will in Prayer",
        scriptureFocus: ["1 John 5:14-15", "Matthew 6:9-13", "John 15:7"],
        outcome: "Prayers aligned with God's will",
        coreQuestion: "How do we pray according to God's will?",
        heartQuestion: "Are my prayers self-focused or kingdom-focused?",
        lifeQuestion: "What Scripture will guide my prayers this week?",
        missionQuestion: "How can I help others pray according to God's will?",
        discussionQuestions: [
          "What confidence do we have when praying according to His will?",
          "How does the Lord's Prayer model kingdom priorities?",
          "How does abiding in Christ affect our prayer requests?",
          "How do we discern God's will for prayer?"
        ],
        ptRooms: ["CR", "MR", "DR", "QA"],
        practicalApplication: "Pray through one Scripture passage, turning it into prayer",
        prayerFocus: "Lord, align my prayers with Your will"
      },
      {
        weekNumber: 4,
        title: "Spiritual Warfare",
        theme: "Battle in Prayer",
        scriptureFocus: ["Daniel 10:1-14", "Ephesians 6:10-20", "2 Corinthians 10:3-5"],
        outcome: "Understanding prayer as warfare",
        coreQuestion: "What opposition do our prayers face in the spiritual realm?",
        heartQuestion: "Am I aware of the spiritual battle in my prayer life?",
        lifeQuestion: "How will I pray with warfare awareness this week?",
        missionQuestion: "Who needs prayer warriors fighting for them?",
        discussionQuestions: [
          "What delayed Daniel's answer for 21 days?",
          "Why must we put on armor to pray?",
          "How do our weapons 'pull down strongholds'?",
          "How do we engage in spiritual warfare appropriately?"
        ],
        ptRooms: ["PR", "ST", "FRm", "DR"],
        practicalApplication: "Pray with eyes open to the spiritual battle",
        prayerFocus: "Lord, strengthen me for spiritual warfare"
      },
      {
        weekNumber: 5,
        title: "Corporate Prayer & Revival",
        theme: "United Prayer",
        scriptureFocus: ["Acts 4:23-31", "2 Chronicles 7:14", "Matthew 18:19-20"],
        outcome: "Power of united prayer",
        coreQuestion: "What happens when believers pray together?",
        heartQuestion: "Am I committed to corporate prayer or just individual?",
        lifeQuestion: "How will I engage in corporate prayer this week?",
        missionQuestion: "How can we mobilize prayer for our community?",
        discussionQuestions: [
          "What happened when the early church prayed together?",
          "What conditions does God give for healing the land?",
          "What does Jesus promise when two or three agree?",
          "Why is corporate prayer often more powerful than individual?"
        ],
        ptRooms: ["LR", "FRm", "P‖", "3A"],
        practicalApplication: "Initiate or join a group prayer time this week",
        prayerFocus: "Lord, unite us in powerful prayer"
      },
      {
        weekNumber: 6,
        title: "End-Time Prayer Power",
        theme: "Prayer in the Last Days",
        scriptureFocus: ["Luke 18:1-8", "Revelation 5:8", "Zechariah 12:10"],
        outcome: "Prepared for end-time intercession",
        coreQuestion: "What role does prayer play in the last days?",
        heartQuestion: "Am I developing the prayer life needed for end times?",
        lifeQuestion: "How will I develop persistent prayer habits?",
        missionQuestion: "How do we mobilize end-time prayer warriors?",
        discussionQuestions: [
          "Why does Jesus tell the persistent widow parable before His return?",
          "How are saints' prayers portrayed in Revelation?",
          "What is the 'spirit of grace and supplication' poured out?",
          "How should we pray for Christ's return?"
        ],
        ptRooms: ["PR", "3A", "FRm", "MR"],
        practicalApplication: "Develop a daily prayer time focused on Christ's return",
        prayerFocus: "Even so, come Lord Jesus"
      }
    ]
  },

  // CYCLE 6 — LAW, MERCY, AND THE HEART
  {
    sequenceNumber: 6,
    title: "Law, Mercy, and the Heart",
    description: "Understanding God's moral government through the Ark of the Covenant - obedience from love, not legalism.",
    icon: "🧠",
    theme: "God's Law & Character",
    sanctuaryFocus: "Ark of the Covenant",
    goal: "Obedience from love",
    cycleType: "doctrine",
    ptRooms: ["BL", "CR", "DR", "ST"],
    keyTexts: ["Exodus 20", "Psalm 40", "Hebrews 8", "Revelation 11"],
    weeks: [
      {
        weekNumber: 1,
        title: "Law vs Legalism",
        theme: "Right Understanding of Law",
        scriptureFocus: ["Romans 3:31", "Galatians 3:21-25", "Matthew 5:17-20"],
        outcome: "Distinguishing law from legalism",
        coreQuestion: "What is the proper relationship between law and grace?",
        heartQuestion: "Do I lean toward lawlessness or legalism?",
        lifeQuestion: "How will I pursue obedience without legalism this week?",
        missionQuestion: "How can I help others understand this balance?",
        discussionQuestions: [
          "How does faith 'establish' the law?",
          "What was the law's purpose as a 'schoolmaster'?",
          "What did Jesus mean by coming to 'fulfill' the law?",
          "What distinguishes obedience from legalism?"
        ],
        ptRooms: ["DC", "CR", "QR", "DR"],
        practicalApplication: "Examine one command and obey it from love, not obligation",
        prayerFocus: "Lord, write Your law on my heart"
      },
      {
        weekNumber: 2,
        title: "The Ten Commandments in Christ",
        theme: "Christ and the Law",
        scriptureFocus: ["Exodus 20:1-17", "Matthew 22:36-40", "Romans 13:8-10"],
        outcome: "Seeing Christ in the commandments",
        coreQuestion: "How does Christ fulfill and embody the Ten Commandments?",
        heartQuestion: "Do I see the commandments as restrictions or revelations of love?",
        lifeQuestion: "Which commandment will I focus on embodying this week?",
        missionQuestion: "How do I present the law as good news?",
        discussionQuestions: [
          "How do the Ten Commandments reveal God's character?",
          "How are all commandments summarized in love?",
          "Why is love the 'fulfillment' of the law?",
          "How does each commandment point to Christ?"
        ],
        ptRooms: ["BL", "CR", "ST", "DR"],
        practicalApplication: "Meditate on each commandment as an expression of God's love",
        prayerFocus: "Lord, teach me to love as You love through obedience"
      },
      {
        weekNumber: 3,
        title: "The Sabbath as Rest & Loyalty",
        theme: "Sabbath Truth",
        scriptureFocus: ["Genesis 2:1-3", "Exodus 20:8-11", "Mark 2:27-28", "Hebrews 4:9-11"],
        outcome: "Understanding Sabbath as gift and sign",
        coreQuestion: "What does the Sabbath reveal about our relationship with God?",
        heartQuestion: "Is my Sabbath-keeping rest or ritual?",
        lifeQuestion: "How will I enter Sabbath rest more fully this week?",
        missionQuestion: "How do I share Sabbath truth lovingly?",
        discussionQuestions: [
          "Why did God rest on the seventh day?",
          "How is Sabbath made 'for man'?",
          "What 'Sabbath rest' remains for God's people?",
          "How does Sabbath demonstrate loyalty to the Creator?"
        ],
        ptRooms: ["BL", "ST", "CR", "P‖"],
        practicalApplication: "Plan your Sabbath as a delight, not a duty",
        prayerFocus: "Lord, teach me true Sabbath rest"
      },
      {
        weekNumber: 4,
        title: "Grace Empowers Obedience",
        theme: "Grace and Works",
        scriptureFocus: ["Titus 2:11-14", "Philippians 2:12-13", "Ephesians 2:8-10"],
        outcome: "Understanding how grace produces obedience",
        coreQuestion: "How does grace enable what law demands?",
        heartQuestion: "Am I depending on grace to obey?",
        lifeQuestion: "Where do I need grace to empower obedience?",
        missionQuestion: "How do I teach grace without promoting license?",
        discussionQuestions: [
          "How does grace 'teach us' to live godly?",
          "What does 'work out your salvation' mean if we're saved by grace?",
          "How are we God's 'workmanship created for good works'?",
          "How do grace and works fit together?"
        ],
        ptRooms: ["CR", "DR", "FRt", "QA"],
        practicalApplication: "Ask for grace before attempting obedience in a weak area",
        prayerFocus: "Lord, empower my obedience by Your grace"
      },
      {
        weekNumber: 5,
        title: "Judgment as Good News",
        theme: "Divine Judgment",
        scriptureFocus: ["Ecclesiastes 12:13-14", "Romans 2:5-11", "Revelation 14:6-7"],
        outcome: "Understanding judgment positively",
        coreQuestion: "Why is God's judgment good news for believers?",
        heartQuestion: "Do I fear judgment or welcome it?",
        lifeQuestion: "How does coming judgment affect my choices today?",
        missionQuestion: "How do I present judgment as good news?",
        discussionQuestions: [
          "Why is keeping commandments the 'whole duty of man'?",
          "What determines the outcome of judgment?",
          "Why does the first angel message call us to 'fear God'?",
          "How is judgment good news for the oppressed?"
        ],
        ptRooms: ["PR", "3A", "BL", "DR"],
        practicalApplication: "Examine your life in light of judgment with confidence in Christ",
        prayerFocus: "Lord, prepare me for the judgment hour"
      },
      {
        weekNumber: 6,
        title: "God's Character Revealed",
        theme: "Law as Revelation",
        scriptureFocus: ["Exodus 34:5-7", "Psalm 119:137-144", "1 John 4:7-12"],
        outcome: "Seeing God's character in His law",
        coreQuestion: "How does the law reveal who God is?",
        heartQuestion: "What has the law taught me about God's heart?",
        lifeQuestion: "How will I reflect God's character this week?",
        missionQuestion: "How can I reveal God's character to others?",
        discussionQuestions: [
          "What did God's self-revelation to Moses emphasize?",
          "Why is God's righteousness 'everlasting righteousness'?",
          "How does keeping God's commands connect to loving others?",
          "How does law show us what God is like?"
        ],
        ptRooms: ["CR", "BL", "FRt", "DR"],
        practicalApplication: "Study one of God's attributes and let it shape your actions",
        prayerFocus: "Lord, reveal Your character through me"
      }
    ]
  },

  // CYCLE 7 — THE DAY OF ATONEMENT PEOPLE
  {
    sequenceNumber: 7,
    title: "The Day of Atonement People",
    description: "Understanding judgment, repentance, and sealing in the Most Holy Place - becoming a prepared people.",
    icon: "🩸",
    theme: "Judgment & Preparation",
    sanctuaryFocus: "Most Holy Place",
    goal: "Judgment-ready saints",
    cycleType: "prophecy",
    ptRooms: ["BL", "PR", "3A", "FRm"],
    keyTexts: ["Leviticus 16", "Daniel 7-8", "Revelation 14", "Hebrews 9"],
    weeks: [
      {
        weekNumber: 1,
        title: "What the Investigative Judgment Really Is",
        theme: "Pre-Advent Judgment",
        scriptureFocus: ["Daniel 7:9-14", "Daniel 8:14", "Revelation 14:6-7"],
        outcome: "Understanding the judgment now in session",
        coreQuestion: "What is happening in heaven right now?",
        heartQuestion: "Am I living as one whose case is before God?",
        lifeQuestion: "How does knowing judgment is happening affect my daily life?",
        missionQuestion: "How do I explain this judgment to others?",
        discussionQuestions: [
          "What do the thrones and Ancient of Days represent in Daniel 7?",
          "When would the sanctuary be 'cleansed' (justified)?",
          "Why announce 'the hour of His judgment has come'?",
          "What does investigative judgment reveal about God's fairness?"
        ],
        ptRooms: ["PR", "BL", "ST", "TZ"],
        practicalApplication: "Live this week aware that your life is an open book to God",
        prayerFocus: "Lord, prepare me for the judgment"
      },
      {
        weekNumber: 2,
        title: "Afflicting the Soul Biblically",
        theme: "Heart Preparation",
        scriptureFocus: ["Leviticus 16:29-31", "Joel 2:12-17", "Psalm 51:16-17"],
        outcome: "Deep heart work, not external show",
        coreQuestion: "What does genuine heart-searching look like?",
        heartQuestion: "Is my repentance deep or superficial?",
        lifeQuestion: "What soul-searching will I do this week?",
        missionQuestion: "How can I help others do genuine heart work?",
        discussionQuestions: [
          "What did 'afflicting the soul' mean on Day of Atonement?",
          "How do we 'rend our hearts and not our garments'?",
          "What kind of sacrifice does God truly desire?",
          "What prevents deep heart-searching?"
        ],
        ptRooms: ["FRm", "MR", "BL", "FRt"],
        practicalApplication: "Set aside time for serious self-examination before God",
        prayerFocus: "Search me, O God, and know my heart"
      },
      {
        weekNumber: 3,
        title: "Christ Our Advocate",
        theme: "Divine Representation",
        scriptureFocus: ["1 John 2:1-2", "Hebrews 9:24", "Zechariah 3:1-5"],
        outcome: "Confidence in Christ's advocacy",
        coreQuestion: "How does Christ represent us in the judgment?",
        heartQuestion: "Am I trusting in Christ's advocacy or my own merit?",
        lifeQuestion: "How will I access Christ's advocacy this week?",
        missionQuestion: "How do I share the good news of Christ's advocacy?",
        discussionQuestions: [
          "What does having an 'advocate with the Father' mean in judgment?",
          "How did Christ appear 'in the presence of God for us'?",
          "How did Joshua's filthy garments become clean?",
          "What confidence does Christ's advocacy give us?"
        ],
        ptRooms: ["BL", "CR", "ST", "P‖"],
        practicalApplication: "When accused by Satan or conscience, claim Christ's advocacy",
        prayerFocus: "Thank You, Lord Jesus, for standing as my Advocate"
      },
      {
        weekNumber: 4,
        title: "Overcoming Through the Blood",
        theme: "Victory in Christ",
        scriptureFocus: ["Revelation 12:10-11", "Romans 8:31-37", "1 John 5:4-5"],
        outcome: "Practical victory strategies",
        coreQuestion: "How do we overcome in the judgment context?",
        heartQuestion: "What am I still losing to that I should be overcoming?",
        lifeQuestion: "What victory will I claim through Christ this week?",
        missionQuestion: "How can I help others experience victory?",
        discussionQuestions: [
          "How do we overcome by 'the blood of the Lamb'?",
          "What does 'more than conquerors' mean?",
          "What is the victory that overcomes the world?",
          "How do we balance human effort and divine empowerment?"
        ],
        ptRooms: ["CR", "FRm", "FRt", "DR"],
        practicalApplication: "Claim the blood of the Lamb over one specific stronghold",
        prayerFocus: "Lord, through Your blood, give me victory"
      },
      {
        weekNumber: 5,
        title: "The Sealing Work",
        theme: "God's Final Seal",
        scriptureFocus: ["Revelation 7:1-4", "Ezekiel 9:1-6", "Ephesians 4:30"],
        outcome: "Understanding and seeking the seal",
        coreQuestion: "What is the seal of God and how do we receive it?",
        heartQuestion: "Is the seal being formed in my character?",
        lifeQuestion: "What character development am I pursuing this week?",
        missionQuestion: "How do I teach sealing truth appropriately?",
        discussionQuestions: [
          "Who are the 144,000 sealed in Revelation 7?",
          "What marked the people in Ezekiel 9?",
          "How do we avoid 'grieving the Holy Spirit'?",
          "What is the relationship between sealing and the Sabbath?"
        ],
        ptRooms: ["PR", "3A", "ST", "BL"],
        practicalApplication: "Surrender one area for the Spirit to seal Christ's character in you",
        prayerFocus: "Lord, seal me among Your faithful"
      },
      {
        weekNumber: 6,
        title: "Preparing for Christ's Return",
        theme: "Ready to Meet Him",
        scriptureFocus: ["Matthew 24:42-51", "2 Peter 3:11-14", "1 John 3:2-3"],
        outcome: "Practical preparation for the Second Coming",
        coreQuestion: "How do we live as people expecting Christ's return?",
        heartQuestion: "If Christ returned today, would I be ready?",
        lifeQuestion: "What preparation work will I do this week?",
        missionQuestion: "How urgently am I helping others prepare?",
        discussionQuestions: [
          "Why must we 'watch' for Christ's return?",
          "What kind of people should we be in light of the end?",
          "How does hope of seeing Christ purify us?",
          "What does active waiting look like?"
        ],
        ptRooms: ["PR", "3A", "FRm", "SR"],
        practicalApplication: "Live each day this week as if Christ might return tomorrow",
        prayerFocus: "Lord, make me ready to meet You"
      }
    ]
  },

  // CYCLE 8 — THE THREE ANGELS' MESSAGES
  {
    sequenceNumber: 8,
    title: "The Three Angels' Messages",
    description: "Final gospel proclamation across the full sanctuary cycle - living and sharing the everlasting gospel.",
    icon: "📯",
    theme: "End-Time Gospel",
    sanctuaryFocus: "Full Sanctuary Cycle",
    goal: "Mission clarity",
    cycleType: "prophecy",
    ptRooms: ["3A", "PR", "BL", "CR"],
    keyTexts: ["Revelation 14:6-12", "Matthew 24", "Isaiah 58", "Revelation 18"],
    weeks: [
      {
        weekNumber: 1,
        title: "The Everlasting Gospel",
        theme: "Eternal Good News",
        scriptureFocus: ["Revelation 14:6-7", "Romans 1:16-17", "Galatians 1:6-9"],
        outcome: "Understanding the gospel is unchanged and urgent",
        coreQuestion: "Why is the gospel called 'everlasting'?",
        heartQuestion: "Is my gospel the true everlasting gospel?",
        lifeQuestion: "How will I live and share the gospel this week?",
        missionQuestion: "Who needs to hear the everlasting gospel from me?",
        discussionQuestions: [
          "Why does the first angel proclaim the 'everlasting' gospel?",
          "Why is the gospel 'the power of God unto salvation'?",
          "What 'different gospels' did Paul warn against?",
          "How do we ensure we're preaching the true gospel?"
        ],
        ptRooms: ["3A", "CR", "DR", "C6"],
        practicalApplication: "Articulate the gospel in one minute and share it with someone",
        prayerFocus: "Lord, help me live and share Your everlasting gospel"
      },
      {
        weekNumber: 2,
        title: "Fear God & Give Glory",
        theme: "True Worship",
        scriptureFocus: ["Revelation 14:7", "Ecclesiastes 12:13-14", "1 Corinthians 10:31"],
        outcome: "All-of-life worship",
        coreQuestion: "What does it mean to fear God and give Him glory?",
        heartQuestion: "Does my life give God glory or steal it?",
        lifeQuestion: "How will I give God glory in everything this week?",
        missionQuestion: "How do I help others understand true worship?",
        discussionQuestions: [
          "What kind of 'fear' is appropriate toward God?",
          "How do we give glory to God in all we do?",
          "Why does the first angel call us to 'worship Him who made'?",
          "How has creation worship been abandoned in our culture?"
        ],
        ptRooms: ["3A", "BL", "CR", "FRt"],
        practicalApplication: "Do everything this week consciously 'to the glory of God'",
        prayerFocus: "Lord, may my whole life bring You glory"
      },
      {
        weekNumber: 3,
        title: "Babylon Exposed",
        theme: "False Religious System",
        scriptureFocus: ["Revelation 14:8", "Revelation 17:1-6", "Revelation 18:1-4"],
        outcome: "Understanding Babylon's deceptions",
        coreQuestion: "What is Babylon and why has it fallen?",
        heartQuestion: "Am I influenced by Babylon's thinking?",
        lifeQuestion: "What Babylonian influence will I reject this week?",
        missionQuestion: "How do I help others recognize Babylon without attacking?",
        discussionQuestions: [
          "What does 'Babylon' represent prophetically?",
          "What is the 'wine of her fornication'?",
          "Why does God call His people to 'come out'?",
          "How do we share this truth with love?"
        ],
        ptRooms: ["PR", "3A", "ST", "P‖"],
        practicalApplication: "Identify and reject one Babylonian influence in your life",
        prayerFocus: "Lord, separate me completely from Babylon's system"
      },
      {
        weekNumber: 4,
        title: "The Mark Clarified",
        theme: "Beast vs Lamb",
        scriptureFocus: ["Revelation 14:9-11", "Revelation 13:15-17", "Revelation 7:1-4"],
        outcome: "Understanding the mark issue clearly",
        coreQuestion: "What is the mark of the beast and how do we avoid it?",
        heartQuestion: "Am I developing God's character or the world's?",
        lifeQuestion: "How will I strengthen my loyalty to God this week?",
        missionQuestion: "How do I explain the mark without sensationalism?",
        discussionQuestions: [
          "What does receiving the mark mean?",
          "How does the mark contrast with God's seal?",
          "Why is the warning against the mark so severe?",
          "What is the real issue behind the mark?"
        ],
        ptRooms: ["PR", "3A", "ST", "TZ"],
        practicalApplication: "Strengthen your commitment to God's authority in one area",
        prayerFocus: "Lord, seal me with Your character, not the world's"
      },
      {
        weekNumber: 5,
        title: "Commandment-Keeping Faith",
        theme: "Faith That Works",
        scriptureFocus: ["Revelation 14:12", "James 2:14-26", "Hebrews 11:1-6"],
        outcome: "Understanding the remnant's characteristics",
        coreQuestion: "What distinguishes the end-time saints?",
        heartQuestion: "Do I have both faith and obedience?",
        lifeQuestion: "How will I live faith that keeps commandments this week?",
        missionQuestion: "How do I present this balance to others?",
        discussionQuestions: [
          "What are the two marks of end-time saints in Revelation 14:12?",
          "How is faith 'dead' without works?",
          "What does living by faith look like?",
          "How do we avoid both legalism and lawlessness?"
        ],
        ptRooms: ["3A", "CR", "DR", "FRt"],
        practicalApplication: "Practice obedience as expression of faith in one specific area",
        prayerFocus: "Lord, give me the faith that produces obedience"
      },
      {
        weekNumber: 6,
        title: "Living the Message",
        theme: "Being the Message",
        scriptureFocus: ["Matthew 28:18-20", "Acts 1:8", "2 Corinthians 3:2-3"],
        outcome: "Becoming the message we proclaim",
        coreQuestion: "How do we embody the three angels' messages?",
        heartQuestion: "Am I a living message or just a talking messenger?",
        lifeQuestion: "How will I be the message this week?",
        missionQuestion: "What's my personal mission strategy?",
        discussionQuestions: [
          "Why must we 'make disciples' not just converts?",
          "How are we 'witnesses' not just teachers?",
          "What does being a 'living epistle' mean?",
          "How do we incarnate the message we proclaim?"
        ],
        ptRooms: ["3A", "NF", "PF", "FRt"],
        practicalApplication: "Identify one person to intentionally share your life and faith with",
        prayerFocus: "Lord, make me a living proclamation of Your truth"
      }
    ]
  },

  // CYCLE 9 — FOLLOWING THE LAMB
  {
    sequenceNumber: 9,
    title: "Following the Lamb",
    description: "Christ-centered discipleship finding Christ in every sanctuary article - full surrender and cross-bearing.",
    icon: "🐑",
    theme: "Radical Discipleship",
    sanctuaryFocus: "Christ in Every Article",
    goal: "Christlikeness",
    cycleType: "character",
    ptRooms: ["CR", "FRm", "FRt", "MR"],
    keyTexts: ["Luke 9", "John 15", "Revelation 14:4", "Philippians 3"],
    weeks: [
      {
        weekNumber: 1,
        title: "What It Means to Follow",
        theme: "True Discipleship",
        scriptureFocus: ["Luke 9:23-26", "Mark 1:16-20", "John 12:26"],
        outcome: "Understanding the call to follow",
        coreQuestion: "What does Jesus mean by 'follow me'?",
        heartQuestion: "Am I following Jesus or just admiring Him?",
        lifeQuestion: "What will following Jesus cost me this week?",
        missionQuestion: "Who am I calling to follow with me?",
        discussionQuestions: [
          "What are the three requirements in Luke 9:23?",
          "What did the disciples leave to follow Jesus?",
          "What does 'where I am, my servant will be' mean?",
          "What does following look like in your context?"
        ],
        ptRooms: ["CR", "FRm", "OR", "DR"],
        practicalApplication: "Identify one thing you need to 'leave' to follow more fully",
        prayerFocus: "Lord, I will follow wherever You lead"
      },
      {
        weekNumber: 2,
        title: "Self-Denial & Cross-Bearing",
        theme: "Death to Self",
        scriptureFocus: ["Galatians 2:20", "Luke 14:25-33", "Romans 6:6-11"],
        outcome: "Practical crucifixion of self",
        coreQuestion: "What does daily cross-bearing look like?",
        heartQuestion: "Where is self still on the throne?",
        lifeQuestion: "What part of self will I crucify this week?",
        missionQuestion: "How do I help others understand self-denial?",
        discussionQuestions: [
          "What does 'I have been crucified with Christ' mean daily?",
          "Why must we 'hate' family to follow Jesus?",
          "How has our 'old self been crucified'?",
          "What's the difference between self-denial and self-destruction?"
        ],
        ptRooms: ["FRm", "CR", "BL", "P‖"],
        practicalApplication: "Say 'no' to self in one area where you've been saying 'yes'",
        prayerFocus: "Lord, crucify self and live Your life through me"
      },
      {
        weekNumber: 3,
        title: "Obedience Flowing from Love",
        theme: "Loving Obedience",
        scriptureFocus: ["John 14:15, 21, 23-24", "1 John 5:2-3", "Deuteronomy 6:4-9"],
        outcome: "Obedience as expression of love",
        coreQuestion: "How does love produce obedience?",
        heartQuestion: "Is my obedience duty or delight?",
        lifeQuestion: "How will I obey from love this week?",
        missionQuestion: "How do I model loving obedience to others?",
        discussionQuestions: [
          "Why does Jesus connect love with keeping His commands?",
          "How are God's commands 'not burdensome'?",
          "How does 'love the Lord your God' produce obedience?",
          "How do we transform duty into delight?"
        ],
        ptRooms: ["CR", "FRt", "MR", "DR"],
        practicalApplication: "Obey one difficult command consciously as an act of love",
        prayerFocus: "Lord, I obey because I love You"
      },
      {
        weekNumber: 4,
        title: "Faith That Works",
        theme: "Active Faith",
        scriptureFocus: ["James 2:14-26", "Hebrews 11:1-40", "Ephesians 2:8-10"],
        outcome: "Faith demonstrated in action",
        coreQuestion: "How does genuine faith produce works?",
        heartQuestion: "Is my faith producing fruit?",
        lifeQuestion: "What work of faith will I do this week?",
        missionQuestion: "How do I help others move from belief to action?",
        discussionQuestions: [
          "How is faith without works 'dead'?",
          "What did Hebrews 11 heroes do by faith?",
          "How are we 'created for good works'?",
          "How do we avoid both dead faith and works-righteousness?"
        ],
        ptRooms: ["FRt", "PRm", "CR", "P‖"],
        practicalApplication: "Take one step of faith-action that requires trust",
        prayerFocus: "Lord, give me faith that acts"
      },
      {
        weekNumber: 5,
        title: "The Remnant Identity",
        theme: "Who We Are",
        scriptureFocus: ["Revelation 12:17", "Isaiah 11:10-16", "Romans 9:27-29"],
        outcome: "Understanding remnant identity",
        coreQuestion: "What does it mean to be part of the remnant?",
        heartQuestion: "Do I have remnant character or just remnant doctrine?",
        lifeQuestion: "How will I live as remnant this week?",
        missionQuestion: "How do I present remnant identity without arrogance?",
        discussionQuestions: [
          "What identifies the remnant in Revelation 12:17?",
          "Why does God always preserve a remnant?",
          "What does Isaiah's remnant look like?",
          "How do we hold remnant identity with humility?"
        ],
        ptRooms: ["PR", "3A", "CR", "ST"],
        practicalApplication: "Examine whether your life matches remnant characteristics",
        prayerFocus: "Lord, make me worthy of remnant calling"
      },
      {
        weekNumber: 6,
        title: "End-Time Character",
        theme: "Prepared People",
        scriptureFocus: ["Revelation 14:1-5", "Malachi 3:16-18", "2 Peter 3:11-14"],
        outcome: "Developing character for the end",
        coreQuestion: "What character marks those who stand at the end?",
        heartQuestion: "Is this character being formed in me?",
        lifeQuestion: "What character development am I pursuing?",
        missionQuestion: "How do I help others prepare?",
        discussionQuestions: [
          "What characterizes the 144,000?",
          "What distinguishes God's 'jewels' in Malachi?",
          "What kind of people should we be?",
          "How do we actively develop end-time character?"
        ],
        ptRooms: ["FRt", "3A", "CR", "MR"],
        practicalApplication: "Choose one character trait to consciously develop",
        prayerFocus: "Lord, complete Your work of character in me"
      }
    ]
  },

  // CYCLE 10 — MISSION IN A DIGITAL BABYLON
  {
    sequenceNumber: 10,
    title: "Mission in a Digital Babylon",
    description: "Evangelism and cultural engagement with the light going outward - reaching the world through digital mission.",
    icon: "🌍",
    theme: "Digital Evangelism",
    sanctuaryFocus: "Light Going Outward",
    goal: "Evangelists, not consumers",
    cycleType: "doctrine",
    ptRooms: ["3A", "NF", "HF", "LR"],
    keyTexts: ["Revelation 18", "Acts 17", "Matthew 28", "1 Corinthians 9"],
    weeks: [
      {
        weekNumber: 1,
        title: "Understanding Modern Babylon",
        theme: "Cultural Analysis",
        scriptureFocus: ["Revelation 18:1-5", "1 John 2:15-17", "Daniel 1:1-8"],
        outcome: "Understanding the culture we're reaching",
        coreQuestion: "What characterizes our modern Babylon?",
        heartQuestion: "How has Babylon influenced my thinking?",
        lifeQuestion: "What Babylonian influence will I reject?",
        missionQuestion: "How do I engage Babylon without being absorbed?",
        discussionQuestions: [
          "What sins characterize Babylon in Revelation 18?",
          "What is the 'love of the world' John warns against?",
          "How did Daniel engage Babylon without compromise?",
          "What modern Babylonian influences are most dangerous?"
        ],
        ptRooms: ["PR", "HF", "3A", "ST"],
        practicalApplication: "Identify and fast from one Babylonian cultural influence",
        prayerFocus: "Lord, keep me in the world but not of it"
      },
      {
        weekNumber: 2,
        title: "Digital Evangelism Principles",
        theme: "Online Witness",
        scriptureFocus: ["Acts 17:16-34", "1 Corinthians 9:19-23", "Colossians 4:5-6"],
        outcome: "Wise digital engagement",
        coreQuestion: "How do we witness effectively in digital spaces?",
        heartQuestion: "Is my online presence a witness or a stumbling block?",
        lifeQuestion: "How will I witness digitally this week?",
        missionQuestion: "What digital platform is my mission field?",
        discussionQuestions: [
          "How did Paul engage the Athenian culture?",
          "What does becoming 'all things to all people' mean digitally?",
          "How do we be 'wise toward outsiders' online?",
          "What makes digital witness effective or counterproductive?"
        ],
        ptRooms: ["NF", "PF", "HF", "LR"],
        practicalApplication: "Post one intentionally missional thing on social media",
        prayerFocus: "Lord, use my digital presence for Your kingdom"
      },
      {
        weekNumber: 3,
        title: "Relational Ministry Online",
        theme: "Digital Relationships",
        scriptureFocus: ["John 4:7-26", "Acts 8:26-40", "Proverbs 18:24"],
        outcome: "Building genuine connections digitally",
        coreQuestion: "How do we build real relationships online?",
        heartQuestion: "Am I building relationships or just broadcasting?",
        lifeQuestion: "Who will I intentionally connect with online?",
        missionQuestion: "How can I deepen digital relationships?",
        discussionQuestions: [
          "How did Jesus build relationship with the Samaritan woman?",
          "What made Philip's encounter with the Ethiopian effective?",
          "What makes someone 'a friend who sticks closer than a brother'?",
          "How do we create genuine connection in digital spaces?"
        ],
        ptRooms: ["LR", "PF", "FRt", "NF"],
        practicalApplication: "Reach out personally to someone you've only interacted with publicly",
        prayerFocus: "Lord, help me build genuine relationships online"
      },
      {
        weekNumber: 4,
        title: "Truth with Compassion",
        theme: "Gracious Truth-Telling",
        scriptureFocus: ["Ephesians 4:15", "2 Timothy 2:24-26", "1 Peter 3:15-16"],
        outcome: "Speaking truth without harshness",
        coreQuestion: "How do we share hard truth with gentle love?",
        heartQuestion: "Am I known for truth, love, or both?",
        lifeQuestion: "How will I speak truth in love this week?",
        missionQuestion: "How do I help others communicate truth graciously?",
        discussionQuestions: [
          "What does 'speaking the truth in love' look like?",
          "Why must the Lord's servant 'not be quarrelsome'?",
          "How do we give reasons for hope with 'gentleness and respect'?",
          "What's the difference between compromise and graciousness?"
        ],
        ptRooms: ["FRt", "LR", "QR", "NF"],
        practicalApplication: "Share one difficult truth with conscious gentleness",
        prayerFocus: "Lord, make me truthful and tender"
      },
      {
        weekNumber: 5,
        title: "Calling People Out",
        theme: "Compelling Invitation",
        scriptureFocus: ["Revelation 18:4-5", "Luke 14:21-24", "2 Corinthians 5:18-21"],
        outcome: "Urgency without manipulation",
        coreQuestion: "How do we urgently call people without manipulation?",
        heartQuestion: "Do I care enough to call people out?",
        lifeQuestion: "Who will I invite to leave Babylon this week?",
        missionQuestion: "What's blocking people from responding?",
        discussionQuestions: [
          "Why does God say 'come out of her, my people'?",
          "How did the master 'compel' people to come in?",
          "What is the 'ministry of reconciliation'?",
          "How do we balance urgency and patience?"
        ],
        ptRooms: ["3A", "PR", "FRm", "NF"],
        practicalApplication: "Give someone a clear, loving invitation to follow Christ",
        prayerFocus: "Lord, give me holy urgency for souls"
      },
      {
        weekNumber: 6,
        title: "Launching Personal Mission",
        theme: "Your Mission Strategy",
        scriptureFocus: ["Acts 1:8", "Matthew 9:37-38", "Isaiah 6:8"],
        outcome: "Developing personal mission plan",
        coreQuestion: "What is your personal mission strategy?",
        heartQuestion: "Have I said 'Here am I, send me'?",
        lifeQuestion: "What's my mission action plan?",
        missionQuestion: "Who am I recruiting for the mission?",
        discussionQuestions: [
          "What progression does Acts 1:8 give for witness?",
          "Why did Jesus tell us to pray for workers?",
          "What moved Isaiah to volunteer?",
          "What's your unique mission contribution?"
        ],
        ptRooms: ["3A", "NF", "PF", "SR"],
        practicalApplication: "Write and commit to a personal mission strategy",
        prayerFocus: "Lord, here am I, send me"
      }
    ]
  },

  // CYCLE 11 — HOUSE FIRES & SPIRITUAL FAMILIES
  {
    sequenceNumber: 11,
    title: "House Fires & Spiritual Families",
    description: "Community and multiplication with God dwelling among His people - building and multiplying spiritual families.",
    icon: "🏠",
    theme: "Community & Multiplication",
    sanctuaryFocus: "God Dwelling with His People",
    goal: "Multiplying communities",
    cycleType: "character",
    ptRooms: ["BL", "LR", "P‖", "NF"],
    keyTexts: ["Acts 2", "Hebrews 10", "Exodus 25:8", "Ephesians 2"],
    weeks: [
      {
        weekNumber: 1,
        title: "Biblical Small-Group Ecclesiology",
        theme: "Church in Houses",
        scriptureFocus: ["Acts 2:42-47", "Romans 16:3-5", "Colossians 4:15"],
        outcome: "Understanding house church model",
        coreQuestion: "What did church look like in the New Testament?",
        heartQuestion: "Am I part of genuine community or just attending meetings?",
        lifeQuestion: "How will I invest in small community this week?",
        missionQuestion: "Could I host a house fire?",
        discussionQuestions: [
          "What characterized the Acts 2 community?",
          "Why did churches meet in homes?",
          "What's lost when church becomes only large gatherings?",
          "How do we recover house church dynamics?"
        ],
        ptRooms: ["P‖", "OR", "HF", "LR"],
        practicalApplication: "Invite someone into deeper community",
        prayerFocus: "Lord, help me build authentic spiritual community"
      },
      {
        weekNumber: 2,
        title: "The Church Beyond Buildings",
        theme: "Portable Presence",
        scriptureFocus: ["Matthew 18:20", "Acts 7:48-50", "1 Corinthians 3:16-17"],
        outcome: "Understanding church as people, not place",
        coreQuestion: "What makes us 'the church'?",
        heartQuestion: "Do I think of church as a place or a people?",
        lifeQuestion: "Where will I be 'the church' beyond a building?",
        missionQuestion: "Where does my community need church to show up?",
        discussionQuestions: [
          "What does Jesus promise when 'two or three gather'?",
          "Why doesn't God dwell in temples made with hands?",
          "How are we God's temple?",
          "What would it look like to be church everywhere?"
        ],
        ptRooms: ["BL", "ST", "CR", "NF"],
        practicalApplication: "Gather with believers outside a church building for worship",
        prayerFocus: "Lord, help me be the church wherever I am"
      },
      {
        weekNumber: 3,
        title: "Shared Priesthood of Believers",
        theme: "Everyone a Minister",
        scriptureFocus: ["1 Peter 2:4-10", "Revelation 1:5-6", "Ephesians 4:11-16"],
        outcome: "Embracing priestly identity and ministry",
        coreQuestion: "What does it mean that we're all priests?",
        heartQuestion: "Am I living as a priest or leaving ministry to professionals?",
        lifeQuestion: "What priestly ministry will I do this week?",
        missionQuestion: "How am I equipping others for ministry?",
        discussionQuestions: [
          "What does being 'a royal priesthood' mean?",
          "How has Christ made us 'priests to His God'?",
          "Why are leaders supposed to 'equip the saints for ministry'?",
          "What ministry are you called to do?"
        ],
        ptRooms: ["BL", "DR", "CR", "ST"],
        practicalApplication: "Exercise your priesthood - pray for, counsel, or serve someone",
        prayerFocus: "Lord, help me embrace my priestly calling"
      },
      {
        weekNumber: 4,
        title: "Hospitality & Discipleship",
        theme: "Open Homes, Open Hearts",
        scriptureFocus: ["Romans 12:13", "Hebrews 13:1-2", "Acts 16:14-15"],
        outcome: "Using homes for kingdom purposes",
        coreQuestion: "How does hospitality advance discipleship?",
        heartQuestion: "Is my home open for kingdom purposes?",
        lifeQuestion: "Who will I invite into my home this week?",
        missionQuestion: "How can I make my home a discipleship hub?",
        discussionQuestions: [
          "Why are we commanded to practice hospitality?",
          "What happens when we entertain strangers unaware?",
          "How did Lydia use her home for the gospel?",
          "What prevents us from opening our homes?"
        ],
        ptRooms: ["NF", "LR", "FRt", "PF"],
        practicalApplication: "Open your home for spiritual purposes this week",
        prayerFocus: "Lord, use my home for Your kingdom"
      },
      {
        weekNumber: 5,
        title: "Multiplying Leaders",
        theme: "Leadership Development",
        scriptureFocus: ["2 Timothy 2:1-2", "Acts 6:1-7", "Exodus 18:13-26"],
        outcome: "Intentional leader development",
        coreQuestion: "How do we raise up new leaders?",
        heartQuestion: "Am I developing or hoarding leadership?",
        lifeQuestion: "Who am I investing in as a potential leader?",
        missionQuestion: "How do we create a leadership pipeline?",
        discussionQuestions: [
          "What 'four generation' strategy did Paul give Timothy?",
          "Why did the apostles delegate to the seven?",
          "What did Jethro's advice save Moses from?",
          "Who are you investing in for future leadership?"
        ],
        ptRooms: ["PRm", "P‖", "LR", "NF"],
        practicalApplication: "Identify and begin investing in a potential leader",
        prayerFocus: "Lord, help me multiply myself in others"
      },
      {
        weekNumber: 6,
        title: "Sustaining Spiritual Family",
        theme: "Long-Term Community",
        scriptureFocus: ["Hebrews 10:24-25", "Galatians 6:1-10", "Ecclesiastes 4:9-12"],
        outcome: "Commitment to lasting community",
        coreQuestion: "How do we build community that lasts?",
        heartQuestion: "Am I committed for the long haul?",
        lifeQuestion: "What will I do to strengthen community bonds?",
        missionQuestion: "How do we prevent community decay?",
        discussionQuestions: [
          "Why must we 'not give up meeting together'?",
          "How do we 'bear one another's burdens'?",
          "What makes 'two better than one'?",
          "What threatens community longevity?"
        ],
        ptRooms: ["LR", "FRt", "FRm", "MR"],
        practicalApplication: "Make a long-term commitment to your spiritual family",
        prayerFocus: "Lord, help us stay together for the journey"
      }
    ]
  },

  // CYCLE 12 — STANDING IN THE TIME OF THE END
  {
    sequenceNumber: 12,
    title: "Standing in the Time of the End",
    description: "End-time resilience and victory with glory filling the temple - the final victory of Christ and His people.",
    icon: "🔥",
    theme: "End-Time Resilience",
    sanctuaryFocus: "Glory Filling the Temple",
    goal: "Standing to the end",
    cycleType: "prophecy",
    ptRooms: ["PR", "3A", "FRm", "CR"],
    keyTexts: ["Daniel 12", "Revelation 18", "Hebrews 12", "Matthew 24"],
    weeks: [
      {
        weekNumber: 1,
        title: "The Shaking Explained",
        theme: "Testing Time",
        scriptureFocus: ["Hebrews 12:25-29", "Haggai 2:6-7", "Amos 9:9"],
        outcome: "Understanding coming tests",
        coreQuestion: "What is the shaking and why is it necessary?",
        heartQuestion: "Am I building on what can't be shaken?",
        lifeQuestion: "What shakeable things am I depending on?",
        missionQuestion: "How do I help others prepare for shaking?",
        discussionQuestions: [
          "What will be shaken and what will remain?",
          "What does God promise to shake in Haggai?",
          "How will Israel be 'sifted' according to Amos?",
          "How do we build on unshakeable foundations?"
        ],
        ptRooms: ["PR", "ST", "FRm", "DR"],
        practicalApplication: "Identify one shakeable thing you depend on and release it to God",
        prayerFocus: "Lord, build my life on what cannot be shaken"
      },
      {
        weekNumber: 2,
        title: "Standing When Others Fall",
        theme: "Endurance",
        scriptureFocus: ["Matthew 24:10-13", "2 Thessalonians 2:1-3", "Revelation 3:10"],
        outcome: "Preparation for apostasy around us",
        coreQuestion: "How do we stand when many fall away?",
        heartQuestion: "What could cause me to fall?",
        lifeQuestion: "How will I strengthen my endurance?",
        missionQuestion: "How do I help wavering believers stand?",
        discussionQuestions: [
          "Why will 'many fall away' in the last days?",
          "What 'falling away' comes before Christ returns?",
          "What promise does Jesus give for the hour of trial?",
          "How do we endure to the end?"
        ],
        ptRooms: ["PR", "3A", "FRm", "CR"],
        practicalApplication: "Identify potential causes of falling and address them now",
        prayerFocus: "Lord, help me stand when others fall"
      },
      {
        weekNumber: 3,
        title: "Faith Under Pressure",
        theme: "Tested Faith",
        scriptureFocus: ["Daniel 3:16-18", "Hebrews 11:32-40", "1 Peter 1:6-9"],
        outcome: "Faith that doesn't require rescue",
        coreQuestion: "What does faith look like when God doesn't rescue?",
        heartQuestion: "Is my faith conditional on God's deliverance?",
        lifeQuestion: "How will I trust God regardless of outcomes?",
        missionQuestion: "How do I teach unconditional faith?",
        discussionQuestions: [
          "What made the three Hebrews' faith remarkable?",
          "What happened to faithful people in Hebrews 11?",
          "How do trials prove our faith genuine?",
          "How do we develop faith that doesn't demand deliverance?"
        ],
        ptRooms: ["FRm", "P‖", "CR", "MR"],
        practicalApplication: "Declare your commitment to God regardless of outcomes",
        prayerFocus: "Lord, I trust You even if You don't deliver me"
      },
      {
        weekNumber: 4,
        title: "Loyalty vs Compromise",
        theme: "Unwavering Allegiance",
        scriptureFocus: ["Daniel 6:1-10", "Revelation 2:10", "Joshua 24:14-15"],
        outcome: "Settled loyalty to God",
        coreQuestion: "What does unflinching loyalty look like?",
        heartQuestion: "Where am I tempted to compromise?",
        lifeQuestion: "What compromise will I eliminate this week?",
        missionQuestion: "How do I model loyalty without legalism?",
        discussionQuestions: [
          "Why didn't Daniel stop praying?",
          "What does 'be faithful unto death' require?",
          "What did Joshua's challenge demand?",
          "Where is compromise creeping into the church today?"
        ],
        ptRooms: ["OR", "PRm", "FRm", "P‖"],
        practicalApplication: "Identify and confess any area of compromise",
        prayerFocus: "Lord, settle my loyalty to You alone"
      },
      {
        weekNumber: 5,
        title: "The Loud Cry",
        theme: "Final Message Power",
        scriptureFocus: ["Revelation 18:1-4", "Joel 2:28-32", "Acts 2:17-21"],
        outcome: "Prepared for final proclamation",
        coreQuestion: "What is the loud cry and how do we participate?",
        heartQuestion: "Am I filled with power for witness?",
        lifeQuestion: "How am I preparing for the loud cry?",
        missionQuestion: "What role will I play in the final message?",
        discussionQuestions: [
          "What 'illuminates the earth' with glory in Revelation 18?",
          "What does the Spirit's outpouring produce?",
          "How did Pentecost show what the latter rain will be?",
          "How do we prepare for the loud cry?"
        ],
        ptRooms: ["3A", "PR", "FRm", "ST"],
        practicalApplication: "Pray specifically for the latter rain of the Spirit",
        prayerFocus: "Lord, fill me with power for the final message"
      },
      {
        weekNumber: 6,
        title: "The Final Victory of Christ",
        theme: "Ultimate Triumph",
        scriptureFocus: ["Revelation 19:11-16", "Daniel 2:44-45", "1 Corinthians 15:54-58"],
        outcome: "Confidence in Christ's final victory",
        coreQuestion: "What does Christ's final victory mean for us?",
        heartQuestion: "Do I live with victory confidence?",
        lifeQuestion: "How will I live victoriously this week?",
        missionQuestion: "How do I share the hope of final victory?",
        discussionQuestions: [
          "What does the returning Christ look like in Revelation 19?",
          "How does God's kingdom finally triumph in Daniel 2?",
          "What happens to death at Christ's return?",
          "How does knowing the end affect how we live now?"
        ],
        ptRooms: ["CR", "PR", "3A", "FRm"],
        practicalApplication: "Live this week with conscious victory confidence",
        prayerFocus: "Maranatha! Come, Lord Jesus!"
      }
    ]
  }
];

// Get cycle by sequence number
export function getCycleBySequence(sequenceNumber: number): StudyCycle | undefined {
  return LIVING_MANNA_CYCLES.find(c => c.sequenceNumber === sequenceNumber);
}

// Get all cycles as JSON for database seeding
export function getCyclesForDatabase(): any[] {
  return LIVING_MANNA_CYCLES.map(cycle => ({
    sequence_number: cycle.sequenceNumber,
    title: cycle.title,
    description: cycle.description,
    icon: cycle.icon,
    theme: cycle.theme,
    sanctuary_focus: cycle.sanctuaryFocus,
    goal: cycle.goal,
    cycle_type: cycle.cycleType,
    pt_rooms: cycle.ptRooms,
    week_content: cycle.weeks,
    is_active: true,
    is_template: true
  }));
}
