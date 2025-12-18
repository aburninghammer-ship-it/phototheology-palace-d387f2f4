import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import ReactMarkdown from "react-markdown";
import { 
  Clock, CheckCircle, Play, ChevronRight, Lock,
  BookOpen, Users, Heart, Target, ArrowLeft
} from "lucide-react";

interface LeaderTrainingCourseProps {
  churchId: string;
  progressData: any;
  onProgressUpdate: () => void;
}

// Full 4-week course content with daily sessions
const COURSE_CONTENT = {
  week1: {
    title: "Vision & Method",
    icon: Target,
    description: "Understand why Living Manna uses Phototheology and your role as a leader",
    days: [
      {
        day: 1,
        title: "Why Phototheology?",
        duration: "15 min",
        content: `# Day 1: Why Phototheology?

## Opening Reflection
*"Thy word is a lamp unto my feet, and a light unto my path." — Psalm 119:105*

Welcome to your leadership journey! Today we explore **why** Living Manna uses the Phototheology method.

## The Problem We're Solving
Many believers struggle with:
- **Scattered study** — verses memorized without connection
- **Head knowledge** — information without transformation
- **Shallow roots** — unable to explain their faith to others

## The Phototheology Solution
Phototheology is not just a method — it's a **mental architecture** for storing Scripture as images, patterns, and structures.

### The Palace Metaphor
Think of your mind as an 8-floor palace:
- **Floor 1**: Furnishing (stories, images, gems)
- **Floor 2**: Investigation (detective work)
- **Floor 3**: Freestyle (daily connections)
- **Floor 4**: Next Level (Christ-centered depth)
- **Floor 5**: Vision (prophecy & sanctuary)
- **Floor 6**: Three Heavens (cosmic context)
- **Floor 7**: Spiritual (heart engagement)
- **Floor 8**: Mastery (reflexive thought)

## Why This Matters for Leaders
As a small group leader, you'll guide others through this palace. You don't need to be an expert — you need to be a **faithful guide** who points to Christ in every text.

## Today's Challenge
Memorize the 8 floors by creating a mental image of climbing a palace. Tomorrow, we'll explore text-first groups.

---
*"The goal is not 'knowing Phototheology' but knowing Christ."*`
      },
      {
        day: 2,
        title: "Why Text-First Groups",
        duration: "15 min",
        content: `# Day 2: Why Text-First Groups

## Opening Reflection
*"All scripture is given by inspiration of God, and is profitable for doctrine, for reproof, for correction, for instruction in righteousness." — 2 Timothy 3:16*

## The Shift We're Making
Traditional small groups often become:
- Opinion-sharing sessions
- Advice circles
- Social gatherings without depth

**Text-first groups** are different. We let Scripture lead.

## What "Text-First" Means
1. **The Bible speaks first** — before our thoughts
2. **Questions probe the text** — not just feelings
3. **Christ is the center** — every passage reveals Him
4. **Application flows from truth** — not the reverse

## The Leader's Restraint
Your job is **not** to:
- Give all the answers
- Fill every silence
- Correct every wrong opinion immediately

Your job **is** to:
- Point back to the text
- Ask deeper questions
- Create space for the Spirit to teach

## Today's Challenge
Write down 3 questions about a Bible passage that point **back to the text** rather than away from it.

---
*"The Word of God is living and active — let it do the work."*`
      },
      {
        day: 3,
        title: "Role of Leader vs App vs Scripture",
        duration: "15 min",
        content: `# Day 3: Role of Leader vs App vs Scripture

## Opening Reflection
*"When he, the Spirit of truth, is come, he will guide you into all truth." — John 16:13*

## The Triangle of Discipleship
In Living Manna, three elements work together:

### 1. Scripture (The Authority)
- The Bible is the final word
- Every study points back to the text
- We don't add to or subtract from God's Word

### 2. The App (The Tool)
- Provides structure and resources
- Offers AI assistance (Jeeves) for insights
- Tracks progress and generates studies
- **But it's just a tool — not the teacher**

### 3. The Leader (The Guide)
- Creates a safe space for exploration
- Asks questions that provoke thought
- Models humility and hunger for truth
- Shepherds hearts, not just heads

## The Beautiful Balance
- **Scripture** has the authority
- **You** have the relationship
- **The app** has the resources
- **The Spirit** has the power

## Today's Challenge
Identify which of these three (Scripture, App, Leader) you tend to over-rely on. How can you create better balance?

---
*"Apart from me you can do nothing." — Jesus (John 15:5)*`
      },
      {
        day: 4,
        title: "The Heart of a Leader",
        duration: "15 min",
        content: `# Day 4: The Heart of a Leader

## Opening Reflection
*"Feed my sheep." — John 21:17*

## Leadership Is Shepherding
Jesus asked Peter three times: "Do you love me?" Each time, the call was the same: **Feed my sheep.**

## The Four Marks of a Healthy Leader

### 1. Hunger
A leader who isn't learning can't lead others to learn. Stay hungry for the Word.

### 2. Humility
"I don't know, but let's find out together" is a powerful phrase.

### 3. Heart
People don't care what you know until they know that you care. Pray for your group by name.

### 4. Habit
Consistency builds trust. Show up prepared. Show up on time. Show up prayerfully.

## Self-Assessment
Rate yourself (1-5) on each mark:
- Hunger: ___
- Humility: ___
- Heart: ___
- Habit: ___

## Today's Challenge
Choose one group member and pray for them specifically by name for the next week.

---
*"He must increase, but I must decrease." — John 3:30*`
      },
      {
        day: 5,
        title: "Understanding Your Group Members",
        duration: "15 min",
        content: `# Day 5: Understanding Your Group Members

## Opening Reflection
*"To the weak became I as weak, that I might gain the weak." — 1 Corinthians 9:22*

## People Come with Different Needs
Your group will have a mix of:

### The Seeker
- Curious but not committed
- Needs patience and welcome

### The New Believer
- Excited but lacks foundation
- Needs discipleship basics

### The Mature Member
- Deep in the Word already
- Needs challenge and service

### The Struggling Saint
- Knows truth but battles sin
- Needs grace and accountability

### The Wounded One
- Hurt by church or life
- Needs safety and trust

## The One Thing They All Need
**Christ.** Every type of person needs to see Jesus in the Word.

## Today's Challenge
Think of someone who fits each category. How would you adjust your approach?

---
*"A bruised reed shall he not break." — Isaiah 42:3*`
      },
      {
        day: 6,
        title: "The Quarterly & Weekly Rhythm",
        duration: "15 min",
        content: `# Day 6: The Quarterly & Weekly Rhythm

## Opening Reflection
*"To every thing there is a season." — Ecclesiastes 3:1*

## The Living Manna Rhythm

### Quarterly Flow
- **Sabbath School Quarterly** provides the theme
- 13 weeks per quarter
- The app auto-loads the quarterly content

### Weekly Group Flow
1. **Sunday-Thursday**: Members engage daily lessons
2. **Friday/Sabbath**: Group meets to discuss
3. **Leader**: Prepares 2-3 key discussion points

### Your Weekly Prep Checklist
- [ ] Read the week's lesson in full
- [ ] Note 2-3 passages that stood out
- [ ] Prepare opening question
- [ ] Pray for each member by name
- [ ] Arrive 10 minutes early

## The Power of Consistency
Groups that meet consistently build deeper trust and see greater growth.

## Today's Challenge
Block out your weekly prep time on your calendar now.

---
*"Let all things be done decently and in order." — 1 Corinthians 14:40*`
      },
      {
        day: 7,
        title: "Week 1 Review & Reflection",
        duration: "20 min",
        content: `# Day 7: Week 1 Review & Reflection

## What We've Covered This Week
1. **Why Phototheology** — The 8-floor palace
2. **Text-First Groups** — Letting Scripture lead
3. **Your Role** — Guide, not expert
4. **Heart of a Leader** — Hunger, humility, heart, habit
5. **Understanding Members** — Different people, same Christ
6. **Weekly Rhythm** — Structure creates freedom

## Week 1 Assessment

### Knowledge Check
1. How many floors are in the Phototheology Palace?
2. What does "text-first" mean?
3. What are the 4 H's of a healthy leader?

### Heart Check
- Am I doing this for recognition or for love?
- Am I willing to be a learner alongside my group?

## Looking Ahead
Next week: **How to Run a Group** — the practical mechanics.

## Closing Prayer
*Lord, thank You for calling me to shepherd Your people. Give me hunger, humility, heart, and habit. Prepare me for what's ahead. Amen.*

---
**Congratulations on completing Week 1!** 🎉`
      }
    ]
  },
  week2: {
    title: "How to Run a Group",
    icon: BookOpen,
    description: "Master the practical skills of facilitating engaging Bible study sessions",
    days: [
      {
        day: 1,
        title: "Starting a Session Well",
        duration: "15 min",
        content: `# Day 8: Starting a Session Well

## Opening Reflection
*"Where two or three are gathered together in my name, there am I in the midst of them." — Matthew 18:20*

## The First 10 Minutes Matter

### The Ideal Opening Sequence

1. **Arrive Early (10 min before)**
   - Pray over the space
   - Be the first smile people see

2. **Welcome & Connect (5 min)**
   - Greet each person by name
   - Brief personal check-in

3. **Opening Prayer (2 min)**
   - Invite God's presence
   - Keep it brief but sincere

4. **Ice Breaker (3-5 min)**
   - "What's one thing you're grateful for?"
   - "Share one word that describes your week."

5. **Transition to Study (1 min)**
   - "Let's open our Bibles to..."

## Common Opening Mistakes
❌ Jumping straight into content
❌ Letting one person dominate check-in
❌ Skipping prayer

## Today's Challenge
Write out your opening sequence for your first group session.

---
*"Be ready always." — 1 Peter 3:15*`
      },
      {
        day: 2,
        title: "Using Guided Prompts",
        duration: "15 min",
        content: `# Day 9: Using Guided Prompts

## Opening Reflection
*"Ask, and it shall be given you; seek, and ye shall find." — Matthew 7:7*

## The Art of Asking Questions

### Three Types of Questions

**1. Observation Questions (What does it say?)**
- "What words stand out in this verse?"
- "Who are the characters in this story?"

**2. Interpretation Questions (What does it mean?)**
- "Why do you think Jesus responded this way?"
- "What does this reveal about God's character?"

**3. Application Questions (What does it mean for me?)**
- "How does this truth change how you see yourself?"
- "What step will you take this week?"

## Sample Flow
1. Read passage together
2. Observation: "What do you notice?"
3. Interpretation: "What does this reveal about Christ?"
4. Application: "How will this change your week?"

## Today's Challenge
Take John 15:1-5 and write one question for each level.

---
*"The right question at the right time is a gift."*`
      },
      {
        day: 3,
        title: "Managing Discussion Flow",
        duration: "15 min",
        content: `# Day 10: Managing Discussion Flow

## Opening Reflection
*"A word fitly spoken is like apples of gold in pictures of silver." — Proverbs 25:11*

## The Discussion Spectrum
**Too Quiet** ←――――――→ **Too Loud**

Your job is to guide toward healthy dialogue.

## Techniques for Encouraging Discussion

### When It's Too Quiet
- **Wait longer** — count to 10 silently
- **Invite specifically** — "Sarah, what do you think?"
- **Use pairs** — "Turn to the person next to you"

### When It's Too Active
- **Redirect** — "Great point. Let's hear from someone else."
- **Refocus** — "How does this connect to our passage?"

## The Leader's Toolkit

| Situation | Response |
|-----------|----------|
| Off-topic | "Let's note that and come back to our text." |
| One person dominates | "Thanks. I'd love to hear another perspective." |
| Awkward silence | Wait. Smile. Rephrase. Wait again. |

## Today's Challenge
Think of a time a discussion went off track. How would you handle it now?

---
*"Guide the conversation; don't control it."*`
      },
      {
        day: 4,
        title: "Handling Silence & Dominance",
        duration: "15 min",
        content: `# Day 11: Handling Silence & Dominance

## Opening Reflection
*"Even a fool, when he holdeth his peace, is counted wise." — Proverbs 17:28*

## The Silent One
**Why they're quiet:** Introverted, processing, fear of being wrong, new to the group

**How to help them:**
- Don't force participation
- Use pair discussions first
- Ask them directly (gently)
- Affirm when they do share

## The Dominant One
**Why they dominate:** Passionate, want to help, unaware of impact

**How to help them:**
- Thank them, then redirect
- Set ground rules: "Let's hear from 3 different people"
- Talk privately: "Help me draw others out"
- Give them a role: "You summarize at the end"

## The Leader's Mindset
Both extremes need **grace**. Neither is trying to sabotage your group.

## Today's Challenge
Identify someone you know who fits each extreme. How would you approach them?

---
*"Let every man be swift to hear, slow to speak." — James 1:19*`
      },
      {
        day: 5,
        title: "Navigating Difficult Questions",
        duration: "15 min",
        content: `# Day 12: Navigating Difficult Questions

## Opening Reflection
*"Be ready always to give an answer." — 1 Peter 3:15*

## The Leader's Framework

### 1. Don't Panic
A hard question is a sign of **engagement**.

### 2. Affirm the Question
"That's such an important question."

### 3. Redirect to Scripture
"Let's see what the Bible says."

### 4. Admit What You Don't Know
"I don't have a complete answer, but here's what I do know..."

### 5. Follow Up Later
"Can I get back to you on this?"

## What NOT to Do
❌ Dismiss the question
❌ Give a canned answer
❌ Pretend to know what you don't

## Today's Challenge
Think of one hard question you fear being asked. How would you handle it using this framework?

---
*"Sanctify the Lord God in your hearts: and be ready." — 1 Peter 3:15*`
      },
      {
        day: 6,
        title: "Closing a Session Well",
        duration: "15 min",
        content: `# Day 13: Closing a Session Well

## Opening Reflection
*"And the Lord direct your hearts into the love of God." — 2 Thessalonians 3:5*

## The Ideal Closing Sequence

### 1. Summary (2 min)
- "Here's what we discovered today..."
- Highlight 1-2 key takeaways

### 2. Application Challenge (2 min)
- One specific action for the week
- Make it doable

### 3. Prayer Requests (5 min)
- "What can we pray for this week?"
- Keep a list and follow up!

### 4. Closing Prayer (3 min)
- Thank God for the study
- Pray for specific requests

### 5. Dismissal (2 min)
- Remind of next meeting
- Be the last to leave

## The "One Thing" Method
End with: "If you remember nothing else, remember this: _______________."

## Today's Challenge
Write a closing summary and "one thing" statement for John 15:5.

---
*"End well, and they'll come back."*`
      },
      {
        day: 7,
        title: "Week 2 Review & Simulation",
        duration: "25 min",
        content: `# Day 14: Week 2 Review & Simulation

## What We've Covered This Week
1. **Starting a Session** — First 10 minutes matter
2. **Using Guided Prompts** — Observation, Interpretation, Application
3. **Managing Discussion** — Quiet vs. loud extremes
4. **Handling Silence & Dominance** — Grace for both
5. **Difficult Questions** — Framework for response
6. **Closing a Session** — Anchor, apply, pray

## Skill Simulation
**Scenario**: Your group is studying Matthew 6:25-34 (anxiety). Sarah never talks. John talks too much. Someone asks, "But what if God doesn't provide?"

**Your plan:**
1. Opening question I'd use:
2. How I'd engage Sarah:
3. How I'd redirect John:
4. How I'd handle the hard question:
5. My "one thing" closing:

## Looking Ahead
Next week: **Shepherding & Escalation** — caring for souls beyond the study hour.

## Closing Prayer
*Lord, give me the skills to lead with wisdom and the heart to lead with love. Amen.*

---
**Congratulations on completing Week 2!** 🎉`
      }
    ]
  },
  week3: {
    title: "Shepherding & Escalation",
    icon: Heart,
    description: "Learn to care for souls and recognize when to escalate to pastoral care",
    days: [
      {
        day: 1,
        title: "Identifying Seekers vs Members",
        duration: "15 min",
        content: `# Day 15: Identifying Seekers vs Members

## Opening Reflection
*"Other sheep I have, which are not of this fold." — John 10:16*

## Two Kinds of People in Your Group

### Seekers (Interested but Not Committed)
- Ask basic questions about faith
- Unsure about doctrine
- Testing the waters

**What they need:** Welcome without pressure, simple explanations, patience

### Members (Already Committed)
- Familiar with Scripture
- Active in church life
- Seeking deeper growth

**What they need:** Challenge, opportunities to serve, accountability

## Why This Matters
If you treat a seeker like a member, you'll overwhelm them.
If you treat a member like a seeker, you'll bore them.

## Today's Challenge
Think of someone in your life who is a seeker. How would you invite them to your group?

---
*"I have become all things to all men." — 1 Corinthians 9:22*`
      },
      {
        day: 2,
        title: "When to Escalate",
        duration: "15 min",
        content: `# Day 16: When to Escalate to Bible Worker or Pastor

## Opening Reflection
*"Bear ye one another's burdens." — Galatians 6:2*

## You Can't Do Everything
As a leader, you are a **shepherd**, not a **savior**.

## When to Escalate

### Spiritual Crisis
- Deep doubts about faith
- Serious theological confusion

### Mental Health Concerns
- Signs of depression or anxiety
- Talk of self-harm

### Major Life Crisis
- Death of a loved one
- Divorce or separation

### Doctrinal Questions Beyond Your Knowledge
- Complex prophecy questions
- Church history disputes

## How to Escalate
1. **Don't Wait Too Long**
2. **Ask Permission** — "Would it be okay if I connected you with our pastor?"
3. **Warm Handoff** — Introduce them personally
4. **Follow Up** — Check in after

## Today's Challenge
Find out who your church's Bible worker and pastor are. Save their contact info.

---
*"Two are better than one." — Ecclesiastes 4:9*`
      },
      {
        day: 3,
        title: "Prayer Care Online",
        duration: "15 min",
        content: `# Day 17: Prayer Care Online

## Opening Reflection
*"Pray one for another, that ye may be healed." — James 5:16*

## Principles of Online Prayer Care

### 1. Be Present Digitally
- Check in regularly
- Respond to prayer requests promptly

### 2. Pray Specifically
❌ "Praying for you!"
✅ "Praying right now for your mom's surgery."

### 3. Follow Up
- Set reminders to check in after big events
- "How did the job interview go?"

### 4. Maintain Confidentiality
- What's shared in the group stays in the group
- Ask before sharing requests more widely

## When to Go Private
Some requests shouldn't be shared in the group:
- Marital issues
- Financial struggles
- Confessions of sin

## Today's Challenge
Send a specific prayer message to someone this week. Follow up on a past request.

---
*"The effectual fervent prayer of a righteous man availeth much." — James 5:16*`
      },
      {
        day: 4,
        title: "Boundaries & Safety",
        duration: "15 min",
        content: `# Day 18: Boundaries & Safety

## Opening Reflection
*"Let your moderation be known unto all men." — Philippians 4:5*

## Why Boundaries Matter
Without boundaries, you risk:
- Burnout
- Inappropriate attachments
- Broken trust

## Healthy Boundaries

### Time Boundaries
- You don't have to respond instantly
- Protect your Sabbath and family time

### Emotional Boundaries
- You can't carry everyone's burden
- Your emotional health matters

### Physical/Digital Boundaries
- Meet in appropriate settings
- Be careful with late-night messaging

## Red Flags to Watch
- Someone becoming overly dependent on you
- Conversations that feel inappropriate
- Your own growing attachment

## What to Do If Boundaries Are Crossed
1. Name it (to yourself first)
2. Address it kindly but clearly
3. Involve another leader if needed

## Today's Challenge
Identify one boundary you need to strengthen.

---
*"Above all else, guard your heart." — Proverbs 4:23*`
      },
      {
        day: 5,
        title: "Following Up After Crisis",
        duration: "15 min",
        content: `# Day 19: Following Up After Crisis

## Opening Reflection
*"Comfort ye, comfort ye my people." — Isaiah 40:1*

## The Danger of Disappearing
After a crisis, people often feel alone and forgotten.

**Your follow-up matters more than your initial response.**

## The Follow-Up Framework

### Week 1: Immediate Care
- Daily check-in
- Offer practical help

### Week 2-4: Consistent Presence
- Check in every 2-3 days
- Ask: "How are you really doing?"

### Month 2-3: Ongoing Support
- Weekly check-ins
- Remember significant dates

### Long-Term: Anniversary Care
- Reach out on hard dates
- "I know today is a hard day."

## What to Say (and Not Say)

### Say:
- "I'm here for you."
- "You don't have to be okay."

### Don't Say:
- "Everything happens for a reason."
- "I know how you feel."

## Today's Challenge
Is there someone who went through a crisis recently? Send them a follow-up message today.

---
*"Weep with them that weep." — Romans 12:15*`
      },
      {
        day: 6,
        title: "Nurturing Spiritual Growth",
        duration: "15 min",
        content: `# Day 20: Nurturing Spiritual Growth

## Opening Reflection
*"I have fed you with milk, and not with meat." — 1 Corinthians 3:2*

## Beyond Information
Your job is to **nurture transformation**.

## Signs of Spiritual Growth
- Hungering for the Word on their own
- Applying truth in daily life
- Serving others
- Sharing faith with others

## How to Nurture Growth

### 1. Personalize
Know where each person is on their journey.

### 2. Challenge
Don't let people stay comfortable.

### 3. Celebrate
Notice and affirm growth.

### 4. Model
Let them see your own struggles and growth.

### 5. Delegate
Give people ownership.

## The Discipleship Pathway
1. **Belong** → Feel welcomed
2. **Believe** → Understand truth
3. **Become** → Be transformed
4. **Build** → Serve and lead others

## Today's Challenge
Identify one person. Where are they on the pathway? What can you do to move them forward?

---
*"Grow in grace, and in the knowledge of our Lord." — 2 Peter 3:18*`
      },
      {
        day: 7,
        title: "Week 3 Review & Case Studies",
        duration: "25 min",
        content: `# Day 21: Week 3 Review & Case Studies

## What We've Covered This Week
1. **Seekers vs Members** — Adapt your approach
2. **Escalation** — Know when to get help
3. **Online Prayer Care** — Digital shepherding
4. **Boundaries** — Protect yourself and others
5. **Crisis Follow-Up** — Long-term presence
6. **Nurturing Growth** — Beyond information

## Case Study Practice

### Case 1: The Doubting Member
Maria says she's not sure she believes in God anymore. What do you do?

### Case 2: The Overly Attached Seeker
Tom texts you 10+ times a day. What do you do?

### Case 3: The Crisis Call
A member calls crying — their spouse asked for a divorce. What do you do?

### Case 4: The Stuck Member
Rachel has been in your group for 2 years but doesn't seem to be growing. What do you do?

## Looking Ahead
Next week: **Evangelism Through Groups** — reaching the lost through community.

## Closing Prayer
*Lord, give me a shepherd's heart. Help me care for souls without losing my own. Amen.*

---
**Congratulations on completing Week 3!** 🎉`
      }
    ]
  },
  week4: {
    title: "Evangelism Through Groups",
    icon: Users,
    description: "Learn to reach seekers and transition them from curiosity to conviction",
    days: [
      {
        day: 1,
        title: "Inviting Guests",
        duration: "15 min",
        content: `# Day 22: Inviting Guests

## Opening Reflection
*"Come and see." — John 1:46*

## The Power of Invitation
Most people come to faith through **relationship**, not advertising.

## Who to Invite
- Neighbors who seem open
- Work colleagues with questions
- Friends going through hard times

## How to Invite

### The Simple Formula
1. **Mention casually**: "I'm part of a group that studies the Bible."
2. **Share a benefit**: "It's helped me find peace."
3. **Extend invitation**: "Would you like to come check it out?"
4. **Lower the barrier**: "No pressure. Just come once."

## What Stops Us From Inviting
- Fear of rejection
- Worry about "pushing religion"
- Assuming they'll say no

**Reality**: Most people are honored to be invited.

## Today's Challenge
Write down 3 names of people you could invite. Pray for an opportunity.

---
*"Follow me, and I will make you fishers of men." — Matthew 4:19*`
      },
      {
        day: 2,
        title: "Hosting Seekers Without Pressure",
        duration: "15 min",
        content: `# Day 23: Hosting Seekers Without Pressure

## Opening Reflection
*"A bruised reed shall he not break." — Matthew 12:20*

## The Seeker's Fear
When a seeker comes, they may fear being judged, embarrassed, or pressured.

Your job: **Remove those fears.**

## Creating a Safe Space

### Before They Arrive
- Tell the group to be welcoming, not overwhelming
- Plan a lighter study that week

### When They Arrive
- Greet them warmly by name
- Don't make them the center of attention

### During the Study
- Explain any terms you use
- Don't call on them to read aloud

### After the Study
- Thank them for coming
- Don't ask for commitment
- Follow up within 24 hours

## What NOT to Do
❌ Ask probing questions about their beliefs
❌ Debate their views
❌ Push them to pray or share

## The Long Game
Seekers rarely convert after one visit. Think **months**, not minutes.

## Today's Challenge
Imagine a seeker coming to your group. What would make them feel safe?

---
*"Let your speech be always with grace." — Colossians 4:6*`
      },
      {
        day: 3,
        title: "Transitioning Curiosity to Conviction",
        duration: "15 min",
        content: `# Day 24: Transitioning from Curiosity to Conviction

## Opening Reflection
*"Faith cometh by hearing, and hearing by the word of God." — Romans 10:17*

## The Journey from Curious to Committed

1. **Curiosity** → "What is this about?"
2. **Interest** → "This is interesting."
3. **Conviction** → "This is true."
4. **Decision** → "I want to follow Jesus."
5. **Commitment** → "I'm all in."

## Your Role at Each Stage

### Curiosity → Interest
- Answer questions patiently
- Share your story

### Interest → Conviction
- Study Scripture consistently
- Let the Spirit do the convincing

### Conviction → Decision
- Ask: "What's holding you back?"
- Offer Bible studies

### Decision → Commitment
- Celebrate the decision
- Continue discipleship

## What You Don't Do
You don't create conviction — the **Holy Spirit** does.

## Today's Challenge
Think of a seeker you know. Where are they on the journey? What's one thing you can do?

---
*"I have planted, Apollos watered; but God gave the increase." — 1 Corinthians 3:6*`
      },
      {
        day: 4,
        title: "Answering Seeker Questions",
        duration: "15 min",
        content: `# Day 25: Answering Seeker Questions

## Opening Reflection
*"Sanctify the Lord God in your hearts: and be ready always to give an answer." — 1 Peter 3:15*

## Common Seeker Questions

### "Why should I believe the Bible?"
- Point to prophecy fulfillment
- Share how it's changed your life

### "What makes Christianity different?"
- Grace, not works
- Relationship, not religion

### "Why does God allow suffering?"
- Free will and sin's consequences
- God suffers with us (the cross)

### "What about other religions?"
- Point to Jesus' unique claims
- Invite comparison, not condemnation

## The "I Don't Know" Power
It's okay to say:
- "Let me study that and get back to you."
- "I've wrestled with that too."
- "I don't have a perfect answer, but I trust Jesus."

## The Posture of Answering
- **Humility**: "I'm still learning too."
- **Gentleness**: No defensiveness.
- **Clarity**: Simple, not simplistic.

## Today's Challenge
Pick one common question and write out your 2-minute answer.

---
*"Let your light so shine before men." — Matthew 5:16*`
      },
      {
        day: 5,
        title: "Connecting Seekers to the Church",
        duration: "15 min",
        content: `# Day 26: Connecting Seekers to the Church

## Opening Reflection
*"Not forsaking the assembling of ourselves together." — Hebrews 10:25*

## The Small Group Is a Bridge
Your group is not the destination — it's a **bridge** to the wider church.

## When to Invite to Church
Signs they might be ready:
- Consistent attendance at your group
- Asking about "your church"
- Wanting to meet more people

## How to Invite
- **Accompany them**: "I'll save you a seat."
- **Prepare them**: "Here's what to expect..."
- **Introduce them**: Walk them to friendly people
- **Follow up**: "What did you think?"

## The Goal
A seeker should feel like they **belong** before they believe everything.

## Today's Challenge
Think about your church. What would a first-time visitor experience?

---
*"They continued steadfastly in the apostles' doctrine and fellowship." — Acts 2:42*`
      },
      {
        day: 6,
        title: "Multiplying Your Group",
        duration: "15 min",
        content: `# Day 27: Multiplying Your Group

## Opening Reflection
*"The things that thou hast heard of me among many witnesses, the same commit thou to faithful men." — 2 Timothy 2:2*

## The Vision of Multiplication
The goal is not one big group forever. The goal is **multiplication**.

## Signs Your Group Is Ready
- Consistent attendance of 10+ people
- Potential leaders emerging
- Hunger for more groups

## How to Multiply

### 1. Identify Potential Leaders
Look for hunger, heart, humility, reliability.

### 2. Invest in Them
Invite them to co-lead. Give feedback.

### 3. Launch Them Out
Send 2-3 members with them. Stay connected.

## The Math of Multiplication
- Year 1: 2 groups (16 people)
- Year 2: 4 groups (32 people)
- Year 5: 32 groups (256 people)

**Multiplication > Addition**

## Your Legacy
Your success is measured by **who you raise up**, not how long you lead.

## Today's Challenge
Is there someone who could be a future leader? Write their name down.

---
*"Greater works than these shall he do." — John 14:12*`
      },
      {
        day: 7,
        title: "Graduation & Commissioning",
        duration: "25 min",
        content: `# Day 28: Graduation & Commissioning

## Opening Reflection
*"Go ye therefore, and teach all nations." — Matthew 28:19*

## You Made It!
Over 4 weeks, you have learned:

### Week 1: Vision & Method
- Why Phototheology
- Text-first groups
- Your role as guide

### Week 2: How to Run a Group
- Starting and closing well
- Using questions
- Managing discussion

### Week 3: Shepherding & Escalation
- Caring for seekers and members
- Knowing when to get help
- Boundaries and safety

### Week 4: Evangelism Through Groups
- Inviting guests
- Hosting seekers
- Multiplying leaders

## Your Commissioning

You are now a **Certified Small Group Leader** in Living Manna.

This means:
- You are trusted to shepherd a group
- You are equipped with tools and knowledge
- You are accountable to lead with integrity

## Your Next Steps
1. ✅ Complete this training (Done!)
2. 🔜 Meet with your pastor or ministry leader
3. 🔜 Get assigned or form your group
4. 🔜 Generate your first study using the app
5. 🔜 Launch your group!

## Closing Prayer
*Lord Jesus, I accept this call to lead. I know I am not perfect, but I trust You to work through me. Give me wisdom, love, and courage. May every group I lead point to You. Amen.*

---
**🎓 CONGRATULATIONS! You are now a Certified Living Manna Leader!** 🎓`
      }
    ]
  }
};

