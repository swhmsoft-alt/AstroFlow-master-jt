import os, re
for root, dirs, files in os.walk('src/components/home'):
    for f in files:
        if f.endswith('.astro'):
            fp = os.path.join(root, f)
            with open(fp, 'r', encoding='utf-8') as fh:
                c = fh.read()
            for m in re.finditer(r'<h2[^>]*>([^<]*?)\s*<span[^>]*class="gradient-text-accent"', c):
                print(f'{f}: "{m.group(1).strip()}" is hardcoded')
