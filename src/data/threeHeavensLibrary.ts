// Three Heavens Library - Comprehensive Guide to Multi-Level Prophetic Fulfillment
// Every prophecy has layers of fulfillment: Near/Historical (1H), Intermediate (2H), Ultimate/Eschatological (3H)

export type HeavenLevel = "1H" | "2H" | "3H";
export type ProphecyCategory = "messianic" | "judgment" | "restoration" | "kingdom" | "covenantal" | "eschatological";

export interface ThreeHeavensExplanation {
  level: HeavenLevel;
  name: string;
  fullName: string;
  tagColor: string;
  timeframe: string;
  description: string;
  characteristics: string[];
  keyMarkers: string[];
  audienceClues: string[];
  commonMistakes: string[];
  examples: string[];
}

export interface PropheticPassage {
  id: string;
  reference: string;
  title: string;
  text: string;
  category: ProphecyCategory;
  primaryContext: string;
  fulfillments: PropheticFulfillment[];
  interpretiveNotes: string[];
  keyVerses: string[];
  relatedPassages?: string[];
}

export interface PropheticFulfillment {
  heaven: HeavenLevel;
  event: string;
  date: string;
  description: string;
  textualMarkers: string[];
  historicalConnection: string;
  spiritualSignificance: string;
  proofTexts: string[];
}

export interface PropheticPattern {
  id: string;
  name: string;
  description: string;
  pattern: string;
  examples: PatternExample[];
}

export interface PatternExample {
  passage: string;
  firstHeaven: string;
  secondHeaven: string;
  thirdHeaven: string;
}

