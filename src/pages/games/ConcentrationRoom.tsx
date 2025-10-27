import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Navigation } from "@/components/Navigation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Trophy, ArrowLeft, Focus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Progress } from "@/components/ui/progress";

const passages = [
  {
    reference: "Exodus 12:13",
    text: "The blood will be a sign for you on the houses where you are, and when I see the blood, I will pass over you.",
    christConnection: "The Passover lamb foreshadows Christ, our Passover Lamb (1 Cor 5:7). The blood on the doorposts points to the blood of Christ that saves from death and judgment."
  },
  {
    reference: "Psalm 23:1",
    text: "The LORD is my shepherd, I shall not want.",
    christConnection: "Jesus declares 'I am the good shepherd' (John 10:11). He is the LORD of this psalm, the one who leads, provides, and lays down His life for the sheep."
  },
  {
    reference: "Genesis 22:8",
    text: "God will provide himself a lamb for the burnt offering, my son.",
    christConnection: "Abraham's prophetic words point to Christ. God literally provided Himself (Jesus) as the Lamb on Calvary. John the Baptist echoes this: 'Behold, the Lamb of God' (John 1:29)."
  },
  {
    reference: "Daniel 7:13-14",
    text: "In my vision at night I looked, and there before me was one like a son of man, coming with the clouds of heaven.",
    christConnection: "Jesus uses 'Son of Man' as His primary self-designation. This Daniel passage shows Christ receiving eternal dominion and kingdom from the Ancient of Days (cf. Matt 26:64)."
  },
  {
    reference: "Isaiah 53:5",
    text: "But he was pierced for our transgressions, he was crushed for our iniquities; the punishment that brought us peace was on him, and by his wounds we are healed.",
    christConnection: "This Suffering Servant is Christ crucified. Every detail (pierced, crushed, bearing sin, bringing peace) describes Calvary. Peter directly applies this to Jesus (1 Pet 2:24)."
  }
];

export default function ConcentrationRoom() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [currentPassage, setCurrentPassage] = useState(0);
  const [userAnswer, setUserAnswer] = useState("");
  const [revealed, setRevealed] = useState(false);
  const [score, setScore] = useState(0);

  const passage = passages[currentPassage];
  const progress = ((currentPassage + 1) / passages.length) * 100;

  const handleSubmit = () => {
    if (userAnswer.trim().length < 20) {
      toast({
        title: "Add More Detail",
        description: "Try to explain how this points to Christ more fully!",
        variant: "destructive",
      });
      return;
    }

    setScore(score + 1);
    setRevealed(true);
    
    toast({
      title: "Well Done!",
      description: "See how the whole Bible points to Jesus!",
    });
  };

  const handleNext = () => {
    if (currentPassage < passages.length - 1) {
      setCurrentPassage(currentPassage + 1);
      setUserAnswer("");
      setRevealed(false);
    }
  };

  const isGameComplete = currentPassage === passages.length - 1 && revealed;

  if (isGameComplete) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <main className="container mx-auto px-4 py-8 max-w-4xl">
          <Card className="text-center">
            <CardHeader>
              <Trophy className="h-16 w-16 mx-auto text-yellow-500 mb-4" />
              <CardTitle className="text-3xl">Concentration Room Mastered!</CardTitle>
              <CardDescription>
                You're seeing Christ in all Scripture!
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-4xl font-bold text-primary">
                {score} / {passages.length}
              </div>
              <p className="text-muted-foreground">
                "These are they which testify of me" - John 5:39
              </p>
              <div className="flex gap-4 justify-center">
                <Button onClick={() => navigate("/games")}>
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to Games
                </Button>
                <Button onClick={() => window.location.reload()} variant="outline">
                  Play Again
                </Button>
              </div>
            </CardContent>
          </Card>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <Button
          variant="ghost"
          onClick={() => navigate("/games")}
          className="mb-4"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Games
        </Button>

        <Card className="mb-6">
          <CardHeader>
            <div className="flex items-center justify-between mb-2">
              <Badge variant="secondary">Floor 4 • Concentration Room (CR)</Badge>
              <Badge variant="outline">
                {currentPassage + 1} / {passages.length}
              </Badge>
            </div>
            <CardTitle className="text-3xl">✝️ Concentration Room</CardTitle>
            <CardDescription>
              Every text must reveal Christ. Use the magnifying glass on every verse until Jesus comes into focus!
            </CardDescription>
            <Progress value={progress} className="mt-4" />
          </CardHeader>
        </Card>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>{passage.reference}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Passage Text */}
            <div className="p-6 bg-muted rounded-lg">
              <p className="text-lg leading-relaxed italic">{passage.text}</p>
            </div>

            {/* User Input */}
            {!revealed && (
              <>
                <div>
                  <h3 className="font-semibold mb-3 flex items-center gap-2">
                    <Focus className="h-5 w-5" />
                    How does this passage reveal Christ?
                  </h3>
                  <Textarea
                    value={userAnswer}
                    onChange={(e) => setUserAnswer(e.target.value)}
                    placeholder="Explain how this passage points to Jesus Christ...&#10;&#10;Consider: Is He a type? A prophecy? A principle? A promise?"
                    className="min-h-[150px]"
                  />
                  <p className="text-xs text-muted-foreground mt-2">
                    Remember: "These are they which testify of me" (John 5:39). No text is random - all Scripture reveals Christ!
                  </p>
                </div>

                <Button
                  onClick={handleSubmit}
                  disabled={userAnswer.trim().length === 0}
                  className="w-full"
                  size="lg"
                >
                  Submit Answer
                </Button>
              </>
            )}

            {/* Revealed Answer */}
            {revealed && (
              <>
                <div className="space-y-4">
                  <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-lg">
                    <h3 className="font-semibold mb-3 text-blue-800 dark:text-blue-400">
                      Your Answer:
                    </h3>
                    <p className="text-sm whitespace-pre-wrap">{userAnswer}</p>
                  </div>

                  <div className="bg-green-50 dark:bg-green-900/20 p-6 rounded-lg">
                    <h3 className="font-semibold mb-3 text-green-800 dark:text-green-400">
                      ✓ Christ Connection:
                    </h3>
                    <p className="text-sm leading-relaxed">{passage.christConnection}</p>
                  </div>
                </div>

                <Button onClick={handleNext} className="w-full" size="lg">
                  {currentPassage < passages.length - 1 ? "Next Passage" : "Finish"}
                </Button>
              </>
            )}
          </CardContent>
        </Card>

        <Card className="bg-amber-50 dark:bg-amber-900/20">
          <CardContent className="pt-6">
            <h4 className="font-semibold mb-2">💡 Concentration Room Rule:</h4>
            <p className="text-sm text-muted-foreground mb-2">
              Every text must pass through this room. Use the magnifying glass until Christ comes into focus. Without this lens, Bible study collapses into moral lessons or disconnected trivia.
            </p>
            <p className="text-xs text-muted-foreground italic">
              "And beginning with Moses and all the Prophets, he explained to them what was said in all the Scriptures concerning himself." - Luke 24:27
            </p>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
