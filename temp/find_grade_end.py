import sys
grade = sys.argv[1] if len(sys.argv) > 1 else "grade-23"

with open('src/data/titanium-grades.ts','r',encoding='utf-8') as f:
    content = f.read()

data_start = content.find('export const GRADE_DATA')
g = content.find(f'"{grade}"', data_start)

# Build list of all grade keys in order
import re
all_keys = re.findall(r'"grade-[\w-]+"', content[data_start:])
# Remove duplicates while preserving order
seen = set()
ordered = []
for k in all_keys:
    if k not in seen:
        seen.add(k)
        ordered.append(k)

print(f'Grade keys in order: {ordered}')

# Find current and next
current_idx = ordered.index(f'"{grade}"')
current_key = ordered[current_idx]
next_key = ordered[current_idx + 1] if current_idx + 1 < len(ordered) else None

g_start = content.find(current_key, data_start)
g_end = content.find(next_key, data_start) if next_key else content.rfind('};', g_start) + 2

section = content[g_start:g_end]
print(f'{grade}: starts at {g_start}, next ({next_key}) at {g_end}')
print(f'Section size: {len(section)} chars')

# Find the last items array to find where to insert
last_items = section.rfind('items: [')
last_items_close = section.rfind(']', last_items)
print(f'Last items array closes at offset {last_items_close}')
after_items = section[last_items_close:last_items_close+50]
print(f'After items: {repr(after_items)}')
