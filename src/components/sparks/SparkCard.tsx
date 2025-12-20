import { motion, AnimatePresence } from 'framer-motion';
import { X, Bookmark, Search, Flame, Sparkles, Lightbulb } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import type { Spark } from '@/hooks/useSparks';

interface SparkCardProps {
  spark: Spark;
  onClose: () => void;
  onExplore: () => void;
  onSave: () => void;
  onDismiss: () => void;
}

const sparkTypeConfig = {
  connection: {
    icon: Flame,
    gradient: 'from-orange-500/20 to-red-500/10',
    borderColor: 'border-orange-500/30',
    iconColor: 'text-orange-500',
    label: 'Connection Spark'
  },
  pattern: {
    icon: Sparkles,
    gradient: 'from-purple-500/20 to-indigo-500/10',
    borderColor: 'border-purple-500/30',
    iconColor: 'text-purple-500',
    label: 'Pattern Spark'
  },
  application: {
    icon: Lightbulb,
    gradient: 'from-yellow-500/20 to-amber-500/10',
    borderColor: 'border-yellow-500/30',
    iconColor: 'text-yellow-500',
    label: 'Application Spark'
  }
};

export function SparkCard({ 
  spark, 
  onClose, 
  onExplore, 
  onSave, 
  onDismiss 
}: SparkCardProps) {
  const config = sparkTypeConfig[spark.spark_type];
  const Icon = config.icon;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 10, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -10, scale: 0.95 }}
        transition={{ duration: 0.2 }}
      >
        <Card className={cn(
          'w-[calc(100vw-2rem)] max-w-80 shadow-lg border-2',
          config.borderColor,
          `bg-gradient-to-br ${config.gradient}`
        )}>
          <CardHeader className="pb-2 relative">
            <button
              onClick={onClose}
              className="absolute top-2 right-2 p-1.5 rounded-full hover:bg-foreground/10 transition-colors touch-manipulation"
            >
              <X size={18} className="text-muted-foreground" />
            </button>
            
            <div className="flex items-center gap-2 pr-8">
              <div className={cn(
                'p-2 rounded-full shrink-0',
                `bg-${spark.spark_type === 'connection' ? 'orange' : spark.spark_type === 'pattern' ? 'purple' : 'yellow'}-500/20`
              )}>
                <Icon size={18} className={config.iconColor} />
              </div>
              <div className="min-w-0">
                <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                  {config.label}
                </span>
                <h4 className="font-semibold text-sm leading-tight line-clamp-2">
                  {spark.title}
                </h4>
              </div>
            </div>
          </CardHeader>
          
          <CardContent className="pb-3 space-y-2">
            <p className="text-xs text-muted-foreground italic line-clamp-2">
              {spark.recognition}
            </p>
            <p className="text-sm leading-relaxed line-clamp-4">
              {spark.insight}
            </p>
          </CardContent>
          
          <CardFooter className="pt-0 gap-2 flex-wrap">
            <Button
              size="sm"
              variant="default"
              className="flex-1 min-w-[100px] touch-manipulation"
              onClick={onExplore}
            >
              <Search size={14} className="mr-1" />
              Explore
            </Button>
            <Button
              size="sm"
              variant="outline"
              className="touch-manipulation"
              onClick={onSave}
            >
              <Bookmark size={14} />
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={onDismiss}
              className="text-muted-foreground touch-manipulation"
            >
              Dismiss
            </Button>
          </CardFooter>
        </Card>
      </motion.div>
    </AnimatePresence>
  );
}
