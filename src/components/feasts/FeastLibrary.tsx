import React, { useState } from 'react';
import { Book, ChevronRight, ChevronDown, Scroll, Heart, Sun, Wind, Bell, Scale, Home, Sparkles, BookOpen, MapPin, Users, Eye, Flame, Crown, Leaf, Shield, Star, Cross, Droplets, Wheat } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { cn } from '@/lib/utils';

const feastData = [
  {
    id: 'passover',
    name: 'Passover',
    hebrew: 'Pesach',
    subtitle: 'Redemption & Justification',
    theme: 'Deliverance by blood',
    focus: "Christ's sacrifice",
    timeline: 'Exodus → Cross',
    color: 'from-red-900 to-red-700',
    accent: 'red',
    icon: Cross,
    overview: {
      title: 'Story Overview',
      scripture: 'Exodus 12 → John 19',
      content: 'The Passover commemorates Israel\'s deliverance from Egyptian bondage through the blood of the lamb. On the night of the tenth plague, the angel of death passed over homes marked with lamb\'s blood. This foundational event pointed forward to Christ, the ultimate Passover Lamb, whose blood delivers all who believe from the bondage of sin and eternal death.'
    },
    symbols: [
      { name: 'The Lamb', meaning: 'Christ, the sinless sacrifice (John 1:29)', icon: '🐑' },
      { name: 'Blood on Doorposts', meaning: 'Protection through applied faith (Heb 9:22)', icon: '🩸' },
      { name: 'Bitter Herbs', meaning: 'Remembrance of bondage and sin\'s bitterness', icon: '🌿' },
      { name: 'Unleavened Bread', meaning: 'Haste of departure; sincerity and truth', icon: '🍞' },
      { name: 'Hyssop', meaning: 'Instrument of application; humble faith', icon: '🌾' }
    ],
    christological: {
      title: '"Behold the Lamb of God"',
      points: [
        'Christ crucified at Passover season (Matt 26:2)',
        'No bone broken, fulfilling Exodus 12:46 (John 19:36)',
        '"Christ our Passover is sacrificed for us" (1 Cor 5:7)',
        'Redeemed by precious blood "as of a lamb" (1 Pet 1:18-19)'
      ]
    },
    doctrines: [
      {
        name: 'Justification by Faith',
        content: 'Just as Israel was saved by trusting in the blood applied to their doorposts, we are justified—declared righteous—not by works but by faith in Christ\'s atoning blood (Rom 3:24-26; 5:1, 9).'
      },
      {
        name: 'Substitutionary Atonement',
        content: 'The lamb died in place of the firstborn. Christ died as our substitute, bearing the penalty we deserved (Isa 53:5-6; 2 Cor 5:21; 1 Pet 2:24).'
      }
    ],
    application: {
      title: '"Leaving Egypt" — Personal Bondage',
      questions: [
        'What "Egypt" (bondage, addiction, habitual sin) is God calling you to leave?',
        'Have you personally applied the blood—accepted Christ\'s sacrifice for yourself?',
        'Are you living in the freedom Christ purchased, or returning to old chains?'
      ]
    },
    keyVerses: ['Exodus 12:13', 'John 1:29', '1 Corinthians 5:7', '1 Peter 1:18-19']
  },
  {
    id: 'unleavened',
    name: 'Unleavened Bread',
    hebrew: 'Chag HaMatzot',
    subtitle: 'Sanctification Begins',
    theme: 'Separation from sin',
    focus: 'The sinless life of Christ and the call to holiness',
    timeline: 'Nisan 15-21',
    color: 'from-amber-800 to-amber-600',
    accent: 'amber',
    icon: Leaf,
    overview: {
      title: 'Story Overview',
      scripture: 'Exodus 12:15-20; 1 Corinthians 5:6-8',
      content: 'For seven days following Passover, Israel was to eat only unleavened bread and remove all leaven from their homes. Leaven, which causes fermentation and puffing up, symbolizes sin and its corrupting influence. This feast teaches that redemption (Passover) must be followed by sanctification—a deliberate putting away of sin.'
    },
    symbols: [
      { name: 'Leaven', meaning: 'Sin, malice, wickedness, false doctrine', icon: '🧫' },
      { name: 'Unleavened Bread', meaning: 'Sincerity, truth, purity (1 Cor 5:8)', icon: '🫓' },
      { name: 'Seven Days', meaning: 'Completeness; entire life of sanctification', icon: '7️⃣' },
      { name: 'Searching the Home', meaning: 'Examining the heart for hidden sin', icon: '🔍' }
    ],
    christological: {
      title: 'Christ\'s Sinless Life',
      points: [
        'Jesus was "without sin" (Heb 4:15)',
        'He "knew no sin" (2 Cor 5:21)',
        '"In him is no sin" (1 John 3:5)',
        'He is our unleavened bread of life'
      ]
    },
    doctrines: [
      {
        name: 'Progressive Sanctification',
        content: 'Salvation is not merely a moment but a journey. After justification comes the daily work of sanctification—being set apart, growing in holiness, and progressively reflecting Christ\'s character (1 Thess 4:3; Heb 12:14).'
      },
      {
        name: 'Putting Away the Old Nature',
        content: '"Put off the old man" and "put on the new man" (Eph 4:22-24). The Christian life involves active removal of sinful habits, thoughts, and patterns.'
      }
    ],
    leavenScanner: {
      title: 'Leaven Scanner',
      subtitle: 'Identify habits that still "leaven" your life',
      categories: [
        { name: 'Pride & Self-Exaltation', examples: ['Self-promotion', 'Refusing correction', 'Looking down on others'] },
        { name: 'Malice & Bitterness', examples: ['Unforgiveness', 'Resentment', 'Desire for revenge'] },
        { name: 'Impurity', examples: ['Lustful thoughts', 'Unwholesome entertainment', 'Corrupt speech'] },
        { name: 'Hypocrisy', examples: ['Saying one thing, doing another', 'Performance religion', 'Hidden sin'] },
        { name: 'False Doctrine', examples: ['Compromised truth', 'Worldly philosophy', 'Syncretism'] }
      ]
    },
    application: {
      title: 'Spiritual Disciplines for Cleansing',
      questions: [
        'What "leaven" has the Holy Spirit been revealing in your life?',
        'Are you actively pursuing holiness or passively drifting?',
        'What spiritual disciplines (prayer, fasting, Scripture study) need renewal?'
      ]
    },
    keyVerses: ['Exodus 12:15', '1 Corinthians 5:6-8', 'Galatians 5:9', '2 Corinthians 7:1']
  },
  {
    id: 'firstfruits',
    name: 'Firstfruits',
    hebrew: 'Bikkurim',
    subtitle: 'Resurrection & New Life',
    theme: 'Victory over death',
    focus: "Christ's resurrection as guarantee",
    timeline: 'Day after Sabbath of Passover week',
    color: 'from-green-800 to-green-600',
    accent: 'green',
    icon: Sun,
    overview: {
      title: 'Story Overview',
      scripture: 'Leviticus 23:9-14; 1 Corinthians 15:20-23',
      content: 'On the day after the Sabbath during Passover week, the priest waved a sheaf of the first grain harvest before the Lord. This "firstfruits" represented the whole harvest to come—a promise and guarantee. Christ rose on this very day, becoming the "firstfruits of them that slept."'
    },
    symbols: [
      { name: 'Sheaf of Grain', meaning: 'Christ risen, first of the harvest', icon: '🌾' },
      { name: 'Wave Offering', meaning: 'Presentation to God; acceptance', icon: '👐' },
      { name: 'Day After Sabbath', meaning: 'Resurrection Sunday; new beginning', icon: '☀️' },
      { name: 'Sprouting Seed', meaning: 'Life from death; John 12:24', icon: '🌱' }
    ],
    christological: {
      title: 'Christ as Firstfruits',
      points: [
        '"Christ the firstfruits; afterward they that are Christ\'s" (1 Cor 15:23)',
        'Rose on the exact day of Firstfruits',
        'His resurrection guarantees ours',
        '"Because I live, ye shall live also" (John 14:19)'
      ]
    },
    typology: {
      title: 'Resurrection Typology',
      figures: [
        { name: 'Joseph', description: 'Raised from pit and prison to throne; foreshadows Christ\'s exaltation after humiliation' },
        { name: 'Isaac', description: 'Received back "from the dead" in a figure (Heb 11:19); three-day journey to Moriah' },
        { name: 'Jonah', description: 'Three days in the great fish; Jesus\'s explicit type (Matt 12:40)' },
        { name: 'The Dry Bones', description: 'Ezekiel 37—Israel\'s national resurrection pictures spiritual resurrection' }
      ]
    },
    doctrines: [
      {
        name: 'Bodily Resurrection',
        content: 'The resurrection is not merely spiritual but bodily. Christ rose physically (Luke 24:39), and so shall we (1 Cor 15:42-44). Our bodies will be transformed, glorified, and immortal.'
      },
      {
        name: 'New Life in Christ',
        content: 'We have already experienced a spiritual resurrection—raised with Christ to "walk in newness of life" (Rom 6:4). The old has passed; the new has come (2 Cor 5:17).'
      }
    ],
    application: {
      title: 'Living in Resurrection Power',
      questions: [
        'Are you living in the power of Christ\'s resurrection or still in defeat?',
        'Does your life reflect the "newness" that comes from being raised with Christ?',
        'How does the hope of bodily resurrection shape how you view suffering and death?'
      ]
    },
    keyVerses: ['Leviticus 23:10-11', '1 Corinthians 15:20-23', 'Romans 6:4-5', 'Colossians 3:1']
  },
  {
    id: 'pentecost',
    name: 'Pentecost',
    hebrew: 'Shavuot',
    subtitle: 'Empowerment & Harvest',
    theme: 'Spirit-filled mission',
    focus: 'The birth of the Church',
    timeline: '50 days after Firstfruits',
    color: 'from-orange-700 to-orange-500',
    accent: 'orange',
    icon: Flame,
    overview: {
      title: 'Story Overview',
      scripture: 'Leviticus 23:15-21; Acts 2',
      content: 'Fifty days after Firstfruits, Israel celebrated the wheat harvest with two leavened loaves. On this exact day, the Holy Spirit fell upon the disciples, empowering them to take the gospel to all nations. The Church was born as 3,000 souls were added—the firstfruits of a greater harvest.'
    },
    symbols: [
      { name: 'Two Leavened Loaves', meaning: 'Jew and Gentile united in one body', icon: '🍞' },
      { name: 'Fire', meaning: 'Purifying, empowering presence of the Spirit', icon: '🔥' },
      { name: 'Wind', meaning: 'Breath of God; Spirit\'s sovereign movement', icon: '💨' },
      { name: 'Tongues', meaning: 'Gospel to all languages and peoples', icon: '👅' },
      { name: 'Harvest', meaning: 'Ingathering of souls', icon: '🌾' }
    ],
    christological: {
      title: 'Law Written on Hearts',
      points: [
        'At Sinai (first Pentecost): Law on stone, 3,000 died (Ex 32:28)',
        'At Jerusalem: Law on hearts, 3,000 saved (Acts 2:41)',
        'The Spirit fulfills Jeremiah 31:33 and Ezekiel 36:26-27',
        'Christ sends "another Comforter" (John 14:16)'
      ]
    },
    spiritGifts: {
      title: 'Spiritual Gifts Explorer',
      categories: [
        { name: 'Revelatory Gifts', gifts: ['Word of Wisdom', 'Word of Knowledge', 'Discerning of Spirits'] },
        { name: 'Power Gifts', gifts: ['Faith', 'Gifts of Healing', 'Working of Miracles'] },
        { name: 'Vocal Gifts', gifts: ['Prophecy', 'Tongues', 'Interpretation of Tongues'] },
        { name: 'Service Gifts', gifts: ['Teaching', 'Helps', 'Administration', 'Giving', 'Mercy'] }
      ]
    },
    actsExpansion: {
      title: 'Map of Acts Expansion',
      stages: [
        { location: 'Jerusalem', description: 'Acts 1-7: Gospel to Jews in the holy city' },
        { location: 'Judea & Samaria', description: 'Acts 8: Persecution scatters; Philip in Samaria' },
        { location: 'Gentile World', description: 'Acts 9-12: Cornelius; Antioch church' },
        { location: 'Asia Minor', description: 'Acts 13-14: First missionary journey' },
        { location: 'Europe', description: 'Acts 16-18: Philippi, Thessalonica, Corinth' },
        { location: 'Rome', description: 'Acts 28: "Uttermost part of the earth"' }
      ]
    },
    doctrines: [
      {
        name: 'The Gift of the Spirit',
        content: 'The Holy Spirit is Christ\'s promised gift to all believers, empowering them for witness, sanctifying their lives, and distributing gifts for ministry (Acts 1:8; Rom 8:9-11).'
      },
      {
        name: 'The Unity of the Body',
        content: 'The two leavened loaves represent Jew and Gentile united in one body. In Christ, all dividing walls are broken down (Eph 2:14-16).'
      }
    ],
    application: {
      title: 'Spirit-Empowered Living',
      questions: [
        'Have you received the empowerment of the Holy Spirit for witness?',
        'What spiritual gifts has God given you for building up the body?',
        'Are you participating in the harvest—sharing the gospel?'
      ]
    },
    keyVerses: ['Acts 2:1-4', 'Acts 1:8', 'Joel 2:28-29', '1 Corinthians 12:7-11']
  },
  {
    id: 'trumpets',
    name: 'Trumpets',
    hebrew: 'Yom Teruah',
    subtitle: 'Warning & Awakening',
    theme: 'Judgment proclaimed',
    focus: 'Prophetic warning before crisis',
    timeline: 'Tishri 1 (Seventh month)',
    color: 'from-purple-900 to-purple-700',
    accent: 'purple',
    icon: Bell,
    overview: {
      title: 'Story Overview',
      scripture: 'Leviticus 23:23-25; Numbers 29:1-6',
      content: 'The Feast of Trumpets opened the sacred seventh month with a day of rest, sacrifice, and trumpet blasts. It was a wake-up call—ten days before the solemn Day of Atonement. Prophetically, it represents the final warning message before judgment, calling humanity to repentance and decision.'
    },
    symbols: [
      { name: 'Shofar (Trumpet)', meaning: 'Warning, alarm, call to attention', icon: '📯' },
      { name: 'Seventh Month', meaning: 'Completion; final events', icon: '7️⃣' },
      { name: 'Ten Days of Awe', meaning: 'Period of self-examination before judgment', icon: '🔟' },
      { name: 'Awakening Blast', meaning: '"Awake, O sleeper!" (Eph 5:14)', icon: '⏰' }
    ],
    christological: {
      title: 'Prophetic Warnings Through History',
      points: [
        'Noah: 120 years of warning before flood',
        'Jonah: 40 days before Nineveh\'s deadline',
        'John the Baptist: "Repent, for the kingdom is at hand"',
        'Revelation Trumpets: Final warnings before the end'
      ]
    },
    revelationParallels: {
      title: 'Revelation Trumpet Parallels',
      trumpets: [
        { number: '1st', judgment: 'Earth struck—hail, fire, blood', meaning: 'Judgment on land' },
        { number: '2nd', judgment: 'Sea struck—burning mountain', meaning: 'Judgment on sea' },
        { number: '3rd', judgment: 'Rivers struck—Wormwood', meaning: 'Bitter waters of false doctrine' },
        { number: '4th', judgment: 'Heavens struck—darkness', meaning: 'Spiritual darkness' },
        { number: '5th', judgment: 'Locusts from abyss', meaning: 'Demonic deception' },
        { number: '6th', judgment: 'Armies from Euphrates', meaning: 'Final conflict approaches' },
        { number: '7th', judgment: '"Kingdom of our Lord"', meaning: 'Christ takes dominion' }
      ]
    },
    historicalFulfillment: {
      title: 'Millerite Movement & Modern Prophetic Calling',
      content: 'In the 1830s-1840s, William Miller and others proclaimed that prophecy pointed to an imminent event. Though they misunderstood what would happen, the timing was significant—a trumpet message went forth, awakening interest in Bible prophecy and calling people to prepare for judgment.'
    },
    doctrines: [
      {
        name: 'The Prophetic Call to Repentance',
        content: 'God always warns before judgment. The trumpets represent His mercy in giving time and opportunity for repentance before the final verdict (2 Pet 3:9).'
      },
      {
        name: 'Watchfulness and Readiness',
        content: 'Jesus calls us to be watchful, for we do not know the day or hour. The trumpet blast is a reminder to stay spiritually alert (Matt 24:42-44; 1 Thess 5:1-6).'
      }
    ],
    application: {
      title: 'The Call to Decision',
      questions: [
        'Are you spiritually awake or spiritually asleep?',
        'How are you responding to God\'s warnings in your life?',
        'Are you sounding the trumpet—sharing the urgency of the hour?'
      ]
    },
    keyVerses: ['Leviticus 23:24', 'Joel 2:1', 'Revelation 8-9', 'Ezekiel 33:3-6']
  },
  {
    id: 'atonement',
    name: 'Day of Atonement',
    hebrew: 'Yom Kippur',
    subtitle: 'Judgment & Cleansing',
    theme: 'Final judgment and heart examination',
    focus: "Christ's high-priestly ministry",
    timeline: 'Tishri 10',
    color: 'from-slate-800 to-slate-600',
    accent: 'slate',
    icon: Scale,
    overview: {
      title: 'Story Overview',
      scripture: 'Leviticus 16; 23:26-32; Hebrews 9',
      content: 'The most solemn day of the Hebrew calendar. The high priest entered the Most Holy Place once a year to make atonement for all Israel\'s sins. Two goats were involved: one sacrificed, its blood brought into the sanctuary; the other (scapegoat) sent into the wilderness bearing confessed sins. This foreshadows Christ\'s complete work of judgment and sin removal.'
    },
    symbols: [
      { name: 'High Priest', meaning: 'Christ, our great High Priest (Heb 4:14)', icon: '👑' },
      { name: 'Most Holy Place', meaning: 'Heaven itself; God\'s presence', icon: '✨' },
      { name: 'Lord\'s Goat', meaning: 'Christ\'s sacrifice for sin', icon: '🐐' },
      { name: 'Scapegoat (Azazel)', meaning: 'Sin placed on Satan; final removal', icon: '🏜️' },
      { name: 'Afflicting the Soul', meaning: 'Self-examination, fasting, repentance', icon: '💔' }
    ],
    christological: {
      title: "Christ's High-Priestly Ministry",
      points: [
        'Christ entered "heaven itself" with His own blood (Heb 9:12, 24)',
        'He appears "in the presence of God for us" (Heb 9:24)',
        'His ministry cleanses conscience (Heb 9:14)',
        'He will appear "second time without sin unto salvation" (Heb 9:28)'
      ]
    },
    leviticus16: {
      title: 'Leviticus 16 Unpacked',
      sequence: [
        { step: 1, action: 'High priest washes, puts on white linen', meaning: 'Purity; Christ\'s righteousness' },
        { step: 2, action: 'Bull sacrificed for priest\'s house', meaning: 'Christ needed no sacrifice for Himself' },
        { step: 3, action: 'Lots cast over two goats', meaning: 'Divine selection; God\'s sovereign plan' },
        { step: 4, action: 'Lord\'s goat sacrificed, blood brought in', meaning: 'Christ\'s death; blood applied in heaven' },
        { step: 5, action: 'Mercy seat sprinkled', meaning: 'Atonement made; justice satisfied' },
        { step: 6, action: 'Sins confessed on scapegoat', meaning: 'Sin transferred; removed from camp' },
        { step: 7, action: 'Scapegoat sent to wilderness', meaning: 'Satan bears responsibility; banished' }
      ]
    },
    investigativeJudgment: {
      title: 'Investigative Judgment',
      content: 'Before Christ returns, there is a work of judgment in heaven—examining the records, vindicating the righteous, and preparing for final reward and punishment. "The hour of His judgment is come" (Rev 14:7). Names written in the book of life are examined (Dan 7:9-10; Rev 20:12).'
    },
    spiritualInventory: {
      title: 'Spiritual Inventory Room',
      subtitle: 'Guided Self-Examination',
      areas: [
        { area: 'Relationship with God', questions: ['Is my devotional life consistent?', 'Do I trust God fully?', 'Am I harboring rebellion?'] },
        { area: 'Relationship with Others', questions: ['Have I forgiven everyone?', 'Are there broken relationships I\'ve ignored?', 'Am I honest in all dealings?'] },
        { area: 'Personal Integrity', questions: ['Are my private life and public life consistent?', 'What secret sins need confession?', 'Am I living authentically?'] },
        { area: 'Stewardship', questions: ['How am I using my time, talents, treasure?', 'Am I faithful in tithe and offerings?', 'Do I care for my body as God\'s temple?'] }
      ]
    },
    doctrines: [
      {
        name: 'The Heavenly Sanctuary',
        content: 'The earthly sanctuary was a copy of the heavenly reality (Heb 8:5). Christ ministers in the true tabernacle, cleansing the heavenly sanctuary and the conscience of believers.'
      },
      {
        name: 'Complete Sin Removal',
        content: 'The Day of Atonement pictures the final eradication of sin from the universe. Not only forgiven but removed—never to rise again (Nahum 1:9).'
      }
    ],
    application: {
      title: 'Afflicting the Soul Today',
      questions: [
        'Have you done the deep heart work this feast requires?',
        'Is there any unconfessed sin separating you from God?',
        'Are you resting in Christ\'s completed atonement while cooperating with His sanctifying work?'
      ]
    },
    keyVerses: ['Leviticus 16:30', 'Hebrews 9:11-14', 'Daniel 7:9-10', 'Revelation 14:7']
  },
  {
    id: 'tabernacles',
    name: 'Tabernacles',
    hebrew: 'Sukkot',
    subtitle: 'Restoration & God With Us',
    theme: 'God dwelling with humanity',
    focus: 'Restoration, joy, eternity',
    timeline: 'Tishri 15-22',
    color: 'from-emerald-700 to-teal-500',
    accent: 'emerald',
    icon: Home,
    overview: {
      title: 'Story Overview',
      scripture: 'Leviticus 23:33-44; John 7:37-39; Revelation 21',
      content: 'The final feast of the year was the most joyful—a week-long celebration of harvest ingathering, dwelling in booths (remembering wilderness journey), and anticipating God\'s eternal dwelling with His people. Water and light ceremonies pointed to Christ. This feast awaits its ultimate fulfillment in the New Earth.'
    },
    symbols: [
      { name: 'Booths/Tabernacles', meaning: 'Temporary dwelling; pilgrimage; God with us', icon: '⛺' },
      { name: 'Four Species', meaning: 'Different types of believers united in worship', icon: '🌿' },
      { name: 'Water Ceremony', meaning: 'Living water; Holy Spirit (John 7:37-39)', icon: '💧' },
      { name: 'Light Ceremony', meaning: 'Light of the world (John 8:12)', icon: '💡' },
      { name: 'Eighth Day', meaning: 'Eternity; new beginning beyond time', icon: '8️⃣' }
    ],
    christological: {
      title: 'God Tabernacling With Humanity',
      points: [
        '"The Word became flesh and tabernacled among us" (John 1:14)',
        'Jesus attended Tabernacles and proclaimed Himself living water (John 7)',
        'He declared "I am the light of the world" (John 8:12)',
        '"Behold, the tabernacle of God is with men" (Rev 21:3)'
      ]
    },
    newEarthTheology: {
      title: 'New Earth Theology',
      elements: [
        { element: 'Golden City', description: 'New Jerusalem descends—God\'s dwelling with humanity (Rev 21:2)' },
        { element: 'Open Gates', description: 'Perpetual access; no more separation (Rev 21:25)' },
        { element: 'Living Water', description: 'River of life flowing from the throne (Rev 22:1)' },
        { element: 'Tree of Life', description: 'Healing, immortality, Eden restored (Rev 22:2)' },
        { element: 'No More Curse', description: 'Sin\'s effects fully removed (Rev 22:3)' },
        { element: 'Face to Face', description: 'We shall see Him as He is (Rev 22:4)' }
      ]
    },
    ingathering: {
      title: 'Feast of Ingathering',
      content: 'Tabernacles celebrates the final harvest—all crops gathered in. Prophetically, this represents the final ingathering of God\'s people from all nations, the completion of the gospel commission, and the great reunion of the redeemed.'
    },
    joyElements: {
      title: 'Joy, Rest, and Celebration',
      aspects: [
        { name: 'Commanded Joy', text: '"You shall rejoice in your feast" (Deut 16:14)—joy is not optional but commanded!' },
        { name: 'Complete Rest', text: 'The journey is over; struggle has ended; eternal Sabbath rest begins' },
        { name: 'Community', text: 'All God\'s people together—no more loneliness, no more exile' },
        { name: 'Abundance', text: 'Harvest fullness; "no more hunger or thirst" (Rev 7:16)' }
      ]
    },
    doctrines: [
      {
        name: 'The New Earth',
        content: 'God will create a new heaven and new earth where righteousness dwells (2 Pet 3:13). The tabernacle of God will be with men, and He will dwell with them (Rev 21:3).'
      },
      {
        name: 'Eternal Joy',
        content: 'The joy of Tabernacles points to eternal joy in God\'s presence—fullness of joy and pleasures forevermore (Ps 16:11).'
      }
    ],
    application: {
      title: 'Living as Pilgrims',
      questions: [
        'Do you live with eternity in view, as a pilgrim in temporary dwellings?',
        'Is your life characterized by the joy this feast commands?',
        'Are you eagerly anticipating God\'s eternal dwelling with humanity?'
      ]
    },
    keyVerses: ['Leviticus 23:42-43', 'John 7:37-39', 'Revelation 21:3-4', 'Revelation 22:1-5']
  }
];

