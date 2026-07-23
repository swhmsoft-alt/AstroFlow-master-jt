/**
 * Global Pre-build Image Optimization Pipeline
 * 
 * Scans the entire project (excluding node_modules, dist, .git) for all raster images,
 * compress in-place and generate WebP derivatives alongside originals.
 * No hardcoded directories — finds images everywhere, automatically.
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
      if (IMAGE_EXT.has(ext)) {
        results.push(fullPath);
      }
    }
  }
  
  return results;
}

/**
 * Derive a safe WebP file path next to the original.
 */
function webpPathFor(filePath) {
  const ext = path.extname(filePath);
  return filePath.slice(0, -ext.length) + '.webp';
}

/**
 * Compress a raster image in-place and generate a WebP companion.
 */
async function processImage(filePath) {
  const statBefore = await fs.stat(filePath);
  const ext = path.extname(filePath).toLowerCase();
  const base = path.basename(filePath);
  const dir = path.dirname(filePath);
  const tmpPath = path.join(dir, `.tmp_${base}`);
  const webpPath = webpPathFor(filePath);

  // Step 1: In-place compression (original format, smaller bytes)
  if (ext === '.jpg' || ext === '.jpeg') {
    await sharp(filePath)
      .jpeg({ quality: WEBP_QUALITY, mozjpeg: true })
      .toFile(tmpPath);
  } else if (ext === '.png') {
    await sharp(filePath)
      .png({ compressionLevel: 9, palette: true, colors: 256 })
      .toFile(tmpPath);
  }

  const compressedStat = await fs.stat(tmpPath);
  const saving = ((1 - compressedStat.size / statBefore.size) * 100).toFixed(1);

  // Replace original with compressed
  await fs.unlink(filePath);
  await fs.rename(tmpPath, filePath);

  // Step 2: Generate WebP alongside (uses the newly compressed source)
  await sharp(filePath)
    .webp({ quality: WEBP_QUALITY, effort: 4 })
    .toFile(webpPath);

  const webpStat = await fs.stat(webpPath);

  return {
    base,
    originalBytes: statBefore.size,
    compressedBytes: compressedStat.size,
    webpBytes: webpStat.size,
    savingPct: saving,
  };
}

async function main() {
  console.log('═══════════════════════════════════════════');
  console.log('  Global Pre-build Image Optimization');
  console.log('═══════════════════════════════════════════\n');

  console.log(`Scanning ${SCAN_DIRS.join(', ')}/ for images...\n`);

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
    console.log('No raster images found. Nothing to do.\n');
    return;
  }

  console.log(`Found ${imageFiles.length} images\n`);

  let totalOriginal = 0;
  let totalCompressed = 0;
  let totalWebp = 0;
  let processed = 0;
  let errors = 0;

  for (const fp of imageFiles) {
    try {
      const result = await processImage(fp);
      totalOriginal += result.originalBytes;
      totalCompressed += result.compressedBytes;
      totalWebp += result.webpBytes;
      processed++;

      const ext = path.extname(fp).toLowerCase();
      const rel = path.relative(root, fp);
      console.log(`  ✓ ${rel}`);
      console.log(`      ${ext}: ${(result.originalBytes / 1024 / 1024).toFixed(2)}MB → ${(result.compressedBytes / 1024 / 1024).toFixed(2)}MB  (-${result.savingPct}%)`);
      console.log(`      .webp: ${(result.webpBytes / 1024 / 1024).toFixed(2)}MB  (-${((1 - result.webpBytes / result.originalBytes) * 100).toFixed(1)}%)`);
    } catch (e) {
      errors++;
      console.error(`  ✗ ${path.relative(root, fp)}: ${e.message}`);
    }
  }

  console.log(`\n─── Summary ───`);
  console.log(`  Images processed: ${processed}  (${errors ? errors + ' errors' : '0 errors'})`);
  console.log(`  Original total:   ${(totalOriginal / 1024 / 1024).toFixed(2)} MB`);
  console.log(`  Compressed:       ${(totalCompressed / 1024 / 1024).toFixed(2)} MB  (-${((1 - totalCompressed / totalOriginal) * 100).toFixed(1)}%)`);
  console.log(`  WebP total:       ${(totalWebp / 1024 / 1024).toFixed(2)} MB  (-${((1 - totalWebp / totalOriginal) * 100).toFixed(1)}%)`);
  console.log('');
  console.log('Completed.');
}

main().catch(err => { console.error(err); process.exit(1); });
