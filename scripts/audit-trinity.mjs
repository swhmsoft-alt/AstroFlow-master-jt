#!/usr/bin/env node
/**
 * scripts/audit-trinity.mjs
 *
 * Trinity audit: Buyer Decision Chain × Google EEAT × AI Citation.
 *
 * Page-type-aware (service / material / blog / capability / industry / part).
 * Scores each dimension 0-100 and emits actionable gaps.
 *
 * Usage: node scripts/audit-trinity.mjs <slug>
 *        node scripts/audit-trinity.mjs --all      # scan src/pages for *.astro
 *        node scripts/audit-trinity.mjs <slug> --serp           # enable SERP baseline (LLM-inferred)
 *        node scripts/audit-trinity.mjs <slug> --keyword "..."  # set target keyword for SERP
 *        node scripts/audit-trinity.mjs <slug> --no-serp        # explicitly disable SERP
 */

import fs from 'fs';
import path from 'path';
import crypto from 'crypto';

const rawArgs = process.argv.slice(2);
// Find the slug: the first positional arg (not a --flag and not the value after --keyword)
const flagValueIndices = new Set();
{
  const ki = rawArgs.indexOf('--keyword');
  if (ki >= 0) flagValueIndices.add(ki + 1);
}
const positionalArgs = rawArgs.filter((_, i) => !rawArgs[i].startsWith('--') && !flagValueIndices.has(i));
const slug = positionalArgs[0];
const scanAll = slug === '--all' || rawArgs.includes('--all');
// Optional flags: --keyword "..." | --serp | --no-serp
const keywordArg = (() => {
  const i = rawArgs.indexOf('--keyword');
  return i >= 0 ? rawArgs[i + 1] : null;
})();
const serpEnabled = rawArgs.includes('--serp') || !!keywordArg;
const serpDisabled = rawArgs.includes('--no-serp');

