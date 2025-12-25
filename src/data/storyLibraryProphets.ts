// Major and Minor Prophets: Isaiah through Malachi

export interface ChristPattern {
  element: string;
  christApplication: string;
}

export interface SixDimensions {
  literal: string;
  christ: string;
  personal: string;
  church: string;
  heavenFuture: string;
  heavenPast: string;
}

export interface BiblicalStory {
  id: string;
  title: string;
  reference: string;
  volume: string;
  category: string;
  summary: string;
  keyElements: string[];
  christPattern: ChristPattern[];
  dimensions: SixDimensions;
  relatedStories: string[];
  keyFigures?: string[];
  setting?: string;
}

// Isaiah Stories
export const isaiahStories: BiblicalStory[] = [
  {
    id: "isaiah-call",
    title: "Isaiah's Commission",
    reference: "Isaiah 6",
    volume: "Isaiah",
    category: "Prophets",
    summary: "In the year King Uzziah died, Isaiah sees the Lord high and lifted up. Seraphim cry 'Holy, holy, holy.' Isaiah confesses he's undone—unclean lips. A coal from altar cleanses him. 'Whom shall I send?' 'Here am I, send me.'",
    keyElements: ["Year Uzziah died", "Lord high and lifted up", "Train fills temple", "Seraphim with six wings", "Holy, holy, holy", "Foundations shake", "\"Woe is me! Undone\"", "Live coal touches lips", "\"Whom shall I send?\"", "\"Here am I, send me\""],
    christPattern: [
      { element: "Lord high and lifted up", christApplication: "John 12:41 says Isaiah saw Christ's glory" },
      { element: "Holy, holy, holy", christApplication: "Trinity declared" },
      { element: "Cleansing coal", christApplication: "Christ's purifying sacrifice" }
    ],
    dimensions: {
      literal: "Prophet's call vision",
      christ: "Isaiah saw Christ's glory",
      personal: "Am I cleansed and sent?",
      church: "Church is commissioned",
      heavenFuture: "We'll see Him face to face",
      heavenPast: "God on throne from eternity"
    },
    relatedStories: ["John 12:41", "Revelation 4:8"],
    keyFigures: ["Isaiah", "Seraphim", "The Lord"],
    setting: "Temple vision"
  },
  {
    id: "suffering-servant",
    title: "The Suffering Servant",
    reference: "Isaiah 53",
    volume: "Isaiah",
    category: "Messianic",
    summary: "The greatest Messianic prophecy. He was despised, rejected, a man of sorrows. He bore our griefs, carried our sorrows. Wounded for our transgressions. Like sheep gone astray. He was oppressed, led as lamb to slaughter. Cut off from living; grave with wicked and rich. Shall see His seed, prolong His days.",
    keyElements: ["Despised and rejected", "Man of sorrows", "Bore our griefs", "Wounded for transgressions", "Bruised for iniquities", "Chastisement for peace", "By stripes healed", "All like sheep strayed", "LORD laid on Him our iniquity", "Lamb to slaughter", "Silent before shearers", "Grave with wicked, rich", "Shall see seed", "Justify many"],
    christPattern: [
      { element: "Every detail fulfilled", christApplication: "Written 700 years before cross" },
      { element: "Substitutionary atonement", christApplication: "Christ died for us" },
      { element: "Silent lamb", christApplication: "Christ before Pilate" }
    ],
    dimensions: {
      literal: "Prophecy of Messiah's death",
      christ: "Direct prophecy of Christ",
      personal: "He bore MY sins",
      church: "Church preaches the Lamb",
      heavenFuture: "He will see His seed",
      heavenPast: "Planned from before foundation"
    },
    relatedStories: ["Acts 8:32-35 (Philip explains to Ethiopian)", "1 Peter 2:24-25"],
    keyFigures: ["The Servant (Christ)", "Isaiah"],
    setting: "N/A - Prophecy"
  }
];

