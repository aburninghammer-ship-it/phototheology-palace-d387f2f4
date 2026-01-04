import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import {
  Menu,
  Building2,
  BookOpen,
  Sparkles,
  User,
  CreditCard,
  LogOut,
  Clock,
  Star,
  Home,
  Gamepad2,
  Users,
  GraduationCap,
  Zap,
  Trophy,
  Trash2,
  Brain,
  LayoutGrid,
  Heart,
  Headphones,
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useRecentPages } from "@/hooks/useRecentPages";
import { usePageBookmarks } from "@/hooks/usePageBookmarks";
import { useUserPreferences } from "@/hooks/useUserPreferences";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

const categoryConfig = {
  study: {
    title: "Study",
    icon: BookOpen,
    links: [
      { to: "/bible", label: "PT Study Bible", icon: "📖" },
      { to: "/audio-bible", label: "Audio Bible", icon: "🎧" },
      { to: "/bible-image-library", label: "PT Image Bible", icon: "🎨" },
      { to: "/card-deck", label: "PT Study Deck", icon: "🃏" },
      { to: "/reading-plans", label: "Reading Plans", icon: "📅" },
      { to: "/daily-reading", label: "Daily Reading", icon: "📖" },
      { to: "/devotionals", label: "Devotionals", icon: "💜" },
      { to: "/encyclopedia", label: "Encyclopedia", icon: "🔍" },
      { to: "/video-training", label: "Video Training", icon: "🎥" },
      { to: "/my-studies", label: "My Studies", icon: "📝" },
      { to: "/notes", label: "Notes", icon: "📒" },
      { to: "/sessions", label: "Study Sessions", icon: "📋" },
      { to: "/palace/floor/1/room/gr", label: "Produce a Gem", icon: "💎" },
      { to: "/memory", label: "Memory Palace", icon: "🧠" },
      { to: "/verse-memory-hall", label: "Verse Memory Hall (Legacy)", icon: "📚" },
      { to: "/quarterly-study", label: "Lesson Study", icon: "📅" },
      { to: "/flashcards", label: "Flashcards", icon: "🗂️" },
      { to: "/bible-study-series", label: "Bible Study Series", icon: "📚" },
    ],
  },
  practice: {
    title: "Practice",
    icon: Gamepad2,
    links: [
      { to: "/games", label: "Palace Games", icon: "🎮" },
      { to: "/kids-games", label: "Kids Games", icon: "👶" },
      { to: "/drill-drill", label: "Gather Fragments", icon: "🎯" },
      { to: "/training-drills", label: "Training Drills", icon: "⚡" },
      { to: "/daily-challenges", label: "Daily Challenges", icon: "📅" },
      { to: "/genesis-challenge", label: "Genesis High Rise", icon: "🏢" },
      { to: "/treasure-hunt", label: "Treasure Hunt", icon: "🏆" },
      { to: "/escape-room", label: "Escape Rooms", icon: "🚨" },
      { to: "/pt-multiplayer", label: "PT Multiplayer", icon: "🎯" },
    ],
  },
  blueprints: {
    title: "Blueprints",
    icon: Building2,
    links: [
      { to: "/blueprint-marriage", label: "Dating & Marriage", icon: "💍" },
      { to: "/blueprint-grief", label: "Grieving", icon: "💙" },
      { to: "/blueprint-stronghold", label: "Breaking Strongholds", icon: "🛡️" },
      { to: "/blueprint-weight-loss", label: "Weight Loss", icon: "⚖️" },
      { to: "/blueprint-mental-health", label: "Mental Health", icon: "🧠" },
      { to: "/blueprint-financial", label: "Financial Stability", icon: "💰" },
      { to: "/blueprint-stress", label: "Stress Management", icon: "🧘" },
    ],
  },
  learn: {
    title: "Learn",
    icon: GraduationCap,
    links: [
      { to: "/palace", label: "The Palace", icon: "🏰" },
      { to: "/phototheology-course", label: "Phototheology Course", icon: "📚" },
      { to: "/blueprint-course", label: "Blueprint Course", icon: "📐" },
      { to: "/daniel-course", label: "Daniel Course", icon: "🦁" },
      { to: "/revelation-course", label: "Revelation Course", icon: "📜" },
    ],
  },
  gpts: {
    title: "GPTs",
    icon: Sparkles,
    links: [
      { to: "/phototheologygpt", label: "Phototheology GPT", icon: "🤖" },
      { to: "/branch-study", label: "BranchStudy", icon: "🌳" },
      { to: "/apologetics-gpt", label: "Apologetics GPT", icon: "🛡️" },
      { to: "/daniel-revelation-gpt", label: "Daniel & Revelation", icon: "📜" },
      { to: "/culture-controversy", label: "Culture & Controversy", icon: "🌍" },
      { to: "/kidgpt", label: "Kid GPT", icon: "👶" },
    ],
  },
  research: {
    title: "Research",
    icon: Zap,
    links: [
      { to: "/research-mode", label: "Research Mode", icon: "🔬" },
      { to: "/prophecy-watch", label: "Prophecy Watch", icon: "👁️" },
      { to: "/sermon-archive", label: "Sermon Archive", icon: "🎙️" },
      { to: "/content-library", label: "Content Library", icon: "📚" },
    ],
  },
  community: {
    title: "Community",
    icon: Users,
    links: [
      { to: "/guilds", label: "Guilds", icon: "⚔️" },
      { to: "/community", label: "Community Chat", icon: "💬" },
      { to: "/study-partners", label: "Study Partners", icon: "👥" },
      { to: "/live-study", label: "Live Study", icon: "📺" },
      { to: "/leaderboard", label: "Leaderboard", icon: "🏅" },
      { to: "/achievements", label: "Achievements", icon: "🎖️" },
      { to: "/streaks", label: "Streaks", icon: "🔥" },
      { to: "/feedback", label: "Feedback", icon: "💡" },
    ],
  },
  mastery: {
    title: "Progress",
    icon: Trophy,
    links: [
      { to: "/mastery-dashboard", label: "Mastery Dashboard", icon: "🎯" },
      { to: "/mastery", label: "Mastery Levels", icon: "👑" },
      { to: "/my-progress", label: "My Analytics", icon: "📊" },
      { to: "/spiritual-training", label: "Christian Art of War Dojo", icon: "⚔️" },
      { to: "/drill-drill", label: "Gather Fragments", icon: "🧩" },
      { to: "/analyze-thoughts", label: "Analyze My Thoughts", icon: "💡" },
      { to: "/certificates", label: "Certificates", icon: "🏆" },
    ],
  },
  create: {
    title: "Create",
    icon: Sparkles,
    links: [
      { to: "/sermon-builder", label: "Sermon Builder", icon: "🎤" },
      { to: "/sermon-powerpoint", label: "PowerPoint Generator", icon: "📊" },
      { to: "/sermon-archive", label: "My Sermons", icon: "📁" },
    ],
  },
};

