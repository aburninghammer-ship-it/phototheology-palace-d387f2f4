import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  BookOpen, 
  Search, 
  ExternalLink, 
  Globe, 
  Languages, 
  ScrollText,
  Library,
  GraduationCap,
  BookMarked,
  Sparkles
} from "lucide-react";

interface ExternalResource {
  name: string;
  description: string;
  url: string;
  category: "lexicon" | "commentary" | "concordance" | "dictionary" | "interlinear";
  icon: React.ReactNode;
}

const externalResources: ExternalResource[] = [
  // Greek/Hebrew Lexicons & Word Study
  {
    name: "Blue Letter Bible",
    description: "Strong's Concordance, Greek/Hebrew lexicons, word studies with original language tools",
    url: "https://www.blueletterbible.org/",
    category: "lexicon",
    icon: <Languages className="h-5 w-5" />
  },
  {
    name: "Bible Hub Interlinear",
    description: "Greek/Hebrew interlinear with Strong's numbers, parsing, and cross-references",
    url: "https://biblehub.com/interlinear/",
    category: "interlinear",
    icon: <BookOpen className="h-5 w-5" />
  },
  {
    name: "Step Bible (Tyndale House)",
    description: "Advanced Greek/Hebrew tools, morphology, word studies from Cambridge scholars",
    url: "https://www.stepbible.org/",
    category: "lexicon",
    icon: <GraduationCap className="h-5 w-5" />
  },
  {
    name: "Bible Study Tools - Lexicons",
    description: "Strong's, Thayer's, BDB lexicons searchable by word or Strong's number",
    url: "https://www.biblestudytools.com/lexicons/",
    category: "lexicon",
    icon: <Search className="h-5 w-5" />
  },
  
  // Commentaries
  {
    name: "Bible Hub Commentaries",
    description: "Matthew Henry, Gill, Jamieson-Fausset-Brown, Barnes, and more - verse by verse",
    url: "https://biblehub.com/commentaries/",
    category: "commentary",
    icon: <ScrollText className="h-5 w-5" />
  },
  {
    name: "StudyLight Commentaries",
    description: "Extensive library: Spurgeon, Calvin, Wesley, Clarke, Keil & Delitzsch",
    url: "https://www.studylight.org/commentary.html",
    category: "commentary",
    icon: <Library className="h-5 w-5" />
  },
  {
    name: "Precept Austin",
    description: "Detailed word studies, Greek/Hebrew resources, and devotional commentary",
    url: "https://www.preceptaustin.org/",
    category: "commentary",
    icon: <BookMarked className="h-5 w-5" />
  },
  {
    name: "Enduring Word Commentary",
    description: "David Guzik's accessible verse-by-verse commentary on the entire Bible",
    url: "https://enduringword.com/bible-commentary/",
    category: "commentary",
    icon: <BookOpen className="h-5 w-5" />
  },
  
  // Concordances & Dictionaries
  {
    name: "Strong's Concordance",
    description: "Search any English word to find original Greek/Hebrew with definitions",
    url: "https://www.blueletterbible.org/lexicon/strongs/",
    category: "concordance",
    icon: <Search className="h-5 w-5" />
  },
  {
    name: "Bible Hub Topical",
    description: "Nave's Topical Bible, Torrey's Topics, and thematic word studies",
    url: "https://biblehub.com/topical/",
    category: "dictionary",
    icon: <Globe className="h-5 w-5" />
  },
  {
    name: "ISBE - Bible Encyclopedia",
    description: "International Standard Bible Encyclopedia - historical and cultural background",
    url: "https://www.internationalstandardbible.com/",
    category: "dictionary",
    icon: <GraduationCap className="h-5 w-5" />
  },
  {
    name: "Bible History Online",
    description: "Maps, images, timelines, and cultural background for biblical studies",
    url: "https://www.bible-history.com/",
    category: "dictionary",
    icon: <Globe className="h-5 w-5" />
  }
];

