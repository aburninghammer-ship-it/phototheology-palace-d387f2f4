import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useAuth } from "@/hooks/useAuth";
import { 
  GraduationCap, BookOpen, ChevronRight, Check, 
  Sparkles, RefreshCw
} from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "sonner";

interface TruthSeriesProps {
  churchId?: string;
}

// Pre-written content with Phototheology principles naturally integrated
const TRUTH_SERIES_CONTENT = [
  {
    id: 1,
    title: "The Holy Scriptures",
    summary: "God's written Word as the infallible revelation of His will",
    content: `## The Living Word

**Opening Story: The Ethiopian's Question**
Picture the desert road from Jerusalem to Gaza. A chariot rattles along, bearing an Ethiopian treasurer reading aloud from Isaiah 53. His voice carries confusion: "Like a sheep led to slaughter... who is He speaking about?" Then Philip appears—sent by the Spirit—and beginning from that very Scripture, "preached unto him Jesus" (Acts 8:35).

This scene captures the heartbeat of Scripture: it all points to Christ.

---

### The Word Made Flesh

The Bible isn't merely a book—it's a sanctuary of truth. Just as the ancient tabernacle had an outer court leading to the holy place and finally the Most Holy Place where God's presence dwelt, so Scripture draws us progressively deeper into God's heart.

**Consider the pattern:**
- Genesis opens with God speaking creation into existence
- John opens with "In the beginning was the Word"
- Revelation closes with Christ as "the Word of God"

From first page to last, we meet the same Person.

---

### Scripture in Your Hands

When Moses descended Sinai with the tablets, he carried God's own handwriting. When you open your Bible, you hold that same authority—not stone tablets, but living words that "are spirit, and they are life" (John 6:63).

**Key Passages:**
- 2 Timothy 3:16-17 — "All Scripture is given by inspiration of God"
- 2 Peter 1:21 — "Holy men of God spake as they were moved by the Holy Ghost"
- Psalm 119:105 — "Thy word is a lamp unto my feet"

---

### Discussion Questions
1. The Ethiopian needed help understanding Isaiah—who has God placed in your life to help you understand Scripture?
2. What does it mean that the Word "became flesh"? How does Jesus reveal the Father's character?
3. How can we approach Bible reading as meeting a Person, not just gathering information?

**Memory Verse:** "Thy word is a lamp unto my feet, and a light unto my path." — Psalm 119:105

**Take Home Challenge:** This week, before each reading, pause and pray: "Lord, show me Jesus in this passage." Write down what you discover.`,
  },
  {
    id: 2,
    title: "The Trinity",
    summary: "One God: Father, Son, and Holy Spirit—three co-eternal Persons",
    content: `## Three Who Are One

**Opening Story: At the Jordan**
The heavens tear open. A dove descends like a shaft of light. A voice thunders from above: "This is my beloved Son." Picture it—Father speaks, Spirit descends, Son rises from the water. Three distinct Persons, one divine purpose, one moment of revelation (Matthew 3:16-17).

Here, at the inauguration of Jesus' ministry, the Godhead steps onto the stage together.

---

### Unity in Creation and Redemption

From the first verses of Scripture, plurality appears within unity: "Let *Us* make man in *Our* image" (Genesis 1:26). This wasn't God speaking to angels—angels didn't create. This was the divine council, the three-in-one deliberating the greatest work of love.

**The Pattern Across Scripture:**
- Creation: Father speaks, Spirit hovers, Son (the Word) executes
- Incarnation: Father sends, Son comes, Spirit conceives
- Redemption: Father plans, Son accomplishes, Spirit applies
- Sanctification: Father destines, Son cleanses, Spirit transforms

---

### The Sanctuary Blueprint

In the sanctuary, we see three compartments: outer court, holy place, Most Holy Place. Each reveals a different aspect of God's saving work—yet all are *one* sanctuary, pointing to *one* salvation through *one* God who exists as three.

**Key Passages:**
- Matthew 28:19 — "Baptizing them in the name of the Father, and of the Son, and of the Holy Ghost"
- 2 Corinthians 13:14 — "The grace of the Lord Jesus Christ, and the love of God, and the communion of the Holy Ghost"
- John 14:16-17 — Jesus promises "another Comforter"

---

### Discussion Questions
1. Why is it significant that all three Persons were present at Jesus' baptism?
2. How does the Trinity demonstrate that love has always existed within God—even before creation?
3. What comfort do you find knowing the Father planned, the Son paid, and the Spirit seals your salvation?

**Memory Verse:** "Go ye therefore, and teach all nations, baptizing them in the name of the Father, and of the Son, and of the Holy Ghost." — Matthew 28:19

**Take Home Challenge:** This week, direct one prayer specifically to each Person of the Godhead. Notice how this shapes your understanding of God.`,
  },
  {
    id: 3,
    title: "The Father",
    summary: "God the eternal Father is the Creator and Source of all things",
    content: `## The Heart of the Father

**Opening Story: The Waiting Father**
A young man demands his inheritance—essentially wishing his father dead. He squanders everything. He feeds pigs. He comes home rehearsing a servant's speech. But the father has been watching. Running (undignified for a patriarch!), falling on his neck, kissing him—before the boy can finish his prepared confession, the father is calling for the best robe, the ring, the feast (Luke 15:11-32).

This is Jesus showing us His Father's heart.

---

### Source of All Good

"Every good gift and every perfect gift is from above, and cometh down from the Father of lights" (James 1:17). The Father is not a distant deity demanding sacrifice—He is the generous Source from whom all blessing flows.

**Consider:**
- He gave His Son (John 3:16)
- He gives wisdom to those who ask (James 1:5)
- He gives the Holy Spirit to those who seek (Luke 11:13)

---

### The Father in the Sanctuary

The whole sanctuary system was designed by the Father to bring rebellious children home. The sacrifices didn't appease an angry God—they revealed a loving Father's costly solution to sin. The mercy seat in the Most Holy Place bore the very name of His character: mercy.

**Pattern:** Just as Israel's priests carried the names of the twelve tribes on their breastplate, bearing them into God's presence, so the Father knows you by name and holds you on His heart.

**Key Passages:**
- Psalm 103:13 — "Like as a father pitieth his children, so the LORD pitieth them that fear him"
- Isaiah 64:8 — "But now, O LORD, thou art our father; we are the clay"
- Matthew 6:9 — "Our Father which art in heaven"

---

### Discussion Questions
1. How does the parable of the prodigal son reshape your picture of God the Father?
2. What "far country" have you wandered to? How does knowing the Father watches and waits change your approach to coming home?
3. Why do you think Jesus taught us to begin prayer with "Our Father"?

**Memory Verse:** "Like as a father pitieth his children, so the LORD pitieth them that fear him." — Psalm 103:13

**Take Home Challenge:** Write a letter to God beginning "Dear Father..." Express what you've learned about His heart this week.`,
  },
  {
    id: 4,
    title: "The Son",
    summary: "God the eternal Son became incarnate in Jesus Christ",
    content: `## The Son Who Left Everything

**Opening Story: The Night Visitor**
A ruler of the Pharisees comes by night. He's curious, cautious, perhaps afraid of what his colleagues might think. Jesus doesn't waste time: "Ye must be born again." Nicodemus stammers. Then Jesus unveils the cosmos: "As Moses lifted up the serpent in the wilderness, even so must the Son of man be lifted up" (John 3:14).

Jesus always points back to Scripture and forward to the cross—because both reveal who He is.

---

### From Throne to Manger to Cross

Follow the descent:
- *Before time*: Equal with God (Philippians 2:6)
- *Bethlehem*: Born in a stable, laid in a feeding trough
- *Ministry*: "Foxes have holes... the Son of man hath not where to lay his head"
- *Calvary*: "Made himself of no reputation... obedient unto death, even the death of the cross" (Philippians 2:7-8)

This is the eternal Son—trading heaven's praise for a borrowed tomb.

---

### Christ in Every Story

The Son didn't begin at Bethlehem. He walked with Adam in Eden. He called Abraham His friend. He was the Angel wrestling Jacob, the Captain appearing to Joshua, the fourth Man in Nebuchadnezzar's furnace.

**The Golden Thread:**
- Genesis 3:15 — The Seed promised
- Exodus 12 — The Lamb slain
- Isaiah 53 — The Suffering Servant described
- Matthew 1 — The Son born
- Revelation 5 — The Lamb enthroned

Every story finds its center in Him.

**Key Passages:**
- John 1:14 — "The Word was made flesh, and dwelt among us"
- Hebrews 1:3 — "The brightness of his glory, and the express image of his person"
- Colossians 1:15-17 — "By him all things consist"

---

### Discussion Questions
1. Why did the Son choose to empty Himself rather than rescue humanity from heaven?
2. Where do you see Jesus "hidden" in Old Testament stories you grew up with?
3. What does it mean for your daily life that the One who holds all things together also holds you?

**Memory Verse:** "And the Word was made flesh, and dwelt among us, (and we beheld his glory, the glory as of the only begotten of the Father,) full of grace and truth." — John 1:14

**Take Home Challenge:** Choose one Old Testament story this week. Ask: "Where is Jesus here?" Write down your discovery.`,
  },
  {
    id: 5,
    title: "The Holy Spirit",
    summary: "God the eternal Spirit was active in creation, incarnation, and redemption",
    content: `## The Breath of God

**Opening Story: Wind and Fire**
One hundred twenty believers huddle in an upper room. Ten days of prayer. Suddenly—the sound of a rushing mighty wind fills the house. Tongues of fire rest on each head. They spill into Jerusalem's streets speaking languages they never learned, and three thousand souls are born into the kingdom before sunset (Acts 2).

The Spirit had come to do what only He can do: make Christ real.

---

### The Spirit's Work Through History

From the very beginning, the Spirit was moving:
- *Creation*: "The Spirit of God moved upon the face of the waters" (Genesis 1:2)
- *Incarnation*: "The Holy Ghost shall come upon thee" (Luke 1:35)
- *Ministry*: Jesus was led by the Spirit, anointed by the Spirit, performed miracles by the Spirit
- *Pentecost*: The Spirit fell to continue Christ's mission through His body

---

### The Sanctuary Connection

In the sanctuary, the lampstand burned continuously—supplied with oil by the priests. Zechariah saw this vision and heard: "Not by might, nor by power, but by my spirit, saith the LORD" (Zechariah 4:6). Oil represents the Spirit. The light represents Christ's presence. Without the Spirit's oil, the church has no light.

**The Pattern:** Just as the high priest's incense rose before God's throne, the Spirit takes our inarticulate prayers and presents them to the Father (Romans 8:26-27).

**Key Passages:**
- John 16:13-14 — "He will guide you into all truth... He shall glorify me"
- Romans 8:11 — "The Spirit of him that raised up Jesus... shall also quicken your mortal bodies"
- Galatians 5:22-23 — The fruit of the Spirit

---

### Discussion Questions
1. Why do you think the Spirit waited until Jesus ascended before coming in fullness at Pentecost?
2. How does the Spirit "glorify" Jesus? What does that look like in daily life?
3. Which fruit of the Spirit do you most need the Spirit to cultivate in you right now?

**Memory Verse:** "But ye shall receive power, after that the Holy Ghost is come upon you: and ye shall be witnesses unto me." — Acts 1:8

**Take Home Challenge:** Each morning this week, begin with a simple prayer: "Holy Spirit, make Jesus real to me today." Journal what happens.`,
  },
  {
    id: 6,
    title: "Creation",
    summary: "God is Creator of all things, including humanity in His image",
    content: `## In the Beginning, God

**Opening Story: The First Week**
No laboratory. No process. Just the voice of God and the canvas of nothing. "Let there be light"—and photons raced into existence. Waters separated. Land appeared. Trees fruited. Stars ignited. Fish schooled. Birds soared. And on the sixth day, the Creator stooped to the dust, formed a shape with His own hands, breathed His own breath, and Adam opened his eyes to see the face of God (Genesis 1-2).

Creation wasn't distant. It was intimate.

---

### Why Creation Matters

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

---

### Creation Points to Christ

The New Testament reveals that the Son was the active agent in creation: "All things were made by him; and without him was not any thing made that was made" (John 1:3). The hands that shaped Adam were the same hands that would be pierced at Calvary.

**The Pattern:**
- Genesis: "God said... and it was so"
- John: "The Word became flesh"
- 2 Corinthians 4:6: "God, who commanded the light to shine out of darkness, hath shined in our hearts"

The same Word that spoke light into darkness speaks new life into souls.

**Key Passages:**
- Genesis 1:27 — "God created man in his own image"
- Psalm 33:6,9 — "By the word of the LORD were the heavens made... He spake, and it was done"
- Colossians 1:16 — "By him were all things created"

---

### Discussion Questions
1. What does it mean to be made "in the image of God"? How should this shape how we treat ourselves and others?
2. How does knowing Jesus is your Creator affect your relationship with Him?
3. Why do you think God chose to rest on the seventh day and invite humanity into that rest?

**Memory Verse:** "In the beginning God created the heaven and the earth." — Genesis 1:1

**Take Home Challenge:** Take a walk this week and look for evidence of design—a spider's web, a sunset, a child's laugh. Thank the Creator for speaking you into existence too.`,
  },
  {
    id: 7,
    title: "The Nature of Humanity",
    summary: "Man and woman were made in the image of God",
    content: `## Dust and Divinity

**Opening Story: Formed from Earth**
Imagine God kneeling in Eden's soil. Divine fingers shaping clay. Eye sockets, spine, lungs—but still lifeless. Then God leans close and breathes. That first gasp. Eyes flutter open. Adam's first sight: his Maker's face. His first breath: borrowed from God Himself (Genesis 2:7).

You carry that breath. You bear that image.

---

### What Makes Us Human

Scripture presents humanity as a unified whole—not a ghost trapped in a machine:
- "God formed man of the dust" (body)
- "Breathed into his nostrils the breath of life" (spirit/breath)
- "Man became a living soul" (the whole, living person)

Body + Breath = Living Soul. When breath departs, the soul doesn't fly away—the person ceases to live until resurrection.

**Key Truth:** We *are* souls; we don't merely *have* souls.

---

### The Image Marred, the Image Restored

When Adam sinned, the image was distorted but not destroyed. Every human—regardless of race, ability, or status—still bears the Maker's mark. This is why murder is prohibited (Genesis 9:6) and why James warns against cursing people (James 3:9).

**The Pattern:** Christ came as the "express image" of God (Hebrews 1:3)—the perfect human. In Him, we see what we were meant to be. Through Him, we're being restored to that image (2 Corinthians 3:18).

**Key Passages:**
- Genesis 1:27 — "Male and female created he them"
- Psalm 8:4-5 — "What is man... thou hast made him a little lower than the angels"
- Romans 8:29 — "Conformed to the image of his Son"

---

### Discussion Questions
1. How does understanding that we *are* living souls (not souls trapped in bodies) change how we view death and resurrection?
2. What does it mean practically that every person bears God's image—even those who oppose us?
3. How is the "image of God" being restored in you through Christ?

**Memory Verse:** "So God created man in his own image, in the image of God created he him; male and female created he them." — Genesis 1:27

**Take Home Challenge:** This week, when you interact with someone difficult, pause and remind yourself: "They bear God's image." See if it changes your response.`,
  },
  {
    id: 8,
    title: "The Great Controversy",
    summary: "The conflict between Christ and Satan that affects all humanity",
    content: `## War in Heaven, War on Earth

**Opening Story: The Dragon's Fall**
Picture heaven's throne room—brilliant, peaceful, worshipful. Then a shadow creeps into Lucifer's heart. "I will ascend... I will be like the Most High" (Isaiah 14:13-14). War erupts. A third of the angels follow the rebel. The dragon is cast down, and the battle moves to a garden called Eden (Revelation 12:7-9).

We live in the middle of that war.

---

### The Two Trees, The Two Kingdoms

In Eden stood two trees: the Tree of Life and the Tree of Knowledge of Good and Evil. They represented the choice between God's way (trust and life) and Satan's way (independence and death). Adam and Eve chose wrongly—and the conflict spread to their children.

**Trace the pattern:**
- Cain vs. Abel
- Moses vs. Pharaoh
- David vs. Goliath
- Elijah vs. Jezebel
- Christ vs. Satan in the wilderness

History is not random—it's the record of two kingdoms at war.

---

### The Cross: Victory Announced

At Calvary, the decisive battle was fought. Satan bruised Christ's heel, but Christ crushed the serpent's head (Genesis 3:15). "Now is the judgment of this world: now shall the prince of this world be cast out" (John 12:31).

**The Pattern in the Sanctuary:** The Day of Atonement revealed that sin wouldn't last forever. The scapegoat carried the guilt into the wilderness, symbolizing Satan's ultimate banishment. God will vindicate His character and His people.

**Key Passages:**
- Genesis 3:15 — The first promise of victory
- Revelation 12:11 — "They overcame him by the blood of the Lamb"
- Romans 16:20 — "The God of peace shall bruise Satan under your feet shortly"

---

### Discussion Questions
1. How does understanding the cosmic conflict help explain the suffering in our world?
2. Why do you think God allowed the controversy to play out rather than destroying Satan immediately?
3. What battles are you fighting that are actually part of this larger war?

**Memory Verse:** "And there was war in heaven: Michael and his angels fought against the dragon; and the dragon fought and his angels." — Revelation 12:7

**Take Home Challenge:** This week, when you face temptation or trial, remind yourself: "This is part of the controversy—and Christ has already won." Record how this perspective changes your experience.`,
  },
  {
    id: 9,
    title: "The Life, Death, and Resurrection of Christ",
    summary: "God's supreme revelation of His love",
    content: `## The Lamb Who Is King

**Opening Story: Two Thieves, Two Destinies**
Three crosses silhouetted against a darkening sky. The same crowd, the same crimes mocked all three. But one thief looked at the Man in the middle—bloody, gasping, crowned with thorns—and saw something else. "Lord, remember me when thou comest into thy kingdom." Through cracked lips came paradise's promise: "Today shalt thou be with me" (Luke 23:42-43).

Even in death, Jesus was saving.

---

### The Life That Revealed the Father

For thirty-three years, God wore skin. He hungered. He wept. He slept in boats and walked dusty roads. But every action, every word, every meal shared with sinners declared: "He that hath seen me hath seen the Father" (John 14:9).

**He lived:**
- To show us the Father's heart
- To fulfill the law we couldn't keep
- To face every temptation without sin
- To qualify as our High Priest

---

### The Death That Paid Everything

The cross wasn't Plan B. "The Lamb slain from the foundation of the world" (Revelation 13:8). Every Old Testament sacrifice pointed to this moment:
- Abraham's ram caught in the thicket
- The Passover lamb's blood on the doorposts
- The daily offerings in the sanctuary

All shadows—the substance was Calvary.

**"It is finished"** — The debt is canceled. The way is opened. The veil is torn.

---

### The Resurrection That Changes Everything

A borrowed tomb couldn't hold Him. On the third day—like Jonah from the fish, like Isaac from the altar—Jesus rose. And because He lives, we will live also (John 14:19).

**Key Passages:**
- Isaiah 53:5 — "He was wounded for our transgressions"
- John 19:30 — "It is finished"
- 1 Corinthians 15:3-4 — "Christ died... was buried... rose again"

---

### Discussion Questions
1. Which moment in Jesus' life speaks most powerfully to you about God's character?
2. Why was it necessary for Christ to both live a perfect life AND die a sacrificial death?
3. How does the resurrection change how we face death today?

**Memory Verse:** "But God commendeth his love toward us, in that, while we were yet sinners, Christ died for us." — Romans 5:8

**Take Home Challenge:** Read through one Gospel this week (Mark is shortest). Underline every time Jesus shows the Father's character in action.`,
  },
  {
    id: 10,
    title: "The Experience of Salvation",
    summary: "Through Christ we are justified, adopted, sanctified, and glorified",
    content: `## From Guilt to Glory

**Opening Story: The Woman at the Well**
Noon. The hottest hour. A Samaritan woman comes alone—avoiding the morning crowd and their whispers. Five husbands. A man at home who isn't. Then a Jewish stranger asks for water and offers her something better: "a well of water springing up into everlasting life." She drops her waterpot. She runs to the village. "Come, see a man, which told me all things that ever I did: is not this the Christ?" (John 4).

Salvation met her at her lowest.

---

### What Salvation Includes

Salvation isn't one moment—it's a journey with a destination:

**Justification** — Declared righteous (a verdict)
- "Being justified freely by his grace through the redemption that is in Christ Jesus" (Romans 3:24)

**Adoption** — Welcomed into the family (a relationship)
- "Ye have received the Spirit of adoption, whereby we cry, Abba, Father" (Romans 8:15)

**Sanctification** — Made holy over time (a process)
- "He which hath begun a good work in you will perform it" (Philippians 1:6)

**Glorification** — Transformed at Christ's return (a completion)
- "We shall be like him; for we shall see him as he is" (1 John 3:2)

---

### Grace That Works

We're saved by grace through faith—not by works (Ephesians 2:8-9). But the same passage continues: "created in Christ Jesus unto good works" (v. 10). Faith alone saves, but saving faith is never alone. Good works are the fruit, not the root.

**The Sanctuary Pattern:** We enter by the cross (justification), walk through the holy place in ongoing relationship (sanctification), and anticipate standing in God's presence forever (glorification).

**Key Passages:**
- Romans 8:1 — "No condemnation to them which are in Christ Jesus"
- Titus 3:5 — "Not by works of righteousness which we have done, but according to his mercy he saved us"
- 1 John 5:12 — "He that hath the Son hath life"

---

### Discussion Questions
1. Where do you see yourself in the salvation journey—newly justified? Growing in sanctification?
2. Why is it important to distinguish between being saved BY works and being saved FOR works?
3. What does "abiding in Christ" look like practically for you?

**Memory Verse:** "For by grace are ye saved through faith; and that not of yourselves: it is the gift of God." — Ephesians 2:8

**Take Home Challenge:** Write out your salvation story in one page. When did you first sense God drawing you? How has He been transforming you since?`,
  },
  {
    id: 11,
    title: "Growing in Christ",
    summary: "By His death, Jesus triumphed over evil powers",
    content: `## Victory Over Every Enemy

**Opening Story: Legion Set Free**
A graveyard in Gadara. A man screams among the tombs, cutting himself with stones, breaking every chain. A legion of demons had made him their home. Then Jesus steps off the boat. The demons beg—they know who He is. "Come out!" And the man sits clothed, calm, in his right mind (Mark 5:1-20).

The same power that freed Legion is available to you.

---

### Christ's Decisive Victory

At the cross, Jesus didn't merely die for sins—He conquered sin's source. "Having spoiled principalities and powers, he made a shew of them openly, triumphing over them" (Colossians 2:15).

**What Christ defeated:**
- The guilt of sin — paid in full
- The power of sin — broken at the root
- The accusation of Satan — silenced forever
- Death itself — "swallowed up in victory"

---

### Growing After the Victory

Salvation is instant (justification), but growth takes time. A newborn has full family membership from birth, but they must grow into maturity. So with us.

**Growth involves:**
- Bible study — "As newborn babes, desire the sincere milk of the word" (1 Peter 2:2)
- Prayer — "Pray without ceasing" (1 Thessalonians 5:17)
- Fellowship — "Not forsaking the assembling of ourselves together" (Hebrews 10:25)
- Service — "Faith without works is dead" (James 2:26)

**The Pattern:** The sanctuary journey moves from the gate inward—always progressing toward God's presence. Christian growth moves us ever closer to His character.

**Key Passages:**
- 2 Peter 3:18 — "Grow in grace, and in the knowledge of our Lord"
- Galatians 2:20 — "I am crucified with Christ: nevertheless I live"
- Romans 6:14 — "Sin shall not have dominion over you"

---

### Discussion Questions
1. What chains has Christ broken in your life that once held you?
2. In which area of growth (Bible, prayer, fellowship, service) do you sense God calling you deeper?
3. How do we balance resting in Christ's finished work and actively pursuing growth?

**Memory Verse:** "But grow in grace, and in the knowledge of our Lord and Saviour Jesus Christ." — 2 Peter 3:18

**Take Home Challenge:** Identify one habit this week that pulls you away from Christ. Bring it to Him in prayer daily, trusting His victory over it.`,
  },
  {
    id: 12,
    title: "The Church",
    summary: "The community of believers who confess Jesus as Lord and Savior",
    content: `## One Body, Many Members

**Opening Story: The Birthday of the Church**
Jerusalem. Pentecost. Pilgrims from every nation gathered. Then fire fell. Common fishermen preached in languages they'd never learned. Three thousand were baptized before sunset. They devoted themselves to teaching, fellowship, breaking bread, and prayers. "The Lord added to the church daily such as should be saved" (Acts 2:47).

The church isn't a building—it's a miracle.

---

### What Is the Church?

The Greek word *ekklesia* means "called out ones." The church is the company of all who have responded to Christ's call—across all ages, nations, and denominations.

**The church is:**
- The Body of Christ — "Now ye are the body of Christ, and members in particular" (1 Corinthians 12:27)
- The Bride of Christ — "I have espoused you to one husband, that I may present you as a chaste virgin to Christ" (2 Corinthians 11:2)
- The Temple of the Spirit — "Ye are the temple of the living God" (2 Corinthians 6:16)

---

### Visible and Invisible

Scripture speaks of the church in two senses:
- **Universal/Invisible** — All true believers known to God across time
- **Local/Visible** — Organized communities of believers in specific places

Both matter. We need personal faith, but we also need community.

**The Pattern:** Just as the sanctuary was one structure with courts, holy place, and Most Holy, the church is one body with varied functions—some teaching, some serving, some encouraging—all essential.

**Key Passages:**
- Matthew 16:18 — "Upon this rock I will build my church"
- Ephesians 1:22-23 — "The church, which is his body"
- Hebrews 10:25 — "Not forsaking the assembling of ourselves together"

---

### Discussion Questions
1. What's the difference between attending church and being the church?
2. How can local church fellowship support your growth in Christ?
3. What spiritual gift has God given you to build up the body?

**Memory Verse:** "Now ye are the body of Christ, and members in particular." — 1 Corinthians 12:27

**Take Home Challenge:** This week, reach out to someone in your church community you don't know well. Learn their story. Pray for them.`,
  },
  {
    id: 13,
    title: "The Remnant and Its Mission",
    summary: "The universal church includes all who truly believe in Christ",
    content: `## A People Prepared

**Opening Story: The Faithful Seven Thousand**
Elijah collapses under a juniper tree. "I, even I only, am left." He's just won the contest on Carmel, but Jezebel's threat has broken him. God's response? "I have left me seven thousand in Israel, all the knees which have not bowed unto Baal" (1 Kings 19:18).

God always preserves a faithful remnant.

---

### The Remnant Through History

From the beginning, God has preserved a seed:
- Seth's line through the flood
- Abraham's family among idol worshipers
- The seven thousand in Elijah's day
- The disciples after Christ's crucifixion
- Faithful believers through centuries of compromise

**The Pattern:** In every age, when apostasy threatened to engulf truth, God raised up a remnant to carry His message forward.

---

### Identifying Marks

Revelation 12:17 describes the end-time remnant: "And the dragon was wroth with the woman, and went to make war with the remnant of her seed, which keep the commandments of God, and have the testimony of Jesus Christ."

**Two marks:**
1. **Keep the commandments** — Not for salvation, but because of salvation
2. **Have the testimony of Jesus** — "The spirit of prophecy" (Revelation 19:10)

---

### The Mission

The remnant isn't an exclusive club—it's a rescue party. The mission: "This gospel of the kingdom shall be preached in all the world for a witness unto all nations; and then shall the end come" (Matthew 24:14).

**Key Passages:**
- Isaiah 11:11 — "The Lord shall set his hand again the second time to recover the remnant of his people"
- Revelation 14:6-12 — The three angels' messages
- Romans 11:5 — "Even so then at this present time also there is a remnant according to the election of grace"

---

### Discussion Questions
1. What responsibility comes with being part of God's remnant?
2. How do the commandments and the testimony of Jesus work together?
3. How can we share the three angels' messages with gentleness and urgency?

**Memory Verse:** "And the dragon was wroth with the woman, and went to make war with the remnant of her seed, which keep the commandments of God, and have the testimony of Jesus Christ." — Revelation 12:17

**Take Home Challenge:** Study Revelation 14:6-12 this week. Ask: What is God's final message to the world? How does my life reflect it?`,
  },
  {
    id: 14,
    title: "Unity in the Body of Christ",
    summary: "The church is one body with many members",
    content: `## Many Parts, One Body

**Opening Story: Divided Corinth**
The church in Corinth was splintering. "I am of Paul... I of Apollos... I of Cephas." Paul's response cuts through the noise: "Is Christ divided?" (1 Corinthians 1:12-13). The church's unity isn't based on human leaders but on the One who gave Himself for all.

---

### The Unity Jesus Prayed For

On the night of His betrayal, Jesus prayed: "That they all may be one; as thou, Father, art in me, and I in thee, that they also may be one in us: that the world may believe that thou hast sent me" (John 17:21).

Unity is Jesus' prayer for His people. Division grieves His heart.

---

### Unity Without Uniformity

The body has many parts—eye, ear, hand, foot—each different, each essential. Paul makes the point: "The eye cannot say unto the hand, I have no need of thee" (1 Corinthians 12:21).

**Unity means:**
- One Lord, one faith, one baptism (Ephesians 4:5)
- Mutual submission and care
- Accepting differences in gifts and calling

**Unity does not mean:**
- Sameness of opinion on every detail
- Suppressing diversity
- Compromising truth for harmony

The Pattern: In the sanctuary, different materials served different purposes—gold, silver, bronze, fine linen—all distinct, all essential, all contributing to one beautiful structure.

**Key Passages:**
- Ephesians 4:3 — "Endeavouring to keep the unity of the Spirit in the bond of peace"
- Colossians 3:14 — "Above all these things put on charity, which is the bond of perfectness"
- Psalm 133:1 — "How good and how pleasant it is for brethren to dwell together in unity!"

---

### Discussion Questions
1. What causes division in churches today? How can these divisions be healed?
2. How do we maintain unity without compromising truth?
3. What role does humility play in preserving church unity?

**Memory Verse:** "Behold, how good and how pleasant it is for brethren to dwell together in unity!" — Psalm 133:1

**Take Home Challenge:** If there's broken relationship in your church or family, take one step toward reconciliation this week—a phone call, a letter, an apology.`,
  },
  {
    id: 15,
    title: "Baptism",
    summary: "The symbol of union with Christ and new life through the Spirit",
    content: `## Buried and Raised

**Opening Story: The Ethiopian's Urgency**
A desert road. A chariot. An Ethiopian treasurer reads Isaiah aloud. Philip explains—it's about Jesus. As they travel, water appears. "See, here is water; what doth hinder me to be baptized?" No delay. They go down into the water, and the Ethiopian rises to continue his journey "rejoicing" (Acts 8:36-39).

Baptism isn't optional—it's the believer's public declaration.

---

### What Baptism Pictures

Paul explains: "We are buried with him by baptism into death: that like as Christ was raised up from the dead by the glory of the Father, even so we also should walk in newness of life" (Romans 6:4).

**Baptism is:**
- Dying to the old life
- Being buried with Christ
- Rising to walk in newness

Immersion captures this death-burial-resurrection pattern perfectly. Nothing else does.

---

### Who Should Be Baptized?

Jesus commanded: "Go ye therefore, and teach all nations, baptizing them" (Matthew 28:19). Teaching comes first—baptism is the response of understanding and commitment.

**The biblical order:**
1. Hear the gospel
2. Believe
3. Repent
4. Be baptized

This is why the New Testament shows believers' baptism—people old enough to hear, believe, and respond.

**The Sanctuary Connection:** Entering the sanctuary began with the laver—water for cleansing. Baptism is our laver moment, symbolizing cleansing and consecration for service.

**Key Passages:**
- Matthew 3:16-17 — Jesus' baptism
- Acts 2:38 — "Repent, and be baptized every one of you"
- Colossians 2:12 — "Buried with him in baptism, wherein also ye are risen with him"

---

### Discussion Questions
1. Why did Jesus, who had no sins, choose to be baptized?
2. How does understanding baptism as death and resurrection affect how we live afterward?
3. If you've been baptized, what did that moment mean to you?

**Memory Verse:** "Therefore we are buried with him by baptism into death: that like as Christ was raised up from the dead by the glory of the Father, even so we also should walk in newness of life." — Romans 6:4

**Take Home Challenge:** If you haven't been baptized, consider why not. If you have, revisit your baptism photos or memories. Thank God for the new life He gave you.`,
  },
  {
    id: 16,
    title: "The Lord's Supper",
    summary: "Participation in the emblems of Christ's body and blood",
    content: `## The Table of Remembrance

**Opening Story: That Night in the Upper Room**
The Passover meal is spread. Jesus breaks bread: "This is my body, which is given for you." He lifts the cup: "This cup is the new testament in my blood." Then He girds Himself with a towel and washes twenty-four dusty feet—including Judas's (Luke 22:19-20; John 13).

Before the cross, Jesus gave us a way to remember.

---

### What the Supper Means

**The Bread:** "This is my body, broken for you." Not literal flesh, but symbol—as Jesus stood there holding it. Every time we eat, we remember His incarnation and sacrifice.

**The Cup:** "This is my blood of the new covenant." The wine represents His life poured out. We drink, remembering that His blood ratifies a covenant of grace.

**The Footwashing:** Before the bread and cup, Jesus washed feet. He said, "I have given you an example, that ye should do as I have done to you" (John 13:15). Humility prepares us for communion.

---

### Looking Back and Forward

The Lord's Supper has two directions:
- **Backward** — "This do in remembrance of me"
- **Forward** — "Till he come" (1 Corinthians 11:26)

We remember His death; we anticipate His return. The Table bridges Calvary and the Second Coming.

**The Sanctuary Connection:** The Table of Showbread in the holy place represented God's provision and fellowship. The Lord's Supper continues that theme—Christ is our provision, and we commune with Him and each other.

**Key Passages:**
- Matthew 26:26-29 — Institution of the Supper
- 1 Corinthians 11:23-26 — "As often as ye eat this bread, and drink this cup, ye do shew the Lord's death till he come"
- John 6:53-56 — Jesus as the Bread of Life

---

### Discussion Questions
1. Why do you think Jesus chose bread and wine as symbols? What do they communicate?
2. How does footwashing prepare our hearts for communion?
3. What difference does "till he come" make in how we approach the Lord's Supper?

**Memory Verse:** "For as often as ye eat this bread, and drink this cup, ye do shew the Lord's death till he come." — 1 Corinthians 11:26

**Take Home Challenge:** Before the next communion service, spend time in self-examination (1 Corinthians 11:28). Ask the Lord to reveal anything that hinders true fellowship.`,
  },
  {
    id: 17,
    title: "Spiritual Gifts and Ministries",
    summary: "God bestows gifts upon all members of the church",
    content: `## Every Member Gifted

**Opening Story: The Body's Complaint**
Imagine a body meeting. The foot grumbles: "Because I'm not a hand, I'm not part of the body." The ear sighs: "Because I'm not an eye, I don't belong." Paul's response: Absurd! "If the whole body were an eye, where were the hearing?" God has placed each part exactly where He wants it (1 Corinthians 12:15-18).

You have a gift. The body needs it.

---

### What Are Spiritual Gifts?

Spiritual gifts are supernatural abilities given by the Holy Spirit to every believer for building up the church:
- Not natural talents (though God may enhance these)
- Not for personal glory
- Given according to God's wisdom, not our choosing

**Key Lists:**
- Romans 12:6-8 — Prophecy, service, teaching, exhortation, giving, leadership, mercy
- 1 Corinthians 12:8-10 — Wisdom, knowledge, faith, healing, miracles, prophecy, discernment, tongues, interpretation
- Ephesians 4:11 — Apostles, prophets, evangelists, pastors, teachers

---

### Gifts and the Mission

Gifts exist for one purpose: "For the perfecting of the saints, for the work of the ministry, for the edifying of the body of Christ" (Ephesians 4:12).

**Not:**
- Spiritual status symbols
- Excuses for pride
- Reasons for division

**But:**
- Tools for service
- Expressions of Christ's love through us
- Evidence of the Spirit's presence

The Pattern: In the sanctuary, different workers had different roles—priests, Levites, musicians, gatekeepers—all serving the same Lord in the same place.

**Key Passages:**
- 1 Peter 4:10 — "As every man hath received the gift, even so minister the same one to another"
- 1 Corinthians 12:11 — "All these worketh that one and the selfsame Spirit, dividing to every man severally as he will"

---

### Discussion Questions
1. What spiritual gifts do you sense God has given you?
2. How can we avoid comparing gifts or feeling inferior/superior?
3. What happens when Christians hide or neglect their gifts?

**Memory Verse:** "As every man hath received the gift, even so minister the same one to another, as good stewards of the manifold grace of God." — 1 Peter 4:10

**Take Home Challenge:** Ask two trusted friends what gift they see in you. Consider how you might use that gift more intentionally this month.`,
  },
  {
    id: 18,
    title: "The Gift of Prophecy",
    summary: "The Spirit of Prophecy is an identifying mark of the remnant",
    content: `## God Still Speaks

**Opening Story: Joseph's Dreams**
A teenager in a coat of many colors dreams of sheaves bowing and stars falling at his feet. His brothers mock. His father wonders. But decades later, those dreams prove true—Joseph stands before his brothers as Egypt's second ruler. "It was not you that sent me hither, but God" (Genesis 45:8).

God has always used prophets to guide His people.

---

### What Is Prophecy?

At its core, prophecy is speaking God's message—whether predicting the future or proclaiming present truth. The prophet doesn't originate the message; they receive and transmit it.

**The Purpose of Prophecy:**
- Warning of danger
- Revealing Christ
- Calling to repentance
- Guiding the church
- Providing comfort and encouragement

---

### The Spirit of Prophecy in the Last Days

Revelation identifies the end-time church as having "the testimony of Jesus," which is "the spirit of prophecy" (Revelation 12:17; 19:10). Joel predicted that in the last days, the Spirit would be poured out, and "your sons and your daughters shall prophesy" (Joel 2:28).

**Testing the Prophets:**
Not every claim to prophecy is genuine. Scripture gives tests:
- Does the message agree with Scripture? (Isaiah 8:20)
- Does it exalt Christ? (1 John 4:2)
- Does it produce good fruit? (Matthew 7:15-20)
- Do predictions come true? (Deuteronomy 18:22)

**The Pattern:** In the sanctuary, the Most Holy Place contained the Ark with God's law—His standard of truth. True prophecy never contradicts that standard.

**Key Passages:**
- Amos 3:7 — "Surely the Lord GOD will do nothing, but he revealeth his secret unto his servants the prophets"
- 1 Thessalonians 5:20-21 — "Despise not prophesyings. Prove all things"
- 2 Peter 1:21 — "Prophecy came not in old time by the will of man: but holy men of God spake as they were moved by the Holy Ghost"

---

### Discussion Questions
1. Why would God continue to give prophetic guidance even after the Bible was completed?
2. How do the biblical tests protect us from deception?
3. What role has prophetic guidance played in your personal faith journey?

**Memory Verse:** "Surely the Lord GOD will do nothing, but he revealeth his secret unto his servants the prophets." — Amos 3:7

**Take Home Challenge:** Study one biblical prophet this week (perhaps Elijah, Daniel, or Jeremiah). Notice how their ministry pointed to Christ and comforted/warned God's people.`,
  },
  {
    id: 19,
    title: "The Law of God",
    summary: "The Ten Commandments as the transcript of God's character",
    content: `## Written in Stone, Written on Hearts

**Opening Story: Sinai's Thunder**
The mountain smokes. Lightning cracks. Trumpets sound. The people tremble at the camp's edge. Then God speaks—His voice alone, no intermediary—ten words, ten commandments, written by His own finger on tablets of stone (Exodus 19-20).

This wasn't a new invention. It was the unveiling of heaven's eternal standard.

---

### The Character of God in Ten Words

The law isn't arbitrary. It reflects who God is:
- "Thou shalt have no other gods" — God alone is worthy
- "Thou shalt not make unto thee any graven image" — God is beyond our crafting
- "Thou shalt not take the name of the LORD thy God in vain" — God's name is holy
- "Remember the sabbath day" — God is Creator and Redeemer
- "Honour thy father and thy mother" — God values relationship and authority
- "Thou shalt not kill" — God is the Author of life
- "Thou shalt not commit adultery" — God is faithful
- "Thou shalt not steal" — God gives generously
- "Thou shalt not bear false witness" — God is truth
- "Thou shalt not covet" — God is sufficient

---

### Law and Grace

The law cannot save—it diagnoses the disease but doesn't provide the cure (Romans 3:20). Grace saves. But grace doesn't abolish the law; it writes it on our hearts (Hebrews 8:10).

**The Pattern:**
- In the outer court — the sacrifice (Christ's blood) covers our sin
- In the holy place — we walk with God in ongoing relationship
- In the Most Holy Place — the law rests inside the Ark, under the mercy seat

Law and mercy meet at the Ark. God's justice and His grace unite there—and at the cross.

**Key Passages:**
- Psalm 19:7 — "The law of the LORD is perfect, converting the soul"
- Matthew 5:17-18 — "Think not that I am come to destroy the law"
- Romans 7:12 — "The law is holy, and the commandment holy, and just, and good"

---

### Discussion Questions
1. How does seeing the law as a reflection of God's character change how we view obedience?
2. What's the difference between legalism and loving obedience?
3. Which commandment most challenges you personally? Why?

**Memory Verse:** "The law of the LORD is perfect, converting the soul: the testimony of the LORD is sure, making wise the simple." — Psalm 19:7

**Take Home Challenge:** Meditate on one commandment each day this week. Ask: What does this reveal about God? How does my life reflect (or resist) this aspect of His character?`,
  },
  {
    id: 20,
    title: "The Sabbath",
    summary: "The seventh day of the week as a memorial of creation and redemption",
    content: `## Rest and Remember

**Opening Story: Eden's First Full Day**
Adam wakes to his first morning. The world is finished—perfect. But instead of putting Adam to work, God invites him to rest. The seventh day isn't a reward for labor completed; it's a gift before any work begins. God blessed the day, sanctified it, and rested—not from weariness but from completion (Genesis 2:1-3).

The Sabbath was Eden's first gift.

---

### What the Sabbath Remembers

**Creation:** "For in six days the LORD made heaven and earth... and rested the seventh day: wherefore the LORD blessed the sabbath day, and hallowed it" (Exodus 20:11). The Sabbath ties us to our Maker.

**Redemption:** "Remember that thou wast a servant in the land of Egypt, and that the LORD thy God brought thee out" (Deuteronomy 5:15). The Sabbath celebrates deliverance from bondage—both physical and spiritual.

**Future Rest:** "There remaineth therefore a rest to the people of God" (Hebrews 4:9). The weekly Sabbath points to the eternal rest of the new earth.

---

### The Sabbath and Christ

Jesus is "Lord also of the sabbath" (Mark 2:28). He kept it, taught in synagogues on it, healed on it. His conflicts weren't about Sabbath-keeping but about man-made burdens added to it.

After His death, Jesus rested in the tomb on Sabbath—His work of redemption complete. The disciples "rested the sabbath day according to the commandment" (Luke 23:56).

**The Pattern:** In the sanctuary services, the Sabbath was central—a weekly convocation, a time of sacred assembly. It marked rhythm and relationship with God.

**Key Passages:**
- Genesis 2:2-3 — The Sabbath at creation
- Exodus 20:8-11 — The Sabbath in the commandments
- Isaiah 58:13-14 — "Call the sabbath a delight"

---

### Discussion Questions
1. How does understanding the Sabbath as a gift (not a burden) change how you keep it?
2. In what ways does Sabbath rest point to salvation by grace?
3. How might you make the Sabbath more of a delight in your life?

**Memory Verse:** "Remember the sabbath day, to keep it holy." — Exodus 20:8

**Take Home Challenge:** This Sabbath, intentionally "unplug" from work and worry. Spend extra time with God, family, or nature. Journal how it feels to rest in His finished work.`,
  },
  {
    id: 21,
    title: "Stewardship",
    summary: "We are God's stewards, entrusted with time, opportunities, and possessions",
    content: `## Everything Belongs to Him

**Opening Story: The Talents**
A master entrusts his servants with wealth—five talents, two talents, one. He goes away. The first two trade and double their trust. The third buries his in fear. When the master returns, the faithful hear "Well done." The fearful hears "Wicked and slothful servant" (Matthew 25:14-30).

We don't own—we manage.

---

### What Is Stewardship?

A steward manages what belongs to another. God owns everything: "The earth is the LORD's, and the fulness thereof" (Psalm 24:1). We are trustees, not owners.

**We steward:**
- **Time** — "Redeeming the time, because the days are evil" (Ephesians 5:16)
- **Talents** — Abilities and gifts given for service
- **Treasure** — Resources to advance God's kingdom
- **Temple** — Our bodies as dwelling places of the Spirit

---

### The Tithe and Offerings

Returning tithe (10% of increase) is an act of worship acknowledging God's ownership. "Bring ye all the tithes into the storehouse... and prove me now herewith, saith the LORD of hosts, if I will not open you the windows of heaven" (Malachi 3:10).

Beyond tithe, freewill offerings express gratitude. Giving isn't loss—it's investment in eternity.

**The Pattern:** In ancient Israel, tithes supported the Levites who served at the sanctuary. This pattern continues—those who preach the gospel should live by the gospel (1 Corinthians 9:14).

**Key Passages:**
- 1 Chronicles 29:14 — "Of thine own have we given thee"
- Luke 12:48 — "Unto whomsoever much is given, of him shall be much required"
- 2 Corinthians 9:7 — "God loveth a cheerful giver"

---

### Discussion Questions
1. How does viewing yourself as a steward rather than owner change your relationship with money?
2. What does it mean to steward your time well? Your health?
3. Why do you think God chose percentage-based giving rather than fixed amounts?

**Memory Verse:** "Moreover it is required in stewards, that a man be found faithful." — 1 Corinthians 4:2

**Take Home Challenge:** This week, audit how you spent your time and money. Ask: Did my choices reflect that everything belongs to God?`,
  },
  {
    id: 22,
    title: "Christian Behavior",
    summary: "Called to be a godly people in thought, feeling, and action",
    content: `## Different by Design

**Opening Story: Daniel's Choice**
Babylon. The royal table. Wine, rich meat—foods offered to idols. A teenager named Daniel could have blended in. Instead, "Daniel purposed in his heart that he would not defile himself" (Daniel 1:8). He asked for vegetables and water. Ten days later, he looked healthier than all the others.

Godliness starts with purpose—and shows in practice.

---

### Called to Be Holy

"Be ye holy; for I am holy" (1 Peter 1:16). Holiness isn't about earning salvation—it's about reflecting the character of the One who saved us.

**This affects:**
- What we think — "Whatsoever things are true... think on these things" (Philippians 4:8)
- What we watch and listen to — "I will set no wicked thing before mine eyes" (Psalm 101:3)
- What we wear — Modesty that honors God and respects others
- What we eat — Caring for the body as God's temple
- How we relate — Integrity in speech, honesty in dealings

---

### Freedom and Standards

Christian behavior isn't a list of "don'ts"—it's the fruit of a transformed heart. Love for Christ produces desire to please Him.

**Key principles:**
- Does this glorify God? (1 Corinthians 10:31)
- Does this edify myself and others? (1 Corinthians 10:23)
- Does this enslave me? (1 Corinthians 6:12)
- Does this cause others to stumble? (Romans 14:21)

**The Pattern:** In the sanctuary, everything was done with care and intentionality—nothing casual entered God's presence. Our lives are now the sanctuary where God dwells.

**Key Passages:**
- Romans 12:1-2 — "Present your bodies a living sacrifice... be not conformed to this world"
- 1 Corinthians 6:19-20 — "Your body is the temple of the Holy Ghost"
- Colossians 3:17 — "Whatsoever ye do in word or deed, do all in the name of the Lord Jesus"

---

### Discussion Questions
1. How do we avoid both legalism and lawlessness in Christian living?
2. What cultural practices might need to change when we follow Christ?
3. How does viewing your body as God's temple affect daily choices?

**Memory Verse:** "Whether therefore ye eat, or drink, or whatsoever ye do, do all to the glory of God." — 1 Corinthians 10:31

**Take Home Challenge:** Identify one area of your life where you've been "conforming to the world." Ask God for grace to be transformed in that area this week.`,
  },
  {
    id: 23,
    title: "Marriage and the Family",
    summary: "Marriage instituted in Eden as a lifelong union",
    content: `## The First Wedding

**Opening Story: Eve's Presentation**
Adam names every creature—lion, eagle, elephant—but finds no companion fit for him. God casts a deep sleep, opens his side, builds a woman from his rib. Adam wakes and sees her: "This is now bone of my bones, and flesh of my flesh" (Genesis 2:23). God Himself performs the first wedding.

Marriage began in perfection—God's design for human flourishing.

---

### God's Design for Marriage

"Therefore shall a man leave his father and his mother, and shall cleave unto his wife: and they shall be one flesh" (Genesis 2:24).

**Marriage is:**
- Between a man and a woman
- A leaving and cleaving
- A lifelong covenant (not a contract)
- A reflection of Christ and the church (Ephesians 5:31-32)

**Marriage pictures:**
- Christ's sacrificial love (husbands, love as Christ loved the church)
- The church's responsive devotion (wives, respect as the church honors Christ)
- Mutual submission in love

---

### The Family as Sanctuary

The home is designed to be a little sanctuary—a place where God is honored, where children learn truth, where love is practiced.

**The Pattern:** As the sanctuary had order, beauty, and intentional design, so the Christian home should reflect peace, structure, and purpose. Parents are priests in the home, interceding for their children and teaching them God's ways.

**Key Passages:**
- Malachi 2:14-15 — "She is thy companion, and the wife of thy covenant"
- Ephesians 6:1-4 — Instructions for parents and children
- Proverbs 22:6 — "Train up a child in the way he should go"

---

### Discussion Questions
1. How does understanding marriage as a picture of Christ and the church elevate our view of it?
2. What challenges do modern families face that require intentional spiritual leadership?
3. How can single Christians build "family" in the church community?

**Memory Verse:** "Therefore shall a man leave his father and his mother, and shall cleave unto his wife: and they shall be one flesh." — Genesis 2:24

**Take Home Challenge:** If married, do something intentional this week to strengthen your covenant—a date, a letter, a renewed commitment. If single, support a family in your church with encouragement or practical help.`,
  },
  {
    id: 24,
    title: "Christ's Ministry in the Heavenly Sanctuary",
    summary: "The sanctuary in heaven and Christ's ministration",
    content: `## Our High Priest Lives

**Opening Story: The Torn Veil**
The moment Jesus died, the temple veil—thick as a man's hand, sixty feet high—ripped from top to bottom. Not from bottom up (human effort) but top down (divine action). The way into God's presence was open (Matthew 27:51).

What the earthly veil hid, Christ's death revealed.

---

### The Sanctuary in Heaven

The earthly sanctuary was a "copy and shadow of the heavenly things" (Hebrews 8:5). Moses was shown the pattern on the mountain. Every piece pointed beyond itself to a greater reality.

**The heavenly sanctuary reveals:**
- Christ as our Sacrifice (altar)
- Christ as our Intercessor (incense altar)
- Christ as the Light of the world (lampstand)
- Christ as the Bread of Life (table)
- Christ as our High Priest (Most Holy Place)

---

### Two Phases of Ministry

In the earthly system:
- **Daily** — Priests ministered in the holy place, transferring confessed sins
- **Yearly** — On the Day of Atonement, the high priest entered the Most Holy to cleanse the sanctuary

Christ's ministry follows this pattern:
- **Since His ascension** — Interceding at the Father's right hand
- **Since 1844** — The pre-advent judgment, the cleansing of the heavenly sanctuary (Daniel 8:14)

This isn't God checking if you've been good enough—it's the vindication of all who trust in Christ.

**Key Passages:**
- Hebrews 8:1-2 — "We have such an high priest... a minister of the sanctuary"
- Hebrews 9:24 — "Christ is... entered into heaven itself, now to appear in the presence of God for us"
- Daniel 8:14 — "Unto two thousand and three hundred days; then shall the sanctuary be cleansed"

---

### Discussion Questions
1. How does knowing Jesus is your High Priest right now change how you pray?
2. What comfort does the sanctuary message offer about God's fairness and justice?
3. Why is the heavenly sanctuary central to understanding the end times?

**Memory Verse:** "Now of the things which we have spoken this is the sum: We have such an high priest, who is set on the right hand of the throne of the Majesty in the heavens." — Hebrews 8:1

**Take Home Challenge:** Study Hebrews 9 this week. Draw or diagram the earthly sanctuary and label how each element points to Christ.`,
  },
  {
    id: 25,
    title: "The Second Coming of Christ",
    summary: "Christ's return as the blessed hope of the church",
    content: `## He's Coming Back

**Opening Story: The Two Men in White**
The disciples stare skyward. Jesus rises through the clouds—gone. They stand frozen until two angels appear: "This same Jesus, which is taken up from you into heaven, shall so come in like manner as ye have seen him go" (Acts 1:11).

He left visibly. He'll return visibly. The promise is personal: *this same Jesus*.

---

### How He Will Come

Not secretly. Not spiritually. Bodily, gloriously, unmistakably.

**"Every eye shall see him"** (Revelation 1:7)
**"As the lightning cometh out of the east"** (Matthew 24:27)
**"With a shout, with the voice of the archangel, and with the trump of God"** (1 Thessalonians 4:16)

The dead in Christ will rise. The living saints will be caught up together with them. We will meet the Lord in the air—and so shall we ever be with the Lord.

---

### The Blessed Hope

This isn't distant doctrine—it's present hope. Paul calls it "that blessed hope, and the glorious appearing of the great God and our Saviour Jesus Christ" (Titus 2:13).

**The Pattern:** In the sanctuary, the Day of Atonement was the climax of the year—the day of cleansing, judgment, and restoration. Christ's return is the cosmic Day of Atonement—when all things are made right.

**Signs of His Coming:**
- Wars and rumors of wars
- Famines, pestilences, earthquakes
- Gospel preached to all nations
- Lawlessness increasing
- Love growing cold
- The rise of deception

But the key sign? "And then shall they see the Son of man coming in the clouds with power and great glory" (Luke 21:27).

**Key Passages:**
- John 14:1-3 — "I will come again, and receive you unto myself"
- Matthew 24:30 — "Then shall appear the sign of the Son of man in heaven"
- Revelation 22:20 — "Surely I come quickly. Amen. Even so, come, Lord Jesus."

---

### Discussion Questions
1. How does the promise of Christ's return affect how you live today?
2. Why is it important that His coming is visible, audible, and bodily?
3. What would you want to be doing when Jesus returns?

**Memory Verse:** "And if I go and prepare a place for you, I will come again, and receive you unto myself; that where I am, there ye may be also." — John 14:3

**Take Home Challenge:** Memorize John 14:1-3 this week. Each night, fall asleep with this promise: "I will come again."`,
  },
  {
    id: 26,
    title: "Death and Resurrection",
    summary: "The state of the dead and the resurrection at Christ's return",
    content: `## Asleep Until Morning

**Opening Story: Lazarus Awakes**
Four days in the tomb. Martha weeps: "Lord, if thou hadst been here, my brother had not died." Jesus answers: "I am the resurrection, and the life." He stands at the grave's mouth and shouts: "Lazarus, come forth!" And the dead man walks out (John 11).

Death is not the end—it's a sleep, and Christ holds the alarm clock.

---

### What Happens at Death?

Scripture describes death as sleep—unconscious, peaceful, awaiting the resurrection.

**"The dead know not any thing"** (Ecclesiastes 9:5)
**"His breath goeth forth, he returneth to his earth; in that very day his thoughts perish"** (Psalm 146:4)
**"Many of them that sleep in the dust of the earth shall awake"** (Daniel 12:2)

When Jesus said Lazarus was "sleeping," the disciples thought He meant literal rest. Jesus clarified: "Lazarus is dead" (John 11:11-14). Death is like sleep—no consciousness of time, no ongoing activity—until the resurrection.

---

### The Hope of Resurrection

Death entered through Adam; resurrection comes through Christ. "For as in Adam all die, even so in Christ shall all be made alive" (1 Corinthians 15:22).

**At Christ's return:**
- The righteous dead are raised imperishable
- The living righteous are transformed
- Together we're caught up to meet the Lord
- Death is swallowed up in victory

**The Pattern:** In the sanctuary, the Day of Atonement was a day of judgment and vindication. The resurrection is God's final vindication of those who trusted in Christ.

**Key Passages:**
- John 5:28-29 — "All that are in the graves shall hear his voice, and shall come forth"
- 1 Corinthians 15:51-55 — "We shall all be changed... death is swallowed up in victory"
- 1 Thessalonians 4:16-17 — "The dead in Christ shall rise first"

---

### Discussion Questions
1. How does the "soul sleep" understanding bring comfort compared to other views of death?
2. Why do you think God describes death as "sleep" rather than using frightening imagery?
3. How does resurrection hope shape how we grieve?

**Memory Verse:** "For the Lord himself shall descend from heaven with a shout, with the voice of the archangel, and with the trump of God: and the dead in Christ shall rise first." — 1 Thessalonians 4:16

**Take Home Challenge:** If you've lost someone dear, write a letter to them as if you'll hand it to them at the resurrection. Express your hope and gratitude.`,
  },
  {
    id: 27,
    title: "The Millennium and the End of Sin",
    summary: "The 1000 years and the final eradication of evil",
    content: `## A Thousand Years of Rest

**Opening Story: The Saints Sit in Judgment**
John sees thrones. "Judgment was given unto them." The righteous reign with Christ for a thousand years. Satan is bound, unable to deceive nations. The wicked dead remain in their graves. Heaven becomes a courtroom—and the saints review the books (Revelation 20:4-6).

The millennium isn't paradise on earth—it's heaven's audit of justice.

---

### What Happens During the 1000 Years?

**In Heaven:**
- The righteous are with Christ
- They participate in judgment—reviewing why some were saved and others lost
- Questions are answered; God's justice is vindicated

**On Earth:**
- Desolate and broken ("without form, and void" like creation before life)
- Satan and his angels are "bound"—not by chains but by circumstance; no one left to deceive
- The wicked remain dead

---

### After the Millennium

At the end of the 1000 years:
- The Holy City, New Jerusalem, descends
- The wicked dead are resurrected
- Satan deceives them one final time, leading an attack on the city
- Fire from God devours them—this is the second death
- Sin and sinners are no more

**The Pattern:** The scapegoat on the Day of Atonement was led into the wilderness, symbolizing Satan bearing ultimate responsibility. After the millennium, Satan receives his final punishment—not to purify him but to end evil forever.

**Key Passages:**
- Revelation 20:1-6 — The millennium and the saints' reign
- Revelation 20:7-15 — The final destruction of sin
- Malachi 4:1-3 — "The day cometh, that shall burn as an oven"

---

### Discussion Questions
1. Why would God include the saints in reviewing the judgment?
2. How does the millennium answer questions about God's justice and fairness?
3. What comfort does the final end of sin bring you?

**Memory Verse:** "And I saw thrones, and they sat upon them, and judgment was given unto them." — Revelation 20:4

**Take Home Challenge:** Study Revelation 20 carefully this week. Make a timeline of the events: Second Coming → Millennium → New Jerusalem → Final Judgment → New Earth.`,
  },
  {
    id: 28,
    title: "The New Earth",
    summary: "God will make all things new—the eternal home of the redeemed",
    content: `## Home at Last

**Opening Story: No More Tears**
John strains to see. A new heaven, a new earth, a city descending like a bride adorned. Then a voice from the throne: "Behold, I make all things new." God Himself will dwell with His people. "He shall wipe away all tears from their eyes; and there shall be no more death, neither sorrow, nor crying, neither shall there be any more pain: for the former things are passed away" (Revelation 21:3-4).

This is where the story ends—and begins again forever.

---

### What the New Earth Will Be

Not clouds and harps—but a real, physical, tangible world:
- **Building homes and inhabiting them** (Isaiah 65:21)
- **Planting vineyards and eating the fruit** (Isaiah 65:21)
- **The wolf and the lamb feeding together** (Isaiah 65:25)
- **Walking with God face to face** (Revelation 22:4)

The curse is undone. Creation is restored. Eden returns—but better, because now it's sealed against sin's return.

---

### The City of God

The New Jerusalem:
- Walls of jasper, gates of pearl, streets of gold
- The river of life flowing from the throne
- The tree of life bearing twelve manner of fruits
- No temple needed—"the Lord God Almighty and the Lamb are the temple" (Revelation 21:22)
- No sun or moon needed—the glory of God illuminates all

**The Pattern:** The sanctuary journey ends where it began—in God's immediate presence. The whole earth becomes the sanctuary. The whole people become priests. The whole creation reflects His glory.

**Key Passages:**
- Revelation 21:1-5 — "Behold, I make all things new"
- Isaiah 65:17-25 — A picture of the new earth
- Revelation 22:1-5 — The river of life and the tree of life

---

### Discussion Questions
1. What do you most look forward to about the new earth?
2. How does the promise of "no more tears" comfort you in present suffering?
3. What would it mean to live *now* in light of eternity?

**Memory Verse:** "And God shall wipe away all tears from their eyes; and there shall be no more death, neither sorrow, nor crying, neither shall there be any more pain: for the former things are passed away." — Revelation 21:4

**Take Home Challenge:** Write a one-page description of what you imagine your first day in the new earth might look like. Who will you meet? What will you see? What will you feel?`,
  },
];

