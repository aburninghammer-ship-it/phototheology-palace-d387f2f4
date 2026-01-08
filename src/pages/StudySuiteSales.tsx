import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Building2,
  Check,
  X,
  ArrowRight,
  BookOpen,
  Layers,
  Target,
  Eye,
  Hammer,
  Sparkles,
  Brain,
  Network,
} from "lucide-react";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { SEO } from "@/components/SEO";

export default function StudySuiteSales() {
  const floors = [
    {
      number: 1,
      name: "Story Room Floor",
      skill: "Narrative observation and recall",
      icon: BookOpen,
    },
    {
      number: 2,
      name: "Observation Floor",
      skill: "Disciplined textual attention",
      icon: Eye,
    },
    {
      number: 3,
      name: "Interpretation Floor",
      skill: "Meaning extraction through structure",
      icon: Brain,
    },
    {
      number: 4,
      name: "Concentration Floor",
      skill: "Christ-centered reading",
      icon: Target,
    },
    {
      number: 5,
      name: "Application Floor",
      skill: "Truth to life transfer",
      icon: Hammer,
    },
    {
      number: 6,
      name: "Pattern Floor",
      skill: "Cross-textual connections",
      icon: Network,
    },
    {
      number: 7,
      name: "Fire Floor",
      skill: "Emotional and spiritual weight",
      icon: Sparkles,
    },
    {
      number: 8,
      name: "Vision Floor",
      skill: "Prophetic interpretation",
      icon: Eye,
    },
  ];

  const outcomes = [
    "Work within each Room using its specific method and discipline",
    "Move through the Palace with intention rather than wandering",
    "Apply observation before interpretation, structure before conclusion",
    "See Christ emerge through governed study rather than imposed assertion",
    "Teach others using a transferable, repeatable system",
    "Interpret prophecy through the sanctuary lens with confidence",
    "Connect patterns across all 66 books systematically",
    "Build sermons, studies, and teachings on solid method",
  ];

  const included = [
    {
      title: "Complete Floor Training",
      description: "Method instruction for all 8 Floors with Room-by-Room guidance",
    },
    {
      title: "Skill Development Exercises",
      description: "Practical drills that build competency in each discipline",
    },
    {
      title: "Interpretive Framework",
      description: "Tools for moving from observation to conclusion with integrity",
    },
    {
      title: "Christ-Centered Method",
      description: "How the Concentration Room governs all study without forcing",
    },
    {
      title: "Pattern Recognition Training",
      description: "Systematic approach to types, symbols, and cross-references",
    },
    {
      title: "Prophetic Study Tools",
      description: "Vision Floor method for Daniel, Revelation, and sanctuary prophecy",
    },
  ];

  const isFor = [
    "Those who have completed the Quick-Start Guide or understand the Palace framework",
    "Bible students ready to move from reading to disciplined study",
    "Teachers, pastors, and leaders who want a transferable method",
    "Christians who want to see Christ throughout Scripture without forcing conclusions",
    "Anyone committed to structure before synthesis in interpretation",
  ];

  const isNotFor = [
    "Those seeking devotional content without method training",
    "Readers who have not oriented to the Palace architecture",
    "Anyone wanting quick tips rather than systematic skill building",
    "Those unwilling to practice discipline before application",
  ];

  return (
    <div className="min-h-screen bg-background">
      <SEO
        title="PhotoTheology Study Suite | Master the Method"
        description="Complete method training for all 8 Floors of the Phototheology Palace. Move from orientation to mastery with Room-by-Room skill development."
      />
      <Navigation />

      {/* 1. HERO SECTION */}
      <section className="relative py-24 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-accent/10" />
        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-4xl mx-auto text-center space-y-6"
          >
            <Badge variant="outline" className="text-primary border-primary/30">
              <Layers className="w-3 h-3 mr-2" />
              CORE LEVEL
            </Badge>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
              Now That You Know the Structure,
              <br />
              <span className="text-primary">Master the Method</span>
            </h1>

            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              The PhotoTheology Study Suite provides complete method training for every
              Floor and Room. You will develop the skills to study Scripture with
              discipline, confidence, and Christ-centered clarity.
            </p>

            <div className="pt-4">
              <Button
                size="lg"
                asChild
                className="text-lg px-8 py-6 h-auto"
              >
                <a href="https://buy.stripe.com/dRm28r6U37zo9ra0o46EU0e" target="_blank" rel="noopener noreferrer">
                  Get the Study Suite
                  <ArrowRight className="ml-2 w-5 h-5" />
                </a>
              </Button>
              <p className="text-sm text-muted-foreground mt-3">
                Instant access upon purchase
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* 2. THE PROBLEM THIS LEVEL SOLVES */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-4xl mx-auto"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
              The Problem: Knowing the Map Without Walking the Rooms
            </h2>

            <div className="grid md:grid-cols-2 gap-8">
              <Card className="border-destructive/20 bg-destructive/5">
                <CardContent className="p-6 space-y-4">
                  <h3 className="font-semibold text-lg">Understanding Without Competency</h3>
                  <ul className="space-y-3 text-muted-foreground">
                    <li className="flex items-start gap-3">
                      <X className="w-5 h-5 text-destructive mt-0.5 flex-shrink-0" />
                      Knowing what each Floor is for but not how to work within it
                    </li>
                    <li className="flex items-start gap-3">
                      <X className="w-5 h-5 text-destructive mt-0.5 flex-shrink-0" />
                      Recognizing Rooms but lacking the skill to use them
                    </li>
                    <li className="flex items-start gap-3">
                      <X className="w-5 h-5 text-destructive mt-0.5 flex-shrink-0" />
                      Reading about method without practicing it
                    </li>
                    <li className="flex items-start gap-3">
                      <X className="w-5 h-5 text-destructive mt-0.5 flex-shrink-0" />
                      Still depending on others for interpretation
                    </li>
                    <li className="flex items-start gap-3">
                      <X className="w-5 h-5 text-destructive mt-0.5 flex-shrink-0" />
                      Unable to transfer the system to teaching or preaching
                    </li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="border-primary/20 bg-primary/5">
                <CardContent className="p-6 space-y-4">
                  <h3 className="font-semibold text-lg">Method Training Provides</h3>
                  <ul className="space-y-3 text-muted-foreground">
                    <li className="flex items-start gap-3">
                      <Check className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                      Practical skill for each Room's specific discipline
                    </li>
                    <li className="flex items-start gap-3">
                      <Check className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                      Exercises that build competency through practice
                    </li>
                    <li className="flex items-start gap-3">
                      <Check className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                      Confidence to interpret without commentary dependence
                    </li>
                    <li className="flex items-start gap-3">
                      <Check className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                      A transferable system you can teach to others
                    </li>
                    <li className="flex items-start gap-3">
                      <Check className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                      Christ-centered conclusions that emerge, not force
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </motion.div>
        </div>
      </section>

      {/* 3. WHAT PHOTOTHEOLOGY IS */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-3xl mx-auto text-center space-y-8"
          >
            <h2 className="text-3xl md:text-4xl font-bold">
              Method Training, Not More Content
            </h2>

            <div className="space-y-6 text-lg text-muted-foreground text-left">
              <p>
                The Study Suite is not a collection of Bible studies for you to consume.
                It is <strong className="text-foreground">method training</strong> that develops
                your ability to conduct your own studies with confidence and integrity.
              </p>
              <p>
                Each Floor has specific Rooms. Each Room has a specific discipline. The Study
                Suite teaches you <strong className="text-foreground">how to work within each Room</strong>—what
                questions to ask, what to observe, how to interpret, and when to move to the next level.
              </p>
              <p>
                When you complete the Study Suite, you will not merely know more about the Bible.
                You will know <strong className="text-foreground">how to study</strong> the Bible
                with a method that serves you for life.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* 4. WHERE THIS PRODUCT FITS - THE 8 FLOORS */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-5xl mx-auto"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">
              The 8 Floors You Will Master
            </h2>
            <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
              The Study Suite provides method training for each Floor, teaching you the specific
              skill that Floor develops and how to apply it in your own study.
            </p>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
              {floors.map((floor, index) => (
                <motion.div
                  key={floor.number}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Card className="h-full border-primary/10 hover:border-primary/30 transition-colors">
                    <CardContent className="p-5">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                          <span className="font-bold text-primary">{floor.number}</span>
                        </div>
                        <floor.icon className="w-5 h-5 text-muted-foreground" />
                      </div>
                      <h3 className="font-semibold mb-1">{floor.name}</h3>
                      <p className="text-sm text-muted-foreground">{floor.skill}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>

            <div className="mt-12">
              <Card className="border-2 border-primary/20">
                <CardContent className="p-6">
                  <p className="text-center text-muted-foreground">
                    <strong className="text-foreground">Level:</strong> CORE — Method Training & Skill Development
                    <br />
                    <span className="text-sm">
                      This Suite covers all 8 Floors with Room-by-Room instruction. Advanced mastery training
                      builds upon this foundation.
                    </span>
                  </p>
                </CardContent>
              </Card>
            </div>
          </motion.div>
        </div>
      </section>

      {/* 5. WHAT THE READER WILL BE ABLE TO DO AFTER */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-3xl mx-auto"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
              After Completing the Study Suite, You Will Be Able To:
            </h2>

            <div className="space-y-4">
              {outcomes.map((outcome, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.08 }}
                  className="flex items-start gap-4 p-4 rounded-lg bg-muted/50"
                >
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                    <Check className="w-5 h-5 text-primary" />
                  </div>
                  <p className="text-lg">{outcome}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* 6. WHAT IS INCLUDED */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-4xl mx-auto"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
              What Is Included
            </h2>

            <div className="grid md:grid-cols-2 gap-6">
              {included.map((item, index) => (
                <Card key={index} className="border-primary/10">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <BookOpen className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                      <div>
                        <h3 className="font-semibold text-lg mb-2">{item.title}</h3>
                        <p className="text-muted-foreground">{item.description}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* 7. WHO THIS IS FOR / WHO IT IS NOT FOR */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-4xl mx-auto"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
              Is the Study Suite Right for You?
            </h2>

            <div className="grid md:grid-cols-2 gap-8">
              <Card className="border-primary/30">
                <CardContent className="p-6">
                  <h3 className="font-bold text-xl mb-6 flex items-center gap-2">
                    <Check className="w-6 h-6 text-primary" />
                    The Study Suite Is For You If:
                  </h3>
                  <ul className="space-y-4">
                    {isFor.map((item, index) => (
                      <li key={index} className="flex items-start gap-3 text-muted-foreground">
                        <Check className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              <Card className="border-muted">
                <CardContent className="p-6">
                  <h3 className="font-bold text-xl mb-6 flex items-center gap-2">
                    <X className="w-6 h-6 text-muted-foreground" />
                    The Study Suite Is Not For You If:
                  </h3>
                  <ul className="space-y-4">
                    {isNotFor.map((item, index) => (
                      <li key={index} className="flex items-start gap-3 text-muted-foreground">
                        <X className="w-5 h-5 text-muted-foreground mt-0.5 flex-shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </div>

            <div className="mt-8 text-center">
              <p className="text-muted-foreground">
                Not sure if you're ready?{" "}
                <Button variant="link" asChild className="p-0 h-auto"><Link to="/quick-start">
                  Start with the Quick-Start Guide
                </Link></Button>{" "}
                to orient yourself first.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* 9. PRICE & CTA */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-2xl mx-auto text-center"
          >
            <Card className="border-2 border-primary/30 bg-gradient-to-br from-primary/5 to-accent/5">
              <CardContent className="p-8 md:p-12 space-y-6">
                <Badge className="bg-primary/10 text-primary border-primary/20">
                  Complete Method Training
                </Badge>

                <h2 className="text-3xl font-bold">PhotoTheology Study Suite</h2>
                <p className="text-muted-foreground">
                  All 8 Floors. All Rooms. Complete skill development for disciplined Bible study.
                </p>

                <div className="py-6">
                  <p className="text-5xl font-bold text-primary">$97</p>
                  <p className="text-sm text-muted-foreground mt-2">
                    One-time purchase • Lifetime access
                  </p>
                </div>

                <Button
                  size="lg"
                  asChild
                  className="w-full text-lg py-6 h-auto"
                >
                  <a href="https://buy.stripe.com/dRm28r6U37zo9ra0o46EU0e" target="_blank" rel="noopener noreferrer">
                    <Building2 className="w-5 h-5 mr-2" />
                    Get the Study Suite
                  </a>
                </Button>

                <p className="text-xs text-muted-foreground">
                  You are purchasing access to method training—a system you will use for the rest of your
                  Bible study life. This is not content to consume but skill to develop.
                </p>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* 10. FINAL AUTHORITY STATEMENT */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-2xl mx-auto text-center space-y-6"
          >
            <Building2 className="w-12 h-12 text-primary mx-auto" />

            <h2 className="text-2xl md:text-3xl font-bold">
              Truth Deserves Discipline
            </h2>

            <p className="text-lg text-muted-foreground">
              Scripture is not a book to be skimmed. It is a revelation to be studied with
              the same discipline its Author used in composing it. The Palace method honors
              Scripture by meeting it with structure.
            </p>

            <p className="text-muted-foreground">
              The Study Suite is an invitation to move from casual reading to confident study.
              When you complete this training, you will not be the same kind of Bible reader
              you were before. You will be a student who knows the method.
            </p>

            <p className="text-sm text-muted-foreground italic">
              — Pastor Ivor Myers
            </p>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
