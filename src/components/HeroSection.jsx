import { useState, useRef } from 'react';
import AnimatedHeadline from './AnimatedHeadline';
import MetricsSection from './MetricsSection';
import ScrollVisual from './ScrollVisual';
import ParticleField from './ParticleField';
import ParallaxLayer from './ParallaxLayer';
import ScrollIndicator from './ScrollIndicator';

export default function HeroSection() {
  const [headlineComplete, setHeadlineComplete] = useState(false);
  const containerRef = useRef(null);

  return (
    <>
      <ScrollIndicator />
      <ParticleField />

      <section 
        ref={containerRef}
        className="relative min-h-[100vh] w-full flex flex-col items-center justify-start pt-[15vh] overflow-hidden"
      >
        {/* Advanced Parallax Layer Depth System */}
        {/* Background decorative far layer (slowest) */}
        <ParallaxLayer speed={0.2}>
          <div className="absolute top-[10%] left-[5%] w-64 h-64 bg-gray-900/40 rounded-full blur-[80px]" />
          <div className="absolute top-[60%] right-[10%] w-96 h-96 bg-highlight/5 rounded-full blur-[120px]" />
        </ParallaxLayer>
        
        {/* Distinct Parallax overlay for foreground aesthetic text / watermark (faster) */}
        <ParallaxLayer speed={1.5} className="flex justify-center items-center opacity-5 select-none -z-10">
          <span className="text-[20vw] font-black text-white whitespace-nowrap pt-[20vh]">
            PERFORMANCE
          </span>
        </ParallaxLayer>

        {/* Main Content Layout (no parallax, or we can wrap only when sticky) */}
        <div className="z-10 w-full flex flex-col items-center placeholder-content pointer-events-auto">
          {/* Animated Headline */}
          <AnimatedHeadline 
            text="W E L C O M E   I T Z F I Z Z"
            onComplete={() => setHeadlineComplete(true)} 
          />
          
          {/* Impact Metrics with numeric count-up */}
          <div className="mt-8 md:mt-16 w-full">
            <MetricsSection startAnimation={headlineComplete} />
          </div>
        </div>

        {/* The Scroll-Driven Multi-Stage Visual Object */}
        <ScrollVisual />
        
        {/* Subtle CSS scroll indicator */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center opacity-50 animate-bounce">
          <span className="text-xs tracking-widest uppercase mb-2">Scroll</span>
          <div className="w-[1px] h-12 bg-gradient-to-b from-white to-transparent" />
        </div>
      </section>
    </>
  );
}
