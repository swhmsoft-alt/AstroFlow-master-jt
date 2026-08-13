/**
 * audience-tag.mjs
 * ================================================================
 * 受众优先 SEO（Audience-First SEO）落地 — 给关键词主库加「受众维度」。
 *
 * 方法论：
 *   B2B 受众 = 行业（应用场景） × 人群（角色） × 旅程阶段（awareness/consideration/decision）。
 *   先锁定高价值目标人群，再反向组织关键词 → 正是《Audience-First SEO: A Smarter Way
 *   to Rank Higher in 2026》的四步法落地。
 *
 * 本脚本做两件事（均为纯新增、幂等）：
 *   1) 为「高价值核心 EN mapped 关键词」子集（行业/服务/工艺/产品页相关词）
 *      自动打上 persona + journeyStage 标签。不修改任何既有字段。
 *   2) 追加一批 status:'planned' 的「行业×人群×旅程」长尾问答词（People Also Ask 风格），
 *      作为受众优先选词的储备词库 —— 不进入 entity-keywords 构建、不影响任何页面。
 *
 * 边界约束：
 *   - 不做全量自动标注全部 mapped 关键词，仅限定 CORE_KEYWORDS 子集。
 *   - 绝不修改/删除原有字段：keyword / lang / intent / entity / status / targetUrl /
 *     anchorText / source / volume / difficulty 全部保持原样；persona / journeyStage 为纯新增。
 *   - status:'planned' 词条由 repository.exportAllLangs() 的 `status === 'mapped'` 过滤，
 *     不会参与 astro.config.mjs 内链生成。
 *   - 唯一数据变更：data/keywords/main-db.json（新增字段 + 新增词条）。
 *
 * 幂等性：repository.upsertMany 以 {lang, keyword} 判重合并，重复运行不会重复新增/重复打标签。
 *
 * 用法：
 *   node scripts/audience-tag.mjs
 * ================================================================
 */
import { getAll, upsertMany } from '../src/lib/keywords/repository.mjs';

/**
 * 高价值核心关键词子集（有节制示范 —— 行业/服务/工艺/产品页关联词）。
 * 精确匹配 EN mapped 关键词。超出此集合的 mapped 关键词本次不打标签。
 */
const CORE_KEYWORDS = new Set([
  // ── 行业/服务枢纽（owner / procurement）──
  'Comprehensive Titanium Manufacturing',
  'Comprehensive Titanium Manufacturing & Processing Services',
  'Titanium CNC Machining Services',
  'Titanium Fabrication Services',
  'aerospace titanium',
  'medical implants',
  // ── 质量/合规（quality）──
  'AS9100',
  'AS9100D',
  'ISO 13485',
  'ISO 9001',
  'ITAR',
  'NADCAP',
  'ASTM B348',
  '3D CMM inspection',
  'CMM',
  'dimensional inspection',
  // ── 设计工程师（design）──
  '3/5-Axis CNC Machining',
  'CNC Milling & Turning',
  'Custom Industrial Components',
  'Grade 5 Titanium',
  'Grade 23 Titanium',
  'Ti-6Al-4V',
  'Ti-6Al-4V ELI',
  // ── 制造/工艺工程师（manufacturing）──
  'Wire EDM Machining',
  'Laser Cutting',
  'Waterjet Cutting',
  'Titanium Welding & Assembly',
  'Titanium Forging',
  'Titanium Extrusion',
  'Forming & Bending',
  'Anodizing (Type II & Type III)',
  'Polishing & Sandblasting',
  'Titanium Surface Treatment',
  'deburring of components',
  'high precision grinding',
  // ── 采购（procurement）──
  'RFQ',
  'titanium parts',
  'titanium cnc parts',
  'titanium fasteners',
  'titanium flanges',
  'titanium pipe components',
  'Low-Volume Production',
  'Rapid Prototyping',
]);

/**
 * persona 语义规则（按顺序，先命中先得）。
 * 仅用于 CORE_KEYWORDS 中未显式覆盖的关键词。
 */
