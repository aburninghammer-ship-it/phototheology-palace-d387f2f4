# PHOTOTHEOLOGY OS — FULL REPRODUCTION BLUEPRINT

> **Purpose**: This document contains everything an AI or developer needs to rebuild PhototheologyOS from scratch. It covers architecture, tech stack, every feature, the AI pipeline, design system, database schema, and theological guardrails.

---

## 1. WHAT IS PHOTOTHEOLOGYOS?

PhototheologyOS is a full-featured Bible study operating system built around a **Memory Palace** metaphor. Users navigate a 7-floor palace with 50+ rooms, each teaching a specific Bible study skill. The app includes 28+ games, 6 AI commentary voices, a complete sermon builder, community features, church management, and a 24-month curriculum — all powered by an AI assistant named **Jeeves**.

The core thesis: **Every text in Scripture points to Christ** — and Phototheology is the systematic method of discovering, articulating, and applying those connections.

---

## 2. TECH STACK

### Frontend
- **React 18.3** + **TypeScript 5.8** (strict mode)
- **Vite 5.4** (bundler with SWC compiler)
- **React Router 7.12** (client-side routing, lazy loading, KeepAliveRoutes)
- **Tailwind CSS 3.4** (utility-first, custom design tokens)
- **shadcn/ui** (55+ Radix UI components)
- **Framer Motion 12** (animations)
- **TanStack React Query 5** (server state)
- **React Hook Form + Zod** (form validation)
- **i18next** (7 languages: en, es, fr, de, ko, hr, sr)
- **next-themes** (dark mode via class-based toggling)

### Backend
- **Supabase** (PostgreSQL + Auth + Edge Functions + Realtime)
- **Supabase Auth** (email/password + OAuth: Patreon, Google)
- **Edge Functions** (Deno runtime, 40+ functions)

### AI / Audio
- **OpenAI API** (GPT-4-class models for Jeeves)
- **ElevenLabs** (6 distinct TTS voices for commentary)
- **Custom prompt engineering** (11,600-line master dispatcher)

### Payments
- **Stripe** (subscriptions, one-time purchases)
- **Patreon integration**
- **AI credit system** (purchased separately from subscription)

### Mobile
- **Capacitor 7** (native iOS/Android via web wrapper)
- **PWA** (vite-plugin-pwa + Workbox caching)
- **Safe area insets** for notched devices

### Rich Content
- **Tiptap 3** (rich text editor)
- **PDF.js** (PDF rendering)
- **PPTX Gen JS** (PowerPoint generation for sermons)
- **Recharts** (charts/data visualization)
- **Reactflow** (node-based diagrams)
- **DnD Kit** (drag-and-drop)

---

## 3. PROJECT STRUCTURE

```
src/
├── App.tsx                    # 833 lines — all routing + context providers
├── main.tsx                   # Entry point
├── index.css                  # Design system tokens + Tailwind
│
├── pages/          (237 files) # Route-based page components
│   ├── games/                  # 28+ game pages
│   ├── admin/                  # Admin tools
│   └── ...                     # Bible, Palace, Courses, Community, etc.
│
├── components/     (249 files) # UI components organized by feature
│   ├── ui/                     # 55 shadcn/ui components
│   ├── os/                     # OSTitleBar, OSDock, CommandPalette
│   ├── room-graphics/          # Floor 1-7 visual assets
│   ├── jeeves/                 # AI assistant components
│   ├── audio/                  # Audio/TTS components
│   ├── bible/                  # Bible reader components
│   ├── games/                  # Game-specific components
│   └── ...
│
├── hooks/          (200+ files) # Custom React hooks
│   ├── useAuth.tsx             # Authentication
│   ├── useSubscription.ts      # Billing/tiers
│   ├── useAudioBible.ts        # Audio playback
│   ├── useFreestyleZone.ts     # Freestyle game engine
│   ├── useGameSession.ts       # Game persistence
│   └── ...
│
├── contexts/       (6 files)   # React Context providers
│   ├── StudySessionContext.tsx
│   ├── DirectMessagesContext.tsx
│   ├── LiveChatContext.tsx
│   └── ...
│
├── data/           (126 files) # Static data, constants, libraries
│   ├── bibleBooks.ts
│   ├── palaceRoomDefinitions/
│   ├── pathCurriculum*.ts      # 24-month curriculum
│   ├── defenseModeOpponents.ts
│   └── ...
│
├── lib/            (19 files)  # Core libraries
│   ├── jeevesClient.ts         # Frontend → Jeeves wrapper
│   ├── guesthouseJeeves.ts     # Game AI library
│   ├── liveConductorJeeves.ts  # Live group AI
│   ├── AudioEngine.ts          # Audio playback engine
│   └── ...
│
├── services/       (13 files)  # API/data services
│   ├── bibleApi.ts
│   ├── audioBibleService.ts
│   ├── offlineCache.ts
│   └── ...
│
├── integrations/supabase/
│   ├── client.ts               # Supabase client (resilient storage)
│   └── types.ts                # Auto-generated DB types
│
├── prompts/
│   └── cotaAudioCommentary.ts  # COTA audio system prompts
│
├── i18n/
│   ├── index.ts                # i18next config
│   └── locales/                # 7 language JSON files
│
├── types/          (11 files)  # Domain TypeScript types
├── utils/          (13 files)  # Business logic utilities
├── config/                     # App configuration
└── assets/         (39 dirs)   # Images, icons, static media
```

