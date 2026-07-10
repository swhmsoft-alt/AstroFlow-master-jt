"""Add HERO_CONFIG keyMetrics/entityChips to all service sub-page static files"""
import os, glob, re

root = r'C:\Users\Administrator\Desktop\AstroFlow-master-jt\src\pages'
subdirs = ['titanium-cnc-machining-services','titanium-additive-manufacturing','titanium-fabrication-services','titanium-forming-heavy-manufacturing','titanium-surface-treatment']

# Build route key from file path
# e.g. src/pages/titanium-cnc-machining-services/3-5-axis-cnc-machining.astro
#    → /titanium-cnc-machining-services/3-5-axis-cnc-machining
def route_from_file(fp):
    rel = os.path.relpath(fp, root).replace('\\', '/')
    if rel.endswith('.astro'):
        rel = rel[:-6]
    if not rel.startswith('/'):
        rel = '/' + rel
    return rel

processed = 0
for sd in subdirs:
    path = os.path.join(root, sd)
    if not os.path.exists(path):
        continue
    for f in sorted(glob.glob(os.path.join(path, '*.astro'))):
        route = route_from_file(f)
        
        with open(f, 'r', encoding='utf-8') as fh:
            content = fh.read()
        
        # Skip if already has HERO_CONFIG
        if 'import { HERO_CONFIG }' in content:
            print(f'  SKIP (has HERO_CONFIG): {os.path.basename(f)}')
            continue
        
        # Get HERO_CONFIG entry to verify it exists
        # (the route might not be in hero.ts for some files)
        hero_ts = open(os.path.join(root, '..', 'config', 'hero.ts'), 'r', encoding='utf-8').read()
        expected_key = f"  '{route}': {{"
        if expected_key not in hero_ts:
            print(f'  WARN (no hero.ts entry): {route}')
            # Still try to add it - page just won't show metrics until hero.ts is updated
        
        # 1. Add HERO_CONFIG import
        old_import = "import { getLangFromUrl, useTranslations } from '../../i18n/utils';"
        new_import = old_import + "\nimport { HERO_CONFIG } from '../../config/hero';"
        content = content.replace(old_import, new_import)
        
        # 2. Add keyMetrics/entityChips to SubpageHero
        # Find the SubpageHero tag and its closing />
        sub_idx = content.find('<SubpageHero')
        close_idx = content.find('/>', sub_idx)
        
        if sub_idx >= 0 and close_idx >= 0:
            # Find subtitle= line to determine the indent
            sub_line = content.rfind('subtitle=', sub_idx, close_idx)
            if sub_line >= 0:
                # Get the line's leading whitespace
                line_start = content.rfind('\n', 0, sub_line) + 1
                indent = content[line_start:sub_line]  # e.g., '    '
                
                # Build the insertion
                insert = f'\n{indent}keyMetrics={{HERO_CONFIG[\'{route}\']?.keyMetrics}}\n{indent}entityChips={{HERO_CONFIG[\'{route}\']?.entityChips}}'
                
                # Insert before />
                content = content[:close_idx] + insert + '\n  ' + content[close_idx:]
                print(f'  ADDED: {route} -> {os.path.basename(f)}')
                processed += 1
            else:
                print(f'  ERROR: no subtitle= in {os.path.basename(f)}')
        else:
            print(f'  ERROR: no SubpageHero in {os.path.basename(f)}')
        
        with open(f, 'w', encoding='utf-8') as fh:
            fh.write(content)

print(f'\nDone! {processed} files updated')
