import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { BookOpen, Castle, ChevronRight, AlertTriangle, Heart, Brain, Sword, ArrowLeft, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useAuth } from '@/hooks/useAuth';
import { useGatehouseStatus } from '@/hooks/useGatehouseStatus';
import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/Footer';

type ViewState = 'choice' | 'appeal' | 'exit';

const Gatehouse = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { hasEnteredPalace } = useGatehouseStatus();
  const [selectedPath, setSelectedPath] = useState<'surface' | 'palace' | null>(null);
  const [viewState, setViewState] = useState<ViewState>('choice');

  const handleSurfaceChoice = () => {
    setViewState('appeal');
  };

  const handleFinalRefuse = () => {
    setViewState('exit');
  };

  const handlePalaceChoice = () => {
    if (user) {
      navigate('/antechamber');
    } else {
      navigate('/auth?redirect=/antechamber');
    }
  };

  // Appeal View - Why Surface Study Falls Short
  if (viewState === 'appeal') {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        
        <main className="container mx-auto px-4 py-12 max-w-3xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="text-center mb-8">
              <h1 className="text-3xl md:text-4xl font-serif font-bold text-foreground mb-4">
                Before You Go...
              </h1>
              <p className="text-lg text-muted-foreground">
                Consider what surface study actually costs.
              </p>
            </div>

            <Card className="p-8 mb-8">
              <h2 className="text-xl font-semibold mb-6 text-center">Why Surface Study Falls Short</h2>
              
              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-destructive/10 flex items-center justify-center">
                    <X className="h-4 w-4 text-destructive" />
                  </div>
                  <div>
                    <h3 className="font-medium mb-1">You miss the architecture</h3>
                    <p className="text-sm text-muted-foreground">
                      Scripture is not random stories—it is a unified structure. Surface reading sees trees but never the forest.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-destructive/10 flex items-center justify-center">
                    <X className="h-4 w-4 text-destructive" />
                  </div>
                  <div>
                    <h3 className="font-medium mb-1">You stay dependent</h3>
                    <p className="text-sm text-muted-foreground">
                      Without tools for interpretation, you remain reliant on others to explain what God's Word means.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-destructive/10 flex items-center justify-center">
                    <X className="h-4 w-4 text-destructive" />
                  </div>
                  <div>
                    <h3 className="font-medium mb-1">You cannot teach</h3>
                    <p className="text-sm text-muted-foreground">
                      "For when for the time ye ought to be teachers, ye have need that one teach you again" (Hebrews 5:12).
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-destructive/10 flex items-center justify-center">
                    <X className="h-4 w-4 text-destructive" />
                  </div>
                  <div>
                    <h3 className="font-medium mb-1">You miss Christ</h3>
                    <p className="text-sm text-muted-foreground">
                      Every chapter points to Him—but surface reading often sees only moral lessons, missing the Lamb in every shadow.
                    </p>
                  </div>
                </div>
              </div>
            </Card>

            <Card className="p-8 mb-8 border-amber-500/30 bg-amber-500/5">
              <h2 className="text-xl font-semibold mb-4 text-center">One More Invitation</h2>
              <p className="text-muted-foreground mb-4 text-center">
                What if you could learn to see what you have been missing?
              </p>
              <p className="text-sm text-muted-foreground text-center mb-6">
                The Palace is not about being smarter. It is about being trained. 
                About learning to ask the right questions. About building Scripture into your mind 
                so deeply that you can recall, connect, and teach.
              </p>
              <blockquote className="border-l-2 border-amber-500/50 pl-4 italic text-muted-foreground text-center">
                "Study to shew thyself approved unto God, a workman that needeth not to be ashamed, 
                rightly dividing the word of truth."
                <footer className="mt-2 text-xs not-italic">— 2 Timothy 2:15</footer>
              </blockquote>
            </Card>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                variant="outline"
                size="lg"
                onClick={handleFinalRefuse}
                className="px-6"
              >
                I understand, but this is not for me
              </Button>
              <Button
                size="lg"
                onClick={handlePalaceChoice}
                className="px-6 bg-red-600 hover:bg-red-700 shadow-[0_0_15px_rgba(239,68,68,0.3)]"
              >
                <Castle className="mr-2 h-5 w-5" />
                I want to learn deeper study
              </Button>
            </div>

            <p className="text-center text-sm text-muted-foreground mt-6">
              <button 
                onClick={() => setViewState('choice')}
                className="hover:underline"
              >
                ← Return to choices
              </button>
            </p>
          </motion.div>
        </main>

        <Footer />
      </div>
    );
  }

  // Graceful Exit View
  if (viewState === 'exit') {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        
        <main className="container mx-auto px-4 py-12 max-w-2xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <div className="mb-8">
              <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-muted flex items-center justify-center">
                <BookOpen className="h-10 w-10 text-muted-foreground" />
              </div>
              <h1 className="text-3xl md:text-4xl font-serif font-bold text-foreground mb-4">
                Thank You for Considering Phototheology
              </h1>
            </div>

            <Card className="p-8 mb-8 text-left">
              <p className="text-lg text-muted-foreground mb-6">
                The Bible can be studied at many levels. There is no shame in reading devotionally—
                millions do, and God meets people where they are.
              </p>
              
              <p className="text-muted-foreground mb-6">
                But Phototheology was built for something different: <span className="text-foreground font-medium">training</span>, 
                not just reading. Pattern-building, not just reflection. Architecture, not just inspiration.
              </p>

              <blockquote className="border-l-2 border-primary/50 pl-4 italic text-muted-foreground mb-6">
                "For every one that useth milk is unskilful in the word of righteousness: for he is a babe. 
                But strong meat belongeth to them that are of full age."
                <footer className="mt-2 text-xs not-italic">— Hebrews 5:13-14</footer>
              </blockquote>

              <p className="text-muted-foreground">
                If you ever feel the pull to go deeper—to truly <em>study</em> rather than just read—
                the Gate remains open.
              </p>
            </Card>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                variant="outline"
                size="lg"
                onClick={() => setViewState('appeal')}
                className="px-6"
              >
                <ArrowLeft className="mr-2 h-5 w-5" />
                Wait, let me reconsider
              </Button>
              <Button
                size="lg"
                onClick={handlePalaceChoice}
                className="px-6 bg-red-600 hover:bg-red-700 shadow-[0_0_15px_rgba(239,68,68,0.3)]"
              >
                <Castle className="mr-2 h-5 w-5" />
                Enter the Palace Instead
              </Button>
            </div>

            <p className="text-sm text-muted-foreground mt-8">
              May the Lord bless your journey, wherever it leads.
            </p>
          </motion.div>
        </main>

        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="container mx-auto px-4 py-12 max-w-5xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-foreground mb-4">
            Two Ways to Study the Bible
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Most people never see the difference.
          </p>
        </motion.div>

        {/* The Two Paths - Matrix-inspired */}
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          {/* Surface Study Path - Blue Pill */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card 
              className={`relative p-8 h-full cursor-pointer transition-all duration-300 overflow-hidden ${
                selectedPath === 'surface' 
                  ? 'border-2 border-blue-400 shadow-[0_0_30px_rgba(59,130,246,0.3)]' 
                  : 'border border-blue-500/20 hover:border-blue-400/50 hover:shadow-[0_0_20px_rgba(59,130,246,0.15)]'
              }`}
              style={{
                background: 'linear-gradient(135deg, hsl(var(--card)) 0%, hsl(217 91% 20% / 0.3) 100%)',
              }}
              onClick={() => setSelectedPath('surface')}
            >
              {/* Glass reflection effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-transparent to-blue-900/20 pointer-events-none" />
              <div className="absolute top-0 left-0 right-0 h-1/3 bg-gradient-to-b from-blue-400/5 to-transparent pointer-events-none" />
              
              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-3 rounded-full bg-blue-500/20 border border-blue-400/30">
                    <BookOpen className="h-6 w-6 text-blue-400" />
                  </div>
                  <h2 className="text-2xl font-serif font-semibold">Surface Study</h2>
                </div>

                <ul className="space-y-3 text-muted-foreground mb-6">
                  <li className="flex items-start gap-2">
                    <Heart className="h-5 w-5 mt-0.5 text-blue-400/70" />
                    <span>Read devotionals</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Heart className="h-5 w-5 mt-0.5 text-blue-400/70" />
                    <span>Follow familiar interpretations</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Heart className="h-5 w-5 mt-0.5 text-blue-400/70" />
                    <span>Stay in comfort</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Heart className="h-5 w-5 mt-0.5 text-blue-400/70" />
                    <span>Consume Scripture</span>
                  </li>
                </ul>

                <blockquote className="border-l-2 border-blue-400/30 pl-4 italic text-muted-foreground text-sm">
                  "Ever learning, and never able to come to the knowledge of the truth"
                  <footer className="mt-1 text-xs">— 2 Timothy 3:7</footer>
                </blockquote>

                <p className="mt-6 text-sm text-blue-300/60">
                  This is not condemnation—just reality.
                </p>
              </div>
            </Card>
          </motion.div>

          {/* Palace Path - Red Pill */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card 
              className={`relative p-8 h-full cursor-pointer transition-all duration-300 overflow-hidden ${
                selectedPath === 'palace' 
                  ? 'border-2 border-red-500 shadow-[0_0_30px_rgba(239,68,68,0.3)]' 
                  : 'border border-red-500/20 hover:border-red-500/50 hover:shadow-[0_0_20px_rgba(239,68,68,0.15)]'
              }`}
              style={{
                background: 'linear-gradient(135deg, hsl(var(--card)) 0%, hsl(0 70% 20% / 0.3) 100%)',
              }}
              onClick={() => setSelectedPath('palace')}
            >
              {/* Glass reflection effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-red-500/10 via-transparent to-red-900/20 pointer-events-none" />
              <div className="absolute top-0 left-0 right-0 h-1/3 bg-gradient-to-b from-red-400/5 to-transparent pointer-events-none" />
              
              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-3 rounded-full bg-red-500/20 border border-red-400/30">
                    <Castle className="h-6 w-6 text-red-400" />
                  </div>
                  <h2 className="text-2xl font-serif font-semibold">Enter the Palace</h2>
                </div>

                <ul className="space-y-3 text-foreground mb-6">
                  <li className="flex items-start gap-2">
                    <Brain className="h-5 w-5 mt-0.5 text-red-400" />
                    <span>Build Scripture systematically</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Brain className="h-5 w-5 mt-0.5 text-red-400" />
                    <span>See patterns across Genesis → Revelation</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Sword className="h-5 w-5 mt-0.5 text-red-400" />
                    <span>Train discernment</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Sword className="h-5 w-5 mt-0.5 text-red-400" />
                    <span>Become a workman, not just a reader</span>
                  </li>
                </ul>

                <blockquote className="border-l-2 border-red-400/50 pl-4 italic text-foreground text-sm">
                  "Study to shew thyself approved unto God, a workman that needeth not to be ashamed"
                  <footer className="mt-1 text-xs text-muted-foreground">— 2 Timothy 2:15</footer>
                </blockquote>
              </div>
            </Card>
          </motion.div>
        </div>

        {/* Warning Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mb-12"
        >
          <Card className="p-6 border-red-500/30 bg-red-500/5">
            <div className="flex items-start gap-4">
              <AlertTriangle className="h-6 w-6 text-red-400 flex-shrink-0 mt-1" />
              <div>
                <h3 className="text-lg font-semibold mb-2">Before You Enter</h3>
                <p className="text-muted-foreground mb-4">
                  This is not a shortcut. Not entertainment. Not passive devotion.
                </p>
                <p className="text-sm text-muted-foreground">
                  <strong className="text-foreground">The Palace requires:</strong> Thinking. Patience. Discipline. Humility.
                </p>
                <p className="text-xs text-muted-foreground mt-2 italic">
                  Jesus warned first, then invited (Luke 14:28).
                </p>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* What the Palace Is */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mb-12"
        >
          <h3 className="text-2xl font-serif font-semibold mb-6 text-center">
            What "The Palace" Actually Is
          </h3>
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
            {[
              'A structured Bible study environment',
              'Pattern recognition across Scripture',
              'Memory architecture',
              'Doctrinal testing',
              'Christ-centered depth',
              'Tools designed for builders, not spectators',
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-2 text-sm">
                <ChevronRight className="h-4 w-4 text-primary" />
                <span>{item}</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <Button
            variant="outline"
            size="lg"
            onClick={handleSurfaceChoice}
            className="px-8 border-blue-500/50 text-blue-400 hover:bg-blue-500/10 hover:border-blue-400"
          >
            <BookOpen className="mr-2 h-5 w-5" />
            Continue with Surface Study
          </Button>
          <Button
            size="lg"
            onClick={handlePalaceChoice}
            className="px-8 bg-red-600 hover:bg-red-700 shadow-[0_0_15px_rgba(239,68,68,0.3)] hover:shadow-[0_0_25px_rgba(239,68,68,0.4)]"
          >
            <Castle className="mr-2 h-5 w-5" />
            Enter the Palace
          </Button>
        </motion.div>

        {/* Already entered notice */}
        {hasEnteredPalace && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center text-sm text-muted-foreground mt-6"
          >
            You have already entered the Palace.{' '}
            <button 
              onClick={() => navigate('/palace')}
              className="text-primary hover:underline"
            >
              Return to your training
            </button>
          </motion.p>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default Gatehouse;