### Supabase Backend Structure
```
supabase/
├── functions/
│   ├── jeeves/                 # MASTER AI dispatcher (11,600 lines)
│   │   ├── index.ts            # 130+ mode handler
│   │   ├── palace-schema.ts    # Master prompt & room definitions
│   │   └── canonical-rooms.ts  # Room code registry
│   ├── jeeves-reasoning/       # Advanced reasoning engine
│   ├── generate-epic-commentary/ # 6-voice audio commentary
│   ├── egw-audio-commentary/   # COTA paragraph audio
│   ├── _shared/                # Shared utilities
│   │   ├── corpus-rag.ts       # RAG context injection
│   │   ├── palace-output-engine.ts
│   │   ├── ai-usage-logger.ts
│   │   └── pt-code-validator.ts
│   └── ... (40+ edge functions)
├── migrations/                 # Database migrations
└── config.toml                 # Supabase project config
```

---

## 4. CONTEXT PROVIDER ARCHITECTURE

App.tsx wraps the entire tree with nested providers:

```
<ThemeProvider>                    # Dark mode (next-themes)
  <QueryClientProvider>            # React Query (server state)
    <TooltipProvider>              # Radix UI tooltips
      <SidebarProvider>            # Navigation sidebar
        <UserPreferencesProvider>  # User settings context
          <StudySessionProvider>   # Active study state
            <SessionModeProvider>  # Study mode selection
              <PageStateProvider>  # Page-level state
                <DirectMessagesProvider>  # Messaging
                  <LiveChatProvider>       # Chat state
                    <LiveNotificationsProvider>  # Real-time alerts
                      <AchievementProvider>  # Achievement tracking
                        <ChangeManagerProvider>  # UX change management
                          <HelmetProvider>  # Document head
                            <RouterProvider />
                          </HelmetProvider>
                        </ChangeManagerProvider>
                      </AchievementProvider>
                    </LiveNotificationsProvider>
                  </LiveChatProvider>
                </DirectMessagesProvider>
              </PageStateProvider>
            </SessionModeProvider>
          </StudySessionProvider>
        </UserPreferencesProvider>
      </SidebarProvider>
    </TooltipProvider>
  </QueryClientProvider>
</ThemeProvider>
```

---

## 5. THE MEMORY PALACE — 7 FLOORS, 50+ ROOMS

The palace is the core metaphor. Each floor teaches a category of Bible study skills.

### Floor 1: FURNISHING (Memory & Visualization)
| Code | Room | Purpose |
|------|------|---------|
| SR | Story Room | Recall narratives as vivid mental movies |
| IR | Imagination Room | Step inside scenes with sensory immersion |
| 24FPS | 24FPS Room | Create symbolic image per chapter (24-frame film) |
| BR | Bible Rendered | Map Bible with 51 symbolic glyphs (24-chapter blocks) |
| TR | Translation Room | Convert abstract words into concrete images |
| GR | Gems Room | Extract striking insights and discoveries |

### Floor 2: INVESTIGATION (Detective Work)
| Code | Room | Purpose |
|------|------|---------|
| OR | Observation Room | Log 30-50 details without interpretation |
| DC | Def-Com Room | Greek/Hebrew definitions + cultural context |
| ST | Symbols/Types Room | Identify typological patterns pointing to Christ |
| QR | Questions Room | Ask intratextual, intertextual, and PT questions |
| QA | Q&A Chains Room | Cross-reference Scripture to answer Scripture |