// Jeremiah Stories  
export const jeremiahStories: BiblicalStory[] = [
  {
    id: "jeremiah-call",
    title: "Jeremiah's Call",
    reference: "Jeremiah 1",
    volume: "Jeremiah",
    category: "Prophets",
    summary: "God tells Jeremiah he was known before birth, sanctified, ordained a prophet to nations. Jeremiah protests youth. God touches his mouth, gives words. Two visions: almond rod (watching) and boiling pot from north. 'They shall fight but not prevail.'",
    keyElements: ["Before I formed you", "I knew you", "Sanctified and ordained", "\"I am a child\"", "Don't say child", "Touch mouth—words given", "Set over nations", "Almond rod (watching)", "Boiling pot from north", "Fortified city, iron pillar"],
    christPattern: [
      { element: "Known before birth", christApplication: "Christ foreordained" },
      { element: "Prophet to nations", christApplication: "Christ is prophet to all" },
      { element: "Words given", christApplication: "Christ speaks Father's words" }
    ],
    dimensions: {
      literal: "Prophet's call",
      christ: "Christ foreknown and sent",
      personal: "God knew me before birth",
      church: "Church called before foundation",
      heavenFuture: "All will hear",
      heavenPast: "Plan from eternity"
    },
    relatedStories: ["Galatians 1:15 (Paul's call)", "Psalm 139:13-16"],
    keyFigures: ["Jeremiah", "God"],
    setting: "Anathoth"
  },
  {
    id: "new-covenant",
    title: "The New Covenant",
    reference: "Jeremiah 31:31-34",
    volume: "Jeremiah",
    category: "Messianic",
    summary: "God promises a new covenant—not like Sinai which they broke. This covenant: law written on hearts, all will know Him from least to greatest, sins remembered no more.",
    keyElements: ["New covenant coming", "Not like Sinai", "Took by hand from Egypt", "They broke it", "Law on hearts", "I will be their God", "All shall know Me", "From least to greatest", "Forgive iniquity", "Remember sin no more"],
    christPattern: [
      { element: "New covenant", christApplication: "Instituted at Last Supper" },
      { element: "Law on heart", christApplication: "Spirit writes law within" },
      { element: "Sins forgotten", christApplication: "Complete forgiveness in Christ" }
    ],
    dimensions: {
      literal: "Promise of new covenant",
      christ: "Christ mediator of new covenant",
      personal: "New heart available",
      church: "Church is new covenant people",
      heavenFuture: "Covenant fulfilled completely",
      heavenPast: "Plan from eternity"
    },
    relatedStories: ["Hebrews 8:8-12 (Quotes Jeremiah)", "Luke 22:20 (New covenant in blood)"],
    keyFigures: ["Jeremiah", "Israel", "Judah"],
    setting: "N/A - Prophecy"
  }
];

// Lamentations Stories
export const lamentationsStories: BiblicalStory[] = [
  {
    id: "jerusalem-destroyed",
    title: "Lament Over Jerusalem",
    reference: "Lamentations 1-5",
    volume: "Lamentations",
    category: "Prophets",
    summary: "Jeremiah weeps over destroyed Jerusalem. The city sits solitary. Enemies prosper. Yet in the middle: God's mercies are new every morning, great is His faithfulness. The LORD is good to those who wait for Him.",
    keyElements: ["How lonely sits the city", "Princess become slave", "Roads mourn", "Enemies at ease", "LORD has afflicted", "New mercies every morning", "Great is faithfulness", "LORD is my portion", "Good to wait for LORD", "Search and return to LORD"],
    christPattern: [
      { element: "Weeping prophet", christApplication: "Christ wept over Jerusalem" },
      { element: "Faithful in judgment", christApplication: "God's mercies never cease" },
      { element: "Hope returns", christApplication: "Restoration through Christ" }
    ],
    dimensions: {
      literal: "Mourning over destruction",
      christ: "Christ wept over same city",
      personal: "Even in judgment, hope",
      church: "Church may suffer but hope",
      heavenFuture: "No more sorrow",
      heavenPast: "Sin brings consequences"
    },
    relatedStories: ["Luke 19:41-44 (Jesus weeps)", "Matthew 23:37-39"],
    keyFigures: ["Jeremiah"],
    setting: "Destroyed Jerusalem"
  }
];

