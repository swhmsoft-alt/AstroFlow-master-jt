import os, re
base = 'src/components/services'
for fname in sorted(os.listdir(base)):
    if not fname.endswith('.astro'):
        continue
    fp = os.path.join(base, fname)
    with open(fp, 'r', encoding='utf-8') as f:
        c = f.read()
    # Find <h2 ...> lines
    for line in c.split('\n'):
        if '<h2' in line and '<span' in line:
            # Extract text between > and <span
            m = re.search(r'<h2[^>]*>([^<{]+)<span', line)
            if m:
                prefix = m.group(1).strip()
                if prefix:
                    print(f'{fname}: HARDCODED "{prefix}"')
            # Also check for patterns like "Our <span"
            if re.search(r'>[A-Z][a-z]+ [A-Z]', line):
                print(f'  LINE: {line.strip()[:80]}')
