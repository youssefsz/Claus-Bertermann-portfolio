import { useState, useEffect, startTransition } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { LanguageProvider } from './context/LanguageContext';
import Navigation from './components/Navigation';
import Footer from './components/Footer';
import ScrollToTop from './components/ScrollToTop';
import HomePage from './pages/HomePage';
import AuctionedWorksPage from './pages/AuctionedWorksPage';
import GalleryPage from './pages/GalleryPage';
import CharityPage from './pages/CharityPage';
import ContactPage from './pages/ContactPage';
import PageTransition from './components/PageTransition';
import BrushTransitionOverlay from './components/BrushTransitionOverlay';

// Component that handles routing logic with transitions
function AppContent() {
  const location = useLocation();
  const navigate = useNavigate();
  const [isTransitioning, setIsTransitioning] = useState(false);

  // Get current page from pathname
  const getCurrentPage = (pathname: string) => {
    if (pathname === '/' || pathname === '/home') return 'home';
    return pathname.slice(1); // Remove leading slash
  };

  const currentPage = getCurrentPage(location.pathname);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [location.pathname]);

  const handleNavigate = (page: string) => {
    // Start the brush transition animation
    setIsTransitioning(true);
    
    // Use React's startTransition API for optimal performance (2025 best practice)
    startTransition(() => {
      // Delay page change to allow the brush to swipe across and cover the screen
      setTimeout(() => {
        const path = page === 'home' ? '/' : `/${page}`;
        navigate(path);
        // Reset transition state after animation completes
        setTimeout(() => {
          setIsTransitioning(false);
        }, 250);
      }, 450); // This timing matches the brush animation peak (halfway through 0.9s animation)
    });
  };

  return (
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
        <Routes>
          <Route path="/" element={<HomePage onNavigate={handleNavigate} />} />
          <Route path="/home" element={<HomePage onNavigate={handleNavigate} />} />
          <Route path="/auctioned" element={<AuctionedWorksPage />} />
          <Route path="/gallery" element={<GalleryPage />} />
          <Route path="/charity" element={<CharityPage />} />
          <Route path="/contact" element={<ContactPage />} />
        </Routes>
      </PageTransition>
      
      {/* Floating Footer Container */}
      <div className="relative z-10 mt-20">
        <Footer onNavigate={handleNavigate} />
      </div>

      {/* Scroll to Top Button - appears on all pages */}
      <ScrollToTop />
    </div>
  );
}

function App() {
  return (
    <HelmetProvider>
      <LanguageProvider>
        <Router>
          <AppContent />
        </Router>
      </LanguageProvider>
    </HelmetProvider>
  );
}

export default App;
