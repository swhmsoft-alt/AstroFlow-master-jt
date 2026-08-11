# 关键词库（Keyword Database）操作说明

> 面向：站点负责人 + Cline 配合使用
> 架构方案：**方案 4**（静态 JSON 主库 + Repository 数据访问层，为未来迁移 DB/API 留接缝）
> 唯一权威源：`data/keywords/main-db.json`

---

## 一、功能总览

关键词库用于支撑网站的内链构建、内容策划与多语言 SEO，**存储 + 查询**两条主线：

| 能力 | 入口 | 说明 |
|---|---|---|
| 查询/筛选 | `npm run kw:query` | 按语言/意图/实体/状态/来源筛选，可导出 CSV/JSON |
| 统计 | `npm run kw:count` | 各语言条目分布 |
| DeepSeek 扩词 | `npm run kw:expand` | 基于种子词自动扩展长尾词入库 |
| 内链派生 | `npm run kw:sync` | 主库 → `entity-keywords.mjs` → `astro.config.mjs` |
| 历史迁移 | `npm run kw:migrate` | 一次性从旧文件导入（仅首次用） |

当前主库规模：**325 条 / 12 语言**（en, de, ja, fr, es, pt, it, ko, nl, pl, ru, ar）。

---

## 二、数据模型（一条记录长什么样）

主库中每条关键词是一个 JSON 对象：

```json
{
  "id": "titanium-cnc-machining-services-en",
  "keyword": "Titanium CNC Machining Services",
  "lang": "en",
  "intent": "commercial",
  "entity": "process",
  "targetUrl": "/titanium-cnc-machining-services/",
  "anchorText": "Titanium CNC Machining Services",
  "volume": null,
  "difficulty": null,
  "source": "deepseek",
  "status": "planned",
  "note": "面向商业采购意向",
  "updatedAt": "2026-08-11T08:03:45.817Z"
}
```

**关键字段说明：**

| 字段 | 取值 | 含义 |
|---|---|---|
| `lang` | en/de/ja/fr/es/pt/it/ko/nl/pl/ru/ar | 语言 |
| `intent` | informational / commercial / transactional / navigational | 搜索意图（B2B 里比搜索量更重要） |
| `entity` | material / process / product / industry / standard / service / uncategorized | 语义实体归属 |
| `source` | manual / gsc / competitor / deepseek | 词来源 |
| `status` | **planned / mapped / deprecated** | 规划中 / 已映射内链 / 已废弃 |
| `volume` / `difficulty` | 数字或 null | 搜索量/难度，DeepSeek 阶段一律 null，后续用 GSC 回填 |

> ⚠️ **status 是隔离开关**：只有 `status:'mapped'` 的词才会进内链映射。新扩词默认 `planned`，**不会**误入线上内链。

---

## 三、常用操作（你 + Cline 配合）

### 1. 查询关键词
```bash
# 看各语言分布
npm run kw:count

# 查德语所有商业意图词
npm run kw:query -- --lang=de --intent=commercial

# 查所有 planned（待启用）词
npm run kw:query -- --status=planned

# 查某语言某实体的词
npm run kw:query -- --lang=ja --entity=process

# 导出 CSV 到文件（方便 Excel 浏览/回填）
npm run kw:query -- --lang=de --status=planned --export=de-planned.csv

# 输出为 JSON
npm run kw:query -- --lang=en --format=json

# 看全部
npm run kw:query -- --all
```

> 📌 **给 Cline 的话**：这些是 headless 命令，直接 `npm run kw:query -- ...` 即可，适合在会话里执行并读取结果。

### 2. DeepSeek 扩词（重点功能）
```bash
# 为多个语言扩词，基于若干种子词（dry-run 先预览，不写库）
npm run kw:expand -- --seed "titanium machining" --seed "grade 5 titanium" \
  --lang "ru,ar" --entity process --dry-run

# 实际入库（去掉 --dry-run）
npm run kw:expand -- --seed "titanium machining" --lang "en,de,ja" --entity process --count 12

# 从种子文件读取（每行一个词）
npm run kw:expand -- --seeds-file data/keywords/seeds.txt --lang "en,de" --count 10
```

**扩词参数：**
- `--seed "词"`：可多个，种子词
- `--seeds-file 路径`：从文件读种子（每行一个）
- `--lang "en,de"`：逗号分隔目标语言（默认 en）
- `--entity process`：锁定实体（可选）
- `--count N`：每语言扩多少条（默认 10）
- `--dry-run`：只预览不写库（推荐先跑）
- `--batch N`：种子分批大小（默认 5）

> 📌 **给 Cline 的话**：扩词前务必先 `--dry-run` 预览；确认后再去 `--dry-run` 实际写入。写入后 `source='deepseek'`、`status='planned'`、`volume/difficulty=null`，均按约定自动处理。

### 3. 把词启用为内链（mapped）
新扩的词是 `planned`，要让它们进内链需改成 `mapped`（且需有 `targetUrl`）。

