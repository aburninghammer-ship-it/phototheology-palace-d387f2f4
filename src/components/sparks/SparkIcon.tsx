import { motion } from 'framer-motion';
import { Flame, Sparkles, Lightbulb } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SparkIconProps {
  type: 'connection' | 'pattern' | 'application';
  size?: 'sm' | 'md' | 'lg';
  pulse?: boolean;
  onClick?: () => void;
  className?: string;
}

const sparkConfig = {
  connection: {
    icon: Flame,
    color: 'text-orange-400',
    bgColor: 'bg-orange-500/15',
    hoverBg: 'hover:bg-orange-500/25',
    glowColor: 'shadow-orange-500/40',
    label: 'Connection Spark'
  },
  pattern: {
    icon: Sparkles,
    color: 'text-purple-400',
    bgColor: 'bg-purple-500/15',
    hoverBg: 'hover:bg-purple-500/25',
    glowColor: 'shadow-purple-500/40',
    label: 'Pattern Spark'
  },
  application: {
    icon: Lightbulb,
    color: 'text-yellow-400',
    bgColor: 'bg-yellow-500/15',
    hoverBg: 'hover:bg-yellow-500/25',
    glowColor: 'shadow-yellow-500/40',
    label: 'Application Spark'
  }
};

const sizeConfig = {
  sm: { icon: 14, wrapper: 'h-6 w-6' },
  md: { icon: 18, wrapper: 'h-8 w-8' },
  lg: { icon: 22, wrapper: 'h-10 w-10' }
};

export function SparkIcon({ 
  type, 
  size = 'sm', 
  pulse = true, 
  onClick, 
  className 
}: SparkIconProps) {
  const config = sparkConfig[type];
  const sizeProps = sizeConfig[size];
  const Icon = config.icon;

  return (
    <motion.button
      initial={{ scale: 1 }}
      animate={pulse ? { 
        scale: [1, 1.15, 1, 1.1, 1],
        rotate: [0, 5, -5, 3, 0],
      } : { scale: 1 }}
      transition={pulse ? { 
        duration: 2.5,
        repeat: Infinity,
        repeatDelay: 1,
        ease: "easeInOut"
      } : undefined}
      whileHover={{ scale: 1.2 }}
      whileTap={{ scale: 0.9 }}
      onClick={onClick}
      className={cn(
        'relative rounded-full flex items-center justify-center cursor-pointer transition-all duration-300',
        'backdrop-blur-sm border border-white/20',
        'shadow-lg',
        sizeProps.wrapper,
        config.bgColor,
        config.hoverBg,
        config.glowColor,
        className
      )}
      title={config.label}
    >
      {/* Sparkle particles */}
      {pulse && (
        <>
          <motion.span
            className="absolute w-1 h-1 rounded-full bg-white/80"
            animate={{
              x: [0, 8, -6, 0],
              y: [0, -8, 4, 0],
              opacity: [0, 1, 0.5, 0],
              scale: [0, 1, 0.5, 0],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              repeatDelay: 0.5,
            }}
          />
          <motion.span
            className="absolute w-0.5 h-0.5 rounded-full bg-white/60"
            animate={{
              x: [0, -6, 8, 0],
              y: [0, 6, -4, 0],
              opacity: [0, 0.8, 0.3, 0],
              scale: [0, 1.2, 0.3, 0],
            }}
            transition={{
              duration: 1.8,
              repeat: Infinity,
              repeatDelay: 0.8,
              delay: 0.3,
            }}
          />
          <motion.span
            className="absolute w-0.5 h-0.5 rounded-full bg-white/70"
            animate={{
              x: [0, 5, -3, 0],
              y: [0, -5, 7, 0],
              opacity: [0, 1, 0.4, 0],
              scale: [0, 0.8, 0.2, 0],
            }}
            transition={{
              duration: 2.2,
              repeat: Infinity,
              repeatDelay: 0.6,
              delay: 0.6,
            }}
          />
        </>
      )}
      
      {/* Glow ring */}
      <motion.span
        className={cn(
          "absolute inset-0 rounded-full",
          config.bgColor
        )}
        animate={pulse ? {
          opacity: [0.3, 0.6, 0.3],
          scale: [1, 1.3, 1],
        } : { opacity: 0.3 }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      
      <Icon size={sizeProps.icon} className={cn(config.color, "relative z-10 drop-shadow-sm")} />
    </motion.button>
  );
}
