import React, { useRef, useEffect, useState, CSSProperties } from 'react';
import { gsap } from 'gsap';

interface PixelTransitionProps {
  firstContent: React.ReactNode;
  secondContent: React.ReactNode;
  gridSize?: number;
  pixelColor?: string;
  animationStepDuration?: number;
  className?: string;
  style?: CSSProperties;
  aspectRatio?: string;
}

const PixelTransition: React.FC<PixelTransitionProps> = ({
  firstContent,
  secondContent,
  gridSize = 7,
  pixelColor = 'currentColor',
  animationStepDuration = 0.3,
  className = '',
  style = {},
  aspectRatio = 'auto'
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const pixelGridRef = useRef<HTMLDivElement | null>(null);
  const activeRef = useRef<HTMLDivElement | null>(null);
  const delayedCallRef = useRef<gsap.core.Tween | null>(null);
  const firstContentRef = useRef<HTMLDivElement | null>(null);
  const [imageAspectRatio, setImageAspectRatio] = useState<string>('');
  const [imageBounds, setImageBounds] = useState<{ width: number; height: number; top: number; left: number } | null>(null);

  const [isActive, setIsActive] = useState<boolean>(false);

  const isTouchDevice =
    'ontouchstart' in window || navigator.maxTouchPoints > 0 || window.matchMedia('(pointer: coarse)').matches;

  // Calculate aspect ratio and image bounds from the image in firstContent
  useEffect(() => {
    const firstContentEl = firstContentRef.current;
    if (!firstContentEl) return;

    const img = firstContentEl.querySelector('img');
    const updateImageBounds = () => {
      if (img) {
        const aspectRatio = (img.naturalHeight / img.naturalWidth) * 100;
        setImageAspectRatio(`${aspectRatio}%`);
        
        // Get the rendered image bounds (with object-fit: contain)
        const containerRect = firstContentEl.getBoundingClientRect();
        const imgRect = img.getBoundingClientRect();
        
        // Calculate the actual rendered image size (object-fit: contain)
        const imgAspectRatio = img.naturalHeight / img.naturalWidth;
        const containerAspectRatio = containerRect.height / containerRect.width;
        
        let renderedWidth, renderedHeight, renderedLeft, renderedTop;
        
        if (imgAspectRatio > containerAspectRatio) {
          // Image is taller than container - height fits
          renderedHeight = containerRect.height;
          renderedWidth = renderedHeight / imgAspectRatio;
          renderedLeft = (containerRect.width - renderedWidth) / 2;
          renderedTop = 0;
        } else {
          // Image is wider than container - width fits
          renderedWidth = containerRect.width;
          renderedHeight = renderedWidth * imgAspectRatio;
          renderedLeft = 0;
          renderedTop = (containerRect.height - renderedHeight) / 2;
        }
        
        setImageBounds({
          width: renderedWidth,
          height: renderedHeight,
          left: renderedLeft,
          top: renderedTop
        });
      } else {
        // If no image, use the firstContent div's dimensions
        const rect = firstContentEl.getBoundingClientRect();
        if (rect.height > 0 && rect.width > 0) {
          const aspectRatio = (rect.height / rect.width) * 100;
          setImageAspectRatio(`${aspectRatio}%`);
          setImageBounds({
            width: rect.width,
            height: rect.height,
            left: 0,
            top: 0
          });
        }
      }
    };
    
    if (img) {
      img.onload = updateImageBounds;
      
      // If image already loaded
      if (img.complete && img.naturalHeight > 0) {
        updateImageBounds();
      }
    } else {
      updateImageBounds();
    }
  }, [firstContent]);

  useEffect(() => {
    const pixelGridEl = pixelGridRef.current;
    if (!pixelGridEl) return;

    pixelGridEl.innerHTML = '';

    for (let row = 0; row < gridSize; row++) {
      for (let col = 0; col < gridSize; col++) {
        const pixel = document.createElement('div');
        pixel.classList.add('pixelated-image-card__pixel');
        pixel.classList.add('absolute', 'hidden');
        pixel.style.backgroundColor = pixelColor;

        const size = 100 / gridSize;
        pixel.style.width = `${size}%`;
        pixel.style.height = `${size}%`;
        pixel.style.left = `${col * size}%`;
        pixel.style.top = `${row * size}%`;

        pixelGridEl.appendChild(pixel);
      }
    }
  }, [gridSize, pixelColor]);

  const animatePixels = (activate: boolean): void => {
    setIsActive(activate);

    const pixelGridEl = pixelGridRef.current;
    const activeEl = activeRef.current;
    if (!pixelGridEl || !activeEl) return;

    const pixels = pixelGridEl.querySelectorAll<HTMLDivElement>('.pixelated-image-card__pixel');
    if (!pixels.length) return;

    gsap.killTweensOf(pixels);
    if (delayedCallRef.current) {
      delayedCallRef.current.kill();
    }

    gsap.set(pixels, { display: 'none' });

    const totalPixels = pixels.length;
    const staggerDuration = animationStepDuration / totalPixels;

    gsap.to(pixels, {
      display: 'block',
      duration: 0,
      stagger: {
        each: staggerDuration,
        from: 'random'
      }
    });

    delayedCallRef.current = gsap.delayedCall(animationStepDuration, () => {
      activeEl.style.display = activate ? 'block' : 'none';
      activeEl.style.pointerEvents = activate ? 'none' : '';
    });

    gsap.to(pixels, {
      display: 'none',
      duration: 0,
      delay: animationStepDuration,
      stagger: {
        each: staggerDuration,
        from: 'random'
      }
    });
  };

  const handleMouseEnter = (): void => {
    if (!isActive) animatePixels(true);
  };
  const handleMouseLeave = (): void => {
    if (isActive) animatePixels(false);
  };
  const handleClick = (): void => {
    animatePixels(!isActive);
  };

  // Use imageAspectRatio if available, otherwise fall back to the provided aspectRatio
  const finalAspectRatio = imageAspectRatio || aspectRatio;

  return (
    <div
      ref={containerRef}
      className={`
        ${className}
        text-white
        relative
        overflow-hidden
      `}
      style={{
        width: '100%',
        backgroundColor: 'transparent',
        ...style
      }}
      onMouseEnter={!isTouchDevice ? handleMouseEnter : undefined}
      onMouseLeave={!isTouchDevice ? handleMouseLeave : undefined}
      onClick={isTouchDevice ? handleClick : undefined}
    >
      <div style={{ paddingTop: finalAspectRatio === 'auto' ? '100%' : finalAspectRatio }} />

      <div ref={firstContentRef} className="absolute w-full h-full" style={{ top: 0, left: 0, width: '100%', height: '100%' }}>
        {firstContent}
      </div>

      {imageBounds && (
        <>
          <div ref={activeRef} className="absolute z-[2]" style={{ 
            display: 'none', 
            width: `${imageBounds.width}px`,
            height: `${imageBounds.height}px`,
            left: `${imageBounds.left}px`,
            top: `${imageBounds.top}px`
          }}>
            {secondContent}
          </div>

          <div ref={pixelGridRef} className="absolute pointer-events-none z-[3]" style={{ 
            width: `${imageBounds.width}px`,
            height: `${imageBounds.height}px`,
            left: `${imageBounds.left}px`,
            top: `${imageBounds.top}px`,
            overflow: 'hidden'
          }} />
        </>
      )}
    </div>
  );
};

export default PixelTransition;
