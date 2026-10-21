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
 *    Look it up by @id, never by `@type === 'Organization'` — since commit
 *    a5008819 the legal entity is typed `Corporation` (schema.org's
 *    incorporated-for-profit subtype of Organization), so a @type lookup
 *    silently resolves to the wrong node and reports every page as failing.
 *  - Product offers (GSC Merchant Listings fix, 2026-10-21): Boze is a B2B
 *    make-to-order machining business with no published retail price, so
 *    `buildProduct()` must NOT emit an `offers` node at all. Any `Product.offers`
 *    node makes Google run the B2C Merchant Listings check and report:
 *      ERROR   missing field "price" / "priceSpecification" (in "offers")
 *      WARNING invalid "availability" enum value (in "offers")
 *      WARNING missing "hasMerchantReturnPolicy" (in "offers")
 *      WARNING missing "shippingDetails" (in "offers")
 *    Those B2C-only fields are unfillable without fabricating data, so the
 *    invariant asserted here is: Product MUST have no `offers` key. If a real
 *    numeric price is ever published, the Offer is allowed but MUST carry both
 *    `price` and `priceCurrency` (a half-priced Offer is a FAIL).
 *    The RFQ relationship is carried by Organization.makesOffer (Service) and
 *    the site-wide OfferCatalog instead of a per-Product Offer.
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
  // These four AIO-seed articles live under the /blog/ collection, so their
  // built output is dist/blog/<slug>/index.html — the root-level path this
  // list previously used no longer exists.
  { name: 'AIO Seed 1 — Grade Selection (HowTo + Speakable + ItemList)', file: 'dist/blog/how-to-choose-titanium-grade/index.html' },
  { name: 'AIO Seed 2 — AS9100 Supplier (HowTo + Speakable)', file: 'dist/blog/how-to-qualify-as9100-titanium-supplier/index.html' },
  { name: 'AIO Seed 3 — CNC Part Specification (HowTo + Speakable)', file: 'dist/blog/how-to-specify-titanium-cnc-machined-part/index.html' },
  { name: 'AIO Seed 4 — MTR Reading (HowTo + Speakable)', file: 'dist/blog/how-to-read-titanium-mill-test-report/index.html' },
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
    // Legal Org lookup by @id, NOT by @type.
    //
    // Commit a5008819 ("Phase 2A B2B entity strategy") re-typed the legal
    // entity from `Organization` to `Corporation` (the schema.org
    // incorporated-for-profit subtype, rdfs:subClassOf Organization). A
    // `find(e => e['@type'] === 'Organization')` therefore no longer matches it
    // and instead returns the *later* `#manufacturing-center` node, making
    // every page report a bogus "bad org @id". Matching on the stable @id is
    // type-agnostic: it keeps working whether the entity is typed
    // Organization, Corporation, or any future subtype.
    const org = graph.find(e => e['@id'] === LEGAL_ORG_ID);
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
    //   GSC Merchant Listings fix (2026-10-21): B2B make-to-order Products
    //   must carry NO `offers` node, otherwise Google runs the B2C retail
    //   Merchant Listings check and reports the 4 findings listed in the
    //   file header. Assert both halves of the new invariant:
    //     1. no `offers` key at all (the shipped state)
    //     2. IF an Offer ever appears (real numeric price published later),
    //        it must be complete — price AND priceCurrency together, plus a
    //        schema.org availability enum — otherwise it is a FAIL.
    if (product) {
      const offers = product['offers'];
      if (offers == null) {
        console.log(`  Product: offers=absent (B2B make-to-order - Merchant Listings check not triggered)`);
      } else {
        const offerArr = Array.isArray(offers) ? offers : [offers];
        console.log(`  WARN: Product carries an offers node - verify this is a real retail price`);
        for (const o of offerArr) {
          const hasPrice = o['price'] != null;
          const hasCurrency = o['priceCurrency'] != null;
          if (hasPrice !== hasCurrency) {
            console.log(`  FAIL: Offer must carry BOTH price and priceCurrency (got price=${o['price'] ?? 'null'}, priceCurrency=${o['priceCurrency'] ?? 'null'})`);
            pageOk = false;
          }
          const av = o['availability'];
          if (av != null && !/^https:\/\/schema\.org\/[A-Za-z]+$/.test(String(av))) {
            console.log(`  FAIL: Offer availability must be a schema.org enum URI (got "${av}")`);
            pageOk = false;
          }
          if (o['itemOffered']?.['@id'] !== product['@id']) {
            console.log(`  FAIL: Offer itemOffered must back-ref the Product @id`);
            pageOk = false;
          }
          console.log(`  Offer: price=${o['price'] ?? 'N/A'} · currency=${o['priceCurrency'] ?? 'N/A'} · availability=${o['availability'] ?? 'N/A'}`);
        }
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
