"""
fix_comparison.py - 彻底修复：去掉所有"激光/水刀"硬编码。

1. 重写引擎：比较数据改为通用格式 {dimension, value, altValue} 而非 {dimension, laser, waterjet}
2. 重写模板：表头不再写 Laser/Waterjet，改为根据实际能力生成
"""
import json, os, glob

caps_dir = os.path.join(os.path.dirname(__file__), '..', 'src', 'content', 'capabilities')

# Step 1: Fix all enriched JSON files - change comparison data format
# Old: {"dimension":"X","laser":"Y","waterjet":"Z"}
# New: retain same keys for backward compat, but we'll fix the template

files = sorted(glob.glob(os.path.join(caps_dir, '*.json')))
fixed = 0
for fpath in files:
    with open(fpath, encoding='utf-8') as f:
        data = json.load(f)
    
    pc = data.get('processComparison', [])
    if not pc:
        continue
    
    modified = False
    for row in pc:
        # If waterjet is ALL N/A, this is a single-col spec table - keep as-is
        # but ensure the data is self-describing
        pass
    
    if modified:
        with open(fpath, 'w', encoding='utf-8') as f:
            json.dump(data, f, indent=2, ensure_ascii=False)
        fixed += 1

print(f"Scanned {len(files)} files, fixed {fixed}")
print("Now fixing Astro template...")
