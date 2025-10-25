import { useState, useEffect, startTransition } from 'react';
import { LanguageProvider } from './context/LanguageContext';
import Navigation from './components/Navigation';
import HomePage from './components/HomePage';
import AuctionedWorksPage from './components/AuctionedWorksPage';
import GalleryPage from './components/GalleryPage';
import PressPage from './components/PressPage';
import CharityPage from './components/CharityPage';
import ContactPage from './components/ContactPage';
import Ribbons from './components/Ribbons';
import PageTransition from './components/PageTransition';
import BrushTransitionOverlay from './components/BrushTransitionOverlay';

function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentPage]);

  const handleNavigate = (page: string) => {
    // Start the brush transition animation
    setIsTransitioning(true);
    
    // Use React's startTransition API for optimal performance (2025 best practice)
    startTransition(() => {
      // Delay page change to allow the brush to swipe across and cover the screen
      setTimeout(() => {
        setCurrentPage(page);
        // Reset transition state after animation completes
        setTimeout(() => {
          setIsTransitioning(false);
        }, 250);
      }, 450); // This timing matches the brush animation peak (halfway through 0.9s animation)
    });
  };

  return (
    <LanguageProvider>
      <div className="min-h-screen bg-black relative">
        {/* Magenta Orb Grid Background with black base */}
        <div
          className="absolute inset-0 z-0"
          style={{
            background: "#000000",
            backgroundImage: `
              linear-gradient(to right, rgba(71,85,105,0.15) 1px, transparent 1px),
              linear-gradient(to bottom, rgba(71,85,105,0.15) 1px, transparent 1px),
              radial-gradient(circle at 50% 60%, rgba(236,72,153,0.15) 0%, rgba(168,85,247,0.05) 40%, transparent 70%)
            `,
            backgroundSize: "40px 40px, 40px 40px, 100% 100%",
          }}
        />
        <Navigation currentPage={currentPage} onNavigate={handleNavigate} />

        {/* Brush transition overlay - swipes across the entire screen */}
        <BrushTransitionOverlay isTransitioning={isTransitioning} />

        {/* Page content with fade transition */}
        <PageTransition pageKey={currentPage}>
          {currentPage === 'home' && <HomePage onNavigate={handleNavigate} />}
          {currentPage === 'auctioned' && <AuctionedWorksPage />}
          {currentPage === 'gallery' && <GalleryPage />}
          {currentPage === 'press' && <PressPage />}
          {currentPage === 'charity' && <CharityPage />}
          {currentPage === 'contact' && <ContactPage />}
        </PageTransition>
        
        <Ribbons
          colors={['#06b6d4', '#14b8a6', '#f97316', '#fb7185']}
          baseThickness={28}
          speedMultiplier={0.55}
          maxAge={450}
          enableFade={false}
          enableShaderEffect={true}
          effectAmplitude={2}
        />
      </div>
    </LanguageProvider>
  );
}

export default App;
