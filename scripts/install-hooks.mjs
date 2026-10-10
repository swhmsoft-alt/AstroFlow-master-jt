#!/usr/bin/env node
// Install/uninstall the project's custom git hooks (no npm dependency).
// Sets `core.hooksPath = .githooks` so git picks up scripts in this repo's .githooks/ folder.

import { execSync } from 'node:child_process';
import { existsSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const repoRoot = resolve(__dirname, '..');
const hooksDir = resolve(repoRoot, '.githooks');

if (process.argv.includes('--uninstall')) {
  try {
    execSync('git config --unset core.hooksPath', { cwd: repoRoot });
    console.log('[hooks] uninstalled: core.hooksPath reset to default (.git/hooks/)');
  } catch (err) {
    console.log('[hooks] nothing to uninstall (core.hooksPath was not set)');
  }
  process.exit(0);
}

if (!existsSync(hooksDir)) {
  console.error('[hooks] FAIL: .githooks/ not found at', hooksDir);
  process.exit(1);
}

try {
  execSync('git config core.hooksPath .githooks', { cwd: repoRoot });
  console.log('[hooks] installed: core.hooksPath = .githooks');
  console.log('[hooks] active hooks:');
  for (const name of ['post-commit', 'commit-msg']) {
    const f = resolve(hooksDir, name);
    if (existsSync(f)) console.log('  - ' + name);
  }
  console.log('');
  console.log('[hooks] Verify with: git commit --allow-empty -m "smoke-test hooks"');
} catch (err) {
  console.error('[hooks] FAIL:', err.message);
  process.exit(1);
}