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
    
    # Find the closing of this entry (next entry or end)
    remaining = content[pos+len(marker)+5:]
    next_match = re.search(r'"[\w-]+":\s*\{', remaining)
    if next_match:
        entry_len = next_match.start()
    else:
        entry_len = len(remaining)
    
    section = remaining[:entry_len]
    
    why_pos = section.find('whyChooseUs: ')
    if why_pos == -1:
        print(f'{entry_key}: whyChooseUs not found')
        continue
    
    # Check if whyChooseUsKey already exists within 200 chars before whyChooseUs
    before_section = section[max(0, why_pos-200):why_pos]
    if 'whyChooseUsKey:' in before_section:
        print(f'{entry_key}: already has key')
        continue
    
    # Insert whyChooseUsKey before whyChooseUs
    abs_pos = pos + len(marker) + 5 + why_pos
    before = content[:abs_pos]
    after = content[abs_pos:]
    
    content = before + f'whyChooseUsKey: "{cat}",\n    ' + after
    count += 1
    print(f'{entry_key}: added whyChooseUsKey="{cat}"')

with open('src/data/titanium-standards.ts', 'w', encoding='utf-8') as f:
    f.write(content)
print(f'\nDone: {count} entries updated')
