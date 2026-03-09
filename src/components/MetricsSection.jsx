import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { motionConfig } from '@/utils/motionConfig';

const metricsData = [
  { target: 95, suffix: '%', label: 'Customer satisfaction' },
  { target: 3.2, suffix: 'x', label: 'Performance boost', isFloat: true },
  { target: 120, suffix: 'k+', label: 'Users onboarded' },
];

export default function MetricsSection({ startAnimation }) {
  const containerRef = useRef(null);

  useEffect(() => {
    if (!startAnimation || !containerRef.current) return;

    const items = containerRef.current.querySelectorAll('.metric-item');
    const numbers = containerRef.current.querySelectorAll('.metric-number');

    // Initial State
    gsap.set(items, {
      opacity: 0,
      y: 40,
      scale: 0.9,
    });

    // Animate container items
    gsap.to(items, {
      opacity: 1,
      y: 0,
      scale: 1,
      duration: 1.2,
      stagger: motionConfig.stagger.metrics,
      ease: motionConfig.ease.spring,
    });

    // Numeric counter animation
    numbers.forEach((numObj, index) => {
      const data = metricsData[index];
      // Store current animated value in an object GSAP can tween
      const counter = { val: 0 };
      
      gsap.to(counter, {
        val: data.target,
        duration: 1.5,
        delay: index * motionConfig.stagger.metrics, // Sync with stagger
        ease: "power2.out",
        onUpdate: () => {
          if (data.isFloat) {
            numObj.innerText = counter.val.toFixed(1) + data.suffix;
          } else {
            numObj.innerText = Math.round(counter.val) + data.suffix;
          }
        }
      });
      
      // Add subtle glow pulse on finish
      gsap.to(numObj, {
        textShadow: "0px 0px 15px rgba(255, 77, 0, 0.6)",
        duration: 0.8,
        delay: (index * motionConfig.stagger.metrics) + 1.2,
        yoyo: true,
        repeat: 1,
      });
    });

  }, [startAnimation]);

  return (
    <div 
      ref={containerRef}
      className="flex flex-col md:flex-row items-center justify-center gap-10 md:gap-16 lg:gap-24 mt-12 w-full max-w-5xl mx-auto px-4"
    >
      {metricsData.map((metric, index) => (
        <div key={index} className="metric-item flex flex-col items-center text-center group">
          <span 
            className="metric-number text-4xl md:text-5xl font-bold text-highlight mb-2 transition-transform duration-300 group-hover:scale-110"
          >
            0{metric.suffix}
          </span>
          <span className="text-sm md:text-base text-gray-400 uppercase tracking-widest font-medium opacity-80">
            {metric.label}
          </span>
        </div>
      ))}
    </div>
  );
}
