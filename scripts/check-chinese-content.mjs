#!/usr/bin/env node
/**
 * check-chinese-content.mjs
 *
 * Audit ALL content files (markdown / mdx / json) in src/content/ for
 * Chinese-language content that violates the project's "no zh support"
 * policy. The project ships in de/fr/es/pt/it/ko/nl/pl/ja + English
 * only (see scripts/audit-i18n-links.mjs LANG_PREFIXES).
 *
 * What it detects:
 *   1. Files with significant Chinese content (CJK characters that
 *      are NOT accompanied by Japanese kana) → policy violation.
 *   2. Files where Japanese kana is present (true ja translation) →
 *      NOT a violation, but reported for visibility.
 *   3. Files with minor CJK references (technical terms, single
 *      quotes) → reported as "info" only.
 *
 * Heuristic thresholds (same as check-orphan-pages.mjs):
 *   - JA_KANA present → legitimate Japanese translation (never
 *     flagged as violation regardless of kanji count).
 *   - CJK chars >= 50 AND ratio >= 5%   → POLICY VIOLATION
 *   - CJK chars >= 200 (regardless of ratio) → POLICY VIOLATION
 *     (catches short but severely polluted files like JSON with
 *     a Chinese title repeated in many fields)
 *   - CJK chars > 10 but below thresholds → INFO (technical refs)
 *
 * Exit codes:
 *   0 = no violations
 *   1 = violations found
 *
 * Usage:  node scripts/check-chinese-content.mjs
 * Output: output/chinese-content-report.json
 */

import { readFileSync, readdirSync, statSync, existsSync, mkdirSync, writeFileSync } from 'fs';
import { join, dirname, relative } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');
const CONTENT_DIR = join(ROOT, 'src', 'content');
const REPORT_PATH = join(ROOT, 'output', 'chinese-content-report.json');

const ZH_REGEX = /[\u4e00-\u9fff\u3000-\u303f\uff00-\uffef]/g;
// Hiragana + Katakana — Japanese-only kana
const JA_KANA_REGEX = /[\u3040-\u309f\u30a0-\u30ff]/;

const VIOLATION_MIN_CHARS = 50;
const VIOLATION_MIN_RATIO = 0.05;
const VIOLATION_HARD_MIN = 50;
const INFO_MIN_CHARS = 10;

const SCAN_EXT = new Set(['.md', '.mdx', '.json']);

/**
 * Recursively collect files with allowed extensions.
 */
function* walk(dir) {
  if (!existsSync(dir)) return;
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) {
      yield* walk(full);
    } else if (SCAN_EXT.has('.' + entry.name.split('.').pop().toLowerCase())) {
      yield full;
    }
  }
}

/**
 * Classify a file's CJK content.
 * Returns { severity, cjkChars, ratio, hasJaKana, sample }
 *   severity: 'violation' | 'japanese' | 'info' | 'clean'
 */
function classify(filePath) {
  const raw = readFileSync(filePath, 'utf8');
  const hasJaKana = JA_KANA_REGEX.test(raw);
  const cjkMatches = raw.match(ZH_REGEX);
  const cjkChars = cjkMatches ? cjkMatches.length : 0;
  const nonWsLen = raw.replace(/\s/g, '').length;
  const ratio = cjkChars / Math.max(nonWsLen, 1);

  // Extract a small sample of CJK text for the report
  const sampleRaw = cjkMatches ? cjkMatches.join('').slice(0, 60) : '';
  const sample = sampleRaw.length > 60 ? sampleRaw.slice(0, 60) + '…' : sampleRaw;

  if (cjkChars < INFO_MIN_CHARS) {
    return { severity: 'clean', cjkChars, ratio, hasJaKana, sample: '' };
  }

  // Japanese translation: kana present → never a violation
  if (hasJaKana) {
    return { severity: 'japanese', cjkChars, ratio, hasJaKana: true, sample };
  }

  // True violation: either ratio OR hard threshold
  if (cjkChars >= VIOLATION_MIN_CHARS) {
    if (ratio >= VIOLATION_MIN_RATIO || cjkChars >= VIOLATION_HARD_MIN) {
      return { severity: 'violation', cjkChars, ratio, hasJaKana: false, sample };
    }
  }

  // Below thresholds but with non-trivial CJK → informational
  return { severity: 'info', cjkChars, ratio, hasJaKana: false, sample };
}

