// Extended Biblical Story Room Library - Additional Books
// Leviticus, Numbers, Deuteronomy, Joshua, Judges, Ruth, Samuel, Kings, etc.

// Re-define interface to avoid circular dependency
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

// Volume: Leviticus Stories
export const leviticusStories: BiblicalStory[] = [
  {
    id: "nadab-abihu",
    title: "Nadab and Abihu",
    reference: "Leviticus 10:1-7",
    volume: "Leviticus",
    category: "Sanctuary",
    summary: "Aaron's sons Nadab and Abihu offer strange fire before the Lord, which He had not commanded. Fire comes out from the Lord and devours them. Moses instructs Aaron not to mourn publicly, emphasizing the holiness of God and the seriousness of approaching Him properly.",
    keyElements: [
      "Strange fire - unauthorized worship",
      "Fire from the Lord consumes them",
      "No mourning allowed publicly",
      "Holiness of God demonstrated",
      "Obedience in worship required"
    ],
    christPattern: [
      { element: "Strange fire", christApplication: "False worship rejected" },
      { element: "God's fire consumes", christApplication: "Holy God cannot tolerate sin" },
      { element: "Proper approach required", christApplication: "Only through Christ can we approach God" }
    ],
    dimensions: {
      literal: "Historical judgment on improper worship",
      christ: "Only Christ's mediation acceptable to God",
      personal: "Am I worshipping God His way or my way?",
      church: "Churches must worship according to Scripture",
      heavenFuture: "Only true worshippers will stand",
      heavenPast: "Lucifer's false worship rejected"
    },
    relatedStories: ["Hebrews 12:29 (God is consuming fire)", "1 Samuel 6 (Uzzah touches ark)"],
    keyFigures: ["Nadab", "Abihu", "Aaron", "Moses"],
    setting: "Tabernacle"
  },
  {
    id: "day-of-atonement",
    title: "Day of Atonement",
    reference: "Leviticus 16",
    volume: "Leviticus",
    category: "Sanctuary",
    summary: "The most solemn day of Israel's calendar. The high priest enters the Most Holy Place once a year with blood for his sins and the people's sins. Two goats are selected: one sacrificed as a sin offering, the other (scapegoat) bears confessed sins into the wilderness. Complete cleansing of the sanctuary.",
    keyElements: [
      "Once per year entry to Most Holy",
      "High priest's special garments",
      "Bull for priest's sin",
      "Two goats - Lord's lot and Azazel",
      "Blood on mercy seat",
      "Scapegoat sent to wilderness",
      "Complete cleansing of sanctuary",
      "Afflicting of souls"
    ],
    christPattern: [
      { element: "High priest enters", christApplication: "Christ entered heaven itself" },
      { element: "Blood on mercy seat", christApplication: "Christ's blood covers the law" },
      { element: "Lord's goat", christApplication: "Christ's death for sin" },
      { element: "Scapegoat", christApplication: "Satan bears guilt, removed" },
      { element: "Sanctuary cleansed", christApplication: "Heavenly sanctuary cleansed" }
    ],
    dimensions: {
      literal: "Annual ritual of cleansing",
      christ: "Christ's ministry in heavenly sanctuary",
      personal: "Judgment - are my sins covered?",
      church: "Time of investigative judgment",
      heavenFuture: "Final cleansing, Satan's doom",
      heavenPast: "Sin's record in heaven"
    },
    relatedStories: ["Hebrews 9:7-12", "Daniel 8:14 (Sanctuary cleansed)", "Revelation 20 (Satan bound)"],
    keyFigures: ["High Priest", "Israel"],
    setting: "Tabernacle - Most Holy Place"
  },
  {
    id: "clean-unclean",
    title: "Clean and Unclean Laws",
    reference: "Leviticus 11",
    volume: "Leviticus",
    category: "Laws",
    summary: "God distinguishes between clean and unclean animals. Clean land animals chew cud and have split hooves. Clean fish have fins and scales. Certain birds and insects are forbidden. These laws teach Israel to distinguish holy from common.",
    keyElements: [
      "Split hoof AND chews cud required",
      "Fins AND scales for fish",
      "Forbidden birds listed",
      "Swarming things unclean",
      "Teaching discernment",
      "Holiness in daily life"
    ],
    christPattern: [
      { element: "Chews cud", christApplication: "Meditating on God's Word" },
      { element: "Split hoof", christApplication: "Walking distinctly" },
      { element: "Clean vs unclean", christApplication: "Holy vs common distinction" }
    ],
    dimensions: {
      literal: "Dietary laws for Israel",
      christ: "Christ makes us clean",
      personal: "What do I 'consume' spiritually?",
      church: "Church discerns truth from error",
      heavenFuture: "Pure diet in new earth",
      heavenPast: "Original diet in Eden"
    },
    relatedStories: ["Acts 10 (Peter's vision)", "Mark 7:19", "Genesis 1:29 (Original diet)"],
    keyFigures: ["Moses", "Israel"],
    setting: "Sinai"
  }
];