// The Three Heavens Explained
export const threeHeavensExplanations: ThreeHeavensExplanation[] = [
  {
    level: "1H",
    name: "First Heaven",
    fullName: "Near/Historical Fulfillment",
    tagColor: "blue",
    timeframe: "Within the prophet's generation or soon after (typically 0-100 years)",
    description: "The immediate, historical application of the prophecy to events near the prophet's own time. This is the 'first layer' that validates the prophecy for the original audience and establishes the pattern for later fulfillments.",
    characteristics: [
      "Fulfillment occurs within living memory of the original audience",
      "Uses concrete, contemporary imagery and references",
      "Addresses immediate historical circumstances",
      "Provides near-term validation of the prophet's message",
      "Establishes the pattern that later fulfillments will follow",
      "Often involves literal, physical fulfillment",
      "Connected to specific kings, nations, or events of the time"
    ],
    keyMarkers: [
      "Specific named kings, nations, or cities (Babylon, Cyrus, Assyria)",
      "Contemporary events referenced (exile, siege, famine)",
      "Near-term time indicators ('in those days,' 'in this generation')",
      "Local geographical references",
      "Immediate cause-and-effect relationships",
      "Fulfillment documented in later biblical books"
    ],
    audienceClues: [
      "Direct address to contemporary Israel/Judah",
      "References to current political situations",
      "Warnings about imminent judgment",
      "Promises of near-term restoration",
      "Connection to Mosaic covenant blessings/curses"
    ],
    commonMistakes: [
      "Ignoring the historical context entirely",
      "Jumping straight to end-time application",
      "Missing the pattern established for later fulfillments",
      "Treating all prophecy as exclusively future",
      "Failing to see how the original audience understood it"
    ],
    examples: [
      "Isaiah's prophecy of Babylon's fall (Isaiah 13) → Fulfilled by Medo-Persia in 539 BC",
      "Jeremiah's 70 years prophecy (Jeremiah 25:11-12) → Babylonian exile and return",
      "Daniel's prophecy of the four kingdoms (Daniel 2) → Babylon, Medo-Persia, Greece, Rome",
      "Micah's prophecy of Jerusalem's destruction (Micah 3:12) → Babylonian destruction 586 BC"
    ]
  },
  {
    level: "2H",
    name: "Second Heaven",
    fullName: "Intermediate/Church-Age Fulfillment",
    tagColor: "purple",
    timeframe: "The inter-testamental period through the Church Age (100 BC - present)",
    description: "The middle layer of fulfillment, often connected to Christ's first coming, the destruction of Jerusalem in AD 70, or the ongoing experience of the Church. This bridges the gap between ancient history and final eschatology.",
    characteristics: [
      "Connects Old Testament prophecies to New Testament events",
      "Often fulfilled in Christ's first coming or early church",
      "May involve spiritual/typological fulfillment of physical promises",
      "Extends the pattern to the Church as 'spiritual Israel'",
      "AD 70 destruction of Jerusalem often serves as a key marker",
      "The Church Age as a prolonged fulfillment period",
      "Application to the ongoing battle between Christ and Satan"
    ],
    keyMarkers: [
      "New Testament quotations of Old Testament prophecies",
      "Application to Christ's life, death, resurrection",
      "References that fit the Roman period",
      "Spiritual reinterpretation of physical promises",
      "Jerusalem's destruction by Rome (AD 70)",
      "The 'times of the Gentiles'",
      "Church-age spiritual realities"
    ],
    audienceClues: [
      "Prophecies applied to Jesus in the Gospels",
      "Peter's Pentecost sermon applications (Acts 2)",
      "Paul's teaching on the Church as Abraham's seed",
      "Hebrews' temple/priesthood spiritualization",
      "Revelation's seven churches as church-age periods"
    ],
    commonMistakes: [
      "Thinking First Coming exhausts all messianic prophecy",
      "Missing the AD 70 typological significance",
      "Ignoring the Church's role in prophetic fulfillment",
      "Forcing every prophecy to be only future or only past",
      "Failing to see the 'already/not yet' tension"
    ],
    examples: [
      "Isaiah 7:14 (virgin birth) → Mary and Jesus (Matthew 1:22-23)",
      "Joel 2:28-32 (Spirit poured out) → Pentecost (Acts 2:17-21)",
      "Daniel 9:26 (Messiah cut off) → Christ's crucifixion, Jerusalem's destruction",
      "Malachi 4:5 (Elijah) → John the Baptist (Matthew 11:14)"
    ]
  },
  {
    level: "3H",
    name: "Third Heaven",
    fullName: "Ultimate/Eschatological Fulfillment",
    tagColor: "gold",
    timeframe: "End times: Second Coming, Millennium, New Earth (future)",
    description: "The final, complete fulfillment of prophecy in the ultimate sense. This is where all the patterns culminate, all promises reach their zenith, and God's plan reaches its cosmic conclusion.",
    characteristics: [
      "Final, complete, exhaustive fulfillment",
      "Cosmic and universal scope",
      "Physical and spiritual realities merge",
      "Christ's second coming and eternal reign",
      "New heavens and new earth",
      "Complete restoration of all things",
      "Satan's final defeat and God's vindication"
    ],
    keyMarkers: [
      "Cosmic language (sun, moon, stars affected)",
      "Universal scope (all nations, whole earth)",
      "Resurrection and judgment themes",
      "New creation terminology",
      "Eternal state descriptions",
      "'Day of the LORD' in its fullest sense",
      "Final restoration of Israel and the nations"
    ],
    audienceClues: [
      "Descriptions beyond any historical fulfillment",
      "Paradise restored imagery",
      "Complete reversal of the curse",
      "Satan's final destruction",
      "Death abolished entirely",
      "God dwelling directly with humanity"
    ],
    commonMistakes: [
      "Ignoring the near and intermediate fulfillments",
      "Literalizing what is symbolic, or vice versa",
      "Missing how earlier fulfillments inform the ultimate",
      "Disconnecting from Christ as the center",
      "Date-setting based on misread prophecies"
    ],
    examples: [
      "Isaiah 11:6-9 (wolf and lamb) → Millennial/New Earth peace",
      "Daniel 7:13-14 (Son of Man) → Christ's glorious return",
      "Zechariah 14 (LORD's feet on Olivet) → Second Coming",
      "Isaiah 65:17 (new heavens and earth) → Revelation 21"
    ]
  }
];

