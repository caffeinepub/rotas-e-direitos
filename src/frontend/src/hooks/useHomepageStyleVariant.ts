import { useState, useEffect } from 'react';

type StyleVariant = 'A' | 'B' | 'C';

const STORAGE_KEY = 'homepage-style-variant';

export function useHomepageStyleVariant() {
  const [variant, setVariant] = useState<StyleVariant>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored === 'B') return 'B';
      if (stored === 'C') return 'C';
      return 'A';
    } catch {
      return 'A';
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, variant);
    } catch {
      // Silently fail if localStorage is unavailable
    }
  }, [variant]);

  const toggleVariant = () => {
    setVariant((prev) => {
      if (prev === 'A') return 'B';
      if (prev === 'B') return 'C';
      return 'A';
    });
  };

  return { variant, toggleVariant };
}
