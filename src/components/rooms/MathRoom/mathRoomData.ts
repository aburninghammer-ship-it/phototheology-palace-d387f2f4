// Math Room - Prophetic Time Cycles Data

export interface TimeCycle {
  id: string;
  title: string;
  duration: string;
  color: string;
  bgGradient: string;
  icon: string;
  meaning: string;
  historicalApplication: {
    reference: string;
    description: string;
  };
  theologicalPrinciple: {
    statement: string;
    implications: string[];
  };
  patternReappearance: string[];
  typeAntitype: {
    type: string;
    antitype: string;
  }[];
  quizQuestions: {
    question: string;
    answer: string;
  }[];
  additionalDetails?: Record<string, any>;
}

export const TIME_CYCLES: TimeCycle[] = [
  {
    id: "120-years",
    title: "120 Years",
    duration: "The Age of Divine Warning",
    color: "amber",
    bgGradient: "from-amber-900/30 to-orange-900/30",
    icon: "AlertTriangle",
    meaning: "God's declared limit of patience before judgment. This represents the maximum probationary period granted to humanity before divine intervention.",
    historicalApplication: {
      reference: "Genesis 6:3",
      description: "And the LORD said, My spirit shall not always strive with man, for that he also is flesh: yet his days shall be an hundred and twenty years. This marked the countdown to the Flood—120 years of Noah's preaching before judgment fell."
    },
    theologicalPrinciple: {
      statement: "Judgment is always preceded by mercy",
      implications: [
        "God never judges without first warning",
        "The period of warning is sufficient for repentance",
        "Divine patience has limits, but those limits are generous",
        "Noah became 'a preacher of righteousness' during this period (2 Peter 2:5)",
        "The warning period is also a preparation period for the faithful"
      ]
    },
    patternReappearance: [
      "Jonah's Nineveh: 40 days warning (a compressed form of the pattern)",
      "Christ's Ministry: 3.5 years of public warning to Israel",
      "Three Angels' Messages: Final worldwide warning before Christ's return",
      "Moses' life divided into three 40-year periods (120 total)",
      "The 120 priests with trumpets at Solomon's temple dedication (2 Chronicles 5:12)"
    ],
    typeAntitype: [
      { type: "Noah's 120-year warning", antitype: "Final generation's warning message" },
      { type: "Ark as place of safety", antitype: "Christ as our refuge" },
      { type: "Flood destroying the wicked", antitype: "Second Coming judgment" },
      { type: "8 souls saved through water", antitype: "Baptism and remnant salvation" }
    ],
    quizQuestions: [
      { question: "What event concluded the 120-year period?", answer: "The worldwide Flood that destroyed all living things except those in the ark." },
      { question: "What was Noah doing during the 120 years?", answer: "Preaching righteousness and building the ark as a sign of coming judgment." },
      { question: "How does 120 relate to Moses' life?", answer: "Moses lived exactly 120 years, divided into three 40-year periods: Egypt, Midian, Wilderness." },
      { question: "What principle does 120 years establish about God's character?", answer: "That God always provides sufficient warning before judgment falls." }
    ]
  },
  {
    id: "400-years",
    title: "400 Years",
    duration: "The Cycle of Affliction and Promise",
    color: "rose",
    bgGradient: "from-rose-900/30 to-red-900/30",
    icon: "Shield",
    meaning: "Period of formation through trial, preparation for deliverance. This represents the time required for a people to be shaped through suffering into readiness for their calling.",
    historicalApplication: {
      reference: "Genesis 15:13-14",
      description: "And he said unto Abram, Know of a surety that thy seed shall be a stranger in a land that is not theirs, and shall serve them; and they shall afflict them four hundred years; And also that nation, whom they shall serve, will I judge: and afterward shall they come out with great substance."
    },
    theologicalPrinciple: {
      statement: "God's justice matures—it does not rush",
      implications: [
        "Suffering has a sanctifying purpose in God's plan",
        "Deliverance comes at the appointed time, not before",
        "The 'iniquity of the Amorites' needed time to be full (Genesis 15:16)",
        "God uses waiting to build faith and dependence",
        "The promise remains certain even during affliction"
      ]
    },
    patternReappearance: [
      "The Intertestamental Period: ~400 years of prophetic silence between Malachi and John the Baptist",
      "Israel's wilderness generation: 40 years (a tenth of 400) for unbelief",
      "The cycle of judges: repeated periods of oppression followed by deliverance",
      "Babylon's 70 years: a concentrated form of affliction leading to restoration"
    ],
    typeAntitype: [
      { type: "Egyptian bondage", antitype: "Bondage to sin and the world" },
      { type: "Moses the deliverer", antitype: "Christ the Redeemer" },
      { type: "Passover lamb", antitype: "Christ our Passover (1 Cor 5:7)" },
      { type: "Red Sea crossing", antitype: "Baptism and new life" },
      { type: "Promised Land", antitype: "Heavenly Canaan, eternal rest" }
    ],
    quizQuestions: [
      { question: "Why did God wait 400 years before delivering Israel?", answer: "The iniquity of the Amorites was 'not yet full'—God's justice required giving them full opportunity to repent." },
      { question: "How does the 400-year prophecy demonstrate God's sovereignty?", answer: "It shows God knows the end from the beginning and works according to His predetermined plan." },
      { question: "What parallel exists in the Intertestamental Period?", answer: "Approximately 400 years of prophetic silence before the Messiah came—another period of waiting before deliverance." },
      { question: "What does the 400-year period teach about suffering?", answer: "That God uses affliction purposefully to prepare His people for their calling and destiny." }
    ]
  },
  {
    id: "70-years",
    title: "70 Years",
    duration: "Judgment, Restoration, Return",
    color: "blue",
    bgGradient: "from-blue-900/30 to-indigo-900/30",
    icon: "Target",
    meaning: "Time-limited discipline followed by divine restoration. This represents God's measured judgment that always has restoration as its ultimate goal.",
    historicalApplication: {
      reference: "Jeremiah 25:11-12; 29:10",
      description: "And this whole land shall be a desolation, and an astonishment; and these nations shall serve the king of Babylon seventy years. For thus saith the LORD, That after seventy years be accomplished at Babylon I will visit you, and perform my good word toward you, in causing you to return to this place."
    },
    theologicalPrinciple: {
      statement: "God sets boundaries even on judgment",
      implications: [
        "Discipline is not destruction—it has an end point",
        "70 = 7 (completion) × 10 (fullness): complete, full judgment",
        "The Sabbath principle underlies this period",
        "Restoration is always part of God's plan",
        "Even in exile, God's promises remain sure"
      ]
    },
    patternReappearance: [
      "70 elders of Israel (Exodus 24:1)",
      "70 descendants of Jacob who entered Egypt (Genesis 46:27)",
      "70 palm trees at Elim (Exodus 15:27)",
      "Jesus sends 70 disciples (Luke 10:1)",
      "Forgive 70 times 7 (Matthew 18:22)"
    ],
    typeAntitype: [
      { type: "Babylonian captivity", antitype: "Spiritual captivity to sin" },
      { type: "Return under Cyrus", antitype: "Spiritual restoration through Christ" },
      { type: "Temple rebuilt", antitype: "Church as living temple" },
      { type: "Jerusalem restored", antitype: "New Jerusalem" }
    ],
    quizQuestions: [
      { question: "Why specifically 70 years for the captivity?", answer: "70 years = 70 sabbaths = 490 years of sabbath violations. The land needed to 'enjoy her sabbaths' (2 Chronicles 36:21)." },
      { question: "Who prophesied the 70-year captivity?", answer: "Jeremiah prophesied it before it began; Daniel studied this prophecy while in Babylon." },
      { question: "What decree ended the 70 years?", answer: "Cyrus's decree in 538 BC permitting the Jews to return and rebuild the temple." },
      { question: "How does the 70-year period connect to the 70 weeks?", answer: "Daniel's prayer about the 70 years led to Gabriel's revelation of the 70 weeks prophecy." }
    ],
    additionalDetails: {
      sabbathConnection: {
        title: "The Sabbath Year Connection",
        content: "70 years = 70 sabbaths = 490 years of violation. Israel had failed to keep the sabbatical year (Leviticus 25) for 490 years. The 70-year captivity was the land's enforced rest—receiving in captivity what it was denied in disobedience.",
        calculation: "490 years ÷ 7 (one sabbath per week of years) = 70 sabbath years missed"
      }
    }
  },
  {
    id: "70-weeks",
    title: "70 Weeks",
    duration: "The Messianic Countdown",
    color: "violet",
    bgGradient: "from-violet-900/30 to-purple-900/30",
    icon: "Crown",
    meaning: "The appointed time for Messiah's arrival, ministry, and covenant confirmation. This is the hinge prophecy of all Scripture—the prophetic bridge between Old and New Testaments.",
    historicalApplication: {
      reference: "Daniel 9:24-27",
      description: "Seventy weeks are determined upon thy people and upon thy holy city, to finish the transgression, and to make an end of sins, and to make reconciliation for iniquity, and to bring in everlasting righteousness, and to seal up the vision and prophecy, and to anoint the most Holy."
    },
    theologicalPrinciple: {
      statement: "Christ is the center of all prophecy",
      implications: [
        "All prophetic timelines point to the Messiah",
        "The cross is the fixed point of cosmic history",
        "God's timing is precise to the year, even the day",
        "Prophecy exists to build faith in Christ",
        "The Messiah's work fulfills all six purposes of Daniel 9:24"
      ]
    },
    patternReappearance: [
      "7 days of creation week → 7 weeks to restore Jerusalem",
      "Jubilee cycle (49 years + 1) → 49 years of Jerusalem's rebuilding",
      "490 years echoes the 490 years of missed sabbaths",
      "3.5 years of Christ's ministry → 1260 days of prophetic witness"
    ],
    typeAntitype: [
      { type: "Decree to restore Jerusalem", antitype: "God's eternal purpose in Christ" },
      { type: "Anointing of Most Holy", antitype: "Christ's baptism (anointing)" },
      { type: "Messiah cut off", antitype: "Christ's crucifixion" },
      { type: "Covenant confirmed", antitype: "Gospel to Jews, then Gentiles" },
      { type: "Daily sacrifice ceased", antitype: "Cross ends ceremonial system" }
    ],
    quizQuestions: [
      { question: "What are the six purposes of the 70 weeks (Daniel 9:24)?", answer: "1) Finish transgression, 2) End sins, 3) Make reconciliation, 4) Bring everlasting righteousness, 5) Seal up vision and prophecy, 6) Anoint Most Holy." },
      { question: "What event marks the beginning of the 70 weeks?", answer: "The decree to restore and build Jerusalem—Artaxerxes' decree in 457 BC (Ezra 7)." },
      { question: "What happened at the end of the 69th week?", answer: "Messiah appeared—Jesus was baptized in AD 27, exactly 483 years after 457 BC." },
      { question: "What occurred in the 'midst of the week'?", answer: "After 3.5 years of ministry, Christ was crucified in AD 31, causing sacrifice and oblation to cease." }
    ],
    additionalDetails: {
      sixPurposes: [
        { purpose: "Finish the transgression", meaning: "End the period of Israel's national rebellion" },
        { purpose: "Make an end of sins", meaning: "Provide the final sacrifice for sin" },
        { purpose: "Make reconciliation for iniquity", meaning: "Atone—the cross as the means of peace with God" },
        { purpose: "Bring in everlasting righteousness", meaning: "Establish Christ's imputed righteousness" },
        { purpose: "Seal up the vision and prophecy", meaning: "Validate all prophecy by fulfillment" },
        { purpose: "Anoint the Most Holy", meaning: "Inauguration of heavenly sanctuary ministry" }
      ],
      breakdown: {
        sevenWeeks: { years: 49, period: "457 BC – 408 BC", event: "Jerusalem rebuilt in troubled times" },
        sixtytwoWeeks: { years: 434, period: "408 BC – AD 27", event: "Waiting period until Messiah" },
        oneWeek: { years: 7, period: "AD 27 – AD 34", event: "Messiah's ministry and covenant confirmation" }
      },
      keyDates: [
        { date: "457 BC", event: "Decree of Artaxerxes (Ezra 7)" },
        { date: "AD 27", event: "Jesus' baptism—Messiah appears" },
        { date: "AD 31", event: "Crucifixion—midst of the week" },
        { date: "AD 34", event: "Stoning of Stephen—gospel to Gentiles" }
      ]
    }
  },
  {
    id: "1260-days",
    title: "1260 Days/Years",
    duration: "The Age of Witness and Oppression",
    color: "emerald",
    bgGradient: "from-emerald-900/30 to-green-900/30",
    icon: "Eye",
    meaning: "Period of prophetic testimony under persecution. God's truth is preserved even when trampled, and His witnesses prophesy even in sackcloth.",
    historicalApplication: {
      reference: "Revelation 11:3; 12:6, 14; 13:5; Daniel 7:25",
      description: "And I will give power unto my two witnesses, and they shall prophesy a thousand two hundred and threescore days, clothed in sackcloth. This period spans from 538 AD (establishment of papal supremacy) to 1798 AD (Napoleon's general takes Pope captive)."
    },
    theologicalPrinciple: {
      statement: "Even in darkness, God preserves His truth",
      implications: [
        "The church may be in wilderness, but is never abandoned",
        "Witnesses prophesy even under persecution",
        "Truth may be suppressed but never destroyed",
        "God limits the duration of persecution",
        "The darker the night, the nearer the dawn"
      ]
    },
    patternReappearance: [
      "Elijah's 3.5 years of drought (James 5:17)",
      "Jesus' 3.5 year ministry",
      "The two witnesses' testimony (Revelation 11)",
      "The woman (church) in the wilderness (Revelation 12)",
      "The beast's authority (Revelation 13:5)"
    ],
    typeAntitype: [
      { type: "Elijah fed by ravens/widow", antitype: "Church preserved in wilderness" },
      { type: "Jezebel's persecution", antitype: "Papal persecution of saints" },
      { type: "Remnant of Israel (7000)", antitype: "Faithful witnesses through ages" },
      { type: "Elijah's translation", antitype: "Second Coming deliverance" }
    ],
    quizQuestions: [
      { question: "What are the equivalent expressions for 1260 days?", answer: "Time, times, and half a time (3.5 years); 42 months; 1260 days—all equal 3.5 prophetic years." },
      { question: "Who are the 'two witnesses' of Revelation 11?", answer: "The Old and New Testaments—Scripture witnessing through the dark ages, clothed in sackcloth." },
      { question: "What historical period does 1260 years represent?", answer: "538 AD (papal supremacy established) to 1798 AD (pope taken captive)—the medieval period of church dominance." },
      { question: "Why is the church 'in the wilderness' during this time?", answer: "Like Israel in the wilderness, the true church was in a state of testing, hiding, and dependence on God's provision." }
    ],
    additionalDetails: {
      equivalentExpressions: [
        { expression: "Time, times, and half a time", reference: "Daniel 7:25; 12:7; Revelation 12:14", calculation: "1 + 2 + 0.5 = 3.5 years" },
        { expression: "42 months", reference: "Revelation 11:2; 13:5", calculation: "42 × 30 = 1260 days" },
        { expression: "1260 days", reference: "Revelation 11:3; 12:6", calculation: "3.5 × 360 = 1260 days" }
      ],
      twoWitnesses: {
        identity: "Old and New Testaments",
        symbolism: [
          "Two olive trees: Spirit-anointed Word",
          "Two lampstands: Light-giving Word",
          "Fire from their mouths: Word that judges",
          "Power to shut heaven: Like Elijah's word",
          "Power over waters: Like Moses' word"
        ]
      }
    }
  },
  {
    id: "2300-days",
    title: "2300 Days/Years",
    duration: "Cleansing and Vindication",
    color: "yellow",
    bgGradient: "from-yellow-900/30 to-amber-900/30",
    icon: "Scale",
    meaning: "The longest time prophecy in Scripture, pointing to the cosmic judgment/restoration. This prophecy encompasses and transcends all others, culminating in the vindication of God's character and people.",
    historicalApplication: {
      reference: "Daniel 8:14",
      description: "Unto two thousand and three hundred days; then shall the sanctuary be cleansed. Beginning from the same starting point as the 70 weeks (457 BC), this prophecy extends to 1844 AD—the commencement of the pre-Advent judgment."
    },
    theologicalPrinciple: {
      statement: "God's justice will be fully vindicated before the universe",
      implications: [
        "Every case will be examined and decided",
        "The sanctuary truth reveals Christ's full ministry",
        "Judgment begins with the house of God (1 Peter 4:17)",
        "The great controversy is resolved through judgment",
        "Christ's priestly work precedes His kingly return"
      ]
    },
    patternReappearance: [
      "Day of Atonement: annual cleansing of sanctuary",
      "Jubilee: restoration and liberation after 49 years",
      "Daniel's other visions: all end with judgment and kingdom",
      "Revelation's judgment scenes: paralleling Daniel's vision"
    ],
    typeAntitype: [
      { type: "Earthly Day of Atonement", antitype: "Heavenly pre-Advent judgment" },
      { type: "High priest enters Most Holy", antitype: "Christ enters heavenly Most Holy (1844)" },
      { type: "Sins removed from sanctuary", antitype: "Records of sin blotted out" },
      { type: "Scapegoat sent away", antitype: "Satan bears guilt, cast into abyss" },
      { type: "People afflict souls, examine hearts", antitype: "End-time self-examination" }
    ],
    quizQuestions: [
      { question: "How does the 2300 days connect to the 70 weeks?", answer: "The 70 weeks are 'cut off' from the 2300 days—they share the same starting point (457 BC), making the 70 weeks the 'measuring stick' for the longer prophecy." },
      { question: "What is meant by 'sanctuary be cleansed'?", answer: "The antitype of the Day of Atonement—the pre-Advent judgment in heaven where cases are decided before Christ returns." },
      { question: "Calculate the ending date of the 2300 years.", answer: "457 BC + 2300 = 1844 AD (accounting for no year zero: 2300 - 457 = 1843, plus 1 = 1844)." },
      { question: "What began in 1844?", answer: "The pre-Advent (investigative) judgment in the heavenly sanctuary—Christ's ministry moving from the Holy to the Most Holy Place." }
    ],
    additionalDetails: {
      connectionTo70Weeks: {
        title: "The 70 Weeks Connection",
        explanation: "The Hebrew word 'determined' (Daniel 9:24) literally means 'cut off.' The 70 weeks are 'cut off' from a larger period—the 2300 days. This connection provides the starting point for the 2300-day prophecy.",
        sharedStartingPoint: "457 BC—the decree of Artaxerxes"
      },
      calculation: {
        startDate: "457 BC",
        duration: "2300 prophetic days (years)",
        endDate: "1844 AD",
        formula: "2300 - 457 + 1 (no year zero) = 1844"
      },
      dayOfAtonement: {
        title: "Day of Atonement Typology",
        elements: [
          "High priest enters Most Holy Place once a year",
          "Blood applied to mercy seat for cleansing",
          "People afflict their souls in self-examination",
          "Sins transferred to sanctuary are removed",
          "Scapegoat bears sins into wilderness",
          "Judgment determines who remains in Israel"
        ]
      },
      whatBeganIn1844: [
        "Pre-Advent Judgment: Cases of professed believers examined",
        "Final phase of Christ's high priestly ministry",
        "Cleansing of the heavenly sanctuary",
        "Last message of mercy to the world",
        "Preparation for Christ's Second Coming"
      ]
    }
  }
];

