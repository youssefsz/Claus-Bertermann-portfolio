import { useState } from 'react';
import { Mail, Phone } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import SplitText from './SplitText';

export default function ContactPage() {
  const { t } = useLanguage();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true);
    setTimeout(() => {
      setIsSubmitted(false);
      setFormData({ name: '', email: '', message: '' });
    }, 3000);
  };

  return (
    <div className="min-h-screen bg-black pt-32 pb-24 px-6 md:px-12">
      <div className="max-w-screen-xl mx-auto">
        <SplitText
          text={t('contact')}
          className="text-5xl md:text-7xl lg:text-8xl font-bold text-white mb-20 tracking-tight"
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

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-12">
              {t('contactForm')}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-8">
              <div>
                <label htmlFor="name" className="block text-white/80 mb-3 text-lg font-light">
                  {t('name')}
                </label>
                <input
                  type="text"
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                  className="w-full px-6 py-4 bg-white/5 border border-white/20 rounded-full text-white placeholder-white/40 focus:outline-none focus:border-white/60 transition-colors duration-300"
                  placeholder={t('name')}
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-white/80 mb-3 text-lg font-light">
                  {t('email')}
                </label>
                <input
                  type="email"
                  id="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                  className="w-full px-6 py-4 bg-white/5 border border-white/20 rounded-full text-white placeholder-white/40 focus:outline-none focus:border-white/60 transition-colors duration-300"
                  placeholder={t('email')}
                />
              </div>

              <div>
                <label htmlFor="message" className="block text-white/80 mb-3 text-lg font-light">
                  {t('message')}
                </label>
                <textarea
                  id="message"
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  required
                  rows={6}
                  className="w-full px-6 py-4 bg-white/5 border border-white/20 rounded-3xl text-white placeholder-white/40 focus:outline-none focus:border-white/60 transition-colors duration-300 resize-none"
                  placeholder={t('message')}
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitted}
                className="w-full px-8 py-4 bg-white text-black font-bold rounded-full hover:bg-white/90 transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed text-lg tracking-wide"
              >
                {isSubmitted ? '✓ Sent' : t('send')}
              </button>
            </form>
          </div>

          <div className="lg:pl-12">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-12">
              {t('agent')}
            </h2>

            <div className="space-y-8">
              <div className="p-8 rounded-3xl bg-white/5 backdrop-blur-sm border border-white/10">
                <h3 className="text-2xl font-bold text-white mb-6">Jos De Troyer</h3>

                <div className="space-y-6">
                  <a
                    href="tel:+32477528191"
                    className="flex items-center gap-4 text-white/80 hover:text-white transition-colors duration-300 group"
                  >
                    <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center group-hover:bg-white/20 transition-colors duration-300">
                      <Phone size={20} />
                    </div>
                    <span className="text-lg">+32 477 52 81 91</span>
                  </a>

                  <a
                    href="mailto:mail@clausbertermann.com"
                    className="flex items-center gap-4 text-white/80 hover:text-white transition-colors duration-300 group"
                  >
                    <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center group-hover:bg-white/20 transition-colors duration-300">
                      <Mail size={20} />
                    </div>
                    <span className="text-lg">mail@clausbertermann.com</span>
                  </a>
                </div>
              </div>

              <div className="relative aspect-square overflow-hidden rounded-3xl">
                <img
                  src="/compressed-image (5).jpg"
                  alt="Contact"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
