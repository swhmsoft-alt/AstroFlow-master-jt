import re
with open('src/data/titanium-standards.ts','r',encoding='utf-8') as f:
    c = f.read()

# Find all FAQ questions
questions = re.findall(r'question: "([^"]+)"', c)
unique = []
for q in questions:
    if q not in unique:
        unique.append(q)
        
print(f'Total FAQ questions: {len(questions)}, unique: {len(unique)}')
for i, q in enumerate(unique):
    print(f'  [{i}] {q[:80]}...')
