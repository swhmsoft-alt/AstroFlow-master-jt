/**
 * kw-cli.mjs — 关键词库 Headless CLI（查询 + 写操作 + 审计）
 * ================================================================
 * 查询：
 *   node scripts/kw-cli.mjs --lang=de --intent=commercial --status=planned
 *   node scripts/kw-cli.mjs --entity=process --lang=en
 *   node scripts/kw-cli.mjs --all
 *   node scripts/kw-cli.mjs --lang=ja --export=ja-planned.csv
 *   node scripts/kw-cli.mjs --count
 *
 * 写操作：
 *   # 批量启用（planned → mapped）+ 补 targetUrl
 *   node scripts/kw-cli.mjs --lang=de --intent=commercial --set-status=mapped --set-url=/titanium-cnc-machining-services/
 *   # 仅改某条（按 id）
 *   node scripts/kw-cli.mjs --id=xxx --set-status=mapped --set-url=/xxx/
 *
 * 回填（从 CSV 更新 volume/difficulty，CSV 需含 id 或 lang+keyword 列）：
 *   node scripts/kw-cli.mjs --import-csv=volumes.csv
 *
 * 导入新词（从 CSV/JSON 批量导入主库新条目，需含 keyword+lang，其余字段可选）：
 *   node scripts/kw-cli.mjs --import-new=words.csv
 *   node scripts/kw-cli.mjs --import-new=words.json
 *
 * 审计：
 *   node scripts/kw-cli.mjs --audit
 * ================================================================
 */

import fs from 'node:fs';
import path from 'node:path';
import {
  query,
  getAll,
  countByLang,
  updateByFilter,
  persist,
  upsertMany,
} from '../src/lib/keywords/repository.mjs';

function parseArgs(argv) {
  const args = {};
  for (const arg of argv) {
    const m = arg.match(/^--([^=]+)=(.*)$/);
    if (m) {
      args[m[1]] = m[2];
    } else if (arg === '--all' || arg === '--count' || arg === '--audit') {
      args[arg.slice(2)] = true;
    }
  }
  return args;
}

const INTENTS = ['informational', 'commercial', 'transactional', 'navigational'];
const ENTITIES = ['material', 'process', 'product', 'industry', 'standard', 'service', 'uncategorized'];
const LANGS = ['en', 'de', 'ja', 'fr', 'es', 'pt', 'it', 'ko', 'nl', 'pl', 'ru', 'ar'];
const STATUSES = ['planned', 'mapped', 'deprecated'];
const SOURCES = ['manual', 'gsc', 'competitor', 'deepseek'];

function toTable(rows) {
  if (rows.length === 0) return '(无结果)';
  const head = ['id', 'keyword', 'lang', 'intent', 'entity', 'status', 'source', 'targetUrl'];
  const widths = {};
  head.forEach((h) => (widths[h] = h.length));
  for (const r of rows) {
    head.forEach((h) => {
      const v = String(r[h] ?? '');
      if (v.length > widths[h]) widths[h] = v.length;
    });
  }
  const pad = (s, w) => String(s ?? '').padEnd(w);
  const line = head.map((h) => pad(h, widths[h])).join('  ');
  const sep = head.map((h) => '-'.repeat(widths[h])).join('  ');
  const body = rows.map((r) => head.map((h) => pad(r[h], widths[h])).join('  '));
  return [line, sep, ...body].join('\n');
}

function toCsv(rows) {
  const head = ['id', 'keyword', 'lang', 'intent', 'entity', 'status', 'source', 'targetUrl', 'anchorText', 'volume', 'difficulty', 'note'];
  const esc = (v) => `"${String(v ?? '').replace(/"/g, '""')}"`;
  const lines = [head.map(esc).join(',')];
  for (const r of rows) {
    lines.push(head.map((h) => esc(r[h])).join(','));
  }
  return lines.join('\n');
}

/** 从 CSV 第一行解析表头（兼容带 BOM） */
function parseCsv(text) {
  const lines = text.replace(/^\uFEFF/, '').split(/\r?\n/).filter((l) => l.trim() !== '');
  if (lines.length < 2) return { headers: [], rows: [] };
  const headers = lines[0].split(',').map((h) => h.replace(/^"|"$/g, '').trim());
  const rows = lines.slice(1).map((line) => {
    const cells = [];
    let cur = '';
    let inQ = false;
    for (let i = 0; i < line.length; i++) {
      const ch = line[i];
      if (ch === '"') {
        if (inQ && line[i + 1] === '"') { cur += '"'; i++; }
        else inQ = !inQ;
      } else if (ch === ',' && !inQ) {
        cells.push(cur.trim()); cur = '';
      } else {
        cur += ch;
      }
    }
    cells.push(cur.trim());
    const obj = {};
    headers.forEach((h, idx) => (obj[h] = cells[idx]));
    return obj;
  });
  return { headers, rows };
}

