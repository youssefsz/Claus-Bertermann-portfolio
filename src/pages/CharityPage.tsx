import { Helmet } from 'react-helmet-async';
import { useLanguage } from '../context/LanguageContext';
import SplitText from '../components/SplitText';
import { InteractiveHoverButton } from '../components/InteractiveHoverButton';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

interface Article {
  id: string;
  title: string;
  source: string;
  description: string;
  date: string;
  url?: string;
  image?: string;
  order: number;
}

export default function CharityPage() {
  const { t, remountKey } = useLanguage();
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchArticles();
  }, []);

  const fetchArticles = async () => {
    try {
      const response = await fetch('/API/Articles.php');
      const result = await response.json();
      
      if (result.success && result.data) {
        // Sort by order
        const sortedArticles = result.data.sort((a: Article, b: Article) => a.order - b.order);
        setArticles(sortedArticles);
      }
    } catch (error) {
      console.error('Error fetching articles:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>{t('charity')} | Claus Bertermann Digital Canvas Portfolio</title>
        <meta name="description" content="Learn about Claus Bertermann's charitable work with Art4kidsbyKDB, supporting children with metabolic diseases through art. Discover how art can make a difference in children's lives." />
        <meta name="keywords" content="charity, art for kids, Claus Bertermann, Kevin De Bruyne, Art4kidsbyKDB, metabolic diseases, children's health, art philanthropy" />
        
        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://clausbertermann.com/charity" />
        <meta property="og:title" content={`${t('charity')} | Claus Bertermann Digital Canvas Portfolio`} />
        <meta property="og:description" content="Learn about Claus Bertermann's charitable work with Art4kidsbyKDB, supporting children with metabolic diseases through art. Discover how art can make a difference in children's lives." />
        <meta property="og:image" content="/charityy/kdb-3-hd.jpeg" />
        
        {/* Twitter */}
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content="https://clausbertermann.com/charity" />
        <meta property="twitter:title" content={`${t('charity')} | Claus Bertermann Digital Canvas Portfolio`} />
        <meta property="twitter:description" content="Learn about Claus Bertermann's charitable work with Art4kidsbyKDB, supporting children with metabolic diseases through art. Discover how art can make a difference in children's lives." />
        <meta property="twitter:image" content="/charityy/kdb-3-hd.jpeg" />
        
        {/* Canonical URL */}
        <link rel="canonical" href="https://clausbertermann.com/charity" />
      </Helmet>
      
      <div className="min-h-screen pt-32 pb-24 px-6 md:px-12">
      <div className="max-w-screen-2xl mx-auto">
        <SplitText
          key={`charity-${remountKey}`}
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

        {/* Art4kidsbyKDB section */}
        <motion.div 
          className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center mb-24"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6, staggerChildren: 0.2 }}
        >
          <motion.img
            src="/charityy/art4kids-art.jpg"
            alt="Featured artwork supporting Art4kidsbyKDB"
            className="w-full h-auto rounded-3xl max-w-md mx-auto lg:ml-32"
            initial={{ opacity: 0, scale: 1.1 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.8 }}
          />

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <SplitText
              key={`artWithPurpose-${remountKey}`}
              text={t('artWithPurpose')}
              className="text-3xl md:text-4xl font-bold text-white mb-8"
              delay={50}
              duration={0.5}
              ease="power3.out"
              splitType="words"
              from={{ opacity: 0, y: 20 }}
              to={{ opacity: 1, y: 0 }}
              threshold={0.1}
              rootMargin="-50px"
              tag="h3"
            />
            <motion.div 
              className="space-y-6 text-white/80 text-lg leading-relaxed font-light"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              {t('art4kidsText').split('\n\n').map((paragraph, index) => (
                <motion.p 
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.3 }}
                  transition={{ duration: 0.6, delay: 0.6 + (index * 0.1) }}
                >
                  {paragraph}
                </motion.p>
              ))}
              
              {/* Learn More Button with small KDB image */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.6, delay: 0.8 }}
                className="pt-4 flex items-center gap-6"
              >
                <InteractiveHoverButton
                  onClick={() => window.open('https://art4kidsbykdb.com', '_blank', 'noopener,noreferrer')}
                  className="px-8 py-4 text-lg"
                >
                  {t('learnMoreAboutProject')}
                </InteractiveHoverButton>
                <img
                  src="/charityy/kdb-3-hd.jpeg"
                  alt="Kevin De Bruyne"
                  className="w-16 h-16 rounded-full object-cover border-2 border-white/20"
                />
              </motion.div>
            </motion.div>
          </motion.div>
        </motion.div>

        {/* Press Items Section */}
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          <SplitText
            key={`press-${remountKey}`}
            text={t('press')}
            className="text-4xl md:text-5xl font-bold text-white mb-12"
            delay={100}
            duration={0.6}
            ease="power3.out"
            splitType="chars"
            from={{ opacity: 0, y: 30 }}
            to={{ opacity: 1, y: 0 }}
            threshold={0.1}
            rootMargin="-50px"
            tag="h2"
          />
        </motion.div>

        {/* Press Items Grid */}
        {loading ? (
          <div className="text-center text-white/60 mb-24">Loading articles...</div>
        ) : articles.length > 0 ? (
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-24"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6, staggerChildren: 0.1 }}
          >
            {articles.map((article, index) => {
              const handleArticleClick = () => {
                if (article.url) {
                  window.open(article.url, '_blank', 'noopener,noreferrer');
                }
              };

              return (
                <motion.div 
                  key={article.id}
                  className={`group p-8 rounded-3xl bg-white/5 backdrop-blur-sm border border-white/10 hover:border-white/30 hover:bg-white/10 transition-all duration-300 ${article.url ? 'cursor-pointer' : ''}`}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.3 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  onClick={handleArticleClick}
                >
                  {article.image ? (
                    <div className="w-full aspect-video bg-white/5 rounded-2xl mb-6 overflow-hidden">
                      <img 
                        src={article.image} 
                        alt={article.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ) : (
                    <div className="w-full aspect-video bg-white/5 rounded-2xl mb-6 flex items-center justify-center">
                      <span className="text-white/40 text-sm tracking-wider">PRESS ITEM</span>
                    </div>
                  )}
                  <h3 className="text-xl font-bold text-white mb-3 break-words line-clamp-3">{article.title}</h3>
                  <div className="flex items-center justify-between gap-2 mb-4">
                    <p className="text-white/60 text-sm truncate flex-1 min-w-0">{article.source}</p>
                    <p className="text-white/40 text-xs whitespace-nowrap flex-shrink-0">
                      {new Date(article.date).toLocaleDateString('en-US', { 
                        year: 'numeric', 
                        month: 'short', 
                        day: 'numeric' 
                      })}
                    </p>
                  </div>
                  <p className="text-white/80 font-light break-words line-clamp-4">
                    {article.description}
                  </p>
                  {article.url && (
                    <div className="mt-4 text-white/60 text-sm group-hover:text-white/80 transition-colors">
                      Read more →
                    </div>
                  )}
                </motion.div>
              );
            })}
          </motion.div>
        ) : (
          <div className="text-center text-white/60 mb-24">No articles available yet.</div>
        )}

        {/* Contact section */}
        <motion.div 
          className="relative min-h-[60vh] rounded-3xl overflow-hidden"
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          {/* Background image */}
          <img
            src="/compressed-image (2).jpg"
            alt="Background artwork"
            className="absolute inset-0 w-full h-full object-cover"
          />
          {/* Overlay */}
          <div className="absolute inset-0 bg-black/40" />
          
          {/* Content */}
          <motion.div 
            className="relative z-10 flex items-center justify-center min-h-[60vh] px-6"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6, delay: 0.2, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            <div className="flex flex-col md:flex-row items-center gap-6 text-center md:text-left">
              <SplitText
                key={`interestedInArt-${remountKey}`}
                text={t('interestedInArt')}
                className="text-2xl md:text-3xl lg:text-4xl font-bold text-white"
                delay={100}
                duration={0.6}
                ease="power3.out"
                splitType="words"
                from={{ opacity: 0, y: 20 }}
                to={{ opacity: 1, y: 0 }}
                threshold={0.1}
                rootMargin="-50px"
                tag="h3"
              />
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.6, delay: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
              >
                <InteractiveHoverButton
                  onClick={() => {
                    const contactElement = document.getElementById('contact');
                    if (contactElement) {
                      contactElement.scrollIntoView({ behavior: 'smooth' });
                    }
                  }}
                  className="px-6 md:px-8 py-3 md:py-4 text-base md:text-lg whitespace-nowrap"
                >
                  {t('contact')}
                </InteractiveHoverButton>
              </motion.div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
    </>
  );
}
