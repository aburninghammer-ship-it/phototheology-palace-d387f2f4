import { motion } from "framer-motion";
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
  Compass,
  DoorOpen,
} from "lucide-react";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { SEO } from "@/components/SEO";

export default function QuickStartSales() {
  const outcomes = [
    "Understand the architectural logic of the Phototheology Palace",
    "Identify the purpose of each of the 8 Floors",
    "Know which Room to enter for any study goal",
    "See why discipline precedes devotion in serious Bible study",
    "Prepare yourself for method training in the Study Suite",
  ];

  const included = [
    {
      title: "Palace Overview Map",
      description: "Visual guide to all 8 Floors and their governing purposes",
    },
    {
      title: "Floor-by-Floor Orientation",
      description: "What each Floor trains and why the sequence matters",
    },
    {
      title: "Room Entry Guide",
      description: "How to identify which Room serves your current study need",
    },
    {
      title: "Discipline Framework",
      description: "The foundational principle: structure before synthesis",
    },
  ];

  const isFor = [
    "Christians who want a structured approach to Bible study",
    "Those who sense there is order in Scripture but lack a framework",
    "Readers tired of fragmented, commentary-dependent study",
    "Anyone preparing to enter serious method training",
  ];

  const isNotFor = [
    "Those seeking devotional content or daily inspirations",
    "Readers wanting quick tips without foundational understanding",
    "Anyone unwilling to learn a structured system before applying it",
  ];

  return (
    <div className="min-h-screen bg-background">
      <SEO
        title="PhotoTheology Quick-Start Guide | Enter the Palace"
        description="Understand the architectural foundation of Phototheology. Orientation to the 8-Floor Palace system before method training begins."
      />
      <Navigation />

      {/* 1. HERO SECTION */}
      <section className="relative py-24 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-accent/5" />
        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-4xl mx-auto text-center space-y-6"
          >
            <Badge variant="outline" className="text-primary border-primary/30">
              <Building2 className="w-3 h-3 mr-2" />
              ENTRY LEVEL
            </Badge>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
              Before You Study Scripture,
              <br />
              <span className="text-primary">Understand the Structure</span>
            </h1>

            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              The PhotoTheology Quick-Start Guide orients you to the Palace framework.
              You will understand the architecture before you begin building within it.
            </p>

            <div className="pt-4">
              <Button
                size="lg"
                asChild
                className="text-lg px-8 py-6 h-auto"
              >
                <a href="https://buy.stripe.com/dRm28r6U37zo9ra0o46EU0e" target="_blank" rel="noopener noreferrer">
                  Get the Quick-Start Guide
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
              The Problem: Study Without Structure
            </h2>

            <div className="grid md:grid-cols-2 gap-8">
              <Card className="border-destructive/20 bg-destructive/5">
                <CardContent className="p-6 space-y-4">
                  <h3 className="font-semibold text-lg">What Most Bible Readers Experience</h3>
                  <ul className="space-y-3 text-muted-foreground">
                    <li className="flex items-start gap-3">
                      <X className="w-5 h-5 text-destructive mt-0.5 flex-shrink-0" />
                      Reading Scripture without a governing framework
                    </li>
                    <li className="flex items-start gap-3">
                      <X className="w-5 h-5 text-destructive mt-0.5 flex-shrink-0" />
                      Forcing Christ-centered conclusions instead of discovering them
                    </li>
                    <li className="flex items-start gap-3">
                      <X className="w-5 h-5 text-destructive mt-0.5 flex-shrink-0" />
                      Jumping between methods with no coherent system
                    </li>
                    <li className="flex items-start gap-3">
                      <X className="w-5 h-5 text-destructive mt-0.5 flex-shrink-0" />
                      Depending on commentaries to interpret what they read
                    </li>
                    <li className="flex items-start gap-3">
                      <X className="w-5 h-5 text-destructive mt-0.5 flex-shrink-0" />
                      Feeling that Scripture is fragmented rather than unified
                    </li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="border-primary/20 bg-primary/5">
                <CardContent className="p-6 space-y-4">
                  <h3 className="font-semibold text-lg">What Structure Provides</h3>
                  <ul className="space-y-3 text-muted-foreground">
                    <li className="flex items-start gap-3">
                      <Check className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                      A mental architecture for organizing all study
                    </li>
                    <li className="flex items-start gap-3">
                      <Check className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                      Clear entry points for different study objectives
                    </li>
                    <li className="flex items-start gap-3">
                      <Check className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                      Understanding of why Floors are sequenced as they are
                    </li>
                    <li className="flex items-start gap-3">
                      <Check className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                      Confidence that Christ emerges through disciplined observation
                    </li>
                    <li className="flex items-start gap-3">
                      <Check className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                      Foundation for transferable method training
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
              Phototheology Is a Method, Not a Message
            </h2>

            <div className="space-y-6 text-lg text-muted-foreground text-left">
              <p>
                Phototheology is a structured Bible study methodology built around a Palace
                framework. The Palace is composed of <strong className="text-foreground">Floors</strong> and{" "}
                <strong className="text-foreground">Rooms</strong> that govern how Scripture is studied,
                interpreted, and centered on Christ.
              </p>
              <p>
                This system emphasizes <strong className="text-foreground">discipline before devotion</strong> and{" "}
                <strong className="text-foreground">structure before synthesis</strong>. You do not begin
                with conclusions. You arrive at them through governed observation.
              </p>
              <p>
                The Quick-Start Guide does not teach you the full method. It orients you to the
                architecture so you know what you are entering.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* 4. WHERE THIS PRODUCT FITS IN THE PALACE */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-4xl mx-auto"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
              Where This Guide Fits in the Palace
            </h2>

            <Card className="border-2 border-primary/30">
              <CardContent className="p-8">
                <div className="grid md:grid-cols-3 gap-8">
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <Compass className="w-8 h-8 text-primary" />
                      <h3 className="font-bold text-lg">This Guide Covers</h3>
                    </div>
                    <ul className="space-y-2 text-muted-foreground">
                      <li className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-primary" />
                        Palace architecture overview
                      </li>
                      <li className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-primary" />
                        All 8 Floors introduced
                      </li>
                      <li className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-primary" />
                        Room entry logic explained
                      </li>
                      <li className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-primary" />
                        Foundational principles
                      </li>
                    </ul>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <Layers className="w-8 h-8 text-muted-foreground" />
                      <h3 className="font-bold text-lg">Skills Developed</h3>
                    </div>
                    <ul className="space-y-2 text-muted-foreground">
                      <li>Conceptual orientation</li>
                      <li>Architectural understanding</li>
                      <li>Framework recognition</li>
                      <li>Preparation for method training</li>
                    </ul>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <DoorOpen className="w-8 h-8 text-muted-foreground" />
                      <h3 className="font-bold text-lg">Not Covered Yet</h3>
                    </div>
                    <ul className="space-y-2 text-muted-foreground">
                      <li>Room-by-room method training</li>
                      <li>Skill development exercises</li>
                      <li>Application drills</li>
                      <li>Advanced interpretive tools</li>
                    </ul>
                  </div>
                </div>

                <div className="mt-8 pt-8 border-t border-border">
                  <p className="text-center text-muted-foreground">
                    <strong className="text-foreground">Level:</strong> ENTRY — Orientation & Conceptual Framework
                  </p>
                </div>
              </CardContent>
            </Card>
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
              After Completing This Guide, You Will Be Able To:
            </h2>

            <div className="space-y-4">
              {outcomes.map((outcome, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
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
              Is This Guide Right for You?
            </h2>

            <div className="grid md:grid-cols-2 gap-8">
              <Card className="border-primary/30">
                <CardContent className="p-6">
                  <h3 className="font-bold text-xl mb-6 flex items-center gap-2">
                    <Check className="w-6 h-6 text-primary" />
                    This Guide Is For You If:
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
                    This Guide Is Not For You If:
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
          </motion.div>
        </div>
      </section>

      {/* 8. THE NEXT FLOOR */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-3xl mx-auto text-center space-y-8"
          >
            <Badge variant="outline" className="text-muted-foreground">
              <Layers className="w-3 h-3 mr-2" />
              NEXT LEVEL
            </Badge>

            <h2 className="text-3xl md:text-4xl font-bold">
              After the Quick-Start: The Study Suite
            </h2>

            <p className="text-lg text-muted-foreground">
              Once you understand the Palace architecture, the{" "}
              <strong className="text-foreground">PhotoTheology Study Suite</strong> provides
              method training for each Room. You will move from conceptual understanding to
              skill development.
            </p>

            <p className="text-muted-foreground">
              The Study Suite teaches you how to actually work within each Room—how to observe,
              how to interpret, how to connect, and how to see Christ emerge through
              disciplined study.
            </p>

            <p className="text-sm text-muted-foreground italic">
              Progression matters. The Quick-Start prepares you. The Study Suite trains you.
            </p>
          </motion.div>
        </div>
      </section>

      {/* 9. PRICE & CTA */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-2xl mx-auto text-center"
          >
            <Card className="border-2 border-primary/30 bg-gradient-to-br from-primary/5 to-accent/5">
              <CardContent className="p-8 md:p-12 space-y-6">
                <h2 className="text-3xl font-bold">PhotoTheology Quick-Start Guide</h2>
                <p className="text-muted-foreground">
                  Entry into disciplined Bible study begins with understanding the structure.
                </p>

                <div className="py-6">
                  <p className="text-5xl font-bold text-primary">$17</p>
                  <p className="text-sm text-muted-foreground mt-2">
                    One-time purchase • Instant access
                  </p>
                </div>

                <Button
                  size="lg"
                  asChild
                  className="w-full text-lg py-6 h-auto"
                >
                  <a href="https://buy.stripe.com/dRm28r6U37zo9ra0o46EU0e" target="_blank" rel="noopener noreferrer">
                    <Target className="w-5 h-5 mr-2" />
                    Get the Quick-Start Guide
                  </a>
                </Button>

                <p className="text-xs text-muted-foreground">
                  This is not a subscription. You are purchasing access to training, not content consumption.
                </p>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* 10. FINAL AUTHORITY STATEMENT */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-2xl mx-auto text-center space-y-6"
          >
            <Building2 className="w-12 h-12 text-primary mx-auto" />

            <h2 className="text-2xl md:text-3xl font-bold">
              Scripture Deserves Structure
            </h2>

            <p className="text-lg text-muted-foreground">
              Truth deserves discipline. The Bible is not a collection of inspirational
              fragments—it is an architecturally unified revelation of Christ.
            </p>

            <p className="text-muted-foreground">
              The Quick-Start Guide is an invitation to see that architecture before you
              begin building within it. There is no pressure here—only an open door for
              those ready to study with discipline.
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
