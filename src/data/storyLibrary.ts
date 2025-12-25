// Biblical Story Room Library - Encyclopedia of Narratives
// Based on Phototheology Story Room methodology

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

// Volume I: Genesis Stories
export const genesisStories: BiblicalStory[] = [
  {
    id: "creation",
    title: "Creation",
    reference: "Genesis 1-2",
    volume: "Genesis",
    category: "Beginnings",
    summary: "God creates the heavens and earth in six literal days, resting on the seventh. Each day builds upon the previous: light, firmament, dry land and vegetation, celestial bodies, sea creatures and birds, land animals and humanity. Adam is formed from dust, given the breath of life, placed in Eden to tend the garden, and given Eve as his companion, formed from his side.",
    keyElements: [
      "Six days of work, seventh day rest",
      "Light created before sun",
      "Man created in God's image",
      "Dominion given over creation",
      "Eve from Adam's side",
      "Tree of Life and Tree of Knowledge",
      "Marriage instituted",
      "Garden of Eden with four rivers"
    ],
    christPattern: [
      { element: "\"Let there be light\"", christApplication: "Christ, the Light of the World" },
      { element: "Adam (Son of God)", christApplication: "Christ, the Second Adam" },
      { element: "Adam sleeps, side opened", christApplication: "Christ sleeps in death, side pierced" },
      { element: "Eve from Adam's side", christApplication: "Church born from Christ's side" },
      { element: "Breath of life", christApplication: "Holy Spirit gives new life" },
      { element: "Dominion over beasts", christApplication: "Christ has dominion over all" },
      { element: "Seventh day rest", christApplication: "Rest in Christ's finished work" },
      { element: "Tree of Life", christApplication: "Christ is the Tree of Life" }
    ],
    dimensions: {
      literal: "Historical creation account",
      christ: "Christ as Creator and pattern for new creation",
      personal: "I am a new creation in Christ",
      church: "The church is being created/built",
      heavenFuture: "New heavens and new earth",
      heavenPast: "Original creation before sin"
    },
    relatedStories: [
      "John 1:1-14 (In the beginning was the Word)",
      "Colossians 1:15-17 (By Him all things created)",
      "Revelation 21-22 (New creation)"
    ],
    keyFigures: ["God", "Adam", "Eve"],
    setting: "Garden of Eden"
  },
  {
    id: "the-fall",
    title: "The Fall",
    reference: "Genesis 3",
    volume: "Genesis",
    category: "Beginnings",
    summary: "The serpent deceives Eve at the Tree of Knowledge. She eats the forbidden fruit and gives to Adam who also eats. Their eyes are opened to their nakedness; they hide from God. God confronts them, pronounces curses on the serpent, the woman, and the ground, but also gives the first gospel promise. God provides animal skin coverings and expels them from Eden, placing cherubim to guard the way to the Tree of Life.",
    keyElements: [
      "Serpent's deception: \"You shall be as gods\"",
      "Woman saw the tree was good for food, pleasant, desired to make wise",
      "Adam with her, both ate",
      "Eyes opened, knew nakedness",
      "Fig leaf coverings (self-righteousness)",
      "God calls \"Where are you?\"",
      "Blame shifting: Adam blames Eve, Eve blames serpent",
      "Protoevangelium (Genesis 3:15): Seed of woman crushes serpent's head",
      "Animal skins provided (first sacrifice)",
      "Cherubim guard Tree of Life"
    ],
    christPattern: [
      { element: "Serpent's deception", christApplication: "Satan still deceives" },
      { element: "\"You shall be as gods\"", christApplication: "Counterfeit exaltation" },
      { element: "Fig leaves", christApplication: "Self-righteousness fails" },
      { element: "God seeks the fallen", christApplication: "Christ seeks the lost" },
      { element: "Animal skins", christApplication: "Blood sacrifice required" },
      { element: "Seed of woman", christApplication: "Virgin-born Christ" },
      { element: "Bruised heel", christApplication: "Christ's suffering" },
      { element: "Crushed head", christApplication: "Satan's defeat" },
      { element: "Cherubim with sword", christApplication: "Access restored through Christ" }
    ],
    dimensions: {
      literal: "Historical fall of humanity",
      christ: "Christ comes to undo the fall",
      personal: "My fall into sin, my need for covering",
      church: "The church experiences temptation and needs restoration",
      heavenFuture: "Sin finally destroyed",
      heavenPast: "Lucifer's original fall, the beginning of sin"
    },
    relatedStories: [
      "Isaiah 14:12-15 (Lucifer's fall)",
      "Ezekiel 28:12-19 (Satan's original state)",
      "Romans 5:12-21 (Adam and Christ compared)",
      "Revelation 12 (War with the serpent)"
    ],
    keyFigures: ["Adam", "Eve", "Serpent (Satan)"],
    setting: "Garden of Eden"
  },
  {
    id: "cain-and-abel",
    title: "Cain and Abel",
    reference: "Genesis 4:1-16",
    volume: "Genesis",
    category: "Beginnings",
    summary: "Adam and Eve's first sons bring offerings to God. Abel brings the firstborn of his flock; Cain brings fruit of the ground. God accepts Abel's offering but rejects Cain's. Cain becomes angry; God warns him about sin crouching at the door. Cain murders Abel in the field. God confronts Cain, who denies responsibility. Abel's blood cries from the ground. Cain is cursed to wander, marked for protection.",
    keyElements: [
      "Two brothers, two offerings",
      "Abel: shepherd, blood sacrifice",
      "Cain: farmer, fruit of ground",
      "God \"had respect\" to Abel's offering",
      "Cain's countenance fell",
      "\"Sin lies at the door\"",
      "Premeditated murder in the field",
      "\"Am I my brother's keeper?\"",
      "Blood cries from ground",
      "Cain marked and protected",
      "City of Enoch built"
    ],
    christPattern: [
      { element: "Abel the shepherd", christApplication: "Christ the Good Shepherd" },
      { element: "Firstborn of flock", christApplication: "Christ the Firstborn" },
      { element: "Blood sacrifice accepted", christApplication: "Christ's blood accepted" },
      { element: "Rejected brother", christApplication: "Christ rejected by His own" },
      { element: "Murdered in the field", christApplication: "Christ murdered outside the city" },
      { element: "Blood cries out", christApplication: "Christ's blood speaks better things (Heb 12:24)" },
      { element: "Innocent slain", christApplication: "Innocent Christ slain" }
    ],
    dimensions: {
      literal: "First murder, first martyrdom",
      christ: "Christ as the true sacrifice, murdered by His brothers",
      personal: "Am I approaching God His way or my way?",
      church: "True vs. false worship in the church",
      heavenFuture: "Blood of martyrs avenged",
      heavenPast: "Division among beings—those who follow God's way vs. their own"
    },
    relatedStories: [
      "Hebrews 11:4 (By faith Abel offered)",
      "Hebrews 12:24 (Blood speaks better things)",
      "1 John 3:12 (Cain was of the wicked one)",
      "Matthew 23:35 (Blood of righteous Abel)"
    ],
    keyFigures: ["Cain", "Abel", "Adam", "Eve"],
    setting: "East of Eden"
  },
  {
    id: "enoch",
    title: "Enoch Translated",
    reference: "Genesis 5:21-24",
    volume: "Genesis",
    category: "Beginnings",
    summary: "Enoch, seventh from Adam, walked with God for 300 years after the birth of Methuselah. At 365 years old, \"he was not, for God took him.\" He was translated without seeing death.",
    keyElements: [
      "Seventh from Adam (completeness)",
      "\"Walked with God\" (twice stated)",
      "365 years (complete year cycle)",
      "\"God took him\"",
      "Did not see death",
      "Father of Methuselah (\"when he dies, it shall come\")"
    ],
    christPattern: [
      { element: "Walked with God", christApplication: "Intimate relationship with Father" },
      { element: "Translated", christApplication: "Christ ascended" },
      { element: "Did not see death", christApplication: "Victory over death" },
      { element: "Seventh from Adam", christApplication: "Divine perfection" }
    ],
    dimensions: {
      literal: "Historical translation",
      christ: "Christ's ascension",
      personal: "Walking with God daily, hope of translation",
      church: "Living saints translated at Second Coming",
      heavenFuture: "144,000 translated without death",
      heavenPast: "Those who remained faithful to God"
    },
    relatedStories: [
      "Hebrews 11:5 (By faith Enoch was translated)",
      "Jude 14-15 (Enoch's prophecy)",
      "2 Kings 2 (Elijah translated)",
      "1 Thessalonians 4:17 (Caught up to meet the Lord)"
    ],
    keyFigures: ["Enoch", "Methuselah"],
    setting: "Antediluvian world"
  },
  {
    id: "noah-flood",
    title: "Noah and the Flood",
    reference: "Genesis 6-9",
    volume: "Genesis",
    category: "Beginnings",
    summary: "Earth becomes corrupt and violent; God determines to destroy all flesh. Noah, a righteous man, finds grace. God instructs him to build an ark of specific dimensions. Noah preaches for 120 years while building. Animals come two by two (seven of clean animals). The family of eight enters the ark; God shuts the door. Rain falls 40 days; waters prevail 150 days. The ark rests on Ararat. Noah sends raven, then dove. After one year, they exit. Noah builds altar, offers sacrifice. God makes rainbow covenant: never again a flood to destroy all flesh.",
    keyElements: [
      "Earth filled with violence",
      "120 years of preaching",
      "Ark: 300 x 50 x 30 cubits",
      "One door, one window",
      "Animals by twos and sevens",
      "Eight souls saved",
      "God shuts the door",
      "40 days rain",
      "150 days waters prevail",
      "Raven and dove sent",
      "Olive leaf",
      "Altar and sacrifice",
      "Rainbow covenant",
      "Noah's vineyard and nakedness",
      "Shem and Japheth cover; Ham dishonors"
    ],
    christPattern: [
      { element: "Noah = \"rest\"", christApplication: "Christ gives rest" },
      { element: "Found grace", christApplication: "Salvation by grace" },
      { element: "Preacher of righteousness", christApplication: "Christ preached" },
      { element: "Ark of safety", christApplication: "Christ is our ark" },
      { element: "One door", christApplication: "Christ is the door" },
      { element: "God shuts the door", christApplication: "Close of probation" },
      { element: "Eight saved through water", christApplication: "Baptism saves (1 Pet 3:20-21)" },
      { element: "Raven (unclean)", christApplication: "Goes to and fro" },
      { element: "Dove (Holy Spirit)", christApplication: "Returns, brings peace" },
      { element: "Olive branch", christApplication: "Peace, Spirit" },
      { element: "Rainbow", christApplication: "Covenant, mercy" },
      { element: "Altar sacrifice", christApplication: "Christ's sacrifice" }
    ],
    dimensions: {
      literal: "Historical flood and deliverance",
      christ: "Christ as the Ark, saves through judgment",
      personal: "I must enter the Ark; old life destroyed, new life begins",
      church: "The church is the ark inviting people in",
      heavenFuture: "Second Coming—saved through destruction",
      heavenPast: "God's judgment on rebellion"
    },
    relatedStories: [
      "Matthew 24:37-39 (As in the days of Noah)",
      "1 Peter 3:18-22 (Baptism prefigured)",
      "2 Peter 2:5 (Preacher of righteousness)",
      "Hebrews 11:7 (By faith Noah)"
    ],
    keyFigures: ["Noah", "Shem", "Ham", "Japheth", "Noah's wife"],
    setting: "Antediluvian world, Mount Ararat"
  },
  {
    id: "tower-of-babel",
    title: "Tower of Babel",
    reference: "Genesis 11:1-9",
    volume: "Genesis",
    category: "Beginnings",
    summary: "Post-flood humanity speaks one language. They settle in Shinar, decide to build a city and tower reaching to heaven to make a name for themselves and avoid being scattered. God comes down to see, confuses their language, and scatters them over the earth. The place is called Babel (confusion).",
    keyElements: [
      "One language, one speech",
      "Journey eastward to Shinar",
      "Brick instead of stone",
      "Slime instead of mortar",
      "Tower to reach heaven",
      "\"Let us make a name\"",
      "\"Lest we be scattered\"",
      "God \"comes down\" to see",
      "Languages confused",
      "People scattered"
    ],
    christPattern: [
      { element: "Self-exaltation", christApplication: "Opposite of Christ's humility" },
      { element: "Build to heaven", christApplication: "Salvation by works" },
      { element: "Make a name", christApplication: "Pride vs. Christ's name above all" },
      { element: "Confusion", christApplication: "God confounds the proud" },
      { element: "Scattering", christApplication: "Judgment on pride" }
    ],
    dimensions: {
      literal: "Historical origin of languages",
      christ: "Counterfeit unity vs. true unity in Christ",
      personal: "Am I building my own tower or God's kingdom?",
      church: "False unity (Babylon) vs. true unity (Zion)",
      heavenFuture: "Babylon falls, God's people gathered",
      heavenPast: "Satan's attempt to exalt himself"
    },
    relatedStories: [
      "Acts 2 (Pentecost reversal)",
      "Revelation 17-18 (Babylon falls)",
      "Isaiah 14 (Pride brought low)",
      "Philippians 2:5-11 (Christ's humility)"
    ],
    keyFigures: ["Nimrod (implied)", "Post-flood humanity"],
    setting: "Plain of Shinar"
  },
  {
    id: "abraham-call",
    title: "Abraham's Call",
    reference: "Genesis 12:1-9",
    volume: "Genesis",
    category: "Patriarchs",
    summary: "God calls Abram to leave Ur of the Chaldees, his country, kindred, and father's house, to go to a land God will show him. God promises to make him a great nation, bless him, make his name great, bless those who bless him, curse those who curse him, and through him bless all families of the earth. Abram obeys at age 75, taking Sarai and Lot. He builds altars at Shechem and Bethel.",
    keyElements: [
      "\"Get out of your country\"",
      "Land I will show you",
      "Seven-fold promise",
      "All families blessed through him",
      "Age 75",
      "Took Sarai and Lot",
      "Altar at Shechem (first stop)",
      "Altar between Bethel and Ai",
      "Journeyed toward the south"
    ],
    christPattern: [
      { element: "Called out", christApplication: "Christ left heaven" },
      { element: "To unknown land", christApplication: "Christ came to earth" },
      { element: "All families blessed", christApplication: "Gospel to all nations" },
      { element: "Obedience by faith", christApplication: "Christ learned obedience" },
      { element: "Built altars", christApplication: "Worship established" }
    ],
    dimensions: {
      literal: "Historical call of Abraham",
      christ: "Christ came out from the Father",
      personal: "I must leave my old life and follow God's call",
      church: "The church is called out of the world",
      heavenFuture: "We journey to the heavenly Canaan",
      heavenPast: "God calls beings to allegiance"
    },
    relatedStories: [
      "Hebrews 11:8-10 (By faith Abraham)",
      "Acts 7:2-4 (Stephen recounts)",
      "Galatians 3:8 (Gospel preached to Abraham)",
      "Genesis 15 (Covenant confirmed)"
    ],
    keyFigures: ["Abram/Abraham", "Sarai/Sarah", "Lot"],
    setting: "Ur of the Chaldees to Canaan"
  },
  {
    id: "abraham-lot-separate",
    title: "Abraham and Lot Separate",
    reference: "Genesis 13",
    volume: "Genesis",
    category: "Patriarchs",
    summary: "Abraham and Lot return from Egypt with great wealth. Their herdsmen quarrel over limited resources. Abraham graciously offers Lot first choice of land. Lot chooses the well-watered Jordan plain, pitching toward Sodom. Abraham stays in Canaan. God reaffirms His promise to Abraham: all the land he sees, seed as dust of the earth. Abraham moves to Hebron, builds an altar.",
    keyElements: [
      "Strife between herdsmen",
      "Abraham's gracious offer",
      "Lot \"lifted up his eyes\"",
      "Lot chose Jordan plain",
      "\"Well watered like garden of Eden, like Egypt\"",
      "Lot \"pitched toward Sodom\"",
      "Sodom was wicked",
      "God's promise renewed",
      "Walk the land",
      "Altar at Hebron (fellowship)"
    ],
    christPattern: [
      { element: "Abraham gives first choice", christApplication: "Christ emptied Himself" },
      { element: "Lot chooses by sight", christApplication: "Walking by sight vs. faith" },
      { element: "Abraham receives more", christApplication: "He who humbles himself exalted" },
      { element: "Separation", christApplication: "Wheat and tares separate" }
    ],
    dimensions: {
      literal: "Historical separation",
      christ: "Christ gave up rights, received all",
      personal: "Do I choose by sight or by faith?",
      church: "Separation from worldly influences",
      heavenFuture: "Final separation of righteous and wicked",
      heavenPast: "Separation of loyal and rebellious angels"
    },
    relatedStories: [
      "2 Peter 2:7-8 (Righteous Lot vexed)",
      "Philippians 2:5-11 (Christ humbled, exalted)",
      "Matthew 6:33 (Seek first the kingdom)"
    ],
    keyFigures: ["Abraham", "Lot"],
    setting: "Canaan, Jordan Plain"
  },
  {
    id: "melchizedek",
    title: "Melchizedek",
    reference: "Genesis 14:17-24",
    volume: "Genesis",
    category: "Patriarchs",
    summary: "After Abraham rescues Lot from the four kings, Melchizedek, king of Salem and priest of the Most High God, brings bread and wine and blesses Abraham. Abraham gives him a tenth of all. The king of Sodom offers Abraham the spoils, but Abraham refuses, having lifted his hand to the Most High.",
    keyElements: [
      "King of Salem (peace)",
      "Priest of the Most High God",
      "Brought bread and wine",
      "Blessed Abraham",
      "Abraham gave tithes",
      "No genealogy given",
      "Abraham refuses Sodom's reward"
    ],
    christPattern: [
      { element: "King and Priest", christApplication: "Christ is King-Priest" },
      { element: "King of Salem (Peace)", christApplication: "Prince of Peace" },
      { element: "Bread and wine", christApplication: "Communion elements" },
      { element: "Greater than Abraham", christApplication: "Christ greater than all" },
      { element: "No beginning or end recorded", christApplication: "Eternal priesthood" }
    ],
    dimensions: {
      literal: "Historical meeting with priest-king",
      christ: "Christ's eternal Melchizedekian priesthood",
      personal: "I receive blessing and give tithes",
      church: "The church has a superior High Priest",
      heavenFuture: "Christ reigns as King-Priest forever",
      heavenPast: "Eternal order of priesthood"
    },
    relatedStories: [
      "Psalm 110:4 (Priest forever after Melchizedek)",
      "Hebrews 5-7 (Melchizedekian priesthood)",
      "Zechariah 6:12-13 (Branch as Priest-King)"
    ],
    keyFigures: ["Melchizedek", "Abraham", "King of Sodom"],
    setting: "Valley of Shaveh (King's Valley)"
  },
  {
    id: "covenant-with-abraham",
    title: "Covenant with Abraham",
    reference: "Genesis 15",
    volume: "Genesis",
    category: "Patriarchs",
    summary: "God appears to Abram in a vision: \"I am your shield, your exceeding great reward.\" Abram questions how he can have descendants when childless. God takes him outside to count the stars: \"So shall your seed be.\" Abram believes God and it is counted as righteousness. God makes a covenant: cut animals, smoking furnace and burning lamp pass through. Prophecy of 400 years in Egypt.",
    keyElements: [
      "\"Fear not\"",
      "Shield and reward",
      "Childless complaint",
      "Stars = seed",
      "\"Believed the LORD\"",
      "Counted for righteousness",
      "Heifer, goat, ram, turtledove, pigeon",
      "Cut in pieces, laid opposite",
      "Deep sleep and horror",
      "400 years prophecy",
      "Smoking furnace, burning lamp",
      "Covenant confirmed"
    ],
    christPattern: [
      { element: "Shield and reward", christApplication: "Christ is our protection and prize" },
      { element: "Seed as stars", christApplication: "Countless redeemed" },
      { element: "Believed = righteousness", christApplication: "Justification by faith" },
      { element: "Animals cut", christApplication: "Christ's body broken" },
      { element: "God alone passes through", christApplication: "God fulfills both sides of covenant" },
      { element: "Burning lamp", christApplication: "Christ the Light" }
    ],
    dimensions: {
      literal: "Historical covenant ceremony",
      christ: "Christ ratifies the covenant in His blood",
      personal: "I am justified by faith alone",
      church: "The church inherits Abraham's promises",
      heavenFuture: "Countless multitude in heaven",
      heavenPast: "Covenant established before creation"
    },
    relatedStories: [
      "Romans 4 (Abraham believed God)",
      "Galatians 3:6-9 (Righteousness by faith)",
      "Hebrews 6:13-20 (Immutable counsel)",
      "Jeremiah 34:18-19 (Covenant violation)"
    ],
    keyFigures: ["Abraham", "God"],
    setting: "Canaan, night vision"
  },
  {
    id: "hagar-ishmael",
    title: "Hagar and Ishmael",
    reference: "Genesis 16, 21:8-21",
    volume: "Genesis",
    category: "Patriarchs",
    summary: "Sarai, unable to conceive, gives her Egyptian servant Hagar to Abraham. Hagar conceives and despises Sarai. Sarai deals harshly with her; Hagar flees. The Angel of the Lord finds her by a fountain, tells her to return and submit, promises her son will be great, and names him Ishmael (\"God hears\"). Years later, after Isaac is weaned, Ishmael mocks. Sarah demands their expulsion. Abraham distressed, but God confirms. Hagar wanders in the wilderness; God opens her eyes to a well, and Ishmael becomes an archer in Paran.",
    keyElements: [
      "Sarai's plan (flesh, not faith)",
      "Hagar: Egyptian servant",
      "Despised her mistress",
      "Angel of the Lord at fountain",
      "\"The Lord has heard your affliction\"",
      "Ishmael = \"God hears\"",
      "Wild donkey of a man",
      "Ishmael mocks Isaac",
      "Cast out bondwoman and son",
      "Wilderness wandering",
      "God opens eyes to well",
      "Archer in Paran"
    ],
    christPattern: [
      { element: "Son of flesh vs. promise", christApplication: "Works vs. grace" },
      { element: "Bondwoman vs. freewoman", christApplication: "Law vs. gospel" },
      { element: "Cast out bondwoman", christApplication: "Law cannot save" },
      { element: "God hears affliction", christApplication: "Christ hears our cries" },
      { element: "Well in wilderness", christApplication: "Living water" }
    ],
    dimensions: {
      literal: "Historical account of Hagar and Ishmael",
      christ: "Christ is the true Son of promise",
      personal: "Am I living by flesh or Spirit?",
      church: "Galatians 4 allegory—two covenants",
      heavenFuture: "Children of promise inherit",
      heavenPast: "God's plan vs. human scheming"
    },
    relatedStories: [
      "Galatians 4:21-31 (Allegory of two covenants)",
      "Romans 9:6-9 (Children of promise)",
      "Genesis 21 (Isaac born, Ishmael cast out)"
    ],
    keyFigures: ["Hagar", "Ishmael", "Abraham", "Sarah"],
    setting: "Canaan, Wilderness of Beersheba"
  },
  {
    id: "sodom-gomorrah",
    title: "Sodom and Gomorrah",
    reference: "Genesis 18-19",
    volume: "Genesis",
    category: "Patriarchs",
    summary: "Three visitors come to Abraham at Mamre; he shows hospitality. The LORD reveals Sodom's coming judgment. Abraham intercedes, bargaining from 50 to 10 righteous. Two angels go to Sodom; Lot shows hospitality. Sodomites surround the house seeking the visitors. Angels strike them blind, urge Lot to flee. Lot's wife looks back, becomes pillar of salt. Fire and brimstone destroy cities. Lot's daughters commit incest, birthing Moab and Ammon.",
    keyElements: [
      "Three visitors at Mamre",
      "Sarah laughs at promise",
      "\"Shall I hide from Abraham?\"",
      "Outcry against Sodom",
      "Abraham's intercession",
      "50 down to 10",
      "Angels in Sodom",
      "Lot's hospitality",
      "Sodomites' wickedness",
      "Angels strike blind",
      "\"Flee, don't look back\"",
      "Lot's wife pillar of salt",
      "Fire and brimstone",
      "Lot's daughters and incest"
    ],
    christPattern: [
      { element: "Three visitors", christApplication: "Divine visitation" },
      { element: "Hospitality rewarded", christApplication: "\"Entertained angels unawares\"" },
      { element: "Intercessor for sinners", christApplication: "Christ intercedes" },
      { element: "Looking back", christApplication: "No turning back after salvation" },
      { element: "Fire from heaven", christApplication: "Final judgment" },
      { element: "Delivered from destruction", christApplication: "Christ rescues from wrath" }
    ],
    dimensions: {
      literal: "Historical destruction of cities",
      christ: "Christ as Intercessor and Deliverer",
      personal: "Am I interceding? Will I look back?",
      church: "The church intercedes for the lost",
      heavenFuture: "Final fire destroys the wicked",
      heavenPast: "Judgment on rebellion"
    },
    relatedStories: [
      "Luke 17:28-32 (Remember Lot's wife)",
      "2 Peter 2:6-9 (Example of ungodly)",
      "Jude 7 (Eternal fire example)",
      "Revelation 18 (Babylon's destruction)"
    ],
    keyFigures: ["Abraham", "Sarah", "Lot", "Lot's wife", "Two angels"],
    setting: "Mamre, Sodom, Zoar"
  },
  {
    id: "isaac-birth",
    title: "Birth of Isaac",
    reference: "Genesis 21:1-21",
    volume: "Genesis",
    category: "Patriarchs",
    summary: "Sarah conceives and bears Isaac at the appointed time, when Abraham is 100 years old. Sarah rejoices. Isaac is circumcised. At the weaning feast, Ishmael mocks. Sarah demands Hagar and Ishmael be cast out. God confirms, promising to make Ishmael a nation. Hagar wanders in Beersheba wilderness; water runs out. Angel opens her eyes to a well. Ishmael grows as an archer.",
    keyElements: [
      "\"The LORD visited Sarah\"",
      "Son in old age",
      "Abraham age 100",
      "Named Isaac (\"laughter\")",
      "Circumcised eighth day",
      "Weaning feast",
      "Ishmael mocking",
      "Sarah's demand",
      "Abraham's grief",
      "God confirms",
      "Hagar in wilderness",
      "Angel opens eyes to well",
      "Ishmael an archer"
    ],
    christPattern: [
      { element: "Promised seed", christApplication: "Christ the promised Seed" },
      { element: "Miraculous birth", christApplication: "Virgin birth" },
      { element: "Isaac = laughter", christApplication: "Joy in Christ's coming" },
      { element: "Circumcised eighth day", christApplication: "New creation (8th day)" },
      { element: "Bond vs. free", christApplication: "Law vs. grace" }
    ],
    dimensions: {
      literal: "Historical birth of Isaac",
      christ: "Christ as the promised Seed, born miraculously",
      personal: "God fulfills His promises in my life",
      church: "We are children of promise",
      heavenFuture: "Full inheritance of promises",
      heavenPast: "Promise made before creation"
    },
    relatedStories: [
      "Galatians 4:21-31 (Allegory of two covenants)",
      "Romans 9:6-9 (Children of promise)",
      "Hebrews 11:11 (Sarah's faith)"
    ],
    keyFigures: ["Abraham", "Sarah", "Isaac", "Hagar", "Ishmael"],
    setting: "Beersheba"
  },
  {
    id: "binding-of-isaac",
    title: "The Binding of Isaac",
    reference: "Genesis 22",
    volume: "Genesis",
    category: "Patriarchs",
    summary: "God tests Abraham: \"Take your only son Isaac to Moriah and offer him as burnt offering.\" Abraham rises early, takes Isaac, and travels three days. Isaac carries wood; Abraham carries fire and knife. Isaac asks, \"Where is the lamb?\" Abraham answers, \"God will provide.\" At the altar, Abraham binds Isaac and raises the knife. Angel stops him. Ram caught in thicket offered instead. Place named \"The LORD will provide.\"",
    keyElements: [
      "\"Take now your son, your only son\"",
      "Mount Moriah",
      "Three days' journey",
      "\"We will come again to you\"",
      "Isaac carries wood",
      "Abraham carries fire and knife",
      "\"Where is the lamb?\"",
      "\"God will provide Himself a lamb\"",
      "Isaac bound on altar",
      "Angel stops Abraham",
      "Ram in thicket",
      "\"Jehovah-Jireh\"",
      "Oath and blessing confirmed"
    ],
    christPattern: [
      { element: "Only son offered", christApplication: "Father gave only Son" },
      { element: "Three days' journey", christApplication: "Three days to resurrection" },
      { element: "Isaac carries wood", christApplication: "Christ carried cross" },
      { element: "\"God will provide a lamb\"", christApplication: "Lamb of God" },
      { element: "Bound on altar", christApplication: "Christ bound to cross" },
      { element: "Ram substitute", christApplication: "Christ our Substitute" },
      { element: "Received back \"as from dead\"", christApplication: "Resurrection" },
      { element: "Mount Moriah", christApplication: "Temple mount, Calvary region" }
    ],
    dimensions: {
      literal: "Historical test of Abraham",
      christ: "The Father offering His only Son",
      personal: "Will I surrender my \"Isaac\" to God?",
      church: "The church proclaims the Lamb",
      heavenFuture: "Complete surrender rewarded",
      heavenPast: "Lamb slain from foundation of world"
    },
    relatedStories: [
      "John 3:16 (God gave His only Son)",
      "Hebrews 11:17-19 (Abraham's faith)",
      "Romans 8:32 (Spared not His own Son)",
      "Revelation 13:8 (Lamb slain from foundation)"
    ],
    keyFigures: ["Abraham", "Isaac", "Angel of the LORD"],
    setting: "Mount Moriah"
  },
  {
    id: "isaac-rebekah",
    title: "Isaac and Rebekah",
    reference: "Genesis 24",
    volume: "Genesis",
    category: "Patriarchs",
    summary: "Abraham sends his eldest servant to find a wife for Isaac from his kindred. The servant prays at the well for a sign: the woman who offers water and waters the camels. Rebekah fulfills the sign. The servant recounts God's leading to her family. Rebekah agrees to go. She sees Isaac in the field at evening and becomes his wife. Isaac is comforted after Sarah's death.",
    keyElements: [
      "Servant commissioned",
      "\"Put hand under my thigh\"",
      "Do not take Canaanite wife",
      "Prayer for guidance",
      "Sign of hospitality",
      "Rebekah waters camels",
      "Golden jewelry given",
      "Servant recounts story",
      "\"Will you go?\" \"I will go\"",
      "Isaac meditating in field",
      "Rebekah covers herself",
      "Married, comforted"
    ],
    christPattern: [
      { element: "Father sends servant", christApplication: "Father sends Spirit" },
      { element: "Servant seeks bride", christApplication: "Spirit draws bride of Christ" },
      { element: "Bride from afar", christApplication: "Church called from Gentiles" },
      { element: "Bride's willing response", christApplication: "Free response to gospel" },
      { element: "Bridegroom waiting", christApplication: "Christ awaits His bride" },
      { element: "Evening meeting", christApplication: "Marriage supper of Lamb" }
    ],
    dimensions: {
      literal: "Historical marriage of Isaac",
      christ: "Christ and His bride",
      personal: "Am I responding to the Spirit's call?",
      church: "The church is the bride",
      heavenFuture: "Marriage supper of the Lamb",
      heavenPast: "Bride chosen before creation"
    },
    relatedStories: [
      "Ephesians 5:25-32 (Christ and the church)",
      "Revelation 19:7-9 (Marriage of the Lamb)",
      "2 Corinthians 11:2 (Presented as chaste virgin)"
    ],
    keyFigures: ["Abraham", "Servant (Eliezer)", "Rebekah", "Isaac", "Laban"],
    setting: "Canaan to Mesopotamia and back"
  },
  {
    id: "jacob-esau-birthright",
    title: "Jacob and Esau: The Birthright",
    reference: "Genesis 25:19-34",
    volume: "Genesis",
    category: "Patriarchs",
    summary: "Rebekah's twins struggle in the womb. God reveals the elder will serve the younger. Esau is born first, red and hairy; Jacob follows, grasping his heel. Esau becomes a hunter; Jacob a plain man dwelling in tents. Isaac loves Esau; Rebekah loves Jacob. Esau sells his birthright to Jacob for red stew, despising it.",
    keyElements: [
      "Twins struggle in womb",
      "\"Two nations in your womb\"",
      "Elder shall serve younger",
      "Esau red and hairy",
      "Jacob grasps heel",
      "Hunter vs. tent-dweller",
      "Parental favoritism",
      "Esau famished",
      "Red stew (Edom)",
      "\"Sell me your birthright\"",
      "Esau despised birthright"
    ],
    christPattern: [
      { element: "Struggle in womb", christApplication: "Conflict between flesh and Spirit" },
      { element: "Younger chosen", christApplication: "God's sovereign election" },
      { element: "Birthright sold", christApplication: "Temporal over eternal" },
      { element: "Jacob = supplanter", christApplication: "New nature replaces old" }
    ],
    dimensions: {
      literal: "Historical birth and birthright sale",
      christ: "Election not by works but by calling",
      personal: "Do I value my spiritual inheritance?",
      church: "The church inherits what Israel forfeited",
      heavenFuture: "Final inheritance revealed",
      heavenPast: "Chosen before foundation of world"
    },
    relatedStories: [
      "Romans 9:10-13 (Jacob I loved, Esau I hated)",
      "Hebrews 12:16-17 (Esau the profane)",
      "Malachi 1:2-3 (Jacob loved)"
    ],
    keyFigures: ["Isaac", "Rebekah", "Jacob", "Esau"],
    setting: "Canaan"
  },
  {
    id: "jacob-stolen-blessing",
    title: "Jacob's Stolen Blessing",
    reference: "Genesis 27",
    volume: "Genesis",
    category: "Patriarchs",
    summary: "Isaac, old and blind, prepares to bless Esau. Rebekah overhears, plots with Jacob to deceive Isaac. Jacob wears Esau's clothes and goatskins on his hands and neck. He brings savory food. Isaac is suspicious: \"The voice is Jacob's, but the hands are Esau's.\" He blesses Jacob with dew, fatness, dominion over brothers. Esau returns, discovers the deception, cries bitterly. Isaac cannot reverse the blessing. Esau receives lesser blessing and vows to kill Jacob. Rebekah sends Jacob to Laban.",
    keyElements: [
      "Isaac blind",
      "\"Bring me venison that I may bless you\"",
      "Rebekah's scheme",
      "Goatskins as disguise",
      "Voice vs. hands",
      "Kiss of deception",
      "Blessing: dew, grain, wine, lordship",
      "Esau's bitter cry",
      "\"He took away my birthright and blessing\"",
      "Cannot reverse blessing",
      "Esau's blessing: live by sword, serve brother",
      "Murder plot",
      "Jacob sent away"
    ],
    christPattern: [
      { element: "Deception", christApplication: "Sin has consequences even when obtaining promises" },
      { element: "Younger blessed", christApplication: "Grace chooses the unlikely" },
      { element: "Garments of firstborn", christApplication: "Clothed in Christ's righteousness" },
      { element: "Bitter cry", christApplication: "Too late repentance" },
      { element: "Cannot reverse", christApplication: "Blessing is irrevocable" }
    ],
    dimensions: {
      literal: "Historical deception and blessing",
      christ: "We receive blessing clothed in Christ's garments",
      personal: "God works through flawed people; His purposes stand",
      church: "Spiritual Israel receives the blessing",
      heavenFuture: "Final inheritance cannot be reversed",
      heavenPast: "God's plan cannot be thwarted"
    },
    relatedStories: [
      "Hebrews 12:17 (Found no place of repentance)",
      "Hebrews 11:20 (By faith Isaac blessed)",
      "Romans 9 (Election stands)"
    ],
    keyFigures: ["Isaac", "Rebekah", "Jacob", "Esau"],
    setting: "Isaac's tent in Canaan"
  },
  {
    id: "jacob-ladder",
    title: "Jacob's Ladder",
    reference: "Genesis 28:10-22",
    volume: "Genesis",
    category: "Patriarchs",
    summary: "Jacob flees to Haran after stealing Esau's blessing. At sunset he rests, using a stone for a pillow. He dreams of a ladder from earth to heaven with angels ascending and descending. The LORD stands above, reaffirming the Abrahamic covenant. Jacob awakes, names the place Bethel (\"house of God\"), sets up the stone, vows to tithe.",
    keyElements: [
      "Fleeing to Haran",
      "Stone pillow",
      "Ladder to heaven",
      "Angels ascending and descending",
      "LORD above",
      "Covenant reaffirmed",
      "\"I am with you\"",
      "\"Gate of heaven\"",
      "Stone set up as pillar",
      "Named Bethel",
      "Tithe vowed"
    ],
    christPattern: [
      { element: "Ladder from earth to heaven", christApplication: "Christ is the ladder (John 1:51)" },
      { element: "Angels ascending/descending", christApplication: "Ministry to/through Christ" },
      { element: "Gate of heaven", christApplication: "Christ is the gate" },
      { element: "Stone pillar", christApplication: "Christ the Rock" },
      { element: "House of God", christApplication: "Christ builds God's house" }
    ],
    dimensions: {
      literal: "Historical dream at Bethel",
      christ: "Christ as the way between heaven and earth",
      personal: "Do I see Christ as my access to God?",
      church: "The church is Bethel, the house of God",
      heavenFuture: "Heaven opened to the redeemed",
      heavenPast: "Ladder existed before sin"
    },
    relatedStories: [
      "John 1:51 (Angels on Son of Man)",
      "Hebrews 1:14 (Ministering spirits)",
      "John 14:6 (I am the way)"
    ],
    keyFigures: ["Jacob", "God", "Angels"],
    setting: "Bethel (Luz)"
  },
  {
    id: "jacob-wrestles",
    title: "Jacob Wrestles with God",
    reference: "Genesis 32:22-32",
    volume: "Genesis",
    category: "Patriarchs",
    summary: "Jacob sends family across Jabbok and remains alone. A Man wrestles with him until daybreak. Seeing He cannot prevail, the Man touches Jacob's hip, dislocating it. Jacob refuses to let go without a blessing. His name is changed to Israel (\"prince with God\"). Jacob names the place Peniel (\"face of God\"): \"I have seen God face to face and lived.\" He limps across the ford.",
    keyElements: [
      "Alone at Jabbok",
      "Man wrestles all night",
      "Hip touched, dislocated",
      "\"Let me go\"—\"Not unless you bless me\"",
      "\"What is your name?\"—\"Jacob\"",
      "Name changed to Israel",
      "\"You have striven with God and prevailed\"",
      "Jacob asks His name—not revealed",
      "\"Why do you ask?\"",
      "Peniel—\"face of God\"",
      "Limps at sunrise"
    ],
    christPattern: [
      { element: "Wrestling with God", christApplication: "Prevailing prayer, Christ in Gethsemane" },
      { element: "Wounded but blessed", christApplication: "Through suffering to glory" },
      { element: "New name", christApplication: "New identity in Christ" },
      { element: "Face to face", christApplication: "See God and live" },
      { element: "Limping victor", christApplication: "Weak made strong" }
    ],
    dimensions: {
      literal: "Historical wrestling at Jabbok",
      christ: "Christ wrestles with us to bless us",
      personal: "Am I wrestling with God until blessing?",
      church: "The church prevails through prayer",
      heavenFuture: "Time of Jacob's trouble, then deliverance",
      heavenPast: "God's desire to bless His creatures"
    },
    relatedStories: [
      "Hosea 12:3-4 (Wept and made supplication)",
      "Luke 22:44 (Christ's agony)",
      "2 Corinthians 12:9-10 (Strength in weakness)"
    ],
    keyFigures: ["Jacob/Israel", "The Angel of the LORD"],
    setting: "Jabbok River"
  },
  {
    id: "joseph-sold",
    title: "Joseph Sold into Egypt",
    reference: "Genesis 37",
    volume: "Genesis",
    category: "Joseph Cycle",
    summary: "Jacob loves Joseph most, giving him a coat of many colors. Joseph's dreams of sheaves and stars bowing anger his brothers. Sent to check on them at Shechem, he finds them at Dothan. They plot to kill him, but Reuben intervenes. They strip his coat, throw him in a pit, sell him to Midianites for 20 pieces of silver. They dip the coat in goat's blood; Jacob mourns, refusing comfort.",
    keyElements: [
      "Favorite son, age 17",
      "Coat of many colors",
      "Dreams of sheaves bowing",
      "Dream of sun, moon, 11 stars bowing",
      "Brothers' jealousy",
      "Sent to Shechem, finds them at Dothan",
      "Plot to kill him",
      "Reuben's intervention",
      "Cast into pit",
      "Sold for 20 pieces of silver",
      "Coat dipped in blood",
      "Jacob's inconsolable grief"
    ],
    christPattern: [
      { element: "Beloved son", christApplication: "\"This is My beloved Son\"" },
      { element: "Sent by father", christApplication: "Christ sent by Father" },
      { element: "Brothers' jealousy", christApplication: "\"For envy they delivered Him\"" },
      { element: "Stripped of robe", christApplication: "Christ's garments divided" },
      { element: "Cast into pit", christApplication: "Descended into death" },
      { element: "Sold for silver", christApplication: "Christ sold for 30 pieces" },
      { element: "Blood-stained garment", christApplication: "Christ's blood shed" }
    ],
    dimensions: {
      literal: "Historical betrayal of Joseph",
      christ: "Christ betrayed and sold",
      personal: "Am I faithful when betrayed?",
      church: "The church suffers persecution from within",
      heavenFuture: "Vindication of the righteous",
      heavenPast: "Satan's betrayal of Christ"
    },
    relatedStories: [
      "Matthew 27:3-10 (30 pieces of silver)",
      "Acts 7:9 (Joseph sold by brothers)",
      "Isaiah 53:3 (Despised and rejected)"
    ],
    keyFigures: ["Joseph", "Jacob", "Brothers (Reuben, Judah)", "Midianite traders"],
    setting: "Hebron to Dothan to Egypt"
  },
  {
    id: "joseph-prison",
    title: "Joseph in Prison",
    reference: "Genesis 39-40",
    volume: "Genesis",
    category: "Joseph Cycle",
    summary: "Joseph prospers in Potiphar's house until falsely accused by Potiphar's wife. Cast into prison, the LORD is with him. He interprets dreams of the butler and baker. The butler is restored; the baker is hanged. The butler forgets Joseph for two years.",
    keyElements: [
      "\"The LORD was with Joseph\"",
      "Prospered in Potiphar's house",
      "Potiphar's wife tempts",
      "\"How can I sin against God?\"",
      "Falsely accused",
      "Garment left behind",
      "Cast into prison",
      "Keeper trusts Joseph",
      "Butler and baker imprisoned",
      "Dreams interpreted",
      "\"Interpretations belong to God\"",
      "Butler restored, baker hanged",
      "Butler forgets"
    ],
    christPattern: [
      { element: "Falsely accused", christApplication: "Christ falsely accused" },
      { element: "Suffered for righteousness", christApplication: "Christ suffered for doing good" },
      { element: "Numbered with transgressors", christApplication: "Christ among sinners" },
      { element: "One saved, one lost", christApplication: "Two thieves on cross" },
      { element: "Forgotten by beneficiary", christApplication: "World forgets Christ" }
    ],
    dimensions: {
      literal: "Historical imprisonment",
      christ: "Christ suffered though innocent",
      personal: "Am I faithful in unjust suffering?",
      church: "The church suffers persecution",
      heavenFuture: "Vindication of the persecuted",
      heavenPast: "Christ's suffering predetermined"
    },
    relatedStories: [
      "1 Peter 2:19-23 (Suffering unjustly)",
      "Luke 23:39-43 (Two thieves)",
      "Psalm 105:17-19 (Joseph tested)"
    ],
    keyFigures: ["Joseph", "Potiphar", "Potiphar's wife", "Butler", "Baker"],
    setting: "Egypt: Potiphar's house, prison"
  },
  {
    id: "joseph-exalted",
    title: "Joseph Exalted",
    reference: "Genesis 41",
    volume: "Genesis",
    category: "Joseph Cycle",
    summary: "Pharaoh dreams of seven fat and seven lean cows, seven good and seven thin ears. Magicians fail. The butler remembers Joseph. Joseph interprets: seven years plenty, seven years famine. He advises storing grain. Pharaoh exalts Joseph to second in command. Joseph is given Asenath as wife, has sons Manasseh and Ephraim. He stores grain during plenty and distributes during famine.",
    keyElements: [
      "Pharaoh's two dreams",
      "Seven fat cows eaten by lean",
      "Seven good ears consumed by thin",
      "Magicians cannot interpret",
      "Butler remembers Joseph",
      "\"It is not in me; God will give answer\"",
      "Interpretation: 7 years plenty, 7 famine",
      "Advice to store grain",
      "Exalted to second in Egypt",
      "Ring, chain, fine linen",
      "Asenath wife, Manasseh and Ephraim born",
      "Grain stored, then distributed"
    ],
    christPattern: [
      { element: "From prison to palace", christApplication: "From cross to throne" },
      { element: "Wisdom from God", christApplication: "Christ is wisdom" },
      { element: "Exalted to right hand", christApplication: "Christ at God's right hand" },
      { element: "Given all authority", christApplication: "All authority given to Christ" },
      { element: "Gentile bride", christApplication: "Christ's Gentile church" },
      { element: "Bread for the world", christApplication: "Bread of Life" }
    ],
    dimensions: {
      literal: "Historical exaltation",
      christ: "Christ exalted after humiliation",
      personal: "Humble faithfulness leads to exaltation",
      church: "The church distributes the Bread of Life",
      heavenFuture: "Christ reigns over all",
      heavenPast: "Christ's exaltation planned"
    },
    relatedStories: [
      "Philippians 2:8-11 (Humbled, exalted)",
      "Daniel 2 (Dreams interpreted)",
      "Acts 7:10 (God gave wisdom)"
    ],
    keyFigures: ["Joseph", "Pharaoh", "Asenath", "Manasseh", "Ephraim"],
    setting: "Egypt: palace"
  },
  {
    id: "joseph-brothers-reconcile",
    title: "Joseph and Brothers Reconciled",
    reference: "Genesis 42-45",
    volume: "Genesis",
    category: "Joseph Cycle",
    summary: "Famine brings brothers to Egypt for grain. Joseph recognizes them but tests them. They return with Benjamin; Joseph reveals himself with weeping. He embraces them, forgives, and attributes their evil to God's providence: \"You meant it for evil; God meant it for good.\" He sends for Jacob.",
    keyElements: [
      "Brothers bow to Joseph",
      "Joseph recognizes, hides identity",
      "\"You are spies\"",
      "Simeon detained",
      "Money in sacks",
      "Benjamin demanded",
      "Judah's guarantee",
      "Silver cup in Benjamin's sack",
      "Judah's plea",
      "\"I am Joseph\"",
      "Weeping and embracing",
      "\"God sent me before you\"",
      "\"You meant evil; God meant good\"",
      "Jacob invited to Egypt"
    ],
    christPattern: [
      { element: "Brothers bow", christApplication: "Every knee shall bow" },
      { element: "Hidden identity", christApplication: "Christ not recognized at first" },
      { element: "Testing before revelation", christApplication: "Tribulation precedes glory" },
      { element: "Reveals himself with tears", christApplication: "Christ reveals Himself" },
      { element: "Forgiveness", christApplication: "Christ forgives His brothers" },
      { element: "Evil turned to good", christApplication: "Cross turned for salvation" }
    ],
    dimensions: {
      literal: "Historical reconciliation",
      christ: "Christ forgives those who rejected Him",
      personal: "Do I forgive those who wronged me?",
      church: "The church offers reconciliation",
      heavenFuture: "Israel recognizes their Messiah",
      heavenPast: "Reconciliation always God's plan"
    },
    relatedStories: [
      "Romans 8:28 (All things for good)",
      "Zechariah 12:10 (Look on Him pierced)",
      "Romans 11:25-26 (All Israel saved)"
    ],
    keyFigures: ["Joseph", "Brothers", "Benjamin", "Judah", "Jacob"],
    setting: "Egypt"
  }
];

