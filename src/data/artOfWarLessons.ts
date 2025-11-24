// Lessons from "The Art of War: An Unconventional Book for an Unconventional War"

export interface DojoLesson {
  id: string;
  chapter: number;
  title: string;
  subtitle?: string;
  description: string;
  keyPoints: string[];
  scriptureReferences: string[];
  practicalApplication: string;
  reflectionQuestions: string[];
  warriorCharacteristics?: string[];
}

export const DOJO_LESSONS: DojoLesson[] = [
  {
    id: "holy-war",
    chapter: 1,
    title: "Holy War",
    subtitle: "Understanding the True Battle - The Most Psychologically Demanding War",
    description: "September 11, 2001 awakened America to jihad—holy war from external enemies. But there exists a far more deadly holy war being waged against every person on this planet. The stakes are eternal, the enemy closer than your best friend. It is the war against self—your own carnal nature in alliance with Satan. This is the greatest battle humanity will ever face.",
    keyPoints: [
      "We wrestle not against flesh and blood, but against principalities, powers, rulers of darkness, and spiritual wickedness in high places (Ephesians 6:12)",
      "Self is your personal terrorist with 24/7 access to your mind, thoughts, weaknesses, and deepest vulnerabilities",
      "All external warfare—broken relationships, church conflicts, family strife—results from poorly fought internal warfare (James 4:1)",
      "There can be no treaty, no peaceful coexistence with self. One must die that the other may live",
      "To lose this war is to lose everlasting life. To win will cost everything",
      "How does one fight an enemy who is closer than the best of friends? How does one engage in combat against an enemy who hides within?",
      "The Bible reveals our true enemy: principalities, powers, rulers of darkness, spiritual wickedness—yet self is in alliance with these forces",
      "Jihad means 'holy struggle'—our Christian jihad is the struggle against the carnal mind, which is enmity against God"
    ],
    scriptureReferences: [
      "Ephesians 6:12",
      "1 Peter 2:11 - Abstain from fleshly lusts which war against the soul",
      "Ephesians 4:22 - Put off the old man which is corrupt",
      "James 4:1 - Wars and fightings come from lusts that war in your members",
      "Revelation 12:12 - The devil has come down with great wrath",
      "Romans 7:23 - I see another law warring against the law of my mind",
      "Galatians 5:17 - The flesh lusts against the Spirit, and the Spirit against the flesh",
      "Romans 8:6-7 - The carnal mind is enmity against God"
    ],
    practicalApplication: "Today, stop blaming external circumstances or people for your struggles. Make a list of three recent conflicts or frustrations. For each one, ask: 'What aspect of SELF was fighting for control here?' Identify whether it was pride, anger, lust, greed, or another manifestation of self. Then, instead of trying to change others or circumstances, declare war on that specific internal enemy. Write a one-sentence declaration: 'I declare war on [specific aspect of self] today, by God's grace.'",
    reflectionQuestions: [
      "What recurring sin patterns reveal where 'self' is currently winning battles in my life?",
      "Am I treating sin as a minor inconvenience to manage, or as a deadly enemy to destroy?",
      "Where am I harboring and protecting 'self' instead of containing and destroying it?",
      "Do I truly believe that the war within me is more dangerous than any external threat?",
      "When was the last time I consciously engaged in holy war against my own carnal nature?",
      "How would my relationships change if I won the internal battles before they became external conflicts?",
      "Am I willing to pay the cost of winning this war—which is everything I have and am?"
    ],
    warriorCharacteristics: ["self-awareness", "honesty", "courage", "spiritual-vision"]
  },
  {
    id: "underestimating-enemy",
    chapter: 1,
    title: "Know Thy Enemy",
    subtitle: "The Fatal Mistake—Underestimating Self",
    description: "The most fatal mistake in warfare is underestimating your opponent. Post-9/11, America learned this painful lesson. Christians today make the same deadly error with self. We think, 'I would never do THAT.' But self is capable of ANYTHING. The moment you say 'I could never,' you have harbored the terrorist and given it sanctuary. Underestimation is how self survives and eventually destroys.",
    keyPoints: [
      "Self is capable of ANYTHING—there are NO limits to its wickedness. If David could commit adultery and murder, if Peter could deny Christ, YOU can too",
      "The carnal mind is enmity (hatred, hostility, warfare) against God and CANNOT be subject to His law (Romans 8:6-7)",
      "Self is a relentless traitor, constantly working with Satan, plotting 24/7 to lure you into danger and destruction",
      "Temptation is your early warning system that self is launching an offensive. Never ignore the sirens",
      "The heart is deceitful above all things and desperately wicked—who can know it? (Jeremiah 17:9)",
      "Self will use your strengths against you. Your spiritual gifts, talents, and victories become Satan's ammunition",
      "Every thought of 'I would never' creates a blind spot that self will exploit",
      "The greatest saints had the deepest understanding of their own potential for evil"
    ],
    scriptureReferences: [
      "Romans 8:6-7 - The carnal mind is enmity against God",
      "Jeremiah 17:9 - The heart is deceitful above all things",
      "Genesis 6:5 - Every imagination of the thoughts of man's heart was only evil continually",
      "Mark 7:21-23 - Out of the heart proceed evil thoughts, murders, adulteries",
      "Proverbs 28:26 - He that trusts in his own heart is a fool",
      "1 Corinthians 10:12 - Let him who thinks he stands take heed lest he fall",
      "Galatians 6:1 - Considering yourself, lest you also be tempted",
      "Matthew 26:41 - The spirit is willing but the flesh is weak"
    ],
    practicalApplication: "Write down three thoughts you've had recently that you'd be ashamed for anyone to know. This exercise reveals self's true nature operating beneath the surface. Then write three statements that start with 'I would never...' For each one, replace it with: 'Without God's grace, I am capable of anything, including [that sin].' This destroys self's hiding places. Finally, ask God to show you which of your strengths self might try to weaponize against you.",
    reflectionQuestions: [
      "What thoughts have crossed my mind that reveal self's true wickedness beneath my 'Christian' exterior?",
      "Am I underestimating how far self will go to satisfy its desires? What evidence suggests this?",
      "Do I view temptation as a warning system or as something I can 'handle' on my own?",
      "Which 'I would never' statements am I making that could be creating dangerous blind spots?",
      "Have I ever been shocked by my own thoughts, words, or actions? What does that reveal about self?",
      "How quickly do I respond to temptation's early warnings, or do I linger and rationalize?",
      "Am I spiritually 'asleep' like the disciples in Gethsemane, unaware of the danger I'm in?"
    ],
    warriorCharacteristics: ["vigilance", "honesty", "humility", "realism", "alertness"]
  },
  {
    id: "declaration-of-war",
    chapter: 2,
    title: "Declaration of War",
    subtitle: "From Civilian to Soldier—No Longer Optional",
    description: "There comes a defining moment when a nation under attack must formally declare war to mobilize resources and survive. Many Christians have never made this decided declaration of war against self. They remain spiritual civilians—surprised by trials, shocked by temptations, and confused about their identity. This refusal to declare war allows self to strengthen, entrench, and eventually wreak havoc. You cannot fight effectively what you have never officially declared war against.",
    keyPoints: [
      "Refusal to declare war on self results in wars with others. Your internal civil war becomes external collateral damage (James 4:1)",
      "Christians cannot remain civilians—we are CALLED to be soldiers. Paul says: 'Endure hardship as a good soldier of Jesus Christ' (2 Timothy 2:3-4)",
      "A soldier EXPECTS hardship, trial, and warfare. A civilian is SURPRISED and offended by it",
      "Soldiers don't entangle themselves with civilian affairs—they have singular focus and mission clarity",
      "Warriors view themselves as HUNTERS, not victims or the hunted. Mindset determines outcome",
      "A declaration is public, formal, binding. It's not a private wish—it's an irrevocable commitment",
      "Without declaration, you fight halfheartedly, retreat easily, and negotiate with the enemy",
      "The moment of declaration is the moment you stop making excuses and start taking responsibility"
    ],
    scriptureReferences: [
      "2 Timothy 2:3-4 - Endure hardship as a good soldier; no soldier entangles himself with civilian affairs",
      "1 Timothy 6:12 - Fight the good fight of faith",
      "James 1:12 - Blessed is the man who endures temptation",
      "1 Peter 4:12-13 - Don't think it strange concerning fiery trials",
      "Luke 14:31-32 - A king going to war considers whether he's able",
      "Hebrews 10:32 - Remember the former days when you endured a great struggle",
      "Philippians 1:30 - You have the same conflict which you saw in me",
      "1 Corinthians 9:26 - I do not fight as one beating the air"
    ],
    practicalApplication: "Make a formal, written Declaration of War today. Use this template or create your own: 'I, [your full name], do hereby declare TOTAL and UNCONDITIONAL war against my carnal nature and all its manifestations. I will no longer harbor self, protect self, make excuses for self, or negotiate with self. By God's grace, I am a SOLDIER, not a civilian. I expect trials. I anticipate battles. I embrace hardship as proof that I am in the fight. From this day forward, I am a hunter of righteousness, not the hunted prey of temptation. Signed: [Your Name], Date: [Today's Date].' Post this where you'll see it daily. Read it aloud when tempted.",
    reflectionQuestions: [
      "Have I truly declared war on self, or am I still playing spiritual civilian—hoping for comfort and ease?",
      "When trials come, do I respond like a soldier (this is expected) or a civilian (why is this happening to me)?",
      "Am I viewing myself as a victim of circumstances, or as a warrior engaged in purposeful combat?",
      "What 'civilian affairs' am I still entangled in that are compromising my spiritual warfare effectiveness?",
      "Do I have a clear sense of mission, or am I just drifting through Christian life without focus?",
      "What would change in my life if I truly saw every temptation as an opportunity to prove my soldier status?",
      "Am I willing to publicly declare this war, or do I want to keep my options open for retreat?"
    ],
    warriorCharacteristics: ["decisiveness", "commitment", "soldier-mindset", "responsibility", "courage"]
  },
  {
    id: "divine-objective",
    chapter: 2,
    title: "Divine Objective",
    subtitle: "Contain and Destroy—The Two-Fold Mission",
    description: "Every successful war campaign requires a clear, measurable objective. The divine objective in holy war against self is precise and uncompromising: CONTAIN self (prevent internal warfare from becoming external sin) and DESTROY self (eliminate the carnal mind entirely). Half-measures and partial victories are meaningless. Self must be both contained and destroyed, or the war is lost.",
    keyPoints: [
      "CONTAIN: Keep the battle INTERNAL. Don't let self 'get out' through sinful words, actions, or attitudes. Containment prevents collateral damage",
      "DESTROY: Win the battle WITHIN. Eliminate angry thoughts, not just angry words. Destroy lustful imagination, not just lustful actions",
      "External sin is the visible proof of failed internal containment. When self 'gets out,' containment has already been breached",
      "True victory requires BOTH containment AND destruction working simultaneously. Containment without destruction is management. Destruction without containment causes chaos",
      "Jesus' teaching in Matthew 5 sets the standard: don't just avoid murder—destroy anger. Don't just avoid adultery—destroy lust",
      "The battlefield is the MIND. Whoever controls the thought life controls the war",
      "Containment is defensive warfare (guarding the heart). Destruction is offensive warfare (taking thoughts captive)",
      "Every temptation is an opportunity to practice both skills: contain the impulse, then destroy the desire"
    ],
    scriptureReferences: [
      "Matthew 5:28 - Whoever looks on a woman to lust has already committed adultery in his heart",
      "Proverbs 4:23 - Keep your heart with all diligence, for out of it are the issues of life",
      "2 Corinthians 10:5 - Casting down imaginations and bringing every thought into captivity",
      "James 1:14-15 - When desire has conceived, it brings forth sin; sin when finished brings death",
      "Romans 12:2 - Be transformed by the renewing of your mind",
      "Philippians 4:8 - Think on these things: whatever is true, noble, just, pure, lovely",
      "Colossians 3:5 - Put to death your members which are on the earth",
      "Matthew 5:29-30 - If your eye causes you to sin, pluck it out"
    ],
    practicalApplication: "Choose one recurring temptation you face. Create a two-phase battle plan: PHASE 1 (Containment): Write down three practical ways you will CONTAIN this battle internally when tempted (e.g., if tempted to gossip: leave the room, change the subject, pray silently). PHASE 2 (Destruction): Write down three ways you will DESTROY the desire at its root (e.g., pray for the person you want to gossip about, memorize James 3:5-10, ask God why you feel the need to tear others down). Practice both phases the next time temptation strikes. Journal the results: Did I successfully contain? Did I work toward destruction?",
    reflectionQuestions: [
      "Where is self consistently 'getting out' through my words, actions, or attitudes? This reveals containment failures",
      "Am I winning the internal battle, or am I just successfully avoiding external manifestations while harboring sin internally?",
      "What specific thought patterns need to be DESTROYED, not just managed or contained?",
      "Do I treat Jesus' standard in Matthew 5 as impossible idealism, or as the actual target for victory?",
      "How much of my spiritual warfare is defensive (containment) versus offensive (destruction)?",
      "What would total victory look like in my most persistent area of temptation—both containment AND destruction?",
      "Am I satisfied with behavior modification, or am I pursuing heart transformation?"
    ],
    warriorCharacteristics: ["self-control", "internal-focus", "thoroughness", "mind-mastery", "persistence"]
  },
  {
    id: "righteous-anger",
    chapter: 3,
    title: "Be Ye Angry",
    subtitle: "The Fuel of Holy War",
    description: "The devil is angry (Rev 12:12). His angels are angry (Rev 11:18). Christians are also called to be angry—but with righteous indignation. Holy anger is the fuel of holy war.",
    keyPoints: [
      "Anger moved Jesus from His throne to come to earth",
      "God's wrath against sin is the pattern for our wrath against self",
      "Righteous anger is directed at sin, not people",
      "This holy anger must be under God's control, not self's"
    ],
    scriptureReferences: [
      "Ephesians 4:26",
      "Psalm 18:2-9",
      "Isaiah 59:16-17",
      "Revelation 12:12"
    ],
    practicalApplication: "Ask God for holy anger at your own sin. When you're tempted, don't be passive—be angry that self is trying to betray Christ. Channel that anger into spiritual warfare, not carnal reactions.",
    reflectionQuestions: [
      "Am I more angry at others' sins than my own?",
      "Does sin grieve me, or have I become comfortable with it?",
      "Can I distinguish between righteous anger (at sin) and sinful anger (at people)?"
    ],
    warriorCharacteristics: ["holy-anger", "passion", "zeal"]
  },
  {
    id: "mighty-men",
    chapter: 3,
    title: "Mighty Men of War",
    subtitle: "Characteristics of God's Warriors",
    description: "1 Chronicles 12 describes David's mighty men—warriors ready for battle. These characteristics define what God seeks in His holy warriors today.",
    keyPoints: [
      "EXPERT IN WAR: Mastery requires time, study, and practice",
      "ALL INSTRUMENTS OF WAR: Skilled in using every spiritual weapon (Eph 6:10-17)",
      "KEEP RANK: Unity, staying in line, advancing together",
      "NOT OF DOUBLE HEART: Single-minded, not fickle, unwavering focus",
      "MEN OF MIGHT: Depending on God's power, not their own",
      "FACES LIKE LIONS: Courageous, bold as lions (Proverbs 28:1)",
      "SWIFT AS ROES: Agile, able to keep footing on difficult terrain"
    ],
    scriptureReferences: [
      "1 Chronicles 12:8-33",
      "1 Corinthians 9:25",
      "Ephesians 6:10-17",
      "Proverbs 28:1",
      "Jude 24"
    ],
    practicalApplication: "Choose one characteristic to develop this week. If choosing 'expert in war,' study one spiritual weapon daily. If choosing 'faces like lions,' practice bold obedience in one area where you've been timid.",
    reflectionQuestions: [
      "Which of the seven characteristics is my weakest?",
      "Am I studying the art of spiritual warfare, or just hoping to survive?",
      "Where do I need to 'keep rank' better with fellow believers?"
    ],
    warriorCharacteristics: ["expertise", "boldness", "unity", "agility", "focus"]
  },
  {
    id: "spirit-of-war",
    chapter: 4,
    title: "The Spirit of War",
    subtitle: "Nine Fruits, Infinite Combinations—The Code to Every Victory",
    description: "The Spirit of God produces nine fruits (Galatians 5:22-23): Love, Joy, Peace, Patience, Kindness, Goodness, Faithfulness, Gentleness, Self-Control. These are not merely Christian virtues to admire—they are the COMBINATIONS or CODES that unlock victory over every single temptation you will ever face. Like a master lock with nine tumblers, each temptation requires a specific combination of fruits to escape. Master these nine, and you master righteousness itself.",
    keyPoints: [
      "The nine fruits are: Love, Joy, Peace, Patience (Longsuffering), Kindness (Gentleness), Goodness, Faithfulness (Faith), Gentleness (Meekness), Self-Control (Temperance)",
      "Every temptation has a specific 'code'—a unique combination of fruits that provides the way of escape promised in 1 Cor 10:13",
      "Failure or weakness in one or more fruits creates a 'weak spot' that self and Satan can exploit to bring you down",
      "These fruits are not produced by human effort but by yielding to the Holy Spirit. Trying to manufacture them in your own strength leads to hypocrisy",
      "The nine fruits are the OPPOSITE of the works of the flesh (Galatians 5:19-21). They are the antidote, the cure, the counter-weapon",
      "Mastery of these nine spirits is mastery of the entire battlefield. They are your complete spiritual arsenal",
      "Each fruit represents a different dimension of Christlikeness. Together they form the full character of Jesus",
      "The fruits work in combination—rarely does one fruit alone solve a temptation. You need multiple fruits working together"
    ],
    scriptureReferences: [
      "Galatians 5:22-23 - The fruit of the Spirit is love, joy, peace...",
      "Galatians 5:16-17 - Walk in the Spirit and you shall not fulfill the lust of the flesh",
      "1 Corinthians 10:13 - God will make a way of escape with every temptation",
      "John 15:4-5 - Abide in me and I in you. Without me you can do nothing",
      "John 15:13-14 - No greater love than to lay down one's life",
      "Romans 8:5-6 - Those who live according to the Spirit set their minds on the Spirit",
      "Ephesians 5:9 - The fruit of the Spirit is in all goodness, righteousness, and truth",
      "2 Peter 1:5-7 - Add to your faith virtue, knowledge, self-control, perseverance, godliness"
    ],
    practicalApplication: "Today, practice 'code-breaking' with your temptations. When facing ANY temptation, PAUSE and ask: 'Which fruits do I need right now?' Don't guess—analyze the temptation carefully. Examples: Tempted to gossip? CODE = Love (for the person) + Self-Control (over your tongue) + Kindness (choosing gentleness). Tempted to quit when ministry is hard? CODE = Joy (finding delight in obedience) + Faithfulness (staying committed) + Patience (enduring difficulty). Keep a 'Code Journal' for one week. Write down each major temptation and identify the fruit-combination needed to defeat it. You'll discover patterns in your weaknesses.",
    reflectionQuestions: [
      "Which of the nine fruits is my greatest current weakness? (This is where self will attack)",
      "Can I identify the specific 'code' for my three most common temptations?",
      "Am I relying on God's Spirit to produce these fruits, or am I trying to manufacture them through willpower and self-improvement?",
      "Do I see the fruits as personality traits to develop, or as Spirit-empowered weapons to wield?",
      "Which fruit do I most consistently ignore or undervalue in spiritual warfare?",
      "When was the last time I consciously deployed a specific fruit against a specific temptation?",
      "Am I abiding in Christ (John 15) in a way that naturally produces these fruits, or am I trying to produce them while disconnected from the Vine?"
    ],
    warriorCharacteristics: ["discernment", "spirit-reliance", "fruit-mastery", "analysis", "strategy"]
  },
  {
    id: "love",
    chapter: 4,
    title: "The Spirit of Love",
    subtitle: "The Foundation of All Warfare—Agape, The Unconquerable Force",
    description: "Love is the first and greatest fruit because without it, all other fruits are meaningless (1 Cor 13:1-3). In spiritual warfare, love is not a soft sentiment—it is the most powerful force in the universe. True Christian warriors must possess three dimensions of love: love for their Master (Jesus Christ), love for their country (the Kingdom of Heaven), and love for righteousness itself. Love gives you something worth fighting for—and Someone worth dying for.",
    keyPoints: [
      "Love (Agape) is willing to give ALL, even life itself. 'Greater love has no man than this, that a man lay down his life' (John 15:13)",
      "Love for Jesus motivates us to crucify self rather than betray Him. Every sin is a betrayal of the One who died for us",
      "Love for righteousness makes us emotionally CONNECTED to holiness, not just intellectually convinced of it",
      "Without love, there is no desire to stand, no motivation to fight, no reason to endure",
      "Love is the ONLY force stronger than self's desires. When you love Christ more than comfort, victory becomes possible",
      "Many waters cannot quench love, neither can floods drown it (Song of Solomon 8:7). Love makes you unconquerable",
      "Love is patient and kind, but it is also fierce—jealous for God's glory and intolerant of sin",
      "Jesus' love for you is the SOURCE. You can only love Him because He first loved you (1 John 4:19)"
    ],
    scriptureReferences: [
      "Song of Solomon 8:7 - Many waters cannot quench love, floods cannot drown it",
      "John 15:13-14 - Greater love has no one than to lay down his life for his friends",
      "Hebrews 1:9 - You have loved righteousness and hated lawlessness",
      "1 John 4:19 - We love Him because He first loved us",
      "Matthew 22:37-38 - Love the Lord with all your heart, soul, and mind",
      "1 Corinthians 13:1-3 - Without love, I am nothing",
      "Romans 5:5 - The love of God has been poured out in our hearts by the Holy Spirit",
      "John 14:15 - If you love Me, keep My commandments",
      "Revelation 2:4 - You have left your first love"
    ],
    practicalApplication: "Spend 30 minutes today in deliberate meditation on Christ's love for YOU. Read the crucifixion account slowly (Matthew 27, Mark 15, Luke 23, or John 19). Picture each detail: the mocking, the beating, the nails, the crown of thorns, the cry of abandonment. This was love. Then pray: 'Lord Jesus, transfer that love into MY heart. Give me love for You that is stronger than my love for comfort, pleasure, approval, or ease. Give me love for righteousness—not just intellectual agreement, but emotional passion. Make me LOVE what You love and HATE what You hate.' Journal your reflections. Return to this meditation whenever temptation seems overwhelming.",
    reflectionQuestions: [
      "Do I love Jesus enough to die to self—not just theoretically, but practically, daily?",
      "Is righteousness my burden (something I have to do) or my delight (something I love to do)?",
      "What would I be willing to sacrifice for the Kingdom of Heaven? Does my calendar and bank account reflect that?",
      "When was the last time I wept over my own sin because of how it grieves the One who loves me?",
      "Do I have a FIRST love relationship with Jesus, or has He become one among many loves?",
      "Can I honestly say I love righteousness and HATE lawlessness, or am I comfortable with both?",
      "Where is my love for comfort, success, or approval competing with my love for Christ?"
    ],
    warriorCharacteristics: ["love", "loyalty", "devotion", "passion", "sacrifice"]
  },
  {
    id: "joy",
    chapter: 4,
    title: "The Joy of War",
    subtitle: "Fighting with Delight",
    description: "Joy transforms duty into delight. Without joy, spiritual warfare becomes a burden. With it, even the hardest sacrifices become easy. Warriors must not only fight—they must enjoy it.",
    keyPoints: [
      "Joy is what enabled Jesus to endure the cross (Hebrews 12:2)",
      "We struggle to do what is a burden; we love to do what brings joy",
      "Count trials as joy because they refine you (James 1:2-4)",
      "Righteousness must be our hobby, not just our mission"
    ],
    scriptureReferences: [
      "Hebrews 12:2",
      "James 1:2-4",
      "Matthew 13:44",
      "Isaiah 61:3",
      "Romans 8:28"
    ],
    practicalApplication: "Find joy in one act of self-crucifixion today. When denying self, don't do it grudgingly—do it with gladness, knowing you're becoming more like Christ. Practice the 'joy reframe': instead of 'I have to,' say 'I get to.'",
    reflectionQuestions: [
      "Do I find joy in obeying God, or is it just obligation?",
      "What would change if I saw spiritual warfare as my highest pleasure?",
      "Can I rejoice in trials, seeing them as opportunities to grow stronger?"
    ],
    warriorCharacteristics: ["joy", "delight", "gladness"]
  },
  {
    id: "peace",
    chapter: 4,
    title: "Know War, Know Peace",
    subtitle: "Peace Through Battle, Not Avoidance",
    description: "True peace is not the absence of conflict—it's the presence of God in the midst of battle. There can be no lasting peace without holy war against self.",
    keyPoints: [
      "No war means no peace; know war means know peace",
      "Peace is not comfort or ease—it's tranquility in the storm",
      "Internal peace comes from winning internal battles",
      "God's peace guards hearts and minds during warfare (Philippians 4:7)"
    ],
    scriptureReferences: [
      "Philippians 4:6-7",
      "Isaiah 26:3",
      "John 14:27",
      "Romans 5:1"
    ],
    practicalApplication: "Instead of avoiding conflict (with self), engage it with peace as your weapon. When anxious, don't seek escape—practice warring against anxiety with prayer and thanksgiving (Phil 4:6-7).",
    reflectionQuestions: [
      "Am I seeking peace through avoidance or through victory?",
      "Do I have internal peace, even when external circumstances are chaotic?",
      "Where am I choosing comfort over the hard peace that comes through warfare?"
    ],
    warriorCharacteristics: ["peace", "composure", "steadfastness"]
  },
  {
    id: "patience",
    chapter: 4,
    title: "The Spirit of Patience",
    subtitle: "Endurance in Long Warfare",
    description: "Patience (longsuffering) is the ability to endure trials without breaking, complaining, or giving up. It's not passive waiting—it's active endurance under fire.",
    keyPoints: [
      "Patience is the ability to suffer long without giving in",
      "Testing produces patience, which produces maturity (James 1:3-4)",
      "Warriors outlast temptation rather than surrender to it",
      "Patience is faith stretched over time"
    ],
    scriptureReferences: [
      "James 1:3-4",
      "Hebrews 10:36",
      "Romans 5:3-4",
      "Galatians 6:9"
    ],
    practicalApplication: "Identify one area where you tend to give up quickly. Today, when faced with that temptation or trial, commit to outlasting it. Set a timer for 15 minutes and pray through the desire without giving in.",
    reflectionQuestions: [
      "Where do I tend to quit too early in spiritual battles?",
      "Am I willing to endure discomfort for righteousness' sake?",
      "Do I believe God will provide escape if I just wait patiently?"
    ],
    warriorCharacteristics: ["patience", "endurance", "perseverance"]
  },
  {
    id: "kindness-goodness",
    chapter: 4,
    title: "Kindness, Goodness & Gentleness",
    subtitle: "The Gracious Warrior",
    description: "Strength without grace creates tyrants. Warriors must combine courage with kindness, power with gentleness, and victory with goodness.",
    keyPoints: [
      "Kindness disarms enemies (Romans 12:20—heaping coals)",
      "Goodness is moral excellence in action, not just intention",
      "Gentleness is not weakness—it's strength under control",
      "These fruits make the warrior like Christ: powerful yet tender"
    ],
    scriptureReferences: [
      "Romans 12:20-21",
      "Colossians 3:12",
      "2 Timothy 2:24-25",
      "Matthew 5:5"
    ],
    practicalApplication: "Practice 'strength under control' today. When someone wrongs you, respond with deliberate kindness. When you have power to retaliate, choose goodness instead. Let gentleness be your weapon.",
    reflectionQuestions: [
      "Do I mistake gentleness for weakness?",
      "Can I show kindness to those who have hurt me?",
      "Is my goodness just talk, or is it visible in my actions?"
    ],
    warriorCharacteristics: ["kindness", "goodness", "gentleness", "grace"]
  },
  {
    id: "faithfulness-self-control",
    chapter: 4,
    title: "Faithfulness & Self-Control",
    subtitle: "The Closing Combination",
    description: "Faithfulness is loyal devotion that persists. Self-control (temperance) is mastery over desires. Together they complete the nine-fruit arsenal.",
    keyPoints: [
      "Faithfulness keeps you in the fight when feelings fade",
      "Self-control is the ultimate defeat of self—mastery over your own impulses",
      "Without self-control, no other fruit can be maintained",
      "Temperance means moderation, discipline, and restraint in all things"
    ],
    scriptureReferences: [
      "1 Corinthians 9:25-27",
      "Proverbs 25:28",
      "2 Peter 1:5-6",
      "Galatians 5:23"
    ],
    practicalApplication: "Identify one area where you lack self-control (food, screen time, words, thoughts). Today, practice mastery in that one area for 24 hours. Use a journal to track every moment you said 'no' to self.",
    reflectionQuestions: [
      "Am I faithfully persisting in spiritual disciplines even when I don't feel like it?",
      "Where does self have the most control over me?",
      "What would my life look like if I had complete self-control in one area?"
    ],
    warriorCharacteristics: ["faithfulness", "self-control", "discipline", "mastery"]
  }
];

