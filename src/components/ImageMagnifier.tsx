import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';

interface ImageMagnifierProps {
  src: string;
  alt: string;
  className?: string;
  width?: number | string;
  height?: number | string;
  magnifierHeight?: number;
  magnifierWidth?: number;
  zoomLevel?: number;
  showMagnifier?: boolean;
  magnifierStyle?: React.CSSProperties;
  onImageClick?: (src: string, alt: string) => void;
  onError?: () => void;
  onLoad?: () => void;
}

export default function ImageMagnifier({
  src,
  alt,
  className = '',
  width,
  height,
  magnifierHeight = 150,
  magnifierWidth = 150,
  zoomLevel = 2.5,
  showMagnifier: controlledShowMagnifier,
  magnifierStyle = {},
  onImageClick,
  onError,
  onLoad
}: ImageMagnifierProps) {
  const [internalShowMagnifier, setInternalShowMagnifier] = useState(false);
  const [[imgWidth, imgHeight], setSize] = useState([0, 0]);
  const [[x, y], setXY] = useState([0, 0]);
  const [isScrolling, setIsScrolling] = useState(false);
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  const imageRef = useRef<HTMLImageElement>(null);
  const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  // Use controlled or internal state, but disable during scrolling
  const isMagnifierVisible = (controlledShowMagnifier !== undefined 
    ? controlledShowMagnifier 
    : internalShowMagnifier) && !isScrolling;

  const mouseEnter = (e: React.MouseEvent<HTMLImageElement>) => {
    const el = e.currentTarget;
    const { width, height } = el.getBoundingClientRect();
    setSize([width, height]);
    if (controlledShowMagnifier === undefined) {
      setInternalShowMagnifier(true);
    }
  };

  const mouseLeave = (e: React.MouseEvent<HTMLImageElement>) => {
    e.preventDefault();
    if (controlledShowMagnifier === undefined) {
      setInternalShowMagnifier(false);
    }
  };

  const mouseMove = (e: React.MouseEvent<HTMLImageElement>) => {
    const el = e.currentTarget;
    const { top, left } = el.getBoundingClientRect();

    const x = e.pageX - left - window.scrollX;
    const y = e.pageY - top - window.scrollY;

    setXY([x, y]);
  };

  const handleImageClick = () => {
    if (onImageClick) {
      onImageClick(src, alt);
    }
  };

  const handleImageLoad = () => {
    setIsImageLoaded(true);
    if (onLoad) {
      onLoad();
    }
  };

  // Handle scroll detection
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolling(true);
      
      // Clear existing timeout
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
      
      // Set timeout to detect when scrolling stops
      scrollTimeoutRef.current = setTimeout(() => {
        setIsScrolling(false);
      }, 150); // 150ms delay after scroll stops
    };

    // Add scroll event listener
    window.addEventListener('scroll', handleScroll, { passive: true });
    
    // Cleanup
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
    };
  }, []);

  // Calculate magnifier position to keep it within bounds
  const magnifierX = Math.max(
    magnifierWidth / 2,
    Math.min(x, imgWidth - magnifierWidth / 2)
  );
  const magnifierY = Math.max(
    magnifierHeight / 2,
    Math.min(y, imgHeight - magnifierHeight / 2)
  );

  return (
    <div className="relative inline-block group">
      <motion.img
        ref={imageRef}
        src={src}
        className={`${className} cursor-zoom-in transition-all duration-300 group-hover:scale-[1.02] image-optimized ${
          isImageLoaded ? 'image-loaded' : 'image-loading'
        }`}
        width={width}
        height={height}
        alt={alt}
        onMouseEnter={mouseEnter}
        onMouseLeave={mouseLeave}
        onMouseMove={mouseMove}
        onClick={handleImageClick}
        onError={onError}
        onLoad={handleImageLoad}
        whileHover={{ scale: 1.02 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        loading="eager"
        decoding="async"
      />
      
      {/* Magnifier */}
      <motion.div
        style={{
          display: isMagnifierVisible ? 'block' : 'none',
          position: 'absolute',
          pointerEvents: 'none',
          height: `${magnifierHeight}px`,
          width: `${magnifierWidth}px`,
          opacity: isMagnifierVisible ? 1 : 0,
          border: '3px solid rgba(255, 255, 255, 0.8)',
          backgroundColor: 'white',
          borderRadius: '50%',
          backgroundImage: `url('${src}')`,
          backgroundRepeat: 'no-repeat',
          top: `${magnifierY - magnifierHeight / 2}px`,
          left: `${magnifierX - magnifierWidth / 2}px`,
          backgroundSize: `${imgWidth * zoomLevel}px ${imgHeight * zoomLevel}px`,
          backgroundPositionX: `${-x * zoomLevel + magnifierWidth / 2}px`,
          backgroundPositionY: `${-y * zoomLevel + magnifierHeight / 2}px`,
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3), 0 0 0 1px rgba(255, 255, 255, 0.1)',
          backdropFilter: 'blur(1px)',
          zIndex: 10,
          ...magnifierStyle
        }}
        initial={{ scale: 0, opacity: 0 }}
        animate={{ 
          scale: isMagnifierVisible ? 1 : 0, 
          opacity: isMagnifierVisible ? 1 : 0 
        }}
        transition={{ 
          duration: 0.2, 
          ease: "easeOut",
          scale: { duration: 0.15 }
        }}
      />
      
      {/* Magnifier border glow effect */}
      <motion.div
        style={{
          display: isMagnifierVisible ? 'block' : 'none',
          position: 'absolute',
          pointerEvents: 'none',
          height: `${magnifierHeight + 8}px`,
          width: `${magnifierWidth + 8}px`,
          top: `${magnifierY - (magnifierHeight + 8) / 2}px`,
          left: `${magnifierX - (magnifierWidth + 8) / 2}px`,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(132, 0, 255, 0.3) 0%, transparent 70%)',
          zIndex: 9,
        }}
        initial={{ scale: 0, opacity: 0 }}
        animate={{ 
          scale: isMagnifierVisible ? 1 : 0, 
          opacity: isMagnifierVisible ? 1 : 0 
        }}
        transition={{ 
          duration: 0.2, 
          ease: "easeOut",
          scale: { duration: 0.15 }
        }}
      />
    </div>
  );
}
