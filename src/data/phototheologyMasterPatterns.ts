/**
 * PHOTOTHEOLOGY MASTER PATTERNS
 * 
 * Comprehensive database of Christ patterns, book patterns, dimensions,
 * and prophetic frameworks from the Phototheology Master Presentation.
 * 
 * These patterns teach users to see Christ in every passage of Scripture
 * through systematic pattern recognition across 6 major frameworks.
 */

// ============================================================
// SIX MAJOR PICTURE PATTERNS / WALLS
// ============================================================

export interface PatternWall {
  id: string;
  name: string;
  description: string;
  applications: string[];
}

export const SIX_PICTURE_PATTERNS: PatternWall[] = [
  {
    id: "christ",
    name: "Christ Pattern",
    description: "Memorize the Life of Christ across four phases: As Michael (pre-incarnate), As Jesus (incarnate), As High Priest (ascension), As King (second coming).",
    applications: [
      "Prophet: Christ's Life on earth",
      "Priest: Ascension to heavenly ministry",
      "Judge: 1844 investigative judgment",
      "King: Second Coming"
    ]
  },
  {
    id: "sanctuary",
    name: "Sanctuary Pattern",
    description: "The sanctuary/tabernacle system provides the master key to understanding Scripture's redemptive plan.",
    applications: [
      "Altar of Sacrifice → Christ's Death → Gospels",
      "Laver → Baptism → Acts",
      "Table of Shewbread, Incense, Candlestick → Word, Prayer, Witnessing → Romans to Jude",
      "Ark of the Covenant → Presence of God → Revelation"
    ]
  },
  {
    id: "prophetic",
    name: "Prophetic Time Pattern",
    description: "Three major time prophecies frame all of Scripture: 70 Weeks, 1260, 2300.",
    applications: [
      "70 Weeks: Setting up of Sanctuary Service",
      "1260: Apostasy and Temple Cast Down",
      "2300: Restoration to Coming of Christ"
    ]
  },
  {
    id: "historic",
    name: "Historic Pattern",
    description: "Ancient Israel's history parallels the Seven Churches of Revelation.",
    applications: [
      "Adam to Joseph → Ephesus: Start of Movement",
      "Moses to Ruth → Smyrna: Persecution, Faithfulness",
      "Samuel/Saul → Pergamos: Compromise",
      "Kings to Chronicles → Thyatira: Apostasy, Jezebel",
      "Ezra → Sardis: Escaping Babylon",
      "Nehemiah → Philadelphia: Reformation Complete",
      "Prophets to Christ → Laodicea: Final Message"
    ]
  },
  {
    id: "gospel",
    name: "Gospel Floor",
    description: "The foundation of all truth: justification, sanctification, glorification.",
    applications: [
      "Justification by faith",
      "Sanctification through the Spirit",
      "Glorification at Christ's coming"
    ]
  },
  {
    id: "heaven",
    name: "Heaven Ceiling",
    description: "The final hope: new creation, eternal life, God's dwelling with humanity.",
    applications: [
      "New heavens and new earth",
      "God dwelling with His people",
      "No more death, sorrow, or pain"
    ]
  }
];

// ============================================================
// SIX DIMENSIONS (Applied to every passage)
// ============================================================

export interface Dimension {
  level: number;
  name: string;
  question: string;
  example: string;
}

export const SIX_DIMENSIONS: Dimension[] = [
  {
    level: 1,
    name: "Literal",
    question: "What does the text literally say happened?",
    example: "Joseph was sold into slavery by his brothers"
  },
  {
    level: 2,
    name: "Christ",
    question: "How does this point to Jesus?",
    example: "Christ was betrayed by His own, sold for silver, yet exalted to save"
  },
  {
    level: 3,
    name: "Me",
    question: "How does this apply to my personal walk?",
    example: "You may be hated by your own, but be faithful and God will bring them to truth"
  },
  {
    level: 4,
    name: "Church",
    question: "How does this apply to God's people corporately?",
    example: "The Church is hated by other churches, but will be vindicated in the end"
  },
  {
    level: 5,
    name: "Heaven Future/Present",
    question: "How does this connect to heavenly realities or eschatology?",
    example: "Wicked humanity hates God's people, but will bow before them at the end"
  },
  {
    level: 6,
    name: "Heaven Past",
    question: "How does this echo the pre-fall heavenly narrative?",
    example: "Satan's rebellion against Christ in heaven parallels this earthly pattern"
  }
];

// ============================================================
// FEAST DAY PATTERN
// ============================================================

export interface FeastPattern {
  feast: string;
  meaning: string;
  ntBook: string;
  christLevel: string;
  personalLevel: string;
  churchLevel: string;
}

