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
    color: 'text-orange-500',
    bgColor: 'bg-orange-500/10',
    hoverBg: 'hover:bg-orange-500/20',
    label: 'Connection Spark'
  },
  pattern: {
    icon: Sparkles,
    color: 'text-purple-500',
    bgColor: 'bg-purple-500/10',
    hoverBg: 'hover:bg-purple-500/20',
    label: 'Pattern Spark'
  },
  application: {
    icon: Lightbulb,
    color: 'text-yellow-500',
    bgColor: 'bg-yellow-500/10',
    hoverBg: 'hover:bg-yellow-500/20',
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
      initial={pulse ? { scale: 1 } : false}
      animate={pulse ? { 
        scale: [1, 1.1, 1],
      } : false}
      transition={pulse ? { 
        duration: 2,
        repeat: 0,
        ease: "easeInOut"
      } : undefined}
      whileHover={{ scale: 1.15 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className={cn(
        'rounded-full flex items-center justify-center cursor-pointer transition-colors',
        sizeProps.wrapper,
        config.bgColor,
        config.hoverBg,
        className
      )}
      title={config.label}
    >
      <Icon size={sizeProps.icon} className={config.color} />
    </motion.button>
  );
}
