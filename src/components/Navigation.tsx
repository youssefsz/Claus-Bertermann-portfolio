import { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
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

  const pages = [
    { id: 'home', label: t('home') },
    { id: 'auctioned', label: t('auctionedWorks') },
    { id: 'gallery', label: t('gallery') },
    { id: 'press', label: t('press') },
    { id: 'charity', label: t('charity') },
    { id: 'contact', label: t('contact') },
  ];

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled ? 'bg-black/80 backdrop-blur-md py-4' : 'bg-transparent py-6'
      }`}
    >
      <div className="max-w-screen-2xl mx-auto px-6 md:px-12 flex items-center justify-between">
        <button
          onClick={() => onNavigate('home')}
          className="text-white font-bold text-lg md:text-xl tracking-wide hover:opacity-70 transition-opacity"
        >
          Claus Bertermann
        </button>

        <div className="hidden lg:flex items-center gap-8">
          {pages.map((page) => (
            <button
              key={page.id}
              onClick={() => onNavigate(page.id)}
              className={`text-sm tracking-widest transition-all duration-300 ${
                currentPage === page.id
                  ? 'text-white font-bold scale-110'
                  : 'text-white/70 hover:text-white'
              }`}
            >
              {page.label}
            </button>
          ))}

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

        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="lg:hidden text-white p-2"
        >
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {isMobileMenuOpen && (
        <div className="lg:hidden absolute top-full left-0 right-0 bg-black/95 backdrop-blur-md">
          <div className="flex flex-col p-6 gap-4">
            {pages.map((page) => (
              <button
                key={page.id}
                onClick={() => {
                  onNavigate(page.id);
                  setIsMobileMenuOpen(false);
                }}
                className={`text-left text-sm tracking-widest transition-all duration-300 py-2 ${
                  currentPage === page.id
                    ? 'text-white font-bold'
                    : 'text-white/70'
                }`}
              >
                {page.label}
              </button>
            ))}
            <div className="flex items-center gap-2 pt-4 border-t border-white/20">
              <button
                onClick={() => setLanguage('en')}
                className={`text-sm px-4 py-2 rounded-full transition-all duration-300 flex-1 ${
                  language === 'en'
                    ? 'bg-white text-black font-bold'
                    : 'text-white/70 border border-white/20'
                }`}
              >
                EN
              </button>
              <button
                onClick={() => setLanguage('nl')}
                className={`text-sm px-4 py-2 rounded-full transition-all duration-300 flex-1 ${
                  language === 'nl'
                    ? 'bg-white text-black font-bold'
                    : 'text-white/70 border border-white/20'
                }`}
              >
                NL
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