export const FEAST_PATTERNS: FeastPattern[] = [
  {
    feast: "Passover",
    meaning: "Christ's Death",
    ntBook: "Matthew, Mark, Luke, John",
    christLevel: "Christ's Death",
    personalLevel: "My death to self",
    churchLevel: "Church built on Sacrifice"
  },
  {
    feast: "Unleavened Bread",
    meaning: "Christ's Burial",
    ntBook: "Gospels",
    christLevel: "Burial",
    personalLevel: "Putting away sin",
    churchLevel: "Purging of evil"
  },
  {
    feast: "Firstfruits",
    meaning: "Christ's Resurrection",
    ntBook: "Gospels",
    christLevel: "Resurrection",
    personalLevel: "New life in Christ",
    churchLevel: "Birth of the Church"
  },
  {
    feast: "Pentecost",
    meaning: "Harvest - Outpouring",
    ntBook: "Acts",
    christLevel: "Priestly Inauguration in Heaven",
    personalLevel: "My inauguration as priest",
    churchLevel: "Birth of NT Church"
  },
  {
    feast: "Trumpets",
    meaning: "Warnings and Preparation",
    ntBook: "Romans to Jude",
    christLevel: "Gospel Alarm",
    personalLevel: "I will sound the alarm",
    churchLevel: "Church proclaiming warnings"
  },
  {
    feast: "Day of Atonement",
    meaning: "Judgment (1844)",
    ntBook: "Revelation 11:19-14",
    christLevel: "Judgment in Most Holy",
    personalLevel: "Personal judgment review",
    churchLevel: "1844 - Investigative Judgment"
  },
  {
    feast: "Tabernacles",
    meaning: "Celebration - Dwelling with God",
    ntBook: "Revelation 21-22",
    christLevel: "Eternal dwelling",
    personalLevel: "Tabernacle with God eternally",
    churchLevel: "Heaven in peace again"
  }
];

// ============================================================
// BOOK PATTERNS (Christ in Every Book)
// ============================================================

export interface BookPattern {
  book: string;
  sections: PatternSection[];
  christParallel: PatternSection[];
  thirdDimension?: PatternSection[]; // Personal Application
  fourthDimension?: PatternSection[]; // Church Application
  fifthDimension?: PatternSection[]; // End-time Application
  sixthDimension?: PatternSection[]; // Heaven Application
}

export interface PatternSection {
  chapters?: string;
  description: string;
}

