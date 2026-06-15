// Font configuration map for Decap CMS font management
// Each font entry defines Google Fonts parameters and CSS family

export interface FontConfig {
  name: string;           // Google Fonts API name (URL-safe)
  family: string;         // Display name for CMS dropdown
  weights: string;         // Font weights string for Google Fonts API
  cssFamily: string;       // CSS font-family value
  fallback: string;        // CSS fallback category
  category: string;        // Font category for display
}

export const FONT_MAP: Record<string, FontConfig> = {
  'jetbrains-mono': {
    name: 'JetBrains+Mono',
    family: 'JetBrains Mono (工业等宽)',
    weights: '300;400;500;600;700;800',
    cssFamily: "'JetBrains Mono'",
    fallback: 'monospace',
    category: '等宽字体',
  },
  'inter': {
    name: 'Inter',
    family: 'Inter (现代无衬线)',
    weights: '400;500;600;700',
    cssFamily: 'Inter',
    fallback: 'sans-serif',
    category: '无衬线体',
  },
  'roboto': {
    name: 'Roboto',
    family: 'Roboto (经典无衬线)',
    weights: '400;500;700',
    cssFamily: 'Roboto',
    fallback: 'sans-serif',
    category: '无衬线体',
  },
  'noto-sans-sc': {
    name: 'Noto+Sans+SC',
    family: 'Noto Sans SC (中文优化)',
    weights: '400;500;700',
    cssFamily: "'Noto Sans SC'",
    fallback: 'sans-serif',
    category: '无衬线体',
  },
  'playfair-display': {
    name: 'Playfair+Display',
    family: 'Playfair Display (优雅衬线)',
    weights: '400;500;600;700',
    cssFamily: "'Playfair Display'",
    fallback: 'serif',
    category: '衬线体',
  },
  'space-grotesk': {
    name: 'Space+Grotesk',
    family: 'Space Grotesk (科技感)',
    weights: '400;500;600;700',
    cssFamily: "'Space Grotesk'",
    fallback: 'sans-serif',
    category: '无衬线体',
  },
  'plus-jakarta-sans': {
    name: 'Plus+Jakarta+Sans',
    family: 'Plus Jakarta Sans (现代圆润)',
    weights: '400;500;600;700;800',
    cssFamily: "'Plus Jakarta Sans'",
    fallback: 'sans-serif',
    category: '无衬线体',
  },
  'dm-sans': {
    name: 'DM+Sans',
    family: 'DM Sans (简洁几何)',
    weights: '400;500;700',
    cssFamily: "'DM Sans'",
    fallback: 'sans-serif',
    category: '无衬线体',
  },
};

export const FONT_STYLE_OPTIONS = Object.entries(FONT_MAP).map(([value, config]) => ({
  label: `${config.family} (${config.category})`,
  value,
}));

export const FALLBACK_OPTIONS = [
  { label: 'monospace (等宽)', value: 'monospace' },
  { label: 'sans-serif (无衬线)', value: 'sans-serif' },
  { label: 'serif (衬线)', value: 'serif' },
  { label: 'system-ui (系统默认)', value: 'system-ui' },
];

export function getFontConfig(fontStyle: string): FontConfig {
  return FONT_MAP[fontStyle] || FONT_MAP['jetbrains-mono'];
}

export function getGoogleFontsUrl(fontConfig: FontConfig): string {
  return `https://fonts.googleapis.com/css2?family=${fontConfig.name}:wght@${fontConfig.weights}&display=swap`;
}

export function getCssFamily(fontConfig: FontConfig, fallback: string = ''): string {
  const fb = fallback || fontConfig.fallback;
  return `${fontConfig.cssFamily}, ${fb}`;
}
