import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { useChangeSpine, GUIDED_PATH_STEPS } from '@/hooks/useChangeSpine';
import { useAuth } from '@/hooks/useAuth';

/**
 * Hook that auto-advances the guided path when users visit key pages.
 * Must be used within the app's routing context.
 */
export const useGuidedPathTracker = () => {
  const location = useLocation();
  const { user } = useAuth();
  const changeSpine = useChangeSpine();
  const { 
    guidedPathStep, 
    isNewUser, 
    isLoading, 
    hasAchievedFirstWin,
    advanceGuidedPath 
  } = changeSpine;

  // Track pages we've already advanced for to prevent duplicate calls
  const advancedPaths = useRef<Set<string>>(new Set());

  useEffect(() => {
    // Skip if not a new user, still loading, or already achieved first win
    if (!isNewUser || isLoading || hasAchievedFirstWin || !user) {
      return;
    }

    const currentPath = location.pathname;
    
    // Skip if we've already advanced for this path in this session
    if (advancedPaths.current.has(currentPath)) {
      return;
    }

    // Find which step corresponds to current path
    const matchingStepIndex = GUIDED_PATH_STEPS.findIndex(step => {
      // Exact match or path starts with step path
      return currentPath === step.path || currentPath.startsWith(step.path + '/');
    });

    // If we found a matching step and it's the current or next step
    if (matchingStepIndex !== -1 && matchingStepIndex >= guidedPathStep) {
      // Mark this path as processed
      advancedPaths.current.add(currentPath);

      // Advance to this step if we're behind
      if (matchingStepIndex > guidedPathStep) {
        // We need to advance multiple steps
        advanceGuidedPath();
      } else if (matchingStepIndex === guidedPathStep) {
        // User is on current step, advance to next
        advanceGuidedPath();
      }
    }
  }, [location.pathname, guidedPathStep, isNewUser, isLoading, hasAchievedFirstWin, user, advanceGuidedPath]);

  return null;
};

/**
 * Component wrapper for the hook to use in App.tsx
 */
export const GuidedPathTracker = () => {
  useGuidedPathTracker();
  return null;
};
