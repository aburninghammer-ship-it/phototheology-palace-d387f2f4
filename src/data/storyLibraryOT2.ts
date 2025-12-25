// Extended OT Stories: 2 Samuel through Esther

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

// 2 Samuel Stories
export const samuel2Stories: BiblicalStory[] = [
  {
    id: "david-king-judah",
    title: "David Becomes King",
    reference: "2 Samuel 2-5",
    volume: "2 Samuel",
    category: "Kingdom",
    summary: "After Saul's death, David is anointed king over Judah at Hebron. Civil war with Ish-bosheth lasts seven years. Eventually all Israel comes to David at Hebron, and he is anointed king over all Israel. He conquers Jerusalem and makes it his capital.",
    keyElements: ["Anointed at Hebron", "Seven years over Judah", "Civil war ends", "All tribes unite", "Jerusalem conquered", "City of David established"],
    christPattern: [
      { element: "Rejected then accepted", christApplication: "Christ rejected, will reign" },
      { element: "King of Judah first", christApplication: "Christ came to Jews first" },
      { element: "Jerusalem as capital", christApplication: "New Jerusalem" }
    ],
    dimensions: {
      literal: "David's rise to full kingship",
      christ: "Christ will reign over all",
      personal: "Patience in God's timing",
      church: "Unity under one King",
      heavenFuture: "Christ reigns from New Jerusalem",
      heavenPast: "God's plan for righteous ruler"
    },
    relatedStories: ["Psalm 2 (King enthroned)", "Luke 1:32 (Throne of David)"],
    keyFigures: ["David", "Abner", "Joab", "Ish-bosheth"],
    setting: "Hebron, Jerusalem"
  },
  {
    id: "david-bathsheba",
    title: "David and Bathsheba",
    reference: "2 Samuel 11-12",
    volume: "2 Samuel",
    category: "Kingdom",
    summary: "David sees Bathsheba bathing, commits adultery, and arranges Uriah's death. Nathan confronts David with a parable. David repents. The child dies, but Solomon is later born to them.",
    keyElements: ["Stayed home from war", "Saw Bathsheba bathing", "Adultery committed", "Uriah's loyalty", "Murder arranged", "Nathan's parable", "David's repentance", "Child dies", "Solomon born"],
    christPattern: [
      { element: "Nathan confronts", christApplication: "Holy Spirit convicts" },
      { element: "David repents", christApplication: "Model of true repentance" },
      { element: "Forgiveness given", christApplication: "Christ forgives the penitent" }
    ],
    dimensions: {
      literal: "David's great sin and repentance",
      christ: "Christ forgives the truly repentant",
      personal: "Danger of idle moments; repentance available",
      church: "Leaders must be confronted in sin",
      heavenFuture: "All sins exposed and judged",
      heavenPast: "Sin's destructive pattern"
    },
    relatedStories: ["Psalm 51 (David's repentance)", "Psalm 32 (Blessed forgiveness)"],
    keyFigures: ["David", "Bathsheba", "Uriah", "Nathan"],
    setting: "Jerusalem"
  },
  {
    id: "absalom-rebellion",
    title: "Absalom's Rebellion",
    reference: "2 Samuel 15-18",
    volume: "2 Samuel",
    category: "Kingdom",
    summary: "Absalom steals the hearts of Israel and declares himself king at Hebron. David flees Jerusalem. Absalom pursues but is defeated. Caught by his hair in a tree, Joab kills him. David mourns, 'O Absalom, my son!'",
    keyElements: ["Absalom's beauty and charm", "Stole hearts at gate", "Proclaimed king at Hebron", "David flees", "Ahithophel's counsel rejected", "Battle in forest", "Hair caught in tree", "Joab kills Absalom", "David's grief"],
    christPattern: [
      { element: "Son rebels against father", christApplication: "Humanity rebels against God" },
      { element: "David weeps over son", christApplication: "God weeps over lost" },
      { element: "Caught in tree", christApplication: "Sin's snare" }
    ],
    dimensions: {
      literal: "Civil war and tragedy",
      christ: "Father's heart for rebellious children",
      personal: "Consequences of family neglect",
      church: "Division and rebellion's cost",
      heavenFuture: "Final rebellion crushed",
      heavenPast: "Lucifer's rebellion"
    },
    relatedStories: ["Psalm 3 (Fleeing from Absalom)", "Luke 15 (Father and prodigal)"],
    keyFigures: ["David", "Absalom", "Joab", "Ahithophel", "Hushai"],
    setting: "Jerusalem, Forest of Ephraim"
  }
];

