import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { Artwork } from '../types';
import Masonry from './Masonry';
import PixelTransition from './imgPixelTransition';
import SplitText from './SplitText';

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

export default function AuctionedWorksPage() {
  const { t } = useLanguage();
  const [selectedWork, setSelectedWork] = useState<Artwork | null>(null);
  const [imageDimensions, setImageDimensions] = useState<Record<string, { width: number; height: number }>>({});

  const auctionedWorks: Artwork[] = [
    {
      id: '1',
      title: 'PFKS#CB',
      dimensions: '130 × 130 cm',
      medium: t('oilOnCanvas'),
      image: 'https://clausbertermann.com/wp-content/uploads/2025/06/claus-bertermann-pfks-cb-2020-PH8EC-600x600.png',
      auctionHouse: 'Artcurial, Paris',
      price: '€10,160',
    },
    {
      id: '2',
      title: 'F5TP#CB',
      dimensions: '120 × 120 cm',
      medium: t('oilOnCanvas'),
      image: 'https://clausbertermann.com/wp-content/uploads/2025/06/F5TPCB-600x599.jpeg.webp',
      auctionHouse: 'Sotheby\'s, Cologne',
      price: '€15,240',
    },
    {
      id: '3',
      title: 'KR44#CB',
      dimensions: '130 × 130 cm',
      medium: t('oilOnCanvas'),
      image: 'https://clausbertermann.com/wp-content/uploads/2025/05/kr44-cb-877VU-1-600x600.webp',
      auctionHouse: 'Van Ham, Cologne',
      price: '€11,200',
    },
    {
      id: '4',
      title: 'Retro Zen',
      dimensions: '91.1 × 91.1 cm',
      medium: t('oilOnCanvas'),
      image: 'https://clausbertermann.com/wp-content/uploads/2025/05/2024_PAR_23107_0315_000claus_bertermann_retro_zen071249-600x600.png',
      auctionHouse: 'Christie\'s, Paris',
      price: '€18,900',
    },
    {
      id: '5',
      title: 'Whispershade',
      dimensions: '130 × 130 cm',
      medium: t('oilOnCanvas'),
      image: 'https://clausbertermann.com/wp-content/uploads/2025/05/whispershade-F36IV-600x595.webp',
      auctionHouse: 'Christie\'s, Paris',
      price: '€15,120',
    },
  ];

  // Load all image dimensions on mount
  useEffect(() => {
    const loadAllDimensions = async () => {
      const dimensionsMap: Record<string, { width: number; height: number }> = {};
      
      await Promise.all(
        auctionedWorks.map(async (work) => {
          try {
            const dimensions = await loadImageDimensions(work.image);
            dimensionsMap[work.id] = dimensions;
          } catch (error) {
            console.error(`Failed to load dimensions for ${work.title}:`, error);
            // Fallback to default aspect ratio if image fails to load
            dimensionsMap[work.id] = { width: 600, height: 600 };
          }
        })
      );
      
      setImageDimensions(dimensionsMap);
    };

    loadAllDimensions();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Custom component for artwork with pixel transition
  const ArtworkWithTransition = ({ work }: { work: Artwork }) => (
    <PixelTransition
      firstContent={
        <img
          src={work.image}
          alt={work.title}
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
      }
      secondContent={
        <div
          style={{
            width: "100%",
            height: "100%",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "rgba(0, 0, 0, 0.9)",
            padding: "20px",
            textAlign: "center"
          }}
        >
          <h3 style={{ 
            fontWeight: 900, 
            fontSize: "1.5rem", 
            color: "#ffffff",
            marginBottom: "10px"
          }}>
            {work.title}
          </h3>
          <p style={{ 
            fontSize: "1rem", 
            color: "#ffffff",
            marginBottom: "8px"
          }}>
            {work.medium}
          </p>
          <p style={{ 
            fontSize: "0.9rem", 
            color: "#ffffff",
            marginBottom: "8px"
          }}>
            {work.dimensions}
          </p>
          <div style={{ 
            height: "1px", 
            backgroundColor: "#ffffff30", 
            width: "100%", 
            margin: "10px 0" 
          }} />
          <p style={{ 
            fontSize: "0.8rem", 
            color: "#ffffff80",
            marginBottom: "5px"
          }}>
            {t('soldAt')} {work.auctionHouse}
          </p>
          <p style={{ 
            fontSize: "1.8rem", 
            fontWeight: "bold", 
            color: "#ffffff" 
          }}>
            {work.price}
          </p>
        </div>
      }
      gridSize={8}
      pixelColor='#ffffff'
      animationStepDuration={0.3}
      className="artwork-pixel-transition"
      style={{ width: "100%", height: "100%" }}
    />
  );

  // Transform auction works to match Masonry component interface
  // Calculate height based on actual image aspect ratio for a standard base width of 400px
  const masonryItems = auctionedWorks.map(work => {
    const dimensions = imageDimensions[work.id];
    let height = 400; // Default height
    
    if (dimensions) {
      // Calculate height to maintain aspect ratio at base width of 400px
      const aspectRatio = dimensions.height / dimensions.width;
      height = 400 * aspectRatio;
    }
    
    return {
      id: work.id,
      img: work.image,
      url: '#',
      height: height,
      artwork: work, // Store the full artwork data for modal display
      customComponent: <ArtworkWithTransition work={work} />
    };
  });

  return (
    <div className="min-h-screen bg-black pt-32 pb-24 px-6 md:px-12">
      <div className="max-w-screen-2xl mx-auto">
        <SplitText
          text={t('auctionedWorks')}
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
            items={masonryItems}
            ease="power3.out"
            duration={0.6}
            stagger={0.05}
            animateFrom="bottom"
            scaleOnHover={true}
            hoverScale={0.95}
            blurToFocus={true}
            colorShiftOnHover={false}
            delayAnimation={700}
            onItemClick={(item) => {
              const artwork = (item as any).artwork;
              if (artwork) {
                setSelectedWork(artwork);
              }
            }}
          />
        </div>
      </div>

      {selectedWork && (
        <div
          className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex items-center justify-center p-6"
          onClick={() => setSelectedWork(null)}
        >
          <button
            className="absolute top-6 right-6 text-white hover:scale-110 transition-transform p-2"
            onClick={() => setSelectedWork(null)}
          >
            <X size={32} />
          </button>
          <div className="max-w-4xl max-h-full overflow-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
              <img
                src={selectedWork.image}
                alt={selectedWork.title}
                className="w-full h-auto object-contain rounded-2xl"
                onClick={(e) => e.stopPropagation()}
              />
              <div className="text-white space-y-6">
                <div>
                  <h2 className="text-4xl md:text-5xl font-bold mb-4">{selectedWork.title}</h2>
                  <p className="text-xl text-white/90 mb-2">{selectedWork.medium}</p>
                  <p className="text-lg text-white/80 mb-6">{selectedWork.dimensions}</p>
                </div>
                
                <div className="h-px bg-white/30" />
                
                <div className="space-y-4">
                  <div>
                    <p className="text-white/80 text-sm mb-1">
                      {t('soldAt')} {selectedWork.auctionHouse}
                    </p>
                    <p className="text-3xl font-bold text-white">{selectedWork.price}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
