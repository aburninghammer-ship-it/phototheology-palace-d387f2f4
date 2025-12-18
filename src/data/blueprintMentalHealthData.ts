export interface MentalHealthArticle {
  id: number;
  week: string;
  name: string;
  sanctuaryMeaning: string;
  mentalHealthPrinciple: string;
  teaching: string;
  biblicalFoundation: string;
  practicalSteps: string[];
  reflectionQuestions: string[];
  weeklyChallenge: string;
  scriptureReferences: string[];
  prayerPrompt: string;
}

export const MENTAL_HEALTH_ARTICLES: MentalHealthArticle[] = [
  {
    id: 1,
    week: "Week 1",
    name: "📐 The Pattern",
    sanctuaryMeaning: "Orientation Week — Understanding the sanctuary as God's mental-health blueprint.",
    mentalHealthPrinciple: "God heals progressively, not instantaneously. Mental health is architectural repair, not symptom control.",
    teaching: `**WHY GOD HEALS IN ORDER**

God heals progressively, not instantaneously. Understanding this pattern is the foundation for lasting mental health transformation.

**Why Skipping Steps Leads to Relapse:**
Most mental health approaches attack symptoms instead of addressing the proper order. You can't jump straight to peace without first walking through surrender, cleansing, nourishment, insight, and regulation.

**Mental Health as Architectural Repair:**
Your mind isn't broken—it needs rebuilding according to God's blueprint. The sanctuary pattern shows us exactly how God constructs wholeness.

**The Order Matters:**
• Pain → Cleansing → Nourishment → Insight → Regulation → Rest

This is how God heals the mind. Skip order, and people burn out. Follow order, and healing becomes a byproduct of obedience.

**This Week's Focus:**
Write your current mental struggles without trying to fix them yet. Simply name them. Commit to the full 8-week process without shortcuts.`,
    biblicalFoundation: `Exodus 25:8–9 — "And let them make me a sanctuary; that I may dwell among them. According to all that I shew thee, after the pattern..."

Hebrews 8:5 — The earthly sanctuary was a "copy and shadow of the heavenly things."

Romans 12:2 — "Be ye transformed by the renewing of your mind."

God gave Moses a detailed pattern because order matters. The sanctuary wasn't random furniture arranged haphazardly—it was a divine blueprint showing humanity how to approach wholeness step by step.

Zion = the sanctuary = the mind restored. When the psalmist speaks of blessing "out of Zion" (Psalm 128:5), he speaks of restoration flowing from God's ordered dwelling place.`,
    practicalSteps: [
      "Write your current mental struggles without attempting to fix them",
      "Commit to the full 8-week process without shortcuts",
      "Tell one person you're beginning this journey",
      "Set aside 20-30 minutes daily for this study",
      "Create a journal specifically for this 8-week process"
    ],
    reflectionQuestions: [
      "Where have you tried to 'jump straight to peace' without doing the work?",
      "Which step do you usually avoid or skip?",
      "Have you treated mental health as symptom control rather than architectural repair?",
      "Are you willing to trust God's order even when it feels slow?"
    ],
    weeklyChallenge: "This week, simply observe your mental patterns without fixing them. Journal what you notice about your thoughts, triggers, and reactions. Don't judge or correct—just observe. This is your baseline.",
    scriptureReferences: [
      "Exodus 25:8–9 — Make me a sanctuary according to the pattern",
      "Hebrews 8:5 — A copy and shadow of heavenly things",
      "Romans 12:2 — Transformed by renewing of your mind"
    ],
    prayerPrompt: "Lord, I commit to Your order, not my shortcuts. Teach me to trust Your pattern for healing. Help me follow the process without jumping ahead. I surrender my timeline to Yours. Amen."
  },
  {
    id: 2,
    week: "Week 2",
    name: "🔥 The Altar",
    sanctuaryMeaning: "Altar of Sacrifice — Grief, Surrender, and Naming Pain.",
    mentalHealthPrinciple: "Unexpressed grief fuels anxiety and depression. Lament is not weakness—it's worship.",
    teaching: `**GRIEF, SURRENDER, AND NAMING PAIN**

This is where hidden pain comes into the open. The altar is where we stop emotional suppression and bring our raw grief to God.

**Unexpressed Grief Fuels Anxiety and Depression:**
Pain that stays hidden doesn't disappear—it drives symptoms. Anxiety is often grief in disguise. Depression is often loss without lament.

**Lament Is Not Weakness—It's Worship:**
The Psalms are filled with lament. David cried out, questioned, wept, and complained. This was not weakness—it was honest relationship with God. Lament says: "I trust You enough to tell You the truth."

**Jesus Meets Us Before Improvement:**
Matthew 11:28-30 — Jesus invites the weary and heavy-laden BEFORE they're fixed. He doesn't wait for you to get better. He meets you at the altar.

**What Goes on the Altar:**
• Losses you've never grieved
• Disappointments you've stuffed down
• Fears you've never named
• Anger you've never expressed safely
• Trauma you've minimized`,
    biblicalFoundation: `Psalm 51:17 — "The sacrifices of God are a broken spirit: a broken and a contrite heart, O God, thou wilt not despise."

Matthew 11:28–30 — "Come unto me, all ye that labour and are heavy laden, and I will give you rest."

Lamentations 3:31–33 — "For the Lord will not cast off for ever: But though he cause grief, yet will he have compassion..."

The altar was the FIRST step in approaching God. Nothing entered the sanctuary without sacrifice first. Your grief, your pain, your losses—these are the sacrifices God receives. He doesn't despise your brokenness; He honors it.`,
    practicalSteps: [
      "Begin a lament journal: write losses, disappointments, fears without censoring",
      "Practice verbal surrender prayer daily—speak your pain aloud to God",
      "Stop self-shaming language ('I shouldn't feel this way')",
      "Name one loss you've never fully grieved",
      "Let yourself cry if tears come—don't suppress them"
    ],
    reflectionQuestions: [
      "What have you never allowed yourself to grieve?",
      "What part of control is hardest to surrender?",
      "Do you believe Jesus meets you before you're fixed?",
      "What pain have you been suppressing that needs the altar?"
    ],
    weeklyChallenge: "Write a lament letter to God this week. Include: one major loss you've minimized, one disappointment you've stuffed, one fear you've never spoken. Don't fix it—just name it. End with: 'I lay this on Your altar.'",
    scriptureReferences: [
      "Psalm 51:17 — A broken spirit God will not despise",
      "Matthew 11:28–30 — Come unto me, all ye that labour",
      "Lamentations 3:31–33 — Though He causes grief, He will have compassion"
    ],
    prayerPrompt: "Lord, I bring my hidden grief to Your altar. I've carried losses I've never named. I surrender disappointments, fears, and anger I've suppressed. Receive my brokenness as worship. Meet me before I'm fixed. Amen."
  },
  {
    id: 3,
    week: "Week 3",
    name: "💧 The Laver",
    sanctuaryMeaning: "Washing & Reflection — Cleansing the Thought Life.",
    mentalHealthPrinciple: "Thoughts are habits, not facts. Self-examination ≠ self-condemnation. God cleanses patterns, not personalities.",
    teaching: `**CLEANSING THE THOUGHT LIFE**

The laver is where we identify and replace destructive thought patterns. This is cognitive renewal through divine washing.

**Thoughts Are Habits, Not Facts:**
Your recurring negative thoughts feel true, but they're often just familiar. Anxiety lies. Depression distorts. Trauma rewires. Just because you think it doesn't mean it's true.

**Self-Examination ≠ Self-Condemnation:**
Looking honestly at your thought patterns is not the same as beating yourself up. The laver was for cleansing, not punishment. Examine without condemning.

**God Cleanses Patterns, Not Personalities:**
God isn't trying to erase who you are. He's washing away the lies, distortions, and destructive patterns that don't belong. Your personality remains; the contamination goes.

**What Needs Cleansing:**
• Recurring negative thoughts
• Lies you believe about yourself
• Toxic thought patterns inherited from family
• Fear-based thinking
• Media inputs that poison the mind`,
    biblicalFoundation: `2 Corinthians 10:5 — "Casting down imaginations, and every high thing that exalteth itself against the knowledge of God, and bringing into captivity every thought..."

Ephesians 5:26 — "That he might sanctify and cleanse it with the washing of water by the word."

Psalm 119:9 — "Wherewithal shall a young man cleanse his way? by taking heed thereto according to thy word."

The laver was made from bronze mirrors (Exodus 38:8)—tools of self-examination became tools of cleansing. You must see the contamination before it can be washed away. God's Word is the water that cleanses.`,
    practicalSteps: [
      "Identify 3 recurring negative thoughts you think most often",
      "Write truth-based replacements from Scripture for each one",
      "Reduce media input by 30-50% this week",
      "Ask: 'Who taught me this thought—God or experience?'",
      "Practice catching lies in real-time and replacing them immediately"
    ],
    reflectionQuestions: [
      "Which thoughts repeat the most in your mind?",
      "Who taught you those thoughts—God or painful experience?",
      "Can you distinguish between self-examination and self-condemnation?",
      "What media inputs are contaminating your thought life?"
    ],
    weeklyChallenge: "Track your 3 most recurring negative thoughts this week. For each one, find a Scripture that speaks truth against the lie. When the thought surfaces, immediately speak the truth out loud. Journal the shift.",
    scriptureReferences: [
      "2 Corinthians 10:5 — Bringing every thought into captivity",
      "Ephesians 5:26 — Washing of water by the word",
      "Psalm 119:9 — Cleanse your way by God's word"
    ],
    prayerPrompt: "Father, wash my thought life clean. Show me the lies I've been believing. Replace destructive patterns with Your truth. Help me examine myself without condemning myself. Cleanse my mind. Amen."
  },
  {
    id: 4,
    week: "Week 4",
    name: "🍞 The Table",
    sanctuaryMeaning: "Bread of Presence — Nourishment, Routine, and Community.",
    mentalHealthPrinciple: "The mind needs daily emotional nutrition. Isolation intensifies mental illness. Consistency heals faster than intensity.",
    teaching: `**NOURISHMENT, ROUTINE, AND COMMUNITY**

The table of shewbread teaches us about stabilizing the mind through proper nourishment and connection.

**The Mind Needs Daily Emotional Nutrition:**
You cannot starve your soul and expect your mind to thrive. The table had 12 loaves—always present, always fresh. Your mind needs daily input of truth, hope, connection, and grace.

**Isolation Intensifies Mental Illness:**
Ecclesiastes 4:9-12 teaches that two are better than one. Isolation is a breeding ground for distorted thinking. Community corrects perception.

**Consistency Heals Faster Than Intensity:**
The shewbread was replaced weekly in a steady rhythm. It wasn't occasional feasting—it was consistent provision. Mental health improves through daily rhythms, not dramatic interventions.

**What the Table Provides:**
• Simple daily rhythms (wake, eat, connect)
• Safe relational connection
• Emotional nourishment through presence
• Structure that creates stability`,
    biblicalFoundation: `John 6:35 — "Jesus said unto them, I am the bread of life: he that cometh to me shall never hunger..."

Ecclesiastes 4:9–12 — "Two are better than one... if they fall, the one will lift up his fellow..."

Matthew 4:4 — "Man shall not live by bread alone, but by every word that proceedeth out of the mouth of God."

The shewbread was called "bread of the Presence"—it represented continual communion with God. The 12 loaves represented all of Israel—community. Mental health requires both: daily communion with God AND connection with others.`,
    practicalSteps: [
      "Establish simple daily rhythms: consistent wake time, meal times, connection time",
      "Identify one safe relational connection—reach out this week",
      "Replace emotional starvation with intentional presence",
      "Create a morning routine that nourishes before the day demands",
      "Share one honest struggle with a trusted person"
    ],
    reflectionQuestions: [
      "Where are you undernourished emotionally?",
      "What rhythms would bring stability to your mental life?",
      "Are you isolating or connecting?",
      "Who is your 'safe person' for honest conversation?"
    ],
    weeklyChallenge: "This week, establish ONE simple daily rhythm (same wake time, same prayer time, or same check-in with a friend). Also, reach out to one safe person and share something honest about your mental health journey.",
    scriptureReferences: [
      "John 6:35 — I am the bread of life",
      "Ecclesiastes 4:9–12 — Two are better than one",
      "Matthew 4:4 — Man shall not live by bread alone"
    ],
    prayerPrompt: "Lord, You are the bread of life. Nourish my starving soul. Help me establish rhythms that bring stability. Lead me out of isolation into safe community. Feed me daily. Amen."
  },
  {
    id: 5,
    week: "Week 5",
    name: "🕯️ The Candlestick",
    sanctuaryMeaning: "Illumination — Insight, Meaning, and Trauma Awareness.",
    mentalHealthPrinciple: "Understanding pain reduces shame. Trauma responses are adaptations, not failures. Light reveals patterns, not guilt.",
    teaching: `**INSIGHT, MEANING, AND TRAUMA AWARENESS**

The candlestick brings illumination—replacing confusion with understanding.

**Understanding Pain Reduces Shame:**
When you understand WHY you react certain ways, shame decreases. The candlestick doesn't condemn—it illuminates. Knowledge brings compassion for yourself.

**Trauma Responses Are Adaptations, Not Failures:**
Your fight/flight/freeze responses were survival mechanisms. They helped you survive. Now they may be overactivated, but they're not character flaws—they're adaptations that need updating.

**Light Reveals Patterns, Not Guilt:**
The candlestick's purpose was illumination for service, not exposure for punishment. When you see your patterns clearly, you can address them—without shame.

**What the Light Reveals:**
• Your specific triggers
• Your stress responses (fight/flight/freeze/fawn)
• Patterns you've repeated
• Connections between past and present reactions`,
    biblicalFoundation: `John 8:12 — "I am the light of the world: he that followeth me shall not walk in darkness, but shall have the light of life."

Psalm 119:105 — "Thy word is a lamp unto my feet, and a light unto my path."

Proverbs 20:27 — "The spirit of man is the candle of the LORD, searching all the inward parts of the belly."

God's Spirit searches the inner parts—not to condemn, but to illuminate. Jesus is the light that dispels darkness. Understanding yourself is not self-obsession; it's stewardship of what God has entrusted to you.`,
    practicalSteps: [
      "Identify your top 3 triggers and what responses they activate",
      "Learn your stress patterns: fight, flight, freeze, or fawn?",
      "Journal insights without judgment—observe, don't condemn",
      "Research how trauma affects the brain—knowledge reduces shame",
      "Ask: 'What was this response protecting me from?'"
    ],
    reflectionQuestions: [
      "What patterns are you beginning to notice about yourself?",
      "How does understanding change self-blame?",
      "Can you see your trauma responses as adaptations rather than failures?",
      "What triggers activate your strongest reactions?"
    ],
    weeklyChallenge: "This week, become a curious observer of yourself. When you feel triggered, pause and note: What happened? What did I feel? How did I respond? Don't judge—just illuminate. By week's end, identify one pattern.",
    scriptureReferences: [
      "John 8:12 — I am the light of the world",
      "Psalm 119:105 — Thy word is a lamp unto my feet",
      "Proverbs 20:27 — The spirit of man is the candle of the LORD"
    ],
    prayerPrompt: "Lord, shine Your light on my patterns. Help me understand without condemning myself. Show me how my responses developed and how they can be healed. Illuminate, don't shame. Amen."
  },
  {
    id: 6,
    week: "Week 6",
    name: "🌸 The Incense Altar",
    sanctuaryMeaning: "Emotional Regulation — Regulation, Breath, and Prayer.",
    mentalHealthPrinciple: "Anxiety is physiological before it is spiritual. Prayer regulates when it slows us down. God speaks in stillness, not panic.",
    teaching: `**REGULATION, BREATH, AND PRAYER**

The altar of incense teaches emotional regulation—calming the nervous system so truth can land.

**Anxiety Is Physiological Before It Is Spiritual:**
Before anxiety is a spiritual problem, it's a body problem. Your nervous system is dysregulated. Breathing, slowing down, and calming the body must happen before spiritual truth can penetrate.

**Prayer Regulates When It Slows Us Down:**
Prayer isn't magic—it's regulation. When we slow our breath, speak to God, and pause our racing thoughts, we activate the parasympathetic nervous system. Prayer changes our physiology.

**God Speaks in Stillness, Not Panic:**
1 Kings 19:11-12 — God wasn't in the wind, earthquake, or fire. He was in the "still small voice." A panicked mind can't hear. Stillness is required.

**Incense Only Rises When Fire and Air Meet:**
This teaches us that emotional regulation combines inner fire (the Holy Spirit's work) with breath (our physiological calming). Both are necessary.`,
    biblicalFoundation: `Philippians 4:6–7 — "Be careful for nothing; but in every thing by prayer and supplication with thanksgiving let your requests be made known unto God. And the peace of God... shall keep your hearts and minds."

Psalm 46:10 — "Be still, and know that I am God."

Revelation 8:3–4 — The prayers of the saints rise like incense before God's throne.

The incense altar stood closest to the Most Holy Place—nearest to God's presence. This teaches us: regulated calm is the posture that brings us nearest to God. Panic pushes us away; stillness draws us near.`,
    practicalSteps: [
      "Practice daily slow breathing: 5 seconds in, 7 seconds out, for 5 minutes",
      "Use short repeated prayers as grounding ('Lord, have mercy')",
      "Schedule quiet time without performance expectations",
      "Learn your stress response and practice opposite action",
      "When anxious, regulate your body BEFORE trying to think differently"
    ],
    reflectionQuestions: [
      "How do you respond to stress—fight, flight, freeze?",
      "What helps your body calm most effectively?",
      "Do you try to think your way out of anxiety before calming your body?",
      "Can you sit in stillness, or does it feel threatening?"
    ],
    weeklyChallenge: "Practice the 'incense rhythm' daily: 5 minutes of slow breathing + a short repeated prayer + 5 minutes of silence. Track your anxiety levels before and after. Notice how regulation changes your capacity to receive truth.",
    scriptureReferences: [
      "Philippians 4:6–7 — Be anxious for nothing, but in prayer...",
      "Psalm 46:10 — Be still and know that I am God",
      "Revelation 8:3–4 — Prayers rising like incense"
    ],
    prayerPrompt: "Father, calm my nervous system. Teach me to be still. Help me regulate my body so my mind can receive Your truth. Let my prayers rise like incense—slow, steady, accepted. Speak to me in stillness. Amen."
  },
  {
    id: 7,
    week: "Week 7",
    name: "⚡ The Ark",
    sanctuaryMeaning: "Most Holy Place — Identity, Law, and Mental Rest.",
    mentalHealthPrinciple: "Mental peace comes from ordered identity. Sabbath is neurological, not optional. You are not what you produce.",
    teaching: `**IDENTITY, LAW, AND MENTAL REST**

The Ark of the Covenant represents the culmination—anchoring identity and reclaiming rest.

**Mental Peace Comes From Ordered Identity:**
Inside the ark was God's law—fixed, unchanging, reliable. Your identity needs the same anchor. When identity is rooted in Christ rather than performance, mental peace follows.

**Sabbath Is Neurological, Not Optional:**
The Sabbath command isn't arbitrary—it's how God designed the brain. Rest is not laziness; it's neurological necessity. A mind that never rests will never heal.

**You Are Not What You Produce:**
The mercy seat covered the ark. Your value isn't measured by output. You are covered by mercy, not evaluated by productivity.

**Inside the Ark:**
• The Law = boundaries, order, structure
• The Manna = daily trust, not future anxiety
• Aaron's Rod = proof you can grow again after death

**Above the Ark:**
• The Mercy Seat = God's presence covering everything`,
    biblicalFoundation: `Exodus 33:14 — "My presence shall go with thee, and I will give thee rest."

Hebrews 4:9–11 — "There remaineth therefore a rest to the people of God. For he that is entered into his rest, he also hath ceased from his own works..."

Isaiah 26:3 — "Thou wilt keep him in perfect peace, whose mind is stayed on thee."

The Most Holy Place was entered only once a year by the high priest. It was the place of ultimate intimacy, ultimate rest, ultimate identity. This is where mental health culminates—not in striving, but in resting under God's mercy.`,
    practicalSteps: [
      "Practice a weekly mental Sabbath: no striving, no fixing, no performance",
      "Define identity statements rooted in Christ, not productivity",
      "Set firm emotional boundaries that protect your peace",
      "Say daily: 'I am not what I produce. I am covered by mercy.'",
      "Rest without guilt—this is obedience, not laziness"
    ],
    reflectionQuestions: [
      "Where do you derive worth from—Christ or production?",
      "What does true rest look like for you?",
      "Can you rest without guilt?",
      "What boundaries do you need to set to protect mental peace?"
    ],
    weeklyChallenge: "Take one full mental Sabbath day this week: no striving, no fixing yourself, no productivity pressure. Practice receiving mercy instead of earning approval. At day's end, journal what rest felt like.",
    scriptureReferences: [
      "Exodus 33:14 — My presence shall go with thee and give thee rest",
      "Hebrews 4:9–11 — There remaineth a rest for the people of God",
      "Isaiah 26:3 — Perfect peace when the mind is stayed on God"
    ],
    prayerPrompt: "Lord, I rest under Your mercy seat. My identity is in You, not my production. Teach me to Sabbath—neurologically, emotionally, spiritually. I cease striving. I rest in Your presence. Amen."
  },
  {
    id: 8,
    week: "Week 8",
    name: "🧠 Living From the Sanctuary",
    sanctuaryMeaning: "Integration & Continuation — Living daily from the sanctuary pattern.",
    mentalHealthPrinciple: "Healing is maintained through rhythm. The sanctuary becomes a lifestyle. Christ ministers continually for the mind.",
    teaching: `**INTEGRATION & CONTINUATION**

This final week integrates everything into a sustainable lifestyle. The sanctuary pattern becomes how you live, not just what you learned.

**Healing Is Maintained Through Rhythm:**
One-time interventions don't create lasting change. The sanctuary services happened daily, weekly, yearly. Mental health is maintained through ongoing rhythms, not occasional intensity.

**The Sanctuary Becomes a Lifestyle:**
This isn't an 8-week program you complete and forget. This is a pattern for living. The altar, laver, table, candlestick, incense, and ark become your daily architecture.

**Christ Ministers Continually for the Mind:**
Hebrews 7:25 — Christ "ever liveth to make intercession." He doesn't stop ministering for your mental health. Your job is to remain in the pattern where He works.

**Your Personal Sanctuary Rhythm:**
• Daily: surrender (altar), cleansing (laver), nourishment (table), movement/light (candlestick), regulation (incense)
• Weekly: Sabbath rest (ark)
• Ongoing: community, accountability, honesty about regression`,
    biblicalFoundation: `Hebrews 10:19–22 — "Having therefore, brethren, boldness to enter into the holiest by the blood of Jesus... let us draw near with a true heart..."

Psalm 84:1–4 — "How amiable are thy tabernacles, O LORD of hosts! My soul longeth, yea, even fainteth for the courts of the LORD..."

John 15:4–5 — "Abide in me, and I in you. As the branch cannot bear fruit of itself, except it abide in the vine; no more can ye, except ye abide in me."

Abiding is the key. The sanctuary wasn't visited once—it was the center of ongoing life. Your mental health is maintained by remaining in the pattern, not by completing a course.`,
    practicalSteps: [
      "Build a personal 'sanctuary rhythm' for daily and weekly practice",
      "Identify warning signs of regression—know your red flags",
      "Commit to ongoing community and accountability",
      "Schedule quarterly check-ins on your mental health",
      "Share what you've learned with someone who needs it"
    ],
    reflectionQuestions: [
      "Which article impacted you most over these 8 weeks?",
      "How will you maintain this order long-term?",
      "What are your warning signs that you're drifting from the pattern?",
      "Who will hold you accountable to continue?"
    ],
    weeklyChallenge: "Create your written 'Sanctuary Rhythm'—a daily and weekly plan that incorporates all 6 articles. Share it with one accountability partner. Commit to practicing it for the next 90 days.",
    scriptureReferences: [
      "Hebrews 10:19–22 — Boldness to enter the holiest",
      "Psalm 84:1–4 — My soul longs for the courts of the LORD",
      "John 15:4–5 — Abide in me"
    ],
    prayerPrompt: "Lord, let the sanctuary become my lifestyle, not just my lesson. Help me maintain these rhythms. Keep me abiding in You. Thank You for ministering continually for my mind. I commit to the pattern. Amen."
  }
];

