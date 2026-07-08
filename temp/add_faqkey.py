import re

# Each entry's faqCategoryKey = same as whyChooseUsKey
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
    c = f.read()

d = c.find('export const STANDARD_DATA')
count = 0
for key, cat in mapping.items():
    m = key
    pos = c.find(f'"{m}"', d)
    if pos == -1:
        print(f'{m}: NOT FOUND')
        continue
    
    section = c[pos:pos+5000]
    # Find whyChooseUsKey (should be there now)
    wkey = section.find('whyChooseUsKey:')
    if wkey == -1:
        print(f'{m}: whyChooseUsKey not found')
        continue
    
    # Check if faqCategoryKey already exists
    after_wkey = section[wkey:wkey+200]
    if 'faqCategoryKey:' in after_wkey:
        print(f'{m}: already has faqCategoryKey')
        continue
    
    # Insert faqCategoryKey after whyChooseUsKey line
    line_end = section.find('\n', wkey)
    abs_pos = pos + line_end + 1
    before = c[:abs_pos]
    after = c[abs_pos:]
    c = before + f'  faqCategoryKey: "{cat}",\n    ' + after
    count += 1
    print(f'{m}: added faqCategoryKey="{cat}"')

with open('src/data/titanium-standards.ts', 'w', encoding='utf-8') as f:
    f.write(c)
print(f'Done: {count} entries')
