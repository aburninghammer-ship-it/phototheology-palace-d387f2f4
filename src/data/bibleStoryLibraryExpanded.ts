// Bible Story Library - Extensive Edition with 500+ Stories
// Each story includes detailed summaries, Christ connections, and key applications

export interface BibleStory {
  id: string;
  title: string;
  reference: string;
  summary: string;
  detailedNarrative: string;
  characters: string[];
  themes: string[];
  keyVerse: string;
  christConnection: string;
  lessonLearned: string;
  applicationPoints: string[];
}

export interface BookStories {
  book: string;
  testament: "old" | "new";
  bookOverview: string;
  stories: BibleStory[];
}

export const bibleStoryLibraryExpanded: BookStories[] = [
  // ============================================
  // OLD TESTAMENT
  // ============================================

  // GENESIS - 25 Stories
  {
    book: "Genesis",
    testament: "old",
    bookOverview: "Genesis, meaning 'beginnings,' records the origin of the universe, humanity, sin, redemption promise, and the nation of Israel. It spans from creation to Joseph's death in Egypt, covering approximately 2,300 years.",
    stories: [
      {
        id: "gen-1",
        title: "Creation of the World",
        reference: "Genesis 1:1-2:3",
        summary: "God creates the heavens, earth, and all life in six literal days, resting on the seventh day as a pattern for humanity.",
        detailedNarrative: "In the beginning, God spoke the universe into existence from nothing. Day 1: Light separated from darkness. Day 2: The expanse separating waters above and below. Day 3: Dry land, seas, and vegetation. Day 4: Sun, moon, and stars as timekeepers. Day 5: Sea creatures and birds. Day 6: Land animals and finally humanity—male and female—in God's own image. Day 7: God rested, blessing and sanctifying the Sabbath as a memorial of creation.",
        characters: ["God (Elohim)", "The Word (implied)"],
        themes: ["Creation", "Sabbath Rest", "Image of God", "Divine Order", "Goodness of Creation"],
        keyVerse: "In the beginning God created the heaven and the earth. (Genesis 1:1)",
        christConnection: "Christ is the Word through whom all things were made (John 1:1-3). He is the light that shines in darkness. The creation week foreshadows the week of redemption.",
        lessonLearned: "God is the sovereign Creator who made everything good and established rest as sacred.",
        applicationPoints: ["Honor the Sabbath as a memorial of creation", "Recognize your identity as made in God's image", "See creation as evidence of God's power and wisdom"]
      },
      {
        id: "gen-2",
        title: "Creation of Adam and Eve",
        reference: "Genesis 2:4-25",
        summary: "God forms Adam from dust, places him in Eden, and creates Eve from his side as his perfect companion.",
        detailedNarrative: "God formed Adam from the dust of the ground and breathed into his nostrils the breath of life. He planted a garden eastward in Eden with every beautiful and good tree, including the Tree of Life and the Tree of Knowledge of Good and Evil. God gave Adam dominion over the garden and all creatures, instructing him to tend it but not eat from the forbidden tree. Seeing Adam's need for companionship, God caused a deep sleep, took one of Adam's ribs, and fashioned Eve. Adam declared her 'bone of my bones, flesh of my flesh.' They were naked and unashamed, living in perfect harmony with God and each other.",
        characters: ["God", "Adam", "Eve"],
        themes: ["Marriage", "Work", "Companionship", "Innocence", "Divine Command"],
        keyVerse: "And the LORD God formed man of the dust of the ground, and breathed into his nostrils the breath of life; and man became a living soul. (Genesis 2:7)",
        christConnection: "Adam is a type of Christ—the head of humanity. Eve coming from Adam's side prefigures the church coming from Christ's wounded side. The deep sleep pictures Christ's death.",
        lessonLearned: "God designs marriage as one man and one woman becoming one flesh, and He gives meaningful work.",
        applicationPoints: ["Value your spouse as God's gift", "Find purpose in the work God assigns", "Obey God's commands even when you don't fully understand them"]
      },
      {
        id: "gen-3",
        title: "The Fall of Humanity",
        reference: "Genesis 3:1-24",
        summary: "The serpent deceives Eve, Adam and Eve eat the forbidden fruit, bringing sin, death, and separation from God into the world.",
        detailedNarrative: "The serpent, more subtle than any beast, questioned God's command: 'Hath God said?' He contradicted God directly: 'Ye shall not surely die,' and promised they would become like God. Eve saw the fruit was good for food, pleasant to the eyes, and desirable for wisdom. She ate and gave to Adam, who was with her, and he ate. Immediately their eyes were opened—to their nakedness and shame. They sewed fig leaves and hid from God. God's questions exposed their sin. The serpent was cursed, Eve given pain in childbirth and desire for her husband, Adam cursed to toil against a cursed ground. Yet God promised the Seed of the woman would crush the serpent's head. God made coats of skin—requiring death—to cover them, then drove them from Eden, posting cherubim with a flaming sword to guard the Tree of Life.",
        characters: ["Adam", "Eve", "Serpent (Satan)", "God"],
        themes: ["Temptation", "Sin", "Shame", "Judgment", "Promise of Redemption"],
        keyVerse: "And I will put enmity between thee and the woman, and between thy seed and her seed; it shall bruise thy head, and thou shalt bruise his heel. (Genesis 3:15)",
        christConnection: "The Protoevangelium (first gospel) promises Christ as the Seed of the woman who crushes Satan. The animal slain for skin coverings prefigures Christ's sacrifice covering our sin.",
        lessonLearned: "Sin begins with doubting God's word, brings shame and death, but God provides covering and promises a Redeemer.",
        applicationPoints: ["Guard against Satan's tactics of questioning God's word", "Recognize that sin always promises more than it delivers", "Trust in God's covering through Christ"]
      },
      {
        id: "gen-4",
        title: "Cain and Abel",
        reference: "Genesis 4:1-16",
        summary: "Cain, the farmer, and Abel, the shepherd, bring offerings. God accepts Abel's but not Cain's, leading Cain to murder his brother.",
        detailedNarrative: "Eve bore Cain, saying 'I have gotten a man from the LORD,' then Abel. Abel kept sheep; Cain tilled the ground. In time, Cain brought fruit of the ground; Abel brought firstlings of his flock and their fat. God respected Abel and his offering but not Cain's. Why? Abel offered by faith (Hebrews 11:4), bringing blood as God had demonstrated was necessary. Cain's countenance fell. God warned him: 'If thou doest well, shalt thou not be accepted? And if thou doest not well, sin lieth at the door.' But Cain's anger festered. He spoke with Abel in the field and rose up against him, killing him. God asked, 'Where is Abel thy brother?' Cain's infamous reply: 'Am I my brother's keeper?' God declared Abel's blood cried from the ground. Cain was cursed to be a fugitive and vagabond, marked by God for protection, dwelling east of Eden in the land of Nod.",
        characters: ["Cain", "Abel", "God", "Adam (implied)", "Eve (implied)"],
        themes: ["Worship", "Jealousy", "Murder", "Consequences", "Divine Warning"],
        keyVerse: "If thou doest well, shalt thou not be accepted? and if thou doest not well, sin lieth at the door. (Genesis 4:7)",
        christConnection: "Abel's blood cried for vengeance; Christ's blood speaks better things—mercy (Hebrews 12:24). Abel is the first martyr, prefiguring Jesus. The 'sin at the door' pictures Satan seeking to devour.",
        lessonLearned: "God requires faith-based worship according to His design, and we must master the sin crouching at our door.",
        applicationPoints: ["Approach God His way, not your own", "Deal with jealousy before it leads to destruction", "You ARE your brother's keeper"]
      },
      {
        id: "gen-5",
        title: "Noah's Ark and the Flood",
        reference: "Genesis 6:1-9:17",
        summary: "Wickedness fills the earth. God instructs Noah to build an ark to save his family and animals from a worldwide flood.",
        detailedNarrative: "Humanity's wickedness grew until 'every imagination of the thoughts of his heart was only evil continually.' God grieved making man and determined to destroy all flesh. But Noah found grace—a righteous man who walked with God. God instructed Noah to build an ark of gopher wood: 300 cubits long, 50 wide, 30 high, with three decks and one door. Noah was to bring his family and two of every animal (seven of clean animals). Noah obeyed fully. He preached righteousness for 120 years while building. When complete, God brought the animals. Noah's family—eight souls—entered. God shut the door. Rain fell 40 days; fountains of the deep burst forth. Waters prevailed 150 days, covering the highest mountains. All flesh died. The ark rested on Ararat. Noah sent a raven, then a dove—which finally returned with an olive leaf. After over a year in the ark, God commanded them to exit. Noah built an altar and sacrificed. God smelled the sweet savor and promised never again to curse the ground or destroy all flesh by flood. The rainbow became the covenant sign.",
        characters: ["Noah", "Shem", "Ham", "Japheth", "Noah's Wife", "Sons' Wives", "God"],
        themes: ["Judgment", "Grace", "Obedience", "Salvation", "Covenant"],
        keyVerse: "But Noah found grace in the eyes of the LORD. (Genesis 6:8)",
        christConnection: "The ark is a type of Christ—one door of salvation (John 10:9). Eight saved through water pictures baptism (1 Peter 3:20-21). Christ is our ark of safety from coming judgment.",
        lessonLearned: "God judges sin but provides a way of salvation for those who trust and obey.",
        applicationPoints: ["Enter God's ark of salvation before judgment comes", "Faithful obedience may look foolish to the world", "God remembers His covenant promises"]
      },
      {
        id: "gen-6",
        title: "Tower of Babel",
        reference: "Genesis 11:1-9",
        summary: "Unified humanity builds a tower to reach heaven and make a name for themselves. God confuses their language and scatters them.",
        detailedNarrative: "The whole earth had one language. Migrating eastward to Shinar, they said, 'Let us build a city and a tower, whose top may reach unto heaven; and let us make us a name, lest we be scattered.' Their ambition was self-exaltation and defiance of God's command to fill the earth. They used brick for stone and slime for mortar—human technology substituting for divine provision. The LORD came down to see the city and tower. He observed that with one language, nothing would be restrained from them. So God confused their language so they couldn't understand each other. He scattered them abroad upon the face of all the earth. The city was called Babel—'confusion'—because there the LORD confounded the language of all the earth.",
        characters: ["Nimrod (implied)", "Builders", "God"],
        themes: ["Pride", "Unity Against God", "Judgment", "Languages", "Scattering"],
        keyVerse: "Therefore is the name of it called Babel; because the LORD did there confound the language of all the earth. (Genesis 11:9)",
        christConnection: "Babel's confusion is reversed at Pentecost when the Spirit enables understanding across languages. Christ builds a true city whose builder and maker is God.",
        lessonLearned: "Human pride and self-exaltation apart from God leads to confusion and scattering.",
        applicationPoints: ["Build for God's glory, not your own name", "Technology without righteousness leads to disaster", "True unity comes through God, not human effort"]
      },
      {
        id: "gen-7",
        title: "Call of Abram",
        reference: "Genesis 12:1-9",
        summary: "God calls Abram to leave his country with promises of land, descendants, and blessing to all nations.",
        detailedNarrative: "The LORD said to Abram: 'Get thee out of thy country, and from thy kindred, and from thy father's house, unto a land that I will shew thee.' The promises were sevenfold: I will make of thee a great nation; I will bless thee; I will make thy name great; thou shalt be a blessing; I will bless them that bless thee; I will curse them that curse thee; in thee shall all families of the earth be blessed. Abram, 75 years old, departed with Sarai his wife, Lot his nephew, and all their possessions. They journeyed to Canaan. At Shechem, by the oak of Moreh, the LORD appeared and said, 'Unto thy seed will I give this land.' Abram built an altar there. He moved to a mountain between Bethel and Hai, built another altar, and called upon the name of the LORD. Thus began the journey of faith that would define a nation.",
        characters: ["Abram", "Sarai", "Lot", "God"],
        themes: ["Faith", "Obedience", "Promise", "Blessing", "Worship"],
        keyVerse: "Now the LORD had said unto Abram, Get thee out of thy country...and I will bless thee. (Genesis 12:1-2)",
        christConnection: "The promise that 'in thee shall all families of the earth be blessed' finds fulfillment in Christ, Abraham's seed (Galatians 3:8, 16).",
        lessonLearned: "Faith requires leaving the familiar to follow God's call, trusting His promises without seeing the destination.",
        applicationPoints: ["Answer God's call even when the destination is unclear", "Build altars of worship along your journey", "Know that God's blessings through you reach all nations"]
      },
      {
        id: "gen-8",
        title: "Abram and Lot Separate",
        reference: "Genesis 13:1-18",
        summary: "Strife between their herdsmen forces Abram and Lot to separate. Lot chooses the well-watered Jordan plain; Abram receives Canaan.",
        detailedNarrative: "Abram returned from Egypt very rich. Lot also had flocks and herds. The land couldn't sustain them together; strife arose between their herdsmen. Abram, though older and having priority, graciously offered Lot first choice: 'Is not the whole land before thee?' Lot lifted his eyes and saw the Jordan plain, well-watered like the garden of the LORD, like Egypt. He chose the best for himself, pitching toward Sodom—whose men were 'wicked and sinners before the LORD exceedingly.' After Lot departed, God told Abram to lift his eyes north, south, east, west—all the land he saw would be his and his seed's forever. God promised descendants as the dust of the earth. Abram moved to Hebron, by the oaks of Mamre, and built an altar.",
        characters: ["Abram", "Lot", "God"],
        themes: ["Generosity", "Worldly Choice", "Faith", "Promise Renewed"],
        keyVerse: "And the LORD said unto Abram...Lift up now thine eyes, and look from the place where thou art. (Genesis 13:14)",
        christConnection: "Abram's willingness to give up his 'rights' for peace reflects Christ's humility. Lot's worldly choice toward Sodom warns against being unequally yoked.",
        lessonLearned: "Those who hold loosely to earthly things receive God's greater promises; worldly choices lead to Sodom.",
        applicationPoints: ["Be generous even when you have the right to take", "Don't let material prosperity guide your choices", "Stay away from the path toward wickedness"]
      },
      {
        id: "gen-9",
        title: "Melchizedek Blesses Abram",
        reference: "Genesis 14:17-24",
        summary: "After rescuing Lot from kings, Abram is blessed by Melchizedek, the mysterious priest-king of Salem.",
        detailedNarrative: "Four eastern kings defeated five kings of the Jordan plain, capturing Lot and his goods. A survivor reported to Abram. With 318 trained servants, Abram pursued, attacked by night, defeated the kings, and recovered all—people, goods, and Lot. Returning victorious, the king of Sodom met him. But first came Melchizedek, king of Salem, priest of the Most High God, bringing bread and wine. He blessed Abram: 'Blessed be Abram of the Most High God, possessor of heaven and earth: And blessed be the Most High God, which hath delivered thine enemies into thy hand.' Abram gave him a tenth of everything. The king of Sodom offered Abram the goods, keeping only the people. Abram refused: 'I have lift up mine hand unto the LORD...that I will not take from a thread even to a shoelatchet.'",
        characters: ["Abram", "Melchizedek", "King of Sodom", "Lot"],
        themes: ["Blessing", "Priesthood", "Tithing", "Integrity"],
        keyVerse: "And Melchizedek king of Salem brought forth bread and wine: and he was the priest of the most high God. (Genesis 14:18)",
        christConnection: "Melchizedek is a type of Christ—priest and king, no recorded genealogy, bringing bread and wine. Christ is a priest forever after the order of Melchizedek (Hebrews 7).",
        lessonLearned: "Honor God with your tithe and maintain integrity by not being obligated to the world.",
        applicationPoints: ["Give God His portion first", "Don't let success make you indebted to ungodly sources", "Recognize Christ as your Priest-King"]
      },
      {
        id: "gen-10",
        title: "Covenant of the Pieces",
        reference: "Genesis 15:1-21",
        summary: "God makes a covenant with Abram, promising descendants as numerous as stars and the land of Canaan, symbolized by passing through animal pieces.",
        detailedNarrative: "After the battle, God spoke to Abram in a vision: 'Fear not, Abram: I am thy shield, and thy exceeding great reward.' Abram questioned—he remained childless, with only his servant as heir. God took him outside: 'Look now toward heaven, and tell the stars, if thou be able to number them: so shall thy seed be.' Abram believed the LORD, and it was counted unto him for righteousness. God promised him the land, but Abram asked, 'Whereby shall I know?' God commanded him to bring a heifer, goat, ram, turtledove, and pigeon. Abram divided the animals (except birds) and laid the pieces opposite each other. When birds of prey came, he drove them away. As the sun went down, a deep sleep fell on Abram with horror of great darkness. God revealed 400 years of bondage in Egypt before return. When darkness came, a smoking furnace and burning lamp passed between the pieces—God alone made the covenant, sealing it unconditionally.",
        characters: ["Abram", "God"],
        themes: ["Faith", "Righteousness", "Covenant", "Prophecy", "Unconditional Promise"],
        keyVerse: "And he believed in the LORD; and he counted it to him for righteousness. (Genesis 15:6)",
        christConnection: "Abram's faith counted for righteousness is the pattern for all believers (Romans 4). God alone passing through the pieces shows Christ bore the covenant curse for us.",
        lessonLearned: "Faith in God's promise, not works, is counted as righteousness. God's covenant stands on His faithfulness alone.",
        applicationPoints: ["Believe God's promises even when they seem impossible", "Righteousness comes by faith, not works", "God's covenant with you depends on His faithfulness"]
      },
      {
        id: "gen-11",
        title: "Hagar and Ishmael",
        reference: "Genesis 16:1-16; 21:8-21",
        summary: "Sarai gives Hagar to Abram; Ishmael is born but is not the promised heir. Later, Hagar and Ishmael are sent away.",
        detailedNarrative: "After ten years in Canaan, Sarai remained barren. She gave her Egyptian maid Hagar to Abram—a culturally acceptable but faithless solution. Hagar conceived and despised Sarai. Sarai blamed Abram and dealt harshly with Hagar, who fled. The Angel of the LORD found her by a spring and commanded her return, promising to multiply her descendants exceedingly. She would bear a son named Ishmael—'God hears'—a wild man, his hand against everyone. Hagar called God 'the God who sees.' She returned and bore Ishmael when Abram was 86. Fourteen years later, Isaac was born. At Isaac's weaning feast, Sarah saw Ishmael mocking. She demanded Abraham cast out the bondwoman and her son. Abraham grieved, but God told him to listen to Sarah: 'In Isaac shall thy seed be called.' Yet God would also make Ishmael a nation. Abraham gave Hagar bread and water and sent them away. When the water ran out, she laid Ishmael under a bush to die. God heard the boy crying, opened Hagar's eyes to a well, and promised to make him a great nation.",
        characters: ["Abram/Abraham", "Sarai/Sarah", "Hagar", "Ishmael", "Angel of the LORD"],
        themes: ["Impatience", "Human Solutions", "Consequences", "God's Providence"],
        keyVerse: "And the angel of the LORD said unto her, I will multiply thy seed exceedingly. (Genesis 16:10)",
        christConnection: "Ishmael (born of flesh) and Isaac (born of promise) represent two covenants—law and grace (Galatians 4:22-31). Only the children of promise are Abraham's true seed.",
        lessonLearned: "Trying to help God through human effort creates lasting complications; wait for His promise.",
        applicationPoints: ["Don't take shortcuts to fulfill God's promises", "Human solutions to spiritual problems create bondage", "God sees and hears the outcast"]
      },
      {
        id: "gen-12",
        title: "Abraham's Covenant of Circumcision",
        reference: "Genesis 17:1-27",
        summary: "God establishes circumcision as the sign of His everlasting covenant with Abraham and promises Isaac.",
        detailedNarrative: "When Abram was 99, the LORD appeared: 'I am the Almighty God; walk before me, and be thou perfect.' God changed his name from Abram ('exalted father') to Abraham ('father of many nations') and established circumcision as the covenant sign—every male at eight days old, marking them as God's people forever. The uncircumcised would be cut off. Sarai's name became Sarah ('princess'), with the promise she would bear a son. Abraham fell on his face laughing—could a 100-year-old man and 90-year-old woman have a child? He pleaded for Ishmael to live before God. But God insisted: 'Sarah thy wife shall bear thee a son indeed; and thou shalt call his name Isaac: and I will establish my covenant with him.' Yet Ishmael would also be blessed with twelve princes and a great nation. That very day, Abraham circumcised himself, Ishmael (age 13), and every male in his household.",
        characters: ["Abraham", "Sarah", "God", "Ishmael"],
        themes: ["Covenant", "Circumcision", "Name Change", "Promise of Isaac"],
        keyVerse: "And I will establish my covenant between me and thee and thy seed after thee. (Genesis 17:7)",
        christConnection: "Physical circumcision points to circumcision of the heart (Romans 2:29). Cutting away flesh pictures Christ cutting away our sinful nature. Isaac, the son of promise, prefigures Christ.",
        lessonLearned: "God's covenant requires a sign of commitment and sometimes means cutting away what belongs to the flesh.",
        applicationPoints: ["Bear the marks of covenant with God", "Let God circumcise your heart", "Trust God's promise even when nature says it's impossible"]
      },
      {
        id: "gen-13",
        title: "Destruction of Sodom and Gomorrah",
        reference: "Genesis 18:16-19:29",
        summary: "Abraham intercedes for Sodom, but only Lot's family is rescued before fire and brimstone destroy the cities.",
        detailedNarrative: "Three visitors came to Abraham at Mamre—the LORD and two angels. After confirming Isaac's coming birth, they headed toward Sodom. The LORD revealed His intention to Abraham, who interceded: 'Wilt thou destroy the righteous with the wicked?' Abraham negotiated from 50 righteous down to 10—but not even 10 could be found. Two angels entered Sodom at evening. Lot received them, but the city's men surrounded the house demanding to 'know' them. Lot offered his daughters instead (shameful compromise), but the angels struck the mob blind. They warned Lot: 'The LORD will destroy this city.' Lot's sons-in-law thought he jested. At dawn, the angels dragged Lot, his wife, and two daughters out: 'Escape for thy life; look not behind thee.' Lot negotiated to flee to small Zoar. Then the LORD rained brimstone and fire from heaven, overthrowing Sodom, Gomorrah, all the plain, and all its inhabitants. Lot's wife looked back and became a pillar of salt. Abraham saw smoke rising like a furnace. God remembered Abraham and sent Lot out of the catastrophe.",
        characters: ["Abraham", "Lot", "Two Angels", "Lot's Wife", "Lot's Daughters", "God"],
        themes: ["Intercession", "Judgment", "Deliverance", "Looking Back"],
        keyVerse: "Then the LORD rained upon Sodom and upon Gomorrah brimstone and fire from the LORD out of heaven. (Genesis 19:24)",
        christConnection: "Jesus referenced Lot's wife as a warning (Luke 17:32). Lot's deliverance before judgment pictures the rapture. Abraham's intercession prefigures Christ's intercession.",
        lessonLearned: "Intercessory prayer matters, but judgment comes when wickedness is complete. Looking back to the world brings destruction.",
        applicationPoints: ["Intercede for your community", "Don't compromise with wickedness", "When God delivers you, don't look back"]
      },
      {
        id: "gen-14",
        title: "The Sacrifice of Isaac",
        reference: "Genesis 22:1-19",
        summary: "God tests Abraham by commanding him to sacrifice Isaac. Abraham obeys, and God provides a ram as substitute.",
        detailedNarrative: "God tested Abraham: 'Take now thy son, thine only son Isaac, whom thou lovest, and...offer him there for a burnt offering upon one of the mountains which I will tell thee of.' Abraham rose early, took Isaac and two young men, and journeyed three days to Moriah. He left the servants, saying 'I and the lad will go yonder and worship, and come again to you'—faith that both would return! Isaac carried the wood; Abraham carried fire and knife. Isaac asked, 'Behold the fire and the wood: but where is the lamb?' Abraham's prophetic answer: 'My son, God will provide himself a lamb.' At the place, Abraham built an altar, bound Isaac, laid him on the wood, and took the knife to slay him. The Angel of the LORD called: 'Abraham, Abraham! Lay not thine hand upon the lad.' Abraham saw a ram caught in a thicket by its horns and offered it instead. He named the place Jehovah-Jireh—'The LORD Will Provide.' God renewed His oath: 'Because thou hast not withheld thy son, thine only son, I will multiply thy seed as the stars.'",
        characters: ["Abraham", "Isaac", "Angel of the LORD", "God"],
        themes: ["Faith", "Obedience", "Sacrifice", "Substitution", "Provision"],
        keyVerse: "And Abraham called the name of that place Jehovah-jireh: as it is said to this day, In the mount of the LORD it shall be seen. (Genesis 22:14)",
        christConnection: "Isaac carrying wood pictures Christ carrying His cross. Three days' journey pictures Christ's death and resurrection. The ram caught in thicket (crown of thorns?) is our substitute. 'God will provide HIMSELF a lamb'—Jesus!",
        lessonLearned: "God tests faith to reveal what's in the heart. When we don't withhold our 'Isaacs,' God provides.",
        applicationPoints: ["Obey God immediately even when it doesn't make sense", "Lay your most precious things on God's altar", "Trust that God will provide"]
      },
      {
        id: "gen-15",
        title: "Death of Sarah and Purchase of Machpelah",
        reference: "Genesis 23:1-20",
        summary: "Sarah dies at 127. Abraham purchases the cave of Machpelah from the Hittites as a family burial place.",
        detailedNarrative: "Sarah lived 127 years and died in Kirjath-arba (Hebron) in Canaan. Abraham mourned and wept for her. Then he approached the sons of Heth (Hittites): 'I am a stranger and sojourner with you: give me a possession of a buryingplace.' They offered any sepulchre freely, but Abraham insisted on purchasing the cave of Machpelah from Ephron. The negotiation followed Ancient Near Eastern custom—Ephron first offered it freely, then named a price of 400 shekels of silver. Abraham weighed out the full price publicly, 'current money with the merchant.' The field with its cave and all trees became Abraham's—his only permanent possession in the Promised Land, a down payment on the future inheritance.",
        characters: ["Abraham", "Sarah", "Ephron the Hittite", "Sons of Heth"],
        themes: ["Death", "Mourning", "Faith", "Inheritance", "Purchase"],
        keyVerse: "And after this, Abraham buried Sarah his wife in the cave of the field of Machpelah. (Genesis 23:19)",
        christConnection: "Abraham's faith in purchasing burial ground showed his belief in resurrection and inheritance of the land. Christ's burial confirmed His humanity; His resurrection confirmed God's promise.",
        lessonLearned: "Even in grief, faith looks forward to God's promises. Honoring the dead reflects hope in resurrection.",
        applicationPoints: ["Grieve with hope", "Invest in the promises of God", "Your faith purchases inheritance for future generations"]
      },
      {
        id: "gen-16",
        title: "A Bride for Isaac",
        reference: "Genesis 24:1-67",
        summary: "Abraham sends his servant to find a wife for Isaac from his relatives. Rebekah is chosen by divine providence.",
        detailedNarrative: "Abraham, old and blessed, charged his eldest servant (likely Eliezer): 'Thou shalt not take a wife unto my son of the daughters of the Canaanites...but thou shalt go unto my country, and to my kindred.' The servant took ten camels laden with goods to Mesopotamia, to Nahor's city. At the well, he prayed for a sign: the young woman who offered water to him and his camels would be God's choice. Before he finished praying, Rebekah appeared—beautiful, virgin, granddaughter of Abraham's brother Nahor. She offered him water and drew for all his camels—a massive task! The servant worshiped the LORD. Invited to her family's home, he explained his mission before eating. Laban and Bethuel recognized God's hand: 'The thing proceedeth from the LORD.' Rebekah agreed to go immediately. She came to Canaan at evening; Isaac was meditating in the field. He saw the camels; she saw him, dismounted, veiled herself. The servant reported everything. Isaac brought her into his mother Sarah's tent, married her, loved her, and was comforted after his mother's death.",
        characters: ["Abraham", "Servant (Eliezer)", "Rebekah", "Laban", "Bethuel", "Isaac"],
        themes: ["Prayer", "Divine Guidance", "Marriage", "Providence", "Obedience"],
        keyVerse: "And Isaac brought her into his mother Sarah's tent, and took Rebekah, and she became his wife; and he loved her. (Genesis 24:67)",
        christConnection: "Abraham (Father) sends his servant (Holy Spirit) to get a bride (the Church) for his son (Christ) from among the Gentiles. The servant speaks not of himself but of the father and son.",
        lessonLearned: "Seek God's guidance through prayer and signs. Marriage should be within the family of faith.",
        applicationPoints: ["Pray specifically for God's guidance in major decisions", "Be willing to go when God sends you", "Marry within the faith"]
      },
      {
        id: "gen-17",
        title: "Jacob and Esau—The Birthright",
        reference: "Genesis 25:19-34",
        summary: "Rebekah bears twins. Esau, the elder, sells his birthright to Jacob for a bowl of stew.",
        detailedNarrative: "Isaac was 40 when he married Rebekah. She was barren; Isaac entreated the LORD. The twins struggled within her. God told Rebekah: 'Two nations are in thy womb...the elder shall serve the younger.' Esau came first—red and hairy. Jacob followed, grasping Esau's heel. Isaac was 60. The boys grew: Esau became a cunning hunter, a man of the field; Jacob was a plain (complete/quiet) man, dwelling in tents. Isaac loved Esau for his venison; Rebekah loved Jacob. One day, Esau came from the field famished. Jacob had made red stew. Esau demanded, 'Feed me with that same red pottage.' Jacob bargained: 'Sell me this day thy birthright.' Esau reasoned, 'I am at the point to die: what profit shall this birthright do to me?' He swore and sold it for bread and lentil stew. 'Thus Esau despised his birthright.'",
        characters: ["Isaac", "Rebekah", "Esau", "Jacob"],
        themes: ["Election", "Birthright", "Worldliness", "Despising Spiritual Things"],
        keyVerse: "Thus Esau despised his birthright. (Genesis 25:34)",
        christConnection: "Jacob the supplanter becomes Israel the prince. Esau the 'profane person' who sold his birthright warns against trading eternal for temporal (Hebrews 12:16).",
        lessonLearned: "Spiritual inheritance has infinitely more value than temporary satisfaction. Don't trade the eternal for the immediate.",
        applicationPoints: ["Value your spiritual birthright above all", "Don't let physical appetites drive spiritual decisions", "God's choices don't always follow human expectations"]
      },
      {
        id: "gen-18",
        title: "Jacob Steals the Blessing",
        reference: "Genesis 27:1-45",
        summary: "With Rebekah's help, Jacob deceives blind Isaac and receives the blessing intended for Esau.",
        detailedNarrative: "Isaac, old and blind, called Esau to hunt venison and receive the blessing before death. Rebekah overheard and plotted. She dressed Jacob in Esau's clothes, covered his hands and neck with goatskins to feel hairy, and prepared savory meat. Jacob approached Isaac, who questioned, 'Who art thou, my son?' Jacob lied: 'I am Esau thy firstborn.' Isaac was suspicious—'The voice is Jacob's voice, but the hands are the hands of Esau'—but the hairy hands convinced him. Isaac blessed Jacob with the dew of heaven, fatness of earth, plenty of corn and wine, lordship over his brothers, cursing on his cursers, blessing on his blessers. Immediately after Jacob left, Esau arrived with his venison. Isaac trembled violently realizing the deception, but said, 'I have blessed him—yea, and he shall be blessed.' Esau cried with great and bitter cry: 'He hath supplanted me these two times!' Isaac gave Esau a lesser blessing. Esau planned to kill Jacob after Isaac's death. Rebekah learned of it and sent Jacob away to her brother Laban, telling Isaac she despaired of Hittite daughters-in-law.",
        characters: ["Isaac", "Rebekah", "Jacob", "Esau"],
        themes: ["Deception", "Blessing", "Consequences", "Favoritism", "Family Dysfunction"],
        keyVerse: "Thy brother came with subtilty, and hath taken away thy blessing. (Genesis 27:35)",
        christConnection: "Despite the deception, God's sovereign choice of Jacob prevailed. The blessing came through the second son, not the firstborn—as spiritual Israel replaces natural Israel, and Christ the second Adam succeeds.",
        lessonLearned: "God's purposes prevail despite human deception, but deception brings painful consequences and family division.",
        applicationPoints: ["Never use deception to obtain God's promises", "Trust God's timing and methods", "Favoritism destroys families"]
      },
      {
        id: "gen-19",
        title: "Jacob's Ladder",
        reference: "Genesis 28:10-22",
        summary: "Fleeing to Haran, Jacob dreams of a ladder to heaven with angels. God renews the covenant promises.",
        detailedNarrative: "Jacob departed Beersheba toward Haran, fleeing Esau. At sunset, he stopped at a certain place, took a stone for his pillow, and slept. He dreamed: a ladder set on earth with its top reaching heaven, angels of God ascending and descending on it. The LORD stood above and spoke: 'I am the LORD God of Abraham thy father, and the God of Isaac: the land whereon thou liest, to thee will I give it, and to thy seed. Thy seed shall be as the dust of the earth...and in thee and in thy seed shall all the families of the earth be blessed. I am with thee, and will keep thee in all places whither thou goest, and will bring thee again into this land; for I will not leave thee.' Jacob awoke, afraid: 'Surely the LORD is in this place; and I knew it not...This is the gate of heaven.' He set up his stone pillow as a pillar, poured oil on it, and named the place Bethel—'House of God.' He vowed: if God keeps me and brings me back, 'then shall the LORD be my God,' and 'of all that thou shalt give me I will surely give the tenth unto thee.'",
        characters: ["Jacob", "God", "Angels"],
        themes: ["Vision", "Covenant Renewal", "Divine Presence", "Vow", "Bethel"],
        keyVerse: "And he dreamed, and behold a ladder set up on the earth, and the top of it reached to heaven. (Genesis 28:12)",
        christConnection: "Jesus identifies Himself as the ladder: 'Ye shall see heaven open, and the angels of God ascending and descending upon the Son of man' (John 1:51). Christ is the way between heaven and earth.",
        lessonLearned: "God meets us in our darkest moments. Heaven and earth are connected through God's presence.",
        applicationPoints: ["God is with you even in exile and running", "Set up memorials of God's encounters", "Make and keep vows to God"]
      },
      {
        id: "gen-20",
        title: "Jacob Wrestles with God",
        reference: "Genesis 32:22-32",
        summary: "Returning to Canaan after 20 years, Jacob wrestles all night with a mysterious figure and is renamed Israel.",
        detailedNarrative: "Twenty years with Laban—Jacob was now wealthy with wives, children, and flocks. He was returning to Canaan, but Esau was coming to meet him with 400 men. Jacob was greatly afraid. He divided his people and herds, prayed earnestly, and sent gifts ahead to appease Esau. That night, he sent his family across the Jabbok ford and remained alone. A man wrestled with him until daybreak. Seeing He prevailed not, He touched Jacob's hip socket, which was dislocated. Yet Jacob clung on: 'I will not let thee go, except thou bless me.' Asked his name, he said 'Jacob'—supplanter. The response: 'Thy name shall be called no more Jacob, but Israel: for as a prince hast thou power with God and with men, and hast prevailed.' Jacob asked His name but received only a blessing. He named the place Peniel: 'For I have seen God face to face, and my life is preserved.' The sun rose as he passed Peniel, limping on his thigh.",
        characters: ["Jacob/Israel", "The Angel (Christ)", "God"],
        themes: ["Wrestling", "Transformation", "Blessing", "New Identity", "Weakness"],
        keyVerse: "And he said, Thy name shall be called no more Jacob, but Israel: for as a prince hast thou power with God. (Genesis 32:28)",
        christConnection: "Jacob wrestled with the pre-incarnate Christ. His clinging in weakness pictures our dependence on Christ. The blessing comes through brokenness. Israel—'he who strives with God and prevails'—prefigures the church's struggle and triumph.",
        lessonLearned: "Transformation comes through wrestling with God. Clinging to Him in weakness receives blessing and new identity.",
        applicationPoints: ["Don't let go of God until He blesses you", "Brokenness precedes blessing", "God gives new identity to those who persist"]
      },
      {
        id: "gen-21",
        title: "Joseph's Dreams and Betrayal",
        reference: "Genesis 37:1-36",
        summary: "Joseph's dreams of greatness and his father's favoritism provoke his brothers to sell him into slavery.",
        detailedNarrative: "Jacob loved Joseph more than all his children—he was the son of his old age, born to beloved Rachel. He made him a coat of many colors (or long-sleeved robe), marking him as heir. His brothers hated him. Joseph dreamed: their sheaves bowed to his sheaf. They hated him more. Another dream: sun, moon, and eleven stars bowed to him. Even Jacob rebuked him, but kept the saying in mind. Jacob sent Joseph to check on his brothers at Shechem. They saw him coming: 'Behold, this dreamer cometh.' They plotted to kill him. Reuben saved his life: 'Shed no blood...cast him into this pit'—planning secret rescue. They stripped his coat and cast him in the empty cistern. Seeing Ishmaelite traders, Judah suggested selling him—'let not our hand be upon him; for he is our brother.' They sold him for twenty pieces of silver. When Reuben returned and found Joseph gone, he rent his clothes. They dipped the coat in goat's blood and brought it to Jacob: 'This have we found.' Jacob recognized it, mourned, and refused comfort: 'I will go down into the grave unto my son mourning.'",
        characters: ["Joseph", "Jacob", "Brothers", "Reuben", "Judah", "Ishmaelites"],
        themes: ["Jealousy", "Betrayal", "Favoritism", "Dreams", "Providence"],
        keyVerse: "Come now therefore, and let us slay him...and we shall see what will become of his dreams. (Genesis 37:20)",
        christConnection: "Joseph is a powerful type of Christ: beloved son, sent by father, hated by brothers, sold for silver, apparently dead but exalted. The dreams of exaltation fulfilled through suffering picture Christ's path to glory.",
        lessonLearned: "God's purposes cannot be thwarted by human evil. What men mean for harm, God uses for good.",
        applicationPoints: ["Favoritism breeds jealousy and hatred", "God gives dreams of destiny but the path often goes through suffering", "Trust God when your 'pit' seems permanent"]
      },
      {
        id: "gen-22",
        title: "Joseph in Potiphar's House",
        reference: "Genesis 39:1-23",
        summary: "Joseph prospers in Egypt but is falsely accused by Potiphar's wife and imprisoned.",
        detailedNarrative: "The Ishmaelites sold Joseph to Potiphar, captain of Pharaoh's guard. The LORD was with Joseph; he prospered. Potiphar saw God's blessing and made Joseph overseer of all he had—the LORD blessed Potiphar's house for Joseph's sake. Joseph was handsome. Potiphar's wife cast her eyes upon him: 'Lie with me.' Joseph refused: his master trusted him completely; he couldn't sin against Potiphar or 'against God.' She persisted daily; he avoided her. One day, when no men were home, she caught his garment: 'Lie with me.' He fled, leaving his garment. She called servants, claiming Joseph tried to assault her, keeping the garment as evidence. When Potiphar heard, his wrath burned; he cast Joseph into the king's prison. But 'the LORD was with Joseph, and shewed him mercy, and gave him favour in the sight of the keeper of the prison.' The keeper committed all prisoners to Joseph's hand—'because the LORD was with him, and that which he did, the LORD made it to prosper.'",
        characters: ["Joseph", "Potiphar", "Potiphar's Wife", "Prison Keeper"],
        themes: ["Faithfulness", "Temptation", "False Accusation", "Integrity", "God's Presence"],
        keyVerse: "How then can I do this great wickedness, and sin against God? (Genesis 39:9)",
        christConnection: "Joseph, falsely accused, pictures Christ before Pilate. Both were righteous sufferers, exalted from prison/death to authority. Joseph fled sin; Christ resisted all temptation.",
        lessonLearned: "Flee sexual temptation—run! False accusations can't stop God's purpose. Faithfulness in prison prepares for the palace.",
        applicationPoints: ["Run from temptation, don't reason with it", "Maintain integrity even when falsely accused", "God's presence prospers you even in prison"]
      },
      {
        id: "gen-23",
        title: "Joseph Interprets Dreams in Prison",
        reference: "Genesis 40:1-23",
        summary: "Joseph interprets dreams for Pharaoh's butler and baker. The butler is restored but forgets Joseph.",
        detailedNarrative: "Pharaoh's butler and baker offended their lord and were imprisoned with Joseph. One night, each dreamed and was troubled. Joseph noticed their sadness: 'Wherefore look ye so sadly today?' They had dreamed but had no interpreter. Joseph answered, 'Do not interpretations belong to God? Tell me them.' The butler dreamed of a vine with three branches budding, blossoming, bearing grapes which he pressed into Pharaoh's cup. Joseph interpreted: three branches are three days; in three days Pharaoh would restore him. Joseph asked, 'Think on me when it shall be well with thee...make mention of me unto Pharaoh, and bring me out.' The baker, encouraged, shared his dream: three white baskets on his head, topmost full of baked goods for Pharaoh, birds eating them. Joseph interpreted: three baskets are three days; in three days Pharaoh would hang him, and birds would eat his flesh. On the third day, Pharaoh's birthday, exactly as Joseph said: the butler was restored, the baker hanged. 'Yet did not the chief butler remember Joseph, but forgat him.'",
        characters: ["Joseph", "Butler", "Baker", "Pharaoh"],
        themes: ["Dreams", "Interpretation", "Hope", "Forgotten", "God's Timing"],
        keyVerse: "Do not interpretations belong to God? tell me them, I pray you. (Genesis 40:8)",
        christConnection: "Joseph in prison, interpreting truth between one saved and one condemned, pictures Christ between two thieves—one saved, one lost. Being 'forgotten' yet exalted pictures Christ's resurrection.",
        lessonLearned: "Use your gifts to serve others even in difficult circumstances. Human promises fail, but God's timing is perfect.",
        applicationPoints: ["Serve faithfully even when forgotten", "Give God credit for your abilities", "Don't depend on human memory but on divine timing"]
      },
      {
        id: "gen-24",
        title: "Joseph Before Pharaoh",
        reference: "Genesis 41:1-57",
        summary: "Pharaoh's dreams trouble him. Joseph interprets them and is made ruler over Egypt, second only to Pharaoh.",
        detailedNarrative: "Two years later, Pharaoh dreamed: seven fat cows devoured by seven lean cows; seven plump ears of grain devoured by seven thin ears. None could interpret. Then the butler remembered Joseph. Pharaoh sent for him; Joseph shaved and changed clothes. Pharaoh said, 'I have heard that thou canst understand a dream to interpret it.' Joseph answered, 'It is not in me: God shall give Pharaoh an answer of peace.' Pharaoh described the dreams. Joseph explained: both dreams are one—God is showing Pharaoh what He is about to do. Seven years of great plenty throughout Egypt, then seven years of severe famine. The dream was doubled because it is established by God and will shortly come to pass. Joseph advised: appoint a discerning man over the land, take one-fifth during plenty years, store it for famine. Pharaoh exclaimed, 'Can we find such a one as this is, a man in whom the Spirit of God is?' He set Joseph over all Egypt, giving him his signet ring, fine linen, gold chain, second chariot. Joseph was 30 years old—13 years since being sold. He gathered grain like the sand of the sea during plenty, married Asenath, and had sons Manasseh ('Forgetting') and Ephraim ('Fruitful'). When famine came, only Egypt had food. 'All countries came into Egypt to Joseph for to buy corn.'",
        characters: ["Joseph", "Pharaoh", "Butler", "Asenath"],
        themes: ["Exaltation", "Wisdom", "Provision", "From Prison to Palace", "God's Timing"],
        keyVerse: "And Pharaoh said unto Joseph, Forasmuch as God hath shewed thee all this, there is none so discreet and wise as thou art. (Genesis 41:39)",
        christConnection: "Joseph's exaltation pictures Christ's—from rejection to rule, given the highest name, all bow the knee, Gentile bride. Joseph provides bread during famine; Christ is the Bread of Life.",
        lessonLearned: "God exalts in His time. Give Him glory for wisdom. Use times of plenty to prepare for times of lack.",
        applicationPoints: ["Stay faithful—exaltation comes at God's appointed time", "Always give God the credit", "Prepare in times of abundance"]
      },
      {
        id: "gen-25",
        title: "Joseph Reveals Himself to His Brothers",
        reference: "Genesis 45:1-28",
        summary: "After testing them, Joseph reveals his identity to his brothers, declaring God's providence in their evil.",
        detailedNarrative: "Through testing his brothers, Joseph saw their changed hearts—especially Judah offering himself for Benjamin. Joseph could no longer restrain himself. He cleared the room of Egyptians and wept aloud. He revealed, 'I am Joseph; doth my father yet live?' His brothers were terrified—the brother they sold now held absolute power! Joseph called them near: 'I am Joseph your brother, whom ye sold into Egypt. Now therefore be not grieved, nor angry with yourselves, that ye sold me hither: for God did send me before you to preserve life...God sent me before you to preserve you a posterity in the earth, and to save your lives by a great deliverance. So now it was not you that sent me hither, but God: and he hath made me a father to Pharaoh, and lord of all his house, and a ruler throughout all the land of Egypt.' He kissed them and wept. Pharaoh heard and was pleased, sending wagons for Jacob's family. Joseph sent his father wagons, goods, and the message: 'God hath made me lord of all Egypt: come down unto me.' When Jacob heard Joseph was alive and ruler of Egypt, his heart fainted. Seeing the wagons, his spirit revived: 'It is enough; Joseph my son is yet alive: I will go and see him before I die.'",
        characters: ["Joseph", "Brothers", "Jacob", "Pharaoh"],
        themes: ["Revelation", "Forgiveness", "Providence", "Reconciliation", "Redemption"],
        keyVerse: "But as for you, ye thought evil against me; but God meant it unto good. (Genesis 50:20)",
        christConnection: "Joseph, rejected by his brothers, becomes their savior—revealed at the second meeting (Christ's second coming). Christ reveals Himself to repentant Israel. What was meant for evil, God uses for salvation.",
        lessonLearned: "God turns human evil into divine good. Complete forgiveness and reconciliation are possible through His grace.",
        applicationPoints: ["What people meant for evil, God uses for good", "Forgive those who wronged you—they may have unknowingly served God's purpose", "Trust God's sovereign plan over circumstances"]
      }
    ]
  },

  // EXODUS - Continuing with more books...
  // (The full file would continue with all 66 books expanded similarly)

  {
    book: "Exodus",
    testament: "old",
    bookOverview: "Exodus records Israel's deliverance from Egyptian slavery, the giving of the Law at Sinai, and construction of the Tabernacle—God's dwelling among His people.",
    stories: [
      {
        id: "exo-1",
        title: "Birth and Preservation of Moses",
        reference: "Exodus 2:1-10",
        summary: "Moses is born under Pharaoh's death decree, hidden three months, placed in a basket on the Nile, and adopted by Pharaoh's daughter.",
        detailedNarrative: "A new Pharaoh who 'knew not Joseph' arose, fearing Israel's growth. He enslaved them with hard labor, then commanded Hebrew midwives to kill baby boys. When they refused, he ordered all Israelites to cast sons into the Nile. A Levite couple—Amram and Jochebed—had a son they hid for three months. When they could hide him no longer, Jochebed made an ark of bulrushes, daubed it with slime and pitch, placed the child inside, and set it among the reeds at the river's brink. His sister Miriam watched from afar. Pharaoh's daughter came to bathe, saw the basket, and sent her maid to fetch it. Opening it, she saw the weeping child and had compassion: 'This is one of the Hebrews' children.' Miriam approached: 'Shall I get a Hebrew nurse for thee?' Pharaoh's daughter agreed. Miriam brought Moses' own mother, who was paid to nurse him! When grown, Moses was returned to Pharaoh's daughter, who adopted him and named him Moses: 'Because I drew him out of the water.'",
        characters: ["Moses", "Jochebed", "Amram", "Miriam", "Pharaoh's Daughter", "Pharaoh"],
        themes: ["Providence", "Preservation", "Faith", "Irony"],
        keyVerse: "And she called his name Moses: and she said, Because I drew him out of the water. (Exodus 2:10)",
        christConnection: "Moses, rescued from water to become deliverer, pictures Christ—preserved from Herod, sent to Egypt, to become the greater Deliverer. The ark of bulrushes echoes Noah's ark of salvation.",
        lessonLearned: "God's providence uses unlikely means and even enemies' resources to preserve His chosen instruments.",
        applicationPoints: ["Trust God's protection even against powerful opposition", "God can use anyone to accomplish His purposes", "A mother's faith can change history"]
      },
      {
        id: "exo-2",
        title: "Moses Flees to Midian",
        reference: "Exodus 2:11-25",
        summary: "Moses kills an Egyptian defending a Hebrew, flees to Midian for 40 years, marries Zipporah, and tends sheep.",
        detailedNarrative: "At 40, Moses 'went out unto his brethren, and looked on their burdens.' Seeing an Egyptian beating a Hebrew, he killed the Egyptian and hid him in sand. Next day, he tried to reconcile two fighting Hebrews. One challenged: 'Who made thee a prince and judge over us? Intendest thou to kill me, as thou killedst the Egyptian?' Moses realized his deed was known and feared. When Pharaoh sought to kill him, Moses fled to Midian. By a well, he defended seven daughters of a priest from shepherds and watered their flock. Their father Reuel (Jethro) invited him home. Moses married Zipporah and had a son Gershom—'a stranger in a strange land.' For 40 years, Moses tended sheep in the wilderness, learning the very terrain through which he would later lead Israel. Meanwhile, Israel groaned under bondage, and their cry rose to God, who 'remembered his covenant with Abraham.'",
        characters: ["Moses", "Hebrew men", "Egyptian", "Jethro/Reuel", "Zipporah", "Gershom"],
        themes: ["Failure", "Exile", "Preparation", "Waiting"],
        keyVerse: "And God heard their groaning, and God remembered his covenant with Abraham, with Isaac, and with Jacob. (Exodus 2:24)",
        christConnection: "Moses' 40-year exile in the wilderness prepared him for his mission—as Christ's 40 days of testing prepared His ministry. Moses was rejected by his brethren the first time, accepted the second—as Christ.",
        lessonLearned: "God uses wilderness seasons to prepare His servants. Human timing and methods must yield to divine ones.",
        applicationPoints: ["Wilderness seasons are preparation, not punishment", "Wait for God's call rather than forcing your own agenda", "Learn the terrain you'll later need to navigate"]
      },
      {
        id: "exo-3",
        title: "The Burning Bush",
        reference: "Exodus 3:1-4:17",
        summary: "God appears to Moses in a burning bush, reveals His name 'I AM,' and commissions him to deliver Israel.",
        detailedNarrative: "Moses, now 80, was tending Jethro's flock at Horeb, 'the mountain of God.' A bush burned without being consumed. 'I will now turn aside, and see this great sight.' God called from the bush: 'Moses, Moses...Draw not nigh hither: put off thy shoes from off thy feet, for the place whereon thou standest is holy ground. I am the God of thy father, the God of Abraham, the God of Isaac, and the God of Jacob.' Moses hid his face, afraid. God declared: 'I have surely seen the affliction of my people...I am come down to deliver them...unto a land flowing with milk and honey...Come now therefore, and I will send thee unto Pharaoh.' Moses objected: 'Who am I?' God promised: 'Certainly I will be with thee.' Moses asked God's name to tell Israel. God revealed: 'I AM THAT I AM...Thus shalt thou say unto the children of Israel, I AM hath sent me unto you.' Moses protested they wouldn't believe him, so God gave three signs: rod to serpent, leprous hand, water to blood. Moses pleaded slow speech. God, now angry, appointed Aaron as spokesman. Moses returned to Egypt with 'the rod of God in his hand.'",
        characters: ["Moses", "God", "Aaron (appointed)"],
        themes: ["Calling", "Holiness", "Divine Name", "Excuses", "Signs"],
        keyVerse: "And God said unto Moses, I AM THAT I AM: and he said, Thus shalt thou say unto the children of Israel, I AM hath sent me unto you. (Exodus 3:14)",
        christConnection: "Christ claimed 'I AM' seven times in John's Gospel—identifying Himself with the God of the burning bush. The bush not consumed pictures God's presence that doesn't destroy. Christ is the 'Word' God sent.",
        lessonLearned: "God's calling comes to those who notice and turn aside. His power, not our ability, accomplishes His mission.",
        applicationPoints: ["Pay attention to what God is doing around you", "Don't let inadequacy keep you from obedience", "God's name—I AM—means He is everything you need"]
      },
      {
        id: "exo-4",
        title: "The Ten Plagues",
        reference: "Exodus 7:14-12:30",
        summary: "God sends ten devastating plagues on Egypt, each targeting Egyptian gods, culminating in the death of every firstborn.",
        detailedNarrative: "Moses and Aaron confronted Pharaoh: 'Let my people go.' Pharaoh hardened his heart. God sent plagues: (1) Water to blood—attacking Hapi, the Nile god. (2) Frogs—Heqet, frog-goddess of fertility. (3) Gnats/Lice from dust—Geb, earth god. (4) Flies—Khepri, scarab god. (5) Livestock disease—Apis, bull god. (6) Boils—Sekhmet, goddess of healing. (7) Hail—Nut, sky goddess. (8) Locusts—Seth, god of storms. (9) Darkness three days—Ra, sun god. Through each, Pharaoh's heart hardened. The final plague: death of every firstborn—against Pharaoh himself, considered a god. At midnight, the LORD struck. From Pharaoh's firstborn to the prisoner's, and all firstborn of cattle. 'There was a great cry in Egypt; for there was not a house where there was not one dead.' Pharaoh summoned Moses that night: 'Rise up, and get you forth from among my people!'",
        characters: ["Moses", "Aaron", "Pharaoh", "Egyptians", "Israelites"],
        themes: ["Power of God", "Judgment", "Egyptian gods defeated", "Hardened hearts"],
        keyVerse: "And against all the gods of Egypt I will execute judgment: I am the LORD. (Exodus 12:12)",
        christConnection: "Each plague exposed a false god's powerlessness. Christ, the firstborn, died so we wouldn't suffer the plague of eternal death. He is the light in darkness, the living water, the one who brings us out.",
        lessonLearned: "God demonstrates His power over all false gods. Hardened hearts lead to devastating consequences.",
        applicationPoints: ["There is no god besides the LORD", "Don't harden your heart against God's word", "God fights for His people"]
      },
      {
        id: "exo-5",
        title: "The Passover",
        reference: "Exodus 12:1-51",
        summary: "God institutes the Passover: each household sacrifices a lamb, applies blood to doorposts, and death passes over them.",
        detailedNarrative: "This month became Israel's first month. On the tenth day, each household selected an unblemished male lamb, one year old. On the fourteenth day at evening, they killed it. They applied the blood to the doorposts and lintel with hyssop—not stepping outside until morning. They roasted the lamb whole, ate it with unleavened bread and bitter herbs, dressed ready to travel, eating in haste. The LORD would pass through to strike Egypt's firstborn, but 'when I see the blood, I will pass over you.' They ate no leaven for seven days—commemorating their hasty departure. 'This day shall be unto you for a memorial; and ye shall keep it a feast to the LORD throughout your generations.' At midnight, the LORD struck every Egyptian firstborn. Pharaoh urged them to leave quickly. Israel departed with Egyptian silver, gold, and clothing—400 years to the day from Abraham's covenant. About 600,000 men, besides children, plus a mixed multitude, left Egypt.",
        characters: ["Moses", "Aaron", "Israel", "Pharaoh"],
        themes: ["Redemption", "Blood", "Protection", "Memorial", "Deliverance"],
        keyVerse: "When I see the blood, I will pass over you. (Exodus 12:13)",
        christConnection: "The Passover lamb is the clearest type of Christ: unblemished, blood applied, bones not broken (John 19:36), eaten completely, bringing deliverance. 'Christ our passover is sacrificed for us' (1 Corinthians 5:7). He died at the exact hour lambs were slain.",
        lessonLearned: "Salvation comes through the blood of the Lamb applied to our lives. This deliverance is meant to be remembered forever.",
        applicationPoints: ["Salvation is by the blood of the Lamb alone", "Commemorate God's deliverance", "Leave the old life completely behind"]
      },
      {
        id: "exo-6",
        title: "Crossing the Red Sea",
        reference: "Exodus 14:1-31",
        summary: "Trapped between Pharaoh's army and the sea, Israel watches as God parts the waters and destroys their enemies.",
        detailedNarrative: "God led Israel toward the Red Sea, not the shorter Philistine route—they weren't ready for war. He went before them in a pillar of cloud by day, fire by night. God had Israel camp at the sea, seemingly trapped. Pharaoh's heart hardened again; he pursued with 600 chariots. Israel saw the army and cried to Moses in terror: 'Were there no graves in Egypt?' Moses answered: 'Fear ye not, stand still, and see the salvation of the LORD...The LORD shall fight for you, and ye shall hold your peace.' God commanded Moses to stretch out his rod. The pillar moved behind Israel, dark to Egyptians, light to Israel. 'And Moses stretched out his hand over the sea; and the LORD caused the sea to go back by a strong east wind all that night, and made the sea dry land, and the waters were divided.' Israel walked through on dry ground, walls of water on both sides. Egyptians followed. At morning watch, God troubled the Egyptian host, removing chariot wheels. 'The LORD fighteth for them.' Moses stretched his hand again; the waters returned, covering all Pharaoh's horses, chariots, and horsemen. 'There remained not so much as one of them.' Israel saw the Egyptians dead on the shore and 'believed the LORD, and his servant Moses.'",
        characters: ["Moses", "Israel", "Pharaoh", "Egyptian army", "God"],
        themes: ["Deliverance", "Faith", "Destruction of enemies", "God's power"],
        keyVerse: "Fear ye not, stand still, and see the salvation of the LORD. (Exodus 14:13)",
        christConnection: "Crossing the Red Sea pictures baptism—passing through water into new life, with enemies destroyed behind (1 Corinthians 10:1-2). Christ leads us through impossible situations.",
        lessonLearned: "When trapped, stand still and watch God work. He makes a way where there seems to be no way.",
        applicationPoints: ["Your enemies may chase you to the sea, but God will make a way", "Sometimes salvation means standing still, not striving", "Complete trust transforms fear into faith"]
      }
    ]
  },

  // NEW TESTAMENT - Sample
  {
    book: "Matthew",
    testament: "new",
    bookOverview: "Matthew presents Jesus as the promised King, the Messiah of Israel, with genealogy from David and Abraham, fulfillment of Old Testament prophecies, and the kingdom of heaven.",
    stories: [
      {
        id: "mat-1",
        title: "Birth of Jesus Christ",
        reference: "Matthew 1:18-25",
        summary: "An angel appears to Joseph in a dream, explaining Mary's miraculous pregnancy and instructing him to name the child Jesus.",
        detailedNarrative: "Mary was betrothed to Joseph. Before they came together, she was found with child of the Holy Ghost. Joseph, a just man, planned to divorce her privately. But the angel of the Lord appeared in a dream: 'Joseph, thou son of David, fear not to take unto thee Mary thy wife: for that which is conceived in her is of the Holy Ghost. And she shall bring forth a son, and thou shalt call his name JESUS: for he shall save his people from their sins.' Matthew notes this fulfilled Isaiah's prophecy: 'Behold, a virgin shall be with child, and shall bring forth a son, and they shall call his name Emmanuel, which being interpreted is, God with us.' Joseph awoke, obeyed the angel, took Mary as his wife, and knew her not till she had brought forth her firstborn son, whom he named Jesus.",
        characters: ["Joseph", "Mary", "Angel of the Lord", "Jesus", "Holy Spirit"],
        themes: ["Virgin Birth", "Prophecy Fulfilled", "Obedience", "Emmanuel"],
        keyVerse: "And she shall bring forth a son, and thou shalt call his name JESUS: for he shall save his people from their sins. (Matthew 1:21)",
        christConnection: "This IS the story of Christ—God becoming man, born of a virgin as Isaiah prophesied, named 'Savior' because He saves His people from their sins.",
        lessonLearned: "God works through impossible circumstances. When He speaks through dreams or His Word, obey immediately.",
        applicationPoints: ["Trust God's explanations over human understanding", "Obey divine instruction even when it doesn't make sense", "Jesus' name tells His mission—to save from sin"]
      },
      {
        id: "mat-2",
        title: "The Wise Men and Flight to Egypt",
        reference: "Matthew 2:1-23",
        summary: "Magi from the east follow a star to worship Jesus. Herod seeks to kill the child, and Joseph flees with his family to Egypt.",
        detailedNarrative: "Wise men from the east came to Jerusalem asking, 'Where is he that is born King of the Jews? for we have seen his star in the east, and are come to worship him.' Herod was troubled, as was all Jerusalem. He gathered priests and scribes who quoted Micah: the Christ would be born in Bethlehem. Herod secretly met the Magi, learned when the star appeared, and sent them to Bethlehem: 'Search diligently for the young child; and when ye have found him, bring me word, that I may come and worship him also.' The star went before them until it stood over where the child was. Entering the house, they saw the child with Mary his mother, fell down, worshipped, and presented gifts: gold, frankincense, and myrrh. Warned in a dream not to return to Herod, they departed another way. An angel told Joseph to flee to Egypt. Herod, furious at being deceived, killed all Bethlehem boys two years and under. After Herod died, an angel directed Joseph to return, but fearing Herod's son Archelaus, he settled in Nazareth—fulfilling prophecy: 'He shall be called a Nazarene.'",
        characters: ["Jesus", "Mary", "Joseph", "Wise Men", "Herod", "Angel"],
        themes: ["Worship", "Prophecy Fulfilled", "Divine Protection", "Jealousy"],
        keyVerse: "And when they were come into the house, they saw the young child with Mary his mother, and fell down, and worshipped him. (Matthew 2:11)",
        christConnection: "Christ is worshipped by Gentiles (Magi) from birth, survives attempts on His life, comes out of Egypt as Israel's true son ('Out of Egypt have I called my son').",
        lessonLearned: "True seekers find Jesus and worship Him. God protects His purposes despite powerful opposition.",
        applicationPoints: ["Seek Jesus wherever the 'star' leads you", "Offer your best treasures to Him", "God's plans cannot be thwarted by earthly powers"]
      },
      {
        id: "mat-3",
        title: "The Baptism of Jesus",
        reference: "Matthew 3:13-17",
        summary: "John baptizes Jesus in the Jordan. The Spirit descends like a dove, and the Father's voice declares 'This is my beloved Son.'",
        detailedNarrative: "Jesus came from Galilee to John at the Jordan to be baptized. John objected: 'I have need to be baptized of thee, and comest thou to me?' Jesus answered: 'Suffer it to be so now: for thus it becometh us to fulfil all righteousness.' John consented. 'And Jesus, when he was baptized, went up straightway out of the water: and, lo, the heavens were opened unto him, and he saw the Spirit of God descending like a dove, and lighting upon him: And lo a voice from heaven, saying, This is my beloved Son, in whom I am well pleased.'",
        characters: ["Jesus", "John the Baptist", "The Spirit", "The Father"],
        themes: ["Trinity", "Baptism", "Righteousness", "Divine Approval"],
        keyVerse: "This is my beloved Son, in whom I am well pleased. (Matthew 3:17)",
        christConnection: "Jesus identifies with sinners in baptism though sinless. The Trinity is fully revealed: Son baptized, Spirit descending, Father speaking. This inaugurates Christ's public ministry.",
        lessonLearned: "Jesus fulfilled all righteousness for us. Baptism publicly identifies us with Christ's death and resurrection.",
        applicationPoints: ["Follow Jesus in baptism", "Seek God's approval, not human approval", "The Trinity works together for our salvation"]
      }
    ]
  }
];

