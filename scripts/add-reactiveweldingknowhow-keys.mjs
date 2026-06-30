/**
 * Add reactiveweldingknowhow keys to en.json and provide Japanese translation template.
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const TRANSLATIONS_DIR = path.resolve(__dirname, '../src/i18n/translations');

// New keys to add to en.json (with full English values from the component)
const newEnglishKeys = {
  "services.reactiveweldingknowhow.badge": "Welding Know-How",
  "services.reactiveweldingknowhow.title_prefix": "Mastering Titanium's ",
  "services.reactiveweldingknowhow.subtitle": "Titanium's reactive metallurgy demands uncompromising shielding and thermal management. Here's how we eliminate weld discoloration, embrittlement, and distortion.",
  "services.reactiveweldingknowhow.card1.title": "Weld Discoloration & Embrittlement Control",
  "services.reactiveweldingknowhow.card1.problem": "Titanium's extreme oxygen affinity at welding temperatures (above 600°C) causes rapid surface oxidation — producing a brittle alpha-case layer that manifests as blue/gray weld discoloration. Oxygen contamination as low as 200 ppm can reduce ductility by 50%, causing embrittled welds that crack under thermal or mechanical load.",
  "services.reactiveweldingknowhow.card1.solution": "Custom Trailing Chambers & Full Argon Isolation Until <250°C",
  "services.reactiveweldingknowhow.card1.detail0": "Custom-fabricated trailing shielding chambers extend the inert gas coverage zone 200-300 mm behind the weld torch — isolating the solidifying melt pool and heat-affected zone until temperatures drop below 250°C, the threshold for rapid titanium oxidation",
  "services.reactiveweldingknowhow.card1.detail1": "Dual-flow argon delivery: primary flow (15-20 LPM) through the torch nozzle, secondary flow (20-30 LPM) through the trailing chamber — creating a positive-pressure argon curtain that prevents atmospheric oxygen ingress across the full weld zone",
  "services.reactiveweldingknowhow.card1.detail2": "Color-index quality verification per AWS D1.6: welds are visually inspected against the titanium weld color standard — silver (acceptable), straw (acceptable), blue/gray (reject) — with any discolored weldment ground out and re-welded before proceeding",
  "services.reactiveweldingknowhow.card1.detail3": "Interpass temperature monitoring via contact thermocouple — if HAZ exceeds 250°C between passes, welding is halted until forced argon cooling restores the interpass temperature below limit, preventing cumulative oxide build-up in multi-pass weld joints",
  "services.reactiveweldingknowhow.card2.title": "Thermal Distortion Deflection",
  "services.reactiveweldingknowhow.card2.problem": "Titanium's high coefficient of thermal expansion (8.6 µm/m·K) combined with its low elastic modulus (114 GPa) makes it acutely susceptible to welding-induced distortion. Uncontrolled heat input causes angular distortion, longitudinal bowing, and buckling in thin-gauge sheet metal assemblies — leading to misaligned bolt patterns, leaking flange faces, and structural fit-up failures.",
  "services.reactiveweldingknowhow.card2.solution": "High-Rigidity Fixturing Matrices, Segmented Back-Step Welding & Post-Weld Stress Relief",
  "services.reactiveweldingknowhow.card2.detail0": "High-rigidity fixturing matrices with toggle clamps on 100 mm centers — constraining all degrees of freedom during welding and preventing angular deflection that would otherwise occur as the weld pool solidifies and contracts",
  "services.reactiveweldingknowhow.card2.detail1": "Segmented back-step weld path strategy: each weld pass is divided into 50-75 mm segments deposited in a reverse-progression sequence — distributing heat input evenly across the joint and reducing peak thermal gradients by up to 60% compared to continuous forward welding",
  "services.reactiveweldingknowhow.card2.detail2": "Pre-set over-bend compensation angles (1-3° depending on plate thickness and joint design) built into the fixturing — accommodating the predictable angular shrinkage that occurs as the weld metal cools and contracts",
  "services.reactiveweldingknowhow.card2.detail3": "Post-weld stress-relief annealing at 540-650°C in a vacuum or argon-purged furnace — eliminating residual welding stresses that would otherwise cause delayed distortion during machining, transport, or in-service thermal cycling",
};

// Japanese translations for the new keys (JA is priority language)
const japaneseTranslations = {
  "services.reactiveweldingknowhow.badge": "溶接ノウハウ",
  "services.reactiveweldingknowhow.title_prefix": "チタンの",
  "services.reactiveweldingknowhow.subtitle": "チタンの反応性冶金には、妥協のないシールドと熱管理が要求されます。ここでは、溶接部の変色、脆化、および歪みを排除する方法をご紹介します。",
  "services.reactiveweldingknowhow.card1.title": "溶接変色と脆化の制御",
  "services.reactiveweldingknowhow.card1.problem": "溶接温度（600°C以上）におけるチタンの極度の酸素親和性により、急速な表面酸化が発生し、青/灰色の溶接変色として現れる脆性アルファケース層が生成されます。わずか200 ppmの酸素汚染でも延性が50%低下し、熱的または機械的負荷で亀裂が発生する脆化溶接部を引き起こします。",
  "services.reactiveweldingknowhow.card1.solution": "カスタムトレーリングチャンバーと250°C未満までの完全アルゴン遮断",
  "services.reactiveweldingknowhow.card1.detail0": "カスタム製造されたトレーリングシールドチャンバーは、溶接トーチの後方200〜300 mmまで不活性ガスカバレッジゾーンを延長し、凝固中の溶融池と熱影響部を温度が250°C（チタンの急速酸化の閾値）を下回るまで隔離します。",
  "services.reactiveweldingknowhow.card1.detail1": "二重フローアルゴン供給：トーチノズルからの一次流（15〜20 LPM）、トレーリングチャンバーからの二次流（20〜30 LPM）により、溶接ゾーン全体に大気中の酸素の侵入を防ぐ正圧アルゴンカーテンを生成します。",
  "services.reactiveweldingknowhow.card1.detail2": "AWS D1.6に準拠したカラーインデックス品質検査：溶接部はチタン溶接色標準に照らして目視検査され、シルバー（合格）、ストロー（合格）、青/グレー（不合格）と判定され、変色した溶接部は研磨除去され、やり直しされます。",
  "services.reactiveweldingknowhow.card1.detail3": "接触熱電対によるパス間温度監視：パス間でHAZが250°Cを超えた場合、強制アルゴン冷却がパス間温度を制限値以下に回復するまで溶接を中断し、多パス溶接継手での累積酸化物生成を防止します。",
  "services.reactiveweldingknowhow.card2.title": "熱歪みの抑制",
  "services.reactiveweldingknowhow.card2.problem": "チタンの高い熱膨張係数（8.6 µm/m·K）と低い弾性率（114 GPa）の組み合わせにより、溶接誘起歪みに対して非常に敏感です。制御されていない入熱は、角度歪み、長手方向の反り、薄ゲージ板金組立品の座屈を引き起こし、ボルトパターンの位置ずれ、フランジ面の漏れ、構造的な組み立て不良につながります。",
  "services.reactiveweldingknowhow.card2.solution": "高剛性固定マトリックス、分割バックステップ溶接、溶接後応力除去",
  "services.reactiveweldingknowhow.card2.detail0": "100 mm間隔のトグルクランプを備えた高剛性固定マトリックスにより、溶接中のすべての自由度を拘束し、溶接プールの凝固・収縮に伴って発生する角度変形を防止します。",
  "services.reactiveweldingknowhow.card2.detail1": "セグメント化バックステップ溶接パス戦略：各溶接パスを50〜75 mmのセグメントに分割し、逆進行シーケンスで堆積することで、入熱を継手全体に均等に分散し、連続前進溶接と比較してピーク熱勾配を最大60%低減します。",
  "services.reactiveweldingknowhow.card2.detail2": "板厚と継手設計に応じて1〜3°のプリセットオーバーベンド補正角度を固定具に組み込むことで、溶接金属の冷却・収縮に伴って発生する予測可能な角度収縮に対応します。",
  "services.reactiveweldingknowhow.card2.detail3": "真空またはアルゴンパージ炉での540〜650°Cの溶接後応力除去焼鈍により、機械加工、輸送、または使用中の熱サイクル中に遅延歪みを引き起こす残留溶接応力を除去します。",
};

// Also include the 3 existing keys that were in ja but missing from the restored en
const existingMissingEnglish = {
  "services.reactiveweldingknowhow.challenge_15": "The Challenge",
  "services.reactiveweldingknowhow.reactive_welding_metallurgy": "Reactive Welding Metallurgy",
  "services.reactiveweldingknowhow.solution_15": "Our Solution",
};

function addKeys() {
  // 1. Update en.json
  const enPath = path.resolve(TRANSLATIONS_DIR, 'en.json');
  const en = JSON.parse(fs.readFileSync(enPath, 'utf-8'));
  
  // Add existing missing keys
  for (const [k, v] of Object.entries(existingMissingEnglish)) {
    en[k] = v;
  }
  // Add new keys
  for (const [k, v] of Object.entries(newEnglishKeys)) {
    en[k] = v;
  }
  
  // Sort and write
  const sortedEn = {};
  for (const k of Object.keys(en).sort()) {
    sortedEn[k] = en[k];
  }
  fs.writeFileSync(enPath, JSON.stringify(sortedEn, null, 2), 'utf-8');
  console.log(`Updated en.json: ${Object.keys(en).length} total keys`);

  // 2. Update ja.json
  const jaPath = path.resolve(TRANSLATIONS_DIR, 'ja.json');
  const ja = JSON.parse(fs.readFileSync(jaPath, 'utf-8'));
  
  // Add the 3 existing keys if missing from ja (they should already exist)
  for (const [k, v] of Object.entries(existingMissingEnglish)) {
    if (!(k in ja)) {
      ja[k] = v;
    }
  }
  // Add new Japanese translations
  for (const [k, v] of Object.entries(japaneseTranslations)) {
    ja[k] = v;
  }
  
  // Sort and write
  const sortedJa = {};
  for (const k of Object.keys(ja).sort()) {
    sortedJa[k] = ja[k];
  }
  fs.writeFileSync(jaPath, JSON.stringify(sortedJa, null, 2), 'utf-8');
  console.log(`Updated ja.json: ${Object.keys(ja).length} total keys`);
  console.log('Done! English + Japanese keys added.');
}

addKeys();