export const MENTAL_HEALTH_INTRO = {
  title: "The Sanctuary of the Mind",
  subtitle: "An 8-Week Biblical Journey Toward Mental & Emotional Healing",
  sanctuaryExplanation: `**"The Lord shall bless thee out of Zion: and thou shalt see the good of Jerusalem all the days of thy life."**
— Psalm 128:5
*(Zion = the sanctuary = the mind restored)*

## THE SANCTUARY FLOW (MEMORABLE PATTERN)

**Pain → Cleansing → Nourishment → Insight → Regulation → Rest**

This is how God heals the mind.

### The 8-Week Journey:

📐 **Week 1: The Pattern** — Understanding why God heals in order
🔥 **Week 2: The Altar** — Grief, surrender, naming pain
💧 **Week 3: The Laver** — Cleansing the thought life
🍞 **Week 4: The Table** — Nourishment, routine, community
🕯️ **Week 5: The Candlestick** — Insight, meaning, trauma awareness
🌸 **Week 6: The Incense Altar** — Regulation, breath, prayer
⚡ **Week 7: The Ark** — Identity, law, mental rest
🧠 **Week 8: Integration** — Living from the sanctuary pattern`,
  description: "Weight loss fails when people attack results instead of order. The same is true for mental health. God never reforms Israel's habits without first reforming the altar, laver, table, light, air, and rest. This 8-week journey follows God's sanctuary pattern for healing the mind—not symptom control, but architectural repair.",
  quote: "Know ye not that your body is the temple of the Holy Ghost… therefore glorify God in your body. — 1 Corinthians 6:19–20"
};
