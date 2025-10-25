import { useState, useEffect, useRef } from 'react';
import { Palette, Trophy, Hammer, Users } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import MagicBento from './MagicBento';
import SplitText from './SplitText';

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
  const [heroScale, setHeroScale] = useState(1);
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
          <div className="relative w-1 h-20 bg-white/20 rounded-full overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-8 bg-gradient-to-b from-white to-white/40 rounded-full animate-scrollIndicator" />
          </div>
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
                  textAutoHide={true}
                  enableStars={true}
                  enableSpotlight={true}
                  enableBorderGlow={true}
                  enableTilt={true}
                  enableMagnetism={true}
                  clickEffect={true}
                  spotlightRadius={300}
                  particleCount={12}
                  glowColor="132, 0, 255"
                  onNavigate={onNavigate}
                />
                
                {/* Gallery navigation button */}
                <button
                  onClick={() => onNavigate('gallery')}
                  className="group relative px-8 py-4 bg-white/10 backdrop-blur-sm text-white font-semibold rounded-full border border-white/20 overflow-hidden transition-all duration-300 hover:scale-105 hover:bg-white/20 hover:border-white/40 hover:shadow-2xl hover:shadow-white/10"
                >
                  <span className="relative z-10 flex items-center gap-2">
                    {t('viewGallery') || 'View Gallery'}
                    <svg 
                      className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" 
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </span>
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
            onClick={() => onNavigate('gallery')}
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

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div
                key={index}
                className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-white/10 to-white/5 p-8 border border-white/20 hover:border-white/40 transition-all duration-500 hover:scale-105"
                style={{
                  animation: `fadeInUp 0.8s ease-out ${index * 0.1}s both`,
                }}
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-700" />
                <Icon className="w-8 h-8 text-white/60 mb-4 relative z-10" />
                <p className="text-white/90 text-base font-light leading-relaxed relative z-10">
                  {t(stat.key)}
                </p>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}

