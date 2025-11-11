import { Compass, BookOpen, Target, Flame, Crown } from "lucide-react";

export const categoryIcons = {
  explorer: Compass,
  scholar: BookOpen,
  perfectionist: Target,
  dedicated: Flame,
  master: Crown,
  general: Trophy,
} as const;

export const categoryDescriptions = {
  explorer: "Discover new rooms and explore the palace",
  scholar: "Master biblical knowledge and understanding",
  perfectionist: "Complete challenges with precision",
  dedicated: "Show consistency and commitment",
  master: "Reach the highest levels of mastery",
  general: "General achievements and milestones",
} as const;

export const categoryColors = {
  explorer: "from-blue-500 to-cyan-500",
  scholar: "from-purple-500 to-indigo-500",
  perfectionist: "from-green-500 to-emerald-500",
  dedicated: "from-orange-500 to-red-500",
  master: "from-yellow-500 to-amber-500",
  general: "from-gray-500 to-slate-500",
} as const;

import { Trophy } from "lucide-react";
