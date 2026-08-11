/**
 * Keyword Database — Type Definitions
 * ================================================================
 * 关键词库的核心数据类型定义（唯一权威源 Schema）。
 *
 * 设计原则（方案 4）：
 *   - 数据底座是轻量、无依赖、随 Git 走的静态 JSON 主库（data/keywords/main-db.json）。
 *   - 所有脚本（CLI 查询 / DeepSeek 扩词 / Astro 内链派生）统一通过
 *     repository.ts 数据访问层通信，不直接硬编码读取 JSON。
 *   - 主库从一开始就预留 12 种语言（含 ru / ar），方便后续 DeepSeek 补齐。
 * ================================================================
 */

/** 站点全部支持的语言代码（与 astro.config.mjs 的 locales 保持一致） */
export const KEYWORD_LANGS = [
  'en',
  'de',
  'ja',
  'fr',
  'es',
  'pt',
  'it',
  'ko',
  'nl',
  'pl',
  'ru',
  'ar',
] as const;

export type KeywordLang = (typeof KEYWORD_LANGS)[number];

/** 搜索意图（B2B 钛加工 SEO 中，Intent 比 Volume 更重要） */
export type SearchIntent = 'informational' | 'commercial' | 'transactional' | 'navigational';

/** 语义实体归属（决定内容策划与内链落点） */
export type EntityCategory =
  | 'material' // 材质（Grade 5, Ti-6Al-4V...）
  | 'process' // 工艺（CNC Machining, EDM...）
  | 'product' // 产品（acetabular cup, impeller...）
  | 'industry' // 行业（aerospace, medical...）
  | 'standard' // 标准/认证（AS9100D, ISO 9001...）
  | 'service' // 服务（rapid prototyping, low-volume...）
  | 'uncategorized';

/** 关键词条目来源 */
export type KeywordSource = 'manual' | 'gsc' | 'competitor' | 'deepseek';

/** 关键词条目生命周期状态 */
export type KeywordStatus = 'planned' | 'mapped' | 'deprecated';

/** 关键词条目（单条记录） */
export interface KeywordEntry {
  /** 唯一 ID，如 "gr5-cnc-milled-parts-en" */
  id: string;
  /** 关键词本身 */
  keyword: string;
  /** 语言代码（en/de/ja/fr/es/pt/it/ko/nl/pl/ru/ar） */
  lang: KeywordLang;
  /** 搜索意图 */
  intent: SearchIntent;
  /** 归属语义实体 */
  entity: EntityCategory;
  /** 对应的落地页 URL（用于内链与 SEO 布局） */
  targetUrl?: string;
  /** 内链推荐锚文本（如未单独指定，默认等于 keyword） */
  anchorText?: string;
  /** 月搜索量/热度估计（DeepSeek 阶段留空 null，后续用 GSC/工具回填） */
  volume?: number | null;
  /** SEO 难度 0-100（同上，可留空） */
  difficulty?: number | null;
  /** 条目来源 */
  source: KeywordSource;
  /** 状态：规划中 / 已映射内链 / 已废弃 */
  status: KeywordStatus;
  /** 备注（可选） */
  note?: string;
  /** 更新时间 ISO String */
  updatedAt: string;
}

/** 主库文件相对路径（相对项目根目录，供脚本定位） */
export const MAIN_DB_REL = 'data/keywords/main-db.json';
