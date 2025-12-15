import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Castle, CheckCircle, ChevronRight, Shield, BookOpen, Eye, Brain } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { useAuth } from '@/hooks/useAuth';
import { useGatehouseStatus } from '@/hooks/useGatehouseStatus';
import { Navigation } from '@/components/Navigation';

const Antechamber = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { markPalaceEntered } = useGatehouseStatus();
  const [covenantAccepted, setCovenantAccepted] = useState(false);
  const [isEntering, setIsEntering] = useState(false);

  const handleEnterPalace = async () => {
    if (!user) {
      navigate('/auth?redirect=/antechamber');
      return;
    }

    if (!covenantAccepted) return;

    setIsEntering(true);
    const success = await markPalaceEntered();
    
    if (success) {
      // Navigate to first room experience
      navigate('/palace/first-room');
    } else {
      setIsEntering(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <main className="container mx-auto px-4 py-12 max-w-2xl text-center">
          <Castle className="h-16 w-16 mx-auto text-amber-500 mb-6" />
          <h1 className="text-3xl font-serif font-bold mb-4">Create Your Key</h1>
          <p className="text-muted-foreground mb-8">
            To enter the Palace, you must first secure your entry.
          </p>
          <Button 
            size="lg" 
            onClick={() => navigate('/auth?redirect=/antechamber')}
            className="bg-amber-600 hover:bg-amber-700"
          >
            Secure Your Entry
          </Button>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="container mx-auto px-4 py-12 max-w-3xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-10"
        >
          <div className="inline-flex p-4 rounded-full bg-amber-500/20 mb-6">
            <Castle className="h-10 w-10 text-amber-500" />
          </div>
          <h1 className="text-3xl md:text-4xl font-serif font-bold text-foreground mb-3">
            The Antechamber
          </h1>
          <p className="text-lg text-muted-foreground">
            Before you enter, understand what lies ahead.
          </p>
        </motion.div>

        {/* What the Palace Is */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <Eye className="h-5 w-5 text-primary" />
              What the Palace Is
            </h2>
            <ul className="space-y-3">
              {[
                'A structured environment for deep Bible study',
                'Eight floors of progressive training',
                'Memory architecture that stores Scripture as images',
                'Pattern recognition across all 66 books',
                'Christ-centered interpretation at every level',
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-3 text-sm">
                  <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </Card>
        </motion.div>

        {/* What the Palace Requires */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-8"
        >
          <Card className="p-6 border-amber-500/30">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <Brain className="h-5 w-5 text-amber-500" />
              What the Palace Requires
            </h2>
            <ul className="space-y-3">
              {[
                'Active thinking, not passive reading',
                'Patience with progressive learning',
                'Discipline to practice daily',
                'Humility to unlearn and relearn',
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-3 text-sm">
                  <ChevronRight className="h-5 w-5 text-amber-500 flex-shrink-0 mt-0.5" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </Card>
        </motion.div>

        {/* What the Palace Is Not */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-8"
        >
          <Card className="p-6 bg-muted/50">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <Shield className="h-5 w-5 text-muted-foreground" />
              What the Palace Is Not
            </h2>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>• A shortcut to biblical knowledge</li>
              <li>• Entertainment or gamification for its own sake</li>
              <li>• A replacement for prayer and the Spirit</li>
              <li>• Elite knowledge for the select few</li>
            </ul>
            <p className="mt-4 text-sm italic">
              "Unto whomsoever much is given, of him shall be much required" — Luke 12:48
            </p>
          </Card>
        </motion.div>

        {/* The Covenant */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mb-8"
        >
          <Card className="p-6 border-2 border-primary/30 bg-primary/5">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-primary" />
              The Covenant
            </h2>
            <div className="prose prose-sm dark:prose-invert mb-6">
              <p className="text-foreground">
                This is not passive study.<br />
                This is training.<br />
                I am willing to think, test, and grow.
              </p>
            </div>
            
            <div className="flex items-start gap-3 p-4 rounded-lg bg-background border">
              <Checkbox
                id="covenant"
                checked={covenantAccepted}
                onCheckedChange={(checked) => setCovenantAccepted(checked as boolean)}
                className="mt-0.5"
              />
              <label 
                htmlFor="covenant" 
                className="text-sm cursor-pointer leading-relaxed"
              >
                I understand and choose to continue. I commit to approaching the Palace 
                as a workman seeking approval, not a spectator seeking entertainment.
              </label>
            </div>
          </Card>
        </motion.div>

        {/* Enter Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="text-center"
        >
          <Button
            size="lg"
            onClick={handleEnterPalace}
            disabled={!covenantAccepted || isEntering}
            className="px-12 py-6 text-lg bg-amber-600 hover:bg-amber-700 disabled:opacity-50"
          >
            {isEntering ? (
              'Opening the gates...'
            ) : (
              <>
                <Castle className="mr-2 h-5 w-5" />
                Enter the Palace
              </>
            )}
          </Button>
          
          <p className="mt-4 text-xs text-muted-foreground">
            "I am the door: by me if any man enter in, he shall be saved" — John 10:9
          </p>
        </motion.div>
      </main>
    </div>
  );
};

export default Antechamber;
