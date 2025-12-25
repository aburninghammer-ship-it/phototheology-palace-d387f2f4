// Comprehensive Biblical Symbols Library
// Based on the Phototheology Symbols Reference Guide

export interface BiblicalSymbol {
  symbol: string;
  emoji?: string;
  meaning: string;
  dimensions?: {
    literal?: string;
    christ?: string;
    personal?: string;
    church?: string;
    heaven?: string;
  };
  keyTexts?: string[];
  relatedSymbols?: string[];
  notes?: string;
  // Additional PT Principles
  pattern?: string;        // Patterns Room (PRm) - recurring motifs
  parallel?: string;       // Parallels Room (P‖) - mirrored actions
  type?: string;           // Symbols/Types Room (ST) - typological meaning
  cycle?: string;          // Cycles (@Ad, @No, @Mo, etc.)
  theme?: string;          // Theme Room (TRm) - sanctuary, GC, gospel
  sanctuary?: string;      // Blue Room (BL) - sanctuary connection
  prophecy?: string;       // Prophecy Room (PR) - prophetic significance
  freestyle?: string;      // Freestyle application - nature/personal/history
}

export interface SymbolCategory {
  id: string;
  name: string;
  icon: string;
  description: string;
  symbols: BiblicalSymbol[];
}

export const biblicalSymbolsLibrary: SymbolCategory[] = [
  // PART I: SANCTUARY SYMBOLS
  {
    id: "sanctuary-courtyard",
    name: "Sanctuary: Courtyard",
    icon: "⛪",
    description: "Courtyard furniture representing the entry into God's presence",
    symbols: [
      {
        symbol: "Altar of Burnt Offering",
        emoji: "🔥",
        meaning: "Sacrifice, Death, Atonement",
        dimensions: {
          literal: "Place of animal sacrifice",
          christ: "The Cross - Christ's sacrifice",
          personal: "Death to self, complete surrender",
          church: "Founded on Christ's sacrifice",
          heaven: "The Lamb slain from foundation of world"
        },
        keyTexts: ["Exodus 27:1-8", "Hebrews 13:10", "Revelation 6:9"],
        relatedSymbols: ["Fire = Purification", "Ashes = Complete consumption", "Horns = Power, refuge", "Blood at base = Life poured out"],
        type: "Cross of Christ - every OT altar pointed forward to Calvary",
        pattern: "Sacrifice pattern: Abel's lamb → Abraham's ram → Passover → Daily sacrifices → Christ",
        parallel: "Cain's rejected offering ‖ Nadab/Abihu's strange fire ‖ false worship in last days",
        cycle: "@Mo (Mosaic) - central to tabernacle worship instituted at Sinai",
        theme: "Gospel Floor - justification begins here; Great Controversy - cost of sin revealed",
        sanctuary: "First piece of furniture encountered; gate of salvation",
        freestyle: "Nature: fire consumes completely; Personal: what am I holding back from the altar?"
      },
      {
        symbol: "Laver (Bronze Basin)",
        emoji: "🚿",
        meaning: "Cleansing, Baptism, Sanctification",
        dimensions: {
          literal: "Priests washed before service",
          christ: "Christ's baptism at Jordan",
          personal: "Baptism, daily cleansing by the Word",
          church: "Pentecost - baptism of the Spirit",
          heaven: "Sea of glass (purified saints)"
        },
        keyTexts: ["Exodus 30:17-21", "Ephesians 5:26", "Revelation 4:6"],
        relatedSymbols: ["Water = Cleansing, Spirit, Word", "Bronze = Judgment endured", "Mirrors = Self-examination"],
        type: "Baptism and daily washing by the Word",
        pattern: "Water cleansing: Red Sea → Jordan → Laver → Baptism → Word",
        parallel: "Flood waters ‖ Red Sea ‖ Jordan crossing - all judgment/deliverance",
        cycle: "@Mo → @Sp - from physical washing to Spirit baptism",
        theme: "Sanctuary Wall - second step in salvation journey",
        sanctuary: "Between altar and Holy Place; must wash before service",
        prophecy: "Sea of glass in heaven - saints who passed through cleansing",
        freestyle: "Daily shower cleanses body; daily Word cleanses soul"
      }
    ]
  },
  {
    id: "sanctuary-holy-place",
    name: "Sanctuary: Holy Place",
    icon: "🕯️",
    description: "Holy Place furniture representing sanctification",
    symbols: [
      {
        symbol: "Golden Lampstand (Menorah)",
        emoji: "🕎",
        meaning: "Light, Witness, Holy Spirit",
        dimensions: {
          literal: "Seven-branched lamp providing light",
          christ: "I am the Light of the World",
          personal: "Let your light shine",
          church: "Seven churches - witness to the world",
          heaven: "Seven Spirits before the throne"
        },
        keyTexts: ["Exodus 25:31-40", "Zechariah 4:2-6", "Revelation 1:20"],
        relatedSymbols: ["Seven branches = Completeness", "Pure gold = Divine nature", "Olive oil = Holy Spirit", "Almond flowers = Resurrection"],
        type: "Holy Spirit illuminating truth through Christ",
        pattern: "Light pattern: Creation light → Pillar of fire → Lampstand → Christ → Church → New Jerusalem",
        parallel: "Zechariah's lampstand vision ‖ Seven churches ‖ Two witnesses",
        cycle: "@Sp - Spirit age, church as light-bearer",
        theme: "Great Controversy - light vs darkness battle",
        sanctuary: "Only light source in Holy Place; no natural light",
        prophecy: "Seven churches of Revelation - lampstands that can be removed",
        freestyle: "Without oil (Spirit), the lamp goes out - daily filling needed"
      },
      {
        symbol: "Table of Showbread",
        emoji: "🍞",
        meaning: "Sustenance, Word of God, Fellowship",
        dimensions: {
          literal: "Twelve loaves, eaten weekly by priests",
          christ: "I am the Bread of Life",
          personal: "Daily study of God's Word",
          church: "Three Angels' Messages - present truth",
          heaven: "Marriage Supper of the Lamb"
        },
        keyTexts: ["Exodus 25:23-30", "Leviticus 24:5-9", "John 6:35"],
        relatedSymbols: ["Twelve loaves = Twelve tribes/apostles", "Frankincense = Prayers", "Golden table = Divine provision"],
        type: "Christ the Bread of Life; Word made flesh",
        pattern: "Bread pattern: Manna → Showbread → Bread of Life → Lords Supper → Marriage Supper",
        parallel: "Manna in wilderness ‖ Multiplied loaves ‖ Last Supper bread",
        cycle: "@Mo → @CyC - from wilderness manna to Christ incarnate",
        theme: "Gospel Floor - nourishment for the journey",
        sanctuary: "Renewed every Sabbath - fresh truth each week",
        freestyle: "Physical hunger reminds us of spiritual need; breakfast before Bible?"
      },
      {
        symbol: "Altar of Incense",
        emoji: "💨",
        meaning: "Prayer, Intercession, Christ's Righteousness",
        dimensions: {
          literal: "Sweet incense burned morning and evening",
          christ: "Christ's intercession in heaven",
          personal: "Prayer life, communion with God",
          church: "Corporate prayer, intercession",
          heaven: "Prayers of saints ascending (Rev 8:3-4)"
        },
        keyTexts: ["Exodus 30:1-10", "Psalm 141:2", "Revelation 8:3-4"],
        relatedSymbols: ["Gold = Divine nature", "Horns = Power of intercession", "Sweet spices = Christ's merits"],
        type: "Christ's intercessory ministry blended with our prayers",
        pattern: "Prayer pattern: Patriarchs calling on God → Tabernacle incense → Temple → Christ → Heavenly sanctuary",
        parallel: "Zacharias at incense altar ‖ Christ in Gethsemane ‖ Heavenly intercession",
        cycle: "@CyC → @Sp - Christ's earthly prayers continue in heaven",
        theme: "Sanctuary Wall - closest point to Most Holy Place",
        sanctuary: "Just before the veil; prayers ascend to throne",
        prophecy: "Rev 8:3-4 - angel with golden censer; prayers trigger events",
        freestyle: "Smoke rises naturally upward - prayer finds its way to God"
      }
    ]
  },
  {
    id: "sanctuary-most-holy",
    name: "Sanctuary: Most Holy Place",
    icon: "📦",
    description: "Most Holy Place representing God's throne and presence",
    symbols: [
      {
        symbol: "Ark of the Covenant",
        emoji: "📦",
        meaning: "God's Presence, Throne, Covenant",
        dimensions: {
          literal: "Container of covenant documents",
          christ: "Christ - God dwelling with humanity",
          personal: "Christ dwelling in the heart",
          church: "1844 - Ark opened in heaven (Rev 11:19)",
          heaven: "God's throne, center of government"
        },
        keyTexts: ["Exodus 25:10-22", "Hebrews 9:4", "Revelation 11:19"],
        relatedSymbols: ["Acacia wood = Humanity", "Gold overlay = Divinity", "Crown molding = Royalty"],
        type: "Christ as the meeting place between God and man",
        pattern: "Ark pattern: Noah's ark (salvation) → Ark of bulrushes (Moses) → Ark of Covenant → Christ",
        parallel: "Captured by Philistines ‖ Jerusalem falls ‖ Temple destroyed - yet God's presence endures",
        cycle: "@Mo → @Re - from Sinai institution to heavenly revelation",
        theme: "Sanctuary Wall center; Great Controversy - Satan attacks the law within",
        sanctuary: "Heart of the sanctuary; entered only on Day of Atonement",
        prophecy: "Rev 11:19 - Ark seen in heaven temple; law still binding"
      },
      {
        symbol: "Mercy Seat",
        emoji: "👑",
        meaning: "Atonement, Mercy, Propitiation",
        dimensions: {
          literal: "Lid of the Ark, place of blood sprinkling",
          christ: "Christ our propitiation (Romans 3:25)",
          personal: "Access to mercy through Christ",
          church: "Judgment and mercy",
          heaven: "God's throne of grace"
        },
        keyTexts: ["Exodus 25:17-22", "Leviticus 16:14-15", "Hebrews 4:16"],
        relatedSymbols: ["Pure gold = Divine mercy", "Cherubim = Angels beholding redemption", "Blood sprinkled = Atonement applied"],
        type: "Christ as the place where law and mercy meet",
        pattern: "Mercy covering judgment: Abel's blood → Passover blood → Mercy seat → Cross",
        theme: "Gospel Floor - where righteousness and peace kiss (Ps 85:10)",
        sanctuary: "Blood applied here made atonement effective"
      },
      {
        symbol: "Stone Tablets (Ten Commandments)",
        emoji: "📜",
        meaning: "God's Law, Eternal Standard, Character of God",
        notes: "Written by God's finger = Divine origin. Two tablets = Duty to God / Duty to man. Stone = Permanence, unchangeable.",
        keyTexts: ["Exodus 31:18", "Deuteronomy 4:13", "2 Corinthians 3:3"],
        type: "Character of Christ written in believers' hearts",
        pattern: "Law given: Eden → Patriarchs → Sinai → Heart (New Covenant)",
        parallel: "First tablets broken (sin) ‖ Second tablets preserved (grace)",
        cycle: "@Mo - covenant formalized at Sinai",
        theme: "Great Controversy Wall - Satan's attack on God's law",
        prophecy: "Rev 11:19 - Ark with law seen in judgment hour"
      },
      {
        symbol: "Aaron's Rod That Budded",
        emoji: "🌿",
        meaning: "Resurrection, Divine Selection, Priesthood",
        notes: "Dead wood budding = Resurrection. Almonds = First to bloom, watching. Confirms God's chosen leadership.",
        keyTexts: ["Numbers 17:1-11", "Hebrews 9:4"],
        type: "Christ's resurrection vindicating His priesthood",
        pattern: "Dead becoming alive: Isaac → Joseph → Rod → Lazarus → Christ",
        parallel: "Korah's rebellion questioned priesthood ‖ Jews rejected Christ's priesthood",
        theme: "Life of Christ Wall - resurrection power"
      },
      {
        symbol: "Golden Pot of Manna",
        emoji: "🏺",
        meaning: "Divine Provision, Hidden Manna, Christ",
        notes: "Manna = Christ, Bread from heaven. Golden pot = Preserved, memorial. Hidden = Rewards for overcomers (Rev 2:17).",
        keyTexts: ["Exodus 16:33", "Hebrews 9:4", "Revelation 2:17"],
        type: "Christ the living bread; provision in wilderness",
        pattern: "Bread provision: Eden → Manna → Showbread → Christ → Lords Supper",
        parallel: "40 years manna ‖ 40 days temptation - living by every word",
        cycle: "@Mo - wilderness provision; @Re - hidden manna for overcomers",
        freestyle: "What fell daily required daily gathering - so with the Word"
      }
    ]
  },
  // PART II: FEAST DAY SYMBOLS
  {
    id: "spring-feasts",
    name: "Spring Feasts (First Coming)",
    icon: "🌸",
    description: "Spring feasts fulfilled at Christ's first coming",
    symbols: [
      {
        symbol: "Passover (Pesach)",
        emoji: "🐑",
        meaning: "Redemption through Blood",
        dimensions: {
          literal: "Deliverance from Egypt",
          christ: "Christ's death (crucifixion day)",
          personal: "Accepting Christ's sacrifice",
          church: "Cross - foundation of church",
          heaven: "Lamb slain from foundation"
        },
        keyTexts: ["Exodus 12:1-14", "1 Corinthians 5:7", "John 1:29"],
        relatedSymbols: ["Lamb without blemish = Sinless Christ", "Blood on doorposts = Applied salvation", "Bitter herbs = Suffering, repentance"]
      },
      {
        symbol: "Unleavened Bread",
        emoji: "🫓",
        meaning: "Sanctification, Putting Away Sin",
        dimensions: {
          literal: "Seven days without leaven",
          christ: "Christ in the tomb (sinless)",
          personal: "Removing sin from life",
          church: "Purification of the church",
          heaven: "Sinlessness of God's kingdom"
        },
        keyTexts: ["Exodus 12:15-20", "1 Corinthians 5:6-8", "Matthew 16:6"],
        relatedSymbols: ["Leaven = Sin, false doctrine", "Seven days = Complete sanctification"]
      },
      {
        symbol: "Firstfruits",
        emoji: "🌾",
        meaning: "Resurrection, First of Harvest",
        dimensions: {
          literal: "First sheaf of barley harvest",
          christ: "Christ's resurrection (1 Cor 15:20-23)",
          personal: "New life in Christ",
          church: "Those raised at Christ's resurrection",
          heaven: "Christ as firstfruits of resurrection"
        },
        keyTexts: ["Leviticus 23:9-14", "1 Corinthians 15:20-23", "Matthew 27:52-53"]
      },
      {
        symbol: "Pentecost (Shavuot)",
        emoji: "🔥",
        meaning: "Outpouring of Spirit, Harvest",
        dimensions: {
          literal: "Wheat harvest, giving of law",
          christ: "Christ sends the Spirit",
          personal: "Receiving the Holy Spirit",
          church: "Birth of NT church, early rain",
          heaven: "Celebration of harvest"
        },
        keyTexts: ["Leviticus 23:15-22", "Acts 2:1-4", "Joel 2:28"],
        relatedSymbols: ["Two wave loaves = Jew and Gentile", "Fifty days = Jubilee, liberty", "Fire/tongues = Holy Spirit"]
      }
    ]
  },
  {
    id: "fall-feasts",
    name: "Fall Feasts (Second Coming)",
    icon: "🍂",
    description: "Fall feasts pointing to Christ's second coming",
    symbols: [
      {
        symbol: "Feast of Trumpets (Yom Teruah)",
        emoji: "📯",
        meaning: "Warning, Awakening, Preparation",
        dimensions: {
          literal: "Blowing of shofar",
          christ: "Christ's warning messages",
          personal: "Wake up call, self-examination",
          church: "1833-1844 Millerite movement, 3 Angels' Messages",
          heaven: "Trumpet warnings in Revelation"
        },
        keyTexts: ["Leviticus 23:23-25", "Matthew 24:31", "Revelation 8-11"],
        relatedSymbols: ["Shofar = Warning, call to repentance", "10 days before Atonement = Days of Awe"]
      },
      {
        symbol: "Day of Atonement (Yom Kippur)",
        emoji: "⚖️",
        meaning: "Judgment, Cleansing, Final Atonement",
        dimensions: {
          literal: "High Priest enters Most Holy Place",
          christ: "Christ's heavenly ministry since 1844",
          personal: "Heart searching, confession",
          church: "Investigative Judgment",
          heaven: "Cleansing of heavenly sanctuary"
        },
        keyTexts: ["Leviticus 16", "Daniel 8:14", "Hebrews 9:23-28"],
        relatedSymbols: ["Lord's Goat = Christ's sacrifice applied", "Scapegoat = Satan bearing guilt", "White linen = Christ's righteousness"]
      },
      {
        symbol: "Feast of Tabernacles (Sukkot)",
        emoji: "⛺",
        meaning: "Ingathering, God Dwelling with Man",
        dimensions: {
          literal: "Harvest festival, dwelling in booths",
          christ: "The Word became flesh and tabernacled among us",
          personal: "God dwelling in us",
          church: "Final harvest, millennium",
          heaven: "God dwells with His people forever"
        },
        keyTexts: ["Leviticus 23:33-44", "John 1:14", "Revelation 21:3"],
        relatedSymbols: ["Booths = Temporary dwellings, pilgrimage", "Water ceremony = Holy Spirit, latter rain", "Light ceremony = Christ"]
      }
    ]
  },
  // PART III: NUMBERS
  {
    id: "numbers",
    name: "Numeric Symbols",
    icon: "🔢",
    description: "Numbers and their prophetic significance",
    symbols: [
      { symbol: "1", meaning: "Unity, primacy, beginning", notes: "One God, one Lord", type: "Christ as the One Mediator", theme: "God is one (Deut 6:4)" },
      { symbol: "2", meaning: "Witness, division, confirmation", notes: "Two witnesses, two tablets", pattern: "Two witnesses pattern throughout Scripture", parallel: "Moses & Elijah ‖ Two witnesses of Rev 11" },
      { symbol: "3", meaning: "Divine completeness, Godhead", notes: "Father, Son, Spirit", type: "Trinity; resurrection on third day", pattern: "3 days: Jonah → Christ → symbolic resurrections" },
      { symbol: "4", meaning: "Earth, creation, universality", notes: "Four winds, four corners", type: "Gospel to all creation", sanctuary: "Four horns on altar; four corners of earth" },
      { symbol: "5", meaning: "Grace, favor", notes: "Five loaves, Pentateuch", pattern: "5 books of Moses; 5 wounds of Christ" },
      { symbol: "6", meaning: "Man, imperfection, labor", notes: "Six days of work, 666", type: "Man apart from God; beast number", theme: "Great Controversy - man trying to be God", prophecy: "666 = culmination of human rebellion" },
      { symbol: "7", meaning: "Divine perfection, completeness", notes: "Sabbath, 7 churches, 7 seals", type: "Christ is Lord of Sabbath", pattern: "7 days, 7 seals, 7 trumpets, 7 plagues - divine completeness", sanctuary: "7-branched lampstand", cycle: "All cycles contain 7-fold patterns" },
      { symbol: "8", meaning: "New beginning, resurrection", notes: "Circumcision day 8", type: "Christ rose on first day of new week (8th day)", parallel: "8 souls saved in ark ‖ New creation" },
      { symbol: "9", meaning: "Finality, judgment", notes: "9th hour - Christ's death", type: "Christ died at 9th hour; judgment complete" },
      { symbol: "10", meaning: "Law, order, completeness", notes: "10 Commandments, 10 plagues", type: "God's complete moral standard", theme: "Great Controversy - law as issue", pattern: "10 plagues → 10 Commandments" },
      { symbol: "12", meaning: "God's people, government", notes: "12 tribes, 12 apostles", type: "Christ chose 12; new Jerusalem gates", pattern: "12 tribes → 12 apostles → 144,000 (12×12×1000)", cycle: "@Ab → @Re - Gods organized people" },
      { symbol: "40", meaning: "Testing, probation", notes: "40 days, 40 years", pattern: "Flood → Moses → Elijah → Jesus → disciples - all 40", parallel: "Israel 40 years ‖ Jesus 40 days - one failed, one victorious" },
      { symbol: "50", meaning: "Jubilee, liberty, Spirit", notes: "Pentecost", type: "Spirit given 50 days after resurrection", sanctuary: "Jubilee released debts; Pentecost released Spirit", cycle: "@Sp - Spirit age begins at 50th day" },
      { symbol: "70", meaning: "Universal completion", notes: "70 weeks, 70 elders", prophecy: "Daniel 9 - 70 weeks for Messiah", type: "70 sent by Jesus (Luke 10)" },
      { symbol: "144", meaning: "God's complete people", notes: "12 x 12, sealed", prophecy: "144,000 sealed in Revelation 7 & 14", cycle: "@Re - remnant sealed", theme: "Three Angels - final generation" },
      { symbol: "1000", meaning: "Millennium, vastness", notes: "1000 years", prophecy: "Rev 20 - millennium judgment", cycle: "@Re - between second and third coming events" },
      { symbol: "1260", meaning: "Persecution period", notes: "Days/years of papal supremacy (538-1798 AD)", prophecy: "Daniel 7:25, Rev 12:6 - persecution time", theme: "Great Controversy - Satan's war on saints", cycle: "@Sp → @Re transition" },
      { symbol: "2300", meaning: "Sanctuary cleansed", notes: "457 BC - 1844 AD", prophecy: "Daniel 8:14 - longest time prophecy", sanctuary: "Heavenly Day of Atonement begins", cycle: "@Re - judgment hour message" }
    ]
  },
  // PART IV: COLORS
  {
    id: "colors",
    name: "Colors",
    icon: "🎨",
    description: "Colors and their symbolic meanings",
    symbols: [
      { symbol: "White", emoji: "⚪", meaning: "Purity, righteousness, victory", notes: "Christ's garments, saints' robes" },
      { symbol: "Blue", emoji: "🔵", meaning: "Heaven, law, divinity", notes: "Ribbon on garment, sky" },
      { symbol: "Purple", emoji: "🟣", meaning: "Royalty, kingship", notes: "King's garments" },
      { symbol: "Scarlet/Red", emoji: "🔴", meaning: "Sacrifice, blood, sin", notes: "Atonement, war" },
      { symbol: "Gold", emoji: "🟡", meaning: "Divinity, glory, faith tested", notes: "Sanctuary furniture" },
      { symbol: "Silver", emoji: "🪙", meaning: "Redemption, price", notes: "30 pieces, redemption money" },
      { symbol: "Bronze/Brass", emoji: "🟤", meaning: "Judgment, strength", notes: "Altar, serpent" },
      { symbol: "Black", emoji: "⚫", meaning: "Famine, death, mourning", notes: "Black horse" },
      { symbol: "Green", emoji: "🟢", meaning: "Life, prosperity, growth", notes: "Pastures, trees" }
    ]
  },
  // PART V: CELESTIAL
  {
    id: "celestial",
    name: "Celestial Bodies",
    icon: "☀️",
    description: "Sun, moon, stars and their meanings",
    symbols: [
      { symbol: "Sun", emoji: "☀️", meaning: "Christ, Glory, Righteousness", notes: "Sun of Righteousness (Mal 4:2). Fourth day creation = Christ's appearing.", type: "Christ the Light of the World", pattern: "Fourth day sun ‖ Fourth millennium Christ appears", prophecy: "Mal 4:2 - Sun of Righteousness with healing", freestyle: "Sun gives light freely; so Christ gives grace" },
      { symbol: "Moon", emoji: "🌙", meaning: "Church, Reflected Light, Israel", notes: "Reflects sun's light = Church reflects Christ. Under woman's feet (Rev 12) = Old Covenant.", type: "Church has no light of its own - reflects Christ", parallel: "Woman clothed with sun, moon under feet - old/new covenant", prophecy: "Moon to blood (Joel 2:31) - end time signs" },
      { symbol: "Stars", emoji: "⭐", meaning: "Angels, Leaders, God's People", notes: "Seven stars = Angels of churches. Falling stars = Apostasy. Abraham's seed = Countless multitude.", pattern: "Stars fall: Isa 14 (Satan) → apostasy → 1833 meteor shower", prophecy: "Stars falling - sign fulfilled Nov 13, 1833", cycle: "@Ab - seed as stars; @Re - stars in Christ's hand" },
      { symbol: "Clouds", emoji: "☁️", meaning: "Divine Presence, Judgment, Witnesses", notes: "Pillar of cloud = God's guidance. Second coming = On clouds.", type: "Christ comes in clouds of glory", pattern: "Sinai cloud → Pillar → Transfiguration → Ascension → Return", prophecy: "Every eye shall see Him coming in clouds" },
      { symbol: "Rainbow", emoji: "🌈", meaning: "Covenant, Mercy, Throne of God", notes: "Noah's covenant = No more flood. Around throne = Mercy in judgment.", type: "Christ is the covenant; rainbow encircles His throne", pattern: "Noah → Ezekiel's vision → Revelation throne", cycle: "@No - covenant sign established", theme: "Gospel Floor - mercy remembered in judgment" },
      { symbol: "Lightning/Thunder", emoji: "⚡", meaning: "God's Power, Judgment, Theophany", notes: "Sinai = Law giving. From throne = Proceeding judgment.", type: "God's voice; divine power manifested", pattern: "Sinai → Elijah → Transfiguration → Throne", sanctuary: "Lightnings proceed from throne" }
    ]
  },
  // PART VI: WATER
  {
    id: "waters",
    name: "Waters",
    icon: "🌊",
    description: "Rivers, seas, and water imagery",
    symbols: [
      { symbol: "Rivers of Eden", meaning: "Paradise, life", keyTexts: ["Genesis 2:10-14"] },
      { symbol: "Nile", meaning: "Bondage, Egypt", keyTexts: ["Exodus 1-2"] },
      { symbol: "Red Sea", meaning: "Deliverance, baptism", keyTexts: ["Exodus 14"] },
      { symbol: "Jordan", meaning: "Death/resurrection, entering promise", keyTexts: ["Joshua 3"] },
      { symbol: "Sea", meaning: "Nations, instability", keyTexts: ["Daniel 7:2", "Revelation 17:15"] },
      { symbol: "Living/flowing water", meaning: "Life, Spirit", keyTexts: ["John 7:38-39"] },
      { symbol: "River of Life", meaning: "Paradise restored", keyTexts: ["Revelation 22:1-2"] },
      { symbol: "Rain (Early)", meaning: "Pentecost, planting", notes: "Initial outpouring" },
      { symbol: "Rain (Latter)", meaning: "Final outpouring, harvest", notes: "End-time Spirit" }
    ]
  },
  // PART VII: TREES AND VEGETATION
  {
    id: "vegetation",
    name: "Trees & Plants",
    icon: "🌳",
    description: "Trees, plants, and crops as symbols",
    symbols: [
      { symbol: "Tree of Life", emoji: "🌳", meaning: "Immortality, Christ, access to God", keyTexts: ["Genesis 2:9", "Revelation 22:2"] },
      { symbol: "Fig tree", emoji: "🌿", meaning: "Israel, profession without fruit", keyTexts: ["Matthew 21:19", "Luke 13:6-9"] },
      { symbol: "Olive tree", emoji: "🫒", meaning: "Israel, Spirit, anointing", keyTexts: ["Romans 11:17-24", "Zechariah 4"] },
      { symbol: "Vine", emoji: "🍇", meaning: "Israel/Church, Christ, fruit-bearing", keyTexts: ["John 15:1-8", "Isaiah 5:1-7"] },
      { symbol: "Cedar", meaning: "Lebanon, royalty, strength", keyTexts: ["1 Kings 5:6", "Ezekiel 31"] },
      { symbol: "Palm", emoji: "🌴", meaning: "Victory, righteousness", keyTexts: ["John 12:13", "Revelation 7:9"] },
      { symbol: "Wheat", emoji: "🌾", meaning: "True believers, harvest", keyTexts: ["Matthew 13:24-30"] },
      { symbol: "Tares/Weeds", meaning: "False believers, Satan's children", keyTexts: ["Matthew 13:24-30"] },
      { symbol: "Thorns/Thistles", meaning: "Curse, tribulation", keyTexts: ["Genesis 3:18", "Matthew 27:29"] },
      { symbol: "Mustard", meaning: "Faith, kingdom growth", keyTexts: ["Matthew 13:31-32"] }
    ]
  },
  // PART VIII: ANIMALS
  {
    id: "domestic-animals",
    name: "Domestic Animals",
    icon: "🐑",
    description: "Livestock and domesticated animals",
    symbols: [
      { symbol: "Lamb", emoji: "🐑", meaning: "Christ, innocence, sacrifice", notes: "Passover lamb", keyTexts: ["John 1:29", "Revelation 5:6"], type: "Christ the Lamb of God who takes away sin", pattern: "Abel's lamb → Passover → Daily sacrifice → John 1:29 → Rev 5", sanctuary: "Central sacrifice; without blemish", cycle: "@Ad → @Re - Lamb slain from foundation to throne", theme: "Gospel Floor foundation" },
      { symbol: "Sheep", emoji: "🐏", meaning: "God's people, followers", notes: "Can also mean wandering, lost", keyTexts: ["John 10:1-16", "Isaiah 53:6"], type: "Believers following the Good Shepherd", parallel: "Lost sheep (Luke 15) ‖ Scattered sheep (Zech 13:7)", freestyle: "Sheep need a shepherd; they cannot lead themselves" },
      { symbol: "Ram", meaning: "Substitution, leadership", notes: "Abraham's substitute", keyTexts: ["Genesis 22:13"], type: "Christ as substitute caught in thorns", pattern: "Isaac's ram → Passover lamb → Christ crowned with thorns", cycle: "@Ab - substitution principle established" },
      { symbol: "Goat", emoji: "🐐", meaning: "Sin bearer, atonement", notes: "Day of Atonement. Also: wicked, cursed", keyTexts: ["Leviticus 16", "Matthew 25:32-33"], type: "Lord's goat = Christ; Scapegoat = Satan", sanctuary: "Day of Atonement central ritual", parallel: "Goats on left (judgment) ‖ Scapegoat sent away", prophecy: "Final judgment separates sheep from goats" },
      { symbol: "Bull/Ox", emoji: "🐂", meaning: "Service, strength, patience", notes: "Also: stubbornness", keyTexts: ["Deuteronomy 25:4", "1 Corinthians 9:9"], type: "Christ serving patiently; ministers worthy of support", freestyle: "Ox knows its master (Isa 1:3) - do we?" },
      { symbol: "Donkey", emoji: "🫏", meaning: "Humility, service, peace", notes: "Christ's entry into Jerusalem", keyTexts: ["Zechariah 9:9", "Matthew 21:5"], type: "Christ came humble, not on war horse", parallel: "Balaam's donkey saw angel ‖ Triumphal entry - humility vs pride", prophecy: "Zech 9:9 fulfilled exactly" },
      { symbol: "Horse", emoji: "🐴", meaning: "War, strength, power", notes: "Also: trust in flesh", keyTexts: ["Revelation 6:1-8", "Psalm 20:7"], prophecy: "Four horsemen of Revelation", pattern: "White → Red → Black → Pale - church history", theme: "Great Controversy - spiritual warfare" }
    ]
  },
  {
    id: "wild-animals",
    name: "Wild Animals",
    icon: "🦁",
    description: "Wild beasts and their meanings",
    symbols: [
      { symbol: "Lion", emoji: "🦁", meaning: "Christ (Judah), or devouring power", notes: "Dual meaning based on context", keyTexts: ["Revelation 5:5", "1 Peter 5:8"] },
      { symbol: "Bear", emoji: "🐻", meaning: "Medo-Persia, cruelty", keyTexts: ["Daniel 7:5"] },
      { symbol: "Leopard", emoji: "🐆", meaning: "Greece, swiftness", keyTexts: ["Daniel 7:6"] },
      { symbol: "Wolf", emoji: "🐺", meaning: "False teachers, destroyers", keyTexts: ["Matthew 7:15", "John 10:12"] },
      { symbol: "Fox", emoji: "🦊", meaning: "Cunning, destruction", keyTexts: ["Luke 13:32"] },
      { symbol: "Deer/Hart", emoji: "🦌", meaning: "Longing for God, swiftness", keyTexts: ["Psalm 42:1"] },
      { symbol: "Dragon", emoji: "🐉", meaning: "Satan, great power", keyTexts: ["Revelation 12:9", "Revelation 20:2"] },
      { symbol: "Serpent", emoji: "🐍", meaning: "Satan, deception, curse", keyTexts: ["Genesis 3:1", "Revelation 12:9"] }
    ]
  },
  {
    id: "birds",
    name: "Birds",
    icon: "🕊️",
    description: "Birds and their symbolic meanings",
    symbols: [
      { symbol: "Eagle", emoji: "🦅", meaning: "God's care, swiftness, judgment", keyTexts: ["Exodus 19:4", "Revelation 4:7"] },
      { symbol: "Dove", emoji: "🕊️", meaning: "Holy Spirit, peace, innocence", keyTexts: ["Matthew 3:16", "Genesis 8:8-12"] },
      { symbol: "Raven", emoji: "🐦‍⬛", meaning: "God's provision, unclean", keyTexts: ["1 Kings 17:4-6", "Genesis 8:7"] },
      { symbol: "Sparrow", meaning: "God's care for small things", keyTexts: ["Matthew 10:29-31"] },
      { symbol: "Hen", emoji: "🐔", meaning: "Protection, gathering", keyTexts: ["Matthew 23:37"] },
      { symbol: "Rooster", emoji: "🐓", meaning: "Warning, denial", keyTexts: ["Matthew 26:74"] },
      { symbol: "Owl", emoji: "🦉", meaning: "Desolation, darkness", keyTexts: ["Isaiah 13:21", "Isaiah 34:11"] }
    ]
  },
  // PART IX: BODY PARTS
  {
    id: "body-parts",
    name: "Body Parts",
    icon: "🫀",
    description: "Parts of the body and their meanings",
    symbols: [
      { symbol: "Head", meaning: "Authority, leadership, mind" },
      { symbol: "Face", meaning: "Presence, character, favor" },
      { symbol: "Eyes", emoji: "👁️", meaning: "Knowledge, perception, Spirit" },
      { symbol: "Ears", emoji: "👂", meaning: "Hearing, obedience" },
      { symbol: "Mouth", meaning: "Testimony, words, doctrine" },
      { symbol: "Tongue", emoji: "👅", meaning: "Speech, nations" },
      { symbol: "Heart", emoji: "❤️", meaning: "Mind, will, affections" },
      { symbol: "Hands", emoji: "🤲", meaning: "Works, actions" },
      { symbol: "Right hand", emoji: "🫱", meaning: "Power, favor, authority" },
      { symbol: "Feet", emoji: "🦶", meaning: "Walk, conduct, gospel" },
      { symbol: "Heel", meaning: "Vulnerability, crushing", keyTexts: ["Genesis 3:15"] }
    ]
  },
  // PART X: OBJECTS
  {
    id: "weapons",
    name: "Weapons & Warfare",
    icon: "⚔️",
    description: "Armor and weapons of spiritual battle",
    symbols: [
      { symbol: "Sword", emoji: "⚔️", meaning: "Word of God, judgment, war", keyTexts: ["Ephesians 6:17", "Hebrews 4:12"] },
      { symbol: "Two-edged sword", meaning: "Word piercing", keyTexts: ["Hebrews 4:12", "Revelation 1:16"] },
      { symbol: "Shield", emoji: "🛡️", meaning: "Faith, protection", keyTexts: ["Ephesians 6:16"] },
      { symbol: "Helmet", meaning: "Salvation, mind protected", keyTexts: ["Ephesians 6:17"] },
      { symbol: "Breastplate", meaning: "Righteousness", keyTexts: ["Ephesians 6:14"] },
      { symbol: "Belt/Girdle", meaning: "Truth, readiness", keyTexts: ["Ephesians 6:14"] },
      { symbol: "Bow", emoji: "🏹", meaning: "Distance warfare, covenant (rainbow)" },
      { symbol: "Arrow", meaning: "Children, words, affliction", keyTexts: ["Psalm 127:4"] }
    ]
  },
  {
    id: "domestic-objects",
    name: "Domestic Objects",
    icon: "🔑",
    description: "Household items and structures",
    symbols: [
      { symbol: "Key", emoji: "🔑", meaning: "Authority, access", keyTexts: ["Matthew 16:19", "Revelation 1:18", "Revelation 3:7"] },
      { symbol: "Door", emoji: "🚪", meaning: "Access, Christ, opportunity", keyTexts: ["John 10:9", "Revelation 3:20"] },
      { symbol: "Gate", meaning: "Authority, judgment", keyTexts: ["Matthew 16:18"] },
      { symbol: "House", emoji: "🏠", meaning: "Life, family, body", keyTexts: ["2 Corinthians 5:1"] },
      { symbol: "Temple", emoji: "🏛️", meaning: "God's dwelling, body", keyTexts: ["1 Corinthians 3:16", "John 2:19-21"] },
      { symbol: "Tower", meaning: "Pride, protection", keyTexts: ["Genesis 11:4", "Proverbs 18:10"] },
      { symbol: "Foundation", meaning: "Christ, beginnings", keyTexts: ["1 Corinthians 3:11"] },
      { symbol: "Cornerstone", meaning: "Christ, key position", keyTexts: ["Ephesians 2:20", "1 Peter 2:6"] },
      { symbol: "Lamp", emoji: "🪔", meaning: "Word, guidance", keyTexts: ["Psalm 119:105"] },
      { symbol: "Oil", meaning: "Spirit, anointing", keyTexts: ["1 Samuel 16:13", "Matthew 25:3-4"] },
      { symbol: "Wine", emoji: "🍷", meaning: "Blood, joy, doctrine", keyTexts: ["Matthew 26:27-29"] },
      { symbol: "Cup", meaning: "Portion, suffering, blessing", keyTexts: ["Matthew 26:39", "Psalm 23:5"] },
      { symbol: "Bread", emoji: "🍞", meaning: "Word, sustenance, Christ", keyTexts: ["John 6:35"] },
      { symbol: "Leaven", meaning: "Sin, false doctrine", keyTexts: ["Matthew 16:6", "1 Corinthians 5:6-8"] },
      { symbol: "Salt", emoji: "🧂", meaning: "Preservation, covenant", keyTexts: ["Matthew 5:13"] }
    ]
  },
  {
    id: "clothing",
    name: "Clothing & Adornment",
    icon: "👗",
    description: "Garments and their significance",
    symbols: [
      { symbol: "White robes", meaning: "Righteousness, victory", keyTexts: ["Revelation 7:9", "Revelation 19:8"] },
      { symbol: "Fine linen", meaning: "Righteous acts of saints", keyTexts: ["Revelation 19:8"] },
      { symbol: "Purple robes", meaning: "Royalty", keyTexts: ["Mark 15:17"] },
      { symbol: "Sackcloth", meaning: "Mourning, repentance", keyTexts: ["Jonah 3:5-6"] },
      { symbol: "Wedding garment", meaning: "Christ's righteousness", keyTexts: ["Matthew 22:11-12"] },
      { symbol: "Filthy garments", meaning: "Sin", keyTexts: ["Zechariah 3:3-4", "Isaiah 64:6"] },
      { symbol: "Crown (stephanos)", emoji: "👑", meaning: "Victory, reward", keyTexts: ["1 Corinthians 9:25", "2 Timothy 4:8"] },
      { symbol: "Crown (diadem)", meaning: "Royalty, rulership", keyTexts: ["Revelation 19:12"] },
      { symbol: "Ring", emoji: "💍", meaning: "Authority, covenant", keyTexts: ["Luke 15:22"] },
      { symbol: "Pearl", meaning: "Great price, kingdom", keyTexts: ["Matthew 13:45-46"] }
    ]
  },
  // PART XI: PERSONS AS TYPES
  {
    id: "types-positive",
    name: "Persons as Types (Christ)",
    icon: "👤",
    description: "Old Testament persons foreshadowing Christ",
    symbols: [
      { symbol: "Adam", meaning: "Christ (Head of race, brings life)", keyTexts: ["1 Corinthians 15:45", "Romans 5:14"] },
      { symbol: "Abel", meaning: "Christ (Innocent blood, shepherd)", keyTexts: ["Hebrews 11:4", "Hebrews 12:24"] },
      { symbol: "Noah", meaning: "Christ/Remnant (Preacher, ark builder)", keyTexts: ["1 Peter 3:20-21", "2 Peter 2:5"] },
      { symbol: "Melchizedek", meaning: "Christ (King-Priest, eternal)", keyTexts: ["Hebrews 7:1-17"] },
      { symbol: "Isaac", meaning: "Christ (Promised son, sacrifice)", keyTexts: ["Hebrews 11:17-19", "Galatians 4:28"] },
      { symbol: "Joseph", meaning: "Christ (Rejected, exalted, savior)", notes: "Most complete OT type of Christ" },
      { symbol: "Moses", meaning: "Christ (Prophet, deliverer, mediator)", keyTexts: ["Deuteronomy 18:15", "Acts 3:22"] },
      { symbol: "Aaron", meaning: "High Priest (Intercession)", keyTexts: ["Hebrews 5:4-5"] },
      { symbol: "Joshua", meaning: "Christ (Same name - Yeshua, leads into promise)", keyTexts: ["Hebrews 4:8"] },
      { symbol: "Boaz", meaning: "Christ (Kinsman redeemer)", keyTexts: ["Ruth 4"] },
      { symbol: "David", meaning: "Christ (King, shepherd)", keyTexts: ["Acts 2:25-31"] },
      { symbol: "Jonah", meaning: "Christ (Death, burial, resurrection - 3 days)", keyTexts: ["Matthew 12:40"] }
    ]
  },
  {
    id: "types-women",
    name: "Women as Types (Church)",
    icon: "👰",
    description: "Women foreshadowing the Church",
    symbols: [
      { symbol: "Eve", meaning: "Church (Bride of Adam)", keyTexts: ["Ephesians 5:31-32"] },
      { symbol: "Sarah", meaning: "Covenant (Promise, faith)", keyTexts: ["Galatians 4:22-31"] },
      { symbol: "Rebekah", meaning: "Church (Called from far, bride)", keyTexts: ["Genesis 24"] },
      { symbol: "Rachel", meaning: "Church (Beloved, waited for)", keyTexts: ["Genesis 29"] },
      { symbol: "Esther", meaning: "Church (For such a time)", keyTexts: ["Esther 4:14"] },
      { symbol: "Ruth", meaning: "Church (Gentile bride, gleaner)", keyTexts: ["Ruth 1-4"] },
      { symbol: "Rahab", meaning: "Saved Gentiles (Scarlet cord, faith)", keyTexts: ["Joshua 2", "Hebrews 11:31"] }
    ]
  },
  {
    id: "types-negative",
    name: "Negative Types",
    icon: "⚠️",
    description: "Persons representing opposition to God",
    symbols: [
      { symbol: "Cain", meaning: "False worship (Works, murder)", keyTexts: ["Genesis 4", "1 John 3:12"] },
      { symbol: "Pharaoh", meaning: "Satan (Enslaver, hardens heart)", keyTexts: ["Exodus 5-14"] },
      { symbol: "Balaam", meaning: "False prophet (Greed, compromise)", keyTexts: ["Numbers 22-24", "Revelation 2:14"] },
      { symbol: "Jezebel", meaning: "False church (Persecution, idolatry)", keyTexts: ["1 Kings 16-21", "Revelation 2:20"] },
      { symbol: "Judas", meaning: "Apostate (Betrayer, greed)", keyTexts: ["Matthew 26:14-16"] }
    ]
  },
  // PART XII: PLACES
  {
    id: "nations",
    name: "Nations",
    icon: "🗺️",
    description: "Nations and their symbolic meanings",
    symbols: [
      { symbol: "Egypt", emoji: "🇪🇬", meaning: "World, bondage, sin", keyTexts: ["Exodus 1-12", "Revelation 11:8"] },
      { symbol: "Babylon", meaning: "False religion, confusion", keyTexts: ["Daniel 1-5", "Revelation 17-18"] },
      { symbol: "Assyria", meaning: "Oppressor, north", keyTexts: ["Isaiah 10:5"] },
      { symbol: "Medo-Persia", meaning: "Silver kingdom", keyTexts: ["Daniel 2:39", "Daniel 8:20"] },
      { symbol: "Greece", meaning: "Bronze kingdom, philosophy", keyTexts: ["Daniel 2:39", "Daniel 8:21"] },
      { symbol: "Rome", meaning: "Iron kingdom, persecution", keyTexts: ["Daniel 2:40", "Daniel 7:7"] },
      { symbol: "Israel", emoji: "🇮🇱", meaning: "God's covenant people", keyTexts: ["Exodus 19:5-6"] },
      { symbol: "Canaan", meaning: "Promise, heaven", keyTexts: ["Hebrews 11:9-10"] },
      { symbol: "Edom", meaning: "Flesh, worldliness", keyTexts: ["Genesis 25:30", "Obadiah"] }
    ]
  },
  {
    id: "places",
    name: "Cities & Locations",
    icon: "🏙️",
    description: "Cities and places as symbols",
    symbols: [
      { symbol: "Jerusalem", meaning: "City of peace, God's presence", keyTexts: ["Psalm 122", "Hebrews 12:22"] },
      { symbol: "Babylon", meaning: "Confusion, false system", keyTexts: ["Genesis 11:9", "Revelation 17:5"] },
      { symbol: "Zion", meaning: "God's dwelling, church", keyTexts: ["Psalm 87", "Hebrews 12:22"] },
      { symbol: "Bethlehem", meaning: "House of bread, birth", keyTexts: ["Micah 5:2", "Matthew 2:1"] },
      { symbol: "Eden", meaning: "Paradise, God's presence", keyTexts: ["Genesis 2-3"] },
      { symbol: "Wilderness", meaning: "Testing, preparation, refuge", keyTexts: ["Exodus 16-40", "Revelation 12:6"] },
      { symbol: "Sinai", meaning: "Law, covenant", keyTexts: ["Exodus 19-20"] },
      { symbol: "Mountain", emoji: "⛰️", meaning: "Kingdom, government, obstacle", keyTexts: ["Daniel 2:35", "Isaiah 2:2"] },
      { symbol: "Valley", meaning: "Humility, trial, death", keyTexts: ["Psalm 23:4"] }
    ]
  },
  // PART XIII: DIRECTIONS
  {
    id: "directions",
    name: "Directions & Positions",
    icon: "🧭",
    description: "Cardinal directions and their meanings",
    symbols: [
      { symbol: "East", meaning: "Glory, Christ's return, sunrise", notes: "Garden entrance, Christ's return", keyTexts: ["Matthew 24:27", "Ezekiel 43:2"] },
      { symbol: "West", meaning: "End, setting, going toward God", notes: "Direction of travel in sanctuary" },
      { symbol: "North", meaning: "Enemy, throne of God, judgment", keyTexts: ["Isaiah 14:13", "Psalm 48:2"] },
      { symbol: "South", meaning: "Warmth, peace, blessing" },
      { symbol: "Up/Above", meaning: "Heaven, spiritual, exaltation" },
      { symbol: "Down/Below", meaning: "Earth, physical, humiliation" },
      { symbol: "Right", meaning: "Favor, power, honor", keyTexts: ["Mark 16:19", "Matthew 25:33"] },
      { symbol: "Left", meaning: "Lesser position", keyTexts: ["Matthew 25:33"] }
    ]
  },
  // PART XIV: TIME
  {
    id: "times",
    name: "Times & Seasons",
    icon: "⏰",
    description: "Times of day and seasons",
    symbols: [
      { symbol: "Morning", meaning: "New beginning, resurrection", keyTexts: ["Psalm 30:5", "Mark 16:2"] },
      { symbol: "Noon", meaning: "Height of power, clarity" },
      { symbol: "Evening", meaning: "End of day, approaching rest" },
      { symbol: "Midnight", meaning: "Darkest hour, unexpected", keyTexts: ["Matthew 25:6", "Exodus 12:29"] },
      { symbol: "Third hour (9 AM)", meaning: "Morning sacrifice", keyTexts: ["Acts 2:15"] },
      { symbol: "Sixth hour (Noon)", meaning: "Darkness at crucifixion", keyTexts: ["Matthew 27:45"] },
      { symbol: "Ninth hour (3 PM)", meaning: "Evening sacrifice, Christ's death", keyTexts: ["Matthew 27:46"] },
      { symbol: "Spring", meaning: "New life, resurrection", notes: "First coming fulfilled" },
      { symbol: "Autumn/Fall", meaning: "Ingathering, maturity", notes: "Second coming to be fulfilled" },
      { symbol: "Sabbath (7th day)", meaning: "Rest, completion", keyTexts: ["Genesis 2:2-3", "Hebrews 4:9"] }
    ]
  },
  // PART XV: ACTIONS
  {
    id: "actions",
    name: "Actions & Rituals",
    icon: "🙏",
    description: "Ritual actions and their meanings",
    symbols: [
      { symbol: "Anointing", meaning: "Consecration, Spirit", keyTexts: ["1 Samuel 16:13", "Acts 10:38"] },
      { symbol: "Washing", meaning: "Cleansing, purification", keyTexts: ["Exodus 30:17-21", "John 13:5-10"] },
      { symbol: "Laying on hands", meaning: "Ordination, blessing, transfer", keyTexts: ["Numbers 27:18-23", "Acts 6:6"] },
      { symbol: "Circumcision", meaning: "Covenant, cutting away flesh", keyTexts: ["Genesis 17:10-14", "Colossians 2:11"] },
      { symbol: "Fasting", meaning: "Humility, seeking God", keyTexts: ["Matthew 6:16-18", "Isaiah 58:3-7"] },
      { symbol: "Kneeling", meaning: "Submission, prayer", keyTexts: ["Ephesians 3:14", "Daniel 6:10"] },
      { symbol: "Raising hands", meaning: "Surrender, praise", keyTexts: ["Psalm 63:4", "1 Timothy 2:8"] },
      { symbol: "Blowing trumpet", meaning: "Warning, gathering", keyTexts: ["Numbers 10:1-10", "1 Corinthians 15:52"] },
      { symbol: "Sealing", meaning: "Ownership, protection, finality", keyTexts: ["Ephesians 1:13", "Revelation 7:3"] }
    ]
  },
  // PART XVI: ABSTRACT
  {
    id: "abstract",
    name: "Abstract Concepts",
    icon: "💭",
    description: "Spiritual realities and their symbols",
    symbols: [
      { symbol: "Salvation", meaning: "Deliverance, exodus" },
      { symbol: "Justification", meaning: "Legal standing, declared righteous" },
      { symbol: "Sanctification", meaning: "Holy Place journey" },
      { symbol: "Glorification", meaning: "Most Holy Place, final" },
      { symbol: "Atonement", meaning: "Covering, at-one-ment" },
      { symbol: "Redemption", meaning: "Buying back, kinsman" },
      { symbol: "Forgiveness", meaning: "Sending away, scapegoat" },
      { symbol: "Covenant", meaning: "Agreement, rainbow, blood" },
      { symbol: "Grace", meaning: "Unmerited favor" },
      { symbol: "Faith", meaning: "Gold, substance, shield" },
      { symbol: "Hope", meaning: "Anchor, helmet" },
      { symbol: "Love", meaning: "Bond, fulfillment of law" }
    ]
  },
  // PROPHETIC BEASTS
  {
    id: "prophetic-beasts",
    name: "Prophetic Beasts",
    icon: "🐲",
    description: "Composite beasts of Daniel and Revelation",
    symbols: [
      { symbol: "Daniel 7 Fourth Beast", meaning: "Rome", notes: "Ten horns, iron teeth", keyTexts: ["Daniel 7:7-8, 19-25"] },
      { symbol: "Daniel 8 Ram", meaning: "Medo-Persia", notes: "Two horns", keyTexts: ["Daniel 8:3-4, 20"] },
      { symbol: "Daniel 8 Goat", meaning: "Greece", notes: "Notable horn", keyTexts: ["Daniel 8:5-8, 21"] },
      { symbol: "Revelation 13 Sea Beast", meaning: "Papal Rome", notes: "Leopard/bear/lion composite", keyTexts: ["Revelation 13:1-10"] },
      { symbol: "Revelation 13 Earth Beast", meaning: "USA", notes: "Lamb-like, dragon voice", keyTexts: ["Revelation 13:11-18"] },
      { symbol: "Revelation 17 Scarlet Beast", meaning: "End-time confederation", notes: "Seven heads, ten horns", keyTexts: ["Revelation 17:3-18"] },
      { symbol: "Cherubim", meaning: "God's attributes", notes: "Four faces", keyTexts: ["Ezekiel 1:5-14", "Revelation 4:6-8"] },
      { symbol: "Seraphim", meaning: "Holy worship", notes: "Six wings", keyTexts: ["Isaiah 6:2-3"] }
    ]
  }
];

// Helper functions
export function searchSymbols(query: string): BiblicalSymbol[] {
  const lowercaseQuery = query.toLowerCase();
  const results: BiblicalSymbol[] = [];
  
  for (const category of biblicalSymbolsLibrary) {
    for (const symbol of category.symbols) {
      if (
        symbol.symbol.toLowerCase().includes(lowercaseQuery) ||
        symbol.meaning.toLowerCase().includes(lowercaseQuery) ||
        symbol.notes?.toLowerCase().includes(lowercaseQuery) ||
        symbol.relatedSymbols?.some(s => s.toLowerCase().includes(lowercaseQuery))
      ) {
        results.push(symbol);
      }
    }
  }
  
  return results;
}

export function getSymbolsByCategory(categoryId: string): BiblicalSymbol[] {
  const category = biblicalSymbolsLibrary.find(c => c.id === categoryId);
  return category?.symbols || [];
}

export function getAllCategories(): { id: string; name: string; icon: string; count: number }[] {
  return biblicalSymbolsLibrary.map(c => ({
    id: c.id,
    name: c.name,
    icon: c.icon,
    count: c.symbols.length
  }));
}
