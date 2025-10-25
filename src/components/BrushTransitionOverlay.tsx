import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';

interface BrushTransitionOverlayProps {
  isTransitioning: boolean;
  onComplete?: () => void;
}

/**
 * BrushTransitionOverlay Component
 * 
 * Creates a full-screen brush swipe effect that covers and reveals content during page transitions.
 * This component implements a paint brush stroke animation using multiple layers for a more realistic effect.
 * 
 * Features:
 * - Multiple diagonal stripes for a brush-like appearance
 * - Staggered animation for dynamic movement
 * - GPU-accelerated transforms for smooth performance
 * - Customizable colors and timing
 * 
 * Best Practices (2025):
 * - Uses transform properties (translateX, scaleX) for GPU acceleration
 * - Avoids animating layout-triggering properties
 * - Fixed positioning to prevent layout shifts
 * - Pointer-events: none to allow interaction with underlying content when not active
 */
const BrushTransitionOverlay = ({ isTransitioning, onComplete }: BrushTransitionOverlayProps) => {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (isTransitioning) {
      setShow(true);
    }
  }, [isTransitioning]);

  const handleAnimationComplete = () => {
    setShow(false);
    onComplete?.();
  };

  // 4 stripes with overlapping heights to ensure seamless coverage
  const brushStripes = [
    { delay: 0, top: 0, height: '35%', color: 'from-cyan-500 via-cyan-400 to-teal-500' },
    { delay: 0.06, top: 22, height: '36%', color: 'from-blue-500 via-cyan-500 to-blue-600' },
    { delay: 0.03, top: 45, height: '35%', color: 'from-orange-500 via-orange-400 to-red-500' },
    { delay: 0.09, top: 68, height: '37%', color: 'from-pink-500 via-rose-400 to-pink-600' },
  ];

  return (
    <AnimatePresence mode="wait">
      {show && (
        <div
          className="fixed inset-0 overflow-hidden pointer-events-none"
          style={{ 
            zIndex: 9999, 
            isolation: 'isolate',
            backfaceVisibility: 'hidden',
            perspective: 1000,
          }}
        >
          {brushStripes.map((stripe, index) => (
            <motion.div
              key={index}
              className={`absolute left-0 right-0 bg-gradient-to-r ${stripe.color}`}
              style={{
                top: `${stripe.top}%`,
                height: stripe.height,
                transformOrigin: 'left center',
                willChange: 'transform',
                backfaceVisibility: 'hidden',
                WebkitBackfaceVisibility: 'hidden',
                transform: 'translateZ(0)', // Force GPU acceleration
              }}
              initial={{
                x: '-100%',
              }}
              animate={{
                x: '100%',
                transition: {
                  duration: 0.9,
                  delay: stripe.delay,
                  ease: [0.45, 0, 0.55, 1], // Optimized easing curve
                },
              }}
              exit={{
                opacity: 0,
                transition: {
                  duration: 0.2,
                },
              }}
              onAnimationComplete={index === 0 ? handleAnimationComplete : undefined}
            />
          ))}
        </div>
      )}
    </AnimatePresence>
  );
};

export default BrushTransitionOverlay;

