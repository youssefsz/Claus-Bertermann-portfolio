import { useState, useEffect, useRef } from 'react';
import { Palette, Trophy, Hammer, Users } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useLanguage } from '../context/LanguageContext';
import MagicBento from '../components/MagicBento';
import SplitText from '../components/SplitText';
import ImageModal from '../components/ImageModal';
import ImageMagnifier from '../components/ImageMagnifier';
import { InteractiveHoverButton } from '../components/InteractiveHoverButton';
import { motion } from 'framer-motion';

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
  const { t, remountKey } = useLanguage();
  const navigate = useNavigate();
  const [heroScale, setHeroScale] = useState(1);
  const [modalImage, setModalImage] = useState<{ src: string; alt: string } | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  const parallaxSectionRef = useRef<HTMLDivElement>(null);
  const { curtainTranslate, textOpacity, parallaxOffset } = useParallaxAnimation(parallaxSectionRef);

  // Check if device is mobile
  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    checkIsMobile();
    window.addEventListener('resize', checkIsMobile);
    return () => window.removeEventListener('resize', checkIsMobile);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const newScale = 1 + scrollY / 2000;
      const finalScale = Math.min(newScale, 1.3);
      setHeroScale(finalScale);
      console.log('Scroll Y:', scrollY, 'Scale:', finalScale); // Debug log
    };

    // Initial call to set correct scale on mount
    handleScroll();
    
    window.addEventListener('scroll', handleScroll, { passive: true });
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
    <>
      <Helmet>
        <title>{t('home')} | Claus Bertermann Digital Canvas Portfolio</title>
        <meta name="description" content="Claus Bertermann's digital canvas portfolio showcasing contemporary abstract art, oil paintings, and creative works. Explore the artist's unique techniques and artistic journey." />
        <meta name="keywords" content="digital art, contemporary art, Claus Bertermann, portfolio, digital canvas, modern art, creative works" />
        
        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://clausbertermann.com/" />
        <meta property="og:title" content={`${t('home')} | Claus Bertermann Digital Canvas Portfolio`} />
        <meta property="og:description" content="Claus Bertermann's digital canvas portfolio showcasing contemporary abstract art, oil paintings, and creative works. Explore the artist's unique techniques and artistic journey." />
        <meta property="og:image" content="/gallery/39_IS33-CB_-_2021.jpg" />
        
        {/* Twitter */}
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content="https://clausbertermann.com/" />
        <meta property="twitter:title" content={`${t('home')} | Claus Bertermann Digital Canvas Portfolio`} />
        <meta property="twitter:description" content="Claus Bertermann's digital canvas portfolio showcasing contemporary abstract art, oil paintings, and creative works. Explore the artist's unique techniques and artistic journey." />
        <meta property="twitter:image" content="/gallery/39_IS33-CB_-_2021.jpg" />
        
        {/* Canonical URL */}
        <link rel="canonical" href="https://clausbertermann.com/" />
      </Helmet>
      
      <motion.div 
        className="min-h-screen relative"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <motion.div
          className="absolute inset-0 bg-cover bg-center transition-transform duration-100 ease-out"
          style={{
            backgroundImage: `url('/gallery/39_IS33-CB_-_2021.jpg')`,
            transform: `scale(${heroScale})`,
            transformOrigin: 'center center',
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/30 to-black/60" />
        </motion.div>

        <motion.div 
          className="relative z-10 text-center px-6"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.5, ease: "easeOut" }}
        >
          <SplitText
            key={`hero-${remountKey}`}
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
          <motion.p 
            className="text-lg md:text-xl lg:text-2xl text-white/90 tracking-[0.3em] font-light"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.2, ease: "easeOut" }}
          >
            {t('subtitle')}
          </motion.p>
        </motion.div>

        <motion.div 
          className="absolute bottom-12 left-1/2 -translate-x-1/2 z-10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.8, ease: "easeOut" }}
        >
          <div className="mouse-scroll-wheel" />
        </motion.div>

        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-b from-transparent to-black z-[5]" />
      </section>

      {/* Parallax Split-Curtain Animation Section */}
      <div className="parallax-section-container" ref={parallaxSectionRef}>
        {isMobile ? (
          // Mobile: Current implementation with separated content
          <>
            <div className="sticky-animation-container">
              {/* Top curtain */}
              <div
                className="split-curtain top"
                style={{ 
                  transform: `translateY(-${curtainTranslate}vh)`,
                  opacity: curtainTranslate >= 50 ? 0 : 1,
                  pointerEvents: curtainTranslate >= 50 ? 'none' : 'auto',
                  zIndex: 2
                }}
              >
                <h1 className="parallax-curtain-text" style={{ opacity: textOpacity }}>
                  {t('paintings').toUpperCase()}
                </h1>
              </div>

              {/* Bottom curtain */}
              <div
                className="split-curtain bottom"
                style={{ 
                  transform: `translateY(${curtainTranslate}vh)`,
                  opacity: curtainTranslate >= 50 ? 0 : 1,
                  pointerEvents: curtainTranslate >= 50 ? 'none' : 'auto',
                  zIndex: 2
                }}
              >
                <h1 className="parallax-curtain-text" style={{ opacity: textOpacity }}>
                  {t('paintings').toUpperCase()}
                </h1>
              </div>
            </div>

            {/* Scroll spacer to control animation duration */}
            <div className="parallax-scroll-spacer"></div>
          </>
        ) : (
          // Desktop: Revealed content as layer beneath curtains
          <>
            <div className="parallax-animation-only-desktop">
              {/* Revealed content layer beneath curtains */}
              <div 
                className="parallax-revealed-content-desktop"
                style={{ 
                  transform: `translateY(${parallaxOffset * 0.5}px)`,
                }}
              >
                <div className="parallax-wrapper">
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
                    <InteractiveHoverButton
                      onClick={() => {
                        onNavigate('gallery');
                        navigate('/gallery');
                      }}
                      className="px-8 py-4 text-lg whitespace-nowrap"
                    >
                      {t('viewGallery') || 'View Gallery'}
                    </InteractiveHoverButton>
                  </div>
                </div>
              </div>

              {/* Top curtain */}
              <div
                className="split-curtain top"
                style={{ 
                  transform: `translateY(-${curtainTranslate}vh)`,
                  opacity: curtainTranslate >= 50 ? 0 : 1,
                  pointerEvents: curtainTranslate >= 50 ? 'none' : 'auto',
                  zIndex: 2
                }}
              >
                <h1 className="parallax-curtain-text" style={{ opacity: textOpacity }}>
                  {t('paintings').toUpperCase()}
                </h1>
              </div>

              {/* Bottom curtain */}
              <div
                className="split-curtain bottom"
                style={{ 
                  transform: `translateY(${curtainTranslate}vh)`,
                  opacity: curtainTranslate >= 50 ? 0 : 1,
                  pointerEvents: curtainTranslate >= 50 ? 'none' : 'auto',
                  zIndex: 2
                }}
              >
                <h1 className="parallax-curtain-text" style={{ opacity: textOpacity }}>
                  {t('paintings').toUpperCase()}
                </h1>
              </div>
            </div>

            {/* Scroll spacer to control animation duration */}
            <div className="parallax-scroll-spacer"></div>
          </>
        )}
      </div>

      {/* Mobile: Separate revealed content section that moves up during scroll */}
      {isMobile && (
        <div 
          className="parallax-revealed-content-separated"
          style={{ 
            transform: `translateY(${parallaxOffset * 0.5}px)`,
            marginTop: '-160vh',
            position: 'relative',
            zIndex: curtainTranslate >= 50 ? 15 : 5
          }}
        >
          <div className="parallax-wrapper">
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
              <InteractiveHoverButton
                onClick={() => {
                  onNavigate('gallery');
                  navigate('/gallery');
                }}
                className="px-8 py-4 text-lg whitespace-nowrap"
              >
                {t('viewGallery') || 'View Gallery'}
              </InteractiveHoverButton>
            </div>
          </div>
        </div>
      )}

      <section className="relative z-20 py-32 px-6 md:px-12 max-w-screen-2xl mx-auto overflow-hidden">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          viewport={{ once: true, margin: "-100px" }}
        >
          <SplitText
            key={`biography-${remountKey}`}
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
        </motion.div>

        <div className="space-y-20 overflow-hidden">
          {/* Biography 1: Artistic Journey & Influences */}
          <motion.div 
            className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center"
            initial={{ opacity: 0, y: 60 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            viewport={{ once: true, margin: "-50px" }}
          >
            <motion.div 
              className="space-y-6"
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
              viewport={{ once: true }}
            >
              <h3 className="text-4xl md:text-5xl font-bold text-white">
                {t('bioSection1Title')}
              </h3>
              <p className="text-white/80 text-lg leading-relaxed font-light">
                {t('bioSection1Text')}
              </p>
            </motion.div>
            <motion.div 
              className="relative group overflow-hidden rounded-3xl"
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.4, ease: "easeOut" }}
              viewport={{ once: true }}
              whileHover={{ scale: 1.02 }}
            >
              <ImageMagnifier
                src="/biography/B-I-O-G-R-A-P-H-I-E-1.webp"
                alt="Claus Bertermann artistic journey"
                className="w-full h-auto object-contain transition-transform duration-700 group-hover:scale-105"
                magnifierHeight={200}
                magnifierWidth={200}
                zoomLevel={2.5}
                onImageClick={handleImageClick}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
            </motion.div>
          </motion.div>

          {/* Biography 2: Architectural Background & Creative Freedom */}
          <motion.div 
            className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center lg:flex-row-reverse"
            initial={{ opacity: 0, y: 60 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
            viewport={{ once: true, margin: "-50px" }}
          >
            <motion.div 
              className="space-y-6 lg:order-2"
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.4, ease: "easeOut" }}
              viewport={{ once: true }}
            >
              <h3 className="text-4xl md:text-5xl font-bold text-white">
                {t('bioSection2Title')}
              </h3>
              <p className="text-white/80 text-lg leading-relaxed font-light">
                {t('bioSection2Text')}
              </p>
            </motion.div>
            <motion.div 
              className="relative group overflow-hidden rounded-3xl lg:order-1"
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
              viewport={{ once: true }}
              whileHover={{ scale: 1.02 }}
            >
              <ImageMagnifier
                src="/biography/B-I-O-G-R-A-P-H-I-E-2.webp"
                alt="Claus Bertermann architectural background"
                className="w-full h-auto object-contain transition-transform duration-700 group-hover:scale-105"
                magnifierHeight={200}
                magnifierWidth={200}
                zoomLevel={2.5}
                onImageClick={handleImageClick}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
            </motion.div>
          </motion.div>

          {/* Biography 3: Success & Recognition */}
          <motion.div 
            className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center"
            initial={{ opacity: 0, y: 60 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
            viewport={{ once: true, margin: "-50px" }}
          >
            <motion.div 
              className="space-y-6"
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
              viewport={{ once: true }}
            >
              <h3 className="text-4xl md:text-5xl font-bold text-white">
                {t('bioSection3Title')}
              </h3>
              <p className="text-white/80 text-lg leading-relaxed font-light">
                {t('bioSection3Text')}
              </p>
            </motion.div>
            <motion.div 
              className="relative group overflow-hidden rounded-3xl"
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.4, ease: "easeOut" }}
              viewport={{ once: true }}
              whileHover={{ scale: 1.02 }}
            >
              <ImageMagnifier
                src="/biography/B-I-O-G-R-A-P-H-I-E-3.webp"
                alt="Claus Bertermann success and recognition"
                className="w-full h-auto object-contain transition-transform duration-700 group-hover:scale-105"
                magnifierHeight={200}
                magnifierWidth={200}
                zoomLevel={2.5}
                onImageClick={handleImageClick}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
            </motion.div>
          </motion.div>
        </div>

        {/* Enhanced Statistics Section (original layout, colored numbers) */}
        <motion.div 
          className="relative mt-32"
          initial={{ opacity: 0, y: 80 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          viewport={{ once: true, margin: "-100px" }}
        >
          {/* Background decorative elements */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent rounded-3xl" />
          <div className="absolute -top-8 -left-8 w-24 h-24 bg-white/5 rounded-full blur-xl" />
          <div className="absolute -bottom-8 -right-8 w-32 h-32 bg-white/5 rounded-full blur-xl" />

          <div className="relative bg-gradient-to-br from-white/8 to-white/3 backdrop-blur-sm rounded-3xl p-12 border border-white/10">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {stats.map((stat, index) => {
                const Icon = stat.icon;
                return (
                  <motion.div
                    key={index}
                    className="group relative text-center"
                    initial={{ opacity: 0, y: 40, scale: 0.9 }}
                    whileInView={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ 
                      duration: 0.6, 
                      delay: index * 0.1, 
                      ease: "easeOut" 
                    }}
                    viewport={{ once: true, margin: "-50px" }}
                    whileHover={{ 
                      scale: 1.05,
                      transition: { duration: 0.3, ease: "easeOut" }
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
                            <motion.div
                              className="text-4xl md:text-5xl font-extrabold tracking-tight text-transparent bg-clip-text"
                              style={{
                                backgroundImage:
                                  'linear-gradient(90deg, rgba(255,255,255,0.95), rgba(132, 0, 255, 0.9))'
                              }}
                              initial={{ opacity: 0, scale: 0.8 }}
                              whileInView={{ opacity: 1, scale: 1 }}
                              transition={{ 
                                duration: 0.5, 
                                delay: index * 0.1 + 0.3, 
                                ease: "easeOut" 
                              }}
                              viewport={{ once: true }}
                            >
                              {numberPart}
                            </motion.div>
                            <motion.p 
                              className="text-white/95 text-lg font-medium leading-tight group-hover:text-white transition-colors duration-300"
                              initial={{ opacity: 0, y: 10 }}
                              whileInView={{ opacity: 1, y: 0 }}
                              transition={{ 
                                duration: 0.4, 
                                delay: index * 0.1 + 0.5, 
                                ease: "easeOut" 
                              }}
                              viewport={{ once: true }}
                            >
                              {rest}
                            </motion.p>
                          </div>
                        );
                      }
                      return (
                        <div className="space-y-2">
                          <motion.p 
                            className="text-white/95 text-lg font-medium leading-tight group-hover:text-white transition-colors duration-300"
                            initial={{ opacity: 0, y: 10 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ 
                              duration: 0.4, 
                              delay: index * 0.1 + 0.3, 
                              ease: "easeOut" 
                            }}
                            viewport={{ once: true }}
                          >
                            {t(stat.key)}
                          </motion.p>
                        </div>
                      );
                    })()}

                    <motion.div 
                      className="w-12 h-0.5 bg-gradient-to-r from-transparent via-white/30 to-transparent mx-auto mt-4 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                      initial={{ scaleX: 0 }}
                      whileInView={{ scaleX: 1 }}
                      transition={{ 
                        duration: 0.4, 
                        delay: index * 0.1 + 0.7, 
                        ease: "easeOut" 
                      }}
                      viewport={{ once: true }}
                    />
                  </motion.div>
                );
              })}
            </div>
          </div>
        </motion.div>
      </section>

      {/* Techniques Section */}
      <section className="relative z-20 py-32 px-6 md:px-12 max-w-screen-2xl mx-auto overflow-hidden">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          viewport={{ once: true, margin: "-100px" }}
        >
          <SplitText
            key={`techniques-${remountKey}`}
            text={t('techniques')}
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
        </motion.div>

        <div className="space-y-20 overflow-hidden">
          {/* Technique 1: Foreground & Background */}
          <motion.div 
            className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center"
            initial={{ opacity: 0, y: 60 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            viewport={{ once: true, margin: "-50px" }}
          >
            <motion.div 
              className="space-y-6"
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
              viewport={{ once: true }}
            >
              <h3 className="text-4xl md:text-5xl font-bold text-white">
                {t('techniqueForeground')}
              </h3>
              <p className="text-white/80 text-lg leading-relaxed font-light">
                {t('techniqueForegroundDesc')}
              </p>
            </motion.div>
            <motion.div 
              className="relative group overflow-hidden rounded-3xl"
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.4, ease: "easeOut" }}
              viewport={{ once: true }}
              whileHover={{ scale: 1.02 }}
            >
              <ImageMagnifier
                src="/gallery/11_34NH-CB_-_2025.jpg"
                alt="Foreground and background technique"
                className="w-full h-auto object-contain transition-transform duration-700 group-hover:scale-105"
                magnifierHeight={200}
                magnifierWidth={200}
                zoomLevel={2.5}
                onImageClick={handleImageClick}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
            </motion.div>
          </motion.div>

          {/* Technique 2: Third Dimension */}
          <motion.div 
            className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center lg:flex-row-reverse"
            initial={{ opacity: 0, y: 60 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
            viewport={{ once: true, margin: "-50px" }}
          >
            <motion.div 
              className="space-y-6 lg:order-2"
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.4, ease: "easeOut" }}
              viewport={{ once: true }}
            >
              <h3 className="text-4xl md:text-5xl font-bold text-white">
                {t('techniqueDimension')}
              </h3>
              <p className="text-white/80 text-lg leading-relaxed font-light">
                {t('techniqueDimensionDesc')}
              </p>
            </motion.div>
            <motion.div 
              className="relative group overflow-hidden rounded-3xl lg:order-1"
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
              viewport={{ once: true }}
              whileHover={{ scale: 1.02 }}
            >
              <ImageMagnifier
                src="/gallery/4_5TJ3-CB_-_2024.jpg"
                alt="Third dimension illusion technique"
                className="w-full h-auto object-contain transition-transform duration-700 group-hover:scale-105"
                magnifierHeight={200}
                magnifierWidth={200}
                zoomLevel={2.5}
                onImageClick={handleImageClick}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
            </motion.div>
          </motion.div>

          {/* Technique 3: Scratching the Paint */}
          <motion.div 
            className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center"
            initial={{ opacity: 0, y: 60 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
            viewport={{ once: true, margin: "-50px" }}
          >
            <motion.div 
              className="space-y-6"
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
              viewport={{ once: true }}
            >
              <h3 className="text-4xl md:text-5xl font-bold text-white">
                {t('techniqueScratching')}
              </h3>
              <p className="text-white/80 text-lg leading-relaxed font-light">
                {t('techniqueScratchingDesc')}
              </p>
            </motion.div>
            <motion.div 
              className="relative group overflow-hidden rounded-3xl"
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.4, ease: "easeOut" }}
              viewport={{ once: true }}
              whileHover={{ scale: 1.02 }}
            >
              <ImageMagnifier
                src="/gallery/3_MQQ2-CB_-_2022.jpeg"
                alt="Paint scratching technique"
                className="w-full h-auto object-contain transition-transform duration-700 group-hover:scale-105"
                magnifierHeight={200}
                magnifierWidth={200}
                zoomLevel={2.5}
                onImageClick={handleImageClick}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
            </motion.div>
          </motion.div>

          {/* Technique 4: Multiple Layers */}
          <motion.div 
            className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center lg:flex-row-reverse"
            initial={{ opacity: 0, y: 60 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
            viewport={{ once: true, margin: "-50px" }}
          >
            <motion.div 
              className="space-y-6 lg:order-2"
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.4, ease: "easeOut" }}
              viewport={{ once: true }}
            >
              <h3 className="text-4xl md:text-5xl font-bold text-white">
                {t('techniqueLayers')}
              </h3>
              <p className="text-white/80 text-lg leading-relaxed font-light">
                {t('techniqueLayersDesc')}
              </p>
            </motion.div>
            <motion.div 
              className="relative group overflow-hidden rounded-3xl lg:order-1"
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
              viewport={{ once: true }}
              whileHover={{ scale: 1.02 }}
            >
              <ImageMagnifier
                src="/gallery/IZOPCB-150x130-2021-2048x1774.jpg"
                alt="Multiple layers superposition technique"
                className="w-full h-auto object-contain transition-transform duration-700 group-hover:scale-105"
                magnifierHeight={200}
                magnifierWidth={200}
                zoomLevel={2.5}
                onImageClick={handleImageClick}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
            </motion.div>
          </motion.div>
        </div>

        {/* Call to Action */}
        <motion.div 
          className="mt-24 text-center"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          viewport={{ once: true, margin: "-50px" }}
        >
          <InteractiveHoverButton
            onClick={() => {
              onNavigate('gallery');
              navigate('/gallery');
            }}
            className="px-12 py-5 text-xl shadow-lg hover:shadow-xl"
          >
            {t('viewGallery')}
          </InteractiveHoverButton>
        </motion.div>
      </section>

      {/* Image Modal */}
      <ImageModal
        isOpen={!!modalImage}
        onClose={closeModal}
        imageSrc={modalImage?.src || ''}
        imageAlt={modalImage?.alt || ''}
      />
    </motion.div>
    </>
  );
}

