/**
 * build-entity-registry.mjs
 * =====================================================================
 * 构建 AstroFlow 实体图（Entity Graph）—— GEO Cluster×Inbound 的 SSoT。
 *
 * 数据源（11 个）：
 *   1. src/data/titanium-grades.ts          → material (13)
 *   2. src/data/titanium-standards.ts       → standard (18)
 *   3. src/data/equipment.ts                → process    (13)
 *   4. src/data/services-schema.ts          → service    (6 枢纽 + 子项)
 *   5. src/content/materials/*.json         → material   (20)
 *   6. src/content/capabilities/*.json      → process    (~445)
 *   7. src/content/industries/*.json        → industry   (12)
 *   8. src/content/systems/*.json           → application (60)
 *   9. src/content/product-entities/*.json  → product    (260)
 *  10. src/content/case-studies/*.md        → case-study (3)
 *  11. (扩展位) 自定义源
 *
 * 输  出：
 *   data/entities/entity-registry.json
 *
 * 设计原则（Closed-Loop）：
 *   - 幂等：重复运行结果一致（基于 stable id 排序）。
 *   - 不修改任何运行时产物；纯新增 data/ + memory-bank/。
 *   - 复用 src/data + src/content 现有结构，不复制。
 *
 * 用法：
 *   node scripts/build-entity-registry.mjs
 *   node scripts/build-entity-registry.mjs --pretty   (默认紧凑，去掉空格减小体积)
 * =====================================================================
 */

import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const ARGS = process.argv.slice(2);
const PRETTY = ARGS.includes('--pretty') || ARGS.includes('-p');

// ─────────────────────────────────────────────────────────────────────
// 路径常量
// ─────────────────────────────────────────────────────────────────────
const PATHS = {
  OUT_DIR:        path.join(ROOT, 'data', 'entities'),
  OUT_FILE:       path.join(ROOT, 'data', 'entities', 'entity-registry.json'),
  OUT_REL:        'data/entities/entity-registry.json',

  GRADES_TS:      path.join(ROOT, 'src', 'data', 'titanium-grades.ts'),
  STANDARDS_TS:   path.join(ROOT, 'src', 'data', 'titanium-standards.ts'),
  EQUIPMENT_TS:   path.join(ROOT, 'src', 'data', 'equipment.ts'),
  SERVICES_TS:    path.join(ROOT, 'src', 'data', 'services-schema.ts'),

  MATERIALS_DIR:  path.join(ROOT, 'src', 'content', 'materials'),
  CAPABILITIES_DIR: path.join(ROOT, 'src', 'content', 'capabilities'),
  INDUSTRIES_DIR: path.join(ROOT, 'src', 'content', 'industries'),
  SYSTEMS_DIR:    path.join(ROOT, 'src', 'content', 'systems'),
  PRODUCTS_DIR:   path.join(ROOT, 'src', 'content', 'product-entities'),
  CASES_DIR:      path.join(ROOT, 'src', 'content', 'case-studies'),
};

const HOST = 'https://cnc.bozemetal.com';

// ─────────────────────────────────────────────────────────────────────
// 工具：TS 文件 → JS 对象（最小 TS 剥离 + vm 沙箱执行）
// ─────────────────────────────────────────────────────────────────────

/**
 * 把 .ts 数据文件转为 JS 对象。
 * 用正则剥离 TS-only 语法（import / export / interface / type / 注解），
 * 然后用 vm 在隔离上下文中执行。
 *
 * 注意：本函数只针对本项目 src/data/*.ts 这类"纯数据文件"设计，
 * 不会处理运行时依赖、装饰器、复杂泛型等。
 */
