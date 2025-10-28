import React, { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { gsap } from 'gsap';

const useMedia = (queries: string[], values: number[], defaultValue: number): number => {
  const get = () => values[queries.findIndex(q => matchMedia(q).matches)] ?? defaultValue;

  const [value, setValue] = useState<number>(get);

  useEffect(() => {
    const handler = () => setValue(get);
    queries.forEach(q => matchMedia(q).addEventListener('change', handler));
    return () => queries.forEach(q => matchMedia(q).removeEventListener('change', handler));
  }, [queries]);

  return value;
};

const useMeasure = <T extends HTMLElement>() => {
  const ref = useRef<T | null>(null);
  const [size, setSize] = useState({ width: 0, height: 0 });

  useLayoutEffect(() => {
    if (!ref.current) return;
    const ro = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect;
      setSize({ width, height });
    });
    ro.observe(ref.current);
    return () => ro.disconnect();
  }, []);

  return [ref, size] as const;
};

const preloadImages = async (urls: string[]): Promise<void> => {
  await Promise.all(
    urls.map(
      src =>
        new Promise<void>(resolve => {
          const img = new Image();
          img.src = src;
          img.onload = img.onerror = () => resolve();
        })
    )
  );
};

export interface Item {
  id: string;
  img: string;
  popupImg?: string;
  url: string;
  height: number;
  customComponent?: React.ReactNode;
  title?: string;
  medium?: string;
  dimensions?: string;
}

interface GridItem extends Item {
  x: number;
  y: number;
  w: number;
  h: number;
}

interface MasonryProps {
  items: Item[];
  ease?: string;
  duration?: number;
  stagger?: number;
  animateFrom?: 'bottom' | 'top' | 'left' | 'right' | 'center' | 'random';
  scaleOnHover?: boolean;
  hoverScale?: number;
  blurToFocus?: boolean;
  colorShiftOnHover?: boolean;
  onItemClick?: (item: Item) => void;
  delayAnimation?: number; // Delay in milliseconds before starting the animation
}

