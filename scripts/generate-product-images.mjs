#!/usr/bin/env node

/**
 * ============================================================================
 * generate-product-images.mjs
 * 
 * 批量生成产品图片并挂载到 Astro 页面。
 * 
 * 功能：
 *   1. 从指定的 JSON/CSV 文件或项目内 product-entities 数据源读取产品列表
 *   2. 调用 AI 图像生成 API（OpenAI DALL-E 3 / Stable Diffusion）为每个产品生成图片
 *   3. 将图片保存到 /public/images/products/ 目录，文件名使用 SKU 或 slug
 *   4. 将图片引用注入到对应的 Astro 页面或内容文件中
 *   5. 所有图片自动包含符合 SEO 规范的 alt 属性
 * 
 * 用法：
 *   node scripts/generate-product-images.mjs
 *   node scripts/generate-product-images.mjs --input ./data/products.csv       # 从 CSV 读取
 *   node scripts/generate-product-images.mjs --input ./data/products.json      # 从 JSON 读取
 *   node scripts/generate-product-images.mjs --provider openai --dry-run       # 仅预览不调用 API
 *   node scripts/generate-product-images.mjs --provider stability              # 使用 Stable Diffusion
 *   node scripts/generate-product-images.mjs --provider placeholder            # 生成 SVG 占位图
 *   node scripts/generate-product-images.mjs --skip-generation                 # 仅执行挂载步骤
 * 
 * 环境变量（.env 或系统环境）：
 *   OPENAI_API_KEY     - OpenAI API 密钥（使用 DALL-E 3 时必需）
 *   STABILITY_API_KEY  - Stability AI API 密钥（使用 Stable Diffusion 时必需）
 *   IMAGE_SIZE         - 图片尺寸，默认 "1024x1024"
 *   IMAGE_BATCH_SIZE   - 并发数量，默认 1（避免限流）
 * ============================================================================
 */

import fs from 'node:fs';
import fsp from 'node:fs/promises';
import path from 'node:path';
// SVG placeholder generation uses pure string templates — no canvas dependency needed
import { fileURLToPath } from 'node:url';

// ─── 常量 ──────────────────────────────────────────────────────────────────

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const IMAGES_DIR = path.join(ROOT, 'public', 'images', 'products');
const PRODUCT_ENTITIES_DIR = path.join(ROOT, 'src', 'content', 'product-entities');
const MDX_DIR = path.join(ROOT, 'src', 'pages', 'products');

const ALT_PREFIX = 'Grade 5 Titanium CNC';

// ─── CLI 参数解析 ───────────────────────────────────────────────────────────

function parseArgs() {
  const args = process.argv.slice(2);
  const opts = {
    input: null,                 // --input path/to/products.csv
    provider: 'placeholder',     // --provider openai | stability | placeholder
    dryRun: false,               // --dry-run
    skipGeneration: false,       // --skip-generation
    size: process.env.IMAGE_SIZE || '1024x1024',
    batchSize: parseInt(process.env.IMAGE_BATCH_SIZE || '1', 10),
  };

  for (let i = 0; i < args.length; i++) {
    switch (args[i]) {
      case '--input':
        opts.input = args[++i];
        break;
      case '--provider':
        opts.provider = args[++i];
        break;
      case '--dry-run':
        opts.dryRun = true;
        break;
      case '--skip-generation':
        opts.skipGeneration = true;
        break;
    }
  }
  return opts;
}

// ─── 产品数据读取 ────────────────────────────────────────────────────────────

/**
 * 从项目内的 product-entities JSON 文件读取产品数据
 * 返回格式: [{ sku: "titanium-bell-crank-rocker-arm", title: "Titanium Bell Crank Rocker Arm", ... }]
 */
