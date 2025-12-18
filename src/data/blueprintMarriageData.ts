export interface SanctuaryArticle {
  id: number;
  name: string;
  principle: string;
  sanctuaryMeaning: string;
  marriagePrinciple: string;
  detailedTeaching: string;
  hardTruth: string;
  diagnosticQuestions: string[];
  reflectionQuestions: string[];
  coupleExercises: string[];
  scriptureReferences: string[];
  prayerPrompt: string;
}

export const SANCTUARY_MARRIAGE_ARTICLES: SanctuaryArticle[] = [
  {
    id: 1,
    name: "Altar of Sacrifice",
    principle: "Surrender Before Attraction",
    sanctuaryMeaning: "Outer Court | Where relationships either begin correctly or collapse later",
    marriagePrinciple: "Before God ever joins two people, He confronts the self. The altar is where self-centered desire dies, loneliness is surrendered, and identity is placed in God—not a partner.",
    detailedTeaching: `**What the Altar teaches about relationships**

Before God ever joins two people, He confronts the self.

**The altar is where:**

• Self-centered desire dies
• Loneliness is surrendered
• Lust is distinguished from love
• Identity is placed in God, not a partner

**Relationship Application:**

• **Singleness is not a waiting room**—it is a refining fire
• **Dating without surrender produces idolatry**
• **Attraction without sacrifice becomes consumption**

At the altar you sacrifice:
• Unrealistic expectations
• Lust-driven motives
• Flesh-driven impulses
• Past baggage you haven't surrendered
• Fear of commitment
• Dating just to date
• Seeking validation instead of covenant

**Dating begins with surrender.
Surrender prepares the heart for covenant.
No altar = no survival.**`,
    hardTruth: "If a person cannot surrender their appetites to God, they will not suddenly surrender them in marriage.",
    diagnosticQuestions: [
      "Am I dating to be completed, or to give?",
      "Do I want this person—or do I want relief from loneliness?",
      "Can I distinguish between attraction and idolatry?",
      "Is my identity secure in God, or am I looking for someone to define me?"
    ],
    reflectionQuestions: [
      "What unrealistic expectations am I carrying into dating?",
      "Am I dating for purpose or just for validation?",
      "What past wounds or soul-ties do I need to surrender before dating?",
      "Am I emotionally whole enough to enter a relationship?",
      "What flesh-driven motives need to die on this altar?"
    ],
    coupleExercises: [
      "Establish non-negotiables before dating—write them down and commit to them.",
      "Surrender timelines, pressure, and fear to God in prayer.",
      "Kill fantasy early—fantasy is covenant poison. Name your fantasies and release them.",
      "Write down 3 things you need to 'sacrifice' before entering or continuing this relationship.",
      "Pray individually: Ask God to reveal what needs to die before you can build something healthy."
    ],
    scriptureReferences: [
      "Romans 12:1 — 'Present your bodies a living sacrifice…'",
      "Matthew 6:33 — 'Seek first the Kingdom…'",
      "Genesis 2:18 — God provides companionship after purpose",
      "Song of Solomon 8:4 — 'Do not stir up love before its time'",
      "Galatians 5:24 — 'Those who are Christ's have crucified the flesh'"
    ],
    prayerPrompt: "Lord, I surrender everything that would sabotage covenant love. Kill my selfish motives, unrealistic expectations, and unhealed wounds. Let my identity rest in You—not in a relationship. Prepare my heart for covenant by teaching me to die to myself. Amen."
  },
  {
    id: 2,
    name: "The Laver",
    principle: "Cleansing, Healing, and Self-Examination",
    sanctuaryMeaning: "Outer Court | Where emotional health is addressed",
    marriagePrinciple: "The laver reflects your face. This is where patterns, baggage, and wounds are confronted. Marriage does not heal trauma—it exposes it.",
    detailedTeaching: `**What the Laver teaches about relationships**

The laver reflects your face.
This is where patterns, baggage, and wounds are confronted.

**Marriage does not heal trauma—it exposes it.**

**1. Self-Washing:**

• Emotional hygiene
• Therapy if needed
• Learning communication skills
• Identifying your triggers
• Becoming self-aware

A person who refuses the laver brings dirt into the relationship.

**2. Relationship-Washing:**

This is where two people look honestly at:
• Character and patterns
• Emotional health
• Anger issues
• Boundaries
• Compatibility
• Spiritual maturity

**Relationship Application:**

• Healing from past relationships
• Breaking cycles (abandonment, control, jealousy)
• Learning healthy communication and boundaries

Dating is not blind chemistry—it is sober clarity.
The laver is where you wash away illusions and see the truth.

**No laver = deception, fantasy, and hidden danger.**`,
    hardTruth: "Unwashed wounds bleed on innocent people.",
    diagnosticQuestions: [
      "What patterns repeat in my relationships?",
      "Am I expecting someone else to fix what God is asking me to face?",
      "What am I bringing into this relationship that needs healing?",
      "Am I seeing this person clearly, or through fantasy?"
    ],
    reflectionQuestions: [
      "What emotional 'dirt' am I carrying that I need to wash before dating?",
      "Have I done the work of therapy, healing, and self-awareness?",
      "Am I seeing this person clearly, or am I blinded by chemistry?",
      "What red flags have I been ignoring?",
      "What character traits do I need to honestly assess in myself and this person?"
    ],
    coupleExercises: [
      "Complete an emotional inventory before commitment—what patterns do you see?",
      "Pursue premarital counseling before engagement.",
      "Establish accountability and spiritual mentorship.",
      "Have a 'clean conversation': What are the difficult truths we need to address about our compatibility?",
      "Create a character assessment: Rate yourself and each other on key traits (honesty, patience, emotional health, spiritual maturity)."
    ],
    scriptureReferences: [
      "Exodus 30:17–21 — 'No service without washing'",
      "Lamentations 3:40 — 'Let us search and try our ways…'",
      "2 Corinthians 7:1 — 'Cleanse ourselves'",
      "Psalm 51:10 — 'Create in me a clean heart…'",
      "Psalm 139:23-24 — 'Search me, O God, and know my heart'"
    ],
    prayerPrompt: "Lord, wash me clean before I get close to someone else. Show me my blind spots, my triggers, my unhealed places. Give us both clarity to see each other honestly—not through fantasy, but through Your truth. Help me stop expecting a relationship to heal what only You can fix. Amen."
  },
  {
    id: 3,
    name: "Table of Shewbread",
    principle: "Provision, Friendship, and Daily Life",
    sanctuaryMeaning: "Holy Place | Where love becomes practical",
    marriagePrinciple: "Love is sustained by daily provision, not dramatic moments. The bread was consistent, shared, and replaced weekly. This is friendship, rhythm, and faithfulness.",
    detailedTeaching: `**What the Table teaches about relationships**

Love is sustained by daily provision, not dramatic moments.

The bread was:
• **Consistent**
• **Shared**
• **Replaced weekly**

This is friendship, rhythm, and faithfulness.

**Relationship Application:**

• **Compatibility in values, faith, and lifestyle**
• **Learning to do life together** (money, time, service)
• **Friendship before romance**

This is the "friendship phase" of dating—
the most ignored and most necessary part.

**Questions from the Table:**

• Can we talk for hours?
• Do we enjoy each other's presence?
• Are we spiritually aligned?
• Do we nourish each other or drain each other?
• Are we consistent, or is this a roller coaster?

**Bread before wine.
Friendship before romance.
Stability before passion.**

If you feed a relationship steadily, trust grows.
If you feed it junk (rush, feelings only, chaos), it starves.`,
    hardTruth: "Chemistry fades. Character feeds.",
    diagnosticQuestions: [
      "Can we pray together comfortably?",
      "Do we resolve conflict with respect?",
      "Does this relationship nourish or exhaust me?",
      "Are we building friendship or just riding feelings?"
    ],
    reflectionQuestions: [
      "Can we have deep, meaningful conversations for hours?",
      "Do we genuinely enjoy each other's company without physical attraction?",
      "Are we spiritually aligned and growing together?",
      "Does this relationship nourish me or drain me?",
      "Are we building a stable foundation or riding an emotional roller coaster?"
    ],
    coupleExercises: [
      "Date in community, not secrecy—let others see your relationship.",
      "Observe daily habits, not just special moments.",
      "Test consistency over time—don't rush to conclusions.",
      "Have a 'friendship date': Do something together that focuses on conversation and shared experience.",
      "Create a shared ritual: Establish one weekly consistent activity (coffee, walk, prayer time) that nourishes your connection."
    ],
    scriptureReferences: [
      "John 6:35 — 'I am the bread of life'",
      "Amos 3:3 — 'Can two walk together, except they be agreed?'",
      "Proverbs 27:17 — 'Iron sharpeneth iron'",
      "Ecclesiastes 9:9 — 'Enjoy life together'",
      "Proverbs 17:17 — 'A friend loves at all times'"
    ],
    prayerPrompt: "Lord, help us build a friendship that goes deeper than attraction. Teach us to nourish each other consistently with conversation, time, and shared life. Let stability form the foundation of what we're building. Guard us from rushing past friendship. Amen."
  },
  {
    id: 4,
    name: "Golden Candlestick",
    principle: "Vision, Direction, and Spiritual Leadership",
    sanctuaryMeaning: "Holy Place | Where purpose is clarified",
    marriagePrinciple: "Marriage is not just about love—it is about mission. The light reveals direction, calling, and spiritual alignment.",
    detailedTeaching: `**What the Candlestick teaches about relationships**

Marriage is not just about love—it is about mission.

**The light reveals:**
• Direction
• Calling
• Spiritual alignment

**Relationship Application:**

• **Shared vision for life and service**
• **Understanding gender roles biblically** (not culturally)
• **Spiritual leadership rooted in humility**

At this stage God gives light:
• Discernment and clarity
• Red flags revealed
• Character revelation
• Spiritual compatibility
• Purpose alignment
• Emotional maturity
• Long-term vision

**The candlestick stage asks:**

• Where is this relationship going?
• Are we progressing toward covenant or drifting?
• Is this person walking in the Spirit?
• Are we becoming better Christians because of each other?

This is where romantic attraction is tested by spiritual light.

Emotions can blind you, but the candlestick exposes everything.

**If God's Spirit dims your peace, don't ignore it.
If God's Spirit brightens your peace, move forward.**`,
    hardTruth: "Two sincere Christians can still be unequally yoked if their visions differ.",
    diagnosticQuestions: [
      "Where are we going spiritually—together?",
      "Does this relationship pull me closer to Christ or subtly replace Him?",
      "Are we aligned on calling, children, ministry, money, and Sabbath?",
      "Is God's Spirit giving me peace or warning me?"
    ],
    reflectionQuestions: [
      "Is God's Spirit giving me peace or warning me about this relationship?",
      "What red flags have been illuminated that I've been ignoring?",
      "Are we spiritually compatible, or am I hoping they'll change?",
      "Is this relationship making me a better Christian or pulling me away from God?",
      "Where is this relationship actually going—toward covenant or just drifting?"
    ],
    coupleExercises: [
      "Discuss calling, children, ministry, money, and Sabbath—get specific.",
      "Pray for clarity, not emotional confirmation.",
      "Let light expose incompatibility early—don't ignore it.",
      "Have a 'vision conversation': Where do each of you see this relationship going in 6 months, 1 year, 5 years?",
      "Create a spiritual alignment check: Discuss your beliefs, values, and spiritual practices. Are you walking in the same direction?"
    ],
    scriptureReferences: [
      "John 8:12 — 'I am the light of the world'",
      "Proverbs 29:18 — 'Without vision, people perish'",
      "Ephesians 5:21–33 — 'Mutual submission under Christ'",
      "Joshua 24:15 — 'As for me and my house…'",
      "Psalm 119:105 — 'Thy word is a lamp unto my feet'"
    ],
    prayerPrompt: "Lord, turn on the light. Show me clearly who this person really is. Illuminate any red flags, reveal their character, and give me discernment. If our visions are aligned, brighten my peace. If they're not, dim the flame. Help us see where we're going—together or apart. Amen."
  },
  {
    id: 5,
    name: "Altar of Incense",
    principle: "Prayer, Communication, and Intimacy",
    sanctuaryMeaning: "Holy Place | Where love deepens",
    marriagePrinciple: "True intimacy is spiritual before it is physical. Incense represents prayer, vulnerability, and ongoing communion.",
    detailedTeaching: `**What the Incense teaches about relationships**

True intimacy is spiritual before it is physical.

**Incense represents:**
• Prayer
• Vulnerability
• Ongoing communion

**Relationship Application:**

• **Praying together consistently**
• **Learning to speak and listen with grace**
• **Emotional intimacy guarded until covenant**

**1. Pray Together**

Not flesh-driven prayer—but covenant-forming prayer.
• Pray about your future
• Pray for each other's weaknesses
• Pray over fears
• Pray for clarity
• Pray for holiness

**2. Build Emotional Intimacy**

This is where you learn each other's:
• Dreams and wounds
• Fears and family patterns
• Love languages
• Emotional needs

**3. Protect Physical Boundaries**

Incense is aroma, not fire.

This is where couples learn:
**Emotional closeness without violating holiness.
Spiritual intimacy without premature physical intimacy.**

Too many couples get to the altar of incense and light the wrong fire.

**That fire belongs ONLY in the Most Holy Place—marriage.**

The incense stage prepares the atmosphere for covenant.`,
    hardTruth: "Physical intimacy before spiritual intimacy creates confusion, not closeness.",
    diagnosticQuestions: [
      "Can we pray honestly together?",
      "Do we bring problems to God or only to each other?",
      "Are we protecting the fire that belongs only in marriage?",
      "Is our intimacy building toward covenant or bypassing it?"
    ],
    reflectionQuestions: [
      "Are we praying together regularly about our future?",
      "Have we built deep emotional intimacy without crossing physical boundaries?",
      "Do we know each other's wounds, dreams, and fears?",
      "Are we protecting the 'fire' that belongs only in marriage?",
      "Is the atmosphere of our relationship holy, or are we compromising purity?"
    ],
    coupleExercises: [
      "Establish prayer as a couple—commit to praying together regularly.",
      "Set physical boundaries that protect clarity—write them down.",
      "Use prayer to resolve conflict, not weaponize Scripture.",
      "Share vulnerably: Each person shares one wound from their past and one dream for the future.",
      "Create an 'incense moment': Light a candle, pray together, and discuss how you're preparing for covenant."
    ],
    scriptureReferences: [
      "Psalm 141:2 — 'Let my prayer be set forth… as incense'",
      "Philippians 4:6–7 — 'Peace guards hearts and minds'",
      "1 Peter 3:7 — 'Prayers hindered by relational disorder'",
      "Hebrews 13:4 — 'Honor the marriage bed'",
      "1 Thessalonians 4:3-5 — 'God's will is your sanctification'"
    ],
    prayerPrompt: "Lord, teach us to build spiritual and emotional intimacy without violating Your boundaries. Help us pray together, know each other deeply, and protect the fire that belongs in marriage alone. Let our communion with You deepen our communion with each other. Amen."
  },
  {
    id: 6,
    name: "Ark of the Covenant",
    principle: "Marriage, Law, and Rest",
    sanctuaryMeaning: "Most Holy Place | Where covenant is sealed",
    marriagePrinciple: "Marriage is not a contract—it is a covenant before God. Inside the Ark: the Law (boundaries and faithfulness), the Manna (God's provision), the Rod (God's authority and order).",
    detailedTeaching: `**What the Ark teaches about marriage**

Marriage is not a contract—it is a covenant before God.

**Inside the Ark:**
• **The Law** — boundaries and faithfulness
• **The Manna** — God's provision
• **The Rod** — God's authority and order

**1. The Law — Covenant Boundaries**

Healthy marriage requires:
• Faithfulness and honesty
• Shared values
• Mutual submission
• Holiness and accountability
• Clear roles & responsibilities

The law doesn't restrict love—it protects it.

**2. The Manna — Daily Provision**

Marriage is not dramatic passion. It is daily provision:
• Daily kindness
• Daily communication
• Daily emotional nourishment
• Daily forgiveness

**3. Aaron's Rod — Growth & Resurrection**

The rod budded inside the ark—symbolizing that marriage brings:
• New life and intimacy
• Growth and miracles
• Restoration even after conflict

**4. The Mercy Seat — Forgiveness & Unconditional Love**

Every lasting marriage rests on:
• Mercy and grace
• Compassion and patience
• Covering each other
• Choosing forgiveness over revenge

**Above the law is mercy.
Above your spouse's mistakes is mercy.
Above your covenant is mercy.**

Mercy is the glory that fills the marriage.

**Relationship Application:**

• **Lifelong commitment**
• **Faithfulness when feelings fluctuate**
• **Sabbath rest as marital protection**`,
    hardTruth: "Marriage is not sustained by romance, but by covenant faithfulness.",
    diagnosticQuestions: [
      "Are we building on covenant or convenience?",
      "Do we practice daily provision—kindness, communication, forgiveness?",
      "Is our marriage anchored in identity, not just feeling?",
      "Are we resting together, or is busyness destroying our connection?"
    ],
    reflectionQuestions: [
      "Are we building our marriage on God's law (boundaries) or just feelings?",
      "Do we practice daily provision—kindness, communication, forgiveness?",
      "What 'dead thing' in our marriage needs resurrection through God's power?",
      "Are we covering each other with mercy, or keeping score?",
      "Is God's glory dwelling in our home, or have we made marriage about us instead of Him?"
    ],
    coupleExercises: [
      "Honor Sabbath rest as a couple—protect time for each other.",
      "Protect the marriage from overwork and intrusion.",
      "Anchor identity in covenant, not conflict.",
      "Write your marriage 'law': 3-5 non-negotiable boundaries/values you both commit to.",
      "Practice daily provision: Each day this week, give one act of kindness, one word of affirmation, and one moment of forgiveness."
    ],
    scriptureReferences: [
      "Genesis 2:24 — 'One flesh'",
      "Malachi 2:14–16 — 'Covenant, not convenience'",
      "Hebrews 13:5 — 'God's abiding presence'",
      "Ecclesiastes 4:12 — 'Threefold cord'",
      "Ephesians 5:25-33 — 'Husbands love your wives as Christ loved the church'"
    ],
    prayerPrompt: "Father, we enter the Most Holy Place of marriage with reverence. Help us keep Your law, extend mercy daily, trust Your provision, and believe You can resurrect what feels dead. Fill our marriage with Your glory. Anchor us in covenant, not convenience. Amen."
  }
];

