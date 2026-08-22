/**
 * tools-manifest.ts
 * ─────────────────────────────────────────────────────────────────────
 *  Local Dev Dashboard — single source of truth for every tool card.
 *
 *  Adding a new card?  Append to TOOLS below.  No other file changes.
 *
 *  Closed-loop contract (per SEMANTIC_CLOSURE §0):
 *    • Input  : this manifest + user-supplied args (validated by Zod schema)
 *    • Compute: server-side whitelist + child_process.spawn
 *    • Store  : localStorage (lastRun, lastStatus) on client side
 *    • Output : NDJSON stream over fetch ReadableStream
 *    • Reuse  : zero new dependencies (Node built-ins only)
 * ─────────────────────────────────────────────────────────────────────
 */

export type ToolGroup =
  | 'keywords'         // 关键词库
  | 'internal-links'   // 内链映射 (两层架构)
  | 'quality'          // 内容质量
  | 'assets';          // 资产 & Schema

export type ToolArgType = 'select' | 'text' | 'number' | 'boolean';

export interface ToolArg {
  /** CLI flag as the script expects it (without leading dashes). */
  flag: string;
  /** Display label shown in the form. */
  label: string;
  /** Input widget type. */
  type: ToolArgType;
  /** For 'select'. First option becomes the default if no `default` set. */
  options?: readonly string[];
  /** Pre-selected value. */
  default?: string;
  /** If true, run button is disabled until value is filled. */
  required?: boolean;
  /** Placeholder for 'text' inputs. */
  placeholder?: string;
  /** Short hint shown beneath the input. */
  hint?: string;
}

export interface ToolDef {
  /** Unique id; must match the whitelist in api/run-tool.ts. */
  id: string;
  /** Group used for card section + visual icon. */
  group: ToolGroup;
  /** Card title (Chinese). */
  title: string;
  /** One-line description shown on the card. */
  description: string;
  /** Emoji icon for the card header. */
  icon: string;
  /**
   * Shell command template.  Variables in `${varName}` form are substituted
   * from validated `args`.  Static commands (no args) omit the marker.
   */
  command: string;
  /** Optional args; rendered as a small form above the run button. */
  args?: ToolArg[];
  /** Rough ETA shown as a placeholder duration in the log header. */
  estimatedDurationMs?: number;
  /**
   * Safety tier — drives confirmation modal & badge color.
   *   safe    : read-only / pure stdout reports
   *   caution : modifies files in `data/` or `public/`
   *   danger  : mutates build config (`astro.config.mjs`) or hits paid APIs
   */
  dangerLevel: 'safe' | 'caution' | 'danger';
  /** Paths that, if changed after a run, indicate the tool actually did work. */
  outputIndicators?: string[];
  /** Free-text warning shown in confirmation modal for caution/danger tools. */
  warning?: string;
}

/* ────────────────────────────────────────────────────────────────────── */
/*  TOOL REGISTRY                                                        */
/* ────────────────────────────────────────────────────────────────────── */

const LANGS = ['en', 'de', 'ja', 'fr', 'es', 'pt', 'it', 'ko', 'nl', 'pl', 'ru', 'ar'] as const;
const INTENTS = ['informational', 'commercial', 'transactional', 'navigational'] as const;
const ENTITIES = ['capability', 'material', 'industry', 'process', 'equipment', 'service'] as const;

