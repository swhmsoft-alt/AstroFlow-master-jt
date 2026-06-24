/**
 * translate-hardcoded-text.mjs
 * 
 * Scans all .astro/.tsx files in src/components/ and src/pages/ for hardcoded
 * English text, extracts it to the i18n dictionary (src/i18n/ui.ts), and
 * replaces it with t('key') calls.
 * 
 * Usage: node scripts/translate-hardcoded-text.mjs          # report only
 *        node scripts/translate-hardcoded-text.mjs --apply  # apply changes
 * 
 * English EN is the ROOT - never modified, only MIRRORED into the dictionary.
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const COMPONENTS_DIR = path.join(ROOT, 'src', 'components');
const PAGES_DIR = path.join(ROOT, 'src', 'pages');
const UI_TS_PATH = path.join(ROOT, 'src', 'i18n', 'ui.ts');
const REPORT_DIR = path.join(ROOT, 'temp');
const REPORT_PATH = path.join(REPORT_DIR, 'hardcoded-text-report.json');

const APPLY = process.argv.includes('--apply');
const keyCounter = new Map();

// HELPERS
function toCamelCase(s) {
  return s.toLowerCase().replace(/[^a-z0-9]+(.)/g, (_, c) => c.toUpperCase()).replace(/^[0-9]/, '');
}
function sanitizeKey(text) {
  const words = text.replace(/[^a-zA-Z0-9\s]/g, '').split(/\s+/)
    .filter(w => w.length > 1 && !['the','and','for','our','with','from','that','this','are','was','has','had','not','but','all','can','its','per'].includes(w.toLowerCase()))
    .slice(0, 5);
  if (!words.length) return 'untitled';
  const raw = words.join('_').substring(0, 50).toLowerCase();
  const c = (keyCounter.get(raw) || 0) + 1;
  keyCounter.set(raw, c);
  return c > 1 ? `${raw}_${c}` : raw;
}
function getPrefix(filePath) {
  const parts = path.relative(ROOT, filePath).replace(/\\/g, '/').split('/');
  const dir = parts[2] === 'components' ? (parts[3] || '') : (parts[2] || '');
  const file = (parts[3] || parts[2] || '').replace(/\.(astro|tsx)$/, '');
  return (dir ? `${dir}.` : '') + toCamelCase(file);
}
function escapeRegex(s) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
function isGoodText(text) {
  if (!text || text.length < 4 || text.length > 80) return false;
  if (text.includes('{') || text.includes('}')) return false;
  if (/^[\d\s.,°%µ±×ø/\\()+\-]+$/.test(text)) return false;
  if (/^[a-z]+\.[a-z]+/.test(text)) return false;
  if (/^M\s*\d/.test(text) || text.startsWith('d="')) return false;
  if (/^#[0-9a-f]{3,8}$/i.test(text)) return false;
  if (/^\d+(px|rem|em|vh|vw|%|mm|cm|µm)$/.test(text)) return false;
  if (text.startsWith('{t(') || text.startsWith('{ t(')) return false;
  // CSS class-like values (tailwind: w-12 h-12)
  if (/^[a-z]-?\d/.test(text) && text.length < 15) return false;
  // CSS values
  if (/^var\(--/.test(text)) return false;
  if (/^from-[a-z]+-\d+/.test(text)) return false;
  if (/^to-[a-z]+-\d+/.test(text)) return false;
  // SVG attributes
  if (/^(currentColor|round|butt|square|inherit)$/.test(text)) return false;
  // Pure numbers/units
  if (/^[\d.\-×ø±°]+$/.test(text)) return false;

  /* ── NEW FILTERS for false-positive reduction ── */

  // File paths starting with /
  if (/^\/[a-z0-9_-]/.test(text)) return false;
  // URLs
  if (/^https?:\/\//.test(text)) return false;
  // CSS property values (color:, background:, border-color:)
  if (/^(color|background|border-color|font-size|padding|margin):\s*/.test(text)) return false;
  // CSS custom property values (--theme-bg, --theme-primary, etc.)
  if (/^--[a-z]+-/.test(text)) return false;
  // HTML entities
  if (/^&[a-z]+;/.test(text)) return false;
  // Contains Chinese characters
  if (/[\u4e00-\u9fff]/.test(text)) return false;
  // Pure file size / page count: "4.2 MB", "18 pp.", "24 pp.", "6.7 MB"
  if (/^\d+(\.\d+)?\s*(MB|KB|pp|mm|µm|cm|in|lbs|kg|gb)$/i.test(text)) return false;
  // CSS class fragments like shadow-lg, border-2, font-semibold, etc.
  if (/^[a-z]+-\d/.test(text) && /^[a-z][a-z-]*\d/.test(text) && text.length < 25) return false;
  // Social media / brand names that don't need translation
  if (/^(LinkedIn|Twitter|Facebook|YouTube|Instagram|Share on)/.test(text)) return false;
  // Pure Tailwind-style classes in html context
  if (/^(bg-|text-|p-[0-9]|m-[0-9]|flex|grid|gap-|items-|justify-)/.test(text)) return false;

  return true;
}