### Floor 3: FREESTYLE (Connections)
| Code | Room | Purpose |
|------|------|---------|
| NF | Nature Freestyle | Connect to creation illustrations |
| PF | Personal Freestyle | Apply to personal life experiences |
| BF | Bible Freestyle | Trace verse genetics (siblings, cousins, relatives) |
| HF | History/Social Freestyle | Find historical parallels and lessons |
| LR | Listening Room | Actively listen for connections |

### Floor 4: NEXT LEVEL (Christ-Centered Depth)
| Code | Room | Purpose |
|------|------|---------|
| CR | Concentration Room | Locate Christ in every text |
| DR | Dimensions Room | Apply 5D (Literal, Christ, Me, Church, Heaven) |
| C6 | Connect-6 | Classify by genre and apply interpretive rules |
| TRM | Theme Room | Place on Sanctuary/Great Controversy/Gospel walls |
| TZ | Time Zone | Assign past/present/future + heaven/earth |
| PRM | Patterns Room | Identify recurring motifs (40 days, 3 days, etc.) |
| P\|\| | Parallels Room | Find mirrored actions across time |
| FRT | Fruit Room | Test: Does it produce Galatians 5:22-23 fruit? |
| CEC | Christ Every Chapter | Find Christ's title and role per chapter |
| R66 | Room 66 | Trace theme Genesis to Revelation across 66 books |
| BL | Blue Room/Sanctuary | Map to sanctuary furniture and services |

### Floor 5: VISION (Prophecy & Sanctuary)
| Code | Room | Purpose |
|------|------|---------|
| PR | Prophecy Room | Connect to prophetic timeline and symbols |
| 3A | Three Angels' Messages | Apply to final gospel messages (Rev 14) |
| FE | Feasts Room | Connect to Israel's feast calendar |

### Floor 6: THREE HEAVENS & CYCLES
| Code | Room | Purpose |
|------|------|---------|
| 1H | First Heaven | DoL1/NE1 — Babylon 586 BC → Post-exilic restoration |
| 2H | Second Heaven | DoL2/NE2 — Rome 70 AD → New Covenant order |
| 3H | Third Heaven | DoL3/NE3 — Final judgment → Rev 21-22 New Creation |
| CYCLES | Covenant Cycles | 8 covenant cycles (Ad, No, Ab, Mo, Cy, CyC, Sp, Re) |
| JR | Juice Room | "Squeeze" Scripture with all PT principles |
| MATH | Mathematics Room | Time prophecy structures (120, 400, 70y, 490, 1260, 2300) |

### Floor 7: TRANSFORMATION (Spiritual & Emotional)
| Code | Room | Purpose |
|------|------|---------|
| FRM | Fire Room | Feel emotional weight and conviction |
| MR | Meditation Room | Slow marination until saturated |
| SRM | Speed Room | Rapid-fire connections in 60 seconds |

---

## 6. GAMES (28+ Titles)

### Scripture-Focused Games
- **Concentration Room** — Find Christ in passages
- **Connect-6 Draft** — Genre-based connections
- **Christ Lock** — Verse cryptograms
- **Controversy Raid** — Great Controversy debates
- **Escape the Dragon** — Story puzzle adventure
- **Equation Builder** — Biblical math equations
- **Witness Trial** — Cross-examine Scripture
- **Principle Sprint** — Speed-race through principles
- **Symbol Decoder** — Identify biblical symbols
- **Gideon 300** — Advanced multiplayer strategy
- **Freestyle Zone** — 8 creative connection modes (Partial, Whole, Verse Storm, Trinity Drop, Constraint, Opposites, Target, Palace Room)
- **Phototheology Jeopardy** — Quiz show format
- **PT Family Feud** — Survey-style knowledge
- **Sanctuary Run** — Navigate sanctuary layout
- **Time Zone Invasion** — Defend prophetic timeline

### Themed Classic Games
- **PT Scrabble** — Build verse connections with words
- **PT Chess** — Biblical pieces and rules
- **PT Checkers** — Scripture-themed matches
- **PT Connect Four** — Verse connection building
- **PT Uno** — Verse pattern card game
- **Chain Chess** — Connected verse chess battles