export const KEY_NUMBERS = [
  { number: 7, significance: "Divine completion, rest, covenant", examples: "7 days of creation, 7 churches, 7 seals, 7 trumpets" },
  { number: 40, significance: "Testing, trial, probation", examples: "40 days rain, 40 years wilderness, 40 days Christ tempted" },
  { number: 70, significance: "Judgment and restoration cycle", examples: "70 years captivity, 70 weeks, 70 elders, 70 disciples" },
  { number: 120, significance: "Divine warning period", examples: "120 years before flood, Moses lived 120 years, 120 priests" },
  { number: 400, significance: "Affliction and formation", examples: "400 years in Egypt, 400 years of silence" },
  { number: 490, significance: "Complete mercy period (70 × 7)", examples: "70 weeks = 490 years, forgive 70 × 7 times" },
  { number: 1260, significance: "Prophetic witness under oppression", examples: "1260 days/years, 42 months, time times half time" },
  { number: 2300, significance: "Longest prophecy, final judgment", examples: "2300 days to sanctuary cleansing" }
];

export const THEOLOGICAL_FUNCTIONS = [
  {
    title: "Demonstrates Divine Sovereignty",
    icon: "Crown",
    description: "God declares the end from the beginning (Isaiah 46:10). Time prophecies prove God controls history."
  },
  {
    title: "Provides Prophetic Authenticity",
    icon: "Shield",
    description: "Fulfilled time prophecies validate Scripture. The precision of prophetic timing eliminates coincidence."
  },
  {
    title: "Reveals Salvation History Structure",
    icon: "Scroll",
    description: "Time periods show God's plan unfolds in ordered stages, each building toward the ultimate goal."
  },
  {
    title: "Offers Pastoral Comfort",
    icon: "Heart",
    description: "Knowing God has set limits on suffering brings hope. Even persecution has an end point."
  },
  {
    title: "Warns of Accountability",
    icon: "Scale",
    description: "Time prophecies declare that judgment is real and coming. God's patience has a boundary."
  }
];

export const DAY_YEAR_PRINCIPLE = {
  title: "The Day-Year Principle",
  foundation: [
    { reference: "Numbers 14:34", text: "After the number of the days in which ye searched the land, even forty days, each day for a year, shall ye bear your iniquities, even forty years." },
    { reference: "Ezekiel 4:6", text: "I have appointed thee each day for a year." }
  ],
  explanation: "In symbolic prophecy, a prophetic day represents a literal year. This principle unlocks the time prophecies of Daniel and Revelation, transforming short symbolic periods into long historical spans.",
  propheticYear: "A prophetic year = 360 days (12 months × 30 days), based on the original biblical calendar."
};
