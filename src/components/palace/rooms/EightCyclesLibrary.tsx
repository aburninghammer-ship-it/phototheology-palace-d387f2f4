import React, { useState } from 'react';
import { 
  ChevronRight, ChevronDown, BookOpen, Scroll, Crown, Star, Heart, 
  Globe, TreePine, Scale, Sparkles, Clock, ArrowRight, Layers, Target, 
  Compass, Map, GraduationCap, Lightbulb, CheckCircle, Landmark, Tent, 
  Church, Sunrise, CloudLightning, Check, X, Waves, Building2, 
  FlameKindling, Zap, Users, RefreshCw, LucideIcon
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface SectionProps {
  title: string;
  icon?: LucideIcon;
  children: React.ReactNode;
  defaultOpen?: boolean;
}

const Section = ({ title, icon: Icon, children, defaultOpen = false }: SectionProps) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="border border-border rounded-lg mb-3 overflow-hidden">
      <button 
        onClick={() => setIsOpen(!isOpen)} 
        className="w-full flex items-center gap-2 p-3 bg-muted/50 hover:bg-muted text-left"
      >
        {isOpen ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
        {Icon && <Icon size={18} className="text-muted-foreground" />}
        <span className="font-semibold text-foreground">{title}</span>
      </button>
      {isOpen && <div className="p-4 bg-card">{children}</div>}
    </div>
  );
};

interface TabBtnProps {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}

const TabBtn = ({ active, onClick, children }: TabBtnProps) => (
  <button 
    onClick={onClick} 
    className={cn(
      "px-3 py-2 text-sm font-medium rounded-lg transition-all",
      active 
        ? "bg-primary text-primary-foreground shadow-lg" 
        : "bg-muted text-muted-foreground hover:bg-muted/80"
    )}
  >
    {children}
  </button>
);

interface QuizProps {
  question: string;
  options: string[];
  correct: number;
  onAnswer: (index: number) => void;
  answered: boolean;
  selected?: number;
}

const Quiz = ({ question, options, correct, onAnswer, answered, selected }: QuizProps) => (
  <div className="p-4 bg-muted/50 rounded-lg mb-3">
    <p className="font-medium text-foreground mb-3">{question}</p>
    <div className="space-y-2">
      {options.map((opt, i) => (
        <button 
          key={i} 
          onClick={() => !answered && onAnswer(i)} 
          disabled={answered}
          className={cn(
            "w-full p-3 rounded-lg text-left text-sm transition-all",
            answered 
              ? i === correct 
                ? "bg-green-500/20 border-2 border-green-500" 
                : i === selected 
                  ? "bg-red-500/20 border-2 border-red-500" 
                  : "bg-muted"
              : "bg-card border border-border hover:border-primary"
          )}
        >
          <div className="flex items-center gap-2">
            {answered && i === correct && <Check size={16} className="text-green-500" />}
            {answered && i === selected && i !== correct && <X size={16} className="text-red-500" />}
            {opt}
          </div>
        </button>
      ))}
    </div>
    {answered && (
      <div className={cn(
        "mt-3 p-2 rounded text-sm",
        selected === correct ? "bg-green-500/10 text-green-500" : "bg-amber-500/10 text-amber-500"
      )}>
        {selected === correct ? '✓ Correct!' : `Answer: ${options[correct]}`}
      </div>
    )}
  </div>
);

interface CycleData {
  id: string;
  num: number;
  title: string;
  subtitle: string;
  keyTexts: string;
  theme: string;
  focus: string;
  keyTheme: string;
  icon: LucideIcon;
  color: string;
  patternFlow: { emoji: string; label: string }[];
  coreElements: { title: string; content: string }[];
  symbols: { symbol: string; meaning: string }[];
  typology: { type: string; antitype: string }[];
  theologicalFunction: string;
  eschatologicalTrajectory: string;
  quiz: { q: string; opts: string[]; correct: number }[];
  additionalContent?: React.ReactNode;
}

