/**
 * src/utils/seo-linking.ts
 *
 * 内链蜘蛛网（Spiderweb）核心工具函数。
 * 负责多语言路径拼接、面包屑推导、锚文本生成、参数并集提取。
 *
 * 设计原则：
 * - 所有导出的函数都是纯函数，不依赖 Astro 运行时（可在构建脚本中复用）
 * - 多语言安全：自动检测 lang 前缀，禁止跨语种串链
 */

import { DEFAULT_LANG } from '../i18n/ui';
import type { Lang } from '../i18n/ui';

// ── 语言列表（用于检测）──
const SUPPORTED_LANGS = new Set<string>(['en', 'de', 'ja', 'fr', 'es', 'pt', 'it', 'ko', 'nl', 'pl', 'ru', 'ar']);

/**
 * 提取 URL pathname 中的语言代码
 * 与 src/i18n/utils.ts 中的 getLangFromUrl 保持一致，但可接收纯字符串
 */
export function extractLangFromPath(pathname: string): Lang {
  const parts = pathname.split('/').filter(Boolean);
  if (parts.length > 0 && SUPPORTED_LANGS.has(parts[0])) {
    return parts[0] as Lang;
  }
  return DEFAULT_LANG;
}

/**
 * 为给定语言和规范路径生成本地化路径
 *
 * 示例：
 *   localizePath('/services/titanium-gr5', 'de') → '/de/services/titanium-gr5'
 *   localizePath('/services/titanium-gr5', 'en') → '/services/titanium-gr5'
 */
export function localizePath(canonicalPath: string, lang: Lang): string {
  if (lang === DEFAULT_LANG) return canonicalPath;
  const normalized = canonicalPath.startsWith('/') ? canonicalPath : `/${canonicalPath}`;
  return `/${lang}${normalized}`;
}

/**
 * 从本地化路径中剥离语种前缀，得到规范路径
 *
 * 示例：
 *   removeLangFromPath('/de/services/titanium-gr5') → '/services/titanium-gr5'
 *   removeLangFromPath('/services/titanium-gr5')   → '/services/titanium-gr5'
 */
export function removeLangFromPath(pathname: string): string {
  const parts = pathname.split('/').filter(Boolean);
  if (parts.length > 0 && SUPPORTED_LANGS.has(parts[0])) {
    return '/' + parts.slice(1).join('/');
  }
  return pathname;
}

/**
 * 构建面包屑导航项列表
 *
 * @param lang - 当前页面语言
 * @param items - 形如 [{ label: "Home", slug: "" }, { label: "Aerospace", slug: "aerospace", collection: "applications" }, ...]
 *                 第一个元素默认为首页，slug 为空表示链接到首页
 * @returns 增强后的面包屑数组，包含自动 localize 后的 href
 */
export interface BreadcrumbItem {
  label: string;
  slug?: string;
  collection?: 'applications' | 'services' | 'comparison' | '';
  /** 是否当前页（最后一项） */
  isCurrent?: boolean;
}

export function buildBreadcrumbItems(
  lang: Lang,
  items: BreadcrumbItem[]
): (BreadcrumbItem & { href: string })[] {
  const result: (BreadcrumbItem & { href: string })[] = [];

  for (let i = 0; i < items.length; i++) {
    const item = items[i];
    const isLast = i === items.length - 1;

    // 构造 href
    let href: string;
    if (!item.slug && !item.collection) {
      // 首页
      href = lang === DEFAULT_LANG ? '/' : `/${lang}/`;
    } else if (item.collection) {
      const basePath = `/${item.collection}/${item.slug}`;
      href = localizePath(basePath, lang);
    } else if (item.slug) {
      href = localizePath(`/${item.slug}`, lang);
    } else {
      href = '#';
    }

    result.push({
      ...item,
      href,
      isCurrent: isLast,
    });
  }

  return result;
}

/**
 * 生成 JSON-LD BreadcrumbList Schema
 *
 * @param items - buildBreadcrumbItems 的输出（含 href）
 * @param siteUrl - 站点根 URL（如 https://cnc.bozemetal.com）
 * @returns 可直接注入 <script type="application/ld+json"> 的 JSON 字符串
 */
export function buildBreadcrumbLdJson(
  items: { label: string; href: string }[],
  siteUrl: string
): string {
  const itemListElement = items.map((item, index) => ({
    '@type': 'ListItem',
    position: index + 1,
    name: item.label,
    item: item.href.startsWith('http') ? item.href : `${siteUrl}${item.href}`,
  }));

  return JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement,
  });
}

/**
 * 生成对比表格表头的 SEO 锚文本
 *
 * 规则： [Specs 页面 Title] + " CNC Machining Specifications"
 *
 * @param specTitle - services 条目的 title
 * @returns 符合 SEO 规范的锚文本
 */
export function buildComparisonAnchorText(specTitle: string): string {
  const title = specTitle.replace(/\.$/, '').trim();
  return `${title} CNC Machining Specifications`;
}

/**
 * 从多个 Specs 条目中提取参数并集（Union）
 *
 * 用于对比表格：遍历所有参与对比的服务的 specs 数组，
 * 收集所有不同的 param 名称，确保每行参数都被完整展示。
 *
 * @param specsArrays - 每个服务的 specs 数组 [{param, value}, ...]
 * @returns 按 param 自然排序的唯一参数名列表
 */
export function extractSpecsUnion(
  specsArrays: { param: string; value: string }[][]
): string[] {
  const paramSet = new Set<string>();
  for (const specs of specsArrays) {
    for (const spec of specs) {
      paramSet.add(spec.param);
    }
  }
  return Array.from(paramSet).sort((a, b) => a.localeCompare(b));
}

/**
 * 根据参数名和服务的 specs 数组，查找对应的 value
 *
 * @param param - 参数名
 * @param specs - 服务的 specs 数组
 * @returns 参数值，不存在则返回 "—"
 */
export function findSpecValue(
  param: string,
  specs: { param: string; value: string }[]
): string {
  const found = specs.find((s) => s.param === param);
  return found?.value ?? '—';
}

/**
 * 构造本地化联系页路径
 *
 * @param lang - 当前语言
 * @returns 本地化 /contact/ 路径
 */
export function getContactPath(lang: Lang): string {
  return localizePath('/contact/', lang);
}