// Ezekiel Stories
export const ezekielStories: BiblicalStory[] = [
  {
    id: "ezekiel-vision",
    title: "Ezekiel's Vision",
    reference: "Ezekiel 1",
    volume: "Ezekiel",
    category: "Prophets",
    summary: "By river Chebar, heavens open. Ezekiel sees four living creatures—each with four faces (man, lion, ox, eagle), four wings, wheels within wheels full of eyes, moving with Spirit. Above: crystal firmament, throne of sapphire, figure like man with fire—the glory of the LORD.",
    keyElements: ["Heavens opened", "Four living creatures", "Four faces each", "Wheels within wheels", "Full of eyes", "Moving with Spirit", "Crystal firmament", "Sapphire throne", "Figure like fire", "Glory of LORD", "Ezekiel falls on face"],
    christPattern: [
      { element: "One like man on throne", christApplication: "Christ in glory" },
      { element: "Four faces", christApplication: "Christ as King, Servant, Man, God (4 Gospels)" },
      { element: "Wheels move with Spirit", christApplication: "God's providence directed by Spirit" }
    ],
    dimensions: {
      literal: "Throne vision in exile",
      christ: "Christ on the throne",
      personal: "God's glory available even in exile",
      church: "Church worships enthroned Christ",
      heavenFuture: "We'll see Him on throne",
      heavenPast: "God always reigning"
    },
    relatedStories: ["Revelation 4 (Similar vision)", "Isaiah 6"],
    keyFigures: ["Ezekiel", "Living creatures"],
    setting: "River Chebar, Babylon"
  },
  {
    id: "dry-bones",
    title: "Valley of Dry Bones",
    reference: "Ezekiel 37:1-14",
    volume: "Ezekiel",
    category: "Prophets",
    summary: "Ezekiel transported to valley of dry bones. 'Can these bones live?' Prophesy to bones; they connect and flesh covers. Prophesy to breath; they live and stand—exceeding great army. Interpretation: whole house of Israel restored.",
    keyElements: ["Valley full of bones", "Very dry", "\"Can these live?\"", "Prophesy to bones", "Noise and shaking", "Bones connect", "Sinews and flesh", "Skin covers", "No breath yet", "Prophesy to breath", "Stand—great army", "\"Our hope is lost\"", "\"I will put My Spirit\""],
    christPattern: [
      { element: "Dead brought to life", christApplication: "Christ is resurrection and life" },
      { element: "Breath/Spirit gives life", christApplication: "Holy Spirit regenerates" },
      { element: "Whole nation restored", christApplication: "Church gathered from all nations" }
    ],
    dimensions: {
      literal: "Vision of Israel's restoration",
      christ: "Christ raises the dead",
      personal: "Can my dead areas live again?",
      church: "Church revived by Spirit",
      heavenFuture: "Final resurrection",
      heavenPast: "God always restoring"
    },
    relatedStories: ["John 11:25-26", "Romans 8:11", "Revelation 20:4-6"],
    keyFigures: ["Ezekiel", "Israel"],
    setting: "Valley in vision"
  }
];

