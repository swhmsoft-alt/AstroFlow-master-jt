/**
 * src/utils/process-links.ts
 *
 * 工艺步骤 → 服务/能力页面链接映射工具。
 * 用于产品实体页（RichEntityContent 链）中 product-specs 的 `manufacturing_process`
 * 字段：把逗号分隔的工艺步骤逐项链接到对应的服务页或能力页。
 *
 * 设计原则：
 * - 纯函数，不依赖 Astro 运行时，可在组件与服务端渲染中安全复用
 * - 关键词长词优先（数组顺序即匹配优先级），避免短关键词误伤
 * - 未命中的步骤保持纯文本（不产生死链）
 */

export interface ProcessStep {
  /** 步骤原始文本（作为锚文本或纯文本） */
  text: string;
  /** 命中映射时的目标 URL；未命中则为 undefined */
  href?: string;
}

interface ProcessLinkRule {
  /** 触发关键词（小写，按长→短排列） */
  keywords: string[];
  /** 目标页面 URL（服务页或能力页） */
  href: string;
}

// ── 工艺 → 服务/能力 链接映射（数组顺序即匹配优先级）──
const PROCESS_LINK_MAP: ProcessLinkRule[] = [
  // CNC 加工 → CNC 服务
  {
    keywords: [
      '5-axis cnc contouring',
      'cnc swiss turning',
      'cnc precision machining',
      'cnc turning',
      'cnc milling',
      'cnc machining',
      'contouring',
      'milling',
      'turning',
    ],
    href: '/titanium-cnc-machining-services/cnc-milling-turning/',
  },
  // 热处理 / 应力消除 → 能力页
  {
    keywords: ['heat treatment', 'vacuum stress relief', 'stress relief', 'annealing'],
    href: '/products/capabilities/vacuum-heat-treatment/',
  },
  // 磨削 → 能力页
  {
    keywords: ['surface grinding', 'grinding'],
    href: '/products/capabilities/high-precision-grinding/',
  },
  // 钝化 → 表面处理服务
  {
    keywords: ['passivation', 'passivating'],
    href: '/titanium-surface-treatment/chemical-passivation/',
  },
  // 尺寸 / 光学检验 → 能力页
  {
    keywords: [
      'dimensional check',
      'dimensional inspection',
      'cmm inspection',
      'vision inspection',
      'optical gauging',
      'gauging',
      'inspection',
      'check',
    ],
    href: '/products/capabilities/100-dimensional-inspection-cmm/',
  },
  // 螺纹滚压 → 能力页
  {
    keywords: ['thread rolling'],
    href: '/products/capabilities/thread-rolling/',
  },
  // 电解抛光 → 能力页
  {
    keywords: ['electropolishing'],
    href: '/products/capabilities/electropolishing/',
  },
  // 超声波清洗 → 能力页
  {
    keywords: ['ultrasonic clean', 'ultrasonic cleaning'],
    href: '/products/capabilities/ultrasonic-cleaning/',
  },
  // PVD 镀膜 → 能力页
  {
    keywords: ['pvd coating'],
    href: '/products/capabilities/pvd-coating-pt-or-au/',
  },
  // 喷砂 → 能力页
  {
    keywords: ['bead blast'],
    href: '/products/capabilities/bead-blasting-anodizing-pvd/',
  },
  // 金刚石倒角 → 能力页
  {
    keywords: ['diamond-cut beveling', 'beveling'],
    href: '/products/capabilities/cnc-milling--diamond-cut-beveling-of-watch-bezels/',
  },
  // 去毛刺 → 能力页
  {
    keywords: ['deburring'],
    href: '/products/capabilities/deburring-edge-rounding/',
  },
];

/**
 * 将逗号分隔的工艺流程字符串转换为带链接的步骤数组。
 *
 * @param processStr - 例如 "CNC turning, heat treatment, surface grinding, passivation, dimensional check"
 * @returns 每项 `{ text, href? }` 的步骤数组；未命中映射的步骤 `href` 为 undefined
 */
export function linkifyProcessSteps(processStr: string): ProcessStep[] {
  return (processStr || '')
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean)
    .map((step) => {
      const lower = step.toLowerCase();
      for (const rule of PROCESS_LINK_MAP) {
        for (const kw of rule.keywords) {
          if (lower.includes(kw)) {
            return { text: step, href: rule.href };
          }
        }
      }
      return { text: step };
    });
}
