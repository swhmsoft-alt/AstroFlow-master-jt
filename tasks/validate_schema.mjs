import fs from 'fs';

/**
 * Schema integrity validator — must stay in sync with the actual entity graph
 * defined in src/lib/schema.ts (entity @id namespace) and the product page
 * template (src/pages/products/product-entities/[...slug].astro).
 *
 * Policy:
 *  - Global entities every page must reference the Legal Org
 *    (https://www.bozemetal.com/#organization), NOT cnc.bozemetal.com/#organization
 *    (the manufacturing center is intentionally NOT a second legal entity).
 *  - Product offers: B2B RFQ Offer is price-less (MadeToOrder → /rfq/,
 *    seller = Legal Org, itemOffered back-refs the Product @id).
 *    A Product Offer carrying `price`/`priceCurrency` is a FAIL (fabricated
 *    price — Boze products are custom-manufactured, not retail stock).
 */

const PAGES = [
  { name: 'Home', file: 'dist/index.html' },
  { name: 'Services Hub', file: 'dist/services/index.html' },
  { name: 'Service Detail', file: 'dist/titanium-cnc-machining-services/cnc-milling-turning/index.html' },
  { name: 'Products Hub', file: 'dist/products/index.html' },
  { name: 'Product Detail (Legacy)', file: 'dist/products/titanium-cnc-parts/index.html' },
  { name: 'Product Entity (Mouse)', file: 'dist/products/product-entities/titanium-3d-printed-ergonomic-mouse/index.html' },
  { name: 'Product Entity (Acetabular)', file: 'dist/products/product-entities/titanium-acetabular-cup/index.html' },
  { name: 'Blog Index', file: 'dist/blog/index.html' },
  { name: 'Blog Article', file: 'dist/blog/aerospace-titanium-full-process-supply/index.html' },
  { name: 'RFQ', file: 'dist/rfq/index.html' },
];

const LEGAL_ORG_ID = 'https://www.bozemetal.com/#organization';
const WEBSITE_ID = 'https://cnc.bozemetal.com/#website';

/** Extract + merge every application/ld+json block on the page into one @graph array. */
function parseAllLdJson(html) {
  const graph = [];
  const re = /<script\s+type="application\/ld\+json">([\s\S]*?)<\/script>/g;
  let m;
  while ((m = re.exec(html)) !== null) {
    const parsed = JSON.parse(m[1]);
    if (parsed['@graph']) graph.push(...parsed['@graph']);
    else if (Array.isArray(parsed)) graph.push(...parsed);
    else graph.push(parsed);
  }
  return graph;
}

let pass = 0;
let fail = 0;

for (const p of PAGES) {
  try {
    const html = fs.readFileSync(p.file, 'utf8');
    const graph = parseAllLdJson(html);
    if (graph.length === 0) { console.log(`FAIL ${p.name}: no ld+json`); fail++; continue; }

    const types = graph.map(e => e['@type']);
    const org = graph.find(e => e['@type'] === 'Organization');
    const site = graph.find(e => e['@type'] === 'WebSite');
    const page = graph.find(e => e['@type'] === 'WebPage');
    const breadcrumb = graph.find(e => e['@type'] === 'BreadcrumbList');
    const product = graph.find(e => e['@type'] === 'Product');

    console.log(`\n=== ${p.name} ===`);
    console.log(`  Types: [${types.join(', ')}]`);
    console.log(`  Org @id: ${org?.['@id'] || 'MISSING'}`);
    console.log(`  WebSite -> publisher @id: ${site?.publisher?.['@id'] || 'MISSING'}`);
    console.log(`  WebPage -> isPartOf @id: ${page?.['isPartOf']?.['@id'] || 'MISSING'}`);
    console.log(`  Breadcrumb Home label: "${breadcrumb?.itemListElement?.[0]?.name || 'MISSING'}"`);

    let pageOk = true;

    // ── Global entity graph integrity ─────────────────────────────
    if (org?.['@id'] !== LEGAL_ORG_ID) { console.log(`  FAIL: bad org @id (${org?.['@id']})`); pageOk = false; }
    if (site?.publisher?.['@id'] !== LEGAL_ORG_ID) { console.log(`  FAIL: bad publisher ref`); pageOk = false; }
    if (page?.['isPartOf']?.['@id'] !== WEBSITE_ID) { console.log(`  FAIL: bad isPartOf ref`); pageOk = false; }

    // ── Product offer policy ───────────────────────────────────────
    if (product) {
      const offers = product['offers'];
      if (offers) {
        const offerArr = Array.isArray(offers) ? offers : [offers];
        for (const o of offerArr) {
          if (o['price'] != null || o['priceCurrency'] != null) {
            console.log(`  FAIL: Product has priced Offer (price=${o['price']})`);
            pageOk = false;
          }
        }
        const rfqOffer = offerArr[0];
        if (!rfqOffer?.['url'] || !String(rfqOffer['url']).endsWith('/rfq/')) {
          console.log(`  FAIL: RFQ Offer url must point to /rfq/`);
          pageOk = false;
        }
        if (rfqOffer['availability'] !== 'https://schema.org/MadeToOrder') {
          console.log(`  FAIL: RFQ Offer availability must be https://schema.org/MadeToOrder`);
          pageOk = false;
        }
        if (rfqOffer['seller']?.['@id'] !== LEGAL_ORG_ID) {
          console.log(`  FAIL: RFQ Offer seller @id must be ${LEGAL_ORG_ID}`);
          pageOk = false;
        }
        if (rfqOffer['itemOffered']?.['@id'] !== product['@id']) {
          console.log(`  FAIL: RFQ Offer itemOffered must back-ref the Product @id`);
          pageOk = false;
        }
        console.log(`  RFQ Offer: url=${rfqOffer['url']} · availability=${rfqOffer['availability']} · itemOffered=${rfqOffer['itemOffered']?.['@id']}`);
      } else {
        console.log(`  WARN: Product present but no offers`);
      }
    }

    if (!pageOk) { fail++; continue; }
    pass++;
    console.log(`  PASS`);
  } catch (e) {
    console.log(`FAIL ${p.name}: ${e.message}`);
    fail++;
  }
}

console.log(`\n=== SUMMARY ===`);
console.log(`Pass: ${pass}, Fail: ${fail}`);
process.exit(fail > 0 ? 1 : 0);
