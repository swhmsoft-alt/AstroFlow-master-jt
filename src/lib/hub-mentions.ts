/**
 * src/lib/hub-mentions.ts
 * =============================================================
 * F3 辅助 — hub 页面快速构造「实体提及」id 列表。
 *
 * 设计目的：让 6 个 products-hub + /parts/ 用 1 行 import + 1 行 prop
 * 即可把该 hub 下的实体全部声明为 WebPage.mentions，避免每个 hub 文件
 * 重复写相同的 filter/map 逻辑。
 *
 * 用法：
 *   import { hubMentionsForCategory } from '../../../lib/hub-mentions';
 *   ...
 *   <BaseLayout mentions={hubMentionsForCategory('industry')}>
 *
 * 自动跳过无 page_url 的实体，限制默认 100 条防止 JSON-LD 过大。
 * =============================================================
 */

import { getEntitiesByCategory } from './entity-graph';

export function hubMentionsForCategory(category: string, limit = 100): string[] {
  return getEntitiesByCategory(category)
    .filter((e) => e.page_url)
    .slice(0, limit)
    .map((e) => e.id);
}

/**
 * 多类别合并（首页用：industry + material + service + standard + application）。
 * 会去重 + 按类别顺序保持稳定。
 */
export function hubMentionsMultiCategory(categories: string[], perCatLimit = 30): string[] {
  const seen = new Set<string>();
  const out: string[] = [];
  for (const cat of categories) {
    for (const e of getEntitiesByCategory(cat).slice(0, perCatLimit)) {
      if (!e.page_url) continue;
      if (seen.has(e.id)) continue;
      seen.add(e.id);
      out.push(e.id);
    }
  }
  return out;
}