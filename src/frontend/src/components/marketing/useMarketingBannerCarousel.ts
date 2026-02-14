import { useState, useEffect, useCallback, useRef } from 'react';

export interface UseMarketingBannerCarouselOptions {
  slideCount: number;
  autoAdvanceInterval?: number;
}

export interface UseMarketingBannerCarouselReturn {
  currentSlide: number;
  goToSlide: (index: number) => void;
  nextSlide: () => void;
  prevSlide: () => void;
  isPaused: boolean;
  pause: () => void;
  resume: () => void;
}

export function useMarketingBannerCarousel({
  slideCount,
  autoAdvanceInterval = 5000,
}: UseMarketingBannerCarouselOptions): UseMarketingBannerCarouselReturn {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const clearTimer = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const startTimer = useCallback(() => {
    clearTimer();
    if (!isPaused && slideCount > 1) {
      timerRef.current = setTimeout(() => {
        setCurrentSlide((prev) => (prev + 1) % slideCount);
      }, autoAdvanceInterval);
    }
  }, [isPaused, slideCount, autoAdvanceInterval, clearTimer]);

  useEffect(() => {
    startTimer();
    return () => clearTimer();
  }, [currentSlide, isPaused, startTimer, clearTimer]);

  const goToSlide = useCallback(
    (index: number) => {
      if (index >= 0 && index < slideCount) {
        setCurrentSlide(index);
        clearTimer();
        startTimer();
      }
    },
    [slideCount, clearTimer, startTimer]
  );

  const nextSlide = useCallback(() => {
    goToSlide((currentSlide + 1) % slideCount);
  }, [currentSlide, slideCount, goToSlide]);

  const prevSlide = useCallback(() => {
    goToSlide((currentSlide - 1 + slideCount) % slideCount);
  }, [currentSlide, slideCount, goToSlide]);

  const pause = useCallback(() => {
    setIsPaused(true);
    clearTimer();
  }, [clearTimer]);

  const resume = useCallback(() => {
    setIsPaused(false);
  }, []);

  return {
    currentSlide,
    goToSlide,
    nextSlide,
    prevSlide,
    isPaused,
    pause,
    resume,
  };
}
