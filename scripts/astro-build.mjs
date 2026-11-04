#!/usr/bin/env node
/**
 * scripts/astro-build.mjs
 *
 * Build launcher that guarantees Astro and Vite agree on path casing.
 *
 * THE BUG THIS PREVENTS (found 2026-11-04)
 * ------------------------------------------
 * On Windows the whole site was built with ZERO CSS while the build reported
 * success. Root cause:
 *
 *   • Astro derives each page's module URL from `config.root`
 *     (`static-build.js`: `new URL("./" + pageData.component, settings.config.root)`)
 *     and keys its page registry by `viteID(componentURL)` = `fileURLToPath()`.
 *     `config.root` defaults to `process.cwd()` — the path string EXACTLY as
 *     the caller typed it.
 *   • Vite/Rollup resolve module ids to the REAL on-disk path, i.e. the
 *     canonical drive-letter casing.
 *
 * So building from `c:\Users\...\AstroFlow-master-jt` produced registry keys
 * `c:/Users/.../src/pages/404.astro` while Vite used
 * `C:/Users/.../src/pages/404.astro`. `internals.pagesByViteID.get(pageId)`
 * returned `undefined` for every page, so `appendCSSToPage()` was never called,
 * `pagesToCss` stayed EMPTY, and Astro's CSS plugin classified every emitted
 * stylesheet as "orphaned" and DELETED it from the bundle:
 *
 *     [CSSPROBE] pagesToCss entries = 0
 *     [CSSPROBE] inline asset _astro/_slug_.BKdOrBOp.css len 117473 matchedPages 0 of 301
 *
 * Setting `root` explicitly in astro.config.mjs does NOT help: the config
 * schema transforms it with `new URL(...)` / `resolveDirAsUrl(...)`, and URL
 * parsing lower-cases the drive letter (it is read as a URL *scheme*).
 *
 * THE FIX
 * -------
 * Spawn Astro with a canonicalised working directory. `process.cwd()` in the
 * child then reports the true on-disk casing, Astro's registry keys match
 * Vite's module ids, and the CSS→page mapping is restored — regardless of how
 * the build was invoked (npm script, detached runner, CI, manual terminal).
 *
 * Usage:
 *   node scripts/astro-build.mjs            # equivalent to `npx astro build`
 *   node scripts/astro-build.mjs -- --root . # extra args are forwarded
 */

import { realpathSync } from 'node:fs';
import { promises as fsp } from 'node:fs';
import { spawn } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { join } from 'node:path';

const ROOT = fileURLToPath(new URL('..', import.meta.url));

/**
 * Canonical on-disk path of the project root.
 *
 * NOTE: `fs.realpathSync()` (the JS implementation) PRESERVES the casing of the
 * input path on Windows — it resolves symlinks but does not fix the drive-letter
 * case, so it cannot be used here. `fs.realpathSync.native()` and
 * `fs.promises.realpath()` go through `GetFinalPathNameByHandle()` and return
 * the true on-disk casing, which is exactly what we need.
 *
 * @param {string} dir
 * @returns {Promise<string>}
 */
async function canonical(dir) {
	// Windows extended-length prefix (`\\?\`) — strip it.
	const strip = (p) => p.replace(/^\\\\\?\\/, '');
	try {
		return strip(realpathSync.native(dir));
	} catch {
		try {
			return strip(await fsp.realpath(dir));
		} catch {
			try {
				return strip(realpathSync(dir));
			} catch {
				return dir;
			}
		}
	}
}

const cwd = await canonical(ROOT);
const astroCli = join(cwd, 'node_modules', 'astro', 'astro.js');

console.log(`[astro-build] project root (canonical): ${cwd}`);

// Forward any extra CLI args (`--`, `--root`, `--verbose`, …).
const argv = process.argv.slice(2).filter((a) => a !== '--');

const child = spawn(process.execPath, [astroCli, 'build', ...argv], {
	cwd,
	stdio: 'inherit',
	env: process.env,
});

child.on('error', (err) => {
	console.error(`[astro-build] failed to start Astro: ${err.message}`);
	process.exit(1);
});

child.on('exit', (code, signal) => {
	if (signal) {
		console.error(`[astro-build] Astro terminated by signal ${signal}`);
		process.exit(1);
	}
	process.exit(code ?? 0);
});