// Prophetic Passages with Three-Heaven Analysis
export const propheticPassages: PropheticPassage[] = [
  {
    id: "isa-7-14",
    reference: "Isaiah 7:14",
    title: "The Virgin Birth / Immanuel Sign",
    text: "Therefore the Lord himself shall give you a sign; Behold, a virgin shall conceive, and bear a son, and shall call his name Immanuel.",
    category: "messianic",
    primaryContext: "Ahaz facing Syrian-Israelite coalition. God offers a sign but Ahaz refuses. Isaiah gives the Immanuel sign as judgment and hope.",
    fulfillments: [
      {
        heaven: "1H",
        event: "Isaiah's son Maher-shalal-hash-baz or a young woman in Ahaz's court",
        date: "c. 734-732 BC",
        description: "The immediate sign for Ahaz: before a child born soon could say 'father and mother,' the two threatening kings would be removed. A young woman ('almah') would conceive and bear a son as a timeline marker.",
        textualMarkers: ["Before the child knows good from evil", "The land you dread will be forsaken"],
        historicalConnection: "Within 2-3 years, both Rezin of Syria and Pekah of Israel were removed. Assyria accomplished this by 732 BC.",
        spiritualSignificance: "Establishes the pattern: a child as a sign, divine presence in crisis, deliverance through unexpected means.",
        proofTexts: ["Isaiah 7:16", "Isaiah 8:3-4", "2 Kings 15:29-30"]
      },
      {
        heaven: "2H",
        event: "Virgin birth of Jesus Christ",
        date: "c. 5-4 BC",
        description: "Matthew explicitly quotes Isaiah 7:14 as fulfilled in Mary's virgin conception of Jesus. The ultimate 'God with us'—deity taking human flesh. This is the definitive fulfillment.",
        textualMarkers: ["Virgin (parthenos in LXX/Matthew)", "Immanuel", "A son"],
        historicalConnection: "Jesus born to the virgin Mary, truly 'God with us' in physical presence for ~33 years.",
        spiritualSignificance: "The ultimate sign: God Himself enters humanity. Not just presence by proxy but God incarnate.",
        proofTexts: ["Matthew 1:22-23", "Luke 1:34-35", "John 1:14"]
      },
      {
        heaven: "3H",
        event: "Eternal Immanuel—God dwelling with His people forever",
        date: "Future/Eternal",
        description: "The final Immanuel: 'The tabernacle of God is with men, and He will dwell with them' (Rev 21:3). The ultimate fulfillment of 'God with us' in unmediated, eternal presence.",
        textualMarkers: ["Immanuel = God with us", "Dwelling", "No more separation"],
        historicalConnection: "New Jerusalem descends; God makes His permanent home with humanity. The veil is gone forever.",
        spiritualSignificance: "What began as a crisis sign becomes eternal reality. God's presence is the ultimate gift—everything else points here.",
        proofTexts: ["Revelation 21:3", "Revelation 22:4", "1 Corinthians 15:28"]
      }
    ],
    interpretiveNotes: [
      "'Almah' (young woman) becomes 'parthenos' (virgin) in the Greek translation—the Spirit guiding Matthew to the deeper meaning",
      "Dual fulfillment is not 'double meaning' but layered depth—each layer builds on the previous",
      "The first fulfillment proves the prophecy; the second reveals its true intent; the third completes it eternally"
    ],
    keyVerses: ["Isaiah 7:14", "Isaiah 8:3-4", "Matthew 1:22-23", "Revelation 21:3"]
  },
  {
    id: "joel-2-28-32",
    reference: "Joel 2:28-32",
    title: "The Outpouring of the Spirit",
    text: "And it shall come to pass afterward, that I will pour out my spirit upon all flesh; and your sons and your daughters shall prophesy, your old men shall dream dreams, your young men shall see visions...",
    category: "eschatological",
    primaryContext: "Following a locust plague that devastated Judah, Joel calls for repentance and promises restoration, culminating in the Day of the LORD.",
    fulfillments: [
      {
        heaven: "1H",
        event: "Restoration after the locust plague",
        date: "c. 835-796 BC (uncertain dating of Joel)",
        description: "The immediate promise that God would restore what the locusts had eaten. 'Afterward' refers to after the repentance and restoration sequence. Spiritual renewal would accompany physical restoration.",
        textualMarkers: ["Afterward", "Pour out my Spirit", "All flesh (initially Israel)"],
        historicalConnection: "Judah's repentance leads to God's intervention. Prophetic/spiritual gifts evident in the subsequent prophetic era.",
        spiritualSignificance: "Establishes the pattern: judgment leads to repentance, repentance leads to restoration, restoration includes spiritual empowerment.",
        proofTexts: ["Joel 2:25", "Joel 2:18-19", "2 Chronicles 24:17-22"]
      },
      {
        heaven: "2H",
        event: "Day of Pentecost—the Spirit on the Church",
        date: "AD 31 (50 days after Christ's resurrection)",
        description: "Peter explicitly declares 'This is that which was spoken by the prophet Joel.' The Spirit falls on 120 disciples with tongues of fire, enabling them to speak in languages they never learned. The Church is born.",
        textualMarkers: ["Last days", "Pour out my Spirit", "All flesh", "Prophesy, dreams, visions", "Before the great and terrible day"],
        historicalConnection: "The disciples gathered in Jerusalem, the Spirit comes with wind and fire, 3,000 souls saved in one day. The 'last days' begin.",
        spiritualSignificance: "The Church Age is the 'afterward'—the Spirit empowers the gospel's global spread. All believers (not just prophets/priests) receive the Spirit.",
        proofTexts: ["Acts 2:16-21", "Acts 2:33", "Acts 2:38-39"]
      },
      {
        heaven: "3H",
        event: "The cosmic Day of the LORD",
        date: "Future—Second Coming and beyond",
        description: "The complete fulfillment: blood, fire, vapor of smoke, sun darkened, moon to blood—cosmic signs preceding Christ's return. Ultimate salvation for all who call on the LORD's name across all nations.",
        textualMarkers: ["Sun into darkness", "Moon into blood", "Great and terrible day of the LORD", "Whoever calls on the name of the LORD"],
        historicalConnection: "These cosmic signs have not yet occurred literally. They await the events surrounding Christ's return.",
        spiritualSignificance: "The ultimate Day arrives. All the partial fulfillments were previews. Now the full reality comes—judgment for the wicked, salvation for those who call.",
        proofTexts: ["Matthew 24:29", "Revelation 6:12-17", "Romans 10:13"]
      }
    ],
    interpretiveNotes: [
      "Peter quotes Joel but the cosmic signs hadn't occurred—showing the 'already/not yet' aspect",
      "The 'last days' began at Pentecost and continue until the Second Coming",
      "'All flesh' expands: first Israel, then Gentiles, finally literally all nations"
    ],
    keyVerses: ["Joel 2:28-32", "Acts 2:16-21", "Romans 10:13"]
  },
  {
    id: "dan-9-24-27",
    reference: "Daniel 9:24-27",
    title: "The Seventy Weeks Prophecy",
    text: "Seventy weeks are determined upon thy people and upon thy holy city, to finish the transgression, and to make an end of sins, and to make reconciliation for iniquity...",
    category: "messianic",
    primaryContext: "Daniel praying for Jerusalem's restoration after 70 years of exile. Gabriel brings revelation about a far greater timeline—490 years leading to Messiah.",
    fulfillments: [
      {
        heaven: "1H",
        event: "Decree to rebuild Jerusalem and temple restoration",
        date: "457 BC (Artaxerxes' decree)",
        description: "The starting point of the 70 weeks. The decree to restore and rebuild Jerusalem initiates the countdown. The first 7 weeks (49 years) cover the rebuilding under difficult circumstances.",
        textualMarkers: ["Going forth of the commandment", "Restore and build Jerusalem", "Troublous times"],
        historicalConnection: "Artaxerxes' decree in 457 BC authorized Ezra to restore Jerusalem's civil and religious life. Nehemiah completed the walls by 408 BC (49 years later).",
        spiritualSignificance: "God's prophetic timeline begins. Precise dating allows verification. The countdown to Messiah is underway.",
        proofTexts: ["Ezra 7:11-26", "Nehemiah 2:1-8", "Daniel 9:25"]
      },
      {
        heaven: "2H",
        event: "Messiah the Prince appears, is cut off; Jerusalem destroyed",
        date: "AD 27 (baptism), AD 31 (crucifixion), AD 70 (destruction)",
        description: "After 69 weeks (483 years from 457 BC = AD 27), Messiah appears at His baptism. He confirms the covenant for one week (7 years). In the midst of the week, He is 'cut off'—crucified. Jerusalem is then destroyed.",
        textualMarkers: ["Unto Messiah the Prince", "After 62 weeks Messiah cut off", "Prince who shall come destroy city and sanctuary", "In the midst of the week"],
        historicalConnection: "Jesus baptized ~AD 27, crucified AD 31 (middle of the 7-year period), Jerusalem destroyed AD 70 by Roman prince Titus.",
        spiritualSignificance: "Christ fulfills the 6 goals: finishes transgression, ends sin, makes reconciliation, brings everlasting righteousness, seals prophecy, anoints Most Holy. His death ends the need for sacrifices.",
        proofTexts: ["Luke 3:1-3", "Galatians 4:4", "Matthew 24:15", "Hebrews 9:12"]
      },
      {
        heaven: "3H",
        event: "Complete fulfillment of atonement; abomination of desolation in final form",
        date: "Future—end-time events",
        description: "Some aspects await final fulfillment: everlasting righteousness fully realized, the ultimate 'abomination of desolation' in the end-time, and the complete sealing of all vision and prophecy.",
        textualMarkers: ["Everlasting righteousness", "Seal up vision and prophecy", "Abomination that makes desolate"],
        historicalConnection: "AD 70 was a type; the final abomination and complete restoration await Christ's return.",
        spiritualSignificance: "The 70th week may have end-time application. All prophecy is finally sealed when Christ returns and history ends.",
        proofTexts: ["Matthew 24:15", "2 Thessalonians 2:3-4", "Revelation 11:2"]
      }
    ],
    interpretiveNotes: [
      "The 70 weeks (490 years) are calculated: 457 BC + 483 years = AD 27; + 3.5 years = AD 31",
      "Various interpretations exist about the final week—continuous, divided, or future",
      "The precision of the timeline is remarkable evidence of divine foreknowledge"
    ],
    keyVerses: ["Daniel 9:24-27", "Ezra 7:11-26", "Galatians 4:4"]
  },
  {
    id: "isa-11-1-10",
    reference: "Isaiah 11:1-10",
    title: "The Branch of Jesse and the Peaceable Kingdom",
    text: "And there shall come forth a rod out of the stem of Jesse, and a Branch shall grow out of his roots... The wolf also shall dwell with the lamb...",
    category: "kingdom",
    primaryContext: "Following prophecies of Assyrian judgment, Isaiah presents the hope of a righteous King from David's line who will bring cosmic peace and restoration.",
    fulfillments: [
      {
        heaven: "1H",
        event: "Restoration under good kings (Hezekiah, Josiah) as partial types",
        date: "c. 715-609 BC",
        description: "Hezekiah and later Josiah provided glimpses of righteous rule after wicked predecessors. The 'stump of Jesse' after near-destruction produced these shoots. Partial peace and reform, but not ultimate.",
        textualMarkers: ["Rod from the stem of Jesse", "Branch from roots", "Spirit of wisdom and understanding"],
        historicalConnection: "After Ahaz's wickedness nearly destroyed the line, Hezekiah ruled righteously. Later Josiah's reforms brought spiritual renewal. Both were 'types' of the coming One.",
        spiritualSignificance: "The pattern is established: from apparent death (stump) comes new life. Righteous rule brings blessing. The Spirit empowers true leadership.",
        proofTexts: ["2 Kings 18:3-6", "2 Kings 22:2", "2 Chronicles 29:2"]
      },
      {
        heaven: "2H",
        event: "Jesus Christ—the Branch of David",
        date: "c. 5 BC - AD 31 (and ongoing spiritual reign)",
        description: "Jesus is explicitly the 'Branch' (Zechariah 6:12), born of David's line when it was reduced to a poor Galilean family. The Spirit rested on Him without measure. His kingdom is now spiritual—peace, righteousness, and knowledge spreading.",
        textualMarkers: ["Branch", "Spirit of the LORD rests on Him", "Righteous judgment", "Earth full of the knowledge of the LORD"],
        historicalConnection: "Jesus born in Bethlehem, city of David. The Spirit descended at baptism. He judged not by appearance but by righteousness. His kingdom grows through the gospel.",
        spiritualSignificance: "The 'peaceable kingdom' is now spiritual—hostility between Jew and Gentile removed (Ephesians 2:14-16). The 'little child shall lead them' = Christ leading His church. Knowledge of the LORD spreads globally.",
        proofTexts: ["Matthew 3:16", "Zechariah 6:12", "Ephesians 2:14-16", "Romans 15:12"]
      },
      {
        heaven: "3H",
        event: "Millennial/Eternal Kingdom—literal peace in nature",
        date: "Future—Millennium and New Earth",
        description: "The complete fulfillment: literal wolf with lamb, child playing at cobra's den, no more violence in all creation. The curse on nature is fully reversed. Christ reigns visibly on earth.",
        textualMarkers: ["Wolf dwells with lamb", "Lion eats straw", "Little child leads them", "No hurt or destroy in all My holy mountain", "Earth full of the knowledge of the LORD"],
        historicalConnection: "These conditions have never existed literally. The curse remains on nature. Violence continues. This awaits the new creation.",
        spiritualSignificance: "Complete restoration of the Edenic state. The curse reversed in every dimension. Creation itself is liberated (Romans 8:21). Shalom in its fullest sense.",
        proofTexts: ["Revelation 20:4-6", "Romans 8:19-22", "Isaiah 65:25"]
      }
    ],
    interpretiveNotes: [
      "The 'Branch' is a messianic title used in Isaiah, Jeremiah, and Zechariah",
      "The animal imagery may be literal (in the new earth) and also symbolic (hostile types of people reconciled)",
      "The sevenfold Spirit (v. 2) = complete divine empowerment"
    ],
    keyVerses: ["Isaiah 11:1-10", "Romans 15:12", "Revelation 20:4-6"]
  },
  {
    id: "ezek-37-1-14",
    reference: "Ezekiel 37:1-14",
    title: "The Valley of Dry Bones",
    text: "The hand of the LORD was upon me, and carried me out in the spirit of the LORD, and set me down in the midst of the valley which was full of bones...",
    category: "restoration",
    primaryContext: "Ezekiel among the exiles in Babylon. Israel seems hopelessly dead spiritually and nationally. God reveals His power to resurrect the dead nation.",
    fulfillments: [
      {
        heaven: "1H",
        event: "Return from Babylonian exile",
        date: "539-516 BC",
        description: "Israel in exile was 'dead'—no temple, no land, no king. The return under Cyrus and rebuilding of the temple was national resurrection. The 'bones' (scattered exiles) came together and received 'life' (national restoration).",
        textualMarkers: ["Graves", "Bring you into the land of Israel", "My people", "Put my spirit in you"],
        historicalConnection: "Cyrus's decree (539 BC) allowed return. Temple rebuilt by 516 BC. A remnant returned and the nation revived—though incompletely.",
        spiritualSignificance: "God can restore what seems impossibly dead. The pattern: scattering, death, prophetic word, gathering, life. Faith is required to prophesy to dry bones.",
        proofTexts: ["Ezra 1:1-4", "Ezra 6:14-15", "Isaiah 44:28"]
      },
      {
        heaven: "2H",
        event: "Spiritual resurrection—new birth in Christ; the Church",
        date: "AD 31 onward",
        description: "Paul applies resurrection language to salvation: 'You were dead in trespasses and sins... God made you alive together with Christ' (Ephesians 2:1-5). Pentecost brought the Spirit that gives life. Each believer experiences personal 'dry bones' resurrection.",
        textualMarkers: ["My spirit in you", "Live", "Know that I am the LORD"],
        historicalConnection: "The Church is formed of 'dead' people made alive. Jews and Gentiles become one body—a greater resurrection than national Israel alone.",
        spiritualSignificance: "Salvation IS resurrection. The Spirit brings life where there was none. The gospel is the prophetic word spoken to dead humanity.",
        proofTexts: ["Ephesians 2:1-5", "Colossians 2:13", "John 5:24"]
      },
      {
        heaven: "3H",
        event: "Literal bodily resurrection of all the dead",
        date: "Future—Second Coming and Final Judgment",
        description: "The ultimate fulfillment: literal bodies rising from graves. 'The hour is coming when all who are in the tombs will hear His voice and come out' (John 5:28-29). The general resurrection at the end of the age.",
        textualMarkers: ["Graves", "Raise you up", "Body and spirit reunited", "Live forever"],
        historicalConnection: "This has not yet happened. Bodies are still in graves. The literal, physical resurrection awaits Christ's return.",
        spiritualSignificance: "The hope of all who die in Christ. Bodies 'sown in corruption, raised in incorruption.' Death is finally swallowed up in victory.",
        proofTexts: ["John 5:28-29", "1 Corinthians 15:51-57", "1 Thessalonians 4:16"]
      }
    ],
    interpretiveNotes: [
      "The vision explicitly interprets itself: 'These bones are the whole house of Israel' (v. 11)",
      "The two-stage process (bones connect, then breath enters) parallels conversion and Spirit-baptism",
      "Ezekiel must prophesy TO the bones—the Word precedes resurrection"
    ],
    keyVerses: ["Ezekiel 37:1-14", "Ephesians 2:1-5", "1 Corinthians 15:51-57"]
  },
  {
    id: "dan-2",
    reference: "Daniel 2",
    title: "Nebuchadnezzar's Image—Four World Empires",
    text: "Thou, O king, sawest, and behold a great image... This image's head was of fine gold, his breast and his arms of silver, his belly and his thighs of brass, his legs of iron, his feet part of iron and part of clay...",
    category: "kingdom",
    primaryContext: "Nebuchadnezzar's dream troubles him. Daniel reveals and interprets: four successive world empires, then God's eternal kingdom.",
    fulfillments: [
      {
        heaven: "1H",
        event: "The sequence of empires: Babylon, Medo-Persia, Greece",
        date: "605 BC - 63 BC (Babylon to Rome's conquest)",
        description: "The immediate fulfillment visible in Daniel's own lifetime and shortly after: Babylon fell to Medo-Persia (539 BC), which fell to Greece (331 BC). The historical sequence verified the prophecy.",
        textualMarkers: ["Head of gold", "Breast of silver", "Belly of brass", "You are this head of gold", "Another kingdom inferior"],
        historicalConnection: "Daniel served under Babylon and Medo-Persia. Greece under Alexander conquered the known world. Each transition verified the vision.",
        spiritualSignificance: "Establishes prophetic reliability. God reveals history in advance. Human empires rise and fall according to divine plan.",
        proofTexts: ["Daniel 2:37-39", "Daniel 5:28-31", "Daniel 8:20-21"]
      },
      {
        heaven: "2H",
        event: "Rome (legs of iron); divided Rome (iron and clay)",
        date: "63 BC - present (Rome through medieval Europe to modern nations)",
        description: "Rome as the fourth kingdom (iron). Its division into east/west (two legs), then fragmentation into medieval kingdoms (iron mixed with clay—partly strong, partly brittle). Attempts to reunite always fail.",
        textualMarkers: ["Legs of iron", "Feet of iron and clay", "The kingdom shall be divided", "They shall not cleave one to another"],
        historicalConnection: "Rome conquered in 63 BC. Divided AD 395. Fragmented into European nations. Attempts at reunification (Charlemagne, Napoleon, Hitler) all failed—'iron and clay do not mix.'",
        spiritualSignificance: "Human political unity apart from God is impossible. The empire phase of history. The world stage is set for the final act.",
        proofTexts: ["Daniel 2:40-43", "Luke 2:1", "Revelation 17:12"]
      },
      {
        heaven: "3H",
        event: "The Stone Kingdom—God's eternal reign",
        date: "Future—Second Coming and eternal state",
        description: "The stone 'cut without hands' strikes the image's feet, destroying all human kingdoms. It becomes a great mountain filling the whole earth. God's kingdom, set up in the days of the last kings, endures forever.",
        textualMarkers: ["Stone cut without hands", "Smote the image on the feet", "Became a great mountain", "Filled the whole earth", "Never be destroyed"],
        historicalConnection: "Christ's kingdom began spiritually at His first coming but awaits visible, universal establishment. The stone strikes during the 'toes' phase—the final form of divided power.",
        spiritualSignificance: "God's kingdom is not of human origin (cut without hands). It supersedes all human power. What begins small (stone) becomes all-encompassing (mountain). Christ reigns forever.",
        proofTexts: ["Daniel 2:44-45", "Revelation 11:15", "1 Corinthians 15:24-25"]
      }
    ],
    interpretiveNotes: [
      "The decreasing value of metals (gold to clay) parallels decreasing quality of governance—Nebuchadnezzar's absolute monarchy to modern democracy/division",
      "The stone strikes the FEET (the final phase), not the head—timing matters",
      "This is the foundation prophecy that Daniel 7, 8, and 11 expand upon"
    ],
    keyVerses: ["Daniel 2:31-45", "Revelation 11:15"]
  }
];

