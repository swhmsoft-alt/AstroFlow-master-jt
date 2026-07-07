/**
 * Check for orphan pages in src/content/ that have no internal links pointing to them.
 *
 * Workflow:
 * 1. Load the keywordMap from astro.config.mjs (configured internal links)
 * 2. Scan all Markdown files in src/content/ for manual internal links like [text](/path) and <a href="/path">
 * 3. Scan all .astro component pages in src/pages/ for internal links
 * 4. Cross-reference: which pages have 0 incoming links?
 * 5. Generate a report (console + optional JSON output)
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { glob } from 'glob';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');

// ── 1. Read keywordMap from astro.config.mjs ─────────────
function readKeywordMap() {
  const configPath = path.resolve(ROOT, 'astro.config.mjs');
  const configContent = fs.readFileSync(configPath, 'utf-8');

  const existing = {};
  const regex = /"([^"]+)"\s*:\s*(?:\{[^}]*href:\s*"([^"]+)"[^}]*\}|"([^"]+)")/g;
  let match;
  while ((match = regex.exec(configContent)) !== null) {
    const href = match[2] || match[3];
    if (href) existing[href] = (existing[href] || 0) + 1;
  }
  return existing;
}

// ── 2. Scan content files for internal links ────────────
async function scanInternalLinks(dirPatterns) {
  const files = [];
  for (const pattern of dirPatterns) {
    const matches = await glob(pattern, { cwd: ROOT, nodir: true });
    for (const match of matches) {
      files.push(path.resolve(ROOT, match));
    }
  }

  // Extract all internal links from Markdown and MDX files
  const internalLinks = {}; // URL → count

  for (const file of files) {
    const content = fs.readFileSync(file, 'utf-8');
    const relativePath = path.relative(ROOT, file).replace(/\\/g, '/');

    // Markdown links: [text](/path)
    const mdLinks = content.matchAll(/\]\((\/[^)\s]+)\)/g);
    for (const m of mdLinks) {
      const url = m[1].replace(/\/$/, ''); // normalize trailing slash
      internalLinks[url] = (internalLinks[url] || 0) + 1;
    }

    // Markdown references: [text]: /path
    const mdRefs = content.matchAll(/^\[.*?\]:\s*(\/[^\s]+)/gm);
    for (const m of mdRefs) {
      const url = m[1].replace(/\/$/, '');
      internalLinks[url] = (internalLinks[url] || 0) + 1;
    }

    // HTML <a href="/path">
    const htmlLinks = content.matchAll(/<a[^>]*href="(\/[^"]+)"/g);
    for (const m of htmlLinks) {
      const url = m[1].replace(/\/$/, '').replace(/\/index\.html$/, '');
      if (!url.startsWith('//') && !url.startsWith('http')) {
        internalLinks[url] = (internalLinks[url] || 0) + 1;
      }
    }
  }

  return internalLinks;
}

// ── 3. Build the set of known content URLs ──────────────
async function buildContentUrlMap() {
  const urlToFile = {};

  // Scan src/content/ for all Markdown files
  const contentFiles = await glob('src/content/**/*.md', { cwd: ROOT, nodir: true });
  for (const file of contentFiles) {
    const content = fs.readFileSync(path.resolve(ROOT, file), 'utf-8');

    // Extract slug from frontmatter
    const slugMatch = content.match(/^---\n[\s\S]*?slug:\s*["']?([^\s"']+)["']?/m);
    const baseName = path.basename(file, '.md');

    const relDir = path.dirname(file).replace(/\\/g, '/');
    let urlPath = '';

    if (relDir.includes('/blog')) {
      urlPath = `/blog/${slugMatch ? slugMatch[1] : baseName}`;
    } else if (relDir.includes('/products')) {
      urlPath = `/products/${slugMatch ? slugMatch[1] : baseName}`;
    } else if (relDir.includes('/pages')) {
      urlPath = baseName === 'home' ? '/' : `/${slugMatch ? slugMatch[1] : baseName}`;
    }

    if (urlPath) {
      urlToFile[urlPath] = file;
    }
  }

  return urlToFile;
}

// ── 4. Build known page URLs from src/pages/ ────────────
async function buildPageUrlMap() {
  const pageUrls = new Set();

  // Scan src/pages/ for .astro files
  const pageFiles = await glob('src/pages/**/*.astro', { cwd: ROOT, nodir: true });
  for (const file of pageFiles) {
    // Convert file path to URL
    let url = path.dirname(file).replace(/\\/g, '/').replace(/^src\/pages/, '');
    const baseName = path.basename(file, '.astro');
    if (baseName === 'index') {
      // /path/index.astro → /path/
      if (url === '') url = '/';
      else url = url + '/';
    } else if (baseName === '[...slug]') {
      // Dynamic route, skip
      continue;
    } else {
      // /path/file.astro → /path/file/
      url = url + '/' + baseName + '/';
    }
    pageUrls.add(url.replace(/\/\/+/g, '/'));
  }

  return pageUrls;
}

