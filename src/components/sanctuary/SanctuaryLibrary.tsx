import React, { useState } from 'react';
import { 
  Book, ChevronRight, ChevronDown, Scroll, Heart, Sun, 
  Square, Layers, Crown, Sparkles, BookOpen, Users, Eye, 
  Flame, Shield, Star, Cross, Droplets, Wheat, Home, Scale,
  Lamp, CircleDot, Wind
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';

// Sanctuary Data
const sanctuaryData = {
  overview: {
    description: 'The earthly sanctuary was a "shadow of heavenly things" (Hebrews 8:5)—a three-dimensional parable revealing the entire plan of salvation. Every board, color, fabric, and piece of furniture pointed to Christ and His work of redemption.',
    keyTexts: ['Exodus 25:8-9', 'Hebrews 8:1-5', 'Hebrews 9:1-12', 'Psalm 77:13'],
    purpose: [
      { text: '"Let them make me a sanctuary; that I may dwell among them" (Ex 25:8)', meaning: 'God desires intimate fellowship with humanity' },
      { text: '"Thy way, O God, is in the sanctuary" (Ps 77:13)', meaning: 'The sanctuary reveals God\'s method of salvation' },
      { text: '"A shadow of good things to come" (Heb 10:1)', meaning: 'Every element foreshadowed Christ\'s redemptive work' }
    ]
  },
  structure: [
    {
      id: 'courtyard',
      name: 'The Courtyard',
      hebrew: 'Chatser',
      dimensions: '100 cubits × 50 cubits (150ft × 75ft)',
      description: 'The outer court, visible to all Israel, represented the earthly ministry of Christ and the beginning of salvation.',
      spiritualMeaning: 'Justification — Where sinners first meet God through sacrifice',
      access: 'All Israelites could enter',
      color: 'from-amber-700 to-yellow-600',
      icon: Square
    },
    {
      id: 'holy-place',
      name: 'The Holy Place',
      hebrew: 'Qodesh',
      dimensions: '20 cubits × 10 cubits (30ft × 15ft)',
      description: 'The first apartment of the tabernacle, where priests ministered daily with light, bread, and incense.',
      spiritualMeaning: 'Sanctification — Daily growth in grace through Christ\'s intercession',
      access: 'Priests only',
      color: 'from-blue-800 to-indigo-700',
      icon: Layers
    },
    {
      id: 'most-holy',
      name: 'The Most Holy Place',
      hebrew: 'Qodesh HaQodashim',
      dimensions: '10 cubits × 10 cubits × 10 cubits (Perfect cube)',
      description: 'The innermost sanctuary where God\'s presence dwelt above the mercy seat, entered only once yearly.',
      spiritualMeaning: 'Glorification — Final judgment, complete atonement, dwelling with God',
      access: 'High Priest only, once per year',
      color: 'from-purple-900 to-violet-800',
      icon: Crown
    }
  ],
  furniture: [
    {
      id: 'altar',
      name: 'Altar of Burnt Offering',
      hebrew: 'Mizbeach HaOlah',
      location: 'Courtyard (entrance)',
      materials: 'Acacia wood overlaid with bronze',
      dimensions: '5 cubits × 5 cubits × 3 cubits',
      description: 'The first item encountered upon entering the courtyard. Here sacrificial animals were burned, their blood poured out for sin.',
      christType: 'The Cross of Calvary',
      christConnection: [
        'We must begin at the cross',
        'There is no other way into God\'s presence except through the sacrifice of Christ',
        'The altar was unavoidable—it stood directly in the path'
      ],
      spiritualLesson: 'We must begin at the cross. There is no other way into God\'s presence except through the sacrifice of Christ. The altar was unavoidable—it stood directly in the path.',
      keyVerses: ['Leviticus 1:3-9', 'Hebrews 9:22', 'Ephesians 5:2', 'John 1:29'],
      icon: Flame,
      color: 'from-red-700 to-orange-600'
    },
    {
      id: 'laver',
      name: 'The Laver',
      hebrew: 'Kiyyor',
      location: 'Courtyard (between altar and tabernacle)',
      materials: 'Bronze (made from women\'s mirrors)',
      dimensions: 'Not specified (suggesting unlimited cleansing)',
      description: 'A bronze basin where priests washed their hands and feet before ministering. Made from mirrors, reflecting the one who approached.',
      christType: 'The Word of God / Baptism / Sanctification',
      christConnection: [
        'Continuous cleansing through His Word',
        'No dimensions given—God\'s cleansing is limitless',
        'The mirrors remind us the Word reveals our true condition'
      ],
      spiritualLesson: 'After accepting Christ\'s sacrifice, we need continuous cleansing through His Word. The laver had no dimensions given—God\'s cleansing is limitless. The mirrors remind us the Word reveals our true condition.',
      keyVerses: ['Exodus 30:17-21', 'Ephesians 5:26', 'John 15:3', 'Psalm 119:9'],
      icon: Droplets,
      color: 'from-cyan-600 to-blue-700'
    },
    {
      id: 'lampstand',
      name: 'The Golden Lampstand',
      hebrew: 'Menorah',
      location: 'Holy Place (south side)',
      materials: 'Pure gold (one talent, ~75 lbs), beaten work',
      dimensions: 'Seven branches, almond blossom design',
      description: 'The only source of light in the Holy Place. Seven branches with almond-shaped cups, burning pure olive oil continually.',
      christType: 'Christ the Light of the World / Holy Spirit / Church',
      christConnection: [
        '"I am the light of the world" (John 8:12)',
        'Seven Spirits of God (Rev 4:5)—fullness of Holy Spirit',
        'Church as light bearers (Matt 5:14; Rev 1:20)',
        'Beaten gold—Christ suffered to become our light',
        'Almond blossoms—resurrection life (Aaron\'s rod)'
      ],
      spiritualLesson: 'Without Christ\'s light, we walk in darkness. The lampstand was beaten into shape (suffering), fed by oil (Spirit), and required daily tending (discipline). We must be filled with the Spirit to shine.',
      keyVerses: ['Exodus 25:31-40', 'John 8:12', 'Revelation 1:20', 'Matthew 5:14-16'],
      icon: Lamp,
      color: 'from-yellow-500 to-amber-600'
    },
    {
      id: 'showbread',
      name: 'Table of Showbread',
      hebrew: 'Shulchan Lechem HaPanim',
      location: 'Holy Place (north side)',
      materials: 'Acacia wood overlaid with gold',
      dimensions: '2 cubits × 1 cubit × 1.5 cubits',
      description: 'Twelve loaves of bread arranged in two rows, replaced every Sabbath. Also called "Bread of the Presence."',
      christType: 'Christ the Bread of Life / Word of God / Communion',
      christConnection: [
        '"I am the bread of life" (John 6:35)',
        'Twelve loaves for twelve tribes—Christ for all God\'s people',
        'Bread replaced on Sabbath—Christ is our true Sabbath rest',
        '"Man shall not live by bread alone" (Matt 4:4)',
        'Frankincense on bread—sweet savor of Christ\'s life'
      ],
      spiritualLesson: 'We need daily spiritual nourishment. The bread was always present ("bread of presence")—Christ is always available. We feast on Him through His Word and remember Him in communion.',
      keyVerses: ['Exodus 25:23-30', 'Leviticus 24:5-9', 'John 6:35, 48-51', '1 Corinthians 11:24'],
      icon: Wheat,
      color: 'from-amber-600 to-yellow-700'
    },
    {
      id: 'incense',
      name: 'Altar of Incense',
      hebrew: 'Mizbeach HaKetoret',
      location: 'Holy Place (before the veil)',
      materials: 'Acacia wood overlaid with gold',
      dimensions: '1 cubit × 1 cubit × 2 cubits (tallest in Holy Place)',
      description: 'A golden altar where special incense burned continually, its fragrance filling the sanctuary and rising toward the Most Holy Place.',
      christType: 'Christ\'s Intercession / Prayer / Worship',
      christConnection: [
        'Christ "ever lives to make intercession" (Heb 7:25)',
        '"Golden vials full of incense, which are the prayers of saints" (Rev 5:8)',
        'Incense offered morning and evening—perpetual intercession',
        'Special formula—prayer must be according to God\'s will',
        'Positioned nearest the veil—intercession brings us closest to God'
      ],
      spiritualLesson: 'Prayer rises like incense to God. Christ\'s intercession is continuous and fragrant to the Father. The altar was the tallest piece in the Holy Place—prayer elevates us. Strange fire (unauthorized worship) was deadly.',
      keyVerses: ['Exodus 30:1-10', 'Psalm 141:2', 'Hebrews 7:25', 'Revelation 8:3-4'],
      icon: Wind,
      color: 'from-purple-600 to-pink-600'
    },
    {
      id: 'veil',
      name: 'The Veil',
      hebrew: 'Parochet',
      location: 'Between Holy Place and Most Holy Place',
      materials: 'Blue, purple, scarlet yarn; fine linen with cherubim',
      dimensions: 'Thick curtain separating the apartments',
      description: 'A heavy, ornate curtain embroidered with cherubim, barring access to God\'s immediate presence.',
      christType: 'Christ\'s Flesh / Separation of Sin / Access Opened',
      christConnection: [
        '"The veil, that is to say, his flesh" (Heb 10:20)',
        'Veil torn at crucifixion (Matt 27:51)—access opened!',
        'Cherubim guarded Eden; now access restored',
        'Colors: blue (heaven), purple (royalty), scarlet (sacrifice)',
        'Torn top to bottom—God opened the way, not man'
      ],
      spiritualLesson: 'Sin separates us from God. But through Christ\'s broken body, the way is opened. We now have "boldness to enter the holiest by the blood of Jesus" (Heb 10:19).',
      keyVerses: ['Exodus 26:31-33', 'Matthew 27:51', 'Hebrews 10:19-20', 'Hebrews 6:19'],
      icon: Layers,
      color: 'from-indigo-700 to-purple-800'
    },
    {
      id: 'ark',
      name: 'Ark of the Covenant',
      hebrew: '\'Aron HaBerit',
      location: 'Most Holy Place',
      materials: 'Acacia wood overlaid with gold inside and out',
      dimensions: '2.5 cubits × 1.5 cubits × 1.5 cubits',
      description: 'The most sacred object, containing the tablets of the law, Aaron\'s rod, and a pot of manna. God\'s presence dwelt above it.',
      christType: 'Christ: Divine and Human / God\'s Presence / Throne of Grace',
      christConnection: [
        'Gold within and without (wood between)—Christ\'s divine-human nature',
        'Law in His heart (Ps 40:8)—Christ kept the law perfectly',
        'Aaron\'s rod—resurrection life',
        'Hidden manna—Christ, bread from heaven',
        'God\'s throne—where mercy and justice meet'
      ],
      spiritualLesson: 'The ark represents Christ who fulfilled the law, rose from death, and provides eternal sustenance. In Him, God\'s presence dwells with humanity. The ark was the goal—fellowship with God.',
      keyVerses: ['Exodus 25:10-22', 'Hebrews 9:4', 'Psalm 40:8', 'Romans 3:25'],
      icon: Square,
      color: 'from-yellow-600 to-amber-600'
    },
    {
      id: 'mercy-seat',
      name: 'The Mercy Seat',
      hebrew: 'Kapporet',
      location: 'On top of the Ark',
      materials: 'Pure gold, beaten work',
      dimensions: 'Same as ark lid, with two cherubim',
      description: 'The golden lid of the ark with two cherubim facing each other, wings overshadowing. Here blood was sprinkled on Day of Atonement.',
      christType: 'Christ Our Propitiation / Throne of Grace / Meeting Place',
      christConnection: [
        '"Propitiation" (Rom 3:25) is Greek "hilasterion"—mercy seat',
        'Blood sprinkled here satisfied justice—mercy triumphs',
        'Cherubim gaze at blood—angels study salvation (1 Pet 1:12)',
        '"There I will meet with you" (Ex 25:22)—communion restored',
        'Law beneath, blood above—grace covers judgment'
      ],
      spiritualLesson: 'The mercy seat is where God meets sinful humanity. The law demanded death; the blood provided life. This is the gospel: God\'s justice satisfied, His mercy extended. We come boldly to this throne of grace.',
      keyVerses: ['Exodus 25:17-22', 'Romans 3:25', 'Hebrews 4:16', 'Leviticus 16:14-15'],
      icon: Crown,
      color: 'from-amber-500 to-yellow-400'
    }
  ],
  materials: [
    { name: 'Gold', meaning: 'Divinity, divine nature, faith tested by fire, purity', usage: 'Most Holy Place items, overlay of sacred furniture', icon: '✨' },
    { name: 'Silver', meaning: 'Redemption (atonement money was silver)', usage: 'Socket foundations, hooks, connecting rods', icon: '🪙' },
    { name: 'Bronze/Brass', meaning: 'Judgment, strength, endurance under fire', usage: 'Altar, laver, outer court items', icon: '🔶' },
    { name: 'Acacia Wood', meaning: 'Humanity, incorruptibility (Christ\'s sinless humanity)', usage: 'Core of furniture, boards of tabernacle', icon: '🪵' },
    { name: 'Blue', meaning: 'Heaven, heavenly origin, divinity, law of God', usage: 'Veil, curtains, priestly garments', icon: '🔵' },
    { name: 'Purple', meaning: 'Royalty, kingship, wealth, blending of heaven and earth', usage: 'Veil, curtains, priestly garments', icon: '🟣' },
    { name: 'Scarlet', meaning: 'Sacrifice, blood, suffering, sin', usage: 'Veil, curtains, priestly garments', icon: '🔴' },
    { name: 'White Linen', meaning: 'Righteousness, purity, holiness of saints', usage: 'Curtains, priestly garments', icon: '⬜' },
    { name: 'Oil', meaning: 'Holy Spirit, anointing, consecration', usage: 'Lampstand fuel, anointing', icon: '🫒' },
    { name: 'Frankincense', meaning: 'Prayer, worship, sweet savor of Christ', usage: 'Incense, showbread', icon: '💨' }
  ],
  priesthood: {
    highPriest: {
      title: 'The High Priest',
      hebrew: 'Kohen Gadol',
      type: 'Christ our Great High Priest',
      description: 'The high priest alone could enter the Most Holy Place, and only once per year with blood. He wore special garments and bore Israel\'s names on his shoulders and heart.',
      garments: [
        { name: 'Ephod', description: 'Gold, blue, purple, scarlet apron with shoulder stones bearing tribal names', meaning: 'Christ bears us on His shoulders (strength)' },
        { name: 'Breastplate', description: 'Twelve stones for twelve tribes over the heart', meaning: 'Christ bears us on His heart (love)' },
        { name: 'Robe', description: 'Blue robe with bells and pomegranates', meaning: 'Heavenly character; fruit and testimony' },
        { name: 'Mitre/Turban', description: 'Linen turban with gold plate: "HOLINESS TO THE LORD"', meaning: 'Christ\'s perfect holiness imputed to us' },
        { name: 'Urim & Thummim', description: '"Lights and Perfections" for divine guidance', meaning: 'Christ is our perfect guide and revealer of truth' }
      ],
      christFulfillment: [
        'Christ is "a great high priest, that is passed into the heavens" (Heb 4:14)',
        'He "ever liveth to make intercession" (Heb 7:25)',
        'He offered "himself without spot to God" (Heb 9:14)',
        'He entered "once into the holy place" with His own blood (Heb 9:12)',
        '"We have such an high priest, who is set on the right hand of the throne" (Heb 8:1)'
      ]
    },
    priests: {
      title: 'The Priests',
      hebrew: 'Kohanim',
      type: 'Believers as a royal priesthood',
      description: 'The sons of Aaron served in the sanctuary daily, offering sacrifices, tending the lampstand, replacing showbread, and burning incense.',
      duties: [
        'Offering sacrifices (worship)',
        'Tending the lampstand (maintaining spiritual light)',
        'Replacing showbread (feeding on God\'s Word)',
        'Burning incense (prayer and intercession)',
        'Teaching the people (ministry of the Word)'
      ],
      believerApplication: [
        '"Ye are a chosen generation, a royal priesthood" (1 Pet 2:9)',
        'We offer "spiritual sacrifices, acceptable to God" (1 Pet 2:5)',
        'We have "boldness to enter into the holiest by the blood of Jesus" (Heb 10:19)',
        'We are called to "draw near" (Heb 10:22)',
        'We minister as priests in prayer, worship, and service'
      ]
    }
  },
  sacrifices: [
    {
      name: 'Burnt Offering',
      hebrew: 'Olah',
      reference: 'Leviticus 1',
      animal: 'Bull, sheep, goat, or bird (according to ability)',
      description: 'Completely consumed on the altar; "a sweet savour unto the LORD"',
      meaning: 'Total consecration; Christ\'s complete dedication to God\'s will',
      application: 'Present your body as "a living sacrifice" (Rom 12:1)'
    },
    {
      name: 'Grain/Meal Offering',
      hebrew: 'Minchah',
      reference: 'Leviticus 2',
      animal: 'No animal—fine flour, oil, frankincense (no leaven or honey)',
      description: 'Offering of the fruit of one\'s labor; portion burned, rest eaten by priests',
      meaning: 'Christ\'s perfect humanity; sinless life offered to God',
      application: 'Offer the work of your hands to God\'s service'
    },
    {
      name: 'Peace Offering',
      hebrew: 'Shelamim',
      reference: 'Leviticus 3',
      animal: 'Male or female from herd or flock',
      description: 'Shared meal—God, priest, and offerer all partook',
      meaning: 'Fellowship restored; peace with God through Christ',
      application: 'Enjoy communion with God; He invites you to His table'
    },
    {
      name: 'Sin Offering',
      hebrew: 'Chatta\'t',
      reference: 'Leviticus 4',
      animal: 'Varied by status: bull (priest), goat (leader), female goat/lamb (common)',
      description: 'For unintentional sins; blood applied to specific locations',
      meaning: 'Christ "made sin for us" (2 Cor 5:21); bearing our guilt',
      application: 'Confess sins; receive forgiveness through Christ\'s blood'
    },
    {
      name: 'Trespass/Guilt Offering',
      hebrew: 'Asham',
      reference: 'Leviticus 5-6',
      animal: 'Ram, plus restitution (principal + 20%)',
      description: 'For sins against God or neighbor requiring restitution',
      meaning: 'Christ paid more than we owed; full satisfaction plus more',
      application: 'Make wrongs right; Christ restores more than sin destroyed'
    }
  ],
  journey: [
    { location: 'Gate', experience: 'Hearing the gospel call', truth: '"I am the door" (John 10:9)', stage: 'Conviction' },
    { location: 'Altar of Burnt Offering', experience: 'Accepting Christ\'s sacrifice', truth: 'Justification by faith', stage: 'Conversion' },
    { location: 'Laver', experience: 'Baptism and cleansing by the Word', truth: 'Regeneration and renewal', stage: 'Cleansing' },
    { location: 'Holy Place', experience: 'Daily walk with Christ', truth: 'Sanctification', stage: 'Growth' },
    { location: 'Lampstand', experience: 'Walking in the Spirit\'s light', truth: 'Illumination', stage: 'Understanding' },
    { location: 'Table of Showbread', experience: 'Feeding on Christ through the Word', truth: 'Nourishment', stage: 'Strength' },
    { location: 'Altar of Incense', experience: 'Communion through prayer', truth: 'Intercession', stage: 'Intimacy' },
    { location: 'Most Holy Place', experience: 'Full presence of God', truth: 'Glorification', stage: 'Completion' }
  ],
  heavenlySanctuary: {
    description: 'The earthly tabernacle was a "copy and shadow of the heavenly things" (Heb 8:5). A real sanctuary exists in heaven where Christ ministers.',
    evidence: [
      { text: 'Hebrews 8:1-2', content: 'Christ ministers in "the true tabernacle, which the Lord pitched, and not man"' },
      { text: 'Hebrews 9:11-12', content: 'Christ entered "a greater and more perfect tabernacle, not made with hands"' },
      { text: 'Hebrews 9:24', content: 'Christ entered "heaven itself, now to appear in the presence of God for us"' },
      { text: 'Revelation 11:19', content: '"The temple of God was opened in heaven, and there was seen... the ark"' },
      { text: 'Revelation 8:3', content: 'Angel with golden censer at "the altar before the throne"' }
    ],
    currentMinistry: [
      'Christ intercedes for His people (Heb 7:25; Rom 8:34)',
      'He cleanses us from all sin (1 John 1:9)',
      'He provides grace and help in time of need (Heb 4:16)',
      'He is preparing a place for us (John 14:2-3)',
      'He will complete the judgment and return (Heb 9:28)'
    ],
    phases: [
      { phase: 'Courtyard Ministry (Earth)', description: 'Christ\'s earthly life and death—the sacrifice made visible to all', timeframe: 'Incarnation to Cross' },
      { phase: 'Holy Place Ministry (Heaven)', description: 'Christ\'s ongoing intercession since ascension—daily mediation', timeframe: 'Ascension to present' },
      { phase: 'Most Holy Place Ministry', description: 'Final phase of judgment and complete removal of sin', timeframe: 'Pre-advent judgment to Second Coming' },
      { phase: 'Temple of Eternity', description: '"The Lord God Almighty and the Lamb are the temple" (Rev 21:22)', timeframe: 'Eternal kingdom' }
    ]
  },
  numerology: [
    { number: '1', meaning: 'Unity, primacy, God\'s singularity', examples: 'One altar, one way, one laver' },
    { number: '2', meaning: 'Witness, testimony, confirmation', examples: 'Two cherubim, two tablets, two onyx stones' },
    { number: '3', meaning: 'Divine perfection, completeness', examples: 'Three divisions (court, holy, most holy), three feasts' },
    { number: '4', meaning: 'Earth, creation, universality', examples: 'Four colors in veil, four horns on altar' },
    { number: '5', meaning: 'Grace, God\'s goodness', examples: 'Five cubits square altar, five pillars at entrance' },
    { number: '7', meaning: 'Spiritual perfection, completion', examples: 'Seven-branched lampstand, seven days of consecration' },
    { number: '10', meaning: 'Law, human responsibility', examples: 'Ten curtains, ten commandments, ten cubits Most Holy' },
    { number: '12', meaning: 'Government, Israel, apostolic foundation', examples: 'Twelve loaves, twelve stones, twelve tribes' },
    { number: '40', meaning: 'Testing, probation', examples: 'Moses on mountain 40 days, tabernacle built during 40 years' }
  ],
  application: {
    title: 'Living the Sanctuary Message',
    personalSalvation: [
      'Have you come to the altar? Have you accepted Christ\'s sacrifice?',
      'Are you being cleansed at the laver daily through God\'s Word?',
      'Is your life illuminated by the Spirit (lampstand)?',
      'Are you feeding on Christ through Scripture (showbread)?',
      'Is your prayer life fragrant to God (incense)?'
    ],
    understandingJudgment: [
      'Christ\'s work includes judgment as well as salvation',
      'Names written in the book of life are examined',
      'Confessed sins are covered; unconfessed sins condemn',
      'The sanctuary teaches: deal with sin now while mercy is available'
    ],
    livingAsPriests: [
      'You have direct access to God\'s presence',
      'You are called to offer spiritual sacrifices',
      'You minister to others as Christ\'s representative',
      'You maintain holiness—"HOLINESS TO THE LORD"'
    ]
  }
};

const TabButton = ({ active, onClick, children, color }: { active: boolean; onClick: () => void; children: React.ReactNode; color: string }) => (
  <Button
    onClick={onClick}
    variant={active ? "default" : "outline"}
    size="sm"
    className={active ? `bg-gradient-to-r ${color} text-white shadow-lg border-0` : ''}
  >
    {children}
  </Button>
);

const Section = ({ title, icon: Icon, children, defaultOpen = false }: { title: string; icon?: React.ElementType; children: React.ReactNode; defaultOpen?: boolean }) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <Card className="mb-3 overflow-hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center gap-2 p-3 bg-muted/50 hover:bg-muted transition-colors text-left"
      >
        {isOpen ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
        {Icon && <Icon size={18} className="text-muted-foreground" />}
        <span className="font-semibold text-foreground">{title}</span>
      </button>
      {isOpen && <CardContent className="p-4">{children}</CardContent>}
    </Card>
  );
};

