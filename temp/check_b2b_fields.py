with open('src/data/titanium-standards.ts', 'r', encoding='utf-8') as f:
    content = f.read()

entries = ['astm-b348','astm-b265','astm-b381','astm-b338','astm-b861','astm-f67','astm-f136','astm-f86','astm-f2924','astm-f3001','ams-4911','ams-4928','ams-4943','ams-4944','ams-2488','iso-5832-3','iso-5832-11','mil-t-9047']

missing = []
for e in entries:
    idx = content.find(f'"{e}"')
    if idx == -1:
        print(f'{e}: NOT FOUND')
        continue
    snippet = content[idx:idx+2000]
    has_sg = 'supportedGrades:' in snippet
    if has_sg:
        print(f'{e}: OK')
    else:
        print(f'{e}: MISSING B2B FIELDS')
        missing.append(e)

print(f'\nTotal OK: {len(entries) - len(missing)}')
if missing:
    print(f'Missing entries: {missing}')
