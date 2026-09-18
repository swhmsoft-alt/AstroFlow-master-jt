/**
 * scripts/check-dead-links.mjs — Spider-style dead link scanner (B-Prime-style)
 *
 * 模拟搜索引擎蜘蛛抓取流程，从 dist/sitemap-*.xml 提取 URL 作为种子，
 * BFS 抓取每个页面的 HTML，提取所有内部 <a href> / <link href>，
 * 验证目标路径是否在 sitemap 路由集合 / astro.config.mjs redirects / dist 物理文件中。
 *
 * 与 check-keyword-map.mjs 的区别：
 *   - check-keyword-map.mjs: 仅审计 keywordMap + main-db.json 两个数据源
 *   - check-dead-links.mjs:   全站扫描，模拟蜘蛛实际抓取行为
 *
 * Usage:
 *   node scripts/check-dead-links.mjs              # 扫描 + 输出到 _audit/
 *   node scripts/check-dead-links.mjs --format=console   # 仅控制台
 *   node scripts/check-dead-links.mjs --ci               # CI门禁（exit 1 if dead）
 *   node scripts/check-dead-links.mjs --top 20           # 控制台只显示前 N 个
 *
 * Requires:
 *   - dist/ 已构建（npm run build）
 *   - dist/sitemap-*.xml 至少存在一个
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const DIST = path.join(ROOT, 'dist');
const SITE = 'https://cnc.bozemetal.com';

// ─── CLI args ───────────────────────────────────────
const args = process.argv.slice(2);
const FORMAT = args.find(a => a.startsWith('--format='))?.split('=')[1] || 'all';
const CI = args.includes('--ci');
const TOP_N = (() => {
  const m = args.find(a => a.startsWith('--top='));
  return m ? parseInt(m.split('=')[1], 10) : 30;
})();

// ─── 1. 加载 sitemap routes ─────────────────────────
function loadSitemapRoutes() {
  if (!fs.existsSync(DIST)) {
    console.error('✗ dist/ not found. Run `npm run build` first.');
    process.exit(2);
  }
  const xmlFiles = fs.readdirSync(DIST).filter(f => /^sitemap.*\.xml$/.test(f));
  if (!xmlFiles.length) {
    console.error('✗ No sitemap-*.xml in dist/.');
    process.exit(2);
  }
  const locRe = /<loc>([^<]+)<\/loc>/g;
  const hostRe = /^https?:\/\/[^/]+/;
  const routes = new Set();
  let total = 0;
  for (const f of xmlFiles) {
    const text = fs.readFileSync(path.join(DIST, f), 'utf8');
    for (const m of text.matchAll(locRe)) {
      const path = m[1].replace(hostRe, '');
      routes.add(path);
      total++;
    }
  }
  return { routes, xmlFiles, total };
}

// ─── 2. 加载 redirects (astro.config.mjs) ───────────
function loadRedirects() {
  const cfg = fs.readFileSync(path.join(ROOT, 'astro.config.mjs'), 'utf8');
  // 提取 redirects: { ... } 块
  const m = cfg.match(/redirects:\s*\{([\s\S]*?)\n\s*\},?\s*\n/);
  if (!m) return new Map();
  const body = m[1];
  const redirects = new Map();
  const re = /['"`]([^'"`]+)['"`]\s*:\s*['"`]([^'"`]+)['"`]/g;
  for (const em of body.matchAll(re)) {
    redirects.set(em[1], em[2]);
  }
  return redirects;
}

// ─── 3. 索引 dist 物理 HTML 文件 ────────────────────
function loadDistHtmlFiles() {
  // 列出所有 *.html 文件（递归）
  const files = [];
  function walk(dir) {
    for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
      if (e.name.startsWith('.')) continue;
      const full = path.join(dir, e.name);
      if (e.isDirectory()) walk(full);
      else if (e.name.endsWith('.html')) files.push(full);
    }
  }
  walk(DIST);
  return files;
}

// ─── 4. href 规范化 ────────────────────────────────
function normalizeHref(rawHref, fromPath) {
  if (!rawHref) return null;
  // 跳过外链 / 非 http(s) scheme
  if (/^(https?:|mailto:|tel:|javascript:|data:)/i.test(rawHref)) return null;
  // 跳过协议相对
  if (rawHref.startsWith('//')) return null;
  // 跳过 fragment-only（同页锚点）
  if (rawHref.startsWith('#')) return null;
  // 跳过静态资源
  if (/\.(png|jpe?g|gif|webp|svg|ico|pdf|zip|mp4|webm|mp3|css|js|map|woff2?|xml|txt|json)$/i.test(rawHref)) {
    return null;
  }
  if (rawHref.startsWith('/_astro/') || rawHref.startsWith('/favicon')) return null;

  // 拼接相对路径
  let abs;
  try {
    abs = new URL(rawHref, 'https://x.test' + fromPath);
  } catch {
    return null;
  }
  let p = abs.pathname;
  // 强制尾斜杠 (项目 trailingSlash: 'always')
  if (!p.endsWith('/') && !/\.[a-z0-9]+$/i.test(p)) p += '/';
  return p;
}

// ─── 5. 提取单个 HTML 文件中的所有 href ─────────────
function extractHrefsFromHtml(htmlContent, fromPath) {
  const refs = [];
  const lines = htmlContent.split('\n');
  // 区分 <a> vs <link>（hreflang alternate 是 <link rel="alternate">，用户不可点击）
  const tagRe = /<(a|link)\b[^>]*?\bhref\s*=\s*(?:"([^"]+)"|'([^']+)'|\{([^}]+)\})/gi;
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    tagRe.lastIndex = 0;
    let m;
    while ((m = tagRe.exec(line)) !== null) {
      const tag = (m[1] || '').toLowerCase();   // 'a' 或 'link'
      const raw = m[2] || m[3] || m[4];
      if (!raw) continue;
      const norm = normalizeHref(raw, fromPath);
      if (norm) refs.push({ target: norm, raw, line: i + 1, tag });
    }
  }
  return refs;
}

/**
 * Count `data-i18n-missing="..."` markers placed by the unified
 * rehype-i18n-link.mjs plugin and the Header.astro `<span>` fallback.
 * These are hrefs that *would have been* dead but were proactively audited
 * at compile.  Surfacing this count helps operators verify the plugin is
 * actually doing its job (a non-zero number is healthy; zero may indicate
 * the plugin isn't loaded).
 */
