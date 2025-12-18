import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useAuth } from "@/hooks/useAuth";
import { 
  GraduationCap, BookOpen, ChevronRight, Check, 
  Sparkles, RefreshCw, HelpCircle, Lightbulb, Eye,
  Book, Gem, Film, Image, Brain, MessageCircle, Trophy,
  ChevronDown, ChevronUp, Star, Flame, Layers, Target
} from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "sonner";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface TruthSeriesProps {
  churchId?: string;
}

// Palace Principles with explanations
const PALACE_PRINCIPLES = {
  SR: { 
    name: "Story Room", 
    tag: "SR", 
    icon: Book,
    description: "Breaking biblical events into memorable sequence beats—like film frames that capture the essential plot movements."
  },
  IR: { 
    name: "Imagination Room", 
    tag: "IR", 
    icon: Eye,
    description: "Stepping inside the story with all five senses to create emotional memory that transforms information into experience."
  },
  "24FPS": { 
    name: "24FPS Room", 
    tag: "24", 
    icon: Film,
    description: "Creating one memorable visual image per chapter for instant recall—like a mental GPS for the Bible."
  },
  TR: { 
    name: "Translation Room", 
    tag: "TR", 
    icon: Image,
    description: "Converting abstract words into concrete pictures. Verses become icons, passages become comics, books become murals."
  },
  GR: { 
    name: "Gems Room", 
    tag: "GR", 
    icon: Gem,
    description: "Mining Scripture by combining 2-4 unrelated texts until they illuminate each other with stunning clarity."
  },
  CR: { 
    name: "Concentration Room", 
    tag: "CR", 
    icon: Target,
    description: "The Christ-centered lens: every text must pass through this room. Where is Jesus? How does this point to Him?"
  },
  DR: { 
    name: "Dimensions Room", 
    tag: "DR", 
    icon: Layers,
    description: "Stretching each passage across five dimensions: Literal, Christ, Me, Church, and Heaven."
  },
  PRm: { 
    name: "Patterns Room", 
    tag: "PRm", 
    icon: Brain,
    description: "Recognizing God's fingerprints across Scripture—recurring motifs like 40 days, 3 days, deliverer stories."
  },
  BL: { 
    name: "Blue Room (Sanctuary)", 
    tag: "BL", 
    icon: Flame,
    description: "The architectural blueprint of salvation: altar, laver, lampstand, showbread, incense, ark—all pointing to Christ."
  }
};

