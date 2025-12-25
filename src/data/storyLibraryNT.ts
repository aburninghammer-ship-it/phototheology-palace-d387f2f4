// New Testament Stories: Matthew through Revelation

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

// Gospels
export const matthewStories: BiblicalStory[] = [
  {
    id: "sermon-mount",
    title: "Sermon on the Mount",
    reference: "Matthew 5-7",
    volume: "Matthew",
    category: "Gospels",
    summary: "Jesus' foundational teaching. Beatitudes: blessed are poor in spirit, mourning, meek, hungry for righteousness. Salt and light. Exceeding Pharisees' righteousness. Lord's Prayer. Don't worry. Judge not. Build on rock.",
    keyElements: ["Beatitudes", "Salt and light", "Fulfill the law", "Anger as murder", "Lust as adultery", "Love enemies", "Lord's Prayer", "Don't worry", "Seek first kingdom", "Judge not", "Golden Rule", "Build on rock"],
    christPattern: [
      { element: "Greater Moses", christApplication: "Christ gives new law from mountain" },
      { element: "Kingdom ethics", christApplication: "Life in Christ's kingdom" },
      { element: "Rock foundation", christApplication: "Christ is the Rock" }
    ],
    dimensions: {
      literal: "Jesus' ethical teaching",
      christ: "Christ is the righteous standard",
      personal: "How should I live?",
      church: "Church lives by these principles",
      heavenFuture: "Kingdom fully realized",
      heavenPast: "Law always pointed here"
    },
    relatedStories: ["Luke 6:17-49 (Sermon on Plain)", "Deuteronomy 5 (Moses' law)"],
    keyFigures: ["Jesus", "Disciples", "Crowds"],
    setting: "Mountain in Galilee"
  },
  {
    id: "great-commission",
    title: "Great Commission",
    reference: "Matthew 28:18-20",
    volume: "Matthew",
    category: "Gospels",
    summary: "Risen Jesus declares all authority is His in heaven and earth. Commands: Go make disciples of all nations, baptizing in name of Father, Son, and Holy Spirit, teaching all He commanded. Promise: 'I am with you always.'",
    keyElements: ["All authority given", "Go therefore", "Make disciples", "All nations", "Baptizing", "Father, Son, Spirit", "Teaching to observe", "All things commanded", "I am with you", "To end of age"],
    christPattern: [
      { element: "All authority", christApplication: "Christ is Lord of all" },
      { element: "Go to all nations", christApplication: "Gospel universal" },
      { element: "I am with you", christApplication: "Emmanuel—God with us" }
    ],
    dimensions: {
      literal: "Jesus' final command",
      christ: "Christ sends His church",
      personal: "I am sent to make disciples",
      church: "Church's mission defined",
      heavenFuture: "All nations reached",
      heavenPast: "Plan from before foundation"
    },
    relatedStories: ["Acts 1:8", "Mark 16:15", "Luke 24:47"],
    keyFigures: ["Jesus", "Eleven disciples"],
    setting: "Mountain in Galilee"
  }
];

export const markStories: BiblicalStory[] = [
  {
    id: "jesus-baptism",
    title: "Jesus' Baptism",
    reference: "Mark 1:9-11",
    volume: "Mark",
    category: "Gospels",
    summary: "Jesus comes from Nazareth to John at Jordan. As He rises from water, heavens torn open, Spirit descends like dove. Voice: 'You are My beloved Son, in whom I am well pleased.'",
    keyElements: ["From Nazareth", "Baptized by John", "Coming up from water", "Heavens torn", "Spirit like dove", "Descending on Him", "Voice from heaven", "My beloved Son", "Well pleased"],
    christPattern: [
      { element: "Heavens open", christApplication: "Access to God restored" },
      { element: "Spirit descends", christApplication: "Anointed with Spirit" },
      { element: "Father's approval", christApplication: "Righteous obedience" }
    ],
    dimensions: {
      literal: "Jesus' baptism event",
      christ: "Trinity revealed at baptism",
      personal: "My baptism identifies with Christ",
      church: "Church practices baptism",
      heavenFuture: "Full revelation of Trinity",
      heavenPast: "Eternal relationships"
    },
    relatedStories: ["Matthew 3:13-17", "Luke 3:21-22", "John 1:32-34"],
    keyFigures: ["Jesus", "John the Baptist"],
    setting: "Jordan River"
  }
];

