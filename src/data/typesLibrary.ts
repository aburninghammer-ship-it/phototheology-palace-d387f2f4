// Types Room Library - OT Types Pointing to Christ
// Each type shows how OT shadows find their substance in Christ

export interface BiblicalType {
  id: string;
  type: string;
  category: 'person' | 'object' | 'event' | 'institution' | 'office';
  otReference: string;
  otDescription: string;
  ntFulfillment: string;
  ntReference: string;
  christConnection: string;
  application: string;
}

export const typesLibrary: BiblicalType[] = [
  // PERSON TYPES
  {
    id: 'adam',
    type: 'Adam',
    category: 'person',
    otReference: 'Genesis 2:7; 3:15',
    otDescription: 'First man, head of humanity, brought death through sin',
    ntFulfillment: 'Christ as Last Adam brings life',
    ntReference: 'Romans 5:14-19; 1 Corinthians 15:22, 45',
    christConnection: 'As Adam was head of fallen humanity, Christ is head of redeemed humanity. Adam brought death; Christ brings life.',
    application: 'Our identity is no longer in Adam (condemnation) but in Christ (justification).'
  },
  {
    id: 'abel',
    type: 'Abel',
    category: 'person',
    otReference: 'Genesis 4:4-10',
    otDescription: 'Righteous one killed by his brother, blood cries from ground',
    ntFulfillment: "Christ's blood speaks a better word than Abel's",
    ntReference: 'Hebrews 11:4; 12:24',
    christConnection: "Abel's blood cried for vengeance; Christ's blood cries for mercy and forgiveness.",
    application: 'We come to a Mediator whose blood pleads grace, not judgment.'
  },
  {
    id: 'melchizedek',
    type: 'Melchizedek',
    category: 'person',
    otReference: 'Genesis 14:18-20',
    otDescription: 'King of Salem, priest of God Most High, no recorded genealogy',
    ntFulfillment: 'Christ is eternal priest-king after Melchizedek order',
    ntReference: 'Hebrews 5:6-10; 7:1-28',
    christConnection: 'Melchizedek combined kingship and priesthood—Christ alone fulfills this as eternal Priest-King.',
    application: 'Christ is our forever mediator who never dies and never stops interceding.'
  },
  {
    id: 'isaac',
    type: 'Isaac',
    category: 'person',
    otReference: 'Genesis 22:1-19',
    otDescription: 'Only begotten son of promise, bound on altar, figuratively raised',
    ntFulfillment: 'Christ is the only begotten Son actually sacrificed and raised',
    ntReference: 'Hebrews 11:17-19; John 3:16',
    christConnection: 'Isaac carried the wood, was bound willingly, and was spared when God provided a substitute. Christ IS the substitute.',
    application: 'What Abraham was spared from giving, God Himself gave—His only Son.'
  },
  {
    id: 'joseph',
    type: 'Joseph',
    category: 'person',
    otReference: 'Genesis 37-50',
    otDescription: 'Beloved son, rejected by brothers, exalted to save his family',
    ntFulfillment: 'Christ rejected by His own, exalted to save the world',
    ntReference: 'Acts 7:9-14; Romans 11:11-15',
    christConnection: 'Joseph was sold for silver, falsely accused, imprisoned, then exalted to save those who rejected him.',
    application: 'What men meant for evil, God meant for good—Christ turns rejection into redemption.'
  },
  {
    id: 'moses',
    type: 'Moses',
    category: 'person',
    otReference: 'Deuteronomy 18:15-19',
    otDescription: 'Deliverer, lawgiver, mediator between God and Israel',
    ntFulfillment: 'Christ is the Prophet like Moses, greater deliverer',
    ntReference: 'Acts 3:22-26; 7:37; Hebrews 3:1-6',
    christConnection: 'Moses delivered from Egypt; Christ delivers from sin. Moses gave law; Christ fulfills it.',
    application: 'Jesus is the final Prophet—when He speaks, we must listen.'
  },
  {
    id: 'david',
    type: 'David',
    category: 'person',
    otReference: '2 Samuel 7:12-16',
    otDescription: 'Shepherd-king, man after God\'s heart, throne established forever',
    ntFulfillment: 'Christ is Son of David, eternal King on David\'s throne',
    ntReference: 'Matthew 1:1; Luke 1:32-33; Revelation 22:16',
    christConnection: 'David defeated Goliath as underdog champion; Christ defeats Satan and death as our champion.',
    application: 'Jesus is the King who fights our battles and establishes an unshakeable kingdom.'
  },
  {
    id: 'solomon',
    type: 'Solomon',
    category: 'person',
    otReference: '1 Kings 3-10',
    otDescription: 'Wise king, temple builder, peaceful reign',
    ntFulfillment: 'Christ is greater than Solomon in wisdom, temple, and peace',
    ntReference: 'Matthew 12:42; John 2:19-21; Colossians 2:3',
    christConnection: 'Solomon built a physical temple; Christ is the true temple and builds the living temple (church).',
    application: 'In Christ are hidden all treasures of wisdom—seek Him for answers.'
  },
  {
    id: 'jonah',
    type: 'Jonah',
    category: 'person',
    otReference: 'Jonah 1:17',
    otDescription: 'Three days in fish, then delivered to preach to Gentiles',
    ntFulfillment: 'Christ three days in tomb, resurrection, gospel to all nations',
    ntReference: 'Matthew 12:39-41',
    christConnection: 'Jonah\'s experience was a sign—Christ\'s burial and resurrection is THE sign to all generations.',
    application: 'The resurrection of Jesus is the ultimate proof that He is who He claims to be.'
  },
  {
    id: 'elijah',
    type: 'Elijah',
    category: 'person',
    otReference: '1 Kings 17-19; 2 Kings 1-2',
    otDescription: 'Prophet who called Israel back to true worship, confronted apostasy',
    ntFulfillment: 'John the Baptist came in spirit of Elijah; Christ is Lord of all prophets',
    ntReference: 'Matthew 11:14; 17:10-13; Luke 1:17',
    christConnection: 'Elijah prepared the way for revival; John prepared the way for Christ, the ultimate revival.',
    application: 'Christ calls us back from spiritual compromise to wholehearted worship.'
  },

  // OBJECT TYPES
  {
    id: 'ark',
    type: 'Noah\'s Ark',
    category: 'object',
    otReference: 'Genesis 6-8',
    otDescription: 'Only means of salvation from flood judgment, one door',
    ntFulfillment: 'Christ is the only way of salvation from coming judgment',
    ntReference: '1 Peter 3:20-21; John 10:9',
    christConnection: 'One ark, one door, one means of safety—Christ alone saves from judgment.',
    application: 'Enter through Christ before judgment comes; He is our ark of safety.'
  },
  {
    id: 'ladder',
    type: 'Jacob\'s Ladder',
    category: 'object',
    otReference: 'Genesis 28:12',
    otDescription: 'Ladder connecting heaven and earth, angels ascending/descending',
    ntFulfillment: 'Christ is the way between heaven and earth',
    ntReference: 'John 1:51',
    christConnection: 'Jesus IS the ladder—the only connection between God and man, heaven and earth.',
    application: 'Access to God is through Christ alone—He bridges the gap.'
  },
  {
    id: 'burning-bush',
    type: 'Burning Bush',
    category: 'object',
    otReference: 'Exodus 3:2-6',
    otDescription: 'Bush burns but not consumed, God\'s presence dwelling',
    ntFulfillment: 'Christ is I AM, divine presence in human form',
    ntReference: 'John 8:58',
    christConnection: 'The I AM of the bush is the I AM of John 8—Jesus reveals God without being consumed.',
    application: 'God came near in Christ—holy yet accessible, consuming yet merciful.'
  },
  {
    id: 'passover-lamb',
    type: 'Passover Lamb',
    category: 'object',
    otReference: 'Exodus 12:1-13',
    otDescription: 'Unblemished lamb, blood on doorposts, death passes over',
    ntFulfillment: 'Christ is our Passover Lamb sacrificed for us',
    ntReference: '1 Corinthians 5:7; John 1:29; 1 Peter 1:18-19',
    christConnection: 'The lamb died at twilight; Christ died at the exact hour Passover lambs were slain.',
    application: 'His blood covers us; judgment passes over those who trust in the Lamb.'
  },
  {
    id: 'manna',
    type: 'Manna',
    category: 'object',
    otReference: 'Exodus 16:14-35',
    otDescription: 'Bread from heaven, daily provision, sustained life in wilderness',
    ntFulfillment: 'Christ is the true bread from heaven',
    ntReference: 'John 6:31-35, 48-51',
    christConnection: 'Manna sustained physical life temporarily; Christ gives eternal life to all who feed on Him.',
    application: 'Daily dependence on Christ nourishes our spiritual life.'
  },
  {
    id: 'rock',
    type: 'Rock in Wilderness',
    category: 'object',
    otReference: 'Exodus 17:6; Numbers 20:8',
    otDescription: 'Rock struck, water flows, sustains life',
    ntFulfillment: 'Christ is the Rock struck for us, living water flows',
    ntReference: '1 Corinthians 10:4; John 7:37-39',
    christConnection: 'The rock was struck ONCE (like Christ crucified once); striking again dishonored God.',
    application: 'Christ was struck for us once—we now speak to Him in prayer for living water.'
  },
  {
    id: 'bronze-serpent',
    type: 'Bronze Serpent',
    category: 'object',
    otReference: 'Numbers 21:8-9',
    otDescription: 'Serpent lifted up, those who look live',
    ntFulfillment: 'Christ lifted up on cross, those who believe live',
    ntReference: 'John 3:14-15',
    christConnection: 'The serpent represented the curse; Christ became a curse for us, lifted up for our healing.',
    application: 'Look to Christ crucified for salvation—it\'s as simple as looking in faith.'
  },
  {
    id: 'tabernacle',
    type: 'Tabernacle',
    category: 'object',
    otReference: 'Exodus 25-27',
    otDescription: 'God\'s dwelling place among His people',
    ntFulfillment: 'Christ tabernacled among us; we are now His temple',
    ntReference: 'John 1:14; 1 Corinthians 3:16; 6:19',
    christConnection: 'The tabernacle was God dwelling WITH Israel; Christ is God dwelling AS one of us.',
    application: 'God now dwells IN believers through His Spirit—we are mobile sanctuaries.'
  },
  {
    id: 'veil',
    type: 'Temple Veil',
    category: 'object',
    otReference: 'Exodus 26:31-35',
    otDescription: 'Barrier separating Holy Place from Most Holy, only High Priest passed',
    ntFulfillment: 'Christ\'s flesh is the veil, torn at His death',
    ntReference: 'Hebrews 10:19-20; Matthew 27:51',
    christConnection: 'The veil said "stay out"—it tore from top to bottom, God saying "come in" through Christ.',
    application: 'We have bold access to God\'s presence through Jesus—enter confidently.'
  },
  {
    id: 'mercy-seat',
    type: 'Mercy Seat',
    category: 'object',
    otReference: 'Exodus 25:17-22',
    otDescription: 'Gold cover on ark, blood sprinkled, God meets with His people',
    ntFulfillment: 'Christ is our propitiation (mercy seat)',
    ntReference: 'Romans 3:25; Hebrews 9:5; 1 John 2:2',
    christConnection: 'The mercy seat was where wrath was satisfied—Christ IS where God\'s wrath meets His mercy.',
    application: 'God looks at us through the blood of Christ and sees righteousness, not sin.'
  },

  // EVENT TYPES
  {
    id: 'creation',
    type: 'Creation',
    category: 'event',
    otReference: 'Genesis 1-2',
    otDescription: 'God speaks and creates, brings order from chaos',
    ntFulfillment: 'Christ is the agent of creation and new creation',
    ntReference: 'John 1:1-3; Colossians 1:16; 2 Corinthians 5:17',
    christConnection: 'The Word that created the world is the Word that creates new hearts.',
    application: 'If you are in Christ, you are a new creation—old has gone, new has come.'
  },
  {
    id: 'flood',
    type: 'The Flood',
    category: 'event',
    otReference: 'Genesis 6-8',
    otDescription: 'Judgment on sin, salvation through water, new beginning',
    ntFulfillment: 'Baptism into Christ, judgment passed, new life',
    ntReference: '1 Peter 3:20-21; Matthew 24:37-39',
    christConnection: 'As Noah passed through waters of judgment to new life, we pass through baptism to resurrection life.',
    application: 'Baptism marks our transition from the old world (Adam) to the new (Christ).'
  },
  {
    id: 'red-sea',
    type: 'Red Sea Crossing',
    category: 'event',
    otReference: 'Exodus 14',
    otDescription: 'Israel passes through water, enemies destroyed, deliverance complete',
    ntFulfillment: 'Baptism into Christ, death of old life, freedom from slavery',
    ntReference: '1 Corinthians 10:1-2; Romans 6:3-4',
    christConnection: 'Israel was baptized into Moses; we are baptized into Christ—same pattern, greater reality.',
    application: 'Your old slave-master (sin) drowned at the cross; walk in newness of life.'
  },
  {
    id: 'day-atonement',
    type: 'Day of Atonement',
    category: 'event',
    otReference: 'Leviticus 16',
    otDescription: 'High priest enters Most Holy once yearly, blood atones, sins removed',
    ntFulfillment: 'Christ entered heavenly sanctuary once for all with His own blood',
    ntReference: 'Hebrews 9:7-12, 24-28',
    christConnection: 'The high priest entered repeatedly; Christ entered once, accomplished eternal redemption.',
    application: 'Our sin is not just covered but removed—Christ finished the work.'
  },

  // INSTITUTION TYPES
  {
    id: 'sabbath',
    type: 'Sabbath',
    category: 'institution',
    otReference: 'Genesis 2:2-3; Exodus 20:8-11',
    otDescription: 'Day of rest commemorating creation, cessation from work',
    ntFulfillment: 'Christ is our rest; we cease from self-salvation efforts',
    ntReference: 'Hebrews 4:9-10; Matthew 11:28-30',
    christConnection: 'Sabbath pointed to rest in Christ—we stop trying to earn righteousness and rest in His.',
    application: 'Enter God\'s rest by faith, not works. The Sabbath remains as sign of trust in the Creator.'
  },
  {
    id: 'priesthood',
    type: 'Levitical Priesthood',
    category: 'institution',
    otReference: 'Exodus 28-29; Leviticus 8-9',
    otDescription: 'Mediators between God and Israel, offered sacrifices',
    ntFulfillment: 'Christ is the great High Priest; believers are royal priesthood',
    ntReference: 'Hebrews 4:14-16; 7:23-28; 1 Peter 2:9',
    christConnection: 'Levitical priests died and were replaced; Christ lives forever to intercede.',
    application: 'Jesus always lives to intercede for you—you have a permanent Advocate.'
  },
  {
    id: 'sacrifices',
    type: 'Sacrificial System',
    category: 'institution',
    otReference: 'Leviticus 1-7',
    otDescription: 'Animal blood offered for sin, repeated continually',
    ntFulfillment: 'Christ\'s once-for-all sacrifice ends all need for blood offerings',
    ntReference: 'Hebrews 9:11-14; 10:11-14',
    christConnection: 'Animal sacrifices reminded of sin; Christ\'s sacrifice removes sin forever.',
    application: 'No more sacrifices needed—Christ\'s blood is sufficient for all sin, past, present, future.'
  },
  {
    id: 'jubilee',
    type: 'Year of Jubilee',
    category: 'institution',
    otReference: 'Leviticus 25:8-55',
    otDescription: '50th year, debts forgiven, slaves freed, land restored',
    ntFulfillment: 'Christ proclaims the acceptable year of the Lord',
    ntReference: 'Luke 4:18-21; Isaiah 61:1-2',
    christConnection: 'Jubilee freed from bondage; Christ brings ultimate Jubilee—freedom from sin, debt paid, inheritance restored.',
    application: 'In Christ, your spiritual debts are cancelled and your inheritance is secure.'
  },
  {
    id: 'cities-refuge',
    type: 'Cities of Refuge',
    category: 'institution',
    otReference: 'Numbers 35:9-34; Joshua 20',
    otDescription: 'Safe havens for those who killed accidentally, protected from avenger',
    ntFulfillment: 'Christ is our refuge from the wrath we deserve',
    ntReference: 'Hebrews 6:18-20',
    christConnection: 'The manslayer fled to the city; we flee to Christ for safety from judgment.',
    application: 'Run to Christ—He is the refuge where no condemnation can reach you.'
  },

  // OFFICE TYPES
  {
    id: 'prophet',
    type: 'Prophet',
    category: 'office',
    otReference: 'Deuteronomy 18:15-19',
    otDescription: 'Spoke God\'s words to the people, called for repentance',
    ntFulfillment: 'Christ is THE Prophet—God\'s final Word to humanity',
    ntReference: 'Acts 3:22-26; Hebrews 1:1-2',
    christConnection: 'Prophets spoke about God; Christ speaks AS God—the final revelation.',
    application: 'When Jesus speaks, we must listen—He is the last word.'
  },
  {
    id: 'priest-office',
    type: 'Priest',
    category: 'office',
    otReference: 'Leviticus 8-9; Hebrews 5:1-4',
    otDescription: 'Represented people before God, offered sacrifice, interceded',
    ntFulfillment: 'Christ is our eternal High Priest who intercedes forever',
    ntReference: 'Hebrews 7:24-25; 9:11-12',
    christConnection: 'Earthly priests offered animal blood; Christ offered His own blood once for all.',
    application: 'You have a Priest who sympathizes with your weakness and intercedes for you always.'
  },
  {
    id: 'king-office',
    type: 'King',
    category: 'office',
    otReference: '1 Samuel 8-10; 2 Samuel 7',
    otDescription: 'Ruled God\'s people, fought their battles, established justice',
    ntFulfillment: 'Christ is King of kings, establishes eternal kingdom',
    ntReference: 'Revelation 19:16; Matthew 2:2; Luke 1:32-33',
    christConnection: 'Human kings failed; Christ reigns forever in righteousness and justice.',
    application: 'Submit to Christ\'s kingdom—His rule brings true freedom and justice.'
  },
  {
    id: 'shepherd-office',
    type: 'Shepherd',
    category: 'office',
    otReference: 'Psalm 23; Ezekiel 34',
    otDescription: 'Led, fed, protected the flock; accountable for their welfare',
    ntFulfillment: 'Christ is the Good Shepherd who lays down His life',
    ntReference: 'John 10:11-16; Hebrews 13:20; 1 Peter 5:4',
    christConnection: 'Human shepherds scattered the flock; Christ gathers and keeps them.',
    application: 'You are known by name, led to green pastures, and protected by the Shepherd.'
  },
  {
    id: 'kinsman-redeemer',
    type: 'Kinsman-Redeemer (Goel)',
    category: 'office',
    otReference: 'Ruth 3-4; Leviticus 25:25-55',
    otDescription: 'Near relative who redeems land, avenges blood, marries widow',
    ntFulfillment: 'Christ became our kinsman to redeem us',
    ntReference: 'Hebrews 2:14-17; Galatians 4:4-5',
    christConnection: 'Christ became human (kinsman), paid the price (redeemer), and takes us as His bride.',
    application: 'Jesus became like us to redeem us—He is our near kinsman and Redeemer.'
  }
];

// Helper function to get types by category
export const getTypesByCategory = (category: BiblicalType['category']) => {
  return typesLibrary.filter(type => type.category === category);
};

// Helper function to search types
export const searchTypes = (query: string) => {
  const lowerQuery = query.toLowerCase();
  return typesLibrary.filter(type =>
    type.type.toLowerCase().includes(lowerQuery) ||
    type.otDescription.toLowerCase().includes(lowerQuery) ||
    type.christConnection.toLowerCase().includes(lowerQuery)
  );
};

// Get a random type for study
export const getRandomType = () => {
  return typesLibrary[Math.floor(Math.random() * typesLibrary.length)];
};
