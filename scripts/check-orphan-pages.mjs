/**
 * scripts/check-orphan-pages.mjs — Site-wide orphan page diagnostic tool (v2)
 *
 * Upgrades from v1:
 *   - CLI flags: --level {strict, warn, geo}, --format {console, json, md}, --path <prefix>
 *   - Severity grading: CRITICAL (0), WARNING (1-9), CLUSTER_WEAK (>=10 but cluster<5), OK
 *   - Cluster auto-detection (cluster > category > tags > slug topic)
 *   - Path-prefix aggregation (e.g., /blog/, /materials/, /equipment/)
 *   - Multi-format output: console (default), JSON, Markdown
 *
 * Original v1 features preserved:
 *   - WHITELIST_RULES (dynamic-route, system, legal)
 *   - policyViolations (CJK / ja-kana detection)
 *   - Internal link extractor (Markdown, HTML, JSX, data, localizePath)
 *   - keywordMap from astro.config.mjs
 *
 * Usage:
 *   node scripts/check-orphan-pages.mjs                       # default (strict, console)
 *   node scripts/check-orphan-pages.mjs --level=warn          # include 1-9 incoming
 *   node scripts/check-orphan-pages.mjs --level=geo           # + GEO cluster analysis
 *   node scripts/check-orphan-pages.mjs --format=json         # full JSON output
 *   node scripts/check-orphan-pages.mjs --format=md           # Markdown report
 *   node scripts/check-orphan-pages.mjs --path=blog           # filter to /blog/
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { glob } from 'glob';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');

// ─── CLI args ─────────────────────────────────────────
const args = process.argv.slice(2);
const getArg = (flag, fallback) => {
  // Check --flag=value form
  for (const arg of args) {
    if (arg.startsWith(flag + '=')) return arg.slice(flag.length + 1);
  }
  // Check --flag value form
  const i = args.indexOf(flag);
  return i >= 0 && i + 1 < args.length ? args[i + 1] : fallback;
};
const LEVEL = getArg('--level', 'strict');           // strict|warn|geo
const FORMAT = getArg('--format', 'console');         // console|json|md
const PATH_FILTER = getArg('--path', null);           // e.g., 'blog'

// ─── 1. keywordMap from astro.config.mjs ─────────────
function readKeywordMap() {
  const configPath = path.resolve(ROOT, 'astro.config.mjs');
  const configContent = fs.readFileSync(configPath, 'utf-8');
  const existing = {};
  const regex = /['"`]([^'"`]+)['"`]\s*:\s*(?:\{[^}]*href:\s*['"`]([^'"`]+)['"`][^}]*\}|['"`]([^'"`]+)['"`])/g;
  let match;
  while ((match = regex.exec(configContent)) !== null) {
    const href = match[2] || match[3];
    if (href) existing[href] = (existing[href] || 0) + 1;
  }
  return existing;
}

// ─── 2. Unified link extractor ────────────────────────
function extractLinks(content) {
  const links = new Set();
  const patterns = [
    /\]\((\/[^)\s]+)\)/g,                              // Markdown: [text](/path)
    /^\[.*?\]:\s*(\/[^\s]+)/gm,                        // Markdown ref: [text]: /path
    /<a[^>]*href="(\/[^"]+)"/g,                        // HTML dq: <a href="...">
    /<a[^>]*href='(\/[^']+)'/g,                        // HTML sq: <a href='...'>
    /<a[^>]*href=\{["']?(\/[^"'\s}]+)["']?\}/g,        // JSX/Astro: <a href={...}>
    /href:\s*['"`](\/[^'"`\s]+)['"`]/g,                // Data: href: "/path"
    /localizePath\(\s*['"`](\/[^'"`\s]+)['"`]/g,       // localizePath('/path', ...)
  ];
  for (const p of patterns) {
    for (const m of content.matchAll(p)) {
      let url = m[1];
      if (!url || url.startsWith('//') || url.startsWith('http')) continue;
      url = url.replace(/\/$/, '').replace(/\/index\.html$/, '');
      if (url) links.add(url);
    }
  }
  return links;
}

async function scanInternalLinks(dirPatterns) {
  const files = [];
  for (const pattern of dirPatterns) {
    const matches = await glob(pattern, { cwd: ROOT, nodir: true });
    for (const match of matches) files.push(path.resolve(ROOT, match));
  }
  const internalLinks = {};
  for (const file of files) {
    let content;
    try { content = fs.readFileSync(file, 'utf-8'); } catch { continue; }
    for (const url of extractLinks(content)) {
      internalLinks[url] = (internalLinks[url] || 0) + 1;
    }
  }
  return internalLinks;
}

// ─── 3. contentUrlMap (build URL → file for content/) ─
async function buildContentUrlMap() {
  const urlToFile = {};
  const contentFiles = await glob('src/content/**/*.md', { cwd: ROOT, nodir: true });
  for (const file of contentFiles) {
    const content = fs.readFileSync(path.resolve(ROOT, file), 'utf-8');
    const slugMatch = content.match(/^---\n[\s\S]*?slug:\s*["']?([^\s"']+)["']?/m);
    const baseName = path.basename(file, '.md');
    const relDir = path.dirname(file).replace(/\\/g, '/');
    let urlPath = '';
    // Detect content subdirectory → URL prefix mapping
    if (relDir.includes('/blog')) urlPath = `/blog/${slugMatch ? slugMatch[1] : baseName}`;
    else if (relDir.includes('/products')) urlPath = `/products/${slugMatch ? slugMatch[1] : baseName}`;
    else if (relDir.includes('/materials')) urlPath = `/materials/${slugMatch ? slugMatch[1] : baseName}`;
    else if (relDir.includes('/industries')) urlPath = `/industries/${slugMatch ? slugMatch[1] : baseName}`;
    else if (relDir.includes('/equipment')) urlPath = `/equipment/${slugMatch ? slugMatch[1] : baseName}`;
    else if (relDir.includes('/tools')) urlPath = `/tools/${slugMatch ? slugMatch[1] : baseName}`;
    else if (relDir.includes('/capabilities')) urlPath = `/capabilities/${slugMatch ? slugMatch[1] : baseName}`;
    else if (relDir.includes('/parts')) urlPath = `/parts/${slugMatch ? slugMatch[1] : baseName}`;
    else if (relDir.includes('/case-studies')) urlPath = `/case-studies/${slugMatch ? slugMatch[1] : baseName}`;
    else if (relDir.includes('/resources')) urlPath = `/resources/${slugMatch ? slugMatch[1] : baseName}`;
    else if (relDir.includes('/use-cases')) urlPath = `/use-cases/${slugMatch ? slugMatch[1] : baseName}`;
    else if (relDir.includes('/pages')) urlPath = baseName === 'home' ? '/' : `/${slugMatch ? slugMatch[1] : baseName}`;
    if (urlPath) urlToFile[urlPath] = file;
  }
  return urlToFile;
}

