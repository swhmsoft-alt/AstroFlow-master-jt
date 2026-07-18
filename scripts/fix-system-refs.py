import json, glob, os
ent_dir = 'src/content/product-entities'
fixed = 0
for f in glob.glob(os.path.join(ent_dir, '*.json')):
    with open(f, 'r', encoding='utf-8') as fh:
        d = json.load(fh)
    if d.get('system') == 'Consumer Electronics':
        d['system'] = 'Premium Consumer Electronics & Wearables'
        with open(f, 'w', encoding='utf-8') as fh:
            json.dump(d, fh, indent=2, ensure_ascii=False)
        fixed += 1
        print(f'Fixed: {os.path.basename(f)}')
print(f'Total fixed: {fixed}')
