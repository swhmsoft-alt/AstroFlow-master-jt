#!/usr/bin/env node
// Strict check on commit message (hard mode enabled after CEO authorisation 2026-10-10).
// - REJECTS (exit 1) if subject is short Chinese (e.g. "\u66f4\u65b0") OR English wip/tmp/test/minor
//   AND commit message lacks `Phase:`, `Type:`, `Scope:` markers.
// - Passes through Merge/Revert/fix/chore/docs commits.
// - Passes through commits that already contain `Phase:` marker.
// - Emergency bypass: `git commit --no-verify`. Bypassed commits are NOT in dev-log with Phase,
//   so `npm run dev:pending` will still surface them.

import { readFileSync } from 'node:fs';

const msgPath = process.argv[2];
if (!msgPath) process.exit(0);

const content = readFileSync(msgPath, 'utf8');
const firstLine = (content.split('\n')[0] || '').trim();

if (/^(Merge|Revert|fix|chore|docs)(\(.+\))?:/i.test(firstLine)) {
  process.exit(0);
}

if (/Phase:\s*[^\s\/]+/i.test(content)) {
  process.exit(0);
}

const isChineseShort = firstLine.length > 0 && firstLine.length <= 12 && /[\u4e00-\u9fa5]/.test(firstLine);
const isEnglishWip = /^(wip|tmp|test|minor)$/i.test(firstLine);

if (isChineseShort || isEnglishWip) {
  console.error('');
  console.error('[commit-msg] BLOCKED: this commit lacks a Phase marker.');
  console.error('');
  console.error('  Required format:');
  console.error('    <one-line subject>');
  console.error('    Phase: <id> / Type: <feature|content|fix|chore> / Scope: <area>');
  console.error('');
  console.error('  Examples:');
  console.error('    Phase: H-A2 / Type: feature / Scope: standard-parts Hub body');
  console.error('    Phase: A / Type: content / Scope: titanium-grades-guide pillar');
  console.error('');
  console.error('  Bypass (only for emergencies): git commit --no-verify');
  console.error('  Run `npm run dev:pending` after to track bypassed commits.');
  console.error('');
  process.exit(1);
}

process.exit(0);