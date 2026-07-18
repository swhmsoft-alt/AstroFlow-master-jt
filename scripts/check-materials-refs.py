import json, glob
mats = set()
for f in glob.glob('src/content/product-entities/*.json'):
    d = json.load(open(f, 'r', encoding='utf-8'))
    m = d.get('material', '')
    if m:
        mat = m.replace('\u00a0', ' ').strip()
        mats.add(mat)
for m in sorted(mats):
    print(m)
