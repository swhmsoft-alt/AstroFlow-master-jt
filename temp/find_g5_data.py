with open('src/data/titanium-grades.ts','r',encoding='utf-8') as f:
    content = f.read()

# Find the data section
data_start = content.find('export const GRADE_DATA')
g5_positions = []
pos = 0
while True:
    pos = content.find('"grade-5"', pos)
    if pos == -1:
        break
    g5_positions.append(pos)
    pos += 1

print(f'Found {len(g5_positions)} occurrences:')
for p in g5_positions:
    context = content[p-30:p+30]
    print(f'  Pos {p}: ...{repr(context)}...')

# Find grade-6 in data section
g6 = content.find('"grade-6"', data_start)
g5_data = content.find('"grade-5"', data_start)
print(f'\nGrade-5 in data at pos {g5_data}')
print(f'Grade-6 in data at pos {g6}')
print(f'Grade-5 section size: {g6 - g5_data}')
print(f'Last 150 chars of grade-5: {repr(content[g6-150:g6])}')
