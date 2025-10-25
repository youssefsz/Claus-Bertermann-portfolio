import { useState, useEffect, useRef } from 'react';
import { Palette, Trophy, Hammer, Users } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import MagicBento from '../components/MagicBento';
import SplitText from '../components/SplitText';
import ImageModal from '../components/ImageModal';

interface HomePageProps {
  onNavigate: (page: string) => void;
}

/**
 * Custom hook for parallax split-curtain scroll animation
 * Tracks scroll position and calculates animation values for curtain reveal effect
 */
const useParallaxAnimation = (sectionRef: React.RefObject<HTMLDivElement>) => {
  const [scrollY, setScrollY] = useState(0);
  const [sectionTop, setSectionTop] = useState<number | null>(null);

  // Calculate section position on mount and window resize
  useEffect(() => {
    const calculateSectionTop = () => {
      if (sectionRef.current) {
        const rect = sectionRef.current.getBoundingClientRect();
        const scrollPosition = window.pageYOffset;
        const absoluteTop = rect.top + scrollPosition;
        setSectionTop(absoluteTop);
      }
    };

    calculateSectionTop();
    window.addEventListener('resize', calculateSectionTop);
    return () => window.removeEventListener('resize', calculateSectionTop);
  }, [sectionRef]);

  // Track scroll position
  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.pageYOffset);
    };

    handleScroll(); // Initial calculation
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const animationDistance = 600;
  const relativeScroll = sectionTop !== null ? Math.max(0, scrollY - sectionTop) : 0;
  const animationProgress = Math.min(relativeScroll / animationDistance, 1);

  const curtainTranslate = animationProgress * 50;
  const textOpacity = 1 - Math.min(relativeScroll / (animationDistance / 2), 1);
  const parallaxOffset = (1 - animationProgress) * (typeof window !== 'undefined' ? window.innerHeight / 2 : 0);

  return { curtainTranslate, textOpacity, parallaxOffset };
};

