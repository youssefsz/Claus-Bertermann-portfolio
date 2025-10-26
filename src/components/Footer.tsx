import { useLanguage } from '../context/LanguageContext';
import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, Instagram, Globe } from 'lucide-react';

interface FooterProps {
  onNavigate?: (page: string) => void;
}

export default function Footer({ onNavigate }: FooterProps) {
  const { t, language } = useLanguage();

  const currentYear = new Date().getFullYear();

  const contactInfo = {
    agent: t('agent'),
    address: t('addressText'),
    phone: t('phoneText'),
    website: t('websiteText'),
  };

  const socialLinks = [
    {
      name: 'Instagram',
      href: 'https://instagram.com/clausbertermann',
      icon: Instagram,
    },
    {
      name: 'Website',
      href: 'https://clausbertermann.com',
      icon: Globe,
    },
  ];

  return (
    <div className="flex justify-center px-6 py-8">
      <div className="relative bg-black/40 backdrop-blur-xl border border-white/20 rounded-2xl shadow-2xl max-w-6xl w-full">
        {/* Background Pattern */}
        <div
          className="absolute inset-0 opacity-20 rounded-2xl"
          style={{
            backgroundImage: `
              linear-gradient(to right, rgba(71,85,105,0.1) 1px, transparent 1px),
              linear-gradient(to bottom, rgba(71,85,105,0.1) 1px, transparent 1px)
            `,
            backgroundSize: "40px 40px",
          }}
        />
        
        <div className="relative z-10 p-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Artist Info */}
          <div className="lg:col-span-2">
            <h3 className="text-white font-bold text-2xl mb-6 tracking-wide">
              Claus Bertermann
            </h3>
            <p className="text-white/70 text-lg leading-relaxed mb-6 max-w-md">
              {language === 'en' 
                ? 'Contemporary abstract artist exploring themes of transience through layered compositions in oil, acrylic, and mixed media.'
                : 'Hedendaagse abstracte kunstenaar die thema\'s van vergankelijkheid verkent door gelaagde composities in olie, acryl en mixed media.'
              }
            </p>
            <div className="flex flex-wrap gap-4">
              {socialLinks.map((link) => {
                const Icon = link.icon;
                return (
                  <a
                    key={link.name}
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-white/70 hover:text-white transition-colors duration-300 group"
                  >
                    <Icon className="w-5 h-5 group-hover:scale-110 transition-transform duration-300" />
                    <span className="text-sm font-medium">{link.name}</span>
                  </a>
                );
              })}
            </div>
          </div>

          {/* Contact Information */}
          <div>
            <h4 className="text-white font-semibold text-lg mb-6 tracking-wide">
              {t('contactUs')}
            </h4>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-white/60 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-white/90 font-medium text-sm">{contactInfo.agent}</p>
                  <p className="text-white/60 text-sm">{contactInfo.address}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-white/60 flex-shrink-0" />
                <a 
                  href={`tel:${contactInfo.phone}`}
                  className="text-white/70 hover:text-white transition-colors duration-300 text-sm"
                >
                  {contactInfo.phone}
                </a>
              </div>
              
              <div className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-white/60 flex-shrink-0" />
                <a 
                  href="mailto:info@clausbertermann.com"
                  className="text-white/70 hover:text-white transition-colors duration-300 text-sm"
                >
                  info@clausbertermann.com
                </a>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-semibold text-lg mb-6 tracking-wide">
              {language === 'en' ? 'Quick Links' : 'Snelle Links'}
            </h4>
            <nav className="space-y-4">
              <Link 
                to="/gallery"
                onClick={() => onNavigate?.('gallery')}
                className="block text-sm tracking-widest text-white/70 hover:text-white transition-all duration-300 hover:scale-105"
              >
                {t('gallery')}
              </Link>
              <Link 
                to="/auctioned"
                onClick={() => onNavigate?.('auctioned')}
                className="block text-sm tracking-widest text-white/70 hover:text-white transition-all duration-300 hover:scale-105"
              >
                {t('auctionedWorks')}
              </Link>
              <Link 
                to="/charity"
                onClick={() => onNavigate?.('charity')}
                className="block text-sm tracking-widest text-white/70 hover:text-white transition-all duration-300 hover:scale-105"
              >
                {t('charity')}
              </Link>
              <Link 
                to="/contact"
                onClick={() => onNavigate?.('contact')}
                className="block text-sm tracking-widest text-white/70 hover:text-white transition-all duration-300 hover:scale-105"
              >
                {t('contact')}
              </Link>
            </nav>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-white/10 mt-8 pt-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-white/50 text-sm">
              © {currentYear} Claus Bertermann. {language === 'en' ? 'All rights reserved.' : 'Alle rechten voorbehouden.'}
            </div>
            <div className="flex items-center gap-6 text-sm">
              <span className="text-white/50">
                {language === 'en' ? 'Contemporary Abstract Art' : 'Hedendaagse Abstracte Kunst'}
              </span>
              <div className="w-1 h-1 bg-white/30 rounded-full"></div>
              <span className="text-white/50">
                {language === 'en' ? 'Oil on Canvas' : 'Olie op Doek'}
              </span>
            </div>
          </div>
        </div>
        </div>
      </div>
    </div>
  );
}
