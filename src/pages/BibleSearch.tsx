import { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { Navigation } from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Loader2 } from "lucide-react";
import { searchBible, searchBibleByWord } from "@/services/bibleApi";
import { Verse } from "@/types/bible";

const BibleSearch = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get("q") || "";
  const searchMode = searchParams.get("mode") || "reference";
  const searchScope = (searchParams.get("scope") as "all" | "ot" | "nt") || "all";
  
  const [results, setResults] = useState<Verse[]>([]);
  const [totalResults, setTotalResults] = useState(0);
  const [hasMore, setHasMore] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);

  const performSearch = async (page: number = 1, append: boolean = false) => {
    if (!query) return;
    
    if (append) {
      setLoadingMore(true);
    } else {
      setLoading(true);
      setResults([]);
    }
    
    try {
      if (searchMode === "word") {
        const { verses, total, hasMore: more } = await searchBibleByWord(query, searchScope, page);
        if (append) {
          setResults(prev => [...prev, ...verses]);
        } else {
          setResults(verses);
        }
        setTotalResults(total);
        setHasMore(more);
        setCurrentPage(page);
      } else {
        const refResults = await searchBible(query, "kjv");
        setResults(refResults);
        setTotalResults(refResults.length);
        setHasMore(false);
      }
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  const loadMore = () => {
    performSearch(currentPage + 1, true);
  };

  useEffect(() => {
    setCurrentPage(1);
    performSearch(1, false);
  }, [query, searchMode, searchScope]);

  return (
    <div className="min-h-screen gradient-subtle">
      <Navigation />
      
      <div className="pt-24 pb-16 px-4">
        <div className="container mx-auto max-w-4xl">
          <Button variant="ghost" asChild className="mb-6">
            <Link to="/bible">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Bible
            </Link>
          </Button>

          <div className="mb-8">
            <h1 className="font-serif text-4xl md:text-5xl font-bold mb-2 bg-gradient-palace bg-clip-text text-transparent">
              Bible Search
            </h1>
            <div className="flex items-center gap-2 flex-wrap">
              <p className="text-lg text-muted-foreground">
                Searching for: <span className="font-semibold">{query}</span>
              </p>
              {searchMode === "word" && (
                <Badge variant="outline">
                  {searchScope === "all" && "All Bible (66 books)"}
                  {searchScope === "ot" && "Old Testament (39 books)"}
                  {searchScope === "nt" && "New Testament (27 books)"}
                </Badge>
              )}
            </div>
            {results.length > 0 && (
              <p className="text-sm text-muted-foreground mt-2">
                Found {totalResults > results.length ? `~${totalResults}` : results.length} {results.length === 1 ? "verse" : "verses"}
                {results.length < totalResults && ` (showing ${results.length})`}
              </p>
            )}
          </div>

          {/* Search Options */}
          <Card className="p-6 mb-6">
            <Tabs 
              value={searchMode} 
              onValueChange={(value) => {
                searchParams.set("mode", value);
                setSearchParams(searchParams);
              }}
            >
              <TabsList className="grid w-full grid-cols-2 mb-4">
                <TabsTrigger value="reference">Verse Reference</TabsTrigger>
                <TabsTrigger value="word">Word Search</TabsTrigger>
              </TabsList>
              
              <TabsContent value="reference" className="space-y-4">
                <div className="text-sm text-muted-foreground">
                  Search by reference (e.g., "John 3:16", "Genesis 1", "Psalms 23:1-6")
                </div>
              </TabsContent>
              
              <TabsContent value="word" className="space-y-4">
                <div className="text-sm text-muted-foreground mb-4">
                  Search for words or phrases across the entire Bible
                </div>
                
                <div className="space-y-2">
                  <Label>Search Scope</Label>
                  <Select
                    value={searchScope}
                    onValueChange={(value) => {
                      searchParams.set("scope", value);
                      setSearchParams(searchParams);
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Bible (66 books)</SelectItem>
                      <SelectItem value="ot">Old Testament (39 books)</SelectItem>
                      <SelectItem value="nt">New Testament (27 books)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </TabsContent>
            </Tabs>
          </Card>

          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : results.length > 0 ? (
            <div className="space-y-4">
              {results.map((verse, index) => (
                <Card key={index} className="p-6 hover:shadow-lg transition-shadow">
                  <Link 
                    to={`/bible/${verse.book}/${verse.chapter}`}
                    className="block"
                  >
                    <div className="flex items-start gap-4">
                      <div className="font-semibold text-primary min-w-[100px]">
                        {verse.book} {verse.chapter}:{verse.verse}
                      </div>
                      <div className="text-foreground">
                        {verse.text}
                      </div>
                    </div>
                  </Link>
                </Card>
              ))}
              
              {hasMore && (
                <div className="flex justify-center pt-4">
                  <Button 
                    variant="outline" 
                    onClick={loadMore}
                    disabled={loadingMore}
                  >
                    {loadingMore ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Loading more...
                      </>
                    ) : (
                      "Load More Results"
                    )}
                  </Button>
                </div>
              )}
            </div>
          ) : (
            <Card className="p-12 text-center">
              <p className="text-muted-foreground">
                {searchMode === "word" 
                  ? `No results found for "${query}" in the ${searchScope === "all" ? "entire Bible" : searchScope === "ot" ? "Old Testament" : "New Testament"}. Try a different search term.`
                  : `No results found for "${query}". Try searching for a specific verse reference like "John 3:16" or a book and chapter like "Genesis 1".`
                }
              </p>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default BibleSearch;