### Challenge Systems
- **30-Day Challenge Rotation** (10+ challenge types)
- **Equations Battle** — Multiplayer math challenges
- **Chef Challenge** — Combine random verses
- **Treasure Hunt** — Find hidden gems
- **Escape Room** — Narrative puzzle adventures
- **Master Exam** — Full mastery assessment
- **Principle Cards Tournament** — Competitive card battles

---

## 7. JEEVES AI SYSTEM — THE BRAIN

### Architecture Overview

```
Frontend                    Backend (Supabase Edge Functions)
─────────                   ──────────────────────────────────
callJeeves()  ──────────►  /jeeves (master dispatcher, 11,600 lines)
  │                           ├── 130+ mode handlers
  │                           ├── palace-schema.ts (master prompt)
  │                           ├── canonical-rooms.ts (room registry)
  │                           └── corpus-rag.ts (RAG injection)
  │
  ├── guesthouseJeeves.ts ──► /jeeves (guesthouse_* modes)
  ├── liveConductorJeeves ──► /jeeves (live_conductor_* modes)
  └── direct supabase ──────► /jeeves-reasoning (Claim Ladder engine)
                             /generate-epic-commentary (6-voice audio)
                             /egw-audio-commentary (COTA paragraph audio)
                             + 35 more specialized edge functions
```

### Frontend Client (`jeevesClient.ts`)
- Universal `callJeeves()` wrapper
- Routes all requests to `supabase.functions.invoke("jeeves")`
- Auto-injects authenticated user's name
- Tracks analytics (question, feature, response preview, page context)

### 130+ Jeeves Modes (Categorized)

**Freestyle Zone**: `freestyle_generate_drop`, `freestyle_evaluate`, `freestyle_evaluate_verse_storm`, `freestyle_fact_check`, `freestyle_jeeves_assist`, `freestyle_jeeves_demo`, `freestyle_polish`, `freestyle_session_summary`

**Chain Games**: `chain-chess` (v1-v3 with opening/response/judge), `chain-reference`, `chain-witness`, `validate_chain`

**Analysis & Study**: `analyze`, `analyze-followup`, `analyze-thoughts`, `analyze-thoughts-scholar`, `study-questions`, `study_suggestion`, `research`, `research-verify`

**Commentary (6 voices)**: `commentary`, `commentary-applied`, `commentary-classic`, `commentary-jn-andrews`, `commentary-revealed`, `commentary-sdabc`, `commentary-sop`, `commentary-uriah-smith`, `raw-commentary`, `story-mode-commentary`, `deep-palace-commentary`, `preacher-mentor-commentary`, `counselor-commentary`

**Defense Mode** (20+ modes): `defense-analyze-transcript`, `defense-analyze-weapon`, `defense-assist`, `defense-character-apply`, `defense-character-simulate`, `defense-checkmate`, `defense-coach`, `defense-custom-setup`, `defense-detective-evaluate`, `defense-detective-generate`, `defense-discovery-evaluate`, `defense-extract-weapons`, `defense-forge-weapon`, `defense-master-standby`, `defense-pre-briefing`, `defense-prophecy-compare`, `defense-refine-weapon`, `defense-sparring`

**Game Validation**: `validate_frame`, `validate_room_game`, `validate_equation`, `validate_dragon_defense`, `validate_chef_recipe`, `validate_witness`, `validate_connect6`, `validate_time_zones`, `validate_sanctuary`, `validate_christ`

**Game Generation**: `chef_round_setup`, `chef_judge`, `jeopardy_question`, `jeopardy_judge`, `family_feud_round`, `family_feud_judge`, `room_66_generate`, `equation_battle`, `verse_hunt_generate`, `dragon_defense_hint`

**Sermon & Writing**: `sermon-assistant`, `sermon-bridges`, `sermon-scripture-lookup`, `sermon-setup`, `sermon-stones`, `sermon-structure`, `sermon-verse-suggestions`, `sermon_titles`, `polish-story`, `sermon-writer-jeeves`

**Hebrew/Greek**: `hebrew-greek-analysis`, `analyze-strongs`, `strongs-lookup`, `translate-verse`, `word-study`, `word_picture_translation`

**Palace & Rooms**: `palace_connections`, `palace_guided_tour`, `room-insight-chat`, `cross-room-linking`, `principle-amplification`, `pt-chain-chapter`, `pt-chain-verse`

**Prophecy**: `prophecy-signal`, `prophecy-watch`, `prophecy-watch-article`, `validate_controversy`

