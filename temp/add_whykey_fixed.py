import re

mapping = {
    'astm-b348': 'astm', 'astm-b265': 'astm', 'astm-b381': 'astm',
    'astm-b338': 'astm', 'astm-b861': 'astm',
    'astm-f67': 'medical', 'astm-f136': 'medical', 'astm-f86': 'medical',
    'iso-5832-3': 'medical', 'iso-5832-11': 'medical',
    'astm-f2924': 'additive', 'astm-f3001': 'additive',
    'ams-4911': 'ams', 'ams-4928': 'ams', 'ams-4943': 'ams',
    'ams-4944': 'ams', 'ams-2488': 'ams', 'mil-t-9047': 'ams',
}

with open('src/data/titanium-standards.ts', 'r', encoding='utf-8') as f:
    content = f.read()

count = 0
for entry_key, cat in mapping.items():
    marker = f'"{entry_key}"'
    pos = content.find(marker)
    if pos == -1:
        print(f'{entry_key}: NOT FOUND')
        continue
    
    # Find whyChooseUs: line (far into the entry) - search up to 20000 chars
    why_pos = content.find('whyChooseUs:', pos, pos+30000)
    if why_pos == -1:
        print(f'{entry_key}: whyChooseUs: not found')
        continue
    
    # Check if whyChooseUsKey exists between entry start and whyChooseUs
    between = content[pos:why_pos]
    if 'whyChooseUsKey:' in between:
        print(f'{entry_key}: already has key')
        continue
    
    # Find the last comma/newline before whyChooseUs: to insert
    # Insert right before the whyChooseUs: line
    before = content[:why_pos]
    after = content[why_pos:]
    content = before + f'  whyChooseUsKey: "{cat}",\n    ' + after
    count += 1
    print(f'{entry_key}: added whyChooseUsKey="{cat}"')

with open('src/data/titanium-standards.ts', 'w', encoding='utf-8') as f:
    f.write(content)
print(f'\nDone: {count} entries updated')
