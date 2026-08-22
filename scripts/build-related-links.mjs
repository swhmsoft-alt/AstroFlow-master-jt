#!/usr/bin/env node
/**
 * build-related-links.mjs — Idempotent blog internal-link matrix builder
 * Closed-loop step 2 (Compute): orphan report → {hub, i18n, related} edges
 * SoT: output/orphan-pages-report.json  →  Out: data/related-links.json
 * Flags: --dry-run | --limit N | --stats
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { glob } from 'glob';
import matter from 'gray-matter';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const args = process.argv.slice(2);
const DRY_RUN = args.includes('--dry-run');
const STATS_ONLY = args.includes('--stats');
const limitIdx = args.indexOf('--limit');
const LIMIT = limitIdx >= 0 ? parseInt(args[limitIdx + 1], 10) : Infinity;
const REPORT_PATH = path.resolve(ROOT, 'output/orphan-pages-report.json');
const OUT_PATH = path.resolve(ROOT, 'data/related-links.json');
const BLOG_EN = path.resolve(ROOT, 'src/content/blog');
const BLOG_I18N = path.resolve(ROOT, 'src/content/blog-translations');

function safeSlug(raw, fallback) {
  return String(raw || fallback || '').replace(/^\/+|\/+$/g, '');
}

function readPosts(dir, defaultLang) {
  const files = glob.sync('**/*.md', { cwd: dir });
  const posts = [];
  for (const rel of files) {
    const full = path.join(dir, rel);
    let fm = {};
    try { fm = matter(fs.readFileSync(full, 'utf-8')).data || {}; }
    catch (e) { console.warn(`[warn] ${rel} :: ${e.message}`); continue; }
    const fileBase = rel.replace(/^.*\//, '').replace(/\.md$/, '');
    const slug = safeSlug(fm.slug, fileBase);
    const lang = fm.lang || (rel.includes('/') ? rel.split('/')[0] : defaultLang);
    posts.push({
      slug, lang,
      title: fm.title || slug,
      description: fm.description || '',
      category: fm.category || 'Uncategorized',
      tags: Array.isArray(fm.tags) ? fm.tags : [],
      coverImage: fm.coverImage || null,
      originalSlug: fm.originalSlug || null,
      relPath: rel,
    });
  }
  return posts;
}

function hrefOf(t) {
  if (!t || !t.slug) return '';
  if (t.lang === 'en') return `/blog/${t.slug}/`;
  // i18n: file is "{lang}-{slug}.md", so t.slug = "{lang}-..." . Use originalSlug
  // (canonical Astro route: /{lang}/blog/{originalSlug}/)
  const slugForUrl = t.originalSlug || t.slug.replace(new RegExp(`^${t.lang}-`), '');
  return `/${t.lang}/blog/${slugForUrl}/`;
}

function tagSim(a, b) {
  if (!a.length || !b.length) return 0;
  const A = new Set(a.map(s => String(s).toLowerCase()));
  const B = new Set(b.map(s => String(s).toLowerCase()));
  let inter = 0;
  for (const t of A) if (B.has(t)) inter++;
  const union = new Set([...A, ...B]).size;
  return union === 0 ? 0 : inter / union;
}

// 1. load posts
const enPosts = readPosts(BLOG_EN, 'en');
const i18nPosts = readPosts(BLOG_I18N, 'xx');
const allPosts = [...enPosts, ...i18nPosts];
if (allPosts.length === 0) { console.error('❌ No posts found.'); process.exit(1); }

// 2. load orphan report → incomingCount map (key = trailing-slash href, the SoT)
const incomingByHref = new Map();
const orphanByHref = new Map();
function ensureTrailingSlash(u) {
  const s = String(u || '');
  return s.endsWith('/') ? s : (s + '/');
}
if (fs.existsSync(REPORT_PATH)) {
  try {
    const report = JSON.parse(fs.readFileSync(REPORT_PATH, 'utf-8'));
    // orphanPages: 84 critical orphans (incomingCount all 0 by definition)
    const list = report.orphanPages || report.orphans || report.pages || [];
    for (const o of list) {
      const href = ensureTrailingSlash(o.url);
      if (!href || href === '/') continue;
      incomingByHref.set(href, o.incomingCount || 0);
      orphanByHref.set(href, o);
    }
    // topIncoming: real high-traffic pages — override with their actual counts
    if (Array.isArray(report.topIncoming)) {
      for (const t of report.topIncoming) {
        const href = ensureTrailingSlash(t.url);
        if (!href || href === '/') continue;
        const cur = incomingByHref.get(href) || 0;
        if ((t.count || 0) > cur) incomingByHref.set(href, t.count || 0);
      }
    }
  } catch (e) { console.warn(`[warn] orphan report: ${e.message}`); }
}

// 3. index by (lang, category)
const byCatLang = new Map();
for (const p of allPosts) {
  const k = `${p.lang}::${p.category}`;
  if (!byCatLang.has(k)) byCatLang.set(k, []);
  byCatLang.get(k).push(p);
}
for (const arr of byCatLang.values()) {
  arr.sort((a, b) => (incomingByHref.get(hrefOf(b)) || 0) - (incomingByHref.get(hrefOf(a)) || 0));
}

