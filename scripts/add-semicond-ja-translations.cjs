const fs = require('fs'), path = require('path');
const jaPath = path.join(__dirname, '..', 'src', 'i18n', 'translations', 'ja.json');
const enPath = path.join(__dirname, '..', 'src', 'i18n', 'translations', 'en.json');

const ja = JSON.parse(fs.readFileSync(jaPath, 'utf8'));
const en = JSON.parse(fs.readFileSync(enPath, 'utf8'));

// Only add keys that exist in en.json but not yet in ja.json
const enSemiKeys = Object.keys(en).filter(k => k.startsWith('industries.semi.')).sort();
const missing = enSemiKeys.filter(k => !(k in ja));

console.log('Missing keys to add: ' + missing.length);

// Japanese translations for all missing keys
const jaTranslations = {
  "industries.semi.hero.h1": "半導体装置向けチタンCNC加工 | 超精密エンジニアリング",
  "industries.semi.hero.subtitle": "ウェハ処理真空チャンバー、微細穴ガスシャワーヘッド、UHVプロセスコンポーネント向けグレード2およびグレード5チタンのサブミクロン精密CNC加工。パーティクルゼロのクラス100クリーンルーム環境。",
  "industries.semi.hero.badge": "半導体装置",
  "industries.semi.hero.metric1.value": "±1.9μm",
  "industries.semi.hero.metric1.label": "CMM精度",
  "industries.semi.hero.metric2.value": "Ra ≤ 0.1μm",
  "industries.semi.hero.metric2.label": "鏡面仕上げ",
  "industries.semi.hero.metric3.value": "10⁻⁹ Torr",
  "industries.semi.hero.metric3.label": "UHV対応",
  "industries.semi.hero.chip0": "5軸CNC",
  "industries.semi.hero.chip1": "グレード2/5 Ti",
  "industries.semi.hero.chip2": "UHV対応",
  "industries.semi.hero.chip3": "クラス100",
  "industries.semi.hero.chip4": "パーティクルゼロ",

  "industries.semi.uhv.title.suffix": "— ウェハ処理真空チャンバーとUHVリソグラフィサブアセンブリ",
  "industries.semi.uhv.desc": "半導体真空チャンバーおよびEUV/DUVリソグラフィサブアセンブリ向けのグレード2およびグレード5チタンの超精密5軸フライス加工。チタンの本質的に低い蒸気圧と放出ガス率は、サブミクロンGD&T制御と組み合わさり、10⁻⁹ Torrの超高真空環境に対応するシール面を実現します。",
  "industries.semi.uhv.entityLabel": "エンティティクラスター",
  "industries.semi.uhv.entity.0": "5軸超精密CNCフライス加工",
  "industries.semi.uhv.entity.1": "UHV真空チャンバー",
  "industries.semi.uhv.entity.2": "EUV/DUVリソグラフィ",
  "industries.semi.uhv.entity.3": "グレード2チタン",
  "industries.semi.uhv.entity.4": "放出ガス抑制",
  "industries.semi.uhv.card1.title": "UHV真空チャンバーフライス加工",
  "industries.semi.uhv.card1.subtitle": "5軸CNC · グレード2/5 Ti · UHV 10⁻⁹ Torr",
  "industries.semi.uhv.card1.desc": "半導体真空チャンバーとEUV/DUVリソグラフィサブアセンブリには、サブミクロンの平面度とRa ≤ 0.4μmの仕上げを持つシール面が必要です。当社の5軸超精密フライスセンターは、10⁻⁹ Torrの真空レベルでのガス漏れ経路やパーティクル発生を防ぐGD&T公差でグレード2およびグレード5チタンを加工します。",
  "industries.semi.uhv.card1.implLabel": "技術実装",
  "industries.semi.uhv.card1.item1": "シール面平面度 ≤ 1 μm/300mm — UHV 10⁻⁹ Torrでのガス漏れ防止",
  "industries.semi.uhv.card1.item2": "Ra ≤ 0.4 μmのシール仕上げ — プロセスガスを閉じ込めるマイクロギャップを排除",
  "industries.semi.uhv.card1.item3": "サブミクロンGD&Tプロファイル制御 — ヘリウム漏れ率 < 1×10⁻⁹ atm·cc/sec",
  "industries.semi.uhv.card2.title": "放出ガス抑制",
  "industries.semi.uhv.card2.subtitle": "電解研磨 · 真空ベークアウト · 低蒸気圧",
  "industries.semi.uhv.card2.desc": "チタンの自然酸化皮膜と本質的に低い蒸気圧は、UHV環境に理想的です。当社の電解研磨および真空ベークアウトプロセスにより放出ガス率がさらに低減され、重要なCVD/ALD薄膜堆積プロセスにおけるチャンバー完全性が保証されます。",
  "industries.semi.uhv.card2.implLabel": "技術実装",
  "industries.semi.uhv.card2.item1": "電解研磨による表面汚染除去 — 放出ガス率 < 1×10⁻¹² Torr·L/sec·cm²",
  "industries.semi.uhv.card2.item2": "250°Cでの真空ベークアウト — 最終組立前に水蒸気と炭化水素を脱着",
  "industries.semi.uhv.card2.item3": "自然TiO₂層が高温プロセスでの水素透過を防止",

  "industries.semi.microdrill.badge": "マイクロガス供給",
  "industries.semi.microdrill.title.suffix": "— ガス分配シャワーヘッド、ガスボックスコンポーネント、鏡面仕上げ Ra ≤ 0.1 μm",
  "industries.semi.microdrill.desc": "半導体ガス分配シャワーヘッド、ガスボックスマニホールド、プロセスキットコンポーネント向けグレード5チタンの高アスペクト比CNCマイクロドリル加工。鏡面仕上げ（Ra ≤ 0.1 μm）と精密マイクロホールアレイの組み合わせにより、CVD、ALD、エッチングチャンバープロセスのガス流均一性を最適化します。",
  "industries.semi.microdrill.entityLabel": "エンティティクラスター",
  "industries.semi.microdrill.entity.0": "CNCマイクロドリル加工",
  "industries.semi.microdrill.entity.1": "ガス分配シャワーヘッド",
  "industries.semi.microdrill.entity.2": "鏡面仕上げ Ra ≤ 0.1 μm",
  "industries.semi.microdrill.entity.3": "電解研磨",
  "industries.semi.microdrill.entity.4": "CVD/ALD",
  "industries.semi.microdrill.card1.title": "マイクロホールガスシャワーヘッド穴加工",
  "industries.semi.microdrill.card1.subtitle": "CNCマイクロドリル · Ø0.2mm–1.5mm · 20:1 アスペクト比",
  "industries.semi.microdrill.card1.desc": "ガス分配シャワーヘッドの精密マイクロホールアレイは、300mmウェハ全体のプリカーサー均一性を制御します。当社のCNCマイクロドリルセンターは、直径0.2mmから1.5mm、深さ対直径アスペクト比最大20:1の穴を、±5 μmの位置精度で生産します。",
  "industries.semi.microdrill.card1.implLabel": "技術実装",
  "industries.semi.microdrill.card1.item1": "穴径 Ø0.2mm–1.5mm、シャワーヘッド全体で±5 μmの位置精度",
  "industries.semi.microdrill.card1.item2": "20:1の深さ対直径アスペクト比 — 300mmウェハ処理の均一なガス分配を実現",
  "industries.semi.microdrill.card1.item3": "バリのない穴出口、Ra ≤ 0.4 μmの内部仕上げ — ガス流中のパーティクル発生を防止",
  "industries.semi.microdrill.card2.title": "鏡面仕上げ電解研磨",
  "industries.semi.microdrill.card2.subtitle": "電解研磨 · Ra ≤ 0.1 μm · 自然TiO₂不動態化",
  "industries.semi.microdrill.card2.desc": "チタンガス分配コンポーネントの電解研磨により、動作時にパーティクルを放出する可能性のある表面汚染物質が除去されます。結果として得られる鏡面仕上げ（Ra ≤ 0.1 μm）は、プリカーサーの吸着を抑え、チャンバーメモリー効果を最小限に抑える化学的に清浄な表面を創り出します。",
  "industries.semi.microdrill.card2.implLabel": "技術実装",
  "industries.semi.microdrill.card2.item1": "電解研磨で10-20 μmの変形層を除去 — 埋め込まれたマイクロバリと汚染物質を排除",
  "industries.semi.microdrill.card2.item2": "鏡面仕上げ Ra ≤ 0.1 μm — プリカーサー吸着とチャンバーメモリー効果を防止",
  "industries.semi.microdrill.card2.item3": "化学的不動態化で自然TiO₂層を回復 — プロセスガスに対する耐食性を最大化",

  "industries.semi.cleanroom.badge": "汚染管理",
  "industries.semi.cleanroom.title.suffix": "— 2nm/3nmウェハファブ向け多段階洗浄とゼロパーティクル梱包",
  "industries.semi.cleanroom.desc": "すべての半導体コンポーネントは、多段階精密洗浄ラインを経て、当社のクラス100（ISO 5）クリーンルームで梱包されます。超音波脱脂からDI水リンス、HEPAフィルター乾燥に至るまで、各段階が検証され、ウェハ製造装置へのゼロパーティクル統合が保証されます。",
  "industries.semi.cleanroom.entityLabel": "エンティティクラスター",
  "industries.semi.cleanroom.entity.0": "クラス100クリーンルーム",
  "industries.semi.cleanroom.entity.1": "超音波洗浄",
  "industries.semi.cleanroom.entity.2": "DI水リンス",
  "industries.semi.cleanroom.entity.3": "ゼロパーティクル梱包",
  "industries.semi.cleanroom.entity.4": "ISO 5",
  "industries.semi.cleanroom.card1.title": "クラス100（ISO 5）クリーンルーム処理",
  "industries.semi.cleanroom.card1.subtitle": "クラス100 · ISO 5 · ゼロパーティクル認定",
  "industries.semi.cleanroom.card1.desc": "当社のクラス100（ISO 5）クリーンルーム環境は、半導体コンポーネントが管理された雰囲気で組み立て、検査、梱包されることを保証します。HEPAフィルター処理された気流、陽圧、厳格なガウニングプロトコルにより、0.5 μm以上のパーティクル数を1立方フィートあたり100個未満に抑えます。",
  "industries.semi.cleanroom.card1.implLabel": "技術実装",
  "industries.semi.cleanroom.card1.item1": "HEPAフィルター垂直層流 — 1ft³あたり≤ 100個（≥0.5 μm）のパーティクル",
  "industries.semi.cleanroom.card1.item2": "陽圧差 — 未フィルター空気の侵入を防止",
  "industries.semi.cleanroom.card1.item3": "帯電防止靴を備えた全身クリーンルームガウニング — 人体由来のパーティクル汚染ゼロ",
  "industries.semi.cleanroom.card2.title": "多段階精密洗浄",
  "industries.semi.cleanroom.card2.subtitle": "超音波洗浄 · DIリンス · 検証",
  "industries.semi.cleanroom.card2.desc": "各コンポーネントは、検証済みの多段階洗浄プロセスを経ます。加工油を除去する超音波溶剤脱脂、アルカリ水性洗浄、18 MΩ·cm抵抗率までのDI水リンス、HEPAフィルター熱風乾燥。洗浄後検証により、有機汚染が10 μg/cm²未満であることを確認します。",
  "industries.semi.cleanroom.card2.implLabel": "技術実装",
  "industries.semi.cleanroom.card2.item1": "半導体グレード溶剤による超音波脱脂 — すべての加工残留物を除去",
  "industries.semi.cleanroom.card2.item2": "18 MΩ·cm抵抗率までのDI水リンス — コンポーネント表面のイオン汚染ゼロ",
  "industries.semi.cleanroom.card2.item3": "洗浄後有機物検証 — 残留汚染 < 10 μg/cm²",

  "industries.semi.compliance.badge": "材料認証",
  "industries.semi.compliance.title.suffix": "— EN 10204 3.1 MTRと過酷なプラズマ化学反応向け冶金純度",
  "industries.semi.compliance.desc": "すべての半導体グレードチタンコンポーネントは、完全な材料トレーサビリティ文書によって裏付けられています。当社のEN 10204 3.1ミルテストレポートは化学組成と機械的特性を証明し、文書化された冶金均一性は過酷なフッ素系および塩素系プラズマ化学反応に適した結晶粒構造を確認します。",
  "industries.semi.compliance.entityLabel": "エンティティクラスター",
  "industries.semi.compliance.entity.0": "EN 10204 3.1 MTR",
  "industries.semi.compliance.entity.1": "冶金均一性",
  "industries.semi.compliance.entity.2": "SEM/EDX",
  "industries.semi.compliance.entity.3": "結晶粒構造",
  "industries.semi.compliance.entity.4": "ASME Y14.5 GD&T",
  "industries.semi.compliance.pillar1.title": "完全な材料トレーサビリティ",
  "industries.semi.compliance.pillar1.desc": "各グレード2、グレード5、グレード12のチタンロットは、完全な化学組成と機械的特性検証を含むEN 10204タイプ3.1文書で認証されています。",
  "industries.semi.compliance.pillar1.item1": "ASTM B265/B348に準拠した化学組成 — 各ヒートの完全な元素分析",
  "industries.semi.compliance.pillar1.item2": "認定された機械的特性 — 引張強さ、降伏強さ、伸び、硬さ",
  "industries.semi.compliance.pillar1.item3": "ヒート番号をマーキングしデジタルアーカイブ — 規制監査のための10年以上のトレーサビリティ",
  "industries.semi.compliance.pillar2.title": "プラズマ環境向け冶金完全性",
  "industries.semi.compliance.pillar2.desc": "過酷な半導体プラズマ化学反応には、一貫した結晶粒構造と介在物の不在が必要です。当社の文書化された冶金検証により、チタンコンポーネントがフッ素系および塩素系プラズマに耐え、優先エッチングやパーティクル発生を起こさないことが保証されます。",
  "industries.semi.compliance.pillar2.item1": "微細等軸結晶粒構造確認済み — プラズマ中の優先粒界エッチングを防止",
  "industries.semi.compliance.pillar2.item2": "ASTM E45に準拠した非金属介在物評価 — プラズマアーキングを誘発する介在物ゼロ",
  "industries.semi.compliance.pillar2.item3": "全シール面のSEM/EDX検証 — 埋め込まれた異物がないことを確認",

  "industries.semi.cta.badge5": "UHV対応",
  "industries.semi.cta.badge6": "マイクロ穴加工 Ø0.2mm",
  "industries.semi.cta.badge7": "Ra ≤ 0.1 μm 鏡面",
  "industries.semi.cta.badge8": "クラス100クリーンルーム",

  "industries.semi.page.description": "ウェハ真空チャンバー、微細穴ガスシャワーヘッド、UHVプロセスコンポーネント向けカスタムサブミクロンCNC加工。パーティクルゼロのクリーンルーム。",
  "industries.semi.page.productCategory": "半導体装置コンポーネント",
  "industries.semi.page.productName": "ウェハ処理真空チャンバー、ガス分配シャワーヘッド、UHVコンポーネント",
  "industries.semi.page.serviceCategory": "半導体",
  "industries.semi.page.serviceName": "半導体装置チタンCNC加工サービス",
  "industries.semi.page.title": "半導体装置チタンCNC加工 | 超精密",
  "industries.semi.semictasection.badge": "半導体プロジェクトを開始",
  "industries.semi.semictasection.title.main": "半導体チタンCNC加工？",
};

// Only add keys that exist in en.json but NOT in ja.json
let added = 0;
for (const [k, v] of Object.entries(jaTranslations)) {
  if (k in en && !(k in ja)) {
    ja[k] = v;
    added++;
  }
}

const sorted = {};
Object.keys(ja).sort().forEach(k => { sorted[k] = ja[k]; });
fs.writeFileSync(jaPath, JSON.stringify(sorted, null, 2) + '\n', 'utf8');
const jaSemi = Object.keys(sorted).filter(k => k.startsWith('industries.semi.')).length;
console.log(`Added: ${added} keys, Total semi in ja.json: ${jaSemi}`);
