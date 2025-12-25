// Biblical Story Room Library - Complete Encyclopedia
// Based on Phototheology Story Room methodology from the uploaded document

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
  storyNumber: number;
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
export const genesisStoriesComplete: BiblicalStory[] = [
  {
    id: "creation",
    storyNumber: 1,
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
    storyNumber: 2,
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
      { element: "Tree of Knowledge", christApplication: "Forbidden wisdom apart from God" },
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
    storyNumber: 3,
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
    storyNumber: 4,
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
    storyNumber: 5,
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
    storyNumber: 6,
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
    storyNumber: 7,
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
    storyNumber: 8,
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
    storyNumber: 9,
    title: "Melchizedek",
    reference: "Genesis 14:17-24",
    volume: "Genesis",
    category: "Patriarchs",
    summary: "After Abraham rescues Lot from the four kings, Melchizedek, king of Salem and priest of the Most High God, brings bread and wine and blesses Abraham. Abraham gives him a tithe of all. The king of Sodom offers Abraham the goods; Abraham refuses, taking nothing lest Sodom claim credit for his wealth.",
    keyElements: [
      "King of Salem = King of Peace",
      "Priest of Most High God",
      "Brought bread and wine",
      "Blessed Abraham",
      "\"Possessor of heaven and earth\"",
      "Abraham gives tithe",
      "No genealogy given",
      "Abraham refuses Sodom's goods"
    ],
    christPattern: [
      { element: "King-Priest", christApplication: "Christ is both King and Priest" },
      { element: "Salem (Peace)", christApplication: "Prince of Peace" },
      { element: "Bread and wine", christApplication: "Lord's Supper" },
      { element: "No genealogy", christApplication: "Eternal priesthood" },
      { element: "Blesses Abraham", christApplication: "Greater blesses lesser" },
      { element: "Receives tithe", christApplication: "Worthy of worship" },
      { element: "Most High God", christApplication: "Christ is Most High" }
    ],
    dimensions: {
      literal: "Historical encounter",
      christ: "Christ is our Melchizedek—eternal King-Priest",
      personal: "I tithe to acknowledge Christ's lordship",
      church: "Christ is Head of the church, our High Priest",
      heavenFuture: "Christ reigns as King-Priest forever",
      heavenPast: "Christ's eternal priesthood"
    },
    relatedStories: [
      "Psalm 110:4 (Priest forever after order of Melchizedek)",
      "Hebrews 5-7 (Melchizedek priesthood explained)",
      "Matthew 26:26-28 (Bread and wine)"
    ],
    keyFigures: ["Melchizedek", "Abraham", "King of Sodom"],
    setting: "Valley of Shaveh (King's Valley)"
  },
  {
    id: "covenant-pieces",
    storyNumber: 10,
    title: "Covenant of Pieces",
    reference: "Genesis 15",
    volume: "Genesis",
    category: "Patriarchs",
    summary: "God promises Abraham a son from his own body and descendants as numerous as stars. Abraham believes, and it is counted to him as righteousness. God confirms the covenant through a ceremony: Abraham prepares animals cut in pieces, drives away birds of prey. Deep sleep and horror fall on him. God reveals 400 years of bondage and deliverance. A smoking furnace and burning lamp pass through the pieces.",
    keyElements: [
      "\"Fear not, I am your shield\"",
      "Son from own body",
      "Stars as descendants",
      "Believed → righteousness",
      "Heifer, goat, ram, dove, pigeon",
      "Birds of prey driven away",
      "Deep sleep and horror",
      "400 years prophecy",
      "Smoking furnace (affliction)",
      "Burning lamp (presence)",
      "God passes through pieces",
      "Land promised"
    ],
    christPattern: [
      { element: "Fear not", christApplication: "Christ gives peace" },
      { element: "Shield and reward", christApplication: "Christ is our shield" },
      { element: "Righteousness by faith", christApplication: "Justification by faith" },
      { element: "Animals divided", christApplication: "Christ's body broken" },
      { element: "Deep sleep", christApplication: "Death" },
      { element: "Smoking furnace", christApplication: "Suffering endured" },
      { element: "Burning lamp", christApplication: "Light in darkness" },
      { element: "God passes through", christApplication: "God alone upholds covenant" },
      { element: "400 years bondage", christApplication: "Prophetic timeline" }
    ],
    dimensions: {
      literal: "Historical covenant ceremony",
      christ: "Christ alone keeps covenant, passes through death",
      personal: "I believe and it is counted as righteousness",
      church: "The church receives the promise by faith",
      heavenFuture: "Promise of land and descendants fulfilled",
      heavenPast: "Everlasting covenant"
    },
    relatedStories: [
      "Romans 4 (Abraham believed)",
      "Galatians 3:6-9 (Righteousness by faith)",
      "Jeremiah 34:18-19 (Covenant ceremony)",
      "Hebrews 6:13-20 (God's oath)"
    ],
    keyFigures: ["Abraham", "God"],
    setting: "Canaan, night vision"
  },
  {
    id: "hagar-ishmael",
    storyNumber: 11,
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
    storyNumber: 12,
    title: "Sodom and Gomorrah",
    reference: "Genesis 18-19",
    volume: "Genesis",
    category: "Patriarchs",
    summary: "Three visitors come to Abraham at Mamre; he shows hospitality. The LORD reveals Sodom's coming judgment. Abraham intercedes, bargaining from 50 to 10 righteous. Two angels go to Sodom; Lot shows hospitality. Sodomites surround the house seeking the visitors. Angels strike them blind, urge Lot to flee. Lot's wife looks back, becomes pillar of salt. Fire and brimstone destroy cities.",
    keyElements: [
      "Three visitors at Mamre",
      "Sarah laughs at promise",
      "\"Shall I hide from Abraham?\"",
      "Outcry against Sodom",
      "Abraham's intercession (50 down to 10)",
      "Angels in Sodom",
      "Lot's hospitality",
      "Sodomites' wickedness",
      "Angels strike blind",
      "\"Flee, don't look back\"",
      "Lot's wife pillar of salt",
      "Fire and brimstone"
    ],
    christPattern: [
      { element: "Three visitors", christApplication: "Divine visitation" },
      { element: "Hospitality rewarded", christApplication: "Entertained angels unawares" },
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
    id: "binding-of-isaac",
    storyNumber: 13,
    title: "The Binding of Isaac",
    reference: "Genesis 22",
    volume: "Genesis",
    category: "Patriarchs",
    summary: "God tests Abraham: \"Take your only son Isaac to Moriah and offer him as burnt offering.\" Abraham rises early, takes Isaac, travels three days. Isaac carries wood; Abraham carries fire and knife. Isaac asks, \"Where is the lamb?\" Abraham: \"God will provide Himself a lamb.\" At the altar, Abraham binds Isaac and raises the knife. Angel stops him. Ram caught in thicket offered instead. Place named Jehovah-Jireh: \"The LORD will provide.\"",
    keyElements: [
      "\"Take your son, your only son\"",
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
      "Romans 8:32 (Spared not His own Son)",
      "Hebrews 11:17-19 (By faith Abraham offered)"
    ],
    keyFigures: ["Abraham", "Isaac", "Angel of the LORD"],
    setting: "Mount Moriah"
  },
  {
    id: "rebekah-at-well",
    storyNumber: 14,
    title: "Rebekah at the Well",
    reference: "Genesis 24",
    volume: "Genesis",
    category: "Patriarchs",
    summary: "Abraham sends his servant to find a wife for Isaac from his kindred. The servant prays for a sign: the woman who offers water for him and his camels will be the chosen one. Rebekah appears, does exactly that. The servant gives gifts, asks about lodging. At her home, he tells his mission. Rebekah's family agrees. Asked if she will go, Rebekah says, \"I will go.\" She travels to Canaan. Isaac is meditating in the field at evening. Rebekah sees him, dismounts, covers herself with a veil. Isaac brings her into his mother's tent; she becomes his wife.",
    keyElements: [
      "Abraham sends servant (Eliezer = \"God helps\")",
      "Oath: not a Canaanite wife",
      "Prayer for specific sign",
      "Rebekah's hospitality and service",
      "Nose ring and bracelets given",
      "Servant tells his mission",
      "\"I will go\"",
      "10 camels = complete testimony",
      "Isaac meditating in field",
      "Rebekah covers with veil",
      "Isaac comforted after mother's death"
    ],
    christPattern: [
      { element: "Abraham (Father)", christApplication: "The Father" },
      { element: "Isaac (Bridegroom)", christApplication: "Christ the Bridegroom" },
      { element: "Servant (Spirit)", christApplication: "Holy Spirit" },
      { element: "Rebekah (Bride)", christApplication: "The Bride/Church" },
      { element: "Journey to far country", christApplication: "Spirit goes to gather bride" },
      { element: "Gifts given", christApplication: "Spiritual gifts" },
      { element: "\"I will go\"", christApplication: "Response to gospel call" },
      { element: "Veil", christApplication: "Reverence for Bridegroom" },
      { element: "Brought to Isaac", christApplication: "Bride presented to Christ" }
    ],
    dimensions: {
      literal: "Isaac's bride found",
      christ: "The Father sends the Spirit to gather a bride for the Son",
      personal: "Will I say \"I will go\" when called?",
      church: "The church is being gathered as Christ's bride",
      heavenFuture: "Marriage Supper of the Lamb",
      heavenPast: "God seeks those who will choose Him"
    },
    relatedStories: [
      "Ephesians 5:25-32 (Christ and the church)",
      "Revelation 19:7-9 (Marriage of the Lamb)",
      "2 Corinthians 11:2 (Presented as pure virgin)",
      "John 14:16-18 (Spirit sent)"
    ],
    keyFigures: ["Abraham", "Servant (Eliezer)", "Rebekah", "Isaac", "Laban"],
    setting: "Canaan to Mesopotamia and back"
  },
  {
    id: "jacob-esau-birthright",
    storyNumber: 15,
    title: "Jacob and Esau: The Birthright",
    reference: "Genesis 25:19-34",
    volume: "Genesis",
    category: "Patriarchs",
    summary: "Rebekah is barren; Isaac prays. She conceives twins who struggle in the womb. God reveals: \"Two nations, the elder shall serve the younger.\" Esau born first (red, hairy), Jacob grasping his heel. Esau becomes a hunter; Jacob, a quiet dweller in tents. Isaac loves Esau; Rebekah loves Jacob. Esau returns famished from hunting. Jacob has stew. Esau sells his birthright for a meal. \"Thus Esau despised his birthright.\"",
    keyElements: [
      "Barrenness and prayer",
      "Twins struggle in womb",
      "\"Two nations... elder serves younger\"",
      "Esau = \"hairy,\" also Edom = \"red\"",
      "Jacob = \"heel-catcher\" or \"supplanter\"",
      "Hunter vs. tent-dweller",
      "Divided parental affection",
      "Red stew",
      "\"I am at the point of death\"",
      "Sold birthright for one meal",
      "Esau \"despised\" birthright"
    ],
    christPattern: [
      { element: "Younger over elder", christApplication: "Grace overturns natural order" },
      { element: "Struggle from womb", christApplication: "Conflict between flesh and Spirit" },
      { element: "Esau (flesh)", christApplication: "Those who live by flesh" },
      { element: "Jacob (chosen)", christApplication: "Election by grace" },
      { element: "Birthright sold", christApplication: "Forfeiting eternal for temporal" }
    ],
    dimensions: {
      literal: "Historical birth and transaction",
      christ: "Christ reverses the curse; the humble exalted",
      personal: "Do I value my spiritual birthright or trade it for earthly pleasures?",
      church: "Spiritual Israel over natural Israel",
      heavenFuture: "The meek inherit the earth",
      heavenPast: "Choice between eternal and temporal"
    },
    relatedStories: [
      "Romans 9:10-13 (Jacob I loved, Esau I hated)",
      "Hebrews 12:16-17 (Profane person like Esau)",
      "Malachi 1:2-3 (Jacob loved, Esau hated)"
    ],
    keyFigures: ["Isaac", "Rebekah", "Jacob", "Esau"],
    setting: "Canaan"
  },
  {
    id: "jacob-stolen-blessing",
    storyNumber: 16,
    title: "Jacob's Stolen Blessing",
    reference: "Genesis 27",
    volume: "Genesis",
    category: "Patriarchs",
    summary: "Isaac, old and blind, prepares to bless Esau. Rebekah overhears, plots with Jacob to deceive Isaac. Jacob wears Esau's clothes and goatskins on his hands and neck. He brings savory food. Isaac is suspicious: \"The voice is Jacob's, but the hands are Esau's.\" He blesses Jacob with dew, fatness, dominion over brothers. Esau returns, discovers the deception, cries bitterly. Isaac cannot reverse the blessing. Esau vows to kill Jacob. Rebekah sends Jacob to Laban.",
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
    storyNumber: 17,
    title: "Jacob's Ladder",
    reference: "Genesis 28:10-22",
    volume: "Genesis",
    category: "Patriarchs",
    summary: "Jacob flees to Haran, stops at Bethel, uses a stone for a pillow. He dreams of a ladder from earth to heaven with angels ascending and descending. The Lord stands above, reaffirms the Abrahamic covenant. Jacob wakes: \"Surely the Lord is in this place.\" He sets up the stone as a pillar, pours oil, names it Bethel (\"House of God\"), and vows to tithe.",
    keyElements: [
      "Flight from Esau",
      "Stone pillow",
      "Ladder reaching heaven",
      "Angels ascending and descending",
      "Lord stands above",
      "Promise reaffirmed: land, seed, blessing",
      "\"I am with you... will bring you back\"",
      "\"The Lord is in this place\"",
      "\"Gate of heaven\"",
      "Stone anointed",
      "Bethel (\"House of God\")",
      "Tithe vow"
    ],
    christPattern: [
      { element: "Ladder", christApplication: "Christ connects heaven and earth (John 1:51)" },
      { element: "Angels ascending/descending", christApplication: "Ministry of angels through Christ" },
      { element: "Stone pillow → pillar", christApplication: "Christ the Rock, Cornerstone" },
      { element: "Oil poured", christApplication: "Anointing of Christ" },
      { element: "Bethel", christApplication: "Church is God's house" },
      { element: "\"With you always\"", christApplication: "Christ's promise (Matt 28:20)" }
    ],
    dimensions: {
      literal: "Jacob's dream and vow",
      christ: "Christ is the ladder—the only access to heaven",
      personal: "Even in my flight from failure, God meets me",
      church: "The church is the house of God, gate of heaven",
      heavenFuture: "Open access to heaven through Christ",
      heavenPast: "Communication between heaven and earth"
    },
    relatedStories: [
      "John 1:51 (Angels ascending and descending on Son of Man)",
      "1 Timothy 2:5 (One mediator)",
      "Hebrews 10:19-22 (Access through the veil)"
    ],
    keyFigures: ["Jacob", "God", "Angels"],
    setting: "Bethel (Luz)"
  },
  {
    id: "jacob-serves-rachel",
    storyNumber: 18,
    title: "Jacob Serves for Rachel",
    reference: "Genesis 29-30",
    volume: "Genesis",
    category: "Patriarchs",
    summary: "Jacob arrives in Haran, meets Rachel at the well, rolls away the stone, waters the sheep, kisses her, weeps. He stays with Laban, agrees to serve seven years for Rachel. After seven years, Laban substitutes Leah on the wedding night. Jacob works seven more years for Rachel. The sisters compete through childbearing. Leah bears Reuben, Simeon, Levi, Judah. Rachel gives Bilhah who bears Dan, Naphtali. Leah gives Zilpah who bears Gad, Asher. Leah bears Issachar, Zebulun, Dinah. Finally Rachel bears Joseph.",
    keyElements: [
      "Stone on well",
      "Jacob rolls stone away",
      "Waters the flock",
      "Kisses Rachel, weeps",
      "Seven years \"seemed but a few days for the love he had\"",
      "Laban's deception with Leah",
      "Seven more years",
      "Twelve sons born (plus Dinah)",
      "Competition between wives",
      "Joseph born to Rachel"
    ],
    christPattern: [
      { element: "Stone rolled away", christApplication: "Christ removes barrier" },
      { element: "Waters the flock", christApplication: "Christ gives living water" },
      { element: "Serves for bride", christApplication: "Christ serves, gives Himself for church" },
      { element: "Deception endured", christApplication: "Christ endured injustice" },
      { element: "Two sets of seven years", christApplication: "Complete service" },
      { element: "Twelve sons", christApplication: "Twelve tribes, twelve apostles" }
    ],
    dimensions: {
      literal: "Jacob's marriages and children",
      christ: "Christ serves and suffers for His bride",
      personal: "Are we willing to serve for what we love?",
      church: "Christ labors for the church through trials",
      heavenFuture: "The twelve tribes, New Jerusalem",
      heavenPast: "God builds His people"
    },
    relatedStories: [
      "Ephesians 5:25 (Christ loved the church and gave Himself)",
      "Revelation 7:4-8 (Twelve tribes sealed)",
      "Revelation 21:12-14 (Twelve gates, twelve foundations)"
    ],
    keyFigures: ["Jacob", "Rachel", "Leah", "Laban", "Bilhah", "Zilpah"],
    setting: "Haran (Paddan-aram)"
  },
  {
    id: "jacob-wrestles-god",
    storyNumber: 19,
    title: "Jacob Wrestles with God",
    reference: "Genesis 32:22-32",
    volume: "Genesis",
    category: "Patriarchs",
    summary: "Jacob, returning to Canaan, sends gifts ahead to appease Esau. He sends family across Jabbok, remains alone. A Man wrestles with him until daybreak. Unable to prevail, the Man touches Jacob's hip, dislocating it. Jacob refuses to let go without a blessing. He receives a new name: Israel (\"prevails with God\"). Jacob names the place Peniel (\"Face of God\"), saying, \"I have seen God face to face and lived.\" He limps away as the sun rises.",
    keyElements: [
      "Night before meeting Esau",
      "Alone at Jabbok (\"to pour out\")",
      "Wrestling till daybreak",
      "Hip touched, dislocated",
      "\"Let me go, for the day breaks\"",
      "\"I will not let you go except you bless me\"",
      "\"What is your name?\"—\"Jacob\" (supplanter)",
      "New name: Israel (\"prince with God\" / \"prevails\")",
      "Jacob asks the Man's name",
      "Peniel = \"Face of God\"",
      "\"Seen God face to face\"",
      "Limping at sunrise",
      "Hollow of thigh not eaten"
    ],
    christPattern: [
      { element: "Wrestling", christApplication: "Gethsemane—wrestling with God" },
      { element: "Alone at night", christApplication: "Christ alone in trial" },
      { element: "Prevailing through clinging", christApplication: "Faith that holds on" },
      { element: "Wounded", christApplication: "Christ wounded in victory" },
      { element: "New name", christApplication: "New identity through Christ" },
      { element: "Sunrise", christApplication: "Resurrection morning" }
    ],
    dimensions: {
      literal: "Jacob's transformation",
      christ: "Christ's Gethsemane, wrestling to accept the cup",
      personal: "I must wrestle with God and be transformed",
      church: "Jacob's Time of Trouble—church wrestles through tribulation",
      heavenFuture: "God's people pass through final time of trouble",
      heavenPast: "Struggle and victory"
    },
    relatedStories: [
      "Hosea 12:3-4 (Wept and made supplication)",
      "Matthew 26:36-46 (Gethsemane)",
      "Daniel 12:1 (Time of trouble)",
      "Revelation 3:12 (New name)"
    ],
    keyFigures: ["Jacob/Israel", "The Man (God/Angel)"],
    setting: "Jabbok river ford"
  },
  {
    id: "joseph-story",
    storyNumber: 20,
    title: "Joseph's Story",
    reference: "Genesis 37-50",
    volume: "Genesis",
    category: "Patriarchs",
    summary: "Joseph, beloved son of Jacob, receives a special coat and dreams of family bowing to him. His brothers hate him, sell him into slavery. In Egypt, he rises in Potiphar's house, resists temptation, is falsely accused, imprisoned. He interprets dreams for cupbearer and baker. After two years, he interprets Pharaoh's dreams of famine, is exalted to second in command. During famine, his brothers come to buy grain. After testing them, Joseph reveals himself, weeps, forgives, and brings the family to Egypt. Before dying, Joseph prophesies the exodus.",
    keyElements: [
      "Coat of many colors (or long-sleeved robe)",
      "Dreams: sheaves bow, sun/moon/stars bow",
      "Brothers' hatred",
      "\"Here comes the dreamer\"",
      "Stripped of coat",
      "Cast into pit",
      "Sold for 20 pieces of silver",
      "Coat dipped in blood",
      "Potiphar's house: \"The Lord was with Joseph\"",
      "Resists Potiphar's wife",
      "Falsely accused, imprisoned",
      "Interprets butler and baker's dreams",
      "Butler forgets him (two years)",
      "Pharaoh's dreams: seven fat/lean cows, seven full/thin ears",
      "Exalted at age 30",
      "Given Gentile bride Asenath",
      "Sons: Manasseh, Ephraim",
      "Brothers don't recognize him",
      "Silver cup in Benjamin's sack",
      "Judah's substitutionary offer",
      "\"I am Joseph\"",
      "\"You meant evil, but God meant good\"",
      "Jacob's family (70 souls) to Egypt",
      "Joseph dies at 110, prophesies exodus"
    ],
    christPattern: [
      { element: "Beloved son", christApplication: "Beloved Son" },
      { element: "Sent by father", christApplication: "Sent by Father" },
      { element: "Brothers hate him", christApplication: "His own received Him not" },
      { element: "Stripped of robe", christApplication: "Garments divided" },
      { element: "Cast into pit", christApplication: "Descended to grave" },
      { element: "Sold for silver", christApplication: "Sold for 30 pieces" },
      { element: "Falsely accused", christApplication: "Falsely accused" },
      { element: "Between two prisoners", christApplication: "Between two thieves" },
      { element: "Exalted at age 30", christApplication: "Began ministry at 30" },
      { element: "Given Gentile bride", christApplication: "Christ receives Gentile bride" },
      { element: "Saves the world", christApplication: "Savior of the world" },
      { element: "Brothers don't recognize", christApplication: "Jews don't recognize Messiah" },
      { element: "Reveals at second meeting", christApplication: "Second Coming recognition" },
      { element: "Weeps over brothers", christApplication: "Christ weeps over Jerusalem" },
      { element: "\"I am Joseph\"", christApplication: "\"It is I; be not afraid\"" },
      { element: "Evil meant for good", christApplication: "Cross meant for evil, God's plan" }
    ],
    dimensions: {
      literal: "Historical account of Joseph",
      christ: "Christ as rejected, exalted Savior",
      personal: "God can use my suffering for good",
      church: "The church is preserved through Christ",
      heavenFuture: "Christ revealed to His brethren",
      heavenPast: "Plan of salvation laid from foundation"
    },
    relatedStories: [
      "John 3:16 (God gave His only Son)",
      "Romans 8:28 (All things work for good)",
      "Acts 7:9-16 (Stephen recounts)",
      "Hebrews 11:22 (By faith Joseph)"
    ],
    keyFigures: ["Joseph", "Jacob", "Brothers (esp. Judah, Benjamin)", "Potiphar", "Pharaoh"],
    setting: "Canaan, Egypt"
  }
];

// Volume II: Exodus Stories
export const exodusStoriesComplete: BiblicalStory[] = [
  {
    id: "moses-life",
    storyNumber: 21,
    title: "Moses' Life and Call",
    reference: "Exodus 1-4",
    volume: "Exodus",
    category: "Deliverance",
    summary: "Israel multiplies in Egypt; a new Pharaoh enslaves them. Hebrew midwives spare baby boys. Moses is born, hidden three months, placed in ark of bulrushes. Pharaoh's daughter finds him, raises him as prince. At 40, Moses kills an Egyptian defending a Hebrew, flees to Midian. He becomes a shepherd, marries Zipporah. At 80, God appears in the burning bush, calls him to deliver Israel. Moses objects; God gives signs and sends Aaron as spokesman.",
    keyElements: [
      "Israel multiplies, Pharaoh fears",
      "Midwives Shiphrah and Puah",
      "Decree to kill baby boys",
      "Moses hidden three months",
      "Ark of bulrushes",
      "Pharaoh's daughter adopts",
      "Moses kills Egyptian",
      "Flees to Midian",
      "Shepherd for 40 years",
      "Burning bush",
      "\"I AM WHO I AM\"",
      "Moses' objections",
      "Rod becomes serpent",
      "Hand becomes leprous",
      "Aaron appointed"
    ],
    christPattern: [
      { element: "Delivered from death as infant", christApplication: "Christ delivered from Herod" },
      { element: "Raised in palace, identified with slaves", christApplication: "Christ left glory, became servant" },
      { element: "Rejected by brethren first time", christApplication: "Christ rejected at first coming" },
      { element: "Good Shepherd", christApplication: "Christ the Good Shepherd" },
      { element: "Burning bush", christApplication: "Deity in humanity (burns, not consumed)" },
      { element: "\"I AM\"", christApplication: "Christ's \"I AM\" statements" },
      { element: "Deliverer of Israel", christApplication: "Christ delivers from sin" }
    ],
    dimensions: {
      literal: "Moses' life and call",
      christ: "Christ's incarnation, rejection, call to deliver",
      personal: "God calls me from my \"Egypt,\" uses my past",
      church: "Church called to deliver the oppressed",
      heavenFuture: "Final deliverance from bondage",
      heavenPast: "God's plan to rescue His people"
    },
    relatedStories: [
      "Acts 7:17-36 (Stephen's account)",
      "Hebrews 11:23-27 (By faith Moses)",
      "Deuteronomy 18:15-18 (Prophet like Moses)"
    ],
    keyFigures: ["Moses", "Pharaoh", "Pharaoh's daughter", "Jochebed", "Miriam", "Zipporah", "Aaron"],
    setting: "Egypt, Midian"
  },
  {
    id: "ten-plagues",
    storyNumber: 22,
    title: "The Ten Plagues",
    reference: "Exodus 7-12",
    volume: "Exodus",
    category: "Deliverance",
    summary: "Moses and Aaron confront Pharaoh: \"Let my people go.\" Pharaoh's heart hardens. God sends ten plagues, each targeting Egyptian gods. Magicians replicate some signs but fail as plagues intensify. Goshen is spared from plague four onward. The tenth plague—death of firstborn—breaks Pharaoh. Israel applies blood to doorposts and lintels; the destroyer passes over. Egypt thrusts them out with silver and gold.",
    keyElements: [
      "1. Water to blood (Nile/Hapi)",
      "2. Frogs (Heqet)",
      "3. Lice/Gnats (Geb)",
      "4. Flies (Khepri) - Goshen spared",
      "5. Livestock disease (Apis)",
      "6. Boils (Imhotep)",
      "7. Hail (Nut)",
      "8. Locusts (Seth)",
      "9. Darkness (Ra)",
      "10. Death of firstborn (Pharaoh)",
      "Passover lamb chosen 10th day",
      "Kept until 14th day",
      "Slain at twilight",
      "Blood on doorposts and lintel",
      "Roasted with fire",
      "Unleavened bread, bitter herbs",
      "Eaten in haste",
      "\"When I see the blood, I will pass over\""
    ],
    christPattern: [
      { element: "Lamb without blemish", christApplication: "Sinless Christ" },
      { element: "Chosen on 10th", christApplication: "Triumphal entry" },
      { element: "Kept until 14th", christApplication: "Examined, found faultless" },
      { element: "Slain at twilight", christApplication: "Christ dies at 3 PM" },
      { element: "Blood applied", christApplication: "Atonement applied by faith" },
      { element: "Roasted with fire", christApplication: "Judgment endured" },
      { element: "Not a bone broken", christApplication: "John 19:36" },
      { element: "Bitter herbs", christApplication: "Suffering" },
      { element: "Unleavened bread", christApplication: "Sinlessness" },
      { element: "Eaten standing", christApplication: "Ready for departure" }
    ],
    dimensions: {
      literal: "Historical plagues and deliverance",
      christ: "Christ is our Passover Lamb (1 Cor 5:7)",
      personal: "I apply the blood; judgment passes over me",
      church: "Church under the blood, freed from bondage",
      heavenFuture: "Seven last plagues; God's people protected",
      heavenPast: "Judgment on rebellion"
    },
    relatedStories: [
      "1 Corinthians 5:7 (Christ our Passover)",
      "John 19:36 (Not a bone broken)",
      "Revelation 15-16 (Seven last plagues)",
      "Hebrews 11:28 (By faith he kept the passover)"
    ],
    keyFigures: ["Moses", "Aaron", "Pharaoh", "Egyptian magicians"],
    setting: "Egypt"
  },
  {
    id: "red-sea-crossing",
    storyNumber: 23,
    title: "Crossing the Red Sea",
    reference: "Exodus 14-15",
    volume: "Exodus",
    category: "Deliverance",
    summary: "Pharaoh pursues Israel to the Red Sea. Israel, trapped between the sea and Egyptian army, cries out. God says, \"Stand still and see salvation.\" Moses stretches rod; east wind divides the sea. Israel crosses on dry ground, walls of water on each side. Pillar of cloud/fire moves behind, blocking Egypt. Egyptians pursue; God troubles them, wheels come off chariots. At dawn, Moses stretches hand; waters return, drowning Pharaoh's army. Israel sings the Song of Moses.",
    keyElements: [
      "Pillar of cloud and fire",
      "\"Stand still and see the salvation of the Lord\"",
      "\"The Lord shall fight for you\"",
      "\"Speak to the children of Israel that they go forward\"",
      "Moses' rod stretched over sea",
      "Strong east wind all night",
      "Waters divided",
      "Dry ground through the sea",
      "Walls of water on right and left",
      "Pillar moves to rear guard",
      "Egyptians pursue",
      "\"God looked through the pillar\"",
      "Wheels off chariots",
      "Waters return at dawn",
      "Egyptians dead on shore",
      "Song of Moses (Exodus 15)",
      "\"Who is like You, O Lord?\"",
      "Miriam's timbrel and dancing"
    ],
    christPattern: [
      { element: "Trapped, no way out", christApplication: "Sin's bondage" },
      { element: "\"Stand still\"", christApplication: "Cease from works" },
      { element: "Rod stretched", christApplication: "Cross" },
      { element: "Sea divided", christApplication: "Way of salvation opened" },
      { element: "Dry ground", christApplication: "Safe passage" },
      { element: "Walls of water", christApplication: "Judgment held back" },
      { element: "Pillar protects", christApplication: "Christ between us and enemy" },
      { element: "Enemies destroyed", christApplication: "Victory over sin" },
      { element: "Baptism", christApplication: "Buried in water, rise to new life" },
      { element: "Morning victory", christApplication: "Resurrection morning" },
      { element: "Song of victory", christApplication: "Triumph praise" }
    ],
    dimensions: {
      literal: "Historical deliverance at the sea",
      christ: "Christ opens the way through death",
      personal: "Baptism—old life drowned, new life begins (1 Cor 10:1-2)",
      church: "Church passes through trials into freedom",
      heavenFuture: "Final deliverance, Song of Moses and Lamb (Rev 15:3)",
      heavenPast: "Victory over Satan's hosts"
    },
    relatedStories: [
      "1 Corinthians 10:1-2 (Baptized unto Moses)",
      "Revelation 15:3 (Song of Moses and Lamb)",
      "Isaiah 43:16-19 (Way through the sea)",
      "Hebrews 11:29 (By faith they passed)"
    ],
    keyFigures: ["Moses", "Miriam", "Israel", "Pharaoh's army"],
    setting: "Red Sea"
  },
  {
    id: "manna-from-heaven",
    storyNumber: 24,
    title: "Manna from Heaven",
    reference: "Exodus 16",
    volume: "Exodus",
    category: "Wilderness",
    summary: "Israel grumbles about hunger in the Wilderness of Sin. God promises bread from heaven. Each morning, manna appears like frost; each evening, quail come. Instructions: gather an omer per person daily; none kept overnight (except Sabbath). Some disobey; it breeds worms. On the sixth day, gather double; it keeps over Sabbath. Some go out on Sabbath anyway—find nothing. God asks, \"How long refuse to keep my commandments?\" Manna described: like coriander seed, white, tasting like wafers with honey.",
    keyElements: [
      "Grumbling against Moses and Aaron",
      "\"Would we had died in Egypt\"",
      "\"I will rain bread from heaven\"",
      "Test of obedience",
      "Morning: manna (\"What is it?\")",
      "Evening: quail",
      "Omer per person",
      "Gathered according to need",
      "Melted in sun",
      "None kept overnight (except Friday)",
      "Double on sixth day",
      "None on Sabbath",
      "\"This is rest, holy Sabbath\"",
      "Kept 40 years",
      "Pot of manna preserved"
    ],
    christPattern: [
      { element: "Bread from heaven", christApplication: "\"I am the Bread of Life\" (John 6)" },
      { element: "Daily provision", christApplication: "Daily dependence on Christ" },
      { element: "Gathered morning", christApplication: "Seek Christ first thing" },
      { element: "Melts in sun", christApplication: "Neglect loses blessing" },
      { element: "Enough for each", christApplication: "Christ sufficient for all" },
      { element: "Hidden manna", christApplication: "Revelation 2:17" },
      { element: "40 years", christApplication: "Full period of testing" }
    ],
    dimensions: {
      literal: "Supernatural provision in wilderness",
      christ: "Christ is the true Bread from heaven (John 6:32-35)",
      personal: "I need daily feeding on Christ; Sabbath rest",
      church: "Three Angels' Messages—present truth, fresh bread",
      heavenFuture: "Hidden manna for overcomers",
      heavenPast: "God sustains His people"
    },
    relatedStories: [
      "John 6:31-58 (Bread of Life discourse)",
      "Revelation 2:17 (Hidden manna)",
      "Deuteronomy 8:3 (Man lives by every word)",
      "Matthew 4:4 (Jesus quotes Deuteronomy)"
    ],
    keyFigures: ["Moses", "Aaron", "Israel"],
    setting: "Wilderness of Sin"
  },
  {
    id: "water-from-rock",
    storyNumber: 25,
    title: "Water from the Rock",
    reference: "Exodus 17:1-7",
    volume: "Exodus",
    category: "Wilderness",
    summary: "At Rephidim, no water. Israel quarrels with Moses: \"Give us water.\" Moses cries, \"They are ready to stone me!\" God instructs Moses to strike the rock at Horeb with the rod. Moses does so before the elders; water flows. The place is named Massah (testing) and Meribah (quarreling).",
    keyElements: [
      "No water at Rephidim",
      "People strive with Moses",
      "\"Why did you bring us up out of Egypt?\"",
      "\"They are almost ready to stone me\"",
      "\"Go before the people\"",
      "\"Take elders with you\"",
      "\"The rod with which you struck the Nile\"",
      "Strike the rock",
      "Water flows from rock",
      "Massah = \"testing\"",
      "Meribah = \"strife\""
    ],
    christPattern: [
      { element: "Rock", christApplication: "Christ is the Rock (1 Cor 10:4)" },
      { element: "Smitten", christApplication: "Christ smitten once" },
      { element: "Water flows", christApplication: "Living water flows" },
      { element: "Rod of judgment", christApplication: "Christ bore judgment" },
      { element: "Satisfies thirst", christApplication: "\"If anyone thirsts, come to me\"" }
    ],
    dimensions: {
      literal: "Miraculous water provision",
      christ: "Christ the smitten Rock gives living water",
      personal: "I drink from Christ; He satisfies my thirst",
      church: "The church brings living water to the world",
      heavenFuture: "River of water of life (Rev 22)",
      heavenPast: "Christ ordained as source of life"
    },
    relatedStories: [
      "1 Corinthians 10:4 (That Rock was Christ)",
      "John 7:37-39 (Rivers of living water)",
      "John 4:10-14 (Living water)",
      "Numbers 20:7-12 (Second striking—Moses' sin)"
    ],
    keyFigures: ["Moses", "Elders of Israel"],
    setting: "Rephidim (Horeb)"
  },
  {
    id: "mount-sinai-law",
    storyNumber: 26,
    title: "Mount Sinai and the Law",
    reference: "Exodus 19-20",
    volume: "Exodus",
    category: "Covenant",
    summary: "Israel camps at Sinai. God offers covenant: \"You shall be a kingdom of priests, a holy nation.\" People agree. Three days of consecration; boundaries set around mountain. On the third day: thunder, lightning, thick cloud, trumpet, mountain smoking with fire, earthquake. God descends. Moses goes up. God speaks the Ten Commandments audibly to all Israel. People tremble, stand far off, ask Moses to be mediator.",
    keyElements: [
      "Third month after Exodus",
      "\"You have seen what I did to Egypt\"",
      "\"Bore you on eagles' wings\"",
      "\"Obey my voice, keep my covenant\"",
      "\"Kingdom of priests, holy nation\"",
      "\"All that the Lord has spoken we will do\"",
      "Three days of sanctification",
      "Wash garments",
      "Boundaries at mountain base",
      "Third day: thunders, lightning, cloud",
      "Trumpet exceeding loud",
      "Mountain smoking like furnace",
      "Ten Commandments spoken",
      "People afraid, stand far off",
      "\"Let not God speak to us, lest we die\"",
      "Moses as mediator"
    ],
    christPattern: [
      { element: "Mountain on fire", christApplication: "God's holiness" },
      { element: "Thunder, lightning", christApplication: "Majesty" },
      { element: "Law spoken", christApplication: "Word made flesh" },
      { element: "Moses mediator", christApplication: "Christ our Mediator" },
      { element: "Kingdom of priests", christApplication: "1 Peter 2:9" },
      { element: "\"We will obey\"", christApplication: "New covenant promise" },
      { element: "Third day", christApplication: "Resurrection" }
    ],
    dimensions: {
      literal: "Historical law-giving at Sinai",
      christ: "Christ magnifies the law (Matt 5)",
      personal: "The law shows my need for Christ",
      church: "Pentecost at Sinai parallel—Spirit writes law on heart",
      heavenFuture: "Law is foundation of God's government",
      heavenPast: "Law existed before Sinai"
    },
    relatedStories: [
      "Deuteronomy 5 (Law repeated)",
      "Hebrews 12:18-24 (Sinai vs. Zion)",
      "Acts 2 (Pentecost parallels)",
      "Jeremiah 31:31-34 (New covenant)"
    ],
    keyFigures: ["Moses", "God", "Israel"],
    setting: "Mount Sinai"
  },
  {
    id: "golden-calf",
    storyNumber: 27,
    title: "The Golden Calf",
    reference: "Exodus 32",
    volume: "Exodus",
    category: "Apostasy",
    summary: "Moses delays on the mountain 40 days. People pressure Aaron: \"Make us gods.\" Aaron collects gold earrings, fashions a calf, declares a feast to the Lord. They sacrifice, eat, drink, and \"rise up to play.\" God tells Moses what happened: \"Your people have corrupted themselves.\" Moses descends with two tablets. Hearing revelry, he throws down tablets, breaking them. Burns the calf, grinds it to powder, scatters on water, makes Israel drink. Aaron blames the people. Moses calls, \"Who is on the Lord's side?\" Levites gather, execute 3,000 idolaters.",
    keyElements: [
      "\"Moses delays\"",
      "\"Make us gods to go before us\"",
      "\"This Moses, we don't know what happened\"",
      "Aaron makes golden calf",
      "\"These are your gods who brought you up\"",
      "Feast \"to the Lord\" (syncretism)",
      "\"Rose up to play\" (idolatrous revelry)",
      "\"Your people have corrupted themselves\"",
      "Moses intercedes: \"Blot me out\"",
      "Two tablets of testimony",
      "Tablets broken at mountain base",
      "Calf burned, ground, made to drink",
      "Aaron's excuses",
      "\"Who is on the Lord's side?\"",
      "Levites execute 3,000",
      "Moses returns to intercede"
    ],
    christPattern: [
      { element: "Moses on mountain", christApplication: "Christ in heaven" },
      { element: "People impatient", christApplication: "Church grows weary waiting" },
      { element: "False worship", christApplication: "Apostasy" },
      { element: "Tablets broken", christApplication: "Covenant broken" },
      { element: "Moses intercedes", christApplication: "Christ intercedes" },
      { element: "\"Blot me out\"", christApplication: "Willing to sacrifice for people" },
      { element: "Levites choose God", christApplication: "Remnant faithful" }
    ],
    dimensions: {
      literal: "Historical apostasy at Sinai",
      christ: "Christ remains faithful though church apostatizes",
      personal: "What \"golden calves\" do I create when God seems to delay?",
      church: "Great apostasy during \"delay\" of Second Coming",
      heavenFuture: "Final test—who is on the Lord's side?",
      heavenPast: "Rebellion in heaven during Lucifer's uprising"
    },
    relatedStories: [
      "Psalm 106:19-21 (They made a calf in Horeb)",
      "Acts 7:39-41 (Stephen recounts)",
      "1 Kings 12:28 (Jeroboam repeats the sin)",
      "Romans 1:21-23 (Exchanged glory for image)"
    ],
    keyFigures: ["Moses", "Aaron", "Levites", "Israel"],
    setting: "Mount Sinai"
  },
  {
    id: "tabernacle-construction",
    storyNumber: 28,
    title: "Tabernacle Construction",
    reference: "Exodus 25-31, 35-40",
    volume: "Exodus",
    category: "Sanctuary",
    summary: "God gives Moses detailed instructions for the tabernacle: \"Let them make me a sanctuary that I may dwell among them.\" Every detail matters—pattern shown on the mountain. Willing offerings are gathered. Bezalel and Oholiab, filled with Spirit, lead the work. Each article is crafted: ark, mercy seat, table, lampstand, altar of incense, altar of burnt offering, laver, courtyard. Priestly garments are made. Moses inspects the work. On the first day of the first month, Moses erects the tabernacle. The glory cloud fills it so that Moses cannot enter.",
    keyElements: [
      "\"Let them make me a sanctuary\"",
      "\"According to the pattern\"",
      "Willing offerings: gold, silver, bronze, fabrics, skins, oil, spices",
      "Bezalel and Oholiab filled with Spirit",
      "Ark of the Covenant (Most Holy)",
      "Mercy Seat with cherubim",
      "Table of Showbread (Holy Place)",
      "Golden Lampstand (Holy Place)",
      "Altar of Incense (Holy Place)",
      "Bronze Altar (Courtyard)",
      "Bronze Laver (Courtyard)",
      "Boards of acacia overlaid with gold",
      "Four coverings",
      "Veil between Holy and Most Holy",
      "Priestly garments: ephod, breastplate, robe, turban",
      "Anointing oil, incense",
      "Moses erects tabernacle",
      "Glory cloud fills tabernacle"
    ],
    christPattern: [
      { element: "Sanctuary = dwelling", christApplication: "God dwells with us (Emmanuel)" },
      { element: "Pattern from heaven", christApplication: "Christ the true Tabernacle" },
      { element: "Ark", christApplication: "Throne of grace" },
      { element: "Mercy seat", christApplication: "Propitiation" },
      { element: "Showbread", christApplication: "Bread of Life" },
      { element: "Lampstand", christApplication: "Light of the World" },
      { element: "Incense", christApplication: "Christ's intercession" },
      { element: "Bronze altar", christApplication: "Cross" },
      { element: "Laver", christApplication: "Cleansing, baptism" },
      { element: "Veil", christApplication: "Christ's flesh (Heb 10:20)" },
      { element: "High Priest garments", christApplication: "Christ's offices" },
      { element: "Glory fills", christApplication: "Shekinah = Christ's presence" }
    ],
    dimensions: {
      literal: "Historical construction of tabernacle",
      christ: "Christ is the true sanctuary (Heb 8-9)",
      personal: "My body is God's temple",
      church: "The church is being built as God's dwelling",
      heavenFuture: "Heavenly sanctuary, no temple needed (Rev 21:22)",
      heavenPast: "Original sanctuary in heaven"
    },
    relatedStories: [
      "Hebrews 8-9 (True tabernacle in heaven)",
      "John 1:14 (Word became flesh, \"tabernacled\")",
      "1 Corinthians 6:19 (Body is temple)",
      "Revelation 21:3 (Tabernacle of God with men)"
    ],
    keyFigures: ["Moses", "Bezalel", "Oholiab", "Aaron and sons"],
    setting: "Wilderness of Sinai"
  }
];

// Combine all stories
export const allStoriesComplete: BiblicalStory[] = [
  ...genesisStoriesComplete,
  ...exodusStoriesComplete
];

// Helper functions
export function getVolumesComplete(): string[] {
  const volumes = new Set(allStoriesComplete.map(s => s.volume));
  return Array.from(volumes);
}

export function getStoriesByVolumeComplete(volume: string): BiblicalStory[] {
  return allStoriesComplete.filter(s => s.volume === volume);
}

export function searchStoriesComplete(query: string): BiblicalStory[] {
  const q = query.toLowerCase();
  return allStoriesComplete.filter(s => 
    s.title.toLowerCase().includes(q) ||
    s.reference.toLowerCase().includes(q) ||
    s.summary.toLowerCase().includes(q) ||
    s.keyFigures?.some(f => f.toLowerCase().includes(q)) ||
    s.keyElements.some(e => e.toLowerCase().includes(q))
  );
}

export function getStoryByIdComplete(id: string): BiblicalStory | undefined {
  return allStoriesComplete.find(s => s.id === id);
}

// Story of the Day function - rotates through all stories based on day of year
export function getStoryOfTheDay(): BiblicalStory {
  const startOfYear = new Date(new Date().getFullYear(), 0, 0);
  const diff = new Date().getTime() - startOfYear.getTime();
  const dayOfYear = Math.floor(diff / (1000 * 60 * 60 * 24));
  const storyIndex = dayOfYear % allStoriesComplete.length;
  return allStoriesComplete[storyIndex];
}
