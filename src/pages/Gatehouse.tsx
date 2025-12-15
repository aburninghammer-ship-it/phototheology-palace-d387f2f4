import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { BookOpen, Castle, ChevronRight, AlertTriangle, Heart, Brain, Sword, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useAuth } from '@/hooks/useAuth';
import { useGatehouseStatus } from '@/hooks/useGatehouseStatus';
import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/Footer';

const Gatehouse = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { hasEnteredPalace } = useGatehouseStatus();
  const [selectedPath, setSelectedPath] = useState<'surface' | 'palace' | null>(null);
  const [showGracefulExit, setShowGracefulExit] = useState(false);

  const handleSurfaceChoice = () => {
    setShowGracefulExit(true);
  };

  const handlePalaceChoice = () => {
    if (user) {
      navigate('/antechamber');
    } else {
      navigate('/auth?redirect=/antechamber');
    }
  };

  // Graceful Exit View
  if (showGracefulExit) {
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
                onClick={() => setShowGracefulExit(false)}
                className="px-6"
              >
                <ArrowLeft className="mr-2 h-5 w-5" />
                Reconsider
              </Button>
              <Button
                size="lg"
                onClick={handlePalaceChoice}
                className="px-6 bg-amber-600 hover:bg-amber-700"
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

        {/* The Two Paths */}
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          {/* Surface Study Path */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card 
              className={`p-8 h-full cursor-pointer transition-all border-2 ${
                selectedPath === 'surface' 
                  ? 'border-primary bg-primary/5' 
                  : 'border-border hover:border-muted-foreground/50'
              }`}
              onClick={() => setSelectedPath('surface')}
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 rounded-full bg-muted">
                  <BookOpen className="h-6 w-6 text-muted-foreground" />
                </div>
                <h2 className="text-2xl font-serif font-semibold">Surface Study</h2>
              </div>

              <ul className="space-y-3 text-muted-foreground mb-6">
                <li className="flex items-start gap-2">
                  <Heart className="h-5 w-5 mt-0.5 text-rose-400" />
                  <span>Read devotionals</span>
                </li>
                <li className="flex items-start gap-2">
                  <Heart className="h-5 w-5 mt-0.5 text-rose-400" />
                  <span>Follow familiar interpretations</span>
                </li>
                <li className="flex items-start gap-2">
                  <Heart className="h-5 w-5 mt-0.5 text-rose-400" />
                  <span>Stay in comfort</span>
                </li>
                <li className="flex items-start gap-2">
                  <Heart className="h-5 w-5 mt-0.5 text-rose-400" />
                  <span>Consume Scripture</span>
                </li>
              </ul>

              <blockquote className="border-l-2 border-muted-foreground/30 pl-4 italic text-muted-foreground text-sm">
                "Ever learning, and never able to come to the knowledge of the truth"
                <footer className="mt-1 text-xs">— 2 Timothy 3:7</footer>
              </blockquote>

              <p className="mt-6 text-sm text-muted-foreground">
                This is not condemnation—just reality.
              </p>
            </Card>
          </motion.div>

          {/* Palace Path */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card 
              className={`p-8 h-full cursor-pointer transition-all border-2 ${
                selectedPath === 'palace' 
                  ? 'border-amber-500 bg-amber-500/5' 
                  : 'border-border hover:border-amber-500/50'
              }`}
              onClick={() => setSelectedPath('palace')}
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 rounded-full bg-amber-500/20">
                  <Castle className="h-6 w-6 text-amber-500" />
                </div>
                <h2 className="text-2xl font-serif font-semibold">Enter the Palace</h2>
              </div>

              <ul className="space-y-3 text-foreground mb-6">
                <li className="flex items-start gap-2">
                  <Brain className="h-5 w-5 mt-0.5 text-amber-500" />
                  <span>Build Scripture systematically</span>
                </li>
                <li className="flex items-start gap-2">
                  <Brain className="h-5 w-5 mt-0.5 text-amber-500" />
                  <span>See patterns across Genesis → Revelation</span>
                </li>
                <li className="flex items-start gap-2">
                  <Sword className="h-5 w-5 mt-0.5 text-amber-500" />
                  <span>Train discernment</span>
                </li>
                <li className="flex items-start gap-2">
                  <Sword className="h-5 w-5 mt-0.5 text-amber-500" />
                  <span>Become a workman, not just a reader</span>
                </li>
              </ul>

              <blockquote className="border-l-2 border-amber-500/50 pl-4 italic text-foreground text-sm">
                "Study to shew thyself approved unto God, a workman that needeth not to be ashamed"
                <footer className="mt-1 text-xs text-muted-foreground">— 2 Timothy 2:15</footer>
              </blockquote>
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
          <Card className="p-6 border-amber-500/30 bg-amber-500/5">
            <div className="flex items-start gap-4">
              <AlertTriangle className="h-6 w-6 text-amber-500 flex-shrink-0 mt-1" />
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
            className="px-8"
          >
            <BookOpen className="mr-2 h-5 w-5" />
            Continue with Surface Study
          </Button>
          <Button
            size="lg"
            onClick={handlePalaceChoice}
            className="px-8 bg-amber-600 hover:bg-amber-700"
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
