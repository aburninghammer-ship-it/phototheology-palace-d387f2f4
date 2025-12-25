import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Sparkles, Book, Cross, ChevronRight } from "lucide-react";
import { getStoryOfTheDay, type BiblicalStory } from "@/data/storyLibraryComplete";

interface StoryOfTheDayProps {
  onViewStory: (story: BiblicalStory) => void;
}

export function StoryOfTheDay({ onViewStory }: StoryOfTheDayProps) {
  const story = getStoryOfTheDay();

  return (
    <Card className="bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950/30 dark:to-orange-950/30 border-amber-200 dark:border-amber-800">
      <CardHeader className="pb-2">
        <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400 mb-1">
          <Sparkles className="h-4 w-4" />
          <span className="text-sm font-medium uppercase tracking-wide">Story of the Day</span>
        </div>
        <CardTitle className="text-xl flex items-center gap-2">
          {story.title}
          <Badge variant="outline" className="text-xs">{story.reference}</Badge>
        </CardTitle>
        <CardDescription className="flex items-center gap-2">
          <Badge className="bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200">
            {story.volume}
          </Badge>
          <Badge variant="secondary">{story.category}</Badge>
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground line-clamp-3">{story.summary}</p>
        
        {/* Christ Pattern Preview */}
        <div className="bg-white/50 dark:bg-black/20 rounded-lg p-3 space-y-2">
          <h4 className="text-xs font-semibold flex items-center gap-1 text-amber-700 dark:text-amber-300">
            <Cross className="h-3 w-3" /> Christ Pattern Highlight
          </h4>
          <div className="text-sm">
            <span className="font-medium">{story.christPattern[0]?.element}</span>
            <span className="text-muted-foreground"> → {story.christPattern[0]?.christApplication}</span>
          </div>
        </div>

        <Button 
          variant="outline" 
          className="w-full group border-amber-300 dark:border-amber-700 hover:bg-amber-100 dark:hover:bg-amber-900/50"
          onClick={() => onViewStory(story)}
        >
          <Book className="h-4 w-4 mr-2" />
          Read Full Story
          <ChevronRight className="h-4 w-4 ml-auto group-hover:translate-x-1 transition-transform" />
        </Button>
      </CardContent>
    </Card>
  );
}
