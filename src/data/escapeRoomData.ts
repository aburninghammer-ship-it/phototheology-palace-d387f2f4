// Phototheology Escape Room Data - 20 Premade Themed Rooms
// Each room uses phototheology principles to solve puzzles and discover biblical truths

export type PuzzleType = 'riddle' | 'fill-blank' | 'multiple-choice' | 'sequence' | 'cipher' | 'match' | 'image-clue';
export type Difficulty = 'easy' | 'medium' | 'hard' | 'expert';
export type FinalAnswerType = 'person' | 'text' | 'truth' | 'account';

export interface PhototheologyPrinciple {
  name: string;
  room: string;
  roomTag: string;
  explanation: string;
  howToApply: string;
}

export interface Puzzle {
  id: string;
  type: PuzzleType;
  question: string;
  hint?: string;
  principle: PhototheologyPrinciple;
  // For riddles and fill-blank
  answer?: string;
  // For multiple-choice
  options?: string[];
  correctOption?: number;
  // For sequence
  items?: string[];
  correctOrder?: number[];
  // For cipher
  cipherText?: string;
  cipherKey?: string;
  // For match
  pairs?: { left: string; right: string }[];
  // Clue revealed after solving
  clueRevealed: string;
  points: number;
}

export interface EscapeRoom {
  id: string;
  title: string;
  theme: string;
  description: string;
  storyIntro: string;
  difficulty: Difficulty;
  timeLimit: number; // in minutes
  backgroundGradient: string;
  icon: string;
  puzzles: Puzzle[];
  finalAnswer: {
    type: FinalAnswerType;
    answer: string;
    hint: string;
    explanation: string;
    verse: string;
  };
}

// Phototheology Principles Library
export const principles: Record<string, PhototheologyPrinciple> = {
  typology: {
    name: "Typology",
    room: "Symbols & Types Room",
    roomTag: "ST",
    explanation: "Types are prophetic symbols in the Old Testament that point to greater realities fulfilled in Christ or the New Testament.",
    howToApply: "Look for patterns where an OT person, event, or object foreshadows a NT fulfillment. Ask: 'What does this point to?'"
  },
  sanctuary: {
    name: "Sanctuary Pattern",
    room: "Blueprint Room",
    roomTag: "BL",
    explanation: "The sanctuary reveals God's plan of salvation through its furniture, services, and layout - from the outer court to the Most Holy Place.",
    howToApply: "Connect sanctuary elements to Christ's ministry: Altar=Cross, Laver=Baptism, Bread=Word, Lampstand=Spirit, Incense=Prayer, Ark=Throne."
  },
  christConcentration: {
    name: "Christ Concentration",
    room: "Concentration Room",
    roomTag: "CR",
    explanation: "Every passage of Scripture, when properly understood, points to Christ - His character, His work, or His kingdom.",
    howToApply: "Ask of every text: 'How does this reveal Christ? What does it teach about His nature, mission, or kingdom?'"
  },
  dimensions: {
    name: "Five Dimensions",
    room: "Dimensions Room",
    roomTag: "DR",
    explanation: "Every text can be examined through 5 layers: Literal, Moral, Allegorical, Anagogical (future), and Christological.",
    howToApply: "Apply each dimension systematically: What happened? What should I do? What deeper truth? What future hope? How does Christ fulfill this?"
  },
  parallels: {
    name: "Parallels",
    room: "Parallels Room",
    roomTag: "P||",
    explanation: "Scripture interprets Scripture. Parallel passages illuminate meaning through comparison and contrast.",
    howToApply: "Find cross-references. Compare similar accounts. Look for repeated phrases, themes, or structures across different books."
  },
  timeZone: {
    name: "Time Zone Analysis",
    room: "Time Zone Room",
    roomTag: "TZ",
    explanation: "Biblical truths apply across three time zones: Past (historical), Present (practical), and Future (prophetic).",
    howToApply: "Ask: 'What happened then? What does it mean for today? What does it promise for the future?'"
  },
  observation: {
    name: "Detailed Observation",
    room: "Observation Room",
    roomTag: "OR",
    explanation: "Like a detective, examine every detail in the text - words, numbers, names, sequence, and context.",
    howToApply: "Read slowly. Note repeated words, unusual phrases, specific numbers, proper names and their meanings, and structural patterns."
  },
  storyFlow: {
    name: "Narrative Flow",
    room: "Story Room",
    roomTag: "SR",
    explanation: "Understanding the narrative context - what comes before and after - reveals the author's intended meaning.",
    howToApply: "Read the surrounding chapters. Understand the historical setting. Follow the plot development."
  },
  defCom: {
    name: "Definition & Comparison",
    room: "Def-Com Room",
    roomTag: "DC",
    explanation: "Biblical words carry specific meanings. Comparing how words are used elsewhere in Scripture unlocks understanding.",
    howToApply: "Study word definitions using concordances. Find where the same word appears elsewhere. Compare translations."
  },
  connect6: {
    name: "Connect 6 Genre Analysis",
    room: "Connect 6 Room",
    roomTag: "C6",
    explanation: "Understanding the literary genre (law, poetry, prophecy, gospel, epistle, apocalyptic) shapes interpretation.",
    howToApply: "Identify the genre. Apply appropriate interpretive methods. Poetry uses imagery; prophecy uses symbols; epistles give direct teaching."
  },
  fruit: {
    name: "Fruit Test",
    room: "Fruit Room",
    roomTag: "FRt",
    explanation: "True interpretation produces the fruit of the Spirit and leads to Christlike character.",
    howToApply: "Test your interpretation: Does it produce love, joy, peace? Does it lead to obedience? Does it glorify Christ?"
  },
  threeAngels: {
    name: "Three Angels Framework",
    room: "Three Angels Room",
    roomTag: "3A",
    explanation: "Revelation 14's three angels messages provide the framework for end-time truth: Fear God, Babylon fallen, Mark warning.",
    howToApply: "Connect teachings to: (1) Creator worship, (2) False system exposure, (3) Seal vs Mark distinction."
  },
  prophecy: {
    name: "Prophetic Interpretation",
    room: "Prophecy Room",
    roomTag: "PR",
    explanation: "Biblical prophecy uses day-year principle, symbolic imagery, and historical fulfillment to reveal God's plan.",
    howToApply: "Identify symbols using Scripture. Apply day=year for time prophecies. Look for historical fulfillments. Connect to Christ's ministry."
  },
  feasts: {
    name: "Feast Fulfillment",
    room: "Feasts Room",
    roomTag: "FE",
    explanation: "The seven biblical feasts outline God's salvation plan from Passover (Cross) to Tabernacles (New Earth).",
    howToApply: "Connect each feast to its fulfillment: Passover=Crucifixion, Unleavened Bread=Burial, Firstfruits=Resurrection, Pentecost=Spirit, Trumpets=Advent, Atonement=Judgment, Tabernacles=Kingdom."
  },
  nature: {
    name: "Nature Parables",
    room: "Nature Freestyle",
    roomTag: "NF",
    explanation: "God's creation teaches spiritual truths. Nature is the second book of revelation.",
    howToApply: "Observe natural phenomena. Ask: 'What spiritual truth does this illustrate?' Seeds, light, water, growth all teach lessons."
  },
  patterns: {
    name: "Pattern Recognition",
    room: "Patterns Room",
    roomTag: "PRm",
    explanation: "Biblical history follows patterns and cycles. Understanding these reveals God's consistent methods.",
    howToApply: "Look for repeated patterns: Apostasy-Punishment-Repentance-Deliverance. Note structural chiasms and numeric patterns."
  }
};

