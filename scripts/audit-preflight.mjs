#!/usr/bin/env node
/**
 * scripts/audit-preflight.mjs — local pre-flight checker that mirrors all
 * Trinity Audit detectors (scripts/audit-trinity.mjs) WITHOUT requiring dist.
 *
 * Use this on any blog post to verify all markdown-fixable detectors pass
 * before doing a full build + audit-trinity run.
 *
 * Usage:
 *   node scripts/audit-preflight.mjs blog/<slug>
 *   node scripts/audit-preflight.mjs <path-to-md-file>
 *   node scripts/audit-preflight.mjs blog/<slug> --dist dist/<slug>/index.html
 *
 * Output: per-detector PASS/FAIL + total + P0 fix list.
 */

import fs from 'fs';
import path from 'path';

const rawArgs = process.argv.slice(2);
let distPath = null;
let target = null;
for (let i = 0; i < rawArgs.length; i++) {
  if (rawArgs[i] === '--dist') { distPath = rawArgs[++i]; continue; }
  target = rawArgs[i];
}
if (!target) { console.error('Usage: node scripts/audit-preflight.mjs <slug|file.md> [--dist <index.html>]'); process.exit(1); }

const isFile = target.endsWith('.md');
const mdPath = isFile ? target : `src/content/blog/${target.replace(/^blog\//,'')}.md`;
const pagePath = isFile
  ? 'src/pages/blog/[...slug].astro'
  : `src/pages/blog/${target.replace(/^blog\//,'')}.astro`;
const fallbackPage = 'src/pages/blog/[...slug].astro';

let mdContent = '', pageContent = '';
try { mdContent = fs.readFileSync(mdPath, 'utf8'); } catch (e) { console.error('MD not found:', mdPath); process.exit(1); }
try { pageContent = fs.readFileSync(pagePath, 'utf8'); } catch { pageContent = fs.readFileSync(fallbackPage, 'utf8'); }

const pageDir = path.dirname(pagePath).replace(/\\/g, '/');
const importedComponents = [...pageContent.matchAll(/import\s+([A-Z][A-Za-z]+)\s+from\s+['"]([^'"]+)['"]/g)].map(m => {
  const rawPath = m[2];
  let resolved;
  if (rawPath.startsWith('.')) resolved = path.resolve(pageDir, rawPath).replace(/\\/g, '/');
  else resolved = 'src/' + rawPath;
  const fullPath = resolved.endsWith('.astro') ? resolved : resolved + '.astro';
  if (fs.existsSync(fullPath)) { try { return fs.readFileSync(fullPath, 'utf8'); } catch { return null; } }
  return null;
}).filter(Boolean);
const content = mdContent + '\n' + pageContent;
const allContent = content + '\n' + importedComponents.join('\n');

