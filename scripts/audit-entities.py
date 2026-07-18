"""
Entity Audit Script
Validates all 260 Product Entities and generates an audit report.
"""
import json, glob, os, re

ENT_DIR = 'src/content/product-entities'
SYSTEM_DIR = 'src/content/systems'

# Load all systems for validation
systems = {}
for f in glob.glob(os.path.join(SYSTEM_DIR, '*.json')):
    with open(f, 'r', encoding='utf-8') as fh:
        d = json.load(fh)
    systems[d['title']] = d

entities = []
for f in sorted(glob.glob(os.path.join(ENT_DIR, '*.json'))):
    with open(f, 'r', encoding='utf-8') as fh:
        d = json.load(fh)
    entities.append((os.path.basename(f), d))

print(f"=== Product Entity Audit Report ===")
print(f"Total entities: {len(entities)}")
print()

# ─── Check 1: Naming consistency ───
print("## 1. Name Audit")
issues = []
for fname, d in entities:
    title = d.get('title', '')
    # Check title format
    if not title.startswith('Titanium '):
        issues.append(f"{fname}: Title should start with 'Titanium' - '{title}'")
    # Check for overly generic names
    generic = ['Fastener', 'Component', 'Part', 'Hardware', 'Piece']
    title_lower = title.lower()
    if title == 'Titanium ' + d.get('category', '') or len(title.split()) < 3:
        issues.append(f"{fname}: Potentially generic name - '{title}'")
    
    # Check slug vs title
    expected_slug = title.lower().replace(' ', '-').replace('/', '-').replace(',', '').replace('(', '').replace(')', '').strip('-')
    expected_slug = re.sub(r'[^a-z0-9-]', '', expected_slug)
    if fname != f"{expected_slug}.json":
        issues.append(f"{fname}: Slug mismatch - expected '{expected_slug}.json'")

for i in issues[:20]:
    print(f"  ⚠ {i}")
if len(issues) > 20:
    print(f"  ... and {len(issues) - 20} more issues")
print(f"  Total naming issues: {len(issues)}")

# ─── Check 2: Required fields ───
print()
print("## 2. Required Fields Audit")
missing_fields = []
required = ['title', 'industry', 'system', 'category', 'function', 'material', 'alloyReason', 'process', 'inspection']
for fname, d in entities:
    for field in required:
        val = d.get(field)
        if not val or (isinstance(val, list) and len(val) == 0):
            missing_fields.append(f"{fname}: missing/empty '{field}'")

for m in missing_fields[:20]:
    print(f"  ❌ {m}")
if len(missing_fields) > 20:
    print(f"  ... and {len(missing_fields) - 20} more")
print(f"  Total field issues: {len(missing_fields)}")

# ─── Check 3: System validation ───
print()
print("## 3. System Reference Audit")
sys_issues = []
for fname, d in entities:
    sys_name = d.get('system', '')
    if sys_name not in systems:
        sys_issues.append(f"{fname}: references unknown system '{sys_name}'")

for s in sys_issues[:10]:
    print(f"  ❌ {s}")
if not sys_issues:
    print("  ✅ All systems are valid")
print(f"  Total: {len(sys_issues)}")

# ─── Check 4: FAQ coverage ───
print()
print("## 4. FAQ Coverage")
faq_count = 0
for fname, d in entities:
    faq = d.get('faq', [])
    if faq and len(faq) > 0:
        faq_count += 1
        
print(f"  Entities WITH FAQ: {faq_count}/{len(entities)}")
print(f"  Entities WITHOUT FAQ: {len(entities) - faq_count}/{len(entities)}")

# ─── Check 5: Common Failures ───
print()
print("## 5. Common Failures Coverage")
fail_count = 0
for fname, d in entities:
    cf = d.get('commonFailures', [])
    if cf and len(cf) > 0:
        fail_count += 1
print(f"  With failures: {fail_count}/{len(entities)}")
print(f"  Without failures: {len(entities) - fail_count}/{len(entities)}")

# ─── Check 6: Aliases ───
print()
print("## 6. Aliases Coverage")
alias_count = sum(1 for _, d in entities if d.get('aliases'))
print(f"  With aliases: {alias_count}/{len(entities)}")

# ─── Check 7: Duplicates ───
print()
print("## 7. Duplicate Check")
titles = [d['title'] for _, d in entities]
from collections import Counter
dupes = {t: c for t, c in Counter(titles).items() if c > 1}
if dupes:
    for t, c in dupes.items():
        print(f"  ❌ '{t}' appears {c} times")
else:
    print("  ✅ No duplicate titles")

# ─── Summary ───
print()
print("=== Summary ===")
print(f"Total Entities: {len(entities)}")
print(f"Systems Referenced: 45")
print(f"Industries Covered: {len(set(d['industry'] for _, d in entities))}")
print(f"Avg Process per Entity: {sum(len(d.get('process',[])) for _, d in entities) // max(len(entities),1)}")
print(f"FAQ Completion: {faq_count}/{len(entities)} ({(faq_count/len(entities)*100):.1f}%)")

# Save report
with open('scripts/audit-report.txt', 'w', encoding='utf-8') as f:
    f.write(f"Total: {len(entities)}\n")
    f.write(f"FAQ: {faq_count}/{len(entities)}\n")
    f.write(f"Naming issues: {len(issues)}\n")
    f.write(f"Field issues: {len(missing_fields)}\n")
print("\nReport saved to scripts/audit-report.txt")
