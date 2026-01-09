import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Navigation } from "@/components/Navigation";
import { SimplifiedNav } from "@/components/SimplifiedNav";
import { useUserPreferences } from "@/hooks/useUserPreferences";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import {
  Library, Sparkles, Gem, Bookmark, Highlighter, StickyNote,
  Image, FolderOpen, Search, ChevronRight, Flame, ArrowLeft,
  Clock, Trash2, Eye, Star, Filter, ExternalLink, LayoutGrid, List
} from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

interface LibraryStats {
  sparks: number;
  gems: number;
  bookmarks: number;
  highlights: number;
  notes: number;
  images: number;
}

interface GemItem {
  id: string;
  gem_name: string;
  gem_content: string;
  room_id: string;
  floor_number: number;
  category: string | null;
  created_at: string;
}

interface BookmarkItem {
  id: string;
  book: string;
  chapter: number;
  created_at: string;
}

interface HighlightItem {
  id: string;
  book: string;
  chapter: number;
  verse: number;
  color: string;
  created_at: string;
}

interface NoteItem {
  id: string;
  book: string;
  chapter: number;
  verse: number;
  content: string;
  created_at: string;
}

interface SparkItem {
  id: string;
  title: string;
  insight: string;
  spark_type: 'connection' | 'pattern' | 'application';
  created_at: string;
  saved_at: string | null;
}

const sparkTypeConfig = {
  connection: { icon: Flame, color: 'text-orange-500', bg: 'bg-orange-500/10' },
  pattern: { icon: Sparkles, color: 'text-purple-500', bg: 'bg-purple-500/10' },
  application: { icon: Star, color: 'text-yellow-500', bg: 'bg-yellow-500/10' },
};

const roomNames: Record<string, string> = {
  'sr': 'Story Room', 'ir': 'Imagination Room', '24': '24FPS Room',
  'br': 'Bible Rendered', 'tr': 'Translation Room', 'gr': 'Gems Room',
  'or': 'Observation Room', 'dc': 'Def-Com Room', '@t': 'Symbols/Types Room',
  'qr': 'Questions Room', 'qa': 'Q&A Chains Room', 'nf': 'Nature Freestyle',
  'pf': 'Personal Freestyle', 'bf': 'Bible Freestyle', 'hf': 'History Freestyle',
  'lr': 'Listening Room', 'cr': 'Concentration Room', 'dr': 'Dimensions Room',
  'c6': 'Connect-6', 'trm': 'Theme Room', 'tz': 'Time Zone',
  'prm': 'Patterns Room', 'p‖': 'Parallels Room', 'frt': 'Fruit Room',
  'cec': 'Christ Every Chapter', 'r66': 'Room 66', 'bl': 'Blue Room',
  'pr': 'Prophecy Room', '3a': 'Three Angels Room', 'fe': 'Feasts Room',
  'frm': 'Fire Room', 'mr': 'Meditation Room', 'srm': 'Speed Room',
};

