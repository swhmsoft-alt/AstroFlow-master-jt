/**
 * scripts/add-missing-breadcrumbs.mjs
 *
 * 为多语言 [lang] 页面添加面包屑导航（目前缺失的页面）：
 *   1. [lang]/blog/index.astro   — 博客列表页
 *   2. [lang]/products/index.astro — 产品列表页
 *
 * 从 en 站已有面包屑的对应页面提取样式和结构，
 * 适配为使用 t() 翻译函数和 localizePath() 的多语言版本。
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');

// ── 面包屑 HTML 模板 ────────────────────────────────────────
// 注意：<!-- Breadcrumb --> 注释确保与 en 站一致的标识

const BLOG_BREADCRUMB = `  <!-- Breadcrumb -->
  <nav class="border-b" aria-label="Breadcrumb" style="background: var(--theme-surface); border-color: color-mix(in srgb, var(--theme-primary) 12%, transparent);">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <ol class="flex items-center space-x-2 py-4 text-sm" itemscope itemtype="https://schema.org/BreadcrumbList">
        <li itemprop="itemListElement" itemscope itemtype="https://schema.org/ListItem">
          <a href={localizePath('/', lang)} itemprop="item" class="transition-colors" style="color: color-mix(in srgb, var(--theme-text) 45%, transparent);">
            <span itemprop="name">{t('nav.home')}</span>
          </a>
          <meta itemprop="position" content="1" />
          <svg class="w-4 h-4 inline mx-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" style="color: color-mix(in srgb, var(--theme-text) 35%, transparent);"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" /></svg>
        </li>
        <li itemprop="itemListElement" itemscope itemtype="https://schema.org/ListItem">
          <span itemprop="name" class="font-semibold" style="color: var(--theme-text);">{t('nav.blog')}</span>
          <meta itemprop="position" content="2" />
        </li>
      </ol>
    </div>
  </nav>`;

const PRODUCTS_BREADCRUMB = `  <!-- Breadcrumb -->
  <nav class="border-b" aria-label="Breadcrumb" style="background: var(--theme-surface); border-color: color-mix(in srgb, var(--theme-primary) 12%, transparent);">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <ol class="flex items-center space-x-2 py-4 text-sm" itemscope itemtype="https://schema.org/BreadcrumbList">
        <li itemprop="itemListElement" itemscope itemtype="https://schema.org/ListItem">
          <a href={localizePath('/', lang)} itemprop="item" class="transition-colors" style="color: color-mix(in srgb, var(--theme-text) 45%, transparent);">
            <span itemprop="name">{t('nav.home')}</span>
          </a>
          <meta itemprop="position" content="1" />
          <svg class="w-4 h-4 inline mx-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" style="color: color-mix(in srgb, var(--theme-text) 35%, transparent);"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" /></svg>
        </li>
        <li itemprop="itemListElement" itemscope itemtype="https://schema.org/ListItem">
          <span itemprop="name" class="font-semibold" style="color: var(--theme-text);">{t('nav.products')}</span>
          <meta itemprop="position" content="2" />
        </li>
      </ol>
    </div>
  </nav>`;

// ── 文件路径 ─────────────────────────────────────────────────

const BLOG_INDEX = path.join(ROOT, 'src', 'pages', '[lang]', 'blog', 'index.astro');
const PRODUCTS_INDEX = path.join(ROOT, 'src', 'pages', '[lang]', 'products', 'index.astro');

// ── 辅助函数 ─────────────────────────────────────────────────

/**
 * 在指定文件的内容中查找插入标记，并在其后插入面包屑 HTML。
 * 插入标记为 `<BaseLayout` 行之后的内容（紧接在 `>` 之后的新行）。
 *
 * 策略：找到 `<BaseLayout` 行及其闭合 `>`，在该行之后插入。
 */
function injectBreadcrumb(filePath, breadcrumbHtml) {
  let content = fs.readFileSync(filePath, 'utf-8');

  // 已经存在 Breadcrumb 则跳过
  if (content.includes('<!-- Breadcrumb -->')) {
    console.log(`  ⏭️  已存在 Breadcrumb，跳过: ${filePath}`);
    return false;
  }

  // 在 <BaseLayout ...> 行之后插入面包屑
  // 匹配 <BaseLayout ...> (可能跨行)
  const regex = /(<BaseLayout[^>]*>)\s*\n/;
  const match = content.match(regex);

  if (!match) {
    console.error(`  ❌ 未找到 <BaseLayout> 标签: ${filePath}`);
    return false;
  }

  const insertPos = match.index + match[0].length;
  const before = content.slice(0, insertPos);
  const after = content.slice(insertPos);

  const newContent = before + '\n' + breadcrumbHtml + '\n' + after;
  fs.writeFileSync(filePath, newContent, 'utf-8');
  console.log(`  ✅ 已注入 Breadcrumb: ${filePath}`);
  return true;
}

// ── 主流程 ───────────────────────────────────────────────────

console.log('══════════════════════════════════════════════════');
console.log('  为多语言 [lang] 页面添加面包屑导航');
console.log('══════════════════════════════════════════════════\n');

console.log('1️⃣  [lang]/blog/index.astro (博客列表)');
injectBreadcrumb(BLOG_INDEX, BLOG_BREADCRUMB);

console.log('\n2️⃣  [lang]/products/index.astro (产品列表)');
injectBreadcrumb(PRODUCTS_INDEX, PRODUCTS_BREADCRUMB);

console.log('\n══════════════════════════════════════════════════');
console.log('  完成！');
console.log('══════════════════════════════════════════════════');
