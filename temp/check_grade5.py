with open('src/data/titanium-grades.ts','r',encoding='utf-8') as f:
    content = f.read()

data_start = content.find('export const GRADE_DATA')
g5 = content.find('"grade-5"', data_start)
g6 = content.find('"grade-6"', data_start)
print(f'Grade 5 at pos {g5}, Grade 6 at pos {g6}')
section = content[g5:g6]
print(f'Section: {len(section)} chars')
print(f'Has faqs: {"faqs" in section}')
print(f'Has whyChooseUs: {"whyChooseUs" in section}')
last200 = section[-200:]
print(f'Last 200 chars: {repr(last200)}')
