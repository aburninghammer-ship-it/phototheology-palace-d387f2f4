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
    glowColor: 'shadow-[0_0_12px_3px_rgba(249,115,22,0.35)]',
    pulseGlow: 'shadow-[0_0_16px_4px_rgba(249,115,22,0.45)]',
    label: 'Connection Spark'
  },
  pattern: {
    icon: Sparkles,
    color: 'text-purple-400',
    bgColor: 'bg-purple-500/20',
    hoverBg: 'hover:bg-purple-500/30',
    glowColor: 'shadow-[0_0_12px_3px_rgba(168,85,247,0.35)]',
    pulseGlow: 'shadow-[0_0_16px_4px_rgba(168,85,247,0.45)]',
    label: 'Pattern Spark'
  },
  application: {
    icon: Lightbulb,
    color: 'text-yellow-400',
    bgColor: 'bg-yellow-500/20',
    hoverBg: 'hover:bg-yellow-500/30',
    glowColor: 'shadow-[0_0_12px_3px_rgba(234,179,8,0.35)]',
    pulseGlow: 'shadow-[0_0_16px_4px_rgba(234,179,8,0.45)]',
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
      {/* Subtle outer glow ring that pulses */}
      {pulse && (
        <motion.span
          className={cn(
            "absolute -inset-0.5 rounded-full",
            config.bgColor,
            "blur-sm"
          )}
          animate={{
            opacity: [0.3, 0.6, 0.3],
            scale: [1, 1.15, 1],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      )}
      
      {/* Subtle sparkle particle */}
      {pulse && (
        <motion.span
          className="absolute w-1 h-1 rounded-full bg-white/70"
          animate={{
            x: [0, 6, -4, 0],
            y: [0, -6, 4, 0],
            opacity: [0, 0.8, 0.3, 0],
            scale: [0, 1, 0.5, 0],
          }}
          transition={{
            duration: 2.5,
            repeat: Infinity,
            repeatDelay: 1,
          }}
        />
      )}
      
      {/* Inner glow ring */}
      <motion.span
        className={cn(
          "absolute inset-0 rounded-full border",
          type === 'connection' ? 'border-orange-400/50' : 
          type === 'pattern' ? 'border-purple-400/50' : 
          'border-yellow-400/50'
        )}
        animate={pulse ? {
          opacity: [0.3, 0.7, 0.3],
          scale: [1, 1.08, 1],
        } : { opacity: 0.3 }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      
      <Icon size={sizeProps.icon} className={cn(config.color, "relative z-10 drop-shadow-lg")} />
    </motion.button>
  );
}
