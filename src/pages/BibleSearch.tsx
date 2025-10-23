import { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { Navigation } from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, Loader2 } from "lucide-react";
import { searchBible, searchBibleByWord, BIBLE_TRANSLATIONS, Translation } from "@/services/bibleApi";
import { Verse } from "@/types/bible";

const BibleSearch = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get("q") || "";
  const searchMode = searchParams.get("mode") || "reference";
  const searchType = searchParams.get("type") || "contains";
  const translation = (searchParams.get("translation") as Translation) || "kjv";
  
  const [results, setResults] = useState<Verse[]>([]);
  const [loading, setLoading] = useState(false);

  const performSearch = async () => {
    if (!query) return;
    
    setLoading(true);
    try {
      if (searchMode === "word") {
        const wordResults = await searchBibleByWord(
          query,
          translation,
          searchType as "contains" | "exact" | "starts"
        );
        setResults(wordResults);
      } else {
        const refResults = await searchBible(query, translation);
        setResults(refResults);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    performSearch();
  }, [query, searchMode, searchType, translation]);

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
            <p className="text-lg text-muted-foreground">
              Searching for: <span className="font-semibold">{query}</span>
            </p>
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
                  Search for words across the Bible
                </div>
                
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Search Type</Label>
                    <Select
                      value={searchType}
                      onValueChange={(value) => {
                        searchParams.set("type", value);
                        setSearchParams(searchParams);
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="contains">Contains Word</SelectItem>
                        <SelectItem value="exact">Exact Word Match</SelectItem>
                        <SelectItem value="starts">Starts With</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </TabsContent>
            </Tabs>

            <div className="mt-4 pt-4 border-t">
              <div className="space-y-2">
                <Label>Translation</Label>
                <Select
                  value={translation}
                  onValueChange={(value) => {
                    searchParams.set("translation", value);
                    setSearchParams(searchParams);
                  }}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {BIBLE_TRANSLATIONS.map((trans) => (
                      <SelectItem key={trans.value} value={trans.value}>
                        {trans.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
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
                  ? `No results found for "${query}". Try a different word or search type. Note: Word search searches common books (John, Genesis, Psalms, Matthew, Romans) for demonstration.`
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
