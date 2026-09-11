#!/usr/bin/env node
/**
 * scripts/audit-trinity.mjs
 *
 * Trinity audit: Buyer Decision Chain × Google EEAT × AI Citation (RAG).
 *
 * Scoped around two project goals:
 *   (1) guide the buyer decision chain to a conversion;
 *   (2) be cite-worthy by RAG systems (Google AI Overviews, Perplexity,
 *       ChatGPT Search, …) — i.e. indexed AND structurally readable.
 *
 * Per-stage pass/fail, not a weighted average. A page passes the publish
 * gate when every required stage for its pageType has its required
 * evidence, AND the page-level EEAT authority floor AND AI readability
 * floor are met. The P0 Fix List is organised by blocked stage, not by
 * axis, so each line corresponds to a concrete buyer-path failure.
 *
 * Gate configuration is data-driven via data/audit-gate-config.json —
 * edit that file to adjust per-pageType requirements without touching
 * this script.
 *
 * Usage:
 *   node scripts/audit-trinity.mjs <slug>          # single page
 *   node scripts/audit-trinity.mjs --all           # scan src/pages
 *   node scripts/audit-trinity.mjs --all --gate    # enforce gate (exit 1 on fail)
 */

import fs from 'fs';
import path from 'path';

const args = process.argv.slice(2);
const slug = args.find(a => !a.startsWith('--'));
const scanAll = args.includes('--all');
const gateMode = args.includes('--gate');   // exit 1 when any audited page fails its per-type gate

const results = [];

// ─── Gate config (SSOT) ─────────────────────────────────────────────
const GATE_CONFIG_PATH = 'data/audit-gate-config.json';
const gateConfig = JSON.parse(fs.readFileSync(GATE_CONFIG_PATH, 'utf8'));