// ─── 4. pageUrlMap (from src/pages/) ──────────────────
async function buildPageUrlMap() {
  const pageUrls = new Set();
  const pageFiles = await glob('src/pages/**/*.astro', { cwd: ROOT, nodir: true });
  for (const file of pageFiles) {
    let url = path.dirname(file).replace(/\\/g, '/').replace(/^src\/pages/, '');
    const baseName = path.basename(file, '.astro');
    if (baseName === 'index') url = url === '' ? '/' : url + '/';
    else if (baseName === '[...slug]') continue;
    else url = url + '/' + baseName + '/';
    pageUrls.add(url.replace(/\/+/g, '/'));
  }
  return pageUrls;
}

// ─── 5. Whitelist rules ──────────────────────────────
const WHITELIST_RULES = [
  { pattern: /\[\s*(lang|slug|page|id)\s*\]/i, reason: 'dynamic-route' },
  { pattern: /^\/404\/$/, reason: 'system-404' },
  { pattern: /^\/thank-you\/$/, reason: 'system-thank-you' },
  { pattern: /^\/theme-demo\/$/, reason: 'system-theme-demo' },
  { pattern: /^\/(cookie-policy|privacy-policy|terms-of-service)\/$/, reason: 'legal-boilerplate' },
];
function getWhitelistReason(url) {
  for (const rule of WHITELIST_RULES) {
    if (rule.pattern.test(url)) return rule.reason;
  }
  return null;
}

