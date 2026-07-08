import re
with open('src/data/titanium-standards.ts','r',encoding='utf-8') as f:
    c = f.read()
d = c.find('export const STANDARD_DATA')

entries = re.findall(r'"([\w-]+)":\s*\{', c[d:])
entries = [e for e in entries if e.startswith(('astm-','ams-','iso-','mil-'))]

for e in entries:
    i = c.find(f'"{e}"', d)
    j = c.find('\n  "', i+len(e)+5)
    section = c[i:j]
    name = re.search(r'name:\s*"([^"]+)"', section)
    badge = re.search(r'badge:\s*"([^"]+)"', section)
    subtitle = re.search(r'subtitle:\s*"([^"]+)"', section)
    if name and badge:
        print(f'{e}:')
        print(f'  badge: {badge.group(1)}')
        print(f'  name: {name.group(1)}')
        if subtitle:
            print(f'  subtitle: {subtitle.group(1)[:60]}...')
        print()
