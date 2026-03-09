import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { useScrollMotion } from '@/hooks/useScrollMotion';
import { motionConfig } from '@/utils/motionConfig';
import carImage from '../../public/car.png';

export default function ScrollVisual() {
  const visualRef = useRef(null);
  const glowRef = useRef(null);
  
  // Use the new advanced motion engine
  const { smoothedProgress } = useScrollMotion(false); // Local module scroll progress mapped over ~200vh
  
  const rafId = useRef(null);
  const smoothedProgressRef = useRef(smoothedProgress);

  // Keep ref in sync for loop
  useEffect(() => {
    smoothedProgressRef.current = smoothedProgress;
  }, [smoothedProgress]);

  useEffect(() => {
    const render = () => {
      const p = smoothedProgressRef.current;
      
      if (visualRef.current) {
        let x = 0;
        let y = 0;
        let scale = 1;
        let rotate = 0;
        let glowOpacity = 0.2; // base
        let glowScale = 1;
        
        const { intro, transit, finale } = motionConfig.stages;
        const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
        const maxTranslateX = typeof window !== 'undefined' ? (isMobile ? window.innerWidth * 0.2 : window.innerWidth * 0.45) : 500;
        const maxTranslateY = typeof window !== 'undefined' ? (isMobile ? -(window.innerHeight * 0.15) : -(window.innerHeight * 0.3)) : -300;
        
        // Multi-stage mapping logic
        if (p < intro[1]) {
          // Stage 1: Intro (0 to 0.25) -> Centered, slight scale down
          const localP = p / intro[1];
          scale = 1 - (localP * 0.15); // 1.0 down to 0.85
          glowScale = 1 + (localP * 0.5);
        } 
        else if (p >= transit[0] && p < transit[1]) {
          // Stage 2: Transit (0.25 to 0.65) -> Move horizontally & rotate
          const localP = (p - transit[0]) / (transit[1] - transit[0]);
          // Easing the progress slightly for smoother visual start
          const easeP = localP * localP * (3 - 2 * localP); // Smoothstep
          
          scale = 0.85; // Hold scale
          x = easeP * maxTranslateX;
          rotate = easeP * 18; // Rotate up to 18 deg
          glowScale = 1.5;
        } 
        else {
          // Stage 3: Finale (0.65 to 1.0) -> Move up, scale up, glow intense
          const localP = Math.min((p - finale[0]) / (finale[1] - finale[0]), 1);
          
          x = maxTranslateX + (localP * (maxTranslateX * 0.2)); // Drift right slightly more
          y = localP * maxTranslateY; // Move up
          scale = 0.85 + (localP * 0.4); // Scale up to 1.25
          rotate = 18 - (localP * 8); // Rotate back to 10 deg
          
          // Advanced lighting effect increase
          glowOpacity = 0.2 + (localP * 0.6); // up to 0.8 opacity
          glowScale = 1.5 + (localP * 1.5); // Large ambient lighting
        }

        // Apply hardware-accelerated transforms
        gsap.set(visualRef.current, {
          x,
          y,
          scale,
          rotationZ: rotate,
          force3D: true,
        });

        if (glowRef.current) {
          gsap.set(glowRef.current, {
            scale: glowScale,
            opacity: glowOpacity,
            force3D: true,
          });
        }
      }
      
      rafId.current = requestAnimationFrame(render);
    };
    
    rafId.current = requestAnimationFrame(render);
    
    return () => {
      if (rafId.current) cancelAnimationFrame(rafId.current);
    };
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none flex items-center justify-center -z-10">
      {/* Scroll-driven lighting effect */}
      <div 
        ref={glowRef}
        className="absolute w-[40vh] h-[40vh] bg-highlight rounded-full blur-[100px] will-change-transform mix-blend-screen"
        style={{ opacity: 0.2 }}
      />
      
      {/* Main visual object */}
      <div 
        ref={visualRef}
        className="relative will-change-transform flex items-center justify-center"
      >
        <div className="w-[300px] md:w-[600px] h-[150px] md:h-[300px] relative">
            <img 
              src={carImage.src} 
              alt="McLaren Orange Sports Car object" 
              className="w-full h-full object-contain drop-shadow-2xl"
            />
        </div>
      </div>
    </div>
  );
}