function loadTsModule(filePath) {
  if (!fs.existsSync(filePath)) {
    console.warn(`  ⚠ source missing: ${path.relative(ROOT, filePath)}`);
    return {};
  }
  let src = fs.readFileSync(filePath, 'utf-8');

  // 0. 把整个文件去成单行以避免 regex 的换行陷阱（先去掉 \n 之间的干扰）。
  //    因为我们的目标只是"得到常量字面量对象"，不需要保留换行。
  //    但 string literals 里的 \n 必须保留——所以先按 string 边界切分。
  //    简化方案：保护 string literals 后再处理。
  const strings = [];
  src = src.replace(/`[\s\S]*?`|'[^'\n]*'|"[^"\n]*"/g, (m) => {
    strings.push(m);
    return `__STR${strings.length - 1}__`;
  });

  // 1. 删除 import 语句（行级 + 跨行）
  src = src.replace(/^\s*import\s+[^;]*;\s*$/gm, '');
  src = src.replace(/\bimport\s+[\s\S]*?from\s+['"][^'"]+['"];?/g, '');

  // 2. 删除 export type / export interface / export { ... }
  src = src.replace(/\bexport\s+type\s+[\s\S]*?;/g, '');
  src = src.replace(/\bexport\s+interface\s+\w+[\s\S]*?\n\}\s*/g, '');
  src = src.replace(/\bexport\s*\{[^}]*\}\s*;?/g, '');

  // 3. 收集所有 `export const X: ...` / `export const X = ...` 的标识符。
  //    只移除 `export ` 前缀，保留 `:` 让后续步骤统一处理类型注解。
  const exportedNames = [];
  src = src.replace(/\bexport\s+const\s+(\w+)/g, (_, name) => {
    exportedNames.push(name);
    return `const ${name}`;
  });

  // 4. 移除变量类型注解：
  //    `const X: T = ...` → `const X = ...`
  //    注意：类型可能含 `<T1, T2>` 泛型，所以不能排除 `,`，仅排除 `=` 与 `{`
  src = src.replace(/(\bconst\s+\w+)\s*:\s*[^={]+(\s*=)/g, '$1$2');

  // 5. `as Type` 断言 → 删除
  src = src.replace(/\s+as\s+(?:const|[A-Z]\w*(?:<[^>]+>)?(?:\[\])?)/g, '');

  // 6. 可选标记 `field?: Type` → `field: undefined`
  src = src.replace(/(\w)\?\s*:\s*[^,;}\n]+/g, '$1: undefined');

  // 6.5 union 字面量类型 `'A' | 'B' | 'C'` → 保留第一个 `'A'`
  src = src.replace(/'([^']*)'(?:\s*\|\s*'[^']*')+/g, "'$1'");

  // 6.6 类型注解通用清理：`: TypeName<...>[],` 或 `: TypeName;` 等
  //     注意：这里仅在对象字面量上下文（key 之后）做替换，避免破坏 key: value
  src = src.replace(/(\b\w+\s*):\s*[A-Z]\w*(?:<[^>]+>)?(?:\[\])?\s*(?=[,)}\n])/g, '$1: undefined');

  // 6.7 兜底：剩余的 `Type[]` 类型注解（在 `,` `)` `}` `=` 后）→ 删
  src = src.replace(/\b[A-Z]\w*(?:<[^>]+>)?\[\](?=\s*[,)}\n;=])/g, 'undefined');

  // 6.8 移除 `interface Xxx<T> { ... }` 块（含泛型）
  src = src.replace(/\binterface\s+\w+(?:<[^>]+>)?\s*\{[\s\S]*?\n\}\s*/g, '');

  // 7. 还原 string literals
  src = src.replace(/__STR(\d+)__/g, (_, i) => strings[Number(i)]);

  // 7.5 追加 module.exports.X = X; 让 vm 把 const 暴露到上下文
  if (exportedNames.length) {
    src += '\n' + exportedNames.map((n) => `module.exports.${n} = ${n};`).join('\n') + '\n';
  }

  // 8. 跑 vm
  const context = { module: { exports: {} }, exports: {}, console };
  vm.createContext(context);
  try {
    vm.runInContext(src, context, { filename: filePath, timeout: 5000 });
  } catch (e) {
    // 打印剥离后的源码片段便于诊断
    const lines = src.split('\n');
    const m = e.stack && e.stack.match(/<anonymous>:(\d+)/);
    const ln = m ? parseInt(m[1], 10) : 0;
    const snippet = lines.slice(Math.max(0, ln - 3), ln + 2).join('\n');
    console.error(`  ✗ vm error in ${path.relative(ROOT, filePath)}: ${e.message}`);
    if (ln) console.error(`    near line ${ln}:\n${snippet}`);
    return {};
  }
  return context.module.exports && Object.keys(context.module.exports).length
    ? context.module.exports
    : context.exports || {};
}