if (scanAll) {
  const walk = (dir) => fs.readdirSync(dir, { withFileTypes: true }).flatMap(d => {
    const p = path.join(dir, d.name).replace(/\\/g, '/');
    if (d.isDirectory()) return walk(p);
    if (d.name.endsWith('.astro')) return [p.replace(/^src\/pages\//, '').replace(/\.astro$/, '').replace(/\/index$/, '')];
    return [];
  });
  for (const s of walk('src/pages')) {
    if (s.startsWith('[') || s.startsWith('_') || s.includes('/_') || s === 'index' || s.endsWith('thank-you') || s.endsWith('404')) continue;
    results.push(s);
  }
  if (slug && !slug.startsWith('--')) results.push(slug);
} else {
  if (!slug) { console.error('Usage: node scripts/audit-trinity.mjs <slug|--all>'); process.exit(1); }
  results.push(slug);
}

// ─── audit one page ──────────────────────────────────────────────
function auditOne(slug) {
  const candidates = [
    `src/pages/${slug}.astro`,
    `src/pages/${slug}/index.astro`,
  ];
  let pageFile = null;
  for (const c of candidates) if (fs.existsSync(c)) { pageFile = c; break; }
  // Dynamic routes: try matching the literal param name first, then any
  // bracketed .astro file in the directory (templates are identical regardless
  // of which param name was chosen — [slug] / [page] / [...slug] are all the
  // same template to the audit script).
  if (!pageFile) {
    const parts = slug.split('/');
    const param = parts[parts.length - 1];
    const dir = parts.length > 1 ? `src/pages/${parts.slice(0, -1).join('/')}` : 'src/pages';
    try {
      const files = fs.readdirSync(dir, { withFileTypes: true })
        .filter(s => s.isFile() && s.name.endsWith('.astro') && /\[(\.\.\.)?[^\]]+\]/.test(s.name));
      const exact = files.find(s => s.name === `[${param}].astro` || s.name === `[...${param}].astro`);
      pageFile = `${dir}/${(exact || files[0]).name}`;
    } catch {}
  }
  if (!pageFile) return null;
  const content = fs.readFileSync(pageFile, 'utf8');

  // Skip pure-redirect shells:
  //   - tiny files (< 1500 chars: usually an `Astro.redirect(...)` shim)
  //   - OR a redirect body (no frontmatter template, only mapping logic)
  //   - OR client-side redirect (<meta http-equiv="refresh"> or window.location)
  // These are forwarders to a canonical URL; auditing them duplicates the
  // real target page and yields a misleading 0/100 score.
  const looksLikeRedirectShell =
    content.length < 1500
    || (/\bAstro\.redirect\s*\(/.test(content) && !/---/.test(content.split('\n').slice(0, 3).join('\n')))
    || /http-equiv=["']refresh["']/.test(content)
    || /window\.location\s*=\s*['"`]/.test(content);
  if (looksLikeRedirectShell) return { slug, pageFile, pageType: 'generic', skipped: true, reason: 'redirect-shell' };

  // Recursively collect transitive component content (page -> layout -> shared
  // components like BrandAbout) so layout-level EEAT/schema signals count.
  function resolveImport(fromDir, rawPath) {
    let resolved;
    if (rawPath.startsWith('.')) resolved = path.resolve(fromDir, rawPath).replace(/\\/g, '/');
    else if (rawPath.startsWith('@')) resolved = 'src/' + rawPath.replace(/^@/, '');
    else if (rawPath.startsWith('src/')) resolved = rawPath;
    else return null;
    const fp = resolved.endsWith('.astro') ? resolved : resolved + '.astro';
    return fs.existsSync(fp) ? fp : null;
  }
  const visited = new Set();
  const componentContents = [];
  function collect(text, fromDir) {
    const re = /import\s+([A-Z][A-Za-z]+)\s+from\s+['"]([^'"]+)['"]/g;
    let m;
    while ((m = re.exec(text)) !== null) {
      const fp = resolveImport(fromDir, m[2]);
      if (!fp || visited.has(fp)) continue;
      visited.add(fp);
      try {
        const c = fs.readFileSync(fp, 'utf8');
        componentContents.push(c);
        collect(c, path.dirname(fp).replace(/\\/g, '/'));
      } catch {}
    }
  }
  collect(content, path.dirname(pageFile).replace(/\\/g, '/'));
  let allContent = content + '\n' + componentContents.join('\n');
  try { const i18nMap = JSON.parse(fs.readFileSync('src/i18n/translations/en.json','utf8')); allContent = allContent.replace(/\bt\(\s*['"][^'"]+['"]\s*\)/g,(m,k)=>i18nMap[k]!=null?i18nMap[k]:m); } catch (e) {}

  // ─── page type detection ─────────────────────────────────────────
  // Blog taxonomy (must be evaluated BEFORE the generic /blog|post/ rule):
  //   /blog                  → blog-index
  //   /blog/category/[slug]  → blog-index
  //   /blog/page/[page]      → blog-index
  //   /blog/[slug]           → blog-post   (article detail, the long-tail money page)
  //   /about                 → narrative   (brand storytelling, not transactional)
  //   /privacy-policy        → narrative
  //   /cookie-policy         → narrative
  let pageType = 'unknown';
  const slugLower = slug.toLowerCase();
  if (slugLower === 'about' || slugLower === 'privacy-policy' || slugLower === 'cookie-policy') {
    pageType = 'narrative';
  } else if (slugLower.startsWith('blog/category/') || slugLower.startsWith('blog/page/') || slugLower === 'blog' || slugLower === 'blog/index') {
    pageType = 'blog-index';
  } else if (slugLower.startsWith('blog/')) {
    pageType = 'blog-post';
  } else if (content.includes('AudienceHub industry=')) {
    pageType = 'service';
  } else if (/IndustryHub|industries-served/.test(content)) {
    pageType = 'industry';
  } else if (/material|alloy|grade/i.test(slug)) pageType = 'material';
  else if (/equipment|cnc-mill|turn-mill|wire-edm|surface-treatment|additive|forming|fabrication/i.test(slug)) pageType = 'capability';
  else if (/titanium-(machining|cnc|cnc-machining|grinding)/i.test(slug) || slug === 'services') pageType = 'service';
  else if (slug.startsWith('part')) pageType = 'part';

  // ═════════════════════════════════════════════════════════════════
  // 1. BUYER DECISION CHAIN (12 stages)
  // ═════════════════════════════════════════════════════════════════
  const buyerChecks = {
    awareness:        /\bneed to\b|\bi need\b|require[ds]?|looking for|titanium parts?/i.test(allContent),
    painIdentification: /pain|challeng|difficult|hard|issue|problem/i.test(allContent),
    solutionExplore:  /solution|approach|method|capability|axis|process/i.test(allContent),
    capabilityValid:  /part|component|Blisk|implant|bracket|assembly|we (machin|provid|deliver)/i.test(allContent),
    costAssessment:   /cost|price|pricing|\$\d|\d+\s*×\s*baseline|MOQ|minimum order/i.test(allContent),
    timeDecision:     /lead time|weeks?|delivery|turnaround|rush|expedit/i.test(allContent),
    fileProcess:      /\bSTEP\b|\bIGES\b|\bDWG\b|\bDXF\b|\bSolidWorks\b|\bCATIA\b|\bNX\b|CAD|file format|upload drawing|send drawing/i.test(allContent),
    riskMitigation:   /Cpk|capability|yield|defect rate|scrap|inspection|metrology|measure|traceability|MTC|first article|FAlR|tolerance|qualit(y|ies) control|out of tolerance/i.test(allContent),
    decisionRfq:      /RFQ|quote|submit|request|call to action|CTA/i.test(allContent),
    comparison:       /\bvs\.\b|\bvs\s+(Typical|Job|CNC|Shop|Overseas)|compared|alternative|competitor|different from/i.test(allContent),
    capacityLock:     /capacity|monthly|backup machine|redundancy|production volume/i.test(allContent),
    faqResolution:    /FAQ|frequently asked|question/i.test(allContent),
  };
  const buyerScore = Math.round(Object.values(buyerChecks).filter(Boolean).length / Object.keys(buyerChecks).length * 100);

  // ═════════════════════════════════════════════════════════════════
  // 2. GOOGLE EEAT + INFORMATION GAIN
  // ═════════════════════════════════════════════════════════════════
  const eeatChecks = {
    experienceSignal: /case stud|client|customer|yield|reduction|delivery|prototype|production run/i.test(allContent),
    yearsInBusiness:   /\bsince\s*20\d{2}|founded in 20\d{2}/i.test(allContent),
    specificMetrics:  (allContent.match(/\d+(\.\d+)?\s*(mm|µm|Ra|W\/m·?K|°C|bar|kg|ksi|MPa|years?|months?|weeks?|parts?|units?|Hz|rpm|%|in)/gi) || []).length,
    specificExamples: /Blisk|impeller|turbine|hip|knee|prosthet|dental|bracket/i.test(allContent),
    standardCitation: /AMS\s?\d{4}|AS9100|ISO\s?\d+|ASTM\s?[A-Z]\d+|NADCAP|EN\s?\d{4}/.test(allContent),
    certification:    /AS9100D|ISO\s?13485|ISO\s?9001|NADCAP|certified/i.test(allContent),
    externalLinks:    (allContent.match(/href="https?:\/\/(?!bozemetal\.com|.*\.bozemetal\.com)/g) || []).length,
    teamAuthority:     /engineering team|senior engineer|Ph\.D|Mastercam|hyperMILL/i.test(allContent),
    quantified:       /\d+\s*mm|\d+\s*µm|\d+\s*Ra|\d+%/.test(allContent),
    sourceDisclosure: /HEXAGON|MTC|EN 10204|AS9102|FAIR|CMM/i.test(allContent),
    freshnessDate:    /\b20\d{2}\b|datetime|dateModified|datePublished|Last updated/i.test(allContent),
    uniqueDataPoint:  /72%|94%|98%|2,500|10,000|HEXAGON Global S|±0\.0019|Cpk\s*[≥>=]\s*1\.\d+/i.test(allContent),
    proprietaryFrame: /12-stage|12-point|5-dimension|five-dimension|Cpk/i.test(allContent),
  };
  const eeatScore = Math.round(
    (Object.values(eeatChecks).filter((v, i) => {
      const k = Object.keys(eeatChecks)[i];
      if (k === 'specificMetrics') return v >= 5;
      if (k === 'specificExamples' || k === 'externalLinks') return v >= 1;
      if (k === 'uniqueDataPoint') return v >= 1;
      return v === true;
    }).length / Object.keys(eeatChecks).length) * 100
  );

  // ═════════════════════════════════════════════════════════════════
  // 3. GENERATIVE AI CITATION
  // ═════════════════════════════════════════════════════════════════
  const aiChecks = {
    schemaOrg:        /<script[^>]*type=["']application\/ld\+json["']/.test(allContent),
    faqSchema:        /FAQPage/.test(allContent),
    breadcrumbSchema: /itemListElement|BreadcrumbList/.test(allContent),
    productSchema:    /"@type":\s*"(Product|Service)"|@type:\s*['"]Service['"]|@type:\s*['"]Product['"]/i.test(allContent),
    // articleSchema is intent-based: the JSON-LD literal "@type":"Article" only
    // exists in the rendered HTML (set:html={ldJson}), not in source. The
    // article entity is emitted when the page passes pageType="blog-post"
    // + author + pubDate props (see BaseLayout.resolvedArticleHeadline /
    // buildPageGraph blog-post branch in src/lib/schema.ts).
    articleSchema:    /pageType=["']blog-post["']/.test(allContent) && /author=/.test(allContent) && /pubDate=/.test(allContent),
    howToSchema:      /HowTo/.test(allContent),
    faqHtmlPattern:   /<details(\s|>)|"@type":\s*"Question"/i.test(allContent),
    realTableElement: /<table[^>]*>/.test(allContent),
    bestForPattern:   /Best for[:\s]|Not for[:\s]|Ideal for|Not suitable for/i.test(allContent),
    headingNumbered:   /Step\s+\d+:|^##\s+\d+\.|^###\s+\d+\./m.test(content),
    bulletOrStepList: /<ol[^>]*>|<ul[^>]*>/i.test(content),
    quotedSpec:       /"[^"]{20,200}"/.test(allContent),
  };
  const aiScore = Math.round(
    (Object.values(aiChecks).filter((v, i) => {
      const k = Object.keys(aiChecks)[i];
      if (k === 'realTableElement' || k === 'bulletOrStepList' || k === 'quotedSpec') return v === true;
      return v === true;
    }).length / Object.keys(aiChecks).length) * 100
  );

  const total = Math.round((buyerScore + eeatScore + aiScore) / 3);

  // Per-stage pass/fail from gateConfig (driven by SSOT JSON).
  // Axis name mapping: JSON uses 'genai' (human-readable, matches README),
  // runtime bucket is 'ai' (legacy variable name in auditOne).
  const stageResults = evaluateStages(pageType, { genai: aiChecks, eeat: eeatChecks, buyer: buyerChecks });
  const gate = evaluateGate(pageType, { eeat: eeatScore, genai: aiScore, stages: stageResults, pageType });

  return { slug, pageFile, pageType, buyerScore, eeatScore, aiScore, total,
    buyer: buyerChecks, eeat: eeatChecks, ai: aiChecks, stageResults, gate };
}

// ─── per-stage pass/fail evaluation ──────────────────────────────────
//
// For each stage required by the pageType, evaluate each `requires`
// entry as `axis:signalKey` against the runtime bucket. Pass when every
// requirement has a truthy runtime value (or matches an alias OR-group).
function evaluateStages(pageType, signals) {
  const cfg = gateConfig.pageTypes[pageType];
  const requires = cfg?.requires || ['awareness'];
  const stagesById = Object.fromEntries(gateConfig.stages.map(s => [s.id, s]));
  return requires.map(stageId => {
    const def = stagesById[stageId];
    if (!def) return { id: stageId, pass: true, missing: [], _warn: 'unknown stage id in gateConfig' };
    const reqs = def.requires || [];
    const missing = reqs.filter(r => !checkRequirement(r, signals)).map(r => humanizeRequirement(r));
    return { id: stageId, label: def.label, pass: missing.length === 0, missing };
  });
}

// Resolve a single `axis:signalKey` (or alias key) requirement to true/false.
function checkRequirement(req, signals) {
  // Alias (OR-group): aliasMap maps key → array of axis:signal strings.
  if (gateConfig.aliasMap && Object.prototype.hasOwnProperty.call(gateConfig.aliasMap, req)) {
    return gateConfig.aliasMap[req].some(r => checkRequirement(r, signals));
  }
  const [axis, key] = req.split(':');
  const bucket = signals[axis];
  return !!(bucket && bucket[key]);
}

function humanizeRequirement(req) {
  if (gateConfig.aliasMap && gateConfig.aliasMap[req]) return `${req} (= ${gateConfig.aliasMap[req].join(' OR ')})`;
  const [axis, key] = req.split(':');
  return `${axis}:${key}`;
}

function evaluateGate(pageType, ctx) {
  const cfg = gateConfig.pageTypes[pageType];
  // Unrecognised pageType: no gate (advisory only).
  if (!cfg || !cfg.publishGate) return { gated: false };
  const requiredStages = cfg.requires || [];
  const passedStages = ctx.stages.filter(s => s.pass).length;
  // strictStages: every required stage must pass.
  // (default) minTotalStages: at least N required stages pass.
  const stageOk = cfg.publishGate.strictStages
    ? passedStages === requiredStages.length
    : passedStages >= cfg.publishGate.minTotalStages;
  const floorOk = (cfg.floors?.eeat == null || ctx.eeat >= cfg.floors.eeat)
               && (cfg.floors?.genai == null || ctx.genai >= cfg.floors.genai);
  const missing = [];
  if (!stageOk) {
    const req = cfg.publishGate.strictStages
      ? `stages: ${passedStages}/${requiredStages.length} (strict — all required)`
      : `stages: ${passedStages}/${cfg.publishGate.minTotalStages} of required`;
    missing.push(req);
  }
  if (!floorOk) {
    if (cfg.floors?.eeat != null && ctx.eeat < cfg.floors.eeat) missing.push(`eeat floor: ${ctx.eeat}/${cfg.floors.eeat}`);
    if (cfg.floors?.genai != null && ctx.genai < cfg.floors.genai) missing.push(`genai floor: ${ctx.genai}/${cfg.floors.genai}`);
  }
  return {
    gated: true,
    ok: stageOk && floorOk,
    passedStages,
    requiredStages: requiredStages.length,
    minStages: cfg.publishGate.minTotalStages,
    strictStages: !!cfg.publishGate.strictStages,
    floors: cfg.floors,
    missing,
  };
}

// ─── run ──────────────────────────────────────────────────────────
const audits = results.map(auditOne).filter(Boolean);
const skipped = audits.filter(a => a.skipped);
const audited = audits.filter(a => !a.skipped);

console.log(`\n${'='.repeat(80)}`);
console.log(`TRINITY AUDIT — ${audited.length} page(s) audited, ${skipped.length} skipped  (config: ${GATE_CONFIG_PATH})`);
console.log('='.repeat(80));
for (const a of audited) {
  const passedStages = a.stageResults?.filter(s => s.pass).length ?? 0;
  const totalStages = a.stageResults?.length ?? 0;
  console.log(`\n${a.slug} (${a.pageType})`);
  console.log(`  Decision Chain : ${passedStages}/${totalStages} stages pass`);
  console.log(`  EEAT authority : ${a.eeatScore}/100`);
  console.log(`  AI readability : ${a.aiScore}/100`);
  if (a.gate.gated) {
    const f = a.gate.floors || {};
    console.log(`  Floors         : eeat≥${f.eeat ?? '—'} (have ${a.eeatScore}) | genai≥${f.genai ?? '—'} (have ${a.aiScore})`);
    console.log(`  Gate           : ${a.gate.ok ? '✅ PASS' : '❌ FAIL'}${a.gate.missing.length ? ' — ' + a.gate.missing.join('; ') : ''}`);
  } else {
    console.log(`  Gate           : n/a (no publishGate in config for ${a.pageType})`);
  }
}
if (skipped.length) {
  console.log(`\nSkipped (redirect-shells, not real pages):`);
  for (const s of skipped) console.log(`  ⏭  ${s.slug} (${s.reason})`);
}

// ─── save full reports ─────────────────────────────────────────────
fs.mkdirSync('audit-results', { recursive: true });
for (const a of audited) {
  const reportPath = `audit-results/${a.slug}.md`;
  fs.mkdirSync(path.dirname(reportPath), { recursive: true });
  const passedStages = a.stageResults?.filter(s => s.pass).length ?? 0;
  const totalStages = a.stageResults?.length ?? 0;
  const lines = [
    `# Trinity Audit: ${a.slug}`,
    ``,
    `**Type**: ${a.pageType}`,
    `**File**: ${a.pageFile}`,
    ``,
    `## Summary`,
    ``,
    `| Metric | Value |`,
    `|---|---|`,
    `| Decision Chain stages passing | ${passedStages}/${totalStages} |`,
    `| EEAT authority score | ${a.eeatScore}/100 |`,
    `| AI (RAG) readability score | ${a.aiScore}/100 |`,
    a.gate.gated
      ? `| Publish gate | ${a.gate.ok ? '✅ PASS' : `❌ FAIL (${a.gate.missing.join('; ')})`} |`
      : `| Publish gate | n/a |`,
    ``,
    `## 1. Decision-Chain Stages (per-stage pass/fail from ${GATE_CONFIG_PATH})`,
    ``,
    '| # | Stage | Status | Missing evidence |',
    '|---|---|---|---|',
    ...(a.stageResults || []).map((s, i) => {
      const missing = s.missing.length ? s.missing.map(m => `\`${m}\``).join(', ') : '—';
      return `| ${i + 1} | ${s.label || s.id} | ${s.pass ? '✅' : '❌'} | ${missing} |`;
    }),
    ``,
    `## 2. EEAT + Information Gain Signals (${a.eeatScore}/100)`,
    ``,
    '| Signal | Status |',
    '|---|---|',
    ...Object.entries(a.eeat).map(([k, v]) => {
      const isNum = typeof v === 'number';
      const status = isNum ? (k === 'specificMetrics' ? (v >= 5 ? `✅ ${v}` : `⚠️ ${v} < 5`) : `✅ ${v}`) : (v ? '✅' : '❌');
      return `| ${k} | ${status} |`;
    }),
    ``,
    `## 3. Generative AI Citation (RAG) Signals (${a.aiScore}/100)`,
    ``,
    '| Signal | Status |',
    '|---|---|',
    ...Object.entries(a.ai).map(([k, v]) => `| ${k} | ${v ? '✅' : '❌'}`),
    ``,
    `## P0 Fix List (organised by blocked decision-chain stage)`,
    ``,
    ...(a.stageResults || [])
      .filter(s => !s.pass)
      .flatMap(s => s.missing.map(m => `- **${s.label || s.id}** — ${m}`)),
    ...((a.stageResults || []).filter(s => !s.pass).length === 0 ? ['_No blocked stages — all required stages pass._'] : []),
  ];
  fs.writeFileSync(reportPath, lines.join('\n') + '\n');
}

console.log(`\nFull reports saved to audit-results/\n`);

// ─── publish gate evaluation ─────────────────────────────────────────────
let failed = 0;
const gated = audited.filter(a => a.gate.gated);
if (gated.length) {
  console.log(`\n${'='.repeat(80)}`);
  console.log(`PUBLISH GATE${gateMode ? ' (strict — --gate)' : ' (advisory — pass --gate to enforce)'}`);
  console.log('='.repeat(80));
  for (const a of gated) {
    const status = a.gate.ok ? '✅ PASS' : '❌ FAIL';
    const why = a.gate.ok ? '' : ` — ${a.gate.missing.join('; ')}`;
    console.log(`  ${status}  ${a.slug} (${a.pageType})${why}`);
    if (!a.gate.ok) failed++;
  }
  console.log(`\n  ${failed === 0 ? 'All gated pages pass.' : `${failed} page(s) below gate.`}`);
}
if (gateMode && failed > 0) {
  console.error(`\n❌ --gate: refusing to publish (${failed} page(s) below threshold).`);
  process.exit(1);
}