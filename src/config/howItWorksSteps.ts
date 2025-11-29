import { 
  Building2, 
  BookOpen, 
  Sparkles, 
  Calendar, 
  Video, 
  FileText, 
  Gamepad2, 
  Brain,
  Search,
  Play,
  Target,
  Layers,
  MessageSquare,
  Users,
  Plus,
  Zap,
  Trophy,
  Heart,
  Eye,
  Lightbulb,
  Home
} from "lucide-react";
import { LucideIcon } from "lucide-react";

export interface HowItWorksStep {
  title: string;
  description: string;
  highlights: string[];
  icon: LucideIcon;
}

export const palaceSteps: HowItWorksStep[] = [
  {
    title: "Welcome to the Palace",
    description: "The Palace is your visual learning home for Phototheology. It contains 8 floors, each with specific rooms designed to help you study Scripture systematically.",
    highlights: [
      "8 floors of progressive learning",
      "Each floor builds on previous skills",
      "Rooms contain specific study techniques"
    ],
    icon: Building2
  },
  {
    title: "Navigate the Floors",
    description: "Start from Floor 1 (Furnishing) and work your way up. Each floor unlocks new study methods and deeper understanding.",
    highlights: [
      "Floor 1-2: Memory & Investigation (Width)",
      "Floor 3: Freestyle connections (Time)",
      "Floor 4-6: Christ-centered depth (Depth)",
      "Floor 7-8: Spiritual transformation (Height)"
    ],
    icon: Layers
  },
  {
    title: "Enter Each Room",
    description: "Click on any room to learn its technique. Each room has lessons, practice exercises, and AI-assisted study tools.",
    highlights: [
      "Read the room's purpose and method",
      "Practice with guided exercises",
      "Ask Jeeves for personalized help"
    ],
    icon: Search
  },
  {
    title: "Track Your Progress",
    description: "Your progress is tracked as you complete rooms. Earn badges and achievements as you master each technique.",
    highlights: [
      "Visual progress indicators",
      "Unlock achievements",
      "Build your mastery level"
    ],
    icon: Trophy
  }
];

export const cardDeckSteps: HowItWorksStep[] = [
  {
    title: "Welcome to the Study Deck",
    description: "The Study Deck turns Phototheology principles into cards you can draw. Each card prompts you to analyze Scripture through a specific lens.",
    highlights: [
      "52+ principle cards from all 8 floors",
      "AI-powered verse analysis",
      "Save insights as gems"
    ],
    icon: Sparkles
  },
  {
    title: "Enter Your Verse",
    description: "Type any Bible verse or passage you want to study. The deck will help you analyze it through multiple Phototheology principles.",
    highlights: [
      "Enter any verse reference",
      "Or paste the full text",
      "Works with any translation"
    ],
    icon: BookOpen
  },
  {
    title: "Draw a Card",
    description: "Click 'Draw Card' to receive a random principle. The card will prompt you with a question to answer about your verse.",
    highlights: [
      "Random or filtered by floor",
      "Each card has a guiding question",
      "Draw multiple cards per verse"
    ],
    icon: Play
  },
  {
    title: "Get AI Feedback",
    description: "Answer the prompt, then ask Jeeves for feedback. The AI will help deepen your understanding and suggest connections.",
    highlights: [
      "Personalized AI responses",
      "Cross-reference suggestions",
      "Save your best insights"
    ],
    icon: MessageSquare
  }
];

export const readingPlansSteps: HowItWorksStep[] = [
  {
    title: "Choose a Reading Plan",
    description: "Select from curated reading plans designed to take you through Scripture systematically. Options include book studies, yearly plans, and custom plans.",
    highlights: [
      "Book-a-month focused study",
      "Full Bible yearly plans",
      "Create your own custom plan"
    ],
    icon: Calendar
  },
  {
    title: "Select Your Translation",
    description: "Pick your preferred Bible translation when starting a plan. You can read in KJV, NIV, ESV, and many more.",
    highlights: [
      "Multiple translations available",
      "Switch anytime",
      "Compare versions"
    ],
    icon: BookOpen
  },
  {
    title: "Daily Reading",
    description: "Each day, you'll receive your assigned passages. Read at your own pace and mark chapters as complete.",
    highlights: [
      "Clear daily assignments",
      "Progress tracking",
      "Catch up if you miss days"
    ],
    icon: Target
  },
  {
    title: "Apply PT Principles",
    description: "As you read, apply Phototheology rooms to deepen your study. Use the Study Bible integration for enhanced analysis.",
    highlights: [
      "Floor-by-floor study guides",
      "AI-assisted questions",
      "Journal your insights"
    ],
    icon: Layers
  }
];

