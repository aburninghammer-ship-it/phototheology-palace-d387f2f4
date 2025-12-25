import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, Book, Sparkles } from "lucide-react";
import { biblicalSymbolsLibrary, searchSymbols, BiblicalSymbol } from "@/data/biblicalSymbols";

export function SymbolsLibrary() {
  const [searchQuery, setSearchQuery] = useState("");

  const searchResults = searchQuery.length >= 2 ? searchSymbols(searchQuery) : [];

  const renderSymbol = (symbol: BiblicalSymbol) => (
    <div key={symbol.symbol} className="rounded-lg border border-border bg-card p-4 space-y-3">
      <div className="flex items-center gap-3">
        <span className="text-3xl">{symbol.emoji || "📖"}</span>
        <div>
          <div className="font-semibold text-lg">{symbol.symbol}</div>
          <div className="text-sm text-muted-foreground">{symbol.meaning}</div>
        </div>
      </div>
      
      {symbol.dimensions && (
        <div className="space-y-2 pt-2 border-t border-border">
          <h4 className="font-semibold text-sm flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-primary" />
            5 Dimensions
          </h4>
          <div className="grid gap-1.5 text-sm">
            {symbol.dimensions.literal && (
              <div><Badge variant="outline" className="mr-2">1D</Badge>{symbol.dimensions.literal}</div>
            )}
            {symbol.dimensions.christ && (
              <div><Badge variant="outline" className="mr-2 bg-amber-500/20">2D</Badge>{symbol.dimensions.christ}</div>
            )}
            {symbol.dimensions.personal && (
              <div><Badge variant="outline" className="mr-2 bg-blue-500/20">3D</Badge>{symbol.dimensions.personal}</div>
            )}
            {symbol.dimensions.church && (
              <div><Badge variant="outline" className="mr-2 bg-purple-500/20">4D</Badge>{symbol.dimensions.church}</div>
            )}
            {symbol.dimensions.heaven && (
              <div><Badge variant="outline" className="mr-2 bg-green-500/20">5D</Badge>{symbol.dimensions.heaven}</div>
            )}
          </div>
        </div>
      )}
      
      {symbol.notes && (
        <p className="text-sm text-muted-foreground">{symbol.notes}</p>
      )}
      
      {symbol.keyTexts && symbol.keyTexts.length > 0 && (
        <div className="flex flex-wrap gap-1">
          <Book className="h-4 w-4 text-muted-foreground mr-1" />
          {symbol.keyTexts.map((text) => (
            <Badge key={text} variant="secondary" className="text-xs">{text}</Badge>
          ))}
        </div>
      )}
      
      {symbol.relatedSymbols && symbol.relatedSymbols.length > 0 && (
        <div className="text-sm">
          <span className="text-muted-foreground">Related: </span>
          {symbol.relatedSymbols.join(" • ")}
        </div>
      )}
    </div>
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <span className="text-2xl">🔗</span>
          Biblical Symbols Library
        </CardTitle>
        <CardDescription>
          Comprehensive reference of {biblicalSymbolsLibrary.reduce((acc, cat) => acc + cat.symbols.length, 0)}+ biblical symbols with 5-dimensional applications
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search symbols (e.g., lamb, fire, seven...)"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>

        {searchQuery.length >= 2 ? (
          <div className="space-y-2">
            <h3 className="font-medium text-sm text-muted-foreground">
              {searchResults.length} result{searchResults.length !== 1 ? "s" : ""} for "{searchQuery}"
            </h3>
            <div className="space-y-2">
              {searchResults.map((symbol) => renderSymbol(symbol))}
              {searchResults.length === 0 && (
                <p className="text-center text-muted-foreground py-8">No symbols found. Try a different search term.</p>
              )}
            </div>
          </div>
        ) : (
          <Tabs defaultValue={biblicalSymbolsLibrary[0].id} className="w-full">
            <ScrollArea className="w-full">
              <TabsList className="inline-flex w-max gap-1 p-1">
                {biblicalSymbolsLibrary.map((category) => (
                  <TabsTrigger key={category.id} value={category.id} className="text-xs whitespace-nowrap">
                    {category.icon} {category.name.split(":").pop()?.trim() || category.name}
                  </TabsTrigger>
                ))}
              </TabsList>
            </ScrollArea>

            {biblicalSymbolsLibrary.map((category) => (
              <TabsContent key={category.id} value={category.id}>
                <div className="mb-3">
                  <h3 className="font-semibold">{category.name}</h3>
                  <p className="text-sm text-muted-foreground">{category.description}</p>
                </div>
                <div className="space-y-2">
                  {category.symbols.map((symbol) => renderSymbol(symbol))}
                </div>
              </TabsContent>
            ))}
          </Tabs>
        )}
      </CardContent>
    </Card>
  );
}
