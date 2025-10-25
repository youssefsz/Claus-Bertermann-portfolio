import { useState } from 'react';
import { X, ZoomIn } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import Masonry from './Masonry';
import SplitText from './SplitText';

export default function GalleryPage() {
  const { t } = useLanguage();
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const galleryImages = [
    {
      id: "1",
      img: "/compressed-image (2).jpg",
      url: "#",
      height: 400,
    },
    {
      id: "2", 
      img: "/compressed-image (3).jpg",
      url: "#",
      height: 300,
    },
    {
      id: "3",
      img: "/compressed-image (4).jpg", 
      url: "#",
      height: 500,
    },
    {
      id: "4",
      img: "/compressed-image (5).jpg",
      url: "#", 
      height: 350,
    },
    {
      id: "5",
      img: "/compressed-image (6).jpg",
      url: "#",
      height: 450,
    },
  ];

  return (
    <div className="min-h-screen bg-black pt-32 pb-24 px-6 md:px-12">
      <div className="max-w-screen-2xl mx-auto">
        <SplitText
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
            animateFrom="bottom"
            scaleOnHover={true}
            hoverScale={0.95}
            blurToFocus={true}
            colorShiftOnHover={false}
            onItemClick={(item) => setSelectedImage(item.img)}
          />
        </div>
      </div>

      {selectedImage && (
        <div
          className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex items-center justify-center p-6"
          onClick={() => setSelectedImage(null)}
        >
          <button
            className="absolute top-6 right-6 text-white hover:scale-110 transition-transform p-2"
            onClick={() => setSelectedImage(null)}
          >
            <X size={32} />
          </button>
          <img
            src={selectedImage}
            alt="Zoomed painting"
            className="max-w-full max-h-full object-contain rounded-2xl animate-fadeIn"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </div>
  );
}
