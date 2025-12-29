import React, { useState, useEffect, useCallback, useRef } from 'react';

interface ValidBlock {
  text: string;
  reason: string;
  bonus?: boolean;
}

interface TrapBlock {
  text: string;
  reason: string;
}

interface Verse {
  ref: string;
  text: string;
  valid: ValidBlock[];
  traps: TrapBlock[];
}

interface Room {
  name: string;
  code: string;
  icon: string;
  color: string;
  rule: string;
  catch: string;
  avoid: string;
  examples: {
    correct: string;
    wrong: string;
  };
}

interface FallingBlock {
  id: number;
  text: string;
  reason: string;
  type: 'valid' | 'trap';
  bonus?: boolean;
  x: number;
  y: number;
  verseRef: string;
  roomCode: string;
  roomIcon: string;
  roomName: string;
}

interface Feedback {
  type: 'success' | 'error' | 'info';
  title: string;
  text?: string;
  reason?: string;
  points?: number;
  duration: number;
}

type GameState = 'menu' | 'playing' | 'gameOver';
type GameMode = 'single' | 'palace';

const PTPalaceTetris: React.FC = () => {
  const [gameState, setGameState] = useState<GameState>('menu');
  const [currentRoom, setCurrentRoom] = useState<Room | null>(null);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [streak, setStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);
  const [fallingBlocks, setFallingBlocks] = useState<FallingBlock[]>([]);
  const [currentVerseIndex, setCurrentVerseIndex] = useState(0);
  const [blocksProcessed, setBlocksProcessed] = useState(0);
  const [feedback, setFeedback] = useState<Feedback | null>(null);
  const [speed, setSpeed] = useState(0.3);
  const [isPaused] = useState(false);
  const [gameMode, setGameMode] = useState<GameMode>('single');
  const [palaceRoomIndex, setPalaceRoomIndex] = useState(0);
  const blockIdCounter = useRef(0);

  // Room definitions with clear rules
  const rooms: Record<string, Room> = {
    OR: {
      name: "Observation Room",
      code: "OR",
      icon: "🔍",
      color: "from-emerald-600 to-emerald-800",
      rule: "WHAT THE TEXT LITERALLY SAYS",
      catch: "Facts, actions, people, places, numbers directly stated",
      avoid: "Interpretations, meanings, applications, theology",
      examples: {
        correct: "The father ran",
        wrong: "The father loved deeply"
      }
    },
    CR: {
      name: "Concentration Room",
      code: "CR",
      icon: "✝️",
      color: "from-amber-600 to-amber-800",
      rule: "HOW IT POINTS TO CHRIST",
      catch: "Types, shadows, prophecies, Christ-connections",
      avoid: "Moral lessons without Christ, missing the center",
      examples: {
        correct: "The lamb points to Christ",
        wrong: "Be a good person like Moses"
      }
    },
    IR: {
      name: "Imagination Room",
      code: "IR",
      icon: "🎬",
      color: "from-purple-600 to-purple-800",
      rule: "SENSORY IMMERSION",
      catch: "What you SEE, HEAR, FEEL, SMELL, TASTE being there",
      avoid: "Abstract theology, interpretation, analysis",
      examples: {
        correct: "Feel the sand under your feet",
        wrong: "This represents baptism"
      }
    },
    ST: {
      name: "Symbols Room",
      code: "ST",
      icon: "🔣",
      color: "from-blue-600 to-blue-800",
      rule: "BIBLICAL SYMBOL MEANINGS",
      catch: "Correct symbol definitions from Scripture",
      avoid: "Wrong meanings, shallow definitions, made-up symbols",
      examples: {
        correct: "Lamb = Sacrifice/Christ",
        wrong: "Lamb = Gentleness"
      }
    },
    BL: {
      name: "Sanctuary Room",
      code: "BL",
      icon: "🏛️",
      color: "from-indigo-600 to-indigo-800",
      rule: "SANCTUARY CONNECTIONS",
      catch: "Altar, Laver, Lampstand, Bread, Incense, Ark, Veil links",
      avoid: "Missing sanctuary meaning, wrong furniture connections",
      examples: {
        correct: "Altar = The Cross",
        wrong: "The altar was just furniture"
      }
    },
    FRm: {
      name: "Fire Room",
      code: "FRm",
      icon: "🔥",
      color: "from-red-600 to-red-800",
      rule: "HEART & EMOTIONAL RESPONSE",
      catch: "Feelings, conviction, worship, transformation",
      avoid: "Cold analysis, academic study, rushing past",
      examples: {
        correct: "Let this break your heart",
        wrong: "Analyze the Greek verb tense"
      }
    }
  };

  // Extensive verse database for endless play
  const verseDatabase: Record<string, Verse[]> = {
    OR: [
      {
        ref: "Luke 15:20",
        text: "But while he was still a long way off, his father saw him and was filled with compassion for him; he ran to his son, threw his arms around him and kissed him.",
        valid: [
          { text: "The father saw him", reason: "Directly stated action in the text" },
          { text: "The son was far away", reason: "Stated: 'a long way off'" },
          { text: "The father felt compassion", reason: "Directly stated: 'filled with compassion'" },
          { text: "The father ran", reason: "Directly stated action" },
          { text: "The father embraced him", reason: "Stated: 'threw his arms around him'" },
          { text: "The father kissed him", reason: "Directly stated action" },
          { text: "Two people are in this scene", reason: "Observable fact: father and son" },
          { text: "The father acted first", reason: "Sequence shows father's actions before son speaks", bonus: true }
        ],
        traps: [
          { text: "The father forgave him", reason: "INTERPRETATION — forgiveness is implied but not stated in this verse" },
          { text: "Grace comes before repentance", reason: "THEOLOGY — a doctrinal conclusion, not an observation" },
          { text: "Running was undignified for a patriarch", reason: "CULTURAL INTERPRETATION — not stated in text" },
          { text: "A servant told the father", reason: "INVENTION — not in the text at all" },
          { text: "The son apologized first", reason: "CONTRADICTS TEXT — father acted before son spoke" },
          { text: "This shows God's unconditional love", reason: "APPLICATION — meaning drawn from text, not observation" }
        ]
      },
      {
        ref: "Matthew 25:1-4",
        text: "Then shall the kingdom of heaven be likened unto ten virgins, which took their lamps, and went forth to meet the bridegroom. And five of them were wise, and five were foolish.",
        valid: [
          { text: "There were 10 virgins total", reason: "Directly stated number" },
          { text: "5 were wise, 5 were foolish", reason: "Directly stated division" },
          { text: "They all had lamps", reason: "Stated: 'took their lamps'" },
          { text: "They went to meet a bridegroom", reason: "Directly stated purpose" },
          { text: "The virgins are divided into two groups", reason: "Observable from the text" },
          { text: "This is a parable about the kingdom", reason: "Stated: 'kingdom of heaven be likened'" }
        ],
        traps: [
          { text: "The oil represents the Holy Spirit", reason: "INTERPRETATION — symbolic meaning, not observation" },
          { text: "The foolish were lazy", reason: "INTERPRETATION — 'foolish' is stated, 'lazy' is not" },
          { text: "We must be spiritually prepared", reason: "APPLICATION — lesson drawn, not observation" },
          { text: "The bridegroom is Jesus", reason: "INTERPRETATION — identity not stated in text" },
          { text: "This teaches about the Second Coming", reason: "INTERPRETATION — theological meaning" }
        ]
      },
      {
        ref: "John 11:35",
        text: "Jesus wept.",
        valid: [
          { text: "Jesus wept", reason: "The complete text — directly stated" },
          { text: "This is the shortest verse in the Bible", reason: "Observable fact about the text", bonus: true },
          { text: "One person is named: Jesus", reason: "Observable fact" },
          { text: "One action occurs: weeping", reason: "Observable fact" }
        ],
        traps: [
          { text: "Jesus was deeply grieved", reason: "INTERPRETATION — 'grieved' not stated, only 'wept'" },
          { text: "Jesus felt the pain of death", reason: "INTERPRETATION — internal state not described" },
          { text: "This shows Jesus' humanity", reason: "THEOLOGY — doctrinal conclusion" },
          { text: "Jesus wept because He loved Lazarus", reason: "INTERPRETATION — reason not stated in this verse" },
          { text: "We should weep with those who weep", reason: "APPLICATION — not an observation" }
        ]
      },
      {
        ref: "Genesis 22:9-10",
        text: "And they came to the place which God had told him of; and Abraham built an altar there, and laid the wood in order, and bound Isaac his son, and laid him on the altar upon the wood. And Abraham stretched forth his hand, and took the knife to slay his son.",
        valid: [
          { text: "Abraham built an altar", reason: "Directly stated action" },
          { text: "Abraham laid wood on the altar", reason: "Stated: 'laid the wood in order'" },
          { text: "Abraham bound Isaac", reason: "Directly stated: 'bound Isaac his son'" },
          { text: "Isaac was placed on the altar", reason: "Stated: 'laid him on the altar'" },
          { text: "Abraham took a knife", reason: "Stated: 'took the knife'" },
          { text: "Abraham intended to slay Isaac", reason: "Stated: 'to slay his son'" },
          { text: "They arrived at a specific place", reason: "Stated: 'the place which God had told him'" }
        ],
        traps: [
          { text: "Abraham's faith was being tested", reason: "INTERPRETATION — not stated in these verses" },
          { text: "Isaac represents Christ", reason: "TYPOLOGY — theological interpretation" },
          { text: "Abraham trusted God completely", reason: "INTERPRETATION — internal state not described here" },
          { text: "This foreshadows Calvary", reason: "INTERPRETATION — prophetic meaning" },
          { text: "Isaac willingly submitted", reason: "INVENTION — Isaac's attitude not described" }
        ]
      },
      {
        ref: "Daniel 3:19-20",
        text: "Then was Nebuchadnezzar full of fury, and the form of his visage was changed against Shadrach, Meshach, and Abednego: therefore he spake, and commanded that they should heat the furnace seven times more than it was wont to be heated.",
        valid: [
          { text: "Nebuchadnezzar was furious", reason: "Stated: 'full of fury'" },
          { text: "His facial expression changed", reason: "Stated: 'form of his visage was changed'" },
          { text: "Three men are named", reason: "Observable: Shadrach, Meshach, Abednego" },
          { text: "The furnace was heated 7 times hotter", reason: "Directly stated command" },
          { text: "Nebuchadnezzar gave a command", reason: "Stated: 'he spake, and commanded'" }
        ],
        traps: [
          { text: "God was protecting the three men", reason: "INTERPRETATION — not yet stated at this point" },
          { text: "Their faith angered the king", reason: "INTERPRETATION — reason for fury not stated" },
          { text: "Seven represents completeness", reason: "SYMBOLISM — numeric interpretation" },
          { text: "Pride caused the king's rage", reason: "INTERPRETATION — motive not stated" }
        ]
      },
      {
        ref: "Exodus 14:21-22",
        text: "And Moses stretched out his hand over the sea; and the LORD caused the sea to go back by a strong east wind all that night, and made the sea dry land, and the waters were divided. And the children of Israel went into the midst of the sea upon the dry ground.",
        valid: [
          { text: "Moses stretched out his hand", reason: "Directly stated action" },
          { text: "The LORD caused the sea to part", reason: "Stated: 'the LORD caused the sea to go back'" },
          { text: "A strong east wind blew all night", reason: "Directly stated detail" },
          { text: "The sea became dry land", reason: "Stated: 'made the sea dry land'" },
          { text: "The waters divided", reason: "Stated: 'waters were divided'" },
          { text: "Israel walked on dry ground", reason: "Stated: 'upon the dry ground'" },
          { text: "They went into the middle of the sea", reason: "Stated: 'into the midst of the sea'" }
        ],
        traps: [
          { text: "This represents baptism", reason: "INTERPRETATION — symbolic meaning" },
          { text: "God's power is displayed here", reason: "INTERPRETATION — theological conclusion" },
          { text: "Moses had complete faith", reason: "INTERPRETATION — internal state not described" },
          { text: "The people felt afraid then relieved", reason: "INVENTION — emotions not stated here" },
          { text: "This proves God controls nature", reason: "THEOLOGY — doctrinal conclusion" }
        ]
      }
    ],
    CR: [
      {
        ref: "John 12:32",
        text: "And I, if I be lifted up from the earth, will draw all men unto me.",
        valid: [
          { text: "Christ is the one being lifted up", reason: "'I' refers to Jesus speaking" },
          { text: "The lifting refers to crucifixion", reason: "John 12:33 confirms this meaning" },
          { text: "Christ draws all people to Himself", reason: "Stated: 'draw all men unto me'" },
          { text: "The bronze serpent (Num 21) pointed to this", reason: "Jesus made this connection in John 3:14", bonus: true },
          { text: "'Lifted up' means both crucified and exalted", reason: "Greek 'hypsoō' carries both meanings" }
        ],
        traps: [
          { text: "This is mainly about Roman politics", reason: "WRONG FOCUS — misses Christ as center" },
          { text: "Moses is the key figure here", reason: "WRONG FOCUS — Christ supersedes Moses" },
          { text: "This teaches moral improvement", reason: "MORALISM — misses Christological point" },
          { text: "The cross is incidental to the message", reason: "WRONG FOCUS — cross IS the message" }
        ]
      },
      {
        ref: "Genesis 22:8",
        text: "And Abraham said, My son, God will provide himself a lamb for a burnt offering.",
        valid: [
          { text: "God Himself is the provision", reason: "'God will provide HIMSELF a lamb' — God IS the lamb" },
          { text: "This points to Christ as the Lamb", reason: "Fulfilled in John 1:29 'Lamb of God'", bonus: true },
          { text: "Abraham prophesied without knowing", reason: "His words exceeded his understanding" },
          { text: "The lamb substitute points to Christ's substitution", reason: "Ram died so Isaac lived; Christ died so we live" }
        ],
        traps: [
          { text: "Abraham was just comforting Isaac", reason: "TOO SHALLOW — misses prophetic dimension" },
          { text: "This is only about obedience", reason: "MORALISM — misses Christ as center" },
          { text: "No Messianic meaning here", reason: "MISSES CHRIST — Jesus said Abraham saw His day (John 8:56)" },
          { text: "Isaac is the hero of this story", reason: "WRONG FOCUS — points to Christ, not Isaac" }
        ]
      },
      {
        ref: "Exodus 12:13",
        text: "And the blood shall be to you for a token upon the houses where ye are: and when I see the blood, I will pass over you.",
        valid: [
          { text: "The blood protects from judgment", reason: "Christ's blood shields from wrath" },
          { text: "Christ is our Passover Lamb", reason: "Paul confirms: 'Christ our Passover' (1 Cor 5:7)", bonus: true },
          { text: "God looks at the blood, not our merit", reason: "'When I see the blood' — not 'when I see your works'" },
          { text: "Substitution: lamb dies, family lives", reason: "Points to Christ dying in our place" }
        ],
        traps: [
          { text: "This is just Jewish history", reason: "TOO SHALLOW — misses typological meaning" },
          { text: "We must work to earn protection", reason: "WRONG THEOLOGY — blood alone saves" },
          { text: "The lamb represents our good deeds", reason: "WRONG SYMBOL — lamb is Christ, not works" },
          { text: "Moses is the savior figure here", reason: "WRONG FOCUS — God saves through blood" }
        ]
      },
      {
        ref: "Numbers 21:8-9",
        text: "And the LORD said unto Moses, Make thee a fiery serpent, and set it upon a pole: and it shall come to pass, that every one that is bitten, when he looketh upon it, shall live.",
        valid: [
          { text: "Looking at the lifted serpent brought life", reason: "Type of looking to Christ on cross for salvation" },
          { text: "Jesus said this pointed to Him", reason: "John 3:14-15 makes explicit connection", bonus: true },
          { text: "The pole foreshadows the cross", reason: "Vertical lifting = crucifixion imagery" },
          { text: "Salvation came by looking, not working", reason: "Faith (looking) not works — points to gospel" }
        ],
        traps: [
          { text: "This is just a strange miracle story", reason: "TOO SHALLOW — misses Christological type" },
          { text: "The serpent represents evil", reason: "WRONG READING — serpent on pole represents Christ bearing sin" },
          { text: "Moses healed them", reason: "WRONG FOCUS — God healed through the symbol pointing to Christ" },
          { text: "No New Testament relevance", reason: "WRONG — Jesus directly cites this in John 3" }
        ]
      },
      {
        ref: "1 Corinthians 10:4",
        text: "And did all drink the same spiritual drink: for they drank of that spiritual Rock that followed them: and that Rock was Christ.",
        valid: [
          { text: "The rock in the wilderness was Christ", reason: "Paul states explicitly: 'that Rock was Christ'" },
          { text: "Christ was present with Israel in the OT", reason: "Pre-incarnate Christ accompanied them", bonus: true },
          { text: "The water from the rock = spiritual life from Christ", reason: "Physical provision pointed to spiritual reality" },
          { text: "OT history contains Christ typology", reason: "Paul reads Christ into Exodus narrative" }
        ],
        traps: [
          { text: "This is just a metaphor Paul invented", reason: "WRONG — Paul reveals genuine typology" },
          { text: "The rock was just a rock", reason: "CONTRADICTS TEXT — Paul says 'that Rock was Christ'" },
          { text: "Only the NT reveals Christ", reason: "WRONG — Christ present throughout OT" },
          { text: "Moses was the provider", reason: "WRONG FOCUS — Christ was the source" }
        ]
      }
    ],
    IR: [
      {
        ref: "Exodus 14:21-22",
        text: "And Moses stretched out his hand over the sea; and the LORD caused the sea to go back by a strong east wind all that night, and made the sea dry land, and the waters were divided.",
        valid: [
          { text: "Feel the strong east wind on your face", reason: "Sensory: wind stated in text" },
          { text: "See the walls of water towering on each side", reason: "Visual: 'waters were divided'" },
          { text: "Hear the roar of water being held back", reason: "Auditory: massive water would be loud" },
          { text: "Feel sand beneath your feet — dry, not muddy", reason: "Tactile: 'dry land' stated" },
          { text: "Smell the salt of the sea surrounding you", reason: "Olfactory: sea environment" },
          { text: "Watch fish swimming in the water walls", reason: "Visual detail bringing scene alive", bonus: true }
        ],
        traps: [
          { text: "This symbolizes baptism", reason: "INTERPRETATION — not sensory immersion" },
          { text: "God demonstrates His sovereignty here", reason: "THEOLOGY — not imagination" },
          { text: "Moses had great faith", reason: "INTERPRETATION — not being IN the scene" },
          { text: "This proves God controls nature", reason: "DOCTRINE — not sensory experience" },
          { text: "We should trust God in hard times", reason: "APPLICATION — not imagination" }
        ]
      },
      {
        ref: "Matthew 27:45-46",
        text: "Now from the sixth hour there was darkness over all the land unto the ninth hour. And about the ninth hour Jesus cried with a loud voice, saying, Eli, Eli, lama sabachthani?",
        valid: [
          { text: "See the darkness covering everything at midday", reason: "Visual: 'darkness over all the land'" },
          { text: "Hear Jesus cry out with a loud voice", reason: "Auditory: 'cried with a loud voice'" },
          { text: "Feel the chill of supernatural darkness", reason: "Tactile: darkness during day would feel cold" },
          { text: "Sense the terror of those watching", reason: "Emotional immersion in the scene" },
          { text: "Stand beneath the cross, looking up", reason: "Placing yourself physically in the scene", bonus: true }
        ],
        traps: [
          { text: "This fulfills Psalm 22", reason: "INTERPRETATION — not sensory immersion" },
          { text: "The darkness symbolizes God's judgment", reason: "SYMBOLISM — not being IN the moment" },
          { text: "Jesus bore our sins here", reason: "THEOLOGY — not imagination" },
          { text: "Analyze the Aramaic phrase", reason: "ACADEMIC — opposite of emotional immersion" }
        ]
      },
      {
        ref: "John 20:1-2",
        text: "The first day of the week cometh Mary Magdalene early, when it was yet dark, unto the sepulchre, and seeth the stone taken away from the sepulchre.",
        valid: [
          { text: "Feel the pre-dawn chill in the garden", reason: "Tactile: 'early, when it was yet dark'" },
          { text: "See the massive stone rolled away", reason: "Visual: 'seeth the stone taken away'" },
          { text: "Hear the silence of the empty garden", reason: "Auditory: early morning stillness" },
          { text: "Smell the burial spices she carried", reason: "Olfactory: she came to anoint the body" },
          { text: "Feel your heart racing at the unexpected sight", reason: "Emotional: her shock at the moved stone", bonus: true }
        ],
        traps: [
          { text: "The resurrection proves Christ's deity", reason: "THEOLOGY — not sensory immersion" },
          { text: "Mary represents faithful discipleship", reason: "INTERPRETATION — not being IN the scene" },
          { text: "This is evidence for apologetics", reason: "ACADEMIC — not imagination" },
          { text: "The stone symbolizes obstacles removed", reason: "SYMBOLISM — not sensory experience" }
        ]
      },
      {
        ref: "Genesis 3:8",
        text: "And they heard the voice of the LORD God walking in the garden in the cool of the day: and Adam and his wife hid themselves from the presence of the LORD God amongst the trees of the garden.",
        valid: [
          { text: "Feel the cool evening breeze", reason: "Tactile: 'cool of the day'" },
          { text: "Hear God's footsteps approaching", reason: "Auditory: 'heard the voice... walking'" },
          { text: "Smell the garden foliage as you hide", reason: "Olfactory: hiding among trees" },
          { text: "Feel your heart pounding with guilt", reason: "Emotional: hiding implies fear/shame" },
          { text: "See the shadows lengthen as evening comes", reason: "Visual: 'cool of the day' = evening", bonus: true }
        ],
        traps: [
          { text: "This shows the beginning of sin's effects", reason: "INTERPRETATION — not sensory immersion" },
          { text: "Adam represents all humanity", reason: "THEOLOGY — not being IN the scene" },
          { text: "We cannot hide from God", reason: "APPLICATION — not imagination" },
          { text: "God's holiness exposes sin", reason: "DOCTRINE — not sensory experience" }
        ]
      }
    ],
    ST: [
      {
        ref: "John 1:29",
        text: "Behold the Lamb of God, which taketh away the sin of the world.",
        valid: [
          { text: "LAMB = Christ as sacrifice", reason: "Consistent OT meaning: lambs were slain for sin" },
          { text: "Links to Passover lamb (Exodus 12)", reason: "Same symbol: lamb's blood saves" },
          { text: "Links to Isaiah 53: 'led as a lamb to slaughter'", reason: "Prophetic symbol of Messiah" },
          { text: "'Takes away' = complete removal of sin", reason: "Sacrificial lamb bore sin away", bonus: true }
        ],
        traps: [
          { text: "LAMB = gentleness or meekness", reason: "WRONG MEANING — misses sacrificial symbolism" },
          { text: "Just a nickname John used", reason: "TOO SHALLOW — deep OT symbolism" },
          { text: "LAMB = innocence", reason: "PARTIAL — primary meaning is sacrifice" },
          { text: "No connection to OT sacrifices", reason: "FALSE — clear Passover/Temple connection" }
        ]
      },
      {
        ref: "John 7:37-38",
        text: "If any man thirst, let him come unto me, and drink. He that believeth on me, as the scripture hath said, out of his belly shall flow rivers of living water.",
        valid: [
          { text: "WATER = the Holy Spirit", reason: "John 7:39 confirms: 'this spake he of the Spirit'" },
          { text: "LIVING WATER = eternal life from Christ", reason: "Contrast with stagnant/dead water" },
          { text: "THIRST = spiritual need/longing", reason: "Consistent biblical symbol (Ps 42:1-2)" },
          { text: "Links to rock in wilderness giving water", reason: "Rock was Christ (1 Cor 10:4)", bonus: true }
        ],
        traps: [
          { text: "WATER = physical refreshment", reason: "TOO LITERAL — Jesus speaks spiritually" },
          { text: "WATER = baptism", reason: "WRONG SYMBOL — context is Spirit, not baptism" },
          { text: "Just poetic language with no meaning", reason: "MISSES DEPTH — rich symbolic meaning" },
          { text: "THIRST = physical dehydration", reason: "TOO LITERAL — spiritual thirst meant" }
        ]
      },
      {
        ref: "John 8:12",
        text: "Then spake Jesus unto them, saying, I am the light of the world: he that followeth me shall not walk in darkness, but shall have the light of life.",
        valid: [
          { text: "LIGHT = Christ Himself", reason: "Jesus explicitly claims: 'I am the light'" },
          { text: "LIGHT = truth and revelation", reason: "Light exposes and reveals (John 3:19-21)" },
          { text: "DARKNESS = sin, evil, ignorance", reason: "Consistent biblical contrast with light" },
          { text: "Links to Lampstand in Sanctuary", reason: "Christ is the true light the lampstand symbolized", bonus: true }
        ],
        traps: [
          { text: "LIGHT = happiness or good feelings", reason: "TOO SHALLOW — light is truth/Christ" },
          { text: "DARKNESS = sadness", reason: "WRONG — darkness is moral/spiritual, not emotional" },
          { text: "Just metaphorical language", reason: "MISSES DEPTH — profound symbolic claim" },
          { text: "LIGHT = human enlightenment/reason", reason: "WRONG SOURCE — Christ is light, not human wisdom" }
        ]
      },
      {
        ref: "Matthew 13:33",
        text: "The kingdom of heaven is like unto leaven, which a woman took, and hid in three measures of meal, till the whole was leavened.",
        valid: [
          { text: "LEAVEN here = kingdom's spreading influence", reason: "Context: kingdom grows pervasively" },
          { text: "LEAVEN elsewhere = sin or false teaching", reason: "Matt 16:6, 1 Cor 5:6-8 use leaven negatively" },
          { text: "Symbols can have different meanings by context", reason: "Leaven is positive here, negative elsewhere", bonus: true },
          { text: "THREE MEASURES = complete/full amount", reason: "Same measure Sarah used (Gen 18:6)" }
        ],
        traps: [
          { text: "LEAVEN always = sin", reason: "WRONG — context determines meaning" },
          { text: "LEAVEN always = good", reason: "WRONG — usually negative in Scripture" },
          { text: "Numbers are random in parables", reason: "MISSES DEPTH — numbers often significant" },
          { text: "Symbols have only one fixed meaning", reason: "FALSE — context shapes meaning" }
        ]
      },
      {
        ref: "Revelation 5:5-6",
        text: "Behold, the Lion of the tribe of Juda... And I beheld, and, lo, in the midst of the throne... stood a Lamb as it had been slain.",
        valid: [
          { text: "LION = Christ as King/Conqueror", reason: "Royal symbol from Jacob's blessing (Gen 49:9)" },
          { text: "LAMB = Christ as Sacrifice", reason: "Slain lamb = crucified Savior" },
          { text: "Christ is BOTH Lion AND Lamb", reason: "Same person, two aspects: power and sacrifice", bonus: true },
          { text: "'As it had been slain' = bears crucifixion marks", reason: "Resurrected but still showing wounds" }
        ],
        traps: [
          { text: "LION and LAMB are two different beings", reason: "WRONG — both refer to Christ" },
          { text: "LION = fierceness, LAMB = weakness", reason: "PARTIAL — lamb's 'weakness' conquers" },
          { text: "These are random animal images", reason: "MISSES DEPTH — rich OT symbolism" },
          { text: "LAMB = victim only", reason: "WRONG — Lamb is victorious and reigning" }
        ]
      }
    ],
    BL: [
      {
        ref: "Hebrews 9:11-12",
        text: "But Christ being come an high priest of good things to come, by a greater and more perfect tabernacle, not made with hands... by his own blood he entered in once into the holy place, having obtained eternal redemption for us.",
        valid: [
          { text: "Christ = true High Priest", reason: "Stated: 'Christ being come an high priest'" },
          { text: "Heavenly Sanctuary = 'greater and more perfect tabernacle'", reason: "'Not made with hands' = heavenly" },
          { text: "His blood > animal blood", reason: "'His own blood' replaces goats/calves" },
          { text: "Holy Place = Most Holy Place access", reason: "Day of Atonement entry into presence", bonus: true },
          { text: "'Once' = no repetition needed", reason: "Unlike yearly earthly sacrifices" }
        ],
        traps: [
          { text: "No sanctuary exists in heaven", reason: "CONTRADICTS TEXT — 'greater tabernacle'" },
          { text: "OT sanctuary was meaningless", reason: "WRONG — it was a pattern of heavenly" },
          { text: "Christ's work is repeated", reason: "CONTRADICTS — 'once' means complete" },
          { text: "Sanctuary teaching is obsolete", reason: "WRONG — Hebrews explains it in detail" }
        ]
      },
      {
        ref: "John 2:19-21",
        text: "Jesus answered and said unto them, Destroy this temple, and in three days I will raise it up... But he spake of the temple of his body.",
        valid: [
          { text: "Christ's BODY = the true Temple", reason: "John explains: 'temple of his body'" },
          { text: "Jesus is where God dwells", reason: "Temple = God's dwelling; Jesus = God with us" },
          { text: "Resurrection in 3 days = temple rebuilt", reason: "Destruction and raising = death/resurrection", bonus: true },
          { text: "Earthly temple pointed to Christ", reason: "Physical temple was shadow of true temple" }
        ],
        traps: [
          { text: "Jesus threatened the physical temple", reason: "MISUNDERSTANDING — He meant His body" },
          { text: "Temple has no connection to Jesus", reason: "CONTRADICTS TEXT — His body IS the temple" },
          { text: "This is only about buildings", reason: "MISSES POINT — about Christ's body" },
          { text: "Resurrection is not temple imagery", reason: "WRONG — Jesus explicitly connects them" }
        ]
      },
      {
        ref: "Hebrews 10:19-20",
        text: "Having therefore, brethren, boldness to enter into the holiest by the blood of Jesus, by a new and living way, which he hath consecrated for us, through the veil, that is to say, his flesh.",
        valid: [
          { text: "VEIL = Christ's flesh", reason: "Stated: 'through the veil, that is to say, his flesh'" },
          { text: "Access to God through Christ's torn body", reason: "Veil torn = flesh torn = access opened" },
          { text: "We enter the HOLIEST (Most Holy Place)", reason: "Full access to God's presence", bonus: true },
          { text: "BLOOD of Jesus opens the way", reason: "Stated: 'by the blood of Jesus'" }
        ],
        traps: [
          { text: "The veil was just a curtain", reason: "MISSES SYMBOLISM — veil represented Christ's flesh" },
          { text: "We earn access by our works", reason: "CONTRADICTS — 'by the blood of Jesus'" },
          { text: "Only priests can enter God's presence", reason: "WRONG — 'brethren' can enter boldly" },
          { text: "Sanctuary imagery is irrelevant today", reason: "WRONG — Hebrews applies it to believers" }
        ]
      },
      {
        ref: "Exodus 25:8-9",
        text: "And let them make me a sanctuary; that I may dwell among them. According to all that I shew thee, after the pattern of the tabernacle... so shall ye make it.",
        valid: [
          { text: "Earthly sanctuary = copy of heavenly pattern", reason: "'After the pattern' = heavenly original exists" },
          { text: "Purpose: God dwelling with His people", reason: "'That I may dwell among them'" },
          { text: "Every detail followed heaven's blueprint", reason: "'According to ALL that I shew thee'", bonus: true },
          { text: "Heaven has the original sanctuary", reason: "Earth's was patterned after something" }
        ],
        traps: [
          { text: "Moses invented the sanctuary design", reason: "CONTRADICTS — God showed him the pattern" },
          { text: "There is no heavenly sanctuary", reason: "CONTRADICTS — pattern implies original" },
          { text: "The sanctuary was random design", reason: "WRONG — every detail from God" },
          { text: "Only the earthly sanctuary matters", reason: "WRONG — earthly was copy of heavenly" }
        ]
      }
    ],
    FRm: [
      {
        ref: "Matthew 27:46",
        text: "And about the ninth hour Jesus cried with a loud voice, saying, Eli, Eli, lama sabachthani? that is to say, My God, my God, why hast thou forsaken me?",
        valid: [
          { text: "Feel the crushing weight of abandonment", reason: "Heart response to Christ's cry" },
          { text: "Let this moment break your heart", reason: "Emotional engagement with the cross" },
          { text: "Sense the darkness that covered Him", reason: "Entering the scene emotionally" },
          { text: "He was forsaken so you never will be", reason: "Personal application with feeling", bonus: true },
          { text: "Weep at what your sin cost Him", reason: "Conviction and emotional response" }
        ],
        traps: [
          { text: "Analyze the Aramaic grammar", reason: "WRONG ROOM — academic, not heart" },
          { text: "Compare manuscript variants", reason: "WRONG ROOM — scholarly, not emotional" },
          { text: "Cross-reference Psalm 22 structure", reason: "WRONG ROOM — study, not experience" },
          { text: "Note the chiastic literary pattern", reason: "WRONG ROOM — analysis, not fire" },
          { text: "Move quickly to the resurrection", reason: "AVOIDING DEPTH — stay in the moment" }
        ]
      },
      {
        ref: "Luke 22:44",
        text: "And being in an agony he prayed more earnestly: and his sweat was as it were great drops of blood falling down to the ground.",
        valid: [
          { text: "Feel the weight He carried for you", reason: "Personal emotional connection" },
          { text: "Enter Gethsemane and kneel beside Him", reason: "Imaginative emotional engagement" },
          { text: "Your sins were in that cup He dreaded", reason: "Personal conviction and response" },
          { text: "He chose the agony rather than lose you", reason: "Heart response to His love", bonus: true },
          { text: "Don't rush past this — stay and watch", reason: "Resisting superficial reading" }
        ],
        traps: [
          { text: "Research hematidrosis (bloody sweat)", reason: "WRONG ROOM — medical analysis" },
          { text: "This proves His human nature", reason: "WRONG ROOM — doctrine, not devotion" },
          { text: "Compare synoptic accounts", reason: "WRONG ROOM — academic comparison" },
          { text: "The agony was primarily physical", reason: "WRONG FOCUS — spiritual weight was greater" }
        ]
      },
      {
        ref: "Isaiah 53:3-5",
        text: "He is despised and rejected of men; a man of sorrows, and acquainted with grief... he was wounded for our transgressions, he was bruised for our iniquities.",
        valid: [
          { text: "He knows your deepest sorrows", reason: "Emotional connection: 'acquainted with grief'" },
          { text: "Your specific sins wounded Him", reason: "Personal conviction: 'our transgressions'" },
          { text: "Let 'despised and rejected' pierce you", reason: "Feeling the weight of the words" },
          { text: "His bruises heal your brokenness", reason: "Heart response to substitution", bonus: true },
          { text: "Grieve over what grieved Him", reason: "Shared emotional response" }
        ],
        traps: [
          { text: "Identify the Hebrew parallelism", reason: "WRONG ROOM — literary analysis" },
          { text: "This proves penal substitution", reason: "WRONG ROOM — systematic theology" },
          { text: "Note the passive voice verbs", reason: "WRONG ROOM — grammar study" },
          { text: "Compare with Psalm 22 language", reason: "WRONG ROOM — cross-reference study" }
        ]
      },
      {
        ref: "Revelation 5:5-6",
        text: "Weep not: behold, the Lion of the tribe of Juda hath prevailed... And I beheld, and, lo, in the midst of the throne stood a Lamb as it had been slain.",
        valid: [
          { text: "Marvel that the Lion IS the Lamb", reason: "Wonder and worship response" },
          { text: "He still bears the scars — for you", reason: "Personal emotional connection" },
          { text: "The slain Lamb conquered — let that thrill you", reason: "Joy and amazement" },
          { text: "Fall down with the elders in worship", reason: "Participatory devotion", bonus: true },
          { text: "Your Savior is on the throne right now", reason: "Present-tense emotional reality" }
        ],
        traps: [
          { text: "Analyze the throne room structure", reason: "WRONG ROOM — spatial analysis" },
          { text: "Compare with Daniel 7 imagery", reason: "WRONG ROOM — comparative study" },
          { text: "Note the 24 elders' identity", reason: "WRONG ROOM — interpretive question" },
          { text: "Identify Old Testament allusions", reason: "WRONG ROOM — academic sourcing" }
        ]
      }
    ]
  };

  // Get current room for palace mode
  const getCurrentRoom = useCallback((): Room | null => {
    if (gameMode === 'single') return currentRoom;
    const roomCodes = Object.keys(rooms);
    const roomCode = roomCodes[palaceRoomIndex % roomCodes.length];
    return rooms[roomCode];
  }, [gameMode, currentRoom, palaceRoomIndex]);

  // Get current verse based on room and index
  const getCurrentVerse = useCallback((): Verse | null => {
    const room = getCurrentRoom();
    if (!room) return null;
    const verses = verseDatabase[room.code];
    if (!verses || verses.length === 0) return null;
    return verses[currentVerseIndex % verses.length];
  }, [getCurrentRoom, currentVerseIndex]);

  // Spawn a new block
  const spawnBlock = useCallback(() => {
    const verse = getCurrentVerse();
    const room = getCurrentRoom();
    if (!verse || !room) return;

    const allBlocks = [
      ...verse.valid.map(b => ({ ...b, type: 'valid' as const })),
      ...verse.traps.map(b => ({ ...b, type: 'trap' as const }))
    ];

    // Pick a random block
    const block = allBlocks[Math.floor(Math.random() * allBlocks.length)];

    blockIdCounter.current += 1;

    const newBlock: FallingBlock = {
      ...block,
      id: blockIdCounter.current,
      x: Math.random() * 70 + 15, // 15-85% of width
      y: -15,
      verseRef: verse.ref,
      roomCode: room.code,
      roomIcon: room.icon,
      roomName: room.name
    };

    setFallingBlocks(prev => [...prev, newBlock]);
  }, [getCurrentVerse, getCurrentRoom]);

  // Game loop
  useEffect(() => {
    if (gameState !== 'playing' || isPaused) return;

    const moveInterval = setInterval(() => {
      setFallingBlocks(prev => {
        const updated = prev.map(block => ({
          ...block,
          y: block.y + speed
        })).filter(block => {
          if (block.y > 100) {
            // Block fell off screen
            // Missed a valid block - that's okay, just no points
            return false;
          }
          return true;
        });
        return updated;
      });
    }, 50);

    // Spawn new blocks periodically
    const spawnInterval = setInterval(() => {
      if (fallingBlocks.length < 4) { // Keep max 4 blocks on screen
        spawnBlock();
      }
    }, 2000 - Math.min(score * 2, 1500)); // Spawn faster as score increases

    return () => {
      clearInterval(moveInterval);
      clearInterval(spawnInterval);
    };
  }, [gameState, isPaused, speed, fallingBlocks.length, spawnBlock, score]);

  // Increase difficulty over time
  useEffect(() => {
    if (gameState !== 'playing') return;

    // Speed up slightly every 100 points
    const newSpeed = 0.3 + Math.floor(score / 100) * 0.05;
    setSpeed(Math.min(newSpeed, 0.8)); // Cap at 0.8

    // Change verse every 15 blocks processed
    if (blocksProcessed > 0 && blocksProcessed % 15 === 0) {
      setCurrentVerseIndex(prev => prev + 1);

      // In palace mode, also change rooms every 15 blocks
      if (gameMode === 'palace') {
        setPalaceRoomIndex(prev => prev + 1);
        const roomCodes = Object.keys(rooms);
        const nextRoomCode = roomCodes[(palaceRoomIndex + 1) % roomCodes.length];
        const nextRoom = rooms[nextRoomCode];
        setFeedback({
          type: 'info',
          title: `🏛️ NEW ROOM: ${nextRoom.icon} ${nextRoom.name}`,
          text: `Now catch: ${nextRoom.rule}`,
          duration: 3000
        });
      } else {
        setFeedback({ type: 'info', title: '📖 NEW VERSE!', duration: 2000 });
      }
    }
  }, [score, blocksProcessed, gameState, gameMode, palaceRoomIndex]);

  // Catch a block
  const catchBlock = (block: FallingBlock) => {
    const points = block.bonus ? 25 : 10;

    if (block.type === 'valid') {
      const streakBonus = streak >= 5 ? Math.floor(streak / 5) * 5 : 0;
      setScore(s => s + points + streakBonus);
      setStreak(s => s + 1);
      setBestStreak(prev => Math.max(prev, streak + 1));
      setBlocksProcessed(p => p + 1);

      setFeedback({
        type: 'success',
        title: block.bonus ? '🌟 BONUS!' : '✅ CORRECT!',
        text: block.text,
        reason: block.reason,
        points: points + streakBonus,
        duration: 2500
      });
    } else {
      setLives(l => l - 1);
      setStreak(0);
      setBlocksProcessed(p => p + 1);

      setFeedback({
        type: 'error',
        title: '❌ TRAP!',
        text: block.text,
        reason: block.reason,
        duration: 3000
      });

      if (lives <= 1) {
        setTimeout(() => {
          setGameState('gameOver');
          setHighScore(prev => Math.max(prev, score));
        }, 500);
      }
    }

    setFallingBlocks(prev => prev.filter(b => b.id !== block.id));
  };

  // Clear feedback after duration
  useEffect(() => {
    if (feedback) {
      const timer = setTimeout(() => setFeedback(null), feedback.duration || 2000);
      return () => clearTimeout(timer);
    }
  }, [feedback]);

  // Start game
  const startGame = (room: Room, isPalaceMode = false) => {
    setCurrentRoom(room);
    setGameMode(isPalaceMode ? 'palace' : 'single');
    setScore(0);
    setLives(3);
    setStreak(0);
    setSpeed(0.3);
    setCurrentVerseIndex(0);
    setBlocksProcessed(0);
    setFallingBlocks([]);
    setFeedback(null);
    setPalaceRoomIndex(0);
    setGameState('playing');

    // Spawn initial blocks
    setTimeout(() => spawnBlock(), 500);
    setTimeout(() => spawnBlock(), 1500);
  };

  // Render menu
  const renderMenu = () => (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white p-4">
      <div className="max-w-md mx-auto">
        <h1 className="text-3xl font-bold text-center mb-2">🏛️ PT PALACE TETRIS</h1>
        <p className="text-center text-gray-400 mb-2">Endless Bible Study Training</p>

        {highScore > 0 && (
          <div className="text-center text-amber-400 mb-4">🏆 High Score: {highScore}</div>
        )}

        <div className="bg-gray-800 rounded-xl p-4 mb-6">
          <h2 className="font-bold text-lg mb-2">How to Play:</h2>
          <ol className="text-sm text-gray-300 space-y-2">
            <li>1. Choose a ROOM or play FULL PALACE mode</li>
            <li>2. Blocks fall with statements about a verse</li>
            <li>3. <span className="text-green-400">TAP blocks that FIT the room's principle</span></li>
            <li>4. <span className="text-red-400">LET blocks FALL that don't fit</span></li>
            <li>5. Game continues until you lose 3 lives</li>
          </ol>
        </div>

        {/* FULL PALACE MODE */}
        <div className="mb-6">
          <button
            onClick={() => startGame(rooms.OR, true)}
            className="w-full p-4 bg-gradient-to-r from-purple-600 via-pink-600 to-amber-600 rounded-xl text-left hover:ring-2 hover:ring-white transition-all mb-2"
          >
            <div className="flex items-center gap-3 mb-2">
              <span className="text-3xl">🏛️</span>
              <div>
                <div className="font-bold text-lg">FULL PALACE MODE</div>
                <div className="text-xs opacity-80">All rooms combined — ultimate challenge!</div>
              </div>
            </div>
            <div className="text-sm opacity-90">
              Rooms rotate every 15 blocks. Each block shows which room's principle you need.
              Master ALL of Phototheology!
            </div>
          </button>
        </div>

        <div className="text-sm text-gray-400 mb-3">— OR SELECT A SINGLE ROOM —</div>

        <div className="space-y-3">
          {Object.values(rooms).map(room => (
            <button
              key={room.code}
              onClick={() => startGame(room, false)}
              className={`w-full p-4 bg-gradient-to-r ${room.color} rounded-xl text-left hover:ring-2 hover:ring-white transition-all`}
            >
              <div className="flex items-center gap-3 mb-2">
                <span className="text-2xl">{room.icon}</span>
                <div>
                  <div className="font-bold">{room.name}</div>
                  <div className="text-xs opacity-80">{room.code}</div>
                </div>
              </div>
              <div className="text-sm opacity-90 mb-2">
                <span className="font-semibold">CATCH:</span> {room.catch}
              </div>
              <div className="text-xs opacity-70">
                <span className="font-semibold">AVOID:</span> {room.avoid}
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );

  // Render game
  const renderGame = () => {
    const verse = getCurrentVerse();
    const room = getCurrentRoom();

    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white p-2 overflow-hidden">
        {/* Header */}
        <div className="flex justify-between items-center mb-2 px-2">
          <button
            onClick={() => setGameState('menu')}
            className="text-gray-400 hover:text-white text-sm"
          >
            ✕ Exit
          </button>
          <div className="text-center">
            {gameMode === 'palace' ? (
              <div className="font-bold text-sm bg-gradient-to-r from-purple-400 to-amber-400 bg-clip-text text-transparent">
                🏛️ FULL PALACE MODE
              </div>
            ) : (
              <div className="font-bold text-sm">{room?.icon} {room?.name}</div>
            )}
          </div>
          <div className="text-right">
            <div className="text-amber-400 font-bold">{score}</div>
            <div className="text-xs">{'❤️'.repeat(lives)}{'🖤'.repeat(3-lives)}</div>
          </div>
        </div>

        {/* Room Rule Banner */}
        <div className={`mx-2 mb-2 p-2 rounded-lg bg-gradient-to-r ${room?.color} text-center`}>
          <div className="flex items-center justify-center gap-2">
            <span className="text-lg">{room?.icon}</span>
            <div>
              <div className="text-xs opacity-80">
                {gameMode === 'palace' ? `CURRENT ROOM: ${room?.name}` : 'CATCH BLOCKS ABOUT:'}
              </div>
              <div className="font-bold text-sm">{room?.rule}</div>
            </div>
          </div>
        </div>

        {/* Current Verse */}
        {verse && (
          <div className="mx-2 mb-2 bg-gray-800/90 rounded-lg p-3">
            <div className="flex justify-between items-start mb-1">
              <span className="font-bold text-amber-400 text-sm">📖 {verse.ref}</span>
              {streak >= 3 && (
                <span className="text-xs bg-orange-500 px-2 py-0.5 rounded-full">
                  🔥 {streak} streak!
                </span>
              )}
            </div>
            <div className="text-xs text-gray-300 leading-relaxed max-h-16 overflow-y-auto">
              {verse.text}
            </div>
          </div>
        )}

        {/* Feedback Panel */}
        {feedback && (
          <div className={`mx-2 mb-2 p-3 rounded-lg ${
            feedback.type === 'success' ? 'bg-green-900/90 border border-green-500' :
            feedback.type === 'error' ? 'bg-red-900/90 border border-red-500' :
            'bg-blue-900/90 border border-blue-500'
          }`}>
            <div className="font-bold text-sm">{feedback.title}</div>
            {feedback.text && (
              <div className="text-xs mt-1 opacity-90">{feedback.text}</div>
            )}
            {feedback.reason && (
              <div className="text-xs mt-1 opacity-75">
                {feedback.type === 'success' ? '✓' : '→'} {feedback.reason}
              </div>
            )}
            {feedback.points && (
              <div className="text-xs mt-1 text-green-300">+{feedback.points} points</div>
            )}
          </div>
        )}

        {/* Game Area */}
        <div className="relative mx-2 bg-gray-800/30 rounded-xl border border-gray-700 overflow-hidden" style={{ height: '45vh' }}>
          {/* Falling Blocks */}
          {fallingBlocks.map(block => (
            <button
              key={block.id}
              onClick={() => catchBlock(block)}
              className={`absolute px-3 py-2 rounded-lg text-xs font-medium transition-transform hover:scale-105 active:scale-95 shadow-lg max-w-44 text-left leading-tight ${
                block.type === 'valid'
                  ? block.bonus
                    ? 'bg-gradient-to-br from-yellow-400 to-amber-500 text-black ring-2 ring-yellow-300'
                    : 'bg-gradient-to-br from-blue-500 to-blue-700 text-white'
                  : 'bg-gradient-to-br from-gray-600 to-gray-800 text-gray-200 border border-dashed border-gray-400'
              }`}
              style={{
                left: `${block.x}%`,
                top: `${block.y}%`,
                transform: 'translateX(-50%)'
              }}
            >
              {gameMode === 'palace' && (
                <div className="text-xs opacity-70 mb-0.5">{block.roomIcon} {block.roomCode}</div>
              )}
              <div className="font-medium">{block.text}</div>
              <div className="text-xs opacity-60 mt-0.5">{block.verseRef}</div>
            </button>
          ))}

          {/* Empty state */}
          {fallingBlocks.length === 0 && (
            <div className="absolute inset-0 flex items-center justify-center text-gray-500 text-sm">
              Blocks incoming...
            </div>
          )}
        </div>

        {/* Instructions Footer */}
        <div className="mx-2 mt-2 text-center">
          <div className="text-xs text-gray-500">
            <span className="text-blue-400">🟦 Blue</span> = Fits this room |
            <span className="text-yellow-400 ml-1">🟨 Gold</span> = Bonus |
            <span className="text-gray-400 ml-1">⬜ Gray</span> = Trap
          </div>
          <div className="text-xs text-gray-600 mt-1">
            {gameMode === 'palace'
              ? 'Each block shows its room • Catch what fits that room\'s principle'
              : 'Tap correct blocks • Let wrong blocks fall'
            }
          </div>
        </div>
      </div>
    );
  };

  // Render game over
  const renderGameOver = () => {
    const room = getCurrentRoom();

    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white p-4 flex items-center justify-center">
        <div className="max-w-md mx-auto text-center">
          <div className="text-6xl mb-4">💔</div>
          <h2 className="text-2xl font-bold mb-2">GAME OVER</h2>
          <div className="text-gray-400 mb-6">
            {gameMode === 'palace' ? '🏛️ Full Palace Mode' : room?.name}
          </div>

          <div className="bg-gray-800 rounded-xl p-6 mb-6">
            <div className="grid grid-cols-2 gap-6">
              <div>
                <div className="text-4xl font-bold text-amber-400">{score}</div>
                <div className="text-xs text-gray-400">SCORE</div>
              </div>
              <div>
                <div className="text-4xl font-bold text-orange-400">{bestStreak}</div>
                <div className="text-xs text-gray-400">BEST STREAK</div>
              </div>
            </div>

            {score >= highScore && score > 0 && (
              <div className="mt-4 text-green-400 font-bold">🏆 NEW HIGH SCORE!</div>
            )}
          </div>

          {gameMode === 'single' && (
            <div className="bg-gray-800/50 rounded-lg p-4 mb-6 text-left">
              <div className="text-sm font-bold mb-2">📚 {room?.name} Reminder:</div>
              <div className="text-xs text-gray-300 mb-1">
                <span className="text-green-400">CATCH:</span> {room?.catch}
              </div>
              <div className="text-xs text-gray-300">
                <span className="text-red-400">AVOID:</span> {room?.avoid}
              </div>
            </div>
          )}

          {gameMode === 'palace' && (
            <div className="bg-gray-800/50 rounded-lg p-4 mb-6 text-left">
              <div className="text-sm font-bold mb-2">🏛️ Palace Mode Tips:</div>
              <div className="text-xs text-gray-300">
                Each block shows which room it belongs to. Read the room icon and code on each block to know what principle applies!
              </div>
            </div>
          )}

          <div className="flex gap-3 justify-center">
            <button
              onClick={() => startGame(currentRoom!, gameMode === 'palace')}
              className={`px-6 py-3 rounded-lg font-bold hover:ring-2 hover:ring-white ${
                gameMode === 'palace'
                  ? 'bg-gradient-to-r from-purple-600 via-pink-600 to-amber-600'
                  : `bg-gradient-to-r ${room?.color}`
              }`}
            >
              Play Again
            </button>
            <button
              onClick={() => setGameState('menu')}
              className="px-6 py-3 bg-gray-700 hover:bg-gray-600 rounded-lg"
            >
              Menu
            </button>
          </div>
        </div>
      </div>
    );
  };

  // Main render
  switch (gameState) {
    case 'playing':
      return renderGame();
    case 'gameOver':
      return renderGameOver();
    default:
      return renderMenu();
  }
};

export default PTPalaceTetris;
