// Patterns Room Library - Recurring Biblical Motifs
// Patterns appear 3+ times across Scripture revealing God's consistent ways

export interface BiblicalPattern {
  id: string;
  name: string;
  structure: string;
  category: 'testing' | 'election' | 'deliverance' | 'covenant' | 'judgment' | 'provision' | 'encounter';
  instances: PatternInstance[];
  theologicalInsight: string;
  christConnection: string;
}

export interface PatternInstance {
  reference: string;
  description: string;
  details: string;
}

export const patternsLibrary: BiblicalPattern[] = [
  // TESTING PATTERNS
  {
    id: 'wilderness-testing',
    name: 'Wilderness Testing',
    structure: "God's people enter barren place → face deprivation/temptation → faith tested → outcome reveals heart",
    category: 'testing',
    instances: [
      {
        reference: 'Numbers 14; Deuteronomy 8:2',
        description: 'Israel 40 years in wilderness',
        details: 'Tested with hunger, thirst, enemies—failed repeatedly through murmuring and unbelief'
      },
      {
        reference: '1 Kings 19:4-8',
        description: 'Elijah 40 days to Horeb',
        details: 'Fled from Jezebel, sustained by angel, heard "still small voice" in the cave'
      },
      {
        reference: 'Matthew 4:1-11',
        description: 'Jesus 40 days tempted',
        details: 'Fasted, tempted by Satan in three ways, remained faithful, quoted Scripture'
      },
      {
        reference: 'Exodus 15:22-27',
        description: 'Israel at Marah (bitter water)',
        details: 'Three days without water, grumbled, God made bitter water sweet'
      }
    ],
    theologicalInsight: 'Wilderness is God\'s classroom for testing and refining faith. God strips away false dependencies to reveal what we truly trust.',
    christConnection: 'Jesus succeeded where Israel failed, becoming our faithful representative who conquered every temptation we face.'
  },
  {
    id: 'younger-over-older',
    name: 'Younger Over Older',
    structure: 'Older son expected to inherit → God chooses younger → reversal of human expectations',
    category: 'election',
    instances: [
      {
        reference: 'Genesis 4:4-5',
        description: 'Abel over Cain',
        details: "Younger Abel's sacrifice accepted; older Cain's rejected"
      },
      {
        reference: 'Genesis 21:9-12',
        description: 'Isaac over Ishmael',
        details: 'Isaac (born when Abraham was older) is the child of promise, not firstborn Ishmael'
      },
      {
        reference: 'Genesis 25:23; 27:27-29',
        description: 'Jacob over Esau',
        details: '"The older shall serve the younger"—Jacob receives blessing meant for firstborn'
      },
      {
        reference: 'Genesis 37-50',
        description: 'Joseph over his brothers',
        details: 'Youngest of the twelve becomes savior of the family'
      },
      {
        reference: '1 Samuel 16:10-13',
        description: 'David over his brothers',
        details: 'Youngest and least impressive chosen as king over seven older brothers'
      },
      {
        reference: '1 Kings 1-2',
        description: 'Solomon over Adonijah',
        details: 'Younger Solomon receives throne over older Adonijah who tried to claim it'
      }
    ],
    theologicalInsight: "God's sovereign election overturns human primogeniture and merit. Grace chooses, not nature or tradition.",
    christConnection: 'Christ Himself is the ultimate "younger" who receives everything—the Second Adam inherits what the first Adam lost.'
  },
  {
    id: 'third-day-resurrection',
    name: 'Third Day Resurrection',
    structure: 'Death or crisis → three-day period → deliverance/resurrection on third day',
    category: 'deliverance',
    instances: [
      {
        reference: 'Genesis 22:4',
        description: 'Abraham sees Moriah on third day',
        details: "After three-day journey, Isaac 'raised' figuratively from the altar"
      },
      {
        reference: 'Jonah 1:17; Matthew 12:40',
        description: 'Jonah three days in fish',
        details: 'Swallowed, "resurrected" onto land on third day to complete mission'
      },
      {
        reference: 'Hosea 6:2',
        description: 'Israel restored on third day',
        details: '"After two days he will revive us; on the third day he will raise us up"'
      },
      {
        reference: 'Matthew 16:21; 1 Corinthians 15:4',
        description: 'Jesus raised on third day',
        details: 'Crucified, buried, rose on the third day according to the Scriptures'
      },
      {
        reference: 'John 2:1',
        description: 'Wedding at Cana on third day',
        details: 'First miracle (turning water to wine) signals new creation on "third day"'
      }
    ],
    theologicalInsight: 'Third day is God\'s resurrection signature—death is never permanent when God intervenes. The pattern builds expectation for THE resurrection.',
    christConnection: "Every third-day deliverance in Scripture points forward to Christ's literal resurrection—the foundation of our faith."
  },
  {
    id: 'barren-woman-bears',
    name: 'Barren Woman Bears',
    structure: 'Woman unable to conceive → cries to God → miraculous birth → child of destiny',
    category: 'provision',
    instances: [
      {
        reference: 'Genesis 18:10-14; 21:1-7',
        description: 'Sarah bears Isaac',
        details: 'Barren for 90 years, laughed at promise, gave birth to child of covenant'
      },
      {
        reference: 'Genesis 25:21',
        description: 'Rebekah bears Jacob and Esau',
        details: 'Isaac prayed for barren wife; she conceived twins'
      },
      {
        reference: 'Genesis 29:31; 30:22-24',
        description: 'Rachel bears Joseph',
        details: 'Long barren while Leah had many sons; finally gave birth to Joseph and Benjamin'
      },
      {
        reference: '1 Samuel 1:1-20',
        description: 'Hannah bears Samuel',
        details: 'Wept bitterly, vowed to God, gave birth to prophet-judge Samuel'
      },
      {
        reference: 'Luke 1:7-25',
        description: 'Elizabeth bears John the Baptist',
        details: 'Barren in old age, received angelic announcement, gave birth to forerunner'
      }
    ],
    theologicalInsight: 'Impossibility meets divine power. God specializes in opening closed wombs—and closed hearts. The natural order bows to supernatural intervention.',
    christConnection: "The ultimate 'impossible' birth: a virgin conceives. Mary's pregnancy is the climax of all barren-woman-births—God doing what only He can do."
  },
  {
    id: 'betrayal-to-enthronement',
    name: 'Betrayal to Enthronement',
    structure: 'Favored one betrayed by close associates → suffers unjustly → exalted to save those who rejected',
    category: 'deliverance',
    instances: [
      {
        reference: 'Genesis 37-41',
        description: 'Joseph betrayed then exalted',
        details: 'Sold by brothers for silver, falsely accused, imprisoned, then made second in Egypt'
      },
      {
        reference: '1 Samuel 18-2 Samuel 5',
        description: 'David betrayed then crowned',
        details: 'Saul turned against him, forced to flee, finally crowned king over all Israel'
      },
      {
        reference: 'Matthew 26-28; Philippians 2:8-11',
        description: 'Jesus betrayed then glorified',
        details: 'Betrayed by Judas, denied by Peter, abandoned by all, now every knee bows'
      },
      {
        reference: 'Daniel 6',
        description: 'Daniel betrayed then promoted',
        details: 'Colleagues conspired against him, thrown to lions, emerged unharmed and exalted'
      }
    ],
    theologicalInsight: 'Suffering at the hands of intimates is part of the path to glory. God uses betrayal as the doorway to higher purpose.',
    christConnection: "Christ's betrayal-to-glory pattern is THE template—what men meant for evil, God meant for salvation."
  },
  {
    id: 'remnant-preserved',
    name: 'Remnant Preserved',
    structure: 'Judgment falls on majority → faithful few preserved → through remnant, God continues His plan',
    category: 'judgment',
    instances: [
      {
        reference: 'Genesis 6-8',
        description: 'Noah\'s family preserved',
        details: 'Only 8 people saved from the flood; through them humanity continues'
      },
      {
        reference: 'Genesis 19:15-29',
        description: 'Lot\'s family preserved',
        details: 'Sodom destroyed; Lot and daughters rescued'
      },
      {
        reference: '1 Kings 19:18',
        description: "Elijah's 7,000 preserved",
        details: 'Elijah thought he was alone; 7,000 had not bowed to Baal'
      },
      {
        reference: 'Isaiah 1:9; 10:20-22',
        description: 'Remnant of Israel preserved',
        details: 'After Assyrian/Babylonian judgment, a remnant returns'
      },
      {
        reference: 'Romans 11:5',
        description: 'Remnant according to grace',
        details: 'Even now, a remnant chosen by grace while others are hardened'
      }
    ],
    theologicalInsight: 'God always preserves a faithful few through judgment. The remnant carries the seed of promise forward.',
    christConnection: 'Christ is the ultimate Remnant—the faithful "Israel" who perfectly obeyed. Through Him, the true remnant (the church) is preserved.'
  },
  {
    id: 'water-crisis-provision',
    name: 'Water Crisis & Provision',
    structure: 'Desperate need for water → cry to God → miraculous provision through unlikely means',
    category: 'provision',
    instances: [
      {
        reference: 'Exodus 14:21-22',
        description: 'Red Sea divided',
        details: 'Waters parted, Israel walks through on dry ground'
      },
      {
        reference: 'Exodus 15:22-25',
        description: 'Bitter water made sweet',
        details: 'Marah waters bitter; tree makes them drinkable'
      },
      {
        reference: 'Exodus 17:1-7',
        description: 'Water from the rock',
        details: 'Moses strikes rock at Horeb; water flows for the people'
      },
      {
        reference: 'Joshua 3:14-17',
        description: 'Jordan River divided',
        details: 'At flood stage, waters heap up; Israel crosses into Canaan'
      },
      {
        reference: '2 Kings 2:19-22',
        description: 'Elisha heals Jericho waters',
        details: 'Throws salt in spring; waters purified permanently'
      },
      {
        reference: 'Matthew 14:25',
        description: 'Jesus walks on water',
        details: 'Water that threatened the disciples becomes the path for Christ'
      }
    ],
    theologicalInsight: 'Water represents both danger and life. Faith is demonstrated at the water\'s edge—God turns threats into pathways.',
    christConnection: 'Christ walks on water, commands storms, and provides living water. He is master of what we fear most.'
  },
  {
    id: 'mountain-encounter',
    name: 'Mountain Encounters',
    structure: 'Person ascends mountain → meets God → receives revelation or commission → descends transformed',
    category: 'encounter',
    instances: [
      {
        reference: 'Genesis 22',
        description: 'Mount Moriah (Abraham)',
        details: 'Abraham offers Isaac; receives revelation of the providing God'
      },
      {
        reference: 'Exodus 19-24',
        description: 'Mount Sinai (Moses)',
        details: 'Moses ascends, receives the Law, face shines with glory'
      },
      {
        reference: '1 Kings 18:20-40',
        description: 'Mount Carmel (Elijah)',
        details: 'Elijah confronts prophets of Baal; fire falls; God vindicated'
      },
      {
        reference: '1 Kings 19:8-18',
        description: 'Mount Horeb (Elijah)',
        details: 'Elijah hears still small voice; receives new commission'
      },
      {
        reference: 'Matthew 17:1-8',
        description: 'Mount of Transfiguration',
        details: 'Jesus transfigured before Peter, James, John; voice from cloud'
      },
      {
        reference: 'Matthew 28:16-20',
        description: 'Mountain in Galilee (Disciples)',
        details: 'Risen Christ commissions disciples; Great Commission given'
      }
    ],
    theologicalInsight: 'Mountains are God\'s meeting places—where heaven touches earth and mortals receive divine revelation.',
    christConnection: 'Christ IS the meeting place between God and humanity. The Transfiguration mountain reveals His glory; the mount of commission launches His kingdom.'
  },
  {
    id: 'seven-day-completion',
    name: 'Seven-Day Completion',
    structure: 'Task or journey spans seven days → completion/rest/victory on seventh day',
    category: 'covenant',
    instances: [
      {
        reference: 'Genesis 1-2:3',
        description: 'Creation week',
        details: 'Six days of work, seventh day of rest and blessing'
      },
      {
        reference: 'Joshua 6:1-20',
        description: 'Jericho falls on seventh day',
        details: 'March around city once daily for six days; seven times on seventh day—walls fall'
      },
      {
        reference: 'Leviticus 23:34-36',
        description: 'Feast of Tabernacles',
        details: 'Seven days dwelling in booths; eighth day is sacred assembly'
      },
      {
        reference: '2 Kings 5:10-14',
        description: 'Naaman dips seven times',
        details: 'Dips in Jordan seven times; cleansed on seventh'
      }
    ],
    theologicalInsight: 'Seven signifies divine completion and covenant rest. God works in "sevens" to mark His perfect timing.',
    christConnection: 'Christ brings the ultimate Sabbath rest—the seventh day points to eternal rest in Him (Hebrews 4:9-10).'
  },
  {
    id: 'exile-return',
    name: 'Exile and Return',
    structure: 'Sin leads to exile/displacement → suffering in foreign land → repentance → God brings home',
    category: 'judgment',
    instances: [
      {
        reference: 'Genesis 3:23-24',
        description: 'Adam and Eve exiled from Eden',
        details: 'Sin leads to expulsion from paradise; cherubim guard return'
      },
      {
        reference: 'Genesis 28-31',
        description: 'Jacob exiled then returns',
        details: 'Flees from Esau, labors in Haran, returns to promised land'
      },
      {
        reference: 'Exodus 1-15',
        description: 'Israel in Egypt, then Exodus',
        details: 'Slavery in Egypt; God delivers and brings them toward Canaan'
      },
      {
        reference: '2 Kings 25; Ezra 1',
        description: 'Judah exiled to Babylon then returns',
        details: '70-year captivity; Cyrus decrees return'
      },
      {
        reference: 'Luke 15:11-24',
        description: 'Prodigal Son returns',
        details: 'Leaves home, squanders inheritance, returns and is welcomed'
      }
    ],
    theologicalInsight: 'Sin always leads to exile—separation from God\'s presence. But God always makes a way home for the repentant.',
    christConnection: 'Christ is the way home. He brings us back from exile (sin) into the Father\'s house. The ultimate return is the New Jerusalem.'
  },
  {
    id: 'firstborn-redemption',
    name: 'Firstborn Redemption',
    structure: 'Firstborn is set apart/endangered → substitution required → redemption through blood/price',
    category: 'covenant',
    instances: [
      {
        reference: 'Exodus 11-12',
        description: 'Firstborn in Egypt',
        details: 'Egyptian firstborn die; Israelite firstborn covered by lamb\'s blood'
      },
      {
        reference: 'Exodus 13:13-15',
        description: 'Firstborn redemption law',
        details: 'Every firstborn belongs to God; must be redeemed with blood or broken neck'
      },
      {
        reference: 'Genesis 22',
        description: 'Isaac (firstborn of promise)',
        details: 'Isaac bound on altar; ram substitutes'
      },
      {
        reference: 'Luke 2:22-24',
        description: 'Jesus presented as firstborn',
        details: 'Mary and Joseph redeem Jesus with sacrifice as Law required'
      }
    ],
    theologicalInsight: 'The firstborn represents the whole. Firstborn redemption teaches that we all need a substitute.',
    christConnection: 'Christ is "firstborn of all creation" (Col 1:15) and "firstborn among many brethren" (Rom 8:29). He was NOT redeemed—He IS the Redeemer.'
  },
  {
    id: 'divine-wrestling',
    name: 'Divine Wrestling',
    structure: 'Person strives with God → refuses to let go → emerges changed/renamed → blessing through brokenness',
    category: 'encounter',
    instances: [
      {
        reference: 'Genesis 32:22-32',
        description: 'Jacob wrestles at Peniel',
        details: 'All-night wrestling; hip dislocated; renamed Israel ("wrestles with God")'
      },
      {
        reference: 'Exodus 4:24-26',
        description: 'Moses encounters God at lodging place',
        details: 'God seeks to kill Moses; Zipporah circumcises son'
      },
      {
        reference: 'Job 38-42',
        description: 'Job contends with God',
        details: 'Job questions God through suffering; God answers; Job repents in dust'
      },
      {
        reference: 'Luke 22:41-44',
        description: 'Jesus in Gethsemane',
        details: 'Struggles with the cup; sweats blood; submits: "Not my will, but yours"'
      }
    ],
    theologicalInsight: 'Wrestling with God is not sin—it\'s intimacy. God allows the struggle so we emerge transformed.',
    christConnection: 'Christ wrestled with the cup in Gethsemane and emerged victorious through submission—our model for surrendered wrestling.'
  }
];

// Helper functions
export const getPatternsByCategory = (category: BiblicalPattern['category']) => {
  return patternsLibrary.filter(pattern => pattern.category === category);
};

export const searchPatterns = (query: string) => {
  const lowerQuery = query.toLowerCase();
  return patternsLibrary.filter(pattern =>
    pattern.name.toLowerCase().includes(lowerQuery) ||
    pattern.structure.toLowerCase().includes(lowerQuery) ||
    pattern.theologicalInsight.toLowerCase().includes(lowerQuery) ||
    pattern.instances.some(inst =>
      inst.description.toLowerCase().includes(lowerQuery) ||
      inst.reference.toLowerCase().includes(lowerQuery)
    )
  );
};

export const getRandomPattern = () => {
  return patternsLibrary[Math.floor(Math.random() * patternsLibrary.length)];
};

// Get all categories
export const getAllCategories = () => {
  return [...new Set(patternsLibrary.map(p => p.category))];
};
