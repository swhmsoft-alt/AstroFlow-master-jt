const fs = require('fs');
const path = require('path');

const translationsDir = path.join(__dirname, '..', 'src', 'i18n', 'translations');
const frPath = path.join(translationsDir, 'fr.json');

const fr = JSON.parse(fs.readFileSync(frPath, 'utf8'));

const frTranslations = {
  // ===== PAGE META =====
  "industries.marine.page.title": "Usinage CNC du titane pour le maritime et le sous-marin | Ingénierie anticorrosion",
  "industries.marine.page.description": "Usinage CNC de précision pour boîtiers sous-marins en titane Grade 2/12, fixations marines et composants de capteurs océanographiques.",
  "industries.marine.page.serviceName": "Services d'usinage CNC du titane pour le maritime et le sous-marin",
  "industries.marine.page.serviceCategory": "Ingénierie maritime",
  "industries.marine.page.productName": "Boîtiers sous-marins, récipients sous pression, fixations marines et blocs de vannes",
  "industries.marine.page.productCategory": "Composants maritimes",

  // ===== HERO =====
  "industries.marine.hero.h1": "Usinage CNC du titane résistant à la corrosion pour le maritime et le sous-marin",
  "industries.marine.hero.subtitle": "Boîtiers sous-marins et récipients sous pression en titane usinés avec précision, conçus pour une pression hydrostatique à des kilomètres de profondeur. Le fraisage multiaxes du titane Grade 2 et Grade 5 élimine les concentrations de contraintes mécaniques.",
  "industries.marine.hero.badge": "Maritime et sous-marin",
  "industries.marine.hero.metric1.value": "±0,01mm",
  "industries.marine.hero.metric1.label": "Tolérance de position",
  "industries.marine.hero.metric2.value": "6000m",
  "industries.marine.hero.metric2.label": "Profondeur nominale",
  "industries.marine.hero.metric3.value": "Ra ≤ 0,8μm",
  "industries.marine.hero.metric3.label": "Rugosité de surface",
  "industries.marine.hero.chip0": "CNC 5 axes",
  "industries.marine.hero.chip1": "Grade 2/5 Ti",
  "industries.marine.hero.chip2": "Classe sous-marine",
  "industries.marine.hero.chip3": "Résistant à la corrosion",
  "industries.marine.hero.chip4": "Traçabilité MTR",

  // ===== SUBSEA SECTION =====
  "industries.marine.subsea.badge": "Ingénierie sous-marine",
  "industries.marine.subsea.title.main": "Fraisage CNC multiaxes",
  "industries.marine.subsea.title.suffix": "Boîtiers sous-marins, récipients sous pression et boîtiers de capteurs acoustiques",
  "industries.marine.subsea.desc": "Boîtiers sous-marins et récipients sous pression en titane usinés avec précision, conçus pour une pression hydrostatique à des kilomètres de profondeur. Le fraisage multiaxes du titane Grade 2 et Grade 5 à paroi épaisse élimine les concentrations de contraintes mécaniques.",
  "industries.marine.subsea.entityLabel": "Cluster d'entités",
  "industries.marine.subsea.entity.0": "Fraisage CNC multiaxes",
  "industries.marine.subsea.entity.1": "Boîtiers sous-marins",
  "industries.marine.subsea.entity.2": "Récipients sous pression",
  "industries.marine.subsea.entity.3": "Titane Grade 2",
  "industries.marine.subsea.entity.4": "Pression hydrostatique",
  "industries.marine.subsea.card1.title": "Récipients sous pression grande profondeur",
  "industries.marine.subsea.card1.subtitle": "CNC multiaxes · Grade 2/5 Ti · Pression hydrostatique",
  "industries.marine.subsea.card1.desc": "Les boîtiers sous pression et récipients sous pression grande profondeur en titane Grade 2 et Grade 5 sont usinés avec précision avec des sièges d'étanchéité à joint torique et une tolérance de position de ±0,01 mm pour garantir une étanchéité fiable à 6000 m de profondeur.",
  "industries.marine.subsea.card1.implLabel": "Mise en œuvre technique",
  "industries.marine.subsea.card1.item1": "Sièges d'étanchéité à joint torique — tolérance de position ±0,01 mm pour une étanchéité fiable à 6000 m",
  "industries.marine.subsea.card1.item2": "Séquences d'usinage sans contrainte — élimine les micro-déformations dans les limites de pression à paroi épaisse",
  "industries.marine.subsea.card1.item3": "Titane pur Grade 2 — résistance exceptionnelle à l'eau de mer sans réaction galvanique",
  "industries.marine.subsea.card2.title": "Boîtiers de capteurs acoustiques et de caméras",
  "industries.marine.subsea.card2.subtitle": "Fenêtres acoustiques à paroi mince · Grade 5 Ti · 6000 m",
  "industries.marine.subsea.card2.desc": "Les capteurs acoustiques sous-marins et les caméras d'imagerie nécessitent des boîtiers avec des géométries d'étanchéité complexes.",
  "industries.marine.subsea.card2.implLabel": "Mise en œuvre technique",
  "industries.marine.subsea.card2.item1": "Surfaces d'étanchéité des fenêtres acoustiques usinées à Ra 0,8 μm",
  "industries.marine.subsea.card2.item2": "Ports de passage de câbles avec faces d'étanchéité coniques pour 6000 m de profondeur",
  "industries.marine.subsea.card2.item3": "Vérification par test de pression hydrostatique à 100 % disponible",

  // ===== CORROSION SECTION =====
  "industries.marine.corrosion.badge": "Atténuation de la corrosion",
  "industries.marine.corrosion.title.main": "Tournage CNC de précision",
  "industries.marine.corrosion.title.suffix": "Fixations marines en titane Grade 12 et atténuation de la corrosion caverneuse",
  "industries.marine.corrosion.desc": "Tournage de précision spécialisé du titane Grade 12 (Ti-0,3Mo-0,8Ni) pour fixations marines et matériel de zone de projections.",
  "industries.marine.corrosion.entityLabel": "Cluster d'entités",
  "industries.marine.corrosion.entity.0": "Tournage CNC de précision",
  "industries.marine.corrosion.entity.1": "Grade 12 Ti-0,3Mo-0,8Ni",
  "industries.marine.corrosion.entity.2": "Fixations marines",
  "industries.marine.corrosion.entity.3": "Blocs de vannes",
  "industries.marine.corrosion.entity.4": "Corrosion caverneuse",
  "industries.marine.corrosion.card1.title": "Tournage du titane Grade 12",
  "industries.marine.corrosion.card1.subtitle": "Tournage CNC · Ti-0,3Mo-0,8Ni · Fixations marines",
  "industries.marine.corrosion.card1.desc": "Le titane Grade 12 (Ti-0,3Mo-0,8Ni) est conçu pour les environnements marins agressifs où les alliages de titane standard peuvent subir une corrosion caverneuse.",
  "industries.marine.corrosion.card1.implLabel": "Mise en œuvre technique",
  "industries.marine.corrosion.card1.item1": "Finition des filets Ra ≤ 0,4 μm — élimine la piqûration chlorée sur les filets de fixation",
  "industries.marine.corrosion.card1.item2": "Réduction à froid multipasse — prévient la fragilisation par l'hydrogène dans les fixations de zone de projections",
  "industries.marine.corrosion.card1.item3": "Inspection dimensionnelle et d'état de surface à 100 % — vérifie toutes les spécifications des fixations marines",
  "industries.marine.corrosion.card2.title": "Fabrication de blocs de vannes sous-marins",
  "industries.marine.corrosion.card2.subtitle": "Tournage CNC · Ra ≤ 0,4 μm · Formes de filets NPT",
  "industries.marine.corrosion.card2.desc": "Les systèmes hydrauliques sous-marins nécessitent des blocs de vannes avec des canaux de fluide résistants à la corrosion.",
  "industries.marine.corrosion.card2.implLabel": "Mise en œuvre technique",
  "industries.marine.corrosion.card2.item1": "Surfaces d'étanchéité polies miroir — éliminent les sites de corrosion caverneuse dans les interconnexions du corps de vanne",
  "industries.marine.corrosion.card2.item2": "Formes de filets NPT/API selon ASME B1.20.1 pour systèmes hydrauliques sous-marins",
  "industries.marine.corrosion.card2.item3": "Inspection par ressuage sur toutes les surfaces d'étanchéité — vérifie zéro défaut débouchant en surface",

  // ===== VALIDATION SECTION =====
  "industries.marine.validation.badge": "Validation & essais",
  "industries.marine.validation.title.main": "Validation dimensionnelle CMM",
  "industries.marine.validation.title.suffix": "Essais de pression hydrostatique et vérification des joints toriques",
  "industries.marine.validation.desc": "Contrôle dimensionnel absolu via validation CMM selon ASME Y14.5 GD&T, associé à des essais de pression hydrostatique documentés.",
  "industries.marine.validation.entityLabel": "Cluster d'entités",
  "industries.marine.validation.entity.0": "CMM (Machine à mesurer tridimensionnelle)",
  "industries.marine.validation.entity.1": "Essai de pression hydrostatique",
  "industries.marine.validation.entity.2": "GD&T des joints toriques",
  "industries.marine.validation.entity.3": "Test d'étanchéité à l'hélium",
  "industries.marine.validation.entity.4": "ASME Y14.5",
  "industries.marine.validation.card1.title": "Vérification CMM des joints toriques",
  "industries.marine.validation.card1.subtitle": "ZEISS CMM · ±1,9 μm · GD&T surface d'étanchéité",
  "industries.marine.validation.card1.desc": "L'intégrité des joints sous-marins commence par des logements de joint torique géométriquement parfaits.",
  "industries.marine.validation.card1.implLabel": "Mise en œuvre technique",
  "industries.marine.validation.card1.item1": "Vérification dimensionnelle de la gorge du joint torique",
  "industries.marine.validation.card1.item2": "Rugosité de surface d'étanchéité Ra ≤ 0,4 μm — assure le contrôle de la compression du joint torique",
  "industries.marine.validation.card1.item3": "Rapports CMM fournis avec chaque lot selon ASME Y14.5",
  "industries.marine.validation.card2.title": "Essai de pression hydrostatique",
  "industries.marine.validation.card2.subtitle": "1,5× pression nominale · Test d'étanchéité à l'hélium · Certification documentée",
  "industries.marine.validation.card2.desc": "Chaque composant sous-marin est soumis à un essai de pression hydrostatique à 1,5 fois la pression nominale.",
  "industries.marine.validation.card2.implLabel": "Mise en œuvre technique",
  "industries.marine.validation.card2.item1": "Test de pression hydrostatique à 1,5× la pression nominale avec certification documentée",
  "industries.marine.validation.card2.item2": "Test d'étanchéité à l'hélium disponible pour les assemblages critiques",
  "industries.marine.validation.card2.item3": "Certificats d'essai traçables jusqu'au numéro de série du composant",

  // ===== COMPLIANCE SECTION =====
  "industries.marine.compliance.badge": "Certification des matériaux",
  "industries.marine.compliance.title.main": "Traçabilité des matériaux",
  "industries.marine.compliance.title.suffix": "EN 10204 3.1 MTR, numéro de coulée et vérification de faible teneur en fer pour service maritime",
  "industries.marine.compliance.desc": "Chaque composant de qualité marine est accompagné de rapports d'essais en usine EN 10204 3.1 avec des numéros de coulée gravés en profondeur.",
  "industries.marine.compliance.entityLabel": "Cluster d'entités",
  "industries.marine.compliance.entity.0": "EN 10204 3.1 MTR",
  "industries.marine.compliance.entity.1": "Numéro de coulée",
  "industries.marine.compliance.entity.2": "Corrosion galvanique",
  "industries.marine.compliance.entity.3": "Faible teneur en fer Fe ≤ 0,20 %",
  "industries.marine.compliance.entity.4": "NACE SP0198",
  "industries.marine.compliance.pillar1.title": "EN 10204 3.1 & Marquage du numéro de coulée",
  "industries.marine.compliance.pillar1.desc": "Chaque lot de titane Grade 2, Grade 5 et Grade 12 est certifié avec une documentation EN 10204 Type 3.1.",
  "industries.marine.compliance.pillar1.item1": "Composition chimique vérifiée selon ASTM B265/B348 avec Fe ≤ 0,20 % pour le Grade 12",
  "industries.marine.compliance.pillar1.item2": "Numéro de coulée gravé en profondeur sur chaque composant pour une traçabilité permanente",
  "industries.marine.compliance.pillar1.item3": "Archivage numérique de plus de 10 ans — entièrement consultable pour audit réglementaire",
  "industries.marine.compliance.pillar2.title": "Prévention de la corrosion galvanique",
  "industries.marine.compliance.pillar2.desc": "Dans l'eau de mer, les couples galvaniques entre métaux dissemblables accélèrent la corrosion.",
  "industries.marine.compliance.pillar2.item1": "Le titane est noble par rapport à l'acier inoxydable, au cuivre et à l'aluminium",
  "industries.marine.compliance.pillar2.item2": "Contrôle de la contamination par le fer selon NACE SP0198",
  "industries.marine.compliance.pillar2.item3": "Outillage et circuits de liquide de refroidissement dédiés au titane de qualité marine",

  // ===== LEGACY KEYS =====
  "industries.marine.marinectasection.badge": "Lancez votre projet maritime",
  "industries.marine.marinectasection.title.main": "Usinage CNC du titane pour le maritime et le sous-marin ?",
};

// Add missing keys
let addedCount = 0;
let skippedCount = 0;
for (const [key, value] of Object.entries(frTranslations)) {
  if (!(key in fr)) {
    fr[key] = value;
    addedCount++;
  } else {
    skippedCount++;
  }
}

// Write sorted
const sorted = {};
Object.keys(fr).sort().forEach(k => { sorted[k] = fr[k]; });
fs.writeFileSync(frPath, JSON.stringify(sorted, null, 2) + '\n', 'utf8');

console.log(`Added: ${addedCount} keys, Skipped: ${skippedCount}`);
console.log(`Total marine keys: ${Object.keys(sorted).filter(k => k.startsWith('industries.marine.')).length}`);