// ─── 6. Policy violations (CJK / ja-kana) ────────────
const ZH_REGEX = /[\u4e00-\u9fff\u3000-\u303f\uff00-\uffef]/g;
const JA_KANA_REGEX = /[\u3040-\u309f\u30a0-\u30ff]/;
const CJK_MIN_CHARS = 50;
const CJK_MIN_RATIO = 0.05;
const CJK_HARD_MIN = 50;
function detectChineseContent(filePath) {
  try {
    const raw = fs.readFileSync(filePath, 'utf8');
    if (JA_KANA_REGEX.test(raw)) return null;
    const cjk = raw.match(ZH_REGEX);
    if (!cjk || cjk.length < CJK_MIN_CHARS) return null;
    const nonWsLen = raw.replace(/\s/g, '').length;
    const ratio = cjk.length / Math.max(nonWsLen, 1);
    if (ratio < CJK_MIN_RATIO && cjk.length < CJK_HARD_MIN) return null;
    return { cjkChars: cjk.length, ratio };
  } catch { return null; }
}

// ─── 7. Cluster auto-detection ───────────────────────
const CATEGORY_NORM = {
  'Subsea CNC': 'Subsea',
  'Subsea Components': 'Subsea',
  'Subsea Machining': 'Subsea',
  'Marine Machining': 'Marine',
  'Marine Applications': 'Marine',
};