export const BOOK_PATTERNS: BookPattern[] = [
  // PENTATEUCH
  {
    book: "Genesis",
    sections: [
      { chapters: "1-5", description: "Adam: Creation/Intro to Sin" },
      { chapters: "6-11", description: "Noah: Results of Sin" },
      { chapters: "12-20", description: "Abraham: Birth of a Nation" },
      { chapters: "21-25", description: "Isaac and the Sacrifice" },
      { chapters: "27-34", description: "Transitions/Older to Younger/Prospers/Time of Trouble" },
      { chapters: "36-50", description: "Joseph sent ahead to prepare a Place/Judgment" }
    ],
    christParallel: [
      { chapters: "1-2", description: "Creation of the World/Intro to Sin" },
      { chapters: "3-11", description: "Results of Sin" },
      { chapters: "12-20", description: "Birth of Nation of Israel" },
      { chapters: "21-25", description: "Christ and His Sacrifice" },
      { chapters: "27-34", description: "Transitions/Older to Younger/Prospers/Time of Trouble" },
      { chapters: "36-50", description: "Christ sent ahead to prepare a Place/Judgment" }
    ]
  },
  {
    book: "Exodus",
    sections: [
      { chapters: "1-4", description: "Birth of Moses, Drawn of Water, Sent" },
      { chapters: "6-12", description: "Preaching, Miracles, Passover, Exodus" },
      { chapters: "14-24", description: "Red Sea, Beginning of the Church in wilderness, 10 Commandments, Moses Ascends" },
      { chapters: "24-33", description: "Sanctuary, Apostasy Below, Moses Returns/Levites" },
      { chapters: "35-40", description: "Completing the Work of Temple Built on Earth, Glory of God" }
    ],
    christParallel: [
      { description: "Christ Birth, Baptism, and Being Sent" },
      { description: "Preaching, Leading others out of captivity from Sin" },
      { description: "Christ Death, Pentecost, Ascension" },
      { description: "Christ Above, Christ Returns" },
      { description: "Christ completes the Work of building the Church, Descends" }
    ],
    thirdDimension: [
      { description: "Our New Birth, Baptism, and Being Sent" },
      { description: "Preaching, Leading others out of captivity from Sin" },
      { description: "Leading others to Meet God" },
      { description: "Instructing others in Sanctuary Message" },
      { description: "Completing the Work of building the Church" }
    ]
  },
  {
    book: "Leviticus",
    sections: [
      { chapters: "1-7", description: "Sacrifice" },
      { chapters: "8-9", description: "New Church/Priesthood begins" },
      { chapters: "10", description: "False Priesthood/Judgment" },
      { chapters: "11", description: "Clean and Unclean" },
      { chapters: "12-15", description: "Motherhood/leprosy/Sanctuary" },
      { chapters: "16-17", description: "Day of Atonement" },
      { chapters: "18-22", description: "Unlawful Relationships" },
      { chapters: "23", description: "Feasts/Tabernacles" },
      { chapters: "24", description: "Light/Sabbath/Blasphemy" },
      { chapters: "25", description: "Jubilee" },
      { chapters: "26", description: "Land to Lay Desolate" }
    ],
    christParallel: [
      { chapters: "1-7", description: "Sacrifice of Christ" },
      { chapters: "8-9", description: "New Church/True Priesthood" },
      { chapters: "10", description: "Transition/False priesthood" },
      { chapters: "11", description: "No distinction Jew and Gentile" },
      { chapters: "12-15", description: "Work of church/leprosy of sin/Sanctuary" },
      { chapters: "16-17", description: "Day of Atonement/Blood" },
      { chapters: "18-22", description: "Babylon" },
      { chapters: "23", description: "Preaching of full gospel/Millennium" },
      { chapters: "24", description: "Light/Sabbath/Punished for Blasphemy" },
      { chapters: "25", description: "Second Coming" },
      { chapters: "26", description: "Millennium" }
    ]
  },
  {
    book: "Numbers",
    sections: [
      { chapters: "1-8", description: "Setting Up of Ancient Israel" },
      { chapters: "9", description: "Passover" },
      { chapters: "10", description: "Journey from Sinai" },
      { chapters: "11-15", description: "Fear, Doubt: Giants" },
      { chapters: "16", description: "Korah: hijacking the priesthood" },
      { chapters: "17-19", description: "Priesthood determined" },
      { chapters: "20", description: "Water from the Rock" },
      { chapters: "21", description: "Lifted Serpent brings healing" },
      { chapters: "22-25", description: "Borders of Canaan: shaking" },
      { chapters: "26-36", description: "Prep. to enter" }
    ],
    christParallel: [
      { chapters: "1-8", description: "Old Testament Church" },
      { chapters: "9", description: "Sacrifice of Christ" },
      { chapters: "10", description: "Journey of New Testament Church" },
      { chapters: "11-15", description: "Doubt and Compromise arise" },
      { chapters: "16", description: "Papal Authority: Hijacking the priesthood" },
      { chapters: "17-19", description: "True Priesthood Determined" },
      { chapters: "20", description: "Water Provided in time of famine" },
      { chapters: "21", description: "Christ lifted up brings healing" },
      { chapters: "22-25", description: "Borders of Promise land" },
      { chapters: "26-36", description: "Preparations to enter" }
    ]
  },
  {
    book: "Deuteronomy",
    sections: [
      { description: "History Review/Final Words of Moses" },
      { description: "Blessings and Curses" },
      { description: "Covenant Repeated" },
      { description: "Final Words, Final Song, Moses Goes out to die alone because of the sins of the people" }
    ],
    christParallel: [
      { description: "History Review/Final Words of Jesus" },
      { description: "Blessings and Curses" },
      { description: "Christ Final Supper/Covenant Repeated" },
      { description: "Final Words, Final Song, Christ Goes out alone to die because of the people" }
    ]
  },
  {
    book: "Joshua",
    sections: [
      { chapters: "1-6", description: "Joshua, Baptism Before a time of trouble" },
      { chapters: "6-22", description: "Joshua brings down Satan's kingdom with Loud Shout, victories, territories conquered" },
      { chapters: "23-24", description: "Joshua Dies" }
    ],
    christParallel: [
      { chapters: "1-6", description: "Jesus, Baptism Before a time of trouble: Gethsemane" },
      { chapters: "6-22", description: "Jesus brings down Satan's kingdom on the cross, Loud Shout, victory, earth conquered" },
      { chapters: "23-24", description: "Jesus Dies" }
    ]
  },
  // HISTORICAL BOOKS
  {
    book: "Judges",
    sections: [
      { chapters: "1-2", description: "After Joshua's death, Israel go forth to conquer/compromise" },
      { chapters: "3-12", description: "Compromise/victories" },
      { chapters: "13-17", description: "Samson and Delilah" },
      { chapters: "18", description: "Micah's new religion, counterfeit priesthood" },
      { chapters: "19-21", description: "Civil War, chaotic times" }
    ],
    christParallel: [
      { chapters: "1-2", description: "After Jesus death, Church go forth to conquer/compromise" },
      { chapters: "3-12", description: "Compromise/victories" },
      { chapters: "13-17", description: "Harlot Seduces the church" },
      { chapters: "18", description: "New religion, counterfeit priesthood" },
      { chapters: "19-21", description: "Chaotic times, dark ages" }
    ]
  },
  {
    book: "Ruth",
    sections: [
      { chapters: "1", description: "Two Gentile Daughter in Laws, One Will Follow the Hebrew Mother" },
      { chapters: "2", description: "Ruth Works in the Field, at the time of Harvest, attracts Boaz" },
      { chapters: "3-4", description: "Boaz will do all to marry Ruth/and redeem the land" }
    ],
    christParallel: [
      { chapters: "1", description: "True and False Church at the time of the Harvest" },
      { chapters: "2", description: "True Church Works in the Field, at the time of Harvest, attracts Christ" },
      { chapters: "3-4", description: "Christ will do all to marry Church/and redeem the land" }
    ]
  },
  {
    book: "1 Samuel",
    sections: [
      { chapters: "1-4", description: "Samuel's miraculous birth, Called while Sleeping to Become a Priest in temple, false priests cut off" },
      { chapters: "5-7", description: "Temple Destroyed: Victories under Samuel" },
      { chapters: "8-15", description: "People reject Samuel for a king (who usurps position of priesthood: State/church)" },
      { chapters: "16-19", description: "David, Receives Kingdom, though not yet ruling" },
      { chapters: "21-25", description: "Many desert Saul to join David, who is currently hidden from sight" },
      { chapters: "28-30", description: "Saul connects with spiritualism, will be cut off" }
    ],
    christParallel: [
      { description: "Christ miraculous birth, Called to Become Priest in heavenly temple, earthly priest cut off" },
      { description: "Temple Destroyed: Victories under Christ (early church)" },
      { description: "People reject Christ for a king (who usurps position of priesthood State/church: Papacy)" },
      { description: "Christ, Receives a kingdom, though not yet ruling... 1844" },
      { description: "Many desert Papacy to join Christ, who is currently hidden from sight" },
      { description: "Papacy spiritualism, will be cut off" }
    ]
  },
  {
    book: "2 Samuel",
    sections: [
      { chapters: "1-11", description: "David Unites the Kingdom" },
      { chapters: "13-24", description: "Absalom Seeks to Usurp: Standing at the gate. Defeated. David Weeps" }
    ],
    christParallel: [
      { chapters: "1-11", description: "Come Out of Babylon" },
      { chapters: "13-24", description: "Satan seeks to Usurp Throne: Destroyed. God's Strange Act" }
    ]
  },
  {
    book: "1 Kings",
    sections: [
      { chapters: "1-3", description: "Usurp the Throne, Father declares Son King/Wisdom" },
      { chapters: "4-8", description: "Son Builds the Temple on behalf of Father" },
      { chapters: "9", description: "Temple finished: Covenant established, Fame Grows" },
      { chapters: "10", description: "Gentiles Flow/Queen of Sheba" },
      { chapters: "12-16", description: "Division and Apostasy, Ahab and Jezebel King and Priestess" },
      { chapters: "17-22", description: "Elijah, Famine and Rain (1260 Days)" }
    ],
    christParallel: [
      { chapters: "1-3", description: "Usurp the Throne, Father declares Son King" },
      { chapters: "4-8", description: "Christ Comes to build Kingdom for Father" },
      { chapters: "9", description: "Cross, Covenant established, Fame Grows" },
      { chapters: "10", description: "Gentiles Flow" },
      { chapters: "12-16", description: "Division and Apostasy, Ahab and Jezebel King and Priest" },
      { chapters: "17-22", description: "Last day Elijah, Famine and Rain" }
    ]
  },
  {
    book: "2 Kings",
    sections: [
      { chapters: "1-3", description: "Elijah to Elisha" },
      { chapters: "4", description: "Widow's Oil till the last vessel is filled" },
      { chapters: "5", description: "Leprosy Cleansed" },
      { chapters: "6", description: "Chariots of fire surround to protect" },
      { chapters: "7-8", description: "Judgments and famine" },
      { chapters: "9-11", description: "Jezebel and Ahab Slain" },
      { chapters: "12", description: "Temple Repaired and completed" },
      { chapters: "13", description: "Resurrection" },
      { chapters: "14-17", description: "1st Destruction (Rebellious Israel)" },
      { chapters: "18-25", description: "2nd Destruction (Rebellious Judah)" }
    ],
    christParallel: [
      { chapters: "1-3", description: "John/Jesus (Church in wilderness/Remnant)" },
      { chapters: "4", description: "Gospel Work till the last vessel is filled" },
      { chapters: "5", description: "Sin Cleansed (Sanctuary)" },
      { chapters: "6", description: "Chariots of fire surround to protect" },
      { chapters: "7-8", description: "Judgments and famine" },
      { chapters: "9-11", description: "Jezebel and Ahab Slain" },
      { chapters: "12", description: "Work Finished" },
      { chapters: "13", description: "Resurrection" },
      { chapters: "14-17", description: "1st Destruction (Second Coming)" },
      { chapters: "18-25", description: "2nd Destruction (End of Millennium)" }
    ]
  },
  {
    book: "1-2 Chronicles",
    sections: [
      { chapters: "1 Chr 1-10", description: "Genealogy of Adam to the transition of Saul to David" },
      { chapters: "1 Chr 10", description: "Saul's defeat" },
      { chapters: "1 Chr 11-20", description: "David's Takeover and Victories" },
      { chapters: "2 Chr 1-9", description: "Solomon Builds Temple" },
      { chapters: "2 Chr 10-35", description: "Conflicts and dissension and apostasy" },
      { chapters: "2 Chr 36", description: "Temple Cast down" }
    ],
    christParallel: [
      { chapters: "1-8", description: "Genealogy of man up to Christ and Satan meeting" },
      { chapters: "10", description: "Satan's defeat at Cross" },
      { chapters: "11-20", description: "Christ's Takeover and Victories" },
      { chapters: "1-9", description: "Church Builds Temple" },
      { chapters: "10-35", description: "Conflicts and dissension and apostasy" },
      { chapters: "36", description: "Temple Cast down" }
    ]
  },
  {
    book: "Ezra",
    sections: [
      { description: "Return from Babylon" },
      { description: "Rebuilding the Temple" },
      { description: "Opposition and Perseverance" }
    ],
    christParallel: [
      { description: "Church comes out of Babylon (1798)" },
      { description: "Rebuilding spiritual worship" },
      { description: "Opposition from enemies" }
    ]
  },
  {
    book: "Nehemiah",
    sections: [
      { chapters: "1", description: "Nehemiah Moved by the Deplorable Condition of Jerusalem" },
      { chapters: "2", description: "Nehemiah journeys to Jerusalem to Survey the situation and move the people to action" },
      { chapters: "3-6:15", description: "Nehemiah goes up on the wall to build. Will not come down. 52 days" },
      { chapters: "7-13", description: "Those not found among the genealogy removed from priesthood. Fasting, Revival" }
    ],
    christParallel: [
      { chapters: "1", description: "Christ moved by the sinful condition of this world" },
      { chapters: "2", description: "Christ Leaves heaven to come to this sin infested world/Surveys, moves people to action" },
      { chapters: "3", description: "Christ up on the Cross builds, will not come down" },
      { chapters: "4+", description: "NT Church... Those not found removed. Revival. Sealing. Sabbath keepers enter city" }
    ]
  },
  {
    book: "Esther",
    sections: [
      { chapters: "1-2", description: "Transition from Vashti to Esther" },
      { chapters: "3:1-6", description: "Haman, angry with Mordecai, will go after his people/Death Decree" },
      { chapters: "4-5", description: "Esther in prayer and fasting, Going in before the king" },
      { chapters: "6", description: "Haman Forced to honor Mordecai" },
      { chapters: "7-10", description: "Banquet, Haman hanged, Mordecai exalted" }
    ],
    christParallel: [
      { description: "Old Testament Church to New Testament Church" },
      { description: "Satan angry with Christ for not bowing/Goes after his people to destroy them" },
      { description: "Church goes into the inner chamber of the King for such a time as this. Day of Atonement" },
      { description: "End of Millennium/Satan will Honor Christ" },
      { description: "Satan will then be defeated at the great banquet. Jesus Exalted!" }
    ]
  },
  {
    book: "Job",
    sections: [
      { chapters: "1-2", description: "Job Tried" },
      { chapters: "3-40", description: "Attempt to prove Job Guilty" },
      { chapters: "41-42", description: "Must go through Job to be forgiven" }
    ],
    christParallel: [
      { chapters: "1-2", description: "Christ Tried" },
      { chapters: "3-40", description: "Attempt to prove Christ is Guilty" },
      { chapters: "41-42", description: "Must go through Christ to be forgiven" }
    ],
    thirdDimension: [
      { chapters: "1-2", description: "I am Tried" },
      { chapters: "3-40", description: "Attempt to prove you unworthy" },
      { chapters: "41-42", description: "Intercede for your enemies" }
    ],
    fourthDimension: [
      { chapters: "1-2", description: "Church Tried" },
      { chapters: "3-40", description: "Attempt to prove the Church is guilty" },
      { chapters: "41-42", description: "Church intercedes for its enemies" }
    ],
    fifthDimension: [
      { chapters: "1-2", description: "Jesus Tried at end of time" },
      { chapters: "3-40", description: "Attempts to Prove Christ and Christianity Tyrannical" },
      { chapters: "41-42", description: "Every Knee will bow, Second Coming" }
    ],
    sixthDimension: [
      { chapters: "1-2", description: "Christ Challenged in heaven" },
      { chapters: "3-40", description: "Attempts to Prove Christ Tyrannical" },
      { chapters: "41-42", description: "Satan and Angels Reproved, Cast out" }
    ]
  },
  // PSALMS
  {
    book: "Psalms",
    sections: [
      { chapters: "Book 1 (1-41)", description: "God will deliver the Just" },
      { chapters: "Book 2 (42-72)", description: "The Sufferings and trials" },
      { chapters: "Book 3 (73-89)", description: "Sanctuary holds the answers" },
      { chapters: "Book 4 (90-106)", description: "God's Kingdom Rules: Millennium/Rejoicing" },
      { chapters: "Book 5 (107-150)", description: "Praising for Final Deliverance" }
    ],
    christParallel: [
      { chapters: "Book 1", description: "God will protect His Christ" },
      { chapters: "Book 2", description: "Sufferings and Trial of Christ" },
      { chapters: "Book 3", description: "Christ's Ministry in the Heavenly Sanctuary" },
      { chapters: "Book 4", description: "Christ, Second Coming/Millennial Reign/Rejoicing" },
      { chapters: "Book 5", description: "Praise and Final Deliverance" }
    ]
  },
  // PROPHETS
  {
    book: "Ezekiel",
    sections: [
      { chapters: "1-3", description: "God's Commission to Ezekiel to speak to a stubborn people" },
      { chapters: "4-9", description: "Ezekiel preaches against the abominations done in the temple" },
      { chapters: "10", description: "Glory of God leaves the Temple" },
      { chapters: "11", description: "Glory of God leaves the city, stands on the eastern side" },
      { chapters: "12-22", description: "Prophesies destruction of Israel, raising up of a remnant" },
      { chapters: "25-29", description: "Warnings towards Gentile Nations" },
      { chapters: "29-32", description: "Egypt wars against Babylon, Babylon will be victorious" },
      { chapters: "33-36", description: "Ezekiel called a watchman. Promises of restored kingdom" },
      { chapters: "37", description: "Resurrection" },
      { chapters: "38-39", description: "Gog and Magog" },
      { chapters: "40-48", description: "Kingdom of Heaven" }
    ],
    christParallel: [
      { chapters: "1-3", description: "Jesus' commission to speak to a stubborn people" },
      { description: "Jesus speaks against the abominations of the temple" },
      { description: "Jesus leaves the temple desolate" },
      { description: "Jesus leaves the city and stands on the eastern side" },
      { description: "Jerusalem will be destroyed, raising up of a new people" },
      { description: "Gospel Message goes to the Gentiles" },
      { description: "King of the North defeats King of the South" },
      { description: "End-time Message" },
      { description: "Resurrection" },
      { description: "Gog Magog" },
      { description: "Kingdom of Heaven" }
    ]
  },
  {
    book: "Daniel",
    sections: [
      { chapters: "1", description: "Daniel in A Strange Land Because of Sins! Appetite" },
      { chapters: "2", description: "Man Representing a Kingdom Falls from Pride... Destroyed by Stone" },
      { chapters: "3", description: "Bow Down Before Image" },
      { chapters: "4", description: "Tree Representing Kingdom - Cut Down" },
      { chapters: "5", description: "Kingdom Finished - Cyrus - Opened Gates/Temple" },
      { chapters: "6", description: "Coming up out Lion's Den" },
      { chapters: "7", description: "1260" },
      { chapters: "8", description: "1844" },
      { chapters: "9", description: "Daniel's intercession/New People Chosen" },
      { chapters: "10-12", description: "End Time Vision Given/Book Sealed/Man on water, hands Raised" }
    ],
    christParallel: [
      { chapters: "1", description: "Christ in a Strange Land. Christ First Temptation (Appetite)" },
      { chapters: "2", description: "Christ Representing Kingdom to fall from pride/Stone to foot" },
      { chapters: "3", description: "Bow Down" },
      { chapters: "4", description: "Tree Representing Kingdom Established (Cross)" },
      { chapters: "5", description: "It is Finished/Christ Opened Gates/Temple" },
      { chapters: "6", description: "Resurrection of Christ" },
      { chapters: "7", description: "Rome, Little Horn: Attack on Christ Ministry" },
      { chapters: "8", description: "1844: Christ Moves to Most Holy" },
      { chapters: "9", description: "Christ's Intercession/New People Chosen" },
      { chapters: "10-12", description: "Little Book Opened/End Time Vision Understood/Prophesy Again" }
    ]
  },
  {
    book: "Joel",
    sections: [
      { chapters: "1", description: "Israel will be desolated. Offerings Cut Off. Call a Fast" },
      { chapters: "2", description: "Promise of Early Rain" },
      { chapters: "3", description: "The Judgment and Final Cleansing" }
    ],
    christParallel: [
      { chapters: "1", description: "Israel left desolate. Christ Rejected" },
      { chapters: "2", description: "Early Rain: Christ Ascended (Acts 2)" },
      { chapters: "3", description: "Final Events/Judgment. Christ in Judgment" }
    ]
  },
  {
    book: "Amos",
    sections: [
      { chapters: "1-4", description: "Judgment" },
      { chapters: "5-6", description: "A Shaking" },
      { chapters: "7-8", description: "Probation closed/Famine of the Word" },
      { chapters: "9", description: "Remnant Delivered" }
    ],
    christParallel: [
      { chapters: "1-4", description: "Investigative Judgment" },
      { chapters: "5-6", description: "A Shaking" },
      { chapters: "7-8", description: "Probation closed/Famine of the Word" },
      { chapters: "9", description: "Remnant Delivered" }
    ]
  },
  {
    book: "Habakkuk",
    sections: [
      { chapters: "1", description: "Current Reign of God's enemies" },
      { chapters: "2", description: "Speak the Vision, Justification by Faith, Glory of Lord fills earth" },
      { chapters: "3", description: "The Glorious Appearing" }
    ],
    christParallel: [
      { chapters: "1", description: "Rome/Babylon in control" },
      { chapters: "2", description: "Three Angel's Messages" },
      { chapters: "3", description: "The Glorious Appearing" }
    ]
  },
  {
    book: "Zephaniah",
    sections: [
      { chapters: "1", description: "Investigative Judgment" },
      { chapters: "2", description: "Last Call of Mercy" },
      { chapters: "3", description: "Remnant Saved" }
    ],
    christParallel: [
      { chapters: "1", description: "IJ" },
      { chapters: "2", description: "Last Message of Mercy" },
      { chapters: "3", description: "Remnant Saved" }
    ]
  },
  {
    book: "Haggai",
    sections: [
      { chapters: "1", description: "Repent and Build the Lord's House" },
      { chapters: "2", description: "The Desire of Ages will come and fill it" }
    ],
    christParallel: [
      { chapters: "1", description: "The work of God's Church in the Last Days" },
      { chapters: "2", description: "The Spirit will fill the House when the temple is completed" }
    ]
  },
  {
    book: "Malachi",
    sections: [
      { chapters: "1", description: "Fear of the Lord (Mal. 1:6)" },
      { chapters: "2", description: "Married daughter of Strange God/Evil good, good evil/broken covenant" },
      { chapters: "3", description: "Messenger of Covenant/Elijah/Purify Levites/Promise of Blessing. Names in Book" },
      { chapters: "4", description: "Destruction of the Wicked by Fire" }
    ],
    christParallel: [
      { chapters: "1", description: "First Angel's Message" },
      { chapters: "2", description: "Second Angel's Message" },
      { chapters: "3", description: "3rd Angel's Message/Latter Rain" },
      { chapters: "4", description: "Destruction of the Wicked" }
    ]
  },
  {
    book: "Jeremiah",
    sections: [
      { chapters: "1-10", description: "Jeremiah Prophesies against Israel" },
      { chapters: "11-28", description: "Jeremiah Plotted against, persecuted" },
      { chapters: "29-33", description: "New Covenant, buys a field" },
      { chapters: "34-39", description: "Destruction of Jerusalem" },
      { chapters: "40-51", description: "Prophecy against Jews making covenants with Egypt, Fall of Babylon" }
    ],
    christParallel: [
      { description: "Jesus Prophesies against Israel" },
      { description: "Jesus Plotted against, persecuted" },
      { description: "Jesus and the New Covenant, buys a field" },
      { chapters: "34-39", description: "Destruction of Jerusalem (AD 70)" },
      { chapters: "40-51", description: "Prophecy against Christians making covenants with World, Fall of Babylon" }
    ]
  },
  {
    book: "Hosea",
    sections: [
      { chapters: "1-5", description: "Take Harlot as Wife/God's Love for Israel" }
    ],
    christParallel: [
      { description: "Christ takes unfaithful church as bride/God's love for spiritual Israel" }
    ]
  },
  // NEW TESTAMENT
  {
    book: "John",
    sections: [
      { chapters: "1", description: "In the beginning/Lamb from Foundation" },
      { chapters: "2", description: "Wedding Feast/Water to Wine" },
      { chapters: "3", description: "New Birth" },
      { chapters: "4-17", description: "Healings/Preaching" },
      { chapters: "18-21", description: "Time of trouble/Death Burial Resurrection" }
    ],
    christParallel: [
      { description: "Creation connection - Word made flesh" },
      { description: "First miracle - transformation" },
      { description: "Must be born again" },
      { description: "Ministry of healing and teaching" },
      { description: "Passion, death, resurrection" }
    ]
  },
  {
    book: "Mark",
    sections: [
      { chapters: "1-9", description: "Baptism of Christ/Miracles/12 preaching/Multitudes Fed/Transfiguration" },
      { chapters: "11", description: "Temple Purified" },
      { chapters: "14-16", description: "Jesus' time of Trouble" }
    ],
    christParallel: [
      { description: "Latter Rain/Miracles/Preaching/Multitudes come" },
      { description: "House Purified" },
      { description: "Time of Trouble" }
    ]
  },
  {
    book: "Acts",
    sections: [
      { chapters: "1-2", description: "Outpouring of the Spirit" },
      { chapters: "3-7", description: "Preaching of the gospel: Shaking within Church/Purification/Persecution" },
      { chapters: "8-27", description: "Preaching to the gentiles, great multitude" },
      { chapters: "28", description: "Paul arrested, taken to Rome" }
    ],
    christParallel: [
      { description: "Latter Rain outpouring" },
      { description: "Final message/shaking" },
      { description: "Gospel to all nations" },
      { description: "Final persecution under Rome/Babylon" }
    ]
  },
  {
    book: "Romans",
    sections: [
      { chapters: "1-3", description: "The power of the Gospel" },
      { chapters: "3-4", description: "Jew and Gentile equal, Abraham justified by faith" },
      { chapters: "5-8", description: "Old life dead, deliverance from sin by Spirit" },
      { chapters: "9-11", description: "Explanation of Literal Israel to Spiritual Israel" },
      { chapters: "12-16", description: "Present bodies as living sacrifices" }
    ],
    christParallel: [
      { description: "The power of the Everlasting Gospel" },
      { description: "To every nation kindred tongue and people" },
      { description: "The third angel's message of justification by faith" },
      { description: "The finalizing of spiritual Israel" },
      { description: "Living Sacrifices" }
    ]
  }
];

