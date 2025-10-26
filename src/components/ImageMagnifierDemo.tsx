import React from 'react';
import ImageMagnifier from './ImageMagnifier';

interface ImageMagnifierDemoProps {
  src: string;
  alt: string;
  className?: string;
  width?: number | string;
  height?: number | string;
}

/**
 * Demo component showcasing the ImageMagnifier functionality
 * This can be used as a standalone example or for testing
 */
export default function ImageMagnifierDemo({ 
  src, 
  alt, 
  className = '', 
  width, 
  height 
}: ImageMagnifierDemoProps) {
  const handleImageClick = (imageSrc: string, imageAlt: string) => {
    console.log('Image clicked:', imageSrc, imageAlt);
    // You can add modal opening logic here if needed
  };

  return (
    <div className="p-8 bg-gray-100 rounded-lg">
      <h3 className="text-xl font-semibold mb-4 text-gray-800">
        Image Magnifier Demo
      </h3>
      <p className="text-gray-600 mb-6">
        Hover over the image to see the magnifier effect. Click to trigger the onImageClick callback.
      </p>
      
      <div className="flex justify-center">
        <ImageMagnifier
          src={src}
          alt={alt}
          className={`${className} rounded-lg shadow-lg`}
          width={width}
          height={height}
          magnifierHeight={200}
          magnifierWidth={200}
          zoomLevel={2.5}
          onImageClick={handleImageClick}
        />
      </div>
      
      <div className="mt-6 text-sm text-gray-500">
        <p><strong>Features:</strong></p>
        <ul className="list-disc list-inside mt-2 space-y-1">
          <li>Circular magnifier lens with smooth animations</li>
          <li>Customizable zoom level and magnifier size</li>
          <li>Hover to activate magnifier</li>
          <li>Click to trigger custom callback</li>
          <li>Responsive design with mobile optimization</li>
          <li>Beautiful glow effects and transitions</li>
        </ul>
      </div>
    </div>
  );
}