function countI18nMissingMarkers(htmlContent) {
  const m = htmlContent.match(/data-i18n-missing="[^"]+"/g);
  return m ? m.length : 0;
}

// ─── 6. 扫描 src/ 构建 href → references 索引 ──────
function buildSrcHrefIndex() {
  const index = new Map(); // normHref -> [{file, line, snippet}]
  const patterns = [
    /\]\((\/[^)\s]+)\)/g,                              // [text](/path)
    /<a[^>]*href=["'](\/[^"']+)["']/gi,                // <a href="/path">
    /<a[^>]*href=\{["']?(\/[^"'\s}]+)["']?\}/gi,       // <a href={"/path"}>
    /<link[^>]*href=["'](\/[^"']+)["']/gi,             // <link href="/path">
    /href:\s*["'](\/[^"']+)["']/gi,                    // data: href: "/path"
  ];

  // 同时建 slug 索引（用于死链溯源：动态拼接的 href）
  const slugIndex = new Map(); // slugString -> [{file, line, snippet}]
  // 匹配 string literal: "foo-bar" 或 'foo/bar'（允许 - 和 /）
  const slugLiteralRe = /['"`]([a-z0-9][a-z0-9-]*(?:\/[a-z0-9-]+)*)['"`]/gi;

  function walk(dir) {
    if (!fs.existsSync(dir)) return;
    for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
      if (e.name.startsWith('.') || e.name === 'node_modules') continue;
      const full = path.join(dir, e.name);
      if (e.isDirectory()) {
        walk(full);
      } else if (/\.(astro|md|mdx|ts|tsx|js|jsx|mjs|cjs)$/.test(e.name)) {
        const content = fs.readFileSync(full, 'utf8');
        const lines = content.split('\n');
        const rel = path.relative(ROOT, full).replace(/\\/g, '/');
        for (let i = 0; i < lines.length; i++) {
          const line = lines[i];
          // 1. href 索引
          for (const re of patterns) {
            re.lastIndex = 0;
            let m;
            while ((m = re.exec(line)) !== null) {
              const raw = m[1];
              const norm = normalizeHref(raw, '/');
              if (!norm) continue;
              if (!index.has(norm)) index.set(norm, []);
              if (index.get(norm).length < 50) {
                index.get(norm).push({
                  file: rel,
                  line: i + 1,
                  snippet: line.trim().slice(0, 220),
                });
              }
            }
          }
          // 2. slug 字面量索引（用于溯源）
          slugLiteralRe.lastIndex = 0;
          let sm;
          while ((sm = slugLiteralRe.exec(line)) !== null) {
            const slug = sm[1];
            if (slug.length < 4) continue;  // 跳过太短的
            // 跳过纯数字、纯字母
            if (!/[a-z]/.test(slug)) continue;
            if (!slugIndex.has(slug)) slugIndex.set(slug, []);
            if (slugIndex.get(slug).length < 20) {
              slugIndex.get(slug).push({
                file: rel,
                line: i + 1,
                snippet: line.trim().slice(0, 220),
              });
            }
          }
        }
      }
    }
  }
  walk(path.join(ROOT, 'src'));
  return { hrefIndex: index, slugIndex };
}

