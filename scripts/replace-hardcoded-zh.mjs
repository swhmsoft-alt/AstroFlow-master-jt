#!/usr/bin/env node
/**
 * Step 2: Replace hardcoded Chinese text in .astro files with t('key') calls.
 *
 * For files that already have useTranslations import but still have Chinese text:
 *   - Extract the Chinese text
 *   - Generate a semantic key from surrounding context
 *   - Replace with {t('key')}
 *   - Collect all new keys for ui.ts update
 *
 * For files that DON'T have useTranslations import yet:
 *   - Add the import block
 *   - Then replace Chinese text with t('key')
 *
 * Usage: node scripts/replace-hardcoded-zh.mjs
 */

import { readFileSync, writeFileSync, readdirSync, statSync, existsSync, mkdirSync } from 'fs';
import { join, dirname } from 'path';

const ROOT = process.cwd();
const SRC_DIR = join(ROOT, 'src');
const SCAN_DIRS = ['components', 'pages', 'layouts'];
const OUTPUT_DIR = join(ROOT, 'temp');
const OUTPUT_FILE = join(OUTPUT_DIR, 'translation-keys.json');

// Chinese character regex (CJK Unified Ideographs)
const ZH_REGEX = /[\u4e00-\u9fff\u3000-\u303f\uff00-\uffef]+/g;

function* walk(dir, prefix) {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) {
      yield* walk(full, prefix ? prefix + '/' + entry.name : entry.name);
    } else if (entry.name.endsWith('.astro')) {
      yield prefix ? prefix + '/' + entry.name : entry.name;
    }
  }
}

/**
 * Apply translations to content with smart space handling.
 *
 * Rules (applied to each match of a Chinese phrase):
 *   - Char BEFORE the phrase:
 *       is English letter (a-zA-Z) → prepend a single space
 *       otherwise (start / punctuation / digit / CJK) → no change
 *   - Char AFTER the phrase:
 *       is English letter (a-zA-Z) → append a single space
 *       otherwise → no change
 *
 * Example:
 *   applySpaceAwareTranslation(
 *     'High-temperature氧化防护涂层 capability',
 *     { '氧化防护涂层': 'Oxidation Protective Coating' }
 *   )
 *   → 'High-temperature Oxidation Protective Coating capability'
 *
 * Notes:
 *   - Idempotent (the Chinese phrase is replaced, won't re-match).
 *   - Longer phrases are matched first to avoid partial matches.
 *   - Pure function: returns { content, replacements[] }.
 *
 * Used by:
 *   - `node scripts/replace-hardcoded-zh.mjs --test` (self-check below)
 *   - Future content-data i18n scripts (JSON/MD) that translate zh → en.
 *
 * @param {string} content
 * @param {Record<string,string>} mapping  zh → en
 * @returns {{ content: string, replacements: Array<{zh: string, en: string, offset: number}> }}
 */
export function applySpaceAwareTranslation(content, mapping) {
  const entries = Object.entries(mapping)
    .filter(([zh, en]) => zh && en)
    .sort((a, b) => b[0].length - a[0].length);

  const replacements = [];
  let result = content;

  for (const [zh, en] of entries) {
    let searchStart = 0;
    while (true) {
      const idx = result.indexOf(zh, searchStart);
      if (idx < 0) break;

      const charBefore = idx > 0 ? result[idx - 1] : '';
      const charAfter  = idx + zh.length < result.length ? result[idx + zh.length] : '';

      const prefix = /[a-zA-Z]/.test(charBefore) ? ' ' : '';
      const suffix = /[a-zA-Z]/.test(charAfter)  ? ' ' : '';

      const translated = prefix + en + suffix;
      const before = result.slice(0, idx);
      const after  = result.slice(idx + zh.length);
      result = before + translated + after;

      // Skip past inserted text so we don't re-match inside it.
      searchStart = idx + translated.length;

      replacements.push({ zh, en: translated, offset: idx });
    }
  }

  return { content: result, replacements };
}

