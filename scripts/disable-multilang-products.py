import os

d = 'src/pages/[lang]/products'

# Remove old files
for f in ['index.astro', '[...slug].astro']:
    fp = os.path.join(d, f)
    if os.path.exists(fp):
        os.remove(fp)
        print(f'Removed: {fp}')

# Write redirect stubs
content = """---
// Multilingual products disabled - English only.
// See /products/product-entities/ for the full component library.
export function getStaticPaths() { return []; }
---
<script>window.location.href="/products/";</script>
<p>Products are available in English only. <a href="/products/">Visit Products</a></p>
"""

with open(os.path.join(d, 'index.astro'), 'w', encoding='utf-8') as f:
    f.write(content)
    print('Written: index.astro')

with open(os.path.join(d, '[...slug].astro'), 'w', encoding='utf-8') as f:
    f.write(content)
    print('Written: [...slug].astro')

print('Done')