/** 审计：数据健康检查 */
function audit() {
  const all = getAll();
  const problems = [];
  const ids = new Set();

  for (const e of all) {
    if (!e.id) problems.push(`[无id] keyword=${e.keyword}`);
    else if (ids.has(e.id)) problems.push(`[重复id] ${e.id} keyword=${e.keyword}`);
    else ids.add(e.id);

    if (!e.keyword || !String(e.keyword).trim()) problems.push(`[空keyword] id=${e.id || '?'}`);
    if (!LANGS.includes(e.lang)) problems.push(`[非法语言] ${e.lang} keyword=${e.keyword}`);
    if (!STATUSES.includes(e.status)) problems.push(`[非法status] ${e.status} keyword=${e.keyword}`);

    if (e.status === 'mapped') {
      if (!e.targetUrl) problems.push(`[mapped缺targetUrl] id=${e.id} keyword=${e.keyword}`);
      if (!e.anchorText) problems.push(`[mapped缺anchorText] id=${e.id} keyword=${e.keyword}`);
    }
  }

  console.log('=== 关键词库审计 ===');
  console.log(`总条目: ${all.length}`);
  console.log(`  语言分布: ${JSON.stringify(countByLang())}`);
  console.log(`  问题数: ${problems.length}`);
  if (problems.length > 0) {
    console.log('\n问题清单:');
    problems.slice(0, 30).forEach((p) => console.log(`  ⚠️ ${p}`));
    if (problems.length > 30) console.log(`  ... 等共 ${problems.length} 条`);
  } else {
    console.log('  ✅ 无问题');
  }
  return problems;
}

/** 从 CSV 回填 volume/difficulty */
function importCsv(filePath) {
  if (!fs.existsSync(filePath)) {
    console.error(`❌ CSV 文件不存在: ${filePath}`);
    process.exit(1);
  }
  const { headers, rows } = parseCsv(fs.readFileSync(filePath, 'utf-8'));
  if (rows.length === 0) {
    console.error('❌ CSV 无数据行');
    process.exit(1);
  }
  console.log(`CSV 表头: ${headers.join(', ')} (${rows.length} 行)`);

  const all = getAll();
  const hasVol = headers.includes('volume');
  const hasDiff = headers.includes('difficulty');
  const hasId = headers.includes('id');
  const hasKw = headers.includes('keyword') && headers.includes('lang');

  if (!hasId && !hasKw) {
    console.error('❌ CSV 需包含 id 列，或 keyword+lang 列');
    process.exit(1);
  }

  let updated = 0;
  let missed = 0;
  const byId = new Map(all.map((e) => [e.id, e]));
  const byKey = new Map(all.map((e) => [`${e.lang}::${String(e.keyword).toLowerCase().trim()}`, e]));

  for (const row of rows) {
    let item = null;
    if (hasId && row.id) item = byId.get(row.id);
    if (!item && hasKw && row.keyword && row.lang) {
      item = byKey.get(`${row.lang}::${String(row.keyword).toLowerCase().trim()}`);
    }
    if (!item) { missed++; continue; }

    const patch = {};
    if (hasVol && row.volume !== undefined && row.volume !== '') {
      const v = Number(row.volume);
      if (!Number.isNaN(v)) patch.volume = v;
    }
    if (hasDiff && row.difficulty !== undefined && row.difficulty !== '') {
      const d = Number(row.difficulty);
      if (!Number.isNaN(d)) patch.difficulty = d;
    }
    if (Object.keys(patch).length > 0) {
      Object.assign(item, patch);
      item.updatedAt = new Date().toISOString();
      updated++;
    }
  }

  if (updated > 0) {
    persist(all);
  }
  console.log(`✅ 回填 ${updated} 条；未匹配 ${missed} 条`);
}

