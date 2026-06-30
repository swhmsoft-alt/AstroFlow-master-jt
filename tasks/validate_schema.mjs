import fs from 'fs';

const pages = [
  { name: 'Home', file: 'dist/index.html' },
  { name: 'Services Hub', file: 'dist/services/index.html' },
  { name: 'Service Detail', file: 'dist/titanium-cnc-machining-services/cnc-milling-turning/index.html' },
  { name: 'Products Hub', file: 'dist/products/index.html' },
  { name: 'Product Detail', file: 'dist/products/aluminum-cnc-parts/index.html' },
  { name: 'Blog Index', file: 'dist/blog/index.html' },
  { name: 'Blog Article', file: 'dist/blog/aerospace-titanium-full-process-supply/index.html' },
  { name: 'Materials', file: 'dist/materials/index.html' },
  { name: 'Capabilities', file: 'dist/capabilities/index.html' },
  { name: 'Industries', file: 'dist/industries/index.html' },
  { name: 'RFQ', file: 'dist/rfq/index.html' },
];

let pass = 0;
let fail = 0;

for (const p of pages) {
  try {
    const html = fs.readFileSync(p.file, 'utf8');
    const m = html.match(/<script type="application\/ld\+json">([^<]+)<\/script>/);
    if (!m) { console.log(`FAIL ${p.name}: no ld+json`); fail++; continue; }

    const parsed = JSON.parse(m[1]);
    const graph = parsed['@graph'];
    if (!graph) { console.log(`FAIL ${p.name}: no @graph`); fail++; continue; }

    const types = graph.map(e => e['@type']);
    const hasOffer = m[1].includes('"offers"');
    const org = graph.find(e => e['@type'] === 'Organization');
    const site = graph.find(e => e['@type'] === 'WebSite');
    const page = graph.find(e => e['@type'] === 'WebPage');
    const breadcrumb = graph.find(e => e['@type'] === 'BreadcrumbList');
    const service = graph.find(e => e['@type'] === 'Service');
    const product = graph.find(e => e['@type'] === 'Product');
    const article = graph.find(e => e['@type'] === 'Article');
    const coll = graph.find(e => e['@type'] === 'CollectionPage');
    const items = graph.find(e => e['@type'] === 'ItemList');

    console.log(`\n=== ${p.name} ===`);
    console.log(`  Types: [${types.join(', ')}]`);
    console.log(`  Org @id: ${org?.['@id'] || 'MISSING'}`);
    console.log(`  WebSite -> publisher @id: ${site?.publisher?.['@id'] || 'MISSING'}`);
    console.log(`  WebPage -> isPartOf @id: ${page?.['isPartOf']?.['@id'] || 'MISSING'}`);
    console.log(`  Breadcrumb Home label: "${breadcrumb?.itemListElement?.[0]?.name || 'MISSING'}"`);
    console.log(`  Has fake offers: ${hasOffer ? 'YES (PROBLEM)' : 'no'}`);

    if (org?.['@id'] !== 'https://cnc.bozemetal.com/#boze-org') { console.log(`  FAIL: bad org @id`); fail++; continue; }
    if (site?.publisher?.['@id'] !== 'https://cnc.bozemetal.com/#boze-org') { console.log(`  FAIL: bad publisher ref`); fail++; continue; }
    if (page?.['isPartOf']?.['@id'] !== 'https://cnc.bozemetal.com/#boze-website') { console.log(`  FAIL: bad isPartOf ref`); fail++; continue; }
    if (hasOffer) { console.log(`  FAIL: fake offer present`); fail++; continue; }

    pass++;
    console.log(`  PASS`);
  } catch(e) {
    console.log(`FAIL ${p.name}: ${e.message}`);
    fail++;
  }
}

console.log(`\n=== SUMMARY ===`);
console.log(`Pass: ${pass}, Fail: ${fail}`);
process.exit(fail > 0 ? 1 : 0);