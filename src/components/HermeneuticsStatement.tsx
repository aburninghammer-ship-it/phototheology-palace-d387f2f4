import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Shield, 
  BookOpen, 
  Target,
  Scale,
  AlertTriangle,
  CheckCircle2,
  ChevronRight,
  Cross
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const CORE_PRINCIPLES = [
  {
    icon: <Cross className="h-5 w-5" />,
    title: "Christ-Centered",
    description: "Every passage points to Jesus. We use the Concentration Room principle: if Christ isn't visible, we've misread the text (John 5:39, Luke 24:27)."
  },
  {
    icon: <BookOpen className="h-5 w-5" />,
    title: "Scripture Interprets Scripture",
    description: "The Bible is its own best interpreter. We cross-reference verses, letting God's Word explain itself rather than imposing external ideas."
  },
  {
    icon: <Scale className="h-5 w-5" />,
    title: "Context First",
    description: "Every verse has a home: text, chapter, book, cycle, and heaven. We never rip passages out of their literary and historical context."
  },
  {
    icon: <Target className="h-5 w-5" />,
    title: "Typology, Not Allegory",
    description: "We recognize God's types and patterns (lamb = Christ, temple = heaven) grounded in biblical precedent — not arbitrary symbolic readings."
  }
];

const SAFEGUARDS = [
  "We distinguish between types (biblical foreshadows) and parallels (mirrored historical events)",
  "We test every interpretation by the 'Fruit Room' principle: does it produce Christlike character?",
  "We acknowledge what is clear, debated, and mysterious — never claiming certainty where Scripture is silent",
  "We encourage comparison with trusted commentaries and historical Christian interpretation",
  "We welcome correction and dialogue — Phototheology is a method, not a creed"
];

const WHAT_WE_AVOID = [
  "Making symbols mean whatever we want (eisegesis)",
  "Ignoring historical-grammatical context",
  "Replacing sound doctrine with creative speculation",
  "Claiming new revelation beyond Scripture"
];

export const HermeneuticsStatement = () => {
  const navigate = useNavigate();

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <Badge className="mb-4 bg-primary/10 text-primary border-primary/20">
            <Shield className="h-3 w-3 mr-1" />
            Theological Integrity
          </Badge>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            How We Interpret Scripture
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Phototheology is a method for memory and mastery — not a replacement for sound biblical hermeneutics. Here's how we guard against error.
          </p>
        </div>

        {/* Core Principles */}
        <div className="grid sm:grid-cols-2 gap-6 mb-12">
          {CORE_PRINCIPLES.map((principle, idx) => (
            <Card key={idx} className="border-border">
              <CardContent className="pt-6">
                <div className="flex items-start gap-4">
                  <div className="p-2 rounded-lg bg-primary/10 text-primary">
                    {principle.icon}
                  </div>
                  <div>
                    <h3 className="font-bold mb-2">{principle.title}</h3>
                    <p className="text-sm text-muted-foreground">{principle.description}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Safeguards and What We Avoid */}
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          {/* Safeguards */}
          <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-transparent">
            <CardContent className="pt-6">
              <div className="flex items-center gap-2 mb-4">
                <CheckCircle2 className="h-5 w-5 text-primary" />
                <h3 className="font-bold text-lg">Our Safeguards</h3>
              </div>
              <ul className="space-y-3">
                {SAFEGUARDS.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-3 text-sm">
                    <CheckCircle2 className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                    <span className="text-muted-foreground">{item}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          {/* What We Avoid */}
          <Card className="border-destructive/20 bg-gradient-to-br from-destructive/5 to-transparent">
            <CardContent className="pt-6">
              <div className="flex items-center gap-2 mb-4">
                <AlertTriangle className="h-5 w-5 text-destructive" />
                <h3 className="font-bold text-lg">What We Avoid</h3>
              </div>
              <ul className="space-y-3">
                {WHAT_WE_AVOID.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-3 text-sm">
                    <AlertTriangle className="h-4 w-4 text-destructive/70 flex-shrink-0 mt-0.5" />
                    <span className="text-muted-foreground">{item}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>

        {/* Bottom Note */}
        <Card className="border-border bg-muted/30">
          <CardContent className="py-6">
            <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6">
              <Shield className="h-12 w-12 text-primary flex-shrink-0" />
              <div className="text-center sm:text-left flex-1">
                <h3 className="font-bold mb-1">Built on Orthodox Foundations</h3>
                <p className="text-sm text-muted-foreground">
                  Phototheology is developed from a Seventh-day Adventist perspective but is designed to serve all Bible-believing Christians. 
                  The Palace method enhances — never replaces — careful study, prayer, and the leading of the Holy Spirit.
                </p>
              </div>
              <Button 
                variant="outline" 
                onClick={() => navigate("/about")}
                className="flex-shrink-0"
              >
                Learn More
                <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};
