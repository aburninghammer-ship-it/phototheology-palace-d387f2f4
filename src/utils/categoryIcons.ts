import { 
  Trophy, Brain, GraduationCap, Flame, Gamepad2, BookOpen, 
  Heart, Users, Handshake, Dumbbell, Compass, Code, 
  ScrollText, Church 
} from "lucide-react";

export const categoryIcons = {
  memory: Brain,
  mastery: GraduationCap,
  streaks: Flame,
  games: Gamepad2,
  scripture: BookOpen,
  devotionals: Heart,
  community: Users,
  partnership: Handshake,
  training: Dumbbell,
  explorer: Compass,
  pt_coding: Code,
  prophecy: ScrollText,
  ministry: Church,
  general: Trophy,
} as const;

export const categoryDescriptions = {
  memory: "Palace rooms, visualization, and 24FPS mastery",
  mastery: "Floor completions and assessment achievements",
  streaks: "Daily consistency and study habits",
  games: "Escape rooms, Bible games, and challenges",
  scripture: "Verses memorized and chapters read",
  devotionals: "Personalized plans and shared devotionals",
  community: "Posts, comments, and interactions",
  partnership: "Study partner activities and discipleship",
  training: "Drills completed and perfect scores",
  explorer: "Feature discovery and app exploration",
  pt_coding: "Phototheology codes, dimensions, and systems",
  prophecy: "Daniel & Revelation prophecy studies",
  ministry: "Isaiah 58 service and digital evangelism",
  general: "General achievements and milestones",
} as const;

export const categoryColors = {
  memory: "from-purple-500 to-violet-600",
  mastery: "from-yellow-500 to-amber-600",
  streaks: "from-orange-500 to-red-600",
  games: "from-green-500 to-emerald-600",
  scripture: "from-blue-500 to-indigo-600",
  devotionals: "from-pink-500 to-rose-600",
  community: "from-cyan-500 to-teal-600",
  partnership: "from-indigo-500 to-purple-600",
  training: "from-red-500 to-orange-600",
  explorer: "from-teal-500 to-cyan-600",
  pt_coding: "from-violet-500 to-purple-600",
  prophecy: "from-amber-500 to-yellow-600",
  ministry: "from-rose-500 to-pink-600",
  general: "from-gray-500 to-slate-600",
} as const;

// Category display order for UI
export const categoryOrder = [
  'memory',
  'mastery', 
  'streaks',
  'games',
  'scripture',
  'devotionals',
  'community',
  'partnership',
  'training',
  'explorer',
  'pt_coding',
  'prophecy',
  'ministry',
] as const;

export type AchievementCategory = keyof typeof categoryIcons;
