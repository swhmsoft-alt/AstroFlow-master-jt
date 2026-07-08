with open('src/data/titanium-standards.ts', 'r', encoding='utf-8') as f:
    c = f.read()
data_start = c.find('export const STANDARD_DATA')
i = c.find('"astm-b348"', data_start)
# Find astm-b381 to determine end of astm-b348
next_entry = c.find('"astm-b265"', data_start)
section = c[i:next_entry]
# Find whyChooseUsKey
if 'whyChooseUsKey' in section:
    pos = section.rfind('whyChooseUsKey')
    print(f'whyChooseUsKey found at offset {pos}: {repr(section[pos:pos+50])}')
else:
    print('whyChooseUsKey NOT FOUND in astm-b348 data entry')
    # Show the end of the entry
    print(f'Last 200 chars of entry:')
    print(repr(section[-200:]))
