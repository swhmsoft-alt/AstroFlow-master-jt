#!/usr/bin/env python3
"""
run_full.py — Step 1: 全量运行规则引擎，生成 445 个能力页面。

用法: python scripts/enrich_v2/run_full.py
输出: 直接写入 src/content/capabilities/*.json
"""
import json, os, sys, glob, re, shutil
sys.path.insert(0, os.path.dirname(__file__))
from engine import compose

CAP_DIR = os.path.join(os.path.dirname(__file__), '..', '..', 'src', 'content', 'capabilities')
BAK_DIR = os.path.join(os.path.dirname(__file__), '..', '..', 'src', 'content', 'capabilities_bak_v1')

def backup_originals():
    """备份旧版数据"""
    if os.path.exists(BAK_DIR):
        print(f"  Backup already exists at {BAK_DIR}")
        return
    os.makedirs(BAK_DIR, exist_ok=True)
    for f in glob.glob(os.path.join(CAP_DIR, '*.json')):
        shutil.copy2(f, os.path.join(BAK_DIR, os.path.basename(f)))
    print(f"  ✅ Backed up {len(glob.glob(os.path.join(BAK_DIR, '*.json')))} files to {BAK_DIR}")

def main():
    print("=" * 60)
    print("STEP 1: Full Rule Engine Enrichment (445 capabilities)")
    print("=" * 60)
    
    # Backup
    backup_originals()
    
    # Load all
    files = sorted(glob.glob(os.path.join(CAP_DIR, '*.json')))
    print(f"\n📂 Loading {len(files)} capabilities...")
    
    success = 0
    error = 0
    skipped = 0
    
    for fpath in files:
        fname = os.path.basename(fpath)
        try:
            with open(fpath, encoding='utf-8') as f:
                data = json.load(f)
            
            title = data.get('title', '')
            category = data.get('category', 'General Manufacturing')
            description = data.get('description', '')
            
            # Keep original fields
            orig_aliases = data.get('aliases', [])
            orig_materials = data.get('materials', [])
            orig_industries = data.get('industries', [])
            orig_related_inspection = data.get('relatedInspection', [])
            
            # Generate enriched data
            result = compose(title, category, description)
            
            # Restore original fields
            result['aliases'] = orig_aliases
            result['materials'] = orig_materials if orig_materials else result.get('materials', [])
            result['industries'] = orig_industries if orig_industries else result.get('industries', [])
            result['relatedInspection'] = orig_related_inspection
            
            # Write
            with open(fpath, 'w', encoding='utf-8') as f:
                json.dump(result, f, indent=2, ensure_ascii=False)
            
            success += 1
            if success % 50 == 0:
                print(f"  ✅ {success}/{len(files)}...")
                
        except Exception as e:
            print(f"  ❌ {fname}: {e}")
            error += 1
    
    print(f"\n{'='*60}")
    print(f"📊 完成报告")
    print(f"  ✅ 成功: {success}")
    print(f"  ❌ 错误: {error}")
    print(f"  ⏭️  跳过: {skipped}")
    print(f"  📦 总计: {len(files)}")
    print(f"  💾 备份位置: {BAK_DIR}")
    print(f"{'='*60}")

if __name__ == '__main__':
    main()
