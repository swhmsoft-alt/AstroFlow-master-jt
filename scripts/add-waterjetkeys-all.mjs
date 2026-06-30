/**
 * Add ALL waterjet keys to en.json and ja.json, then translate 8 langs via DeepSeek.
 * Covers: WaterjetAdvantages.astro + WaterjetSpecsDashboard.astro
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

// ===== WaterjetAdvantages keys =====
const advEn = {
  "services.waterjetadvantages.badge": "Waterjet Advantages",
  "services.waterjetadvantages.subtitle": "Cold abrasive waterjet cutting offers unique advantages for titanium that thermal processes cannot match — zero heat, unlimited thickness, and maximum material yield.",
  "services.waterjetadvantages.card1.title": "Absolute Zero Heat-Affected Zone",
  "services.waterjetadvantages.card1.subtitle": "Pure Supersonic Abrasive Erosion at Ambient Temperature",
  "services.waterjetadvantages.card1.desc": "Pure physical supersonic abrasive erosion keeping workpiece temperatures below 100°C — 100% bypassing thermal warp, phase hardening, micro-cracks, or heat-induced metallurgical transformations that plague laser and plasma cutting of titanium.",
  "services.waterjetadvantages.card1.highlight0": "No HAZ, no recast layer, no alpha-case embrittlement — cut edges retain native material properties",
  "services.waterjetadvantages.card1.highlight1": "Zero thermal distortion — even on thin-gauge sheets down to 0.5 mm",
  "services.waterjetadvantages.card1.highlight2": "No phase transformations in heat-treated titanium alloys",
  "services.waterjetadvantages.card1.highlight3": "Ideal for thermally sensitive aerospace and medical components",
  "services.waterjetadvantages.card2.title": "Exceptional Heavy-Plate Capacity",
  "services.waterjetadvantages.card2.subtitle": "Slicing Titanium Forgings Up to 100 mm+",
  "services.waterjetadvantages.card2.desc": "Slicing through massive titanium forgings, billets, and heavy plates up to 120 mm thick — where commercial fiber lasers hit a physical roadblock at 12-20 mm and require multiple slow passes with gas-assist limitations.",
  "services.waterjetadvantages.card2.highlight0": "Clean cuts through titanium up to 120 mm thick in a single pass",
  "services.waterjetadvantages.card2.highlight1": "No thickness limitations from laser power or focal length constraints",
  "services.waterjetadvantages.card2.highlight2": "Cuts stacked plates simultaneously for doubled throughput",
  "services.waterjetadvantages.card2.highlight3": "Handles forged, cast, and heat-treated titanium without tooling changes",
  "services.waterjetadvantages.card3.title": "Material Yield Maximization",
  "services.waterjetadvantages.card3.subtitle": "Fine Jet ø 1.0 mm + Advanced Nesting Code",
  "services.waterjetadvantages.card3.desc": "Fine abrasive jet streams down to ø 1.0 mm kerf width combined with advanced nesting algorithms — compressing expensive titanium material waste to near-theoretical minimums and maximizing part yield per billet.",
  "services.waterjetadvantages.card3.highlight0": "Ultra-fine kerf ø 1.0 mm minimizes material loss between nested parts",
  "services.waterjetadvantages.card3.highlight1": "Advanced nesting code optimizes part layout for >90% material utilization",
  "services.waterjetadvantages.card3.highlight2": "Tight part-to-part spacing (2-3 mm) enabled by narrow jet stream",
  "services.waterjetadvantages.card3.highlight3": "Significant cost savings on high-value titanium plate stock"
};

// ===== WaterjetSpecsDashboard keys =====
const specEn = {
  "services.waterjetspecsdashboard.badge": "Machine Specifications",
  "services.waterjetspecsdashboard.title_prefix": "Waterjet ",
  "services.waterjetspecsdashboard.subtitle": "Intensifier pump power, work envelope, thickness capacity, and angular precision of our abrasive waterjet cutting infrastructure.",
  "services.waterjetspecsdashboard.footnote": "Specifications based on our Flow / Jet Edge waterjet cutting systems. Actual cut speed and surface finish depend on material grade, thickness, and abrasive mesh size.",
  "services.waterjetspecsdashboard.metric0.label": "Intensifier Pump Power",
  "services.waterjetspecsdashboard.metric0.desc": "Extreme-pressure intensifier pump operating at up to 60,000 PSI — delivering the hydraulic force needed to accelerate garnet abrasives to supersonic speeds for clean titanium cutting.",
  "services.waterjetspecsdashboard.metric1.label": "Max Bed Footprint",
  "services.waterjetspecsdashboard.metric1.desc": "Large-format processing bed accommodating heavy titanium plates, forgings, and structural members up to full 3 x 2 meter sheet sizes without repositioning.",
  "services.waterjetspecsdashboard.metric2.label": "Extreme Thickness Capacity",
  "services.waterjetspecsdashboard.metric2.desc": "Effortless penetration handling titanium stocks up to 120 mm deep in a single pass — where laser cutting stops at 12-20 mm and requires multiple passes with gas assist.",
  "services.waterjetspecsdashboard.metric3.label": "Angular Repeatability Bounds",
  "services.waterjetspecsdashboard.metric3.desc": "5-axis dynamic head compensation reducing jet stream taper to within ±0.05 mm — achieving near-perpendicular edge profiles on heavy plates without secondary squaring operations."
};

// ===== Japanese translations (priority) =====
const advJa = {
  "services.waterjetadvantages.badge": "ウォータージェットの利点",
  "services.waterjetadvantages.subtitle": "コールドアブレシブウォータージェット切断は、熱プロセスでは実現できない独自の利点をチタン加工に提供します — ゼロ熱、無制限の厚さ、最大限の材料歩留まり。",
  "services.waterjetadvantages.card1.title": "完全ゼロ熱影響部",
  "services.waterjetadvantages.card1.subtitle": "常温での純粋な超音速アブレシブ侵食",
  "services.waterjetadvantages.card1.desc": "加工物温度を100°C未満に保つ純粋な物理的超音速アブレシブ侵食 — チタンのレーザー切断やプラズマ切断に付きまとう熱反り、相硬化、マイクロクラック、熱誘起冶金変態を100%回避します。",
  "services.waterjetadvantages.card1.highlight0": "HAZ、再キャスト層、アルファケース脆化なし — 切断エッジは本来の材料特性を維持",
  "services.waterjetadvantages.card1.highlight1": "ゼロ熱歪み — 0.5 mmまでの薄ゲージシートでも問題なし",
  "services.waterjetadvantages.card1.highlight2": "熱処理済みチタン合金での相変態なし",
  "services.waterjetadvantages.card1.highlight3": "熱に敏感な航空宇宙・医療部品に最適",
  "services.waterjetadvantages.card2.title": "卓越した厚板加工能力",
  "services.waterjetadvantages.card2.subtitle": "100 mm以上のチタン鍛造品を切断",
  "services.waterjetadvantages.card2.desc": "最大120 mm厚の大型チタン鍛造品、ビレット、厚板を切断 — 市販のファイバーレーザーが12〜20 mmで物理的限界に達し、ガスアシストの制約で複数回の低速パスを必要とする領域を克服。",
  "services.waterjetadvantages.card2.highlight0": "1パスで最大120 mm厚のチタンをクリーンカット",
  "services.waterjetadvantages.card2.highlight1": "レーザー出力や焦点距離の制約による厚さ制限なし",
  "services.waterjetadvantages.card2.highlight2": "積層板を同時切断してスループットを2倍に",
  "services.waterjetadvantages.card2.highlight3": "工具交換なしで鍛造品、鋳造品、熱処理済みチタンを処理",
  "services.waterjetadvantages.card3.title": "材料歩留まりの最大化",
  "services.waterjetadvantages.card3.subtitle": "微細ジェットø 1.0 mm + 高度なネスティングコード",
  "services.waterjetadvantages.card3.desc": "ø 1.0 mmカーフ幅までの微細アブレシブジェット流と高度なネスティングアルゴリズムの組み合わせ — 高価なチタン材料の無駄を理論的最小値近くまで圧縮し、ビレットあたりの部品歩留まりを最大化。",
  "services.waterjetadvantages.card3.highlight0": "超微細カーフø 1.0 mmがネスティング部品間の材料損失を最小化",
  "services.waterjetadvantages.card3.highlight1": "高度なネスティングコードが部品レイアウトを最適化し、>90%の材料利用率を実現",
  "services.waterjetadvantages.card3.highlight2": "狭いジェット流によるタイトな部品間隔（2〜3 mm）",
  "services.waterjetadvantages.card3.highlight3": "高価値チタン板素材の大幅なコスト削減"
};

const specJa = {
  "services.waterjetspecsdashboard.badge": "マシン仕様",
  "services.waterjetspecsdashboard.title_prefix": "ウォータージェット ",
  "services.waterjetspecsdashboard.subtitle": "アブレシブウォータージェット切断インフラの増圧ポンプ出力、加工範囲、厚さ能力、および角度精度。",
  "services.waterjetspecsdashboard.footnote": "仕様は当社のFlow / Jet Edgeウォータージェット切断システムに基づきます。実際の切断速度と表面仕上げは、材料グレード、板厚、および研磨材メッシュサイズに依存します。",
  "services.waterjetspecsdashboard.metric0.label": "増圧ポンプ出力",
  "services.waterjetspecsdashboard.metric0.desc": "最大60,000 PSIで作動する超高圧増圧ポンプ — ガーネット研磨材を超音速に加速し、クリーンなチタン切断に必要な油圧力を供給。",
  "services.waterjetspecsdashboard.metric1.label": "最大ベッド寸法",
  "services.waterjetspecsdashboard.metric1.desc": "大型チタン板、鍛造品、構造部材を3×2メートルのフルシートサイズまで位置決め直し不要で収容する大型加工ベッド。",
  "services.waterjetspecsdashboard.metric2.label": "最大厚さ能力",
  "services.waterjetspecsdashboard.metric2.desc": "1パスで最大120 mm深さまでのチタン素材を容易に貫通 — レーザー切断が12〜20 mmで停止し、ガスアシストで複数パスを要する領域を克服。",
  "services.waterjetspecsdashboard.metric3.label": "角度再現性精度",
  "services.waterjetspecsdashboard.metric3.desc": "5軸ダイナミックヘッド補正によりジェットストリームテーパーを±0.05 mm以内に低減 — 厚板でも二次的な面取り加工なしでほぼ垂直なエッジプロファイルを実現。"
};

// All keys to track
const allAdvKeys = Object.keys(advEn);
const allSpecKeys = Object.keys(specEn);
const allWaterjetKeys = [...allAdvKeys, ...allSpecKeys];

function updateEn() {
  const en = JSON.parse(fs.readFileSync(EN_JSON, 'utf-8'));
  for (const [k, v] of Object.entries({...advEn, ...specEn})) { en[k] = v; }
  const sorted = {};
  for (const k of Object.keys(en).sort()) { sorted[k] = en[k]; }
  fs.writeFileSync(EN_JSON, JSON.stringify(sorted, null, 2), 'utf-8');
  const c = Object.keys(sorted).filter(k => k.includes('waterjetadvantage') || k.includes('waterjetspecsdashboard'));
  console.log(`  en.json: Updated, ${c.length} waterjet keys`);
}

function updateJa() {
  const jaPath = path.resolve(TRANSLATIONS_DIR, 'ja.json');
  const ja = JSON.parse(fs.readFileSync(jaPath, 'utf-8'));
  for (const [k, v] of Object.entries({...advJa, ...specJa})) { ja[k] = v; }
  const sorted = {};
  for (const k of Object.keys(ja).sort()) { sorted[k] = ja[k]; }
  fs.writeFileSync(jaPath, JSON.stringify(sorted, null, 2), 'utf-8');
  console.log(`  ja.json: Updated`);
}

async function translateLang(lang) {
  const en = JSON.parse(fs.readFileSync(EN_JSON, 'utf-8'));
  const langFile = path.resolve(TRANSLATIONS_DIR, `${lang}.json`);
  const langData = JSON.parse(fs.readFileSync(langFile, 'utf-8'));
  
  const untranslated = allWaterjetKeys.filter(k => !(k in langData) || langData[k] === en[k]);
  
  if (untranslated.length === 0) { console.log(`  ${lang}: none to translate`); return; }
  
  const toTranslate = {};
  for (const k of untranslated) { toTranslate[k] = en[k]; }
  const entries = Object.entries(toTranslate);
  
  const BATCH_SIZE = 30;
  const batches = [];
  for (let i = 0; i < entries.length; i += BATCH_SIZE) batches.push(entries.slice(i, i + BATCH_SIZE));
  
  let translated = 0, errors = 0;
  
  for (let i = 0; i < batches.length; i++) {
    const jsonInput = JSON.stringify(Object.fromEntries(batches[i]), null, 2);
    const prompt = `You are a professional ${LANG_NAMES[lang]} translator for an industrial titanium fabrication website.
Translate the following English key-value pairs to natural, professional ${LANG_NAMES[lang]}.

RULES:
- Keep technical terms: HAZ, PSI, kW, CNC, mm
- Keep units unchanged: "60,000 PSI", "ø 1.0 mm", "3,000 x 2,000 mm", "±0.05 mm", "120 mm", ">90%"
- Keep special characters: "—", "ø", "±", ">", "<", "°", "&"
- Translate VALUES only, keep KEYS exactly as-is
- Use proper ${LANG_NAMES[lang]} industry terminology
- Return ONLY valid JSON

Batch ${i + 1}/${batches.length}:

\`\`\`json
${jsonInput}
\`\`\``;
    
    try {
      const response = await fetch(DEEPSEEK_API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${DEEPSEEK_API_KEY}` },
        body: JSON.stringify({
          model: 'deepseek-chat',
          messages: [
            { role: 'system', content: `Professional ${LANG_NAMES[lang]} translator. Return ONLY valid JSON.` },
            { role: 'user', content: prompt }
          ],
          temperature: 0.1,
          max_tokens: 16000,
        }),
      });
      if (!response.ok) throw new Error(`API ${response.status}: ${await response.text()}`);
      const data = await response.json();
      const content = data.choices[0].message.content.trim();
      const jsonMatch = content.match(/```(?:json)?\s*([\s\S]*?)\s*```/) || content.match(/{[\s\S]*}/);
      const result = JSON.parse(jsonMatch ? jsonMatch[1] || jsonMatch[0] : content);
      for (const [k, v] of Object.entries(result)) { if (v && typeof v === 'string') { langData[k] = v; translated++; } }
    } catch (err) { console.error(`    ✗ Batch ${i+1} failed: ${err.message}`); errors++; }
    if (i < batches.length - 1) await new Promise(r => setTimeout(r, 500));
  }
  
  const sorted = {};
  for (const k of Object.keys(langData).sort()) { sorted[k] = langData[k]; }
  fs.writeFileSync(langFile, JSON.stringify(sorted, null, 2), 'utf-8');
  console.log(`  ${lang}: +${translated}, errors: ${errors}`);
}

async function main() {
  console.log('Step 1: Update en.json'); updateEn();
  console.log('Step 2: Update ja.json'); updateJa();
  console.log('Step 3: Translate 8 langs');
  for (const lang of TARGET_LANGS) { await translateLang(lang); }
  console.log('\nALL DONE!');
}

main().catch(err => { console.error('Fatal:', err); process.exit(1); });