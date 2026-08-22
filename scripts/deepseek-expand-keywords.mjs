/**
 * deepseek-expand-keywords.mjs — AI 批量扩词入库（v2 — MiniMax M3）
 * ================================================================
 * 输入一个/多个根词，调用 AI provider 为指定语言生成相关长尾关键词
 * （自动推理 intent / entity / anchorText），经 repository.upsertMany 写入主库。
 *
 * 当前 provider：MiniMax M3（OpenAI 兼容）端点由 src/lib/ai-provider.mjs 解析。
 *   - 历史兼容：DB 条目 `source` 字段保持 'deepseek'（数据 schema 字段，非 API 来源）；
 *     切换 provider 不影响已入库条目的可追溯性。详见迁移记录 memory-bank。
 *
 * 约定（用户决策）：
 *   - volume / difficulty 一律置 null（不虚构），source='deepseek'，status='planned'
 *   - 主库支持 12 语言，可指定 --lang 一次补齐（默认 en）
 *
 * 用法：
 *   node scripts/deepseek-expand-keywords.mjs --seed "titanium machining" --lang en --entity process
 *   node scripts/deepseek-expand-keywords.mjs --seeds-file data/keywords/seeds.txt --lang "en,de,ja"
 *   node scripts/deepseek-expand-keywords.mjs --dry-run --seed "grade 5 titanium"
 * ================================================================
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { upsertMany, countByLang } from '../src/lib/keywords/repository.mjs';
import { getChatCompletionsConfig, AI_PROVIDER } from '../src/lib/ai-provider.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');

const LANGS = {
  en: 'English', de: 'German', ja: 'Japanese', fr: 'French', es: 'Spanish',
  pt: 'Portuguese', it: 'Italian', ko: 'Korean', nl: 'Dutch', pl: 'Polish',
  ru: 'Russian', ar: 'Arabic',
};
const INTENTS = ['informational', 'commercial', 'transactional', 'navigational'];
const ENTITIES = ['material', 'process', 'product', 'industry', 'standard', 'service'];

function parseArgs(argv) {
  const args = { seeds: [] };
  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];
    if (arg === '--seed') { args.seeds.push(argv[++i]); }
    else if (arg === '--seeds-file') { args.seedsFile = argv[++i]; }
    else if (arg === '--lang') { args.lang = argv[++i]; }
    else if (arg === '--entity') { args.entity = argv[++i]; }
    else if (arg === '--count') { args.count = parseInt(argv[++i], 10) || 10; }
    else if (arg === '--dry-run') { args.dryRun = true; }
    else if (arg === '--batch') { args.batch = parseInt(argv[++i], 10) || 5; }
    else if (arg.startsWith('--')) { /* ignore unknown */ }
  }
  return args;
}

