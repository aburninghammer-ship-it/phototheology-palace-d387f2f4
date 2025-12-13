import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { BIBLE_BOOKS } from "@/types/bible";
import { Search, BookOpen } from "lucide-react";
import { ThemeVerseSearch } from "./ThemeVerseSearch";
import { EventSearch } from "./EventSearch";
import { usePreservePage } from "@/hooks/usePreservePage";
import { PageLockToggle } from "@/components/preserve/PageLockToggle";
const OLD_TESTAMENT_BOOKS = BIBLE_BOOKS.slice(0, 39);
const NEW_TESTAMENT_BOOKS = BIBLE_BOOKS.slice(39);

export const BibleNavigation = () => {
  const navigate = useNavigate();
  const { setCustomState, getCustomState } = usePreservePage();
  
  // Restore state from context or use defaults
  const [selectedBook, setSelectedBook] = useState(() => getCustomState<string>('bibleNav_selectedBook') || "John");
  const [chapter, setChapter] = useState(() => getCustomState<string>('bibleNav_chapter') || "1");
  const [verse, setVerse] = useState(() => getCustomState<string>('bibleNav_verse') || "");
  const [searchQuery, setSearchQuery] = useState(() => getCustomState<string>('bibleNav_searchQuery') || "");
  const [searchMode, setSearchMode] = useState<"reference" | "word" | "theme" | "event">(() => getCustomState<"reference" | "word" | "theme" | "event">('bibleNav_searchMode') || "reference");
  const [searchScope, setSearchScope] = useState<"all" | "ot" | "nt">(() => getCustomState<"all" | "ot" | "nt">('bibleNav_searchScope') || "all");

  // Persist state changes
  useEffect(() => { setCustomState('bibleNav_selectedBook', selectedBook); }, [selectedBook, setCustomState]);
  useEffect(() => { setCustomState('bibleNav_chapter', chapter); }, [chapter, setCustomState]);
  useEffect(() => { setCustomState('bibleNav_verse', verse); }, [verse, setCustomState]);
  useEffect(() => { setCustomState('bibleNav_searchQuery', searchQuery); }, [searchQuery, setCustomState]);
  useEffect(() => { setCustomState('bibleNav_searchMode', searchMode); }, [searchMode, setCustomState]);
  useEffect(() => { setCustomState('bibleNav_searchScope', searchScope); }, [searchScope, setCustomState]);

  const handleNavigate = () => {
    if (selectedBook && chapter) {
      const path = verse 
        ? `/bible/${selectedBook}/${chapter}?verse=${verse}`
        : `/bible/${selectedBook}/${chapter}`;
      navigate(path);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery) {
      navigate(`/bible/search?q=${encodeURIComponent(searchQuery)}&mode=${searchMode}&scope=${searchScope}`);
    }
  };

  return (
    <Card variant="glass" className="p-4 sm:p-6">
      
      <div className="relative z-10 space-y-4">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-primary" />
            <h3 className="font-serif text-base sm:text-lg font-semibold">Navigate Bible</h3>
          </div>
          <PageLockToggle />
        </div>
        
        {/* Quick Navigation */}
        <div className="space-y-3">
          <Select value={selectedBook} onValueChange={setSelectedBook}>
            <SelectTrigger className="bg-white/10 backdrop-blur-md border-white/20 hover:border-primary/50 hover:bg-white/15 transition-all text-foreground">
              <SelectValue placeholder="Select book" />
            </SelectTrigger>
            <SelectContent className="max-h-[300px] bg-card/95 backdrop-blur-xl border-white/20 z-50">
              {BIBLE_BOOKS.map((book) => (
                <SelectItem key={book} value={book}>
                  {book}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <div className="grid grid-cols-2 gap-2 sm:gap-3">
            <Input
              type="number"
              placeholder="Chapter"
              value={chapter}
              onChange={(e) => setChapter(e.target.value)}
              min="1"
              className="bg-white/10 backdrop-blur-md border-white/20 hover:border-primary/50 hover:bg-white/15 focus:border-primary focus:bg-white/20 transition-all touch-manipulation placeholder:text-muted-foreground/70"
            />
            <Input
              type="number"
              placeholder="Verse"
              value={verse}
              onChange={(e) => setVerse(e.target.value)}
              min="1"
              className="bg-white/10 backdrop-blur-md border-white/20 hover:border-primary/50 hover:bg-white/15 focus:border-primary focus:bg-white/20 transition-all touch-manipulation placeholder:text-muted-foreground/70"
            />
          </div>
        </div>
        
        <Button 
          onClick={handleNavigate}
          className="w-full bg-gradient-to-r from-primary to-primary/80 text-primary-foreground shadow-purple hover:shadow-glow hover:scale-[1.02] transition-all duration-300"
        >
          Go to Chapter
        </Button>
        
        {/* Search */}
        <div className="pt-3 border-t border-white/10 space-y-3">
          <Tabs value={searchMode} onValueChange={(value) => setSearchMode(value as "reference" | "word" | "theme" | "event")}>
            <TabsList className="grid w-full grid-cols-4 bg-white/10 backdrop-blur-md border border-white/15">
              <TabsTrigger value="reference" className="text-xs sm:text-sm data-[state=active]:bg-primary/30 data-[state=active]:text-primary">Reference</TabsTrigger>
              <TabsTrigger value="word" className="text-xs sm:text-sm data-[state=active]:bg-primary/30 data-[state=active]:text-primary">Word</TabsTrigger>
              <TabsTrigger value="theme" className="text-xs sm:text-sm data-[state=active]:bg-primary/30 data-[state=active]:text-primary">Theme</TabsTrigger>
              <TabsTrigger value="event" className="text-xs sm:text-sm data-[state=active]:bg-amber-500/30 data-[state=active]:text-amber-400">Event</TabsTrigger>
            </TabsList>
            
            <TabsContent value="reference" className="mt-3 space-y-3">
              <form onSubmit={handleSearch} className="flex gap-2">
                <Input
                  placeholder="e.g., John 3:16"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bg-white/10 backdrop-blur-md border-white/20 hover:border-primary/50 hover:bg-white/15 focus:border-primary focus:bg-white/20 transition-all touch-manipulation placeholder:text-muted-foreground/70"
                />
                <Button type="submit" size="icon" variant="outline" className="bg-white/10 backdrop-blur-md border-white/20 hover:border-primary hover:bg-white/20 transition-all touch-manipulation flex-shrink-0">
                  <Search className="h-4 w-4" />
                </Button>
              </form>
            </TabsContent>
            
            <TabsContent value="word" className="mt-3 space-y-3">
              <Select value={searchScope} onValueChange={(value) => setSearchScope(value as "all" | "ot" | "nt")}>
                <SelectTrigger className="bg-white/10 backdrop-blur-md border-white/20 hover:border-primary/50 hover:bg-white/15 transition-all text-foreground">
                  <SelectValue placeholder="Search scope" />
                </SelectTrigger>
                <SelectContent className="bg-card/95 backdrop-blur-xl border-white/20 z-50">
                  <SelectItem value="all">All Bible (66 books)</SelectItem>
                  <SelectItem value="ot">Old Testament (39 books)</SelectItem>
                  <SelectItem value="nt">New Testament (27 books)</SelectItem>
                </SelectContent>
              </Select>
              
              <form onSubmit={handleSearch} className="flex gap-2">
                <Input
                  placeholder="e.g., love one another"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bg-white/10 backdrop-blur-md border-white/20 hover:border-primary/50 hover:bg-white/15 focus:border-primary focus:bg-white/20 transition-all touch-manipulation placeholder:text-muted-foreground/70"
                />
                <Button type="submit" size="icon" variant="outline" className="bg-white/10 backdrop-blur-md border-white/20 hover:border-primary hover:bg-white/20 transition-all touch-manipulation flex-shrink-0">
                  <Search className="h-4 w-4" />
                </Button>
              </form>
            </TabsContent>
            
            <TabsContent value="theme" className="mt-3">
              <ThemeVerseSearch className="border-0 bg-transparent p-0" />
            </TabsContent>
            
            <TabsContent value="event" className="mt-3">
              <EventSearch className="border-0 bg-transparent p-0" />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </Card>
  );
};