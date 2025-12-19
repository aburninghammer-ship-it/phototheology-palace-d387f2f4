import { motion } from 'framer-motion';
import { Sparkles, BookOpen, GraduationCap, Crown } from 'lucide-react';
import { useChangeSpine } from '@/hooks/useChangeSpine';
import { cn } from '@/lib/utils';

interface IdentityMessageProps {
  className?: string;
  variant?: 'badge' | 'inline' | 'full';
}

/**
 * Displays identity messaging based on user's phase in the Change Spine.
 * Reinforces positive identity at each stage of the journey.
 */
export const IdentityMessage = ({ className, variant = 'badge' }: IdentityMessageProps) => {
  const { phase, isLoading, isNewUser, totalGemsSaved, trialDaysRemaining, isPaid } = useChangeSpine();

  // Only show for new users
  if (!isNewUser || isLoading) {
    return null;
  }

  // Get identity based on phase
  const getIdentity = () => {
    switch (phase) {
      case 'orientation':
        return {
          title: 'Welcome, Seeker',
          subtitle: 'Your first study takes just 7 minutes',
          icon: BookOpen,
          color: 'text-blue-500',
          bgColor: 'bg-blue-500/10',
        };
      case 'first_win':
        return {
          title: 'Palace Student',
          subtitle: 'Save your first Gem to unlock the breakthrough',
          icon: Sparkles,
          color: 'text-amber-500',
          bgColor: 'bg-amber-500/10',
        };
      case 'reinforcement':
        return {
          title: 'Disciple in Training',
          subtitle: totalGemsSaved >= 3 
            ? "You are already walking the path. Don't stop in the outer court."
            : `${totalGemsSaved} gems saved. Keep building your treasury.`,
          icon: GraduationCap,
          color: 'text-purple-500',
          bgColor: 'bg-purple-500/10',
        };
      case 'commitment':
        return {
          title: 'Sanctuary Walker',
          subtitle: 'Continue your formation',
          icon: Crown,
          color: 'text-primary',
          bgColor: 'bg-primary/10',
        };
      default:
        return {
          title: 'Student',
          subtitle: 'Continue your formation',
          icon: BookOpen,
          color: 'text-muted-foreground',
          bgColor: 'bg-muted',
        };
    }
  };

  const identity = getIdentity();
  const Icon = identity.icon;

  // Add trial urgency to subtitle if applicable
  const getDisplaySubtitle = () => {
    if (trialDaysRemaining <= 3 && !isPaid && phase === 'reinforcement') {
      return `Your trial ends in ${trialDaysRemaining} days. Continue your formation.`;
    }
    return identity.subtitle;
  };

  if (variant === 'badge') {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className={cn(
          "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium",
          identity.bgColor,
          identity.color,
          className
        )}
      >
        <Icon className="w-3.5 h-3.5" />
        <span>{identity.title}</span>
      </motion.div>
    );
  }

  if (variant === 'inline') {
    return (
      <motion.div
        initial={{ opacity: 0, y: -5 }}
        animate={{ opacity: 1, y: 0 }}
        className={cn("flex items-center gap-2", className)}
      >
        <div className={cn("p-1.5 rounded-full", identity.bgColor)}>
          <Icon className={cn("w-4 h-4", identity.color)} />
        </div>
        <div>
          <p className={cn("text-sm font-medium", identity.color)}>{identity.title}</p>
          <p className="text-xs text-muted-foreground">{getDisplaySubtitle()}</p>
        </div>
      </motion.div>
    );
  }

  // Full variant
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        "p-4 rounded-xl border",
        identity.bgColor,
        "border-current/20",
        className
      )}
    >
      <div className="flex items-start gap-3">
        <div className={cn("p-2 rounded-full bg-background/50", identity.color)}>
          <Icon className="w-5 h-5" />
        </div>
        <div>
          <h3 className={cn("font-semibold", identity.color)}>{identity.title}</h3>
          <p className="text-sm text-muted-foreground mt-1">{getDisplaySubtitle()}</p>
        </div>
      </div>
    </motion.div>
  );
};
