import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ImageMagnifier from './ImageMagnifier';

interface ImageModalProps {
  isOpen: boolean;
  onClose: () => void;
  imageSrc: string;
  imageAlt: string;
}

export default function ImageModal({ isOpen, onClose, imageSrc, imageAlt }: ImageModalProps) {
  const [showMagnifier, setShowMagnifier] = useState(false);

  // Close modal on Escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      // Prevent body scroll when modal is open
      document.body.style.overflow = 'hidden';
    } else {
      // Reset magnifier state when modal is closed
      setShowMagnifier(false);
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
      >
        {/* Backdrop */}
        <div 
          className="absolute inset-0 bg-black/90 backdrop-blur-sm" 
          onClick={() => {
            onClose();
            setShowMagnifier(false);
          }}
        />
        
        {/* Modal Content */}
        <motion.div
          className="relative max-w-[95vw] max-h-[95vh] w-full h-full flex items-center justify-center p-4 pointer-events-none"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.8, opacity: 0 }}
          transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          {/* Close Button */}
          <button
            onClick={() => {
              onClose();
              setShowMagnifier(false);
            }}
            className="absolute top-4 right-4 z-10 w-10 h-10 bg-white/10 backdrop-blur-sm text-white rounded-full flex items-center justify-center hover:bg-white/20 transition-colors duration-300 pointer-events-auto"
            aria-label="Close image"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>

          {/* Image with Magnifier */}
          <div className="relative w-full h-full flex items-center justify-center">
            <div className="relative max-w-full max-h-full">
              <ImageMagnifier
                src={imageSrc}
                alt={imageAlt}
                className="max-w-[calc(95vw-2rem)] max-h-[calc(95vh-2rem)] w-auto h-auto object-contain rounded-lg shadow-2xl pointer-events-auto"
                magnifierHeight={250}
                magnifierWidth={250}
                zoomLevel={3}
                showMagnifier={showMagnifier}
                onImageClick={() => setShowMagnifier(!showMagnifier)}
              />
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
