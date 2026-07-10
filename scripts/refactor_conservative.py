#!/usr/bin/env python3
"""Conservative i18n refactoring: Only replaces text in SAFE contexts.
Rules: Only replace >>TEXT<< where:
1. TEXT is between > and < on the SAME line
2. The line does NOT contain: =", d=", style=, onmouse, stroke-, fill-, viewBox
3. The text is NOT inside quotes: "text" or 'text'
"""
import json, os, re, shutil

BASE = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
COMP_DIR = os.path.join(BASE, 'src', 'components', 'capabilities')

# Load keys
with open(os.path.join(BASE, 'src', 'i18n', 'translations', 'en.json'), 'r', encoding='utf-8') as f:
    en = json.load(f)

# Build rev map (longest first)
rev = {}
for k, v in en.items():
    if k.startswith('cap.') and len(v) > 3:
        if v not in rev or len(k) < len(rev[v]):
            rev[v] = k

sorted_texts = sorted(rev.keys(), key=len, reverse=True)
print(f'Loaded {len(sorted_texts)} texts')

FILES = [
    'ManufacturingPage.astro', 'EngineeringPage.astro', 'CapacityPage.astro',
    'QualityPage.astro', 'InspectionPage.astro', 'TraceabilityPage.astro',
    'CertificationsPage.astro',
]

total = 0
for fname in FILES:
    fp = os.path.join(COMP_DIR, fname)
    if not os.path.exists(fp): continue
    
    with open(fp, 'r', encoding='utf-8') as f:
        content = f.read()
    
    bak = fp + '.bak3'
    shutil.copy2(fp, bak)
    
    # Process line by line
    lines = content.split('\n')
    new_lines = []
    file_count = 0
    
    for i, line in enumerate(lines):
        # SAFETY CHECK: Skip lines that contain ANY of these patterns
        # (they likely contain attributes, SVG, or JS code)
        unsafe_patterns = ['="', "='", 'd="', "d='", 'style=', 'onmouse',
                          'stroke-', 'fill-', 'viewBox', 'clip-rule',
                          'stroke-line', 'xmlns', '=>', '{', '}',
                          'import ', 'const ', 'let ', 'var ',
                          'export ', 'function ', 'getLang', 'useTranslations']
        
        is_unsafe = any(p in line for p in unsafe_patterns)
        
        if is_unsafe:
            new_lines.append(line)
            continue
        
        modified = line
        
        for text in sorted_texts:
            key = rev[text]
            
            # Only replace >>text<< patterns (text between HTML tags on same line)
            old = f'>{text}<'
            new = f'>{{{{t(\'{key}\')}}}}<'
            
            if old in modified:
                modified = modified.replace(old, new)
                file_count += 1
        
        new_lines.append(modified)
    
    new_content = '\n'.join(new_lines)
    
    if file_count > 0:
        with open(fp, 'w', encoding='utf-8') as f:
            f.write(new_content)
        total += file_count
        print(f'[{fname}] {file_count} replacements')
    else:
        print(f'[{fname}] 0 replacements')

print(f'\nTotal: {total} replacements')