const DefComRoomDrill = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeCategory, setActiveCategory] = useState<"all" | "lexicon" | "commentary" | "concordance" | "dictionary" | "interlinear">("all");

  const filteredResources = externalResources.filter(resource => {
    const matchesSearch = searchTerm === "" || 
      resource.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      resource.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = activeCategory === "all" || resource.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  const openResource = (url: string) => {
    window.open(url, "_blank", "noopener,noreferrer");
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "lexicon": return "bg-blue-500/10 text-blue-600 border-blue-500/20";
      case "commentary": return "bg-purple-500/10 text-purple-600 border-purple-500/20";
      case "concordance": return "bg-green-500/10 text-green-600 border-green-500/20";
      case "dictionary": return "bg-orange-500/10 text-orange-600 border-orange-500/20";
      case "interlinear": return "bg-pink-500/10 text-pink-600 border-pink-500/20";
      default: return "bg-muted text-muted-foreground";
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Card */}
      <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-primary/10">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            Word Study & Commentary Tools
          </CardTitle>
          <CardDescription>
            Access Greek/Hebrew lexicons, trusted commentaries, and concordances to deepen your study.
            These external resources complement your Def-Com Room work.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search resources..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Category Tabs */}
      <Tabs value={activeCategory} onValueChange={(v) => setActiveCategory(v as any)}>
        <TabsList className="w-full justify-start overflow-x-auto flex-wrap h-auto gap-1 p-1">
          <TabsTrigger value="all" className="gap-2">
            <BookOpen className="h-4 w-4" />
            All Resources
          </TabsTrigger>
          <TabsTrigger value="lexicon" className="gap-2">
            <Languages className="h-4 w-4" />
            Word Study / Lexicons
          </TabsTrigger>
          <TabsTrigger value="commentary" className="gap-2">
            <ScrollText className="h-4 w-4" />
            Commentaries
          </TabsTrigger>
          <TabsTrigger value="concordance" className="gap-2">
            <Search className="h-4 w-4" />
            Concordances
          </TabsTrigger>
          <TabsTrigger value="dictionary" className="gap-2">
            <Globe className="h-4 w-4" />
            Dictionaries
          </TabsTrigger>
          <TabsTrigger value="interlinear" className="gap-2">
            <BookOpen className="h-4 w-4" />
            Interlinear
          </TabsTrigger>
        </TabsList>

        <TabsContent value={activeCategory} className="mt-4">
          <div className="grid gap-4 md:grid-cols-2">
            {filteredResources.map((resource) => (
              <Card 
                key={resource.name} 
                className="hover:shadow-lg transition-all cursor-pointer group hover:border-primary/30"
                onClick={() => openResource(resource.url)}
              >
                <CardHeader className="pb-2">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                        {resource.icon}
                      </div>
                      <div>
                        <CardTitle className="text-lg group-hover:text-primary transition-colors">
                          {resource.name}
                        </CardTitle>
                      </div>
                    </div>
                    <ExternalLink className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-3">
                    {resource.description}
                  </p>
                  <Badge variant="outline" className={getCategoryColor(resource.category)}>
                    {resource.category.charAt(0).toUpperCase() + resource.category.slice(1)}
                  </Badge>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredResources.length === 0 && (
            <div className="text-center py-12">
              <Search className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">No resources match your search.</p>
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Quick Reference Card */}
      <Card className="bg-muted/30">
        <CardHeader>
          <CardTitle className="text-lg">Def-Com Room Quick Guide</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-3 gap-4 text-sm">
            <div className="space-y-2">
              <h4 className="font-semibold flex items-center gap-2">
                <Languages className="h-4 w-4 text-blue-500" />
                Word Study Steps
              </h4>
              <ol className="list-decimal list-inside text-muted-foreground space-y-1">
                <li>Identify 3-5 key words</li>
                <li>Find Strong's number</li>
                <li>Look up in lexicon (Greek/Hebrew)</li>
                <li>Note word usage patterns</li>
                <li>Check translation variations</li>
              </ol>
            </div>
            <div className="space-y-2">
              <h4 className="font-semibold flex items-center gap-2">
                <ScrollText className="h-4 w-4 text-purple-500" />
                Commentary Steps
              </h4>
              <ol className="list-decimal list-inside text-muted-foreground space-y-1">
                <li>Consult 2-3 trusted sources</li>
                <li>Note points of agreement</li>
                <li>Note differences/debates</li>
                <li>Record key insights</li>
                <li>Write synthesis paragraph</li>
              </ol>
            </div>
            <div className="space-y-2">
              <h4 className="font-semibold flex items-center gap-2">
                <Globe className="h-4 w-4 text-orange-500" />
                Cultural Context
              </h4>
              <ol className="list-decimal list-inside text-muted-foreground space-y-1">
                <li>Research historical setting</li>
                <li>Find 1-2 key cultural details</li>
                <li>Note what's obvious to ancients</li>
                <li>Document your sources</li>
                <li>Apply to interpretation</li>
              </ol>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DefComRoomDrill;