// 1 Kings Stories
export const kings1Stories: BiblicalStory[] = [
  {
    id: "solomon-wisdom",
    title: "Solomon's Wisdom",
    reference: "1 Kings 3",
    volume: "1 Kings",
    category: "Kingdom",
    summary: "God appears to Solomon in a dream at Gibeon, offering anything he asks. Solomon asks for wisdom to govern. God is pleased and grants wisdom, riches, and honor. Two women dispute a baby; Solomon's wise judgment reveals the true mother.",
    keyElements: ["Dream at Gibeon", "Asks for understanding heart", "God pleased", "Wisdom granted", "Riches and honor added", "Two mothers dispute", "Sword test", "True mother revealed"],
    christPattern: [
      { element: "Asks for wisdom", christApplication: "Christ is wisdom of God" },
      { element: "Judges rightly", christApplication: "Christ the righteous judge" },
      { element: "Greater than Solomon", christApplication: "Matthew 12:42" }
    ],
    dimensions: {
      literal: "Solomon receives divine wisdom",
      christ: "Christ is greater than Solomon",
      personal: "Ask for wisdom (James 1:5)",
      church: "Church needs discernment",
      heavenFuture: "Perfect wisdom in glory",
      heavenPast: "Wisdom with God from beginning"
    },
    relatedStories: ["James 1:5 (Ask for wisdom)", "Matthew 12:42 (Greater than Solomon)", "Proverbs 8 (Wisdom personified)"],
    keyFigures: ["Solomon", "Two mothers"],
    setting: "Gibeon, Jerusalem"
  },
  {
    id: "temple-dedication",
    title: "Temple Dedication",
    reference: "1 Kings 8",
    volume: "1 Kings",
    category: "Kingdom",
    summary: "Solomon completes and dedicates the temple. The ark is brought in; glory cloud fills the house. Solomon's prayer of dedication acknowledges God's greatness, asks for forgiveness for future sins. Fire falls; people worship.",
    keyElements: ["Seven years building", "Ark brought to Most Holy", "Glory cloud fills temple", "Priests cannot stand", "Solomon's prayer", "Spread hands toward heaven", "If they sin and pray toward this place", "Fire falls", "14 days of feast"],
    christPattern: [
      { element: "Glory fills temple", christApplication: "Christ's glory fills church" },
      { element: "Pray toward temple", christApplication: "Pray through Christ" },
      { element: "Fire from heaven", christApplication: "Holy Spirit's fire" }
    ],
    dimensions: {
      literal: "Temple completed and filled with glory",
      christ: "Christ is the true temple",
      personal: "My body is temple of Holy Spirit",
      church: "Church is spiritual temple",
      heavenFuture: "No temple in New Jerusalem—God is temple",
      heavenPast: "Heavenly sanctuary pattern"
    },
    relatedStories: ["2 Chronicles 7:1-3", "John 2:19-21 (Destroy this temple)", "Revelation 21:22"],
    keyFigures: ["Solomon", "Priests", "Israel"],
    setting: "Jerusalem Temple"
  },
  {
    id: "elijah-baal",
    title: "Elijah on Mount Carmel",
    reference: "1 Kings 18",
    volume: "1 Kings",
    category: "Prophets",
    summary: "After three years of drought, Elijah challenges 450 prophets of Baal on Carmel. They cry out all day; no answer. Elijah rebuilds altar with 12 stones, soaks sacrifice, prays briefly. Fire falls and consumes all. People cry 'The LORD, He is God!' Rain returns.",
    keyElements: ["3½ years drought", "450 prophets of Baal", "Build two altars", "Baal prophets cry all day", "No answer", "12 stones altar", "Water poured three times", "Brief prayer", "Fire falls", "Consumes sacrifice, stones, water", "Prophets executed", "Rain cloud like man's hand"],
    christPattern: [
      { element: "Fire from heaven", christApplication: "Judgment and acceptance" },
      { element: "12 stones", christApplication: "12 apostles/tribes restored" },
      { element: "Water and fire", christApplication: "Spirit baptism" }
    ],
    dimensions: {
      literal: "Contest proves true God",
      christ: "Christ is the true sacrifice consumed",
      personal: "Which God do I serve?",
      church: "Church in Laodicean compromise",
      heavenFuture: "Final showdown with false worship",
      heavenPast: "War between true and false worship"
    },
    relatedStories: ["James 5:17-18 (Elijah's prayer)", "Revelation 11 (Two witnesses)", "Malachi 4:5 (Elijah to come)"],
    keyFigures: ["Elijah", "Ahab", "Prophets of Baal", "Obadiah"],
    setting: "Mount Carmel"
  },
  {
    id: "elijah-still-voice",
    title: "Still Small Voice",
    reference: "1 Kings 19",
    volume: "1 Kings",
    category: "Prophets",
    summary: "Jezebel threatens Elijah; he flees to wilderness, wanting to die. Angel feeds him; he journeys 40 days to Horeb. God asks 'What are you doing here?' Wind, earthquake, fire pass—God not in them. Then a still small voice. God commissions him and reveals 7,000 faithful.",
    keyElements: ["Jezebel's threat", "Flees to wilderness", "Under juniper tree", "Wants to die", "Angel feeds twice", "40 days to Horeb", "Cave on mountain", "Wind, earthquake, fire", "Still small voice", "7,000 who haven't bowed"],
    christPattern: [
      { element: "40 days journey", christApplication: "Christ's 40 days in wilderness" },
      { element: "Fed by angel", christApplication: "Angels ministered to Christ" },
      { element: "Still small voice", christApplication: "Holy Spirit's gentle leading" }
    ],
    dimensions: {
      literal: "Prophet's depression and restoration",
      christ: "Christ gentle and lowly",
      personal: "God speaks in quiet, not spectacle",
      church: "Faithful remnant exists",
      heavenFuture: "Remnant revealed",
      heavenPast: "God's patience with discouraged"
    },
    relatedStories: ["Romans 11:2-4 (7,000 remnant)", "Matthew 11:29 (Gentle and lowly)"],
    keyFigures: ["Elijah", "Jezebel", "Angel"],
    setting: "Wilderness, Mount Horeb"
  }
];

