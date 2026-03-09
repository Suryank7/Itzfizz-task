import { useState, useEffect, useRef } from 'react';
import { lerp } from '@/utils/lerp';
import { motionConfig } from '@/utils/motionConfig';

/**
 * Advanced scroll motion engine utilizing requestAnimationFrame
 * Provides raw progress, smoothed progress (via lerp), and velocity.
 */
export function useScrollMotion(global = true) {
  const [scrollData, setScrollData] = useState({
    rawProgress: 0,
    smoothedProgress: 0,
    velocity: 0,
  });
  
  // Refs for animation loop persistence without re-triggering renders unnecessarily
  // We only trigger re-renders if components explicitly need state, 
  // but for high performance they should use the refs returned.
  const rawProgressRef = useRef(0);
  const smoothedProgressRef = useRef(0);
  const lastScrollYRef = useRef(0);
  const velocityRef = useRef(0);
  const rafIdRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      let currentScrollY = window.scrollY;
      let maxScroll = 0;
      
      if (global) {
        maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      } else {
        maxScroll = window.innerHeight * 2; // Assuming 200vh section
      }
      
      if (maxScroll > 0) {
        rawProgressRef.current = Math.min(Math.max(currentScrollY / maxScroll, 0), 1);
      } else {
        rawProgressRef.current = 0;
      }

      // Calculate simple velocity
      const deltaY = currentScrollY - lastScrollYRef.current;
      velocityRef.current = deltaY;
      lastScrollYRef.current = currentScrollY;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    
    // Initial calculation
    handleScroll();

    // The Render Loop
    const renderLoop = () => {
      // Smooth the progress
      smoothedProgressRef.current = lerp(
        smoothedProgressRef.current, 
        rawProgressRef.current, 
        motionConfig.scrollSmoothing
      );
      
      // Decay velocity smoothly for inertia
      velocityRef.current = lerp(velocityRef.current, 0, 0.1);

      // State update (throttled to UI refresh rate)
      // Note: For true 60fps without React render overhead, components 
      // can pass a ref to this hook and update DOM directly, 
      // but state is sufficient for simple mapping if carefully constructed.
      setScrollData({
        rawProgress: rawProgressRef.current,
        smoothedProgress: smoothedProgressRef.current,
        velocity: velocityRef.current,
      });

      rafIdRef.current = requestAnimationFrame(renderLoop);
    };

    rafIdRef.current = requestAnimationFrame(renderLoop);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (rafIdRef.current) cancelAnimationFrame(rafIdRef.current);
    };
  }, [global]);

  return {
    rawProgress: scrollData.rawProgress,
    smoothedProgress: scrollData.smoothedProgress,
    velocity: scrollData.velocity,
    refs: {
      raw: rawProgressRef,
      smoothed: smoothedProgressRef,
      velocity: velocityRef
    }
  };
}