// Minor Prophets Stories
export const hoseaStories: BiblicalStory[] = [
  {
    id: "hosea-gomer",
    title: "Hosea and Gomer",
    reference: "Hosea 1-3",
    volume: "Hosea",
    category: "Prophets",
    summary: "God commands Hosea to marry a prostitute named Gomer—a living picture of Israel's unfaithfulness. She bears children with prophetic names. She leaves for lovers. God tells Hosea to buy her back and love her again. God's relentless love for unfaithful Israel.",
    keyElements: ["Marry a prostitute", "Gomer as Israel", "Children: Jezreel, Lo-ruhamah, Lo-ammi", "She plays harlot", "Buys her back", "Loves her again", "God's love for Israel", "\"I will allure her\"", "\"Call Me Husband\""],
    christPattern: [
      { element: "Buys back unfaithful wife", christApplication: "Christ redeems the church" },
      { element: "Relentless love", christApplication: "Christ's unfailing love" },
      { element: "Pays the price", christApplication: "Christ paid our ransom" }
    ],
    dimensions: {
      literal: "Prophet's marriage as parable",
      christ: "Christ loves unfaithful church",
      personal: "God pursues me though I stray",
      church: "Church often unfaithful, yet loved",
      heavenFuture: "Bride made faithful forever",
      heavenPast: "God's love never stopped"
    },
    relatedStories: ["Ephesians 5:25-27", "Revelation 19:7-8"],
    keyFigures: ["Hosea", "Gomer"],
    setting: "Northern Israel"
  }
];

export const joelStories: BiblicalStory[] = [
  {
    id: "joel-pentecost",
    title: "Spirit Poured Out",
    reference: "Joel 2:28-32",
    volume: "Joel",
    category: "Prophets",
    summary: "After locust plague, God promises restoration. In last days, Spirit poured on all flesh—sons and daughters prophesy, old dream dreams, young see visions. Signs in heaven and earth. Whoever calls on LORD's name shall be saved.",
    keyElements: ["Afterward—Spirit poured", "All flesh", "Sons and daughters prophesy", "Old men dream", "Young men see visions", "Even servants", "Blood, fire, smoke", "Sun dark, moon blood", "Before Day of LORD", "Call on name, be saved"],
    christPattern: [
      { element: "Spirit poured out", christApplication: "Fulfilled at Pentecost" },
      { element: "All flesh", christApplication: "Gospel to all" },
      { element: "Call and be saved", christApplication: "Romans 10:13" }
    ],
    dimensions: {
      literal: "Promise of Spirit outpouring",
      christ: "Christ sends the Spirit",
      personal: "Spirit available to me",
      church: "Church empowered at Pentecost",
      heavenFuture: "Latter rain outpouring",
      heavenPast: "Plan from eternity"
    },
    relatedStories: ["Acts 2:16-21 (Peter quotes)", "Romans 10:13"],
    keyFigures: ["Joel"],
    setting: "Judah"
  }
];

export const amosStories: BiblicalStory[] = [
  {
    id: "amos-shepherd",
    title: "Amos the Shepherd Prophet",
    reference: "Amos 7:14-15",
    volume: "Amos",
    category: "Prophets",
    summary: "Amos, a shepherd and sycamore fig farmer from Tekoa, is called by God to prophesy against Israel's social injustice and religious hypocrisy. 'I am no prophet's son—the LORD took me and said, Go prophesy.'",
    keyElements: ["Not a prophet by trade", "Shepherd and farmer", "God took him", "Go prophesy to Israel", "Judgment on nations", "Social justice themes", "Sell poor for silver", "Let justice roll", "Seek Me and live"],
    christPattern: [
      { element: "Common man called", christApplication: "Christ chose fishermen" },
      { element: "Justice demanded", christApplication: "Christ is just judge" },
      { element: "Seek Me and live", christApplication: "Come to Christ and live" }
    ],
    dimensions: {
      literal: "Prophet's call and message",
      christ: "Christ came for justice",
      personal: "God uses ordinary people",
      church: "Church must seek justice",
      heavenFuture: "Justice will roll like waters",
      heavenPast: "God always cared for poor"
    },
    relatedStories: ["Amos 5:24 (Let justice roll)", "Micah 6:8"],
    keyFigures: ["Amos", "Amaziah"],
    setting: "Tekoa, Bethel"
  }
];