// ── Main ─────────────────────────────────────────────────
async function main() {
  try {
    console.log('=== Orphan Page Detection ===\n');

    // 1. keywordMap links
    const keywordMap = readKeywordMap();
    console.log(`keywordMap entries: ${Object.entries(keywordMap).reduce((a, [, c]) => a + c, 0)}`);
    console.log(`Unique URLs in keywordMap: ${Object.keys(keywordMap).length}\n`);

    // 2. Internal links from content files
    const contentLinks = await scanInternalLinks([
      'src/content/**/*.md',
      'src/content/**/*.mdx',
    ]);

    // 3. Internal links from page components
    const pageLinks = await scanInternalLinks([
      'src/pages/**/*.astro',
    ]);

    // Merge all link sources
    const allIncomingLinks = { ...keywordMap };
    for (const [url, count] of Object.entries(contentLinks)) {
      allIncomingLinks[url] = (allIncomingLinks[url] || 0) + count;
    }
    for (const [url, count] of Object.entries(pageLinks)) {
      allIncomingLinks[url] = (allIncomingLinks[url] || 0) + count;
    }

    // 4. Build all known URLs on the site
    const contentUrlMap = await buildContentUrlMap();
    const pageUrls = await buildPageUrlMap();

    console.log(`Content pages (src/content/): ${Object.keys(contentUrlMap).length}`);
    console.log(`Component pages (src/pages/): ${pageUrls.size}\n`);

    // 5. Find orphans
    const allKnownUrls = new Set([
      ...Object.keys(contentUrlMap),
      ...pageUrls,
    ]);

    const orphans = [];
    const withIncoming = [];

    for (const url of allKnownUrls) {
      const normalizedUrl = url.endsWith('/') ? url : url + '/';
      const incomingCount = allIncomingLinks[url] || allIncomingLinks[url.replace(/\/$/, '')] || 0;

      if (incomingCount === 0) {
        orphans.push(url);
      } else {
        withIncoming.push({ url, count: incomingCount });
      }
    }

    // Sort orphans for consistent output
    orphans.sort();
    withIncoming.sort((a, b) => b.count - a.count);

    // 6. Report
    console.log('═══════════════════════════════════════');
    console.log('          ORPHAN PAGE REPORT          ');
    console.log('═══════════════════════════════════════\n');

    if (orphans.length === 0) {
      console.log('🎉 No orphan pages found! All pages have at least one incoming link.\n');
    } else {
      console.log(`🔴 ${orphans.length} orphan page(s) found with 0 incoming links:\n`);
      for (const url of orphans) {
        console.log(`  - ${url}`);
      }
      console.log('');
    }

    const topLinked = withIncoming.slice(0, 5);
    if (topLinked.length > 0) {
      console.log('Top 5 most-linked pages:\n');
      for (const { url, count } of topLinked) {
        console.log(`  🟢 ${url} (${count} incoming links)`);
      }
      console.log('');
    }

    // Summary
    const totalPages = allKnownUrls.size;
    const linkedCount = withIncoming.length;
    const orphanCount = orphans.length;
    const coverage = totalPages > 0 ? ((linkedCount / totalPages) * 100).toFixed(1) : 'N/A';

    console.log('─────────────────────────────────────');
    console.log(`  Total pages:     ${totalPages}`);
    console.log(`  With links:      ${linkedCount}`);
    console.log(`  Orphans:         ${orphanCount}`);
    console.log(`  Coverage:        ${coverage}%`);
    console.log('─────────────────────────────────────\n');

    // Save report to file
    const reportPath = path.resolve(ROOT, 'output/orphan-pages-report.json');
    if (!fs.existsSync(path.resolve(ROOT, 'output'))) {
      fs.mkdirSync(path.resolve(ROOT, 'output'));
    }
    fs.writeFileSync(reportPath, JSON.stringify({
      generatedAt: new Date().toISOString(),
      totalPages,
      linkedCount,
      orphanCount,
      coverage: `${coverage}%`,
      orphans,
      topLinked: topLinked.slice(0, 10),
    }, null, 2), 'utf-8');
    console.log(`📄 Full report saved to: ${reportPath}`);

  } catch (err) {
    console.error('\n✗ ERROR:', err.message);
    process.exit(1);
  }
}

main();