export const lukeStories: BiblicalStory[] = [
  {
    id: "prodigal-son",
    title: "Prodigal Son",
    reference: "Luke 15:11-32",
    volume: "Luke",
    category: "Parables",
    summary: "Younger son takes inheritance, wastes it in far country. Starving with pigs, 'comes to himself,' returns to father. Father runs, embraces, restores—robe, ring, sandals, feast. Elder brother resents; father pleads with him too.",
    keyElements: ["Give me my share", "Far country", "Riotous living", "Famine and pigs", "Came to himself", "\"Father, I have sinned\"", "Father ran to meet", "Kiss and embrace", "Best robe", "Ring and sandals", "Kill fatted calf", "Elder brother's anger", "\"Always with me\""],
    christPattern: [
      { element: "Father's love", christApplication: "God's love for sinners" },
      { element: "Running to meet", christApplication: "God initiates reconciliation" },
      { element: "Full restoration", christApplication: "Complete forgiveness in Christ" }
    ],
    dimensions: {
      literal: "Parable of lost son",
      christ: "Christ reveals Father's heart",
      personal: "I can return to the Father",
      church: "Church welcomes the returning",
      heavenFuture: "Great celebration",
      heavenPast: "God's heart never changed"
    },
    relatedStories: ["Luke 15:1-7 (Lost Sheep)", "Luke 15:8-10 (Lost Coin)"],
    keyFigures: ["Father", "Younger son", "Elder son"],
    setting: "Parable"
  },
  {
    id: "road-emmaus",
    title: "Road to Emmaus",
    reference: "Luke 24:13-35",
    volume: "Luke",
    category: "Gospels",
    summary: "Two disciples walk to Emmaus, discussing crucifixion. Jesus joins but they don't recognize Him. He expounds Moses and Prophets—all about Himself. At supper, He breaks bread; eyes opened; He vanishes. 'Did not our hearts burn?'",
    keyElements: ["Seven miles to Emmaus", "Talking and reasoning", "Jesus drew near", "Eyes restrained", "\"What things?\"", "\"We hoped He was the One\"", "Beginning at Moses", "All Scriptures", "Things concerning Himself", "Hearts burning", "Breaking bread", "Eyes opened", "He vanished"],
    christPattern: [
      { element: "Christ in all Scripture", christApplication: "Bible is about Christ" },
      { element: "Hearts burning", christApplication: "Spirit illuminates Word" },
      { element: "Known in breaking bread", christApplication: "Communion reveals Christ" }
    ],
    dimensions: {
      literal: "Post-resurrection encounter",
      christ: "All Scripture points to Christ",
      personal: "My heart burns when He opens Word",
      church: "Church gathers around Word and bread",
      heavenFuture: "Face to face understanding",
      heavenPast: "Christ always in Scripture"
    },
    relatedStories: ["John 5:39 (Scriptures testify)", "Acts 8:35 (Philip opens Scripture)"],
    keyFigures: ["Jesus", "Cleopas", "Other disciple"],
    setting: "Road to Emmaus"
  }
];