// Volume II: Exodus Stories
export const exodusStories: BiblicalStory[] = [
  {
    id: "moses-birth",
    title: "Birth and Rescue of Moses",
    reference: "Exodus 2:1-10",
    volume: "Exodus",
    category: "Deliverance",
    summary: "Pharaoh decrees death to Hebrew boys. A Levite woman hides her baby three months. She places him in an ark of bulrushes on the Nile. Pharaoh's daughter finds him, has compassion, names him Moses (\"drawn out\"). His sister arranges for his own mother to nurse him.",
    keyElements: [
      "Decree to kill male babies",
      "Hidden three months",
      "Ark of bulrushes",
      "Placed in Nile",
      "Sister watches",
      "Pharaoh's daughter finds",
      "Compassion on the weeping baby",
      "Named Moses (\"drawn out\")",
      "Mother nurses him",
      "Raised in palace"
    ],
    christPattern: [
      { element: "Death decree on infants", christApplication: "Herod's slaughter of innocents" },
      { element: "Hidden from danger", christApplication: "Flight to Egypt" },
      { element: "Drawn from water", christApplication: "Baptism, resurrection from death" },
      { element: "Raised in enemy's house", christApplication: "Christ grew in hostile world" },
      { element: "Deliverer prepared", christApplication: "Christ prepared for ministry" }
    ],
    dimensions: {
      literal: "Historical birth of Moses",
      christ: "Christ as the greater Deliverer",
      personal: "God preserves and prepares me for purpose",
      church: "The church is preserved through persecution",
      heavenFuture: "The preserved will deliver",
      heavenPast: "God's redemption plan unfolds"
    },
    relatedStories: [
      "Matthew 2:13-18 (Slaughter of innocents)",
      "Acts 7:20-22 (Moses's early life)",
      "Hebrews 11:23 (By faith Moses was hidden)"
    ],
    keyFigures: ["Moses", "Jochebed (mother)", "Miriam (sister)", "Pharaoh's daughter"],
    setting: "Egypt, Nile River"
  },
  {
    id: "burning-bush",
    title: "The Burning Bush",
    reference: "Exodus 3-4",
    volume: "Exodus",
    category: "Deliverance",
    summary: "Moses shepherds Jethro's flock to Horeb. A bush burns but isn't consumed. God calls Moses to deliver Israel from Egypt. Moses objects; God gives signs: rod to serpent, leprous hand, water to blood. Aaron is appointed as spokesman. Moses returns to Egypt.",
    keyElements: [
      "Backside of the desert",
      "Mountain of God (Horeb)",
      "Bush burns, not consumed",
      "\"Put off your shoes\"",
      "\"I AM THAT I AM\"",
      "Commission to deliver Israel",
      "Moses' five objections",
      "Sign of the rod",
      "Sign of leprous hand",
      "Sign of water to blood",
      "Aaron as spokesman",
      "Return to Egypt"
    ],
    christPattern: [
      { element: "Bush not consumed", christApplication: "Humanity of Christ, divine nature" },
      { element: "Holy ground", christApplication: "Christ makes holy" },
      { element: "I AM", christApplication: "Christ is I AM (John 8:58)" },
      { element: "Sent to deliver", christApplication: "Christ sent to deliver" },
      { element: "Rod of power", christApplication: "Christ's authority" }
    ],
    dimensions: {
      literal: "Historical call of Moses",
      christ: "Christ as the I AM, the Deliverer",
      personal: "Will I answer God's call despite weakness?",
      church: "The church is called to deliver the captives",
      heavenFuture: "Final deliverance from bondage",
      heavenPast: "I AM eternal, unchanging"
    },
    relatedStories: [
      "John 8:58 (Before Abraham was, I AM)",
      "Acts 7:30-35 (Stephen's account)",
      "Hebrews 11:24-27 (Moses by faith)"
    ],
    keyFigures: ["Moses", "God (Angel of the LORD)", "Aaron"],
    setting: "Mount Horeb (Sinai)"
  },
  {
    id: "ten-plagues",
    title: "The Ten Plagues",
    reference: "Exodus 7-12",
    volume: "Exodus",
    category: "Deliverance",
    summary: "God sends ten plagues on Egypt: water to blood, frogs, lice, flies, livestock disease, boils, hail, locusts, darkness, death of firstborn. Each plague intensifies; Pharaoh hardens his heart. The final plague brings death to every Egyptian firstborn but passes over Israelite homes marked with lamb's blood.",
    keyElements: [
      "Water to blood",
      "Frogs",
      "Lice (gnats)",
      "Flies",
      "Livestock disease",
      "Boils",
      "Hail",
      "Locusts",
      "Darkness",
      "Death of firstborn",
      "Pharaoh's hardening",
      "\"Let My people go\"",
      "Distinction between Israel and Egypt",
      "Lamb's blood on doorposts",
      "Passover instituted"
    ],
    christPattern: [
      { element: "Blood marks protection", christApplication: "Christ's blood protects" },
      { element: "Lamb slain", christApplication: "Lamb of God slain" },
      { element: "Firstborn dies", christApplication: "God's Firstborn dies for us" },
      { element: "Death passes over", christApplication: "Death passes over believers" },
      { element: "Deliverance through blood", christApplication: "Salvation by blood" }
    ],
    dimensions: {
      literal: "Historical plagues on Egypt",
      christ: "Christ as the Passover Lamb",
      personal: "Am I under the blood's protection?",
      church: "The church celebrates Passover in communion",
      heavenFuture: "Final plagues (Revelation 16)",
      heavenPast: "Judgment on rebellion"
    },
    relatedStories: [
      "1 Corinthians 5:7 (Christ our Passover)",
      "John 1:29 (Behold the Lamb)",
      "Revelation 15-16 (Seven last plagues)"
    ],
    keyFigures: ["Moses", "Aaron", "Pharaoh", "Israelites"],
    setting: "Egypt"
  },
  {
    id: "red-sea-crossing",
    title: "Crossing the Red Sea",
    reference: "Exodus 14",
    volume: "Exodus",
    category: "Deliverance",
    summary: "Pharaoh pursues Israel to the Red Sea. Israel panics; Moses says, \"Stand still and see the salvation of the LORD.\" God parts the sea; Israel walks through on dry ground. Egyptians follow; the waters return and destroy them. Israel sees God's deliverance and believes.",
    keyElements: [
      "Pharaoh pursues",
      "Israel trapped at sea",
      "\"Fear not, stand still\"",
      "\"The LORD will fight for you\"",
      "Pillar moves behind them",
      "Moses stretches rod",
      "Sea divides",
      "Walls of water on both sides",
      "Israel walks on dry ground",
      "Egyptians follow",
      "Wheels come off chariots",
      "Waters return",
      "Egypt destroyed",
      "Israel believed"
    ],
    christPattern: [
      { element: "Trapped, no escape", christApplication: "Christ faces death alone" },
      { element: "Waters divided", christApplication: "Barrier removed through Christ" },
      { element: "Walk on dry ground", christApplication: "Safe passage through death" },
      { element: "Enemy destroyed", christApplication: "Satan defeated at cross" },
      { element: "Salvation witnessed", christApplication: "Resurrection witnessed" }
    ],
    dimensions: {
      literal: "Historical sea crossing",
      christ: "Christ delivers through apparent death",
      personal: "My old life destroyed, new life begins",
      church: "The church passes through baptism",
      heavenFuture: "Final deliverance from enemies",
      heavenPast: "God's power over creation"
    },
    relatedStories: [
      "1 Corinthians 10:1-2 (Baptized unto Moses)",
      "Hebrews 11:29 (By faith through Red Sea)",
      "Isaiah 43:16-19 (Way in the sea)"
    ],
    keyFigures: ["Moses", "Pharaoh", "Angel of God", "Israel"],
    setting: "Red Sea"
  },
  {
    id: "manna-quail",
    title: "Manna and Quail",
    reference: "Exodus 16",
    volume: "Exodus",
    category: "Wilderness",
    summary: "Israel murmurs for food in the wilderness. God sends manna each morning and quail in the evening. Instructions: gather daily, double on sixth day for Sabbath. Manna is like coriander seed, tasting like wafers with honey. It continues 40 years until Canaan.",
    keyElements: [
      "Murmuring for food",
      "\"You murmur against the LORD\"",
      "Quail in evening",
      "Manna in morning",
      "\"What is it?\" (Manna)",
      "White like coriander seed",
      "Tasted like honey wafers",
      "Gather daily, no hoarding",
      "Double portion sixth day",
      "None on Sabbath",
      "Omer kept as memorial",
      "Continued 40 years"
    ],
    christPattern: [
      { element: "Bread from heaven", christApplication: "Christ the Bread from heaven" },
      { element: "Given each morning", christApplication: "Daily dependence on Christ" },
      { element: "\"What is it?\"", christApplication: "Mystery of incarnation" },
      { element: "Gathered daily", christApplication: "Daily feeding on Word" },
      { element: "Sabbath rest", christApplication: "Rest in Christ" }
    ],
    dimensions: {
      literal: "Historical provision of manna",
      christ: "Christ as the Bread of Life (John 6)",
      personal: "I must feed on Christ daily",
      church: "The church gathers for spiritual food",
      heavenFuture: "Hidden manna for overcomers (Rev 2:17)",
      heavenPast: "Angels' food"
    },
    relatedStories: [
      "John 6:31-58 (I am the Bread of Life)",
      "Revelation 2:17 (Hidden manna)",
      "Deuteronomy 8:3 (Man lives by every word)"
    ],
    keyFigures: ["Moses", "Aaron", "Israel"],
    setting: "Wilderness of Sin"
  },
  {
    id: "water-from-rock",
    title: "Water from the Rock",
    reference: "Exodus 17:1-7",
    volume: "Exodus",
    category: "Wilderness",
    summary: "At Rephidim, there is no water. Israel quarrels with Moses. God instructs Moses to strike the rock at Horeb with his rod. Water flows out. The place is named Massah (\"testing\") and Meribah (\"quarreling\").",
    keyElements: [
      "No water at Rephidim",
      "Israel's complaint",
      "\"Give us water\"",
      "\"Why did you bring us up?\"",
      "Moses fears stoning",
      "Elders accompany Moses",
      "Strike the rock at Horeb",
      "Water flows from rock",
      "Massah and Meribah",
      "\"Is the LORD among us or not?\""
    ],
    christPattern: [
      { element: "Rock smitten", christApplication: "Christ smitten for us" },
      { element: "Water flows", christApplication: "Living water from Christ" },
      { element: "Satisfies thirst", christApplication: "Christ satisfies spiritual thirst" },
      { element: "Rock follows them", christApplication: "That Rock was Christ (1 Cor 10:4)" }
    ],
    dimensions: {
      literal: "Historical water from rock",
      christ: "Christ the Rock, smitten for us",
      personal: "I drink from the living water",
      church: "The church dispenses living water",
      heavenFuture: "River of life from the throne",
      heavenPast: "Christ, Rock from eternity"
    },
    relatedStories: [
      "1 Corinthians 10:4 (That Rock was Christ)",
      "John 7:37-39 (Rivers of living water)",
      "Revelation 22:1 (River of life)"
    ],
    keyFigures: ["Moses", "Israel", "Elders"],
    setting: "Rephidim, Horeb"
  },
  {
    id: "sinai-law",
    title: "The Law at Sinai",
    reference: "Exodus 19-20",
    volume: "Exodus",
    category: "Covenant",
    summary: "Israel arrives at Sinai three months after leaving Egypt. God proposes a covenant: Israel will be His treasured possession, a kingdom of priests. The people consecrate themselves. God descends on the mountain with thunder, lightning, smoke, and trumpet. The Ten Commandments are spoken from heaven.",
    keyElements: [
      "Third month at Sinai",
      "\"If you obey My voice\"",
      "\"Kingdom of priests, holy nation\"",
      "\"All the LORD says, we will do\"",
      "Three days of consecration",
      "Thunder, lightning, thick cloud",
      "Sound of trumpet",
      "Mountain smoked",
      "People trembled",
      "Ten Commandments spoken",
      "\"Do not make us hear God's voice\"",
      "Moses enters darkness"
    ],
    christPattern: [
      { element: "Treasured possession", christApplication: "Church is Christ's treasure" },
      { element: "Kingdom of priests", christApplication: "Believers are royal priesthood" },
      { element: "Law given", christApplication: "Christ writes law on hearts" },
      { element: "Mediator between God and people", christApplication: "Christ our Mediator" },
      { element: "People fear, Moses enters", christApplication: "Christ enters God's presence for us" }
    ],
    dimensions: {
      literal: "Historical giving of the law",
      christ: "Christ fulfills and internalizes the law",
      personal: "The law reveals my need for Christ",
      church: "The church is a kingdom of priests",
      heavenFuture: "Law written on hearts completely",
      heavenPast: "Law reflects God's eternal character"
    },
    relatedStories: [
      "Hebrews 12:18-24 (Not to Sinai but Zion)",
      "2 Corinthians 3 (Ministry of Spirit)",
      "Jeremiah 31:31-34 (New covenant)"
    ],
    keyFigures: ["Moses", "God", "Israel"],
    setting: "Mount Sinai"
  },
  {
    id: "golden-calf",
    title: "The Golden Calf",
    reference: "Exodus 32",
    volume: "Exodus",
    category: "Apostasy",
    summary: "While Moses is on the mountain 40 days, Israel pressures Aaron to make gods. Aaron fashions a golden calf from their jewelry. Israel worships it. God tells Moses; Moses descends with the tablets. Seeing the revelry, he breaks the tablets. He grinds the calf, makes Israel drink it. Levites slay 3,000. Moses intercedes: \"Blot me out if You won't forgive them.\"",
    keyElements: [
      "Moses 40 days on mountain",
      "People impatient",
      "\"Make us gods\"",
      "Aaron collects gold",
      "Golden calf fashioned",
      "\"These are your gods\"",
      "Festival proclaimed",
      "Eating, drinking, playing",
      "God's anger",
      "Moses descends with tablets",
      "Breaks tablets at sight of calf",
      "Calf ground to powder, drunk",
      "Levites' loyalty",
      "3,000 slain",
      "Moses' intercession",
      "\"Blot me out of Your book\""
    ],
    christPattern: [
      { element: "Moses absent", christApplication: "When Christ seems absent, faith tested" },
      { element: "False worship", christApplication: "Counterfeit religion" },
      { element: "Tablets broken", christApplication: "Law transgressed" },
      { element: "Moses' intercession", christApplication: "Christ intercedes for sinners" },
      { element: "\"Blot me out\"", christApplication: "Christ became curse for us" }
    ],
    dimensions: {
      literal: "Historical apostasy at Sinai",
      christ: "Christ as faithful Intercessor",
      personal: "Do I worship substitutes when God seems absent?",
      church: "The church must guard against apostasy",
      heavenFuture: "Final test of worship",
      heavenPast: "Sin of idolatry in heaven"
    },
    relatedStories: [
      "Acts 7:39-41 (Stephen's account)",
      "1 Corinthians 10:7 (Warning from history)",
      "Romans 9:3 (Paul's similar wish)"
    ],
    keyFigures: ["Moses", "Aaron", "Levites", "Israel"],
    setting: "Mount Sinai"
  },
  {
    id: "tabernacle-built",
    title: "The Tabernacle Built",
    reference: "Exodus 35-40",
    volume: "Exodus",
    category: "Sanctuary",
    summary: "Moses calls for freewill offerings. Bezalel and Oholiab are filled with the Spirit for craftsmanship. The tabernacle is constructed according to the pattern: outer court with altar and laver, holy place with table, lampstand, and incense altar, most holy place with ark. When completed, the glory cloud fills it so Moses cannot enter.",
    keyElements: [
      "Freewill offerings",
      "More than enough given",
      "Bezalel and Oholiab",
      "Filled with Spirit",
      "All made according to pattern",
      "Ark overlaid with gold",
      "Mercy seat with cherubim",
      "Table for showbread",
      "Golden lampstand",
      "Altar of incense",
      "Altar of burnt offering",
      "Bronze laver",
      "Priestly garments",
      "Tabernacle assembled",
      "Glory cloud filled the tabernacle",
      "Moses could not enter"
    ],
    christPattern: [
      { element: "Dwell among them", christApplication: "Emmanuel—God with us" },
      { element: "Pattern from heaven", christApplication: "The Word became flesh and tabernacled among us" },
      { element: "One door", christApplication: "Christ is the only way" },
      { element: "Altar", christApplication: "Cross" },
      { element: "Laver", christApplication: "Baptism/washing of Word" },
      { element: "Table", christApplication: "Bread of Life" },
      { element: "Lampstand", christApplication: "Light of the World" },
      { element: "Incense", christApplication: "Christ's intercession" },
      { element: "Ark", christApplication: "God's presence" },
      { element: "Mercy seat", christApplication: "Propitiation" },
      { element: "Glory fills", christApplication: "Spirit fills" }
    ],
    dimensions: {
      literal: "Historical construction",
      christ: "Christ is the true tabernacle (John 1:14)",
      personal: "My body is a temple (1 Cor 6:19)",
      church: "Church is God's temple (1 Cor 3:16)",
      heavenFuture: "Tabernacle of God with men (Rev 21:3)",
      heavenPast: "Original sanctuary in heaven"
    },
    relatedStories: [
      "John 1:14 (Word tabernacled among us)",
      "Hebrews 8-9 (Heavenly sanctuary)",
      "1 Corinthians 6:19 (Body is temple)",
      "Revelation 21:3 (God dwells with men)"
    ],
    keyFigures: ["Moses", "Bezalel", "Oholiab", "Israel"],
    setting: "Sinai wilderness"
  }
];

