/**
 * scripts/batch-fix-breadcrumbs.mjs
 *
 * 批量修复 [lang]/[...slug].astro 中缺失的面包屑导航。
 * 第二次执行：修正服务子页的面包屑，改用 tH1() 获取父级 Hub 标题。
 *
 * 用法: node scripts/batch-fix-breadcrumbs.mjs
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const FILE = path.join(ROOT, 'src', 'pages', '[lang]', '[...slug].astro');

// ══════════════════════════════════════════════════════════════
// 面包屑 HTML 模板生成器
// ══════════════════════════════════════════════════════════════

function makeBreadcrumb(items) {
  const liItems = items.map((item, i) => {
    const isLast = i === items.length - 1;
    const position = i + 1;
    const nameExpr = item.isNavKey
      ? `{t('${item.label}')}`
      : item.isTH1Key
        ? `{tH1('${item.label}') || '${item.fallback || ''}'}`
        : `{${item.label}}`;

    const separator = i > 0
      ? `\n              <svg class="w-4 h-4 inline mx-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" style="color: color-mix(in srgb, var(--theme-text) 35%, transparent);"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" /></svg>`
      : '';

    const hasLink = !isLast && item.href;

    if (hasLink) {
      return `            <li itemprop="itemListElement" itemscope itemtype="https://schema.org/ListItem">
${separator}
              <a href={${item.href}} itemprop="item" class="transition-colors" style="color: color-mix(in srgb, var(--theme-text) 45%, transparent);">
                <span itemprop="name">${nameExpr}</span>
              </a>
              <meta itemprop="position" content="${position}" />
            </li>`;
    } else {
      return `            <li itemprop="itemListElement" itemscope itemtype="https://schema.org/ListItem">
${separator}
              <span itemprop="name" class="font-semibold" style="color: var(--theme-text);">${nameExpr}</span>
              <meta itemprop="position" content="${position}" />
            </li>`;
    }
  });

  return `      <!-- Breadcrumb -->
      <nav class="border-b" aria-label="Breadcrumb" style="background: var(--theme-surface); border-color: color-mix(in srgb, var(--theme-primary) 12%, transparent);">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ol class="flex items-center space-x-2 py-4 text-sm" itemscope itemtype="https://schema.org/BreadcrumbList">
${liItems.join('\n')}
          </ol>
        </div>
      </nav>`;
}

function localizedHref(slug) {
  return `localizePath('/${slug}/', currentLang)`;
}

function heroKey(slug) {
  return `hero.${slug.replace(/\//g, '.')}.h1`;
}

// ── 各种面包屑变体 ──

/** Home > {navKey} */
function topBreadcrumb(navKey) {
  return makeBreadcrumb([
    { label: 'nav.home', isNavKey: true, href: "localizePath('/', currentLang)" },
    { label: navKey, isNavKey: true },
  ]);
}

/** Home > {parentNavKey} > {childNavKey} */
function twoLevelBreadcrumb(parentSlug, parentNavKey, childNavKey) {
  return makeBreadcrumb([
    { label: 'nav.home', isNavKey: true, href: "localizePath('/', currentLang)" },
    { label: parentNavKey, isNavKey: true, href: localizedHref(parentSlug) },
    { label: childNavKey, isNavKey: true },
  ]);
}

/** Home > {pageH1} (无 nav 键，使用 pageH1) */
function topBreadcrumbPageH1() {
  return makeBreadcrumb([
    { label: 'nav.home', isNavKey: true, href: "localizePath('/', currentLang)" },
    { label: 'pageH1' },
  ]);
}

/**
 * Home > {父级标题} > {pageH1}
 * 父级标题使用 tH1('hero.{parentSlug}.h1') 获取
 */
function twoLevelBreadcrumbWithHero(parentSlug, childExpr = 'pageH1') {
  return makeBreadcrumb([
    { label: 'nav.home', isNavKey: true, href: "localizePath('/', currentLang)" },
    {
      label: heroKey(parentSlug),
      isTH1Key: true,
      fallback: parentSlug,
      href: localizedHref(parentSlug),
    },
    { label: childExpr },
  ]);
}

/** Home > {pageH1} > {pageH1} (兜底，两个都引用 pageH1) */
function twoLevelBreadcrumbPageH1(parentSlug) {
  return makeBreadcrumb([
    { label: 'nav.home', isNavKey: true, href: "localizePath('/', currentLang)" },
    { label: 'pageH1', href: localizedHref(parentSlug) },
    { label: 'pageH1' },
  ]);
}

// ══════════════════════════════════════════════════════════════
// slug → 面包屑类型映射
// ══════════════════════════════════════════════════════════════

