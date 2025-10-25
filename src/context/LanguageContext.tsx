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
    artWithPurpose: 'Art with a purpose',
    charityText: 'Claus Bertermann\'s artwork is more than just a visual expression—it\'s a mission. By purchasing one of his pieces, you\'re not only acquiring a unique work of art but also contributing to a meaningful cause.\n\nMetabolic diseases are complex and often life-altering conditions that impact the body\'s ability to process energy and essential nutrients. Research is crucial to finding better treatments and, ultimately, a cure. Through his art, Claus Bertermann aims to raise both awareness and funding for this vital cause.\n\nJoin him in making a difference—one artwork at a time',
    artworks: 'Artworks',
    whatAreMetabolicDiseases: 'What are metabolic diseases?',
    metabolicDiseasesText: 'Metabolic diseases are inherited conditions that affect how the body processes substances needed for growth, energy production, and overall health. Our cells constantly break down and produce various compounds to ensure our body functions properly—this process is called metabolism. Enzymes play a crucial role in this system, acting as tiny "factories" that help convert substances into usable energy and nutrients. These enzymes are produced according to genetic instructions in our DNA.\n\nWhen a genetic mutation disrupts the production of a specific enzyme, the body either produces too little of it or none at all. As a result, harmful substances accumulate in the body, leading to a wide range of health problems. Metabolic diseases can manifest at any stage of life, from infancy to adulthood, and their severity varies depending on the type of enzyme affected.',
    typesCausesImpact: 'Types, causes and impact',
    typesCausesImpactText: 'There are over 800 different types of inherited metabolic diseases, each caused by the malfunction of a specific enzyme. Because different enzymes process different substances, each disease has its own unique effects on the body. The underlying genetic mutation is typically inherited from both parents.\n\nThe symptoms of metabolic diseases can vary widely, even among individuals with the same condition. Some people experience mild symptoms, while others face severe complications affecting multiple organs. Diagnosis and treatment require a team of specialists, including pediatricians, neurologists, geneticists, and researchers. Centers like UZ Ghent play a vital role in advancing research and providing expert care for these rare but serious conditions.',
    interestedInArt: 'Interested in my unique art?',
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
    artWithPurpose: 'Kunst met een doel',
    charityText: 'Claus Bertermanns kunstwerk is meer dan alleen een visuele expressie—het is een missie. Door een van zijn werken te kopen, verwerv je niet alleen een uniek kunstwerk, maar draag je ook bij aan een betekenisvol doel.\n\nMetabole ziekten zijn complexe en vaak levensveranderende aandoeningen die het vermogen van het lichaam om energie en essentiële voedingsstoffen te verwerken beïnvloeden. Onderzoek is cruciaal voor het vinden van betere behandelingen en uiteindelijk een genezing. Door zijn kunst wil Claus Bertermann zowel bewustwording als financiering voor deze vitale zaak creëren.\n\nSluit je bij hem aan om het verschil te maken—één kunstwerk tegelijk',
    artworks: 'Kunstwerken',
    whatAreMetabolicDiseases: 'Wat zijn metabole ziekten?',
    metabolicDiseasesText: 'Metabole ziekten zijn erfelijke aandoeningen die beïnvloeden hoe het lichaam stoffen verwerkt die nodig zijn voor groei, energieproductie en algehele gezondheid. Onze cellen breken constant verschillende verbindingen af en produceren nieuwe om ervoor te zorgen dat ons lichaam goed functioneert—dit proces wordt metabolisme genoemd. Enzymen spelen een cruciale rol in dit systeem, ze fungeren als kleine "fabrieken" die helpen stoffen om te zetten in bruikbare energie en voedingsstoffen. Deze enzymen worden geproduceerd volgens genetische instructies in ons DNA.\n\nWanneer een genetische mutatie de productie van een specifiek enzym verstoort, produceert het lichaam er te weinig van of helemaal geen. Als gevolg hiervan hopen schadelijke stoffen zich op in het lichaam, wat leidt tot een breed scala aan gezondheidsproblemen. Metabole ziekten kunnen zich op elk moment van het leven manifesteren, van de kindertijd tot de volwassenheid, en hun ernst varieert afhankelijk van het type enzym dat wordt beïnvloed.',
    typesCausesImpact: 'Typen, oorzaken en impact',
    typesCausesImpactText: 'Er zijn meer dan 800 verschillende soorten erfelijke metabole ziekten, elk veroorzaakt door het disfunctioneren van een specifiek enzym. Omdat verschillende enzymen verschillende stoffen verwerken, heeft elke ziekte zijn eigen unieke effecten op het lichaam. De onderliggende genetische mutatie wordt meestal geërfd van beide ouders.\n\nDe symptomen van metabole ziekten kunnen sterk variëren, zelfs onder individuen met dezelfde aandoening. Sommige mensen ervaren milde symptomen, terwijl anderen ernstige complicaties ondervinden die meerdere organen aantasten. Diagnose en behandeling vereisen een team van specialisten, waaronder kinderartsen, neurologen, genetici en onderzoekers. Centra zoals UZ Gent spelen een vitale rol in het bevorderen van onderzoek en het bieden van expert zorg voor deze zeldzame maar ernstige aandoeningen.',
    interestedInArt: 'Geïnteresseerd in mijn unieke kunst?',
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