// Volume: Numbers Stories
export const numbersStories: BiblicalStory[] = [
  {
    id: "twelve-spies",
    title: "Twelve Spies",
    reference: "Numbers 13-14",
    volume: "Numbers",
    category: "Wilderness",
    summary: "Moses sends twelve spies to explore Canaan for forty days. They return with giant grapes but ten give a fearful report: giants, fortified cities, 'we are grasshoppers.' Caleb and Joshua alone have faith. The people rebel, wanting to return to Egypt. God sentences them to forty years wandering - one year for each day.",
    keyElements: [
      "Twelve spies, one per tribe",
      "Forty days exploring",
      "Giant cluster of grapes",
      "Ten spies: evil report",
      "Caleb and Joshua: faith",
      "\"We are grasshoppers\"",
      "People want to stone them",
      "Forty years sentence",
      "Whole generation dies in wilderness"
    ],
    christPattern: [
      { element: "Caleb/Joshua's faith", christApplication: "Faith sees victory through God" },
      { element: "Giant grapes", christApplication: "Abundance of promised inheritance" },
      { element: "Forty years wandering", christApplication: "Consequences of unbelief" },
      { element: "New generation enters", christApplication: "Faith generation inherits" }
    ],
    dimensions: {
      literal: "Historical spying mission",
      christ: "Christ brings us into the inheritance",
      personal: "Do I see giants or God?",
      church: "Church must walk by faith",
      heavenFuture: "Canaan = heavenly inheritance",
      heavenPast: "Faith vs fear in cosmic conflict"
    },
    relatedStories: ["Hebrews 3-4 (Rest forfeited)", "1 Corinthians 10 (Examples for us)", "Joshua 14 (Caleb claims inheritance)"],
    keyFigures: ["Moses", "Caleb", "Joshua", "Ten spies"],
    setting: "Kadesh Barnea, Canaan"
  },
  {
    id: "korah-rebellion",
    title: "Korah's Rebellion",
    reference: "Numbers 16",
    volume: "Numbers",
    category: "Wilderness",
    summary: "Korah, Dathan, Abiram, and 250 leaders rebel against Moses and Aaron, claiming all Israel is holy and questioning their authority. Moses proposes a test with censers. The earth opens and swallows the rebels; fire consumes the 250. The next day, Israel blames Moses, and a plague kills 14,700 until Aaron makes atonement.",
    keyElements: [
      "Korah: Levite wanting priesthood",
      "Dathan/Abiram: Reubenites",
      "250 leaders with censers",
      "\"All congregation is holy\"",
      "Earth swallows rebels",
      "Fire consumes 250",
      "Plague stopped by Aaron",
      "14,700 die",
      "Aaron's rod buds"
    ],
    christPattern: [
      { element: "Rebellion against authority", christApplication: "Rebellion against Christ's leadership" },
      { element: "Earth swallows", christApplication: "Judgment on pride" },
      { element: "Aaron makes atonement", christApplication: "Christ intercedes" },
      { element: "Rod that buds", christApplication: "Christ's resurrection validates" }
    ],
    dimensions: {
      literal: "Historical rebellion and judgment",
      christ: "Christ alone is High Priest",
      personal: "Am I submitting to God's appointed authority?",
      church: "Respect for spiritual leadership",
      heavenFuture: "Rebellion finally ended",
      heavenPast: "Lucifer's original rebellion"
    },
    relatedStories: ["Jude 11 (Way of Korah)", "2 Peter 2:10 (Despising authority)", "Hebrews 5:4 (Called like Aaron)"],
    keyFigures: ["Korah", "Dathan", "Abiram", "Moses", "Aaron"],
    setting: "Wilderness"
  },
  {
    id: "bronze-serpent",
    title: "Bronze Serpent",
    reference: "Numbers 21:4-9",
    volume: "Numbers",
    category: "Wilderness",
    summary: "Israel complains against God and Moses about the manna. God sends fiery serpents; many die. The people confess sin and ask Moses to pray. God instructs Moses to make a bronze serpent and put it on a pole - whoever is bitten and looks at it lives.",
    keyElements: [
      "Complaining against God",
      "Fiery serpents sent",
      "Many die",
      "Confession of sin",
      "Bronze serpent on pole",
      "Look and live",
      "Faith demonstrated by looking"
    ],
    christPattern: [
      { element: "Bronze serpent lifted up", christApplication: "Christ lifted up on cross" },
      { element: "Look and live", christApplication: "Believe and live" },
      { element: "Serpent (sin symbol)", christApplication: "Christ made sin for us" },
      { element: "On a pole", christApplication: "Cross/tree" }
    ],
    dimensions: {
      literal: "Historical healing",
      christ: "Christ lifted up (John 3:14-15)",
      personal: "I must look to Christ for salvation",
      church: "Church lifts up Christ",
      heavenFuture: "Complete healing",
      heavenPast: "Sin's remedy planned"
    },
    relatedStories: ["John 3:14-15 (As Moses lifted up)", "2 Corinthians 5:21 (Made sin for us)", "Galatians 3:13 (Cursed on tree)"],
    keyFigures: ["Moses", "Israel"],
    setting: "Wilderness near Edom"
  },
  {
    id: "balaam",
    title: "Balaam and Balak",
    reference: "Numbers 22-24",
    volume: "Numbers",
    category: "Wilderness",
    summary: "King Balak of Moab hires prophet Balaam to curse Israel. God forbids it, but Balaam goes anyway for reward. His donkey sees the angel and stops; Balaam beats her until God opens her mouth. Balaam can only bless Israel four times, including the star prophecy of the Messiah.",
    keyElements: [
      "Balak fears Israel",
      "Hires Balaam to curse",
      "God says don't go",
      "Balaam goes for reward",
      "Donkey sees angel",
      "Donkey speaks",
      "Four oracles of blessing",
      "Star out of Jacob prophecy",
      "Balaam's counsel (chapter 25)"
    ],
    christPattern: [
      { element: "Cannot curse whom God blessed", christApplication: "No condemnation in Christ" },
      { element: "Star out of Jacob", christApplication: "Christ the Bright Morning Star" },
      { element: "Scepter from Israel", christApplication: "Christ the King" },
      { element: "Balaam's compromise", christApplication: "Warning against false teaching" }
    ],
    dimensions: {
      literal: "Historical account",
      christ: "Messianic prophecy fulfilled",
      personal: "Do I serve God or mammon?",
      church: "Beware of Balaam's error",
      heavenFuture: "Star of Christ shines forever",
      heavenPast: "God's protection of His people"
    },
    relatedStories: ["2 Peter 2:15 (Way of Balaam)", "Jude 11 (Error of Balaam)", "Revelation 2:14 (Doctrine of Balaam)", "Matthew 2:2 (Star of Bethlehem)"],
    keyFigures: ["Balaam", "Balak", "Angel", "Donkey"],
    setting: "Plains of Moab"
  }
];