// ============================================================
// KEY FIGURE PATTERNS (Examples of Christ in OT figures)
// ============================================================

export interface KeyFigurePattern {
  figure: string;
  christParallel: string[];
  keyPoints: string[];
}

export const KEY_FIGURE_PATTERNS: KeyFigurePattern[] = [
  {
    figure: "Joseph",
    christParallel: [
      "Beloved of Father",
      "Sent to brothers who reject him",
      "Sold for silver",
      "Falsely accused",
      "Imprisoned between two criminals",
      "Exalted to save nations",
      "Brothers bow before him"
    ],
    keyPoints: [
      "Hated by His brothers. They must come to him in time of famine",
      "Christ hated by his own, they must come to him",
      "You will be hated by your own, but be faithful",
      "The Church is hated but will be vindicated",
      "Wicked Humanity hates God's People but will bow before them"
    ]
  },
  {
    figure: "Jonah",
    christParallel: [
      "Gethsemane - Fleeing God's will",
      "Death, Burial, Resurrection - 3 days in fish",
      "Ascends and Preaches for the Saving of the Nations"
    ],
    keyPoints: [
      "My Will or God's Will",
      "Into the Belly, Out of the Belly",
      "Sent to Preach and Warn, Saving of a Nation",
      "God Saves the Repentant"
    ]
  },
  {
    figure: "Moses",
    christParallel: [
      "Decree to kill all male children",
      "Moses goes into the wilderness for 40 years",
      "Returns to Deliver his people"
    ],
    keyPoints: [
      "Drawn out of water",
      "40 years/40 days pattern",
      "Deliverer of God's people"
    ]
  },
  {
    figure: "David",
    christParallel: [
      "Anointed while young, not yet ruling",
      "Persecuted by the king in power",
      "Many leave the corrupt system to join him",
      "Eventually enthroned as rightful king"
    ],
    keyPoints: [
      "Shepherd becomes King",
      "Type of Christ receiving His kingdom at 1844",
      "Waiting for full enthronement"
    ]
  },
  {
    figure: "Elijah to Elisha",
    christParallel: [
      "Elijah transitions to Elisha at the Jordan",
      "Elijah removed, Elisha receives Double the Power",
      "Disciples of Elijah follow Elisha",
      "Elisha's first miracle provides drink for the thirsty"
    ],
    keyPoints: [
      "John the Baptist to Jesus transition",
      "Jordan baptism",
      "Double portion of the Spirit"
    ]
  }
];

