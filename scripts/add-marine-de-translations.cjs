const fs = require('fs');
const path = require('path');

const translationsDir = path.join(__dirname, '..', 'src', 'i18n', 'translations');
const dePath = path.join(translationsDir, 'de.json');

// Read existing files
const de = JSON.parse(fs.readFileSync(dePath, 'utf8'));

// All missing marine keys with German translations
const deTranslations = {
  // ===== PAGE META =====
  "industries.marine.page.title": "Marine & Unterwasser-Titan-CNC-Bearbeitung | Korrosionsschutztechnik",
  "industries.marine.page.description": "Präzisions-CNC-Bearbeitung für Unterwassergehäuse aus Titan Grad 2/12, Meeresbefestigungen und ozeanografische Sensorkomponenten.",
  "industries.marine.page.serviceName": "Marine & Unterwasser-Titan-CNC-Bearbeitungsdienstleistungen",
  "industries.marine.page.serviceCategory": "Meerestechnik",
  "industries.marine.page.productName": "Unterwassergehäuse, Druckbehälter, Meeresbefestigungen und Ventilblöcke",
  "industries.marine.page.productCategory": "Meereskomponenten",

  // ===== HERO =====
  "industries.marine.hero.h1": "Korrosionsbeständige Titan-CNC-Bearbeitung für Marine & Unterwasser",
  "industries.marine.hero.subtitle": "Präzisionsbearbeitete Titan-Unterwassergehäuse und Druckbehälter, ausgelegt für hydrostatischen Druck in Kilometertiefe. Mehrachsiges Fräsen von Titan Grad 2 und Grad 5 eliminiert mechanische Spannungskonzentrationen.",
  "industries.marine.hero.badge": "Marine & Unterwasser",
  "industries.marine.hero.metric1.value": "±0,01mm",
  "industries.marine.hero.metric1.label": "Positionstoleranz",
  "industries.marine.hero.metric2.value": "6000m",
  "industries.marine.hero.metric2.label": "Nenntiefe",
  "industries.marine.hero.metric3.value": "Ra ≤ 0,8μm",
  "industries.marine.hero.metric3.label": "Oberflächenrauheit",
  "industries.marine.hero.chip0": "5-Achsen-CNC",
  "industries.marine.hero.chip1": "Grad 2/5 Ti",
  "industries.marine.hero.chip2": "Unterwasserklasse",
  "industries.marine.hero.chip3": "Korrosionsbeständig",
  "industries.marine.hero.chip4": "MTR-Rückverfolgbarkeit",

  // ===== SUBSEA SECTION =====
  "industries.marine.subsea.badge": "Unterwassertechnik",
  "industries.marine.subsea.title.main": "Mehrachsiges CNC-Fräsen",
  "industries.marine.subsea.title.suffix": "Unterwassergehäuse, Druckbehälter und akustische Sensorgehäuse",
  "industries.marine.subsea.desc": "Präzisionsbearbeitete Titan-Unterwassergehäuse und Druckbehälter, ausgelegt für hydrostatischen Druck in Kilometertiefe. Mehrachsiges Fräsen von dickwandigem Titan Grad 2 und Grad 5 eliminiert mechanische Spannungskonzentrationen.",
  "industries.marine.subsea.entityLabel": "Entitätscluster",
  "industries.marine.subsea.entity.0": "Mehrachsiges CNC-Fräsen",
  "industries.marine.subsea.entity.1": "Unterwassergehäuse",
  "industries.marine.subsea.entity.2": "Druckbehälter",
  "industries.marine.subsea.entity.3": "Titan Grad 2",
  "industries.marine.subsea.entity.4": "Hydrostatischer Druck",
  "industries.marine.subsea.card1.title": "Tiefsee-Druckbehälter",
  "industries.marine.subsea.card1.subtitle": "Mehrachs-CNC · Grad 2/5 Ti · Hydrostatisch geprüft",
  "industries.marine.subsea.card1.desc": "Tiefsee-Druckgehäuse und Druckbehälter aus Titan Grad 2 und Grad 5 werden mit O-Ring-Dichtsitzen und ±0,01 mm Positionstoleranz präzisionsbearbeitet, um eine zuverlässige Abdichtung in 6000 m Tiefe zu gewährleisten.",
  "industries.marine.subsea.card1.implLabel": "Technische Umsetzung",
  "industries.marine.subsea.card1.item1": "O-Ring-Nutdichtsitze — ±0,01 mm Positionstoleranz für zuverlässige Abdichtung bei 6000 m Tiefe",
  "industries.marine.subsea.card1.item2": "Spannungsfreie Bearbeitungssequenzen — eliminiert Mikroverformungen in dickwandigen Druckgrenzen",
  "industries.marine.subsea.card1.item3": "Reintitan Grad 2 — außergewöhnliche Meerwasserbeständigkeit ohne galvanische Reaktion",
  "industries.marine.subsea.card2.title": "Akustische Sensor- und Kameragehäuse",
  "industries.marine.subsea.card2.subtitle": "Dünnwandige Schallfenster · Grad 5 Ti · 6000 m Tiefe",
  "industries.marine.subsea.card2.desc": "Unterwasser-Akustiksensoren und Bildkameras benötigen Gehäuse mit komplexen Dichtungsgeometrien.",
  "industries.marine.subsea.card2.implLabel": "Technische Umsetzung",
  "industries.marine.subsea.card2.item1": "Dichtflächen von Schallfenstern auf Ra 0,8 μm bearbeitet",
  "industries.marine.subsea.card2.item2": "Kabeldurchführungen mit konischen Dichtflächen, ausgelegt für 6000 m Tiefe",
  "industries.marine.subsea.card2.item3": "100 % hydrostatische Druckprüfung verfügbar",

  // ===== CORROSION SECTION =====
  "industries.marine.corrosion.badge": "Korrosionsminderung",
  "industries.marine.corrosion.title.main": "Präzisions-CNC-Drehen",
  "industries.marine.corrosion.title.suffix": "Meeresbefestigungen aus Titan Grad 12 und Spaltkorrosionsminderung",
  "industries.marine.corrosion.desc": "Spezialisiertes Präzisionsdrehen von Titan Grad 12 (Ti-0,3Mo-0,8Ni) für Meeresbefestigungen und Spritzwasserzonen-Hardware.",
  "industries.marine.corrosion.entityLabel": "Entitätscluster",
  "industries.marine.corrosion.entity.0": "Präzisions-CNC-Drehen",
  "industries.marine.corrosion.entity.1": "Grad 12 Ti-0,3Mo-0,8Ni",
  "industries.marine.corrosion.entity.2": "Meeresbefestigungen",
  "industries.marine.corrosion.entity.3": "Ventilblöcke",
  "industries.marine.corrosion.entity.4": "Spaltkorrosion",
  "industries.marine.corrosion.card1.title": "Drehen von Titan Grad 12",
  "industries.marine.corrosion.card1.subtitle": "CNC-Drehen · Ti-0,3Mo-0,8Ni · Meeresbefestigungen",
  "industries.marine.corrosion.card1.desc": "Titan Grad 12 (Ti-0,3Mo-0,8Ni) wurde für aggressive Meeresumgebungen entwickelt, in denen Standard-Titanlegierungen Spaltkorrosion ausgesetzt sein können.",
  "industries.marine.corrosion.card1.implLabel": "Technische Umsetzung",
  "industries.marine.corrosion.card1.item1": "Ra ≤ 0,4 μm Gewindeoberflächen — beseitigt Chlorid-Lochfraß an Befestigungsgewinden",
  "industries.marine.corrosion.card1.item2": "Mehrstufige Kaltreduzierung — verhindert Wasserstoffversprödung in Spritzwasserzonen-Befestigungen",
  "industries.marine.corrosion.card1.item3": "100 % Maß- und Oberflächenprüfung — bestätigt alle Spezifikationen für Meeresbefestigungen",
  "industries.marine.corrosion.card2.title": "Herstellung von Unterwasser-Ventilblöcken",
  "industries.marine.corrosion.card2.subtitle": "CNC-Drehen · Ra ≤ 0,4 μm · NPT-Gewindeformen",
  "industries.marine.corrosion.card2.desc": "Unterwasser-Hydrauliksysteme benötigen Ventilblöcke mit korrosionsbeständigen Fluidkanälen.",
  "industries.marine.corrosion.card2.implLabel": "Technische Umsetzung",
  "industries.marine.corrosion.card2.item1": "Hochglanzpolierte Dichtflächen — beseitigen Spaltkorrosionsstellen in Ventilgehäuseverbindungen",
  "industries.marine.corrosion.card2.item2": "NPT/API-Gewindeformen nach ASME B1.20.1 für Unterwasser-Hydrauliksysteme",
  "industries.marine.corrosion.card2.item3": "Farbeindringprüfung aller Dichtflächen — bestätigt null oberflächenbrechende Fehler",

  // ===== VALIDATION SECTION =====
  "industries.marine.validation.badge": "Validierung & Prüfung",
  "industries.marine.validation.title.main": "CMM-Maßvalidierung",
  "industries.marine.validation.title.suffix": "Hydrostatische Druckprüfung und O-Ring-Dichtungsvalidierung",
  "industries.marine.validation.desc": "Absolute Maßkontrolle durch CMM-Validierung nach ASME Y14.5 GD&T, kombiniert mit dokumentierter hydrostatischer Druckprüfung.",
  "industries.marine.validation.entityLabel": "Entitätscluster",
  "industries.marine.validation.entity.0": "CMM (Koordinatenmessmaschine)",
  "industries.marine.validation.entity.1": "Hydrostatische Druckprüfung",
  "industries.marine.validation.entity.2": "O-Ring-Dichtung GD&T",
  "industries.marine.validation.entity.3": "Helium-Lecktest",
  "industries.marine.validation.entity.4": "ASME Y14.5",
  "industries.marine.validation.card1.title": "CMM O-Ring-Dichtungsvalidierung",
  "industries.marine.validation.card1.subtitle": "ZEISS CMM · ±1,9 μm · Dichtflächen-GD&T",
  "industries.marine.validation.card1.desc": "Die Integrität von Unterwasserdichtungen beginnt mit geometrisch perfekten O-Ring-Aufnahmen.",
  "industries.marine.validation.card1.implLabel": "Technische Umsetzung",
  "industries.marine.validation.card1.item1": "Maßliche Prüfung der O-Ring-Nut",
  "industries.marine.validation.card1.item2": "Dichtflächenrauheit Ra ≤ 0,4 μm — gewährleistet Kontrolle des O-Ring-Drucksatzes",
  "industries.marine.validation.card1.item3": "CMM-Berichte für jede Charge nach ASME Y14.5",
  "industries.marine.validation.card2.title": "Hydrostatische Druckprüfung",
  "industries.marine.validation.card2.subtitle": "1,5-facher Nenndruck · Helium-Lecktest · Dokumentierte Zertifizierung",
  "industries.marine.validation.card2.desc": "Jede Unterwasserkomponente wird hydrostatisch auf den 1,5-fachen Nenntiefendruck geprüft.",
  "industries.marine.validation.card2.implLabel": "Technische Umsetzung",
  "industries.marine.validation.card2.item1": "Hydrostatische Druckprüfung auf 1,5-fachen Nenndruck mit dokumentierter Zertifizierung",
  "industries.marine.validation.card2.item2": "Helium-Lecktest für kritische Baugruppen verfügbar",
  "industries.marine.validation.card2.item3": "Prüfzertifikate rückverfolgbar bis zur Seriennummer der Komponente",

  // ===== COMPLIANCE SECTION =====
  "industries.marine.compliance.badge": "Materialzertifizierung",
  "industries.marine.compliance.title.main": "Materialrückverfolgbarkeit",
  "industries.marine.compliance.title.suffix": "EN 10204 3.1 MTR, Wärmenummer und Eisenarmut-Validierung für Marineanwendungen",
  "industries.marine.compliance.desc": "Jede Marinekomponente wird durch EN 10204 3.1-Werksprüfbescheinigungen mit tiefgeätzten Wärmenummern abgesichert.",
  "industries.marine.compliance.entityLabel": "Entitätscluster",
  "industries.marine.compliance.entity.0": "EN 10204 3.1 MTR",
  "industries.marine.compliance.entity.1": "Wärmenummer",
  "industries.marine.compliance.entity.2": "Galvanische Korrosion",
  "industries.marine.compliance.entity.3": "Eisenarmut Fe ≤ 0,20 %",
  "industries.marine.compliance.entity.4": "NACE SP0198",
  "industries.marine.compliance.pillar1.title": "EN 10204 3.1 & Wärmenummer-Markierung",
  "industries.marine.compliance.pillar1.desc": "Jede Charge von Titan Grad 2, Grad 5 und Grad 12 wird mit einer EN 10204 Typ 3.1 Dokumentation zertifiziert.",
  "industries.marine.compliance.pillar1.item1": "Chemische Zusammensetzung nach ASTM B265/B348 mit Fe ≤ 0,20 % für Grad 12",
  "industries.marine.compliance.pillar1.item2": "Tiefgeätzte Wärmenummer auf jeder Komponente für dauerhafte Rückverfolgbarkeit",
  "industries.marine.compliance.pillar1.item3": "Digitale Archivierung für über 10 Jahre — vollständig für behördliche Prüfungen abrufbar",
  "industries.marine.compliance.pillar2.title": "Galvanischer Korrosionsschutz",
  "industries.marine.compliance.pillar2.desc": "In Meerwasser beschleunigen galvanische Paare zwischen unterschiedlichen Metallen die Korrosion.",
  "industries.marine.compliance.pillar2.item1": "Titan ist edler gegenüber Edelstahl, Kupfer und Aluminium",
  "industries.marine.compliance.pillar2.item2": "Eisenkontaminationkontrolle nach NACE SP0198",
  "industries.marine.compliance.pillar2.item3": "Spezielle Werkzeuge und Kühlmittelleitungen für Marine-Titan",

  // ===== LEGACY KEYS =====
  "industries.marine.marinectasection.badge": "Starten Sie Ihr Marineprojekt",
  "industries.marine.marinectasection.title.main": "Marine- & Unterwasser-Titan-CNC-Bearbeitung?",
};

// Add missing keys to de.json
let addedCount = 0;
let skippedCount = 0;
for (const [key, value] of Object.entries(deTranslations)) {
  if (!(key in de)) {
    de[key] = value;
    addedCount++;
  } else {
    skippedCount++;
  }
}

// Write updated de.json with sorted keys
const sortedDe = {};
const sortedKeys = Object.keys(de).sort();
for (const key of sortedKeys) {
  sortedDe[key] = de[key];
}

fs.writeFileSync(dePath, JSON.stringify(sortedDe, null, 2) + '\n', 'utf8');

console.log(`=== Marine German Translation Summary ===`);
console.log(`Added: ${addedCount} keys`);
console.log(`Skipped (already existed): ${skippedCount} keys`);
console.log(`Total marine keys in de.json: ${Object.keys(sortedDe).filter(k => k.startsWith('industries.marine.')).length}`);
console.log(`Total keys in de.json: ${Object.keys(sortedDe).length}`);
console.log(`Done!`);
