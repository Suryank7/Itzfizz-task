import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { motionConfig } from '@/utils/motionConfig';

export default function AnimatedHeadline({ text = "W E L C O M E   I T Z F I Z Z", onComplete }) {
  const containerRef = useRef(null);

  // Split text into words, then into letters, preserving intentional multiple spaces
  const words = text.split("  ").map(word => word.split(""));

  useEffect(() => {
    if (!containerRef.current) return;

    const letters = containerRef.current.querySelectorAll('.char');

    // Initial state: hidden, moved down, slightly scaled up, and highly blurred
    gsap.set(letters, {
      opacity: 0,
      y: 60,
      scale: 1.2,
      filter: 'blur(10px)',
    });

    // Cinematic advanced entrance
    gsap.to(letters, {
      opacity: 1,
      y: 0,
      scale: 1,
      filter: 'blur(0px)',
      duration: 1.4,
      stagger: motionConfig.stagger.letters,
      ease: motionConfig.ease.spring, // Overshoot easing as requested
      onComplete: () => {
        if (onComplete) onComplete();
      }
    });
  }, [onComplete]);

  return (
    <h1 
      ref={containerRef} 
      className="text-4xl md:text-6xl lg:text-7xl font-black tracking-[0.3em] lg:tracking-[0.5em] text-center uppercase drop-shadow-lg"
      aria-label={text.replace(/\s+/g, ' ')}
    >
      {words.map((word, wordIndex) => (
        <span key={`word-${wordIndex}`} className="inline-block mx-4">
          {word.map((char, charIndex) => (
            <span 
              key={`char-${wordIndex}-${charIndex}`} 
              className="char inline-block will-change-transform"
            >
              {char === " " ? "\u00A0" : char}
            </span>
          ))}
        </span>
      ))}
    </h1>
  );
}