// ============================================================
// DIVINE DESIGN: WATERS PATTERN
// ============================================================

export interface WaterPattern {
  reference: string;
  location: string;
  meaning: string;
}

export const WATERS_PATTERNS: WaterPattern[] = [
  { reference: "Genesis 1-2", location: "Rivers of Eden", meaning: "Paradise, Paradise Lost" },
  { reference: "Exodus 1-2", location: "Nile", meaning: "Captivity to Sin/Bondage" },
  { reference: "Exodus 14", location: "Red Sea", meaning: "Deliverance From Sin through Sacrifice" },
  { reference: "Joshua 1-3", location: "Jordan", meaning: "Israel Baptized, Ready to Conquer" },
  { reference: "1 Kings 17:1-3", location: "Cherith", meaning: "Protection in Wilderness 3.5 years (1260)" },
  { reference: "Ezekiel 1, 10", location: "Chebar", meaning: "Ezekiel Called re: Abominations (Reformation)" },
  { reference: "Daniel 7", location: "Mediterranean", meaning: "Little Horn Identified" },
  { reference: "Daniel 8", location: "Ulai", meaning: "Cleansing of the Sanctuary: 1844" },
  { reference: "Daniel 10-12", location: "Hiddikel", meaning: "Perfecting of God's People/End Time Vision" },
  { reference: "Gospels", location: "Sea of Galilee", meaning: "Multitudes healed and saved by gospel" },
  { reference: "John 18:1", location: "Brook Cedron", meaning: "Gethsemane" },
  { reference: "Revelation 16", location: "Euphrates River", meaning: "Drying up of Enemy Forces" },
  { reference: "Revelation 21-22", location: "River of Life", meaning: "Paradise Restored" }
];