// Volume: Deuteronomy Stories
export const deuteronomyStories: BiblicalStory[] = [
  {
    id: "moses-final-addresses",
    title: "Moses' Final Addresses",
    reference: "Deuteronomy 1-4",
    volume: "Deuteronomy",
    category: "Covenant",
    summary: "Moses recounts Israel's journey from Horeb, the spy incident, wilderness wanderings, and recent victories. He urges Israel to remember and obey, warning against idolatry and promising restoration if they return to God.",
    keyElements: [
      "Review of forty years",
      "New generation addressed",
      "Remember what God did",
      "Warning against idolatry",
      "Cities of refuge established",
      "Call to obedience"
    ],
    christPattern: [
      { element: "Moses recounts", christApplication: "Christ reminds us of His works" },
      { element: "Remember and obey", christApplication: "Lord's Supper - remembrance" },
      { element: "Restoration promised", christApplication: "Christ restores the repentant" }
    ],
    dimensions: {
      literal: "Moses' farewell speeches",
      christ: "Christ is the true prophet like Moses",
      personal: "I must remember God's faithfulness",
      church: "Church built on remembrance",
      heavenFuture: "Full restoration promised",
      heavenPast: "God's consistent character"
    },
    relatedStories: ["Acts 7 (Stephen recounts)", "Hebrews 3-4 (Warning to remember)"],
    keyFigures: ["Moses", "New generation Israel"],
    setting: "Plains of Moab"
  },
  {
    id: "shema",
    title: "The Shema",
    reference: "Deuteronomy 6:4-9",
    volume: "Deuteronomy",
    category: "Covenant",
    summary: "The central confession of Israel's faith: 'Hear, O Israel: The LORD our God is one LORD. And thou shalt love the LORD thy God with all thine heart, soul, and might.' Commands to teach diligently to children, bind on hands, place on doorposts.",
    keyElements: [
      "Hear, O Israel",
      "LORD is one",
      "Love with all heart, soul, might",
      "Teach children diligently",
      "Talk of them continually",
      "Bind on hand, frontlets",
      "Write on doorposts"
    ],
    christPattern: [
      { element: "Hear", christApplication: "Faith comes by hearing" },
      { element: "Love God wholly", christApplication: "Greatest commandment (Matt 22:37)" },
      { element: "Teach children", christApplication: "Discipleship mandate" }
    ],
    dimensions: {
      literal: "Daily confession of Israel",
      christ: "Christ fulfilled perfect love to Father",
      personal: "Is my love for God wholehearted?",
      church: "Church teaches the next generation",
      heavenFuture: "Perfect love realized",
      heavenPast: "Lucifer's love became self-love"
    },
    relatedStories: ["Matthew 22:37-38", "Mark 12:29-30", "John 14:15 (If you love Me, keep My commandments)"],
    keyFigures: ["Moses", "Israel"],
    setting: "Plains of Moab"
  },
  {
    id: "death-of-moses",
    title: "Death of Moses",
    reference: "Deuteronomy 34",
    volume: "Deuteronomy",
    category: "Transition",
    summary: "Moses views the Promised Land from Mount Nebo. He dies at 120 years, eyes undimmed, natural force unabated. God buries him; no one knows his grave. Israel mourns 30 days. Joshua takes leadership. There arose not a prophet like Moses who knew the LORD face to face.",
    keyElements: [
      "Mount Nebo/Pisgah view",
      "Sees all the land",
      "Dies at 120",
      "Eyes not dim, force not abated",
      "God buries him",
      "Grave unknown",
      "Thirty days mourning",
      "Joshua succeeds",
      "No prophet like Moses"
    ],
    christPattern: [
      { element: "Sees but doesn't enter", christApplication: "Law cannot bring us in" },
      { element: "Joshua leads in", christApplication: "Jesus brings us to the inheritance" },
      { element: "Face to face with God", christApplication: "Christ's intimate relationship" },
      { element: "Unknown grave", christApplication: "Resurrection (Jude 9)" }
    ],
    dimensions: {
      literal: "Historical death of Moses",
      christ: "Christ greater than Moses",
      personal: "I need Jesus, not just law",
      church: "Church follows Jesus, not Moses alone",
      heavenFuture: "Moses on Mount of Transfiguration",
      heavenPast: "Dispute over Moses' body (Jude 9)"
    },
    relatedStories: ["Jude 9 (Michael disputes for body)", "Matthew 17 (Transfiguration)", "Hebrews 3:1-6 (Christ greater than Moses)"],
    keyFigures: ["Moses", "Joshua", "God"],
    setting: "Mount Nebo, Moab"
  }
];

