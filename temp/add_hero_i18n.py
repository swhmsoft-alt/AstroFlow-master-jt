import json, os, re
from collections import OrderedDict

td = 'src/i18n/translations'
with open('src/data/titanium-standards.ts','r',encoding='utf-8') as f:
    c = f.read()
d = c.find('export const STANDARD_DATA')

entries = re.findall(r'"([\w-]+)":\s*\{', c[d:])
entries = [e for e in entries if e.startswith(('astm-','ams-','iso-','mil-'))]

keys = OrderedDict()
for e in entries:
    i = c.find(f'"{e}"', d)
    j = c.find('\n  "', i+len(e)+5)
    section = c[i:j]
    
    badge_m = re.search(r'badge:\s*"([^"]+)"', section)
    if badge_m:
        badge_key = 'materials.standards.badges.' + e
        keys[badge_key] = badge_m.group(1)
    
    subtitle_m = re.search(r'subtitle:\s*"([^"]+)"', section)
    if subtitle_m:
        sub_key = 'materials.standards.subtitles.' + e
        keys[sub_key] = subtitle_m.group(1)

print(f'Total hero keys: {len(keys)}')

# Add to en.json
fp = os.path.join(td, 'en.json')
with open(fp, 'r', encoding='utf-8') as f:
    en = json.load(f)
en.update(keys)
with open(fp, 'w', encoding='utf-8') as f:
    json.dump(en, f, ensure_ascii=False, indent=2)
print('Added to en.json')

# Add to all language files
for fname in ['de.json','ja.json','fr.json','es.json','pt.json','it.json','ko.json','nl.json','pl.json']:
    fp = os.path.join(td, fname)
    data = json.load(open(fp, 'r', encoding='utf-8'))
    for k in keys:
        if k not in data:
            data[k] = keys[k]
    json.dump(data, open(fp, 'w', encoding='utf-8'), ensure_ascii=False, indent=2)
    print(f'{fname}: added keys')
print('Done!')