export default function Libraries() {
  const { user } = useAuth();
  const { preferences } = useUserPreferences();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState("sparks");
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [stats, setStats] = useState<LibraryStats>({ sparks: 0, gems: 0, bookmarks: 0, highlights: 0, notes: 0, images: 0 });
  const [loading, setLoading] = useState(true);

  // Data states
  const [sparks, setSparks] = useState<SparkItem[]>([]);
  const [gems, setGems] = useState<GemItem[]>([]);
  const [bookmarks, setBookmarks] = useState<BookmarkItem[]>([]);
  const [highlights, setHighlights] = useState<HighlightItem[]>([]);
  const [notes, setNotes] = useState<NoteItem[]>([]);

  // Fetch all library data
  useEffect(() => {
    if (!user?.id) return;

    const fetchAllLibraries = async () => {
      setLoading(true);
      try {
        // Fetch sparks
        const { data: sparksData } = await supabase
          .from('sparks')
          .select('id, title, insight, spark_type, created_at, saved_at')
          .eq('user_id', user.id)
          .is('dismissed_at', null)
          .order('created_at', { ascending: false })
          .limit(50);

        // Fetch gems
        const { data: gemsData } = await supabase
          .from('user_gems')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
          .limit(50);

        // Fetch bookmarks
        const { data: bookmarksData } = await supabase
          .from('bookmarks')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
          .limit(50);

        // Fetch highlights
        const { data: highlightsData } = await supabase
          .from('verse_highlights')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
          .limit(50);

        // Fetch notes
        const { data: notesData } = await supabase
          .from('verse_notes')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
          .limit(50);

        // Set data
        setSparks((sparksData as unknown as SparkItem[]) || []);
        setGems((gemsData as GemItem[]) || []);
        setBookmarks((bookmarksData as BookmarkItem[]) || []);
        setHighlights((highlightsData as HighlightItem[]) || []);
        setNotes((notesData as NoteItem[]) || []);

        // Set stats
        setStats({
          sparks: sparksData?.length || 0,
          gems: gemsData?.length || 0,
          bookmarks: bookmarksData?.length || 0,
          highlights: highlightsData?.length || 0,
          notes: notesData?.length || 0,
          images: 0, // TODO: Add images count
        });
      } catch (err) {
        console.error('Error fetching libraries:', err);
        toast.error('Failed to load libraries');
      } finally {
        setLoading(false);
      }
    };

    fetchAllLibraries();
  }, [user?.id]);

  // Filter data based on search
  const filteredSparks = sparks.filter(s =>
    s.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.insight.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredGems = gems.filter(g =>
    g.gem_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    g.gem_content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredBookmarks = bookmarks.filter(b =>
    `${b.book} ${b.chapter}`.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredNotes = notes.filter(n =>
    n.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
    `${n.book} ${n.chapter}:${n.verse}`.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const libraryTabs = [
    { id: 'sparks', label: 'Sparks', icon: Flame, count: stats.sparks, color: 'text-orange-500' },
    { id: 'gems', label: 'Gems', icon: Gem, count: stats.gems, color: 'text-emerald-500' },
    { id: 'bookmarks', label: 'Bookmarks', icon: Bookmark, count: stats.bookmarks, color: 'text-blue-500' },
    { id: 'highlights', label: 'Highlights', icon: Highlighter, count: stats.highlights, color: 'text-yellow-500' },
    { id: 'notes', label: 'Notes', icon: StickyNote, count: stats.notes, color: 'text-purple-500' },
  ];

  return (
    <div className="min-h-screen bg-background">
      {preferences.navigation_style === "simplified" ? <SimplifiedNav /> : <Navigation />}

      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 py-12 px-4">
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-20 pointer-events-none" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-amber-400/30 to-pink-400/30 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-gradient-to-tr from-cyan-400/30 to-purple-400/30 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-6xl mx-auto">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate(-1)}
            className="mb-4 text-white/80 hover:text-white hover:bg-white/10"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>

          <div className="flex items-center gap-4 mb-6">
            <div className="p-4 rounded-2xl bg-white/20 backdrop-blur-sm shadow-xl">
              <Library className="h-10 w-10 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-white drop-shadow-lg">My Libraries</h1>
              <p className="text-white/80 text-lg">All your saved discoveries in one place</p>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-5 gap-3 mt-6">
            {libraryTabs.map(tab => (
              <Card
                key={tab.id}
                className={cn(
                  "bg-white/10 backdrop-blur-sm border-white/20 cursor-pointer transition-all hover:bg-white/20",
                  activeTab === tab.id && "ring-2 ring-white"
                )}
                onClick={() => setActiveTab(tab.id)}
              >
                <CardContent className="p-4 text-center">
                  <tab.icon className={cn("h-6 w-6 mx-auto mb-2 text-white")} />
                  <p className="text-2xl font-bold text-white">{tab.count}</p>
                  <p className="text-xs text-white/70">{tab.label}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-4 py-8 pb-28 md:pb-8">
        {/* Search and View Toggle */}
        <div className="flex items-center gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search your libraries..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex gap-1 border rounded-lg p-1">
            <Button
              variant={viewMode === 'grid' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('grid')}
            >
              <LayoutGrid className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === 'list' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('list')}
            >
              <List className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full max-w-2xl grid-cols-5 mb-6">
            {libraryTabs.map(tab => (
              <TabsTrigger key={tab.id} value={tab.id} className="gap-2">
                <tab.icon className={cn("h-4 w-4", tab.color)} />
                <span className="hidden sm:inline">{tab.label}</span>
              </TabsTrigger>
            ))}
          </TabsList>

          {/* Sparks Tab */}
          <TabsContent value="sparks">
            {loading ? (
              <LoadingGrid />
            ) : filteredSparks.length === 0 ? (
              <EmptyState
                icon={Flame}
                title="No Sparks Yet"
                description="Divine insights will appear here as you study"
                action={{ label: "Go to Bible", path: "/bible" }}
              />
            ) : (
              <div className={cn(
                viewMode === 'grid'
                  ? "grid md:grid-cols-2 lg:grid-cols-3 gap-4"
                  : "space-y-3"
              )}>
                {filteredSparks.map(spark => {
                  const config = sparkTypeConfig[spark.spark_type];
                  const Icon = config.icon;
                  return (
                    <Card
                      key={spark.id}
                      className={cn(
                        "cursor-pointer hover:shadow-lg transition-all border-2",
                        config.bg
                      )}
                      onClick={() => navigate('/sparks')}
                    >
                      <CardHeader className="pb-2">
                        <div className="flex items-start justify-between">
                          <div className="flex items-center gap-2">
                            <Icon className={cn("h-5 w-5", config.color)} />
                            <CardTitle className="text-base line-clamp-1">{spark.title}</CardTitle>
                          </div>
                          {spark.saved_at && <Star className="h-4 w-4 text-amber-500 fill-amber-500" />}
                        </div>
                        <CardDescription className="text-xs">
                          {format(new Date(spark.created_at), 'MMM d, yyyy')}
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm line-clamp-3">{spark.insight}</p>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            )}
            <ViewAllButton path="/sparks" label="View All Sparks" />
          </TabsContent>

          {/* Gems Tab */}
          <TabsContent value="gems">
            {loading ? (
              <LoadingGrid />
            ) : filteredGems.length === 0 ? (
              <EmptyState
                icon={Gem}
                title="No Gems Collected"
                description="Collect gems from Palace rooms to build your collection"
                action={{ label: "Visit Palace", path: "/palace" }}
              />
            ) : (
              <div className={cn(
                viewMode === 'grid'
                  ? "grid md:grid-cols-2 lg:grid-cols-3 gap-4"
                  : "space-y-3"
              )}>
                {filteredGems.map(gem => (
                  <Card key={gem.id} className="hover:shadow-lg transition-all border-2 border-emerald-200 dark:border-emerald-800 bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-950/30 dark:to-teal-950/30">
                    <CardHeader className="pb-2">
                      <div className="flex items-start justify-between">
                        <CardTitle className="text-base line-clamp-1">{gem.gem_name}</CardTitle>
                        <Badge variant="secondary" className="text-xs shrink-0">
                          {roomNames[gem.room_id.toLowerCase()] || gem.room_id}
                        </Badge>
                      </div>
                      <CardDescription className="text-xs">
                        Floor {gem.floor_number} • {format(new Date(gem.created_at), 'MMM d, yyyy')}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm line-clamp-3">{gem.gem_content}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          {/* Bookmarks Tab */}
          <TabsContent value="bookmarks">
            {loading ? (
              <LoadingGrid />
            ) : filteredBookmarks.length === 0 ? (
              <EmptyState
                icon={Bookmark}
                title="No Bookmarks"
                description="Bookmark Bible chapters to find them quickly"
                action={{ label: "Read Bible", path: "/bible" }}
              />
            ) : (
              <div className={cn(
                viewMode === 'grid'
                  ? "grid md:grid-cols-3 lg:grid-cols-4 gap-3"
                  : "space-y-2"
              )}>
                {filteredBookmarks.map(bookmark => (
                  <Card
                    key={bookmark.id}
                    className="cursor-pointer hover:shadow-lg transition-all hover:border-blue-400"
                    onClick={() => navigate(`/bible/${bookmark.book}/${bookmark.chapter}`)}
                  >
                    <CardContent className="p-4 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Bookmark className="h-5 w-5 text-blue-500" />
                        <div>
                          <p className="font-semibold">{bookmark.book} {bookmark.chapter}</p>
                          <p className="text-xs text-muted-foreground">
                            {format(new Date(bookmark.created_at), 'MMM d, yyyy')}
                          </p>
                        </div>
                      </div>
                      <ChevronRight className="h-4 w-4 text-muted-foreground" />
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          {/* Highlights Tab */}
          <TabsContent value="highlights">
            {loading ? (
              <LoadingGrid />
            ) : highlights.length === 0 ? (
              <EmptyState
                icon={Highlighter}
                title="No Highlights"
                description="Highlight verses while reading to save them here"
                action={{ label: "Read Bible", path: "/bible" }}
              />
            ) : (
              <div className={cn(
                viewMode === 'grid'
                  ? "grid md:grid-cols-3 lg:grid-cols-4 gap-3"
                  : "space-y-2"
              )}>
                {highlights.map(highlight => (
                  <Card
                    key={highlight.id}
                    className="cursor-pointer hover:shadow-lg transition-all"
                    onClick={() => navigate(`/bible/${highlight.book}/${highlight.chapter}`)}
                  >
                    <CardContent className="p-4 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div
                          className="w-5 h-5 rounded-full border-2"
                          style={{ backgroundColor: highlight.color }}
                        />
                        <div>
                          <p className="font-semibold">{highlight.book} {highlight.chapter}:{highlight.verse}</p>
                          <p className="text-xs text-muted-foreground">
                            {format(new Date(highlight.created_at), 'MMM d, yyyy')}
                          </p>
                        </div>
                      </div>
                      <ChevronRight className="h-4 w-4 text-muted-foreground" />
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          {/* Notes Tab */}
          <TabsContent value="notes">
            {loading ? (
              <LoadingGrid />
            ) : filteredNotes.length === 0 ? (
              <EmptyState
                icon={StickyNote}
                title="No Notes"
                description="Add notes to verses while studying"
                action={{ label: "Read Bible", path: "/bible" }}
              />
            ) : (
              <div className={cn(
                viewMode === 'grid'
                  ? "grid md:grid-cols-2 gap-4"
                  : "space-y-3"
              )}>
                {filteredNotes.map(note => (
                  <Card
                    key={note.id}
                    className="cursor-pointer hover:shadow-lg transition-all border-2 border-purple-200 dark:border-purple-800"
                    onClick={() => navigate(`/bible/${note.book}/${note.chapter}`)}
                  >
                    <CardHeader className="pb-2">
                      <div className="flex items-start justify-between">
                        <CardTitle className="text-base">
                          {note.book} {note.chapter}:{note.verse}
                        </CardTitle>
                        <StickyNote className="h-4 w-4 text-purple-500" />
                      </div>
                      <CardDescription className="text-xs">
                        {format(new Date(note.created_at), 'MMM d, yyyy')}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm line-clamp-4">{note.content}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
            <ViewAllButton path="/notes" label="View All Notes" />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

// Helper Components
function LoadingGrid() {
  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
      {[1, 2, 3, 4, 5, 6].map(i => (
        <Card key={i}>
          <CardContent className="p-6 space-y-3">
            <Skeleton className="h-5 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
            <Skeleton className="h-16 w-full" />
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

function EmptyState({
  icon: Icon,
  title,
  description,
  action
}: {
  icon: React.ElementType;
  title: string;
  description: string;
  action: { label: string; path: string };
}) {
  const navigate = useNavigate();
  return (
    <Card className="border-2 border-dashed">
      <CardContent className="py-12 text-center">
        <Icon className="h-12 w-12 mx-auto text-muted-foreground/50 mb-4" />
        <h3 className="text-lg font-semibold mb-2">{title}</h3>
        <p className="text-muted-foreground text-sm mb-4">{description}</p>
        <Button onClick={() => navigate(action.path)}>
          {action.label}
        </Button>
      </CardContent>
    </Card>
  );
}

function ViewAllButton({ path, label }: { path: string; label: string }) {
  const navigate = useNavigate();
  return (
    <div className="flex justify-center mt-6">
      <Button variant="outline" onClick={() => navigate(path)}>
        {label}
        <ExternalLink className="h-4 w-4 ml-2" />
      </Button>
    </div>
  );
}
