import { useState } from 'react';
import { X } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { Artwork } from '../types';
import Masonry from './Masonry';
import PixelTransition from './imgPixelTransition';
import SplitText from './SplitText';

export default function AuctionedWorksPage() {
  const { t } = useLanguage();
  const [selectedWork, setSelectedWork] = useState<Artwork | null>(null);

  const auctionedWorks: Artwork[] = [
    {
      id: '1',
      title: 'PFKS#CB',
      dimensions: '130 × 130 cm',
      medium: t('oilOnCanvas'),
      image: '/compressed-image (2).jpg',
      auctionHouse: 'Artcurial, Paris',
      price: '€10,160',
    },
    {
      id: '2',
      title: 'F5TP#CB',
      dimensions: '120 × 120 cm',
      medium: t('oilOnCanvas'),
      image: '/compressed-image (3).jpg',
      auctionHouse: 'Sotheby\'s, Cologne',
      price: '€15,240',
    },
    {
      id: '3',
      title: 'KR44#CB',
      dimensions: '130 × 130 cm',
      medium: t('oilOnCanvas'),
      image: '/compressed-image (4).jpg',
      auctionHouse: 'Van Ham, Cologne',
      price: '€11,200',
    },
    {
      id: '4',
      title: 'Retro Zen',
      dimensions: '91.1 × 91.1 cm',
      medium: t('oilOnCanvas'),
      image: '/compressed-image (5).jpg',
      auctionHouse: 'Christie\'s, Paris',
      price: '€18,900',
    },
    {
      id: '5',
      title: 'Whispershade',
      dimensions: '130 × 130 cm',
      medium: t('oilOnCanvas'),
      image: '/compressed-image (6).jpg',
      auctionHouse: 'Christie\'s, Paris',
      price: '€15,120',
    },
  ];

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
  const masonryItems = auctionedWorks.map(work => ({
    id: work.id,
    img: work.image,
    url: '#',
    height: 400 + Math.random() * 200, // Vary heights for masonry effect
    artwork: work, // Store the full artwork data for modal display
    customComponent: <ArtworkWithTransition work={work} />
  }));

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