// 20 Premade Escape Rooms
export const escapeRooms: EscapeRoom[] = [
  // ROOM 1: The Sanctuary Mystery
  {
    id: "sanctuary-mystery",
    title: "The Sanctuary Mystery",
    theme: "Sanctuary",
    description: "Unlock the secrets hidden in the earthly sanctuary to discover the ultimate High Priest.",
    storyIntro: "You find yourself standing before the ancient tabernacle in the wilderness. The pillar of cloud hovers above. To escape, you must journey through each piece of furniture, unlocking its secrets. Each solved puzzle reveals a clue about who this sanctuary truly points to...",
    difficulty: "medium",
    timeLimit: 25,
    backgroundGradient: "from-amber-900 via-yellow-800 to-amber-700",
    icon: "🏛️",
    puzzles: [
      {
        id: "sanc-1",
        type: "riddle",
        question: "I am the first thing you see when entering the courtyard. Bronze I am, and upon me the innocent dies. Fire consumes the offering placed on my surface. What am I?",
        hint: "Think of where sacrifices were made...",
        principle: principles.sanctuary,
        answer: "altar of burnt offering",
        clueRevealed: "The sacrifice points to ONE who would be both priest and offering.",
        points: 10
      },
      {
        id: "sanc-2",
        type: "multiple-choice",
        question: "After the altar, the priest must wash at the laver. What does this bronze basin filled with water represent in the Christian experience?",
        options: ["Communion", "Baptism", "Prayer", "Fasting"],
        correctOption: 1,
        principle: principles.sanctuary,
        clueRevealed: "This ONE was baptized in the Jordan, though He had no sin to wash away.",
        points: 10
      },
      {
        id: "sanc-3",
        type: "fill-blank",
        question: "Inside the Holy Place, the lampstand provides light. Jesus said, 'I am the _____ of the world.'",
        answer: "light",
        principle: principles.christConcentration,
        clueRevealed: "This ONE is the true Light that lights every person.",
        points: 10
      },
      {
        id: "sanc-4",
        type: "sequence",
        question: "Arrange the sanctuary furniture in the correct order from entrance to Most Holy Place:",
        items: ["Ark of the Covenant", "Altar of Burnt Offering", "Table of Showbread", "Laver", "Altar of Incense", "Lampstand"],
        correctOrder: [1, 3, 5, 2, 4, 0],
        principle: principles.sanctuary,
        clueRevealed: "This journey from courtyard to throne mirrors the ministry of this ONE.",
        points: 15
      },
      {
        id: "sanc-5",
        type: "match",
        question: "Match each sanctuary item to its New Testament fulfillment:",
        pairs: [
          { left: "Altar of Sacrifice", right: "The Cross" },
          { left: "Bread of Presence", right: "Word of God" },
          { left: "Golden Lampstand", right: "Holy Spirit" },
          { left: "Altar of Incense", right: "Prayer & Intercession" }
        ],
        principle: principles.typology,
        clueRevealed: "This ONE fulfills ALL sanctuary symbols perfectly.",
        points: 15
      }
    ],
    finalAnswer: {
      type: "person",
      answer: "Jesus Christ",
      hint: "He is both the Lamb that was slain and the Priest who ministers in the heavenly sanctuary.",
      explanation: "Every piece of sanctuary furniture points to Jesus Christ. He is the sacrifice (altar), the cleansing (laver), the light (lampstand), the bread of life (showbread), the intercessor (incense), and the presence of God (ark). He is our great High Priest ministering in the heavenly sanctuary.",
      verse: "Hebrews 8:1-2 - We have such an high priest, who is set on the right hand of the throne of the Majesty in the heavens; A minister of the sanctuary, and of the true tabernacle, which the Lord pitched, and not man."
    }
  },

  // ROOM 2: Exodus Escape
  {
    id: "exodus-escape",
    title: "Exodus Escape",
    theme: "Exodus",
    description: "Retrace the steps of Israel's deliverance to discover the pattern of salvation.",
    storyIntro: "You are in Egypt, enslaved by Pharaoh. The plagues have begun. To escape, you must understand each step of Israel's deliverance - for this ancient story reveals something far greater about how God saves His people in every age...",
    difficulty: "medium",
    timeLimit: 30,
    backgroundGradient: "from-red-900 via-orange-800 to-yellow-700",
    icon: "🌊",
    puzzles: [
      {
        id: "exod-1",
        type: "riddle",
        question: "I am the final plague that broke Pharaoh's heart. The firstborn fell, but those with my mark were passed over. What protected the Israelites that night?",
        hint: "Something was placed on doorposts...",
        principle: principles.typology,
        answer: "blood of the lamb",
        clueRevealed: "A Lamb's blood would again save God's people - but once for all.",
        points: 10
      },
      {
        id: "exod-2",
        type: "multiple-choice",
        question: "The Passover lamb had to be 'without blemish.' In typology, what does this requirement point to?",
        options: ["A perfect temple", "A sinless Savior", "A righteous nation", "A holy city"],
        correctOption: 1,
        principle: principles.typology,
        clueRevealed: "This Savior would be tested and found without spot or wrinkle.",
        points: 10
      },
      {
        id: "exod-3",
        type: "fill-blank",
        question: "Paul writes in 1 Corinthians 5:7, 'Christ our ________ is sacrificed for us.'",
        answer: "passover",
        principle: principles.parallels,
        clueRevealed: "The true Passover Lamb died on the very day of the feast.",
        points: 10
      },
      {
        id: "exod-4",
        type: "cipher",
        question: "Decode this message using the Caesar cipher (shift 3 backward): 'WKDW PDQB ZKR VLQV LV WKH VHUYDQW RI VLQ'",
        cipherText: "WKDW PDQB ZKR VLQV LV WKH VHUYDQW RI VLQ",
        cipherKey: "Shift each letter 3 positions backward in alphabet",
        answer: "that many who sins is the servant of sin",
        principle: principles.defCom,
        clueRevealed: "Just as Israel was enslaved to Egypt, we were enslaved to sin - until the Deliverer came.",
        points: 15
      },
      {
        id: "exod-5",
        type: "sequence",
        question: "Arrange the Exodus events in correct chronological order:",
        items: ["Crossing the Red Sea", "Passover Night", "Receiving the Law", "Ten Plagues Begin", "Building the Golden Calf", "Water from Rock"],
        correctOrder: [3, 1, 0, 5, 2, 4],
        principle: principles.storyFlow,
        clueRevealed: "Salvation (Passover) always comes before law - grace precedes obedience.",
        points: 15
      }
    ],
    finalAnswer: {
      type: "truth",
      answer: "Salvation by the blood of the Lamb",
      hint: "What the Passover lamb did for Israel, this Person did for the world.",
      explanation: "The Exodus is the great type of salvation. Egypt represents bondage to sin, Pharaoh represents Satan, the plagues represent God's judgment, and the Passover Lamb represents Jesus Christ whose blood saves us from death. Just as Israel was delivered by blood and through water, we are saved by Christ's blood and baptism.",
      verse: "1 Peter 1:18-19 - Ye were not redeemed with corruptible things... But with the precious blood of Christ, as of a lamb without blemish and without spot."
    }
  },

  // ROOM 3: The Prophet's Chamber
  {
    id: "prophets-chamber",
    title: "The Prophet's Chamber",
    theme: "Prophecy",
    description: "Decode Daniel's visions to discover the timeline of world history and the coming kingdom.",
    storyIntro: "You enter a chamber filled with ancient scrolls. Daniel's prophecies lie before you - sealed until the time of the end. Now that seal is broken. Decode the visions of beasts and kingdoms to discover what God has revealed about history's climax...",
    difficulty: "hard",
    timeLimit: 35,
    backgroundGradient: "from-purple-900 via-indigo-800 to-blue-700",
    icon: "🔮",
    puzzles: [
      {
        id: "proph-1",
        type: "match",
        question: "Match each metal in Nebuchadnezzar's dream (Daniel 2) to its kingdom:",
        pairs: [
          { left: "Gold Head", right: "Babylon" },
          { left: "Silver Chest", right: "Medo-Persia" },
          { left: "Bronze Thighs", right: "Greece" },
          { left: "Iron Legs", right: "Rome" }
        ],
        principle: principles.prophecy,
        clueRevealed: "After these earthly kingdoms, a STONE cut without hands destroys them all.",
        points: 10
      },
      {
        id: "proph-2",
        type: "riddle",
        question: "I am a time prophecy in Daniel 9. 70 of me are determined upon your people. Each of me equals 7 years. What am I?",
        answer: "weeks",
        principle: principles.prophecy,
        clueRevealed: "490 years from the decree to restore Jerusalem leads to Messiah the Prince.",
        points: 10
      },
      {
        id: "proph-3",
        type: "multiple-choice",
        question: "In Daniel 7, the 'little horn' that speaks great words against the Most High represents what power?",
        options: ["Greece", "Babylon", "Papal Rome", "Medo-Persia"],
        correctOption: 2,
        principle: principles.prophecy,
        clueRevealed: "This power would 'think to change times and laws' - but the true Kingdom is coming.",
        points: 15
      },
      {
        id: "proph-4",
        type: "fill-blank",
        question: "Daniel 2:44 says God will set up a kingdom that shall never be _______.",
        answer: "destroyed",
        principle: principles.timeZone,
        clueRevealed: "All earthly kingdoms fall, but ONE kingdom stands forever.",
        points: 10
      },
      {
        id: "proph-5",
        type: "sequence",
        question: "Arrange the prophetic time periods from shortest to longest:",
        items: ["1260 days/years", "2300 evenings & mornings", "70 weeks (490 years)", "42 months", "Time, times, half a time"],
        correctOrder: [3, 4, 0, 2, 1],
        principle: principles.prophecy,
        clueRevealed: "All prophecy points to ONE event: The establishment of God's eternal kingdom through His Son.",
        points: 15
      }
    ],
    finalAnswer: {
      type: "account",
      answer: "The Second Coming of Christ and the establishment of God's eternal kingdom",
      hint: "What is the 'stone cut without hands' that destroys all earthly kingdoms?",
      explanation: "Daniel's prophecies reveal the rise and fall of world empires - Babylon, Medo-Persia, Greece, Rome, and divided Europe. But the climax is not another earthly kingdom. The stone that destroys the image is the kingdom of God, established at Christ's second coming. This kingdom, unlike all others, will never be destroyed but will stand forever.",
      verse: "Daniel 2:44 - In the days of these kings shall the God of heaven set up a kingdom, which shall never be destroyed: and the kingdom shall not be left to other people, but it shall break in pieces and consume all these kingdoms, and it shall stand for ever."
    }
  },

  // ROOM 4: Garden of Parables
  {
    id: "garden-parables",
    title: "Garden of Parables",
    theme: "Parables",
    description: "Walk through Jesus' parables to discover the secrets of the kingdom of heaven.",
    storyIntro: "You find yourself in a beautiful garden where seeds are being sown, trees bear fruit, and workers tend vineyards. But this is no ordinary garden - it is the garden of Christ's parables. Unlock each story's meaning to discover the mystery of God's kingdom...",
    difficulty: "easy",
    timeLimit: 20,
    backgroundGradient: "from-green-800 via-emerald-700 to-teal-600",
    icon: "🌱",
    puzzles: [
      {
        id: "para-1",
        type: "multiple-choice",
        question: "In the Parable of the Sower, what does the seed represent?",
        options: ["Good works", "The Word of God", "Faith", "The Church"],
        correctOption: 1,
        principle: principles.nature,
        clueRevealed: "The Sower spreads the Word - but who is the Sower?",
        points: 10
      },
      {
        id: "para-2",
        type: "fill-blank",
        question: "In the Parable of the Mustard Seed, the kingdom of heaven starts small but grows into the greatest of _______.",
        answer: "herbs",
        principle: principles.nature,
        clueRevealed: "God's kingdom grows from the smallest beginning to fill the earth.",
        points: 10
      },
      {
        id: "para-3",
        type: "riddle",
        question: "I am found in a field, worth more than all a man owns. He sells everything to buy the field and possess me. What am I?",
        answer: "treasure",
        principle: principles.christConcentration,
        clueRevealed: "The kingdom is worth everything - but also, Christ gave everything to purchase US.",
        points: 10
      },
      {
        id: "para-4",
        type: "match",
        question: "Match each parable element to its meaning:",
        pairs: [
          { left: "Good Seed (Wheat)", right: "Children of the Kingdom" },
          { left: "Tares (Weeds)", right: "Children of the Wicked One" },
          { left: "Harvest", right: "End of the World" },
          { left: "Field", right: "The World" }
        ],
        principle: principles.typology,
        clueRevealed: "The Sower of good seed is the Son of Man - the ONE who plants the kingdom.",
        points: 15
      },
      {
        id: "para-5",
        type: "sequence",
        question: "Arrange these parable images from smallest to largest impact:",
        items: ["Leaven in meal", "Mustard seed", "Single pearl", "Ten virgins", "Sower's seed"],
        correctOrder: [1, 0, 2, 4, 3],
        principle: principles.patterns,
        clueRevealed: "All parables point to ONE person: the King of the Kingdom.",
        points: 15
      }
    ],
    finalAnswer: {
      type: "person",
      answer: "Jesus Christ - The King of the Kingdom",
      hint: "Who is the Sower, the Owner of the Field, the Bridegroom, and the Lord of the Harvest?",
      explanation: "Every parable of Jesus reveals aspects of God's kingdom, and at the center of every kingdom is a King. Jesus is the Sower who spreads the Word, the Owner who planted good seed, the Merchant who sold all for the pearl, the Bridegroom for whom the virgins wait, and the Lord of the Harvest who separates wheat from tares. The kingdom of heaven is not just a place - it is wherever Jesus reigns as King.",
      verse: "Matthew 13:37-38 - He that soweth the good seed is the Son of man; The field is the world; the good seed are the children of the kingdom."
    }
  },

  // ROOM 5: Creation Code
  {
    id: "creation-code",
    title: "Creation Code",
    theme: "Creation",
    description: "Decode the patterns of Creation Week to discover the blueprint for redemption.",
    storyIntro: "In the beginning... You stand at the edge of a formless void, watching as light pierces the darkness. Each day of creation holds a code - a pattern that will be repeated throughout salvation history. Crack the code to understand God's master plan...",
    difficulty: "medium",
    timeLimit: 25,
    backgroundGradient: "from-blue-900 via-cyan-800 to-sky-600",
    icon: "🌍",
    puzzles: [
      {
        id: "crea-1",
        type: "sequence",
        question: "Arrange the days of creation in correct order:",
        items: ["Dry land & vegetation", "Sun, moon, stars", "Light", "Sky & waters separated", "Sea creatures & birds", "Land animals & humans", "Sabbath rest"],
        correctOrder: [2, 3, 0, 1, 4, 5, 6],
        principle: principles.patterns,
        clueRevealed: "God worked six days and rested the seventh - a pattern repeated in the week of redemption.",
        points: 10
      },
      {
        id: "crea-2",
        type: "riddle",
        question: "I was the first thing God created, separating what was from what was not. Without me, nothing else could be seen. John says the true version of me came into the world. What am I?",
        answer: "light",
        principle: principles.typology,
        clueRevealed: "The first act of creation points to the true Light - the ONE who enlightens every person.",
        points: 10
      },
      {
        id: "crea-3",
        type: "multiple-choice",
        question: "On which day did God create the Sabbath, and what does its position in the week signify?",
        options: ["Day 1 - New beginnings", "Day 4 - Center of the week", "Day 6 - Completion of work", "Day 7 - Rest after finished work"],
        correctOption: 3,
        principle: principles.sanctuary,
        clueRevealed: "Just as God rested after creation, Christ rested in the tomb after crying 'It is FINISHED.'",
        points: 10
      },
      {
        id: "crea-4",
        type: "fill-blank",
        question: "Genesis 1:26 says 'Let US make man in OUR image.' This plural language hints at the _______ nature of God.",
        answer: "triune",
        principle: principles.observation,
        clueRevealed: "Father, Son, and Spirit were all present at creation - and at redemption.",
        points: 10
      },
      {
        id: "crea-5",
        type: "match",
        question: "Match each creation day to its redemption parallel:",
        pairs: [
          { left: "Day 1: Light", right: "Christ the Light of the World" },
          { left: "Day 6: Man created", right: "Christ the Second Adam" },
          { left: "Day 7: Sabbath rest", right: "Christ rests in tomb" },
          { left: "Eden garden", right: "Gethsemane garden" }
        ],
        principle: principles.parallels,
        clueRevealed: "Creation and redemption follow the same pattern because they share the same Author.",
        points: 15
      }
    ],
    finalAnswer: {
      type: "truth",
      answer: "Jesus Christ is the Creator who became the Redeemer",
      hint: "Who was present at creation AND at the cross, resting on the seventh day in both cases?",
      explanation: "The creation account is not just history - it's prophecy. The same Jesus who created the world in six days and rested on the seventh also accomplished redemption on 'Preparation Day' (Friday) and rested in the tomb on Sabbath. John 1:1-3 reveals that 'all things were made by Him' - the Word who became flesh. The Creator became the Redeemer, and creation week is the template for salvation week.",
      verse: "Colossians 1:16-17 - For by him were all things created... And he is before all things, and by him all things consist."
    }
  },

  // ROOM 6: The Throne Room
  {
    id: "throne-room",
    title: "The Throne Room",
    theme: "Revelation",
    description: "Enter the heavenly throne room and discover who is worthy to open the sealed book.",
    storyIntro: "A door opens in heaven. Before you is a throne with One seated upon it, surrounded by living creatures and 24 elders. A sealed book lies in the hand of Him who sits on the throne. No one is found worthy to open it - until... Solve the puzzles to discover who breaks the seals.",
    difficulty: "hard",
    timeLimit: 30,
    backgroundGradient: "from-yellow-600 via-amber-500 to-orange-400",
    icon: "👑",
    puzzles: [
      {
        id: "thro-1",
        type: "riddle",
        question: "I have seven eyes and seven horns. I look like I have been slain, yet I stand alive. I am called by two animal names - one fierce, one gentle. Who am I?",
        answer: "lamb",
        principle: principles.prophecy,
        clueRevealed: "The Lamb who was slain is the only one worthy to open the seals.",
        points: 10
      },
      {
        id: "thro-2",
        type: "multiple-choice",
        question: "In Revelation 5, why is the Lamb worthy to open the sealed book?",
        options: ["He created all things", "He was slain and redeemed people by His blood", "He destroyed Satan", "He judges the wicked"],
        correctOption: 1,
        principle: principles.christConcentration,
        clueRevealed: "Worthiness comes not from power alone, but from sacrificial love.",
        points: 10
      },
      {
        id: "thro-3",
        type: "fill-blank",
        question: "The four living creatures and 24 elders sing: 'Worthy is the Lamb that was slain to receive power, and riches, and wisdom, and strength, and honour, and glory, and _______.'",
        answer: "blessing",
        principle: principles.observation,
        clueRevealed: "Seven attributes of worthiness - complete and perfect praise.",
        points: 10
      },
      {
        id: "thro-4",
        type: "sequence",
        question: "Arrange the seven seals in order of opening:",
        items: ["Red horse - War", "Pale horse - Death", "White horse - Conquest", "Great earthquake", "Black horse - Famine", "Souls under altar", "Silence in heaven"],
        correctOrder: [2, 0, 4, 1, 5, 3, 6],
        principle: principles.prophecy,
        clueRevealed: "The One who opens the seals controls history itself.",
        points: 15
      },
      {
        id: "thro-5",
        type: "match",
        question: "Match the Lamb's titles in Revelation to their meanings:",
        pairs: [
          { left: "Lion of Judah", right: "Royal Conquering King" },
          { left: "Root of David", right: "Source of David's line" },
          { left: "Lamb slain", right: "Sacrificial Savior" },
          { left: "King of kings", right: "Supreme Ruler" }
        ],
        principle: principles.christConcentration,
        clueRevealed: "All titles point to ONE person who is both Sacrifice and Sovereign.",
        points: 15
      }
    ],
    finalAnswer: {
      type: "person",
      answer: "Jesus Christ - The Lamb of God",
      hint: "He is both the Lion who conquers and the Lamb who was slain.",
      explanation: "In the throne room of Revelation, when John weeps because no one can open the sealed book, he is told to behold the Lion of Judah - but when he looks, he sees a Lamb that had been slain. This is the great paradox of the gospel: Jesus conquers not by force but by sacrifice. He is worthy because He was slain and redeemed people by His blood from every tribe and nation. The Lamb on the throne is the center of all worship in heaven.",
      verse: "Revelation 5:12 - Worthy is the Lamb that was slain to receive power, and riches, and wisdom, and strength, and honour, and glory, and blessing."
    }
  },

  // ROOM 7: The Feast Calendar
  {
    id: "feast-calendar",
    title: "The Feast Calendar",
    theme: "Feasts",
    description: "Walk through Israel's seven annual feasts to discover God's prophetic calendar.",
    storyIntro: "You hold an ancient Hebrew calendar in your hands. Seven sacred appointments are marked - feasts that God commanded Israel to keep forever. But these are not mere holidays. Each feast is a prophetic shadow pointing to events in the plan of salvation. Decode the calendar to see the full picture...",
    difficulty: "medium",
    timeLimit: 25,
    backgroundGradient: "from-rose-800 via-pink-700 to-red-600",
    icon: "📅",
    puzzles: [
      {
        id: "feas-1",
        type: "sequence",
        question: "Arrange the seven feasts in their calendar order (Spring to Fall):",
        items: ["Day of Atonement", "Passover", "Feast of Tabernacles", "Pentecost", "Unleavened Bread", "Feast of Trumpets", "Firstfruits"],
        correctOrder: [1, 4, 6, 3, 5, 0, 2],
        principle: principles.feasts,
        clueRevealed: "The spring feasts were fulfilled at Christ's first coming; the fall feasts await fulfillment.",
        points: 15
      },
      {
        id: "feas-2",
        type: "match",
        question: "Match each spring feast to its New Testament fulfillment:",
        pairs: [
          { left: "Passover", right: "Christ's crucifixion" },
          { left: "Unleavened Bread", right: "Christ's burial" },
          { left: "Firstfruits", right: "Christ's resurrection" },
          { left: "Pentecost", right: "Outpouring of Holy Spirit" }
        ],
        principle: principles.feasts,
        clueRevealed: "Every spring feast was fulfilled on its EXACT calendar day!",
        points: 15
      },
      {
        id: "feas-3",
        type: "riddle",
        question: "I am the only feast that falls on the 10th day of the 7th month. On this day, the high priest enters the Most Holy Place. Israel afflicts their souls, for on this day they are cleansed from sin. What feast am I?",
        answer: "day of atonement",
        principle: principles.feasts,
        clueRevealed: "This feast points to a final judgment work in heaven before Christ returns.",
        points: 10
      },
      {
        id: "feas-4",
        type: "multiple-choice",
        question: "The Feast of Trumpets comes 10 days before the Day of Atonement. In prophecy, what does this feast represent?",
        options: ["Creation week", "The Second Coming warning", "Pentecost", "The cross"],
        correctOption: 1,
        principle: principles.prophecy,
        clueRevealed: "The trumpets sound a warning: Judgment is coming! Prepare to meet your God!",
        points: 10
      },
      {
        id: "feas-5",
        type: "fill-blank",
        question: "The Feast of Tabernacles, also called Booths or _______, will be fulfilled when God's people finally dwell with Him in the New Earth.",
        answer: "ingathering",
        principle: principles.timeZone,
        clueRevealed: "The final feast celebrates the ultimate harvest - God dwelling with His people forever.",
        points: 10
      }
    ],
    finalAnswer: {
      type: "truth",
      answer: "God's prophetic calendar leads to the restoration of all things through Christ",
      hint: "The feasts form a prophetic timeline from the Cross to the New Earth.",
      explanation: "The seven feasts of Israel are God's prophetic calendar for salvation history. The spring feasts (Passover, Unleavened Bread, Firstfruits, Pentecost) were all fulfilled at Christ's first coming - on their exact calendar days! The fall feasts (Trumpets, Day of Atonement, Tabernacles) point to Christ's second coming: the warning message, the pre-advent judgment, and the final ingathering when God dwells with His people forever.",
      verse: "Colossians 2:16-17 - Let no man therefore judge you in meat, or in drink, or in respect of an holyday, or of the new moon, or of the sabbath days: Which are a shadow of things to come; but the body is of Christ."
    }
  },

  // ROOM 8: The Trial of Faith
  {
    id: "trial-faith",
    title: "The Trial of Faith",
    theme: "Abraham",
    description: "Walk with Abraham through his greatest test and discover the Gospel of substitution.",
    storyIntro: "Three days you have walked with Abraham and Isaac up Mount Moriah. Isaac carries the wood, Abraham carries the fire and knife. 'Father, where is the lamb?' Isaac asks. Solve the mysteries of this trial to discover God's answer that echoes through eternity...",
    difficulty: "medium",
    timeLimit: 25,
    backgroundGradient: "from-stone-800 via-amber-900 to-yellow-800",
    icon: "⛰️",
    puzzles: [
      {
        id: "tria-1",
        type: "riddle",
        question: "I am a mountain with two peaks. On one, Abraham offered Isaac. On the other, centuries later, Another was offered. What mountain am I?",
        answer: "moriah",
        principle: principles.parallels,
        clueRevealed: "Mount Moriah = Temple Mount = Calvary. Same mountain, same sacrifice pattern.",
        points: 10
      },
      {
        id: "tria-2",
        type: "fill-blank",
        question: "When Isaac asked about the sacrifice, Abraham prophetically answered: 'God will provide himself a ______ for a burnt offering.'",
        answer: "lamb",
        principle: principles.typology,
        clueRevealed: "Abraham spoke prophecy: God Himself would provide the Lamb - His own Son.",
        points: 10
      },
      {
        id: "tria-3",
        type: "multiple-choice",
        question: "How many days did Abraham travel to reach Mount Moriah, and what does this number typically symbolize?",
        options: ["7 days - Completion", "40 days - Testing", "3 days - Resurrection", "12 days - God's people"],
        correctOption: 2,
        principle: principles.patterns,
        clueRevealed: "Isaac was 'dead' in Abraham's heart for 3 days - then received back as from the dead.",
        points: 10
      },
      {
        id: "tria-4",
        type: "match",
        question: "Match the Genesis 22 elements to their Gospel parallels:",
        pairs: [
          { left: "Isaac carries wood", right: "Jesus carries cross" },
          { left: "Only begotten son", right: "God's only Son" },
          { left: "Ram in thicket", right: "Christ our substitute" },
          { left: "Received back 'from dead'", right: "Resurrection" }
        ],
        principle: principles.typology,
        clueRevealed: "The binding of Isaac is the Gospel in picture form.",
        points: 15
      },
      {
        id: "tria-5",
        type: "sequence",
        question: "Arrange the events of Genesis 22 in order:",
        items: ["Abraham names place 'Jehovah-Jireh'", "Abraham builds altar", "Angel stops Abraham", "Abraham sees ram caught", "Isaac asks about lamb", "Three-day journey begins"],
        correctOrder: [5, 4, 1, 2, 3, 0],
        principle: principles.storyFlow,
        clueRevealed: "The story ends with a name that means 'The LORD Will Provide.'",
        points: 15
      }
    ],
    finalAnswer: {
      type: "truth",
      answer: "God provides a substitute - the ram for Isaac, Jesus for us",
      hint: "What did the ram caught in the thicket represent, and what name did Abraham give the place?",
      explanation: "The binding of Isaac is one of the clearest types of the Gospel in the Old Testament. Isaac, the 'only son' whom Abraham loved, was offered on Mount Moriah - the same mountain where Jesus would be crucified centuries later. But God provided a substitute: a ram caught in a thicket (crown of thorns!). Abraham named the place 'Jehovah-Jireh' - The LORD Will Provide. God provided His own Son as our substitute, the Lamb who takes away the sin of the world.",
      verse: "Genesis 22:8 - And Abraham said, My son, God will provide himself a lamb for a burnt offering: so they went both of them together."
    }
  },

  // ROOM 9: The Serpent and the Seed
  {
    id: "serpent-seed",
    title: "The Serpent and the Seed",
    theme: "Genesis 3",
    description: "Decode the first prophecy ever given and trace the conflict through Scripture.",
    storyIntro: "You stand in the Garden of Eden after the Fall. God speaks a curse upon the serpent, but hidden within is the first promise of salvation. This single verse - Genesis 3:15 - will echo through every book of the Bible. Decode the Protoevangelium to understand the cosmic conflict...",
    difficulty: "hard",
    timeLimit: 30,
    backgroundGradient: "from-green-900 via-emerald-800 to-lime-700",
    icon: "🐍",
    puzzles: [
      {
        id: "serp-1",
        type: "fill-blank",
        question: "Genesis 3:15 - 'I will put enmity between thee and the woman, and between thy seed and her _____.'",
        answer: "seed",
        principle: principles.observation,
        clueRevealed: "The 'seed of the woman' is unusual - seed normally comes through the man (virgin birth prophecy!).",
        points: 10
      },
      {
        id: "serp-2",
        type: "riddle",
        question: "I am a wound to the head that is fatal. Though the serpent strikes at the heel, he receives me instead. What am I?",
        answer: "bruise",
        principle: principles.typology,
        clueRevealed: "The serpent bruises the heel (temporary wound), but the Seed crushes the head (fatal blow).",
        points: 10
      },
      {
        id: "serp-3",
        type: "multiple-choice",
        question: "In Genesis 3:15, who is the 'seed of the woman' that would crush the serpent's head?",
        options: ["Adam", "Abel", "Abraham", "Jesus Christ"],
        correctOption: 3,
        principle: principles.christConcentration,
        clueRevealed: "Only one person in history was born of a woman alone, without a human father.",
        points: 10
      },
      {
        id: "serp-4",
        type: "match",
        question: "Match the serpent imagery through Scripture:",
        pairs: [
          { left: "Genesis 3 - Serpent", right: "Satan's first appearance" },
          { left: "Numbers 21 - Bronze serpent", right: "Type of Christ lifted up" },
          { left: "Isaiah 27:1 - Leviathan", right: "Dragon to be destroyed" },
          { left: "Revelation 12:9 - Dragon", right: "Satan identified" }
        ],
        principle: principles.parallels,
        clueRevealed: "The serpent of Eden is explicitly identified as Satan in Revelation.",
        points: 15
      },
      {
        id: "serp-5",
        type: "sequence",
        question: "Trace the 'seed of the woman' promise through these figures (chronological order):",
        items: ["David - 'thy seed upon thy throne'", "Abraham - 'in thy seed all nations blessed'", "Eve - 'I have gotten a man from the LORD'", "Mary - 'that holy thing born of thee'", "Genesis 3:15 - Original promise"],
        correctOrder: [4, 2, 1, 0, 3],
        principle: principles.storyFlow,
        clueRevealed: "The seed promise narrows: Woman → Seth's line → Abraham → David → Mary → JESUS.",
        points: 15
      }
    ],
    finalAnswer: {
      type: "person",
      answer: "Jesus Christ - The Seed of the Woman who crushes Satan",
      hint: "Who was born of a woman without a human father, and whose death (heel bruised) destroyed Satan's power (head crushed)?",
      explanation: "Genesis 3:15 is called the Protoevangelium - the first Gospel. God promised that the 'seed of the woman' (note: not seed of the man - pointing to virgin birth) would crush the serpent's head while being bruised on the heel. This prophecy traces through Scripture: from Eve to Seth to Abraham to David to Mary, until finally Jesus Christ - born of a virgin, bruised at the cross, but rising to crush Satan's power forever.",
      verse: "Galatians 4:4 - But when the fulness of the time was come, God sent forth his Son, made of a woman, made under the law, to redeem them that were under the law."
    }
  },

  // ROOM 10: The Upper Room
  {
    id: "upper-room",
    title: "The Upper Room",
    theme: "Last Supper",
    description: "Join the disciples in the Upper Room and discover the new covenant instituted that night.",
    storyIntro: "It is Thursday evening, the 14th of Nisan. You climb the stairs to a large upper room where Jesus reclines with His twelve disciples. Tonight, the Passover meal will take on new meaning. Solve the mysteries of this sacred night to understand what Jesus was truly instituting...",
    difficulty: "medium",
    timeLimit: 25,
    backgroundGradient: "from-indigo-900 via-violet-800 to-purple-700",
    icon: "🍷",
    puzzles: [
      {
        id: "uppe-1",
        type: "fill-blank",
        question: "Jesus took bread, broke it, and said, 'This is my ______ which is given for you.'",
        answer: "body",
        principle: principles.sanctuary,
        clueRevealed: "The bread of the Passover becomes the bread of His broken body.",
        points: 10
      },
      {
        id: "uppe-2",
        type: "multiple-choice",
        question: "When Jesus washed the disciples' feet, what lesson was He teaching?",
        options: ["Ritual cleanliness", "Jewish tradition", "Servant leadership", "Baptism"],
        correctOption: 2,
        principle: principles.christConcentration,
        clueRevealed: "The King of kings took the role of the lowest servant.",
        points: 10
      },
      {
        id: "uppe-3",
        type: "riddle",
        question: "I am the cup Jesus blessed at the Last Supper. I represent something that would be poured out for many. What do I contain symbolically?",
        answer: "blood",
        principle: principles.typology,
        clueRevealed: "The cup of the new covenant - His blood shed for the remission of sins.",
        points: 10
      },
      {
        id: "uppe-4",
        type: "match",
        question: "Match the Passover elements to their new covenant meanings:",
        pairs: [
          { left: "Unleavened bread", right: "Christ's sinless body" },
          { left: "Passover lamb", right: "Christ our sacrifice" },
          { left: "Cup of wine", right: "Christ's blood of the covenant" },
          { left: "Bitter herbs", right: "Suffering and affliction" }
        ],
        principle: principles.typology,
        clueRevealed: "Every element of Passover finds its fulfillment in Christ.",
        points: 15
      },
      {
        id: "uppe-5",
        type: "sequence",
        question: "Arrange the Upper Room events in order:",
        items: ["Jesus washes feet", "Judas leaves", "Jesus breaks bread", "Jesus institutes cup", "Jesus predicts Peter's denial", "Disciples argue who is greatest"],
        correctOrder: [5, 0, 2, 3, 1, 4],
        principle: principles.storyFlow,
        clueRevealed: "Even as they argued about greatness, Jesus showed them the way of the cross.",
        points: 15
      }
    ],
    finalAnswer: {
      type: "truth",
      answer: "The New Covenant sealed in Christ's blood",
      hint: "What did Jesus institute that night that would replace the Passover lamb?",
      explanation: "On the night He was betrayed, Jesus transformed the Passover meal into the Lord's Supper, instituting the New Covenant. The bread represents His body broken for us; the cup represents His blood shed for the remission of sins. Just as the old covenant was sealed with the blood of animals (Exodus 24), the new covenant is sealed with Christ's own blood. This is why Jesus said, 'This cup is the new testament (covenant) in my blood.'",
      verse: "Luke 22:20 - Likewise also the cup after supper, saying, This cup is the new testament in my blood, which is shed for you."
    }
  },

  // ROOM 11: The Mount of Olives
  {
    id: "mount-olives",
    title: "The Mount of Olives",
    theme: "Olivet Discourse",
    description: "Sit with Jesus on the Mount of Olives and decode His prophecy about the end times.",
    storyIntro: "The disciples have just shown Jesus the magnificent temple stones. 'Not one shall be left upon another,' He says. Now, on the Mount of Olives overlooking Jerusalem, they ask privately: 'When shall these things be?' Jesus answers with the most detailed prophecy of the end times. Decode it to understand what's coming...",
    difficulty: "hard",
    timeLimit: 35,
    backgroundGradient: "from-slate-800 via-gray-700 to-zinc-600",
    icon: "🌿",
    puzzles: [
      {
        id: "oliv-1",
        type: "multiple-choice",
        question: "In Matthew 24, what is the FIRST sign Jesus warns His disciples about?",
        options: ["Wars and rumors of wars", "False Christs and deception", "Earthquakes", "Famines"],
        correctOption: 1,
        principle: principles.observation,
        clueRevealed: "Jesus' first warning is about DECEPTION - 'Take heed that no man deceive you.'",
        points: 10
      },
      {
        id: "oliv-2",
        type: "fill-blank",
        question: "Jesus said: 'And this gospel of the kingdom shall be preached in all the world for a witness unto all nations; and then shall the _____ come.'",
        answer: "end",
        principle: principles.prophecy,
        clueRevealed: "The Gospel reaching all nations is the sign that precedes the end.",
        points: 10
      },
      {
        id: "oliv-3",
        type: "riddle",
        question: "I am mentioned by Jesus in Matthew 24 and by Daniel in Daniel 12. I stand in the holy place where I ought not. I cause desolation. What am I called?",
        answer: "abomination of desolation",
        principle: principles.parallels,
        clueRevealed: "This sign marked both the destruction of Jerusalem (70 AD) and points to end-time events.",
        points: 15
      },
      {
        id: "oliv-4",
        type: "match",
        question: "Match Jesus' descriptions to what He's describing:",
        pairs: [
          { left: "As lightning from east to west", right: "His visible return" },
          { left: "Two in the field, one taken", right: "Separation at His coming" },
          { left: "As in days of Noah", right: "World conditions before return" },
          { left: "Fig tree putting forth leaves", right: "Signs showing nearness" }
        ],
        principle: principles.prophecy,
        clueRevealed: "His coming will be unmistakable - like lightning, not secret.",
        points: 15
      },
      {
        id: "oliv-5",
        type: "sequence",
        question: "Arrange these end-time signs in the order Jesus gives them:",
        items: ["Sun darkened, moon not give light", "Great tribulation", "False prophets arise", "Gospel preached to all", "Wars and famines", "Sign of Son of Man appears"],
        correctOrder: [4, 2, 3, 1, 0, 5],
        principle: principles.storyFlow,
        clueRevealed: "After tribulation, cosmic signs, then the SON OF MAN appears in glory.",
        points: 15
      }
    ],
    finalAnswer: {
      type: "account",
      answer: "The Second Coming of Jesus Christ in power and glory",
      hint: "What event does Jesus describe as the climax of all these signs?",
      explanation: "The Olivet Discourse (Matthew 24, Mark 13, Luke 21) is Jesus' most detailed teaching about the end times. He describes the signs preceding His return: deception, wars, famines, earthquakes, persecution, Gospel proclamation, tribulation, and cosmic signs. The climax is His visible, glorious return - 'they shall see the Son of man coming in the clouds of heaven with power and great glory.' This is no secret coming - it is as visible as lightning across the sky.",
      verse: "Matthew 24:30 - And then shall appear the sign of the Son of man in heaven: and then shall all the tribes of the earth mourn, and they shall see the Son of man coming in the clouds of heaven with power and great glory."
    }
  },

  // ROOM 12: The Sealed Book
  {
    id: "sealed-book",
    title: "The Sealed Book",
    theme: "Daniel 12",
    description: "Unseal the prophecies of Daniel that were closed until the time of the end.",
    storyIntro: "Daniel is told to 'shut up the words, and seal the book, even to the time of the end.' You have been given the key to unseal what was hidden. 'Many shall run to and fro, and knowledge shall be increased.' The time has come - decode the final prophecies of Daniel...",
    difficulty: "expert",
    timeLimit: 40,
    backgroundGradient: "from-amber-900 via-orange-800 to-red-700",
    icon: "📜",
    puzzles: [
      {
        id: "seal-1",
        type: "riddle",
        question: "I am a time prophecy in Daniel. I am 2300 evenings and mornings. When I end, the sanctuary shall be cleansed. When do I begin?",
        answer: "457 bc",
        principle: principles.prophecy,
        clueRevealed: "2300 years from 457 BC leads to 1844 AD - the beginning of a new phase of Christ's ministry.",
        points: 15
      },
      {
        id: "seal-2",
        type: "fill-blank",
        question: "Daniel 12:4 says many shall run to and fro, and _________ shall be increased.",
        answer: "knowledge",
        principle: principles.timeZone,
        clueRevealed: "The 'time of the end' is marked by increased travel and knowledge - the modern age.",
        points: 10
      },
      {
        id: "seal-3",
        type: "multiple-choice",
        question: "The 70 weeks prophecy (Daniel 9:24-27) begins with a decree to restore Jerusalem. Which decree is this?",
        options: ["Cyrus 536 BC", "Darius 520 BC", "Artaxerxes 457 BC", "Nehemiah 444 BC"],
        correctOption: 2,
        principle: principles.prophecy,
        clueRevealed: "From 457 BC, count 69 weeks (483 years) to Messiah the Prince = 27 AD, Christ's baptism.",
        points: 15
      },
      {
        id: "seal-4",
        type: "match",
        question: "Match the time prophecies to their durations:",
        pairs: [
          { left: "70 weeks", right: "490 years" },
          { left: "2300 days", right: "2300 years" },
          { left: "1260 days", right: "1260 years" },
          { left: "Time, times, half a time", right: "3.5 years/1260 days" }
        ],
        principle: principles.prophecy,
        clueRevealed: "Day = Year principle unlocks the long prophetic timelines.",
        points: 15
      },
      {
        id: "seal-5",
        type: "sequence",
        question: "Arrange these prophetic events in their fulfillment order:",
        items: ["1844 - Sanctuary cleansing begins", "1798 - End of Papal supremacy", "508 - Daily removed", "457 BC - Decree to restore", "27 AD - Messiah baptized", "31 AD - Messiah cut off"],
        correctOrder: [3, 4, 5, 2, 1, 0],
        principle: principles.timeZone,
        clueRevealed: "The sealed prophecies have been unsealing in our time!",
        points: 15
      }
    ],
    finalAnswer: {
      type: "truth",
      answer: "Christ's heavenly ministry entered a new phase in 1844 - the pre-advent judgment",
      hint: "What began at the end of the 2300 days that fulfills the Day of Atonement type?",
      explanation: "Daniel's sealed prophecies reveal that in 1844, at the end of the 2300-day prophecy, Christ began a special work of judgment in the heavenly sanctuary - the antitypical Day of Atonement. This is the 'cleansing of the sanctuary' - not the earth, but the heavenly temple where Christ ministers. Just as the high priest entered the Most Holy Place once a year to cleanse the sanctuary, Christ entered the Most Holy Place of heaven to begin the investigative judgment before His return.",
      verse: "Daniel 8:14 - And he said unto me, Unto two thousand and three hundred days; then shall the sanctuary be cleansed."
    }
  },

  // ROOM 13: The Wilderness Journey
  {
    id: "wilderness-journey",
    title: "The Wilderness Journey",
    theme: "Numbers",
    description: "Travel with Israel through the wilderness and learn why one generation failed while another conquered.",
    storyIntro: "Forty years in the wilderness. An entire generation dies for their unbelief while their children prepare to enter the Promised Land. Each story of failure and faith holds lessons for God's people today. Journey through the wilderness to discover what made the difference...",
    difficulty: "medium",
    timeLimit: 25,
    backgroundGradient: "from-yellow-800 via-orange-700 to-red-600",
    icon: "🏜️",
    puzzles: [
      {
        id: "wild-1",
        type: "multiple-choice",
        question: "At Kadesh Barnea, 12 spies returned from Canaan. How many gave a faithful report?",
        options: ["None", "2 (Joshua and Caleb)", "10", "All 12"],
        correctOption: 1,
        principle: principles.fruit,
        clueRevealed: "Only those with faith saw the land - the rest saw only giants.",
        points: 10
      },
      {
        id: "wild-2",
        type: "riddle",
        question: "I was lifted up in the wilderness, and all who looked at me were healed. I was made of bronze and shaped like the enemy. Jesus said He would be lifted up like me. What am I?",
        answer: "serpent",
        principle: principles.typology,
        clueRevealed: "As Moses lifted the serpent, so the Son of Man must be lifted up (John 3:14).",
        points: 10
      },
      {
        id: "wild-3",
        type: "fill-blank",
        question: "Paul writes that the rock that followed Israel in the wilderness was _______.",
        answer: "christ",
        principle: principles.typology,
        clueRevealed: "Christ was present with Israel - the Rock, the Manna, the Cloud.",
        points: 10
      },
      {
        id: "wild-4",
        type: "match",
        question: "Match the wilderness provisions to their spiritual fulfillment:",
        pairs: [
          { left: "Manna from heaven", right: "Christ the Bread of Life" },
          { left: "Water from rock", right: "Christ the Living Water" },
          { left: "Pillar of cloud/fire", right: "Christ our Guide" },
          { left: "Brazen serpent", right: "Christ lifted on cross" }
        ],
        principle: principles.typology,
        clueRevealed: "Every wilderness provision pointed to Christ who sustains His people.",
        points: 15
      },
      {
        id: "wild-5",
        type: "sequence",
        question: "Arrange these wilderness events in chronological order:",
        items: ["Bronze serpent lifted", "Golden calf incident", "Red Sea crossing", "Water from rock at Horeb", "Spies sent to Canaan", "Crossing the Jordan"],
        correctOrder: [2, 1, 3, 4, 0, 5],
        principle: principles.storyFlow,
        clueRevealed: "Forty years of wandering because of unbelief - yet God never left them.",
        points: 15
      }
    ],
    finalAnswer: {
      type: "truth",
      answer: "Faith in God's promises is the key to entering His rest",
      hint: "What was the difference between the generation that died and the generation that conquered?",
      explanation: "The wilderness wandering is a powerful type of the Christian journey. Hebrews 3-4 explicitly applies this to us: 'They could not enter in because of unbelief.' The first generation saw the miracles but lacked faith; they saw giants instead of God. Joshua and Caleb believed God's promise and entered the land. The lesson: all the blessings of Christ (manna, water, guidance) are available, but only faith appropriates them. As Hebrews says, 'Let us labour therefore to enter into that rest.'",
      verse: "Hebrews 3:19 - So we see that they could not enter in because of unbelief."
    }
  },

  // ROOM 14: The Four Horsemen
  {
    id: "four-horsemen",
    title: "The Four Horsemen",
    theme: "Revelation 6",
    description: "Watch as the Lamb opens the seals and four horsemen ride through history.",
    storyIntro: "The Lamb takes the book sealed with seven seals. As each seal opens, a horse and rider emerge. White, Red, Black, Pale - each representing a phase of church history. Identify the horsemen to understand where we stand in prophecy...",
    difficulty: "hard",
    timeLimit: 30,
    backgroundGradient: "from-gray-900 via-red-900 to-black",
    icon: "🐎",
    puzzles: [
      {
        id: "hors-1",
        type: "match",
        question: "Match each horse color to its symbolic meaning:",
        pairs: [
          { left: "White horse", right: "Purity - Early church conquering" },
          { left: "Red horse", right: "Bloodshed - Persecution era" },
          { left: "Black horse", right: "Spiritual famine - Compromise" },
          { left: "Pale horse", right: "Death - Papal supremacy" }
        ],
        principle: principles.prophecy,
        clueRevealed: "The horses trace the decline from pure faith to spiritual death.",
        points: 15
      },
      {
        id: "hors-2",
        type: "riddle",
        question: "I am the fifth seal. I am not a horse, but souls crying out. We are under an altar, asking 'How long?' What are we wearing?",
        answer: "white robes",
        principle: principles.observation,
        clueRevealed: "The martyrs are given white robes - vindication before the judgment.",
        points: 10
      },
      {
        id: "hors-3",
        type: "multiple-choice",
        question: "Under the third seal (black horse), a 'measure of wheat for a penny' represents what?",
        options: ["Abundance of food", "Spiritual famine - Word becoming scarce", "Economic prosperity", "Agricultural blessing"],
        correctOption: 1,
        principle: principles.defCom,
        clueRevealed: "When the Word becomes scarce and sold for a price, spiritual darkness prevails.",
        points: 10
      },
      {
        id: "hors-4",
        type: "fill-blank",
        question: "The sixth seal describes cosmic signs: sun black as _______, moon as blood, stars falling.",
        answer: "sackcloth",
        principle: principles.prophecy,
        clueRevealed: "These signs (1780 Dark Day, 1833 star shower) signal we're in the final generation.",
        points: 10
      },
      {
        id: "hors-5",
        type: "sequence",
        question: "Arrange the seals in order:",
        items: ["Great earthquake - cosmic signs", "Silence in heaven", "Souls under altar", "Black horse - famine", "White horse - conquest", "Pale horse - death", "Red horse - war"],
        correctOrder: [4, 6, 3, 5, 2, 0, 1],
        principle: principles.storyFlow,
        clueRevealed: "The seventh seal leads to the trumpets - but first, silence before the storm.",
        points: 15
      }
    ],
    finalAnswer: {
      type: "account",
      answer: "The seven seals reveal church history from apostolic purity to Christ's return",
      hint: "What do the seals as a whole reveal about God's people through history?",
      explanation: "The seven seals of Revelation 6-8 provide a prophetic overview of Christian church history. The white horse represents the pure apostolic church conquering through the Gospel. The red horse shows the era of persecution under pagan Rome. The black horse represents the compromise and spiritual famine of the medieval period. The pale (green) horse shows the deadly results. The fifth seal reveals the martyrs awaiting vindication. The sixth seal's cosmic signs have been literally fulfilled (Dark Day 1780, Star Shower 1833). The seventh seal's silence prepares for the final events.",
      verse: "Revelation 6:2 - And I saw, and behold a white horse: and he that sat on him had a bow; and a crown was given unto him: and he went forth conquering, and to conquer."
    }
  },

  // ROOM 15: The Prodigal Returns
  {
    id: "prodigal-returns",
    title: "The Prodigal Returns",
    theme: "Luke 15",
    description: "Experience the Father's heart through the three parables of the lost.",
    storyIntro: "The Pharisees murmur: 'This man receiveth sinners!' Jesus responds with three parables - a lost sheep, a lost coin, a lost son. Each reveals something about how God seeks and saves the lost. Find yourself in these stories to understand the Father's heart...",
    difficulty: "easy",
    timeLimit: 20,
    backgroundGradient: "from-pink-800 via-rose-700 to-red-600",
    icon: "💔",
    puzzles: [
      {
        id: "prod-1",
        type: "fill-blank",
        question: "The shepherd left the _____ and nine to find the one that was lost.",
        answer: "ninety",
        principle: principles.christConcentration,
        clueRevealed: "The Shepherd values every single sheep - even one is worth leaving the ninety-nine.",
        points: 10
      },
      {
        id: "prod-2",
        type: "multiple-choice",
        question: "When the prodigal son 'came to himself,' what did he decide to say to his father?",
        options: ["'Pay me my wages'", "'I am no more worthy to be called thy son'", "'Give me another chance'", "'My brother owes me'"],
        correctOption: 1,
        principle: principles.fruit,
        clueRevealed: "True repentance acknowledges unworthiness yet trusts the Father's love.",
        points: 10
      },
      {
        id: "prod-3",
        type: "riddle",
        question: "I am what the father gave his returning son - a sign of family membership and authority. I go on the hand. What am I?",
        answer: "ring",
        principle: principles.observation,
        clueRevealed: "The ring, robe, and sandals show FULL restoration - not just as servant, but as son.",
        points: 10
      },
      {
        id: "prod-4",
        type: "match",
        question: "Match the elements of the Prodigal Son parable:",
        pairs: [
          { left: "Father", right: "God the Father" },
          { left: "Younger son", right: "Repentant sinner" },
          { left: "Elder brother", right: "Self-righteous religious" },
          { left: "Far country", right: "Life of sin" }
        ],
        principle: principles.typology,
        clueRevealed: "The father runs to the returning sinner - God actively seeks us!",
        points: 15
      },
      {
        id: "prod-5",
        type: "sequence",
        question: "Arrange the prodigal's journey in order:",
        items: ["Fed pigs, no one gave him food", "Father runs and kisses him", "Received his inheritance", "Wasted all in riotous living", "Came to himself", "Father makes a feast"],
        correctOrder: [2, 3, 0, 4, 1, 5],
        principle: principles.storyFlow,
        clueRevealed: "The lowest point becomes the turning point - 'he came to himself.'",
        points: 15
      }
    ],
    finalAnswer: {
      type: "truth",
      answer: "The Father actively seeks and joyfully receives repentant sinners",
      hint: "What is Jesus revealing about God's heart through these three parables?",
      explanation: "Jesus told these three parables to reveal the Father's heart for the lost. The shepherd SEEKS the lost sheep. The woman SEARCHES for the lost coin. The father WATCHES for the lost son. In all three, there is great JOY when the lost is found. This directly answered the Pharisees' criticism - Jesus receives sinners because the Father's heart rejoices over every one who repents. The prodigal was received not as a servant but as a son - full restoration through grace.",
      verse: "Luke 15:20 - But when he was yet a great way off, his father saw him, and had compassion, and ran, and fell on his neck, and kissed him."
    }
  },

  // ROOM 16: The Day of the Lord
  {
    id: "day-of-lord",
    title: "The Day of the Lord",
    theme: "Second Coming",
    description: "Piece together the prophets' descriptions of the great and terrible Day of the Lord.",
    storyIntro: "The prophets spoke of a day - the Day of the Lord - a day of both terror and triumph. From Joel to Zechariah to Thessalonians, the pieces come together. This is not just any day - it is THE day. Assemble the prophecies to prepare for what's coming...",
    difficulty: "hard",
    timeLimit: 30,
    backgroundGradient: "from-orange-600 via-red-700 to-purple-900",
    icon: "☀️",
    puzzles: [
      {
        id: "dlor-1",
        type: "fill-blank",
        question: "1 Thessalonians 5:2 - 'The day of the Lord so cometh as a _______ in the night.'",
        answer: "thief",
        principle: principles.parallels,
        clueRevealed: "Like a thief - UNEXPECTED for the unprepared, but not for those watching.",
        points: 10
      },
      {
        id: "dlor-2",
        type: "multiple-choice",
        question: "According to Malachi 4:5, who will God send 'before the coming of the great and dreadful day of the LORD'?",
        options: ["Moses", "Daniel", "Elijah", "Isaiah"],
        correctOption: 2,
        principle: principles.prophecy,
        clueRevealed: "An Elijah message prepares the way - turning hearts before the Lord comes.",
        points: 10
      },
      {
        id: "dlor-3",
        type: "match",
        question: "Match these 'Day of the Lord' descriptions to their sources:",
        pairs: [
          { left: "Sun to darkness, moon to blood", right: "Joel 2:31" },
          { left: "Earth melts with fervent heat", right: "2 Peter 3:10" },
          { left: "Lord descends with shout", right: "1 Thessalonians 4:16" },
          { left: "Every eye shall see Him", right: "Revelation 1:7" }
        ],
        principle: principles.parallels,
        clueRevealed: "Scripture paints a consistent picture: VISIBLE, AUDIBLE, COSMIC, UNIVERSAL.",
        points: 15
      },
      {
        id: "dlor-4",
        type: "riddle",
        question: "I am what happens to the righteous dead when Jesus returns. Paul says we shall be 'caught up together' with the living. What is this event often called?",
        answer: "rapture",
        principle: principles.timeZone,
        clueRevealed: "The dead in Christ rise FIRST, then together with the living, we meet the Lord in the air.",
        points: 10
      },
      {
        id: "dlor-5",
        type: "sequence",
        question: "Arrange these Second Coming events in Paul's order (1 Thess 4:16-17):",
        items: ["We meet Lord in the air", "Lord descends from heaven", "The shout", "Dead in Christ rise first", "Voice of archangel", "We are caught up together"},
        correctOrder: [1, 2, 4, 3, 5, 0],
        principle: principles.observation,
        clueRevealed: "Shout, voice, trumpet, resurrection, translation - nothing secret about this!",
        points: 15
      }
    ],
    finalAnswer: {
      type: "account",
      answer: "The literal, visible, audible return of Jesus Christ",
      hint: "Based on all these texts, what will the Second Coming actually be like?",
      explanation: "The 'Day of the Lord' throughout Scripture refers to Christ's second coming. It will be: VISIBLE ('every eye shall see Him'), AUDIBLE (shout, voice, trumpet), COSMIC (sun dark, stars fall, heavens shake), and UNIVERSAL (all nations mourn). There is no 'secret rapture' - the event is unmistakable. The righteous dead are raised, the living righteous transformed, and all meet the Lord in the air. For the unprepared, it is dreadful; for the watching, it is glorious.",
      verse: "1 Thessalonians 4:16-17 - For the Lord himself shall descend from heaven with a shout, with the voice of the archangel, and with the trump of God: and the dead in Christ shall rise first: Then we which are alive and remain shall be caught up together with them in the clouds, to meet the Lord in the air."
    }
  },

  // ROOM 17: The Armor of God
  {
    id: "armor-of-god",
    title: "The Armor of God",
    theme: "Ephesians 6",
    description: "Suit up with the whole armor of God to stand against the wiles of the devil.",
    storyIntro: "You stand in a Roman armory, but these weapons are not physical. Each piece of armor represents a spiritual reality. 'We wrestle not against flesh and blood...' Put on each piece correctly to understand how God equips His soldiers for spiritual battle...",
    difficulty: "easy",
    timeLimit: 20,
    backgroundGradient: "from-zinc-800 via-slate-700 to-gray-600",
    icon: "⚔️",
    puzzles: [
      {
        id: "armo-1",
        type: "match",
        question: "Match each piece of armor to what it represents:",
        pairs: [
          { left: "Belt", right: "Truth" },
          { left: "Breastplate", right: "Righteousness" },
          { left: "Shoes", right: "Gospel of peace" },
          { left: "Shield", right: "Faith" }
        ],
        principle: principles.typology,
        clueRevealed: "Each piece protects and empowers - but one piece is specifically offensive.",
        points: 15
      },
      {
        id: "armo-2",
        type: "fill-blank",
        question: "The shield of faith is able to quench all the fiery _______ of the wicked.",
        answer: "darts",
        principle: principles.dimensions,
        clueRevealed: "Faith extinguishes the enemy's attacks - doubts, temptations, accusations.",
        points: 10
      },
      {
        id: "armo-3",
        type: "riddle",
        question: "I am the only offensive weapon in the armor of God. I am called the sword of the Spirit. What am I?",
        answer: "word of god",
        principle: principles.defCom,
        clueRevealed: "Jesus defeated Satan's temptations with 'It is WRITTEN' - the Sword!",
        points: 10
      },
      {
        id: "armo-4",
        type: "multiple-choice",
        question: "According to Ephesians 6:18, what should accompany the armor of God?",
        options: ["Fasting", "Praying always", "Giving", "Singing"],
        correctOption: 1,
        principle: principles.observation,
        clueRevealed: "Prayer is the breath of the armor - praying always with all prayer and supplication.",
        points: 10
      },
      {
        id: "armo-5",
        type: "sequence",
        question: "Arrange the armor pieces in the order Paul lists them:",
        items: ["Sword of Spirit", "Shield of faith", "Breastplate of righteousness", "Shoes of gospel", "Belt of truth", "Helmet of salvation"],
        correctOrder: [4, 2, 3, 1, 5, 0],
        principle: principles.storyFlow,
        clueRevealed: "Stand therefore - HAVING put on the whole armor, not just parts.",
        points: 15
      }
    ],
    finalAnswer: {
      type: "truth",
      answer: "The Christian's victory comes through God's provision, not human effort",
      hint: "Why does Paul say to put on the WHOLE armor of God?",
      explanation: "The armor of God passage teaches that spiritual warfare requires spiritual weapons. Notice: it is GOD'S armor, not ours. Every piece - truth, righteousness, the Gospel, faith, salvation, the Word - is a gift from God, not human achievement. We 'put on' what He provides. The armor is complete; no piece can be omitted. The only offensive weapon is the Word of God - the same weapon Jesus used against Satan. Prayer energizes the entire armor.",
      verse: "Ephesians 6:11 - Put on the whole armour of God, that ye may be able to stand against the wiles of the devil."
    }
  },

  // ROOM 18: The Blood Covenant
  {
    id: "blood-covenant",
    title: "The Blood Covenant",
    theme: "Covenant",
    description: "Trace the scarlet thread of blood covenant from Eden to Calvary.",
    storyIntro: "A trail of blood runs through Scripture - from the first animal slain to clothe Adam and Eve, to the final Lamb slain before the foundation of the world. Understand the blood covenant to grasp why 'without shedding of blood there is no remission'...",
    difficulty: "medium",
    timeLimit: 25,
    backgroundGradient: "from-red-900 via-rose-800 to-pink-700",
    icon: "🩸",
    puzzles: [
      {
        id: "bloo-1",
        type: "riddle",
        question: "I am the first blood sacrifice in Scripture. God made me to cover Adam and Eve's nakedness. I am never named, but my skin became their covering. What am I?",
        answer: "animal",
        principle: principles.observation,
        clueRevealed: "The first sacrifice covered sin's nakedness - foreshadowing THE covering.",
        points: 10
      },
      {
        id: "bloo-2",
        type: "fill-blank",
        question: "Hebrews 9:22 - 'Without shedding of blood is no _________.'",
        answer: "remission",
        principle: principles.defCom,
        clueRevealed: "Sin's wages is death - blood represents life given to pay that wage.",
        points: 10
      },
      {
        id: "bloo-3",
        type: "sequence",
        question: "Arrange these blood covenant moments in biblical order:",
        items: ["Christ's blood at Calvary", "Abraham's covenant (animals split)", "Animal skins in Eden", "Passover lamb's blood", "Old covenant sealed (Exodus 24)", "New covenant cup (Last Supper)"],
        correctOrder: [2, 1, 4, 3, 5, 0],
        principle: principles.storyFlow,
        clueRevealed: "Every blood covenant pointed forward to THE blood covenant.",
        points: 15
      },
      {
        id: "bloo-4",
        type: "multiple-choice",
        question: "In the Old Testament covenant ceremony (Exodus 24), Moses sprinkled blood on both the altar and the people. What does this represent?",
        options: ["God's anger", "Punishment for sin", "Union between God and people", "Protection from enemies"],
        correctOption: 2,
        principle: principles.typology,
        clueRevealed: "Blood on both sides = covenant union. We are bound to God by blood.",
        points: 10
      },
      {
        id: "bloo-5",
        type: "match",
        question: "Match the blood types to their purpose:",
        pairs: [
          { left: "Abel's lamb", right: "Faith offering" },
          { left: "Passover blood", right: "Protection from death" },
          { left: "Day of Atonement blood", right: "Cleansing the sanctuary" },
          { left: "Christ's blood", right: "All of the above fulfilled" }
        ],
        principle: principles.typology,
        clueRevealed: "Every drop of sacrificial blood pointed to the one sacrifice that fulfills all.",
        points: 15
      }
    ],
    finalAnswer: {
      type: "truth",
      answer: "Christ's blood is the only means of salvation and covenant relationship with God",
      hint: "What does the blood of Christ accomplish that animal blood never could?",
      explanation: "The blood covenant runs through all Scripture. Every animal sacrifice was a teaching tool pointing to Christ. The blood of bulls and goats could never actually take away sin (Hebrews 10:4) - they pointed forward to the one sacrifice that could. Christ's blood accomplishes what all other blood sacrifices pictured: it cleanses from sin (1 John 1:7), redeems from slavery (Ephesians 1:7), establishes the new covenant (Luke 22:20), and brings us near to God (Ephesians 2:13).",
      verse: "Hebrews 9:12 - Neither by the blood of goats and calves, but by his own blood he entered in once into the holy place, having obtained eternal redemption for us."
    }
  },

  // ROOM 19: The New Jerusalem
  {
    id: "new-jerusalem",
    title: "The New Jerusalem",
    theme: "Revelation 21-22",
    description: "Explore the Holy City and discover what God has prepared for those who love Him.",
    storyIntro: "John sees a vision of the Holy City descending from heaven. Its streets are gold, its gates are pearl, its foundations are jewels. But the greatest glory is not the city's beauty - it's who dwells there. Explore every detail to understand the hope of all believers...",
    difficulty: "medium",
    timeLimit: 25,
    backgroundGradient: "from-yellow-400 via-amber-300 to-orange-200",
    icon: "🌇",
    puzzles: [
      {
        id: "newj-1",
        type: "fill-blank",
        question: "Revelation 21:3 - 'Behold, the tabernacle of God is with men, and he will _______ with them.'",
        answer: "dwell",
        principle: principles.sanctuary,
        clueRevealed: "The ultimate fulfillment of the sanctuary - God dwelling directly with His people!",
        points: 10
      },
      {
        id: "newj-2",
        type: "multiple-choice",
        question: "What is NOT found in the New Jerusalem?",
        options: ["The throne of God", "The tree of life", "A temple", "The Lamb"],
        correctOption: 2,
        principle: principles.observation,
        clueRevealed: "No temple - because 'the Lord God Almighty and the Lamb ARE the temple.'",
        points: 10
      },
      {
        id: "newj-3",
        type: "riddle",
        question: "I have twelve gates, each made of a single pearl. On each gate is written a name. Whose names are these?",
        answer: "twelve tribes of israel",
        principle: principles.patterns,
        clueRevealed: "The gates bear Israel's names; the foundations bear the apostles' names.",
        points: 10
      },
      {
        id: "newj-4",
        type: "match",
        question: "Match what is removed in the New Earth to what replaces it:",
        pairs: [
          { left: "Sea", right: "Crystal river of life" },
          { left: "Night", right: "Eternal day" },
          { left: "Death", right: "Eternal life" },
          { left: "Curse", right: "Blessing" }
        ],
        principle: principles.timeZone,
        clueRevealed: "Everything lost in Eden is restored - and more - in the New Jerusalem.",
        points: 15
      },
      {
        id: "newj-5",
        type: "sequence",
        question: "Arrange these New Jerusalem measurements and features:",
        items: ["Wall height: 144 cubits", "City length: 12,000 furlongs", "Foundations: 12 jewels", "Gates: 12 pearls", "City shape: cube/equal dimensions"},
        correctOrder: [1, 4, 3, 2, 0],
        principle: principles.observation,
        clueRevealed: "12 and its multiples everywhere - the number of God's people (12 tribes, 12 apostles, 144,000).",
        points: 15
      }
    ],
    finalAnswer: {
      type: "account",
      answer: "God dwelling with His people forever in the restored Eden",
      hint: "What is the ultimate purpose and joy of the New Jerusalem?",
      explanation: "The New Jerusalem is not just a beautiful city - it is the fulfillment of God's original purpose for creation. Eden had the tree of life; it returns. God walked with Adam in the garden; now He dwells permanently with His people. The sanctuary pattern is complete: no temple is needed because God Himself is present. 'They shall see His face' - the ultimate intimacy that sin had broken is fully restored. The New Jerusalem is Eden multiplied by infinity.",
      verse: "Revelation 22:3-4 - And there shall be no more curse: but the throne of God and of the Lamb shall be in it; and his servants shall serve him: And they shall see his face; and his name shall be in their foreheads."
    }
  },

  // ROOM 20: The Master Key
  {
    id: "master-key",
    title: "The Master Key",
    theme: "Christ in All Scripture",
    description: "The ultimate challenge: find Christ hidden throughout the entire Bible.",
    storyIntro: "Jesus said, 'Search the scriptures; for in them ye think ye have eternal life: and they are they which testify of me.' Every book, every story, every prophecy points to ONE person. This is the master room - find the Master Key that unlocks all of Scripture...",
    difficulty: "expert",
    timeLimit: 45,
    backgroundGradient: "from-yellow-600 via-amber-500 to-orange-600",
    icon: "🔑",
    puzzles: [
      {
        id: "mast-1",
        type: "match",
        question: "Match each Old Testament figure to their Christ-type connection:",
        pairs: [
          { left: "Adam", right: "The Second Adam" },
          { left: "Isaac", right: "The Beloved Son offered" },
          { left: "Joseph", right: "Rejected by brothers, saves the world" },
          { left: "Moses", right: "The Prophet like unto Moses" }
        ],
        principle: principles.typology,
        clueRevealed: "In every major OT character, Christ can be seen.",
        points: 10
      },
      {
        id: "mast-2",
        type: "fill-blank",
        question: "Luke 24:27 - 'Beginning at Moses and all the prophets, he expounded unto them in all the _________ the things concerning himself.'",
        answer: "scriptures",
        principle: principles.christConcentration,
        clueRevealed: "Jesus Himself taught that ALL Scripture speaks of Him.",
        points: 10
      },
      {
        id: "mast-3",
        type: "sequence",
        question: "Arrange these Christ titles in order of their biblical revelation:",
        items: ["Lamb of God (John)", "Son of David (2 Samuel)", "Messiah (Daniel)", "Seed of Woman (Genesis)", "Suffering Servant (Isaiah)", "Word made flesh (John)"],
        correctOrder: [3, 1, 4, 2, 0, 5],
        principle: principles.storyFlow,
        clueRevealed: "From Genesis to Revelation, the portrait of Christ becomes ever clearer.",
        points: 15
      },
      {
        id: "mast-4",
        type: "multiple-choice",
        question: "In Luke 24, on the road to Emmaus, what was the reaction of the disciples when Jesus expounded the Scriptures?",
        options: ["They fell asleep", "Their hearts burned within them", "They argued with Him", "They were confused"],
        correctOption: 1,
        principle: principles.fruit,
        clueRevealed: "When we see Christ in Scripture, our hearts BURN with holy fire!",
        points: 10
      },
      {
        id: "mast-5",
        type: "match",
        question: "Match each Bible section to how it reveals Christ:",
        pairs: [
          { left: "Law", right: "Foundation for Christ" },
          { left: "History", right: "Preparation for Christ" },
          { left: "Poetry", right: "Aspiration for Christ" },
          { left: "Prophecy", right: "Expectation of Christ" }
        ],
        principle: principles.connect6,
        clueRevealed: "Every genre of Scripture points to Him in its unique way.",
        points: 15
      },
      {
        id: "mast-6",
        type: "riddle",
        question: "I am the first book of the Bible. In me you find: the Seed of the Woman, the Ark of Salvation, the Sacrifice of Isaac, and the Coat of Many Colors. Who am I pointing to?",
        answer: "jesus",
        principle: principles.christConcentration,
        clueRevealed: "Genesis alone contains dozens of Christ-types and promises.",
        points: 10
      },
      {
        id: "mast-7",
        type: "cipher",
        question: "Decode using A=1, B=2, etc.: '10-5-19-21-19 3-8-18-9-19-20 20-8-5 19-1-13-5 25-5-19-20-5-18-4-1-25 20-15-4-1-25 1-14-4 6-15-18-5-22-5-18'",
        cipherText: "10-5-19-21-19 3-8-18-9-19-20 20-8-5 19-1-13-5 25-5-19-20-5-18-4-1-25 20-15-4-1-25 1-14-4 6-15-18-5-22-5-18",
        cipherKey: "A=1, B=2, C=3... Z=26",
        answer: "jesus christ the same yesterday today and forever",
        principle: principles.defCom,
        clueRevealed: "Hebrews 13:8 - He is the unchanging center of all Scripture.",
        points: 15
      }
    ],
    finalAnswer: {
      type: "person",
      answer: "Jesus Christ - The Master Key who unlocks all Scripture",
      hint: "Who did Jesus say ALL the Scriptures testify about?",
      explanation: "Jesus Christ is the Master Key that unlocks all of Scripture. He is present in every book: in Genesis He is the Seed of the Woman; in Exodus, the Passover Lamb; in Leviticus, the High Priest; in Numbers, the Bronze Serpent; in Deuteronomy, the Prophet to come. Through the history, poetry, and prophecy - HE is the theme. The Old Testament is Christ concealed; the New Testament is Christ revealed. When you find Him, you have found the meaning of it all.",
      verse: "John 5:39 - Search the scriptures; for in them ye think ye have eternal life: and they are they which testify of me."
    }
  }
];

// Helper functions
export const getEscapeRoomById = (id: string): EscapeRoom | undefined => {
  return escapeRooms.find(room => room.id === id);
};

export const getEscapeRoomsByDifficulty = (difficulty: Difficulty): EscapeRoom[] => {
  return escapeRooms.filter(room => room.difficulty === difficulty);
};

export const getEscapeRoomsByTheme = (theme: string): EscapeRoom[] => {
  return escapeRooms.filter(room => room.theme.toLowerCase() === theme.toLowerCase());
};

export const getAllThemes = (): string[] => {
  return [...new Set(escapeRooms.map(room => room.theme))];
};

export const getTotalPuzzleCount = (room: EscapeRoom): number => {
  return room.puzzles.length;
};

export const getMaxPoints = (room: EscapeRoom): number => {
  return room.puzzles.reduce((total, puzzle) => total + puzzle.points, 0);
};
