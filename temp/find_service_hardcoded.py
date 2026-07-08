import os, re
hits = []
for root, dirs, files in os.walk('src/components/services'):
    for f in files:
        if f.endswith('.astro'):
            fp = os.path.join(root, f)
            with open(fp, 'r', encoding='utf-8') as fh:
                c = fh.read()
            for m in re.finditer(r'<h2[^>]*>([^<]{1,30}?)<span[^>]*class="gradient-text-accent"', c):
                prefix = m.group(1).strip()
                hits.append((f, prefix[:50]))
print(f'Found {len(hits)} hardcoded title prefixes:')
for f, prefix in hits:
    print(f'  {f}: "{prefix}"')
