/**
 * Translate ManufacturingPage.astro content to ONE target language.
 * Usage: node scripts/translate-manufacturing-page.mjs <lang>
 * Example: node scripts/translate-manufacturing-page.mjs de
 * First run for en: node scripts/translate-manufacturing-page.mjs en
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const TRANSLATIONS_DIR = path.resolve(__dirname, '../src/i18n/translations');

const DEEPSEEK_API_KEY = 'sk-b187f5cf84c74f9aac8bd04b7fd0d2f8';
const DEEPSEEK_API_URL = 'https://api.deepseek.com/v1/chat/completions';

const LANG_NAMES = {
  en: 'English',
  de: 'German', ja: 'Japanese', fr: 'French', es: 'Spanish',
  pt: 'Portuguese', it: 'Italian', ko: 'Korean', nl: 'Dutch', pl: 'Polish',
};

const MANUFACTURING_SOURCE = {
  'capabilities.manufacturing.processes.badge': 'Titanium CNC Machining Processes',
  'capabilities.manufacturing.processes.title': 'High-Precision',
  'capabilities.manufacturing.processes.titleHighlight': 'Titanium Machining Processes',
  'capabilities.manufacturing.processes.subtitle': "Three-axis, five-axis, Swiss turning, and wire EDM — every subtractive manufacturing discipline engineered specifically for titanium's unique metallurgical challenges.",
  'capabilities.manufacturing.processes.card1.title': '5-Axis CNC Milling',
  'capabilities.manufacturing.processes.card1.desc': 'Full 5-axis simultaneous contouring for complex aerospace monolithic bulkheads, medical orthopedic implants, and thin-wall structural components. Zero-interruption machining reduces setup errors and shortens lead times.',
  'capabilities.manufacturing.processes.card1.metric1': '5-Axis Linkage',
  'capabilities.manufacturing.processes.card1.value1': 'Full Simultaneous',
  'capabilities.manufacturing.processes.card1.metric2': 'Max Workspace',
  'capabilities.manufacturing.processes.card1.value2': '1,200 × 800 × 600 mm',
  'capabilities.manufacturing.processes.card1.metric3': 'Positional Accuracy',
  'capabilities.manufacturing.processes.card1.value3': '±0.003 mm',
  'capabilities.manufacturing.processes.card2.title': 'Precision Swiss Lathe Turning',
  'capabilities.manufacturing.processes.card2.desc': 'Sliding-headstock Swiss-type turning for micro-scale titanium fasteners, bone screws, dental abutments, and long-shaft components. High-volume production maintains micron-level repeatability across millions of parts.',
  'capabilities.manufacturing.processes.card2.metric1': 'Diameter Range',
  'capabilities.manufacturing.processes.card2.value1': 'ø 1.0 – 32 mm',
  'capabilities.manufacturing.processes.card2.metric2': 'Micro-machining',
  'capabilities.manufacturing.processes.card2.value2': 'Down to ø 0.5 mm',
  'capabilities.manufacturing.processes.card2.metric3': 'Repeatability',
  'capabilities.manufacturing.processes.card2.value3': 'Cpk ≥ 1.67',
  'capabilities.manufacturing.processes.card3.title': 'Wire EDM & EDM Sinking',
  'capabilities.manufacturing.processes.card3.desc': 'Thermal erosion with zero mechanical stress for ultra-hard titanium alloys. Produces sharp internal corners (wire ø 0.1 mm), micro-slots, and delicate thin-wall features impossible with conventional tooling.',
  'capabilities.manufacturing.processes.card3.metric1': 'Zero Thermal Stress',
  'capabilities.manufacturing.processes.card3.value1': 'No HAZ / Stress-free',
  'capabilities.manufacturing.processes.card3.metric2': 'Sharp Corners',
  'capabilities.manufacturing.processes.card3.value2': 'Internal R ≤ 0.05 mm',
  'capabilities.manufacturing.processes.card3.metric3': 'Thin-Wall Features',
  'capabilities.manufacturing.processes.card3.value3': 'Down to 0.3 mm',
  'capabilities.manufacturing.specs.badge': 'Technical Data Sheet',
  'capabilities.manufacturing.specs.title': 'Precision',
  'capabilities.manufacturing.specs.titleHighlight': 'Machining Specifications',
  'capabilities.manufacturing.specs.subtitle': 'Certified precision metrics for procurement engineers — every tolerance range verified through in-house CMM metrology per ASME Y14.5 and ISO 2768 standards.',
  'capabilities.manufacturing.specs.table.param': 'Parameter',
  'capabilities.manufacturing.specs.table.capability': 'Production Capability',
  'capabilities.manufacturing.specs.table.material': 'Applicable Material',
  'capabilities.manufacturing.specs.row1.param': 'Dimensional Tolerance (Milling)',
  'capabilities.manufacturing.specs.row1.value': '±0.005 mm (typical), ±0.002 mm (precision)',
  'capabilities.manufacturing.specs.row1.material': 'Grade 5, Grade 23, Grade 2',
  'capabilities.manufacturing.specs.row2.param': 'Surface Finish (Ra)',
  'capabilities.manufacturing.specs.row2.value': '0.4 µm (standard), 0.2 µm (precision), 0.05 µm (ultra-finish)',
  'capabilities.manufacturing.specs.row2.material': 'All Titanium Alloys',
  'capabilities.manufacturing.specs.row3.param': 'Spindle Speed (Milling)',
  'capabilities.manufacturing.specs.row3.value': 'Up to 20,000 RPM (HSK-A63 tooling)',
  'capabilities.manufacturing.specs.row3.material': 'Grade 5, Grade 23, Grade 2',
  'capabilities.manufacturing.specs.row4.param': 'Threading Capacity',
  'capabilities.manufacturing.specs.row4.value': 'M1.6 – M30 internal/external threading',
  'capabilities.manufacturing.specs.row4.material': 'All Titanium Alloys',
  'capabilities.manufacturing.specs.row5.param': 'Max Machining Size',
  'capabilities.manufacturing.specs.row5.value': 'Up to 1,200 mm × 800 mm × 600 mm',
  'capabilities.manufacturing.specs.row5.material': 'Grade 5 / Ti-6Al-4V Blocks',
  'capabilities.manufacturing.specs.row6.param': 'Wall Thickness (Min)',
  'capabilities.manufacturing.specs.row6.value': '0.5 mm (Thin-wall structural components)',
  'capabilities.manufacturing.specs.row6.material': 'Grade 5 (Ti-6Al-4V)',
  'capabilities.manufacturing.specs.note': 'All listed tolerances reflect achievable production-level capabilities on qualified titanium grades. Tighter tolerances available on engineering review. Support for Hi-Ni, Hi-Cr, Co-Cr alloys also available.',
  'capabilities.manufacturing.specs.noteLabel': 'Note:',
  'capabilities.manufacturing.quality.badge': 'Quality & Compliance Infrastructure',
  'capabilities.manufacturing.quality.title': 'Rigorous Quality Infrastructure &',
  'capabilities.manufacturing.quality.titleHighlight': 'EEAT Alignment',
  'capabilities.manufacturing.quality.subtitle': "Every titanium component is backed by certified quality systems, full chain-of-custody material traceability, and multi-stage inspection — aligning with Google's Experience, Expertise, Authoritativeness, and Trustworthiness (EEAT) framework.",
  'capabilities.manufacturing.quality.column1': 'Quality Management Certifications',
  'capabilities.manufacturing.quality.as9100.title': 'AS9100 Rev D',
  'capabilities.manufacturing.quality.as9100.subtitle': 'Aerospace Quality Management Standard',
  'capabilities.manufacturing.quality.as9100.desc': 'Full-scope AS9100D quality management system covering design, development, production, and distribution of titanium aerospace components. Regular surveillance audits ensure continuous compliance.',
  'capabilities.manufacturing.quality.as9100.badge': 'Certified',
  'capabilities.manufacturing.quality.iso13485.title': 'ISO 13485:2016',
  'capabilities.manufacturing.quality.iso13485.subtitle': 'Medical Device QMS',
  'capabilities.manufacturing.quality.iso13485.desc': 'Process controls aligned with ISO 13485 for the manufacture of medical-grade titanium components, including surgical implants, orthopedic instruments, and dental prosthetics.',
  'capabilities.manufacturing.quality.iso13485.badge': 'Compliant',
  'capabilities.manufacturing.quality.iso9001.title': 'ISO 9001:2015',
  'capabilities.manufacturing.quality.iso9001.subtitle': 'General Quality Management',
  'capabilities.manufacturing.quality.iso9001.desc': 'Foundational quality management framework with documented processes for continuous improvement, corrective/preventive action, and customer-focused output.',
  'capabilities.manufacturing.quality.iso9001.badge': 'Certified',
  'capabilities.manufacturing.quality.column2': 'Material Traceability Systems',
  'capabilities.manufacturing.quality.trace1.title': 'EN 10204 Type 3.1 MTRs',
  'capabilities.manufacturing.quality.trace1.subtitle': 'Certified Mill Test Reports',
  'capabilities.manufacturing.quality.trace1.desc': 'Every incoming titanium raw material batch is accompanied by EN 10204 Type 3.1 mill certificates documenting chemical composition, mechanical properties, and heat number traceability to the originating ingot.',
  'capabilities.manufacturing.quality.trace2.title': 'Positive Material Identification (PMI)',
  'capabilities.manufacturing.quality.trace2.subtitle': 'OES & XRF Verification',
  'capabilities.manufacturing.quality.trace2.desc': '100% PMI verification of titanium alloy chemistry via Optical Emission Spectrometry (OES) and X-Ray Fluorescence (XRF) analyzers, ensuring material grade conformity before any machining operation.',
  'capabilities.manufacturing.quality.trace3.title': 'Digital Chain-of-Custody',
  'capabilities.manufacturing.quality.trace3.subtitle': 'ERP Track & Trace',
  'capabilities.manufacturing.quality.trace3.desc': 'End-to-end digital lot traceability from receiving inspection through final packaging, with serialization and barcode tracking at every manufacturing operation.',
  'capabilities.manufacturing.quality.activeBadge': 'Active',
  'capabilities.manufacturing.quality.verifiedBadge': 'Verified',
  'capabilities.manufacturing.quality.trackedBadge': 'Tracked',
  'capabilities.manufacturing.faq.badge': 'Technical FAQ',
  'capabilities.manufacturing.faq.title': 'Frequently Asked',
  'capabilities.manufacturing.faq.titleHighlight': 'Engineering Questions',
  'capabilities.manufacturing.faq.subtitle': 'Direct technical answers to the high-intent procurement and engineering questions most frequently searched on Google by titanium component buyers.',
  'capabilities.manufacturing.faq.q1': 'How does BOZE CNC ensure tool-wear control when machining Grade 5 Titanium?',
  'capabilities.manufacturing.faq.a1': "We employ high-rigidity 5-axis machines, custom carbide-coated tooling (AlTiN + TiAlN multi-layer PVD coatings), and high-pressure through-spindle coolant (> 70 bar / 1,015 PSI) to actively suppress work-hardening and cutting heat generation during Ti-6Al-4V machining. Tool-path strategies incorporate variable helix angles and trochoidal milling to distribute thermal load evenly, maintaining micron-level dimensional stability across extended production runs. Tool wear is monitored in-cycle via spindle load & acoustic emission sensors.",
  'capabilities.manufacturing.faq.q2': 'Can Ti-6Al-4V be CNC machined to 5-micron tolerances for medical implants?',
  'capabilities.manufacturing.faq.a2': 'Yes. Our temperature-controlled production environment (20 ±1°C) combined with high-rigidity 5-axis CNC platforms and real-time thermal compensation systems enables consistent achievement of ±0.005 mm (5-micron) dimensional tolerances on Ti-6Al-4V ELI (Grade 23) medical implant components. First-article inspection (FAI) per AS9102 and 100% dimensional reporting via ZEISS CMM with 1.9 μm accuracy provides full verification. Cpk ≥ 1.67 is maintained on all critical implant features.',
  'capabilities.manufacturing.faq.q3': 'What is the typical lead time for a custom titanium CNC machined part?',
  'capabilities.manufacturing.faq.a3': 'Standard lead times range from 2–4 weeks for rapid prototyping (1–10 pcs) and 4–8 weeks for production volumes (100–5,000+ pcs), depending on complexity, material certification requirements, and surface finishing specifications. Expedited DFM review is available within 24 hours of CAD submission. Our in-house raw material inventory covering Grade 2, Grade 5, and Grade 23 eliminates mill sourcing delays for standard stock sizes.',
  'capabilities.manufacturing.faq.q4': 'Do you provide full material traceability and certified test reports?',
  'capabilities.manufacturing.faq.a4': 'Absolutely. Every shipment includes EN 10204 Type 3.1 Mill Test Reports (MTRs) documenting chemical composition, mechanical properties, and heat treatment traceability. We maintain full chain-of-custody documentation from mill to finished component. Independent third-party inspection by SGS, TÜV, or Bureau Veritas is available on request. All inspection data is archived and retrievable for the life of the product.',
  'capabilities.manufacturing.faq.q5': 'Which quality certifications does BOZE CNC hold for titanium manufacturing?',
  'capabilities.manufacturing.faq.a5': 'BOZE CNC operates under a quality framework aligned with AS9100 Rev D (aerospace), ISO 13485:2016 (medical devices), and ISO 9001:2015. Our manufacturing processes and quality management systems are designed to meet the stringent requirements of aerospace, medical, defense, and industrial applications. We maintain Nadcap-accredited NDT capabilities and follow AS9102 first-article inspection protocols.',
  'capabilities.manufacturing.cta.text': 'Have a specific technical question about your titanium project?',
  'capabilities.manufacturing.cta.btn': 'Submit Engineering RFQ',
};

async function translateAll(texts, targetLang) {
  const keys = Object.keys(texts);
  const batchSize = 15;
  const result = {};

  for (let i = 0; i < keys.length; i += batchSize) {
    const batchKeys = keys.slice(i, i + batchSize);
    const batch = {};
    for (const k of batchKeys) batch[k] = texts[k];

    const systemPrompt = `You are a professional translator for industrial/manufacturing content. Translate from English to ${targetLang}.

CRITICAL RULES:
- Keep ALL of these EXACTLY as-is: CNC, EDM, CMM, OES, XRF, HAZ, RPM, HSK, PSI, MTR, PMI, FAI, DFM, AS9100, AS9100D, AS9102, ISO 9001, ISO 13485, ISO 17025, ISO 2768, ASME Y14.5, EN 10204, Nadcap, PVD, AlTiN, TiAlN, CAD, SPC, Cpk, FPI, UT, NDT, CAPA, EEAT, ERP, BOZE, BOZE CNC, ZEISS, SGS, TÜV, Grade 2, Grade 5, Grade 23, Ti-6Al-4V, ELI, Hi-Ni, Hi-Cr, Co-Cr, Ra, µm, mm, RPM, bar, PSI, ø, M1.6, M30, 1.9 μm, 0.4 µm, 0.2 µm, 0.05 µm, ±0.005 mm, ±0.002 mm, ±0.003 mm, 20 ±1°C, Cpk ≥ 1.67
- Keep all numbers, units, and measurements exactly as written
- DO NOT translate the JSON keys — only translate the VALUES
- Return ONLY a valid JSON object. No markdown, no explanations.`;

    const userPrompt = `Translate the following texts from English to ${targetLang}. Return a JSON object with the SAME keys but translated values.

${JSON.stringify(batch, null, 2)}`;

    console.log(`⏳ Batch ${Math.floor(i / batchSize) + 1}/${Math.ceil(keys.length / batchSize)}...`);

    const response = await fetch(DEEPSEEK_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${DEEPSEEK_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'deepseek-chat',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt },
        ],
        temperature: 0.3,
        max_tokens: 16000,
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      throw new Error(`API error ${response.status}: ${errText}`);
    }

    const data = await response.json();
    const content = data.choices[0].message.content.trim();
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      Object.assign(result, JSON.parse(jsonMatch[0]));
    } else {
      throw new Error(`Could not parse JSON from batch response:\n${content.substring(0, 500)}`);
    }
  }

  return result;
}

async function main() {
  const langCode = process.argv[2];
  if (!langCode) {
    console.error('Usage: node scripts/translate-manufacturing-page.mjs <lang>');
    console.error('   en - just add English source keys');
    console.error('   de|ja|fr|es|pt|it|ko|nl|pl|ru|ar - translate');
    process.exit(1);
  }

  const targetLang = LANG_NAMES[langCode];
  if (!targetLang) {
    console.error(`Unsupported language: ${langCode}`);
    process.exit(1);
  }

  const filePath = path.join(TRANSLATIONS_DIR, `${langCode}.json`);
  const json = JSON.parse(fs.readFileSync(filePath, 'utf-8'));

  // Check which keys are missing
  const missingKeys = {};
  for (const [key, value] of Object.entries(MANUFACTURING_SOURCE)) {
    if (!json[key]) missingKeys[key] = value;
  }

  if (Object.keys(missingKeys).length === 0) {
    console.log(`✅ All keys already exist in ${langCode}.json`);
    return;
  }

  console.log(`🌐 ${Object.keys(missingKeys).length} keys missing for ${targetLang} (${langCode})`);

  if (langCode === 'en') {
    // Just add English source
    for (const [key, value] of Object.entries(missingKeys)) {
      json[key] = value;
    }
    fs.writeFileSync(filePath, JSON.stringify(json, null, 2) + '\n');
    console.log(`📝 Added ${Object.keys(missingKeys).length} keys to en.json`);
    return;
  }

  const translated = await translateAll(missingKeys, targetLang);
  console.log(`✅ Received ${Object.keys(translated).length} translations`);

  let added = 0;
  for (const [key, value] of Object.entries(translated)) {
    if (!json[key]) {
      json[key] = value;
      added++;
    }
  }
  fs.writeFileSync(filePath, JSON.stringify(json, null, 2) + '\n');
  console.log(`📝 Wrote ${added} new keys to ${langCode}.json`);
  console.log(`🎉 ${targetLang} (${langCode}) complete!`);
}

main().catch(err => {
  console.error(`\n❌ Error: ${err.message}`);
  process.exit(1);
});
