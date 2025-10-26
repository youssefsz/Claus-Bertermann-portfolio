import React, { useState, useRef } from 'react';
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
  onImageClick
}: ImageMagnifierProps) {
  const [internalShowMagnifier, setInternalShowMagnifier] = useState(false);
  const [[imgWidth, imgHeight], setSize] = useState([0, 0]);
  const [[x, y], setXY] = useState([0, 0]);
  const imageRef = useRef<HTMLImageElement>(null);
  
  // Use controlled or internal state
  const isMagnifierVisible = controlledShowMagnifier !== undefined 
    ? controlledShowMagnifier 
    : internalShowMagnifier;

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
        className={`${className} cursor-zoom-in transition-transform duration-300 group-hover:scale-[1.02]`}
        width={width}
        height={height}
        alt={alt}
        onMouseEnter={mouseEnter}
        onMouseLeave={mouseLeave}
        onMouseMove={mouseMove}
        onClick={handleImageClick}
        whileHover={{ scale: 1.02 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
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
