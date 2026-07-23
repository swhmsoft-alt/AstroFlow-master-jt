/**
 * Global Post-build Image Optimization Pipeline
 * 
 * Scans entire dist/ for unconverted raster images (JPG, PNG),
 * converts them to WebP, removes originals, and updates every HTML file's references.
 * No hardcoded directories — finds everything automatically.
 */
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import sharp from 'sharp';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const root = path.resolve(__dirname, '..');
const distDir = path.join(root, 'dist');
const publicDir = path.join(root, 'public');

const RASTER_EXT = new Set(['.jpg', '.jpeg', '.png']);
const WEBP_QUALITY = 82;

/**
 * Recursively collect all files with a given extension set.
 */
async function collectFiles(dir, extensions) {
  const results = [];
  const entries = await fs.readdir(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      results.push(...await collectFiles(fullPath, extensions));
    } else {
      const ext = path.extname(entry.name).toLowerCase();
      if (extensions.has(ext)) results.push(fullPath);
    }
  }
  return results;
}

/**
 * Recursively copy a directory (source → dest), optionally overwriting existing files.
 */
async function copyDir(src, dest, overwrite = true) {
  const entries = await fs.readdir(src, { withFileTypes: true });
  await fs.mkdir(dest, { recursive: true });
  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    if (entry.isDirectory()) {
      await copyDir(srcPath, destPath, overwrite);
    } else if (overwrite) {
      await fs.copyFile(srcPath, destPath);
    } else {
      try {
        await fs.access(destPath);
        // File exists, skip
      } catch {
        await fs.copyFile(srcPath, destPath);
      }
    }
  }
}

/**
 * Convert one raster image to WebP. Returns null on success or error message.
 */
async function convertToWebP(filePath) {
  const ext = path.extname(filePath);
  const base = path.basename(filePath, ext);
  const dir = path.dirname(filePath);
  const webpPath = path.join(dir, `${base}.webp`);

  // Skip if WebP already exists (prebuild already created it)
  try {
    await fs.access(webpPath);
    // WebP already exists — just remove the raster original
    await fs.unlink(filePath);
    return { base, skipped: true, originalBytes: 0, webpBytes: 0 };
  } catch {
    // WebP does not exist, proceed with conversion
  }

  const stat = await fs.stat(filePath);
  const originalBytes = stat.size;

  await sharp(filePath)
    .webp({ quality: WEBP_QUALITY, effort: 4 })
    .toFile(webpPath);

  const webpStat = await fs.stat(webpPath);
  await fs.unlink(filePath);

  return { base, skipped: false, originalBytes, webpBytes: webpStat.size };
}

/**
 * Update all HTML files: replace .jpg/.png references with .webp.
 */
async function updateHtmlReferences() {
  const htmlFiles = await collectFiles(distDir, new Set(['.html']));
  let updated = 0;

  for (const htmlPath of htmlFiles) {
    try {
      let html = await fs.readFile(htmlPath, 'utf-8');
      const original = html;

      // Replace any /path/to/file.jpg → /path/to/file.webp
      // Also /path/to/file.png → /path/to/file.webp (only for public/images scene)
      // Pattern: a URL-path (starts with /) ending in .jpg or .png, followed by a quote
      html = html.replace(/(\/[^"'\s?]+)\.(jpg|jpeg|png)(['"])/gi, (match, urlPath, ext, quote) => {
        // Skip data URIs and external URLs
        if (urlPath.includes('//')) return match;
        return `${urlPath}.webp${quote}`;
      });

      if (html !== original) {
        await fs.writeFile(htmlPath, html, 'utf-8');
        updated++;
      }
    } catch {
      // Silently skip inaccessible files
    }
  }

  return updated;
}

async function main() {
  console.log('═══════════════════════════════════════════');
  console.log('  Global Post-build Image Optimization');
  console.log('═══════════════════════════════════════════\n');

  // 0. Ensure dist/images exists by syncing from public/ (build may not copy it)
  const publicImagesDir = path.join(publicDir, 'images');
  const distImagesDir = path.join(distDir, 'images');
  try {
    await fs.access(publicImagesDir);
    await fs.mkdir(distImagesDir, { recursive: true });
    // Copy public/images/ → dist/images/ recursively, only if file doesn't exist in dist
    await copyDir(publicImagesDir, distImagesDir, false);
    console.log('  Synced public/images/ → dist/images/\n');
  } catch {
    // public/images/ doesn't exist, skip
  }

  // 1. Collect all raster images in dist/
  console.log(`Scanning ${distDir} for raster images...\n`);
  const imageFiles = await collectFiles(distDir, RASTER_EXT);
  
  if (imageFiles.length === 0) {
    console.log('No raster images found in dist/.\n');
  } else {
    console.log(`Found ${imageFiles.length} files to convert\n`);

    let totalOriginal = 0;
    let totalWebp = 0;
    let converted = 0;
    let skipped = 0;
    let errors = 0;

    for (const fp of imageFiles) {
      try {
        const result = await convertToWebP(fp);
        if (result.skipped) {
          skipped++;
          console.log(`  ~ ${result.base}  (WebP already exists, removed original)`);
        } else {
          converted++;
          totalOriginal += result.originalBytes;
          totalWebp += result.webpBytes;
          const rel = path.relative(distDir, fp);
          const saving = ((1 - result.webpBytes / result.originalBytes) * 100).toFixed(1);
          console.log(`  ✓ ${rel}`);
          console.log(`      ${(result.originalBytes / 1024 / 1024).toFixed(2)}MB → ${(result.webpBytes / 1024 / 1024).toFixed(2)}MB  (-${saving}%)`);
        }
      } catch (e) {
        errors++;
        console.error(`  ✗ ${path.relative(distDir, fp)}: ${e.message}`);
      }
    }

    console.log(`\n─── Image Summary ───`);
    console.log(`  Converted: ${converted}  |  Already had WebP: ${skipped}  |  Errors: ${errors}`);
    if (totalOriginal > 0) {
      console.log(`  Original: ${(totalOriginal / 1024 / 1024).toFixed(2)} MB`);
      console.log(`  WebP:     ${(totalWebp / 1024 / 1024).toFixed(2)} MB  (-${((1 - totalWebp / totalOriginal) * 100).toFixed(1)}%)`);
    }
  }

  // 2. Update HTML references
  console.log(`\n─── HTML Reference Updates ───\n`);
  const updated = await updateHtmlReferences();
  console.log(`${updated} HTML files updated with .webp references\n`);

  console.log('Completed.');
}

main().catch(err => { console.error(err); process.exit(1); });
