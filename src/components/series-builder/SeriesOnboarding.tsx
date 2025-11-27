import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BookOpen, FileText, Layers, Users, ArrowRight, Sparkles } from "lucide-react";

interface SeriesOnboardingProps {
  onCreateNew: () => void;
  onStartFromTemplate: () => void;
  onBrowsePublic: () => void;
}

export function SeriesOnboarding({ onCreateNew, onStartFromTemplate, onBrowsePublic }: SeriesOnboardingProps) {
  return (
    <div className="space-y-8">
      {/* Welcome Message */}
      <Card className="bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-2xl">
            <Sparkles className="h-6 w-6 text-primary" />
            Welcome to Bible Study Series Builder!
          </CardTitle>
          <CardDescription className="text-base">
            Create engaging, Palace-structured Bible studies that lead people floor by floor through Scripture.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Layers className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="font-medium">Palace Structure</p>
                <p className="text-sm text-muted-foreground">
                  Every lesson ties to PT floors and rooms
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <BookOpen className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="font-medium">Christ-Centered</p>
                <p className="text-sm text-muted-foreground">
                  Built-in Christ emphasis in every lesson
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Users className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="font-medium">Ready to Share</p>
                <p className="text-sm text-muted-foreground">
                  Export, present, or share with your group
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Getting Started Options */}
      <div className="grid md:grid-cols-3 gap-6">
        <Card className="hover:shadow-lg transition-shadow cursor-pointer group" onClick={onCreateNew}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-primary" />
              Create from Scratch
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">
              Build a custom series with our step-by-step wizard. Perfect for specific topics or audiences.
            </p>
            <Button className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
              Start Creating
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow cursor-pointer group" onClick={onStartFromTemplate}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-primary" />
              Use a Template
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">
              Start with pre-built series on Daniel, Three Angels, Genesis, and more. Customize to make them yours.
            </p>
            <Button variant="outline" className="w-full">
              Browse Templates
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow cursor-pointer group" onClick={onBrowsePublic}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5 text-primary" />
              Discover & Follow
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">
              Browse public series created by others. Enroll, track progress, and learn together.
            </p>
            <Button variant="outline" className="w-full">
              Browse Public Series
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Tips Section */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Tips for Great Bible Study Series</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li className="flex items-start gap-2">
              <span className="text-primary">•</span>
              <span>Start with a clear "Big Idea" for each lesson — what should participants walk away knowing?</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary">•</span>
              <span>Use the Palace floors progressively — start with Story (Floor 1) before diving into Prophecy (Floor 5)</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary">•</span>
              <span>Include discussion questions that connect Scripture to daily life</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary">•</span>
              <span>Always include Christ emphasis — every lesson should point to Jesus</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary">•</span>
              <span>End with a practical "Take-Home Challenge" for application during the week</span>
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
