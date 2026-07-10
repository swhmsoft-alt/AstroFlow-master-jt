/**
 * Translate ONLY capabilities sub-page hero texts from English to target language.
 * Usage: node scripts/translate-capabilities-hero.mjs <lang>
 * Example: node scripts/translate-capabilities-hero.mjs de
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const TRANSLATIONS_DIR = path.resolve(__dirname, '../src/i18n/translations');

const DEEPSEEK_API_KEY = 'sk-b187f5cf84c74f9aac8bd04b7fd0d2f8';
const DEEPSEEK_API_URL = 'https://api.deepseek.com/v1/chat/completions';

const LANG_NAMES = {
  de: 'German', ja: 'Japanese', fr: 'French', es: 'Spanish',
  pt: 'Portuguese', it: 'Italian', ko: 'Korean', nl: 'Dutch', pl: 'Polish',
};

const CAPABILITIES_SOURCE = {
  '/capabilities/manufacturing': {
    h1: 'Advanced Titanium Manufacturing Capabilities & Infrastructure',
    badge: 'Precision Manufacturing Infrastructure',
    subtitle: 'Scalable, certified precision manufacturing delivering micron-level tolerances, multi-axis geometry, and 100% material traceability for aerospace, medical, and defense applications.',
  },
  '/capabilities/engineering': {
    h1: 'Front-End Engineering Support & DFM Optimization for Titanium',
    badge: 'Engineering & DFM Services',
    subtitle: 'Bridge the gap between complex aerospace/medical designs and flawless physical execution. Our expert engineering team provides rigorous Design for Manufacturing (DFM) reviews, custom toolpath simulation, and metallurgical consultation to de-risk your titanium supply chain and optimize unit costs.',
  },
  '/capabilities/capacity': {
    h1: 'Scalable Titanium Production Capacity & Supply Chain Certainty',
    badge: 'Production Capacity & Scaling',
    subtitle: 'From high-mix low-volume medical prototypes to high-volume aerospace contract manufacturing. Armed with advanced multi-axis CNC machine clusters and 24/7 automated "lights-out" shifts, we deliver over 45,000 precision titanium components annually with guaranteed lead-time stability.',
  },
  '/capabilities/quality': {
    h1: 'Certified Quality Assurance & Titanium Traceability Infrastructure',
    badge: 'Quality & Compliance',
    subtitle: 'Operating under a zero-defect quality philosophy. From raw titanium sponge verification via EN 10204 3.1 MTRs to multi-axis CMM dimensional validation, our precision infrastructure is strictly aligned with AS9100D and ISO 13485 standards to guarantee mission-critical compliance.',
  },
  '/capabilities/inspection': {
    h1: 'Titanium Metrology, Inspection & Testing Infrastructure',
    badge: 'Inspection & Testing',
    subtitle: 'Fully equipped in-house metrology laboratory with CMM, OES spectrometry, optical comparators, surface profilometry, and NDT capabilities — all calibrated per ISO 17025 traceable standards for aerospace and medical titanium components.',
  },
  '/capabilities/traceability': {
    h1: 'Non-Compromised Titanium Material Traceability & Compliance',
    badge: 'Material Traceability',
    subtitle: 'De-risking your high-liability applications with an unbroken digital chain of custody. Operating in strict accordance with AS9100D and DFARS compliance, BOZE guarantees 100% material provenance tracking — from raw ingot heat lots to permanently marked, finished multi-axis CNC components.',
  },
  '/capabilities/certifications': {
    h1: 'Global Manufacturing Certifications & Compliance Framework',
    badge: 'Certifications & Compliance',
    subtitle: 'Our production infrastructure operates under a highly audited, internationally recognized quality management system. Validated by world-leading registrars, BOZE aerospace-grade and medical-grade manufacturing certifications guarantee that every machined titanium component adheres to uncompromising regulatory and safety parameters.',
  },
};

function routeToKey(route, field) {
  const cleanRoute = route.replace(/^\//, '') || 'home';
  const keyPath = cleanRoute.replace(/\//g, '.');
  return `hero.${keyPath}.${field}`;
}

async function translateAll(texts, targetLang) {
  const systemPrompt = `You are a professional translator for industrial/manufacturing content. Translate from English to ${targetLang}.

CRITICAL RULES:
- Keep technical terms, standards, brands, and abbreviations in English EXACTLY as-is:
  CNC, SLM, DMLS, EDM, CMM, TIG, MIG, CAD, CAM, DFM, AS9100, AS9100D, ISO 9001, ISO 13485, ASTM, AMS, AWS, MIL-STD, HACCP, ITAR, NDA, RFQ, BOM, MTR, PMI, OES, FPI, UT, NDT, CAPA, SPC, KPI, MOQ, UID, ELI, MAO, VCI, ERP, ISTA, PSI, Ra, µm, Grade 1, Grade 2, Grade 5, Grade 9, Grade 12, Grade 23, Ti-6Al-4V, DFARS, EN 10204, ISO 17025
- Keep brand names: BOZE, BOZE CNC, Mastercam, ZEISS, SPECTROMAXx, Mitutoyo
- Keep units and numbers: ±0.005 mm, 500+, 50M+, 99.9%, 24/7, etc.
- DO NOT translate the JSON keys — only translate the VALUES
- Return ONLY a valid JSON object with the translated values. No explanations, no markdown.`;

  const userPrompt = `Translate the following Hero section texts from English to ${targetLang}. Return a JSON object with the SAME keys but translated values.

${JSON.stringify(texts, null, 2)}`;

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
    return JSON.parse(jsonMatch[0]);
  }
  
  throw new Error(`Could not parse JSON from API response:\n${content.substring(0, 500)}`);
}

async function main() {
  const langCode = process.argv[2];
  if (!langCode) {
    console.error('Usage: node scripts/translate-capabilities-hero.mjs <lang>');
    process.exit(1);
  }

  const targetLang = LANG_NAMES[langCode];
  if (!targetLang) {
    console.error(`Unsupported language: ${langCode}`);
    process.exit(1);
  }

  const translationInput = {};
  for (const [route, data] of Object.entries(CAPABILITIES_SOURCE)) {
    translationInput[routeToKey(route, 'h1')] = data.h1;
    translationInput[routeToKey(route, 'badge')] = data.badge;
    translationInput[routeToKey(route, 'subtitle')] = data.subtitle;
  }

  console.log(`\n🌐 Translating ${Object.keys(translationInput).length} capabilities entries to ${targetLang} (${langCode})...`);
  console.log(`⏳ Sending request...`);

  const translated = await translateAll(translationInput, targetLang);
  console.log(`✅ Received ${Object.keys(translated).length} translated entries\n`);

  const filePath = path.join(TRANSLATIONS_DIR, `${langCode}.json`);
  const json = JSON.parse(fs.readFileSync(filePath, 'utf-8'));

  let added = 0;
  for (const [key, value] of Object.entries(translated)) {
    if (!json[key]) {
      added++;
    }
    json[key] = value;
  }

  fs.writeFileSync(filePath, JSON.stringify(json, null, 2) + '\n');
  console.log(`📝 Wrote to ${langCode}.json`);
  console.log(`   Added ${added} new keys, ${Object.keys(translated).length - added} already existed`);
  console.log(`\n🎉 ${targetLang} (${langCode}) capabilities translation complete!`);
}

main().catch(err => {
  console.error(`\n❌ Error: ${err.message}`);
  if (err.stack) {
    console.error(err.stack.substring(0, 500));
  }
  process.exit(1);
});
