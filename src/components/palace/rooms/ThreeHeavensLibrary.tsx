import React, { useState } from 'react';
import { 
  ChevronRight, ChevronDown, BookOpen, Scroll, Crown, Star, Heart, 
  Globe, TreePine, Scale, Sparkles, Clock, ArrowRight, Layers, Target, 
  Compass, Map, GraduationCap, Lightbulb, CheckCircle, Landmark, Tent, 
  Church, Sunrise, CloudLightning, Check, X, LucideIcon
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
        className="w-full flex items-center gap-2 p-3 bg-muted/50 hover:bg-muted text-left transition-colors"
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
        ? "bg-gradient-to-r from-primary to-primary/80 text-primary-foreground shadow-lg" 
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
                  ? "bg-destructive/20 border-2 border-destructive" 
                  : "bg-muted" 
              : "bg-card border border-border hover:border-primary"
          )}
        >
          <div className="flex items-center gap-2">
            {answered && i === correct && <Check size={16} className="text-green-500" />}
            {answered && i === selected && i !== correct && <X size={16} className="text-destructive" />}
            {opt}
          </div>
        </button>
      ))}
    </div>
    {answered && (
      <div className={cn(
        "mt-3 p-2 rounded text-sm",
        selected === correct ? "bg-green-500/10 text-green-600" : "bg-amber-500/10 text-amber-600"
      )}>
        {selected === correct ? '✓ Correct!' : `Answer: ${options[correct]}`}
      </div>
    )}
  </div>
);

interface Concept {
  name: string;
  text: string;
  examples: string[];
}

interface QuizItem {
  q: string;
  opts: string[];
  correct: number;
}

interface EntryModule {
  id: string;
  title: string;
  icon: LucideIcon;
  concepts: Concept[];
  quiz: QuizItem[];
}

const entryModules: EntryModule[] = [
  {
    id: 'covenant', title: 'The Language of Covenant', icon: Scroll,
    concepts: [
      { name: 'Heaven & Earth as Relational Terms', text: '"Heaven and earth" often refers to God\'s covenant relationship, not the physical cosmos. When covenant is healthy, they unite; when broken, they separate.', examples: ['Isaiah 1:2 — Covenant lawsuit', 'Matt 5:18 — "Till heaven and earth pass"'] },
      { name: 'Creation as Covenant Language', text: 'Creation imagery = covenant beginnings. De-creation imagery = covenant endings. Not about the physical universe.', examples: ['Jer 4:23 — "Without form and void" = Judah\'s judgment', 'Isa 65:17 — "New heavens/earth" = new covenant'] },
      { name: 'Judgment as De-Creation', text: 'When God judges, prophets use un-creation language: sun darkens, stars fall. This signals covenant-world ending, not cosmic destruction.', examples: ['Isa 13:10 — Babylon (fulfilled)', 'Matt 24:29 — Jerusalem (AD 70)'] }
    ],
    quiz: [
      { q: 'When Isaiah says "stars will not give light" (13:10), he primarily describes:', opts: ['Literal astronomy', 'Covenant judgment on Babylon', 'End of universe', 'Solar eclipse'], correct: 1 },
      { q: '"Heaven and earth" in prophecy often represents:', opts: ['Physical universe', 'Covenant relationship', 'Atmosphere', 'Space'], correct: 1 }
    ]
  },
  {
    id: 'layers', title: 'Primary vs. Secondary Fulfillment', icon: Layers,
    concepts: [
      { name: 'Prophecy Works in Layers', text: 'Most prophecies have immediate historical fulfillment AND later expanded fulfillments. First validates; later reveals fuller meaning.', examples: ['Isa 7:14 — Child then + Virgin birth', 'Joel 2 — Locusts + Pentecost + End'] },
      { name: 'Four Levels of Fulfillment', text: 'Historical (what happened) → Christological (Christ fulfilled) → Ecclesial (Church experiences) → Eschatological (final fulfillment)', examples: ['Apply to every major prophecy'] },
      { name: 'Why Prophecy Repeats', text: 'God acts in consistent patterns. What He did to Babylon, He does to all proud empires. History rhymes.', examples: ['Exodus pattern repeats', 'Day of the Lord recurs'] }
    ],
    quiz: [
      { q: 'Isaiah 7:14 had:', opts: ['Only Christ fulfillment', 'Immediate + ultimate fulfillment', 'No historical fulfillment', 'Contradictory meanings'], correct: 1 },
      { q: 'The four fulfillment levels are:', opts: ['Past/Present/Future/Eternal', 'Historical/Christological/Ecclesial/Eschatological', 'Literal/Symbolic/Spiritual/Mystical', 'OT/NT/Church/Millennium'], correct: 1 }
    ]
  },
  {
    id: 'repeat', title: 'Repeat-and-Enlarge Principle', icon: Target,
    concepts: [
      { name: 'Daniel\'s Structure', text: 'Daniel revisits the same timeline multiple times. Each vision adds detail: Dan 2 (statue) → Dan 7 (beasts) → Dan 8 (ram/goat) → Dan 9 (70 weeks) → Dan 10-12 (detail).', examples: ['Same kingdoms, different angles', 'Expanding revelation'] },
      { name: 'Three Lenses', text: 'View every prophecy through: History (what happened?), Theology (what does it teach?), Eschatology (final fulfillment?)', examples: ['Complete understanding needs all three'] }
    ],
    quiz: [
      { q: 'Daniel covers the same timeline repeatedly because:', opts: ['He forgot', 'Each adds new perspective', 'Different periods', 'Scribal error'], correct: 1 },
      { q: 'When Dan 2 shows statue and Dan 7 shows beasts, this is:', opts: ['Contradiction', 'Human vs divine view of same reality', 'Different kingdoms', 'Translation error'], correct: 1 }
    ]
  }
];

