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
  { name: 'AIO Seed 1 — Grade Selection (HowTo + Speakable + ItemList)', file: 'dist/how-to-choose-titanium-grade/index.html' },
  { name: 'AIO Seed 2 — AS9100 Supplier (HowTo + Speakable)', file: 'dist/how-to-qualify-as9100-titanium-supplier/index.html' },
  { name: 'AIO Seed 3 — CNC Part Specification (HowTo + Speakable)', file: 'dist/how-to-specify-titanium-cnc-machined-part/index.html' },
  { name: 'AIO Seed 4 — MTR Reading (HowTo + Speakable)', file: 'dist/how-to-read-titanium-mill-test-report/index.html' },
];

const LEGAL_ORG_ID = 'https://www.bozemetal.com/#organization';
const WEBSITE_ID = 'https://cnc.bozemetal.com/#website';

/** ISO 8601 duration regex (subset sufficient for HowTo.totalTime):
 *   P[n]DT[n]H[n]M[n]S — supports PT15M, P1D, PT2H30M, etc.
 *   Google's HowTo rich-result guideline accepts this format.
 */
const ISO_8601_DURATION_RE = /^P(?!$)(\d+Y)?(\d+M)?(\d+D)?(T(?=\d)(\d+H)?(\d+M)?(\d+(?:\.\d+)?S)?)?$/;

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
    const howto = graph.find(e => e['@type'] === 'HowTo');

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

    // ── AIO — HowTo integrity ──────────────────────────────────────
    //   Per Google Search Central, HowTo rich results require:
    //     - name (Text, required)
    //     - step (HowToStep array, ≥1 item)
    //   Each step must have position (≥1), name (Text), and text (Text).
    //   totalTime, when present, must be a valid ISO 8601 duration.
    if (howto) {
      const steps = howto['step'];
      if (!Array.isArray(steps) || steps.length === 0) {
        console.log(`  FAIL: HowTo step[] must be a non-empty array`);
        pageOk = false;
      } else {
        for (let i = 0; i < steps.length; i++) {
          const s = steps[i];
          if (typeof s['position'] !== 'number' || s['position'] < 1) {
            console.log(`  FAIL: HowTo step[${i}].position must be an integer ≥ 1 (got ${s['position']})`);
            pageOk = false;
          }
          if (typeof s['name'] !== 'string' || s['name'].length === 0) {
            console.log(`  FAIL: HowTo step[${i}].name must be a non-empty string`);
            pageOk = false;
          }
          if (typeof s['text'] !== 'string' || s['text'].length === 0) {
            console.log(`  FAIL: HowTo step[${i}].text must be a non-empty string`);
            pageOk = false;
          }
        }
      }
      if (howto['totalTime'] != null && !ISO_8601_DURATION_RE.test(String(howto['totalTime']))) {
        console.log(`  FAIL: HowTo.totalTime must be a valid ISO 8601 duration (got "${howto['totalTime']}")`);
        pageOk = false;
      }
      if (!howto['@id'] || !String(howto['@id']).endsWith('#howto')) {
        console.log(`  FAIL: HowTo @id must end with "#howto" (got "${howto['@id']}")`);
        pageOk = false;
      }
      console.log(`  HowTo: name="${howto['name']}" · steps=${Array.isArray(steps) ? steps.length : 0} · totalTime=${howto['totalTime'] ?? 'N/A'}`);
    }

    // ── AIO — WebPage.speakable integrity ──────────────────────────
    //   Per Google Search Central, speakable requires:
    //     - cssSelector (Array of strings, ≥1 item)
    //     - each selector must be a non-empty string
    const speakable = page?.['speakable'];
    if (speakable) {
      const selectors = speakable['cssSelector'];
      if (!Array.isArray(selectors) || selectors.length === 0) {
        console.log(`  FAIL: WebPage.speakable.cssSelector must be a non-empty array`);
        pageOk = false;
      } else {
        for (let i = 0; i < selectors.length; i++) {
          const sel = selectors[i];
          if (typeof sel !== 'string' || sel.length === 0) {
            console.log(`  FAIL: WebPage.speakable.cssSelector[${i}] must be a non-empty string`);
            pageOk = false;
          }
        }
        console.log(`  Speakable: ${selectors.length} selector(s) [${selectors.slice(0, 3).join(', ')}${selectors.length > 3 ? ', ...' : ''}]`);
      }
    }

    // ── AIO — Comparison ItemList integrity ────────────────────────
    //   Per schema.org/ItemList, a comparison list requires:
    //     - itemListElement (Array, ≥2 items for a real comparison)
    //     - each ListItem references an existing Product @id
    const itemList = graph.find((n) => n['@type'] === 'ItemList' && String(n['@id'] || '').endsWith('#comparison-list'));
    if (itemList) {
      const rows = itemList['itemListElement'];
      if (!Array.isArray(rows) || rows.length < 2) {
        console.log(`  FAIL: Comparison ItemList must have ≥ 2 itemListElement entries (got ${Array.isArray(rows) ? rows.length : 0})`);
        pageOk = false;
      } else {
        for (let i = 0; i < rows.length; i++) {
          const r = rows[i];
          if (!r['item'] || !r['item']['@id']) {
            console.log(`  FAIL: Comparison ItemList row[${i}].item.@id is required`);
            pageOk = false;
          }
        }
        console.log(`  Comparison: name="${itemList['name']}" · rows=${rows.length} · criteria=${(itemList['additionalProperty'] || []).length}`);
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
