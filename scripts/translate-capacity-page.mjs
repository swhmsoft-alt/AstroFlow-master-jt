/**
 * Translate CapacityPage.astro content to ONE target language.
 * Usage: node scripts/translate-capacity-page.mjs <lang>
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const TRANSLATIONS_DIR = path.resolve(__dirname, '../src/i18n/translations');
const API_KEY = 'sk-b187f5cf84c74f9aac8bd04b7fd0d2f8';
const API_URL = 'https://api.deepseek.com/v1/chat/completions';

const LANG_NAMES = {
  en: 'English', de: 'German', ja: 'Japanese', fr: 'French', es: 'Spanish',
  pt: 'Portuguese', it: 'Italian', ko: 'Korean', nl: 'Dutch', pl: 'Polish',
};

const CAPACITY_SOURCE = {
  'capabilities.capacity.dashboard.badge': 'Production Capacity Dashboard',
  'capabilities.capacity.dashboard.title': 'Capacity & Throughput',
  'capabilities.capacity.dashboard.titleHighlight': 'Metrics',
  'capabilities.capacity.dashboard.subtitle': 'Quantitative production capacity indicators — verified through ERP-driven data collection and presented for procurement engineering evaluation.',
  'capabilities.capacity.dashboard.metric1.value': '45,000+',
  'capabilities.capacity.dashboard.metric1.label': 'Annual Titanium Parts Output',
  'capabilities.capacity.dashboard.metric2.value': '8,500+',
  'capabilities.capacity.dashboard.metric2.label': 'Monthly Spindle Hours',
  'capabilities.capacity.dashboard.metric3.value': '35+',
  'capabilities.capacity.dashboard.metric3.label': 'Multi-Axis CNC Machines',
  'capabilities.capacity.dashboard.metric4.value': '24/7',
  'capabilities.capacity.dashboard.metric4.label': 'Lights-Out Automated Shifts',

  'capabilities.capacity.scaling.badge': 'Production Scaling Matrix',
  'capabilities.capacity.scaling.title': 'End-to-End Production',
  'capabilities.capacity.scaling.titleHighlight': 'Scaling Capability',
  'capabilities.capacity.scaling.subtitle': 'From first-article prototype validation to high-volume mass production — a single unified manufacturing system with zero requalification gap.',

  'capabilities.capacity.resilience.badge': 'Supply Chain Resilience & Lead-Time Certainty',
  'capabilities.capacity.resilience.title': 'Supply Chain Resilience &',
  'capabilities.capacity.resilience.titleHighlight': 'Guaranteed Lead Times',
  'capabilities.capacity.resilience.subtitle': 'In an industry where titanium supply disruptions and production bottlenecks are the norm, BOZE operates through a deliberately engineered resilience framework.',

  'capabilities.capacity.faq.badge': 'Capacity & Procurement FAQ',
  'capabilities.capacity.faq.subtitle': 'Strategic answers to the procurement questions that matter most when evaluating a high-volume titanium machining partner.',

  'capabilities.capacity.faq.q1': 'What is BOZE\'s typical lead time for high-volume titanium production orders (5,000+ pcs)?',
  'capabilities.capacity.faq.a1': 'For established production programs with released tooling and qualified inspection protocols, standard lead time is 4–6 weeks from confirmed purchase order to first shipment. This includes material procurement (Grade 5, Grade 23, Grade 2), batch setup on multi-spindle machines, first-article inspection per AS9102, and staged delivery scheduling. Expedited lead times of 2–3 weeks are available for strategic programs through our fast-track manufacturing cell, which reserves dedicated spindle capacity for qualified production programs. Lead time guarantees are contractually committed through our supply assurance program.',
  'capabilities.capacity.faq.q2': 'How does BOZE ensure production continuity during supply chain disruptions?',
  'capabilities.capacity.faq.a2': 'Through a three-layer resilience architecture: (1) Redundant spindle capacity — our machine park operates at 70% utilization as standard, leaving 30% surge capacity for emergency demand spikes or unscheduled downtime recovery; (2) Multi-region material sourcing — each production-critical titanium grade has at least two qualified mill sources across different geographic regions; (3) Inventory buffer — we carry 8–12 weeks of forecasted Grade 5, Grade 23, and Grade 2 inventory, allowing production to continue uninterrupted through all but the most severe supply chain events.',
  'capabilities.capacity.faq.q3': 'Can BOZE handle both prototype R&D and mass production under one roof?',
  'capabilities.capacity.faq.a3': 'Yes. Our production scaling matrix is designed specifically for programs that mature from concept to volume. Prototype and R&D orders (1–10 pcs) are managed by our dedicated engineering team with rapid CAM deployment and aggressive 3–7 day lead times. As the program validates and volumes increase, the same toolpaths, fixtures, and inspection programs migrate seamlessly into our low-volume high-mix (LVHM) cell and eventually into high-volume mass production — all under a single quality plan with no re-qualification required.',
  'capabilities.capacity.faq.q4': 'How do you guarantee raw material supply stability for long-term production programs?',
  'capabilities.capacity.faq.a4': 'Through three coordinated strategies: Strategic mill partnerships — we maintain long-term framework agreements with tier-1 titanium mills (including VSMPO-AVISMA, ATI Metals, and BaoTi Group), guaranteeing allocated production capacity and preferential pricing; Strategic inventory — our warehouse carries 8–12 weeks of forecasted demand for Grade 5, Grade 23, and Grade 2 in bar, plate, and billet forms, fully certified with EN 10204 3.1 MTRs; Alternative source qualification — we proactively qualify alternative mill sources for every program-critical grade, ensuring a qualified backup supply chain is ready before any disruption occurs.',

  'capabilities.capacity.cta.text': 'Ready to discuss your production volume requirements?',
  'capabilities.capacity.cta.btn': 'Request Capacity Assessment',

  // Metric labels
  'capabilities.capacity.metric1.label': 'Annual Titanium Parts Output',
  'capabilities.capacity.metric2.label': 'Monthly Spindle Hours',
  'capabilities.capacity.metric3.label': 'Multi-Axis CNC Machines',
  'capabilities.capacity.metric4.label': 'Lights-Out Automated Shifts',

  // Scaling
  'capabilities.capacity.scaling.subtitle': 'Three distinct production tiers engineered to match your program maturity from concept to full-scale mass production.',
  'capabilities.capacity.scaling.col1': 'Production Tier',
  'capabilities.capacity.scaling.col2': 'Typical Volume (Units)',
  'capabilities.capacity.scaling.col3': 'Primary Technical Focus',
  'capabilities.capacity.scaling.col4': 'Standard Lead Time',
  'capabilities.capacity.scaling.row2': 'Low-Volume High-Mix (LVHM)',
  'capabilities.capacity.scaling.note': 'Production tiers are not fixed boundaries. Programs that begin as prototype runs can seamlessly transition into LVHM and subsequently full mass production under a single quality plan without re-qualification.',

  // Resilience
  'capabilities.capacity.resilience.badge': 'Supply Chain Resilience',
  'capabilities.capacity.resilience.title': 'Production Resilience',
  'capabilities.capacity.resilience.titleHighlight': 'Guaranteed Lead Times',
  'capabilities.capacity.resilience.subtitle': 'Multi-layered risk mitigation strategies designed to guarantee on-time delivery regardless of raw material volatility, equipment anomalies, or demand surges.',
  'capabilities.capacity.resilience.card2.title': 'Machinery Redundancy & Zero-Downtime Switchover',
  'capabilities.capacity.resilience.switchover': 'Max machine switchover time for critical path programs',

  // FAQ
  'capabilities.capacity.faq.badge': 'Capacity & Delivery FAQ',
  'capabilities.capacity.faq.title': 'Procurement-Focused',
  'capabilities.capacity.faq.titleHighlight': 'Q&A',
  'capabilities.capacity.faq.subtitle': 'Answers to the most common procurement and supply chain questions about scaling titanium CNC production.',
};

async function translateBatch(texts, targetLang) {
  const keys = Object.keys(texts);
  const BATCH = 12;
  const result = {};
  for (let i = 0; i < keys.length; i += BATCH) {
    const batch = {}; for (const k of keys.slice(i, i + BATCH)) batch[k] = texts[k];
    const r = await fetch(API_URL, { method: 'POST', headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${API_KEY}` },
      body: JSON.stringify({ model: 'deepseek-chat', messages: [
        { role: 'system', content: `Translate industrial texts to ${targetLang}. Keep technical terms like CNC, EDM, CMM, AS9100, AS9102, EN 10204, Grade 2, Grade 5, Grade 23, Ti-6Al-4V, ELI, ERP, MTR, QMS, NDT, KPI, DFM, CAD, CAM, etc. exactly as-is. DO NOT translate JSON keys. Return ONLY a valid JSON object.` },
        { role: 'user', content: `Translate to ${targetLang}. Return JSON with SAME keys but translated values:\n${JSON.stringify(batch, null, 2)}` }
      ], temperature: 0.3 }) });
    const data = await r.json();
    const content = data.choices[0].message.content.trim();
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (jsonMatch) Object.assign(result, JSON.parse(jsonMatch[0]));
    else throw new Error(`No JSON in batch ${i}`);
  }
  return result;
}

async function main() {
  const langCode = process.argv[2];
  if (!langCode) { console.error('Usage: node scripts/translate-capacity-page.mjs <lang>'); process.exit(1); }
  const targetLang = LANG_NAMES[langCode];
  if (!targetLang) { console.error(`Unsupported: ${langCode}`); process.exit(1); }

  const filePath = path.join(TRANSLATIONS_DIR, `${langCode}.json`);
  const json = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
  const missing = {};
  for (const [k, v] of Object.entries(CAPACITY_SOURCE)) if (!json[k]) missing[k] = v;

  if (Object.keys(missing).length === 0) { console.log(`✅ All keys exist in ${langCode}.json`); return; }
  console.log(`🌐 ${Object.keys(missing).length} keys missing for ${targetLang} (${langCode})`);

  if (langCode === 'en') {
    for (const [k, v] of Object.entries(missing)) json[k] = v;
    fs.writeFileSync(filePath, JSON.stringify(json, null, 2) + '\n');
    console.log(`📝 Added to en.json`); return;
  }

  const translated = await translateBatch(missing, targetLang);
  let added = 0;
  for (const [k, v] of Object.entries(translated)) { if (!json[k]) { json[k] = v; added++; } }
  fs.writeFileSync(filePath, JSON.stringify(json, null, 2) + '\n');
  console.log(`📝 Wrote ${added} keys to ${langCode}.json`);
}

main().catch(e => { console.error(`\n❌ ${e.message}`); process.exit(1); });