const cycles: CycleData[] = [
  {
    id: 'adamic',
    num: 1,
    title: 'The Adamic Cycle',
    subtitle: 'Creation → Fall → Promise',
    keyTexts: 'Genesis 1-3',
    theme: 'Loss of Eden and the Birth of Redemption',
    focus: 'Creation',
    keyTheme: 'Innocence Lost',
    icon: TreePine,
    color: 'from-green-600 to-emerald-500',
    patternFlow: [
      { emoji: '✨', label: 'Creation' },
      { emoji: '🌳', label: 'Garden Order' },
      { emoji: '🐍', label: 'Temptation' },
      { emoji: '💔', label: 'Fall' },
      { emoji: '🌅', label: 'Promise' }
    ],
    coreElements: [
      { title: 'Creation as Sacred Order', content: "God establishes heaven and earth in covenant harmony. Everything declared 'very good.'" },
      { title: 'Humanity as Image-Bearer', content: "Adam and Eve created to represent God, rule creation, and dwell in His presence." },
      { title: 'The Fall as Covenant Rupture', content: "Disobedience shatters heaven-earth unity. Death, curse, and exile enter." },
      { title: 'The Protoevangelium (Gen 3:15)', content: "First gospel promise: the Seed of the woman will crush the serpent's head." }
    ],
    symbols: [
      { symbol: 'Tree of Life', meaning: "Access to eternal life in God's presence" },
      { symbol: 'Tree of Knowledge', meaning: 'The boundary of human autonomy' },
      { symbol: 'Garden Sanctuary', meaning: 'Heaven and earth united' },
      { symbol: 'Nakedness & Covering', meaning: "Shame and God's provision" },
      { symbol: 'Serpent & Seed', meaning: 'The cosmic conflict begun' }
    ],
    typology: [
      { type: 'Adam', antitype: 'Christ as "Last Adam" (1 Cor 15:45)' },
      { type: "Eve from Adam's side", antitype: "Church from Christ's wounded side" },
      { type: 'Animal skins', antitype: "Christ's righteousness covering us" },
      { type: 'Exile from Eden', antitype: 'Redemption restores access' }
    ],
    theologicalFunction: "The Adamic cycle introduces the fundamental conflict: God's order vs. human autonomy. It establishes the first promise of redemption and the pattern of exile followed by hope.",
    eschatologicalTrajectory: "Points to New Creation where Tree of Life is restored, curse removed, and God dwells with humanity forever (Rev 22:1-5).",
    quiz: [
      { q: 'The Protoevangelium (first gospel promise) is found in:', opts: ['Genesis 1:1', 'Genesis 3:15', 'Genesis 12:3', 'Exodus 3:14'], correct: 1 },
      { q: 'The Tree of Life symbolizes:', opts: ['Human knowledge', 'Access to eternal life in God\'s presence', 'Agricultural blessing', 'National identity'], correct: 1 }
    ]
  },
  {
    id: 'noahic',
    num: 2,
    title: 'The Noahic Cycle',
    subtitle: 'Judgment, Preservation, and Renewal',
    keyTexts: 'Genesis 6-9',
    theme: 'Global Judgment and Righteous Remnant',
    focus: 'Judgment',
    keyTheme: 'Preservation',
    icon: Waves,
    color: 'from-blue-600 to-cyan-500',
    patternFlow: [
      { emoji: '😈', label: 'Corruption' },
      { emoji: '⚠️', label: 'Warning' },
      { emoji: '🚢', label: 'Ark/Remnant' },
      { emoji: '🌊', label: 'Flood Judgment' },
      { emoji: '🌈', label: 'Covenant Renewal' }
    ],
    coreElements: [
      { title: 'Global Corruption', content: "Violence fills the earth. Every thought of humanity's heart is only evil continually." },
      { title: 'Judgment Through Water', content: 'God cleanses creation through the flood—de-creation and re-creation.' },
      { title: 'Preservation of Remnant', content: 'Noah and family preserved through the ark—salvation through judgment.' },
      { title: 'Covenant of Stability', content: 'Rainbow covenant: God promises never again to destroy earth by flood.' }
    ],
    symbols: [
      { symbol: 'The Ark', meaning: 'Salvation vessel; Christ as refuge' },
      { symbol: 'The Flood', meaning: 'Cleansing judgment; baptism typology' },
      { symbol: 'The Rainbow', meaning: 'Covenant faithfulness; God remembers' },
      { symbol: 'Eight Souls', meaning: 'New beginning; resurrection number' },
      { symbol: 'Dove & Olive Branch', meaning: 'Peace; Spirit; new creation' }
    ],
    typology: [
      { type: 'Ark', antitype: 'Christ/Church as salvation vessel' },
      { type: 'Flood waters', antitype: 'Baptism (1 Peter 3:20-21)' },
      { type: 'Eight saved', antitype: 'New creation/resurrection' },
      { type: "Noah's sacrifice", antitype: "Christ's pleasing offering" }
    ],
    theologicalFunction: "This cycle introduces the principle that judgment does not annihilate God's purpose—it resets it. God preserves a remnant through judgment.",
    eschatologicalTrajectory: "Points to final judgment by fire (2 Peter 3:5-7) and preservation of the righteous. 'As in the days of Noah' (Matt 24:37).",
    quiz: [
      { q: 'The number of people saved on the ark is:', opts: ['6', '7', '8', '12'], correct: 2 },
      { q: 'The flood typologically points to:', opts: ['The Red Sea', 'Baptism', 'The Jordan', 'All of the above'], correct: 3 }
    ]
  },
  {
    id: 'semitic',
    num: 3,
    title: 'The Semitic (Post-Flood) Cycle',
    subtitle: 'Division, Pride, and Dispersion',
    keyTexts: 'Genesis 10-11',
    theme: 'Human Unity Without God',
    focus: 'Dispersion',
    keyTheme: 'Identity',
    icon: Building2,
    color: 'from-amber-600 to-orange-500',
    patternFlow: [
      { emoji: '🌍', label: 'Post-Flood Unity' },
      { emoji: '🏗️', label: 'Tower Building' },
      { emoji: '😤', label: 'Pride/Rebellion' },
      { emoji: '🗣️', label: 'Confused Languages' },
      { emoji: '🌐', label: 'Dispersion' }
    ],
    coreElements: [
      { title: 'Human Unity Without God', content: 'Humanity gathers to make a name for themselves—unity in rebellion.' },
      { title: 'Tower of Babel', content: 'Self-exaltation; reaching heaven by human effort; false worship.' },
      { title: 'Confused Languages', content: 'God intervenes to fracture false unity and prevent consolidated evil.' },
      { title: 'Dispersion of Nations', content: "Table of Nations (Gen 10) shows God's plan for diverse peoples." }
    ],
    symbols: [
      { symbol: 'Tower', meaning: 'Human pride; self-salvation; false worship' },
      { symbol: 'One Language', meaning: 'Unity apart from God' },
      { symbol: 'Confusion', meaning: 'Divine intervention against rebellion' },
      { symbol: 'Dispersion', meaning: 'Both judgment and preservation' },
      { symbol: 'Shinar/Babylon', meaning: 'Origin of false religion' }
    ],
    typology: [
      { type: 'Babel confusion', antitype: 'Pentecost reversal (Acts 2)' },
      { type: 'Scattered nations', antitype: 'Gospel to all nations' },
      { type: 'False unity', antitype: 'True unity in Christ (Eph 2:14)' },
      { type: 'Babylon system', antitype: 'End-time Babylon (Rev 17-18)' }
    ],
    theologicalFunction: "This cycle reveals humanity's tendency to seek unity apart from obedience. God's intervention fractures false unity to preserve redemptive order.",
    eschatologicalTrajectory: "Points to Pentecost (reversal) and end-time Babylon (culmination). True unity comes only in Christ.",
    quiz: [
      { q: 'The Tower of Babel represents:', opts: ['Architectural achievement', 'Human pride and self-salvation', 'Divine worship', 'Agricultural advancement'], correct: 1 },
      { q: 'Pentecost in Acts 2 is a reversal of:', opts: ['The Flood', 'The Exodus', 'Babel', 'The Fall'], correct: 2 }
    ]
  },
  {
    id: 'abrahamic',
    num: 4,
    title: 'The Abrahamic Cycle',
    subtitle: 'Promise, Lineage, and Faith',
    keyTexts: 'Genesis 12-50',
    theme: 'Election and Covenant Faith',
    focus: 'Promise',
    keyTheme: 'Faith',
    icon: Star,
    color: 'from-yellow-600 to-amber-500',
    patternFlow: [
      { emoji: '📢', label: 'Calling' },
      { emoji: '🤝', label: 'Covenant' },
      { emoji: '⏳', label: 'Testing/Waiting' },
      { emoji: '👶', label: 'Promise Fulfilled' },
      { emoji: '🔄', label: 'Pattern Repeated' }
    ],
    coreElements: [
      { title: 'Election and Covenant', content: 'God chooses Abraham and makes unconditional promises: land, seed, blessing.' },
      { title: 'Faith Over Sight', content: 'Abraham believes God against all evidence—counted as righteousness (Gen 15:6).' },
      { title: 'Promise Over Possession', content: 'Abraham never fully possesses the land—lives as a pilgrim by faith.' },
      { title: 'Typology of Christ', content: 'Isaac, Joseph, and the sacrificial system all prefigure Christ.' }
    ],
    symbols: [
      { symbol: 'Stars/Sand', meaning: "Innumerable offspring; faith's reward" },
      { symbol: 'Covenant Cutting', meaning: 'God alone passes through; unconditional' },
      { symbol: 'Mount Moriah', meaning: "Sacrifice; 'God will provide'" },
      { symbol: 'Promised Land', meaning: 'Inheritance; heavenly country' },
      { symbol: 'Sojourning', meaning: 'Pilgrim faith; not yet home' }
    ],
    typology: [
      { type: 'Isaac offered', antitype: 'Christ offered by Father' },
      { type: 'Ram substituted', antitype: 'Christ as substitute' },
      { type: 'Joseph rejected/exalted', antitype: 'Christ rejected then exalted' },
      { type: "Judah's scepter", antitype: 'Christ as King from Judah' }
    ],
    theologicalFunction: "This cycle introduces faith as the mechanism of inheritance, anticipating justification by faith. Promise delayed but never revoked.",
    eschatologicalTrajectory: "Abraham looked for 'a city with foundations' (Heb 11:10). His seed includes all who believe (Gal 3:29). Promises fulfilled in Christ and New Jerusalem.",
    quiz: [
      { q: 'Abraham was counted righteous because of:', opts: ['His sacrifices', 'His obedience to the law', 'His faith (Gen 15:6)', 'His circumcision'], correct: 2 },
      { q: "The 'Seed of Abraham' ultimately refers to:", opts: ['Isaac only', 'The nation of Israel', 'Christ (Gal 3:16)', 'All Jews'], correct: 2 }
    ]
  },
  {
    id: 'mosaic',
    num: 5,
    title: 'The Mosaic Cycle',
    subtitle: 'Law, Sanctuary, and National Identity',
    keyTexts: 'Exodus-Deuteronomy',
    theme: 'Deliverance, Law, and Divine Dwelling',
    focus: 'Law',
    keyTheme: 'Obedience',
    icon: Scroll,
    color: 'from-red-600 to-rose-500',
    patternFlow: [
      { emoji: '⛓️', label: 'Bondage' },
      { emoji: '🩸', label: 'Passover' },
      { emoji: '🌊', label: 'Red Sea' },
      { emoji: '⛰️', label: 'Sinai/Law' },
      { emoji: '⛺', label: 'Tabernacle' }
    ],
    coreElements: [
      { title: 'Deliverance from Bondage', content: 'God brings Israel out of Egypt with mighty hand—redemption before law.' },
      { title: 'Covenant Law', content: 'Sinai covenant establishes Israel as holy nation with moral, civil, ceremonial law.' },
      { title: 'Sanctuary System', content: "Tabernacle allows God to dwell among His people—heaven on earth restored." },
      { title: "God Dwelling Among His People", content: "'Let them make me a sanctuary that I may dwell among them' (Ex 25:8)." }
    ],
    symbols: [
      { symbol: 'Passover Lamb', meaning: 'Christ our Passover (1 Cor 5:7)' },
      { symbol: 'Red Sea', meaning: 'Baptism; separation from old life' },
      { symbol: 'Manna', meaning: 'Christ the Bread of Life' },
      { symbol: 'Tabernacle', meaning: "God's presence; Christ's incarnation" },
      { symbol: 'Sacrificial System', meaning: "Christ's atonement" }
    ],
    typology: [
      { type: 'Moses', antitype: 'Christ as Prophet/Mediator' },
      { type: 'Passover lamb', antitype: 'Christ sacrificed for us' },
      { type: 'Tabernacle', antitype: 'Christ "tabernacled" among us (John 1:14)' },
      { type: 'High Priest', antitype: 'Christ our Great High Priest' }
    ],
    theologicalFunction: "The Mosaic cycle establishes the pattern of sacrifice, priesthood, and sanctuary that Christ would fulfill. Law reveals sin and points to grace.",
    eschatologicalTrajectory: "The sanctuary pattern reveals heaven's reality (Heb 8:5). Christ entered the true sanctuary. New covenant replaces old (Jer 31:31-34).",
    quiz: [
      { q: 'The purpose of the law is to:', opts: ['Provide salvation', 'Reveal sin and point to grace', 'Replace faith', 'Create national pride'], correct: 1 },
      { q: 'The tabernacle represents:', opts: ['Only a tent', "God's presence dwelling with His people", 'Moses\' authority', 'Political power'], correct: 1 }
    ]
  },
  {
    id: 'cyrus-christ',
    num: 6,
    title: 'The Cyrus-Christ Cycle',
    subtitle: 'Restoration, Messiah, and Fulfillment',
    keyTexts: 'Ezra-Malachi; Gospels',
    theme: 'From Type to Antitype',
    focus: 'Redemption',
    keyTheme: 'Restoration',
    icon: Crown,
    color: 'from-purple-600 to-violet-500',
    patternFlow: [
      { emoji: '🔗', label: 'Exile' },
      { emoji: '📜', label: 'Decree' },
      { emoji: '🏛️', label: 'Temple Rebuilt' },
      { emoji: '⏳', label: 'Waiting' },
      { emoji: '👑', label: 'Messiah Comes' }
    ],
    coreElements: [
      { title: 'Restoration from Exile', content: 'Cyrus decrees return (538 BC). Remnant rebuilds temple, walls, community.' },
      { title: 'Temple Rebuilding', content: "Second temple constructed but glory diminished. 'Where is the glory?'" },
      { title: 'Messianic Expectation', content: "Prophets point to coming One: Malachi's messenger, Daniel's Son of Man." },
      { title: 'Type to Fulfillment', content: 'Everything shifts from shadow to substance when Christ arrives.' }
    ],
    symbols: [
      { symbol: 'Cyrus', meaning: "Type of deliverer; 'shepherd,' 'anointed'" },
      { symbol: 'Second Temple', meaning: 'Longing for greater glory' },
      { symbol: '70 Weeks', meaning: "Daniel's timeline to Messiah" },
      { symbol: '400 Silent Years', meaning: "Anticipation; 'Elijah to come'" },
      { symbol: 'Star of Bethlehem', meaning: 'King has come' }
    ],
    typology: [
      { type: 'Cyrus as deliverer', antitype: 'Christ the ultimate Deliverer' },
      { type: 'Second temple', antitype: 'Christ as true Temple (John 2:19-21)' },
      { type: 'Zerubbabel', antitype: 'Christ as Branch' },
      { type: 'Joshua the priest', antitype: 'Christ as High Priest' }
    ],
    theologicalFunction: "This cycle bridges Old and New Testaments. It introduces the shift from physical to spiritual fulfillment. The shadows give way to the Substance.",
    eschatologicalTrajectory: "Christ fulfills all prophecy. Temple no longer a building but Christ Himself, then His people (1 Cor 3:16). New covenant inaugurated.",
    quiz: [
      { q: 'Cyrus is called "anointed" (messiah) by:', opts: ['Daniel', 'Isaiah', 'Ezra', 'Malachi'], correct: 1 },
      { q: 'The 70 weeks prophecy in Daniel points to:', opts: ["Cyrus' decree", 'The Messiah', 'The second temple', 'The exile'], correct: 1 }
    ]
  },
  {
    id: 'post-christ',
    num: 7,
    title: 'The Post-Christ / Ecclesial Cycle',
    subtitle: 'The Church Age and Spiritual Conflict',
    keyTexts: 'Acts-Revelation 13',
    theme: 'Gospel, Persecution, and Apostasy',
    focus: 'Witness',
    keyTheme: 'Conflict',
    icon: Church,
    color: 'from-indigo-600 to-blue-500',
    patternFlow: [
      { emoji: '🔥', label: 'Pentecost' },
      { emoji: '🌍', label: 'Gospel Spread' },
      { emoji: '⚔️', label: 'Persecution' },
      { emoji: '🐺', label: 'Apostasy Rise' },
      { emoji: '⏳', label: 'Endurance' }
    ],
    coreElements: [
      { title: 'Gospel to All Nations', content: 'The Great Commission launched at Pentecost. Church expands despite opposition.' },
      { title: 'Persecution and Perseverance', content: 'Faithful witnesses suffer but overcome by blood of Lamb and word of testimony.' },
      { title: 'Rise of Counterfeit Systems', content: 'Apostasy develops. False teachers, antichrist spirit, Babylon the Great.' },
      { title: 'Spiritual Warfare', content: 'Not against flesh and blood but powers and principalities. Dragon wars against remnant.' }
    ],
    symbols: [
      { symbol: 'Tongues of Fire', meaning: "Spirit's empowerment; Babel reversed" },
      { symbol: 'Seven Churches', meaning: 'Complete Church through history' },
      { symbol: 'Two Witnesses', meaning: 'Faithful testimony through ages' },
      { symbol: 'Dragon & Beasts', meaning: "Satan's counterfeit system" },
      { symbol: 'Babylon', meaning: 'False religious/political system' }
    ],
    typology: [
      { type: 'Pentecost', antitype: 'Firstfruits of Spirit; harvest continues' },
      { type: 'Early church persecution', antitype: 'Pattern for all ages' },
      { type: 'Apostasy in churches', antitype: 'End-time great deception' },
      { type: 'Overcomers in 7 churches', antitype: 'Final remnant who overcome' }
    ],
    theologicalFunction: "This cycle represents the current age—the 'already/not yet' kingdom. Christ reigns; Satan rages; Church witnesses; end approaches.",
    eschatologicalTrajectory: "Ends with final crisis: mark of the beast, Babylon's fall, Christ's return. Faithful remnant sealed and delivered.",
    quiz: [
      { q: 'Pentecost reversed the confusion of:', opts: ['Eden', 'The Flood', 'Babel', 'Egypt'], correct: 2 },
      { q: 'The current cycle we live in is:', opts: ['Cycle 5 - Mosaic', 'Cycle 6 - Cyrus-Christ', 'Cycle 7 - Post-Christ', 'Cycle 8 - Remnant'], correct: 2 }
    ]
  },
  {
    id: 'remnant',
    num: 8,
    title: 'The Remnant Cycle',
    subtitle: 'Final Judgment and Restoration',
    keyTexts: 'Daniel 7-12; Revelation 14-22',
    theme: 'Completion of All Things',
    focus: 'Completion',
    keyTheme: 'New Creation',
    icon: Sparkles,
    color: 'from-pink-600 to-rose-500',
    patternFlow: [
      { emoji: '⚖️', label: 'Judgment' },
      { emoji: '🏛️', label: 'Sanctuary Cleansed' },
      { emoji: '🔀', label: 'Separation' },
      { emoji: '🌅', label: 'Resurrection' },
      { emoji: '🏙️', label: 'New Creation' }
    ],
    coreElements: [
      { title: 'Investigative Judgment', content: 'Books opened in heaven. Cases examined. Who truly belongs to Christ?' },
      { title: 'Cleansing of the Sanctuary', content: 'Daniel 8:14 fulfilled. Sin finally removed. Atonement completed.' },
      { title: 'Final Separation', content: 'Wheat and tares. Sheep and goats. Righteous and wicked permanently divided.' },
      { title: 'New Heaven and New Earth', content: 'Eden restored and expanded. God dwells with humanity forever.' }
    ],
    symbols: [
      { symbol: 'Books Opened', meaning: 'Records examined in judgment' },
      { symbol: '144,000/Great Multitude', meaning: 'Complete number of redeemed' },
      { symbol: 'Three Angels', meaning: 'Final warning messages' },
      { symbol: 'Harvest', meaning: 'Gathering of righteous and wicked' },
      { symbol: 'New Jerusalem', meaning: 'Eternal dwelling; Eden-city' }
    ],
    typology: [
      { type: 'Day of Atonement', antitype: 'Final judgment and cleansing' },
      { type: 'Scapegoat', antitype: 'Satan bears blame; removed' },
      { type: 'Jubilee', antitype: 'Final liberation; all restored' },
      { type: 'Eden', antitype: 'New Creation exceeds original' }
    ],
    theologicalFunction: "This cycle completes the pattern begun in Eden. The serpent is destroyed. Death is ended. God dwells with humanity forever. History reaches its goal.",
    eschatologicalTrajectory: "This IS the eschatology—the final chapter. Everything pointed here. The end exceeds the beginning. The Lamb on the throne. His servants serve Him.",
    quiz: [
      { q: 'The final cycle includes:', opts: ['Only judgment', 'Judgment and new creation', 'Only resurrection', 'Only rapture'], correct: 1 },
      { q: 'In the New Creation:', opts: ['There is no temple', 'There is a new temple building', 'God and the Lamb ARE the temple', 'The temple is in heaven only'], correct: 2 }
    ]
  }
];

