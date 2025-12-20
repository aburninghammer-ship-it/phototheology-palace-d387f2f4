import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ArrowRight, BookOpen, PenLine, Layers, Bookmark } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Textarea } from '@/components/ui/textarea';
import { supabase } from '@/integrations/supabase/client';
import type { Spark } from '@/hooks/useSparks';

interface SparkExploreFlowProps {
  spark: Spark;
  isOpen: boolean;
  onClose: () => void;
}

type ExploreMode = 'trace' | 'apply' | 'build' | 'save';

export function SparkExploreFlow({ spark, isOpen, onClose }: SparkExploreFlowProps) {
  const [mode, setMode] = useState<ExploreMode | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [userReflection, setUserReflection] = useState('');

  const exploreOptions = [
    {
      mode: 'trace' as ExploreMode,
      icon: BookOpen,
      label: 'Trace',
      description: 'Follow related verses through Scripture'
    },
    {
      mode: 'apply' as ExploreMode,
      icon: PenLine,
      label: 'Apply',
      description: 'Generate a personal application prompt'
    },
    {
      mode: 'build' as ExploreMode,
      icon: Layers,
      label: 'Build',
      description: 'Create a structured mini-study'
    },
    {
      mode: 'save' as ExploreMode,
      icon: Bookmark,
      label: 'Save',
      description: 'Save as a Spark Note'
    }
  ];

  const handleExplore = async (selectedMode: ExploreMode) => {
    setMode(selectedMode);
    
    if (selectedMode === 'save') {
      // Just save and close
      onClose();
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('generate-spark', {
        body: {
          mode: 'explore',
          exploreMode: selectedMode,
          spark: {
            title: spark.title,
            insight: spark.insight,
            spark_type: spark.spark_type,
            targets: spark.explore_action?.targets || []
          }
        }
      });

      if (error) throw error;
      setResult(data?.result || 'No result generated.');
    } catch (err) {
      console.error('Explore error:', err);
      setResult('Unable to generate exploration. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    setMode(null);
    setResult(null);
    setUserReflection('');
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          onClick={e => e.stopPropagation()}
        >
          <Card className="w-full max-w-lg max-h-[80vh] overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-lg">
                {mode ? `Explore: ${mode.charAt(0).toUpperCase() + mode.slice(1)}` : 'Explore This Spark'}
              </CardTitle>
              <Button variant="ghost" size="icon" onClick={onClose}>
                <X size={18} />
              </Button>
            </CardHeader>
            
            <CardContent className="pb-6">
              <ScrollArea className="max-h-[60vh]">
                {!mode ? (
                  /* Mode Selection */
                  <div className="space-y-4">
                    <div className="p-3 bg-muted/50 rounded-lg">
                      <p className="font-medium text-sm">{spark.title}</p>
                      <p className="text-xs text-muted-foreground mt-1">{spark.recognition}</p>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-3">
                      {exploreOptions.map(option => (
                        <button
                          key={option.mode}
                          onClick={() => handleExplore(option.mode)}
                          className="p-4 border rounded-lg text-left hover:bg-muted/50 transition-colors group"
                        >
                          <option.icon size={20} className="mb-2 text-primary" />
                          <p className="font-medium text-sm">{option.label}</p>
                          <p className="text-xs text-muted-foreground mt-1">{option.description}</p>
                          <ArrowRight size={14} className="mt-2 opacity-0 group-hover:opacity-100 transition-opacity text-primary" />
                        </button>
                      ))}
                    </div>
                  </div>
                ) : loading ? (
                  /* Loading State */
                  <div className="flex flex-col items-center justify-center py-12 space-y-4">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
                    <p className="text-sm text-muted-foreground">
                      Jeeves is preparing your exploration...
                    </p>
                  </div>
                ) : (
                  /* Result View */
                  <div className="space-y-4">
                    <Button variant="ghost" size="sm" onClick={handleBack}>
                      ← Back to options
                    </Button>
                    
                    <div className="p-4 bg-muted/30 rounded-lg whitespace-pre-wrap text-sm">
                      {result}
                    </div>
                    
                    {mode === 'apply' && (
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Your Reflection</label>
                        <Textarea
                          value={userReflection}
                          onChange={e => setUserReflection(e.target.value)}
                          placeholder="Write your thoughts here..."
                          rows={4}
                        />
                        <Button size="sm" className="w-full" disabled={!userReflection}>
                          Save Reflection
                        </Button>
                      </div>
                    )}
                  </div>
                )}
              </ScrollArea>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
