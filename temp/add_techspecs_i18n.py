import json, os, re

td = 'src/i18n/translations'

with open('src/data/titanium-standards.ts','r',encoding='utf-8') as f:
    c = f.read()
d = c.find('export const STANDARD_DATA')

# Category mapping
cat_map = {'astm-b348':'astm','astm-b265':'astm','astm-b381':'astm','astm-b338':'astm','astm-b861':'astm',
           'astm-f67':'medical','astm-f136':'medical','astm-f86':'medical','iso-5832-3':'medical','iso-5832-11':'medical',
           'astm-f2924':'additive','astm-f3001':'additive',
           'ams-4911':'ams','ams-4928':'ams','ams-4943':'ams','ams-4944':'ams','ams-2488':'ams','mil-t-9047':'ams'}

# Get one sample entry per category
samples = {}
for e, cat in cat_map.items():
    if cat not in samples:
        samples[cat] = e

keys = {}
for cat, sample in samples.items():
    i = c.find(f'"{sample}"', d)
    j = c.find('\n  "', i+len(sample)+5)
    section = c[i:j]
    import re
    m = re.search(r'technicalProperties: \[(.+?)\]', section, re.DOTALL)
    if m:
        props = re.findall(r'label:\s*"([^"]+)"', m.group(1))
        vals = re.findall(r'value:\s*"([^"]+)"', m.group(1))
        for idx, (lab, val) in enumerate(zip(props, vals)):
            keys[f'materials.techspecs.{cat}.label.{idx}'] = lab
            keys[f'materials.techspecs.{cat}.value.{idx}'] = val

print(f'Total techspec keys: {len(keys)}')

# Add to en.json
fp = os.path.join(td, 'en.json')
with open(fp, 'r', encoding='utf-8') as f:
    en = json.load(f)
en.update(keys)
with open(fp, 'w', encoding='utf-8') as f:
    json.dump(en, f, ensure_ascii=False, indent=2)
print('Added to en.json')

# Add keys to all language files
for fname in ['de.json','ja.json','fr.json','es.json','pt.json','it.json','ko.json','nl.json','pl.json']:
    fp = os.path.join(td, fname)
    data = json.load(open(fp, 'r', encoding='utf-8'))
    for k in keys:
        if k not in data:
            data[k] = keys[k]
    json.dump(data, open(fp, 'w', encoding='utf-8'), ensure_ascii=False, indent=2)
    print(f'{fname}: added keys')
print('Done!')
