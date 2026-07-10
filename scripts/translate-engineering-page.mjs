/**
 * Translate EngineeringPage.astro content to ONE target language.
 * Usage: node scripts/translate-engineering-page.mjs <lang>
 * Example: node scripts/translate-engineering-page.mjs de
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

const ENGINEERING_SOURCE = {
  // Section 1: Core Engineering Competencies
  'capabilities.engineering.pillar1.badge': 'Engineering Core Competencies',
  'capabilities.engineering.pillar1.title': 'Core Engineering',
  'capabilities.engineering.pillar1.subtitle': 'Three specialized engineering disciplines that transform complex titanium designs into manufacturable, cost-optimized production programs.',

  // Pillar 1 desc (hardcoded text not using t() calls)
  'capabilities.engineering.pillar1.desc': 'Design for Manufacturing audits tailored to titanium\'s unique metallurgical behavior — low thermal conductivity, high work-hardening rate, and elastic springback. Every feature is evaluated against titanium-specific machinability limits before production.',
  'capabilities.engineering.pillar1.item1': 'Avoid sharp internal corners (< R 0.5 mm) to prevent tool chipping and stress risers in Ti-6Al-4V',
  'capabilities.engineering.pillar1.item2': 'Maintain minimum 0.5 mm wall to avoid resonant chatter and thermal warpage',
  'capabilities.engineering.pillar1.item3': 'Optimize internal thread depth in Grade 5 to prevent tap breakage; thread milling recommended for M1.6–M6',

  // Pillar 2
  'capabilities.engineering.pillar2.item1': 'Cutting parameter optimization for Ti-6Al-4V: Vc 40–60 m/min, fz 0.08–0.15 mm/tooth, ap 1–4 mm',
  'capabilities.engineering.pillar2.item2': '5-axis simultaneous toolpath with collision avoidance: tool holder, spindle head, and fixture interference detection',
  'capabilities.engineering.pillar2.item3': 'Surface finish prediction and feed-rate optimization: scallop height control for Ra 0.4 µm target',

  // Pillar 3
  'capabilities.engineering.pillar3.item1': 'Forming simulation: springback compensation for cold-formed Grade 2 sheet metal brackets',
  'capabilities.engineering.pillar3.item2': 'Weld distortion modeling: TIG weld sequence optimization for thin-wall titanium assemblies',
  'capabilities.engineering.pillar3.item3': 'Heat treatment simulation: stress-relief annealing cycle parameters for complex 5-axis machined components',

  // Section 2: Engineering Workflow
  'capabilities.engineering.workflow.badge': 'Engineering Workflow',
  'capabilities.engineering.workflow.title': 'From Blueprint to',
  'capabilities.engineering.workflow.subtitle': 'A deterministic 4-stage engineering sequence that eliminates uncertainty before production begins. Every stage is documented, reviewed, and approved before progressing.',

  // Step descriptions
  'capabilities.engineering.workflow.step1.desc': 'Accepting native CAD files (.STEP, .IGES, .SolidWorks, .AutoCAD) and GD&T-annotated 2D drawings. All data is received and processed in a secure, NDA-compliant digital environment with full revision control.',
  'capabilities.engineering.workflow.step2.desc': 'Evaluating the selected material grade (Grade 2, Grade 5, Grade 23 ELI, etc.) against every geometric feature in the design. Identifying localized thermal stress risks, hard-to-reach tool access zones, and potential fixturing challenges specific to titanium\'s low thermal conductivity and high springback.',
  'capabilities.engineering.workflow.step3.desc': 'Each feature in the part is run through a structured DFM review checklist: draft angle adequacy, undercut avoidance, uniform wall thickness, corner radius optimization, and datuma accessibility for CMM verification.',
  'capabilities.engineering.workflow.step4.desc': 'A formal DFM report with dimensional risk heat map, estimated cycle time, tooling requirements, recommended material grade substitutions (if cost-saving opportunities exist), and firm manufacturing cost estimate.',

  // Section 3: Engineering Value Matrix
  'capabilities.engineering.matrix.badge': 'Engineering Value Matrix',
  'capabilities.engineering.matrix.subtitle': 'Quantifiable evidence of how our front-end engineering transforms conventional machining into precision-optimized, cost-efficient production.',
  'capabilities.engineering.matrix.col1': 'Engineering Dimension',
  'capabilities.engineering.matrix.col2': 'Standard Machining Approach',
  'capabilities.engineering.matrix.col3': 'BOZE Engineered & Simulated Approach',

  // Section 4: Engineering FAQ
  'capabilities.engineering.faq.badge': 'Engineering FAQ',
  'capabilities.engineering.faq.subtitle': 'Engineer-to-Engineer technical Q&A addressing the most common engineering concerns when transitioning titanium components to production.',

  // FAQ questions
  'capabilities.engineering.faq.q1': 'How to reduce stress concentration in thin-walled Grade 5 titanium aerospace components?',
  'capabilities.engineering.faq.a1': 'Our engineering team applies three primary strategies. First, we increase fillet radii at all internal intersections to minimum R 1.5 mm to reduce Kt (stress concentration factor) below 1.5. Second, we replace sharp edge transitions with blended tangent arcs using 5-axis toolpath smoothing. Third, we specify low-stress grinding (LSG) or chemical milling for final surface removal of the alpha-case layer (0.05–0.10 mm) that forms during solution heat treatment of Ti-6Al-4V, eliminating micro-crack initiation sites.',
  'capabilities.engineering.faq.q2': 'What is included in a standard DFM review for titanium CNC parts?',
  'capabilities.engineering.faq.a2': 'A comprehensive DFM review covers six dimensions: (1) Material selection — verifying grade choice against functional requirements; (2) Feature machinability — assessing wall thickness, corner radii, depth-to-diameter ratios, and thread specifications for titanium-specific limitations; (3) Tolerance stack analysis — evaluating cumulative dimensional effects across multi-feature parts using Monte Carlo simulation; (4) Tool access — confirming all features are reachable with standard tool lengths and extensions; (5) Fixturing strategy — recommending workholding approach (vise, tombstone, vacuum chuck, or custom fixture) based on part geometry and rigidity; (6) Cost optimization — identifying opportunities to reduce cycle time through feature consolidation or tolerance relaxation.',
  'capabilities.engineering.faq.q3': 'How can BOZE engineering reduce cycle times for existing titanium production programs?',
  'capabilities.engineering.faq.a3': 'Our value engineering team conducts a systematic cycle time analysis across four dimensions: Toolpath optimization — converting conventional roughing to adaptive clearing with high-feed mills, reducing roughing time by up to 40%; Process consolidation — combining milling, drilling, and tapping operations on multi-tasking mill-turn platforms, eliminating secondary setups; Cutting tool selection — selecting grade-specific carbide inserts with optimized chip-breaker geometries for titanium; and Workholding efficiency — reducing part loading/unloading time through quick-change pallet systems. Typical first-pass cycle time reduction: 15–25% without capital equipment investment.',
  'capabilities.engineering.faq.q4': 'Which CAD/CAM software platforms does BOZE engineering support?',
  'capabilities.engineering.faq.a4': 'Our engineering team works with all major CAD/CAM platforms. We accept native files from SolidWorks, Autodesk Inventor, and PTC Creo, and neutral formats including STEP, IGES, and Parasolid. For CAM programming, we use Mastercam (5-axis simultaneous, mill-turn, and wire EDM modules) and Siemens NX CAM for complex freeform surface machining. All toolpaths are validated through full-machine digital twin simulation with collision detection, spindle load monitoring, and surface finish prediction before production release.',

  // CTA
  'capabilities.engineering.cta.text': 'Submit your design for a complimentary DFM feasibility assessment.',
  'capabilities.engineering.cta.btn': 'Submit CAD for DFM Review',
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
- Keep ALL EXACTLY as-is: CNC, EDM, CMM, OES, XRF, DFM, CAD, CAM, STEP, IGES, NDT, FPI, UT, CAPA, SPC, Cpk, FAI, AS9100, AS9100D, AS9102, ISO 9001, ISO 13485, ISO 17025, EN 10204, Nadcap, PVD, AlTiN, TiAlN, LSG, TIG, MIG, Kt, BOZE, BOZE CNC, ZEISS, Mastercam, Siemens NX, SolidWorks, Autodesk Inventor, PTC Creo, Parasolid, Grade 2, Grade 5, Grade 23, Ti-6Al-4V, ELI, Ra, µm, mm, RPM, M1.6, M6, M30, R 0.5, R 1.5, ±0.005, Cpk ≥ 1.67, Vc 40–60, fz 0.08–0.15, ap 1–4
- Keep all numbers, units, measurements, brand names exactly as-is
- DO NOT translate the JSON keys — only translate the VALUES
- Return ONLY a valid JSON object. No markdown, no explanations.`;

    const userPrompt = `Translate the following texts from English to ${targetLang}. Return a JSON object with the SAME keys but translated values.

${JSON.stringify(batch, null, 2)}`;

    console.log(`⏳ Batch ${Math.floor(i / batchSize) + 1}/${Math.ceil(keys.length / batchSize)}...`);

    const response = await fetch(DEEPSEEK_API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${DEEPSEEK_API_KEY}` },
      body: JSON.stringify({ model: 'deepseek-chat', messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ], temperature: 0.3, max_tokens: 16000 }),
    });

    if (!response.ok) throw new Error(`API error ${response.status}`);

    const data = await response.json();
    const content = data.choices[0].message.content.trim();
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (jsonMatch) Object.assign(result, JSON.parse(jsonMatch[0]));
    else throw new Error(`Could not parse JSON:\n${content.substring(0, 500)}`);
  }
  return result;
}

async function main() {
  const langCode = process.argv[2];
  if (!langCode) { console.error('Usage: node scripts/translate-engineering-page.mjs <lang>'); process.exit(1); }
  const targetLang = LANG_NAMES[langCode];
  if (!targetLang) { console.error(`Unsupported: ${langCode}`); process.exit(1); }

  const filePath = path.join(TRANSLATIONS_DIR, `${langCode}.json`);
  const json = JSON.parse(fs.readFileSync(filePath, 'utf-8'));

  const missingKeys = {};
  for (const [key, value] of Object.entries(ENGINEERING_SOURCE)) {
    if (!json[key]) missingKeys[key] = value;
  }

  if (Object.keys(missingKeys).length === 0) {
    console.log(`✅ All keys already exist in ${langCode}.json`);
    return;
  }

  console.log(`🌐 ${Object.keys(missingKeys).length} keys missing for ${targetLang} (${langCode})`);

  if (langCode === 'en') {
    for (const [key, value] of Object.entries(missingKeys)) { json[key] = value; }
    fs.writeFileSync(filePath, JSON.stringify(json, null, 2) + '\n');
    console.log(`📝 Added ${Object.keys(missingKeys).length} keys to en.json`);
    return;
  }

  const translated = await translateAll(missingKeys, targetLang);
  console.log(`✅ Received ${Object.keys(translated).length} translations`);

  let added = 0;
  for (const [key, value] of Object.entries(translated)) {
    if (!json[key]) { json[key] = value; added++; }
  }
  fs.writeFileSync(filePath, JSON.stringify(json, null, 2) + '\n');
  console.log(`📝 Wrote ${added} new keys to ${langCode}.json`);
  console.log(`🎉 ${targetLang} (${langCode}) complete!`);
}

main().catch(err => { console.error(`\n❌ Error: ${err.message}`); process.exit(1); });