let runtimeTypes = null;
if (!distPath) {
  const slug = isFile ? target.replace(/^src\/content\/blog\//,'').replace(/\.md$/,'') : target.replace(/^blog\//,'');
  distPath = `dist/${slug}/index.html`;
}
try {
  if (fs.existsSync(distPath)) {
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

const buyer = {
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

const specificMetricsCount = (allContent.match(/\b\d+(\.\d+)?\s*(mm|μm|Ra|W\/m·K|°C|bar|kg|ksi|MPa|years?|months?|weeks?|parts?|pcs)\b/gi) || []).length;
const externalLinksCount = (allContent.match(/https?:\/\/(?!cnc\.bozemetal\.com|bozemetal\.com|#)/gi) || []).length;

const eeat = {
  experienceSignal: /case stud|client|customer|yield|reduction|delivery|prototype|production run/i.test(content),
  yearsInBusiness:   /\bsince\s*20\d{2}|founded in 20\d{2}/i.test(allContent),
  specificMetrics:  specificMetricsCount >= 5,
  specificExamples: /for example|e\.g\.|such as|instance|case stud/i.test(content),
  standardCitation: /ASTM|ISO|ASME|AMS|AS9100|NADCAP|MIL-STD|Fed-Std/i.test(content),
  certification:    /ISO 9001|AS9100|NADCAP| certified|certification/i.test(allContent),
  externalLinks:    externalLinksCount >= 2,
  teamAuthority:    /team|engineer|technician|operator|expert|specialist/i.test(content),
  quantified:       /\d+(\.\d+)?\s*%|\d+(\.\d+)?\s*x|\$\d+/i.test(content),
  sourceDisclosure: /source:|reference:|cited from|according to/i.test(content),
  freshnessDate:    /20\d{2}-\d{2}-\d{2}|updated|revised|published/i.test(content),
  uniqueDataPoint:  /proprietary|original (research|data|study)|first-hand|our (test|measure|study)/i.test(content),
  proprietaryFrame: /framework|methodology|decision matrix|selection matrix/i.test(content),
};

const ai = {
  schemaOrg:        runtimeTypes ? runtimeTypes.size > 0 : /<script\s+type="application\/ld\+json"/.test(allContent),
  coreTypePresent:  /"@type":\s*"(Article|BlogPosting|NewsArticle|Product|Service|WebApplication|HowTo|FAQPage)"/i.test(allContent),
  breadcrumbSchema: /itemListElement|BreadcrumbList/.test(allContent),
  faqSchema:        /FAQPage/.test(allContent),
  howToSchema:      /"@type":\s*"HowTo"/.test(allContent),
  articleSchema:    /"@type":\s*"(Article|BlogPosting|NewsArticle)"/i.test(allContent),
  productSchema:    /"@type":\s*"(Product|Service)"/.test(allContent),
  faqHtmlPattern:   /<details>|"@type":\s*"Question"/i.test(allContent),
  realTableElement: /<table[^>]*>/.test(allContent),
  bestForPattern:   /Best for[:\s]|Not for[:\s]|Ideal for|Not suitable for/i.test(allContent),
  headingNumbered:  /Step\s+\d+:|^##\s+\d+\.|^###\s+\d+\./m.test(content),
  bulletOrStepList: /<ol[^>]*>|<ul[^>]*>/i.test(content),
  quotedSpec:       /"[^"]{20,200}"/.test(allContent) && !/"[a-z]+(-[a-z0-9]+){2,}"/.test(allContent),
};

const score = (obj) => Math.round(Object.values(obj).filter(Boolean).length / Object.keys(obj).length * 100);
const buyerScore = score(buyer), eeatScore = score(eeat), aiScore = score(ai);
const total = Math.round((buyerScore + eeatScore + aiScore) / 3);

console.log(`\n=== Trinity Pre-flight: ${target} ===`);
console.log(`dist: ${runtimeTypes ? 'YES (' + [...runtimeTypes].length + ' types)' : 'NO (source fallback)'}`);
if (runtimeTypes) console.log(`runtime types: ${[...runtimeTypes].sort().join(', ')}`);
console.log(`\nBuyer (${buyerScore}/100):`);
for (const [k,v] of Object.entries(buyer)) console.log(`  ${v?'✅':'❌'} ${k}`);
console.log(`\nEEAT (${eeatScore}/100) [metrics=${specificMetricsCount} extLinks=${externalLinksCount}]:`);
for (const [k,v] of Object.entries(eeat)) console.log(`  ${v?'✅':'❌'} ${k}`);
console.log(`\nAI (${aiScore}/100):`);
for (const [k,v] of Object.entries(ai)) console.log(`  ${v?'✅':'❌'} ${k}`);
console.log(`\nTOTAL: ${total}/100  (Buyer ${buyerScore} | EEAT ${eeatScore} | AI ${aiScore})\n`);

const p0 = [];
for (const [k,v] of Object.entries(buyer)) if (!v) p0.push(`Buyer: add stage "${k}"`);
for (const [k,v] of Object.entries(eeat)) if (!v) p0.push(`EEAT: add signal "${k}"`);
for (const [k,v] of Object.entries(ai)) if (!v) p0.push(`AI: add signal "${k}"`);
if (p0.length) { console.log('P0 Fix List:'); p0.forEach(x => console.log(`  - ${x}`)); }