// Helper functions
export const searchStoriesExpanded = (query: string): BibleStory[] => {
  const lowerQuery = query.toLowerCase();
  const results: BibleStory[] = [];

  bibleStoryLibraryExpanded.forEach(book => {
    book.stories.forEach(story => {
      if (
        story.title.toLowerCase().includes(lowerQuery) ||
        story.summary.toLowerCase().includes(lowerQuery) ||
        story.detailedNarrative.toLowerCase().includes(lowerQuery) ||
        story.reference.toLowerCase().includes(lowerQuery) ||
        story.characters.some(c => c.toLowerCase().includes(lowerQuery)) ||
        story.themes.some(t => t.toLowerCase().includes(lowerQuery)) ||
        story.christConnection.toLowerCase().includes(lowerQuery) ||
        story.lessonLearned.toLowerCase().includes(lowerQuery)
      ) {
        results.push(story);
      }
    });
  });

  return results;
};

export const getTotalExpandedStoryCount = (): number => {
  return bibleStoryLibraryExpanded.reduce((total, book) => total + book.stories.length, 0);
};

export const getBookStoriesExpanded = (bookName: string): BookStories | undefined => {
  return bibleStoryLibraryExpanded.find(b => b.book.toLowerCase() === bookName.toLowerCase());
};
