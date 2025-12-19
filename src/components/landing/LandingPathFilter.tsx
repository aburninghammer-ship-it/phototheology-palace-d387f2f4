import { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { BookOpen, Castle, ChevronRight } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

type ChoiceType = "surface" | "palace" | null;

export function LandingPathFilter() {
  const [selectedChoice, setSelectedChoice] = useState<ChoiceType>(null);
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleSelect = (choice: ChoiceType) => {
    setSelectedChoice(choice);
    if (choice === "palace") {
      localStorage.setItem("user_intent", "deep-study");
      // Small delay for visual feedback before navigation
      setTimeout(() => {
        if (user) {
          // Authenticated users go directly to the Palace
          navigate("/palace");
        } else {
          // New visitors go to auth to sign up first
          navigate("/auth");
        }
      }, 300);
    }
  };

  return (
    <section className="py-20 px-4 bg-gradient-to-b from-background via-background to-muted/20">
      <div className="max-w-5xl mx-auto">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-3xl sm:text-4xl md:text-5xl font-bold text-center mb-12 tracking-tight"
        >
          The Choice Is Yours
        </motion.h2>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Option 1: Remain at the Surface */}
          <motion.button
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            onClick={() => setSelectedChoice("surface")}
            className={`relative p-8 rounded-2xl text-left transition-all duration-300 border-2 ${
              selectedChoice === "surface"
                ? "border-blue-500/50 bg-blue-950/40"
                : "border-border/50 bg-card/50 hover:border-blue-500/30 hover:bg-blue-950/20"
            }`}
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-600 to-blue-800 flex items-center justify-center">
                <BookOpen className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-xl sm:text-2xl font-bold">Remain at the Surface</h3>
            </div>

            <div className="space-y-4 text-muted-foreground">
              <p>You may continue as you are.</p>
              
              <div className="space-y-1">
                <p>You will still read the Bible.</p>
                <p>You will still find comfort.</p>
                <p>You will still hear familiar truths.</p>
              </div>

              <p className="italic text-blue-400/80">
                You will stay where most remain—
                <br />
                moving verse to verse, devotion to devotion,
                <br />
                never quite seeing how it all fits together.
              </p>

              <p className="text-blue-400 font-medium">Nothing will change.</p>
            </div>
          </motion.button>

          {/* Option 2: Enter the Palace */}
          <motion.button
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            onClick={() => handleSelect("palace")}
            className={`relative p-8 rounded-2xl text-left transition-all duration-300 border-2 ${
              selectedChoice === "palace"
                ? "border-red-500/50 bg-red-950/30 scale-[1.02]"
                : "border-border/50 bg-card/50 hover:border-red-500/30 hover:bg-red-950/20"
            }`}
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-red-500 to-red-700 flex items-center justify-center">
                <Castle className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-xl sm:text-2xl font-bold">Enter the Palace</h3>
            </div>

            <div className="space-y-4 text-muted-foreground">
              <p>Or—you may step inside.</p>

              <div className="space-y-1">
                <p>Beyond this point, the Bible will no longer appear flat.</p>
                <p>Patterns will emerge.</p>
                <p>Connections will form.</p>
                <p>What once seemed distant will begin to speak across time.</p>
              </div>

              <p className="italic text-red-400/80">
                This is not passive study.
                <br />
                This is not entertainment.
                <br />
                This is not for the hurried or the casual.
              </p>

              <div className="flex items-center gap-2 text-red-400 font-medium">
                Select to Enter
                <ChevronRight className="h-4 w-4" />
              </div>
            </div>

            {selectedChoice === "palace" && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute top-4 right-4 w-6 h-6 rounded-full bg-red-500 flex items-center justify-center"
              >
                <svg
                  className="w-4 h-4 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </motion.div>
            )}
          </motion.button>
        </div>
      </div>
    </section>
  );
}
