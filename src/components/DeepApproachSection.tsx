import { CheckCircle2, X, Clock, Brain, Target, Sparkles } from "lucide-react";

const quickFixProblems = [
  "Surface-level summaries",
  "Forgotten in weeks",
  "No lasting transformation",
  "Skipping the hard work",
];

const deepApproachBenefits = [
  { icon: Clock, text: "2-year mastery journey" },
  { icon: Brain, text: "Visual memory palace system" },
  { icon: Target, text: "Monthly gates ensure real progress" },
  { icon: Sparkles, text: "Christ-centered transformation" },
];

export const DeepApproachSection = () => {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-background">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Most Apps Promise <span className="text-muted-foreground line-through">Quick</span>
          </h2>
          <p className="text-2xl font-semibold text-primary">
            We Promise Deep.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 lg:gap-16">
          {/* Quick Fix Column */}
          <div className="space-y-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-full bg-destructive/20 flex items-center justify-center">
                <X className="h-6 w-6 text-destructive" />
              </div>
              <h3 className="text-2xl font-bold text-muted-foreground">The Quick Fix Trap</h3>
            </div>
            
            <p className="text-muted-foreground">
              Bible apps that promise "learn in 5 minutes a day" deliver exactly that—5 minutes of shallow exposure that fades by lunchtime.
            </p>

            <ul className="space-y-3">
              {quickFixProblems.map((problem, i) => (
                <li key={i} className="flex items-center gap-3 text-muted-foreground">
                  <X className="h-5 w-5 text-destructive shrink-0" />
                  <span>{problem}</span>
                </li>
              ))}
            </ul>

            <div className="p-4 rounded-lg bg-muted/50 border border-border">
              <p className="text-sm text-muted-foreground italic">
                "I've used a dozen Bible apps. I can't remember anything I 'learned' last month."
              </p>
              <p className="text-xs text-muted-foreground/70 mt-2">— Every frustrated believer</p>
            </div>
          </div>

          {/* Deep Approach Column */}
          <div className="space-y-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
                <CheckCircle2 className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-2xl font-bold">The Phototheology Way</h3>
            </div>
            
            <p className="text-foreground">
              A structured 2-year journey through the 8-floor Palace. No shortcuts. No gimmicks. Just systematic mastery that transforms how you think.
            </p>

            <ul className="space-y-3">
              {deepApproachBenefits.map((benefit, i) => {
                const Icon = benefit.icon;
                return (
                  <li key={i} className="flex items-center gap-3">
                    <Icon className="h-5 w-5 text-primary shrink-0" />
                    <span className="font-medium">{benefit.text}</span>
                  </li>
                );
              })}
            </ul>

            <div className="p-4 rounded-lg bg-primary/10 border border-primary/20">
              <p className="text-sm italic">
                "For the first time, Scripture isn't just words—it's rooms I can walk through. I'll never unlearn this."
              </p>
              <p className="text-xs text-muted-foreground mt-2">— Palace Builder, Month 8</p>
            </div>
          </div>
        </div>

        <div className="mt-16 text-center">
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            <strong className="text-foreground">The question isn't "how fast?"</strong>
            <br />
            It's "how deep are you willing to go?"
          </p>
        </div>
      </div>
    </section>
  );
};