interface Question {
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

interface PrincipleApplication {
  principle: keyof typeof PALACE_PRINCIPLES;
  application: string;
  exercise: string;
}

interface StudyContent {
  id: number;
  title: string;
  summary: string;
  openingStory: string;
  mainTeaching: string;
  keyPassages: string[];
  memoryVerse: string;
  questions: Question[];
  principleApplications: PrincipleApplication[];
  reflection: string;
  takeHomeChallenge: string;
}

// Enhanced Truth Series content with interactive elements and Palace principles
const TRUTH_SERIES_CONTENT: StudyContent[] = [
  {
    id: 1,
    title: "The Holy Scriptures",
    summary: "God's written Word as the infallible revelation of His will",
    openingStory: `Picture a desert road from Jerusalem to Gaza. A chariot rattles along, bearing an Ethiopian treasurer reading aloud from Isaiah 53. His voice carries confusion: "Like a sheep led to slaughter... who is He speaking about?"

Then Philip appears—sent by the Spirit—and beginning from that very Scripture, "preached unto him Jesus" (Acts 8:35).

This scene captures the heartbeat of Scripture: **it all points to Christ.**`,
    mainTeaching: `### The Word Made Flesh

The Bible isn't merely a book—it's a sanctuary of truth. Just as the ancient tabernacle had an outer court leading to the holy place and finally the Most Holy Place where God's presence dwelt, so Scripture draws us progressively deeper into God's heart.

**Consider the pattern:**
- Genesis opens with God speaking creation into existence
- John opens with "In the beginning was the Word"
- Revelation closes with Christ as "the Word of God"

From first page to last, we meet the same Person.

### Scripture in Your Hands

When Moses descended Sinai with the tablets, he carried God's own handwriting. When you open your Bible, you hold that same authority—not stone tablets, but living words that "are spirit, and they are life" (John 6:63).`,
    keyPassages: [
      "2 Timothy 3:16-17 — All Scripture is given by inspiration of God",
      "2 Peter 1:21 — Holy men of God spake as they were moved by the Holy Ghost",
      "Psalm 119:105 — Thy word is a lamp unto my feet"
    ],
    memoryVerse: "Thy word is a lamp unto my feet, and a light unto my path. — Psalm 119:105",
    questions: [
      {
        question: "In Acts 8, what did Philip preach to the Ethiopian from Isaiah 53?",
        options: ["The law of Moses", "Jesus", "The prophets", "The kingdom of Israel"],
        correctIndex: 1,
        explanation: "Philip 'preached unto him Jesus' (Acts 8:35). Every Scripture ultimately points to Christ—He is the interpretive key to all of God's Word."
      },
      {
        question: "What does it mean that Scripture is 'God-breathed' (theopneustos)?",
        options: [
          "God literally breathed on the scrolls",
          "Human writers were in a trance",
          "The Holy Spirit guided the writers while respecting their personalities",
          "Only the original manuscripts were inspired"
        ],
        correctIndex: 2,
        explanation: "Divine inspiration means God guided the writers through the Holy Spirit while allowing their unique personalities and styles to shine through—a beautiful partnership between heaven and earth."
      },
      {
        question: "The sanctuary had three compartments. How does this parallel Scripture study?",
        options: [
          "Three steps: read, memorize, teach",
          "Three levels: surface meaning, deeper meaning, deepest meaning",
          "Three books: Law, Prophets, Writings",
          "Progressive revelation drawing us deeper into God's heart"
        ],
        correctIndex: 3,
        explanation: "Like the sanctuary's outer court → holy place → Most Holy Place, Scripture draws us progressively deeper into intimate knowledge of God. Each level brings us closer to His presence."
      }
    ],
    principleApplications: [
      {
        principle: "SR",
        application: "The Ethiopian's conversion follows a clear story arc: Reading → Confusion → Philip Appears → Explanation → Belief → Baptism. These 'beats' help us remember and retell the story.",
        exercise: "Write out the 6 beats of the Ethiopian's story. Can you tell this story to someone using only these beats?"
      },
      {
        principle: "IR",
        application: "Imagine yourself in the chariot with the Ethiopian. Feel the desert heat, hear the scroll rustling, sense his frustration turning to joy as Philip explains Isaiah.",
        exercise: "Close your eyes and enter the scene. What do you see, hear, and feel when understanding dawns?"
      },
      {
        principle: "TR",
        application: "Psalm 119:105 gives us a ready-made image: a glowing lamp illuminating a dark path. This visual captures how Scripture guides us.",
        exercise: "Sketch a simple image of a lamp illuminating a path. How does this picture help you remember the verse?"
      },
      {
        principle: "CR",
        application: "The Concentration Room insists: where is Christ? In Acts 8, He is the suffering servant of Isaiah 53, the Lamb led to slaughter.",
        exercise: "Read Isaiah 53. List 5 ways this chapter points to Jesus."
      },
      {
        principle: "GR",
        application: "Gem discovered: Genesis 1:3 (God speaks light into existence) + John 1:1-4 (Word as life and light) + 2 Cor 4:6 (light shining in hearts) = The same Word that created physical light creates spiritual illumination in our souls.",
        exercise: "What rare truth emerges when you combine these three passages?"
      },
      {
        principle: "BL",
        application: "In the sanctuary, the lampstand burned continuously—representing God's Word and Spirit giving light. Without oil (Spirit), there's no light (truth).",
        exercise: "How does the lampstand represent Scripture's role in the believer's life?"
      }
    ],
    reflection: "The Ethiopian was reading Scripture but couldn't understand it until Philip helped. Who has God placed in your life to help you understand the Bible? How might you be that 'Philip' for someone else?",
    takeHomeChallenge: "This week, before each Bible reading, pray: 'Lord, show me Jesus in this passage.' Keep a journal of what you discover."
  },
  {
    id: 2,
    title: "The Trinity",
    summary: "One God: Father, Son, and Holy Spirit—three co-eternal Persons",
    openingStory: `The heavens tear open. A dove descends like a shaft of light. A voice thunders from above: "This is my beloved Son."

Picture it—Father speaks, Spirit descends, Son rises from the water. Three distinct Persons, one divine purpose, one moment of revelation (Matthew 3:16-17).

Here, at the inauguration of Jesus' ministry, the Godhead steps onto the stage together.`,
    mainTeaching: `### Unity in Creation and Redemption

From the first verses of Scripture, plurality appears within unity: "Let *Us* make man in *Our* image" (Genesis 1:26). This wasn't God speaking to angels—angels didn't create. This was the divine council, the three-in-one deliberating the greatest work of love.

**The Pattern Across Scripture:**
- Creation: Father speaks, Spirit hovers, Son (the Word) executes
- Incarnation: Father sends, Son comes, Spirit conceives
- Redemption: Father plans, Son accomplishes, Spirit applies
- Sanctification: Father destines, Son cleanses, Spirit transforms

### The Sanctuary Blueprint

In the sanctuary, we see three compartments: outer court, holy place, Most Holy Place. Each reveals a different aspect of God's saving work—yet all are *one* sanctuary, pointing to *one* salvation through *one* God who exists as three.

This is not a contradiction—it's a mystery that reveals love has always existed *within* God. Father, Son, and Spirit have loved each other from eternity.`,
    keyPassages: [
      "Matthew 28:19 — Baptizing in the name of Father, Son, Holy Ghost",
      "2 Corinthians 13:14 — Grace, love, and communion of the Godhead",
      "John 14:16-17 — Jesus promises another Comforter"
    ],
    memoryVerse: "Go ye therefore, and teach all nations, baptizing them in the name of the Father, and of the Son, and of the Holy Ghost. — Matthew 28:19",
    questions: [
      {
        question: "At Jesus' baptism, how were all three Persons of the Godhead present?",
        options: [
          "Jesus was there three times in different forms",
          "Father spoke, Spirit descended, Son was baptized",
          "Only Jesus was present; the others were symbolic",
          "The disciples represented the other two"
        ],
        correctIndex: 1,
        explanation: "This is one of the clearest revelations of the Trinity: the Father's voice from heaven, the Spirit descending as a dove, and the Son standing in the Jordan—three distinct Persons, one God."
      },
      {
        question: "Why is it significant that love has always existed within God?",
        options: [
          "It proves God is powerful",
          "It shows God didn't need creation to experience love",
          "It makes God more understandable",
          "It fulfills a prophecy"
        ],
        correctIndex: 1,
        explanation: "The Trinity reveals that love is not something God 'discovered' through creation—it has eternally flowed between Father, Son, and Spirit. God IS love (1 John 4:8)."
      },
      {
        question: "In Genesis 1:26, 'Let Us make man in Our image,' who is 'Us'?",
        options: [
          "God and the angels",
          "God using the royal 'we'",
          "Father, Son, and Holy Spirit",
          "God speaking to future humans"
        ],
        correctIndex: 2,
        explanation: "Angels don't create—only God does. The 'Us' reveals the plurality within the Godhead working together in creation, the same Persons who work together in redemption."
      }
    ],
    principleApplications: [
      {
        principle: "SR",
        application: "Jesus' baptism has clear story beats: John Baptizing → Jesus Arrives → Baptism → Heavens Open → Spirit Descends → Father Speaks. Each beat reveals the Trinity.",
        exercise: "Tell the baptism story in 6 beats, emphasizing how each Person appears."
      },
      {
        principle: "IR",
        application: "Stand at the Jordan's edge. Feel the cool water, hear the crowd's murmur turn to gasps as heaven opens. Watch the dove descend. Hear the Father's voice echo across the valley.",
        exercise: "What emotions arise when you witness all three Persons of God acting simultaneously for your salvation?"
      },
      {
        principle: "PRm",
        application: "The Pattern: Father plans, Son accomplishes, Spirit applies—this pattern repeats in creation, incarnation, redemption, and sanctification.",
        exercise: "Trace this pattern through each of these four events. How does recognizing it deepen your understanding?"
      },
      {
        principle: "DR",
        application: "Dimensions of Matthew 28:19: Literal (baptize with these words), Christ (Jesus commissions), Me (I am baptized into the Name), Church (this is our mission), Heaven (we enter the divine family).",
        exercise: "Work through the five dimensions for this verse. What new insight emerges?"
      },
      {
        principle: "BL",
        application: "The sanctuary's three compartments (outer court, holy place, Most Holy Place) reveal three aspects of salvation—yet it's ONE sanctuary. So the Trinity is THREE Persons, yet ONE God.",
        exercise: "How does the sanctuary's structure help you understand 'three in one'?"
      },
      {
        principle: "GR",
        application: "Gem: John 1:1 (Word with God) + Hebrews 1:3 (Son is exact image) + John 16:13 (Spirit glorifies Son) = Each Person of the Trinity points to and glorifies the others.",
        exercise: "How does this 'other-centered' nature of the Trinity challenge our self-centered culture?"
      }
    ],
    reflection: "The Trinity demonstrates that relationship and love are at the core of reality. What does it mean for your daily life that the God who saves you has eternally existed in loving relationship?",
    takeHomeChallenge: "This week, address one prayer specifically to each Person of the Godhead. Notice how this shapes your understanding of God."
  },
  {
    id: 3,
    title: "The Father",
    summary: "God the eternal Father is the Creator and Source of all things",
    openingStory: `A young man demands his inheritance—essentially wishing his father dead. He squanders everything. He feeds pigs. He comes home rehearsing a servant's speech.

But the father has been watching. Running (undignified for a patriarch!), falling on his neck, kissing him—before the boy can finish his prepared confession, the father is calling for the best robe, the ring, the feast (Luke 15:11-32).

**This is Jesus showing us His Father's heart.**`,
    mainTeaching: `### Source of All Good

"Every good gift and every perfect gift is from above, and cometh down from the Father of lights" (James 1:17). The Father is not a distant deity demanding sacrifice—He is the generous Source from whom all blessing flows.

**Consider:**
- He gave His Son (John 3:16)
- He gives wisdom to those who ask (James 1:5)
- He gives the Holy Spirit to those who seek (Luke 11:13)

### The Father in the Sanctuary

The whole sanctuary system was designed by the Father to bring rebellious children home. The sacrifices didn't appease an angry God—they revealed a loving Father's costly solution to sin.

The mercy seat in the Most Holy Place bore the very name of His character: **mercy**.

**Pattern:** Just as Israel's priests carried the names of the twelve tribes on their breastplate, bearing them into God's presence, so the Father knows you by name and holds you on His heart.`,
    keyPassages: [
      "Psalm 103:13 — Like as a father pitieth his children",
      "Isaiah 64:8 — But now, O LORD, thou art our father; we are the clay",
      "Matthew 6:9 — Our Father which art in heaven"
    ],
    memoryVerse: "Like as a father pitieth his children, so the LORD pitieth them that fear him. — Psalm 103:13",
    questions: [
      {
        question: "In the Prodigal Son parable, why did the father run to meet his son?",
        options: [
          "To lecture him about his mistakes",
          "To prevent the villagers from shaming him first",
          "Because running was customary",
          "To check if he had money left"
        ],
        correctIndex: 1,
        explanation: "Running was undignified for an ancient patriarch. The father ran to reach his son before the village could shame him—absorbing the disgrace himself. This reveals God's proactive, shame-bearing love."
      },
      {
        question: "What does calling God 'Father' imply about our relationship to Him?",
        options: [
          "He is distant and authoritative",
          "We are servants in His house",
          "We are adopted children with full inheritance rights",
          "We must earn His approval"
        ],
        correctIndex: 2,
        explanation: "Jesus taught us to pray 'Our Father'—inviting us into family intimacy. As children, we receive inheritance, not wages. We're loved, not merely employed."
      },
      {
        question: "How does the sanctuary reveal the Father's heart?",
        options: [
          "It shows He demands perfect obedience",
          "It reveals His costly solution to bring rebellious children home",
          "It demonstrates His power over enemies",
          "It proves His existence"
        ],
        correctIndex: 1,
        explanation: "The sanctuary wasn't designed to keep us out—it was designed to bring us in! Every element pointed to the Father's plan to restore fellowship with His children through sacrifice and mediation."
      }
    ],
    principleApplications: [
      {
        principle: "SR",
        application: "The Prodigal Son story has powerful beats: Demand → Departure → Degradation → Decision → Return → Restoration. The father appears at the climax, transforming tragedy into celebration.",
        exercise: "Write out these 6 beats. Notice where the father appears—what does his timing reveal?"
      },
      {
        principle: "IR",
        application: "Be the father watching the road daily. Feel the ache of waiting. Then see a familiar figure on the horizon. Your heart leaps. You hike up your robe and run...",
        exercise: "Spend 5 minutes in the father's sandals. What do you feel when you see your lost child returning?"
      },
      {
        principle: "CR",
        application: "The Concentration Room asks: Where is Christ? Jesus IS the Father's robe covering our shame, the ring of authority restored, the feast of celebration.",
        exercise: "How does Jesus embody each gift the father gives the prodigal?"
      },
      {
        principle: "GR",
        application: "Gem: Psalm 103:13 (Father pities) + Luke 15:20 (Father runs) + Romans 8:15 (Abba, Father) = The Father's pity is not passive—it runs toward us, adopting us as beloved children.",
        exercise: "What new understanding of God emerges when you combine these verses?"
      },
      {
        principle: "BL",
        application: "The mercy seat (kapporeth) sat atop the ark in the Most Holy Place. Its name literally means 'place of covering/atonement.' Here the Father met His people in mercy.",
        exercise: "How does the mercy seat reveal the Father's character?"
      },
      {
        principle: "TR",
        application: "Image: A father hiking up his robe to run—dignity abandoned for love. This single image captures the Father's heart better than a thousand theological words.",
        exercise: "Sketch or describe this image. What does the running father reveal about God?"
      }
    ],
    reflection: "The prodigal's father was watching the road. He saw his son 'a great way off.' How does knowing God actively watches for you change how you approach Him when you've failed?",
    takeHomeChallenge: "Write a letter to God beginning 'Dear Father...' Express what you've learned about His heart this week."
  },
  {
    id: 4,
    title: "The Son",
    summary: "God the eternal Son became incarnate in Jesus Christ",
    openingStory: `A ruler of the Pharisees comes by night. He's curious, cautious, perhaps afraid of what his colleagues might think. Jesus doesn't waste time: "Ye must be born again."

Nicodemus stammers. Then Jesus unveils the cosmos: "As Moses lifted up the serpent in the wilderness, even so must the Son of man be lifted up" (John 3:14).

Jesus always points back to Scripture and forward to the cross—because both reveal who He is.`,
    mainTeaching: `### From Throne to Manger to Cross

Follow the descent:
- *Before time*: Equal with God (Philippians 2:6)
- *Bethlehem*: Born in a stable, laid in a feeding trough
- *Ministry*: "Foxes have holes... the Son of man hath not where to lay his head"
- *Calvary*: "Made himself of no reputation... obedient unto death, even the death of the cross" (Philippians 2:7-8)

This is the eternal Son—trading heaven's praise for a borrowed tomb.

### Christ in Every Story

The Son didn't begin at Bethlehem. He walked with Adam in Eden. He called Abraham His friend. He was the Angel wrestling Jacob, the Captain appearing to Joshua, the fourth Man in Nebuchadnezzar's furnace.

**The Golden Thread:**
- Genesis 3:15 — The Seed promised
- Exodus 12 — The Lamb slain
- Isaiah 53 — The Suffering Servant described
- Matthew 1 — The Son born
- Revelation 5 — The Lamb enthroned

Every story finds its center in Him.`,
    keyPassages: [
      "John 1:14 — The Word was made flesh, and dwelt among us",
      "Hebrews 1:3 — The brightness of his glory, express image of his person",
      "Colossians 1:15-17 — By him all things consist"
    ],
    memoryVerse: "And the Word was made flesh, and dwelt among us, (and we beheld his glory, the glory as of the only begotten of the Father,) full of grace and truth. — John 1:14",
    questions: [
      {
        question: "What did Jesus compare Himself to when talking with Nicodemus?",
        options: [
          "A shepherd and his sheep",
          "The brazen serpent Moses lifted up",
          "Jonah in the whale",
          "David facing Goliath"
        ],
        correctIndex: 1,
        explanation: "Jesus connected Himself to Numbers 21—the bronze serpent lifted on a pole that healed all who looked. 'Even so must the Son of man be lifted up' on the cross, bringing healing to all who look in faith."
      },
      {
        question: "Why did the eternal Son 'make himself of no reputation'?",
        options: [
          "He lost His divine nature",
          "He was forced by the Father",
          "He voluntarily laid aside His privileges to save us",
          "His reputation was always low"
        ],
        correctIndex: 2,
        explanation: "Philippians 2:7 describes voluntary self-emptying (kenosis)—not losing divinity, but laying aside divine privileges. The Son who could command angels chose to serve, suffer, and die."
      },
      {
        question: "Where in the Old Testament do we see Christ before Bethlehem?",
        options: [
          "Only in prophecies, not actual appearances",
          "He appeared as the Angel of the LORD, the fourth Man in the furnace, etc.",
          "He wasn't active before His birth",
          "Only in Genesis"
        ],
        correctIndex: 1,
        explanation: "Christ actively appeared throughout the Old Testament—wrestling Jacob, appearing to Joshua, walking in the furnace with the three Hebrews. He has always been pursuing His people."
      }
    ],
    principleApplications: [
      {
        principle: "SR",
        application: "The Son's descent has beats: Throne → Womb → Manger → Ministry → Cross → Tomb → Resurrection → Throne. The U-shaped story of kenosis and exaltation.",
        exercise: "Trace these beats. How does the 'descent-ascent' pattern shape your view of Jesus?"
      },
      {
        principle: "IR",
        application: "Be in Bethlehem's stable. Smell the animals. Watch Mary lay the Creator of the universe in a feeding trough. The hands that flung stars now grip a mother's finger.",
        exercise: "What does it feel like to witness infinite power choosing infinite vulnerability?"
      },
      {
        principle: "PRm",
        application: "Pattern: Genesis 3:15 (Seed promised) → Exodus 12 (Lamb slain) → Isaiah 53 (Servant described) → Matthew 1 (Son born) → Revelation 5 (Lamb enthroned). One thread through all Scripture.",
        exercise: "Add 3 more links to this 'golden thread' of Christ through Scripture."
      },
      {
        principle: "CR",
        application: "The Concentration Room is central to this study: EVERY Old Testament story points to Christ. He is the pattern, the fulfillment, the key.",
        exercise: "Choose any OT story and ask: 'Where is Jesus here?' Write your discovery."
      },
      {
        principle: "GR",
        application: "Gem: John 3:14 (serpent lifted) + Numbers 21:9 (look and live) + Isaiah 45:22 (look unto me and be saved) = Salvation comes by looking—not working, earning, or achieving. Just looking at the Lifted One.",
        exercise: "How does 'looking' differ from other religious activities? What does this reveal about grace?"
      },
      {
        principle: "DR",
        application: "Philippians 2:5-8 in five dimensions: Literal (Christ emptied Himself), Christ (He is the pattern), Me (I am called to the same mind), Church (we serve together), Heaven (every knee will bow).",
        exercise: "Work through all five dimensions. Which one challenges you most?"
      }
    ],
    reflection: "Jesus could have rescued humanity from heaven's throne. Instead, He chose to empty Himself, becoming one of us. What does this voluntary descent tell you about His love for you personally?",
    takeHomeChallenge: "Choose one Old Testament story this week. Ask: 'Where is Jesus here?' Write down your discovery and share it with someone."
  },
  {
    id: 5,
    title: "The Holy Spirit",
    summary: "God the eternal Spirit was active in creation, incarnation, and redemption",
    openingStory: `One hundred twenty believers huddle in an upper room. Ten days of prayer. Suddenly—the sound of a rushing mighty wind fills the house. Tongues of fire rest on each head.

They spill into Jerusalem's streets speaking languages they never learned, and three thousand souls are born into the kingdom before sunset (Acts 2).

**The Spirit had come to do what only He can do: make Christ real.**`,
    mainTeaching: `### The Spirit's Work Through History

From the very beginning, the Spirit was moving:
- *Creation*: "The Spirit of God moved upon the face of the waters" (Genesis 1:2)
- *Incarnation*: "The Holy Ghost shall come upon thee" (Luke 1:35)
- *Ministry*: Jesus was led by the Spirit, anointed by the Spirit, performed miracles by the Spirit
- *Pentecost*: The Spirit fell to continue Christ's mission through His body

### The Sanctuary Connection

In the sanctuary, the lampstand burned continuously—supplied with oil by the priests. Zechariah saw this vision and heard: "Not by might, nor by power, but by my spirit, saith the LORD" (Zechariah 4:6).

Oil represents the Spirit. The light represents Christ's presence. **Without the Spirit's oil, the church has no light.**

**The Pattern:** Just as the high priest's incense rose before God's throne, the Spirit takes our inarticulate prayers and presents them to the Father (Romans 8:26-27).`,
    keyPassages: [
      "John 16:13-14 — He will guide you into all truth... He shall glorify me",
      "Romans 8:11 — The Spirit that raised Jesus shall quicken your mortal bodies",
      "Galatians 5:22-23 — The fruit of the Spirit"
    ],
    memoryVerse: "But ye shall receive power, after that the Holy Ghost is come upon you: and ye shall be witnesses unto me. — Acts 1:8",
    questions: [
      {
        question: "What is the Holy Spirit's primary purpose according to John 16:14?",
        options: [
          "To give believers special powers",
          "To glorify Jesus",
          "To replace Jesus' presence",
          "To judge the world"
        ],
        correctIndex: 1,
        explanation: "Jesus said, 'He shall glorify me.' The Spirit doesn't draw attention to Himself—He illuminates Christ. When the Spirit is truly at work, Jesus becomes clearer and more beautiful."
      },
      {
        question: "In the sanctuary, what did the lampstand's oil represent?",
        options: [
          "Human effort",
          "The Holy Spirit",
          "The written Word",
          "Angels' ministry"
        ],
        correctIndex: 1,
        explanation: "Oil consistently represents the Spirit in Scripture. Without oil, the lamps couldn't burn. Without the Spirit, the church has no light to share with the world."
      },
      {
        question: "According to Romans 8:26, what does the Spirit do with our prayers?",
        options: [
          "Ignores our weak prayers",
          "Intercedes for us with groanings we can't express",
          "Translates our prayers into Hebrew",
          "Tells us exactly what to pray"
        ],
        correctIndex: 1,
        explanation: "When we don't know how to pray, the Spirit intercedes for us with 'groanings which cannot be uttered.' He translates our inarticulate needs into perfect requests before the Father."
      }
    ],
    principleApplications: [
      {
        principle: "SR",
        application: "Pentecost story beats: Waiting (10 days) → Wind → Fire → Languages → Crowd → Peter's Sermon → 3000 Baptized. From fear to boldness in one day.",
        exercise: "Retell Pentecost using these 7 beats. Notice the Spirit's transforming power."
      },
      {
        principle: "IR",
        application: "You're in the upper room. Feel the anticipation, the uncertainty. Then—rushing wind, flames appearing, courage flooding your heart. You step outside and words flow in languages you never learned.",
        exercise: "What would it feel like to experience Pentecost firsthand?"
      },
      {
        principle: "BL",
        application: "The lampstand (menorah) in the holy place had seven branches, supplied with pure olive oil. Zechariah 4 shows this—'Not by might, but by my Spirit.' Light = Christ's presence. Oil = Spirit's power.",
        exercise: "Draw the lampstand. Label what each element represents. How does this help you understand the Spirit's role?"
      },
      {
        principle: "GR",
        application: "Gem: Genesis 1:2 (Spirit hovers over chaos) + Luke 1:35 (Spirit overshadows Mary) + Acts 2 (Spirit falls on church) = The same hovering, creative Spirit brings life out of chaos—in creation, incarnation, and church.",
        exercise: "What pattern do you see in how the Spirit works?"
      },
      {
        principle: "PRm",
        application: "Pattern: The Spirit hovers (Gen 1:2), rests (on tabernacle, judges, kings, prophets), and finally indwells (Acts 2 onward). Progressive dwelling—from hovering to indwelling.",
        exercise: "Trace this progression. What does 'indwelling' mean for you today?"
      },
      {
        principle: "CR",
        application: "Where is Christ? The Spirit's mission is to glorify Him (John 16:14). When the Spirit is truly at work, Christ becomes clearer, not the Spirit more prominent.",
        exercise: "How do you know the Spirit is genuinely at work in a church or person?"
      }
    ],
    reflection: "The Spirit waited until Jesus ascended before coming in fullness at Pentecost. Why do you think the timing mattered? What does this say about the relationship between Christ's work and the Spirit's work?",
    takeHomeChallenge: "Each morning this week, begin with a simple prayer: 'Holy Spirit, make Jesus real to me today.' Journal what happens."
  },
  {
    id: 6,
    title: "Creation",
    summary: "God is Creator of all things, including humanity in His image",
    openingStory: `No laboratory. No process. Just the voice of God and the canvas of nothing. "Let there be light"—and photons raced into existence. Waters separated. Land appeared. Trees fruited. Stars ignited. Fish schooled. Birds soared.

And on the sixth day, the Creator stooped to the dust, formed a shape with His own hands, breathed His own breath, and Adam opened his eyes to see the face of God (Genesis 1-2).

**Creation wasn't distant. It was intimate.**`,
    mainTeaching: `### Why Creation Matters

Creation isn't just about origins—it's about identity and purpose.

**If we're created:**
- We belong to Someone
- Life has inherent dignity
- The world has meaning
- There's a design behind our existence

**If we're accidents:**
- We're alone in the cosmos
- Life has no intrinsic value
- Morality becomes preference
- Death is final

The stakes couldn't be higher.

### Creation Points to Christ

The New Testament reveals that the Son was the active agent in creation: "All things were made by him; and without him was not any thing made that was made" (John 1:3).

The hands that shaped Adam were the same hands that would be pierced at Calvary.

**The Pattern:**
- Genesis: "God said... and it was so"
- John: "The Word became flesh"
- 2 Corinthians 4:6: "God, who commanded the light to shine out of darkness, hath shined in our hearts"

The same Word that spoke light into darkness speaks new life into souls.`,
    keyPassages: [
      "Genesis 1:27 — God created man in his own image",
      "Psalm 33:6,9 — By the word of the LORD were the heavens made... He spake, and it was done",
      "Colossians 1:16 — By him were all things created"
    ],
    memoryVerse: "In the beginning God created the heaven and the earth. — Genesis 1:1",
    questions: [
      {
        question: "According to John 1:3, who was the active agent in creation?",
        options: [
          "Angels",
          "Natural processes",
          "The Word (Christ)",
          "The Father alone"
        ],
        correctIndex: 2,
        explanation: "John 1:3 reveals that 'all things were made by him'—the Word, Jesus Christ. The Creator who shaped Adam would later become Adam's descendant to save him."
      },
      {
        question: "What does 'made in God's image' mean for human dignity?",
        options: [
          "We look like God physically",
          "Every human has inherent worth regardless of ability or status",
          "Only some humans are in God's image",
          "It's just a metaphor with no practical meaning"
        ],
        correctIndex: 1,
        explanation: "Being made in God's image means every person—regardless of race, age, ability, or status—has inherent worth. This is why murder is prohibited (Gen 9:6) and why we must love our enemies."
      },
      {
        question: "Why did God rest on the seventh day?",
        options: [
          "He was tired",
          "To model rhythm and relationship for humanity",
          "It was just symbolic",
          "To prepare for the fall"
        ],
        correctIndex: 1,
        explanation: "God didn't need rest—He 'fainteth not' (Isaiah 40:28). The Sabbath rest was a gift, modeling the rhythm of work and worship, and inviting humanity into relationship, not just labor."
      }
    ],
    principleApplications: [
      {
        principle: "SR",
        application: "Creation week has 7 beats: Light → Sky/Waters → Land/Plants → Sun/Moon/Stars → Fish/Birds → Animals/Humans → Rest. A story arc from chaos to cosmos to communion.",
        exercise: "Practice telling the creation story using these 7 beats. What's the climax?"
      },
      {
        principle: "IR",
        application: "Be there at Adam's first breath. Watch God stoop in the dust. Feel the clay shaped. Then the divine breath—and eyes opening to see the Creator's face inches away.",
        exercise: "What would that first moment of consciousness feel like? What would you see?"
      },
      {
        principle: "24FPS",
        application: "Genesis 1 = Birthday Cake Earth (Creation is Earth's birthday). One memorable image that triggers the whole chapter.",
        exercise: "Create your own image for Genesis 1. What visual helps you remember creation?"
      },
      {
        principle: "GR",
        application: "Gem: Genesis 1:3 (light from darkness) + John 1:4-5 (life is the light of men) + 2 Cor 4:6 (light in our hearts) = The same creative Word that commanded physical light commands spiritual illumination in souls.",
        exercise: "How does creation foreshadow salvation? What parallels do you see?"
      },
      {
        principle: "CR",
        application: "Where is Christ in creation? He IS the Creator! 'Without him was not any thing made' (John 1:3). Every sunset, every bird song, every human face reflects His artistry.",
        exercise: "Go outside and find three things. Ask: 'What does this reveal about the Creator?'"
      },
      {
        principle: "DR",
        application: "Genesis 1:1 in five dimensions: Literal (God made everything), Christ (He is the Word/Creator), Me (I am created with purpose), Church (we are new creation), Heaven (new heavens and earth coming).",
        exercise: "Work through all five dimensions. How does creation connect to redemption?"
      }
    ],
    reflection: "God shaped Adam with His hands and breathed into him directly. How does knowing God was personally, intimately involved in your creation change how you view yourself?",
    takeHomeChallenge: "Take a walk this week and look for evidence of design—a spider's web, a sunset, a child's laugh. Thank the Creator for speaking you into existence too."
  }
];

// Add remaining studies (7-28) with similar structure - abbreviated for space
const ADDITIONAL_STUDIES: StudyContent[] = [
  {
    id: 7,
    title: "The Nature of Humanity",
    summary: "Man and woman were made in the image of God as indivisible wholes",
    openingStory: "Imagine God kneeling in Eden's soil. Divine fingers shaping clay. Eye sockets, spine, lungs—but still lifeless. Then God leans close and breathes. That first gasp. Eyes flutter open. Adam's first sight: his Maker's face.",
    mainTeaching: `Scripture presents humanity as a unified whole—not a ghost trapped in a machine:
- "God formed man of the dust" (body)
- "Breathed into his nostrils the breath of life" (spirit/breath)
- "Man became a living soul" (the whole, living person)

Body + Breath = Living Soul. We ARE souls; we don't merely HAVE souls.`,
    keyPassages: ["Genesis 1:27", "Psalm 8:4-5", "Romans 8:29"],
    memoryVerse: "So God created man in his own image, in the image of God created he him; male and female created he them. — Genesis 1:27",
    questions: [
      { question: "What is the biblical understanding of 'soul'?", options: ["An immortal spirit inside us", "The whole living person (body + breath)", "Just our emotions", "Only our mind"], correctIndex: 1, explanation: "Genesis 2:7 shows that 'soul' (nephesh) means the whole living person—body animated by God's breath." }
    ],
    principleApplications: [
      { principle: "IR", application: "Feel the dust in God's hands, the breath entering your lungs, consciousness dawning.", exercise: "What does it feel like to owe every breath to God?" }
    ],
    reflection: "If every person bears God's image, how should this change how you treat those who annoy you?",
    takeHomeChallenge: "When interacting with a difficult person this week, pause and remember: 'They bear God's image.'"
  },
  {
    id: 8,
    title: "The Great Controversy",
    summary: "The conflict between Christ and Satan that affects all humanity",
    openingStory: "Picture heaven's throne room—brilliant, peaceful, worshipful. Then a shadow creeps into Lucifer's heart. 'I will ascend... I will be like the Most High.' War erupts. A third of the angels follow the rebel. The battle moves to a garden called Eden.",
    mainTeaching: `We live in the middle of a cosmic war. Every choice we make aligns us with one side or the other.

In Eden stood two trees representing the choice:
- Tree of Life = trust God's way
- Tree of Knowledge = independence from God

Every temptation echoes Eden's original question: Will you trust God, or go your own way?`,
    keyPassages: ["Isaiah 14:12-14", "Ezekiel 28:12-17", "Revelation 12:7-9"],
    memoryVerse: "And there was war in heaven: Michael and his angels fought against the dragon. — Revelation 12:7",
    questions: [
      { question: "What was Lucifer's original sin?", options: ["Violence", "Lying", "Pride—wanting to be like God", "Stealing"], correctIndex: 2, explanation: "Isaiah 14:14 reveals Lucifer's ambition: 'I will be like the Most High.' Pride was the root." }
    ],
    principleApplications: [
      { principle: "PRm", application: "Pattern: Every conflict in Scripture echoes the great controversy—Cain/Abel, Moses/Pharaoh, David/Goliath, Christ/Satan.", exercise: "Find three more biblical conflicts that reflect this cosmic pattern." }
    ],
    reflection: "Every day you choose sides. What choices have you made today that align with Christ's kingdom?",
    takeHomeChallenge: "Identify one area where you're fighting the wrong battle (against people instead of principles). Reframe it in light of the great controversy."
  }
];

// Combine all studies
const ALL_STUDIES = [...TRUTH_SERIES_CONTENT, ...ADDITIONAL_STUDIES];

export function TruthSeries({ churchId }: TruthSeriesProps) {
  const { user } = useAuth();
  const [selectedTopic, setSelectedTopic] = useState<StudyContent | null>(null);
  const [completedTopics, setCompletedTopics] = useState<number[]>([]);
  const [activeTab, setActiveTab] = useState("content");
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [showResults, setShowResults] = useState(false);
  const [expandedPrinciples, setExpandedPrinciples] = useState<string[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem('truth-series-progress');
    if (saved) setCompletedTopics(JSON.parse(saved));
  }, []);

