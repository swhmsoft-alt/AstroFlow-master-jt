"""Patch engine.py to use category-based fallback when process matching fails."""
import re

filepath = __file__.replace('patch_engine.py', 'engine.py')
with open(filepath, encoding='utf-8') as f:
    code = f.read()

# Replace the compose function's process lookup to use category fallback better
old = '''    # 1. Lookup PROCESS
    process_entry, matched_process = find_process_entry(lower)
    if not process_entry:
        process_entry = {"specs": {}, "processDescription": "", "heatControl": "",
                        "flatnessControl": "", "comparison": [], "holeTypes": [],
                        "downstreamBase": [], "inspectionBase": [], "qualityBase": []}'''

new = '''    # 1. Lookup PROCESS (try title first, fall back to category)
    process_entry, matched_process = find_process_entry(lower)
    # If fell through to generic, try matching by category
    if matched_process == 'general fabrication':
        cat_lower = category.lower()
        cat_to_key = {
            "inspection": "cmm inspection",
            "inspect": "cmm inspection",
            "testing": "cmm inspection",
            "test": "cmm inspection",
            "surface treatment": "anodizing",
            "coating": "anodizing",
            "pvd": "anodizing",
            "dlc": "anodizing",
            "machining": "5-axis cnc milling",
            "forming": "bend forming",
            "forging": "closed-die forging",
            "welding": "tig welding",
            "heat treatment": "vacuum heat treatment",
            "fastener": "thread rolling",
            "additive": "slm 3d printing",
            "edm": "wire edm",
            "laser processing": "laser cutting",
            "general manufacturing": "general fabrication",
        }
        for kw, lookup_key in cat_to_key.items():
            if kw in cat_lower:
                from process_dictionary import PROCESS_DICT
                if lookup_key in PROCESS_DICT:
                    process_entry = PROCESS_DICT[lookup_key]
                    matched_process = lookup_key
                    break
    if not process_entry:
        process_entry = {"specs": {}, "processDescription": "", "heatControl": "",
                        "flatnessControl": "", "comparison": [], "holeTypes": [],
                        "downstreamBase": [], "inspectionBase": [], "qualityBase": []}'''

if old in code:
    code = code.replace(old, new)
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(code)
    print("Patched engine.py with category fallback")
else:
    print("ERROR: Could not find target code")
    # Debug: show context
    idx = code.find('# 1. Lookup PROCESS')
    if idx >= 0:
        print(code[idx:idx+500])
