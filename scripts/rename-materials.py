import json, os, glob

# Map current filenames (without .json) to new filenames based on title
def gen_slug(title):
    slug = title.lower()
    slug = slug.replace('\u00a0', ' ')
    slug = slug.replace('(', '').replace(')', '')
    slug = slug.replace('.', '')
    slug = slug.replace('/', '-')
    slug = slug.replace('--', '-')
    slug = slug.replace(' ', '-').replace('--', '-')
    slug = slug.strip('-')
    return slug

for f in sorted(glob.glob('src/content/materials/*.json')):
    d = json.load(open(f, 'r', encoding='utf-8'))
    old_name = os.path.basename(f)
    new_name = gen_slug(d['title']) + '.json'
    old_path = os.path.join('src/content/materials', old_name)
    new_path = os.path.join('src/content/materials', new_name)
    if old_name != new_name:
        os.rename(old_path, new_path)
        print(f'{old_name}  ->  {new_name}')
    else:
        print(f'{old_name}  (unchanged)')

print('\nDone')
