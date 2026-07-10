#!/usr/bin/env python3
"""
refactor_v2.py — SAFE replacement of hardcoded English text with t() calls.
Strategy: Only replace text that matches >>TEXT<< pattern where the > before text
is an HTML tag close (not an attribute assignment).
"""
import json, os, shutil

BASE = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
COMP_DIR = os.path.join(BASE, 'src', 'components', 'capabilities')

# Load keys
with open(os.path.join(BASE, 'src', 'i18n', 'translations', 'en.json'), 'r', encoding='utf-8') as f:
    en = json.load(f)

# Build reverse map (longest text first for priority matching)
rev = {}
for k, v in en.items():
    if k.startswith('cap.') and len(v) > 3:
        rev.setdefault(v, k)  # Keep first (shorter key)

texts = sorted(rev.keys(), key=len, reverse=True)

# Files to process
FILES = [
    'ManufacturingPage.astro', 'EngineeringPage.astro', 'CapacityPage.astro',
    'QualityPage.astro', 'InspectionPage.astro', 'TraceabilityPage.astro',
    'CertificationsPage.astro',
]

total = 0

for fname in FILES:
    filepath = os.path.join(COMP_DIR, fname)
    if not os.path.exists(filepath):
        continue
    
    # Read file
    with open(filepath, 'r', encoding='utf-8') as f:
        lines = f.readlines()
    
    bak = filepath + '.v2bak'
    shutil.copy2(filepath, bak)
    
    new_lines = []
    file_count = 0
    
    for line in lines:
        modified = line
        
        # Skip lines that are clearly code/expressions/attributes
        # but allow lines with simple HTML tags that have text content
        
        for text in texts:
            key = rev[text]
            
            # Check for >>TEXT<< pattern on this line
            pattern = f'>{text}<'
            if pattern in modified:
                # SAFETY VERIFICATION: Check that this is content text, not attribute
                idx = modified.index(pattern)
                
                # Look backward from idx to find the character before >
                # If we find = before > without finding < before =, it's an attribute
                before = modified[max(0, idx - 100):idx]
                
                # Safe if: the last > in 'before' is NOT preceded by =
                # i.e., it's an HTML tag close, not an attribute value
                last_gt = before.rfind('>')
                last_eq = before.rfind('=')
                
                # Also find the opening <tag to verify
                last_lt = before.rfind('<')
                
                # Determine if this is content text vs attribute value
                is_safe = True
                
                if last_eq > last_gt and last_eq > last_lt:
                    # The = comes after the last > and after <tag - likely attribute
                    is_safe = False
                
                if is_safe:
                    replacement = f'>{{{{t(\'{key}\')}}}}<'
                    modified = modified.replace(pattern, replacement)
                    file_count += 1
        
        new_lines.append(modified)
    
    if file_count > 0:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.writelines(new_lines)
        total += file_count
        print(f'  [{fname}] {file_count} replacements')
    else:
        print(f'  [{fname}] 0 replacements')

print(f'\nTotal: {total} replacements')