/**
 * 列出目录下所有 .json / .md 文件名（不含目录）
 */
function listFiles(dir, ext = '.json') {
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir)
    .filter((f) => f.endsWith(ext))
    .sort();
}

// ─────────────────────────────────────────────────────────────────────
// 规范化：name → 搜索词（lowercase / 去空格 / 去标点）
// ─────────────────────────────────────────────────────────────────────
function normalize(s) {
  return String(s || '')
    .toLowerCase()
    .replace(/\s+/g, ' ')
    .replace(/[\(\)\[\]\{\}]/g, ' ')
    .replace(/[^a-z0-9 \-]/g, '')
    .trim();
}

function uniqueAliases(...sources) {
  const set = new Set();
  const out = [];
  for (const src of sources) {
    if (!src) continue;
    const arr = Array.isArray(src) ? src : [src];
    for (const v of arr) {
      const t = String(v || '').trim();
      if (!t) continue;
      const k = t.toLowerCase();
      if (set.has(k)) continue;
      set.add(k);
      out.push(t);
    }
  }
  return out;
}

function searchTermsFrom(...sources) {
  const set = new Set();
  for (const src of sources) {
    if (!src) continue;
    const arr = Array.isArray(src) ? src : [src];
    for (const v of arr) {
      const n = normalize(v);
      if (n) set.add(n);
    }
  }
  return [...set];
}

// ─────────────────────────────────────────────────────────────────────
// 源 1：Titanium Grades (TS)
// ─────────────────────────────────────────────────────────────────────
function extractGrades() {
  console.log('  · grades …');
  const mod = loadTsModule(PATHS.GRADES_TS);
  const GRADE_DATA = mod.GRADE_DATA || {};
  const out = [];
  for (const [key, g] of Object.entries(GRADE_DATA)) {
    if (!g || typeof g !== 'object') continue;
    const aliases = uniqueAliases(g.entityDefinition?.commonNames, [g.name], [g.nameCn], [g.uns]);
    out.push({
      id: `material:grade:${key}`,
      slug: key,
      category: 'material',
      subcategory: g.entityDefinition?.classification,
      canonical_name: g.name,
      chinese_name: g.nameCn,
      aliases,
      search_terms: searchTermsFrom(g.name, g.nameCn, g.uns, g.entityDefinition?.commonNames, g.entityDefinition?.classification),
      page_url: `/materials/${key}/`,
      source_file: 'src/data/titanium-grades.ts',
      source_collection: 'titanium-grades.ts',
      relationships: {
        conforms_to: (g.conformsTo?.items || []).filter((s) => /ASTM|AMS|ISO|MIL|ASME/i.test(s)),
        processed_by: g.processedBy?.items || [],
        manufactured_into: g.manufacturedFrom?.items || [],
        used_in: g.usedIn?.items || [],
        alternative_to: g.alternativeTo?.items || [],
      },
      seo: {
        page_title: g.pageTitle,
        meta_description: g.metaDescription,
      },
      has_faqs: Array.isArray(g.faqs) && g.faqs.length > 0,
      faqs_count: g.faqs?.length || 0,
      tags: ['titanium', 'grade', key.replace(/-/g, '_')],
      description: g.tagline,
    });
  }
  return out;
}