// 4. i18n sibling index (originalSlug → posts in other langs)
const i18nSiblings = new Map();
for (const p of i18nPosts) {
  if (!p.originalSlug) continue;
  const arr = i18nSiblings.get(p.originalSlug) || [];
  arr.push(p);
  i18nSiblings.set(p.originalSlug, arr);
}

// 5. build edges per post
const links = {};
let edgeCount = 0;
const targets = LIMIT < Infinity ? allPosts.slice(0, LIMIT) : allPosts;

for (const post of targets) {
  const edges = [];
  const seen = new Set();
  const add = (e) => {
    if (!e.href || seen.has(e.href)) return false;
    if (e.href === hrefOf(post)) return false;
    seen.add(e.href);
    edges.push(e);
    return true;
  };

  // (a) Hub: same lang+category, top by incoming
  const bucket = byCatLang.get(`${post.lang}::${post.category}`) || [];
  for (const hub of bucket) {
    if (hub.slug === post.slug) continue;
    if (edges.filter(x => x.type === 'hub').length >= 2) break;
    const inc = incomingByHref.get(hrefOf(hub)) || 0;
    const score = Math.min(1, 0.55 + inc * 0.04);
    add({
      type: 'hub', label: hub.title, href: hrefOf(hub),
      cluster: hub.category, score: Number(score.toFixed(3)), incomingCount: inc,
    });
  }

  // (b) i18n siblings: same originalSlug (en post uses own slug as key)
  const originalKey = post.lang === 'en' ? post.slug : post.originalSlug;
  if (originalKey) {
    const siblings = i18nSiblings.get(originalKey) || [];
    for (const sib of siblings) {
      if (sib.lang === post.lang) continue;
      if (edges.filter(x => x.type === 'i18n').length >= 3) break;
      add({
        type: 'i18n', label: sib.title, href: hrefOf(sib),
        cluster: sib.category, lang: sib.lang, score: 0.9,
      });
    }
  }

  // (c) Related: tag Jaccard >= 0.25, same lang, different category
  if (post.tags.length > 0) {
    const cands = allPosts
      .filter(p => p.slug !== post.slug && p.lang === post.lang && p.category !== post.category)
      .map(p => ({ p, s: tagSim(post.tags, p.tags) }))
      .filter(x => x.s >= 0.25)
      .sort((a, b) => b.s - a.s)
      .slice(0, 2);
    for (const c of cands) {
      add({
        type: 'related', label: c.p.title, href: hrefOf(c.p),
        cluster: c.p.category, score: Number(c.s.toFixed(3)),
      });
    }
  }

  if (edges.length > 0) {
    links[post.slug] = edges;
    edgeCount += edges.length;
  }
}

// 6. stats
const hrefToSlug = new Map();
for (const p of allPosts) hrefToSlug.set(hrefOf(p), p.slug);
const orphanHrefs = [...orphanByHref.keys()];
const orphansCovered = orphanHrefs.filter(href => {
  const slug = hrefToSlug.get(href);
  return slug && links[slug] && links[slug].length > 0;
}).length;
const stats = {
  totalPosts: allPosts.length,
  enPosts: enPosts.length,
  i18nPosts: i18nPosts.length,
  categoriesFound: new Set(allPosts.map(p => p.category)).size,
  languagesFound: new Set(allPosts.map(p => p.lang)).size,
  linkedPosts: Object.keys(links).length,
  totalEdges: edgeCount,
  avgEdgesPerLinkedPost: Object.keys(links).length === 0
    ? 0
    : Number((edgeCount / Object.keys(links).length).toFixed(2)),
  orphansBefore: orphanByHref.size,
  orphansCovered,
  orphanCoveragePct: orphanByHref.size === 0
    ? 0
    : Number((orphansCovered / orphanByHref.size * 100).toFixed(1)),
  incomingHubsKnown: incomingByHref.size,
};

if (STATS_ONLY || DRY_RUN) {
  console.log('=== STATS ===');
  console.log(JSON.stringify(stats, null, 2));
  if (DRY_RUN) {
    console.log('\n=== SAMPLE (first 3 posts) ===');
    let i = 0;
    for (const [slug, edges] of Object.entries(links)) {
      if (i++ >= 3) break;
      console.log(`\n  ${slug} → ${edges.length} edges:`);
      for (const e of edges) {
        console.log(`    [${e.type.padEnd(7)}] score=${e.score}  href=${e.href}`);
        console.log(`             label: ${e.label}`);
      }
    }
    console.log('\n(DRY RUN: no file written)');
  }
  process.exit(0);
}

// 7. atomic write
const output = {
  schemaVersion: '1.0',
  generatedAt: new Date().toISOString(),
  stats,
  links,
};
fs.mkdirSync(path.dirname(OUT_PATH), { recursive: true });
const tmp = OUT_PATH + '.tmp';
fs.writeFileSync(tmp, JSON.stringify(output, null, 2), 'utf-8');
fs.renameSync(tmp, OUT_PATH);

console.log(`✅ Wrote ${path.relative(ROOT, OUT_PATH)}`);
console.log(`   posts: en=${stats.enPosts} i18n=${stats.i18nPosts} total=${stats.totalPosts}`);
console.log(`   linked: ${stats.linkedPosts}/${stats.totalPosts}  edges: ${stats.totalEdges}  avg: ${stats.avgEdgesPerLinkedPost}`);
console.log(`   orphan coverage: ${stats.orphansCovered}/${stats.orphansBefore}`);
