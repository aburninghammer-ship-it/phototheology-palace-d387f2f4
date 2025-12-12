import { useState } from "react";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { 
  Eye, 
  BookOpen, 
  Users, 
  Clock,
  ChevronRight,
  Youtube,
  Shield
} from "lucide-react";

interface YouTubeLiveEntryProps {
  eventTitle: string;
  hostName?: string;
  youtubeUrl?: string;
  guestCount: number;
  onEnter: (displayName: string) => void;
  isLoading?: boolean;
}

export function YouTubeLiveEntry({
  eventTitle,
  hostName,
  youtubeUrl,
  guestCount,
  onEnter,
  isLoading
}: YouTubeLiveEntryProps) {
  const [displayName, setDisplayName] = useState("");
  const [agreed, setAgreed] = useState(false);
  const [showRules, setShowRules] = useState(true);

  const handleEnter = () => {
    if (displayName.trim() && agreed) {
      onEnter(displayName.trim());
    }
  };

  if (showRules) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="min-h-screen bg-background flex items-center justify-center p-4"
      >
        <Card className="max-w-2xl w-full p-8 bg-card/95 backdrop-blur-xl border-primary/20 relative overflow-hidden">
          {/* Decorative glow */}
          <div className="absolute -top-24 -right-24 w-48 h-48 rounded-full bg-primary/10 blur-3xl" />
          
          <div className="relative z-10">
            {/* Header */}
            <div className="text-center mb-8">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4"
              >
                <BookOpen className="w-10 h-10 text-primary" />
              </motion.div>
              <h1 className="text-3xl font-bold mb-2">Welcome to the Phototheology Guesthouse</h1>
              <p className="text-muted-foreground">A live, interactive Scripture experience</p>
            </div>

            {/* Rules */}
            <div className="space-y-6 mb-8">
              <div className="grid grid-cols-3 gap-4 text-center">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="p-4 rounded-lg bg-muted/30"
                >
                  <Eye className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
                  <p className="text-sm font-medium">You will not speak</p>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="p-4 rounded-lg bg-muted/30"
                >
                  <Shield className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
                  <p className="text-sm font-medium">You will not debate</p>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="p-4 rounded-lg bg-muted/30"
                >
                  <Users className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
                  <p className="text-sm font-medium">You will not chat freely</p>
                </motion.div>
              </div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="p-6 rounded-lg bg-primary/5 border border-primary/20"
              >
                <h3 className="font-semibold mb-3">Instead, you will:</h3>
                <ul className="space-y-2 text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <ChevronRight className="w-4 h-4 mt-0.5 text-primary" />
                    <span>Respond to short prompts</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <ChevronRight className="w-4 h-4 mt-0.5 text-primary" />
                    <span>Make simple selections</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <ChevronRight className="w-4 h-4 mt-0.5 text-primary" />
                    <span>Observe patterns forming in real time</span>
                  </li>
                </ul>
              </motion.div>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="text-center text-muted-foreground italic"
              >
                Your role is to <strong>see</strong>—not to argue.
              </motion.p>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="p-4 rounded-lg bg-muted/50 text-sm text-muted-foreground"
              >
                <p>
                  Everything you contribute is anonymous and brief. 
                  Responses are gathered, refined, and presented collectively.
                </p>
                <p className="mt-2">
                  This space is designed for <strong>clarity</strong>, <strong>reverence</strong>, and <strong>discovery</strong>.
                </p>
              </motion.div>
            </div>

            {/* Agreement and Entry */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="space-y-4"
            >
              <div className="flex items-start gap-3 p-4 rounded-lg border border-border/50">
                <Checkbox
                  id="agree"
                  checked={agreed}
                  onCheckedChange={(checked) => setAgreed(checked === true)}
                />
                <label htmlFor="agree" className="text-sm cursor-pointer">
                  By entering, I agree to stay within the prompts, keep responses short, 
                  and let Scripture speak for itself.
                </label>
              </div>

              <Button
                onClick={() => setShowRules(false)}
                disabled={!agreed}
                className="w-full"
                size="lg"
              >
                Continue to Enter
                <ChevronRight className="w-4 h-4 ml-2" />
              </Button>
            </motion.div>
          </div>
        </Card>
      </motion.div>
    );
  }

  // Name entry screen
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-background flex items-center justify-center p-4"
    >
      <Card className="max-w-md w-full p-8 bg-card/95 backdrop-blur-xl border-primary/20">
        <div className="text-center mb-8">
          <Badge variant="outline" className="mb-4">
            <Users className="w-3 h-3 mr-1" />
            {guestCount} guests present
          </Badge>
          <h1 className="text-2xl font-bold mb-2">{eventTitle}</h1>
          {hostName && (
            <p className="text-muted-foreground">Hosted by {hostName}</p>
          )}
        </div>

        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium mb-2 block">Your Display Name</label>
            <Input
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              placeholder="Enter a name..."
              maxLength={30}
            />
            <p className="text-xs text-muted-foreground mt-1">
              This is how you'll appear in the session (anonymous to others)
            </p>
          </div>

          <Button
            onClick={handleEnter}
            disabled={!displayName.trim() || isLoading}
            className="w-full"
            size="lg"
          >
            {isLoading ? "Entering..." : "Enter the Guesthouse"}
          </Button>

          {youtubeUrl && (
            <a
              href={youtubeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 text-sm text-red-500 hover:text-red-400 transition-colors"
            >
              <Youtube className="w-4 h-4" />
              Watch on YouTube
            </a>
          )}
        </div>
      </Card>
    </motion.div>
  );
}
