"""Update remaining service pages to pass HERO_CONFIG keyMetrics/entityChips"""
import os

root = r'C:\Users\Administrator\Desktop\AstroFlow-master-jt\src\pages'

pages = {
    'titanium-additive-manufacturing.astro': '/titanium-additive-manufacturing',
    'titanium-fabrication-services.astro': '/titanium-fabrication-services',
    'titanium-forming-heavy-manufacturing.astro': '/titanium-forming-heavy-manufacturing',
    'titanium-surface-treatment.astro': '/titanium-surface-treatment',
    'branded-custom-packaging-services.astro': '/branded-custom-packaging-services',
    'laser-marking-custom-logo.astro': '/laser-marking-custom-logo',
}

for fname, route in pages.items():
    fp = os.path.join(root, fname)
    if not os.path.exists(fp):
        print('NOT FOUND:', fname)
        continue

    with open(fp, 'r', encoding='utf-8') as f:
        content = f.read()

    # 1. Add HERO_CONFIG import
    if 'import { HERO_CONFIG }' not in content:
        old = "import { getLangFromUrl, useTranslations } from '../i18n/utils';"
        new = old + "\nimport { HERO_CONFIG } from '../config/hero';"
        content = content.replace(old, new)

    # 2. Add keyMetrics/entityChips to SubpageHero
    if 'keyMetrics={' not in content:
        sub_idx = content.find('<SubpageHero')
        if sub_idx >= 0:
            sub_line = content.find('subtitle=', sub_idx)
            if sub_line >= 0:
                close_idx = content.find('/>', sub_line)
                if close_idx >= 0:
                    insert = '\n'
                    insert += '    keyMetrics={HERO_CONFIG[\'' + route + '\'].keyMetrics}\n'
                    insert += '    entityChips={HERO_CONFIG[\'' + route + '\'].entityChips}'
                    content = content[:close_idx] + insert + '\n  ' + content[close_idx:]
                    print('  UPDATED:', fname)
                else: print('  ERROR: no /> in', fname)
            else: print('  ERROR: no subtitle= in', fname)
        else: print('  ERROR: no SubpageHero in', fname)
    else: print('  SKIP (has metrics):', fname)

    with open(fp, 'w', encoding='utf-8') as f:
        f.write(content)

print('Done!')