// ─────────────────────────────────────────────────────────────────────
// 源 2：Titanium Standards (TS)
// ─────────────────────────────────────────────────────────────────────
function extractStandards() {
  console.log('  · standards …');
  const mod = loadTsModule(PATHS.STANDARDS_TS);
  const STANDARD_DATA = mod.STANDARD_DATA || {};
  const out = [];
  for (const [key, s] of Object.entries(STANDARD_DATA)) {
    if (!s || typeof s !== 'object') continue;
    const aliases = uniqueAliases([s.name], [s.fullName]);
    out.push({
      id: `standard:${key}`,
      slug: key,
      category: 'standard',
      subcategory: s.category,
      canonical_name: s.name,
      full_name: s.fullName,
      organization: s.organization,
      aliases,
      search_terms: searchTermsFrom(s.name, s.fullName, s.organization, s.specTitle),
      page_url: `/titanium-standards/${key}/`,
      source_file: 'src/data/titanium-standards.ts',
      source_collection: 'titanium-standards.ts',
      relationships: {
        supported_grades: s.supportedGrades || [],
        related_standards: s.relatedStandards || [],
        industries: s.industries || [],
        cnc_capabilities: s.cncCapabilities || [],
      },
      seo: {
        page_title: s.pageTitle,
        meta_description: s.metaDescription,
      },
      has_faqs: Array.isArray(s.faqs) && s.faqs.length > 0,
      faqs_count: s.faqs?.length || 0,
      tags: ['standard', s.organization?.toLowerCase(), s.category],
      description: s.tagline,
    });
  }
  return out;
}

// ─────────────────────────────────────────────────────────────────────
// 源 3：Equipment (TS)
// ─────────────────────────────────────────────────────────────────────
function extractEquipment() {
  console.log('  · equipment …');
  const mod = loadTsModule(PATHS.EQUIPMENT_TS);
  const EQUIPMENT_DATA = mod.EQUIPMENT_DATA || {};
  const out = [];
  for (const [key, e] of Object.entries(EQUIPMENT_DATA)) {
    if (!e || typeof e !== 'object') continue;
    const aliases = uniqueAliases(e.entityDefinition?.commonNames, [e.name]);
    out.push({
      id: `process:equipment:${key}`,
      slug: key,
      category: 'process',
      subcategory: e.category,
      canonical_name: e.name,
      aliases,
      search_terms: searchTermsFrom(e.name, e.entityDefinition?.commonNames, e.category),
      page_url: `/equipment/${key}/`,
      source_file: 'src/data/equipment.ts',
      source_collection: 'equipment.ts',
      relationships: {
        conforms_to: e.conformsTo?.items || [],
        has_property: (e.hasProperty?.properties || []).map((p) => `${p.label}: ${p.value}`),
        processed_by: e.processedBy?.items || [],
        manufactured_into: e.manufacturedFrom?.items || [],
        used_in: e.usedIn?.items || [],
        alternative_to: e.alternativeTo?.items || [],
      },
      seo: {
        page_title: e.pageTitle,
        meta_description: e.metaDescription,
      },
      has_faqs: false,
      faqs_count: 0,
      tags: ['equipment', e.category?.toLowerCase().replace(/\s+/g, '_')],
      description: e.entityDefinition?.description?.slice(0, 200),
    });
  }
  return out;
}

