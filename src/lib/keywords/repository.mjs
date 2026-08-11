/**
 * Keyword Database — Data Access Layer (Repository)
 * ================================================================
 * 数据访问抽象层：所有脚本（CLI 查询 / DeepSeek 扩词 / 内链派生）
 * 统一通过本模块读写主库，绝不直接硬编码读取 JSON。
 *
 * 今天底层是静态 JSON 文件（data/keywords/main-db.json）；
 * 未来若迁移到数据库 / API，只需改动本文件内部实现，
 * 上层调用方无需任何变化。
 *
 * 说明：本文件为 .mjs（Node 原生 ESM），供 scripts/*.mjs 直接 import，
 * 不依赖 tsconfig 路径别名。
 * ================================================================
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/**
 * 项目根目录：从 src/lib/keywords/ 向上三级
 *   src/lib/keywords → src/lib → src → <root>
 */
const ROOT = path.resolve(__dirname, '../../..');

/** 主库绝对路径 */
export const MAIN_DB_PATH = path.join(ROOT, 'data', 'keywords', 'main-db.json');

/** 主库相对路径（相对项目根目录，便于日志展示） */
export const MAIN_DB_REL = 'data/keywords/main-db.json';

/**
 * 读取主库全部条目。若主库不存在则返回空数组（首次运行由导入脚本创建）。
 * @returns {Array} 关键词条目数组
 */
export function getAll() {
  if (!fs.existsSync(MAIN_DB_PATH)) return [];
  const raw = fs.readFileSync(MAIN_DB_PATH, 'utf-8');
  const data = JSON.parse(raw);
  return Array.isArray(data) ? data : data.entries || [];
}

/**
 * 根据条件筛选关键词。
 * @param {Object} filters 筛选条件（部分匹配 KeywordEntry 字段）
 * @returns {Array} 筛选结果
 */
export function query(filters = {}) {
  const all = getAll();
  const keys = Object.keys(filters).filter((k) => filters[k] !== undefined && filters[k] !== null && filters[k] !== '');
  if (keys.length === 0) return all;
  return all.filter((item) => keys.every((k) => item[k] === filters[k]));
}

/**
 * 追加或更新（upsert）一条记录。以 { lang, keyword } 判重。
 * @param {Object} entry 单条 KeywordEntry（不含 id 时自动生成）
 * @returns {Object} 写入后的条目
 */
export function upsert(entry) {
  const all = getAll();
  const id = entry.id || buildId(entry.lang, entry.keyword);
  const now = new Date().toISOString();
  const idx = all.findIndex((e) => e.id === id || (e.lang === entry.lang && e.keyword.toLowerCase() === String(entry.keyword).toLowerCase()));

  const record = { ...entry, id, updatedAt: now };

  if (idx >= 0) {
    all[idx] = { ...all[idx], ...record };
  } else {
    all.push(record);
  }

  persist(all);
  return record;
}

/**
 * 批量追加/更新。
 * @param {Array} entries 多条 KeywordEntry
 * @returns {number} 实际写入数量
 */
export function upsertMany(entries) {
  const all = getAll();
  const now = new Date().toISOString();
  let count = 0;

  for (const entry of entries) {
    if (!entry || !entry.keyword) continue;
    const id = entry.id || buildId(entry.lang || 'en', entry.keyword);
    const idx = all.findIndex(
      (e) => e.id === id || (e.lang === entry.lang && e.keyword.toLowerCase() === String(entry.keyword).toLowerCase())
    );
    const record = { ...entry, id, updatedAt: now };

    if (idx >= 0) {
      all[idx] = { ...all[idx], ...record };
    } else {
      all.push(record);
    }
    count++;
  }

  persist(all);
  return count;
}

/**
 * 持久化主库（按 id 排序写入，保持稳定 diff）。
 * @param {Array} entries
 */
export function persist(entries) {
  const sorted = [...entries].sort((a, b) => (a.id < b.id ? -1 : a.id > b.id ? 1 : 0));
  fs.writeFileSync(MAIN_DB_PATH, JSON.stringify(sorted, null, 2) + '\n', 'utf-8');
}

/**
 * 导出为「语言 → { 锚文本: 目标URL }」的映射，
 * 供 scripts/keywords-sync.mjs 生成 entity-keywords.mjs 使用。
 * 仅导出 status === 'mapped' 且 targetUrl / anchorText 齐全的条目。
 * @returns {Object} Record<lang, Record<anchorText, targetUrl>>
 */
export function exportAllLangs() {
  const all = getAll();
  const map = {};
  for (const item of all) {
    if (item.status !== 'mapped') continue;
    const url = item.targetUrl;
    const anchor = item.anchorText || item.keyword;
    if (!url || !anchor) continue;
    if (!map[item.lang]) map[item.lang] = {};
    // 已存在的锚文本不再覆盖（保持稳定）
    if (!(anchor in map[item.lang])) {
      map[item.lang][anchor] = url;
    }
  }
  return map;
}

/**
 * 按筛选条件批量更新匹配条目的字段（如 status / targetUrl / volume / difficulty）。
 * @param {Object} filters 筛选条件（部分匹配 KeywordEntry 字段）
 * @param {Object} patch 要更新的字段
 * @returns {number} 实际更新的条数
 */
export function updateByFilter(filters = {}, patch = {}) {
  const all = getAll();
  const keys = Object.keys(filters).filter((k) => filters[k] !== undefined && filters[k] !== null && filters[k] !== '');
  let count = 0;
  for (const item of all) {
    const match = keys.length === 0 || keys.every((k) => item[k] === filters[k]);
    if (!match) continue;
    Object.assign(item, patch);
    item.updatedAt = new Date().toISOString();
    count++;
  }
  if (count > 0) persist(all);
  return count;
}

/**
 * 根据语言 + 关键词生成稳定 ID。
 * @param {string} lang
 * @param {string} keyword
 * @returns {string}
 */
/** djb2 风格短 hash（8 位十六进制），保证唯一性且不依赖字符截断 */
function hash8(str) {
  let h = 5381;
  for (let i = 0; i < str.length; i++) {
    h = ((h << 5) + h + str.charCodeAt(i)) >>> 0;
  }
  return h.toString(16).padStart(8, '0');
}

/**
 * 根据语言 + 关键词生成稳定 ID。
 * @param {string} lang
 * @param {string} keyword
 * @returns {string}
 */
export function buildId(lang, keyword) {
  const raw = String(keyword).trim();
  // 仅当整串均为纯拉丁字符（字母/数字/空格/下划线/连字符等）时才使用可读 slug，
  // 否则（含日文/韩文/阿拉伯文/西里尔等任意非拉丁）用短 hash 保证唯一。
  const isPureLatin = /^[a-zA-Z0-9 _\-+./&,()']+$/.test(raw);
  if (!isPureLatin) {
    return `${lang}-u-${hash8(raw)}`;
  }
  const slug = raw
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 60);
  return `${slug || 'kw'}-${lang}`;
}

/** 统计各语言条目数 */
export function countByLang() {
  const all = getAll();
  const counter = {};
  for (const item of all) counter[item.lang] = (counter[item.lang] || 0) + 1;
  return counter;
}