  const progress = (completedTopics.length / ALL_STUDIES.length) * 100;

  const handleSelectTopic = (topic: StudyContent) => {
    setSelectedTopic(topic);
    setActiveTab("content");
    setAnswers({});
    setShowResults(false);
    setExpandedPrinciples([]);
  };

  const handleMarkComplete = () => {
    if (!selectedTopic) return;
    const newCompleted = [...completedTopics, selectedTopic.id];
    setCompletedTopics(newCompleted);
    localStorage.setItem('truth-series-progress', JSON.stringify(newCompleted));
    toast.success(`Completed: ${selectedTopic.title}!`, { icon: "🎉" });
  };

  const handleAnswerSelect = (questionIndex: number, answerIndex: number) => {
    setAnswers(prev => ({ ...prev, [questionIndex]: answerIndex }));
  };

  const handleCheckAnswers = () => {
    setShowResults(true);
    const correct = selectedTopic?.questions.filter((q, i) => answers[i] === q.correctIndex).length || 0;
    const total = selectedTopic?.questions.length || 0;
    if (correct === total) {
      toast.success("Perfect score! 🌟");
    } else {
      toast.info(`${correct}/${total} correct. Review the explanations below!`);
    }
  };

  const togglePrinciple = (principle: string) => {
    setExpandedPrinciples(prev => 
      prev.includes(principle) ? prev.filter(p => p !== principle) : [...prev, principle]
    );
  };

