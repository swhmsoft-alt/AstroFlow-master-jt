"""Fix corrupted route keys in hero.ts and re-add service metrics"""
import json, os, shutil, glob

fp = r'C:\Users\Administrator\Desktop\AstroFlow-master-jt\src\config\hero.ts'

# First try to restore from the original backup if it exists
# Check if there's a backup before the svc script ran
backups = sorted(glob.glob(r'C:\Users\Administrator\Desktop\AstroFlow-master-jt\src\config\hero.ts*'))
print('Found backups:', backups)

# Find a clean backup (not svcbak which is also corrupted)
# Check if hero.ts is corrupted
with open(fp, 'r', encoding='utf-8') as f:
    content = f.read()

# Count total route definitions
route_count = content.count("},")
print(f'Total route blocks: {route_count}')

# Check for corrupted routes
corrupted = 0
for line in content.split('\n'):
    line = line.strip()
    if line.startswith("'/") and line.endswith("': {"):
        if 'titanium-cnc-machining-services' in line:
            if not line.startswith("'/titanium"):
                corrupted += 1
                print(f'  CORRUPTED: {line[:60]}')

print(f'Corrupted routes: {corrupted}')

# Fix corrupted routes - the leading character was eaten
content = content.replace("'c-machining-services", "'titanium-cnc-machining-services")
content = content.replace("'titanium-additive-manufacturing", "'/titanium-additive-manufacturing")

with open(fp, 'w', encoding='utf-8') as f:
    f.write(content)

print('Fixed!')
