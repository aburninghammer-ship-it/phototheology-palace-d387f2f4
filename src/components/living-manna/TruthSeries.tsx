import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useAuth } from "@/hooks/useAuth";
import { callJeeves } from "@/lib/jeevesClient";
import { 
  GraduationCap, BookOpen, ChevronRight, Play, Check, Loader2, 
  Sparkles, MessageSquare, RefreshCw
} from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import ReactMarkdown from "react-markdown";
import { toast } from "sonner";

interface TruthSeriesProps {
  churchId?: string;
}

// The 28 Fundamental Beliefs topics for Jeeves-led studies
const TRUTH_SERIES_TOPICS = [
  { id: 1, title: "The Holy Scriptures", summary: "God's written Word as the infallible revelation of His will" },
  { id: 2, title: "The Trinity", summary: "One God: Father, Son, and Holy Spirit—three co-eternal Persons" },
  { id: 3, title: "The Father", summary: "God the eternal Father is the Creator and Source of all things" },
  { id: 4, title: "The Son", summary: "God the eternal Son became incarnate in Jesus Christ" },
  { id: 5, title: "The Holy Spirit", summary: "God the eternal Spirit was active in creation, incarnation, and redemption" },
  { id: 6, title: "Creation", summary: "God is Creator of all things, including humanity in His image" },
  { id: 7, title: "The Nature of Humanity", summary: "Man and woman were made in the image of God" },
  { id: 8, title: "The Great Controversy", summary: "The conflict between Christ and Satan that affects all humanity" },
  { id: 9, title: "The Life, Death, and Resurrection of Christ", summary: "God's supreme revelation of His love" },
  { id: 10, title: "The Experience of Salvation", summary: "Through Christ we are justified, adopted, sanctified, and glorified" },
  { id: 11, title: "Growing in Christ", summary: "By His death, Jesus triumphed over evil powers" },
  { id: 12, title: "The Church", summary: "The community of believers who confess Jesus as Lord and Savior" },
  { id: 13, title: "The Remnant and Its Mission", summary: "The universal church includes all who truly believe in Christ" },
  { id: 14, title: "Unity in the Body of Christ", summary: "The church is one body with many members" },
  { id: 15, title: "Baptism", summary: "The symbol of union with Christ and new life through the Spirit" },
  { id: 16, title: "The Lord's Supper", summary: "Participation in the emblems of Christ's body and blood" },
  { id: 17, title: "Spiritual Gifts and Ministries", summary: "God bestows gifts upon all members of the church" },
  { id: 18, title: "The Gift of Prophecy", summary: "The Spirit of Prophecy is an identifying mark of the remnant" },
  { id: 19, title: "The Law of God", summary: "The Ten Commandments as the transcript of God's character" },
  { id: 20, title: "The Sabbath", summary: "The seventh day of the week as a memorial of creation and redemption" },
  { id: 21, title: "Stewardship", summary: "We are God's stewards, entrusted with time, opportunities, and possessions" },
  { id: 22, title: "Christian Behavior", summary: "Called to be a godly people in thought, feeling, and action" },
  { id: 23, title: "Marriage and the Family", summary: "Marriage instituted in Eden as a lifelong union" },
  { id: 24, title: "Christ's Ministry in the Heavenly Sanctuary", summary: "The sanctuary in heaven and Christ's ministration" },
  { id: 25, title: "The Second Coming of Christ", summary: "Christ's return as the blessed hope of the church" },
  { id: 26, title: "Death and Resurrection", summary: "The state of the dead and the resurrection at Christ's return" },
  { id: 27, title: "The Millennium and the End of Sin", summary: "The 1000 years and the final eradication of evil" },
  { id: 28, title: "The New Earth", summary: "God will make all things new—the eternal home of the redeemed" },
];