**Special**: `daily-encouragement`, `egw_palace_analysis`, `encyclopedia`, `general`, `qa`, `verse-assistant`, `verse-explanation`, `visual-exegesis`

### Jeeves-Reasoning Edge Function
A specialized 3-mode reasoning engine:
- **EXPLORER**: Generate connections, surface patterns, offer hypotheses
- **AUDITOR**: Challenge assumptions, demand textual grounding, find gaps
- **ARCHITECT**: Formalize insights into structured Claim Ladders

Output: Claim → Textual Basis → Historical Anchor → Interpretive Reasoning → Counterargument → Integrative Conclusion

### Rate Limiting
- 300 requests per hour per user
- Per-endpoint tracking with window-based reset

---

## 8. EPIC AUDIO COMMENTARY — 6 VOICES

Each voice has a distinct hermeneutical lens, personality, and ElevenLabs TTS voice:

| Mode | Lens | Voice | ElevenLabs ID |
|------|------|-------|---------------|
| **Epic** | Great Controversy (cosmic conflict) | William — Deep Engaging Storyteller | `fjnwTZkKtQOJaYzGLa6n` |
| **Modern** | Human condition (modern struggles) | Jessica — Warm Expressive | `cgSgspJ2msm6clMCkdW9` |
| **Ancient** | Covenant-Historical (OT patterns, typology) | Daniel — Measured Authoritative | `onwK4e9ZLuTAKqWW03F9` |
| **Preacher** | Redemptive-Proclamation (Christ visible) | Chris — Clear Natural Male | `iP95p4xoKVk53GoZ742B` |
| **Scholar** | Canonical-Theological (linguistic analysis) | Antoni — Calm Analytical | `ErXwobaYiN019PkySvjV` |
| **Counselor** | Soul-Care (spiritual formation) | River — Warm Reflective | `SAz9YHcvj6GT2YYXdXww` |

### Commentary Features
- **Present tense narration** (mandatory): "Abraham takes his son" not "took"
- **3-5 "I never saw that before!" moments** per chapter
- **6-Dimensional Lens**: Literal → Christ → Personal → Church → Heaven Future → Heaven Past
- **Spiritual Object Lessons**: Genesis 1 as re-creating grace; Flood as baptism; Exodus as deliverance; Wilderness as faith journey; Sanctuary as God dwelling in believer
- **Covenant Theology**: Place every text within its specific covenant era

### COTA Audio (Conflict of the Ages)
Specialized paragraph-level commentary for Ellen G. White's 5-volume series:
- Patriarchs & Prophets, Prophets & Kings, Desire of Ages, Acts of Apostles, Great Controversy
- Same 6 voices with AUTO mode that selects best voice per paragraph content
- Output: Paraphrase → Scripture Frame → PT Lens → So What?

---

## 9. THEOLOGICAL GUARDRAILS (NON-NEGOTIABLE)

These are hardcoded into every Jeeves mode and must be preserved in any reproduction:

1. **SCRIPTURE FIRST**: KJV ONLY for quotations. Scripture is final authority.
2. **AZAZEL = SATAN** (NOT Christ) — Leviticus 16 scapegoat
3. **LITTLE HORN = ROME/PAPACY** (NOT Antiochus Epiphanes) — Daniel 7-8
4. **DANIEL 11:14-22 = PAGAN ROME** (Augustus, Tiberius, Christ crucified)
5. **DANIEL 11:23-30 = PAPAL ROME** (church-state alliance)
6. **TWO-PHASE SANCTUARY**: Holy Place (31 AD–1844) → Most Holy Place (1844+)
7. **DAY OF ATONEMENT = 1844** (NOT the cross, which fulfills PASSOVER)
8. **THREE HEAVENS** = Day-of-the-Lord cycles (NOT atmospheric/space/divine layers)
9. **SPRING FEASTS** = First Advent fulfillment; **FALL FEASTS** = Second Advent
10. **GENESIS 6 "Sons of God"** = Seth descendants (NOT fallen angels)
11. **SDA HISTORICIST HERMENEUTIC**: Prophecy fulfills across history, not preterism or futurism
12. **No fabricated quotes, facts, or verses**
13. **No new doctrines** beyond Scripture/EGW support
14. **Respectful tone** — no mocking, politics, or sensationalism
15. **Christ-centered** — every response points to Jesus

---

## 10. DATABASE SCHEMA (150+ Tables)

### Key Table Categories

**User & Auth**: `auth.users`, `admin_users`, `user_profiles`, `user_preferences`