// ── Main ─────────────────────────────────────────────────────────
console.log('=== Chinese Content Audit ===\n');
console.log(`Scanning: ${CONTENT_DIR}`);
console.log(`Extensions: ${[...SCAN_EXT].join(', ')}\n`);

if (!existsSync(CONTENT_DIR)) {
  console.error(`✗ Content directory not found: ${CONTENT_DIR}`);
  process.exit(1);
}

const violations = [];
const japanese = [];
const infos = [];
let total = 0;
let clean = 0;

for (const file of walk(CONTENT_DIR)) {
  total++;
  const result = classify(file);
  const rel = relative(ROOT, file).replace(/\\/g, '/');
  const record = { file: rel, ...result };

  if (result.severity === 'violation') {
    violations.push(record);
  } else if (result.severity === 'japanese') {
    japanese.push(record);
  } else if (result.severity === 'info') {
    infos.push(record);
  } else {
    clean++;
  }
}

// Sort by severity priority then CJK count descending
violations.sort((a, b) => b.cjkChars - a.cjkChars);
japanese.sort((a, b) => b.cjkChars - a.cjkChars);
infos.sort((a, b) => b.cjkChars - a.cjkChars);

// ── Report ───────────────────────────────────────────────────────
console.log('═══════════════════════════════════════');
console.log('     CHINESE CONTENT AUDIT REPORT      ');
console.log('═══════════════════════════════════════\n');

console.log(`📊 Scanned ${total} files (.md / .mdx / .json)\n`);

if (violations.length > 0) {
  console.log(`🚨 ${violations.length} POLICY VIOLATION(S) — Chinese content (should be deleted/translated):\n`);
  for (const v of violations) {
    console.log(`  • ${v.file}`);
    console.log(`    CJK: ${v.cjkChars} chars, ${(v.ratio * 100).toFixed(1)}% ratio`);
    console.log(`    Sample: "${v.sample}"`);
    console.log('');
  }
} else {
  console.log('✅ No policy violations found.\n');
}

if (japanese.length > 0) {
  console.log(`🇯🇵 ${japanese.length} legitimate Japanese file(s) (kana present — not flagged):\n`);
  for (const j of japanese) {
    console.log(`  • ${j.file}  (${j.cjkChars} CJK chars — Japanese kanji)`);
  }
  console.log('');
}

if (infos.length > 0) {
  console.log(`ℹ️  ${infos.length} file(s) with minor CJK references (technical quotes — within threshold):\n`);
  for (const i of infos.slice(0, 10)) {
    console.log(`  • ${i.file}  (${i.cjkChars} CJK chars, ${(i.ratio * 100).toFixed(2)}%)`);
  }
  if (infos.length > 10) {
    console.log(`  ... and ${infos.length - 10} more`);
  }
  console.log('');
}

// Summary
console.log('─────────────────────────────────────');
console.log(`  Total files:       ${total}`);
console.log(`  Clean:             ${clean}`);
console.log(`  🚨 Violations:     ${violations.length}`);
console.log(`  🇯🇵 Japanese:      ${japanese.length}`);
console.log(`  ℹ️  Info:          ${infos.length}`);
console.log('─────────────────────────────────────\n');

// Save JSON report
if (!existsSync(dirname(REPORT_PATH))) {
  mkdirSync(dirname(REPORT_PATH), { recursive: true });
}
writeFileSync(REPORT_PATH, JSON.stringify({
  generatedAt: new Date().toISOString(),
  scannedDir: 'src/content',
  total,
  clean,
  violationCount: violations.length,
  japaneseCount: japanese.length,
  infoCount: infos.length,
  violations,
  japanese,
  infos,
}, null, 2), 'utf-8');
console.log(`📄 Full report saved to: ${REPORT_PATH}`);

// Exit code
if (violations.length > 0) {
  console.log('\n❌ AUDIT FAILED: Chinese content detected — must be removed/translated.');
  process.exit(1);
} else {
  console.log('\n✅ AUDIT PASSED: No forbidden Chinese content.');
  process.exit(0);
}