// Volume: Joshua Stories
export const joshuaStories: BiblicalStory[] = [
  {
    id: "crossing-jordan",
    title: "Crossing the Jordan",
    reference: "Joshua 3-4",
    volume: "Joshua",
    category: "Conquest",
    summary: "Israel crosses the Jordan at flood stage. Priests carrying the ark step into the water; it stops flowing, heaping up at Adam. The nation crosses on dry ground. Twelve stones taken from the riverbed as memorial; twelve stones placed in the river where priests stood.",
    keyElements: [
      "Jordan at flood stage",
      "Priests with ark lead",
      "Feet touch water, it stops",
      "Waters heap up at Adam",
      "Nation crosses dry",
      "Twelve stones memorial",
      "Twelve stones in river",
      "Circumcision at Gilgal"
    ],
    christPattern: [
      { element: "Ark leads the way", christApplication: "Christ goes before us" },
      { element: "Waters stopped at Adam", christApplication: "Christ stops curse from Adam" },
      { element: "Dry ground crossing", christApplication: "Safe passage through death" },
      { element: "Twelve stones", christApplication: "Twelve apostles as foundation" }
    ],
    dimensions: {
      literal: "Historical crossing",
      christ: "Christ brings us through death to life",
      personal: "I cross from old life to new",
      church: "Church crosses into inheritance",
      heavenFuture: "Final crossing to Promised Land",
      heavenPast: "Deliverance planned"
    },
    relatedStories: ["Exodus 14 (Red Sea)", "Romans 6 (Baptism)", "Joshua 5 (Circumcision renewed)"],
    keyFigures: ["Joshua", "Priests", "Israel"],
    setting: "Jordan River near Jericho"
  },
  {
    id: "jericho",
    title: "Fall of Jericho",
    reference: "Joshua 6",
    volume: "Joshua",
    category: "Conquest",
    summary: "Israel marches around Jericho once daily for six days. On the seventh day, they march seven times, priests blow trumpets, people shout, and the walls fall flat. City is devoted to destruction except Rahab and her family who are saved because of the scarlet cord.",
    keyElements: [
      "City shut up tight",
      "March once daily for six days",
      "Seventh day: seven circuits",
      "Seven priests, seven trumpets",
      "Long trumpet blast",
      "People shout",
      "Walls fall flat",
      "Rahab saved by scarlet cord",
      "City burned, treasures to LORD"
    ],
    christPattern: [
      { element: "Walls fall by faith", christApplication: "Victory through faith, not strength" },
      { element: "Seventh day completion", christApplication: "Christ completes the work" },
      { element: "Scarlet cord saves", christApplication: "Blood of Christ saves" },
      { element: "Rahab (Gentile) saved", christApplication: "Gospel to Gentiles" }
    ],
    dimensions: {
      literal: "Historical conquest",
      christ: "Christ defeats the enemy",
      personal: "My walls of sin must fall",
      church: "Church advances by faith",
      heavenFuture: "Babylon falls at seventh trumpet",
      heavenPast: "Satan's strongholds"
    },
    relatedStories: ["Hebrews 11:30-31 (By faith walls fell, Rahab)", "James 2:25 (Rahab justified)", "Revelation 11:15 (Seventh trumpet)"],
    keyFigures: ["Joshua", "Priests", "Rahab", "Israel"],
    setting: "Jericho"
  },
  {
    id: "achan-sin",
    title: "Achan's Sin",
    reference: "Joshua 7",
    volume: "Joshua",
    category: "Conquest",
    summary: "Israel attacks Ai but is defeated, 36 men die. Joshua mourns; God reveals someone took devoted things. By lot, Achan is identified. He confesses taking a Babylonian garment, silver, and gold, hiding them in his tent. Achan and his family are stoned and burned in the Valley of Achor (trouble).",
    keyElements: [
      "Defeat at Ai",
      "Joshua tears clothes, prays",
      "\"Israel has sinned\"",
      "Casting lots narrows down",
      "Achan confesses",
      "Babylonian garment, silver, gold",
      "Hidden in tent",
      "Valley of Achor (trouble)",
      "Stoned and burned"
    ],
    christPattern: [
      { element: "One person's sin affects all", christApplication: "Adam's sin affected all; corporate solidarity" },
      { element: "Hidden sin revealed", christApplication: "All will come to light" },
      { element: "Babylonian garment", christApplication: "Worldly attractions" },
      { element: "Achor becomes door of hope (Hosea 2:15)", christApplication: "Christ turns trouble to hope" }
    ],
    dimensions: {
      literal: "Historical judgment",
      christ: "Christ removes hidden sin",
      personal: "Is there hidden sin in my life?",
      church: "Sin affects the whole body",
      heavenFuture: "All hidden things revealed",
      heavenPast: "Sin's consequences"
    },
    relatedStories: ["Hosea 2:15 (Valley of Achor)", "1 Corinthians 5 (Leaven)", "Acts 5 (Ananias and Sapphira)"],
    keyFigures: ["Joshua", "Achan"],
    setting: "Ai, Valley of Achor"
  },
  {
    id: "gibeonite-deception",
    title: "Gibeonite Deception",
    reference: "Joshua 9",
    volume: "Joshua",
    category: "Conquest",
    summary: "Gibeonites fear Israel and devise a ruse. They wear old clothes, carry moldy bread, and claim to be from a far country seeking a treaty. Joshua and the leaders make peace without seeking the LORD. When the deception is discovered, the oath stands but Gibeonites become servants (woodcutters, water carriers).",
    keyElements: [
      "Gibeonites fear Israel",
      "Old clothes, moldy bread",
      "Claim distant origin",
      "Leaders don't ask LORD",
      "Covenant of peace made",
      "Deception discovered",
      "Oath must be kept",
      "Gibeonites become servants"
    ],
    christPattern: [
      { element: "Failed to seek LORD", christApplication: "Need to pray in all decisions" },
      { element: "Deceptive appearance", christApplication: "Satan disguises" },
      { element: "Oath honored", christApplication: "God keeps His word" }
    ],
    dimensions: {
      literal: "Historical treaty",
      christ: "Christ never deceived, always truthful",
      personal: "Am I seeking God's guidance?",
      church: "Church must discern deception",
      heavenFuture: "All deception ended",
      heavenPast: "Satan the deceiver"
    },
    relatedStories: ["2 Samuel 21 (Saul breaks treaty)", "Proverbs 3:5-6 (Trust in the LORD)"],
    keyFigures: ["Joshua", "Gibeonites", "Israel's leaders"],
    setting: "Gilgal"
  },
  {
    id: "sun-stands-still",
    title: "Sun Stands Still",
    reference: "Joshua 10:1-15",
    volume: "Joshua",
    category: "Conquest",
    summary: "Five Amorite kings attack Gibeon for making peace with Israel. Joshua marches all night from Gilgal. God throws the enemy into confusion and casts great hailstones. Joshua commands the sun and moon to stand still; they do for about a whole day until Israel avenges their enemies. There was no day like it.",
    keyElements: [
      "Five kings attack Gibeon",
      "All-night march",
      "LORD fights for Israel",
      "Great hailstones kill more than sword",
      "\"Sun, stand still\"",
      "Sun and moon stop",
      "About a whole day",
      "No day like it before or since"
    ],
    christPattern: [
      { element: "LORD fights for Israel", christApplication: "Christ fights our battles" },
      { element: "Sun obeys", christApplication: "Nature obeys Christ" },
      { element: "Complete victory", christApplication: "Christ's total triumph" }
    ],
    dimensions: {
      literal: "Historical miracle",
      christ: "Creator controls creation",
      personal: "God can do the impossible for me",
      church: "Church's battles are the LORD's",
      heavenFuture: "Final cosmic signs",
      heavenPast: "God's power over nature"
    },
    relatedStories: ["Habakkuk 3:11 (Sun and moon stood still)", "Isaiah 38:8 (Sun goes backward for Hezekiah)"],
    keyFigures: ["Joshua", "Five Amorite kings"],
    setting: "Gibeon, Aijalon Valley"
  }
];

