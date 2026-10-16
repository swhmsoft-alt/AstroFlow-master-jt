#!/usr/bin/env node
/**
 * scripts/migrate-uploads-to-webp.mjs
 *
 * P-DSC (2026-10-16): Source-level JPG → WebP migration for public/uploads/.
 *
 * Background:
 *   postbuild-images.mjs already converts every raster file under dist/
 *   to WebP on each build, so the deployed site is WebP-only. But the
 *   SOURCE originals under public/uploads/ were never replaced — they
 *   remain as .jpg / .png, totalling 121 JPGs at ~454 MB (vs ~27 MB of
 *   their WebP twins). Migrating the source is purely a source-control /
 *   git-history / developer-disk cost reduction; the deployed site is
 *   unaffected (postbuild-images.mjs short-circuits on already-WebP).
 *
 *   Net effect of running this once and committing:
 *     - git history shrinks by ~320 MB (121 files × ~70% reduction)
 *     - developer clone / checkout disk usage shrinks accordingly
 *     - postbuild-images.mjs saves time on rebuilds (no .jpg to scan)
 *
 *   Safe to delete the .jpg files after each successful WebP write
 *   because:
 *     - public/uploads/ is excluded from build pipeline; only dist/ matters
 *     - WebP is the same quality (visual lossiness, not source fidelity)
 *     - .png originals (favicons, OG) are intentionally LEFT UNTOUCHED
 *       because they have transparency which WebP does not losslessly
 *       reproduce; PNG is the right container for transparency
 *
 * Idempotent: skips any .jpg whose .webp counterpart already exists.
 * Run with --dry-run to preview.
 *
 * Phases:
 *   1. Inventory:  walk public/uploads/ for *.jpg, classify into
 *      (a) JPG without WebP (need conversion) and (b) JPG with WebP (delete-only).
 *   2. Convert:    for (a), generate WebP via sharp (q=82, matches postbuild-images.mjs).
 *   3. Delete:     for (b) [and converted (a)], verify WebP is non-empty, then
 *                  unlink the JPG. PNGs are left alone.
 *
 * Flags:
 *   --dry-run        List operations, change nothing.
 *   --convert-only   Skip the Delete phase (convert but keep JPGs).
 *   --delete-only    Skip the Convert phase (delete only JPGs that already
 *                    have a non-empty WebP counterpart). This is the
 *                    typical case after postbuild-images.mjs has run.
 *
 * Usage:
 *   node scripts/migrate-uploads-to-webp.mjs                 # full run (convert + delete)
 *   node scripts/migrate-uploads-to-webp.mjs --delete-only   # only delete (most common)
 *   node scripts/migrate-uploads-to-webp.mjs --dry-run        # preview only
 */
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import sharp from 'sharp';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const root = path.resolve(__dirname, '..');
const uploadsDir = path.join(root, 'public', 'uploads');

const args = new Set(process.argv.slice(2));
const dryRun = args.has('--dry-run') || args.has('-n');
const deleteOnly = args.has('--delete-only');   // skip conversion, only delete .jpg whose .webp counterpart exists
const convertOnly = args.has('--convert-only'); // convert .jpg → .webp, do NOT delete .jpg

// Same quality as postbuild-images.mjs to keep parity with dist output.
const WEBP_QUALITY = 82;

async function* walk(dir) {
  let entries;
  try {
    entries = await fs.readdir(dir, { withFileTypes: true });
  } catch {
    return;
  }
  for (const entry of entries) {
    const p = path.join(dir, entry.name);
    if (entry.isDirectory()) yield* walk(p);
    else yield p;
  }
}

function fmtBytes(b) {
  if (b >= 1024 * 1024) return `${(b / 1024 / 1024).toFixed(1)} MB`;
  if (b >= 1024) return `${(b / 1024).toFixed(0)} KB`;
  return `${b} B`;
}

async function migrate() {
  try {
    await fs.access(uploadsDir);
  } catch {
    console.error(`[migrate-uploads] public/uploads/ not found (${uploadsDir}), aborting.`);
    process.exit(1);
  }

  // ── Phase 1: Inventory all JPGs and their WebP counterparts ──────
  const toConvert = [];   // jpg → webp, then delete
  const toDelete = [];     // jpg already has webp counterpart, safe to delete
  for await (const f of walk(uploadsDir)) {
    if (!/\.jpe?g$/i.test(f)) continue;
    const webp = f.replace(/\.jpe?g$/i, '.webp');
    let webpExists = false;
    try {
      await fs.access(webp);
      webpExists = true;
    } catch {
      // webp doesn't exist
    }
    if (webpExists) toDelete.push({ jpg: f, webp });
    else toConvert.push({ jpg: f, webp });
  }

  console.log(`[migrate-uploads] Phase 1 inventory:`);
  console.log(`  JPG without WebP (needs convert): ${toConvert.length}`);
  console.log(`  JPG with WebP (delete-only):      ${toDelete.length}`);
  console.log(`[migrate-uploads] Flags: dryRun=${dryRun} deleteOnly=${deleteOnly} convertOnly=${convertOnly}`);

  if (dryRun) {
    if (!deleteOnly) {
      for (const t of toConvert) console.log(`  [dry-run] convert: ${path.relative(root, t.jpg)}`);
    }
    for (const t of toDelete) console.log(`  [dry-run] delete:  ${path.relative(root, t.jpg)}`);
    console.log('[migrate-uploads] --dry-run mode, no files changed.');
    return { converted: 0, deleted: 0, savedBytes: 0 };
  }

  // ── Phase 2: Convert (if not delete-only) ───────────────────────
  let converted = 0;
  let savedBytes = 0;
  if (!deleteOnly) {
    for (const { jpg, webp } of toConvert) {
      try {
        const before = (await fs.stat(jpg)).size;
        await sharp(jpg).webp({ quality: WEBP_QUALITY }).toFile(webp);
        const after = (await fs.stat(webp)).size;
        savedBytes += before - after;
        converted++;
        console.log(`  ✓ converted: ${path.relative(root, jpg)} (${fmtBytes(before)} → ${fmtBytes(after)}, saved ${fmtBytes(before - after)})`);
        // Move to delete queue
        toDelete.push({ jpg, webp });
      } catch (e) {
        console.error(`  ✗ convert failed: ${path.relative(root, jpg)}: ${e.message ?? e}`);
      }
    }
  }

  // ── Phase 3: Delete JPGs (skipped if convert-only) ───────────────
  let deleted = 0;
  if (!convertOnly) {
    for (const { jpg, webp } of toDelete) {
      try {
        // Safety: verify the webp file is non-empty before deleting jpg
        const wpStat = await fs.stat(webp);
        if (wpStat.size === 0) {
          console.error(`  ✗ Skipped delete (zero-byte webp): ${path.relative(root, jpg)}`);
          continue;
        }
        const jpStat = await fs.stat(jpg);
        await fs.unlink(jpg);
        deleted++;
        savedBytes += jpStat.size;
        console.log(`  ✓ deleted:   ${path.relative(root, jpg)} (freed ${fmtBytes(jpStat.size)})`);
      } catch (e) {
        console.error(`  ✗ delete failed: ${path.relative(root, jpg)}: ${e.message ?? e}`);
      }
    }
  }

  console.log(`[migrate-uploads] Done: converted=${converted}, deleted=${deleted}, total saved ${fmtBytes(savedBytes)}.`);
  return { converted, deleted, savedBytes };
}

migrate()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error('[migrate-uploads] Fatal:', err);
    process.exit(1);
  });