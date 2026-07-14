/**
 * ═══════════════════════════════════════════════════════════
 *   Aerospace 行业页面 完整 i18n 化流水线
 *   
 *   1. 提取所有硬编码文本 → 写入 en.json
 *   2. 替换组件为 t() 调用
 *   3. DeepSeek 翻译到 11 语言（按您的规范）
 *   
 *   翻译规范:
 *   - DE: DIN 标准, "Sie" 敬语, 复合名词优先
 *   - JA: JIS 标准, 制造业敬语
 *   - FR: AFNOR 标准, "Vous"
 *   - ES/PT: 专业B2B工业用语
 *   - IT: UNI 高精度工程术语
 *   - KO: KS 标准, 존댓말
 *   - NL/PL: 企业B2B精准措辞
 *   - RU: GOST 重工业术语
 *   - AR: 正式MSA, RTL适配
 *   ═══════════════════════════════════════════════════════════
 */

import fs from 'fs';

const ROOT = 'c:/Users/Administrator/Desktop/AstroFlow-master-jt';
const EN_FILE = ROOT + '/src/i18n/translations/en.json';

// ── 1. 定义所有 Aerospace 的 i18n key ─────────────────

const AERO_KEYS = {
  // ── Page metadata ──
  'industries.aerospace.page.title': 'Aerospace Titanium CNC Machining | AS9100D Certified Factory',
  'industries.aerospace.page.description': 'AS9100D certified 5-axis CNC machining for Grade 5 titanium aerospace brackets. Full EN 10204 3.1 MTR material tracing, AS9102 First Article Inspection reports, and CMM dimensional validation per ASME Y14.5 GD&T.',
  'industries.aerospace.page.serviceName': 'Aerospace Titanium CNC Machining Services',
  'industries.aerospace.page.serviceCategory': 'Aerospace & Defense',
  'industries.aerospace.page.productName': 'Aerospace Titanium Brackets, Fasteners & Hydraulic Valve Stems',
  'industries.aerospace.page.productCategory': 'Aerospace Components',

  // ── Hero section ──
  'industries.aerospace.hero.badge': 'Aerospace & Defense',
  'industries.aerospace.hero.h1': '5-Axis CNC Machining — Grade 5 Titanium Aerospace Structural Components',
  'industries.aerospace.hero.subtitle': 'Custom precision 5-axis CNC milling and Swiss lathe turning of aerospace-grade titanium for mission-critical structural brackets, bulkheads, fasteners, and hydraulic valve stems. AS9100D, AS9102 FAIR, and EN 10204 3.1 MTR certified.',

  // ── Section 1: FiveAxis ──
  'industries.aerospace.fiveAxis.badge': '5-Axis CNC Machining',
  'industries.aerospace.fiveAxis.title.main': '5-Axis CNC Machining',
  'industries.aerospace.fiveAxis.title.suffix': 'Grade 5 Titanium Aerospace Structural Components',
  'industries.aerospace.fiveAxis.desc': 'Simultaneous 5-axis milling of Grade 5 Titanium (Ti-6Al-4V) for aerospace brackets, bulkheads, and structural airframe nodes. Full GD&T compliance per ASME Y14.5 with active tool deflection compensation during thin-walled section milling.',
  'industries.aerospace.fiveAxis.card1.title': 'Full 5-Axis Simultaneous Contouring',
  'industries.aerospace.fiveAxis.card1.subtitle': '5-Axis CNC · DMG MORI / Mazak',
  'industries.aerospace.fiveAxis.card1.desc': 'Machining complex aerospace geometries — compound-angle brackets, twisted airframe nodes, and thin-walled bulkheads — in a single clamping operation. Eliminates positional errors from re-fixturing.',
  'industries.aerospace.fiveAxis.card1.implLabel': 'Technical Implementation',
  'industries.aerospace.fiveAxis.card1.item1': 'Adaptive trochoidal tool paths limit radial engagement to <10% of tool Ø — suppresses vibration on thin-wall structures',
  'industries.aerospace.fiveAxis.card1.item2': 'Real-time spindle load feedback prevents work-hardening glazing on previously cut Ti-6Al-4V surfaces',
  'industries.aerospace.fiveAxis.card1.item3': 'Achieves Ra 0.4 µm surface finish on aerospace structural brackets — eliminates secondary benching operations',
  'industries.aerospace.fiveAxis.card2.title': 'Tool Deflection & Thin-Wall Compensation',
  'industries.aerospace.fiveAxis.card2.subtitle': 'Dynamic Compensation · ±0.005mm Tolerance',
  'industries.aerospace.fiveAxis.card2.desc': 'Finite Element Analysis (FEA)-driven toolpath compensation predicts and counteracts tool deflection during thin-wall aerospace section milling. Closed-loop feedback ensures dimensional accuracy.',
  'industries.aerospace.fiveAxis.card2.implLabel': 'Technical Implementation',
  'industries.aerospace.fiveAxis.card2.item1': 'FEA-predicted tool deflection maps adjust feed-rate in real time — eliminates trial-and-error cutter passes',
  'industries.aerospace.fiveAxis.card2.item2': 'Adaptive feed-rate control reduces radial engagement below 10% of tool diameter, eliminating work-hardening glazing',
  'industries.aerospace.fiveAxis.card2.item3': 'Maintains geometric accuracy on high-aspect-ratio wall sections down to 0.5 mm thickness',
  'industries.aerospace.fiveAxis.entityLabel': 'Entity Cluster',
  'industries.aerospace.fiveAxis.entity.0': '5-Axis CNC Machining',
  'industries.aerospace.fiveAxis.entity.1': 'Grade 5 Titanium Ti-6Al-4V',
  'industries.aerospace.fiveAxis.entity.2': 'Aerospace Brackets & Bulkheads',
  'industries.aerospace.fiveAxis.entity.3': 'ASME Y14.5 GD&T',

  // ── Section 2: SwissTurning ──
  'industries.aerospace.swissTurning.badge': 'Precision Swiss Turning',
  'industries.aerospace.swissTurning.title.main': 'CNC Swiss Lathe Turning',
  'industries.aerospace.swissTurning.title.suffix': 'Aerospace Fasteners, Valve Stems & Grade 19 Beta Titanium',
  'industries.aerospace.swissTurning.desc': 'Micro-precision CNC Swiss turning of Grade 19 Beta Titanium (Ti-3Al-8V-6Cr-4Mo-4Zr) and Grade 5 (Ti-6Al-4V) for aerospace fasteners, threaded inserts, and hydraulic valve stems. Engineered to eliminate stress concentration in high-cycle fatigue threading.',
  'industries.aerospace.swissTurning.card1.title': 'Grade 19 Beta Titanium Swiss Turning',
  'industries.aerospace.swissTurning.card1.subtitle': 'CNC Swiss Lathe · Ti-3Al-8V-6Cr-4Mo-4Zr',
  'industries.aerospace.swissTurning.card1.desc': 'Grade 19 Beta Titanium (Timetal 19) is the material of choice for high-strength aerospace fasteners and hydraulic valve stems — offering 1,240 MPa tensile strength with excellent corrosion resistance. Our CNC Swiss lathes hold tolerances to ±0.005 mm on small-diameter turned profiles.',
  'industries.aerospace.swissTurning.card1.implLabel': 'Technical Implementation',
  'industries.aerospace.swissTurning.card1.item1': 'Precision-ground single-point form tools for consistent UNJF/MJ thread root radii — eliminates notching fatigue',
  'industries.aerospace.swissTurning.card1.item2': 'Micro-finishing pass on hydraulic stem seal diameters — Ra 0.2 µm surface finish for zero-leak applications',
  'industries.aerospace.swissTurning.card1.item3': 'Full thread-form inspection via optical comparator — 100% compliance with AS8879, MIL-S-8879C thread standards',
  'industries.aerospace.swissTurning.card2.title': 'Thread Stress Concentration Elimination',
  'industries.aerospace.swissTurning.card2.subtitle': 'Fatigue Life Optimization · Aerospace Fasteners',
  'industries.aerospace.swissTurning.card2.desc': 'Thread root geometry is the primary stress concentration site in aerospace fasteners. Our Swiss turning process controls thread root radius to eliminate notching, and applies post-process stress relief to maximize high-cycle fatigue life.',
  'industries.aerospace.swissTurning.card2.implLabel': 'Technical Implementation',
  'industries.aerospace.swissTurning.card2.item1': 'UNJF/MJ thread root radius controlled to AS8879 specification — eliminates sharp corners that initiate fatigue cracks',
  'industries.aerospace.swissTurning.card2.item2': 'Post-process thermal stress-relief cycle at 315°C for 2 hours — reduces residual tensile stresses by 40%',
  'industries.aerospace.swissTurning.card2.item3': 'Fatigue test verification per ASTM E466 — 10⁷ cycle minimum runout demonstrated on production lots',
  'industries.aerospace.swissTurning.entityLabel': 'Entity Cluster',
  'industries.aerospace.swissTurning.entity.0': 'CNC Swiss Lathe Turning',
  'industries.aerospace.swissTurning.entity.1': 'Grade 19 Beta Titanium',
  'industries.aerospace.swissTurning.entity.2': 'Aerospace Fasteners',
  'industries.aerospace.swissTurning.entity.3': 'Hydraulic Valve Stems',
  'industries.aerospace.swissTurning.entity.4': 'AS8879 Threads',

  // ── Section 3: Compliance ──
  'industries.aerospace.compliance.badge': 'Material Traceability & Compliance',
  'industries.aerospace.compliance.title.main': '100% Material Traceability',
  'industries.aerospace.compliance.title.suffix': 'EN 10204 3.1 MTR, Heat Number Tracking & AS9102 FAIR',
  'industries.aerospace.compliance.desc': 'Full chain of custody from raw mill ingot to finished aerospace component. Every batch carries an EN 10204 3.1 Mill Test Report, unique heat number hard-stamped or laser-etched, and a complete AS9102 First Article Inspection Report before production scale-up.',
  'industries.aerospace.compliance.pillar1.title': 'EN 10204 3.1 Mill Test Reports',
  'industries.aerospace.compliance.pillar1.desc': 'Every incoming titanium lot — Grade 5, Grade 19, or Grade 23 — is verified against its EN 10204 3.1 Mill Test Report. Chemical composition, mechanical properties, and ultrasonic integrity are confirmed and archived.',
  'industries.aerospace.compliance.pillar1.item1': 'Chemical composition verified per ASTM E2371 — O₂ ≤0.20%, N₂ ≤0.05%, Fe ≤0.40%',
  'industries.aerospace.compliance.pillar1.item2': 'Mechanical properties certified: UTS, 0.2% Yield Strength, % Elongation, % RA, Hardness',
  'industries.aerospace.compliance.pillar1.item3': 'Digital MTR archive — each heat associated with unique batch ID for full lot traceability',
  'industries.aerospace.compliance.pillar2.title': 'Heat Number Identification',
  'industries.aerospace.compliance.pillar2.desc': 'Every component carries its originating mill heat number — laser-etched, hard-stamped, or DataMatrix-encoded per customer specification. Full chain of custody from melt to finished assembly.',
  'industries.aerospace.compliance.pillar2.item1': 'Heat number laser-etched or hard-stamped per customer marking specification',
  'industries.aerospace.compliance.pillar2.item2': 'DataMatrix 2D barcode serialization for automated tracking through production and supply chain',
  'industries.aerospace.compliance.pillar2.item3': 'DFARS-compliant domestic titanium sourcing — full country-of-origin documentation',
  'industries.aerospace.compliance.pillar3.title': 'AS9102 First Article Inspection',
  'industries.aerospace.compliance.pillar3.desc': 'Every aerospace production run begins with a complete AS9102 First Article Inspection Report (FAIR) — covering dimensional, material, and process validation. The FAIR package ensures full design intent verification against engineering drawing requirements before volume scale-up.',
  'industries.aerospace.compliance.pillar3.item1': 'AS9102 form-compliant reporting: design data check, material/process certs, dimensional results',
  'industries.aerospace.compliance.pillar3.item2': '100% dimensional validation of all drawing-characteristic callouts with CMM points',
  'industries.aerospace.compliance.pillar3.item3': 'FAIR package delivered with every first production lot — auditable by prime contractors',
  'industries.aerospace.compliance.entityLabel': 'Entity Cluster',
  'industries.aerospace.compliance.entity.0': 'EN 10204 3.1 MTR',
  'industries.aerospace.compliance.entity.1': 'Heat Number Tracking',
  'industries.aerospace.compliance.entity.2': 'AS9102 FAIR',
  'industries.aerospace.compliance.entity.3': 'DFARS Compliance',
  'industries.aerospace.compliance.entity.4': 'AS9100D aligned',

  // ── Section 4: Metrology ──
  'industries.aerospace.metrology.badge': 'Precision Metrology',
  'industries.aerospace.metrology.title.main': 'CMM Dimensional Gating',
  'industries.aerospace.metrology.title.suffix': 'ASME Y14.5 GD&T Validation for Aerospace Components',
  'industries.aerospace.metrology.desc': 'Absolute dimensional validation via Coordinate Measuring Machine (CMM) with geometric accuracy verified against ASME Y14.5 GD&T specifications. Every aerospace bracket, structural component, and fastener lot is measured against engineering drawing callouts before release.',
  'industries.aerospace.metrology.card1.title': 'CMM (Coordinate Measuring Machine)',
  'industries.aerospace.metrology.card1.subtitle': 'ZEISS CMM · ±1.9 µm Accuracy',
  'industries.aerospace.metrology.card1.desc': 'Our in-house metrology lab is equipped with ZEISS CMM platforms capable of measuring complex aerospace geometries — brackets, bulkheads, valve stems, and threaded fasteners — with volumetric accuracy of ±1.9 µm. Every dimensional characteristic per the engineering drawing is captured, analyzed, and reported.',
  'industries.aerospace.metrology.card1.implLabel': 'Technical Implementation',
  'industries.aerospace.metrology.card1.item1': 'Full 5-axis CMM scanning with adaptive probe path planning — reduces inspection time by 60% vs touch-trigger',
  'industries.aerospace.metrology.card1.item2': 'ZEISS CALYPSO metrology software — native GD&T callout interpretation and true-position reporting',
  'industries.aerospace.metrology.card1.item3': 'Temperature-controlled lab (20°C ±0.5°C) — eliminates thermal expansion error on titanium components',
  'industries.aerospace.metrology.card2.title': 'ASME Y14.5 GD&T Compliance',
  'industries.aerospace.metrology.card2.subtitle': 'Geometric Dimensioning & Tolerancing · ASME Y14.5',
  'industries.aerospace.metrology.card2.desc': 'All aerospace components are measured and reported to ASME Y14.5 GD&T standards. Our metrology team interprets every drawing callout — from simple flatness to complex profile-of-surface — ensuring full compliance with engineering requirements.',
  'industries.aerospace.metrology.card2.implLabel': 'Technical Implementation',
  'industries.aerospace.metrology.card2.item1': 'GD&T callout interpretation: flatness, parallelism, perpendicularity, position, profile, runout',
  'industries.aerospace.metrology.card2.item2': 'Datum reference frame alignment — ensures measurement consistency across first article and production runs',
  'industries.aerospace.metrology.card2.item3': 'SPC data trending — early detection of tool wear, thermal drift, or fixture variation',
  'industries.aerospace.metrology.entityLabel': 'Entity Cluster',
  'industries.aerospace.metrology.entity.0': 'CMM (Coordinate Measuring Machine)',
  'industries.aerospace.metrology.entity.1': 'ASME Y14.5 GD&T',
  'industries.aerospace.metrology.entity.2': 'ZEISS CMM',
  'industries.aerospace.metrology.entity.3': 'ISO 17025',
  'industries.aerospace.metrology.entity.4': 'SPC Quality Control',

  // ── Section 5: CTA ──
  'industries.aerospace.cta.badge': 'Start Your Aerospace Project',
  'industries.aerospace.cta.title.line1': 'Ready for AS9100D Certified',
  'industries.aerospace.cta.title.line2': 'Aerospace Titanium CNC Machining?',
  'industries.aerospace.cta.desc': 'Submit your engineering drawings or CAD models for a complimentary Design for Manufacturability (DFM) analysis. Our engineering team will review your aerospace bracket, fastener, or structural component requirements and respond with a competitive quote within 24 hours.',
  'industries.aerospace.cta.badge1': 'AS9100D Certified',
  'industries.aerospace.cta.badge2': 'Grade 5 & Grade 19 Ti',
  'industries.aerospace.cta.badge3': '5-Axis CNC Capable',
  'industries.aerospace.cta.badge4': 'Full MTR Tracing',
  'industries.aerospace.cta.button': 'Request Aerospace DFM Analysis & Quote',
  'industries.aerospace.cta.trust': 'Engineering response within 24 hours · CAD models accepted in STEP, IGES, STL formats',
};

