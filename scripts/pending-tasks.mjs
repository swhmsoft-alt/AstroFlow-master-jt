#!/usr/bin/env node
// Lists commits in memory-bank/dev-log.md that lack Phase/Type/Scope markers.
// Read by the next Cline session to know what needs backfill.

import { readFileSync, existsSync } from 'node:fs';
import { resolve } from 'node:path';

const LOG = resolve(process.cwd(), 'memory-bank/dev-log.md');

if (!existsSync(LOG)) {
  console.log('[pending] memory-bank/dev-log.md not found yet.');
  console.log('[pending] Run: npm run hooks:install && make a commit');
  process.exit(0);
}

const content = readFileSync(LOG, 'utf8');
const lines = content.split('\n').filter(Boolean);
const pending = lines.filter(l => /^- \[/.test(l) && l.includes('(pending-Phase)'));

if (pending.length === 0) {
  console.log('[pending] OK -- no commits waiting for Phase backfill.');
  process.exit(0);
}

console.log('[pending] ' + pending.length + ' commit(s) need Phase description backfill:\n');
for (const line of pending) {
  console.log('  ' + line.replace(/^- /, ''));
}
console.log('');
console.log('[pending] Fill these into memory-bank/progress.md by Phase ID,');
console.log('[pending] or amend commits to add `Phase:` markers in their messages.');