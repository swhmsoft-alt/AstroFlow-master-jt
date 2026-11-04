#!/usr/bin/env node

/**
 * ============================================================================
 * normalize-product-images.mjs
 *
 * 归一化手工投放的产品图，使其符合站点图片契约：
 *   1. 修正「扩展名与真实格式不符」的文件（例：.png 文件里其实是 JPEG 字节）
 *      —— 浏览器按 Content-Type 渲染，格式不符会导致图片无法显示。
 *   2. 为每张位图生成 .webp 伴生文件（quality 82 / effort 4，与
 *      scripts/optimize-images.js 和 scripts/postbuild-images.mjs 一致）。
 *   3. 保留原始像素尺寸（不做裁切/缩放）—— 卡片容器 object-cover 会自行裁切。
 *
 * 用法：
 *   node scripts/normalize-product-images.mjs --dry-run
 *   node scripts/normalize-product-images.mjs --apply
 *   node scripts/normalize-product-images.mjs --apply --only titanium-hex-bolt-iso-4014
 *
 * 说明：
 *   - 只处理 .png / .jpg / .jpeg；.svg 占位图一律保留（onerror 兜底链依赖它）。
 *   - 不删除任何源文件。
 * ============================================================================
 */

import fs from 'node:fs';
import fsp from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const PRODUCTS_DIR = path.join(ROOT, 'public', 'images', 'products');

const WEBP_QUALITY = 82;
const WEBP_EFFORT = 4;
const RASTER_EXT = new Set(['.png', '.jpg', '.jpeg']);

/** 真实格式 → 扩展名映射（sharp 的 format 名称） */
const FORMAT_TO_EXT = {
  png: '.png',
  jpeg: '.jpg',
  webp: '.webp',
  avif: '.avif',
  gif: '.gif',
  tiff: '.tiff',
};

function parseArgs(argv) {
  const opts = { apply: false, dryRun: false, only: null };
  for (let i = 0; i < argv.length; i++) {
    switch (argv[i]) {
      case '--apply':
        opts.apply = true;
        break;
      case '--dry-run':
        opts.dryRun = true;
        break;
      case '--only':
        opts.only = argv[++i];
        break;
      default:
        if (argv[i].startsWith('--')) throw new Error(`Unknown flag: ${argv[i]}`);
    }
  }
  if (!opts.apply && !opts.dryRun) opts.dryRun = true;
  return opts;
}

/**
 * 归一化单张位图。
 *
 * @param {string} filePath  源文件路径
 * @param {boolean} write    false = 只分析不落盘（dry-run）
 * 返回 { status, message, webp, webpBytes, dimensions, format }
 */
async function normalizeOne(filePath, write) {
  const ext = path.extname(filePath).toLowerCase();
  const dir = path.dirname(filePath);
  const base = path.basename(filePath, ext);

  const input = await fsp.readFile(filePath);
  const meta = await sharp(input, { failOn: 'none' }).metadata();
  const actualFormat = meta.format;
  const actualExt = FORMAT_TO_EXT[actualFormat] || ext;

  // 1) 扩展名与真实格式是否一致
  //
  // 不一致时（例如 .png 文件里其实是 JPEG 字节），浏览器会按 Content-Type
  // (image/png) 渲染并拒绝显示。处理方式：
  //   - 按真实格式另存一份带正确扩展名的副本（如 xxx.jpg）
  //   - 把原扩展名的文件重新编码成真正的该扩展名格式（.png → 真 PNG）
  // 两者像素完全相同，仅编码容器不同。
  let fixedNote = null;
  if (actualExt !== ext) {
    fixedNote = `${path.basename(filePath)} 实为 ${actualFormat} → 应为真 ${ext.replace('.', '').toUpperCase()}`;
    if (write) {
      const siblingPath = path.join(dir, base + actualExt);
      await fsp.writeFile(siblingPath, input);
      await sharp(input, { failOn: 'none' }).png({ compressionLevel: 9 }).toFile(filePath);
    }
  }

  // 2) 生成 webp 伴生文件（始终以源文件为输入，保持像素一致）
  const webpPath = path.join(dir, `${base}.webp`);
  if (write) {
    await sharp(filePath, { failOn: 'none' })
      .webp({ quality: WEBP_QUALITY, effort: WEBP_EFFORT })
      .toFile(webpPath);
  }

  const webpBytes = write ? (await fsp.stat(webpPath)).size : null;

  return {
    status: fixedNote ? 'fixed' : 'ok',
    message: fixedNote,
    webp: path.relative(ROOT, webpPath),
    webpBytes,
    dimensions: `${meta.width}x${meta.height}`,
    format: actualFormat,
  };
}

async function main() {
  const opts = parseArgs(process.argv.slice(2));

  if (!fs.existsSync(PRODUCTS_DIR)) {
    console.error(`❌ 目录不存在: ${PRODUCTS_DIR}`);
    process.exit(1);
  }

  const all = (await fsp.readdir(PRODUCTS_DIR, { withFileTypes: true }))
    .filter((d) => d.isFile())
    .map((d) => path.join(PRODUCTS_DIR, d.name))
    .filter((p) => RASTER_EXT.has(path.extname(p).toLowerCase()));

  const targets = opts.only
    ? all.filter((p) => path.basename(p, path.extname(p)) === opts.only)
    : all;

  if (targets.length === 0) {
    console.log('没有匹配的目标文件。');
    return;
  }

  console.log(`\n扫描 ${targets.length} 个位图文件（${opts.apply ? 'APPLY' : 'DRY RUN'}）\n`);

  let fixed = 0;
  let ok = 0;
  let errors = 0;
  let totalWebpBytes = 0;

  for (const p of targets) {
    const rel = path.relative(ROOT, p);
    try {
      const r = await normalizeOne(p, opts.apply);
      if (r.webpBytes !== null) totalWebpBytes += r.webpBytes;
      const size = r.webpBytes !== null ? `webp ${(r.webpBytes / 1024).toFixed(0)} KB` : 'webp (未生成)';
      if (r.status === 'fixed') {
        fixed++;
        console.log(`  ✎ ${rel}`);
        console.log(`      ${r.message}`);
        console.log(`      ${size} · ${r.dimensions}`);
      } else {
        ok++;
        console.log(`  ✓ ${rel}  [${r.format} ${r.dimensions}] → ${size}`);
      }
    } catch (err) {
      errors++;
      console.error(`  ✗ ${rel}: ${err.message}`);
    }
  }

  console.log(`\n─── 汇总 ───`);
  console.log(`  格式需修正: ${fixed}   已规范: ${ok}   错误: ${errors}`);
  if (opts.apply) {
    console.log(`  webp 合计: ${(totalWebpBytes / 1024 / 1024).toFixed(2)} MB`);
  }
  if (!opts.apply) {
    console.log('\n🔍 [DRY RUN] 未写入任何文件。执行 --apply 以应用。');
  }
  console.log('');
}

main().catch((err) => {
  console.error('❌ 执行失败:', err.message);
  process.exit(1);
});
