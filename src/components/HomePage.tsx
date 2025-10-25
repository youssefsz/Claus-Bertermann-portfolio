import { useState, useEffect } from 'react';
import { Palette, Trophy, Hammer, Users } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import MagicBento from './MagicBento';
import SplitText from './SplitText';

interface HomePageProps {
  onNavigate: (page: string) => void;
}

export default function HomePage({ onNavigate }: HomePageProps) {
  const { t } = useLanguage();
  const [heroScale, setHeroScale] = useState(1);

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

      {/* Background decorative elements - removed problematic absolute positioning */}

      <section className="relative z-20 py-32 px-6 md:px-12 max-w-screen-2xl mx-auto">
        <SplitText
          text={t('paintings')}
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

        <div className="flex justify-center">
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
        </div>
      </section>

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
