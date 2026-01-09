import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { SparkIcon } from './SparkIcon';
import { SparkCard } from './SparkCard';
import { SparkExploreFlow } from './SparkExploreFlow';
import { cn } from '@/lib/utils';
import type { Spark } from '@/hooks/useSparks';
interface SparkContainerProps {
  sparks: Spark[];
  onOpen: (sparkId: string) => void;
  onSave: (sparkId: string) => void;
  onDismiss: (sparkId: string) => void;
  onExplore: (sparkId: string) => Promise<Spark | undefined>;
  position?: 'margin' | 'inline' | 'floating';
  className?: string;
  maxDisplay?: number; // 0 or undefined = show all sparks
}

export function SparkContainer({
  sparks,
  onOpen,
  onSave,
  onDismiss,
  onExplore,
  position = 'floating',
  className,
  maxDisplay
}: SparkContainerProps) {
  const [openSparkId, setOpenSparkId] = useState<string | null>(null);
  const [exploringSparkId, setExploringSparkId] = useState<string | null>(null);
  const [exploreSpark, setExploreSpark] = useState<Spark | null>(null);

  const handleIconClick = (sparkId: string) => {
    onOpen(sparkId);
    setOpenSparkId(sparkId);
  };

  const handleClose = () => {
    setOpenSparkId(null);
  };

  const handleExplore = async (sparkId: string) => {
    const spark = await onExplore(sparkId);
    if (spark) {
      setExploreSpark(spark);
      setExploringSparkId(sparkId);
      setOpenSparkId(null);
    }
  };

  const handleSave = (sparkId: string) => {
    onSave(sparkId);
    setOpenSparkId(null);
  };

  const handleDismiss = (sparkId: string) => {
    onDismiss(sparkId);
    setOpenSparkId(null);
  };

  const openSpark = sparks.find(s => s.id === openSparkId);

  if (sparks.length === 0) return null;

  return (
    <div className={cn("relative", className)}>
      {/* Spark Icons */}
      <div className="flex gap-4 flex-wrap items-center">
        <AnimatePresence>
          {(maxDisplay && maxDisplay > 0 ? sparks.slice(0, maxDisplay) : sparks).map((spark, index) => (
            <motion.div
              key={spark.id}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0 }}
              transition={{ delay: Math.min(index * 0.1, 0.5) }}
            >
              <SparkIcon
                type={spark.spark_type}
                pulse={!spark.opened_at}
                onClick={() => handleIconClick(spark.id)}
                size="md"
              />
            </motion.div>
          ))}
        </AnimatePresence>

        {maxDisplay && maxDisplay > 0 && sparks.length > maxDisplay && (
          <span className="text-xs text-muted-foreground self-center ml-1">
            +{sparks.length - maxDisplay}
          </span>
        )}
      </div>

      {/* Open Spark Card - Mobile optimized positioning */}
      {openSpark && (
        <div className="fixed inset-x-0 bottom-0 z-50 p-4 md:absolute md:inset-auto md:right-0 md:top-full md:mt-2 md:p-0">
          <div className="md:hidden fixed inset-0 bg-background/60 backdrop-blur-sm -z-10" onClick={handleClose} />
          <SparkCard
            spark={openSpark}
            onClose={handleClose}
            onExplore={() => handleExplore(openSpark.id)}
            onSave={() => handleSave(openSpark.id)}
            onDismiss={() => handleDismiss(openSpark.id)}
          />
        </div>
      )}

      {/* Explore Flow */}
      {exploreSpark && (
        <SparkExploreFlow
          spark={exploreSpark}
          isOpen={!!exploringSparkId}
          onClose={() => {
            setExploringSparkId(null);
            setExploreSpark(null);
          }}
        />
      )}
    </div>
  );
}