// ─── 7. 系统路径白名单 ──────────────────────────────
const SYSTEM_PATHS = new Set([
  '/404.html',
  '/404/',
  '/thank-you/',
  '/theme-demo/',
  '/admin/',
]);
const SYSTEM_PREFIXES = [
  '/_astro/',
  '/favicon',
  '/uploads/',
  '/images/',
  '/static/',
];

function isSystemPath(p) {
  if (SYSTEM_PATHS.has(p)) return true;
  return SYSTEM_PREFIXES.some(pref => p.startsWith(pref));
}

// ─── 7.5. 扫描注入源（keywordMap + main-db.json）───
function buildInjectedSourceIndex() {
  // 找出每个 href 的注入源头（dist HTML 中大量链接由这两处生成）
  const index = new Map(); // normHref -> [{source, file, keyword, snippet}]

  // 1. astro.config.mjs 的 keywordMap
  try {
    const cfg = fs.readFileSync(path.join(ROOT, 'astro.config.mjs'), 'utf8');
    const startIdx = cfg.indexOf('keywordMap:');
    if (startIdx >= 0) {
      // 找到 keywordMap: { ... } 的 body
      const openIdx = cfg.indexOf('{', startIdx);
      let depth = 1, end = openIdx + 1;
      while (end < cfg.length && depth > 0) {
        if (cfg[end] === '{') depth++;
        else if (cfg[end] === '}') depth--;
        end++;
      }
      const body = cfg.slice(openIdx + 1, end - 1);
      // 提取 "keyword": { "href": "/path" }（多行格式）
      const entryRe = /"([^"\\]+)"\s*:\s*\{\s*"href"\s*:\s*"([^"\\]+)"/g;
      let m;
      while ((m = entryRe.exec(body)) !== null) {
        const keyword = m[1];
        const href = m[2];
        const norm = normalizeHref(href, '/');
        if (!norm) continue;
        if (!index.has(norm)) index.set(norm, []);
        index.get(norm).push({ source: 'keywordMap', file: 'astro.config.mjs', keyword });
      }
    }
  } catch (err) {
    console.error('  ⚠ Failed to parse keywordMap:', err.message);
  }

  // 2. data/keywords/main-db.json
  const dbPath = path.join(ROOT, 'data/keywords/main-db.json');
  if (fs.existsSync(dbPath)) {
    try {
      const db = JSON.parse(fs.readFileSync(dbPath, 'utf8'));
      for (const item of db) {
        if (item && item.status === 'mapped' && item.targetUrl) {
          const norm = normalizeHref(item.targetUrl, '/');
          if (!norm) continue;
          if (!index.has(norm)) index.set(norm, []);
          index.get(norm).push({
            source: 'main-db',
            file: 'data/keywords/main-db.json',
            keyword: item.keyword || item.id || '?',
          });
        }
      }
    } catch (err) {
      console.error('  ⚠ Failed to parse main-db.json:', err.message);
    }
  }

  return index;
}

