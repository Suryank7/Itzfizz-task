# Premium Motion Architecture Upgrade

A robust, GPU-accelerated motion system built for Next.js & React, utilizing a hybrid requestAnimationFrame and GSAP architecture for scroll-driven micro-interactions.

## Motion Architecture

### 1. `useScrollMotion` Hook
Instead of attaching naive scroll event listeners everywhere that trigger React renders, we've implemented an advanced `useScrollMotion` custom hook:
- Uses `requestAnimationFrame` for a dedicated 60fps local render loop.
- Calculates raw scroll progress alongside **`smoothedProgress`** using a Linear Interpolation (LERP) algorithm (smoothing factor `0.08` by default). This provides premium "weight/inertia" to the interface.
- Prevents unnecessary DOM reflows by keeping values in `useRef` and carefully throttling React state updates.

### 2. Multi-Stage Visual Translation
The main object (`ScrollVisual`) maps its timeline dynamically to the global scroll progress.
It transitions through multiple defined "Stages" inside `motionConfig.js`:
- **Intro (0.0 - 0.25):** The object stays perfectly centered while scaling slightly down.
- **Transit (0.25 - 0.65):** The object is pulled horizontally while rotating slightly to simulate turning.
- **Finale (0.65 - 1.0):** The object translates upward across the y-axis, completing its motion arc while scaling back up.

### 3. Layered Parallax System
Instead of uniform scrolling, we simulate spatial depth.
- `ParticleField.jsx`: Operates independently using HTML5 Canvas (`<canvas>`) and standard `Math.sin/cos` particle motion overlaid with parallax offset. Canvas ensures we avoid generating hundreds of heavy DOM nodes.
- `ParallaxLayer.jsx`: Reusable wrappers taking a `speed` multiplier that manipulate local `translateY` values counter to the scroll direction using hardware-accelerated GSAP strings.

### 4. Advanced Component Entrance
- **Headline Component (`AnimatedHeadline`):** We utilize GSAP staggers combining a `blur-to-sharp` filter alongside dynamic overshoot easing (`back.out(1.7)` parameter) to give the entrance text a snappy, cinematic feel.
- **Micro-Interaction Metrics:** The statistics utilize GSAP's raw numeric object tweens combined with `.toFixed` to animate counting from zero to the target dynamically. Additionally, we loop a `textShadow` pulse for a sophisticated neon-like aesthetic drop shadow finish.

### 5. Performance Optimizations (Crucial)
- We strictly target CSS properties that run on the Compositor Thread (GPU hardware-accelerated): `transform` (`x`, `y`, `scale`, `rotationZ`) and `opacity`.
- GSAP's `force3D: true` is utilized to force browsers to bump translation elements onto isolated texture layers.
- Avoided polling computationally heavy measurements like `getBoundingClientRect()` within `requestAnimationFrame` hooks during active scrolling.