// SCAN FILE
function scanFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf-8');
  const lines = content.split('\n');
  const findings = [];
  const hasT = content.includes('useTranslations') || /t\(['"]/.test(content);

  let inFm = false, inScript = false, inStyle = false;
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const ln = i + 1;
    // Context tracking
    if (/^\s*---/.test(line) && !inFm) { inFm = true; continue; }
    if (line.trim() === '---' && inFm) { inFm = false; continue; }
    if (line.includes('<script')) inScript = true;
    if (line.includes('</script>')) inScript = false;
    if (line.includes('<style')) inStyle = true;
    if (line.includes('</style>')) inStyle = false;
    if (inFm || inScript || inStyle) continue;

    // HTML text nodes
    for (const m of line.matchAll(/>([^<]{4,})</g)) {
      const t = m[1].trim();
      if (isGoodText(t)) findings.push({ line: ln, type: 'html', text: t });
    }
    // aria-label, alt, title
    for (const m of line.matchAll(/(aria-label|alt|title)="([^"]{4,80})"/g)) {
      const t = m[2];
      if (isGoodText(t)) findings.push({ line: ln, type: `attr-${m[1]}`, text: t });
    }
  }

  // Frontmatter strings
  const fmMatch = content.match(/^---\n([\s\S]*?)\n---/);
  if (fmMatch) {
    const fmLines = fmMatch[1].split('\n');
    fmLines.forEach((line, idx) => {
      for (const m of line.matchAll(/[:=]\s*(['"])([^'"]{5,80})\1/g)) {
        const t = m[2];
        if (isGoodText(t))
          findings.push({ line: idx + 2, type: 'fm', text: t });
      }
    });
  }

  return { findings, hasT };
}

// MAIN
console.log(`🔍 Scanning... Mode: ${APPLY ? 'APPLY' : 'REPORT ONLY'}`);
const results = [];
[COMPONENTS_DIR, PAGES_DIR].forEach(dir => {
  const walk = d => fs.readdirSync(d, { withFileTypes: true }).forEach(e => {
    const p = path.join(d, e.name);
    if (e.isDirectory()) walk(p);
    else if (e.name.endsWith('.astro') || e.name.endsWith('.tsx')) results.push({ ...scanFile(p), file: path.relative(ROOT, p) });
  });
  walk(dir);
});

const mapping = [];
results.forEach(r => {
  const prefix = getPrefix(path.join(ROOT, r.file));
  r.findings.forEach(f => mapping.push({ key: `${prefix}.${sanitizeKey(f.text)}`, text: f.text, file: r.file, line: f.line, type: f.type }));
});

// Deduplicate
const deduped = Array.from(new Map(mapping.map(m => [m.key, m])).values());
fs.mkdirSync(REPORT_DIR, { recursive: true });
fs.writeFileSync(REPORT_PATH, JSON.stringify({ summary: { totalFiles: results.length, filesWithText: new Set(deduped.map(m => m.file)).size, totalTexts: deduped.length }, details: deduped }, null, 2));

console.log(`   Files: ${results.length}, Texts found: ${deduped.length}`);
console.log(`   Report: ${REPORT_PATH}`);
if (!APPLY) { console.log('   Re-run with --apply to modify files'); process.exit(0); }

// APPLY MODE
console.log('\nApplying...');

// 1. Add to ui.ts
let ui = fs.readFileSync(UI_TS_PATH, 'utf-8');
const existingKeys = new Set([...ui.matchAll(/'([\w.]+)':/g)].map(m => m[1]));
const newEntries = deduped.filter(m => !existingKeys.has(m.key));
if (newEntries.length) {
  newEntries.sort((a, b) => a.key.localeCompare(b.key));
  const groups = {};
  newEntries.forEach(e => { const s = e.key.split('.')[0] || 'misc'; (groups[s] = groups[s] || []).push(e); });
  let block = '\n    /* ── Auto-generated ── */\n';
  Object.entries(groups).forEach(([s, es]) => {
    block += `    /* ── ${s} ── */\n`;
    es.forEach(e => block += `    '${e.key}': '${e.text.replace(/'/g, "\\'")}',\n`);
    block += '\n';
  });
  const pos = ui.lastIndexOf('  },');
  if (pos === -1) { console.error('Cannot find insertion point'); process.exit(1); }
  ui = ui.slice(0, pos) + block + ui.slice(pos);
  fs.writeFileSync(UI_TS_PATH, ui, 'utf-8');
  console.log(`   Added ${newEntries.length} dictionary entries`);
}

// 2. Modify source files
const fileChanges = {};
deduped.forEach(m => { (fileChanges[m.file] = fileChanges[m.file] || []).push(m); });
let modFiles = 0, modTexts = 0;
Object.entries(fileChanges).forEach(([file, changes]) => {
  const fullPath = path.join(ROOT, file);
  let content = fs.readFileSync(fullPath, 'utf-8'), orig = content;

  // Add import if needed
  if (!/from ['"]..\/i18n\/utils['"]/.test(content)) {
    const depth = file.split(/[/\\]/).length;
    const imp = depth <= 3 ? '../i18n/utils' : '../../i18n/utils';
    content = content.replace(/^(---\n[\s\S]*?)(\n---)/, `$1\nimport { getLangFromUrl, useTranslations } from '${imp}';\nconst currentLang = getLangFromUrl(Astro.url);\nconst t = useTranslations(currentLang);$2`);
  }

  changes.sort((a, b) => b.line - a.line).forEach(c => {
    const lines = content.split('\n');
    const idx = c.line - 1;
    if (idx < 0 || idx >= lines.length) return;
    let line = lines[idx], newLine = line;
    const re = escapeRegex(c.text);
    if (c.type === 'html') newLine = line.replace(new RegExp(`>${re}<`), `>{t('${c.key}')}<`);
    else if (c.type.startsWith('attr-')) newLine = line.replace(new RegExp(`${c.type.replace('attr-', '')}="${re}"`), `${c.type.replace('attr-', '')}={t('${c.key}')}`);
    else if (c.type === 'fm') { newLine = line.replace(new RegExp(`"${re}"`), `t('${c.key}')`); newLine = newLine.replace(new RegExp(`'${re}'`), `t('${c.key}')`); }
    if (newLine !== line) { lines[idx] = newLine; content = lines.join('\n'); modTexts++; }
  });
  if (content !== orig) { fs.writeFileSync(fullPath, content, 'utf-8'); modFiles++; }
});
console.log(`   Modified ${modFiles} files, ${modTexts} text instances`);
console.log('\nDone! Run "npm run build" to verify.');