export const TOOLS: readonly ToolDef[] = [
  /* ──────────────── 关键词库 (5) ──────────────── */
  {
    id: 'kw:query',
    group: 'keywords',
    title: '关键词检索',
    description: '按语言 / 意图 / 实体过滤浏览关键词库。',
    icon: '🔍',
    command: 'node scripts/kw-cli.mjs ${lang} ${intent} ${entity}',
    args: [
      { flag: 'lang',   label: '语言',  type: 'select', options: LANGS,   default: 'en',  required: false, hint: '选择目标语言版本' },
      { flag: 'intent', label: '意图',  type: 'select', options: INTENTS, default: '',    required: false, hint: '留空 = 全部' },
      { flag: 'entity', label: '实体',  type: 'select', options: ENTITIES, default: '',   required: false, hint: '留空 = 全部' },
    ],
    estimatedDurationMs: 3_000,
    dangerLevel: 'safe',
    outputIndicators: ['data/keywords/main-db.json'],
  },
  {
    id: 'kw:count',
    group: 'keywords',
    title: '关键词统计',
    description: '打印关键词总数、按语言/实体分桶统计。',
    icon: '🔢',
    command: 'node scripts/kw-cli.mjs --count',
    estimatedDurationMs: 3_000,
    dangerLevel: 'safe',
  },
  {
    id: 'kw:sync',
    group: 'keywords',
    title: '关键词同步',
    description: '将 main-db.json 与 audience-taxonomy.json 双向同步，写入 data/keywords/。',
    icon: '🔄',
    command: 'node scripts/keywords-sync.mjs',
    estimatedDurationMs: 10_000,
    dangerLevel: 'caution',
    warning: '会修改 data/keywords/main-db.json。建议先 git status 确认无未提交改动。',
    outputIndicators: ['data/keywords/main-db.json', 'data/keywords/audience-taxonomy.json'],
  },
  {
    id: 'kw:expand',
    group: 'keywords',
    title: 'AI 关键词扩词',
    description: '调用 MiniMax M3 基于现有词库生成更多长尾关键词。',
    icon: '🧠',
    command: 'node scripts/deepseek-expand-keywords.mjs',
    estimatedDurationMs: 60_000,
    dangerLevel: 'danger',
    warning: '会消耗 MiniMax M3 API 配额（预估 30s-2min），并写回 data/keywords/。',
    outputIndicators: ['data/keywords/main-db.json'],
  },
  {
    id: 'kw:migrate',
    group: 'keywords',
    title: '关键词库迁移',
    description: '将旧版关键词 schema 迁移到当前结构（破坏性，写前会自动备份）。',
    icon: '🚚',
    command: 'node scripts/migrate-keywords.mjs',
    estimatedDurationMs: 15_000,
    dangerLevel: 'caution',
    warning: '会读取旧格式、写入新格式。建议先备份 data/keywords/。',
    outputIndicators: ['data/keywords/main-db.json'],
  },

  /* ──────────────── 内链映射 (5) ──────────────── */
  {
    id: 'gen-internal-links',
    group: 'internal-links',
    title: '🤖 AI 关键词映射（自动内链 Layer A）',
    description: '扫描所有博客 → MiniMax M3 生成 keyword→URL 映射 → 写回 astro.config.mjs。',
    icon: '🤖',
    command: 'node scripts/generate-internal-links.mjs',
    estimatedDurationMs: 120_000,
    dangerLevel: 'danger',
    warning: '⚠️ 会直接修改 astro.config.mjs 并消耗 MiniMax M3 API。失败需 git checkout astro.config.mjs 回滚。',
    outputIndicators: ['astro.config.mjs'],
  },
  {
    id: 'check-orphan-pages:strict',
    group: 'internal-links',
    title: '🔍 孤儿页扫描（严格）',
    description: '扫描全站无入链页面，输出到 stdout（默认 strict 等级）。',
    icon: '🔍',
    command: 'node scripts/check-orphan-pages.mjs --level=strict --format=console',
    estimatedDurationMs: 15_000,
    dangerLevel: 'safe',
    outputIndicators: ['output/orphan-pages-report.json'],
  },
  {
    id: 'check-orphan-pages:geo',
    group: 'internal-links',
    title: '🌍 孤儿页扫描（GEO 集群）',
    description: '含 GEO 集群分析，按地区聚合孤儿页。',
    icon: '🌍',
    command: 'node scripts/check-orphan-pages.mjs --level=geo --format=console',
    estimatedDurationMs: 20_000,
    dangerLevel: 'safe',
    outputIndicators: ['output/orphan-pages-report.json'],
  },
  {
    id: 'build-related-links',
    group: 'internal-links',
    title: '🏗️ 关联链接矩阵构建（Layer B）',
    description: '读取孤儿报告 → 生成 data/related-links.json（供 Markdown frontmatter 消费）。',
    icon: '🏗️',
    command: 'node scripts/build-related-links.mjs',
    estimatedDurationMs: 10_000,
    dangerLevel: 'caution',
    warning: '会覆盖 data/related-links.json。需先跑孤儿页扫描作为输入。',
    outputIndicators: ['data/related-links.json'],
  },
  {
    id: 'audit-i18n-links',
    group: 'internal-links',
    title: '🛠️ i18n 链接审计',
    description: '审计多语言站点间链接一致性（孤儿翻译页 / 错配 href）。',
    icon: '🛠️',
    command: 'node scripts/audit-i18n-links.mjs',
    estimatedDurationMs: 10_000,
    dangerLevel: 'safe',
  },

  /* ──────────────── 内容质量 (2) ──────────────── */
  {
    id: 'check:similarity',
    group: 'quality',
    title: '相似度检查',
    description: '扫描所有产品页，输出相似度报告（默认阈值 0.45）。',
    icon: '📐',
    command: 'node scripts/check-similarity.mjs',
    args: [
      { flag: 'strict', label: '严格模式 (阈值 0.30)', type: 'boolean', default: 'false', hint: '勾选 → 阈值降到 0.30' },
    ],
    estimatedDurationMs: 20_000,
    dangerLevel: 'safe',
  },
  {
    id: 'differentiate',
    group: 'quality',
    title: '产品差异化重写',
    description: '基于相似度报告自动差异化低区分度产品 Markdown。',
    icon: '✍️',
    command: 'node scripts/differentiate-products.mjs',
    estimatedDurationMs: 60_000,
    dangerLevel: 'caution',
    warning: '会修改 src/content/products/ 下的 .md 文件。建议先 git status。',
    outputIndicators: ['src/content/products/'],
  },

  /* ──────────────── 资产 & Schema (2) ──────────────── */
  {
    id: 'optimize:images',
    group: 'assets',
    title: '图片优化',
    description: '压缩 public/ 下图片资源，转 WebP 并生成多尺寸 srcset。',
    icon: '🖼️',
    command: 'node scripts/optimize-images.js',
    estimatedDurationMs: 90_000,
    dangerLevel: 'caution',
    warning: '会覆盖 public/ 下图片文件，可能耗时数分钟。',
    outputIndicators: ['public/'],
  },
  {
    id: 'validate-schema',
    group: 'assets',
    title: 'Schema.org 验证',
    description: '校验已构建站点的 JSON-LD 结构（需先 npm run build）。',
    icon: '✅',
    command: 'node tasks/validate_schema.mjs',
    estimatedDurationMs: 30_000,
    dangerLevel: 'safe',
  },
] as const;

