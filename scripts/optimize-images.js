import fs from 'fs/promises';
import path from 'path';
import sharp from 'sharp';

const root = new URL(import.meta.url).pathname.split('/').slice(0, -3).join('/');
const assetsDir = path.join(root, 'src', 'assets');
const outDir = path.join(root, 'public', 'images', 'derived');

const widths = [480, 768, 1024, 1600, 2070];

async function ensureDir(dir) {
  await fs.mkdir(dir, { recursive: true });
}

async function optimizeFile(file) {
  const ext = path.extname(file).toLowerCase();
  const base = path.basename(file, ext);
  const inputPath = path.join(assetsDir, file);

  for (const w of widths) {
    const outPath = path.join(outDir, `${base}_w${w}.webp`);
    await sharp(inputPath).resize({ width: w }).webp({ quality: 80 }).toFile(outPath);
  }
}

async function main() {
  await ensureDir(outDir);
  const files = await fs.readdir(assetsDir);
  const images = files.filter(f => /\.(jpe?g|png)$/i.test(f));
  for (const file of images) {
    console.log('Optimizing', file);
    try {
      await optimizeFile(file);
    } catch (e) {
      console.error('Failed optimizing', file, e.message);
    }
  }
  console.log('Done. Derived images placed in', outDir);
}

main().catch(err => { console.error(err); process.exit(1); });