/** 从 CSV/JSON 批量导入主库新条目 */
function importNew(filePath) {
  if (!fs.existsSync(filePath)) {
    console.error(`❌ 文件不存在: ${filePath}`);
    process.exit(1);
  }
  const ext = path.extname(filePath).toLowerCase();
  const text = fs.readFileSync(filePath, 'utf-8');

  let rows = [];
  if (ext === '.json') {
    const data = JSON.parse(text.replace(/^\uFEFF/, ''));
    rows = Array.isArray(data) ? data : (data.entries || []);
  } else {
    // CSV 或其它默认按 CSV 解析
    rows = parseCsv(text).rows;
  }
  if (rows.length === 0) {
    console.error('❌ 无数据行');
    process.exit(1);
  }

  console.log(`读取 ${rows.length} 行`);

  const seen = new Map(getAll().map((e) => [`${e.lang}::${String(e.keyword).toLowerCase().trim()}`, e]));
  const toAdd = [];
  let skipped = 0;
  let missingKw = 0;

  for (const r of rows) {
    const keyword = (r.keyword || '').trim();
    const lang = (r.lang || '').trim();
    if (!keyword) { missingKw++; continue; }
    if (!LANGS.includes(lang)) {
      console.error(`  ⚠️ 跳过非法语言 "${lang}" 的词: ${keyword}`);
      missingKw++;
      continue;
    }
    const key = `${lang}::${keyword.toLowerCase()}`;
    if (seen.has(key)) { skipped++; continue; }
    seen.set(key, {});

    const entry = {
      keyword,
      lang,
      intent: INTENTS.includes(r.intent) ? r.intent : 'commercial',
      entity: ENTITIES.includes(r.entity) ? r.entity : 'uncategorized',
      targetUrl: r.targetUrl || undefined,
      anchorText: r.anchorText || keyword,
      note: r.note || 'imported',
      source: SOURCES.includes(r.source) ? r.source : 'manual',
      status: STATUSES.includes(r.status) ? r.status : 'planned',
      volume: r.volume !== undefined && r.volume !== '' ? (Number.isNaN(Number(r.volume)) ? null : Number(r.volume)) : null,
      difficulty: r.difficulty !== undefined && r.difficulty !== '' ? (Number.isNaN(Number(r.difficulty)) ? null : Number(r.difficulty)) : null,
    };
    toAdd.push(entry);
  }

  if (toAdd.length === 0) {
    console.log(`✅ 无新词可导入（已存在 ${skipped}，缺关键字 ${missingKw}）`);
    return;
  }

  const written = upsertMany(toAdd);
  console.log(`✅ 导入 ${written} 条新词`);
  console.log(`   已存在跳过: ${skipped}  缺关键字/非法语言: ${missingKw}`);
}

async function main() {
  const args = parseArgs(process.argv.slice(2));

  // 审计
  if (args.audit) {
    audit();
    return;
  }

  // 回填
  if (args['import-csv']) {
    await importCsv(args['import-csv']);
    return;
  }

  // 导入新词
  if (args['import-new']) {
    importNew(args['import-new']);
    return;
  }

  // 校验
  if (args.lang && !LANGS.includes(args.lang)) {
    console.error(`❌ 非法 --lang="${args.lang}"。可选: ${LANGS.join(', ')}`);
    process.exit(1);
  }
  if (args.intent && !INTENTS.includes(args.intent)) {
    console.error(`❌ 非法 --intent="${args.intent}"。可选: ${INTENTS.join(', ')}`);
    process.exit(1);
  }
  if (args.entity && !ENTITIES.includes(args.entity)) {
    console.error(`❌ 非法 --entity="${args.entity}"。可选: ${ENTITIES.join(', ')}`);
    process.exit(1);
  }
  if (args.status && !STATUSES.includes(args.status)) {
    console.error(`❌ 非法 --status="${args.status}"。可选: ${STATUSES.join(', ')}`);
    process.exit(1);
  }
  if (args.source && !SOURCES.includes(args.source)) {
    console.error(`❌ 非法 --source="${args.source}"。可选: ${SOURCES.join(', ')}`);
    process.exit(1);
  }
  if (args['set-status'] && !STATUSES.includes(args['set-status'])) {
    console.error(`❌ 非法 --set-status="${args['set-status']}"。可选: ${STATUSES.join(', ')}`);
    process.exit(1);
  }

  // 写操作：批量启用 / 更新
  if (args['set-status'] || args['set-url']) {
    const filters = {};
    for (const key of ['lang', 'intent', 'entity', 'status', 'source', 'targetUrl', 'id']) {
      if (args[key]) filters[key] = args[key];
    }
    if (Object.keys(filters).length === 0 && !args.all) {
      console.error('❌ 写操作需指定筛选条件（--lang/--intent/--id/--all 等），避免误改全部');
      process.exit(1);
    }
    const patch = {};
    if (args['set-status']) patch.status = args['set-status'];
    if (args['set-url']) patch.targetUrl = args['set-url'];
    const n = updateByFilter(filters, patch);
    console.log(`✅ 已更新 ${n} 条 → ${JSON.stringify(patch)}`);
    return;
  }

  // 计数
  if (args.count) {
    const c = countByLang();
    console.log('各语言条目数:');
    for (const lang of LANGS) {
      console.log(`  ${lang}: ${c[lang] || 0}`);
    }
    console.log(`  总计: ${getAll().length}`);
    return;
  }

  // 查询
  let rows;
  if (args.all) {
    rows = getAll();
  } else {
    const filters = {};
    for (const key of ['lang', 'intent', 'entity', 'status', 'source', 'targetUrl', 'id']) {
      if (args[key]) filters[key] = args[key];
    }
    rows = query(filters);
    if (Object.keys(filters).length === 0) rows = getAll();
  }

  if (args.format === 'json') {
    console.log(JSON.stringify(rows, null, 2));
    return;
  }

  if (args.export) {
    const csv = toCsv(rows);
    fs.writeFileSync(args.export, csv, 'utf-8');
    console.log(`✅ 已导出 ${rows.length} 条到 ${args.export}`);
    return;
  }

  if (args.format === 'csv') {
    console.log(toCsv(rows));
    return;
  }

  console.log(toTable(rows));
  console.log(`\n(共 ${rows.length} 条)`);
}

main();