interface TabButtonProps {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
  color: string;
}

const TabButton: React.FC<TabButtonProps> = ({ active, onClick, children, color }) => (
  <button
    onClick={onClick}
    className={cn(
      "px-3 py-2 text-sm font-medium rounded-lg transition-all",
      active 
        ? `bg-gradient-to-r ${color} text-white shadow-lg` 
        : 'bg-muted text-muted-foreground hover:bg-muted/80'
    )}
  >
    {children}
  </button>
);

interface SectionProps {
  title: string;
  icon?: React.ElementType;
  children: React.ReactNode;
  defaultOpen?: boolean;
}

const Section: React.FC<SectionProps> = ({ title, icon: Icon, children, defaultOpen = false }) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  
  return (
    <div className="border border-border rounded-lg mb-3 overflow-hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center gap-2 p-3 bg-muted/50 hover:bg-muted transition-colors text-left"
      >
        {isOpen ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
        {Icon && <Icon size={18} className="text-muted-foreground" />}
        <span className="font-semibold text-foreground">{title}</span>
      </button>
      {isOpen && <div className="p-4 bg-card">{children}</div>}
    </div>
  );
};

const FeastLibrary: React.FC = () => {
  const [selectedFeast, setSelectedFeast] = useState(feastData[0]);
  const [activeTab, setActiveTab] = useState('overview');
  
  const FeastIcon = selectedFeast.icon;
  
  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'symbols', label: 'Symbols' },
    { id: 'christ', label: 'Christ' },
    { id: 'doctrine', label: 'Doctrine' },
    { id: 'interactive', label: 'Interactive' },
    { id: 'application', label: 'Apply' }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className={`bg-gradient-to-r ${selectedFeast.color} text-white p-6`}>
        <div className="flex items-center gap-3 mb-2">
          <FeastIcon size={32} />
          <div>
            <h1 className="text-2xl font-bold">{selectedFeast.name}</h1>
            <p className="text-white/80 text-sm">{selectedFeast.hebrew}</p>
          </div>
        </div>
        <p className="text-lg font-medium">{selectedFeast.subtitle}</p>
        <div className="flex flex-wrap gap-4 mt-3 text-sm text-white/90">
          <span><strong>Theme:</strong> {selectedFeast.theme}</span>
          <span><strong>Focus:</strong> {selectedFeast.focus}</span>
        </div>
      </div>

      <div className="p-4">
        {/* Feast Selector */}
        <div className="flex flex-wrap gap-2 mb-4">
          {feastData.map((feast) => {
            const Icon = feast.icon;
            return (
              <button
                key={feast.id}
                onClick={() => { setSelectedFeast(feast); setActiveTab('overview'); }}
                className={cn(
                  "flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-medium transition-all",
                  selectedFeast.id === feast.id
                    ? `bg-gradient-to-r ${feast.color} text-white shadow-md`
                    : 'bg-card text-foreground hover:bg-muted border border-border'
                )}
              >
                <Icon size={14} />
                <span className="hidden sm:inline">{feast.name}</span>
              </button>
            );
          })}
        </div>

        {/* Tab Navigation */}
        <div className="flex flex-wrap gap-2 mb-4 pb-3 border-b border-border">
          {tabs.map((tab) => (
            <TabButton
              key={tab.id}
              active={activeTab === tab.id}
              onClick={() => setActiveTab(tab.id)}
              color={selectedFeast.color}
            >
              {tab.label}
            </TabButton>
          ))}
        </div>

        {/* Content Area */}
        <Card>
          <CardContent className="p-4">
            {activeTab === 'overview' && (
              <div>
                <Section title={selectedFeast.overview.title} icon={BookOpen} defaultOpen={true}>
                  <p className="text-sm text-muted-foreground mb-2">{selectedFeast.overview.scripture}</p>
                  <p className="text-foreground leading-relaxed">{selectedFeast.overview.content}</p>
                </Section>
                <Section title="Key Verses" icon={Book}>
                  <div className="flex flex-wrap gap-2">
                    {selectedFeast.keyVerses.map((verse, i) => (
                      <span key={i} className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm">
                        {verse}
                      </span>
                    ))}
                  </div>
                </Section>
              </div>
            )}

            {activeTab === 'symbols' && (
              <div className="grid gap-3">
                {selectedFeast.symbols.map((symbol, i) => (
                  <div key={i} className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg">
                    <span className="text-2xl">{symbol.icon}</span>
                    <div>
                      <h4 className="font-semibold text-foreground">{symbol.name}</h4>
                      <p className="text-muted-foreground text-sm">{symbol.meaning}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'christ' && (
              <div>
                <Section title={selectedFeast.christological.title} icon={Crown} defaultOpen={true}>
                  <ul className="space-y-2">
                    {selectedFeast.christological.points.map((point, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <Sparkles size={16} className="text-amber-500 mt-1 flex-shrink-0" />
                        <span className="text-foreground">{point}</span>
                      </li>
                    ))}
                  </ul>
                </Section>
                
                {selectedFeast.typology && (
                  <Section title="Resurrection Typology" icon={Users}>
                    <div className="space-y-3">
                      {selectedFeast.typology.figures.map((fig, i) => (
                        <div key={i} className="p-3 bg-green-500/10 rounded-lg">
                          <h4 className="font-semibold text-green-700 dark:text-green-400">{fig.name}</h4>
                          <p className="text-muted-foreground text-sm">{fig.description}</p>
                        </div>
                      ))}
                    </div>
                  </Section>
                )}

                {selectedFeast.leviticus16 && (
                  <Section title="Leviticus 16 Sequence" icon={Scroll}>
                    <div className="space-y-2">
                      {selectedFeast.leviticus16.sequence.map((item, i) => (
                        <div key={i} className="flex gap-3 p-2 border-l-4 border-slate-400 bg-slate-500/10">
                          <span className="font-bold text-slate-600 dark:text-slate-400">{item.step}.</span>
                          <div>
                            <p className="text-foreground text-sm">{item.action}</p>
                            <p className="text-muted-foreground text-xs italic">{item.meaning}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </Section>
                )}

                {selectedFeast.newEarthTheology && (
                  <Section title="New Earth Elements" icon={Star}>
                    <div className="grid gap-2">
                      {selectedFeast.newEarthTheology.elements.map((el, i) => (
                        <div key={i} className="p-3 bg-emerald-500/10 rounded-lg">
                          <h4 className="font-semibold text-emerald-700 dark:text-emerald-400">{el.element}</h4>
                          <p className="text-muted-foreground text-sm">{el.description}</p>
                        </div>
                      ))}
                    </div>
                  </Section>
                )}
              </div>
            )}

            {activeTab === 'doctrine' && (
              <div className="space-y-4">
                {selectedFeast.doctrines.map((doc, i) => (
                  <div key={i} className="p-4 border-l-4 border-primary bg-primary/5 rounded-r-lg">
                    <h3 className="font-bold text-primary mb-2">{doc.name}</h3>
                    <p className="text-foreground">{doc.content}</p>
                  </div>
                ))}
                
                {selectedFeast.investigativeJudgment && (
                  <div className="p-4 border-l-4 border-purple-500 bg-purple-500/10 rounded-r-lg">
                    <h3 className="font-bold text-purple-700 dark:text-purple-400 mb-2">{selectedFeast.investigativeJudgment.title}</h3>
                    <p className="text-foreground">{selectedFeast.investigativeJudgment.content}</p>
                  </div>
                )}

                {selectedFeast.historicalFulfillment && (
                  <div className="p-4 border-l-4 border-indigo-500 bg-indigo-500/10 rounded-r-lg">
                    <h3 className="font-bold text-indigo-700 dark:text-indigo-400 mb-2">{selectedFeast.historicalFulfillment.title}</h3>
                    <p className="text-foreground">{selectedFeast.historicalFulfillment.content}</p>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'interactive' && (
              <div>
                {selectedFeast.leavenScanner && (
                  <Section title={selectedFeast.leavenScanner.title} icon={Eye} defaultOpen={true}>
                    <p className="text-muted-foreground text-sm mb-3">{selectedFeast.leavenScanner.subtitle}</p>
                    <div className="space-y-3">
                      {selectedFeast.leavenScanner.categories.map((cat, i) => (
                        <div key={i} className="p-3 bg-amber-500/10 rounded-lg">
                          <h4 className="font-semibold text-amber-700 dark:text-amber-400">{cat.name}</h4>
                          <ul className="mt-1 text-sm text-muted-foreground">
                            {cat.examples.map((ex, j) => (
                              <li key={j}>• {ex}</li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                  </Section>
                )}

                {selectedFeast.spiritGifts && (
                  <Section title={selectedFeast.spiritGifts.title} icon={Flame} defaultOpen={true}>
                    <div className="grid gap-3">
                      {selectedFeast.spiritGifts.categories.map((cat, i) => (
                        <div key={i} className="p-3 bg-orange-500/10 rounded-lg">
                          <h4 className="font-semibold text-orange-700 dark:text-orange-400">{cat.name}</h4>
                          <div className="flex flex-wrap gap-1 mt-2">
                            {cat.gifts.map((gift, j) => (
                              <span key={j} className="px-2 py-1 bg-card text-orange-700 dark:text-orange-400 rounded text-xs border border-orange-200 dark:border-orange-800">
                                {gift}
                              </span>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </Section>
                )}

                {selectedFeast.actsExpansion && (
                  <Section title={selectedFeast.actsExpansion.title} icon={MapPin}>
                    <div className="space-y-2">
                      {selectedFeast.actsExpansion.stages.map((stage, i) => (
                        <div key={i} className="flex gap-3 items-start p-2 bg-primary/5 rounded">
                          <MapPin size={16} className="text-primary mt-1" />
                          <div>
                            <span className="font-semibold text-primary">{stage.location}</span>
                            <p className="text-muted-foreground text-sm">{stage.description}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </Section>
                )}

                {selectedFeast.revelationParallels && (
                  <Section title={selectedFeast.revelationParallels.title} icon={Bell} defaultOpen={true}>
                    <div className="space-y-2">
                      {selectedFeast.revelationParallels.trumpets.map((t, i) => (
                        <div key={i} className="p-2 bg-purple-500/10 rounded flex gap-3">
                          <span className="font-bold text-purple-700 dark:text-purple-400">{t.number}</span>
                          <div>
                            <p className="text-foreground text-sm">{t.judgment}</p>
                            <p className="text-muted-foreground text-xs">{t.meaning}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </Section>
                )}

                {selectedFeast.spiritualInventory && (
                  <Section title={selectedFeast.spiritualInventory.title} icon={Heart} defaultOpen={true}>
                    <p className="text-muted-foreground text-sm mb-3">{selectedFeast.spiritualInventory.subtitle}</p>
                    <div className="space-y-4">
                      {selectedFeast.spiritualInventory.areas.map((area, i) => (
                        <div key={i} className="p-3 bg-slate-500/10 rounded-lg">
                          <h4 className="font-semibold text-slate-700 dark:text-slate-300 mb-2">{area.area}</h4>
                          <ul className="space-y-1">
                            {area.questions.map((q, j) => (
                              <li key={j} className="text-muted-foreground text-sm flex items-start gap-2">
                                <Checkbox id={`inventory-${i}-${j}`} />
                                <label htmlFor={`inventory-${i}-${j}`} className="cursor-pointer">{q}</label>
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                  </Section>
                )}

                {selectedFeast.joyElements && (
                  <Section title={selectedFeast.joyElements.title} icon={Star} defaultOpen={true}>
                    <div className="space-y-3">
                      {selectedFeast.joyElements.aspects.map((asp, i) => (
                        <div key={i} className="p-3 bg-emerald-500/10 rounded-lg">
                          <h4 className="font-semibold text-emerald-700 dark:text-emerald-400">{asp.name}</h4>
                          <p className="text-muted-foreground text-sm">{asp.text}</p>
                        </div>
                      ))}
                    </div>
                  </Section>
                )}

                {!selectedFeast.leavenScanner && !selectedFeast.spiritGifts && !selectedFeast.revelationParallels && !selectedFeast.spiritualInventory && !selectedFeast.joyElements && (
                  <div className="text-center py-8 text-muted-foreground">
                    <p>Interactive features coming soon for this feast!</p>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'application' && (
              <div>
                <div className="p-4 bg-gradient-to-r from-indigo-500/10 to-purple-500/10 rounded-lg mb-4">
                  <h3 className="font-bold text-indigo-700 dark:text-indigo-400 mb-3">{selectedFeast.application.title}</h3>
                  <ul className="space-y-3">
                    {selectedFeast.application.questions.map((q, i) => (
                      <li key={i} className="flex items-start gap-3">
                        <span className="w-6 h-6 flex items-center justify-center bg-indigo-600 text-white rounded-full text-sm flex-shrink-0">
                          {i + 1}
                        </span>
                        <span className="text-foreground">{q}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div className="p-4 border border-dashed border-border rounded-lg">
                  <h4 className="font-semibold text-foreground mb-2">Personal Response</h4>
                  <Textarea 
                    className="w-full h-32 resize-none"
                    placeholder="Write your reflections, commitments, or prayers here..."
                  />
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default FeastLibrary;