export const WARRIOR_CHARACTERISTICS = [
  { id: "self-awareness", name: "Self-Awareness", description: "Knowing the true nature of self" },
  { id: "honesty", name: "Honesty", description: "Facing reality without excuses" },
  { id: "courage", name: "Courage", description: "Boldness in the face of danger" },
  { id: "vigilance", name: "Vigilance", description: "Constant watchfulness" },
  { id: "humility", name: "Humility", description: "Recognizing dependence on God" },
  { id: "decisiveness", name: "Decisiveness", description: "Making clear commitments" },
  { id: "commitment", name: "Commitment", description: "Unwavering dedication" },
  { id: "soldier-mindset", name: "Soldier Mindset", description: "Expecting battle, not comfort" },
  { id: "self-control", name: "Self-Control", description: "Mastery over impulses" },
  { id: "internal-focus", name: "Internal Focus", description: "Fighting within, not externally" },
  { id: "thoroughness", name: "Thoroughness", description: "Complete victory, not halfway" },
  { id: "holy-anger", name: "Holy Anger", description: "Righteous wrath at sin" },
  { id: "passion", name: "Passion", description: "Intensity for righteousness" },
  { id: "zeal", name: "Zeal", description: "Fervent devotion" },
  { id: "peace", name: "Peace", description: "Calm in the storm" },
  { id: "composure", name: "Composure", description: "Steadiness under fire" },
  { id: "steadfastness", name: "Steadfastness", description: "Immovable foundation" },
  { id: "patience", name: "Patience", description: "Long-suffering endurance" },
  { id: "endurance", name: "Endurance", description: "Outlasting opposition" },
  { id: "perseverance", name: "Perseverance", description: "Continuing despite difficulty" },
  { id: "kindness", name: "Kindness", description: "Gracious treatment of others" },
  { id: "goodness", name: "Goodness", description: "Moral excellence in action" },
  { id: "gentleness", name: "Gentleness", description: "Strength under control" },
  { id: "grace", name: "Grace", description: "Unmerited favor shown to others" },
  { id: "faithfulness", name: "Faithfulness", description: "Loyal persistence" },
  { id: "discipline", name: "Discipline", description: "Structured obedience" },
  { id: "mastery", name: "Mastery", description: "Complete control" },
  { id: "love", name: "Love", description: "Selfless devotion" },
  { id: "loyalty", name: "Loyalty", description: "Unwavering allegiance" },
  { id: "devotion", name: "Devotion", description: "Wholehearted dedication" },
  { id: "joy", name: "Joy", description: "Delight in righteousness" },
  { id: "delight", name: "Delight", description: "Finding pleasure in obedience" },
  { id: "gladness", name: "Gladness", description: "Cheerful willingness" },
  { id: "unity", name: "Unity", description: "Oneness with fellow warriors" },
  { id: "expertise", name: "Expertise", description: "Skilled mastery" },
  { id: "boldness", name: "Boldness", description: "Fearless action" },
  { id: "agility", name: "Agility", description: "Quick adaptability" },
  { id: "focus", name: "Focus", description: "Single-minded concentration" },
  { id: "discernment", name: "Discernment", description: "Spiritual insight" },
  { id: "spirit-reliance", name: "Spirit Reliance", description: "Depending on God's power" },
  { id: "fruit-mastery", name: "Fruit Mastery", description: "Developing all nine fruits" }
];