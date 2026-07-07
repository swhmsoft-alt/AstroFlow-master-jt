with open('src/data/titanium-grades.ts', 'r', encoding='utf-8') as f:
    content = f.read()

g5_marker = '"grade-5"'
g6_marker = '"grade-6"'

g5 = content.find(g5_marker)
g6 = content.find(g6_marker)

print(f'Grade 5 starts at char {g5}')
print(f'Grade 6 starts at char {g6}')

# Find the closing of grade-5 entry
snippet = content[g5:g6]
print(f'Grade 5 section length: {len(snippet)} chars')

# Find the last items array in alternativeTo
last_items_start = snippet.rfind('items: [')
last_items_end = snippet.rfind(']', last_items_start)
end_context = snippet[last_items_end:last_items_end+50]
print(f'Last items end at offset {last_items_end} from G5 start')
print(f'Context after last items: {repr(end_context)}')
