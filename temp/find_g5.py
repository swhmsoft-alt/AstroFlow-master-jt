with open('src/data/titanium-grades.ts','r',encoding='utf-8') as f:
    content = f.read()

g5 = content.find('"grade-5"')
before = content.rfind('"grade-', 0, g5)
after = content.find('"grade-', g5 + 10)
print(f'Grade-5 at pos {g5}')
print(f'Before grade-5: {content[before:before+30]}')
print(f'After grade-5: {content[after:after+30]}')
snippet = content[g5:after]
print(f'Grade-5 section length: {len(snippet)}')
print(f'Last 200 chars: {repr(snippet[-200:])}')
