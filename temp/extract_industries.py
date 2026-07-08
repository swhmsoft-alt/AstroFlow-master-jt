import re
with open('src/data/titanium-standards.ts','r',encoding='utf-8') as f:
    c = f.read()

d = c.find('export const STANDARD_DATA')

# Find all industries arrays
industries_all = re.findall(r'industries: \[([^\]]+)\]', c[d:])
all_vals = set()
for arr in industries_all:
    vals = re.findall(r'"([^"]+)"', arr)
    for v in vals:
        all_vals.add(v)

print(f'Total unique industry strings: {len(all_vals)}')
for v in sorted(all_vals):
    print(f'  - {v}')
