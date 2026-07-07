/**
 * Generate internal keyword links mapping using DeepSeek AI (v4 — Multilingual Edition).
 *
 * Source content:  src/content/blog/*.md (EN) + src/content/blog-translations/*.md (DE/FR/ES/...)
 * Target URLs:     Monolingual + language-prefixed pillar pages
 *
 * Workflow:
 * 1. Scan EN blog + all blog-translations as SOURCE content
 * 2. Build pillar page catalog for EN + each of 9 languages
 * 3. For each language: send source content + pillar URLs to DeepSeek
 * 4. Merge all language-specific keyword mappings into astro.config.mjs
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { glob } from 'glob';
import matter from 'gray-matter';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');

const DEEPSEEK_API_KEY = 'sk-b187f5cf84c74f9aac8bd04b7fd0d2f8';
const DEEPSEEK_API_URL = 'https://api.deepseek.com/v1/chat/completions';

const MAX_KEYWORDS_PER_URL = 8;

const SUPPORTED_LANGS = ['en', 'de', 'ja', 'fr', 'es', 'pt', 'it', 'ko', 'nl', 'pl'];
const DEFAULT_LANG = 'en';

// ── 1. Scan source content files ────────────────────────
async function scanContentFiles(patterns) {
  const files = [];
  for (const pattern of patterns) {
    const matches = await glob(pattern, { cwd: ROOT, nodir: true });
    for (const match of matches) {
      files.push(path.resolve(ROOT, match));
    }
  }
  return files;
}

// ── 2. Parse Markdown frontmatter ───────────────────────
function parseMarkdownFile(filePath) {
  const raw = fs.readFileSync(filePath, 'utf-8');
  const { data: fm, content: body } = matter(raw);
  if (!fm || !body) return null;

  const relativePath = path.relative(ROOT, filePath).replace(/\\/g, '/');
  const relDir = path.dirname(relativePath);

  // Determine language from the file's location/frontmatter
  let lang = DEFAULT_LANG;
  let slug = '';

  if (relDir.includes('blog-translations')) {
    // e.g., "fr-titanium-cnc-machining-services" → extract lang prefix and slug
    const baseName = path.basename(filePath, path.extname(filePath));
    const parts = baseName.split('-');
    const langCode = parts[0]; // de, fr, es, etc.
    if (SUPPORTED_LANGS.includes(langCode)) {
      lang = langCode;
      // Reconstruct slug from frontmatter or from the file pattern
      slug = fm.originalSlug || parts.slice(1).join('-');
    }
  } else if (relDir.includes('/blog')) {
    lang = DEFAULT_LANG;
    slug = fm.slug || path.basename(filePath, path.extname(filePath));
  }

  // Build the language-specific blog URL
  let urlPath = '';
  if (lang === DEFAULT_LANG) {
    urlPath = `/blog/${slug}`;
  } else {
    urlPath = `/${lang}/blog/${slug}`;
  }

  const bodySummary = body
    .replace(/```[\s\S]*?```/g, '')
    .replace(/[#*`\[\]]/g, '')
    .trim()
    .slice(0, 1500);

  return {
    title: (fm.title || '').replace(/^["']|["']$/g, ''),
    tags: Array.isArray(fm.tags) ? fm.tags : [],
    description: (fm.description || '').replace(/^["']|["']$/g, ''),
    category: (fm.category || '').replace(/^["']|["']$/g, ''),
    urlPath,
    bodySummary,
    filePath: relativePath,
    lang,
    slug,
  };
}

// ── 3. Build pillar page catalog ────────────────────────
function buildPillarPagesForLang(lang) {
  const prefix = lang === DEFAULT_LANG ? '' : `/${lang}`;

  const CATEGORIES = [
    {
      category: 'Services',
      pages: [
        { path: '/titanium-cnc-machining-services/', label: 'Titanium CNC Machining Services' },
        { path: '/titanium-cnc-machining-services/3-5-axis-cnc-machining/', label: '3 & 5 Axis CNC Machining' },
        { path: '/titanium-cnc-machining-services/cnc-milling-turning/', label: 'CNC Milling & Turning' },
        { path: '/titanium-cnc-machining-services/custom-industrial-components/', label: 'Custom Industrial Components' },
        { path: '/titanium-cnc-machining-services/wire-edm-machining/', label: 'Wire EDM Machining' },
        { path: '/titanium-fabrication-services/', label: 'Titanium Fabrication & Assembly' },
        { path: '/titanium-fabrication-services/laser-cutting/', label: 'Laser Cutting' },
        { path: '/titanium-fabrication-services/titanium-welding-assembly/', label: 'Titanium Welding & Assembly' },
        { path: '/titanium-fabrication-services/waterjet-cutting/', label: 'Waterjet Cutting' },
        { path: '/titanium-forming-heavy-manufacturing/', label: 'Titanium Forming & Heavy Manufacturing' },
        { path: '/titanium-forming-heavy-manufacturing/raw-material-preparation-sizing/', label: 'Raw Material Preparation & Sizing' },
        { path: '/titanium-forming-heavy-manufacturing/titanium-extrusion/', label: 'Titanium Extrusion' },
        { path: '/titanium-forming-heavy-manufacturing/titanium-forging/', label: 'Titanium Forging' },
        { path: '/titanium-surface-treatment/', label: 'Titanium Surface Treatment' },
        { path: '/titanium-surface-treatment/anodizing/', label: 'Anodizing' },
        { path: '/titanium-surface-treatment/chemical-passivation/', label: 'Chemical Passivation' },
        { path: '/titanium-surface-treatment/polishing-sandblasting/', label: 'Polishing & Sandblasting' },
        { path: '/titanium-additive-manufacturing/', label: 'Titanium Additive Manufacturing' },
        { path: '/titanium-additive-manufacturing/3d-printing-slm/', label: '3D Printing / SLM' },
        { path: '/titanium-additive-manufacturing/low-volume-production/', label: 'Low Volume Production' },
        { path: '/titanium-additive-manufacturing/rapid-prototyping/', label: 'Rapid Prototyping' },
      ],
    },
    {
      category: 'Materials',
      pages: [
        { path: '/materials/', label: 'Titanium Materials Overview' },
        { path: '/materials/grade-1/', label: 'Grade 1 Titanium' },
        { path: '/materials/grade-2/', label: 'Grade 2 Titanium' },
        { path: '/materials/grade-3/', label: 'Grade 3 Titanium' },
        { path: '/materials/grade-4/', label: 'Grade 4 Titanium' },
        { path: '/materials/grade-4-eli/', label: 'Grade 4 ELI Titanium' },
        { path: '/materials/grade-5/', label: 'Grade 5 Titanium (Ti-6Al-4V)' },
        { path: '/materials/grade-6/', label: 'Grade 6 Titanium' },
        { path: '/materials/grade-9/', label: 'Grade 9 Titanium (Ti-3Al-2.5V)' },
        { path: '/materials/grade-19/', label: 'Grade 19 Titanium' },
        { path: '/materials/grade-21/', label: 'Grade 21 Titanium' },
        { path: '/materials/grade-23/', label: 'Grade 23 Titanium (Ti-6Al-4V ELI)' },
        { path: '/materials/grade-6242/', label: 'Grade 6242 Aerospace Ti (Ti-6Al-2Sn-4Zr-2Mo)' },
        { path: '/materials/ti-5553/', label: 'Ti-5Al-5V-5Mo-3Cr High Strength' },
      ],
    },
    {
      category: 'Equipment',
      pages: [
        { path: '/equipment/', label: 'Equipment Overview' },
        { path: '/equipment/5-axis-machining-center/', label: '5-Axis Machining Center' },
        { path: '/equipment/turn-mill-cnc/', label: 'Turn-Mill CNC' },
        { path: '/equipment/high-pressure-coolant/', label: 'High Pressure Coolant System' },
        { path: '/equipment/automatic-tool-magazine/', label: 'Automatic Tool Magazine' },
        { path: '/equipment/tool-presetter/', label: 'Tool Presetter' },
        { path: '/equipment/chip-management-fire-suppression/', label: 'Chip Management & Fire Suppression' },
        { path: '/equipment/vacuum-heat-treat-furnace/', label: 'Vacuum Heat Treat Furnace' },
        { path: '/equipment/cmm/', label: 'CMM Measurement' },
        { path: '/equipment/laser-tracker-3d-scanner/', label: 'Laser Tracker & 3D Scanner' },
        { path: '/equipment/anodizing-surface-treatment/', label: 'Anodizing Surface Treatment Line' },
        { path: '/equipment/wire-edm/', label: 'Wire EDM' },
        { path: '/equipment/automatic-bar-feeder/', label: 'Automatic Bar Feeder' },
        { path: '/equipment/robotic-pallet-system/', label: 'Robotic Pallet System' },
      ],
    },
    {
      category: 'Capabilities & Resources',
      pages: [
        { path: '/capabilities/', label: 'Capabilities Overview' },
        { path: '/industries/', label: 'Industries Served' },
        { path: '/facilities/', label: 'Facilities' },
        { path: '/resources/', label: 'Resources Hub' },
        { path: '/documentation/', label: 'Documentation' },
        { path: '/use-cases/', label: 'Use Cases' },
        { path: '/rfq/', label: 'Request a Quote' },
        { path: '/branded-custom-packaging-services/', label: 'Branded & Custom Packaging' },
        { path: '/laser-marking-custom-logo/', label: 'Laser Marking & Custom Logo' },
      ],
    },
    {
      category: 'Products',
      pages: [
        { path: '/products/', label: 'All Products' },
        { path: '/products/titanium-cnc-parts/', label: 'Titanium CNC Machined Components' },
      ],
    },
    {
      category: 'Blog',
      pages: [
        { path: '/blog/', label: 'Blog Home' },
        { path: '/blog/welcome-to-boze-cnc-blog/', label: 'Welcome to BOZE CNC Ti Blog' },
        { path: '/blog/titanium-cnc-machining-services/', label: 'Titanium CNC Machining Services Article' },
        { path: '/blog/custom-titanium-machining-contract-manufacturer-china-rfq-preparation/', label: 'Custom Titanium Machining Contract Manufacturer in China RFQ Guide' },
        { path: '/blog/aerospace-titanium-full-process-supply/', label: 'Aerospace Titanium Full Process Supply' },
      ],
    },
  ];

  const result = [];
  for (const group of CATEGORIES) {
    for (const page of group.pages) {
      result.push({
        path: prefix + page.path,
        label: page.label,
        category: group.category,
      });
    }
  }
  return result;
}

// ── 4. Read existing keywordMap ──────────────────────────
function readExistingKeywordMap() {
  const configPath = path.resolve(ROOT, 'astro.config.mjs');
  const configContent = fs.readFileSync(configPath, 'utf-8');
  const existing = {};
  const regex = /"([^"]+)"\s*:\s*(?:\{[^}]*href:\s*"([^"]+)"[^}]*\}|"([^"]+)")/g;
  let match;
  while ((match = regex.exec(configContent)) !== null) {
    const keyword = match[1];
    const href = match[2] || match[3];
    if (href) existing[keyword] = href;
  }
  console.log(`  Read ${Object.keys(existing).length} existing keywords from config.`);
  return existing;
}

function buildLinkCountTable(existingKeywords) {
  const countByUrl = {};
  for (const url of Object.values(existingKeywords)) {
    countByUrl[url] = (countByUrl[url] || 0) + 1;
  }
  return countByUrl;
}

// ── 5. Call DeepSeek for one language ────────────────────
async function generateForLanguage(lang, sourceItems, pillarPages, existingKeywords) {
  // Build existing keywords string for this language only
  const existingList = Object.entries(existingKeywords)
    .filter(([, url]) => lang === DEFAULT_LANG || url.startsWith(`/${lang}/`))
    .map(([kw, url]) => `  - "${kw}" → ${url}`);

  const sourceSummary = sourceItems
    .filter(item => item.lang === lang)
    .map((item, i) => {
      return `[Blog ${i + 1}]
- Title: ${item.title}
- URL: ${item.urlPath}
- Language: ${item.lang}
- Tags: ${item.tags.join(', ') || '(none)'}
- Category: ${item.category || '(none)'}
- Description: ${item.description}
- Body preview: ${item.bodySummary.slice(0, 600)}
---`;
    }).join('\n\n');

  if (!sourceSummary.trim()) {
    console.log(`  ⏭ No source content for language "${lang}", skipping.`);
    return {};
  }

  const pillarTable = pillarPages.map(pp => {
    return `| ${pp.path} | ${pp.category} |`;
  }).join('\n');

  const langName = { en: 'English', de: 'German', ja: 'Japanese', fr: 'French', es: 'Spanish', pt: 'Portuguese', it: 'Italian', ko: 'Korean', nl: 'Dutch', pl: 'Polish' }[lang] || lang;

  const prompt = `You are an expert SEO content strategist for a multilingual B2B titanium CNC manufacturing website.

## Task
Generate a **keyword-to-internal-link mapping** JSON object for the **${langName} (${lang})** version of the site.

## Blog Content in ${langName}
These are the blog articles written in ${langName}. The keywords should be extracted from this content in the ${langName} language.

${sourceSummary}

## Target URLs Available (${langName} version — prefix: ${lang === DEFAULT_LANG ? 'none' : '/' + lang})
Links must point to these target pages. Match ${langName}-language keywords to their most relevant page.

| URL Path | Category |
|----------|----------|
${pillarTable}

## Critical Rules

### LANGUAGE MATCHING
- For ${langName} (${lang}), extract keywords NATURALLY appearing in the ${langName} content.
- Example: German content → "CNC-Titanbearbeitung" → "/de/titanium-cnc-machining-services/"
- Example: Japanese content → "CNCチタン加工" → "/ja/titanium-cnc-machining-services/"
- Target URLs must use the "/${lang}/..." prefix (or "/..." for English).

### PRIORITY
Link blog keywords to: Services → Materials → Equipment → Capabilities → Products → Blog.

### KEYWORD QUALITY
- DO include industry-specific technical terms, material grades, certifications.
- DO NOT include generic words like "service", "quality", "process", "solution", "technology" alone.
- DO NOT include keywords < 4 chars unless highly specific acronyms (CNC, RFQ, CMM, EDM, ITAR).
- DO NOT include any keywords already in the existing mapping shown below.

### EXISTING KEYWORDS FOR THIS LANGUAGE (DO NOT REPEAT)
${existingList.length > 0 ? existingList.join('\n') : '  (none)'}

Generate **10-25 keyword mappings** for ${langName}. Return ONLY valid JSON: {"keyword": "/url-path", ...}. No explanation. No markdown.`;

  console.log(`\n  🤖 DeepSeek [${lang}] ${langName}...`);
  console.log(`     Sources: ${sourceItems.filter(i => i.lang === lang).length} blogs, Targets: ${pillarPages.length} pages`);

  const response = await fetch(DEEPSEEK_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${DEEPSEEK_API_KEY}`,
    },
    body: JSON.stringify({
      model: 'deepseek-chat',
      messages: [
        {
          role: 'system',
          content: `You are an SEO content strategist specializing in ${langName} industrial/CNC content. Return ONLY valid JSON.`
        },
        { role: 'user', content: prompt },
      ],
      temperature: 0.3,
      max_tokens: 4000,
    }),
  });

  if (!response.ok) {
    const errText = await response.text();
    throw new Error(`API error ${response.status}: ${errText}`);
  }

  const data = await response.json();
  const content = data.choices[0].message.content.trim();

  const jsonMatch = content.match(/```(?:json)?\s*([\s\S]*?)\s*```/) || content.match(/{[\s\S]*}/);
  const jsonStr = jsonMatch ? jsonMatch[1] || jsonMatch[0] : content;

  try {
    const links = JSON.parse(jsonStr);
    console.log(`     ✓ Generated ${Object.keys(links).length} keyword mappings`);
    return links;
  } catch (e) {
    console.error(`     ✗ Failed to parse: ${content.slice(0, 200)}`);
    return {};
  }
}

// ── 6. Merge with validation ─────────────────────────────
function mergeKeywords(existing, newLinks, validUrls) {
  const merged = { ...existing };
  const updatedCount = buildLinkCountTable(merged);
  let added = 0;
  let skipped = 0;

  for (const [keyword, url] of Object.entries(newLinks)) {
    const href = typeof url === 'string' ? url : (url.href || url);
    const normalized = href.endsWith('/') ? href : href + '/';

    if (merged[keyword]) {
      skipped++;
      continue;
    }

    if (!validUrls.has(normalized)) {
      console.log(`     ⚠ Skipping "${keyword}" → invalid URL: ${normalized}`);
      skipped++;
      continue;
    }

    const currentCount = updatedCount[normalized] || 0;
    if (currentCount >= MAX_KEYWORDS_PER_URL) {
      console.log(`     ⚠ Skipping "${keyword}" → ${normalized} (capacity ${currentCount}/${MAX_KEYWORDS_PER_URL})`);
      skipped++;
      continue;
    }

    merged[keyword] = normalized;
    updatedCount[normalized] = currentCount + 1;
    added++;
  }

  console.log(`     → ${added} added, ${skipped} skipped`);
  return merged;
}

// ── 7. Update astro.config.mjs ───────────────────────────
function updateAstroConfig(mergedKeywords) {
  const configPath = path.resolve(ROOT, 'astro.config.mjs');
  let configContent = fs.readFileSync(configPath, 'utf-8');

  const keywordMap = {};
  for (const [keyword, url] of Object.entries(mergedKeywords)) {
    keywordMap[keyword] = { href: url };
  }

  const jsonLines = JSON.stringify(keywordMap, null, 2).split('\n');
  const mapBody = jsonLines.slice(1, -1)
    .map(line => `        ${line}`)
    .join('\n');

  const startMatch = configContent.match(/keywordMap:\s*\{/);
  if (!startMatch) {
    console.error('ERROR: Could not find "keywordMap: {" in astro.config.mjs');
    console.log(JSON.stringify(keywordMap, null, 2));
    return;
  }

  const start = startMatch.index;
  let depth = 0;
  let end = start;
  while (end < configContent.length) {
    if (configContent[end] === '{') depth++;
    else if (configContent[end] === '}') {
      depth--;
      if (depth === 0) break;
    }
    end++;
  }

  const before = configContent.slice(0, start);
  const after = configContent.slice(end + 1);
  const replacement = `keywordMap: {\n${mapBody}\n      }`;
  configContent = before + replacement + after;
  fs.writeFileSync(configPath, configContent, 'utf-8');
  console.log('\n✓ Updated astro.config.mjs with multilingual keywordMap');
}

// ── Main ─────────────────────────────────────────────────
async function main() {
  try {
    console.log('=== Generate Internal Links Mapping (v4 — Multilingual) ===\n');

    // 0. Read existing
    let mergedKeywords = readExistingKeywordMap();
    const countByUrl = buildLinkCountTable(mergedKeywords);
    console.log('Current link distribution (top 10):');
    const sorted = Object.entries(countByUrl).sort((a, b) => b[1] - a[1]);
    for (const [url, count] of sorted.slice(0, 10)) {
      console.log(`  ${url}: ${count}/${MAX_KEYWORDS_PER_URL}`);
    }

    // 1. Scan ALL content (EN + translations)
    const allFiles = await scanContentFiles([
      'src/content/blog/*.md',
      'src/content/blog-translations/*.md',
    ]);

    console.log(`\nFound ${allFiles.length} total content files.\n`);

    const allItems = [];
    for (const file of allFiles) {
      const parsed = parseMarkdownFile(file);
      if (parsed) {
        allItems.push(parsed);
        console.log(`  🌐 [${parsed.lang}] ${parsed.urlPath}`);
      }
    }

    // 2. Build valid URL set (all languages' pillar pages)
    const validUrls = new Set();
    for (const lang of SUPPORTED_LANGS) {
      const pages = buildPillarPagesForLang(lang);
      for (const pp of pages) validUrls.add(pp.path);
    }
    // Also add blog translation URLs
    for (const item of allItems) validUrls.add(item.urlPath);

    console.log(`\nTotal source items: ${allItems.length}`);
    console.log(`Total valid target URLs: ${validUrls.size}`);

    // 3. Process each language separately
    for (const lang of SUPPORTED_LANGS) {
      const pillarPages = buildPillarPagesForLang(lang);
      const sourceItems = allItems.filter(i => i.lang === lang);

      if (sourceItems.length === 0) {
        console.log(`\n  ⏭ No source content for "${lang}", skipping.`);
        continue;
      }

      const newLinks = await generateForLanguage(lang, allItems, pillarPages, mergedKeywords);

      if (Object.keys(newLinks).length > 0) {
        mergedKeywords = mergeKeywords(mergedKeywords, newLinks, validUrls);

        // Show language distribution
        const langCount = Object.entries(mergedKeywords).filter(([, url]) =>
          lang === DEFAULT_LANG ? !url.match(/^\/(de|ja|fr|es|pt|it|ko|nl|pl)\//) : url.startsWith(`/${lang}/`)
        ).length;
        console.log(`     Total keywords for ${lang}: ${langCount}`);
      }

      // Delay between API calls
      if (lang !== SUPPORTED_LANGS[SUPPORTED_LANGS.length - 1]) {
        await new Promise(r => setTimeout(r, 1000));
      }
    }

    // 4. Final report
    const finalCount = buildLinkCountTable(mergedKeywords);
    console.log('\n═══════════════════════════════════════');
    console.log('    FINAL MULTILINGUAL DISTRIBUTION');
    console.log('═══════════════════════════════════════');
    console.log(`  Total keywords: ${Object.keys(mergedKeywords).length}`);

    for (const lang of SUPPORTED_LANGS) {
      const count = Object.entries(mergedKeywords).filter(([, url]) =>
        lang === DEFAULT_LANG ? !url.match(/^\/(de|ja|fr|es|pt|it|ko|nl|pl)\//) : url.startsWith(`/${lang}/`)
      ).length;
      console.log(`  ${lang}: ${count} keywords`);
    }

    console.log('\nTop linked pages:');
    const finalSorted = Object.entries(finalCount).sort((a, b) => b[1] - a[1]).slice(0, 15);
    for (const [url, count] of finalSorted) {
      const status = count >= MAX_KEYWORDS_PER_URL ? '🔴' : '🟢';
      console.log(`  ${status} ${url}: ${count}/${MAX_KEYWORDS_PER_URL}`);
    }

    // 5. Write to config
    updateAstroConfig(mergedKeywords);

    console.log('\n✅ Multilingual internal link generation complete!');

  } catch (err) {
    console.error('\n✗ ERROR:', err.message);
    process.exit(1);
  }
}

main();