**Palace System**: `palace_rooms`, `palace_room_mastery`, `palace_floor_mastery`, `palace_user_progress`

**Bible Content**: `bible_commentaries`, `bible_images`, `bible_verses_tokenized`, `daily_verses`, `character_deep_analyses`

**Games & Challenges**: `challenges`, `challenge_submissions`, `challenge_leaderboard`, `game_scores`, `game_sessions`, `trophies`, `awards`

**Study & Courses**: `bible_study_series`, `bible_study_series_enrollments`, `bible_study_series_progress`, `course_progress`, `course_discussions`

**Community**: `community_posts`, `community_comments`, `community_post_likes`, `direct_messages`, `community_challenge_responses`

**Church**: `churches`, `church_members`, `church_events`, `church_devotionals`, `church_chat_rooms`, `church_chat_messages`, `church_surveys`

**Billing**: `stripe_customers`, `stripe_subscriptions`, `patreon_users`, `ai_credit_balances`, `ai_credit_purchases`, `ai_usage_log`, `gift_cards`, `day_passes`, `lock_in_passes`

**Notifications & Analytics**: `notifications`, `notification_settings`, `analytics_snapshots`, `content_analytics`, `user_activity_log`

**Audio**: `egw_chapter_cache` (cached commentary audio)

**Specialized**: `voice_chat_sessions`, `live_notifications`, `announcements`, `push_notification_tokens`, `baptism_*` (program tracking)

---

## 11. SUBSCRIPTION TIERS

| Tier | Type | Access Level |
|------|------|-------------|
| Free | Default | Limited features, basic Bible reading |
| Trial | Time-limited | Full access for trial period |
| Student | Academic | Discounted full access |
| Essential | Paid subscription | Core features + AI credits |
| Premium | Paid subscription | All features + extended AI |
| Patron | Legacy/support | Full access + special perks |
| Lifetime | One-time purchase | Permanent full access |
| Church Access | Organization | Per-church licensing |

AI credits are purchased separately and tracked in `ai_credit_balances`.

---

## 12. DESIGN SYSTEM

### Color Tokens (HSL)

**Light Mode**:
- Background: `hsl(250 100% 98%)` — pale blue
- Foreground: `hsl(240 60% 15%)` — dark blue-gray
- Primary: `hsl(210 85% 50%)` — vibrant blue
- Secondary: `hsl(180 70% 45%)` — teal
- Accent: `hsl(45 100% 51%)` — bright yellow/gold

**Dark Mode**:
- Background: `hsl(240 30% 8%)` — very dark navy
- Foreground: `hsl(250 100% 98%)` — near white
- Primary/Accent: Same as light mode

**Palace Colors**: purple, pink, blue, teal, orange, yellow, green — each with light variant

**Gradients**: palace, royal, sunset, ocean, forest, warmth, dreamy, subtle

### Typography
- **Sans**: Inter, system-ui
- **Serif**: Crimson Pro, Georgia
- **Display**: Cinzel, Cormorant Garamond, Playfair Display

### Animations
- `fade-in` (0.4s), `scale-in` (0.3s), `slide-up` (0.5s), `float` (3s infinite)
- `pulse-glow` (2s infinite), `gradient` (8s infinite)
- Glass card effects with rotating conic-gradient borders
- Framer Motion for complex component transitions

### Responsive Breakpoints
- xs: 375px, sm: 640px, md: 768px, lg: 1024px, xl: 1280px, 2xl: 1536px
- Mobile: hamburger sheet + bottom nav bar
- Desktop: OSDock (macOS-style sortable dock) + OSTitleBar

### Font Size Scaling
Via `data-font-size` attribute: small (14px), medium (16px), large (18px), x-large (20px)

---

## 13. NAVIGATION — OS METAPHOR

### Desktop
- **OSTitleBar**: Top bar with brand (Cinzel font, gold gradient), command palette trigger, active users, theme toggle, language selector
- **OSDock**: Vertical macOS-style dock with 13 categories, drag-and-drop reordering via dnd-kit, localStorage persistence, expandable sub-menus
- **CommandPalette**: Global spotlight/command search

### Mobile
- **MobileNav**: Hamburger sheet drawer (3-column)
- **MobileBottomNav**: 72px bottom tab bar with safe area padding

