import { useState } from 'react';
import { Mail, Phone, MapPin, Globe } from 'lucide-react';
import { Helmet } from 'react-helmet-async';
import { useLanguage } from '../context/LanguageContext';
import SplitText from '../components/SplitText';
import { InteractiveHoverButton } from '../components/InteractiveHoverButton';

export default function ContactPage() {
  const { t, remountKey } = useLanguage();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true);
    
    setTimeout(() => {
      setIsSubmitted(false);
      setFormData({ name: '', email: '', subject: '', message: '' });
    }, 3000);
  };

  return (
    <>
      <Helmet>
        <title>{t('contact')} | Claus Bertermann Digital Canvas Portfolio</title>
        <meta name="description" content="Contact Claus Bertermann for art inquiries, commissions, and collaborations. Get in touch with the contemporary digital artist through our contact form or agent information." />
        <meta name="keywords" content="contact Claus Bertermann, digital artist, art commission, collaboration, art inquiry, contemporary art" />
        
        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://clausbertermann.com/contact" />
        <meta property="og:title" content={`${t('contact')} | Claus Bertermann Digital Canvas Portfolio`} />
        <meta property="og:description" content="Contact Claus Bertermann for art inquiries, commissions, and collaborations. Get in touch with the contemporary digital artist through our contact form or agent information." />
        <meta property="og:image" content="/gallery/39_IS33-CB_-_2021.jpg" />
        
        {/* Twitter */}
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content="https://clausbertermann.com/contact" />
        <meta property="twitter:title" content={`${t('contact')} | Claus Bertermann Digital Canvas Portfolio`} />
        <meta property="twitter:description" content="Contact Claus Bertermann for art inquiries, commissions, and collaborations. Get in touch with the contemporary digital artist through our contact form or agent information." />
        <meta property="twitter:image" content="/gallery/39_IS33-CB_-_2021.jpg" />
        
        {/* Canonical URL */}
        <link rel="canonical" href="https://clausbertermann.com/contact" />
      </Helmet>
      
      <div className="min-h-screen pt-32 pb-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-center mb-16">
          <SplitText
            key={`contact-${remountKey}`}
            text={t('contact')}
            className="text-5xl md:text-7xl lg:text-8xl font-bold text-white tracking-tight"
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
        </div>

        {/* Contact Info Boxes Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <div className="w-full text-center">
            <div className="flex items-center justify-center mb-4">
              <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center border border-white/20">
                <MapPin className="text-white" size={24} />
              </div>
            </div>
            <div className="text-white">
              <p><span className="font-semibold">{t('agent')}:</span> {t('addressText')}</p>
            </div>
          </div>

          <div className="w-full text-center">
            <div className="flex items-center justify-center mb-4">
              <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center border border-white/20">
                <Phone className="text-white" size={24} />
              </div>
            </div>
            <div className="text-white">
              <p>
                <span className="font-semibold">{t('phone')}:</span>{' '}
                <a href="tel:+32477528191" className="hover:text-white/80 transition-colors">
                  {t('phoneText')}
                </a>
              </p>
            </div>
          </div>

          <div className="w-full text-center">
            <div className="flex items-center justify-center mb-4">
              <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center border border-white/20">
                <Mail className="text-white" size={24} />
              </div>
            </div>
            <div className="text-white">
              <p>
                <span className="font-semibold">{t('email')}:</span>{' '}
                <a href="mailto:mail@clausbertermann.com" className="hover:text-white/80 transition-colors">
                  mail@clausbertermann.com
                </a>
              </p>
            </div>
          </div>

          <div className="w-full text-center">
            <div className="flex items-center justify-center mb-4">
              <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center border border-white/20">
                <Globe className="text-white" size={24} />
              </div>
            </div>
            <div className="text-white">
              <p>
                <span className="font-semibold">{t('website')}</span>{' '}
                <a href="#" className="hover:text-white/80 transition-colors">
                  {t('websiteText')}
                </a>
              </p>
            </div>
          </div>
        </div>

        {/* Main Form and Image Layout - 7:5 split */}
        <div className="flex flex-col lg:flex-row gap-0">
          {/* Left Side - Form (7 columns equivalent) */}
          <div className="lg:w-[58.33%] bg-white/5 backdrop-blur-sm border border-white/10 p-8 md:p-12 lg:p-16">
            <h3 className="text-3xl font-bold text-white mb-8">{t('contactUs')}</h3>
            
            {isSubmitted && (
              <div className="mb-6 p-4 bg-green-500/20 border border-green-500/50 rounded-lg text-green-200">
                Your message was sent, thank you!
              </div>
            )}
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="name" className="block text-white mb-2 font-medium">
                    {t('name')}
                  </label>
                  <input
                    type="text"
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                    className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-white/60 transition-colors"
                    placeholder={t('name')}
                  />
                </div>
                
                <div>
                  <label htmlFor="email" className="block text-white mb-2 font-medium">
                    {t('email')}
                  </label>
                  <input
                    type="email"
                    id="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                    className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-white/60 transition-colors"
                    placeholder={t('email')}
                  />
                </div>
              </div>

              <div>
                <label htmlFor="subject" className="block text-white mb-2 font-medium">
                  {t('subject')}
                </label>
                <input
                  type="text"
                  id="subject"
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  required
                  className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-white/60 transition-colors"
                  placeholder={t('subject')}
                />
              </div>

              <div>
                <label htmlFor="message" className="block text-white mb-2 font-medium">
                  {t('message')}
                </label>
                <textarea
                  id="message"
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  required
                  rows={6}
                  className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-white/60 transition-colors resize-none"
                  placeholder={t('message')}
                />
              </div>

              <div>
                <InteractiveHoverButton
                  type="submit"
                  disabled={isSubmitted}
                  className="px-8 py-4 text-lg disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {t('send')}
                </InteractiveHoverButton>
              </div>
            </form>
          </div>

          {/* Right Side - Full Height Image (5 columns equivalent) */}
          <div className="lg:w-[41.67%] flex items-stretch">
            <div 
              className="w-full bg-cover bg-center bg-no-repeat min-h-[600px]"
              style={{
                backgroundImage: 'url(/gallery/1_LPSS-CB_-_2018.jpg)'
              }}
            >
            </div>
          </div>
        </div>
      </div>
    </div>
    </>
  );
}