export const devotionalsSteps: HowItWorksStep[] = [
  {
    title: "Create Devotionals",
    description: "Generate personalized devotional plans tailored to your spiritual needs. Choose themes, formats, and duration.",
    highlights: [
      "AI-generated content",
      "Multiple formats available",
      "Customizable duration (7-30 days)"
    ],
    icon: Plus
  },
  {
    title: "Choose Your Format",
    description: "Select from various devotional styles: Standard, 24FPS Visual, Blueprint, Palace Tour, or Verse Genetics.",
    highlights: [
      "Standard: Traditional devotionals",
      "24FPS: Visual memory anchors",
      "Blueprint: Life application focus"
    ],
    icon: Layers
  },
  {
    title: "Share with Others",
    description: "Create devotionals for friends, family, or church members. Share via link or track their progress.",
    highlights: [
      "Create for others",
      "Share via link",
      "Track engagement"
    ],
    icon: Heart
  },
  {
    title: "Daily Practice",
    description: "Each day includes Scripture, reflection, Christ connection, prayer, and a challenge to apply what you've learned.",
    highlights: [
      "Scripture focus",
      "Reflection prompts",
      "Actionable challenges"
    ],
    icon: Target
  }
];

export const videoTrainingSteps: HowItWorksStep[] = [
  {
    title: "Video Library",
    description: "Access our growing library of video tutorials teaching Phototheology principles and techniques.",
    highlights: [
      "Step-by-step tutorials",
      "Multiple categories",
      "Watch at your own pace"
    ],
    icon: Video
  },
  {
    title: "Browse by Category",
    description: "Filter videos by topic: Getting Started, Palace Overview, Individual Rooms, Advanced Techniques, and more.",
    highlights: [
      "Organized categories",
      "Beginner to advanced",
      "Quick filters"
    ],
    icon: Search
  },
  {
    title: "Watch & Learn",
    description: "Click any video to watch. Videos include demonstrations, examples, and practical applications.",
    highlights: [
      "High-quality instruction",
      "Real Scripture examples",
      "Pause and practice"
    ],
    icon: Play
  },
  {
    title: "Apply What You Learn",
    description: "After watching, practice the techniques in the Palace, Study Bible, or Study Deck.",
    highlights: [
      "Immediate application",
      "Link to related tools",
      "Track your progress"
    ],
    icon: Target
  }
];

export const myStudiesSteps: HowItWorksStep[] = [
  {
    title: "Your Study Hub",
    description: "My Studies is your personal workspace for Bible study notes, insights, and saved analyses.",
    highlights: [
      "All your studies in one place",
      "Searchable notes",
      "Tag organization"
    ],
    icon: FileText
  },
  {
    title: "Create New Studies",
    description: "Start fresh with templates or create your own. Use Verse Analysis, Chapter Study, or Book Overview templates.",
    highlights: [
      "Pre-built templates",
      "Rich text editor",
      "Save as you go"
    ],
    icon: Plus
  },
  {
    title: "Organize with Tags",
    description: "Add tags to categorize your studies. Filter by topic, book, or principle for quick access.",
    highlights: [
      "Custom tags",
      "Smart filtering",
      "Quick search"
    ],
    icon: Search
  },
  {
    title: "Review & Continue",
    description: "Return to any study to continue where you left off. Track your study habits with analytics.",
    highlights: [
      "Auto-save feature",
      "Study analytics",
      "Export options"
    ],
    icon: Eye
  }
];

export const gamesSteps: HowItWorksStep[] = [
  {
    title: "Learn Through Play",
    description: "Games make learning fun! Each game is designed to reinforce specific Phototheology principles and Bible knowledge.",
    highlights: [
      "Multiple game modes",
      "Solo and multiplayer",
      "Earn achievements"
    ],
    icon: Gamepad2
  },
  {
    title: "Choose Your Challenge",
    description: "Select from story sequencing, verse memory, parallels matching, and more. Each game targets different rooms.",
    highlights: [
      "Filter by floor/room",
      "Multiple difficulty levels",
      "Timed or relaxed modes"
    ],
    icon: Target
  },
  {
    title: "Compete & Collaborate",
    description: "Play against AI, challenge friends, or join group escape rooms. Leaderboards track top performers.",
    highlights: [
      "Multiplayer options",
      "Group escape rooms",
      "Leaderboards"
    ],
    icon: Users
  },
  {
    title: "Track Progress",
    description: "As you play, you're reinforcing learning. Games count toward your overall mastery score.",
    highlights: [
      "Points and badges",
      "Mastery tracking",
      "Achievement unlocks"
    ],
    icon: Trophy
  }
];

export const memoryPalaceSteps: HowItWorksStep[] = [
  {
    title: "Visual Memory System",
    description: "The Memory Palace technique uses spatial memory to remember Scripture. Convert verses to vivid images placed in familiar locations.",
    highlights: [
      "Ancient memory technique",
      "Visual associations",
      "Spatial memory leverage"
    ],
    icon: Brain
  },
  {
    title: "Create Memory Lists",
    description: "Build lists of verses to memorize. Use templates or create your own collection.",
    highlights: [
      "Pre-built templates",
      "Custom verse lists",
      "Share with others"
    ],
    icon: Plus
  },
  {
    title: "Practice Techniques",
    description: "Learn different memory methods: First Letter, Visual Hook, Palace Placement, and more.",
    highlights: [
      "Multiple techniques",
      "Guided practice",
      "Spaced repetition"
    ],
    icon: Lightbulb
  },
  {
    title: "Track Mastery",
    description: "Your progress is tracked as you practice. Watch your recall improve over time.",
    highlights: [
      "Mastery levels",
      "Streak tracking",
      "Review reminders"
    ],
    icon: Trophy
  }
];
