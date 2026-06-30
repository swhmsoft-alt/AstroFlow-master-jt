/**
 * Add WeldingAssemblySpectrum + AssemblySpecsDashboard keys to all languages.
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

// ===== WeldingAssemblySpectrum keys =====
const spectrumEn = {
  "services.weldingassemblyspectrum.badge": "Welding & Assembly Capabilities",
  "services.weldingassemblyspectrum.title_prefix": "Welding & Assembly ",
  "services.weldingassemblyspectrum.subtitle": "From ultra-pure TIG welding with triple argon shielding to full multi-component system assembly — three integrated capabilities for mission-critical titanium structures.",
  "services.weldingassemblyspectrum.card1.title": "Ultra-Pure TIG Welding",
  "services.weldingassemblyspectrum.card1.subtitle": "Digital Pulsed GTAW with Oversized Trailing Shields",
  "services.weldingassemblyspectrum.card1.desc": "Digital pulsed GTAW (Gas Tungsten Arc Welding) control paired with custom oversized trailing shield matrices to achieve elite silver/straw aerospace-grade joints — completely free of oxide discoloration and alpha-case embrittlement.",
  "services.weldingassemblyspectrum.card1.cap0": "Digital pulsed GTAW with ±0.5 A current regulation precision",
  "services.weldingassemblyspectrum.card1.cap1": "Custom trailing shields up to 150 mm width for full HAZ coverage",
  "services.weldingassemblyspectrum.card1.cap2": "Pre-flow, trailing, and backing argon triple-shield streams",
  "services.weldingassemblyspectrum.card1.cap3": "Real-time weld parameter logging per AWS D1.6 / ASME Section IX",
  "services.weldingassemblyspectrum.card2.title": "High Penetration Laser Welding",
  "services.weldingassemblyspectrum.card2.subtitle": "Concentrated Energy, Minimal Heat Input",
  "services.weldingassemblyspectrum.card2.desc": "Concentrated high energy density laser welding reducing total heat input by up to 60% versus TIG — minimizing grain coarsening and thermal micro-warping in critical structural and sealing weld paths.",
  "services.weldingassemblyspectrum.card2.cap0": "Keyhole-mode laser welding for deep penetration with narrow HAZ",
  "services.weldingassemblyspectrum.card2.cap1": "Reduced heat input minimizes distortion in thin-gauge assemblies",
  "services.weldingassemblyspectrum.card2.cap2": "Automatic seam tracking for consistent weld placement",
  "services.weldingassemblyspectrum.card2.cap3": "Ideal for hermetic sealing and structural node joining",
  "services.weldingassemblyspectrum.card3.title": "Multi-Component System Assembly",
  "services.weldingassemblyspectrum.card3.subtitle": "Structural Fasteners, Torque Layout & Anti-Galling Compliance",
  "services.weldingassemblyspectrum.card3.desc": "System-level integration incorporating structural fasteners, precise torque layout constraints, and anti-galling engineering compliance — delivering fully assembled, tested, and documented sub-systems ready for final integration.",
  "services.weldingassemblyspectrum.card3.cap0": "Structural assembly with torque-controlled fastener installation",
  "services.weldingassemblyspectrum.card3.cap1": "Anti-galling compound application per aerospace specifications",
  "services.weldingassemblyspectrum.card3.cap2": "Multi-axis CMM verification of assembly spatial tolerances",
  "services.weldingassemblyspectrum.card3.cap3": "Full documentation package: torque logs, alignment reports, NDT results"
};

// ===== AssemblySpecsDashboard keys =====
const specEn = {
  "services.assemblyspecsdashboard.badge": "Assembly Specifications",
  "services.assemblyspecsdashboard.title_prefix": "Welding & Assembly ",
  "services.assemblyspecsdashboard.subtitle": "Precision boundaries for weld current control, argon shielding, mechanical assembly fit, and thread quality assurance.",
  "services.assemblyspecsdashboard.footnote": "All welding performed per AWS D1.6 / ASME Section IX. Assembly torque certified per fastener grade and lubrication specification.",
  "services.assemblyspecsdashboard.metric0.label": "Welding Current Regulation",
  "services.assemblyspecsdashboard.metric0.desc": "Digital boundary tracking precision down to ±0.5 A limits — ensuring consistent heat input and weld pool control across the full joint geometry, from thin-gauge sheet to heavy plate.",
  "services.assemblyspecsdashboard.metric1.label": "Argon Purge Shield Trailing Width",
  "services.assemblyspecsdashboard.metric1.desc": "Extended physical trailing enclosure paths up to 150 mm width — providing complete inert gas coverage over the weld pool and heat-affected zone until temperatures drop below 250°C.",
  "services.assemblyspecsdashboard.metric2.label": "Mechanical Assembly Spatial Tolerance",
  "services.assemblyspecsdashboard.metric2.desc": "Strict multidirectional space compliance within ±0.05 mm metrics — verified via multi-axis CMM inspection for bolted interfaces, dowel pin alignments, and mating surface registration.",
  "services.assemblyspecsdashboard.metric3.label": "Thread Integration Quality",
  "services.assemblyspecsdashboard.metric3.desc": "100% qualified under ultrasonic anti-galling lubrication verification and precise dynamic torque tracking — guaranteeing thread integrity, clamp load accuracy, and galling-free fastener installation."
};

// ===== Japanese translations =====
const spectrumJa = {
  "services.weldingassemblyspectrum.badge": "溶接・組立能力",
  "services.weldingassemblyspectrum.title_prefix": "溶接・組立 ",
  "services.weldingassemblyspectrum.subtitle": "トリプルアルゴンシールドによる超高純度TIG溶接から、完全なマルチコンポーネントシステム組立まで — ミッションクリティカルなチタン構造物のための3つの統合能力。",
  "services.weldingassemblyspectrum.card1.title": "超高純度TIG溶接",
  "services.weldingassemblyspectrum.card1.subtitle": "大型トレーリングシールドを備えたデジタルパルスGTAW",
  "services.weldingassemblyspectrum.card1.desc": "デジタルパルスGTAW（ガスタングステンアーク溶接）制御とカスタム大型トレーリングシールドマトリックスを組み合わせ、酸化物変色やアルファケース脆化のない、エリートシルバー/ストロー色の航空宇宙グレード継手を実現。",
  "services.weldingassemblyspectrum.card1.cap0": "±0.5 Aの電流調整精度を持つデジタルパルスGTAW",
  "services.weldingassemblyspectrum.card1.cap1": "HAZを完全カバーする最大150 mm幅のカスタムトレーリングシールド",
  "services.weldingassemblyspectrum.card1.cap2": "プリフロー、トレーリング、バッキングのトリプルアルゴンシールドストリーム",
  "services.weldingassemblyspectrum.card1.cap3": "AWS D1.6 / ASME Section IXに準拠したリアルタイム溶接パラメータロギング",
  "services.weldingassemblyspectrum.card2.title": "高浸透レーザー溶接",
  "services.weldingassemblyspectrum.card2.subtitle": "集中エネルギー、最小限の入熱",
  "services.weldingassemblyspectrum.card2.desc": "集中高エネルギー密度レーザー溶接により、TIGと比較して総入熱を最大60%削減 — 重要な構造およびシール溶接経路における粒成長と熱マイクロ反りを最小化。",
  "services.weldingassemblyspectrum.card2.cap0": "狭いHAZで深い浸透を実現するキーホールモードレーザー溶接",
  "services.weldingassemblyspectrum.card2.cap1": "低減された入熱により薄ゲージ組立品の歪みを最小化",
  "services.weldingassemblyspectrum.card2.cap2": "一貫した溶接配置のための自動シームトラッキング",
  "services.weldingassemblyspectrum.card2.cap3": "気密シールおよび構造ノード接合に最適",
  "services.weldingassemblyspectrum.card3.title": "マルチコンポーネントシステム組立",
  "services.weldingassemblyspectrum.card3.subtitle": "構造用ファスナー、トルクレイアウト、耐ギャリング準拠",
  "services.weldingassemblyspectrum.card3.desc": "構造用ファスナー、精密トルクレイアウト制約、耐ギャリングエンジニアリング準拠を組み込んだシステムレベル統合 — 最終統合に ready な、完全に組み立て、試験、文書化されたサブシステムを提供。",
  "services.weldingassemblyspectrum.card3.cap0": "トルク制御ファスナー取付による構造組立",
  "services.weldingassemblyspectrum.card3.cap1": "航空宇宙仕様に準拠した耐ギャリングコンパウンド適用",
  "services.weldingassemblyspectrum.card3.cap2": "組立空間公差のマルチ軸CMM検証",
  "services.weldingassemblyspectrum.card3.cap3": "完全なドキュメントパッケージ：トルクログ、アライメントレポート、NDT結果"
};

const specJa = {
  "services.assemblyspecsdashboard.badge": "組立仕様",
  "services.assemblyspecsdashboard.title_prefix": "溶接・組立 ",
  "services.assemblyspecsdashboard.subtitle": "溶接電流制御、アルゴンシールド、機械的組立適合、ねじ品質保証の精密境界。",
  "services.assemblyspecsdashboard.footnote": "すべての溶接はAWS D1.6 / ASME Section IXに準拠して実施。組立トルクはファスナーグレードおよび潤滑仕様に従って認定。",
  "services.assemblyspecsdashboard.metric0.label": "溶接電流調整精度",
  "services.assemblyspecsdashboard.metric0.desc": "±0.5 Aのデジタル境界追跡精度 — 薄ゲージシートから厚板まで、継手形状全体にわたって一貫した入熱と溶接プール制御を保証。",
  "services.assemblyspecsdashboard.metric1.label": "アルゴンパージシールドトレーリング幅",
  "services.assemblyspecsdashboard.metric1.desc": "最大150 mm幅の拡張物理トレーリングエンクロージャ経路 — 温度が250°Cを下回るまで、溶接プールと熱影響部全体に完全な不活性ガスカバレッジを提供。",
  "services.assemblyspecsdashboard.metric2.label": "機械的組立空間公差",
  "services.assemblyspecsdashboard.metric2.desc": "±0.05 mm以内の厳格な多方向空間準拠 — ボルト締結インターフェース、ダウエルピンアライメント、合わせ面の位置合わせをマルチ軸CMM検査で検証。",
  "services.assemblyspecsdashboard.metric3.label": "ねじ組立品質",
  "services.assemblyspecsdashboard.metric3.desc": "超音波耐ギャリング潤滑検証と精密動的トルク追跡による100%認定 — ねじの完全性、クランプ荷重精度、ギャリングのないファスナー取付を保証。"
};

const allNewKeys = [...Object.keys(spectrumEn), ...Object.keys(specEn)];

function updateEn() {
  const en = JSON.parse(fs.readFileSync(EN_JSON, 'utf-8'));
  for (const [k, v] of Object.entries({...spectrumEn, ...specEn})) { en[k] = v; }
  const sorted = {};
  for (const k of Object.keys(en).sort()) { sorted[k] = en[k]; }
  fs.writeFileSync(EN_JSON, JSON.stringify(sorted, null, 2), 'utf-8');
  console.log(`  en.json: Updated`);
}

function updateJa() {
  const jaPath = path.resolve(TRANSLATIONS_DIR, 'ja.json');
  const ja = JSON.parse(fs.readFileSync(jaPath, 'utf-8'));
  for (const [k, v] of Object.entries({...spectrumJa, ...specJa})) { ja[k] = v; }
  const sorted = {};
  for (const k of Object.keys(ja).sort()) { sorted[k] = ja[k]; }
  fs.writeFileSync(jaPath, JSON.stringify(sorted, null, 2), 'utf-8');
  console.log(`  ja.json: Updated`);
}

async function translateLang(lang) {
  const en = JSON.parse(fs.readFileSync(EN_JSON, 'utf-8'));
  const langFile = path.resolve(TRANSLATIONS_DIR, `${lang}.json`);
  const langData = JSON.parse(fs.readFileSync(langFile, 'utf-8'));

  const untranslated = allNewKeys.filter(k => !(k in langData) || langData[k] === en[k]);
  if (untranslated.length === 0) { console.log(`  ${lang}: none`); return; }

  const toTranslate = {};
  for (const k of untranslated) { toTranslate[k] = en[k]; }
  const entries = Object.entries(toTranslate);

  const BATCH_SIZE = 30;
  const batches = [];
  for (let i = 0; i < entries.length; i += BATCH_SIZE) batches.push(entries.slice(i, i + BATCH_SIZE));

  let translated = 0, errors = 0;
  for (let i = 0; i < batches.length; i++) {
    const jsonInput = JSON.stringify(Object.fromEntries(batches[i]), null, 2);
    const prompt = `Professional ${LANG_NAMES[lang]} translator for industrial titanium welding/manufacturing.
Translate English JSON to ${LANG_NAMES[lang]}.

RULES:
- Keep: GTAW, TIG, HAZ, CMM, NDT, AWS, ASME, CNC, mm, A
- Keep measurements: "±0.5 A", "150 mm", "±0.05 mm"
- Keep special chars: "—", "±", "&", "°", "ø"
- Translate VALUES only, keep KEYS as-is
- Use proper ${LANG_NAMES[lang]} welding industry terminology
- Return ONLY valid JSON

Batch ${i+1}/${batches.length}:
\`\`\`json
${jsonInput}
\`\`\``;

    try {
      const resp = await fetch(DEEPSEEK_API_URL, {
        method: 'POST',
        headers: {'Content-Type':'application/json','Authorization':`Bearer ${DEEPSEEK_API_KEY}`},
        body: JSON.stringify({
          model: 'deepseek-chat',
          messages: [
            {role:'system',content:`Professional ${LANG_NAMES[lang]} translator. Return ONLY valid JSON.`},
            {role:'user',content:prompt}
          ],
          temperature:0.1, max_tokens:16000
        })
      });
      if (!resp.ok) throw new Error(`API ${resp.status}`);
      const data = await resp.json();
      const content = data.choices[0].message.content.trim();
      const match = content.match(/```(?:json)?\s*([\s\S]*?)\s*```/) || content.match(/{[\s\S]*}/);
      const result = JSON.parse(match ? match[1]||match[0] : content);
      for (const [k,v] of Object.entries(result)) { if (v && typeof v === 'string') { langData[k] = v; translated++; } }
    } catch (err) { console.error(`  ✗ Batch ${i+1} failed: ${err.message}`); errors++; }
    if (i < batches.length-1) await new Promise(r => setTimeout(r, 500));
  }

  const sorted = {};
  for (const k of Object.keys(langData).sort()) { sorted[k] = langData[k]; }
  fs.writeFileSync(langFile, JSON.stringify(sorted, null, 2), 'utf-8');
  console.log(`  ${lang}: +${translated}, errors: ${errors}`);
}

async function main() {
  console.log('Step 1: en.json'); updateEn();
  console.log('Step 2: ja.json'); updateJa();
  console.log('Step 3: Translate 8 langs');
  for (const l of TARGET_LANGS) { await translateLang(l); }
  console.log('\nDONE!');
}

main().catch(err => { console.error('Fatal:', err); process.exit(1); });