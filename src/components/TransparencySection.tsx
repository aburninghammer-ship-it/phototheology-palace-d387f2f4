import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Check, 
  X, 
  Lock,
  Gift,
  HelpCircle,
  ChevronRight,
  CreditCard
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const FREE_FEATURES = [
  "Palace Floors 1-2 (Foundation & Investigation)",
  "Daily Devotionals",
  "Basic Jeeves AI Chat (limited messages)",
  "Daily Challenge",
  "Bible Reader (KJV)",
  "Community Access",
  "App Tour & Onboarding",
  "Basic Progress Tracking"
];

const PAID_FEATURES = [
  "All 8 Palace Floors (Complete System)",
  "Unlimited Jeeves AI Conversations",
  "Bible Study Series Builder",
  "Advanced Drills & Assessments",
  "Sermon Prep Tools",
  "Devotional Plan Creator",
  "Church/Group Features",
  "Priority Support",
  "Certificates of Completion"
];

const FAQ_ITEMS = [
  {
    question: "Is there really a free tier, or just a trial?",
    answer: "Yes, truly free forever. You get permanent access to Floors 1-2, daily devotionals, and basic Jeeves chat. No credit card required, no expiration. We believe everyone should have access to foundational Bible study tools."
  },
  {
    question: "What's the difference between the app and the card deck/courses?",
    answer: "The Phototheology App is a standalone digital Bible study platform. The physical card deck and video courses are separate products that complement the app but are not required. The app contains the complete Palace method — you don't need anything else to master it."
  },
  {
    question: "How is this different from YouVersion or Logos?",
    answer: "YouVersion is excellent for reading and plans. Logos is powerful for scholarly research. Phototheology is specifically designed for memory and mastery — turning Scripture into visual palaces you'll never forget. It's not a replacement; it's a complementary approach for those who want to truly internalize the Bible."
  },
  {
    question: "Do I need to be tech-savvy to use this?",
    answer: "Not at all. The app is designed for all skill levels. Our guided tours and Jeeves AI assistant help you every step of the way. If you can use a smartphone, you can use Phototheology."
  },
  {
    question: "Is this a particular denomination's interpretation?",
    answer: "Phototheology teaches a Christ-centered, Bible-believing approach. While developed from an Adventist perspective, the Palace method and hermeneutical principles are applicable across Protestant traditions. We focus on what unites believers: Christ as the center of all Scripture."
  },
  {
    question: "Can I cancel anytime?",
    answer: "Absolutely. No contracts, no hidden fees. Cancel your premium subscription anytime and you'll retain access to all free features. We don't believe in locking people in."
  }
];

export const TransparencySection = () => {
  const navigate = useNavigate();

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 bg-muted/30">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <Badge className="mb-4 bg-primary/10 text-primary border-primary/20">
            <Gift className="h-3 w-3 mr-1" />
            No Hidden Catches
          </Badge>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            What's Free vs. What's Premium
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            We believe in complete transparency. Here's exactly what you get at each level.
          </p>
        </div>

        {/* Comparison Cards */}
        <div className="grid md:grid-cols-2 gap-6 mb-12">
          {/* Free Tier */}
          <Card className="border-2 border-border">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <div>
                  <Badge variant="outline" className="mb-2">
                    <Gift className="h-3 w-3 mr-1" />
                    Free Forever
                  </Badge>
                  <CardTitle className="text-2xl">Free Tier</CardTitle>
                </div>
                <div className="text-right">
                  <p className="text-3xl font-bold">$0</p>
                  <p className="text-sm text-muted-foreground">No credit card</p>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {FREE_FEATURES.map((feature, idx) => (
                  <li key={idx} className="flex items-start gap-3">
                    <Check className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              <Button 
                variant="outline" 
                className="w-full mt-6"
                onClick={() => navigate("/auth")}
              >
                Start Free
              </Button>
            </CardContent>
          </Card>

          {/* Premium Tier */}
          <Card className="border-2 border-primary/50 bg-gradient-to-br from-primary/5 to-accent/5">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <div>
                  <Badge className="mb-2 gradient-palace text-white border-0">
                    <Lock className="h-3 w-3 mr-1" />
                    Premium
                  </Badge>
                  <CardTitle className="text-2xl">Full Palace Access</CardTitle>
                </div>
                <div className="text-right">
                  <p className="text-3xl font-bold">$15<span className="text-lg font-normal">/mo</span></p>
                  <p className="text-sm text-muted-foreground">Cancel anytime</p>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">Everything in Free, plus:</p>
              <ul className="space-y-3">
                {PAID_FEATURES.map((feature, idx) => (
                  <li key={idx} className="flex items-start gap-3">
                    <Check className="h-5 w-5 text-accent flex-shrink-0 mt-0.5" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              <Button 
                className="w-full mt-6 gradient-palace"
                onClick={() => navigate("/auth")}
              >
                Start Free Trial
                <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* FAQ Section */}
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center gap-2 justify-center mb-6">
            <HelpCircle className="h-5 w-5 text-primary" />
            <h3 className="text-xl font-bold">Frequently Asked Questions</h3>
          </div>
          
          <Accordion type="single" collapsible className="w-full">
            {FAQ_ITEMS.map((item, idx) => (
              <AccordionItem key={idx} value={`item-${idx}`}>
                <AccordionTrigger className="text-left">
                  {item.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  {item.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
};
