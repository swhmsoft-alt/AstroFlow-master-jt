import json
import subprocess

# 从 git 历史中获取上一个版本的 en.json（提交 78817173 的父级）
result = subprocess.run(['git', 'show', '78817173~1:src/i18n/translations/en.json'], capture_output=True)
old_en = json.loads(result.stdout)

# 获取当前 en.json
current = json.load(open('src/i18n/translations/en.json', encoding='utf-8'))

# 找出旧版本中所有 nav.* 键
old_nav_keys = {k: v for k, v in old_en.items() if k.startswith('nav.')}

# 统计
added = 0
skipped = 0

# 按 Header.astro 中的引用顺序恢复
# 1. 顶层导航键 (navKeyByHref)
top_level = {
    'nav.capabilities': 'Capabilities',
    'nav.industries': 'Industries',
    'nav.resources': 'Resources',
    'nav.products': 'Products',
}

# 2. 所有子导航键 (childNavKeyByHref + navHeadingKeyByParent)
child_keys = {
    # Materials 子项
    'nav.materials.grade5': 'Grade 5 Titanium (Ti-6Al-4V)',
    'nav.materials.grade23': 'Grade 23 Titanium (Ti-6Al-4V ELI)',
    'nav.materials.grade2': 'Grade 2 Titanium',
    'nav.materials.grade1': 'Grade 1 Titanium',
    'nav.materials.grade4': 'Grade 4 Titanium',
    'nav.materials.grade9': 'Grade 9 Titanium',
    'nav.materials.grade12': 'Grade 12 Titanium',
    'nav.materials.alloyComparison': 'Titanium Alloy Comparison',
    # Capabilities 子项
    'nav.capabilities.manufacturing': 'Manufacturing Capabilities',
    'nav.capabilities.engineering': 'Engineering Support',
    'nav.capabilities.capacity': 'Production Capacity',
    'nav.capabilities.quality': 'Quality Assurance',
    'nav.capabilities.inspection': 'Inspection & Testing',
    'nav.capabilities.traceability': 'Material Traceability',
    'nav.capabilities.certifications': 'Certifications',
    # Industries 子项
    'nav.industries.aerospace': 'Aerospace',
    'nav.industries.medical': 'Medical',
    'nav.industries.uavDrones': 'UAV & Drones',
    'nav.industries.aiInfrastructure': 'AI Infrastructure & Optical Comms',
    'nav.industries.marine': 'Marine',
    'nav.industries.semiconductor': 'Semiconductor',
    'nav.industries.energy': 'Energy',
    'nav.industries.industrialEquipment': 'Industrial Equipment',
    # Resources 子项
    'nav.resources.knowledgeBase': 'Titanium Knowledge Base',
    'nav.resources.gradesGuide': 'Titanium Grades Guide',
    'nav.resources.designGuides': 'Design & Engineering Guides',
    'nav.resources.insights': 'Manufacturing Insights',
    'nav.resources.applications': 'Industry Applications',
    'nav.resources.caseStudies': 'Case Studies',
    'nav.resources.faqs': 'FAQs',
    'nav.resources.downloads': 'Downloads',
    # Blog
    'nav.blog': 'Blog',
}

# 合并所有需要添加的键
all_needed = {}
all_needed.update(top_level)
all_needed.update(child_keys)

print("=== 恢复缺失的导航翻译键 ===\n")

# 优先从旧版本取值
for key in all_needed:
    if key not in current:
        if key in old_nav_keys:
            # 从旧版本恢复
            current[key] = old_nav_keys[key]
            source = "git history"
        else:
            # 使用默认值
            current[key] = all_needed[key]
            source = "default"
        added += 1
        print(f"  ADDED [{source}]: {key} = {current[key]}")
    else:
        skipped += 1

print(f"\n=== 结果 ===")
print(f"新增: {added} 个键")
print(f"已存在: {skipped} 个键")
print(f"当前 nav.* 键总数: {len([k for k in current if k.startswith('nav.')])}")

# 写回 en.json
with open('src/i18n/translations/en.json', 'w', encoding='utf-8') as f:
    json.dump(current, f, indent=2, ensure_ascii=False)

print("\nen.json 更新完成！")