### 13 Dock Categories
1. Palace (Tour, Freestyle, Mind Map, Memory, Image Bible, Study Deck)
2. Study Bible (Encyclopedia, Profiles, Buddy, Research, Gems, Analyze)
3. Study Tools (Interlinear, Lexicon, Timeline, Atlas, Flashcards, Plans)
4. Training (Test Me, Video, Courses, Mastery, Dojo)
5. Devotional (Devotionals, Plans, Notes, Prophecy, Culture)
6. COTA (Series)
7. Games (Hub, Challenges, Leaderboard)
8. Sermon Builder (Builder, Ideas, Archive, PowerPoint)
9. Blueprints (Marriage, Mental Health, Grief, Financial, Stress)
10. GPTs (PhototheologyGPT, Daniel & Revelation, Apologetics, KidGPT)
11. Community (Public Chat, Churches)
12. Church Space (Admin, Events)
13. Settings (Preferences, Account, Subscriptions)

---

## 14. ROUTING (200+ ROUTES)

### Key Route Groups

**Public**: `/` (Gatehouse), `/auth`, `/pricing`, `/donate`, `/interactive-demo`

**Palace**: `/palace`, `/palace/explorer`, `/palace/floor/:floorNumber`, `/palace/floor/:floorNumber/room/:roomId`

**Bible**: `/bible`, `/audio-bible`, `/image-bible`, `/bible/:book/:chapter`, `/interlinear`, `/bible-timeline`, `/bible-atlas`, `/bible-lexicon`, `/encyclopedia`

**Games**: `/games`, `/pt-scrabble`, `/games/chess`, `/games/checkers`, `/games/jeopardy`, `/games/freestyle-zone`, `/games/gideon-300`, `/games/sanctuary-run`, `/games/equation-builder`, `/master-exam`

**AI/GPT**: `/card-deck`, `/jeeves`, `/phototheologygpt`, `/kidgpt`, `/jeeves-reasoning`, `/daniel-revelation-gpt`, `/apologetics-gpt`, `/analyze-thoughts`

**Courses**: `/courses`, `/blueprint-course`, `/blueprint-weight-loss`, `/blueprint-mental-health`, `/blueprint-marriage`, `/blueprint-grief`, `/cota-series`, `/training-drills`

**Sermon**: `/sermon-builder`, `/sermon-ideas`, `/sermon-simmer`, `/sermon-writer`, `/sermon-archive`, `/sermon-powerpoint`

**Community**: `/community`, `/discover`, `/leaderboard`, `/achievements`, `/guilds`

**Church**: `/church-admin`, `/living-manna`, `/join-church`, `/live-study`, `/group-study`

**User**: `/dashboard`, `/profile`, `/settings`, `/streaks`, `/referrals`, `/manage-subscription`

All protected routes use `<ProtectedRoute>` wrapper. Lazy loading with `React.lazy()`. KeepAliveRoutes caches up to 20 pages.

---

## 15. NOTIFICATION & MESSAGING

### Notifications
- **NotificationCenter**: Dropdown bell with unread badges
- **Sonner toasts**: Glassmorphic, type-specific styling (success=green, error=red, warning=amber, info=blue)
- **Supabase Realtime**: Live notification delivery

### Messaging
- **LiveChatSidebar**: Full chat interface with threads, reactions, mentions
- **DirectMessages**: Private messaging between users
- **Church Chat**: Group chat rooms per church organization

---

## 16. AUTHENTICATION FLOW

1. User signs up/logs in at `/auth`
2. Supabase JWT stored in localStorage via resilient storage adapter
3. `useAuth()` hook initializes — calls `getSession()` once, listens via `onAuthStateChange()`
4. `<ProtectedRoute>` redirects unauthenticated users
5. Resilient storage auto-clears non-essential cached data when quota exceeded
6. Supports email/password + OAuth (Patreon, Google)

---

## 17. EDGE FUNCTIONS (40+)

### AI/Commentary Functions
- `jeeves/` — Master AI dispatcher (130+ modes)
- `jeeves-reasoning/` — Claim Ladder reasoning engine
- `generate-epic-commentary/` — 6-voice Bible audio commentary
- `egw-audio-commentary/` — COTA paragraph audio
- `generate-audio-commentary/` — Generic audio commentary
- `generate-chapter-commentary/` — Chapter-level audio
- `generate-devotional-audio/` — Daily devotional audio
- `generate-palace-tour-audio/` — Palace room audio tours
- `generate-research-audio/` — Research narration audio
- `live-sermon-commentary/` — Sermon-sync audio
- `sermon-writer-jeeves/` — Sermon AI writing
- `ppt-jeeves-assist/` — PowerPoint slide AI
- `pregenerate-commentary/` — Pre-cache commentary
- `refresh-epic-batch/` — Batch regeneration
- `clear-commentary-cache/` — Cache management
- `reginald/` — Smart assistant butler