const RULES = [
  { re: /AS9100|ISO 9001|ISO 13485|ITAR|NADCAP|ASTM|CMM|inspection/i, persona: 'quality' },
  { re: /Grade [0-9]|Ti-6Al-4V|ELI|Custom Industrial/i, persona: 'design' },
  { re: /Comprehensive|Processing Services|Manufacturing/i, persona: 'owner' },
  { re: /RFQ|parts|fasteners|flanges|pipe components|Low-Volume|Production|Rapid Prototyping|Services/i, persona: 'procurement' },
  { re: /CNC|Milling|Turning|EDM|Laser|Waterjet|Welding|Forging|Extrusion|Forming|Anodiz|Passivat|Polish|Sandblast|Deburr|Grinding|Surface Treatment|Fabrication/i, persona: 'manufacturing' },
];

/** 显式覆盖（industry 类词优先人工指定，避免歧义） */
const OVERRIDE = {
  'aerospace titanium': 'owner',
  'medical implants': 'quality',
  'Comprehensive Titanium Manufacturing': 'owner',
  'Comprehensive Titanium Manufacturing & Processing Services': 'owner',
  '3/5-Axis CNC Machining': 'design',
  'CNC Milling & Turning': 'design',
  'Custom Industrial Components': 'design',
  'Grade 5 Titanium': 'design',
  'Grade 23 Titanium': 'design',
  'Ti-6Al-4V': 'design',
  'Ti-6Al-4V ELI': 'design',
  'RFQ': 'procurement',
  'titanium parts': 'procurement',
  'titanium cnc parts': 'procurement',
  'titanium fasteners': 'procurement',
  'titanium flanges': 'procurement',
  'titanium pipe components': 'procurement',
  'Low-Volume Production': 'procurement',
  'Rapid Prototyping': 'procurement',
};

function resolvePersona(keyword) {
  if (OVERRIDE[keyword]) return OVERRIDE[keyword];
  for (const rule of RULES) {
    if (rule.re.test(keyword)) return rule.persona;
  }
  return 'procurement'; // 语义兜底（核心词集内不应触发）
}

/**
 * 旅程阶段：由 intent + persona + 关键词语义派生。
 *   informational → awareness；
 *   采购/决策类词（procurement + 采购语义 / owner）→ decision；
 *   其余 commercial → consideration。
 */
function resolveJourneyStage(entry, persona) {
  if (entry.intent === 'informational') return 'awareness';
  if (persona === 'owner') return 'decision';
  if (persona === 'procurement') {
    if (/RFQ|quote|Low-Volume|Production|parts|fasteners|flanges|pipe components/i.test(entry.keyword)) return 'decision';
    return 'consideration';
  }
  return 'consideration';
}

/**
 * 受众优先长尾问答词储备（People-Also-Ask 风格）。
 * status:'planned' → 不进构建、不进内链，仅作词库储备。
 * 每条均明确 行业 × 人群 × 旅程，正是「按人群反向选词」的落地示范。
 */
const PLANNED_LONGTAILS = [
  { keyword: 'how to qualify an AS9100D titanium CNC machining supplier', industry: 'aerospace-defense', persona: 'quality', journeyStage: 'consideration', intent: 'informational', targetUrl: '/capabilities/certifications/' },
  { keyword: 'ISO 13485 titanium implant manufacturing requirements', industry: 'medical-device', persona: 'quality', journeyStage: 'decision', intent: 'commercial', targetUrl: '/industries/medical/' },
  { keyword: 'Ti-6Al-4V vs Ti-6Al-4V ELI design differences for aerospace', industry: 'aerospace-defense', persona: 'design', journeyStage: 'awareness', intent: 'informational', targetUrl: '/materials/grade-5/' },
  { keyword: 'titanium vacuum chamber machining distortion prevention', industry: 'semiconductor', persona: 'manufacturing', journeyStage: 'consideration', intent: 'informational', targetUrl: '/titanium-cnc-machining-services/custom-industrial-components/' },
  { keyword: 'titanium parts lead time and MOQ from a Chinese CNC supplier', industry: 'general-industrial', persona: 'procurement', journeyStage: 'decision', intent: 'commercial', targetUrl: '/rfq/' },
  { keyword: 'NADCAP certified titanium processing what it means for medical implants', industry: 'medical-device', persona: 'quality', journeyStage: 'awareness', intent: 'informational', targetUrl: '/capabilities/certifications/' },
  { keyword: 'how to reduce titanium CNC machining cost per part', industry: 'general-industrial', persona: 'procurement', journeyStage: 'consideration', intent: 'commercial', targetUrl: '/titanium-cnc-machining-services/' },
  { keyword: 'AS9100D certified titanium supplier for defense hardware', industry: 'aerospace-defense', persona: 'procurement', journeyStage: 'decision', intent: 'commercial', targetUrl: '/capabilities/certifications/' },
  { keyword: 'titanium welding contamination prevention for chemical processing', industry: 'chemical-processing', persona: 'manufacturing', journeyStage: 'consideration', intent: 'informational', targetUrl: '/titanium-fabrication-services/titanium-welding-assembly/' },
  { keyword: 'semiconductor-grade titanium parts cleanliness requirements', industry: 'semiconductor', persona: 'quality', journeyStage: 'consideration', intent: 'informational', targetUrl: '/industries/semiconductor/' },
];

