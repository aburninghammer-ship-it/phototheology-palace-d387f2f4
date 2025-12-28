// Parallels Room Library - OT/NT Mirrored Events
// Parallels show how two events mirror each other, with the NT event escalating the OT

export interface BiblicalParallel {
  id: string;
  title: string;
  category: 'deliverance' | 'judgment' | 'covenant' | 'provision' | 'leadership' | 'sacrifice' | 'creation';
  eventA: {
    reference: string;
    title: string;
    description: string;
  };
  eventB: {
    reference: string;
    title: string;
    description: string;
  };
  echoes: string[];
  escalation: string;
  lesson: string;
}

export const parallelsLibrary: BiblicalParallel[] = [
  // DELIVERANCE PARALLELS
  {
    id: 'moses-rock-christ-cross',
    title: 'Moses Striking Rock / Christ Struck on Cross',
    category: 'deliverance',
    eventA: {
      reference: 'Exodus 17:6; Numbers 20:8-11',
      title: 'Moses strikes the rock',
      description: 'Moses strikes the rock at Horeb with his staff; water flows out to sustain dying Israel in the wilderness.'
    },
    eventB: {
      reference: '1 Corinthians 10:4; John 19:34',
      title: 'Christ struck on the cross',
      description: "Christ is struck on the cross; blood and water flow from His side, providing salvation for dying humanity."
    },
    echoes: [
      'Both involve a violent blow that releases life-giving water',
      'Both provide for people dying of spiritual/physical thirst',
      'Both happen in a place of wilderness/desolation'
    ],
    escalation: "Moses' rock gave physical water for Israel; Christ gives living water (Holy Spirit) for all nations. The rock was struck once—Christ died once for all.",
    lesson: 'Christ is the true Rock; the blow He received provides eternal life, not just temporal relief.'
  },
  {
    id: 'david-goliath-jesus-death',
    title: 'David vs. Goliath / Jesus vs. Death',
    category: 'deliverance',
    eventA: {
      reference: '1 Samuel 17',
      title: 'David defeats Goliath',
      description: 'Young shepherd David faces giant Goliath with only a sling and stones. Victory through unlikely means frees Israel from Philistine oppression.'
    },
    eventB: {
      reference: '1 Corinthians 15:54-57; Hebrews 2:14-15',
      title: 'Jesus defeats Death',
      description: 'Jesus faces the ultimate giant enemy (death) and conquers through the cross—the most unlikely weapon—freeing humanity.'
    },
    echoes: [
      'Both are underdog victories against seemingly unbeatable enemies',
      'Both achieve victory through unexpected, "foolish" means',
      'Both victories deliver God\'s people from oppression',
      'Both champions fight on behalf of others'
    ],
    escalation: "David's victory freed Israel from one enemy nation; Jesus' victory frees humanity from THE ultimate enemy (death) forever.",
    lesson: 'God specializes in giant-killing through unlikely means; Christ\'s resurrection is the ultimate Goliath defeat.'
  },
  {
    id: 'jonah-fish-jesus-tomb',
    title: 'Jonah in the Fish / Jesus in the Tomb',
    category: 'deliverance',
    eventA: {
      reference: 'Jonah 1:17',
      title: 'Jonah three days in fish',
      description: "Jonah spends three days in the fish's belly, a kind of death/burial, then is 'resurrected' onto dry land."
    },
    eventB: {
      reference: 'Matthew 12:39-40',
      title: 'Jesus three days in tomb',
      description: 'Jesus spends three days in the tomb, then rises from the dead on the third day.'
    },
    echoes: [
      'Both experience "death" for three days',
      'Both are "resurrected" on the third day',
      'Both emerge to complete a mission to outsiders (Nineveh/world)'
    ],
    escalation: "Jonah's deliverance was personal and temporary; Jesus' resurrection is cosmic and permanent—He conquers death itself for all who believe.",
    lesson: 'Jesus explicitly claims Jonah as a "sign"—resurrection on the third day is God\'s signature move.'
  },
  {
    id: 'red-sea-baptism',
    title: 'Israel\'s Red Sea Crossing / Christian Baptism',
    category: 'deliverance',
    eventA: {
      reference: 'Exodus 14; 1 Corinthians 10:2',
      title: 'Israel baptized into Moses',
      description: 'Israel passes through the Red Sea; waters close on enemies; they emerge on the other side as freed people.'
    },
    eventB: {
      reference: 'Romans 6:3-4; Colossians 2:12',
      title: 'Believers baptized into Christ',
      description: 'Believers pass through baptismal waters, dying to old life, rising to new life in Christ.'
    },
    echoes: [
      'Both involve passing through water',
      'Both mark transition from old identity (slavery) to new identity (freedom)',
      'Both require faith to step forward',
      'Both leave enemies behind/destroyed'
    ],
    escalation: "Israel's baptism freed them from Pharaoh; Christian baptism buries us with Christ and raises us to new life, freeing us from sin and death eternally.",
    lesson: 'Baptism isn\'t just ritual—it\'s an exodus event where we pass from slavery to freedom through Christ.'
  },
  {
    id: 'noah-ark-christ-salvation',
    title: 'Noah\'s Ark / Salvation in Christ',
    category: 'deliverance',
    eventA: {
      reference: 'Genesis 6-8',
      title: 'Noah saved through the ark',
      description: 'One ark, one door, only means of safety from flood judgment. Eight souls saved by entering.'
    },
    eventB: {
      reference: '1 Peter 3:20-21; John 10:9',
      title: 'Salvation through Christ alone',
      description: 'Christ is the one way, one door, only means of salvation from coming judgment.'
    },
    echoes: [
      'One means of escape from judgment',
      'One door to enter',
      'Must enter before judgment falls',
      'Salvation involves passing through water (flood/baptism)'
    ],
    escalation: 'The ark saved eight from physical flood; Christ saves countless millions from eternal judgment.',
    lesson: 'Christ alone saves—enter before judgment comes; He is our ark of safety.'
  },

  // PROVISION PARALLELS
  {
    id: 'elijah-widow-jesus-multiplication',
    title: 'Elijah & Widow\'s Oil / Jesus Feeds 5,000',
    category: 'provision',
    eventA: {
      reference: '1 Kings 17:8-16; 2 Kings 4:1-7',
      title: 'Widow\'s oil multiplied',
      description: 'During famine, Elijah/Elisha miraculously multiplies widow\'s flour/oil to sustain her household.'
    },
    eventB: {
      reference: 'Matthew 14:13-21; John 6:1-14',
      title: 'Jesus multiplies bread and fish',
      description: 'Jesus multiplies five loaves and two fish to feed 5,000 men plus women and children.'
    },
    echoes: [
      'Both involve miraculous multiplication of food',
      'Both provide for desperate need',
      'Both have abundance left over',
      'Both demonstrate God\'s power over natural scarcity'
    ],
    escalation: "Elijah's miracle fed one household; Jesus' miracle fed thousands. Jesus is not just a prophet WITH God's power—He IS God's power.",
    lesson: 'Jesus is the Bread of Life—He provides not just physical bread but eternal sustenance.'
  },
  {
    id: 'manna-bread-of-life',
    title: 'Manna in Wilderness / Jesus Bread of Life',
    category: 'provision',
    eventA: {
      reference: 'Exodus 16:14-35',
      title: 'Manna from heaven',
      description: 'God provides bread from heaven daily to sustain Israel in the wilderness for 40 years.'
    },
    eventB: {
      reference: 'John 6:31-35, 48-51',
      title: 'Jesus as Bread of Life',
      description: 'Jesus declares Himself the true bread from heaven that gives eternal life.'
    },
    echoes: [
      'Both come down from heaven',
      'Both sustain life in the wilderness',
      'Both must be received/consumed daily',
      'Both are supernatural provision'
    ],
    escalation: 'Manna sustained physical life temporarily (people still died); Christ gives eternal life to all who feed on Him.',
    lesson: 'Daily dependence on Christ—feeding on His Word and person—nourishes our spiritual life.'
  },

  // COVENANT PARALLELS
  {
    id: 'sinai-pentecost',
    title: 'Sinai Covenant / Pentecost',
    category: 'covenant',
    eventA: {
      reference: 'Exodus 19-20',
      title: 'Law given at Sinai',
      description: 'God descends on mountain with fire, thunder; gives Law written on stone tablets.'
    },
    eventB: {
      reference: 'Acts 2:1-4',
      title: 'Spirit given at Pentecost',
      description: 'Spirit descends with fire and wind; Law written on hearts; church empowered.'
    },
    echoes: [
      'Both involve fire as sign of God\'s presence',
      'Both establish a covenant community',
      'Both happen 50 days after previous deliverance (Passover)',
      'Both involve loud sound (thunder/wind)'
    ],
    escalation: 'At Sinai, Law written on stone externally; at Pentecost, Law written on hearts internally (Jer 31:33). About 3,000 died at Sinai (Ex 32); 3,000 saved at Pentecost.',
    lesson: 'The Spirit accomplishes what the Law could not—internal transformation for obedience.'
  },
  {
    id: 'abraham-isaac-god-jesus',
    title: 'Abraham Offering Isaac / God Offering Jesus',
    category: 'sacrifice',
    eventA: {
      reference: 'Genesis 22:1-14',
      title: 'Abraham offers Isaac',
      description: 'Abraham takes only son to Moriah; binds him; raises knife; God provides ram substitute.'
    },
    eventB: {
      reference: 'John 3:16; Romans 8:32',
      title: 'God offers His Son',
      description: 'God gives His only Son; no substitute provided; Jesus dies in our place.'
    },
    echoes: [
      'Both involve giving "only" beloved son',
      'Both happen on a mountain (Moriah = Temple Mount)',
      'Both sons carry the wood for their sacrifice',
      'Both sons submit willingly'
    ],
    escalation: 'Abraham was spared giving Isaac—a ram was provided. God was not spared—He actually gave His Son. What Abraham almost did, God fully did.',
    lesson: 'God Himself provided THE Lamb. The love Abraham displayed for God, God displays for us.'
  },

  // JUDGMENT PARALLELS
  {
    id: 'babel-pentecost',
    title: 'Tower of Babel / Pentecost',
    category: 'judgment',
    eventA: {
      reference: 'Genesis 11:1-9',
      title: 'Languages confused at Babel',
      description: 'Human pride builds tower to heaven; God confuses languages; people scattered.'
    },
    eventB: {
      reference: 'Acts 2:5-12',
      title: 'Languages unified at Pentecost',
      description: 'Spirit comes; disciples speak in tongues; people from all nations understand in their own language.'
    },
    echoes: [
      'Both involve miraculous language events',
      'Both involve all nations/peoples',
      'Both are divine interventions on human gatherings'
    ],
    escalation: 'Babel scattered through language confusion (judgment); Pentecost gathers through language miracle (grace). The curse is reversed.',
    lesson: 'What sin divided, the Spirit reunites. The gospel transcends every barrier humanity erected.'
  },
  {
    id: 'egypt-plagues-revelation-plagues',
    title: 'Egypt Plagues / Revelation Plagues',
    category: 'judgment',
    eventA: {
      reference: 'Exodus 7-12',
      title: 'Ten plagues on Egypt',
      description: 'God sends ten plagues judging Egypt\'s gods; culminates in death of firstborn.'
    },
    eventB: {
      reference: 'Revelation 16',
      title: 'Seven last plagues',
      description: 'God sends final plagues on end-time Babylon; culminates in total destruction.'
    },
    echoes: [
      'Both involve sequential plagues on oppressive systems',
      'Both include water turned to blood',
      'Both include darkness',
      'Both target false gods/worship systems',
      'Both result in deliverance of God\'s people'
    ],
    escalation: 'Egypt plagues were local and temporary; Revelation plagues are global and final. Pharaoh\'s kingdom fell; spiritual Babylon falls forever.',
    lesson: 'God always judges systems that oppose His people. The exodus from Egypt patterns the final exodus from this world.'
  },

  // LEADERSHIP PARALLELS
  {
    id: 'moses-deliverer-jesus-deliverer',
    title: 'Moses the Deliverer / Jesus the Deliverer',
    category: 'leadership',
    eventA: {
      reference: 'Exodus 2-14',
      title: 'Moses delivers Israel',
      description: 'Moses confronts Pharaoh, leads Israel through sea, gives law, mediates covenant.'
    },
    eventB: {
      reference: 'Acts 7:35-37; Hebrews 3:1-6',
      title: 'Jesus delivers humanity',
      description: 'Jesus confronts Satan, leads us through death, gives new commandment, mediates new covenant.'
    },
    echoes: [
      'Both are rejected by their own then become deliverers',
      'Both fast 40 days on a mountain',
      'Both are mediators of a covenant',
      'Both are prophets who speak God\'s words',
      'Both lead God\'s people to the promised land'
    ],
    escalation: 'Moses delivered from Egypt; Jesus delivers from sin. Moses was faithful AS a servant in God\'s house; Jesus is faithful AS a Son over God\'s house.',
    lesson: 'Jesus is the Prophet like Moses, but greater—the final word from God.'
  },
  {
    id: 'joshua-jesus',
    title: 'Joshua Leads into Canaan / Jesus Leads into Rest',
    category: 'leadership',
    eventA: {
      reference: 'Joshua 1-6',
      title: 'Joshua leads into promised land',
      description: 'Joshua (Hebrew: Yeshua) leads Israel across Jordan, conquers Jericho, establishes inheritance.'
    },
    eventB: {
      reference: 'Hebrews 4:8-10',
      title: 'Jesus leads into eternal rest',
      description: 'Jesus (Yeshua) leads believers into true rest—the eternal Sabbath rest.'
    },
    echoes: [
      'Same name: Joshua = Jesus = "Yahweh saves"',
      'Both lead through water (Jordan/baptism)',
      'Both conquer enemies',
      'Both establish an inheritance for God\'s people'
    ],
    escalation: "Joshua's rest was temporary (they still had enemies); Jesus gives true rest from sin and toil forever.",
    lesson: 'What Joshua could not fully accomplish, Jesus completes—eternal rest for the people of God.'
  },
  {
    id: 'elijah-john-baptist',
    title: 'Elijah the Prophet / John the Baptist',
    category: 'leadership',
    eventA: {
      reference: '1 Kings 17-21; 2 Kings 1-2',
      title: 'Elijah calls Israel to repentance',
      description: 'Elijah confronts apostasy, calls Israel back to Yahweh, prepares for coming judgment/deliverance.'
    },
    eventB: {
      reference: 'Matthew 11:14; Luke 1:17',
      title: 'John prepares the way for Christ',
      description: 'John comes in spirit and power of Elijah, calls Israel to repentance, prepares the way for Messiah.'
    },
    echoes: [
      'Both are wilderness prophets',
      'Both confront wicked kings/rulers',
      'Both call for repentance',
      'Both wear distinctive clothing (leather belt)',
      'Both prepare for a greater coming'
    ],
    escalation: 'Elijah prepared for Elisha (double portion); John prepared for Jesus (infinitely greater).',
    lesson: "Elijah's ministry finds completion in John—the voice crying in the wilderness announcing the Lord's arrival."
  },

  // CREATION PARALLELS
  {
    id: 'creation-new-creation',
    title: 'Genesis Creation / New Creation',
    category: 'creation',
    eventA: {
      reference: 'Genesis 1-2',
      title: 'Original creation',
      description: 'God creates heavens and earth, places man in garden, declares it good.'
    },
    eventB: {
      reference: 'Revelation 21-22',
      title: 'New creation',
      description: 'God creates new heavens and earth, brings man into New Jerusalem, declares "no more curse."'
    },
    echoes: [
      'Both involve new heavens and earth',
      'Both have a garden/paradise with tree of life',
      'Both have rivers flowing from God\'s presence',
      'Both have God dwelling with humanity',
      'Both declare perfection/completion'
    ],
    escalation: 'The original was susceptible to fall; the new creation has no serpent, no curse, no possibility of sin entering.',
    lesson: 'What was lost in Genesis 3 is more than restored in Revelation 22—better than Eden because it cannot be lost.'
  },
  {
    id: 'first-adam-last-adam',
    title: 'First Adam / Last Adam',
    category: 'creation',
    eventA: {
      reference: 'Genesis 2-3',
      title: 'Adam in the garden',
      description: 'Adam tested in a garden of abundance; faced temptation to eat forbidden fruit; failed and brought death.'
    },
    eventB: {
      reference: 'Matthew 4:1-11; Romans 5:12-21; 1 Corinthians 15:45',
      title: 'Jesus (Last Adam) tested',
      description: 'Jesus tested in wilderness of scarcity; faced temptation to grasp what wasn\'t given; succeeded and brings life.'
    },
    echoes: [
      'Both are tested on food ("bread")',
      'Both face Satan\'s temptation',
      'Both represent humanity as federal heads',
      'Both their decisions affect all who are "in" them'
    ],
    escalation: 'Adam failed in abundance; Jesus succeeded in poverty. Adam brought death; Jesus brings life. Adam\'s sin condemned; Jesus\' righteousness justifies.',
    lesson: 'Your standing before God depends on which Adam you are in—the one who failed or the One who conquered.'
  }
];

// Helper functions
export const getParallelsByCategory = (category: BiblicalParallel['category']) => {
  return parallelsLibrary.filter(parallel => parallel.category === category);
};

export const searchParallels = (query: string) => {
  const lowerQuery = query.toLowerCase();
  return parallelsLibrary.filter(parallel =>
    parallel.title.toLowerCase().includes(lowerQuery) ||
    parallel.eventA.description.toLowerCase().includes(lowerQuery) ||
    parallel.eventB.description.toLowerCase().includes(lowerQuery) ||
    parallel.lesson.toLowerCase().includes(lowerQuery) ||
    parallel.echoes.some(e => e.toLowerCase().includes(lowerQuery))
  );
};

export const getRandomParallel = () => {
  return parallelsLibrary[Math.floor(Math.random() * parallelsLibrary.length)];
};

export const getAllCategories = () => {
  return [...new Set(parallelsLibrary.map(p => p.category))];
};
