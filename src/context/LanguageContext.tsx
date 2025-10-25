import { createContext, useContext, useState, ReactNode } from 'react';
import { Language } from '../types';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const translations = {
  en: {
    home: 'HOME',
    auctionedWorks: 'AUCTIONED WORKS',
    gallery: 'GALLERY',
    press: 'PRESS',
    charity: 'CHARITY',
    contact: 'CONTACT',
    paintings: 'PAINTINGS',
    biography: 'BIOGRAPHY',
    bioParagraph1: 'Claus Bertermann was born in 1965 in Stuttgart, Germany. He studied architecture at the Technische Universität München (TUM) from 1988 to 1993. After obtaining his master\'s degree, he worked as an architect until the late 1990s before venturing into entrepreneurship. Later, he fully immersed himself in the art world.',
    bioParagraph2: 'Claus Bertermann\'s style is rooted in abstract expressionism. His work is influenced by architecture, abstract art, and art brut, as well as by his Spanish grandfather. Guillermo Castañeda, a self-taught abstract and figurative painter, practiced his art from the end of the Spanish Civil War in the 1940s until his death in 2003. Claus Bertermann spent his childhood at his grandparents\' home in Spain, observing his grandfather painting. The smell of oil and turpentine that permeated his grandfather\'s house still inspires him today.',
    stat1: '10+ years full-time painter',
    stat2: '2 solo exhibitions',
    stat3: '13 works at MutualArt',
    stat4: '~2.7K Instagram followers',
    scrollToExplore: 'Scroll to explore',
    soldAt: 'Sold at',
    oilOnCanvas: 'Oil on Canvas',
    artWithPurpose: 'Art With A Purpose',
    charityText: 'The Art4kidsbyKDB project unites art and compassion. Supported by Claus Bertermann, it brings together artists, collectors, and public figures to support children in need through the power of art.\n\nFor this special edition, Kevin De Bruyne donates an original artwork by Claus Bertermann from Kevin\'s private collection — a gesture that embodies both creativity and care. The proceeds will go directly to initiatives that improve the lives and health of vulnerable children.\n\nBy acquiring a work from the Art4kidsbyKDB project, you are not only investing in art, but also in hope and opportunity for these kids.\n\nTogether, we can make a difference — one artwork at a time.',
    contactForm: 'GET IN TOUCH',
    name: 'Name',
    email: 'Email',
    message: 'Message',
    send: 'Send Message',
    agent: 'Agent',
    subtitle: 'CONTEMPORARY ABSTRACT ART - OIL ON CANVAS',
  },
  nl: {
    home: 'HOME',
    auctionedWorks: 'GEVEILDE WERKEN',
    gallery: 'GALLERIJ',
    press: 'PERS',
    charity: 'LIEFDADIGHEID',
    contact: 'CONTACT',
    paintings: 'SCHILDERIJEN',
    biography: 'BIOGRAFIE',
    bioParagraph1: 'Claus Bertermann werd geboren in 1965 in Stuttgart, Duitsland. Hij studeerde architectuur aan de Technische Universität München (TUM) van 1988 tot 1993. Na het behalen van zijn masterdiploma werkte hij tot eind jaren negentig als architect voordat hij in het ondernemerschap stapte. Later dompelde hij zich volledig onder in de kunstwereld.',
    bioParagraph2: 'Claus Bertermanns stijl is geworteld in abstract expressionisme. Zijn werk wordt beïnvloed door architectuur, abstracte kunst en art brut, evenals door zijn Spaanse grootvader. Guillermo Castañeda, een autodidact abstract en figuratief schilder, beoefende zijn kunst vanaf het einde van de Spaanse Burgeroorlog in de jaren 1940 tot zijn dood in 2003. Claus Bertermann bracht zijn jeugd door in het huis van zijn grootouders in Spanje, waar hij zijn grootvader zag schilderen. De geur van olie en terpentijn die het huis van zijn grootvader vulde, inspireert hem nog steeds.',
    stat1: '10+ jaar fulltime schilder',
    stat2: '2 solo-exposities',
    stat3: '13 werken op MutualArt',
    stat4: '~2,7K Instagram-volgers',
    scrollToExplore: 'Scroll om te verkennen',
    soldAt: 'Verkocht bij',
    oilOnCanvas: 'Olie op doek',
    artWithPurpose: 'Kunst Met Een Doel',
    charityText: 'Het Art4kidsbyKDB project verenigt kunst en hoop. Met de steun van Claus Bertermann brengt het kunstenaars, verzamelaars en publieke figuren samen om via kunst kinderen met metabole ziekten te helpen.\n\nVoor dit bijzonder project doneert Kevin De Bruyne een origineel kunstwerk van Claus Bertermann uit Kevin\'s privécollectie — een gebaar dat zowel creativiteit als zorgzaamheid uitdrukt. De opbrengst gaat rechtstreeks naar initiatieven die het leven en de gezondheid van kinderen met metabole ziekten ondersteunen.\n\nWie een werk uit het Art4kidsbyKDB Project verwerft, investeert niet alleen in kunst, maar ook in hoop en kansen voor deze kinderen met zeldzame stofwisselingsziekten.\n\nSamen kunnen we het verschil maken — kunstwerk per kunstwerk.',
    contactForm: 'NEEM CONTACT OP',
    name: 'Naam',
    email: 'E-mailadres',
    message: 'Bericht',
    send: 'Verstuur Bericht',
    agent: 'Agent',
    subtitle: 'HEDENDAAGSE ABSTRACTE KUNST - OLIE OP DOEK',
  },
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>('en');

  const t = (key: string): string => {
    return translations[language][key as keyof typeof translations.en] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within LanguageProvider');
  }
  return context;
}