/**
 * 行业页覆盖扩展（mapped，受众维度）。
 * 为其余 7 个未被覆盖的 /industries/ 静态行业页补齐 persona 关键词；
 * aerospace / medical 已覆盖，保持现状。这些词进入构建内链映射（纯增量）。
 * 旅程阶段统一 consideration（行业应用发现期）。
 */
const INDUSTRY_MAPPED = [
  { keyword: 'titanium AI infrastructure components', targetUrl: '/industries/ai-infrastructure/', persona: 'design' },
  { keyword: 'titanium chemical processing equipment', targetUrl: '/industries/chemical/', persona: 'quality' },
  { keyword: 'titanium components for the energy industry', targetUrl: '/industries/energy/', persona: 'procurement' },
  { keyword: 'titanium industrial equipment components', targetUrl: '/industries/industrial-equipment/', persona: 'procurement' },
  { keyword: 'marine titanium components', targetUrl: '/industries/marine/', persona: 'manufacturing' },
  { keyword: 'semiconductor titanium components', targetUrl: '/industries/semiconductor/', persona: 'quality' },
  { keyword: 'titanium components for UAVs and drones', targetUrl: '/industries/uav-drones/', persona: 'design' },
];

/**
 * 针对 blog 文章的长尾问答词储备（纯词库，不动内容 schema）。
 * status:'planned' → 不进构建、不进内链。
 * 每条按「行业 × 人群 × 旅程」组织，targetUrl 指向对应 blog 文章。
 */
const BLOG_PLANNED = [
  { keyword: 'how much does titanium CNC machining cost per part', industry: 'general-industrial', persona: 'procurement', journeyStage: 'consideration', targetUrl: '/blog/titanium-cnc-machining-cost-factors/' },
  { keyword: 'what is alpha case formation in titanium and how to prevent it', industry: 'aerospace-defense', persona: 'manufacturing', journeyStage: 'awareness', targetUrl: '/blog/alpha-case-formation-titanium-prevention-removal/' },
  { keyword: 'Ti-6Al-4V machining tips to avoid work hardening', industry: 'aerospace-defense', persona: 'manufacturing', journeyStage: 'awareness', targetUrl: '/blog/titanium-work-hardening-how-to-avoid/' },
  { keyword: 'AS9100D vs ISO 9001 what is the difference for a titanium supplier', industry: 'aerospace-defense', persona: 'quality', journeyStage: 'consideration', targetUrl: '/blog/as9100d-titanium-cnc-manufacturing-aerospace-quality/' },
  { keyword: 'how to prepare an RFQ for custom titanium machined parts', industry: 'general-industrial', persona: 'procurement', journeyStage: 'decision', targetUrl: '/blog/custom-titanium-machining-contract-manufacturer-china-rfq-preparation/' },
  { keyword: 'titanium grade 2 vs 5 vs 23 which should I choose', industry: 'general-industrial', persona: 'design', journeyStage: 'awareness', targetUrl: '/blog/titanium-grade-2-vs-5-vs-23-procurement-decision-guide/' },
  { keyword: 'can titanium CNC machining achieve Ra 0.4 surface finish', industry: 'general-industrial', persona: 'design', journeyStage: 'consideration', targetUrl: '/blog/titanium-surface-finish-achieving-ra-04um/' },
  { keyword: 'what tolerances can titanium CNC machining hold', industry: 'general-industrial', persona: 'design', journeyStage: 'consideration', targetUrl: '/blog/titanium-cnc-tolerance-guide-engineering-specifications/' },
  { keyword: 'thin wall titanium machining guidelines to prevent distortion', industry: 'aerospace-defense', persona: 'manufacturing', journeyStage: 'awareness', targetUrl: '/blog/thin-wall-titanium-machining-guidelines/' },
  { keyword: 'what does NADCAP certification mean for titanium processing', industry: 'medical-device', persona: 'quality', journeyStage: 'awareness', targetUrl: '/blog/nadcap-certification-titanium-processing/' },
];

