import re
with open('src/data/titanium-standards.ts','r',encoding='utf-8') as f:
    c = f.read()
d = c.find('export const STANDARD_DATA')
i = c.find('"astm-b348"', d)
j = c.find('"astm-b265"', d)
section = c[i:j]
m = re.search(r'industries: \[([^\]]+)\]', section)
if m:
    vals = re.findall(r'"([^"]+)"', m.group(1))
    for v in vals:
        print(f'Industry: {v}')
