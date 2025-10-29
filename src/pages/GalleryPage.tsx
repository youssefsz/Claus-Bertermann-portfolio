import { useState, useEffect } from 'react';
import { X, ZoomIn } from 'lucide-react';
import { Helmet } from 'react-helmet-async';
import { useLanguage } from '../context/LanguageContext';
import Masonry from '../components/Masonry';
import SplitText from '../components/SplitText';
import ImageMagnifier from '../components/ImageMagnifier';

/**
 * Loads an image and returns its natural dimensions
 * @param src - Image source URL
 * @returns Promise that resolves with the image dimensions
 */
const loadImageDimensions = (src: string): Promise<{ width: number; height: number }> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      resolve({ width: img.naturalWidth, height: img.naturalHeight });
    };
    img.onerror = reject;
    img.src = src;
  });
};

/**
 * Preloads an image for faster display
 * @param src - Image source URL
 * @returns Promise that resolves when image is loaded
 */
const preloadImage = (src: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve();
    img.onerror = () => reject(new Error(`Failed to load image: ${src}`));
    img.src = src;
  });
};

export default function GalleryPage() {
  const { t, remountKey } = useLanguage();
  const [selectedImage, setSelectedImage] = useState<{img: string, title: string, medium: string, dimensions: string, fallbackImg?: string} | null>(null);
  const [imageDimensions, setImageDimensions] = useState<Record<string, { width: number; height: number }>>({});
  const [showMagnifier, setShowMagnifier] = useState(false);
  const [imageLoadError, setImageLoadError] = useState(false);
  const [isImageLoading, setIsImageLoading] = useState(false);
  const [preloadedImages, setPreloadedImages] = useState<Set<string>>(new Set());
  const [visibleImagesCount, setVisibleImagesCount] = useState(6);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  // First: list images where img and popupImg are different (low-res -> high-res)
  // Then: list images where both img and popupImg are the same (high-res only)

  const galleryImagesList = [
    {
      id: "23EB",
      title: "23EB#CB – 2023",
      dimensions: "160 × 150 cm",
      medium: t('oilOnCanvas'),
      img: "/gallery/low-res/23EB-CB.jpg",
      popupImg: "/gallery/high-res/23EB-CB.jpg",
      url: "#",
    },
    {
      id: "24GD",
      title: "24GD#CB – 2023",
      dimensions: "240 × 130 cm",
      medium: t('oilOnCanvas'),
      img: "/gallery/low-res/24GD-CB.jpg",
      popupImg: "/gallery/high-res/24GD-CB.jpg",
      url: "#",
    },
    {
      id: "34NH",
      title: "34NH#CB – 2025",
      dimensions: "150 × 150 cm",
      medium: t('oilOnCanvas'),
      img: "/gallery/low-res/34NH-CB.jpg",
      popupImg: "/gallery/high-res/34NH-CB.jpg",
      url: "#",
    },
    {
      id: "7Z2Q",
      title: "7Z2Q#CB – 2024",
      dimensions: "210 × 150 cm",
      medium: t('oilOnCanvas'),
      img: "/gallery/low-res/7Z2Q-CB.jpg",
      popupImg: "/gallery/high-res/7Z2Q-CB.jpg",
      url: "#",
    },
    {
      id: "7Z87",
      title: "7Z87#CB – 2025",
      dimensions: "300 × 150 cm",
      medium: t('oilOnCanvas'),
      img: "/gallery/low-res/7Z87-CB.jpg",
      popupImg: "/gallery/high-res/7Z87-CB.jpg",
      url: "#",
    },
    {
      id: "91UI",
      title: "91UI#CB – 2023",
      dimensions: "130 × 80 cm",
      medium: t('oilOnCanvas'),
      img: "/gallery/low-res/91UI-CB.jpg",
      popupImg: "/gallery/high-res/91UI-CB.jpg",
      url: "#",
    },
    {
      id: "9BE4",
      title: "9BE4#CB – 2025",
      dimensions: "130 × 80 cm",
      medium: t('oilOnCanvas'),
      img: "/gallery/low-res/9BE4-CB.jpg",
      popupImg: "/gallery/high-res/9BE4-CB.jpg",
      url: "#",
    },
    {
      id: "9DNL",
      title: "9DNL#CB – 2024",
      dimensions: "150 × 150 cm",
      medium: t('oilOnCanvas'),
      img: "/gallery/low-res/9DNL-CB.jpg",
      popupImg: "/gallery/high-res/9DNL-CB.jpg",
      url: "#",
    },
    {
      id: "9ENL",
      title: "9ENL#CB – 2024",
      dimensions: "150 × 150 cm",
      medium: t('oilOnCanvas'),
      img: "/gallery/low-res/9ENL-CB.jpg",
      popupImg: "/gallery/high-res/9ENL-CB.jpg",
      url: "#",
    },
    {
      id: "GCOW",
      title: "GCOW#CB – 2024",
      dimensions: "150 × 150 cm",
      medium: t('oilOnCanvas'),
      img: "/gallery/low-res/GCOW-CB.jpg",
      popupImg: "/gallery/high-res/GCOW-CB.jpg",
      url: "#",
    },
    {
      id: "IS33",
      title: "IS33#CB – 2021",
      dimensions: "250 × 150 cm",
      medium: t('oilOnCanvas'),
      img: "/gallery/low-res/IS33-CB.jpg",
      popupImg: "/gallery/high-res/IS33-CB.jpg",
      url: "#",
    },
    {
      id: "J20F",
      title: "J20F#CB – 2023",
      dimensions: "180 × 150 cm",
      medium: t('oilOnCanvas'),
      img: "/gallery/low-res/J20F-CB.jpg",
      popupImg: "/gallery/high-res/J20F-CB.jpg",
      url: "#",
    },
    {
      id: "MQQ1",
      title: "MQQ1#CB – 2022",
      dimensions: "180 × 150 cm",
      medium: t('oilOnCanvas'),
      img: "/gallery/low-res/MQQ1-CB.jpg",
      popupImg: "/gallery/high-res/MQQ1-CB.jpg",
      url: "#",
    },
    {
      id: "TGB2",
      title: "TGB2#CB – 2024",
      dimensions: "150 × 140 cm",
      medium: t('oilOnCanvas'),
      img: "/gallery/low-res/TGB2-CB.jpg",
      popupImg: "/gallery/high-res/TGB2-CB.jpg",
      url: "#",
    },
    {
      id: "U322",
      title: "U322#CB – 2025",
      dimensions: "200 × 130 cm",
      medium: t('oilOnCanvas'),
      img: "/gallery/low-res/U322-CB.jpg",
      popupImg: "/gallery/high-res/U322-CB.jpg",
      url: "#",
    },

    // Now all images where img===popupImg and both are high-res
    {
      id: "033F",
      title: "033F#CB – 2024",
      dimensions: "240 × 150 cm",
      medium: t('oilOnCanvas'),
      img: "/gallery/low-res/033F-CB.jpg",
      popupImg: "/gallery/high-res/033F-CB.jpg",
      url: "#",
    },
    {
      id: "03NR",
      title: "03NR#CB – 2024",
      dimensions: "170 × 150 cm",
      medium: t('oilOnCanvas'),
      img: "/gallery/low-res/03NR-CB.jpg",
      popupImg: "/gallery/high-res/03NR-CB.jpg",
      url: "#",
    },
    {
      id: "129G",
      title: "129G#CB – 2024",
      dimensions: "150 × 150 cm",
      medium: t('oilOnCanvas'),
      img: "/gallery/low-res/129G-CB.jpg",
      popupImg: "/gallery/high-res/129G-CB.jpg",
      url: "#",
    },
    {
      id: "35NH",
      title: "35NH#CB – 2025",
      dimensions: "150 × 150 cm",
      medium: t('oilOnCanvas'),
      img: "/gallery/low-res/35NH-CB.jpg",
      popupImg: "/gallery/high-res/35NH-CB.jpg",
      url: "#",
    },
    {
      id: "392C",
      title: "392C#CB – 2023",
      dimensions: "170 × 150 cm",
      medium: t('oilOnCanvas'),
      img: "/gallery/low-res/392C-CB.jpg",
      popupImg: "/gallery/high-res/392C-CB.jpg",
      url: "#",
    },
    {
      id: "44B9",
      title: "44B9#CB – 2024",
      dimensions: "150 × 150 cm",
      medium: t('oilOnCanvas'),
      img: "/gallery/low-res/44B9-CB.jpg",
      popupImg: "/gallery/high-res/44B9-CB.jpg",
      url: "#",
    },
    {
      id: "7CBB",
      title: "7CBB#CB – 2024",
      dimensions: "220 × 150 cm",
      medium: t('oilOnCanvas'),
      img: "/gallery/low-res/7CBB-CB.jpg",
      popupImg: "/gallery/high-res/7CBB-CB.jpg",
      url: "#",
    },
    {
      id: "7Z89",
      title: "7Z89#CB – 2025",
      dimensions: "340 × 200 cm",
      medium: t('oilOnCanvas'),
      img: "/gallery/low-res/7Z89-CB.jpg",
      popupImg: "/gallery/high-res/7Z89-CB.jpg",
      url: "#",
    },
    {
      id: "8FJ3",
      title: "8FJ3#CB – 2025",
      dimensions: "200 × 130 cm",
      medium: t('oilOnCanvas'),
      img: "/gallery/low-res/8FJ3-CB.jpg",
      popupImg: "/gallery/high-res/8FJ3-CB.jpg",
      url: "#",
    },
    {
      id: "9BE3",
      title: "9BE3#CB – 2025",
      dimensions: "130 × 80 cm",
      medium: t('oilOnCanvas'),
      img: "/gallery/low-res/9BE3-CB.jpg",
      popupImg: "/gallery/high-res/9BE3-CB.jpg",
      url: "#",
    },
    {
      id: "B330",
      title: "B330#CB – 2024",
      dimensions: "150 × 150 cm",
      medium: t('oilOnCanvas'),
      img: "/gallery/low-res/B330-CB.jpg",
      popupImg: "/gallery/high-res/B330-CB.jpg",
      url: "#",
    },
    {
      id: "BBQD",
      title: "BBQD#CB – 2024",
      dimensions: "150 × 150 cm",
      medium: t('oilOnCanvas'),
      img: "/gallery/low-res/BBQD-CB.jpg",
      popupImg: "/gallery/high-res/BBQD-CB.jpg",
      url: "#",
    },
    {
      id: "BCZ6",
      title: "BCZ6#CB – 2023",
      dimensions: "150 × 110 cm",
      medium: t('oilOnCanvas'),
      img: "/gallery/low-res/BCZ6-CB.jpg",
      popupImg: "/gallery/high-res/BCZ6-CB.jpg",
      url: "#",
    },
    {
      id: "FJ34",
      title: "FJ34#CB – 2024",
      dimensions: "200 × 130 cm",
      medium: t('oilOnCanvas'),
      img: "/gallery/low-res/FJ34-CB.jpg",
      popupImg: "/gallery/high-res/FJ34-CB.jpg",
      url: "#",
    },
    {
      id: "H232",
      title: "H232#CB – 2024",
      dimensions: "150 × 150 cm",
      medium: t('oilOnCanvas'),
      img: "/gallery/low-res/H232-CB.jpg",
      popupImg: "/gallery/high-res/H232-CB.jpg",
      url: "#",
    },
    {
      id: "HE88",
      title: "HE88#CB – 2024",
      dimensions: "150 × 120 cm",
      medium: t('oilOnCanvas'),
      img: "/gallery/low-res/HE88-CB.jpg",
      popupImg: "/gallery/high-res/HE88-CB.jpg",
      url: "#",
    },
    {
      id: "MQQ2",
      title: "MQQ2#CB – 2022",
      dimensions: "180 × 150 cm",
      medium: t('oilOnCanvas'),
      img: "/gallery/low-res/MQQ2-CB.jpg",
      popupImg: "/gallery/high-res/MQQ2-CB.jpg",
      url: "#",
    },
    {
      id: "N339",
      title: "N339#CB – 2023",
      dimensions: "170 × 150 cm",
      medium: t('oilOnCanvas'),
      img: "/gallery/low-res/N339-CB.jpg",
      popupImg: "/gallery/high-res/N339-CB.jpg",
      url: "#",
    },
    {
      id: "N93B",
      title: "N93B#CB – 2024",
      dimensions: "170 × 150 cm",
      medium: t('oilOnCanvas'),
      img: "/gallery/low-res/N93B-CB.jpg",
      popupImg: "/gallery/high-res/N93B-CB.jpg",
      url: "#",
    },
    {
      id: "QW2W",
      title: "QW2W#CB – 2021",
      dimensions: "200 × 200 cm",
      medium: t('oilOnCanvas'),
      img: "/gallery/low-res/QW2W-CB.jpg",
      popupImg: "/gallery/high-res/QW2W-CB.jpg",
      url: "#",
    },
    {
      id: "S882",
      title: "S882#CB – 2024",
      dimensions: "180 × 150 cm",
      medium: t('oilOnCanvas'),
      img: "/gallery/low-res/S882-CB.jpg",
      popupImg: "/gallery/high-res/S882-CB.jpg",
      url: "#",
    },
    {
      id: "S883",
      title: "S883#CB – 2024",
      dimensions: "180 × 150 cm",
      medium: t('oilOnCanvas'),
      img: "/gallery/low-res/S883-CB.jpg",
      popupImg: "/gallery/high-res/S883-CB.jpg",
      url: "#",
    },
    {
      id: "T5Z3",
      title: "T5Z3#CB – 2023",
      dimensions: "170 × 130 cm",
      medium: t('oilOnCanvas'),
      img: "/gallery/low-res/T5Z3-CB.jpg",
      popupImg: "/gallery/high-res/T5Z3-CB.jpg",
      url: "#",
    },
    {
      id: "TGB1",
      title: "TGB1#CB – 2024",
      dimensions: "150 × 140 cm",
      medium: t('oilOnCanvas'),
      img: "/gallery/low-res/TGB1-CB.jpg",
      popupImg: "/gallery/high-res/TGB1-CB.jpg",
      url: "#",
    },
    {
      id: "VQ3N",
      title: "VQ3N#CB – 2024",
      dimensions: "240 × 150 cm",
      medium: t('oilOnCanvas'),
      img: "/gallery/low-res/VQ3N-CB.jpg",
      popupImg: "/gallery/high-res/VQ3N-CB.jpg",
      url: "#",
    },
    {
      id: "Z2MF",
      title: "Z2MF#CB – 2023",
      dimensions: "180 × 130 cm",
      medium: t('oilOnCanvas'),
      img: "/gallery/low-res/Z2MF-CB.jpg",
      popupImg: "/gallery/high-res/Z2MF-CB.jpg",
      url: "#",
    },
  ];

  // Load image dimensions for visible images only
  useEffect(() => {
    const loadVisibleDimensions = async () => {
      const dimensionsMap: Record<string, { width: number; height: number }> = {};
      const visibleImages = galleryImagesList.slice(0, visibleImagesCount);
      
      await Promise.all(
        visibleImages.map(async (image) => {
          try {
            const dimensions = await loadImageDimensions(image.img);
            dimensionsMap[image.id] = dimensions;
          } catch (error) {
            console.error(`Failed to load dimensions for image ${image.id}:`, error);
            // Fallback to default aspect ratio if image fails to load
            dimensionsMap[image.id] = { width: 600, height: 600 };
          }
        })
      );
      
      setImageDimensions(prev => ({ ...prev, ...dimensionsMap }));
    };

    loadVisibleDimensions();
  }, [visibleImagesCount]); // eslint-disable-line react-hooks/exhaustive-deps

  // Preload HQ images for visible images only
  useEffect(() => {
    const preloadVisibleHQImages = async () => {
      const visibleImages = galleryImagesList.slice(0, visibleImagesCount);
      const hqImages = visibleImages
        .filter(image => image.popupImg && image.popupImg !== image.img)
        .map(image => image.popupImg!);

      // Preload images in batches to avoid overwhelming the browser
      const batchSize = 3;
      for (let i = 0; i < hqImages.length; i += batchSize) {
        const batch = hqImages.slice(i, i + batchSize);
        await Promise.allSettled(
          batch.map(async (src) => {
            try {
              await preloadImage(src);
              setPreloadedImages(prev => new Set([...prev, src]));
              console.log(`Preloaded HQ image: ${src}`);
            } catch (error) {
              console.warn(`Failed to preload HQ image: ${src}`, error);
            }
          })
        );
        
        // Small delay between batches to prevent blocking
        if (i + batchSize < hqImages.length) {
          await new Promise(resolve => setTimeout(resolve, 100));
        }
      }
    };

    preloadVisibleHQImages();
  }, [visibleImagesCount]); // eslint-disable-line react-hooks/exhaustive-deps

  // Calculate heights based on actual image dimensions for visible images only
  const visibleImages = galleryImagesList.slice(0, visibleImagesCount);
  const galleryImages = visibleImages.map(image => {
    const dimensions = imageDimensions[image.id];
    let height = 400; // Default height
    
    if (dimensions) {
      // Calculate height to maintain aspect ratio at base width of 400px
      const aspectRatio = dimensions.height / dimensions.width;
      height = 400 * aspectRatio;
    }
    
    return {
      ...image,
      height: height,
    };
  });

  // Load more images function
  const handleLoadMore = async () => {
    setIsLoadingMore(true);
    
    const newCount = Math.min(visibleImagesCount + 6, galleryImagesList.length);
    console.log('Loading more images. Current count:', visibleImagesCount, 'New count:', newCount);
    
    // Get the new images that will be loaded
    const newImages = galleryImagesList.slice(visibleImagesCount, newCount);
    
    // Load dimensions for the new images
    const loadNewImageDimensions = async () => {
      const dimensionsMap: Record<string, { width: number; height: number }> = {};
      
      await Promise.all(
        newImages.map(async (image) => {
          try {
            const dimensions = await loadImageDimensions(image.img);
            dimensionsMap[image.id] = dimensions;
          } catch (error) {
            console.error(`Failed to load dimensions for image ${image.id}:`, error);
            // Fallback to default aspect ratio if image fails to load
            dimensionsMap[image.id] = { width: 600, height: 600 };
          }
        })
      );
      
      return dimensionsMap;
    };
    
    // Wait for all new image dimensions to load
    const newDimensions = await loadNewImageDimensions();
    
    // Update the visible count and dimensions
    setImageDimensions(prev => ({ ...prev, ...newDimensions }));
    setVisibleImagesCount(newCount);
    
    // Stop loading animation after images are fully loaded
    setIsLoadingMore(false);
  };

  // Check if there are more images to load
  const hasMoreImages = visibleImagesCount < galleryImagesList.length;

  // Debug logging
  console.log('Gallery Debug:', {
    visibleImagesCount,
    totalImages: galleryImagesList.length,
    galleryImagesLength: galleryImages.length,
    hasMoreImages
  });

  return (
    <>
      <Helmet>
        <title>{t('gallery')} | Claus Bertermann Digital Canvas Portfolio</title>
        <meta name="description" content="Explore Claus Bertermann's digital art gallery featuring contemporary abstract paintings, oil on canvas works, and creative digital art pieces from 2018-2025." />
        <meta name="keywords" content="digital art gallery, Claus Bertermann, contemporary art, digital canvas, art portfolio, modern art, creative works" />
        
        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://clausbertermann.com/gallery" />
        <meta property="og:title" content={`${t('gallery')} | Claus Bertermann Digital Canvas Portfolio`} />
        <meta property="og:description" content="Explore Claus Bertermann's digital art gallery featuring contemporary abstract paintings, oil on canvas works, and creative digital art pieces from 2018-2025." />
        <meta property="og:image" content="/gallery/low-res/033F-CB.jpg" />
        
        {/* Twitter */}
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content="https://clausbertermann.com/gallery" />
        <meta property="twitter:title" content={`${t('gallery')} | Claus Bertermann Digital Canvas Portfolio`} />
        <meta property="twitter:description" content="Explore Claus Bertermann's digital art gallery featuring contemporary abstract paintings, oil on canvas works, and creative digital art pieces from 2018-2025." />
        <meta property="twitter:image" content="/gallery/low-res/033F-CB.jpg" />
        
        {/* Canonical URL */}
        <link rel="canonical" href="https://clausbertermann.com/gallery" />
      </Helmet>
      
      <div className="min-h-screen pt-32 pb-24 px-6 md:px-12">
      <div className="max-w-screen-2xl mx-auto">
        <SplitText
          key={`gallery-${remountKey}`}
          text={t('gallery')}
          className="text-5xl md:text-7xl lg:text-8xl font-bold text-white mb-20 tracking-tight"
          delay={100}
          duration={0.6}
          ease="power3.out"
          splitType="chars"
          from={{ opacity: 0, y: 40 }}
          to={{ opacity: 1, y: 0 }}
          threshold={0.1}
          rootMargin="-100px"
          textAlign="center"
        />

        <div className="relative">
          <Masonry
            items={galleryImages}
            ease="power3.out"
            duration={0.6}
            stagger={0.05}
            animateFrom="center"
            scaleOnHover={true}
            hoverScale={0.95}
            blurToFocus={true}
            colorShiftOnHover={false}
            delayAnimation={700}
            onItemClick={async (item) => {
              setImageLoadError(false); // Reset error state
              setIsImageLoading(true); // Start loading state
              
              const popupImg = item.popupImg || item.img;
              const isPreloaded = preloadedImages.has(popupImg);
              
              // If image is not preloaded, try to preload it quickly
              if (!isPreloaded && item.popupImg) {
                try {
                  await preloadImage(popupImg);
                  setPreloadedImages(prev => new Set([...prev, popupImg]));
                } catch (error) {
                  console.warn(`Failed to preload popup image: ${popupImg}`, error);
                }
              }
              
              setSelectedImage({
                img: popupImg, // Use popupImg if available, fallback to regular img
                fallbackImg: item.img, // Store original img as fallback
                title: item.title || '',
                medium: item.medium || '',
                dimensions: item.dimensions || ''
              });
              
              // Reset loading state after a short delay to allow for smooth transition
              // This will be overridden by the onLoad callback if the image loads quickly
              setTimeout(() => setIsImageLoading(false), 500);
            }}
          />
          
          {/* Load More Button */}
          {hasMoreImages && (
            <div className="flex justify-center mt-16">
              <button
                onClick={handleLoadMore}
                disabled={isLoadingMore}
                className="group relative px-8 py-4 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full text-white font-medium text-lg transition-all duration-300 hover:bg-white/20 hover:scale-105 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
              >
                {isLoadingMore ? (
                  <div className="flex items-center gap-3">
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    <span>Loading...</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-3">
                    <span>Load More Images</span>
                    <div className="w-2 h-2 bg-white rounded-full group-hover:scale-150 transition-transform duration-300"></div>
                  </div>
                )}
              </button>
            </div>
          )}
        </div>
      </div>

      {selectedImage && (
        <div
          className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex items-center justify-center p-6"
          onClick={() => {
            setSelectedImage(null);
            setShowMagnifier(false);
          }}
        >
          {/* Close Button */}
          <button
            className="absolute top-6 right-6 text-white hover:scale-110 transition-transform p-2 z-10"
            onClick={() => {
              setSelectedImage(null);
              setShowMagnifier(false);
            }}
            title="Close image"
            aria-label="Close image"
          >
            <X size={32} />
          </button>

          {/* Magnifier Toggle Button */}
          <button
            className="absolute top-6 left-6 text-white hover:scale-110 transition-transform p-2 z-10 bg-white/10 backdrop-blur-sm rounded-full hover:bg-white/20"
            onClick={(e) => {
              e.stopPropagation();
              setShowMagnifier(!showMagnifier);
            }}
            title={showMagnifier ? "Disable magnifier" : "Enable magnifier"}
          >
            <ZoomIn size={24} />
          </button>

          <div className="flex flex-col lg:flex-row items-center justify-center gap-8 max-w-7xl w-full">
            <div className="flex-1 flex justify-center relative">
              {/* Loading indicator */}
              {isImageLoading && (
                <div className="absolute inset-0 flex items-center justify-center z-20">
                  <div className="w-16 h-16 border-4 border-white/20 border-t-white rounded-full animate-spin"></div>
                </div>
              )}
              
              <div onClick={(e) => e.stopPropagation()} className="relative">
                <ImageMagnifier
                  src={imageLoadError && selectedImage.fallbackImg ? selectedImage.fallbackImg : selectedImage.img}
                  alt="Zoomed painting"
                  className={`max-w-full max-h-[80vh] object-contain rounded-2xl transition-all duration-300 ${
                    isImageLoading ? 'opacity-50 blur-sm' : 'opacity-100 blur-0'
                  }`}
                  magnifierHeight={250}
                  magnifierWidth={250}
                  zoomLevel={3}
                  showMagnifier={showMagnifier && !isImageLoading}
                  onImageClick={() => setShowMagnifier(!showMagnifier)}
                  onLoad={() => setIsImageLoading(false)}
                  onError={() => {
                    if (!imageLoadError && selectedImage.fallbackImg) {
                      setImageLoadError(true);
                    }
                    setIsImageLoading(false);
                  }}
                />
              </div>
            </div>
            <div className="flex-1 max-w-md text-white space-y-4">
              <h2 className="text-3xl lg:text-4xl font-bold tracking-tight">
                {selectedImage.title}
              </h2>
              <div className="space-y-2 text-lg">
                <p className="text-gray-300">
                  {selectedImage.medium}
                </p>
                <p className="text-gray-300">
                  {selectedImage.dimensions}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
    </>
  );
}