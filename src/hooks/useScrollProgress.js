import { useState, useEffect } from 'react';

/**
 * Hook to get normalized scroll progress for a specific element or the whole window
 * @param {boolean} global - If true, calculates progress across entire scroll height. If false, typical use in pinned sections.
 * @returns {number} Normalized scroll progress from 0 to 1
 */
export function useScrollProgress(global = false) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          if (global) {
            const docElement = document.documentElement;
            // Total scrollable height
            const maxScroll = docElement.scrollHeight - window.innerHeight;
            if (maxScroll <= 0) {
              setProgress(0);
            } else {
              // Calculate normalized progress and clamp to 0-1
              const currentProgress = Math.min(Math.max(window.scrollY / maxScroll, 0), 1);
              setProgress(currentProgress);
            }
          } else {
            // Usually, scroll-based animations for a section map the scroll relative to viewport height
            // We'll normalize by window innerHeight
            const scrollY = window.scrollY;
            const vh = window.innerHeight;
            
            // To provide a consistent experience, we normalize by looking at max scroll (let's say 200vh is our timeline)
            const maxScroll = vh * 2;
            const currentProgress = Math.min(Math.max(scrollY / maxScroll, 0), 1);
            setProgress(currentProgress);
          }
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    
    // Initialize
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [global]);

  return progress;
}