async function readFromProductEntities() {
  console.log('📂 从 product-entities 读取产品数据...');

  if (!fs.existsSync(PRODUCT_ENTITIES_DIR)) {
    console.error(`❌ 目录不存在: ${PRODUCT_ENTITIES_DIR}`);
    return [];
  }

  const files = (await fsp.readdir(PRODUCT_ENTITIES_DIR))
    .filter(f => f.endsWith('.json'))
    .sort();

  const products = [];
  for (const file of files) {
    const filePath = path.join(PRODUCT_ENTITIES_DIR, file);
    const content = JSON.parse(await fsp.readFile(filePath, 'utf-8'));
    const slug = file.replace(/\.json$/, '');
    const title = content.title || slug;
    products.push({
      sku: slug,
      title,
      material: content.material || content.alloy || 'Grade 5 Ti-6Al-4V',
      category: content.category || '',
      industry: content.industry || '',
      filePath,
    });
  }

  console.log(`   ✓ 读取到 ${products.length} 个产品`);
  return products;
}

/**
 * 从外部 JSON/CSV 文件读取产品数据
 * JSON 格式: [{ sku: "...", title: "..." }, ...]
 * CSV 格式: sku,title[,material,...]
 */
async function readFromFile(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  
  if (!fs.existsSync(filePath)) {
    console.error(`❌ 文件不存在: ${filePath}`);
    process.exit(1);
  }

  if (ext === '.json') {
    const content = JSON.parse(await fsp.readFile(filePath, 'utf-8'));
    const arr = Array.isArray(content) ? content : (content.products || content.data || []);
    return arr.map(item => ({
      sku: item.sku || item.id || item.slug || '',
      title: item.title || item.name || '',
      material: item.material || 'Grade 5 Ti-6Al-4V',
      category: item.category || '',
      industry: item.industry || '',
    })).filter(p => p.sku && p.title);
  }

  if (ext === '.csv') {
    const raw = await fsp.readFile(filePath, 'utf-8');
    const lines = raw.trim().split('\n');
    if (lines.length < 2) return [];
    const headers = lines[0].split(',').map(h => h.trim().toLowerCase());
    const products = [];
    for (let i = 1; i < lines.length; i++) {
      const vals = lines[i].split(',').map(v => v.trim());
      const item = {};
      headers.forEach((h, idx) => { item[h] = vals[idx] || ''; });
      products.push({
        sku: item.sku || item.id || item.slug || '',
        title: item.title || item.name || '',
        material: item.material || 'Grade 5 Ti-6Al-4V',
        category: item.category || '',
        industry: item.industry || '',
      });
    }
    return products.filter(p => p.sku && p.title);
  }

  console.error(`❌ 不支持的文件格式: ${ext}`);
  process.exit(1);
}

// ─── AI 图像生成 ────────────────────────────────────────────────────────────

/**
 * 构建 AI 生成的产品图片 prompt
 * 确保风格统一：白色背景、工作室灯光、3D 渲染质感
 */
function buildPrompt(product) {
  const material = product.material || 'Grade 5 Ti-6Al-4V titanium alloy';
  const title = product.title;
  return [
    `High-quality 3D product rendering of a ${title} component,`,
    `precision CNC machined from ${material},`,
    `isolated on pure white background, studio lighting,`,
    `soft shadows, photorealistic, sharp focus, professional product photography,`,
    `detailed surface texture showing machining marks,`,
    `8K resolution, clean aesthetic, commercial product shot`
  ].join(' ');
}

/**
 * 调用 OpenAI DALL-E 3 API 生成图片
 */
async function generateWithOpenAI(prompt, size) {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error('OPENAI_API_KEY 环境变量未设置');
  }

  const [w, h] = size.split('x').map(Number);

  const response = await fetch('https://api.openai.com/v1/images/generations', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: 'dall-e-3',
      prompt,
      n: 1,
      size: `${w}x${h}`,
      quality: 'standard',
      response_format: 'b64_json',
    }),
  });

  if (!response.ok) {
    const err = await response.text();
    throw new Error(`OpenAI API 错误 (${response.status}): ${err}`);
  }

  const data = await response.json();
  const b64 = data.data[0]?.b64_json;
  if (!b64) throw new Error('OpenAI 响应中未找到图片数据');
  
  return Buffer.from(b64, 'base64');
}

/**
 * 调用 Stability AI / Stable Diffusion API 生成图片
 */
