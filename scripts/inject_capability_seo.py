#!/usr/bin/env python3
"""
inject_capability_seo.py — 将 445 个能力页面的 SEO 配置批量注入到 seo.ts。

用法:
  python scripts/inject_capability_seo.py
"""

import json, os, glob, re

CAPABILITIES_DIR = os.path.join(os.path.dirname(__file__), '..', 'src', 'content', 'capabilities')
SEO_TS_PATH = os.path.join(os.path.dirname(__file__), '..', 'src', 'config', 'seo.ts')


def load_capabilities():
    results = []
    for fpath in sorted(glob.glob(os.path.join(CAPABILITIES_DIR, '*.json'))):
        with open(fpath, encoding='utf-8') as f:
            data = json.load(f)
        slug = os.path.basename(fpath).replace('.json', '')
        title = data.get('seoTitle') or f"{data['title']} | Titanium CNC Machining | BOZE"
        desc = data.get('seoDescription') or (f"Precision {data.get('category', '').lower()} of {data['title']} titanium components. ISO 9001:2015 and AS9100D certified.")
        results.append((slug, title, desc))
    return results


def generate_entry_block(slug, title, description):
    t = title.replace("'", "\\'").replace('"', '\\"')
    d = description.replace("'", "\\'").replace('"', '\\"')
    return f"  '/capabilities/{slug}': {{\n    title: {{ en: '{t}' }},\n    description: {{ en: '{d}' }},\n  }},"


def main():
    print("=" * 60)
    print("SEO Config Injector for Capability Pages")
    print("=" * 60)

    caps = load_capabilities()
    print(f"\n📂 共 {len(caps)} 个能力条目")

    # 检查是否已注入过
    with open(SEO_TS_PATH, encoding='utf-8') as f:
        content = f.read()

    marker = "// ── Capability Pages (auto-generated) ──"
    if marker in content:
        print("   ⚠️  SEO 条目已存在，跳过")
        cap_count = len(re.findall(r"'/capabilities/(?!$)[^']+'", content))
        print(f"   已有 {cap_count} 个能力页面条目")
        return

    # 生成所有条目
    blocks = [generate_entry_block(s, t, d) for s, t, d in caps]
    inserted_block = f"\n{marker}\n" + "\n".join(blocks)

    # 找到 SEO_CONFIG 的末尾: 单独一行的 "};"
    lines = content.split('\n')
    closing_idx = None
    for i in range(len(lines) - 1, -1, -1):
        if lines[i].strip() == '};':
            closing_idx = i
            break

    if closing_idx is None:
        print("❌ 找不到 SEO_CONFIG 的结尾")
        return

    # 在最后一条条目后、}; 之前插入
    # 找到最后一个条目结束的索引（}; 之前的行）
    insert_before = closing_idx
    new_lines = lines[:insert_before] + [inserted_block] + lines[insert_before:]

    with open(SEO_TS_PATH, 'w', encoding='utf-8') as f:
        f.write('\n'.join(new_lines))

    new_line_count = len(new_lines)
    print(f"\n✅ 成功注入 {len(blocks)} 条 SEO 配置")
    print(f"   文件行数: {len(lines)} → {new_line_count}")


if __name__ == '__main__':
    main()