// 2 Kings Stories
export const kings2Stories: BiblicalStory[] = [
  {
    id: "elijah-chariot",
    title: "Elijah Taken to Heaven",
    reference: "2 Kings 2:1-18",
    volume: "2 Kings",
    category: "Prophets",
    summary: "Elijah's final journey with Elisha. Elisha refuses to leave. At Jordan, Elijah parts water with mantle. Elisha asks for double portion of spirit. Chariot of fire and horses separate them; Elijah goes up in whirlwind. Elisha takes up mantle, parts Jordan.",
    keyElements: ["Elisha won't leave", "Sons of prophets watch", "Jordan parted with mantle", "Double portion requested", "Chariot of fire", "Horses of fire", "Whirlwind ascent", "Mantle falls", "Elisha parts Jordan", "Spirit of Elijah on Elisha"],
    christPattern: [
      { element: "Ascends to heaven", christApplication: "Christ's ascension" },
      { element: "Mantle passed", christApplication: "Spirit given to church" },
      { element: "Double portion", christApplication: "Greater works (John 14:12)" }
    ],
    dimensions: {
      literal: "Elijah translated",
      christ: "Christ ascended, Spirit descended",
      personal: "Desire spiritual inheritance",
      church: "Receiving the mantle of ministry",
      heavenFuture: "Living saints translated",
      heavenPast: "Enoch's translation"
    },
    relatedStories: ["Acts 1:9-11 (Christ ascends)", "John 14:12 (Greater works)", "Genesis 5:24 (Enoch)"],
    keyFigures: ["Elijah", "Elisha"],
    setting: "Gilgal to Jordan"
  },
  {
    id: "naaman-healed",
    title: "Naaman Healed",
    reference: "2 Kings 5",
    volume: "2 Kings",
    category: "Prophets",
    summary: "Naaman, Syrian commander, has leprosy. An Israelite servant girl mentions Elisha. Naaman comes with gifts; Elisha sends word to dip seven times in Jordan. Naaman almost refuses in pride but servants convince him. He's healed, declares Israel's God is true. Gehazi's greed brings leprosy on himself.",
    keyElements: ["Mighty but leprous", "Servant girl's witness", "Letter to Israel's king", "Elisha's instruction", "Dip 7 times in Jordan", "Naaman's pride and anger", "Servants' wisdom", "Complete healing", "Confession of God", "Gehazi's greed", "Leprosy transferred"],
    christPattern: [
      { element: "Wash and be clean", christApplication: "Baptism cleanses" },
      { element: "Seven times", christApplication: "Complete cleansing" },
      { element: "Gentile healed", christApplication: "Gospel to nations" }
    ],
    dimensions: {
      literal: "Syrian general healed of leprosy",
      christ: "Christ heals all who obey",
      personal: "Simple obedience required",
      church: "Gospel for outsiders",
      heavenFuture: "All nations healed",
      heavenPast: "God's plan for all people"
    },
    relatedStories: ["Luke 4:27 (Jesus references Naaman)", "Mark 1:40-45 (Jesus heals leper)"],
    keyFigures: ["Naaman", "Elisha", "Servant girl", "Gehazi"],
    setting: "Syria, Samaria, Jordan River"
  },
  {
    id: "hezekiah-healing",
    title: "Hezekiah's Healing",
    reference: "2 Kings 20",
    volume: "2 Kings",
    category: "Kingdom",
    summary: "Hezekiah is sick unto death. Isaiah tells him to prepare to die. Hezekiah prays with tears. Before Isaiah leaves the court, God sends him back: 15 years added, city delivered. Sign: shadow goes back 10 degrees. Hezekiah shows Babylonian envoys all his treasures—a prophetic mistake.",
    keyElements: ["Sick unto death", "Isaiah's message", "Hezekiah's tearful prayer", "15 years added", "Sun dial sign", "Shadow retreats 10 degrees", "Babylonian envoys visit", "Shows all treasures", "Isaiah's prophecy of exile"],
    christPattern: [
      { element: "Prayer changes outcome", christApplication: "Christ intercedes" },
      { element: "Life extended", christApplication: "Resurrection life" },
      { element: "Sun reverses", christApplication: "Supernatural intervention" }
    ],
    dimensions: {
      literal: "King healed, given more time",
      christ: "Christ gives life",
      personal: "Prayer matters; use time wisely",
      church: "Don't show off to world",
      heavenFuture: "No more death",
      heavenPast: "God's sovereignty over time"
    },
    relatedStories: ["Isaiah 38 (Parallel account)", "James 5:16 (Prayer of righteous)"],
    keyFigures: ["Hezekiah", "Isaiah"],
    setting: "Jerusalem"
  }
];

