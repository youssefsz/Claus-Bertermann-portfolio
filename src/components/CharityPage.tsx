import { useLanguage } from '../context/LanguageContext';
import SplitText from './SplitText';

export default function CharityPage() {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-black pt-32 pb-24 px-6 md:px-12">
      <div className="max-w-screen-2xl mx-auto">
        <SplitText
          text={t('charity')}
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

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="relative aspect-square overflow-hidden rounded-3xl">
            <img
              src="/compressed-image (4).jpg"
              alt="Charity artwork"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          </div>

          <div>
            <h3 className="text-3xl md:text-4xl font-bold text-white mb-8">
              {t('artWithPurpose')}
            </h3>
            <div className="space-y-6 text-white/80 text-lg leading-relaxed font-light">
              {t('charityText').split('\n\n').map((paragraph, index) => (
                <p key={index}>{paragraph}</p>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