// Volume: Judges Stories
export const judgesStories: BiblicalStory[] = [
  {
    id: "deborah-barak",
    title: "Deborah and Barak",
    reference: "Judges 4-5",
    volume: "Judges",
    category: "Judges",
    summary: "Israel is oppressed by Jabin and his commander Sisera with 900 iron chariots. Prophetess Deborah judges Israel and calls Barak to lead 10,000 men. Barak will only go if Deborah goes. The LORD routes Sisera's army; Sisera flees on foot. Jael invites him into her tent, gives him milk, and kills him with a tent peg through his temple.",
    keyElements: [
      "Twenty years oppression",
      "900 iron chariots",
      "Deborah the prophetess",
      "Barak called to lead",
      "\"I will not go unless you go\"",
      "Honor to a woman",
      "Stars fight from heaven",
      "Kishon River sweeps away",
      "Jael and tent peg",
      "Song of Deborah"
    ],
    christPattern: [
      { element: "Deborah leads", christApplication: "God uses the humble" },
      { element: "Stars fight", christApplication: "Heavenly hosts fight for God's people" },
      { element: "Enemy's head crushed", christApplication: "Christ crushes serpent's head" }
    ],
    dimensions: {
      literal: "Historical deliverance",
      christ: "Christ defeats the enemy through unexpected means",
      personal: "God can use me despite my fears",
      church: "Church needs prophetic leadership",
      heavenFuture: "Final defeat of oppressors",
      heavenPast: "Cosmic warfare"
    },
    relatedStories: ["Hebrews 11:32 (Barak)", "Genesis 3:15 (Head crushed)"],
    keyFigures: ["Deborah", "Barak", "Sisera", "Jael", "Jabin"],
    setting: "Kedesh, Mount Tabor, Kishon River"
  },
  {
    id: "gideon",
    title: "Gideon's Victory",
    reference: "Judges 6-7",
    volume: "Judges",
    category: "Judges",
    summary: "Midianites oppress Israel. Angel calls Gideon, 'mighty man of valor,' while he threshes wheat in a winepress hiding from enemies. Gideon asks for signs (fleece wet/dry). God reduces his army from 32,000 to 300 by water-drinking test. With torches in pitchers and trumpets, they create confusion and the Midianites destroy each other.",
    keyElements: [
      "Midianite oppression",
      "Angel appears",
      "\"Mighty man of valor\"",
      "\"I am the least\"",
      "Fleece tests (twice)",
      "Army reduced from 32,000 to 300",
      "Lapping water test",
      "Torches, pitchers, trumpets",
      "\"Sword of the LORD and Gideon\"",
      "Enemy destroys itself"
    ],
    christPattern: [
      { element: "Called while hiding", christApplication: "Christ calls the unlikely" },
      { element: "300 chosen", christApplication: "Few are chosen" },
      { element: "Light breaks forth", christApplication: "Christ the Light revealed" },
      { element: "Enemy self-destructs", christApplication: "Sin destroys itself" }
    ],
    dimensions: {
      literal: "Historical deliverance",
      christ: "Victory through weakness",
      personal: "God uses the small and weak",
      church: "Church's strength in God alone",
      heavenFuture: "Evil self-destructs",
      heavenPast: "God's strategy against evil"
    },
    relatedStories: ["Hebrews 11:32", "1 Corinthians 1:27 (Weak things)", "2 Corinthians 4:7 (Treasure in earthen vessels)"],
    keyFigures: ["Gideon", "Angel of the LORD", "300 men"],
    setting: "Ophrah, Hill of Moreh"
  },
  {
    id: "samson",
    title: "Samson",
    reference: "Judges 13-16",
    volume: "Judges",
    category: "Judges",
    summary: "Samson, a Nazirite from birth, has supernatural strength from the Spirit. He kills a lion, defeats Philistines, but is drawn to foreign women. Delilah persistently asks his secret; he reveals his uncut hair. Shaved and weakened, he's captured, blinded, enslaved. At a Dagon celebration, his hair regrown, he pushes down the pillars, killing more in death than in life.",
    keyElements: [
      "Nazirite from birth",
      "Spirit empowers",
      "Lion killed",
      "Riddles and foxes",
      "Jawbone of donkey: 1,000 slain",
      "Weakness: foreign women",
      "Delilah's persistence",
      "Secret of strength in hair",
      "Shaved, captured, blinded",
      "Hair regrows",
      "\"Let me die with the Philistines\"",
      "More killed in death than life"
    ],
    christPattern: [
      { element: "Miraculous birth announcement", christApplication: "Christ's birth announced" },
      { element: "Spirit-empowered", christApplication: "Christ filled with Spirit" },
      { element: "Kills lion", christApplication: "Christ defeats Satan" },
      { element: "Betrayed for silver", christApplication: "Christ betrayed" },
      { element: "More victory in death", christApplication: "Cross brings greatest victory" }
    ],
    dimensions: {
      literal: "Historical judge of Israel",
      christ: "Christ's victory through death",
      personal: "Beware of compromise",
      church: "Strength in consecration",
      heavenFuture: "Final victory over enemies",
      heavenPast: "Cosmic battle"
    },
    relatedStories: ["Hebrews 11:32", "John 12:24 (Grain must die)", "Colossians 2:15 (Triumph at cross)"],
    keyFigures: ["Samson", "Delilah", "Manoah", "Philistines"],
    setting: "Dan, Philistia"
  }
];

