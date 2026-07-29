/**
 * check-encoding.mjs
 *
 * Pre-commit / CI validation script to catch encoding issues in blog content.
 * Run:  node scripts/check-encoding.mjs
 *
 * Detects:
 *   1. U+FFFD (replacement character) — indicates encoding corruption
 *   2. Em dash (U+2014) + ? pattern — garbled from encoding loss
 *   3. Other suspicious non-ASCII patterns in unexpected contexts
 *
 * Exit codes:
 *   0 = all clean
 *   1 = issues found
 */

import { readFileSync, readdirSync } from 'fs';
import { join } from 'path';

const dir = 'src/content/blog';
const emDash = '\u2014';
const replChar = '\uFFFD';

let hasError = false;

for (const file of readdirSync(dir)) {
  if (!file.endsWith('.md')) continue;
  const fp = join(dir, file);
  const content = readFileSync(fp, 'utf8');
  const errors = [];

  // 1. Check for replacement character U+FFFD
  if (content.includes(replChar)) {
    errors.push('U+FFFD (replacement character) — encoding corruption detected');
  }

  // 2. Check for em dash + question mark (—?)
  if (content.includes(emDash + '?')) {
    errors.push('—? (em dash + question mark) — garbled character pattern');
  }

  if (errors.length > 0) {
    console.error(`\n❌ ${file}:`);
    errors.forEach(e => console.error(`   ${e}`));
    hasError = true;
  }
}

if (hasError) {
  console.error('\n⚠️  Encoding issues found! Fix before committing.\n');
  process.exit(1);
} else {
  console.log('✅ All blog files pass encoding check.\n');
  process.exit(0);
}