// ============================================================
// CREATION WEEK PATTERN
// ============================================================

export interface CreationDayPattern {
  day: number;
  creation: string;
  salvationParallel: string;
}

export const CREATION_WEEK_PATTERN: CreationDayPattern[] = [
  { day: 1, creation: "Darkness: Let there be light", salvationParallel: "Sin and the Plan of Salvation" },
  { day: 2, creation: "Waters Separate vertically", salvationParallel: "The Flood" },
  { day: 3, creation: "Waters Separate Horizontally", salvationParallel: "The Red Sea (Exodus and Birth of Church)" },
  { day: 4, creation: "Sun", salvationParallel: "Coming of Jesus" },
  { day: 5, creation: "Fish and Birds", salvationParallel: "Pentecost, Fishers of Men, New Testament Church" },
  { day: 6, creation: "Man Made in God's Image, Dominion over Beast", salvationParallel: "Mystery of God Finished: Christ in you/Victory over Beast" },
  { day: 7, creation: "Sabbath: Rest", salvationParallel: "Sabbath: Millennium: Satan Sealed Up. Rest" }
];

// ============================================================
// PAUL'S LETTERS TO 7 CHURCHES PARALLEL
// ============================================================

export interface LetterChurchParallel {
  paulLetter: string;
  sevenChurch: string;
  warning: string;
  resultIfNeglected: string;
}