export const obadiahStories: BiblicalStory[] = [
  {
    id: "obadiah-edom",
    title: "Judgment on Edom",
    reference: "Obadiah 1",
    volume: "Obadiah",
    category: "Prophets",
    summary: "Shortest OT book. Pronounces doom on Edom (Esau's descendants) for violence against Jacob. They gloated over Jerusalem's destruction. 'As you have done, it shall be done to you.' But on Mount Zion there shall be deliverance.",
    keyElements: ["Vision concerning Edom", "Pride of your heart", "Dwell in clefts of rock", "\"Who can bring me down?\"", "Stood against brother Jacob", "Gloated in calamity", "\"As you have done\"", "Day of LORD near", "Mount Zion—deliverance", "Kingdom shall be LORD's"],
    christPattern: [
      { element: "Pride brought low", christApplication: "Opposite of Christ's humility" },
      { element: "Deliverance on Zion", christApplication: "Salvation in Christ" },
      { element: "Kingdom is LORD's", christApplication: "Christ's eternal kingdom" }
    ],
    dimensions: {
      literal: "Edom's judgment",
      christ: "Christ saves on Zion",
      personal: "Pride goes before fall",
      church: "Church will be delivered",
      heavenFuture: "Kingdom shall be LORD's",
      heavenPast: "Jacob/Esau conflict"
    },
    relatedStories: ["Genesis 25-27", "Revelation 11:15"],
    keyFigures: ["Obadiah", "Edom"],
    setting: "Judah"
  }
];

export const micahStories: BiblicalStory[] = [
  {
    id: "micah-bethlehem",
    title: "Bethlehem Prophecy",
    reference: "Micah 5:2",
    volume: "Micah",
    category: "Messianic",
    summary: "Though Bethlehem is small among Judah's clans, from it will come One to rule Israel—whose origins are from old, from everlasting. This Ruler will shepherd in the LORD's strength.",
    keyElements: ["Bethlehem Ephrathah", "Little among thousands", "From you shall come", "Ruler in Israel", "Goings forth from old", "From everlasting", "Stand and shepherd", "In strength of LORD", "Peace to ends of earth"],
    christPattern: [
      { element: "Bethlehem birthplace", christApplication: "Jesus born in Bethlehem" },
      { element: "From everlasting", christApplication: "Christ is eternal" },
      { element: "Ruler and shepherd", christApplication: "Christ is King and Shepherd" }
    ],
    dimensions: {
      literal: "Messianic birthplace prophecy",
      christ: "Direct prophecy of Christ",
      personal: "From small beginnings",
      church: "Church born from small start",
      heavenFuture: "Everlasting kingdom",
      heavenPast: "Christ from eternity"
    },
    relatedStories: ["Matthew 2:1-6", "John 7:42"],
    keyFigures: ["Micah"],
    setting: "Judah"
  }
];

export const nahumStories: BiblicalStory[] = [
  {
    id: "nahum-nineveh",
    title: "Nineveh's Fall",
    reference: "Nahum 1-3",
    volume: "Nahum",
    category: "Prophets",
    summary: "About 150 years after Jonah, Nineveh has returned to wickedness. Nahum prophesies its destruction. God is jealous, slow to anger but great in power. Nineveh will be flooded and burned. 'No healing for your wound.' Fulfilled in 612 BC.",
    keyElements: ["God jealous and avenging", "Slow to anger", "Great in power", "Will not acquit wicked", "Good in day of trouble", "Nineveh flooded", "Fire will devour", "\"Where is lions' den?\"", "No healing for wound", "All who hear will clap"],
    christPattern: [
      { element: "God avenges", christApplication: "Christ will avenge His people" },
      { element: "Slow to anger", christApplication: "Christ patient but just" },
      { element: "Refuge in trouble", christApplication: "Christ is our refuge" }
    ],
    dimensions: {
      literal: "Nineveh destroyed",
      christ: "Christ judges the wicked",
      personal: "God's patience has limits",
      church: "Church trusts God's justice",
      heavenFuture: "All evil destroyed",
      heavenPast: "God always judges sin"
    },
    relatedStories: ["Jonah (Nineveh repented)", "Zephaniah 2:13-15"],
    keyFigures: ["Nahum"],
    setting: "Judah"
  }
];

