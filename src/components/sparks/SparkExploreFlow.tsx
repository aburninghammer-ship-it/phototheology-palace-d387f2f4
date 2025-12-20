import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ArrowRight, BookOpen, PenLine, Layers, Bookmark, Check, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Textarea } from '@/components/ui/textarea';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import type { Spark } from '@/hooks/useSparks';

interface SparkExploreFlowProps {
  spark: Spark;
  isOpen: boolean;
  onClose: () => void;
  onSave?: (spark: Spark) => void;
}

type ExploreMode = 'trace' | 'apply' | 'build' | 'save';

export function SparkExploreFlow({ spark, isOpen, onClose, onSave }: SparkExploreFlowProps) {
  const [mode, setMode] = useState<ExploreMode | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [userReflection, setUserReflection] = useState('');
  const [savingReflection, setSavingReflection] = useState(false);

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
      if (onSave) {
        onSave(spark);
      }
      toast.success('Spark saved to your collection');
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

  const handleSaveReflection = async () => {
    if (!userReflection.trim()) return;
    
    setSavingReflection(true);
    try {
      const user = (await supabase.auth.getUser()).data.user;
      if (!user) throw new Error('Not authenticated');
      
      // Save reflection as a gem linked to this spark
      const { error } = await supabase.from('user_gems').insert({
        user_id: user.id,
        gem_name: `Reflection: ${spark.title}`,
        gem_content: userReflection,
        floor_number: 7, // Fire Room (spiritual/emotional)
        room_id: 'FRm',
        category: 'spark_reflection'
      });

      if (error) throw error;
      
      toast.success('Reflection saved to your Gems');
      setUserReflection('');
      onClose();
    } catch (err) {
      console.error('Save reflection error:', err);
      toast.error('Failed to save reflection');
    } finally {
      setSavingReflection(false);
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
        className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-end md:items-center justify-center"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0, y: 20 }}
          onClick={e => e.stopPropagation()}
          className="w-full md:w-auto"
        >
          <Card className="w-full max-w-lg max-h-[85vh] md:max-h-[80vh] overflow-hidden rounded-t-2xl md:rounded-xl mx-auto">
            <CardHeader className="flex flex-row items-center justify-between pb-2 sticky top-0 bg-card z-10">
              <CardTitle className="text-lg">
                {mode ? `Explore: ${mode.charAt(0).toUpperCase() + mode.slice(1)}` : 'Explore This Spark'}
              </CardTitle>
              <Button variant="ghost" size="icon" onClick={onClose} className="touch-manipulation">
                <X size={18} />
              </Button>
            </CardHeader>
            
            <CardContent className="pb-6 overflow-y-auto">
              <ScrollArea className="max-h-[calc(85vh-120px)] md:max-h-[60vh]">
                {!mode ? (
                  <div className="space-y-4">
                    <div className="p-3 bg-muted/50 rounded-lg">
                      <p className="font-medium text-sm">{spark.title}</p>
                      <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{spark.recognition}</p>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-3">
                      {exploreOptions.map(option => (
                        <button
                          key={option.mode}
                          onClick={() => handleExplore(option.mode)}
                          className="p-4 border rounded-lg text-left hover:bg-muted/50 active:bg-muted transition-colors group touch-manipulation"
                        >
                          <option.icon size={20} className="mb-2 text-primary" />
                          <p className="font-medium text-sm">{option.label}</p>
                          <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{option.description}</p>
                          <ArrowRight size={14} className="mt-2 opacity-0 group-hover:opacity-100 transition-opacity text-primary" />
                        </button>
                      ))}
                    </div>
                  </div>
                ) : loading ? (
                  <div className="flex flex-col items-center justify-center py-12 space-y-4">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    <p className="text-sm text-muted-foreground text-center">
                      Jeeves is preparing your {mode === 'trace' ? 'scripture trace' : mode === 'apply' ? 'application prompt' : 'mini-study'}...
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <Button variant="ghost" size="sm" onClick={handleBack} className="touch-manipulation">
                      ← Back to options
                    </Button>
                    
                    <div className="p-4 bg-muted/30 rounded-lg whitespace-pre-wrap text-sm leading-relaxed">
                      {result}
                    </div>
                    
                    {mode === 'apply' && (
                      <div className="space-y-3 pt-2 border-t">
                        <label className="text-sm font-medium">Your Reflection</label>
                        <Textarea
                          value={userReflection}
                          onChange={e => setUserReflection(e.target.value)}
                          placeholder="Write your thoughts, prayers, or commitments here..."
                          rows={4}
                          className="resize-none"
                        />
                        <Button 
                          size="default" 
                          className="w-full touch-manipulation" 
                          disabled={!userReflection.trim() || savingReflection}
                          onClick={handleSaveReflection}
                        >
                          {savingReflection ? (
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          ) : (
                            <Check className="h-4 w-4 mr-2" />
                          )}
                          Save Reflection as Gem
                        </Button>
                      </div>
                    )}
                    
                    {mode !== 'apply' && (
                      <div className="flex gap-2 pt-2 border-t">
                        <Button 
                          variant="outline" 
                          size="default" 
                          className="flex-1 touch-manipulation"
                          onClick={() => {
                            navigator.clipboard.writeText(result || '');
                            toast.success('Copied to clipboard');
                          }}
                        >
                          Copy
                        </Button>
                        <Button 
                          size="default" 
                          className="flex-1 touch-manipulation"
                          onClick={() => {
                            if (onSave) onSave(spark);
                            toast.success('Spark saved');
                            onClose();
                          }}
                        >
                          <Bookmark className="h-4 w-4 mr-2" />
                          Save Spark
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
