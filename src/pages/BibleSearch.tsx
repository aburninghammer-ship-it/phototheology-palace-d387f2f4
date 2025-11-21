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
  const [loading, setLoading] = useState(false);

  const performSearch = async () => {
    if (!query) return;
    
    setLoading(true);
    try {
      if (searchMode === "word") {
        const wordResults = await searchBibleByWord(query, searchScope);
        setResults(wordResults);
      } else {
        const refResults = await searchBible(query, "kjv");
        setResults(refResults);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    performSearch();
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
                Found {results.length} {results.length === 1 ? "verse" : "verses"}
                {results.length === 1000 && " (showing first 1000)"}
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