/* ────────────────────────────────────────────────────────────────────── */
/*  HELPERS                                                               */
/* ────────────────────────────────────────────────────────────────────── */

/** All tool ids — used by the API route for whitelist enforcement. */
export const TOOL_IDS = new Set<string>(TOOLS.map((t) => t.id));

/** Group → human-readable Chinese label. */
export const GROUP_LABELS: Record<ToolGroup, { label: string; icon: string; subtitle: string }> = {
  keywords:         { label: '关键词库',       icon: '📊', subtitle: '驱动整站 SEO 的核心资产' },
  'internal-links': { label: '内链映射',       icon: '🔗', subtitle: 'Layer A 自动内链 + Layer B 关联矩阵' },
  quality:          { label: '内容质量',       icon: '🔍', subtitle: '相似度检测 & 差异化重写' },
  assets:           { label: '资产 & Schema',  icon: '🖼️', subtitle: '图片优化 + Schema.org 校验' },
};

/**
 * Build the actual shell command by substituting ${flag} placeholders.
 * Returns null if a required arg is missing or an unknown flag is provided.
 *
 * Pure function — never throws on user input, returns null instead so the
 * API route can answer with a 400.
 */
export function buildCommand(
  def: ToolDef,
  userArgs: Record<string, string | undefined>,
): string | null {
  let cmd = def.command;

  if (def.args) {
    for (const arg of def.args) {
      const placeholder = new RegExp(`\\$\\{${arg.flag}\\}`, 'g');
      const raw = userArgs[arg.flag];

      // Skip empty optional args entirely (don't emit the flag at all).
      if (!raw || raw.trim() === '' || raw === 'false') {
        cmd = cmd.replace(placeholder + ' ', '');
        cmd = cmd.replace(placeholder, '');
        continue;
      }

      // Boolean flag → emit --flag only when truthy.
      if (arg.type === 'boolean') {
        if (raw === 'true' || raw === '1') {
          cmd = cmd.replace(placeholder, `--${arg.flag}`);
        } else {
          cmd = cmd.replace(placeholder, '');
        }
        continue;
      }

      cmd = cmd.replace(placeholder, `--${arg.flag}=${raw}`);
    }
  }

  // Collapse multiple spaces defensively.
  cmd = cmd.replace(/\s{2,}/g, ' ').trim();

  // Reject any remaining template placeholder (means we missed a substitution).
  if (/\$\{[^}]+\}/.test(cmd)) return null;

  return cmd;
}