interface HeavenPoint {
  t: string;
  c: string;
}

interface HeavenModule {
  num: number;
  title: string;
  icon: LucideIcon;
  points: HeavenPoint[];
  parallels?: [string, string][];
  deCreation?: [string, string][];
  timeline?: { era: string; desc: string; c: string }[];
  insight?: string;
  transfers?: [string, string][];
  courtroom?: { e: string; m: string }[];
  tension?: [string, string][];
  elements?: string[];
  noMore?: string[];
  restoration?: [string, string][];
  progression?: { s: string; h: string; d: string; c: string }[];
  refs?: string[];
}

interface HeavenData {
  title: string;
  subtitle: string;
  color: string;
  icon: LucideIcon;
  timeline: string;
  coreIdea: string;
  modules: HeavenModule[];
}

const firstHeaven: HeavenData = {
  title: 'The First Heaven', subtitle: 'The Covenant World', color: 'from-green-600 to-emerald-600', icon: Globe,
  timeline: 'Creation → Fall → Israel → Exile',
  coreIdea: 'God\'s ordered relationship with creation—heaven and earth united through covenant. This traces earthly covenantal history from Eden to Exile.',
  modules: [
    {
      num: 1, title: 'Eden as the First Heaven', icon: TreePine,
      points: [
        { t: 'Eden as Sacred Space', c: 'Eden was a sanctuary where heaven and earth overlapped. God "walked" there (Gen 3:8)—same word for tabernacle presence.' },
        { t: 'Heaven & Earth United', c: 'No barrier between realms. God\'s presence immediate. His will done "on earth as in heaven." No death, no curse.' },
        { t: 'Fall as Covenant Collapse', c: 'Sin collapsed heaven-earth unity. Access blocked. Death entered. Heaven and earth separated. Humanity exiled.' }
      ],
      parallels: [
        ['God walks in garden', 'God dwells in tabernacle'],
        ['Tree of Life', 'Lampstand (tree-shaped)'],
        ['River flowing out', 'Laver for cleansing'],
        ['Cherubim guarding', 'Cherubim on veil/ark'],
        ['Gold and onyx', 'Gold and precious stones']
      ],
      refs: ['Genesis 1-3', 'Isaiah 51:3', 'Ezekiel 28:13-14']
    },
    {
      num: 2, title: 'Israel as Restored Eden', icon: Tent,
      points: [
        { t: 'Promised Land as Renewed Eden', c: 'God brought Israel into land "flowing with milk and honey"—Eden language. A new garden for God\'s dwelling.' },
        { t: 'Sanctuary as God\'s Dwelling', c: 'Tabernacle/temple was micro-Eden—where heaven and earth touched. Outer Court = world; Holy Place = garden; Most Holy = God\'s presence.' },
        { t: 'Land as Conditional Blessing', c: 'Unlike Eden (given freely), the land was conditional. Obedience = blessing (creation thrives); disobedience = curse (de-creation).' }
      ],
      insight: 'When Israel breaks covenant, creation imagery reverses—land becomes barren, heavens close, order collapses. This is de-creation language.',
      refs: ['Exodus 25-40', 'Leviticus 26', 'Deuteronomy 28']
    },
    {
      num: 3, title: 'The First Day of the Lord', icon: CloudLightning,
      points: [
        { t: 'End of a Covenant World', c: 'Prophets describe Babylon\'s conquest using cosmic de-creation language. Not end of Earth—end of Israel\'s covenant world.' },
        { t: 'De-Creation in Jeremiah 4', c: 'Genesis 1 reversed: "without form and void," "no light," "mountains trembling," "no birds," "fruitful land wilderness."' },
        { t: 'Day of the Lord Pattern', c: 'The "Day of the Lord" repeats whenever God judges covenant-breaking people. Same language, different events throughout history.' }
      ],
      deCreation: [
        ['"Formless and void" (Gen 1:2)', '"Without form and void" (Jer 4:23)'],
        ['"Let there be light"', '"No light" (Jer 4:23)'],
        ['"Mountains established"', '"Mountains trembling" (Jer 4:24)'],
        ['"Let birds fly"', '"No birds" (Jer 4:25)'],
        ['"Fruitful garden"', '"Fruitful land wilderness" (Jer 4:26)']
      ],
      timeline: [
        { era: 'Creation', desc: 'Heaven and earth united in Eden', c: 'bg-green-500/20' },
        { era: 'Fall', desc: 'Heaven and earth separated', c: 'bg-destructive/20' },
        { era: 'Abraham', desc: 'Promise of restoration begins', c: 'bg-amber-500/20' },
        { era: 'Sinai', desc: 'Israel becomes covenant nation', c: 'bg-blue-500/20' },
        { era: 'Temple', desc: 'God\'s presence in Jerusalem', c: 'bg-purple-500/20' },
        { era: 'Exile', desc: 'Covenant world ends', c: 'bg-muted' }
      ],
      refs: ['Jeremiah 4:23-28', 'Isaiah 13', 'Isaiah 24', 'Ezekiel 7']
    }
  ]
};