// Import extended stories
import {
  leviticusStories,
  numbersStories,
  deuteronomyStories,
  joshuaStories,
  judgesStories,
  ruthStories,
  samuel1Stories,
  danielStories,
  jonahStories
} from "./storyLibraryExtended";

import {
  samuel2Stories, kings1Stories, kings2Stories, chronicles1Stories, chronicles2Stories,
  ezraStories, nehemiahStories, estherStories
} from "./storyLibraryOT2";

import {
  jobStories, psalmsStories, proverbsStories, ecclesiastesStories, songStories
} from "./storyLibraryPoetry";

import {
  isaiahStories, jeremiahStories, lamentationsStories, ezekielStories,
  hoseaStories, joelStories, amosStories, obadiahStories, micahStories,
  nahumStories, habakkukStories, zephaniahStories, haggaiStories, zechariahStories, malachiStories
} from "./storyLibraryProphets";

import {
  matthewStories, markStories, lukeStories, johnStories, actsStories,
  romansStories, corinthians1Stories, ephesiansStories, philippiansStories,
  hebrewsStories, revelationStories
} from "./storyLibraryNT";

// Combine all volumes
export const allStories: BiblicalStory[] = [
  ...genesisStories, ...exodusStories, ...leviticusStories, ...numbersStories, ...deuteronomyStories,
  ...joshuaStories, ...judgesStories, ...ruthStories, ...samuel1Stories, ...samuel2Stories,
  ...kings1Stories, ...kings2Stories, ...chronicles1Stories, ...chronicles2Stories,
  ...ezraStories, ...nehemiahStories, ...estherStories,
  ...jobStories, ...psalmsStories, ...proverbsStories, ...ecclesiastesStories, ...songStories,
  ...isaiahStories, ...jeremiahStories, ...lamentationsStories, ...ezekielStories,
  ...danielStories, ...hoseaStories, ...joelStories, ...amosStories, ...obadiahStories,
  ...jonahStories, ...micahStories, ...nahumStories, ...habakkukStories, ...zephaniahStories,
  ...haggaiStories, ...zechariahStories, ...malachiStories,
  ...matthewStories, ...markStories, ...lukeStories, ...johnStories, ...actsStories,
  ...romansStories, ...corinthians1Stories, ...ephesiansStories, ...philippiansStories,
  ...hebrewsStories, ...revelationStories
];