// 1 & 2 Chronicles Stories
export const chronicles1Stories: BiblicalStory[] = [
  {
    id: "david-ark",
    title: "David Brings the Ark",
    reference: "1 Chronicles 13-16",
    volume: "1 Chronicles",
    category: "Kingdom",
    summary: "David attempts to bring the ark on a cart; Uzzah touches it and dies. After three months at Obed-edom's house (blessed), David brings it properly on Levites' shoulders with great celebration. He dances before the Lord with all his might.",
    keyElements: ["First attempt on cart", "Uzzah steadies ark", "Uzzah struck dead", "Ark at Obed-edom 3 months", "House blessed", "Second attempt—Levites carry", "Sacrifices every 6 steps", "David dances", "Michal despises him", "Ark in tabernacle"],
    christPattern: [
      { element: "Ark of presence", christApplication: "Christ's presence with us" },
      { element: "Proper approach", christApplication: "Come to God His way" },
      { element: "David's joy", christApplication: "Joy in God's presence" }
    ],
    dimensions: {
      literal: "Ark brought to Jerusalem",
      christ: "God's presence among His people",
      personal: "Approach God reverently yet joyfully",
      church: "Worship with whole heart",
      heavenFuture: "God's presence forever",
      heavenPast: "Ark in heaven (Rev 11:19)"
    },
    relatedStories: ["2 Samuel 6", "Revelation 11:19 (Ark in heaven)"],
    keyFigures: ["David", "Uzzah", "Obed-edom", "Levites"],
    setting: "Kiriath-jearim to Jerusalem"
  }
];