export function TruthSeries({ churchId }: TruthSeriesProps) {
  const { user } = useAuth();
  const [selectedTopic, setSelectedTopic] = useState<typeof TRUTH_SERIES_TOPICS[0] | null>(null);
  const [studyContent, setStudyContent] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [completedTopics, setCompletedTopics] = useState<number[]>([]);
  const [followUpQuestion, setFollowUpQuestion] = useState("");
  const [followUpAnswer, setFollowUpAnswer] = useState<string | null>(null);
  const [isAskingFollowUp, setIsAskingFollowUp] = useState(false);

  const handleStartStudy = async (topic: typeof TRUTH_SERIES_TOPICS[0]) => {
    setSelectedTopic(topic);
    setStudyContent(null);
    setFollowUpAnswer(null);
    setIsLoading(true);

    try {
      const { data, error } = await callJeeves({
        mode: "truth-series-study",
        message: `Please conduct a Bible study on "${topic.title}" (${topic.summary}). 
        
        This is for seekers exploring Adventist beliefs. Use the Phototheology approach:
        1. Start with a warm welcome and prayer focus
        2. Present the core Scripture passages (cite at least 3 key texts)
        3. Explain the teaching clearly using Christ-centered interpretation
        4. Show how this truth connects to the sanctuary and the great controversy
        5. Include practical application for daily life
        6. End with discussion questions and a memory verse
        
        Make it conversational, warm, and focused on Jesus. Avoid jargon.`,
      }, "truth-series");

      if (error) throw error;
      const result = data as { response?: string; content?: string } | undefined;
      setStudyContent(result?.response || result?.content || "Study content could not be loaded.");
    } catch (error) {
      console.error("Error loading study:", error);
      toast.error("Failed to load study. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleAskFollowUp = async () => {
    if (!followUpQuestion.trim() || !selectedTopic) return;
    
    setIsAskingFollowUp(true);
    try {
      const { data, error } = await callJeeves({
        mode: "truth-series-followup",
        message: `The seeker is studying "${selectedTopic.title}" and has this question: "${followUpQuestion}"
        
        Please answer using the Phototheology approach - Christ-centered, Scripture-based, warm and encouraging. 
        Reference relevant Bible passages. Keep it conversational.`,
      }, "truth-series-followup");

      if (error) throw error;
      const result = data as { response?: string; content?: string } | undefined;
      setFollowUpAnswer(result?.response || result?.content || "Could not get an answer.");
      setFollowUpQuestion("");
    } catch (error) {
      console.error("Error with follow-up:", error);
      toast.error("Failed to get answer. Please try again.");
    } finally {
      setIsAskingFollowUp(false);
    }
  };

  const handleMarkComplete = () => {
    if (selectedTopic && !completedTopics.includes(selectedTopic.id)) {
      setCompletedTopics([...completedTopics, selectedTopic.id]);
      toast.success("Topic marked as complete!");
    }
  };

  const progress = (completedTopics.length / TRUTH_SERIES_TOPICS.length) * 100;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2 text-foreground">
            <GraduationCap className="h-6 w-6 text-primary" />
            Truth Series
          </h2>
          <p className="text-foreground/70">
            Jeeves-guided Bible studies through the 28 Fundamental Beliefs
          </p>
        </div>
        <Badge variant="outline" className="text-primary border-primary">
          <Sparkles className="h-3 w-3 mr-1" />
          AI-Powered
        </Badge>
      </div>

      {/* Progress Bar */}
      <Card variant="glass" className="bg-card/80">
        <CardContent className="py-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-foreground">Journey Progress</span>
            <span className="text-sm text-foreground/70">{completedTopics.length} / {TRUTH_SERIES_TOPICS.length} topics</span>
          </div>
          <Progress value={progress} className="h-2" />
        </CardContent>
      </Card>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Topics List */}
        <Card variant="glass" className="lg:col-span-1 bg-card/80">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-foreground">
              <BookOpen className="h-5 w-5" />
              Study Topics
            </CardTitle>
            <CardDescription className="text-foreground/70">
              Select a topic to begin your study
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[500px] pr-4">
              <div className="space-y-2">
                {TRUTH_SERIES_TOPICS.map((topic) => {
                  const isCompleted = completedTopics.includes(topic.id);
                  const isSelected = selectedTopic?.id === topic.id;
                  
                  return (
                    <button
                      key={topic.id}
                      onClick={() => handleStartStudy(topic)}
                      className={`w-full text-left p-3 rounded-lg transition-all ${
                        isSelected 
                          ? "bg-primary/20 border border-primary/50" 
                          : "bg-background/50 border border-border/50 hover:bg-background/80 hover:border-primary/30"
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                          isCompleted 
                            ? "bg-green-500/20 text-green-400" 
                            : "bg-primary/20 text-primary"
                        }`}>
                          {isCompleted ? <Check className="h-4 w-4" /> : topic.id}
                        </div>
                        <div className="flex-1">
                          <h4 className="font-medium text-sm text-foreground">{topic.title}</h4>
                          <p className="text-xs text-foreground/60 mt-0.5 line-clamp-1">{topic.summary}</p>
                        </div>
                        <ChevronRight className="h-4 w-4 text-foreground/40 mt-0.5" />
                      </div>
                    </button>
                  );
                })}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>

        {/* Study Content */}
        <Card variant="glass" className="lg:col-span-2 bg-card/80">
          <CardHeader>
            <CardTitle className="text-foreground">
              {selectedTopic ? selectedTopic.title : "Select a Topic"}
            </CardTitle>
            {selectedTopic && (
              <CardDescription className="text-foreground/70">{selectedTopic.summary}</CardDescription>
            )}
          </CardHeader>
          <CardContent>
            {!selectedTopic && (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <GraduationCap className="h-16 w-16 text-primary/30 mb-4" />
                <h3 className="text-lg font-medium text-foreground mb-2">Begin Your Journey</h3>
                <p className="text-foreground/60 max-w-md">
                  Select a topic from the list to have Jeeves guide you through an interactive 
                  Bible study on the fundamental beliefs of the Seventh-day Adventist Church.
                </p>
              </div>
            )}

            {isLoading && (
              <div className="flex flex-col items-center justify-center py-16">
                <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
                <p className="text-foreground/70">Jeeves is preparing your study...</p>
              </div>
            )}

            {studyContent && !isLoading && (
              <div className="space-y-6">
                <ScrollArea className="h-[400px] pr-4">
                  <div className="prose prose-sm prose-invert max-w-none">
                    <ReactMarkdown>{studyContent}</ReactMarkdown>
                  </div>
                </ScrollArea>

                {/* Follow-up Question */}
                <div className="border-t border-border/50 pt-4">
                  <h4 className="text-sm font-medium text-foreground mb-3 flex items-center gap-2">
                    <MessageSquare className="h-4 w-4" />
                    Ask Jeeves a Follow-up Question
                  </h4>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={followUpQuestion}
                      onChange={(e) => setFollowUpQuestion(e.target.value)}
                      placeholder="Type your question..."
                      className="flex-1 bg-background/50 border border-border rounded-lg px-4 py-2 text-sm text-foreground placeholder:text-foreground/40"
                      onKeyPress={(e) => e.key === 'Enter' && handleAskFollowUp()}
                    />
                    <Button 
                      onClick={handleAskFollowUp} 
                      disabled={isAskingFollowUp || !followUpQuestion.trim()}
                      size="sm"
                    >
                      {isAskingFollowUp ? <Loader2 className="h-4 w-4 animate-spin" /> : "Ask"}
                    </Button>
                  </div>

                  {followUpAnswer && (
                    <div className="mt-4 p-4 bg-primary/5 border border-primary/20 rounded-lg">
                      <div className="prose prose-sm prose-invert max-w-none">
                        <ReactMarkdown>{followUpAnswer}</ReactMarkdown>
                      </div>
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="flex gap-3 pt-4 border-t border-border/50">
                  <Button onClick={handleMarkComplete} variant="default" className="flex-1">
                    <Check className="h-4 w-4 mr-2" />
                    Mark Complete
                  </Button>
                  <Button onClick={() => handleStartStudy(selectedTopic!)} variant="outline">
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Regenerate
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}