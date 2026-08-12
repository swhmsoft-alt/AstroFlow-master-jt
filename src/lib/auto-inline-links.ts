/**
 * src/lib/auto-inline-links.ts
 *
 * 自动内链工具（.astro 页面版）— 与 markdown 自动内链机制同源同规则。
 *
 * 背景：项目已有「关键词主库 → keywordMap → rehype 自动内链」链路，但它只作用于
 * markdown 内容（astro.config.mjs 的 markdown.rehypePlugins）。.astro 组件页
 * （如 /parts/ 及其分类页）不经过 rehype，无法自动加内链。
 *
 * 本模块让 .astro 组件也能复用同一份「唯一权威源」data/keywords/main-db.json，
 * 把 status === 'mapped' 且 lang === 'en' 的关键词，在纯文本段落中自动包裹成
 * 指向站内页面的 <a> 链接。
 *
 * 与 markdown 插件一致的规则：
 *   - 仅使用 status === 'mapped' 且有 targetUrl 的词；
 *   - 大小写敏感 + 单词边界匹配（防 "CMM"/"RFQ"/"SLM" 误配小写词）；
 *   - 每页/每字段链接数受 max 限制；
 *   - 不处理 h1/h2 等标题字段（与 rehype BLOCKED_TAGS 含 h1-h6 一致）。
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
// src/lib/auto-inline-links.ts → src/lib → src → <root>
const ROOT = path.resolve(__dirname, '../..');
const MAIN_DB = path.join(ROOT, 'data', 'keywords', 'main-db.json');

interface EnKeyword {
  lang?: string;
  keyword: string;
  anchorText?: string;
  targetUrl?: string;
}

interface LinkEntry {
  anchor: string;
  href: string;
}

function escapeRegExp(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/** 加载 EN mapped 关键词映射（长词优先，避免 "Grade 2" 误配 "Grade 23"）。 */
export function loadEnKeywordMap(): LinkEntry[] {
  if (!fs.existsSync(MAIN_DB)) return [];
  let raw: unknown;
  try {
    raw = JSON.parse(fs.readFileSync(MAIN_DB, 'utf-8'));
  } catch {
    return [];
  }
  const items = Array.isArray(raw) ? (raw as EnKeyword[]) : ((raw as { entries?: EnKeyword[] }).entries ?? []);
  const seen = new Set<string>();
  const out: LinkEntry[] = [];
  for (const it of items) {
    if (it.lang !== 'en') continue;
    const anchor = (it.anchorText || it.keyword || '').trim();
    const href = (it.targetUrl || '').trim();
    if (!anchor || !href || seen.has(anchor)) continue;
    seen.add(anchor);
    out.push({ anchor, href });
  }
  out.sort((a, b) => b.anchor.length - a.anchor.length);
  return out;
}

/**
 * 在纯文本段落中把 EN mapped 关键词包裹成站内 <a> 链接。
 *
 * @param text 纯文本（不含 HTML）；若已含 <a> 标签会先被保护，避免二次包裹。
 * @param max  该字段最多生成的内链数量（默认 3，与 markdown maxLinksPerPage 对齐）。
 * @returns 含 <a> 标签的 HTML 字符串，组件用 set:html 渲染。
 */
export function linkify(text: string, max = 3): string {
  if (!text) return text;
  const map = loadEnKeywordMap();
  if (map.length === 0) return text;

  // 保护已存在的 <a>…</a>，防止其锚文本被二次包裹。
  const anchors: string[] = [];
  let t = text.replace(/<a\b[^>]*>[\s\S]*?<\/a>/gi, (m) => {
    anchors.push(m);
    return `\u0000${anchors.length - 1}\u0000`;
  });

  let count = 0;
  for (const { anchor, href } of map) {
    if (count >= max) break;
    if (anchor.length < 3) continue;
    const re = new RegExp(`(?<![A-Za-z0-9])${escapeRegExp(anchor)}(?![A-Za-z0-9])`, 'g');
    t = t.replace(re, (match) => {
      if (count >= max) return match;
      count++;
      return `<a href="${href}">${match}</a>`;
    });
  }

  // 还原占位符
  return t.replace(/\u0000(\d+)\u0000/g, (_, i) => anchors[Number(i)] ?? '');
}