// ── 写入 en.json ──────────────────────────

const en = JSON.parse(fs.readFileSync(EN_FILE, 'utf8'));
let added = 0;
for (const [key, val] of Object.entries(AERO_KEYS)) {
  if (!en[key]) {
    en[key] = val;
    added++;
  }
}
const sorted = {};
Object.keys(en).sort().forEach(k => { sorted[k] = en[k]; });
fs.writeFileSync(EN_FILE, JSON.stringify(sorted, null, 2) + '\n', 'utf8');
console.log(`✅ en.json: 添加 ${added} 个新 key`);

// ── 翻译到 11 种语言 ──────────────────────────

const LANG_MAP = {
  de: { name: 'German', std: 'DIN', tone: 'Formal "Sie". Use compound nouns. Expect 15-25% expansion.' },
  ja: { name: 'Japanese', std: 'JIS', tone: 'Polite 敬語 (keigo). Compact. Manufacturing industry register.' },
  fr: { name: 'French', std: 'AFNOR', tone: 'Formal "Vous". Moderate care for text expansion 10-15%.' },
  es: { name: 'Spanish', std: 'UNE/ISO', tone: 'Professional B2B. Neutral European/LATAM blend.' },
  pt: { name: 'Portuguese', std: 'ABNT/ISO', tone: 'Professional B2B. Neutral Brazil/Portugal blend.' },
  it: { name: 'Italian', std: 'UNI', tone: 'High-precision engineering nomenclature.' },
  ko: { name: 'Korean', std: 'KS', tone: 'Formal business 존댓말. Compact.' },
  nl: { name: 'Dutch', std: 'NEN', tone: 'Corporate B2B. Sharp, direct phrasing.' },
  pl: { name: 'Polish', std: 'PN', tone: 'Corporate B2B. Technical precision.' },
  ru: { name: 'Russian', std: 'GOST', tone: 'Formal technical. Expect 15-25% expansion.' },
  ar: { name: 'Arabic', std: 'SASO', tone: 'Formal MSA (فصحى). RTL. Expect 10-15% contraction.' },
};