// Simplified quick links for "Simplified Navigation" mode
const simplifiedQuickLinks = [
  { to: "/dashboard", label: "Home", icon: Home, color: "from-primary/10 to-primary/5", borderColor: "border-primary/20", iconColor: "text-primary" },
  { to: "/palace", label: "Palace", icon: Building2, color: "from-amber-500/10 to-orange-500/5", borderColor: "border-amber-500/20", iconColor: "text-amber-500" },
  { to: "/bible", label: "Bible", icon: BookOpen, color: "from-blue-500/10 to-blue-500/5", borderColor: "border-blue-500/20", iconColor: "text-blue-500" },
  { to: "/audio-bible", label: "Listen", icon: Headphones, color: "from-emerald-500/10 to-teal-500/5", borderColor: "border-emerald-500/20", iconColor: "text-emerald-500" },
  { to: "/devotionals", label: "Devotions", icon: Heart, color: "from-rose-500/10 to-pink-500/5", borderColor: "border-rose-500/20", iconColor: "text-rose-500" },
  { to: "/memory", label: "Memory", icon: Brain, color: "from-cyan-500/10 to-teal-500/5", borderColor: "border-cyan-500/20", iconColor: "text-cyan-500" },
  { to: "/leaderboard", label: "Scores", icon: Trophy, color: "from-yellow-500/10 to-amber-500/5", borderColor: "border-yellow-500/20", iconColor: "text-yellow-500" },
  { to: "/phototheologygpt", label: "AI Chat", icon: Sparkles, color: "from-violet-500/10 to-purple-500/5", borderColor: "border-violet-500/20", iconColor: "text-violet-500" },
];