const christInCycles = [
  { cycle: 'Adamic', revelation: 'Promised Seed (Gen 3:15)' },
  { cycle: 'Noahic', revelation: 'Ark of Salvation' },
  { cycle: 'Semitic', revelation: 'True Unity-Bringer' },
  { cycle: 'Abrahamic', revelation: 'Seed of Abraham (Gal 3:16)' },
  { cycle: 'Mosaic', revelation: 'Prophet, Priest, Passover Lamb' },
  { cycle: 'Cyrus-Christ', revelation: 'The Messiah Himself arrives!' },
  { cycle: 'Post-Christ', revelation: 'Reigning King, Head of Church' },
  { cycle: 'Remnant', revelation: 'Judge, Bridegroom, Eternal King' }
];

const progressiveRevelation = [
  { cycle: 'Adamic', reveals: 'The problem (sin) and the promise (seed)' },
  { cycle: 'Noahic', reveals: 'Judgment preserves; remnant survives' },
  { cycle: 'Semitic', reveals: 'False unity fails; God will create true unity' },
  { cycle: 'Abrahamic', reveals: 'Faith is the way; promise is certain' },
  { cycle: 'Mosaic', reveals: 'Law reveals sin; sacrifice provides covering' },
  { cycle: 'Cyrus-Christ', reveals: 'The Messiah fulfills all types' },
  { cycle: 'Post-Christ', reveals: 'Spirit empowers; gospel goes global' },
  { cycle: 'Remnant', reveals: 'Judgment completes; Eden restored' }
];

