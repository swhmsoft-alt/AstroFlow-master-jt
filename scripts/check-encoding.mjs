/**
 * check-encoding.mjs
 *
 * Pre-build / CI validation script to catch encoding corruption in blog content.
 * Run:  node scripts/check-encoding.mjs
 *
 * WHY THIS EXISTS:
 * On Chinese Windows the system ANSI code page is GBK (cp936). Any tool that
 * reads/writes markdown as GBK instead of UTF-8 destroys the last byte of
 * multi-byte UTF-8 characters (em dash "—" = E2 80 94 becomes E2 80 3F, shown
 * as "�?") whenever they are followed by an ASCII byte < 0x40. This check is
 * wired into `npm run prebuild` so a corrupted file fails the build/deploy.
 *
 * Detects:
 *   1. Raw GBK-write corruption byte pattern  E2 80 3F
 *   2. UTF-8 encoded U+FFFD (EF BF BD)  — left by a UTF-8 tool that re-saved an
 *      already-corrupted file
 *   3. Invalid UTF-8 byte sequences / U+FFFD replacement character
 *   4. Em dash + question mark garbling ("—?")
 *
 * Exit codes:
 *   0 = all clean
 *   1 = issues found
 */

import { readFileSync, readdirSync, existsSync } from 'fs';
import { join } from 'path';

const DIRS = ['src/content/blog', 'src/content/blog-translations'];
const RAW_CORRUPT = Buffer.from([0xe2, 0x80, 0x3f]); // "�?" — raw GBK-write corruption
const UFFFD_ENC = Buffer.from([0xef, 0xbf, 0xbd]);   // U+FFFD encoded as UTF-8

let hasError = false;

function scanDir(dir) {
  if (!existsSync(dir)) return;
  for (const file of readdirSync(dir)) {
    if (!file.endsWith('.md')) continue;
    const fp = join(dir, file);
    const buf = readFileSync(fp); // raw bytes
    const errors = [];

    // 1/2. byte-level signatures
    if (buf.includes(RAW_CORRUPT)) errors.push('raw GBK-write corruption E2 80 3F (renders as "�?")');
    if (buf.includes(UFFFD_ENC)) errors.push('UTF-8 encoded U+FFFD (EF BF BD) — a UTF-8 tool re-saved a corrupted file');

    // 3. strict UTF-8 decode
    let content;
    try {
      content = new TextDecoder('utf-8', { fatal: true }).decode(buf);
    } catch {
      errors.push('invalid UTF-8 byte sequence');
      content = buf.toString('utf8');
    }
    if (content.includes('\uFFFD')) errors.push('U+FFFD (replacement character) — encoding corruption detected');

    if (errors.length > 0) {
      console.error(`\n❌ ${fp}:`);
      errors.forEach((e) => console.error(`   ${e}`));
      hasError = true;
    }
  }
}

DIRS.forEach(scanDir);

if (hasError) {
  console.error('\n⚠️  Encoding issues found! Fix before committing.\n');
  process.exit(1);
} else {
  console.log('✅ All content files pass encoding check.\n');
  process.exit(0);
}
