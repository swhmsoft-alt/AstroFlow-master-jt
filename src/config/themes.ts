/**
 * Theme Control File — Single Source of Truth.
 *
 * 手动切换 ACTIVE 主题：恰好把 1 个 `enabled` 设为 true。
 * Astro 构建时校验：0 个或 2+ 个 true → 立即报错。
 *
 * 改主题 = 改这里 + 重 build。无运行时切换器（2026-09 设计决策）。
 *
 * CSS 定义在 src/styles/global.css — 保持 [data-theme="<id>"] 选择器与本文件 id 同步。
 */

export type ThemeId =
  | 'aerospace-precision'   // 1 — 现状深（深蓝 + 天蓝）
  | 'light-beige'           // 2 — 现状浅（近白 + 天蓝）
  | 'cold-titanium-steel'   // 3 — NEW：冷钛工业灰
  | 'aerospace-gold'        // 4 — NEW：航空深空 + 香槟金
  | 'warm-modern-beige'     // 5 — NEW：温暖现代米白
  | 'pure-bw-orange';       // 6 — NEW：纯白 + 品牌橙

export interface ThemeMeta {
  id: ThemeId;
  order: 1 | 2 | 3 | 4 | 5 | 6;
  label: string;
  description: string;
  /** 必须恰好 1 个为 true。 */
  enabled: boolean;
}

export const THEMES: readonly ThemeMeta[] = [
  { id: 'aerospace-precision',  order: 1, label: 'Aerospace Precision / 航空航天精密', description: '现状默认深 — 深蓝 #0F172A + 天蓝 #38BDF8',                     enabled: false  },
  { id: 'light-beige',          order: 2, label: 'Light Beige / 纯白简约',                description: '现状默认浅 — 近白 #FAFAFA + 天蓝 #38BDF8',                    enabled: false },
  { id: 'cold-titanium-steel',  order: 3, label: '冷钛工业灰',                            description: '深石墨蓝 #1B2533 + 钛白 #E8ECEF，中性稳重',                  enabled: false },
  { id: 'aerospace-gold',       order: 4, label: '航空深空 + 香槟金',                      description: '午夜蓝 #0A1929 + 云白 #F5F7FA + 香槟金 #C9A961',              enabled: false },
  { id: 'warm-modern-beige',    order: 5, label: '温暖现代米白',                          description: '深咖 #2B2520 + 米杏 #F5F0E8 + 古铜 #B87333',                 enabled: false },
  { id: 'pure-bw-orange',       order: 6, label: '纯极简黑白 + 橙',                        description: '纯 #000 / 纯 #FFF + 品牌橙 #FF5A00',                          enabled: true },
] as const;

// ── Build-time validation ────────────────────────────────────
const enabledList = THEMES.filter(t => t.enabled);
if (enabledList.length !== 1) {
  throw new Error(
    `[themes.ts] 必须恰好 1 个主题 enabled，当前 ${enabledList.length} 个:\n` +
    enabledList.map(t => `  - ${t.id} (order ${t.order})`).join('\n') +
    `\n改主题 = 改这里 + 重 build。`
  );
}

export const ACTIVE_THEME_ID: ThemeId = enabledList[0].id;
export const ACTIVE_THEME_META: ThemeMeta = enabledList[0];