// 自动修复 de.json 中英德混合条目
import { readFileSync, writeFileSync } from 'fs';

const path = 'src/i18n/translations/de.json';
const de = JSON.parse(readFileSync(path, 'utf-8'));

const fixes = {
  // ===== "Our Lösung" → "Unsere Lösung" (~23 处) =====
  "materials.machiningknowhow.solution": "Unsere Lösung",
  "nav.capabilities.ourCapabilities": "Unsere Fähigkeiten",
  "services.additivequalityknowhow.solution_2": "Unsere Lösung",
  "services.brittlegallingcontrolknowhow.solution_3": "Unsere Lösung",
  "services.customcomponentsknowhow.solution_4": "Unsere Lösung",
  "services.diegallinglubricationknowhow.solution_5": "Unsere Lösung",
  "services.gallingcolorvariationknowhow.solution_6": "Unsere Lösung",
  "services.gallingosseointegrationknowhow.solution_7": "Unsere Lösung",
  "services.hotformingstressknowhow.solution_8": "Unsere Lösung",
  "services.hybridpostprocessing.solution_9": "Unsere Lösung",
  "services.hydrogenembrittlementacidcontrolknowhow.solution_10": "Unsere Lösung",
  "services.interbatchrepeatability.solution_11": "Unsere Lösung",
  "services.metallurgydefectcontrol.solution_12": "Unsere Lösung",
  "services.metallurgygrainflowknowhow.solution_13": "Unsere Lösung",
  "services.oxideslagmitigation.solution_14": "Unsere Lösung",
  "services.reactiveweldingknowhow.solution_15": "Unsere Lösung",
  "services.sizinghardeningtraceabilityknowhow.solution_16": "Unsere Lösung",
  "services.smearingembeddingcontrolknowhow.solution_17": "Unsere Lösung",
  "services.smearingwarehouseinterlockknowhow.solution_18": "Unsere Lösung",
  "services.taperstriationknowhow.solution_19": "Unsere Lösung",
  "services.texturingdedicatedcta.upload_your_drawings_review": "Laden Sie Ihre Zeichnungen zur Prüfung hoch",
  "services.thermalstresscontrastknowhow.solution_20": "Unsere Lösung",
  "services.titaniumengineeringknowhow.solution_21": "Unsere Lösung",
  "services.turnmillknowhow.solution_22": "Unsere Lösung",
  "services.wireedmknowhow.solution_23": "Unsere Lösung",

  // ===== Qualität + English → proper German compound words =====
  "cap.quality.badge": "Qualitätsmanagement-Rahmenwerk",
  "cap.quality.cert0.fullName": "Qualitätsmanagement-Standard für die Luftfahrt",
  "cap.quality.cert1.fullName": "Internationaler Qualitätsmanagement-Standard",
  "cap.quality.qc0.label": "Eingangsqualitätskontrolle",
  "cap.quality.qc1.label": "Prozessbegleitende Qualitätskontrolle",
  "cap.quality.qc2.label": "Endkontrolle",

  // ===== Präzision + English → proper German =====
  "cap.dashboard.metric1.label": "Präzisionstoleranzen",
  "home.industriesServed.ind3.title": "Präzisions-CNC-Drehdienstleistungen",
  "home.industriesServed.ind5.feat1": "Präzisionskomponenten",
  "home.tech.cap0.label": "Präzisionstoleranzen",
  "services.workflow.step2.title": "Präzisionsproduktion & Skalierung",
  
  // ===== Rückverfolgbarkeit / Traceability =====
  "home.tech.cap3.label": "Materialrückverfolgbarkeit",
  "industries.industryctasection.material_traceability": "Materialrückverfolgbarkeit",
  "nav.capabilities.traceability": "Materialrückverfolgbarkeit",
  "services.compliance.col1.title": "Volle Materialrückverfolgbarkeit",
  "services.sizinghardeningtraceabilityknowhow.traceability_control": "Rückverfolgbarkeitskontrolle",

  // ===== View/Explore + English → proper German =====
  "product.cta.viewCapabilities": "Fähigkeiten anzeigen",
  "home.serviceHighlights.cta": "Alle Fähigkeiten erkunden",

  // ===== doc entries =====
  "doc.cat1.doc1.desc": "Qualitätskontrollstandards und Produktionsabläufe",
  "doc.cat3.doc0.desc": "Qualitätsmanagement-Zertifizierungsdokumentation",
  "doc.cat5.doc2.desc": "Qualitätskontroll- und Verifizierungsvorlage",
  "doc.cat5.doc2.title": "Prüfcheckliste",
  
  // ===== cap entries =====
  "cap.inspection.badge": "Messtechnik & Prüfausrüstung",

  // ===== home industriesServed =====
  "home.industriesServed.ind5.desc": "Präzisionsfertigung, sichere Titan-CNC-Bearbeitung und Compliance-Management für Luft- und Raumfahrt- sowie Verteidigungsanwendungen.",

  // ===== home testimonials =====
  "home.testimonials.t1.role": "Geschäftsführer, Global Manufacturing Inc.",

  // ===== home services =====
  "home.services.svc3.desc": "Warm- und Kaltumformung, Schmieden, Strangpressen und Stanzen für schwere Titanbauteile. Die Fähigkeiten umfassen Druckguss und Metallschmieden für die Großserienproduktion.",

  // ===== rfq entries =====
  "rfq.form.compliance.inspectionReports": "Prüfberichte anfordern",
  "rfq.pipeline.step2.title": "DFM & Materialprüfung",

  // ===== services dedicated CTA entries =====
  "services.extrusiondedicatedcta.submit_extrusion_review": "Zur Extrusionsprüfung einreichen",
  "services.forgingdedicatedcta.submit_forging_assessment": "Zur Schmiedebewertung einreichen",
  "services.markingdedicatedcta.upload_your_artwork_review": "Laden Sie Ihre Grafiken zur Prüfung hoch",
  "services.packagingdedicatedcta.upload_your_shipping_protocols_review": "Laden Sie Ihre Versandprotokolle zur Prüfung hoch",
  "services.surfacededicatedcta.submit_your_blueprints_review": "Reichen Sie Ihre Blaupausen zur Prüfung ein",
  "services.componentdedicatedcta.submit_complete_program_evaluation": "Zur vollständigen Programmprüfung einreichen",
  "services.fabdedicatedcta.submit_complete_wps_rfq_evaluation": "Zur vollständigen WPS- & RFQ-Prüfung einreichen",
};

let count = 0;
for (const [key, value] of Object.entries(fixes)) {
  if (de[key] !== undefined) {
    console.log(`✓ ${key}`);
    console.log(`  OLD: ${de[key]}`);
    console.log(`  NEW: ${value}`);
    de[key] = value;
    count++;
  } else {
    console.log(`✗ KEY NOT FOUND: ${key}`);
  }
}

writeFileSync(path, JSON.stringify(de, null, 2) + '\n', 'utf-8');
console.log(`\nFixed ${count} entries.`);
