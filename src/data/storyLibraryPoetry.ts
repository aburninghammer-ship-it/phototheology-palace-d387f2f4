// Poetry and Wisdom Books: Job, Psalms, Proverbs, Ecclesiastes, Song of Solomon

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

// Job Stories
export const jobStories: BiblicalStory[] = [
  {
    id: "job-tested",
    title: "Job's Testing",
    reference: "Job 1-2",
    volume: "Job",
    category: "Wisdom",
    summary: "Job is blameless and wealthy. In heaven, Satan challenges Job's motives. God permits testing. Job loses children, wealth, and health. His wife says 'Curse God and die.' Job refuses: 'The LORD gave, the LORD has taken away; blessed be the name of the LORD.'",
    keyElements: ["Greatest man of East", "Blameless and upright", "Heavenly council scene", "Satan's accusation", "First test—loses all", "\"Naked came I\"", "Second test—health", "Wife's counsel", "\"Shall we accept good and not evil?\"", "Three friends arrive"],
    christPattern: [
      { element: "Suffered though righteous", christApplication: "Christ suffered though sinless" },
      { element: "Satan accuses", christApplication: "Satan accuses believers" },
      { element: "Vindicated in end", christApplication: "Christ vindicated" }
    ],
    dimensions: {
      literal: "Righteous man suffers inexplicably",
      christ: "Christ suffered for us",
      personal: "Suffering doesn't mean sin",
      church: "Church suffers yet trusts",
      heavenFuture: "All suffering explained",
      heavenPast: "Great controversy revealed"
    },
    relatedStories: ["James 5:11 (Patience of Job)", "1 Peter 5:8-9 (Satan as adversary)"],
    keyFigures: ["Job", "Satan", "Job's wife", "Eliphaz", "Bildad", "Zophar"],
    setting: "Land of Uz, Heaven"
  },
  {
    id: "job-restored",
    title: "Job Restored",
    reference: "Job 38-42",
    volume: "Job",
    category: "Wisdom",
    summary: "God speaks from whirlwind, asking Job about creation. Job repents of questioning God. Job prays for his friends. God restores double—14,000 sheep, 6,000 camels, 10 children. Job lives 140 more years, sees four generations.",
    keyElements: ["God speaks from whirlwind", "Creation questions", "\"Where were you?\"", "Behemoth and Leviathan", "Job's repentance", "\"I heard, now I see\"", "Prays for friends", "Receives double", "New children", "140 more years", "Dies old and full of days"],
    christPattern: [
      { element: "Intercedes for friends", christApplication: "Christ intercedes" },
      { element: "Double restoration", christApplication: "Hundredfold blessing" },
      { element: "Sees God", christApplication: "We shall see Him" }
    ],
    dimensions: {
      literal: "Job vindicated and blessed",
      christ: "Suffering leads to glory",
      personal: "Trust leads to restoration",
      church: "Church will be vindicated",
      heavenFuture: "More than double restored",
      heavenPast: "God's justice vindicated"
    },
    relatedStories: ["James 5:11", "Romans 8:18 (Suffering not comparable to glory)"],
    keyFigures: ["Job", "God", "Elihu"],
    setting: "Land of Uz"
  }
];

