import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { SparkIcon } from './SparkIcon';
import { SparkCard } from './SparkCard';
import { SparkExploreFlow } from './SparkExploreFlow';
import type { Spark } from '@/hooks/useSparks';

interface SparkContainerProps {
  sparks: Spark[];
  onOpen: (sparkId: string) => void;
  onSave: (sparkId: string) => void;
  onDismiss: (sparkId: string) => void;
  onExplore: (sparkId: string) => Promise<Spark | undefined>;
  position?: 'margin' | 'inline' | 'floating';
  className?: string;
}

export function SparkContainer({
  sparks,
  onOpen,
  onSave,
  onDismiss,
  onExplore,
  position = 'floating',
  className
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
    <div className={className}>
      {/* Spark Icons */}
      <div className="flex gap-1">
        <AnimatePresence>
          {sparks.slice(0, 3).map((spark, index) => (
            <motion.div
              key={spark.id}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <SparkIcon
                type={spark.spark_type}
                pulse={!spark.opened_at}
                onClick={() => handleIconClick(spark.id)}
              />
            </motion.div>
          ))}
        </AnimatePresence>
        
        {sparks.length > 3 && (
          <span className="text-xs text-muted-foreground self-center ml-1">
            +{sparks.length - 3}
          </span>
        )}
      </div>

      {/* Open Spark Card */}
      {openSpark && (
        <div className="absolute right-0 top-full mt-2 z-50">
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
