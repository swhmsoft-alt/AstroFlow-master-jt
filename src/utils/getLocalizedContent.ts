/**
 * getLocalizedContent()
 *
 * 核心多语言内容获取工具函数
 * ============================
 *
 * 架构决策（三句核心）:
 *   1. 路由唯一 → src/pages/[lang]/[...slug].astro 是唯一入口
 *   2. 英文唯一源 → src/content/pages/ 不复制
 *   3. 翻译退居数据层 → src/content/i18n/{lang}/ 纯缓存，fallback 英文
 *
 * 获取优先级:
 *   1. src/content/i18n/{lang}/pages/{pageId}.md  (未来翻译缓存层)
 *   2. src/content/pages/{pageId}.md              (英文唯一源头)
 *   3. 空默认值
 */

import { getCollection, type CollectionEntry } from 'astro:content';

/** 内容来源标记 */
export type ContentSource = 'translated' | 'english' | 'default';

/** 本地化内容结果 */
export interface LocalizedContentResult {
  /** Frontmatter 数据 */
  data: Record<string, any>;
  /** Markdown body 原始文本 */
  body?: string;
  /** 渲染后的 HTML（由 Astro Content 引擎编译） */
  html?: string;
  /** 来源标记 */
  source: ContentSource;
}

/**
 * 将 URL slug 解析为内容集合 ID
 *
 * @example
 *   resolveContentId(undefined)  → 'home'
 *   resolveContentId('services') → 'services'
 *   resolveContentId('blog/my-post') → 'blog/my-post'
 */
export function resolveContentId(slug: string | undefined): string {
  if (!slug || slug === '') return 'home';
  return slug;
}

/**
 * 获取本地化页面内容，按优先级 fallback
 *
 * @param pageId  - 内容集合 ID (e.g. 'home', 'services')
 * @param _lang   - 目标语言代码（预留，当前直接 fallback 英文）
 * @returns       本地化内容结果
 */
export async function getLocalizedContent(
  pageId: string,
  _lang: string
): Promise<LocalizedContentResult> {
  // ---------------------------------------------------------------
  // 第1优先: 翻译缓存层
  //   src/content/i18n/{lang}/pages/{pageId}.md
  //   当前 i18n 集合未在 content/config.ts 注册，此分支为预留
  //   当 CMS 写入翻译后，在此处添加 getCollection('i18n') 逻辑
  // ---------------------------------------------------------------

  // ---------------------------------------------------------------
  // 第2优先: 英文唯一源头
  //   src/content/pages/{pageId}.md
  // ---------------------------------------------------------------
  try {
    const pages = await getCollection('pages');
    const entry = pages.find(
      (p: CollectionEntry<'pages'>) => p.id === pageId
    );

    if (entry) {
      return {
        data: entry.data,
        body: entry.body,
        source: 'english',
      };
    }
  } catch {
    // pages 集合不存在时静默降级
  }

  // ---------------------------------------------------------------
  // 第3优先: 空默认值
  // ---------------------------------------------------------------
  return {
    data: {},
    source: 'default',
  };
}