export const chronicles2Stories: BiblicalStory[] = [
  {
    id: "jehoshaphat-battle",
    title: "Jehoshaphat's Battle",
    reference: "2 Chronicles 20",
    volume: "2 Chronicles",
    category: "Kingdom",
    summary: "Vast army comes against Judah. Jehoshaphat proclaims a fast, prays publicly admitting weakness. Jahaziel prophesies: 'Battle is not yours but God's.' Next day, singers lead army praising; enemies destroy each other. Three days to gather spoil.",
    keyElements: ["Vast enemy army", "Fear and fasting", "Public prayer", "\"We know not what to do\"", "Eyes upon Thee", "Jahaziel's prophecy", "Stand still and see", "Singers lead army", "Praise in battle", "Enemies destroy each other", "Three days of spoil", "Valley of Berachah (blessing)"],
    christPattern: [
      { element: "Battle is Lord's", christApplication: "Christ fights for us" },
      { element: "Stand and see salvation", christApplication: "Salvation is of God" },
      { element: "Praise before victory", christApplication: "Faith praises beforehand" }
    ],
    dimensions: {
      literal: "Victory through worship",
      christ: "Christ wins our battles",
      personal: "When overwhelmed, worship",
      church: "Church warfare is spiritual",
      heavenFuture: "Final battle won by Christ",
      heavenPast: "War in heaven won by Michael"
    },
    relatedStories: ["Exodus 14:13-14 (Stand still)", "Ephesians 6:10-18 (Spiritual warfare)"],
    keyFigures: ["Jehoshaphat", "Jahaziel", "Levite singers"],
    setting: "Judah, Wilderness of Tekoa"
  }
];

// Ezra Stories
export const ezraStories: BiblicalStory[] = [
  {
    id: "temple-rebuilt",
    title: "Temple Rebuilt",
    reference: "Ezra 3-6",
    volume: "Ezra",
    category: "Restoration",
    summary: "Returning exiles rebuild the altar and lay temple foundation. Old men weep remembering Solomon's temple; young shout for joy. Opposition delays work. Prophets Haggai and Zechariah stir them; temple completed in Darius's reign.",
    keyElements: ["Altar rebuilt first", "Foundation laid", "Mixed weeping and shouting", "Opposition letters", "Work stops 15 years", "Haggai and Zechariah prophesy", "Work resumes", "Temple completed", "Dedication celebration", "Passover observed"],
    christPattern: [
      { element: "Temple rebuilt", christApplication: "Church being built" },
      { element: "Opposition overcome", christApplication: "Gates of hell won't prevail" },
      { element: "Prophets encourage", christApplication: "Spirit empowers work" }
    ],
    dimensions: {
      literal: "Second temple constructed",
      christ: "Christ builds His church",
      personal: "Be part of building",
      church: "Church overcomes opposition",
      heavenFuture: "Final temple—God's presence",
      heavenPast: "Temple pattern from heaven"
    },
    relatedStories: ["Haggai 1-2", "Zechariah 4 (Not by might)", "Matthew 16:18 (Church built)"],
    keyFigures: ["Zerubbabel", "Jeshua", "Haggai", "Zechariah"],
    setting: "Jerusalem"
  }
];