// Volume: Ruth Stories
export const ruthStories: BiblicalStory[] = [
  {
    id: "ruth-naomi",
    title: "Ruth and Naomi",
    reference: "Ruth 1-4",
    volume: "Ruth",
    category: "Kinsman Redeemer",
    summary: "During the judges, famine drives Elimelech's family to Moab. He dies; sons marry Moabite women; sons die. Naomi returns to Bethlehem bitter. Ruth refuses to leave her, making her famous declaration. Ruth gleans in Boaz's field (a relative). He shows kindness. At the threshing floor, Ruth asks him to spread his garment over her. Boaz redeems her at the gate, marries her. Their son Obed is grandfather of David.",
    keyElements: [
      "Famine in Bethlehem (house of bread)",
      "Family goes to Moab",
      "Deaths leave three widows",
      "\"Where you go, I will go\"",
      "Ruth's loyalty",
      "Gleaning in Boaz's field",
      "\"Under whose wings you have come\"",
      "Threshing floor scene",
      "Nearer kinsman refuses",
      "Boaz redeems at gate",
      "Obed born - grandfather of David",
      "Ruth in Christ's genealogy"
    ],
    christPattern: [
      { element: "Kinsman redeemer", christApplication: "Christ our Redeemer" },
      { element: "Boaz pays the price", christApplication: "Christ paid redemption price" },
      { element: "Gentile bride", christApplication: "Church (Gentiles) bride of Christ" },
      { element: "Wings of covering", christApplication: "Christ's protection" },
      { element: "Redeemed at gate", christApplication: "Public redemption" }
    ],
    dimensions: {
      literal: "Historical romance and redemption",
      christ: "Christ the Kinsman Redeemer",
      personal: "I have a Redeemer",
      church: "Church is Christ's bride",
      heavenFuture: "Marriage supper of the Lamb",
      heavenPast: "Redemption planned"
    },
    relatedStories: ["Leviticus 25 (Kinsman redeemer law)", "Matthew 1:5 (Ruth in genealogy)", "Ephesians 5:25-32 (Christ and church)"],
    keyFigures: ["Ruth", "Naomi", "Boaz", "Elimelech", "Orpah"],
    setting: "Moab, Bethlehem"
  }
];

