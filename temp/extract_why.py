import re
with open('src/data/titanium-standards.ts','r',encoding='utf-8') as f:
    c = f.read()
texts = re.findall(r'whyChooseUs: "(.+?)"', c)
print(f'Found {len(texts)} whyChooseUs texts:')
seen = set()
for i, t in enumerate(texts):
    preview = t[:100].replace('\\n',' ')
    key = t[:50]
    if key not in seen:
        seen.add(key)
        print(f'  [{i}] {preview}...')
