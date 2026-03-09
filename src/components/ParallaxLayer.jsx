import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { useScrollMotion } from '@/hooks/useScrollMotion';

export default function ParallaxLayer({ children, speed = 1, className = '' }) {
  const layerRef = useRef(null);
  
  // Connect to our advanced motion engine
  const { smoothedProgress } = useScrollMotion(true);

  useEffect(() => {
    if (!layerRef.current) return;
    
    // speed multiplier mapping (e.g. speed=2 moves twice as fast vertically)
    // Map normalized progress (0-1) to an actual pixel offset
    // Using viewport height as the base unit for displacement
    const vh = window.innerHeight;
    const yOffset = smoothedProgress * (vh * speed);

    gsap.set(layerRef.current, {
      y: -yOffset, // Parallax moves counter to scroll
      force3D: true, // Hardware acceleration
    });
    
  }, [smoothedProgress, speed]);

  return (
    <div 
      ref={layerRef} 
      className={`absolute inset-0 will-change-transform pointer-events-none ${className}`}
    >
      {children}
    </div>
  );
}
