import json, subprocess, re

# Get the file from git directly
result = subprocess.run(['git', 'show', '78817173~1:_keys_en.json'], capture_output=True)
raw_data = result.stdout

# Try to decode, stripping problematic control characters
data = raw_data.decode('utf-8', errors='replace')
# Remove backspace artifacts (backspace + following char)
data = re.sub(r'[\x08].', '', data)

d = json.loads(data)
keys = [k for k in d if k.startswith('nav.services.')]
for k in sorted(keys):
    print(f'{k}: {d[k]}')