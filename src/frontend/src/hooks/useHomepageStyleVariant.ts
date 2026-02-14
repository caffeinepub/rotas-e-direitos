import { useState, useEffect } from 'react';

type StyleVariant = 'A' | 'B';

const STORAGE_KEY = 'homepage-style-variant';

export function useHomepageStyleVariant() {
  const [variant, setVariant] = useState<StyleVariant>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored === 'B' ? 'B' : 'A';
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
    setVariant((prev) => (prev === 'A' ? 'B' : 'A'));
  };

  return { variant, toggleVariant };
}
