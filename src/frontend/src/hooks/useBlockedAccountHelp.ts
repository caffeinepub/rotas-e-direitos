import { useState, useEffect } from 'react';
import { useInternetIdentity } from './useInternetIdentity';

export interface BlockedAccountProgress {
  currentStep: number;
  completedSteps: Set<number>;
  checklistItems: Record<number, boolean>;
  lastUpdated: number;
}

const STORAGE_KEY_PREFIX = 'blocked_help_progress_';

function getStorageKey(principal: string): string {
  return `${STORAGE_KEY_PREFIX}${principal}`;
}

export function useBlockedAccountHelp() {
  const { identity } = useInternetIdentity();
  const principal = identity?.getPrincipal().toString() || '';

  const [progress, setProgress] = useState<BlockedAccountProgress>({
    currentStep: 1,
    completedSteps: new Set(),
    checklistItems: {},
    lastUpdated: Date.now(),
  });

  useEffect(() => {
    if (!principal) return;

    try {
      const key = getStorageKey(principal);
      const stored = localStorage.getItem(key);
      if (stored) {
        const parsed = JSON.parse(stored);
        setProgress({
          ...parsed,
          completedSteps: new Set(parsed.completedSteps || []),
        });
      }
    } catch (error) {
      console.error('Failed to load progress:', error);
    }
  }, [principal]);

  const saveProgress = (newProgress: BlockedAccountProgress) => {
    if (!principal) return;

    try {
      const key = getStorageKey(principal);
      const toStore = {
        ...newProgress,
        completedSteps: Array.from(newProgress.completedSteps),
      };
      localStorage.setItem(key, JSON.stringify(toStore));
      setProgress(newProgress);
    } catch (error) {
      console.error('Failed to save progress:', error);
    }
  };

  const goToStep = (step: number) => {
    saveProgress({
      ...progress,
      currentStep: step,
      lastUpdated: Date.now(),
    });
  };

  const completeStep = (step: number) => {
    const newCompleted = new Set(progress.completedSteps);
    newCompleted.add(step);
    saveProgress({
      ...progress,
      completedSteps: newCompleted,
      lastUpdated: Date.now(),
    });
  };

  const toggleChecklistItem = (step: number, itemKey: string) => {
    const key = `${step}_${itemKey}`;
    saveProgress({
      ...progress,
      checklistItems: {
        ...progress.checklistItems,
        [key]: !progress.checklistItems[key],
      },
      lastUpdated: Date.now(),
    });
  };

  const resetProgress = () => {
    saveProgress({
      currentStep: 1,
      completedSteps: new Set(),
      checklistItems: {},
      lastUpdated: Date.now(),
    });
  };

  return {
    progress,
    goToStep,
    completeStep,
    toggleChecklistItem,
    resetProgress,
  };
}