export const habakkukStories: BiblicalStory[] = [
  {
    id: "habakkuk-faith",
    title: "The Just Shall Live by Faith",
    reference: "Habakkuk 2:4",
    volume: "Habakkuk",
    category: "Prophets",
    summary: "Habakkuk questions God: Why do the wicked prosper? Why use Babylon to judge? God answers: Write the vision. The proud soul is not upright, but the just shall live by faith. Though the fig tree doesn't blossom, I will rejoice in God of my salvation.",
    keyElements: ["How long, O LORD?", "Why show me iniquity?", "Babylon as instrument", "I will watch to see", "Write the vision", "Vision awaits time", "Proud soul not upright", "Just live by faith", "Earth filled with glory", "Though fig tree fails", "Yet I will rejoice"],
    christPattern: [
      { element: "Just live by faith", christApplication: "Justification by faith in Christ" },
      { element: "Vision awaits", christApplication: "Prophecy fulfilled in Christ" },
      { element: "Rejoice anyway", christApplication: "Joy in Christ despite circumstances" }
    ],
    dimensions: {
      literal: "Prophet's questions and faith",
      christ: "Faith in Christ saves",
      personal: "Live by faith, not sight",
      church: "Church lives by faith",
      heavenFuture: "Earth filled with glory",
      heavenPast: "Faith always the way"
    },
    relatedStories: ["Romans 1:17", "Galatians 3:11", "Hebrews 10:38"],
    keyFigures: ["Habakkuk"],
    setting: "Judah"
  }
];

export const zephaniahStories: BiblicalStory[] = [
  {
    id: "zephaniah-day",
    title: "Day of the LORD",
    reference: "Zephaniah 1-3",
    volume: "Zephaniah",
    category: "Prophets",
    summary: "Day of LORD is near—a day of wrath, trouble, distress, devastation. Seek the LORD, all you humble. Yet God promises to restore, rejoice over His people with singing. 'I will remove disaster; I will deal with oppressors.'",
    keyElements: ["Day of LORD near", "Day of wrath", "Day of trouble", "Darkness and gloom", "Seek LORD while may be found", "Seek righteousness, meekness", "Perhaps be hidden", "Remnant saved", "God rejoices over you", "With singing", "I will save the lame"],
    christPattern: [
      { element: "Day of wrath", christApplication: "Christ returns in judgment" },
      { element: "Seek while able", christApplication: "Today is day of salvation" },
      { element: "God sings over us", christApplication: "Christ rejoices in His bride" }
    ],
    dimensions: {
      literal: "Warning of coming judgment",
      christ: "Christ both judges and saves",
      personal: "Seek Him today",
      church: "Church warned and comforted",
      heavenFuture: "Day of LORD comes",
      heavenPast: "God's character unchanged"
    },
    relatedStories: ["1 Thessalonians 5:2", "2 Peter 3:10"],
    keyFigures: ["Zephaniah"],
    setting: "Judah"
  }
];