function parseFrontmatter(filePath) {
  try {
    const c = fs.readFileSync(filePath, 'utf8');
    const fmMatch = c.match(/^---\n([\s\S]*?)\n---/);
    if (!fmMatch) return {};
    const fmBlock = fmMatch[1];
    const fm = {};
    const cluMatch = fmBlock.match(/^cluster:\s*["']?([^"'\n]+)["']?/m);
    if (cluMatch) fm.cluster = cluMatch[1].trim();
    const catMatch = fmBlock.match(/^category:\s*["']?([^"'\n]+)["']?/m);
    if (catMatch) fm.category = catMatch[1].trim();
    const tagsMatch = fmBlock.match(/^tags:\s*\[(.*?)\]/m);
    if (tagsMatch) {
      fm.tags = tagsMatch[1].split(',').map(t => t.trim().replace(/^["']|["']$/g, '')).filter(Boolean);
    }
    return fm;
  } catch { return {}; }
}

function tagsToCluster(tags) {
  if (!tags || tags.length === 0) return null;
  const sorted = [...tags].sort((a, b) => a.length - b.length);
  return sorted[0];
}

function slugToCluster(slug) {
  const STOPWORDS = new Set(['the','a','an','how','what','why','is','are','to','in','for','of','and','or','guide','explained','introduction','overview','vs','comparison','best','practices','complete','comprehensive','understanding','basics','ultimate']);
  const words = slug.split('-').filter(w => !STOPWORDS.has(w) && w.length > 1);
  if (words.length === 0) return null;
  const KEY_TERMS = ['titanium','grade','astm','ams','aerospace','medical','subsea','semiconductor','marine','cnc','edm','welding','casting','machining','forming','fabrication','additive','surface','treatment','equipment','tools','parts','capabilities','case-study','case','study','industry','industries','application','process'];
  for (const term of KEY_TERMS) {
    if (words.includes(term)) return term;
  }
  return words[0] || null;
}

function detectCluster(frontmatter, slug) {
  if (frontmatter.cluster) return String(frontmatter.cluster).trim();
  if (frontmatter.category) {
    const cat = String(frontmatter.category).trim();
    return CATEGORY_NORM[cat] || cat;
  }
  if (frontmatter.tags && frontmatter.tags.length > 0) {
    const t = tagsToCluster(frontmatter.tags);
    if (t) return t;
  }
  return slugToCluster(slug) || 'unknown';
}

function getPathPrefix(url) {
  const norm = url.replace(/^\//, '');
  return norm.split('/')[0] || '/';
}

// Known ISO 639-1 language codes (subset relevant to this site)
const KNOWN_LANG_CODES = new Set([
  'en','pt','es','de','fr','it','ja','ko','ru','zh','ar','nl','pl','sv','th','tr','vi','id','hi','cs','fi','el','he','hu','no','da','uk','ro','sk','bg','hr','lt','lv','et','sl','sr','mk','bs','ca','gl','eu','ga','mt','sw','am','fa','ur','bn','ta','te','ml','kn','gu','pa','mr','si','my','km','lo','ne','ps','ku','az','hy','ka','kk','ky','uz','mn','af',
]);
function getLang(url) {
  if (!url.startsWith('/blog/')) return 'en';
  const m = url.match(/^\/blog\/([a-z]{2})-/);
  if (!m) return 'en';
  return KNOWN_LANG_CODES.has(m[1]) ? m[1] : 'en';
}

// ─── Main ─────────────────────────────────────────────
async function main() {
  try {
    if (FORMAT === 'console') {
      console.log(`=== Orphan Page Detection (level=${LEVEL}${PATH_FILTER ? `, path=${PATH_FILTER}` : ''}) ===\n`);
    }

    // 1. keywordMap
    const keywordMap = readKeywordMap();

    // 2-3. Internal links
    const contentLinks = await scanInternalLinks([
      'src/content/**/*.md',
      'src/content/**/*.mdx',
    ]);
    const pageLinks = await scanInternalLinks([
      'src/pages/**/*.astro',
      'src/components/**/*.astro',
      'src/layouts/**/*.astro',
      'src/**/*.ts',
      'src/**/*.tsx',
      'src/**/*.jsx',
    ]);
    const allIncomingLinks = { ...keywordMap };
    for (const [url, count] of Object.entries(contentLinks)) {
      allIncomingLinks[url] = (allIncomingLinks[url] || 0) + count;
    }
    for (const [url, count] of Object.entries(pageLinks)) {
      allIncomingLinks[url] = (allIncomingLinks[url] || 0) + count;
    }

    // 4. Build known URLs
    const contentUrlMap = await buildContentUrlMap();
    const pageUrlSet = await buildPageUrlMap();
    const allKnownUrls = new Set([...Object.keys(contentUrlMap), ...pageUrlSet]);

    // 5. Classify pages
    const whitelisted = [];
    const whitelistByReason = {};
    const policyViolations = [];
    const pageRecords = [];

    for (const url of allKnownUrls) {
      const reason = getWhitelistReason(url);
      const incomingCount = allIncomingLinks[url] || 0;
      const sourceFile = contentUrlMap[url] || null;

      if (reason) {
        whitelisted.push(url);
        (whitelistByReason[reason] = whitelistByReason[reason] || []).push(url);
        continue;
      }

      if (sourceFile) {
        const cjk = detectChineseContent(sourceFile);
        if (cjk) {
          policyViolations.push({ url, ...cjk, file: sourceFile.replace(/\\/g, '/') });
          continue;
        }
      }

      let severity;
      if (incomingCount === 0) severity = 'CRITICAL';
      else if (incomingCount < 10) severity = 'WARNING';
      else severity = 'OK';

      const pathPrefix = getPathPrefix(url);
      const lang = getLang(url);
      const slug = url.split('/').filter(Boolean).pop() || '';
      let cluster = 'unknown';
      let fm = {};
      if (sourceFile) {
        fm = parseFrontmatter(sourceFile);
        cluster = detectCluster(fm, slug);
      } else {
        cluster = slugToCluster(slug) || 'page';
      }

      const record = {
        url, severity, incomingCount,
        cluster, fm,
        pathPrefix, lang,
        sourceFile: sourceFile ? sourceFile.replace(/\\/g, '/') : null,
      };
      pageRecords.push(record);
    }

    // 6. GEO cluster inbound analysis
    if (LEVEL === 'geo') {
      const clusterGroups = {};
      for (const r of pageRecords) {
        if (!clusterGroups[r.cluster]) clusterGroups[r.cluster] = [];
        clusterGroups[r.cluster].push(r);
      }
      for (const r of pageRecords) {
        if (r.severity === 'OK') {
          const sameCluster = clusterGroups[r.cluster] || [];
          const otherClusterPages = sameCluster.filter(p => p.url !== r.url);
          const clusterTotal = otherClusterPages.reduce((sum, p) => sum + p.incomingCount, 0);
          r.clusterInboundCount = clusterTotal;
          r.clusterPageCount = sameCluster.length;
          if (clusterTotal < 5) {
            r.severity = 'CLUSTER_WEAK';
          }
        }
      }
    }

    // 7. Determine orphans per level
    const orphans = [];
    for (const r of pageRecords) {
      if (LEVEL === 'strict' && r.severity === 'CRITICAL') orphans.push(r);
      else if (LEVEL === 'warn' && (r.severity === 'CRITICAL' || r.severity === 'WARNING')) orphans.push(r);
      else if (LEVEL === 'geo' && r.severity !== 'OK') orphans.push(r);
    }

    // 8. Filter by path
    let filteredRecords = pageRecords;
    let filteredOrphans = orphans;
    if (PATH_FILTER) {
      const p = PATH_FILTER.replace(/^\//, '');
      filteredRecords = pageRecords.filter(r => r.pathPrefix === p || r.url.startsWith('/' + p));
      filteredOrphans = orphans.filter(r => r.pathPrefix === p || r.url.startsWith('/' + p));
    }

    // 9. Path prefix aggregation
    const byPathPrefix = {};
    for (const r of filteredRecords) {
      const prefix = r.pathPrefix;
      if (!byPathPrefix[prefix]) byPathPrefix[prefix] = { total: 0, critical: 0, warning: 0, clusterWeak: 0, ok: 0 };
      byPathPrefix[prefix].total++;
      if (r.severity === 'CRITICAL') byPathPrefix[prefix].critical++;
      else if (r.severity === 'WARNING') byPathPrefix[prefix].warning++;
      else if (r.severity === 'CLUSTER_WEAK') byPathPrefix[prefix].clusterWeak++;
      else byPathPrefix[prefix].ok++;
    }

    // 10. Cluster aggregation
    const byCluster = {};
    for (const r of filteredRecords) {
      const c = r.cluster;
      if (!byCluster[c]) byCluster[c] = { total: 0, critical: 0, warning: 0, clusterWeak: 0, ok: 0, totalIncoming: 0 };
      byCluster[c].total++;
      byCluster[c].totalIncoming += r.incomingCount;
      if (r.severity === 'CRITICAL') byCluster[c].critical++;
      else if (r.severity === 'WARNING') byCluster[c].warning++;
      else if (r.severity === 'CLUSTER_WEAK') byCluster[c].clusterWeak++;
      else byCluster[c].ok++;
    }
    for (const c of Object.keys(byCluster)) {
      byCluster[c].avgIncoming = byCluster[c].total > 0 ? +(byCluster[c].totalIncoming / byCluster[c].total).toFixed(2) : 0;
    }

    // 11. Summary
    const summary = {
      total: filteredRecords.length,
      critical: filteredRecords.filter(r => r.severity === 'CRITICAL').length,
      warning: filteredRecords.filter(r => r.severity === 'WARNING').length,
      clusterWeak: filteredRecords.filter(r => r.severity === 'CLUSTER_WEAK').length,
      ok: filteredRecords.filter(r => r.severity === 'OK').length,
    };
    summary.whitelisted = whitelisted.length;
    summary.policyViolations = policyViolations.length;
    if (summary.total > 0) {
      summary.coverage = ((summary.ok / summary.total) * 100).toFixed(1) + '%';
      summary.effectiveCoverage = (((summary.ok + summary.whitelisted + summary.policyViolations) / summary.total) * 100).toFixed(1) + '%';
    }

    const fullReport = {
      generatedAt: new Date().toISOString(),
      level: LEVEL,
      pathFilter: PATH_FILTER,
      summary,
      byPathPrefix,
      byCluster,
      orphanPages: filteredOrphans,
      whitelisted: whitelistByReason,
      whitelistedCount: whitelisted.length,
      policyViolations,
      topIncoming: filteredRecords.sort((a, b) => b.incomingCount - a.incomingCount).slice(0, 10).map(r => ({
        url: r.url, count: r.incomingCount, cluster: r.cluster, pathPrefix: r.pathPrefix,
      })),
    };

    // 12. Output
    if (FORMAT === 'json') {
      console.log(JSON.stringify(fullReport, null, 2));
    } else if (FORMAT === 'md') {
      outputMarkdown(fullReport, filteredOrphans);
    } else {
      outputConsole(fullReport, filteredOrphans);
    }

    // 13. Always save JSON
    if (!fs.existsSync(path.resolve(ROOT, 'output'))) {
      fs.mkdirSync(path.resolve(ROOT, 'output'));
    }
    const jsonPath = path.resolve(ROOT, 'output/orphan-pages-report.json');
    fs.writeFileSync(jsonPath, JSON.stringify(fullReport, null, 2), 'utf-8');

    if (FORMAT === 'console') {
      console.log(`\n📄 JSON saved: ${jsonPath}`);
    }
    if (FORMAT === 'md') {
      const mdPath = path.resolve(ROOT, 'output/orphan-pages-report.md');
      console.log(`📄 Markdown saved: ${mdPath}`);
    }
  } catch (err) {
    console.error('\n✗ ERROR:', err.message);
    console.error(err.stack);
    process.exit(1);
  }
}

// ─── Console output ───────────────────────────────────
function outputConsole(report, orphans) {
  const { summary, byPathPrefix, byCluster, whitelisted, policyViolations, level, pathFilter } = report;

  console.log('\n📊 Path-prefix summary (sorted by orphan rate):\n');
  const sortedPaths = Object.entries(byPathPrefix).sort((a, b) => {
    const aOrphan = a[1].critical + a[1].warning + a[1].clusterWeak;
    const bOrphan = b[1].critical + b[1].warning + b[1].clusterWeak;
    return bOrphan - aOrphan;
  });
  console.log('  ' + 'Prefix'.padEnd(28) + ' | Total | CRIT | WARN | CLW  | OK   | Orphan%');
  console.log('  ' + '-'.repeat(78));
  for (const [prefix, g] of sortedPaths) {
    const total = g.total;
    const orphan = g.critical + g.warning + g.clusterWeak;
    const rate = total > 0 ? ((orphan / total) * 100).toFixed(1) : '0.0';
    console.log(`  ${prefix.padEnd(28)} | ${String(total).padStart(5)} | ${String(g.critical).padStart(4)} | ${String(g.warning).padStart(4)} | ${String(g.clusterWeak).padStart(4)} | ${String(g.ok).padStart(4)} | ${rate.padStart(7)}%`);
  }

  const sortedClusters = Object.entries(byCluster)
    .filter(([, g]) => g.critical + g.warning + g.clusterWeak > 0)
    .sort((a, b) => (b[1].critical + b[1].warning + b[1].clusterWeak) - (a[1].critical + a[1].warning + a[1].clusterWeak));
  if (sortedClusters.length > 0) {
    console.log(`\n📊 Cluster summary (TOP 10 by orphan count, of ${sortedClusters.length} clusters):\n`);
    for (const [cluster, g] of sortedClusters.slice(0, 10)) {
      console.log(`  • ${cluster}: ${g.critical}C + ${g.warning}W + ${g.clusterWeak}CLW / ${g.total} total (avg ${g.avgIncoming} incoming)`);
    }
  }

  console.log('\n─────────────────────────────────────');
  console.log(`  Level:           ${level}${pathFilter ? ` (path=${pathFilter})` : ''}`);
  console.log(`  Total pages:     ${summary.total}`);
  console.log(`  CRITICAL (0):    ${summary.critical}`);
  console.log(`  WARNING  (1-9):  ${summary.warning}`);
  console.log(`  CLUSTER_WEAK:    ${summary.clusterWeak}`);
  console.log(`  OK (10+):        ${summary.ok}`);
  if (summary.coverage) console.log(`  Coverage:        ${summary.coverage}`);
  if (summary.effectiveCoverage) console.log(`  Effective:       ${summary.effectiveCoverage}  (OK + whitelisted + policy-violations)`);
  console.log(`  Whitelisted:     ${summary.whitelisted}`);
  console.log(`  Policy viol.:    ${summary.policyViolations}  ⚠️  (forbidden language)`);
  console.log('─────────────────────────────────────\n');

  if (orphans.length === 0) {
    console.log('🎉 No orphan pages found!\n');
  } else {
    console.log(`🔴 ${orphans.length} orphan page(s) under level=${level}:\n`);
    const criticals = orphans.filter(o => o.severity === 'CRITICAL');
    const warnings = orphans.filter(o => o.severity === 'WARNING');
    const clusterWeaks = orphans.filter(o => o.severity === 'CLUSTER_WEAK');
    if (criticals.length) {
      console.log(`  CRITICAL (${criticals.length}):`);
      for (const o of criticals.slice(0, 40)) console.log(`    [${o.cluster.padEnd(22)}] ${o.url}`);
      if (criticals.length > 40) console.log(`    ... and ${criticals.length - 40} more`);
    }
    if (warnings.length) {
      console.log(`\n  WARNING (${warnings.length}):`);
      for (const o of warnings.slice(0, 25)) console.log(`    [${o.incomingCount}×][${o.cluster.padEnd(22)}] ${o.url}`);
      if (warnings.length > 25) console.log(`    ... and ${warnings.length - 25} more`);
    }
    if (clusterWeaks.length) {
      console.log(`\n  CLUSTER_WEAK (${clusterWeaks.length}):`);
      for (const o of clusterWeaks.slice(0, 20)) console.log(`    [${o.clusterInboundCount || 0}× cluster][${o.cluster.padEnd(22)}] ${o.url}`);
    }
  }

  if (policyViolations.length > 0) {
    console.log(`\n⚠️  ${policyViolations.length} URL(s) violate content policy (forbidden language):\n`);
    for (const v of policyViolations.slice(0, 10)) console.log(`    ${v.url}  (${v.cjkChars} CJK chars, ${(v.ratio * 100).toFixed(1)}%)`);
    if (policyViolations.length > 10) console.log(`    ... and ${policyViolations.length - 10} more`);
  }
}

// ─── Markdown output ──────────────────────────────────
function outputMarkdown(report, orphans) {
  const { summary, byPathPrefix, byCluster, level, pathFilter, generatedAt, policyViolations } = report;
  let md = '';

  if (!fs.existsSync(path.resolve(ROOT, 'output'))) {
    fs.mkdirSync(path.resolve(ROOT, 'output'));
  }
  md += `# Orphan Page Diagnostic Report\n\n`;
  md += `**Generated**: ${generatedAt}  \n`;
  md += `**Level**: \`${level}\`${pathFilter ? ` (path filter: \`${pathFilter}\`)` : ''}\n\n`;

  md += `## Summary\n\n`;
  md += `| Metric | Count |\n|---|---|\n`;
  md += `| Total pages | ${summary.total} |\n`;
  md += `| CRITICAL (0 incoming) | ${summary.critical} |\n`;
  md += `| WARNING (1-9 incoming) | ${summary.warning} |\n`;
  md += `| CLUSTER_WEAK | ${summary.clusterWeak} |\n`;
  md += `| OK (10+ incoming) | ${summary.ok} |\n`;
  md += `| Whitelisted | ${summary.whitelisted} |\n`;
  md += `| Policy violations | ${summary.policyViolations} |\n`;
  if (summary.coverage) md += `| Coverage | ${summary.coverage} |\n`;
  if (summary.effectiveCoverage) md += `| Effective coverage | ${summary.effectiveCoverage} |\n`;

  md += `\n## Path-Prefix Breakdown\n\n`;
  md += `| Prefix | Total | CRITICAL | WARNING | CLUSTER_WEAK | OK | Orphan Rate |\n`;
  md += `|---|---|---|---|---|---|---|\n`;
  const sortedPaths = Object.entries(byPathPrefix).sort((a, b) => {
    const aOrphan = a[1].critical + a[1].warning + a[1].clusterWeak;
    const bOrphan = b[1].critical + b[1].warning + b[1].clusterWeak;
    return bOrphan - aOrphan;
  });
  for (const [prefix, g] of sortedPaths) {
    const total = g.total;
    const orphan = g.critical + g.warning + g.clusterWeak;
    const rate = total > 0 ? ((orphan / total) * 100).toFixed(1) : '0.0';
    md += `| \`${prefix}\` | ${total} | ${g.critical} | ${g.warning} | ${g.clusterWeak} | ${g.ok} | ${rate}% |\n`;
  }

  md += `\n## Cluster Breakdown (TOP 20)\n\n`;
  md += `| Cluster | Total | CRITICAL | WARNING | CLUSTER_WEAK | OK | Avg Incoming |\n`;
  md += `|---|---|---|---|---|---|---|\n`;
  const sortedClusters = Object.entries(byCluster).sort((a, b) => (b[1].critical + b[1].warning + b[1].clusterWeak) - (a[1].critical + a[1].warning + a[1].clusterWeak));
  for (const [cluster, g] of sortedClusters.slice(0, 20)) {
    md += `| ${cluster} | ${g.total} | ${g.critical} | ${g.warning} | ${g.clusterWeak} | ${g.ok} | ${g.avgIncoming} |\n`;
  }

  md += `\n## Orphan Pages Detail\n\n`;
  const criticals = orphans.filter(o => o.severity === 'CRITICAL');
  if (criticals.length) {
    md += `### CRITICAL (${criticals.length})\n\n`;
    md += `| Cluster | Lang | Path | URL |\n|---|---|---|---|\n`;
    for (const o of criticals) md += `| ${o.cluster} | ${o.lang} | ${o.pathPrefix} | \`${o.url}\` |\n`;
  }
  const warnings = orphans.filter(o => o.severity === 'WARNING');
  if (warnings.length) {
    md += `\n### WARNING (${warnings.length})\n\n`;
    md += `| Cluster | Incoming | Lang | Path | URL |\n|---|---|---|---|---|\n`;
    for (const o of warnings) md += `| ${o.cluster} | ${o.incomingCount} | ${o.lang} | ${o.pathPrefix} | \`${o.url}\` |\n`;
  }
  const clusterWeaks = orphans.filter(o => o.severity === 'CLUSTER_WEAK');
  if (clusterWeaks.length) {
    md += `\n### CLUSTER_WEAK (${clusterWeaks.length})\n\n`;
    md += `| Cluster | Cluster In | Lang | Path | URL |\n|---|---|---|---|---|\n`;
    for (const o of clusterWeaks) md += `| ${o.cluster} | ${o.clusterInboundCount || 0} | ${o.lang} | ${o.pathPrefix} | \`${o.url}\` |\n`;
  }

  if (policyViolations && policyViolations.length) {
    md += `\n## Policy Violations (${policyViolations.length})\n\n`;
    md += `Forbidden-language content detected. Should be deleted or translated.\n\n`;
    md += `| URL | CJK Chars | Ratio | File |\n|---|---|---|---|\n`;
    for (const v of policyViolations) md += `| \`${v.url}\` | ${v.cjkChars} | ${(v.ratio * 100).toFixed(1)}% | ${v.file} |\n`;
  }

  const mdPath = path.resolve(ROOT, 'output/orphan-pages-report.md');
  fs.writeFileSync(mdPath, md, 'utf-8');
  console.log(`\n📄 Markdown saved: ${mdPath} (${md.length} chars)`);
}

main();