**批量启用 + 补 URL（推荐）：**
```bash
# 把德语所有商业意图的 planned 词设为 mapped 并指向 CNC 服务页
npm run kw:query -- --lang=de --intent=commercial --status=planned \
  --set-status=mapped --set-url=/titanium-cnc-machining-services/

# 单独启用某一条（按 id）
npm run kw:query -- --id=xxx --set-status=mapped --set-url=/xxx/

# 批量启用某语言所有 planned 词（--all 需谨慎，需配合其他筛选）
npm run kw:query -- --lang=ja --set-status=mapped --set-url=/ja/xxx/
```
> ⚠️ 写操作安全保护：必须带筛选条件（--lang/--intent/--id 等）或 --all，否则拒绝执行，避免误改全部。

改完运行：
```bash
npm run kw:sync
node scripts/generate-entity-keywords.mjs   # 重新写入 astro.config.mjs
```

### 4. 回填真实搜索数据（GSC/第三方）
DeepSeek 阶段 `volume`/`difficulty` 都是 `null`。拿到 Google Search Console 或工具数据后：
1. 用 CLI 导出目标词为 CSV：`npm run kw:query -- --status=planned --export=all.csv`
2. 在 Excel 里填 `volume`/`difficulty` 两列（保留 `id` 列）
3. 回填进主库：
```bash
npm run kw:query -- --import-csv=all.csv
```
> CSV 需含 `id` 列，或同时含 `keyword` + `lang` 列；脚本按 id（或 lang+keyword）匹配回填 volume/difficulty。

### 5. 数据健康审计
```bash
npm run kw:query -- --audit
```
检查：id 重复/缺失、空 keyword、非法 lang/status、mapped 缺 targetUrl/anchorText 等，输出问题清单。

---

## 四、内链工作流（完整闭环）

```
编辑主库(增词/改 status) 
   → npm run kw:sync        # 主库 → entity-keywords.mjs
   → node scripts/generate-entity-keywords.mjs  # → astro.config.mjs keywordMap
   → npm run build          # 构建时 rehype 插件按语言自动加内链
```

**日常建议流程：**
1. `npm run kw:expand --dry-run` 预览新词 → 确认 → 实际入库
2. 审查 `planned` 词，挑高价值词改为 `mapped` + 补 `targetUrl`
3. `npm run kw:sync` + `generate-entity-keywords.mjs`
4. `npm run build` 验证（应见页数正常、内链无死链）
5. 可选：`node scripts/check-undefined-slugs.mjs` 检查 slug 安全

---

## 五、文件与脚本速查

| 路径 | 作用 | 是否需要直接编辑 |
|---|---|---|
| `data/keywords/main-db.json` | 主库（唯一权威源） | 是（或用脚本/找 Cline） |
| `src/lib/keywords/types.ts` | 类型定义（Schema） | 一般不改 |
| `src/lib/keywords/repository.mjs` | 数据访问层（读写/筛选/派生） | 一般不改（改它=换底层存储的接缝） |
| `scripts/kw-cli.mjs` | CLI 查询工具 | 否（命令调用） |
| `scripts/deepseek-expand-keywords.mjs` | DeepSeek 扩词 | 否（命令调用） |
| `scripts/keywords-sync.mjs` | 主库 → entity-keywords.mjs 派生 | 否（命令调用） |
| `scripts/migrate-keywords.mjs` | 一次性迁移（已用） | 否 |
| `entity-keywords.mjs` | 内链锚文本映射（**自动生成**） | **否（勿手改，改主库）** |
| `astro.config.mjs` | 含 keywordMap（**自动生成**） | 否（勿手改 keywordMap） |
| `.env.production` | 存 `DEEPSEEK_API_KEY`（gitignore，不提交） | 换 key 时改 |

---

## 六、安全与约定（务必遵守）

1. **密钥安全**：`DEEPSEEK_API_KEY` 只放 `.env.production`（已被 `.gitignore` 忽略，绝不提交 GitHub）。脚本读取优先级：环境变量 → `.env.production` → 内置兜底。
2. **勿手改派生文件**：`entity-keywords.mjs` 和 `astro.config.mjs` 的 keywordMap 都是自动生成的，改了会被覆盖；要改走主库。
3. **status 隔离**：新增词默认 `planned`，不会影响线上内链；确认后再 `mapped`。
4. **volume/difficulty 不虚构**：DeepSeek 阶段保持 `null`，只回填真实数据。
5. **非拉丁语言**：日/韩/阿拉伯/俄语的 `id` 用 hash 生成，保证唯一，无需手动维护。

---

## 七、指令速查总表（指挥 Cline 用）

### 7.1 存储 / 初始化
| 用途 | 指令 |
|---|---|
| 首次/重建主库 | `node scripts/migrate-keywords.mjs` |
| 查看主库状态 | `node scripts/kw-cli.mjs --count` |