export const haggaiStories: BiblicalStory[] = [
  {
    id: "haggai-temple",
    title: "Rebuild the Temple",
    reference: "Haggai 1-2",
    volume: "Haggai",
    category: "Prophets",
    summary: "Returned exiles have built their own houses but left temple in ruins. Haggai challenges: Consider your ways! Plant much, harvest little. Build the temple, and God will be glorified. 'The glory of this latter house shall be greater than the former.'",
    keyElements: ["Consider your ways", "My house lies waste", "You dwell in paneled houses", "Plant much, harvest little", "Bag with holes", "Go to mountain, bring wood", "Build the house", "I will shake heavens", "Glory of latter house greater", "Desire of nations comes"],
    christPattern: [
      { element: "Greater latter glory", christApplication: "Christ came to this temple" },
      { element: "Desire of nations", christApplication: "Christ is desire of nations" },
      { element: "Build God's house first", christApplication: "Seek first the kingdom" }
    ],
    dimensions: {
      literal: "Temple rebuilding",
      christ: "Christ is the true temple",
      personal: "What am I building first?",
      church: "Church is spiritual temple",
      heavenFuture: "Eternal temple",
      heavenPast: "God's presence essential"
    },
    relatedStories: ["Ezra 5:1", "Matthew 6:33"],
    keyFigures: ["Haggai", "Zerubbabel", "Joshua"],
    setting: "Jerusalem"
  }
];

export const zechariahStories: BiblicalStory[] = [
  {
    id: "zechariah-branch",
    title: "The Branch",
    reference: "Zechariah 3:8; 6:12-13",
    volume: "Zechariah",
    category: "Messianic",
    summary: "Joshua the high priest stands before the Angel of the LORD; Satan accuses. Filthy garments removed, clean ones given. 'Behold, I am bringing My Servant the Branch.' He shall build the temple, bear glory, be priest on throne—priest and king united.",
    keyElements: ["Joshua in filthy garments", "Satan accusing", "\"The LORD rebuke you\"", "Filthy garments removed", "Clean robes given", "My Servant the Branch", "Shall build temple", "Bear glory", "Sit and rule on throne", "Priest on His throne", "Counsel of peace"],
    christPattern: [
      { element: "Filthy to clean", christApplication: "Christ removes our sin" },
      { element: "Branch", christApplication: "Christ the Branch of David" },
      { element: "Priest-King", christApplication: "Christ is both" }
    ],
    dimensions: {
      literal: "Cleansing of priesthood",
      christ: "Christ cleanses and rules",
      personal: "My filthy garments removed",
      church: "Church made clean",
      heavenFuture: "Christ reigns as priest-king",
      heavenPast: "Melchizedek prefigured"
    },
    relatedStories: ["Hebrews 7 (Priest forever)", "Revelation 1:13 (Clothed in robe)"],
    keyFigures: ["Zechariah", "Joshua", "Angel of LORD"],
    setting: "Jerusalem"
  }
];

export const malachiStories: BiblicalStory[] = [
  {
    id: "malachi-messenger",
    title: "The Messenger",
    reference: "Malachi 3-4",
    volume: "Malachi",
    category: "Messianic",
    summary: "Behold, I send My messenger to prepare the way. The Lord you seek will suddenly come to His temple. He is like refiner's fire. Bring tithes—prove Me. Sun of Righteousness rises with healing in His wings. Elijah comes before the great day.",
    keyElements: ["I send My messenger", "Prepare the way", "Lord comes suddenly", "Refiner's fire", "Fuller's soap", "Purify Levites", "\"Return to Me\"", "Bring tithes to storehouse", "Test Me—windows of heaven", "Sun of Righteousness", "Healing in wings", "Elijah before Day"],
    christPattern: [
      { element: "Messenger preparing", christApplication: "John the Baptist" },
      { element: "Lord comes to temple", christApplication: "Christ's first coming" },
      { element: "Sun of Righteousness", christApplication: "Christ the Light" }
    ],
    dimensions: {
      literal: "Final OT prophecy",
      christ: "Christ is the Sun rising",
      personal: "Will I return to God?",
      church: "Church waits for His coming",
      heavenFuture: "Elijah ministry before end",
      heavenPast: "Prophets pointed to Christ"
    },
    relatedStories: ["Matthew 11:10 (Messenger)", "Luke 1:17 (Elijah spirit)"],
    keyFigures: ["Malachi"],
    setting: "Post-exilic Jerusalem"
  }
];
