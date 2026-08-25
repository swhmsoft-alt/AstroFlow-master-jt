/**
 * seed-entity-internal-links.mjs
 * =====================================================================
 * F1 — GEO Cluster×Inbound: 内链网格种子脚本。
 *
 * 目标：
 *   把 entity-registry.json 中所有 page_url 可达的实体，按 canonical_name
 *   作为锚文本灌入主库 data/keywords/main-db.json，使
 *     - rehype-auto-internal-links-i18n (markdown)
 *     - src/lib/auto-inline-links.ts (Astro 组件)
 *   下次构建时自动把这 293 个原本 orphan 的实体在站内建立反向链接。
 *
 * 设计原则：
 *   - 单一权威源 (SSO) 仍为 main-db.json；本脚本不发明并列的实体表。
 *   - 幂等：(lang, keyword) 已存在则跳过；id 已存在则更新（保稳定 diff）。
 *   - 仅写「status=mapped」的最小可执行条目；其他字段保留 entry 默认值。
 *   - 不改 entity-registry.json / 页面组件；属纯数据侧播种。
 *
 * 用法：
 *   node scripts/seed-entity-internal-links.mjs
 *   node scripts/seed-entity-internal-links.mjs --dry-run
 *   node scripts/seed-entity-internal-links.mjs --limit 50   仅处理 top N
 *
 * 输出：
 *   stdout 报告：已写入 / 已跳过 / 失败计数 + 类别分布
 * =====================================================================
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { getAll, upsertMany, MAIN_DB_PATH } from '../src/lib/keywords/repository.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');

const ARGS = process.argv.slice(2);
const FLAGS = {
  dryRun: ARGS.includes('--dry-run'),
  limit: (() => {
    const i = ARGS.indexOf('--limit');
    return i >= 0 ? parseInt(ARGS[i + 1], 10) || null : null;
  })(),
  verbose: ARGS.includes('--verbose') || ARGS.includes('-v'),
};

const REGISTRY_PATH = path.join(ROOT, 'data', 'entities', 'entity-registry.json');

// ─────────────────────────────────────────────────────────────────────
// 1. 读 registry + 主库现有条目
// ─────────────────────────────────────────────────────────────────────
function loadRegistry() {
  if (!fs.existsSync(REGISTRY_PATH)) {
    throw new Error(`Entity registry not found: ${REGISTRY_PATH}\nRun: node scripts/build-entity-registry.mjs`);
  }
  const raw = JSON.parse(fs.readFileSync(REGISTRY_PATH, 'utf-8'));
  if (!Array.isArray(raw?.entities)) {
    throw new Error('Invalid entity-registry.json shape: missing .entities[]');
  }
  return raw;
}

// ─────────────────────────────────────────────────────────────────────
// 2. 构造种子条目
// ─────────────────────────────────────────────────────────────────────
/**
 * 把单个实体压扁为 main-db.json 的一条记录。
 * - canonical_name 必写入；aliases 仅作为「可选额外锚」（避免 200+ 多义词重名）。
 * - 过滤 page_url 缺省、来源 = source_collection 不在内链域 的条目。
 */
function entityToEntry(entity) {
  const url = String(entity.page_url || '').trim();
  const name = String(entity.canonical_name || '').trim();
  if (!url || !name) return null;

  // 业务护栏：page_url 必须是站点内相对路径
  if (!url.startsWith('/') || url.includes('//')) return null;

  // 业务护栏：锚文本最小长度 3 字符（与 auto-inline-links 一致）
  if (name.length < 3) return null;

  return {
    keyword: name,
    lang: 'en',
    intent: 'informational',
    entity: entity.category || 'uncategorized',
    targetUrl: url,
    anchorText: name,
    source: 'manual',
    status: 'mapped',
    note: `seed F1 entity-registry (id=${entity.id})`,
  };
}

