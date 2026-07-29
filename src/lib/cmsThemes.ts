/**
 * Static theme definitions for the Titanium Theme System.
 * Previously managed via Decap CMS, now hardcoded for static builds.
 */

export interface ThemeDefinition {
  id: string;
  name: string;
}

export const themes: ThemeDefinition[] = [
  { id: 'legacy-original', name: 'BOZE Original' },
  { id: 'classic-titanium', name: '经典钛金工业' },
  { id: 'aerospace-precision', name: '航空航天精密' },
  { id: 'anodized-colorway', name: '阳极氧化艺术' },
  { id: 'sustainable-metallics', name: '绿色低碳未来' },
  { id: 'light-beige', name: '纯白简约' },
];

export const DARK_THEMES = ['legacy-original', 'aerospace-precision', 'anodized-colorway'];
export const LIGHT_THEMES = ['classic-titanium', 'sustainable-metallics', 'light-beige'];
export const DARK_DEFAULT = 'aerospace-precision';
export const LIGHT_DEFAULT = 'light-beige';

export const DEFAULT_THEME_ID = 'legacy-original';