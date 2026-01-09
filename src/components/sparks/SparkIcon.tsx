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
    bgColor: 'bg-orange-500/20',
    hoverBg: 'hover:bg-orange-500/30',
    glowColor: 'shadow-[0_0_20px_5px_rgba(249,115,22,0.4)]',
    pulseGlow: 'shadow-[0_0_30px_10px_rgba(249,115,22,0.5)]',
    label: 'Connection Spark'
  },
  pattern: {
    icon: Sparkles,
    color: 'text-purple-400',
    bgColor: 'bg-purple-500/20',
    hoverBg: 'hover:bg-purple-500/30',
    glowColor: 'shadow-[0_0_20px_5px_rgba(168,85,247,0.4)]',
    pulseGlow: 'shadow-[0_0_30px_10px_rgba(168,85,247,0.5)]',
    label: 'Pattern Spark'
  },
  application: {
    icon: Lightbulb,
    color: 'text-yellow-400',
    bgColor: 'bg-yellow-500/20',
    hoverBg: 'hover:bg-yellow-500/30',
    glowColor: 'shadow-[0_0_20px_5px_rgba(234,179,8,0.4)]',
    pulseGlow: 'shadow-[0_0_30px_10px_rgba(234,179,8,0.5)]',
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
      whileHover={{ scale: 1.25 }}
      whileTap={{ scale: 0.9 }}
      onClick={onClick}
      className={cn(
        'relative rounded-full flex items-center justify-center cursor-pointer transition-all duration-300',
        'backdrop-blur-sm border-2 border-white/30',
        sizeProps.wrapper,
        config.bgColor,
        config.hoverBg,
        pulse ? config.pulseGlow : config.glowColor,
        className
      )}
      title={config.label}
    >
      {/* Intense outer glow ring that pulses */}
      {pulse && (
        <motion.span
          className={cn(
            "absolute -inset-1 rounded-full",
            config.bgColor,
            "blur-md"
          )}
          animate={{
            opacity: [0.4, 0.8, 0.4],
            scale: [1, 1.5, 1],
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      )}
      
      {/* Sparkle particles */}
      {pulse && (
        <>
          <motion.span
            className="absolute w-1.5 h-1.5 rounded-full bg-white"
            animate={{
              x: [0, 12, -10, 0],
              y: [0, -12, 6, 0],
              opacity: [0, 1, 0.5, 0],
              scale: [0, 1.2, 0.5, 0],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              repeatDelay: 0.5,
            }}
          />
          <motion.span
            className="absolute w-1 h-1 rounded-full bg-white/80"
            animate={{
              x: [0, -10, 12, 0],
              y: [0, 10, -8, 0],
              opacity: [0, 0.9, 0.3, 0],
              scale: [0, 1.5, 0.3, 0],
            }}
            transition={{
              duration: 1.8,
              repeat: Infinity,
              repeatDelay: 0.8,
              delay: 0.3,
            }}
          />
          <motion.span
            className="absolute w-1 h-1 rounded-full bg-white/90"
            animate={{
              x: [0, 8, -5, 0],
              y: [0, -8, 12, 0],
              opacity: [0, 1, 0.4, 0],
              scale: [0, 1, 0.2, 0],
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
      
      {/* Inner glow ring */}
      <motion.span
        className={cn(
          "absolute inset-0 rounded-full border-2",
          type === 'connection' ? 'border-orange-400/60' : 
          type === 'pattern' ? 'border-purple-400/60' : 
          'border-yellow-400/60'
        )}
        animate={pulse ? {
          opacity: [0.4, 1, 0.4],
          scale: [1, 1.2, 1],
        } : { opacity: 0.4 }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      
      <Icon size={sizeProps.icon} className={cn(config.color, "relative z-10 drop-shadow-lg")} />
    </motion.button>
  );
}