async function callChat(prompt, system) {
  // Resolve provider lazily so a missing key fails fast with a clear message.
  const { url, model, apiKey } = getChatCompletionsConfig();
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${apiKey}` },
    body: JSON.stringify({
      model,
      messages: [
        { role: 'system', content: system },
        { role: 'user', content: prompt },
      ],
      temperature: 0.4,
      max_tokens: 4096,
    }),
  });
  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`${AI_PROVIDER.name} HTTP ${res.status}: ${errText}`);
  }
  const data = await res.json();
  const content = data.choices?.[0]?.message?.content?.trim() || '';
  // MiniMax M3 (and DeepSeek R1-style models) wrap reasoning in <think>...</think>.
  // Strip both the thinking block and any markdown code fences before JSON.parse.
  const cleaned = content
    .replace(/<think>[\s\S]*?<\/think>/gi, '')
    .replace(/```json\s*/gi, '')
    .replace(/```\s*$/g, '')
    .trim();
  return JSON.parse(cleaned);
}

function buildPrompt({ seeds, lang, langName, entity, count }) {
  const seedList = seeds.map((s) => `- ${s}`).join('\n');
  return `你是一位面向全球 B2B 钛合金精密 CNC 加工采购商的技术 SEO 关键词研究员。

请基于以下种子词，为 ${langName}(${lang}) 市场扩展出 ${count} 个高质量长尾关键词，覆盖搜索意图与实体分类。

种子词：
${seedList}

要求：
1. 关键词必须专业、贴合钛加工行业（CNC 加工、增材制造、锻造、挤压、表面处理、材质牌号、行业应用等）。
2. 输出为 JSON 数组，每个元素字段：
   - "keyword": 关键词（目标语言）
   - "intent": 其一 ${INTENTS.join('/')}
   - "entity": 其一 ${ENTITIES.join('/')}
   - "anchorText": 该关键词对应的推荐内链锚文本（目标语言）
   - "note": 简短备注（面向哪个搜索意图/场景）
${entity ? `3. 所有条目 entity 必须为 "${entity}"。` : ''}
4. 只返回合法 JSON 数组，不要 markdown、不要解释。`;
}

async function main() {
  const args = parseArgs(process.argv.slice(2));

  const seeds = [...args.seeds];
  if (args.seedsFile) {
    const filePath = path.resolve(__dirname, '..', args.seedsFile);
    if (!fs.existsSync(filePath)) { console.error(`❌ 种子文件不存在: ${filePath}`); process.exit(1); }
    const lines = fs.readFileSync(filePath, 'utf-8').split(/\r?\n/).map((l) => l.trim()).filter(Boolean);
    seeds.push(...lines);
  }
  if (seeds.length === 0) {
    console.error('❌ 请提供 --seed 或 --seeds-file');
    process.exit(1);
  }

  const langs = (args.lang || 'en').split(',').map((l) => l.trim());
  const count = args.count || 10;
  const batch = args.batch || 5;

  console.log(`=== ${AI_PROVIDER.name} 关键词扩词 ===`);
  console.log(`种子词(${seeds.length}): ${seeds.join(', ')}`);
  console.log(`目标语言: ${langs.join(', ')}  每语言扩展: ${count} 条  ${args.dryRun ? '[DRY-RUN]' : ''}\n`);

  let totalPlanned = 0;

  for (const lang of langs) {
    if (!LANGS[lang]) { console.error(`⚠️ 未知语言: ${lang}`); continue; }
    console.log(`🌐 [${lang}] ${LANGS[lang]}...`);

    for (let start = 0; start < seeds.length; start += batch) {
      const seedChunk = seeds.slice(start, start + batch);
      const prompt = buildPrompt({ seeds: seedChunk, lang, langName: LANGS[lang], entity: args.entity, count });
      try {
        const items = await callChat(
          prompt,
          '你是专业的技术 SEO 关键词研究员，只输出合法 JSON。'
        );
        if (!Array.isArray(items)) { console.error('  ⚠️ 返回非数组，跳过'); continue; }

        const entries = items
          .filter((it) => it && it.keyword)
          .map((it) => ({
            keyword: it.keyword,
            lang,
            intent: INTENTS.includes(it.intent) ? it.intent : 'commercial',
            entity: ENTITIES.includes(it.entity) ? it.entity : (args.entity || 'uncategorized'),
            anchorText: it.anchorText || it.keyword,
            note: it.note || 'deepseek-expanded',
            source: 'deepseek',
            status: 'planned',
            volume: null,
            difficulty: null,
          }));

        if (args.dryRun) {
          console.log(`  [DRY] 批次 ${Math.floor(start / batch) + 1}: ${entries.length} 条候选`);
          entries.slice(0, 3).forEach((e) => console.log(`    - ${e.keyword} [${e.intent}/${e.entity}]`));
        } else {
          const written = upsertMany(entries);
          totalPlanned += written;
          console.log(`  ✓ 批次 ${Math.floor(start / batch) + 1}: 写入 ${written} 条`);
        }
      } catch (err) {
        console.error(`  ❌ 批次失败: ${err.message}`);
      }

      if (start + batch < seeds.length) await new Promise((r) => setTimeout(r, 1000));
    }
  }

  if (args.dryRun) {
    console.log('\n[DRY-RUN] 未写入主库。');
  } else {
    console.log('\n各语言分布:');
    for (const [l, c] of Object.entries(countByLang())) console.log(`  ${l}: ${c}`);
    console.log(`\n✅ 本次新增 planned 条目: ${totalPlanned}`);
  }
}

main().catch((err) => { console.error('❌ 失败:', err); process.exit(1); });
