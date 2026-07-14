/**
 * Cline + DeepSeek 行业组件翻译流水线
 * 按您的规范: DE→DIN, JA→JIS, FR→AFNOR 等
 * 
 * 用法: node scripts/translate-industry-components.mjs ja
 */
import fs from 'fs';

const DIR = 'c:/Users/Administrator/Desktop/AstroFlow-master-jt/src/i18n/translations';
const API_KEY = 'sk-b187f5cf84c74f9aac8bd04b7fd0d2f8';
const API_URL = 'https://api.deepseek.com/v1/chat/completions';

const LANG_MAP = {
  de: { name: 'German', std: 'DIN', tone: 'Formal "Sie". Compound nouns. Expect 15-25% expansion.' },
  ja: { name: 'Japanese', std: 'JIS', tone: 'Polite 敬語 (keigo). Compact. Manufacturing business register.' },
  fr: { name: 'French', std: 'AFNOR', tone: 'Formal "Vous". Moderate expansion ~10-15%.' },
  es: { name: 'Spanish', std: 'UNE/ISO', tone: 'Professional B2B. Neutral EU/LATAM.' },
  pt: { name: 'Portuguese', std: 'ABNT/ISO', tone: 'Professional B2B. Neutral PT-BR/PT-EU.' },
  it: { name: 'Italian', std: 'UNI', tone: 'High-precision engineering nomenclature.' },
  ko: { name: 'Korean', std: 'KS', tone: 'Formal business 존댓말. Compact.' },
  nl: { name: 'Dutch', std: 'NEN', tone: 'Corporate B2B. Sharp, direct phrasing.' },
  pl: { name: 'Polish', std: 'PN', tone: 'Corporate B2B. Technical precision.' },
  ru: { name: 'Russian', std: 'GOST', tone: 'Formal technical. Expect 15-25% expansion.' },
  ar: { name: 'Arabic', std: 'SASO', tone: 'Formal MSA (فصحى). RTL. Expect 10-15% contraction.' },
};

const VOCAB = `
Titanium vocabulary — NEVER translate as generic:
- Galling/Tool Adhesion → NOT "sticky knife"
- Tool Chipping/Micro-chipping → NOT "blade collapse"
- Feed Rate → NOT "feeding"
- Built-up Edge (BUE) → NOT "built-up tumor"
- Aging/Age Hardening → NOT "timely treatment"
- Heat Treatment → NOT "hot treatment"
- Residual Stress → NOT "remaining stress"
- Fatigue Life → NOT "tired life"
- Fracture Toughness → NOT "fracture weakness"

Keep EXACT standard names: AS9100D, NADCAP, AMS, ASTM, EN 10204, AS9102, ASME Y14.5, 
ISO 13485, ISO 17025, MIL-S-8879C, AS8879, ASTM F136, ASTM F543, ASTM E466,
ZEISS, CMM, GD&T, FAIR, MTR, DFARS, SPC, UHV, EMI, CRDM, SMR, UTS, MPa,
Grade 5, Grade 19, Grade 23, Ti-6Al-4V, Ti-6Al-4V ELI, Ti-3Al-8V-6Cr-4Mo-4Zr,
DMG MORI, Mazak, Ra, µm, CAD, STEP, IGES, STL, UNJF, MJ, Tyvek
`;

async function translateBatch(texts, langCode) {
  const keys = Object.keys(texts);
  if (keys.length === 0) return {};
  const info = LANG_MAP[langCode];
  
  const sysPrompt = `Professional ${info.name} industrial translator for titanium manufacturing.
Standard body: ${info.std}. Tone: ${info.tone}. ${VOCAB}
Rules: ONLY translate values, keep JSON keys. Return valid JSON only. No markdown. No backticks.`;

  try {
    const resp = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${API_KEY}` },
      body: JSON.stringify({
        model: 'deepseek-chat',
        messages: [{ role: 'system', content: sysPrompt }, { role: 'user', content: JSON.stringify(texts, null, 2) }],
        temperature: 0.1, max_tokens: 8192
      })
    });
    const data = await resp.json();
    const raw = data.choices?.[0]?.message?.content || '{}';
    return JSON.parse(raw.replace(/```json\s*/gi, '').replace(/```/g, '').trim());
  } catch (e) {
    console.error(`  ❌ Error: ${e.message}`);
    return {};
  }
}

async function main() {
  const targetLang = process.argv[2];
  if (!targetLang || !LANG_MAP[targetLang]) {
    console.log(`用法: node scripts/translate-industry-components.mjs [语言代码]`);
    console.log(`支持: ${Object.keys(LANG_MAP).join(', ')}`);
    return;
  }

  const en = JSON.parse(fs.readFileSync(`${DIR}/en.json`, 'utf8'));
  const target = JSON.parse(fs.readFileSync(`${DIR}/${targetLang}.json`, 'utf8'));

  // 获取所有行业页面 key（组件内容）
  const industryKeys = Object.keys(en).filter(k => {
    return k.startsWith('industries.') && 
      !k.endsWith('.page.title') && !k.endsWith('.page.description') &&
      !k.endsWith('.page.serviceName') && !k.endsWith('.page.serviceCategory') &&
      !k.endsWith('.page.productName') && !k.endsWith('.page.productCategory');
  });

  const toTranslate = {};
  for (const k of industryKeys) {
    if (!target[k] || target[k] === en[k]) {
      toTranslate[k] = en[k];
    }
  }

  const keysList = Object.keys(toTranslate);
  console.log(`[${targetLang}] Found ${keysList.length} untranslated industry component keys`);

  if (keysList.length === 0) {
    console.log('✅ All already translated!');
    return;
  }

  let success = 0;
  for (let i = 0; i < keysList.length; i += 15) {
    const batch = keysList.slice(i, i + 15);
    const batchObj = {};
    for (const k of batch) batchObj[k] = toTranslate[k];

    console.log(`  Batch ${Math.floor(i/15)+1}/${Math.ceil(keysList.length/15)}...`);
    const result = await translateBatch(batchObj, targetLang);

    for (const [k, v] of Object.entries(result)) {
      if (v && typeof v === 'string' && v.length > 0 && v !== en[k]) {
        target[k] = v;
        success++;
      }
    }
    if (i + 15 < keysList.length) await new Promise(r => setTimeout(r, 800));
  }

  const sorted = {};
  Object.keys(target).sort().forEach(k => { sorted[k] = target[k]; });
  fs.writeFileSync(`${DIR}/${targetLang}.json`, JSON.stringify(sorted, null, 2) + '\n', 'utf8');
  console.log(`\n✅ Done! ${success}/${keysList.length} translated to ${LANG_MAP[targetLang].name} (${LANG_MAP[targetLang].std})`);
}

main().catch(console.error);