// ─── 8. 路径在 sitemap 中？────────────────────────
function isInSitemap(p, routes) {
  // sitemap 集合已经 normalized 含尾斜杠
  return routes.has(p);
}

// ─── 9. main ─────────────────────────────────────
function main() {
  console.log('🕷️  Spider-style dead link scan (BFS over dist/)\n');

  // 1. 加载 sitemap
  const { routes, xmlFiles, total: routeCount } = loadSitemapRoutes();
  console.log(`  ✓ Loaded ${routeCount} routes from ${xmlFiles.join(', ')}`);

  // 2. 加载 redirects
  const redirects = loadRedirects();
  console.log(`  ✓ Loaded ${redirects.size} redirects from astro.config.mjs`);

  // 3. 索引 dist HTML
  const htmlFiles = loadDistHtmlFiles();
  console.log(`  ✓ Indexed ${htmlFiles.length} HTML files in dist/`);

  // 4. BFS: 抓取每个 HTML, 提取内部 href
  console.log('\n  🕷️  Crawling pages (BFS)...');
  const allRefs = []; // [{from, target}]
  let crawlErrors = 0;
  let i18nMissingTotal = 0;
  for (const f of htmlFiles) {
    try {
      const html = fs.readFileSync(f, 'utf8');
      const rel = path.relative(DIST, f).replace(/\\/g, '/');
      const fromPath = '/' + rel.replace(/\/index\.html$/, '').replace(/\.html$/, '');
      const refs = extractHrefsFromHtml(html, fromPath);
      for (const r of refs) {
        allRefs.push({ from: fromPath, target: r.target, tag: r.tag });
      }
      i18nMissingTotal += countI18nMissingMarkers(html);
    } catch (err) {
      crawlErrors++;
    }
  }
  console.log(`  ✓ Extracted ${allRefs.length} internal refs from dist/`);
  if (crawlErrors) console.log(`  ⚠ ${crawlErrors} HTML files failed to read`);
  if (i18nMissingTotal > 0) {
    console.log(`  ✓ data-i18n-missing markers (plugin-audited): ${i18nMissingTotal}`);
  }

  // 5. 收集唯一目标
  const uniqueTargets = [...new Set(allRefs.map(r => r.target))];
  console.log(`  ✓ ${uniqueTargets.length} unique internal targets\n`);

  // 6. 死链判定
  console.log('🔍 Checking target validity...');
  // 一次遍历建立 target -> { anchor: Set<from>, meta: Set<from> } 映射（O(N)）
  const targetToFroms = new Map();
  for (const r of allRefs) {
    let s = targetToFroms.get(r.target);
    if (!s) { s = { anchor: new Map(), meta: new Map() }; targetToFroms.set(r.target, s); }
    if (r.tag === 'a') s.anchor.set(r.from, true);
    else if (r.tag === 'link') s.meta.set(r.from, true);
  }

  const deadLinksMap = new Map(); // target -> { anchorFroms, metaFroms, sourceType }
  const redirected = new Map();  // target -> finalUrl (for report)
  let validCount = 0;
  let systemCount = 0;
  let redirectCount = 0;
  let anchorDeadCount = 0;
  let metaDeadCount = 0;
  let bothDeadCount = 0;

  for (const target of uniqueTargets) {
    if (isSystemPath(target)) {
      systemCount++;
      continue;
    }
    if (redirects.has(target)) {
      redirectCount++;
      redirected.set(target, redirects.get(target));
      continue;
    }
    if (isInSitemap(target, routes)) {
      validCount++;
      continue;
    }
    // 死链
    const s = targetToFroms.get(target) || { anchor: new Map(), meta: new Map() };
    const anchorFroms = [...s.anchor.keys()];
    const metaFroms = [...s.meta.keys()];
    let sourceType;
    if (anchorFroms.length && metaFroms.length) {
      sourceType = 'both';
      bothDeadCount++;
    } else if (anchorFroms.length) {
      sourceType = 'anchor';
      anchorDeadCount++;
    } else if (metaFroms.length) {
      sourceType = 'meta';
      metaDeadCount++;
    } else {
      sourceType = 'none';
    }
    deadLinksMap.set(target, { anchorFroms, metaFroms, sourceType });
  }

  console.log(`  ✓ Valid (in sitemap):     ${validCount}`);
  console.log(`  ↪  Via 301 redirect:      ${redirectCount}`);
  console.log(`  ⊘  System/excluded:       ${systemCount}`);
  console.log(`  ✗  DEAD (no route):       ${deadLinksMap.size}`);
  console.log(`     ├─ <a> user-visible:    ${anchorDeadCount}`);
  console.log(`     ├─ <link> SEO/hreflang: ${metaDeadCount}`);
  console.log(`     └─ both:               ${bothDeadCount}\n`);

  // 7. 溯源：每个死链目标 → 在 src/ 中找到的所有引用点
  console.log('🔍 Tracing dead links back to src/...');
  const { hrefIndex: srcIndex, slugIndex } = buildSrcHrefIndex();
  console.log(`  ✓ Indexed ${srcIndex.size} unique hrefs; ${slugIndex.size} slug strings from src/`);

  // 7.5. 注入源（keywordMap + main-db.json）
  console.log('🔍 Scanning injection sources (keywordMap + main-db.json)...');
  const injectedIndex = buildInjectedSourceIndex();
  let kmCount = 0, dbCount = 0;
  for (const arr of injectedIndex.values()) {
    for (const e of arr) {
      if (e.source === 'keywordMap') kmCount++;
      else if (e.source === 'main-db') dbCount++;
    }
  }
  console.log(`  ✓ keywordMap: ${kmCount} entries; main-db.json: ${dbCount} entries\n`);

  // 7.6. slug 溯源：从死链目标提取可能 slug，查 srcIndex
  const LANGS = ['de','ja','fr','es','pt','it','ko','nl','pl','ru','ar'];
  function traceSlug(target) {
    // 去掉语言前缀
    let p = target;
    for (const lng of LANGS) {
      if (p.startsWith(`/${lng}/`)) { p = p.slice(lng.length + 2); break; }
    }
    p = p.replace(/^\//, '').replace(/\/$/, '');
    if (!p) return [];
    // 候选 slug 切分
    const candidates = [
      p,                                    // 完整
      p.split('/').slice(-2).join('/'),     // 后两段
      p.split('/').slice(-1)[0],           // 最后一段
    ];
    // 去重
    const seen = new Set();
    const uniq = candidates.filter(c => { if (!c || seen.has(c)) return false; seen.add(c); return true; });
    const hits = [];
    for (const c of uniq) {
      const arr = slugIndex.get(c);
      if (arr) hits.push(...arr);
    }
    // 去重（同 file:line）
    const dedup = [];
    const seenKey = new Set();
    for (const h of hits) {
      const k = `${h.file}:${h.line}`;
      if (!seenKey.has(k)) { seenKey.add(k); dedup.push(h); }
    }
    return dedup.slice(0, 10);
  }

  const broken = [...deadLinksMap.entries()].map(([target, info]) => {
    const srcRefs = srcIndex.get(target) || srcIndex.get(target.replace(/\/$/, '')) || [];
    const injectedSources = injectedIndex.get(target) || injectedIndex.get(target.replace(/\/$/, '')) || [];
    const slugSources = traceSlug(target);
    return {
      target,
      sourceType: info.sourceType,
      anchorReferencedBy: info.anchorFroms,
      metaReferencedBy: info.metaFroms,
      srcReferences: srcRefs,
      injectedSources,
      slugSources,
    };
  }).sort((a, b) => {
    // 优先 anchor 死链（最严重），然后 both，最后 meta
    const sev = (x) => (x.sourceType === 'both' ? 0 : x.sourceType === 'anchor' ? 1 : 2);
    const sa = sev(a), sb = sev(b);
    if (sa !== sb) return sa - sb;
    // 然后按引用次数降序
    const refA = a.anchorReferencedBy.length + a.metaReferencedBy.length;
    const refB = b.anchorReferencedBy.length + b.metaReferencedBy.length;
    return refB - refA;
  });

  // 8. 输出 JSON
  const jsonPath = path.join(ROOT, '_audit/dead-links.json');
  fs.mkdirSync(path.dirname(jsonPath), { recursive: true });
  const jsonReport = {
    generatedAt: new Date().toISOString(),
    mode: 'spider-bfs',
    summary: {
      sitemapRoutes: routeCount,
      distHtmlFiles: htmlFiles.length,
      internalRefs: allRefs.length,
      uniqueTargets: uniqueTargets.length,
      valid: validCount,
      redirects: redirectCount,
      system: systemCount,
      dead: deadLinksMap.size,
      deadAnchorOnly: anchorDeadCount,
      deadMetaOnly: metaDeadCount,
      deadBoth: bothDeadCount,
    },
    broken,
  };
  fs.writeFileSync(jsonPath, JSON.stringify(jsonReport, null, 2), 'utf8');
  console.log(`📄 JSON: ${jsonPath}`);

  // 9. 输出 Markdown（按 sourceType 分组）
  const mdPath = path.join(ROOT, '_audit/dead-links.md');
  let md = `# Dead Link Report (Spider-style BFS)\n\n`;
  md += `**Generated**: ${new Date().toISOString()}\n\n`;
  md += `## Summary\n\n`;
  md += `| Metric | Count |\n|---|---|\n`;
  md += `| Sitemap routes | ${routeCount} |\n`;
  md += `| HTML files in dist | ${htmlFiles.length} |\n`;
  md += `| Internal refs crawled | ${allRefs.length} |\n`;
  md += `| Unique targets | ${uniqueTargets.length} |\n`;
  md += `| Valid (in sitemap) | ${validCount} |\n`;
  md += `| Via 301 redirect | ${redirectCount} |\n`;
  md += `| System/excluded | ${systemCount} |\n`;
  md += `| **DEAD total** | **${deadLinksMap.size}** |\n`;
  md += `|   └─ <a> user-visible only | ${anchorDeadCount} |\n`;
  md += `|   └─ <link> SEO/hreflang only | ${metaDeadCount} |\n`;
  md += `|   └─ both | ${bothDeadCount} |\n\n`;
  md += `**Injection source stats** (where dead hrefs come from):\n`;
  md += `  - \`astro.config.mjs\` keywordMap: ${kmCount} entries\n`;
  md += `  - \`data/keywords/main-db.json\` (status='mapped'): ${dbCount} entries\n`;
  md += `  - \`src/\` hardcoded: ${srcIndex.size} uniques (most likely all valid)\n\n`;

  if (broken.length === 0) {
    md += `## ✅ No dead links found.\n`;
  } else {
    md += `## Severity Legend\n\n`;
    md += `  - 🔴 **anchor** = referenced by user-visible \`<a>\` tag (clicks land on 404)\n`;
    md += `  - 🟡 **meta** = referenced only by \`<link rel="alternate" hreflang>\` (SEO signal)\n`;
    md += `  - 🔴🟡 **both** = both types\n\n`;
    md += `## How to fix\n\n`;
    md += `For each dead link, find where it's injected:\n`;
    md += `  - If it shows in \`**Injection sources**\` below → edit \`astro.config.mjs\` keywordMap or \`data/keywords/main-db.json\`\n`;
    md += `  - If it shows in \`**Source files**\` below → edit the .astro/.md file at the given line\n`;
    md += `  - Otherwise → add a 301 redirect in \`astro.config.mjs\` \`redirects:\` block\n\n`;

    // 分组
    const groups = { both: [], anchor: [], meta: [] };
    for (const b of broken) groups[b.sourceType].push(b);

    const writeSection = (label, emoji, items) => {
      if (!items.length) return;
      md += `## ${emoji} ${label} (${items.length})\n\n`;
      for (const b of items) {
        const totalRefs = b.anchorReferencedBy.length + b.metaReferencedBy.length;
        md += `### ❌ \`${b.target}\` — ${totalRefs} ref(s)\n\n`;
        if (b.anchorReferencedBy.length) {
          md += `**Anchor (user-visible) refs: ${b.anchorReferencedBy.length}**\n\n`;
          for (const f of b.anchorReferencedBy.slice(0, 5)) {
            md += `- \`${f}\`\n`;
          }
          if (b.anchorReferencedBy.length > 5) {
            md += `- _...and ${b.anchorReferencedBy.length - 5} more_\n`;
          }
          md += `\n`;
        }
        if (b.metaReferencedBy.length) {
          md += `**Meta (hreflang/link) refs: ${b.metaReferencedBy.length}**\n\n`;
          for (const f of b.metaReferencedBy.slice(0, 3)) {
            md += `- \`${f}\`\n`;
          }
          if (b.metaReferencedBy.length > 3) {
            md += `- _...and ${b.metaReferencedBy.length - 3} more_\n`;
          }
          md += `\n`;
        }
        if (b.srcReferences.length === 0) {
          md += `**Source files**: _No src/ reference found — link is injected at build time_\n\n`;
        } else {
          md += `**Source files** (${b.srcReferences.length} occurrence${b.srcReferences.length > 1 ? 's' : ''}):\n\n`;
          for (const r of b.srcReferences.slice(0, 10)) {
            md += `- \`${r.file}:${r.line}\`\n`;
            md += `    \`${r.snippet}\`\n`;
          }
          if (b.srcReferences.length > 10) {
            md += `- _...and ${b.srcReferences.length - 10} more_\n`;
          }
          md += `\n`;
        }

        // 注入源
        if (b.injectedSources.length) {
          md += `**Injection sources** (${b.injectedSources.length} entry${b.injectedSources.length > 1 ? 'ies' : 'y'}):\n\n`;
          for (const inj of b.injectedSources.slice(0, 10)) {
            md += `- \`${inj.source}\` (\`${inj.file}\`): keyword = \`${inj.keyword}\`\n`;
          }
          if (b.injectedSources.length > 10) {
            md += `- _...and ${b.injectedSources.length - 10} more_\n`;
          }
          md += `\n`;
        }

        // Slug 溯源（动态拼接生成的链接源头）
        if (b.slugSources && b.slugSources.length) {
          md += `**Slug occurrences in src/** (potential dynamic-injection source, ${b.slugSources.length}):\n\n`;
          for (const s of b.slugSources.slice(0, 10)) {
            md += `- \`${s.file}:${s.line}\`\n`;
            md += `    \`${s.snippet}\`\n`;
          }
          if (b.slugSources.length > 10) {
            md += `- _...and ${b.slugSources.length - 10} more_\n`;
          }
          md += `\n`;
        }

        md += `---\n\n`;
      }
    };

    writeSection('Both <a> + <link> Dead Links', '🔴🟡', groups.both);
    writeSection('<a> User-visible Dead Links', '🔴', groups.anchor);
    writeSection('<link> SEO/hreflang-only Dead Links', '🟡', groups.meta);
  }

  fs.writeFileSync(mdPath, md, 'utf8');
  console.log(`📄 Markdown: ${mdPath}\n`);

  // 10. 控制台输出（按严重性 + TOP_N）
  if (broken.length === 0) {
    console.log('✅ No dead links found.\n');
  } else {
    console.log(`❌ Dead links: ${broken.length} total\n`);
    console.log(`   🔴🟡 both (anchor + meta): ${bothDeadCount}`);
    console.log(`   🔴   <a> user-visible:    ${anchorDeadCount}`);
    console.log(`   🟡   <link> hreflang only: ${metaDeadCount}\n`);

    // 优先展示最严重的
    const top = broken.slice(0, TOP_N);
    for (const b of top) {
      const emoji = b.sourceType === 'both' ? '🔴🟡' : b.sourceType === 'anchor' ? '🔴  ' : '🟡  ';
      const totalRefs = b.anchorReferencedBy.length + b.metaReferencedBy.length;
      console.log(`  ${emoji} ${b.target}`);
      console.log(`        ref: ${totalRefs} (a=${b.anchorReferencedBy.length}, link=${b.metaReferencedBy.length}); src/ refs: ${b.srcReferences.length}`);
      for (const r of b.srcReferences.slice(0, 3)) {
        console.log(`          ${r.file}:${r.line}`);
      }
      if (b.srcReferences.length > 3) {
        console.log(`          ...and ${b.srcReferences.length - 3} more`);
      }
      console.log('');
    }
    if (broken.length > TOP_N) {
      console.log(`  ...and ${broken.length - TOP_N} more (see _audit/dead-links.md)\n`);
    }
  }

  // 11. CI 模式
  if (CI && broken.length > 0) {
    process.exit(1);
  }
}

main();