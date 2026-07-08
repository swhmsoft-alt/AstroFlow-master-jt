import json, os, re

td = 'src/i18n/translations'

# Extract all unique industry strings
with open('src/data/titanium-standards.ts','r',encoding='utf-8') as f:
    c = f.read()
d = c.find('export const STANDARD_DATA')
all_vals = set()
for m in re.finditer(r'industries: \[([^\]]+)\]', c[d:]):
    for v in re.finditer(r'"([^"]+)"', m.group(1)):
        all_vals.add(v.group(1))

# Create keys: materials.industries.{slug}
def slugify(s):
    return s.lower().replace(' & ', '_').replace(' ', '_').replace('-', '_')

keys = {}
for v in sorted(all_vals):
    key = 'materials.industries.' + slugify(v)
    keys[key] = v

print(f'Total unique industries: {len(keys)}')

# Add to en.json
fp = os.path.join(td, 'en.json')
with open(fp, 'r', encoding='utf-8') as f:
    en = json.load(f)
en.update(keys)
with open(fp, 'w', encoding='utf-8') as f:
    json.dump(en, f, ensure_ascii=False, indent=2)
print(f'Added to en.json')

# Add keys to all other languages (English placeholder)
for fname in ['de.json','ja.json','fr.json','es.json','pt.json','it.json','ko.json','nl.json','pl.json']:
    fp = os.path.join(td, fname)
    data = json.load(open(fp, 'r', encoding='utf-8'))
    for k in keys:
        if k not in data:
            data[k] = keys[k]
    json.dump(data, open(fp, 'w', encoding='utf-8'), ensure_ascii=False, indent=2)
    print(f'{fname}: added keys')
print('Done!')
