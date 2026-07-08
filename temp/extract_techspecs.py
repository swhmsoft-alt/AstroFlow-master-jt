import re
with open('src/data/titanium-standards.ts','r',encoding='utf-8') as f:
    c = f.read()
d = c.find('export const STANDARD_DATA')

entries = ['astm-b348','astm-b265','astm-f67','astm-f2924','ams-4911','ams-4943']
seen_labels = {}
for e in entries:
    i = c.find(f'"{e}"', d)
    j = c.find('\n  "', i+len(e)+3)
    section = c[i:j]
    m = re.search(r'technicalProperties: \[([^\]]+)\]', section)
    if m:
        props = re.findall(r'label:\s*"([^"]+)"', m.group(1))
        vals = re.findall(r'value:\s*"([^"]+)"', m.group(1))
        print(f'{e}:')
        for idx, (lab, val) in enumerate(zip(props, vals)):
            key = f'{e}.{idx}'
            if lab not in seen_labels:
                seen_labels[lab] = val
            print(f'  [{idx}] {lab} = {val[:30]}')
        print()
