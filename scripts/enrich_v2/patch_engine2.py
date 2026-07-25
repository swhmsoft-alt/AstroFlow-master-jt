"""Second attempt: patch engine.py with category fallback for compose()."""
import re

filepath = __file__.replace('patch_engine2.py', 'engine.py')
with open(filepath, encoding='utf-8') as f:
    code = f.read()

# Find the compose function - look for the process lookup section
target = """    # 1. Lookup PROCESS (try title first, fall back to category)
    process_entry, matched_process = find_process_entry(lower)
    # If fell through to generic, try matching by category"""

if target in code:
    print("Patch already applied, skipping")
else:
    # Find the original lookup code
    old = """    # 1. Lookup PROCESS
    process_entry, matched_process = find_process_entry(lower)
    if not process_entry:"""
    
    if old in code:
        print("Found original code, patching...")
        # Build the new code block
        new = """    # 1. Lookup PROCESS (try title first, fall back to category)
    process_entry, matched_process = find_process_entry(lower)
    # If fell through to generic, try matching by category
    if matched_process == 'general fabrication':
        cat_keywords = {
            "inspection": "cmm inspection", "inspect": "cmm inspection",
            "testing": "cmm inspection", "test": "cmm inspection",
            "surface treatment": "anodizing", "surface": "anodizing",
            "coating": "anodizing", "pvd": "anodizing", "dlc": "anodizing",
            "electropolish": "anodizing", "polish": "anodizing",
            "machining": "5-axis cnc milling",
            "forming": "bend forming", "stamp": "bend forming",
            "forging": "closed-die forging", "forg": "closed-die forging",
            "welding": "tig welding", "weld": "tig welding",
            "heat treatment": "vacuum heat treatment", "anneal": "vacuum heat treatment",
            "heat treat": "vacuum heat treatment",
            "fastener": "thread rolling", "fasten": "thread rolling",
            "additive": "slm 3d printing",
            "edm": "wire edm", "laser": "laser cutting",
            "waterjet": "waterjet cutting", "water jet": "waterjet cutting",
            "general manufacturing": "general fabrication",
        }
        for kw, lookup_key in cat_keywords.items():
            if kw in category.lower() or kw in lower:
                if lookup_key in PROCESS_DICT:
                    process_entry = PROCESS_DICT[lookup_key]
                    matched_process = lookup_key
                    break
    if not process_entry:"""
        
        code = code.replace(old, new)
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(code)
        print("Patch applied successfully")
    else:
        print("Could not find original code. Checking what's there...")
        idx = code.find('# 1. Lookup PROCESS')
        if idx >= 0:
            print(repr(code[idx:idx+300]))