export function LeaderTrainingCourse({ churchId, progressData, onProgressUpdate }: LeaderTrainingCourseProps) {
  const { user } = useAuth();
  const [currentWeek, setCurrentWeek] = useState(progressData?.current_week || 1);
  const [selectedDay, setSelectedDay] = useState<number | null>(null);
  const [completing, setCompleting] = useState(false);

  // Get all completed days
  const completedDays: number[] = progressData?.completed_days || [];
  const startDate = progressData?.started_at ? new Date(progressData.started_at) : new Date();

  // Calculate which day is unlocked based on time
  const daysSinceStart = Math.floor((Date.now() - startDate.getTime()) / (1000 * 60 * 60 * 24));
  const maxUnlockedDay = Math.min(daysSinceStart + 1, 28);

  const weekKeys = ['week1', 'week2', 'week3', 'week4'] as const;
  const currentWeekData = COURSE_CONTENT[weekKeys[currentWeek - 1]];

  // Calculate overall progress
  const totalDays = 28;
  const completedCount = completedDays.length;
  const progressPercent = (completedCount / totalDays) * 100;

  // Get global day number (1-28)
  const getGlobalDayNumber = (week: number, dayIndex: number) => {
    return (week - 1) * 7 + dayIndex + 1;
  };

  // Check if a day is completed
  const isDayCompleted = (globalDay: number) => completedDays.includes(globalDay);

  // Check if a day is unlocked
  const isDayUnlocked = (globalDay: number) => {
    if (globalDay > maxUnlockedDay) return false;
    for (let i = 1; i < globalDay; i++) {
      if (!completedDays.includes(i)) return false;
    }
    return true;
  };

  // Complete a day
  const completeDay = async (globalDay: number) => {
    if (!user || !progressData) return;
    
    setCompleting(true);
    try {
      const newCompletedDays = [...completedDays, globalDay];
      const newWeek = Math.ceil((globalDay + 1) / 7);
      const isComplete = newCompletedDays.length >= 28;

      const { error } = await supabase
        .from("leader_onboarding_progress")
        .update({
          completed_days: newCompletedDays,
          current_week: Math.min(newWeek, 4),
          completed_at: isComplete ? new Date().toISOString() : null,
          is_certified: isComplete,
        })
        .eq("id", progressData.id);

      if (error) throw error;

      toast.success(isComplete 
        ? "🎓 Congratulations! You are now a Certified Leader!" 
        : `Day ${globalDay} completed!`
      );
      
      setSelectedDay(null);
      onProgressUpdate();
    } catch (error) {
      console.error("Error completing day:", error);
      toast.error("Failed to save progress");
    } finally {
      setCompleting(false);
    }
  };

  // Get next available day
  const getNextAvailableDay = () => {
    for (let i = 1; i <= 28; i++) {
      if (!isDayCompleted(i) && isDayUnlocked(i)) return i;
    }
    return null;
  };

  const nextAvailableDay = getNextAvailableDay();

  return (
    <div className="space-y-6">
      {/* Progress Overview */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between mb-2">
            <span className="font-medium">Training Progress</span>
            <span className="text-sm text-muted-foreground">
              {completedCount} of {totalDays} days completed
            </span>
          </div>
          <Progress value={progressPercent} className="h-3" />
          <p className="text-xs text-muted-foreground mt-2">
            <Clock className="inline h-3 w-3 mr-1" />
            One lesson unlocks per day. You're on day {daysSinceStart + 1} of training.
          </p>
        </CardContent>
      </Card>

      {/* Week Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {weekKeys.map((key, index) => {
          const week = index + 1;
          const weekData = COURSE_CONTENT[key];
          const Icon = weekData.icon;
          const weekStartDay = (week - 1) * 7 + 1;
          const weekEndDay = week * 7;
          const weekCompletedDays = completedDays.filter(
            (d: number) => d >= weekStartDay && d <= weekEndDay
          ).length;
          const isWeekComplete = weekCompletedDays === 7;
          
          return (
            <Button
              key={week}
              variant={currentWeek === week ? "default" : "outline"}
              onClick={() => setCurrentWeek(week)}
              className="flex items-center gap-2 min-w-fit"
            >
              {isWeekComplete ? (
                <CheckCircle className="h-4 w-4 text-green-500" />
              ) : (
                <Icon className="h-4 w-4" />
              )}
              Week {week}
              <Badge variant="secondary" className="text-xs">
                {weekCompletedDays}/7
              </Badge>
            </Button>
          );
        })}
      </div>

      {/* Current Week Content */}
      {selectedDay === null ? (
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              {(() => {
                const Icon = currentWeekData.icon;
                return <Icon className="h-6 w-6 text-primary" />;
              })()}
              <div>
                <CardTitle>Week {currentWeek}: {currentWeekData.title}</CardTitle>
                <CardDescription>{currentWeekData.description}</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3">
              {currentWeekData.days.map((day, index) => {
                const globalDay = getGlobalDayNumber(currentWeek, index);
                const completed = isDayCompleted(globalDay);
                const unlocked = isDayUnlocked(globalDay);
                const isNext = globalDay === nextAvailableDay;

                return (
                  <div
                    key={day.day}
                    className={`p-4 rounded-lg border transition-all ${
                      completed
                        ? "bg-green-500/10 border-green-500/30"
                        : unlocked
                          ? isNext
                            ? "bg-primary/10 border-primary/30 cursor-pointer hover:bg-primary/20"
                            : "bg-background border-border cursor-pointer hover:bg-muted"
                          : "bg-muted/30 border-border/30 opacity-60"
                    }`}
                    onClick={() => unlocked && setSelectedDay(globalDay)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                          completed
                            ? "bg-green-500 text-white"
                            : unlocked
                              ? "bg-primary text-primary-foreground"
                              : "bg-muted text-muted-foreground"
                        }`}>
                          {completed ? (
                            <CheckCircle className="h-5 w-5" />
                          ) : unlocked ? (
                            <Play className="h-5 w-5" />
                          ) : (
                            <Lock className="h-5 w-5" />
                          )}
                        </div>
                        <div>
                          <h4 className="font-medium flex items-center gap-2">
                            Day {globalDay}: {day.title}
                            {isNext && !completed && (
                              <Badge className="bg-primary text-primary-foreground text-xs">
                                Next
                              </Badge>
                            )}
                          </h4>
                          <p className="text-sm text-muted-foreground flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {day.duration}
                          </p>
                        </div>
                      </div>
                      {unlocked && !completed && (
                        <ChevronRight className="h-5 w-5 text-muted-foreground" />
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      ) : (
        /* Day Content View */
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSelectedDay(null)}
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Week
              </Button>
              <Badge variant="outline">
                Day {selectedDay} of 28
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[600px] pr-4">
              <div className="prose prose-sm dark:prose-invert max-w-none">
                <ReactMarkdown>
                  {(() => {
                    const weekIndex = Math.floor((selectedDay - 1) / 7);
                    const dayIndex = (selectedDay - 1) % 7;
                    return COURSE_CONTENT[weekKeys[weekIndex]]?.days[dayIndex]?.content || "";
                  })()}
                </ReactMarkdown>
              </div>
            </ScrollArea>

            {!isDayCompleted(selectedDay) && (
              <div className="mt-6 pt-4 border-t border-border">
                <Button
                  onClick={() => completeDay(selectedDay)}
                  disabled={completing}
                  className="w-full"
                  size="lg"
                >
                  {completing ? (
                    <>
                      <Clock className="h-4 w-4 mr-2 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Mark Day {selectedDay} Complete
                    </>
                  )}
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
