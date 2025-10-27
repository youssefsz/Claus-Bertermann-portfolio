import React, { useRef, useEffect, useState, CSSProperties } from 'react';
import { gsap } from 'gsap';

interface FadeTransitionProps {
  firstContent: React.ReactNode;
  secondContent: React.ReactNode;
  className?: string;
  style?: CSSProperties;
  fadeDuration?: number;
}

const FadeTransition: React.FC<FadeTransitionProps> = ({
  firstContent,
  secondContent,
  className = '',
  style = {},
  fadeDuration = 0.3
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const firstContentRef = useRef<HTMLDivElement | null>(null);
  const secondContentRef = useRef<HTMLDivElement | null>(null);

  const [isActive, setIsActive] = useState<boolean>(false);

  const isTouchDevice =
    'ontouchstart' in window || navigator.maxTouchPoints > 0 || window.matchMedia('(pointer: coarse)').matches;

  const animateFade = (activate: boolean): void => {
    setIsActive(activate);

    const firstEl = firstContentRef.current;
    const secondEl = secondContentRef.current;
    if (!firstEl || !secondEl) return;

    if (activate) {
      // Fade out first content and fade in second content
      gsap.to(firstEl, {
        opacity: 0,
        duration: fadeDuration,
        ease: "power2.inOut"
      });
      
      gsap.to(secondEl, {
        opacity: 1,
        duration: fadeDuration,
        ease: "power2.inOut"
      });
    } else {
      // Fade out second content and fade in first content
      gsap.to(secondEl, {
        opacity: 0,
        duration: fadeDuration,
        ease: "power2.inOut"
      });
      
      gsap.to(firstEl, {
        opacity: 1,
        duration: fadeDuration,
        ease: "power2.inOut"
      });
    }
  };

  const handleMouseEnter = (): void => {
    if (!isActive) animateFade(true);
  };

  const handleMouseLeave = (): void => {
    if (isActive) animateFade(false);
  };

  const handleClick = (): void => {
    animateFade(!isActive);
  };

  return (
    <div
      ref={containerRef}
      className={`
        ${className}
        relative
        overflow-hidden
      `}
      style={style}
      onMouseEnter={!isTouchDevice ? handleMouseEnter : undefined}
      onMouseLeave={!isTouchDevice ? handleMouseLeave : undefined}
      onClick={isTouchDevice ? handleClick : undefined}
    >
      <div ref={firstContentRef} className="absolute inset-0 w-full h-full">
        {firstContent}
      </div>

      <div 
        ref={secondContentRef} 
        className="absolute inset-0 w-full h-full" 
        style={{ opacity: 0 }}
      >
        {secondContent}
      </div>
    </div>
  );
};

export default FadeTransition;