// ─────────────────────────────────────────────────────────────────────
// 3. dedup helper
// ─────────────────────────────────────────────────────────────────────
function buildExistingKeySet(entries) {
  const set = new Set();
  for (const e of entries) {
    const k = String(e.keyword || '').trim();
    if (!k) continue;
    set.add(`${e.lang}::${k.toLowerCase()}`);
  }
  return set;
}

// ─────────────────────────────────────────────────────────────────────
// 4. main
// ─────────────────────────────────────────────────────────────────────
function main() {
  console.log('═══════════════════════════════════════════════════════════════');
  console.log('  F1 — Seed entity canonical_name → page_url into main-db.json');
  console.log('═══════════════════════════════════════════════════════════════\n');

  const registry = loadRegistry();
  const entities = registry.entities;
  console.log(`✓ Loaded ${entities.length} entities from registry (version=${registry.meta?.version})`);
  console.log(`  By category: ${JSON.stringify(registry.meta?.by_category)}`);

  const existing = getAll();
  const existingKeys = buildExistingKeySet(existing);
  console.log(`✓ Loaded ${existing.length} existing main-db entries (lang=en keys=${[...existingKeys].filter(k => k.startsWith('en::')).length})\n`);

  // 构造种子
  const seedEntries = [];
  const skippedNoUrl = [];
  const skippedDuplicate = [];
  const skippedTooShort = [];

  for (const e of entities) {
    const url = String(e.page_url || '').trim();
    const name = String(e.canonical_name || '').trim();
    if (!url) {
      skippedNoUrl.push(e.id);
      continue;
    }
    if (name.length < 3) {
      skippedTooShort.push(e.id);
      continue;
    }
    const key = `en::${name.toLowerCase()}`;
    if (existingKeys.has(key)) {
      skippedDuplicate.push({ id: e.id, name, url });
      continue;
    }
    const entry = entityToEntry(e);
    if (entry) {
      seedEntries.push(entry);
      existingKeys.add(key); // 同批内防重
    }
  }

  let toWrite = seedEntries;
  if (FLAGS.limit && toWrite.length > FLAGS.limit) {
    toWrite = toWrite.slice(0, FLAGS.limit);
  }

  console.log(`→ New entries to seed:  ${toWrite.length}`);
  console.log(`  ↳ skipped (no page_url):         ${skippedNoUrl.length}`);
  console.log(`  ↳ skipped (name < 3 chars):      ${skippedTooShort.length}`);
  console.log(`  ↳ skipped (already in main-db):  ${skippedDuplicate.length}\n`);

  if (toWrite.length === 0) {
    console.log('✓ Nothing to seed. main-db.json already covers all reachable entities.');
    return;
  }

  // 分类分布预览
  const byCat = {};
  for (const e of toWrite) byCat[e.entity] = (byCat[e.entity] || 0) + 1;
  console.log('Seed distribution by category:');
  for (const [cat, n] of Object.entries(byCat).sort((a, b) => b[1] - a[1])) {
    console.log(`  ${cat.padEnd(14)} ${n}`);
  }
  console.log('');

  if (FLAGS.verbose) {
    console.log('First 5 entries (preview):');
    for (const e of toWrite.slice(0, 5)) {
      console.log(`  • "${e.anchorText}"  →  ${e.targetUrl}`);
    }
    console.log('');
  }

  if (FLAGS.dryRun) {
    console.log('[DRY RUN] No writes performed.');
    return;
  }

  const written = upsertMany(toWrite);
  console.log(`✓ Wrote ${written} entries to ${MAIN_DB_PATH}`);
  console.log('\nNext step:');
  console.log('  1. node scripts/keywords-sync.mjs   (sync astro.config.mjs keywordMap)');
  console.log('  2. npm run build                      (rehype + auto-inline-links pick up new entries)');
  console.log('  3. node scripts/audit-entity-coverage.mjs  (re-measure orphan count)');
}

main();