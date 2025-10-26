import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { Helmet } from 'react-helmet-async';
import { useLanguage } from '../context/LanguageContext';
import Masonry from '../components/Masonry';
import SplitText from '../components/SplitText';

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
      img: "/gallery/1_LPSS-CB_-_2018.jpg",
      url: "#",
    },
    {
      id: "2",
      title: "MQQ1#CB – 2022",
      dimensions: "180 × 150 cm",
      medium: t('oilOnCanvas'),
      img: "/gallery/2_MQQ1-CB_-_2022.jpg",
      url: "#",
    },
    {
      id: "3",
      title: "MQQ2#CB – 2022",
      dimensions: "180 × 150 cm",
      medium: t('oilOnCanvas'),
      img: "/gallery/3_MQQ2-CB_-_2022.jpeg",
      url: "#",
    },
    {
      id: "4",
      title: "5TJ3#CB – 2024",
      dimensions: "200 × 200 cm",
      medium: t('oilOnCanvas'),
      img: "/gallery/4_5TJ3-CB_-_2024.jpg",
      url: "#",
    },
    {
      id: "5",
      title: "V2F2#CB – 2024",
      dimensions: "200 × 200 cm",
      medium: t('oilOnCanvas'),
      img: "/gallery/5_V2F2-CB_-_2024.jpg",
      url: "#",
    },
    {
      id: "6",
      title: "GCOW#CB – 2024",
      dimensions: "150 × 150 cm",
      medium: t('oilOnCanvas'),
      img: "/gallery/6_GCOW-CB_-_2024.jpg",
      url: "#",
    },
    {
      id: "7",
      title: "J20F#CB – 2023",
      dimensions: "180 × 150 cm",
      medium: t('oilOnCanvas'),
      img: "/gallery/7_J20F-CB_-_2023.jpg",
      url: "#",
    },
    {
      id: "8",
      title: "456T#CB – 2024",
      dimensions: "150 × 130 cm",
      medium: t('oilOnCanvas'),
      img: "/gallery/8_456T-CB_-_2024.jpg",
      url: "#",
    },
    {
      id: "9",
      title: "IZOP#CB – 2021",
      dimensions: "150 × 130 cm",
      medium: t('oilOnCanvas'),
      img: "/gallery/9_IZOP-CB_-_2021.jpg",
      url: "#",
    },
    {
      id: "10",
      title: "9ENL#CB – 2024",
      dimensions: "150 × 150 cm",
      medium: t('oilOnCanvas'),
      img: "/gallery/10_9ENL-CB_-_2024.jpg",
      url: "#",
    },
    {
      id: "11",
      title: "34NH#CB – 2025",
      dimensions: "150 × 150 cm",
      medium: t('oilOnCanvas'),
      img: "/gallery/11_34NH-CB_-_2025.jpg",
      url: "#",
    },
    {
      id: "12",
      title: "G223#CB – 2020",
      dimensions: "150 × 150 cm",
      medium: t('oilOnCanvas'),
      img: "/gallery/12_G223-CB_-_2020.jpg",
      url: "#",
    },
    {
      id: "13",
      title: "81BJ#CB – 2024",
      dimensions: "180 × 150 cm",
      medium: t('oilOnCanvas'),
      img: "/gallery/13_81BJ-CB_-_2024.jpg",
      url: "#",
    },
    {
      id: "14",
      title: "80BJ#CB – 2024",
      dimensions: "180 × 150 cm",
      medium: t('oilOnCanvas'),
      img: "/gallery/14_80BJ-CB_-_2024.jpg",
      url: "#",
    },
    {
      id: "15",
      title: "K33N#CB – 2024",
      dimensions: "150 × 150 cm",
      medium: t('oilOnCanvas'),
      img: "/gallery/15_K33N-CB_-_2024.jpeg",
      url: "#",
    },
    {
      id: "16",
      title: "U322#CB – 2025",
      dimensions: "200 × 130 cm",
      medium: t('oilOnCanvas'),
      img: "/gallery/16_U322-CB_-_2025.jpg",
      url: "#",
    },
    {
      id: "17",
      title: "9BE4#CB – 2025",
      dimensions: "130 × 80 cm",
      medium: t('oilOnCanvas'),
      img: "/gallery/17_9BE4-CB_-_2025.jpg",
      url: "#",
    },
    {
      id: "18",
      title: "33MG#CB – 2023",
      dimensions: "150 × 100 cm",
      medium: t('oilOnCanvas'),
      img: "/gallery/18_33MG-CB_-_2023.jpg",
      url: "#",
    },
    {
      id: "19",
      title: "24GD#CB – 2023",
      dimensions: "240 × 130 cm",
      medium: t('oilOnCanvas'),
      img: "/gallery/19_24GD-CB_-_2023.jpg",
      url: "#",
    },
    {
      id: "20",
      title: "9BE3#CB – 2025",
      dimensions: "130 × 80 cm",
      medium: t('oilOnCanvas'),
      img: "/gallery/20_9BE3-CB_-_2025.jpeg",
      url: "#",
    },
    {
      id: "21",
      title: "91UI#CB – 2023",
      dimensions: "130 × 80 cm",
      medium: t('oilOnCanvas'),
      img: "/gallery/21_91UI-CB_-_2023.jpg",
      url: "#",
    },
    {
      id: "22",
      title: "S882#CB – 2024",
      dimensions: "180 × 150 cm",
      medium: t('oilOnCanvas'),
      img: "/gallery/22_S882-CB_-_2024.jpeg",
      url: "#",
    },
    {
      id: "23",
      title: "YXX9#CB – 2024",
      dimensions: "150 × 130 cm",
      medium: t('oilOnCanvas'),
      img: "/gallery/23_YXX9-CB_-_2024.jpeg",
      url: "#",
    },
    {
      id: "24",
      title: "Z2MF#CB – 2023",
      dimensions: "180 × 130 cm",
      medium: t('oilOnCanvas'),
      img: "/gallery/24_Z2MF-CB_-_2023.webp",
      url: "#",
    },
    {
      id: "25",
      title: "9DNL#CB – 2024",
      dimensions: "150 × 150 cm",
      medium: t('oilOnCanvas'),
      img: "/gallery/25_9DNL-CB_-_2024.jpg",
      url: "#",
    },
    {
      id: "26",
      title: "H5R6#CB – 2024",
      dimensions: "200 × 200 cm",
      medium: t('oilOnCanvas'),
      img: "/gallery/26_H5R6-CB_-_2024.jpg",
      url: "#",
    },
    {
      id: "27",
      title: "B211#CB – 2024",
      dimensions: "150 × 150 cm",
      medium: t('oilOnCanvas'),
      img: "/gallery/27_B211-CB_-_2024.jpg",
      url: "#",
    },
    {
      id: "28",
      title: "6784#CB – 2024",
      dimensions: "150 × 130 cm",
      medium: t('oilOnCanvas'),
      img: "/gallery/28_6784-CB_-_2024.jpeg",
      url: "#",
    },
    {
      id: "29",
      title: "TGB2#CB – 2024",
      dimensions: "150 × 140 cm",
      medium: t('oilOnCanvas'),
      img: "/gallery/29_TGB2-CB_-_2024.jpg",
      url: "#",
    },
    {
      id: "30",
      title: "23EB#CB – 2023",
      dimensions: "160 × 150 cm",
      medium: t('oilOnCanvas'),
      img: "/gallery/30_23EB-CB_-_2023.jpg",
      url: "#",
    },
    {
      id: "31",
      title: "488K#CB – 2019",
      dimensions: "150 × 150 cm",
      medium: t('oilOnCanvas'),
      img: "/gallery/31_488K-CB_-_2019.jpg",
      url: "#",
    },
    {
      id: "32",
      title: "Z333#CB – 2023",
      dimensions: "90 × 90 cm",
      medium: t('oilOnCanvas'),
      img: "/gallery/32_Z333-CB_-_2023.jpeg",
      url: "#",
    },
    {
      id: "33",
      title: "S883#CB – 2024",
      dimensions: "180 × 150 cm",
      medium: t('oilOnCanvas'),
      img: "/gallery/33_S883-CB_-_2024.jpeg",
      url: "#",
    },
    {
      id: "34",
      title: "WK10#CB – 2023",
      dimensions: "170 × 150 cm",
      medium: t('oilOnCanvas'),
      img: "/gallery/34_WK10-CB_-_2023.jpg",
      url: "#",
    },
    {
      id: "35",
      title: "G318#CB – 2023",
      dimensions: "180 × 150 cm",
      medium: t('oilOnCanvas'),
      img: "/gallery/35_G318-CB_-_2023.jpeg",
      url: "#",
    },
    {
      id: "36",
      title: "7Z2Q#CB – 2024",
      dimensions: "210 × 150 cm",
      medium: t('oilOnCanvas'),
      img: "/gallery/36_7Z2Q-CB_-_2024.jpg",
      url: "#",
    },
    {
      id: "37",
      title: "7Z87#CB – 2025",
      dimensions: "300 × 150 cm",
      medium: t('oilOnCanvas'),
      img: "/gallery/37_7Z87-CB_-_2025.jpg",
      url: "#",
    },
    {
      id: "38",
      title: "7Z88#CB – 2025",
      dimensions: "300 × 150 cm",
      medium: t('oilOnCanvas'),
      img: "/gallery/38_7Z88-CB_-_2025.jpeg",
      url: "#",
    },
    {
      id: "39",
      title: "IS33#CB – 2021",
      dimensions: "250 × 150 cm",
      medium: t('oilOnCanvas'),
      img: "/gallery/39_IS33-CB_-_2021.jpg",
      url: "#",
    },
    {
      id: "40",
      title: "7U2N#CB – 2025",
      dimensions: "200 × 200 cm",
      medium: t('oilOnCanvas'),
      img: "/gallery/40_7U2N-CB_-_2025.jpg",
      url: "#",
    },
    {
      id: "41",
      title: "4F3F#CB – 2023",
      dimensions: "160 × 150 cm",
      medium: t('oilOnCanvas'),
      img: "/gallery/41_4F3F-CB_-_2023.jpeg",
      url: "#",
    },
    {
      id: "42",
      title: "QW2W#CB – 2021",
      dimensions: "200 × 200 cm",
      medium: t('oilOnCanvas'),
      img: "/gallery/42_QW2W-CB_-_2021.jpeg",
      url: "#",
    },
    {
      id: "43",
      title: "8HXB#CB – 2018",
      dimensions: "150 × 130 cm",
      medium: t('oilOnCanvas'),
      img: "/gallery/43_8HXB-CB_-_2018.jpeg",
      url: "#",
    },
    {
      id: "44",
      title: "E4RS#CB – 2018",
      dimensions: "130 × 130 cm",
      medium: t('oilOnCanvas'),
      img: "/gallery/44_E4RS-CB_-_2018.jpeg",
      url: "#",
    },
    {
      id: "45",
      title: "9IJ9#CB – 2023",
      dimensions: "180 × 150 cm",
      medium: t('oilOnCanvas'),
      img: "/gallery/45_9IJ9-CB_-_2023.jpeg",
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
        <meta property="og:image" content="/gallery/1_LPSS-CB_-_2018.jpg" />
        
        {/* Twitter */}
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content="https://clausbertermann.com/gallery" />
        <meta property="twitter:title" content={`${t('gallery')} | Claus Bertermann Digital Canvas Portfolio`} />
        <meta property="twitter:description" content="Explore Claus Bertermann's digital art gallery featuring contemporary abstract paintings, oil on canvas works, and creative digital art pieces from 2018-2025." />
        <meta property="twitter:image" content="/gallery/1_LPSS-CB_-_2018.jpg" />
        
        {/* Canonical URL */}
        <link rel="canonical" href="https://clausbertermann.com/gallery" />
      </Helmet>
      
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
    </>
  );
}
