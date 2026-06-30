/**
 * Add all missing laser process spectrum & spec dashboard keys to en.json and ja.json
 * Then translate remaining 8 languages via DeepSeek API.
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const TRANSLATIONS_DIR = path.resolve(__dirname, '../src/i18n/translations');
const EN_JSON = path.resolve(TRANSLATIONS_DIR, 'en.json');

const DEEPSEEK_API_KEY = 'sk-b187f5cf84c74f9aac8bd04b7fd0d2f8';
const DEEPSEEK_API_URL = 'https://api.deepseek.com/v1/chat/completions';

const TARGET_LANGS = ['de', 'fr', 'es', 'pt', 'it', 'ko', 'nl', 'pl'];
const LANG_NAMES = {
  de: 'German', fr: 'French', es: 'Spanish', pt: 'Portuguese',
  it: 'Italian', ko: 'Korean', nl: 'Dutch', pl: 'Polish'
};

// ===== KEYS FROM LaserProcessSpectrum.astro =====
const processSpectrumEn = {
  "services.laserprocessspectrum.badge": "Laser Cutting Capabilities",
  "services.laserprocessspectrum.title_prefix": "Sheet & Tube ",
  "services.laserprocessspectrum.subtitle": "Dual-infrastructure laser cutting capability — from 2D flat sheet profiling to 3D rotary tube machining — covering the full titanium component geometry spectrum.",
  "services.laserprocessspectrum.card1.title": "2D Flat Sheet Laser Cutting",
  "services.laserprocessspectrum.card1.subtitle": "High-Kilowatt Fiber Laser for Titanium Plates",
  "services.laserprocessspectrum.card1.desc": "Utilizing high-kilowatt fiber lasers for rapid cold-state profile profiling on pure and alloyed titanium plates — guaranteeing razor-sharp micro-mesh arrays, intricate internal cutouts, and weld-ready edge quality without secondary deburring.",
  "services.laserprocessspectrum.card1.cap0": "High-kW fiber laser sources optimized for titanium absorption spectrum",
  "services.laserprocessspectrum.card1.cap1": "Micro-mesh and fine-feature cutting down to ø 0.5 mm holes",
  "services.laserprocessspectrum.card1.cap2": "Rapid piercing and profile cutting with minimal HAZ (heat-affected zone)",
  "services.laserprocessspectrum.card1.cap3": "Large-format bed 3,000 x 1,500 mm accommodating full plate sizes",
  "services.laserprocessspectrum.card2.title": "3D Rotary Tube Laser Machining",
  "services.laserprocessspectrum.card2.subtitle": "Multi-Jaw Rotary Chucks for Complex Tube Profiles",
  "services.laserprocessspectrum.card2.desc": "Equipped with synchronized multi-jaw rotary chucks to execute complex 3D intersecting fish-mouth profiles, slots, and holes over round, square, or rectangular titanium tubes — in a single clamping setup without positional error accumulation.",
  "services.laserprocessspectrum.card2.cap0": "Synchronized rotary chucks for continuous helical and index cutting",
  "services.laserprocessspectrum.card2.cap1": "3D fish-mouth, saddle, and slot profile cutting on round/square/rectangular tubes",
  "services.laserprocessspectrum.card2.cap2": "Tube diameter capacity ø 20 mm – ø 220 mm with 6,000 mm raw length",
  "services.laserprocessspectrum.card2.cap3": "Automatic tube loading and unloading for batch production runs"
};

// ===== KEYS FROM LaserSpecsDashboard.astro =====
const specDashboardEn = {
  "services.laserspecsdashboard.badge": "Laser Specifications",
  "services.laserspecsdashboard.title_prefix": "Laser Cutting ",
  "services.laserspecsdashboard.subtitle": "Physical cut boundaries, geometric limits, and precision parameters of our fiber laser cutting infrastructure.",
  "services.laserspecsdashboard.footnote": "Specifications based on our fiber laser cutting systems. Actual achievable kerf and edge quality depend on material grade, thickness, and assist gas selection."
};

// ===== JAPANESE TRANSLATIONS (priority) =====
const processSpectrumJa = {
  "services.laserprocessspectrum.badge": "レーザー切断能力",
  "services.laserprocessspectrum.title_prefix": "シート＆チューブ ",
  "services.laserprocessspectrum.subtitle": "デュアルインフラストラクチャのレーザー切断能力 — 2Dフラットシートプロファイリングから3Dロータリーチューブ加工まで — チタン部品の全形状スペクトルをカバーします。",
  "services.laserprocessspectrum.card1.title": "2Dフラットシートレーザー切断",
  "services.laserprocessspectrum.card1.subtitle": "チタン板向けハイキロワットファイバーレーザー",
  "services.laserprocessspectrum.card1.desc": "純チタンおよび合金チタン板の高速コールドステートプロファイル切断にハイキロワットファイバーレーザーを活用。刃のように鋭いマイクロメッシュアレイ、複雑な内部切り抜き、二次的なバリ取り不要の溶接可能なエッジ品質を保証します。",
  "services.laserprocessspectrum.card1.cap0": "チタン吸収スペクトルに最適化されたハイkWファイバーレーザー光源",
  "services.laserprocessspectrum.card1.cap1": "ø 0.5 mm穴までのマイクロメッシュおよび微細形状切断",
  "services.laserprocessspectrum.card1.cap2": "HAZ（熱影響部）を最小限に抑えた急速穴あけとプロファイル切断",
  "services.laserprocessspectrum.card1.cap3": "フルサイズ板材に対応する3,000×1,500 mmの大型ベッド",
  "services.laserprocessspectrum.card2.title": "3Dロータリーチューブレーザー加工",
  "services.laserprocessspectrum.card2.subtitle": "複雑なチューブプロファイル向け多ジョー回転チャック",
  "services.laserprocessspectrum.card2.desc": "同期式多ジョー回転チャックを搭載し、丸型、角型、長方形のチタンチューブに対して複雑な3D交差フィッシュマウスプロファイル、スロット、穴を — 単一クランプセットアップで位置誤差の蓄積なく加工します。",
  "services.laserprocessspectrum.card2.cap0": "連続ヘリカル・インデックス切断用同期式回転チャック",
  "services.laserprocessspectrum.card2.cap1": "丸型・角型・長方形チューブの3Dフィッシュマウス、サドル、スロットプロファイル切断",
  "services.laserprocessspectrum.card2.cap2": "生管長6,000 mm、チューブ径ø 20 mm～ø 220 mm対応",
  "services.laserprocessspectrum.card2.cap3": "バッチ生産ラン向け自動チューブローディング・アンローディング"
};

const specDashboardJa = {
  "services.laserspecsdashboard.badge": "レーザー仕様",
  "services.laserspecsdashboard.title_prefix": "レーザー切断 ",
  "services.laserspecsdashboard.subtitle": "ファイバーレーザー切断インフラの物理的切断境界、形状限界、および精度パラメータ。",
  "services.laserspecsdashboard.footnote": "仕様は当社のファイバーレーザー切断システムに基づきます。実際の達成可能なカーフ幅とエッジ品質は、材料グレード、板厚、およびアシストガスの選択に依存します。"
};

// ===== STEP 1: Update en.json =====
function updateEn() {
  const en = JSON.parse(fs.readFileSync(EN_JSON, 'utf-8'));
  
  // Add process spectrum keys
  for (const [k, v] of Object.entries(processSpectrumEn)) {
    en[k] = v;
  }
  // Add spec dashboard keys
  for (const [k, v] of Object.entries(specDashboardEn)) {
    en[k] = v;
  }
  
  // Sort
  const sorted = {};
  for (const k of Object.keys(en).sort()) {
    sorted[k] = en[k];
  }
  fs.writeFileSync(EN_JSON, JSON.stringify(sorted, null, 2), 'utf-8');
  console.log(`Updated en.json: ${Object.keys(en).length} total keys`);
}

// ===== STEP 2: Update ja.json =====
function updateJa() {
  const jaPath = path.resolve(TRANSLATIONS_DIR, 'ja.json');
  const ja = JSON.parse(fs.readFileSync(jaPath, 'utf-8'));
  
  for (const [k, v] of Object.entries(processSpectrumJa)) {
    ja[k] = v;
  }
  for (const [k, v] of Object.entries(specDashboardJa)) {
    ja[k] = v;
  }
  
  const sorted = {};
  for (const k of Object.keys(ja).sort()) {
    sorted[k] = ja[k];
  }
  fs.writeFileSync(jaPath, JSON.stringify(sorted, null, 2), 'utf-8');
  console.log(`Updated ja.json: ${Object.keys(ja).length} total keys`);
}

// ===== STEP 3: Translate remaining 8 languages =====
async function translateForLang(lang) {
  const en = JSON.parse(fs.readFileSync(EN_JSON, 'utf-8'));
  
  // Combine all relevant keys
  const processKeys = Object.keys(processSpectrumEn);
  const specKeys = Object.keys(specDashboardEn);
  
  // Also include existing keys that might be missing
  const existingKeys = [
    'services.laserprocessspectrum.laser_process_spectrum',
    'services.laserspecsdashboard.metric0.desc',
    'services.laserspecsdashboard.metric0.label',
    'services.laserspecsdashboard.metric1.desc',
    'services.laserspecsdashboard.metric1.label',
    'services.laserspecsdashboard.metric2.desc',
    'services.laserspecsdashboard.metric2.label',
    'services.laserspecsdashboard.metric3.desc',
    'services.laserspecsdashboard.metric3.label',
    'services.laserspecsdashboard.specifications_dashboard_3'
  ];
  
  const allRelevantKeys = [...new Set([...processKeys, ...specKeys, ...existingKeys])];
  
  const langFile = path.resolve(TRANSLATIONS_DIR, `${lang}.json`);
  const langData = JSON.parse(fs.readFileSync(langFile, 'utf-8'));
  
  // Find keys that are missing or still English
  const untranslated = allRelevantKeys.filter(k => {
    if (!(k in langData)) return true;
    return langData[k] === en[k];
  });
  
  console.log(`\n${LANG_NAMES[lang]} (${lang}): ${untranslated.length} keys need translation`);
  
  if (untranslated.length === 0) {
    console.log('  Nothing to translate - all done!');
    return;
  }
  
  const toTranslate = {};
  for (const k of untranslated) {
    toTranslate[k] = en[k];
  }
  const entries = Object.entries(toTranslate);
  
  const BATCH_SIZE = 25;
  const batches = [];
  for (let i = 0; i < entries.length; i += BATCH_SIZE) {
    batches.push(entries.slice(i, i + BATCH_SIZE));
  }
  
  let translated = 0;
  let errors = 0;
  
  for (let i = 0; i < batches.length; i++) {
    const jsonInput = JSON.stringify(Object.fromEntries(batches[i]), null, 2);
    
    const prompt = `You are a professional ${LANG_NAMES[lang]} translator for an industrial titanium fabrication website.
Translate the following English key-value pairs to natural, professional ${LANG_NAMES[lang]}.

RULES:
- Keep technical terms/acronyms unchanged: CNC, kW, HAZ, mm, Ra
- Keep measurement units and values unchanged: "3,000 x 1,500 mm", "ø 20 mm", "ø 0.5 mm", "6,000 mm", "Ra 1.6-3.2 µm", "±0.03 mm"
- Keep ALL special characters, symbols: "—", "×", "±", "≥", "≤", "°", "&", "<", ">", "ø", "µm"
- Translate the VALUES only (right side of colon), keep the KEYS (left side of colon) exactly as-is
- Use proper ${LANG_NAMES[lang]} grammar and industry terminology
- Return ONLY a valid JSON object with the same keys and translated values

Here is the batch ${i + 1}/${batches.length}:

\`\`\`json
${jsonInput}
\`\`\``;
    
    console.log(`  Batch ${i + 1}/${batches.length} (${batches[i].length} entries)...`);
    
    try {
      const response = await fetch(DEEPSEEK_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${DEEPSEEK_API_KEY}`,
        },
        body: JSON.stringify({
          model: 'deepseek-chat',
          messages: [
            { role: 'system', content: `You are a professional ${LANG_NAMES[lang]} translator for industrial/manufacturing content. Return ONLY valid JSON.` },
            { role: 'user', content: prompt },
          ],
          temperature: 0.1,
          max_tokens: 16000,
        }),
      });
      
      if (!response.ok) {
        const errText = await response.text();
        throw new Error(`API error ${response.status}: ${errText}`);
      }
      
      const data = await response.json();
      const content = data.choices[0].message.content.trim();
      
      const jsonMatch = content.match(/```(?:json)?\s*([\s\S]*?)\s*```/) || content.match(/{[\s\S]*}/);
      const jsonStr = jsonMatch ? jsonMatch[1] || jsonMatch[0] : content;
      
      const result = JSON.parse(jsonStr);
      
      for (const [key, value] of Object.entries(result)) {
        if (value && typeof value === 'string') {
          langData[key] = value;
          translated++;
        }
      }
      console.log(`    ✓ Batch ${i + 1} done (${translated} total so far)`);
    } catch (err) {
      console.error(`    ✗ Batch ${i + 1} failed: ${err.message}`);
      errors++;
    }
    
    if (i < batches.length - 1) {
      await new Promise(r => setTimeout(r, 500));
    }
  }
  
  // Write
  const sorted = {};
  for (const k of Object.keys(langData).sort()) {
    sorted[k] = langData[k];
  }
  fs.writeFileSync(langFile, JSON.stringify(sorted, null, 2), 'utf-8');
  
  const stillMissing = allRelevantKeys.filter(k => !(k in sorted));
  console.log(`  ${LANG_NAMES[lang]} complete: +${translated}, errors: ${errors}, still missing: ${stillMissing.length}`);
}

async function main() {
  // Step 1: Update en.json
  updateEn();
  
  // Step 2: Update ja.json
  updateJa();
  
  // Step 3: Update components - we'll do this separately
  
  // Step 4: Translate 8 langs
  for (const lang of TARGET_LANGS) {
    await translateForLang(lang);
  }
  
  console.log('\nALL DONE!');
}

main().catch(err => {
  console.error('Fatal:', err);
  process.exit(1);
});