// Psalms Stories
export const psalmsStories: BiblicalStory[] = [
  {
    id: "psalm-22",
    title: "Psalm 22 - Forsaken",
    reference: "Psalm 22",
    volume: "Psalms",
    category: "Messianic",
    summary: "David's cry of abandonment becomes Christ's cry on the cross. Describes pierced hands and feet, garments divided, bones out of joint, surrounded by mockers. Ends in triumph: all nations will worship.",
    keyElements: ["My God, why forsaken?", "Bulls of Bashan surround", "Poured out like water", "Bones out of joint", "Heart like wax", "Tongue cleaves to jaws", "Dogs encompass", "Pierce hands and feet", "Cast lots for garments", "All nations worship"],
    christPattern: [
      { element: "Every detail fulfilled", christApplication: "Written 1000 years before cross" },
      { element: "Forsaken cry", christApplication: "Christ's cry on cross" },
      { element: "Garments divided", christApplication: "Soldiers cast lots" }
    ],
    dimensions: {
      literal: "David's cry of distress",
      christ: "Precise prophecy of crucifixion",
      personal: "God hears our desperate cries",
      church: "Church proclaims the crucified One",
      heavenFuture: "All nations will bow",
      heavenPast: "Cross planned from eternity"
    },
    relatedStories: ["Matthew 27:35-46", "John 19:23-24", "Hebrews 2:12"],
    keyFigures: ["David", "Christ"],
    setting: "N/A - Prophetic Psalm"
  },
  {
    id: "psalm-23",
    title: "Psalm 23 - The Shepherd",
    reference: "Psalm 23",
    volume: "Psalms",
    category: "Trust",
    summary: "The most beloved psalm. The LORD is my shepherd—I lack nothing. He leads by still waters, restores soul, guides in right paths. Even through death's valley, no fear. Table prepared before enemies; cup overflows. Goodness and mercy follow; dwelling forever.",
    keyElements: ["LORD is my shepherd", "I shall not want", "Green pastures", "Still waters", "Restores soul", "Paths of righteousness", "Valley of shadow", "Rod and staff comfort", "Table before enemies", "Anoints head", "Cup overflows", "Dwell forever"],
    christPattern: [
      { element: "Good Shepherd", christApplication: "Christ is Good Shepherd (John 10)" },
      { element: "Lays down life", christApplication: "Christ dies for sheep" },
      { element: "Leads beside waters", christApplication: "Christ gives living water" }
    ],
    dimensions: {
      literal: "Shepherd's care",
      christ: "Christ is the Good Shepherd",
      personal: "I am His sheep",
      church: "Church is His flock",
      heavenFuture: "Dwelling in His house forever",
      heavenPast: "God always shepherded His people"
    },
    relatedStories: ["John 10:1-18", "Ezekiel 34", "Revelation 7:17"],
    keyFigures: ["David", "The LORD"],
    setting: "N/A - Personal psalm"
  },
  {
    id: "psalm-51",
    title: "Psalm 51 - David's Repentance",
    reference: "Psalm 51",
    volume: "Psalms",
    category: "Penitential",
    summary: "After Nathan's confrontation, David pours out repentance. He pleads for mercy, acknowledges sin against God, asks for cleansing with hyssop. Requests clean heart and renewed spirit. Promises to teach transgressors. A broken and contrite heart God won't despise.",
    keyElements: ["Blot out transgressions", "Wash thoroughly", "Against Thee only sinned", "Shapen in iniquity", "Purge with hyssop", "Create clean heart", "Renew right spirit", "Don't take Spirit", "Restore joy of salvation", "Broken spirit", "Contrite heart"],
    christPattern: [
      { element: "Cleansed with hyssop", christApplication: "Christ's blood cleanses" },
      { element: "New heart created", christApplication: "Born again" },
      { element: "Spirit not taken", christApplication: "Spirit abides forever" }
    ],
    dimensions: {
      literal: "Model of true repentance",
      christ: "Christ makes us clean",
      personal: "How to truly repent",
      church: "Church needs continual cleansing",
      heavenFuture: "Perfect holiness",
      heavenPast: "Repentance always possible"
    },
    relatedStories: ["2 Samuel 12", "1 John 1:9", "Ezekiel 36:26"],
    keyFigures: ["David"],
    setting: "After Bathsheba sin"
  }
];

