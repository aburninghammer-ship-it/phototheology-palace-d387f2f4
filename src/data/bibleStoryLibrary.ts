// Bible Story Library - Obscure and Lesser-Known Stories
// Organized by book with summaries for each story

export interface BibleStory {
  id: string;
  title: string;
  reference: string;
  summary: string;
  characters: string[];
  themes: string[];
  lessonLearned?: string;
}

export interface BookStories {
  book: string;
  testament: "old" | "new";
  stories: BibleStory[];
}

export const bibleStoryLibrary: BookStories[] = [
  // ============================================
  // GENESIS - 35 Stories
  // ============================================
  {
    book: "Genesis",
    testament: "old",
    stories: [
      {
        id: "gen-1",
        title: "The Serpent's Deception",
        reference: "Genesis 3:1-7",
        summary: "The serpent, more cunning than any beast, approaches Eve in the Garden of Eden. He questions God's command about the forbidden tree, twisting the truth by suggesting God is withholding something good. Eve sees the fruit is desirable for wisdom, takes it, eats, and gives some to Adam. Their eyes are opened, they realize their nakedness, and sin enters the world.",
        characters: ["Eve", "Adam", "The Serpent"],
        themes: ["Temptation", "Deception", "Fall of Man"],
        lessonLearned: "Satan often attacks by questioning God's Word and suggesting God is withholding good from us."
      },
      {
        id: "gen-2",
        title: "Cain's Offering Rejected",
        reference: "Genesis 4:1-16",
        summary: "Cain, a farmer, and Abel, a shepherd, both bring offerings to God. Abel brings the firstborn of his flock with their fat portions, while Cain brings some fruits of the ground. God accepts Abel's offering but not Cain's. Consumed by jealousy, Cain lures Abel to a field and kills him. When God asks where Abel is, Cain replies, 'Am I my brother's keeper?' God curses Cain to be a wanderer, but marks him for protection.",
        characters: ["Cain", "Abel", "God"],
        themes: ["Jealousy", "Worship", "First Murder"],
        lessonLearned: "God looks at the heart behind our offerings, not just the offering itself."
      },
      {
        id: "gen-3",
        title: "Enoch Walks with God",
        reference: "Genesis 5:21-24",
        summary: "In a genealogy of death ('and he died... and he died'), Enoch stands out. After fathering Methuselah at 65, Enoch walked with God for 300 years. Then, remarkably, 'he was not, for God took him.' Enoch never experienced death—God simply took him directly to heaven, one of only two people in Scripture to bypass death.",
        characters: ["Enoch", "Methuselah"],
        themes: ["Faithfulness", "Walking with God", "Translation"],
        lessonLearned: "A life of consistent fellowship with God is the highest calling."
      },
      {
        id: "gen-4",
        title: "The Nephilim",
        reference: "Genesis 6:1-4",
        summary: "A mysterious passage describes the 'sons of God' taking wives from the 'daughters of men.' Their offspring were the Nephilim—giants and mighty men of renown. This intermingling contributed to the wickedness that prompted God to send the flood. The identity of the 'sons of God' remains debated—fallen angels, the godly line of Seth, or powerful rulers.",
        characters: ["Sons of God", "Daughters of Men", "Nephilim"],
        themes: ["Corruption", "Boundaries", "Judgment"],
        lessonLearned: "Crossing God's established boundaries leads to corruption and judgment."
      },
      {
        id: "gen-5",
        title: "Noah's Shame",
        reference: "Genesis 9:20-27",
        summary: "After the flood, Noah plants a vineyard, makes wine, and becomes drunk in his tent, lying uncovered. Ham sees his father's nakedness and tells his brothers outside. Shem and Japheth walk backward with a garment to cover Noah without looking. When Noah awakens, he curses Ham's son Canaan to be a servant, while blessing Shem and Japheth.",
        characters: ["Noah", "Ham", "Shem", "Japheth", "Canaan"],
        themes: ["Honoring Parents", "Consequences of Sin", "Generational Impact"],
        lessonLearned: "How we respond to the failures of others reveals our character."
      },
      {
        id: "gen-6",
        title: "The Tower of Babel",
        reference: "Genesis 11:1-9",
        summary: "The whole earth speaks one language. In the plain of Shinar, people decide to build a city with a tower reaching heaven to make a name for themselves and avoid being scattered. God comes down to see their work, observes that nothing will be impossible for unified humanity, confuses their language, and scatters them across the earth. The place is called Babel.",
        characters: ["The Builders", "God"],
        themes: ["Pride", "Unity Against God", "Divine Intervention"],
        lessonLearned: "Human achievement apart from God leads to confusion and scattering."
      },
      {
        id: "gen-7",
        title: "Abram Lies About Sarai",
        reference: "Genesis 12:10-20",
        summary: "Famine drives Abram to Egypt. Fearing the Egyptians will kill him to take beautiful Sarai, he tells her to say she's his sister. Pharaoh takes Sarai into his house and treats Abram well. But God plagues Pharaoh's house. When Pharaoh discovers the truth, he confronts Abram, returns Sarai, and sends them away with all their possessions.",
        characters: ["Abram", "Sarai", "Pharaoh"],
        themes: ["Fear", "Deception", "God's Protection"],
        lessonLearned: "God protects His promises even when we fail to trust Him."
      },
      {
        id: "gen-8",
        title: "Lot Chooses Sodom",
        reference: "Genesis 13:5-13",
        summary: "Abram and Lot's possessions become so great that strife arises between their herdsmen. Abram graciously offers Lot first choice of the land. Lot lifts his eyes, sees the well-watered Jordan valley (like the garden of the Lord), and chooses it—pitching his tent toward Sodom, a city already notorious for wickedness.",
        characters: ["Abram", "Lot"],
        themes: ["Generosity", "Worldly Choices", "Compromise"],
        lessonLearned: "Choosing based on appearance rather than godliness leads toward destruction."
      },
      {
        id: "gen-9",
        title: "Melchizedek Blesses Abram",
        reference: "Genesis 14:17-24",
        summary: "After Abram rescues Lot from four invading kings, Melchizedek—king of Salem and priest of God Most High—appears with bread and wine, blessing Abram and praising God for delivering his enemies. Abram gives him a tenth of everything. Melchizedek appears without genealogy, foreshadowing Christ's eternal priesthood. Abram refuses the king of Sodom's offer, wanting only what God provides.",
        characters: ["Abram", "Melchizedek", "King of Sodom"],
        themes: ["Priesthood", "Tithing", "Integrity"],
        lessonLearned: "There is a priesthood greater than the Levitical—the order of Melchizedek."
      },
      {
        id: "gen-10",
        title: "Hagar Meets the Angel",
        reference: "Genesis 16:1-16",
        summary: "Sarai, unable to bear children, gives her Egyptian servant Hagar to Abram. When Hagar conceives, she despises Sarai. Sarai deals harshly with her, and Hagar flees into the wilderness. The Angel of the Lord finds her by a spring and tells her to return and submit, promising her son Ishmael will father a great nation. Hagar calls God 'El Roi'—the God who sees.",
        characters: ["Hagar", "Sarai", "Abram", "Angel of the Lord"],
        themes: ["Suffering", "God Sees", "Divine Encounter"],
        lessonLearned: "God sees the afflicted and meets them in their wilderness."
      },
      {
        id: "gen-11",
        title: "Abraham Laughs at God",
        reference: "Genesis 17:15-22",
        summary: "God announces that 90-year-old Sarah will bear a son. Abraham falls on his face and laughs, saying in his heart, 'Shall a child be born to a man who is a hundred years old?' He asks God to let Ishmael be the chosen one instead. But God insists: Sarah will bear Isaac, and the covenant will be established through him, not Ishmael.",
        characters: ["Abraham", "God", "Sarah (mentioned)"],
        themes: ["Faith", "Doubt", "God's Promises"],
        lessonLearned: "God's plans often seem impossible, but He is faithful to His word."
      },
      {
        id: "gen-12",
        title: "Abraham Bargains for Sodom",
        reference: "Genesis 18:16-33",
        summary: "God reveals His plan to destroy Sodom. Abraham intercedes, asking if God will spare the city for fifty righteous people. God agrees. Abraham keeps negotiating—forty-five, forty, thirty, twenty, ten. Each time God agrees. But not even ten righteous people are found in Sodom. The bargaining reveals both God's justice and His willingness to show mercy.",
        characters: ["Abraham", "God", "Two Angels"],
        themes: ["Intercession", "Justice", "Mercy"],
        lessonLearned: "Righteous intercession can move the heart of God."
      },
      {
        id: "gen-13",
        title: "Lot's Wife Looks Back",
        reference: "Genesis 19:15-26",
        summary: "Angels urge Lot to flee Sodom with his family before its destruction. They warn: 'Do not look back or stop anywhere in the valley.' As fire and brimstone rain from heaven, Lot's wife looks back and becomes a pillar of salt. Her heart remained in Sodom, and she couldn't let go of the life she was leaving behind.",
        characters: ["Lot", "Lot's Wife", "Angels"],
        themes: ["Judgment", "Attachment to World", "Obedience"],
        lessonLearned: "Looking back to our old life prevents us from entering the new."
      },
      {
        id: "gen-14",
        title: "Lot's Daughters' Deception",
        reference: "Genesis 19:30-38",
        summary: "After Sodom's destruction, Lot and his daughters live in a cave. The daughters, fearing no men remain to continue their line, make their father drunk on consecutive nights and lie with him. Both conceive. The firstborn's son is Moab (father of Moabites); the younger's is Ben-ammi (father of Ammonites)—nations that would trouble Israel for centuries.",
        characters: ["Lot", "Lot's Daughters"],
        themes: ["Desperation", "Compromise", "Consequences"],
        lessonLearned: "Taking matters into our own hands apart from God creates generational problems."
      },
      {
        id: "gen-15",
        title: "Abraham Deceives Abimelech",
        reference: "Genesis 20:1-18",
        summary: "Abraham again claims Sarah is his sister, this time to King Abimelech of Gerar. God warns Abimelech in a dream that Sarah is married. Abimelech protests his innocence—he never touched her. God acknowledges this, saying He prevented the sin. Abimelech confronts Abraham, who admits his fear and that Sarah is technically his half-sister. Abraham prays for Abimelech, and God heals his household.",
        characters: ["Abraham", "Sarah", "Abimelech", "God"],
        themes: ["Repeat Failures", "God's Protection", "Integrity"],
        lessonLearned: "Even after experiencing God's faithfulness, we can fall into the same fears."
      },
      {
        id: "gen-16",
        title: "Hagar and Ishmael Cast Out",
        reference: "Genesis 21:8-21",
        summary: "At Isaac's weaning feast, Sarah sees Ishmael mocking and demands Abraham cast out Hagar and her son. Though grieved, Abraham obeys when God confirms it. In the wilderness, their water runs out. Hagar places Ishmael under a bush and sits away, unable to watch him die. God hears the boy's voice, opens Hagar's eyes to a well, and promises Ishmael will become a great nation.",
        characters: ["Hagar", "Ishmael", "Sarah", "Abraham", "God"],
        themes: ["Rejection", "Divine Provision", "God Hears"],
        lessonLearned: "When human doors close, God opens divine wells."
      },
      {
        id: "gen-17",
        title: "The Binding of Isaac",
        reference: "Genesis 22:1-19",
        summary: "God tests Abraham: 'Take your son, your only son Isaac, whom you love, and offer him as a burnt offering.' Abraham obeys, traveling three days to Moriah. Isaac carries the wood, asking about the lamb. Abraham says, 'God will provide.' At the altar, as Abraham raises the knife, the Angel stops him—'Now I know you fear God.' A ram caught in a thicket becomes the sacrifice.",
        characters: ["Abraham", "Isaac", "Angel of the Lord"],
        themes: ["Faith", "Obedience", "Substitution"],
        lessonLearned: "God provides the lamb—ultimately, the Lamb of God."
      },
      {
        id: "gen-18",
        title: "Rebekah at the Well",
        reference: "Genesis 24:10-67",
        summary: "Abraham's servant travels to find a wife for Isaac. He prays for a sign: the woman who offers water to him and his camels will be the one. Before he finishes praying, Rebekah appears and does exactly that. Her family agrees to the marriage. Rebekah courageously says 'I will go' and travels to meet Isaac, who loves her and is comforted after his mother's death.",
        characters: ["Abraham's Servant", "Rebekah", "Laban", "Isaac"],
        themes: ["Divine Guidance", "Prayer", "Faith"],
        lessonLearned: "God guides those who seek His will in prayer."
      },
      {
        id: "gen-19",
        title: "Esau Sells His Birthright",
        reference: "Genesis 25:29-34",
        summary: "Esau returns from hunting, exhausted and famished. Jacob is cooking lentil stew. Esau begs for some, and Jacob demands his birthright in exchange. Esau, caring only about his immediate hunger, swears away his birthright for a bowl of stew and some bread. Scripture says he 'despised his birthright'—trading eternal blessing for temporal satisfaction.",
        characters: ["Esau", "Jacob"],
        themes: ["Short-sightedness", "Spiritual Priorities", "Trading the Eternal"],
        lessonLearned: "Never trade lasting spiritual blessings for momentary physical comfort."
      },
      {
        id: "gen-20",
        title: "Isaac Reopens the Wells",
        reference: "Genesis 26:12-33",
        summary: "During famine, Isaac stays in Gerar and prospers so greatly that the Philistines become envious and fill his father Abraham's wells with dirt. Isaac doesn't fight—he moves and redigens the same wells, calling them by their original names. When disputes arise over new wells, he keeps moving until finding peace at Rehoboth, saying, 'Now the Lord has made room for us.'",
        characters: ["Isaac", "Philistines", "Abimelech"],
        themes: ["Peacemaking", "Persistence", "Blessing"],
        lessonLearned: "Sometimes the path to blessing is through patient persistence, not conflict."
      },
      {
        id: "gen-21",
        title: "Jacob Steals the Blessing",
        reference: "Genesis 27:1-40",
        summary: "Blind Isaac prepares to bless Esau. Rebekah overhears and schemes with Jacob. She dresses Jacob in Esau's clothes, covers his hands with goatskin, and prepares a meal. Jacob lies directly: 'I am Esau.' Isaac, suspicious, feels him and is fooled. He gives Jacob the blessing of abundance and dominion. When Esau arrives, Isaac trembles—the blessing cannot be revoked. Esau weeps bitterly.",
        characters: ["Jacob", "Rebekah", "Isaac", "Esau"],
        themes: ["Deception", "Blessing", "Consequences"],
        lessonLearned: "God's purposes prevail, but deception brings lasting family pain."
      },
      {
        id: "gen-22",
        title: "Jacob's Ladder",
        reference: "Genesis 28:10-22",
        summary: "Fleeing Esau, Jacob stops for the night, using a stone for a pillow. He dreams of a ladder reaching heaven with angels ascending and descending. God stands above, renewing the Abrahamic covenant with Jacob. Awakening, Jacob declares, 'This is the gate of heaven,' names the place Bethel, sets up the stone as a pillar, and vows to give God a tenth.",
        characters: ["Jacob", "God", "Angels"],
        themes: ["Divine Encounter", "Covenant", "Worship"],
        lessonLearned: "God meets us even when we're running from our past."
      },
      {
        id: "gen-23",
        title: "Jacob Works for Rachel",
        reference: "Genesis 29:15-30",
        summary: "Jacob falls in love with Rachel at first sight. He agrees to work seven years for her hand, and they seem like 'only a few days' because of his love. But on the wedding night, Laban secretly substitutes Leah. In the morning, Jacob discovers the deception—the deceiver has been deceived. He must work another seven years for Rachel.",
        characters: ["Jacob", "Rachel", "Leah", "Laban"],
        themes: ["Love", "Deception Returned", "Persistence"],
        lessonLearned: "What we sow, we eventually reap—even in our family dynamics."
      },
      {
        id: "gen-24",
        title: "The Mandrake Bargain",
        reference: "Genesis 30:14-18",
        summary: "During wheat harvest, Reuben finds mandrakes (believed to promote fertility) and brings them to Leah. Rachel desperately wants them and bargains: Leah can have Jacob that night in exchange. Leah meets Jacob in the field and declares, 'I have hired you with my son's mandrakes.' She conceives Issachar. The sisters' rivalry over Jacob reduces him to a commodity.",
        characters: ["Rachel", "Leah", "Reuben", "Jacob"],
        themes: ["Rivalry", "Desperation", "Dysfunction"],
        lessonLearned: "Jealousy and competition can reduce sacred relationships to transactions."
      },
      {
        id: "gen-25",
        title: "Jacob's Speckled Flock Strategy",
        reference: "Genesis 30:25-43",
        summary: "Jacob asks Laban for wages to return home. They agree: Jacob keeps all speckled and spotted animals. Laban removes all such animals, leaving Jacob with pure stock. But Jacob uses striped rods at watering troughs when strong animals mate, and they bear speckled offspring. He becomes exceedingly prosperous, outsmarting the man who repeatedly changed his wages.",
        characters: ["Jacob", "Laban"],
        themes: ["Cunning", "Providence", "Prosperity"],
        lessonLearned: "God can prosper us even when others try to cheat us."
      },
      {
        id: "gen-26",
        title: "Rachel Steals the Household Gods",
        reference: "Genesis 31:17-35",
        summary: "When Jacob flees Laban, Rachel secretly steals her father's household gods (teraphim). Laban pursues and searches everything. Rachel hides the idols in a camel's saddle and sits on them, claiming she cannot rise because 'the way of women' is upon her. Laban finds nothing. Rachel never admits the theft, and Jacob unknowingly curses the thief to death.",
        characters: ["Rachel", "Jacob", "Laban"],
        themes: ["Idolatry", "Deception", "Hidden Sin"],
        lessonLearned: "Leaving a place is not the same as leaving its gods behind."
      },
      {
        id: "gen-27",
        title: "Jacob Wrestles at Jabbok",
        reference: "Genesis 32:22-32",
        summary: "The night before meeting Esau, Jacob sends his family across the Jabbok and remains alone. A man wrestles with him until daybreak. Unable to prevail, the man touches Jacob's hip, dislocating it. Jacob refuses to let go without a blessing. The man renames him Israel—'he who strives with God.' Jacob limps away, naming the place Peniel: 'I have seen God face to face.'",
        characters: ["Jacob", "The Angel/God"],
        themes: ["Struggle", "Transformation", "Blessing"],
        lessonLearned: "God transforms us through wrestling, and we often walk away limping but blessed."
      },
      {
        id: "gen-28",
        title: "Dinah and the Shechemites",
        reference: "Genesis 34:1-31",
        summary: "Dinah visits the women of the land. Shechem, the prince, sees her, takes her, and defiles her—but then loves her and wants to marry her. Jacob's sons deceitfully agree if all Shechemite males are circumcised. On the third day, while the men are sore, Simeon and Levi slaughter every male and plunder the city. Jacob rebukes them for making him 'stink' among the Canaanites.",
        characters: ["Dinah", "Shechem", "Simeon", "Levi", "Jacob"],
        themes: ["Violence", "Deception", "Revenge"],
        lessonLearned: "Vengeance taken into our own hands creates lasting consequences."
      },
      {
        id: "gen-29",
        title: "Reuben's Sin with Bilhah",
        reference: "Genesis 35:22",
        summary: "A single verse records a devastating act: 'Reuben went and lay with Bilhah his father's concubine, and Israel heard of it.' This transgression—sleeping with his father's wife—would cost Reuben his birthright. On his deathbed, Jacob would recall: 'Unstable as water, you shall not excel, because you went up to your father's bed.'",
        characters: ["Reuben", "Bilhah", "Jacob"],
        themes: ["Sexual Sin", "Lost Birthright", "Consequences"],
        lessonLearned: "A moment of sin can forfeit a lifetime of privilege."
      },
      {
        id: "gen-30",
        title: "Judah and Tamar",
        reference: "Genesis 38:1-30",
        summary: "Judah's son Er marries Tamar but dies wickedly. His brother Onan refuses to raise up offspring for Er and also dies. Judah withholds his third son. Tamar disguises herself as a prostitute and conceives by Judah, taking his signet, cord, and staff as pledge. When her pregnancy is discovered and she's condemned to death, she produces the items. Judah declares, 'She is more righteous than I.'",
        characters: ["Judah", "Tamar", "Er", "Onan", "Shelah"],
        themes: ["Deception", "Justice", "Messianic Line"],
        lessonLearned: "God works through broken situations to accomplish His purposes—Tamar is in Christ's genealogy."
      },
      {
        id: "gen-31",
        title: "Joseph and Potiphar's Wife",
        reference: "Genesis 39:1-20",
        summary: "Joseph, sold into Egypt, prospers in Potiphar's house. Potiphar's wife repeatedly tries to seduce him, but Joseph refuses: 'How can I do this great wickedness and sin against God?' One day she grabs his garment; he flees, leaving it behind. She uses it as evidence to falsely accuse him of attempted rape. Joseph is thrown into prison—punished for doing right.",
        characters: ["Joseph", "Potiphar's Wife", "Potiphar"],
        themes: ["Temptation", "Integrity", "False Accusation"],
        lessonLearned: "Doing right doesn't always bring immediate reward, but God honors faithfulness."
      },
      {
        id: "gen-32",
        title: "The Butler and Baker's Dreams",
        reference: "Genesis 40:1-23",
        summary: "In prison, Joseph meets Pharaoh's butler and baker, both troubled by dreams. Joseph interprets: the butler will be restored in three days; the baker will be executed. Both come true exactly. Joseph asks the butler to remember him, but 'the chief butler did not remember Joseph, but forgot him.' Joseph remains in prison two more years.",
        characters: ["Joseph", "Chief Butler", "Chief Baker"],
        themes: ["Dreams", "Forgotten Promises", "Waiting"],
        lessonLearned: "God's timing often includes seasons where we are forgotten by men but not by God."
      },
      {
        id: "gen-33",
        title: "Joseph Tests His Brothers",
        reference: "Genesis 42-44",
        summary: "Joseph's brothers come to Egypt for grain, not recognizing him. He accuses them of being spies, demands they bring Benjamin, keeps Simeon as hostage, and secretly returns their money. When they return with Benjamin, Joseph weeps privately, plants his silver cup in Benjamin's sack, and threatens to keep Benjamin as a slave—all to test whether they've changed.",
        characters: ["Joseph", "Brothers", "Benjamin", "Jacob"],
        themes: ["Testing", "Repentance", "Reconciliation"],
        lessonLearned: "True reconciliation requires evidence of genuine heart change."
      },
      {
        id: "gen-34",
        title: "Judah's Plea for Benjamin",
        reference: "Genesis 44:18-34",
        summary: "When Benjamin is threatened with slavery, Judah steps forward with an impassioned speech. He recounts how their father's life is bound up in the boy, how losing Benjamin would kill Jacob. He offers himself as substitute: 'Let me remain instead of the boy as a servant.' This sacrificial love from the same Judah who sold Joseph breaks Joseph's composure.",
        characters: ["Judah", "Joseph", "Benjamin"],
        themes: ["Substitution", "Transformation", "Sacrificial Love"],
        lessonLearned: "True repentance shows in willingness to sacrifice for those we once harmed."
      },
      {
        id: "gen-35",
        title: "Jacob Blesses Pharaoh",
        reference: "Genesis 47:7-10",
        summary: "Joseph brings his aged father Jacob before Pharaoh, the most powerful man on earth. Remarkably, twice it says Jacob 'blessed Pharaoh.' The lesser is blessed by the greater. This 130-year-old shepherd, who describes his years as 'few and evil,' carries an authority that transcends earthly power. Pharaoh, who could give life or death, receives blessing from a pilgrim.",
        characters: ["Jacob", "Pharaoh", "Joseph"],
        themes: ["Spiritual Authority", "Blessing", "Humility"],
        lessonLearned: "Spiritual authority isn't derived from earthly position but from walking with God."
      }
    ]
  },

  // ============================================
  // EXODUS - 30 Stories
  // ============================================
  {
    book: "Exodus",
    testament: "old",
    stories: [
      {
        id: "exo-1",
        title: "The Hebrew Midwives Defy Pharaoh",
        reference: "Exodus 1:15-21",
        summary: "Pharaoh commands Hebrew midwives Shiphrah and Puah to kill all newborn boys. But they fear God more than Pharaoh and let the boys live. When questioned, they claim Hebrew women deliver before midwives arrive. God blesses them with families of their own. Their civil disobedience preserved a generation—including Moses.",
        characters: ["Shiphrah", "Puah", "Pharaoh"],
        themes: ["Civil Disobedience", "Fear of God", "Courage"],
        lessonLearned: "When human law conflicts with God's law, we must obey God."
      },
      {
        id: "exo-2",
        title: "Moses in the Basket",
        reference: "Exodus 2:1-10",
        summary: "A Levite woman hides her beautiful baby for three months. Unable to hide him longer, she waterproofs a basket and places him among the reeds. His sister Miriam watches. Pharaoh's daughter finds him, has compassion, and unknowingly hires his own mother as nurse. The princess names him Moses—'drawn out'—raising the deliverer in the very palace seeking his death.",
        characters: ["Moses", "Jochebed", "Miriam", "Pharaoh's Daughter"],
        themes: ["Providence", "Irony", "Deliverance"],
        lessonLearned: "God can use the enemy's own household to protect His purposes."
      },
      {
        id: "exo-3",
        title: "Moses Kills the Egyptian",
        reference: "Exodus 2:11-15",
        summary: "At forty, Moses visits his Hebrew brethren and sees an Egyptian beating a Hebrew. Looking both ways and seeing no one, he kills the Egyptian and hides him in the sand. The next day, when he tries to stop two Hebrews fighting, one asks, 'Do you intend to kill me as you killed the Egyptian?' Moses realizes his deed is known and flees to Midian.",
        characters: ["Moses", "Egyptian Taskmaster", "Hebrew Slaves"],
        themes: ["Human Methods", "Failure", "Exile"],
        lessonLearned: "God's work done in human strength leads to failure and exile."
      },
      {
        id: "exo-4",
        title: "The Burning Bush",
        reference: "Exodus 3:1-15",
        summary: "After forty years shepherding in Midian, Moses sees a bush burning but not consumed. God calls from it, revealing Himself as the God of Abraham, Isaac, and Jacob. He commissions Moses to deliver Israel, revealing His name: 'I AM WHO I AM.' Moses, once impetuous, now offers excuse after excuse. God promises signs and His presence.",
        characters: ["Moses", "God"],
        themes: ["Divine Calling", "Holy Ground", "I AM"],
        lessonLearned: "God takes forty years of wilderness to prepare a man for leadership."
      },
      {
        id: "exo-5",
        title: "Moses' Excuses",
        reference: "Exodus 4:1-17",
        summary: "Moses offers five excuses: Who am I? What if they ask Your name? What if they don't believe me? I'm not eloquent. Please send someone else. God patiently answers each one with promises and signs—rod to serpent, leprous hand healed, water to blood. Finally God's anger burns, but He provides Aaron as Moses' spokesman rather than rejecting Moses altogether.",
        characters: ["Moses", "God", "Aaron (mentioned)"],
        themes: ["Inadequacy", "Divine Patience", "Calling"],
        lessonLearned: "God doesn't call the qualified; He qualifies the called."
      },
      {
        id: "exo-6",
        title: "Zipporah's Circumcision",
        reference: "Exodus 4:24-26",
        summary: "On the way to Egypt, God meets Moses and seeks to kill him. Zipporah quickly circumcises their son with a flint knife, touches Moses' feet with the foreskin, and says, 'You are a bridegroom of blood to me.' God lets Moses go. Moses had apparently neglected to circumcise his son—a serious covenant violation for one about to lead Israel.",
        characters: ["Moses", "Zipporah", "Their Son", "God"],
        themes: ["Covenant Obedience", "Near Death", "Intercession"],
        lessonLearned: "Leaders must be in covenant obedience before leading God's people."
      },
      {
        id: "exo-7",
        title: "Bricks Without Straw",
        reference: "Exodus 5:1-21",
        summary: "Moses and Aaron demand Pharaoh let Israel go worship. Pharaoh responds: 'Who is the Lord? I don't know Him.' He increases the burden—same quota of bricks but no straw provided. The Hebrew foremen are beaten. They curse Moses: 'You have put a sword in their hands to kill us!' Deliverance seems to make everything worse before it gets better.",
        characters: ["Moses", "Aaron", "Pharaoh", "Hebrew Foremen"],
        themes: ["Hardship Before Deliverance", "Testing", "Opposition"],
        lessonLearned: "God's deliverance often intensifies opposition before breakthrough."
      },
      {
        id: "exo-8",
        title: "The Rod Becomes a Serpent",
        reference: "Exodus 7:8-13",
        summary: "Before Pharaoh, Aaron throws down his rod and it becomes a serpent. Pharaoh's magicians replicate the sign with their enchantments. But Aaron's rod swallows their rods. Despite this demonstration of superior power, Pharaoh's heart is hardened. The battle lines are drawn between the God of Israel and Egypt's gods.",
        characters: ["Moses", "Aaron", "Pharaoh", "Egyptian Magicians"],
        themes: ["Power Encounter", "Spiritual Warfare", "Hardened Hearts"],
        lessonLearned: "God's power overcomes all counterfeits, but hardened hearts refuse to see."
      },
      {
        id: "exo-9",
        title: "Water to Blood",
        reference: "Exodus 7:14-25",
        summary: "The first plague: Aaron strikes the Nile with his rod, and all waters become blood. Fish die, the river stinks, Egyptians cannot drink. The Nile, worshipped as a god and source of life, becomes a river of death. Magicians replicate the sign, and Pharaoh hardens his heart. For seven days Egypt suffers.",
        characters: ["Moses", "Aaron", "Pharaoh"],
        themes: ["Judgment on Gods", "Stubbornness", "Plagues"],
        lessonLearned: "God judges the things people worship instead of Him."
      },
      {
        id: "exo-10",
        title: "The Plague of Frogs",
        reference: "Exodus 8:1-15",
        summary: "Frogs cover Egypt—in houses, bedrooms, beds, ovens, and kneading bowls. Pharaoh asks Moses to entreat God; he'll let Israel go. Moses asks when. 'Tomorrow,' says Pharaoh—spending one more night with frogs! The frogs die and are gathered into heaps, and the land stinks. But when Pharaoh sees relief, he hardens his heart again.",
        characters: ["Moses", "Aaron", "Pharaoh"],
        themes: ["Delayed Obedience", "Foolishness", "Broken Promises"],
        lessonLearned: "Why spend another night with the frogs? Repent today."
      },
      {
        id: "exo-11",
        title: "Gnats Without Warning",
        reference: "Exodus 8:16-19",
        summary: "Without warning, Aaron strikes the dust and gnats (or lice) cover all Egypt—man and beast. The magicians try to replicate this but cannot. They tell Pharaoh, 'This is the finger of God.' But Pharaoh's heart remains hard. The magicians have reached their limit—they can counterfeit no more.",
        characters: ["Moses", "Aaron", "Pharaoh", "Magicians"],
        themes: ["Divine Power", "Limits of Magic", "Hardness"],
        lessonLearned: "There are limits to what the enemy can counterfeit."
      },
      {
        id: "exo-12",
        title: "Flies and the First Distinction",
        reference: "Exodus 8:20-32",
        summary: "Swarms of flies fill Egypt, but for the first time, God makes a distinction—Goshen where Israel dwells has no flies. Pharaoh offers compromises: worship here, don't go far, just men can go. Moses refuses half-measures. Pharaoh agrees, Moses prays, the flies leave—and Pharaoh hardens his heart yet again.",
        characters: ["Moses", "Pharaoh"],
        themes: ["Divine Protection", "Compromise Refused", "Distinction"],
        lessonLearned: "God makes a distinction between His people and the world."
      },
      {
        id: "exo-13",
        title: "Death of Livestock",
        reference: "Exodus 9:1-7",
        summary: "The fifth plague kills all Egyptian livestock—horses, donkeys, camels, herds, and flocks—but not one of Israel's animals dies. Pharaoh sends to investigate and confirms Israel's livestock lives. Still, he hardens his heart. Egypt's agricultural economy is devastated, their gods proven powerless.",
        characters: ["Moses", "Pharaoh"],
        themes: ["Economic Judgment", "Divine Protection", "Obstinacy"],
        lessonLearned: "God protects His people even when judgment falls around them."
      },
      {
        id: "exo-14",
        title: "Boils on Man and Beast",
        reference: "Exodus 9:8-12",
        summary: "Moses throws furnace soot toward heaven, and boils break out on all Egyptians and their remaining animals. The magicians cannot even stand before Moses—they're covered in boils themselves. For the first time, the text says God hardened Pharaoh's heart, not that Pharaoh hardened his own.",
        characters: ["Moses", "Aaron", "Pharaoh", "Magicians"],
        themes: ["Physical Suffering", "Divine Hardening", "Defeat of Magic"],
        lessonLearned: "Continued resistance to God eventually leads to Him confirming our choice."
      },
      {
        id: "exo-15",
        title: "Hail with Fire",
        reference: "Exodus 9:13-35",
        summary: "God sends the worst hailstorm in Egypt's history—with fire flashing in the midst. God warns that any servants or livestock left outside will die. Some Egyptians fear God's word and bring theirs inside; others ignore it and lose everything. Pharaoh confesses, 'I have sinned. The Lord is righteous.' But when the hail stops, he sins more.",
        characters: ["Moses", "Pharaoh", "Egyptian Servants"],
        themes: ["Warning Heeded", "False Repentance", "Nature's Power"],
        lessonLearned: "Even in judgment, God gives warnings to those who will listen."
      },
      {
        id: "exo-16",
        title: "Locusts Devour Egypt",
        reference: "Exodus 10:1-20",
        summary: "Pharaoh's servants beg him: 'Let the men go! Don't you realize Egypt is destroyed?' Pharaoh offers to let only the men go. Moses refuses. Locusts cover Egypt so thick the ground is black, devouring every plant the hail left. Pharaoh summons Moses urgently, confessing sin, but when God removes the locusts, his heart hardens again.",
        characters: ["Moses", "Pharaoh", "Pharaoh's Servants"],
        themes: ["Total Destruction", "Advisors Ignored", "Cyclic Hardening"],
        lessonLearned: "When even your advisors warn you, it's time to repent fully."
      },
      {
        id: "exo-17",
        title: "Three Days of Darkness",
        reference: "Exodus 10:21-29",
        summary: "A darkness that can be felt covers Egypt for three days—so dark no one can see anyone or move. But Israel has light in their dwellings. Pharaoh offers another compromise: go, but leave your livestock. Moses says, 'Not a hoof shall be left behind.' Pharaoh threatens death if Moses sees his face again. Moses agrees: 'I will never see your face again.'",
        characters: ["Moses", "Pharaoh"],
        themes: ["Darkness", "Ultimatum", "No Compromise"],
        lessonLearned: "God's people must not leave anything behind that belongs to Him."
      },
      {
        id: "exo-18",
        title: "The Passover Instituted",
        reference: "Exodus 12:1-28",
        summary: "God instructs Israel: take a lamb on the tenth day, keep it until the fourteenth, kill it at twilight, put blood on doorposts and lintel. Eat it roasted with unleavened bread and bitter herbs, ready to leave. When God sees the blood, He will pass over. This becomes Israel's defining ceremony, pointing to Christ our Passover Lamb.",
        characters: ["Moses", "Aaron", "Israel"],
        themes: ["Blood", "Redemption", "Passover"],
        lessonLearned: "The blood of the lamb saves from judgment—then and now."
      },
      {
        id: "exo-19",
        title: "Death of the Firstborn",
        reference: "Exodus 12:29-36",
        summary: "At midnight, the Lord strikes every firstborn in Egypt—from Pharaoh's son to the prisoner's son to the firstborn of cattle. A great cry rises; there's not a house without someone dead. Pharaoh summons Moses and Aaron by night: 'Go! Take your flocks and herds. And bless me!' Egyptians urge Israel to leave, giving them silver, gold, and clothing.",
        characters: ["God", "Pharaoh", "Egyptians", "Israel"],
        themes: ["Judgment", "Final Plague", "Exodus"],
        lessonLearned: "The final judgment distinguishes those covered by the blood."
      },
      {
        id: "exo-20",
        title: "Crossing the Red Sea",
        reference: "Exodus 14:21-31",
        summary: "Trapped between Pharaoh's army and the sea, Israel panics. Moses says, 'Stand still and see the salvation of the Lord.' God opens the sea with a strong east wind. Israel walks through on dry ground, walls of water on both sides. When Egypt pursues, God throws them into confusion. The waters return, drowning the entire army. Israel fears the Lord and believes.",
        characters: ["Moses", "Israel", "Pharaoh's Army", "God"],
        themes: ["Impossible Situations", "Salvation", "Faith"],
        lessonLearned: "When there's no way forward and no way back, God makes a way through."
      },
      {
        id: "exo-21",
        title: "The Song of Moses and Miriam",
        reference: "Exodus 15:1-21",
        summary: "After crossing the sea, Moses leads Israel in triumphant song: 'The Lord is my strength and song; He has become my salvation.' The song recounts Egypt's drowning and prophesies nations trembling at Israel's coming. Then Miriam the prophetess takes a tambourine, and women follow her dancing: 'Sing to the Lord, for He has triumphed gloriously!'",
        characters: ["Moses", "Miriam", "Israel"],
        themes: ["Worship", "Victory", "Celebration"],
        lessonLearned: "Deliverance should lead to exuberant worship and proclamation."
      },
      {
        id: "exo-22",
        title: "Bitter Water Made Sweet",
        reference: "Exodus 15:22-27",
        summary: "Three days into the wilderness, Israel finds no water. At Marah, the water is bitter—undrinkable. The people grumble against Moses. God shows him a tree; when thrown into the water, it becomes sweet. God promises: if they obey, He won't put Egypt's diseases on them. He is 'the Lord who heals you.' They camp at Elim with twelve springs.",
        characters: ["Moses", "Israel", "God"],
        themes: ["Testing", "Provision", "Healing"],
        lessonLearned: "What seems bitter in our journey can become sweet through God's provision."
      },
      {
        id: "exo-23",
        title: "Manna from Heaven",
        reference: "Exodus 16:1-36",
        summary: "A month out of Egypt, Israel grumbles about food, reminiscing about Egypt's meat pots. God promises bread from heaven. Each morning, manna covers the ground—white like coriander seed, tasting like honey wafers. They gather daily; any kept overnight breeds worms. On the sixth day, they gather double because none appears on Sabbath. Manna sustains them forty years.",
        characters: ["Moses", "Israel", "God"],
        themes: ["Daily Provision", "Trust", "Sabbath"],
        lessonLearned: "God provides daily bread, teaching us to trust Him each day."
      },
      {
        id: "exo-24",
        title: "Water from the Rock",
        reference: "Exodus 17:1-7",
        summary: "At Rephidim, there's no water. Israel quarrels with Moses: 'Why did you bring us out to kill us with thirst?' Moses fears they'll stone him. God instructs him to strike the rock at Horeb with his staff. Water gushes out. Moses names the place Massah (testing) and Meribah (quarreling). The rock, Paul says, was Christ.",
        characters: ["Moses", "Israel", "God"],
        themes: ["Provision", "Complaining", "Christ the Rock"],
        lessonLearned: "The smitten rock gives living water—a picture of Christ crucified."
      },
      {
        id: "exo-25",
        title: "Israel Defeats Amalek",
        reference: "Exodus 17:8-16",
        summary: "Amalek attacks Israel at Rephidim. Moses sends Joshua to fight while he stands atop a hill holding the staff of God. When Moses' hands are raised, Israel prevails; when lowered, Amalek prevails. Aaron and Hur seat Moses on a stone and hold up his hands until sunset. Joshua defeats Amalek. God declares perpetual war against Amalek.",
        characters: ["Moses", "Joshua", "Aaron", "Hur", "Amalek"],
        themes: ["Spiritual Warfare", "Intercession", "Victory"],
        lessonLearned: "Battles are won by those who fight and those who hold up praying hands."
      },
      {
        id: "exo-26",
        title: "Jethro's Wise Counsel",
        reference: "Exodus 18:13-27",
        summary: "Moses sits judging the people from morning to evening. His father-in-law Jethro observes and warns: 'You will wear yourself out.' He advises Moses to delegate—appoint leaders over thousands, hundreds, fifties, and tens. They handle small matters; only major cases come to Moses. Moses listens to his father-in-law and implements the structure.",
        characters: ["Moses", "Jethro"],
        themes: ["Delegation", "Wisdom", "Leadership"],
        lessonLearned: "Wise leaders recognize their limits and delegate appropriately."
      },
      {
        id: "exo-27",
        title: "Trembling at Sinai",
        reference: "Exodus 19:16-25",
        summary: "On the third day, thunder, lightning, thick cloud, and trumpet blast cover Mount Sinai. The people tremble. The mountain smokes because God descends in fire. The trumpet grows louder. Moses speaks, and God answers in thunder. He alone is called up; strict boundaries prevent anyone else from touching the mountain on pain of death.",
        characters: ["Moses", "Israel", "God"],
        themes: ["Holy Fear", "Divine Presence", "Boundaries"],
        lessonLearned: "Approaching the holy God requires reverence and proper boundaries."
      },
      {
        id: "exo-28",
        title: "The Golden Calf",
        reference: "Exodus 32:1-35",
        summary: "While Moses is on Sinai forty days, Israel demands gods to lead them. Aaron collects gold earrings and fashions a calf idol. They declare, 'These are your gods who brought you out of Egypt!' and feast with revelry. God tells Moses His people have corrupted themselves. Moses descends, sees the calf and dancing, and shatters the tablets in anger.",
        characters: ["Moses", "Aaron", "Israel"],
        themes: ["Idolatry", "Impatience", "Broken Covenant"],
        lessonLearned: "Impatience with God's timing leads to making substitutes."
      },
      {
        id: "exo-29",
        title: "Moses Sees God's Glory",
        reference: "Exodus 33:18-23; 34:5-8",
        summary: "After the golden calf incident, Moses boldly asks, 'Show me Your glory.' God says no one can see His face and live, but He will make His goodness pass by while Moses hides in a rock cleft, God's hand covering him. When God passes, Moses sees His back. God proclaims His name: 'Merciful, gracious, slow to anger, abounding in love and truth.'",
        characters: ["Moses", "God"],
        themes: ["Glory", "God's Character", "Intimacy"],
        lessonLearned: "We cannot see God's face, but we can know His character."
      },
      {
        id: "exo-30",
        title: "Moses' Shining Face",
        reference: "Exodus 34:29-35",
        summary: "When Moses descends from Sinai with the new tablets, his face shines from speaking with God—he doesn't even know it. Aaron and the people are afraid to approach. Moses calls them, speaks God's commands, then puts a veil over his face. Whenever he speaks with God, he removes the veil; when speaking to Israel, he veils his face.",
        characters: ["Moses", "Aaron", "Israel"],
        themes: ["Transformation", "Glory", "Mediator"],
        lessonLearned: "Time in God's presence transforms us, often in ways we don't realize."
      }
    ]
  },

  // ============================================
  // JUDGES - 30 Stories
  // ============================================
  {
    book: "Judges",
    testament: "old",
    stories: [
      {
        id: "jdg-1",
        title: "Adoni-Bezek's Thumbs and Toes",
        reference: "Judges 1:4-7",
        summary: "Judah captures Adoni-Bezek, king of Bezek, and cuts off his thumbs and big toes. The king confesses: 'Seventy kings with their thumbs and big toes cut off used to gather scraps under my table. As I have done, so God has repaid me.' He dies in Jerusalem—experiencing the exact punishment he inflicted on others.",
        characters: ["Adoni-Bezek", "Men of Judah"],
        themes: ["Divine Justice", "Reaping What You Sow", "Confession"],
        lessonLearned: "What we do to others often returns to us in kind."
      },
      {
        id: "jdg-2",
        title: "Othniel Delivers Israel",
        reference: "Judges 3:7-11",
        summary: "Israel does evil, serves Baals and Asherahs, and God sells them to Cushan-Rishathaim of Mesopotamia for eight years. Israel cries out, and God raises up Othniel—Caleb's nephew—as deliverer. The Spirit of the Lord comes upon him, he judges Israel, goes to war, and prevails. The land has rest forty years until Othniel dies.",
        characters: ["Othniel", "Cushan-Rishathaim"],
        themes: ["Cycle of Judges", "Deliverance", "The Spirit"],
        lessonLearned: "God raises up deliverers when His people cry out in repentance."
      },
      {
        id: "jdg-3",
        title: "Ehud the Left-Handed Assassin",
        reference: "Judges 3:12-30",
        summary: "Moab oppresses Israel eighteen years. God raises up left-handed Ehud. He makes a double-edged sword, straps it to his right thigh (hidden during the left-side weapons check), and brings tribute to obese King Eglon. Claiming a secret message, he gets a private audience, stabs Eglon so deep the fat closes over the blade, locks the doors, and escapes. Israel defeats Moab.",
        characters: ["Ehud", "Eglon"],
        themes: ["Unconventional Methods", "Deliverance", "Cunning"],
        lessonLearned: "God uses the unexpected and unconventional to accomplish His purposes."
      },
      {
        id: "jdg-4",
        title: "Shamgar's Oxgoad",
        reference: "Judges 3:31",
        summary: "A single verse records Shamgar son of Anath, who killed six hundred Philistines with an oxgoad—a sharp farming implement. He also saved Israel. His story demonstrates that God can use anyone, any background, and any available tool to bring deliverance.",
        characters: ["Shamgar"],
        themes: ["Improvised Weapons", "Unlikely Heroes", "Deliverance"],
        lessonLearned: "God can use whatever is in your hand to accomplish great things."
      },
      {
        id: "jdg-5",
        title: "Deborah the Prophetess",
        reference: "Judges 4:1-10",
        summary: "Deborah, a prophetess, judges Israel under a palm tree. She summons Barak and delivers God's command to fight Sisera, commander of Jabin's army with 900 iron chariots. Barak refuses unless Deborah goes with him. She agrees but prophesies: the glory will go to a woman, not him. Ten thousand men follow Barak to Mount Tabor.",
        characters: ["Deborah", "Barak"],
        themes: ["Female Leadership", "Faith", "Prophecy"],
        lessonLearned: "God uses whomever is willing, regardless of gender."
      },
      {
        id: "jdg-6",
        title: "Jael Drives the Tent Peg",
        reference: "Judges 4:17-22",
        summary: "After Sisera's army is routed, he flees on foot to Jael's tent—her husband has peace with Jabin. She invites him in, covers him with a blanket, gives him milk. 'Stand guard,' he says, falling asleep exhausted. Jael takes a tent peg and hammer and drives it through his temple into the ground. When Barak arrives, she shows him Sisera dead.",
        characters: ["Jael", "Sisera", "Barak"],
        themes: ["Unexpected Hero", "Deception", "Fulfilled Prophecy"],
        lessonLearned: "God's prophecies come true through unexpected instruments."
      },
      {
        id: "jdg-7",
        title: "Gideon's Fleece",
        reference: "Judges 6:36-40",
        summary: "After God calls Gideon to deliver Israel, Gideon tests God twice with a wool fleece. First: 'Let there be dew on the fleece only, ground dry.' It happens. Then: 'Don't be angry—let the fleece be dry and ground wet.' God complies. Though often used as a model, Gideon's fleece-laying was actually a sign of weak faith needing extra assurance.",
        characters: ["Gideon", "God"],
        themes: ["Testing God", "Doubt", "Assurance"],
        lessonLearned: "God is patient with our doubts, but faith moves forward without constant tests."
      },
      {
        id: "jdg-8",
        title: "The 300 Lappers",
        reference: "Judges 7:1-8",
        summary: "Gideon assembles 32,000 men, but God says, 'Too many—they'll boast.' 22,000 fearful ones leave. Still too many. God tests them at water: those who lap water like dogs—300 men—are kept. The rest who kneel to drink are sent home. God purposely reduces Israel's army to absurdity, ensuring only He gets glory for victory.",
        characters: ["Gideon", "The 300", "God"],
        themes: ["Faith Over Numbers", "Divine Glory", "Selection"],
        lessonLearned: "God often reduces our resources so the victory is clearly His."
      },
      {
        id: "jdg-9",
        title: "Torches in Jars Victory",
        reference: "Judges 7:15-22",
        summary: "God encourages Gideon through a Midianite's dream of a bread loaf tumbling into camp. The 300 divide into three companies, each with trumpets and jars containing torches. At the middle watch, they surround the camp, break the jars, hold torches, blow trumpets, and shout, 'The sword of the Lord and of Gideon!' Midian panics and turns on each other.",
        characters: ["Gideon", "The 300", "Midianites"],
        themes: ["Unconventional Warfare", "Confusion", "Victory"],
        lessonLearned: "God's battle plans don't require conventional weapons."
      },
      {
        id: "jdg-10",
        title: "Gideon's Ephod Becomes a Snare",
        reference: "Judges 8:22-27",
        summary: "After victory, Israel asks Gideon to rule over them. He refuses: 'The Lord will rule over you.' But he asks for gold earrings from the plunder, makes an ephod (priestly garment), and sets it up in his city Ophrah. All Israel prostitutes itself worshipping it. It becomes 'a snare to Gideon and his family'—the deliverer creates a new stumbling block.",
        characters: ["Gideon", "Israel"],
        themes: ["Success Leading to Sin", "Idolatry", "Legacy"],
        lessonLearned: "Victory over enemies doesn't guarantee victory over temptation."
      },
      {
        id: "jdg-11",
        title: "Abimelech Murders His Brothers",
        reference: "Judges 9:1-6",
        summary: "After Gideon's death, his son Abimelech—by a Shechemite concubine—convinces Shechem's leaders to support his kingship. They give him silver from Baal's temple. He hires worthless men and murders seventy brothers on a single stone. Only Jotham, the youngest, escapes by hiding. Shechem crowns Abimelech king by the oak of Mazzebah.",
        characters: ["Abimelech", "Gideon's 70 Sons", "Jotham"],
        themes: ["Fratricide", "Ambition", "Violence"],
        lessonLearned: "Ungodly ambition leads to monstrous acts against one's own family."
      },
      {
        id: "jdg-12",
        title: "Jotham's Fable of the Trees",
        reference: "Judges 9:7-21",
        summary: "Escaped Jotham stands on Mount Gerizim and tells a parable. The trees seek a king: olive tree, fig tree, and vine all refuse to leave their productive work to 'wave over trees.' Only the thornbush (worthless, dangerous) accepts—demanding the trees take shelter under it or be consumed by its fire. Jotham curses Shechem and Abimelech to destroy each other.",
        characters: ["Jotham", "Shechem's Leaders"],
        themes: ["Parables", "Warning", "Justice"],
        lessonLearned: "Those most eager for leadership are often the least qualified."
      },
      {
        id: "jdg-13",
        title: "Abimelech Killed by a Millstone",
        reference: "Judges 9:50-57",
        summary: "Jotham's curse proves true. Shechem and Abimelech turn on each other. Abimelech burns the tower of Shechem, killing 1,000. At Thebez, people flee to a strong tower. As Abimelech approaches to burn it, a woman drops an upper millstone on his head, crushing his skull. He commands his armor-bearer to kill him so no one says 'a woman killed him.'",
        characters: ["Abimelech", "Woman of Thebez"],
        themes: ["Divine Justice", "Pride", "Fitting End"],
        lessonLearned: "God repays evil, sometimes through the most unexpected means."
      },
      {
        id: "jdg-14",
        title: "Jephthah's Tragic Vow",
        reference: "Judges 11:29-40",
        summary: "Jephthah, an outcast warrior's son, becomes Israel's leader against Ammon. Before battle, he vows: whatever comes out of his house to greet his return will be offered as a burnt offering. He wins. His only child, a daughter, comes dancing with tambourines to meet him. She accepts the vow, asks two months to mourn her virginity with friends, then returns to her fate.",
        characters: ["Jephthah", "Jephthah's Daughter"],
        themes: ["Rash Vows", "Tragedy", "Sacrifice"],
        lessonLearned: "Be extremely careful with vows—our words have consequences."
      },
      {
        id: "jdg-15",
        title: "Shibboleth",
        reference: "Judges 12:1-6",
        summary: "Ephraimites, angry they weren't invited to fight Ammon, threaten Jephthah. War breaks out. Gilead defeats Ephraim and captures the Jordan fords. To identify fleeing Ephraimites, they ask fugitives to say 'Shibboleth.' Ephraimites, unable to pronounce 'sh,' say 'Sibboleth' and are killed. 42,000 Ephraimites die, identified by a single word's pronunciation.",
        characters: ["Jephthah", "Gileadites", "Ephraimites"],
        themes: ["Civil War", "Identity", "Words"],
        lessonLearned: "Small distinctions can have life-or-death consequences."
      },
      {
        id: "jdg-16",
        title: "Samson's Riddle",
        reference: "Judges 14:5-20",
        summary: "En route to claim a Philistine wife, Samson kills a lion with bare hands. Later, bees make honey in its carcass. At his wedding feast, Samson poses a riddle: 'Out of the eater, something to eat; out of the strong, something sweet.' Unable to solve it, the Philistines threaten his wife. She weeps seven days until he tells her. When they answer correctly, Samson's rage begins.",
        characters: ["Samson", "Philistines", "Samson's Wife"],
        themes: ["Riddles", "Betrayal", "Anger"],
        lessonLearned: "Sharing secrets with the wrong people leads to betrayal."
      },
      {
        id: "jdg-17",
        title: "Samson and the Foxes",
        reference: "Judges 15:1-5",
        summary: "Samson's Philistine wife is given to another man. In vengeance, Samson catches 300 foxes, ties them tail-to-tail in pairs with torches between, and releases them into Philistine grain fields, vineyards, and olive groves. Everything burns. This begins a cycle of violence and retaliation.",
        characters: ["Samson", "Philistines"],
        themes: ["Vengeance", "Destruction", "Retaliation"],
        lessonLearned: "Personal vengeance often escalates conflict rather than resolving it."
      },
      {
        id: "jdg-18",
        title: "Samson's Jawbone Victory",
        reference: "Judges 15:9-17",
        summary: "Philistines demand Samson. Judah binds him with new ropes and delivers him. When Philistines shout in triumph, the Spirit rushes upon him. The ropes melt off. Finding a fresh donkey's jawbone, he kills 1,000 men with it, declaring, 'With the jawbone of a donkey, heaps upon heaps, I have struck down a thousand men.'",
        characters: ["Samson", "Philistines", "Men of Judah"],
        themes: ["Supernatural Strength", "Improvised Weapons", "Deliverance"],
        lessonLearned: "God's Spirit empowers with whatever is at hand."
      },
      {
        id: "jdg-19",
        title: "Samson Carries Gaza's Gates",
        reference: "Judges 16:1-3",
        summary: "Samson visits a prostitute in Gaza. The Philistines surround the city, planning to kill him at dawn. At midnight, Samson rises, grasps the city gate—doors, posts, bar and all—tears them loose, and carries them to the top of a hill facing Hebron, about 40 miles away. A display of supernatural strength and contempt for his enemies.",
        characters: ["Samson", "Philistines"],
        themes: ["Strength", "Defiance", "Vulnerability"],
        lessonLearned: "Physical strength doesn't compensate for moral weakness."
      },
      {
        id: "jdg-20",
        title: "Delilah's Deception",
        reference: "Judges 16:4-20",
        summary: "Samson loves Delilah. Philistine lords offer her 1,100 silver pieces each to discover his strength's secret. She asks repeatedly; he lies three times—binding with fresh bowstrings, new ropes, weaving his hair into a loom. Each time she tests him and he breaks free. Finally, worn down by her daily nagging, he reveals the truth: his hair has never been cut. She shaves his head while he sleeps.",
        characters: ["Samson", "Delilah", "Philistine Lords"],
        themes: ["Seduction", "Persistence of Temptation", "Fatal Disclosure"],
        lessonLearned: "Repeated exposure to temptation wears down resistance."
      },
      {
        id: "jdg-21",
        title: "Samson's Final Victory",
        reference: "Judges 16:21-30",
        summary: "Blinded and bound, Samson grinds grain in prison. His hair begins to grow. At a feast to Dagon, 3,000 Philistines call for Samson to entertain them. Positioned between the temple's main pillars, he prays for strength one last time. 'Let me die with the Philistines!' He pushes the pillars apart. The temple collapses, killing more at his death than during his life.",
        characters: ["Samson", "Philistines"],
        themes: ["Redemption", "Final Sacrifice", "Victory in Death"],
        lessonLearned: "God can use even our final moments for His purposes."
      },
      {
        id: "jdg-22",
        title: "Micah's Household Idol",
        reference: "Judges 17:1-13",
        summary: "Micah confesses stealing 1,100 silver pieces from his mother. She dedicates it to make an idol and ephod for Micah's shrine. He consecrates one of his sons as priest. When a wandering Levite arrives, Micah hires him instead, saying, 'Now I know the Lord will prosper me, because I have a Levite as priest'—mixing true priesthood with idolatry.",
        characters: ["Micah", "Micah's Mother", "Levite"],
        themes: ["Personal Religion", "Idolatry", "Corruption"],
        lessonLearned: "Creating our own religious system leads to corruption."
      },
      {
        id: "jdg-23",
        title: "Dan Steals Micah's Idols",
        reference: "Judges 18:1-31",
        summary: "The tribe of Dan, seeking territory, sends spies who discover Micah's shrine and Levite priest. Later, 600 armed Danites return, steal the idol, ephod, and household gods, and persuade the Levite to become priest for an entire tribe rather than one household. Micah pursues but is threatened. Dan conquers Laish, sets up the stolen idol, and Jonathan (Moses' grandson) becomes their priest.",
        characters: ["Danites", "Micah", "Levite/Jonathan"],
        themes: ["Theft", "Tribal Idolatry", "Corruption Spreads"],
        lessonLearned: "Personal sin often grows into institutional sin."
      },
      {
        id: "jdg-24",
        title: "The Levite's Concubine",
        reference: "Judges 19:1-30",
        summary: "A Levite's concubine leaves him and returns to her father in Bethlehem. After reconciliation, they travel home but stop in Gibeah of Benjamin. Wicked men demand the Levite; the host offers his daughter instead. The Levite pushes his concubine out. She's abused all night and found dead at dawn. He cuts her body into twelve pieces and sends them throughout Israel.",
        characters: ["Levite", "Concubine", "Men of Gibeah"],
        themes: ["Wickedness", "Violence", "Call to Action"],
        lessonLearned: "The darkest chapters show what happens when everyone does what's right in their own eyes."
      },
      {
        id: "jdg-25",
        title: "Israel's War Against Benjamin",
        reference: "Judges 20:1-48",
        summary: "All Israel assembles—400,000 soldiers—against Benjamin for defending Gibeah. Benjamin refuses to surrender the guilty. In two battles, Benjamin kills 40,000 Israelites. On the third day, using ambush tactics, Israel defeats Benjamin, killing 25,000 soldiers. They destroy Benjamite cities with fire, leaving only 600 men who escape to the rock of Rimmon.",
        characters: ["Israel", "Benjamin"],
        themes: ["Civil War", "Justice", "Near Extinction"],
        lessonLearned: "Sin within the community requires painful discipline, yet must be handled carefully."
      },
      {
        id: "jdg-26",
        title: "Wives for Benjamin",
        reference: "Judges 21:1-25",
        summary: "Israel swore not to give daughters to Benjamin. Now they grieve that a tribe faces extinction. They kill Jabesh-gilead for not joining the war and take 400 virgins for the surviving 600 Benjamites. For the remaining 200, they advise them to kidnap dancing girls at Shiloh's festival. The book ends: 'Everyone did what was right in his own eyes.'",
        characters: ["Israel", "Surviving Benjamites", "Women of Shiloh"],
        themes: ["Human Solutions", "Moral Chaos", "Anarchy"],
        lessonLearned: "Without godly leadership, even attempts at restoration involve sin."
      },
      {
        id: "jdg-27",
        title: "Ibzan's Thirty Sons and Thirty Daughters",
        reference: "Judges 12:8-10",
        summary: "Ibzan of Bethlehem judges Israel seven years. He has thirty sons and thirty daughters. He sends his daughters abroad in marriage and brings in thirty wives from outside for his sons. Then he dies and is buried in Bethlehem. His legacy is recorded in just three verses—prolific family, brief mention.",
        characters: ["Ibzan"],
        themes: ["Family", "Alliances", "Brief Leadership"],
        lessonLearned: "Some leaders are noted simply for maintaining peace and family."
      },
      {
        id: "jdg-28",
        title: "Abdon and His Seventy Donkeys",
        reference: "Judges 12:13-15",
        summary: "Abdon son of Hillel judges Israel eight years. He has forty sons and thirty grandsons who ride seventy donkeys—a sign of significant wealth and status. He dies and is buried in Ephraim. Like other minor judges, his account is brief, noting family prominence rather than military exploits.",
        characters: ["Abdon"],
        themes: ["Wealth", "Status", "Peaceful Rule"],
        lessonLearned: "Not all leadership involves dramatic battles; some is steady administration."
      },
      {
        id: "jdg-29",
        title: "The Angel's Appearance to Manoah's Wife",
        reference: "Judges 13:2-24",
        summary: "Manoah's barren wife encounters the Angel of the Lord who promises her a son—a Nazirite from the womb who will deliver Israel from Philistines. She must avoid wine, unclean food, and not cut his hair. Manoah asks for a return visit; the Angel reappears but refuses to give His name, calling it 'wonderful.' When they offer sacrifice, the Angel ascends in the flame.",
        characters: ["Manoah's Wife", "Manoah", "Angel of the Lord"],
        themes: ["Annunciation", "Nazirite Vow", "Divine Encounter"],
        lessonLearned: "God prepares deliverers before birth, setting them apart for His purposes."
      },
      {
        id: "jdg-30",
        title: "Samson's Prayer for Water",
        reference: "Judges 15:18-20",
        summary: "After killing 1,000 Philistines with a jawbone, Samson is desperately thirsty. He calls to God: 'You have given this great salvation, and now shall I die of thirst and fall into the hands of the uncircumcised?' God splits open a hollow place in Lehi, and water flows out. Samson drinks, revives, and names the spring En-hakkore ('spring of him who called').",
        characters: ["Samson", "God"],
        themes: ["Dependence", "Provision", "Prayer After Victory"],
        lessonLearned: "Great victories don't eliminate our need for God's provision."
      }
    ]
  },

  // ============================================
  // 1 SAMUEL - 30 Stories
  // ============================================
  {
    book: "1 Samuel",
    testament: "old",
    stories: [
      {
        id: "1sam-1",
        title: "Hannah's Bitter Weeping",
        reference: "1 Samuel 1:1-18",
        summary: "Hannah, one of Elkanah's two wives, is barren while Peninnah has many children. Year after year at Shiloh's tabernacle, Peninnah provokes Hannah until she weeps and cannot eat. In deep anguish, Hannah prays silently, lips moving without sound. Eli the priest thinks she's drunk. She explains her grief, and Eli pronounces blessing: 'Go in peace; may God grant your petition.'",
        characters: ["Hannah", "Elkanah", "Peninnah", "Eli"],
        themes: ["Barrenness", "Prayer", "Blessing"],
        lessonLearned: "God hears desperate, heartfelt prayers even when misunderstood by others."
      },
      {
        id: "1sam-2",
        title: "Samuel Given to the Lord",
        reference: "1 Samuel 1:19-28",
        summary: "God remembers Hannah, and she conceives Samuel. After weaning him, she brings him to the tabernacle with offerings. She declares to Eli: 'I am the woman who stood praying here. For this child I prayed, and the Lord granted my petition. Therefore I have lent him to the Lord; as long as he lives, he is lent to the Lord.' Young Samuel remains to serve at the tabernacle.",
        characters: ["Hannah", "Samuel", "Eli"],
        themes: ["Answered Prayer", "Dedication", "Vows Fulfilled"],
        lessonLearned: "What we receive from God can be given back for His purposes."
      },
      {
        id: "1sam-3",
        title: "Eli's Wicked Sons",
        reference: "1 Samuel 2:12-17, 22-25",
        summary: "Eli's sons Hophni and Phinehas are worthless—they don't know the Lord. They take meat from sacrifices before the fat is burned to God, threatening worshippers with violence. They sleep with women serving at the tabernacle entrance. Eli rebukes them weakly, but they don't listen. A prophecy comes: both will die on the same day, and Eli's house will be cut off.",
        characters: ["Hophni", "Phinehas", "Eli"],
        themes: ["Corruption", "Weak Discipline", "Judgment"],
        lessonLearned: "Failure to discipline leads to generational destruction."
      },
      {
        id: "1sam-4",
        title: "Samuel's Night Call",
        reference: "1 Samuel 3:1-21",
        summary: "Young Samuel sleeps near the ark when God calls his name. Three times he runs to Eli, thinking the priest called. Eli realizes it's the Lord and tells Samuel to respond, 'Speak, Lord, your servant hears.' God reveals judgment on Eli's house. In the morning, Eli commands Samuel to tell him everything. Samuel does, and Eli accepts: 'He is the Lord; let Him do what seems good.'",
        characters: ["Samuel", "God", "Eli"],
        themes: ["Divine Calling", "Prophecy", "Obedience"],
        lessonLearned: "Learning to recognize and respond to God's voice begins in youth."
      },
      {
        id: "1sam-5",
        title: "The Ark Captured",
        reference: "1 Samuel 4:1-22",
        summary: "Israel loses 4,000 men to the Philistines. Elders fetch the ark from Shiloh as a good-luck charm. Philistines tremble but fight desperately and win. They capture the ark and kill 30,000 Israelites, including Hophni and Phinehas. When Eli hears the news, he falls backward from his seat, breaks his neck, and dies. His daughter-in-law names her son Ichabod—'the glory has departed.'",
        characters: ["Eli", "Hophni", "Phinehas", "Philistines"],
        themes: ["Misusing Holy Things", "Judgment", "Glory Departed"],
        lessonLearned: "God cannot be manipulated—the ark isn't a magic object."
      },
      {
        id: "1sam-6",
        title: "Dagon Falls Before the Ark",
        reference: "1 Samuel 5:1-12",
        summary: "Philistines place the ark in Dagon's temple. The next morning, Dagon has fallen face-down before the ark. They set him up; the following morning, Dagon is fallen again, head and hands severed. Tumors and rats plague every city holding the ark—Ashdod, Gath, Ekron. After seven months of devastation, the Philistines desperately seek to return the ark.",
        characters: ["Philistines", "Dagon Idol"],
        themes: ["God's Power", "Judgment", "False Gods"],
        lessonLearned: "The true God defeats all rivals, even on their own turf."
      },
      {
        id: "1sam-7",
        title: "The Ark Returns on a Cart",
        reference: "1 Samuel 6:1-21",
        summary: "Philistine priests advise sending the ark back with a guilt offering—five gold tumors and five gold rats. They place it on a new cart pulled by two nursing cows, testing whether the God of Israel caused their plague. The cows, despite having calves, head straight to Beth-shemesh. Men there look into the ark and 70 die. They ask Kiriath-jearim to take it.",
        characters: ["Philistine Priests", "Men of Beth-shemesh"],
        themes: ["Testing God", "Holiness", "Reverence"],
        lessonLearned: "God's holiness must be approached with reverence, not curiosity."
      },
      {
        id: "1sam-8",
        title: "Israel Demands a King",
        reference: "1 Samuel 8:1-22",
        summary: "When Samuel is old, his corrupt sons judge Israel. Elders demand a king 'like all the nations.' Samuel is displeased and prays. God says, 'They have rejected Me as king.' Samuel warns what a king will take: sons for his armies, daughters for his service, fields, vineyards, servants, a tenth of everything. The people insist: 'We want a king!'",
        characters: ["Samuel", "Elders of Israel", "God"],
        themes: ["Rejecting God", "Worldly Desire", "Warnings Ignored"],
        lessonLearned: "Wanting to be like the world means rejecting God's unique plan."
      },
      {
        id: "1sam-9",
        title: "Saul Seeking Donkeys",
        reference: "1 Samuel 9:1-27",
        summary: "Saul, a tall, handsome Benjamite, searches for his father's lost donkeys. After days of searching, his servant suggests consulting the seer Samuel. God had already told Samuel: 'Tomorrow I will send you a man from Benjamin to anoint as king.' When Saul arrives, Samuel seats him in the place of honor, gives him the choice portion of meat, and speaks privately.",
        characters: ["Saul", "Samuel", "Saul's Servant"],
        themes: ["Divine Providence", "Humble Beginnings", "Anointing"],
        lessonLearned: "God orchestrates 'ordinary' circumstances to accomplish His purposes."
      },
      {
        id: "1sam-10",
        title: "Saul Anointed and Transformed",
        reference: "1 Samuel 10:1-16",
        summary: "Samuel anoints Saul with oil and kisses him—'The Lord has anointed you ruler.' He gives three signs for confirmation: meeting men near Rachel's tomb, receiving bread at the oak of Tabor, and meeting prophets at Gibeah. Saul will prophesy with them and be turned into another man. All three signs occur. The Spirit of God rushes upon Saul, and he prophesies.",
        characters: ["Samuel", "Saul"],
        themes: ["Anointing", "Spirit Empowerment", "Transformation"],
        lessonLearned: "God confirms His calling with signs and Spirit empowerment."
      },
      {
        id: "1sam-11",
        title: "Saul Hiding Among the Baggage",
        reference: "1 Samuel 10:17-27",
        summary: "Samuel gathers Israel to Mizpah to present the king. Through lots, Saul is chosen—but he cannot be found. They inquire of the Lord, who reveals Saul is hiding among the baggage. They find and present him, standing head and shoulders above everyone. Some 'worthless fellows' despise him, but Saul holds his peace.",
        characters: ["Samuel", "Saul", "Israel"],
        themes: ["Fear", "Humility", "Mixed Reception"],
        lessonLearned: "Even chosen leaders sometimes shrink from their calling."
      },
      {
        id: "1sam-12",
        title: "Saul's Impressive First Victory",
        reference: "1 Samuel 11:1-15",
        summary: "Nahash the Ammonite besieges Jabesh-gilead, demanding to gouge out every right eye as a treaty condition. Messengers reach Saul, who is plowing. The Spirit rushes on him; he cuts up his oxen and sends pieces throughout Israel, threatening anyone who doesn't join the army. 330,000 respond. They crush Ammon in a dawn attack. Israel then reconfirms Saul as king at Gilgal.",
        characters: ["Saul", "Nahash", "Men of Jabesh-gilead"],
        themes: ["Spirit Empowerment", "Righteous Anger", "Deliverance"],
        lessonLearned: "Leadership is proven in crisis response."
      },
      {
        id: "1sam-13",
        title: "Saul's Unlawful Sacrifice",
        reference: "1 Samuel 13:1-14",
        summary: "Facing a massive Philistine army, Saul waits seven days for Samuel as commanded. His troops scatter in fear. When Samuel doesn't arrive exactly on time, Saul offers the burnt offering himself—a priestly act forbidden to kings. Samuel arrives immediately after and pronounces judgment: 'Your kingdom shall not continue. The Lord has sought out a man after His own heart.'",
        characters: ["Saul", "Samuel"],
        themes: ["Impatience", "Disobedience", "Rejected Kingdom"],
        lessonLearned: "Obedience to God's commands cannot be compromised by circumstances."
      },
      {
        id: "1sam-14",
        title: "Jonathan's Bold Attack",
        reference: "1 Samuel 14:1-15",
        summary: "Jonathan and his armor-bearer secretly approach a Philistine outpost between two rocky crags. Jonathan reasons: 'Nothing can hinder the Lord from saving by many or by few.' They reveal themselves. If Philistines say, 'Come up,' it's a sign God has given victory. The Philistines taunt them to come up. Jonathan and his armor-bearer kill twenty men, and panic from God spreads through the enemy camp.",
        characters: ["Jonathan", "Armor-bearer"],
        themes: ["Faith", "Courage", "Small Numbers"],
        lessonLearned: "God is not limited by numbers—He can save through the faithful few."
      },
      {
        id: "1sam-15",
        title: "Saul's Foolish Oath",
        reference: "1 Samuel 14:24-46",
        summary: "During battle, Saul makes his army swear not to eat until evening. The exhausted troops grow faint. Jonathan, unaware of the oath, eats honey and is refreshed. When discovered by lots, Saul sentences him to death. The people rescue Jonathan: 'Shall he die who has accomplished this great salvation in Israel?' They ransom him.",
        characters: ["Saul", "Jonathan", "Israel's Army"],
        themes: ["Rash Vows", "Foolish Leadership", "Popular Intervention"],
        lessonLearned: "Leaders who make rash vows endanger the very ones serving them."
      },
      {
        id: "1sam-16",
        title: "Saul Spares Agag",
        reference: "1 Samuel 15:1-35",
        summary: "Samuel commands Saul to completely destroy the Amalekites—all people, livestock, everything. Saul defeats them but spares King Agag and the best animals, claiming to sacrifice them to God. Samuel confronts him: 'Has the Lord as great delight in burnt offerings as in obeying His voice? Obedience is better than sacrifice.' Saul is rejected as king. Samuel himself kills Agag.",
        characters: ["Samuel", "Saul", "Agag"],
        themes: ["Partial Obedience", "Excuses", "Final Rejection"],
        lessonLearned: "Partial obedience is disobedience—God wants full compliance, not our modifications."
      },
      {
        id: "1sam-17",
        title: "David Anointed in Secret",
        reference: "1 Samuel 16:1-13",
        summary: "God sends Samuel to Jesse's house to anoint the next king. Samuel sees Eliab and thinks, 'Surely this is the Lord's anointed.' But God says, 'Man looks at outward appearance; the Lord looks at the heart.' Seven sons pass—none chosen. David, the youngest, is tending sheep. They summon him. Samuel anoints him, and the Spirit of the Lord rushes on David from that day forward.",
        characters: ["Samuel", "David", "Jesse", "Jesse's Sons"],
        themes: ["Heart Over Appearance", "Secret Anointing", "Spirit Empowerment"],
        lessonLearned: "God's choice is based on the heart, not outward qualifications."
      },
      {
        id: "1sam-18",
        title: "David Plays for Troubled Saul",
        reference: "1 Samuel 16:14-23",
        summary: "The Spirit of the Lord departs from Saul, and a harmful spirit from the Lord torments him. His servants suggest finding a skillful musician. Someone knows David—a skillful player, a mighty man of valor, prudent, and handsome. When David plays his lyre, the harmful spirit departs and Saul is refreshed. Saul loves David greatly and makes him his armor-bearer.",
        characters: ["David", "Saul", "Saul's Servants"],
        themes: ["Music", "Spiritual Warfare", "Service"],
        lessonLearned: "Faithfulness in using our gifts opens doors we never expected."
      },
      {
        id: "1sam-19",
        title: "Goliath's Challenge",
        reference: "1 Samuel 17:1-11",
        summary: "Philistines and Israel face off across a valley. Goliath, a giant over nine feet tall, comes out daily for forty days, challenging Israel to send a champion. If he wins, Israel becomes slaves; if he loses, Philistines serve Israel. He mocks Israel's army and defies the living God. Saul and all Israel are dismayed and greatly afraid—no one dares accept.",
        characters: ["Goliath", "Saul", "Israel's Army"],
        themes: ["Intimidation", "Fear", "Mockery of God"],
        lessonLearned: "Giants seem invincible until someone sees them through eyes of faith."
      },
      {
        id: "1sam-20",
        title: "David Volunteers",
        reference: "1 Samuel 17:20-37",
        summary: "David, bringing provisions to his brothers, hears Goliath's taunt. He asks, 'Who is this uncircumcised Philistine that he should defy the armies of the living God?' His brother Eliab is angry, but David is brought to Saul. David says, 'Let no man's heart fail. I will go fight him.' He tells of killing a lion and bear protecting sheep: 'The Lord who delivered me from them will deliver me from this Philistine.'",
        characters: ["David", "Saul", "Eliab"],
        themes: ["Faith", "Past Victories", "Courage"],
        lessonLearned: "Past faithfulness in small things prepares us for great challenges."
      },
      {
        id: "1sam-21",
        title: "David Defeats Goliath",
        reference: "1 Samuel 17:38-54",
        summary: "Saul offers his armor, but David cannot move in it. He goes with staff, sling, and five smooth stones. Goliath scorns him: 'Am I a dog, that you come at me with sticks?' David responds: 'You come with sword and spear; I come in the name of the Lord of hosts.' He slings a stone into Goliath's forehead; the giant falls. David uses Goliath's own sword to behead him.",
        characters: ["David", "Goliath"],
        themes: ["Faith Over Weapons", "God's Name", "Victory"],
        lessonLearned: "The battle is the Lord's—faith in His name defeats any giant."
      },
      {
        id: "1sam-22",
        title: "Jonathan's Covenant with David",
        reference: "1 Samuel 18:1-4",
        summary: "Jonathan's soul is knit to David's. He loves David as his own soul. They make a covenant of friendship. Jonathan strips off his robe, armor, sword, bow, and belt—the insignia of crown prince—and gives them to David. This remarkable act symbolizes Jonathan's acceptance that David, not he, will be the next king.",
        characters: ["Jonathan", "David"],
        themes: ["Friendship", "Covenant", "Self-Sacrifice"],
        lessonLearned: "True friendship involves giving up personal ambition for the other's good."
      },
      {
        id: "1sam-23",
        title: "Saul's Jealousy Ignites",
        reference: "1 Samuel 18:5-16",
        summary: "David succeeds in everything Saul sends him to do. After a victory, women sing, 'Saul has struck down his thousands, and David his ten thousands.' Saul is very angry—David has more credit than he does. From that day, Saul eyes David suspiciously. The next day, a harmful spirit comes, and Saul hurls a spear at David twice as he plays the lyre. David escapes both times.",
        characters: ["Saul", "David", "Women of Israel"],
        themes: ["Jealousy", "Attempted Murder", "Divine Protection"],
        lessonLearned: "Success in God's calling often arouses jealousy in those it threatens."
      },
      {
        id: "1sam-24",
        title: "Michal Helps David Escape",
        reference: "1 Samuel 19:11-17",
        summary: "Saul sends messengers to watch David's house and kill him in the morning. His wife Michal warns him: 'If you don't escape tonight, tomorrow you'll be killed.' She lets him down through a window. She puts a household idol in bed with goat's hair for his head. When soldiers come, she says David is sick. When discovered, she lies that David threatened to kill her if she didn't help.",
        characters: ["David", "Michal", "Saul's Messengers"],
        themes: ["Escape", "Deception", "Wife's Loyalty"],
        lessonLearned: "Sometimes God uses unexpected people to protect us from danger."
      },
      {
        id: "1sam-25",
        title: "Saul Prophesies Naked",
        reference: "1 Samuel 19:18-24",
        summary: "David flees to Samuel at Ramah. Saul sends messengers to capture him, but the Spirit of God comes upon them and they prophesy. He sends more—they prophesy too. And more—same result. Finally, Saul goes himself. The Spirit comes upon him, he strips off his clothes, lies naked prophesying all day and night before Samuel. People ask, 'Is Saul also among the prophets?'",
        characters: ["Saul", "Samuel", "David", "Messengers"],
        themes: ["Spirit Override", "Humiliation", "Divine Protection"],
        lessonLearned: "God can override human plans in dramatic, humbling ways."
      },
      {
        id: "1sam-26",
        title: "David and Jonathan's Arrow Signal",
        reference: "1 Samuel 20:1-42",
        summary: "David and Jonathan devise a plan to test Saul's intentions. David hides; if Saul is angry at his absence from the feast, Jonathan will signal danger by shooting arrows 'beyond' a boy. At the feast, Saul rages at Jonathan for siding with David and even throws a spear at his own son. Jonathan shoots the arrows as the danger signal. The friends weep together and David flees.",
        characters: ["David", "Jonathan", "Saul"],
        themes: ["True Friendship", "Danger", "Farewell"],
        lessonLearned: "True friends risk everything to protect each other."
      },
      {
        id: "1sam-27",
        title: "David Eats Holy Bread",
        reference: "1 Samuel 21:1-9",
        summary: "Fleeing alone to Nob, David lies to Ahimelech the priest, claiming to be on a secret mission from Saul. He asks for bread; only the holy showbread is available, which only priests may eat. Ahimelech gives it if David's men have kept from women. David also takes Goliath's sword, stored there. Jesus later cites this as an example of mercy over ritual law.",
        characters: ["David", "Ahimelech"],
        themes: ["Necessity", "Holy Things", "Deception"],
        lessonLearned: "Human need can take precedence over ritual law—a principle Jesus affirmed."
      },
      {
        id: "1sam-28",
        title: "David Feigns Madness",
        reference: "1 Samuel 21:10-15",
        summary: "David flees to Achish, king of Gath—Goliath's city. Servants recognize him as the one the women sang about. Afraid, David pretends to be insane, scratching marks on gates, letting saliva run down his beard. Achish is disgusted: 'Do I lack madmen, that you bring this fellow to rave before me?' David escapes Gath alive through his act.",
        characters: ["David", "Achish King of Gath"],
        themes: ["Desperation", "Deception", "Survival"],
        lessonLearned: "David's moments of faithlessness remind us that even great men stumble."
      },
      {
        id: "1sam-29",
        title: "David Spares Saul in the Cave",
        reference: "1 Samuel 24:1-22",
        summary: "Saul hunts David with 3,000 men. He enters a cave to relieve himself—the very cave where David and his men hide in the shadows. Men urge David to kill Saul. Instead, David secretly cuts off a corner of Saul's robe. Even this troubles his conscience. After Saul leaves, David calls out, showing the piece of robe, proving he could have killed but didn't. Saul weeps and acknowledges David will surely be king.",
        characters: ["David", "Saul", "David's Men"],
        themes: ["Restraint", "Honoring Authority", "Conscience"],
        lessonLearned: "We must not harm those God has placed in authority, even when we have the opportunity."
      },
      {
        id: "1sam-30",
        title: "The Witch of Endor",
        reference: "1 Samuel 28:3-25",
        summary: "Facing the Philistines without God's guidance (Samuel is dead, God doesn't answer dreams or prophets), Saul disguises himself and consults a medium at Endor—the very practice he'd banned. He asks her to bring up Samuel. She does; Samuel's spirit appears, angry at being disturbed. He prophesies Saul and his sons will die tomorrow, and Israel will fall to the Philistines.",
        characters: ["Saul", "Witch of Endor", "Samuel's Spirit"],
        themes: ["Occult", "Desperation", "Judgment"],
        lessonLearned: "When we've rejected God's ways, no alternative can save us."
      }
    ]
  },

  // More books would continue here...
  // Adding placeholder structure for remaining books

  {
    book: "2 Samuel",
    testament: "old",
    stories: [
      {
        id: "2sam-1",
        title: "David Mourns Saul and Jonathan",
        reference: "2 Samuel 1:17-27",
        summary: "Upon learning of Saul and Jonathan's deaths on Mount Gilboa, David composes a lament—the Song of the Bow. 'How the mighty have fallen!' He honors Saul despite years of persecution and mourns Jonathan: 'Your love to me was extraordinary, surpassing the love of women.' He commands the song be taught to all Judah.",
        characters: ["David", "Saul (dead)", "Jonathan (dead)"],
        themes: ["Grief", "Honor", "Lament"],
        lessonLearned: "True character shows in how we respond to the death of those who opposed us."
      },
      {
        id: "2sam-2",
        title: "The Amalekite's Fatal Lie",
        reference: "2 Samuel 1:1-16",
        summary: "An Amalekite arrives claiming he killed Saul at the king's own request on Mount Gilboa. He brings Saul's crown and bracelet, expecting reward. Instead, David asks, 'How is it you were not afraid to destroy the Lord's anointed?' He orders the Amalekite executed. The man's lie cost him his life—David would never reward killing God's anointed.",
        characters: ["David", "Amalekite Messenger"],
        themes: ["Respect for Authority", "Lying", "Justice"],
        lessonLearned: "Fabricating stories for personal gain can have fatal consequences."
      },
      {
        id: "2sam-3",
        title: "Abner and Joab's Blood Feud",
        reference: "2 Samuel 2:18-32; 3:22-39",
        summary: "In battle, Abner reluctantly kills Asahel, Joab's brother, who refused to stop pursuing him. Later, when Abner defects to David, Joab lures him aside and murders him in revenge, despite Abner coming in peace. David publicly mourns Abner, curses Joab's house, and declares himself innocent of the blood of this righteous man.",
        characters: ["Abner", "Joab", "Asahel", "David"],
        themes: ["Revenge", "Blood Feuds", "Political Murder"],
        lessonLearned: "Personal vengeance corrupts even military heroes."
      },
      {
        id: "2sam-4",
        title: "Ish-bosheth Murdered in Bed",
        reference: "2 Samuel 4:1-12",
        summary: "Two captains, Rechab and Baanah, enter Ish-bosheth's house during his noon rest, stab him in the stomach, behead him, and bring the head to David expecting reward. David responds: 'When wicked men kill a righteous man in his own house on his bed, shall I not require his blood?' He executes them, cuts off their hands and feet, and hangs them by the pool.",
        characters: ["Ish-bosheth", "Rechab", "Baanah", "David"],
        themes: ["Assassination", "Justice", "Treachery Punished"],
        lessonLearned: "God does not need murder to accomplish His purposes for leadership."
      },
      {
        id: "2sam-5",
        title: "David Conquers Jerusalem",
        reference: "2 Samuel 5:6-10",
        summary: "The Jebusites taunt David that even the blind and lame could defend Jerusalem. David challenges his men: whoever strikes the Jebusites first through the water shaft will be chief. Joab goes up first. David captures the stronghold, calls it the City of David, and becomes greater and greater because the Lord of hosts is with him.",
        characters: ["David", "Joab", "Jebusites"],
        themes: ["Conquest", "Capital City", "God's Presence"],
        lessonLearned: "Arrogant defenses fall before those whom God empowers."
      },
      {
        id: "2sam-6",
        title: "Uzzah Touches the Ark",
        reference: "2 Samuel 6:1-11",
        summary: "David brings the ark from Abinadab's house on a new cart. When the oxen stumble, Uzzah reaches out to steady the ark and is struck dead by God. David is angry, then afraid. He leaves the ark at Obed-edom's house for three months, during which God blesses that household abundantly.",
        characters: ["David", "Uzzah", "Obed-edom"],
        themes: ["Holiness", "Proper Reverence", "Blessing"],
        lessonLearned: "Good intentions don't excuse ignoring God's prescribed methods."
      },
      {
        id: "2sam-7",
        title: "Michal Despises Dancing David",
        reference: "2 Samuel 6:12-23",
        summary: "David brings the ark to Jerusalem with celebration, dancing before the Lord with all his might wearing a linen ephod. Michal, watching from a window, despises him in her heart. She sarcastically mocks his undignified display. David responds that he was dancing before the Lord who chose him over her father. Michal remains childless to her death.",
        characters: ["David", "Michal"],
        themes: ["Worship", "Pride", "Contempt"],
        lessonLearned: "Despising genuine worship before God brings barrenness."
      },
      {
        id: "2sam-8",
        title: "God's Covenant with David",
        reference: "2 Samuel 7:1-17",
        summary: "David, living in a cedar palace while the ark dwells in a tent, wants to build God a house. Through Nathan, God declines—but makes an eternal promise: God will build David a house (dynasty). His son will build the temple. God will establish David's throne forever. This Davidic Covenant points ultimately to Christ.",
        characters: ["David", "Nathan", "God"],
        themes: ["Covenant", "Dynasty", "Messiah"],
        lessonLearned: "God's plans are greater than our plans—He builds the eternal house."
      },
      {
        id: "2sam-9",
        title: "David's Kindness to Mephibosheth",
        reference: "2 Samuel 9:1-13",
        summary: "David seeks anyone remaining from Saul's house to show kindness for Jonathan's sake. Ziba reveals Mephibosheth, Jonathan's crippled son, hiding in Lo-debar. David summons him; Mephibosheth falls on his face, calling himself a dead dog. David restores all Saul's land, and Mephibosheth eats at the king's table like one of David's sons for the rest of his life.",
        characters: ["David", "Mephibosheth", "Ziba"],
        themes: ["Covenant Loyalty", "Grace", "Restoration"],
        lessonLearned: "Grace seeks out the broken and seats them at the king's table."
      },
      {
        id: "2sam-10",
        title: "David Sees Bathsheba",
        reference: "2 Samuel 11:1-5",
        summary: "In spring when kings go to war, David stays in Jerusalem. Walking on his roof one evening, he sees a beautiful woman bathing. He inquires—she is Bathsheba, wife of Uriah the Hittite, one of his mighty men. David sends for her, lies with her, and she conceives. One look, one inquiry, one summons—a cascade of sin begins.",
        characters: ["David", "Bathsheba", "Uriah (mentioned)"],
        themes: ["Temptation", "Lust", "Abuse of Power"],
        lessonLearned: "Sin often begins with being in the wrong place at the wrong time."
      },
      {
        id: "2sam-11",
        title: "David's Failed Cover-Up",
        reference: "2 Samuel 11:6-13",
        summary: "To hide Bathsheba's pregnancy, David summons Uriah from battle, hoping he'll sleep with his wife. But Uriah sleeps at the palace door with the servants, unwilling to enjoy home comforts while the ark and army are in tents. David tries again, getting him drunk, but Uriah still won't go home. His integrity exposes David's corruption.",
        characters: ["David", "Uriah"],
        themes: ["Cover-Up", "Integrity", "Contrast"],
        lessonLearned: "A faithful soldier's integrity shames a compromised king."
      },
      {
        id: "2sam-12",
        title: "Uriah Carries His Death Warrant",
        reference: "2 Samuel 11:14-25",
        summary: "David writes Joab a letter: put Uriah in the fiercest fighting and withdraw so he dies. Uriah unknowingly carries his own death warrant. Joab obeys. Uriah is killed. When David hears, he dismissively says, 'The sword devours one as well as another.' He takes Bathsheba as his wife. But the thing David did displeased the Lord.",
        characters: ["David", "Joab", "Uriah"],
        themes: ["Murder", "Conspiracy", "Divine Displeasure"],
        lessonLearned: "Sin requires ever-greater sins to cover it—until God exposes all."
      },
      {
        id: "2sam-13",
        title: "Nathan's Parable of the Lamb",
        reference: "2 Samuel 12:1-15",
        summary: "Nathan tells David a story: a rich man with many flocks takes a poor man's only lamb—his family pet—to feed a guest. David erupts: 'That man deserves to die!' Nathan replies, 'You are the man.' He pronounces God's judgment: the sword will never depart from David's house; his wives will be given to another publicly. David confesses, 'I have sinned against the Lord.'",
        characters: ["David", "Nathan"],
        themes: ["Confrontation", "Conviction", "Confession"],
        lessonLearned: "We clearly see others' sins while blind to our own until confronted."
      },
      {
        id: "2sam-14",
        title: "David's Son Dies",
        reference: "2 Samuel 12:15-23",
        summary: "The child born to Bathsheba becomes ill. David fasts, lies on the ground, and pleads with God for seven days. The child dies. To everyone's surprise, David rises, washes, worships, and eats. His explanation: 'While the child lived, I fasted and wept, thinking perhaps God would be gracious. Now he is dead—I cannot bring him back. I will go to him; he will not return to me.'",
        characters: ["David", "Bathsheba", "The Child"],
        themes: ["Intercession", "Grief", "Hope Beyond Death"],
        lessonLearned: "We can hope to be reunited with those who die in infancy."
      },
      {
        id: "2sam-15",
        title: "Amnon's Crime Against Tamar",
        reference: "2 Samuel 13:1-22",
        summary: "Amnon, David's firstborn, is obsessed with his half-sister Tamar. His cousin Jonadab devises a scheme: feign illness, have Tamar bring food. Alone with her, Amnon rapes her despite her pleas. Afterward, his 'love' turns to hatred greater than his former lust. He throws her out. She lives desolate in Absalom's house. David is furious but does nothing.",
        characters: ["Amnon", "Tamar", "Jonadab", "David", "Absalom"],
        themes: ["Sexual Violence", "Lust", "Failed Justice"],
        lessonLearned: "A father's failure to discipline breeds deeper family destruction."
      },
      {
        id: "2sam-16",
        title: "Absalom's Revenge",
        reference: "2 Samuel 13:23-39",
        summary: "Absalom waits two years, hatred smoldering. He invites all the king's sons to a sheep-shearing feast. When Amnon is merry with wine, Absalom's servants kill him at their master's command. The other sons flee on mules. False news reaches David that all his sons are dead. Absalom flees to his grandfather in Geshur for three years.",
        characters: ["Absalom", "Amnon", "David"],
        themes: ["Revenge", "Murder", "Exile"],
        lessonLearned: "Delayed justice leads to vigilante revenge."
      },
      {
        id: "2sam-17",
        title: "Joab Uses the Wise Woman of Tekoa",
        reference: "2 Samuel 14:1-24",
        summary: "Joab sees David's heart yearning for exiled Absalom. He hires a wise woman from Tekoa to tell a fabricated story about her two sons—one killed the other, and now the clan wants to kill the survivor. David promises protection. She turns it on him: why won't he bring back his own banished one? David sees Joab's hand and permits Absalom's return—but won't see his face.",
        characters: ["Joab", "Wise Woman of Tekoa", "David", "Absalom"],
        themes: ["Manipulation", "Partial Reconciliation", "Wisdom"],
        lessonLearned: "Half-measures in reconciliation satisfy no one."
      },
      {
        id: "2sam-18",
        title: "Absalom Burns Joab's Field",
        reference: "2 Samuel 14:28-33",
        summary: "Absalom lives in Jerusalem two years without seeing his father's face. He summons Joab twice to intercede; Joab won't come. Absalom orders his servants to set Joab's barley field on fire. That gets Joab's attention. Through him, Absalom finally appears before David. The king kisses him—but the relationship is never truly restored.",
        characters: ["Absalom", "Joab", "David"],
        themes: ["Impatience", "Manipulation", "Superficial Reconciliation"],
        lessonLearned: "Forced reconciliation without heart change leads to greater rebellion."
      },
      {
        id: "2sam-19",
        title: "Absalom Steals Hearts",
        reference: "2 Samuel 15:1-12",
        summary: "Absalom stations himself at the city gate with chariot and runners. When anyone comes with a case for the king, Absalom sympathizes: 'Your case is good, but there's no one to hear you. If only I were judge!' He takes their hand and kisses them. For four years he steals the hearts of Israel. Then he goes to Hebron and declares himself king.",
        characters: ["Absalom", "People of Israel"],
        themes: ["Political Manipulation", "Conspiracy", "Stolen Loyalty"],
        lessonLearned: "Charisma without character leads to rebellion and destruction."
      },
      {
        id: "2sam-20",
        title: "David Flees Jerusalem",
        reference: "2 Samuel 15:13-30",
        summary: "Word reaches David: Israel's hearts are with Absalom. David immediately flees with his household, barefoot, weeping, head covered. He leaves ten concubines to keep the palace. The ark is brought out, but David sends it back: if he finds favor with God, he'll return; if not, let God do what seems good. All the land weeps as David crosses Kidron.",
        characters: ["David", "Zadok", "Abiathar", "Ittai"],
        themes: ["Flight", "Humility", "Submission to God"],
        lessonLearned: "True faith submits to God's will even when losing everything."
      },
      {
        id: "2sam-21",
        title: "Shimei Curses David",
        reference: "2 Samuel 16:5-14",
        summary: "As David flees, Shimei of Saul's clan follows, cursing and throwing stones: 'Get out, you man of blood! The Lord has repaid you for Saul's house!' Abishai wants to kill him. David stops him: 'Let him curse; perhaps the Lord told him to. Maybe the Lord will repay me with good for this cursing today.' David accepts the humiliation.",
        characters: ["David", "Shimei", "Abishai"],
        themes: ["Cursing", "Restraint", "Humility"],
        lessonLearned: "Accepting unjust treatment without retaliation shows true humility."
      },
      {
        id: "2sam-22",
        title: "Absalom Takes David's Concubines",
        reference: "2 Samuel 16:20-23",
        summary: "Ahithophel advises Absalom to publicly take David's concubines on the palace roof, so all Israel knows there's no turning back. Absalom does so in the sight of all Israel. Nathan's prophecy is fulfilled: David's sin in secret is punished publicly. What David did with Bathsheba in private, his son does with ten women openly.",
        characters: ["Absalom", "Ahithophel", "Concubines"],
        themes: ["Public Shame", "Prophetic Fulfillment", "Reaping What You Sow"],
        lessonLearned: "Secret sins often result in public consequences."
      },
      {
        id: "2sam-23",
        title: "Ahithophel's Counsel Rejected",
        reference: "2 Samuel 17:1-23",
        summary: "Ahithophel advises immediate pursuit to kill David alone while he's weary. But Hushai (David's spy) counters: Absalom should gather all Israel and lead them personally. Absalom chooses Hushai's advice—God working to defeat Ahithophel's good counsel. When Ahithophel sees his advice rejected, knowing the result, he goes home, sets his affairs in order, and hangs himself.",
        characters: ["Ahithophel", "Hushai", "Absalom"],
        themes: ["Counsel", "Providence", "Suicide"],
        lessonLearned: "God can confuse the wisest counsel of our enemies."
      },
      {
        id: "2sam-24",
        title: "Absalom Caught in the Oak",
        reference: "2 Samuel 18:9-18",
        summary: "In battle, Absalom riding his mule passes under an oak tree. His famous thick hair catches in the branches; the mule keeps going, leaving him hanging between heaven and earth. A soldier reports to Joab but won't strike the king's son. Joab takes three javelins, thrusts them through Absalom's heart while he still lives. Ten armor-bearers finish the job.",
        characters: ["Absalom", "Joab", "Soldier"],
        themes: ["Ironic Death", "Disobedience", "Rebellion's End"],
        lessonLearned: "Pride (his hair was his glory) becomes the instrument of destruction."
      },
      {
        id: "2sam-25",
        title: "David's Grief for Absalom",
        reference: "2 Samuel 18:31-19:8",
        summary: "When David hears Absalom is dead, he's shattered. Going to his chamber, he weeps: 'O my son Absalom! My son, my son Absalom! Would I had died instead of you!' Victory becomes mourning; the army sneaks back ashamed. Joab harshly rebukes David: he loves enemies and hates friends. If he doesn't encourage the troops, none will remain by morning.",
        characters: ["David", "Joab", "Messengers"],
        themes: ["Grief", "Parental Love", "Leadership Failure"],
        lessonLearned: "Private grief must not eclipse public responsibility."
      },
      {
        id: "2sam-26",
        title: "Sheba's Rebellion",
        reference: "2 Samuel 20:1-22",
        summary: "A worthless man named Sheba blows a trumpet: 'We have no portion in David!' Israel abandons David, following Sheba. David sends Amasa (replacing Joab) to pursue. Joab, pretending friendship, grabs Amasa's beard to kiss him and stabs him with his hidden sword. Sheba takes refuge in Abel Beth-maacah. A wise woman negotiates: his head is thrown over the wall.",
        characters: ["Sheba", "Joab", "Amasa", "Wise Woman of Abel"],
        themes: ["Rebellion", "Murder", "Wisdom"],
        lessonLearned: "One wise voice can save an entire city from destruction."
      },
      {
        id: "2sam-27",
        title: "Rizpah Guards the Bodies",
        reference: "2 Samuel 21:1-14",
        summary: "Famine strikes Israel three years. God reveals it's due to Saul's bloodguilt against the Gibeonites. They request seven of Saul's descendants; David hands them over for execution. Rizpah, mother of two victims, spreads sackcloth on a rock and guards the exposed bodies from birds by day and beasts by night—from harvest until rain comes. Moved, David buries them properly.",
        characters: ["Rizpah", "David", "Gibeonites"],
        themes: ["Covenant Violation", "Maternal Devotion", "Proper Burial"],
        lessonLearned: "Devotion can shame even kings into doing what's right."
      },
      {
        id: "2sam-28",
        title: "David's Mighty Men",
        reference: "2 Samuel 23:8-39",
        summary: "A catalog of David's warriors: Josheb-basshebeth killed 800 in one encounter. Eleazar stood his ground until his hand froze to his sword. Shammah defended a lentil field alone. Three broke through Philistine lines to get David water from Bethlehem's well; he refused to drink it, pouring it out as an offering because it cost their blood. Benaiah killed a lion in a pit on a snowy day.",
        characters: ["David's Mighty Men", "Josheb-basshebeth", "Eleazar", "Shammah", "Benaiah"],
        themes: ["Courage", "Loyalty", "Heroism"],
        lessonLearned: "Great leaders attract and honor great followers."
      },
      {
        id: "2sam-29",
        title: "David's Census and Plague",
        reference: "2 Samuel 24:1-17",
        summary: "David commands a census of Israel—counting his military strength. Even Joab protests. After nine months, results show 800,000 warriors in Israel and 500,000 in Judah. David's heart strikes him: 'I have sinned greatly.' God offers three punishments: three years famine, three months fleeing enemies, or three days plague. David chooses to fall into God's hand. 70,000 die.",
        characters: ["David", "Joab", "Gad", "Angel of the Lord"],
        themes: ["Pride", "Census", "Judgment"],
        lessonLearned: "Trusting in numbers rather than God brings devastating consequences."
      },
      {
        id: "2sam-30",
        title: "David Buys Araunah's Threshing Floor",
        reference: "2 Samuel 24:18-25",
        summary: "The angel stops at Araunah's threshing floor. Gad tells David to build an altar there. Araunah offers the floor, oxen, and wood for free. David refuses: 'I will not offer burnt offerings to the Lord my God that cost me nothing.' He pays fifty shekels of silver, builds an altar, offers sacrifices. The plague stops. This site becomes where Solomon builds the temple.",
        characters: ["David", "Araunah", "Gad"],
        themes: ["Costly Worship", "Sacrifice", "Temple Site"],
        lessonLearned: "True worship costs something—we cannot give God what costs us nothing."
      }
    ]
  },

  // ============================================
  // 1 KINGS - 30 Stories
  // ============================================
  {
    book: "1 Kings",
    testament: "old",
    stories: [
      {
        id: "1ki-1",
        title: "Adonijah's Premature Coronation",
        reference: "1 Kings 1:1-27",
        summary: "As David grows old and feeble, his son Adonijah declares himself king without David's approval. He gathers Joab and Abiathar the priest, sacrifices at En-rogel, and invites all the royal sons except Solomon. Nathan the prophet and Bathsheba aren't invited either. Nathan alerts Bathsheba to the coup, advising her to approach David immediately.",
        characters: ["Adonijah", "David", "Nathan", "Bathsheba", "Joab"],
        themes: ["Usurpation", "Impatience", "Political Intrigue"],
        lessonLearned: "Grasping for position God hasn't given leads to downfall."
      },
      {
        id: "1ki-2",
        title: "Solomon Anointed at Gihon",
        reference: "1 Kings 1:28-53",
        summary: "Bathsheba and Nathan remind aged David of his oath to make Solomon king. David commands Zadok and Nathan to anoint Solomon at Gihon spring. They do so with the horn of oil; the trumpet sounds; people shout 'Long live King Solomon!' The noise reaches Adonijah's feast. Jonathan brings news; guests scatter in terror. Adonijah grasps the altar horns for mercy.",
        characters: ["Solomon", "David", "Zadok", "Nathan", "Adonijah"],
        themes: ["Anointing", "Succession", "Fear"],
        lessonLearned: "God's chosen timing supersedes human schemes."
      },
      {
        id: "1ki-3",
        title: "David's Final Instructions",
        reference: "1 Kings 2:1-12",
        summary: "Dying David charges Solomon: be strong, walk in God's ways, so God may establish His promise. He also instructs Solomon about scores to settle: deal with Joab for murdering Abner and Amasa; show kindness to Barzillai's sons; don't let Shimei's gray head go down to the grave in peace. David dies after forty years reigning and is buried in the City of David.",
        characters: ["David", "Solomon"],
        themes: ["Final Instructions", "Justice", "Death"],
        lessonLearned: "Death doesn't erase the need for unfinished justice."
      },
      {
        id: "1ki-4",
        title: "Adonijah's Fatal Request",
        reference: "1 Kings 2:13-25",
        summary: "Adonijah asks Bathsheba to request Abishag—David's young nurse—as his wife. Bathsheba brings the request to Solomon. Solomon explodes: asking for the king's concubine is tantamount to asking for the kingdom. That day he has Adonijah executed. Adonijah's seemingly innocent request reveals his unextinguished ambition.",
        characters: ["Adonijah", "Bathsheba", "Solomon", "Abishag"],
        themes: ["Ambition", "Concubines", "Fatal Request"],
        lessonLearned: "Hidden ambition eventually reveals itself and invites destruction."
      },
      {
        id: "1ki-5",
        title: "Joab Killed at the Altar",
        reference: "1 Kings 2:28-35",
        summary: "When Joab hears of Adonijah's death, he flees to the tabernacle and grasps the altar horns. Solomon sends Benaiah to strike him down. Joab refuses to leave: 'I will die here.' Solomon orders his death anyway—bloodguilt for innocent men must be removed. Benaiah kills Joab at the altar. Solomon appoints Benaiah as commander in his place.",
        characters: ["Joab", "Solomon", "Benaiah"],
        themes: ["Justice", "Sanctuary", "Bloodguilt"],
        lessonLearned: "The altar cannot protect those guilty of unprovoked murder."
      },
      {
        id: "1ki-6",
        title: "Shimei's Broken Promise",
        reference: "1 Kings 2:36-46",
        summary: "Solomon confines Shimei to Jerusalem: if he ever leaves and crosses the Kidron, he will die. Shimei agrees. Three years later, two slaves escape to Gath. Shimei pursues them and brings them back. Solomon confronts him: 'You know the evil you did to David. Now your blood is on your own head.' Benaiah strikes him down.",
        characters: ["Solomon", "Shimei", "Benaiah"],
        themes: ["Promises", "Violation", "Consequences"],
        lessonLearned: "Broken commitments eventually catch up with us."
      },
      {
        id: "1ki-7",
        title: "Solomon Asks for Wisdom",
        reference: "1 Kings 3:4-15",
        summary: "At Gibeon, God appears to Solomon in a dream: 'Ask what I should give you.' Solomon asks for an understanding heart to judge God's people and discern good from evil. God is pleased he didn't ask for long life, riches, or enemies' deaths. He grants wisdom surpassing all men, plus riches and honor. Solomon awakens; it was a dream, but God's promise was real.",
        characters: ["Solomon", "God"],
        themes: ["Wisdom", "Humility", "Divine Gift"],
        lessonLearned: "Asking for wisdom to serve others pleases God more than selfish requests."
      },
      {
        id: "1ki-8",
        title: "Two Mothers, One Baby",
        reference: "1 Kings 3:16-28",
        summary: "Two prostitutes share a house; both have babies. One baby dies at night; that mother swaps babies. Both claim the living child before Solomon. He commands: 'Bring a sword. Divide the living child in two—half to each.' The true mother cries, 'Give her the child! Don't kill him!' The other says, 'Let it be neither's—divide him!' Solomon awards the child to the first woman.",
        characters: ["Solomon", "Two Prostitutes"],
        themes: ["Wisdom", "Justice", "Motherly Love"],
        lessonLearned: "True love sacrifices its rights; false love would rather destroy than lose."
      },
      {
        id: "1ki-9",
        title: "Solomon Builds the Temple",
        reference: "1 Kings 6:1-38",
        summary: "In Solomon's fourth year, 480 years after the Exodus, temple construction begins. It takes seven years. The structure is cedar and stone, covered in gold. Cherubim overlook the ark in the inner sanctuary. God promises: if Solomon walks in His statutes, He will dwell among Israel and not forsake His people. Every detail fulfills David's vision.",
        characters: ["Solomon", "Hiram of Tyre", "God"],
        themes: ["Temple Building", "Divine Dwelling", "Covenant"],
        lessonLearned: "What God promises to one generation, He accomplishes through the next."
      },
      {
        id: "1ki-10",
        title: "The Ark Enters the Temple",
        reference: "1 Kings 8:1-11",
        summary: "Solomon assembles all Israel to bring the ark into the temple. Priests carry it into the Most Holy Place beneath the cherubim's wings. There is nothing in the ark except the two stone tablets. When priests exit, a cloud fills the temple—the glory of the Lord—so priests cannot stand to minister. God has come to dwell with His people.",
        characters: ["Solomon", "Priests", "Elders"],
        themes: ["Divine Presence", "Glory", "Worship"],
        lessonLearned: "When God's presence comes, human activity must cease."
      },
      {
        id: "1ki-11",
        title: "Solomon's Dedicatory Prayer",
        reference: "1 Kings 8:22-53",
        summary: "Solomon spreads his hands toward heaven and prays: heaven of heavens cannot contain God, yet hear from this house. He lists scenarios—sin, defeat, drought, famine, plague—asking God to hear when people pray toward this place. He asks God to maintain Israel's cause daily, so all peoples know the Lord is God. It's the Bible's longest prayer.",
        characters: ["Solomon", "God"],
        themes: ["Prayer", "Forgiveness", "Mission"],
        lessonLearned: "Temple prayer isn't about the building but about turning hearts to God."
      },
      {
        id: "1ki-12",
        title: "The Queen of Sheba's Visit",
        reference: "1 Kings 10:1-13",
        summary: "Hearing of Solomon's fame, the Queen of Sheba comes to test him with hard questions. She brings gold, spices, and precious stones in unprecedented quantity. Solomon answers all her questions; nothing is hidden from him. Seeing his wisdom, palace, servants, and burnt offerings, she's breathless: 'The report was true, but I wasn't told the half!' She blesses God and returns home.",
        characters: ["Solomon", "Queen of Sheba"],
        themes: ["Wisdom Validated", "Wealth", "Divine Blessing"],
        lessonLearned: "True wisdom attracts seekers from the ends of the earth."
      },
      {
        id: "1ki-13",
        title: "Solomon's Foreign Wives",
        reference: "1 Kings 11:1-13",
        summary: "Solomon loves many foreign women—700 wives, 300 concubines—from nations God forbade. They turn his heart to other gods: Ashtoreth of Sidon, Milcom and Molech of Ammon. He builds high places for his wives' gods. The Lord is angry; because of David, He won't tear away the kingdom in Solomon's lifetime, but will tear it from his son, leaving only one tribe.",
        characters: ["Solomon", "Foreign Wives", "God"],
        themes: ["Compromise", "Idolatry", "Divided Heart"],
        lessonLearned: "Worldly alliances gradually erode spiritual devotion."
      },
      {
        id: "1ki-14",
        title: "Ahijah Tears His Cloak",
        reference: "1 Kings 11:26-40",
        summary: "Jeroboam, a capable official, meets prophet Ahijah outside Jerusalem. Ahijah tears his new cloak into twelve pieces and gives Jeroboam ten: God is tearing the kingdom from Solomon because of idolatry. Ten tribes go to Jeroboam; one remains for David's sake. If Jeroboam walks in God's ways, God will build him an enduring house. Solomon tries to kill Jeroboam, who flees to Egypt.",
        characters: ["Jeroboam", "Ahijah", "Solomon"],
        themes: ["Torn Kingdom", "Prophecy", "Conditional Promise"],
        lessonLearned: "God's patience with sin has limits, even for the wisest king."
      },
      {
        id: "1ki-15",
        title: "Rehoboam's Foolish Decision",
        reference: "1 Kings 12:1-19",
        summary: "All Israel asks Rehoboam to lighten Solomon's heavy yoke. Old advisors counsel gentleness; young advisors suggest even harsher treatment. Rehoboam follows the young men: 'My little finger is thicker than my father's waist. He whipped you; I'll scourge you with scorpions.' Ten tribes rebel, stoning his taskmaster. Only Judah and Benjamin remain loyal. The kingdom divides.",
        characters: ["Rehoboam", "Old Advisors", "Young Advisors", "Israel"],
        themes: ["Bad Counsel", "Arrogance", "Division"],
        lessonLearned: "Pride and harsh words can shatter in minutes what took generations to build."
      },
      {
        id: "1ki-16",
        title: "Jeroboam's Golden Calves",
        reference: "1 Kings 12:25-33",
        summary: "Jeroboam fears that if Israel goes to Jerusalem to sacrifice, their hearts will return to Rehoboam. He makes two golden calves, placing one in Bethel, one in Dan: 'Here are your gods who brought you out of Egypt!' He builds high places, appoints non-Levitical priests, and invents a festival in the eighth month. This becomes 'the sin of Jeroboam' that plagued Israel for generations.",
        characters: ["Jeroboam"],
        themes: ["False Worship", "Political Religion", "Generational Sin"],
        lessonLearned: "Convenient religion replaces true worship with convenient substitutes."
      },
      {
        id: "1ki-17",
        title: "The Man of God from Judah",
        reference: "1 Kings 13:1-32",
        summary: "A prophet from Judah condemns Jeroboam's altar at Bethel, predicting King Josiah will burn bones on it. The altar splits; Jeroboam's hand withers when he orders the prophet seized. Healed through prayer, Jeroboam invites him home, but the prophet refuses—God forbade eating there. An old prophet lies, saying an angel changed the command. The man of God eats, then is killed by a lion on the road.",
        characters: ["Man of God", "Jeroboam", "Old Prophet"],
        themes: ["Prophecy", "Disobedience", "Deception"],
        lessonLearned: "Obeying what God clearly said trumps any seemingly contradictory 'revelation.'"
      },
      {
        id: "1ki-18",
        title: "Ahijah Prophesies Jeroboam's Doom",
        reference: "1 Kings 14:1-18",
        summary: "Jeroboam's son Abijah is sick. He sends his wife in disguise to blind prophet Ahijah at Shiloh. God tells Ahijah she's coming. Before she speaks, he announces: 'Come in, wife of Jeroboam. Why pretend?' He prophesies judgment—Jeroboam's house will be cut off; dogs and birds will eat the dead. Only this sick child will be mourned because good was found in him. The child dies as she enters home.",
        characters: ["Ahijah", "Jeroboam's Wife", "Jeroboam"],
        themes: ["Disguise Fails", "Judgment", "Small Grace"],
        lessonLearned: "You cannot disguise yourself from God or His prophets."
      },
      {
        id: "1ki-19",
        title: "Elijah Declares Drought",
        reference: "1 Kings 17:1-7",
        summary: "Elijah the Tishbite appears abruptly: 'As the Lord lives, before whom I stand, there will be neither dew nor rain these years except by my word.' No introduction, no background—just confrontation with Ahab, Israel's wickedest king. God sends Elijah to the brook Cherith, where ravens bring bread and meat morning and evening until the brook dries up.",
        characters: ["Elijah", "Ahab"],
        themes: ["Drought", "Judgment", "Divine Provision"],
        lessonLearned: "God provides for His prophets even as He judges a nation."
      },
      {
        id: "1ki-20",
        title: "The Widow of Zarephath",
        reference: "1 Kings 17:8-16",
        summary: "When Cherith dries up, God sends Elijah to a widow in Zarephath—Sidon, Jezebel's homeland! She's gathering sticks to prepare a last meal for herself and her son, then die. Elijah asks for bread first, promising her jar of flour and jug of oil won't run out until rain returns. She obeys. The flour and oil sustain them daily throughout the famine—a Gentile widow feeding God's prophet.",
        characters: ["Elijah", "Widow of Zarephath", "Her Son"],
        themes: ["Faith", "Provision", "Unlikely Vessels"],
        lessonLearned: "Sometimes God sends us to unlikely people in unlikely places for provision."
      },
      {
        id: "1ki-21",
        title: "The Widow's Son Raised",
        reference: "1 Kings 17:17-24",
        summary: "The widow's son becomes ill and stops breathing. She accuses Elijah: 'Have you come to remind me of my sin and kill my son?' Elijah takes the boy upstairs, stretches himself over him three times, crying out for life to return. The Lord hears; the boy revives. Elijah presents him alive. The widow declares: 'Now I know you are a man of God and the Lord's word in your mouth is truth.'",
        characters: ["Elijah", "Widow", "Her Son"],
        themes: ["Resurrection", "Faith Tested", "Prophet Validated"],
        lessonLearned: "Death is not the final word when God's prophet intercedes."
      },
      {
        id: "1ki-22",
        title: "Elijah Confronts Obadiah",
        reference: "1 Kings 18:1-16",
        summary: "After three years, God sends Elijah to Ahab. Obadiah, Ahab's palace manager who secretly hid 100 prophets from Jezebel, meets Elijah first. Elijah tells him to announce his presence to Ahab. Obadiah fears: the Spirit might carry Elijah away, and Ahab will kill Obadiah for false news. Elijah swears he will appear. Obadiah goes; Ahab comes to meet 'the troubler of Israel.'",
        characters: ["Elijah", "Obadiah", "Ahab"],
        themes: ["Faithfulness in Difficult Times", "Courage", "Confrontation"],
        lessonLearned: "God has hidden servants even in the darkest courts."
      },
      {
        id: "1ki-23",
        title: "Contest on Mount Carmel",
        reference: "1 Kings 18:17-40",
        summary: "Elijah challenges Israel: 'How long will you waver between two opinions?' He proposes a test: 450 Baal prophets versus one prophet of God. Two bulls, two altars, no fire—whichever god answers by fire is the true God. Baal's prophets cry out from morning to evening, cutting themselves, but nothing happens. Elijah mocks them. Then he drenches his altar with water, prays briefly, and fire from heaven consumes everything—sacrifice, wood, stones, water.",
        characters: ["Elijah", "Prophets of Baal", "Israel"],
        themes: ["Power Encounter", "True God", "False Gods"],
        lessonLearned: "One faithful servant plus God equals majority."
      },
      {
        id: "1ki-24",
        title: "Elijah Prays for Rain",
        reference: "1 Kings 18:41-46",
        summary: "Elijah tells Ahab to eat and drink; rain is coming. He climbs Carmel and bows with his face between his knees. He sends his servant to look toward the sea. Nothing. Seven times he looks. The seventh time: 'A cloud as small as a man's hand is rising from the sea.' Elijah warns: get to Jezreel before rain stops you. The sky grows black; heavy rain falls. The Lord's hand empowers Elijah to outrun Ahab's chariot.",
        characters: ["Elijah", "Ahab", "Servant"],
        themes: ["Persistent Prayer", "Rain Returns", "Supernatural Strength"],
        lessonLearned: "Persistent, humble prayer unlocks heaven's windows."
      },
      {
        id: "1ki-25",
        title: "Elijah Flees to Horeb",
        reference: "1 Kings 19:1-18",
        summary: "Jezebel threatens Elijah's life. Strangely, after Carmel's victory, he flees in terror to the wilderness and asks to die. An angel feeds him twice. He travels forty days to Horeb (Sinai). God asks, 'What are you doing here?' Elijah complains he's the only one left. God passes by—wind, earthquake, fire—but speaks in a still small voice. He commissions Elijah and reveals 7,000 who haven't bowed to Baal.",
        characters: ["Elijah", "God", "Angel"],
        themes: ["Burnout", "Still Small Voice", "Remnant"],
        lessonLearned: "Even great prophets experience exhaustion and despair—and need God's gentle voice."
      },
      {
        id: "1ki-26",
        title: "Elijah Calls Elisha",
        reference: "1 Kings 19:19-21",
        summary: "Elijah finds Elisha plowing with twelve yoke of oxen. He throws his cloak on him—a symbolic call. Elisha runs after him: 'Let me kiss my parents goodbye, then I'll follow.' Elijah says, 'Go back; what have I done to you?' Elisha slaughters his oxen, burns the plowing equipment for fuel, feeds the people, then follows Elijah as his servant. No turning back.",
        characters: ["Elijah", "Elisha"],
        themes: ["Calling", "Total Commitment", "Succession"],
        lessonLearned: "Following God's call means burning bridges to the old life."
      },
      {
        id: "1ki-27",
        title: "Ahab Defeats Ben-hadad",
        reference: "1 Kings 20:1-21",
        summary: "Ben-hadad of Syria besieges Samaria with a huge army. A prophet tells Ahab he'll win so Israel knows the Lord is God. Using 232 young leaders of the provinces as the strike force, Israel attacks at noon while Ben-hadad is drinking. The Syrians flee; Israel inflicts great slaughter. The prophet warns: prepare—Syria will return next spring.",
        characters: ["Ahab", "Ben-hadad", "Prophet"],
        themes: ["Unlikely Victory", "Small Forces", "Divine Purpose"],
        lessonLearned: "God gives victory so people will know He is Lord—not because leaders deserve it."
      },
      {
        id: "1ki-28",
        title: "Ahab Spares Ben-hadad",
        reference: "1 Kings 20:31-43",
        summary: "Defeated Ben-hadad begs for mercy. His servants suggest appearing with ropes on their necks. Ahab calls him 'brother,' makes a treaty, and releases him. A prophet prepares a strange scene: he has another man strike him, then bandages his wound. When Ahab passes, he removes the bandage and announces judgment: because Ahab released God's devoted enemy, his life will be forfeit for Ben-hadad's life.",
        characters: ["Ahab", "Ben-hadad", "Prophet"],
        themes: ["Misplaced Mercy", "Judgment", "Devoted to Destruction"],
        lessonLearned: "Showing mercy to what God has condemned brings judgment on ourselves."
      },
      {
        id: "1ki-29",
        title: "Naboth's Vineyard",
        reference: "1 Kings 21:1-16",
        summary: "Ahab wants Naboth's vineyard for a vegetable garden, offering payment or exchange. Naboth refuses: it's his ancestral inheritance. Ahab goes home sulking like a child. Jezebel takes over: she writes letters in Ahab's name, arranges for two false witnesses to accuse Naboth of cursing God and king. Naboth is stoned. Jezebel announces: 'Arise, take the vineyard.'",
        characters: ["Ahab", "Naboth", "Jezebel", "False Witnesses"],
        themes: ["Covetousness", "False Witness", "Murder for Gain"],
        lessonLearned: "What we obtain through injustice becomes a curse, not a blessing."
      },
      {
        id: "1ki-30",
        title: "Elijah Confronts Ahab Over Naboth",
        reference: "1 Kings 21:17-29",
        summary: "God sends Elijah to the vineyard where Ahab is taking possession. 'Have you murdered and also taken possession?' Dogs will lick Ahab's blood where they licked Naboth's. Jezebel will be eaten by dogs at Jezreel's wall. No one ever sold himself to evil like Ahab, incited by Jezebel. Surprisingly, Ahab humbles himself—fasting in sackcloth. God delays the disaster to his son's days.",
        characters: ["Elijah", "Ahab", "Jezebel (prophesied about)"],
        themes: ["Judgment Pronounced", "Humility Delays Wrath", "Consequences"],
        lessonLearned: "Even the worst sinner's humility can delay—though not cancel—judgment."
      }
    ]
  },

  // ============================================
  // JOSHUA - 30 Stories
  // ============================================
  {
    book: "Joshua",
    testament: "old",
    stories: [
      {
        id: "josh-1",
        title: "Joshua Commissioned",
        reference: "Joshua 1:1-9",
        summary: "After Moses' death, God commissions Joshua: 'Be strong and courageous. As I was with Moses, so I will be with you. I will not leave you or forsake you.' Three times God commands strength and courage. The key: meditate on the Law day and night, do all that's written, and prosper. Joshua must lead Israel into what Moses could only see.",
        characters: ["Joshua", "God"],
        themes: ["Succession", "Courage", "God's Presence"],
        lessonLearned: "God's call comes with God's presence—the foundation of courage."
      },
      {
        id: "josh-2",
        title: "Rahab Hides the Spies",
        reference: "Joshua 2:1-24",
        summary: "Joshua sends two spies to Jericho. They stay at Rahab's house (a prostitute). When the king demands their surrender, Rahab hides them under flax on her roof and lies about their departure. She confesses faith: 'The Lord your God is God in heaven above and on earth beneath.' The spies promise safety for her household if she ties a scarlet cord in her window.",
        characters: ["Rahab", "Two Spies", "King of Jericho"],
        themes: ["Faith", "Unlikely Believers", "Scarlet Cord"],
        lessonLearned: "Faith can be found in the most unlikely places and people."
      },
      {
        id: "josh-3",
        title: "Crossing the Jordan",
        reference: "Joshua 3:1-17",
        summary: "At flood stage, priests carry the ark into the Jordan. The moment their feet touch water, the river stops flowing, piling up at a town called Adam. All Israel crosses on dry ground while priests stand in the riverbed with the ark. This miracle parallels the Red Sea crossing, establishing Joshua's leadership in Israel's eyes.",
        characters: ["Joshua", "Priests", "Israel"],
        themes: ["Miracles", "Faith", "New Leadership Confirmed"],
        lessonLearned: "Stepping into impossible situations by faith releases God's power."
      },
      {
        id: "josh-4",
        title: "Twelve Memorial Stones",
        reference: "Joshua 4:1-24",
        summary: "Twelve men—one from each tribe—take stones from the middle of the Jordan and stack them at Gilgal. Joshua explains: when children ask what these stones mean, tell them Israel crossed the Jordan on dry ground, just as God dried up the Red Sea. The memorial ensures future generations remember God's mighty acts.",
        characters: ["Joshua", "Twelve Representatives"],
        themes: ["Memorial", "Teaching Children", "Remembrance"],
        lessonLearned: "Create memorials so future generations ask questions about God's faithfulness."
      },
      {
        id: "josh-5",
        title: "Circumcision at Gilgal",
        reference: "Joshua 5:2-9",
        summary: "A generation born in the wilderness was never circumcised. At Gilgal, Joshua circumcises all males with flint knives. They remain in camp until healed. God says, 'Today I have rolled away the reproach of Egypt from you.' The place is named Gilgal (rolling). Covenant identity is restored before conquest begins.",
        characters: ["Joshua", "Israel"],
        themes: ["Covenant Renewal", "Obedience Before Battle", "Identity"],
        lessonLearned: "Spiritual preparation precedes spiritual victory."
      },
      {
        id: "josh-6",
        title: "The Commander of the Lord's Army",
        reference: "Joshua 5:13-15",
        summary: "Near Jericho, Joshua encounters a man with drawn sword. 'Are you for us or for our enemies?' The answer: 'No; I am the commander of the Lord's army.' Joshua falls facedown. The commander says, 'Take off your sandals; the place is holy.' Joshua obeys. This divine figure indicates the battle belongs to God, not Israel.",
        characters: ["Joshua", "Commander of Lord's Army"],
        themes: ["Divine Warrior", "Holy Ground", "Perspective Shift"],
        lessonLearned: "The question isn't whether God is on our side but whether we're on His."
      },
      {
        id: "josh-7",
        title: "The Fall of Jericho",
        reference: "Joshua 6:1-21",
        summary: "God's strange battle plan: march around Jericho once daily for six days; seven times on the seventh day, with priests blowing trumpets. When the long trumpet blast sounds, all shout—the walls will fall. Israel obeys exactly. At the shout, the walls collapse. They take the city, devoted to destruction, saving only Rahab's family as promised.",
        characters: ["Joshua", "Israel", "Priests", "Rahab"],
        themes: ["Obedience", "Unconventional Warfare", "Walls Fall"],
        lessonLearned: "God's methods may seem foolish, but obedience brings victory."
      },
      {
        id: "josh-8",
        title: "Achan's Hidden Sin",
        reference: "Joshua 7:1-26",
        summary: "Israel attacks small Ai and is routed. Joshua tears his clothes: 'Why did You bring us across to be destroyed?' God reveals someone kept devoted things. Through lot-casting, Achan is identified. He confesses: he coveted a beautiful cloak, silver, and gold, hiding them in his tent. They stone Achan and his family, burn everything. The place is called Valley of Achor (Trouble).",
        characters: ["Achan", "Joshua", "Israel"],
        themes: ["Hidden Sin", "Corporate Responsibility", "Judgment"],
        lessonLearned: "One person's secret sin can defeat an entire community."
      },
      {
        id: "josh-9",
        title: "Ai Defeated by Ambush",
        reference: "Joshua 8:1-29",
        summary: "With sin purged, God commands Joshua to take Ai. Thirty thousand warriors set an ambush. Joshua feigns retreat; Ai's men pursue, leaving the city undefended. The ambush springs—Israel burns Ai. Joshua catches the fleeing army between two forces. Twelve thousand die. The king is hanged on a tree until evening, then buried under stones at the gate.",
        characters: ["Joshua", "Warriors of Israel", "King of Ai"],
        themes: ["Strategy", "Victory After Defeat", "Complete Destruction"],
        lessonLearned: "After dealing with sin, God gives strategy for victory."
      },
      {
        id: "josh-10",
        title: "The Gibeonite Deception",
        reference: "Joshua 9:1-27",
        summary: "Gibeonites fear destruction and devise a scheme: wearing worn clothes and carrying moldy bread, they claim to be from a distant land seeking a treaty. Israel's leaders examine their provisions but don't inquire of the Lord. They make a peace treaty. Three days later, Israel discovers Gibeon is nearby. Bound by oath, they can't attack but make Gibeonites woodcutters and water carriers forever.",
        characters: ["Joshua", "Gibeonites", "Israel's Leaders"],
        themes: ["Deception", "Failure to Pray", "Binding Oaths"],
        lessonLearned: "Failing to seek God before major decisions leads to lasting consequences."
      },
      {
        id: "josh-11",
        title: "The Sun Stands Still",
        reference: "Joshua 10:1-14",
        summary: "Five Amorite kings attack Gibeon. Israel marches all night and surprises them. God throws the enemy into confusion and sends large hailstones—more die from hail than sword. Then Joshua commands: 'Sun, stand still at Gibeon; and moon, in the Valley of Aijalon.' The sun stops for about a full day. 'There has been no day like it before or since.'",
        characters: ["Joshua", "Five Amorite Kings", "God"],
        themes: ["Cosmic Miracle", "Bold Prayer", "Victory"],
        lessonLearned: "When God fights for you, even the cosmos responds to your need."
      },
      {
        id: "josh-12",
        title: "Five Kings in the Cave",
        reference: "Joshua 10:16-27",
        summary: "The five kings hide in a cave at Makkedah. Joshua orders the cave blocked with stones while pursuing the army. Later, he has the kings brought out, commanders put their feet on their necks—'Be strong and courageous; thus God will do to all your enemies.' Joshua kills them, hangs them on five trees until evening, then buries them in the cave with large stones.",
        characters: ["Joshua", "Five Amorite Kings", "Commanders"],
        themes: ["Complete Victory", "Symbolic Action", "Encouragement"],
        lessonLearned: "God delivers enemies into our hands as encouragement for battles ahead."
      },
      {
        id: "josh-13",
        title: "Southern Campaign",
        reference: "Joshua 10:28-43",
        summary: "Joshua sweeps through the southern cities: Makkedah, Libnah, Lachish, Eglon, Hebron, Debir—utterly destroying each. He leaves no survivors, as Moses commanded. The summary: 'Joshua captured all these kings and their lands at one time because the Lord, the God of Israel, fought for Israel.' Then he returns to Gilgal.",
        characters: ["Joshua", "Israel"],
        themes: ["Conquest", "Obedience", "God Fights"],
        lessonLearned: "When God fights, campaigns that should take years happen quickly."
      },
      {
        id: "josh-14",
        title: "Northern Coalition Defeated",
        reference: "Joshua 11:1-15",
        summary: "Northern kings unite under Jabin of Hazor—a vast army with horses and chariots like sand on the seashore. God tells Joshua not to fear; tomorrow they'll all be dead. Israel attacks suddenly at the waters of Merom, hamstrings horses, burns chariots. Joshua takes Hazor, the head of those kingdoms, and burns it. He does everything Moses commanded.",
        characters: ["Joshua", "Jabin of Hazor", "Northern Kings"],
        themes: ["Coalition Defeated", "Obedience", "Total Victory"],
        lessonLearned: "Even overwhelming numbers and technology fall before God's command."
      },
      {
        id: "josh-15",
        title: "Caleb Claims Hebron",
        reference: "Joshua 14:6-15",
        summary: "Eighty-five-year-old Caleb approaches Joshua: 'I wholly followed the Lord. Moses swore to give me this land. Now give me this hill country. I'm still as strong as at forty. Perhaps the Lord will be with me, and I'll drive out the Anakim giants.' Joshua blesses him; Caleb receives Hebron. Because he wholly followed the Lord, he gets what he was promised forty-five years earlier.",
        characters: ["Caleb", "Joshua"],
        themes: ["Faithfulness Rewarded", "Giant-Killing", "Claim Your Inheritance"],
        lessonLearned: "Wholehearted obedience, even after decades, receives its reward."
      },
      {
        id: "josh-16",
        title: "Achsah Asks for Springs",
        reference: "Joshua 15:16-19",
        summary: "Caleb offers his daughter Achsah to whoever captures Kiriath-sepher. Othniel, his nephew, takes it and wins her. She urges him to ask for a field; when he does, she goes further, asking Caleb for springs of water since her land is desert. Caleb gives her upper and lower springs. She knows what she needs and boldly asks.",
        characters: ["Achsah", "Caleb", "Othniel"],
        themes: ["Bold Asking", "Women of Initiative", "Blessing"],
        lessonLearned: "Those who ask receive—even in patriarchal times, bold women were honored."
      },
      {
        id: "josh-17",
        title: "Cities of Refuge Established",
        reference: "Joshua 20:1-9",
        summary: "Six cities are designated as refuges for those who kill accidentally. A manslayer can flee there, stand before the elders, and receive protection from blood avengers. He remains until the high priest dies, then can return home. Three cities west of Jordan, three east: Kedesh, Shechem, Hebron, Bezer, Ramoth, Golan. Justice balanced with mercy.",
        characters: ["Joshua", "Israel"],
        themes: ["Justice", "Mercy", "Protection"],
        lessonLearned: "God provides refuge for those who sin unintentionally while maintaining justice."
      },
      {
        id: "josh-18",
        title: "The Altar of Witness",
        reference: "Joshua 22:10-34",
        summary: "Eastern tribes build a large altar by the Jordan. Western tribes assume they're starting false worship and prepare for war. But the eastern tribes explain: it's not for sacrifice but as a witness that future generations will know they belong to Israel though they live beyond the Jordan. The explanation satisfies everyone; they name it 'Witness' that the Lord is God.",
        characters: ["Eastern Tribes", "Western Tribes", "Phinehas"],
        themes: ["Misunderstanding", "Communication", "Unity"],
        lessonLearned: "Before assuming the worst, seek understanding—intentions may be righteous."
      },
      {
        id: "josh-19",
        title: "Joshua's Farewell Address",
        reference: "Joshua 23:1-16",
        summary: "Old Joshua gathers Israel's leaders. He recounts what God has done: driving out nations, giving land. But remaining peoples can become snares if Israel intermarries or serves their gods. 'Not one word has failed of all the good things the Lord promised.' The warning: if they break covenant, God's anger will burn and they'll perish from this good land.",
        characters: ["Joshua", "Leaders of Israel"],
        themes: ["Farewell", "Warning", "Faithfulness"],
        lessonLearned: "Past faithfulness doesn't guarantee future blessing—continued obedience is required."
      },
      {
        id: "josh-20",
        title: "Choose This Day Whom You Will Serve",
        reference: "Joshua 24:1-28",
        summary: "Joshua gathers all Israel at Shechem, rehearsing God's history from Abraham through the conquest. Then the famous challenge: 'Choose this day whom you will serve—the gods your fathers served, the gods of the Amorites, or the Lord. As for me and my house, we will serve the Lord.' Israel commits to the Lord. Joshua sets up a stone as witness to their covenant.",
        characters: ["Joshua", "All Israel"],
        themes: ["Choice", "Covenant Renewal", "Commitment"],
        lessonLearned: "Every generation must choose for themselves whom they will serve."
      },
      {
        id: "josh-21",
        title: "Joshua's Death",
        reference: "Joshua 24:29-31",
        summary: "Joshua son of Nun, servant of the Lord, dies at 110 years old. They bury him in his inheritance at Timnath-serah. Israel serves the Lord all the days of Joshua and all the days of the elders who outlived him, who had experienced all the Lord's work for Israel. One generation's faithfulness shapes the next.",
        characters: ["Joshua"],
        themes: ["Death", "Legacy", "Generational Faith"],
        lessonLearned: "Leaders who finish well leave a legacy of faith for the next generation."
      },
      {
        id: "josh-22",
        title: "Joseph's Bones Buried",
        reference: "Joshua 24:32",
        summary: "The bones of Joseph, which Israel brought from Egypt, are buried at Shechem in the plot Jacob purchased. Joseph had made his brothers swear to carry his bones to Canaan. Centuries later, the promise is fulfilled. The patriarch who saved Israel in Egypt finally rests in the Promised Land.",
        characters: ["Joseph (remains)", "Israel"],
        themes: ["Promise Kept", "Faith Rewarded", "Burial"],
        lessonLearned: "Faith made centuries ago is honored by faithful generations later."
      },
      {
        id: "josh-23",
        title: "Eleazar's Death",
        reference: "Joshua 24:33",
        summary: "Eleazar son of Aaron dies and is buried at Gibeah, which had been given to his son Phinehas in the hill country of Ephraim. With Joshua and Eleazar both dead, an era ends. The generation that conquered Canaan passes away, leaving their inheritance to those who must now hold it.",
        characters: ["Eleazar"],
        themes: ["Generational Change", "Priestly Succession", "Era Ending"],
        lessonLearned: "When great leaders die, the question becomes: will the next generation be faithful?"
      },
      {
        id: "josh-24",
        title: "The Land Divided by Lot",
        reference: "Joshua 18:1-10",
        summary: "At Shiloh, Joshua rebukes seven tribes: 'How long will you put off going in to take possession?' He sends surveyors to describe the remaining land in seven portions. They return with a written description. Joshua casts lots at Shiloh, dividing the land among the remaining tribes. Divine lot-casting ensures fairness and God's direction.",
        characters: ["Joshua", "Seven Tribes", "Surveyors"],
        themes: ["Taking Possession", "Divine Guidance", "Inheritance"],
        lessonLearned: "God provides the land, but we must take the initiative to possess it."
      },
      {
        id: "josh-25",
        title: "The Levites' Cities",
        reference: "Joshua 21:1-45",
        summary: "Levites receive no territory but forty-eight cities throughout all tribal lands, including the six cities of refuge. They get pasture lands for livestock. The summary: 'Not a word failed of any good thing which the Lord had spoken to the house of Israel. All came to pass.' God's promises are completely fulfilled.",
        characters: ["Levites", "All Tribes"],
        themes: ["Priestly Provision", "Promises Fulfilled", "Scattered Presence"],
        lessonLearned: "God's servants are scattered among His people for spiritual influence everywhere."
      },
      {
        id: "josh-26",
        title: "Unconquered Territories",
        reference: "Joshua 13:1-7",
        summary: "Though old, Joshua hears from God: 'Very much land remains to be possessed.' The list includes Philistine regions, Geshurites, Lebanon territory. God promises to drive them out; Joshua must allot it as inheritance even though not yet conquered. Faith includes claiming what God promises but hasn't yet delivered.",
        characters: ["Joshua", "God"],
        themes: ["Unfinished Work", "Future Promises", "Faith"],
        lessonLearned: "Some promises require future generations to complete what earlier ones began."
      },
      {
        id: "josh-27",
        title: "Daughters of Zelophehad Receive Inheritance",
        reference: "Joshua 17:3-6",
        summary: "Zelophehad died with no sons, only five daughters: Mahlah, Noah, Hoglah, Milcah, and Tirzah. They approach Eleazar and Joshua, citing Moses' ruling: the Lord commanded them to receive inheritance among their brothers. As commanded, they receive land among their father's brothers. Women too can inherit when justice demands.",
        characters: ["Zelophehad's Daughters", "Joshua", "Eleazar"],
        themes: ["Women's Rights", "Inheritance", "Justice"],
        lessonLearned: "God's justice includes provisions for those traditionally excluded."
      },
      {
        id: "josh-28",
        title: "Ephraim and Manasseh Want More",
        reference: "Joshua 17:14-18",
        summary: "Joseph's tribes complain: we're numerous but have only one portion. Joshua challenges them: if you're so great, clear the forest in the hill country. They object: the Canaanites have iron chariots. Joshua insists: you are numerous; you shall drive them out despite their chariots. More land requires more effort.",
        characters: ["Ephraim", "Manasseh", "Joshua"],
        themes: ["Contentment", "Challenge", "Work Required"],
        lessonLearned: "Wanting more blessing means accepting more responsibility and harder work."
      },
      {
        id: "josh-29",
        title: "Joshua Receives His Inheritance",
        reference: "Joshua 19:49-50",
        summary: "After dividing all the land, Israel gives Joshua his inheritance: Timnath-serah in the hill country of Ephraim. He asked for it. He builds the city and settles there. The leader who gave everyone their portion finally receives his own—last, not first. The faithful servant's reward comes after his work is done.",
        characters: ["Joshua", "Israel"],
        themes: ["Leadership", "Last Receives", "Faithful Reward"],
        lessonLearned: "Great leaders ensure everyone else is settled before claiming their own portion."
      },
      {
        id: "josh-30",
        title: "The Treaty with Gibeon Honored",
        reference: "Joshua 10:6-7",
        summary: "When five kings attack Gibeon, the Gibeonites send for help: 'Don't abandon your servants! Come quickly!' Despite being tricked into the treaty, Israel honors it. Joshua marches all night from Gilgal. A promise is a promise, even one made through deception. God fights for Israel to protect those under their covenant.",
        characters: ["Joshua", "Gibeonites", "Five Kings"],
        themes: ["Keeping Promises", "Protection", "Covenant Loyalty"],
        lessonLearned: "Integrity means keeping commitments even when the circumstances were manipulated."
      }
    ]
  },

  {
    book: "Matthew",
    testament: "new",
    stories: [
      {
        id: "mat-1",
        title: "Joseph's Dream About Mary",
        reference: "Matthew 1:18-25",
        summary: "Joseph discovers Mary is pregnant before their marriage is consummated. Being righteous but unwilling to expose her to public disgrace, he plans to divorce her quietly. An angel appears in a dream: the child is from the Holy Spirit; he should name him Jesus, for he will save his people from their sins. Joseph obeys, takes Mary as his wife, but keeps her a virgin until Jesus is born.",
        characters: ["Joseph", "Mary", "Angel"],
        themes: ["Obedience", "Faith", "Fulfillment of Prophecy"],
        lessonLearned: "Obedience to God sometimes means accepting what we don't fully understand."
      },
      {
        id: "mat-2",
        title: "The Magi Follow the Star",
        reference: "Matthew 2:1-12",
        summary: "Wise men from the East see a star signifying a king's birth and journey to Jerusalem asking, 'Where is He who has been born King of the Jews?' Herod is troubled. Scribes cite Micah: Bethlehem. The star leads them to the house where they worship the child, offering gold, frankincense, and myrrh. Warned in a dream, they return home avoiding Herod.",
        characters: ["Magi", "Herod", "Jesus", "Mary"],
        themes: ["Seeking Christ", "Worship", "Divine Warning"],
        lessonLearned: "Those who truly seek Christ will find Him—and worship costs something precious."
      },
      {
        id: "mat-3",
        title: "Massacre of the Innocents",
        reference: "Matthew 2:16-18",
        summary: "When Herod realizes the Magi have tricked him, he is furious. He orders all male children in Bethlehem two years old and under to be killed. Rachel weeps for her children, refusing comfort. This fulfills Jeremiah's prophecy. Evil's response to the Messiah's birth is murderous rage against the innocent.",
        characters: ["Herod", "Children of Bethlehem"],
        themes: ["Evil", "Innocent Suffering", "Fulfilled Prophecy"],
        lessonLearned: "The coming of Christ provokes violent opposition from those who fear losing power."
      },
      {
        id: "mat-4",
        title: "Flight to Egypt",
        reference: "Matthew 2:13-15, 19-23",
        summary: "An angel warns Joseph in a dream to flee to Egypt with Mary and Jesus because Herod wants to kill the child. They stay until Herod dies. Then an angel directs them to return, but fear of Herod's son Archelaus leads them to Galilee, settling in Nazareth. Each move fulfills Scripture: 'Out of Egypt I called my son.'",
        characters: ["Joseph", "Mary", "Jesus", "Angel"],
        themes: ["Protection", "Obedience", "Prophetic Fulfillment"],
        lessonLearned: "God guides step by step through dreams, circumstances, and Scripture."
      },
      {
        id: "mat-5",
        title: "John the Baptist's Ministry",
        reference: "Matthew 3:1-12",
        summary: "John appears in the wilderness preaching, 'Repent, for the kingdom of heaven is at hand!' He wears camel's hair, eats locusts and honey. Crowds come for baptism. To proud Pharisees and Sadducees he thunders, 'Who warned you to flee the wrath to come? Bear fruit worthy of repentance!' He announces one mightier coming who will baptize with Holy Spirit and fire.",
        characters: ["John the Baptist", "Pharisees", "Sadducees"],
        themes: ["Repentance", "Preparation", "Coming Messiah"],
        lessonLearned: "True repentance produces visible fruit, not just religious words."
      },
      {
        id: "mat-6",
        title: "Jesus' Baptism",
        reference: "Matthew 3:13-17",
        summary: "Jesus comes from Galilee to be baptized by John. John protests: 'I need to be baptized by You!' Jesus insists: 'Let it be so now, for thus it is fitting to fulfill all righteousness.' Coming up from the water, heavens open, the Spirit descends like a dove, and the Father's voice declares, 'This is my beloved Son, with whom I am well pleased.'",
        characters: ["Jesus", "John the Baptist", "Holy Spirit", "Father"],
        themes: ["Trinity", "Identification", "Divine Approval"],
        lessonLearned: "Jesus identifies with sinners though He is sinless—and heaven confirms Him."
      },
      {
        id: "mat-7",
        title: "Temptation in the Wilderness",
        reference: "Matthew 4:1-11",
        summary: "The Spirit leads Jesus into the wilderness to be tempted by the devil. After forty days of fasting, Satan tempts Him: turn stones to bread, throw Yourself from the temple, worship me for all kingdoms. Each time Jesus responds with Scripture: 'It is written...' Finally, angels come and minister to Him after Satan departs.",
        characters: ["Jesus", "Satan", "Angels"],
        themes: ["Temptation", "Scripture", "Victory"],
        lessonLearned: "Jesus defeated temptation with Scripture—our primary weapon against Satan."
      },
      {
        id: "mat-8",
        title: "Calling the First Disciples",
        reference: "Matthew 4:18-22",
        summary: "Walking by the Sea of Galilee, Jesus sees Simon Peter and Andrew casting nets. 'Follow Me, and I will make you fishers of men.' Immediately they leave their nets and follow. Going on, He sees James and John with their father Zebedee mending nets. He calls them; immediately they leave boat and father and follow.",
        characters: ["Jesus", "Peter", "Andrew", "James", "John"],
        themes: ["Calling", "Immediate Response", "Leaving Everything"],
        lessonLearned: "Following Jesus requires immediate, decisive response—leaving the familiar behind."
      },
      {
        id: "mat-9",
        title: "The Beatitudes",
        reference: "Matthew 5:1-12",
        summary: "Seeing crowds, Jesus goes up a mountain and teaches His disciples. He pronounces blessings that reverse worldly values: blessed are the poor in spirit, those who mourn, the meek, those hungering for righteousness, the merciful, pure in heart, peacemakers, and the persecuted. Theirs is the kingdom of heaven.",
        characters: ["Jesus", "Disciples", "Crowds"],
        themes: ["Kingdom Values", "Blessing", "Counter-Cultural"],
        lessonLearned: "God's kingdom values the opposite of what the world prizes."
      },
      {
        id: "mat-10",
        title: "Salt and Light",
        reference: "Matthew 5:13-16",
        summary: "Jesus declares His followers are salt of the earth—but if salt loses its saltiness, it's worthless. They are light of the world—a city on a hill cannot be hidden. No one lights a lamp to put it under a basket. 'Let your light shine before others, so that they may see your good works and give glory to your Father in heaven.'",
        characters: ["Jesus", "Disciples"],
        themes: ["Influence", "Witness", "Good Works"],
        lessonLearned: "Christians are to preserve and illuminate—invisible faith is useless faith."
      },
      {
        id: "mat-11",
        title: "Murder Begins in the Heart",
        reference: "Matthew 5:21-26",
        summary: "Jesus deepens the law: 'You have heard it said, Do not murder. But I say, anyone angry with his brother is liable to judgment.' Calling someone 'fool' risks hell fire. If offering a gift at the altar and remembering a brother has something against you, leave the gift, be reconciled first, then offer. Settle with accusers quickly.",
        characters: ["Jesus"],
        themes: ["Heart Attitude", "Anger", "Reconciliation"],
        lessonLearned: "Sin begins in the heart—God judges attitudes, not just actions."
      },
      {
        id: "mat-12",
        title: "Adultery of the Eyes",
        reference: "Matthew 5:27-30",
        summary: "Jesus intensifies the command against adultery: 'Everyone who looks at a woman with lustful intent has already committed adultery with her in his heart.' If your right eye causes you to sin, tear it out—better to lose one member than for your whole body to be thrown into hell. Radical measures against sin are required.",
        characters: ["Jesus"],
        themes: ["Lust", "Heart Purity", "Radical Obedience"],
        lessonLearned: "Adultery starts with a look—guard your eyes to guard your heart."
      },
      {
        id: "mat-13",
        title: "Love Your Enemies",
        reference: "Matthew 5:43-48",
        summary: "The law said love your neighbor and hate your enemy. Jesus commands: 'Love your enemies and pray for those who persecute you, so that you may be sons of your Father in heaven.' He makes His sun rise on evil and good alike. If you love only those who love you, what reward is that? 'Be perfect, as your heavenly Father is perfect.'",
        characters: ["Jesus"],
        themes: ["Enemy Love", "Imitation of God", "Perfection"],
        lessonLearned: "Loving enemies distinguishes God's children from the world."
      },
      {
        id: "mat-14",
        title: "The Lord's Prayer",
        reference: "Matthew 6:5-15",
        summary: "Jesus teaches prayer—not like hypocrites praying publicly for show, or pagans with empty repetition. 'Our Father in heaven, hallowed be Your name. Your kingdom come, Your will be done on earth as in heaven. Give us daily bread, forgive us as we forgive others, lead us not into temptation, deliver us from evil.' Forgiveness received depends on forgiveness given.",
        characters: ["Jesus", "Disciples"],
        themes: ["Prayer", "Forgiveness", "Kingdom"],
        lessonLearned: "Prayer prioritizes God's name, kingdom, and will before our needs."
      },
      {
        id: "mat-15",
        title: "Do Not Worry",
        reference: "Matthew 6:25-34",
        summary: "Jesus commands: 'Do not be anxious about your life—what you'll eat, drink, wear. Look at the birds; your Father feeds them. Consider the lilies; Solomon wasn't dressed so beautifully. If God clothes grass that's burned tomorrow, won't He clothe you, O you of little faith? Seek first His kingdom and righteousness; all these things will be added.'",
        characters: ["Jesus"],
        themes: ["Anxiety", "Trust", "Priorities"],
        lessonLearned: "Worry is practical atheism—seek God's kingdom first and trust Him for the rest."
      },
      {
        id: "mat-16",
        title: "Speck and Plank",
        reference: "Matthew 7:1-5",
        summary: "Jesus warns: 'Judge not, that you be not judged. With the judgment you use, you will be judged.' Why do you see the speck in your brother's eye but not the plank in your own? Hypocrite! First remove the plank from your own eye, then you will see clearly to remove the speck from your brother's eye.",
        characters: ["Jesus"],
        themes: ["Judgment", "Hypocrisy", "Self-Examination"],
        lessonLearned: "We must deal with our own sins before addressing others' faults."
      },
      {
        id: "mat-17",
        title: "Ask, Seek, Knock",
        reference: "Matthew 7:7-11",
        summary: "Jesus encourages persistent prayer: 'Ask, and it will be given to you; seek, and you will find; knock, and it will be opened.' What father, if his son asks for bread, gives a stone? Or if he asks for fish, gives a serpent? 'If you then, who are evil, know how to give good gifts to your children, how much more will your Father in heaven give good things to those who ask Him!'",
        characters: ["Jesus"],
        themes: ["Prayer", "Persistence", "Father's Goodness"],
        lessonLearned: "Our heavenly Father delights to give good things to those who ask."
      },
      {
        id: "mat-18",
        title: "The Narrow Gate",
        reference: "Matthew 7:13-14",
        summary: "Jesus warns: 'Enter by the narrow gate. For the gate is wide and the way is easy that leads to destruction, and those who enter by it are many. But the gate is narrow and the way is hard that leads to life, and those who find it are few.' The popular path leads to ruin; the difficult path leads to life.",
        characters: ["Jesus"],
        themes: ["Two Ways", "Difficulty", "Eternal Life"],
        lessonLearned: "Following Christ is the minority path—narrow and demanding but leading to life."
      },
      {
        id: "mat-19",
        title: "House on the Rock",
        reference: "Matthew 7:24-27",
        summary: "Jesus concludes the Sermon on the Mount: 'Everyone who hears these words and does them is like a wise man who built his house on rock. Rain fell, floods came, winds beat—it did not fall. Everyone who hears and does not do them is like a foolish man who built on sand. When storms came, it fell—and great was the fall.'",
        characters: ["Jesus"],
        themes: ["Obedience", "Foundation", "Storms"],
        lessonLearned: "Hearing without doing is building on sand—only obedience provides firm foundation."
      },
      {
        id: "mat-20",
        title: "The Centurion's Faith",
        reference: "Matthew 8:5-13",
        summary: "A centurion appeals to Jesus for his paralyzed servant. Jesus offers to come heal him. The centurion replies: 'I am not worthy for You to come under my roof. Just say the word, and my servant will be healed. I too am a man under authority.' Jesus marvels: 'I have not found such faith in Israel.' The servant is healed that very hour.",
        characters: ["Jesus", "Centurion", "Servant"],
        themes: ["Faith", "Authority", "Gentile Belief"],
        lessonLearned: "Faith recognizes Christ's authority—He needs only speak the word."
      },
      {
        id: "mat-21",
        title: "Calming the Storm",
        reference: "Matthew 8:23-27",
        summary: "Jesus gets into a boat; disciples follow. A great storm arises; waves swamp the boat. Jesus is asleep. Terrified disciples wake Him: 'Lord, save us! We're perishing!' He says, 'Why are you afraid, O you of little faith?' He rebukes winds and sea; there's great calm. The men marvel: 'What sort of man is this, that even winds and sea obey Him?'",
        characters: ["Jesus", "Disciples"],
        themes: ["Fear", "Faith", "Divine Power"],
        lessonLearned: "Christ's presence should calm our fears—He commands even nature."
      },
      {
        id: "mat-22",
        title: "The Gadarene Demoniacs",
        reference: "Matthew 8:28-34",
        summary: "In Gadara, two demon-possessed men meet Jesus, so violent no one can pass. The demons cry out, 'What have You to do with us, Son of God? Have You come to torment us before the time?' A herd of pigs is nearby. Demons beg: if You cast us out, send us into the pigs. Jesus says, 'Go.' They enter the pigs, which rush into the sea and drown. The city begs Jesus to leave.",
        characters: ["Jesus", "Demoniacs", "Demons", "Townspeople"],
        themes: ["Demon Authority", "Deliverance", "Rejection"],
        lessonLearned: "Some value their property more than the freedom of the tormented."
      },
      {
        id: "mat-23",
        title: "Matthew Called from Tax Booth",
        reference: "Matthew 9:9-13",
        summary: "Jesus sees Matthew sitting at his tax booth. 'Follow Me.' Matthew rises and follows. At dinner in Matthew's house, many tax collectors and sinners recline with Jesus. Pharisees complain: 'Why does your teacher eat with tax collectors and sinners?' Jesus replies: 'Those who are well have no need of a physician. I came not to call the righteous, but sinners.'",
        characters: ["Jesus", "Matthew", "Pharisees"],
        themes: ["Calling", "Sinners", "Grace"],
        lessonLearned: "Jesus calls the despised—and those who think they're righteous miss Him."
      },
      {
        id: "mat-24",
        title: "Woman with Bleeding Healed",
        reference: "Matthew 9:20-22",
        summary: "A woman suffering twelve years of bleeding approaches from behind and touches Jesus' garment fringe, thinking, 'If I only touch His garment, I will be made well.' Jesus turns and sees her: 'Take heart, daughter; your faith has made you well.' Instantly she is healed. Her faith drove her to Jesus despite the crowd.",
        characters: ["Jesus", "Woman with Hemorrhage"],
        themes: ["Faith", "Healing", "Desperation"],
        lessonLearned: "Desperate faith reaches out to touch Jesus—and is never disappointed."
      },
      {
        id: "mat-25",
        title: "Jairus's Daughter Raised",
        reference: "Matthew 9:18-19, 23-26",
        summary: "A ruler kneels: 'My daughter has just died. Come lay Your hand on her, and she will live.' Jesus follows. At the house, He finds flute players and mourners. 'Go away. The girl is not dead but sleeping.' They laugh. After putting them out, Jesus takes her hand, and the girl rises. News spreads through the district.",
        characters: ["Jesus", "Jairus", "Girl", "Mourners"],
        themes: ["Faith", "Resurrection", "Ridicule"],
        lessonLearned: "What the world calls death, Jesus calls sleep—and He awakens the dead."
      },
      {
        id: "mat-26",
        title: "The Twelve Sent Out",
        reference: "Matthew 10:1-15",
        summary: "Jesus summons twelve disciples and gives them authority over unclean spirits and to heal every disease. He sends them to the lost sheep of Israel: 'Proclaim the kingdom is at hand. Heal the sick, raise the dead, cleanse lepers, cast out demons. Freely you received, freely give.' Take no money, no bag, no extra clothes. Peace on receptive houses; shake dust off feet at rejection.",
        characters: ["Jesus", "Twelve Disciples"],
        themes: ["Mission", "Authority", "Dependence"],
        lessonLearned: "Ministry happens in vulnerability and dependence, not self-sufficiency."
      },
      {
        id: "mat-27",
        title: "John's Question from Prison",
        reference: "Matthew 11:2-6",
        summary: "Imprisoned John the Baptist sends disciples to ask Jesus: 'Are You the one who is to come, or should we expect another?' Jesus replies: 'Go and tell John what you hear and see: the blind receive sight, the lame walk, lepers are cleansed, the deaf hear, the dead are raised, and the poor have good news preached to them. Blessed is the one who is not offended by Me.'",
        characters: ["Jesus", "John the Baptist", "John's Disciples"],
        themes: ["Doubt", "Evidence", "Faith"],
        lessonLearned: "Even great prophets have moments of doubt—Jesus answers with evidence, not rebuke."
      },
      {
        id: "mat-28",
        title: "Rest for the Weary",
        reference: "Matthew 11:28-30",
        summary: "Jesus invites: 'Come to Me, all who labor and are heavy laden, and I will give you rest. Take My yoke upon you and learn from Me, for I am gentle and lowly in heart, and you will find rest for your souls. For My yoke is easy, and My burden is light.' Religious burdens exhaust; Christ's yoke brings rest.",
        characters: ["Jesus"],
        themes: ["Rest", "Gentleness", "Burden"],
        lessonLearned: "Jesus doesn't remove all work but gives a yoke that brings rest instead of exhaustion."
      },
      {
        id: "mat-29",
        title: "The Sower and the Soils",
        reference: "Matthew 13:1-23",
        summary: "Jesus teaches by the sea: a sower scatters seed. Some falls on the path—birds eat it. Some on rocky ground—it sprouts but withers without deep root. Some among thorns—choked. Some on good soil—producing thirty, sixty, hundredfold. Disciples ask why He speaks in parables. He explains: the path is those who don't understand; rocky soil, those with no root; thorns, worldly cares; good soil, those who hear, understand, and bear fruit.",
        characters: ["Jesus", "Disciples", "Crowds"],
        themes: ["Word of God", "Heart Conditions", "Fruitfulness"],
        lessonLearned: "The same seed produces different results depending on the soil—the heart's condition determines response."
      },
      {
        id: "mat-30",
        title: "Peter Walks on Water",
        reference: "Matthew 14:22-33",
        summary: "Jesus sends disciples across the sea and goes up the mountain to pray. In the fourth watch, He walks on the water toward their storm-tossed boat. They're terrified: 'It's a ghost!' Jesus says, 'Take heart; it is I.' Peter asks to come to Him on the water. 'Come.' Peter walks, but seeing the wind, fears and begins to sink. Jesus catches him: 'O you of little faith, why did you doubt?'",
        characters: ["Jesus", "Peter", "Disciples"],
        themes: ["Faith", "Fear", "Rescue"],
        lessonLearned: "We can walk on water when we keep our eyes on Jesus—we sink when we look at the storm."
      }
    ]
  },

  // ============================================
  // ACTS - 30 Stories
  // ============================================
  {
    book: "Acts",
    testament: "new",
    stories: [
      {
        id: "acts-1",
        title: "Matthias Chosen by Lot",
        reference: "Acts 1:15-26",
        summary: "After Jesus' ascension, Peter proposes filling Judas' position among the twelve. Two candidates are nominated: Joseph called Barsabbas and Matthias. They pray and cast lots—the lot falls on Matthias. He is numbered with the eleven apostles. This is the last time lots are used for divine guidance; after Pentecost, the Spirit leads directly.",
        characters: ["Peter", "Matthias", "Joseph Barsabbas", "The Eleven"],
        themes: ["Divine Selection", "Apostolic Succession", "Prayer"],
        lessonLearned: "Before the Spirit came, they used lots; after Pentecost, they followed the Spirit's leading."
      },
      {
        id: "acts-2",
        title: "Pentecost",
        reference: "Acts 2:1-13",
        summary: "Fifty days after Passover, believers are together when a sound like rushing wind fills the house. Divided tongues of fire rest on each one. They are filled with the Holy Spirit and speak in other tongues. Devout Jews from every nation hear them speaking in their own languages. Some are amazed; others mock: 'They're drunk!'",
        characters: ["Apostles", "Believers", "Crowd from Many Nations"],
        themes: ["Holy Spirit", "Tongues", "Birth of Church"],
        lessonLearned: "The Spirit empowers witness across every language barrier."
      },
      {
        id: "acts-3",
        title: "Peter's Pentecost Sermon",
        reference: "Acts 2:14-41",
        summary: "Peter stands and preaches: these people aren't drunk—it's only 9 AM! This fulfills Joel's prophecy about the Spirit being poured out. Jesus, attested by miracles, was crucified by their hands but raised by God. David prophesied His resurrection. Exalted to God's right hand, He has poured out this Spirit. 'Let all Israel know: God has made this Jesus both Lord and Christ.' Three thousand are baptized.",
        characters: ["Peter", "Crowd"],
        themes: ["Proclamation", "Repentance", "Baptism"],
        lessonLearned: "Bold proclamation of the crucified and risen Christ brings mass conversion."
      },
      {
        id: "acts-4",
        title: "The Lame Man at Beautiful Gate",
        reference: "Acts 3:1-10",
        summary: "Peter and John go to the temple at the hour of prayer. A man lame from birth is carried daily to beg at the Beautiful Gate. He asks for alms. Peter says, 'Silver and gold I do not have, but what I have I give you: In the name of Jesus Christ of Nazareth, rise up and walk!' He takes his hand; immediately his feet and ankles are strengthened. He enters the temple walking, leaping, and praising God.",
        characters: ["Peter", "John", "Lame Man"],
        themes: ["Healing", "Jesus' Name", "Praise"],
        lessonLearned: "The church may lack money but has something better—the power of Jesus' name."
      },
      {
        id: "acts-5",
        title: "Peter and John Before the Council",
        reference: "Acts 4:1-22",
        summary: "Priests and Sadducees arrest Peter and John for teaching about resurrection. Before the council, Peter, filled with the Spirit, declares: 'By the name of Jesus Christ whom you crucified, this man stands healed. There is no other name under heaven given among men by which we must be saved.' Seeing the healed man standing, they can say nothing against it. They threaten them and let them go.",
        characters: ["Peter", "John", "Sanhedrin", "Healed Man"],
        themes: ["Boldness", "Exclusive Salvation", "Persecution"],
        lessonLearned: "Uneducated men filled with the Spirit confound the religious elite."
      },
      {
        id: "acts-6",
        title: "Ananias and Sapphira",
        reference: "Acts 5:1-11",
        summary: "Ananias and his wife Sapphira sell property but keep back part of the proceeds while claiming to give all. Peter confronts Ananias: 'Why has Satan filled your heart to lie to the Holy Spirit?' Ananias falls dead. Three hours later, Sapphira arrives, repeats the lie, and also falls dead. Great fear seizes the whole church. The lie wasn't about money—it was about deceiving God.",
        characters: ["Ananias", "Sapphira", "Peter"],
        themes: ["Lying to God", "Judgment", "Holy Fear"],
        lessonLearned: "The early church learned immediately: you cannot lie to the Holy Spirit."
      },
      {
        id: "acts-7",
        title: "Gamaliel's Counsel",
        reference: "Acts 5:33-42",
        summary: "The council wants to kill the apostles. Pharisee Gamaliel intervenes: 'If this plan is of human origin, it will fail. But if it is of God, you cannot stop it—you may even find yourselves fighting against God.' They take his advice, flog the apostles, and release them. The apostles rejoice that they were counted worthy to suffer shame for the Name.",
        characters: ["Gamaliel", "Apostles", "Sanhedrin"],
        themes: ["Wisdom", "Persecution", "Joy in Suffering"],
        lessonLearned: "What is truly from God cannot be stopped by human opposition."
      },
      {
        id: "acts-8",
        title: "Stephen's Speech and Martyrdom",
        reference: "Acts 7:1-60",
        summary: "Stephen, full of the Spirit, recounts Israel's history of rejecting God's messengers—from Joseph's brothers to Moses in the wilderness to the prophets to the Righteous One they murdered. Enraged, they grind their teeth. Stephen sees heaven opened and Jesus at God's right hand. They stone him as he prays, 'Lord Jesus, receive my spirit... do not hold this sin against them.'",
        characters: ["Stephen", "Sanhedrin", "Saul (watching)"],
        themes: ["Martyrdom", "Forgiveness", "Heaven Opened"],
        lessonLearned: "The first martyr died like his Master—forgiving his killers."
      },
      {
        id: "acts-9",
        title: "Philip and the Ethiopian Eunuch",
        reference: "Acts 8:26-40",
        summary: "An angel sends Philip to the desert road to Gaza. He sees an Ethiopian eunuch, a court official, reading Isaiah in his chariot. The Spirit says, 'Go to that chariot.' Philip asks, 'Do you understand what you're reading?' The eunuch needs a guide. Philip explains that Isaiah 53 is about Jesus. Coming to water, the eunuch asks, 'What prevents me from being baptized?' Philip baptizes him; the Spirit snatches Philip away.",
        characters: ["Philip", "Ethiopian Eunuch", "Angel"],
        themes: ["Divine Appointments", "Scripture", "Baptism"],
        lessonLearned: "God arranges encounters between seeking hearts and prepared witnesses."
      },
      {
        id: "acts-10",
        title: "Saul's Conversion",
        reference: "Acts 9:1-19",
        summary: "Saul, breathing threats against disciples, travels to Damascus with arrest warrants. Suddenly, light from heaven flashes; he falls down, hearing, 'Saul, Saul, why are you persecuting Me?' 'Who are You, Lord?' 'I am Jesus, whom you are persecuting.' Blinded, he's led to Damascus. Ananias, overcoming fear, lays hands on him: 'Brother Saul, receive your sight and be filled with the Holy Spirit.' Scales fall; Saul is baptized.",
        characters: ["Saul/Paul", "Jesus", "Ananias"],
        themes: ["Conversion", "Grace", "Calling"],
        lessonLearned: "No one is beyond the reach of Christ's transforming grace—not even His chief persecutor."
      },
      {
        id: "acts-11",
        title: "Saul Escapes in a Basket",
        reference: "Acts 9:23-25",
        summary: "After Saul begins preaching Jesus in Damascus, Jews plot to kill him. They watch the city gates day and night. His disciples lower him in a basket through an opening in the wall by night. The hunter becomes the hunted. The persecutor now knows persecution—and escapes through the very walls he once planned to breach as arrester.",
        characters: ["Saul/Paul", "Damascus Disciples", "Jews"],
        themes: ["Persecution", "Escape", "Role Reversal"],
        lessonLearned: "Following Christ may mean fleeing in humility from those you once led."
      },
      {
        id: "acts-12",
        title: "Peter's Vision of the Sheet",
        reference: "Acts 10:9-23",
        summary: "Peter prays on a rooftop and falls into a trance. Heaven opens; a great sheet descends with all kinds of animals. A voice says, 'Rise, Peter; kill and eat.' Peter refuses: 'I have never eaten anything unclean.' The voice: 'What God has made clean, do not call common.' This happens three times. Immediately, Gentile messengers from Cornelius arrive. The Spirit tells Peter to go with them.",
        characters: ["Peter", "Messengers from Cornelius"],
        themes: ["Clean and Unclean", "Gentile Inclusion", "Divine Revelation"],
        lessonLearned: "God was preparing Peter to see that Gentiles are not unclean—the gospel is for all."
      },
      {
        id: "acts-13",
        title: "Cornelius's Household Converted",
        reference: "Acts 10:24-48",
        summary: "Peter enters Cornelius's house—a Gentile home, normally off-limits. He proclaims Jesus to the gathering. While still speaking, the Holy Spirit falls on all who hear. Jewish believers are amazed that the Spirit is poured out on Gentiles too—they speak in tongues and extol God. Peter asks, 'Can anyone withhold water for baptizing these people who have received the Holy Spirit just as we have?'",
        characters: ["Peter", "Cornelius", "Gentile Believers", "Jewish Believers"],
        themes: ["Gentile Pentecost", "Inclusion", "Spirit Baptism"],
        lessonLearned: "God shows no partiality—the Spirit falls on Gentiles exactly as on Jews."
      },
      {
        id: "acts-14",
        title: "Barnabas Brings Saul to Antioch",
        reference: "Acts 11:19-26",
        summary: "Persecution scatters believers who preach only to Jews. But some from Cyprus and Cyrene speak to Greeks in Antioch—a great number believe. Jerusalem sends Barnabas to investigate. He sees God's grace and rejoices. He goes to Tarsus to find Saul and brings him to Antioch. For a year they teach. It's here disciples are first called 'Christians.'",
        characters: ["Barnabas", "Saul", "Antioch Believers"],
        themes: ["Gentile Church", "Mentoring", "Christian Identity"],
        lessonLearned: "Barnabas saw potential in Saul when others feared him—good mentors find and develop leaders."
      },
      {
        id: "acts-15",
        title: "Peter's Prison Escape",
        reference: "Acts 12:1-17",
        summary: "Herod kills James and arrests Peter during Passover, intending execution. Four squads guard him in prison. The church prays earnestly. An angel appears; chains fall off. 'Wrap your cloak and follow me.' Peter thinks it's a vision. They pass guards, and the iron gate opens by itself. At the house of Mary, mother of John Mark, a servant named Rhoda recognizes his voice but leaves him at the gate in her excitement.",
        characters: ["Peter", "Angel", "Rhoda", "Praying Believers"],
        themes: ["Prayer", "Angelic Deliverance", "Amazement"],
        lessonLearned: "The church prayed for Peter's release but was astonished when it happened—faith and surprise can coexist."
      },
      {
        id: "acts-16",
        title: "Herod Struck Down",
        reference: "Acts 12:20-24",
        summary: "Herod, wearing royal robes, delivers an oration. The people shout, 'The voice of a god, not of a man!' Immediately, an angel of the Lord strikes him because he did not give God the glory. He is eaten by worms and dies. But the word of God increases and multiplies. The one who killed James and imprisoned Peter meets swift divine judgment.",
        characters: ["Herod Agrippa", "Angel of the Lord"],
        themes: ["Pride", "Divine Judgment", "God's Glory"],
        lessonLearned: "Those who accept worship meant for God alone face severe consequences."
      },
      {
        id: "acts-17",
        title: "Barnabas and Saul Sent Out",
        reference: "Acts 13:1-3",
        summary: "In Antioch, prophets and teachers worship and fast. The Holy Spirit says, 'Set apart for Me Barnabas and Saul for the work to which I have called them.' After fasting and praying, they lay hands on them and send them off. The first intentional missionary journey begins—directed by the Spirit, confirmed by the church, launched through prayer and fasting.",
        characters: ["Barnabas", "Saul", "Antioch Church Leaders", "Holy Spirit"],
        themes: ["Missionary Call", "Spirit Direction", "Church Sending"],
        lessonLearned: "The Spirit calls, the church confirms and sends—mission is a community endeavor."
      },
      {
        id: "acts-18",
        title: "Elymas the Magician Blinded",
        reference: "Acts 13:6-12",
        summary: "On Cyprus, the proconsul Sergius Paulus seeks to hear God's word. Elymas the magician opposes them, trying to turn the proconsul from faith. Paul, filled with the Spirit, declares, 'You enemy of righteousness, full of deceit! The Lord's hand is against you—you will be blind!' Immediately mist and darkness fall on him. The proconsul believes, astonished at the teaching about the Lord.",
        characters: ["Paul", "Barnabas", "Elymas", "Sergius Paulus"],
        themes: ["Spiritual Conflict", "Judgment", "Belief"],
        lessonLearned: "Opposition to the gospel sometimes requires direct spiritual confrontation."
      },
      {
        id: "acts-19",
        title: "Paul Stoned at Lystra",
        reference: "Acts 14:8-20",
        summary: "At Lystra, Paul heals a man lame from birth. The crowd shouts in Lycaonian: 'The gods have come down!' They call Barnabas Zeus and Paul Hermes. The priest of Zeus brings oxen to sacrifice. Paul and Barnabas tear their clothes: 'We are men like you! Turn from these vain things to the living God!' Jews from Antioch arrive, turn the crowd, and stone Paul, leaving him for dead. Disciples gather around; he rises and enters the city.",
        characters: ["Paul", "Barnabas", "Lame Man", "Crowd"],
        themes: ["Healing", "Idolatry Rejected", "Persecution"],
        lessonLearned: "The same crowd that would worship you can stone you—don't trust popularity."
      },
      {
        id: "acts-20",
        title: "The Jerusalem Council",
        reference: "Acts 15:1-29",
        summary: "Some teach that Gentiles must be circumcised to be saved. Paul and Barnabas debate them sharply. At Jerusalem, Peter reminds the council: God gave Gentiles the Spirit without circumcision. James concludes: don't trouble Gentiles who turn to God—just write them to abstain from idolatry, sexual immorality, strangled animals, and blood. The letter brings great encouragement.",
        characters: ["Paul", "Barnabas", "Peter", "James", "Council"],
        themes: ["Grace vs. Law", "Unity", "Freedom"],
        lessonLearned: "The gospel is received by grace through faith—not by adding human requirements."
      },
      {
        id: "acts-21",
        title: "Paul and Barnabas Split",
        reference: "Acts 15:36-41",
        summary: "Paul proposes revisiting churches they planted. Barnabas wants to bring John Mark, who deserted them earlier. Paul refuses. The disagreement is sharp; they part ways. Barnabas takes Mark to Cyprus; Paul chooses Silas and goes through Syria and Cilicia. Even apostles have sharp disagreements—but God multiplies the mission through the division.",
        characters: ["Paul", "Barnabas", "John Mark", "Silas"],
        themes: ["Disagreement", "Second Chances", "Providence"],
        lessonLearned: "Godly people can disagree sharply—and God can use both paths for His purposes."
      },
      {
        id: "acts-22",
        title: "The Macedonian Call",
        reference: "Acts 16:6-10",
        summary: "Paul tries to go to Asia—the Spirit forbids it. He attempts Bithynia—the Spirit of Jesus does not allow it. At Troas, Paul has a vision: a Macedonian man pleads, 'Come over and help us.' Immediately they seek to go to Macedonia, concluding God has called them to preach the gospel there. Divine 'no's' lead to a world-changing 'yes.'",
        characters: ["Paul", "Silas", "Timothy", "Luke", "Man of Macedonia"],
        themes: ["Guidance", "Closed Doors", "Vision"],
        lessonLearned: "When God closes doors, keep walking—He's directing you to the right open door."
      },
      {
        id: "acts-23",
        title: "Lydia's Conversion",
        reference: "Acts 16:11-15",
        summary: "In Philippi, Paul goes to a riverside prayer place on the Sabbath and speaks to women gathered there. Lydia, a seller of purple goods from Thyatira, is a worshiper of God. The Lord opens her heart to pay attention to Paul's message. She and her household are baptized. She urges them: 'If you've judged me faithful to the Lord, come stay at my house.'",
        characters: ["Paul", "Lydia", "Silas"],
        themes: ["Women in Ministry", "Heart Opening", "Hospitality"],
        lessonLearned: "The Lord opens hearts—conversion is His work through our witness."
      },
      {
        id: "acts-24",
        title: "The Philippian Jailer",
        reference: "Acts 16:25-34",
        summary: "Paul and Silas, beaten and imprisoned, pray and sing hymns at midnight. Prisoners listen. Suddenly, an earthquake shakes the prison; doors fly open; chains unfasten. The jailer, thinking prisoners have escaped, draws his sword to kill himself. Paul shouts, 'We are all here!' The jailer falls trembling: 'Sirs, what must I do to be saved?' 'Believe in the Lord Jesus.' He and his household are baptized that night.",
        characters: ["Paul", "Silas", "Philippian Jailer", "Prisoners"],
        themes: ["Worship in Suffering", "Salvation", "Household Faith"],
        lessonLearned: "Worship in chains witnesses more powerfully than preaching in freedom."
      },
      {
        id: "acts-25",
        title: "Paul in Athens",
        reference: "Acts 17:16-34",
        summary: "In Athens, Paul's spirit is provoked by idols everywhere. He reasons in the synagogue and marketplace. Epicurean and Stoic philosophers bring him to the Areopagus. He preaches: 'I found an altar TO AN UNKNOWN GOD. What you worship as unknown, I proclaim—God who made the world, who gives life and breath, who is not far from each of us, who now commands all to repent because He will judge the world by a man He raised from the dead.' Some mock; some believe.",
        characters: ["Paul", "Athenian Philosophers", "Dionysius", "Damaris"],
        themes: ["Unknown God", "Resurrection", "Philosophical Engagement"],
        lessonLearned: "Start where people are—connect known points of contact to unknown truth."
      },
      {
        id: "acts-26",
        title: "The Riot at Ephesus",
        reference: "Acts 19:23-41",
        summary: "Demetrius the silversmith rallies craftsmen: Paul says gods made with hands are no gods. Their trade in Artemis shrines is threatened. The city fills with confusion; they seize Paul's companions and rush to the theater shouting, 'Great is Artemis of the Ephesians!' For two hours they shout. The city clerk finally calms them: 'These men have neither robbed temples nor blasphemed our goddess. If Demetrius has a grievance, courts are open.'",
        characters: ["Demetrius", "Paul's Companions", "City Clerk", "Mob"],
        themes: ["Economic Threats", "Riot", "Civil Order"],
        lessonLearned: "When the gospel threatens profits, expect fierce opposition."
      },
      {
        id: "acts-27",
        title: "Eutychus Falls from the Window",
        reference: "Acts 20:7-12",
        summary: "At Troas on Sunday night, Paul preaches until midnight, departing the next day. Many lamps burn in the upper room. A young man named Eutychus, sitting in a window, sinks into deep sleep as Paul talks on. He falls from the third story and is taken up dead. Paul goes down, embraces him: 'Don't be alarmed; his life is in him.' Paul continues talking until dawn; the young man is taken home alive.",
        characters: ["Paul", "Eutychus", "Believers at Troas"],
        themes: ["Resurrection", "Long Preaching", "Lord's Day"],
        lessonLearned: "Even fatal accidents cannot stop God's purposes—or Paul's preaching!"
      },
      {
        id: "acts-28",
        title: "Paul's Farewell to Ephesian Elders",
        reference: "Acts 20:17-38",
        summary: "Paul summons Ephesian elders to Miletus. He recounts his ministry among them—serving with tears and trials, teaching publicly and house to house. The Spirit testifies that imprisonment and afflictions await him in Jerusalem, but he doesn't consider his life dear to himself. 'Fierce wolves will come among you. Watch over yourselves and the flock.' They weep, embrace, and kiss him, grieving most that they'll never see his face again.",
        characters: ["Paul", "Ephesian Elders"],
        themes: ["Farewell", "Pastoral Charge", "Faithfulness"],
        lessonLearned: "Leaders must warn of coming dangers and entrust the flock to God."
      },
      {
        id: "acts-29",
        title: "Paul Bitten by a Viper",
        reference: "Acts 28:1-6",
        summary: "After shipwreck on Malta, natives show unusual kindness, building a fire in the rain. Paul gathers sticks; a viper fastens on his hand from the heat. Natives expect him to swell up and die—'He must be a murderer; justice doesn't let him live.' Paul shakes the snake into the fire and suffers no harm. After waiting and seeing nothing wrong, they change their minds and say he's a god.",
        characters: ["Paul", "Malta Natives"],
        themes: ["Divine Protection", "Changed Opinions", "Witness"],
        lessonLearned: "What appears to be disaster can become an opportunity for witness when we trust God."
      },
      {
        id: "acts-30",
        title: "Paul Preaching in Rome",
        reference: "Acts 28:23-31",
        summary: "In Rome under house arrest, Paul welcomes all who come to him, explaining the kingdom of God from morning to evening, testifying about Jesus from the Law and Prophets. Some believe; some disbelieve. For two years Paul stays in his rented quarters, welcoming all, proclaiming the kingdom of God and teaching about Jesus with all boldness and without hindrance—even as a prisoner.",
        characters: ["Paul", "Roman Jews", "Visitors"],
        themes: ["Unstoppable Gospel", "House Arrest Ministry", "Boldness"],
        lessonLearned: "Chains cannot stop the gospel—Paul's imprisonment became a platform for witness."
      }
    ]
  },

  // ============================================
  // RUTH - 10 Stories
  // ============================================
  {
    book: "Ruth",
    testament: "old",
    stories: [
      {
        id: "ruth-1",
        title: "Naomi Loses Everything",
        reference: "Ruth 1:1-5",
        summary: "During the judges, famine drives Elimelech, Naomi, and their two sons from Bethlehem to Moab. Elimelech dies. The sons marry Moabite women—Orpah and Ruth—but after ten years, both sons die too. Naomi is left without husband or children in a foreign land, facing the ancient world's worst nightmare: a widow with no male provider.",
        characters: ["Naomi", "Elimelech", "Mahlon", "Chilion", "Ruth", "Orpah"],
        themes: ["Loss", "Famine", "Tragedy"],
        lessonLearned: "Sometimes life strips away everything, leaving only faith or bitterness as options."
      },
      {
        id: "ruth-2",
        title: "Ruth's Pledge to Naomi",
        reference: "Ruth 1:6-18",
        summary: "Naomi decides to return to Bethlehem. She urges her daughters-in-law to stay in Moab and find new husbands. Orpah tearfully leaves. But Ruth clings to Naomi: 'Where you go I will go, where you lodge I will lodge. Your people shall be my people, and your God my God. Where you die I will die, and there will I be buried.' Naomi stops urging her.",
        characters: ["Ruth", "Naomi", "Orpah"],
        themes: ["Loyalty", "Conversion", "Commitment"],
        lessonLearned: "True commitment goes all the way—Ruth chose poverty with Naomi over security in Moab."
      },
      {
        id: "ruth-3",
        title: "Naomi's Bitterness",
        reference: "Ruth 1:19-22",
        summary: "Naomi and Ruth arrive in Bethlehem at barley harvest. The whole town stirs: 'Is this Naomi?' She replies: 'Don't call me Naomi (pleasant); call me Mara (bitter), for the Almighty has dealt bitterly with me. I went out full; the Lord has brought me back empty.' She doesn't yet see Ruth as a blessing—only her losses.",
        characters: ["Naomi", "Ruth", "Women of Bethlehem"],
        themes: ["Bitterness", "Return", "Emptiness"],
        lessonLearned: "Grief can blind us to the blessings right beside us."
      },
      {
        id: "ruth-4",
        title: "Ruth Gleans in Boaz's Field",
        reference: "Ruth 2:1-7",
        summary: "Ruth asks to glean—gather leftover grain behind harvesters, a provision for the poor. She 'happens' to arrive at the field of Boaz, a wealthy relative of Elimelech. The foreman notices her: she came and has worked steadily since morning with barely a rest. Divine providence appears as coincidence.",
        characters: ["Ruth", "Boaz", "Foreman"],
        themes: ["Providence", "Work Ethic", "Provision"],
        lessonLearned: "God guides faithful steps to the right place at the right time."
      },
      {
        id: "ruth-5",
        title: "Boaz Notices Ruth",
        reference: "Ruth 2:8-16",
        summary: "Boaz approaches Ruth: 'Don't glean in another field. Stay close to my young women. I've told the men not to touch you. Drink from our water jars.' Ruth bows: 'Why have I found favor, a foreigner?' Boaz has heard of her loyalty to Naomi: 'May the Lord repay you under whose wings you have come for refuge.' At mealtime, he feeds her; he tells workers to leave extra grain for her.",
        characters: ["Ruth", "Boaz"],
        themes: ["Kindness", "Protection", "Reputation"],
        lessonLearned: "Kindness shown to others creates a reputation that precedes you."
      },
      {
        id: "ruth-6",
        title: "Naomi's Plan",
        reference: "Ruth 3:1-5",
        summary: "Naomi sees Boaz's interest and devises a plan for Ruth's future. Tonight Boaz winnows barley at the threshing floor. Naomi instructs: wash, anoint yourself, put on your cloak, go down, wait until he's eaten and lain down, then uncover his feet and lie down. 'He will tell you what to do.' Ruth commits to obey.",
        characters: ["Naomi", "Ruth"],
        themes: ["Initiative", "Risk", "Strategy"],
        lessonLearned: "Sometimes securing your future requires bold, risky action."
      },
      {
        id: "ruth-7",
        title: "Ruth at the Threshing Floor",
        reference: "Ruth 3:6-15",
        summary: "At midnight, Boaz startles awake—a woman lies at his feet! 'Who are you?' 'I am Ruth. Spread your wings over your servant, for you are a redeemer.' Boaz blesses her: 'You haven't gone after young men. I will do all you ask. But there is a closer redeemer who has first right.' He gives her six measures of barley; she returns to Naomi before anyone can see.",
        characters: ["Ruth", "Boaz"],
        themes: ["Redemption", "Proposal", "Honor"],
        lessonLearned: "Boaz valued Ruth's character over younger options—integrity attracts integrity."
      },
      {
        id: "ruth-8",
        title: "Boaz at the Gate",
        reference: "Ruth 4:1-12",
        summary: "Boaz sits at the city gate and catches the closer redeemer passing by. Before ten elders, he presents the case: Naomi sells Elimelech's land. The man agrees to redeem it. But Boaz adds: with the land comes Ruth to raise up offspring for the dead. The man withdraws—it would impair his own inheritance. He removes his sandal, transferring rights to Boaz. The elders bless the marriage.",
        characters: ["Boaz", "Closer Redeemer", "Elders"],
        themes: ["Redemption", "Legal Process", "Blessing"],
        lessonLearned: "True redemption involves accepting the full cost, not just the benefits."
      },
      {
        id: "ruth-9",
        title: "Ruth Marries Boaz",
        reference: "Ruth 4:13-17",
        summary: "Boaz marries Ruth; the Lord enables her to conceive. She bears a son. The women tell Naomi: 'Blessed be the Lord who has not left you without a redeemer! Your daughter-in-law who loves you is better than seven sons.' Naomi takes the child to her breast as nurse. Neighbors name him Obed—he becomes father of Jesse, father of David. Emptiness becomes fullness.",
        characters: ["Ruth", "Boaz", "Naomi", "Obed", "Women of Bethlehem"],
        themes: ["Marriage", "Redemption Complete", "Lineage"],
        lessonLearned: "God redeems tragedy into blessing that echoes through generations—Obed's line leads to Jesus."
      },
      {
        id: "ruth-10",
        title: "The Genealogy to David",
        reference: "Ruth 4:18-22",
        summary: "The book closes with a genealogy: Perez fathered Hezron, who fathered Ram, who fathered Amminadab, who fathered Nahshon, who fathered Salmon, who fathered Boaz, who fathered Obed, who fathered Jesse, who fathered David. A Moabite widow becomes great-grandmother of Israel's greatest king—and ancestor of the Messiah.",
        characters: ["Perez through David"],
        themes: ["Genealogy", "Providence", "Messianic Line"],
        lessonLearned: "God writes straight with crooked lines—using outsiders for His greatest purposes."
      }
    ]
  },

  // ============================================
  // DANIEL - 20 Stories
  // ============================================
  {
    book: "Daniel",
    testament: "old",
    stories: [
      {
        id: "dan-1",
        title: "Daniel's Resolve Not to Defile Himself",
        reference: "Daniel 1:1-21",
        summary: "Nebuchadnezzar besieges Jerusalem and takes young nobles to Babylon for training in Babylonian wisdom. Daniel, Hananiah, Mishael, and Azariah are chosen. But Daniel resolves not to defile himself with the king's food and wine. He asks for vegetables and water for ten days. At the test's end, they look healthier than those eating royal food. God gives them knowledge and skill; Daniel understands visions.",
        characters: ["Daniel", "Hananiah/Shadrach", "Mishael/Meshach", "Azariah/Abednego", "Nebuchadnezzar"],
        themes: ["Conviction", "God's Favor", "Faithfulness"],
        lessonLearned: "Faithful in small things, God entrusts greater things."
      },
      {
        id: "dan-2",
        title: "Nebuchadnezzar's Dream of the Statue",
        reference: "Daniel 2:1-49",
        summary: "Nebuchadnezzar dreams but forgets the dream, demanding his wise men tell him both dream and interpretation—or die. None can. Daniel asks for time, seeks God with his friends, and God reveals the mystery. The dream: a statue with gold head, silver chest, bronze belly, iron legs, and iron-clay feet—representing successive kingdoms. A stone cut without hands destroys them all and becomes a mountain filling the earth—God's eternal kingdom.",
        characters: ["Daniel", "Nebuchadnezzar", "Wise Men"],
        themes: ["Revelation", "World Kingdoms", "God's Kingdom"],
        lessonLearned: "Human kingdoms rise and fall; only God's kingdom endures forever."
      },
      {
        id: "dan-3",
        title: "The Fiery Furnace",
        reference: "Daniel 3:1-30",
        summary: "Nebuchadnezzar builds a golden statue and commands all to worship it at the sound of music—or be thrown into a fiery furnace. Shadrach, Meshach, and Abednego refuse. Furious, the king heats the furnace seven times hotter. They say, 'Our God is able to deliver us. But even if He does not, we will not serve your gods.' They're thrown in. The king sees four figures walking in the flames—one like a son of the gods. They emerge unharmed, not even smelling of smoke.",
        characters: ["Shadrach", "Meshach", "Abednego", "Nebuchadnezzar", "Fourth Figure"],
        themes: ["Faith", "Deliverance", "God's Presence"],
        lessonLearned: "True faith trusts God whether He delivers or not."
      },
      {
        id: "dan-4",
        title: "Nebuchadnezzar's Humiliation",
        reference: "Daniel 4:1-37",
        summary: "Nebuchadnezzar dreams of a great tree cut down, its stump bound with iron and bronze, living with beasts for seven years. Daniel interprets: the king will be driven from men, live like an animal, until he acknowledges that the Most High rules. A year later, boasting of his glory, the king hears a voice from heaven. Immediately it happens. After seven years, Nebuchadnezzar lifts his eyes to heaven, his reason returns, and he praises God.",
        characters: ["Nebuchadnezzar", "Daniel"],
        themes: ["Pride", "Humiliation", "Restoration"],
        lessonLearned: "God humbles the proud until they acknowledge His sovereignty."
      },
      {
        id: "dan-5",
        title: "The Handwriting on the Wall",
        reference: "Daniel 5:1-31",
        summary: "King Belshazzar throws a feast, drinking from Jerusalem's temple vessels while praising Babylonian gods. Suddenly, fingers write on the wall: MENE, MENE, TEKEL, PARSIN. The king is terrified. Daniel is summoned to interpret: 'MENE—God has numbered your kingdom's days. TEKEL—you have been weighed and found wanting. PARSIN—your kingdom is divided and given to Medes and Persians.' That very night, Belshazzar is slain; Darius takes the kingdom.",
        characters: ["Belshazzar", "Daniel", "Queen Mother"],
        themes: ["Judgment", "Sacrilege", "Sudden End"],
        lessonLearned: "God's patience has limits—He weighs and judges at His appointed time."
      },
      {
        id: "dan-6",
        title: "Daniel in the Lions' Den",
        reference: "Daniel 6:1-28",
        summary: "Jealous officials manipulate Darius into signing a decree: pray only to the king for thirty days, or be thrown to lions. Daniel, knowing this, continues praying toward Jerusalem three times daily with windows open. He's arrested and thrown into the den. The king spends a sleepless night. At dawn, he rushes to the den: 'Daniel, has your God delivered you?' 'My God sent His angel and shut the lions' mouths.' Daniel is lifted out unharmed; his accusers are thrown in and instantly devoured.",
        characters: ["Daniel", "Darius", "Jealous Officials", "Lions"],
        themes: ["Faithfulness", "Jealousy", "Deliverance"],
        lessonLearned: "Consistent faithfulness makes enemies—but God protects His own."
      },
      {
        id: "dan-7",
        title: "Vision of Four Beasts",
        reference: "Daniel 7:1-28",
        summary: "Daniel dreams of four beasts from the sea: a lion with eagle's wings, a bear raised on one side, a leopard with four wings and four heads, and a terrifying beast with iron teeth and ten horns. A little horn arises speaking arrogantly. The Ancient of Days sits in judgment; the beasts lose their dominion. One like a son of man comes on clouds and receives an everlasting kingdom.",
        characters: ["Daniel", "Ancient of Days", "Son of Man", "Four Beasts"],
        themes: ["World Empires", "Judgment", "Eternal Kingdom"],
        lessonLearned: "Human empires look beastly from heaven's perspective; only the Son of Man's kingdom endures."
      },
      {
        id: "dan-8",
        title: "The Ram and the Goat",
        reference: "Daniel 8:1-27",
        summary: "Daniel sees a two-horned ram (Medo-Persia) conquering westward, but a goat with one horn (Greece/Alexander) crosses the earth without touching ground and shatters the ram. The great horn breaks; four horns replace it. From one comes a little horn that exalts itself against the Prince of the host, stops daily sacrifice, and casts truth to the ground—but will be broken without human hand.",
        characters: ["Daniel", "Gabriel"],
        themes: ["Prophecy", "Greece", "Antiochus Epiphanes"],
        lessonLearned: "God reveals the future to prepare His people for trials ahead."
      },
      {
        id: "dan-9",
        title: "Daniel's Prayer and the Seventy Weeks",
        reference: "Daniel 9:1-27",
        summary: "Reading Jeremiah's prophecy of seventy years' desolation, Daniel prays, confessing Israel's sins and pleading for mercy. Gabriel appears: seventy 'weeks' (490 years) are decreed for Israel—to finish transgression, atone for iniquity, bring everlasting righteousness, and anoint the Most Holy. After sixty-nine weeks, Messiah will be cut off. The final week involves a prince who makes a covenant, then brings desolation.",
        characters: ["Daniel", "Gabriel"],
        themes: ["Prayer", "Prophecy", "Messiah's Coming"],
        lessonLearned: "Scripture study leads to prayer; prayer receives further revelation."
      },
      {
        id: "dan-10",
        title: "The Glorious Man",
        reference: "Daniel 10:1-21",
        summary: "After three weeks of mourning and partial fasting, Daniel sees a vision by the Tigris: a man clothed in linen, body like beryl, face like lightning, eyes like torches, arms and legs like burnished bronze, voice like a multitude. Daniel alone sees it; his companions flee. He falls on his face. The man explains he was delayed twenty-one days by the prince of Persia until Michael came to help.",
        characters: ["Daniel", "Glorious Man", "Michael", "Prince of Persia"],
        themes: ["Spiritual Warfare", "Heavenly Beings", "Prayer"],
        lessonLearned: "Prayer engages cosmic conflict we cannot see; persistence matters."
      },
      {
        id: "dan-11",
        title: "Kings of North and South",
        reference: "Daniel 11:1-45",
        summary: "The messenger reveals detailed prophecy: Persian kings, then a mighty Greek king whose kingdom divides into four. Extensive warfare between kings of the North (Syria/Seleucids) and South (Egypt/Ptolemies). The contemptible person (Antiochus IV) will desecrate the temple, set up the abomination of desolation, but the wise will instruct many. His end comes between the seas and the glorious holy mountain.",
        characters: ["Daniel", "Various Kings"],
        themes: ["Detailed Prophecy", "Persecution", "Resistance"],
        lessonLearned: "God knows history's details in advance—His people can endure knowing He is in control."
      },
      {
        id: "dan-12",
        title: "The Time of the End",
        reference: "Daniel 12:1-13",
        summary: "At that time, Michael arises; there will be unprecedented trouble. Those written in the book will be delivered. Many who sleep in the dust will awake—some to everlasting life, some to everlasting contempt. The wise will shine like stars. Daniel is told to seal the book until the end. He asks, 'How long?' 'Go your way, Daniel. The words are sealed until the end. You will rest and rise to your allotted place at the end of days.'",
        characters: ["Daniel", "Michael", "Messenger"],
        themes: ["Resurrection", "Final Judgment", "Sealed Prophecy"],
        lessonLearned: "The faithful dead will rise—go your way faithfully until your rest comes."
      },
      {
        id: "dan-13",
        title: "Daniel's Diet Test",
        reference: "Daniel 1:11-16",
        summary: "Daniel proposes a test to the steward: give us vegetables and water for ten days, then compare our appearance with those eating the king's food. The steward agrees. After ten days, Daniel and his friends look better and healthier than the others. The steward continues providing vegetables instead of rich food and wine. Their obedience to God's dietary laws brings visible blessing.",
        characters: ["Daniel", "Steward", "Three Friends"],
        themes: ["Testing", "Obedience", "God's Blessing"],
        lessonLearned: "Faithful obedience in 'small' matters brings surprising results."
      },
      {
        id: "dan-14",
        title: "Arioch's Urgent Mission",
        reference: "Daniel 2:13-19",
        summary: "When wise men can't reveal Nebuchadnezzar's dream, the king orders their execution. Arioch comes to kill Daniel. With wisdom and discretion, Daniel asks why the decree is so urgent, then requests time before the king. That night, he and his friends pray urgently. The mystery is revealed in a night vision. Daniel blesses God: 'He reveals deep and hidden things; He knows what is in the darkness.'",
        characters: ["Daniel", "Arioch", "Three Friends"],
        themes: ["Crisis Prayer", "Revelation", "Wisdom"],
        lessonLearned: "Facing death, Daniel responds with calm wisdom and urgent prayer—not panic."
      },
      {
        id: "dan-15",
        title: "Daniel Interprets Before the King",
        reference: "Daniel 2:27-45",
        summary: "Before Nebuchadnezzar, Daniel declares: no wise man can reveal this mystery, but there is a God in heaven who reveals mysteries. He tells the dream in detail—the multi-metal statue—then interprets: the head of gold is Nebuchadnezzar; inferior kingdoms follow. The stone that destroys all and fills the earth is God's eternal kingdom. The dream is certain; the interpretation sure.",
        characters: ["Daniel", "Nebuchadnezzar"],
        themes: ["Interpretation", "God's Revelation", "Kingdoms"],
        lessonLearned: "Daniel gives all credit to God, using his moment before the king to witness."
      },
      {
        id: "dan-16",
        title: "Music Signals Worship",
        reference: "Daniel 3:4-7",
        summary: "A herald proclaims: when you hear the sound of horn, pipe, lyre, harp, bagpipe, and every kind of music, you must fall down and worship the golden image. Anyone who does not will immediately be thrown into a furnace of blazing fire. At the sound of music, all peoples, nations, and languages fall and worship—except three Hebrew youths who stand conspicuously upright.",
        characters: ["Herald", "Nations", "Shadrach", "Meshach", "Abednego"],
        themes: ["Idolatry", "Conformity", "Standing Firm"],
        lessonLearned: "When everyone bows to culture's idols, standing upright takes courage."
      },
      {
        id: "dan-17",
        title: "The Fourth Man in the Fire",
        reference: "Daniel 3:24-25",
        summary: "Nebuchadnezzar leaps to his feet in amazement: 'Did we not cast three men bound into the fire?' His counselors confirm. 'But I see four men unbound, walking in the midst of the fire, and they are not hurt; and the appearance of the fourth is like a son of the gods.' Christ appears with His people in their worst trial.",
        characters: ["Nebuchadnezzar", "Three Hebrews", "Fourth Figure"],
        themes: ["Divine Presence", "Christophany", "Protection"],
        lessonLearned: "In our fiery trials, we are not alone—Christ walks with us."
      },
      {
        id: "dan-18",
        title: "Belshazzar's Terror",
        reference: "Daniel 5:5-9",
        summary: "In the same hour that fingers write on the wall, the king's face changes, his thoughts alarm him, his hip joints go slack, his knees knock together. He cries aloud for enchanters, Chaldeans, and astrologers. Whoever reads and interprets will be clothed in purple, wear a gold chain, and be third ruler in the kingdom. But none can read or interpret. The king is more terrified; his lords are perplexed.",
        characters: ["Belshazzar", "Wise Men"],
        themes: ["Terror", "Mystery", "Human Helplessness"],
        lessonLearned: "When God's hand writes, human wisdom is useless."
      },
      {
        id: "dan-19",
        title: "The Decree Against Prayer",
        reference: "Daniel 6:6-9",
        summary: "Jealous officials scheme: the only way to bring Daniel down is through his God. They convince Darius to sign a decree: anyone who prays to any god or man except the king for thirty days will be thrown to the lions. According to the law of Medes and Persians, which cannot be revoked, the king signs. They've set a trap using Daniel's greatest strength—his faithfulness.",
        characters: ["Jealous Officials", "Darius", "Daniel"],
        themes: ["Conspiracy", "Irrevocable Law", "Targeting Faith"],
        lessonLearned: "The faithful are often targeted precisely because of their faithfulness."
      },
      {
        id: "dan-20",
        title: "Daniel's Open Windows",
        reference: "Daniel 6:10-11",
        summary: "When Daniel learns of the decree, he goes to his house. His upper room windows are open toward Jerusalem—as was his custom. Three times a day he gets on his knees and prays and gives thanks before his God, as he had done previously. The officials find him praying and bring the charge. Daniel changes nothing about his practice despite the death sentence.",
        characters: ["Daniel", "Jealous Officials"],
        themes: ["Consistency", "Defiance", "Prayer"],
        lessonLearned: "Faithfulness doesn't hide when persecution comes—it continues openly."
      }
    ]
  },

  // ============================================
  // ESTHER - 15 Stories
  // ============================================
  {
    book: "Esther",
    testament: "old",
    stories: [
      {
        id: "est-1",
        title: "Queen Vashti's Refusal",
        reference: "Esther 1:1-22",
        summary: "King Ahasuerus hosts a 180-day display of wealth, followed by a seven-day feast. On the seventh day, merry with wine, he commands Queen Vashti to appear wearing her royal crown—to display her beauty. She refuses. The king, furious and counseled that other women will follow her example, banishes Vashti and decrees that every man be master in his own home.",
        characters: ["Ahasuerus/Xerxes", "Queen Vashti", "Counselors"],
        themes: ["Pride", "Dignity", "Consequences"],
        lessonLearned: "One refusal changes history—creating the opening for Esther."
      },
      {
        id: "est-2",
        title: "Esther Becomes Queen",
        reference: "Esther 2:1-18",
        summary: "A search begins for a new queen. Beautiful young virgins are gathered to the palace, including Esther—a Jewish orphan raised by her cousin Mordecai. He instructs her not to reveal her heritage. After twelve months of beauty treatments, each girl goes to the king. Esther wins his favor above all others; he sets the royal crown on her head and makes her queen.",
        characters: ["Esther", "Mordecai", "Ahasuerus", "Hegai"],
        themes: ["Providence", "Beauty", "Hidden Identity"],
        lessonLearned: "God positions His people in places of influence—often secretly at first."
      },
      {
        id: "est-3",
        title: "Mordecai Uncovers a Plot",
        reference: "Esther 2:19-23",
        summary: "While sitting at the king's gate, Mordecai overhears two eunuchs, Bigthan and Teresh, plotting to assassinate King Ahasuerus. He tells Esther, who reports it in Mordecai's name. The matter is investigated, confirmed, and the conspirators hanged on the gallows. The incident is recorded in the royal chronicles—but Mordecai receives no reward at the time.",
        characters: ["Mordecai", "Esther", "Bigthan", "Teresh"],
        themes: ["Loyalty", "Divine Timing", "Recording"],
        lessonLearned: "Faithful acts recorded but unrewarded will have their moment."
      },
      {
        id: "est-4",
        title: "Haman's Hatred of Mordecai",
        reference: "Esther 3:1-6",
        summary: "The king promotes Haman above all princes; everyone bows to him. But Mordecai refuses to bow or pay homage. Others ask why he transgresses the command; he tells them he is a Jew. When Haman notices Mordecai won't bow, he's filled with fury. Scorning to attack Mordecai alone, Haman seeks to destroy all Jews throughout the entire kingdom.",
        characters: ["Haman", "Mordecai"],
        themes: ["Pride", "Hatred", "Genocide"],
        lessonLearned: "One man's wounded pride becomes a plot for genocide."
      },
      {
        id: "est-5",
        title: "The Edict of Destruction",
        reference: "Esther 3:7-15",
        summary: "Haman casts Pur (lots) to determine the date for destruction. He tells the king a certain people won't obey royal laws—they should be destroyed. He offers to pay ten thousand talents of silver. The king gives his signet ring: do as you please. Letters go out: on the thirteenth of Adar, annihilate all Jews—young, old, women, children—and plunder their goods. The king and Haman sit to drink, but the city is bewildered.",
        characters: ["Haman", "Ahasuerus", "Couriers"],
        themes: ["Genocide Decree", "Lots", "Evil Planning"],
        lessonLearned: "Evil can operate through official channels—law and authority can be weaponized."
      },
      {
        id: "est-6",
        title: "Mordecai's Challenge to Esther",
        reference: "Esther 4:1-17",
        summary: "Mordecai tears his clothes, puts on sackcloth, and wails loudly. Esther sends to ask why. Mordecai sends back the decree and charges her to go to the king and plead for her people. Esther objects: anyone approaching the king unsummoned faces death unless he extends the golden scepter—and she hasn't been called in thirty days. Mordecai's famous response: 'If you remain silent, relief will come from another place, but you and your father's house will perish. Who knows whether you have come to the kingdom for such a time as this?'",
        characters: ["Mordecai", "Esther"],
        themes: ["Divine Purpose", "Courage", "For Such a Time"],
        lessonLearned: "God positions us for specific moments—will we rise to them?"
      },
      {
        id: "est-7",
        title: "Esther's Decision",
        reference: "Esther 4:15-17",
        summary: "Esther sends word to Mordecai: 'Gather all Jews in Susa; fast for me. Do not eat or drink for three days. I and my young women will fast likewise. Then I will go to the king, though it is against the law. And if I perish, I perish.' Mordecai does everything Esther commands. She has counted the cost and accepted potential death.",
        characters: ["Esther", "Mordecai", "Jews of Susa"],
        themes: ["Fasting", "Courage", "Sacrifice"],
        lessonLearned: "Some callings require accepting death as a possibility—'If I perish, I perish.'"
      },
      {
        id: "est-8",
        title: "Esther Approaches the King",
        reference: "Esther 5:1-8",
        summary: "On the third day, Esther puts on royal robes and stands in the inner court. When the king sees her, she finds favor; he extends the golden scepter. 'What is your request, Queen Esther? Even half the kingdom shall be given.' She invites only the king and Haman to a banquet she has prepared. At the banquet, the king asks again. She requests they come to another banquet tomorrow; then she'll make her request.",
        characters: ["Esther", "Ahasuerus", "Haman"],
        themes: ["Favor", "Patience", "Strategy"],
        lessonLearned: "Wisdom knows when to speak and when to wait for the right moment."
      },
      {
        id: "est-9",
        title: "Haman's Gallows for Mordecai",
        reference: "Esther 5:9-14",
        summary: "Haman leaves the banquet joyful until he sees Mordecai at the gate—still not bowing. At home, he boasts of his riches, sons, and promotions, plus the queen's exclusive invitations. 'Yet all this is worth nothing as long as I see that Jew Mordecai sitting at the gate.' His wife Zeresh suggests building a gallows fifty cubits high (about 75 feet) and asking the king to hang Mordecai on it tomorrow. The idea pleases Haman; he has the gallows built.",
        characters: ["Haman", "Zeresh", "Haman's Friends"],
        themes: ["Pride", "Obsession", "Ironic Planning"],
        lessonLearned: "Pride makes all blessings worthless if one person doesn't give us honor."
      },
      {
        id: "est-10",
        title: "The King's Sleepless Night",
        reference: "Esther 6:1-3",
        summary: "That night, the king cannot sleep. He orders the chronicles read aloud. They read about Mordecai uncovering the assassination plot. The king asks, 'What honor was given to Mordecai for this?' His attendants answer, 'Nothing was done for him.' At that very moment, Haman enters the outer court—planning to request Mordecai's execution. God's timing is perfect.",
        characters: ["Ahasuerus", "Attendants", "Haman (entering)"],
        themes: ["Divine Timing", "Insomnia", "Unrecognized Service"],
        lessonLearned: "God orchestrates sleepless nights to accomplish His purposes."
      },
      {
        id: "est-11",
        title: "Haman's Humiliation",
        reference: "Esther 6:4-14",
        summary: "The king asks Haman, 'What should be done for the man the king delights to honor?' Assuming it's himself, Haman suggests: royal robes, royal horse, parading through the city with a noble proclaiming 'Thus shall it be done to the man whom the king delights to honor!' The king commands, 'Do this for Mordecai the Jew.' Haman leads Mordecai through the city, then rushes home mourning. His wife warns: 'If Mordecai is of Jewish descent, you will not prevail but will surely fall before him.'",
        characters: ["Haman", "Ahasuerus", "Mordecai"],
        themes: ["Reversal", "Humiliation", "Irony"],
        lessonLearned: "Those who set traps often fall into them; those they despise are honored."
      },
      {
        id: "est-12",
        title: "Haman Exposed",
        reference: "Esther 7:1-6",
        summary: "At the second banquet, the king again asks Esther's request. She pleads: 'If I have found favor, let my life and my people's lives be granted. We have been sold to be destroyed, killed, annihilated.' The king demands, 'Who is he who would dare to do this?' Esther points: 'A foe and enemy—this wicked Haman!' Haman is terrified before the king and queen.",
        characters: ["Esther", "Ahasuerus", "Haman"],
        themes: ["Revelation", "Courage", "Judgment"],
        lessonLearned: "The right moment comes to expose evil—and it often shocks those in power."
      },
      {
        id: "est-13",
        title: "Haman Hanged",
        reference: "Esther 7:7-10",
        summary: "The king rises in wrath and goes to the garden. Haman stays to beg Esther for his life, falling on her couch just as the king returns. 'Will he even assault the queen in my own house?' They cover Haman's face. A eunuch mentions the gallows Haman built for Mordecai. The king commands, 'Hang him on it!' Haman is hanged on the very gallows he built for Mordecai.",
        characters: ["Haman", "Ahasuerus", "Esther", "Harbona"],
        themes: ["Poetic Justice", "Irony", "Judgment"],
        lessonLearned: "The gallows we build for others often become our own execution site."
      },
      {
        id: "est-14",
        title: "The Counter-Decree",
        reference: "Esther 8:1-17",
        summary: "Esther receives Haman's estate; Mordecai receives Haman's position. But the first decree cannot be revoked. Esther pleads for a counter-decree. The king allows Mordecai to write in his name: on the appointed day, Jews may defend themselves, destroy attackers, and take plunder. Couriers ride out on royal horses. When the decree reaches every province, there is gladness and joy among Jews; many peoples become Jews out of fear.",
        characters: ["Esther", "Mordecai", "Ahasuerus"],
        themes: ["Reversal", "Defense", "Joy"],
        lessonLearned: "What cannot be undone can be overturned by a greater decree—like gospel over law."
      },
      {
        id: "est-15",
        title: "Purim Established",
        reference: "Esther 9:20-32",
        summary: "On the thirteenth of Adar, Jews strike down their enemies—but take no plunder. The next day is rest and gladness. Mordecai records these events and sends letters establishing Purim as an annual celebration on the fourteenth and fifteenth of Adar—days of feasting, joy, sending food to one another, and gifts to the poor. The festival commemorates how sorrow turned to joy and mourning to celebration.",
        characters: ["Mordecai", "Esther", "Jews"],
        themes: ["Celebration", "Remembrance", "Reversal"],
        lessonLearned: "God's deliverances should be remembered and celebrated generationally."
      }
    ]
  }
];

// Helper function to get stories by book
export const getStoriesByBook = (bookName: string): BibleStory[] => {
  const book = bibleStoryLibrary.find(b => b.book.toLowerCase() === bookName.toLowerCase());
  return book?.stories || [];
};

// Helper function to get all books
export const getAllBooks = (): string[] => {
  return bibleStoryLibrary.map(b => b.book);
};

// Helper function to search stories
export const searchStories = (query: string): BibleStory[] => {
  const lowerQuery = query.toLowerCase();
  const results: BibleStory[] = [];

  bibleStoryLibrary.forEach(book => {
    book.stories.forEach(story => {
      if (
        story.title.toLowerCase().includes(lowerQuery) ||
        story.summary.toLowerCase().includes(lowerQuery) ||
        story.characters.some(c => c.toLowerCase().includes(lowerQuery)) ||
        story.themes.some(t => t.toLowerCase().includes(lowerQuery))
      ) {
        results.push(story);
      }
    });
  });

  return results;
};

// Get total story count
export const getTotalStoryCount = (): number => {
  return bibleStoryLibrary.reduce((total, book) => total + book.stories.length, 0);
};
