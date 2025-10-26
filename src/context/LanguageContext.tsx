import { createContext, useContext, useState, ReactNode } from 'react';
import { Language } from '../types';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
  remountKey: number;
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
    bioSection1Title: 'Artistic Journey & Influences',
    bioSection1Text: 'Claus Bertermann paints on a large scale, mainly using oil, colored ink, acrylic, and spray paint. To develop his own unique style and signature, he studied the techniques of his mentors for years: in addition to his grandfather, he draws inspiration from Georg Baselitz, Helen Frankenthaler, Jean Dubuffet, Gerhard Richter, Jean-Michel Basquiat, Karel Appel, and other masters. It wasn\'t until he turned 50 that he felt ready to fully devote himself to painting. In his abstract work, Bertermann mainly explores the theme of transience. He focuses on layers and their interaction: how they appear on the surface, overlap, influence each other, and transform. Bertermann delves into the concept of what once existed and what, covered by a new layer, transforms into something new. Thus, he reflects on the present and the past, construction and destruction, and arouses the viewer\'s curiosity about what the future might hold.',
    bioSection2Title: 'Architectural Background & Creative Freedom',
    bioSection2Text: 'Influenced by his training as an architect, Bertermann consciously rejects any form of rules in his work. He sees his art as a liberation from the rigid structures and specifications of architecture. For him, painting represents absolute freedom, and abstract art is the highest form of free expression. He approaches his painting in an unreflective and intuitive manner, following the impulse of each work. Bertermann deliberately takes risks, crosses boundaries. He covers existing pictorial compositions and then completely or partially removes the new layers. Ultimately, only distant traces and signals of what was once visible remain. He explicitly leaves the interpretation of what was initially present in the covered layers to the viewer, thus offering total freedom. Structured reflection is limited for him to colors and composition. Claus Bertermann cultivates a fluid painting style, intentionally avoiding complex details and often working on multiple canvases simultaneously.',
    bioSection3Title: 'Success & Recognition',
    bioSection3Text: 'Despite – or perhaps because of – his late decision to fully dedicate himself to art, Bertermann has achieved notable success. His works sell worldwide. Apart from his successful sales career, Claus Bertermann held a solo exhibition in 2019 in the BBVA (Banco Bilbao Vizcaya Argentaria) exhibition hall in Oviedo, Spain. As a token of gratitude, Bertermann donated a large-scale triptych (6.00 x 2.00 meters) to his alma mater, the Technische Universität München (TUM), in January 2024. The work adorns the entrance of one of the university\'s main conference facilities. Since 2024, Bertermann has been exclusively represented by Belgian agent Jos De Troyer.',
    stat1: '10+ years full-time painter',
    stat2: '2 solo exhibitions',
    stat3: '13 works at MutualArt',
    stat4: '~2.7K Instagram followers',
    stat1Short: 'Years painting',
    stat2Short: 'Solo exhibitions',
    stat3Short: 'Works at MutualArt',
    stat4Short: 'Instagram followers',
    scrollToExplore: 'Scroll to explore',
    soldAt: 'Sold at',
    oilOnCanvas: 'Oil on Canvas',
    artWithPurpose: 'Art with a purpose',
    art4kidsText: 'The Art4kidsbyKDB project unites art and compassion. Supported by Claus Bertermann, it brings together artists, collectors, and public figures to support children in need through the power of art.\n\nFor this special edition, Kevin De Bruyne donates an original artwork by Claus Bertermann from Kevin\'s private collection — a gesture that embodies both creativity and care. The proceeds will go directly to initiatives that improve the lives and health of vulnerable children.\n\nBy acquiring a work from the Art4kidsbyKDB project, you are not only investing in art, but also in hope and opportunity for these kids.\n\nTogether, we can make a difference — one artwork at a time.',
    pressItem1Title: 'Press Article Title',
    pressItem1Source: 'Publication Name • Date',
    pressItem1Description: 'Brief description or excerpt from the press article will appear here.',
    pressItem2Title: 'Exhibition Review',
    pressItem2Source: 'Art Magazine • Date',
    pressItem2Description: 'Brief description or excerpt from the exhibition review will appear here.',
    pressItem3Title: 'Interview Feature',
    pressItem3Source: 'Culture Journal • Date',
    pressItem3Description: 'Brief description or excerpt from the interview feature will appear here.',
    learnMoreAboutProject: 'Learn more about this project',
    artworks: 'Artworks',
    whatAreMetabolicDiseases: 'What are metabolic diseases?',
    metabolicDiseasesText: 'Metabolic diseases are inherited conditions that affect how the body processes substances needed for growth, energy production, and overall health. Our cells constantly break down and produce various compounds to ensure our body functions properly—this process is called metabolism. Enzymes play a crucial role in this system, acting as tiny "factories" that help convert substances into usable energy and nutrients. These enzymes are produced according to genetic instructions in our DNA.\n\nWhen a genetic mutation disrupts the production of a specific enzyme, the body either produces too little of it or none at all. As a result, harmful substances accumulate in the body, leading to a wide range of health problems. Metabolic diseases can manifest at any stage of life, from infancy to adulthood, and their severity varies depending on the type of enzyme affected.',
    typesCausesImpact: 'Types, causes and impact',
    typesCausesImpactText: 'There are over 800 different types of inherited metabolic diseases, each caused by the malfunction of a specific enzyme. Because different enzymes process different substances, each disease has its own unique effects on the body. The underlying genetic mutation is typically inherited from both parents.\n\nThe symptoms of metabolic diseases can vary widely, even among individuals with the same condition. Some people experience mild symptoms, while others face severe complications affecting multiple organs. Diagnosis and treatment require a team of specialists, including pediatricians, neurologists, geneticists, and researchers. Centers like UZ Ghent play a vital role in advancing research and providing expert care for these rare but serious conditions.',
    interestedInArt: 'Interested in my unique art?',
    contactForm: 'GET IN TOUCH',
    contactUs: 'Contact Us',
    name: 'Name',
    email: 'Email',
    subject: 'Subject',
    message: 'Message',
    send: 'Send Message',
    agent: 'Agent',
    address: 'Agent',
    phone: 'Phone',
    website: 'Website',
    addressText: 'Jos De Troyer - Belgium',
    phoneText: '+32 477 52 81 91',
    websiteText: 'clausbertermann.com',
    subtitle: 'CONTEMPORARY ABSTRACT ART - OIL ON CANVAS',
    techniques: 'TECHNIQUES',
    techniqueForeground: 'Foreground & Background',
    techniqueForegroundDesc: 'With his brushstroke, Claus Bertermann creates visual tension that challenges perception. The viewer\'s eyes struggle to distinguish the foreground from the background as strokes seemingly shift between layers, creating an impossible reality that captivates and confounds.',
    techniqueDimension: 'The Illusion of a Third Dimension',
    techniqueDimensionDesc: 'Claus Bertermann masters the subtle art of depth through precision. His brushstrokes generate exceptional three-dimensional impressions through luminous turns and carefully crafted corners. This illusion invites viewers to dive deep into the work, perceiving elements both near and far.',
    techniqueScratching: 'Scratching the Paint',
    techniqueScratchingDesc: 'Bertermann disrupts tranquility through vigorous, abrupt scratching that creates stark contrasts with surrounding brushstrokes. His unique paint-scratching technique produces gritty structures that occasionally reveal the white canvas beneath or remnants of thick paint. These rough textures alternate with visible traces—memories of underlying layers.',
    techniqueLayers: 'The Superposition of Multiple Layers',
    techniqueLayersDesc: 'Scratched areas blend seamlessly with foreground and background brushstrokes, culminating in complex superpositions of textures and layers. This intricate technique makes the final composition elusive and almost incomprehensible, inviting endless exploration.',
    viewGallery: 'View Gallery',
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
    bioSection1Title: 'Artistieke Reis & Invloeden',
    bioSection1Text: 'Claus Bertermann schildert op grote schaal, voornamelijk met olie, gekleurde inkt, acryl en spuitverf. Om zijn eigen unieke stijl en handtekening te ontwikkelen, bestudeerde hij jarenlang de technieken van zijn mentoren: naast zijn grootvader put hij inspiratie uit Georg Baselitz, Helen Frankenthaler, Jean Dubuffet, Gerhard Richter, Jean-Michel Basquiat, Karel Appel en andere meesters. Pas toen hij 50 werd, voelde hij zich klaar om zich volledig aan het schilderen te wijden. In zijn abstracte werk verkent Bertermann voornamelijk het thema van vergankelijkheid. Hij richt zich op lagen en hun interactie: hoe ze op het oppervlak verschijnen, overlappen, elkaar beïnvloeden en transformeren. Bertermann verdiept zich in het concept van wat ooit bestond en wat, bedekt door een nieuwe laag, transformeert naar iets nieuws. Zo reflecteert hij op het heden en het verleden, constructie en destructie, en wekt hij de nieuwsgierigheid van de kijker over wat de toekomst zou kunnen brengen.',
    bioSection2Title: 'Architecturale Achtergrond & Creatieve Vrijheid',
    bioSection2Text: 'Beïnvloed door zijn opleiding als architect verwerpt Bertermann bewust elke vorm van regels in zijn werk. Hij ziet zijn kunst als een bevrijding van de rigide structuren en specificaties van architectuur. Voor hem vertegenwoordigt schilderen absolute vrijheid, en abstracte kunst is de hoogste vorm van vrije expressie. Hij benadert zijn schilderen op een onbezonnen en intuïtieve manier, de impuls van elk werk volgend. Bertermann neemt bewust risico\'s, overschrijdt grenzen. Hij bedekt bestaande picturale composities en verwijdert dan volledig of gedeeltelijk de nieuwe lagen. Uiteindelijk blijven alleen verre sporen en signalen over van wat ooit zichtbaar was. Hij laat expliciet de interpretatie van wat aanvankelijk aanwezig was in de bedekte lagen aan de kijker, waardoor totale vrijheid wordt geboden. Gestructureerde reflectie is voor hem beperkt tot kleuren en compositie. Claus Bertermann cultiveert een vloeiende schilderstijl, bewust complexe details vermijdend en vaak werkend op meerdere doeken tegelijk.',
    bioSection3Title: 'Succes & Erkenning',
    bioSection3Text: 'Ondanks – of misschien wel dankzij – zijn late beslissing om zich volledig aan kunst te wijden, heeft Bertermann opmerkelijke successen behaald. Zijn werken verkopen wereldwijd. Naast zijn succesvolle verkoopcarrière hield Claus Bertermann in 2019 een solo-expositie in de BBVA (Banco Bilbao Vizcaya Argentaria) tentoonstellingszaal in Oviedo, Spanje. Als blijk van dankbaarheid doneerde Bertermann in januari 2024 een grootschalig drieluik (6,00 x 2,00 meter) aan zijn alma mater, de Technische Universität München (TUM). Het werk siert de ingang van een van de belangrijkste conferentiefaciliteiten van de universiteit. Sinds 2024 wordt Bertermann uitsluitend vertegenwoordigd door de Belgische agent Jos De Troyer.',
    stat1: '10+ jaar fulltime schilder',
    stat2: '2 solo-exposities',
    stat3: '13 werken op MutualArt',
    stat4: '~2,7K Instagram-volgers',
    stat1Short: 'Jaren schilderen',
    stat2Short: 'Solo-exposities',
    stat3Short: 'Werken op MutualArt',
    stat4Short: 'Instagram-volgers',
    scrollToExplore: 'Scroll om te verkennen',
    soldAt: 'Verkocht bij',
    oilOnCanvas: 'Olie op doek',
    artWithPurpose: 'Kunst met een doel',
    art4kidsText: 'Het Art4kidsbyKDB project verenigt kunst en hoop. Met de steun van Claus Bertermann brengt het kunstenaars, verzamelaars en publieke figuren samen om via kunst kinderen met metabole ziekten te helpen.\n\nVoor dit bijzonder project doneert Kevin De Bruyne een origineel kunstwerk van Claus Bertermann uit Kevin\'s privécollectie — een gebaar dat zowel creativiteit als zorgzaamheid uitdrukt. De opbrengst gaat rechtstreeks naar initiatieven die het leven en de gezondheid van kinderen met metabole ziekten ondersteunen.\n\nWie een werk uit het Art4kidsbyKDB Project verwerft, investeert niet alleen in kunst, maar ook in hoop en kansen voor deze kinderen met zeldzame stofwisselingsziekten.\n\nSamen kunnen we het verschil maken — kunstwerk per kunstwerk.',
    pressItem1Title: 'Persartikel Titel',
    pressItem1Source: 'Publicatie Naam • Datum',
    pressItem1Description: 'Korte beschrijving of uittreksel van het persartikel verschijnt hier.',
    pressItem2Title: 'Tentoonstellingsrecensie',
    pressItem2Source: 'Kunst Magazine • Datum',
    pressItem2Description: 'Korte beschrijving of uittreksel van de tentoonstellingsrecensie verschijnt hier.',
    pressItem3Title: 'Interview Feature',
    pressItem3Source: 'Cultuur Journal • Datum',
    pressItem3Description: 'Korte beschrijving of uittreksel van de interview feature verschijnt hier.',
    learnMoreAboutProject: 'Meer informatie over dit project',
    artworks: 'Kunstwerken',
    whatAreMetabolicDiseases: 'Wat zijn metabole ziekten?',
    metabolicDiseasesText: 'Metabole ziekten zijn erfelijke aandoeningen die beïnvloeden hoe het lichaam stoffen verwerkt die nodig zijn voor groei, energieproductie en algehele gezondheid. Onze cellen breken constant verschillende verbindingen af en produceren nieuwe om ervoor te zorgen dat ons lichaam goed functioneert—dit proces wordt metabolisme genoemd. Enzymen spelen een cruciale rol in dit systeem, ze fungeren als kleine "fabrieken" die helpen stoffen om te zetten in bruikbare energie en voedingsstoffen. Deze enzymen worden geproduceerd volgens genetische instructies in ons DNA.\n\nWanneer een genetische mutatie de productie van een specifiek enzym verstoort, produceert het lichaam er te weinig van of helemaal geen. Als gevolg hiervan hopen schadelijke stoffen zich op in het lichaam, wat leidt tot een breed scala aan gezondheidsproblemen. Metabole ziekten kunnen zich op elk moment van het leven manifesteren, van de kindertijd tot de volwassenheid, en hun ernst varieert afhankelijk van het type enzym dat wordt beïnvloed.',
    typesCausesImpact: 'Typen, oorzaken en impact',
    typesCausesImpactText: 'Er zijn meer dan 800 verschillende soorten erfelijke metabole ziekten, elk veroorzaakt door het disfunctioneren van een specifiek enzym. Omdat verschillende enzymen verschillende stoffen verwerken, heeft elke ziekte zijn eigen unieke effecten op het lichaam. De onderliggende genetische mutatie wordt meestal geërfd van beide ouders.\n\nDe symptomen van metabole ziekten kunnen sterk variëren, zelfs onder individuen met dezelfde aandoening. Sommige mensen ervaren milde symptomen, terwijl anderen ernstige complicaties ondervinden die meerdere organen aantasten. Diagnose en behandeling vereisen een team van specialisten, waaronder kinderartsen, neurologen, genetici en onderzoekers. Centra zoals UZ Gent spelen een vitale rol in het bevorderen van onderzoek en het bieden van expert zorg voor deze zeldzame maar ernstige aandoeningen.',
    interestedInArt: 'Geïnteresseerd in mijn unieke kunst?',
    contactForm: 'NEEM CONTACT OP',
    contactUs: 'Neem Contact Op',
    name: 'Naam',
    email: 'E-mailadres',
    subject: 'Onderwerp',
    message: 'Bericht',
    send: 'Verstuur Bericht',
    agent: 'Agent',
    address: 'Agent',
    phone: 'Telefoon',
    website: 'Website',
    addressText: 'Jos De Troyer - België',
    phoneText: '+32 477 52 81 91',
    websiteText: 'clausbertermann.com',
    subtitle: 'HEDENDAAGSE ABSTRACTE KUNST - OLIE OP DOEK',
    techniques: 'TECHNIEKEN',
    techniqueForeground: 'Voorgrond & Achtergrond',
    techniqueForegroundDesc: 'Met zijn penseelstreek creëert Claus Bertermann visuele spanning die de waarneming uitdaagt. De kijker heeft moeite om onderscheid te maken tussen voor- en achtergrond terwijl penseelstreken ogenschijnlijk tussen lagen verschuiven, waardoor een onmogelijke werkelijkheid ontstaat die boeit en verwart.',
    techniqueDimension: 'De Illusie van de Derde Dimensie',
    techniqueDimensionDesc: 'Claus Bertermann beheerst de subtiele kunst van diepte door precisie. Zijn penseelstreken genereren uitzonderlijke driedimensionale indrukken door heldere wendingen en zorgvuldig gemaakte hoeken. Deze illusie nodigt kijkers uit om diep in het werk te duiken en elementen zowel dichtbij als veraf waar te nemen.',
    techniqueScratching: 'Het Krassen van Verf',
    techniqueScratchingDesc: 'Bertermann verstoort de rust door krachtige, abrupte krassen die sterke contrasten creëren met omliggende penseelstreken. Zijn unieke verfkrassentechniek produceert korrelige structuren die af en toe het witte doek eronder of resten van dikke verf onthullen. Deze ruwe texturen wisselen af met zichtbare sporen—herinneringen aan onderliggende lagen.',
    techniqueLayers: 'De Superpositie van Meerdere Lagen',
    techniqueLayersDesc: 'Gekraste gebieden vermengen zich naadloos met penseelstreken op de voorgrond en achtergrond, wat resulteert in complexe superposities van texturen en lagen. Deze ingewikkelde techniek maakt de uiteindelijke compositie ongrijpbaar en bijna onbegrijpelijk, wat eindeloze verkenning uitnodigt.',
    viewGallery: 'Bekijk Galerij',
  },
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>('en');
  const [key, setKey] = useState(0);

  const t = (key: string): string => {
    return translations[language][key as keyof typeof translations.en] || key;
  };

  const handleSetLanguage = (lang: Language) => {
    setLanguage(lang);
    setKey(prev => prev + 1); // Force remount of SplitText components
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage: handleSetLanguage, t, remountKey: key }}>
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
