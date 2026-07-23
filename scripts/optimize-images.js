/**
 * Pre-build Image Optimization Pipeline
 * 
 * Scans src/ and public/ for raster images (JPG, PNG) and generates
 * WebP companions alongside the originals.
 * 
 * SAFE: Never modifies or deletes original files.
 * If the script is interrupted, no data loss occurs.
 */
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import sharp from 'sharp';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const root = path.resolve(__dirname, '..');

const SCAN_DIRS = ['src', 'public'];
const EXCLUDE_DIRS = new Set(['node_modules', 'dist', '.git', '.history', '.astro', 'derived']);
const IMAGE_EXT = new Set(['.jpg', '.jpeg', '.png']);
const WEBP_QUALITY = 82;

/**
 * Recursively scan a directory for image files, respecting exclusion list.
 */
async function scanImages(dir) {
  const results = [];
  const entries = await fs.readdir(dir, { withFileTypes: true });
  for (const entry of entries) {
    if (EXCLUDE_DIRS.has(entry.name)) continue;
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      results.push(...await scanImages(fullPath));
    } else {
      const ext = path.extname(entry.name).toLowerCase();
      if (IMAGE_EXT.has(ext)) results.push(fullPath);
    }
  }
  return results;
}

/**
 * Generate a WebP file alongside the original. Never touches the original.
 * If WebP already exists and is newer than the source, skip it.
 */
async function generateWebP(filePath) {
  const ext = path.extname(filePath);
  const base = path.basename(filePath, ext);
  const dir = path.dirname(filePath);
  const webpPath = path.join(dir, `${base}.webp`);

  // Skip if WebP already exists and is newer than the source
  try {
    const srcStat = await fs.stat(filePath);
    try {
      const webpStat = await fs.stat(webpPath);
      if (webpStat.mtimeMs >= srcStat.mtimeMs) {
        return { base, skipped: true, originalBytes: srcStat.size, webpBytes: webpStat.size };
      }
    } catch {
      // WebP doesn't exist, proceed
    }
  } catch {
    // Source doesn't exist (shouldn't happen), skip
    return { base, skipped: true, originalBytes: 0, webpBytes: 0 };
  }

  const stat = await fs.stat(filePath);
  const originalBytes = stat.size;

  await sharp(filePath)
    .webp({ quality: WEBP_QUALITY, effort: 4 })
    .toFile(webpPath);

  const webpStat = await fs.stat(webpPath);

  return { base, skipped: false, originalBytes, webpBytes: webpStat.size };
}

async function main() {
  console.log('═══════════════════════════════════════════');
  console.log('  Pre-build WebP Generation (safe mode)');
  console.log('  Originals are NEVER modified or deleted');
  console.log('═══════════════════════════════════════════\n');

  // Collect images from all configured scan directories
  const imageFiles = [];
  for (const scanDir of SCAN_DIRS) {
    const dirPath = path.join(root, scanDir);
    try {
      await fs.access(dirPath);
      const files = await scanImages(dirPath);
      imageFiles.push(...files);
      console.log(`  ${scanDir}/: ${files.length} images`);
    } catch {
      console.log(`  ${scanDir}/: (not found, skipped)`);
    }
  }

  if (imageFiles.length === 0) {
    console.log('\nNo raster images found. Nothing to do.\n');
    return;
  }

  console.log(`\nProcessing ${imageFiles.length} images...\n`);

  let totalOriginal = 0;
  let totalWebp = 0;
  let generated = 0;
  let skipped = 0;

  for (const fp of imageFiles) {
    try {
      const result = await generateWebP(fp);
      if (result.skipped) {
        skipped++;
        if (result.originalBytes > 0) {
          // WebP already up-to-date
          totalOriginal += result.originalBytes;
          totalWebp += result.webpBytes;
        }
      } else {
        generated++;
        totalOriginal += result.originalBytes;
        totalWebp += result.webpBytes;
        const rel = path.relative(root, fp);
        const saving = ((1 - result.webpBytes / result.originalBytes) * 100).toFixed(1);
        console.log(`  \u2713 ${rel}`);
        console.log(`      .webp: ${(result.webpBytes / 1024 / 1024).toFixed(2)}MB  (-${saving}%)`);
      }
    } catch (e) {
      console.error(`  \u2717 ${path.relative(root, fp)}: ${e.message}`);
    }
  }

  console.log(`\n─── Summary (safe mode — originals preserved) ───`);
  console.log(`  Generated: ${generated}  |  Already up-to-date: ${skipped}`);
  console.log(`  Original total: ${(totalOriginal / 1024 / 1024).toFixed(2)} MB`);
  if (totalWebp > 0) {
    console.log(`  WebP total:     ${(totalWebp / 1024 / 1024).toFixed(2)} MB  (-${((1 - totalWebp / totalOriginal) * 100).toFixed(1)}%)`);
  }
  console.log('\nCompleted.');
}

main().catch(err => { console.error(err); process.exit(1); });