export const johnStories: BiblicalStory[] = [
  {
    id: "word-became-flesh",
    title: "Word Became Flesh",
    reference: "John 1:1-18",
    volume: "John",
    category: "Gospels",
    summary: "In the beginning was the Word, and the Word was with God, and the Word was God. All things made through Him. In Him was life, the light of men. The Word became flesh, dwelt among us—full of grace and truth. We beheld His glory.",
    keyElements: ["In the beginning", "Word was God", "All things through Him", "Life in Him", "Light of men", "Darkness cannot overcome", "John bore witness", "True Light coming", "World didn't know", "His own received not", "Power to become children", "Born of God", "Word became flesh", "Dwelt among us", "Beheld His glory", "Grace and truth"],
    christPattern: [
      { element: "Word is God", christApplication: "Christ is fully divine" },
      { element: "Became flesh", christApplication: "Incarnation" },
      { element: "Grace and truth", christApplication: "Christ's character" }
    ],
    dimensions: {
      literal: "John's prologue",
      christ: "Christ's divine nature and incarnation",
      personal: "The Word dwells with me",
      church: "Church proclaims incarnation",
      heavenFuture: "We shall be like Him",
      heavenPast: "Word from eternity"
    },
    relatedStories: ["Genesis 1:1", "Colossians 1:15-20", "Hebrews 1:1-3"],
    keyFigures: ["The Word (Christ)", "John the Baptist"],
    setting: "Cosmic/eternal perspective"
  },
  {
    id: "raising-lazarus",
    title: "Raising of Lazarus",
    reference: "John 11:1-44",
    volume: "John",
    category: "Gospels",
    summary: "Lazarus is sick; Jesus delays. He dies. 'This sickness is for God's glory.' Jesus arrives; Lazarus dead four days. Martha: 'If You had been here.' 'I am the resurrection and the life.' Jesus weeps. At tomb: 'Lazarus, come forth!' He emerges bound; 'Loose him.'",
    keyElements: ["Lazarus sick", "Jesus delays", "\"For God's glory\"", "\"Fallen asleep\"", "Four days dead", "Martha's faith", "\"I am resurrection and life\"", "Mary weeps", "Jesus wept", "Groaning in Spirit", "\"Take away stone\"", "\"Did I not say believe?\"", "Loud voice: \"Lazarus, come forth!\"", "Bound hand and foot", "\"Loose him, let him go\""],
    christPattern: [
      { element: "I AM resurrection", christApplication: "Christ has power over death" },
      { element: "Jesus wept", christApplication: "Christ shares our sorrow" },
      { element: "Voice raises dead", christApplication: "At His voice, all will rise" }
    ],
    dimensions: {
      literal: "Lazarus raised from dead",
      christ: "Christ conquers death",
      personal: "He is my resurrection",
      church: "Church has resurrection hope",
      heavenFuture: "All will hear His voice and rise",
      heavenPast: "Life was always in Him"
    },
    relatedStories: ["John 5:28-29 (Voice raises all)", "1 Thessalonians 4:16"],
    keyFigures: ["Jesus", "Lazarus", "Mary", "Martha"],
    setting: "Bethany"
  }
];

// Acts
export const actsStories: BiblicalStory[] = [
  {
    id: "pentecost",
    title: "Pentecost",
    reference: "Acts 2",
    volume: "Acts",
    category: "Church",
    summary: "Disciples gathered on Pentecost. Sound like rushing wind fills house. Tongues of fire rest on each. They speak in other languages. Crowd amazed—each hears own language. Peter preaches; 3,000 baptized. Church devoted to apostles' teaching, fellowship, breaking bread, prayer.",
    keyElements: ["Fifty days after Passover", "All with one accord", "Sound from heaven", "Mighty wind", "Tongues of fire", "Divided on each", "Spoke other languages", "Devout from every nation", "Each heard own tongue", "\"What does this mean?\"", "Peter's sermon", "\"This is what Joel prophesied\"", "Cut to heart", "3,000 baptized", "Devoted to teaching", "Fellowship, bread, prayers"],
    christPattern: [
      { element: "Spirit poured out", christApplication: "Christ sends the Spirit" },
      { element: "All nations hear", christApplication: "Gospel for all" },
      { element: "Church born", christApplication: "Christ builds His church" }
    ],
    dimensions: {
      literal: "Birth of the church",
      christ: "Christ fulfills His promise",
      personal: "Spirit available to me",
      church: "Church empowered for mission",
      heavenFuture: "Latter rain outpouring",
      heavenPast: "Plan from eternity"
    },
    relatedStories: ["Joel 2:28-32", "John 14:16-17", "Acts 1:8"],
    keyFigures: ["Peter", "Apostles", "3,000 converts"],
    setting: "Jerusalem, Pentecost"
  },
  {
    id: "paul-conversion",
    title: "Paul's Conversion",
    reference: "Acts 9:1-19",
    volume: "Acts",
    category: "Church",
    summary: "Saul breathes threats against disciples, gets letters to arrest in Damascus. On road, light from heaven; falls down. 'Saul, Saul, why do you persecute Me?' 'Who are You, Lord?' 'I am Jesus.' Blinded three days. Ananias sent; scales fall; baptized; begins preaching Christ.",
    keyElements: ["Breathing threats", "Letters for Damascus", "Light from heaven", "Fell to ground", "\"Saul, Saul\"", "\"Why persecute Me?\"", "\"Who are You?\"", "\"I am Jesus\"", "Blind three days", "Neither ate nor drank", "Ananias' vision", "Chosen vessel", "Scales fell", "Received sight", "Baptized", "Immediately preached"],
    christPattern: [
      { element: "Persecutor becomes preacher", christApplication: "Grace transforms" },
      { element: "\"I am Jesus\"", christApplication: "Christ identifies with church" },
      { element: "Chosen vessel", christApplication: "God chooses and uses" }
    ],
    dimensions: {
      literal: "Saul's dramatic conversion",
      christ: "Christ transforms enemies",
      personal: "God can save anyone",
      church: "Church gains greatest missionary",
      heavenFuture: "All transformed",
      heavenPast: "God's plan for Paul"
    },
    relatedStories: ["Acts 22:1-21", "Acts 26:9-18", "Galatians 1:13-16"],
    keyFigures: ["Saul/Paul", "Jesus", "Ananias"],
    setting: "Road to Damascus"
  }
];