// ─────────────────────────────────────────────────────────────────────
// 源 4：Services (TS) —— 含 hasPart 嵌套
// ─────────────────────────────────────────────────────────────────────
function extractServices() {
  console.log('  · services …');
  const mod = loadTsModule(PATHS.SERVICES_TS);
  const data = mod.servicesHierarchyData || {};
  const out = [];

  function visit(node, parentId) {
    if (!node || !node.id) return;
    const slugFromUrl = (node.id.match(/\/([^/]+)\/#[a-z-]+/) || [, ''])[1] || node.id.split('/').filter(Boolean).slice(-2, -1)[0];
    const key = node.id.split('#').pop();
    const canonical = node.name?.en || node.id;
    const aliases = uniqueAliases(node.name ? Object.values(node.name).filter(Boolean) : []);
    const id = `service:${slugFromUrl || key}`;

    out.push({
      id,
      slug: slugFromUrl,
      category: 'service',
      subcategory: node.serviceType,
      canonical_name: canonical,
      aliases,
      search_terms: searchTermsFrom(canonical, node.serviceType, node.description?.en),
      page_url: slugFromUrl ? `/${slugFromUrl}/` : node.id.replace(HOST, ''),
      source_file: 'src/data/services-schema.ts',
      source_collection: 'services-schema.ts',
      relationships: {
        has_part: (node.hasPart || []).map((p) => p.id),
        parent_service: parentId,
      },
      seo: {
        page_title: canonical,
        meta_description: (node.description?.en || '').slice(0, 160),
      },
      has_faqs: false,
      faqs_count: 0,
      tags: ['service', node.serviceType?.toLowerCase().replace(/\s+/g, '_')].filter(Boolean),
      description: node.description?.en,
    });

    for (const child of node.hasPart || []) {
      visit(child, id);
    }
  }

  for (const root of Object.values(data)) {
    visit(root, null);
  }
  return out;
}

// ─────────────────────────────────────────────────────────────────────
// 源 5-9：JSON Content Collections
// ─────────────────────────────────────────────────────────────────────
function loadJson(file) {
  try {
    return JSON.parse(fs.readFileSync(file, 'utf-8'));
  } catch (e) {
    console.warn(`  ✗ JSON parse error: ${path.relative(ROOT, file)}: ${e.message}`);
    return null;
  }
}

function extractContentMaterials() {
  console.log('  · content/materials …');
  const files = listFiles(PATHS.MATERIALS_DIR);
  return files.map((f) => {
    const slug = f.replace(/\.json$/, '');
    const j = loadJson(path.join(PATHS.MATERIALS_DIR, f)) || {};
    const aliases = uniqueAliases(j.aliases, [j.title]);
    return {
      id: `material:content:${slug}`,
      slug,
      category: 'material',
      subcategory: j.category,
      canonical_name: j.title,
      aliases,
      search_terms: searchTermsFrom(j.title, j.aliases, j.category),
      page_url: `/materials/${slug}/`,
      source_file: `src/content/materials/${f}`,
      source_collection: 'content/materials',
      relationships: {
        conforms_to: j.standards || [],
        related_capabilities: j.relatedCapabilities || [],
      },
      seo: {
        page_title: j.title,
        meta_description: (j.description || '').slice(0, 160),
      },
      has_faqs: false,
      faqs_count: 0,
      tags: ['material', 'content-collection'],
      description: j.description,
    };
  });
}

function extractContentCapabilities() {
  console.log('  · content/capabilities …');
  const files = listFiles(PATHS.CAPABILITIES_DIR);
  return files.map((f) => {
    const slug = f.replace(/\.json$/, '');
    const j = loadJson(path.join(PATHS.CAPABILITIES_DIR, f)) || {};
    const aliases = uniqueAliases(j.aliases, [j.title]);
    const relatedCaps = Array.isArray(j.relatedCapabilities) ? j.relatedCapabilities : [];
    return {
      id: `process:capability:${slug}`,
      slug,
      category: 'process',
      subcategory: j.category,
      canonical_name: j.title,
      aliases,
      search_terms: searchTermsFrom(j.title, j.aliases, j.category, relatedCaps),
      page_url: `/capabilities/${slug}/`,
      source_file: `src/content/capabilities/${f}`,
      source_collection: 'content/capabilities',
      relationships: {
        titanium_grades: j.titaniumGrades || [],
        related_capabilities: relatedCaps,
        downstream_processes: (j.downstreamProcesses || []).map((p) => p.name).filter(Boolean),
        typical_applications: j.typicalApplications || [],
        quality_standards: j.qualityStandards || [],
      },
      seo: {
        page_title: j.seoTitle || j.title,
        meta_description: j.seoDescription || (j.description || '').slice(0, 160),
      },
      has_faqs: false,
      faqs_count: 0,
      tags: ['capability', j.category?.toLowerCase().replace(/\s+/g, '_')].filter(Boolean),
      description: j.description,
    };
  });
}

// ─────────────────────────────────────────────────────────────────────
// F4 — Industry slug 调和映射（持久化层）
// ─────────────────────────────────────────────────────────────────────
// src/content/industries/*.json 文件名 slug ≠ src/pages/industries/*.astro 文件名 slug。
// 例：`aerospace-defense.json` 对应的页面是 `aerospace.astro`（URL `/industries/aerospace/`）。
//
// 这里维护 source-slug → page-slug 的重映射，保证 build-entity-registry 重跑后
// registry 里的 page_url 仍指向真实页面（而非 404）。
//
// 添加新行业时：
//   - 在 src/content/industries/<key>.json 放原始数据
//   - 在 src/pages/industries/<pageSlug>.astro 放对应页面
//   - 如果 key 与 pageSlug 不一致，把 key 加进 INDUSTRY_SLUG_REMAP 即可
//   - 如果该行业暂无对应页面，把 key 改成 value 为 '__HUB__'，会被映射到
//     /products/industries/（行业 hub）兜底，保证不出现 404 内链
// ─────────────────────────────────────────────────────────────────────
const INDUSTRY_SLUG_REMAP = Object.freeze({
  'aerospace-defense':              'aerospace',
  'chemical-processing':            'chemical',
  'marine-offshore':                'marine',
  'medical-device':                 'medical',
  // 暂无独立页面的行业 → 落到 /products/industries/ hub
  'automotive-motorsports':         '__HUB__',
  'consumer-electronics':           '__HUB__',
  'cycling---bicycle':              '__HUB__',
  'electroplating-surface-finishing': '__HUB__',
  'environmental-engineering':      '__HUB__',
  'general-industrial':             '__HUB__',
});

const INDUSTRY_HUB_URL = '/products/industries/';

function resolveIndustrySlug(sourceSlug) {
  const mapped = INDUSTRY_SLUG_REMAP[sourceSlug];
  if (mapped === '__HUB__') return { pageSlug: null, pageUrl: INDUSTRY_HUB_URL, fellBack: true };
  if (mapped) return { pageSlug: mapped, pageUrl: `/industries/${mapped}/`, fellBack: false };
  return { pageSlug: sourceSlug, pageUrl: `/industries/${sourceSlug}/`, fellBack: false };
}

function extractContentIndustries() {
  console.log('  · content/industries …');
  const files = listFiles(PATHS.INDUSTRIES_DIR);
  return files.map((f) => {
    const sourceSlug = f.replace(/\.json$/, '');
    const j = loadJson(path.join(PATHS.INDUSTRIES_DIR, f)) || {};
    const aliases = uniqueAliases(j.aliases, [j.title]);

    // F4 — 应用 slug 重映射（保持 source_slug 不变以维持 ID 稳定，只动 page_url）
    const { pageSlug, pageUrl, fellBack } = resolveIndustrySlug(sourceSlug);
    const entitySlug = pageSlug || sourceSlug; // hub-only fallback 时仍用 sourceSlug 做 ID

    return {
      id: `industry:${sourceSlug}`,                // ID 保持 source slug 稳定
      slug: entitySlug,
      category: 'industry',
      canonical_name: j.title,
      aliases,
      search_terms: searchTermsFrom(j.title, j.aliases),
      page_url: pageUrl,                             // 调和后的真实页面 URL
      _source_slug: sourceSlug,                      // 调试用：原始 source slug
      _hub_fallback: fellBack || undefined,
      source_file: `src/content/industries/${f}`,
      source_collection: 'content/industries',
      relationships: {
        applications: j.applications || [],
        related_systems: j.systems || [],
      },
      seo: {
        page_title: j.title,
        meta_description: (j.description || '').slice(0, 160),
      },
      has_faqs: false,
      faqs_count: 0,
      tags: ['industry', 'content-collection'],
      description: j.description,
    };
  });
}

function extractContentSystems() {
  console.log('  · content/systems …');
  const files = listFiles(PATHS.SYSTEMS_DIR);
  return files.map((f) => {
    const slug = f.replace(/\.json$/, '');
    const j = loadJson(path.join(PATHS.SYSTEMS_DIR, f)) || {};
    const aliases = uniqueAliases([j.title], j.industry ? [j.industry] : []);
    return {
      id: `application:${slug}`,
      slug,
      category: 'application',
      subcategory: j.industry,
      canonical_name: j.title,
      aliases,
      search_terms: searchTermsFrom(j.title, j.industry, j.emoji || ''),
      page_url: `/systems/${slug}/`,
      source_file: `src/content/systems/${f}`,
      source_collection: 'content/systems',
      relationships: {
        industry: j.industry,
        related_capabilities: j.relatedCapabilities || [],
        related_materials: j.relatedMaterials || [],
        related_standards: j.relatedStandards || [],
        product_entities: j.productEntities || [],
      },
      seo: {
        page_title: j.title,
        meta_description: (j.description || '').slice(0, 160),
      },
      has_faqs: false,
      faqs_count: 0,
      tags: ['system', j.industry?.toLowerCase().replace(/\s+/g, '_')].filter(Boolean),
      description: j.description,
    };
  });
}

function extractContentProducts() {
  console.log('  · content/product-entities …');
  const files = listFiles(PATHS.PRODUCTS_DIR);
  return files.map((f) => {
    const slug = f.replace(/\.json$/, '');
    const j = loadJson(path.join(PATHS.PRODUCTS_DIR, f)) || {};
    const aliases = uniqueAliases(j.aliases, [j.title]);
    const faqs = j.faq || [];
    return {
      id: `product:${slug}`,
      slug,
      category: 'product',
      subcategory: j.category,
      canonical_name: j.title,
      aliases,
      search_terms: searchTermsFrom(j.title, j.aliases, j.material, j.system, j.function),
      page_url: `/products/${slug}/`,
      source_file: `src/content/product-entities/${f}`,
      source_collection: 'content/product-entities',
      relationships: {
        industry: j.industry,
        system: j.system,
        material: j.material,
        related_capabilities: j.relatedCapabilities || [],
        related_industries: j.relatedIndustries || [],
        standards: j.standards || [],
        processes: j.process || [],
        surface_treatments: j.surfaceTreatment || [],
      },
      seo: {
        page_title: j.seoTitle || j.title,
        meta_description: j.seoDescription || (j.function || '').slice(0, 160),
      },
      has_faqs: faqs.length > 0,
      faqs_count: faqs.length,
      tags: ['product', j.industry?.toLowerCase().replace(/\s+/g, '_')].filter(Boolean),
      description: j.sceneDescription || j.function,
    };
  });
}

// ─────────────────────────────────────────────────────────────────────
// 源 10：Case Studies (.md) —— frontmatter 解析
// ─────────────────────────────────────────────────────────────────────
function extractCaseStudies() {
  console.log('  · content/case-studies …');
  const files = listFiles(PATHS.CASES_DIR, '.md');
  return files.map((f) => {
    const slug = f.replace(/\.md$/, '');
    const raw = fs.readFileSync(path.join(PATHS.CASES_DIR, f), 'utf-8');
    const fm = parseFrontmatter(raw);
    return {
      id: `case-study:${slug}`,
      slug,
      category: 'case-study',
      subcategory: fm.industry,
      canonical_name: fm.title || slug,
      aliases: [fm.componentType, fm.application].filter(Boolean),
      search_terms: searchTermsFrom(fm.title, fm.material, fm.industry, fm.componentType, fm.application),
      page_url: `/case-studies/${slug}/`,
      source_file: `src/content/case-studies/${f}`,
      source_collection: 'content/case-studies',
      relationships: {
        industry: fm.industry,
        material: fm.material,
        material_standard: fm.materialStandard,
        processes: fm.process || [],
        equipment: fm.equipment || [],
        related_links: (fm.relatedLinks || []).map((l) => l.href).filter(Boolean),
      },
      seo: {
        page_title: fm.seoTitle || fm.title,
        meta_description: fm.seoDescription,
      },
      has_faqs: false,
      faqs_count: 0,
      tags: ['case-study', fm.industry?.toLowerCase().replace(/\s+/g, '_')].filter(Boolean),
      description: fm.application,
    };
  });
}

function parseFrontmatter(md) {
  const m = md.match(/^---\s*\n([\s\S]*?)\n---/);
  if (!m) return {};
  const out = {};
  // 极简 YAML 解析：仅支持 key: value / key: [a, b] / key:\n  - item 块
  const body = m[1];
  const lines = body.split('\n');
  let i = 0;
  while (i < lines.length) {
    const line = lines[i];
    const km = line.match(/^([A-Za-z_][\w-]*):\s*(.*)$/);
    if (!km) { i++; continue; }
    const key = km[1];
    let val = km[2];
    if (val === '' || val === undefined) {
      // 列表模式：接下来以 "  - item" 开头
      const items = [];
      i++;
      while (i < lines.length && /^\s+-\s+/.test(lines[i])) {
        items.push(lines[i].replace(/^\s+-\s+/, '').trim().replace(/^["']|["']$/g, ''));
        i++;
      }
      out[key] = items;
      continue;
    }
    // 单行值
    val = val.trim().replace(/^["']|["']$/g, '');
    if (val.startsWith('[') && val.endsWith(']')) {
      out[key] = val.slice(1, -1).split(',').map((s) => s.trim().replace(/^["']|["']$/g, '')).filter(Boolean);
    } else if (/^(true|false|null)$/.test(val)) {
      out[key] = val === 'true' ? true : val === 'false' ? false : null;
    } else if (/^\d+(\.\d+)?$/.test(val)) {
      out[key] = Number(val);
    } else {
      out[key] = val;
    }
    i++;
  }
  return out;
}

// ─────────────────────────────────────────────────────────────────────
// 交叉引用：补全 search_terms 以涵盖别名
// ─────────────────────────────────────────────────────────────────────
function buildCrossReferences(all) {
  const bySlug = new Map();
  const byNorm = new Map();

  for (const e of all) {
    bySlug.set(e.slug, e);
    byNorm.set(normalize(e.canonical_name), e);
    for (const a of e.aliases) byNorm.set(normalize(a), e);
  }

  for (const e of all) {
    // 给每个实体补充 `cross_refs`：其它可能引用此实体的实体的 canonical_name 集合
    const refs = new Set();
    for (const term of e.search_terms) {
      for (const [norm, other] of byNorm) {
        if (other.id === e.id) continue;
        if (norm.includes(term) || term.includes(norm)) {
          refs.add(other.canonical_name);
        }
      }
    }
    e.cross_refs = [...refs].slice(0, 20); // 上限 20 防爆
  }
}

// ─────────────────────────────────────────────────────────────────────
// 主流程
// ─────────────────────────────────────────────────────────────────────
function main() {
  console.log('▶ build-entity-registry.mjs');
  console.log(`  ROOT = ${ROOT}`);

  const all = [
    ...extractGrades(),
    ...extractStandards(),
    ...extractEquipment(),
    ...extractServices(),
    ...extractContentMaterials(),
    ...extractContentCapabilities(),
    ...extractContentIndustries(),
    ...extractContentSystems(),
    ...extractContentProducts(),
    ...extractCaseStudies(),
  ];

  console.log(`  · cross-ref …`);
  buildCrossReferences(all);

  // 按 id 排序（稳定 diff）
  all.sort((a, b) => (a.id < b.id ? -1 : a.id > b.id ? 1 : 0));

  // 分类汇总
  const byCat = {};
  for (const e of all) byCat[e.category] = (byCat[e.category] || 0) + 1;

  const registry = {
    meta: {
      version: '1.0.0',
      generated_at: new Date().toISOString(),
      total: all.length,
      by_category: byCat,
      source_count: 10,
      description:
        'Canonical entity graph for AstroFlow (BOZE CNC Ti). Single Source of Truth for SEO/GEO/AIO. Read-only consumer: schema.ts#knowsAbout, link-builders, JSON-LD generators.',
    },
    entities: all,
  };

  if (!fs.existsSync(PATHS.OUT_DIR)) fs.mkdirSync(PATHS.OUT_DIR, { recursive: true });
  fs.writeFileSync(PATHS.OUT_FILE, JSON.stringify(registry, null, PRETTY ? 2 : 0) + '\n', 'utf-8');

  console.log('');
  console.log('✓ entity-registry.json written');
  console.log(`  path  = ${PATHS.OUT_REL}`);
  console.log(`  total = ${all.length}`);
  console.log(`  by category:`);
  for (const [cat, n] of Object.entries(byCat).sort()) {
    console.log(`    - ${cat.padEnd(12)} ${n}`);
  }
}

main();