const secondHeaven: HeavenData = {
  title: 'The Second Heaven', subtitle: 'Covenant Transition & Judgment', color: 'from-blue-600 to-indigo-600', icon: Crown,
  timeline: 'Christ\'s Ascension → Church Age → Heavenly Intercession',
  coreIdea: 'We live in the Second Heaven era—Christ reigns from heaven, the earthly temple ended, we access God through the heavenly sanctuary.',
  modules: [
    {
      num: 4, title: 'The Second Day of the Lord', icon: Landmark,
      points: [
        { t: 'Judgment Shifts to Heavenly Authority', c: 'With Christ\'s ascension, authority transferred from earthly to heavenly Jerusalem. AD 70 ended the old system definitively.' },
        { t: 'Matthew 24 in Context', c: 'Jesus\' Olivet Discourse uses de-creation language. "This generation" (v.34) = AD 70. Cosmic language = covenant judgment pattern.' },
        { t: 'The Great Transfer', c: 'What was earthly is now heavenly: Temple → Heavenly Sanctuary; Priesthood → Christ; Sacrifices → Once-for-all offering.' }
      ],
      transfers: [
        ['Earthly Jerusalem', 'Heavenly Jerusalem'],
        ['Stone Temple', 'Heavenly Sanctuary'],
        ['Levitical Priests', 'Christ as High Priest'],
        ['Animal Sacrifices', 'Christ\'s once-for-all'],
        ['Limited Access', 'Bold access through veil']
      ],
      refs: ['Daniel 7-9', 'Matthew 24', 'Hebrews 8-10']
    },
    {
      num: 5, title: 'The Heavenly Court', icon: Scale,
      points: [
        { t: 'Christ\'s Enthronement', c: 'Jesus ascended to be enthroned as King and begin high priestly ministry. Fulfilled Daniel 7:13-14, Psalm 110:1.' },
        { t: 'Ongoing Intercession', c: 'Christ\'s work continues—He "always lives to make intercession" (Heb 7:25), our "Advocate with the Father" (1 John 2:1).' },
        { t: 'Judgment in Session', c: 'Daniel 7: thrones set, Ancient of Days seated, books opened, Son of Man receives kingdom. This court operates NOW.' }
      ],
      courtroom: [
        { e: 'Thrones Placed', m: 'Judgment authority established' },
        { e: 'Ancient of Days', m: 'God the Father presiding' },
        { e: 'Books Opened', m: 'Records examined' },
        { e: 'Son of Man Approaches', m: 'Christ receives kingdom' },
        { e: 'Saints Vindicated', m: 'God\'s people declared righteous' }
      ],
      refs: ['Daniel 7:9-14', 'Hebrews 7:25', 'Revelation 4-5']
    },
    {
      num: 6, title: 'The New Covenant Order', icon: Church,
      points: [
        { t: 'Seated in Heavenly Places', c: 'We are "seated with Christ in heavenly places" (Eph 2:6). Our citizenship is in heaven NOW. We access the throne of grace.' },
        { t: 'Already/Not Yet Tension', c: 'Kingdom has come / coming in fullness. Satan defeated / to be destroyed. New creation in Christ / new heavens await.' },
        { t: 'Living Between Heavens', c: 'The Church exists in Second Heaven era, accessing Third Heaven realities through Spirit, while First Heaven creation still groans.' }
      ],
      tension: [
        ['Kingdom has come', 'Kingdom coming in fullness'],
        ['Satan defeated', 'Satan to be destroyed'],
        ['New creation in Christ', 'New heavens and earth'],
        ['Eternal life possessed', 'Resurrection of body'],
        ['Seated in heavenlies', 'Bodily with Christ']
      ],
      refs: ['Ephesians 2:4-6', 'Hebrews 12:22-24', 'Colossians 3:1-4']
    }
  ]
};