export default function HomePage({ onNavigate }: HomePageProps) {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [heroScale, setHeroScale] = useState(1);
  const [modalImage, setModalImage] = useState<{ src: string; alt: string } | null>(null);
  const parallaxSectionRef = useRef<HTMLDivElement>(null);
  const { curtainTranslate, textOpacity, parallaxOffset } = useParallaxAnimation(parallaxSectionRef);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const newScale = 1 + scrollY / 2000;
      setHeroScale(Math.min(newScale, 1.3));
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const stats = [
    { icon: Palette, key: 'stat1' },
    { icon: Trophy, key: 'stat2' },
    { icon: Hammer, key: 'stat3' },
    { icon: Users, key: 'stat4' },
  ];

  const handleImageClick = (imageSrc: string, imageAlt: string) => {
    setModalImage({ src: imageSrc, alt: imageAlt });
  };

  const closeModal = () => {
    setModalImage(null);
  };


  const splitStatText = (text: string) => {
    const match = text.match(/([~]?\d+(?:[.,]\d+)?(?:[KM])?\+?)/i);
    if (match && typeof match.index === 'number') {
      const numberPart = match[1];
      const rest = (
        text.slice(0, match.index) + text.slice(match.index + numberPart.length)
      )
        .replace(/\s+/g, ' ')
        .trim();
      return { numberPart, rest };
    }
    return { numberPart: '', rest: text };
  };

  return (
    <div className="min-h-screen relative">
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center transition-transform duration-100 ease-out"
          style={{
            backgroundImage: `url('/compressed-image (6).jpg')`,
            transform: `scale(${heroScale})`,
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/30 to-black/60" />
        </div>

        <div className="relative z-10 text-center px-6">
          <SplitText
            text="Claus Bertermann"
            className="text-6xl md:text-8xl lg:text-9xl font-bold text-white mb-6 tracking-tight"
            delay={100}
            duration={0.8}
            ease="power3.out"
            splitType="chars"
            from={{ opacity: 0, y: 60 }}
            to={{ opacity: 1, y: 0 }}
            threshold={0.1}
            rootMargin="-100px"
            textAlign="center"
          />
          <p className="text-lg md:text-xl lg:text-2xl text-white/90 tracking-[0.3em] font-light animate-fadeInDelay">
            {t('subtitle')}
          </p>
        </div>

        <div className="absolute bottom-12 left-1/2 -translate-x-1/2 z-10">
          <div className="mouse-scroll-wheel" />
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-b from-transparent to-black z-[5]" />
      </section>

      {/* Parallax Split-Curtain Animation Section */}
      <div className="parallax-section-container" ref={parallaxSectionRef}>
        <div className="sticky-animation-container">
          {/* Revealed content underneath the curtains */}
          <div className="parallax-revealed-content">
            <div
              className="parallax-wrapper"
              style={{ transform: `translateY(${parallaxOffset}px)` }}
            >
              <div className="flex flex-col items-center gap-8">
                <MagicBento
                  enableStars={true}
                  enableSpotlight={true}
                  enableBorderGlow={true}
                  enableTilt={true}
                  enableMagnetism={true}
                  clickEffect={true}
                  spotlightRadius={300}
                  particleCount={12}
                  glowColor="132, 0, 255"
                  onImageClick={handleImageClick}
                />
                
                {/* Gallery navigation button */}
                <button
                  onClick={() => {
                    onNavigate('gallery');
                    navigate('/gallery');
                  }}
                  className="inline-block bg-white text-black px-8 py-4 rounded-full font-semibold text-lg hover:bg-white/90 transition-colors duration-300 whitespace-nowrap hover:scale-105 transition-transform duration-300"
                >
                  {t('viewGallery') || 'View Gallery'}
                </button>
              </div>
            </div>
          </div>

          {/* Top curtain */}
          <div
            className="split-curtain top"
            style={{ transform: `translateY(-${curtainTranslate}vh)` }}
          >
            <h1 className="parallax-curtain-text" style={{ opacity: textOpacity }}>
              {t('paintings').toUpperCase()}
            </h1>
          </div>

          {/* Bottom curtain */}
          <div
            className="split-curtain bottom"
            style={{ transform: `translateY(${curtainTranslate}vh)` }}
          >
            <h1 className="parallax-curtain-text" style={{ opacity: textOpacity }}>
              {t('paintings').toUpperCase()}
            </h1>
          </div>
        </div>

        {/* Scroll spacer to control animation duration */}
        <div className="parallax-scroll-spacer"></div>
      </div>

      <section className="relative z-20 py-32 px-6 md:px-12 max-w-screen-2xl mx-auto">
        <SplitText
          text={t('biography')}
          className="text-6xl md:text-8xl lg:text-9xl font-bold text-white text-center mb-24 tracking-tight"
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

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 mb-20">
          <button
            onClick={() => {
              onNavigate('gallery');
              navigate('/gallery');
            }}
            className="group relative overflow-hidden rounded-3xl cursor-pointer"
          >
            <img
              src="/compressed-image (6).jpg"
              alt="Claus Bertermann artwork"
              className="w-full h-auto object-contain transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          </button>

          <div className="flex flex-col justify-center">
            <div className="space-y-6 text-white/80 text-lg leading-relaxed font-light">
              <p>{t('bioParagraph1')}</p>
              <p>{t('bioParagraph2')}</p>
            </div>
          </div>
        </div>

        {/* Enhanced Statistics Section (original layout, colored numbers) */}
        <div className="relative">
          {/* Background decorative elements */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent rounded-3xl" />
          <div className="absolute -top-8 -left-8 w-24 h-24 bg-white/5 rounded-full blur-xl" />
          <div className="absolute -bottom-8 -right-8 w-32 h-32 bg-white/5 rounded-full blur-xl" />

          <div className="relative bg-gradient-to-br from-white/8 to-white/3 backdrop-blur-sm rounded-3xl p-12 border border-white/10">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {stats.map((stat, index) => {
                const Icon = stat.icon;
                return (
                  <div
                    key={index}
                    className="group relative text-center"
                    style={{
                      animation: `fadeInUp 0.8s ease-out ${index * 0.15}s both`,
                    }}
                  >
                    {/* Icon container */}
                    <div className="relative mb-6">
                      <div className="w-16 h-16 mx-auto bg-gradient-to-br from-white/20 to-white/10 rounded-2xl flex items-center justify-center border border-white/20 group-hover:border-white/40 transition-all duration-500 group-hover:scale-110">
                        <Icon className="w-7 h-7 text-white/80 group-hover:text-white transition-colors duration-300" />
                      </div>
                      <div className="absolute inset-0 w-16 h-16 mx-auto bg-white/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-sm" />
                    </div>

                    {/* Statistics stacked number + label */}
                    {(() => {
                      const { numberPart, rest } = splitStatText(t(stat.key));
                      if (numberPart) {
                        return (
                          <div className="space-y-2">
                            <div
                              className="text-4xl md:text-5xl font-extrabold tracking-tight text-transparent bg-clip-text"
                              style={{
                                backgroundImage:
                                  'linear-gradient(90deg, rgba(255,255,255,0.95), rgba(132, 0, 255, 0.9))'
                              }}
                            >
                              {numberPart}
                            </div>
                            <p className="text-white/95 text-lg font-medium leading-tight group-hover:text-white transition-colors duration-300">
                              {rest}
                            </p>
                          </div>
                        );
                      }
                      return (
                        <div className="space-y-2">
                          <p className="text-white/95 text-lg font-medium leading-tight group-hover:text-white transition-colors duration-300">
                            {t(stat.key)}
                          </p>
                        </div>
                      );
                    })()}

                    <div className="w-12 h-0.5 bg-gradient-to-r from-transparent via-white/30 to-transparent mx-auto mt-4 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Image Modal */}
      <ImageModal
        isOpen={!!modalImage}
        onClose={closeModal}
        imageSrc={modalImage?.src || ''}
        imageAlt={modalImage?.alt || ''}
      />
    </div>
  );
}