// Prophetic Patterns for Multi-Level Interpretation
export const propheticPatterns: PropheticPattern[] = [
  {
    id: "exodus-pattern",
    name: "The Exodus Pattern",
    description: "Deliverance from bondage through blood, water, wilderness, and inheritance. This pattern recurs throughout Scripture at multiple levels.",
    pattern: "Bondage → Blood/Passover → Water Crossing → Wilderness Testing → Promised Land",
    examples: [
      {
        passage: "Exodus 1-15",
        firstHeaven: "Israel's literal exodus from Egypt (1446 BC)",
        secondHeaven: "Christ delivers from sin's bondage; baptism; wilderness temptation; church as spiritual Israel",
        thirdHeaven: "Final exodus from this world; crossing Jordan of death; heavenly Canaan"
      },
      {
        passage: "Isaiah 11:15-16",
        firstHeaven: "Return from Babylon (539 BC)—a 'second exodus'",
        secondHeaven: "Gospel crossing all barriers to reach the nations",
        thirdHeaven: "The final regathering at Christ's return"
      }
    ]
  },
  {
    id: "temple-pattern",
    name: "The Temple Pattern",
    description: "God dwelling with His people through tabernacle/temple, Christ's body, believers, and ultimately New Jerusalem.",
    pattern: "God's Presence → Physical Structure → Christ Incarnate → Believers as Temple → Eternal Dwelling",
    examples: [
      {
        passage: "Exodus 25:8; John 1:14; 1 Cor 6:19; Rev 21:3",
        firstHeaven: "Tabernacle/Temple—God dwells among Israel",
        secondHeaven: "Christ 'tabernacled' among us; we are temples of the Spirit",
        thirdHeaven: "New Jerusalem—God dwells with humanity forever"
      }
    ]
  },
  {
    id: "day-of-lord-pattern",
    name: "The Day of the LORD Pattern",
    description: "Divine intervention in judgment and deliverance, recurring at multiple historical points, culminating in the final Day.",
    pattern: "Sin → Warning → Day of Judgment → Remnant Saved → Restoration",
    examples: [
      {
        passage: "Joel 1-3",
        firstHeaven: "Locust plague and Babylonian invasion of Judah",
        secondHeaven: "Pentecost (Acts 2:16-21); Jerusalem's destruction (AD 70)",
        thirdHeaven: "The ultimate Day—cosmic signs, Christ's return, final judgment"
      },
      {
        passage: "Isaiah 13",
        firstHeaven: "Babylon's fall to Medo-Persia (539 BC)",
        secondHeaven: "Rome's fall; every proud empire judged",
        thirdHeaven: "Final Babylon destroyed (Revelation 18)"
      }
    ]
  },
  {
    id: "remnant-pattern",
    name: "The Remnant Pattern",
    description: "From the many, a faithful few are preserved through judgment to carry forward God's purposes.",
    pattern: "Majority Falls → Remnant Faithful → Judgment on Majority → Remnant Preserved → New Beginning",
    examples: [
      {
        passage: "Isaiah 10:20-22",
        firstHeaven: "Remnant returns from Babylon; 'Jacob' survives Assyria",
        secondHeaven: "Jewish believers in Christ; the Church as faithful remnant from Israel",
        thirdHeaven: "'All Israel shall be saved'—end-time remnant of both Jews and Gentiles"
      }
    ]
  }
];