export const MARRIAGE_BLUEPRINT_INTRO = {
  title: "The Sanctuary Pathway to Covenant",
  subtitle: "A Biblical Blueprint for Dating, Courtship, and Marriage",
  quote: {
    text: "Dating begins with surrender. Surrender prepares the heart for covenant. No altar = no survival.",
    source: "Sanctuary Principle"
  },
  description: `Just as Israel approached God progressively,
couples must approach marriage in order—with reverence, discernment, and maturity.

Skipping parts of the sanctuary always leads to disaster.
Following the pattern always leads to covenant glory.

"Except the LORD build the house, they labour in vain that build it."
— Psalm 127:1`,
  sanctuaryExplanation: `## Understanding the Sanctuary Pathway to Covenant

In the Old Testament, God gave Moses a detailed pattern for the sanctuary (Exodus 25:8-9)—a sacred tent where God's presence would dwell among His people. This wasn't just a building; it was a divine blueprint showing humanity how to approach a holy God and walk through life's most sacred relationships.

### The Six Articles of Furniture

The sanctuary contained six primary articles of furniture, arranged in a specific progressive order from the outer court to the Most Holy Place:

🔥 **1. Altar of Sacrifice** (Outer Court)  
Surrender before attraction. Where self-centered desire dies and identity is placed in God.  
📖 *Key Scripture:* Romans 12:1 — "Present your bodies a living sacrifice…"

💧 **2. The Laver** (Outer Court)  
Cleansing, healing, and self-examination. Where patterns, baggage, and wounds are confronted.  
📖 *Key Scripture:* Psalm 51:10 — "Create in me a clean heart…"

🍞 **3. Table of Shewbread** (Holy Place)  
Provision, friendship, and daily life. Where love becomes practical through consistency.  
📖 *Key Scripture:* Amos 3:3 — "Can two walk together, except they be agreed?"

🕯️ **4. Golden Candlestick** (Holy Place)  
Vision, direction, and spiritual leadership. Where purpose is clarified.  
📖 *Key Scripture:* Proverbs 29:18 — "Without vision, people perish"

🌸 **5. Altar of Incense** (Holy Place)  
Prayer, communication, and intimacy. Where love deepens spiritually before physically.  
📖 *Key Scripture:* Psalm 141:2 — "Let my prayer be set forth… as incense"

⚡ **6. Ark of the Covenant** (Most Holy Place)  
Marriage, law, and rest. Where covenant is sealed before God.  
📖 *Key Scripture:* Genesis 2:24 — "Therefore shall a man leave… and they shall be one flesh"

---

### The Sanctuary Flow for Dating → Marriage

**Surrender → Healing → Friendship → Vision → Prayer → Covenant**

Or more specifically:

• **Altar:** I surrender my desires to God
• **Laver:** I allow God to heal and cleanse me
• **Table:** I learn to walk daily with another
• **Candlestick:** We discern direction and calling
• **Incense:** We deepen intimacy through prayer
• **Ark:** We enter covenant before God

---

### Why Order Matters

The sanctuary principles for relationships follow a progressive order. Each station builds upon the previous one:

**Skip the Altar** → You date from need, not calling—relationships become idols

**Skip the Laver** → Unwashed wounds bleed on innocent people

**Skip the Table** → You build on chemistry instead of friendship—it won't last

**Skip the Candlestick** → You marry someone whose vision differs from yours

**Skip the Incense** → You have physical intimacy without spiritual intimacy—confusion

**Skip the Ark** → Marriage becomes a contract instead of a covenant

God does not rush people into covenant. He prepares them.

**The sanctuary proves that love is built, not fallen into.**`
};