// Epistles
export const romansStories: BiblicalStory[] = [
  {
    id: "romans-gospel",
    title: "The Gospel Explained",
    reference: "Romans 1-8",
    volume: "Romans",
    category: "Epistles",
    summary: "Paul's systematic gospel: all have sinned (Jew and Gentile), justified by faith apart from works, Abraham believed and it was counted as righteousness, dead to sin/alive in Christ, nothing separates us from God's love.",
    keyElements: ["Not ashamed of gospel", "Power of God to salvation", "Wrath revealed", "All have sinned", "Justified by faith", "Abraham's faith", "Peace with God", "While sinners, Christ died", "Dead to sin, alive to God", "No condemnation", "Spirit gives life", "Nothing can separate"],
    christPattern: [
      { element: "Justification by faith", christApplication: "Christ is our righteousness" },
      { element: "Dead and risen with Christ", christApplication: "Union with Christ" },
      { element: "Nothing separates", christApplication: "Christ's inseparable love" }
    ],
    dimensions: {
      literal: "Doctrinal epistle",
      christ: "Christ is our righteousness",
      personal: "I am justified by faith",
      church: "Church preaches this gospel",
      heavenFuture: "Glorification certain",
      heavenPast: "Gospel planned eternally"
    },
    relatedStories: ["Galatians 2-3", "Ephesians 2:8-9"],
    keyFigures: ["Paul", "Abraham"],
    setting: "Written to Rome"
  }
];

export const corinthians1Stories: BiblicalStory[] = [
  {
    id: "resurrection-chapter",
    title: "Resurrection Chapter",
    reference: "1 Corinthians 15",
    volume: "1 Corinthians",
    category: "Epistles",
    summary: "Christ died for sins, was buried, rose third day. If no resurrection, faith is vain. But Christ IS risen—firstfruits. As in Adam all die, in Christ all made alive. Last enemy is death. Mortal puts on immortality. O death, where is your sting?",
    keyElements: ["Christ died for sins", "Buried and rose", "Seen by 500+", "If no resurrection, vain faith", "Christ IS risen", "Firstfruits", "In Adam—death; in Christ—life", "Each in own order", "Last enemy—death", "Twinkling of an eye", "Trumpet sounds", "Dead raised incorruptible", "Mortal → immortality", "Death swallowed in victory", "O death, where is sting?"],
    christPattern: [
      { element: "Christ rose", christApplication: "Foundation of faith" },
      { element: "Firstfruits", christApplication: "Guarantees our resurrection" },
      { element: "Death defeated", christApplication: "Christ conquered death" }
    ],
    dimensions: {
      literal: "Doctrine of resurrection",
      christ: "Christ rose and we will rise",
      personal: "I will be raised",
      church: "Church's blessed hope",
      heavenFuture: "Resurrection at last trumpet",
      heavenPast: "Planned before foundation"
    },
    relatedStories: ["1 Thessalonians 4:13-18", "Revelation 20:4-6"],
    keyFigures: ["Paul", "Christ"],
    setting: "Written to Corinth"
  }
];

