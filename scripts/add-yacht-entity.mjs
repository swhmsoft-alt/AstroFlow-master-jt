// scripts/add-yacht-entity.mjs
// Idempotent: adds the `industry:yacht` entity to data/entities/entity-registry.json.
// Run:  node scripts/add-yacht-entity.mjs
// Re-running is safe — it exits early if the entity already exists.
import { readFileSync, writeFileSync } from 'node:fs';

const FILE = new URL('../data/entities/entity-registry.json', import.meta.url).pathname.replace(/^\//, '');
const raw = readFileSync(FILE, 'utf8');
const db = JSON.parse(raw);

const ID = 'industry:yacht';
if (db.entities.some((e) => e.id === ID)) {
  console.log('SKIP: entity already present');
  process.exit(0);
}

// Anchor the insert immediately after the marine entity so the two marine
// verticals stay adjacent in the array (reader/audit friendly ordering).
const idx = db.entities.findIndex((e) => e.id === 'industry:marine-offshore');

const entity = {
  id: ID,
  slug: 'yacht',
  category: 'industry',
  subcategory: 'Yacht & Superyacht',
  canonical_name: 'Yacht & Superyacht',
  aliases: ['Yacht', 'Superyacht', 'Luxury Yacht', 'Motor Yacht', 'Sailing Yacht', 'Yacht Refit'],
  search_terms: [
    'yacht  superyacht',
    'yacht',
    'superyacht',
    'luxury  yacht',
    'motor  yacht',
    'sailing  yacht',
    'yacht  refit'
  ],
  page_url: '/industries/yacht/',
  _source_slug: 'yacht',
  source_file: 'src/content/industries/yacht.json',
  source_collection: 'content/industries',
  relationships: {
    industry: 'Yacht & Superyacht',
    related_capabilities: [
      '5-axis CNC milling',
      'TIG welding with inert back-purge',
      'Thread machining',
      'Dynamic balancing',
      'Wire EDM'
    ],
    related_materials: ['Ti-6Al-4V', 'Grade 2 CP-Ti'],
    related_standards: ['EN 10204 3.1', 'EN 10204 3.2', 'ASTM B348', 'ASTM B338', 'ASTM B367', 'ASTM B381'],
    product_entities: []
  },
  seo: {
    page_title: 'Titanium CNC Machining for Superyacht & Yacht Refit Parts',
    meta_description: 'AS9100D-controlled machining of Grade 2 and Grade 5 titanium for superyacht refit and repair: seacocks, through-hull fittings, seawater cooling, wet exhaust and propulsion hardware. EN 10204 3.1 / 3.2 traceability.'
  },
  has_faqs: true,
  faqs_count: 5,
  tags: ['industry', 'marine', 'yacht', 'refit'],
  description: 'Titanium refit and repair parts for superyacht and luxury yacht systems: seacocks and through-hull fittings, seawater cooling and heat exchangers, wet exhaust, propulsion and shafting hardware, and performance sailing rig fittings.',
  cross_refs: ['Marine & Offshore', 'Titanium Fasteners', 'Heat Exchangers']
};

if (idx === -1) db.entities.push(entity);
else db.entities.splice(idx + 1, 0, entity);

// Keep the meta counters honest (SEMANTIC_CLOSURE §0.1 step 3).
db.meta.total = db.entities.length;
db.meta.by_category = db.meta.by_category || {};
db.meta.by_category.industry = (db.meta.by_category.industry || 0) + 1;

writeFileSync(FILE, JSON.stringify(db), 'utf8');
console.log(`OK: inserted ${ID}; total=${db.meta.total}; industry=${db.meta.by_category.industry}`);