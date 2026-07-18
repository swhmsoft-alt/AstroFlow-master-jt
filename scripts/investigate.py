import os, glob, json

cap_dir = 'src/content/capabilities'

# Check for unusual chars
unusual = []
for f in sorted(glob.glob(cap_dir + '/*.json')):
    basename = os.path.basename(f)
    for ch in basename:
        if ord(ch) > 127 or ch in '!@#$%^&*()+=':
            unusual.append(basename)
            break
print(f'Unusual filenames: {len(unusual)}')
for u in unusual[:10]:
    print(f'  {u}')
print(f'Total cap files: {len(glob.glob(cap_dir + "/*.json"))}')

# Check standards dir
std_dir = 'src/content/standards'
if os.path.isdir(std_dir):
    files = os.listdir(std_dir)
    empty = len(files) == 0
    print(f'Standards dir: {len(files)} files (EMPTY={empty})')
else:
    print('Standards dir: DOES NOT EXIST')

# Check all capability slugs are valid
for f in glob.glob(cap_dir + '/*.json'):
    slug = os.path.splitext(os.path.basename(f))[0]
    if not slug or slug.startswith('.'):
        print(f'WARN: bad slug from {f}')

# Check one capability file content
sample = sorted(glob.glob(cap_dir + '/*.json'))[0]
with open(sample, 'r', encoding='utf-8') as fh:
    d = json.load(fh)
print(f'Sample cap: {os.path.basename(sample)} slug check - type of slug would be {sample.split(os.sep)[-1].replace(".json","")}')
