const fs = require('fs'), path = require('path');
const dir = path.join(__dirname, '..', 'src', 'i18n', 'translations');
const enPath = path.join(dir, 'en.json');
const dePath = path.join(dir, 'de.json');

const en = JSON.parse(fs.readFileSync(enPath, 'utf8'));
const de = JSON.parse(fs.readFileSync(dePath, 'utf8'));

// ==================== ALL KEYS FOR SEMICONDUCTOR ====================
const enKeys = {
  // Hero (new)
  "industries.semi.hero.h1": "Semiconductor Titanium CNC Machining | Ultra-Precision Engineering",
  "industries.semi.hero.subtitle": "Sub-micron precision CNC machining of Grade 2 and Grade 5 Titanium for wafer processing vacuum chambers, micro-hole gas showerheads, and UHV process components. Zero-particle Class 100 cleanroom environment.",
  "industries.semi.hero.badge": "Semiconductor Equipment",
  "industries.semi.hero.metric1.value": "±1.9μm",
  "industries.semi.hero.metric1.label": "CMM Precision",
  "industries.semi.hero.metric2.value": "Ra ≤ 0.1μm",
  "industries.semi.hero.metric2.label": "Mirror Finish",
  "industries.semi.hero.metric3.value": "10⁻⁹ Torr",
  "industries.semi.hero.metric3.label": "UHV Compatible",
  "industries.semi.hero.chip0": "5-Axis CNC",
  "industries.semi.hero.chip1": "Grade 2/5 Ti",
  "industries.semi.hero.chip2": "UHV Rated",
  "industries.semi.hero.chip3": "Class 100",
  "industries.semi.hero.chip4": "Zero Particle",

  // UHV Section - badge is already in en.json, title.main is already in en.json
  "industries.semi.uhv.badge": "UHV Vacuum Chambers",
  "industries.semi.uhv.title.suffix": "— Wafer Processing Vacuum Chambers & UHV Lithography Sub-Assemblies",
  "industries.semi.uhv.desc": "Ultra-precision 5-axis milling of Grade 2 and Grade 5 Titanium for semiconductor vacuum chambers and EUV/DUV lithography sub-assemblies. Titanium's inherently low vapor pressure and outgassing rate — combined with our sub-micron GD&T control — delivers sealing surfaces compatible with 10⁻⁹ Torr ultra-high vacuum environments.",
  "industries.semi.uhv.entityLabel": "Entity Cluster",
  "industries.semi.uhv.entity.0": "5-Axis Ultra-Precision CNC Milling",
  "industries.semi.uhv.entity.1": "UHV Vacuum Chambers",
  "industries.semi.uhv.entity.2": "EUV/DUV Lithography",
  "industries.semi.uhv.entity.3": "Grade 2 Titanium",
  "industries.semi.uhv.entity.4": "Outgassing Mitigation",
  "industries.semi.uhv.card1.title": "UHV Vacuum Chamber Milling",
  "industries.semi.uhv.card1.subtitle": "5-Axis CNC · Grade 2/5 Ti · UHV 10⁻⁹ Torr",
  "industries.semi.uhv.card1.desc": "Semiconductor vacuum chambers and EUV/DUV lithography sub-assemblies demand sealing surfaces with sub-micron flatness and Ra ≤ 0.4 µm finish. Our 5-axis ultra-precision milling centers machine Grade 2 and Grade 5 Titanium to GD&T tolerances that prevent gas leakage pathways and particle generation at 10⁻⁹ Torr vacuum levels.",
  "industries.semi.uhv.card1.implLabel": "Technical Implementation",
  "industries.semi.uhv.card1.item1": "Sealing surface flatness ≤ 1 µm per 300 mm — prevents gas leakage at UHV 10⁻⁹ Torr",
  "industries.semi.uhv.card1.item2": "Ra ≤ 0.4 µm sealing finishes — eliminates micro-gaps that trap process gases",
  "industries.semi.uhv.card1.item3": "Sub-micron GD&T profile control — helium leak rates < 1×10⁻⁹ atm·cc/sec",
  "industries.semi.uhv.card2.title": "Outgassing Mitigation",
  "industries.semi.uhv.card2.subtitle": "Electropolishing · Vacuum Bake-Out · Low Vapor Pressure",
  "industries.semi.uhv.card2.desc": "Titanium's native oxide layer and inherently low vapor pressure make it ideal for UHV environments. Our electropolishing and vacuum bake-out processes further reduce outgassing rates, ensuring chamber integrity for critical CVD/ALD thin-film deposition processes.",
  "industries.semi.uhv.card2.implLabel": "Technical Implementation",
  "industries.semi.uhv.card2.item1": "Electropolishing removes surface contamination — outgassing rate < 1×10⁻¹² Torr·L/sec·cm²",
  "industries.semi.uhv.card2.item2": "Vacuum bake-out at 250°C desorbs water vapor and hydrocarbons before final assembly",
  "industries.semi.uhv.card2.item3": "Titanium's native TiO₂ layer prevents hydrogen permeation at elevated process temperatures",

  // Micro-Drill Section
  "industries.semi.microdrill.badge": "Micro-Gas Delivery",
  "industries.semi.microdrill.title.suffix": "— Gas Distribution Showerheads, Gas Box Components & Mirror-Finish Ra ≤ 0.1 µm",
  "industries.semi.microdrill.desc": "High-aspect-ratio CNC micro-drilling of Grade 5 Titanium for semiconductor gas distribution showerheads, gas box manifolds, and process kit components. Mirror-finish surfaces (Ra ≤ 0.1 µm) combined with precision micro-hole arrays optimize gas flow uniformity for CVD, ALD, and etch chamber processes.",
  "industries.semi.microdrill.entityLabel": "Entity Cluster",
  "industries.semi.microdrill.entity.0": "CNC Micro-Drilling",
  "industries.semi.microdrill.entity.1": "Gas Distribution Showerheads",
  "industries.semi.microdrill.entity.2": "Mirror Finish Ra ≤ 0.1 µm",
  "industries.semi.microdrill.entity.3": "Electropolishing",
  "industries.semi.microdrill.entity.4": "CVD/ALD",
  "industries.semi.microdrill.card1.title": "Micro-Hole Gas Showerhead Drilling",
  "industries.semi.microdrill.card1.subtitle": "CNC Micro-Drilling · Ø0.2mm–1.5mm · 20:1 Aspect Ratio",
  "industries.semi.microdrill.card1.desc": "Precision micro-hole arrays in gas distribution showerheads control precursor uniformity across 300 mm wafers. Our CNC micro-drilling centers produce hole diameters from 0.2 mm to 1.5 mm with depth-to-diameter aspect ratios up to 20:1, maintaining positional accuracy within ±5 µm.",
  "industries.semi.microdrill.card1.implLabel": "Technical Implementation",
  "industries.semi.microdrill.card1.item1": "Hole diameter Ø0.2mm–1.5mm with ±5 µm positional accuracy across entire showerhead",
  "industries.semi.microdrill.card1.item2": "20:1 depth-to-diameter aspect ratio — enables uniform gas distribution for 300 mm wafer processing",
  "industries.semi.microdrill.card1.item3": "Burr-free hole exits with Ra ≤ 0.4 µm internal finish — prevents particle generation in gas flow",
  "industries.semi.microdrill.card2.title": "Mirror-Finish Electropolishing",
  "industries.semi.microdrill.card2.subtitle": "Electropolishing · Ra ≤ 0.1 µm · Native TiO₂ Passivation",
  "industries.semi.microdrill.card2.desc": "Electropolishing of titanium gas distribution components eliminates surface contaminants that could shed particles during operation. The resulting mirror finish (Ra ≤ 0.1 µm) creates a chemically clean surface that resists precursor adsorption and minimizes chamber memory effects.",
  "industries.semi.microdrill.card2.implLabel": "Technical Implementation",
  "industries.semi.microdrill.card2.item1": "Electropolishing removes 10-20 µm deformed layer — eliminates embedded micro-burrs and contaminants",
  "industries.semi.microdrill.card2.item2": "Mirror finish Ra ≤ 0.1 µm — prevents precursor adsorption and chamber memory effects",
  "industries.semi.microdrill.card2.item3": "Chemical passivation restores native TiO₂ layer — maximizes corrosion resistance to process gases",

  // Cleanroom Section
  "industries.semi.cleanroom.badge": "Contamination Control",
  "industries.semi.cleanroom.title.suffix": "— Multi-Stage Cleaning & Zero-Particle Packaging for 2nm/3nm Wafer Fab",
  "industries.semi.cleanroom.desc": "Every semiconductor component is processed through a multi-stage precision cleaning line and packaged in our Class 100 (ISO 5) cleanroom. From ultrasonic degreasing to DI water rinsing and HEPA-filtered drying, each stage is validated to ensure zero-particle integration into wafer fabrication equipment.",
  "industries.semi.cleanroom.entityLabel": "Entity Cluster",
  "industries.semi.cleanroom.entity.0": "Class 100 Cleanroom",
  "industries.semi.cleanroom.entity.1": "Ultrasonic Cleaning",
  "industries.semi.cleanroom.entity.2": "DI Water Rinsing",
  "industries.semi.cleanroom.entity.3": "Zero-Particle Packaging",
  "industries.semi.cleanroom.entity.4": "ISO 5",
  "industries.semi.cleanroom.card1.title": "Class 100 (ISO 5) Cleanroom Processing",
  "industries.semi.cleanroom.card1.subtitle": "Class 100 · ISO 5 · Zero-Particle Certified",
  "industries.semi.cleanroom.card1.desc": "Our Class 100 (ISO 5) cleanroom environment guarantees that semiconductor components are assembled, inspected, and packaged in a controlled atmosphere. HEPA-filtered airflow, positive pressure, and strict gowning protocols eliminate particle contamination down to 0.5 µm particle counts below 100 per cubic foot.",
  "industries.semi.cleanroom.card1.implLabel": "Technical Implementation",
  "industries.semi.cleanroom.card1.item1": "HEPA-filtered vertical laminar airflow — ≤ 100 particles (≥0.5 µm) per ft³",
  "industries.semi.cleanroom.card1.item2": "Positive pressure differential — prevents ingress of unfiltered air",
  "industries.semi.cleanroom.card1.item3": "Full-body cleanroom gowning with anti-static footwear — zero human-shed particle contamination",
  "industries.semi.cleanroom.card2.title": "Multi-Stage Precision Cleaning",
  "industries.semi.cleanroom.card2.subtitle": "Ultrasonic · DI Rinse · Validation",
  "industries.semi.cleanroom.card2.desc": "Each component undergoes a validated multi-stage cleaning process: ultrasonic solvent degreasing to remove machining oils, alkaline aqueous wash, DI water rinsing to 18 MΩ·cm resistivity, and HEPA-filtered hot air drying. Post-cleaning verification ensures organic contamination below 10 µg/cm².",
  "industries.semi.cleanroom.card2.implLabel": "Technical Implementation",
  "industries.semi.cleanroom.card2.item1": "Ultrasonic degreasing with semiconductor-grade solvents — removes all machining residues",
  "industries.semi.cleanroom.card2.item2": "DI water rinse to 18 MΩ·cm resistivity — zero ionic contamination on component surfaces",
  "industries.semi.cleanroom.card2.item3": "Post-cleaning organic verification — residual contamination < 10 µg/cm²",

  // Compliance Section
  "industries.semi.compliance.badge": "Material Certification",
  "industries.semi.compliance.title.suffix": "— EN 10204 3.1 MTR & Metallurgical Purity for Aggressive Plasma Chemistries",
  "industries.semi.compliance.desc": "Every semiconductor-grade titanium component is backed by full material traceability documentation. Our EN 10204 3.1 Mill Test Reports certify chemical composition and mechanical properties, while documented metallurgical uniformity confirms grain structure suitable for aggressive fluorine- and chlorine-based plasma chemistries.",
  "industries.semi.compliance.entityLabel": "Entity Cluster",
  "industries.semi.compliance.entity.0": "EN 10204 3.1 MTR",
  "industries.semi.compliance.entity.1": "Metallurgical Uniformity",
  "industries.semi.compliance.entity.2": "SEM/EDX",
  "industries.semi.compliance.entity.3": "Grain Structure",
  "industries.semi.compliance.entity.4": "ASME Y14.5 GD&T",
  "industries.semi.compliance.pillar1.title": "Full Material Traceability",
  "industries.semi.compliance.pillar1.desc": "Each Grade 2, Grade 5, and Grade 12 titanium lot is certified with EN 10204 Type 3.1 documentation including complete chemical composition and mechanical property verification.",
  "industries.semi.compliance.pillar1.item1": "Chemical composition per ASTM B265/B348 — full element analysis for each heat",
  "industries.semi.compliance.pillar1.item2": "Mechanical properties certified — tensile strength, yield strength, elongation, and hardness",
  "industries.semi.compliance.pillar1.item3": "Heat number marked and digitally archived — 10+ year traceability for regulatory audit",
  "industries.semi.compliance.pillar2.title": "Metallurgical Integrity for Plasma Environments",
  "industries.semi.compliance.pillar2.desc": "Aggressive semiconductor plasma chemistries demand consistent grain structure and absence of inclusions. Our documented metallurgical verification ensures titanium components withstand fluorine and chlorine plasma without preferential etching or particle generation.",
  "industries.semi.compliance.pillar2.item1": "Fine equiaxed grain structure verified — prevents preferential grain boundary etching in plasma",
  "industries.semi.compliance.pillar2.item2": "Non-metallic inclusion rating per ASTM E45 — zero inclusions that could nucleate plasma arcing",
  "industries.semi.compliance.pillar2.item3": "SEM/EDX verification on all sealing surfaces — confirms no embedded foreign material",

  // CTA Section badge items (hardcoded in component)
  "industries.semi.cta.badge5": "UHV Compatible",
  "industries.semi.cta.badge6": "Micro-Drilling Ø0.2mm",
  "industries.semi.cta.badge7": "Ra ≤ 0.1 µm Mirror",
  "industries.semi.cta.badge8": "Class 100 Cleanroom",
};

