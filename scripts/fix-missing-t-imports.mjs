#!/usr/bin/env node
/**
 * Step 1: Add useTranslations import to .astro files that use t() but lack the import.
 */

import { readFileSync, writeFileSync, readdirSync, statSync } from 'fs';
import { join } from 'path';

const ROOT = process.cwd();
const SRC_DIR = join(ROOT, 'src');
const SCAN_DIRS = ['components', 'pages', 'layouts'];

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

function getImportPrefix(relPath) {
  const depth = relPath.split('/').length - 1;
  return '../'.repeat(depth);
}

function main() {
  const files = [];
  for (const sub of SCAN_DIRS) {
    const dir = join(SRC_DIR, sub);
    if (statSync(dir).isDirectory()) {
      files.push(...walk(dir, sub));
    } else {
      console.warn(`Warning: src/${sub} not found, skipping`);
    }
  }

  console.log(`Found ${files.length} .astro files to check.\n`);

  let fixed = 0, skipped = 0, noImportNeeded = 0, noTUsage = 0;

  for (const rel of files) {
    const fullPath = join(SRC_DIR, rel);
    const original = readFileSync(fullPath, 'utf-8');

    if (original.includes('useTranslations')) {
      noImportNeeded++;
      continue;
    }

    if (!/t\s*\(['"`]/.test(original)) {
      noTUsage++;
      continue;
    }

    const prefix = getImportPrefix(rel);
    const ip = `${prefix}i18n/utils`;
    const importBlock = `import { getLangFromUrl, useTranslations } from '${ip}';\nconst currentLang = getLangFromUrl(Astro.url);\nconst t = useTranslations(currentLang);`;

    const emptyFmMatch = original.match(/^---\r?\n---\r?\n([\s\S]*)$/);
    if (emptyFmMatch) {
      const body = emptyFmMatch[1];
      const newContent = `---\n${importBlock}\n---\n${body}`;
      writeFileSync(fullPath, newContent, 'utf-8');
      console.log(`  ✓ ${rel} (empty frontmatter)`);
      fixed++;
      continue;
    }

    const populatedFmMatch = original.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/);
    if (populatedFmMatch) {
      const frontmatter = populatedFmMatch[1];
      const body = populatedFmMatch[2];
      const newContent = `---\n${frontmatter}\n${importBlock}\n---\n${body}`;
      writeFileSync(fullPath, newContent, 'utf-8');
      console.log(`  ✓ ${rel} (populated frontmatter)`);
      fixed++;
      continue;
    }

    console.log(`  ⚠ ${rel}: no frontmatter, skipping`);
    skipped++;
  }

  console.log(`\nDone.`);
  console.log(`  Fixed (import added):     ${fixed}`);
  console.log(`  Skipped (no frontmatter): ${skipped}`);
  console.log(`  Already had import:       ${noImportNeeded}`);
  console.log(`  No t() usage found:       ${noTUsage}`);
}

main();