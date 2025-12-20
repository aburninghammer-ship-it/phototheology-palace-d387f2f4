// Living Manna 12-Week Disciple Training Program
// Intensive training to transform members into leaders

export interface TrainingWeek {
  weekNumber: number;
  title: string;
  theme: string;
  sanctuaryFocus: string;
  goal: string;
  scriptureFocus: string[];
  keyTruth: string;
  discussionQuestions: string[];
  lifeApplication: string;
  prayerFocus: string;
  ptRooms: string[];
  practices: string[];
  facilitatorNotes: string;
}

export const DISCIPLE_TRAINING_WEEKS: TrainingWeek[] = [
  {
    weekNumber: 1,
    title: "The Call to Discipleship",
    theme: "Understanding the Cost",
    sanctuaryFocus: "Altar of Burnt Offering",
    goal: "Count the cost and commit fully",
    scriptureFocus: ["Luke 14:25-33", "Matthew 16:24-26", "Mark 1:16-20"],
    keyTruth: "Discipleship requires total surrender—there is no partial following of Christ.",
    discussionQuestions: [
      "What did Jesus mean by 'hating' family to follow Him?",
      "Why does Jesus want us to count the cost before committing?",
      "What did the first disciples leave behind? What must you leave?",
      "How is discipleship different from mere church attendance?"
    ],
    lifeApplication: "Write a 'cost counted' covenant listing what you're surrendering to follow Christ.",
    prayerFocus: "Lord, I count the cost and choose to follow You fully.",
    ptRooms: ["CR", "FRm", "OR"],
    practices: ["Daily surrender prayer", "Fasting one meal this week", "Memorize Luke 14:33"],
    facilitatorNotes: "This week sets the tone. Don't soften the cost—only committed disciples will multiply."
  },
  {
    weekNumber: 2,
    title: "Identity in Christ",
    theme: "Who You Are Now",
    sanctuaryFocus: "Laver - Cleansing & New Identity",
    goal: "Understand and live from new identity",
    scriptureFocus: ["2 Corinthians 5:17", "Galatians 2:20", "Ephesians 1:3-14"],
    keyTruth: "Your identity is no longer defined by past, performance, or people—only by Christ.",
    discussionQuestions: [
      "What does 'new creation' mean practically?",
      "How does 'Christ lives in me' change daily decisions?",
      "Which identity blessings in Ephesians 1 most impact you?",
      "What old identity labels do you need to release?"
    ],
    lifeApplication: "Write an 'I am in Christ' declaration and read it daily.",
    prayerFocus: "Lord, help me live from my true identity in You.",
    ptRooms: ["DR", "CR", "ST"],
    practices: ["Identity declarations each morning", "Reject one old label", "Share testimony of identity change"],
    facilitatorNotes: "Identity must be settled before ministry—wounded disciples create wounded disciples."
  },
  {
    weekNumber: 3,
    title: "The Word as Foundation",
    theme: "Scripture Mastery",
    sanctuaryFocus: "Table of Showbread",
    goal: "Establish unshakeable Word habits",
    scriptureFocus: ["Psalm 119:9-16", "2 Timothy 3:16-17", "Joshua 1:8"],
    keyTruth: "Leaders are built on consistent, deep engagement with Scripture—not sporadic inspiration.",
    discussionQuestions: [
      "How does the Word 'cleanse' our way?",
      "What makes Scripture 'profitable' for equipping?",
      "What does 'meditating day and night' look like for you?",
      "What hinders consistent Scripture engagement?"
    ],
    lifeApplication: "Establish a non-negotiable daily Bible time and track it.",
    prayerFocus: "Lord, make Your Word my daily bread.",
    ptRooms: ["TR", "OR", "MR", "SR"],
    practices: ["Read 3 chapters daily", "Memorize one verse", "Journal observations"],
    facilitatorNotes: "This week establishes the discipline that sustains everything else."
  },
  {
    weekNumber: 4,
    title: "Prayer as Power Source",
    theme: "Developing Prayer Life",
    sanctuaryFocus: "Altar of Incense",
    goal: "Move from prayer talking to prayer power",
    scriptureFocus: ["Luke 11:1-13", "James 5:16-18", "Daniel 9:1-19"],
    keyTruth: "Prayer is not religious duty but the power source for effective ministry.",
    discussionQuestions: [
      "Why did the disciples ask Jesus to teach them to pray?",
      "What makes prayer 'effective and fervent'?",
      "What elements made Daniel's prayer so powerful?",
      "What's the difference between praying and having a prayer life?"
    ],
    lifeApplication: "Establish a prayer rhythm—morning, midday, evening.",
    prayerFocus: "Lord, teach me to pray with power.",
    ptRooms: ["BL", "FRm", "MR"],
    practices: ["30 minutes daily prayer minimum", "Prayer journal", "Intercessory prayer for 5 people"],
    facilitatorNotes: "Model prayer in this session—don't just teach about it."
  },
  {
    weekNumber: 5,
    title: "Understanding the Sanctuary",
    theme: "God's Salvation Blueprint",
    sanctuaryFocus: "Full Sanctuary Overview",
    goal: "See Christ in every sanctuary element",
    scriptureFocus: ["Hebrews 8:1-5", "Hebrews 9:1-12", "Exodus 25:8-9"],
    keyTruth: "The sanctuary is God's visual theology—the gospel made visible.",
    discussionQuestions: [
      "Why did God command Moses to build 'according to the pattern'?",
      "How does each article point to Christ?",
      "What does the sanctuary teach about salvation?",
      "How does understanding the sanctuary affect your faith?"
    ],
    lifeApplication: "Create a sanctuary diagram labeling Christ in each element.",
    prayerFocus: "Lord, reveal Christ to me through the sanctuary.",
    ptRooms: ["BL", "ST", "CR", "P‖"],
    practices: ["Study each sanctuary article", "Draw the sanctuary", "Teach it to someone"],
    facilitatorNotes: "This is the Phototheology foundation—make sure it's deeply understood."
  },
  {
    weekNumber: 6,
    title: "The Three Angels' Messages",
    theme: "End-Time Gospel Commission",
    sanctuaryFocus: "Heavenly Sanctuary Ministry",
    goal: "Understand and live the final message",
    scriptureFocus: ["Revelation 14:6-12", "Revelation 18:1-4", "Matthew 24:14"],
    keyTruth: "We are called to proclaim the final gospel message to every nation.",
    discussionQuestions: [
      "What is the 'everlasting gospel' in the first angel's message?",
      "What does 'Babylon is fallen' mean for us today?",
      "Who are those who 'keep the commandments and faith of Jesus'?",
      "How do we share this message without being offensive?"
    ],
    lifeApplication: "Prepare a 3-minute explanation of each angel's message.",
    prayerFocus: "Lord, make me a faithful messenger of Your final truth.",
    ptRooms: ["3A", "PR", "CR"],
    practices: ["Study each message deeply", "Share with one person", "Identify Babylonian influences"],
    facilitatorNotes: "Balance urgency with grace—truth must be shared in love."
  },
  {
    weekNumber: 7,
    title: "Spiritual Warfare",
    theme: "Fighting the Right Battle",
    sanctuaryFocus: "Most Holy Place - Victory Seat",
    goal: "Understand and engage spiritual warfare",
    scriptureFocus: ["Ephesians 6:10-20", "2 Corinthians 10:3-5", "Daniel 10:12-14"],
    keyTruth: "Our battle is not against flesh and blood but spiritual forces.",
    discussionQuestions: [
      "What pieces of armor are defensive? Offensive?",
      "How do we 'demolish strongholds'?",
      "What delayed Daniel's answer for 21 days?",
      "Where do you sense spiritual opposition in your life?"
    ],
    lifeApplication: "Put on the full armor daily with specific prayer for each piece.",
    prayerFocus: "Lord, equip me for spiritual battle.",
    ptRooms: ["PR", "ST", "FRm"],
    practices: ["Daily armor prayer", "Fast for breakthrough", "Warfare intercession"],
    facilitatorNotes: "Be balanced—acknowledge real warfare without seeing demons everywhere."
  },
  {
    weekNumber: 8,
    title: "Personal Evangelism",
    theme: "Sharing Your Faith",
    sanctuaryFocus: "Light Going Outward",
    goal: "Develop confident, natural witness",
    scriptureFocus: ["1 Peter 3:15", "Acts 8:26-40", "John 4:7-26"],
    keyTruth: "Every disciple is called to share their faith naturally and effectively.",
    discussionQuestions: [
      "How do we give a reason for our hope with 'gentleness and respect'?",
      "What made Philip's encounter with the Ethiopian effective?",
      "How did Jesus turn a casual conversation into salvation?",
      "What prevents you from sharing your faith?"
    ],
    lifeApplication: "Prepare and practice your 3-minute testimony.",
    prayerFocus: "Lord, give me opportunities and boldness to share.",
    ptRooms: ["NF", "PF", "LR", "3A"],
    practices: ["Share testimony with group", "Identify 5 people to pray for", "Initiate one gospel conversation"],
    facilitatorNotes: "Practice makes confident—have everyone share their testimony."
  },
  {
    weekNumber: 9,
    title: "Discipling Others",
    theme: "Multiplication Mindset",
    sanctuaryFocus: "Priesthood of Believers",
    goal: "Begin investing in someone else",
    scriptureFocus: ["2 Timothy 2:1-2", "Matthew 28:18-20", "John 17:18"],
    keyTruth: "A disciple who doesn't make disciples isn't fulfilling the call.",
    discussionQuestions: [
      "What's the four-generation strategy in 2 Timothy 2:2?",
      "Why does Jesus say 'make disciples' not 'make converts'?",
      "How did Jesus send us as the Father sent Him?",
      "Who is God calling you to invest in?"
    ],
    lifeApplication: "Identify and begin meeting with one person to disciple.",
    prayerFocus: "Lord, help me reproduce myself in others.",
    ptRooms: ["P‖", "PRm", "LR"],
    practices: ["Identify a discipleship candidate", "Schedule weekly meetings", "Create a plan"],
    facilitatorNotes: "This is the multiplication moment—ensure everyone commits to someone."
  },
  {
    weekNumber: 10,
    title: "Leading Small Groups",
    theme: "Facilitating Transformation",
    sanctuaryFocus: "Tabernacle Community",
    goal: "Develop group leadership skills",
    scriptureFocus: ["Acts 2:42-47", "Hebrews 10:24-25", "Ecclesiastes 4:9-12"],
    keyTruth: "Small groups are the engine of discipleship—leaders are needed.",
    discussionQuestions: [
      "What made the Acts 2 community transformative?",
      "How do we 'stir up one another' to love and good works?",
      "Why are 'two better than one'?",
      "What makes small groups succeed or fail?"
    ],
    lifeApplication: "Lead a portion of next week's session.",
    prayerFocus: "Lord, prepare me to lead others in community.",
    ptRooms: ["LR", "NF", "HF"],
    practices: ["Observe facilitation techniques", "Practice asking questions", "Plan a session"],
    facilitatorNotes: "Give hands-on practice—let participants lead portions of discussion."
  },
  {
    weekNumber: 11,
    title: "Handling Opposition",
    theme: "Standing Under Pressure",
    sanctuaryFocus: "Day of Atonement Preparation",
    goal: "Prepare for resistance and persecution",
    scriptureFocus: ["John 15:18-21", "2 Timothy 3:12", "Matthew 5:10-12"],
    keyTruth: "Opposition is promised—preparation determines whether we stand or fall.",
    discussionQuestions: [
      "Why does the world hate those who follow Christ?",
      "What did Paul say everyone who lives godly will experience?",
      "How are we to respond when persecuted?",
      "Where do you already face opposition?"
    ],
    lifeApplication: "Prepare mentally and spiritually for specific opposition you may face.",
    prayerFocus: "Lord, strengthen me to stand under pressure.",
    ptRooms: ["FRm", "PR", "3A"],
    practices: ["Study persecution accounts", "Pray for the persecuted", "Prepare responses"],
    facilitatorNotes: "Be realistic about coming challenges without creating fear."
  },
  {
    weekNumber: 12,
    title: "Commissioning & Sending",
    theme: "Going Into the Harvest",
    sanctuaryFocus: "Glory Filling the Temple",
    goal: "Launch into active ministry",
    scriptureFocus: ["Matthew 9:37-38", "Acts 1:8", "Isaiah 6:8"],
    keyTruth: "Training without deployment is incomplete—you are sent.",
    discussionQuestions: [
      "Why did Jesus tell us to pray for workers?",
      "What progression does Acts 1:8 give for witness?",
      "What moved Isaiah to say 'Here am I, send me'?",
      "What is your specific mission assignment?"
    ],
    lifeApplication: "Write and commit to your personal mission plan for the next 6 months.",
    prayerFocus: "Lord, here am I—send me.",
    ptRooms: ["3A", "NF", "PF", "SR"],
    practices: ["Create mission plan", "Identify accountability partner", "Set first action steps"],
    facilitatorNotes: "This is commissioning—pray over each person and send them with authority."
  }
];

// Get training week by number
export function getTrainingWeek(weekNumber: number): TrainingWeek | undefined {
  return DISCIPLE_TRAINING_WEEKS.find(w => w.weekNumber === weekNumber);
}

// Get all weeks for database
export function getTrainingWeeksForDatabase(): any[] {
  return DISCIPLE_TRAINING_WEEKS.map(week => ({
    week_number: week.weekNumber,
    title: week.title,
    theme: week.theme,
    sanctuary_focus: week.sanctuaryFocus,
    goal: week.goal,
    scripture_focus: week.scriptureFocus,
    key_truth: week.keyTruth,
    discussion_questions: week.discussionQuestions,
    life_application: week.lifeApplication,
    prayer_focus: week.prayerFocus,
    pt_rooms: week.ptRooms,
    practices: week.practices,
    facilitator_notes: week.facilitatorNotes,
    is_template: true
  }));
}
