import re
with open('src/data/titanium-standards.ts','r',encoding='utf-8') as f:
    c = f.read()
d = c.find('export const STANDARD_DATA')

# Find each entry and extract industries
entries = ['astm-b348','astm-b265','astm-f67','astm-f2924','ams-4911']
for e in entries:
    i = c.find(f'"{e}"', d)
    if i < 0: continue
    j = c.find('\n  "', i+len(e)+3)
    section = c[i:j]
    m = re.search(r'industries: \[([^\]]+)\]', section)
    if m:
        print(f'{e}: {m.group(1)[:80]}...')