export default function EightCyclesLibrary() {
  const [tab, setTab] = useState('overview');
  const [selectedCycle, setSelectedCycle] = useState<CycleData>(cycles[0]);
  const [quizAns, setQuizAns] = useState<Record<string, number>>({});

  const tabs = [
    { id: 'overview', label: 'Overview', icon: BookOpen },
    { id: 'pattern', label: 'Pattern', icon: RefreshCw },
    { id: 'cycles', label: 'Cycles', icon: Layers },
    { id: 'connections', label: 'Connections', icon: Target },
    { id: 'journey', label: 'Journey', icon: Compass }
  ];

  const renderCycle = (cycle: CycleData) => {
    const Icon = cycle.icon;
    return (
      <div>
        <div className={cn("mb-4 p-5 bg-gradient-to-r rounded-xl text-white", cycle.color)}>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-white/20 rounded-lg"><Icon size={28} /></div>
            <div>
              <h2 className="text-xl font-bold">Cycle {cycle.num}: {cycle.title}</h2>
              <p className="text-white/80 text-sm">{cycle.subtitle}</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2 text-sm mt-3">
            <span className="px-2 py-1 bg-white/20 rounded">Focus: {cycle.focus}</span>
            <span className="px-2 py-1 bg-white/20 rounded">Theme: {cycle.keyTheme}</span>
          </div>
          <p className="text-white/80 text-xs mt-2">Key Texts: {cycle.keyTexts}</p>
        </div>

        <Section title="Pattern Flow" icon={ArrowRight} defaultOpen>
          <div className="flex flex-wrap gap-2 items-center">
            {cycle.patternFlow.map((step, i) => (
              <React.Fragment key={i}>
                <div className="flex items-center gap-1 px-3 py-2 bg-muted rounded-lg">
                  <span className="text-lg">{step.emoji}</span>
                  <span className="text-sm font-medium">{step.label}</span>
                </div>
                {i < cycle.patternFlow.length - 1 && <ArrowRight size={16} className="text-muted-foreground" />}
              </React.Fragment>
            ))}
          </div>
        </Section>

        <Section title="Core Elements" icon={Lightbulb}>
          <div className="space-y-3">
            {cycle.coreElements.map((el, i) => (
              <div key={i} className="p-3 bg-muted/50 rounded-lg">
                <h5 className="font-bold text-foreground mb-1">{el.title}</h5>
                <p className="text-muted-foreground text-sm">{el.content}</p>
              </div>
            ))}
          </div>
        </Section>

        <Section title="Key Symbols" icon={Star}>
          <div className="grid gap-2">
            {cycle.symbols.map((sym, i) => (
              <div key={i} className="flex items-start gap-3 p-2 bg-amber-500/10 rounded-lg">
                <span className="font-semibold text-amber-600 dark:text-amber-400 min-w-[140px]">{sym.symbol}</span>
                <span className="text-muted-foreground text-sm">{sym.meaning}</span>
              </div>
            ))}
          </div>
        </Section>

        <Section title="Type → Antitype" icon={Layers}>
          <div className="space-y-2">
            {cycle.typology.map((t, i) => (
              <div key={i} className="flex items-center gap-2 text-sm">
                <span className="px-2 py-1 bg-muted rounded flex-1 text-center">{t.type}</span>
                <ArrowRight size={16} className="text-muted-foreground" />
                <span className="px-2 py-1 bg-primary/10 text-primary rounded flex-1 text-center">{t.antitype}</span>
              </div>
            ))}
          </div>
        </Section>

        <Section title="Theological Function" icon={BookOpen}>
          <p className="text-muted-foreground">{cycle.theologicalFunction}</p>
        </Section>

        <Section title="Eschatological Trajectory" icon={Compass}>
          <div className="p-3 bg-purple-500/10 rounded-lg border-l-4 border-purple-500">
            <p className="text-foreground">{cycle.eschatologicalTrajectory}</p>
          </div>
        </Section>

        <Section title="Test Your Understanding" icon={GraduationCap}>
          {cycle.quiz.map((q, i) => (
            <Quiz
              key={i}
              question={q.q}
              options={q.opts}
              correct={q.correct}
              answered={quizAns[`${cycle.id}-${i}`] !== undefined}
              selected={quizAns[`${cycle.id}-${i}`]}
              onAnswer={(a) => setQuizAns(prev => ({ ...prev, [`${cycle.id}-${i}`]: a }))}
            />
          ))}
        </Section>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="bg-gradient-to-r from-amber-900 via-orange-900 to-red-900 text-white p-5">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 bg-white/20 rounded-lg"><RefreshCw size={28} /></div>
          <div>
            <h1 className="text-xl font-bold">The Eight Cycles Library</h1>
            <p className="text-white/80 text-sm">A Unified Map of Redemption, Judgment, and Restoration</p>
          </div>
        </div>
      </div>

      <div className="p-4">
        <div className="flex flex-wrap gap-2 mb-4 pb-3 border-b border-border">
          {tabs.map((t) => {
            const Icon = t.icon;
            return (
              <TabBtn key={t.id} active={tab === t.id} onClick={() => setTab(t.id)}>
                <span className="flex items-center gap-1"><Icon size={14} />{t.label}</span>
              </TabBtn>
            );
          })}
        </div>

        <div className="bg-card rounded-xl shadow-sm p-4 border border-border">
          {tab === 'overview' && (
            <div>
              <Section title="What This Library Teaches" icon={BookOpen} defaultOpen>
                <p className="text-muted-foreground mb-4">
                  The Eight Cycles Library teaches how God repeats the same redemptive pattern across history, 
                  progressively revealing His plan of salvation through recurring covenantal structures.
                </p>
                <div className="p-4 bg-primary/10 rounded-lg border-l-4 border-primary mb-4">
                  <p className="text-foreground font-medium">
                    Together, the cycles demonstrate that history is not random but governed by a divine rhythm 
                    that reaches its climax in Christ and consummation in the New Creation.
                  </p>
                </div>
              </Section>

              <Section title="The Universal Pattern" icon={RefreshCw}>
                <p className="text-muted-foreground mb-3">Every cycle follows this same pattern:</p>
                <div className="space-y-2">
                  {[
                    { step: 'Divine Order', desc: 'God establishes covenant relationship', color: 'bg-green-500/20 border-green-500' },
                    { step: 'Human Rebellion', desc: 'Humanity chooses autonomy over obedience', color: 'bg-red-500/20 border-red-500' },
                    { step: 'Judgment/Crisis', desc: 'God responds with corrective judgment', color: 'bg-orange-500/20 border-orange-500' },
                    { step: 'Remnant Preserved', desc: 'Faithful ones protected through judgment', color: 'bg-blue-500/20 border-blue-500' },
                    { step: 'Restoration/Escalation', desc: 'New beginning or advancement toward final goal', color: 'bg-purple-500/20 border-purple-500' }
                  ].map((p, i) => (
                    <div key={i} className={cn("p-3 rounded-lg border-l-4", p.color)}>
                      <span className="font-bold text-foreground">{i + 1}. {p.step}</span>
                      <span className="text-muted-foreground text-sm ml-2">{p.desc}</span>
                    </div>
                  ))}
                </div>
              </Section>

              <Section title="Quick Reference Chart" icon={Map}>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-border">
                        <th className="text-left p-2 text-foreground">Cycle</th>
                        <th className="text-left p-2 text-foreground">Focus</th>
                        <th className="text-left p-2 text-foreground">Key Theme</th>
                      </tr>
                    </thead>
                    <tbody>
                      {cycles.map((c, i) => (
                        <tr key={i} className="border-b border-border/50">
                          <td className="p-2 font-medium text-foreground">{c.num}. {c.title.replace('The ', '').replace(' Cycle', '')}</td>
                          <td className="p-2 text-muted-foreground">{c.focus}</td>
                          <td className="p-2 text-muted-foreground">{c.keyTheme}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </Section>

              <Section title="Five Integrated Lenses" icon={Lightbulb}>
                <div className="space-y-2">
                  {[
                    { lens: 'Historical Narrative', desc: 'What happened in time' },
                    { lens: 'Covenantal Meaning', desc: 'What relationship with God was at stake' },
                    { lens: 'Prophetic Pattern', desc: 'How the cycle prefigures later events' },
                    { lens: 'Typological Echoes', desc: 'How it mirrors Christ and future fulfillment' },
                    { lens: 'Eschatological Trajectory', desc: 'How it points toward final restoration' }
                  ].map((l, i) => (
                    <div key={i} className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg">
                      <div className="w-6 h-6 flex items-center justify-center bg-primary text-primary-foreground rounded-full text-xs font-bold">{i + 1}</div>
                      <div>
                        <span className="font-semibold text-foreground">{l.lens}</span>
                        <span className="text-muted-foreground text-sm ml-2">— {l.desc}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </Section>
            </div>
          )}

          {tab === 'pattern' && (
            <div>
              <Section title="The Universal Cycle Pattern" icon={RefreshCw} defaultOpen>
                <div className="p-4 bg-muted/50 rounded-lg mb-4">
                  <div className="flex flex-wrap items-center justify-center gap-2">
                    {['Divine Order', 'Human Rebellion', 'Judgment/Crisis', 'Remnant Preserved', 'Restoration'].map((step, i) => (
                      <React.Fragment key={i}>
                        <div className="px-3 py-2 bg-card border border-border rounded-lg text-sm font-medium text-center">
                          {step}
                        </div>
                        {i < 4 && <ArrowRight size={16} className="text-muted-foreground" />}
                      </React.Fragment>
                    ))}
                  </div>
                </div>
              </Section>

              <Section title="Why the Pattern Repeats" icon={Lightbulb}>
                <div className="space-y-3">
                  {[
                    { title: 'God is Consistent', desc: 'Same God acts same way across history' },
                    { title: 'Humanity is Consistent', desc: 'Same temptations, same failures' },
                    { title: 'History Has Direction', desc: 'Each cycle advances toward the goal' },
                    { title: 'Types Prepare for Antitype', desc: 'Each teaches lessons pointing to Christ' }
                  ].map((r, i) => (
                    <div key={i} className="p-3 bg-amber-500/10 rounded-lg border-l-4 border-amber-500">
                      <h5 className="font-bold text-foreground">{r.title}</h5>
                      <p className="text-muted-foreground text-sm">{r.desc}</p>
                    </div>
                  ))}
                </div>
              </Section>

              <Section title="The Rhythm of Redemption" icon={Heart}>
                <p className="text-muted-foreground mb-4">
                  Each cycle is not mere repetition but escalation. Like a spiral staircase, each turn brings us 
                  higher while covering similar ground. The pattern builds toward the ultimate fulfillment in Christ 
                  and the final restoration in the New Creation.
                </p>
                <div className="p-4 bg-primary/10 rounded-lg">
                  <p className="text-foreground italic">
                    "What has been is what will be, and what has been done is what will be done, 
                    and there is nothing new under the sun." — Ecclesiastes 1:9
                  </p>
                </div>
              </Section>
            </div>
          )}

          {tab === 'cycles' && (
            <div>
              <div className="mb-4 p-4 bg-gradient-to-r from-amber-500/20 to-orange-500/20 rounded-lg">
                <h3 className="font-bold text-foreground">Select a Cycle to Study</h3>
                <p className="text-muted-foreground text-sm">Each cycle reveals a unique phase in God's redemptive plan.</p>
              </div>

              <div className="flex flex-wrap gap-2 mb-4">
                {cycles.map((c) => {
                  const Icon = c.icon;
                  return (
                    <button
                      key={c.id}
                      onClick={() => setSelectedCycle(c)}
                      className={cn(
                        "flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-all",
                        selectedCycle.id === c.id
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted hover:bg-muted/80 text-foreground"
                      )}
                    >
                      <Icon size={16} />
                      <span>{c.num}</span>
                    </button>
                  );
                })}
              </div>

              {renderCycle(selectedCycle)}
            </div>
          )}

          {tab === 'connections' && (
            <div>
              <Section title="How the Cycles Connect" icon={Target} defaultOpen>
                <div className="space-y-2">
                  {[
                    { from: 'Adamic → Noahic', desc: "The promise of Gen 3:15 survives the flood through Noah's line" },
                    { from: 'Noahic → Semitic', desc: 'Post-flood humanity rebels again at Babel' },
                    { from: 'Semitic → Abrahamic', desc: "God calls Abraham out of Babel's world" },
                    { from: 'Abrahamic → Mosaic', desc: "Abraham's descendants become nation at Sinai" },
                    { from: 'Mosaic → Cyrus-Christ', desc: 'Exile and return set stage for Messiah' },
                    { from: 'Cyrus-Christ → Post-Christ', desc: 'Christ inaugurates; Church continues' },
                    { from: 'Post-Christ → Remnant', desc: 'Church age ends with final judgment and restoration' }
                  ].map((conn, i) => (
                    <div key={i} className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg">
                      <ArrowRight size={16} className="mt-1 text-primary" />
                      <div>
                        <span className="font-semibold text-foreground">{conn.from}</span>
                        <p className="text-muted-foreground text-sm">{conn.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </Section>

              <Section title="Progressive Revelation" icon={Lightbulb}>
                <p className="text-muted-foreground mb-3">What each cycle reveals:</p>
                <div className="space-y-2">
                  {progressiveRevelation.map((pr, i) => (
                    <div key={i} className="flex items-center gap-3 p-2 bg-blue-500/10 rounded-lg">
                      <span className="font-semibold text-blue-600 dark:text-blue-400 min-w-[100px]">{pr.cycle}</span>
                      <span className="text-muted-foreground text-sm">{pr.reveals}</span>
                    </div>
                  ))}
                </div>
              </Section>

              <Section title="Christ in Every Cycle" icon={Crown}>
                <p className="text-muted-foreground mb-3">How Jesus appears in all 8 cycles:</p>
                <div className="grid gap-2">
                  {christInCycles.map((c, i) => (
                    <div key={i} className="flex items-center gap-3 p-3 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-lg">
                      <span className="w-6 h-6 flex items-center justify-center bg-primary text-primary-foreground rounded-full text-xs font-bold">{i + 1}</span>
                      <span className="font-semibold text-foreground min-w-[100px]">{c.cycle}</span>
                      <span className="text-muted-foreground text-sm">{c.revelation}</span>
                    </div>
                  ))}
                </div>
              </Section>
            </div>
          )}

          {tab === 'journey' && (
            <div>
              <Section title="The Complete Story: One Narrative" icon={BookOpen} defaultOpen>
                <div className="space-y-2 mb-4">
                  {cycles.map((c, i) => {
                    const Icon = c.icon;
                    return (
                      <div key={i} className={cn("p-3 rounded-lg border-l-4", `bg-gradient-to-r ${c.color.replace('from-', 'from-').replace('to-', 'to-')}/10 border-current`)}>
                        <div className="flex items-center gap-2">
                          <Icon size={16} className="text-foreground" />
                          <span className="font-bold text-foreground">Cycle {c.num}: {c.title.replace('The ', '').replace(' Cycle', '')}</span>
                        </div>
                        <p className="text-muted-foreground text-sm mt-1">{c.theme}</p>
                      </div>
                    );
                  })}
                </div>
              </Section>

              <Section title="Your Place in the Story" icon={Compass}>
                <div className="p-4 bg-indigo-500/20 rounded-lg border-l-4 border-indigo-500 mb-4">
                  <h4 className="font-bold text-foreground mb-2">You are living in Cycle 7: The Post-Christ Cycle</h4>
                  <p className="text-muted-foreground text-sm">The Church Age of spiritual conflict and witness.</p>
                </div>
                <p className="text-muted-foreground mb-3">This means:</p>
                <ul className="space-y-2">
                  {[
                    'Christ has come and accomplished redemption',
                    'The Spirit has been poured out',
                    'The gospel is going to all nations',
                    'Spiritual conflict intensifies',
                    'The final cycle approaches'
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-foreground">
                      <CheckCircle size={16} className="text-green-500 mt-0.5" />
                      {item}
                    </li>
                  ))}
                </ul>
              </Section>

              <Section title="What the Eight Cycles Reveal" icon={Lightbulb}>
                <div className="space-y-3">
                  {[
                    { title: 'How God Responds to Rebellion', desc: 'Not with abandonment but with judgment that preserves and restores' },
                    { title: 'How He Restores Relationship', desc: 'Through promise, covenant, sacrifice, and ultimately Christ' },
                    { title: 'How He Moves History Toward Redemption', desc: 'Each cycle advances the plan until completion in New Creation' }
                  ].map((r, i) => (
                    <div key={i} className="p-4 bg-muted/50 rounded-lg">
                      <h5 className="font-bold text-foreground mb-1">{r.title}</h5>
                      <p className="text-muted-foreground text-sm">{r.desc}</p>
                    </div>
                  ))}
                </div>
              </Section>

              <div className="mt-4 p-4 bg-gradient-to-r from-primary/20 to-purple-500/20 rounded-xl">
                <h4 className="font-bold text-foreground mb-2">The End of the Story</h4>
                <p className="text-foreground italic mb-3">
                  "Behold, the dwelling place of God is with man. He will dwell with them, and they will be his people, 
                  and God himself will be with them as their God." — Revelation 21:3
                </p>
                <p className="text-muted-foreground text-sm">
                  The eight cycles form a single prophetic arc, beginning with Eden lost and ending with Eden restored—and more. 
                  The end exceeds the beginning. God's purpose, revealed progressively through each cycle, reaches its glorious completion.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