export const ephesiansStories: BiblicalStory[] = [
  {
    id: "armor-god",
    title: "Armor of God",
    reference: "Ephesians 6:10-18",
    volume: "Ephesians",
    category: "Epistles",
    summary: "Be strong in the Lord. Put on whole armor against principalities and powers. Belt of truth, breastplate of righteousness, shoes of gospel, shield of faith, helmet of salvation, sword of Spirit (Word of God). Pray always.",
    keyElements: ["Strong in the Lord", "Whole armor", "Wrestle not flesh", "Principalities, powers", "Stand against wiles", "Belt of truth", "Breastplate of righteousness", "Feet shod with gospel", "Shield of faith", "Quench fiery darts", "Helmet of salvation", "Sword of Spirit", "Praying always"],
    christPattern: [
      { element: "Each piece is Christ", christApplication: "Truth, righteousness, peace—Christ is all" },
      { element: "Sword is Word", christApplication: "Christ is the Word" },
      { element: "Victory assured", christApplication: "In Christ we stand" }
    ],
    dimensions: {
      literal: "Spiritual warfare instruction",
      christ: "Christ is our armor",
      personal: "I must put on armor daily",
      church: "Church in spiritual battle",
      heavenFuture: "Final victory",
      heavenPast: "War began in heaven"
    },
    relatedStories: ["Isaiah 59:17 (God's armor)", "Romans 13:12"],
    keyFigures: ["Paul"],
    setting: "Written from prison"
  }
];

export const philippiansStories: BiblicalStory[] = [
  {
    id: "christ-hymn",
    title: "Christ Hymn",
    reference: "Philippians 2:5-11",
    volume: "Philippians",
    category: "Epistles",
    summary: "Have the mind of Christ who, being God, didn't grasp equality but emptied Himself, took servant form, human likeness, humbled to death—even the cross. Therefore God highly exalted Him; every knee will bow, every tongue confess Jesus is Lord.",
    keyElements: ["Mind of Christ", "Form of God", "Didn't grasp equality", "Emptied Himself", "Servant form", "Likeness of men", "Humbled Himself", "Obedient to death", "Even the cross", "Highly exalted", "Name above every name", "Every knee bow", "Every tongue confess", "Jesus is Lord"],
    christPattern: [
      { element: "Self-emptying", christApplication: "Christ's humility" },
      { element: "Obedient to death", christApplication: "Perfect obedience" },
      { element: "Highly exalted", christApplication: "Humility leads to exaltation" }
    ],
    dimensions: {
      literal: "Early Christian hymn",
      christ: "Christ's descent and ascent",
      personal: "Have this mind",
      church: "Church follows His pattern",
      heavenFuture: "Every knee will bow",
      heavenPast: "Christ in form of God"
    },
    relatedStories: ["John 13:1-17 (Washing feet)", "Isaiah 45:23"],
    keyFigures: ["Christ"],
    setting: "Hymn quoted by Paul"
  }
];

