/**
 * audit-entity-coverage.mjs
 * =====================================================================
 * 审计实体覆盖率 —— GEO Cluster×Inbound 的可观测层。
 *
 * 输入：
 *   - data/entities/entity-registry.json （由 build-entity-registry.mjs 生成）
 *   - src/pages/<all>.astro + components （站点所有页面源码）
 *
 * 输出：
 *   - data/entities/coverage-report.json   （机器可读）
 *   - data/entities/coverage-report.md     （人可读，按类别分组）
 *
 * 指标：
 *   - mentions_count : 实体别名在页面文本中出现的次数（去重后）
 *   - link_count     : 指向 entity.page_url 的内部链接数
 *   - jsonld_refs    : JSON-LD 中引用此实体的次数
 *   - coverage_score : 0-100 综合分（mentions*0.4 + links*0.4 + jsonld*0.2）
 *
 * 用法：
 *   node scripts/audit-entity-coverage.mjs
 *   node scripts/audit-entity-coverage.mjs --top 20   只显示 top N
 *   node scripts/audit-entity-coverage.mjs --missing  只显示未被引用的实体
 *
 * 设计原则：
 *   - 只读不改（不写 src/pages）
 *   - 纯文本匹配（不解析 Astro / TS 语法树），避免 AST 复杂度
 *   - 输出固定可复现（按 id 排序）
 * =====================================================================
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');

const ARGS = process.argv.slice(2);
const FLAGS = {
  top: (() => {
    const i = ARGS.indexOf('--top');
    return i >= 0 ? parseInt(ARGS[i + 1], 10) || 10 : null;
  })(),
  missing: ARGS.includes('--missing'),
  json: ARGS.includes('--json'),
  markdown: !ARGS.includes('--no-md'),
};

const PATHS = {
  REGISTRY: path.join(ROOT, 'data', 'entities', 'entity-registry.json'),
  PAGES_DIR: path.join(ROOT, 'src', 'pages'),
  COMPONENTS_DIR: path.join(ROOT, 'src', 'components'),
  OUT_DIR: path.join(ROOT, 'data', 'entities'),
  OUT_JSON: path.join(ROOT, 'data', 'entities', 'coverage-report.json'),
  OUT_MD: path.join(ROOT, 'data', 'entities', 'coverage-report.md'),
};

// ─────────────────────────────────────────────────────────────────────
// 文件收集
// ─────────────────────────────────────────────────────────────────────
function walk(dir, exts = ['.astro', '.ts', '.tsx', '.md', '.mdx']) {
  const out = [];
  if (!fs.existsSync(dir)) return out;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      // 跳过 node_modules、dist、.astro 等构建产物
      if (['node_modules', 'dist', '.astro', '.git', 'cache'].includes(entry.name)) continue;
      out.push(...walk(full, exts));
    } else if (exts.some((e) => entry.name.endsWith(e))) {
      out.push(full);
    }
  }
  return out;
}

// ─────────────────────────────────────────────────────────────────────
// 文本规范化（同 build 脚本）
// ─────────────────────────────────────────────────────────────────────
function norm(s) {
  return String(s || '').toLowerCase().trim();
}

function escapeRegex(s) {
  return String(s).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

// ─────────────────────────────────────────────────────────────────────
// 为单个实体在所有页面中搜索
// ─────────────────────────────────────────────────────────────────────
function auditEntity(entity, allFiles, fileContents) {
  // 构造匹配模式：canonical_name + aliases（按长度降序，避免短词先匹配）
  const terms = [entity.canonical_name, ...(entity.aliases || [])]
    .map((t) => String(t || '').trim())
    .filter((t) => t.length >= 3) // 太短的（< 3 字符）噪音太大
    .sort((a, b) => b.length - a.length);
  // 去重（lower-case）
  const seen = new Set();
  const unique = terms.filter((t) => {
    const k = norm(t);
    if (seen.has(k)) return false;
    seen.add(k);
    return true;
  });
  if (unique.length === 0) {
    return { mentions_count: 0, link_count: 0, jsonld_refs: 0, files: [] };
  }

  const pageUrlEsc = escapeRegex(entity.page_url);
  // 链接模式：href="/materials/grade-5/" 或 href="/materials/grade-5"
  const linkPatterns = [
    new RegExp(`href=["']${pageUrlEsc}["']`, 'g'),
    new RegExp(`href=["']${pageUrlEsc.replace(/\/$/, '')}["']`, 'g'),
  ];
  // JSON-LD @id 引用模式
  // - 原 cnc.bozemetal.com <page_url> 形式（向后兼容）
  // - "url" 字段含 page_url
  // - canonical entity @id 公式: https://www.bozemetal.com<page_url>#entity
  //   同时兼容运行时形态（refsFromIds 输出）与源码 template 字面量形态
  //   （例如 GradeStructuredData.astro 中的 `${gradeKey}/#entity`）
  // - bare entity.id 字符串字面量（如 MENTIONED_ENTITY_IDS / ENTITY_ID 常量）
  const pageUrlNoSlash = pageUrlEsc.replace(/\/$/, '');
  const jsonldPatterns = [
    new RegExp(`"@id"\\s*:\\s*["']${escapeRegex('https://cnc.bozemetal.com') + pageUrlEsc}["']`, 'g'),
    new RegExp(`"url"\\s*:\\s*["']${pageUrlEsc}["']`, 'g'),
    new RegExp(
      `["']https://www\\.bozemetal\\.com${pageUrlNoSlash}/(?:[^"']*?#entity)["']`,
      'g'
    ),
    new RegExp(`["']${escapeRegex(entity.id)}["']`, 'g'),
  ];

  let totalMentions = 0;
  let totalLinks = 0;
  let totalJsonLd = 0;
  const fileHits = [];

  for (const f of allFiles) {
    const content = fileContents.get(f);
    if (!content) continue;

    let mCount = 0;
    const matchedTerms = [];
    for (const term of unique) {
      const re = new RegExp(`\\b${escapeRegex(term)}\\b`, 'gi');
      const hits = content.match(re);
      if (hits && hits.length > 0) {
        mCount += hits.length;
        matchedTerms.push({ term, count: hits.length });
      }
    }

    let lCount = 0;
    for (const re of linkPatterns) {
      const hits = content.match(re);
      if (hits) lCount += hits.length;
    }

    let jCount = 0;
    for (const re of jsonldPatterns) {
      const hits = content.match(re);
      if (hits) jCount += hits.length;
    }

    if (mCount + lCount + jCount > 0) {
      totalMentions += mCount;
      totalLinks += lCount;
      totalJsonLd += jCount;
      fileHits.push({
        file: path.relative(ROOT, f),
        mentions: mCount,
        links: lCount,
        jsonld: jCount,
        matched_terms: matchedTerms.slice(0, 5),
      });
    }
  }

  // 综合分（0-100）
  const score = Math.min(100, Math.round(totalMentions * 0.4 + totalLinks * 5 + totalJsonLd * 3));

  return {
    mentions_count: totalMentions,
    link_count: totalLinks,
    jsonld_refs: totalJsonLd,
    coverage_score: score,
    files_hit: fileHits.length,
    top_files: fileHits.sort((a, b) => (b.mentions + b.links * 5) - (a.mentions + a.links * 5)).slice(0, 3),
  };
}

// ─────────────────────────────────────────────────────────────────────
// 主流程
// ─────────────────────────────────────────────────────────────────────
function main() {
  console.log('▶ audit-entity-coverage.mjs');

  if (!fs.existsSync(PATHS.REGISTRY)) {
    console.error(`✗ registry missing: ${PATHS.REGISTRY}`);
    console.error('  → run: node scripts/build-entity-registry.mjs');
    process.exit(1);
  }

  const registry = JSON.parse(fs.readFileSync(PATHS.REGISTRY, 'utf-8'));
  console.log(`  registry: ${registry.entities.length} entities`);

  // 收集所有页面与组件文件
  const pageFiles = walk(PATHS.PAGES_DIR);
  const compFiles = walk(PATHS.COMPONENTS_DIR);
  const allFiles = [...pageFiles, ...compFiles];
  console.log(`  files scanned: ${allFiles.length} (${pageFiles.length} pages + ${compFiles.length} components)`);

  // 预读文件内容（小项目 IO 可接受）
  console.log('  · loading files …');
  const fileContents = new Map();
  for (const f of allFiles) {
    try {
      fileContents.set(f, fs.readFileSync(f, 'utf-8'));
    } catch (e) {
      // skip
    }
  }

  // 审计每个实体
  console.log('  · auditing …');
  const results = [];
  let i = 0;
  for (const e of registry.entities) {
    const cov = auditEntity(e, allFiles, fileContents);
    results.push({ entity: e, coverage: cov });
    if (++i % 200 === 0) console.log(`    ${i}/${registry.entities.length}`);
  }

  // 汇总统计
  const totalEntities = results.length;
  const zeroCoverage = results.filter((r) => r.coverage.mentions_count === 0 && r.coverage.link_count === 0).length;
  const linkedCount = results.filter((r) => r.coverage.link_count > 0).length;
  const jsonLdCount = results.filter((r) => r.coverage.jsonld_refs > 0).length;
  const avgScore = Math.round(
    results.reduce((s, r) => s + r.coverage.coverage_score, 0) / Math.max(1, totalEntities)
  );

  // 按类别聚合
  const byCategory = {};
  for (const r of results) {
    const cat = r.entity.category;
    if (!byCategory[cat]) byCategory[cat] = { total: 0, with_links: 0, avg_score: 0, _sum: 0 };
    byCategory[cat].total++;
    byCategory[cat]._sum += r.coverage.coverage_score;
    if (r.coverage.link_count > 0) byCategory[cat].with_links++;
  }
  for (const c of Object.values(byCategory)) c.avg_score = Math.round(c._sum / c.total);

  const report = {
    meta: {
      generated_at: new Date().toISOString(),
      total_entities: totalEntities,
      zero_coverage: zeroCoverage,
      with_internal_links: linkedCount,
      with_jsonld_refs: jsonLdCount,
      avg_coverage_score: avgScore,
      files_scanned: allFiles.length,
      by_category: Object.fromEntries(
        Object.entries(byCategory).map(([k, v]) => [k, { total: v.total, with_links: v.with_links, avg_score: v.avg_score }])
      ),
    },
    results: results
      .map((r) => ({
        id: r.entity.id,
        category: r.entity.category,
        canonical_name: r.entity.canonical_name,
        page_url: r.entity.page_url,
        ...r.coverage,
      }))
      .sort((a, b) => b.coverage_score - a.coverage_score),
  };

  // 写出 JSON
  fs.writeFileSync(PATHS.OUT_JSON, JSON.stringify(report, null, 2) + '\n', 'utf-8');
  console.log(`\n✓ coverage-report.json written`);
  console.log(`  total entities       : ${totalEntities}`);
  console.log(`  zero coverage        : ${zeroCoverage} (${Math.round(zeroCoverage / totalEntities * 100)}%)`);
  console.log(`  with internal links  : ${linkedCount} (${Math.round(linkedCount / totalEntities * 100)}%)`);
  console.log(`  with JSON-LD refs    : ${jsonLdCount}`);
  console.log(`  avg coverage score   : ${avgScore}/100`);
  console.log(`  by category:`);
  for (const [cat, v] of Object.entries(byCategory).sort()) {
    console.log(`    - ${cat.padEnd(12)} total=${v.total}  linked=${v.with_links}  avg_score=${v.avg_score}`);
  }

  // 写出 Markdown
  if (FLAGS.markdown) writeMarkdown(report);
}

function writeMarkdown(report) {
  const { meta, results } = report;

  let md = `# Entity Coverage Report\n\n`;
  md += `> Generated: ${meta.generated_at}  \n`;
  md += `> Source registry: \`data/entities/entity-registry.json\` (${meta.total_entities} entities)  \n`;
  md += `> Files scanned: ${meta.files_scanned} (\`src/pages\` + \`src/components\`)\n\n`;

  md += `## Summary\n\n`;
  md += `| Metric | Value |\n|---|---|\n`;
  md += `| Total entities | ${meta.total_entities} |\n`;
  md += `| Zero coverage (no mentions/links) | ${meta.zero_coverage} (${Math.round(meta.zero_coverage / meta.total_entities * 100)}%) |\n`;
  md += `| With internal links | ${meta.with_internal_links} (${Math.round(meta.with_internal_links / meta.total_entities * 100)}%) |\n`;
  md += `| With JSON-LD refs | ${meta.with_jsonld_refs} |\n`;
  md += `| Avg coverage score | ${meta.avg_coverage_score}/100 |\n\n`;

  md += `## By Category\n\n`;
  md += `| Category | Total | Linked | Avg Score |\n|---|---:|---:|---:|\n`;
  for (const [cat, v] of Object.entries(meta.by_category).sort()) {
    md += `| ${cat} | ${v.total} | ${v.with_links} | ${v.avg_score} |\n`;
  }
  md += '\n';

  // 过滤
  let display = results;
  if (FLAGS.missing) {
    display = results.filter((r) => r.mentions_count === 0 && r.link_count === 0);
    md += `## 🔴 Entities With Zero Coverage (${display.length})\n\n`;
  } else if (FLAGS.top) {
    display = results.slice(0, FLAGS.top);
    md += `## Top ${FLAGS.top} Entities by Coverage Score\n\n`;
  } else {
    display = results.slice(0, 50);
    md += `## Top 50 Entities by Coverage Score\n\n`;
  }

  md += `| Rank | ID | Category | Canonical | Page | Mentions | Links | JSON-LD | Score |\n`;
  md += `|---:|---|---|---|---:|---:|---:|---:|---:|\n`;
  display.forEach((r, i) => {
    md += `| ${i + 1} | \`${r.id}\` | ${r.category} | ${r.canonical_name.slice(0, 40)} | ${r.page_url} | ${r.mentions_count} | ${r.link_count} | ${r.jsonld_refs} | **${r.coverage_score}** |\n`;
  });

  fs.writeFileSync(PATHS.OUT_MD, md, 'utf-8');
  console.log(`✓ coverage-report.md written (${md.length} bytes)`);
}

main();