const Masonry: React.FC<MasonryProps> = ({
  items,
  ease = 'power3.out',
  duration = 0.6,
  stagger = 0.05,
  animateFrom = 'bottom',
  scaleOnHover = true,
  hoverScale = 0.95,
  blurToFocus = true,
  colorShiftOnHover = false,
  onItemClick,
  delayAnimation = 0
}) => {
  const columns = useMedia(
    ['(min-width:1500px)', '(min-width:1000px)', '(min-width:600px)', '(min-width:400px)'],
    [3, 3, 2, 1],
    1
  );

  const [containerRef, { width }] = useMeasure<HTMLDivElement>();
  const [imagesReady, setImagesReady] = useState(false);
  const [containerHeight, setContainerHeight] = useState(0);
  const [canAnimate, setCanAnimate] = useState(delayAnimation === 0);

  const getInitialPosition = (item: GridItem) => {
    const containerRect = containerRef.current?.getBoundingClientRect();
    if (!containerRect) return { x: item.x, y: item.y };

    let direction = animateFrom;
    if (animateFrom === 'random') {
      const dirs = ['top', 'bottom', 'left', 'right'];
      direction = dirs[Math.floor(Math.random() * dirs.length)] as typeof animateFrom;
    }

    switch (direction) {
      case 'top':
        return { x: item.x, y: -200 };
      case 'bottom':
        return { x: item.x, y: window.innerHeight + 200 };
      case 'left':
        return { x: -200, y: item.y };
      case 'right':
        return { x: window.innerWidth + 200, y: item.y };
      case 'center':
        return {
          x: containerRect.width / 2 - item.w / 2,
          y: containerRect.height / 2 - item.h / 2
        };
      default:
        return { x: item.x, y: item.y + 100 };
    }
  };

  useEffect(() => {
    console.log('Preloading images:', items.map(i => i.img));
    preloadImages(items.map(i => i.img)).then(() => {
      console.log('Images preloaded successfully');
      setImagesReady(true);
    });
  }, [items]);

  // Handle animation delay
  useEffect(() => {
    if (delayAnimation > 0) {
      const timer = setTimeout(() => {
        setCanAnimate(true);
      }, delayAnimation);
      return () => clearTimeout(timer);
    }
  }, [delayAnimation]);

  const grid = useMemo<GridItem[]>(() => {
    if (!width) {
      console.log('No width available for grid calculation');
      return [];
    }
    console.log('Calculating grid with width:', width, 'columns:', columns);
    const colHeights = new Array(columns).fill(0);
    const gap = 16;
    const totalGaps = (columns - 1) * gap;
    const columnWidth = (width - totalGaps) / columns;

    const result = items.map(child => {
      const col = colHeights.indexOf(Math.min(...colHeights));
      const x = col * (columnWidth + gap);
      
      // Use the height directly as it should already be calculated from natural dimensions
      const height = child.height;
      const y = colHeights[col];

      colHeights[col] += height + gap;
      return { ...child, x, y, w: columnWidth, h: height };
    });
    
    // Calculate the total height needed for the container
    const maxHeight = Math.max(...colHeights);
    setContainerHeight(maxHeight);
    
    console.log('Grid calculated:', result);
    console.log('Container height set to:', maxHeight);
    return result;
  }, [columns, items, width]);

  const hasMounted = useRef(false);
  const previousItemIds = useRef<Set<string>>(new Set());

  useLayoutEffect(() => {
    if (!imagesReady || !canAnimate) return;

    const currentItemIds = new Set(grid.map(item => item.id));
    const newItems = grid.filter(item => !previousItemIds.current.has(item.id));
    const existingItems = grid.filter(item => previousItemIds.current.has(item.id));

    // Animate existing items to their new positions
    existingItems.forEach((item) => {
      const selector = `[data-key="${item.id}"]`;
      const animProps = { x: item.x, y: item.y, width: item.w, height: item.h };
      
      gsap.to(selector, {
        ...animProps,
        visibility: 'visible',
        duration,
        ease,
        overwrite: 'auto'
      });
    });

    // Handle new items differently based on whether it's initial load or load more
    if (!hasMounted.current) {
      // Initial load - use full GSAP animation
      newItems.forEach((item, index) => {
        const selector = `[data-key="${item.id}"]`;
        const animProps = { x: item.x, y: item.y, width: item.w, height: item.h };
        const start = getInitialPosition(item);
        
        gsap.fromTo(
          selector,
          {
            opacity: 0,
            visibility: 'visible',
            x: start.x,
            y: start.y,
            width: item.w,
            height: item.h,
            ...(blurToFocus && { filter: 'blur(10px)' })
          },
          {
            opacity: 1,
            visibility: 'visible',
            ...animProps,
            ...(blurToFocus && { filter: 'blur(0px)' }),
            duration: 0.8,
            ease: 'power3.out',
            delay: index * stagger
          }
        );
      });
    } else {
      // Load more - use custom CSS animation
      newItems.forEach((item, index) => {
        const selector = `[data-key="${item.id}"]`;
        const animProps = { x: item.x, y: item.y, width: item.w, height: item.h };
        
        // Set initial position and make visible
        gsap.set(selector, {
          ...animProps,
          opacity: 0,
          visibility: 'visible',
          scale: 0.8,
          y: item.y + 30
        });
        
        // Custom load more animation
        gsap.to(selector, {
          opacity: 1,
          scale: 1,
          y: item.y,
          duration: 0.6,
          ease: 'back.out(1.2)',
          delay: index * 0.1
        });
      });
    }

    // Update the previous item IDs for next comparison
    previousItemIds.current = currentItemIds;
    hasMounted.current = true;
  }, [grid, imagesReady, canAnimate, stagger, animateFrom, blurToFocus, duration, ease]);

  const handleMouseEnter = (id: string, element: HTMLElement) => {
    if (scaleOnHover) {
      gsap.to(`[data-key="${id}"]`, {
        scale: hoverScale,
        duration: 0.3,
        ease: 'power2.out'
      });
    }
    if (colorShiftOnHover) {
      const overlay = element.querySelector('.color-overlay') as HTMLElement;
      if (overlay) gsap.to(overlay, { opacity: 0.3, duration: 0.3 });
    }
  };

  const handleMouseLeave = (id: string, element: HTMLElement) => {
    if (scaleOnHover) {
      gsap.to(`[data-key="${id}"]`, {
        scale: 1,
        duration: 0.3,
        ease: 'power2.out'
      });
    }
    if (colorShiftOnHover) {
      const overlay = element.querySelector('.color-overlay') as HTMLElement;
      if (overlay) gsap.to(overlay, { opacity: 0, duration: 0.3 });
    }
  };

  return (
    <div 
      ref={containerRef} 
      className="relative w-full"
      style={{ height: containerHeight > 0 ? `${containerHeight}px` : 'auto' }}
    >
      {grid.map(item => (
        <div
          key={item.id}
          data-key={item.id}
          className="absolute box-content"
          style={{ 
            willChange: 'transform, width, height, opacity',
            opacity: 0,
            visibility: 'hidden'
          }}
          onClick={() => onItemClick ? onItemClick(item) : window.open(item.url, '_blank', 'noopener')}
          onMouseEnter={e => handleMouseEnter(item.id, e.currentTarget)}
          onMouseLeave={e => handleMouseLeave(item.id, e.currentTarget)}
        >
          {item.customComponent ? (
            <div className="relative w-full h-full rounded-[10px] shadow-[0px_10px_50px_-10px_rgba(0,0,0,0.2)] overflow-hidden">
              {item.customComponent}
            </div>
          ) : (
            <div
              className="relative w-full h-full bg-contain bg-center bg-no-repeat rounded-[10px] shadow-[0px_10px_50px_-10px_rgba(0,0,0,0.2)] uppercase text-[10px] leading-[10px]"
              style={{ backgroundImage: `url(${item.img})` }}
            >
              <img 
                src={item.img} 
                alt={`Gallery image ${item.id}`}
                className="w-full h-full object-contain rounded-[10px] opacity-0"
                onLoad={(e) => {
                  console.log('Image loaded:', item.img);
                  e.currentTarget.style.opacity = '1';
                }}
                onError={() => {
                  console.error('Image failed to load:', item.img);
                }}
              />
              {colorShiftOnHover && (
                <div className="color-overlay absolute inset-0 rounded-[10px] bg-gradient-to-tr from-pink-500/50 to-sky-500/50 opacity-0 pointer-events-none" />
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default Masonry;