export const hebrewsStories: BiblicalStory[] = [
  {
    id: "faith-hall",
    title: "Faith Hall of Fame",
    reference: "Hebrews 11",
    volume: "Hebrews",
    category: "Epistles",
    summary: "Faith is substance of hoped, evidence of unseen. By faith: Abel offered, Enoch translated, Noah built ark, Abraham obeyed, Sarah conceived, Moses chose suffering. They all died in faith, not receiving promises, looking for heavenly city.",
    keyElements: ["Faith is substance", "Evidence of unseen", "By faith Abel", "Enoch translated", "Noah built ark", "Abraham obeyed", "Looked for city", "Sarah conceived", "Moses refused Egypt", "Walls of Jericho fell", "World not worthy", "All died in faith", "Not receiving promises", "Seeing afar off", "Better resurrection"],
    christPattern: [
      { element: "All looked to Christ", christApplication: "Christ the object of OT faith" },
      { element: "Better resurrection", christApplication: "Christ's resurrection guarantees" },
      { element: "Heavenly city", christApplication: "Christ prepares our home" }
    ],
    dimensions: {
      literal: "Heroes of faith",
      christ: "All trusted in coming Messiah",
      personal: "Live by faith like them",
      church: "Cloud of witnesses",
      heavenFuture: "City whose builder is God",
      heavenPast: "Faith always the way"
    },
    relatedStories: ["Genesis-Joshua (Stories referenced)", "Hebrews 12:1-2"],
    keyFigures: ["Abel", "Enoch", "Noah", "Abraham", "Moses"],
    setting: "N/A - Theological teaching"
  }
];

// Revelation
export const revelationStories: BiblicalStory[] = [
  {
    id: "new-jerusalem",
    title: "New Jerusalem",
    reference: "Revelation 21-22",
    volume: "Revelation",
    category: "Prophecy",
    summary: "New heaven and earth. New Jerusalem descends as bride. God dwells with man—no tears, death, pain. City of gold, 12 gates of pearl, foundations of jewels. River of life, tree of life. No night, no temple—God and Lamb are light and temple. 'Behold, I am coming quickly.'",
    keyElements: ["New heaven, new earth", "First passed away", "No more sea", "New Jerusalem descends", "Bride adorned", "God dwells with man", "Wipe away tears", "No more death", "All things new", "12 gates, 12 foundations", "Gold like glass", "River of life", "Tree of life", "Leaves for healing", "No more curse", "See His face", "His name on foreheads", "No night", "Come quickly"],
    christPattern: [
      { element: "Lamb is light", christApplication: "Christ is the eternal Light" },
      { element: "Lamb is temple", christApplication: "No barrier—direct presence" },
      { element: "Tree of life restored", christApplication: "Eden regained through Christ" }
    ],
    dimensions: {
      literal: "Vision of eternal home",
      christ: "Christ brings us home",
      personal: "This is my destination",
      church: "Church is the Bride",
      heavenFuture: "This is heaven!",
      heavenPast: "Eden restored and surpassed"
    },
    relatedStories: ["Genesis 2 (Eden)", "Isaiah 65:17-25", "Ezekiel 47 (River)"],
    keyFigures: ["God", "Lamb", "Bride", "John"],
    setting: "Eternal state"
  },
  {
    id: "three-angels",
    title: "Three Angels' Messages",
    reference: "Revelation 14:6-12",
    volume: "Revelation",
    category: "Prophecy",
    summary: "First angel: everlasting gospel to all nations—fear God, give glory, worship Creator. Second angel: Babylon is fallen. Third angel: if anyone worships beast and receives mark, drinks wrath. Here is patience of saints who keep commandments and faith of Jesus.",
    keyElements: ["Angel flying in heaven", "Everlasting gospel", "Every nation, tongue", "Fear God", "Give glory", "Hour of judgment come", "Worship Him who made", "Babylon is fallen", "If anyone worships beast", "Receives mark", "Drink wrath unmixed", "Tormented with fire", "Patience of saints", "Keep commandments", "Faith of Jesus"],
    christPattern: [
      { element: "Everlasting gospel", christApplication: "Christ's eternal good news" },
      { element: "Worship Creator", christApplication: "Christ as Creator" },
      { element: "Faith OF Jesus", christApplication: "Christ's own faithfulness" }
    ],
    dimensions: {
      literal: "Final gospel proclamation",
      christ: "Christ's final appeal",
      personal: "Which side am I on?",
      church: "Church proclaims these messages",
      heavenFuture: "Judgment hour message",
      heavenPast: "Cosmic conflict climax"
    },
    relatedStories: ["Matthew 24:14", "Revelation 18:1-4"],
    keyFigures: ["Three angels"],
    setting: "End-time proclamation"
  }
];
