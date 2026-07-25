"""Quick quality check after re-enrichment."""
import json, glob, os

caps_dir = os.path.join(os.path.dirname(__file__), '..', '..', 'src', 'content', 'capabilities')
files = sorted(glob.glob(os.path.join(caps_dir, '*.json')))

# Count generic fallbacks
generic = 0
waterjet_ok = False
for f in files:
    d = json.load(open(f, encoding='utf-8'))
    pc = d.get('processComparison', [])
    if len(pc) <= 1:
        generic += 1
    # Check specific files
    if 'waterjet-cutting' in f:
        pd = d.get('processDescription', '')
        waterjet_ok = 'abrasive' in pd.lower() or 'water' in pd.lower() and 'HAZ' in pd
        print(f"waterjet-cutting: PD={pd[:100]}...")
        print(f"  tolerance={d.get('tolerance')}, PC rows={len(pc)}")

for f in files:
    d = json.load(open(f, encoding='utf-8'))
    if 'charpy-impact' in f:
        print(f"charpy: PD={d.get('processDescription','')[:80]}...")
        print(f"  category={d.get('category')}, PC rows={len(d.get('processComparison',[]))}")
        break

print(f"\nTotal: {len(files)}, Generic (<=1 PC row): {generic}")
print(f"Waterjet OK: {waterjet_ok}")
