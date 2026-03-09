export const motionConfig = {
  // Smoothing factor for requestAnimationFrame lerp (lower = smoother/slower, higher = tighter/faster)
  scrollSmoothing: 0.08,
  
  // Custom Easing Strings for GSAP
  ease: {
    cinematic: "power4.inOut",
    spring: "back.out(1.7)",
    subtle: "power2.out",
    overshoot: "expo.out",
  },
  
  // Timings
  duration: {
    fast: 0.4,
    base: 0.8,
    slow: 1.2,
    cinematic: 2.0,
  },
  
  // Stagger delays
  stagger: {
    letters: 0.04,
    metrics: 0.15,
  },
  
  // Scroll Stages mapping (normalized 0 to 1) for main visual
  stages: {
    intro: [0.0, 0.25],    // Centered, slight scale down
    transit: [0.25, 0.65], // Fast translation and rotation
    finale: [0.65, 1.0],   // Upward movement, scale up, glow intensity
  }
};
