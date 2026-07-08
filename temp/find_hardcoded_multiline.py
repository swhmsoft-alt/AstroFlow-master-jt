import os, re
base = 'src/components/services'
for fname in sorted(os.listdir(base)):
    if not fname.endswith('.astro'):
        continue
    fp = os.path.join(base, fname)
    with open(fp, 'r', encoding='utf-8') as f:
        c = f.read()
    # Find all h2 sections (multiline)
    for m in re.finditer(r'<h2[^>]*>.*?</h2>', c, re.DOTALL):
        section = m.group()
        # Extract all text nodes (not inside tags)
        text = re.sub(r'<[^>]+>', ' ', section)
        text = re.sub(r'\{t\([^)]+\)\}', ' ', text)
        text = ' '.join(text.split())
        if text.strip():
            print(f'{fname}: HARDCODED_TEXT_IN_H2: "{text.strip()}"')