// Titanium vocabulary mapping
const VOCAB_GUIDE = `
Titanium vocabulary — ALWAYS use exact technical terms:
- Galling / Tool Adhesion (NOT "sticky knife")
- Tool Chipping / Micro-chipping (NOT "blade collapse")
- Feed Rate (NOT "feeding")
- Built-up Edge (BUE) (NOT "built-up tumor")
- Aging / Age Hardening (NOT "timely treatment")
- Superplastic Forming (SPF) (NOT "super plastic forming")
- Heat Treatment (NOT "hot treatment")
- Residual Stress (NOT "remaining stress")
- Fatigue Life (NOT "tired life")
- Fracture Toughness (NOT "fracture weakness")

Standard names — KEEP EXACTLY AS-IS:
AS9100D, NADCAP, AMS, ASTM, EN 10204, AS9102, ASME Y14.5, MIL-S-8879C, AS8879,
ZEISS, CMM, GD&T, FAIR, MTR, DFARS, SPC, ISO 17025, CAD, STEP, IGES, STL,
Grade 5, Grade 19, Grade 23, Ti-6Al-4V, Ti-3Al-8V-6Cr-4Mo-4Zr, Timetal,
DMG MORI, Mazak, Ra, µm, MPa, UNJF, MJ
`;

const API_URL = 'https://api.deepseek.com/v1/chat/completions';
const API_KEY = 'sk-b187f5cf84c74f9aac8bd04b7fd0d2f8';

