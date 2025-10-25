import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';

interface NavigationProps {
  currentPage: string;
  onNavigate: (page: string) => void;
}

export default function Navigation({ currentPage, onNavigate }: NavigationProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { language, setLanguage, t } = useLanguage();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Prevent body scroll when drawer is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMobileMenuOpen]);

  const pages = [
    { id: 'home', label: t('home') },
    { id: 'auctioned', label: t('auctionedWorks') },
    { id: 'gallery', label: t('gallery') },
    { id: 'charity', label: t('charity') },
    { id: 'contact', label: t('contact') },
  ];

  return (
    <>
      <nav
        className={`fixed top-6 left-1/2 transform -translate-x-1/2 z-50 transition-all duration-500 ${
          isScrolled 
            ? 'bg-black/40 backdrop-blur-xl border border-white/30 shadow-2xl py-4' 
            : 'bg-white/5 backdrop-blur-lg border border-white/10 shadow-xl py-6'
        } rounded-2xl`}
        style={{ width: '80%', maxWidth: '1200px' }}
      >
        <div className="px-6 md:px-8 flex items-center justify-between">
          <Link
            to="/"
            onClick={() => onNavigate('home')}
            className="text-white font-bold text-lg md:text-xl tracking-wide hover:opacity-70 transition-opacity"
          >
            Claus Bertermann
          </Link>

          <div className="hidden lg:flex items-center gap-8">
            {pages.map((page) => {
              const path = page.id === 'home' ? '/' : `/${page.id}`;
              return (
                <Link
                  key={page.id}
                  to={path}
                  onClick={() => onNavigate(page.id)}
                  className={`text-sm tracking-widest transition-all duration-300 ${
                    currentPage === page.id
                      ? 'text-white font-bold scale-110'
                      : 'text-white/70 hover:text-white'
                  }`}
                >
                  {page.label}
                </Link>
              );
            })}

            <div className="flex items-center gap-2 ml-4 border-l border-white/20 pl-4">
              <button
                onClick={() => setLanguage('en')}
                className={`text-sm px-3 py-1 rounded-full transition-all duration-300 ${
                  language === 'en'
                    ? 'bg-white text-black font-bold'
                    : 'text-white/70 hover:text-white'
                }`}
              >
                EN
              </button>
              <button
                onClick={() => setLanguage('nl')}
                className={`text-sm px-3 py-1 rounded-full transition-all duration-300 ${
                  language === 'nl'
                    ? 'bg-white text-black font-bold'
                    : 'text-white/70 hover:text-white'
                }`}
              >
                NL
              </button>
            </div>
          </div>

          {/* Custom Animated Toggle Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden relative w-10 h-10 flex items-center justify-center group"
            aria-label="Toggle menu"
          >
            <div className="w-6 h-5 flex flex-col justify-between">
              <span
                className={`block h-0.5 w-full bg-white rounded-full transform transition-all duration-300 ease-out ${
                  isMobileMenuOpen
                    ? 'rotate-45 translate-y-[9px]'
                    : 'rotate-0 translate-y-0'
                }`}
              />
              <span
                className={`block h-0.5 w-full bg-white rounded-full transition-all duration-300 ease-out ${
                  isMobileMenuOpen ? 'opacity-0 scale-0' : 'opacity-100 scale-100'
                }`}
              />
              <span
                className={`block h-0.5 w-full bg-white rounded-full transform transition-all duration-300 ease-out ${
                  isMobileMenuOpen
                    ? '-rotate-45 -translate-y-[9px]'
                    : 'rotate-0 translate-y-0'
                }`}
              />
            </div>
          </button>
        </div>
      </nav>

      {/* Backdrop Overlay */}
      <div
        className={`fixed inset-0 bg-black/60 backdrop-blur-sm z-[60] transition-opacity duration-300 lg:hidden ${
          isMobileMenuOpen
            ? 'opacity-100 pointer-events-auto'
            : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => setIsMobileMenuOpen(false)}
      />

      {/* Right Side Drawer */}
      <div
        className={`fixed top-0 right-0 h-full w-80 max-w-[85vw] bg-black/90 backdrop-blur-xl border-l border-white/20 shadow-2xl z-[70] transform transition-transform duration-500 ease-out lg:hidden ${
          isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full p-8">
          {/* Drawer Header */}
          <div className="flex items-center justify-between mb-12">
            <h2 className="text-white font-bold text-xl tracking-wide">Menu</h2>
            <button
              onClick={() => setIsMobileMenuOpen(false)}
              className="w-10 h-10 flex items-center justify-center text-white hover:bg-white/10 rounded-full transition-colors duration-200"
              aria-label="Close menu"
            >
              <div className="w-6 h-5 flex flex-col justify-center">
                <span className="block h-0.5 w-full bg-white rounded-full transform rotate-45 translate-y-[1px]" />
                <span className="block h-0.5 w-full bg-white rounded-full transform -rotate-45 -translate-y-[1px]" />
              </div>
            </button>
          </div>

          {/* Navigation Links */}
          <div className="flex flex-col gap-2 flex-1 overflow-y-auto">
            {pages.map((page, index) => {
              const path = page.id === 'home' ? '/' : `/${page.id}`;
              return (
                <Link
                  key={page.id}
                  to={path}
                  onClick={() => {
                    onNavigate(page.id);
                    setIsMobileMenuOpen(false);
                  }}
                  className={`text-left text-base tracking-widest transition-all duration-300 py-4 px-4 rounded-xl relative overflow-hidden group ${
                    currentPage === page.id
                      ? 'text-white font-bold bg-white/10'
                      : 'text-white/70 hover:text-white hover:bg-white/5'
                  }`}
                  style={{
                    transitionDelay: isMobileMenuOpen ? `${index * 50}ms` : '0ms',
                    transform: isMobileMenuOpen ? 'translateX(0)' : 'translateX(20px)',
                    opacity: isMobileMenuOpen ? 1 : 0,
                  }}
                >
                  {/* Hover Effect */}
                  <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-0 bg-white rounded-r-full transition-all duration-300 group-hover:h-8" />
                  <span className="relative z-10 block pl-2">{page.label}</span>
                </Link>
              );
            })}
          </div>

          {/* Language Switcher */}
          <div className="mt-auto pt-6 border-t border-white/20">
            <p className="text-white/50 text-xs tracking-widest mb-4">LANGUAGE</p>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setLanguage('en')}
                className={`text-sm px-6 py-3 rounded-xl transition-all duration-300 flex-1 font-medium ${
                  language === 'en'
                    ? 'bg-white text-black shadow-lg scale-105'
                    : 'text-white/70 border border-white/20 hover:border-white/40 hover:text-white'
                }`}
              >
                EN
              </button>
              <button
                onClick={() => setLanguage('nl')}
                className={`text-sm px-6 py-3 rounded-xl transition-all duration-300 flex-1 font-medium ${
                  language === 'nl'
                    ? 'bg-white text-black shadow-lg scale-105'
                    : 'text-white/70 border border-white/20 hover:border-white/40 hover:text-white'
                }`}
              >
                NL
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
