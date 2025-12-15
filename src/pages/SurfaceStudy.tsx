import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { BookOpen, RefreshCw, Heart, Castle, Volume2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/Footer';

// Simple daily verses for surface study
const SURFACE_VERSES = [
  {
    reference: "Psalm 23:1",
    text: "The LORD is my shepherd; I shall not want.",
    reflection: "In the quiet moments of life, the Lord provides. Rest in His care today.",
    question: "Where have you seen God's provision recently?",
  },
  {
    reference: "Proverbs 3:5-6",
    text: "Trust in the LORD with all thine heart; and lean not unto thine own understanding. In all thy ways acknowledge him, and he shall direct thy paths.",
    reflection: "Wisdom begins with surrender. When we release our grip on control, God takes the wheel.",
    question: "What area of your life needs to be surrendered?",
  },
  {
    reference: "John 14:27",
    text: "Peace I leave with you, my peace I give unto you: not as the world giveth, give I unto you. Let not your heart be troubled, neither let it be afraid.",
    reflection: "The peace Christ offers is different—deeper, steadier. It remains when storms rage.",
    question: "How can you receive this peace today?",
  },
  {
    reference: "Romans 8:28",
    text: "And we know that all things work together for good to them that love God, to them who are the called according to his purpose.",
    reflection: "Even in confusion, God weaves purpose. Trust the thread you cannot see.",
    question: "What difficulty might God be using for good?",
  },
  {
    reference: "Philippians 4:13",
    text: "I can do all things through Christ which strengtheneth me.",
    reflection: "Strength is not self-made. It flows from connection to the Vine.",
    question: "Where do you need Christ's strength today?",
  },
  {
    reference: "Isaiah 40:31",
    text: "But they that wait upon the LORD shall renew their strength; they shall mount up with wings as eagles; they shall run, and not be weary; and they shall walk, and not faint.",
    reflection: "Waiting is not passive—it is active trust. In stillness, strength is built.",
    question: "What are you waiting on God for?",
  },
  {
    reference: "Matthew 11:28",
    text: "Come unto me, all ye that labour and are heavy laden, and I will give you rest.",
    reflection: "The invitation stands open. Heavy burdens were never meant to be carried alone.",
    question: "What burden can you bring to Jesus today?",
  },
];

const SurfaceStudy = () => {
  const navigate = useNavigate();
  const [currentVerse, setCurrentVerse] = useState(SURFACE_VERSES[0]);
  const [showDepthHint, setShowDepthHint] = useState(false);

  useEffect(() => {
    // Get verse based on day of year for consistency
    const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000);
    const verseIndex = dayOfYear % SURFACE_VERSES.length;
    setCurrentVerse(SURFACE_VERSES[verseIndex]);

    // Show depth hint after 30 seconds
    const timer = setTimeout(() => setShowDepthHint(true), 30000);
    return () => clearTimeout(timer);
  }, []);

  const getNewVerse = () => {
    const currentIndex = SURFACE_VERSES.indexOf(currentVerse);
    const nextIndex = (currentIndex + 1) % SURFACE_VERSES.length;
    setCurrentVerse(SURFACE_VERSES[nextIndex]);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="container mx-auto px-4 py-12 max-w-2xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-10"
        >
          <div className="inline-flex p-3 rounded-full bg-rose-100 dark:bg-rose-900/30 mb-4">
            <BookOpen className="h-8 w-8 text-rose-500" />
          </div>
          <h1 className="text-3xl font-serif font-bold text-foreground mb-2">
            Daily Devotional
          </h1>
          <p className="text-muted-foreground">
            A moment with Scripture
          </p>
        </motion.div>

        {/* Main Verse Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <Card className="p-8">
            {/* Reference */}
            <p className="text-sm font-medium text-primary mb-4">
              {currentVerse.reference}
            </p>

            {/* Verse Text */}
            <blockquote className="text-2xl md:text-3xl font-serif leading-relaxed text-foreground mb-6">
              "{currentVerse.text}"
            </blockquote>

            <Separator className="my-6" />

            {/* Reflection */}
            <div className="mb-6">
              <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-2">
                Reflection
              </h3>
              <p className="text-foreground leading-relaxed">
                {currentVerse.reflection}
              </p>
            </div>

            {/* Question */}
            <div className="p-4 rounded-lg bg-muted/50">
              <p className="text-sm italic text-muted-foreground">
                {currentVerse.question}
              </p>
            </div>

            {/* Audio placeholder */}
            <div className="mt-6 flex justify-center">
              <Button variant="ghost" size="sm" disabled className="text-muted-foreground">
                <Volume2 className="h-4 w-4 mr-2" />
                Audio coming soon
              </Button>
            </div>
          </Card>
        </motion.div>

        {/* Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex justify-center gap-4 mb-8"
        >
          <Button variant="outline" onClick={getNewVerse}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Another Verse
          </Button>
          <Button variant="ghost">
            <Heart className="h-4 w-4 mr-2" />
            Save
          </Button>
        </motion.div>

        {/* Depth Hint - appears after delay */}
        {showDepthHint && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <Card className="p-4 border-dashed border-amber-500/50 bg-amber-500/5">
              <p className="text-sm text-center text-muted-foreground">
                <span className="text-amber-600 font-medium">
                  There is more beneath this verse...
                </span>
              </p>
              <div className="flex justify-center mt-3">
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => navigate('/gatehouse')}
                  className="text-amber-600 hover:text-amber-700"
                >
                  <Castle className="h-4 w-4 mr-2" />
                  Explore the Palace
                </Button>
              </div>
            </Card>
          </motion.div>
        )}

        {/* Simple navigation */}
        <div className="text-center">
          <Button 
            variant="link" 
            onClick={() => navigate('/gatehouse')}
            className="text-muted-foreground"
          >
            Go deeper →
          </Button>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default SurfaceStudy;