// Proverbs Stories
export const proverbsStories: BiblicalStory[] = [
  {
    id: "proverbs-wisdom",
    title: "Wisdom Calls",
    reference: "Proverbs 1-9",
    volume: "Proverbs",
    category: "Wisdom",
    summary: "Solomon personifies Wisdom as a woman calling in the streets. The fear of the LORD is the beginning of wisdom. Wisdom was with God before creation. Contrast drawn between Lady Wisdom and the seductive Strange Woman.",
    keyElements: ["Fear of LORD is beginning", "Wisdom cries aloud", "Don't despise instruction", "Wisdom was before creation", "Path of righteous shines", "Strange woman's seduction", "Seven pillars", "Simple believe everything", "Wisdom better than gold"],
    christPattern: [
      { element: "Wisdom personified", christApplication: "Christ is wisdom of God (1 Cor 1:24)" },
      { element: "With God at creation", christApplication: "Christ the eternal Word" },
      { element: "Calls all to come", christApplication: "Christ invites all" }
    ],
    dimensions: {
      literal: "Call to pursue wisdom",
      christ: "Christ is wisdom incarnate",
      personal: "Seek wisdom daily",
      church: "Church proclaims wisdom",
      heavenFuture: "Perfect wisdom",
      heavenPast: "Wisdom from eternity"
    },
    relatedStories: ["1 Corinthians 1:24, 30", "Colossians 2:3", "James 1:5"],
    keyFigures: ["Solomon", "Lady Wisdom"],
    setting: "N/A - Wisdom teaching"
  }
];

// Ecclesiastes Stories
export const ecclesiastesStories: BiblicalStory[] = [
  {
    id: "ecclesiastes-vanity",
    title: "All is Vanity",
    reference: "Ecclesiastes 1-12",
    volume: "Ecclesiastes",
    category: "Wisdom",
    summary: "The Preacher explores meaning 'under the sun.' Vanity of vanities—pleasure, wealth, work, wisdom all fail to satisfy. Nothing new under the sun. To everything a season. Death comes to all. Yet conclusion: Fear God and keep commandments—this is the whole duty of man.",
    keyElements: ["Vanity of vanities", "Nothing new under sun", "Chased the wind", "Time for everything", "Dead know nothing", "Two better than one", "Cast bread on waters", "Remember Creator in youth", "Fear God and keep commandments", "Whole duty of man"],
    christPattern: [
      { element: "Life without God is empty", christApplication: "Only Christ satisfies" },
      { element: "Death comes to all", christApplication: "Christ conquered death" },
      { element: "Conclusion: fear God", christApplication: "Christ is our righteousness" }
    ],
    dimensions: {
      literal: "Search for meaning",
      christ: "Christ gives eternal meaning",
      personal: "Life without God is vanity",
      church: "Church points to eternal",
      heavenFuture: "No more vanity",
      heavenPast: "Sin brought futility"
    },
    relatedStories: ["Romans 8:20 (Futility)", "John 10:10 (Abundant life)"],
    keyFigures: ["The Preacher (Solomon)"],
    setting: "N/A - Philosophical reflection"
  }
];

// Song of Solomon Stories
export const songStories: BiblicalStory[] = [
  {
    id: "song-love",
    title: "Song of Songs",
    reference: "Song of Solomon 1-8",
    volume: "Song of Solomon",
    category: "Wisdom",
    summary: "The greatest song. Dialogue between Bride and Bridegroom celebrating love. The Shulamite is dark but lovely. The Beloved is altogether lovely. Love is strong as death. Many waters cannot quench love.",
    keyElements: ["Kiss me with kisses", "Dark but lovely", "Rose of Sharon", "Lily of valleys", "Banner over me is love", "Voice of beloved", "Altogether lovely", "Love strong as death", "Many waters cannot quench", "Seal on heart"],
    christPattern: [
      { element: "Bridegroom", christApplication: "Christ the Bridegroom" },
      { element: "Bride", christApplication: "Church the Bride" },
      { element: "Love song", christApplication: "Christ's love for church" }
    ],
    dimensions: {
      literal: "Love between husband and wife",
      christ: "Christ's love for His church",
      personal: "My relationship with Christ",
      church: "Church as Bride",
      heavenFuture: "Marriage supper of Lamb",
      heavenPast: "God always loved His people"
    },
    relatedStories: ["Ephesians 5:25-32", "Revelation 19:7-9", "Revelation 21:2"],
    keyFigures: ["Solomon", "Shulamite"],
    setting: "Israel"
  }
];
