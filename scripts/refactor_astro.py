#!/usr/bin/env python3
"""
refactor_astro.py — Replace hardcoded English text in 7 .astro component files with t() calls.
"""
import json, os, re, sys

BASE = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
COMP_DIR = os.path.join(BASE, 'src', 'components', 'capabilities')
BACKUP_DIR = os.path.join(BASE, 'backup_capabilities')

os.makedirs(BACKUP_DIR, exist_ok=True)

# ── Load keys from en.json ──
with open(os.path.join(BASE, 'src', 'i18n', 'translations', 'en.json'), 'r', encoding='utf-8') as f:
    en = json.load(f)

# Filter capability keys and build reverse map
text_to_key = {}
for key, text in en.items():
    if key.startswith('cap.') and len(text) > 3:
        # Only add if text is unique (prefer longer match)
        if text not in text_to_key or len(key) < len(text_to_key[text]):
            text_to_key[text] = key

print(f"Loaded {len(text_to_key)} text→key mappings")

# Files to process
files = [
    'ManufacturingPage.astro',
    'EngineeringPage.astro',
    'CapacityPage.astro',
    'QualityPage.astro',
    'InspectionPage.astro',
    'TraceabilityPage.astro',
    'CertificationsPage.astro',
]

total_replacements = 0

for fname in files:
    filepath = os.path.join(COMP_DIR, fname)
    if not os.path.exists(filepath):
        print(f"[SKIP] {fname} not found")
        continue
    
    # Backup
    bak_path = os.path.join(BACKUP_DIR, fname.replace('.astro', '.astro.bak'))
    import shutil
    shutil.copy2(filepath, bak_path)
    
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Check if already refactored (has t() calls)
    if '{t(' in content:
        print(f"[SKIP] {fname} already refactored")
        continue
    
    original = content
    replacements = 0
    
    # Process sorted by text length (longest first) to avoid partial replacements
    for text in sorted(text_to_key.keys(), key=len, reverse=True):
        key = text_to_key[text]
        # Replace >text< with >{t('key')}< 
        # and text</ with {t('key')}</
        # Be careful with special characters
        
        # Method: Find exact text in HTML context
        # Pattern 1: >text<
        pattern1 = f'>{re.escape(text)}<'
        replacement1 = f'>{{{{t(\'{key}\')}}}}<'
        
        # Pattern 2: text</ (when text immediately precedes closing tag)
        pattern2 = f'{re.escape(text)}<'
        replacement2 = f'{{{{t(\'{key}\')}}}}<'
        
        # Count occurrences (limit to avoid over-replacement)
        count = content.count(f'>{text}<') + content.count(f'{text}<')
        
        if count > 0:
            # Do replacement
            old_content = content
            content = content.replace(f'>{text}<', f'>{{{{t(\'{key}\')}}}}<')
            content = content.replace(f'{text}<', f'{{{{t(\'{key}\')}}}}<', count - (content.count(f'>{text}<') if False else 0))
            
            # Count actual changes
            changes = sum(1 for a, b in zip(old_content, content) if a != b) // len(key)
            if changes > 0:
                replacements += count
                if count > 0 and False:  # debug toggle
                    print(f'  Replace \"{text[:50]}...\" -> t(\'{key}\') [{count}x]')
    
    if replacements > 0:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)
        total_replacements += replacements
        print(f'[{fname}] {replacements} replacements made')
    else:
        print(f'[{fname}] NO REPLACEMENTS - check text matching')

print(f'\nTotal: {total_replacements} replacements across {len(files)} files')