// Nehemiah Stories
export const nehemiahStories: BiblicalStory[] = [
  {
    id: "walls-rebuilt",
    title: "Walls Rebuilt",
    reference: "Nehemiah 1-6",
    volume: "Nehemiah",
    category: "Restoration",
    summary: "Nehemiah, cupbearer to Artaxerxes, weeps over Jerusalem's broken walls. He prays and asks the king for permission. With letters of authority, he inspects walls at night, organizes workers—each family builds their section. Despite mockery, threats, and plots, walls completed in 52 days.",
    keyElements: ["News of Jerusalem's disgrace", "Fasting and prayer", "Request to king", "Night inspection", "Family sections assigned", "Sanballat's mockery", "\"Will foxes break it down?\"", "Workers armed", "Half build, half guard", "Completed in 52 days"],
    christPattern: [
      { element: "Nehemiah weeps", christApplication: "Christ wept over Jerusalem" },
      { element: "Rebuilds in opposition", christApplication: "Church built despite opposition" },
      { element: "Each builds their section", christApplication: "Every member has a part" }
    ],
    dimensions: {
      literal: "Walls restored for protection",
      christ: "Christ builds and protects His people",
      personal: "Build my section faithfully",
      church: "Work together despite opposition",
      heavenFuture: "New Jerusalem has walls",
      heavenPast: "God's people always opposed"
    },
    relatedStories: ["Revelation 21:12-14 (New Jerusalem walls)", "Ephesians 2:19-22 (Built together)"],
    keyFigures: ["Nehemiah", "Sanballat", "Tobiah", "Artaxerxes"],
    setting: "Susa, Jerusalem"
  }
];

// Esther Stories
export const estherStories: BiblicalStory[] = [
  {
    id: "esther-queen",
    title: "Esther Becomes Queen",
    reference: "Esther 1-2",
    volume: "Esther",
    category: "Providence",
    summary: "Queen Vashti refuses King Ahasuerus; she's deposed. Beautiful virgins gathered; Esther (Hadassah), raised by Mordecai, is chosen queen. She hides her Jewish identity. Mordecai uncovers assassination plot, recorded in chronicles.",
    keyElements: ["Vashti's refusal", "Search for new queen", "Esther's beauty", "Mordecai's guidance", "Hidden identity", "Chosen as queen", "Assassination plot foiled", "Mordecai's deed recorded"],
    christPattern: [
      { element: "Raised from obscurity", christApplication: "Christ exalted from humility" },
      { element: "Chosen as bride", christApplication: "Church chosen as Christ's bride" },
      { element: "Hidden identity revealed", christApplication: "Christ revealed in time" }
    ],
    dimensions: {
      literal: "Jewish orphan becomes Persian queen",
      christ: "Divine providence places His people",
      personal: "God positions me for purpose",
      church: "Church positioned for such a time",
      heavenFuture: "Bride prepared for King",
      heavenPast: "God's foreknowledge"
    },
    relatedStories: ["Revelation 19:7-9 (Marriage of Lamb)"],
    keyFigures: ["Esther", "Mordecai", "Ahasuerus", "Vashti"],
    setting: "Susa (Persia)"
  },
  {
    id: "esther-intercedes",
    title: "Esther's Intercession",
    reference: "Esther 4-7",
    volume: "Esther",
    category: "Providence",
    summary: "Haman plots genocide of Jews. Mordecai urges Esther: 'For such a time as this.' She fasts three days, approaches king unsummoned, invites him and Haman to banquets. Haman builds gallows for Mordecai. That night king can't sleep, reads of Mordecai's deed, honors him. Esther reveals plot; Haman hanged on his own gallows.",
    keyElements: ["Haman's plot", "Lots cast (Purim)", "Mordecai's sackcloth", "\"For such a time as this\"", "Three-day fast", "\"If I perish, I perish\"", "Touches golden scepter", "Two banquets", "Sleepless night", "Mordecai honored", "Esther's accusation", "Haman hanged on own gallows"],
    christPattern: [
      { element: "Esther intercedes", christApplication: "Christ intercedes for us" },
      { element: "Risk of death", christApplication: "Christ faced death for us" },
      { element: "Enemy destroyed", christApplication: "Satan destroyed by own plot" }
    ],
    dimensions: {
      literal: "Queen saves her people",
      christ: "Christ saves His people at great cost",
      personal: "\"For such a time as this\" applies to me",
      church: "Church intercedes for world",
      heavenFuture: "Final deliverance of God's people",
      heavenPast: "Satan's plots always fail"
    },
    relatedStories: ["Hebrews 7:25 (Christ intercedes)", "Romans 8:34"],
    keyFigures: ["Esther", "Mordecai", "Haman", "Ahasuerus"],
    setting: "Susa Palace"
  }
];