export const PAULS_LETTERS_PARALLEL: LetterChurchParallel[] = [
  {
    paulLetter: "Romans",
    sevenChurch: "Ephesus",
    warning: "Justification by faith, denial of the law of God",
    resultIfNeglected: "Denial of Justification by faith"
  },
  {
    paulLetter: "Corinthians",
    sevenChurch: "Smyrna",
    warning: "Divisions, Pride, following men, idol worship",
    resultIfNeglected: "Divisions of Men: Peter, head of church, idol worship"
  },
  {
    paulLetter: "Galatians",
    sevenChurch: "Pergamos",
    warning: "Warnings against Traditions, salvation by works",
    resultIfNeglected: "Lift up Traditions, Salvation by Works"
  },
  {
    paulLetter: "Ephesians",
    sevenChurch: "Thyatira",
    warning: "No distinctions Jew/Gentile, unity, Winds of Doctrine",
    resultIfNeglected: "Division in Body of Christ, Some greater than others"
  },
  {
    paulLetter: "Philippians",
    sevenChurch: "Sardis",
    warning: "Rejoice in lowly service, beware evil workers, enemies of cross",
    resultIfNeglected: "Denial of spirit of humility, enemies of cross"
  },
  {
    paulLetter: "Colossians",
    sevenChurch: "Philadelphia",
    warning: "Enticing away from Christ: Meats, drinks, worship of angels",
    resultIfNeglected: "Traditions, Worshipping of angels"
  },
  {
    paulLetter: "Thessalonians",
    sevenChurch: "Laodicea",
    warning: "Time of coming/State of Dead/Man of Sin, faithfulness under persecution",
    resultIfNeglected: "Changing times/state of dead/Man of Sin"
  }
];

