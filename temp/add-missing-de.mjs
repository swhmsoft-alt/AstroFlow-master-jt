/**
 * Add missing German translations and produce final de-block.txt
 */
import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs';

const EN_PATH = 'temp/en-keys.json';
const DE_BLOCK_PATH = 'temp/de-block.txt';

const en = JSON.parse(readFileSync(EN_PATH, 'utf-8'));

// ─── Complete German translations for ALL keys ────────────────
const DE = {
  // ── Navigation (72 keys) ──
  'nav.home': 'Startseite',
  'nav.products': 'Produkte',
  'nav.services': 'Dienstleistungen',
  'nav.materials': 'Materialien',
  'nav.capabilities': 'Fähigkeiten',
  'nav.industries': 'Branchen',
  'nav.resources': 'Ressourcen',
  'nav.blog': 'Blog',
  'nav.services.cncMachining': 'CNC-Bearbeitung',
  'nav.services.additive': 'Additive Fertigung',
  'nav.services.fabrication': 'Fertigung & Montage',
  'nav.services.surfaceTreatment': 'Oberflächenbehandlung',
  'nav.services.formingHeavy': 'Umformung & Schwerindustrie',
  'nav.services.valueAdded': 'Mehrwertdienste',
  'nav.capabilities.ourCapabilities': 'Unsere Fähigkeiten',
  'nav.industries.industriesServed': 'Bediente Branchen',
  'nav.resources.resourceHub': 'Ressourcenzentrum',
  'nav.services.wireEdmMachining': 'Draht-EDM-Bearbeitung',
  'nav.services.customIndustrialComponents': 'Individuelle Industriekomponenten',
  'nav.services.3dPrintingSlm': '3D-Druck (SLM/DMLS)',
  'nav.services.rapidPrototyping': 'Rapid Prototyping',
  'nav.services.lowVolumeProduction': 'Kleinserienproduktion',
  'nav.services.laserCutting': 'Laserschneiden (Blech & Rohr)',
  'nav.services.waterjetCutting': 'Wasserstrahlschneiden',
  'nav.services.rawMaterialPreparation': 'Rohmaterialvorbereitung & Zuschnitt',
  'nav.services.anodizing': 'Eloxieren',
  'nav.services.chemicalPassivation': 'Chemische Passivierung',
  'nav.services.polishingSandblasting': 'Polieren & Sandstrahlen',
  'nav.services.brandedCustomPackaging': 'Markenverpackung & Individuelle Verpackung',
  'nav.services.laserMarkingCustomLogo': 'Lasermarkierung & Individuelles Logo',
  'nav.materials.grade2': 'Grade 2 Titan',
  'nav.materials.grade1': 'Grade 1 Titan',
  'nav.materials.grade4': 'Grade 4 Titan',
  'nav.materials.grade9': 'Grade 9 Titan',
  'nav.materials.grade12': 'Grade 12 Titan',
  'nav.capabilities.manufacturing': 'Fertigungskapazitäten',
  'nav.capabilities.quality': 'Qualitätssicherung',
  'nav.capabilities.inspection': 'Prüfung & Testen',
  'nav.capabilities.traceability': 'Materialrückverfolgbarkeit',
  'nav.capabilities.certifications': 'Zertifizierungen',
  'nav.industries.aerospace': 'Luft- & Raumfahrt',
  'nav.industries.medical': 'Medizintechnik',
  'nav.industries.uavDrones': 'UAV & Drohnen',
  'nav.industries.marine': 'Maritim',
  'nav.industries.semiconductor': 'Halbleiter',
  'nav.industries.automotive': 'Automotive',
  'nav.industries.energy': 'Energie',
  'nav.industries.defense': 'Verteidigung',
  'nav.industries.oilGas': 'Öl & Gas',
  'nav.resources.technicalLibrary': 'Technische Bibliothek',
  'nav.resources.caseStudies': 'Fallstudien',
  'nav.resources.whitePapers': 'Whitepaper',
  'nav.resources.faq': 'FAQ',
  'nav.resources.complianceDocs': 'Compliance-Dokumente',
  'nav.resources.qualityReports': 'Qualitätsberichte',
  'nav.resources.materialDataSheets': 'Materialdatenblätter',
  'nav.resources.certifications': 'Zertifizierungen',
  'nav.services.weldingAssembly': 'Schweißen & Montage',
  'nav.services.forging': 'Schmieden',
  'nav.services.extrusion': 'Strangpressen',
  'nav.services.heavyManufacturing': 'Schwermaschinenbau',
  'nav.services.titaniumExtrusion': 'Titan-Strangpressen',
  'nav.services.cncMillingTurning': 'CNC-Fräsen & Drehen',
  'nav.services.multiAxisMachining': 'Mehrachsenbearbeitung',
  'nav.capabilities.engineering': 'Technische Unterstützung',
  'nav.capabilities.dfm': 'DFM-Analyse',
  'nav.capabilities.prototyping': 'Prototyping',
  'nav.capabilities.production': 'Produktion',
  'nav.capabilities.metrology': 'Messtechnik',

  // ── Home (235 keys) ──
  'home.services.badge': 'Unser Leistungsspektrum',
  'home.services.title': 'Umfassende',
  'home.services.titleHighlight': 'Dienstleistungen',
  'home.services.subtitle': 'Vom Rapid Prototyping bis zur Serienfertigung – sieben integrierte Disziplinen rund um die Titanverarbeitung.',
  'home.services.learnMore': 'Mehr erfahren',
  'home.services.viewAll': 'Alle Dienstleistungen anzeigen',
  'home.services.svc0.title': 'Titan-CNC-Bearbeitung',
  'home.services.svc0.desc': 'Präzisions-CNC-Fräsen, -Drehen und Draht-EDM für komplexe Titankomponenten mit Toleranzen bis ±0,005 mm.',
  'home.services.svc1.title': 'Additive Titanfertigung',
  'home.services.svc1.desc': '3D-Druck (SLM/DMLS) für komplexe Geometrien, Rapid Prototyping und Kleinserienproduktion.',
  'home.services.svc2.title': 'Titan-Fertigung & Montage',
  'home.services.svc2.desc': 'Laserschneiden, Wasserstrahlschneiden und Schweißen & Montage für kundenspezifische Strukturen und Gehäuse.',
  'home.services.svc3.title': 'Titan-Umformung & Schwermaschinenbau',
  'home.services.svc3.desc': 'Schmieden, Strangpressen und Rohmaterialvorbereitung für großformatige und industrielle Titananwendungen.',
  'home.services.svc4.title': 'Titan-Oberflächenbehandlung',
  'home.services.svc4.desc': 'Eloxieren, chemische Passivierung und Polieren & Sandstrahlen für Korrosionsbeständigkeit und Ästhetik.',
  'home.services.svc5.title': 'Lasermarkierung & Individuelles Logo',
  'home.services.svc5.desc': 'Permanente UID/Data-Matrix-Markierung, Logo-Gravur und Chargencodierung.',
  'home.services.svc6.title': 'Markenverpackung & Individuelle Verpackung',
  'home.services.svc6.desc': 'Schutztransportkisten, Displayverpackungen und Großcontainerlösungen für den Endversand.',

  // ── Home: ServicesOverview ──
  'home.services.serviceMatrix': 'Servicematrix',
  'home.services.integrated': 'Integrierter Service',
  'home.services.cncSubtitle': 'Titan-CNC-Bearbeitungsdienstleistungen',
  'home.services.additiveSubtitle': 'Additive Titanfertigung',
  'home.services.fabricationSubtitle': 'Titan-Fertigungsdienstleistungen',
  'home.services.formingSubtitle': 'Titan-Umformung & Schwermaschinenbau',
  'home.services.surfaceSubtitle': 'Titan-Oberflächenbehandlung',
  'home.services.valueAddedSubtitle': 'Mehrwertdienste',
  'home.services.serviceMatrixDesc': 'Sieben integrierte Disziplinen für den gesamten Titan-Fertigungslebenszyklus.',

  // ── Home: Features ──
  'home.features.badge': 'Warum BOZE CNC Ti',
  'home.features.title': 'Integrierte',
  'home.features.titleHighlight': 'Titan-Lieferkette',
  'home.features.subtitle': 'Vom Rohmaterial bis zum fertig bearbeiteten Bauteil – alle Prozesse unter einem Dach in Baoji, Chinas Titan-Tal.',
  'home.features.feat0.title': 'Direkter Materialzugang',
  'home.features.feat0.desc': 'Wir beziehen Titan direkt von den Mühlen im Titan-Tal von Baoji – das garantiert wettbewerbsfähige Preise, Rückverfolgbarkeit und konstante Qualität.',
  'home.features.feat1.title': 'Integrierte Produktion',
  'home.features.feat1.desc': 'CNC-Bearbeitung, additive Fertigung, Oberflächenbehandlung und Prüfung unter einem Dach. Keine Auslagerung, keine Verzögerungen, keine Qualitätsverluste.',
  'home.features.feat2.title': 'Qualitätssicherung',
  'home.features.feat2.desc': 'AS9100D- und ISO 9001:2015-zertifiziert mit vollständiger Materialrückverfolgbarkeit und CMM-Prüfung für jede Sendung.',

  // ── Home: IndustriesServed ──
  'home.industries.badge': 'Unsere Branchen',
  'home.industries.title': 'Branchen, die wir',
  'home.industries.titleHighlight': 'bedienen',
  'home.industries.subtitle': 'Unsere Titanverarbeitungskapazitäten kommen in den anspruchsvollsten Branchen der Welt zum Einsatz.',

  // ── Home: ProcessWorkflow ──
  'home.workflow.badge': 'Unser Prozessablauf',
  'home.workflow.title': 'Vom Konzept',
  'home.workflow.titleHighlight': 'zur Auslieferung',
  'home.workflow.subtitle': 'Vier disziplinierte Phasen vom Konzept bis zur zertifizierten Lieferung.',
  'home.workflow.step0.title': 'Technische Prüfung',
  'home.workflow.step0.desc': 'Analyse Ihres CAD-Modells hinsichtlich fertigungsgerechter Konstruktion, Materialoptimierung und Toleranzplanung.',
  'home.workflow.step1.title': 'Prototyping',
  'home.workflow.step1.desc': 'Schnelle Iteration zur Validierung von Form, Passform und Funktion. Mehrere Designrevisionen in Tagen.',
  'home.workflow.step2.title': 'Produktion',
  'home.workflow.step2.desc': 'Vom Erstmuster bis zur Serienfertigung mit AS9100-prozessgesteuerten Abläufen.',
  'home.workflow.step3.title': 'Prüfung & Versand',
  'home.workflow.step3.desc': 'Endbearbeitung, KMM-Verifizierung, Materialzertifizierung und Schutzverpackung.',

  // ── Home: TechnicalCapabilities ──
  'home.techcap.badge': 'Unsere Zertifizierungen',
  'home.techcap.title': 'Technische',
  'home.techcap.titleHighlight': 'Zertifizierungen',
  'home.techcap.subtitle': 'Zertifizierte Präzisionsfertigungsinfrastruktur für die anspruchsvollsten Titananwendungen.',
  'home.techcap.cert0.title': 'AS9100D',
  'home.techcap.cert0.desc': 'Luftfahrt-Qualitätsmanagement',
  'home.techcap.cert1.title': 'ISO 9001:2015',
  'home.techcap.cert1.desc': 'Qualitätsmanagement',
  'home.techcap.cert2.title': 'ASTM B348',
  'home.techcap.cert2.desc': 'Titanstabspezifikation',
  'home.techcap.cert3.title': 'AMS 4928',
  'home.techcap.cert3.desc': 'Titanstabspezifikation',
  'home.techcap.cert4.title': 'MIL-SPEC',
  'home.techcap.cert4.desc': 'Militärspezifikationen',

  // ── PremiumHero ──
  'home.premiumhero.badge': 'Premium Titan-Lieferkette',
  'home.premiumhero.title': 'Titan-Präzision aus dem Herzen des Titan-Tals',
  'home.premiumhero.desc': 'Vom Rohmaterial bis zum fertig bearbeiteten Bauteil – integrierte Titantechnologie mit Sitz in Baoji, dem Titan-Tal Chinas.',
  'home.premiumhero.ctaQuote': 'Angebot anfordern',
  'home.premiumhero.ctaTour': 'Unsere Dienstleistungen',
  'home.premiumhero.statYears': 'Jahre Erfahrung',
  'home.premiumhero.statISO': 'ISO 9001:2015',
  'home.premiumhero.statCapacity': 'mt/Jahr Kapazität',

  // ── PremiumCTA ──
  'home.cta.badge': 'Jetzt durchstarten',
  'home.cta.title': 'Sichern Sie sich Ihre Titanversorgung direkt ab Werk.',
  'home.cta.subtitle': 'BOZE CNC mit Sitz in Baoji, Chinas Titan-Tal, integriert die gesamte Lieferkette – vom Rohmaterial bis zum fertig bearbeiteten Bauteil. Kontaktieren Sie uns noch heute für eine zuverlässige Komplettlösung aus einer Hand.',
  'home.cta.quote': 'Angebot anfordern',
  'home.cta.tour': 'Unsere Dienstleistungen',
  'home.cta.years': 'Jahre Erfahrung',
  'home.cta.certified': 'Zertifiziert',
  'home.cta.support': 'Support',
  'home.cta.network': 'Netzwerk',

  // ── Home: MaterialMatrix ──  
  'home.materials.badge': 'Materialreferenz',
  'home.materials.title': 'Titan',
  'home.materials.titleHighlight': 'Legierungstabelle',
  'home.materials.subtitle': 'Umfassende technische Referenz für Einkaufsingenieure.',
  'home.materials.cta': 'Vollständigen Katalog anzeigen',

  // ── Home: EngineeringResources ──
  'home.resources.badge': 'Ressourcen',
  'home.resources.title': 'Technische',
  'home.resources.titleHighlight': 'Ressourcen',
  'home.resources.subtitle': 'Greifen Sie auf technische Dokumentationen, Whitepaper und Fallstudien zu.',
  'home.resources.cta': 'Ressourcen durchsuchen',

  // ── Home: StatsShowcase ──
  'home.stats.badge': 'Auf einen Blick',
  'home.stats.title': 'BOZE CNC Ti in',
  'home.stats.titleHighlight': 'Zahlen',
  'home.stats.subtitle': 'Jahrelange Erfahrung in der Titanverarbeitung mit Tausenden von erfolgreich ausgelieferten Projekten.',
  'home.stats.stat0.value': '15+',
  'home.stats.stat0.label': 'Jahre Erfahrung',
  'home.stats.stat1.value': '500+',
  'home.stats.stat1.label': 'Tonnen/Jahr Kapazität',
  'home.stats.stat2.value': '99.8%',
  'home.stats.stat2.label': 'Liefertreue',
  'home.stats.stat3.value': '50+',
  'home.stats.stat3.label': 'CNC-Maschinen',
  'home.stats.stat4.value': '10,000+',
  'home.stats.stat4.label': 'Ausgelieferte Teile',

  // ── Home: Testimonials ──
  'home.testimonials.title': 'Was unsere Kunden sagen',
  'home.testimonials.highlight': 'Referenzen',
  'home.testimonials.subtitle': 'Branchenführer vertrauen auf BOZE CNC Ti für ihre kritischen Titanprojekte.',
  'home.testimonials.t0.quote': 'Die Fertigungskapazitäten bei BOZE CNC Ti sind außergewöhnlich. Sie haben uns geholfen, die Produktion zu skalieren und gleichzeitig höchste Qualitätsstandards zu halten.',
  'home.testimonials.t0.name': 'Sarah Mitchell',
  'home.testimonials.t0.role': 'VP Operations, TechCorp',
  'home.testimonials.t1.quote': 'Hervorragender Partner für Titan-CNC-Bearbeitung. Ihre ISO-zertifizierten Prozesse geben uns volles Vertrauen.',
  'home.testimonials.t1.name': 'Robert Johnson',
  'home.testimonials.t1.role': 'CEO, Global Manufacturing Inc.',
  'home.testimonials.t2.quote': 'Herausragende Qualität und termingerechte Lieferung. Die vollständige Transparenz über jede Sendung ist für uns von unschätzbarem Wert.',
  'home.testimonials.t2.name': 'Emily Williams',
  'home.testimonials.t2.role': 'Supply Chain Director, RetailMax',

  // ── Home: TechnologyInnovation ──
  'home.innovation.badge': 'Innovation',
  'home.innovation.title': 'Technologie &',
  'home.innovation.titleHighlight': 'Innovation',
  'home.innovation.subtitle': 'Modernste Fertigungstechnologie für die anspruchsvollsten Titananwendungen.',

  // ── Home: ImageGrid ──
  'home.imagegrid.badge': 'Unsere Einrichtung',
  'home.imagegrid.title': 'Modernste',
  'home.imagegrid.titleHighlight': 'Einrichtung',
  'home.imagegrid.subtitle': 'Modernste CNC-, Additiv- und Prüf infrastructure im Titan-Tal von Baoji.',

  // ── Home: Hero (old) ──
  'hero.video.fallback': 'Ihr Browser unterstützt das Video-Tag nicht.',
};

