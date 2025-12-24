import { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Trophy, Star, Lightbulb, CheckCircle, XCircle, Loader2, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useMastery } from "@/hooks/useMastery";
import { Navigation } from "@/components/Navigation";

interface GameConfig {
  id: string;
  name: string;
  roomId: string;
  roomName: string;
  description: string;
  icon: string;
  xpReward: number;
  difficulty: "easy" | "medium" | "hard";
  gameType: string;
  instructions: string;
}

// Complete game configurations - EVERY game has unique content
const gameConfigs: Record<string, GameConfig> = {
  // ===== FLOOR 1 - STORY ROOM =====
  "sr-sequence": {
    id: "sr-sequence", name: "Story Sequence", roomId: "sr", roomName: "Story Room",
    description: "Arrange Bible stories in chronological order", icon: "📖", xpReward: 25, difficulty: "easy",
    gameType: "story_sequence",
    instructions: "List 5 Bible stories from Genesis to Revelation in their correct chronological order. Explain the timeline connection between each."
  },
  "sr-genesis": {
    id: "sr-genesis", name: "Genesis HighRise", roomId: "sr", roomName: "Story Room",
    description: "Build the Genesis tower chapter by chapter", icon: "🏗️", xpReward: 35, difficulty: "medium",
    gameType: "genesis_chapters",
    instructions: "Summarize any 5 consecutive chapters of Genesis. Each summary should be 2-3 sentences capturing the key narrative beats."
  },
  "sr-beat-builder": {
    id: "sr-beat-builder", name: "Beat Builder", roomId: "sr", roomName: "Story Room",
    description: "Create story beats from narrative passages", icon: "🎬", xpReward: 30, difficulty: "medium",
    gameType: "story_beats",
    instructions: "Choose ONE Bible story and break it into exactly 7 story beats (setup, catalyst, rising action, midpoint, crisis, climax, resolution)."
  },
  "sr-story-race": {
    id: "sr-story-race", name: "Story Race", roomId: "sr", roomName: "Story Room",
    description: "Speed-match stories to their beat lists", icon: "🏃", xpReward: 40, difficulty: "hard",
    gameType: "story_match",
    instructions: "I'll describe a sequence of events. Identify the Bible story, the main characters, and the book where it's found. Be specific!"
  },
  "sr-narrative-chain": {
    id: "sr-narrative-chain", name: "Narrative Chain", roomId: "sr", roomName: "Story Room",
    description: "Chain connected stories across books", icon: "🔗", xpReward: 45, difficulty: "hard",
    gameType: "narrative_chain",
    instructions: "Choose a theme (covenant, promise, deliverance, etc.) and trace it through 5 connected stories from different books. Show how each story builds on the previous."
  },

  // ===== FLOOR 1 - IMAGINATION ROOM =====
  "ir-immersion": {
    id: "ir-immersion", name: "Immersion Chamber", roomId: "ir", roomName: "Imagination Room",
    description: "Deep sensory experience in biblical scenes", icon: "👁️", xpReward: 35, difficulty: "medium",
    gameType: "scene_immersion",
    instructions: "Choose a biblical scene and describe it as if you were INSIDE it. Include: what the ground feels like under your feet, the temperature, sounds, smells, and your emotional state."
  },
  "ir-frame-snapshot": {
    id: "ir-frame-snapshot", name: "Frame Snapshot", roomId: "ir", roomName: "Imagination Room",
    description: "Visualize and describe biblical scenes vividly", icon: "📸", xpReward: 30, difficulty: "medium",
    gameType: "frame_snapshot",
    instructions: "Freeze ONE moment in a Bible story. Describe this frozen frame in vivid detail: positions of people, expressions, lighting, setting, tension in the air."
  },
  "ir-sense-finder": {
    id: "ir-sense-finder", name: "Sense Finder", roomId: "ir", roomName: "Imagination Room",
    description: "Identify all 5 senses in a passage", icon: "🎭", xpReward: 25, difficulty: "easy",
    gameType: "five_senses",
    instructions: "Choose a Bible scene. List what you would SEE, HEAR, SMELL, TASTE, and TOUCH. Each sense needs at least 2 specific details."
  },
  "ir-scene-painter": {
    id: "ir-scene-painter", name: "Scene Painter", roomId: "ir", roomName: "Imagination Room",
    description: "Paint a scene with words", icon: "🎨", xpReward: 35, difficulty: "medium",
    gameType: "scene_painting",
    instructions: "Write a 150-word 'painting' of a Bible scene using only descriptive language. No dialogue, no action - just the setting and atmosphere."
  },
  "ir-empathy-walk": {
    id: "ir-empathy-walk", name: "Empathy Walk", roomId: "ir", roomName: "Imagination Room",
    description: "Step into a biblical character's shoes", icon: "👣", xpReward: 45, difficulty: "hard",
    gameType: "character_empathy",
    instructions: "Choose a biblical character at a pivotal moment. Write a first-person internal monologue: their fears, hopes, doubts, and faith."
  },

  // ===== FLOOR 1 - 24FPS ROOM =====
  "24fps-chapter": {
    id: "24fps-chapter", name: "24FPS Challenge", roomId: "24fps", roomName: "24FPS Room",
    description: "Create memorable chapter image associations", icon: "🎬", xpReward: 35, difficulty: "medium",
    gameType: "chapter_frames",
    instructions: "Create ONE memorable visual symbol for each chapter in a sequence of 5 chapters. Each symbol should be strange/memorable enough to stick in memory."
  },
  "24fps-genesis": {
    id: "24fps-genesis", name: "Genesis Frames", roomId: "24fps", roomName: "24FPS Room",
    description: "Build frames for Genesis 1-50", icon: "🏗️", xpReward: 25, difficulty: "easy",
    gameType: "genesis_frames",
    instructions: "Create memorable image symbols for Genesis chapters. Each should be a single vivid image that captures the chapter's main event."
  },
  "24fps-match": {
    id: "24fps-match", name: "Frame Match", roomId: "24fps", roomName: "24FPS Room",
    description: "Match chapters to their visual frames", icon: "🖼️", xpReward: 30, difficulty: "medium",
    gameType: "frame_match",
    instructions: "I'll give you 5 chapter symbols. Identify which chapter of which book each represents and explain why the symbol fits."
  },
  "24fps-sprint": {
    id: "24fps-sprint", name: "Frame Sprint", roomId: "24fps", roomName: "24FPS Room",
    description: "Rapid-fire chapter identification", icon: "⚡", xpReward: 40, difficulty: "hard",
    gameType: "frame_sprint",
    instructions: "Given a book of the Bible, create memorable frames for 10 consecutive chapters as fast as possible. Quality + speed = higher score."
  },
  "24fps-gallery": {
    id: "24fps-gallery", name: "Gallery Walk", roomId: "24fps", roomName: "24FPS Room",
    description: "Navigate a visual Bible gallery", icon: "🏛️", xpReward: 35, difficulty: "medium",
    gameType: "gallery_walk",
    instructions: "Design a 'gallery room' for one book of the Bible. Describe 7 'paintings' that would hang on the walls representing key chapters."
  },

  // ===== FLOOR 1 - BIBLE RENDERED =====
  "br-render": {
    id: "br-render", name: "Bible Rendered", roomId: "br", roomName: "Bible Rendered Room",
    description: "Create glyphs for 24-chapter blocks", icon: "🖼️", xpReward: 45, difficulty: "hard",
    gameType: "render_glyph",
    instructions: "Create ONE master symbol/glyph that represents an entire 24-chapter block (e.g., Genesis 1-24). Explain how it captures the major themes."
  },
  "br-glyph-match": {
    id: "br-glyph-match", name: "Glyph Match", roomId: "br", roomName: "Bible Rendered Room",
    description: "Match 24-chapter blocks to symbols", icon: "🔣", xpReward: 35, difficulty: "medium",
    gameType: "glyph_match",
    instructions: "Match these symbols to their 24-chapter blocks. Explain the connection between symbol and content."
  },
  "br-panorama": {
    id: "br-panorama", name: "Bible Panorama", roomId: "br", roomName: "Bible Rendered Room",
    description: "Fly over the 51-frame Bible legend", icon: "🗺️", xpReward: 30, difficulty: "medium",
    gameType: "bible_panorama",
    instructions: "Describe the 'flight path' over 5 consecutive 24-chapter blocks. What major landmarks would you see? What's the terrain like?"
  },
  "br-compression": {
    id: "br-compression", name: "Compression Master", roomId: "br", roomName: "Bible Rendered Room",
    description: "Compress themes into single symbols", icon: "📦", xpReward: 40, difficulty: "hard",
    gameType: "theme_compression",
    instructions: "Take a major biblical theme (covenant, redemption, judgment) and compress it into ONE symbol that appears across multiple 24-chapter blocks."
  },
  "br-memory": {
    id: "br-memory", name: "Memory Scan", roomId: "br", roomName: "Bible Rendered Room",
    description: "Test your 51-frame legend recall", icon: "🧠", xpReward: 50, difficulty: "hard",
    gameType: "memory_scan",
    instructions: "List the 10 most important 24-chapter blocks and their symbols. Explain why these blocks are pivotal to the Bible's story."
  },

  // ===== FLOOR 1 - TRANSLATION ROOM =====
  "tr-verse-icon": {
    id: "tr-verse-icon", name: "Verse to Icon", roomId: "tr", roomName: "Translation Room",
    description: "Convert verses into memorable images", icon: "🎨", xpReward: 20, difficulty: "easy",
    gameType: "verse_to_icon",
    instructions: "Take 3 verses and create a single memorable image for each. The image should capture the verse's core truth in visual form."
  },
  "tr-comic": {
    id: "tr-comic", name: "Comic Creator", roomId: "tr", roomName: "Translation Room",
    description: "Turn passages into 3-panel comics", icon: "📰", xpReward: 35, difficulty: "medium",
    gameType: "passage_comic",
    instructions: "Turn a short passage into a 3-panel comic. Describe each panel: the setting, characters, speech bubbles, and visual elements."
  },
  "tr-mural": {
    id: "tr-mural", name: "Mural Builder", roomId: "tr", roomName: "Translation Room",
    description: "Create panoramic book visualizations", icon: "🖌️", xpReward: 45, difficulty: "hard",
    gameType: "book_mural",
    instructions: "Design a mural for one book of the Bible. Describe the overall composition, key scenes, color symbolism, and central focal point."
  },
  "tr-concentration": {
    id: "tr-concentration", name: "Image Match", roomId: "tr", roomName: "Translation Room",
    description: "Memory matching with verse images", icon: "🧠", xpReward: 25, difficulty: "easy",
    gameType: "image_match",
    instructions: "Create pairs of images that match to verses. Each image pair should share a thematic connection that reveals a deeper truth."
  },
  "tr-translate": {
    id: "tr-translate", name: "Visual Translator", roomId: "tr", roomName: "Translation Room",
    description: "Abstract to concrete image conversion", icon: "🔄", xpReward: 30, difficulty: "medium",
    gameType: "abstract_visual",
    instructions: "Take an abstract theological concept (grace, faith, justification) and create 3 concrete visual images that explain it to a child."
  },

  // ===== FLOOR 1 - GEMS ROOM =====
  "gr-treasure": {
    id: "gr-treasure", name: "Treasure Hunt", roomId: "gr", roomName: "Gems Room",
    description: "Mine Scripture for rare combined truths", icon: "💎", xpReward: 40, difficulty: "medium",
    gameType: "gem_mining",
    instructions: "Combine 2-3 seemingly unrelated verses to discover a hidden gem truth that none of them reveal alone. Explain the discovery."
  },
  "gr-chef": {
    id: "gr-chef", name: "Gem Chef", roomId: "gr", roomName: "Gems Room",
    description: "Cook up theological connections", icon: "👨‍🍳", xpReward: 50, difficulty: "hard",
    gameType: "gem_cooking",
    instructions: "Take 4 'ingredients' (verses from different books) and 'cook' them into one cohesive theological insight. Show your recipe!"
  },
  "gr-combiner": {
    id: "gr-combiner", name: "Gem Combiner", roomId: "gr", roomName: "Gems Room",
    description: "Place 2-4 texts to discover insights", icon: "⚗️", xpReward: 45, difficulty: "hard",
    gameType: "gem_combining",
    instructions: "Combine exactly 3 OT and 2 NT texts to forge ONE brilliant insight about Christ. Show how each text contributes to the gem."
  },
  "gr-collector": {
    id: "gr-collector", name: "Gem Collector", roomId: "gr", roomName: "Gems Room",
    description: "Build your personal gem treasury", icon: "👑", xpReward: 35, difficulty: "medium",
    gameType: "gem_collection",
    instructions: "Share 3 personal gems you've discovered in Scripture. Each should be: (1) surprising, (2) Christ-centered, (3) practically applicable."
  },
  "gr-polish": {
    id: "gr-polish", name: "Gem Polish", roomId: "gr", roomName: "Gems Room",
    description: "Refine rough insights into clear gems", icon: "✨", xpReward: 30, difficulty: "medium",
    gameType: "gem_polishing",
    instructions: "Take a rough theological observation and polish it into a crystal-clear, memorable gem statement. Show the before and after."
  },

  // ===== FLOOR 2 - OBSERVATION ROOM =====
  "or-detective": {
    id: "or-detective", name: "Observation Detective", roomId: "or", roomName: "Observation Room",
    description: "Find details others miss in the text", icon: "🔍", xpReward: 35, difficulty: "medium",
    gameType: "text_detective",
    instructions: "Read a passage and find 10 details that most readers miss: unusual words, repeated phrases, structural patterns, surprising omissions."
  },
  "or-witness": {
    id: "or-witness", name: "Witness Trial", roomId: "or", roomName: "Observation Room",
    description: "Cross-examine Scripture passages", icon: "⚖️", xpReward: 45, difficulty: "hard",
    gameType: "witness_trial",
    instructions: "Cross-examine a passage like a lawyer. Ask 10 probing questions that reveal inconsistencies, tensions, or hidden meanings."
  },
  "or-fingerprint": {
    id: "or-fingerprint", name: "Fingerprint Logger", roomId: "or", roomName: "Observation Room",
    description: "Catalog observations without interpretation", icon: "🔎", xpReward: 25, difficulty: "easy",
    gameType: "observation_log",
    instructions: "Read a passage and list 15 pure observations (what you SEE in the text). No interpretations allowed - just facts!"
  },
  "or-scene": {
    id: "or-scene", name: "Crime Scene", roomId: "or", roomName: "Observation Room",
    description: "Investigate a passage like a detective", icon: "🕵️", xpReward: 35, difficulty: "medium",
    gameType: "crime_scene",
    instructions: "Treat a passage as a crime scene. Log all 'evidence': who's present, what happened, the sequence, witnesses, motive, and outcome."
  },
  "or-30": {
    id: "or-30", name: "30 Observations", roomId: "or", roomName: "Observation Room",
    description: "Generate 30 observations from one text", icon: "📝", xpReward: 50, difficulty: "hard",
    gameType: "observations_30",
    instructions: "Choose a short passage (5-10 verses) and generate exactly 30 distinct observations. Categories: setting, characters, actions, speech, structure."
  },

  // ===== FLOOR 2 - DEF-COM ROOM =====
  "dc-equation": {
    id: "dc-equation", name: "Equation Builder", roomId: "dc", roomName: "Def-Com Room",
    description: "Build theological equations from symbols", icon: "🧮", xpReward: 50, difficulty: "hard",
    gameType: "theological_equation",
    instructions: "Create a theological equation using symbols (Lamb + Altar = Atonement). Define each symbol and prove the equation from Scripture."
  },
  "dc-challenge": {
    id: "dc-challenge", name: "Equations Challenge", roomId: "dc", roomName: "Def-Com Room",
    description: "Solve symbolic Bible puzzles", icon: "🔢", xpReward: 45, difficulty: "hard",
    gameType: "equation_solve",
    instructions: "Solve this equation: [Symbol] + [Symbol] = [Result]. Identify what each symbol represents and the Scripture proof."
  },
  "dc-word-lab": {
    id: "dc-word-lab", name: "Word Lab", roomId: "dc", roomName: "Def-Com Room",
    description: "Deep Greek/Hebrew word analysis", icon: "🔬", xpReward: 35, difficulty: "medium",
    gameType: "word_study",
    instructions: "Take one Greek or Hebrew word. Explain its root meaning, semantic range, and how understanding it changes our reading of 3 passages."
  },
  "dc-culture": {
    id: "dc-culture", name: "Culture Context", roomId: "dc", roomName: "Def-Com Room",
    description: "Historical and cultural background study", icon: "📚", xpReward: 30, difficulty: "medium",
    gameType: "cultural_context",
    instructions: "Choose a passage and explain 5 cultural/historical details that modern readers miss. How does this context change interpretation?"
  },
  "dc-compare": {
    id: "dc-compare", name: "Version Compare", roomId: "dc", roomName: "Def-Com Room",
    description: "Compare translations for insight", icon: "📖", xpReward: 25, difficulty: "easy",
    gameType: "translation_compare",
    instructions: "Compare 3 translations of one verse. What differences do you notice? Which translation best captures the original meaning and why?"
  },

  // ===== FLOOR 2 - SYMBOLS/TYPES ROOM =====
  "st-connection": {
    id: "st-connection", name: "Symbol Connections", roomId: "st", roomName: "Symbols/Types Room",
    description: "Link symbols to their biblical meanings", icon: "🔗", xpReward: 35, difficulty: "medium",
    gameType: "symbol_links",
    instructions: "Take 5 biblical symbols (lamb, rock, vine, etc.) and trace each through 3 passages showing consistent meaning. Map the connections."
  },
  "st-chain": {
    id: "st-chain", name: "Chain Chess", roomId: "st", roomName: "Symbols/Types Room",
    description: "Build symbolic verse chains", icon: "♟️", xpReward: 50, difficulty: "hard",
    gameType: "symbol_chain",
    instructions: "Build a chain of 7 verses connected by ONE symbol. Each verse must develop the symbol's meaning further. Show the progression."
  },
  "st-profile": {
    id: "st-profile", name: "Symbol Profile", roomId: "st", roomName: "Symbols/Types Room",
    description: "Build profiles for major biblical symbols", icon: "📋", xpReward: 35, difficulty: "medium",
    gameType: "symbol_profile",
    instructions: "Create a complete profile for one biblical symbol: definition, key verses, what it represents, misuses, and Christ-connection."
  },
  "st-type-finder": {
    id: "st-type-finder", name: "Type Finder", roomId: "st", roomName: "Symbols/Types Room",
    description: "Identify OT types of Christ", icon: "👤", xpReward: 45, difficulty: "hard",
    gameType: "type_finder",
    instructions: "Identify 5 OT types of Christ. For each: the OT event/person, the NT fulfillment, and 3 parallel details between type and antitype."
  },
  "st-decode": {
    id: "st-decode", name: "Symbol Decode", roomId: "st", roomName: "Symbols/Types Room",
    description: "Decode symbolic language in prophecy", icon: "🗝️", xpReward: 50, difficulty: "hard",
    gameType: "prophecy_decode",
    instructions: "Take a prophetic passage with symbols (Daniel or Revelation). Decode each symbol using Scripture-interprets-Scripture method."
  },

  // ===== FLOOR 2 - QUESTIONS ROOM =====
  "qr-blitz": {
    id: "qr-blitz", name: "Question Blitz", roomId: "qr", roomName: "Questions Room",
    description: "Generate questions rapidly from text", icon: "❓", xpReward: 30, difficulty: "medium",
    gameType: "question_blitz",
    instructions: "Generate 20 questions from one passage in 5 minutes. Include who, what, when, where, why, and how questions."
  },
  "qr-escape": {
    id: "qr-escape", name: "Escape Room", roomId: "qr", roomName: "Questions Room",
    description: "Solve puzzles through questions", icon: "🚪", xpReward: 60, difficulty: "hard",
    gameType: "question_escape",
    instructions: "Answer these 5 questions correctly to 'escape.' Each answer unlocks the next question. Wrong answers add time!"
  },
  "qr-75": {
    id: "qr-75", name: "75 Questions", roomId: "qr", roomName: "Questions Room",
    description: "Generate 75 questions from one passage", icon: "🤔", xpReward: 55, difficulty: "hard",
    gameType: "questions_75",
    instructions: "Generate 75 questions: 25 intratextual (within text), 25 intertextual (cross-reference), 25 Phototheological (PT framework)."
  },
  "qr-intra": {
    id: "qr-intra", name: "Intratextual Quiz", roomId: "qr", roomName: "Questions Room",
    description: "Questions within the text itself", icon: "📖", xpReward: 35, difficulty: "medium",
    gameType: "intratextual",
    instructions: "Generate 15 intratextual questions - questions answerable ONLY from the passage itself. No outside knowledge needed."
  },
  "qr-inter": {
    id: "qr-inter", name: "Intertextual Quiz", roomId: "qr", roomName: "Questions Room",
    description: "Cross-reference questions", icon: "🔀", xpReward: 45, difficulty: "hard",
    gameType: "intertextual",
    instructions: "Generate 15 intertextual questions - questions that require other Scripture passages to answer. Provide the cross-references."
  },

  // ===== FLOOR 2 - Q&A ROOM =====
  "qa-branch": {
    id: "qa-branch", name: "Branch Study", roomId: "qa", roomName: "Q&A Room",
    description: "Build question-answer branches", icon: "🌳", xpReward: 40, difficulty: "medium",
    gameType: "branch_study",
    instructions: "Start with one question. Branch into 3 sub-questions. Answer each with Scripture. Show the Q&A tree structure."
  },
  "qa-chain": {
    id: "qa-chain", name: "Q&A Chains", roomId: "qa", roomName: "Q&A Room",
    description: "Chain verses that answer each other", icon: "💬", xpReward: 35, difficulty: "medium",
    gameType: "qa_chain",
    instructions: "Create a chain where each verse answers a question raised by the previous verse. Build a chain of 7 question-answer pairs."
  },
  "qa-courtroom": {
    id: "qa-courtroom", name: "Courtroom Cross", roomId: "qa", roomName: "Q&A Room",
    description: "Cross-examine with verse answers", icon: "⚖️", xpReward: 50, difficulty: "hard",
    gameType: "courtroom_cross",
    instructions: "Play prosecutor and defense. Ask 5 challenging questions about a doctrine. Answer each with Scripture as your witness."
  },
  "qa-alibi": {
    id: "qa-alibi", name: "Alibi Check", roomId: "qa", roomName: "Q&A Room",
    description: "Verify Scripture interpretations", icon: "🔍", xpReward: 35, difficulty: "medium",
    gameType: "alibi_check",
    instructions: "Take a common interpretation. Find 3 verses that support it and 2 that seem to challenge it. How do you reconcile them?"
  },
  "qa-witness": {
    id: "qa-witness", name: "Witness Box", roomId: "qa", roomName: "Q&A Room",
    description: "Let Scripture answer Scripture", icon: "📜", xpReward: 45, difficulty: "hard",
    gameType: "witness_box",
    instructions: "Put a verse 'in the witness box.' Ask it 10 questions. Let OTHER Scriptures provide the answers. Document the testimony."
  },

  // Continue with Floor 3-8 games...
  // ===== FLOOR 3 - NATURE FREESTYLE =====
  "nf-nature": {
    id: "nf-nature", name: "Nature Connections", roomId: "nf", roomName: "Nature Freestyle",
    description: "Find Scripture lessons in nature", icon: "🌿", xpReward: 35, difficulty: "medium",
    gameType: "nature_connections",
    instructions: "Choose 3 elements from nature. For each, find a Scripture parallel and explain the spiritual lesson. Be creative and specific."
  },
  "nf-freestyle": {
    id: "nf-freestyle", name: "Nature Freestyle", roomId: "nf", roomName: "Nature Freestyle",
    description: "Riff on natural world with Scripture", icon: "🌳", xpReward: 40, difficulty: "medium",
    gameType: "nature_freestyle",
    instructions: "Take one natural phenomenon (sunrise, storm, seed growth) and write a 5-minute devotional connecting it to 3 Scripture passages."
  },
  "nf-romans": {
    id: "nf-romans", name: "Romans 1:20 Walk", roomId: "nf", roomName: "Nature Freestyle",
    description: "See God's attributes in creation", icon: "🌄", xpReward: 25, difficulty: "easy",
    gameType: "romans_walk",
    instructions: "List 5 things in nature that reveal God's attributes (power, wisdom, love, order). Cite Romans 1:20 and expand on each."
  },
  "nf-parable": {
    id: "nf-parable", name: "Nature Parable", roomId: "nf", roomName: "Nature Freestyle",
    description: "Turn natural objects into lessons", icon: "🍃", xpReward: 35, difficulty: "medium",
    gameType: "nature_parable",
    instructions: "Create a parable like Jesus did. Start with something in nature and craft a teaching that reveals a Kingdom truth."
  },
  "nf-psalm": {
    id: "nf-psalm", name: "Psalm 19 Sprint", roomId: "nf", roomName: "Nature Freestyle",
    description: "Rapid nature-to-truth connections", icon: "☀️", xpReward: 45, difficulty: "hard",
    gameType: "psalm19_sprint",
    instructions: "In the style of Psalm 19, write how 10 different aspects of creation declare God's glory. Be poetic and theological."
  },

  // ===== FLOOR 3 - PERSONAL FREESTYLE =====
  "pf-parable": {
    id: "pf-parable", name: "Personal Parable", roomId: "pf", roomName: "Personal Freestyle",
    description: "Create life-to-Scripture links", icon: "🪞", xpReward: 35, difficulty: "medium",
    gameType: "personal_parable",
    instructions: "Take a recent personal experience and find 3 Scripture passages that illuminate its spiritual significance."
  },
  "pf-story": {
    id: "pf-story", name: "My Story Game", roomId: "pf", roomName: "Personal Freestyle",
    description: "Turn your story into Scripture truth", icon: "📔", xpReward: 30, difficulty: "easy",
    gameType: "my_story",
    instructions: "Share a personal testimony moment. Connect it to at least 2 Scripture passages that echo your experience."
  },
  "pf-testimony": {
    id: "pf-testimony", name: "Testimony Builder", roomId: "pf", roomName: "Personal Freestyle",
    description: "Frame experiences with verses", icon: "🎤", xpReward: 35, difficulty: "medium",
    gameType: "testimony_builder",
    instructions: "Build a 3-minute testimony framework. Include: before Christ, encounter, after. Frame each section with Scripture."
  },
  "pf-journal": {
    id: "pf-journal", name: "Life Journal", roomId: "pf", roomName: "Personal Freestyle",
    description: "Daily experience-to-Scripture links", icon: "📓", xpReward: 25, difficulty: "easy",
    gameType: "life_journal",
    instructions: "Journal about today. Find Scripture connections in: (1) a struggle you faced, (2) a joy you experienced, (3) a lesson you learned."
  },
  "pf-mirror": {
    id: "pf-mirror", name: "Mirror Match", roomId: "pf", roomName: "Personal Freestyle",
    description: "Match your struggles to biblical characters", icon: "🔮", xpReward: 40, difficulty: "medium",
    gameType: "mirror_match",
    instructions: "Identify 3 biblical characters whose struggles mirror your own. How did they overcome? What can you learn?"
  },

  // ===== FLOOR 3 - BIBLE FREESTYLE =====
  "bf-genetics": {
    id: "bf-genetics", name: "Verse Genetics", roomId: "bf", roomName: "Bible Freestyle",
    description: "Find verse family connections", icon: "🧬", xpReward: 45, difficulty: "hard",
    gameType: "verse_genetics",
    instructions: "Take one verse and find its 'genetic relatives': parent verses (sources), siblings (parallels), and children (developments)."
  },
  "bf-freestyle": {
    id: "bf-freestyle", name: "Bible Freestyle", roomId: "bf", roomName: "Bible Freestyle",
    description: "Speed-link verses spontaneously", icon: "⚡", xpReward: 35, difficulty: "medium",
    gameType: "bible_freestyle",
    instructions: "Starting from any verse, free-associate to 7 other verses. Explain each connection as you go. No planning - just flow!"
  },
  "bf-cypher": {
    id: "bf-cypher", name: "Verse Cypher", roomId: "bf", roomName: "Bible Freestyle",
    description: "One verse sparks another in flow", icon: "🎤", xpReward: 50, difficulty: "hard",
    gameType: "verse_cypher",
    instructions: "Like a rap cypher, but with verses. Start with one verse, respond with another that builds on it. Create a 10-verse chain."
  },
  "bf-family": {
    id: "bf-family", name: "Family Tree", roomId: "bf", roomName: "Bible Freestyle",
    description: "Map verse genealogies", icon: "🌲", xpReward: 35, difficulty: "medium",
    gameType: "family_tree",
    instructions: "Create a 'family tree' for a key verse: what OT verses are its ancestors? What NT verses are its descendants?"
  },
  "bf-echo": {
    id: "bf-echo", name: "Echo Chamber", roomId: "bf", roomName: "Bible Freestyle",
    description: "Find echoing verses across books", icon: "🔊", xpReward: 45, difficulty: "hard",
    gameType: "echo_chamber",
    instructions: "Find 5 'echo pairs' - verses from different books that echo the same truth in different words. Explain each echo."
  },

  // ===== FLOOR 3 - HISTORY FREESTYLE =====
  "hf-controversy": {
    id: "hf-controversy", name: "Controversy Raid", roomId: "hf", roomName: "History Freestyle",
    description: "Navigate cultural debates biblically", icon: "📜", xpReward: 50, difficulty: "hard",
    gameType: "controversy_raid",
    instructions: "Take a modern controversy. Present the biblical perspective using: (1) direct Scripture, (2) biblical principles, (3) Christ's example."
  },
  "hf-culture": {
    id: "hf-culture", name: "Culture Analysis", roomId: "hf", roomName: "History Freestyle",
    description: "Analyze culture with Scripture lens", icon: "🌍", xpReward: 40, difficulty: "medium",
    gameType: "culture_analysis",
    instructions: "Choose a cultural trend. Analyze it biblically: What's good? What's dangerous? What Scripture applies?"
  },
  "hf-headlines": {
    id: "hf-headlines", name: "Headlines Game", roomId: "hf", roomName: "History Freestyle",
    description: "Apply Scripture to current events", icon: "📰", xpReward: 45, difficulty: "hard",
    gameType: "headlines_game",
    instructions: "Take 3 recent headlines. For each, provide: (1) the biblical lens to understand it, (2) relevant Scripture, (3) Christian response."
  },
  "hf-history": {
    id: "hf-history", name: "History Lens", roomId: "hf", roomName: "History Freestyle",
    description: "See redemptive history in world events", icon: "🏛️", xpReward: 50, difficulty: "hard",
    gameType: "history_lens",
    instructions: "Choose a historical event. Explain how it fits into God's redemptive plan and the Great Controversy narrative."
  },
  "hf-social": {
    id: "hf-social", name: "Social Issues", roomId: "hf", roomName: "History Freestyle",
    description: "Biblical response to modern issues", icon: "🤝", xpReward: 40, difficulty: "medium",
    gameType: "social_issues",
    instructions: "Take a social justice issue. Present the balanced biblical response using: OT principles, Jesus' example, apostolic teaching."
  },

  // ===== FLOOR 3 - LISTENING ROOM =====
  "lr-listen": {
    id: "lr-listen", name: "Listen & Respond", roomId: "lr", roomName: "Listening Room",
    description: "Hear and connect what you learn", icon: "👂", xpReward: 30, difficulty: "medium",
    gameType: "listen_respond",
    instructions: "Reflect on a recent sermon or teaching you heard. Extract 3 key points and find Scripture support for each."
  },
  "lr-active": {
    id: "lr-active", name: "Active Listening", roomId: "lr", roomName: "Listening Room",
    description: "Observe what others share", icon: "🎧", xpReward: 25, difficulty: "easy",
    gameType: "active_listening",
    instructions: "Listen to someone's testimony or story. Identify: (1) their core struggle, (2) God's intervention, (3) Scripture that applies."
  },
  "lr-sermon": {
    id: "lr-sermon", name: "Sermon Notes", roomId: "lr", roomName: "Listening Room",
    description: "Connect sermon points to verses", icon: "📋", xpReward: 35, difficulty: "medium",
    gameType: "sermon_notes",
    instructions: "Take notes on a sermon. For each main point, add: (1) additional Scripture support, (2) personal application, (3) questions raised."
  },
  "lr-conversation": {
    id: "lr-conversation", name: "Conversation Catch", roomId: "lr", roomName: "Listening Room",
    description: "Spot Scripture in daily talk", icon: "💬", xpReward: 30, difficulty: "medium",
    gameType: "conversation_catch",
    instructions: "Reflect on recent conversations. Identify 3 moments where Scripture could have enriched the discussion. What would you have shared?"
  },
  "lr-testimony": {
    id: "lr-testimony", name: "Testimony Links", roomId: "lr", roomName: "Listening Room",
    description: "Connect testimonies to themes", icon: "🎙️", xpReward: 25, difficulty: "easy",
    gameType: "testimony_links",
    instructions: "Listen to or read 3 testimonies. Identify the common biblical themes that run through them. What patterns do you see?"
  },

  // ===== FLOOR 4 - CONCENTRATION ROOM =====
  "cr-focus": {
    id: "cr-focus", name: "Concentration Room", roomId: "cr", roomName: "Concentration Room",
    description: "Christ-centered focus training", icon: "✝️", xpReward: 40, difficulty: "medium",
    gameType: "christ_focus",
    instructions: "Take any OT narrative. Identify: (1) where Christ is hidden, (2) what role He plays, (3) how this passage points forward to the cross."
  },
  "cr-lock": {
    id: "cr-lock", name: "Christ Lock", roomId: "cr", roomName: "Concentration Room",
    description: "Unlock Christ in every text", icon: "🔓", xpReward: 50, difficulty: "hard",
    gameType: "christ_lock",
    instructions: "Take a passage that seems to have nothing to do with Christ. 'Unlock' it by showing how it points to Him. Use typology, prophecy, or theme."
  },
  "cr-magnify": {
    id: "cr-magnify", name: "Christ Magnifier", roomId: "cr", roomName: "Concentration Room",
    description: "Find Christ where He seems hidden", icon: "🔍", xpReward: 50, difficulty: "hard",
    gameType: "christ_magnify",
    instructions: "Choose a Levitical law or genealogy - something that seems dry. Magnify Christ within it. Show the beauty hidden in the details."
  },
  "cr-thread": {
    id: "cr-thread", name: "Scarlet Thread", roomId: "cr", roomName: "Concentration Room",
    description: "Trace Christ through OT passages", icon: "🧵", xpReward: 55, difficulty: "hard",
    gameType: "scarlet_thread",
    instructions: "Trace the 'scarlet thread' of redemption through 5 OT passages. Show how each connects to Christ's blood and our salvation."
  },
  "cr-emmaus": {
    id: "cr-emmaus", name: "Emmaus Walk", roomId: "cr", roomName: "Concentration Room",
    description: "All Scripture points to Him", icon: "🚶", xpReward: 40, difficulty: "medium",
    gameType: "emmaus_walk",
    instructions: "Like Jesus on the Emmaus road, take a section of the OT and explain how it's all about Him. 'Beginning at Moses and all the prophets...'"
  },

  // ===== FLOOR 4 - DIMENSIONS ROOM =====
  "dr-dimensions": {
    id: "dr-dimensions", name: "Dimensions Room", roomId: "dr", roomName: "Dimensions Room",
    description: "See all 5 dimensions of Scripture", icon: "💠", xpReward: 50, difficulty: "hard",
    gameType: "five_dimensions",
    instructions: "Apply all 5 dimensions to one verse: (1) Literal meaning, (2) Christ connection, (3) Application to me, (4) Church application, (5) Heavenly fulfillment."
  },
  "dr-sprint": {
    id: "dr-sprint", name: "Dimension Sprint", roomId: "dr", roomName: "Dimensions Room",
    description: "Rapidly apply all 5 dimensions", icon: "🎯", xpReward: 35, difficulty: "medium",
    gameType: "dimension_sprint",
    instructions: "Take 3 verses. For each, give a one-sentence statement for all 5 dimensions. Speed and accuracy both matter."
  },
  "dr-lens": {
    id: "dr-lens", name: "Five Lenses", roomId: "dr", roomName: "Dimensions Room",
    description: "View text through literal, Christ, me, church, heaven", icon: "👓", xpReward: 50, difficulty: "hard",
    gameType: "five_lenses",
    instructions: "Put on each 'lens' and describe what you see in the passage. Write a full paragraph for each perspective."
  },
  "dr-ladder": {
    id: "dr-ladder", name: "Dimension Ladder", roomId: "dr", roomName: "Dimensions Room",
    description: "Climb from literal to heavenly", icon: "🪜", xpReward: 40, difficulty: "medium",
    gameType: "dimension_ladder",
    instructions: "Start at the 'ground floor' (literal) and climb the ladder through each dimension. Show the ascent of meaning."
  },
  "dr-prism": {
    id: "dr-prism", name: "Prism Study", roomId: "dr", roomName: "Dimensions Room",
    description: "Refract one verse into 5 meanings", icon: "💎", xpReward: 55, difficulty: "hard",
    gameType: "prism_study",
    instructions: "Like light through a prism, refract one verse into its 5 dimensional colors. Each color should be distinct and beautiful."
  },

  // Additional key games from higher floors...
  "bl-journey": {
    id: "bl-journey", name: "Sanctuary Journey", roomId: "bl", roomName: "Blue Room (Sanctuary)",
    description: "Walk through the sanctuary stations", icon: "⛪", xpReward: 50, difficulty: "hard",
    gameType: "sanctuary_journey",
    instructions: "Trace the gospel through all sanctuary stations: Altar, Laver, Lampstand, Showbread, Incense, Ark. Explain each step and its Christ-connection."
  },
  "frm-burn": {
    id: "frm-burn", name: "Heart Fire", roomId: "frm", roomName: "Fire Room",
    description: "Let Scripture burn in your heart", icon: "🔥", xpReward: 40, difficulty: "medium",
    gameType: "heart_fire",
    instructions: "Choose a passage that convicts you deeply. Write what it stirs: conviction, comfort, challenge, or call to change."
  },
};

