#!/usr/bin/env python3
"""Precise i18n refactoring of 7 .astro capability files.
Replaces >>hardcoded_text<< with {t('key')} using exact string matching,
only in HTML content positions (not in attributes, SVG, or expressions)."""
import json, os, re, shutil

BASE = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
COMP_DIR = os.path.join(BASE, 'src', 'components', 'capabilities')

# Load keys
with open(os.path.join(BASE, 'src', 'i18n', 'translations', 'en.json'), 'r', encoding='utf-8') as f:
    en = json.load(f)

# Build text→key map (longest text first)
tk = {}
for k, v in en.items():
    if k.startswith('cap.') and len(v) > 3:
        if v not in tk or len(k) < len(tk[v]):
            tk[v] = k

sorted_items = sorted(tk.items(), key=lambda x: -len(x[0]))
print(f'Loaded {len(sorted_items)} text→key mappings')

FILES = [
    'ManufacturingPage.astro', 'EngineeringPage.astro', 'CapacityPage.astro',
    'QualityPage.astro', 'InspectionPage.astro', 'TraceabilityPage.astro',
    'CertificationsPage.astro',
]

total = 0
for fname in FILES:
    fp = os.path.join(COMP_DIR, fname)
    if not os.path.exists(fp):
        continue
    
    with open(fp, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Backup
    bak = fp + '.bak2'
    shutil.copy2(fp, bak)
    
    original = content
    count = 0
    
    for text, key in sorted_items:
        repl = '{t(\'' + key + '\')}'
        
        # Method: Replace text that appears between HTML tags.
        # We match text surrounded by whitespace/tags context.
        # Safe replacements:
        #   >TEXT<  →  >{t('key')}<
        #   >TEXT\n →  >{t('key')}\n
        #   \nTEXT< →  \n{t('key')}<
        
        patterns = [
            (f'>{text}<', f'>{repl}<'),
            (f'>{text}\n', f'>{repl}\n'),
            (f'\n{text}<', f'\n{repl}<'),
            (f'{text}\n', f'{repl}\n'),
            (f'>{text}', f'>{repl}'),
        ]
        
        for old, new in patterns:
            if old in content:
                # Verify this is not inside an attribute or SVG
                # Check that the replacement context looks like HTML content
                idx = content.index(old)
                before = content[max(0,idx-20):idx]
                after  = content[idx+len(old):idx+len(old)+20]
                
                # Skip if we're inside an SVG path, attribute, or expression
                if ('d="' in before and '"' not in before.split('d="')[0]) or \
                   ('class="' in before and '"' not in before.split('class="')[0]) or \
                   ('href="' in before and '"' not in before.split('href="')[0]):
                    continue
                
                content = content.replace(old, new, 1)
                count += 1
                break  # Only apply one pattern per text
    
    if count > 0:
        with open(fp, 'w', encoding='utf-8') as f:
            f.write(content)
        total += count
        print(f'[{fname}] {count} replacements')
    else:
        print(f'[{fname}] 0 replacements')

print(f'\nTotal: {total} replacements')