### 7.2 查询
| 用途 | 指令 |
|---|---|
| 各语言词条统计 | `node scripts/kw-cli.mjs --count` |
| 查德语商业意图词 | `node scripts/kw-cli.mjs --lang=de --intent=commercial` |
| 查所有 planned 词 | `node scripts/kw-cli.mjs --status=planned` |
| 查某语言某实体 | `node scripts/kw-cli.mjs --lang=ja --entity=process` |
| 查全部 | `node scripts/kw-cli.mjs --all` |
| 导出 CSV（Excel 用） | `node scripts/kw-cli.mjs --lang=de --status=planned --export=de-planned.csv` |
| 输出 JSON | `node scripts/kw-cli.mjs --lang=en --format=json` |
| 按 id 精确查 | `node scripts/kw-cli.mjs --id=xxx` |

### 7.3 DeepSeek 扩词
| 用途 | 指令 |
|---|---|
| 先预览（推荐） | `node scripts/deepseek-expand-keywords.mjs --seed "titanium machining" --lang "ru,ar" --entity process --dry-run` |
| 实际入库 | `node scripts/deepseek-expand-keywords.mjs --seed "titanium machining" --seed "grade 5 titanium" --lang "en,de,ja" --count 12` |
| 从种子文件扩词 | `node scripts/deepseek-expand-keywords.mjs --seeds-file data/keywords/seeds.txt --lang "en,de" --count 10` |
| 锁定实体类型 | 上面命令加 `--entity=process`（或 material/industry 等） |

> ⚠️ 流程：**先 `--dry-run` 预览 → 确认 → 去掉 `--dry-run` 实际写入**。

### 7.4 批量启用（planned → mapped + 补 URL）
| 用途 | 指令 |
|---|---|
| 批量启用某语言某意图词 | `node scripts/kw-cli.mjs --lang=de --intent=commercial --status=planned --set-status=mapped --set-url=/titanium-cnc-machining-services/` |
| 单独启用一条 | `node scripts/kw-cli.mjs --id=xxx --set-status=mapped --set-url=/xxx/` |
| 启用某语言全部 planned | `node scripts/kw-cli.mjs --lang=ja --set-status=mapped --set-url=/ja/xxx/` |
| 只改 URL | `node scripts/kw-cli.mjs --id=xxx --set-url=/new-url/` |

> ⚠️ 安全保护：不带筛选条件会被拒绝，防止误改全库。

### 7.5 数据回填（GSC / volume / difficulty）
| 用途 | 指令 |
|---|---|
| 导出目标词为 CSV | `node scripts/kw-cli.mjs --status=planned --export=all.csv` |
| （填好数据后）回填 | `node scripts/kw-cli.mjs --import-csv=all.csv` |

> CSV 需含 `id` 列（或 `keyword`+`lang` 两列）。

### 7.5b 批量导入新词（CSV/JSON → 主库新条目）
| 用途 | 指令 |
|---|---|
| 从 CSV 导入新词 | `node scripts/kw-cli.mjs --import-new=words.csv` |
| 从 JSON 导入新词 | `node scripts/kw-cli.mjs --import-new=words.json` |

> 需含 `keyword`+`lang` 两列（必填）；`intent/entity/targetUrl/anchorText/source/status/volume/difficulty/note` 可选，缺省用默认值（intent=commercial、entity=uncategorized、source=manual、status=planned）。已存在的词自动跳过，不重复。

### 7.6 健康审计
| 用途 | 指令 |
|---|---|
| 全库健康检查 | `node scripts/kw-cli.mjs --audit` |

### 7.7 内链派生 / 上线
| 用途 | 指令 |
|---|---|
| 主库 → entity-keywords.mjs | `node scripts/keywords-sync.mjs` |
| → astro.config.mjs | `node scripts/generate-entity-keywords.mjs` |
| slug 安全检查 | `node scripts/check-undefined-slugs.mjs --ci` |
| 完整构建验证 | `npm run build` |
| 确认无残留 | `git status --short` |

---

## 八、给 Cline 的配合提示（直接可用）

> 当你（Cline）被要求处理关键词库时，记住这些：
> - 查询：`npm run kw:query -- --lang=X --status=planned`
> - 扩词：先 `--dry-run` 再实际写入，用 `--lang` 可一次扩多语言
> - 改 status 到 mapped：`npm run kw:query -- --id=xxx --set-status=mapped --set-url=/xxx/`（需补 `targetUrl`）
> - 同步内链：`npm run kw:sync` → `node scripts/generate-entity-keywords.mjs` → `npm run build`
> - 改完必跑：`npm run build`（或至少 `kw:sync` 验证）+ `check-undefined-slugs`
> - 别手改 `entity-keywords.mjs` / `astro.config.mjs` 的 keywordMap
> - 完成后 `git status --short` 确认无临时文件残留
> - 完整指令清单见本文件「七、指令速查总表」