export function TruthSeries({ churchId }: TruthSeriesProps) {
  const { user } = useAuth();
  const [selectedTopic, setSelectedTopic] = useState<typeof TRUTH_SERIES_CONTENT[0] | null>(null);
  const [completedTopics, setCompletedTopics] = useState<number[]>([]);

  const handleSelectTopic = (topic: typeof TRUTH_SERIES_CONTENT[0]) => {
    setSelectedTopic(topic);
  };

  const handleMarkComplete = () => {
    if (selectedTopic && !completedTopics.includes(selectedTopic.id)) {
      setCompletedTopics([...completedTopics, selectedTopic.id]);
      toast.success("Topic marked as complete!");
    }
  };

  const progress = (completedTopics.length / TRUTH_SERIES_CONTENT.length) * 100;

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
            A journey through 28 foundational truths with Christ at the center
          </p>
        </div>
        <Badge variant="outline" className="text-primary border-primary">
          <Sparkles className="h-3 w-3 mr-1" />
          28 Studies
        </Badge>
      </div>

      {/* Progress Bar */}
      <Card variant="glass" className="bg-card/80">
        <CardContent className="py-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-foreground">Journey Progress</span>
            <span className="text-sm text-foreground/70">{completedTopics.length} / {TRUTH_SERIES_CONTENT.length} topics</span>
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
            <CardDescription className="text-foreground/70">
              Select a topic to begin your study
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[500px] pr-4">
              <div className="space-y-2">
                {TRUTH_SERIES_CONTENT.map((topic) => {
                  const isCompleted = completedTopics.includes(topic.id);
                  const isSelected = selectedTopic?.id === topic.id;
                  
                  return (
                    <button
                      key={topic.id}
                      onClick={() => handleSelectTopic(topic)}
                      className={`w-full text-left p-3 rounded-lg transition-all ${
                        isSelected 
                          ? "bg-primary/20 border border-primary/50" 
                          : "bg-background/50 border border-border/50 hover:bg-background/80 hover:border-primary/30"
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                          isCompleted 
                            ? "bg-green-500/20 text-green-400" 
                            : "bg-primary/20 text-primary"
                        }`}>
                          {isCompleted ? <Check className="h-4 w-4" /> : topic.id}
                        </div>
                        <div className="flex-1">
                          <h4 className="font-medium text-sm text-foreground">{topic.title}</h4>
                          <p className="text-xs text-foreground/60 mt-0.5 line-clamp-1">{topic.summary}</p>
                        </div>
                        <ChevronRight className="h-4 w-4 text-foreground/40 mt-0.5" />
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
            {!selectedTopic && (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <GraduationCap className="h-16 w-16 text-primary/30 mb-4" />
                <h3 className="text-lg font-medium text-foreground mb-2">Begin Your Journey</h3>
                <p className="text-foreground/60 max-w-md">
                  Select a topic from the list to explore Christ-centered Bible studies 
                  on the foundational beliefs of Scripture.
                </p>
              </div>
            )}

            {selectedTopic && (
              <div className="space-y-6">
                <ScrollArea className="h-[500px] pr-4">
                  <div className="prose prose-sm dark:prose-invert max-w-none">
                    {selectedTopic.content.split('\n').map((line, i) => {
                      if (line.startsWith('## ')) {
                        return <h2 key={i} className="text-xl font-bold mt-6 mb-3 text-foreground">{line.replace('## ', '')}</h2>;
                      } else if (line.startsWith('### ')) {
                        return <h3 key={i} className="text-lg font-semibold mt-4 mb-2 text-foreground">{line.replace('### ', '')}</h3>;
                      } else if (line.startsWith('**') && line.endsWith('**')) {
                        return <p key={i} className="font-bold text-foreground">{line.replace(/\*\*/g, '')}</p>;
                      } else if (line.startsWith('- ')) {
                        return <li key={i} className="ml-4 text-foreground/80">{line.replace('- ', '')}</li>;
                      } else if (line.startsWith('---')) {
                        return <hr key={i} className="my-4 border-border/50" />;
                      } else if (line.trim() === '') {
                        return <br key={i} />;
                      } else {
                        return <p key={i} className="text-foreground/80 mb-2">{line}</p>;
                      }
                    })}
                  </div>
                </ScrollArea>

                {/* Actions */}
                <div className="flex gap-3 pt-4 border-t border-border/50">
                  <Button 
                    onClick={handleMarkComplete} 
                    variant="default" 
                    className="flex-1"
                    disabled={completedTopics.includes(selectedTopic.id)}
                  >
                    <Check className="h-4 w-4 mr-2" />
                    {completedTopics.includes(selectedTopic.id) ? 'Completed' : 'Mark Complete'}
                  </Button>
                  {selectedTopic.id < TRUTH_SERIES_CONTENT.length && (
                    <Button 
                      onClick={() => handleSelectTopic(TRUTH_SERIES_CONTENT[selectedTopic.id])} 
                      variant="outline"
                    >
                      Next Topic
                      <ChevronRight className="h-4 w-4 ml-2" />
                    </Button>
                  )}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
