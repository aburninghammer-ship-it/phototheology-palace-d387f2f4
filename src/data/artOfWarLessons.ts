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
  },
  // SECTION II: THE WEAPONS OF WAR
  {
    id: "armory-intro",
    chapter: 5,
    title: "The Armory of Fire",
    subtitle: "Introduction to Supernatural Weapons",
    description: "Spiritual warfare requires supernatural weapons. Carnal weapons fail against spiritual enemies. God has provided an arsenal of divine weapons that are 'mighty through God to the pulling down of strongholds' (2 Cor 10:4). Each weapon serves a specific purpose in the holy war against self.",
    keyPoints: [
      "Our weapons are not carnal but mighty through God (2 Corinthians 10:4-5)",
      "Each weapon has a specific function in containing and destroying self",
      "Mastery requires practice, not just knowledge",
      "Weapons must be used in combination for maximum effectiveness",
      "The Armor of God (Ephesians 6) provides both defensive and offensive capabilities"
    ],
    scriptureReferences: [
      "2 Corinthians 10:4-5",
      "Ephesians 6:10-17",
      "Hebrews 4:12",
      "Psalm 18:34-35"
    ],
    practicalApplication: "Survey your spiritual arsenal today. Make a list of the weapons you know how to use versus those you've never practiced with. Choose one unfamiliar weapon to study and practice this week.",
    reflectionQuestions: [
      "Which spiritual weapons am I most comfortable using?",
      "Which weapons have I neglected or never learned to use?",
      "Am I fighting with the full armor of God, or just pieces of it?"
    ],
    warriorCharacteristics: ["preparedness", "study", "discipline"]
  },
  {
    id: "myrrh-power",
    chapter: 5,
    title: "Myrrh-Power",
    subtitle: "The Weapon of Endurance and Faithfulness Unto Death",
    description: "Myrrh represents death, suffering, and sacrifice. It was brought to baby Jesus, used in His burial, and symbolizes the willingness to suffer and die rather than betray. Myrrh-power is the spirit of 'faithful unto death' (Revelation 2:10)—the determination to endure anything rather than yield to self.",
    keyPoints: [
      "Myrrh was one of the three gifts brought to Jesus, foreshadowing His death",
      "This weapon gives the power to choose death over sin",
      "It's the spirit of the martyrs who loved not their lives unto death",
      "Myrrh-power transforms suffering into victory",
      "It enables you to say 'I would rather die than sin'",
      "This is the opposite of self-preservation—it's self-crucifixion"
    ],
    scriptureReferences: [
      "Revelation 2:10 - Be faithful unto death",
      "Matthew 2:11 - Gold, frankincense, and myrrh",
      "John 19:39 - Myrrh and aloes for Jesus' burial",
      "Revelation 12:11 - They loved not their lives unto death"
    ],
    practicalApplication: "Identify one area where you've been compromising because 'dying to self' feels too hard. Today, invoke myrrh-power: choose the harder right over the easier wrong, even if it costs you comfort, reputation, or pleasure. Pray: 'Lord, give me myrrh-power to be faithful unto death in this area.'",
    reflectionQuestions: [
      "Am I willing to suffer for righteousness, or do I always choose the path of least resistance?",
      "What would I rather die than do? Is that list growing or shrinking?",
      "Do I have the spirit of the martyrs, or the spirit of self-preservation?"
    ],
    warriorCharacteristics: ["endurance", "sacrifice", "faithfulness", "courage"]
  },
  {
    id: "burning-hammer",
    chapter: 5,
    title: "The Burning Hammer",
    subtitle: "Shattering Illusions and Breaking Strongholds",
    description: "The Burning Hammer is God's Word that breaks apart false beliefs, illusions, and mental strongholds. Like Jeremiah's hammer that breaks the rock in pieces, this weapon demolishes Satan's lies and the deceptive 'eyeglasses' through which self views sin as attractive.",
    keyPoints: [
      "God's Word is like a hammer that breaks the rock (Jeremiah 23:29)",
      "Satan gives you false eyeglasses that make sin look good",
      "The Hammer shatters these illusions and reveals sin's true ugliness",
      "It's a boomerang weapon—Scripture you speak returns with power",
      "Behind every temptation is a lie; the Hammer exposes and destroys it"
    ],
    scriptureReferences: [
      "Jeremiah 23:29 - Is not my word like a hammer?",
      "Hebrews 4:12 - The Word is sharper than any two-edged sword",
      "2 Corinthians 10:4-5 - Pulling down strongholds and imaginations",
      "Isaiah 55:11 - My word shall not return void"
    ],
    practicalApplication: "Identify one recurring temptation. Ask: 'What lie am I believing about this sin?' Then find a Scripture that directly contradicts that lie. Memorize it. When tempted, speak that Scripture aloud as a hammer-strike against the illusion.",
    reflectionQuestions: [
      "What false beliefs do I have about my favorite sins?",
      "Am I wearing Satan's eyeglasses, seeing sin as more attractive than it really is?",
      "Which strongholds in my mind need to be demolished with God's hammer?"
    ],
    warriorCharacteristics: ["discernment", "truth-focus", "boldness"]
  },
  {
    id: "battle-axe",
    chapter: 5,
    title: "The Battle Axe",
    subtitle: "Cutting Sin at the Root",
    description: "The Battle Axe goes to the ROOT of sin, not just the visible branches. It identifies and severs the underlying desire, motivation, or belief system that feeds the temptation. Surface-level behavior modification leaves roots intact; the Axe digs deep.",
    keyPoints: [
      "Sin has roots—deeper desires that fuel surface behaviors",
      "Cutting branches (stopping behaviors) without cutting roots (desires) leads to regrowth",
      "The Axe requires brutal self-examination: WHY do I want this sin?",
      "Root sins often include pride, fear, unbelief, or selfishness",
      "Jesus' teaching in Matthew 5 uses the Axe—He targets heart roots, not just actions"
    ],
    scriptureReferences: [
      "Matthew 3:10 - The axe is laid at the root of the trees",
      "Matthew 5:27-30 - Cut off what causes you to sin",
      "Luke 3:9 - Every tree not bearing good fruit is cut down",
      "Hebrews 12:1 - Lay aside every weight and the sin that easily ensnares"
    ],
    practicalApplication: "Choose your most persistent sin. Don't just identify the behavior—dig for the root. Ask 'Why?' five times: 'Why do I do this? Why do I want that? Why does that matter?' Keep digging until you reach the root desire. Then ask God to cut it out with His axe.",
    reflectionQuestions: [
      "Am I treating symptoms or killing roots?",
      "What deeper desires are feeding my surface sins?",
      "Am I willing to let God cut out what I've been protecting?"
    ],
    warriorCharacteristics: ["self-examination", "thoroughness", "honesty", "courage"]
  },
  {
    id: "shield-of-faith",
    chapter: 5,
    title: "The Shield of Faith",
    subtitle: "Quenching the Fiery Darts",
    description: "The Shield of Faith is your defensive weapon that intercepts Satan's fiery missiles—sudden, rapid-fire thoughts designed to ignite sin. Faith trusts God's promises more than self's desires, blocking temptation before it penetrates.",
    keyPoints: [
      "Above all, take the shield of faith (Ephesians 6:16)",
      "Fiery darts are rapid, unexpected, explosive thoughts",
      "The shield doesn't remove temptation—it stops it from penetrating",
      "Faith believes God's 'way of escape' exists (1 Cor 10:13)",
      "Activating the shield requires instant response—no hesitation"
    ],
    scriptureReferences: [
      "Ephesians 6:16 - Shield of faith quenches fiery darts",
      "1 Corinthians 10:13 - God will provide a way of escape",
      "Psalm 91:4 - His truth shall be your shield",
      "Proverbs 30:5 - He is a shield to those who trust Him"
    ],
    practicalApplication: "Practice 'shield activation' drills. When a tempting thought strikes, immediately raise your shield by declaring a promise of God aloud: 'God will provide my way of escape' or 'Greater is He that is in me than he that is in the world.' Make it reflexive—shield up, dart quenched, move forward.",
    reflectionQuestions: [
      "Do I respond to temptation instantly with faith, or do I linger and consider it?",
      "Which of God's promises do I need to memorize as shield-verses?",
      "Am I fighting defensively (shield up) as well as offensively?"
    ],
    warriorCharacteristics: ["faith", "trust", "quick-response", "defense"]
  },
  {
    id: "mind-of-christ",
    chapter: 6,
    title: "The Mind of Christ",
    subtitle: "The Most Dangerous Weapon",
    description: "The Mind of Christ is the ultimate weapon—thinking, feeling, and responding exactly as Jesus would. This isn't imitation; it's transformation. When you possess Christ's mind, self has nowhere to hide because you see through His eyes, feel with His heart, and choose with His will.",
    keyPoints: [
      "Let this mind be in you which was also in Christ Jesus (Philippians 2:5)",
      "This weapon requires asking: What would Jesus think? Feel? Choose?",
      "Christ's mind combines all nine fruits perfectly",
      "Self is defeated when Christ's thoughts replace yours",
      "The renewed mind is the battleground of transformation (Romans 12:2)"
    ],
    scriptureReferences: [
      "Philippians 2:5-8 - Let this mind be in you",
      "1 Corinthians 2:16 - We have the mind of Christ",
      "Romans 12:2 - Be transformed by the renewing of your mind",
      "Colossians 3:2 - Set your mind on things above"
    ],
    practicalApplication: "In every decision today, pause and ask: 'What would Jesus think about this? How would He feel? What would He choose?' Don't rush—actually wait for the answer. Practice mind-swapping: replace your first thought (usually self's thought) with Christ's thought.",
    reflectionQuestions: [
      "How different are my thoughts from Christ's thoughts?",
      "Do I instinctively think like Jesus, or do I have to consciously override my default thinking?",
      "What mental patterns need to be completely replaced?"
    ],
    warriorCharacteristics: ["transformation", "christ-likeness", "renewal", "wisdom"]
  },
  {
    id: "sword-of-word",
    chapter: 6,
    title: "The Sword of the Spirit",
    subtitle: "Dividing Soul and Spirit",
    description: "The Sword of the Spirit is the Word of God—both defensive and offensive. It cuts between what comes from self (soul) and what comes from God (spirit), exposing motives and intentions. This weapon requires precision and skill.",
    keyPoints: [
      "The Word of God is living, active, sharper than any two-edged sword (Hebrews 4:12)",
      "It divides soul from spirit, joints from marrow",
      "The Sword exposes the thoughts and intentions of the heart",
      "Jesus wielded this weapon perfectly in His temptation (Matthew 4)",
      "Memorized Scripture becomes a ready weapon"
    ],
    scriptureReferences: [
      "Hebrews 4:12 - The Word is living and active",
      "Ephesians 6:17 - The sword of the Spirit, which is the word of God",
      "Matthew 4:4-10 - It is written... It is written... It is written",
      "Psalm 119:11 - Your word I have hidden in my heart"
    ],
    practicalApplication: "Memorize one sword-verse this week for your most common temptation. When attacked, slash back immediately with 'It is written...' Jesus didn't explain or debate—He quoted and conquered.",
    reflectionQuestions: [
      "How sharp is my sword? How much Scripture have I memorized?",
      "Can I distinguish between my soulish desires and the Spirit's leading?",
      "Am I speaking God's Word in battle, or just my opinions?"
    ],
    warriorCharacteristics: ["precision", "scripture-mastery", "discernment"]
  },
  {
    id: "gospel-boots",
    chapter: 6,
    title: "Gospel Boots of Peace",
    subtitle: "Sure-Footed in the Storm",
    description: "The Gospel Boots give you stable footing in unstable circumstances. They enable you to walk through temptation's storms without slipping, maintaining peace when chaos surrounds you.",
    keyPoints: [
      "Feet shod with the preparation of the gospel of peace (Ephesians 6:15)",
      "The gospel gives firm footing—you're secure in Christ",
      "Peace isn't the absence of battle; it's confidence in God during battle",
      "These boots let you walk through temptation without stumbling"
    ],
    scriptureReferences: [
      "Ephesians 6:15",
      "Isaiah 52:7 - How beautiful are the feet of those who bring good news",
      "Romans 10:15",
      "Philippians 4:7 - Peace that surpasses understanding"
    ],
    practicalApplication: "Practice 'peace walking' today. When circumstances trigger anxiety or temptation, stand still, remember the gospel (you are justified, forgiven, sealed), and let peace stabilize your emotions before you respond.",
    reflectionQuestions: [
      "Do I lose my footing easily when circumstances change?",
      "Is the gospel my foundation, or am I standing on shifting sand?",
      "Can I maintain peace during spiritual storms?"
    ],
    warriorCharacteristics: ["peace", "stability", "gospel-confidence"]
  },
  {
    id: "additional-weapons",
    chapter: 6,
    title: "Wings of Faith, Stones of Fire, Sonic Weapons",
    subtitle: "Advanced Arsenal",
    description: "Beyond the basic weapons lie advanced capabilities: Wings of Faith for rising above temptation, Stones of Fire for returning good for evil, and Sonic Weapons of prayer and spoken Scripture that create shockwaves in the spiritual realm.",
    keyPoints: [
      "Wings of Faith: Mount up with wings like eagles (Isaiah 40:31)—rise above temptation",
      "Stones of Fire: Overcome evil with good (Romans 12:20-21)—heap burning coals",
      "Sonic Weapons: The sound of prayer and declared Scripture shakes strongholds",
      "Advanced weapons require greater skill and spiritual maturity"
    ],
    scriptureReferences: [
      "Isaiah 40:31 - Mount up with wings like eagles",
      "Romans 12:20-21 - Overcome evil with good",
      "James 5:16 - The effectual fervent prayer of a righteous man",
      "Psalm 29:3-9 - The voice of the LORD is powerful"
    ],
    practicalApplication: "This week, practice 'flying' by choosing to focus on eternal realities when earthly temptations pull downward. Practice 'fire stones' by blessing someone who has wronged you. Practice 'sonic warfare' by praying aloud and declaring Scripture when under attack.",
    reflectionQuestions: [
      "Am I using only basic weapons, or am I developing advanced capabilities?",
      "Can I rise above temptation instead of just resisting at ground level?",
      "Do I know how to turn enemies into friends through spiritual kindness?"
    ],
    warriorCharacteristics: ["advancement", "creativity", "spiritual-maturity"]
  },
  // SECTION III: THE CREATURE STYLES
  {
    id: "creature-styles-intro",
    chapter: 7,
    title: "The Way of the Animal Warriors",
    subtitle: "Four Creature Combat Styles",
    description: "God's creation teaches warfare principles. Four creature styles—Crane, Mantis, Snake, and Dragon—each offer unique approaches to combating self. Master all four to become a complete warrior.",
    keyPoints: [
      "Each style emphasizes different aspects of spiritual combat",
      "Crane: Graceful defense and precise counter-strikes",
      "Mantis: Patient waiting and sudden overwhelming force",
      "Snake: Fluid adaptation and redirection of temptation's energy",
      "Dragon: Bold, fierce, Spirit-filled aggression against sin",
      "Warriors must be versatile—knowing when to use which style"
    ],
    scriptureReferences: [
      "Job 12:7-8 - Ask the beasts and they will teach you",
      "Proverbs 6:6 - Go to the ant, you sluggard",
      "Matthew 10:16 - Wise as serpents, harmless as doves",
      "Proverbs 28:1 - The righteous are bold as a lion"
    ],
    practicalApplication: "Study your natural fighting style. Are you naturally defensive (Crane), patient (Mantis), adaptive (Snake), or aggressive (Dragon)? This week, intentionally practice the style that's least natural to you.",
    reflectionQuestions: [
      "Which creature style describes my default approach to temptation?",
      "Which style do I avoid or fear to use?",
      "Can I match the right style to the right battle situation?"
    ],
    warriorCharacteristics: ["versatility", "adaptability", "wisdom", "strategy"]
  },
  // SECTION IV: SPIRITUAL EPONYMS
  {
    id: "eponyms-intro",
    chapter: 8,
    title: "Know Your Inner Enemies",
    subtitle: "Spiritual Eponyms and Character Flaws",
    description: "Within every believer lurks potential versions of biblical failures: Goliath's pride, Judas's betrayal, Peter's impulsiveness, Jacob's manipulation, Pharaoh's stubbornness. These 'eponyms' are specific manifestations of self that must be identified, diagnosed, and destroyed.",
    keyPoints: [
      "Eponyms are biblical characters whose names represent specific character flaws",
      "Every believer has potential for every eponym—none are immune",
      "Identifying your active eponyms helps you fight with precision",
      "Each eponym has a specific counter-strategy",
      "Victory over one eponym strengthens you against all others"
    ],
    scriptureReferences: [
      "1 Corinthians 10:11 - These things happened as examples for us",
      "Romans 15:4 - Written for our learning",
      "Hebrews 11 - Examples of faith (positive eponyms)",
      "Jude 11 - The way of Cain, error of Balaam, rebellion of Korah"
    ],
    practicalApplication: "Take an eponym inventory this week. Which biblical character's failures most resemble your own patterns? Study that character's story, identify the warning signs, and develop a personalized battle plan against that specific eponym.",
    reflectionQuestions: [
      "Which biblical failure am I most in danger of repeating?",
      "Do I see myself in Goliath's pride? Judas's compromise? Peter's impulsiveness?",
      "What counter-strategy does Scripture provide for my dominant eponym?"
    ],
    warriorCharacteristics: ["self-knowledge", "pattern-recognition", "biblical-literacy"]
  },
  // SECTION V: THE MIND SANCTUM
  {
    id: "mind-sanctum",
    chapter: 9,
    title: "The Mind Sanctum",
    subtitle: "Christ-Conformity Laboratory",
    description: "The battlefield is the mind. The Mind Sanctum is where warriors train to think, feel, and respond exactly as Christ would. This is the highest form of spiritual warfare—complete mental transformation.",
    keyPoints: [
      "Arm yourselves with the same mind as Christ (1 Peter 4:1)",
      "The mind is the control center—win here, win everywhere",
      "Christ-conformity means thinking His thoughts, feeling His emotions, choosing His responses",
      "This requires conscious, repetitive practice—mind-swapping",
      "The renewed mind is God's primary tool for transformation"
    ],
    scriptureReferences: [
      "1 Peter 4:1 - Arm yourselves with the same mind",
      "Romans 12:2 - Be transformed by the renewing of your mind",
      "Philippians 2:5 - Let this mind be in you",
      "2 Corinthians 10:5 - Bringing every thought into captivity"
    ],
    practicalApplication: "Create a 'Mind Sanctum' routine: Every morning, spend 10 minutes asking: 'How would Jesus think about my day ahead? What would He feel about my challenges? How would He respond to my temptations?' Journal His responses. Throughout the day, return to this mindset.",
    reflectionQuestions: [
      "How much time do I spend consciously training my mind to think like Christ?",
      "What's the gap between my default thoughts and Christ's thoughts?",
      "Am I content with occasional God-thoughts, or am I pursuing continuous Christ-mindedness?"
    ],
    warriorCharacteristics: ["transformation", "mindfulness", "christ-focus"]
  },
  // SECTION VI: SPIRITUAL PHYSICS
  {
    id: "spiritual-physics",
    chapter: 10,
    title: "Laws of Spiritual Warfare",
    subtitle: "Momentum, Magnetism, Gravity, and Codes",
    description: "Spiritual warfare operates according to divine laws as reliable as physical laws. Understanding these laws—momentum, magnetism, gravity, combination codes, containment, and destruction—gives warriors predictive power and strategic advantage.",
    keyPoints: [
      "Law of Momentum: Small victories create acceleration; defeats create downward spirals",
      "Law of Magnetism: You become what you behold; guard your gaze carefully",
      "Law of Gravity: Self pulls downward; Spirit lifts upward—constant force",
      "Law of Combination Codes: Every temptation has a specific fruit-combination solution",
      "Law of Containment: Self must be contained immediately or it escapes externally",
      "Law of Destruction: Self cannot be reformed—only crucified"
    ],
    scriptureReferences: [
      "2 Corinthians 3:18 - Beholding as in a mirror, transformed",
      "James 1:14-15 - Desire conceives and brings forth sin",
      "Galatians 6:7 - Whatever a man sows, he reaps",
      "Romans 8:6 - The mind set on the flesh is death; on the Spirit is life"
    ],
    practicalApplication: "This week, observe these laws in action: Track momentum (do victories breed more victories?), test magnetism (what are you beholding most?), feel gravity (where does self pull you?), decode temptations (what fruit combinations work?). Journal your observations.",
    reflectionQuestions: [
      "Which spiritual law am I most often violating?",
      "Am I building positive momentum or stuck in a downward spiral?",
      "What am I beholding that's transforming me—for better or worse?"
    ],
    warriorCharacteristics: ["understanding", "strategy", "observation", "wisdom"]
  },
  // SECTION VII: TIME ZONES
  {
    id: "minute-warrior",
    chapter: 11,
    title: "The Minute Warrior",
    subtitle: "From Yearly to Minute-by-Minute Combat",
    description: "Most Christians fight yearly (New Year's resolutions), monthly (special commitments), or weekly (Sunday decisions). True warriors fight MINUTE BY MINUTE. The goal is to ascend from Yearly Warrior to Minute Warrior—engaging self in continuous, moment-by-moment combat.",
    keyPoints: [
      "Five Time Zones: Yearly → Monthly → Weekly → Daily → MINUTE",
      "Minute Warriors win because they never stop fighting",
      "Self waits for gaps in vigilance—minute warfare eliminates gaps",
      "Each minute is a fresh opportunity for victory or defeat",
      "This is what 'pray without ceasing' means in warfare terms"
    ],
    scriptureReferences: [
      "1 Thessalonians 5:17 - Pray without ceasing",
      "Luke 9:23 - Take up your cross daily",
      "Lamentations 3:22-23 - His mercies are new every morning",
      "Psalm 119:164 - Seven times a day I praise You"
    ],
    practicalApplication: "Set hourly alarms today. At each alarm, ask: 'In this past hour, did I win or lose against self? Where did self gain ground?' Then reset and fight for the next hour. Track your wins and losses. The goal is awareness first, then victory.",
    reflectionQuestions: [
      "How long can I maintain vigilance before I 'forget' I'm in a war?",
      "What would change if I fought self minute-by-minute instead of occasionally?",
      "Am I a Yearly Warrior trying to survive on annual resolutions?"
    ],
    warriorCharacteristics: ["vigilance", "consistency", "endurance", "awareness"]
  },
  // SECTION VIII: ADVANCED TACTICS
  {
    id: "war-council",
    chapter: 12,
    title: "The War Council Chamber",
    subtitle: "Strategic Battle Planning",
    description: "Every successful military campaign requires strategic planning. The War Council Chamber is where warriors assess risks, identify eponyms, predict self's counterattacks, choose weapons, select creature-styles, and determine fruit combinations BEFORE entering battle.",
    keyPoints: [
      "Failing to plan is planning to fail",
      "Pre-battle assessment prevents mid-battle panic",
      "Know your enemy (self), know your terrain (your weaknesses), know your weapons",
      "Strategic planning includes: threat assessment, weapon selection, backup plans",
      "The best warriors win battles before they begin through superior planning"
    ],
    scriptureReferences: [
      "Luke 14:31 - What king going to war doesn't first sit down and consider?",
      "Proverbs 24:6 - By wise counsel you will wage war",
      "Proverbs 21:31 - The horse is prepared for battle, but victory is of the Lord",
      "Proverbs 16:9 - A man's heart plans his way, but the Lord directs his steps"
    ],
    practicalApplication: "Before entering a situation where you know you'll be tempted (party, work stress, difficult relationship), hold a War Council: What specific temptations will I face? Which eponym might activate? Which weapons will I need? What fruit combination? What's my escape route? Write it down. Execute the plan.",
    reflectionQuestions: [
      "Do I enter tempting situations with a battle plan or just 'hope for the best'?",
      "How often do my battles fail because I didn't plan ahead?",
      "Am I reactive (responding to attacks) or proactive (planning before attacks)?"
    ],
    warriorCharacteristics: ["strategy", "planning", "wisdom", "foresight"]
  },
  {
    id: "sparring-simulator",
    chapter: 12,
    title: "The Sparring Simulator",
    subtitle: "Practice Before Battle",
    description: "Athletes don't wait for game day to practice. Warriors don't wait for real temptation to train. The Sparring Simulator creates controlled practice scenarios where you can drill responses, test weapons, and build reflexes WITHOUT the stakes of real combat.",
    keyPoints: [
      "Mental rehearsal builds neural pathways for victory",
      "Visualization of successful resistance strengthens actual resistance",
      "Practice scenarios: 'Temptation enters the room...' 'Self disguises itself as...' 'Deploy burning hammer...'",
      "Sparring reveals which weapons you can't access quickly enough",
      "Repetition creates reflexes—automatic, instant responses"
    ],
    scriptureReferences: [
      "1 Corinthians 9:26-27 - I discipline my body like an athlete",
      "2 Timothy 2:15 - Study to show yourself approved",
      "Hebrews 5:14 - Those who by reason of use have their senses exercised",
      "Proverbs 22:3 - The prudent foresees evil and hides himself"
    ],
    practicalApplication: "Create a sparring routine: Mentally rehearse your top three temptations. Visualize them happening. Practice your response in your imagination: What weapon? What Scripture? What fruit? Do this daily. When real temptation strikes, your mind will already know the drill.",
    reflectionQuestions: [
      "Am I training for battle, or just hoping to survive when it comes?",
      "Which temptations should I be 'sparring' against regularly?",
      "Can I execute my battle plans under pressure, or do I freeze?"
    ],
    warriorCharacteristics: ["preparation", "discipline", "practice", "readiness"]
  },
  {
    id: "after-action",
    chapter: 13,
    title: "After-Action War Analysis",
    subtitle: "Learning from Every Battle",
    description: "Every military operation ends with After-Action Review: What went right? What went wrong? What can we learn? Warriors who skip this step repeat the same mistakes. Those who analyze become unstoppable.",
    keyPoints: [
      "After every victory: What fruit combination worked? What weapon was decisive? How can I replicate this?",
      "After every defeat: Where did containment fail? What fruit was missing? Where was self hiding?",
      "Document patterns: Are you losing the same battles repeatedly?",
      "Honest assessment requires brutal honesty—no excuses",
      "The goal isn't condemnation—it's strategic improvement"
    ],
    scriptureReferences: [
      "Lamentations 3:40 - Let us search out and examine our ways",
      "Psalm 139:23-24 - Search me, O God, and know my heart",
      "1 Corinthians 11:28 - Let a man examine himself",
      "2 Corinthians 13:5 - Examine yourselves whether you are in the faith"
    ],
    practicalApplication: "Start an After-Action Journal. After each significant temptation (win or loss), write: Date, Temptation, Fruit Combination Needed, Weapon Used, Result, Lessons Learned, Adjustments for Next Time. Review weekly for patterns.",
    reflectionQuestions: [
      "Do I learn from defeats, or just feel guilty and move on?",
      "What patterns emerge when I review my spiritual battles?",
      "Am I making the same mistakes repeatedly because I'm not analyzing them?"
    ],
    warriorCharacteristics: ["reflection", "honesty", "improvement", "learning"]
  },
  {
    id: "surrender-room",
    chapter: 14,
    title: "The Surrender Room",
    subtitle: "The Daily White-Flag Ritual",
    description: "This is the foundation of all holy warfare. Before you can fight self, you must surrender TO GOD. The Surrender Room contains the Daily White-Flag Ritual: 'I surrender my will, my opinion, my desires, my rights.' Without this, all other warfare fails.",
    keyPoints: [
      "Paradox: You win by surrendering—but surrendering to GOD, not to self",
      "The White-Flag Ritual disarms self by removing its power sources",
      "Surrender is not passivity—it's the most active choice you can make",
      "Four daily surrenders: Will, Opinion, Desires, Rights",
      "Self hates the Surrender Room because it exposes its impotence"
    ],
    scriptureReferences: [
      "Luke 9:23 - Deny yourself, take up your cross daily",
      "Matthew 26:39 - Not my will, but Yours be done",
      "Galatians 2:20 - I am crucified with Christ",
      "John 12:24-25 - Unless a grain of wheat falls and dies"
    ],
    practicalApplication: "Begin every day in the Surrender Room. Pray aloud: 'Father, I surrender my will to You today. I surrender my opinions—Your truth is what matters. I surrender my desires—may Your desires become mine. I surrender my rights—I have no rights except what Christ purchased for me. I am Yours. Do with me as You will.' Then live surrendered.",
    reflectionQuestions: [
      "Have I truly surrendered, or am I still negotiating with God?",
      "Which of the four (will, opinion, desires, rights) is hardest for me to surrender?",
      "Do I surrender once and think it's done, or do I surrender daily?"
    ],
    warriorCharacteristics: ["surrender", "humility", "obedience", "submission"]
  },
  {
    id: "lion-faced",
    chapter: 15,
    title: "Lion-Faced Champions",
    subtitle: "The Final Rank—Graduating Warriors",
    description: "The highest rank in God's holy army is Lion-Faced Champion—one who has faces like lions, is swift as roes, expert in all instruments of war, keeps rank, and is not of double heart. This is the goal: complete mastery over self, total surrender to God, and unstoppable effectiveness in spiritual combat.",
    keyPoints: [
      "Progression: Observer → Recruit → Footsoldier → Specialist → Elite Fighter → Mighty Warrior → Lion-Faced Champion",
      "Lion-Faced means: bold, courageous, fearless, unintimidated by self or Satan",
      "Swift as roes: agile, quick to respond, maintaining spiritual footing",
      "Expert in war: mastery of all weapons, fruits, creature-styles",
      "Not of double heart: single-minded devotion, no compromise",
      "The goal isn't perfection—it's progress and persistence"
    ],
    scriptureReferences: [
      "1 Chronicles 12:8 - Faces like lions, swift as roes",
      "Proverbs 28:1 - The righteous are bold as a lion",
      "Revelation 5:5 - The Lion of the tribe of Judah has prevailed",
      "2 Timothy 4:7 - I have fought the good fight, finished the race"
    ],
    practicalApplication: "Assess your current rank honestly. Where are you? Observer (just learning)? Footsoldier (basic engagement)? Mighty Warrior (consistent victories)? Don't be discouraged by your current rank—be motivated. Identify one area to advance this week. Move from observer to recruit, recruit to footsoldier, etc. Advancement comes through practice, not perfection.",
    reflectionQuestions: [
      "What rank honestly describes my current spiritual warfare effectiveness?",
      "Am I advancing or stagnant in my warrior development?",
      "What specific training do I need to reach the next rank?",
      "Am I fighting like a lion, or hiding like a lamb?",
      "Do I have the heart of a champion, or am I satisfied with mediocrity?"
    ],
    warriorCharacteristics: ["mastery", "boldness", "completion", "championship"]
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