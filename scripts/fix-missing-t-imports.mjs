#!/usr/bin/env node
import { readFileSync, writeFileSync } from 'fs';
import { join } from 'path';
import { readdirSync, statSync } from 'fs';

const ROOT = process.cwd();
const COMPONENTS_DIR = join(ROOT, 'src/components');

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

function main() {
  if (!statSync(COMPONENTS_DIR).isDirectory()) {
    console.error('src/components not found');
    process.exit(1);
  }

  const files = [...walk(COMPONENTS_DIR, '')];
  let fixed = 0, skipped = 0;

  for (const rel of files) {
    const fullPath = join(COMPONENTS_DIR, rel);
    const original = readFileSync(fullPath, 'utf-8');

    if (original.includes('useTranslations')) {
      skipped++;
      continue;
    }

    const m = original.match(/---\n([\s\S]*?)\n---\n([\s\S]*)/);
    if (!m) continue;
    if (!/t\s*\(['"`]/.test(m[2])) { skipped++; continue; }

    const depth = rel.split('/').length;
    const prefix = depth > 0 ? '../'.repeat(depth) : './';
    const ip = `${prefix}i18n/utils`;
    const patch = `\nimport { getLangFromUrl, useTranslations } from '${ip}';\nconst currentLang = getLangFromUrl(Astro.url);\nconst t = useTranslations(currentLang);`;

    writeFileSync(fullPath, `---\n${m[1]}${patch}\n---\n${m[2]}`, 'utf-8');
    console.log(`✓ ${rel}`);
    fixed++;
  }

  console.log(`\nDone. Fixed: ${fixed}, Skipped: ${skipped}`);
}

main();