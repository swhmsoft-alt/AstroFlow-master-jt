"""Debug: check how data actually differs between pages."""
import json

# Waterjet cutting
w = json.load(open('src/content/capabilities/waterjet-cutting.json', encoding='utf-8'))
print('=== WATERJET CUTTING ===')
print('Title:', w['title'])
for row in w.get('processComparison', []):
    print(f'  {row["dimension"]}: {row["laser"][:40]} | {row["waterjet"][:40]}')
print('PD:', w.get('processDescription','')[:80])

print()

# Vacuum annealing
v = json.load(open('src/content/capabilities/vacuum-annealing.json', encoding='utf-8'))
print('=== VACUUM ANNEALING ===')
print('Title:', v['title'])
for row in v.get('processComparison', []):
    print(f'  {row["dimension"]}: {str(row.get("laser","N/A"))[:40]} | {str(row.get("waterjet","N/A"))[:40]}')
print('PD:', v.get('processDescription','')[:80])

print()

# The rendering issue
print('=== RENDERING BUG ===')
print('Astro模板MicroCapabilityPage.astro第213行硬编码:')
print('  <h2>{t("capabilities.processComparison.title")}</h2>')
print('  翻译映射: "Process Comparison: Laser vs. Waterjet" ')
print('')
print('第231-234行硬编码表头:')
print('  <th>{t("capabilities.processComparison.laser")}</th>  => "Laser Cutting"')
print('  <th>{t("capabilities.processComparison.waterjet")}</th> => "Waterjet Cutting"')
print('')
print('解决方案: 表头和数据都需要根据实际能力动态渲染')