// Get stories by volume
export const getStoriesByVolume = (volume: string): BiblicalStory[] => {
  return allStories.filter(s => s.volume === volume);
};

// Get stories by category
export const getStoriesByCategory = (category: string): BiblicalStory[] => {
  return allStories.filter(s => s.category === category);
};

// Get all unique categories
export const getCategories = (): string[] => {
  return [...new Set(allStories.map(s => s.category))];
};

// Get all unique volumes
export const getVolumes = (): string[] => {
  return [...new Set(allStories.map(s => s.volume))];
};

// Search stories
export const searchStories = (query: string): BiblicalStory[] => {
  const lowerQuery = query.toLowerCase();
  return allStories.filter(s => 
    s.title.toLowerCase().includes(lowerQuery) ||
    s.summary.toLowerCase().includes(lowerQuery) ||
    s.reference.toLowerCase().includes(lowerQuery) ||
    s.keyFigures?.some(f => f.toLowerCase().includes(lowerQuery))
  );
};

// Story of the Day function - rotates through all stories based on day of year
export function getStoryOfTheDay(): BiblicalStory {
  const startOfYear = new Date(new Date().getFullYear(), 0, 0);
  const diff = new Date().getTime() - startOfYear.getTime();
  const dayOfYear = Math.floor(diff / (1000 * 60 * 60 * 24));
  const storyIndex = dayOfYear % allStories.length;
  return allStories[storyIndex];
}
