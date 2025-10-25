import { useLanguage } from '../context/LanguageContext';
import SplitText from './SplitText';

export default function PressPage() {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen pt-32 pb-24 px-6 md:px-12">
      <div className="max-w-screen-2xl mx-auto">
        <SplitText
          text={t('press')}
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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div className="group p-8 rounded-3xl bg-white/5 backdrop-blur-sm border border-white/10 hover:border-white/30 hover:bg-white/10 transition-all duration-300 cursor-pointer">
            <div className="w-full aspect-video bg-white/5 rounded-2xl mb-6 flex items-center justify-center">
              <span className="text-white/40 text-sm tracking-wider">PRESS ITEM</span>
            </div>
            <h3 className="text-xl font-bold text-white mb-3">Press Article Title</h3>
            <p className="text-white/60 text-sm mb-4">Publication Name • Date</p>
            <p className="text-white/80 font-light">
              Brief description or excerpt from the press article will appear here.
            </p>
          </div>

          <div className="group p-8 rounded-3xl bg-white/5 backdrop-blur-sm border border-white/10 hover:border-white/30 hover:bg-white/10 transition-all duration-300 cursor-pointer">
            <div className="w-full aspect-video bg-white/5 rounded-2xl mb-6 flex items-center justify-center">
              <span className="text-white/40 text-sm tracking-wider">PRESS ITEM</span>
            </div>
            <h3 className="text-xl font-bold text-white mb-3">Exhibition Review</h3>
            <p className="text-white/60 text-sm mb-4">Art Magazine • Date</p>
            <p className="text-white/80 font-light">
              Brief description or excerpt from the exhibition review will appear here.
            </p>
          </div>

          <div className="group p-8 rounded-3xl bg-white/5 backdrop-blur-sm border border-white/10 hover:border-white/30 hover:bg-white/10 transition-all duration-300 cursor-pointer">
            <div className="w-full aspect-video bg-white/5 rounded-2xl mb-6 flex items-center justify-center">
              <span className="text-white/40 text-sm tracking-wider">PRESS ITEM</span>
            </div>
            <h3 className="text-xl font-bold text-white mb-3">Interview Feature</h3>
            <p className="text-white/60 text-sm mb-4">Culture Journal • Date</p>
            <p className="text-white/80 font-light">
              Brief description or excerpt from the interview feature will appear here.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
