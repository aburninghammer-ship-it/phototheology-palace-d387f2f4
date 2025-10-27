export interface KidsPhototheologyDay {
  day: number;
  week: number;
  title: string;
  floor: string;
  room?: string;
  ageGroup: 'ages-6-8' | 'ages-9-12' | 'ages-13-15';
  kidFriendlyFocus: string;
  scripture: string;
  scriptureText: string;
  storyTime: string;
  funActivity: string;
  memoryGame: string;
  reflection: string;
  prayer: string;
  parentTip?: string;
}

export const phototheologyCourseKids: KidsPhototheologyDay[] = [
  // Week 1: Floor 1 - Building Your Memory Palace
  {
    day: 1,
    week: 1,
    title: "Welcome to the Bible Memory Palace!",
    floor: "Floor 1: Furnishing",
    ageGroup: 'ages-6-8',
    kidFriendlyFocus: "Imagining the Bible as a huge palace you can explore",
    scripture: "Psalm 119:11",
    scriptureText: "Thy word have I hid in mine heart, that I might not sin against thee.",
    storyTime: "What if you could build a giant castle in your mind where every room holds a Bible story? That's what Phototheology is! 'Photo' means pictures, and 'theology' means learning about God. So Phototheology means learning about God using PICTURES in your brain! Here's how it works: Instead of just reading Bible stories and forgetting them, you turn them into MOVIES in your mind. Then you store those movies in different rooms of your memory palace. The palace has 8 FLOORS! Floor 1 is where you fill your palace with stories. Floor 2 is where you become a Bible detective. Floor 3 is where you practice using the Bible everywhere you go. Floors 4-5-6 help you understand prophecy and deep stuff about Jesus. Floor 7 is where your heart gets on fire for God. Floor 8 is when you're SO good at it that you don't even think about the palace anymore—you just KNOW the Bible by heart! Today, we're starting Floor 1, Room 1: The Story Room!",
    funActivity: "Draw your own palace! Get a big piece of paper and draw a tall building with 8 floors. Label them 1-8. On Floor 1, draw some stick figures acting out your favorite Bible story. Color each floor a different color. Put it on your wall—this is YOUR memory palace!",
    memoryGame: "Say this rhyme: 'Eight floors high, reaching for the sky! Stories, questions, freestyle too! Jesus in every room, it's all about You!'",
    reflection: "What's your favorite Bible story? Where would you put it in your palace?",
    prayer: "Dear God, thank You for giving us the Bible! Help me build a memory palace in my mind so I never forget Your amazing stories. Make learning about You fun! Amen.",
    parentTip: "Phototheology makes Bible memory fun and visual. Encourage your child to revisit their drawn palace throughout the course, adding details as they learn."
  },
  {
    day: 2,
    week: 1,
    title: "Story Room: Turn Bible Stories Into Movies!",
    floor: "Floor 1: Furnishing",
    room: "Story Room (SR)",
    ageGroup: 'ages-6-8',
    kidFriendlyFocus: "Memorizing stories by seeing them like movies",
    scripture: "Luke 24:27",
    scriptureText: "Beginning at Moses and all the prophets, he expounded unto them in all the scriptures the things concerning himself.",
    storyTime: "The Story Room is like a movie theater in your palace! Instead of reading Bible stories and forgetting them, you turn them into MOVIES in your brain. Let's practice with David and Goliath: Close your eyes and imagine... A GIANT 9 feet tall is yelling at the Israelite army. Everyone is scared. A shepherd boy named David walks up with just a sling and 5 stones. Goliath laughs: 'Am I a dog that you come at me with sticks?!' David shouts back: 'You come with a sword, but I come in the name of the LORD!' David puts a stone in his sling, swings it around—WHOOSH—and lets it fly! The stone hits Goliath RIGHT in the forehead—BONK! The giant falls forward—CRASH! David runs over, grabs Goliath's sword, and cuts off his head. The Philistines RUN AWAY! Can you see that movie in your head? THAT'S how you store stories in the Story Room!",
    funActivity: "Movie poster project: Pick ANY Bible story. Create a movie poster for it! Draw the main scene, give it a cool title ('David vs. Goliath: Giant Slayer!'), list the main characters, and write one sentence of what happens. Make it look like a real movie poster!",
    memoryGame: "Story speed drill: With a parent or friend, take turns naming Bible characters. The other person has 10 seconds to name their story! Example: 'Moses!' → 'Parted the Red Sea!'",
    reflection: "Which Bible story would make the BEST movie?",
    prayer: "Dear Jesus, thank You for all the amazing stories in the Bible! Help me remember them like movies in my mind. When I need courage, remind me of David. When I need faith, remind me of Abraham. Fill my Story Room! Amen.",
    parentTip: "Read a Bible story together, then have your child retell it to you while acting it out. Movement + visualization = stronger memory."
  },
  {
    day: 3,
    week: 1,
    title: "Imagination Room: Step INSIDE the Stories!",
    floor: "Floor 1: Furnishing",
    room: "Imagination Room (IR)",
    ageGroup: 'ages-9-12',
    kidFriendlyFocus: "Using all five senses to experience Bible stories",
    scripture: "Hebrews 11:1",
    scriptureText: "Faith is the substance of things hoped for, the evidence of things not seen.",
    storyTime: "The Imagination Room is where you don't just WATCH the movie—you STEP INSIDE IT! Let's practice with the Red Sea crossing. Don't just read 'Moses parted the sea.' Close your eyes and IMAGINE you're actually there... You're an Israelite kid. You hear screaming: 'THE EGYPTIANS ARE COMING!' You see dust clouds—Pharaoh's army is chasing you! Your heart is pounding. You reach the Red Sea—there's nowhere to run! The Egyptians are getting closer. You hear horses and chariots. Then Moses raises his staff—WHOOOOSH! A mighty wind starts blowing! The water starts MOVING! It rises up on both sides like giant walls of water! You look up and see FISH swimming in the wall! You smell the salty sea. You feel the wind on your face. Moses shouts: 'GO!' You run into the seabed—the ground is still wet and squishy under your feet. The walls of water are TOWERING over you, but they don't fall! Millions of people cross. You make it to the other side. Then the Egyptians try to follow—and CRASH! The water falls on them. They're gone. You're safe. You'll NEVER forget that memory because you were THERE (in your imagination)!",
    funActivity: "Sensory story journal: Pick a Bible story. Write down what you would SEE, HEAR, SMELL, TASTE, and FEEL if you were there. Example: Daniel in lions' den: SEE—big furry lions with sharp teeth. HEAR—growling and roaring. SMELL—animal smell. FEEL—scared but also peaceful because God is with me.",
    memoryGame: "Close your eyes and imagine: You're in the boat with the disciples when the storm hits. Feel the boat rocking. Hear the thunder. See the waves. Then Jesus stands and says, 'PEACE, BE STILL!' The storm instantly stops. Open your eyes—did you feel it?",
    reflection: "Which Bible story do you want to step inside?",
    prayer: "Dear God, thank You for giving me an imagination! Help me use it to see Your stories more clearly. When I imagine being at the Red Sea or in the storm with Jesus, make it so real that I never forget! Amen.",
    parentTip: "Before bed, lead your child through guided imagination of a Bible story. Use calm voice and sensory details. This becomes a powerful bedtime discipleship tool!"
  },
  {
    day: 4,
    week: 1,
    title: "24FPS Room: Bible Chapters as Movie Frames!",
    floor: "Floor 1: Furnishing",
    room: "24FPS Room (24)",
    ageGroup: 'ages-9-12',
    kidFriendlyFocus: "Memorizing chapters by creating one picture for each",
    scripture: "Exodus 14:21",
    scriptureText: "Moses stretched out his hand over the sea, and the LORD caused the sea to go back.",
    storyTime: "Did you know movies are just lots of pictures played super fast? It's called 24 FPS (24 Frames Per Second). Your brain sees 24 pictures every second and thinks it's moving! We can use this for the Bible. Instead of trying to remember EVERYTHING in a chapter, create ONE PICTURE for each chapter—like a movie frame! Let's try Genesis: Chapter 1 = Birthday cake earth (creation). Chapter 2 = Two people in a garden (Adam & Eve). Chapter 3 = Snake biting an apple (the fall). Chapter 4 = A fist hitting (Cain kills Abel). Chapter 5 = Old man with a long beard (genealogy/long lives). See how each picture reminds you of the chapter? Do this for all 50 chapters of Genesis and you can 'flip through' the whole book in your mind like a flip-book movie!",
    funActivity: "Create chapter picture cards: Get index cards. Pick a Bible book (start small—try Ruth with only 4 chapters!). Draw ONE simple picture for each chapter. On the back, write what happens in that chapter. Shuffle them and see if you can put them in the correct order!",
    memoryGame: "Genesis flip-book speed drill: How fast can you name what happens in Genesis chapters 1-10? (1=creation, 2=Adam&Eve, 3=fall, 4=Cain&Abel, 5=genealogy, 6=Noah warned, 7=flood, 8=ark lands, 9=rainbow, 10=tower of Babel). Time yourself!",
    reflection: "If you made a movie of the book of Jonah, what would your 4 frames be?",
    prayer: "Lord, You made my brain able to remember pictures! Help me turn Bible chapters into frames so I never forget them. Make Your Word stick in my memory forever! Amen.",
    parentTip: "Start with a short book (Jonah, Ruth, Esther). Work through it together creating one weird/memorable image per chapter. Quiz your child later—they'll amaze you!"
  },
  {
    day: 5,
    week: 1,
    title: "Translation Room: Turn Words Into Pictures!",
    floor: "Floor 1: Furnishing",
    room: "Translation Room (TR)",
    ageGroup: 'ages-6-8',
    kidFriendlyFocus: "Translating Bible verses into images you can see",
    scripture: "Psalm 119:105",
    scriptureText: "Thy word is a lamp unto my feet, and a light unto my path.",
    storyTime: "Some Bible verses are easy to picture—like 'Jesus calmed the storm.' But what about verses that use symbols, like 'Thy word is a lamp'? The Translation Room is where you turn those word-pictures into REAL pictures in your brain! Psalm 119:105 says God's Word is a lamp. So imagine: You're walking on a dark path at night. You can't see anything! Then someone hands you a bright flashlight (lamp). Suddenly you can see where to step! You don't trip on rocks or fall off a cliff. That's what the Bible does—it lights up your life so you know which way to go! Let's try another: 'Jesus is the door' (John 10:9). Picture a big wooden door. On one side is darkness, danger, and wolves. On the other side is a bright, beautiful meadow with sheep, sunshine, and safety. Jesus IS that door! By translating word-pictures into brain-pictures, you'll remember verses forever!",
    funActivity: "Verse-to-Picture translation game: Pick 5 verses with picture language (examples: 'The Lord is my rock,' 'Your word is sweeter than honey,' 'Jesus is the bread of life,' 'I am the vine; you are the branches,' 'Faith is a shield'). Draw a simple picture for each verse. Try to draw them from memory later!",
    memoryGame: "Picture-to-Verse match: Parent says a picture ('A shepherd with sheep'), kid names the verse ('The Lord is my shepherd')!",
    reflection: "What's a verse you love? What picture does it make in your mind?",
    prayer: "Dear God, thank You for using pictures in the Bible to teach me! Help me turn Your words into images I can see in my mind. Make Your Word come alive for me! Amen.",
    parentTip: "When reading Bible stories, pause and ask, 'What does this look like? What do you see?' Train the visual skill early—it builds lifelong Scripture retention."
  },
  {
    day: 6,
    week: 1,
    title: "Gems Room: Finding Bible Treasure!",
    floor: "Floor 1: Furnishing",
    room: "Gems Room (GR)",
    ageGroup: 'ages-9-12',
    kidFriendlyFocus: "Discovering cool connections between Bible verses",
    scripture: "Proverbs 2:4",
    scriptureText: "If thou seekest her as silver, and searchest for her as hid treasures.",
    storyTime: "Imagine you're a treasure hunter with a metal detector. You're searching for hidden gems and gold coins! That's what the Gems Room is like. A 'gem' is a super cool connection between Bible verses that makes you go, 'WHOA! I never saw that before!' Let's find one together: Did you know Jesus fed 5,000 people and had 12 baskets of leftovers? Why 12? Because there are 12 tribes of Israel! Then later, Jesus fed 4,000 people and had 7 baskets left. Why 7? Because 7 represents all the nations of the world! THAT'S A GEM! Or how about this: David picked up 5 stones to fight Goliath. Why 5 when he only used 1? Because Goliath had 4 brothers (2 Samuel 21:22)! David was ready for ALL of them! When you find connections like this, you've found a gem! Write it down, store it in your Gems Room, and use it later when teaching others!",
    funActivity: "Gem hunting journal: Get a small notebook and label it 'MY GEM COLLECTION.' Every time you discover a cool Bible connection, write it down! Draw a little gem (💎) next to it. Try to find 1 gem per week. By the end of the year, you'll have 52 gems!",
    memoryGame: "Gem quiz: Parent reads a verse, kid finds a connected verse! Example: Parent says 'Jesus is the Lamb,' kid responds 'John 1:29 and Exodus 12—Passover lamb!'",
    reflection: "What's the coolest Bible fact you've ever learned?",
    prayer: "Dear God, Your Word is full of hidden treasure! Give me eyes to see connections I've never noticed before. Help me become a treasure hunter of Your truth! Amen.",
    parentTip: "When your child discovers a 'gem' (even a small connection), celebrate it! This builds excitement for Scripture study."
  },
  {
    day: 7,
    week: 1,
    title: "Observation Room: Bible Detective Training!",
    floor: "Floor 2: Investigation",
    room: "Observation Room (OR)",
    ageGroup: 'ages-9-12',
    kidFriendlyFocus: "Noticing tiny details in Bible stories like a detective",
    scripture: "Proverbs 25:2",
    scriptureText: "It is the glory of God to conceal a thing: but the honour of kings is to search out a matter.",
    storyTime: "Welcome to Floor 2! Now you're not just collecting stories—you're becoming a BIBLE DETECTIVE! Detectives notice EVERYTHING. They look at tiny clues others miss. Let's practice on the story of Jesus calming the storm (Mark 4): CLUE #1: 'There were also with him OTHER little ships' (v.36) - Wait, there were other boats? The disciples weren't alone! Did those boats also calm down? CLUE #2: 'He was in the hinder part of the ship, ASLEEP on a pillow' (v.38) - Jesus was so peaceful He was napping through a deadly storm! Why? CLUE #3: 'They AWAKE him' - They had to wake Him up! He wasn't worried at all. CLUE #4: 'He REBUKED the wind' - He didn't pray to God, He COMMANDED the storm like a master commands a dog! CLUE #5: 'What manner of man is this, that even the wind and the sea OBEY him?' - The disciples realized: Only GOD can control nature! See how noticing little details unlocks the story? That's detective work!",
    funActivity: "Detective notebook: Read Luke 15:11-32 (prodigal son). Write down 10 tiny details you notice: What did the son ask for? How far did he travel? What job did he get? What did he eat? When did the father see him? Did the son finish his apology speech? What did the father put on him? This trains your detective eye!",
    memoryGame: "Detail quiz: Parent reads a familiar Bible story but changes ONE detail. Kid has to catch the mistake! Example: 'David picked up 7 stones...' Kid yells, 'WRONG! It was 5 stones!'",
    reflection: "What small detail in a Bible story did you never notice before?",
    prayer: "Dear God, You hide amazing truths in the Bible for us to discover! Make me a good detective. Help me notice details others miss. Give me eyes that really SEE! Amen.",
    parentTip: "Read a story together and compete: Who can find the most interesting details? This makes Bible study a fun game!"
  },
  {
    day: 8,
    week: 2,
    title: "Symbols Room: Cracking the Bible Code!",
    floor: "Floor 2: Investigation",
    room: "Symbols/Types Room (ST)",
    ageGroup: 'ages-9-12',
    kidFriendlyFocus: "Learning what symbols in the Bible mean",
    scripture: "John 1:29",
    scriptureText: "Behold the Lamb of God!",
    storyTime: "The Bible is full of secret codes! Not to hide truth, but to help us remember it. These codes are called SYMBOLS. Once you learn them, the Bible unlocks! Here are the main ones: LAMB = Jesus (He's the sacrifice). LION = Jesus (He's the king). ROCK = Jesus (He's our foundation). WATER = Holy Spirit or God's Word. LIGHT = Truth or Jesus. BREAD = Jesus ('Bread of Life') or God's Word. SERPENT = Satan. DRAGON = Satan. WOMAN = God's church (pure woman) or false church (impure woman). BEASTS = Kingdoms or evil powers. See the pattern? The Bible uses the same symbols over and over! When Revelation says 'the Lamb,' you instantly know: That's JESUS! When Daniel sees beasts, you know: Those are kingdoms! Learning symbols is like getting the decoder ring for the whole Bible!",
    funActivity: "Symbol flashcards: Make flashcards with a symbol on one side (draw a lamb, a lion, a rock, water, light, bread, a snake) and the meaning on the other side ('Lamb = Jesus the sacrifice,' 'Lion = Jesus the King,' etc.). Quiz yourself every day this week!",
    memoryGame: "Symbol speed match: Parent shows a drawn symbol or says a word (lamb, water, rock). Kid races to shout the meaning before 5 seconds runs out!",
    reflection: "When you read 'the Lamb' in Revelation, do you remember it's Jesus?",
    prayer: "Dear Jesus, thank You for teaching with pictures and symbols! Help me remember that You're the Lamb, the Lion, the Rock, the Bread, and the Light. Make the Bible clearer every day! Amen.",
    parentTip: "Create a 'Symbol Wall' poster your child can reference. Add new symbols as they learn them throughout the course."
  },
  {
    day: 9,
    week: 2,
    title: "Concentration Room: EVERYTHING Points to Jesus!",
    floor: "Floor 4: Next Level",
    room: "Concentration Room (CR)",
    ageGroup: 'ages-13-15',
    kidFriendlyFocus: "Finding Jesus in every part of the Bible—even the Old Testament!",
    scripture: "Luke 24:27",
    scriptureText: "And beginning at Moses and all the prophets, he expounded unto them in all the scriptures the things concerning himself.",
    storyTime: "After Jesus rose from the dead, He met two disciples walking on the road. They were sad because they thought Jesus was gone forever. Jesus (they didn't recognize Him yet) said, 'What's wrong?' They explained how their Messiah had been crucified. Jesus said, 'O foolish ones! Don't you understand the Scriptures?' Then Jesus did something AMAZING—He taught them a Bible study! Starting from Genesis, He showed them JESUS in every book: 'See? The snake crusher in Genesis 3:15? That's Me. The ram caught in the thicket for Isaac? That's Me. The Passover lamb? That's Me. The brass serpent Moses lifted up? That's Me. The kinsman-redeemer in Ruth? Me. The suffering servant in Isaiah 53? Me. King David? A picture of Me. The sanctuary lamb? ME!' By the time they reached their house, the disciples' hearts were ON FIRE! They said, 'Did not our heart BURN within us while He talked with us and opened the Scriptures?!' The Concentration Room teaches you to do what Jesus did: Find JESUS in EVERY chapter of the Bible!",
    funActivity: "Christ-hunt challenge: Open your Bible randomly to any Old Testament chapter. Your mission: find Jesus in it! Ask: Is there a sacrifice (Jesus)? A deliverer (Jesus)? A king (Jesus)? A priest (Jesus)? Suffering (Jesus)? A promise (Jesus)? Write down what you find. Try to do this once a day for a week!",
    memoryGame: "Jesus-in-Genesis speed round: How fast can you name Jesus in these Genesis stories? (1) Creation = Jesus is Creator (John 1:3). (2) Coats of skin = Jesus' covering. (3) Flood/ark = Jesus our salvation. (4) Abraham's ram = Jesus the substitute. GO!",
    reflection: "Why is it important to see Jesus in the Old Testament, not just the New Testament?",
    prayer: "Dear Jesus, the WHOLE Bible is about You! Open my eyes like You opened the disciples' eyes on the road. Help me see You in every story, every prophecy, every chapter. Make my heart burn with excitement when I study! Amen.",
    parentTip: "Model this for your child: When reading OT stories together, always ask, 'Where's Jesus in this?' Train the reflex early."
  },
  {
    day: 10,
    week: 2,
    title: "Dimensions Room: Seeing in 5D!",
    floor: "Floor 4: Next Level",
    room: "Dimensions Room (DR)",
    ageGroup: 'ages-13-15',
    kidFriendlyFocus: "Reading Bible verses on 5 different levels",
    scripture: "2 Timothy 3:16",
    scriptureText: "All scripture is given by inspiration of God, and is profitable.",
    storyTime: "What if every Bible verse had FIVE LAYERS, like a five-layer cake? Most people only read the first layer (what it says) and stop. But the Dimensions Room trains you to read DEEPER! Here are the 5 Dimensions: 1D (LITERAL): What does it literally say? (Basic reading). 2D (CHRIST): How does this point to Jesus personally? 3D (ME): How does this apply to my life? 4D (CHURCH): How does this apply to God's people as a group? 5D (HEAVEN): What does this reveal about the final conflict or eternity? Let's practice on John 3:16 - '1D: God loved the world and gave His Son. 2D: Jesus is that Son who came to save me personally. 3D: I must BELIEVE in Him—my choice! 4D: God's plan is for the whole WORLD to hear this gospel. 5D: Whoever believes has ETERNAL LIFE—heaven is the final goal!' See? One verse, five layers!",
    funActivity: "5D verse deep-dive: Pick any verse. Write it at the top of a paper. Draw 5 sections labeled 1D through 5D. Write what that verse means at each level. Try it with Psalm 23:1 ('The Lord is my shepherd'), Philippians 4:13 ('I can do all things through Christ'), or Matthew 5:14 ('You are the light of the world')!",
    memoryGame: "Dimension speed drill: Parent reads a verse. Kid has 30 seconds to shout out as many dimensions as they can think of!",
    reflection: "Why does the Bible have so many layers instead of just one?",
    prayer: "Dear God, Your Word is deeper than the ocean! Help me not just read the surface—teach me to dive into all 5 dimensions. Show me Jesus, show me how to live, and show me heaven! Amen.",
    parentTip: "This is an advanced skill. Work on one verse per week as a family, gradually building the 5D habit."
  },
];

export default phototheologyCourseKids;