const thirdHeaven: HeavenData = {
  title: 'The Third Heaven', subtitle: 'Final Restoration', color: 'from-purple-600 to-violet-600', icon: Sparkles,
  timeline: 'Final Judgment → Resurrection → New Creation → Eternity',
  coreIdea: 'Not "escaping earth to heaven" but heaven coming DOWN to earth—God dwelling with humanity in renewed creation eternally.',
  modules: [
    {
      num: 7, title: 'The Final Judgment', icon: Scale,
      points: [
        { t: 'Resurrection of All', c: 'Bodily resurrection precedes judgment. "Many who sleep in dust shall awake" (Dan 12:2)—to life or contempt. Whole persons judged.' },
        { t: 'Books Opened', c: 'Books of deeds + Book of Life. Judgment by works (evidence); salvation by grace (basis). Works evidence faith; faith secures salvation.' },
        { t: 'End of Sin and Death', c: 'Death and Hades cast into lake of fire (Rev 20:14). "Last enemy destroyed is death" (1 Cor 15:26). Sin fully removed.' }
      ],
      elements: ['Resurrection of just and unjust', 'Books of deeds examined', 'Book of Life checked', 'Death itself destroyed', 'Sin removed from universe'],
      refs: ['Daniel 12:1-3', 'Revelation 20:11-15', '1 Corinthians 15:50-58']
    },
    {
      num: 8, title: 'The New Creation', icon: Sunrise,
      points: [
        { t: 'Heaven Comes Down', c: 'New Jerusalem comes DOWN from heaven (Rev 21:2). Not escape from earth but heaven joining earth. God dwells WITH humanity.' },
        { t: 'God Dwells with Humanity', c: '"The dwelling of God is with man" (Rev 21:3). They see His face (Rev 22:4). No temple—God Himself is the temple.' },
        { t: 'Eden Fully Restored', c: 'Tree of Life returns. River of life flows. No more curse. Garden becomes garden-city. Two become multitudes.' }
      ],
      noMore: ['No more sea (chaos removed)', 'No more death', 'No more mourning', 'No more crying', 'No more pain', 'No more night', 'No more curse', 'No more temple'],
      restoration: [
        ['Garden of Eden', 'City of God'],
        ['Tree of Life (lost)', 'Tree of Life (restored)'],
        ['River from Eden', 'River of water of life'],
        ['God walking in garden', 'God dwelling with humanity'],
        ['Two people', 'Countless multitudes'],
        ['Access blocked', 'Gates never shut']
      ],
      refs: ['Revelation 21-22', 'Isaiah 65:17-25', '2 Peter 3:13']
    },
    {
      num: 9, title: 'The Completed Story', icon: BookOpen,
      points: [
        { t: 'One Story, Three Heavens, One God', c: 'From Genesis to Revelation—one story of God pursuing His goal: dwelling with humanity in perfect fellowship.' },
        { t: 'The Thread Through Scripture', c: '"I will be their God, they will be my people" — from Eden (Gen 3:8) through Exodus (25:8) to New Creation (Rev 21:3).' },
        { t: 'The Goal of All History', c: 'Everything moves toward one destination: God and humanity dwelling together in perfect, unending fellowship. The end exceeds the beginning.' }
      ],
      progression: [
        { s: 'Creation', h: '1st', d: 'Heaven/earth united', c: 'green' },
        { s: 'Fall', h: '1st', d: 'Heaven/earth separated', c: 'red' },
        { s: 'Israel', h: '1st', d: 'Partial restoration', c: 'amber' },
        { s: 'Exile', h: '1st', d: 'Covenant world ends', c: 'gray' },
        { s: 'Christ', h: '→', d: 'New covenant inaugurated', c: 'purple' },
        { s: 'Church', h: '2nd', d: 'Access to heavenly realities', c: 'blue' },
        { s: 'Return', h: '→', d: 'Judgment, resurrection', c: 'orange' },
        { s: 'New Creation', h: '3rd', d: 'Heaven/earth reunited forever', c: 'pink' }
      ],
      refs: ['Genesis 1-3', 'Revelation 21-22', 'Ephesians 1:9-10']
    }
  ]
};

