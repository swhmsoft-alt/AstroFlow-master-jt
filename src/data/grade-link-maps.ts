/**
 * src/data/grade-link-maps.ts
 *
 * ═══════════════════════════════════════════════════════════════
 * 内链蜘蛛网映射层
 * ═══════════════════════════════════════════════════════════════
 *
 * 职责：
 *   从 GRADE_DATA 的 free-text 文本（如 "Grade 23 (Ti-6Al-4V ELI) — ..."）
 *   中提取关键词，映射到对应的页面 slug，生成超链接。
 *
 * 机制（锚文本 → 超链）：
 *
 *   文本格式：  "关键词 — 描述内容"
 *                    ↓
 *   查 INDUSTRY_SLUG_MAP / GRADE_ALTERNATIVE_SLUG_MAP
 *                    ↓
 *   生成： <a href="/industries/aerospace/">关键词</a> — 描述内容
 *
 * 匹配规则：
 *   1. 取 " — " 之前的部分作为关键词
 *   2. 按映射表 key 长度降序匹配（防止 "Grade 2" 误配 "Grade 23"）
 *   3. 匹配方式：startsWith（精确前缀匹配）
 *
 * 多语言安全：
 *   所有生成的 href 使用绝对路径 /industries/... /materials/...
 *   配合 Astro i18n 的 prefixDefaultLocale: false，EN 路径无前缀，
 *   非 EN 路径由 [lang]/[...slug].astro catch-all 路由处理。
 */

/**
 * 行业文本关键词 → slug 映射。
 * key 为 usedIn.items 中 " — " 之前的行业名关键词。
 */
const INDUSTRY_SLUG_MAP: Record<string, string> = {
  'Aerospace & defense': 'aerospace',
  'Marine & shipbuilding': 'marine',
  'Architecture & construction': 'industrial-equipment',
  'Chemical processing': 'industrial-equipment',
  'Power generation': 'energy',
  'Food & beverage': 'industrial-equipment',
  'Pulp & paper': 'industrial-equipment',
  'Medical (limited)': 'medical',
  'Industrial equipment': 'industrial-equipment',
  'Sports & recreation': 'industrial-equipment',
  'Defense & military': 'aerospace',
  'Oil & gas': 'energy',
  'Semiconductor': 'semiconductor',
  'Electronics': 'semiconductor',
  'Aerospace': 'aerospace',
  'Automotive': 'industrial-equipment',
  'Desalination': 'industrial-equipment',
  'Medical': 'medical',
  'Marine': 'marine',
  'Defense': 'aerospace',
  'Energy': 'energy',
};

/**
 * 替代材质名称关键词 → 材质页 slug 映射。
 * key 为 alternativeTo.items 中 " — " 之前的材质名。
 *
 * ⚠️ 排序规则：长 key 在上，短 key 在下。
 *    防止 "Grade 2" 误截 "Grade 23"。
 */
const GRADE_ALTERNATIVE_SLUG_MAP: Record<string, string> = {
  'Ti-6Al-4V ELI': 'grade-23',
  'Ti-6Al-4V': 'grade-5',
  'INCONEL 718': 'grade-6242',
  'Grade 23': 'grade-23',
  'Grade 21': 'grade-21',
  'Grade 19': 'grade-19',
  'Grade 6': 'grade-6',
  'Grade 9': 'grade-9',
  'Grade 5': 'grade-5',
  'Grade 4': 'grade-4',
  'Grade 3': 'grade-3',
  'Grade 2': 'grade-2',
  'Grade 1': 'grade-1',
};

/**
 * 缓存：按 key.length 降序排列的 entries，确保长 key 优先匹配。
 */
const SORTED_INDUSTRY_ENTRIES = Object.entries(INDUSTRY_SLUG_MAP)
  .sort((a, b) => b[0].length - a[0].length);

const SORTED_GRADE_ENTRIES = Object.entries(GRADE_ALTERNATIVE_SLUG_MAP)
  .sort((a, b) => b[0].length - a[0].length);

/**
 * 根据行业文本提取 slug。
 *
 * @param itemText - usedIn.items 的完整文本，格式 "关键词 — 描述"
 * @returns 匹配到的 slug，或 null
 *
 * 示例：
 *   "Aerospace — Airframes, engines..." → "aerospace"
 *   "Marine & shipbuilding — Seawater..." → "marine"
 *   "不存在的行业 — ..." → null (纯文本，无链接)
 */
export function getIndustrySlug(itemText: string): string | null {
  const key = itemText.split(' — ')[0].trim();
  for (const [keyword, slug] of SORTED_INDUSTRY_ENTRIES) {
    if (key.startsWith(keyword)) {
      return slug;
    }
  }
  return null;
}

/**
 * 根据替代材质文本提取材质 slug。
 *
 * @param itemText - alternativeTo.items 的完整文本，格式 "关键词 — 描述"
 * @returns 匹配到的材质 slug，或 null
 *
 * 示例：
 *   "Grade 23 (Ti-6Al-4V ELI) — Improved fracture..." → "grade-23"
 *   "Grade 2 (CP-Ti) — Higher strength..." → "grade-2"
 *   "INCONEL 718 — Higher temperature..." → "grade-6242"
 *   "不存在的材质 — ..." → null (纯文本，无链接)
 */
export function getAlternativeGradeSlug(itemText: string): string | null {
  const key = itemText.split(' — ')[0].trim();
  for (const [keyword, slug] of SORTED_GRADE_ENTRIES) {
    if (key.startsWith(keyword)) {
      return slug;
    }
  }
  return null;
}
