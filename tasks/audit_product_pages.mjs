/**
 * tasks/audit_product_pages.mjs — Phase 0 audit
 *
 * Scans all dist/index.html files and reports every page that declares
 * the schema.org Product type. Output: tasks/audit-report.json plus
 * a stdout summary.
 *
 * Purpose:
 *   1. Inventory all pages that emit Product structured data. We expect:
 *      services hub, products/titanium-cnc-parts legacy detail, and
 *      the 260 product-entity pages.
 *   2. For each Product entity, capture:
 *        - url, id, name, category, manufacturer id, brand id
 *        - offers availability, url, price, priceCurrency, seller id
 *        - presence of review and aggregateRating
 *   3. Flag B2B-RFQ signals vs retail signals so we can decide per-page:
 *        - KEEP_AS_IS_B2B   — legit B2B product detail
 *        - KEEP_WITH_GUARDS — needs businessModel anchor
 *        - REMOVE_ENTITY    — wrong page type (should be Service)
 *        - NEEDS_REVIEW     — ambiguous
 */

import fs from 'fs';
import path from 'path';

const DIST = 'dist';
const REPORT_PATH = 'tasks/audit-report.json';

function parseAllLdJson(html) {
  const graph = [];
  const re = /<script\s+type="application\/ld\+json">([\s\S]*?)<\/script>/g;
  let m;
  while ((m = re.exec(html)) !== null) {
    try {
      const parsed = JSON.parse(m[1]);
      if (parsed['@graph']) graph.push(...parsed['@graph']);
      else if (Array.isArray(parsed)) graph.push(...parsed);
      else graph.push(parsed);
    } catch (e) { /* skip malformed blocks */ }
  }
  return graph;
}

function recWalk(dir, files = []) {
  if (!fs.existsSync(dir)) return files;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) recWalk(full, files);
    else if (entry.name === 'index.html') files.push(full);
  }
  return files;
}

function classifyPage(relPath) {
  if (relPath === 'services/index.html') return 'services-hub';
  if (relPath === 'products/index.html') return 'products-hub';
  if (relPath === 'products/titanium-cnc-parts/index.html') return 'product-detail-legacy';
  if (relPath.startsWith('products/product-entities/')) return 'product-entity';
  if (relPath.startsWith('products/')) return 'product-other';
  if (relPath.startsWith('industries/')) return 'industry';
  if (relPath.startsWith('blog/')) return 'blog';
  return 'other';
}

function analyzeProduct(product) {
  const offers = Array.isArray(product.offers)
    ? product.offers[0]
    : product.offers;
  const signals = {
    hasOffer: Boolean(offers),
    hasPrice: offers ? (offers.price != null || (offers.priceSpecification && offers.priceSpecification.price != null)) : false,
    hasCurrency: offers ? (offers.priceCurrency != null || (offers.priceSpecification && offers.priceSpecification.priceCurrency != null)) : false,
    availability: offers ? offers.availability : null,
    hasRfqUrl: offers ? /\/(rfq|quote|request-quote|contact)\/?/i.test(offers.url || '') : false,
    hasReview: Array.isArray(product.review) ? product.review.length > 0 : Boolean(product.review),
    hasAggregateRating: Boolean(product.aggregateRating),
    category: product.category || null,
    manufacturerId: product.manufacturer ? product.manufacturer['@id'] : null,
    brandId: product.brand ? product.brand['@id'] : null,
  };

  let verdict;
  if (signals.hasRfqUrl && !signals.hasPrice && signals.availability && signals.availability.endsWith('MadeToOrder')) {
    verdict = 'KEEP_AS_IS_B2B';
  } else if (signals.hasRfqUrl) {
    verdict = 'KEEP_WITH_GUARDS';
  } else if (signals.hasPrice && signals.hasCurrency) {
    verdict = 'KEEP_RETAIL';
  } else if (!signals.hasOffer) {
    verdict = 'REMOVE_OFFER_OR_KEEP';
  } else {
    verdict = 'NEEDS_REVIEW';
  }
  return Object.assign({}, signals, { verdict });
}

const files = recWalk(DIST);
const report = {
  generatedAt: new Date().toISOString(),
  totalHtmlPages: files.length,
  pagesWithProduct: 0,
  byVerdict: { KEEP_AS_IS_B2B: 0, KEEP_WITH_GUARDS: 0, KEEP_RETAIL: 0, REMOVE_OFFER_OR_KEEP: 0, NEEDS_REVIEW: 0 },
  byPageType: {},
  details: [],
};

for (const f of files) {
  const html = fs.readFileSync(f, 'utf8');
  const graph = parseAllLdJson(html);
  const products = graph.filter(function (e) { return e['@type'] === 'Product'; });
  if (products.length === 0) continue;

  const rel = path.relative(DIST, f).replace(/\\/g, '/');
  const pageUrl = 'https://cnc.bozemetal.com/' + (rel === 'index.html' ? '' : rel.replace('index.html', ''));
  const pageType = classifyPage(rel);

  for (const product of products) {
    report.pagesWithProduct++;
    const analysis = analyzeProduct(product);
    report.byVerdict[analysis.verdict] = (report.byVerdict[analysis.verdict] || 0) + 1;
    report.byPageType[pageType] = (report.byPageType[pageType] || 0) + 1;
    report.details.push(Object.assign({
      page: rel,
      pageType: pageType,
      pageUrl: pageUrl,
      productId: product['@id'] || null,
      productName: product.name || null,
    }, analysis));
  }
}

fs.writeFileSync(REPORT_PATH, JSON.stringify(report, null, 2));

console.log('=== Phase 0 Audit: Product Schema Coverage ===');
console.log('Total HTML pages scanned: ' + report.totalHtmlPages);
console.log('Pages with Product:       ' + report.pagesWithProduct);
console.log('');
console.log('By page type:');
const byPageTypeSorted = Object.entries(report.byPageType).sort(function (a, b) { return b[1] - a[1]; });
for (const entry of byPageTypeSorted) {
  console.log('  ' + entry[0].padEnd(28) + ' ' + entry[1]);
}
console.log('');
console.log('By verdict:');
const byVerdictSorted = Object.entries(report.byVerdict).sort(function (a, b) { return b[1] - a[1]; });
for (const entry of byVerdictSorted) {
  console.log('  ' + entry[0].padEnd(28) + ' ' + entry[1]);
}
console.log('');
console.log('Detailed report written to: ' + REPORT_PATH);

const suspicious = report.details.filter(function (d) {
  return d.pageType === 'services-hub'
    || d.pageType === 'products-hub'
    || d.verdict === 'NEEDS_REVIEW'
    || d.verdict === 'REMOVE_OFFER_OR_KEEP';
});
if (suspicious.length) {
  console.log('');
  console.log('=== Suspicious cases (require manual decision) ===');
  for (const s of suspicious) {
    console.log('  [' + s.pageType + '] ' + s.page + ' -> ' + s.productName + ' (verdict: ' + s.verdict + ')');
  }
}