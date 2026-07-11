/**
 * Add ALL missing cap.cap.* keys to de.json via DeepSeek API.
 * These keys exist in en, es, fr, it, ja, ko, nl, pl, pt but NOT in de.json.
 *
 * Usage: node scripts/add-cap-cap-de.mjs
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const TRANSLATIONS_DIR = path.resolve(__dirname, '../src/i18n/translations');

const API_KEY = 'sk-b187f5cf84c74f9aac8bd04b7fd0d2f8';
const API_URL = 'https://api.deepseek.com/v1/chat/completions';

// ── Source keys (from en.json lines 5497-5543) ──
const CAP_CAP_SOURCE = {
  // Section 1 — Dashboard
  'cap.cap.s1.badge': 'Production Capacity Dashboard',
  'cap.cap.s1.title': 'Capacity & Throughput',
  'cap.cap.s1.highlight': 'Metrics',
  'cap.cap.s1.sub': 'Quantitative production capacity indicators — verified through ERP-driven data collection and presented for procurement engineering evaluation.',

  // Metric 1
  'cap.cap.m1.val': '45,000+',
  'cap.cap.m1.lbl': 'Parts / Year',
  'cap.cap.m1.desc': 'Total precision titanium component throughput across all production tiers — from prototype to high-volume serial production.',

  // Metric 2
  'cap.cap.m2.val': '8,500+',
  'cap.cap.m2.lbl': 'Spindle Hours / Month',
  'cap.cap.m2.desc': 'Aggregated multi-axis CNC machining operational capacity per month.',

  // Metric 3
  'cap.cap.m3.val': '35+',
  'cap.cap.m3.lbl': 'Advanced CNC Units',
  'cap.cap.m3.desc': 'Fleet specialized exclusively in reactive and hard metal machining — Ti-6Al-4V, Grade 2, Grade 23, and nickel-cobalt superalloys.',

  // Metric 4
  'cap.cap.m4.val': '24/7',
  'cap.cap.m4.lbl': '"Lights-Out" Shift',
  'cap.cap.m4.desc': 'Continuous automated pallet-changing operation with robotic workpiece loading, minimizing human downtime and maximizing OEE.',

  // Section 2 — Scaling Matrix
  'cap.cap.mat.badge': 'Production Scaling Matrix',
  'cap.cap.mat.title': 'From Prototype to',
  'cap.cap.mat.highlight': 'Mass Production',
  'cap.cap.mat.sub': 'Three distinct production tiers engineered to match your program maturity.',
  'cap.cap.mat.h1': 'Production Tier',
  'cap.cap.mat.h2': 'Typical Volume (Units)',
  'cap.cap.mat.h3': 'Primary Technical Focus',
  'cap.cap.mat.h4': 'Standard Lead Time',
  'cap.cap.mat.note': 'Production tiers are not fixed boundaries. Programs can seamlessly transition from prototype to mass production under a single quality plan.',

  // Matrix Row 1
  'cap.cap.mr1.t': 'Prototyping & R&D',
  'cap.cap.mr1.v': '1 – 10 pieces',
  'cap.cap.mr1.f': 'Rapid CAD/CAM deployment, toolpath validation, geometric feasibility, material grade confirmation.',
  'cap.cap.mr1.l': '3 – 7 Working Days',

  // Matrix Row 2
  'cap.cap.mr2.t': 'Low-Volume High-Mix (LVHM)',
  'cap.cap.mr2.v': '11 – 500 pieces',
  'cap.cap.mr2.f': 'Fixture optimization, cycle-time stabilization, early-stage CMM reporting, process qualification.',
  'cap.cap.mr2.l': '2 – 3 Weeks',

  // Matrix Row 3
  'cap.cap.mr3.t': 'High-Volume Mass Production',
  'cap.cap.mr3.v': '500 – 5,000+ pieces',
  'cap.cap.mr3.f': 'Automated Swiss turning, multi-pallet continuous milling, rigid SPC control, milestone delivery.',
  'cap.cap.mr3.l': '4 – 6 Weeks (Milestone Delivery Available)',

  // Section 3 — Resilience
  'cap.cap.res.badge': 'Supply Chain Resilience',
  'cap.cap.res.title': 'Production Resilience &',
  'cap.cap.res.highlight': 'Inventory Redundancy',
  'cap.cap.res.sub': 'Multi-layered risk mitigation strategies designed to guarantee on-time delivery.',
  'cap.cap.res.mat_t': 'Raw Material Security & Strategic Stock',
  'cap.cap.res.mat_d': 'Maintained through long-term strategic partnerships with tier-1 titanium mills. Our warehouse carries strategic safety stock of Grade 5, Grade 23, and Grade 2.',
  'cap.cap.res.mach_t': 'Machinery Redundancy & Zero-Downtime Switchover',
  'cap.cap.res.mach_d': 'Every critical machine specification is backed by redundant sister machines within our fleet. Production programs can be transferred within 2 hours with zero impact to the critical delivery path.',

  // CTA
  'cap.cap.cta.t': 'Ready to discuss your production volume requirements?',
  'cap.cap.cta.btn': 'Request Capacity Assessment',
};

async function translateBatch(texts) {
  const keys = Object.keys(texts);
  const BATCH = 12;
  const result = {};
  for (let i = 0; i < keys.length; i += BATCH) {
    const batch = {};
    for (const k of keys.slice(i, i + BATCH)) batch[k] = texts[k];
    console.log(`  ⏳ Translating batch ${Math.floor(i / BATCH) + 1}/${Math.ceil(keys.length / BATCH)} (${Object.keys(batch).length} keys)...`);
    const resp = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${API_KEY}` },
      body: JSON.stringify({
        model: 'deepseek-chat',
        messages: [
          { role: 'system', content: 'You are a professional German translator for industrial/manufacturing content. Keep technical terms like CNC, EDM, CMM, AS9100, ERP, MTR, Grade 2, Grade 5, Grade 23, Ti-6Al-4V exactly as-is. DO NOT translate JSON keys. Return ONLY a valid JSON object.' },
          { role: 'user', content: `Translate to German. Return JSON with SAME keys but translated values:\n${JSON.stringify(batch, null, 2)}` }
        ],
        temperature: 0.3,
      }),
    });
    const data = await resp.json();
    const content = data.choices[0].message.content.trim();
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (jsonMatch) Object.assign(result, JSON.parse(jsonMatch[0]));
    else throw new Error(`No JSON in batch ${i}`);
    console.log(`  ✅ Batch ${Math.floor(i / BATCH) + 1} done`);
  }
  return result;
}

async function main() {
  const langCode = 'de';
  const filePath = path.join(TRANSLATIONS_DIR, `${langCode}.json`);
  const json = JSON.parse(fs.readFileSync(filePath, 'utf-8'));

  // Check which keys are missing
  const missing = {};
  for (const [k, v] of Object.entries(CAP_CAP_SOURCE)) {
    if (!json[k]) missing[k] = v;
  }

  if (Object.keys(missing).length === 0) {
    console.log(`✅ All cap.cap.* keys already exist in de.json`);
    return;
  }

  console.log(`🌐 Found ${Object.keys(missing).length} missing cap.cap.* keys in de.json`);
  console.log(`   Translating to German via DeepSeek...\n`);

  const translated = await translateBatch(missing);

  let added = 0;
  for (const [k, v] of Object.entries(translated)) {
    if (!json[k]) { json[k] = v; added++; }
  }

  // Clean and sort: keep existing order but insert new keys alphabetically
  const sorted = {};
  for (const k of Object.keys(json).sort()) sorted[k] = json[k];
  fs.writeFileSync(filePath, JSON.stringify(sorted, null, 2) + '\n');

  console.log(`\n📝 Wrote ${added} new keys to de.json`);
}

main().catch(e => { console.error(`\n❌ ${e.message}`); process.exit(1); });
