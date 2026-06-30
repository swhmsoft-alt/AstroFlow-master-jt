import subprocess
import json
import re

# Get the file from git directly as bytes
result = subprocess.run(['git', 'show', '78817173~1:_keys_en.json'], capture_output=True)
raw = result.stdout

# Decode as latin-1 (byte-preserving) and remove backspace artifacts
text = raw.decode('latin-1')
text = re.sub(r'.\x08', '', text)

d = json.loads(text)
keys = [k for k in d if k.startswith('nav.services.')]

# Write to file
with open('c:\\temp_nav_keys.txt', 'w', encoding='utf-8') as f:
    for k in sorted(keys):
        f.write(f"{k}={d[k]}\n")

print(f"Extracted {len(keys)} keys to c:\\temp_nav_keys.txt")