// ============================================================
// SEVEN CHURCHES IN HEAVEN DIMENSION (6th Dimension)
// ============================================================

export interface ChurchHeavenDimension {
  church: string;
  meaning: string;
  heavenParallel: string;
}

export const SEVEN_CHURCHES_HEAVEN: ChurchHeavenDimension[] = [
  { church: "Ephesus", meaning: "Desirable", heavenParallel: "Permitted (sin)" },
  { church: "Smyrna", meaning: "Bitterness", heavenParallel: "Bitterness is the result" },
  { church: "Pergamos", meaning: "Height-Elevation", heavenParallel: "Satan's seat (My throne)" },
  { church: "Thyatira", meaning: "Oil of Affliction", heavenParallel: "War in heaven" },
  { church: "Sardis", meaning: "Remaining Ones", heavenParallel: "Escaped Satan's Deception" },
  { church: "Philadelphia", meaning: "Brotherly Love", heavenParallel: "Angels that drew together" },
  { church: "Laodicea", meaning: "Judgment", heavenParallel: "Judgment" }
];

// ============================================================
// HELPER FUNCTIONS
// ============================================================

export function getBookPattern(bookName: string): BookPattern | undefined {
  return BOOK_PATTERNS.find(bp => 
    bp.book.toLowerCase() === bookName.toLowerCase() ||
    bp.book.toLowerCase().includes(bookName.toLowerCase())
  );
}

export function getKeyFigurePattern(figureName: string): KeyFigurePattern | undefined {
  return KEY_FIGURE_PATTERNS.find(kf => 
    kf.figure.toLowerCase() === figureName.toLowerCase()
  );
}

export function getDimensionExplanation(level: number): Dimension | undefined {
  return SIX_DIMENSIONS.find(d => d.level === level);
}

export function getFeastPattern(feastName: string): FeastPattern | undefined {
  return FEAST_PATTERNS.find(fp => 
    fp.feast.toLowerCase().includes(feastName.toLowerCase())
  );
}
