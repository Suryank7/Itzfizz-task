import { useEffect, useRef } from 'react';
import { useScrollMotion } from '@/hooks/useScrollMotion';

const PARTICLE_COUNT = typeof window !== 'undefined' && window.innerWidth < 768 ? 15 : 40;

export default function ParticleField() {
  const canvasRef = useRef(null);
  const particles = useRef([]);
  const requestRef = useRef();
  
  const { smoothedProgress } = useScrollMotion(true);
  const smoothedProgressRef = useRef(smoothedProgress);
  
  // Sync the latest smoothedProgress to a ref for the raf loop without re-triggering useEffect
  useEffect(() => {
    smoothedProgressRef.current = smoothedProgress;
  }, [smoothedProgress]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    
    // Handle resizing natively
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      initParticles();
    };

    const initParticles = () => {
      particles.current = Array.from({ length: PARTICLE_COUNT }, () => ({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height * 1.5, // Spread further down for scroll effect
        radius: Math.random() * 2 + 0.5,
        speedX: Math.random() * 0.5 - 0.25,
        speedY: Math.random() * 0.5 - 0.25,
        baseAlpha: Math.random() * 0.5 + 0.1,
      }));
    };

    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const parallaxOffset = smoothedProgressRef.current * canvas.height * 0.8;
      
      particles.current.forEach(p => {
        // Subtle ambient drift
        p.x += p.speedX;
        p.y += p.speedY;
        
        // Wrap around horizontally
        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;
        
        // Final position with parallax applied
        const renderY = p.y - parallaxOffset;
        
        // Fade out slightly based on scroll depth
        const depthAlpha = p.baseAlpha * (1 - (smoothedProgressRef.current * 0.5));
        
        ctx.beginPath();
        ctx.arc(p.x, renderY, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${depthAlpha})`;
        ctx.fill();
      });

      requestRef.current = requestAnimationFrame(animate);
    };

    requestRef.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      cancelAnimationFrame(requestRef.current);
    };
  }, []);

  return (
    <canvas 
      ref={canvasRef} 
      className="fixed inset-0 pointer-events-none -z-30 opacity-60"
    />
  );
}