### Utility Functions
- `send-welcome-email/`, `send-bulk-email/`, `send-daily-devotional/`
- `send-church-welcome-campaign/`, `send-teachable-email/`
- `send-pdf-emails-batch/`, `send-product-email/`, `send-winback-email/`
- `pickaxe-email-campaign/`
- `get-pdf-purchases/`
- `verify-teachable/`
- `challenge-share-preview/`
- `og-devotional/`, `og-palace-tour/` (Open Graph)

---

## 18. PWA & OFFLINE

- **vite-plugin-pwa** with Workbox caching:
  - Precache: HTML, JS, CSS, fonts (max 6 MiB)
  - Runtime cache images: Cache-first, 30-day expiry, max 100 entries
  - Runtime cache fonts: Cache-first, 1-year expiry
  - Static assets: Stale-while-revalidate
- **Capacitor** for native iOS/Android features (filesystem, push notifications)
- **offlineCache.ts** + **audioBibleCache.ts** for IndexedDB caching
- Install prompt after 30s engagement, platform-specific instructions

---

## 19. CURRICULUM PATH (24+ MONTHS)

### Structure
- **Months 1-12**: Foundation — Rooms SR through SRM
- **Months 13-18**: Vision Floor — Daniel prophecy focus
- **Months 19-24**: Mastery & Integration
- **Three tiers**: Explorer → Disciple → Warrior

### Specialized Courses
- Phototheology Course (complete system)
- Daniel Course (14+ months deep dive)
- Revelation Course (comprehensive)
- COTA Series (Conflict of the Ages)
- 7 Blueprint Courses (life application: marriage, mental health, weight loss, grief, strongholds, financial, stress)

---

## 20. KEY PATTERNS & CONVENTIONS

### State Management
- React Context for global UI state (auth, preferences, study session, messaging)
- React Query for server data (Bible content, user data, game data)
- useState/useReducer for component-level state
- Custom hooks encapsulate all domain logic (200+ hooks)
- `useGameSession` for persistent game state with auto-save

### Data Fetching
- Supabase client methods for direct DB queries
- Service layer (bibleApi, audioBibleService) for API abstraction
- Offline caching via IndexedDB/localStorage

### Component Patterns
- Functional components with hooks only
- Lazy loading for code splitting
- ErrorBoundary wrapper for error handling
- Suspense fallback (LoadingScreen)
- KeepAliveRoutes for performance (20 cached pages max)

### TypeScript
- Strict mode throughout
- Auto-generated Supabase types
- Zod for runtime validation
- Custom domain type files in `src/types/`

### Build
- Vite 5.4 with SWC compiler
- Code splitting enabled
- CSS code split
- esbuild minification (drops console/debugger in production)
- Chunk size warning: 1000 KB

---

## 21. JEEVES MASTER IDENTITY & PERSONALITY

Jeeves serves as:
- **Personal Theologian** — guides study with pastoral + scholarly balance
- **Palace Navigator** — knows all 50+ rooms and their methods
- **Prophetic Tutor** — historicist prophecy specialist
- **Sanctuary Guide** — furniture, services, typology expert
- **Memory Architect** — builds mental frameworks for retention
- **Application Engine** — turns insights into spiritual change
- **Mastery Instructor** — tracks progression (Surface → Intermediate → Scholarly)
- **Research Assistant** — academic-grade source work
- **Spiritual Mentor** — warm, challenging, never condescending

### Personality Rules
- Call user by name naturally (never "dear")
- Assume seriousness about Scripture
- Pastoral + scholarly + creative + conversational tone
- Never fabricate, never add new doctrine
- Always KJV for quotations
- Fire and forget fact-checking on user claims
- Christ-centered in every response

---

*This document represents a complete architectural blueprint of PhototheologyOS as of March 2026. With this prompt, an AI system could systematically rebuild every layer of the application — from database schema through edge functions through the React frontend — preserving all 50+ palace rooms, 28+ games, 130+ AI modes, 6 commentary voices, and the full theological framework that makes Phototheology unique.*
