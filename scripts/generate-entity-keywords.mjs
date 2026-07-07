/**
 * generate-entity-keywords.mjs
 * Entity-based keywordMap: extract multi-language names from structured data.
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const LANGS = ['en','de','ja','fr','es','pt','it','ko','nl','pl'];
const EN = 'en';

function build() {
  const map = {};
  const seen = new Set();
  
  function add(word, lang, url) {
    const key = `${word.toLowerCase().trim()}::${lang}`;
    if (seen.has(key) || !word || word.length < 2) return;
    seen.add(key);
    map[word.trim()] = { href: lang === EN ? url : `/${lang}${url}` };
  }

  // ── 1. services-schema.ts: extract id → name mapping ──
  // Format: id: "URL#service"  followed (eventually) by name: { en:"...", de:"...", ... }
  const s = fs.readFileSync(path.join(ROOT, 'src/data/services-schema.ts'), 'utf-8');
  
  // Strategy: split on line starts with "id:" or "name:" (both have same indentation)
  const parts = s.split(/\n\s+(?=id:|name:)/);
  
  let pendingIdPath = null;
  for (const p of parts) {
    const idM = p.match(/id:\s*"([^"]+)"/);
    if (idM) {
      const id = idM[1];
      const urlM = id.match(/bozemetal\.com(\/[^#]*)/);
      if (urlM) {
        let pu = urlM[1]; if (!pu.endsWith('/')) pu += '/';
        pendingIdPath = pu;
      } else if (id.includes('main-service')) {
        pendingIdPath = '/';
      }
    }
    
    // name: { ... }
    const nm = p.match(/name:\s*\{([\s\S]*?)\}\s*,?\s*\n/);
    if (nm && pendingIdPath) {
      const block = nm[1];
      for (const lang of LANGS) {
        const r = new RegExp(`\\b${lang}:\\s*"([^"]*)"`);
        const m = block.match(r);
        if (m && m[1]) {
          add(m[1], lang, pendingIdPath);
          // short form
          const sf = m[1].split(/[&/]/)[0].trim();
          if (sf !== m[1] && sf.length > 5) add(sf, lang, pendingIdPath);
        }
      }
    }
  }

  // ── 2. seo.ts: extract title per language for each path ──
  const seo = fs.readFileSync(path.join(ROOT, 'src/config/seo.ts'), 'utf-8');
  const seoRegex = /'([^']+)':\s*\{[\s\S]*?title:\s*\{([\s\S]*?)\}(?=\s*\n\s*(?:description|ogImage|\}))/g;
  let sm;
  while ((sm = seoRegex.exec(seo)) !== null) {
    let p = sm[1]; if (!p.endsWith('/')) p += '/';
    for (const lang of LANGS) {
      const r = new RegExp(`\\b${lang}:\\s*'([^']*)'`);
      const m = sm[2].match(r);
      if (m && m[1]) {
        let t = m[1].replace(/\s*[|–-]\s*BOZE\s+CNC\s+Ti.*$/i, '').trim();
        if (t.length > 3) add(t, lang, p);
      }
    }
  }
  
  // ── 3. Manual entities ──
  const manual = [
    ['Ti-6Al-4V','/materials/grade-5/'],['Grade 5 Titanium','/materials/grade-5/'],
    ['Ti-6Al-4V ELI','/materials/grade-23/'],['Grade 23 Titanium','/materials/grade-23/'],
    ['Grade 2 Titanium','/materials/grade-2/'],['Grade 1 Titanium','/materials/grade-1/'],
    ['Grade 9 Titanium','/materials/grade-9/'],
    ['AS9100','/capabilities/'],['AS9100D','/capabilities/'],['ISO 9001','/capabilities/'],
    ['ISO 13485','/capabilities/'],['ITAR','/capabilities/'],['AMS 4928T','/materials/grade-5/'],
    ['NADCAP','/capabilities/'],
    ['5-Axis CNC Machining','/titanium-cnc-machining-services/3-5-axis-cnc-machining/'],
    ['Wire EDM','/titanium-cnc-machining-services/wire-edm-machining/'],
    ['CMM','/equipment/cmm/'],['SLM','/titanium-additive-manufacturing/3d-printing-slm/'],
    ['RFQ','/rfq/'],
  ];
  for (const [w,u] of manual) add(w, EN, u);

  return map;
}

function write(map) {
  const fp = path.join(ROOT, 'astro.config.mjs');
  let c = fs.readFileSync(fp, 'utf-8');
  const json = JSON.stringify(map, null, 2);
  const body = json.split('\n').slice(1, -1).map(l => `        ${l}`).join('\n');
  const m = c.match(/keywordMap:\s*\{/);
  if (!m) { console.error('ERROR'); process.exit(1); }
  const s = m.index; let d = 0, e = s;
  while (e < c.length) { if (c[e]==='{') d++; if (c[e]==='}') { d--; if (d===0) break; } e++; }
  fs.writeFileSync(fp, c.slice(0,s)+`keywordMap: {\n${body}\n      }`+c.slice(e+1), 'utf-8');
  console.log('✓ Config updated');
}

const km = build();
const byLang = {};
for (const [k,meta] of Object.entries(km)) {
  const l = meta.href.match(/^\/([a-z]{2})\//)?.[1] || 'en';
  byLang[l] = (byLang[l] || 0) + 1;
}
console.log('=== Entity Keyword Map ===');
console.log(`Total: ${Object.keys(km).length}`);
for (const lang of LANGS) console.log(`  ${lang}: ${byLang[lang] || 0}`);
console.log('\nEN sample:');
let n = 0;
for (const [kw, meta] of Object.entries(km)) {
  if (!meta.href.match(/^\/(de|ja|fr|es|pt|it|ko|nl|pl)\//) && n < 20) {
    console.log(`  "${kw}" → ${meta.href}`);
    n++;
  }
}
console.log('\nJA sample:');
n = 0;
for (const [kw, meta] of Object.entries(km)) {
  if (meta.href.startsWith('/ja/') && n < 10) {
    console.log(`  "${kw}" → ${meta.href}`);
    n++;
  }
}
write(km);
console.log('\n✅ Done. Run `npm run build` to verify.');