export const EnhancedMobileDrawer = () => {
  const { user, signOut } = useAuth();
  const location = useLocation();
  const { recentPages, clearRecentPages } = useRecentPages();
  const { bookmarks, isBookmarked, toggleBookmark } = usePageBookmarks();
  const { preferences, updatePreference } = useUserPreferences();
  const [open, setOpen] = useState(false);
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set());

  const isSimplified = preferences.navigation_style === "simplified";

  const handleLinkClick = () => {
    setOpen(false);
  };

  const toggleCategory = (key: string) => {
    setExpandedCategories(prev => {
      const next = new Set(prev);
      if (next.has(key)) {
        next.delete(key);
      } else {
        next.add(key);
      }
      return next;
    });
  };

  // Close drawer when auth state changes to force re-render with new state
  useEffect(() => {
    setOpen(false);
  }, [user]);

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden h-10 w-10">
          <Menu className="h-6 w-6" />
        </Button>
      </DrawerTrigger>
      <DrawerContent className="h-[85vh] max-h-[85vh] flex flex-col overflow-hidden">
        <DrawerHeader className="border-b px-4 py-3 flex-shrink-0">
          <DrawerTitle className="flex items-center justify-between">
            <Link
              to="/"
              className="flex items-center gap-2 hover:opacity-80 transition-opacity"
              onClick={handleLinkClick}
            >
              <Building2 className="h-6 w-6 text-primary" />
              <span className="text-lg font-bold bg-gradient-palace bg-clip-text text-transparent">
                Phototheology
              </span>
            </Link>
            <DrawerClose asChild>
              <Button variant="ghost" size="sm" className="h-9 px-3">Close</Button>
            </DrawerClose>
          </DrawerTitle>
        </DrawerHeader>

        <ScrollArea className="flex-1 min-h-0 px-4">
          {user ? (
            <div className="py-4 space-y-4">
              {/* Navigation Style Toggle */}
              <div className="flex items-center justify-between p-3 rounded-xl bg-muted/50 border border-border/50">
                <div className="flex items-center gap-2">
                  <LayoutGrid className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">Navigation Mode</span>
                </div>
                <div className="flex gap-1">
                  <Button
                    variant={isSimplified ? "outline" : "default"}
                    size="sm"
                    className="h-7 text-xs px-3"
                    onClick={() => updatePreference("navigation_style", "full")}
                  >
                    Full
                  </Button>
                  <Button
                    variant={isSimplified ? "default" : "outline"}
                    size="sm"
                    className="h-7 text-xs px-3"
                    onClick={() => updatePreference("navigation_style", "simplified")}
                  >
                    Simple
                  </Button>
                </div>
              </div>

              {/* Quick Actions Grid - Changes based on navigation style */}
              {isSimplified ? (
                /* Simplified Navigation - Larger grid with core features */
                <div className="grid grid-cols-4 gap-3">
                  {simplifiedQuickLinks.map((link) => (
                    <Link
                      key={link.to}
                      to={link.to}
                      onClick={handleLinkClick}
                      className={cn(
                        "flex flex-col items-center justify-center p-4 rounded-xl bg-gradient-to-br border active:scale-95 transition-transform",
                        link.color,
                        link.borderColor
                      )}
                    >
                      <link.icon className={cn("h-6 w-6 mb-1.5", link.iconColor)} />
                      <span className="text-[11px] font-medium text-center">{link.label}</span>
                    </Link>
                  ))}
                </div>
              ) : (
                /* Full Navigation - Original 4-column quick access */
                <div className="grid grid-cols-4 gap-2">
                  <Link
                    to="/dashboard"
                    onClick={handleLinkClick}
                    className="flex flex-col items-center justify-center p-3 rounded-xl bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20 active:scale-95 transition-transform"
                  >
                    <Home className="h-5 w-5 text-primary mb-1" />
                    <span className="text-[10px] font-medium text-center">Home</span>
                  </Link>
                  <Link
                    to="/palace"
                    onClick={handleLinkClick}
                    className="flex flex-col items-center justify-center p-3 rounded-xl bg-gradient-to-br from-amber-500/10 to-orange-500/5 border border-amber-500/20 active:scale-95 transition-transform"
                  >
                    <Building2 className="h-5 w-5 text-amber-500 mb-1" />
                    <span className="text-[10px] font-medium text-center">Palace</span>
                  </Link>
                  <Link
                    to="/bible"
                    onClick={handleLinkClick}
                    className="flex flex-col items-center justify-center p-3 rounded-xl bg-gradient-to-br from-blue-500/10 to-blue-500/5 border border-blue-500/20 active:scale-95 transition-transform"
                  >
                    <BookOpen className="h-5 w-5 text-blue-500 mb-1" />
                    <span className="text-[10px] font-medium text-center">Bible</span>
                  </Link>
                  <Link
                    to="/games"
                    onClick={handleLinkClick}
                    className="flex flex-col items-center justify-center p-3 rounded-xl bg-gradient-to-br from-fuchsia-500/10 to-pink-500/5 border border-fuchsia-500/20 active:scale-95 transition-transform"
                  >
                    <Gamepad2 className="h-5 w-5 text-fuchsia-500 mb-1" />
                    <span className="text-[10px] font-medium text-center">Games</span>
                  </Link>
                </div>
              )}

              {/* Recent Pages */}
              {recentPages.length > 0 && (
                <>
                  <Separator />
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <h3 className="text-sm font-semibold text-foreground">Recently Visited</h3>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={clearRecentPages}
                        className="h-7 px-2"
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                    <div className="space-y-1">
                      {recentPages.slice(0, 5).map((page) => (
                        <div
                          key={page.path}
                          className={cn(
                            "flex items-center justify-between rounded-md px-3 py-2 text-sm",
                            location.pathname === page.path 
                              ? "bg-accent" 
                              : "hover:bg-muted/50 active:bg-muted"
                          )}
                        >
                          <Link
                            to={page.path}
                            onClick={handleLinkClick}
                            className="flex-1 truncate min-h-[44px] flex items-center active:opacity-70"
                          >
                            {page.title}
                          </Link>
                          <button
                            type="button"
                            className="h-11 w-11 flex items-center justify-center -mr-2 active:scale-95"
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              toggleBookmark({ path: page.path, title: page.title });
                            }}
                          >
                            <Star
                              className={cn(
                                "h-4 w-4",
                                isBookmarked(page.path) 
                                  ? "fill-yellow-500 text-yellow-500" 
                                  : "text-muted-foreground"
                              )}
                            />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              )}

              {/* Bookmarks */}
              {bookmarks.length > 0 && (
                <>
                  <Separator />
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                      <h3 className="text-sm font-semibold text-foreground">Bookmarks</h3>
                    </div>
                    <div className="space-y-1">
                      {bookmarks.map((bookmark) => (
                        <div
                          key={bookmark.path}
                          className={cn(
                            "flex items-center justify-between rounded-md px-3 py-2 text-sm",
                            location.pathname === bookmark.path 
                              ? "bg-accent" 
                              : "hover:bg-muted/50 active:bg-muted"
                          )}
                        >
                          <Link
                            to={bookmark.path}
                            onClick={handleLinkClick}
                            className="flex-1 truncate min-h-[44px] flex items-center active:opacity-70"
                          >
                            {bookmark.title}
                          </Link>
                          <button
                            type="button"
                            className="h-11 w-11 flex items-center justify-center -mr-2 active:scale-95"
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              toggleBookmark(bookmark);
                            }}
                          >
                            <Star className="h-4 w-4 fill-yellow-500 text-yellow-500" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              )}

              {/* Categorized Navigation - Only show in Full mode */}
              {!isSimplified && (
              <div className="space-y-2">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-1">Browse All Features</p>
                {Object.entries(categoryConfig).map(([key, category]) => {
                  const isExpanded = expandedCategories.has(key);
                  return (
                    <div key={key} className="rounded-xl border border-border/50 overflow-hidden">
                      <button
                        onClick={() => toggleCategory(key)}
                        className="w-full flex items-center justify-between p-3 bg-muted/30 hover:bg-muted/50 active:bg-muted/70 transition-colors"
                      >
                        <div className="flex items-center gap-2">
                          <category.icon className="h-5 w-5 text-primary" />
                          <span className="font-medium">{category.title}</span>
                        </div>
                        <svg
                          className={cn(
                            "h-4 w-4 text-muted-foreground transition-transform duration-200",
                            isExpanded && "rotate-180"
                          )}
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </button>
                      {isExpanded && (
                        <div className="p-2 space-y-1 bg-background/50">
                          {category.links.map((link) => (
                            <Link
                              key={link.to}
                              to={link.to}
                              onClick={handleLinkClick}
                              className={cn(
                                "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors active:scale-[0.98]",
                                location.pathname === link.to
                                  ? "bg-primary/10 text-primary"
                                  : "hover:bg-muted/50 active:bg-muted"
                              )}
                            >
                              <span className="text-base">{link.icon}</span>
                              <span className="text-sm font-medium flex-1">{link.label}</span>
                              <button
                                onClick={(e) => {
                                  e.preventDefault();
                                  e.stopPropagation();
                                  toggleBookmark({ path: link.to, title: link.label, icon: link.icon });
                                }}
                                className="p-1.5 rounded-full hover:bg-muted active:bg-muted/80"
                              >
                                <Star
                                  className={cn(
                                    "h-4 w-4",
                                    isBookmarked(link.to)
                                      ? "fill-yellow-500 text-yellow-500"
                                      : "text-muted-foreground"
                                  )}
                                />
                              </button>
                            </Link>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
              )}

              {/* Account Section */}
              <div className="space-y-2 pb-28">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-1">Account</p>
                <div className="rounded-xl border border-border/50 overflow-hidden">
                  <Link
                    to="/profile"
                    onClick={handleLinkClick}
                    className="flex items-center gap-3 px-4 py-3 hover:bg-muted/50 active:bg-muted transition-colors border-b border-border/30"
                  >
                    <User className="h-5 w-5 text-primary" />
                    <span className="font-medium">My Profile</span>
                  </Link>
                  <Link
                    to="/pricing"
                    onClick={handleLinkClick}
                    className="flex items-center gap-3 px-4 py-3 hover:bg-muted/50 active:bg-muted transition-colors border-b border-border/30"
                  >
                    <CreditCard className="h-5 w-5 text-emerald-500" />
                    <span className="font-medium">Pricing & Plans</span>
                  </Link>
                  <Link
                    to="/manage-subscription"
                    onClick={handleLinkClick}
                    className="flex items-center gap-3 px-4 py-3 hover:bg-muted/50 active:bg-muted transition-colors border-b border-border/30"
                  >
                    <CreditCard className="h-5 w-5 text-muted-foreground" />
                    <span className="text-muted-foreground">Manage Subscription</span>
                  </Link>
                  <button
                    onClick={() => {
                      signOut();
                      handleLinkClick();
                    }}
                    className="w-full flex items-center gap-3 px-4 py-3 hover:bg-destructive/10 active:bg-destructive/20 transition-colors text-destructive"
                  >
                    <LogOut className="h-5 w-5" />
                    <span className="font-medium">Sign Out</span>
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="py-8 space-y-4">
              <div className="text-center">
                <h3 className="font-serif text-lg font-semibold mb-2">Get Started</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Begin your Phototheology journey
                </p>
              </div>
              
              <Link
                to="/app-tour"
                onClick={handleLinkClick}
                className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2 w-full"
              >
                <BookOpen className="h-4 w-4" />
                Take a Tour
              </Link>
              <Link
                to="/auth"
                onClick={handleLinkClick}
                className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 h-10 px-4 py-2 w-full gradient-palace text-white"
              >
                <Sparkles className="h-4 w-4" />
                Get Started Free
              </Link>
              <Link
                to="/pricing"
                onClick={handleLinkClick}
                className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2 w-full"
              >
                <CreditCard className="h-4 w-4" />
                View Pricing
              </Link>
            </div>
          )}
        </ScrollArea>
      </DrawerContent>
    </Drawer>
  );
};
