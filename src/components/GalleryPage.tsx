import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import Masonry from './Masonry';
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

export default function GalleryPage() {
  const { t } = useLanguage();
  const [selectedImage, setSelectedImage] = useState<{img: string, title: string, medium: string, dimensions: string} | null>(null);
  const [imageDimensions, setImageDimensions] = useState<Record<string, { width: number; height: number }>>({});

  const galleryImagesList = [
    {
      id: "1",
      title: "LPSS#CB – 2018",
      dimensions: "120 × 100 cm",
      medium: t('oilOnCanvas'),
      img: "https://clausbertermann.com/wp-content/uploads/2025/05/LPSSCB-120x100-2018-600x722.jpg",
      url: "#",
    },
    {
      id: "2",
      title: "MQQ1#CB – 2022",
      dimensions: "180 × 150 cm",
      medium: t('oilOnCanvas'),
      img: "https://clausbertermann.com/wp-content/uploads/2025/05/MQQ1CB-180x150-2022-600x712.jpg",
      url: "#",
    },
    {
      id: "3",
      title: "MQQ2#CB – 2022",
      dimensions: "180 × 150 cm",
      medium: t('oilOnCanvas'),
      img: "https://clausbertermann.com/wp-content/uploads/2025/02/WhatsApp-Image-2025-04-29-at-08.18.42-1-600x721.jpeg",
      url: "#",
    },
    {
      id: "4",
      title: "5TJ3#CB – 2024",
      dimensions: "200 × 200 cm",
      medium: t('oilOnCanvas'),
      img: "https://clausbertermann.com/wp-content/uploads/2025/05/5TJ3CB-200x200-2024-600x601.jpg",
      url: "#",
    },
    {
      id: "5",
      title: "V2F2#CB – 2024",
      dimensions: "200 × 200 cm",
      medium: t('oilOnCanvas'),
      img: "https://clausbertermann.com/wp-content/uploads/2025/05/V2F2CB-200x200-2024-600x601.jpg",
      url: "#",
    },
    {
      id: "6",
      title: "GCOW#CB – 2024",
      dimensions: "150 × 150 cm",
      medium: t('oilOnCanvas'),
      img: "https://clausbertermann.com/wp-content/uploads/2025/05/GCOWCB-150x150-2024-600x600.jpg",
      url: "#",
    },
    {
      id: "7",
      title: "J20F#CB – 2023",
      dimensions: "180 × 150 cm",
      medium: t('oilOnCanvas'),
      img: "https://clausbertermann.com/wp-content/uploads/2025/05/J20FCB-180x150-2023-600x498.jpg",
      url: "#",
    },
    {
      id: "8",
      title: "456T#CB – 2024",
      dimensions: "150 × 130 cm",
      medium: t('oilOnCanvas'),
      img: "https://clausbertermann.com/wp-content/uploads/2025/05/456TCB-150x130-2024-600x520.jpg",
      url: "#",
    },
    {
      id: "9",
      title: "IZOP#CB – 2021",
      dimensions: "150 × 130 cm",
      medium: t('oilOnCanvas'),
      img: "https://clausbertermann.com/wp-content/uploads/2025/05/IZOPCB-150x130-2021-600x520.jpg",
      url: "#",
    },
    {
      id: "10",
      title: "9ENL#CB – 2024",
      dimensions: "150 × 150 cm",
      medium: t('oilOnCanvas'),
      img: "https://clausbertermann.com/wp-content/uploads/2025/05/9ENLCB-150X150-2024-600x600.jpg",
      url: "#",
    },
    {
      id: "11",
      title: "34NH#CB – 2025",
      dimensions: "150 × 150 cm",
      medium: t('oilOnCanvas'),
      img: "https://clausbertermann.com/wp-content/uploads/2025/05/34NHCB-150x150-2025-600x600.jpg",
      url: "#",
    },
    {
      id: "12",
      title: "G223#CB – 2020",
      dimensions: "150 × 150 cm",
      medium: t('oilOnCanvas'),
      img: "https://clausbertermann.com/wp-content/uploads/2025/05/G223CB-150x150-2020-600x600.jpg",
      url: "#",
    },
    {
      id: "13",
      title: "81BJ#CB – 2024",
      dimensions: "180 × 150 cm",
      medium: t('oilOnCanvas'),
      img: "https://clausbertermann.com/wp-content/uploads/2025/05/81BJCB-180x150-2024-600x500.jpg",
      url: "#",
    },
    {
      id: "14",
      title: "80BJ#CB – 2024",
      dimensions: "180 × 150 cm",
      medium: t('oilOnCanvas'),
      img: "https://clausbertermann.com/wp-content/uploads/2025/05/80BJCB-180x150-2024-600x501.jpg",
      url: "#",
    },
    {
      id: "15",
      title: "K33N#CB – 2024",
      dimensions: "150 × 150 cm",
      medium: t('oilOnCanvas'),
      img: "https://clausbertermann.com/wp-content/uploads/2025/04/WhatsApp-Image-2025-04-29-at-08.45.50-600x600.jpeg",
      url: "#",
    },
    {
      id: "16",
      title: "U322#CB – 2025",
      dimensions: "200 × 130 cm",
      medium: t('oilOnCanvas'),
      img: "https://clausbertermann.com/wp-content/uploads/2025/05/U322CB-200x130-2025-600x391.jpg",
      url: "#",
    },
    {
      id: "17",
      title: "9BE4#CB – 2025",
      dimensions: "130 × 80 cm",
      medium: t('oilOnCanvas'),
      img: "https://clausbertermann.com/wp-content/uploads/2025/05/9BE4CB-130x80-2025-600x370.jpg",
      url: "#",
    },
    {
      id: "18",
      title: "33MG#CB – 2023",
      dimensions: "150 × 100 cm",
      medium: t('oilOnCanvas'),
      img: "https://clausbertermann.com/wp-content/uploads/2025/05/33MGCB-150x100-2023-600x398.jpg",
      url: "#",
    },
    {
      id: "19",
      title: "24GD#CB – 2023",
      dimensions: "240 × 130 cm",
      medium: t('oilOnCanvas'),
      img: "https://clausbertermann.com/wp-content/uploads/2025/05/24GDCB-240x130-2023-SIGNED-600x332.jpg",
      url: "#",
    },
    {
      id: "20",
      title: "9BE3#CB – 2025",
      dimensions: "130 × 80 cm",
      medium: t('oilOnCanvas'),
      img: "https://clausbertermann.com/wp-content/uploads/2025/02/WhatsApp-Image-2025-04-29-at-08.21.44-600x368.jpeg",
      url: "#",
    },
    {
      id: "21",
      title: "91UI#CB – 2023",
      dimensions: "130 × 80 cm",
      medium: t('oilOnCanvas'),
      img: "https://clausbertermann.com/wp-content/uploads/2025/05/91UICB-130x80-2023-600x372.jpg",
      url: "#",
    },
    {
      id: "22",
      title: "S882#CB – 2024",
      dimensions: "180 × 150 cm",
      medium: t('oilOnCanvas'),
      img: "https://clausbertermann.com/wp-content/uploads/2025/04/WhatsApp-Image-2025-04-29-at-09.43.40-600x502.jpeg",
      url: "#",
    },
    {
      id: "23",
      title: "YXX9#CB – 2024",
      dimensions: "150 × 130 cm",
      medium: t('oilOnCanvas'),
      img: "https://clausbertermann.com/wp-content/uploads/2025/04/WhatsApp-Image-2025-04-29-at-08.56.16-600x518.jpeg",
      url: "#",
    },
    {
      id: "24",
      title: "Z2MF#CB – 2023",
      dimensions: "180 × 130 cm",
      medium: t('oilOnCanvas'),
      img: "https://clausbertermann.com/wp-content/uploads/2025/05/Z2MFCB-180x130-2023-600x435.jpg.webp",
      url: "#",
    },
    {
      id: "25",
      title: "9DNL#CB – 2024",
      dimensions: "150 × 150 cm",
      medium: t('oilOnCanvas'),
      img: "https://clausbertermann.com/wp-content/uploads/2025/05/9DNLCB-150X150-2024-600x600.jpg",
      url: "#",
    },
    {
      id: "26",
      title: "H5R6#CB – 2024",
      dimensions: "200 × 200 cm",
      medium: t('oilOnCanvas'),
      img: "https://clausbertermann.com/wp-content/uploads/2025/05/H5R6CB-200x200-2024-600x606.jpg",
      url: "#",
    },
    {
      id: "27",
      title: "B211#CB – 2024",
      dimensions: "150 × 150 cm",
      medium: t('oilOnCanvas'),
      img: "https://clausbertermann.com/wp-content/uploads/2025/05/B211CB-150x150-2024-600x600.jpg",
      url: "#",
    },
    {
      id: "28",
      title: "6784#CB – 2024",
      dimensions: "150 × 130 cm",
      medium: t('oilOnCanvas'),
      img: "https://clausbertermann.com/wp-content/uploads/2025/04/WhatsApp-Image-2025-04-29-at-08.57.37-600x692.jpeg",
      url: "#",
    },
    {
      id: "29",
      title: "TGB2#CB – 2024",
      dimensions: "150 × 140 cm",
      medium: t('oilOnCanvas'),
      img: "https://clausbertermann.com/wp-content/uploads/2025/05/TGB2CB-150x140-2024-600x649.jpg",
      url: "#",
    },
    {
      id: "30",
      title: "23EB#CB – 2023",
      dimensions: "160 × 150 cm",
      medium: t('oilOnCanvas'),
      img: "https://clausbertermann.com/wp-content/uploads/2025/05/23EBCB-160x150-2023-600x642.jpg",
      url: "#",
    },
    {
      id: "31",
      title: "488K#CB – 2019",
      dimensions: "150 × 150 cm",
      medium: t('oilOnCanvas'),
      img: "https://clausbertermann.com/wp-content/uploads/2025/05/488KCB-150x150-2019-600x599.jpg",
      url: "#",
    },
    {
      id: "32",
      title: "Z333#CB – 2023",
      dimensions: "90 × 90 cm",
      medium: t('oilOnCanvas'),
      img: "https://clausbertermann.com/wp-content/uploads/2025/04/WhatsApp-Image-2025-04-29-at-10.05.54-600x593.jpeg",
      url: "#",
    },
    {
      id: "33",
      title: "S883#CB – 2024",
      dimensions: "180 × 150 cm",
      medium: t('oilOnCanvas'),
      img: "https://clausbertermann.com/wp-content/uploads/2025/04/WhatsApp-Image-2025-04-29-at-09.44.31-600x500.jpeg",
      url: "#",
    },
    {
      id: "34",
      title: "WK10#CB – 2023",
      dimensions: "170 × 150 cm",
      medium: t('oilOnCanvas'),
      img: "https://clausbertermann.com/wp-content/uploads/2025/05/WK10CB-170x150-2023-600x678.jpg",
      url: "#",
    },
    {
      id: "35",
      title: "G318#CB – 2023",
      dimensions: "180 × 150 cm",
      medium: t('oilOnCanvas'),
      img: "https://clausbertermann.com/wp-content/uploads/2025/02/WhatsApp-Image-2025-04-29-at-08.23.31-600x721.jpeg",
      url: "#",
    },
    {
      id: "36",
      title: "7Z2Q#CB – 2024",
      dimensions: "210 × 150 cm",
      medium: t('oilOnCanvas'),
      img: "https://clausbertermann.com/wp-content/uploads/2025/05/7Z2QCB-210x150-2024-600x835.jpg",
      url: "#",
    },
    {
      id: "37",
      title: "7Z87#CB – 2025",
      dimensions: "300 × 150 cm",
      medium: t('oilOnCanvas'),
      img: "https://clausbertermann.com/wp-content/uploads/2025/05/7Z87CB-300x150-2025-600x299.jpg",
      url: "#",
    },
    {
      id: "38",
      title: "7Z88#CB – 2025",
      dimensions: "300 × 150 cm",
      medium: t('oilOnCanvas'),
      img: "https://clausbertermann.com/wp-content/uploads/2025/02/WhatsApp-Image-2025-04-29-at-08.16.55-600x300.jpeg",
      url: "#",
    },
    {
      id: "39",
      title: "IS33#CB – 2021",
      dimensions: "250 × 150 cm",
      medium: t('oilOnCanvas'),
      img: "https://clausbertermann.com/wp-content/uploads/2025/05/IS33CB-250x150-2021-600x360.jpg",
      url: "#",
    },
    {
      id: "40",
      title: "7U2N#CB – 2025",
      dimensions: "200 × 200 cm",
      medium: t('oilOnCanvas'),
      img: "https://clausbertermann.com/wp-content/uploads/2025/05/7U2NCB-200x200-2025-600x600.jpg",
      url: "#",
    },
    {
      id: "41",
      title: "4F3F#CB – 2023",
      dimensions: "160 × 150 cm",
      medium: t('oilOnCanvas'),
      img: "https://clausbertermann.com/wp-content/uploads/2025/04/WhatsApp-Image-2025-04-29-at-10.08.27-1-600x642.jpeg",
      url: "#",
    },
    {
      id: "42",
      title: "QW2W#CB – 2021",
      dimensions: "200 × 200 cm",
      medium: t('oilOnCanvas'),
      img: "https://clausbertermann.com/wp-content/uploads/2025/04/WhatsApp-Image-2025-04-29-at-09.48.00-600x603.jpeg",
      url: "#",
    },
    {
      id: "43",
      title: "8HXB#CB – 2018",
      dimensions: "150 × 130 cm",
      medium: t('oilOnCanvas'),
      img: "https://clausbertermann.com/wp-content/uploads/2025/04/WhatsApp-Image-2025-04-29-at-09.38.40.jpeg",
      url: "#",
    },
    {
      id: "44",
      title: "E4RS#CB – 2018",
      dimensions: "130 × 130 cm",
      medium: t('oilOnCanvas'),
      img: "https://clausbertermann.com/wp-content/uploads/2025/04/WhatsApp-Image-2025-04-29-at-09.34.25-600x597.jpeg",
      url: "#",
    },
    {
      id: "45",
      title: "9IJ9#CB – 2023",
      dimensions: "180 × 150 cm",
      medium: t('oilOnCanvas'),
      img: "https://clausbertermann.com/wp-content/uploads/2025/04/WhatsApp-Image-2025-04-29-at-10.11.01-600x440.jpeg",
      url: "#",
    },
  ];

  // Load all image dimensions on mount
  useEffect(() => {
    const loadAllDimensions = async () => {
      const dimensionsMap: Record<string, { width: number; height: number }> = {};
      
      await Promise.all(
        galleryImagesList.map(async (image) => {
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
      
      setImageDimensions(dimensionsMap);
    };

    loadAllDimensions();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Calculate heights based on actual image dimensions
  const galleryImages = galleryImagesList.map(image => {
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

  return (
    <div className="min-h-screen pt-32 pb-24 px-6 md:px-12">
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
            animateFrom="center"
            scaleOnHover={true}
            hoverScale={0.95}
            blurToFocus={true}
            colorShiftOnHover={false}
            delayAnimation={700}
            onItemClick={(item) => setSelectedImage({
              img: item.img,
              title: item.title || '',
              medium: item.medium || '',
              dimensions: item.dimensions || ''
            })}
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
          <div className="flex flex-col lg:flex-row items-center justify-center gap-8 max-w-7xl w-full">
            <div className="flex-1 flex justify-center">
              <img
                src={selectedImage.img}
                alt="Zoomed painting"
                className="max-w-full max-h-[80vh] object-contain rounded-2xl animate-fadeIn"
                onClick={(e) => e.stopPropagation()}
              />
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
  );
}
