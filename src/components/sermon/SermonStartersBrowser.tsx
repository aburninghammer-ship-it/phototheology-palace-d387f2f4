import { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Search,
  BookOpen,
  Calendar,
  Church,
  Telescope,
  Heart,
  Sparkles,
  ChevronRight,
  Building2,
  ExternalLink,
} from "lucide-react";
import { motion } from "framer-motion";

interface SermonTopic {
  id: string;
  slug: string;
  title: string;
  summary: string | null;
  tags: string[];
  anchor_scriptures: string[];
  category: string | null;
  is_featured: boolean;
}

const CATEGORIES = [
  { id: "Theme", label: "Themes", icon: BookOpen, color: "from-violet-500 to-purple-600" },
  { id: "Occasion", label: "Occasions", icon: Calendar, color: "from-amber-500 to-orange-600" },
  { id: "Doctrine", label: "Doctrine", icon: Church, color: "from-blue-500 to-indigo-600" },
  { id: "Prophecy", label: "Prophecy", icon: Telescope, color: "from-rose-500 to-red-600" },
  { id: "Christian Living", label: "Christian Living", icon: Heart, color: "from-emerald-500 to-teal-600" },
];

export function SermonStartersBrowser() {
  const [topics, setTopics] = useState<SermonTopic[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  useEffect(() => {
    const fetchTopics = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from("sermon_topics")
        .select("*")
        .order("title");

      if (error) {
        console.error("Error fetching topics:", error);
      } else {
        setTopics((data as SermonTopic[]) || []);
      }
      setLoading(false);
    };

    fetchTopics();
  }, []);

  const filteredTopics = useMemo(() => {
    let result = topics;

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (t) =>
          t.title.toLowerCase().includes(query) ||
          t.tags.some((tag) => tag.toLowerCase().includes(query)) ||
          t.anchor_scriptures.some((s) => s.toLowerCase().includes(query))
      );
    }

    if (selectedCategory) {
      result = result.filter((t) => t.category === selectedCategory);
    }

    return result;
  }, [topics, searchQuery, selectedCategory]);

  const featuredTopics = useMemo(
    () => topics.filter((t) => t.is_featured).slice(0, 4),
    [topics]
  );

  const clearFilters = () => {
    setSearchQuery("");
    setSelectedCategory(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <div className="flex justify-center mb-3">
          <div className="p-2 rounded-full bg-white/10">
            <Building2 className="h-6 w-6 text-white" />
          </div>
        </div>
        <h2 className="text-2xl font-bold text-white mb-2">Sermon Idea Starters</h2>
        <p className="text-purple-200 text-sm max-w-lg mx-auto">
          Discover PhotoTheology Sermon Starters organized by topic with 8-floor scaffolds.
        </p>
      </div>

      {/* Search */}
      <div className="relative max-w-md mx-auto">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/60" />
        <Input
          type="text"
          placeholder="Search topics, tags, or scriptures..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-white/40"
        />
      </div>

      {/* Category Filters */}
      <div className="flex flex-wrap justify-center gap-2">
        {CATEGORIES.map((cat) => {
          const Icon = cat.icon;
          const isActive = selectedCategory === cat.id;
          return (
            <Button
              key={cat.id}
              variant={isActive ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory(isActive ? null : cat.id)}
              className={
                isActive
                  ? "bg-white text-purple-900"
                  : "bg-white/10 border-white/20 text-white hover:bg-white/20"
              }
            >
              <Icon className="h-3 w-3 mr-1" />
              {cat.label}
            </Button>
          );
        })}
        {(selectedCategory || searchQuery) && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearFilters}
            className="text-white/60 hover:text-white hover:bg-white/10"
          >
            Clear
          </Button>
        )}
      </div>

      {/* Featured Topics */}
      {featuredTopics.length > 0 && !searchQuery && !selectedCategory && (
        <div>
          <h3 className="text-sm font-medium text-white/80 mb-3 flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-amber-400" />
            Featured Topics
          </h3>
          <div className="grid grid-cols-2 gap-3">
            {featuredTopics.map((topic, i) => (
              <motion.div
                key={topic.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <Link to={`/sermon-topics/${topic.slug}`} target="_blank">
                  <Card className="h-full bg-white/10 border-white/20 hover:bg-white/20 transition-all group">
                    <CardHeader className="p-3 pb-1">
                      <CardTitle className="text-sm text-white flex items-center justify-between">
                        <span className="truncate">{topic.title}</span>
                        <ExternalLink className="h-3 w-3 text-white/40 group-hover:text-white shrink-0" />
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-3 pt-0">
                      <div className="flex flex-wrap gap-1">
                        {topic.tags.slice(0, 2).map((tag) => (
                          <Badge key={tag} variant="secondary" className="text-xs bg-white/10 text-white/70">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Topic List */}
      <div>
        <h3 className="text-sm font-medium text-white/80 mb-3">
          {searchQuery || selectedCategory ? "Results" : "All Topics"}
          <span className="text-white/40 ml-2">({filteredTopics.length})</span>
        </h3>
        <ScrollArea className="h-[300px]">
          {loading ? (
            <div className="space-y-2">
              {[...Array(6)].map((_, i) => (
                <Skeleton key={i} className="h-16 w-full bg-white/10" />
              ))}
            </div>
          ) : filteredTopics.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-white/60 text-sm mb-3">No topics found matching your criteria.</p>
              <Button
                variant="outline"
                size="sm"
                onClick={clearFilters}
                className="bg-white/10 border-white/20 text-white"
              >
                Clear filters
              </Button>
            </div>
          ) : (
            <div className="space-y-2">
              {filteredTopics.map((topic, i) => (
                <motion.div
                  key={topic.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: Math.min(i * 0.02, 0.2) }}
                >
                  <Link to={`/sermon-topics/${topic.slug}`} target="_blank">
                    <div className="flex items-center justify-between p-3 rounded-lg bg-white/5 hover:bg-white/15 transition-all group">
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-white text-sm truncate">{topic.title}</h4>
                        <div className="flex items-center gap-2 mt-1">
                          {topic.category && (
                            <Badge variant="outline" className="text-xs border-white/20 text-white/60">
                              {topic.category}
                            </Badge>
                          )}
                          {topic.anchor_scriptures.length > 0 && (
                            <span className="text-xs text-white/40 truncate">
                              {topic.anchor_scriptures[0]}
                            </span>
                          )}
                        </div>
                      </div>
                      <ChevronRight className="h-4 w-4 text-white/40 group-hover:text-white shrink-0 ml-2" />
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          )}
        </ScrollArea>
      </div>

      {/* View All Link */}
      <div className="text-center pt-2">
        <Link to="/sermon-topics" target="_blank">
          <Button
            variant="outline"
            className="bg-white/10 border-white/20 text-white hover:bg-white/20"
          >
            <Building2 className="h-4 w-4 mr-2" />
            View Full Topics Hub
            <ExternalLink className="h-3 w-3 ml-2" />
          </Button>
        </Link>
      </div>
    </div>
  );
}