const SanctuaryLibrary = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedFurniture, setSelectedFurniture] = useState(sanctuaryData.furniture[0]);
  const [selectedSacrifice, setSelectedSacrifice] = useState(sanctuaryData.sacrifices[0]);

  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'structure', label: 'Structure' },
    { id: 'furniture', label: 'Furniture' },
    { id: 'priesthood', label: 'Priesthood' },
    { id: 'sacrifices', label: 'Sacrifices' },
    { id: 'typology', label: 'Typology' },
    { id: 'heavenly', label: 'Heavenly' },
    { id: 'apply', label: 'Apply' }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-800 to-indigo-700 text-white p-6">
        <div className="flex items-center gap-3 mb-2">
          <Home size={32} />
          <div>
            <h1 className="text-2xl font-bold">The Sanctuary</h1>
            <p className="text-white/80 text-sm">God's Visual Gospel</p>
          </div>
        </div>
        <p className="text-lg font-medium">Three-Dimensional Parable of Salvation</p>
        <p className="text-sm text-white/90 mt-2 italic">
          "Let them make me a sanctuary; that I may dwell among them" — Exodus 25:8
        </p>
      </div>

      <div className="p-4">
        {/* Tab Navigation */}
        <div className="flex flex-wrap gap-2 mb-4 pb-3 border-b">
          {tabs.map((tab) => (
            <TabButton
              key={tab.id}
              active={activeTab === tab.id}
              onClick={() => setActiveTab(tab.id)}
              color="from-blue-600 to-indigo-600"
            >
              {tab.label}
            </TabButton>
          ))}
        </div>

        {/* Content */}
        <Card className="p-4">
          {activeTab === 'overview' && (
            <div>
              <Section title="The Sanctuary Message" icon={BookOpen} defaultOpen={true}>
                <p className="text-muted-foreground leading-relaxed mb-4">{sanctuaryData.overview.description}</p>
                <div className="flex flex-wrap gap-2 mb-4">
                  {sanctuaryData.overview.keyTexts.map((text, i) => (
                    <Badge key={i} variant="secondary">{text}</Badge>
                  ))}
                </div>
              </Section>

              <Section title="Purpose of the Sanctuary" icon={Eye}>
                <div className="space-y-3">
                  {sanctuaryData.overview.purpose.map((p, i) => (
                    <div key={i} className="p-3 bg-blue-50 dark:bg-blue-950/30 rounded-lg">
                      <p className="text-sm italic text-foreground">{p.text}</p>
                      <p className="text-xs text-muted-foreground mt-1">→ {p.meaning}</p>
                    </div>
                  ))}
                </div>
              </Section>

              <Section title="Symbolic Materials" icon={Sparkles}>
                <div className="grid gap-2">
                  {sanctuaryData.materials.map((mat, i) => (
                    <div key={i} className="flex items-start gap-3 p-2 bg-muted/30 rounded-lg">
                      <span className="text-xl">{mat.icon}</span>
                      <div>
                        <h4 className="font-semibold text-foreground">{mat.name}</h4>
                        <p className="text-xs text-muted-foreground">{mat.meaning}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </Section>
            </div>
          )}

          {activeTab === 'structure' && (
            <div>
              <p className="text-sm text-muted-foreground mb-4">Direction of approach: East to West</p>
              <div className="space-y-4">
                {sanctuaryData.structure.map((area) => {
                  const Icon = area.icon;
                  return (
                    <Card key={area.id} className="overflow-hidden">
                      <div className={`h-2 bg-gradient-to-r ${area.color}`} />
                      <CardContent className="p-4">
                        <div className="flex items-start gap-3">
                          <div className={`p-2 rounded-lg bg-gradient-to-r ${area.color}`}>
                            <Icon size={20} className="text-white" />
                          </div>
                          <div className="flex-1">
                            <h3 className="font-bold text-foreground">{area.name}</h3>
                            <p className="text-xs text-muted-foreground mb-2">{area.hebrew} • {area.dimensions}</p>
                            <p className="text-sm text-muted-foreground mb-2">{area.description}</p>
                            <div className="flex flex-wrap gap-2">
                              <Badge variant="outline">{area.access}</Badge>
                              <Badge className={`bg-gradient-to-r ${area.color} text-white`}>
                                {area.spiritualMeaning}
                              </Badge>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>
          )}

          {activeTab === 'furniture' && (
            <div>
              {/* Furniture selector */}
              <div className="flex flex-wrap gap-2 mb-4">
                {sanctuaryData.furniture.map((item) => {
                  const Icon = item.icon;
                  return (
                    <Button
                      key={item.id}
                      variant={selectedFurniture.id === item.id ? "default" : "outline"}
                      size="sm"
                      onClick={() => setSelectedFurniture(item)}
                      className={selectedFurniture.id === item.id ? `bg-gradient-to-r ${item.color} text-white border-0` : ''}
                    >
                      <Icon size={14} className="mr-1" />
                      <span className="hidden sm:inline">{item.name.split(' ')[0]}</span>
                    </Button>
                  );
                })}
              </div>

              {/* Selected furniture detail */}
              <Card className="overflow-hidden">
                <div className={`h-2 bg-gradient-to-r ${selectedFurniture.color}`} />
                <CardContent className="p-4">
                  <div className="flex items-start gap-3 mb-4">
                    {React.createElement(selectedFurniture.icon, { size: 28, className: 'text-primary' })}
                    <div>
                      <h3 className="text-xl font-bold text-foreground">{selectedFurniture.name}</h3>
                      <p className="text-sm text-muted-foreground">{selectedFurniture.hebrew} • {selectedFurniture.location}</p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold text-foreground mb-1">Description</h4>
                      <p className="text-sm text-muted-foreground">{selectedFurniture.description}</p>
                      <p className="text-xs text-muted-foreground mt-1">{selectedFurniture.materials} • {selectedFurniture.dimensions}</p>
                    </div>

                    <div className={`p-3 rounded-lg bg-gradient-to-r ${selectedFurniture.color} bg-opacity-10`}>
                      <h4 className="font-semibold text-foreground mb-2">Christ Type: {selectedFurniture.christType}</h4>
                      <ul className="space-y-1">
                        {selectedFurniture.christConnection.map((point, i) => (
                          <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                            <Sparkles size={12} className="text-amber-500 mt-1 flex-shrink-0" />
                            {point}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <h4 className="font-semibold text-foreground mb-1">Spiritual Lesson</h4>
                      <p className="text-sm text-muted-foreground">{selectedFurniture.spiritualLesson}</p>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {selectedFurniture.keyVerses.map((verse, i) => (
                        <Badge key={i} variant="secondary">{verse}</Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {activeTab === 'priesthood' && (
            <div>
              <Section title="The High Priest" icon={Crown} defaultOpen={true}>
                <p className="text-sm text-muted-foreground mb-2">
                  <strong>{sanctuaryData.priesthood.highPriest.hebrew}</strong> • Type: {sanctuaryData.priesthood.highPriest.type}
                </p>
                <p className="text-muted-foreground mb-4">{sanctuaryData.priesthood.highPriest.description}</p>

                <h4 className="font-semibold text-foreground mb-2">High Priestly Garments</h4>
                <div className="space-y-2 mb-4">
                  {sanctuaryData.priesthood.highPriest.garments.map((g, i) => (
                    <div key={i} className="p-3 bg-purple-50 dark:bg-purple-950/30 rounded-lg">
                      <h5 className="font-semibold text-purple-800 dark:text-purple-300">{g.name}</h5>
                      <p className="text-sm text-muted-foreground">{g.description}</p>
                      <p className="text-xs text-purple-600 dark:text-purple-400 mt-1">→ {g.meaning}</p>
                    </div>
                  ))}
                </div>

                <h4 className="font-semibold text-foreground mb-2">Christ as Our High Priest</h4>
                <ul className="space-y-1">
                  {sanctuaryData.priesthood.highPriest.christFulfillment.map((point, i) => (
                    <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                      <Star size={12} className="text-amber-500 mt-1 flex-shrink-0" />
                      {point}
                    </li>
                  ))}
                </ul>
              </Section>

              <Section title="Believers as Priests" icon={Users}>
                <p className="text-sm text-muted-foreground mb-2">
                  <strong>{sanctuaryData.priesthood.priests.hebrew}</strong> • {sanctuaryData.priesthood.priests.type}
                </p>
                <p className="text-muted-foreground mb-4">{sanctuaryData.priesthood.priests.description}</p>

                <h4 className="font-semibold text-foreground mb-2">Priestly Duties</h4>
                <ul className="space-y-1 mb-4">
                  {sanctuaryData.priesthood.priests.duties.map((duty, i) => (
                    <li key={i} className="text-sm text-muted-foreground">• {duty}</li>
                  ))}
                </ul>

                <h4 className="font-semibold text-foreground mb-2">Your Application</h4>
                <ul className="space-y-1">
                  {sanctuaryData.priesthood.priests.believerApplication.map((point, i) => (
                    <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                      <Cross size={12} className="text-primary mt-1 flex-shrink-0" />
                      {point}
                    </li>
                  ))}
                </ul>
              </Section>
            </div>
          )}

          {activeTab === 'sacrifices' && (
            <div>
              {/* Sacrifice selector */}
              <div className="flex flex-wrap gap-2 mb-4">
                {sanctuaryData.sacrifices.map((sac) => (
                  <Button
                    key={sac.name}
                    variant={selectedSacrifice.name === sac.name ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedSacrifice(sac)}
                    className={selectedSacrifice.name === sac.name ? 'bg-gradient-to-r from-red-600 to-orange-600 text-white border-0' : ''}
                  >
                    {sac.name.split(' ')[0]}
                  </Button>
                ))}
              </div>

              <Card className="overflow-hidden mb-4">
                <div className="h-2 bg-gradient-to-r from-red-600 to-orange-600" />
                <CardContent className="p-4">
                  <h3 className="text-xl font-bold text-foreground">{selectedSacrifice.name}</h3>
                  <p className="text-sm text-muted-foreground mb-4">{selectedSacrifice.hebrew} • {selectedSacrifice.reference}</p>

                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold text-foreground mb-1">Offering Required</h4>
                      <p className="text-sm text-muted-foreground">{selectedSacrifice.animal}</p>
                    </div>

                    <div>
                      <h4 className="font-semibold text-foreground mb-1">Procedure</h4>
                      <p className="text-sm text-muted-foreground">{selectedSacrifice.description}</p>
                    </div>

                    <div className="p-3 bg-red-50 dark:bg-red-950/30 rounded-lg">
                      <h4 className="font-semibold text-red-800 dark:text-red-300 mb-1">Christological Meaning</h4>
                      <p className="text-sm text-muted-foreground">{selectedSacrifice.meaning}</p>
                    </div>

                    <div className="p-3 bg-green-50 dark:bg-green-950/30 rounded-lg">
                      <h4 className="font-semibold text-green-800 dark:text-green-300 mb-1">Application for Today</h4>
                      <p className="text-sm text-muted-foreground">{selectedSacrifice.application}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Section title="The Five Offerings: A Complete Picture" icon={Scroll}>
                <p className="text-sm text-muted-foreground mb-3">Together, the five Levitical offerings present a complete picture of Christ's work:</p>
                <div className="space-y-2">
                  {sanctuaryData.sacrifices.map((sac, i) => (
                    <div key={i} className="flex justify-between p-2 bg-muted/30 rounded">
                      <span className="font-medium text-foreground">{sac.name}</span>
                      <span className="text-sm text-muted-foreground">{sac.meaning.split(';')[0]}</span>
                    </div>
                  ))}
                </div>
              </Section>
            </div>
          )}

          {activeTab === 'typology' && (
            <div>
              <Section title="The Believer's Journey" icon={Scale} defaultOpen={true}>
                <div className="space-y-2">
                  {sanctuaryData.journey.map((stage, i) => (
                    <div key={i} className="flex gap-3 items-start p-3 border-l-4 border-blue-500 bg-blue-50 dark:bg-blue-950/30 rounded-r-lg">
                      <span className="w-6 h-6 flex items-center justify-center bg-blue-600 text-white rounded-full text-xs flex-shrink-0">
                        {i + 1}
                      </span>
                      <div>
                        <h4 className="font-semibold text-foreground">{stage.location}</h4>
                        <p className="text-sm text-muted-foreground">{stage.experience}</p>
                        <div className="flex gap-2 mt-1">
                          <Badge variant="outline">{stage.stage}</Badge>
                          <Badge variant="secondary">{stage.truth}</Badge>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </Section>

              <Section title="Three Phases of Salvation" icon={Layers}>
                <div className="space-y-3">
                  <div className="p-3 bg-amber-50 dark:bg-amber-950/30 rounded-lg">
                    <h4 className="font-semibold text-amber-800 dark:text-amber-300">Courtyard = Justification</h4>
                    <p className="text-sm text-muted-foreground">We are saved from the penalty of sin through Christ's sacrifice (past tense salvation)</p>
                  </div>
                  <div className="p-3 bg-blue-50 dark:bg-blue-950/30 rounded-lg">
                    <h4 className="font-semibold text-blue-800 dark:text-blue-300">Holy Place = Sanctification</h4>
                    <p className="text-sm text-muted-foreground">We are being saved from the power of sin through Christ's intercession (present tense salvation)</p>
                  </div>
                  <div className="p-3 bg-purple-50 dark:bg-purple-950/30 rounded-lg">
                    <h4 className="font-semibold text-purple-800 dark:text-purple-300">Most Holy Place = Glorification</h4>
                    <p className="text-sm text-muted-foreground">We will be saved from the presence of sin through Christ's return (future tense salvation)</p>
                  </div>
                </div>
              </Section>

              <Section title="Sanctuary Numerology" icon={CircleDot}>
                <div className="grid gap-2">
                  {sanctuaryData.numerology.map((num, i) => (
                    <div key={i} className="flex gap-3 items-start p-2 bg-muted/30 rounded-lg">
                      <span className="w-8 h-8 flex items-center justify-center bg-primary text-primary-foreground rounded-full font-bold">
                        {num.number}
                      </span>
                      <div>
                        <p className="font-medium text-foreground">{num.meaning}</p>
                        <p className="text-xs text-muted-foreground">{num.examples}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </Section>
            </div>
          )}

          {activeTab === 'heavenly' && (
            <div>
              <Section title="The Heavenly Sanctuary" icon={Star} defaultOpen={true}>
                <p className="text-muted-foreground mb-4">{sanctuaryData.heavenlySanctuary.description}</p>

                <h4 className="font-semibold text-foreground mb-2">Biblical Evidence</h4>
                <div className="space-y-2 mb-4">
                  {sanctuaryData.heavenlySanctuary.evidence.map((ev, i) => (
                    <div key={i} className="p-2 bg-sky-50 dark:bg-sky-950/30 rounded">
                      <span className="font-medium text-sky-800 dark:text-sky-300">{ev.text}</span>
                      <p className="text-sm text-muted-foreground">"{ev.content}"</p>
                    </div>
                  ))}
                </div>
              </Section>

              <Section title="Christ's Ministry Phases" icon={Crown}>
                <div className="space-y-3">
                  {sanctuaryData.heavenlySanctuary.phases.map((phase, i) => (
                    <div key={i} className="p-3 border-l-4 border-indigo-500 bg-indigo-50 dark:bg-indigo-950/30 rounded-r-lg">
                      <h4 className="font-semibold text-indigo-800 dark:text-indigo-300">{phase.phase}</h4>
                      <p className="text-sm text-muted-foreground">{phase.description}</p>
                      <Badge variant="outline" className="mt-1">{phase.timeframe}</Badge>
                    </div>
                  ))}
                </div>
              </Section>

              <Section title="Current Ministry of Christ" icon={Heart}>
                <ul className="space-y-2">
                  {sanctuaryData.heavenlySanctuary.currentMinistry.map((ministry, i) => (
                    <li key={i} className="flex items-start gap-2 text-muted-foreground">
                      <Sparkles size={14} className="text-amber-500 mt-1 flex-shrink-0" />
                      {ministry}
                    </li>
                  ))}
                </ul>
              </Section>
            </div>
          )}

          {activeTab === 'apply' && (
            <div>
              <div className="p-4 bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-950/30 dark:to-purple-950/30 rounded-lg mb-4">
                <h3 className="font-bold text-foreground mb-3">{sanctuaryData.application.title}</h3>
              </div>

              <Section title="Personal Salvation Check" icon={Cross} defaultOpen={true}>
                <div className="space-y-2">
                  {sanctuaryData.application.personalSalvation.map((q, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <Checkbox id={`salvation-${i}`} />
                      <label htmlFor={`salvation-${i}`} className="text-sm text-muted-foreground cursor-pointer">{q}</label>
                    </div>
                  ))}
                </div>
              </Section>

              <Section title="Understanding Judgment" icon={Scale}>
                <ul className="space-y-2">
                  {sanctuaryData.application.understandingJudgment.map((point, i) => (
                    <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                      <Eye size={14} className="text-purple-500 mt-1 flex-shrink-0" />
                      {point}
                    </li>
                  ))}
                </ul>
              </Section>

              <Section title="Living as Priests" icon={Users}>
                <ul className="space-y-2">
                  {sanctuaryData.application.livingAsPriests.map((point, i) => (
                    <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                      <Shield size={14} className="text-green-500 mt-1 flex-shrink-0" />
                      {point}
                    </li>
                  ))}
                </ul>
              </Section>

              <Card className="mt-4 p-4 border border-dashed">
                <h4 className="font-semibold text-foreground mb-2">Personal Response</h4>
                <Textarea
                  className="min-h-32 resize-none"
                  placeholder="Write your reflections on the sanctuary message. How does it illuminate your understanding of Christ's work? What changes will you make?"
                />
              </Card>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};

export default SanctuaryLibrary;
