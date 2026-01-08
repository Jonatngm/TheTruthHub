import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Sun, Moon } from 'lucide-react';

const STORAGE_KEY = 'reducedMotion';

export default function ReducedMotionToggle() {
  const [reduced, setReduced] = useState<boolean | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored !== null) {
      const val = stored === 'true';
      setReduced(val);
      document.documentElement.setAttribute('data-reduced-motion', String(val));
      return;
    }

    const prefers = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    setReduced(prefers);
    document.documentElement.setAttribute('data-reduced-motion', String(prefers));
  }, []);

  const toggle = () => {
    const next = !Boolean(reduced);
    setReduced(next);
    document.documentElement.setAttribute('data-reduced-motion', String(next));
    try {
      localStorage.setItem(STORAGE_KEY, String(next));
    } catch (_) {}
  };

  if (reduced === null) return null;

  return (
    <Button
      variant="ghost"
      size="sm"
      aria-pressed={reduced}
      onClick={toggle}
      className="text-sm"
      title={reduced ? 'Reduced motion: On' : 'Reduced motion: Off'}
    >
      {reduced ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
    </Button>
  );
}