  const renderContent = (content: string) => {
    return content.split('\n').map((line, i) => {
      if (line.startsWith('### ')) {
        return <h3 key={i} className="text-lg font-semibold mt-4 mb-2 text-foreground">{line.replace('### ', '')}</h3>;
      } else if (line.startsWith('**') && line.endsWith('**')) {
        return <p key={i} className="font-bold text-foreground">{line.replace(/\*\*/g, '')}</p>;
      } else if (line.startsWith('- ')) {
        return <li key={i} className="ml-4 text-foreground/80">{line.replace('- ', '')}</li>;
      } else if (line.startsWith('*') && line.endsWith('*')) {
        return <p key={i} className="italic text-foreground/70">{line.replace(/\*/g, '')}</p>;
      } else if (line.trim() === '') {
        return <br key={i} />;
      } else {
        return <p key={i} className="text-foreground/80 mb-2">{line}</p>;
      }
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2 text-foreground">
            <GraduationCap className="h-6 w-6 text-primary" />
            Truth Series
          </h2>
          <p className="text-foreground/70">
            Interactive studies with Palace principles for deeper understanding
          </p>
        </div>
        <Badge variant="outline" className="text-primary border-primary">
          <Sparkles className="h-3 w-3 mr-1" />
          {ALL_STUDIES.length} Studies
        </Badge>
      </div>

      {/* Progress */}
      <Card variant="glass" className="bg-card/80">
        <CardContent className="py-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-foreground">Journey Progress</span>
            <span className="text-sm text-foreground/70">{completedTopics.length} / {ALL_STUDIES.length}</span>
          </div>
          <Progress value={progress} className="h-2" />
        </CardContent>
      </Card>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Topics List */}
        <Card variant="glass" className="lg:col-span-1 bg-card/80">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-foreground">
              <BookOpen className="h-5 w-5" />
              Study Topics
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[500px] pr-4">
              <div className="space-y-2">
                {ALL_STUDIES.map((topic) => {
                  const isCompleted = completedTopics.includes(topic.id);
                  const isSelected = selectedTopic?.id === topic.id;
                  
                  return (
                    <button
                      key={topic.id}
                      onClick={() => handleSelectTopic(topic)}
                      className={`w-full text-left p-3 rounded-lg transition-all ${
                        isSelected 
                          ? "bg-primary/20 border border-primary/50" 
                          : "bg-background/50 border border-border/50 hover:bg-background/80"
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                          isCompleted ? "bg-green-500/20 text-green-400" : "bg-primary/20 text-primary"
                        }`}>
                          {isCompleted ? <Check className="h-4 w-4" /> : topic.id}
                        </div>
                        <div className="flex-1">
                          <h4 className="font-medium text-sm text-foreground">{topic.title}</h4>
                          <p className="text-xs text-foreground/60 mt-0.5 line-clamp-1">{topic.summary}</p>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>

        {/* Study Content */}
        <Card variant="glass" className="lg:col-span-2 bg-card/80">
          <CardHeader>
            <CardTitle className="text-foreground">
              {selectedTopic ? selectedTopic.title : "Select a Topic"}
            </CardTitle>
            {selectedTopic && (
              <CardDescription className="text-foreground/70">{selectedTopic.summary}</CardDescription>
            )}
          </CardHeader>
          <CardContent>
            {!selectedTopic ? (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <GraduationCap className="h-16 w-16 text-primary/30 mb-4" />
                <h3 className="text-lg font-medium text-foreground mb-2">Begin Your Journey</h3>
                <p className="text-foreground/60 max-w-md">
                  Select a topic to explore interactive Christ-centered studies with Palace principles.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                <Tabs value={activeTab} onValueChange={setActiveTab}>
                  <TabsList className="grid grid-cols-4 w-full">
                    <TabsTrigger value="content" className="text-xs sm:text-sm">
                      <BookOpen className="h-4 w-4 mr-1 hidden sm:block" />
                      Study
                    </TabsTrigger>
                    <TabsTrigger value="quiz" className="text-xs sm:text-sm">
                      <HelpCircle className="h-4 w-4 mr-1 hidden sm:block" />
                      Quiz
                    </TabsTrigger>
                    <TabsTrigger value="palace" className="text-xs sm:text-sm">
                      <Lightbulb className="h-4 w-4 mr-1 hidden sm:block" />
                      Palace
                    </TabsTrigger>
                    <TabsTrigger value="apply" className="text-xs sm:text-sm">
                      <Target className="h-4 w-4 mr-1 hidden sm:block" />
                      Apply
                    </TabsTrigger>
                  </TabsList>

                  {/* Content Tab */}
                  <TabsContent value="content">
                    <ScrollArea className="h-[450px] pr-4">
                      <div className="space-y-6">
                        <Card className="bg-primary/5 border-primary/20">
                          <CardContent className="pt-4">
                            <h4 className="font-semibold text-primary mb-2 flex items-center gap-2">
                              <Flame className="h-4 w-4" />
                              Opening Story
                            </h4>
                            {renderContent(selectedTopic.openingStory)}
                          </CardContent>
                        </Card>

                        <div className="prose prose-sm dark:prose-invert max-w-none">
                          {renderContent(selectedTopic.mainTeaching)}
                        </div>

                        <Card className="bg-card/50">
                          <CardContent className="pt-4">
                            <h4 className="font-semibold mb-2">Key Passages</h4>
                            <ul className="space-y-1">
                              {selectedTopic.keyPassages.map((passage, i) => (
                                <li key={i} className="text-sm text-foreground/80">📖 {passage}</li>
                              ))}
                            </ul>
                          </CardContent>
                        </Card>

                        <Card className="bg-gradient-to-br from-amber-500/10 to-orange-500/10 border-amber-500/30">
                          <CardContent className="pt-4 text-center">
                            <Star className="h-5 w-5 text-amber-500 mx-auto mb-2" />
                            <h4 className="font-semibold text-amber-600 dark:text-amber-400">Memory Verse</h4>
                            <p className="text-sm italic mt-2">{selectedTopic.memoryVerse}</p>
                          </CardContent>
                        </Card>
                      </div>
                    </ScrollArea>
                  </TabsContent>

                  {/* Quiz Tab */}
                  <TabsContent value="quiz">
                    <ScrollArea className="h-[450px] pr-4">
                      <div className="space-y-6">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Trophy className="h-4 w-4" />
                          Test your understanding with these questions
                        </div>

                        {selectedTopic.questions.map((q, qIdx) => (
                          <Card key={qIdx} className={`${showResults ? (answers[qIdx] === q.correctIndex ? 'border-green-500/50 bg-green-500/5' : 'border-red-500/50 bg-red-500/5') : ''}`}>
                            <CardContent className="pt-4">
                              <p className="font-medium mb-3">{qIdx + 1}. {q.question}</p>
                              <RadioGroup 
                                value={answers[qIdx]?.toString()} 
                                onValueChange={(v) => handleAnswerSelect(qIdx, parseInt(v))}
                                disabled={showResults}
                              >
                                {q.options.map((option, oIdx) => (
                                  <div key={oIdx} className={`flex items-center space-x-2 p-2 rounded ${
                                    showResults && oIdx === q.correctIndex ? 'bg-green-500/20' : ''
                                  } ${
                                    showResults && answers[qIdx] === oIdx && oIdx !== q.correctIndex ? 'bg-red-500/20' : ''
                                  }`}>
                                    <RadioGroupItem value={oIdx.toString()} id={`q${qIdx}-o${oIdx}`} />
                                    <Label htmlFor={`q${qIdx}-o${oIdx}`} className="flex-1 cursor-pointer">
                                      {option}
                                    </Label>
                                    {showResults && oIdx === q.correctIndex && <Check className="h-4 w-4 text-green-500" />}
                                  </div>
                                ))}
                              </RadioGroup>
                              {showResults && (
                                <div className="mt-3 p-3 rounded bg-primary/10 text-sm">
                                  <strong>Explanation:</strong> {q.explanation}
                                </div>
                              )}
                            </CardContent>
                          </Card>
                        ))}

                        {!showResults && (
                          <Button 
                            onClick={handleCheckAnswers} 
                            className="w-full"
                            disabled={Object.keys(answers).length < selectedTopic.questions.length}
                          >
                            <Check className="h-4 w-4 mr-2" />
                            Check Answers
                          </Button>
                        )}
                      </div>
                    </ScrollArea>
                  </TabsContent>

                  {/* Palace Principles Tab */}
                  <TabsContent value="palace">
                    <ScrollArea className="h-[450px] pr-4">
                      <div className="space-y-3">
                        <p className="text-sm text-muted-foreground mb-4">
                          Each study uses specific Palace principles to deepen understanding. Expand each to learn more and practice.
                        </p>

                        {selectedTopic.principleApplications.map((pa, idx) => {
                          const principle = PALACE_PRINCIPLES[pa.principle];
                          const Icon = principle.icon;
                          const isExpanded = expandedPrinciples.includes(pa.principle);

                          return (
                            <Collapsible key={idx} open={isExpanded} onOpenChange={() => togglePrinciple(pa.principle)}>
                              <Card className="bg-card/50">
                                <CollapsibleTrigger asChild>
                                  <CardHeader className="cursor-pointer hover:bg-primary/5 transition-colors py-3">
                                    <div className="flex items-center justify-between">
                                      <div className="flex items-center gap-3">
                                        <div className="p-2 rounded-lg bg-primary/10">
                                          <Icon className="h-4 w-4 text-primary" />
                                        </div>
                                        <div>
                                          <CardTitle className="text-sm">{principle.name}</CardTitle>
                                          <Badge variant="outline" className="text-xs mt-1">{principle.tag}</Badge>
                                        </div>
                                      </div>
                                      {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                                    </div>
                                  </CardHeader>
                                </CollapsibleTrigger>
                                <CollapsibleContent>
                                  <CardContent className="pt-0 space-y-4">
                                    <div className="p-3 rounded bg-primary/5 text-sm">
                                      <strong className="text-primary">What is this principle?</strong>
                                      <p className="mt-1 text-foreground/80">{principle.description}</p>
                                    </div>

                                    <div>
                                      <strong className="text-sm">How it applies here:</strong>
                                      <p className="text-sm text-foreground/80 mt-1">{pa.application}</p>
                                    </div>

                                    <Card className="bg-gradient-to-br from-amber-500/5 to-orange-500/5 border-amber-500/20">
                                      <CardContent className="pt-3">
                                        <strong className="text-sm text-amber-600 dark:text-amber-400">🏋️ Your Exercise:</strong>
                                        <p className="text-sm mt-1">{pa.exercise}</p>
                                      </CardContent>
                                    </Card>
                                  </CardContent>
                                </CollapsibleContent>
                              </Card>
                            </Collapsible>
                          );
                        })}
                      </div>
                    </ScrollArea>
                  </TabsContent>

                  {/* Apply Tab */}
                  <TabsContent value="apply">
                    <ScrollArea className="h-[450px] pr-4">
                      <div className="space-y-6">
                        <Card className="bg-primary/5 border-primary/20">
                          <CardContent className="pt-4">
                            <h4 className="font-semibold flex items-center gap-2 mb-2">
                              <MessageCircle className="h-4 w-4 text-primary" />
                              Reflection Question
                            </h4>
                            <p className="text-foreground/80">{selectedTopic.reflection}</p>
                            <Textarea 
                              placeholder="Write your thoughts here..." 
                              className="mt-3 min-h-[100px]"
                            />
                          </CardContent>
                        </Card>

                        <Card className="bg-gradient-to-br from-green-500/5 to-emerald-500/5 border-green-500/20">
                          <CardContent className="pt-4">
                            <h4 className="font-semibold flex items-center gap-2 text-green-600 dark:text-green-400 mb-2">
                              <Target className="h-4 w-4" />
                              Take Home Challenge
                            </h4>
                            <p className="text-foreground/80">{selectedTopic.takeHomeChallenge}</p>
                          </CardContent>
                        </Card>

                        <div className="flex gap-3 pt-4 border-t border-border/50">
                          <Button 
                            onClick={handleMarkComplete} 
                            className="flex-1"
                            disabled={completedTopics.includes(selectedTopic.id)}
                          >
                            <Check className="h-4 w-4 mr-2" />
                            {completedTopics.includes(selectedTopic.id) ? 'Completed' : 'Mark Complete'}
                          </Button>
                          {selectedTopic.id < ALL_STUDIES.length && (
                            <Button 
                              onClick={() => {
                                const next = ALL_STUDIES.find(s => s.id === selectedTopic.id + 1);
                                if (next) handleSelectTopic(next);
                              }} 
                              variant="outline"
                            >
                              Next
                              <ChevronRight className="h-4 w-4 ml-2" />
                            </Button>
                          )}
                        </div>
                      </div>
                    </ScrollArea>
                  </TabsContent>
                </Tabs>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
