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
];

export const DEFAULT_THEME_ID = 'legacy-original';