// ─── URL/slug normalization ─────────────────────────────────────────────────
// Accept either a project-relative slug ("blog/foo") or a full URL
// ("https://cnc.bozemetal.com/blog/foo/"). Strip host + trailing slash.
function normalizeInput(input) {
  if (!input) return input;
  let s = String(input).trim();
  s = s.replace(/^https?:\/\/[^/]+/i, '');
  s = s.replace(/\?.*$/, '').replace(/#.*$/, '');
  s = s.replace(/^\/+/, '').replace(/\/+$/, '');
  return s;
}

const results = [];

if (scanAll) {
  const walk = (dir) => fs.readdirSync(dir, { withFileTypes: true }).flatMap(d => {
    const p = path.join(dir, d.name);
    if (d.isDirectory()) return walk(p);
    if (d.name.endsWith('.astro')) return [p.replace(/^src\/pages\//, '').replace(/\.astro$/, '').replace(/\/index$/, '')];
    return [];
  });
  for (const s of walk('src/pages')) {
    if (s.startsWith('[') || s.startsWith('_') || s.includes('/_') || s === 'index' || s.endsWith('thank-you') || s.endsWith('404')) continue;
    if (['titanium-cnc-machining-services/3-5-axis-cnc-machining'].includes(s)) results.push(s);
  }
  if (slug && !slug.startsWith('--')) results.push(slug);
} else {
  if (!slug) { console.error('Usage: node scripts/audit-trinity.mjs <slug|--all> [--serp] [--keyword "..."] [--no-serp]'); process.exit(1); }
  results.push(slug);
}

// ─── dynamic-route resolution ───────────────────────────────────────────────
// When the input slug doesn't map to a static .astro file, look for a
// content-collection pair: src/pages/<col>/[...slug].astro  ↔  src/content/<col>/<slug>.md
// Also supports the i18n layout src/pages/[...lang]/<col>/[...slug].astro  ↔
// src/content/<col>/<lang>/<slug>.md, plus a generic catch-all.
function resolveDynamicRoute(slug) {
  const segments = slug.split('/').filter(Boolean);
  if (segments.length === 0) return null;

  const firstSeg = segments[0];
  const tail     = segments.slice(1);
  const tailStr  = tail.join('/');

  const candidates = [
    {
      tmpl:    `src/pages/${firstSeg}/[...slug].astro`,
      content: `src/content/${firstSeg}/${tailStr}.md`,
    },
    {
      tmpl:    `src/pages/[...lang]/${firstSeg}/[...slug].astro`,
      content: segments.length >= 3
        ? `src/content/${firstSeg}/${tail[0]}/${tail.slice(1).join('/')}.md`
        : null,
    },
    {
      tmpl:    `src/pages/[...slug].astro`,
      content: `src/content/${slug}.md`,
    },
  ];

  for (const c of candidates) {
    if (!c.content) continue;
    if (fs.existsSync(c.tmpl) && fs.existsSync(c.content)) {
      return { template: c.tmpl.replace(/\\/g, '/'), contentFile: c.content.replace(/\\/g, '/') };
    }
  }
  return null;
}

// ─── audit one page ────────────────────────────────────────────────────────
function auditOne(rawSlug) {
  const slug = normalizeInput(rawSlug);
  const candidates = [
    `src/pages/${slug}.astro`,
    `src/pages/${slug}/index.astro`,
  ];
  let pageFile = null;
  for (const c of candidates) if (fs.existsSync(c)) { pageFile = c; break; }
  let contentFile = null;   // populated when we resolve a dynamic route
  let content;
  if (pageFile) {
    content = fs.readFileSync(pageFile, 'utf8');
  } else {
    const dyn = resolveDynamicRoute(slug);
    if (!dyn) return null;
    pageFile = dyn.template;
    contentFile = dyn.contentFile;
    content = fs.readFileSync(dyn.template, 'utf8') + '\n' + fs.readFileSync(dyn.contentFile, 'utf8');
  }

  // also read imported service components so FAQPage schema in FaqSection.astro counts
  const pageDir = path.dirname(pageFile).replace(/\\/g, '/');
  const importedComponents = [...content.matchAll(/import\s+([A-Z][A-Za-z]+)\s+from\s+['"]([^'"]+)['"]/g)].map(m => {
    const comp = m[1];
    const rawPath = m[2];
    let resolved;
    if (rawPath.startsWith('.')) {
      resolved = path.resolve(pageDir, rawPath).replace(/\\/g, '/');
    } else {
      resolved = 'src/' + rawPath;
    }
    const fullPath = resolved.endsWith('.astro') ? resolved : resolved + '.astro';
    if (fs.existsSync(fullPath)) {
      try { return { comp, content: fs.readFileSync(fullPath, 'utf8') }; } catch { return null; }
    }
    return null;
  }).filter(Boolean);
  const allContent = content + '\n' + importedComponents.map(c => c.content).join('\n');

  // ─── page type detection ─────────────────────────────────────────────────
  let pageType = 'unknown';
  // URL-prefix first (most reliable), then content markers as fallback
  if (slug.startsWith('blog/') || slug === 'blog') pageType = 'blog-post';
  else if (/^case-studies\//.test(slug) || slug === 'case-studies') pageType = 'case-study';
  else if (/^equipment\//.test(slug) || slug === 'equipment') pageType = 'equipment';
  else if (/^products\/product-entities\//.test(slug)) pageType = 'product';
  else if (/^tools\//.test(slug)) pageType = 'tool-detail';
  else if (/^services\//.test(slug) || slug === 'services') pageType = 'service';
  else if (/^industries\//.test(slug) || slug === 'industries') pageType = 'industry';
  else if (/^materials\//.test(slug) || slug === 'materials') pageType = 'material';
  else if (/^capabilities\//.test(slug) || slug === 'capabilities') pageType = 'capability';
  // Content-based fallbacks
  else if (/IndustryHub|industries-served/.test(content)) pageType = 'industry';
  else if (content.includes('AudienceHub industry=')) pageType = 'service';
  else if (/material|alloy|grade/i.test(slug)) pageType = 'material';
  else if (/equipment|cnc-mill|turn-mill|wire-edm|surface-treatment|additive|forming|fabrication/i.test(slug)) pageType = 'capability';
  else if (/titanium-(machining|cnc|cnc-machining|grinding)/i.test(slug)) pageType = 'service';
  else if (slug.startsWith('part')) pageType = 'part';

  // 1. BUYER DECISION CHAIN (12 stages)
  const buyerChecks = {
    awareness:        /\bneed to\b|\bi need\b|require[ds]?|looking for|titanium parts?/i.test(content.slice(0, 5000)),
    painIdentification: /pain|challeng|difficult|hard|issue|problem/i.test(content),
    solutionExplore:  /solution|approach|method|capability|axis|process/i.test(content),
    capabilityValid:  /part|component|Blisk|implant|bracket|assembly|we (machin|provid|deliver)/i.test(content),
    costAssessment:   /cost|price|pricing|\$\d|\d+\s*×\s*baseline|MOQ|minimum order/i.test(content),
    timeDecision:     /lead time|weeks?|delivery|turnaround|rush|expedit/i.test(content),
    fileProcess:      /\bSTEP\b|\bIGES\b|\bDWG\b|\bDXF\b|\bSolidWorks\b|\bCATIA\b|\bNX\b|CAD|file format|upload drawing|send drawing/i.test(content),
    riskMitigation:   /Cpk|capability|yield|defect rate|scrap/i.test(content),
    decisionRfq:      /RFQ|quote|submit|request|call to action|CTA/i.test(content),
    comparison:       /\bvs\.\b|\bvs\s+(Typical|Job|CNC|Shop|Overseas)|compared|alternative|competitor|different from/i.test(content),
    capacityLock:     /capacity|monthly|backup machine|redundancy|production volume/i.test(content),
    faqResolution:    /FAQ|frequently asked|question/i.test(content),
  };
  const buyerScore = Math.round(Object.values(buyerChecks).filter(Boolean).length / Object.keys(buyerChecks).length * 100);

  // 2. GOOGLE EEAT + INFORMATION GAIN
  const eeatChecks = {
    experienceSignal: /case stud|client|customer|yield|reduction|delivery|prototype|production run/i.test(content),
    yearsInBusiness:   /\bsince\s*20\d{2}|founded in 20\d{2}/i.test(allContent),
    specificMetrics:  (allContent.match(/\b\d+(\.\d+)?\s*(mm|μm|Ra|W\/m·K|°C|bar|kg|ksi|MPa|years?|months?|weeks?|parts?|pcs)\b/gi) || []).length,
    specificExamples: /for example|e\.g\.|such as|instance|case stud/i.test(content),
    standardCitation: /ASTM|ISO|ASME|AMS|AS9100|NADCAP|MIL-STD|Fed-Std/i.test(content),
    certification:    /ISO 9001|AS9100|NADCAP| certified|certification/i.test(allContent),
    externalLinks:    (allContent.match(/https?:\/\/(?!cnc\.bozemetal\.com|bozemetal\.com|#)/gi) || []).length,
    teamAuthority:    /team|engineer|technician|operator|expert|specialist/i.test(content),
    quantified:       /\d+(\.\d+)?\s*%|\d+(\.\d+)?\s*x|\$\d+/i.test(content),
    sourceDisclosure: /source:|reference:|cited from|according to/i.test(content),
    freshnessDate:    /20\d{2}-\d{2}-\d{2}|updated|revised|published/i.test(content),
    uniqueDataPoint:  /proprietary|original (research|data|study)|first-hand|our (test|measure|study)/i.test(content),
    proprietaryFrame: /framework|methodology|decision matrix|selection matrix/i.test(content),
  };
  const eeatScore = Math.round(
    (Object.values(eeatChecks).filter((v, i) => {
      const k = Object.keys(eeatChecks)[i];
      if (k === 'specificMetrics') return v >= 5;
      if (k === 'externalLinks') return v >= 2;
      return v === true;
    }).length / Object.keys(eeatChecks).length) * 100
  );

  // 3. GENERATIVE AI CITATION — page-type-aware core vs aux schema detection
  // Distinguish CORE @type (the page's primary content type — required for
  // Google rich-result eligibility) from AUX @type (BreadcrumbList, Organization,
  // WebSite, etc.). Source: dist/ runtime HTML, NOT source code (source-level
  // regex gave false negatives: e.g. 'articleType: BlogPosting' in schema.ts
  // is a runtime value, not a literal @type string).
  const CORE_TYPES_BY_PAGE = {
    'blog-post':  ['BlogPosting'],
    'case-study': ['Article'],
    'product':    ['Product'],
    'service':    ['Service'],
    'industry':   ['Service'],
    'equipment':  ['Product'],
    'equipment-detail': ['Product'],
    'material':   [],          // no industry-standard core type for material page
    'capability': [],
    'tool-detail':['WebApplication'],
  };
  const expectedCore = CORE_TYPES_BY_PAGE[pageType] || [];

  // Try to read dist/ HTML first (runtime truth). Fall back to source regex.
  let runtimeTypes = null;
  let distExists = false;
  try {
    const distPath = `dist/${slug}/index.html`;
    if (fs.existsSync(distPath)) {
      distExists = true;
      const html = fs.readFileSync(distPath, 'utf8');
      const blocks = [...html.matchAll(/<script[^>]+type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/g)].map(m => m[1]);
      runtimeTypes = new Set();
      for (const b of blocks) {
        try {
          const j = JSON.parse(b);
          const arr = Array.isArray(j) ? j : (j['@graph'] || [j]);
          for (const node of arr) {
            if (node && node['@type']) {
              const t = node['@type'];
              if (Array.isArray(t)) t.forEach(x => runtimeTypes.add(x));
              else runtimeTypes.add(t);
            }
          }
        } catch {}
      }
    }
  } catch {}

  const aiChecks = {
    schemaOrg:        runtimeTypes ? runtimeTypes.size > 0 : /<script\s+type="application\/ld\+json"/.test(allContent),
    coreTypePresent:  expectedCore.length === 0
      ? true
      : (runtimeTypes ? expectedCore.some(t => runtimeTypes.has(t))
                      : /"@type":\s*"(Article|BlogPosting|NewsArticle|Product|Service|WebApplication|HowTo|FAQPage)"/i.test(allContent)),
    breadcrumbSchema: runtimeTypes ? runtimeTypes.has('BreadcrumbList')
                                   : /itemListElement|BreadcrumbList/.test(allContent),
    faqSchema:        runtimeTypes ? runtimeTypes.has('FAQPage') : /FAQPage/.test(allContent),
    howToSchema:      runtimeTypes ? runtimeTypes.has('HowTo') : /"@type":\s*"HowTo"/.test(allContent),
    articleSchema:    runtimeTypes ? (runtimeTypes.has('BlogPosting') || runtimeTypes.has('Article') || runtimeTypes.has('NewsArticle'))
                                   : /"@type":\s*"(Article|BlogPosting|NewsArticle)"/.test(allContent),
    productSchema:    runtimeTypes ? (runtimeTypes.has('Product') || runtimeTypes.has('Service'))
                                   : /"@type":\s*"(Product|Service)"/.test(allContent),
    faqHtmlPattern:   /<details>|"@type":\s*"Question"/i.test(allContent),
    realTableElement: /<table[^>]*>/.test(allContent),
    bestForPattern:   /Best for[:\s]|Not for[:\s]|Ideal for|Not suitable for/i.test(allContent),
    headingNumbered:   /Step\s+\d+:|^##\s+\d+\.|^###\s+\d+\./m.test(content),
    bulletOrStepList: /<ol[^>]*>|<ul[^>]*>/i.test(content),
    quotedSpec:       /"[^"]{20,200}"/.test(allContent) && !/"[a-z]+(-[a-z0-9]+){2,}"/.test(allContent),
  };
  const aiScore = Math.round(
    (Object.values(aiChecks).filter((v, i) => {
      const k = Object.keys(aiChecks)[i];
      if (k === 'realTableElement' || k === 'bulletOrStepList' || k === 'quotedSpec') return v === true;
      return v === true;
    }).length / Object.keys(aiChecks).length) * 100
  );

  const total = Math.round((buyerScore + eeatScore + aiScore) / 3);

  return { slug, pageFile, contentFile, pageType, expectedCore,
    missingCoreTypes: expectedCore.filter(t => !runtimeTypes || !runtimeTypes.has(t)),
    runtimeTypes: runtimeTypes ? [...runtimeTypes].sort() : null,
    distAudited: distExists,
    buyerScore, eeatScore, aiScore, total,
    buyer: buyerChecks, eeat: eeatChecks, ai: aiChecks };
}

// ─── SERP baseline (LLM-inferred; no real SERP fetch) ───────────────────────
// Without a paid SERP API we approximate the "Google top-10 common features"
// by asking the configured MiniMax-M3 chat model. Result is cached per
// keyword under audit-results/serp-baseline/<sha1>.json so the same query
// isn't re-asked on every run.
const ENV_PATH = path.resolve(process.cwd(), '.env.production');
function loadEnv() {
  if (!fs.existsSync(ENV_PATH)) return {};
  const txt = fs.readFileSync(ENV_PATH, 'utf8');
  const out = {};
  for (const line of txt.split(/\r?\n/)) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
    if (m && !out[m[1]]) out[m[1]] = m[2].replace(/^['"]|['"]$/g, '');
  }
  return out;
}

async function callLLM(prompt) {
  const env = loadEnv();
  const apiKey = process.env.MINIMAX_API_KEY || env.MINIMAX_API_KEY;
  const base   = process.env.OPENAI_BASE_URL || env.OPENAI_BASE_URL || 'https://api.minimaxi.com/v1';
  const model  = process.env.OPENAI_MODEL_ID || env.OPENAI_MODEL_ID || 'MiniMax-M3';
  if (!apiKey) throw new Error('MINIMAX_API_KEY missing in env and .env.production');

  const res = await fetch(`${base}/chat/completions`, {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model, temperature: 0.2,
      messages: [
        { role: 'system', content: 'You output ONLY strict JSON. No prose.' },
        { role: 'user', content: prompt },
      ],
    }),
  });
  if (!res.ok) throw new Error(`LLM HTTP ${res.status}: ${await res.text()}`);
  const j = await res.json();
  return j?.choices?.[0]?.message?.content || '';
}

async function inferSerpBaseline(keyword, pageExcerpt) {
  const cacheDir = path.resolve(process.cwd(), 'audit-results/serp-baseline');
  fs.mkdirSync(cacheDir, { recursive: true });
  const key = crypto.createHash('sha1').update(keyword.toLowerCase()).digest('hex').slice(0, 16);
  const cachePath = path.join(cacheDir, `${key}.json`);
  if (fs.existsSync(cachePath)) {
    return { baseline: JSON.parse(fs.readFileSync(cachePath, 'utf8')), cached: true };
  }
  const prompt = `You are analyzing what the top-10 Google results for a B2B titanium-machining keyword would share in 2026.
Keyword: "${keyword}"
Excerpt of our own page (first 1500 chars):
---
${pageExcerpt.slice(0, 1500)}
---
Infer the COMMON features a top-10 page on this keyword would have. Output STRICT JSON only, no commentary, no markdown fences. Schema:
{
  "keyword": string,
  "avgWordCount": number,
  "schemaTypes": string[] (from: Article, FAQPage, HowTo, BreadcrumbList, Product, Service, Review, Organization, Person),
  "tableUsage": boolean,
  "faqPresence": boolean,
  "mustHaveSignals": string[] (5-10 short signals, e.g. "ASTM standard citation", "machining parameter table"),
  "commonSections": string[] (5-8 typical H2 sections),
  "externalDomains": string[] (typical citation domains, e.g. "astm.org", "iso.org"),
  "differentiators": string[] (2-3 ways to stand out),
  "aiCitationFriendly": string[] (numbered headings, comparison tables, quoted specs, etc.)
}`;
  const raw = await callLLM(prompt);
  let parsed;
  try {
    // Strip <think>...</think> blocks (MiniMax-M3 emits them by default)
    let cleaned = raw.replace(/<think>[\s\S]*?<\/think>/gi, '');
    // Strip markdown fences if present
    cleaned = cleaned.replace(/^```(?:json)?/i, '').replace(/```$/i, '').trim();
    parsed = JSON.parse(cleaned);
  } catch (e) {
    throw new Error(`LLM did not return valid JSON: ${raw.slice(0, 200)}`);
  }
  const out = { keyword, ...parsed, generatedAt: new Date().toISOString() };
  fs.writeFileSync(cachePath, JSON.stringify(out, null, 2));
  return { baseline: out, cached: false };
}

function diffBaselineVsPage(baseline, content) {
  const lc = content.toLowerCase();
  const has = (needle) => lc.includes(String(needle).toLowerCase());
  const checks = {
    tableUsage:        /<table[\s>]|\|.*\|.*\|/.test(content),
    faqPresence:       /FAQPage|<details>|frequently asked/i.test(content),
    articleSchema:     /"@type":\s*"(Article|BlogPosting|NewsArticle)"/i.test(content),
    howToSchema:       /"@type":\s*"HowTo"/i.test(content),
    breadcrumb:        /BreadcrumbList/.test(content),
    numberedHeadings:  /^##\s+\d+\.|^###\s+\d+\./m.test(content),
    quotedSpecs:       /"[^"]{20,200}"/.test(content),
  };
  const missingSignals = (baseline.mustHaveSignals || []).filter(s => !has(s));
  const missingSections = (baseline.commonSections  || []).filter(s => !has(s));
  const missingSchema   = (baseline.schemaTypes     || []).filter(t => {
    if (t === 'Article')        return !checks.articleSchema;
    if (t === 'HowTo')          return !checks.howToSchema;
    if (t === 'BreadcrumbList') return !checks.breadcrumb;
    if (t === 'FAQPage')        return !checks.faqPresence;
    return false; // can't detect from content alone → assume present
  });
  return { checks, missingSignals, missingSections, missingSchema };
}

async function runSerpComparison(keyword, pageContent) {
  if (serpDisabled) return null;
  try {
    const { baseline, cached } = await inferSerpBaseline(keyword, pageContent);
    const diff = diffBaselineVsPage(baseline, pageContent);
    return { baseline, diff, cached };
  } catch (e) {
    console.warn(`\n  [SERP baseline] skipped: ${e.message}`);
    console.warn(`  [SERP baseline] run with --no-serp to silence, or set MINIMAX_API_KEY in env/.env.production.\n`);
    return null;
  }
}

// ─── run ────────────────────────────────────────────────────────────────────
const audits = results.map(auditOne).filter(Boolean);

console.log(`\n${'='.repeat(80)}`);
console.log(`TRINITY AUDIT — ${audits.length} page(s)`);
console.log('='.repeat(80));
for (const a of audits) {
  console.log(`\n${a.slug} (${a.pageType})`);
  console.log(`  Buyer Decision Chain : ${a.buyerScore}/100`);
  console.log(`  EEAT + Info Gain     : ${a.eeatScore}/100`);
  console.log(`  GenAI Citation       : ${a.aiScore}/100`);
  console.log(`  ${'─'.repeat(40)}`);
  console.log(`  TOTAL                 : ${a.total}/100`);
}

// ─── save full reports ──────────────────────────────────────────────────────
fs.mkdirSync('audit-results', { recursive: true });
for (const a of audits) {
  const reportPath = `audit-results/${a.slug}.md`;
  fs.mkdirSync(path.dirname(reportPath), { recursive: true });
  const lines = [
    `# Trinity Audit: ${a.slug}`,
    ``, `**Type**: ${a.pageType}`,
    `**File**: ${a.pageFile}`,
    ...(a.contentFile ? [`**Content**: ${a.contentFile}`] : []),
    `**Score**: ${a.total}/100  (Buyer ${a.buyerScore} | EEAT ${a.eeatScore} | AI ${a.aiScore})`,
    ...(a.distAudited && a.runtimeTypes ? [``, '**Runtime @types detected (dist/)**: ' + a.runtimeTypes.map(function(t){ return ['BlogPosting','Article','Product','Service'].includes(t) ? '**' + t + '** (core)' : t; }).join(', ')] : []),
    ...(a.expectedCore && a.expectedCore.length ? ['**Expected core @type** for pageType=' + a.pageType + ': ' + a.expectedCore.join(', ')] : []),
    ...(a.missingCoreTypes && a.missingCoreTypes.length ? ['**\u274C MISSING core @type**: ' + a.missingCoreTypes.join(', ')] : []),
    ``,
    `## 1. Buyer Decision Chain (${a.buyerScore}/100)`,
    ``,
    '| Stage | Status |',
    '|---|---|',
    ...Object.entries(a.buyer).map(([k, v]) => `| ${k} | ${v ? '✅' : '❌'}|`),
    ``,
    `## 2. Google EEAT + Information Gain (${a.eeatScore}/100)`,
    ``,
    '| Signal | Status |',
    '|---|---|',
    ...Object.entries(a.eeat).map(([k, v]) => {
      const isNum = typeof v === 'number';
      const status = isNum ? (k === 'specificMetrics' ? (v >= 5 ? `✅ ${v}` : `⚠️ ${v} < 5`) : `✅ ${v}`) : (v ? '✅' : '❌');
      return `| ${k} | ${status} |`;
    }),
    ``,
    `## 3. Generative AI Citation (${a.aiScore}/100)`,
    ``,
    '| Signal | Status |',
    '|---|---|',
    ...Object.entries(a.ai).map(([k, v]) => `| ${k} | ${v ? '✅' : '❌'}|`),
    ``,
    `## P0 Fix List`,
    ``,
    ...Object.entries(a.buyer).filter(([_, v]) => !v).map(([k]) => `- Buyer: add stage "${k}"`),
    ...Object.entries(a.eeat).filter(([_, v]) => !v).map(([k]) => `- EEAT/IG: add signal "${k}"`),
    ...Object.entries(a.ai).filter(([_, v]) => !v).map(([k]) => `- AI: add signal "${k}"`),
  ];
  fs.writeFileSync(reportPath, lines.join('\n') + '\n');
}

// ─── Orchestration: SERP baseline integration ───────────────────────────────
if (serpEnabled && !scanAll) {
  const normalizedSlug = normalizeInput(slug);
  // Re-locate the page + content files
  const dyn = !fs.existsSync(`src/pages/${normalizedSlug}.astro`)
    ? resolveDynamicRoute(normalizedSlug) : null;
  const pagePath = fs.existsSync(`src/pages/${normalizedSlug}.astro`)
    ? `src/pages/${normalizedSlug}.astro`
    : dyn?.template;
  const contentPath = dyn?.contentFile;
  if (pagePath && fs.existsSync(pagePath)) {
    let pageText = fs.readFileSync(pagePath, 'utf8');
    if (contentPath && fs.existsSync(contentPath)) pageText += '\n' + fs.readFileSync(contentPath, 'utf8');

    // Resolve keyword: CLI > frontmatter > slug-as-keyword fallback
    let keyword = keywordArg;
    if (!keyword && contentPath && contentPath.endsWith('.md')) {
      const md = fs.readFileSync(contentPath, 'utf8');
      const fm = md.match(/^---\n([\s\S]*?)\n---/);
      if (fm) {
        const km = fm[1].match(/^\s*keywords?\s*:\s*\[([^\]]+)\]/m);
        if (km) keyword = km[1].split(',')[0].trim().replace(/^['"]|['"]$/g, '');
      }
    }
    if (!keyword) keyword = normalizedSlug.split('/').pop().replace(/-/g, ' ');

    console.log(`\nSERP BASELINE (LLM-inferred, no real fetch) for keyword: "${keyword}"`);
    const serpResult = await runSerpComparison(keyword, pageText);
    if (serpResult) {
      const { baseline, diff, cached } = serpResult;
      console.log(`  Cache hit: ${cached ? 'yes' : 'no (fresh inference)'}`);
      console.log(`  Avg word count (top-10 est.): ${baseline.avgWordCount}`);
      console.log(`  Must-have signals missing: ${diff.missingSignals.length}`);
      console.log(`  Common sections missing:    ${diff.missingSections.length}`);

      // Append SERP section to the corresponding audit-results/<slug>.md
      const reportPath = `audit-results/${normalizedSlug}.md`;
      if (fs.existsSync(reportPath)) {
        const md = fs.readFileSync(reportPath, 'utf8');
        const serpLines = [
          '',
          `## 4. SERP Baseline (LLM-inferred top-10) for "${keyword}"`,
          '',
          `*Source: MiniMax-M3 inference (no real SERP fetch). Cache: \`audit-results/serp-baseline/\``,
          ``,
          `**Avg word count of top-10**: ${baseline.avgWordCount}`,
          `**Schema types common in top-10**: ${(baseline.schemaTypes || []).join(', ')}`,
          `**Common sections** (top-10): ${(baseline.commonSections || []).map(s => `\`${s}\``).join(', ')}`,
          `**Typical citation domains**: ${(baseline.externalDomains || []).join(', ')}`,
          ``,
          `### Page-vs-baseline deltas`,
          ``,
          `| Check | Status |`,
          `|---|---|`,
          ...Object.entries(diff.checks).map(([k, v]) => `| ${k} | ${v ? '✅' : '❌'} |`),
          ``,
          `### Missing must-have signals`,
          ...diff.missingSignals.map(s => `- ${s}`),
          ``,
          `### Missing common sections`,
          ...diff.missingSections.map(s => `- ${s}`),
          ``,
          `### Differentiators to consider`,
          ...(baseline.differentiators || []).map(s => `- ${s}`),
        ];
        fs.writeFileSync(reportPath, md + serpLines.join('\n') + '\n');
        console.log(`  → appended to ${reportPath}`);
      }
    }
  }
}

console.log(`\nFull reports saved to audit-results/\n`);
