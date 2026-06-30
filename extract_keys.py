import subprocess
import json
import re
import sys

# Get the file from git directly as bytes
result = subprocess.run(['git', 'show', '78817173~1:_keys_en.json'], capture_output=True)
raw = result.stdout

# Decode as latin-1 (byte-preserving) and remove backspace artifacts
text = raw.decode('latin-1')
text = re.sub(r'.\x08', '', text)

try:
    d = json.loads(text)
except:
    try:
        # Try UTF-8
        text = raw.decode('utf-8', errors='replace')
        text = re.sub(r'.\x08', '', text)
        d = json.loads(text)
    except Exception as e:
        print(f"Error: {e}", file=sys.stderr)
        sys.exit(1)

keys = [k for k in d if k.startswith('nav.services.')]
for k in sorted(keys):
    # Escape the value properly for output
    v = d[k].replace('"', '\\"')
    print(f"{k}|{v}")