export function RoomGamePlay() {
  const { gameId } = useParams();
  const navigate = useNavigate();
  const [userInput, setUserInput] = useState("");
  const [verseReference, setVerseReference] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [result, setResult] = useState<{ valid: boolean; feedback: string; score: number } | null>(null);
  const [totalScore, setTotalScore] = useState(0);
  const [roundsPlayed, setRoundsPlayed] = useState(0);

  const game = gameId ? gameConfigs[gameId] : null;
  const { awardXp } = useMastery(game?.roomId || "", 1);

  if (!game) {
    return (
      <div className="min-h-screen bg-gradient-subtle">
        <Navigation />
        <div className="container mx-auto px-4 py-8 text-center">
          <h1 className="text-2xl font-bold mb-4">Game Not Found</h1>
          <p className="text-muted-foreground mb-6">This game type is coming soon!</p>
          <Link to="/games">
            <Button><ArrowLeft className="mr-2 h-4 w-4" />Back to Games</Button>
          </Link>
        </div>
      </div>
    );
  }

  const handleSubmit = async () => {
    if (!userInput.trim()) {
      toast.error("Please enter your response");
      return;
    }

    setIsSubmitting(true);
    try {
      const { data, error } = await supabase.functions.invoke("jeeves", {
        body: {
          mode: "validate_room_game",
          gameType: game.gameType,
          roomId: game.roomId,
          roomName: game.roomName,
          userInput,
          verseReference,
          difficulty: game.difficulty,
          instructions: game.instructions,
        }
      });

      if (error) throw error;

      const isValid = data.valid ?? (data.quality === "excellent" || data.quality === "good");
      const gameResult = {
        valid: isValid,
        feedback: data.feedback || "Good attempt!",
        score: data.score ?? (isValid ? game.xpReward : Math.floor(game.xpReward / 3))
      };

      setResult(gameResult);
      setTotalScore(prev => prev + gameResult.score);
      setRoundsPlayed(prev => prev + 1);

      if (gameResult.valid) {
        toast.success(`Excellent! +${gameResult.score} XP`);
        awardXp({ xpAmount: gameResult.score, exerciseCompleted: true });
      } else {
        toast.info("Keep practicing!");
      }
    } catch (error) {
      console.error("Game validation error:", error);
      toast.error("Failed to validate. Try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleNextRound = () => {
    setUserInput("");
    setVerseReference("");
    setResult(null);
  };

  const difficultyColors = {
    easy: "bg-green-500/20 text-green-700 dark:text-green-300",
    medium: "bg-yellow-500/20 text-yellow-700 dark:text-yellow-300",
    hard: "bg-red-500/20 text-red-700 dark:text-red-300"
  };

  return (
    <div className="min-h-screen bg-gradient-subtle">
      <Navigation />
      <div className="container mx-auto px-4 py-8">
        <Button variant="ghost" onClick={() => navigate(-1)} className="mb-6">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>

        <div className="max-w-3xl mx-auto space-y-6">
          {/* Game Header */}
          <Card className="bg-gradient-to-br from-primary/10 to-accent/10 border-primary/20">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-4xl">{game.icon}</span>
                  <div>
                    <CardTitle className="text-2xl">{game.name}</CardTitle>
                    <CardDescription>{game.roomName}</CardDescription>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <Badge className={difficultyColors[game.difficulty]}>{game.difficulty}</Badge>
                  <span className="text-sm text-muted-foreground flex items-center gap-1">
                    <Trophy className="h-4 w-4" />
                    +{game.xpReward} XP
                  </span>
                </div>
              </div>
            </CardHeader>
          </Card>

          {/* Score Display */}
          {roundsPlayed > 0 && (
            <Card className="bg-gradient-to-r from-amber-500/10 to-yellow-500/10 border-amber-500/20">
              <CardContent className="py-4">
                <div className="flex justify-between items-center">
                  <span className="font-medium">Session Progress</span>
                  <div className="flex items-center gap-4">
                    <span className="text-sm text-muted-foreground">Rounds: {roundsPlayed}</span>
                    <span className="font-bold text-lg flex items-center gap-1">
                      <Star className="h-5 w-5 text-amber-500" />
                      {totalScore} XP
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Instructions */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lightbulb className="h-5 w-5 text-yellow-500" />
                Instructions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">{game.instructions}</p>
            </CardContent>
          </Card>

          {/* Input Area */}
          {!result ? (
            <Card>
              <CardHeader>
                <CardTitle>Your Response</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">
                    Verse/Passage Reference (optional)
                  </label>
                  <Input
                    value={verseReference}
                    onChange={(e) => setVerseReference(e.target.value)}
                    placeholder="e.g., Genesis 1:1-5 or John 3:16"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">
                    Your Answer
                  </label>
                  <Textarea
                    value={userInput}
                    onChange={(e) => setUserInput(e.target.value)}
                    placeholder="Type your response here..."
                    className="min-h-[200px]"
                  />
                </div>
                <Button 
                  onClick={handleSubmit} 
                  disabled={isSubmitting || !userInput.trim()}
                  className="w-full"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Validating...
                    </>
                  ) : (
                    <>
                      <Sparkles className="mr-2 h-4 w-4" />
                      Submit Answer
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          ) : (
            <Card className={result.valid ? "border-green-500/50" : "border-yellow-500/50"}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  {result.valid ? (
                    <CheckCircle className="h-6 w-6 text-green-500" />
                  ) : (
                    <XCircle className="h-6 w-6 text-yellow-500" />
                  )}
                  {result.valid ? "Excellent Work!" : "Keep Growing!"}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 rounded-lg bg-muted/50">
                  <p className="font-medium mb-2">Jeeves says:</p>
                  <p className="text-muted-foreground">{result.feedback}</p>
                </div>
                <div className="flex items-center justify-between p-4 rounded-lg bg-primary/5">
                  <span className="font-medium">XP Earned:</span>
                  <span className="text-xl font-bold text-primary">+{result.score}</span>
                </div>
                <div className="flex gap-3">
                  <Button onClick={handleNextRound} className="flex-1">
                    Play Again
                  </Button>
                  <Button variant="outline" onClick={() => navigate(-1)}>
                    Back to Room
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}

export default RoomGamePlay;
