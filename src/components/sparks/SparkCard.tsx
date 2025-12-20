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
          'w-80 shadow-lg border-2',
          config.borderColor,
          `bg-gradient-to-br ${config.gradient}`
        )}>
          <CardHeader className="pb-2 relative">
            <button
              onClick={onClose}
              className="absolute top-2 right-2 p-1 rounded-full hover:bg-foreground/10 transition-colors"
            >
              <X size={16} className="text-muted-foreground" />
            </button>
            
            <div className="flex items-center gap-2">
              <div className={cn(
                'p-2 rounded-full',
                `bg-${spark.spark_type === 'connection' ? 'orange' : spark.spark_type === 'pattern' ? 'purple' : 'yellow'}-500/20`
              )}>
                <Icon size={18} className={config.iconColor} />
              </div>
              <div>
                <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                  {config.label}
                </span>
                <h4 className="font-semibold text-sm leading-tight">
                  {spark.title}
                </h4>
              </div>
            </div>
          </CardHeader>
          
          <CardContent className="pb-3 space-y-2">
            <p className="text-xs text-muted-foreground italic">
              {spark.recognition}
            </p>
            <p className="text-sm leading-relaxed">
              {spark.insight}
            </p>
          </CardContent>
          
          <CardFooter className="pt-0 gap-2">
            <Button
              size="sm"
              variant="default"
              className="flex-1"
              onClick={onExplore}
            >
              <Search size={14} className="mr-1" />
              Explore
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={onSave}
            >
              <Bookmark size={14} />
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={onDismiss}
              className="text-muted-foreground"
            >
              Dismiss
            </Button>
          </CardFooter>
        </Card>
      </motion.div>
    </AnimatePresence>
  );
}
