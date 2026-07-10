#!/usr/bin/env python3
"""Safe refactoring: Replace hardcoded text in Astro templates with t() calls.
Only replaces text between HTML tags (>text<), never in attributes or JSX expressions."""
import json, os, re, shutil

BASE = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
COMP_DIR = os.path.join(BASE, 'src', 'components', 'capabilities')
BACKUP_DIR = os.path.join(BASE, 'backup_capabilities')

# Load capability keys
with open(os.path.join(BASE, 'src', 'i18n', 'translations', 'en.json'), 'r', encoding='utf-8') as f:
    en = json.load(f)

# Build text→key map, sorted by text length descending (longest first)
text_to_key = {}
for k, v in en.items():
    if k.startswith('cap.') and len(v) > 3:
        if v not in text_to_key or len(k) < len(text_to_key[v]):
            text_to_key[v] = k

sorted_texts = sorted(text_to_key.keys(), key=len, reverse=True)
print(f"Loaded {len(sorted_texts)} texts to replace")

FILES = [
    'ManufacturingPage.astro',
    'EngineeringPage.astro',
    'CapacityPage.astro',
    'QualityPage.astro',
    'InspectionPage.astro',
    'TraceabilityPage.astro',
    'CertificationsPage.astro',
]

total_replaced = 0

for fname in FILES:
    filepath = os.path.join(COMP_DIR, fname)
    if not os.path.exists(filepath):
        continue
    
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Backup
    bak = os.path.join(BACKUP_DIR, fname.replace('.astro', '.safe.bak'))
    shutil.copy2(filepath, bak)
    
    # Split into lines
    lines = content.split('\n')
    modified_lines = []
    file_replaced = 0
    
    for line_num, line in enumerate(lines):
        modified = line
        
        # Skip lines that are:
        # - SVG content (contain d=", path, stroke-)
        # - Inside frontmatter (--- sections)
        # - JSX expressions (contain {t(, or other expression patterns)
        # - Attribute assignments (href=", class=", style=", etc.)
        
        stripped = line.strip()
        
        # Skip SVG-heavy lines
        if ('d="M' in stripped or 'd="m' in stripped or 'stroke-' in stripped or 
            'fill-' in stripped or 'clip-rule' in stripped or 'viewBox' in stripped or
            'stroke-linecap' in stripped or 'stroke-width' in stripped or
            'stroke-linejoin' in stripped):
            modified_lines.append(line)
            continue
        
        # Skip frontmatter
        if stripped == '---':
            modified_lines.append(line)
            continue
        
        # Find text between HTML tags: >text<
        # Only replace text that appears as direct content between tags
        for text in sorted_texts:
            key = text_to_key[text]
            replacement = f'{{{{t(\'{key}\')}}}}'
            
            # Only replace >text< patterns (text between HTML tags)
            # This avoids attribute values, JSX, etc.
            pattern_gt_lt = f'>{re.escape(text)}<'
            
            if pattern_gt_lt in modified:
                # Verify this is content text, not inside an attribute
                # by checking context around the match
                modified = modified.replace(pattern_gt_lt, f'>{replacement}<')
                file_replaced += 1
        
        modified_lines.append(modified)
    
    new_content = '\n'.join(modified_lines)
    
    if file_replaced > 0:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(new_content)
        total_replaced += file_replaced
        print(f'[{fname}] {file_replaced} replacements')
    else:
        print(f'[{fname}] no changes')

print(f'\nTotal: {total_replaced} replacements across all files')