// Volume: 1 Samuel Stories
export const samuel1Stories: BiblicalStory[] = [
  {
    id: "hannah-samuel",
    title: "Hannah and Samuel",
    reference: "1 Samuel 1-2",
    volume: "1 Samuel",
    category: "Transition",
    summary: "Hannah, barren and mocked by Peninnah, weeps and prays at Shiloh, vowing to give a son to the LORD. Eli thinks she's drunk but blesses her. She conceives, names him Samuel ('asked of God'), and after weaning dedicates him to tabernacle service. Hannah's song praises God who reverses fortunes. Samuel grows in the LORD's presence.",
    keyElements: [
      "Hannah's barrenness and grief",
      "Peninnah's provocation",
      "Prayer at Shiloh",
      "Vow to give son to LORD",
      "Eli's misunderstanding",
      "Samuel born - \"asked of God\"",
      "Dedicated to tabernacle",
      "Hannah's song of praise",
      "Annual coat for Samuel",
      "Samuel grows before the LORD"
    ],
    christPattern: [
      { element: "Barren becomes fruitful", christApplication: "Grace to the unworthy" },
      { element: "Dedicated to God", christApplication: "Christ wholly devoted" },
      { element: "Hannah's song", christApplication: "Mary's Magnificat echoes" },
      { element: "Samuel (prophet, priest, judge)", christApplication: "Christ all three" }
    ],
    dimensions: {
      literal: "Historical account",
      christ: "Christ given by God",
      personal: "Giving my best to God",
      church: "Church born in prayer",
      heavenFuture: "All tears turned to joy",
      heavenPast: "God hears prayer"
    },
    relatedStories: ["Luke 1:46-55 (Mary's song)", "Genesis 30 (Rachel's barrenness)"],
    keyFigures: ["Hannah", "Samuel", "Eli", "Elkanah", "Peninnah"],
    setting: "Shiloh, tabernacle"
  },
  {
    id: "david-goliath",
    title: "David and Goliath",
    reference: "1 Samuel 17",
    volume: "1 Samuel",
    category: "David's Rise",
    summary: "Philistine champion Goliath (9+ feet tall) challenges Israel for 40 days. Young David, bringing provisions to brothers, hears and is outraged. Refusing Saul's armor, he takes five smooth stones. Declaring he comes in the name of the LORD, David slings one stone into Goliath's forehead. The giant falls; David cuts off his head with Goliath's own sword.",
    keyElements: [
      "Goliath: 6 cubits and a span",
      "40 days of challenge",
      "Israel paralyzed with fear",
      "David arrives with provisions",
      "\"Is there not a cause?\"",
      "Saul's armor doesn't fit",
      "Five smooth stones",
      "Staff, sling, and stones",
      "\"I come in the name of the LORD\"",
      "Stone sinks into forehead",
      "Goliath falls facedown",
      "Beheaded with own sword"
    ],
    christPattern: [
      { element: "Shepherd faces giant", christApplication: "Christ faces Satan" },
      { element: "Coming in LORD's name", christApplication: "Christ came in Father's name" },
      { element: "Victory with simple weapon", christApplication: "Cross seemed foolish" },
      { element: "Enemy defeated with own weapon", christApplication: "Death defeated by death" },
      { element: "Israel freed", christApplication: "Humanity freed" }
    ],
    dimensions: {
      literal: "Historical battle",
      christ: "Christ our Champion",
      personal: "My giants can be defeated",
      church: "Church's enemies defeated",
      heavenFuture: "Final defeat of Satan",
      heavenPast: "Cosmic champion emerges"
    },
    relatedStories: ["Hebrews 2:14 (Destroy him who had power of death)", "Colossians 2:15 (Triumphed over them)"],
    keyFigures: ["David", "Goliath", "Saul", "Jesse"],
    setting: "Valley of Elah"
  }
];