/** Generate a semantic key from file path and text snippet */
function generateKey(relPath, text, usedKeys, index) {
  const base = relPath
    .replace(/\.astro$/, '')
    .replace(/^components\//, '')
    .replace(/^pages\//, '')
    .replace(/^layouts\//, '')
    .replace(/[/\\]/g, '.');

  // Get first meaningful word from text
  const firstWord = text.replace(/[^\u4e00-\u9fff\w]/g, '').slice(0, 6);
  let key = `${base}.${firstWord}`;

  // Ensure uniqueness
  if (usedKeys.has(key)) {
    key = `${base}.${firstWord}_${index}`;
  }
  usedKeys.add(key);
  return key;
}

/** Check if a string contains Chinese characters */
function hasChinese(str) {
  ZH_REGEX.lastIndex = 0;
  return ZH_REGEX.test(str);
}

/** Determine import path depth */
function getImportPrefix(relPath) {
  // Count directory levels below src/
  // e.g. 'components/ThemeSwitcher.astro' → 1 level → '../'
  // e.g. 'pages/blog/index.astro' → 2 levels → '../../'
  const depth = relPath.split('/').length - 1;
  if (depth <= 0) return './';
  return '../'.repeat(depth);
}

/**
 * Check if we are inside a <script> or <style> block by counting tags.
 * This is tracked incrementally line-by-line, so no O(n²) string slicing needed.
 */
function makeTagTracker() {
  let scriptDepth = 0;   // tracks <script> vs </script>
  let styleDepth = 0;    // tracks <style> vs </style>
  return {
    /** Update state for one line, returns whether we are currently blocked */
    update(line) {
      // Count <script> openings (not closing tags)
      const scriptOpens = (line.match(/<script(?![>/])/g) || []).length;
      const scriptCloses = (line.match(/<\/script>/g) || []).length;
      scriptDepth += scriptOpens - scriptCloses;
      if (scriptDepth < 0) scriptDepth = 0;

      // Count <style> openings
      const styleOpens = (line.match(/<style(?![>/])/g) || []).length;
      const styleCloses = (line.match(/<\/style>/g) || []).length;
      styleDepth += styleOpens - styleCloses;
      if (styleDepth < 0) styleDepth = 0;

      return this.isInside();
    },
    isInside() {
      return scriptDepth > 0 || styleDepth > 0;
    }
  };
}

function main() {
  // Collect all files
  const files = [];
  for (const sub of SCAN_DIRS) {
    const dir = join(SRC_DIR, sub);
    if (statSync(dir).isDirectory()) {
      files.push(...walk(dir, sub));
    }
  }

  console.log(`Found ${files.length} .astro files.\n`);

  const allNewKeys = {};  // key -> original Chinese text
  const usedKeys = new Set();
  let filesModified = 0;

  for (const rel of files) {
    const fullPath = join(SRC_DIR, rel);
    let content = readFileSync(fullPath, 'utf-8');
    const original = content;

    // Check if already has useTranslations
    const hasImport = content.includes('useTranslations');

    // Split frontmatter and body (handle both \n and \r\n)
    const fmMatch = content.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/);
    if (!fmMatch) {
      console.log(`  ⚠ ${rel}: no frontmatter, skipping`);
      continue;
    }

    let frontmatter = fmMatch[1];
    let body = fmMatch[2];

    // ─── Line-by-line processing (no catastrophic backtracking) ───
    const lines = body.split('\n');
    const tracker = makeTagTracker();
    let replaceCount = 0;

    for (let lineIdx = 0; lineIdx < lines.length; lineIdx++) {
      let line = lines[lineIdx];

      // Skip lines inside <script> or <style> blocks
      const wasInside = tracker.isInside();
      tracker.update(line);
      if (wasInside || tracker.isInside()) continue;

      // Quick scan: skip if line has no Chinese chars
      if (!hasChinese(line)) continue;

      // Skip if line is a t() call already (contains {t('...')})
      if (/\{t\s*\(\s*['"`]/.test(line)) continue;

      // Replace Chinese segments in HTML text content.
      // Strategy: find text between > and < on this line, replace Chinese within.
      let modified = false;
      const newLine = line.replace(/>([^<]+)</g, (tagMatch, textContent) => {
        if (!hasChinese(textContent)) return tagMatch;

        // Replace each Chinese segment within this text content
        const replacedContent = textContent.replace(ZH_REGEX, (zhText, offset) => {
          const key = generateKey(rel, zhText, usedKeys, lineIdx * 10000 + offset);
          allNewKeys[key] = zhText.trim();
          replaceCount++;
          modified = true;
          return `{t('${key}')}`;
        });
        return `>${replacedContent}<`;
      });

      if (modified) {
        lines[lineIdx] = newLine;
      }
    }

    const newBody = lines.join('\n');

    if (replaceCount === 0) {
      console.log(`  - ${rel}: no Chinese text found in HTML content`);
      continue;
    }

    // Add import if missing
    if (!hasImport) {
      const prefix = getImportPrefix(rel);
      const ip = `${prefix}i18n/utils`;
      const patch = `\nimport { getLangFromUrl, useTranslations } from '${ip}';\nconst currentLang = getLangFromUrl(Astro.url);\nconst t = useTranslations(currentLang);`;
      frontmatter = frontmatter + patch;
    }

    // Reassemble
    content = `---\n${frontmatter}\n---\n${newBody}`;

    if (content !== original) {
      writeFileSync(fullPath, content, 'utf-8');
      console.log(`  ✓ ${rel}: ${replaceCount} replacements`);
      filesModified++;
    }
  }

  console.log(`\n=== Summary ===`);
  console.log(`Files modified: ${filesModified}`);
  console.log(`New translation keys: ${Object.keys(allNewKeys).length}`);

  // Write keys to output file
  if (!existsSync(OUTPUT_DIR)) {
    mkdirSync(OUTPUT_DIR, { recursive: true });
  }
  writeFileSync(OUTPUT_FILE, JSON.stringify(allNewKeys, null, 2), 'utf-8');
  console.log(`\nTranslation keys written to: ${OUTPUT_FILE}`);
}

// ─────────────────────────────────────────────────────────────────────────────
// CLI: --test exercises applySpaceAwareTranslation against canonical cases.
// Usage: node scripts/replace-hardcoded-zh.mjs --test
// Exits 0 on success, 1 on failure. No files are written.
// ─────────────────────────────────────────────────────────────────────────────
if (process.argv.includes('--test')) {
  const cases = [
    {
      name: 'letter before + space-after word',
      input: 'High-temperature氧化防护涂层 capability',
      mapping: { '氧化防护涂层': 'Oxidation Protective Coating' },
      expected: 'High-temperature Oxidation Protective Coating capability',
    },
    {
      name: 'start of string + punctuation after',
      input: '氧化防护涂层, supported by QC',
      mapping: { '氧化防护涂层': 'Oxidation Protective Coating' },
      expected: 'Oxidation Protective Coating, supported by QC',
    },
    {
      name: 'punctuation before + punctuation after',
      input: '(氧化防护涂层)',
      mapping: { '氧化防护涂层': 'Oxidation Protective Coating' },
      expected: '(Oxidation Protective Coating)',
    },
    {
      name: 'CJK before + CJK after',
      input: '高级氧化防护涂层材料',
      mapping: { '氧化防护涂层': 'Oxidation Protective Coating' },
      expected: '高级Oxidation Protective Coating材料',
    },
    {
      name: 'multiple matches in one string',
      input: 'A:氧化防护涂层 B:氧化防护涂层',
      mapping: { '氧化防护涂层': 'Oxidation Protective Coating' },
      expected: 'A:Oxidation Protective Coating B:Oxidation Protective Coating',
    },
    {
      name: 'end of string',
      input: 'uses 氧化防护涂层',
      mapping: { '氧化防护涂层': 'Oxidation Protective Coating' },
      expected: 'uses Oxidation Protective Coating',
    },
  ];

  let failed = 0;
  for (const c of cases) {
    const { content, replacements } = applySpaceAwareTranslation(c.input, c.mapping);
    const ok = content === c.expected;
    if (!ok) failed++;
    console.log(`[${ok ? '✓' : '✗'}] ${c.name}`);
    if (!ok) {
      console.log(`    input:    ${JSON.stringify(c.input)}`);
      console.log(`    expected: ${JSON.stringify(c.expected)}`);
      console.log(`    actual:   ${JSON.stringify(content)}`);
    } else {
      console.log(`    ${replacements.length} replacement(s)`);
    }
  }

  console.log(`\nResult: ${cases.length - failed}/${cases.length} passed`);
  if (failed > 0) {
    console.error('applySpaceAwareTranslation self-check FAILED');
    process.exit(1);
  }
  console.log('applySpaceAwareTranslation self-check PASSED');
  process.exit(0);
}

main();