/**
 * migrate-keywords.mjs
 * ================================================================
 * 【Step 0】从现有 entity-keywords.mjs 无损导入关键词为初始种子。
 *
 * 作用：
 *   解析 entity-keywords.mjs 中 en/de/ja/fr/es/pt/it/ko/nl/pl 各语言数组，
 *   转换为 KeywordEntry[] 写入 data/keywords/main-db.json。
 *   每条：source='manual', status='mapped'（因为这些锚文本已在构建时使用）。
 *
 * 目的：保证现有内链映射数据 100% 迁移，不丢失任何手工锚文本。
 *
 * 用法：
 *   node scripts/migrate-keywords.mjs
 * ================================================================
 */

import { pathToFileURL } from 'node:url';
import path from 'node:path';
import { upsertMany, persist, getAll, countByLang } from '../src/lib/keywords/repository.mjs';

const ROOT = process.cwd();
const SRC_FILE = path.join(ROOT, 'entity-keywords.mjs');

async function main() {
  console.log('=== [Step 0] 导入 entity-keywords.mjs → 关键词主库 ===\n');

  // 动态 import 现有映射表
  const mod = await import(pathToFileURL(SRC_FILE).href);
  const ALL_LANGS = mod.ALL_LANGS;
  if (!ALL_LANGS) {
    console.error('❌ entity-keywords.mjs 未导出 ALL_LANGS');
    process.exit(1);
  }

  const entries = [];
  for (const [lang, pairs] of Object.entries(ALL_LANGS)) {
    if (!Array.isArray(pairs)) continue;
    for (const [keyword, targetUrl] of pairs) {
      if (!keyword || typeof keyword !== 'string') continue;
      entries.push({
        keyword,
        lang,
        targetUrl,
        anchorText: keyword,
        entity: 'uncategorized',
        intent: 'commercial',
        source: 'manual',
        status: 'mapped',
        volume: null,
        difficulty: null,
        note: 'migrated from entity-keywords.mjs',
      });
    }
  }

  console.log(`待导入条目: ${entries.length}`);
  const before = getAll().length;
  const written = upsertMany(entries);
  const after = getAll().length;

  console.log(`写入数量: ${written}`);
  console.log(`主库总量: ${before} → ${after}`);
  console.log('\n各语言分布:');
  for (const [lang, count] of Object.entries(countByLang())) {
    console.log(`  ${lang}: ${count}`);
  }

  console.log('\n✅ [Step 0] 迁移完成。主库: data/keywords/main-db.json');
}

main().catch((err) => {
  console.error('❌ 迁移失败:', err);
  process.exit(1);
});