function main() {
  const all = getAll();
  const tagged = [];

  // 1) 给 CORE_KEYWORDS 子集打 persona + journeyStage（合并写入，保留既有字段）
  for (const entry of all) {
    if (entry.lang !== 'en' || entry.status !== 'mapped') continue;
    if (!CORE_KEYWORDS.has(entry.keyword)) continue;
    const persona = resolvePersona(entry.keyword);
    const journeyStage = resolveJourneyStage(entry, persona);
    tagged.push({ keyword: entry.keyword, lang: 'en', persona, journeyStage });
  }

  // 2) 追加 planned 长尾问答词储备
  const planned = PLANNED_LONGTAILS.map((kw) => ({
    keyword: kw.keyword,
    lang: 'en',
    intent: kw.intent,
    entity: 'uncategorized',
    status: 'planned',
    targetUrl: kw.targetUrl,
    anchorText: kw.keyword,
    industry: kw.industry,
    persona: kw.persona,
    journeyStage: kw.journeyStage,
    source: 'audience-first',
    volume: null,
    difficulty: null,
    note: '受众优先长尾问答词储备（行业×人群×旅程）；planned，不进构建',
  }));

  // 3) 行业页覆盖扩展（mapped，进入构建内链映射）
  const industryMapped = INDUSTRY_MAPPED.map((kw) => ({
    keyword: kw.keyword,
    lang: 'en',
    intent: 'commercial',
    entity: 'industry',
    status: 'mapped',
    targetUrl: kw.targetUrl,
    anchorText: kw.keyword,
    persona: kw.persona,
    journeyStage: 'consideration',
    source: 'audience-first',
    volume: null,
    difficulty: null,
    note: '行业页受众覆盖（mapped，进入内链映射）',
  }));

  // 4) 针对 blog 文章的长尾问答词储备（planned，不进构建）
  const blogPlanned = BLOG_PLANNED.map((kw) => ({
    keyword: kw.keyword,
    lang: 'en',
    intent: 'informational',
    entity: 'uncategorized',
    status: 'planned',
    targetUrl: kw.targetUrl,
    anchorText: kw.keyword,
    industry: kw.industry,
    persona: kw.persona,
    journeyStage: kw.journeyStage,
    source: 'audience-first-blog',
    volume: null,
    difficulty: null,
    note: '针对 blog 文章的长尾问答词储备（planned，不进构建）',
  }));

  const written = upsertMany([...tagged, ...planned, ...industryMapped, ...blogPlanned]);

  // 统计
  const after = getAll();
  const personaCount = {};
  for (const e of after) {
    if (e.persona) personaCount[e.persona] = (personaCount[e.persona] || 0) + 1;
  }
  const plannedCount = after.filter((e) => e.status === 'planned').length;

  console.log('=== Audience-First 打标完成 ===');
  console.log(`写入/更新条数: ${written}`);
  console.log(`已带 persona 标签总数: ${Object.values(personaCount).reduce((a, b) => a + b, 0)}`);
  console.log('persona 分布:', JSON.stringify(personaCount));
  console.log(`planned 长尾词储备: ${plannedCount}`);
  console.log('✅ 完成。既有 mapped 锚文本与构建行为不变。');
}

main();