async function translateBatch(texts, langCode, langInfo) {
  const keys = Object.keys(texts);
  if (keys.length === 0) return {};
  
  const srcJson = JSON.stringify(texts, null, 2);
  
  const sysPrompt = `You are a professional industrial translator specializing in titanium metallurgy and precision CNC manufacturing.

Standard body: ${langInfo.std}
Language: ${langInfo.name}
Tone/Register: ${langInfo.tone}

${VOCAB_GUIDE}

Rules:
1. NEVER translate JSON keys — only values
2. NEVER modify technical standard names (AS9100D, ASTM, ZEISS, etc.)
3. NEVER alter units (µm, MPa, °C, %, mm)
4. NEVER translate alloy compositions (Ti-6Al-4V, Grade 5, etc.)
5. For GERMAN: use compound nouns (e.g. "Titanlegierungsgüte" not "Güte der Titanlegierung")
6. For JAPANESE: use 敬語 (keigo), manufacturing business register
7. For ARABIC: ensure RTL compatibility, keep punctuation clean
8. Keep translations concise — match source string length as closely as possible (max 120%)
9. Return ONLY a valid JSON object with EXACT same keys. No markdown, no backticks.`;

  try {
    const resp = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${API_KEY}` },
      body: JSON.stringify({
        model: 'deepseek-chat',
        messages: [
          { role: 'system', content: sysPrompt },
          { role: 'user', content: `Translate these English industrial manufacturing strings to ${langInfo.name}. Follow your standard body (${langInfo.std}), tone rules, and vocabulary mapping:\n\n${srcJson}` }
        ],
        temperature: 0.1,
        max_tokens: 8192
      })
    });
    
    if (!resp.ok) {
      const err = await resp.text();
      console.error(`  ❌ HTTP ${resp.status}: ${err.substring(0, 200)}`);
      return {};
    }
    
    const data = await resp.json();
    const raw = data.choices?.[0]?.message?.content || '{}';
    const cleaned = raw.replace(/```json\s*/gi, '').replace(/```/g, '').trim();
    return JSON.parse(cleaned);
  } catch (e) {
    console.error(`  ❌ Error: ${e.message}`);
    return {};
  }
}

// ── 翻译函数 ──
async function translateLanguage(code, info) {
  const file = `${ROOT}/src/i18n/translations/${code}.json`;
  const target = JSON.parse(fs.readFileSync(file, 'utf8'));
  
  const toTranslate = {};
  for (const [key, val] of Object.entries(AERO_KEYS)) {
    if (!target[key] || target[key] === val) {
      toTranslate[key] = val;
    }
  }
  
  const keysList = Object.keys(toTranslate);
  if (keysList.length === 0) {
    console.log(`  [${code}] ✅ 已全部翻译`);
    return;
  }
  
  console.log(`  [${code}] ${info.name} — ${keysList.length} 条待翻译...`);
  let success = 0;
  
  for (let i = 0; i < keysList.length; i += 15) {
    const batch = keysList.slice(i, i + 15);
    const batchObj = {};
    for (const k of batch) batchObj[k] = toTranslate[k];
    
    const result = await translateBatch(batchObj, code, info);
    for (const [k, v] of Object.entries(result)) {
      if (v && typeof v === 'string' && v.length > 0 && v !== AERO_KEYS[k]) {
        target[k] = v;
        success++;
      }
    }
    if (i + 15 < keysList.length) await new Promise(r => setTimeout(r, 1000));
  }
  
  const sorted = {};
  Object.keys(target).sort().forEach(k => { sorted[k] = target[k]; });
  fs.writeFileSync(file, JSON.stringify(sorted, null, 2) + '\n', 'utf8');
  console.log(`  [${code}] ✅ ${success}/${keysList.length}`);
}

// 单步运行：用命令行参数指定语言
const targetLang = process.argv[2];
if (targetLang) {
  if (LANG_MAP[targetLang]) {
    translateLanguage(targetLang, LANG_MAP[targetLang]);
  } else {
    console.log(`用法: node scripts/i18n-aerospace.mjs [语言代码]\n  语言: ${Object.keys(LANG_MAP).join(', ')}`);
  }
} else {
  console.log('✅ en.json 已更新。运行翻译: node scripts/i18n-aerospace.mjs de');
}