const NAV_MAP = {
  'materials':    { type: 'top', key: 'nav.materials' },
  'capabilities': { type: 'top', key: 'nav.capabilities' },
  'industries':   { type: 'top', key: 'nav.industries' },
  'equipment':    { type: 'top', key: 'nav.equipment' },

  'capabilities/manufacturing':  { type: 'two', parent: 'capabilities', parentKey: 'nav.capabilities', childKey: 'nav.capabilities.manufacturing' },
  'capabilities/engineering':    { type: 'two', parent: 'capabilities', parentKey: 'nav.capabilities', childKey: 'nav.capabilities.engineering' },
  'capabilities/capacity':       { type: 'two', parent: 'capabilities', parentKey: 'nav.capabilities', childKey: 'nav.capabilities.capacity' },
  'capabilities/quality':        { type: 'two', parent: 'capabilities', parentKey: 'nav.capabilities', childKey: 'nav.capabilities.quality' },
  'capabilities/inspection':     { type: 'two', parent: 'capabilities', parentKey: 'nav.capabilities', childKey: 'nav.capabilities.inspection' },
  'capabilities/traceability':   { type: 'two', parent: 'capabilities', parentKey: 'nav.capabilities', childKey: 'nav.capabilities.traceability' },
  'capabilities/certifications': { type: 'two', parent: 'capabilities', parentKey: 'nav.capabilities', childKey: 'nav.capabilities.certifications' },

  'industries/aerospace':            { type: 'two', parent: 'industries', parentKey: 'nav.industries', childKey: 'nav.industries.aerospace' },
  'industries/medical':              { type: 'two', parent: 'industries', parentKey: 'nav.industries', childKey: 'nav.industries.medical' },
  'industries/uav-drones':           { type: 'two', parent: 'industries', parentKey: 'nav.industries', childKey: 'nav.industries.uavDrones' },
  'industries/ai-infrastructure':    { type: 'two', parent: 'industries', parentKey: 'nav.industries', childKey: 'nav.industries.aiInfrastructure' },
  'industries/marine':               { type: 'two', parent: 'industries', parentKey: 'nav.industries', childKey: 'nav.industries.marine' },
  'industries/semiconductor':        { type: 'two', parent: 'industries', parentKey: 'nav.industries', childKey: 'nav.industries.semiconductor' },
  'industries/energy':               { type: 'two', parent: 'industries', parentKey: 'nav.industries', childKey: 'nav.industries.energy' },
  'industries/industrial-equipment': { type: 'two', parent: 'industries', parentKey: 'nav.industries', childKey: 'nav.industries.industrialEquipment' },
};

// ══════════════════════════════════════════════════════════════
// 主逻辑
// ══════════════════════════════════════════════════════════════

let content = fs.readFileSync(FILE, 'utf-8');
let countFixed = 0;
let countAlready = 0;
let countSkip = 0;

// 匹配每个完整页面块: { effectiveSlug === 'xxx' ... (...) }
const PAGE_BLOCK = /(\{[\s\S]*?effectiveSlug\s*===\s*'([^']+)'[\s\S]*?&&\s*\(\s*\n[\s\S]*?<\/BaseLayout>\s*\)\s*\n?\})/g;

content = content.replace(PAGE_BLOCK, (match, fullBlock, slug) => {
  // 已有面包屑
  if (match.includes('<!-- Breadcrumb -->')) {
    countAlready++;
    return match;
  }

  // 跳过法律页面
  if (slug === 'privacy-policy' || slug === 'terms-of-service' || slug === 'cookie-policy') {
    countSkip++;
    return match;
  }

  // 跳过已有的 about/services
  if (slug === 'about' || slug === 'services') {
    countSkip++;
    return match;
  }

  // 生成面包屑
  let breadcrumbHtml;
  const entry = NAV_MAP[slug];

  if (entry) {
    if (entry.type === 'two') {
      breadcrumbHtml = twoLevelBreadcrumb(entry.parent, entry.parentKey, entry.childKey);
    } else {
      breadcrumbHtml = topBreadcrumb(entry.key);
    }
  } else if (slug.includes('/')) {
    // 子页面：判断父级类型
    const parentSlug = slug.split('/')[0];
    if (parentSlug.startsWith('titanium-')) {
      // 服务子页：使用 tH1('hero.parentSlug.h1') 获取父级 Hub 标题
      breadcrumbHtml = twoLevelBreadcrumbWithHero(parentSlug);
    } else if (slug.startsWith('equipment/') || slug.startsWith('resources/')) {
      breadcrumbHtml = twoLevelBreadcrumbPageH1(parentSlug);
    } else {
      breadcrumbHtml = twoLevelBreadcrumbPageH1(parentSlug);
    }
  } else {
    // 其他顶级页面
    breadcrumbHtml = topBreadcrumbPageH1();
  }

  // 在 <BaseLayout ...> 闭合后注入
  const layoutMatch = match.match(/(<BaseLayout[\s\S]*?>)\s*\n/);
  if (!layoutMatch) {
    console.log(`  ⚠️  无法定位 <BaseLayout>: ${slug}`);
    countSkip++;
    return match;
  }

  const fullTagWithNewline = layoutMatch[0];
  const result = match.replace(fullTagWithNewline, fullTagWithNewline + breadcrumbHtml + '\n');
  countFixed++;
  console.log(`  ✅ ${slug}`);
  return result;
});

console.log(`\n📊 统计: 新增=${countFixed}, 已存在=${countAlready}, 跳过=${countSkip}`);

if (countFixed > 0) {
  fs.writeFileSync(FILE, content, 'utf-8');
  console.log('💾 文件已保存');
}

console.log('完成！');