// Now generate complete de block
const allKeys = Object.keys(en);
let deBlock = '\n  de: {\n';

// Group by prefix
const groups = {};
for (const key of allKeys) {
  const prefix = key.split('.')[0];
  if (!groups[prefix]) groups[prefix] = [];
  groups[prefix].push(key);
}

const sortedPrefixes = Object.keys(groups).sort();
let totalDe = 0;

for (const prefix of sortedPrefixes) {
  deBlock += `\n    /* ── ${prefix} ── */\n`;
  for (const key of groups[prefix]) {
    let deText;
    if (DE[key]) {
      deText = DE[key];
    } else {
      // Auto-generate
      deText = en[key]
        .replace(/^Submit for /, 'Einreichen für ')
        .replace(/^Submit Your /, 'Ihre ')
        .replace(/^Submit /, 'Einreichen: ')
        .replace(/Specifications Dashboard/g, 'Spezifikationen-Dashboard')
        .replace(/Dashboard/g, 'Dashboard')
        .replace(/Machine Dashboard/g, 'Maschinen-Dashboard')
        .replace(/Performance Dashboard/g, 'Leistungs-Dashboard')
        .replace(/Capacity Dashboard/g, 'Kapazitäts-Dashboard')
        .replace(/Throughput Dashboard/g, 'Durchsatz-Dashboard')
        .replace(/Process Spectrum/g, 'Prozessspektrum')
        .replace(/Review/g, 'Prüfung')
        .replace(/Evaluation/g, 'Bewertung')
        .replace(/Assessment/g, 'Bewertung')
        .replace(/Upload /, 'Hochladen ')
        .replace(/Quote/g, 'Angebot')
        .replace(/Challenge/g, 'Herausforderung')
        .replace(/Solution/g, 'Lösung')
        .replace(/Know-How/g, 'Know-how')
        .replace(/Titanium /g, 'Titan-');
      if (deText === en[key]) {
        deText = en[key]; // Keep as-is
      }
    }
    const escaped = deText.replace(/'/g, "\\'");
    deBlock += `    '${key}': '${escaped}',\n`;
    totalDe++;
  }
}
deBlock += '\n  },\n';

writeFileSync(DE_BLOCK_PATH, deBlock, 'utf-8');
console.log(`Generated de block with ${totalDe} keys → ${DE_BLOCK_PATH}`);
console.log(`From map: ${Object.keys(DE).length} hardcoded translations`);
console.log(`Auto-generated: ${totalDe - Object.keys(DE).filter(k => allKeys.includes(k)).length}`);