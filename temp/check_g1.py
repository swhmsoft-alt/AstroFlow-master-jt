with open('src/data/titanium-grades.ts','r',encoding='utf-8') as f:
    content = f.read()

data_start = content.find('export const GRADE_DATA')
g1 = content.find('"grade-1"', data_start)
g2 = content.find('"grade-2"', data_start)
section = content[g1:g2]

# Find alternativeTo section
alt_pos = section.find('alternativeTo')
alt_items = section.find('items: [', alt_pos)
# Find closing ] of this items array
alt_items_close = section.find(']', alt_items)
print(f'alternativeTo items: offset={alt_items}, close={alt_items_close}')
print(f'After items close: {repr(section[alt_items_close:alt_items_close+50])}')

# Find all ]\n    } patterns after alt_items_close
closing = section.find('}\n  },\n', alt_items_close)
print(f'\nGrade entry closing:')
if closing >= 0:
    print(f'  Found at offset {closing}')
    print(f'  Text: {repr(section[closing:closing+30])}')
else:
    print('  NOT FOUND')