async function generateWithStability(prompt, size) {
  const apiKey = process.env.STABILITY_API_KEY;
  if (!apiKey) {
    throw new Error('STABILITY_API_KEY 环境变量未设置');
  }

  const [w, h] = size.split('x').map(Number);

  const response = await fetch(
    'https://api.stability.ai/v2beta/stable-image/generate/sd3',
    {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Accept': 'image/*',
      },
      body: new URLSearchParams({
        prompt,
        output_format: 'jpeg',
        width: w.toString(),
        height: h.toString(),
        style_preset: 'product-photography',
        negative_prompt: 'text, watermark, signature, logo, label, human, person, hand, low quality, blurry',
      }),
    }
  );

  if (!response.ok) {
    const err = await response.text();
    throw new Error(`Stability API 错误 (${response.status}): ${err}`);
  }

  const buffer = Buffer.from(await response.arrayBuffer());
  return buffer;
}

/**
 * 生成 SVG 占位图（用于无 API 密钥时的测试/开发环境）
 * 图片上显示产品名称，视觉效果干净专业
 */
function generatePlaceholderSVG(product, size) {
  const [w, h] = size.split('x').map(Number) || [1024, 1024];
  const title = product.title;
  const material = product.material || 'Grade 5 Ti-6Al-4V';

  // 根据标题哈希生成一个稳定的品牌色
  let hash = 0;
  for (let i = 0; i < title.length; i++) {
    hash = title.charCodeAt(i) + ((hash << 5) - hash);
  }
  const hue = Math.abs(hash % 360);
  const bgLight = `hsl(${hue}, 15%, 92%)`;
  const bgDark = `hsl(${hue}, 20%, 85%)`;
  const accent = `hsl(${hue}, 35%, 45%)`;

  // 确保文件名安全
  const safeSlug = product.sku.replace(/[^a-z0-9-]/gi, '-');

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:${bgLight}"/>
      <stop offset="100%" style="stop-color:${bgDark}"/>
    </linearGradient>
    <linearGradient id="shine" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:rgba(255,255,255,0.4)"/>
      <stop offset="50%" style="stop-color:rgba(255,255,255,0.0)"/>
      <stop offset="100%" style="stop-color:rgba(255,255,255,0.1)"/>
    </linearGradient>
  </defs>
  <!-- 背景 -->
  <rect width="${w}" height="${h}" fill="url(#bg)" rx="16"/>
  <!-- 产品轮廓（抽象几何表示） -->
  <rect x="${w*0.2}" y="${h*0.15}" width="${w*0.6}" height="${h*0.5}" rx="${Math.min(w,h)*0.04}" 
        fill="none" stroke="${accent}" stroke-width="3" opacity="0.3"/>
  <circle cx="${w*0.5}" cy="${h*0.4}" r="${Math.min(w,h)*0.15}" 
          fill="none" stroke="${accent}" stroke-width="2" opacity="0.2"/>
  <path d="M${w*0.35} ${h*0.25} L${w*0.65} ${h*0.55}" stroke="${accent}" stroke-width="2" opacity="0.15"/>
  <path d="M${w*0.65} ${h*0.25} L${w*0.35} ${h*0.55}" stroke="${accent}" stroke-width="2" opacity="0.15"/>
  <!-- 光泽层 -->
  <rect width="${w}" height="${h}" fill="url(#shine)" rx="16"/>
  <!-- 产品名称 -->
  <text x="${w/2}" y="${h*0.78}" text-anchor="middle" 
        font-family="system-ui, -apple-system, sans-serif" 
        font-size="${Math.min(w,h)*0.05}" font-weight="600" 
        fill="${accent}">${escapeXml(title)}</text>
  <!-- 材质信息 -->
  <text x="${w/2}" y="${h*0.85}" text-anchor="middle" 
        font-family="system-ui, -apple-system, sans-serif" 
        font-size="${Math.min(w,h)*0.025}" 
        fill="#999">${escapeXml(material)}</text>
  <!-- 底部水印 -->
  <text x="${w/2}" y="${h*0.94}" text-anchor="middle" 
        font-family="system-ui, -apple-system, sans-serif" 
        font-size="${Math.min(w,h)*0.018}" fill="#bbb">
    BOZE CNC Ti · Precision Titanium Component
  </text>
  <!-- 齿轮/CNC 装饰图标 -->
  <g transform="translate(${w*0.85},${h*0.15}) scale(${Math.min(w,h)*0.0003})" opacity="0.12">
    <circle cx="0" cy="0" r="50" fill="none" stroke="${accent}" stroke-width="8"/>
    ${Array.from({length: 12}, (_, i) => {
      const angle = (i * 30 * Math.PI) / 180;
      const x1 = 42 * Math.cos(angle);
      const y1 = 42 * Math.sin(angle);
      const x2 = 58 * Math.cos(angle);
      const y2 = 58 * Math.sin(angle);
      return `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${accent}" stroke-width="6" stroke-linecap="round"/>`;
    }).join('\n    ')}
  </g>
</svg>`;
}

// 给 SVG 生成用的 XML 转义方法
function escapeXml(str) {
  return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

/**
 * 根据 provider 选择生成方式
 */
async function generateImage(product, opts) {
  const prompt = buildPrompt(product);

  switch (opts.provider) {
    case 'openai':
      console.log(`   🎨 调用 OpenAI DALL-E 3 ...`);
      return await generateWithOpenAI(prompt, opts.size);

    case 'stability':
      console.log(`   🎨 调用 Stability AI ...`);
      return await generateWithStability(prompt, opts.size);

    case 'placeholder':
    default: {
      // SVG 占位图
      const svgContent = generatePlaceholderSVG(product, opts.size);
      return Buffer.from(svgContent, 'utf-8');
    }
  }
}

/**
 * 获取图片文件扩展名
 */
function getImageExtension(provider) {
  if (provider === 'placeholder') return '.svg';
  return '.jpg';
}

// ─── 图片注入（挂载到页面）───────────────────────────────────────────────────

/**
 * 将图片引用注入到 product-entities JSON 文件中
 * 在每个产品的 JSON 中添加 gallery 条目和一份 image 字段
 */
async function injectIntoProductEntities(products, opts) {
  console.log('\n📝 将图片引用注入到 product-entities JSON 文件...');
  let updated = 0;

  for (const product of products) {
    if (!product.filePath || !fs.existsSync(product.filePath)) continue;

    const ext = getImageExtension(opts.provider);
    const imagePath = `/images/products/${product.sku}${ext}`;
    const altText = `${ALT_PREFIX} ${product.title}`;

    const content = JSON.parse(await fsp.readFile(product.filePath, 'utf-8'));

    // 添加/更新 image 字段
    content.image = imagePath;

    // 如果存在 gallery 字段，追加或创建
    if (!content.gallery) {
      content.gallery = [];
    }
    // 检查是否已有相同路径的图片，避免重复
    const exists = content.gallery.some(g => g?.image === imagePath);
    if (!exists) {
      content.gallery.push({
        image: imagePath,
        alt: altText,
      });
    }

    if (opts.dryRun) {
      console.log(`   🔍 [DRY RUN] 将更新: ${path.basename(product.filePath)} → image: "${imagePath}"`);
    } else {
      await fsp.writeFile(product.filePath, JSON.stringify(content, null, 2) + '\n', 'utf-8');
      console.log(`   ✓ 已更新: ${path.basename(product.filePath)}`);
    }
    updated++;
  }

  console.log(`   ✅ 共更新 ${updated} 个 JSON 文件`);
}

/**
 * 扫描 MDX 文件并在其中插入图片标签
 * 适用于存在 /src/pages/products/*.mdx 的场景
 */
async function injectIntoMDXFiles(products, opts) {
  console.log('\n📝 扫描 MDX 文件并注入图片标签...');

  if (!fs.existsSync(MDX_DIR)) {
    console.log('   ⚠️  目录不存在，跳过 MDX 处理:', MDX_DIR);
    return;
  }

  const mdxFiles = (await fsp.readdir(MDX_DIR))
    .filter(f => f.endsWith('.mdx') || f.endsWith('.md'));

  if (mdxFiles.length === 0) {
    console.log('   ⚠️  未找到 MDX/MD 文件');
    return;
  }

  let updated = 0;

  for (const mdxFile of mdxFiles) {
    const filePath = path.join(MDX_DIR, mdxFile);
    const fileSlug = mdxFile.replace(/\.(mdx|md)$/, '');

    // 根据文件名查找匹配的产品
    const match = products.find(p => p.sku === fileSlug || p.sku.includes(fileSlug) || fileSlug.includes(p.sku));
    if (!match) continue;

    const ext = getImageExtension(opts.provider);
    const imagePath = `/images/products/${match.sku}${ext}`;
    const altText = `${ALT_PREFIX} ${match.title}`;
    const imgTag = `\n\n<img src="${imagePath}" alt="${altText}" loading="lazy" width="800" height="800" />\n`;

    let content = await fsp.readFile(filePath, 'utf-8');

    // 检查是否已包含该图片
    if (content.includes(imagePath)) {
      console.log(`   ⏭️  已存在，跳过: ${mdxFile}`);
      continue;
    }

    // 找到 frontmatter 结束位置，在正文开头插入
    const fmEnd = content.indexOf('\n---\n', 3);
    const insertPos = fmEnd !== -1 ? fmEnd + 5 : 0;

    if (opts.dryRun) {
      console.log(`   🔍 [DRY RUN] 将在 ${mdxFile} 中插入: ${imgTag.trim()}`);
    } else {
      const before = content.slice(0, insertPos);
      const after = content.slice(insertPos);
      content = before + imgTag + after;
      await fsp.writeFile(filePath, content, 'utf-8');
      console.log(`   ✓ 已更新: ${mdxFile}`);
      updated++;
    }
  }

  console.log(`   ✅ 共更新 ${updated} 个 MDX 文件`);
}

/**
 * 在 [...slug].astro 中自动添加图片展示逻辑（如果尚不存在）
 * 使得所有 product-entities 动态页面都能展示生成的图片
 */
async function patchSlugAstro(products, opts) {
  const slugAstroPath = path.join(MDX_DIR, '[...slug].astro');

  if (!fs.existsSync(slugAstroPath)) {
    console.log('\n⏭️  未找到 [...slug].astro，跳过动态页面修补');
    return;
  }

  console.log('\n🔧 检查 [...slug].astro 中的图片展示逻辑...');
  let content = await fsp.readFile(slugAstroPath, 'utf-8');

  // 检查是否已经包含 products 图片引用
  if (content.includes('/images/products/')) {
    console.log('   ⏭️  图片展示逻辑已存在，跳过');
    return;
  }

  // 查找主图片显示区域
  const placeholderPattern = `firstImage`;
  if (!content.includes(placeholderPattern)) {
    console.log('   ⏭️  未找到图片占位符，跳过自动修补');
    return;
  }

  // 在 <img> 或背景图引用附近添加产品图片逻辑
  // 由于修改 Astro 组件较复杂，我们仅输出提示
  console.log('   ℹ️  [!slug].astro 需要手动添加图片展示逻辑。');
  console.log('   ℹ️  建议: 在组件中找到产品主图区域，添加条件判断显示');
  console.log('   ℹ️   /images/products/ 下的图片。');
}

// ─── 主流程 ─────────────────────────────────────────────────────────────────

async function main() {
  console.log('═══════════════════════════════════════════════════════════');
  console.log('  🏭 BOZE CNC Ti - 产品图片批量生成工具');
  console.log('═══════════════════════════════════════════════════════════\n');

  const opts = parseArgs();

  // ── Step 0: 创建输出目录 ──
  if (!fs.existsSync(IMAGES_DIR)) {
    fs.mkdirSync(IMAGES_DIR, { recursive: true });
    console.log(`📁 创建目录: ${IMAGES_DIR}`);
  }

  // ── Step 1: 读取产品数据 ──
  let products;
  if (opts.input) {
    products = await readFromFile(opts.input);
  } else {
    products = await readFromProductEntities();
  }

  if (products.length === 0) {
    console.error('❌ 未读取到任何产品数据，请检查输入源');
    process.exit(1);
  }
  console.log(`\n📊 共 ${products.length} 个产品待处理\n`);

  // ── Step 2: 生成图片 ──
  if (!opts.skipGeneration) {
    if (opts.provider === 'openai' && !process.env.OPENAI_API_KEY) {
      console.warn('⚠️  OPENAI_API_KEY 未设置，将使用 SVG placeholder 代替');
    }
    if (opts.provider === 'stability' && !process.env.STABILITY_API_KEY) {
      console.warn('⚠️  STABILITY_API_KEY 未设置，将使用 SVG placeholder 代替');
    }

    const ext = getImageExtension(opts.provider);
    let successCount = 0;
    let skipCount = 0;
    let errorCount = 0;

    // 使用批次控制并发数，避免 API 限流
    for (let i = 0; i < products.length; i += opts.batchSize) {
      const batch = products.slice(i, i + opts.batchSize);
      const batchPromises = batch.map(async (product) => {
        const filename = `${product.sku}${ext}`;
        const outputPath = path.join(IMAGES_DIR, filename);

        // 如果图片已存在，跳过
        if (fs.existsSync(outputPath)) {
          console.log(`   ⏭️  已存在: ${filename}`);
          skipCount++;
          return;
        }

        console.log(`\n   🖼️  [${i + 1}/${products.length}] ${product.title}`);
        console.log(`       SKU: ${product.sku}`);

        if (opts.dryRun) {
          console.log(`       🔍 [DRY RUN] 将生成: ${outputPath}`);
          return;
        }

        try {
          const imageBuffer = await generateImage(product, opts);
          await fsp.writeFile(outputPath, imageBuffer);
          console.log(`       ✅ 已保存: ${filename}`);
          successCount++;
        } catch (err) {
          console.error(`       ❌ 失败: ${err.message}`);
          errorCount++;
        }
      });

      await Promise.all(batchPromises);

      // 批次间增加延迟（仅在非 placeholder 模式下）
      if (opts.provider !== 'placeholder' && i + opts.batchSize < products.length) {
        const delay = 2000; // 2 秒
        console.log(`\n   ⏳ 等待 ${delay / 1000} 秒后继续下一批...\n`);
        await new Promise(r => setTimeout(r, delay));
      }
    }

    console.log(`\n📊 图片生成统计:`);
    console.log(`   ✅ 成功: ${successCount}`);
    console.log(`   ⏭️  跳过: ${skipCount}`);
    console.log(`   ❌ 失败: ${errorCount}`);
    console.log(`   📁 输出目录: ${IMAGES_DIR}`);
  } else {
    console.log('⏭️  跳过图片生成（--skip-generation）');
  }

  // ── Step 3: 注入图片引用到页面 ──
  if (!opts.dryRun) {
    // 优先注入到 product-entities JSON 文件
    await injectIntoProductEntities(products, opts);

    // 尝试注入到 MDX/MD 文件
    await injectIntoMDXFiles(products, opts);

    // 修补 [...slug].astro
    await patchSlugAstro(products, opts);
  } else {
    console.log('\n🔍 [DRY RUN] 模式 - 跳过实际写入操作');
  }

  // ── 完成 ──
  console.log('\n═══════════════════════════════════════════════════════════');
  console.log('  ✅ 任务完成！');
  console.log('═══════════════════════════════════════════════════════════\n');

  if (opts.dryRun) {
    console.log('💡 执行以下命令来实际生成:');
    console.log(`   node scripts/generate-product-images.mjs --provider openai`);
    console.log('');
  }

  console.log('📄 生成的图片路径: /public/images/products/');
  console.log('🌐 访问 URL: /images/products/[sku].jpg');
  console.log('📝 Alt 属性格式: "Grade 5 Titanium CNC [产品名称]"');
  console.log('');
}

// ─── 启动 ──────────────────────────────────────────────────────────────────

main().catch(err => {
  console.error('\n❌ 脚本执行失败:', err);
  process.exit(1);
});