// ==================== GERMAN TRANSLATIONS ====================
const deKeys = {
  "industries.semi.hero.h1": "Halbleiter-Titan-CNC-Bearbeitung | Ultra-Präzisionstechnik",
  "industries.semi.hero.subtitle": "Submikrometer-Präzisions-CNC-Bearbeitung von Titan Grad 2 und Grad 5 für Wafer-Prozessvakuumkammern, Mikroloch-Gasduschköpfe und UHV-Prozesskomponenten. Partikelfreie Klasse-100-Reinraumumgebung.",
  "industries.semi.hero.badge": "Halbleiterausrüstung",
  "industries.semi.hero.metric1.value": "±1,9μm",
  "industries.semi.hero.metric1.label": "CMM-Präzision",
  "industries.semi.hero.metric2.value": "Ra ≤ 0,1μm",
  "industries.semi.hero.metric2.label": "Spiegeloberfläche",
  "industries.semi.hero.metric3.value": "10⁻⁹ Torr",
  "industries.semi.hero.metric3.label": "UHV-kompatibel",
  "industries.semi.hero.chip0": "5-Achsen-CNC",
  "industries.semi.hero.chip1": "Grad 2/5 Ti",
  "industries.semi.hero.chip2": "UHV-geprüft",
  "industries.semi.hero.chip3": "Klasse 100",
  "industries.semi.hero.chip4": "Null Partikel",

  "industries.semi.uhv.badge": "UHV Vakuumkammern",
  "industries.semi.uhv.title.suffix": "— Wafer-Prozessvakuumkammern und UHV-Lithographie-Baugruppen",
  "industries.semi.uhv.desc": "Ultrapräzises 5-Achsen-Fräsen von Titan Grad 2 und Grad 5 für Halbleiter-Vakuumkammern und EUV/DUV-Lithographie-Baugruppen. Die inhärent niedrige Dampfdruck- und Ausgasungsrate von Titan — kombiniert mit unserer Submikrometer-GD&T-Kontrolle — liefert Dichtflächen, die mit 10⁻⁹ Torr Ultrahochvakuum-Umgebungen kompatibel sind.",
  "industries.semi.uhv.entityLabel": "Entitätscluster",
  "industries.semi.uhv.entity.0": "5-Achsen-Ultrapräzisions-CNC-Fräsen",
  "industries.semi.uhv.entity.1": "UHV Vakuumkammern",
  "industries.semi.uhv.entity.2": "EUV/DUV-Lithographie",
  "industries.semi.uhv.entity.3": "Titan Grad 2",
  "industries.semi.uhv.entity.4": "Ausgasungsminderung",
  "industries.semi.uhv.card1.title": "UHV Vakuumkammer-Fräsen",
  "industries.semi.uhv.card1.subtitle": "5-Achsen-CNC · Grad 2/5 Ti · UHV 10⁻⁹ Torr",
  "industries.semi.uhv.card1.desc": "Halbleiter-Vakuumkammern und EUV/DUV-Lithographie-Baugruppen erfordern Dichtflächen mit Submikrometer-Planheit und Ra ≤ 0,4 μm Oberfläche. Unsere 5-Achsen-Ultrapräzisions-Fräszentren bearbeiten Titan Grad 2 und Grad 5 mit GD&T-Toleranzen, die Gasleckwege und Partikelbildung bei 10⁻⁹ Torr Vakuumniveau verhindern.",
  "industries.semi.uhv.card1.implLabel": "Technische Umsetzung",
  "industries.semi.uhv.card1.item1": "Dichtflächenplanheit ≤ 1 μm pro 300 mm — verhindert Gasleckage bei UHV 10⁻⁹ Torr",
  "industries.semi.uhv.card1.item2": "Dichtflächen Ra ≤ 0,4 μm — eliminiert Mikrospalte, die Prozessgase einschließen",
  "industries.semi.uhv.card1.item3": "Submikrometer-GD&T-Profilkontrolle — Helium-Leckraten < 1×10⁻⁹ atm·cc/sec",
  "industries.semi.uhv.card2.title": "Ausgasungsminderung",
  "industries.semi.uhv.card2.subtitle": "Elektropolieren · Vakuum-Ausheizen · Niedriger Dampfdruck",
  "industries.semi.uhv.card2.desc": "Die native Oxidschicht und der inhärent niedrige Dampfdruck von Titan machen es ideal für UHV-Umgebungen. Unsere Elektropolier- und Vakuum-Ausheizprozesse reduzieren die Ausgasungsraten weiter und gewährleisten die Kammerintegrität für kritische CVD/ALD-Dünnschichtabscheidungsprozesse.",
  "industries.semi.uhv.card2.implLabel": "Technische Umsetzung",
  "industries.semi.uhv.card2.item1": "Elektropolieren entfernt Oberflächenverunreinigungen — Ausgasungsrate < 1×10⁻¹² Torr·L/sec·cm²",
  "industries.semi.uhv.card2.item2": "Vakuum-Ausheizen bei 250°C desorbiert Wasserdampf und Kohlenwasserstoffe vor der Endmontage",
  "industries.semi.uhv.card2.item3": "Native TiO₂-Schicht verhindert Wasserstoffpermeation bei erhöhten Prozesstemperaturen",

  "industries.semi.microdrill.badge": "Mikro-Gasverteilung",
  "industries.semi.microdrill.title.suffix": "— Gasverteilungsduschköpfe, Gasbox-Komponenten und Spiegeloberfläche Ra ≤ 0,1 μm",
  "industries.semi.microdrill.desc": "Hochaspektverhältnis-CNC-Mikrobohren von Titan Grad 5 für Halbleiter-Gasverteilungsduschköpfe, Gasbox-Verteiler und Prozesskit-Komponenten. Spiegeloberflächen (Ra ≤ 0,1 μm) kombiniert mit präzisen Mikrolocharrays optimieren die Gasflussgleichmäßigkeit für CVD-, ALD- und Ätzkammerprozesse.",
  "industries.semi.microdrill.entityLabel": "Entitätscluster",
  "industries.semi.microdrill.entity.0": "CNC-Mikrobohren",
  "industries.semi.microdrill.entity.1": "Gasverteilungsduschköpfe",
  "industries.semi.microdrill.entity.2": "Spiegeloberfläche Ra ≤ 0,1 μm",
  "industries.semi.microdrill.entity.3": "Elektropolieren",
  "industries.semi.microdrill.entity.4": "CVD/ALD",
  "industries.semi.microdrill.card1.title": "Mikroloch-Gasduschkopf-Bohren",
  "industries.semi.microdrill.card1.subtitle": "CNC-Mikrobohren · Ø0,2mm–1,5mm · 20:1 Aspektverhältnis",
  "industries.semi.microdrill.card1.desc": "Präzise Mikrolocharrays in Gasverteilungsduschköpfen steuern die Precursor-Gleichmäßigkeit über 300 mm Wafer. Unsere CNC-Mikrobohrzentren produzieren Lochdurchmesser von 0,2 mm bis 1,5 mm mit Tiefen-zu-Durchmesser-Aspektverhältnissen bis zu 20:1 bei Positionsgenauigkeit innerhalb von ±5 μm.",
  "industries.semi.microdrill.card1.implLabel": "Technische Umsetzung",
  "industries.semi.microdrill.card1.item1": "Lochdurchmesser Ø0,2mm–1,5mm mit ±5 μm Positionsgenauigkeit über gesamten Duschkopf",
  "industries.semi.microdrill.card1.item2": "20:1 Tiefen-zu-Durchmesser-Aspektverhältnis — ermöglicht gleichmäßige Gasverteilung für 300 mm Wafer",
  "industries.semi.microdrill.card1.item3": "Gratfreie Lochausgänge mit Ra ≤ 0,4 μm Innenoberfläche — verhindert Partikelbildung im Gasfluss",
  "industries.semi.microdrill.card2.title": "Spiegeloberflächen-Elektropolieren",
  "industries.semi.microdrill.card2.subtitle": "Elektropolieren · Ra ≤ 0,1 μm · Native TiO₂-Passivierung",
  "industries.semi.microdrill.card2.desc": "Elektropolieren von Gasverteilungskomponenten aus Titan eliminiert Oberflächenverunreinigungen, die während des Betriebs Partikel abgeben könnten. Die resultierende Spiegeloberfläche (Ra ≤ 0,1 μm) erzeugt eine chemisch saubere Oberfläche, die Precursor-Adsorption widersteht und Kammer-Gedächtniseffekte minimiert.",
  "industries.semi.microdrill.card2.implLabel": "Technische Umsetzung",
  "industries.semi.microdrill.card2.item1": "Elektropolieren entfernt 10-20 μm verformte Schicht — eliminiert eingebettete Mikrograte und Verunreinigungen",
  "industries.semi.microdrill.card2.item2": "Spiegeloberfläche Ra ≤ 0,1 μm — verhindert Precursor-Adsorption und Kammer-Gedächtniseffekte",
  "industries.semi.microdrill.card2.item3": "Chemische Passivierung stellt native TiO₂-Schicht wieder her — maximiert Korrosionsbeständigkeit gegen Prozessgase",

  "industries.semi.cleanroom.badge": "Kontaminationskontrolle",
  "industries.semi.cleanroom.title.suffix": "— Mehrstufige Reinigung und Null-Partikel-Verpackung für 2nm/3nm Wafer-Fab",
  "industries.semi.cleanroom.desc": "Jede Halbleiterkomponente durchläuft eine mehrstufige Präzisionsreinigungsanlage und wird in unserem Klasse-100-Reinraum (ISO 5) verpackt. Von der Ultraschallentfettung über das DI-Wasser-Spülen bis zum HEPA-gefilterten Trocknen wird jede Stufe validiert, um eine Null-Partikel-Integration in Wafer-Fertigungsanlagen zu gewährleisten.",
  "industries.semi.cleanroom.entityLabel": "Entitätscluster",
  "industries.semi.cleanroom.entity.0": "Klasse 100 Reinraum",
  "industries.semi.cleanroom.entity.1": "Ultraschallreinigung",
  "industries.semi.cleanroom.entity.2": "DI-Wasser-Spülen",
  "industries.semi.cleanroom.entity.3": "Null-Partikel-Verpackung",
  "industries.semi.cleanroom.entity.4": "ISO 5",
  "industries.semi.cleanroom.card1.title": "Klasse-100 (ISO 5) Reinraumverarbeitung",
  "industries.semi.cleanroom.card1.subtitle": "Klasse 100 · ISO 5 · Null-Partikel-zertifiziert",
  "industries.semi.cleanroom.card1.desc": "Unsere Klasse-100-Reinraumumgebung (ISO 5) garantiert, dass Halbleiterkomponenten in kontrollierter Atmosphäre montiert, geprüft und verpackt werden. HEPA-gefilterter Luftstrom, Überdruck und strenge Bekleidungsprotokolle eliminieren Partikelkontamination bis zu 0,5 μm Partikelzahlen unter 100 pro Kubikfuß.",
  "industries.semi.cleanroom.card1.implLabel": "Technische Umsetzung",
  "industries.semi.cleanroom.card1.item1": "HEPA-gefilterter vertikaler laminarer Luftstrom — ≤ 100 Partikel (≥0,5 μm) pro ft³",
  "industries.semi.cleanroom.card1.item2": "Überdruckdifferenz — verhindert Eindringen ungefilterter Luft",
  "industries.semi.cleanroom.card1.item3": "Ganzkörper-Reinraumbekleidung mit antistatischem Schuhwerk — keine menschliche Partikelkontamination",
  "industries.semi.cleanroom.card2.title": "Mehrstufige Präzisionsreinigung",
  "industries.semi.cleanroom.card2.subtitle": "Ultraschall · DI-Spülung · Validierung",
  "industries.semi.cleanroom.card2.desc": "Jede Komponente durchläuft einen validierten mehrstufigen Reinigungsprozess: Ultraschall-Lösemittelentfettung zur Entfernung von Bearbeitungsölen, alkalische Wässrigwäsche, DI-Wasser-Spülen auf 18 MΩ·cm Widerstand und HEPA-gefilterte Heißlufttrocknung. Die Reinigungsvalidierung stellt organische Kontamination unter 10 μg/cm² sicher.",
  "industries.semi.cleanroom.card2.implLabel": "Technische Umsetzung",
  "industries.semi.cleanroom.card2.item1": "Ultraschallentfettung mit Halbleiter-Lösemitteln — entfernt alle Bearbeitungsrückstände",
  "industries.semi.cleanroom.card2.item2": "DI-Wasser-Spülen auf 18 MΩ·cm Widerstand — null ionische Kontamination auf Komponentenoberflächen",
  "industries.semi.cleanroom.card2.item3": "Organische Reinigungsvalidierung — Restkontamination < 10 μg/cm²",

  "industries.semi.compliance.badge": "Materialzertifizierung",
  "industries.semi.compliance.title.suffix": "— EN 10204 3.1 MTR und metallurgische Reinheit für aggressive Plasmachemien",
  "industries.semi.compliance.desc": "Jede Halbleiter-Titankomponente wird durch vollständige Materialrückverfolgbarkeitsdokumentation abgesichert. Unsere EN 10204 3.1 Werksprüfbescheinigungen zertifizieren die chemische Zusammensetzung und mechanischen Eigenschaften, während dokumentierte metallurgische Gleichmäßigkeit die Kornstruktur für aggressive Fluor- und Chlor-basierte Plasmachemien bestätigt.",
  "industries.semi.compliance.entityLabel": "Entitätscluster",
  "industries.semi.compliance.entity.0": "EN 10204 3.1 MTR",
  "industries.semi.compliance.entity.1": "Metallurgische Gleichmäßigkeit",
  "industries.semi.compliance.entity.2": "REM/EDX",
  "industries.semi.compliance.entity.3": "Kornstruktur",
  "industries.semi.compliance.entity.4": "ASME Y14.5 GD&T",
  "industries.semi.compliance.pillar1.title": "Vollständige Materialrückverfolgbarkeit",
  "industries.semi.compliance.pillar1.desc": "Jede Charge Titan Grad 2, Grad 5 und Grad 12 wird mit EN 10204 Typ 3.1 Dokumentation einschließlich vollständiger chemischer Zusammensetzung und mechanischer Eigenschaftsprüfung zertifiziert.",
  "industries.semi.compliance.pillar1.item1": "Chemische Zusammensetzung nach ASTM B265/B348 — vollständige Elementanalyse für jede Schmelze",
  "industries.semi.compliance.pillar1.item2": "Mechanische Eigenschaften zertifiziert — Zugfestigkeit, Streckgrenze, Dehnung und Härte",
  "industries.semi.compliance.pillar1.item3": "Schmelzennummer markiert und digital archiviert — 10+ Jahre Rückverfolgbarkeit für behördliche Audits",
  "industries.semi.compliance.pillar2.title": "Metallurgische Integrität für Plasmabedingungen",
  "industries.semi.compliance.pillar2.desc": "Aggressive Halbleiter-Plasmachemien erfordern eine gleichmäßige Kornstruktur und Abwesenheit von Einschlüssen. Unsere dokumentierte metallurgische Prüfung stellt sicher, dass Titankomponenten Fluor- und Chlorplasma ohne bevorzugte Ätzung oder Partikelbildung standhalten.",
  "industries.semi.compliance.pillar2.item1": "Feine gleichachsige Kornstruktur geprüft — verhindert bevorzugte Korngrenzenätzung im Plasma",
  "industries.semi.compliance.pillar2.item2": "Nichtmetallische Einschlussbewertung nach ASTM E45 — keine Einschlüsse, die Plasma-Lichtbogenbildung auslösen könnten",
  "industries.semi.compliance.pillar2.item3": "REM/EDX-Prüfung auf allen Dichtflächen — bestätigt kein eingebettetes Fremdmaterial",

  "industries.semi.cta.badge5": "UHV-kompatibel",
  "industries.semi.cta.badge6": "Mikrobohrung Ø0,2mm",
  "industries.semi.cta.badge7": "Ra ≤ 0,1 μm Spiegel",
  "industries.semi.cta.badge8": "Klasse 100 Reinraum",
};

// Add to en.json
let enAdded = 0;
let deAdded = 0;
for (const [k, v] of Object.entries(enKeys)) {
  if (!(k in en)) { en[k] = v; enAdded++; }
}
for (const [k, v] of Object.entries(deKeys)) {
  if (!(k in de)) { de[k] = v; deAdded++; }
}

const sortObj = (obj) => {
  const sorted = {};
  Object.keys(obj).sort().forEach(k => { sorted[k] = obj[k]; });
  return sorted;
};

fs.writeFileSync(enPath, JSON.stringify(sortObj(en), null, 2) + '\n', 'utf8');
fs.writeFileSync(dePath, JSON.stringify(sortObj(de), null, 2) + '\n', 'utf8');

console.log(`en.json: Added ${enAdded} semi keys`);
console.log(`de.json: Added ${deAdded} semi keys`);