// Helper Functions
export const getHeavenExplanation = (level: HeavenLevel): ThreeHeavensExplanation | undefined => {
  return threeHeavensExplanations.find(h => h.level === level);
};

export const getPassagesByCategory = (category: ProphecyCategory): PropheticPassage[] => {
  return propheticPassages.filter(p => p.category === category);
};

export const getFulfillmentsByHeaven = (heaven: HeavenLevel): PropheticFulfillment[] => {
  const fulfillments: PropheticFulfillment[] = [];
  propheticPassages.forEach(p => {
    p.fulfillments.forEach(f => {
      if (f.heaven === heaven) {
        fulfillments.push(f);
      }
    });
  });
  return fulfillments;
};

export const searchProphecies = (query: string): PropheticPassage[] => {
  const lowerQuery = query.toLowerCase();
  return propheticPassages.filter(p =>
    p.title.toLowerCase().includes(lowerQuery) ||
    p.reference.toLowerCase().includes(lowerQuery) ||
    p.text.toLowerCase().includes(lowerQuery) ||
    p.fulfillments.some(f => f.description.toLowerCase().includes(lowerQuery))
  );
};

export const getTotalPassagesCount = (): number => {
  return propheticPassages.length;
};

export const getPassageById = (id: string): PropheticPassage | undefined => {
  return propheticPassages.find(p => p.id === id);
};

export const getAllPatterns = (): PropheticPattern[] => {
  return propheticPatterns;
};