// Volume: Daniel Stories
export const danielStories: BiblicalStory[] = [
  {
    id: "daniel-captivity",
    title: "Daniel Refuses King's Food",
    reference: "Daniel 1",
    volume: "Daniel",
    category: "Captivity",
    summary: "Daniel and friends are taken captive to Babylon, selected for royal training. Daniel purposes not to defile himself with the king's food and wine. He requests vegetables and water for ten days. God gives them knowledge, wisdom, and understanding ten times better than all others. Daniel continues until Cyrus' reign.",
    keyElements: [
      "Captives from Judah",
      "Royal selection and training",
      "Names changed to Babylonian",
      "Daniel purposes in heart",
      "Request for vegetables",
      "Ten-day test",
      "Fairer and fatter",
      "Wisdom ten times better",
      "Serve in king's presence"
    ],
    christPattern: [
      { element: "Purpose in heart", christApplication: "Christ's resolve" },
      { element: "Refused defilement", christApplication: "Christ tempted but didn't sin" },
      { element: "Wisdom given", christApplication: "Christ, wisdom of God" },
      { element: "Ten times better", christApplication: "God's way excels" }
    ],
    dimensions: {
      literal: "Historical faithfulness",
      christ: "Christ refused Satan's temptations",
      personal: "What am I consuming?",
      church: "Church must not compromise",
      heavenFuture: "Faithful rewarded",
      heavenPast: "Faithful stand in test"
    },
    relatedStories: ["Matthew 4 (Christ's temptation)", "1 Corinthians 10:31 (Glorify God in eating)"],
    keyFigures: ["Daniel", "Hananiah", "Mishael", "Azariah", "Nebuchadnezzar"],
    setting: "Babylon"
  },
  {
    id: "fiery-furnace",
    title: "Fiery Furnace",
    reference: "Daniel 3",
    volume: "Daniel",
    category: "Faithfulness",
    summary: "Nebuchadnezzar erects a 90-foot golden image; all must bow at the music. Shadrach, Meshach, and Abednego refuse. The king gives them one more chance; they reply, 'Our God can deliver, but even if not, we will not serve your gods.' Thrown into furnace heated seven times hotter, a fourth figure appears 'like the Son of God.' They emerge unharmed, not even smelling of smoke.",
    keyElements: [
      "Golden image: 60 x 6 cubits",
      "Music signals worship",
      "Three Hebrews refuse",
      "\"Our God is able to deliver\"",
      "\"But if not, we will not bow\"",
      "Furnace seven times hotter",
      "Soldiers die from heat",
      "Fourth figure like Son of God",
      "Called out unharmed",
      "No smell of fire",
      "King promotes them"
    ],
    christPattern: [
      { element: "Fourth in the fire", christApplication: "Christ with us in trials" },
      { element: "Refused to bow", christApplication: "Worship God alone" },
      { element: "Unharmed by fire", christApplication: "Resurrection power" },
      { element: "Seven times hotter", christApplication: "Intense persecution" }
    ],
    dimensions: {
      literal: "Historical deliverance",
      christ: "Christ present in persecution",
      personal: "Will I bow to pressure?",
      church: "Church faces image of beast",
      heavenFuture: "End-time image test (Rev 13)",
      heavenPast: "Loyalty tested"
    },
    relatedStories: ["Revelation 13 (Image of beast)", "Isaiah 43:2 (Through fire)", "Hebrews 11:34 (Quenched fire)"],
    keyFigures: ["Shadrach", "Meshach", "Abednego", "Nebuchadnezzar", "Son of God"],
    setting: "Plain of Dura, Babylon"
  },
  {
    id: "lions-den",
    title: "Daniel in the Lions' Den",
    reference: "Daniel 6",
    volume: "Daniel",
    category: "Faithfulness",
    summary: "Under Darius, Daniel excels and is targeted by jealous officials. They trick Darius into decreeing that all must pray only to him for 30 days. Daniel continues praying three times daily toward Jerusalem. Caught and thrown to lions, an angel shuts their mouths. In the morning, Daniel is lifted out unharmed. His accusers are thrown in and immediately devoured.",
    keyElements: [
      "Excellent spirit in Daniel",
      "Officials' jealousy",
      "Trap involving prayer",
      "Decree signed (Medo-Persian law unchangeable)",
      "Daniel prays as usual",
      "Three times daily toward Jerusalem",
      "Windows open",
      "King distressed",
      "\"May your God deliver\"",
      "Angel shuts lions' mouths",
      "No harm found",
      "Accusers devoured"
    ],
    christPattern: [
      { element: "Falsely accused", christApplication: "Christ falsely accused" },
      { element: "Stone sealed", christApplication: "Tomb sealed" },
      { element: "Delivered at dawn", christApplication: "Resurrection morning" },
      { element: "Accusers destroyed", christApplication: "Satan defeated" }
    ],
    dimensions: {
      literal: "Historical deliverance",
      christ: "Christ delivered from death",
      personal: "My prayer life under attack?",
      church: "Prayer persecuted",
      heavenFuture: "Final accusers destroyed",
      heavenPast: "Accuser of brethren"
    },
    relatedStories: ["Hebrews 11:33 (Stopped mouths of lions)", "1 Peter 5:8 (Devil as lion)", "Revelation 12:10 (Accuser cast down)"],
    keyFigures: ["Daniel", "Darius", "Accusers", "Angel"],
    setting: "Babylon/Persia"
  }
];

// Volume: Jonah Stories
export const jonahStories: BiblicalStory[] = [
  {
    id: "jonah",
    title: "Jonah and the Great Fish",
    reference: "Jonah 1-4",
    volume: "Jonah",
    category: "Prophets",
    summary: "God calls Jonah to preach to Nineveh; he flees to Tarshish. A great storm arises; Jonah confesses and is thrown overboard; a great fish swallows him. After three days, he's vomited onto land. Jonah preaches; Nineveh repents. Jonah is angry; God teaches him through a vine and worm about compassion.",
    keyElements: [
      "Called to Nineveh",
      "Flees to Tarshish",
      "Great storm",
      "Lots fall on Jonah",
      "Thrown overboard",
      "Great fish prepared",
      "Three days and nights",
      "Prayer from fish's belly",
      "Vomited onto land",
      "Nineveh repents",
      "Jonah's anger",
      "Vine, worm, and east wind"
    ],
    christPattern: [
      { element: "Three days in fish", christApplication: "Christ three days in tomb (Matt 12:40)" },
      { element: "Death brings calm", christApplication: "Christ's death brings peace" },
      { element: "Preaches to Gentiles", christApplication: "Gospel to nations" },
      { element: "Reluctant prophet", christApplication: "Christ willing and eager" }
    ],
    dimensions: {
      literal: "Historical prophetic account",
      christ: "Sign of Jonah = Christ's resurrection",
      personal: "Am I running from God's call?",
      church: "Church called to mission",
      heavenFuture: "All nations will hear",
      heavenPast: "God's heart for the lost"
    },
    relatedStories: ["Matthew 12:39-40 (Sign of Jonah)", "Luke 11:29-32", "Nahum (Nineveh's later destruction)"],
    keyFigures: ["Jonah", "Sailors", "Ninevites", "Fish"],
    setting: "Joppa, Sea, Nineveh"
  }
];
