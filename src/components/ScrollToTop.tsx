import { useState, useEffect } from 'react';
import { ChevronUp } from 'lucide-react';

export default function ScrollToTop() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      // Show button when user scrolls down 300px
      if (window.scrollY > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', toggleVisibility);

    return () => {
      window.removeEventListener('scroll', toggleVisibility);
    };
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  return (
    <button
      onClick={scrollToTop}
      className={`fixed bottom-16 md:bottom-8 right-6 md:right-8 z-50 p-5 md:p-4 rounded-full bg-white/90 backdrop-blur-xl border border-white text-black shadow-2xl transition-all duration-500 ease-in-out hover:scale-110 hover:bg-white hover:shadow-white/30 group ${
        isVisible
          ? 'opacity-100 translate-y-0'
          : 'opacity-0 translate-y-4 pointer-events-none'
      }`}
      aria-label="Scroll to top"
    >
      <ChevronUp className="w-8 h-8 md:w-6 md:h-6 group-hover:-translate-y-1 transition-transform duration-300" />
    </button>
  );
}