export default function ThreeHeavensLibrary() {
  const [tab, setTab] = useState('overview');
  const [entryMod, setEntryMod] = useState<EntryModule>(entryModules[0]);
  const [quizAns, setQuizAns] = useState<Record<string, number>>({});

  const tabs = [
    { id: 'overview', label: 'Overview', icon: BookOpen },
    { id: 'entry', label: 'Entry Hall', icon: GraduationCap },
    { id: 'first', label: '1st Heaven', icon: Globe },
    { id: 'second', label: '2nd Heaven', icon: Crown },
    { id: 'third', label: '3rd Heaven', icon: Sparkles },
    { id: 'journey', label: 'Journey', icon: Compass }
  ];

  const renderHeaven = (data: HeavenData) => {
    const Icon = data.icon;
    return (
      <div>
        <div className={`mb-4 p-5 bg-gradient-to-r ${data.color} rounded-xl text-white`}>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-white/20 rounded-lg"><Icon size={28} /></div>
            <div>
              <h2 className="text-xl font-bold">{data.title}</h2>
              <p className="text-white/80 text-sm">{data.subtitle}</p>
            </div>
          </div>
          <p className="text-white/90 text-sm mb-2">{data.coreIdea}</p>
          <span className="px-2 py-1 bg-white/20 rounded text-xs">{data.timeline}</span>
        </div>
        {data.modules.map((mod, idx) => {
          const ModIcon = mod.icon;
          return (
            <Section key={idx} title={`Module ${mod.num}: ${mod.title}`} icon={ModIcon} defaultOpen={idx === 0}>
              <div className="space-y-4">
                {mod.points.map((p, i) => (
                  <div key={i} className="p-3 bg-muted/50 rounded-lg">
                    <h5 className="font-bold text-foreground mb-1">{p.t}</h5>
                    <p className="text-muted-foreground text-sm">{p.c}</p>
                  </div>
                ))}
                {mod.parallels && (
                  <div className="p-4 bg-emerald-500/10 rounded-lg">
                    <h5 className="font-bold text-emerald-600 mb-2">Eden → Tabernacle Parallels</h5>
                    <div className="space-y-2">
                      {mod.parallels.map((p, j) => (
                        <div key={j} className="grid grid-cols-2 gap-2 text-sm">
                          <div className="p-2 bg-card rounded text-emerald-600">{p[0]}</div>
                          <div className="p-2 bg-card rounded text-amber-600">{p[1]}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                {mod.deCreation && (
                  <div className="p-4 bg-destructive/10 rounded-lg">
                    <h5 className="font-bold text-destructive mb-2">Genesis → Jeremiah De-Creation</h5>
                    <div className="space-y-2">
                      {mod.deCreation.map((d, j) => (
                        <div key={j} className="grid grid-cols-2 gap-2 text-sm">
                          <div className="p-2 bg-green-500/20 rounded text-green-600">{d[0]}</div>
                          <div className="p-2 bg-destructive/20 rounded text-destructive">{d[1]}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                {mod.timeline && (
                  <div className="p-4 bg-muted/30 rounded-lg">
                    <h5 className="font-bold text-foreground mb-2">First Heaven Timeline</h5>
                    <div className="space-y-2">
                      {mod.timeline.map((t, j) => (
                        <div key={j} className={`p-2 rounded text-sm ${t.c}`}>
                          <span className="font-bold">{t.era}:</span> {t.desc}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                {mod.insight && (
                  <div className="p-3 bg-amber-500/10 rounded-lg border-l-4 border-amber-500">
                    <p className="text-amber-700 dark:text-amber-400 text-sm font-medium">{mod.insight}</p>
                  </div>
                )}
                {mod.transfers && (
                  <div className="p-4 bg-blue-500/10 rounded-lg">
                    <h5 className="font-bold text-blue-600 mb-2">The Great Transfer</h5>
                    <div className="space-y-2">
                      {mod.transfers.map((t, j) => (
                        <div key={j} className="flex items-center gap-2 text-sm">
                          <span className="px-2 py-1 bg-amber-500/20 text-amber-600 rounded flex-1 text-center">{t[0]}</span>
                          <ArrowRight size={16} className="text-muted-foreground" />
                          <span className="px-2 py-1 bg-blue-500/20 text-blue-600 rounded flex-1 text-center">{t[1]}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                {mod.courtroom && (
                  <div className="p-4 bg-purple-500/10 rounded-lg">
                    <h5 className="font-bold text-purple-600 mb-2">Daniel 7 Courtroom</h5>
                    <div className="space-y-2">
                      {mod.courtroom.map((c, j) => (
                        <div key={j} className="p-2 bg-card rounded text-sm">
                          <span className="font-semibold text-purple-600">{c.e}:</span>{' '}
                          <span className="text-muted-foreground">{c.m}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                {mod.tension && (
                  <div className="p-4 bg-indigo-500/10 rounded-lg">
                    <h5 className="font-bold text-indigo-600 mb-2">Already / Not Yet</h5>
                    <div className="space-y-2">
                      {mod.tension.map((t, j) => (
                        <div key={j} className="grid grid-cols-2 gap-2 text-xs">
                          <div className="p-2 bg-green-500/20 rounded text-green-600">Already: {t[0]}</div>
                          <div className="p-2 bg-amber-500/20 rounded text-amber-600">Not Yet: {t[1]}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                {mod.elements && (
                  <ul className="space-y-1">
                    {mod.elements.map((e, j) => (
                      <li key={j} className="flex items-start gap-2 text-sm text-muted-foreground">
                        <CheckCircle size={14} className="text-purple-600 mt-1" />{e}
                      </li>
                    ))}
                  </ul>
                )}
                {mod.noMore && (
                  <div className="p-4 bg-purple-500/10 rounded-lg">
                    <h5 className="font-bold text-purple-600 mb-2">What Will Be No More</h5>
                    <div className="grid grid-cols-2 gap-2">
                      {mod.noMore.map((n, j) => (
                        <div key={j} className="flex items-center gap-2 text-sm text-purple-600">
                          <Sparkles size={12} />{n}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                {mod.restoration && (
                  <div className="p-4 bg-gradient-to-r from-green-500/10 to-purple-500/10 rounded-lg">
                    <h5 className="font-bold text-foreground mb-2">Genesis → Revelation</h5>
                    <div className="space-y-2">
                      {mod.restoration.map((r, j) => (
                        <div key={j} className="grid grid-cols-2 gap-2 text-sm">
                          <div className="p-2 bg-green-500/20 rounded text-green-600">{r[0]}</div>
                          <div className="p-2 bg-purple-500/20 rounded text-purple-600">{r[1]}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                {mod.progression && (
                  <div className="p-4 bg-gradient-to-r from-green-500/10 via-blue-500/10 to-purple-500/10 rounded-lg">
                    <h5 className="font-bold text-foreground mb-2">The Complete Story</h5>
                    <div className="space-y-2">
                      {mod.progression.map((p, j) => (
                        <div key={j} className="flex items-center gap-2 text-sm">
                          <span className={cn(
                            "px-2 py-1 rounded font-bold text-white text-xs w-10 text-center",
                            p.c === 'green' && 'bg-green-500',
                            p.c === 'red' && 'bg-red-500',
                            p.c === 'amber' && 'bg-amber-500',
                            p.c === 'gray' && 'bg-gray-500',
                            p.c === 'purple' && 'bg-purple-500',
                            p.c === 'blue' && 'bg-blue-500',
                            p.c === 'orange' && 'bg-orange-500',
                            p.c === 'pink' && 'bg-pink-500'
                          )}>{p.h}</span>
                          <span className="font-semibold text-foreground w-20">{p.s}</span>
                          <span className="text-muted-foreground">{p.d}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                {mod.refs && (
                  <div className="flex flex-wrap gap-2">
                    {mod.refs.map((r, j) => (
                      <span key={j} className="px-2 py-1 bg-primary/10 text-primary rounded text-xs">{r}</span>
                    ))}
                  </div>
                )}
              </div>
            </Section>
          );
        })}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="bg-gradient-to-r from-indigo-900 via-purple-900 to-violet-900 text-white p-5">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 bg-white/20 rounded-lg"><Layers size={28} /></div>
          <div>
            <h1 className="text-xl font-bold">The Three Heavens Library</h1>
            <p className="text-white/80 text-sm">Covenant History • Prophetic Time • Cosmic Redemption</p>
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
              <Section title="What This Library Teaches" icon={BookOpen} defaultOpen={true}>
                <p className="text-muted-foreground mb-4">Understanding Scripture through three covenantal realms—not locations, but modes of God's relationship with creation across time.</p>
                <div className="grid gap-3">
                  <div className="p-4 bg-gradient-to-r from-green-500/10 to-emerald-500/10 rounded-lg border-l-4 border-green-600">
                    <div className="flex items-center gap-2 mb-1"><Globe size={20} className="text-green-600" /><h4 className="font-bold text-green-700 dark:text-green-400">First Heaven</h4></div>
                    <p className="text-muted-foreground text-sm">Earthly covenant history: Eden → Israel → Exile. God's dwelling established and lost.</p>
                  </div>
                  <div className="p-4 bg-gradient-to-r from-blue-500/10 to-indigo-500/10 rounded-lg border-l-4 border-blue-600">
                    <div className="flex items-center gap-2 mb-1"><Crown size={20} className="text-blue-600" /><h4 className="font-bold text-blue-700 dark:text-blue-400">Second Heaven</h4></div>
                    <p className="text-muted-foreground text-sm">Spiritual governance: Christ reigning, interceding, judging. The current era.</p>
                  </div>
                  <div className="p-4 bg-gradient-to-r from-purple-500/10 to-violet-500/10 rounded-lg border-l-4 border-purple-600">
                    <div className="flex items-center gap-2 mb-1"><Sparkles size={20} className="text-purple-600" /><h4 className="font-bold text-purple-700 dark:text-purple-400">Third Heaven</h4></div>
                    <p className="text-muted-foreground text-sm">Final restoration: Resurrection, new creation, God dwelling with humanity forever.</p>
                  </div>
                </div>
              </Section>
              <Section title="Core Principle" icon={Lightbulb}>
                <div className="p-4 bg-amber-500/10 rounded-lg border-l-4 border-amber-500">
                  <p className="text-foreground">"Heaven and earth" in Scripture often refers to God's covenant relationship. When healthy, united; when broken, separated. Redemption reunites them.</p>
                </div>
              </Section>
              <Section title="Learning Progression" icon={GraduationCap}>
                <div className="space-y-2">
                  {[
                    { n: 'Orientation', d: 'Learn prophetic language (Entry Hall)', icon: Compass },
                    { n: 'Exploration', d: 'Study each heaven sequentially', icon: Map },
                    { n: 'Integration', d: 'Compare patterns and connections', icon: Layers },
                    { n: 'Reflection', d: 'Apply to faith and worldview', icon: Heart }
                  ].map((p, i) => {
                    const Icon = p.icon;
                    return (
                      <div key={i} className="flex items-center gap-3 p-3 bg-primary/5 rounded-lg">
                        <div className="w-8 h-8 flex items-center justify-center bg-primary text-primary-foreground rounded-full font-bold text-sm">{i + 1}</div>
                        <Icon size={16} className="text-primary" />
                        <div>
                          <span className="font-semibold text-foreground">{p.n}</span>
                          <span className="text-muted-foreground text-sm ml-2">{p.d}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </Section>
            </div>
          )}
          {tab === 'entry' && (
            <div>
              <div className="mb-4 p-4 bg-gradient-to-r from-amber-500/20 to-yellow-500/20 rounded-lg">
                <h3 className="font-bold text-amber-700 dark:text-amber-400">Entry Hall: How to Read Prophecy</h3>
                <p className="text-muted-foreground text-sm">Learn the language and methods of biblical prophecy before exploring the Three Heavens.</p>
              </div>
              <div className="flex flex-wrap gap-2 mb-4">
                {entryModules.map((m) => {
                  const Icon = m.icon;
                  return (
                    <button 
                      key={m.id} 
                      onClick={() => setEntryMod(m)} 
                      className={cn(
                        "flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors",
                        entryMod.id === m.id 
                          ? "bg-gradient-to-r from-amber-600 to-yellow-600 text-white" 
                          : "bg-muted hover:bg-muted/80"
                      )}
                    >
                      <Icon size={16} />{m.title}
                    </button>
                  );
                })}
              </div>
              {entryMod && (
                <div className="border border-border rounded-xl overflow-hidden">
                  <div className="bg-gradient-to-r from-amber-600 to-yellow-600 text-white p-4">
                    <div className="flex items-center gap-2">
                      {React.createElement(entryMod.icon, { size: 24 })}
                      <h3 className="text-lg font-bold">{entryMod.title}</h3>
                    </div>
                  </div>
                  <div className="p-4 space-y-4">
                    {entryMod.concepts.map((c, i) => (
                      <div key={i} className="p-4 bg-muted/50 rounded-lg">
                        <h4 className="font-bold text-foreground mb-2">{c.name}</h4>
                        <p className="text-muted-foreground text-sm mb-3">{c.text}</p>
                        {c.examples.length > 0 && (
                          <ul className="space-y-1">
                            {c.examples.map((ex, j) => (
                              <li key={j} className="text-sm text-muted-foreground flex items-start gap-2">
                                <ChevronRight size={14} className="mt-1" />{ex}
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>
                    ))}
                    <Section title="Test Your Understanding" icon={Star}>
                      {entryMod.quiz.map((q, i) => (
                        <Quiz 
                          key={i} 
                          question={q.q} 
                          options={q.opts} 
                          correct={q.correct}
                          answered={quizAns[`${entryMod.id}-${i}`] !== undefined}
                          selected={quizAns[`${entryMod.id}-${i}`]}
                          onAnswer={(a) => setQuizAns(prev => ({ ...prev, [`${entryMod.id}-${i}`]: a }))}
                        />
                      ))}
                    </Section>
                  </div>
                </div>
              )}
            </div>
          )}
          {tab === 'first' && renderHeaven(firstHeaven)}
          {tab === 'second' && renderHeaven(secondHeaven)}
          {tab === 'third' && renderHeaven(thirdHeaven)}
          {tab === 'journey' && (
            <div>
              <Section title="The Complete Story: One Narrative" icon={BookOpen} defaultOpen={true}>
                <div className="space-y-3 mb-4">
                  {[
                    { s: 'Creation', h: '1st', d: 'Heaven and earth made and united in Eden', c: 'green' },
                    { s: 'Fall', h: '1st', d: 'Heaven and earth separated by sin; exile begins', c: 'red' },
                    { s: 'Abraham', h: '1st', d: 'Promise of blessing and restoration begins', c: 'amber' },
                    { s: 'Israel', h: '1st', d: 'Partial restoration through sanctuary', c: 'blue' },
                    { s: 'Exile', h: '1st', d: 'Covenant world ends in judgment', c: 'gray' },
                    { s: 'Christ', h: '→', d: 'Heaven invades earth; new covenant inaugurated', c: 'purple' },
                    { s: 'Church', h: '2nd', d: 'Access to heavenly realities now', c: 'cyan' },
                    { s: 'Return', h: '→', d: 'Final judgment and resurrection', c: 'orange' },
                    { s: 'New Creation', h: '3rd', d: 'Heaven and earth reunited forever', c: 'pink' }
                  ].map((item, i) => (
                    <div key={i} className={cn(
                      "p-3 rounded-lg border-l-4",
                      item.c === 'green' && 'bg-green-500/10 border-green-500',
                      item.c === 'red' && 'bg-red-500/10 border-red-500',
                      item.c === 'amber' && 'bg-amber-500/10 border-amber-500',
                      item.c === 'blue' && 'bg-blue-500/10 border-blue-500',
                      item.c === 'gray' && 'bg-muted border-muted-foreground',
                      item.c === 'purple' && 'bg-purple-500/10 border-purple-500',
                      item.c === 'cyan' && 'bg-cyan-500/10 border-cyan-500',
                      item.c === 'orange' && 'bg-orange-500/10 border-orange-500',
                      item.c === 'pink' && 'bg-pink-500/10 border-pink-500'
                    )}>
                      <div className="flex items-center gap-2">
                        <span className={cn(
                          "px-2 py-0.5 rounded text-white text-xs font-bold",
                          item.c === 'green' && 'bg-green-500',
                          item.c === 'red' && 'bg-red-500',
                          item.c === 'amber' && 'bg-amber-500',
                          item.c === 'blue' && 'bg-blue-500',
                          item.c === 'gray' && 'bg-gray-500',
                          item.c === 'purple' && 'bg-purple-500',
                          item.c === 'cyan' && 'bg-cyan-500',
                          item.c === 'orange' && 'bg-orange-500',
                          item.c === 'pink' && 'bg-pink-500'
                        )}>{item.h}</span>
                        <span className="font-bold text-foreground">{item.s}</span>
                      </div>
                      <p className="text-muted-foreground text-sm mt-1">{item.d}</p>
                    </div>
                  ))}
                </div>
              </Section>
              <Section title="The Thread Through Scripture" icon={Scroll}>
                <div className="space-y-2">
                  {[
                    { ref: 'Genesis 3:8', text: 'God walking with humanity in Eden' },
                    { ref: 'Exodus 25:8', text: '"Let them make me a sanctuary that I may dwell among them"' },
                    { ref: 'Ezekiel 37:27', text: '"My dwelling place will be with them"' },
                    { ref: 'John 1:14', text: '"The Word became flesh and tabernacled among us"' },
                    { ref: 'Revelation 21:3', text: '"The dwelling of God is with man"' }
                  ].map((v, i) => (
                    <div key={i} className="p-3 bg-amber-500/10 rounded-lg">
                      <span className="font-bold text-amber-700 dark:text-amber-400">{v.ref}</span>
                      <p className="text-muted-foreground text-sm italic">"{v.text}"</p>
                    </div>
                  ))}
                </div>
              </Section>
              <div className="mt-4 p-4 bg-gradient-to-r from-primary/10 to-purple-500/10 rounded-xl">
                <h4 className="font-bold text-foreground mb-2">The Goal of All History</h4>
                <p className="text-muted-foreground italic">"Behold, the dwelling place of God is with man. He will dwell with them, and they will be his people, and God himself will be with them as their God." — Revelation 21:3</p>
                <p className="text-muted-foreground text-sm mt-3">Everything in Scripture moves toward this destination: God and humanity dwelling together in perfect, unending fellowship. The end exceeds the beginning—garden becomes city; two become multitudes; temporary becomes eternal.</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
