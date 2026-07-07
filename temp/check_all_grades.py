import re
with open('src/data/titanium-grades.ts','r',encoding='utf-8') as f:
    content = f.read()

data_start = content.find('export const GRADE_DATA')
data = content[data_start:]

# Find all unique grade keys in data section only
pattern = r'"(grade-[\w-]+)"\s*:\s*\{'
matches = re.finditer(pattern, data)
keys = []
for m in matches:
    k = m.group(1)
    if k not in keys:
        keys.append(k)

print(f'Grade keys in data section ({len(keys)}):')
for i, k in enumerate(keys):
    pos = data_start + data.find(f'"{k}"')
    # Find end position
    if i + 1 < len(keys):
        next_key = keys[i + 1]
        next_pos = data_start + data.find(f'"{next_key}"')
    else:
        next_pos = len(content)
    
    section = data[data.find(f'"{k}"'):data.find(f'"{next_key}"') if i + 1 < len(keys) else len(data)]
    has = 'faqs' in section
    print(f'  {k}: faqs={has}')
