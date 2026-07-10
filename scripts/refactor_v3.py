#!/usr/bin/env python3
"""
refactor_v3.py: Handle multiline text patterns in Astro templates.
Replaces hardcoded text with t() calls, including text on separate lines from tags.
"""
import json, os, shutil

BASE = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
COMP_DIR = os.path.join(BASE, 'src', 'components', 'capabilities')

with open(os.path.join(BASE, 'src', 'i18n', 'translations', 'en.json'), 'r', encoding='utf-8') as f:
    en = json.load(f)

# Build rev map - collect ALL texts (both old and new keys)
rev = {}
for k, v in en.items():
    if k.startswith('cap.') and len(v) > 3:
        if v not in rev:
            rev[v] = k

texts = sorted(rev.keys(), key=len, reverse=True)
print(f'Loaded {len(texts)} texts')

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
    
    bak = fp + '.bak4'
    shutil.copy2(fp, bak)
    
    modified = content
    file_count = 0
    
    for text in texts:
        key = rev[text]
        replacement = '{t(\'' + key + '\')}'
        
        # Process the ENTIRE file as one string, looking for text in content positions
        # Strategy: find the text, verify it's in a safe context, replace
        
        # Check all occurrences
        occurrences = []
        start = 0
        while True:
            idx = modified.find(text, start)
            if idx == -1:
                break
            
            # Check context: what's before and after?
            before = modified[max(0, idx-5):idx]
            after = modified[idx+len(text):idx+len(text)+5]
            
            # SAFE if: preceded by > or whitespace, followed by < or whitespace
            # NOT an attribute value
            
            # Check that text is not inside an HTML attribute (between =" and ")
            # Look for =" before text (without > before =")
            before_long = modified[max(0, idx-200):idx]
            # Find the last > before idx
            last_gt = before_long.rfind('>')
            # Find the last =" before idx
            last_eq = before_long.rfind('="')
            
            # If there's an = symbol after the last >, we might be in an attribute
            in_attribute = False
            if last_eq > last_gt and last_eq > 0:
                in_attribute = True
            
            # Also check if we're in SVG content
            in_svg = False
            if 'd="' in before_long or 'd="' in after or 'stroke-' in before_long:
                in_svg = True
            
            # Check we're in HTML content context
            preceded_by_close = before.rstrip()[-1:] == '>' if before.rstrip() else False
            # Or preceded by start of line/whitespace after a > on a previous line
            preceded_by_gt = last_gt > 0
            
            followed_by_open = after.lstrip()[:1] == '<' if after.lstrip() else False
            # Or at end of string
            followed_by_eol = idx + len(text) >= len(modified) or modified[idx+len(text)] == '\n'
            
            # SAFE: text is HTML content between tags
            is_content = (preceded_by_close or (preceded_by_gt and not in_attribute)) and \
                         (followed_by_open or followed_by_eol)
            
            if is_content and not in_attribute and not in_svg:
                occurrences.append((idx, text))
                start = idx + len(text)
            else:
                start = idx + 1
        
        # Replace from right to left to preserve positions
        for idx, t in reversed(occurrences):
            modified = modified[:idx] + replacement + modified[idx+len(t):]
            file_count += 1
    
    if file_count > 0:
        with open(fp, 'w', encoding='utf-8') as f:
            f.write(modified)
        total += file_count
        print(f'  [{fname}] {file_count} replacements')
    else:
        print(f'  [{fname}] 0 replacements')

print(f'\nTotal: {total} replacements')
